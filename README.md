# Web3 Monorepo Boilerplate

A production-ready, opinionated monorepo boilerplate for building Web3 applications with smart contracts, backend services, SDK, and frontend.

## ✨ Features

- **📦 Monorepo Structure**: PNPM workspace with optimized package management
- **🔗 Smart Contracts**: Move-based contracts for blockchain deployment
- **⚙️ Backend Services**: Node.js/TypeScript API with blockchain indexer
- **🛠️ SDK Package**: JavaScript/TypeScript SDK for contract interaction
- **🎨 Frontend**: Next.js 14 with App Router and Wallet integration
- **📘 TypeScript**: Full type safety across all packages
- **🐳 Docker Support**: Containerized development and deployment
- **🔄 CI/CD Ready**: GitHub Actions workflows included
- **📚 Shared Types**: Common TypeScript definitions across packages

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PNPM 8+
- Docker (optional)

### Installation

1. **Clone this repository**
   ```bash
   git clone <your-repo-url>
   cd Monorepo-template
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
   pnpm --filter @template/backend dev
   pnpm --filter frontend dev
   ```

## 🏗️ Project Structure

```
monorepo-template/
├── frontend/                    # Next.js 14 application
├── packages/
│   ├── backend/                 # API + Indexer service
│   ├── contracts/               # Move smart contracts
│   ├── sdk/                     # JavaScript/TypeScript SDK
│   └── shared-types/            # Shared TypeScript types
├── docker/                      # Docker configurations
├── infra/                       # CI/CD and infrastructure
├── scripts/                     # Development scripts
├── docs/                        # Documentation
├── pnpm-workspace.yaml          # PNPM workspace config
└── PROJECT_STRUCTURE.md         # Detailed structure docs
```

## 📦 Packages

| Package | Description | Version |
|---------|-------------|---------|
| `@template/backend` | Node.js API & blockchain indexer | 0.0.0 |
| `@template/contracts` | Move smart contracts | 0.0.0 |
| `@template/sdk` | JavaScript/TypeScript SDK | 0.0.0 |
| `@template/shared-types` | Shared TypeScript types | 0.0.0 |
| `@template/frontend` | Next.js 14 web application | 0.0.0 |

## 🔧 Configuration

### Workspace Management

This monorepo uses PNPM workspaces. Key commands:

```bash
# Install dependencies for all packages
pnpm install

# Run command in specific package
pnpm --filter @template/backend <command>

# Run command in all packages
pnpm -r <command>

# Add dependency to specific package
pnpm --filter @template/backend add <package>
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
pnpm --filter @template/contracts build
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

**Built with ❤️ for the Web3 community**



