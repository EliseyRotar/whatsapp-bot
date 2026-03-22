# ♟️ Chess Game Guide

## ✅ LATEST UPDATE - RESIGN/DRAW FIXED!

**The resign and draw commands now work correctly!** Previously, these commands were being blocked. This has been fixed.

## Overview

A complete chess implementation with full rule validation, special moves, and multi-language support.

## Features

### ✅ Complete Chess Rules

- All piece movements (King, Queen, Rook, Bishop, Knight, Pawn)
- Castling (kingside and queenside)
- En passant captures
- Pawn promotion
- Check and checkmate detection
- Stalemate detection
- Draw by insufficient material
- Draw by 50-move rule
- Move validation (prevents illegal moves)

### 🎮 Game Features

- Two-player games in groups
- AI opponent with 4 difficulty levels
- Beautiful Unicode chess pieces (♔♕♖♗♘♙)
- Algebraic notation (e2-e4, d7-d5)
- Move history tracking
- Captured pieces display
- Game duration tracking
- Draw offers (NOW WORKING ✅)
- Resignation option (NOW WORKING ✅)
- Auto-save (games persist across bot restarts)

### 🌍 Multi-Language Support

- English
- Italian
- Russian
- Spanish
- Portuguese
- Arabic

## Commands

### Starting a Game

**Play vs Player:**

```
.chess @opponent
```

**Play vs AI:**

```
.chess ai              (medium difficulty - default)
.chess ai easy         (beginner level)
.chess ai hard         (advanced level)
.chess ai expert       (master level)
```

### Making Moves

```
.chess move e2-e4
.chess m d7-d5
```

Move format: `source-destination` (e.g., e2-e4)

**Special Moves:**

- Castling kingside: `e1-g1` (White) or `e8-g8` (Black)
- Castling queenside: `e1-c1` (White) or `e8-c8` (Black)
- Pawn promotion: `e7-e8q` (promote to Queen)
  - q = Queen, r = Rook, b = Bishop, n = Knight

### Game Information

```
.chess board       - Show current board position
.chess moves       - Show move history (last 10 moves)
.chess help        - Show command help
```

### Game Control

```
.chess resign      - Resign the game (NOW WORKING ✅)
.chess draw        - Offer or accept a draw (NOW WORKING ✅)
```

## How to Play

### 1. Start a Game

**Against a player:**

```
.chess @friend
```

**Against AI:**

```
.chess ai medium
```

### 2. Make Moves

Players alternate turns. Use algebraic notation:

```
.chess move e2-e4    (White's first move)
.chess move e7-e5    (Black's response)
.chess move g1-f3    (White develops knight)
```

### 3. Special Moves

**Castling:**

Requirements:

- King and rook haven't moved
- No pieces between them
- King not in check
- King doesn't pass through check

```
.chess move e1-g1    (Kingside castling)
.chess move e1-c1    (Queenside castling)
```

**En Passant:**

- Automatically detected when conditions are met
- Capture opponent's pawn that just moved two squares

```
.chess move e5-d6    (Captures pawn on d5 en passant)
```

**Pawn Promotion:**

- Add piece letter at end (q/r/b/n)

```
.chess move e7-e8q   (Promote to Queen)
.chess move a7-a8r   (Promote to Rook)
.chess move b7-b8b   (Promote to Bishop)
.chess move c7-c8n   (Promote to Knight)
```

### 4. Ending the Game

**Checkmate:**

- Opponent's king is in check with no legal moves
- Game ends automatically
- Winner declared

**Resignation:**

```
.chess resign
```

You lose, opponent wins.

**Draw:**

- Offer draw: `.chess draw`
- Opponent accepts: `.chess draw`
- Auto-draw: Stalemate, insufficient material, 50-move rule

## Board Coordinates

```
  ┌─────────────────┐
8 │ ♜ ♞ ♝ ♛ ♚ ♝ ♞ ♜ │
7 │ ♟ ♟ ♟ ♟ ♟ ♟ ♟ ♟ │
6 │ · · · · · · · · │
5 │ · · · · · · · · │
4 │ · · · · · · · · │
3 │ · · · · · · · · │
2 │ ♙ ♙ ♙ ♙ ♙ ♙ ♙ ♙ │
1 │ ♖ ♘ ♗ ♕ ♔ ♗ ♘ ♖ │
  └─────────────────┘
    a b c d e f g h
```

**Files (columns):** a-h (left to right)
**Ranks (rows):** 1-8 (bottom to top)

## Piece Symbols

| Piece  | White | Black | Letter | Movement                    |
| ------ | ----- | ----- | ------ | --------------------------- |
| King   | ♔     | ♚     | K      | 1 square any direction      |
| Queen  | ♕     | ♛     | Q      | Any direction, any distance |
| Rook   | ♖     | ♜     | R      | Horizontal/vertical         |
| Bishop | ♗     | ♝     | B      | Diagonal                    |
| Knight | ♘     | ♞     | N      | L-shape (2+1)               |
| Pawn   | ♙     | ♟     | P      | Forward 1 (2 first move)    |

## AI Difficulty Levels

### Easy

- Makes random legal moves
- Good for beginners learning the game
- No strategy or planning

### Medium (Default)

- Basic strategy and tactics
- Considers piece values
- Looks ahead 1-2 moves
- Good for casual players

### Hard

- Advanced tactics and strategy
- Better position evaluation
- Looks ahead 3-4 moves
- Challenging for intermediate players

### Expert

- Master-level play
- Deep position analysis
- Looks ahead 5+ moves
- Advanced endgame knowledge
- Very challenging!

## Examples

### Opening Game

```
Player1: .chess @Player2
Bot: ♟️ CHESS GAME STARTED!
     ⚪ White: @Player1
     ⚫ Black: @Player2
     [board display]

Player1: .chess move e2-e4
Bot: ♟️ Move: e2-e4
     [updated board]

Player2: .chess move e7-e5
Bot: ♟️ Move: e7-e5
     [updated board]

Player1: .chess move g1-f3
Bot: ♟️ Move: g1-f3
     [updated board]
```

### Playing vs AI

```
Player: .chess ai hard
Bot: ♟️ CHESS GAME VS AI!
     ⚪ You (White): @Player
     ⚫ AI (HARD): 🤖
     [board display]

Player: .chess move e2-e4
Bot: ♟️ Move: e2-e4
     [board display]

Bot: 🤖 AI is thinking...
Bot: 🤖 AI played: c7-c5
     [board display]
```

### Castling

```
Player: .chess move e1-g1
Bot: ♟️ Move: e1-g1
     [shows board with king and rook moved]
```

### Pawn Promotion

```
Player: .chess move e7-e8q
Bot: ♟️ Move: e7-e8q
     👑 Pawn promoted to Q!
     [shows board with new queen]
```

### Resigning (NOW WORKS!)

```
Player: .chess resign
Bot: 🏳️ @Player resigned!
     🏆 @Opponent wins!
     Game duration: 15m 32s
```

### Draw Offer (NOW WORKS!)

```
Player1: .chess draw
Bot: 🤝 @Player1 offers a draw!
     Type .chess draw to accept

Player2: .chess draw
Bot: 🤝 Draw accepted!
     Game ended in a draw.
     Game duration: 20m 15s
```

### Check and Checkmate

```
Bot: ♟️ Move: d8-h4
     ⚠️ CHECK!
     [shows board]

Bot: ♟️ Move: f7-g6
     🏆 CHECKMATE! Black wins!
     Game duration: 15m 32s
```

## Tips for Beginners

### Opening Principles

1. **Control the center** - e4, d4, e5, d5 are key squares
2. **Develop pieces** - Get knights and bishops out early
3. **Castle early** - Protect your king (usually by move 10)
4. **Don't move same piece twice** - Develop all pieces
5. **Don't bring queen out too early** - Can be attacked

### Middle Game

1. **Look for tactics** - Forks, pins, skewers
2. **Improve piece positions** - Put pieces on better squares
3. **Create threats** - Force opponent to respond
4. **Watch opponent's threats** - Always check what they're planning

### Endgame

1. **Activate your king** - King becomes strong in endgame
2. **Push passed pawns** - Pawns can become queens
3. **Keep rooks active** - Rooks are powerful in endgame
4. **Learn basic mates** - King+Queen, King+Rook vs King

### Common Mistakes to Avoid

1. Moving too fast without thinking
2. Ignoring opponent's threats
3. Leaving pieces undefended
4. Moving the same piece repeatedly
5. Neglecting king safety
6. Trading pieces when you're behind
7. Forgetting about pawn promotion

## Technical Details

### Move Validation

- All moves are validated against chess rules
- Illegal moves are rejected with error messages
- Check detection prevents moving into check
- Checkmate and stalemate automatically detected

### Game Persistence

- Games are saved automatically to `data/chess_games.json`
- Survive bot restarts
- Old games (24h+ inactive) are cleaned up automatically

### Performance

- Efficient move generation
- Fast position evaluation
- Optimized check detection
- AI uses minimax algorithm with alpha-beta pruning

## Troubleshooting

### "Invalid move" error

**Causes:**

- Wrong format (use `.chess move e2-e4`)
- Piece can't legally move there
- Move would leave king in check
- Path is blocked

**Solutions:**

- Check format: `.chess move [from]-[to]`
- Verify move is legal in chess
- Use `.chess board` to see current position

### "Not your turn" error

**Cause:** Trying to move when it's opponent's turn

**Solutions:**

- Wait for opponent to move
- Check whose turn: `.chess board`
- Look for "Turn: White ⚪" or "Turn: Black ⚫"

### "No game in progress" error

**Cause:** No active chess game in the group

**Solutions:**

- Start a new game: `.chess @opponent`
- Or play vs AI: `.chess ai`

### "You are not playing in this game" error

**Cause:** Someone who isn't a player tries to make a move

**Solutions:**

- Only the two players can make moves
- Others can watch: `.chess board`
- Wait for game to finish

### Can't resign or draw

**This has been FIXED!** ✅

If you still have issues:

1. Make sure you're a player in the game
2. Use exact command: `.chess resign` or `.chess draw`
3. Check game exists: `.chess board`

### Game appears stuck

**Solutions:**

1. Check if game is over: `.chess board`
2. Force end game: `.chess resign`
3. If still stuck, contact bot admin

## Famous Opening Moves

### Italian Game

```
1. .chess move e2-e4
2. .chess move g1-f3
3. .chess move f1-c4
```

### Sicilian Defense

```
1. .chess move e2-e4
   (Black) .chess move c7-c5
```

### French Defense

```
1. .chess move e2-e4
   (Black) .chess move e7-e6
```

### Queen's Gambit

```
1. .chess move d2-d4
2. .chess move c2-c4
```

## Winning Tactics

### Fork

One piece attacks two or more enemy pieces at once.
Example: Knight on e5 attacking queen on d7 and rook on g6.

### Pin

A piece cannot move without exposing a more valuable piece behind it.
Example: Bishop pinning knight to king.

### Skewer

Similar to a pin, but the more valuable piece is in front.
Example: Rook attacking queen with king behind.

### Discovered Attack

Moving one piece reveals an attack from another piece behind it.
Example: Moving knight reveals bishop attack on queen.

### Back Rank Mate

Checkmate on the opponent's back rank (usually rank 1 or 8).
Common when king is trapped by its own pawns.

## Additional Resources

- **Quick Reference:** See `CHESS_QUICK_REFERENCE.md`
- **Troubleshooting:** See `CHESS_TROUBLESHOOTING.md`
- **In-game help:** Type `.chess help`

## Credits

Chess engine built with:

- Full FIDE rules implementation
- Unicode chess pieces (U+2654–U+265F)
- Algebraic notation support
- Multi-language interface
- AI with minimax algorithm

---

**Have fun playing chess!** ♟️

For help in-game, type: `.chess help`
