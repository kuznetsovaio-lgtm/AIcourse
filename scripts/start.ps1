param(
    [string]$ImageName = "ai-course-mvp",
    [string]$ContainerName = "ai-course-mvp",
    [int]$Port = 8000
)

$ErrorActionPreference = "Stop"
$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$envFile = Join-Path $projectRoot ".env"

Write-Host "Building Docker image $ImageName from $projectRoot"
docker build -t $ImageName $projectRoot

Write-Host "Removing existing container if present"
try {
    docker rm -f $ContainerName | Out-Null
} catch {
    Write-Host "No existing container named $ContainerName"
}

$runArgs = @(
    "run",
    "-d",
    "--name", $ContainerName,
    "-p", "${Port}:8000"
)

if (Test-Path $envFile) {
    $runArgs += @("--env-file", $envFile)
}

$runArgs += $ImageName

Write-Host "Starting container $ContainerName on http://localhost:$Port"
docker @runArgs
