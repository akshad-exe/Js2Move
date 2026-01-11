# 📁 Folder Structure Design Decisions

## Why This Structure?

### Top-Level Organization
```
Js2Move/
├── frontend/          ← React/Vite web app
├── packages/          ← Monorepo packages
│   ├── backend/       ← Node.js API server
│   ├── compiler/      ← MoveJS → Move transpiler
│   ├── cli/           ← Command-line tool
│   ├── sdk/           ← TypeScript SDK
│   └── shared-types/  ← Shared TypeScript types
├── docker/            ← Container configuration
├── infra/             ← Infrastructure as Code
├── scripts/           ← Build & utility scripts
└── docs/              ← Documentation
```

---

## Design Rationale

### 1. **Monorepo Structure** (`packages/`)
**Why:**
- Multiple related projects (compiler, backend, SDK, CLI)
- Share common types and utilities
- Single version control, single deployment
- Easier dependency management with pnpm workspaces
- Coordinated releases

**Alternative:** Separate repos
- ❌ Would require separate CI/CD pipelines
- ❌ Version management complexity
- ❌ Type safety issues across repos

### 2. **Compiler Package** (`packages/compiler/`)
**Why:**
- Converts MoveJS → Move (language transpilation)
- Not a dependency—a build tool
- Separate package allows versioning independently

**Structure:**
```
compiler/
├── src/               ← Transpiler source code
├── examples/          ← MoveJS example contracts
├── fixtures/          ← Test fixtures
├── out/aptos/         ← Generated Move packages
│   ├── example-demonstrates/
│   ├── fixture-contract/
│   ├── fixture-control-flow/
│   └── ... (8 total)
└── scripts/
    └── build-out.js   ← Generate Move packages
```

**Why `out/aptos/`:**
- `out/` = Generated output (not source code)
- `aptos/` = Target framework (Aptos/Movement ecosystem)
- Each subdirectory = Complete Move package with Move.toml

### 3. **Frontend** (`frontend/`)
**Why separate:**
- Web app with different build pipeline (Vite, not pnpm)
- Different tech stack (React, not Node.js)
- Independent deployment possible

**Structure:**
```
frontend/
├── src/
│   ├── App.tsx
│   ├── components/
│   ├── features/
│   ├── hooks/
│   └── lib/
├── public/
└── vite.config.ts
```

### 4. **Backend** (`packages/backend/`)
**Why:**
- Deployment API server
- Integrates compiler + SDK
- REST endpoints for deployment

**Structure:**
```
backend/
├── src/
│   ├── api/           ← Express routes
│   ├── services/      ← Business logic
│   ├── handlers/      ← Request handlers
│   └── config/        ← Configuration
├── prisma/            ← Database schema
└── docs/              ← API documentation
```

### 5. **Scripts Directory** (`scripts/`)
**Why:**
- Build automation
- Deployment helpers
- One-off utilities
- CI/CD integration

**Current scripts:**
```
scripts/
├── build-aptos-cache-image.sh    ← Docker setup
├── dev-all.sh                    ← Start all services
├── check-move-errors.sh          ← Check Move code (NEW)
├── test-and-build.sh             ← Build & test suite (NEW)
├── test-move-unit.sh             ← Move unit tests (NEW)
├── add-unit-tests.js             ← Generate tests (OLD)
└── auto-gen-tests.js             ← Smart test gen (NEW)
```

---

## Generated Code Folder: `packages/compiler/out/aptos/`

### Why This Location?

```
packages/compiler/
├── src/              ← Source of transpiler
├── examples/         ← MoveJS input examples
├── fixtures/         ← Test data
├── out/              ← Generated code (NOT source)
│   └── aptos/        ← Move packages (target framework)
│       ├── example-demonstrates/
│       │   ├── Move.toml
│       │   └── sources/
│       │       └── demonstrates.move
│       ├── fixture-contract/
│       └── ... (6 more)
└── scripts/
    └── build-out.js  ← Generator script
```

### Design Benefits

1. **Isolation from Source**
   - `out/` = Generated, not committed to git
   - `src/` = Source transpiler code

2. **Per-Package Structure**
   - Each package is independent Move project
   - Has its own `Move.toml` and `sources/`
   - Can be deployed independently
   - Can be tested independently

3. **Naming Convention**
   - `example-*` = Example contracts (1 total)
   - `fixture-*` = Test fixtures (7 total)
   - Clear distinction

4. **Build Pipeline**
   ```
   MoveJS examples/fixtures
           ↓
       build-out.js (transpiler)
           ↓
       packages/compiler/out/aptos/
           ↓
       Test & validate
           ↓
       Deploy to Movement network
   ```

---

## Scripts Organization Rationale

### Check All Packages
```bash
bash scripts/check-move-errors.sh packages/compiler/out/aptos
```
- Finds all `Move.toml` files recursively
- Checks each package for syntax errors
- Reports summary

### Test & Build All Packages
```bash
bash scripts/test-and-build.sh
```
- Same recursive pattern
- Builds + tests each package
- Shows pass/fail per package

### Auto-Generate Tests
```bash
node scripts/auto-gen-tests.js <file.move>
```
- Analyzes individual Move file
- Generates test stubs
- User implements test logic

---

## Summary: Why This Structure?

| Decision | Reason |
|----------|--------|
| Monorepo (`packages/`) | Unified versioning, shared types |
| `compiler/out/aptos/` | Separate generated from source |
| Package-per-contract | Independent testing & deployment |
| Scripts at root | Visible, executable build tools |
| Frontend separate | Different tech stack |
| `fixtures/` in compiler | Test data for transpiler |

This structure enables:
- ✅ Easy bulk operations (test all packages)
- ✅ Clear build pipeline
- ✅ Independent deployments
- ✅ Type-safe across modules
- ✅ Automated testing & validation
- ✅ CI/CD integration

---

## Moving Forward

With this structure:
1. **Check all code** → `check-move-errors.sh <dir>`
2. **Test all packages** → `test-and-build.sh`
3. **Auto-generate tests** → `auto-gen-tests.js <file>`
4. **Deploy specific package** → `movement move publish --package-dir <pkg>`

All automated, all scalable! 🚀
