# Setup Wizard Implementation

## Overview

Added a comprehensive setup wizard to the web dashboard that guides users through the initial bot connection process.

## Features

### 3-Step Setup Process

#### Step 1: Connect WhatsApp

- Displays QR code for WhatsApp scanning
- Real-time QR code updates via WebSocket
- Connection status indicator
- Step-by-step instructions for scanning
- Auto-advances when connection is detected

#### Step 2: Verify Connection

- Shows connected phone number
- Displays device name
- Confirms connection status
- Session saved notification

#### Step 3: Complete Setup

- Feature overview cards:
  - Send Commands
  - Add to Groups
  - Monitor Activity
  - Configure Settings
- Quick links to main dashboard sections
- Marks setup as complete in localStorage

## Technical Implementation

### Files Created

- `web/public/js/pages/setup.js` - Setup wizard page component
- `web/public/css/setup.css` - Setup wizard styles

### Files Modified

- `web/public/js/app.js` - Added setup route and first-time check
- `web/public/index.html` - Added setup.css link
- `web/server.js` - Added QRCode import and data URL conversion

### Key Features

#### Smart Setup Detection

```javascript
// Check if setup is needed on first login
const setupComplete = localStorage.getItem("setupComplete");
if (!setupComplete) {
  // Check bot status
  if (status.status !== "online") {
    // Show setup wizard
    this.router.navigate("#setup");
  }
}
```

#### QR Code Generation

- Server converts QR string to data URL using `qrcode` package
- QR code emitted via WebSocket (`qr:code` event)
- Real-time updates when new QR codes are generated

#### Auto-Progression

- Polls bot status every 2 seconds
- Automatically advances to step 2 when connection detected
- Stops polling when setup is complete

#### WebSocket Integration

- Listens for `bot:status` events
- Listens for `qr:code` events
- Real-time connection status updates

## User Flow

1. User logs in for the first time
2. App checks if `setupComplete` flag exists
3. If not, checks bot connection status
4. If bot not connected, redirects to `#setup`
5. User scans QR code on Step 1
6. Auto-advances to Step 2 when connected
7. User verifies connection details
8. User completes setup on Step 3
9. `setupComplete` flag set in localStorage
10. User redirected to dashboard

## Styling

### Design Features

- Modern, clean interface
- Progress bar with step indicators
- Animated transitions between steps
- Responsive design for mobile
- Status badges with pulse animations
- Feature cards with hover effects
- Consistent with dashboard theme

### Responsive Breakpoints

- Desktop: Full-width cards, 2-column feature grid
- Mobile: Single column, smaller QR codes, compact layout

## API Endpoints Used

### GET `/api/bot/qr`

Returns QR code data URL or connection status

```json
{
  "qr": "data:image/png;base64,...",
  "status": "waiting"
}
```

### GET `/api/bot/status`

Returns current bot connection status

```json
{
  "status": "online",
  "phoneNumber": "1234567890",
  "deviceName": "My Phone"
}
```

## WebSocket Events

### Emitted by Server

- `qr:code` - New QR code generated
- `bot:status` - Bot connection status changed

### Listened by Client

- `qr:code` - Updates QR code display
- `bot:status` - Auto-advances setup steps

## Skip Setup Option

Users can skip the setup wizard if they want to connect later:

- "Skip Setup" button available on all steps
- Confirmation dialog before skipping
- Can return to setup later if needed

## Future Enhancements

- [ ] Add setup progress persistence (resume if interrupted)
- [ ] Add troubleshooting tips for connection issues
- [ ] Add video tutorial or animated guide
- [ ] Add multi-language support
- [ ] Add setup completion celebration animation
- [ ] Add option to test bot commands during setup

## Testing Checklist

- [x] QR code displays correctly
- [x] QR code updates in real-time
- [x] Auto-advances when connected
- [x] Connection details display correctly
- [x] Quick links work properly
- [x] Skip setup works
- [x] Setup completion persists
- [x] Responsive on mobile
- [x] WebSocket events work
- [x] No console errors

## Notes

- Setup wizard only shows on first login or when bot is not connected
- Once `setupComplete` is set, wizard won't show again unless flag is cleared
- QR codes expire after ~60 seconds and are automatically refreshed
- Setup can be skipped but bot won't be functional until connected
