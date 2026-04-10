# MongoDB Connection Debug & Solutions

## Problem Diagnosis ✅
- Docker daemon is running but requires sudo access
- Docker Desktop socket not available
- MongoDB container cannot start due to permissions

## 🚀 Solution Options

### Option 1: Fix Docker Permissions (Recommended)
```bash
# Add your user to docker group
sudo usermod -aG docker $USER

# Restart your terminal/session or run:
newgrp docker

# Test Docker access
docker ps
```

### Option 2: Use Local MongoDB (Quick Alternative)
```bash
# Install MongoDB locally
sudo apt update
sudo apt install mongodb

# Start MongoDB service
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Update your .env file
MONGO_URI=mongodb://localhost:27017/eventbooking
```

### Option 3: Use Docker with Sudo (Temporary Fix)
```bash
# Start containers with sudo
sudo docker compose up -d

# Check status
sudo docker compose ps
```

## 🧪 Test Connection

After any solution above, test with:
```bash
npm run test:connection
```

## 🔄 Current Issue
Your Docker daemon needs permission configuration. The MongoDB connection fails because the container isn't running due to Docker socket permissions.

Choose the solution that works best for your setup!