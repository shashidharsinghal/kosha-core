# Starting the Backend Locally

## Current Status
✅ Node.js installed (v24.4.0)
✅ Dependencies installed
❌ Docker not found

## Option 1: Install Docker (Recommended)

Docker makes it easy to run all services (PostgreSQL, MongoDB, Redis) together.

### Quick Install for macOS:
```bash
# Using Homebrew
brew install --cask docker

# Or download from: https://www.docker.com/products/docker-desktop
```

### After Installing Docker:
1. **Open Docker Desktop** from Applications
2. **Wait for it to start** (whale icon in menu bar)
3. **Then run**:
   ```bash
   cd backend
   npm run docker:compose:up
   ```

## Option 2: Run Without Docker (Alternative)

If you have PostgreSQL, MongoDB, and Redis installed locally:

### Step 1: Install Databases Locally

**PostgreSQL:**
```bash
brew install postgresql@15
brew services start postgresql@15
createdb kosha_db
```

**MongoDB:**
```bash
brew install mongodb-community@7
brew services start mongodb-community@7
```

**Redis:**
```bash
brew install redis
brew services start redis
```

### Step 2: Update Environment
```bash
cd backend
cp .env.without-docker .env
```

### Step 3: Start Backend
```bash
npm run dev
```

## Option 3: Quick Test (Minimal Setup)

For a quick test without databases, you can start the server (it will fail on database connections, but you can see the server starting):

```bash
cd backend
npm run dev
```

This will show you if the code compiles and the server starts (though database connections will fail).

## Recommended Next Steps

1. **Install Docker Desktop** (easiest option)
   - Download: https://www.docker.com/products/docker-desktop
   - Install and start Docker Desktop
   - Then run: `npm run docker:compose:up`

2. **Or install databases manually** and use `.env.without-docker`

## What Happens When You Start

Once Docker is running and you execute `npm run docker:compose:up`:

1. ✅ PostgreSQL container starts
2. ✅ MongoDB container starts  
3. ✅ Redis container starts
4. ✅ Backend builds and starts
5. ✅ All services connect
6. ✅ API available at http://localhost:3000

## Verify Installation

After starting, test with:
```bash
curl http://localhost:3000/health
```

Expected: `{"status":"ok","timestamp":"..."}`

