# ♟️ CHESS GAME - TROUBLESHOOTING & FIXES

## 🔧 FIXED ISSUES

### ✅ Resign Command Not Working

**Problem:** When players typed `.chess resign`, the bot responded with "A chess game is already in progress" instead of resigning.

**Root Cause:** The command parsing logic was checking for mentions BEFORE checking for the resign command. This caused the resign command to be misinterpreted as an attempt to start a new game.

**Fix Applied:** Reordered the command checks so that resign and draw commands are processed BEFORE the game creation logic.

**How to Test:**

1. Start a game: `.chess @opponent`
2. Try to resign: `.chess resign`
3. Should now work correctly and end the game

### ✅ Draw Command Not Working

**Problem:** Similar to resign, the draw command was being blocked.

**Fix Applied:** Same reordering fix as resign command.

**How to Test:**

1. Start a game: `.chess @opponent`
2. Offer draw: `.chess draw`
3. Accept draw: `.chess draw` (from other player)
4. Should now work correctly

## 🎮 COMMON ISSUES & SOLUTIONS

### Issue: "A chess game is already in progress"

**When it appears:**

- Trying to start a new game when one exists
- Previously: When trying to resign (NOW FIXED)

**Solutions:**

1. Check current game: `.chess board`
2. End current game: `.chess resign`
3. Start new game: `.chess @opponent`

### Issue: "Invalid move" Error

**Common Causes:**

1. Wrong format
   - ❌ `.chess e2-e4`
   - ✅ `.chess move e2-e4`

2. Illegal chess move
   - Moving piece incorrectly
   - Moving into check
   - Path blocked by other pieces

3. Wrong square notation
   - ❌ `.chess move e2e4` (missing dash)
   - ✅ `.chess move e2-e4`

**Solutions:**

- Use correct format: `.chess move [from]-[to]`
- Verify the move is legal in chess
- Check the board: `.chess board`

### Issue: "Not your turn"

**Cause:** Trying to move when it's opponent's turn

**Solutions:**

- Wait for opponent to move
- Check whose turn: `.chess board`
- Look for "Turn: White ⚪" or "Turn: Black ⚫"

### Issue: "No game in progress"

**Cause:** No active chess game in the group

**Solutions:**

- Start a new game: `.chess @opponent`
- Or play vs AI: `.chess ai`

### Issue: "You are not playing in this game"

**Cause:** Someone who isn't a player tries to make a move

**Solutions:**

- Only the two players can make moves
- Others can watch: `.chess board`
- Wait for game to finish, then start your own

### Issue: Game Appears Stuck

**Symptoms:**

- No one can move
- Commands not responding
- Board not updating

**Solutions:**

1. Check if game is over: `.chess board`
2. Force end game: `.chess resign`
3. If still stuck, contact bot admin

### Issue: Can't Castle

**Requirements for Castling:**

1. King hasn't moved
2. Rook hasn't moved
3. No pieces between king and rook
4. King not in check
5. King doesn't pass through check
6. King doesn't land on check

**How to Castle:**

- Kingside: `.chess move e1-g1` (white) or `.chess move e8-g8` (black)
- Queenside: `.chess move e1-c1` (white) or `.chess move e8-c8` (black)

### Issue: Pawn Promotion Not Working

**Correct Format:**

```
.chess move e7-e8q    (promote to Queen)
.chess move e7-e8r    (promote to Rook)
.chess move e7-e8b    (promote to Bishop)
.chess move e7-e8n    (promote to Knight)
```

**Common Mistakes:**

- ❌ `.chess move e7-e8` (missing piece letter)
- ❌ `.chess move e7-e8Q` (uppercase - use lowercase)
- ✅ `.chess move e7-e8q`

### Issue: En Passant Not Working

**Requirements:**

1. Your pawn is on 5th rank (white) or 4th rank (black)
2. Opponent's pawn just moved 2 squares forward
3. Opponent's pawn is now beside your pawn
4. Must capture immediately on next move

**How to Do It:**

- If opponent's pawn is on d5 and yours is on e5
- Capture: `.chess move e5-d6`
- The pawn on d5 will be captured

## 📋 COMMAND REFERENCE

### All Working Commands

```
.chess @opponent          - Start game vs player
.chess ai [difficulty]    - Start game vs AI
.chess move e2-e4         - Make a move
.chess board              - Show board
.chess moves              - Show move history
.chess resign             - Resign game (NOW FIXED ✅)
.chess draw               - Offer/accept draw (NOW FIXED ✅)
.chess help               - Show help
```

### AI Difficulty Levels

```
.chess ai easy            - Random moves
.chess ai medium          - Basic strategy (default)
.chess ai hard            - Advanced tactics
.chess ai expert          - Master level
```

## 🐛 REPORTING NEW BUGS

If you find a new issue:

1. Note the exact command you used
2. Note the error message
3. Check if game state is correct: `.chess board`
4. Try to reproduce the issue
5. Contact bot administrator with details

## ✨ RECENT FIXES SUMMARY

**Version: Latest**

✅ Fixed resign command being blocked
✅ Fixed draw command being blocked
✅ Improved command parsing order
✅ Better error messages
✅ More reliable game state management

## 🎯 BEST PRACTICES

1. **Always use correct format:**
   - `.chess move e2-e4` (not `.chess e2-e4`)

2. **Check board before moving:**
   - `.chess board` shows current position

3. **Verify it's your turn:**
   - Look for "Turn: White ⚪" or "Turn: Black ⚫"

4. **End games properly:**
   - Use `.chess resign` or `.chess draw`
   - Don't leave games hanging

5. **One game per group:**
   - Finish current game before starting new one

## 📞 NEED MORE HELP?

1. Read the full guide: `CHESS_GUIDE.md`
2. Check command help: `.chess help`
3. View current game: `.chess board`
4. Contact bot administrator

---

**Last Updated:** After resign/draw command fix
**Status:** All major issues resolved ✅
