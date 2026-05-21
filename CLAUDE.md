# Prelegal Project

## Overview

SaaS product to draft legal agreements via AI chat. The user chats with an AI assistant which fills in the document fields live. Available documents are in `catalog.json`.

## Development process

When instructed to build a feature:
1. Use your Atlassian tools to read the feature instructions from Jira
2. Develop the feature - do not skip any step from the feature-dev 7 step process
3. Thoroughly test the feature with unit tests and integration tests and fix any issues
4. Submit a PR using your github tools

## AI design

Use LiteLLM via OpenRouter to `openrouter/openai/gpt-oss-120b` with Cerebras as inference provider. Use Structured Outputs to extract and populate document fields.

`OPENROUTER_API_KEY` is in `.env` at project root (never baked into Docker image — passed at runtime via `--env-file .env`).

## Technical design

- **Backend**: `backend/` — FastAPI, uv project (`package = false`), SQLite (fresh per container start)
- **Frontend**: `frontend/` — Next.js 16, statically exported (`NEXT_OUTPUT=export`), served by FastAPI
- **Auth**: `bcrypt` directly (not passlib — incompatible with bcrypt≥4), `python-jose` JWT, 24h expiry
- **Docker**: multi-stage build — Node builds frontend to `out/`, Python/uv serves backend + static files

### Start/stop scripts
```
scripts/start-mac.sh      scripts/stop-mac.sh
scripts/start-linux.sh    scripts/stop-linux.sh
scripts/start-windows.ps1 scripts/stop-windows.ps1
```

**Mac/Linux**: http://localhost:8000  
**Windows**: http://localhost:8080 — Docker Desktop HNS proxy blocks port 8000 on this machine; `start-windows.ps1` maps `8080:8000`

## Color Scheme
- Accent Yellow: `#ecad0a`
- Blue Primary: `#209dd7`
- Purple Secondary: `#753991` (submit buttons)
- Dark Navy: `#032147` (headings)
- Gray Text: `#888888`

## Multi-document architecture

### Document type key
Derived from `catalog.json` filename: `docTypeKey("fr/Accord-de-Confidentialite-Mutuel.md")` → `"Accord-de-Confidentialite-Mutuel"`. Frontend sends this as `document_type` in every `/api/chat` request.

### Backend registry (`backend/chat.py`)
`DOC_REGISTRY` maps each doc type key to `{name, model, system_prompt, constraints}`. The endpoint dispatches to the correct Pydantic model and system prompt automatically. Adding a new document type = add one entry to `DOC_REGISTRY` + one Pydantic model.

### Frontend document flow
`DocumentSelector` (selection grid) → `DocumentGenerator` (owns field state) → conditionally renders:
- `NdaPreview` for ACNM (full JSX document preview)
- `GenericDocumentPreview` for all other docs (field summary card)

Field state is `Record<string, unknown>` — deep-merged on each AI response.

## Auth & persistence

- **Token storage**: `localStorage` key `prelegal_token`; `frontend/lib/auth.ts` exports `getToken`, `setToken`, `clearToken`, `authHeaders`
- **AuthContext**: `frontend/contexts/AuthContext.tsx` — verifies token via `GET /api/auth/me` on mount; provides `user`, `loading`, `login`, `signup`, `logout`
- **Protected routes**: `app/page.tsx` redirects to `/auth/signin` if not authenticated
- **Document persistence**: `backend/documents.py` — `POST /api/documents`, `GET /api/documents`, `DELETE /api/documents/{id}`; stored in SQLite `documents` table (fields as JSON string); resets on container restart

## Implementation Status

### What is built
- **All 12 French document types** from `catalog.json/templates_fr` — each with a tailored AI system prompt and Pydantic field model
- **Document selection screen**: grid of 12 document cards; selecting one opens the chat/preview layout
- **AI chat**: `ChatPanel` streams SSE tokens from `POST /api/chat`, then receives structured fields — live-updates the preview
- **ACNM preview**: `NdaPreview` renders the full NDA with filled fields; PDF download via jsPDF + html2canvas
- **Generic preview**: `GenericDocumentPreview` shows a field-summary card for non-ACNM documents
- **AI disclaimer**: both preview components show "Ce document est un projet de rédaction produit par IA…" at the bottom
- **Auth UI**: `/auth/signin` and `/auth/signup` pages with email/password forms; protected routes redirect unauthenticated users
- **App header**: `AppHeader` shows branding + logged-in user email + logout button
- **Home view**: `HomeView` shows hero CTA + saved documents grid (fetched from API); delete button on hover
- **Document persistence**: save button in `DocumentGenerator` posts to `/api/documents`; saved documents appear on home and can be re-opened
- **User sessions / protected routes**: JWT in localStorage, AuthContext verifies on mount

### What is NOT built yet
- Full JSX previews for the 11 non-ACNM document types (they use the generic field summary card)
