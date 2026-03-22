# Data Persistence Implementation

## Problem Solved

Previously, when you restarted the bot:

- ❌ Total messages reset to 0
- ❌ Active users reset to 0
- ❌ Command statistics lost
- ❌ Recent messages disappeared
- ❌ All analytics data gone

## Solution

Implemented file-based persistence for all dashboard data.

## What's Persisted

### 1. Analytics Data (`data/analytics.json`)

Saves every 30 seconds and on shutdown:

**Command Statistics**

- Command usage counts (e.g., "ping: 150 times")
- Command error counts
- Command response times
- Top commands ranking

**User Statistics**

- Total unique users
- Active users today
- User command counts
- User activity timestamps
- New users today

**Group Statistics**

- Active groups today
- Group message counts
- Group command counts
- Total groups

**Activity Data**

- Hourly activity (24-hour chart data)
- Daily activity (7-day chart data)
- Peak hour tracking
- Peak day tracking

**Performance Metrics**

- Total messages count
- Total commands count
- Total requests
- Total errors
- Error rate
- Response times

**Timestamps**

- Bot start time
- Last daily reset time
- Last weekly reset time
- Last save time

### 2. Bot Status (`data/bot-status.json`)

Saves on every status update:

- Phone number
- Device name
- Connection timestamp
- Status (online/offline)

### 3. Message Buffer (`data/message-buffer.json`)

Saves every 60 seconds:

- Last 1000 messages
- Sender names
- Message content
- Chat types
- Timestamps

## How It Works

### On Bot Startup

```
1. Load analytics.json → Restore all statistics
2. Load bot-status.json → Restore phone number/device
3. Load message-buffer.json → Restore recent messages
4. Check if daily reset needed (24h passed)
5. Check if weekly reset needed (7d passed)
6. Continue tracking from previous counts
```

### During Bot Operation

```
Every message → Track in memory + auto-save every 30s
Every command → Track in memory + auto-save every 30s
Every 10 messages → Save message buffer
Status change → Save immediately
```

### On Bot Shutdown

```
1. Save analytics.json
2. Save bot-status.json
3. Save message-buffer.json
4. Exit gracefully
```

## Auto-Save Intervals

| Data Type      | Save Frequency | Trigger        |
| -------------- | -------------- | -------------- |
| Analytics      | 30 seconds     | Interval       |
| Message Buffer | 60 seconds     | Interval       |
| Bot Status     | Immediate      | Status change  |
| All Data       | Immediate      | SIGINT/SIGTERM |

## Data Retention

### Permanent Data

- Total messages count
- Total commands count
- All-time user list
- All-time group list
- Command usage history

### Daily Reset (24 hours)

- Active users today
- New users today
- Active groups today
- Hourly activity chart

### Weekly Reset (7 days)

- Daily activity chart
- Peak day tracking

### Limited Storage

- Response times: Last 1000 only
- Message buffer: Last 1000 only

## File Structure

```
data/
├── analytics.json          # All analytics data
├── bot-status.json         # Bot connection info
├── message-buffer.json     # Recent messages
├── .gitignore             # Ignore data files in git
└── README.md              # Data directory info
```

## Example: Analytics Data

```json
{
  "commandUsage": {
    "ping": 150,
    "help": 89,
    "play": 67
  },
  "totalMessages": 1247,
  "totalCommands": 456,
  "activeUsers": ["1234567890", "0987654321"],
  "hourlyActivity": [12, 15, 8, 20, ...],
  "startTime": 1710000000000,
  "lastSaved": 1710001234567
}
```

## Benefits

✅ **Persistent Statistics**

- Total messages survive restarts
- Command counts accumulate over time
- User activity history preserved

✅ **Accurate Analytics**

- Long-term trends visible
- Historical data available
- No data loss on restart

✅ **Fast Recovery**

- Bot resumes from last state
- No need to rebuild statistics
- Instant dashboard data

✅ **Automatic Backups**

- Data saved every 30-60 seconds
- Graceful shutdown saves everything
- Crash recovery possible

## Testing

### Test 1: Basic Persistence

```bash
# 1. Start bot
npm start

# 2. Send 10 messages
# 3. Check dashboard - should show 10 messages

# 4. Restart bot
npm start

# 5. Check dashboard - should STILL show 10 messages ✅
```

### Test 2: Accumulation

```bash
# 1. Start bot, send 5 messages
# Dashboard shows: 5 messages

# 2. Restart bot, send 5 more messages
# Dashboard shows: 10 messages ✅ (not reset to 5)
```

### Test 3: Command Tracking

```bash
# 1. Run .ping 3 times
# Dashboard shows: ping = 3

# 2. Restart bot
# Dashboard shows: ping = 3 ✅ (not reset)

# 3. Run .ping 2 more times
# Dashboard shows: ping = 5 ✅ (accumulated)
```

### Test 4: Recent Messages

```bash
# 1. Send 20 messages
# Dashboard shows last 10 messages

# 2. Restart bot
# Dashboard shows same 10 messages ✅ (not lost)
```

## Backup & Restore

### Manual Backup

```bash
# Backup all data
cp data/analytics.json data/analytics.backup.json
cp data/bot-status.json data/bot-status.backup.json
cp data/message-buffer.json data/message-buffer.backup.json
```

### Restore from Backup

```bash
# Restore analytics
cp data/analytics.backup.json data/analytics.json

# Restart bot
npm start
```

### Reset All Data

```bash
# Delete all data files
rm data/analytics.json
rm data/bot-status.json
rm data/message-buffer.json

# Restart bot - starts fresh
npm start
```

## Error Handling

### File Read Errors

- If file doesn't exist → Start with empty data
- If file corrupted → Log error, start fresh
- If permission denied → Log error, continue in memory

### File Write Errors

- If write fails → Log error, retry next interval
- If disk full → Log error, continue in memory
- If permission denied → Log error, continue in memory

### Data Corruption

- JSON parse errors → Start fresh, log error
- Invalid data types → Use defaults, log warning
- Missing fields → Use defaults, continue

## Performance

### Memory Usage

- Analytics data: ~1-5 MB
- Message buffer: ~500 KB (1000 messages)
- Bot status: ~1 KB
- Total: ~2-6 MB

### Disk Usage

- analytics.json: ~100-500 KB
- message-buffer.json: ~200-500 KB
- bot-status.json: ~1 KB
- Total: ~300 KB - 1 MB

### Save Performance

- Save time: ~10-50ms
- No blocking operations
- Async file writes
- Minimal impact on bot

## Migration

If you have an existing bot:

1. **No action needed** - persistence is automatic
2. First run will create `data/` directory
3. Data files created on first save
4. Existing bot continues normally

## Troubleshooting

### Issue: Data not persisting

**Check:**

- `data/` directory exists
- Write permissions on `data/` folder
- No disk space errors in logs
- Files being created in `data/`

**Solution:**

```bash
# Check directory
ls -la data/

# Check permissions
chmod 755 data/

# Check disk space
df -h
```

### Issue: Data resets on restart

**Check:**

- Files exist: `ls data/*.json`
- Files not empty: `cat data/analytics.json`
- No JSON parse errors in logs

**Solution:**

```bash
# Verify file contents
cat data/analytics.json | jq .

# If corrupted, delete and restart
rm data/analytics.json
npm start
```

### Issue: Old data showing

**Check:**

- Daily reset time (24h passed?)
- Weekly reset time (7d passed?)
- Check `lastDailyReset` in analytics.json

**Solution:**

- This is normal behavior
- Daily stats reset every 24h
- Total counts never reset

## Summary

✅ All dashboard data now persists across restarts
✅ Total messages accumulate over time
✅ Command statistics preserved
✅ Recent messages saved
✅ Bot status remembered
✅ Automatic saves every 30-60 seconds
✅ Graceful shutdown saves everything
✅ Fast recovery on startup
✅ No data loss

**Your dashboard will now show accurate, persistent data that survives bot restarts!**
