# Usecase 05 — Errors & Validation

## Purpose

Define how ShepThon should behave when things go wrong, in a way that is:

- safe for the backend,
- understandable for non-technical founders.

---

## Example: Required Fields

```shepthon
app UserSignup {

  model User {
    id: id
    email: string
    createdAt: datetime
  }

  endpoint POST "/signup" (email: string) -> User {
    if not email {
      error 400 "Email is required"
    }

    let user = db.User.create({
      email,
      createdAt: now()
    })

    return user
  }
}
```

---

## Expected Behavior

**If email is missing or empty in the request:**
- The endpoint returns an error with:
  - **HTTP status:** 400
  - **Message:** "Email is required"

**Shipyard should:**
- show this to the frontend in a friendly way,
  - e.g. "Email is required (400)",
- not crash the dev server.

---

## Example: Not Found

```shepthon
endpoint GET "/users/:id" (id: id) -> User {
  let user = db.User.findOne({ id })
  if not user {
    error 404 "User not found"
  }
  return user
}
```

**Expected Behavior:**

If `id` does not exist:
- Returns status `404` and message "User not found".

---

## What `error` Should Mean in Alpha

The `error` keyword in ShepThon (conceptually):
- Signals an error condition with:
  - optional HTTP status,
  - human-readable message.

**The runtime should:**
- stop executing the endpoint body,
- return a structured error to the caller.

**Suggested internal shape (implementation detail):**
```json
{
  "ok": false,
  "status": 400,
  "message": "Email is required"
}
```

Shipyard's HTTP layer may translate this into a real HTTP response when needed.

---

## Behavior in Jobs

Inside a `job { ... }` block:
- If an uncaught error occurs:
  - The job should log it via `log.error`.
  - The scheduler should continue running future executions.
  - The dev server must not crash.

We don't necessarily need the `error` keyword inside jobs in Alpha; it may be added later if needed.

---

## Founder Experience

When something goes wrong, Shipyard should make it obvious:

- Which endpoint failed.
- What the error message was.
- Which line or block in ShepThon likely caused it (if possible).

**The goal is for a non-technical founder to read:**
- "Email is required (400)"

**and understand what to fix in either:**
- their frontend (missing field), or
- their backend (bad validation).
