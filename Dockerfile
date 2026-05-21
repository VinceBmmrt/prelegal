# Stage 1: Build Next.js static frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
ENV NEXT_OUTPUT=export
RUN npm run build

# Stage 2: Python backend + static files
FROM python:3.12-slim
WORKDIR /app

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Install backend dependencies (copy lock files first for layer caching)
COPY backend/pyproject.toml backend/uv.lock backend/
RUN cd backend && uv sync --frozen --no-dev

# Copy backend source and static build
COPY backend/ backend/
COPY --from=frontend-builder /app/frontend/out/ static/

ENV DATABASE_PATH=/app/data/prelegal.db
ENV SECRET_KEY=change-me-in-production

WORKDIR /app/backend
EXPOSE 8000

CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
