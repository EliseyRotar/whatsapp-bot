# 🌐 Web Monitoring Dashboard - Quick Setup

Your WhatsApp bot now has a comprehensive web monitoring dashboard!

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install the new web dependencies:

- `express` - Web server framework
- `socket.io` - Real-time bidirectional communication

### 2. Start the Bot

```bash
npm start
```

The bot will start AND the web dashboard will automatically launch on port 3000.

### 3. Open Dashboard

Open your browser and go to:

```
http://localhost:3000
```

## 📊 What You Can Monitor

### Real-Time Stats

- ✅ Total messages processed
- ✅ Total commands executed
- ✅ Active groups count
- ✅ Active users count
- ✅ Messages per minute rate
- ✅ Commands per minute rate
- ✅ Bot uptime
- ✅ Memory usage
- ✅ CPU usage

### Live Activity Feeds

- 📨 **Recent Messages** - Last 50 messages with sender info
- ⚡ **Recent Commands** - Last 50 commands with success/fail status
- 👥 **Active Groups** - All groups with participant counts
- 📊 **Command Stats** - Top 10 most used commands
- ⚠️ **Error Log** - Real-time error tracking

### Features

- 🔄 **Auto-refresh** - Updates every 5 seconds
- 🔴 **Live indicators** - Real-time status badges
- 📱 **Responsive** - Works on mobile and desktop
- 🎨 **Dark theme** - Easy on the eyes
- ⚡ **WebSocket** - Instant updates without page refresh

## 🎯 Dashboard Sections

### Header

Shows bot status (Online/Offline) with a pulsing indicator

### Stats Grid (6 cards)

1. Total Messages + rate per minute
2. Total Commands + rate per minute
3. Active Groups count
4. Active Users count
5. Bot Uptime (HH:MM:SS)
6. Memory Usage + CPU %

### Content Panels

1. **Recent Messages** - Scrollable feed of last 50 messages
2. **Recent Commands** - Command execution history
3. **Active Groups** - Group list with stats
4. **Command Statistics** - Usage analytics
5. **Error Log** - Full-width error tracking panel

## 🔧 Configuration

### Change Port

Set environment variable:

```bash
WEB_PORT=8080 npm start
```

### Run Separately

Start bot only:

```bash
node index.js
```

Start web dashboard only:

```bash
node web/server.js
```

## 📡 API Endpoints

The dashboard also provides REST API:

```bash
# Get bot status
curl http://localhost:3000/api/status

# Get statistics
curl http://localhost:3000/api/stats

# Get recent messages
curl http://localhost:3000/api/messages

# Get recent commands
curl http://localhost:3000/api/commands

# Get active groups
curl http://localhost:3000/api/groups

# Get command statistics
curl http://localhost:3000/api/command-stats

# Get error log
curl http://localhost:3000/api/errors

# Get system metrics
curl http://localhost:3000/api/system
```

## 🔐 Security Warning

⚠️ **IMPORTANT**: The dashboard has NO authentication by default!

### For Production:

1. Add authentication (basic auth, JWT, etc.)
2. Use HTTPS/SSL
3. Restrict access by IP whitelist
4. Use a reverse proxy (nginx, Apache)
5. Set strong firewall rules

### Quick IP Restriction (Express):

```javascript
// In web/server.js, add before routes:
app.use((req, res, next) => {
  const allowedIPs = ["127.0.0.1", "::1", "YOUR_IP"];
  if (allowedIPs.includes(req.ip)) {
    next();
  } else {
    res.status(403).send("Access denied");
  }
});
```

## 🎨 Customization

### Colors

Edit `web/public/style.css`:

```css
:root {
  --primary: #25d366; /* WhatsApp green */
  --danger: #dc3545; /* Red for errors */
  --success: #28a745; /* Green for success */
  /* ... more colors */
}
```

### Update Intervals

Edit `web/public/app.js`:

```javascript
// Change refresh rate (default: 5000ms)
setInterval(fetchStats, 5000);
```

### Data Retention

Edit `web/server.js`:

```javascript
// Keep more/less messages (default: 200)
if (monitoringData.recentMessages.length > 200) {
  monitoringData.recentMessages.shift();
}
```

## 📱 Mobile Access

Access from your phone on the same network:

1. Find your computer's local IP:

```bash
# Linux/Mac
ifconfig | grep "inet "

# Windows
ipconfig
```

2. Open on phone:

```
http://YOUR_LOCAL_IP:3000
```

Example: `http://192.168.1.100:3000`

## 🐛 Troubleshooting

### Dashboard won't load

- Check if port 3000 is available
- Try a different port: `WEB_PORT=8080 npm start`
- Check firewall settings
- Verify dependencies installed: `npm install`

### No real-time updates

- Check browser console (F12) for errors
- Verify WebSocket connection
- Check if Socket.IO is installed
- Try refreshing the page

### High memory usage

- Reduce data retention in `web/server.js`
- Restart the bot periodically
- Clear browser cache

### Can't access from other devices

- Check firewall allows port 3000
- Verify you're using local IP, not localhost
- Ensure devices are on same network

## 📊 Performance Tips

1. **Limit data retention** - Keep only what you need
2. **Use filters** - Add filtering to reduce data shown
3. **Pagination** - Implement pagination for large datasets
4. **Caching** - Cache API responses
5. **Compression** - Enable gzip compression

## 🔄 Updates

The monitoring system automatically tracks:

- ✅ Every message received
- ✅ Every command executed
- ✅ Every group interaction
- ✅ Every error that occurs
- ✅ System metrics every 5 seconds

No configuration needed - it just works!

## 📚 More Info

See `web/README.md` for detailed documentation.

## 🎉 Enjoy!

You now have a professional monitoring dashboard for your WhatsApp bot!

Monitor everything in real-time and keep track of your bot's performance.
