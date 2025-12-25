# @template/backend

Backend API and blockchain indexer service for the template Web3 monorepo boilerplate.

## 📋 Overview

The backend package provides:
- RESTful API for frontend consumption
- Blockchain event indexer
- Database management
- WebSocket support for real-time updates
- Optional blockchain provider integration (RPC configuration for your target chain)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- RPC access to your target blockchain (or local node)

> If you are developing Move contracts, install the Move tooling; for EVM-based contracts use your preferred toolchain (hardhat/forge/truffle).

### Installation

```bash
# Install dependencies from root
pnpm install

# Or install for this package only
pnpm --filter @template/backend install
```

### Configuration

Create a `.env` file in this directory:

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/template_db

# Blockchain RPC
RPC_ENDPOINT=https://rpc.example.com
CHAIN_ID=/* optional chain id */

# API Keys (optional)
REDIS_URL=redis://localhost:6379
```

> Note: `.env` files are excluded by `.gitignore`. Commit a `.env.example` with non-sensitive defaults instead of committing secret values.

### Development

```bash
# Install deps (from repo root)
pnpm install

# Start API server (dev)
pnpm --filter @template/backend dev

# Start indexer worker
pnpm --filter @template/backend start:indexer

# Build for production
pnpm --filter @template/backend build

# Run tests
pnpm --filter @template/backend test

# Run linter
pnpm --filter @template/backend lint
```

Add the following scripts to `package.json` (suggested):

```json
"scripts": {
  "dev": "ts-node-dev --respawn src/index.ts",
  "start": "node dist/index.js",
  "start:indexer": "node dist/indexer.js",
  "build": "tsc -p .",
  "migrate": "prisma migrate deploy",
  "seed": "node prisma/seed.js",
  "test": "vitest"
}
```

Adjust the exact commands to match your toolchain (ts-node, `node`, or compiled output).

## 🏗️ Architecture

```
packages/backend/
├── src/
│   ├── api/              # REST API endpoints
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── middleware/
│   ├── indexer/          # Blockchain indexer
│   │   ├── events/
│   │   └── processors/
│   ├── db/               # Database models & migrations
│   │   ├── models/
│   │   └── migrations/
│   ├── services/         # Business logic
│   ├── utils/            # Shared utilities
│   └── index.ts          # Entry point
├── tests/
├── package.json
└── tsconfig.json

```

## 🔍 Indexer

The indexer is an optional background worker that ingests on-chain data and keeps the backend database synchronized with the blockchain. Typical responsibilities:

- Stream blocks, transactions and events from a configured RPC/node provider
- Normalize and persist on-chain events (token transfers, contract events) to database tables
- Build derived, read-optimized entities for the API (e.g., balances, aggregated metrics)
- Handle chain reorganizations, retries, and checkpointing to ensure data consistency
- Emit notifications, metrics, or webhooks for downstream services

How to run the indexer (example):

```bash
# Start backend server (API only)
pnpm --filter @template/backend dev

# Start indexer worker (background)
pnpm --filter @template/backend start:indexer

# Run both (via helper script)
./scripts/dev-all.sh
```

The indexer is highly configurable via `.env` (RPC endpoints, polling intervals, checkpoint table names) and can be enabled or disabled depending on your architecture.


## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## 🔧 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| PORT | Server port | No | 3001 |
| DATABASE_URL | PostgreSQL connection string | Yes | - |
| RPC_ENDPOINT | Blockchain RPC endpoint (configurable) | Yes | - |
| CHAIN_ID | Chain identifier (optional) | No | - |
| REDIS_URL | Redis connection string | No | - |

## 📦 Dependencies

- express — Web framework
- prisma — Database ORM
- blockchain SDK — Optional SDK for your target chain (if applicable)
- ioredis — Redis client
- ws — WebSocket server

