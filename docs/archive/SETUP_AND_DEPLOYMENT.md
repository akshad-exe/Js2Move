# Js2Move Complete Setup & Deployment Guide

## 🚀 Production Deployment Configuration

### Backend Production Setup

The backend is now configured for production deployment with the following changes:

#### Environment Variables Added:
```env
# Blockchain Configuration for Production Deployment
RPC_ENDPOINT=https://testnet.movementnetwork.xyz/v1
CHAIN_ID=250
DEPLOYER_PRIVATE_KEY=your_private_key_here
FAUCET_URL=https://faucet.testnet.movementnetwork.xyz/
```

#### Database Seeding:
- ✅ Updated seed file with 5 examples (01-05)
- ✅ Database schema includes all required tables
- ✅ Examples loaded: Hello World, Simple Token, NFT, DeFi Vault, Voting Contract

#### Deployment Service:
- ✅ Integrated with Aptos SDK for real blockchain deployment to Movement Network
- ✅ Generates proper Move.toml configuration
- ✅ Handles transaction submission and status tracking
- ✅ Uses correct Movement testnet/mainnet RPC endpoints
- ✅ Falls back to manual deployment if no private key configured

### Movement Network Configuration

#### Testnet (Chain ID: 250)
- **RPC:** https://testnet.movementnetwork.xyz/v1
- **Faucet:** https://faucet.testnet.movementnetwork.xyz/
- **Explorer:** https://explorer.movementnetwork.xyz/?network=testnet

#### Mainnet (Chain ID: 126)
- **RPC:** https://mainnet.movementnetwork.xyz/v1
- **Bridge:** https://bridge.movementnetwork.xyz/
- **Explorer:** https://explorer.movementnetwork.xyz/?network=mainnet

### Frontend Production Setup

#### Environment Configuration:
```env
# API Configuration
VITE_API_URL=https://your-api-domain.com/api/v1

# App Configuration
VITE_APP_NAME=Js2Move
VITE_APP_DESCRIPTION="Move smart contracts with JavaScript syntax"

# Analytics (optional)
VITE_ENABLE_ANALYTICS=true

# Wallet Configuration
VITE_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id

# Blockchain Configuration
VITE_APTOS_NETWORK=testnet
VITE_APTOS_NODE_URL=https://testnet.movementnetwork.xyz/v1
```

#### Build Optimization:
- ✅ Code splitting for vendor libraries
- ✅ Aggressive minification with Terser
- ✅ Optimized chunk splitting for better loading

## Quick Start

### 1. Prerequisites

```bash
# Install Movement CLI (if not already installed)
curl -s https://raw.githubusercontent.com/movementlabsxyz/movement/main/scripts/install.sh | bash

# Verify installation
movement aptos config list-profiles
```

### 2. Build the Compiler & CLI

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Verify CLI works
node packages/cli/dist/index.js --help
```

### 3. Setup Production Environment

#### Backend Configuration:
```bash
# Copy environment template
cp packages/backend/.env.example packages/backend/.env

# Edit with your production values
# Required: DATABASE_URL, DEPLOYER_PRIVATE_KEY
# Optional: RPC_ENDPOINT, FAUCET_URL
```

#### Frontend Configuration:
```bash
# Copy environment template
cp frontend/.env.example frontend/.env

# Edit with your production API URL
# VITE_API_URL=https://your-api-domain.com/api/v1
```

### 4. Database Setup

```bash
# Navigate to backend
cd packages/backend

# Generate Prisma client
pnpm prisma:generate

# Push schema to database
pnpm prisma:db:push

# Seed with examples
pnpm seed:examples
```

### 5. Deploy Backend

```bash
# Build backend
pnpm build

# Start production server
pnpm start

# Or use PM2 for production
npm install -g pm2
pm2 start dist/index.js --name js2move-backend
```

### 6. Deploy Frontend

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Build for production
npm run build

# Deploy dist/ folder to your web server
# (Netlify, Vercel, AWS S3, etc.)
```

### 7. Test Compilation

```bash
# Compile a single example
node packages/cli/dist/index.js compile -s packages/compiler/examples/01-helloworld.movejs

# Or compile to a file
node packages/cli/dist/index.js compile -s packages/compiler/examples/01-helloworld.movejs -o helloworld.move
```

### 8. Setup Testnet Profile

```bash
# Initialize testnet profile (interactive)
movement aptos init --profile testnet

# Or use an existing profile
movement aptos config list-profiles

# Fund account from faucet
movement aptos account fund-with-faucet --profile testnet
```

### 9. Deploy to Testnet

#### Option A: Automated Deployment (PowerShell - Windows)

```powershell
# Run deployment script
.\scripts\Deploy-Compiled.ps1 -Profile testnet

# Or with specific profile
.\scripts\Deploy-Compiled.ps1 -Profile myprofile
```

#### Option B: Automated Deployment (Bash - Linux/Mac)

```bash
# Run deployment script
bash scripts/deploy-compiled.sh testnet
```

#### Option C: Manual Deployment

```bash
# 1. Create a Move project directory
mkdir -p deploy/HelloWorld/sources

# 2. Compile MoveJS to Move
node packages/cli/dist/index.js compile -s packages/compiler/examples/01-helloworld.movejs > deploy/HelloWorld/sources/helloworld.move

# 3. Create Move.toml
cat > deploy/HelloWorld/Move.toml << 'EOF'
[package]
name = "HelloWorld"
version = "0.0.1"

[dependencies.Aptos]
git = "https://github.com/aptos-labs/aptos-core.git"
git_subdir = "aptos-move/framework/aptos-framework"
rev = "main"

[addresses]
HelloWorld = "0x1"
EOF

# 4. Build the Move package
cd deploy/HelloWorld
movement aptos move build --profile testnet

# 5. Publish to testnet
movement aptos move publish --profile testnet
```

## Deployment Workflow

### Step 1: Compile MoveJS to Move

The Js2Move compiler converts JavaScript-like syntax to Move bytecode:

```
MoveJS Source
     ↓
  Lexer (Tokenization)
     ↓
  Parser (AST)
     ↓
  Type Mapper (JS types → Move types)
     ↓
  Generator (Move code)
     ↓
Move Source Code
```

**Type Mappings:**
- `string` → `u64`
- `u64` → `u64`
- `u128` → `u128`
- `bool` → `bool`
- `address` → `address`
- Parameter `owner: address` in init → `owner: &signer`

### Step 2: Create Move Project

Each contract needs a Move project structure:

```
project/
├── Move.toml          # Package metadata
└── sources/
    └── module.move    # Compiled Move code
```

### Step 3: Build Move Package

```bash
movement aptos move build --profile testnet
```

This:
- Validates Move syntax
- Resolves dependencies
- Generates bytecode
- Creates build artifacts

### Step 4: Publish to Movement Network

```bash
movement aptos move publish --profile testnet
```

This:
- Sends bytecode to testnet
- Pays gas fees
- Records transaction
- Updates blockchain state

## Examples

### Example 1: HelloWorld Contract

**MoveJS Source:**
```javascript
contract Helloworld {
  resource Greeting { value: string };
  
  init(owner: address, message: string) {
    Greeting[owner] = message;
  }
  
  getGreeting(addr: address): string {
    return Greeting[addr];
  }
}
```

**Compiled Move Output:**
```move
address Helloworld {
module Helloworld {
    struct Greeting has key, store {
        value: u64
    }

    public entry fun init(owner: &signer, message: u64) {
        move_to(owner, Greeting { value: message });
    }

    public fun getGreeting(addr: address): u64 acquires Greeting {
        return borrow_global<Greeting>(addr).value;
    }
}
}
```

**Deployment:**
```bash
node packages/cli/dist/index.js compile -s packages/compiler/examples/01-helloworld.movejs
# ... follow steps 2-4 above
```

### Example 2: SimpleToken Contract

**Features:**
- Balance tracking
- Supply management
- Initialization
- Getter functions

**Deploy with:**
```bash
node packages/cli/dist/index.js compile -s packages/compiler/examples/02-simple-token.movejs
```

### Example 3-5: Complex Contracts

- **NFT**: Non-fungible token management
- **DefiVault**: Vault and liquidity management
- **VotingContract**: Governance and voting logic

All follow the same deployment process.

## Troubleshooting

### Compilation Errors

```bash
# Check if syntax is correct
node packages/cli/dist/index.js compile -s your_file.movejs

# Enable verbose output
node packages/cli/dist/index.js compile -s your_file.movejs 2>&1 | head -20
```

### Build Errors

```bash
# Check Move syntax
movement aptos move build --profile testnet

# View full error messages
cd your_project && movement aptos move build --profile testnet 2>&1
```

### Deployment Errors

```bash
# Verify account has funds
movement aptos account list --profile testnet

# Check testnet connectivity
movement aptos config list-profiles

# Fund account if empty
movement aptos account fund-with-faucet --profile testnet
```

### Type System Issues

Types are automatically converted:
- Numeric string operations → `u64`
- Owner parameters in init → `&signer`
- Array/Vector operations → preserved

If there are type mismatches, check the MoveJS source types.

## Advanced Usage

### Custom Compiler Options

```bash
# Compile with custom formatting
node packages/cli/dist/index.js compile -s file.movejs --indent 4

# Generate to file
node packages/cli/dist/index.js compile -s file.movejs -o compiled.move
```

### Using the Backend API

If backend is running:

```bash
# Start backend
cd packages/backend && npm run dev

# Deploy via CLI (uses backend)
node packages/cli/dist/index.js deploy -s file.movejs -n testnet
```

### Batch Deployment

```bash
# Deploy all examples
for file in packages/compiler/examples/*.movejs; do
  echo "Deploying $(basename $file)..."
  node packages/cli/dist/index.js compile -s "$file" -o "deploy/$(basename $file .movejs).move"
done
```

## Network Profiles

### Testnet (Development)
- **Free faucet funding**
- **Faster blocks**
- **For testing**
- **Resets periodically**

### Mainnet (Production)
- **Real tokens required**
- **Permanent state**
- **Live network**
- **Use with caution**

### Local Devnet
- **Run locally**
- **No gas fees**
- **Instant finality**
- **For local testing**

## Monitoring Deployments

### Check Deployment Status

```bash
# View account resources
movement aptos account list --profile testnet

# Check recent transactions
movement aptos account transactions --profile testnet

# View module details
movement aptos account module-details --profile testnet
```

### Verify Contract Deployment

```bash
# List deployed modules
movement aptos account list --profile testnet

# Check module code
movement aptos account module-code <ADDRESS> <MODULE_NAME> --profile testnet
```

## Performance

- **Compilation**: ~100-500ms per file
- **Build time**: 1-5 seconds
- **Deployment**: 2-10 seconds per contract
- **Total time**: 3-15 minutes for all 5 contracts

## Next Steps

1. ✅ Compile MoveJS to Move
2. ✅ Deploy to Movement Testnet
3. ⏳ Integrate with Frontend UI
4. ⏳ Create Backend API endpoints
5. ⏳ Deploy to Mainnet

See [DEPLOYMENT_ARCHITECTURE.md](../DEPLOYMENT_ARCHITECTURE.md) for infrastructure details.

See [FRONTEND_IMPLEMENTATION_GUIDE.md](../FRONTEND_IMPLEMENTATION_GUIDE.md) for frontend integration.
