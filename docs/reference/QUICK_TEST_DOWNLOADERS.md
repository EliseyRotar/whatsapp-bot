# Quick Test - Downloader Commands

## ✅ Command Loader Updated!

The `commands/index.js` file has been updated to include the YouTube MP3 downloader.

## How to Test

1. **Restart your bot** (Ctrl+C and run `npm start` again)

2. **Try these commands in WhatsApp:**

### Test 1: Search by song name

```
.ytmp3 shape of you
```

or

```
.song shape of you
```

or

```
.play despacito
```

or

```
.music believer
```

### Test 2: Direct YouTube URL

```
.ytmp3 https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

## Expected Behavior

1. Bot sends: "🔍 Searching for: _shape of you_..."
2. Bot sends: "⏳ Downloading audio..."
3. Bot sends the MP3 file with the song title
4. Temp files are automatically cleaned up

## If It Doesn't Work

### Check the logs for:

- "Song request: ..." - Confirms command was received
- "Found URL: ..." - Confirms YouTube search worked
- "Attempting download with yt-dlp..." - Shows download method
- "Audio ready: X.XXMB - Song Title" - Confirms file is ready
- "Audio sent successfully" - Confirms file was sent

### Common Issues:

1. **"No songs found"** - Try a different song name or use a direct URL
2. **"YouTube is blocking requests"** - Wait a few minutes and try again
3. **"Download failed"** - Check your internet connection
4. **File too large** - Try a shorter song (max 50MB)

## Available Commands

All these commands do the same thing (download YouTube audio):

- `.ytmp3 <query>`
- `.song <query>`
- `.play <query>`
- `.music <query>`

## Next Steps

Once this works, we can add:

- YouTube video downloader (.ytdl, .yt, .ytv)
- Instagram downloader (.ig, .insta)
- TikTok downloader (.tiktok, .tt)
- Twitter downloader (.twitter, .tw)
- And more!

## Debug Mode

To see detailed logs, add to your `.env`:

```env
YOUTUBE_DEBUG=true
```

Then restart the bot to see detailed download information.
