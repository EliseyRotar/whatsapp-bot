# 🎯 View-Once Commands - Fixed!

## What Was Broken

All view-once related commands were failing with:

```
❌ Failed: sock.downloadMediaMessage is not a function
```

## Root Cause

The commands were trying to use `sock.downloadMediaMessage()` which doesn't exist in Baileys. The correct method is to import `downloadMediaMessage` directly from the Baileys library.

## What Was Fixed

### 1. `.vv` Command

- ✅ Now imports `downloadMediaMessage` from Baileys
- ✅ Uses correct syntax: `downloadMediaMessage(msg, 'buffer', {})`
- ✅ Properly handles view-once images and videos
- ✅ Better error messages

### 2. `.vv2` Command

- ✅ Now imports `downloadMediaMessage` from Baileys
- ✅ Alternative method for stubborn view-once messages
- ✅ Same fix applied

### 3. `.sticker` Command

- ✅ Now imports `downloadMediaMessage` from Baileys
- ✅ Fixed media download for sticker creation
- ✅ Better error handling and user feedback

### 4. `.autovv` Auto-Save Feature

- ✅ Fixed in `messageHandler.js`
- ✅ Now correctly downloads view-once messages automatically
- ✅ Saves them before they're opened

## How to Use

### Manual View-Once Reveal

1. Receive a view-once photo/video
2. Reply to it with `.vv`
3. Bot will reveal the content

### Automatic View-Once Save

1. Enable: `.autovv on`
2. Receive a view-once photo/video
3. Bot automatically saves it before you open it
4. You get a copy even if you don't open the original

## Session Issue

You also have "Bad MAC" session errors. This is separate from the view-once fix.

### Quick Fix:

```bash
./fix-session.sh
```

Or manually:

```bash
# Stop bot (Ctrl+C)
rm -rf auth_info/
npm start
# Scan QR code
```

## Testing Checklist

After fixing session:

- [ ] `.ping` - Check bot responds
- [ ] `.alive` - Check bot status
- [ ] `.autovv on` - Enable auto-save
- [ ] Send view-once photo - Should auto-save
- [ ] Reply to view-once with `.vv` - Should reveal
- [ ] `.sticker` on image - Should create sticker

## Files Modified

1. `commands/general/vv.js` - Added Baileys import
2. `commands/general/vv2.js` - Added Baileys import
3. `commands/general/sticker.js` - Added Baileys import
4. `handlers/messageHandler.js` - Added Baileys import for auto-vv
5. `index.js` - Added downloadMediaMessage to imports

## Technical Details

**Before:**

```javascript
const buffer = await sock.downloadMediaMessage(msg);
```

**After:**

```javascript
import { downloadMediaMessage } from "@whiskeysockets/baileys";
// ...
const buffer = await downloadMediaMessage(msg, "buffer", {});
```

The Baileys library exports `downloadMediaMessage` as a standalone function, not as a method on the socket object.
