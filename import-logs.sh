#!/bin/bash

# Import Historical Data Script
# This script imports data from bot.log and bot-console.log into the analytics system

echo "🚀 Starting historical data import..."
echo ""

# Check if log files exist
if [ ! -f "bot.log" ] && [ ! -f "bot-console.log" ]; then
    echo "❌ Error: No log files found!"
    echo "   Looking for: bot.log or bot-console.log"
    exit 1
fi

# Run the import script
node scripts/import-historical-data.js

echo ""
echo "✅ Done!"
