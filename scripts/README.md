# Scripts Directory

This directory contains automation scripts for building, testing, and deploying MoveJS contracts to Movement blockchain.

## 📋 Available Scripts


### Testing Scripts

#### `test-move-unit.sh <package-dir>`
Runs unit tests for a specific Move package using Movement CLI.

```bash
# Test a specific package
bash scripts/test-move-unit.sh packages/compiler/out/aptos/example-helloworld

# Expected output:
# 🧪 Movement Move Unit Tests
# ===============================
# 📦 Package: example-helloworld
# 📁 Directory: /path/to/package
#
# Step 1: Verifying package structure...
# ✓ Package structure valid
#
# Step 2: Checking Movement CLI...
# ✓ Movement CLI available
#
# Step 3: Running unit tests...
# [ PASS ] module::test_function
# Test result: OK. Total tests: 3; passed: 3; failed: 0
# ✅ All tests passed!
```

#### `test-and-build.sh`
Runs build and unit tests for ALL generated Move packages.

```bash
# Test all packages
bash scripts/test-and-build.sh

# Output shows:
# - Build status for each package
# - Unit test results
# - Summary of passed/failed packages
```

#### `check-move-errors.sh <package-dir>`
Analyzes Move compilation errors and provides detailed diagnostics.

```bash
# Check for compilation errors
bash scripts/check-move-errors.sh packages/compiler/out/aptos/example-helloworld
```

### Deployment Scripts

#### `test-deployment.sh <package-dir> [profile] [bytecode-version]`
Deploys a single Move package to Movement blockchain.

```bash
# Deploy to local devnet (default)
bash scripts/test-deployment.sh packages/compiler/out/aptos/example-helloworld

# Deploy to testnet
bash scripts/test-deployment.sh packages/compiler/out/aptos/example-helloworld testnet

# Deploy with specific bytecode version
bash scripts/test-deployment.sh packages/compiler/out/aptos/example-helloworld local-dev 6

# Expected output:
# 🚀 Movement CLI Deployment Test
# ================================
# 📦 Package: example-helloworld
# 📁 Directory: /path/to/package
# 👤 Profile: local-dev
#
# Step 1: Verifying package structure...
# ✓ Package structure valid
#
# Step 2: Move.toml content:
# [package]
# name = "example-helloworld"
# ...
#
# Step 3: Move source files:
# -rw-r--r-- 1 user user 463 Jan 8 22:02 helloworld.move
#
# Step 4: Checking Movement CLI...
# ✓ Movement CLI found: movement 0.1.0
#
# Step 5: Checking account balance...
# ✓ Profile 'local-dev' exists
#
# Step 6: Compiling locally for validation...
# ✓ Local compilation successful
#
# Step 7: Publishing to Movement devnet...
# Running: movement move publish --package-dir "/path/to/package" --profile local-dev --assume-yes --bytecode-version 6
#
# INCLUDING DEPENDENCY AptosFramework
# BUILDING example-helloworld
# {
#   "Result": "Success"
# }
# Transaction submitted: 0x...
#
# ✅ Deployment successful!
#
# Summary:
#   Package: example-helloworld
#   Network: Movement Local Devnet
#   Bytecode Version: 6
```

#### `deploy-all.sh [profile] [bytecode-version]`
**NEW!** Deploys ALL generated Move packages to Movement blockchain.

```bash
# Deploy all packages to local devnet
bash scripts/deploy-all.sh

# Deploy all packages to testnet
bash scripts/deploy-all.sh testnet

# Deploy with specific bytecode version
bash scripts/deploy-all.sh local-dev 6

# Expected output:
# 🚀 Deploy All Move Packages to Movement
# ========================================
# Found packages:
#   - example-defi-vault
#   - example-helloworld
#   - example-nft
#   - example-simple-token
#   - example-voting-contract
#
# Deploying: example-defi-vault
# ─────────────────────────────────────
# 🚀 Movement CLI Deployment Test
# ================================
# ...deployment output...
# ✅ example-defi-vault deployed successfully!
#
# Deploying: example-helloworld
# ─────────────────────────────────────
# ...deployment output...
# ✅ example-helloworld deployed successfully!
#
# 🎉 All packages deployed successfully!
```

### Development Scripts

#### `dev-all.sh`
Starts all development services (frontend, backend, database) for local development.

```bash
# Start all services
bash scripts/dev-all.sh

# This typically runs:
# - PostgreSQL database
# - Backend API server
# - Frontend development server
# - Any other required services
```

### Test Generation Scripts

#### `add-unit-tests.js`
Auto-generates basic unit tests for Move contracts based on their structure.

```bash
# Generate tests for a specific contract
node scripts/add-unit-tests.js packages/compiler/out/aptos/example-helloworld/sources/helloworld.move

# Generate tests for all contracts
find packages/compiler/out/aptos -name "*.move" -exec node scripts/add-unit-tests.js {} \;
```

#### `auto-gen-tests.js`
Advanced test generation script with more sophisticated test case generation.

```bash
# Generate comprehensive tests
node scripts/auto-gen-tests.js packages/compiler/out/aptos/example-helloworld/sources/helloworld.move
```

## 🚀 Quick Start

### 1. Build All Contracts
```bash
cd packages/compiler
pnpm build:out -- --examples-only
```

### 2. Test All Contracts
```bash
bash scripts/test-and-build.sh
```

### 3. Deploy All Contracts
```bash
bash scripts/deploy-all.sh
```

### 4. Verify Deployment
```bash
# Check deployed contracts
movement account list --profile local-dev
```

## 🔧 Prerequisites

### Movement CLI Setup
```bash
# Install Movement CLI (if not already installed)
# Follow: https://github.com/movementlabsxyz/movement

# Initialize profiles
movement init --network custom \
  --rest-url http://127.0.0.1:30731/v1 \
  --faucet-url http://127.0.0.1:30732 \
  --profile local-dev \
  --assume-yes

movement init --network testnet \
  --profile testnet \
  --assume-yes

movement init --network mainnet \
  --profile mainnet \
  --assume-yes
```

### Environment Setup
- Movement local devnet running (Docker)
- Movement CLI installed and configured
- Node.js and pnpm for JavaScript tooling
- WSL (for Windows users) or native Linux/macOS

## 📁 Directory Structure

```
scripts/
├── test-move-unit.sh        # Single package unit testing
├── test-and-build.sh        # Batch testing for all packages
├── check-move-errors.sh     # Move compilation error analysis
├── test-deployment.sh       # Flexible single package deployment
├── deploy-all.sh            # Batch deployment for all packages
├── dev-all.sh               # Development environment setup
├── add-unit-tests.js        # Basic test generation
├── auto-gen-tests.js        # Advanced test generation
├── archive/                 # Archived scripts (see archive/README.md)
│   ├── README.md            # Archive documentation
│   ├── test-deployment-mainnet.sh
│   ├── test-deployment-testnet.sh
│   ├── deploy-compiled.sh
│   ├── Deploy-Compiled.ps1
│   └── quick-deploy.sh
└── README.md                # This documentation
```

## 🗂️ Archived Scripts

The following scripts have been archived as they are redundant or outdated:

- `test-deployment-mainnet.sh` - Use `test-deployment.sh mainnet` instead
- `test-deployment-testnet.sh` - Use `test-deployment.sh testnet` instead  
- `deploy-compiled.sh` - Replaced by `test-deployment.sh`
- `Deploy-Compiled.ps1` - PowerShell version, use bash scripts instead
- `quick-deploy.sh` - Outdated hardcoded deployment, use `deploy-all.sh`

These archived scripts are kept for historical reference but are no longer maintained. See `scripts/archive/README.md` for details.

### Common Issues

**"Movement CLI not found"**
```bash
# Install Movement CLI
# Follow installation guide at: https://github.com/movementlabsxyz/movement
```

**"Profile not found"**
```bash
# Create the profile
movement init --network custom \
  --rest-url http://127.0.0.1:30731/v1 \
  --faucet-url http://127.0.0.1:30732 \
  --profile local-dev \
  --assume-yes
```

**"Package structure invalid"**
```bash
# Rebuild the packages
cd packages/compiler
pnpm build:out -- --examples-only
```

**Permission denied on scripts**
```bash
# Make scripts executable
chmod +x scripts/*.sh
```

### Getting Help

- Check script output for detailed error messages
- Use `movement --help` for CLI options
- Check Movement documentation: https://docs.movementlabs.xyz
- Review generated Move.toml files for configuration issues

## 📝 Contributing

When adding new scripts:
5. Avoid creating redundant scripts - check if existing scripts can be enhanced instead

## 🧹 Script Maintenance

- **Active Scripts**: Regularly maintained and documented
- **Archived Scripts**: Kept for reference but not maintained
- **Redundant Scripts**: Should be consolidated or removed

If you find a script that seems outdated or redundant, please create an issue to discuss consolidation.
1. Add executable permissions: `chmod +x scripts/new-script.sh`
2. Update this README with description and usage examples
3. Include error handling and clear output messages
4. Test on both local devnet and testnet profiles