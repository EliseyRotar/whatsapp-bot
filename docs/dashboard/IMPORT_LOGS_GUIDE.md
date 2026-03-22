# Quick Guide: Import Historical Logs

## What This Does

Imports all historical data from `bot.log` and `bot-console.log` into your dashboard analytics.

## Quick Start

```bash
# Run the import
./import-logs.sh

# Restart bot
npm start

# Check dashboard
# Open: http://localhost:3000
```

## What Gets Imported

✅ All command executions (27,493 found!)
✅ User activity (88 unique users)
✅ Command statistics
✅ Date ranges and trends
✅ Error tracking

## Results

**Before**: Dashboard shows 0 messages, 0 commands
**After**: Dashboard shows 41,000+ messages, 27,000+ commands

## Files

- `import-logs.sh` - Run this to import
- `scripts/import-historical-data.js` - The import script
- `data/analytics.json` - Where data is saved
- `data/analytics.backup.*.json` - Automatic backups

## Re-Import

Safe to run multiple times:

```bash
./import-logs.sh
```

Creates backup each time, merges data (doesn't duplicate).

## Verify

After import and bot restart:

1. Open dashboard: http://localhost:3000
2. Check "Total Messages" - should be 40,000+
3. Check "Total Commands" - should be 27,000+
4. Check "Top Commands" - should show slot, rob, shop, etc.

## Restore Backup

If something goes wrong:

```bash
# List backups
ls data/analytics.backup.*.json

# Restore latest
cp data/analytics.backup.[timestamp].json data/analytics.json

# Restart bot
npm start
```

## That's It!

Your dashboard now has complete historical data from your logs! 🎉
