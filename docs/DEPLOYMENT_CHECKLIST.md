# Js2Move Deployment Checklist

## Pre-Deployment Checklist

### Prerequisites
- [ ] Node.js installed (v18+)
- [ ] pnpm installed
- [ ] Movement CLI installed (`curl -s https://raw.githubusercontent.com/movementlabsxyz/movement/main/scripts/install.sh | bash`)
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

### Environment Setup
- [ ] Clone repository
- [ ] Run `pnpm install`
- [ ] Run `pnpm build` (all packages)
- [ ] Verify CLI works: `node packages/cli/dist/index.js --help`

### Network Preparation
- [ ] Create testnet profile: `movement aptos init --profile testnet`
- [ ] Configure account address and private key
- [ ] Fund account from faucet: `movement aptos account fund-with-faucet --profile testnet`
- [ ] Verify account has balance: `movement aptos account list --profile testnet`

## Compilation Checklist

### Test Compiler
- [ ] Compile HelloWorld: `node packages/cli/dist/index.js compile -s packages/compiler/examples/01-helloworld.movejs`
- [ ] Verify output contains proper Move syntax
- [ ] Compile SimpleToken example
- [ ] Verify all 5 examples compile without errors

### Verify Generated Code
- [ ] Check address block is present
- [ ] Check module declaration exists
- [ ] Check struct definitions are correct
- [ ] Check function visibility (public vs public entry)
- [ ] Check acquires clauses are present where needed
- [ ] Verify type conversions are correct

## Deployment Checklist

### Option A: Automated Deployment

#### PowerShell (Windows)
- [ ] Open PowerShell as Administrator
- [ ] Navigate to project root
- [ ] Run: `.\scripts\Deploy-Compiled.ps1 -Profile testnet`
- [ ] Monitor output for success messages
- [ ] Check for deployment confirmations
- [ ] Verify 5 contracts deployed

#### Bash (Linux/Mac)
- [ ] Open terminal
- [ ] Navigate to project root
- [ ] Run: `bash scripts/deploy-compiled.sh testnet`
- [ ] Monitor output for success messages
- [ ] Check for deployment confirmations
- [ ] Verify 5 contracts deployed

### Option B: Manual Deployment

For each contract:
1. [ ] Compile MoveJS to Move
   ```bash
   node packages/cli/dist/index.js compile -s file.movejs > output.move
   ```

2. [ ] Create project structure
   ```bash
   mkdir -p deploy/ModuleName/sources
   cp output.move deploy/ModuleName/sources/module.move
   ```

3. [ ] Create Move.toml
   ```toml
   [package]
   name = "ModuleName"
   version = "0.0.1"

   [dependencies.Aptos]
   git = "https://github.com/aptos-labs/aptos-core.git"
   git_subdir = "aptos-move/framework/aptos-framework"
   rev = "main"

   [addresses]
   ModuleName = "0x1"
   ```

4. [ ] Build package
   ```bash
   cd deploy/ModuleName
   movement aptos move build --profile testnet
   ```

5. [ ] Publish to network
   ```bash
   movement aptos move publish --profile testnet
   ```

6. [ ] Verify deployment
   - [ ] Check transaction hash
   - [ ] Wait for confirmation (~10 seconds)
   - [ ] Verify gas usage
   - [ ] Check account balance decreased

## Post-Deployment Verification

### Contract Verification
- [ ] Check each contract deployed successfully
- [ ] Verify transaction hashes in explorer
- [ ] Confirm all 5 contracts are on-chain
- [ ] Check contract code matches generated code

### Account Verification
- [ ] Verify account still has balance
- [ ] Check total gas spent
- [ ] Review transaction history
- [ ] Confirm all transactions successful

### Module Verification
- [ ] List deployed modules: `movement aptos account list --profile testnet`
- [ ] Verify module names
- [ ] Check module addresses
- [ ] Confirm all resources defined

### Functionality Check
- [ ] For each contract, verify:
  - [ ] Init function exists
  - [ ] Getter functions exist
  - [ ] Proper visibility levels
  - [ ] Acquires clauses present
  - [ ] Type conversions correct

## Troubleshooting Checklist

### Compilation Issues
- [ ] Check file path is correct
- [ ] Verify MoveJS syntax is valid
- [ ] Check file encoding (UTF-8)
- [ ] Review error messages
- [ ] Try compiling simple examples first

### Build Issues
- [ ] Verify Move.toml exists
- [ ] Check directory structure is correct
- [ ] Verify Move syntax in generated file
- [ ] Check dependencies are available
- [ ] Clear build artifacts: `rm -rf build/`

### Deployment Issues
- [ ] Verify testnet profile exists
- [ ] Check account has sufficient balance
- [ ] Verify network connectivity
- [ ] Check Movement CLI is installed
- [ ] Review transaction errors

### Network Issues
- [ ] Verify testnet is accessible
- [ ] Check network connectivity
- [ ] Confirm profile configuration
- [ ] Review account credentials
- [ ] Check firewall settings

## Documentation Checklist

- [ ] Read QUICK_REFERENCE.md
- [ ] Read SETUP_AND_DEPLOYMENT.md
- [ ] Read COMPILER_STATUS.md
- [ ] Review example contracts
- [ ] Check generated code samples
- [ ] Review deployment scripts

## Post-Deployment Steps

### Immediate (Same Day)
- [ ] Document deployment transaction hashes
- [ ] Record deployed module addresses
- [ ] Note gas fees spent
- [ ] Verify all contracts functional
- [ ] Test basic contract calls

### Short Term (This Week)
- [ ] Integrate with frontend
- [ ] Setup backend API
- [ ] Create deployment documentation
- [ ] Document known limitations
- [ ] Plan next features

### Medium Term (Next Week)
- [ ] Audit contracts
- [ ] Optimize gas usage
- [ ] Add more examples
- [ ] Prepare mainnet deployment
- [ ] Plan v2 features

## Success Criteria

### Compilation
- ✅ All 5 examples compile without errors
- ✅ Generated code has valid Move syntax
- ✅ Type conversions are correct
- ✅ Function visibility is proper

### Deployment
- ✅ All 5 contracts deploy to testnet
- ✅ Transaction hashes recorded
- ✅ Gas fees reasonable
- ✅ Modules appear on-chain

### Verification
- ✅ Contracts callable
- ✅ State mutations work
- ✅ Getter functions work
- ✅ Error handling works

## Notes Section

Use this section to record:
- [ ] Deployment timestamps
- [ ] Transaction hashes
- [ ] Module addresses
- [ ] Gas costs
- [ ] Issues encountered
- [ ] Solutions applied

---

## Quick Reference Commands

### Setup
```bash
pnpm build                      # Build all packages
movement aptos init --profile testnet  # Setup testnet
movement aptos account fund-with-faucet --profile testnet  # Fund account
```

### Compilation
```bash
node packages/cli/dist/index.js compile -s file.movejs      # Compile to stdout
node packages/cli/dist/index.js compile -s file.movejs -o output.move  # Save to file
```

### Deployment
```bash
.\scripts\Deploy-Compiled.ps1 -Profile testnet  # Automated (Windows)
bash scripts/deploy-compiled.sh testnet          # Automated (Linux/Mac)
movement aptos move publish --profile testnet    # Manual publish
```

### Verification
```bash
movement aptos account list --profile testnet              # List modules
movement aptos account module-details <addr> <module>      # Module info
movement aptos account transactions --profile testnet      # Transaction history
```

---

**Status**: Ready for Deployment  
**Last Updated**: January 9, 2026  
**Next Review**: After first testnet deployment
