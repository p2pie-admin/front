# 🚀 CLINE QUICK REFERENCE CARD

> **Print this or keep it handy for quick reference!**

---

## ⚙️ YOUR CONFIGURATION

```
Model: Claude 3.5 Sonnet (Above-average strength, cost-effective)
Max Context: 180K tokens
Caching: ✅ Enabled (90% savings on repeated reads)
Auto-approve: ✅ Read-only operations
```

---

## 💰 COST OPTIMIZATION RULES

### ✅ DO THIS (Save Money)

- **Batch operations**: "Read files A, B, C" (not separate requests)
- **Use search_files**: Find patterns without reading everything
- **Start fresh**: New task = new conversation
- **Be specific**: "Read components/p2p/edit/index.tsx" not "explore P2P"
- **Use list_code_definition_names**: Overview before deep dive

### ❌ DON'T DO THIS (Waste Money)

- Read node_modules, .next, dist, yarn.lock
- Read same file multiple times
- Keep conversations going forever
- Read entire directories recursively
- Rewrite files when small edits work

---

## 🧠 CONTEXT MANAGEMENT

### When to Start Fresh

- ⚠️ "Context window exceeded" error
- 🔄 Starting completely new task
- 📚 Conversation getting long (>20 exchanges)
- 🐌 Responses getting slow

**Shortcut**: `Cmd+Shift+P` → "Cline: New Task"

---

## 🎯 SMART WORKFLOWS

### Adding Feature

```
1. Read types/*.ts (understand data)
2. Search for similar patterns
3. Read specific component files
4. Make targeted edits
```

### Debugging

```
1. Read the broken component
2. Check type definitions
3. Search for related logic
4. Propose fix with replace_in_file
```

### Understanding Code

```
1. list_code_definition_names (overview)
2. Read key files only
3. Ask for explanation
```

---

## 🛠️ ESSENTIAL COMMANDS

### File Operations

```
"Read types/p2p.ts"
"Search for 'useQuery' in components/"
"List definitions in components/p2p/"
"Edit components/main/index.tsx - change X to Y"
```

### Development

```
"Run dev server" → yarn dev
"Check TypeScript errors" → yarn tsc --noEmit
"Build the project" → yarn build
```

---

## 📊 COST ESTIMATES

| Task Type        | Typical Cost | With Caching |
| ---------------- | ------------ | ------------ |
| Simple edit      | $0.01-0.05   | $0.005-0.02  |
| Medium feature   | $0.10-0.30   | $0.05-0.15   |
| Complex refactor | $0.50-2.00   | $0.25-1.00   |

---

## 🎨 PROJECT-SPECIFIC SHORTCUTS

### Key Directories

```
types/          → Data structures (read first!)
services/       → API layer
components/shared/ → Reusable components
components/p2p/ → P2P features
components/exchangers/ → Exchanger features
cache/          → SSR/caching logic
pages/api/      → API endpoints
```

### Common Patterns

```
"Add component to P2P module"
"Fix exchanger rating display"
"Update type definitions for X"
"Refactor utility function"
"Add new API endpoint"
```

---

## ⚡ LIFEHACKS

### 1. **Targeted Searches**

```
❌ "Read all components to find X"
✅ "Search for 'X' in components/"
```

### 2. **Type-First Approach**

```
Always read type definitions before implementation
→ Understand data structure first
```

### 3. **Pattern Matching**

```
"Find similar implementation to X"
→ Cline searches and shows you patterns
```

### 4. **Batch Reads**

```
"Read types/p2p.ts, services/p2p.ts, and components/p2p/edit/index.tsx"
→ All in one request
```

### 5. **Use .clinerules**

```
Project context is already loaded
→ No need to explain architecture
```

---

## 🚨 TROUBLESHOOTING

### "Context Window Exceeded"

→ Start new conversation (Cmd+Shift+P → "Cline: New Task")

### "Too Expensive"

→ Check you're using Sonnet (not Opus)
→ Verify caching is enabled
→ Start fresh conversations more often

### "Cline Reading Too Much"

→ Be more specific in requests
→ Use search instead of reading
→ Explicitly say "don't read X"

### "Wrong File Edits"

→ Reference .clinerules for project structure
→ Point to similar existing code
→ Be explicit about file paths

---

## 🎓 KEYBOARD SHORTCUTS

```
Cmd+Shift+P → "Cline: New Task"    (Start fresh)
Cmd+L       → Open Cline chat
Cmd+K       → Quick Cline command
```

---

## 📈 MONITORING

### Check Usage

- Anthropic Console: https://console.anthropic.com/
- Watch token counts in Cline responses
- Set budget alerts in Anthropic dashboard

### Signs You're Using Too Much

- Responses taking >30 seconds
- Context window warnings
- High daily costs (>$5 for normal dev work)

---

## 🎯 BEST PRACTICES SUMMARY

1. **Start specific** → Read only what you need
2. **Use search** → Find before reading
3. **Batch operations** → Group related tasks
4. **Start fresh** → New task = new conversation
5. **Check types first** → Understand data structures
6. **Use caching** → Already enabled, just reuse context
7. **Be explicit** → Clear requests = better results
8. **Monitor costs** → Check Anthropic dashboard weekly

---

## 📚 FILES CREATED FOR YOU

```
.vscode/settings.json  → Cline configuration
.clinerules            → Project-specific rules
CLINE_GUIDE.md         → Complete documentation
CLINE_QUICK_REF.md     → This file
.gitignore             → Updated with Cline artifacts
```

---

## 🆘 NEED HELP?

1. Check CLINE_GUIDE.md (comprehensive guide)
2. Review .clinerules (project patterns)
3. Start fresh conversation
4. Use `/reportbug` in Cline chat
5. Anthropic docs: https://docs.anthropic.com/

---

## ✨ REMEMBER

- **Claude 3.5 Sonnet** = Best balance
- **Caching** = 90% savings
- **Specific requests** = Lower costs
- **Fresh conversations** = Better context
- **Search first** = Read less

**You're all set! Start building! 🚀**
