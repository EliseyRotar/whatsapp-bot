# Dashboard Testing Guide

## Quick Test Steps

### 1. Start the Bot

```bash
npm start
```

Wait for the bot to connect. You should see:

```
✅ Bot connected successfully!
📱 Phone: [your-phone-number]
📲 Device: WhatsApp
```

### 2. Open Dashboard

Open your browser and go to:

```
http://localhost:3000
```

### 3. Login

- Username: `admin`
- Password: (from your `.env` file - `WEB_PASSWORD`)

### 4. Check Bot Status Card

Should show:

- ✅ Status: **Online** (green badge)
- 📱 Phone Number: Your actual WhatsApp number
- 📲 Device: WhatsApp or your device name
- 🕐 Connected Since: Current date/time
- ⏱️ Uptime: Counting up (e.g., "5m 23s")

### 5. Test Real-Time Updates

#### Test 1: Send a Message

1. Send a message to the bot in WhatsApp (any message)
2. Watch the dashboard - you should see:
   - "Total Messages" count increase
   - Message appear in "Recent Messages" table
   - "Activity Overview" chart update

#### Test 2: Run a Command

1. Send a command to the bot (e.g., `.ping` or `.help`)
2. Watch the dashboard - you should see:
   - "Commands Run" count increase
   - Command appear in "Top Commands" chart
   - "Recent Messages" table update

#### Test 3: Multiple Messages

1. Send 5-10 messages quickly
2. Watch metrics update in real-time
3. Check "Activity Overview" shows activity in current hour

### 6. Verify All Metrics

#### Total Messages

- Should show actual count (not 0)
- Increases with each message
- Trend percentage may vary

#### Active Users

- Should show count of unique users who sent messages
- Increases when new users message the bot

#### Active Groups

- Should show count of groups with activity
- Increases when messages come from groups

#### Commands Run

- Should show actual command count (not 0)
- Increases with each command execution

### 7. Check Charts

#### Activity Overview

- Should show bars for recent hours
- Current hour should have activity
- Hover to see exact counts

#### Top Commands

- Should list most-used commands
- Shows command name and count
- Sorted by usage (most used first)

### 8. Check Recent Messages Table

Each row should show:

- **Sender**: Real name or phone number (not "Unknown")
- **Message**: Actual message text or "[Media]"
- **Chat**: "Group" or "Private" badge
- **Time**: Relative time (e.g., "Just now", "5m ago")

### 9. Test Refresh Button

1. Click the "Refresh" button (top right)
2. Should see "Dashboard refreshed" toast notification
3. All data should reload

### 10. Test Auto-Refresh

1. Leave dashboard open
2. Send messages from WhatsApp
3. Dashboard should update automatically (no manual refresh needed)

## Expected Results

### ✅ PASS Criteria

- Bot status shows "Online" with real phone number
- All metric cards show numbers > 0 (after sending messages)
- Recent messages show real sender names and content
- Charts display actual data (not empty)
- Real-time updates work without manual refresh
- No console errors in browser DevTools

### ❌ FAIL Indicators

- Bot status shows "Offline" when bot is connected
- Phone number shows "Not connected"
- All metrics show 0 after sending messages
- Recent messages show "Unknown" sender
- Charts are empty after activity
- Console shows errors

## Troubleshooting

### Issue: Bot shows "Offline"

**Solution**:

- Check if bot is actually connected to WhatsApp
- Restart the bot: `npm start`
- Check console for connection errors

### Issue: Metrics show 0

**Solution**:

- Send some messages to the bot
- Run some commands (e.g., `.ping`, `.help`)
- Wait a few seconds for updates
- Click refresh button

### Issue: Recent messages show "Unknown"

**Solution**:

- This was the bug we just fixed
- Make sure you restarted the bot after the fix
- Clear browser cache and reload dashboard

### Issue: Real-time updates not working

**Solution**:

- Check browser console for WebSocket errors
- Verify bot is running
- Refresh the dashboard page
- Check if port 3000 is accessible

### Issue: Dashboard won't load

**Solution**:

- Check if web server started (should see "Dashboard running on http://localhost:3000")
- Check if port 3000 is already in use
- Try accessing http://127.0.0.1:3000 instead

## Advanced Testing

### Test Analytics Accuracy

1. Note current "Total Messages" count
2. Send exactly 10 messages
3. Refresh dashboard
4. Verify count increased by 10

### Test Command Tracking

1. Run `.ping` command 5 times
2. Check "Top Commands" chart
3. Should show "ping" with count of 5

### Test Group vs Private

1. Send message in a group
2. Send message in private chat
3. Check "Recent Messages" table
4. Should show correct chat type badges

### Test Uptime

1. Note the uptime when bot connects
2. Wait 5 minutes
3. Check uptime again
4. Should show ~5 minutes

## Performance Check

Dashboard should:

- Load in < 2 seconds
- Update metrics in < 1 second after message
- Handle 100+ messages without lag
- Auto-refresh every 30 seconds
- WebSocket connection stay stable

## Browser Compatibility

Test in:

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ Mobile browsers (responsive design)

---

**If all tests pass**: Dashboard is working correctly! 🎉
**If tests fail**: Check the troubleshooting section or review the implementation.
