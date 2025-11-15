# Usecase 01 — Dog Reminders (Minimal Full-Stack Example)

## Story (Founder Perspective)

"I want a super simple app that reminds me to take my dog out.

- I want to see a list of reminders.
- I want to add new reminders with text + time.
- I want a background job that marks reminders as `done` once the time has passed."

**ShepLang** handles the **screen + form**.  
**ShepThon** handles the **data + API + job**.

This is the **canonical minimal example** for ShepThon Alpha.

---

## ShepThon Source (DogReminders App)

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

---

## Expected Behavior (Runtime Semantics)

### Models

**Reminder** should be stored in an in-memory table (Alpha):
- Table name: `"Reminder"` or `"DogReminders.Reminder"`.
- Fields:
  - `id`: auto-generated unique ID.
  - `text`: user-provided string.
  - `time`: datetime.
  - `done`: defaults to `false`.

---

### Endpoint: GET /reminders

- **Method:** GET
- **Path:** `/reminders`
- **Input:** none
- **Output:** JSON array of reminders.

**Response example:**
```json
[
  {
    "id": "r1",
    "text": "Take Milo out",
    "time": "2025-11-14T10:00:00.000Z",
    "done": false
  }
]
```

---

### Endpoint: POST /reminders

- **Method:** POST
- **Path:** `/reminders`
- **Input body (Alpha expectation):**
```json
{
  "text": "Take Milo out",
  "time": "2025-11-14T10:00:00.000Z"
}
```

- **Output:** Newly created reminder record.

**Example:**
```json
{
  "id": "r2",
  "text": "Take Milo out",
  "time": "2025-11-14T10:00:00.000Z",
  "done": false
}
```

---

### Job: "mark-due-as-done" every 5 minutes

A scheduler should run this function every 5 minutes (dev mode).

**Logic:**
1. Query all reminders where `time <= now()` and `done == false`.
2. For each, set `done = true`.

**Implementation detail for AI:**
- It's acceptable to simulate scheduling with `setInterval` in dev.
- There should be a way to:
  - disable jobs in tests,
  - or manually trigger them via a helper.

---

## Integration Expectations in Shipyard

In the Shipyard sandbox, we expect:

**A ShepLang frontend making calls:**
```sheplang
action AddReminder(text, time) {
  call POST "/reminders"(text, time)
}

action LoadReminders() {
  load GET "/reminders"
}
```

- The runtime maps these to the ShepThon endpoints above.
- The UI shows live updates when:
  - new reminders are added,
  - jobs mark them as done.

---

## Notes for Implementers / AI

- This example should be the **first thing** that passes end-to-end:
  - parse ShepThon → build runtime → start dev server → call endpoints.

- If any future change breaks this example:
  - treat it as a **breaking change** to ShepThon semantics.

- This usecase is intentionally small but touches:
  - models
  - GET/POST endpoints
  - job
  - in-memory data
  - time-based logic
