# 🔧 Fix Session Errors (Bad MAC)

## Problem

You're seeing these errors in the console:

```
Failed to decrypt message with any known session...
Session error: MessageCounterError: Key used already or never filled
Session error: Error: Bad MAC
```

## Why This Happens

- You're using the same WhatsApp number for both the bot and personal use
- WhatsApp Web was open while the bot was running
- Session got corrupted from multiple connections
- The encryption keys are out of sync

## Solution

### Step 1: Stop the Bot

Press `Ctrl+C` in the terminal where the bot is running

### Step 2: Delete Session Folder

```bash
rm -rf auth_info/
```

### Step 3: Make Sure WhatsApp Web is Closed

- Close all WhatsApp Web tabs in your browser
- Make sure no other WhatsApp clients are connected

### Step 4: Restart the Bot

```bash
npm start
```

### Step 5: Scan QR Code

- A QR code will appear in the terminal
- Open WhatsApp on your phone (+393313444410)
- Go to: Settings → Linked Devices → Link a Device
- Scan the QR code

### Step 6: Test Commands

Once connected, test:

```
.ping
.alive
.help
.vv (reply to a view-once message)
.autovv on
```

## Important Notes

1. **Only ONE connection at a time**
   - Either use WhatsApp Web OR the bot
   - Not both simultaneously
   - This is a WhatsApp limitation

2. **Session is saved**
   - After first QR scan, session is saved in `auth_info/`
   - You won't need to scan QR again unless you delete this folder
   - Session persists across bot restarts

3. **If errors return**
   - Delete `auth_info/` again
   - Rescan QR code
   - Make sure WhatsApp Web is closed

## What Was Fixed

✅ Fixed `.vv` command - now uses correct Baileys download method
✅ Fixed `.vv2` command - now uses correct Baileys download method  
✅ Fixed `.sticker` command - now uses correct Baileys download method
✅ Fixed `.autovv` auto-save feature - now uses correct Baileys download method

All commands now use `downloadMediaMessage` from Baileys library instead of the non-existent `sock.downloadMediaMessage` method.

## Testing After Fix

1. Send yourself a view-once photo
2. Enable auto-save: `.autovv on`
3. Send another view-once photo
4. Bot should automatically save it
5. Reply to a view-once message with `.vv`
6. Bot should reveal the content
