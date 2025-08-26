#!/bin/bash

echo "🚀 Setting up Full Stack Application..."
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if Docker is installed
if command -v docker &> /dev/null; then
    echo "✅ Docker is installed"
    
    # Check if Docker is running
    if docker info &> /dev/null; then
        echo "✅ Docker is running"
        
        # Start PostgreSQL with Docker Compose
        echo "🐘 Starting PostgreSQL with Docker Compose..."
        docker-compose up -d postgres
        
        # Wait for PostgreSQL to be ready
        echo "⏳ Waiting for PostgreSQL to be ready..."
        sleep 10
        
        echo "✅ PostgreSQL is running on localhost:5432"
    else
        echo "❌ Docker is not running. Please start Docker and try again."
        exit 1
    fi
else
    echo "⚠️  Docker is not installed. You'll need to install PostgreSQL manually."
    echo "   Or install Docker to use the provided docker-compose.yml"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Setup database (if PostgreSQL is running)
if command -v docker &> /dev/null && docker ps | grep -q "fullstackapp-postgres"; then
    echo "🗄️  Setting up database..."
    npm run db:setup
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start the development servers: npm run dev"
echo "2. Frontend will be available at: http://localhost:3000"
echo "3. Backend will be available at: http://localhost:3001"
echo ""
echo "Happy coding! 🚀"
