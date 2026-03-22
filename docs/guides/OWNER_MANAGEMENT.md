# 👑 Owner Management System

You can now grant and revoke owner permissions to other users!

## Commands

### .addowner @user

Grant full owner permissions to a user.

**Usage:**

```
.addowner @username
```

**What it does:**

- Grants the mentioned user full access to all owner commands
- User can use: .spam, .broadcast, .raid, .autovv, .mode, .debug
- User CANNOT add/remove other owners (only main owner can)
- Stores user info in `data/additional_owners.json`

**Example:**

```
.addowner @john
```

### .removeowner @user

Revoke owner permissions from a user.

**Usage:**

```
.removeowner @username
```

**What it does:**

- Removes owner permissions from the mentioned user
- User can no longer use owner commands
- Updates `data/additional_owners.json`

**Example:**

```
.removeowner @john
```

### .listowners

View all users with owner permissions.

**Usage:**

```
.listowners
```

**What it shows:**

- Main owner (you - eli6)
- All additional owners with their numbers
- Date when each owner was added
- Total count of additional owners

## Permission Levels

### Main Owner (eli6)

- Full access to everything
- Can add/remove additional owners
- Cannot be removed
- Number: +393313444410

### Additional Owners

- Can use all owner commands
- Cannot add/remove other owners
- Can be removed by main owner
- Stored in database file

### Regular Users

- No owner permissions
- Can only use general and admin commands (if admin)

## Technical Details

**Storage:**

- Additional owners are stored in `data/additional_owners.json`
- File is created automatically when first owner is added
- Persists across bot restarts

**Data Structure:**

```json
[
  {
    "jid": "1234567890@s.whatsapp.net",
    "number": "1234567890",
    "addedAt": "2026-02-13T16:30:00.000Z",
    "addedBy": "222788929462360@lid"
  }
]
```

**Owner Detection:**
The bot checks for owners in this order:

1. Main owner JID match
2. Bot JID match (same account)
3. Owner number match
4. Message from bot itself
5. Additional owners list

## Security Notes

⚠️ **Important:**

- Only grant owner permissions to trusted users
- Additional owners have full control over the bot
- They can raid groups, spam, broadcast to all groups
- They CANNOT add more owners (only you can)
- You can revoke access anytime with `.removeowner`

## Examples

**Scenario 1: Add a trusted friend**

```
You: .addowner @friend
Bot: ✅ Owner permissions granted!
     👤 User: @friend
     🔑 Can now use all owner commands
```

**Scenario 2: Check who has permissions**

```
You: .listowners
Bot: ╔═══════════════════════════╗
     ║     👑 OWNER LIST     ║
     ╚═══════════════════════════╝

     🔹 Main Owner: eli6 (+393313444410)

     🔹 Additional Owners:

     1. @friend
        Added: 2/13/2026

     Total: 1 additional owner(s)
```

**Scenario 3: Remove permissions**

```
You: .removeowner @friend
Bot: ✅ Owner permissions revoked!
     👤 User: @friend
     🚫 Can no longer use owner commands
```

## Troubleshooting

**Command not working?**

- Make sure you're the main owner
- Check that you mentioned the user correctly
- Verify bot has write permissions to `data/` folder

**User still can't use owner commands?**

- Restart the bot after adding owner
- Check `.listowners` to confirm they were added
- Verify their JID is correct with `.jid` command

**Want to remove all additional owners?**

- Delete `data/additional_owners.json` file
- Or use `.removeowner` for each user

Enjoy managing your bot team! 👑
