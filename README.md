# ShepLang - A Founder-Friendly App DSL

[![ShepLang](https://img.shields.io/badge/status-alpha%20v0.1.2-blue)](https://github.com/Radix-Obsidian/Sheplang-BobaScript)

ShepLang is a founder-friendly domain-specific language (DSL) that compiles to BobaScript, creating human-readable apps with clear explanations of why they work. The language focuses on clarity, developer experience, and rapid iteration.

![ShepLang Playground](https://via.placeholder.com/800x400?text=ShepLang+Playground)

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Radix-Obsidian/Sheplang-BobaScript.git
cd Sheplang-BobaScript

# Install dependencies
pnpm install

# Run the verification script (builds, tests, CLI smoke, and playground build)
pnpm run verify   # Should result in "=== VERIFY OK ==="
```

## 📦 What's Inside

- **Parser**: Langium-powered grammar with friendly error messages
- **Transpiler**: Converts ShepLang AST to deterministic BobaScript
- **CLI**: Commands for parse, build, explain, dev server, and stats
- **Playground**: Zero-deploy browser-based editor with live output

## 🎮 Try the Playground

```bash
cd sheplang
pnpm --filter @sheplang/playground dev
```

Then visit http://localhost:5173 to start coding in the browser!

## 📚 Documentation

- [ShepLang Reference](./sheplang/README.md) - Detailed package structure and usage
- [Development Guide](./docs/DEVELOPMENT.md) - Set up your dev environment

## 📝 Example

```
app MyTodos

data Todo:
  fields:
    title: text
    done: yes/no
  rules:
    - "user can update own items"

view Dashboard:
  list Todo
  button "Add Task" -> CreateTodo

action CreateTodo(title):
  add Todo with title, done=false
  show Dashboard
```

## 📋 Project Status

- [x] Parser core + mapper (Phase 0)
- [x] Transpiler to BobaScript (Phase 1)
- [x] CLI commands & preview server (Phase 2)
- [x] Web playground (Phase 3 Alpha)
- [ ] Editor plugins
- [ ] Interactive tutorials
- [ ] Community templates

## 📄 License

Copyright © 2025 Radix Obsidian
