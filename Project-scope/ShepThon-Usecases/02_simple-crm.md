# Usecase 02 — Simple CRM (Multiple Models + Filtering)

## Story (Founder Perspective)

"I want a tiny CRM:

- I can store leads with a status.
- I can add notes to leads.
- I can filter leads by status.
- I can promote a lead to `customer` via a backend action."

This is more complex than DogReminders and tests:

- multi-model relationships
- filtering
- simple business logic

---

## ShepThon Source (SoloCRM App)

```shepthon
app SoloCRM {

  model Lead {
    id: id
    name: string
    email: string
    status: string = "new"   // new, contacted, qualified, lost, customer
  }

  model Note {
    id: id
    leadId: id
    body: string
    createdAt: datetime
  }

  endpoint GET "/leads" (status?: string) -> [Lead] {
    if status {
      return db.Lead.find({ status })
    } else {
      return db.Lead.findAll()
    }
  }

  endpoint POST "/leads" (name: string, email: string) -> Lead {
    let lead = db.Lead.create({ name, email })
    return lead
  }

  endpoint POST "/leads/:id/notes" (id: id, body: string) -> Note {
    let note = db.Note.create({
      leadId: id,
      body,
      createdAt: now()
    })
    return note
  }

  endpoint POST "/leads/:id/promote" (id: id) -> Lead {
    let lead = db.Lead.update(id, { status: "customer" })
    return lead
  }
}
```

---

## Expected Behavior (Runtime Semantics)

### Models

**Lead** and **Note** have their own tables.

- `Note.leadId` is a foreign key by convention (no enforced constraints in Alpha).
- The runtime should not crash if you add a note for a non-existent lead (Alpha might allow it).

---

### Endpoint: GET /leads

- Accepts optional query parameter: `status`.
- If present, returns only leads with that status.
- If absent, returns all leads.

**Examples:**
- `GET /leads` → all leads.
- `GET /leads?status=qualified` → only qualified leads.

---

### Endpoint: POST /leads

- Creates a new lead with default status `"new"`.

---

### Endpoint: POST /leads/:id/notes

- **Path param** `:id` is the lead ID.
- **Body** contains `body` string.
- Creates a Note with:
  - `leadId = id`
  - `body` from input
  - `createdAt = now()`

---

### Endpoint: POST /leads/:id/promote

- Sets `status = "customer"` for the given lead.
- Returns the updated Lead.

---

## What This Tests in ShepThon

1. **Optional parameters:** `(status?: string)`
2. **Path parameters:** `"/leads/:id/..."`
3. **Conditional logic:** `if status { ... } else { ... }`
4. **Multiple models** in one app.
5. **Update semantics** using `db.Model.update(id, object)`.

Implementers should ensure:
- Path parameters are correctly extracted (`:id`).
- Optional parameters are allowed in endpoint signatures.
- Filters like `db.Lead.find({ status })` work with simple equality matching.

---

## Shipyard Expectations

A ShepLang frontend might:
- Call `GET /leads?status=new` to show "New Leads".
- Call `POST /leads` from a "Add Lead" form.
- Call `POST /leads/:id/promote` from a "Promote to Customer" button.

Shipyard doesn't need to know how the backend works; it just calls ShepThon endpoints.
