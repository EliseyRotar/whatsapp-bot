# Dashboard Debugging - Enhanced Error Handling

## Changes Made

### 1. Enhanced Frontend Error Handling

**File**: `web/public/js/pages/dashboard.js`

Added detailed error logging and UI feedback:

- Console logs for each step of metrics loading
- HTTP status code logging
- Error response text logging
- Visual error display in dashboard
- Retry button for failed requests

### 2. Enhanced Auth Error Handling

**File**: `web/public/js/auth.js`

Added authentication debugging:

- Token presence checking
- Request URL logging
- Better 401/403 handling
- Automatic redirect on auth failure
- Detailed error messages

### 3. Enhanced Backend Error Handling

**File**: `web/server.js`

Added server-side debugging:

- Request logging
- Analytics data validation
- Detailed error responses with stack traces
- Step-by-step operation logging

## How to Debug

### 1. Open Browser Console

Press F12 and go to Console tab. You'll now see:

```
[AUTH] Fetching: /api/analytics/metrics?period=24h
[AUTH] Token: Present
[METRICS] Loading metrics...
[METRICS] Response status: 200
[METRICS] Data received: {...}
```

### 2. Check Server Logs

In your terminal where bot is running:

```
[API] Analytics metrics requested
[API] Analytics stats: { totalMessages: 41321, ... }
[API] Calculated trends: { messagesTrend: 0, ... }
[API] Sending response: {...}
```

### 3. Common Issues & Solutions

#### Issue: "NetworkError when attempting to fetch"

**Cause**: Bot/web server not running or crashed

**Solution**:

```bash
# Check if bot is running
ps aux | grep node

# Restart bot
npm start
```

#### Issue: "No authentication token"

**Cause**: Not logged in or token expired

**Solution**:

- Refresh page and login again
- Clear browser cache: Ctrl+Shift+Delete
- Check localStorage in browser console:
  ```javascript
  localStorage.getItem("auth_token");
  ```

#### Issue: "HTTP 401: Unauthorized"

**Cause**: Invalid or expired token

**Solution**:

- Logout and login again
- Check JWT_SECRET in .env matches server
- Token expires after 24h by default

#### Issue: "HTTP 500: Internal Server Error"

**Cause**: Server-side error in analytics

**Solution**:

- Check server logs for error details
- Verify analytics.json file exists and is valid:
  ```bash
  cat data/analytics.json | jq .
  ```
- Check file permissions:
  ```bash
  ls -la data/
  ```

#### Issue: Metrics show 0 but data exists

**Cause**: Analytics not loaded or corrupted

**Solution**:

```bash
# Verify analytics file
cat data/analytics.json | grep totalMessages

# Re-import if needed
./import-logs.sh

# Restart bot
npm start
```

## Debug Checklist

### Frontend (Browser Console)

- [ ] Check for `[AUTH] Token: Present`
- [ ] Check for `[METRICS] Response status: 200`
- [ ] Check for `[METRICS] Data received`
- [ ] No red errors in console
- [ ] WebSocket shows `[WS] Connected`

### Backend (Terminal)

- [ ] Bot shows "Bot connected successfully!"
- [ ] Web server shows "Dashboard running on http://localhost:3000"
- [ ] No error messages in terminal
- [ ] Analytics file exists: `ls data/analytics.json`
- [ ] Analytics file valid: `cat data/analytics.json | jq .`

### Dashboard UI

- [ ] Bot status shows "Online"
- [ ] Phone number displayed
- [ ] Metrics show numbers > 0
- [ ] Charts display data
- [ ] Recent messages show real names
- [ ] No error messages in UI

## Testing Commands

### Test API Directly

```bash
# Get auth token first (login via browser)
TOKEN="your-token-here"

# Test analytics endpoint
curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:3000/api/analytics/metrics

# Test bot status
curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:3000/api/bot/status

# Test recent messages
curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:3000/api/messages/recent
```

### Check Analytics Data

```bash
# View analytics file
cat data/analytics.json | jq .

# Check totals
cat data/analytics.json | jq '.totalMessages, .totalCommands'

# Check yesterday data
cat data/analytics.json | jq '.yesterday'

# Check command usage
cat data/analytics.json | jq '.commandUsage | to_entries | sort_by(.value) | reverse | .[0:5]'
```

### Verify Files

```bash
# Check all data files exist
ls -lh data/*.json

# Check file sizes
du -h data/analytics.json
du -h data/message-buffer.json
du -h data/bot-status.json

# Check file permissions
ls -la data/
```

## Error Messages Explained

### "Analytics data not available"

- Analytics module not initialized
- Restart bot to reload analytics

### "Invalid token"

- Token malformed or expired
- Logout and login again

### "Failed to load metrics"

- Network error or server down
- Check bot is running
- Check browser can reach localhost:3000

### "Unauthorized"

- Not logged in
- Token expired (24h)
- Login again

## Monitoring

### Watch Server Logs

```bash
# Follow bot logs in real-time
tail -f bot-console.log

# Watch for errors
tail -f bot-console.log | grep -i error

# Watch API requests
tail -f bot-console.log | grep "\[API\]"
```

### Watch Analytics Updates

```bash
# Watch analytics file for changes
watch -n 5 'cat data/analytics.json | jq ".totalMessages, .totalCommands"'

# Monitor file size
watch -n 5 'ls -lh data/analytics.json'
```

### Browser DevTools

1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "Fetch/XHR"
4. Watch API requests
5. Click on request to see details

## Quick Fixes

### Reset Everything

```bash
# Stop bot
# Ctrl+C

# Clear data (backup first!)
cp data/analytics.json data/analytics.backup.manual.json
rm data/analytics.json
rm data/bot-status.json
rm data/message-buffer.json

# Re-import logs
./import-logs.sh

# Restart bot
npm start

# Clear browser cache and reload
# Ctrl+Shift+Delete -> Clear cache
# F5 to reload
```

### Fix Permissions

```bash
# Fix data directory
chmod 755 data/
chmod 644 data/*.json

# Fix scripts
chmod +x import-logs.sh
chmod +x scripts/import-historical-data.js
```

### Verify Installation

```bash
# Check Node.js
node --version  # Should be v14+

# Check npm packages
npm list express socket.io jsonwebtoken

# Check files exist
ls web/server.js
ls web/public/index.html
ls utils/monitoring/analytics.js
```

## Success Indicators

When everything is working:

### Browser Console

```
[AUTH] Fetching: /api/analytics/metrics?period=24h
[AUTH] Token: Present
[METRICS] Loading metrics...
[METRICS] Response status: 200
[METRICS] Data received: {totalMessages: 41321, ...}
[WS] Connected
[WS] Bot status update: {status: "online", ...}
```

### Server Logs

```
[WEB] Dashboard running on http://localhost:3000
[WEB] Client connected: abc123
[API] Analytics metrics requested
[API] Sending response: {...}
✅ Bot connected successfully!
```

### Dashboard UI

```
Bot Status: Online ✅
Phone: 393313444410
Total Messages: 41,321
Active Users: 92
Commands Run: 27,564
Charts: Showing data
Recent Messages: Real names and content
```

## Still Having Issues?

1. **Check this file first**: `data/analytics.json`
   - Does it exist?
   - Is it valid JSON?
   - Does it have data?

2. **Check bot is running**:

   ```bash
   ps aux | grep node
   curl http://localhost:3000
   ```

3. **Check browser console**:
   - Any red errors?
   - What's the last log message?
   - Is token present?

4. **Check server logs**:
   - Any error messages?
   - Is API being called?
   - What's the response?

5. **Try clean restart**:
   ```bash
   # Stop bot
   # Clear browser cache
   # Restart bot
   npm start
   # Reload dashboard
   ```

## Summary

✅ Enhanced error logging throughout the stack
✅ Detailed console messages for debugging
✅ Visual error feedback in UI
✅ Server-side validation and logging
✅ Better error messages
✅ Retry mechanisms
✅ Comprehensive debugging guide

**Your dashboard now has full debugging capabilities!**
