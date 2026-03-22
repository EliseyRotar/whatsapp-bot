# 🛡️ Moderation Features

## New Commands Added

### 1. `.warn @user <reason>` (Admin Only)

Warn a user for rule violations. After 3 warnings, the user is automatically kicked.

**Usage:**

```
.warn @user spamming
.warn @user (reply to message)
```

**Features:**

- Tracks warning count per user per group
- Shows remaining warnings
- Auto-kicks at max warnings (default: 3)
- Stores warning history with timestamps

---

### 2. `.warnings @user` (Admin Only)

Check a user's warning history.

**Usage:**

```
.warnings @user - View warnings
.warnings clear @user - Clear all warnings
```

**Shows:**

- Total warning count
- Last warning date
- Complete warning history with reasons

---

### 3. `.automod on/off` (Admin Only)

Toggle automatic moderation for the group.

**Usage:**

```
.automod - Check status
.automod on - Enable
.automod off - Disable
```

---

## Auto-Moderation System

When enabled, the bot automatically:

### 1. **Bad Word Filter**

- Detects inappropriate language
- Deletes offensive messages
- Warns the user
- Configurable word list in `config.js`

### 2. **Spam Detection**

- Tracks message frequency
- Default: 5 messages in 10 seconds = spam
- Auto-deletes spam messages
- Issues warning to spammer

### 3. **Excessive Caps Detection**

- Detects messages with >70% capital letters
- Minimum 10 characters to trigger
- Deletes and warns user

### 4. **Automatic Actions**

- 1st violation: Delete message + warning
- 2nd violation: Delete message + warning
- 3rd violation: Delete message + kick from group

### 5. **Admin Bypass**

- Group admins are exempt from auto-moderation
- Admins can still be manually warned

---

## Configuration

Edit `config.js` to customize:

```javascript
autoMod: {
    enabled: true,
    maxWarnings: 3,
    badWords: ['word1', 'word2', ...],
    spamThreshold: 5,
    spamTimeWindow: 10000,
    capsThreshold: 0.7,
    minCapsLength: 10
}
```

---

## Error Handling Improvements

### Better User Messages

All commands now provide:

- Clear error descriptions
- Helpful usage instructions
- Specific failure reasons
- Actionable solutions

### Examples:

**Before:**

```
❌ Failed to kick: Error
```

**After:**

```
❌ Failed to kick user.

Reason: Bot lacks permission.
Make sure the bot is an admin.
```

### Graceful Degradation

- Commands continue working even if some features fail
- Errors are logged but don't crash the bot
- Users get helpful feedback instead of technical errors
- Fallback messages when permissions are insufficient

---

## Database Structure

### Warnings Storage (`data/warnings.json`)

```json
{
  "groupId_userId": {
    "count": 2,
    "reasons": [
      {
        "reason": "Spamming",
        "timestamp": "2026-02-13T..."
      }
    ],
    "lastWarned": "2026-02-13T..."
  }
}
```

### Group Settings (`data/groups.json`)

```json
{
  "groupId": {
    "automod": true,
    "antilink": false,
    "welcome": true
  }
}
```

---

## Updated Help Menu

The `.help` command now shows:

- ✅ Separate owner commands section (only visible to owner)
- ✅ New moderation commands listed
- ✅ Clear command descriptions
- ✅ Usage tips and requirements
- ✅ Dynamic config values

---

## Testing Checklist

1. **Warning System:**
   - [ ] Warn a user 3 times
   - [ ] Verify auto-kick on 3rd warning
   - [ ] Check warning history
   - [ ] Clear warnings

2. **Auto-Moderation:**
   - [ ] Send bad word (should delete + warn)
   - [ ] Send 5+ messages quickly (spam detection)
   - [ ] Send message in ALL CAPS (caps detection)
   - [ ] Verify admin bypass

3. **Error Handling:**
   - [ ] Try commands without permissions
   - [ ] Try invalid command usage
   - [ ] Verify helpful error messages

---

## Notes

- Auto-moderation is enabled by default for all groups
- Warnings are group-specific (same user can have different warnings in different groups)
- Bot must be admin to kick users
- All errors are logged to console with stack traces for debugging
