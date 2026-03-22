# 🚀 Quick Moderation Guide

## New Commands (Quick Reference)

### Moderation Commands

```
.warn @user <reason>          - Warn a user (3 = kick)
.warnings @user               - Check warnings
.warnings clear @user         - Clear warnings
.automod on/off              - Toggle auto-moderation
```

## Auto-Moderation Features

✅ **Automatically detects and removes:**

- Bad words/profanity
- Spam (5+ messages in 10 seconds)
- Excessive caps (>70% capitals)

✅ **Automatic actions:**

- Deletes violating messages
- Warns users
- Kicks after 3 warnings

✅ **Smart features:**

- Admins are exempt
- Per-group settings
- Persistent warning history

## Quick Setup

1. **Enable auto-mod in a group:**

   ```
   .automod on
   ```

2. **Manually warn someone:**

   ```
   .warn @user being rude
   ```

3. **Check their warnings:**

   ```
   .warnings @user
   ```

4. **Clear warnings (second chance):**
   ```
   .warnings clear @user
   ```

## Customization

Edit `config.js` to change:

- Max warnings before kick (default: 3)
- Bad words list
- Spam threshold (default: 5 messages)
- Spam time window (default: 10 seconds)
- Caps threshold (default: 70%)

## Error Messages

All commands now show helpful errors:

- ✅ Clear reason for failure
- ✅ How to fix the issue
- ✅ Usage examples
- ✅ Permission requirements

## Example Workflow

**Scenario: User is spamming**

1. Auto-mod detects spam → deletes messages → warns user
2. User continues → 2nd warning
3. User continues → 3rd warning → auto-kicked

**Scenario: Manual moderation**

1. Admin sees rule violation
2. `.warn @user breaking rules`
3. User warned, message stays
4. Repeat 3 times → user kicked

## Tips

- Auto-mod works silently in the background
- Manual `.warn` is for non-auto-detected violations
- Warnings persist across bot restarts
- Each group has independent warning counts
- Bot must be admin to kick users
