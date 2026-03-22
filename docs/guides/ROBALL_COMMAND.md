# 🚨 Rob All Command - Owner Only

## Overview

The `.roball` command allows the bot owner to rob everyone in a group at once using the EXACT same mechanics as `.rob @user`. Each person gets a 30-second window to defend themselves with `.fight`!

## Usage

```
.roball
```

## Features

✅ Owner-only command (only you and the bot can use it)
✅ Works only in groups
✅ Uses EXACT same robbery logic as `.rob @user`
✅ Each target gets 30 seconds to type `.fight` to defend
✅ Respects anti-rob protection items
✅ Sends individual robbery messages for each target
✅ 2-second delay between each robbery attempt
✅ Multi-language support (EN, IT, RU, ES, PT, AR)
✅ Skips users with less than 100 coins
✅ Skips the owner and bot itself
✅ Steals 10-30% of each member's balance (same as regular rob)

## How It Works

1. Command checks if you're the owner
2. Fetches all group members
3. For each eligible member:
   - Skips if they have anti-rob protection
   - Skips if they have less than 100 coins
   - Calculates stolen amount (10-30% of their balance)
   - Creates a pending robbery (same as `.rob @user`)
   - Sends robbery notification with their @mention
   - Gives them 30 seconds to type `.fight`
   - If they don't fight: you steal their coins
   - If they fight and win: they keep coins + get bonus, you pay fine
   - If they fight and lose: you steal their coins
4. Waits 2 seconds before robbing the next person
5. After all robberies complete, sends final summary

## Example Output

### Starting Message

```
🚨 MASS ROBBERY IN PROGRESS! 🚨

💰 Robbing everyone in the group...

⚠️ Each member has 30 seconds to type .fight to defend!

⏳ Starting robberies...
```

### Individual Robbery Messages

```
🚨 ROBBERY #1! 🚨

@user1 is being robbed by @owner!

💰 Potential Loss: 2,450 coins

⚔️ @user1 can defend by typing .fight within 30 seconds!

🛡️ Fight back or lose your coins!
```

### If No Defense (After 30 seconds)

```
⏰ Robbery #1 expired.

@owner got away with 2,450 coins from @user1!
```

### Final Summary

```
╔═══════════════════════════════════╗
║   💰 MASS ROBBERY COMPLETE   ║
╚═══════════════════════════════════╝

📊 FINAL RESULTS:

👥 Total targets: 18
✅ Successfully robbed: 12
⚔️ Defended: 6
⏭️ Skipped: 7
💵 Total stolen: 45,230 coins

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 Your new balance: 156,780 coins
```

## Robbery Mechanics (EXACT same as .rob)

- Each person gets their own pending robbery
- 30-second window to type `.fight` to defend
- If they fight and win (50% + their luck boost):
  - They keep their coins
  - They get 50% bonus of what you tried to steal
  - You pay a 30% fine
- If they fight and lose:
  - You steal their coins
- If they don't fight:
  - You automatically steal their coins after 30 seconds
- Anti-rob protection items block the robbery attempt entirely

## Timing

- 2 seconds between each robbery attempt
- 30 seconds for each person to defend
- Total time depends on number of targets
- Example: 20 targets = ~40 seconds to send all + 30 seconds for fights = ~70 seconds total

## Files Modified

- `commands/owner/roball.js` - New command with pending robbery logic
- `commands/index.js` - Added roball to command registry

## Testing

1. Restart your bot
2. Go to any group where the bot is a member
3. Type `.roball`
4. Watch as each person gets notified and can defend with `.fight`!

## Notes

- Creates real pending robberies that work with `.fight`
- Each target gets their own robbery notification
- Defenders can fight back just like regular robberies
- Very interactive - the whole group will see each robbery attempt!
