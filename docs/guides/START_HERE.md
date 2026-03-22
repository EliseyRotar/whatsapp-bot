# 🚀 START HERE

## Quick Setup (3 steps)

### 1️⃣ Install Dependencies

```bash
npm install --omit=optional
```

### 2️⃣ Start the Bot

```bash
npm start
```

### 3️⃣ Scan QR Code

- Open WhatsApp on your phone (+393313444410)
- Go to: Settings → Linked Devices → Link a Device
- Scan the QR code from terminal
- Done! ✅

## Test It Works

Send these commands to yourself or in a group:

```
.ping
.alive
.help
```

## Most Useful Commands

### In Groups (as admin):

```
.tagall Hello everyone!
.hidetag Secret message
.ban @user
.kick @user
.antilink on
.mute 30
```

### Owner Commands (only you):

```
.spam 5 Test message
.spam 10 2000 Slow spam
.mode private
```

## What's Next?

- Read `COMMANDS.md` for complete command list with examples
- Check `GROUP_MANAGEMENT.md` for all group commands
- See `SPAM_GUIDE.md` for spam feature details
- Read `SESSION_INFO.md` for session management

## Troubleshooting

### Installation failed?

```bash
npm install --omit=optional
```

### Bot not starting?

```bash
./test-bot.sh
```

### Need to restart?

```bash
# Stop: Ctrl+C
# Start: npm start
```

## Running 24/7

Use screen to keep it running:

```bash
screen -S whatsapp-bot
npm start
# Press Ctrl+A then D to detach
# Reattach: screen -r whatsapp-bot
```

Or install as systemd service:

```bash
./install-service.sh
```

## Important

⚠️ Don't spam too much - you can get banned!
✅ You can use WhatsApp normally on your phone
🔒 Keep `auth_info/` folder safe
🤖 Bot only responds to commands with `.` prefix
📱 **Scan QR only ONCE** - session persists after restart!

---

**Your number:** +393313444410  
**Prefix:** `.` (dot)  
**Mode:** Public (everyone can use basic commands)

Enjoy your bot! 🎉
