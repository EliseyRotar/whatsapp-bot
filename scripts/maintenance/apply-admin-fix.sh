#!/bin/bash

echo "🔧 Applying Admin Detection Fix"
echo "================================"
echo ""

# Check if bot is running
if pm2 list | grep -q "eli6"; then
    echo "✅ Bot is running with PM2"
    echo "📋 Restarting bot to apply fix..."
    pm2 restart eli6
    echo ""
    echo "⏳ Waiting for bot to restart..."
    sleep 3
    echo ""
    echo "📊 Bot status:"
    pm2 status eli6
    echo ""
    echo "📝 Recent logs:"
    pm2 logs eli6 --lines 20 --nostream
else
    echo "⚠️  Bot is not running with PM2"
    echo "💡 Start the bot manually with: npm start"
fi

echo ""
echo "================================"
echo "✅ Fix applied!"
echo ""
echo "🧪 Test the fix by running in your WhatsApp group:"
echo "   .setgname Test Name"
echo ""
echo "📋 To view live logs:"
echo "   pm2 logs eli6"
echo ""
echo "🔍 Look for [BOT-ADMIN] messages in the logs"
echo ""
