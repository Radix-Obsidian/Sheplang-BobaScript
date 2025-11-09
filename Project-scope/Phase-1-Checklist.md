# ShepLang — Phase 1 Checklist (Transpiler Complete)

Use this checklist to build and verify Phase 1. Each box must be checked before moving to Phase 2. Transpiler generates valid TypeScript from AppModel with snapshots and compile checks.

## Outcome

- [ ] `pnpm -w shep build ./examples/todo.shep` generates `/out/MyTodos/**.ts` files
- [ ] Generated TS compiles cleanly (`tsc --noEmit`) and snapshots match
- [ ] Templates emit models/views/actions/index with proper imports and signatures

## Repo prerequisites (Blueprint)

- [ ] `packages/compiler` package exists with complete structure
- [ ] `packages/language` Phase 0 complete (parseAndMap returns AppModel)
- [ ] Workspace dependencies configured (`@sheplang/language` in compiler devDeps)
- [ ] `out/` directory in repo root (gitignored for generated files)

Repo Blueprint (Phase 1 additions):
```
/sheplang
  ├─ /out                 # generated TS + explain (gitignored)
  │   └─ /MyTodos         # from examples/todo.shep
  │       ├─ tsconfig.json
  │       ├─ models/Todo.ts
  │       ├─ views/Dashboard.ts
  │       ├─ actions/CreateTodo.ts
  │       └─ index.ts
  ├─ /packages
  │   ├─ /language        # ✅ Phase 0 complete
  │   └─ /compiler        # 🆕 Phase 1
  │       ├─ package.json
  │       ├─ tsconfig.json
  │       ├─ src/
  │       │   ├─ types.ts      # AppModel, GenResult
  │       │   ├─ templates.ts  # emit functions
  │       │   ├─ transpiler.ts # orchestrate generation
  │       │   └─ fsio.ts       # file writing utility
  │       └─ test/
  │           └─ codegen.snapshot.test.ts
```

## Implementation tasks (Phase 1 scope)

- **Compiler Package Setup**
  - [ ] `packages/compiler/package.json` with TypeScript + Vitest deps
  - [ ] `packages/compiler/tsconfig.json` with strict ES2022 + declarations
  - [ ] Workspace dependency: `"@sheplang/language": "workspace:*"`

- **Types (`types.ts`)**
  - [ ] `AppModel` interface (name, datas[], views[], actions[])
  - [ ] `GenFile` (path, content) and `GenResult` (appName, files[])
  - [ ] Action ops: `add`, `show`, `raw` discriminated union

- **Templates (`templates.ts`)**
  - [ ] `typeMap` for Shep types → TypeScript types
  - [ ] `templateTsConfig()` → generates tsconfig.json
  - [ ] `templateModels()` → data models with fields + rules comments
  - [ ] `templateActions()` → async functions with ops as console.log
  - [ ] `templateViews()` → functions with list/buttons as console.log
  - [ ] `templateIndex()` → imports all + run() function

- **Transpiler (`transpiler.ts`)**
  - [ ] `transpile(app: AppModel)` → GenResult with all files
  - [ ] Orchestrates templates in correct order
  - [ ] Pure function (no FS side effects)

- **FS IO (`fsio.ts`)**
  - [ ] `writeOut(outDir, gen)` → writes files with mkdirSync recursive
  - [ ] Proper path resolution for `/out/<App>/**`

- **CLI Integration (`commands.ts`)**
  - [ ] `buildCommand(inputPath, outBase)` → parse → transpile → write
  - [ ] Error handling for parse diagnostics
  - [ ] Success message with file count

## Verification tasks (TTD traceability)

- **Unit (Vitest)**
  - [ ] U-Temp-01: templateTsConfig generates valid tsconfig.json
  - [ ] U-Temp-02: templateModels maps data fields to TypeScript types
  - [ ] U-Temp-03: templateActions emits async functions with ops
  - [ ] U-Temp-04: templateViews emits functions with UI placeholders
  - [ ] U-Temp-05: templateIndex imports all and provides run()
  - [ ] U-Trans-01: transpile orchestrates all templates correctly
  - [ ] U-IO-01: writeOut creates directory structure and writes files

- **Integration**
  - [ ] I-Trans-01: Parse todo.shep → AppModel → transpile → valid files
  - [ ] I-Compile-01: Generated files compile cleanly with tsc Program
  - [ ] I-CLI-01: `shep build` writes files to /out/<App>

- **E2E**
  - [ ] E2E-01: `pnpm shep build ./examples/todo.shep` creates /out/MyTodos
  - [ ] E2E-02: Generated index.ts imports work and run() executes

- **Snapshots**
  - [ ] Snapshot every generated file content from todo.shep
  - [ ] In-memory TypeScript compilation validation
  - [ ] Zero diagnostic errors on generated code

## Acceptance tests (from PRD)

- [ ] `pnpm shep build examples/todo.shep` creates `/out/MyTodos/` with tsconfig.json
- [ ] Generated models/Todo.ts has correct TypeScript interface
- [ ] Generated actions/CreateTodo.ts has async function signature
- [ ] Generated views/Dashboard.ts has function with console.log calls
- [ ] Generated index.ts imports all components and exports run()
- [ ] `tsc --noEmit` in /out/MyTodos passes with no errors

## Commands (runbook)

- [ ] Install workspace dependencies
  ```
  pnpm i
  ```

- [ ] Build language package (Phase 0)
  ```
  pnpm --filter "@sheplang/language" build
  ```

- [ ] Run compiler tests (first run creates snapshots)
  ```
  pnpm --filter "@sheplang/compiler" test
  ```

- [ ] Dev build command
  ```
  pnpm --filter "@sheplang/cli" dev build ./examples/todo.shep
  ```

- [ ] Verify generated files compile
  ```
  cd out/MyTodos && npx tsc --noEmit
  ```

## Definition of Done (Phase 1)

- [ ] `shep build` generates complete `/out/<App>/**.ts` structure
- [ ] All generated TypeScript compiles cleanly (noEmit check passes)
- [ ] Snapshot tests locked; golden output matches expectations
- [ ] Templates are pure functions, transpiler orchestrates correctly
- [ ] CLI integration complete with proper error handling

---

Owner: __________  Date: __________  Reviewer: __________
