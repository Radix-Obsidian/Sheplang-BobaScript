# ShepLang Quickstart (Alpha 0.1.x)

> Goal: clone → run → verify in < 5 minutes on Windows/WSL/macOS.

## Prereqs
- Node 20.x, PNPM 9.x  
- PowerShell 7+ recommended (PS 5.1 works with warnings)

## Install
```bash
git clone <your-repo> sheplang
cd sheplang/sheplang
pnpm install
```

## Build & Test (workspace)
```bash
pnpm -w -r build
pnpm -w -r test
```

## Verify (end-to-end)
```bash
pwsh ./scripts/verify.ps1
```
Expected: `=== VERIFY OK ===` and "Playground built".

## Run CLI locally
```bash
node ./packages/cli/dist/index.js help
node ./packages/cli/dist/index.js build examples/todo.shep
node ./packages/cli/dist/index.js dev   examples/todo.shep --port 8787
```

## Playground (browser)
```bash
pnpm --filter @sheplang/playground dev
# open http://localhost:5173
```

## Repo map
```
/sheplang/
  packages/
    language/   # parser (Langium), exports parseShep()
    cli/        # sheplang commands: parse/build/dev/explain/stats
  adapters/
    sheplang-to-boba/  # deterministic Shep→Boba transpiler
  playground/  # zero-backend web playground (Vite)
  scripts/verify.ps1   # CI-like local gate
```

## Common issues
- **Module not found / ESM**: ensure all local imports use `.js` suffix; run `pnpm -w -r build` before using CLI.
- **Bin shims**: Verify calls `node dist/index.js` directly (no PNPM shims). Do the same.
- **Preview title**: `<h1>` is taken from first `Text` node or first component name.

## Contributing (Alpha)
- No placeholders. Tests or snapshots for any change affecting output.
- Edition freeze: see `SYNTAX_FREEZE.md`. Breaking changes need an RFC.
