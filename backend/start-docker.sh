#!/bin/bash

# Script to start Docker and MongoDB for the backend

echo "🐳 Starting MongoDB via Docker..."

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running"
    echo ""
    echo "💡 Please start Docker first:"
    echo "   - On Linux: sudo systemctl start docker"
    echo "   - On macOS/Windows: Start Docker Desktop"
    echo ""
    exit 1
fi

# Remove version warning by updating docker-compose.yml
if grep -q "version:" docker-compose.yml; then
    echo "🔧 Removing deprecated version field from docker-compose.yml..."
    sed -i '/^version:/d' docker-compose.yml
fi

# Start containers
echo "🚀 Starting MongoDB containers..."
docker compose up -d

# Wait a moment for containers to start
sleep 5

# Check if containers are running
echo "📊 Container status:"
docker compose ps

# Test connection
echo ""
echo "🧪 Testing connection..."
npm run test:connection

echo ""
echo "✅ Setup complete!"
echo "   MongoDB: http://localhost:27017"
echo "   Web UI: http://localhost:8081"