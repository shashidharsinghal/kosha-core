# Installing Docker for Local Development

Docker is required to run the local development environment. Follow these steps:

## macOS Installation

### Option 1: Docker Desktop (Recommended)
1. Download Docker Desktop from: https://www.docker.com/products/docker-desktop
2. Install the `.dmg` file
3. Open Docker Desktop from Applications
4. Wait for Docker to start (whale icon in menu bar)
5. Verify installation:
   ```bash
   docker --version
   docker-compose --version
   ```

### Option 2: Homebrew
```bash
brew install --cask docker
# Then open Docker Desktop from Applications
```

## After Installation

1. **Start Docker Desktop** (if not already running)
2. **Verify Docker is running**:
   ```bash
   docker ps
   ```
   Should show an empty list (no error)

3. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

4. **Start services**:
   ```bash
   npm run docker:compose:up
   ```

## Alternative: Run Without Docker

If you prefer not to use Docker, you can:
1. Install PostgreSQL, MongoDB, and Redis locally
2. Update `.env` to use `localhost` instead of service names
3. Run `npm run dev` instead

See `SETUP_LOCAL.md` for details.

