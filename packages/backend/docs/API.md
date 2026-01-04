# @js2move/backend — API Documentation 🧭

**Last updated:** 2025-12-29

---

## Purpose ✅
This document captures the backend API design, route contracts, database models, and a prioritized implementation roadmap for the Js2Move backend service. It is intended for backend engineers, frontend integrators, and QA.

---

## Table of Contents
- Overview
- Routes (public & admin)
- Request / Response examples
- Database schema (Prisma)
- Deployment & Gas estimation endpoints
- Security & Rate-limiting
- Implementation roadmap & priorities
- Testing checklist
- OpenAPI / docs plan

---

## Overview
The backend exposes REST endpoints under `/api/v1/` and provides two main responsibilities:
1. Compilation services (MoveJS → Move)
2. Deployment & blockchain interaction (deploy, track, query)

Key non-functional concerns:
- Rate limiting (deployments are expensive)
- Input validation (Zod validators)
- Idempotency & retries for deployment
- Audit logging for deployments

---

## Routes (high-level)
### Compiler & Analysis
- POST /api/v1/public/compiler/compile
- POST /api/v1/public/compiler/validate
- POST /api/v1/public/compiler/analyze

### Deployment & Tracking
- POST /api/v1/public/deploy
- GET  /api/v1/public/deployments
- GET  /api/v1/public/deployment/:id
- GET  /api/v1/public/deployment/status/:txHash

### Gas Estimation
- POST /api/v1/public/gas/estimate
- GET  /api/v1/public/gas/price

### Contracts
- GET  /api/v1/public/contracts
- GET  /api/v1/public/contract/:address
- POST /api/v1/public/contract/verify

### Blockchain & Explorer Helpers
- GET /api/v1/public/network/status
- GET /api/v1/public/transaction/:hash
- GET /api/v1/public/account/:address

### Examples & Templates
- GET /api/v1/public/examples
- GET /api/v1/public/example/:id
- GET /api/v1/public/templates

### Admin (protected)
- GET  /api/v1/admin/deployments/all
- DELETE /api/v1/admin/deployment/:id
- POST /api/v1/admin/network/configure
- GET  /api/v1/admin/logs

### Auth (future)
- POST /api/v1/auth/wallet/connect
- GET  /api/v1/auth/session

---

## Key Request / Response Examples
### POST /api/v1/public/deploy
Request body:
```json
{
  "source": "contract Token { ... }",
  "network": "testnet",
  "moduleName": "Token",
  "gasLimit": 200000
}
```
Response (success):
```json
{
  "success": true,
  "deploymentId": "cuid_xxx",
  "address": "0x123...",
  "txHash": "0xabc...",
  "gasUsed": 12345
}
```

### POST /api/v1/public/gas/estimate
Request body:
```json
{ "source": "contract Token { ... }", "network": "testnet" }
```
Response:
```json
{
  "success": true,
  "estimate": {
    "gasUnits": 50000,
    "maxGasUnits": 100000,
    "gasUnitPrice": 150,
    "totalCostOctas": 7500000,
    "totalCostAPT": 0.075
  }
}
```

---

## Database schema (Prisma) — initial proposal
```prisma
model Deployment {
  id              String   @id @default(cuid())
  userId          String?
  source          String
  compiledCode    String
  contractAddress String?
  txHash          String   @unique
  network         String
  status          String   // pending/success/failed
  gasUsed         Int?
  gasEstimate     Int?
  moduleName      String?
  error           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([network, status])
  @@index([userId, createdAt])
}

model Contract {
  id           String @id @default(cuid())
  address      String @unique
  name         String?
  network      String
  deploymentId String
  verified     Boolean @default(false)
  abi          Json?
  sourceCode   String?
  createdAt    DateTime @default(now())
}

model Compilation {
  id         String   @id @default(cuid())
  source     String
  output     String?
  success    Boolean
  errors     Json?
  warnings   Json?
  duration   Int      // ms
  createdAt  DateTime @default(now())
}
```

---

## Security & Rate-limiting
- Use `ratelimit.middleware` for heavy endpoints (compile, deploy)
- Validate inputs with Zod (existing pattern)
- Never store raw private keys; prefer wallet-signed flows or secure vaults
- Audit logs for deployments (user, IP, txHash)

---

## Implementation Roadmap (prioritized)
**Phase 1 (1-2 weeks)**
1. POST /deploy (basic flow + record to DB)
2. GET /deployments & GET /deployment/:id
3. POST /gas/estimate and GET /gas/price
4. Add unit tests for DeploymentService

**Phase 2 (3-4 weeks)**
1. Contract verification flow
2. Wallet connect + auth (session token)
3. Frontend integration (deploy button + status polling)

**Phase 3 (4+ weeks)**
1. Multi-contract deployment
2. OpenAPI + generated client SDK examples
3. Load and security testing

---

## Testing checklist
- Unit tests for compile, gas estimation, deployment service
- Integration tests using testnet RPC (or local movement node)
- E2E for full flow: compile → simulate → deploy → confirm

---

## OpenAPI / Docs plan
- Add an OpenAPI YAML skeleton (`/docs/openapi.yaml`) and generate a swagger UI under `/api/docs` in development mode.
- Include sample requests for frontend teams and SDK code examples.

---

## Next steps (today)
1. Add more detailed specs for each endpoint (params, errors, status codes)
2. Create OpenAPI skeleton
3. Add Prisma migrations for `Deployment` and `Contract` models
4. Implement `gas.service` and `deployment.service` stubs

---

> Notes: This doc is a living document — I'll continue to expand it with code snippets, error formats, and OpenAPI definitions as we implement endpoints.
