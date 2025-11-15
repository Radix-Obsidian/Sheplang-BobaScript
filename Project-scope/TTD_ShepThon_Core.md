# TTD — ShepThon Core (Parser, Runtime, Shipyard Integration)

**Phase:** 2 — ShepThon Alpha Core  
**Scope:** Implement a minimal but real ShepThon language and runtime inside the existing repo, wired into the Shipyard sandbox.

---

## A. Constraints

- Do NOT change ShepLang or BobaScript behavior.
- Do NOT break existing Shipyard sandbox flows.
- All ShepThon runtime activity must stay **in dev mode** (no external services).
- Only use:
  - Node/TypeScript,
  - existing build toolchain (TS + pnpm),
  - in-memory data stores.

---

## B. Deliverables

1. **ShepThon Core Library**
   - Parser: source string → AST.
   - Checker: validates models/endpoints/jobs.
   - Runtime: bootstraps models, endpoints, jobs.

2. **Shipyard Integration**
   - A "Backend" panel that:
     - loads a `.shepthon` example,
     - shows models/endpoints/jobs,
     - lets ShepLang code call endpoints via a helper.

3. **Dog Reminder E2E Example**
   - One ShepLang frontend file.
   - One ShepThon backend file.
   - Clicking in the UI actually exercises the backend.

---

## C. Tasks

### C1. Core Library

**C1.1. AST Types**

- Create a `shepthon` core package (wherever the repo organizes language libs).
- Define TypeScript types:
  - `ShepThonApp`
  - `ModelDefinition`
  - `EndpointDefinition`
  - `JobDefinition`
  - `Statement`, `Expression`, etc.

**C1.2. Parser (MVP)**

- Implement a tolerant parser:
  - Enough to support the samples from `PRD_ShepThon_Alpha.md`.
  - Prefer a hand-written or small recursive descent parser over massive infra.
- Parse:
  - `app` block,
  - `model` blocks,
  - `endpoint` blocks,
  - `job` blocks,
  - `let`, `return`, `for` loops,
  - function calls on `db`, `log`.

**C1.3. Semantic Checker**

- Validate:
  - Model names are unique.
  - Endpoint paths/methods are unique per app.
  - Jobs have valid schedules.
  - Types exist (model references, primitives).
- Return a structured diagnostics list.

---

### C2. Runtime

**C2.1. In-memory DB**

- Implement a simple in-memory store:
  - `tables: Record<string, Record<string, any>>`
  - `create`, `findAll`, `find`, `update`, `delete`, `deleteWhere`.

**C2.2. Endpoint Router**

- Build an internal registry:
  - `routes: { [method]: { [path]: handlerFunction } }`

- Handler function signature:
  - `(params, body, context) => Promise<any>`

- Execution steps:
  1. Inject `db`, `log`, `now()` into the ShepThon function environment.
  2. Execute statements:
     - `let`, `for`, `return`, simple expressions.
  3. Return a JSON-serializable result.

**C2.3. Job Scheduler**

- Based on the `every <N> minutes|hours|days` syntax:
  - Convert to `setInterval` in Node during dev.
  - Provide a way to **disable** jobs during tests.

---

### C3. Shipyard Integration

**C3.1. Backend Loader**

- In Shipyard's backend side:
  - Add a module that:
    - loads a `.shepthon` example file,
    - passes it through parser + checker,
    - boots the runtime.

- Expose a function like:
  ```typescript
  callShepThonEndpoint(method: string, path: string, body?: any): Promise<any>
  ```

**C3.2. ShepLang Bridge**

- Add a small adapter so that ShepLang actions can call ShepThon endpoints:
  - When Shipyard evaluates a ShepLang `call` like `call POST "/reminders"`, route it through `callShepThonEndpoint`.

**C3.3. Backend Panel UI (minimal)**

- Add a sidebar or tab in Shipyard called "Backend (ShepThon)":
  - Shows:
    - App name.
    - Models list.
    - Endpoints list (method + path).
    - Jobs list (name + schedule).
  - All data comes from the ShepThon AST/runtime.

---

### C4. Example: Dog Reminders App

**C4.1. Backend**

- Add `examples/dog-reminders.shepthon` with the example from the PRD.

**C4.2. Frontend**

- Add a ShepLang file `examples/dog-reminders.shep` that:
  - Lists reminders using `GET /reminders`.
  - Has a simple form to call `POST /reminders`.

**C4.3. Manual E2E**

Scenario:
1. Run Shipyard dev server.
2. Open Dog Reminders example.
3. Add a reminder from the UI.
4. It hits ShepThon backend, stores it in memory.
5. UI updates with the new reminder.

---

### C5. Tests & Stability

**Unit tests:**
- Parser: valid + invalid samples.
- Runtime: model CRUD, endpoint execution.

**Integration tests:**
- Start a tiny ShepThon runtime in test mode.
- Fire a fake request (method + path + body).
- Assert the response and DB state.

**Ensure:**
- `pnpm run build` passes.
- Any existing verify script passes.

---

## D. Success Criteria

1. ShepThon can describe at least one non-trivial app (Dog Reminders).
2. Shipyard can use ShepThon to serve real responses.
3. ShepLang screens can call ShepThon endpoints.
4. Founders can see their backend model/endpoint/job map from the UI.
5. The entire system is dev-only and does not introduce infra complexity.

---

## Founder Takeaways

This TTD makes ShepThon real without over-building: small language, in-memory runtime, tight Shipyard integration.

Once this is implemented, you can demo:
- "I write screens in ShepLang."
- "I write backend in ShepThon."
- "Shipyard runs it all as a real app, no Python/Node setup."

This is your **"full-stack for founders"** moment — something Python never gave non-technical people out of the box.
