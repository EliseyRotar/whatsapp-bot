// Chess AI using Minimax with Alpha-Beta Pruning
// Based on standard chess programming techniques

// Piece values for evaluation
const PIECE_VALUES = {
    'p': 100,   // Pawn
    'n': 320,   // Knight
    'b': 330,   // Bishop
    'r': 500,   // Rook
    'q': 900,   // Queen
    'k': 20000  // King
};

// Piece-square tables for positional evaluation
// These tables give bonuses for pieces in good positions
const PIECE_SQUARE_TABLES = {
    'p': [ // Pawn
        [0,  0,  0,  0,  0,  0,  0,  0],
        [50, 50, 50, 50, 50, 50, 50, 50],
        [10, 10, 20, 30, 30, 20, 10, 10],
        [5,  5, 10, 25, 25, 10,  5,  5],
        [0,  0,  0, 20, 20,  0,  0,  0],
        [5, -5,-10,  0,  0,-10, -5,  5],
        [5, 10, 10,-20,-20, 10, 10,  5],
        [0,  0,  0,  0,  0,  0,  0,  0]
    ],
    'n': [ // Knight
        [-50,-40,-30,-30,-30,-30,-40,-50],
        [-40,-20,  0,  0,  0,  0,-20,-40],
        [-30,  0, 10, 15, 15, 10,  0,-30],
        [-30,  5, 15, 20, 20, 15,  5,-30],
        [-30,  0, 15, 20, 20, 15,  0,-30],
        [-30,  5, 10, 15, 15, 10,  5,-30],
        [-40,-20,  0,  5,  5,  0,-20,-40],
        [-50,-40,-30,-30,-30,-30,-40,-50]
    ],
    'b': [ // Bishop
        [-20,-10,-10,-10,-10,-10,-10,-20],
        [-10,  0,  0,  0,  0,  0,  0,-10],
        [-10,  0,  5, 10, 10,  5,  0,-10],
        [-10,  5,  5, 10, 10,  5,  5,-10],
        [-10,  0, 10, 10, 10, 10,  0,-10],
        [-10, 10, 10, 10, 10, 10, 10,-10],
        [-10,  5,  0,  0,  0,  0,  5,-10],
        [-20,-10,-10,-10,-10,-10,-10,-20]
    ],
    'r': [ // Rook
        [0,  0,  0,  0,  0,  0,  0,  0],
        [5, 10, 10, 10, 10, 10, 10,  5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [0,  0,  0,  5,  5,  0,  0,  0]
    ],
    'q': [ // Queen
        [-20,-10,-10, -5, -5,-10,-10,-20],
        [-10,  0,  0,  0,  0,  0,  0,-10],
        [-10,  0,  5,  5,  5,  5,  0,-10],
        [-5,  0,  5,  5,  5,  5,  0, -5],
        [0,  0,  5,  5,  5,  5,  0, -5],
        [-10,  5,  5,  5,  5,  5,  0,-10],
        [-10,  0,  5,  0,  0,  0,  0,-10],
        [-20,-10,-10, -5, -5,-10,-10,-20]
    ],
    'k': [ // King (middlegame)
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-20,-30,-30,-40,-40,-30,-30,-20],
        [-10,-20,-20,-20,-20,-20,-20,-10],
        [20, 20,  0,  0,  0,  0, 20, 20],
        [20, 30, 10,  0,  0, 10, 30, 20]
    ]
};

// Evaluate board position
export function evaluateBoard(engine) {
    let totalEvaluation = 0;
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = engine.board[row][col];
            if (piece) {
                totalEvaluation += getPieceValue(piece, row, col);
            }
        }
    }
    
    return totalEvaluation;
}

// Get piece value including positional bonus
function getPieceValue(piece, row, col) {
    const pieceType = piece.type.toLowerCase();
    const isWhite = piece.color === 'white';
    
    // Base value
    let value = PIECE_VALUES[pieceType];
    
    // Positional bonus
    if (PIECE_SQUARE_TABLES[pieceType]) {
        const table = PIECE_SQUARE_TABLES[pieceType];
        // Flip table for black pieces
        const tableRow = isWhite ? (7 - row) : row;
        value += table[tableRow][col];
    }
    
    // Return positive for white, negative for black
    return isWhite ? value : -value;
}

// Minimax with Alpha-Beta Pruning
function minimax(engine, depth, alpha, beta, isMaximizingPlayer) {
    // Base case: reached depth limit or game over
    if (depth === 0 || engine.isGameOver()) {
        return evaluateBoard(engine);
    }
    
    const moves = engine.getAllLegalMoves();
    
    if (isMaximizingPlayer) {
        let maxEval = -Infinity;
        
        for (const move of moves) {
            // Make move
            const result = engine.makeMove(move.from, move.to, move.promotion);
            if (!result.success) continue;
            
            const capturedPiece = result.moveData.captured;
            
            // Recursive call
            const evaluation = minimax(engine, depth - 1, alpha, beta, false);
            
            // Undo move
            engine.undoMove(move.from, move.to, capturedPiece);
            
            maxEval = Math.max(maxEval, evaluation);
            alpha = Math.max(alpha, evaluation);
            
            // Alpha-beta pruning
            if (beta <= alpha) {
                break;
            }
        }
        
        return maxEval;
    } else {
        let minEval = Infinity;
        
        for (const move of moves) {
            // Make move
            const result = engine.makeMove(move.from, move.to, move.promotion);
            if (!result.success) continue;
            
            const capturedPiece = result.moveData.captured;
            
            // Recursive call
            const evaluation = minimax(engine, depth - 1, alpha, beta, true);
            
            // Undo move
            engine.undoMove(move.from, move.to, capturedPiece);
            
            minEval = Math.min(minEval, evaluation);
            beta = Math.min(beta, evaluation);
            
            // Alpha-beta pruning
            if (beta <= alpha) {
                break;
            }
        }
        
        return minEval;
    }
}

// Find best move for AI
export function findBestMove(engine, difficulty = 'medium') {
    // Set search depth based on difficulty
    const depths = {
        'easy': 1,
        'medium': 2,
        'hard': 3,
        'expert': 4
    };
    
    const depth = depths[difficulty] || 2;
    
    const moves = engine.getAllLegalMoves();
    if (moves.length === 0) return null;
    
    let bestMove = null;
    let bestValue = -Infinity;
    const isWhite = engine.currentPlayer === 'white';
    
    // Shuffle moves for variety at same evaluation
    const shuffledMoves = moves.sort(() => Math.random() - 0.5);
    
    for (const move of shuffledMoves) {
        // Make move
        const result = engine.makeMove(move.from, move.to, move.promotion);
        if (!result.success) continue;
        
        const capturedPiece = result.moveData.captured;
        
        // Evaluate position
        const boardValue = -minimax(engine, depth - 1, -Infinity, Infinity, !isWhite);
        
        // Undo move
        engine.undoMove(move.from, move.to, capturedPiece);
        
        // Update best move
        if (boardValue > bestValue) {
            bestValue = boardValue;
            bestMove = move;
        }
    }
    
    return bestMove;
}

// Get random move (for easy difficulty or fallback)
export function getRandomMove(engine) {
    const moves = engine.getAllLegalMoves();
    if (moves.length === 0) return null;
    return moves[Math.floor(Math.random() * moves.length)];
}

// Make AI move with difficulty setting
export function makeAIMove(engine, difficulty = 'medium') {
    // Easy mode: 50% random, 50% best move
    if (difficulty === 'easy' && Math.random() < 0.5) {
        return getRandomMove(engine);
    }
    
    // Find and return best move
    return findBestMove(engine, difficulty);
}
