#!/bin/bash

echo "🔧 WhatsApp Bot Session Fix"
echo "============================"
echo ""

# Check if bot is running
if pgrep -f "node index.js" > /dev/null; then
    echo "⚠️  Bot is currently running. Stopping it..."
    pkill -f "node index.js"
    sleep 2
    echo "✅ Bot stopped"
else
    echo "✅ Bot is not running"
fi

# Delete auth_info folder
if [ -d "auth_info" ]; then
    echo ""
    echo "🗑️  Deleting corrupted session..."
    rm -rf auth_info/
    echo "✅ Session deleted"
else
    echo ""
    echo "✅ No session folder found (already clean)"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Make sure WhatsApp Web is closed in your browser"
echo "2. Run: npm start"
echo "3. Scan the QR code with your phone"
echo "4. Test with: .ping or .alive"
echo ""
echo "✨ Ready to restart the bot!"
