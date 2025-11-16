# Quick Start Guide

Get the Kosha backend up and running in minutes!

## Prerequisites

- Docker and Docker Compose installed
- OR Node.js 20+ and databases (PostgreSQL, MongoDB, Redis)

## Option 1: Docker Compose (Recommended)

### Step 1: Clone and Navigate
```bash
cd backend
```

### Step 2: Configure Environment
```bash
cp .env.example .env
# Edit .env with your configuration (optional for local dev)
```

### Step 3: Start Services
```bash
npm run docker:compose:up
```

This will start:
- PostgreSQL on port 5432
- MongoDB on port 27017
- Redis on port 6379
- Backend API on port 3000

### Step 4: Verify
```bash
# Check health
curl http://localhost:3000/health

# View API documentation
open http://localhost:3000/api/docs
```

### Step 5: View Logs
```bash
npm run docker:compose:logs
```

### Stop Services
```bash
npm run docker:compose:down
```

## Option 2: Manual Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Databases

**PostgreSQL:**
```bash
# Using Docker
docker run -d --name kosha-postgres \
  -e POSTGRES_USER=kosha_user \
  -e POSTGRES_PASSWORD=kosha_password \
  -e POSTGRES_DB=kosha_db \
  -p 5432:5432 \
  postgres:15-alpine
```

**MongoDB:**
```bash
docker run -d --name kosha-mongodb \
  -p 27017:27017 \
  mongo:7
```

**Redis:**
```bash
docker run -d --name kosha-redis \
  -p 6379:6379 \
  redis:7-alpine
```

### Step 3: Configure Environment
```bash
cp .env.example .env
# Edit .env with your database credentials
```

### Step 4: Build and Start
```bash
npm run build
npm start
```

## Testing the API

### 1. Health Check
```bash
curl http://localhost:3000/health
```

### 2. Register a User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 4. View API Documentation
Open http://localhost:3000/api/docs in your browser

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -ti:3000 | xargs kill
```

### Database Connection Errors
- Check if databases are running: `docker ps`
- Verify connection strings in `.env`
- Check database logs: `docker logs kosha-postgres`

### Build Errors
```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build
```

## Next Steps

- Read [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- Check [OPENAPI_SETUP.md](./OPENAPI_SETUP.md) for API documentation
- Review the code structure in `src/`

## Need Help?

- Check logs: `npm run docker:compose:logs`
- Review environment variables in `.env`
- Verify all services are running: `docker ps`

