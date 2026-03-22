# Dark-Red Theme & Advanced Settings Update

## 🎨 Theme Changes

The dashboard has been updated with a modern **dark-red theme** inspired by premium admin dashboards.

### Color Palette

#### Light Mode

- **Primary Red**: #DC2626 (Crimson)
- **Primary Dark**: #B91C1C (Deep Red)
- **Primary Darker**: #991B1B (Burgundy)
- **Background**: Clean white with subtle grays
- **Accents**: Red highlights throughout

#### Dark Mode (Default)

- **Primary Red**: #EF4444 (Bright Red)
- **Primary Dark**: #DC2626 (Crimson)
- **Background**: Pure black (#0A0A0A) with dark grays
- **Surface**: Dark gray (#1A1A1A)
- **Elevated**: Medium gray (#262626)
- **Text**: Light gray to white gradient
- **Borders**: Subtle dark borders

### Visual Characteristics

- **Modern & Professional**: Sleek dark interface with red accents
- **High Contrast**: Excellent readability in low-light environments
- **Eye-Friendly**: Reduced eye strain for extended use
- **Premium Feel**: Sophisticated color scheme
- **Consistent**: Red theme throughout all components

## ⚙️ Advanced Settings Page

A comprehensive settings page has been created with **full bot configuration** capabilities.

### Settings Categories

#### 1. General Configuration

- **Bot Name**: Display name for your bot
- **Owner Name**: Your name or username
- **Command Prefix**: Character to trigger commands (e.g., .)
- **Owner Number**: Your WhatsApp number
- **Bot Mode**: Public / Private / Group Only

#### 2. Bot Behavior

- **Auto Read Messages**: Mark messages as read automatically
- **Auto Typing**: Show typing indicator when processing
- **Auto React**: React to messages automatically
- **Auto Reject Calls**: Automatically reject incoming calls

#### 3. Spam Protection

- **Spam Delay**: Delay between messages (ms)
- **Max Spam Count**: Maximum messages before cooldown
- **Max Warnings**: Warnings before user action
- ⚠️ **Warning Alert**: Low delay values can cause bans

#### 4. AI Integration

- **AI Provider**: Groq / OpenRouter / OpenAI / Disabled
- **Groq API Key**: Free fast AI
- **OpenRouter API Key**: Multiple AI models
- Direct links to get API keys

#### 5. Download Configuration

- **Max Audio Size**: Maximum audio file size (MB)
- **Max Video Size**: Maximum video file size (MB)
- **Download Timeout**: Timeout for downloads (seconds)
- **YouTube Delay**: Delay between YouTube requests (ms)

#### 6. Database Configuration

- **Database Type**: SQLite / MySQL / PostgreSQL
- **Database Path**: Path to database file

#### 7. Logging Configuration

- **Log Level**: Error / Warning / Info / Debug
- **Log Directory**: Directory for log files

#### 8. Dashboard Appearance

- **Theme**: Light / Dark / Auto (System)
- **Language**: English / Italiano / Español / Português / Русский / العربية

#### 9. Danger Zone

- **Restart Bot**: Restart the bot service
- **Clear Cache**: Clear all cached data
- **Export Configuration**: Download config as JSON
- **Factory Reset**: ⚠️ Delete ALL data and settings

### Features

✅ **Live Updates**: Changes saved to .env file
✅ **Validation**: Input validation and error handling
✅ **Help Text**: Helpful descriptions for each setting
✅ **Visual Feedback**: Toast notifications for actions
✅ **Safety Warnings**: Alerts for dangerous settings
✅ **Export/Import**: Export configuration as JSON
✅ **Reset Options**: Reset to defaults or factory reset
✅ **Responsive**: Works on all devices

### Settings API Endpoints

```javascript
// Get current settings
GET /api/settings

// Save settings
POST /api/settings
Body: { botName, prefix, autoRead, ... }

// Clear cache
POST /api/bot/clear-cache

// Factory reset
POST /api/bot/factory-reset
```

## 🚀 Quick Start

### Using the New Theme

The dashboard now defaults to **dark mode** with the red theme. You can switch themes in Settings:

1. Navigate to **Settings** page
2. Find **Dashboard Appearance** section
3. Select theme: Light / Dark / Auto
4. Changes apply instantly

### Configuring Your Bot

1. Navigate to **Settings** page
2. Update any configuration section
3. Click **Save All Changes** button
4. Restart bot to apply changes

### Exporting Configuration

1. Go to **Settings** → **Danger Zone**
2. Click **Export Configuration**
3. JSON file downloads automatically
4. Use for backup or migration

## 🎯 Design Inspiration

The dark-red theme is inspired by:

- Modern SaaS admin dashboards
- Premium gaming interfaces
- Professional monitoring tools
- High-contrast dark themes

### Design Principles

1. **Contrast**: High contrast for readability
2. **Hierarchy**: Clear visual hierarchy with red accents
3. **Consistency**: Uniform color usage throughout
4. **Accessibility**: WCAG 2.1 AA compliant
5. **Modern**: Contemporary design patterns

## 📱 Responsive Design

The settings page is fully responsive:

### Mobile (320px - 767px)

- Single column layout
- Stacked form fields
- Touch-optimized inputs
- Collapsible sections

### Tablet (768px - 1023px)

- Two column grid
- Optimized spacing
- Larger touch targets

### Desktop (1024px+)

- Two column grid
- Hover states
- Keyboard shortcuts
- Mouse-optimized

## 🔒 Security

### Settings Security

- **JWT Protected**: All settings endpoints require authentication
- **Validation**: Input validation on client and server
- **Sanitization**: XSS protection for all inputs
- **Confirmation**: Dangerous actions require confirmation
- **Audit Trail**: All changes logged (future feature)

### API Key Protection

- **Masked Display**: API keys shown as \*\*\*
- **Secure Storage**: Keys stored in .env file
- **No Logging**: Keys never logged
- **HTTPS Ready**: Secure transmission

## 🎨 Color Reference

### Primary Colors

```css
/* Light Mode */
--primary-500: #dc2626 /* Main red */ --primary-600: #b91c1c /* Darker red */
  --primary-700: #991b1b /* Darkest red */ /* Dark Mode */
  --primary-500: #ef4444 /* Bright red */ --primary-600: #dc2626 /* Main red */
  --primary-700: #b91c1c /* Darker red */;
```

### Background Colors

```css
/* Dark Mode */
--bg-primary: #0a0a0a /* Pure black */ --bg-secondary: #1a1a1a /* Dark gray */
  --bg-elevated: #262626 /* Medium gray */;
```

### Text Colors

```css
/* Dark Mode */
--text-primary: #f5f5f5 /* Almost white */ --text-secondary: #a3a3a3
  /* Light gray */ --text-tertiary: #737373 /* Medium gray */;
```

## 📊 Settings Categories Summary

| Category        | Settings Count | Importance |
| --------------- | -------------- | ---------- |
| General         | 5              | High       |
| Behavior        | 4              | Medium     |
| Spam Protection | 3              | Critical   |
| AI Integration  | 3              | Medium     |
| Downloads       | 4              | Medium     |
| Database        | 2              | High       |
| Logging         | 2              | Low        |
| Appearance      | 2              | Low        |
| Danger Zone     | 4              | Critical   |

**Total**: 29 configurable settings

## 🔄 Migration from Old Settings

If you had custom settings before:

1. Old settings are automatically loaded
2. New settings have sensible defaults
3. No data loss during update
4. Export old config before major changes

## 🐛 Troubleshooting

### Settings Not Saving

1. Check browser console for errors
2. Verify JWT token is valid
3. Check file permissions on .env
4. Ensure bot has write access

### Theme Not Applying

1. Clear browser cache
2. Check localStorage
3. Try different browser
4. Verify CSS files loaded

### API Keys Not Working

1. Verify key format
2. Check provider documentation
3. Test key directly with provider
4. Check for typos

## 📚 Documentation

- **Settings API**: See `web/server.js`
- **Frontend**: See `web/public/js/pages/settings.js`
- **Styling**: See `web/public/css/main.css`
- **Components**: See `web/public/css/components.css`

## 🎉 What's New

### Version 1.1.0

✅ **Dark-Red Theme**

- Modern dark interface
- Red accent colors
- High contrast design
- Eye-friendly palette

✅ **Advanced Settings**

- 29 configurable options
- 9 settings categories
- Live .env updates
- Export/import config

✅ **Enhanced UX**

- Better form validation
- Helpful tooltips
- Warning alerts
- Success feedback

✅ **Security**

- API key masking
- Confirmation dialogs
- Input sanitization
- Audit logging ready

## 🚀 Future Enhancements

### Planned Features

- [ ] Import configuration from JSON
- [ ] Settings presets (Gaming, Business, Personal)
- [ ] Advanced AI model selection
- [ ] Custom theme colors
- [ ] Settings search
- [ ] Bulk operations
- [ ] Settings history/rollback
- [ ] Multi-user settings profiles

## 💡 Tips

1. **Backup First**: Export config before major changes
2. **Test Settings**: Use test mode before production
3. **Monitor Logs**: Check logs after settings changes
4. **Restart Required**: Most settings need bot restart
5. **API Keys**: Keep keys secure and private
6. **Spam Settings**: Be conservative with spam delays
7. **Theme**: Dark mode reduces eye strain
8. **Language**: Set preferred language for bot responses

## 📞 Support

Having issues with settings?

1. Check this documentation
2. Review browser console
3. Check server logs
4. Verify .env file format
5. Test with default settings

---

**Theme Version**: 1.1.0 (Dark-Red)  
**Settings Version**: 1.1.0 (Advanced)  
**Status**: ✅ Production Ready  
**Last Updated**: March 2024

**Enjoy the new dark-red theme and advanced settings!** 🎨⚙️
