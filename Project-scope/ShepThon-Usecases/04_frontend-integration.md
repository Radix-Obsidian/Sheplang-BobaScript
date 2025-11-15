# Usecase 04 — Frontend (ShepLang) Integration

## Purpose

Define how **ShepLang frontend code** should call **ShepThon backend endpoints** inside Shipyard.

**The goal:**  
A non-technical founder should be able to:

- write ShepLang screens,
- write ShepThon backend,
- click buttons and see real data flowing between them.

---

## Example Pair: Dog Reminders (ShepLang + ShepThon)

### ShepThon (Backend)

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
}
```

---

### ShepLang (Frontend)

```sheplang
component RemindersPage {
  state reminders = []

  on mount {
    action LoadReminders()
  }

  "Dog Reminders"

  for r in reminders {
    show r.text
  }

  form AddReminderForm(text: string, time: string) {
    submit {
      action AddReminder(text, time)
    }
  }
}

action LoadReminders() {
  load GET "/reminders" into RemindersPage.reminders
}

action AddReminder(text, time) {
  call POST "/reminders"(text, time)
  action LoadReminders()
}
```

**Note:** ShepLang syntax here is illustrative; the exact form should match the current ShepLang spec.  
The important part is how `load GET "/reminders"` and `call POST "/reminders"` conceptually work.

---

## Integration Contract (Runtime Level)

Shipyard needs a **bridge layer** that:
- knows which ShepThon app is active (e.g. `DogReminders`),
- routes paths like `GET "/reminders"` to the correct ShepThon endpoint,
- returns data in a format ShepLang can attach to state.

**We expect something like this at runtime (implementation detail):**

```typescript
// Pseudocode
const result = await callShepThonEndpoint("GET", "/reminders", null)
// result is an array of Reminder objects
```

**And ShepLang `load` semantics:**
```sheplang
load GET "/reminders" into RemindersPage.reminders
```
- calls ShepThon backend
- sets that state to the returned array

---

## Requirements for AI / Implementers

**ShepThon does not need to know about ShepLang.**  
**ShepLang does not need to know how ShepThon is implemented.**

The shared contract is:

**Method:** `GET` / `POST`  
**Path:** string like `"/reminders"` or `"/leads/:id/notes"`  
**Input:**
- path parameters
- body parameters (JSON)

**Output:**
- JSON object or array

---

**Shipyard's runtime should provide:**

```typescript
async function callShepThonEndpoint(
  method: string,
  path: string,
  body?: any
): Promise<any>
```

ShepLang's `call` / `load` features will always use this function.

**If this integration contract changes, all usecases must be updated accordingly.**
