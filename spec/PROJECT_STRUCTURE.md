# Kosha Project Structure - Spec-Driven Development Guide

## Overview

Kosha follows a **spec-driven development (SDD)** approach, where specifications are the single source of truth for the entire application. This structure enables:

- ✅ **Easy requirement changes** - Update specs, regenerate code
- ✅ **Clear separation of concerns** - Business logic vs. technical implementation
- ✅ **Tool-assisted code generation** - Cursor, spec-kit, and other tools can generate boilerplate
- ✅ **Stakeholder-friendly** - Non-technical stakeholders can review requirements
- ✅ **Version control for design** - Track changes to architecture and requirements over time

## Directory Structure

```
kosha/
└── spec/                          # Single source of truth for all specifications
    ├── README.md                  # Overview of spec structure
    │
    ├── 01-requirements/              # Layer 1: WHAT & WHY (Business Requirements)
    │   ├── overview.md           # Product vision and mission
    │   ├── authentication.md     # Feature requirements (what it does, why it exists)
    │   ├── bill_management.md
    │   ├── expense_management.md
    │   ├── income_tracking.md
    │   ├── investment_monitoring.md
    │   ├── notifications.md
    │   └── payments.md
    │
    ├── 02-narrative/                 # Layer 1.5: User Stories & Context
    │   └── overview.md           # Feature narratives and rationale
    │
    ├── 03-architecture/              # Layer 2: System Architecture
    │   └── architecture.dsl      # Structurizr DSL - C4 model diagrams
    │
    ├── 04-design/                    # Layer 3: HOW (Technical Design)
    │   ├── backend_guidelines.md  # Backend coding standards
    │   ├── database_and_cache.md  # Database selection rationale
    │   ├── global_technical_rules.md # Cross-cutting technical rules
    │   └── features/             # Per-feature technical designs
    │       ├── authentication.md  # Detailed design: endpoints, DB schema, flows
    │       ├── bill_management.md
    │       ├── expense_management.md
    │       ├── income_tracking.md
    │       ├── investment_monitoring.md
    │       ├── notifications.md
    │       └── payments.md
    │
    ├── 05-technical/                 # Layer 4: Machine-Readable Spec (High-Level)
    │   └── kosha.spec.ts         # Complete feature spec in spec-kit DSL
    │
    ├── 06-backend/                   # Layer 5: Backend Implementation Specs
    │   ├── index.spec.ts         # Aggregates all backend features
    │   └── features/             # Per-feature backend specs
    │       ├── authentication.spec.ts
    │       ├── bill_management.spec.ts
    │       ├── dashboard.spec.ts
    │       ├── expense_management.spec.ts
    │       ├── income_tracking.spec.ts
    │       ├── investment_monitoring.spec.ts
    │       ├── notifications.spec.ts
    │       └── payments.spec.ts
    │
    └── 07-frontend/                   # Layer 6: Frontend Guidelines
        └── ui_guidelines.md       # UI/UX standards and component architecture
```

## The Spec-Driven Development Flow

### 1. **Requirements Layer** (`01-requirements/`)
**Purpose**: Capture WHAT the system should do and WHY

- Written in plain language (markdown)
- Accessible to non-technical stakeholders
- Describes business rules, edge cases, and goals
- **Example**: "Users must be able to link Gmail to auto-import bills"

**When to modify**: When business requirements change, new features are requested, or edge cases are discovered.

### 2. **Architecture Layer** (`03-architecture/`)
**Purpose**: Define system structure and component relationships

- Uses Structurizr DSL (C4 model)
- Shows containers, databases, external systems
- Defines communication patterns
- **Example**: Backend → Message Queue → Gmail Service

**When to modify**: When adding new services, changing database choices, or modifying system boundaries.

### 3. **Design Layer** (`04-design/`)
**Purpose**: Translate requirements into technical HOW

- Detailed technical specifications
- Database schemas, API endpoints, data flows
- Cross-cutting concerns (security, caching, error handling)
- Acceptance criteria and test scenarios

**When to modify**: When refining implementation details, adding new endpoints, or changing technical approaches.

### 4. **Technical Spec Layer** (`05-technical/`)
**Purpose**: Machine-readable high-level specification

- Uses spec-kit DSL (TypeScript-like syntax)
- Defines models and actions for all features
- Can be used by code generation tools
- **Example**: `feature("Authentication", () => { model("User", ...) })`

**When to modify**: When adding new features, changing models, or updating API contracts.

### 5. **Backend Spec Layer** (`06-backend/features/`)
**Purpose**: Detailed backend implementation specifications

- More granular than technical spec
- Includes pagination, filtering, database annotations
- Maps directly to backend code structure
- **Example**: `action("listBills", () => { param("page", "number", { optional: true }) })`

**When to modify**: When adding new endpoints, changing data models, or updating business logic.

### 6. **Frontend Guidelines** (`07-frontend/`)
**Purpose**: UI/UX standards and component architecture

- Component structure, state management patterns
- Styling guidelines, accessibility standards
- Integration patterns with backend

**When to modify**: When changing UI frameworks, design systems, or user experience patterns.

## How to Make Requirement Changes

### Scenario 1: Adding a New Feature (e.g., "Budget Planning")

1. **Update Requirements** (`01-requirements/budget_planning.md`)
   ```markdown
   # Budget Planning
   ## Feature Description
   Allow users to set monthly budgets and track spending against them.
   ```

2. **Update Architecture** (`03-architecture/architecture.dsl`)
   - Add new container if needed
   - Update relationships

3. **Add Design Doc** (`04-design/features/budget_planning.md`)
   - Define data models
   - Specify API endpoints
   - Document business logic

4. **Update Technical Spec** (`05-technical/kosha.spec.ts`)
   ```typescript
   feature("BudgetPlanning", () => {
     model("Budget", () => { ... });
     action("createBudget", () => { ... });
   });
   ```

5. **Add Backend Spec** (`06-backend/features/budget_planning.spec.ts`)
   - Detailed models and actions
   - Import in `06-backend/index.spec.ts`

6. **Generate Code** (using Cursor or spec-kit)
   - Tools read specs and generate boilerplate
   - Controllers, services, repositories

### Scenario 2: Modifying Existing Feature (e.g., Add "Recurring Bills")

1. **Update Requirements** (`01-requirements/bill_management.md`)
   - Add new business rule about recurring detection

2. **Update Design** (`04-design/features/bill_management.md`)
   - Add endpoint: `GET /api/v1/bills/recurring-suggestions`
   - Update data model to include recurrence field

3. **Update Technical Spec** (`05-technical/kosha.spec.ts`)
   - Add `recurrence` field to Bill model
   - Add `getRecurringSuggestions` action

4. **Update Backend Spec** (`06-backend/features/bill_management.spec.ts`)
   - Add detailed action with parameters

5. **Regenerate/Update Code**
   - Tools detect changes and suggest updates
   - Or manually update based on spec

### Scenario 3: Changing Database Choice

1. **Update Design** (`04-design/database_and_cache.md`)
   - Document new database choice and rationale

2. **Update Architecture** (`03-architecture/architecture.dsl`)
   - Add/remove database containers
   - Update relationships

3. **Update Backend Specs** (`06-backend/features/*.spec.ts`)
   - Add database annotations to models
   - Update comments indicating database choice

4. **Update Code**
   - Migrate data if needed
   - Update ORM/ODM configurations

## Benefits of This Structure

### ✅ **Single Source of Truth**
- All specifications live in one place
- No confusion about what the system should do
- Easy to track changes via Git

### ✅ **Separation of Concerns**
- Business requirements separate from technical details
- Non-technical stakeholders can review `01-requirements/`
- Developers focus on `04-design/` and `06-backend/`

### ✅ **Tool Integration**
- Cursor can read specs and generate code
- spec-kit can generate TypeScript interfaces
- Architecture tools can visualize `03-architecture/architecture.dsl`

### ✅ **Easy Maintenance**
- Change requirements → update one file → regenerate code
- Clear traceability: requirement → design → spec → code
- Version control tracks all changes

### ✅ **Scalability**
- Add new features by following the same pattern
- Consistent structure across all features
- Easy onboarding for new developers

## Integration with Lovable Prototype

The [Lovable prototype](https://lovable.dev/projects/afa70841-976d-443c-b0fc-4938aa6553ea) can be synchronized with these specs:

1. **Frontend Components** → Read from `07-frontend/ui_guidelines.md` and `01-requirements/`
2. **API Contracts** → Generated from `06-backend/features/*.spec.ts`
3. **Data Models** → Generated from model definitions in specs
4. **User Flows** → Based on actions defined in technical specs

## Best Practices

1. **Always start with requirements** - Don't skip to implementation
2. **Keep specs in sync** - If you change a model in backend spec, update technical spec too
3. **Document decisions** - Use design docs to explain WHY, not just WHAT
4. **Version control everything** - Commit spec changes with meaningful messages
5. **Review before coding** - Get stakeholder approval on requirements before implementing

## Next Steps

1. Review the current specs to understand the structure
2. Use Cursor or spec-kit to generate initial code from specs
3. Implement features following the design documents
4. Update specs as requirements evolve
5. Keep specs and code in sync

This structure ensures that Kosha remains maintainable, scalable, and aligned with business requirements as it grows.

