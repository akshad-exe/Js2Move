# Js2Move — Complete Movement Development Platform

Js2Move is a **complete development platform** for Movement blockchain. Write smart contracts in JavaScript-like syntax, compile to Move, and deploy with one click.

> **Think Hardhat for Movement** - Write, compile, test, and deploy all in one place.

## 🎯 What This Does

```
Write .movejs → Compile to .move → Deploy to Blockchain
(JS-like DSL)   (Our Compiler)    (One-Click Deploy) ⭐ NEW!
```

## ✨ Features

### Compilation
- **🔄 DSL Compiler**: Transform `.movejs` → `.move` source code
- **🧪 Auto-Generated Tests**: Fixture-based testing system
- **📚 Rich Examples**: Learn MoveJS with progressive examples

### Deployment ⭐ NEW!
- **🚀 One-Click Deploy**: Deploy from web UI with a button
- **💻 CLI Deployment**: `movejs deploy Token.movejs --network testnet`
- **📊 Deployment Tracking**: See all your deployed contracts
- **🌐 Multi-Network**: Deploy to testnet or mainnet

### Developer Tools
- **🛠️ CLI Tool**: Compile and deploy from command line
- **🌐 Web IDE**: Online editor with compilation and deployment
- **📡 API Service**: REST API for programmatic access
- **⚙️ Backend Services**: API + blockchain indexer + deployment service

### Infrastructure
- **📦 Monorepo**: PNPM workspace with optimized package management
- **📘 TypeScript**: Full type safety across all packages
- **🐳 Docker Support**: Containerized development
- **🔄 CI/CD Ready**: GitHub Actions workflows included

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PNPM 8+
- Docker (optional)

### Installation

1. **Clone this repository**
   ```bash
   git clone <your-repo-url>
   cd Js2Move
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development**
   ```bash
   # Start all services
   ./scripts/dev-all.sh
   
   # Or start individually
   pnpm --filter @js2move/backend dev
   pnpm --filter @js2move/frontend dev
   ```

## 🏗️ Codebase Structure

```
Js2Move/
├── packages/
│   ├── compiler/                # Core compiler (lexer → parser → generator)
│   │   ├── src/
│   │   │   ├── lexer/          # Tokenization
│   │   │   ├── parser/         # AST building
│   │   │   ├── generator/      # Move code generation
│   │   │   └── templates/      # Code generation templates
│   │   ├── examples/           # Sample .movejs files
│   │   └── tests/fixtures/     # Auto-discovered test cases
│   ├── cli/                    # Command-line interface
│   ├── backend/                # API service + indexer
│   ├── sdk/                    # JavaScript/TypeScript SDK
│   └── shared-types/           # Shared TypeScript types
├── frontend/                   # Next.js 14 web application
├── docker/                     # Docker configurations
├── docs/                       # Documentation
├── PROJECT_OVERVIEW.md         # Complete project explanation
├── QUICK_START.md              # New team member guide
└── pnpm-worcompiler` | DSL compiler (lexer, parser, generator) | 0.1.0 |
| `@js2move/cli` | Command-line compilation tool | 0.1.0 |
| `@js2move/backend` | API service & blockchain indexer

## 📦 Packages

| Package | Description | Version |
|---------|-------------|---------|
| `@js2move/backend` | Node.js API & blockchain indexer | 0.1.0 |
| `@js2move/contracts` | Move smart contracts | 0.1.0 |
| `@js2move/sdk` | JavaScript/TypeScript SDK | 0.1.0 |
| `@js2move/shared-types` | Shared TypeScript types | 0.1.0 |
| `@js2move/frontend` | Next.js 14 web application | 0.1.0 |

## 🔧 Configuration

### Workspace Management

This repository uses PNPM workspaces. Key commands:

```bash
# Install dependencies for all packages
pnpm install

# Run command in specific package
pnpm --filter @js2move/backend <command>

# Run command in all packages
pnpm -r <command>

# Add dependency to specific package
pnpm --filter @js2move/backend add <package>
```

### Environment Variables

Create `.env` files in respective packages:

```env
# Backend (.env)
DATABASE_URL=
RPC_ENDPOINT=

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_CHAIN_ID=
```

## ⚠️ Ignored files

This repository's `.gitignore` excludes sensitive files and generated build artifacts. Common ignored patterns include:

- `node_modules/`
- `.env*` (do **not** commit secrets; add `.env.example` instead)
- `.next/` (Next.js build outputs)
- `build/` or `/out/` (build artifacts)
- `coverage/` (test coverage reports)
- `logs` and `*.log`
- `.vercel`, `.DS_Store`

Keep a `.env.example` checked in with non-sensitive defaults so collaborators know which variables to provide.

## 🔨 Build & Deploy

### Build All Packages

```bash
# Build all packages
pnpm -r build

# Build specific package
pnpm --filter @js2move/contracts build
```

### Docker Support

```bash
# Build and run with Docker Compose
cd docker
docker-compose up -d

# Stop services
docker-compose down
```

## 📚 Package Documentation

Each package has its own README with specific setup and usage instructions:

- [Backend](packages/backend/README.md) - API and indexer documentation
- [Contracts](packages/contracts/README.md) - Smart contract development guide
- [SDK](packages/sdk/README.md) - SDK usage and API reference
- [Shared Types](packages/shared-types/README.md) - Type definitions reference

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Blockchain infrastructure providers and the Web3 community for inspiration and tooling
- PNPM for workspace management
- The Web3 community for inspiration and best practices

---

**Built with ❤️ for the Move Ecosystem**



