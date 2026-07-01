@echo off
set IMAGE_NAME=ai-course-mvp
set CONTAINER_NAME=ai-course-mvp
set PORT=8000

set PROJECT_ROOT=%~dp0..
set ENV_FILE=%PROJECT_ROOT%\.env

echo Building Docker image %IMAGE_NAME% from %PROJECT_ROOT%
docker build -t %IMAGE_NAME% %PROJECT_ROOT%

echo Removing existing container if present
docker rm -f %CONTAINER_NAME% >nul 2>nul

if exist "%ENV_FILE%" (
  echo Starting container %CONTAINER_NAME% on http://localhost:%PORT% with .env
  docker run -d --name %CONTAINER_NAME% -p %PORT%:8000 --env-file "%ENV_FILE%" %IMAGE_NAME%
) else (
  echo Starting container %CONTAINER_NAME% on http://localhost:%PORT%
  docker run -d --name %CONTAINER_NAME% -p %PORT%:8000 %IMAGE_NAME%
)
