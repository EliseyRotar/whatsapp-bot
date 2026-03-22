# 🚀 Quick Reference Card

## Dashboard Access

```bash
# Start
npm start

# Access
http://localhost:3000

# Login
Username: admin
Password: admin123 (or WEB_PASSWORD from .env)
```

## Theme

**Default**: Dark mode with red accents  
**Colors**: Crimson red (#DC2626), Pure black (#0A0A0A)  
**Switch**: Settings → Dashboard Appearance → Theme

## Settings Categories

| Category      | Key Settings                       |
| ------------- | ---------------------------------- |
| 🤖 General    | Bot name, prefix, mode             |
| ⚡ Behavior   | Auto-read, auto-typing, auto-react |
| 🛡️ Spam       | Delay (3000ms), max count (50)     |
| 🤖 AI         | Provider, API keys                 |
| 📥 Downloads  | Max sizes, timeout                 |
| 💾 Database   | Type, path                         |
| 📝 Logging    | Level, directory                   |
| 🎨 Appearance | Theme, language                    |
| ⚠️ Danger     | Restart, reset, export             |

## Quick Actions

```bash
# Save Settings
Settings → Save All Changes

# Export Config
Settings → Danger Zone → Export Configuration

# Restart Bot
Settings → Danger Zone → Restart Bot

# Change Theme
Settings → Appearance → Theme → Dark/Light/Auto
```

## API Endpoints

```javascript
// Auth
POST / api / auth / login;

// Settings
GET / api / settings;
POST / api / settings;

// Bot Control
GET / api / bot / status;
POST / api / bot / restart;
POST / api / bot / clear - cache;

// Data
GET / api / messages;
GET / api / groups;
GET / api / analytics / metrics;
GET / api / commands;
```

## Color Reference

```css
/* Primary Red */
--primary-500: #ef4444 /* Bright red (dark mode) */ --primary-600: #dc2626
  /* Crimson */ --primary-700: #b91c1c /* Deep red */
  /* Backgrounds (Dark Mode) */ --bg-primary: #0a0a0a /* Pure black */
  --bg-secondary: #1a1a1a /* Dark gray */ --bg-elevated: #262626
  /* Medium gray */ /* Text (Dark Mode) */ --text-primary: #f5f5f5
  /* Almost white */ --text-secondary: #a3a3a3 /* Light gray */
  --text-tertiary: #737373 /* Medium gray */;
```

## Keyboard Shortcuts

| Key            | Action               |
| -------------- | -------------------- |
| `Ctrl/Cmd + K` | Search (coming soon) |
| `Ctrl/Cmd + /` | Toggle sidebar       |
| `Esc`          | Close modals         |
| `Tab`          | Navigate forms       |

## File Locations

```
web/
├── public/
│   ├── css/main.css          # Theme colors
│   ├── js/pages/settings.js  # Settings page
│   └── index.html            # Main HTML
├── server.js                 # Backend API
└── README.md                 # Documentation

.env                          # Configuration
config.js                     # Bot config
```

## Common Tasks

### Change Bot Name

```
Settings → General → Bot Name → Save
```

### Enable Auto-Read

```
Settings → Behavior → Auto Read Messages → ON → Save
```

### Add AI Key

```
Settings → AI Integration → Groq API Key → Paste → Save
```

### Export Backup

```
Settings → Danger Zone → Export Configuration
```

### Switch Theme

```
Settings → Appearance → Theme → Dark/Light
```

## Troubleshooting

| Issue               | Solution                    |
| ------------------- | --------------------------- |
| Can't login         | Check WEB_PASSWORD in .env  |
| Theme not applying  | Clear cache (Ctrl+Shift+R)  |
| Settings not saving | Check .env file permissions |
| WebSocket error     | Restart bot                 |
| API key not working | Verify key format           |

## Important Notes

⚠️ **Spam Delay**: Keep above 3000ms to avoid bans  
⚠️ **API Keys**: Never share or commit to git  
⚠️ **Factory Reset**: Deletes ALL data  
⚠️ **Restart Required**: Most settings need bot restart  
⚠️ **Backup**: Export config before major changes

## Support

📖 **Documentation**: See DASHBOARD_SETUP.md  
🎨 **Theme Guide**: See DARK_RED_THEME_UPDATE.md  
📋 **Features**: See web/FEATURES.md  
🐛 **Issues**: Check browser console & server logs

## Version Info

**Dashboard**: v1.1.0  
**Theme**: Dark-Red Professional  
**Settings**: 29 options  
**Status**: ✅ Production Ready

---

**Quick Start**: `npm start` → `http://localhost:3000` → Login → Enjoy! 🚀
