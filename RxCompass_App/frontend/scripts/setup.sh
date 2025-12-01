#!/bin/bash

# RxCompass.AI Frontend Setup Script
# This script sets up the project for any developer who clones the repo

echo "🚀 Setting up RxCompass.AI Frontend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    echo "📥 Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if ! node -e "process.exit(require('semver').gte('$NODE_VERSION', '$REQUIRED_VERSION') ? 0 : 1)" 2>/dev/null; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please install v18 or higher."
    exit 1
fi

echo "✅ Node.js version $NODE_VERSION detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env
    echo "⚠️  Please edit .env file and set your VITE_API_URL"
else
    echo "✅ Environment file already exists"
fi

# Check if backend is running (optional)
echo "🔍 Checking backend connectivity..."
if command -v curl &> /dev/null; then
    if curl -s http://localhost:5000 > /dev/null 2>&1; then
        echo "✅ Backend is running on localhost:5000"
    else
        echo "⚠️  Backend is not running on localhost:5000"
        echo "💡 Make sure to start your backend server before running the app"
    fi
else
    echo "ℹ️  curl not available, skipping backend check"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file and set your VITE_API_URL"
echo "2. Start your backend server"
echo "3. Run: npm run dev"
echo "4. Open: http://localhost:8080"
echo ""
echo "📚 For more info, check README.md"
