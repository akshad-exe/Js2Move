# Docker

This directory contains container and orchestration artifacts to run the Js2Move project services locally or in production-like environments. It includes a docker-compose manifest and guidance for how to use it with the packages in this repository.

## What it provides
- A complete docker-compose setup for running Js2Move on Movement Network
- Production-ready Dockerfiles for backend and frontend services
- Database (PostgreSQL) and cache (Redis) services
- Proper service dependencies and health checks

## Services Included
- **Database (Postgres)** — persistence for the backend and deployment records
- **Cache (Redis)** — optional caching and session storage
- **Backend** — API server with Move compilation and deployment capabilities
- **Frontend** — React/Vite application for the Js2Move interface

## Prerequisites
- Docker and Docker Compose installed
- Movement CLI installed (for Move compilation during builds)

## Environment Setup

1. Copy environment files:
```bash
cp packages/backend/.env.example packages/backend/.env
cp frontend/.env.example frontend/.env
```

2. Configure your environment variables:
   - `packages/backend/.env`: Database URL, RPC endpoint, private keys
   - `frontend/.env`: API URLs and other frontend config

## Usage

### Development
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Deployment
```bash
# Build and start production services
docker-compose -f docker-compose.yml up --build -d

# Scale services if needed
docker-compose up -d --scale backend=3
```

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/js2move_db
REDIS_URL=redis://redis:6379
RPC_ENDPOINT=https://testnet.movementnetwork.xyz/v1
CHAIN_ID=250
DEPLOYER_PRIVATE_KEY=your_private_key_here
NODE_ENV=production
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
NODE_ENV=production
```

## Networking

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Database**: localhost:5432 (for external access)
- **Redis**: localhost:6379 (for external access)

## Volumes

- `postgres_data`: Persistent database storage
- `redis_data`: Persistent cache storage

## Security Notes

- Never commit private keys or secrets to source control
- Use environment-specific .env files
- Consider using Docker secrets for production deployments
- The Movement CLI is installed in the backend container for Move compilation

## Troubleshooting

### Build Issues
- Ensure Movement CLI is accessible during build
- Check that all environment variables are set
- Verify Docker has sufficient resources

### Runtime Issues
- Check service logs: `docker-compose logs <service-name>`
- Verify database connectivity
- Ensure Movement Network is accessible

### Move Compilation Issues
- The backend container includes Movement CLI for compilation
- If compilation fails, check the Movement CLI version
- Ensure `--bytecode-version 6` is used for Movement Network