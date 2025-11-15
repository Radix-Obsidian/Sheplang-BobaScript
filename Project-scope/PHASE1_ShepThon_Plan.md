# Phase 1: ShepThon Parser & AST - Implementation Plan

**Date:** November 14, 2025  
**Phase:** 1 - Parser & AST  
**Status:** 🎯 IN PROGRESS

---

## 🎯 Phase 1 Goal

Build a **real recursive descent parser** that can parse ShepThon models, endpoints, and jobs into a complete AST, with comprehensive error handling and diagnostics.

---

## 📋 Spec-Driven Workflow Applied

### 1. ✅ Scanned Project-scope/
- `PRD_ShepThon_Alpha.md` - Language specification
- `TTD_ShepThon_Core.md` - C1.2 Parser tasks
- `ShepThon-Usecases/01_dog-reminders.md` - Target example
- `SPEC_CONSTITUTION.md` - Non-negotiable rules

### 2. ✅ Researched Official Resources
**TypeScript Parser Patterns:**
- [Recursive Descent Parsing Tutorial](https://thunderseethe.dev/posts/parser-base/)
  - Resilient parsing with error recovery
  - Full fidelity CST vs AST trade-offs
  - Function-based recursive descent approach

- [TypeScript Lexer Implementation](https://balit.boxxen.org/lexing/basic/)
  - Token stream generation
  - Position tracking
  - Lookahead patterns

**Key Insights:**
- Hand-written parsers > parser generators for our use case
- Resilience = continue parsing after errors (critical for IDE support)
- Position tracking = better diagnostics
- Recursive descent = one function per grammar rule

### 3. ✅ Analyzed Ecosystem Fit
**ShepLang uses:** Langium (powerful but complex)  
**ShepThon needs:** Simple, hand-written (founder-friendly errors)  
**Alignment:** Both produce ASTs, ShepThon simpler for AI generation

---

## 🏗️ Architecture Design

### Lexer (Tokenizer)
```typescript
interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

enum TokenType {
  // Keywords
  APP, MODEL, ENDPOINT, JOB, LET, RETURN, FOR, IF, ELSE,
  GET, POST, EVERY,
  
  // Types
  ID, STRING, INT, FLOAT, BOOL, DATETIME, JSON,
  
  // Operators
  COLON, ARROW, EQUALS, COMMA, DOT, LBRACE, RBRACE,
  LPAREN, RPAREN, LBRACKET, RBRACKET,
  
  // Literals
  IDENTIFIER, STRING_LITERAL, NUMBER_LITERAL, BOOLEAN_LITERAL,
  
  // Special
  NEWLINE, EOF, INVALID
}
```

### Parser Structure
```typescript
class ShepThonParser {
  private tokens: Token[];
  private current: number = 0;
  private diagnostics: Diagnostic[] = [];
  
  // Top-level
  parseApp(): ShepThonApp | null;
  
  // Declarations
  parseModel(): ModelDefinition;
  parseEndpoint(): EndpointDefinition;
  parseJob(): JobDefinition;
  
  // Statements
  parseStatement(): Statement;
  parseLetStatement(): LetStatement;
  parseReturnStatement(): ReturnStatement;
  parseForStatement(): ForStatement;
  parseIfStatement(): IfStatement;
  
  // Expressions
  parseExpression(): Expression;
  parsePrimaryExpression(): Expression;
  parseCallExpression(): CallExpression;
  parseMemberExpression(): MemberExpression;
  
  // Helpers
  peek(): Token;
  advance(): Token;
  match(...types: TokenType[]): boolean;
  consume(type: TokenType, message: string): Token;
  error(message: string): void;
  synchronize(): void; // Error recovery
}
```

---

## 📝 Implementation Steps

### Step 1: Lexer/Tokenizer ✅ (Starting)
**File:** `src/lexer.ts`

**Responsibilities:**
- Convert source string → token stream
- Track line/column positions
- Recognize keywords vs identifiers
- Handle string literals with quotes
- Skip whitespace (except newlines where significant)
- Report invalid tokens as diagnostics

**Tests:**
```typescript
it('tokenizes model block');
it('tokenizes endpoint with parameters');
it('tokenizes job with schedule');
it('tracks positions correctly');
it('handles string literals');
```

---

### Step 2: Parser Core
**File:** `src/parser.ts`

#### 2a. App Block Parser
```shepthon
app DogReminders {
  // ...
}
```

**Logic:**
1. Consume 'app' keyword
2. Parse identifier (app name)
3. Consume '{'
4. Parse models/endpoints/jobs until '}'
5. Build ShepThonApp AST

---

#### 2b. Model Parser
```shepthon
model Reminder {
  id: id
  text: string
  time: datetime
  done: bool = false
}
```

**Logic:**
1. Consume 'model' keyword
2. Parse identifier (model name)
3. Consume '{'
4. Loop: parse field definitions
   - identifier : type [= default]
5. Consume '}'
6. Build ModelDefinition AST

**Challenges:**
- Default values (literals only in Alpha)
- Type validation happens in checker, not parser

---

#### 2c. Endpoint Parser
```shepthon
endpoint GET "/reminders" -> [Reminder] {
  return db.Reminder.findAll()
}

endpoint POST "/reminders" (text: string, time: datetime) -> Reminder {
  let reminder = db.Reminder.create({ text, time })
  return reminder
}
```

**Logic:**
1. Consume 'endpoint' keyword
2. Parse method (GET/POST)
3. Parse path (string literal)
4. Optional: parse parameters `(name: type, ...)`
5. Consume '->'
6. Parse return type (Type or [Type])
7. Parse body (block of statements)
8. Build EndpointDefinition AST

**Challenges:**
- Path parameters (`:id`) vs query parameters
- Optional parameters (`name?: type`)
- Array vs single return type

---

#### 2d. Job Parser
```shepthon
job "mark-due-as-done" every 5 minutes {
  let due = db.Reminder.find({ time <= now(), done: false })
  for r in due {
    db.Reminder.update(r.id, { done: true })
  }
}
```

**Logic:**
1. Consume 'job' keyword
2. Parse name (string literal)
3. Consume 'every'
4. Parse number
5. Parse unit (minutes/hours/days)
6. Parse body (block of statements)
7. Build JobDefinition AST

---

#### 2e. Statement Parsers

**Let Statement:**
```shepthon
let reminder = db.Reminder.create({ text, time })
```

**Return Statement:**
```shepthon
return db.Reminder.findAll()
```

**For Statement:**
```shepthon
for r in due {
  db.Reminder.update(r.id, { done: true })
}
```

**If Statement (Phase 1 optional):**
```shepthon
if not email {
  error 400 "Email is required"
}
```

---

#### 2f. Expression Parsers

**Call Expression:**
```shepthon
db.Reminder.findAll()
db.Reminder.create({ text, time })
```

**Member Expression:**
```shepthon
db.Reminder
r.id
```

**Literals:**
```shepthon
"string"
42
true
false
```

**Binary Expression:**
```shepthon
time <= now()
done == false
```

---

### Step 3: Semantic Checker
**File:** `src/checker.ts`

**Validations:**
1. **Model names unique** within app
2. **Endpoint paths/methods unique** within app
3. **Job names unique** within app
4. **Types exist:**
   - Field types are valid (id, string, int, etc.)
   - Model references are declared
   - Return types reference existing models
5. **Schedule expressions valid:**
   - `every N minutes|hours|days`
   - N is positive integer

**Output:** Diagnostic[] with errors/warnings

---

### Step 4: Error Recovery

**Strategies:**
1. **Synchronization points:**
   - After `}` of blocks
   - After statement terminators
   - At keyword boundaries (model, endpoint, job)

2. **Panic mode:**
   - Skip tokens until synchronization point
   - Continue parsing from there

3. **Position tracking:**
   - Every diagnostic includes line/column
   - Helps user fix errors

**Example:**
```shepthon
model Reminder {
  id: id
  text: INVALID_TYPE  // Error but continue
  time: datetime
}
// Parser recovers, continues with next model/endpoint
```

---

### Step 5: Comprehensive Tests
**File:** `test/parser.test.ts`

**Test Categories:**

#### 1. Smoke Tests
- Parse empty app
- Parse minimal model
- Parse minimal endpoint
- Parse minimal job

#### 2. Dog Reminders (Full Example)
- Parse complete Dog Reminders app
- Verify AST structure matches spec
- Check all models/endpoints/jobs present

#### 3. Edge Cases
- Missing braces
- Invalid types
- Duplicate names
- Malformed schedules

#### 4. Error Recovery
- Parser continues after errors
- Multiple errors reported
- Synchronization works

---

## 🎯 Success Criteria (Phase 1)

✅ Lexer tokenizes Dog Reminders example completely  
✅ Parser produces valid AST for Dog Reminders  
✅ All models parsed correctly  
✅ All endpoints parsed correctly  
✅ All jobs parsed correctly  
✅ Semantic checker validates AST  
✅ Error diagnostics include line/column  
✅ Parser recovers from errors  
✅ 20+ tests passing  
✅ `pnpm run verify` GREEN  

---

## 🚫 Out of Scope (Phase 1)

❌ Runtime execution (Phase 2)  
❌ In-memory database (Phase 2)  
❌ Job scheduler (Phase 3)  
❌ Shipyard integration (Phase 4)  
❌ Advanced error recovery  
❌ Performance optimization  

---

## 📚 References

### Official Documentation:
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [Recursive Descent Parsing](https://thunderseethe.dev/posts/parser-base/)
- [Lexer Implementation Patterns](https://balit.boxxen.org/lexing/basic/)

### Project Specs:
- `PRD_ShepThon_Alpha.md` - Language spec (Section 5)
- `TTD_ShepThon_Core.md` - Task breakdown (C1.2)
- `ShepThon-Usecases/01_dog-reminders.md` - Target example

### Constraints:
- `SPEC_CONSTITUTION.md` - Non-negotiables
- No changes to locked packages
- TypeScript strict mode
- ESM modules

---

## 🔄 Iteration Plan

**Iteration 1 (Current):**
- Lexer + basic parser
- Models + endpoints only
- Minimal tests

**Iteration 2:**
- Add jobs
- Add statements (let, return, for)
- More tests

**Iteration 3:**
- Add expressions
- Semantic checker
- Error recovery
- Full Dog Reminders test

**Iteration 4:**
- Polish diagnostics
- Edge cases
- Documentation

---

## 🐑 Founder Takeaway

Phase 1 will give us a **real parser** that understands ShepThon syntax and produces a structured AST. This is the foundation for Phase 2 (Runtime) and beyond.

The parser is designed to be:
- ✅ **Resilient** - Continues after errors
- ✅ **Helpful** - Clear error messages with positions
- ✅ **Simple** - Hand-written, easy to understand
- ✅ **AI-friendly** - Matches how AI thinks about code structure

**Let's build it!** 🚀
