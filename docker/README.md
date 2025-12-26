# Docker

This directory contains container and orchestration artifacts to run the project services locally or in production-like environments. It includes a docker-compose manifest and guidance for how to use it with the packages in this repository.

What it provides
- A baseline docker-compose file to start core services (database, cache) and local instances of the frontend, backend and optional development node.
- Guidance on how to add or customize per-package Dockerfiles and how to wire `.env` files for environment configuration.

How to use (high level)
- Add Dockerfiles to packages you want to run in containers (e.g., `frontend/Dockerfile`, `packages/backend/Dockerfile`).
- Populate a `docker/.env` or repo root `.env` with environment variables referenced by the compose file. Prefer `.env.example` for defaults.
- Use the docker-compose manifest to bring up services in development; for production deployments, adapt images and secrets appropriately.

Included services (generalized)
- Database (Postgres) — persistence for the backend
- Cache (Redis) — optional caching / job broker
- Dev node (optional) — local blockchain node (Hardhat/Anvil) for contract testing
- Backend — API server (builds from `packages/backend` context)
- Indexer — background worker (can share image with backend) for on-chain ingestion
- Frontend — Next.js app (builds from `frontend` context)

Notes
- The compose file is intentionally generic and intended to be adapted for your toolchain and preferred base images. It references build contexts for local packages so images are reproducible locally.
- Do not commit private keys or secrets to source control. Keep `.env` entries private and share an `.env.example` with collaborators.

If you'd like, I can also add Dockerfiles per package (backend and frontend) with minimal, production-ish examples.