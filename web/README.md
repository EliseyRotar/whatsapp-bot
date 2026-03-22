# WhatsApp Bot Dashboard

A modern, responsive web dashboard for monitoring and managing your WhatsApp bot.

## Features

- **Real-time Monitoring**: Live bot status, messages, and metrics via WebSocket
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop (320px+)
- **Dark Mode**: Full light/dark theme support with system preference detection
- **Analytics**: Comprehensive bot analytics and usage statistics
- **Message Management**: View and manage bot messages
- **Group Management**: Monitor and configure group settings
- **Command Overview**: View all available bot commands
- **Settings**: Configure bot behavior and preferences

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Backend**: Node.js, Express.js
- **Real-time**: Socket.IO
- **Authentication**: JWT
- **Icons**: Lucide Icons
- **Fonts**: Inter (Google Fonts)

## Installation

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables in `.env`:

```env
WEB_PORT=3000
WEB_PASSWORD=your-secure-password
JWT_SECRET=your-jwt-secret
```

3. Start the dashboard:

```bash
npm run web
```

4. Access the dashboard at `http://localhost:3000`

## Default Credentials

- **Username**: `admin`
- **Password**: Value from `WEB_PASSWORD` in `.env` (default: `admin123`)

## Architecture

The dashboard follows a mobile-first, progressive enhancement approach:

- **Mobile**: 320px - 767px (Bottom navigation)
- **Tablet**: 768px - 1023px (Collapsible sidebar)
- **Desktop**: 1024px+ (Permanent sidebar)

### Performance Targets

- **LCP**: < 2.5s (Largest Contentful Paint)
- **INP**: < 100ms (Interaction to Next Paint)
- **CLS**: < 0.1 (Cumulative Layout Shift)
- **FPS**: 60fps animations

### Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly
- High contrast ratios (4.5:1 for text)
- Focus indicators
- Reduced motion support

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login with credentials

### Bot Management

- `GET /api/bot/status` - Get bot connection status
- `POST /api/bot/restart` - Restart the bot

### Messages

- `GET /api/messages` - Get messages (paginated)
- `GET /api/messages/recent` - Get recent messages

### Groups

- `GET /api/groups` - Get all groups

### Analytics

- `GET /api/analytics/metrics` - Get analytics metrics

### Commands

- `GET /api/commands` - Get all available commands

### System

- `GET /api/system/metrics` - Get system metrics

## WebSocket Events

### Client → Server

- `ping` - Keepalive ping

### Server → Client

- `bot:status` - Bot status updates
- `message:new` - New message received
- `message:deleted` - Message deleted
- `group:update` - Group information updated
- `metrics:update` - Analytics metrics updated
- `system:metrics` - System metrics updated
- `qr:code` - QR code for authentication

## Development

### File Structure

```
web/
├── public/
│   ├── css/
│   │   ├── main.css          # Core styles and design tokens
│   │   └── components.css    # Component styles
│   ├── js/
│   │   ├── app.js           # Main application
│   │   ├── router.js        # SPA router
│   │   ├── websocket.js     # WebSocket client
│   │   ├── ui.js            # UI utilities
│   │   ├── auth.js          # Authentication
│   │   └── pages/           # Page components
│   │       ├── dashboard.js
│   │       ├── messages.js
│   │       ├── groups.js
│   │       ├── analytics.js
│   │       ├── commands.js
│   │       └── settings.js
│   └── index.html           # Main HTML
├── server.js                # Express server
└── README.md
```

### Adding New Pages

1. Create a new page component in `public/js/pages/`:

```javascript
import { UI } from "../ui.js";
import { Auth } from "../auth.js";

export class MyPage {
  constructor(ws) {
    this.ws = ws;
    this.ui = new UI();
    this.auth = new Auth();
  }

  async render(container) {
    container.innerHTML = `
      <div class="my-page">
        <h1>My Page</h1>
      </div>
    `;
  }

  destroy() {
    // Cleanup
  }
}
```

2. Register the route in `app.js`:

```javascript
this.router.addRoute("mypage", async () => {
  const { MyPage } = await import("./pages/mypage.js");
  return new MyPage(this.ws);
});
```

3. Add navigation item in `index.html`:

```html
<a href="#mypage" class="nav-item" data-route="mypage">
  <i data-lucide="icon-name"></i>
  <span>My Page</span>
</a>
```

## Design System

### Colors

The dashboard uses a comprehensive color system with light and dark mode support:

- **Primary**: WhatsApp green (#25D366)
- **Success**: Green (#10B981)
- **Warning**: Orange (#F59E0B)
- **Error**: Red (#EF4444)
- **Info**: Blue (#3B82F6)

### Spacing Scale (8px base)

- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

### Typography

- **Font Family**: Inter (sans-serif)
- **Base Size**: 16px
- **Scale**: Modular scale (1.250 - major third)

## Browser Support

- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile browsers: iOS Safari 12+, Chrome Android

## Security

- JWT-based authentication
- HTTPS recommended for production
- CORS configuration
- Input validation
- XSS protection
- CSRF protection (implement in production)

## Production Deployment

1. Set strong passwords and secrets in `.env`
2. Enable HTTPS
3. Use a reverse proxy (nginx/Apache)
4. Enable rate limiting
5. Set up proper logging
6. Use Redis for session storage
7. Enable compression
8. Set security headers

## License

Same as the main bot project.

## Support

For issues and questions, please refer to the main project repository.
