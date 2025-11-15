# @sheplang/shepthon

**Backend DSL for Non-Technical Founders**

ShepThon is a Python-like backend language that runs on Node/Edge runtime. It's designed to be written and explained by AI, making backend development accessible to founders who don't know traditional programming.

## Status: Phase 0 (Foundation)

**Current Phase:** Foundation setup
- ✅ Package structure
- ✅ TypeScript types
- ✅ Stub parser
- ✅ Smoke tests
- ⏳ Real parser (Phase 1)
- ⏳ Runtime (Phase 2)
- ⏳ Job scheduler (Phase 3)
- ⏳ Shipyard integration (Phase 4)

## What is ShepThon?

ShepThon describes backend logic in simple, readable syntax:

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

## Integration with ShepLang

**ShepLang** (frontend) + **ShepThon** (backend) = Full-stack MVP

- ShepLang describes UI and user flows
- ShepThon describes APIs, data models, and background jobs
- BobaScript connects them as the shared "brain"
- Shipyard runs it all in a unified sandbox

## Documentation

See the full specifications:

- **[PRD_ShepThon_Alpha.md](../../../Project-scope/PRD_ShepThon_Alpha.md)** - Product requirements
- **[TTD_ShepThon_Core.md](../../../Project-scope/TTD_ShepThon_Core.md)** - Technical task definition
- **[ShepThon-Usecases/](../../../Project-scope/ShepThon-Usecases/)** - Behavioral examples

## Installation

```bash
pnpm install
```

## Development

```bash
# Build
pnpm run build

# Test
pnpm run test

# Watch mode
pnpm run test:watch

# Lint
pnpm run lint
```

## Usage (Phase 0)

```typescript
import { parseShepThon } from '@sheplang/shepthon';

const source = `
app MyApp {
  // Models, endpoints, jobs...
}
`;

const result = parseShepThon(source);

if (result.app) {
  console.log('Parsed app:', result.app.name);
} else {
  console.error('Parse errors:', result.diagnostics);
}
```

## Phase 0 Limitations

The Phase 0 parser is a **minimal stub** that:
- ✅ Extracts app name
- ✅ Returns empty arrays for models/endpoints/jobs
- ✅ Validates basic app structure
- ❌ Does NOT parse models, endpoints, or jobs yet

Full parsing will be implemented in **Phase 1**.

## Architecture

```
@sheplang/shepthon/
├── src/
│   ├── types.ts       # AST type definitions
│   ├── parser.ts      # Parser (stub in Phase 0)
│   └── index.ts       # Public API
└── test/
    └── smoke.test.ts  # Phase 0 smoke tests
```

## Goals

**Alpha Goals:**
1. Human-first syntax (reads like English + Python)
2. Express backend basics (models, endpoints, jobs)
3. First-class in Shipyard sandbox
4. AI-native (easy to generate and explain)
5. Safe and predictable (no arbitrary Node.js access)

**Non-Goals (Alpha):**
- Multi-tenant infrastructure
- Real external database
- Advanced auth/permissions
- Full ORM/SQL

## License

MIT

---

**Part of the ShepLang ecosystem:**
- [ShepLang](../language) - Frontend DSL
- [BobaScript](../../adapters/sheplang-to-boba) - Intermediate representation
- [ShepYard](../../../shepyard) - Sandbox IDE
- **ShepThon** - Backend DSL (this package)
