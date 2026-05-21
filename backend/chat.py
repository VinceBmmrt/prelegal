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

SUPPORTED_DOCS = """- Accord de Confidentialité Mutuel (ACNM)
- Accord de Confidentialité Mutuel – Page de Couverture
- Contrat de Service Cloud (CSC)
- Accord sur les Niveaux de Service (ANS)
- Accord de Traitement des Données (ATD)
- Accord Partenaire Design
- Contrat de Services Professionnels (CSP)
- Accord de Partenariat
- Accord de Confidentialité – Données de Santé
- Contrat de Licence Logiciel
- Accord Pilote
- Avenant Intelligence Artificielle"""

_FOOTER = f"""
Conduis une conversation naturelle et amicale en français. Pose les questions de façon conversationnelle, une thématique à la fois. Ne pose pas toutes les questions en même temps. Confirme ce que tu as compris avant de passer à la suite.

Si c'est le premier message (messages vides), présente-toi brièvement et commence par demander les informations principales.

Si l'utilisateur mentionne un document que tu ne peux pas rédiger, explique poliment que tu es spécialisé dans les documents suivants et propose le plus adapté à son besoin :
{SUPPORTED_DOCS}"""


def _make_prompt(doc_name: str, fields_desc: str) -> str:
    return (
        f"Tu es un assistant juridique spécialisé dans la rédaction de {doc_name} en droit français.\n\n"
        f"Tu aides l'utilisateur à remplir les champs suivants :\n{fields_desc}\n"
        f"{_FOOTER}"
    )


# ── Field models ──────────────────────────────────────────────────────────────


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


class PartiePartial(BaseModel):
    nom: str | None = None
    societe: str | None = None
    adresse: str | None = None
    email: str | None = None


class CscFieldsPartial(BaseModel):
    prestataire: PartiePartial | None = None
    client: PartiePartial | None = None
    dateEntreeEnVigueur: str | None = None
    periodeAbonnement: str | None = None
    supportTechnique: str | None = None
    processusPaiement: str | None = None
    limitationsUtilisation: str | None = None
    montantPlafonne: str | None = None
    droitApplicable: str | None = None
    tribunauxCompetents: str | None = None


class AnsFieldsPartial(BaseModel):
    tauxDisponibiliteCible: str | None = None
    tempsReponseCible: str | None = None
    canalSupport: str | None = None
    creditDisponibilite: str | None = None
    creditTempsReponse: str | None = None
    arretsPlanifies: str | None = None
    periodeAbonnement: str | None = None


class AtdFieldsPartial(BaseModel):
    prestataire: PartiePartial | None = None
    client: PartiePartial | None = None
    dateEntreeEnVigueur: str | None = None
    categoriesDonnees: str | None = None
    categoriesPersonnes: str | None = None
    sousTraitantsApprouves: str | None = None
    contactSecurite: str | None = None


class ApdFieldsPartial(BaseModel):
    prestataire: PartiePartial | None = None
    partenaire: PartiePartial | None = None
    dateEntreeEnVigueur: str | None = None
    duree: str | None = None
    honoraires: str | None = None
    programme: str | None = None
    droitApplicable: str | None = None
    tribunauxCompetents: str | None = None


class CspFieldsPartial(BaseModel):
    prestataire: PartiePartial | None = None
    client: PartiePartial | None = None
    dateEntreeEnVigueur: str | None = None
    livrables: str | None = None
    honoraires: str | None = None
    delaiPaiement: str | None = None
    montantPlafonne: str | None = None
    droitApplicable: str | None = None
    tribunauxCompetents: str | None = None


class ApFieldsPartial(BaseModel):
    societe: PartiePartial | None = None
    partenaire: PartiePartial | None = None
    dateEntreeEnVigueur: str | None = None
    dateFin: str | None = None
    territoire: str | None = None
    obligations: str | None = None
    processusPaiement: str | None = None
    montantPlafonne: str | None = None
    droitApplicable: str | None = None


class AcdsFieldsPartial(BaseModel):
    prestataire: PartiePartial | None = None
    societe: PartiePartial | None = None
    dateEntreeEnVigueur: str | None = None
    delaiNotificationViolation: str | None = None
    limitations: str | None = None
    contratReference: str | None = None


class CllFieldsPartial(BaseModel):
    prestataire: PartiePartial | None = None
    client: PartiePartial | None = None
    dateEntreeEnVigueur: str | None = None
    periodeAbonnement: str | None = None
    utilisationsAutorisees: str | None = None
    processusPaiement: str | None = None
    limitesLicence: str | None = None
    periodeGarantie: str | None = None
    droitApplicable: str | None = None


class ApiloteFieldsPartial(BaseModel):
    prestataire: PartiePartial | None = None
    client: PartiePartial | None = None
    dateEntreeEnVigueur: str | None = None
    periodePilote: str | None = None
    montantPlafondGeneral: str | None = None
    droitApplicable: str | None = None
    tribunauxCompetents: str | None = None


class AiaFieldsPartial(BaseModel):
    prestataire: PartiePartial | None = None
    client: PartiePartial | None = None
    dateEntreeEnVigueur: str | None = None
    donneesEntrainement: str | None = None
    finalitesEntrainement: str | None = None
    restrictionsEntrainement: str | None = None
    restrictionsAmelioration: str | None = None


# ── Document registry ─────────────────────────────────────────────────────────

_ACNM_CONSTRAINTS = 'dureeNda doit être "fixed" ou "until_terminated". dureeConfidentialite doit être "fixed" ou "perpetual".'

DOC_REGISTRY: dict[str, dict] = {
    "Accord-de-Confidentialite-Mutuel": {
        "name": "Accord de Confidentialité Mutuel",
        "model": NdaFieldsPartial,
        "constraints": _ACNM_CONSTRAINTS,
        "system_prompt": _make_prompt(
            "l'Accord de Confidentialité Mutuel (ACNM)",
            "- Objet : comment les informations confidentielles peuvent être utilisées\n"
            "- Date d'entrée en vigueur\n"
            "- Durée de l'ACNM : soit un nombre d'années fixe, soit \"jusqu'à résiliation\"\n"
            "- Durée de confidentialité : soit un nombre d'années fixe, soit \"perpétuelle\"\n"
            "- Modifications éventuelles des conditions standard\n"
            "- Partie 1 et Partie 2 : Nom, Titre, Société, Adresse, Date de signature",
        ),
    },
    "Accord-de-Confidentialite-Mutuel-Page-de-Couverture": {
        "name": "Accord de Confidentialité Mutuel – Page de Couverture",
        "model": NdaFieldsPartial,
        "constraints": _ACNM_CONSTRAINTS,
        "system_prompt": _make_prompt(
            "la page de couverture de l'Accord de Confidentialité Mutuel",
            "- Partie 1 et Partie 2 : Nom, Titre, Société, Adresse, Date de signature\n"
            "- Date d'entrée en vigueur\n"
            "- Durée de l'ACNM et durée de confidentialité\n"
            "- Objet de l'accord",
        ),
    },
    "Contrat-de-Service-Cloud": {
        "name": "Contrat de Service Cloud (CSC)",
        "model": CscFieldsPartial,
        "constraints": "",
        "system_prompt": _make_prompt(
            "le Contrat de Service Cloud (CSC)",
            "- Prestataire : nom, société, adresse, email\n"
            "- Client : nom, société, adresse, email\n"
            "- Date d'entrée en vigueur\n"
            "- Période d'abonnement\n"
            "- Support technique inclus\n"
            "- Processus de paiement\n"
            "- Limitations d'utilisation\n"
            "- Montant plafonné de responsabilité\n"
            "- Droit applicable et tribunaux compétents",
        ),
    },
    "Accord-sur-les-Niveaux-de-Service": {
        "name": "Accord sur les Niveaux de Service (ANS)",
        "model": AnsFieldsPartial,
        "constraints": "",
        "system_prompt": _make_prompt(
            "l'Accord sur les Niveaux de Service (ANS / SLA)",
            "- Taux de disponibilité cible (ex. 99,9 %)\n"
            "- Temps de réponse cible du support (ex. 4h)\n"
            "- Canal de support (email, téléphone, ticketing…)\n"
            "- Crédit de disponibilité en cas de non-respect (% de remise)\n"
            "- Crédit de temps de réponse\n"
            "- Arrêts planifiés (fenêtres de maintenance)\n"
            "- Période d'abonnement couverte",
        ),
    },
    "Accord-de-Traitement-des-Donnees": {
        "name": "Accord de Traitement des Données (ATD)",
        "model": AtdFieldsPartial,
        "constraints": "",
        "system_prompt": _make_prompt(
            "l'Accord de Traitement des Données (ATD / DPA)",
            "- Prestataire : nom, société, contact sécurité\n"
            "- Client : nom, société\n"
            "- Date d'entrée en vigueur\n"
            "- Catégories de données personnelles traitées\n"
            "- Catégories de personnes concernées\n"
            "- Sous-traitants ultérieurs approuvés\n"
            "- Contact sécurité du prestataire",
        ),
    },
    "Accord-Partenaire-Design": {
        "name": "Accord Partenaire Design",
        "model": ApdFieldsPartial,
        "constraints": "",
        "system_prompt": _make_prompt(
            "l'Accord Partenaire Design",
            "- Prestataire : nom, société, adresse\n"
            "- Partenaire design : nom, société, adresse\n"
            "- Date d'entrée en vigueur\n"
            "- Durée du partenariat\n"
            "- Honoraires ou conditions de rémunération\n"
            "- Description du programme de design\n"
            "- Droit applicable et tribunaux compétents",
        ),
    },
    "Contrat-de-Services-Professionnels": {
        "name": "Contrat de Services Professionnels (CSP)",
        "model": CspFieldsPartial,
        "constraints": "",
        "system_prompt": _make_prompt(
            "le Contrat de Services Professionnels (CSP)",
            "- Prestataire : nom, société, adresse\n"
            "- Client : nom, société, adresse\n"
            "- Date d'entrée en vigueur\n"
            "- Livrables attendus\n"
            "- Honoraires\n"
            "- Délai de paiement\n"
            "- Montant plafonné de responsabilité\n"
            "- Droit applicable et tribunaux compétents",
        ),
    },
    "Accord-de-Partenariat": {
        "name": "Accord de Partenariat",
        "model": ApFieldsPartial,
        "constraints": "",
        "system_prompt": _make_prompt(
            "l'Accord de Partenariat",
            "- Société : nom, adresse\n"
            "- Partenaire : nom, adresse\n"
            "- Date d'entrée en vigueur\n"
            "- Date de fin du partenariat\n"
            "- Territoire couvert\n"
            "- Obligations de chaque partie\n"
            "- Processus de paiement\n"
            "- Montant plafonné de responsabilité\n"
            "- Droit applicable",
        ),
    },
    "Accord-de-Confidentialite-Donnees-de-Sante": {
        "name": "Accord de Confidentialité – Données de Santé",
        "model": AcdsFieldsPartial,
        "constraints": "",
        "system_prompt": _make_prompt(
            "l'Accord de Confidentialité pour les Données de Santé",
            "- Prestataire : nom, société, contact DPD\n"
            "- Société (responsable de traitement) : nom\n"
            "- Date d'entrée en vigueur\n"
            "- Délai de notification de violation (ex. 72h)\n"
            "- Limitations sur le traitement des données\n"
            "- Référence au contrat principal",
        ),
    },
    "Contrat-de-Licence-Logiciel": {
        "name": "Contrat de Licence Logiciel",
        "model": CllFieldsPartial,
        "constraints": "",
        "system_prompt": _make_prompt(
            "le Contrat de Licence Logiciel",
            "- Prestataire (éditeur) : nom, société, adresse\n"
            "- Client : nom, société, adresse\n"
            "- Date d'entrée en vigueur\n"
            "- Période d'abonnement\n"
            "- Utilisations autorisées\n"
            "- Processus de paiement\n"
            "- Limites de licence (nombre d'utilisateurs, etc.)\n"
            "- Période de garantie\n"
            "- Droit applicable",
        ),
    },
    "Accord-Pilote": {
        "name": "Accord Pilote",
        "model": ApiloteFieldsPartial,
        "constraints": "",
        "system_prompt": _make_prompt(
            "l'Accord Pilote",
            "- Prestataire : nom, société, adresse\n"
            "- Client : nom, société, adresse\n"
            "- Date d'entrée en vigueur\n"
            "- Durée de la période pilote\n"
            "- Montant du plafond général de responsabilité\n"
            "- Droit applicable et tribunaux compétents",
        ),
    },
    "Avenant-IA": {
        "name": "Avenant Intelligence Artificielle",
        "model": AiaFieldsPartial,
        "constraints": "",
        "system_prompt": _make_prompt(
            "l'Avenant Intelligence Artificielle",
            "- Prestataire : nom, société\n"
            "- Client : nom, société\n"
            "- Date d'entrée en vigueur\n"
            "- Données d'entraînement : types de données utilisées\n"
            "- Finalités d'entraînement autorisées\n"
            "- Restrictions d'entraînement\n"
            "- Restrictions d'amélioration du modèle",
        ),
    },
}

DEFAULT_DOC_TYPE = "Accord-de-Confidentialite-Mutuel"


# ── Request model ─────────────────────────────────────────────────────────────


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    current_fields: dict[str, Any]
    document_type: str = DEFAULT_DOC_TYPE


# ── Helpers ───────────────────────────────────────────────────────────────────


def _build_extraction_prompt(
    messages: list[ChatMessage],
    current_fields: dict,
    doc_name: str,
    constraints: str,
) -> str:
    history = "\n".join(f"{m.role}: {m.content}" for m in messages)
    constraint_text = f"\n{constraints}" if constraints else ""
    return (
        f"En te basant sur la conversation ci-dessous, extrais les valeurs des champs du {doc_name} qui ont été déterminées.\n"
        f"Ne retourne que les champs explicitement mentionnés ou confirmés. Utilise null pour les champs non encore abordés.\n"
        f"Les dates doivent être au format ISO (YYYY-MM-DD).{constraint_text}\n\n"
        f"Champs actuels : {json.dumps(current_fields, ensure_ascii=False)}\n\n"
        f"Conversation :\n{history}"
    )


# ── Endpoint ──────────────────────────────────────────────────────────────────


@router.post("/chat")
async def chat(request: ChatRequest):
    doc_info = DOC_REGISTRY.get(request.document_type, DOC_REGISTRY[DEFAULT_DOC_TYPE])
    system_prompt = doc_info["system_prompt"]
    fields_model = doc_info["model"]
    doc_name = doc_info["name"]
    constraints = doc_info.get("constraints", "")

    messages = [{"role": "system", "content": system_prompt}]
    messages += [{"role": m.role, "content": m.content} for m in request.messages]

    async def generate():
        full_response = ""

        # Phase 1: stream the conversational reply
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
            {
                "role": "user",
                "content": _build_extraction_prompt(
                    request.messages + [ChatMessage(role="assistant", content=full_response)],
                    request.current_fields,
                    doc_name,
                    constraints,
                ),
            },
        ]
        fields_response = completion(
            model=MODEL,
            messages=extraction_messages,
            response_format=fields_model,
            reasoning_effort="low",
            extra_body=EXTRA_BODY,
        )
        fields = fields_model.model_validate_json(
            fields_response.choices[0].message.content
        )
        yield f"data: {json.dumps({'type': 'fields', 'fields': fields.model_dump()})}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
