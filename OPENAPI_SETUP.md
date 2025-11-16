# OpenAPI/Swagger API Documentation Setup

This document describes the OpenAPI specification setup for the Kosha backend API.

## Overview

The backend API is documented using OpenAPI 3.0 specification, which enables:
- Interactive API documentation via Swagger UI
- API contract validation
- Code generation for frontend clients
- Integration with Lovable frontend

## Files

- `src/config/openapi.yaml` - Complete OpenAPI 3.0 specification
- `src/config/swagger.ts` - Swagger UI setup and configuration

## Endpoints

Once the server is running, the following endpoints are available:

### Swagger UI
- **URL**: `http://localhost:3000/api/docs`
- **Description**: Interactive API documentation interface
- **Note**: Only available in non-production environments

### OpenAPI JSON
- **URL**: `http://localhost:3000/api/openapi.json`
- **Description**: OpenAPI specification in JSON format
- **Use Case**: Import into API clients, code generators

### OpenAPI YAML
- **URL**: `http://localhost:3000/api/openapi.yaml`
- **Description**: OpenAPI specification in YAML format
- **Use Case**: Version control, manual editing

## Usage

### Viewing API Documentation

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000/api/docs
   ```

3. You can now:
   - Browse all API endpoints
   - See request/response schemas
   - Test endpoints directly from the UI
   - View authentication requirements

### Using with Lovable Frontend

1. **Get the OpenAPI spec**:
   - Access `http://localhost:3000/api/openapi.json` (or `.yaml`)
   - Copy the content or use the URL directly

2. **Import into Lovable**:
   - Use the OpenAPI spec URL in Lovable's API integration
   - Lovable can generate API client code automatically

3. **Keep in sync**:
   - When backend API changes, update `openapi.yaml`
   - The spec is the single source of truth between backend and frontend

### Updating the Specification

1. Edit `src/config/openapi.yaml`
2. Follow OpenAPI 3.0 format
3. Ensure all endpoints, schemas, and parameters are documented
4. Test the changes by viewing Swagger UI

## API Coverage

The OpenAPI spec includes documentation for:

- ✅ Authentication (register, login, refresh, logout, link Gmail)
- ✅ Bills (list, create, update, import, mark paid, recurring suggestions)
- ✅ Expenses (list, create, update, delete, import, summary)
- ✅ Income (list, create, update, delete, import, summary)
- ✅ Investments (assets, transactions, prices, portfolio summary)
- ✅ Payments (UPI accounts, mandates, payment processing)
- ✅ Notifications (preferences, scheduling, delivery)
- ✅ Dashboard (summary, health metrics, trends)

## Security

- Swagger UI is **disabled in production** environments
- All protected endpoints require JWT Bearer token authentication
- Authentication is documented in the spec under `components.securitySchemes`

## Dependencies

- `swagger-ui-express` - Swagger UI middleware
- `js-yaml` - YAML file parsing

## Next Steps

1. ✅ OpenAPI spec created
2. ✅ Swagger UI integrated
3. ✅ Dependencies installed
4. 📝 Update spec as API evolves
5. 📝 Generate TypeScript types from spec (optional)
6. 📝 Set up contract testing (optional)

