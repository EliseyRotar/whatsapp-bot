# WhatsApp Bot - Windows Quick Start

## 🪟 Windows 11 Compatible!

This bot works perfectly on Windows 11. All PowerShell scripts are provided alongside Linux bash scripts.

## 📋 Prerequisites

1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **Git** (optional)
   - Download: https://git-scm.com/download/win

## 🚀 Quick Start

### 1. Clone Repository

```powershell
git clone https://github.com/EliseyRotar/whatsapp-bot.git
cd whatsapp-bot
```

### 2. Run Setup

```powershell
.\setup-dashboard.ps1
```

This will:

- Install dependencies
- Create data directories
- Setup .env file

### 3. Configure

Edit `.env` file with your settings:

```powershell
notepad .env
```

### 4. Start Bot

```powershell
npm start
```

Or use the starter script:

```powershell
.\scripts\start.ps1
```

### 5. Scan QR Code

- QR code appears in terminal
- Scan with WhatsApp mobile app
- Session saved automatically

### 6. Access Dashboard

Open browser: http://localhost:3000

- Username: `admin`
- Password: (from .env WEB_PASSWORD)

## 📜 Available PowerShell Scripts

All bash scripts have PowerShell equivalents:

| Bash Script           | PowerShell Script      | Description            |
| --------------------- | ---------------------- | ---------------------- |
| `restart-bot.sh`      | `restart-bot.ps1`      | Restart the bot        |
| `fix-session.sh`      | `fix-session.ps1`      | Fix WhatsApp session   |
| `setup-dashboard.sh`  | `setup-dashboard.ps1`  | Setup dashboard        |
| `import-logs.sh`      | `import-logs.ps1`      | Import historical data |
| `scripts/start.sh`    | `scripts/start.ps1`    | Start bot with checks  |
| `scripts/test-bot.sh` | `scripts/test-bot.ps1` | Test bot setup         |

### Usage Examples

**Restart Bot:**

```powershell
.\restart-bot.ps1
```

**Fix Session Issues:**

```powershell
.\fix-session.ps1
```

**Import Historical Data:**

```powershell
.\import-logs.ps1
```

**Test Setup:**

```powershell
.\scripts\test-bot.ps1
```

## 🔧 Common Commands

### Install Dependencies

```powershell
npm install
```

### Start Bot

```powershell
npm start
```

### Stop Bot

```powershell
# Press Ctrl+C in terminal
# Or kill process:
Get-Process node | Stop-Process -Force
```

### View Logs

```powershell
type bot.log
type bot-console.log
```

### Clear Data

```powershell
Remove-Item data\* -Recurse -Force
```

### Clear Session

```powershell
Remove-Item auth_info -Recurse -Force
```

## 🐛 Troubleshooting

### Port 3000 Already in Use

```powershell
# Find process
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Permission Denied

Run PowerShell as Administrator:

1. Right-click PowerShell
2. Select "Run as Administrator"

### Scripts Won't Run

Enable script execution:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Node-gyp Build Errors

```powershell
npm install --global windows-build-tools
npm rebuild
```

### Database Locked

```powershell
# Stop all node processes
Get-Process node | Stop-Process -Force

# Delete lock files
Remove-Item data\bot.db-shm, data\bot.db-wal -Force
```

## 🚀 Running as Windows Service

### Using NSSM (Recommended)

1. Download NSSM: https://nssm.cc/download
2. Extract to `C:\nssm`
3. Install service:

```powershell
cd C:\nssm\win64
.\nssm.exe install WhatsAppBot "C:\Program Files\nodejs\node.exe" "C:\path\to\whatsapp-bot\index.js"
.\nssm.exe set WhatsAppBot AppDirectory "C:\path\to\whatsapp-bot"
.\nssm.exe start WhatsAppBot
```

### Using Task Scheduler

1. Open Task Scheduler
2. Create Basic Task
3. Name: "WhatsApp Bot"
4. Trigger: At startup
5. Action: Start program
   - Program: `node.exe`
   - Arguments: `index.js`
   - Start in: Bot directory

## 📊 Dashboard Features

Access at http://localhost:3000

- **Dashboard**: Real-time bot statistics
- **Messages**: View all messages (5,000 buffer)
- **Groups**: Manage groups with real data
- **Analytics**: Charts and metrics
- **Commands**: Command usage statistics
- **Settings**: Bot configuration

## 🔒 Security

### Firewall

Allow Node.js through Windows Firewall:

1. Windows Security → Firewall
2. Allow an app
3. Add Node.js
4. Allow private and public networks

### Antivirus

Add exclusions for:

- Bot directory
- Node.js directory
- Data directory

## 📚 Documentation

Full documentation in `docs/` folder:

- `docs/setup/WINDOWS_COMPATIBILITY.md` - Detailed Windows guide
- `docs/dashboard/` - Dashboard documentation
- `docs/reference/` - Quick references

## 🆘 Getting Help

1. Check logs: `type bot.log`
2. Test setup: `.\scripts\test-bot.ps1`
3. Read docs: `docs/setup/WINDOWS_COMPATIBILITY.md`
4. Check GitHub issues

## ✅ Features

All features work on Windows:

- ✅ WhatsApp messaging
- ✅ All commands (economy, games, admin)
- ✅ Web dashboard
- ✅ Database (SQLite)
- ✅ Analytics
- ✅ Group management
- ✅ Media downloads
- ✅ Session persistence

## 🎯 Next Steps

1. ✅ Setup complete
2. ✅ Bot running
3. ✅ Dashboard accessible
4. 📱 Add bot to groups
5. 🎮 Test commands
6. 📊 Check analytics
7. ⚙️ Customize settings

## 📝 Notes

- All Node.js code is cross-platform
- PowerShell scripts provided for Windows
- Bash scripts still work in Git Bash/WSL
- Full feature parity with Linux version

Enjoy your WhatsApp bot on Windows! 🎉
