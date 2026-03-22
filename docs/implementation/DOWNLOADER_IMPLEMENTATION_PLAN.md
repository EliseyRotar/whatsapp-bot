# Downloader Implementation Plan

## Dependencies to Install

```bash
npm install yt-search @distube/ytdl-core youtube-dl-exec @distube/yt-dlp ffmpeg-static fluent-ffmpeg snapsave-downloader file-type axios
```

## Files to Create

### 1. Utility Files

- `utils/youtubeUtils.js` - YouTube anti-bot utilities (DONE - copied from other_bots)
- `utils/fileUtils.js` - File validation and management utilities
- `utils/memoryUtils.js` - Memory management for downloads

### 2. Downloader Commands

#### YouTube Downloaders

- `commands/downloaders/ytdl.js` - YouTube video downloader (.ytdl, .yt, .ytv)
- `commands/downloaders/ytmp3.js` - YouTube audio downloader (.ytmp3, .song, .play)
- `commands/downloaders/ytsearch.js` - YouTube search and download (.yts)

#### Social Media Downloaders

- `commands/downloaders/instagram.js` - Instagram downloader (.ig, .insta, .igdl)
- `commands/downloaders/tiktok.js` - TikTok downloader (.tiktok, .tt)
- `commands/downloaders/twitter.js` - Twitter/X downloader (.twitter, .tw, .x)
- `commands/downloaders/pinterest.js` - Pinterest downloader (.pin)
- `commands/downloaders/facebook.js` - Facebook downloader (.fb)

## Implementation Priority

### Phase 1: Core Infrastructure (CURRENT)

1. Install dependencies
2. Create utility files (youtubeUtils, fileUtils, memoryUtils)
3. Update command loader to include downloaders folder

### Phase 2: YouTube Downloaders

1. YouTube video downloader (.ytdl)
2. YouTube audio downloader (.ytmp3, .song)
3. YouTube search (.yts)

### Phase 3: Social Media Downloaders

1. Instagram (.ig, .insta)
2. TikTok (.tiktok, .tt)
3. Twitter (.twitter, .tw)
4. Pinterest (.pin)

### Phase 4: Testing & Optimization

1. Test all downloaders
2. Add error handling
3. Optimize file size limits
4. Add progress indicators

## Features from Other Bot

### YouTube Features

- Multiple download methods (yt-dlp, ytdl-core)
- Anti-bot detection with rotating user agents
- Retry logic with exponential backoff
- Quality selection (audio: highest, video: up to 1080p)
- File size validation (max 50MB audio, 60MB video)
- Duration limits (max 30 minutes)
- FFmpeg merging for audio+video

### Instagram Features

- Support for posts, reels, TV, stories
- Multiple media detection (carousel posts)
- Auto-detect image vs video
- Background removal integration

### General Features

- Temp file management
- Memory optimization
- Stream monitoring
- Progress tracking
- User-friendly error messages

## Configuration

Add to `.env`:

```env
# YouTube Download Configuration
YOUTUBE_DELAY_BETWEEN_REQUESTS=1000
YOUTUBE_MAX_RETRIES=3
YOUTUBE_RETRY_DELAY=2000
MAX_AUDIO_SIZE_MB=50
MAX_VIDEO_SIZE_MB=60
DOWNLOAD_TIMEOUT_SECONDS=600
YOUTUBE_DEBUG=false
ENABLE_USER_AGENT_ROTATION=true
FORCE_DISABLE_YTDLP=false

# Social Media APIs (Optional)
TWITTER_BEARER_TOKEN=your_token_here
PIN_KEY=your_pinterest_api_key
```

## Notes

- All downloaders respect WhatsApp file size limits
- Temp files are automatically cleaned up
- Anti-bot measures for YouTube
- Fallback methods if primary fails
- User-friendly error messages
- Support for multiple formats
