# frontend

Next.js 14 frontend application for the Js2Move project.

## Quick Start

### Prerequisites

- Node.js 18+
- PNPM 8+

### Installation

```bash
# From repo root
pnpm install

# Start frontend
pnpm --filter @js2move/frontend dev
```

### Environment

Create `.env.local` in the `frontend/` directory with values such as:

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_CHAIN_ID=
NEXT_PUBLIC_MAINNET_RPC=
NEXT_PUBLIC_TESTNET_RPC=
```

> Note: `.env*` and build artifacts are excluded by `.gitignore`. Commit a `.env.local.example` with non-sensitive defaults.

## Scripts

- dev — start the development server (see frontend package.json)
- build — build the production artifact
- start — start the production server

Refer to the frontend `package.json` for exact script names and options.

## Structure

Typical Next.js structure resides in this directory using the App Router (`app/`, `components/`, `public/`, etc.).

## Contributing

Follow the root repository contributing guidelines.