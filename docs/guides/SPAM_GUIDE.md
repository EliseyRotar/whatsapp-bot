# Spam Feature Guide

## Overview

The spam command allows you to send multiple messages rapidly. This is an OWNER-ONLY command.

## Usage

### Basic Spam

```
.spam <count> <message>
```

Example:

```
.spam 10 Hello everyone!
```

This sends "Hello everyone!" 10 times with default delay (1000ms).

### Spam with Custom Delay

```
.spam <count> <delay_ms> <message>
```

Example:

```
.spam 20 500 Fast spam!
```

This sends "Fast spam!" 20 times with 500ms delay between messages.

### Spam with Long Messages

```
.spam 5 This is a longer message that will be sent multiple times
```

## Configuration

Edit `config.js` to change spam settings:

```javascript
spamDelay: 1000,      // Default delay in milliseconds
maxSpamCount: 50,     // Maximum messages per spam command
```

## Examples

### Slow Spam (2 seconds delay)

```
.spam 10 2000 Slow message
```

### Fast Spam (100ms delay)

```
.spam 30 100 Fast!
```

### Maximum Spam

```
.spam 50 Quick spam
```

### Announcement Spam

```
.spam 5 3000 🚨 IMPORTANT ANNOUNCEMENT 🚨
```

## Tips

1. Use reasonable delays to avoid being rate-limited
2. Don't spam too much or WhatsApp might ban you
3. Test with small counts first
4. Use in private chats or your own groups
5. Be respectful - spam can annoy people

## Rate Limiting

WhatsApp has rate limits. If you spam too fast:

- Messages might not send
- You might get temporarily banned
- Your account could be restricted

Recommended settings:

- Delay: 1000ms or higher
- Count: 20 or less
- Don't spam continuously

## Safety

⚠️ WARNING: Excessive spamming can result in:

- Temporary WhatsApp ban
- Permanent account ban
- Being kicked from groups
- Reports from users

Use responsibly!

## Advanced Usage

### Spam in Multiple Chats

The spam command works in:

- Private chats
- Group chats
- Your own chat (saved messages)

Just send the command in the chat where you want to spam.

### Stopping Spam

If spam is running and you want to stop it:

- Restart the bot
- The spam will complete its cycle (can't be stopped mid-way)

### Spam with Mentions

```
.spam 5 Hello @393313444410
```

Note: Mentions in spam might not work properly. Use hidetag for group mentions.

## Alternatives to Spam

For group announcements, consider:

- `.tagall <message>` - Tag all members once
- `.hidetag <message>` - Hidden tag to all members
- Regular messages with important info

These are less annoying than spam!
