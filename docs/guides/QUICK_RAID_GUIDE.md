# 💀 Quick Raid Guide

## What is .raid?

A destructive owner-only command that completely destroys a group.

## Quick Usage

```bash
# Step 1: See what will happen
.raid

# Step 2: Confirm and execute
.raid confirm
```

## What It Does (in 10 seconds)

1. Changes name to "💀 RAIDED 💀"
2. Changes description to raid message
3. Demotes all admins
4. Removes all members
5. Resets invite link
6. Locks group (admins only)

## Requirements

✅ Owner only
✅ Group only  
✅ Bot must be admin
✅ Must type "confirm"

## ⚠️ WARNING

- **IRREVERSIBLE** - Cannot be undone
- **DESTRUCTIVE** - Destroys the entire group
- **PERMANENT** - Members/admins must be re-added manually

## Protected

These are NOT affected:

- You (owner)
- The bot
- Other accounts with owner JID

## Example

```
You: .raid confirm

Bot: 🔥 RAID MODE ACTIVATED 🔥
     Starting in 3 seconds...

     ✅ Group name changed
     ✅ Description changed
     🔻 Demoting 3 admin(s)...
     ✅ All admins demoted
     🚫 Removing 47 member(s)...
     ✅ All members removed
     ✅ Invite link reset
     ✅ Group locked

     💀 RAID COMPLETE 💀
```

## When to Use

✅ Cleaning spam groups
✅ Shutting down your own groups
✅ Testing (in test groups only)

## When NOT to Use

❌ Groups you don't own
❌ Active communities
❌ As a prank
❌ For harassment

## Recovery

Can be manually recovered:

- ✅ Change name back
- ✅ Change description back
- ✅ Re-promote admins
- ✅ Re-add members
- ❌ Old invite link is GONE forever

## Pro Tips

1. **Test first** in a test group
2. **Warn members** before raiding
3. **Export member list** if you want to re-add them
4. **Screenshot settings** to restore later
5. **Think twice** before confirming

## Troubleshooting

**"Bot needs to be admin"**
→ Promote bot to admin first

**"Failed to remove members"**
→ Rate limiting, some may be removed

**Raid stops mid-way**
→ Check console, complete manually

## Safety

- Requires explicit "confirm"
- Owner-only command
- Shows warning first
- Detailed feedback
- Error handling

## Remember

**With great power comes great responsibility.**

Use this command wisely and ethically.

---

For full documentation, see: `RAID_COMMAND.md`
