# Js2Move Frontend (Web Playground)

This frontend is the official web playground for the Js2Move project and is part of the monorepo (not a standalone package).
It provides a developer UI to author MoveJS inputs, compile them with the local `@js2move/compiler`, preview generated Move code, and interact with Aptos wallets.

Quick start (from repository root)

- Install deps: `pnpm install`
- Run dev server: `pnpm -C frontend dev` or `pnpm -w --filter @js2move/frontend dev`
- Build production bundle: `pnpm -C frontend build`

Why this is part of the repo

- The playground integrates tightly with `@js2move/compiler` via `workspace:*` dependency, making it convenient to iterate on the compiler and UI together.
- Keeping the frontend inside the monorepo simplifies contribution, testing, and deterministic fixture generation.

Features

- React + TypeScript + Vite
- Tailwind CSS for styling
- Monaco editor with MoveJS language support (custom language extension under `src/features/playground/monaco`)
- Compiler bridge (`src/lib/compiler/`) that calls into the local compiler to generate Move source
- Wallet integration using `@aptos-labs/wallet-adapter-react` (optional; used for previewing interactions)

Project structure (high level)

- `src/`
  - `features/landing/` — marketing pages (landing, blog previews, docs links)
  - `features/playground/` — the core playground UI (editor, output pane, toolbars)
  - `lib/compiler/` — compiler bridge & helpers
  - `lib/wallet/` — wallet provider and hooks
  - `components/` — shared UI components and small visuals/effects
  - `public/` — static assets
- `index.html`, `vite.config.ts`, `tailwind.config.js` — tooling & build config

Scripts

- `dev` — start Vite dev server
- `build` — TypeScript build + `vite build`
- `typecheck` — run `tsc` type-check only
- `lint` / `lint:fix` — ESLint checks and auto-fix
- `format` — run Prettier

Local development tips

- Start the monorepo install once: `pnpm install`
- Run the dev server from repo root (recommended): `pnpm -w --filter @js2move/frontend dev`
- The playground will import the local compiler package automatically (workspace protocol) so changes in `packages/compiler` can be tested live after rebuilding that package.

Notes for contributors

- Keep UI, styles, and compiler integration tests small and focused.
- If you change generated Move formatting or compiler output, update any relevant fixtures and tests in `packages/compiler`.
- Add unit tests where appropriate and run `pnpm -w test` to run the full test suite.

Linting & formatting

- The project uses ESLint + TypeScript rules and Prettier for consistent styling. Run `pnpm -C frontend lint` and `pnpm -C frontend format`.

If you'd like, I can also:
- Add a `CONTRIBUTING` snippet to the README showing how to develop across compiler <-> frontend changes
- Add a small `scripts/regen-fixtures.js` in `packages/compiler` and reference it here


