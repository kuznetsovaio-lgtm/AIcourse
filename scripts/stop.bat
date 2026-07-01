@echo off
set CONTAINER_NAME=ai-course-mvp

echo Stopping and removing container %CONTAINER_NAME% if it exists
docker rm -f %CONTAINER_NAME% >nul 2>nul
