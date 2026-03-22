# 💀 .raid Command - Group Destruction

## ⚠️ EXTREME WARNING ⚠️

This command is **EXTREMELY DESTRUCTIVE** and **IRREVERSIBLE**. Use with extreme caution!

## What It Does

The `.raid` command completely destroys a group by:

1. **Changes group name** to "💀 RAIDED 💀"
2. **Changes group description** to raid message
3. **Demotes ALL admins** (except you, the owner)
4. **Removes ALL members** (except admins and you)
5. **Resets invite link** (old link becomes invalid)
6. **Locks group** (only admins can send messages)

## Usage

### Step 1: Check What Will Happen

```
.raid
```

This shows a warning and what will be destroyed.

### Step 2: Confirm and Execute

```
.raid confirm
```

This starts the raid sequence.

## Requirements

- ✅ You must be the bot owner
- ✅ Command must be used in a group
- ✅ Bot must be a group admin
- ✅ You must type "confirm" to proceed

## Raid Sequence

The raid happens in this order:

```
1. Warning message (3 second countdown)
2. Change group name → "💀 RAIDED 💀"
3. Change description → Raid message
4. Demote all admins → Remove admin privileges
5. Remove all members → Kick non-admins (in batches of 5)
6. Reset invite link → Old link stops working
7. Lock group → Only admins can message
8. Final raid message → Summary of destruction
```

## Example Output

```
🔥 RAID MODE ACTIVATED 🔥

Starting in 3 seconds...

✅ Group name changed
✅ Description changed
🔻 Demoting 3 admin(s)...
✅ All admins demoted
🚫 Removing 47 member(s)...
✅ All members removed
✅ Invite link reset
✅ Group locked (admins only)

╔═══════════════════════╗
║   💀 RAID COMPLETE 💀   ║
╚═══════════════════════╝

🔥 Group Status:
• Name: Changed
• Description: Changed
• Admins: 3 demoted
• Members: 47 removed
• Link: Reset
• Settings: Locked

⚡ Raided by eli6s bot
💀 This group is now under control
```

## Technical Details

### Rate Limiting

- Members are removed in batches of 5
- 2 second delay between batches
- 0.5-1 second delays between other actions
- This prevents WhatsApp from blocking the bot

### Error Handling

- Each step has individual error handling
- If one step fails, others continue
- Errors are logged to console
- User gets feedback for each step

### Protected Users

The following are NOT affected:

- ✅ You (the owner)
- ✅ The bot itself
- ✅ Anyone with the owner's JID

### Permissions Required

Bot needs these permissions:

- Change group info (name, description)
- Manage participants (remove, demote)
- Change group settings (lock/unlock)
- Reset invite link

## Safety Features

### 1. Confirmation Required

You must type `.raid confirm` - prevents accidental raids.

### 2. Owner Only

Only the bot owner can use this command.

### 3. Group Only

Cannot be used in private chats.

### 4. Bot Admin Required

Bot must be admin to execute raid actions.

### 5. Warning Message

Shows exactly what will happen before proceeding.

## Use Cases

### Legitimate Uses:

- Cleaning up spam groups
- Shutting down abandoned groups
- Removing all members from your own group
- Testing bot capabilities (in test groups only!)

### DO NOT Use For:

- ❌ Raiding groups you don't own
- ❌ Harassing people
- ❌ Destroying active communities
- ❌ Malicious purposes

## Recovery

### Can You Undo It?

**NO.** The raid is permanent. However:

- ✅ You can manually re-add members
- ✅ You can change name/description back
- ✅ You can re-promote admins
- ✅ You can unlock the group
- ❌ You CANNOT restore the old invite link
- ❌ You CANNOT undo member removals automatically

### Manual Recovery Steps:

1. Change group name back: `.setgname <name>`
2. Change description back: `.setgdesc <desc>`
3. Unlock group: Use WhatsApp settings
4. Re-promote admins: `.promote @user`
5. Re-add members: Manually invite them back

## Troubleshooting

### "Bot needs to be admin"

- Make sure bot is promoted to admin
- Bot needs full admin permissions

### "Failed to remove members"

- WhatsApp rate limiting kicked in
- Some members may have been removed
- Wait and try removing remaining manually

### "Failed to change name/description"

- Bot may lack specific permissions
- Check bot's admin privileges

### Raid stops mid-way

- Check console for errors
- Some actions may have completed
- Manually complete remaining steps

## Ethical Considerations

### Think Before You Raid:

1. Is this your group to destroy?
2. Have you warned members?
3. Is there a better solution?
4. Can you handle the consequences?

### Remember:

- This affects real people
- Destroyed communities can't be easily rebuilt
- Use power responsibly
- Consider the impact

## Testing

### Safe Testing:

1. Create a test group
2. Add only test accounts
3. Make bot admin
4. Test raid command
5. Verify all features work

### DO NOT test on:

- ❌ Active groups
- ❌ Groups with real members
- ❌ Groups you don't own
- ❌ Important communities

## Command Aliases

Currently only:

- `.raid` - Main command
- `.raid confirm` - Execute raid

No aliases to prevent accidental use.

## Future Enhancements

Possible additions:

- Custom raid messages
- Selective member removal
- Raid templates
- Scheduled raids
- Raid logs/history

## Legal Notice

This command is provided for:

- Educational purposes
- Managing your own groups
- Bot testing and development

**You are responsible for how you use this command.**

The bot creator is not liable for:

- Misuse of this feature
- Damage to communities
- Violations of WhatsApp ToS
- Legal consequences

## Summary

The `.raid` command is a powerful tool for complete group destruction. It:

- ✅ Works quickly and efficiently
- ✅ Has safety confirmations
- ✅ Provides detailed feedback
- ✅ Handles errors gracefully
- ⚠️ Is completely irreversible
- ⚠️ Should be used with extreme caution

**Use wisely. Use responsibly. Use rarely.**
