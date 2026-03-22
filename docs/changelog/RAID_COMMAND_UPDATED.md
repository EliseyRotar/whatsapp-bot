# 💀 .raid Command - Group Raid (Updated)

## ⚠️ WARNING ⚠️

This command is **DESTRUCTIVE** and **IRREVERSIBLE**. Use with caution!

## What It Does

The `.raid` command raids a group by:

1. **Changes group name** to "💀 RAIDED 💀"
2. **Changes group description** to raid message
3. **Demotes ALL admins** (except you, the owner)
4. **Spams 50 raid messages** to flood the chat
5. **Resets invite link** (old link becomes invalid)
6. **Locks group** (only admins can send messages)

## Changes from Original

✅ **REMOVED:** Member removal feature
✅ **ADDED:** Spam 50 messages feature

Members are NO LONGER removed - only admins are demoted and the group is spammed.

## Usage

### Step 1: Check What Will Happen

```
.raid
```

### Step 2: Confirm and Execute

```
.raid confirm
```

## Raid Sequence

```
1. Warning (3 second countdown)
2. Change group name
3. Change description
4. Demote all admins
5. Spam 50 messages (cycling through raid messages)
6. Reset invite link
7. Lock group
8. Final summary
```

## Spam Messages

The raid sends 50 messages cycling through:

- 💀 RAIDED 💀
- 🔥 GROUP UNDER ATTACK 🔥
- ⚡ RAID IN PROGRESS ⚡
- 💀 THIS GROUP IS RAIDED 💀
- 🔥 RAIDED BY ELI6S BOT 🔥
- ⚡ NO ESCAPE ⚡
- 💀 COMPLETE TAKEOVER 💀
- 🔥 RAID MODE ACTIVE 🔥
- ⚡ GROUP DESTROYED ⚡

Each with counter: `[1/50]`, `[2/50]`, etc.

## Example Output

```
🔥 RAID MODE ACTIVATED 🔥
Starting in 3 seconds...

✅ Group name changed
✅ Description changed
🔻 Demoting 3 admin(s)...
✅ All admins demoted
💀 Starting raid spam (50 messages)...
💀 RAIDED 💀 [1/50]
🔥 GROUP UNDER ATTACK 🔥 [2/50]
⚡ RAID IN PROGRESS ⚡ [3/50]
... (47 more messages)
✅ Spam complete (50 messages sent)
✅ Invite link reset
✅ Group locked

╔═══════════════════════╗
║   💀 RAID COMPLETE 💀   ║
╚═══════════════════════╝

🔥 Group Status:
• Name: Changed
• Description: Changed
• Admins: 3 demoted
• Spam: 50 messages sent
• Link: Reset
• Settings: Locked

⚡ Raided by eli6s bot
💀 This group is now under control
```

## Technical Details

### Spam Timing

- Uses `config.spamDelay` (default: 1000ms)
- 50 messages = ~50 seconds total
- Messages cycle through 10 different raid messages

### Rate Limiting

- 1 second delay between spam messages
- 0.5 second delay between admin demotions
- Prevents WhatsApp from blocking the bot

### Protected Users

- ✅ You (the owner)
- ✅ The bot itself
- ✅ Anyone with owner's JID

## Requirements

- ✅ Owner only
- ✅ Group only
- ✅ Bot must be admin
- ✅ Must type "confirm"

## Safety Features

1. **Confirmation required** - Must type `.raid confirm`
2. **Owner only** - Only bot owner can use
3. **Warning message** - Shows what will happen
4. **Error handling** - Each step has error handling
5. **Progress feedback** - Shows status of each action

## Use Cases

### Legitimate Uses:

- Raiding spam groups
- Taking over abandoned groups
- Testing bot capabilities
- Pranking friends (with permission!)

### DO NOT Use For:

- ❌ Raiding groups you don't own
- ❌ Harassing people
- ❌ Destroying active communities
- ❌ Malicious purposes

## Recovery

### Can You Undo It?

Partially. You can:

- ✅ Change name back: `.setgname <name>`
- ✅ Change description back: `.setgdesc <desc>`
- ✅ Re-promote admins: `.promote @user`
- ✅ Unlock group: Use WhatsApp settings
- ✅ Clear spam: Delete messages manually
- ❌ Old invite link is GONE forever

## Comparison: Old vs New

| Feature            | Old Version | New Version    |
| ------------------ | ----------- | -------------- |
| Change name        | ✅          | ✅             |
| Change description | ✅          | ✅             |
| Demote admins      | ✅          | ✅             |
| Remove members     | ✅          | ❌ REMOVED     |
| Spam messages      | ❌          | ✅ ADDED (50x) |
| Reset link         | ✅          | ✅             |
| Lock group         | ✅          | ✅             |

## Why Remove Member Removal?

- Less destructive
- Easier to recover from
- Still effective as a raid
- Members can witness the raid
- More of a "takeover" than "destruction"

## Why Add Spam?

- Floods the chat
- Makes the raid more visible
- Intimidation factor
- Classic raid behavior
- Can be cleared later

## Troubleshooting

**"Bot needs to be admin"**
→ Promote bot to admin first

**"Spam stopped mid-way"**
→ Rate limiting, check console

**"Failed to demote admins"**
→ Check bot permissions

## Testing

1. Create test group
2. Add test accounts
3. Make bot admin
4. Run: `.raid confirm`
5. Verify all features work

## Summary

The updated `.raid` command:

- ✅ Changes group settings
- ✅ Demotes all admins
- ✅ Spams 50 messages
- ✅ Resets invite link
- ✅ Locks group
- ❌ Does NOT remove members

**Less destructive, more dramatic!**
