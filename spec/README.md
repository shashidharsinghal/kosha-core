# Kosha Specification Directory Structure

The **`spec/`** folder follows a **spec-driven development (SDD)** approach with a 6-layer architecture. This structure separates high‑level requirements from technical details and makes it easy to maintain versions of each artifact. The layers flow from business requirements to implementation details.

## Directory Structure (Ordered by Development Flow)

```
spec/
├── 01-requirements/          # Layer 1: WHAT & WHY (Business Requirements)
├── 02-narrative/             # Layer 1.5: User Stories & Context
├── 03-architecture/          # Layer 2: System Architecture
├── 04-design/                # Layer 3: HOW (Technical Design)
├── 05-technical/             # Layer 4: Machine-Readable Spec (High-Level)
├── 06-backend/               # Layer 5: Backend Implementation Specs
└── 07-frontend/              # Layer 6: Frontend Guidelines
```

## Layer-by-Layer Breakdown

### Layer 1: Requirements (`01-requirements/`)
**Purpose**: Capture WHAT the system should do and WHY

- Narrative documents describing what each feature does and why
- High‑level vision and feature rationale (e.g. `overview.md`)
- Business rules, edge cases, and goals
- Accessible to non-technical stakeholders
- **Files**: `overview.md`, `authentication.md`, `bill_management.md`, etc.

### Layer 1.5: Narrative (`02-narrative/`)
**Purpose**: User stories, feature narratives, and product context

- Feature narratives explaining the "what" and "why"
- User stories and acceptance criteria
- Product vision and objectives
- **Files**: `overview.md`

### Layer 2: Architecture (`03-architecture/`)
**Purpose**: Define system structure and component relationships

- Architecture diagrams and definitions using Structurizr DSL
- System context and container diagrams (C4 model)
- Component relationships and communication patterns
- **Files**: `architecture.dsl`

### Layer 3: Design (`04-design/`)
**Purpose**: Translate requirements into technical HOW

- Technical design documents for cross‑cutting concerns
- Per-feature technical specifications
- Database schemas, API endpoints, data flows
- Acceptance criteria and test scenarios

**Contents**:
- `database_and_cache.md` – Database selection rationale (MongoDB, PostgreSQL, Redis)
- `backend_guidelines.md` – Backend coding standards, API design, error handling
- `global_technical_rules.md` – Cross-cutting technical conventions
- `features/` – Per-feature technical designs:
  - `authentication.md`, `bill_management.md`, `payments.md`, etc.

### Layer 4: Technical Spec (`05-technical/`)
**Purpose**: Machine-readable high-level specification

- Complete feature specification in spec-kit DSL (TypeScript-like syntax)
- Defines models and actions for all features
- Used by code generation tools (Cursor, spec-kit)
- **Files**: `kosha.spec.ts`

### Layer 5: Backend Specs (`06-backend/`)
**Purpose**: Detailed backend implementation specifications

- Machine‑readable specifications in spec-kit DSL (TypeScript)
- More granular than technical spec
- Includes pagination, filtering, database annotations
- Maps directly to backend code structure

**Contents**:
- `index.spec.ts` – Aggregates all backend features
- `features/` – Per-feature backend specs:
  - `authentication.spec.ts`, `bill_management.spec.ts`, `dashboard.spec.ts`, etc.

### Layer 6: Frontend (`07-frontend/`)
**Purpose**: UI/UX standards and component architecture

- Guidelines and specifications for the user interface
- Component architecture, state management patterns
- Styling guidelines, accessibility standards
- **Files**: `ui_guidelines.md`

## Development Flow

Follow this order when working on features:

1. **Start with requirements** (`01-requirements/`) – Capture user stories and acceptance criteria
2. **Add narrative context** (`02-narrative/`) – Document feature rationale and user stories
3. **Define architecture** (`03-architecture/`) – Update when new containers or relationships are introduced
4. **Detail the design** (`04-design/`) – Add design documents for common concerns and feature implementations
5. **Update technical spec** (`05-technical/`) – Add feature models and actions in spec-kit DSL
6. **Write backend specs** (`06-backend/features/`) – Create detailed backend specifications, import in `index.spec.ts`
7. **Document the frontend** (`07-frontend/`) – Add UI/UX guidelines or component documentation

## Making Changes

When requirements change:

1. **Update Layer 1** (`01-requirements/`) – Modify business requirements
2. **Update Layer 2** (`03-architecture/`) – Adjust system structure if needed
3. **Update Layer 3** (`04-design/`) – Refine technical design
4. **Update Layer 4** (`05-technical/`) – Modify high-level spec
5. **Update Layer 5** (`06-backend/`) – Update detailed backend specs
6. **Regenerate code** – Tools read specs and generate/update code

## Benefits

- ✅ **Single Source of Truth** – All specifications in one place
- ✅ **Clear Traceability** – requirement → design → spec → code
- ✅ **Tool Integration** – Cursor, spec-kit can generate code from specs
- ✅ **Easy Maintenance** – Change spec → regenerate code
- ✅ **Stakeholder-Friendly** – Non-technical people can review requirements

This layered approach helps both technical and non‑technical stakeholders understand the system and ensures that tools like Cursor can generate code from well‑structured specifications.

For detailed information on the structure and how to make changes, see `PROJECT_STRUCTURE.md`.
