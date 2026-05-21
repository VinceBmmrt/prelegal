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

## Implementation Status

### What is built
- **One document only**: Accord de Confidentialité Mutuel (French NDA)
- **AI chat**: `ChatPanel` streams SSE tokens from `POST /api/chat`, then receives structured `NdaFieldsPartial` fields — live-updates the preview
- **NDA preview**: `NdaPreview` renders the full document with filled fields; PDF download via jsPDF + html2canvas
- **Auth endpoints** (backend only, no UI yet): `POST /api/auth/signup` → 201 + JWT, `POST /api/auth/signin` → 200 + JWT
- **No document persistence** — fields live in React state only, reset on page reload
- **No document selection UI** — catalog.json templates exist but only ACNM is wired up

### What is NOT built yet
- Auth UI (sign in / sign up screens)
- Document persistence (save/load drafts)
- Multi-document support (only ACNM today)
- User sessions / protected routes
