# 🧪 MINES GAME - Test Scenarios

## Test 1: Easy Game (3 mines)

```
User: .mines 100 3
Bot: Shows 5x5 grid, all tiles hidden
     Bet: 100 | Mines: 3 | Revealed: 0/22

User: C3
Bot: ✅ SAFE! 💎
     Multiplier: 1.14x
     Potential win: 114 coins

User: A1
Bot: ✅ SAFE! 💎
     Multiplier: 1.29x
     Potential win: 129 coins

User: E5
Bot: ✅ SAFE! 💎
     Multiplier: 1.47x
     Potential win: 147 coins

User: cashout
Bot: 💰 CASHED OUT! 💰
     Tiles revealed: 3
     Final multiplier: 1.47x
     Won: 147 coins
     New balance: 1,047 coins
```

## Test 2: Hit Mine (5 mines)

```
User: .mines 500 5
Bot: Shows grid, Bet: 500 | Mines: 5

User: B2
Bot: ✅ SAFE! 💎
     Multiplier: 1.25x

User: D4
Bot: 💥 BOOM! YOU HIT A MINE! 💥
     Game Over!
     Lost: 500 coins
     Balance: 500 coins
```

## Test 3: Perfect Game (1 mine)

```
User: .mines 1000 1
Bot: Shows grid, Bet: 1000 | Mines: 1

User: [reveals 24 tiles one by one]
Bot: After each: ✅ SAFE! Multiplier increases

User: [reveals last safe tile]
Bot: 🎊 PERFECT GAME! 🎊
     ALL SAFE TILES REVEALED!
     MAXIMUM MULTIPLIER!
     Won: 25,000 coins (25x multiplier)
     New balance: 26,000 coins
     👑 LEGENDARY!
```

## Test 4: High Risk (20 mines)

```
User: .mines 100 20
Bot: Shows grid, Bet: 100 | Mines: 20

User: A1
Bot: ✅ SAFE! 💎
     Multiplier: 5.00x
     Potential win: 500 coins

User: cashout
Bot: 💰 CASHED OUT! 💰
     Won: 500 coins (5x multiplier)
```

## Test 5: With Luck Boost

```
User has Lucky Charm active (+10% luck)

User: .mines 1000 10
Bot: 🎮 Game started!
     💣 10 mines hidden in the grid
     🍀 Your luck boost: +10%

[Luck boost increases chance of hitting safe tiles]
```

## Test 6: With Coin Multiplier

```
User has Triple Coins active (3x)

User: .mines 1000 5
User: [reveals 10 tiles]
User: cashout

Bot: 💰 CASHED OUT! 💰
     Base multiplier: 5.26x
     Base win: 5,260 coins
     With Triple Coins: 15,780 coins! 💸
```

## Test 7: Quit Game

```
User: .mines 500 5
Bot: Shows grid

User: quit
Bot: 🏳️ Game forfeited
     Lost: 500 coins
     Balance: 500 coins
```

## Test 8: Invalid Commands

```
User: .mines
Bot: Shows usage instructions

User: .mines 5 3
Bot: ❌ Invalid bet amount!
     Minimum: 10 coins

User: .mines 100 30
Bot: ❌ Invalid mine count!
     Mines: 1-24

User: .mines 10000 5
(User has 500 coins)
Bot: ❌ Not enough coins!
     Your balance: 500
```

## Test 9: Invalid Positions

```
User: .mines 100 5
Bot: Shows grid

User: Z9
Bot: ❌ Invalid position!
     Use format: A1, B3, E5, etc.

User: A1
Bot: ✅ SAFE!

User: A1
Bot: ⚠️ Already revealed!
     Choose a different tile.
```

## Test 10: Statistics Display

```
After cashing out:

📊 Your Stats:
🎮 Games: 15
🏆 Wins: 10
💥 Losses: 5
💎 Best streak: 4
📈 Highest multiplier: 20.83x
💰 Total won: 25,000
💸 Total lost: 5,000
📊 Win rate: 66.7%
```

## Expected Multipliers (Mathematical)

### 3 Mines (22 safe tiles):

- 1 tile: 1.14x
- 5 tiles: 1.73x
- 10 tiles: 3.18x
- 15 tiles: 7.33x
- 22 tiles: 100.33x (perfect)

### 5 Mines (20 safe tiles):

- 1 tile: 1.25x
- 5 tiles: 2.08x
- 10 tiles: 5.26x
- 15 tiles: 20.83x
- 20 tiles: 177.10x (perfect)

### 10 Mines (15 safe tiles):

- 1 tile: 1.67x
- 5 tiles: 5.26x
- 10 tiles: 33.33x
- 15 tiles: 1,000.00x (perfect)

### 20 Mines (5 safe tiles):

- 1 tile: 5.00x
- 2 tiles: 26.04x
- 3 tiles: 173.61x
- 4 tiles: 1,562.50x
- 5 tiles: 19,531.25x (perfect)

## Performance Tests

### Grid Generation Speed

- Should generate 5x5 grid with random mines in <1ms
- Each game should have unique mine placement

### Multiplier Calculation Speed

- Should calculate multiplier in <1ms
- Accurate to 2 decimal places

### Memory Usage

- Each active game: ~500 bytes
- Stats file: Grows with player count
- No memory leaks on game completion

## Edge Cases

1. **Bet entire balance:** `.mines all 5` ✅
2. **Minimum bet:** `.mines 10 1` ✅
3. **Maximum mines:** `.mines 100 24` ✅
4. **First tile is mine:** Immediate loss ✅
5. **Last tile is mine:** Lose at high multiplier ✅
6. **Perfect game:** All safe tiles revealed ✅
7. **Disconnect during game:** Game persists ✅
8. **Multiple games:** Only one active at a time ✅

---

All tests should pass! 🎉
