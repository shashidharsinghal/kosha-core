# Local Development Setup Guide

This guide helps you set up the Kosha backend locally using Docker Compose. The configuration is designed to easily switch to managed infrastructure later.

## 🎯 Quick Start

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Set Up Environment File
```bash
# Copy the local environment template
cp .env.local .env

# Or use the example and customize
cp .env.example .env
```

### Step 3: Start All Services
```bash
npm run docker:compose:up
```

This will start:
- ✅ PostgreSQL database
- ✅ MongoDB database  
- ✅ Redis cache
- ✅ Backend API server

### Step 4: Verify Everything is Running
```bash
# Check health endpoint
curl http://localhost:3000/health

# Or open in browser
open http://localhost:3000/health
```

### Step 5: View API Documentation
```bash
open http://localhost:3000/api/docs
```

## 📋 What Gets Started

| Service | Port | Purpose |
|---------|------|---------|
| PostgreSQL | 5432 | Users, sessions, investments, payments |
| MongoDB | 27017 | Bills, expenses, income, notifications |
| Redis | 6379 | Caching and session storage |
| Backend API | 3000 | Main application |

## 🔧 Common Commands

### Start Services
```bash
npm run docker:compose:up
# or
docker-compose up -d
```

### Stop Services
```bash
npm run docker:compose:down
# or
docker-compose down
```

### View Logs
```bash
npm run docker:compose:logs
# or
docker-compose logs -f backend
```

### View All Service Logs
```bash
docker-compose logs -f
```

### Restart Services
```bash
docker-compose restart
```

### Rebuild After Code Changes
```bash
docker-compose up -d --build
```

## 🗄️ Database Access

### PostgreSQL
```bash
# Connect to PostgreSQL
docker exec -it kosha-postgres psql -U kosha_user -d kosha_db

# Or from host machine (if you have psql installed)
psql -h localhost -p 5432 -U kosha_user -d kosha_db
```

### MongoDB
```bash
# Connect to MongoDB
docker exec -it kosha-mongodb mongosh kosha

# Or from host machine (if you have mongosh installed)
mongosh mongodb://localhost:27017/kosha
```

### Redis
```bash
# Connect to Redis
docker exec -it kosha-redis redis-cli

# Or from host machine (if you have redis-cli installed)
redis-cli -h localhost -p 6379
```

## 🧪 Testing the API

### 1. Health Check
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{"status":"ok","timestamp":"2024-..."}
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

Save the `token` from the response for authenticated requests.

### 4. Test Authenticated Endpoint
```bash
curl -X GET http://localhost:3000/api/v1/bills \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔄 Switching to Managed Infrastructure Later

When you're ready to switch to managed infrastructure (Railway, AWS, etc.):

### Option 1: Environment Variables
Simply update your environment variables to point to managed services:

```bash
# Instead of local Docker services
POSTGRES_HOST=postgres  # Local
POSTGRES_URL=postgresql://user:pass@managed-db.com:5432/db  # Managed

MONGODB_URI=mongodb://mongodb:27017/kosha  # Local
MONGODB_URI=mongodb+srv://user:pass@managed-cluster.mongodb.net/kosha  # Managed

REDIS_HOST=redis  # Local
REDIS_URL=rediss://managed-redis.com:6380  # Managed
```

### Option 2: Separate Environment Files
Create environment-specific files:
- `.env.local` - For local Docker Compose
- `.env.production` - For managed infrastructure
- `.env.staging` - For staging environment

### Option 3: Platform-Specific Configuration
Most platforms (Railway, Render, etc.) allow you to set environment variables through their dashboard. Just update the connection strings.

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find what's using port 3000
lsof -ti:3000

# Kill the process
lsof -ti:3000 | xargs kill
```

### Database Connection Errors
```bash
# Check if containers are running
docker ps

# Check database logs
docker-compose logs postgres
docker-compose logs mongodb
docker-compose logs redis
```

### Reset Everything
```bash
# Stop and remove all containers and volumes
docker-compose down -v

# Start fresh
docker-compose up -d
```

### View Container Status
```bash
docker-compose ps
```

### Access Container Shell
```bash
# Backend container
docker exec -it kosha-backend sh

# PostgreSQL container
docker exec -it kosha-postgres sh
```

## 📊 Monitoring

### Check Resource Usage
```bash
docker stats
```

### View Service Health
```bash
# All services
docker-compose ps

# Individual service
docker-compose ps backend
```

## 🔐 Security Notes for Local Development

- The `.env.local` file uses default passwords - **NEVER commit this to git**
- JWT secrets are weak for local dev - **use strong secrets in production**
- CORS is open for localhost - **restrict in production**
- Database connections are not encrypted locally - **use SSL in production**

## 📝 Next Steps

1. ✅ Services are running
2. ✅ Test the health endpoint
3. ✅ Explore API documentation at `/api/docs`
4. ✅ Test authentication endpoints
5. 📖 Read [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
6. 📖 Read [QUICK_START.md](./QUICK_START.md) for more details

## 🆘 Need Help?

- Check logs: `npm run docker:compose:logs`
- Review environment variables in `.env`
- Verify all containers are running: `docker ps`
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup

