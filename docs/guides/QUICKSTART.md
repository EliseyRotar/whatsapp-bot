# Quick Start Guide

## 1. Install Dependencies

```bash
npm install --omit=optional
```

Note: We skip optional dependencies to avoid sharp build issues on Arch Linux.

## 2. Start the Bot

```bash
./start.sh
```

Or:

```bash
npm start
```

## 3. Link Your WhatsApp

1. A QR code will appear in the terminal
2. Open WhatsApp on your phone (+393313444410)
3. Go to: Settings → Linked Devices → Link a Device
4. Scan the QR code
5. Done! The bot is now connected

## 4. Test the Bot

Send these commands to test:

```
.ping
.alive
.help
```

## 5. Use in Groups

1. Add the bot to a group
2. Make the bot an admin
3. Try these commands:

```
.tagall Hello everyone!
.antilink on
.welcome on
```

## 6. Owner Commands

Only you (+393313444410) can use these:

```
.mode public
.spam 5 Test message
```

## Common Commands

### General

- `.help` - Show all commands
- `.ping` - Check latency
- `.alive` - Bot status

### Group Admin

- `.ban @user` - Ban user
- `.kick @user` - Kick user
- `.promote @user` - Make admin
- `.demote @user` - Remove admin
- `.tagall <msg>` - Tag everyone
- `.hidetag <msg>` - Hidden tag
- `.mute <min>` - Mute group
- `.antilink on/off` - Toggle antilink
- `.setgname <name>` - Change name
- `.setgdesc <desc>` - Change description

### Owner Only

- `.mode public/private` - Change mode
- `.spam <count> <text>` - Spam messages
- `.spam <count> <delay> <text>` - Spam with delay

## Running 24/7

### Option 1: Screen

```bash
screen -S whatsapp-bot
npm start
# Press Ctrl+A then D to detach
```

### Option 2: Systemd Service

```bash
./install-service.sh
# Follow the instructions shown
```

## Troubleshooting

### Bot not responding?

- Check if it's running: `ps aux | grep node`
- Check the prefix is correct: `.`
- Make sure you're the owner for owner commands

### Can't kick/ban?

- Bot must be admin
- You must be admin
- Can't remove other admins

### QR code not showing?

- Try a different terminal
- Make sure terminal supports UTF-8

## Need Help?

- Read `README.md` for full documentation
- Check `GROUP_MANAGEMENT.md` for group commands
- See `SPAM_GUIDE.md` for spam feature details
- Read `INSTALL.md` for detailed installation

## Important Notes

⚠️ Your WhatsApp account (+393313444410) will be used
✅ You can still use WhatsApp normally on your phone
🤖 Bot only responds to commands starting with `.`
🔒 Keep the `auth_info/` folder safe
⚡ Don't spam too much or you might get banned

## Configuration

Edit `config.js` to customize:

- Command prefix
- Spam settings
- Bot behavior

That's it! Enjoy your WhatsApp bot! 🎉
