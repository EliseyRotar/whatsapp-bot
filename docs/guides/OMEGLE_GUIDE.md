# 👥 Anonymous Chat (Omegle) Guide

Your bot now has an Omegle-style anonymous chat feature! Users can chat with random strangers anonymously.

## How It Works

The Omegle feature connects users of your bot randomly for anonymous one-on-one conversations. It works across ALL users who have your bot, so as more people use it, there will be more people to chat with!

## Commands

### .omegle

Shows help and current statistics (users waiting, active chats, total online)

### .omegle start

Start searching for a random stranger to chat with

- Adds you to the waiting queue
- Automatically pairs you when someone is available
- You'll be notified when connected

### .omegle stop

End your current chat session

- Shows chat statistics (duration, message count)
- Notifies your partner that you disconnected
- Removes you from queue if waiting

### .omegle skip

Skip current partner and find a new one

- Ends current chat
- Immediately searches for new partner
- Shows previous chat stats

### .omegle stats

View statistics

- Global: users waiting, active chats, total online
- Personal: current chat duration and message count

## Features

### Anonymous Messaging

- Your identity is completely anonymous
- Partner only sees "Stranger"
- No personal information shared

### Media Support

Messages forwarded include:

- Text messages
- Images (with captions)
- Videos (with captions)
- Audio messages
- Stickers

### Real-time Pairing

- Instant matching when users are available
- Queue system when no one is online
- Automatic notification when partner connects

### Chat Statistics

- Track chat duration
- Count messages sent
- View global user counts

## Usage Example

**User 1:**

```
You: .omegle start
Bot: 🔍 Searching for a stranger...
Bot: ✅ Stranger connected! You can now start chatting.

You: Hey! How are you?
[Message forwarded to User 2]

Stranger: Good! You?
[Received from User 2]

You: .omegle skip
Bot: ⏭️ Skipped! Previous chat: 45s, 3 messages
Bot: 🔍 Searching for a new stranger...
```

**User 2:**

```
You: .omegle start
Bot: ✅ Stranger connected! You can now start chatting.

Stranger: Hey! How are you?
[Received from User 1]

You: Good! You?
[Message forwarded to User 1]

Bot: 👋 Stranger has skipped!
Bot: Use .omegle start to find someone new!
```

## Rules & Guidelines

1. **Be Respectful** - Treat others with kindness
2. **No Spam** - Don't flood messages
3. **No Harassment** - Inappropriate behavior not tolerated
4. **Privacy** - Don't share personal information
5. **Consent** - Either person can end chat anytime

## Technical Details

### How Pairing Works

1. User sends `.omegle start`
2. Bot adds user to waiting queue
3. Bot checks if another user is waiting
4. If yes: pairs them immediately
5. If no: user waits until someone joins
6. Both users notified when connected

### Message Routing

- All non-command messages in private chat are forwarded to partner
- Commands (starting with `.`) are processed normally
- Media messages are downloaded and re-uploaded to partner
- Messages are NOT stored or logged

### Session Management

- Each chat session is independent
- Sessions end when either user stops/skips
- No chat history is saved
- New session = new anonymous partner

## Privacy & Security

✅ **What we DO:**

- Pair users randomly
- Forward messages between partners
- Track basic stats (duration, count)

❌ **What we DON'T:**

- Store chat messages
- Log conversation content
- Share user identities
- Keep chat history

## Troubleshooting

**No one connecting?**

- Not many users online yet
- Share the bot with friends to grow the user base
- Try again during peak hours

**Messages not forwarding?**

- Make sure you're in private chat (not group)
- Check that you're connected (`.omegle stats`)
- Try `.omegle stop` and `.omegle start` again

**Want to end chat?**

- Use `.omegle stop` to disconnect
- Use `.omegle skip` to find new partner
- Both commands work anytime

**Stuck in queue?**

- Use `.omegle stop` to cancel search
- Wait a bit and try `.omegle start` again

## Growing Your Omegle Community

The more people use your bot, the better the Omegle experience!

**Tips to grow:**

- Share bot with friends
- Post in WhatsApp groups
- Encourage users to invite others
- Promote the anonymous chat feature

**Network effect:**

- 10 users = 5 possible chats
- 100 users = 50 possible chats
- 1000 users = 500 possible chats

The feature works best with an active user base!

## Future Enhancements

Possible additions:

- Interest tags (match by interests)
- Language preferences
- Report/block system
- Chat ratings
- Common interests detection

Enjoy anonymous chatting! 👥
