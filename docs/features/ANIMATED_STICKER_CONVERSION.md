# 🎬 Animated Sticker to GIF Conversion

## Overview

The `.image` command now supports converting animated stickers to animated GIFs! When you reply to an animated sticker with `.image`, the bot will automatically detect if it's animated and convert it accordingly.

## Features

- ✅ **Automatic Detection**: Detects if a sticker is animated or static
- ✅ **Static Stickers**: Converts to PNG/JPEG image
- ✅ **Animated Stickers**: Converts to GIF with animation preserved
- ✅ **Multi-language Support**: Works in all 7 supported languages
- ✅ **Fallback Support**: If FFmpeg fails, sends as animated WebP

## Usage

```
Reply to any sticker with: .image
```

### Examples

**Static Sticker:**

```
User: [Sends static sticker]
User: .image (as reply)
Bot: ⏳ Converting sticker...
Bot: ✅ Here's your image! [Sends PNG image]
```

**Animated Sticker:**

```
User: [Sends animated sticker]
User: .image (as reply)
Bot: ⏳ Converting animated sticker to GIF...
Bot: ✅ Here's your animated GIF! [Sends GIF]
```

## Requirements

### Optional: FFmpeg (Recommended)

For best results with animated stickers, install FFmpeg:

**Ubuntu/Debian:**

```bash
sudo apt update
sudo apt install ffmpeg
```

**macOS:**

```bash
brew install ffmpeg
```

**Windows:**
Download from [ffmpeg.org](https://ffmpeg.org/download.html) and add to PATH

### Fallback Mode

If FFmpeg is not installed, the bot will:

1. Try to convert using FFmpeg
2. If it fails, send the animated WebP directly as a video with GIF playback
3. WhatsApp will handle the playback

## Technical Details

### How It Works

1. **Download**: Downloads the sticker from WhatsApp
2. **Detection**: Uses Sharp to check if WebP has multiple frames
3. **Conversion**:
   - **Static**: Sends directly as image
   - **Animated**: Converts to GIF using FFmpeg (or sends as WebP video)
4. **Delivery**: Sends the converted media back to the chat

### File Formats

- **Input**: WebP (static or animated)
- **Output**:
  - Static → PNG/JPEG image
  - Animated → GIF or WebP video

### Performance

- Static conversion: ~100-200ms
- Animated conversion: ~500-1000ms (depends on frame count)
- Temporary files are automatically cleaned up

## Troubleshooting

### "Failed to convert sticker"

**Possible causes:**

1. FFmpeg not installed (animated stickers only)
2. Corrupted sticker file
3. Insufficient disk space

**Solutions:**

- Install FFmpeg for animated sticker support
- Try with a different sticker
- Check disk space in `temp/` directory

### Animated sticker shows as static image

**Cause:** FFmpeg not installed or failed

**Solution:**

- Install FFmpeg (see Requirements above)
- Bot will automatically use fallback mode (WebP video)

### Conversion is slow

**Cause:** Large animated stickers with many frames

**Solution:**

- This is normal for complex animations
- The bot will still complete the conversion
- Consider using smaller/simpler stickers

## Supported Languages

The command works in all supported languages:

- 🇬🇧 English
- 🇮🇹 Italian
- 🇷🇺 Russian
- 🇪🇸 Spanish
- 🇵🇹 Portuguese
- 🇸🇦 Arabic
- 🇮🇳 Hindi

## Command Aliases

You can use any of these:

- `.image`
- `.toimage`
- `.img`

## Notes

- The `temp/` directory is used for temporary file storage during conversion
- Files are automatically deleted after conversion
- The bot maintains the original aspect ratio and quality
- Maximum output size: 512x512 pixels (WhatsApp sticker standard)
