---
trigger: always_on
---

# 🧭 Windsurf Project Rules — ShepLang / BobaScript / ShepKit

**Version: Alpha Pro — 500 Credits Guardrail Edition**
**Owner:** Founder (YOU)
**Applies To:** All Windsurf Models (Build, Fix, Test, Refactor, Doc, Plan)

---

# 1. PURPOSE

These rules ensure Windsurf operates **strategically**, **predictably**, and **within the boundaries** of the ShepLang/BobaScript/ShepKit monorepo.

No model is allowed to improvise beyond the spec or invent features outside the scope of this repo.

The goal:
**Maximize progress per credit while keeping every edit aligned to PRD → TTD → Verify.**

---

# 2. CREDIT MANAGEMENT (VERY IMPORTANT)

### 2.1 Core Rules

* **Never propose multi-step explorations.**
  Always pick the **smallest meaningful unit of work**.
* **Avoid refactors unless explicitly requested.**
* **Never modify multiple packages unless the PRD/TTD requires cross-package work.**
* **Every action must be tied to a checklist item or spec requirement.**
* **Every edit must be followed by a single test or verify step.**

### 2.2 Forbidden Behaviors

*(Burn credits instantly → do NOT do these)*

* Do NOT wander into architectural redesigns.
* Do NOT propose speculative enhancements.
* Do NOT generate placeholder code.
* Do NOT regenerate entire files unless absolutely necessary.
* Do NOT auto-format entire directories.

### 2.3 Optimized Behavior

* Edit **only the files involved** in the requested change.
* Use **incremental diffs**, not full rewrites.
* Always check existing code before editing.
* Prefer referencing official documentation over hallucinating solutions.

---

# 3. PROJECT SCOPE LOCK 🔒

*(The most important rule in this whole document)*

### Windsurf MUST stay within this scope:

```
ShepLang → BobaScript → ShepKit Web → ShepKit Extension (future)
```

This includes:

### 3.1 Allowed Areas

* `/sheplang/packages`
* `/sheplang/adapters`
* `/sheplang/playground`
* `/sheplang/shepkit` (once created)
* `/Project-scope` (PRD, TTD, Checklists)

### 3.2 Forbidden Areas

* No exploring other languages or frameworks
* No adding dependencies outside PRD
* No building new products or experimenting
* No code generation that does not appear in the spec
* No invented APIs, syntax, or behaviors
* No deviations from SYNTAX_FREEZE.md
* No features not explicitly listed in PRD or TTD

### 3.3 Mental Model

Windsurf must assume:

> “The specification is the truth. The repo is the boundary. Nothing else exists.”

---

# 4. HOW WINDSURF SOLVES PROBLEMS

### 4.1 Primary Sources

When blocked, Windsurf must use:

1. **Official documentation only**

   * Typescript docs
   * Langium docs
   * Vite docs
   * Next.js docs
   * esbuild/Vite press
   * Vitest docs
   * VS Code extension API docs

2. **ShepLang internal docs**

   * SYNTAX_FREEZE.md
   * Phase checklists
   * PRD, TTD docs
   * Adapter interfaces
   * Compiler output rules

3. **Existing code in the monorepo**
   → Always prefer reading the existing implementation before introducing anything new.

### 4.2 Debug Workflow (MANDATED)

When fixing bugs:

1. **Reproduce the bug locally (as code or logs)**
2. **Locate the package responsible**
3. **Read the current implementation**
4. **Check against SYNTAX_FREEZE.md, PRD, TTD**
5. **Apply minimum-diff fix**
6. **Run tests / verify step**
7. **Update the checklist only if required**

---

# 5. HOW WINDSURF CREATES CODE

### 5.1 If PRD/TTD exists

Use that. Nothing else.

### 5.2 If code already exists

Extend minimally. Do not rewrite.

### 5.3 If new feature begins

* Generate full file ONLY if the spec explicitly defines structure.
* Otherwise, generate function-level patches.

### 5.4 Documentation

* Must be consistent with PRD
* No invented examples
* No speculative future features

---

# 6. EDITING RULES

### 6.1 All Edits Must:

* Follow ESM (`.js` import suffixes)
* Follow TypeScript strict mode
* Preserve existing public APIs
* Maintain atomic commit principles
* Include tests if modifying core behavior
* Never violate verify.ps1 expectations

### 6.2 Never:

* Edit SYNTAX_FREEZE.md
* Edit PRD without permission
* Edit TTD without Founder approval
* Introduce untested behavior
* Create placeholder files ("TODO" blocks)

---

# 7. VERIFY AS THE SINGLE TRUTH GATE

### Windsurf must treat `scripts/verify.ps1` as the **final arbiter**.

A feature is “DONE” when:

* All tests pass
* Verify is green
* Checklist updated
* Code reviewed by Founder
* Committed with correct message

---

# 8. WHEN WINDSURF SHOULD REFUSE ACTIONS

Windsurf must stop and warn if:

* Founder asks for a feature outside the PRD
* A change violates SYNTAX_FREEZE.md
* A request affects unrelated code
* A request requires breaking backwards compatibility
* A change risks failing Phase sequencing
* A change burns >10 credits unnecessarily

Windsurf will respond:

> “This request violates project-scope or credit-management rules. Please update PRD/TTD first.”

---

# 9. NAMING & STRUCTURE RULES

### Packages must remain:

```
@sheplang/language
@adapters/sheplang-to-boba
@sheplang/compiler
@sheplang/cli
@sheplang/playground
@sheplang/shepkit   (new)
```

### Do not create:

* Additional root-level packages
* Additional monorepo layers
* Experimental forks

---

# 10. FOUNDER OVERRIDE

You (the founder) may override any rule by saying:

> “Override: proceed.”

Windsurf must comply immediately without debate.

---

# ✅ Founder Takeaways

* These rules maximize the value of your 500 credits.
* They prevent scope drift and waste.
* They enforce real software engineering discipline across AI agents.
* They keep your multi-language ecosystem small, maintainable, and provable.

---


