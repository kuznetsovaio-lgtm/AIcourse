#!/usr/bin/env sh
set -eu

IMAGE_NAME="${IMAGE_NAME:-ai-course-mvp}"
CONTAINER_NAME="${CONTAINER_NAME:-ai-course-mvp}"
PORT="${PORT:-8000}"
PROJECT_ROOT="$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)"
ENV_FILE="$PROJECT_ROOT/.env"

echo "Building Docker image $IMAGE_NAME from $PROJECT_ROOT"
docker build -t "$IMAGE_NAME" "$PROJECT_ROOT"

echo "Removing existing container if present"
docker rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true

if [ -f "$ENV_FILE" ]; then
  echo "Starting container $CONTAINER_NAME on http://localhost:$PORT with .env"
  docker run -d --name "$CONTAINER_NAME" -p "$PORT:8000" --env-file "$ENV_FILE" "$IMAGE_NAME"
else
  echo "Starting container $CONTAINER_NAME on http://localhost:$PORT"
  docker run -d --name "$CONTAINER_NAME" -p "$PORT:8000" "$IMAGE_NAME"
fi
