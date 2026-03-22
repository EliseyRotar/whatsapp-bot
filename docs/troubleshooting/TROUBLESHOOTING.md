# Troubleshooting Guide

## ⚠️ IMPORTANT: WhatsApp Web Conflict

### Problem: Bot not responding + WhatsApp Web frozen

**This happens because:**

- WhatsApp only allows ONE active WhatsApp Web session at a time
- If you have web.whatsapp.com open in your browser AND the bot running, they conflict
- This causes both to freeze or not work properly

### Solution:

**Option 1: Use ONLY the bot (Recommended)**

1. Close web.whatsapp.com in your browser
2. Log out from WhatsApp Web if needed
3. Keep only the bot running
4. Use WhatsApp normally on your phone

**Option 2: Use ONLY WhatsApp Web**

1. Stop the bot (Ctrl+C)
2. Use web.whatsapp.com normally
3. Start bot when you need it

**You CANNOT use both at the same time!**

---

## Bot Not Responding to Commands

### Check 1: Is the bot running?

```bash
ps aux | grep "node index.js"
```

If nothing shows up, start the bot:

```bash
npm start
```

### Check 2: Is the bot connected?

Look for this message in the terminal:

```
✅ Bot connected successfully!
```

If you see "Connection closed", the bot disconnected.

### Check 3: Are you using the correct prefix?

Commands must start with `.` (dot)

Examples:

- ✅ `.ping`
- ✅ `.help`
- ❌ `ping` (missing dot)
- ❌ `/ping` (wrong prefix)

### Check 4: Who is sending the message?

The bot ignores messages from:

- Itself (to prevent loops)
- Messages sent from the same device the bot is on

**Solution:** Have someone else send `.ping` in a group, or send from a different phone.

### Check 5: Is the bot in private mode?

If bot is in private mode, only the owner can use it.

Check config.js:

```javascript
mode: "public"; // Should be public for everyone to use
```

Or change it with:

```
.mode public
```

---

## WhatsApp Web Frozen

### Cause:

Bot and WhatsApp Web are both connected, causing a conflict.

### Fix:

1. Close WhatsApp Web tab
2. Stop the bot: `Ctrl+C`
3. Wait 10 seconds
4. Choose ONE:
   - Start bot: `npm start`
   - OR use WhatsApp Web

---

## Bot Connected But Not Responding

### Check the logs:

The bot now has debug logging. You should see:

```
[CMD] From: 393313444410@s.whatsapp.net
[CMD] Message: .ping
[CMD] Command: ping, Args:
[CMD] Executing: ping
[CMD] Completed: ping
```

If you don't see these logs when sending commands, the bot isn't receiving messages.

### Possible causes:

1. **Message sent from same device**
   - Bot ignores messages with `fromMe: true`
   - Send from a different phone or have someone else test

2. **Bot not fully connected**
   - Restart the bot
   - Check for "Bot connected successfully!" message

3. **Session expired**
   - Delete `auth_info/` folder
   - Restart bot and scan QR again

---

## Testing the Bot

### Test 1: From another phone

Have a friend send `.ping` in a group where the bot is.

### Test 2: Check bot logs

Watch the terminal for `[CMD]` messages when commands are sent.

### Test 3: Simple command

Try the simplest command first:

```
.ping
```

---

## Common Issues

### "Command not found"

- Make sure you're using `.` prefix
- Check spelling: `.help` not `.halp`
- Use `.help` to see all commands

### "This command is only for admins"

- You need to be a group admin
- Bot needs to be admin for some commands

### "This command is only for the bot owner"

- Only +393313444410 can use owner commands
- Commands like `.spam`, `.mode`, `.broadcast`

### Bot keeps disconnecting

- Check internet connection
- Make sure WhatsApp is working on your phone
- Try deleting `auth_info/` and reconnecting

---

## Reset Everything

If nothing works, start fresh:

```bash
# Stop the bot
Ctrl+C

# Delete session
rm -rf auth_info/

# Delete data
rm -rf data/

# Restart
npm start

# Scan QR code again
```

---

## Debug Mode

To see what's happening:

1. Stop the bot
2. Start with logging:

```bash
npm start
```

3. Watch for these messages:
   - `[CMD]` - Command received
   - `✅ Bot connected` - Connection successful
   - Errors will show in red

---

## Still Not Working?

### Check these:

1. **Node.js version**

```bash
node --version
# Should be v14 or higher
```

2. **Dependencies installed**

```bash
ls node_modules/
# Should have many folders
```

3. **Config file**

```bash
cat config.js
# Check ownerNumber is correct
```

4. **Bot has permissions**

```bash
ls -la auth_info/
# Should have read/write permissions
```

---

## How to Test Properly

### Step 1: Start bot

```bash
npm start
```

### Step 2: Wait for connection

Look for:

```
✅ Bot connected successfully!
📝 Session saved - no need to scan QR again next time!
🤖 Bot is ready to receive messages.
```

### Step 3: Test from ANOTHER phone

- Don't test from the same phone/device the bot is on
- Have a friend send `.ping`
- Or use a second phone

### Step 4: Check logs

You should see:

```
[CMD] From: [phone number]
[CMD] Message: .ping
[CMD] Command: ping
[CMD] Executing: ping
[CMD] Completed: ping
```

---

## Important Notes

⚠️ **WhatsApp Web Conflict**

- Cannot use bot + WhatsApp Web simultaneously
- Choose one or the other

⚠️ **Testing from same device**

- Bot ignores messages from itself
- Test from another phone

⚠️ **Session conflicts**

- Only one bot instance at a time
- Don't run multiple bots with same number

⚠️ **Rate limiting**

- Don't spam commands too fast
- WhatsApp may temporarily block you

---

## Quick Fixes

### Bot not responding:

```bash
# Restart bot
Ctrl+C
npm start
```

### WhatsApp Web frozen:

```bash
# Close WhatsApp Web
# Stop bot
Ctrl+C
# Wait 10 seconds
# Start bot
npm start
```

### Need fresh start:

```bash
rm -rf auth_info/
npm start
# Scan QR again
```

---

## Getting Help

If you're still stuck:

1. Check the logs for errors
2. Make sure you're testing correctly (from another phone)
3. Verify WhatsApp Web is closed
4. Try a fresh start (delete auth_info/)

The most common issue is the WhatsApp Web conflict!
