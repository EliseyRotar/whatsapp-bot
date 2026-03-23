#!/bin/bash

echo "🧪 Testing bot setup..."
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found"
    exit 1
fi
echo "✅ Node.js: $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found"
    exit 1
fi
echo "✅ npm: $(npm --version)"

# Check node_modules
if [ ! -d "node_modules" ]; then
    echo "❌ node_modules not found - run 'npm install --omit=optional'"
    exit 1
fi
echo "✅ Dependencies installed"

# Check required files
if [ ! -f "index.js" ]; then
    echo "❌ index.js not found"
    exit 1
fi
echo "✅ index.js found"

if [ ! -f "config.js" ]; then
    echo "❌ config.js not found"
    exit 1
fi
echo "✅ config.js found"

# Create data directory
mkdir -p data
echo "✅ data directory ready"

echo ""
echo "🎉 All checks passed!"
echo ""
echo "To start the bot, run:"
echo "  npm start"
echo ""
echo "Or use the start script:"
echo "  ./start.sh"
