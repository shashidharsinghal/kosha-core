# Local Setup Instructions

Follow these steps to set up the Kosha backend locally. The configuration is designed to easily switch to managed infrastructure later.

## ✅ Prerequisites

1. **Docker Desktop** installed and running
   - Download from: https://www.docker.com/products/docker-desktop
   - Verify installation: `docker --version`
   - Verify Docker Compose: `docker-compose --version` or `docker compose version`

2. **Node.js 20+** (for local development without Docker)
   - Download from: https://nodejs.org/
   - Verify: `node --version`

## 🚀 Quick Start (3 Steps)

### Step 1: Set Up Environment
```bash
cd backend

# Copy local environment file
cp .env.local .env

# The .env file is already configured for local Docker Compose
```

### Step 2: Start All Services
```bash
# Start PostgreSQL, MongoDB, Redis, and Backend
npm run docker:compose:up

# Or using docker-compose directly
docker-compose up -d
```

### Step 3: Verify It's Working
```bash
# Check health endpoint
curl http://localhost:3000/health

# Or open in browser
open http://localhost:3000/health
```

You should see: `{"status":"ok","timestamp":"..."}`

## 📊 What's Running

After starting, you'll have:

| Service | Port | Access |
|---------|------|--------|
| **Backend API** | 3000 | http://localhost:3000 |
| **API Docs** | 3000 | http://localhost:3000/api/docs |
| **PostgreSQL** | 5432 | localhost:5432 |
| **MongoDB** | 27017 | localhost:27017 |
| **Redis** | 6379 | localhost:6379 |

## 🧪 Test the Setup

### 1. Health Check
```bash
curl http://localhost:3000/health
```

### 2. View API Documentation
Open http://localhost:3000/api/docs in your browser

### 3. Register a Test User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### 4. Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🔧 Useful Commands

### View Logs
```bash
# Backend logs only
npm run docker:compose:logs

# All services
docker-compose logs -f

# Specific service
docker-compose logs -f postgres
```

### Stop Services
```bash
npm run docker:compose:down
# or
docker-compose down
```

### Restart Services
```bash
docker-compose restart
```

### Rebuild After Code Changes
```bash
docker-compose up -d --build
```

### Check Service Status
```bash
docker-compose ps
```

## 🔄 Switching to Managed Infrastructure Later

When you're ready to deploy to managed infrastructure (Railway, AWS, etc.), you'll only need to update environment variables:

### Current (Local Docker)
```env
POSTGRES_HOST=postgres
MONGODB_URI=mongodb://mongodb:27017/kosha
REDIS_HOST=redis
```

### Future (Managed Services)
```env
POSTGRES_URL=postgresql://user:pass@managed-db.com:5432/db
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/kosha
REDIS_URL=rediss://managed-redis.com:6380
```

**No code changes needed!** The application already supports both connection methods.

## 🐛 Troubleshooting

### Docker Not Running
```bash
# Start Docker Desktop, then verify
docker ps
```

### Port Already in Use
```bash
# Find what's using port 3000
lsof -ti:3000

# Kill the process
lsof -ti:3000 | xargs kill -9
```

### Services Won't Start
```bash
# Check logs
docker-compose logs

# Reset everything
docker-compose down -v
docker-compose up -d
```

### Database Connection Errors
```bash
# Check if databases are running
docker-compose ps

# Check database logs
docker-compose logs postgres
docker-compose logs mongodb
```

### Can't Connect to Backend
```bash
# Check backend logs
docker-compose logs backend

# Verify backend is running
docker-compose ps backend
```

## 📝 Next Steps

1. ✅ Services are running locally
2. ✅ Test the API endpoints
3. ✅ Explore API documentation
4. 📖 Read [LOCAL_SETUP.md](./LOCAL_SETUP.md) for detailed local development guide
5. 📖 Read [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment when ready

## 💡 Tips

- **Keep `.env` local** - Never commit it to git (it's in .gitignore)
- **Use `.env.local` as template** - Copy it when setting up new environments
- **Check logs regularly** - `docker-compose logs -f` shows real-time logs
- **Database data persists** - Data is stored in Docker volumes, so it survives container restarts

## 🆘 Need Help?

- Check service status: `docker-compose ps`
- View logs: `docker-compose logs -f`
- Verify environment: Check `.env` file
- Review [LOCAL_SETUP.md](./LOCAL_SETUP.md) for more details

