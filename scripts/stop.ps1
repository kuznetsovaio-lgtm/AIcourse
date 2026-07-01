param(
    [string]$ContainerName = "ai-course-mvp"
)

$ErrorActionPreference = "Stop"

Write-Host "Stopping and removing container $ContainerName if it exists"
try {
    docker rm -f $ContainerName | Out-Null
} catch {
    Write-Host "No existing container named $ContainerName"
}
