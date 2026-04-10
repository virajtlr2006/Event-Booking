#!/bin/bash

echo "🔧 MongoDB Connection Troubleshooter"
echo "=================================="

# Function to test MongoDB connection
test_connection() {
    echo "🧪 Testing MongoDB connection..."
    cd "/home/viraj-tailor/Desktop/Freelancing/Event Booking/backend"
    timeout 10s npm run test:connection 2>&1
    return $?
}

# Solution 1: Try Docker with current user
echo ""
echo "📋 Solution 1: Testing Docker access..."
if docker ps >/dev/null 2>&1; then
    echo "✅ Docker accessible! Starting MongoDB..."
    cd "/home/viraj-tailor/Desktop/Freelancing/Event Booking/backend"
    docker compose up -d
    sleep 5
    if test_connection; then
        echo "🎉 SUCCESS: Docker MongoDB is working!"
        exit 0
    fi
else
    echo "❌ Docker not accessible with current user"
fi

# Solution 2: Try Docker with sudo
echo ""
echo "📋 Solution 2: Trying Docker with sudo..."
cd "/home/viraj-tailor/Desktop/Freelancing/Event Booking/backend"
if sudo docker compose up -d 2>/dev/null; then
    echo "✅ Docker containers started with sudo"
    sleep 5
    if test_connection; then
        echo "🎉 SUCCESS: Docker MongoDB working with sudo!"
        echo ""
        echo "💡 To fix permissions permanently:"
        echo "   sudo usermod -aG docker $USER"
        echo "   Then logout and login again"
        exit 0
    fi
else
    echo "❌ Docker with sudo failed"
fi

# Solution 3: Install local MongoDB
echo ""
echo "📋 Solution 3: Installing local MongoDB..."
echo "This will install MongoDB locally on your system."
read -p "Do you want to install MongoDB locally? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    sudo apt update
    sudo apt install -y mongodb
    sudo systemctl start mongodb
    sudo systemctl enable mongodb

    # Update .env to use local MongoDB
    cp .env.local .env
    echo "✅ Updated .env for local MongoDB"

    sleep 2
    if test_connection; then
        echo "🎉 SUCCESS: Local MongoDB is working!"
        exit 0
    fi
else
    echo "❌ Local MongoDB installation skipped"
fi

echo ""
echo "🆘 All solutions failed. Please check:"
echo "   1. Docker installation and permissions"
echo "   2. Network connectivity"
echo "   3. Port 27017 availability"
echo ""
echo "Manual solutions in DEBUG_CONNECTION.md"