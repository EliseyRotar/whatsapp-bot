import { getGroupLanguage } from '../../utils/language.js';

// Store active games
const activeGames = new Map();

const responses = {
    en: {
        usage: 'Play Tic-Tac-Toe!\n\nUsage:\n• .ttt - Play vs bot\n• .ttt @user - Challenge a player\n\nMake moves: .ttt <1-9>',
        title: '⭕ TIC-TAC-TOE ❌',
        player: '👤 Player:',
        yourTurn: 'Your turn!',
        botTurn: 'Bot\'s turn...',
        player1Turn: 'Player 1\'s turn',
        player2Turn: 'Player 2\'s turn',
        youWin: 'You win! 🎉',
        youLose: 'You lose! 😢',
        player1Wins: 'Player 1 wins! 🎉',
        player2Wins: 'Player 2 wins! 🎉',
        tie: 'It\'s a tie! 🤝',
        invalidMove: 'Invalid move! Choose an empty position (1-9)',
        notYourTurn: 'It\'s not your turn!',
        noGame: 'No active game! Start one with .ttt or .ttt @user',
        alreadyPlaying: 'You already have an active game!',
        opponentPlaying: 'That player is already in a game!',
        selfChallenge: 'You cannot challenge yourself!',
        challenged: 'challenged',
        waiting: 'Waiting for opponent to accept...',
        accept: 'Type .ttt to accept the challenge!',
        expired: 'Challenge expired!',
        positions: 'Positions:\n1️⃣ 2️⃣ 3️⃣\n4️⃣ 5️⃣ 6️⃣\n7️⃣ 8️⃣ 9️⃣'
    },
    it: {
        usage: 'Gioca a Tris!\n\nUso:\n• .ttt - Gioca vs bot\n• .ttt @utente - Sfida un giocatore\n\nFai mosse: .ttt <1-9>',
        title: '⭕ TRIS ❌',
        player: '👤 Giocatore:',
        yourTurn: 'Il tuo turno!',
        botTurn: 'Turno del bot...',
        player1Turn: 'Turno Giocatore 1',
        player2Turn: 'Turno Giocatore 2',
        youWin: 'Hai vinto! 🎉',
        youLose: 'Hai perso! 😢',
        player1Wins: 'Giocatore 1 vince! 🎉',
        player2Wins: 'Giocatore 2 vince! 🎉',
        tie: 'Pareggio! 🤝',
        invalidMove: 'Mossa non valida! Scegli una posizione vuota (1-9)',
        notYourTurn: 'Non è il tuo turno!',
        noGame: 'Nessun gioco attivo! Iniziane uno con .ttt o .ttt @utente',
        alreadyPlaying: 'Hai già un gioco attivo!',
        opponentPlaying: 'Quel giocatore è già in un gioco!',
        selfChallenge: 'Non puoi sfidare te stesso!',
        challenged: 'ha sfidato',
        waiting: 'In attesa che l\'avversario accetti...',
        accept: 'Scrivi .ttt per accettare la sfida!',
        expired: 'Sfida scaduta!',
        positions: 'Posizioni:\n1️⃣ 2️⃣ 3️⃣\n4️⃣ 5️⃣ 6️⃣\n7️⃣ 8️⃣ 9️⃣'
    },
    ru: {
        usage: 'Играйте в крестики-нолики!\n\nИспользование:\n• .ttt - Играть против бота\n• .ttt @пользователь - Бросить вызов игроку\n\nДелайте ходы: .ttt <1-9>',
        title: '⭕ КРЕСТИКИ-НОЛИКИ ❌',
        player: '👤 Игрок:',
        yourTurn: 'Ваш ход!',
        botTurn: 'Ход бота...',
        player1Turn: 'Ход игрока 1',
        player2Turn: 'Ход игрока 2',
        youWin: 'Вы выиграли! 🎉',
        youLose: 'Вы проиграли! 😢',
        player1Wins: 'Игрок 1 выигрывает! 🎉',
        player2Wins: 'Игрок 2 выигрывает! 🎉',
        tie: 'Ничья! 🤝',
        invalidMove: 'Неверный ход! Выберите пустую позицию (1-9)',
        notYourTurn: 'Не ваш ход!',
        noGame: 'Нет активной игры! Начните с .ttt или .ttt @пользователь',
        alreadyPlaying: 'У вас уже есть активная игра!',
        opponentPlaying: 'Этот игрок уже в игре!',
        selfChallenge: 'Вы не можете бросить вызов себе!',
        challenged: 'бросил вызов',
        waiting: 'Ожидание принятия вызова противником...',
        accept: 'Напишите .ttt чтобы принять вызов!',
        expired: 'Вызов истёк!',
        positions: 'Позиции:\n1️⃣ 2️⃣ 3️⃣\n4️⃣ 5️⃣ 6️⃣\n7️⃣ 8️⃣ 9️⃣'
    },
    es: {
        usage: '¡Juega al tres en raya!\n\nUso:\n• .ttt - Jugar contra el bot\n• .ttt @usuario - Desafiar a un jugador\n\nHaz movimientos: .ttt <1-9>',
        title: '⭕ TRES EN RAYA ❌',
        player: '👤 Jugador:',
        yourTurn: '¡Tu turno!',
        botTurn: 'Turno del bot...',
        player1Turn: 'Turno del jugador 1',
        player2Turn: 'Turno del jugador 2',
        youWin: '¡Ganaste! 🎉',
        youLose: '¡Perdiste! 😢',
        player1Wins: '¡Jugador 1 gana! 🎉',
        player2Wins: '¡Jugador 2 gana! 🎉',
        tie: '¡Empate! 🤝',
        invalidMove: '¡Movimiento inválido! Elige una posición vacía (1-9)',
        notYourTurn: '¡No es tu turno!',
        noGame: '¡No hay juego activo! Inicia con .ttt o .ttt @usuario',
        alreadyPlaying: '¡Ya tienes un juego activo!',
        opponentPlaying: '¡Este jugador ya está en un juego!',
        selfChallenge: '¡No puedes desafiarte a ti mismo!',
        challenged: 'desafió a',
        waiting: 'Esperando que el oponente acepte el desafío...',
        accept: '¡Escribe .ttt para aceptar el desafío!',
        expired: '¡Desafío expirado!',
        positions: 'Posiciones:\n1️⃣ 2️⃣ 3️⃣\n4️⃣ 5️⃣ 6️⃣\n7️⃣ 8️⃣ 9️⃣'
    },
    pt: {
        usage: 'Jogue Jogo da Velha!\n\nUso:\n• .ttt - Jogar contra o bot\n• .ttt @usuário - Desafiar um jogador\n\nFaça movimentos: .ttt <1-9>',
        title: '⭕ JOGO DA VELHA ❌',
        player: '👤 Jogador:',
        yourTurn: 'Sua vez!',
        botTurn: 'Vez do bot...',
        player1Turn: 'Vez do jogador 1',
        player2Turn: 'Vez do jogador 2',
        youWin: 'Você ganhou! 🎉',
        youLose: 'Você perdeu! 😢',
        player1Wins: 'Jogador 1 vence! 🎉',
        player2Wins: 'Jogador 2 vence! 🎉',
        tie: 'Empate! 🤝',
        invalidMove: 'Movimento inválido! Escolha uma posição vazia (1-9)',
        notYourTurn: 'Não é sua vez!',
        noGame: 'Nenhum jogo ativo! Inicie com .ttt ou .ttt @usuário',
        alreadyPlaying: 'Você já tem um jogo ativo!',
        opponentPlaying: 'Este jogador já está em um jogo!',
        selfChallenge: 'Você não pode desafiar a si mesmo!',
        challenged: 'desafiou',
        waiting: 'Aguardando oponente aceitar o desafio...',
        accept: 'Digite .ttt para aceitar o desafio!',
        expired: 'Desafio expirado!',
        positions: 'Posições:\n1️⃣ 2️⃣ 3️⃣\n4️⃣ 5️⃣ 6️⃣\n7️⃣ 8️⃣ 9️⃣'
    },
    ar: {
        usage: 'العب XO!\n\nالاستخدام:\n• .ttt - العب ضد البوت\n• .ttt @مستخدم - تحدى لاعب\n\nاعمل حركات: .ttt <1-9>',
        title: '⭕ XO ❌',
        player: '👤 اللاعب:',
        yourTurn: 'دورك!',
        botTurn: 'دور البوت...',
        player1Turn: 'دور اللاعب 1',
        player2Turn: 'دور اللاعب 2',
        youWin: 'انت كسبت! 🎉',
        youLose: 'انت خسرت! 😢',
        player1Wins: 'اللاعب 1 كسب! 🎉',
        player2Wins: 'اللاعب 2 كسب! 🎉',
        tie: 'تعادل! 🤝',
        invalidMove: 'حركة غلط! اختار مكان فاضي (1-9)',
        notYourTurn: 'مش دورك!',
        noGame: 'مفيش لعبة نشطة! ابدأ بـ .ttt أو .ttt @مستخدم',
        alreadyPlaying: 'عندك لعبة نشطة خلاص!',
        opponentPlaying: 'اللاعب ده في لعبة خلاص!',
        selfChallenge: 'متقدرش تتحدى نفسك!',
        challenged: 'تحدى',
        waiting: 'مستنيين الخصم يقبل التحدي...',
        accept: 'اكتب .ttt عشان تقبل التحدي!',
        expired: 'التحدي انتهى!',
        positions: 'المواقع:\n1️⃣ 2️⃣ 3️⃣\n4️⃣ 5️⃣ 6️⃣\n7️⃣ 8️⃣ 9️⃣'
    },
    hi: {
        usage: 'टिक-टैक-टो खेलें!\n\nउपयोग:\n• .ttt - बॉट के विरुद्ध खेलें\n• .ttt @उपयोगकर्ता - खिलाड़ी को चुनौती दें\n\nचालें चलें: .ttt <1-9>',
        title: '⭕ टिक-टैक-टो ❌',
        player: '👤 खिलाड़ी:',
        yourTurn: 'आपकी बारी!',
        botTurn: 'बॉट की बारी...',
        player1Turn: 'खिलाड़ी 1 की बारी',
        player2Turn: 'खिलाड़ी 2 की बारी',
        youWin: 'आप जीते! 🎉',
        youLose: 'आप हारे! 😢',
        player1Wins: 'खिलाड़ी 1 जीता! 🎉',
        player2Wins: 'खिलाड़ी 2 जीता! 🎉',
        tie: 'बराबरी! 🤝',
        invalidMove: 'अमान्य चाल! खाली स्थान चुनें (1-9)',
        notYourTurn: 'यह आपकी बारी नहीं है!',
        noGame: 'कोई सक्रिय खेल नहीं! .ttt या .ttt @उपयोगकर्ता से शुरू करें',
        alreadyPlaying: 'आपके पास पहले से एक सक्रिय खेल है!',
        opponentPlaying: 'वह खिलाड़ी पहले से खेल में है!',
        selfChallenge: 'आप स्वयं को चुनौती नहीं दे सकते!',
        challenged: 'ने चुनौती दी',
        waiting: 'प्रतिद्वंद्वी के स्वीकार करने की प्रतीक्षा में...',
        accept: 'चुनौती स्वीकार करने के लिए .ttt टाइप करें!',
        expired: 'चुनौती समाप्त हो गई!',
        positions: 'स्थान:\n1️⃣ 2️⃣ 3️⃣\n4️⃣ 5️⃣ 6️⃣\n7️⃣ 8️⃣ 9️⃣'
    },
    ng: {
        usage: 'Play Tic-Tac-Toe!\n\nHow to use:\n• .ttt - Play with bot\n• .ttt @person - Challenge person\n\nMake moves: .ttt <1-9>',
        title: '⭕ TIC-TAC-TOE ❌',
        player: '👤 Player:',
        yourTurn: 'Na your turn!',
        botTurn: 'Bot dey play...',
        player1Turn: 'Player 1 turn',
        player2Turn: 'Player 2 turn',
        youWin: 'You win am! 🎉',
        youLose: 'You lose am! 😢',
        player1Wins: 'Player 1 don win! 🎉',
        player2Wins: 'Player 2 don win! 🎉',
        tie: 'Na draw! 🤝',
        invalidMove: 'Dat move no correct! Choose empty space (1-9)',
        notYourTurn: 'No be your turn!',
        noGame: 'No game dey active! Start one with .ttt or .ttt @person',
        alreadyPlaying: 'You don already get active game!',
        opponentPlaying: 'Dat player don dey inside game already!',
        selfChallenge: 'You no fit challenge yourself!',
        challenged: 'don challenge',
        waiting: 'We dey wait for opponent to accept...',
        accept: 'Type .ttt to accept di challenge!',
        expired: 'Challenge don expire!',
        positions: 'Positions:\n1️⃣ 2️⃣ 3️⃣\n4️⃣ 5️⃣ 6️⃣\n7️⃣ 8️⃣ 9️⃣'
    }
};

function renderBoard(board) {
    const symbols = {
        'X': '❌',
        'O': '⭕',
        '': '⬜'
    };
    
    let display = '';
    for (let i = 0; i < 9; i += 3) {
        display += `${symbols[board[i]]} ${symbols[board[i+1]]} ${symbols[board[i+2]]}\n`;
    }
    return display;
}

function checkWinner(board) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];
    
    for (const [a, b, c] of lines) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    
    return board.includes('') ? null : 'tie';
}

function getBotMove(board) {
    // Simple AI: Try to win, block player, or take center/corner
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    
    // Try to win
    for (const [a, b, c] of lines) {
        if (board[a] === 'O' && board[b] === 'O' && board[c] === '') return c;
        if (board[a] === 'O' && board[c] === 'O' && board[b] === '') return b;
        if (board[b] === 'O' && board[c] === 'O' && board[a] === '') return a;
    }
    
    // Block player
    for (const [a, b, c] of lines) {
        if (board[a] === 'X' && board[b] === 'X' && board[c] === '') return c;
        if (board[a] === 'X' && board[c] === 'X' && board[b] === '') return b;
        if (board[b] === 'X' && board[c] === 'X' && board[a] === '') return a;
    }
    
    // Take center
    if (board[4] === '') return 4;
    
    // Take corner
    const corners = [0, 2, 6, 8];
    for (const corner of corners) {
        if (board[corner] === '') return corner;
    }
    
    // Take any available
    return board.indexOf('');
}

export default {
    name: 'tictactoe',
    aliases: ['ttt'],
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const pushName = msg.pushName || 'Player';
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        // Check if making a move
        if (args.length === 1 && !isNaN(args[0])) {
            const position = parseInt(args[0]) - 1;
            
            if (position < 0 || position > 8) {
                return await sock.sendMessage(from, { text: t.invalidMove });
            }
            
            // Find active game for this user
            let game = null;
            let gameKey = null;
            
            for (const [key, g] of activeGames.entries()) {
                if (g.player1 === sender || g.player2 === sender) {
                    game = g;
                    gameKey = key;
                    break;
                }
            }
            
            if (!game) {
                return await sock.sendMessage(from, { text: t.noGame });
            }
            
            // Check if it's player's turn
            if (game.vsBot) {
                if (game.currentTurn !== 'X') {
                    return await sock.sendMessage(from, { text: t.notYourTurn });
                }
            } else {
                if ((game.currentTurn === 'X' && sender !== game.player1) ||
                    (game.currentTurn === 'O' && sender !== game.player2)) {
                    return await sock.sendMessage(from, { text: t.notYourTurn });
                }
            }
            
            // Make move
            if (game.board[position] !== '') {
                return await sock.sendMessage(from, { text: t.invalidMove });
            }
            
            game.board[position] = game.currentTurn;
            
            // Check for winner
            const winner = checkWinner(game.board);
            
            if (winner) {
                let resultText = `${t.title}\n\n${renderBoard(game.board)}\n`;
                
                if (winner === 'tie') {
                    resultText += t.tie;
                } else if (game.vsBot) {
                    resultText += winner === 'X' ? t.youWin : t.youLose;
                } else {
                    resultText += winner === 'X' ? t.player1Wins : t.player2Wins;
                }
                
                await sock.sendMessage(from, { text: resultText });
                activeGames.delete(gameKey);
                return;
            }
            
            // Switch turn
            game.currentTurn = game.currentTurn === 'X' ? 'O' : 'X';
            
            // Bot's turn
            if (game.vsBot && game.currentTurn === 'O') {
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const botMove = getBotMove(game.board);
                game.board[botMove] = 'O';
                
                const botWinner = checkWinner(game.board);
                
                if (botWinner) {
                    let resultText = `${t.title}\n\n${renderBoard(game.board)}\n`;
                    resultText += botWinner === 'tie' ? t.tie : t.youLose;
                    
                    await sock.sendMessage(from, { text: resultText });
                    activeGames.delete(gameKey);
                    return;
                }
                
                game.currentTurn = 'X';
            }
            
            // Show updated board
            let turnText = '';
            if (game.vsBot) {
                turnText = `${t.player} ${game.pushName || pushName}\nYou: ❌ | Bot: ⭕\n\n${t.yourTurn}`;
            } else {
                const currentPlayer = game.currentTurn === 'X' ? game.player1 : game.player2;
                turnText = `@${game.player1.split('@')[0]}: ❌ | @${game.player2.split('@')[0]}: ⭕\n\n`;
                turnText += game.currentTurn === 'X' ? 
                    `@${game.player1.split('@')[0]} ${t.player1Turn}` : 
                    `@${game.player2.split('@')[0]} ${t.player2Turn}`;
            }
            
            const boardText = `${t.title}\n\n${renderBoard(game.board)}\n${turnText}`;
            
            if (game.vsBot) {
                await sock.sendMessage(from, { text: boardText });
            } else {
                await sock.sendMessage(from, { 
                    text: boardText,
                    mentions: [game.player1, game.player2]
                });
            }
            
            return;
        }
        
        // Check if accepting a challenge
        if (args.length === 0) {
            // Check for pending challenge
            for (const [key, game] of activeGames.entries()) {
                if (game.player2 === sender && game.pending) {
                    game.pending = false;
                    
                    const boardText = `${t.title}\n\n${renderBoard(game.board)}\n@${game.player1.split('@')[0]}: ❌ | @${game.player2.split('@')[0]}: ⭕\n\n@${game.player1.split('@')[0]} ${t.player1Turn}\n\n${t.positions}`;
                    
                    await sock.sendMessage(from, { 
                        text: boardText,
                        mentions: [game.player1, game.player2]
                    });
                    return;
                }
            }
            
            // Check if already playing
            for (const [key, game] of activeGames.entries()) {
                if (game.player1 === sender || game.player2 === sender) {
                    return await sock.sendMessage(from, { text: t.alreadyPlaying });
                }
            }
            
            // Start new game vs bot
            const gameId = `${from}_${sender}_${Date.now()}`;
            activeGames.set(gameId, {
                player1: sender,
                player2: null,
                vsBot: true,
                board: ['', '', '', '', '', '', '', '', ''],
                currentTurn: 'X',
                groupJid: from,
                pushName
            });
            
            await sock.sendMessage(from, { 
                text: `${t.title}\n${t.player} ${pushName}\n\n${renderBoard(['', '', '', '', '', '', '', '', ''])}\nYou: ❌ | Bot: ⭕\n\n${t.yourTurn}\n\n${t.positions}`
            });
            
            return;
        }
        
        // Challenge another player
        const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        
        if (mentionedJid) {
            if (mentionedJid === sender) {
                return await sock.sendMessage(from, { text: t.selfChallenge });
            }
            
            // Check if either player is already in a game
            for (const [key, game] of activeGames.entries()) {
                if (game.player1 === sender || game.player2 === sender) {
                    return await sock.sendMessage(from, { text: t.alreadyPlaying });
                }
                if (game.player1 === mentionedJid || game.player2 === mentionedJid) {
                    return await sock.sendMessage(from, { text: t.opponentPlaying });
                }
            }
            
            const gameId = `${from}_${Date.now()}`;
            activeGames.set(gameId, {
                player1: sender,
                player2: mentionedJid,
                vsBot: false,
                board: ['', '', '', '', '', '', '', '', ''],
                currentTurn: 'X',
                groupJid: from,
                pending: true
            });
            
            await sock.sendMessage(from, { 
                text: `${t.title}\n\n@${sender.split('@')[0]} ${t.challenged} @${mentionedJid.split('@')[0]}!\n\n${t.waiting}\n${t.accept}`,
                mentions: [sender, mentionedJid]
            });
            
            // Auto-expire after 2 minutes
            setTimeout(() => {
                const game = activeGames.get(gameId);
                if (game && game.pending) {
                    activeGames.delete(gameId);
                }
            }, 120000);
            
            return;
        }
        
        await sock.sendMessage(from, { text: t.usage });
    }
};
