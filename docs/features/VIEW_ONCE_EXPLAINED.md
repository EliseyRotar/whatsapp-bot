# View-Once Messages - How It Works

## The Problem

WhatsApp has a limitation with view-once messages:

**When you reply to a view-once message, WhatsApp converts it to a regular image in the reply context.**

This means:

- The original view-once message is `viewOnceMessageV2`
- But when you reply to it, it becomes just `imageMessage`
- The bot can't access the view-once content after you interact with it

### What Your Logs Show:

```
[VV] Quoted message type: [ 'imageMessage' ]
```

This means WhatsApp already converted it to a regular image when you replied.

---

## The Solution: Auto-Save

Instead of trying to view it AFTER replying, the bot can save it BEFORE you open it!

### How to Use:

**Step 1: Enable Auto-Save**

```
.autovv on
```

**Step 2: Receive View-Once Messages**

- When someone sends you a view-once photo/video
- The bot automatically saves it BEFORE you open it
- You get a copy as a normal message

**Step 3: Done!**

- You can now open the original view-once message
- You also have the saved copy from the bot

---

## Commands

### .autovv on

Enable automatic view-once saving

```
.autovv on
```

### .autovv off

Disable automatic view-once saving

```
.autovv off
```

### .autovv

Check current status

```
.autovv
```

---

## How It Works

### Without Auto-Save:

```
1. You receive view-once photo
2. You reply with .vv
3. WhatsApp converts it to regular image
4. Bot can't access view-once content ❌
```

### With Auto-Save:

```
1. You receive view-once photo
2. Bot immediately saves it ✅
3. You get a copy as normal message
4. You can still open the original
```

---

## Example Usage

### Enable Auto-Save:

```
You: .autovv on
Bot: ✅ Auto View-Once enabled!
     Bot will now automatically save all view-once messages you receive.
```

### Receive View-Once:

```
Friend: (sends view-once photo)

Bot automatically:
[AUTO-VV] View-once message detected!
[AUTO-VV] Image saved!

Bot sends you: 👁️ Auto-saved view-once image
(with the image)
```

### Now You Have:

1. The original view-once message (still unopened)
2. A saved copy from the bot (normal message)

---

## Why .vv Doesn't Work

The `.vv` command tries to extract view-once content from a REPLIED message.

**The problem:**

- View-once messages lose their special properties when you reply to them
- WhatsApp API limitation, not a bot bug
- This is by design for privacy

**The logs show:**

```
[VV] Quoted message type: [ 'imageMessage' ]
```

This means it's already a regular image, not a view-once message anymore.

---

## Comparison

### .vv Command (doesn't work):

```
❌ Reply to view-once → Already converted → Can't access
```

### .autovv Command (works):

```
✅ Receive view-once → Bot saves immediately → Success!
```

---

## Technical Explanation

### View-Once Message Structure:

```javascript
{
  viewOnceMessageV2: {
    message: {
      imageMessage: { ... }
    }
  }
}
```

### After You Reply:

```javascript
{
  imageMessage: { ... }  // No longer view-once!
}
```

The `viewOnceMessageV2` wrapper is removed by WhatsApp when you interact with it.

---

## Best Practice

### For Automatic Saving:

```bash
# 1. Start bot
npm start

# 2. Enable auto-save
.autovv on

# 3. Receive view-once messages
# Bot automatically saves them!
```

### For Manual Saving:

Unfortunately, manual saving after receiving doesn't work due to WhatsApp's limitation.

You must enable auto-save BEFORE receiving the view-once message.

---

## Privacy Note

⚠️ **Use Responsibly:**

- View-once messages are meant to be temporary
- Saving them may violate the sender's expectations
- Use this feature ethically and respect privacy

---

## Summary

**Why .vv doesn't work:**

- WhatsApp converts view-once to regular image when you reply
- Bot can't access the original view-once content
- This is a WhatsApp API limitation

**Solution:**

- Use `.autovv on` to enable automatic saving
- Bot saves view-once messages BEFORE you open them
- You get a copy as a normal message

**Commands:**

- `.autovv on` - Enable auto-save
- `.autovv off` - Disable auto-save
- `.autovv` - Check status

Enable auto-save now and you'll never miss a view-once message again! 🎉
