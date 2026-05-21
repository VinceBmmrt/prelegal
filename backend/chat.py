import json
import os
from typing import Any

from dotenv import load_dotenv
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from litellm import completion
from pydantic import BaseModel

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

router = APIRouter()

MODEL = "openrouter/openai/gpt-oss-120b"
EXTRA_BODY = {"provider": {"order": ["cerebras"]}}

SYSTEM_PROMPT = """Tu es un assistant juridique spécialisé dans la rédaction d'Accords de Confidentialité Mutuels (ACNM) en droit français.

Tu aides l'utilisateur à remplir les champs suivants de l'accord :
- Objet : Comment les informations confidentielles peuvent être utilisées
- Date d'entrée en vigueur
- Durée de l'ACNM : soit un nombre d'années fixe, soit "jusqu'à résiliation"
- Durée de confidentialité : soit un nombre d'années fixe, soit "perpétuelle"
- Modifications éventuelles des conditions standard
- Partie 1 et Partie 2 : Nom, Titre, Société, Adresse de notification, Date de signature

Conduis une conversation naturelle et amicale en français. Pose les questions de façon conversationnelle, une thématique à la fois. Ne pose pas toutes les questions en même temps. Confirme ce que tu as compris avant de passer à la suite.

Si c'est le premier message (messages vides), présente-toi brièvement et commence par demander l'objet de l'accord."""


class NdaPartyPartial(BaseModel):
    nom: str | None = None
    titre: str | None = None
    societe: str | None = None
    adresse: str | None = None
    date: str | None = None


class NdaFieldsPartial(BaseModel):
    objet: str | None = None
    dateEntreeEnVigueur: str | None = None
    dureeNda: str | None = None
    dureeNdaYears: int | None = None
    dureeConfidentialite: str | None = None
    dureeConfidentialiteYears: int | None = None
    modifications: str | None = None
    partie1: NdaPartyPartial | None = None
    partie2: NdaPartyPartial | None = None


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    current_fields: dict[str, Any]


def _build_extraction_prompt(messages: list[ChatMessage], current_fields: dict) -> str:
    history = "\n".join(f"{m.role}: {m.content}" for m in messages)
    return f"""En te basant sur la conversation ci-dessous, extrais les valeurs des champs de l'ACNM qui ont été déterminées.
Ne retourne que les champs explicitement mentionnés ou confirmés. Utilise null pour les champs non encore abordés.
Les dates doivent être au format ISO (YYYY-MM-DD). dureeNda doit être "fixed" ou "until_terminated". dureeConfidentialite doit être "fixed" ou "perpetual".

Champs actuels : {json.dumps(current_fields, ensure_ascii=False)}

Conversation :
{history}"""


@router.post("/chat")
async def chat(request: ChatRequest):
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages += [{"role": m.role, "content": m.content} for m in request.messages]

    async def generate():
        full_response = ""

        # Phase 1: stream the reply
        stream = completion(
            model=MODEL,
            messages=messages,
            reasoning_effort="low",
            extra_body=EXTRA_BODY,
            stream=True,
        )
        for chunk in stream:
            delta = chunk.choices[0].delta.content or ""
            if delta:
                full_response += delta
                yield f"data: {json.dumps({'type': 'token', 'content': delta})}\n\n"

        # Phase 2: extract structured fields
        extraction_messages = messages + [
            {"role": "assistant", "content": full_response},
            {"role": "user", "content": _build_extraction_prompt(
                request.messages + [ChatMessage(role="assistant", content=full_response)],
                request.current_fields,
            )},
        ]
        fields_response = completion(
            model=MODEL,
            messages=extraction_messages,
            response_format=NdaFieldsPartial,
            reasoning_effort="low",
            extra_body=EXTRA_BODY,
        )
        fields = NdaFieldsPartial.model_validate_json(
            fields_response.choices[0].message.content
        )
        yield f"data: {json.dumps({'type': 'fields', 'fields': fields.model_dump()})}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
