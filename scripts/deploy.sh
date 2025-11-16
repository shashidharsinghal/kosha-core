#!/bin/bash

# Kosha Backend Deployment Script
# This script helps deploy the backend application

set -e

echo "🚀 Kosha Backend Deployment Script"
echo "=================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Function to build Docker image
build_image() {
    echo "📦 Building Docker image..."
    docker build -t kosha-backend:latest .
    echo "✅ Docker image built successfully"
}

# Function to start with Docker Compose
start_compose() {
    echo "🐳 Starting services with Docker Compose..."
    
    # Check if .env file exists
    if [ ! -f .env ]; then
        echo "⚠️  .env file not found. Creating from .env.example..."
        if [ -f .env.example ]; then
            cp .env.example .env
            echo "✅ Created .env file. Please update it with your configuration."
        else
            echo "❌ .env.example not found. Please create .env file manually."
            exit 1
        fi
    fi
    
    docker-compose up -d
    echo "✅ Services started"
    echo "📊 View logs with: docker-compose logs -f backend"
}

# Function to stop services
stop_compose() {
    echo "🛑 Stopping services..."
    docker-compose down
    echo "✅ Services stopped"
}

# Function to view logs
view_logs() {
    docker-compose logs -f backend
}

# Function to check health
check_health() {
    echo "🏥 Checking application health..."
    sleep 5
    curl -f http://localhost:3000/health || echo "❌ Health check failed"
}

# Main menu
case "${1:-}" in
    build)
        build_image
        ;;
    start)
        start_compose
        check_health
        ;;
    stop)
        stop_compose
        ;;
    restart)
        stop_compose
        start_compose
        check_health
        ;;
    logs)
        view_logs
        ;;
    health)
        check_health
        ;;
    *)
        echo "Usage: $0 {build|start|stop|restart|logs|health}"
        echo ""
        echo "Commands:"
        echo "  build   - Build Docker image"
        echo "  start   - Start all services with Docker Compose"
        echo "  stop    - Stop all services"
        echo "  restart - Restart all services"
        echo "  logs    - View backend logs"
        echo "  health  - Check application health"
        exit 1
        ;;
esac

