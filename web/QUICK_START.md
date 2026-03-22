# Quick Start - WhatsApp Bot Dashboard

Get your dashboard running in 3 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure

Create or update your `.env` file:

```env
# Add these lines to your .env file
WEB_PORT=3000
WEB_PASSWORD=admin123
JWT_SECRET=change-this-to-a-random-secret-key
```

**⚠️ Important**: Change `WEB_PASSWORD` and `JWT_SECRET` to secure values!

## Step 3: Start

```bash
npm start
```

The dashboard will automatically start with your bot!

## Step 4: Access

Open your browser:

```
http://localhost:3000
```

**Login with:**

- Username: `admin`
- Password: `admin123` (or your WEB_PASSWORD value)

## That's it! 🎉

You should now see:

- ✅ Bot status and connection info
- ✅ Real-time message feed
- ✅ Analytics and statistics
- ✅ Group management
- ✅ Command overview

## Next Steps

1. **Secure your dashboard**: Change the default password in `.env`
2. **Explore features**: Navigate through all pages
3. **Customize**: Edit colors and branding in `web/public/css/main.css`
4. **Deploy**: Set up HTTPS and reverse proxy for production

## Troubleshooting

### Dashboard not loading?

```bash
# Check if port 3000 is available
lsof -i :3000

# Try a different port
WEB_PORT=3001 npm start
```

### Can't login?

1. Check `.env` file has `WEB_PASSWORD` set
2. Try default password: `admin123`
3. Clear browser cache and try again

### WebSocket not connecting?

1. Check browser console for errors
2. Refresh the page
3. Restart the bot

## Need Help?

- 📖 Read full documentation: `DASHBOARD_SETUP.md`
- 🔧 Check configuration: `.env` file
- 📝 View logs: Terminal output

## Features Overview

### Dashboard Page

- Bot status (online/offline)
- Real-time statistics
- Activity charts
- Recent messages

### Messages Page

- View all messages
- Filter by chat/group
- Message history

### Groups Page

- All groups list
- Member counts
- Group statistics

### Analytics Page

- Detailed analytics (coming soon)
- Usage trends
- Performance metrics

### Commands Page

- All available commands
- Usage statistics
- Command categories

### Settings Page

- Bot configuration
- Theme switcher
- Bot control

## Keyboard Shortcuts

- `Ctrl/Cmd + K` - Search (coming soon)
- `Ctrl/Cmd + /` - Toggle sidebar
- `Esc` - Close modals

## Mobile Access

The dashboard is fully responsive! Access from:

- 📱 Phone (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)

## Production Deployment

For production use:

1. **Set strong passwords**:

```env
WEB_PASSWORD=your-very-secure-password-here
JWT_SECRET=a-long-random-string-at-least-32-characters
```

2. **Enable HTTPS** (use nginx/Apache reverse proxy)

3. **Set up firewall** (only allow necessary ports)

4. **Regular backups** (database and configuration)

5. **Monitor logs** (check for suspicious activity)

## Support

Having issues? Check:

1. Terminal output for errors
2. Browser console (F12)
3. `.env` configuration
4. Port availability

---

**Enjoy your new dashboard!** 🚀
