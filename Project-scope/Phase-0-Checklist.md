# ShepLang — Phase 0 Checklist (Parser Complete)

Use this checklist to build and verify Phase 0. Each box must be checked before moving to Phase 1. No stubs; friendly errors; deterministic outputs.

## Outcome

- [x] `pnpm -w --silent shep parse ./examples/todo.shep` prints validated AppModel JSON
- [x] Friendly error format with line/col + single fix tip
- [x] Preprocessor preserves line numbers in errors

## Repo prerequisites (Blueprint)

- [x] Repo matches structure (at minimum for Phase 0)
- [x] `pnpm-workspace.yaml`, `tsconfig.base.json`, `.eslintrc.cjs`, `.prettierrc` present
- [x] `examples/todo.shep` available
- [x] `packages/language` package exists with `src/`
- [x] `packages/cli` package exists with `src/`

Repo Blueprint (reference):
```
/sheplang
  ├─ package.json
  ├─ pnpm-workspace.yaml
  ├─ tsconfig.base.json
  ├─ .eslintrc.cjs
  ├─ .prettierrc
  ├─ README.md
  ├─ /examples
  │   └─ todo.shep
  ├─ /out                 # generated TS + explain (gitignored)
  ├─ /packages
  │   ├─ /language        # Langium grammar → parser/AST/services
  │   │   ├─ package.json
  │   │   ├─ langiumconfig.json
  │   │   └─ src
  │   │      ├─ shep.langium
  │   │      ├─ preprocessor.ts
  │   │      ├─ index.ts
  │   │      └─ mapper.ts
  │   └─ /cli
  │       ├─ package.json
  │       └─ src
  │          ├─ index.ts
  │          └─ commands.ts
  └─ /tooling
      └─ build.mjs
```

## Implementation tasks (Phase 0 scope)

- **Grammar (`shep.langium`)**
  - [x] `app`
  - [x] `data`
  - [x] `fields:`
  - [x] `rules:`
  - [x] `view`
  - [x] `list`
  - [x] `button`
  - [x] `action`
  - [x] `add`
  - [x] `show`

- **Preprocessor (`preprocessor.ts`)**
  - [x] Convert indentation to `{}` after block headers/lines ending with `:`
  - [ ] Inject line mapping (removed from scope)
  - [x] Enforce spaces-only, fixed width; reject tabs/mixed indentation

- **Parser API (`index.ts`)**
  - [x] Export `parseShep(source: string, path?: string)` → `{ ast, diagnostics }`
  - [x] On diagnostics, throw friendly message with line/col and expected token
  - [x] Provide single top fix tip in error

- **Mapper (`mapper.ts`)**
  - [x] Map Langium AST → `AppModel` (see compiler `types.ts`)
  - [x] No defaults/guesswork; only declared source
  - [x] Cross-ref validation (list data exists; button target exists)
  - [x] Type validation (`text|number|yes/no|date|email|id|ID`)

- **CLI `parse` command**
  - [x] `shep parse <file.shep>` calls `parseShep`, prints AppModel JSON
  - [x] Exit codes: `0` success, `1` user error, `2` internal error
  - [x] Error formatter matches spec with fix tip

## Verification tasks (TTD traceability)

- **Unit (Vitest)**
  - [x] U-Pre-01: Preprocessor opens/closes blocks (`app`, `data`, `fields:`, `rules:`, `view`, `action`)
  - [x] U-Pre-02: Mixed indentation rejected with clear message
  - [x] U-Parser-01..12: Grammar cases incl. invalid token, unterminated block, unknown type, cross-ref
  - [x] U-Map-01..05: AST→AppModel (names, fields, widgets, actions, missing refs)
  - [x] U-Err-01..05: Error formatter yields file, line, col, cause, fix tip

- **Integration**
  - [x] I-Parse-01: Parse `examples/todo.shep` end-to-end
  - [x] I-Parse-02: Error line/col matches original `.shep`
  - [x] I-Map-01: Cross-refs resolved (button/action/list/data)
  - [x] I-CLI-01: `shep parse` prints JSON model

- **E2E**
  - [x] E2E-01: `pnpm -w shep parse ./examples/todo.shep` → success

- **Determinism & Snapshots**
  - [x] Snapshot AppModel JSON for `examples/todo.shep` to enforce determinism

## Acceptance tests (from PRD)

- [x] `pnpm shep parse examples/todo.shep` exits 0 and prints AppModel JSON
- [x] Invalid token message example reproduced:
  ```
  Line X, Col Y — expected 'fields:' after 'data Todo:'
  ```
- [x] Round-trip: preprocessor preserves line numbers in reported errors

## Commands (runbook)

- [x] Install deps
  ```
  pnpm i
  ```
- [x] Build language package
  ```
  pnpm -r build
  ```
- [x] Run unit tests
  ```
  pnpm -r test
  ```
- [x] Dev parse (CLI filtered)
  ```
  pnpm -r --filter ./packages/cli dev parse ./examples/todo.shep
  ```

## Definition of Done (Phase 0)

- [x] `shep parse` prints AppModel JSON (Langium AST + mapper)
- [x] Friendly NL errors: exact line/col + expected token + one fix tip
- [x] Snapshots locked; tests (unit/integration/E2E) green
- [x] Lint/typecheck pass; no stubs or TODOs implying later replacement

---

Owner: __________  Date: __________  Reviewer: __________
