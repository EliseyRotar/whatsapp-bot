# Group Management Guide

## Admin Commands

All these commands require you to be a group admin.

### Member Management

#### Ban/Kick User

```
.ban @user
.kick @user
```

- Tag the user or reply to their message
- Bot must be admin
- Removes user from group

#### Promote to Admin

```
.promote @user
```

- Makes a member a group admin
- Bot must be admin

#### Demote from Admin

```
.demote @user
```

- Removes admin privileges
- Bot must be admin

### Group Settings

#### Change Group Name

```
.setgname New Group Name
```

Example: `.setgname Cool Friends Group`

#### Change Group Description

```
.setgdesc New description here
```

Example: `.setgdesc Welcome to our awesome group!`

#### Mute Group

```
.mute <minutes>
```

Example: `.mute 30`

- Only admins can send messages
- Automatically unmutes after specified time

### Messaging

#### Tag All Members

```
.tagall <message>
```

Example: `.tagall Meeting at 5 PM!`

- Tags all group members
- Everyone gets notified

#### Hidden Tag

```
.hidetag <message>
```

Example: `.hidetag Important announcement`

- Tags all members without showing tags
- Cleaner than tagall

### Protection Features

#### Antilink

```
.antilink on
.antilink off
.antilink
```

- Prevents members from sending links
- Auto-deletes messages with links
- Check status with just `.antilink`

#### Welcome Messages

```
.welcome on
.welcome off
.welcome
```

- Sends welcome message to new members
- Check status with just `.welcome`

## Owner Commands

These only work for the bot owner (+393313444410).

#### Change Bot Mode

```
.mode public
.mode private
```

- Public: Everyone can use the bot
- Private: Only owner can use the bot

#### Spam

```
.spam <count> <message>
.spam <count> <delay> <message>
```

See SPAM_GUIDE.md for details.

## Permission Levels

### Regular Member

- Can use general commands (.ping, .alive, .help)

### Group Admin

- All member commands
- Ban, kick, promote, demote
- Mute group
- Tag all, hidetag
- Change group settings
- Enable/disable features

### Bot Owner

- All commands
- Spam feature
- Change bot mode
- Full bot control

## Best Practices

### Setting Up a New Group

1. Add the bot to the group
2. Make the bot an admin
3. Enable features:

```
.antilink on
.welcome on
```

### Managing Members

1. Warn before banning
2. Use kick for temporary removal
3. Promote trusted members
4. Demote inactive admins

### Using Tags

- Use `.tagall` for important announcements
- Use `.hidetag` for less intrusive messages
- Don't spam tags

### Muting

- Mute during announcements
- Mute to calm heated discussions
- Set reasonable mute times

## Troubleshooting

### Bot Not Responding

- Check if bot is admin (for admin commands)
- Make sure you're using correct prefix (.)
- Verify you have required permissions

### Can't Kick/Ban

- Bot must be admin
- You must be admin
- Can't kick other admins

### Antilink Not Working

- Make sure it's enabled: `.antilink on`
- Bot must be admin to delete messages
- Only works for non-admin members

### Welcome Not Showing

- Enable with `.welcome on`
- Check if bot has send message permission

## Examples

### Complete Group Setup

```
.setgname My Awesome Group
.setgdesc Welcome to the best group ever!
.antilink on
.welcome on
.tagall Welcome everyone! Please read the rules.
```

### Managing Troublemakers

```
.ban @troublemaker
.kick @spammer
```

### Important Announcement

```
.mute 5
.hidetag 🚨 IMPORTANT: Meeting tomorrow at 3 PM
```

### Promoting Active Member

```
.promote @activemember
.hidetag Congratulations to our new admin!
```
