# Complete Docker Installation

The Docker installation requires your password. Please follow these steps:

## Step 1: Install Docker

Open your terminal and run:

```bash
brew install --cask docker
```

You'll be prompted for your password. Enter it to complete the installation.

## Step 2: Start Docker Desktop

1. Open **Docker Desktop** from Applications (or Spotlight search)
2. Wait for Docker to start - you'll see a whale icon in your menu bar
3. The first time may take a minute or two to initialize

## Step 3: Verify Installation

Once Docker Desktop is running, verify in terminal:

```bash
docker --version
docker compose version
```

You should see version numbers (not "command not found").

## Step 4: Start the Backend Services

Navigate to the backend directory and start services:

```bash
cd backend
npm run docker:compose:up
```

This will:
- Download PostgreSQL, MongoDB, and Redis images (first time only)
- Start all database containers
- Build and start the backend API
- Take 2-5 minutes the first time

## Step 5: Verify Everything is Running

```bash
# Check health endpoint
curl http://localhost:3000/health

# Or open in browser
open http://localhost:3000/health
```

Expected response: `{"status":"ok","timestamp":"..."}`

## View API Documentation

```bash
open http://localhost:3000/api/docs
```

## Troubleshooting

### Docker Desktop won't start
- Make sure you have enough disk space (at least 4GB free)
- Check System Preferences > Security & Privacy
- Restart your Mac if needed

### Command still not found after installation
- Make sure Docker Desktop is **running** (whale icon in menu bar)
- Close and reopen your terminal
- Try: `which docker` to verify it's in PATH

### Services won't start
- Check Docker Desktop is running
- Check logs: `npm run docker:compose:logs`
- Verify: `docker compose ps`

## Next Steps After Installation

Once Docker is installed and running:

1. ✅ Start services: `npm run docker:compose:up`
2. ✅ Test health: `curl http://localhost:3000/health`
3. ✅ View API docs: `open http://localhost:3000/api/docs`
4. ✅ Start developing!

