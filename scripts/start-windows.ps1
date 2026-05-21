$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")

# Stop and remove any existing container (ignore errors if not running)
try { docker stop prelegal 2>$null } catch {}
try { docker rm prelegal 2>$null } catch {}

docker build -t prelegal .
docker run -d --name prelegal -p 8080:8000 --env-file .env prelegal
Write-Host "Prelegal running at http://localhost:8080"
