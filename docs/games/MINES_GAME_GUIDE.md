# 💣 MINES GAME - Complete Guide

## 🎮 Overview

Mines is a casino-style minesweeper game where players reveal tiles on a 5x5 grid to increase their multiplier while avoiding hidden mines. The more tiles you reveal, the higher your potential winnings - but hit a mine and you lose everything!

## 🚀 Quick Start

```
.mines <bet> <mines>
```

**Examples:**

- `.mines 100 3` - Bet 100 coins with 3 mines (easy)
- `.mines 500 10` - Bet 500 coins with 10 mines (medium)
- `.mines 1000 20` - Bet 1000 coins with 20 mines (hard)

## 📊 Game Settings

### Bet Amount

- **Minimum:** 10 coins
- **Maximum:** 1,000,000 coins
- **Special:** Use `.mines all 5` to bet your entire balance

### Mine Count

- **Range:** 1-24 mines
- **Strategy:**
  - **1-5 mines:** Easy mode (safer, lower multipliers)
  - **6-15 mines:** Medium mode (balanced risk/reward)
  - **16-24 mines:** Hard mode (extreme risk, massive rewards)

## 🎯 How to Play

### 1. Start a Game

```
.mines 1000 5
```

This creates a 5x5 grid with 5 hidden mines.

### 2. Reveal Tiles

Type a position to reveal a tile:

```
A1    (top-left corner)
C3    (center)
E5    (bottom-right corner)
```

**Grid Layout:**

```
    A   B   C   D   E
  ┌───┬───┬───┬───┬───┐
1 │ ▪️│ ▪️│ ▪️│ ▪️│ ▪️│
  ├───┼───┼───┼───┼───┤
2 │ ▪️│ ▪️│ ▪️│ ▪️│ ▪️│
  ├───┼───┼───┼───┼───┤
3 │ ▪️│ ▪️│ ▪️│ ▪️│ ▪️│
  ├───┼───┼───┼───┼───┤
4 │ ▪️│ ▪️│ ▪️│ ▪️│ ▪️│
  ├───┼───┼───┼───┼───┤
5 │ ▪️│ ▪️│ ▪️│ ▪️│ ▪️│
  └───┴───┴───┴───┴───┘
```

### 3. Cash Out or Continue

After each safe tile:

- **Type `cashout`** - Collect your winnings
- **Type a position** - Reveal another tile for higher multiplier
- **Type `quit`** - Forfeit the game

### 4. Win or Lose

- **💎 Safe Tile:** Multiplier increases, keep playing
- **💣 Hit Mine:** Game over, lose your bet
- **💰 Cash Out:** Win bet × multiplier × coin boosts

## 📈 Multiplier System

The multiplier is calculated using **perfect mathematical probability**:

```
Multiplier = 1 / P(revealing X safe tiles)
```

Where probability decreases with each revealed tile:

```
P(x) = ∏(n=0 to x-1) [(25 - mines - n) / (25 - n)]
```

**House Edge:** 3% (97% RTP - industry standard)

### Example Multipliers (5 mines):

| Tiles Revealed | Multiplier | Win (1000 bet) |
| -------------- | ---------- | -------------- |
| 1              | 1.25x      | 1,250          |
| 5              | 2.08x      | 2,080          |
| 10             | 5.26x      | 5,260          |
| 15             | 20.83x     | 20,830         |
| 20 (all safe)  | 177.10x    | 177,100        |

### Example Multipliers (20 mines):

| Tiles Revealed | Multiplier | Win (1000 bet) |
| -------------- | ---------- | -------------- |
| 1              | 5.00x      | 5,000          |
| 2              | 26.04x     | 26,040         |
| 3              | 173.61x    | 173,610        |
| 4              | 1,562.50x  | 1,562,500      |
| 5 (all safe)   | 19,531.25x | 19,531,250     |

## 🍀 Shop Item Integration

### Luck Boosts

Luck boosts from the shop **increase your chance** of revealing safe tiles:

- **🍀 Lucky Charm:** +10% safe tile chance
- **✨ Mega Luck:** +25% safe tile chance
- **🌟 Ultra Luck:** +50% safe tile chance

**How it works:**

- Base chance with 5 mines: 80% (20/25 tiles safe)
- With Lucky Charm: 88% effective chance
- With Ultra Luck: 120% → capped at 95% (never 100%)

### Coin Multipliers

All coin multipliers apply to Mines winnings:

- **💰 Double Coins:** 2x final payout
- **💸 Triple Coins:** 3x final payout
- **🤑 Mega Multiplier:** 5x final payout

**Example:**

- Bet: 1,000 coins
- Revealed: 10 tiles (5 mines)
- Multiplier: 5.26x
- Base win: 5,260 coins
- With Triple Coins: 15,780 coins!

## 📊 Statistics Tracking

Your Mines stats are automatically tracked:

```
📊 Your Stats:
🎮 Games: 50
🏆 Wins: 32
💥 Losses: 18
💎 Best streak: 8
📈 Highest multiplier: 173.61x
💰 Total won: 125,000
💸 Total lost: 45,000
📊 Win rate: 64.0%
```

## 💡 Strategy Guide

### Conservative Strategy (High Win Rate)

```
Mines: 1-3
Tiles to reveal: 5-10
Cash out: Early (2x-5x multiplier)
Win rate: ~70-80%
```

**Best for:**

- Building bankroll steadily
- Completing daily quests
- Low-risk players

### Balanced Strategy (Medium Risk)

```
Mines: 5-10
Tiles to reveal: 8-15
Cash out: Medium (5x-20x multiplier)
Win rate: ~50-60%
```

**Best for:**

- Balanced gameplay
- Moderate profits
- Most players

### Aggressive Strategy (High Risk/Reward)

```
Mines: 15-24
Tiles to reveal: 2-5
Cash out: High (20x-500x+ multiplier)
Win rate: ~20-40%
```

**Best for:**

- Chasing big wins
- High bankroll players
- Thrill seekers

### Perfect Game Strategy

```
Mines: 1-5
Goal: Reveal ALL safe tiles
Multiplier: 100x-1000x+
Win rate: ~5-15%
```

**Best for:**

- Achievement hunters
- Leaderboard climbers
- Maximum bragging rights

## 🎯 Advanced Tips

### 1. Pattern Recognition

- **Corner Start:** Statistically no advantage, but feels safer
- **Center Start:** Same odds, but more options for next move
- **Edge Start:** Personal preference only

### 2. Bankroll Management

- Never bet more than 5% of your balance
- Set a win goal (e.g., double your bet)
- Set a loss limit (e.g., 10 losses in a row)

### 3. Multiplier Targets

- **2x:** Very achievable, low risk
- **5x:** Good balance of risk/reward
- **10x:** Requires luck and strategy
- **50x+:** High risk, massive reward

### 4. When to Cash Out

- **Early:** After 3-5 tiles (guaranteed small profit)
- **Medium:** After 8-12 tiles (good multiplier)
- **Late:** After 15+ tiles (huge multiplier, high risk)
- **Perfect:** All safe tiles (legendary status)

### 5. Luck Boost Timing

- Use luck boosts when playing with many mines
- Save for high-stakes games
- Combine with coin multipliers for maximum profit

## 🏆 Achievements (Coming Soon)

Potential achievements for Mines:

- **💎 First Blood:** Reveal your first safe tile
- **🔥 Hot Streak:** Win 5 games in a row
- **💰 Big Winner:** Win 100,000+ coins in one game
- **🎯 Perfect Game:** Reveal all safe tiles
- **💣 Bomb Squad:** Play 100 games
- **🌟 Lucky Star:** Win with 20+ mines
- **👑 Mines Master:** Achieve 10x multiplier 10 times

## 🌍 Multi-Language Support

Mines is available in 7 languages:

- 🇬🇧 English
- 🇮🇹 Italian
- 🇷🇺 Russian
- 🇪🇸 Spanish
- 🇵🇹 Portuguese
- 🇸🇦 Arabic
- 🇮🇳 Hindi

## ❓ FAQ

**Q: Can I see where the mines are?**
A: No, mines are randomly placed and hidden until revealed.

**Q: Does the grid reset between games?**
A: Yes, every game has a completely new random mine placement.

**Q: What's the maximum multiplier?**
A: Theoretically unlimited! With 24 mines and revealing the 1 safe tile, you could get 25x. But realistically, 100x-1000x is the practical maximum.

**Q: Do luck boosts really work?**
A: Yes! They increase your effective chance of hitting safe tiles by the boost percentage.

**Q: Can I play multiple games at once?**
A: No, you can only have one active Mines game at a time.

**Q: What happens if I disconnect?**
A: Your game is saved! You can continue when you reconnect.

**Q: Is the game fair?**
A: Absolutely! The game uses cryptographically secure random number generation and perfect mathematical probability calculations.

## 🎮 Command Reference

| Command                | Description             |
| ---------------------- | ----------------------- |
| `.mines <bet> <mines>` | Start new game          |
| `A1` to `E5`           | Reveal tile at position |
| `cashout`              | Collect winnings        |
| `quit`                 | Forfeit game            |

## 📞 Support

Having issues? Check:

1. Your balance (`.bank`)
2. Active game status
3. Valid position format (A-E, 1-5)
4. Mine count (1-24)

---

**Good luck and happy mining! 💣💎**
