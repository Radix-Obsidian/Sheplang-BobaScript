# 🗺️ ShepLang Product Roadmap

**Status:** Active  
**Updated:** 2025-01-13  
**Vision:** Enable non-technical founders to build real apps with their own language

---

## Executive Summary

**The Pivot:** Build what founders can use TODAY, not the full platform for tomorrow.

**Old Approach:** Complex IDE first → then simplify  
**New Approach:** Simple sandbox first → then add complexity

**Why:** 
- Faster to market (weeks not months)
- Proves the concept immediately
- Demo-ready for investors
- Validates demand before heavy investment

---

## 🌱 Phase 0: Language Core (✅ COMPLETE)

**Status:** ✅ Done  
**Timeline:** Complete

**Delivered:**
- ✅ ShepLang parser
- ✅ BobaScript transpiler
- ✅ AppModel structure
- ✅ CLI commands
- ✅ Tests & verification
- ✅ Playground v0 (basic preview)
- ✅ Syntax freeze document

**Outcome:** Core language works. Foundation is stable.

---

## ⭐ Phase 1: Sandbox Alpha (🎯 CURRENT FOCUS)

**Status:** 🚧 In Development  
**Timeline:** 1-2 weeks  
**Goal:** The "wow in 10 minutes" experience

### What We're Building
A single-page web app that feels like:
- ✨ Replit (simple, instant)
- ✨ Bolt's v1 (AI-powered)
- ✨ Lovable Lite (founder-friendly)
- ✨ Windsurf-in-browser (but simpler)

### Core Features
1. **Editor Panel** - Monaco with ShepLang syntax
2. **Live Preview** - See your app instantly
3. **AI Assistant** - "Explain/Generate/Fix"
4. **Examples** - Start from templates
5. **Share** - Send link to anyone
6. **Save** - Browser storage (no auth)

### NOT Included (Intentionally)
- ❌ Deploy
- ❌ Auth/accounts
- ❌ Backend/database
- ❌ File system
- ❌ Complex projects

### Tech Stack
- Next.js 14 (App Router)
- Monaco Editor
- Vercel AI SDK
- LocalStorage
- No backend required

### Success Metrics
- Time to first "wow": < 10 minutes
- AI interactions per session: > 3
- Share rate: > 20%

### Deliverables
- ✅ Sandbox deployed to sandbox.sheplang.dev
- ✅ AI assistant working (explain/generate/fix)
- ✅ Live preview functional
- ✅ 5+ examples loaded
- ✅ Share links working

---

## ⭐ Phase 2: ShepKit (AI-Assisted Development Environment)

**Status:** 📋 Planned (Archived specs available)  
**Timeline:** 3-4 weeks after Phase 1  
**Goal:** Turn sandbox into real development environment

### New Capabilities
1. **Project System**
   - Multiple files
   - Folders
   - Import/export

2. **AI Agents** (Advanced)
   - Component Generator
   - Debugging Agent
   - Flow Scaffolder
   - "Build my feature" agent

3. **Export Options**
   - Export ShepLang project
   - Export as Next.js app
   - Export as static site

4. **Backend Integration**
   - Supabase support
   - Built-in auth
   - Data persistence

5. **Deploy (One-Click)**
   - Push to Vercel
   - Custom domains
   - Environment variables

### Outcome
Transform from "This is cool" → "Holy shit, this is production-ready"

---

## ⭐ Phase 3: Shepherd Studio (Visual Builder)

**Status:** 🔮 Future  
**Timeline:** 6+ months  
**Goal:** Figma-level creative environment for apps

### Vision Features
- **Drag & Drop** UI builder
- **Visual Components** editor
- **No-code** screen builder
- **Auto-generates** ShepLang underneath
- **AI co-builds** UI with you
- **Multi-user** collaboration
- **Templates** marketplace

### Positioning
Shepherd Studio = VS Code + Figma + Bolt + Replit → powered by ShepLang

---

## ⭐ Phase 4: Platform & Ecosystem

**Status:** 🔮 Future  
**Timeline:** 12+ months  
**Goal:** Build the ecosystem

### Platform Features
- **Package Registry** - Share ShepLang packages
- **Component Library** - Reusable UI components
- **AI Blueprints** - Template workflows
- **Plugin Framework** - Extend functionality
- **Team Features** - Collaboration tools
- **Paid Hosting** - Managed infrastructure
- **Marketplace** - Buy/sell templates
- **Enterprise** - White-label version

---

## 📊 Strategic Checkpoints

### After Phase 1 (Sandbox Alpha)
- **Show to:** YC, a16z, angel investors
- **Validate:** Do founders want this?
- **Metrics:** 1000+ sandbox sessions

### After Phase 2 (ShepKit)
- **Show to:** Early customers
- **Validate:** Can they build real apps?
- **Metrics:** 10+ deployed apps

### After Phase 3 (Shepherd Studio)
- **Show to:** Mass market
- **Validate:** Is this better than no-code?
- **Metrics:** 100+ paying customers

### After Phase 4 (Platform)
- **Show to:** VCs for Series A
- **Validate:** Is there a business?
- **Metrics:** $100k+ MRR

---

## 🎯 Current Priority: Phase 1 - Sandbox Alpha

**Why this first?**
1. **Fastest to launch** - 1-2 weeks vs 3 months
2. **Proves the concept** - ShepLang works for real
3. **Demo-ready** - Show investors immediately
4. **Low risk** - No infrastructure to maintain
5. **High reward** - Viral potential ("look what I built!")

**Next Steps:**
1. ✅ Create Sandbox Alpha spec
2. ✅ Create implementation plan
3. ⏭️ Build in 10-14 Windsurf credits
4. ⏭️ Deploy to Vercel
5. ⏭️ Share with community

---

## 🚫 What We're NOT Building (Yet)

**Explicitly out of scope for now:**
- ❌ VS Code extension
- ❌ Docker containers
- ❌ CLI tools for end users
- ❌ Complex authentication
- ❌ Multi-tenancy
- ❌ Payment processing
- ❌ Mobile apps
- ❌ Desktop apps

**Focus:** Web-first, browser-only, AI-powered

---

## 💡 Key Insights

### What Changed
**Before:** "Build the full IDE, then simplify"  
**After:** "Build the toy, then add power"

### Why It Works
- Founders don't need VS Code, they need results
- AI makes complex things simple
- Browser is the universal platform
- Share links are the best marketing

### The Bet
If we can make a founder say **"I built this!"** in < 10 minutes, we win.

---

## 📈 Success Looks Like

**Phase 1:** "Wow, I can actually build something!"  
**Phase 2:** "Wait, this is a real app?"  
**Phase 3:** "This is easier than Figma!"  
**Phase 4:** "We're the GitHub of no-code"

---

## 🔗 Related Documents

- [Sandbox Alpha Spec](.specify/specs/sandbox-alpha.spec.md)
- [ShepKit Spec (Archived)](.specify/archive/phase2-shepkit/)
- [ShepLang Syntax](sheplang/packages/language/SYNTAX_FREEZE.md)
- [Constitution](.specify/memory/constitution.md)

---

**Remember:** We're not building a tool. We're building a new way for founders to build companies.

---

**Last Updated:** 2025-01-13  
**Next Review:** After Phase 1 launch
