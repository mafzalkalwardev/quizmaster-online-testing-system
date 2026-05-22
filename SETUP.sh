#!/bin/bash

# QuizMaster Quick Start Script
# This script helps you set up and run QuizMaster

echo "╔═══════════════════════════════════════════════════════╗"
echo "║          QUIZMASTER - QUICK START SETUP               ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo "✓ npm version: $(npm --version)"
echo ""

# Check if MongoDB is running
echo "Checking MongoDB connection..."
if ! nc -z 127.0.0.1 27017 2>/dev/null; then
    echo "⚠️  MongoDB is not running on port 27017"
    echo "    Please start MongoDB and try again"
    exit 1
fi

echo "✓ MongoDB is running on port 27017"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✓ Dependencies installed successfully"
echo ""

# Run the application
echo "🚀 Starting QuizMaster..."
echo ""

npm run dev
