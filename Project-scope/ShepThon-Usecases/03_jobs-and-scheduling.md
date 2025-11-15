# Usecase 03 — Jobs & Scheduling

## Purpose

This file defines **how ShepThon jobs should behave**:

- Parsing schedule expressions.
- Registering jobs.
- Running them in dev mode.
- Not breaking tests.

---

## ShepThon Job Examples

```shepthon
app Maintenance {

  model Session {
    id: id
    userId: id
    expiresAt: datetime
  }

  job "cleanup-expired-sessions" every 15 minutes {
    let expired = db.Session.find({ expiresAt <= now() })
    for s in expired {
      db.Session.delete(s.id)
    }
    log.info("Cleaned " + expired.length + " expired sessions")
  }

  job "daily-report" every 1 day {
    // In Alpha we can just log instead of sending real emails
    log.info("Running daily report job at " + now())
  }
}
```

---

## Scheduling Semantics (Alpha)

**Supported patterns in Alpha:**
- `every <N> minutes`
- `every <N> hours`
- `every <N> days`

**Runtime requirement:**
- Convert `every N minutes` to a `setInterval` (or similar) in Node/TS.
- Jobs should start after Shipyard dev server boots.

**In tests, there should be a way to:**
- disable job timers, and/or
- trigger a job manually via a helper.

**Example helper (implementation detail, not language):**
```typescript
await runtime.runJobOnce("cleanup-expired-sessions")
```

---

## Execution Semantics

Inside a `job` block:
- `let`, `for`, `if`, `db` operations, `log` calls are allowed.
- `return` is optional (jobs don't need to return a value).

**Errors thrown inside jobs:**
- Should be logged via `log.error`.
- Should not crash the whole Shipyard dev server in Alpha.

---

## Expected Behavior Example

Given:
```shepthon
job "cleanup-expired-sessions" every 15 minutes { ... }
```

**Behavior:**

1. **At startup**, the runtime:
   - Parses the job.
   - Registers it with an internal scheduler.

2. **Every 15 minutes:**
   - Executes the job body.
   - Runs the `db.Session.find` query.
   - Deletes expired sessions.
   - Logs how many were deleted.

3. **For testing:**
   - It should be possible to:
     - Create fake expired sessions in the in-memory store.
     - Run the job once.
     - Confirm they're deleted.

---

## Notes for Implementers / AI

- Do not implement a full cron system in Alpha.
- The key is to:
  - Parse `every N <unit>` correctly,
  - Translate to a reasonable dev-time interval,
  - Provide a clean hook for tests.

- If future phases add more advanced scheduling, they must keep these examples working.
