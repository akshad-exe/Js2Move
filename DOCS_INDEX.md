# 📖 Js2Move Documentation Index

Welcome to Js2Move! This index will help you find the right documentation.

## 🚀 Getting Started

**New to the project?** Start here in order:

1. **[QUICK_START.md](./QUICK_START.md)** ⭐ 
   - 5-minute setup guide
   - Common tasks
   - Quick commands
   - **Read this first!**

2. **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)**
   - What is Js2Move?
   - Complete architecture explanation
   - How everything works together
   - Contributing guide

3. **[ARCHITECTURE.md](./ARCHITECTURE.md)**
   - Visual diagrams
   - Data flow charts
   - System architecture
   - Compilation pipeline

## 📚 Core Documentation

### For Everyone

| Document | What's Inside | When to Read |
|----------|---------------|--------------|
| [README.md](./README.md) | Project intro, features overview | First time visiting repo |
| [QUICK_START.md](./QUICK_START.md) | Fast onboarding, common tasks | Joining the team |
| [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) | Complete explanation | Understanding the project |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Visual diagrams | Understanding data flow |

### Deployment Features ⭐ NEW

| Document | What's Inside | When to Use |
|----------|---------------|-------------|
| [DEPLOYMENT_ARCHITECTURE.md](./docs/DEPLOYMENT_ARCHITECTURE.md) | Deployment system design | Building deploy features |
| [DEPLOYMENT_ROADMAP.md](./docs/DEPLOYMENT_ROADMAP.md) | Implementation plan | Planning development |
| [ENHANCED_VISION.md](./docs/ENHANCED_VISION.md) | Platform vision & strategy | Understanding roadmap |

### Team Guides 👥 NEW

| Document | What's Inside | When to Use |
|----------|---------------|-------------|
| [SMART_CONTRACT_DEV_GUIDE.md](./docs/SMART_CONTRACT_DEV_GUIDE.md) | SC developer onboarding | Move expert role |
| [HBS_TEMPLATE_GUIDE.md](./docs/HBS_TEMPLATE_GUIDE.md) | Handlebars templating | Working with templates |

### For Reference

| Document | What's Inside | When to Use |
|----------|---------------|-------------|
| [CHANGELOG.md](./CHANGELOG.md) | Recent changes summary | After reindexing |
| [SUMMARY.md](./SUMMARY.md) | Reindexing overview | Quick reference |
| [MoveSDK-doc.md](./MoveSDK-doc.md) | Original compiler design | Deep technical dive |

## 🎓 Learning Resources

### Examples (Learn by Doing)

Location: `packages/compiler/examples/`

| File | What It Teaches | Difficulty |
|------|----------------|------------|
| [01-hello-world.movejs](./packages/compiler/examples/01-hello-world.movejs) | Basic structure | Beginner |
| [02-simple-token.movejs](./packages/compiler/examples/02-simple-token.movejs) | Token pattern | Beginner |
| [03-nft.movejs](./packages/compiler/examples/03-nft.movejs) | NFT pattern | Intermediate |
| [04-defi-vault.movejs](./packages/compiler/examples/04-defi-vault.movejs) | DeFi patterns | Advanced |

📖 [Examples README](./packages/compiler/examples/README.md)

### Test Fixtures (For Testing)

Location: `packages/compiler/tests/fixtures/`

Used for automated testing. Add your test cases here!

📖 [Fixtures README](./packages/compiler/tests/fixtures/README.md)

## 🎯 By Role

### 👨‍💻 New Developer
1. [QUICK_START.md](./QUICK_START.md) - Get set up
2. [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) - Understand the project
3. [Examples](./packages/compiler/examples/) - See MoveJS in action
4. [ARCHITECTURE.md](./ARCHITECTURE.md) - Understand the flow

### 🏗️ Compiler Developer
1. [MoveSDK-doc.md](./MoveSDK-doc.md) - Compiler internals
2. [ARCHITECTURE.md](./ARCHITECTURE.md) - Pipeline stages
3. [HBS_TEMPLATE_GUIDE.md](./docs/HBS_TEMPLATE_GUIDE.md) - Template system
4. [Fixtures](./packages/compiler/tests/fixtures/) - Test cases
5. [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) - Contributing section

### 🔧 Smart Contract Developer
1. [SMART_CONTRACT_DEV_GUIDE.md](./docs/SMART_CONTRACT_DEV_GUIDE.md) - Your onboarding guide
2. [HBS_TEMPLATE_GUIDE.md](./docs/HBS_TEMPLATE_GUIDE.md) - Learn templates
3. [Examples](./packages/compiler/examples/) - Sample contracts
4. [ARCHITECTURE.md](./ARCHITECTURE.md) - Understand compiler flow

### 📝 Technical Writer
1. [Examples](./packages/compiler/examples/) - Sample contracts
2. [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) - Main reference
3. [ARCHITECTURE.md](./ARCHITECTURE.md) - Diagrams
4. [QUICK_START.md](./QUICK_START.md) - User guide

### 👥 Project Manager
1. [README.md](./README.md) - Project overview
2. [SUMMARY.md](./SUMMARY.md) - Current state
3. [CHANGELOG.md](./CHANGELOG.md) - Recent changes
4. [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) - Complete picture

## 🔍 By Topic

### Understanding the Project
- [What is Js2Move?](./PROJECT_OVERVIEW.md#-what-is-this-project)
- [Architecture Overview](./ARCHITECTURE.md#-system-architecture)
- [Key Concepts](./PROJECT_OVERVIEW.md#-key-concepts-for-teammates)

### Setting Up
- [Prerequisites](./README.md#prerequisites)
- [Installation](./QUICK_START.md#-get-started-in-5-minutes)
- [Development Workflow](./QUICK_START.md#-development-workflow)

### Using the Compiler
- [CLI Usage](./PROJECT_OVERVIEW.md#1-cli-usage-local-development)
- [API Usage](./PROJECT_OVERVIEW.md#2-api-usage-web-ui--cicd)
- [Programmatic Usage](./PROJECT_OVERVIEW.md#3-programmatic-usage)

### Learning MoveJS
- [Hello World Example](./packages/compiler/examples/01-hello-world.movejs)
- [Token Example](./packages/compiler/examples/02-simple-token.movejs)
- [NFT Example](./packages/compiler/examples/03-nft.movejs)
- [DeFi Example](./packages/compiler/examples/04-defi-vault.movejs)

### Contributing
- [Adding Features](./PROJECT_OVERVIEW.md#adding-a-new-language-feature)
- [Adding Tests](./packages/compiler/tests/fixtures/README.md)
- [Adding Examples](./packages/compiler/examples/README.md)
- [Testing Your Changes](./QUICK_START.md#testing-your-changes)

### Technical Deep Dives
- [Compilation Pipeline](./ARCHITECTURE.md#-compilation-pipeline-detailed)
- [Compiler Stages](./MoveSDK-doc.md#compiler-pipeline-detailed)
- [Data Flow](./ARCHITECTURE.md#-api-request-flow)
- [Template System](./docs/HBS_TEMPLATE_GUIDE.md) - How code generation works
- [Deployment Architecture](./DEPLOYMENT_ARCHITECTURE.md) - Deploy system design

### Team Resources
- [Smart Contract Developer Guide](./docs/SMART_CONTRACT_DEV_GUIDE.md) - SC dev onboarding
- [HBS Template Guide](./docs/HBS_TEMPLATE_GUIDE.md) - Template system tutorial
- [Deployment Roadmap](./DEPLOYMENT_ROADMAP.md) - Implementation timeline

## 📂 Package Documentation

Each package has its own README:

- [packages/compiler/README.md](./packages/compiler/README.md) - Compiler package
- [packages/cli/README.md](./packages/cli/README.md) - CLI tool
- [packages/backend/README.md](./packages/backend/README.md) - API service

## ❓ FAQ

### "I'm new, where do I start?"
→ [QUICK_START.md](./QUICK_START.md)

### "What kind of project is this?"
→ [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) - "What Is This Project?" section

### "How does the compiler work?"
→ [ARCHITECTURE.md](./ARCHITECTURE.md) - See the pipeline diagrams

### "How do I add a test?"
→ [fixtures/README.md](./packages/compiler/tests/fixtures/README.md)

### "How do I compile a .movejs file?"
→ [QUICK_START.md](./QUICK_START.md) - "Try the Compiler" section

### "Where do compiled files go?"
→ [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) - "Where Input/Output Should Be" section

### "Why no contracts folder?"
→ [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) - We're a compiler, not a dApp!

## 🗺️ Documentation Map

```
Root/
├── README.md                       # Project intro
├── QUICK_START.md                  # ⭐ Start here
├── PROJECT_OVERVIEW.md             # Complete guide
├── ARCHITECTURE.md                 # Visual diagrams
├── MoveSDK-doc.md                  # Technical deep dive
├── DOCS_INDEX.md                   # Documentation navigation
│
├── docs/
│   ├── README.md                    # Documentation organization guide
│   ├── DEPLOYMENT_CHECKLIST.md      # Deployment guide
│   ├── SMART_CONTRACT_DEV_GUIDE.md  # SC dev onboarding
│   ├── HBS_TEMPLATE_GUIDE.md        # Template tutorial
│   ├── DEPLOYMENT_ARCHITECTURE.md   # Deployment system
│   ├── Nginx-Guide.md               # Nginx configuration
│   ├── postman/                     # Postman collections & guides
│   │   ├── POSTMAN_SETUP_GUIDE.md   # API testing guide
│   │   ├── POSTMAN_COLLECTION.json  # API test collection
│   │   └── POSTMAN_ENV_LOCAL.json   # Local environment config
│   └── archive/                      # Archived documentation
│       ├── README.md                 # Archive explanation
│       ├── DEPLOYMENT_CONTRACT_TEST_GUIDE.md # Contract testing (archived)
│       ├── DEPLOYMENT_ROADMAP.md     # Implementation plan (archived)
│       ├── ENHANCED_VISION.md        # Platform vision (archived)
│       ├── FOLDER_STRUCTURE_DESIGN.md # Architecture rationale (archived)
│       ├── MoveTranspilerIssues.md   # Transpiler fixes (archived)
│       ├── SETUP_AND_DEPLOYMENT.md   # Deployment setup (archived)
│       ├── SYSTEM_INDEX.md           # System index (archived)
│       └── TEST_AUTOMATION_GUIDE.md  # Test automation (archived)
│
└── packages/
    └── compiler/
        ├── README.md               # Compiler info
        ├── examples/
        │   ├── README.md           # Examples guide
        │   └── *.movejs            # Sample contracts
        └── tests/fixtures/
            ├── README.md           # Testing guide
            ├── input/              # Test inputs
            └── expected/           # Expected outputs
```

## 🎯 Quick Links

| I want to... | Go to... |
|--------------|----------|
| Get started quickly | [QUICK_START.md](./QUICK_START.md) |
| Understand the project | [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) |
| See code examples | [examples/](./packages/compiler/examples/) |
| Add a test | [fixtures/](./packages/compiler/tests/fixtures/) |
| View diagrams | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Read technical details | [MoveSDK-doc.md](./MoveSDK-doc.md) |
| See what changed | [CHANGELOG.md](./CHANGELOG.md) |
| Onboard as SC dev | [SMART_CONTRACT_DEV_GUIDE.md](./docs/SMART_CONTRACT_DEV_GUIDE.md) |
| Learn templates | [HBS_TEMPLATE_GUIDE.md](./docs/HBS_TEMPLATE_GUIDE.md) |
| Understand deployment | [DEPLOYMENT_ARCHITECTURE.md](./docs/DEPLOYMENT_ARCHITECTURE.md) |

## 💡 Pro Tips

1. **Bookmark this page** - It's your navigation hub
2. **Start with QUICK_START.md** - Even if you're experienced
3. **Use examples** - They're the best way to learn MoveJS
4. **Read PROJECT_OVERVIEW.md** - It clarifies everything
5. **Check ARCHITECTURE.md** - Visual learners love it!

---

**Happy coding! 🚀**

If you have questions, check the docs above or ask the team!
