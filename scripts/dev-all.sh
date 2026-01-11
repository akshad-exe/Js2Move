#!/usr/bin/env bash
set -euo pipefail

# dev-all.sh — convenience script to start local development
# - starts docker-compose services (postgres, redis, etc.) unless --no-docker
# - optionally builds the Aptos cache image with --build-aptos
# - runs `pnpm -r --parallel --stream run dev` to start all workspace dev servers

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
DOCKER_COMPOSE_FILE="$SCRIPT_DIR/../docker/docker-compose.yml"
APTOS_SCRIPT="$SCRIPT_DIR/build-aptos-cache-image.sh"

DOWN_ON_EXIT=false
STARTED_DOCKER=false
BUILD_APTOS=false
NO_DOCKER=false
PNPM_EXTRA_ARGS=()

usage() {
  cat <<'USAGE'
Usage: dev-all.sh [options] -- [pnpm args]

Options:
  --no-docker         Skip starting docker-compose services
  --down-on-exit      Bring docker-compose services down on script exit
  --build-aptos       Build Aptos cache Docker image before starting
  -h, --help          Show this help message

Any arguments after `--` are forwarded to the root `pnpm` command.
Examples:
  ./scripts/dev-all.sh
  ./scripts/dev-all.sh --no-docker
  ./scripts/dev-all.sh --build-aptos --down-on-exit -- --filter @js2move/backend dev
USAGE
}

# parse args
while [[ ${#} -gt 0 ]]; do
  case "$1" in
    --no-docker) NO_DOCKER=true; shift ;;
    --down-on-exit) DOWN_ON_EXIT=true; shift ;;
    --build-aptos) BUILD_APTOS=true; shift ;;
    -h|--help) usage; exit 0 ;;
    --) shift; PNPM_EXTRA_ARGS=("${@}"); break ;;
    *) echo "Unknown option: $1"; usage; exit 1 ;;
  esac
done

cleanup() {
  if $STARTED_DOCKER && $DOWN_ON_EXIT; then
    echo "Bringing down docker-compose services..."
    if command -v docker >/dev/null 2>&1; then
      if docker compose version >/dev/null 2>&1; then
        docker compose -f "$DOCKER_COMPOSE_FILE" down
      else
        docker-compose -f "$DOCKER_COMPOSE_FILE" down
      fi
    fi
  fi
}
trap cleanup EXIT

# Optionally start docker-compose
if [ "$NO_DOCKER" = false ] && [ -f "$DOCKER_COMPOSE_FILE" ]; then
  if command -v docker >/dev/null 2>&1; then
    echo "Starting docker-compose services from $DOCKER_COMPOSE_FILE..."
    if docker compose version >/dev/null 2>&1; then
      docker compose -f "$DOCKER_COMPOSE_FILE" up -d
    else
      docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
    fi
    STARTED_DOCKER=true
  else
    echo "Warning: docker is not available in PATH; skipping docker-compose startup." >&2
  fi
else
  echo "Skipping docker-compose startup." 
fi

# Optionally build Aptos cache image
if $BUILD_APTOS; then
  if [ -x "$APTOS_SCRIPT" ]; then
    echo "Building Aptos cache image..."
    ("$APTOS_SCRIPT")
  else
    echo "Aptos build script not found or not executable: $APTOS_SCRIPT" >&2
  fi
fi

# Ensure pnpm is available
if ! command -v pnpm >/dev/null 2>&1; then
  echo "Error: pnpm not found in PATH. Install pnpm (https://pnpm.io/) and try again." >&2
  exit 1
fi

# Run workspace dev scripts in parallel and stream logs
PNPM_CMD=(pnpm -r --parallel --stream run dev)
if [ ${#PNPM_EXTRA_ARGS[@]} -gt 0 ]; then
  PNPM_CMD+=("--" "${PNPM_EXTRA_ARGS[@]}")
fi

echo "Running: ${PNPM_CMD[*]}"
exec "${PNPM_CMD[@]}" 

