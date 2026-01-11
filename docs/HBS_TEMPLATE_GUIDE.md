# 📝 Handlebars (HBS) Template Guide

**Handlebars** is a simple templating language that lets you generate dynamic text/code by combining **templates** with **data**.

---

## 🎯 What Problem Does It Solve?

### ❌ Without Templates (Hard to Maintain):
```typescript
function generateMove(name: string, resources: any[]) {
  let code = "module " + name + " {\n";
  for (let res of resources) {
    code += "  struct " + res.name + " has key {\n";
    code += "    value: " + res.type + "\n";
    code += "  }\n";
  }
  code += "}\n";
  return code;
}
```

### ✅ With Templates (Clean & Maintainable):
```handlebars
{{!-- contract.move.hbs --}}
module {{moduleName}} {
  {{#each resources}}
  struct {{name}} has key {
    value: {{type}}
  }
  {{/each}}
}
```

```typescript
// Just pass data to template
const output = template({ moduleName: "Token", resources: [...] });
```

---

## 📊 Data Flow in Js2Move Compiler

### Step-by-Step Process:

```
┌─────────────────┐
│  1. User Input  │  contract Token { resource Balance; }
│   (.movejs)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   2. Compiler   │  Lexer → Parser → AST → Semantic → IR
│    Pipeline     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 3. Data Object  │  { moduleName: "Token", resources: [...] }
│  (JavaScript)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 4. HBS Template │  module {{moduleName}} { ... }
│ (contract.hbs)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  5. Move Code   │  module Token { struct Balance has key... }
│   (output)      │
└─────────────────┘
```

---

## 🔧 Common Handlebars Syntax

| Syntax | Purpose | Example |
|--------|---------|---------|
| `{{variable}}` | Insert variable | `{{moduleName}}` |
| `{{#if condition}}...{{/if}}` | Conditional | Show only if true |
| `{{#each array}}...{{/each}}` | Loop | Iterate over items |
| `{{#unless condition}}...{{/unless}}` | Negative conditional | Show if false |
| `{{!-- comment --}}` | Comment | Won't appear in output |
| `{{> partial}}` | Include another template | Reuse template chunks |

---

## 📚 Practical Examples

### Example 1: Basic Variable Substitution

**Template** (`module.move.hbs`):
```handlebars
module {{moduleName}} {
  // Module address: {{address}}
  // Author: {{author}}
}
```

**Data** (from compiler):
```typescript
const data = {
  moduleName: "MyToken",
  address: "0x1234",
  author: "Alice"
};
```

**Output**:
```move
module MyToken {
  // Module address: 0x1234
  // Author: Alice
}
```

---

### Example 2: Conditional Rendering

**Template** (`init.move.hbs`):
```handlebars
module {{moduleName}} {
  {{#if hasInit}}
  public entry fun init(account: &signer) {
    {{#if needsCapability}}
    move_to(account, AdminCapability {});
    {{/if}}
  }
  {{/if}}
  
  {{#unless isReadOnly}}
  public entry fun mutate(account: &signer, value: u64) {
    // mutation logic
  }
  {{/unless}}
}
```

**Data**:
```typescript
const data = {
  moduleName: "Vault",
  hasInit: true,
  needsCapability: true,
  isReadOnly: false
};
```

**Output**:
```move
module Vault {
  public entry fun init(account: &signer) {
    move_to(account, AdminCapability {});
  }
  
  public entry fun mutate(account: &signer, value: u64) {
    // mutation logic
  }
}
```

---

### Example 3: Loops (Most Important!)

**Template** (`resources.move.hbs`):
```handlebars
module {{moduleName}} {
  {{#each resources}}
  struct {{name}} has {{#each abilities}}{{this}}{{#unless @last}}, {{/unless}}{{/each}} {
    {{#each fields}}
    {{name}}: {{type}},
    {{/each}}
  }
  {{/each}}
}
```

**Data**:
```typescript
const data = {
  moduleName: "Token",
  resources: [
    {
      name: "Balance",
      abilities: ["key", "store"],
      fields: [
        { name: "value", type: "u64" },
        { name: "locked", type: "bool" }
      ]
    },
    {
      name: "Metadata",
      abilities: ["key"],
      fields: [
        { name: "name", type: "String" },
        { name: "symbol", type: "String" }
      ]
    }
  ]
};
```

**Output**:
```move
module Token {
  struct Balance has key, store {
    value: u64,
    locked: bool,
  }
  struct Metadata has key {
    name: String,
    symbol: String,
  }
}
```

---

### Example 4: Nested Data & Context

**Template** (`function.move.hbs`):
```handlebars
public {{visibility}} fun {{name}}(
  {{#each params}}
  {{name}}: {{#if isSigner}}&signer{{else}}{{type}}{{/if}}{{#unless @last}},{{/unless}}
  {{/each}}
){{#if hasReturn}}: {{returnType}}{{/if}}{{#if acquires}} acquires {{#each acquires}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}} {
  {{#each statements}}
  {{this}}
  {{/each}}
}
```

**Data**:
```typescript
const data = {
  visibility: "entry",
  name: "transfer",
  params: [
    { name: "from", type: "address", isSigner: true },
    { name: "to", type: "address", isSigner: false },
    { name: "amount", type: "u64", isSigner: false }
  ],
  hasReturn: false,
  acquires: ["Balance"],
  statements: [
    "let from_balance = borrow_global_mut<Balance>(signer::address_of(from));",
    "assert!(from_balance.value >= amount, ERROR_INSUFFICIENT_BALANCE);",
    "from_balance.value = from_balance.value - amount;"
  ]
};
```

**Output**:
```move
public entry fun transfer(
  from: &signer,
  to: address,
  amount: u64
) acquires Balance {
  let from_balance = borrow_global_mut<Balance>(signer::address_of(from));
  assert!(from_balance.value >= amount, ERROR_INSUFFICIENT_BALANCE);
  from_balance.value = from_balance.value - amount;
}
```

---

## 🔄 How It Works in Our Compiler

### File Structure:
```
packages/compiler/
├── src/
│   ├── templates/           ← HBS templates (.hbs files)
│   │   ├── contract.move.hbs
│   │   ├── module.move.hbs
│   │   ├── resource.move.hbs
│   │   └── function.move.hbs
│   ├── generator/           ← Code that uses templates
│   │   └── index.ts         ← Compiles template + data
│   └── index.ts
```

### Generator Code (`generator/index.ts`):

```typescript
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

// 1. Load template file
const templatePath = path.join(__dirname, '../templates/contract.move.hbs');
const templateSource = fs.readFileSync(templatePath, 'utf-8');

// 2. Compile template
const template = Handlebars.compile(templateSource);

// 3. Prepare data (from AST/IR)
export function generateMove(ir: IntermediateRepresentation): string {
  const data = {
    moduleName: ir.moduleName,
    address: ir.address,
    resources: ir.resources.map(r => ({
      name: r.name,
      abilities: r.abilities,
      fields: r.fields
    })),
    functions: ir.functions.map(f => ({
      visibility: f.visibility,
      name: f.name,
      params: f.params,
      body: f.body
    }))
  };
  
  // 4. Generate output
  const moveCode = template(data);
  
  return moveCode;
}
```

---

## 🎨 Advanced Features

### Custom Helpers

You can register custom functions:

```typescript
// Register helper
Handlebars.registerHelper('capitalize', function(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
});

Handlebars.registerHelper('join', function(array, separator) {
  return array.join(separator);
});
```

**Usage in template**:
```handlebars
module {{capitalize moduleName}} {
  use 0x1::{{join imports ", 0x1::"}};
}
```

**Data**:
```typescript
{ moduleName: "token", imports: ["signer", "vector", "string"] }
```

**Output**:
```move
module Token {
  use 0x1::signer, 0x1::vector, 0x1::string;
}
```

---

### Partials (Reusable Templates)

**Define partial** (`_field.hbs`):
```handlebars
{{name}}: {{type}}{{#if hasDefault}} = {{default}}{{/if}}
```

**Register it**:
```typescript
Handlebars.registerPartial('field', fieldTemplate);
```

**Use in main template**:
```handlebars
struct {{name}} has key {
  {{#each fields}}
  {{> field}}
  {{/each}}
}
```

---

## 💡 Why This Approach?

### ✅ Benefits:

1. **Separation of Concerns**: Logic (TypeScript) separate from output format (HBS)
2. **Easy to Modify**: Change Move output without touching compiler logic
3. **Readable**: Templates look like the output they produce
4. **Reusable**: Create partials for common patterns
5. **Type-Safe Data**: Data object is fully typed in TypeScript

### 🎯 Real-World Use Case:

**Scenario**: Move language adds new syntax in v2.0

**Without templates**:
- Search through 50+ string concatenations
- Risk breaking existing logic
- Hard to test

**With templates**:
- Update 1-2 template files
- Compiler logic unchanged
- Easy to test both versions

---

## 🚀 Getting Started

### 1. Install Handlebars:
```bash
cd packages/compiler
pnpm add handlebars
pnpm add -D @types/handlebars
```

### 2. Create a Template:
```handlebars
{{!-- src/templates/simple.move.hbs --}}
module {{name}} {
  struct Data has key {
    value: u64
  }
}
```

### 3. Use It:
```typescript
import Handlebars from 'handlebars';
import fs from 'fs';

const templateSource = fs.readFileSync('./simple.move.hbs', 'utf-8');
const template = Handlebars.compile(templateSource);

const output = template({ name: "MyModule" });
console.log(output);
// Output:
// module MyModule {
//   struct Data has key {
//     value: u64
//   }
// }
```

---

## 📋 Cheat Sheet

### Special Variables in Loops:

| Variable | Description |
|----------|-------------|
| `@index` | Current iteration index (0-based) |
| `@first` | True if first iteration |
| `@last` | True if last iteration |
| `@key` | Current key (for object iteration) |

**Example**:
```handlebars
{{#each items}}
  Item {{@index}}: {{this}}{{#unless @last}},{{/unless}}
{{/each}}
```

### Escaping:

```handlebars
{{variable}}     <!-- Escaped (safe) -->
{{{variable}}}   <!-- Unescaped (use with caution!) -->
```

### Comments:

```handlebars
{{!-- This won't appear in output --}}
{{! Neither will this }}
```

---

## 🔗 Further Reading

- [Handlebars Official Docs](https://handlebarsjs.com/)
- [Handlebars Guide](https://handlebarsjs.com/guide/)
- [Template Best Practices](https://handlebarsjs.com/guide/expressions.html)

---

## 💼 In Js2Move Project

**Your templates go here**: `packages/compiler/src/templates/*.hbs`  
**Data comes from**: IR (Intermediate Representation) in `packages/compiler/src/ir/`  
**Generator uses them**: `packages/compiler/src/generator/index.ts`

**Next Steps**:
1. Study existing `contract.move.hbs`
2. Create more specific templates
3. Build data objects from IR
4. Generate beautiful Move code! 🎨
