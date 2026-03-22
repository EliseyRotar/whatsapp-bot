# .vv Command Guide - View Once Messages

## How to Use

1. Someone sends you a view-once photo or video
2. Reply to that message
3. Type `.vv`
4. Bot reveals the media!

## Testing

### Step 1: Get a View-Once Message

- Have someone send you a view-once photo
- OR send yourself one from another phone

### Step 2: Reply with .vv

- Long press the view-once message
- Select "Reply"
- Type: `.vv`
- Send

### Step 3: Check Logs

The bot will show debug info:

```
[VV] Quoted message type: viewOnceMessage
[VV] View-once message found
[VV] Message content type: imageMessage
[VV] Downloading image...
[VV] Sending image...
[VV] Image sent successfully
```

## Troubleshooting

### "This is not a view-once message"

The bot will now show you what type of message it detected.

**Try these:**

1. **Use .debug command** (owner only):

   ```
   Reply to the view-once message
   Type: .debug
   ```

   This shows detailed info about the message.

2. **Try .vv2 command** (alternative version):

   ```
   Reply to the view-once message
   Type: .vv2
   ```

   This uses a different method to detect view-once.

3. **Check the message hasn't expired**:
   - View-once messages may expire after being viewed
   - Try with a fresh view-once message

### "Failed to download"

Possible causes:

- Message expired
- Network issue
- WhatsApp changed the format

**Solutions:**

- Try with a fresh view-once message
- Check internet connection
- Restart the bot

## Commands Available

### .vv (main command)

```
Reply to view-once message
Type: .vv
```

### .vv2 (alternative)

```
Reply to view-once message
Type: .vv2
```

### .debug (owner only)

```
Reply to any message
Type: .debug
Shows detailed message structure
```

## How It Works

1. Bot detects the quoted message
2. Checks if it's a view-once message (v1, v2, or v2ext)
3. Extracts the media (image or video)
4. Downloads it
5. Sends it as a normal message

## Important Notes

⚠️ **Privacy Warning:**

- Use this responsibly
- Respect people's privacy
- View-once messages are meant to be temporary

⚠️ **Limitations:**

- May not work if message expired
- WhatsApp may change the format
- Some view-once messages may be protected

## Debug Output

When you use `.vv`, you'll see logs like:

**Success:**

```
[VV] Quoted message type: viewOnceMessage
[VV] View-once message found
[VV] Message content type: imageMessage
[VV] Downloading image...
[VV] Sending image...
[VV] Image sent successfully
```

**Not View-Once:**

```
[VV] Quoted message type: imageMessage
❌ This is not a view-once message.
Message type: imageMessage
```

**Error:**

```
[VV] Error revealing view-once: [error details]
❌ Failed to reveal view-once message.
```

## Testing Steps

1. **Start the bot:**

   ```bash
   npm start
   ```

2. **Send yourself a view-once photo** (from another phone or have someone send you one)

3. **Reply to it with `.vv`**

4. **Check the terminal** for debug logs

5. **If it doesn't work:**
   - Try `.debug` to see message structure
   - Try `.vv2` as alternative
   - Check logs for error details

## Example Session

```
You: (receive view-once photo)
You: .vv (reply to it)

Terminal shows:
[CMD] Command: vv
[VV] Quoted message type: viewOnceMessage
[VV] View-once message found
[VV] Message content type: imageMessage
[VV] Downloading image...
[VV] Sending image...
[VV] Image sent successfully

Bot sends: 👁️ View-once image revealed!
(with the image)
```

## If Still Not Working

1. Check the terminal logs
2. Use `.debug` command to see message structure
3. Try `.vv2` alternative command
4. Make sure it's actually a view-once message
5. Try with a fresh view-once message

The improved version now shows detailed error messages and debug info to help identify the issue!
