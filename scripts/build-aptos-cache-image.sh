#!/usr/bin/env bash
set -euo pipefail

IMAGE_NAME="js2move/aptos-cache:latest"
DOCKER_CONTEXT="docker/aptos-cache"

echo "Building Docker image $IMAGE_NAME from $DOCKER_CONTEXT..."
docker build -t "$IMAGE_NAME" "$DOCKER_CONTEXT"

echo "Built $IMAGE_NAME"

echo "To use the image in tests, set APTOS_DOCKER_IMAGE=$IMAGE_NAME and ensure docker is available."

echo "Example: APTOS_DOCKER_IMAGE=$IMAGE_NAME node --test packages/compiler/tests/integration/aptos/compile.test.js"