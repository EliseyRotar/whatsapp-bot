# 🎰 Roulette Game Guide

## Overview

The roulette game is a European-style roulette (single 0) with multiple betting options and full multi-language support.

## Features

✅ European Roulette (0-36, single zero)
✅ Multiple bet types with different payouts
✅ Full integration with bank system
✅ 6 languages supported (EN, IT, RU, ES, PT, AR)
✅ Animated spinning wheel
✅ Real-time balance updates

## Commands

- `.roulette` - Show usage and bet types
- `.roulette <bet> <type>` - Place a bet
- `.rlt` - Alias for roulette

## Bet Types & Payouts

### Outside Bets (Higher Win Chance, Lower Payout)

#### 1:1 Payouts (Even Money)

- **Red/Black**: `.roulette 10 red` or `.roulette 10 black`
  - Covers: 18 red or 18 black numbers
  - Payout: 1:1 (double your bet)
- **Odd/Even**: `.roulette 10 odd` or `.roulette 10 even`
  - Covers: 18 odd or 18 even numbers (0 doesn't count)
  - Payout: 1:1
- **Low/High**: `.roulette 10 low` or `.roulette 10 high`
  - Low: 1-18
  - High: 19-36
  - Payout: 1:1

#### 2:1 Payouts

- **Dozens**: `.roulette 10 1st` / `.roulette 10 2nd` / `.roulette 10 3rd`
  - 1st: 1-12
  - 2nd: 13-24
  - 3rd: 25-36
  - Payout: 2:1 (triple your bet)
- **Columns**: `.roulette 10 col1` / `.roulette 10 col2` / `.roulette 10 col3`
  - Column 1: 1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34
  - Column 2: 2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35
  - Column 3: 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36
  - Payout: 2:1

### Inside Bets (Lower Win Chance, Higher Payout)

#### 35:1 Payout

- **Straight Up**: `.roulette 10 5` (any number 0-36)
  - Covers: Single number
  - Payout: 35:1 (36x your bet)

## Examples

```
# Bet 10 coins on red
.roulette 10 red

# Bet 50 coins on number 7
.roulette 50 7

# Bet 100 coins on first dozen (1-12)
.roulette 100 1st

# Bet 25 coins on odd numbers
.roulette 25 odd

# Bet 200 coins on column 2
.roulette 200 col2
```

## Betting Limits

- **Minimum bet**: 10 coins
- **Maximum bet**: 1,000,000 coins

## How It Works

1. **Place Your Bet**: Choose bet amount and type
2. **Wheel Spins**: Animated spinning message (2 seconds)
3. **Result**: Shows winning number, color, and your result
4. **Balance Update**: Automatic coin addition/deduction

## Winning Probabilities (European Roulette)

| Bet Type  | Numbers Covered | Win Probability | Payout | House Edge |
| --------- | --------------- | --------------- | ------ | ---------- |
| Straight  | 1               | 2.7%            | 35:1   | 2.7%       |
| Red/Black | 18              | 48.6%           | 1:1    | 2.7%       |
| Odd/Even  | 18              | 48.6%           | 1:1    | 2.7%       |
| Low/High  | 18              | 48.6%           | 1:1    | 2.7%       |
| Dozen     | 12              | 32.4%           | 2:1    | 2.7%       |
| Column    | 12              | 32.4%           | 2:1    | 2.7%       |

## Roulette Wheel Layout

### Red Numbers

1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36

### Black Numbers

2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35

### Green Number

0 (zero)

## Multi-Language Support

The game automatically detects group language and displays messages in:

- 🇬🇧 English (en)
- 🇮🇹 Italian (it)
- 🇷🇺 Russian (ru)
- 🇪🇸 Spanish (es)
- 🇵🇹 Portuguese (pt)
- 🇸🇦 Arabic (ar)

## Tips & Strategy

1. **Even Money Bets**: Safest option with ~48.6% win chance
2. **Dozen/Column Bets**: Good balance between risk and reward
3. **Straight Bets**: High risk, high reward (35:1 payout)
4. **Bankroll Management**: Don't bet more than you can afford to lose
5. **House Edge**: All bets have 2.7% house edge (European roulette)

## Integration

- ✅ Fully integrated with `.bank` system
- ✅ Registered in `.games` command list
- ✅ Works in both groups and private chats
- ✅ Automatic balance checking
- ✅ Real-time coin updates

## Technical Details

- **File**: `commands/games/roulette.js`
- **Aliases**: `roulette`, `rlt`
- **Dependencies**: `bank.js`, `language.js`
- **Wheel Type**: European (37 numbers: 0-36)
- **RNG**: JavaScript Math.random() for fair spins

## Error Handling

- ❌ Invalid bet amount → Shows min/max limits
- ❌ Invalid bet type → Shows usage guide
- ❌ Insufficient balance → Shows current balance
- ❌ Missing arguments → Shows full usage guide

## Future Enhancements (Optional)

- Split bets (2 numbers)
- Street bets (3 numbers)
- Corner bets (4 numbers)
- Six line bets (6 numbers)
- Betting history tracking
- Hot/cold number statistics
- Roulette leaderboard

---

**Ready to spin! 🎰**

Use `.roulette` to see all bet types and start playing!
