# Prelegal

**Rédaction de documents juridiques français, assistée par IA.**

[Vidéo de démonstration](https://drive.google.com/file/d/1ZlM-XBUGe88TN-DxvhxOm5Z4xBmLVPT0/view?usp=sharing)

---

## Français

### Présentation

Prelegal est une application SaaS qui permet de rédiger des documents juridiques professionnels en français grâce à un assistant IA. L'utilisateur discute avec l'assistant dans un chat, qui remplit les champs du document en temps réel. Le résultat peut être sauvegardé et téléchargé en PDF.

### Fonctionnalités

- **12 types de documents juridiques français** : NDA mutuel, Contrat de service cloud, Accord de traitement des données (RGPD), Contrat de licence logiciel, Accord pilote, Avenant IA, et plus encore
- **Chat IA guidé** : l'assistant pose des questions étape par étape et remplit le document automatiquement
- **Aperçu en temps réel** : le document se met à jour à chaque réponse de l'IA
- **Sauvegarde et reprise** : les documents sont sauvegardés par compte utilisateur
- **Export PDF** : impression native via le navigateur (qualité maximale, toutes les CSS supportées)
- **Authentification** : inscription / connexion par email et mot de passe, sessions JWT 24h

### Stack technique

| Couche | Technologie |
|--------|-------------|
| Backend | FastAPI (Python), SQLite, bcrypt, python-jose |
| Frontend | Next.js 16 (export statique), Tailwind CSS v4 |
| IA | LiteLLM → OpenRouter → GPT-o3 (inférence Cerebras) |
| Auth | JWT 24h, stockage localStorage |
| Déploiement | Docker multi-stage (Node build + Python/uv serve) |

### Lancer l'application

**Prérequis** : Docker Desktop installé, fichier `.env` à la racine avec `OPENROUTER_API_KEY`.

```bash
# macOS
./scripts/start-mac.sh

# Linux
./scripts/start-linux.sh

# Windows (PowerShell)
./scripts/start-windows.ps1
```

- **Mac / Linux** : [http://localhost:8000](http://localhost:8000)
- **Windows** : [http://localhost:8080](http://localhost:8080) *(le proxy HNS de Docker Desktop bloque le port 8000)*

Pour arrêter :

```bash
./scripts/stop-mac.sh      # macOS
./scripts/stop-linux.sh    # Linux
./scripts/stop-windows.ps1 # Windows
```

> La base de données SQLite est réinitialisée à chaque redémarrage du conteneur.

### Structure du projet

```
prelegal/
├── backend/          # API FastAPI (auth, chat IA, documents)
├── frontend/         # Next.js (chat, preview, auth)
├── scripts/          # Scripts start/stop par OS
├── catalog.json      # 12 templates de documents juridiques
└── Dockerfile        # Build multi-stage
```

---

## English

### Overview

Prelegal is a SaaS application for drafting professional French legal documents using an AI assistant. Users chat with the assistant, which fills in document fields in real time. Documents can be saved and downloaded as PDF.

### Features

- **12 French legal document types**: mutual NDA, cloud service agreement, data processing agreement (GDPR), software licence, pilot agreement, AI addendum, and more
- **Guided AI chat**: the assistant asks questions step by step and populates the document automatically
- **Live preview**: the document updates with every AI response
- **Save & resume**: documents are persisted per user account
- **PDF export**: native browser print (full CSS support, no canvas limitations)
- **Authentication**: email/password sign-up and login, 24h JWT sessions

### Tech stack

| Layer | Technology |
|-------|------------|
| Backend | FastAPI (Python), SQLite, bcrypt, python-jose |
| Frontend | Next.js 16 (static export), Tailwind CSS v4 |
| AI | LiteLLM → OpenRouter → GPT-o3 (Cerebras inference) |
| Auth | 24h JWT, localStorage |
| Deployment | Multi-stage Docker (Node build + Python/uv serve) |

### Running the app

**Prerequisites**: Docker Desktop, a `.env` file at the project root containing `OPENROUTER_API_KEY`.

```bash
# macOS
./scripts/start-mac.sh

# Linux
./scripts/start-linux.sh

# Windows (PowerShell)
./scripts/start-windows.ps1
```

- **Mac / Linux**: [http://localhost:8000](http://localhost:8000)
- **Windows**: [http://localhost:8080](http://localhost:8080) *(Docker Desktop HNS proxy blocks port 8000)*

To stop:

```bash
./scripts/stop-mac.sh      # macOS
./scripts/stop-linux.sh    # Linux
./scripts/stop-windows.ps1 # Windows
```

> The SQLite database resets on every container restart.

### Project structure

```
prelegal/
├── backend/          # FastAPI API (auth, AI chat, documents)
├── frontend/         # Next.js (chat, preview, auth)
├── scripts/          # Per-OS start/stop scripts
├── catalog.json      # 12 legal document templates
└── Dockerfile        # Multi-stage build
```

---

*Prelegal produces AI-drafted documents. Always have them reviewed by a qualified legal professional before use.*
