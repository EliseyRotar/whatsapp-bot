#!/bin/bash

echo "🧪 Session Persistence Test"
echo "============================"
echo ""

if [ -d "auth_info" ]; then
    echo "✅ Session folder exists: auth_info/"
    echo ""
    echo "Files in session:"
    ls -lh auth_info/
    echo ""
    echo "📝 Session is saved!"
    echo "   You can restart the bot without scanning QR again."
    echo ""
    echo "To test:"
    echo "  1. Stop the bot (Ctrl+C)"
    echo "  2. Start again: npm start"
    echo "  3. Bot connects automatically (no QR!)"
    echo ""
    echo "To reset and scan QR again:"
    echo "  rm -rf auth_info/"
else
    echo "❌ No session found: auth_info/"
    echo ""
    echo "This is normal if you haven't scanned the QR code yet."
    echo ""
    echo "After scanning the QR code:"
    echo "  - Session will be saved to auth_info/"
    echo "  - You won't need to scan again"
    echo "  - Bot will auto-connect on restart"
fi
