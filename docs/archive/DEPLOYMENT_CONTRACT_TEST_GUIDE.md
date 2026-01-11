# Movement Deployment Contract Test Guide

**Source:** Movement Local Devnet Setup Instructions by RatherLabs  
**Created:** January 8, 2026  
**Context:** Local development and testing environment setup for Movement Network and Move contract deployment

---

## Overview

This guide provides comprehensive instructions for setting up a local Movement devnet environment and testing contract deployments. It covers full node setup, network initialization, contract publishing, and verification commands.

---

## 1. Repository Setup

### Clone Movement Repository

```bash
git clone https://github.com/movementlabsxyz/movement.git
cd movement
```

### Configure Environment File

Set the container revision in `.env`:

```bash
# Option 1: Update existing CONTAINER_REV
sed -i 's/^CONTAINER_REV=.*/CONTAINER_REV=4030f83/' .env || true

# Option 2: Add CONTAINER_REV if missing
echo "CONTAINER_REV=4030f83" >> .env
```

**Current Revision:** `4030f83`

---

## 2. Docker Compose Setup

### Initialize Docker Images

Pull all required Docker images:

```bash
docker compose --env-file .env \
  -f docker/compose/movement-full-node/docker-compose.yml \
  -f docker/compose/movement-full-node/docker-compose.local.yml \
  -f docker/compose/movement-full-node/docker-compose.da-sequencer.yml \
  -f docker/compose/movement-full-node/docker-compose.faucet.yml \
  pull
```

### Start Local Devnet

Start all services:

```bash
docker compose --env-file .env \
  -f docker/compose/movement-full-node/docker-compose.yml \
  -f docker/compose/movement-full-node/docker-compose.local.yml \
  -f docker/compose/movement-full-node/docker-compose.da-sequencer.yml \
  -f docker/compose/movement-full-node/docker-compose.faucet.yml \
  up -d
```

**Components Started:**
- Full Node
- DA Sequencer
- Faucet Service

---

## 3. Verify Local Endpoints

### Test Endpoints

Movement's local stack exposes the following endpoints:

| Service | Port | URL |
|---------|------|-----|
| Aptos REST API | 30731 | `http://127.0.0.1:30731/v1` |
| Faucet | 30732 | `http://127.0.0.1:30732` |

### Verification Commands

Check REST API:

```bash
curl -s http://127.0.0.1:30731/v1 | head
```

Expected output: JSON response with API metadata

Check Faucet:

```bash
curl -s http://127.0.0.1:30732/ | head
```

Expected output: Faucet service response

Check running containers:

```bash
docker compose --env-file .env \
  -f docker/compose/movement-full-node/docker-compose.yml \
  -f docker/compose/movement-full-node/docker-compose.local.yml \
  -f docker/compose/movement-full-node/docker-compose.da-sequencer.yml \
  -f docker/compose/movement-full-node/docker-compose.faucet.yml \
  ps
```

**Expected Status:** All containers should show `Up` state.

---

## 4. Initialize Movement Network Profile

### Create Local Development Profile

Within your Movement project (e.g., `Js2Move`), run:

```bash
movement init \
  --network custom \
  --rest-url http://127.0.0.1:30731/v1 \
  --faucet-url http://127.0.0.1:30732 \
  --profile local-dev \
  --assume-yes
```

**Prompt:** Provide a private key or let the system create one.

### Expected Configuration

Your `config.yaml` should contain:

```yaml
profiles:
  local-dev:
    network: Custom
    private_key: ed25519-priv-0x...
    public_key: ed25519-pub-0x...
    account: 0x...
    rest_url: "http://127.0.0.1:30731/v1"
    faucet_url: "http://127.0.0.1:30732/"
```

### Create Additional Profiles

For testing multiple accounts:

```bash
movement init \
  --network custom \
  --rest-url http://127.0.0.1:30731/v1 \
  --faucet-url http://127.0.0.1:30732 \
  --profile local-dev-2 \
  --assume-yes
```

Supply the private key when prompted. This creates a second profile in `config.yaml`.

---

## 5. Account Management

### List Local Accounts

```bash
movement account list --profile local-dev
```

### Check Account Balance

```bash
movement account balance --account 0x{ACCOUNT} --profile local-dev
```

### Create Account from Existing Wallet

If you have a wallet with a private key (e.g., Nightly):

1. Extract the private key from your wallet
2. Run `movement init` with the profile name and provide the private key
3. The new account is added to `config.yaml`

---

## 6. Deploy and Publish Move Contracts

### Prerequisites

Before publishing, ensure:

1. **Framework Version Matches Node Version**
   
   Update `Move.toml` to use the same `aptos-core` revision as the running node:
   
   ```toml
   [dependencies.AptosFramework]
   git = "https://github.com/movementlabsxyz/aptos-core.git"
   rev = "9dfc8e7a3d622597dfd81cc4ba480a5377f87a41"
   subdir = "aptos-move/framework/aptos-framework"
   ```
   
   **Known Revisions:**
   - "elsa": `9dfc8e7a3d622597dfd81cc4ba480a5377f87a41`
   - Current: `4030f83` (verify against your node)

2. **Bytecode Version Compatibility**
   
   The local node runs a specific bytecode version (e.g., v6). Publishing with the wrong version causes `CODE_DESERIALIZATION_ERROR`.

### Publish Module

```bash
movement move publish \
  --profile local-dev \
  --assume-yes \
  --bytecode-version 6
```

**Parameters:**
- `--profile local-dev`: Use the local development profile
- `--assume-yes`: Skip confirmation prompts
- `--bytecode-version 6`: Must match the local node's bytecode version

**Success Indicator:** Transaction is processed and contract published to the network.

---

## 7. Testing Checklist

### Local Devnet Validation

- [ ] Docker containers started successfully (`docker compose ps`)
- [ ] REST API responds to requests (`curl http://127.0.0.1:30731/v1`)
- [ ] Faucet responds to requests (`curl http://127.0.0.1:30732`)
- [ ] Movement profile created (`movement account list --profile local-dev`)
- [ ] Account balance retrievable (`movement account balance --account 0x... --profile local-dev`)

### Contract Deployment Validation

- [ ] `Move.toml` framework revision matches node version
- [ ] Bytecode version specified correctly in publish command
- [ ] Contract publishes without `CODE_DESERIALIZATION_ERROR`
- [ ] Transaction hash returned upon successful publish
- [ ] Contract address is registered on-chain

### Post-Deployment Testing

- [ ] Call public functions on the deployed contract
- [ ] Verify state changes are persisted
- [ ] Test with multiple profiles/accounts
- [ ] Verify gas fees and transaction costs

---

## 8. Network Management

### Stop Local Devnet

```bash
docker compose --env-file .env \
  -f docker/compose/movement-full-node/docker-compose.yml \
  -f docker/compose/movement-full-node/docker-compose.local.yml \
  -f docker/compose/movement-full-node/docker-compose.da-sequencer.yml \
  -f docker/compose/movement-full-node/docker-compose.faucet.yml \
  down
```

### Restart Local Devnet

```bash
docker compose --env-file .env \
  -f docker/compose/movement-full-node/docker-compose.yml \
  -f docker/compose/movement-full-node/docker-compose.local.yml \
  -f docker/compose/movement-full-node/docker-compose.da-sequencer.yml \
  -f docker/compose/movement-full-node/docker-compose.faucet.yml \
  up -d
```

---

## 9. Integration with Js2Move Deployment

### Mapping to Js2Move Project

This devnet setup integrates with the Js2Move project's deployment pipeline:

| Js2Move Component | Devnet Equivalent |
|------------------|------------------|
| `/gas/estimate` endpoint | Uses local RPC (`http://127.0.0.1:30731/v1`) |
| `/deploy` endpoint | Publishes Move contracts via `movement move publish` |
| Compilation validation | Tests against local node bytecode version |
| Account management | Uses profiles in `config.yaml` |

### Environment Configuration for Js2Move

For local testing, set backend environment variables:

```env
RPC_TESTNET=http://127.0.0.1:30731/v1
RPC_MAINNET=http://127.0.0.1:30731/v1
MOVEMENT_PROFILE=local-dev
FAUCET_URL=http://127.0.0.1:30732
```

### Contract Publishing via Js2Move

1. **Compile MoveJS to Move** (via compiler service)
2. **Generate Move.toml** (with framework version matching local node)
3. **Estimate Gas** (using local RPC on port 30731)
4. **Deploy to Devnet** (via `movement move publish --profile local-dev`)

---

## 10. Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| `CODE_DESERIALIZATION_ERROR` | Bytecode version mismatch | Verify `--bytecode-version` matches node version |
| REST API unreachable | Container not running | Check `docker compose ps` and restart services |
| Faucet request fails | Service not initialized | Wait 30s after `docker compose up` |
| `CODE_NOT_FOUND` on contract call | Framework version mismatch | Update `Move.toml` to match node's `aptos-core` revision |
| Account balance is 0 | Faucet not called | Request coins via faucet API |

### Debug Commands

```bash
# Check container logs
docker compose logs movement-full-node

# Verify network connectivity
ping 127.0.0.1:30731

# Check configured profiles
cat config.yaml

# Test faucet directly
curl -X POST http://127.0.0.1:30732/fund \
  -H "Content-Type: application/json" \
  -d '{"amount": 100000000, "address": "0x..."}'
```

---

## 11. References

- **Created by:** Mauro Cocco, Software Engineer, [Rather Labs Inc.](https://ratherlabs.com/)
- **Movement Repository:** https://github.com/movementlabsxyz/movement
- **Aptos Framework:** https://github.com/movementlabsxyz/aptos-core
- **License:** Free to use and share

---

## 12. Quick Start Summary

```bash
# 1. Clone and configure
git clone https://github.com/movementlabsxyz/movement.git
cd movement
echo "CONTAINER_REV=4030f83" >> .env

# 2. Start devnet
docker compose --env-file .env \
  -f docker/compose/movement-full-node/docker-compose.yml \
  -f docker/compose/movement-full-node/docker-compose.local.yml \
  -f docker/compose/movement-full-node/docker-compose.da-sequencer.yml \
  -f docker/compose/movement-full-node/docker-compose.faucet.yml \
  up -d

# 3. Verify endpoints
curl -s http://127.0.0.1:30731/v1 | head

# 4. Initialize profile in your project
movement init --network custom \
  --rest-url http://127.0.0.1:30731/v1 \
  --faucet-url http://127.0.0.1:30732 \
  --profile local-dev --assume-yes

# 5. Publish contract
movement move publish --profile local-dev --assume-yes --bytecode-version 6
```

---

**Document Last Updated:** January 8, 2026  
**Status:** Ready for integration testing with Js2Move deployment pipeline
