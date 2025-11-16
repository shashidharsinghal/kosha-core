# TypeScript Configuration Explained

This document explains the `tsconfig.json` configuration for the Kosha backend.

## Overview

The `tsconfig.json` file configures how TypeScript compiles your source code. It's optimized for a Node.js/Express backend with TypeORM and MongoDB.

## Key Configuration Sections

### 1. Language and Environment

```json
"target": "ES2020"           // Compiles to ES2020 JavaScript (Node.js 14+)
"lib": ["ES2020"]           // Includes ES2020 standard library types
"module": "commonjs"        // Uses CommonJS modules (Node.js standard)
"moduleResolution": "node"  // Uses Node.js module resolution
```

**Why:** Node.js uses CommonJS, and ES2020 provides modern features while maintaining compatibility.

### 2. Output Configuration

```json
"outDir": "./dist"          // Compiled JS files go to dist/
"rootDir": "./src"          // Source files are in src/
"declaration": true         // Generate .d.ts type definition files
"declarationMap": true      // Source maps for .d.ts files
"sourceMap": true           // Source maps for debugging
```

**Why:** 
- Separates source from compiled code
- Generates type definitions for better IDE support
- Source maps enable debugging of compiled code

### 3. Strict Type Checking

```json
"strict": true                      // Enables all strict checks
"noImplicitAny": true               // Error on implicit 'any' types
"strictNullChecks": true           // Strict null/undefined checking
"strictFunctionTypes": true        // Strict function type checking
"strictPropertyInitialization": true // Requires property initialization
"noImplicitReturns": true          // All code paths must return
```

**Why:** Catches bugs early and enforces type safety. The `strictPropertyInitialization` is why we use `!` (definite assignment assertion) in TypeORM entities.

### 4. Module Interoperability

```json
"esModuleInterop": true            // Allows import from CommonJS
"allowSyntheticDefaultImports": true // Allows default imports
```

**Why:** Enables importing CommonJS modules (like Express) using ES6 `import` syntax.

### 5. Decorators (TypeORM)

```json
"experimentalDecorators": true     // Enable decorator support
"emitDecoratorMetadata": true      // Emit metadata (required by TypeORM)
```

**Why:** TypeORM uses decorators (`@Entity`, `@Column`, etc.) which require these options.

### 6. Path Mapping

```json
"baseUrl": ".",
"paths": {
  "@/*": ["src/*"]
}
```

**Why:** Allows using `@/config/app` instead of `../../config/app` for cleaner imports.

### 7. Type Inclusion

```json
"types": []                        // Don't auto-include @types packages
"skipLibCheck": true               // Skip type checking of .d.ts files
```

**Why:** 
- `types: []` prevents auto-inclusion of all `@types/*` packages (faster compilation)
- `skipLibCheck: true` skips type checking of declaration files (faster builds)

## Common Issues and Solutions

### Issue: "Cannot find type definition file for 'supertest'"

**Cause:** TypeScript language server tries to auto-include types from `node_modules/@types/`.

**Solution:** This is a false positive. The `skipLibCheck: true` and `types: []` options handle this. The code will compile fine. If the IDE warning bothers you, you can:
- Ignore it (it doesn't affect compilation)
- Add `"types": ["node"]` to explicitly include only Node.js types

### Issue: "Property has no initializer"

**Cause:** `strictPropertyInitialization: true` requires all class properties to be initialized.

**Solution:** Use definite assignment assertion (`!`) for TypeORM entities:
```typescript
@Column()
name!: string;  // The ! tells TypeScript: "I know this will be initialized"
```

### Issue: Unused variables/parameters

**Solution:** We set `noUnusedLocals: false` and `noUnusedParameters: false` to allow unused variables (common in Express route handlers where you might not use `req` or `res`).

## Build Commands

```bash
npm run build        # Compile TypeScript to JavaScript
npm run dev          # Run with ts-node-dev (auto-reload)
npm start            # Run compiled JavaScript
```

## File Structure

```
backend/
├── src/              # TypeScript source files
│   ├── config/       # Configuration files
│   ├── controllers/  # Route controllers
│   ├── models/       # Database models (TypeORM/Mongoose)
│   ├── services/     # Business logic
│   └── ...
├── dist/             # Compiled JavaScript (generated)
└── tsconfig.json     # This file
```

## Best Practices

1. **Always use strict mode** - Catches bugs early
2. **Use path aliases** - Cleaner imports with `@/`
3. **Generate declarations** - Better IDE support
4. **Enable source maps** - Easier debugging
5. **Skip lib check** - Faster builds (types are already checked)

## References

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
- [TypeORM Decorators](https://typeorm.io/decorator-reference)
- [Node.js TypeScript Guide](https://nodejs.org/en/docs/guides/typescript/)

