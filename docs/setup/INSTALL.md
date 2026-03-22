# Installation Guide for Arch Linux

## Quick Start

1. Install Node.js (if not already installed):

```bash
sudo pacman -S nodejs npm
```

2. Install dependencies:

```bash
npm install
```

3. Start the bot:

```bash
./start.sh
# or
npm start
```

4. Scan the QR code with your WhatsApp (+393313444410)

## Important Notes

### Using Your Existing WhatsApp Account

The bot will connect to your existing WhatsApp account (+393313444410). You can:

- Use WhatsApp normally on your phone
- Use the bot simultaneously
- The bot responds only to commands starting with `.`

### First Time Setup

1. When you run the bot, a QR code will appear in the terminal
2. Open WhatsApp on your phone (+393313444410)
3. Go to Settings > Linked Devices > Link a Device
4. Scan the QR code from the terminal
5. The bot will connect and save the session in `auth_info/`

### Session Persistence

- Your session is saved in the `auth_info/` folder
- You won't need to scan the QR code again unless you logout
- Keep this folder safe and don't delete it
- The bot will automatically reconnect if the connection drops

### Running the Bot

The bot needs to stay running to work. Options:

1. Run in terminal (stops when you close terminal):

```bash
npm start
```

2. Run in background with screen:

```bash
screen -S whatsapp-bot
npm start
# Press Ctrl+A then D to detach
# Reattach with: screen -r whatsapp-bot
```

3. Run in background with tmux:

```bash
tmux new -s whatsapp-bot
npm start
# Press Ctrl+B then D to detach
# Reattach with: tmux attach -t whatsapp-bot
```

4. Run as systemd service (recommended for always-on):

```bash
sudo nano /etc/systemd/system/whatsapp-bot.service
```

Add this content (replace /path/to/bot with your actual path):

```ini
[Unit]
Description=WhatsApp Bot
After=network.target

[Service]
Type=simple
User=YOUR_USERNAME
WorkingDirectory=/path/to/bot
ExecStart=/usr/bin/node index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Then:

```bash
sudo systemctl daemon-reload
sudo systemctl enable whatsapp-bot
sudo systemctl start whatsapp-bot
sudo systemctl status whatsapp-bot
```

## Troubleshooting

### QR Code Not Showing

- Make sure your terminal supports UTF-8
- Try a different terminal emulator

### Connection Issues

- Check your internet connection
- Make sure WhatsApp is working on your phone
- Delete `auth_info/` folder and scan QR again

### Bot Not Responding

- Check if the bot is running: `ps aux | grep node`
- Check logs for errors
- Make sure you're using the correct prefix (`.`)

### Permission Errors

- Make sure the bot has write permissions in the directory
- Run: `chmod -R 755 .`

## Configuration

Edit `config.js` to customize:

```javascript
export const config = {
  prefix: ".", // Command prefix
  ownerNumber: "393313444410", // Your number
  botName: "WhatsApp Bot",
  ownerName: "Red",

  // Spam settings
  spamDelay: 1000, // Delay between spam messages (ms)
  maxSpamCount: 50, // Maximum spam count
};
```

## Security Tips

1. Keep your `auth_info/` folder private
2. Don't share your session files
3. Use the bot responsibly
4. Be careful with spam features (can get you banned)
5. Only give owner commands to trusted numbers

## Testing

Test the bot with these commands:

1. `.ping` - Check if bot responds
2. `.alive` - Check bot status
3. `.help` - See all commands

In a group (where you're admin):

1. `.tagall Test` - Tag all members
2. `.antilink on` - Enable antilink
3. `.welcome on` - Enable welcome messages
