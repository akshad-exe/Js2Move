# @template/shared-types

Shared TypeScript type definitions used across this template monorepo.

> Note: This package is part of a monorepo. Local secrets, build outputs and `node_modules/` are excluded by `.gitignore`. Add sample files like `README` or `types.example.ts` when sharing necessary non-sensitive defaults.

## 📋 Overview

This package provides common TypeScript types and interfaces that are shared between:
- Frontend application
- Backend API
- SDK package
- Testing utilities

Benefits:
- **Type Safety**: Consistent types across all packages
- **Single Source of Truth**: Update types in one place
- **Better DX**: Autocomplete and IntelliSense everywhere
- **Reduced Duplication**: No need to define types multiple times

## 🚀 Quick Start

### Installation

From another package in the monorepo:

```bash
# Add as dependency in package.json
pnpm add @template/shared-types --workspace
```

### Usage

Import types such as Contract, ChainEvent, User, and TransactionStatus from `@template/shared-types` and use them across frontend, backend, and SDK packages for consistent typing. Refer to the `src/` files in this package for the full list of exported types and their definitions.



### Core Types

#### Contract

```typescript
export interface Contract {
  id: string;
  name: string;
  address?: string;
  description?: string;
  deployedAt?: number;
  updatedAt?: number;
}
```

#### ChainEvent

```typescript
export interface ChainEvent {
  id: string;
  contractId?: string;
  type: string;
  data: Record<string, any>;
  blockNumber?: number;
  timestamp?: number;
}
```

#### User

```typescript
export interface User {
  address: string;
  totalVolume: string;
  totalPnl: string;
  activeContracts: number;
  totalContracts: number;
  reputation: number;
  createdAt: number;
}
```

#### Transaction

```typescript
export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  data?: string;
  status: TransactionStatus;
  blockNumber?: number;
  timestamp?: number;
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}
```



#### Request/Response Types

```typescript
export interface DeployContractRequest {
  name: string;
  bytecode: string;
  args?: any[];
}

export interface DeployContractResponse {
  contractId: string;
  address?: string;
  transaction: Transaction;
}

export interface CallContractRequest {
  contractAddress: string;
  method: string;
  args?: any[];
}

export interface CallContractResponse {
  transaction: Transaction;
}
```

#### API Response Wrapper

```typescript
export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  status: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}
```

### Event Types

```typescript
export interface ContractDeployedEvent {
  contractId: string;
  address: string;
  deployer: string;
  txHash: string;
  timestamp: number;
}

export interface ContractCalledEvent {
  contractId?: string;
  contractAddress: string;
  method: string;
  args?: any[];
  txHash: string;
  timestamp: number;
}

export interface TransferEvent {
  from: string;
  to: string;
  value: string;
  token?: string;
  txHash?: string;
  timestamp?: number;
}
```



## 🏗️ Project Structure

```
packages/shared-types/
├── src/
│   ├── index.ts          # Main export file
│   ├── contract.ts       # Contract-related types
│   ├── events.ts         # Event-related types
│   ├── user.ts           # User-related types
│   ├── transaction.ts    # Transaction types
│   ├── api.ts            # API request/response types
│   ├── events.ts         # Event types
│   ├── config.ts         # Configuration types
│   └── utils.ts          # Utility types
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Development

### Build

```bash
pnpm build
```

### Type Checking

Run the project's type-check script or use `tsc --noEmit` as configured to validate type correctness across the package.
Run the project's type-check script or use `tsc --noEmit` as configured to validate type correctness across the package.

### Linting

```bash
pnpm lint
```

## 📦 Exports

All types are exported from the main index file (`src/index.ts`). Import specific types (Contract, ChainEvent, TransactionStatus, etc.) or import the module to access all shared types. Keep the public exports small and stable for downstream consumers.
