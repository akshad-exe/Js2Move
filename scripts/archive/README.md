# Archived Scripts

This folder contains scripts that have been archived during the scripts directory cleanup process.

## 📋 Archived Scripts

### Deployment Scripts (Redundant)
- **`test-deployment-mainnet.sh`** - Single package deployment to mainnet (use `test-deployment.sh mainnet` instead)
- **`test-deployment-testnet.sh`** - Single package deployment to testnet (use `test-deployment.sh testnet` instead)
- **`deploy-compiled.sh`** - Outdated deployment script (replaced by `test-deployment.sh`)
- **`Deploy-Compiled.ps1`** - PowerShell version of deploy-compiled.sh (less commonly used)

### Quick Deployment (Outdated)
- **`quick-deploy.sh`** - Hardcoded deployment for specific examples (use `deploy-all.sh` instead)

## 🎯 Why These Were Archived

1. **Consolidation**: Multiple deployment scripts with similar functionality were consolidated into fewer, more flexible scripts
2. **Redundancy**: Scripts that only differed by hardcoded parameters were replaced with parameterized versions
3. **Maintenance**: Reducing the number of scripts to maintain while keeping the same functionality
4. **Platform Focus**: Prioritizing bash scripts over PowerShell for cross-platform compatibility

## 📖 Current Recommended Scripts

For current deployment needs, use:
- **`test-deployment.sh`** - Flexible single package deployment (supports all networks)
- **`deploy-all.sh`** - Batch deployment for all packages

## 🔄 When to Check Archived Scripts

- Historical reference for understanding script evolution
- If you need the exact behavior of an archived script for legacy reasons
- Researching previous deployment approaches

---

**Note**: These scripts are kept for historical reference but are not actively maintained. For current development, use the active scripts in the parent `scripts/` directory.