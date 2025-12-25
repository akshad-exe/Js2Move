# @template/contracts

Move smart contracts for a generic Web3 application (template boilerplate) built with the Move language.

## 📋 Overview

This package contains Move smart contracts that implement on-chain protocol logic. Typical responsibilities include:
- Core protocol logic (contracts, modules, resources)
- Token or asset management
- Oracle / price feeds integrations
- Governance and access control
- Utility libraries and shared modules

The package is intended as an example scaffold for smart contract development and testing.

## 🚀 Quick Start

### Prerequisites

- Move toolchain (if using Move contracts) OR your chain's development toolchain (e.g., Hardhat, Foundry)
- Rust toolchain (for Move toolchain)
- A funded account on the target testnet (if running integration tests)

### Installation (Move example)

```bash
# Install Move CLI (example for Move development)
curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3

# Verify installation
movement --version
```

> If you are using an EVM toolchain, use `npm`/`pnpm` with Hardhat/Foundry instead.

### Configuration

Initialize your Move project:

```bash
# Initialize Move package (if not already done)
movement move init --name template-contracts

# Update Move.toml with your addresses
```

Edit `Move.toml`:

```toml
[package]
name = "template-contracts"
version = "0.0.0"

[addresses]
template = "_"  # Will be replaced with deployed address

[dependencies]
AptosFramework = { git = "https://github.com/aptos-labs/aptos-core.git", subdir = "aptos-move/framework/aptos-framework", rev = "mainnet" }
```

> Note: Move build outputs and local secrets are excluded by `.gitignore`. Keep deployment addresses and secrets out of source control; use sample files (e.g., `Move.toml.example`) when needed.

### Development

```bash
# Compile contracts
movement move compile

# Run tests
movement move test

# Run specific test
movement move test --filter test_deploy_and_call

# Build with coverage
movement move test --coverage
```

## 🏗️ Contract Structure

```
packages/contracts/
├── sources/
│   ├── token.move           # Token and asset logic
│   ├── protocol.move        # Core protocol logic
│   ├── vault.move           # Vaults / custodial contracts
│   ├── oracle.move          # Price oracle integration
│   └── governance.move      # Governance features
├── tests/
│   ├── token_tests.move
│   ├── protocol_tests.move
│   └── oracle_tests.move
├── Move.toml
└── README.md
```

## 📜 Core Contracts

### Core Contracts

Example contract responsibilities (generic):

- **Token / Asset**: minting, transfers, balances
- **Protocol**: core business logic and state transitions
- **Vaults / Custody**: deposit/withdrawal and accounting
- **Oracle**: price feeds and external data ingestion

```move
module template::protocol {
    public entry fun initialize(
        admin: &signer
    ) { ... }

    public entry fun execute_action(
        user: &signer,
        payload: vector<u8>
    ) { ... }
}
```

Write small, well-specified modules and test each function thoroughly in unit tests.

### Utility Contracts

Common utility contracts may include maintenance tasks, helper libraries, and upgradable patterns. Keep utilities small and reusable.

## 🧪 Testing

### Run All Tests

```bash
movement move test
```

### Run a specific test

```bash
movement move test --filter test_deploy_and_call
```

### Test Coverage

```bash
movement move test --coverage
movement move coverage summary
```

### Example Test

```move
#[test]
fun test_deploy_and_call() {
    let user = account::create_account_for_test(@0x1);
    protocol::initialize(&user);
    // Call a public entry and assert state changes
    // Assertions...
}
```

## 🚀 Deployment

### Testnet Deployment

```bash
# Set up testnet account
movement init --network testnet

# Deploy contracts
movement move publish --named-addresses template=default

# Verify deployment
movement account list --account default
```

### Mainnet Deployment

```bash
# Set up mainnet account
movement init --network mainnet

# Deploy contracts
movement move publish --named-addresses template=default --skip-fetch-latest-git-deps

# Verify on explorer
echo "Check your chain explorer for your deployed address (e.g., https://explorer.example.com/account/<your-address>)"
```

## 🔧 Configuration

### Move.toml Configuration

```toml
[package]
name = "template-contracts"
version = "0.0.0"

[addresses]
template = "0x..." # Your deployment address

[dependencies]
AptosFramework = { git = "https://github.com/aptos-labs/aptos-core.git", subdir = "aptos-move/framework/aptos-framework", rev = "mainnet" }

[dev-dependencies]
```

### Network Endpoints

- Testnet RPC endpoint: https://rpc.example.com/testnet
- Mainnet RPC endpoint: https://rpc.example.com/mainnet

## 📊 Gas Optimization

Tips for optimizing contract gas usage:
- Minimize storage operations
- Use inline functions when appropriate
- Batch operations where possible
- Optimize struct sizes

## 🔒 Security

### Best Practices

- Always validate inputs
- Use proper access controls
- Handle integer overflow/underflow
- Test edge cases thoroughly
- Conduct security audits before mainnet

### Audit Checklist

- [ ] Input validation
- [ ] Access control checks
- [ ] Reentrancy protection
- [ ] Integer overflow checks
- [ ] Test coverage > 80%

## 📚 Resources

- [Movement Labs Documentation](https://docs.movementlabs.xyz/)
- [Move Language Book](https://move-language.github.io/move/)
- [Aptos Move Framework](https://github.com/aptos-labs/aptos-core/tree/main/aptos-move/framework)

## 🤝 Contributing

See the root [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## 📄 License

MIT
