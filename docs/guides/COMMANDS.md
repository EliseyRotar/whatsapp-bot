# Complete Command List

## 🌐 General Commands (Everyone)

### .help or .menu

Shows all available commands.

### .ping

Check bot latency and response time.

### .alive

Check if bot is online and show uptime.

### .vv

View once-view photos/videos.

- Reply to a view-once message
- Bot will send it as a normal message

Usage: Reply to view-once message and type `.vv`

### .sticker

Convert image or video to sticker.

- Reply to an image or video
- Bot converts it to a sticker

Usage: Reply to image/video and type `.sticker`

### .jid

Get WhatsApp JID (ID) of users and chats.

- Shows your JID
- Shows chat JID
- Shows quoted user JID (if replying)

### .trading <SYMBOL>

Analyze stock market and get trading signals.

- Real-time price data
- Technical indicators (RSI, MACD, SMA)
- Buy/Sell signals
- Auto Stop Loss and Take Profit (1:5 ratio)
- Trend prediction

Usage:

- `.trading AAPL` - Analyze Apple
- `.trading TSLA` - Analyze Tesla
- `.trading help` - Show detailed help

Aliases: `.trade`, `.stock`, `.market`

**⚠️ DISCLAIMER: Educational purposes only. Not financial advice!**

### .pay @user <amount>

Transfer coins to another user.

- Send coins to friends
- Help others get started
- Min: 10 coins | Max: 1,000,000 coins

Usage:

- `.pay @user 100` - Send 100 coins
- Reply to message and type `.pay 100`

Aliases: `.send`, `.transfer`

### .daily

Claim your daily coin reward!

- Base reward: 100 coins
- Streak bonus: +10 coins per day (max +200)
- Claim every 24 hours
- Keep your streak alive for bigger rewards

Usage:

- `.daily` - Claim your reward
- `.daily stats` - View your stats

Aliases: `.claim`, `.reward`

### .invite

Get the bot invite message and manage referrals.

- Share the bot with friends
- Earn 500 coins for every 3 referrals
- Track your referral stats

Usage:

- `.invite` - Get invite message
- `.invite stats` - View your referrals
- `.invite claim` - Claim referral rewards

Aliases: `.refer`, `.referral`

### .leaderboard [type]

View top players on the leaderboard!

- See who's dominating the games
- Multiple leaderboard types
- Top 10 players displayed

Usage:

- `.leaderboard` - Top by balance
- `.leaderboard wins` - Top by wins
- `.leaderboard winnings` - Top by total winnings
- `.leaderboard referrals` - Top by referrals

Aliases: `.lb`, `.top`, `.rank`

---

## 👮‍♂️ Admin Commands (Group Admins Only)

### .ban @user

Ban a user from the group.

- Tag user or reply to their message
- Bot must be admin

### .kick @user

Kick a user from the group (same as ban).

- Tag user or reply to their message
- Bot must be admin

### .promote @user

Promote a member to admin.

- Tag user or reply to their message
- Bot must be admin

### .demote @user

Demote an admin to member.

- Tag user or reply to their message
- Bot must be admin

### .mute <minutes>

Mute the group for specified minutes.

- Only admins can send messages
- Auto-unmutes after time expires
- Bot must be admin

Example: `.mute 30` (mutes for 30 minutes)

### .delete or .del

Delete a message.

- Reply to the message you want to delete
- Works for any message in the group

Usage: Reply to message and type `.delete`

### .tagall <message>

Tag all group members.

- Sends message with all members tagged
- Everyone gets notified

Example: `.tagall Meeting at 5 PM!`

### .tagnotadmin <message>

Tag only non-admin members.

- Tags regular members only
- Admins are not tagged

Example: `.tagnotadmin Please read the rules`

### .hidetag <message>

Send message with hidden tags.

- All members are mentioned
- Tags are not visible
- Everyone gets notified

Example: `.hidetag Important announcement`

### .antilink <on/off>

Toggle antilink protection.

- Automatically deletes messages with links
- Only affects non-admin members
- Bot must be admin to delete messages

Examples:

- `.antilink on` - Enable
- `.antilink off` - Disable
- `.antilink` - Check status

### .welcome <on/off>

Toggle welcome messages for new members.

Examples:

- `.welcome on` - Enable
- `.welcome off` - Disable
- `.welcome` - Check status

### .setgname <name>

Change group name.

- Bot must be admin

Example: `.setgname Cool Friends Group`

### .setgdesc <description>

Change group description.

- Bot must be admin

Example: `.setgdesc Welcome to our awesome group!`

### .resetlink

Reset group invite link.

- Generates new invite link
- Old link becomes invalid
- Bot must be admin

### .groupinfo

Show group information.

- Group name, ID
- Member count
- Admin count
- Creation date
- Description

### .staff or .admins

List all group admins.

- Shows all admins with their roles
- 👑 = Super admin
- ⭐ = Admin

---

## 🔒 Owner Commands (Bot Owner Only)

These commands only work for: +393313444410

### .mode <public/private>

Change bot mode.

- Public: Everyone can use the bot
- Private: Only owner can use the bot

Examples:

- `.mode public`
- `.mode private`

### .spam <count> <text>

Send multiple messages.

- Default delay: 1000ms (1 second)
- Max count: 50 messages

Example: `.spam 10 Hello World`

### .spam <count> <delay> <text>

Send multiple messages with custom delay.

- Delay in milliseconds
- Max count: 50 messages

Example: `.spam 20 500 Fast spam!`

### .broadcast <message> or .bc <message>

Broadcast message to all groups.

- Sends message to every group the bot is in
- Shows success/fail count

Example: `.broadcast Important update for all groups!`

---

## Command Features

### Aliases

Some commands have shortcuts:

- `.menu` = `.help`
- `.del` = `.delete`
- `.admins` = `.staff`
- `.bc` = `.broadcast`

### Reply-Based Commands

These commands work by replying to messages:

- `.vv` - Reply to view-once
- `.sticker` - Reply to image/video
- `.delete` - Reply to message to delete
- `.ban` / `.kick` - Reply to user's message
- `.promote` / `.demote` - Reply to user's message

### Tag-Based Commands

These commands work by tagging users:

- `.ban @user`
- `.kick @user`
- `.promote @user`
- `.demote @user`

You can either tag the user or reply to their message.

---

## Permission Levels

### 👤 Regular Member

- General commands only
- `.help`, `.ping`, `.alive`, `.vv`, `.sticker`, `.jid`

### 👮 Group Admin

- All member commands
- All admin commands
- Cannot use owner commands

### 👑 Bot Owner

- All commands
- Owner-only commands
- Full bot control

---

## Tips

1. **Antilink**: Enable in groups to prevent spam links
2. **Welcome**: Nice for greeting new members
3. **Hidetag**: Better than tagall for announcements
4. **Mute**: Useful during important announcements
5. **VV**: View once-view messages (be respectful!)
6. **Spam**: Use responsibly to avoid bans
7. **Broadcast**: Great for important updates

---

## Examples

### Setting Up a New Group

```
.setgname My Group
.setgdesc Welcome everyone!
.antilink on
.welcome on
.tagall Welcome! Please read the rules.
```

### Managing Members

```
.staff
.promote @goodmember
.ban @troublemaker
```

### Announcements

```
.mute 5
.hidetag 🚨 IMPORTANT: Meeting tomorrow at 3 PM
```

### Fun with Media

```
(Reply to image) .sticker
(Reply to view-once) .vv
```

### Owner Tasks

```
.mode private
.spam 5 Test message
.broadcast Update for all groups!
```
