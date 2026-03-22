# Cross-Platform Support

## Overview

The WhatsApp bot is fully compatible with both **Linux** and **Windows 11**, with dedicated scripts for each platform.

## Platform Support

### ✅ Linux

- All bash scripts (`.sh`)
- Native systemd service
- Full feature support
- Tested on Ubuntu, Debian, CentOS

### ✅ Windows 11

- All PowerShell scripts (`.ps1`)
- NSSM service support
- Full feature parity
- Native Windows compatibility

## Script Equivalents

| Feature         | Linux (Bash)          | Windows (PowerShell)   |
| --------------- | --------------------- | ---------------------- |
| Restart Bot     | `restart-bot.sh`      | `restart-bot.ps1`      |
| Fix Session     | `fix-session.sh`      | `fix-session.ps1`      |
| Setup Dashboard | `setup-dashboard.sh`  | `setup-dashboard.ps1`  |
| Import Logs     | `import-logs.sh`      | `import-logs.ps1`      |
| Start Bot       | `scripts/start.sh`    | `scripts/start.ps1`    |
| Test Bot        | `scripts/test-bot.sh` | `scripts/test-bot.ps1` |

## Quick Start

### Linux

```bash
chmod +x *.sh scripts/*.sh
./setup-dashboard.sh
npm start
```

### Windows

```powershell
.\setup-dashboard.ps1
npm start
```

## Core Compatibility

### 100% Compatible Features

All Node.js code is cross-platform:

- ✅ WhatsApp connection
- ✅ All commands
- ✅ Web dashboard
- ✅ Database operations
- ✅ File operations
- ✅ Analytics
- ✅ Group management

### Platform-Specific

Only shell scripts differ:

- Linux: Bash scripts
- Windows: PowerShell scripts

## File Paths

### Cross-Platform Code

All JavaScript uses `path.join()`:

```javascript
const dataPath = path.join(process.cwd(), "data", "file.json");
// Works on both: C:\bot\data\file.json (Windows)
//                /home/user/bot/data/file.json (Linux)
```

### Path Separators

Automatically handled:

- Windows: `\` (backslash)
- Linux: `/` (forward slash)

## Service Management

### Linux (systemd)

```bash
sudo systemctl start whatsapp-bot
sudo systemctl enable whatsapp-bot
sudo systemctl status whatsapp-bot
```

### Windows (NSSM)

```powershell
nssm install WhatsAppBot
nssm start WhatsAppBot
nssm status WhatsAppBot
```

## Documentation

### Linux Users

- Main README.md
- All bash scripts
- `docs/deployment/` guides

### Windows Users

- [WINDOWS_README.md](../../WINDOWS_README.md)
- All PowerShell scripts
- [WINDOWS_COMPATIBILITY.md](WINDOWS_COMPATIBILITY.md)

## Development

### Testing on Both Platforms

1. Write cross-platform Node.js code
2. Use `path.join()` for paths
3. Test on both Linux and Windows
4. Create equivalent scripts for both

### Best Practices

- Use `path.join()` instead of string concatenation
- Use `process.platform` for platform detection
- Avoid platform-specific commands in Node.js
- Provide both `.sh` and `.ps1` scripts

## Migration

### Linux to Windows

1. Clone repository on Windows
2. Run `.\setup-dashboard.ps1`
3. Copy `.env` from Linux
4. Copy `data/` folder
5. Copy `auth_info/` folder
6. Run `npm start`

### Windows to Linux

1. Clone repository on Linux
2. Run `./setup-dashboard.sh`
3. Copy `.env` from Windows
4. Copy `data/` folder
5. Copy `auth_info/` folder
6. Run `npm start`

## Troubleshooting

### Linux Issues

- Check file permissions: `chmod +x *.sh`
- Check logs: `tail -f bot.log`
- Check service: `systemctl status whatsapp-bot`

### Windows Issues

- Enable scripts: `Set-ExecutionPolicy RemoteSigned`
- Check logs: `type bot.log`
- Check process: `Get-Process node`

## Performance

Both platforms have similar performance:

- Startup: 3-5 seconds
- Memory: 150-300 MB
- CPU: 1-5% idle
- Response: <100ms

## Conclusion

The bot is **fully cross-platform** with:

- ✅ Same features on both platforms
- ✅ Same performance
- ✅ Same configuration
- ✅ Platform-specific scripts provided
- ✅ Easy migration between platforms

Choose your platform and enjoy! 🎉
