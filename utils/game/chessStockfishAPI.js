// Stockfish Chess API Integration
// Uses free chess-api.com for stronger AI moves

import fetch from 'node-fetch';

const STOCKFISH_API_URL = 'https://chess-api.com/v1';

/**
 * Get best move from Stockfish API
 * @param {string} fen - Current board position in FEN notation
 * @param {number} depth - Search depth (1-12, higher = stronger but slower)
 * @returns {Promise<Object>} - Move object with from/to notation
 */
export async function getStockfishMove(fen, depth = 8) {
    try {
        const url = `${STOCKFISH_API_URL}?fen=${encodeURIComponent(fen)}&depth=${Math.min(depth, 12)}`;
        
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(url, {
            signal: controller.signal
        });
        
        clearTimeout(timeout);
        
        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }
        
        const data = await response.json();

        if (data && data.move) {
            // API returns move in format like "e2e4" or "e7e8q" (with promotion)
            const moveStr = data.move;
            const from = moveStr.substring(0, 2);
            const to = moveStr.substring(2, 4);
            const promotion = moveStr.length > 4 ? moveStr[4] : null;

            return {
                from,
                to,
                promotion,
                eval: data.eval,
                text: data.text
            };
        }

        return null;
    } catch (error) {
        console.error('[STOCKFISH API] Error:', error.message);
        return null;
    }
}

/**
 * Convert chess engine board to FEN notation
 * @param {ChessEngine} engine - Chess engine instance
 * @returns {string} - FEN string
 */
export function boardToFEN(engine) {
    let fen = '';

    // 1. Piece placement
    for (let row = 0; row < 8; row++) {
        let emptyCount = 0;
        for (let col = 0; col < 8; col++) {
            const piece = engine.board[row][col];
            if (piece) {
                if (emptyCount > 0) {
                    fen += emptyCount;
                    emptyCount = 0;
                }
                const pieceChar = piece.color === 'white' 
                    ? piece.type.toUpperCase() 
                    : piece.type.toLowerCase();
                fen += pieceChar;
            } else {
                emptyCount++;
            }
        }
        if (emptyCount > 0) {
            fen += emptyCount;
        }
        if (row < 7) {
            fen += '/';
        }
    }

    // 2. Active color
    fen += ' ' + (engine.currentPlayer === 'white' ? 'w' : 'b');

    // 3. Castling availability
    let castling = '';
    if (!engine.kingMoved.white) {
        if (!engine.rookMoved.white.kingside) castling += 'K';
        if (!engine.rookMoved.white.queenside) castling += 'Q';
    }
    if (!engine.kingMoved.black) {
        if (!engine.rookMoved.black.kingside) castling += 'k';
        if (!engine.rookMoved.black.queenside) castling += 'q';
    }
    fen += ' ' + (castling || '-');

    // 4. En passant target
    if (engine.enPassantTarget) {
        const col = String.fromCharCode(97 + engine.enPassantTarget.col);
        const row = 8 - engine.enPassantTarget.row;
        fen += ' ' + col + row;
    } else {
        fen += ' -';
    }

    // 5. Halfmove clock
    fen += ' ' + engine.halfMoveClock;

    // 6. Fullmove number
    fen += ' ' + engine.fullMoveNumber;

    return fen;
}

/**
 * Make AI move using Stockfish API with fallback to local AI
 * @param {ChessEngine} engine - Chess engine instance
 * @param {string} difficulty - Difficulty level (easy/medium/hard/expert/stockfish)
 * @returns {Promise<Object>} - Move object
 */
export async function makeStockfishMove(engine, difficulty = 'stockfish') {
    // Import local AI as fallback
    const { makeAIMove } = await import('./chessAI.js');

    // If not using stockfish difficulty, use local AI
    if (difficulty !== 'stockfish') {
        return makeAIMove(engine, difficulty);
    }

    // Try Stockfish API
    const fen = boardToFEN(engine);
    const depth = 10; // Good balance of speed and strength
    
    const stockfishMove = await getStockfishMove(fen, depth);
    
    if (stockfishMove) {
        console.log('[STOCKFISH] Move:', stockfishMove.from, '->', stockfishMove.to, 
                    'Eval:', stockfishMove.eval);
        return stockfishMove;
    }

    // Fallback to local AI if API fails
    console.log('[STOCKFISH] API failed, using local AI');
    return makeAIMove(engine, 'hard');
}
