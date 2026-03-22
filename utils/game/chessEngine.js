// Chess Engine - Full implementation with all rules
// Handles move validation, check detection, special moves, etc.

export class ChessEngine {
    constructor() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'white';
        this.moveHistory = [];
        this.capturedPieces = { white: [], black: [] };
        this.kingMoved = { white: false, black: false };
        this.rookMoved = {
            white: { kingside: false, queenside: false },
            black: { kingside: false, queenside: false }
        };
        this.enPassantTarget = null;
        this.halfMoveClock = 0; // For 50-move rule
        this.fullMoveNumber = 1;
    }

    initializeBoard() {
        // 8x8 board, null = empty square
        const board = Array(8).fill(null).map(() => Array(8).fill(null));
        
        // Place pieces - row 0 is rank 8 (black's back rank), row 7 is rank 1 (white's back rank)
        const backRank = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
        
        // Black pieces (top of board)
        for (let col = 0; col < 8; col++) {
            board[0][col] = { type: backRank[col], color: 'black' };
            board[1][col] = { type: 'p', color: 'black' };
        }
        
        // White pieces (bottom of board)
        for (let col = 0; col < 8; col++) {
            board[6][col] = { type: 'p', color: 'white' };
            board[7][col] = { type: backRank[col], color: 'white' };
        }
        
        return board;
    }

    // Convert algebraic notation to board coordinates
    algebraicToCoords(algebraic) {
        if (algebraic.length < 2) return null;
        const file = algebraic.charCodeAt(0) - 97; // a=0, b=1, etc.
        const rank = 8 - parseInt(algebraic[1]); // 8=0, 7=1, etc.
        if (file < 0 || file > 7 || rank < 0 || rank > 7) return null;
        return { row: rank, col: file };
    }

    // Convert board coordinates to algebraic notation
    coordsToAlgebraic(row, col) {
        return String.fromCharCode(97 + col) + (8 - row);
    }

    getPiece(row, col) {
        if (row < 0 || row > 7 || col < 0 || col > 7) return null;
        return this.board[row][col];
    }

    setPiece(row, col, piece) {
        if (row < 0 || row > 7 || col < 0 || col > 7) return;
        this.board[row][col] = piece;
    }

    // Check if a square is under attack by the opponent
    isSquareUnderAttack(row, col, byColor) {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = this.getPiece(r, c);
                if (piece && piece.color === byColor) {
                    if (this.canPieceAttackSquare(r, c, row, col)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // Check if a piece can attack a specific square (ignoring check)
    canPieceAttackSquare(fromRow, fromCol, toRow, toCol) {
        const piece = this.getPiece(fromRow, fromCol);
        if (!piece) return false;

        const rowDiff = toRow - fromRow;
        const colDiff = toCol - fromCol;
        const absRowDiff = Math.abs(rowDiff);
        const absColDiff = Math.abs(colDiff);

        switch (piece.type) {
            case 'p': // Pawn attacks diagonally
                const direction = piece.color === 'white' ? -1 : 1;
                return rowDiff === direction && absColDiff === 1;

            case 'n': // Knight
                return (absRowDiff === 2 && absColDiff === 1) || (absRowDiff === 1 && absColDiff === 2);

            case 'b': // Bishop
                if (absRowDiff !== absColDiff) return false;
                return this.isPathClear(fromRow, fromCol, toRow, toCol);

            case 'r': // Rook
                if (rowDiff !== 0 && colDiff !== 0) return false;
                return this.isPathClear(fromRow, fromCol, toRow, toCol);

            case 'q': // Queen
                if (rowDiff !== 0 && colDiff !== 0 && absRowDiff !== absColDiff) return false;
                return this.isPathClear(fromRow, fromCol, toRow, toCol);

            case 'k': // King
                return absRowDiff <= 1 && absColDiff <= 1;

            default:
                return false;
        }
    }

    // Check if path is clear between two squares (for sliding pieces)
    isPathClear(fromRow, fromCol, toRow, toCol) {
        const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
        const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;

        let currentRow = fromRow + rowStep;
        let currentCol = fromCol + colStep;

        while (currentRow !== toRow || currentCol !== toCol) {
            if (this.getPiece(currentRow, currentCol)) return false;
            currentRow += rowStep;
            currentCol += colStep;
        }

        return true;
    }

    // Find king position
    findKing(color) {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.getPiece(row, col);
                if (piece && piece.type === 'k' && piece.color === color) {
                    return { row, col };
                }
            }
        }
        return null;
    }

    // Check if current player is in check
    isInCheck(color) {
        const king = this.findKing(color);
        if (!king) return false;
        const opponent = color === 'white' ? 'black' : 'white';
        return this.isSquareUnderAttack(king.row, king.col, opponent);
    }

    // Validate and execute a move
    makeMove(from, to, promotionPiece = 'q') {
        const fromCoords = typeof from === 'string' ? this.algebraicToCoords(from) : from;
        const toCoords = typeof to === 'string' ? this.algebraicToCoords(to) : to;

        if (!fromCoords || !toCoords) return { success: false, error: 'Invalid coordinates' };

        const piece = this.getPiece(fromCoords.row, fromCoords.col);
        if (!piece) return { success: false, error: 'No piece at source' };
        if (piece.color !== this.currentPlayer) return { success: false, error: 'Not your piece' };

        // Check if move is legal
        const legalMoves = this.getLegalMoves(fromCoords.row, fromCoords.col);
        const isLegal = legalMoves.some(move => move.row === toCoords.row && move.col === toCoords.col);

        if (!isLegal) return { success: false, error: 'Illegal move' };

        // Execute the move
        const capturedPiece = this.getPiece(toCoords.row, toCoords.col);
        const moveData = {
            from: this.coordsToAlgebraic(fromCoords.row, fromCoords.col),
            to: this.coordsToAlgebraic(toCoords.row, toCoords.col),
            piece: piece.type,
            captured: capturedPiece ? capturedPiece.type : null,
            castling: false,
            enPassant: false,
            promotion: null,
            check: false,
            checkmate: false
        };

        // Handle castling
        if (piece.type === 'k' && Math.abs(toCoords.col - fromCoords.col) === 2) {
            moveData.castling = true;
            const isKingside = toCoords.col > fromCoords.col;
            const rookCol = isKingside ? 7 : 0;
            const newRookCol = isKingside ? toCoords.col - 1 : toCoords.col + 1;
            const rook = this.getPiece(fromCoords.row, rookCol);
            this.setPiece(fromCoords.row, newRookCol, rook);
            this.setPiece(fromCoords.row, rookCol, null);
        }

        // Handle en passant
        if (piece.type === 'p' && this.enPassantTarget &&
            toCoords.row === this.enPassantTarget.row && toCoords.col === this.enPassantTarget.col) {
            moveData.enPassant = true;
            const capturedPawnRow = piece.color === 'white' ? toCoords.row + 1 : toCoords.row - 1;
            const capturedPawn = this.getPiece(capturedPawnRow, toCoords.col);
            if (capturedPawn) {
                this.capturedPieces[piece.color].push(capturedPawn.type);
                moveData.captured = 'p';
            }
            this.setPiece(capturedPawnRow, toCoords.col, null);
        }

        // Move the piece
        this.setPiece(toCoords.row, toCoords.col, piece);
        this.setPiece(fromCoords.row, fromCoords.col, null);

        // Handle pawn promotion
        if (piece.type === 'p' && (toCoords.row === 0 || toCoords.row === 7)) {
            piece.type = promotionPiece;
            moveData.promotion = promotionPiece;
        }

        // Update en passant target
        this.enPassantTarget = null;
        if (piece.type === 'p' && Math.abs(toCoords.row - fromCoords.row) === 2) {
            this.enPassantTarget = {
                row: (fromCoords.row + toCoords.row) / 2,
                col: toCoords.col
            };
        }

        // Track king and rook moves for castling
        if (piece.type === 'k') {
            this.kingMoved[piece.color] = true;
        }
        if (piece.type === 'r') {
            if (fromCoords.col === 7) this.rookMoved[piece.color].kingside = true;
            if (fromCoords.col === 0) this.rookMoved[piece.color].queenside = true;
        }

        // Update captured pieces
        if (capturedPiece && !moveData.enPassant) {
            this.capturedPieces[piece.color].push(capturedPiece.type);
        }

        // Update move counters
        if (piece.type === 'p' || capturedPiece) {
            this.halfMoveClock = 0;
        } else {
            this.halfMoveClock++;
        }

        // Switch player
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        if (this.currentPlayer === 'white') this.fullMoveNumber++;

        // Check for check/checkmate
        if (this.isInCheck(this.currentPlayer)) {
            moveData.check = true;
            if (this.isCheckmate()) {
                moveData.checkmate = true;
            }
        }

        this.moveHistory.push(moveData);
        return { success: true, moveData };
    }
    // Undo a move (for AI search)
    undoMove(from, to, capturedPiece) {
        const fromCoords = typeof from === 'string' ? this.algebraicToCoords(from) : from;
        const toCoords = typeof to === 'string' ? this.algebraicToCoords(to) : to;

        if (!fromCoords || !toCoords) return;

        const piece = this.getPiece(toCoords.row, toCoords.col);
        if (!piece) return;

        // Move piece back
        this.setPiece(fromCoords.row, fromCoords.col, piece);
        
        // Restore captured piece if any
        if (capturedPiece) {
            const capturedPieceObj = {
                type: capturedPiece,
                color: this.currentPlayer // The piece that was captured belonged to current player (before switch)
            };
            this.setPiece(toCoords.row, toCoords.col, capturedPieceObj);
        } else {
            this.setPiece(toCoords.row, toCoords.col, null);
        }

        // Switch player back
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';

        // Remove last move from history
        if (this.moveHistory.length > 0) {
            this.moveHistory.pop();
        }
    }


    // Get all legal moves for a piece
    getLegalMoves(row, col) {
        const piece = this.getPiece(row, col);
        if (!piece) return [];

        const pseudoLegalMoves = this.getPseudoLegalMoves(row, col);
        const legalMoves = [];

        // Filter out moves that leave king in check
        for (const move of pseudoLegalMoves) {
            if (this.isMoveLegal(row, col, move.row, move.col)) {
                legalMoves.push(move);
            }
        }

        return legalMoves;
    }
    // Get all legal moves for the current player (used by AI)
    getAllLegalMoves() {
        const allMoves = [];

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.getPiece(row, col);
                if (piece && piece.color === this.currentPlayer) {
                    const moves = this.getLegalMoves(row, col);
                    for (const move of moves) {
                        allMoves.push({
                            from: this.coordsToAlgebraic(row, col),
                            to: this.coordsToAlgebraic(move.row, move.col),
                            fromRow: row,
                            fromCol: col,
                            toRow: move.row,
                            toCol: move.col,
                            promotion: move.promotion
                        });
                    }
                }
            }
        }

        return allMoves;
    }


    // Get pseudo-legal moves (ignoring check)
    getPseudoLegalMoves(row, col) {
        const piece = this.getPiece(row, col);
        if (!piece) return [];

        const moves = [];

        switch (piece.type) {
            case 'p':
                moves.push(...this.getPawnMoves(row, col, piece.color));
                break;
            case 'n':
                moves.push(...this.getKnightMoves(row, col, piece.color));
                break;
            case 'b':
                moves.push(...this.getBishopMoves(row, col, piece.color));
                break;
            case 'r':
                moves.push(...this.getRookMoves(row, col, piece.color));
                break;
            case 'q':
                moves.push(...this.getQueenMoves(row, col, piece.color));
                break;
            case 'k':
                moves.push(...this.getKingMoves(row, col, piece.color));
                break;
        }

        return moves;
    }

    getPawnMoves(row, col, color) {
        const moves = [];
        const direction = color === 'white' ? -1 : 1;
        const startRow = color === 'white' ? 6 : 1;

        // Forward move
        const newRow = row + direction;
        if (newRow >= 0 && newRow <= 7 && !this.getPiece(newRow, col)) {
            moves.push({ row: newRow, col });

            // Double move from start
            if (row === startRow) {
                const doubleRow = row + 2 * direction;
                if (!this.getPiece(doubleRow, col)) {
                    moves.push({ row: doubleRow, col });
                }
            }
        }

        // Captures
        for (const colOffset of [-1, 1]) {
            const newCol = col + colOffset;
            if (newCol >= 0 && newCol <= 7 && newRow >= 0 && newRow <= 7) {
                const target = this.getPiece(newRow, newCol);
                if (target && target.color !== color) {
                    moves.push({ row: newRow, col: newCol });
                }
                // En passant
                if (this.enPassantTarget && newRow === this.enPassantTarget.row && newCol === this.enPassantTarget.col) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        }

        return moves;
    }

    getKnightMoves(row, col, color) {
        const moves = [];
        const offsets = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1]
        ];

        for (const [rowOffset, colOffset] of offsets) {
            const newRow = row + rowOffset;
            const newCol = col + colOffset;
            if (newRow >= 0 && newRow <= 7 && newCol >= 0 && newCol <= 7) {
                const target = this.getPiece(newRow, newCol);
                if (!target || target.color !== color) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        }

        return moves;
    }

    getBishopMoves(row, col, color) {
        return this.getSlidingMoves(row, col, color, [[-1, -1], [-1, 1], [1, -1], [1, 1]]);
    }

    getRookMoves(row, col, color) {
        return this.getSlidingMoves(row, col, color, [[-1, 0], [1, 0], [0, -1], [0, 1]]);
    }

    getQueenMoves(row, col, color) {
        return this.getSlidingMoves(row, col, color, [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ]);
    }

    getSlidingMoves(row, col, color, directions) {
        const moves = [];

        for (const [rowDir, colDir] of directions) {
            let newRow = row + rowDir;
            let newCol = col + colDir;

            while (newRow >= 0 && newRow <= 7 && newCol >= 0 && newCol <= 7) {
                const target = this.getPiece(newRow, newCol);
                if (!target) {
                    moves.push({ row: newRow, col: newCol });
                } else {
                    if (target.color !== color) {
                        moves.push({ row: newRow, col: newCol });
                    }
                    break;
                }
                newRow += rowDir;
                newCol += colDir;
            }
        }

        return moves;
    }

    getKingMoves(row, col, color) {
        const moves = [];
        const offsets = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        for (const [rowOffset, colOffset] of offsets) {
            const newRow = row + rowOffset;
            const newCol = col + colOffset;
            if (newRow >= 0 && newRow <= 7 && newCol >= 0 && newCol <= 7) {
                const target = this.getPiece(newRow, newCol);
                if (!target || target.color !== color) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        }

        // Castling
        if (!this.kingMoved[color] && !this.isInCheck(color)) {
            // Kingside
            if (!this.rookMoved[color].kingside) {
                if (!this.getPiece(row, 5) && !this.getPiece(row, 6)) {
                    const opponent = color === 'white' ? 'black' : 'white';
                    if (!this.isSquareUnderAttack(row, 5, opponent) && !this.isSquareUnderAttack(row, 6, opponent)) {
                        moves.push({ row, col: 6 });
                    }
                }
            }
            // Queenside
            if (!this.rookMoved[color].queenside) {
                if (!this.getPiece(row, 1) && !this.getPiece(row, 2) && !this.getPiece(row, 3)) {
                    const opponent = color === 'white' ? 'black' : 'white';
                    if (!this.isSquareUnderAttack(row, 2, opponent) && !this.isSquareUnderAttack(row, 3, opponent)) {
                        moves.push({ row, col: 2 });
                    }
                }
            }
        }

        return moves;
    }

    // Check if a move is legal (doesn't leave king in check)
    isMoveLegal(fromRow, fromCol, toRow, toCol) {
        // Make a copy of the board state
        const originalBoard = this.board.map(row => row.slice());
        const originalEnPassant = this.enPassantTarget;

        // Make the move temporarily
        const piece = this.getPiece(fromRow, fromCol);
        const capturedPiece = this.getPiece(toRow, toCol);
        this.setPiece(toRow, toCol, piece);
        this.setPiece(fromRow, fromCol, null);

        // Handle en passant capture
        let enPassantCaptured = null;
        if (piece.type === 'p' && this.enPassantTarget &&
            toRow === this.enPassantTarget.row && toCol === this.enPassantTarget.col) {
            const capturedPawnRow = piece.color === 'white' ? toRow + 1 : toRow - 1;
            enPassantCaptured = this.getPiece(capturedPawnRow, toCol);
            this.setPiece(capturedPawnRow, toCol, null);
        }

        // Check if king is in check
        const inCheck = this.isInCheck(piece.color);

        // Restore board state
        this.board = originalBoard;
        this.enPassantTarget = originalEnPassant;

        return !inCheck;
    }

    // Check if current player is in checkmate
    isCheckmate() {
        if (!this.isInCheck(this.currentPlayer)) return false;

        // Check if any legal move exists
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.getPiece(row, col);
                if (piece && piece.color === this.currentPlayer) {
                    const legalMoves = this.getLegalMoves(row, col);
                    if (legalMoves.length > 0) return false;
                }
            }
        }

        return true;
    }

    // Check if game is stalemate
    isStalemate() {
        if (this.isInCheck(this.currentPlayer)) return false;

        // Check if any legal move exists
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.getPiece(row, col);
                if (piece && piece.color === this.currentPlayer) {
                    const legalMoves = this.getLegalMoves(row, col);
                    if (legalMoves.length > 0) return false;
                }
            }
        }

        return true;
    }

    // Check for draw by insufficient material
    isInsufficientMaterial() {
        const pieces = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.getPiece(row, col);
                if (piece) pieces.push(piece);
            }
        }

        // King vs King
        if (pieces.length === 2) return true;

        // King + Bishop/Knight vs King
        if (pieces.length === 3) {
            return pieces.some(p => p.type === 'b' || p.type === 'n');
        }

        // King + Bishop vs King + Bishop (same color squares)
        if (pieces.length === 4) {
            const bishops = pieces.filter(p => p.type === 'b');
            if (bishops.length === 2) {
                // Check if bishops are on same color squares
                // This is a simplified check
                return true;
            }
        }

        return false;
    }

    // Check for draw by 50-move rule
    isFiftyMoveRule() {
        return this.halfMoveClock >= 100; // 50 moves = 100 half-moves
    }

    // Get game status
    getGameStatus() {
        if (this.isCheckmate()) {
            const winner = this.currentPlayer === 'white' ? 'black' : 'white';
            return { status: 'checkmate', winner };
        }
        if (this.isStalemate()) {
            return { status: 'stalemate', winner: null };
        }
        if (this.isInsufficientMaterial()) {
            return { status: 'insufficient_material', winner: null };
        }
        if (this.isFiftyMoveRule()) {
            return { status: 'fifty_move_rule', winner: null };
        }
        if (this.isInCheck(this.currentPlayer)) {
            return { status: 'check', winner: null };
        }
        return { status: 'active', winner: null };
    }
    // Check if game is over
    isGameOver() {
        return this.isCheckmate() || this.isStalemate() ||
               this.isInsufficientMaterial() || this.isFiftyMoveRule();
    }

}
