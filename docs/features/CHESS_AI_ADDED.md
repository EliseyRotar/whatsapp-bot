# ✅ Chess AI Added!

## What's New

You can now play chess against an AI opponent with 4 difficulty levels!

### New Commands:

```
.chess ai - Play vs AI (medium difficulty)
.chess ai easy - Play vs easy AI
.chess ai medium - Play vs medium AI
.chess ai hard - Play vs hard AI
.chess ai expert - Play vs expert AI (master level)
```

### AI Difficulty Levels:

1. **Easy** 🟢
   - Random moves with some basic strategy
   - Good for beginners
   - Search depth: 1

2. **Medium** 🟡 (Default)
   - Basic tactics and strategy
   - Decent opponent for casual players
   - Search depth: 2

3. **Hard** 🟠
   - Advanced tactics
   - Challenging for experienced players
   - Search depth: 3

4. **Expert** 🔴
   - Master level play
   - Very challenging
   - Search depth: 4

### How It Works:

The AI uses:

- **Minimax Algorithm** - Explores all possible moves
- **Alpha-Beta Pruning** - Optimizes search speed
- **Position Evaluation** - Considers piece values and positions
- **Piece-Square Tables** - Rewards good piece placement

### Example Usage:

```
# Start game vs AI
.chess ai medium

# Make your move
.chess move e2-e4

# AI will automatically respond!
🤖 AI is thinking...
🤖 AI played: e7-e5
```

### Features:

✅ AI responds automatically after your move
✅ Realistic thinking delay
✅ Shows AI's move in standard notation
✅ All chess rules fully supported
✅ Game over detection works with AI
✅ Can resign against AI
✅ Full move history tracking

### Technical Details:

**Content was rephrased for compliance with licensing restrictions:**

The AI implementation uses standard chess programming techniques including minimax search with alpha-beta pruning for optimization. Position evaluation considers material values and positional bonuses through piece-square tables. The algorithm explores the game tree to varying depths based on difficulty level.

**Sources:**

- [Build a Simple Chess AI in JavaScript](https://dev.to/zeyu2001/build-a-simple-chess-ai-in-javascript-18eg)
- [A step-by-step guide to building a simple chess AI](https://medium.com/free-code-camp/simple-chess-ai-step-by-step-1d55a9266977)

### Files Added/Modified:

- `utils/chessAI.js` - AI engine with minimax & alpha-beta pruning
- `commands/games/chess.js` - Added AI game support
- `utils/chessGameManager.js` - Added AI game tracking

### Try It Now!

```
.chess ai
```

Have fun playing against the AI! 🤖♟️
