#!/usr/bin/env sh
set -eu

CONTAINER_NAME="${CONTAINER_NAME:-ai-course-mvp}"

echo "Stopping and removing container $CONTAINER_NAME if it exists"
docker rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true
