# New Features Added

## 🎉 Latest Commands

### .vv - View Once Messages

**The feature you requested!**

View photos and videos sent as "view once" messages.

How to use:

1. Someone sends a view-once photo/video
2. Reply to that message
3. Type `.vv`
4. Bot sends it as a normal message you can view anytime

⚠️ Use responsibly and respect privacy!

---

### .sticker - Create Stickers

Convert any image or video to a WhatsApp sticker.

How to use:

1. Reply to an image or video
2. Type `.sticker`
3. Bot converts it to a sticker

---

### .delete or .del - Delete Messages

Delete any message in the group (admin only).

How to use:

1. Reply to the message you want to delete
2. Type `.delete` or `.del`
3. Message is deleted

---

### .jid - Get WhatsApp IDs

Get WhatsApp JID (unique ID) for users and chats.

Shows:

- Your JID
- Chat JID
- Quoted user JID (if replying)

Useful for debugging or advanced features.

---

### .tagnotadmin - Tag Non-Admins

Tag only regular members, excluding admins.

Example: `.tagnotadmin Please read the rules`

Great for announcements that only apply to members.

---

### .staff or .admins - List Admins

Show all group admins with their roles.

- 👑 = Super admin (group creator)
- ⭐ = Regular admin

---

### .groupinfo - Group Information

Display detailed group information:

- Group name and ID
- Member count
- Admin count
- Creation date
- Description

---

### .resetlink - Reset Invite Link

Generate a new group invite link.

- Old link becomes invalid
- New link is provided
- Bot must be admin

Useful if the old link was leaked or shared publicly.

---

### .broadcast or .bc - Broadcast Messages

**Owner only command**

Send a message to all groups the bot is in.

Example: `.broadcast Important update for everyone!`

Shows success/fail count after broadcasting.

---

## 🛡️ Enhanced Features

### Antilink Protection

Now automatically detects and deletes messages with links:

- HTTP/HTTPS links
- www. links
- WhatsApp group links (chat.whatsapp.com)

Only affects non-admin members.

Enable with: `.antilink on`

---

### Welcome/Goodbye Messages

Automatic messages when members join or leave.

- Welcome message when someone joins
- Goodbye message when someone leaves
- Mentions the user

Enable with: `.welcome on`

---

## 📝 Command Aliases

Some commands now have shortcuts:

- `.menu` = `.help`
- `.del` = `.delete`
- `.admins` = `.staff`
- `.bc` = `.broadcast`

---

## 🔧 Technical Improvements

### Session Persistence

- Session saved automatically
- No need to scan QR after restart
- Automatic reconnection on disconnect

### Better Error Handling

- Clear error messages
- Graceful failure handling
- Detailed logging

### Permission System

- Owner-only commands
- Admin-only commands
- Group-only commands
- Proper permission checks

---

## 📚 Documentation

New documentation files:

- `COMMANDS.md` - Complete command reference
- `SESSION_INFO.md` - Session management guide
- `NEW_FEATURES.md` - This file!

Updated documentation:

- `README.md` - Updated with new commands
- `START_HERE.md` - Quick start guide
- `GROUP_MANAGEMENT.md` - Group admin guide

---

## 🎯 Quick Examples

### View Once Messages

```
(Someone sends view-once photo)
Reply: .vv
(Bot sends it as normal photo)
```

### Create Stickers

```
(Send or forward an image)
Reply: .sticker
(Bot creates sticker)
```

### Delete Messages

```
(Someone sends spam)
Reply: .delete
(Message deleted)
```

### Broadcast

```
.broadcast Server maintenance tonight at 10 PM
(Sent to all groups)
```

### Group Management

```
.groupinfo
.staff
.resetlink
.tagnotadmin Please follow the rules
```

---

## 🚀 Coming Soon (Potential Features)

Want more features? You can add:

- AI commands (.gpt, .gemini)
- Download commands (.play, .video, .instagram)
- Image manipulation (.blur, .removebg)
- Fun commands (.joke, .quote, .meme)
- Game commands (.tictactoe, .trivia)

Just let me know what you want to add next!

---

## 💡 Tips

1. **VV Command**: Great for saving important view-once messages
2. **Sticker**: Make custom stickers from any image
3. **Delete**: Keep your group clean
4. **Broadcast**: Reach all your groups at once
5. **Tagnotadmin**: Useful for member-specific announcements
6. **Groupinfo**: Quick overview of group stats
7. **Resetlink**: Security feature if link is compromised

---

## ⚠️ Important Notes

- Use `.vv` responsibly - respect privacy
- Spam and broadcast can get you banned if overused
- Antilink affects non-admins only
- Bot needs admin rights for most admin commands
- Owner commands only work for +393313444410

---

Enjoy the new features! 🎉
