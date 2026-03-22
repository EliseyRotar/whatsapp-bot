# 🤖 WhatsApp Multi-Purpose Bot

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Baileys](https://img.shields.io/badge/Baileys-6.7.8-blue.svg)](https://github.com/WhiskeySockets/Baileys)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A feature-rich WhatsApp bot built with Baileys, offering gaming, economy, group management, AI integration, and more. Supports 7 languages and includes 100+ commands.

## ✨ Key Features

### 🎮 Gaming System

- **Casino Games**: Blackjack, Slot Machine, Roulette, Dice, Coin Flip
- **Strategy Games**: Chess (with AI), Mines, 8Ball
- **Economy System**: Virtual currency, bank, shop, inventory, daily rewards
- **Leaderboards**: Track top players and achievements
- **Weapons System**: RPG, Rifle, Sniper, Pistol, Knife, Grenade

### 💰 Economy & Trading

- **Banking**: Deposit, withdraw, transfer coins between users
- **Shop**: Buy items, weapons, and power-ups
- **Daily Rewards**: Spin the wheel for prizes (up to 10,000 coins)
- **Rob System**: Steal coins from other players (with anti-rob protection)
- **Bulk Purchases**: Buy weapons in bulk with discounts (5%-25% off)

### 👥 Group Management

- **Moderation**: Ban, kick, mute, warn users
- **Admin Tools**: Promote/demote, antilink, antidelete
- **Announcements**: Tag all, hide tag, broadcast messages
- **Welcome System**: Customizable welcome messages
- **Group Settings**: Change name, description, reset invite link

### 🤖 AI Integration

- **AI Chat**: Powered by Groq/OpenRouter
- **Image Generation**: Create AI images from text
- **Context-Aware**: Remembers conversation history

### 🌍 Multi-Language Support

Supports 7 languages:

- 🇬🇧 English
- 🇮🇹 Italian
- 🇷🇺 Russian
- 🇪🇸 Spanish
- 🇵🇹 Portuguese
- 🇸🇦 Arabic
- 🇮🇳 Hindi

### 📊 Advanced Features

- **Web Dashboard**: Monitor bot status, stats, and logs (port 3000)
- **SQLite Database**: Fast and reliable data storage
- **Redis Support**: Optional caching for better performance
- **Logging System**: Comprehensive logging with Winston
- **Security**: Rate limiting, input validation, anti-spam
- **Newsletter System**: Schedule and send newsletters
- **Referral Program**: Reward users for inviting bot to groups

## 📋 Requirements

- **Node.js**: v18 or higher
- **Operating System**: Linux (tested on Arch Linux), macOS, Windows
- **WhatsApp Account**: Active phone number
- **Optional**: Redis (for caching)

## 🚀 Quick Start

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd WA_BOT

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

### 2. Configuration

Edit `.env` file:

```env
# Bot Settings
PREFIX=.
OWNER_NUMBER=393313444410
BOT_NAME=eli6s bot
MODE=public

# AI Settings (Optional)
GROQ_API_KEY=your_groq_api_key
OPENROUTER_API_KEY=your_openrouter_key

# Web Dashboard
WEB_PASSWORD=admin123
WEB_PORT=3000

# Database
DB_TYPE=sqlite
DB_PATH=./data/bot.db

# Redis (Optional)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

### 3. Start the Bot

```bash
# Start bot only
npm start

# Start bot + web dashboard
npm run dev

# Start web dashboard only
npm run web
```

### 4. Scan QR Code

Open WhatsApp on your phone and scan the QR code displayed in the terminal.

## 📱 Command Categories

### 🎮 Games (20+ commands)

```
.blackjack <bet>     - Play blackjack against dealer
.slot <bet>          - Spin the slot machine
.mines <bet> <mines> - Play mines game
.chess @user         - Challenge someone to chess
.dice <bet>          - Roll the dice
.coinflip <bet>      - Flip a coin
.roulette <bet>      - Spin the roulette wheel
.8ball <question>    - Ask the magic 8ball
.rob @user           - Attempt to rob someone
.fight @user         - Fight another player
```

### 💰 Economy (15+ commands)

```
.bank                - Check your balance
.daily               - Spin daily reward wheel
.shop                - View shop items
.buy <item>          - Purchase an item
.buybulk <weapon> <qty> - Buy weapons in bulk
.inventory           - View your inventory
.pay @user <amount>  - Transfer coins
.leaderboard         - View top players
.achievements        - View your achievements
```

### 👥 Admin (25+ commands)

```
.ban @user           - Ban a user
.kick @user          - Remove user from group
.mute <minutes>      - Mute group chat
.warn @user          - Warn a user
.promote @user       - Make user admin
.demote @user        - Remove admin rights
.antilink <on/off>   - Toggle antilink protection
.antidelete <on/off> - Toggle antidelete
.tagall <message>    - Tag all members
.hidetag <message>   - Hidden tag
.delete              - Delete message (reply)
.setgname <name>     - Change group name
.setgdesc <desc>     - Change description
.resetlink           - Reset invite link
```

### 🤖 AI & Utility (20+ commands)

```
.ai <prompt>         - Chat with AI
.image <prompt>      - Generate AI image
.sticker             - Convert to sticker
.vv                  - View once media
.jid                 - Get WhatsApp JID
.ping                - Check bot latency
.alive               - Bot status
.help                - Show all commands
.games               - List all games
.guide               - Bot guide
```

### 👑 Owner (15+ commands)

```
.mode <public/private> - Change bot mode
.spam <count> <text>   - Spam messages
.broadcast <message>   - Broadcast to all groups
.manage <action>       - Manage users/items
.roball <amount>       - Rob all users
.addowner @user        - Add additional owner
.removeowner @user     - Remove owner
```

## 🎯 Game Examples

### Blackjack

```
.blackjack 1000      - Bet 1000 coins
.hit                 - Draw another card
.stand               - Keep current hand
.double              - Double bet and draw one card
.split               - Split pairs
.insurance           - Buy insurance (dealer ace)
.surrender           - Surrender and get half bet back
```

### Mines

```
.mines 500 5         - Bet 500 coins, 5 mines
A1                   - Reveal tile at A1
B3                   - Reveal tile at B3
cashout              - Cash out winnings
quit                 - Forfeit game
```

### Chess

```
.chess @user         - Start game
e2e4                 - Move piece (algebraic notation)
resign               - Resign game
draw                 - Offer draw
```

## 🛠️ Advanced Configuration

### Database Migration

```bash
# Migrate from JSON to SQLite
node migrate-to-sqlite.js
```

### Service Installation (Linux)

```bash
# Install as systemd service
sudo ./install-service.sh

# Start service
sudo systemctl start whatsapp-bot
sudo systemctl enable whatsapp-bot
```

### Web Monitor

```bash
# Install web monitoring
./install-web-monitor.sh

# Access dashboard
http://localhost:3000
```

## 📊 Statistics

- **Total Commands**: 109
- **Game Commands**: 20+
- **Economy Commands**: 15+
- **Admin Commands**: 25+
- **Languages Supported**: 7
- **Active Users**: Track with analytics
- **Uptime**: Monitor with web dashboard

## 🔒 Security Features

- **Rate Limiting**: Prevent spam and abuse
- **Input Validation**: Sanitize all user inputs
- **Anti-Spam**: Configurable spam protection
- **Permission System**: Role-based access control
- **Secure Banking**: Transaction validation and logging
- **Anti-Rob Protection**: Shop item to prevent robberies

## 📚 Documentation

Comprehensive documentation available in `/docs`:

- **Setup Guides**: Installation and configuration
- **Command Reference**: Detailed command documentation
- **API Documentation**: Integration guides
- **Troubleshooting**: Common issues and solutions
- **Security**: Best practices and recommendations
- **Features**: In-depth feature explanations

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## ⚠️ Important Notes

### WhatsApp Policy Compliance

- This bot uses your personal WhatsApp account
- Avoid excessive spam (can lead to bans)
- Respect WhatsApp's Terms of Service
- Use reasonable delays between messages
- Don't use for commercial purposes without proper API

### Best Practices

- Keep spam delay above 3000ms
- Limit spam count to 50 messages
- Don't run multiple instances on same number
- Backup your data regularly
- Monitor logs for errors

## 🐛 Known Issues

- Some features may not work on WhatsApp Business accounts
- Large groups (>500 members) may experience delays
- Media processing requires sufficient RAM

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**eli6**

- WhatsApp: +393313444410
- Bot Name: eli6s bot

## 🙏 Acknowledgments

- [Baileys](https://github.com/WhiskeySockets/Baileys) - WhatsApp Web API
- [Express](https://expressjs.com/) - Web framework
- [SQLite](https://www.sqlite.org/) - Database
- [Winston](https://github.com/winstonjs/winston) - Logging
- [Socket.io](https://socket.io/) - Real-time communication

## 📞 Support

For issues, questions, or suggestions:

- Open an issue on GitHub
- Check documentation in `/docs`
- Review troubleshooting guide

---

**⚡ Built with Node.js and Baileys | 🌟 Star this repo if you find it useful!**
