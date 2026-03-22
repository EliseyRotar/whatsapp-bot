# 🚀 Final Setup Guide - WhatsApp Bot

## ⚠️ CRITICAL: Fix Session First!

Your bot has "Bad MAC" errors. You MUST fix this before anything will work properly.

### Quick Fix:

```bash
./fix-session.sh
```

### Manual Fix:

```bash
# 1. Stop the bot
Press Ctrl+C

# 2. Delete corrupted session
rm -rf auth_info/

# 3. Close WhatsApp Web
Close all WhatsApp Web tabs in your browser

# 4. Restart bot
npm start

# 5. Scan QR code
Use your phone (+393313444410) to scan the QR code
```

---

## ✅ What Works Now

### General Commands

- `.ping` - Check bot latency
- `.alive` - Bot status
- `.help` - Show menu
- `.jid` - Get WhatsApp IDs
- `.sticker` - Create sticker (reply to image)
- `.delete` - Delete message (reply)

### Admin Commands (Groups)

- `.kick @user` - Remove user
- `.ban @user` - Ban user
- `.promote @user` - Make admin
- `.demote @user` - Remove admin
- `.warn @user <reason>` - Warn user (3 = kick)
- `.warnings @user` - Check warnings
- `.warnings clear @user` - Clear warnings
- `.automod on/off` - Toggle auto-moderation
- `.tagall <msg>` - Tag everyone
- `.hidetag <msg>` - Hidden tag
- `.mute <minutes>` - Mute group
- `.antilink on/off` - Link protection
- `.welcome on/off` - Welcome messages
- `.setgname <name>` - Change group name
- `.setgdesc <desc>` - Change description
- `.resetlink` - Reset invite link
- `.groupinfo` - Group details
- `.staff` - List admins

### Owner Commands (You Only)

- `.mode public/private` - Bot access mode
- `.spam <count> <text>` - Spam messages
- `.broadcast <msg>` - Send to all groups
- `.autovv on/off` - Auto-save view-once
- `.debug` - Debug info (reply to msg)

### Auto-Moderation Features

When enabled (`.automod on`):

- ✅ Filters bad words
- ✅ Detects spam (5 msgs in 10 sec)
- ✅ Blocks excessive caps (>70%)
- ✅ Auto-warns violators
- ✅ Auto-kicks after 3 warnings
- ✅ Admins are exempt

---

## 📸 View-Once Messages - THE TRUTH

### ❌ What DOESN'T Work:

- `.vv` command (REMOVED - can't work)
- Replying to view-once messages
- Revealing after opening

### ✅ What WORKS:

**Only `.autovv` works!**

#### How to Use:

1. **Enable BEFORE receiving:**

   ```
   .autovv on
   ```

2. **Receive view-once message:**
   - Bot automatically saves it
   - You get a copy
   - Original still works

3. **That's it!**
   - No replying needed
   - No .vv command needed
   - Completely automatic

#### Why Only This Works:

WhatsApp deletes encryption keys after viewing. The ONLY way to save view-once is to intercept it BEFORE opening. That's what `.autovv` does.

**Timeline:**

```
Message arrives → Bot saves (keys exist) → You open → Keys deleted
```

If you try to save AFTER opening:

```
Message arrives → You open → Keys deleted → Bot can't download ❌
```

---

## 🧪 Testing After Session Fix

### 1. Basic Commands

```
.ping
.alive
.help
```

### 2. Owner Commands

```
.mode public
.autovv on
```

### 3. View-Once Test

```
1. .autovv on
2. Send yourself a view-once photo
3. Bot should auto-save it
4. Check if you received the copy
```

### 4. Moderation Test (in a group)

```
.automod on
.warn @someone test
.warnings @someone
```

### 5. Sticker Test

```
Send an image
Reply to it with: .sticker
```

---

## 🔧 Configuration

Edit `config.js` to customize:

```javascript
{
  prefix: '.',
  ownerNumber: '393313444410',
  ownerJid: '222788929462360@lid',
  botName: 'eli6s bot',
  ownerName: 'eli6',

  autoMod: {
    maxWarnings: 3,
    badWords: [...],
    spamThreshold: 5,
    spamTimeWindow: 10000,
    capsThreshold: 0.7
  }
}
```

---

## 📚 Documentation Files

- `WHY_VV_DOESNT_WORK.md` - Explains view-once limitations
- `MODERATION_FEATURES.md` - Auto-mod documentation
- `QUICK_MODERATION_GUIDE.md` - Quick reference
- `FIX_SESSION_ERRORS.md` - Session troubleshooting
- `fix-session.sh` - Automated session fix

---

## 🐛 Troubleshooting

### Bot not responding?

1. Check if bot is running: `ps aux | grep "node index.js"`
2. Check for errors in console
3. Fix session if you see "Bad MAC" errors

### Commands not working?

1. Make sure you're using correct prefix: `.`
2. Check if you have required permissions
3. For admin commands, bot must be group admin

### View-once not saving?

1. Make sure `.autovv on` is enabled BEFORE receiving
2. Check session is not corrupted (no "Bad MAC" errors)
3. Test with a fresh view-once message

### Auto-mod not working?

1. Enable it: `.automod on`
2. Bot must be group admin to kick users
3. Check console for errors

---

## 🎯 Next Steps

1. **Fix session** (most important!)

   ```bash
   ./fix-session.sh
   npm start
   ```

2. **Test basic commands**

   ```
   .ping
   .alive
   ```

3. **Enable auto-vv**

   ```
   .autovv on
   ```

4. **Test in a group**

   ```
   .automod on
   .help
   ```

5. **Enjoy your bot!** 🎉

---

## ⚡ Quick Commands Reference

```bash
# Start bot
npm start

# Fix session
./fix-session.sh

# Check if running
ps aux | grep "node index.js"

# Stop bot
pkill -f "node index.js"

# View logs
# (just look at the terminal where bot is running)
```

---

## 💡 Pro Tips

1. Keep `.autovv on` always enabled if you want to save view-once
2. Use `.automod on` in groups to reduce manual moderation
3. Close WhatsApp Web when bot is running (same number conflict)
4. Session is saved - you only scan QR once
5. If weird errors appear, fix session with `./fix-session.sh`

---

## 🆘 Still Having Issues?

Check the console output for specific errors. Most issues are:

1. Session corruption → Fix with `./fix-session.sh`
2. Permission errors → Make bot admin in groups
3. WhatsApp Web conflict → Close WhatsApp Web

The bot is fully functional once the session is fixed!
