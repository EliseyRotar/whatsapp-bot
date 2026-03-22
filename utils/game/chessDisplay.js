// Chess Board Display with Unicode pieces

const PIECES = {
    white: {
        k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙'
    },
    black: {
        k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟'
    }
};

export function displayBoard(engine, showCoords = true) {
    let display = '';
    
    if (showCoords) {
        display += '```\n';
        display += '  ┌─────────────────┐\n';
    } else {
        display += '┌─────────────────┐\n';
    }
    
    for (let row = 0; row < 8; row++) {
        const rank = 8 - row;
        if (showCoords) {
            display += `${rank} │`;
        } else {
            display += '│';
        }
        
        for (let col = 0; col < 8; col++) {
            const piece = engine.getPiece(row, col);
            if (piece) {
                display += ` ${PIECES[piece.color][piece.type]}`;
            } else {
                // Checkerboard pattern
                const isLight = (row + col) % 2 === 0;
                display += isLight ? ' ·' : ' ·';
            }
        }
        
        display += ' │\n';
    }
    
    if (showCoords) {
        display += '  └─────────────────┘\n';
        display += '    a b c d e f g h\n';
        display += '```';
    } else {
        display += '└─────────────────┘';
    }
    
    return display;
}

export function displayCompactBoard(engine) {
    let display = '```\n';
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = engine.getPiece(row, col);
            if (piece) {
                display += PIECES[piece.color][piece.type];
            } else {
                display += '·';
            }
        }
        display += '\n';
    }
    
    display += '```';
    return display;
}

export function displayMoveHistory(engine, lastN = 5) {
    const history = engine.moveHistory.slice(-lastN);
    if (history.length === 0) return 'No moves yet';
    
    let display = '📜 Recent Moves:\n';
    history.forEach((move, index) => {
        const moveNum = engine.moveHistory.length - lastN + index + 1;
        const halfMove = (moveNum - 1) * 2 + (move.piece === move.piece.toUpperCase() ? 1 : 2);
        const fullMove = Math.floor(halfMove / 2) + 1;
        
        let notation = '';
        if (move.castling) {
            notation = move.to === 'g1' || move.to === 'g8' ? 'O-O' : 'O-O-O';
        } else {
            const pieceSymbol = move.piece === 'p' ? '' : move.piece.toUpperCase();
            const capture = move.captured ? 'x' : '';
            const promotion = move.promotion ? `=${move.promotion.toUpperCase()}` : '';
            const check = move.checkmate ? '#' : move.check ? '+' : '';
            notation = `${pieceSymbol}${move.from}${capture}${move.to}${promotion}${check}`;
        }
        
        display += `${fullMove}. ${notation}\n`;
    });
    
    return display;
}

export function displayCapturedPieces(engine) {
    let display = '';
    
    const whiteCaptured = engine.capturedPieces.white;
    const blackCaptured = engine.capturedPieces.black;
    
    if (whiteCaptured.length > 0) {
        display += '⚪ White captured: ';
        whiteCaptured.forEach(piece => {
            display += PIECES.black[piece] + ' ';
        });
        display += '\n';
    }
    
    if (blackCaptured.length > 0) {
        display += '⚫ Black captured: ';
        blackCaptured.forEach(piece => {
            display += PIECES.white[piece] + ' ';
        });
        display += '\n';
    }
    
    return display || 'No pieces captured yet';
}

export function displayGameInfo(engine, lang = 'en') {
    const status = engine.getGameStatus();
    const currentPlayer = engine.currentPlayer;
    
    const messages = {
        en: {
            turn: `🎯 Turn: ${currentPlayer === 'white' ? 'White ⚪' : 'Black ⚫'}`,
            check: '⚠️ CHECK!',
            checkmate: `🏆 CHECKMATE! ${status.winner === 'white' ? 'White ⚪' : 'Black ⚫'} wins!`,
            stalemate: '🤝 STALEMATE! Game is a draw.',
            insufficient: '🤝 Draw by insufficient material.',
            fifty: '🤝 Draw by 50-move rule.',
            moves: `📊 Move: ${engine.fullMoveNumber}`
        },
        it: {
            turn: `🎯 Turno: ${currentPlayer === 'white' ? 'Bianco ⚪' : 'Nero ⚫'}`,
            check: '⚠️ SCACCO!',
            checkmate: `🏆 SCACCO MATTO! ${status.winner === 'white' ? 'Bianco ⚪' : 'Nero ⚫'} vince!`,
            stalemate: '🤝 STALLO! Partita patta.',
            insufficient: '🤝 Patta per materiale insufficiente.',
            fifty: '🤝 Patta per regola delle 50 mosse.',
            moves: `📊 Mossa: ${engine.fullMoveNumber}`
        },
        ru: {
            turn: `🎯 Ход: ${currentPlayer === 'white' ? 'Белые ⚪' : 'Черные ⚫'}`,
            check: '⚠️ ШАХ!',
            checkmate: `🏆 МАТ! ${status.winner === 'white' ? 'Белые ⚪' : 'Черные ⚫'} победили!`,
            stalemate: '🤝 ПАТ! Ничья.',
            insufficient: '🤝 Ничья из-за недостатка материала.',
            fifty: '🤝 Ничья по правилу 50 ходов.',
            moves: `📊 Ход: ${engine.fullMoveNumber}`
        },
        es: {
            turn: `🎯 Turno: ${currentPlayer === 'white' ? 'Blancas ⚪' : 'Negras ⚫'}`,
            check: '⚠️ ¡JAQUE!',
            checkmate: `🏆 ¡JAQUE MATE! ¡${status.winner === 'white' ? 'Blancas ⚪' : 'Negras ⚫'} ganan!`,
            stalemate: '🤝 ¡TABLAS! Empate.',
            insufficient: '🤝 Tablas por material insuficiente.',
            fifty: '🤝 Tablas por regla de 50 movimientos.',
            moves: `📊 Movimiento: ${engine.fullMoveNumber}`
        },
        pt: {
            turn: `🎯 Vez: ${currentPlayer === 'white' ? 'Brancas ⚪' : 'Pretas ⚫'}`,
            check: '⚠️ XEQUE!',
            checkmate: `🏆 XEQUE-MATE! ${status.winner === 'white' ? 'Brancas ⚪' : 'Pretas ⚫'} vencem!`,
            stalemate: '🤝 EMPATE! Jogo empatado.',
            insufficient: '🤝 Empate por material insuficiente.',
            fifty: '🤝 Empate pela regra dos 50 movimentos.',
            moves: `📊 Movimento: ${engine.fullMoveNumber}`
        },
        ar: {
            turn: `🎯 الدور: ${currentPlayer === 'white' ? 'أبيض ⚪' : 'أسود ⚫'}`,
            check: '⚠️ كش!',
            checkmate: `🏆 كش مات! ${status.winner === 'white' ? 'أبيض ⚪' : 'أسود ⚫'} فاز!`,
            stalemate: '🤝 تعادل! اللعبة تعادل.',
            insufficient: '🤝 تعادل بسبب مواد غير كافية.',
            fifty: '🤝 تعادل بقاعدة 50 حركة.',
            moves: `📊 الحركة: ${engine.fullMoveNumber}`
        }
    };
    
    const t = messages[lang] || messages.en;
    let info = '';
    
    if (status.status === 'checkmate') {
        info += t.checkmate + '\n';
    } else if (status.status === 'stalemate') {
        info += t.stalemate + '\n';
    } else if (status.status === 'insufficient_material') {
        info += t.insufficient + '\n';
    } else if (status.status === 'fifty_move_rule') {
        info += t.fifty + '\n';
    } else {
        info += t.turn + '\n';
        if (status.status === 'check') {
            info += t.check + '\n';
        }
    }
    
    info += t.moves;
    
    return info;
}
