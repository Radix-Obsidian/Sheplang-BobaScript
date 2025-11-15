# ShepThon Usecases & Examples

## Purpose

This folder teaches AI and human contributors **how ShepThon is supposed to work in real life**, using concrete examples instead of theory.

**ShepThon = backend DSL for non-technical founders.**

- It should **feel like Python** (simple, readable).
- It should **run like Node/Express** (HTTP endpoints, jobs).
- It should be **AI-native** (easy to generate, easy to explain).

Shipyard (our sandbox) runs:

- **ShepLang** for frontend (screens, actions, routes)
- **ShepThon** for backend (models, endpoints, jobs)
- **BobaScript** as the internal "brain" connecting everything

---

## How AI Should Use This Folder

When an AI agent is:

- designing the ShepThon **parser / checker / runtime**
- adding new ShepThon **syntax or features**
- generating **examples or docs** for users

It must:

1. **Read these usecases first**, especially:
   - `01_dog-reminders.md` (minimal full-stack app)
   - `02_simple-crm.md` (more realistic app)
   - `03_jobs-and-scheduling.md` (background work)

2. Treat them as **behavioral contracts**, not suggestions.
   - The implementation should make these examples **actually runnable in Shipyard**.

3. Prefer **extending** the language so these examples work,
   not "simplifying things" by changing the examples.

---

## Concepts to Keep in Mind

- A **ShepThon app** is the backend for one product (e.g. DogReminders, SoloCRM).
- A **model** is like a table or collection.
- An **endpoint** is like an API route.
- A **job** is a background task that runs on a schedule.
- Dev storage in Alpha is **in-memory** (no real DB yet), but the behavior should align with a future DB.

---

## File Guide

- **`01_dog-reminders.md`**  
  Smallest possible real backend: models, GET/POST, simple job.

- **`02_simple-crm.md`**  
  Multi-model, filtering, simple business logic.

- **`03_jobs-and-scheduling.md`**  
  How jobs should be parsed, scheduled, and run.

- **`04_frontend-integration.md`**  
  How ShepLang frontend calls ShepThon backend in Shipyard.

- **`05_errors-and-validation.md`**  
  How validation and error responses should behave for founders.

---

## Important

If future changes conflict with these, update both:
- the **spec** (ShepThon PRD/TTD), and
- the **usecase docs** in this folder.

This keeps our language coherent, teachable, and founder-friendly.
