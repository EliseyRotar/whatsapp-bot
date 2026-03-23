#!/bin/bash

echo "🤖 WhatsApp Bot Starter"
echo "======================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Install it with: sudo pacman -S nodejs npm"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --omit=optional
fi

# Create data directory if it doesn't exist
mkdir -p data

echo ""
echo "✅ Starting bot..."
echo "📱 Scan the QR code with WhatsApp: +393313444410"
echo ""

node index.js
