$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")

# Stop and remove any existing container
docker stop prelegal 2>$null
docker rm prelegal 2>$null

docker build -t prelegal .
docker run -d --name prelegal -p 8000:8000 prelegal
Write-Host "Prelegal running at http://localhost:8000"
