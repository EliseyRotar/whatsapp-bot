 #!/bin/bash

echo "🔄 Restarting WhatsApp Bot..."
echo ""

# Find and kill the bot process
BOT_PID=$(ps aux | grep "node index.js" | grep -v grep | awk '{print $2}')

if [ -n "$BOT_PID" ]; then
    echo "📍 Found bot process: PID $BOT_PID"
    echo "🛑 Stopping bot..."
    kill $BOT_PID
    sleep 2
    
    # Check if still running
    if ps -p $BOT_PID > /dev/null 2>&1; then
        echo "⚠️  Process still running, forcing kill..."
        kill -9 $BOT_PID
        sleep 1
    fi
    
    echo "✅ Bot stopped"
else
    echo "⚠️  Bot is not running"
fi

echo ""
echo "🚀 Starting bot in background..."
nohup node index.js > bot-console.log 2>&1 &
NEW_PID=$!

sleep 3

if ps -p $NEW_PID > /dev/null 2>&1; then
    echo "✅ Bot started successfully!"
    echo "📍 New PID: $NEW_PID"
    echo ""
    echo "📋 To view logs:"
    echo "   tail -f bot-console.log"
    echo "   tail -f logs/bot-2026-03-11.log"
    echo ""
    echo "🔍 To see [BOT-ADMIN] debug messages:"
    echo "   tail -f bot-console.log | grep BOT-ADMIN"
else
    echo "❌ Failed to start bot"
    echo "Check bot-console.log for errors"
fi
