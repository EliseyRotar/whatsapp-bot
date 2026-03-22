# Dashboard Quick Reference

## Current Stats

```
📊 Total Messages: 41,321
⚡ Total Commands: 27,564
👥 Active Users: 92
🏆 Top Command: slot (20,861 times)
```

## Quick Commands

```bash
# Start bot
npm start

# Import historical logs
./import-logs.sh

# View analytics
cat data/analytics.json

# Backup data
cp data/analytics.json backup.json

# Restore backup
cp backup.json data/analytics.json
```

## Dashboard URL

```
http://localhost:3000
```

Login: `admin` / (your WEB_PASSWORD from .env)

## What's Fixed

✅ Real data (not zeros)
✅ Data persists across restarts
✅ Real trend percentages
✅ Historical data imported (41K+ messages)
✅ Auto-save every 30-60 seconds
✅ Real-time updates

## Files

- `data/analytics.json` - All statistics
- `data/bot-status.json` - Bot info
- `data/message-buffer.json` - Recent messages
- `data/analytics.backup.*.json` - Backups

## Auto-Save

- Analytics: Every 30 seconds
- Messages: Every 60 seconds
- On shutdown: Everything

## Troubleshooting

**Dashboard shows 0**: Restart bot
**Trends random**: Wait 24h for daily reset
**Data not saving**: Check `data/` permissions

## That's It!

Your dashboard is fully functional with real, persistent data! 🎉
