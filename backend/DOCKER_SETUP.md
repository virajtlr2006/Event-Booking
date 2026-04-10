# Docker MongoDB Setup

## Prerequisites

Make sure Docker is installed and running on your system.

### Starting Docker (if not running)

**Linux (systemctl):**
```bash
sudo systemctl start docker
sudo systemctl enable docker
```

**Docker Desktop:**
- Open Docker Desktop application
- Wait for it to start completely

**Check if Docker is running:**
```bash
docker ps
```

## Quick Start

1. **Start MongoDB with Docker Compose:**
   ```bash
   docker compose up -d
   ```

2. **Check if containers are running:**
   ```bash
   docker compose ps
   ```

3. **View logs:**
   ```bash
   docker compose logs mongodb
   ```

4. **Stop services:**
   ```bash
   docker compose down
   ```

## Services Included

### MongoDB
- **Port:** 27017
- **Database:** eventbooking
- **Admin User:** admin / password123
- **App User:** eventuser / eventpassword
- **Connection String:** `mongodb://eventuser:eventpassword@localhost:27017/eventbooking?authSource=eventbooking`

### MongoDB Express (Web UI)
- **URL:** http://localhost:8081
- **Use this to browse your database through a web interface**

## Testing Connection

### Option 1: Start the Node.js server
```bash
npm run dev
```
Check the console for "🍃 MongoDB Connected" message.

### Option 2: Test with MongoDB shell
```bash
# Connect to MongoDB container
docker exec -it eventbooking-mongodb mongosh

# In MongoDB shell:
use eventbooking
db.auth("eventuser", "eventpassword")
db.events.insertOne({name: "Test Event", date: new Date()})
db.events.find()
```

## Troubleshooting

### Docker daemon not running
```bash
# Linux
sudo systemctl start docker

# Or start Docker Desktop app
```

### Port already in use
```bash
# Check what's using port 27017
sudo netstat -tlnp | grep :27017

# Stop conflicting services
sudo service mongod stop
```

### Reset everything
```bash
# Stop and remove containers and volumes
docker compose down -v
docker compose up -d
```