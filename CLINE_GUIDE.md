# 🤖 CLINE AI ASSISTANT - COMPLETE SETUP GUIDE

## 📋 Table of Contents

1. [Configuration Overview](#configuration-overview)
2. [Model Selection & Cost Optimization](#model-selection--cost-optimization)
3. [Context Management Best Practices](#context-management-best-practices)
4. [Lifehacks & Pro Tips](#lifehacks--pro-tips)
5. [Common Issues & Solutions](#common-issues--solutions)
6. [Workflow Examples](#workflow-examples)

---

## ⚙️ Configuration Overview

### VSCode Settings (`.vscode/settings.json`)

Your Cline is configured with optimal settings for **above-average strength** while keeping costs **low**:

```json
{
  "cline.apiProvider": "anthropic",
  "cline.apiModelId": "claude-3-5-sonnet-20241022",
  "cline.maxFileLineCount": 1000,
  "cline.enableCaching": true,
  "cline.maxContextTokens": 180000,
  "cline.autoApproveReadOnly": true
}
```

### Key Settings Explained:

- **Model**: Claude 3.5 Sonnet - Best balance of intelligence and cost
- **Max File Lines**: 1000 - Prevents reading huge files that waste tokens
- **Caching**: Enabled - Reuses context, saves ~90% on repeated reads
- **Auto-approve reads**: Saves clicks on safe operations
- **Max Context**: 180K tokens - Leaves buffer for responses

---

## 💰 Model Selection & Cost Optimization

### Recommended Model Hierarchy:

| Model                    | Use Case                            | Cost   | Strength     |
| ------------------------ | ----------------------------------- | ------ | ------------ |
| **Claude 3.5 Sonnet** ⭐ | Default - Best balance              | Medium | ⭐⭐⭐⭐⭐   |
| Claude 3.5 Haiku         | Simple tasks, refactoring           | Low    | ⭐⭐⭐       |
| Claude Opus              | Complex architecture, critical bugs | High   | ⭐⭐⭐⭐⭐⭐ |

### Cost-Saving Strategies:

#### 1. **Use Prompt Caching** (Already Enabled)

- First read: Full cost
- Subsequent reads: ~10% cost
- **Savings**: Up to 90% on repeated context

#### 2. **Batch Operations**

```
❌ BAD: "Read file A" → "Read file B" → "Read file C"
✅ GOOD: "Read files A, B, and C"
```

#### 3. **Use Targeted Tools**

```
❌ BAD: Read entire 500-line file to find one function
✅ GOOD: Use search_files with regex to find specific code
```

#### 4. **Avoid Redundant Reads**

```
❌ BAD: Reading the same file multiple times in one session
✅ GOOD: Read once, reference in conversation
```

#### 5. **Smart File Exploration**

```
❌ BAD: list_files recursively on entire project
✅ GOOD: list_code_definition_names for overview, then read specific files
```

---

## 🧠 Context Management Best Practices

### The Context Window Problem

- Claude 3.5 Sonnet: 200K token limit
- Your config: 180K max (safety buffer)
- **Problem**: Large files + conversation history = context overflow

### Solutions:

#### 1. **Start Fresh When Needed**

- New task? Start new conversation
- Context getting bloated? Start fresh
- **Shortcut**: Cmd+Shift+P → "Cline: New Task"

#### 2. **Use .clinerules File** (Already Created)

- Project-specific instructions
- Reduces need to explain architecture repeatedly
- Cline reads this automatically

#### 3. **Limit File Reads**

```bash
# Your settings already limit to 1000 lines per file
# For larger files, use start_line and end_line parameters
```

#### 4. **Exclude Noise**

Your `.vscode/settings.json` already excludes:

- `node_modules/`
- `.next/`
- `dist/`
- `*.log`
- `yarn.lock`

#### 5. **Strategic File Reading Order**

1. **Types first** (`types/*.ts`) - Understand data structures
2. **Services** (`services/queries.ts`) - API layer
3. **Components** - Specific to task
4. **Never**: Lock files, build artifacts, node_modules

---

## 🚀 Lifehacks & Pro Tips

### 1. **Use Search Instead of Reading**

```
Task: "Find all components using useQuery hook"
❌ BAD: Read 50 component files
✅ GOOD: search_files with regex: "useQuery"
```

### 2. **List Definitions Before Reading**

```
Task: "Understand the P2P module"
Step 1: list_code_definition_names on components/p2p/
Step 2: Read only relevant files based on definitions
```

### 3. **Targeted Edits with replace_in_file**

```
❌ BAD: Read entire file → Rewrite entire file
✅ GOOD: Use replace_in_file with SEARCH/REPLACE blocks
```

### 4. **Batch Independent Operations**

```typescript
// Cline can do these in parallel:
- Read types/p2p.ts
- Read services/p2p.ts
- Search for "P2PMaker" pattern
```

### 5. **Use Task Progress Tracking**

Cline maintains a checklist - you can see progress and what's left

### 6. **Leverage Auto-Approval**

Your settings auto-approve:

- File reads (safe)
- Repeated operations
- Non-destructive commands

### 7. **Smart Command Execution**

```bash
# Cline can run commands directly
✅ "Run the dev server" → Cline executes: yarn dev
✅ "Check TypeScript errors" → Cline executes: yarn tsc --noEmit
```

### 8. **Use Plan Mode for Complex Tasks**

```
You: "I want to refactor the entire P2P module"
Cline: [Switches to PLAN mode]
- Explores architecture
- Proposes detailed plan
- You approve
- Switches to ACT mode
- Implements
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Context Window Exceeded"

**Symptoms**: Error about token limit
**Solutions**:

- Start new conversation
- Reduce file reading scope
- Use search instead of reading multiple files
- Check if you're reading generated files (don't!)

### Issue 2: "Cline is Reading Too Many Files"

**Symptoms**: Slow responses, high costs
**Solutions**:

- Be more specific in requests
- Use .clinerules to guide Cline
- Explicitly say "don't read X"
- Use list_code_definition_names first

### Issue 3: "Cline Rewrites Entire Files"

**Symptoms**: Large diffs, formatting changes
**Solutions**:

- Ask for "targeted edit" or "small change"
- Cline should use replace_in_file
- Review .clinerules - it's instructed to use targeted edits

### Issue 4: "Expensive API Calls"

**Symptoms**: High Anthropic bills
**Solutions**:

- Check you're using Sonnet (not Opus)
- Verify caching is enabled
- Start fresh conversations more often
- Avoid reading same files repeatedly

### Issue 5: "Cline Doesn't Understand Project Structure"

**Symptoms**: Wrong file locations, bad imports
**Solutions**:

- .clinerules file guides this (already created)
- Explicitly reference project structure
- Point to similar existing code

---

## 📚 Workflow Examples

### Example 1: Adding a New Feature

```
You: "Add a new filter button to the P2P makers list"

Cline will:
1. Read types/p2p.ts (understand data)
2. Read components/p2p/makers/TopPanel.tsx (existing buttons)
3. Search for similar filter implementations
4. Create new component following patterns
5. Update parent component
6. Test imports
```

### Example 2: Debugging an Issue

```
You: "The exchanger rating isn't displaying correctly"

Cline will:
1. Read components/exchangers/exchanger/index.tsx
2. Check types/exchanger.ts for rating type
3. Search for rating rendering logic
4. Identify issue
5. Propose fix with targeted edit
```

### Example 3: Refactoring

```
You: "Extract the rate calculation logic into a utility"

Cline will:
1. Search for rate calculation patterns
2. Read relevant component files
3. Create new utility in services/utils.ts
4. Update all components to use new utility
5. Verify imports
```

### Example 4: Understanding Codebase

```
You: "Explain how the P2P offer editing works"

Cline will:
1. list_code_definition_names on components/p2p/edit/
2. Read key files (index.tsx, types)
3. Explain architecture
4. Show data flow
```

---

## 🎯 Quick Reference Cheat Sheet

### DO ✅

- Use Claude 3.5 Sonnet for most tasks
- Enable caching (already done)
- Start fresh conversations for new tasks
- Use search_files for finding patterns
- Use list_code_definition_names for overview
- Batch independent operations
- Be specific in requests
- Use .clinerules for project context

### DON'T ❌

- Read node_modules or build files
- Read entire directories recursively
- Rewrite files when small edits work
- Keep conversations going forever
- Read the same file multiple times
- Use Opus for simple tasks
- Ignore context window warnings

### Keyboard Shortcuts

- **Cmd+Shift+P** → "Cline: New Task" - Start fresh
- **Cmd+L** → Open Cline chat
- **Cmd+K** → Quick Cline command

### Cost Estimates (Approximate)

- Simple task (1-2 file reads, small edit): $0.01-0.05
- Medium task (5-10 files, multiple edits): $0.10-0.30
- Complex task (architecture changes): $0.50-2.00
- **With caching**: Reduce by 50-90% on repeated context

---

## 🔧 Advanced Configuration

### Custom Model Switching

Edit `.vscode/settings.json`:

```json
{
  // For simple tasks:
  "cline.apiModelId": "claude-3-5-haiku-20241022",

  // For complex tasks:
  "cline.apiModelId": "claude-opus-4-20250514",

  // Default (recommended):
  "cline.apiModelId": "claude-3-5-sonnet-20241022"
}
```

### Adjust Context Limits

```json
{
  // More aggressive (faster, cheaper):
  "cline.maxContextTokens": 100000,
  "cline.maxFileLineCount": 500,

  // More permissive (slower, more expensive):
  "cline.maxContextTokens": 190000,
  "cline.maxFileLineCount": 2000
}
```

---

## 📊 Monitoring Usage

### Check Your Anthropic Dashboard

- Visit: https://console.anthropic.com/
- Monitor: API usage, costs, token consumption
- Set: Budget alerts

### Cline Usage Stats

- Cline shows token usage in responses
- Watch for "context window" warnings
- Track conversation length

---

## 🎓 Learning Resources

- **Cline Docs**: https://github.com/cline/cline
- **Anthropic API**: https://docs.anthropic.com/
- **Claude Models**: https://www.anthropic.com/claude
- **Prompt Caching**: https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching

---

## 🆘 Getting Help

1. **Check this guide first**
2. **Review .clinerules** for project-specific patterns
3. **Start fresh conversation** if context is bloated
4. **Report bugs**: Use `/reportbug` in Cline chat
5. **Community**: Cline Discord/GitHub discussions

---

## ✨ Summary

You now have:

- ✅ Optimized VSCode settings for Cline
- ✅ Claude 3.5 Sonnet (best balance)
- ✅ Prompt caching enabled (90% savings)
- ✅ Auto-approval for safe operations
- ✅ Project-specific .clinerules
- ✅ File exclusions to reduce noise
- ✅ Context management strategies
- ✅ Cost optimization techniques

**Your setup is configured for above-average strength with cost-effectiveness!**

Start using Cline and watch your productivity soar! 🚀
