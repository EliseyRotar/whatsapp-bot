# 🎯 Daily Limits & Bulk Buy Feature

## Overview

Added daily limits for `.kill` and `.rob` commands, plus a new `.buybulk` command for purchasing weapons in bulk with discounts.

## Features Implemented

### 1. Daily Limits System (`utils/dailyLimits.js`)

**Limits:**

- `.kill` - 5 uses per day
- `.rob` - 15 uses per day

**Functions:**

- `hasReachedLimit(userId, action)` - Check if user reached limit
- `getRemainingUses(userId, action)` - Get remaining uses
- `incrementUsage(userId, action)` - Increment usage count
- `getUsageStats(userId, action)` - Get detailed stats
- `resetLimits(userId)` - Reset limits (admin)

**Data Storage:**

- File: `data/daily_limits.json`
- Auto-resets at midnight (based on date)
- Tracks per user per action

### 2. Bulk Weapon Purchase (`.buybulk`)

**Command:** `.buybulk <weapon> <quantity>`

**Example:** `.buybulk pistol 10`

**Bulk Discounts:**

- 5+ items: 5% off
- 10+ items: 10% off
- 25+ items: 15% off
- 50+ items: 20% off
- 100+ items: 25% off

**Features:**

- Buy 1-1000 weapons at once
- Automatic discount calculation
- Shows savings and total cost
- Multi-language support (7 languages)

**Available Weapons:**

- 🔪 knife - 25,000 coins
- 🔫 pistol - 75,000 coins
- 🔫 rifle - 175,000 coins
- 🎯 sniper - 350,000 coins
- 🚀 rpg - 750,000 coins

### 3. Integration with Existing Commands

**Rob Command:**

- Added daily limit check before robbery attempt
- Shows remaining uses when limit reached
- Limit: 15 robberies per day

**Kill Command:**

- Added daily limit check before kill attempt
- Shows remaining uses when limit reached
- Limit: 5 kills per day

## Usage Examples

### Check Limits

The limits are checked automatically when using commands. If you've reached the limit:

```
⏰ Daily Limit Reached!

You've used all 15 robberies for today.

🔄 Resets at midnight
📊 Used: 15/15
```

### Bulk Buy Weapons

```
.buybulk pistol 10

✅ BULK PURCHASE SUCCESSFUL!

🔫 Weapon: Pistol
📦 Quantity: 10
💰 Unit Price: 75,000 coins
🎯 Discount: 10%
💸 Total Cost: 675,000 coins
💵 Saved: 75,000 coins

💰 New Balance: 1,325,000 coins
🔫 Total Pistols: 15
```

## Files Created/Modified

### New Files:

1. `utils/dailyLimits.js` - Daily limits tracking system
2. `commands/games/buybulk.js` - Bulk weapon purchase command
3. `data/daily_limits.json` - Daily limits data (auto-created)

### Modified Files:

1. `commands/games/rob.js` - Added daily limit check ✅
2. `commands/action/kill.js` - Added daily limit check ✅
3. `commands/games/fight.js` - Added incrementUsage for robber wins ✅

## TODO

~~1. Add daily limit check to kill.js command~~ ✅ DONE
~~2. Add daily limit messages for all 7 languages in rob.js (ru, es, pt, ar, hi)~~ ✅ DONE
~~3. Increment usage counter after successful rob/kill~~ ✅ DONE 4. Test the bulk buy command in production 5. (Optional) Add `.limits` command to check current usage stats

## Implementation Status

✅ **COMPLETED:**

- Daily limits utility system created
- Daily limit check added to `.rob` command with all 7 languages
- Daily limit check added to `.kill` command with all 7 languages
- Usage counter increments after successful robbery (rob.js timeout + fight.js loss)
- Usage counter increments after successful kill (kill.js)
- Bulk buy command created with full multi-language support

⏳ **PENDING:**

- Production testing of bulk buy command
- Optional: Create `.limits` command for users to check their daily usage

## Multi-Language Support

All features support 7 languages:

- 🇬🇧 English
- 🇮🇹 Italian
- 🇷🇺 Russian
- 🇪🇸 Spanish
- 🇵🇹 Portuguese
- 🇸🇦 Arabic
- 🇮🇳 Hindi

## Benefits

1. **Fair Play** - Prevents spam and abuse of rob/kill commands
2. **Economy Balance** - Limits daily coin theft/loss
3. **Bulk Savings** - Rewards players who buy in bulk
4. **Engagement** - Encourages strategic planning of daily actions
