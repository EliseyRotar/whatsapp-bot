# Session Management

## How It Works

Your WhatsApp session is saved in the `auth_info/` folder. This means:

✅ **Scan QR code only ONCE**
✅ **Restart the bot anytime** - no need to scan again
✅ **Session persists** across reboots
✅ **Automatic reconnection** if connection drops

## Session Files

The `auth_info/` folder contains:

- `creds.json` - Your authentication credentials
- Other session files

**⚠️ IMPORTANT:** Keep this folder safe and private!

## What Happens When...

### First Time Running

1. Bot starts
2. QR code appears
3. You scan it with WhatsApp
4. Session is saved to `auth_info/`
5. Bot connects

### Subsequent Runs

1. Bot starts
2. Loads session from `auth_info/`
3. Connects automatically (no QR code!)
4. Ready to use

### If You Stop and Restart

```bash
# Stop the bot
Ctrl+C

# Start again
npm start

# ✅ No QR code needed - connects automatically!
```

## Troubleshooting

### Need to Scan QR Again?

If you want to re-link your WhatsApp:

```bash
# Delete the session folder
rm -rf auth_info/

# Start the bot
npm start

# Scan the new QR code
```

### Session Not Saving?

Check permissions:

```bash
ls -la auth_info/
```

Make sure the bot can write to this folder.

### Connection Issues?

If the bot keeps disconnecting:

1. Check your internet connection
2. Make sure WhatsApp is working on your phone
3. Try deleting `auth_info/` and scanning QR again

### Multiple Devices

You can link the same WhatsApp account to multiple devices:

- Your phone (primary)
- This bot (linked device)
- Other computers/tablets

All work simultaneously!

## Security Tips

1. **Never share** the `auth_info/` folder
2. **Don't commit** it to git (already in .gitignore)
3. **Backup** this folder if you want to move the bot
4. **Delete** it if you want to unlink the bot

## Moving the Bot

To move the bot to another computer:

1. Copy the entire bot folder (including `auth_info/`)
2. Run `npm install --omit=optional` on the new computer
3. Start the bot - it will use the existing session

## Unlinking the Bot

To unlink the bot from your WhatsApp:

**Method 1: From WhatsApp**

1. Open WhatsApp on your phone
2. Go to Settings → Linked Devices
3. Find the bot session
4. Tap and select "Log out"

**Method 2: Delete Session**

```bash
rm -rf auth_info/
```

The bot will be disconnected and you'll need to scan QR again.

## Session Expiry

WhatsApp sessions don't expire unless:

- You manually log out
- You delete the `auth_info/` folder
- WhatsApp detects suspicious activity
- You unlink from your phone

Normal usage: **Session lasts indefinitely!**
