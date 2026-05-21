#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
docker stop prelegal 2>/dev/null || true
docker rm prelegal 2>/dev/null || true
docker build -t prelegal .
docker run -d --name prelegal -p 8000:8000 prelegal
echo "Prelegal running at http://localhost:8000"
