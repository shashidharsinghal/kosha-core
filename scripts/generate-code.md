# Code Generation Instructions

Since we're using spec-kit DSL format, code generation can be done in two ways:

## Option 1: Manual Code Generation (Recommended for now)

I'll create the essential structure files for each module based on the specs. This provides:
- Complete folder structure
- Model definitions
- Repository interfaces
- Service skeletons
- Controller skeletons
- Route definitions

## Option 2: Automated Code Generation

For future automation, you can:
1. Use Cursor's AI to generate code from specs
2. Create a custom script to parse spec-kit DSL
3. Use tools like `@spec-kit/cli` if available

## Current Approach

I'm generating the complete code structure manually for all 8 modules:
1. Authentication
2. Bill Management
3. Expense Management
4. Income Tracking
5. Investment Monitoring
6. Payments
7. Notifications
8. Dashboard

Each module will have:
- Models (MongoDB schemas or PostgreSQL entities)
- Repositories (data access layer)
- Services (business logic)
- Controllers (HTTP handlers)
- Routes (API endpoints)
- Validation schemas (Zod)

