# ShepThon Alpha — Backend Language for Non-Technical Founders (Edition 2025)

**Phase:** 2 — OpenAI App Development / Early Backend  
**Products:** ShepThon (backend DSL), Shipyard (Sandbox), ShepLang, BobaScript

---

## 1. Purpose

ShepThon is a **backend scripting language for non-technical founders** that:

- feels as simple as Python,
- runs on a Node/Edge-style runtime,
- is designed to be written and explained by AI.

In the **Shipyard** sandbox, ShepLang describes the **UI** and flows, while ShepThon describes:

- **APIs** (endpoints),
- **data models** (simple records),
- **jobs** (cron-like background tasks),
- **actions** (business logic).

Together:

> ShepLang (frontend) + ShepThon (backend) + BobaScript (shared brain)  
> gives non-technical founders a full-stack MVP environment inside Shipyard.

---

## 2. Goals & Non-Goals

### 2.1 Goals (Alpha)

1. **Human-first syntax**
   - Reads like English + Python.
   - Minimal keywords, no tricky types.

2. **Express backend basics**
   - Models (like database tables).
   - Endpoints (GET, POST).
   - Simple jobs (scheduled tasks).
   - In-memory or simple store (no complex DB yet).

3. **First-class in Shipyard**
   - Write ShepThon code in a backend pane (or file).
   - Run it inside the sandbox dev server.
   - Call endpoints from ShepLang frontends.

4. **AI-native**
   - Easy for AI to generate valid ShepThon.
   - Easy to "Explain what this backend does" from the code.

5. **Safe / predictable**
   - No arbitrary Node.js access from ShepThon in Alpha.
   - Only whitelisted operations: `db`, `log`, `http`, `queue`.

### 2.2 Non-Goals (Alpha)

- No multi-tenant, multi-region infra.
- No real external DB (can be swapped later).
- No advanced auth/permissions (simple API key or "open dev mode").
- No full blown ORM/SQL; just a simple model store.

---

## 3. Mental Model (How Founders Think About It)

> "ShepLang is how I describe my screens.  
>  ShepThon is how I describe my backend logic.  
>  Shipyard runs both and shows me a working app."

Example: "dog reminder" backend:

```shepthon
app DogReminders {

  model Reminder {
    id: id
    text: string
    time: datetime
    done: bool = false
  }

  endpoint GET "/reminders" -> [Reminder] {
    return db.Reminder.findAll()
  }

  endpoint POST "/reminders" (text: string, time: datetime) -> Reminder {
    let reminder = db.Reminder.create({ text, time })
    return reminder
  }

  job "mark-due-as-done" every 5 minutes {
    let due = db.Reminder.find({ time <= now(), done: false })
    for r in due {
      db.Reminder.update(r.id, { done: true })
    }
  }
}
```

Shipyard should:
- parse this,
- spin up these endpoints/jobs locally,
- allow ShepLang frontends to call `/reminders`.

---

## 4. Integration with ShepLang, BobaScript, Shipyard

### 4.1 Data & Actions Flow

ShepLang defines actions like:
```sheplang
action AddReminder(text, time) {
  call POST "/reminders"(text, time)
}
```

ShepThon defines what `/reminders` actually does.

BobaScript remains the intermediate representation for:
- UI structure (from ShepLang),
- optional backend metadata (later).

For Alpha, integration can be string-based:
- ShepLang: `"call POST /reminders"`
- Shipyard runtime: maps that to the ShepThon-defined endpoint.

### 4.2 Where It Runs (Dev Only)

ShepThon is interpreted/compiled by a Node/TS runtime inside Shipyard.

For Alpha:
- in-memory store only (no real database),
- single-process, dev mode.

### 4.3 Explain & Debug

Shipyard should support:

**Explain backend:**
- Summarizes apps, models, endpoints, jobs in human language.

**Show API Map:**
- Simple table of paths/methods → description.

These are driven by ShepThon's AST, not comments.

---

## 5. Language Design (Alpha Surface Area)

We intentionally keep the language small.

### 5.1 Top-Level

`app <Name> { ... }` – required root block.

Inside an app:
- zero or more model definitions,
- zero or more endpoint definitions,
- zero or more job definitions.

### 5.2 Models

Shape:
```shepthon
model User {
  id: id
  email: string
  createdAt: datetime
}
```

Supported field types (Alpha):
- `id`
- `string`
- `int`
- `float`
- `bool`
- `datetime`
- `json` (catch-all)

Default values allowed: `= <literal>`.

Models are backed by an in-memory store with simple CRUD operations via `db.<ModelName>`.

### 5.3 Endpoints

Shape:
```shepthon
endpoint GET "/users" -> [User] {
  return db.User.findAll()
}

endpoint POST "/users" (email: string) -> User {
  let user = db.User.create({ email })
  return user
}
```

Rules:
- Methods supported: `GET`, `POST` (Alpha).
- Path: string literal starting with `/`.
- Optional input parameters: `(name: type, ...)`.
- Return type: `Type` or `[Type]`.
- Body:
  - `let` bindings,
  - access to `db`, `log`, `now()`,
  - `return` (single).

### 5.4 Jobs

Shape:
```shepthon
job "cleanup" every 1 hour {
  log.info("Running cleanup")
  db.Session.deleteWhere({ expired: true })
}
```

Scheduling expressions (Alpha):
- `every <N> minutes`
- `every <N> hours`
- `every <N> days`

Jobs run via Shipyard's dev scheduler (Node timer).

### 5.5 Expressions / Statements

Alpha subset:
- `let name = expression`
- `if condition { ... } else { ... }` (optional in Alpha)
- `for item in collection { ... }`
- `return expression`

Function calls on limited globals:
- `db.<Model>.findAll()`
- `db.<Model>.find(criteria)`
- `db.<Model>.create(object)`
- `db.<Model>.update(id, object)`
- `db.<Model>.delete(id)`
- `log.info(...)`, `log.error(...)`
- `now()`

---

## 6. Runtime & Execution Model (Alpha)

**Parser:** ShepThon text → AST (TypeScript).

**Checker:** validate types and references (models/endpoints/jobs).

**Runtime:**
- builds an internal registry:
  - apps
  - models & their stores
  - endpoints (method + path → handler)
  - jobs (cron-like tasks)
- exposes an HTTP server (internal to Shipyard dev):
  - e.g. `http://localhost:<port>/api/<app>/<path>`

Shipyard frontends (ShepLang-based) can:
- call endpoints via fetch,
- or use a helper API inside the sandbox runtime.

---

## 7. Alpha Done Definition

ShepThon Alpha is considered **DONE** when:

1. A sample ShepThon file like `examples/dog-reminders.shepthon`:
   - parses without errors,
   - registers models/endpoints/jobs in the runtime.

2. Shipyard can:
   - list available endpoints,
   - call them from:
     - an internal test harness, AND
     - a ShepLang frontend via `call POST "/reminders"`.

3. There's an **Explain** feature:
   - clickable UI in Shipyard that summarizes ShepThon backend in plain English.

4. There's at least one E2E example:
   - ShepLang screen + ShepThon backend + running dog-reminder app in the sandbox.

5. `pnpm run build` (or equivalent) stays green.

---

## 8. Founder Narrative

ShepThon makes backend logic feel like English and behave like code.

In the Shipyard sandbox, a founder can describe what should happen — "save this reminder", "send this message", "clean up old data" — and get a working backend without ever touching Node, Python, or databases.

---

## 9. Future Phases (Not in Alpha)

- Real database integration (Supabase, Postgres).
- Auth / users / sessions.
- Deeper BobaScript integration.
- Deployment as serverless functions via Vercel or similar.
- Performance and scaling concerns.

---

## Founder Takeaways

- ShepThon gives you the Python-shaped backend your stack was missing — but tuned for founders, not developers.
- Alpha runs entirely inside Shipyard; no extra infra or deployments.
- The spec keeps scope tight: models, endpoints, jobs, and a simple in-memory DB are enough to build real MVPs.
