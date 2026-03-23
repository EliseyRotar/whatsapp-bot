#!/bin/bash

echo "╔════════════════════════════════════════╗"
echo "║  WhatsApp Bot Web Monitor Installer   ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    echo "Please install Node.js and npm first."
    exit 1
fi

echo "✅ npm found"
echo ""

# Install dependencies
echo "📦 Installing web dependencies..."
npm install express socket.io

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "╔════════════════════════════════════════╗"
echo "║         Installation Complete!         ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "🚀 To start the bot with monitoring:"
echo "   npm start"
echo ""
echo "🌐 Then open your browser to:"
echo "   http://localhost:3000"
echo ""
echo "📚 For more info, see:"
echo "   WEB_MONITOR_SETUP.md"
echo ""
