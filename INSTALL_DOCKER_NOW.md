# Install Docker Now - Quick Guide

## The Issue
Docker is not installed on your system. You need to install it first.

## Quick Install (macOS)

### Method 1: Download Docker Desktop (Easiest)
1. Go to: https://www.docker.com/products/docker-desktop
2. Click "Download for Mac"
3. Choose the right version (Apple Silicon or Intel)
4. Open the downloaded `.dmg` file
5. Drag Docker to Applications
6. Open Docker Desktop from Applications
7. Wait for Docker to start (whale icon in menu bar)

### Method 2: Using Homebrew
```bash
brew install --cask docker
```
Then open Docker Desktop from Applications.

## Verify Installation

After Docker Desktop is running, verify in terminal:

```bash
docker --version
# Should show: Docker version 24.x.x or similar

docker compose version
# Should show: Docker Compose version v2.x.x or similar
```

## After Docker is Running

Once Docker Desktop is started, you can run:

```bash
cd backend
npm run docker:compose:up
```

## What Docker Desktop Does

- Provides Docker engine
- Includes Docker Compose (as `docker compose` command)
- Manages containers and images
- Provides a GUI to monitor containers

## Troubleshooting

### Docker Desktop won't start
- Make sure you have enough disk space (at least 4GB free)
- Check System Preferences > Security & Privacy for any blocking
- Restart your Mac if needed

### Command still not found after installation
- Make sure Docker Desktop is **running** (check menu bar for whale icon)
- Close and reopen your terminal
- Check if Docker is in PATH: `which docker`

### Still having issues?
- Check Docker Desktop logs: Docker Desktop > Troubleshoot
- Visit: https://docs.docker.com/desktop/troubleshoot/

