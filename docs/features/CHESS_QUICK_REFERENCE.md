# ♟️ CHESS - QUICK REFERENCE

## 🚀 QUICK START

```
.chess @opponent          Start game
.chess move e2-e4         Make move
.chess board              Show board
.chess resign             Give up
```

## 📋 ALL COMMANDS

| Command                               | Description          |
| ------------------------------------- | -------------------- |
| `.chess @opponent`                    | Start game vs player |
| `.chess ai [easy/medium/hard/expert]` | Play vs AI           |
| `.chess move e2-e4`                   | Make a move          |
| `.chess board`                        | Show current board   |
| `.chess moves`                        | Show move history    |
| `.chess resign`                       | Resign the game      |
| `.chess draw`                         | Offer/accept draw    |
| `.chess help`                         | Show help message    |

## 🎯 MOVE FORMATS

### Standard Moves

```
.chess move e2-e4         Pawn forward
.chess move g1-f3         Knight move
.chess move d1-h5         Queen move
```

### Special Moves

```
.chess move e1-g1         Castle kingside
.chess move e1-c1         Castle queenside
.chess move e7-e8q        Promote to Queen
.chess move e7-e8r        Promote to Rook
.chess move e7-e8b        Promote to Bishop
.chess move e7-e8n        Promote to Knight
```

## 🎮 BOARD COORDINATES

```
  a b c d e f g h
8 ♜ ♞ ♝ ♛ ♚ ♝ ♞ ♜  8
7 ♟ ♟ ♟ ♟ ♟ ♟ ♟ ♟  7
6 · · · · · · · ·  6
5 · · · · · · · ·  5
4 · · · · · · · ·  4
3 · · · · · · · ·  3
2 ♙ ♙ ♙ ♙ ♙ ♙ ♙ ♙  2
1 ♖ ♘ ♗ ♕ ♔ ♗ ♘ ♖  1
  a b c d e f g h
```

## ♟️ PIECES

| Symbol | Name   | Letter | Movement                          |
| ------ | ------ | ------ | --------------------------------- |
| ♔/♚    | King   | K      | 1 square any direction            |
| ♕/♛    | Queen  | Q      | Any direction, any distance       |
| ♖/♜    | Rook   | R      | Horizontal/vertical, any distance |
| ♗/♝    | Bishop | B      | Diagonal, any distance            |
| ♘/♞    | Knight | N      | L-shape (2+1 squares)             |
| ♙/♟    | Pawn   | P      | Forward 1 (2 on first move)       |

## 🎲 AI LEVELS

| Level    | Description              |
| -------- | ------------------------ |
| `easy`   | Random moves, beginner   |
| `medium` | Basic strategy (default) |
| `hard`   | Advanced tactics         |
| `expert` | Master level             |

## ⚡ QUICK TIPS

1. **Control center** - e4, d4, e5, d5
2. **Develop pieces** - Knights and bishops first
3. **Castle early** - Protect your king
4. **Don't move same piece twice** - In opening
5. **Watch for checks** - Always protect king

## 🏆 WIN CONDITIONS

- **Checkmate** - King in check, no escape
- **Resignation** - Opponent gives up
- **Draw** - Stalemate, agreement, or 50-move rule

## ❌ COMMON ERRORS

| Error                      | Solution                          |
| -------------------------- | --------------------------------- |
| "Invalid move"             | Check format: `.chess move e2-e4` |
| "Not your turn"            | Wait for opponent                 |
| "No game in progress"      | Start with `.chess @opponent`     |
| "Game already in progress" | Finish current game first         |

## 📖 FAMOUS OPENINGS

### Italian Game

```
.chess move e2-e4
.chess move g1-f3
.chess move f1-c4
```

### Sicilian Defense

```
.chess move e2-e4
(opponent) .chess move c7-c5
```

### Queen's Gambit

```
.chess move d2-d4
.chess move c2-c4
```

## 🔧 TROUBLESHOOTING

**Game stuck?**

- Use `.chess resign` to end it

**Can't resign?**

- Make sure you're a player in the game
- Use exact command: `.chess resign`

**Invalid move?**

- Check it's your turn: `.chess board`
- Verify move is legal in chess
- Use correct format: `.chess move e2-e4`

## 🌍 LANGUAGES

Supported: English, Italian, Russian, Spanish, Portuguese, Arabic

Bot uses your group's language setting automatically.

## 📚 MORE INFO

- Full guide: `CHESS_GUIDE.md`
- Troubleshooting: `CHESS_TROUBLESHOOTING.md`
- In-game help: `.chess help`

---

**Quick Example Game:**

```
Player1: .chess @Player2
Player1: .chess move e2-e4
Player2: .chess move e7-e5
Player1: .chess move g1-f3
Player2: .chess board
```

**Have fun!** ♟️
