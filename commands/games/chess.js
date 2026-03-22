import { getGroupLanguage } from '../../utils/language.js';
import { createGame, getGame, deleteGame, isPlayerInGame, getPlayerColor, isPlayerTurn, updateMoveTime, formatDuration, getGameDuration } from '../../utils/chessGameManager.js';
import { displayBoard, displayGameInfo, displayCapturedPieces, displayMoveHistory } from '../../utils/chessDisplay.js';
import { makeAIMove } from '../../utils/chessAI.js';
import { makeStockfishMove } from '../../utils/chessStockfishAPI.js';

const responses = {
    en: {
        usage: `♟️ CHESS GAME

🎮 Start a game:
   .chess @opponent - Play vs player
   .chess ai [easy/medium/hard/expert] - Play vs AI

📋 Game commands:
   .chess move e2-e4 - Make a move
   .chess board - Show current board
   .chess resign - Resign the game
   .chess draw - Offer/accept draw
   .chess moves - Show move history
   .chess help - Show this help

💡 Move format:
   • Standard: e2-e4, d7-d5
   • Castling: e1-g1 (kingside), e1-c1 (queenside)
   • Promotion: e7-e8q (promote to queen)
   
🎯 Pieces: K=King, Q=Queen, R=Rook, B=Bishop, N=Knight, P=Pawn

🤖 AI Difficulty:
   • easy - Random moves
   • medium - Basic strategy (default)
   • hard - Advanced tactics
   • expert - Master level
   • stockfish - Grandmaster (online API)`,
        gameExists: '❌ A chess game is already in progress in this group!\n\nUse .chess board to see it or .chess resign to end it.',
        gameCreated: '♟️ CHESS GAME STARTED!\n\n⚪ White: @{white}\n⚫ Black: @{black}\n\n{board}\n\n{info}\n\n💡 Use .chess move e2-e4 to make a move',
        gameCreatedAI: '♟️ CHESS GAME VS AI!\n\n⚪ You (White): @{white}\n⚫ AI ({difficulty}): 🤖\n\n{board}\n\n{info}\n\n💡 Use .chess move e2-e4 to make a move',
        aiThinking: '🤖 AI is thinking...',
        aiMove: '🤖 AI played: {move}\n\n{board}\n\n{info}\n\n{captured}',
        noGame: '❌ No chess game in progress!\n\nStart one with: .chess @opponent',
        notInGame: '❌ You are not playing in this game!',
        notYourTurn: '❌ It\'s not your turn!\n\nWaiting for {player}...',
        invalidMove: '❌ Invalid move: {error}\n\n💡 Use format: .chess move e2-e4',
        moveMade: '♟️ Move: {move}\n\n{board}\n\n{info}\n\n{captured}',
        resigned: '🏳️ {player} resigned!\n\n🏆 {winner} wins!\n\nGame duration: {duration}',
        drawOffered: '🤝 {player} offers a draw!\n\nType .chess draw to accept',
        drawAccepted: '🤝 Draw accepted!\n\nGame ended in a draw.\n\nGame duration: {duration}',
        gameOver: '🏁 Game Over!\n\n{result}\n\nGame duration: {duration}',
        needOpponent: '❌ Please mention an opponent!\n\nUsage: .chess @opponent',
        cannotPlaySelf: '❌ You cannot play against yourself!',
        promotion: '\n👑 Pawn promoted to {piece}!'
    },
    it: {
        usage: `♟️ GIOCO DI SCACCHI

🎮 Inizia una partita:
   .chess @avversario
   .chess vs @avversario

📋 Comandi di gioco:
   .chess move e2-e4 - Fai una mossa
   .chess board - Mostra scacchiera
   .chess resign - Abbandona
   .chess draw - Offri/accetta patta
   .chess moves - Mostra cronologia mosse
   .chess help - Mostra questo aiuto

💡 Formato mosse:
   • Standard: e2-e4, d7-d5
   • Arrocco: e1-g1 (corto), e1-c1 (lungo)
   • Promozione: e7-e8q (promuovi a regina)
   
🎯 Pezzi: K=Re, Q=Regina, R=Torre, B=Alfiere, N=Cavallo, P=Pedone`,
        gameExists: '❌ Una partita di scacchi è già in corso in questo gruppo!\n\nUsa .chess board per vederla o .chess resign per terminarla.',
        gameCreated: '♟️ PARTITA DI SCACCHI INIZIATA!\n\n⚪ Bianco: @{white}\n⚫ Nero: @{black}\n\n{board}\n\n{info}\n\n💡 Usa .chess move e2-e4 per fare una mossa',
        noGame: '❌ Nessuna partita di scacchi in corso!\n\nInizia una con: .chess @avversario',
        notInGame: '❌ Non stai giocando in questa partita!',
        notYourTurn: '❌ Non è il tuo turno!\n\nAspettando {player}...',
        invalidMove: '❌ Mossa non valida: {error}\n\n💡 Usa formato: .chess move e2-e4',
        moveMade: '♟️ Mossa: {move}\n\n{board}\n\n{info}\n\n{captured}',
        resigned: '🏳️ {player} si è arreso!\n\n🏆 {winner} vince!\n\nDurata partita: {duration}',
        drawOffered: '🤝 {player} offre la patta!\n\nDigita .chess draw per accettare',
        drawAccepted: '🤝 Patta accettata!\n\nPartita terminata in patta.\n\nDurata partita: {duration}',
        gameOver: '🏁 Partita Terminata!\n\n{result}\n\nDurata partita: {duration}',
        needOpponent: '❌ Menziona un avversario!\n\nUso: .chess @avversario',
        cannotPlaySelf: '❌ Non puoi giocare contro te stesso!',
        promotion: '\n👑 Pedone promosso a {piece}!'
    },
    ru: {
        usage: `♟️ ШАХМАТНАЯ ИГРА

🎮 Начать игру:
   .chess @противник
   .chess vs @противник

📋 Команды игры:
   .chess move e2-e4 - Сделать ход
   .chess board - Показать доску
   .chess resign - Сдаться
   .chess draw - Предложить/принять ничью
   .chess moves - Показать историю ходов
   .chess help - Показать эту помощь

💡 Формат ходов:
   • Стандарт: e2-e4, d7-d5
   • Рокировка: e1-g1 (короткая), e1-c1 (длинная)
   • Превращение: e7-e8q (превратить в ферзя)
   
🎯 Фигуры: K=Король, Q=Ферзь, R=Ладья, B=Слон, N=Конь, P=Пешка`,
        gameExists: '❌ Шахматная партия уже идет в этой группе!\n\nИспользуйте .chess board чтобы увидеть или .chess resign чтобы закончить.',
        gameCreated: '♟️ ШАХМАТНАЯ ПАРТИЯ НАЧАТА!\n\n⚪ Белые: @{white}\n⚫ Черные: @{black}\n\n{board}\n\n{info}\n\n💡 Используйте .chess move e2-e4 для хода',
        noGame: '❌ Нет шахматной партии!\n\nНачните с: .chess @противник',
        notInGame: '❌ Вы не играете в этой партии!',
        notYourTurn: '❌ Не ваш ход!\n\nОжидание {player}...',
        invalidMove: '❌ Неверный ход: {error}\n\n💡 Используйте формат: .chess move e2-e4',
        moveMade: '♟️ Ход: {move}\n\n{board}\n\n{info}\n\n{captured}',
        resigned: '🏳️ {player} сдался!\n\n🏆 {winner} победил!\n\nДлительность игры: {duration}',
        drawOffered: '🤝 {player} предлагает ничью!\n\nНапишите .chess draw чтобы принять',
        drawAccepted: '🤝 Ничья принята!\n\nИгра закончилась вничью.\n\nДлительность игры: {duration}',
        gameOver: '🏁 Игра Окончена!\n\n{result}\n\nДлительность игры: {duration}',
        needOpponent: '❌ Упомяните противника!\n\nИспользование: .chess @противник',
        cannotPlaySelf: '❌ Вы не можете играть против себя!',
        promotion: '\n👑 Пешка превращена в {piece}!'
    },
    es: {
        usage: `♟️ JUEGO DE AJEDREZ

🎮 Iniciar juego:
   .chess @oponente
   .chess vs @oponente

📋 Comandos de juego:
   .chess move e2-e4 - Hacer movimiento
   .chess board - Mostrar tablero
   .chess resign - Rendirse
   .chess draw - Ofrecer/aceptar tablas
   .chess moves - Mostrar historial
   .chess help - Mostrar esta ayuda

💡 Formato de movimientos:
   • Estándar: e2-e4, d7-d5
   • Enroque: e1-g1 (corto), e1-c1 (largo)
   • Promoción: e7-e8q (promover a reina)
   
🎯 Piezas: K=Rey, Q=Reina, R=Torre, B=Alfil, N=Caballo, P=Peón`,
        gameExists: '❌ ¡Ya hay un juego de ajedrez en curso en este grupo!\n\nUsa .chess board para verlo o .chess resign para terminarlo.',
        gameCreated: '♟️ ¡JUEGO DE AJEDREZ INICIADO!\n\n⚪ Blancas: @{white}\n⚫ Negras: @{black}\n\n{board}\n\n{info}\n\n💡 Usa .chess move e2-e4 para mover',
        noGame: '❌ ¡No hay juego de ajedrez en curso!\n\nInicia uno con: .chess @oponente',
        notInGame: '❌ ¡No estás jugando en este juego!',
        notYourTurn: '❌ ¡No es tu turno!\n\nEsperando a {player}...',
        invalidMove: '❌ Movimiento inválido: {error}\n\n💡 Usa formato: .chess move e2-e4',
        moveMade: '♟️ Movimiento: {move}\n\n{board}\n\n{info}\n\n{captured}',
        resigned: '🏳️ ¡{player} se rindió!\n\n🏆 ¡{winner} gana!\n\nDuración del juego: {duration}',
        drawOffered: '🤝 ¡{player} ofrece tablas!\n\nEscribe .chess draw para aceptar',
        drawAccepted: '🤝 ¡Tablas aceptadas!\n\nJuego terminado en tablas.\n\nDuración del juego: {duration}',
        gameOver: '🏁 ¡Juego Terminado!\n\n{result}\n\nDuración del juego: {duration}',
        needOpponent: '❌ ¡Menciona un oponente!\n\nUso: .chess @oponente',
        cannotPlaySelf: '❌ ¡No puedes jugar contra ti mismo!',
        promotion: '\n👑 ¡Peón promovido a {piece}!'
    },
    pt: {
        usage: `♟️ JOGO DE XADREZ

🎮 Iniciar jogo:
   .chess @oponente
   .chess vs @oponente

📋 Comandos do jogo:
   .chess move e2-e4 - Fazer movimento
   .chess board - Mostrar tabuleiro
   .chess resign - Desistir
   .chess draw - Oferecer/aceitar empate
   .chess moves - Mostrar histórico
   .chess help - Mostrar esta ajuda

💡 Formato de movimentos:
   • Padrão: e2-e4, d7-d5
   • Roque: e1-g1 (curto), e1-c1 (longo)
   • Promoção: e7-e8q (promover a rainha)
   
🎯 Peças: K=Rei, Q=Rainha, R=Torre, B=Bispo, N=Cavalo, P=Peão`,
        gameExists: '❌ Já existe um jogo de xadrez em andamento neste grupo!\n\nUse .chess board para ver ou .chess resign para terminar.',
        gameCreated: '♟️ JOGO DE XADREZ INICIADO!\n\n⚪ Brancas: @{white}\n⚫ Pretas: @{black}\n\n{board}\n\n{info}\n\n💡 Use .chess move e2-e4 para mover',
        noGame: '❌ Nenhum jogo de xadrez em andamento!\n\nInicie um com: .chess @oponente',
        notInGame: '❌ Você não está jogando neste jogo!',
        notYourTurn: '❌ Não é sua vez!\n\nAguardando {player}...',
        invalidMove: '❌ Movimento inválido: {error}\n\n💡 Use formato: .chess move e2-e4',
        moveMade: '♟️ Movimento: {move}\n\n{board}\n\n{info}\n\n{captured}',
        resigned: '🏳️ {player} desistiu!\n\n🏆 {winner} vence!\n\nDuração do jogo: {duration}',
        drawOffered: '🤝 {player} oferece empate!\n\nDigite .chess draw para aceitar',
        drawAccepted: '🤝 Empate aceito!\n\nJogo terminou em empate.\n\nDuração do jogo: {duration}',
        gameOver: '🏁 Jogo Terminado!\n\n{result}\n\nDuração do jogo: {duration}',
        needOpponent: '❌ Mencione um oponente!\n\nUso: .chess @oponente',
        cannotPlaySelf: '❌ Você não pode jogar contra si mesmo!',
        promotion: '\n👑 Peão promovido a {piece}!'
    },
    ar: {
        usage: `♟️ لعبة الشطرنج

🎮 ابدأ لعبة:
   .chess @الخصم
   .chess vs @الخصم

📋 أوامر اللعبة:
   .chess move e2-e4 - اعمل حركة
   .chess board - اعرض الرقعة
   .chess resign - استسلم
   .chess draw - اعرض/اقبل التعادل
   .chess moves - اعرض تاريخ الحركات
   .chess help - اعرض هذه المساعدة

💡 صيغة الحركات:
   • عادي: e2-e4, d7-d5
   • التبييت: e1-g1 (قصير), e1-c1 (طويل)
   • الترقية: e7-e8q (رقي للملكة)
   
🎯 القطع: K=ملك, Q=ملكة, R=قلعة, B=فيل, N=حصان, P=بيدق`,
        gameExists: '❌ فيه لعبة شطرنج شغالة في الجروب ده!\n\nاستخدم .chess board عشان تشوفها أو .chess resign عشان تنهيها.',
        gameCreated: '♟️ لعبة الشطرنج بدأت!\n\n⚪ أبيض: @{white}\n⚫ أسود: @{black}\n\n{board}\n\n{info}\n\n💡 استخدم .chess move e2-e4 عشان تتحرك',
        noGame: '❌ مفيش لعبة شطرنج شغالة!\n\nابدأ واحدة بـ: .chess @الخصم',
        notInGame: '❌ انت مش بتلعب في اللعبة دي!',
        notYourTurn: '❌ مش دورك!\n\nمستني {player}...',
        invalidMove: '❌ حركة غلط: {error}\n\n💡 استخدم الصيغة: .chess move e2-e4',
        moveMade: '♟️ الحركة: {move}\n\n{board}\n\n{info}\n\n{captured}',
        resigned: '🏳️ {player} استسلم!\n\n🏆 {winner} فاز!\n\nمدة اللعبة: {duration}',
        drawOffered: '🤝 {player} بيعرض تعادل!\n\nاكتب .chess draw عشان تقبل',
        drawAccepted: '🤝 التعادل اتقبل!\n\nاللعبة انتهت بالتعادل.\n\nمدة اللعبة: {duration}',
        gameOver: '🏁 اللعبة خلصت!\n\n{result}\n\nمدة اللعبة: {duration}',
        needOpponent: '❌ اعمل منشن للخصم!\n\nالاستخدام: .chess @الخصم',
        cannotPlaySelf: '❌ مينفعش تلعب ضد نفسك!',
        promotion: '\n👑 البيدق اترقى لـ {piece}!'
    },
    hi: {
        usage: `♟️ शतरंज गेम

🎮 गेम शुरू करें:
   .chess @प्रतिद्वंद्वी - प्लेयर के खिलाफ खेलें
   .chess ai [easy/medium/hard/expert] - AI के खिलाफ खेलें

📋 गेम कमांड:
   .chess move e2-e4 - एक चाल चलें
   .chess board - वर्तमान बोर्ड दिखाएं
   .chess resign - गेम छोड़ दें
   .chess draw - ड्रॉ ऑफर/स्वीकार करें
   .chess moves - चाल का इतिहास दिखाएं
   .chess help - यह हेल्प दिखाएं

💡 चाल फॉर्मेट:
   • स्टैंडर्ड: e2-e4, d7-d5
   • कैसलिंग: e1-g1 (किंगसाइड), e1-c1 (क्वीनसाइड)
   • प्रमोशन: e7-e8q (क्वीन में प्रमोट करें)
   
🎯 मोहरे: K=किंग, Q=क्वीन, R=रूक, B=बिशप, N=नाइट, P=पॉन

🤖 AI कठिनाई:
   • easy - रैंडम चालें
   • medium - बेसिक स्ट्रैटेजी (डिफ़ॉल्ट)
   • hard - एडवांस्ड टैक्टिक्स
   • expert - मास्टर लेवल
   • stockfish - ग्रैंडमास्टर (ऑनलाइन API)`,
        gameExists: '❌ इस ग्रुप में पहले से एक शतरंज गेम चल रहा है!\n\nइसे देखने के लिए .chess board या इसे समाप्त करने के लिए .chess resign का उपयोग करें।',
        gameCreated: '♟️ शतरंज गेम शुरू!\n\n⚪ सफेद: @{white}\n⚫ काला: @{black}\n\n{board}\n\n{info}\n\n💡 चाल चलने के लिए .chess move e2-e4 का उपयोग करें',
        gameCreatedAI: '♟️ AI के खिलाफ शतरंज गेम!\n\n⚪ आप (सफेद): @{white}\n⚫ AI ({difficulty}): 🤖\n\n{board}\n\n{info}\n\n💡 चाल चलने के लिए .chess move e2-e4 का उपयोग करें',
        aiThinking: '🤖 AI सोच रहा है...',
        aiMove: '🤖 AI ने खेला: {move}\n\n{board}\n\n{info}\n\n{captured}',
        noGame: '❌ कोई शतरंज गेम प्रगति में नहीं!\n\nइसके साथ एक शुरू करें: .chess @प्रतिद्वंद्वी',
        notInGame: '❌ आप इस गेम में नहीं खेल रहे हैं!',
        notYourTurn: '❌ यह आपकी बारी नहीं है!\n\n{player} का इंतजार कर रहे हैं...',
        invalidMove: '❌ अमान्य चाल: {error}\n\n💡 फॉर्मेट का उपयोग करें: .chess move e2-e4',
        moveMade: '♟️ चाल: {move}\n\n{board}\n\n{info}\n\n{captured}',
        resigned: '🏳️ {player} ने हार मान ली!\n\n🏆 {winner} जीत गया!\n\nगेम अवधि: {duration}',
        drawOffered: '🤝 {player} ड्रॉ ऑफर करता है!\n\nस्वीकार करने के लिए .chess draw टाइप करें',
        drawAccepted: '🤝 ड्रॉ स्वीकार किया गया!\n\nगेम ड्रॉ में समाप्त हुआ।\n\nगेम अवधि: {duration}',
        gameOver: '🏁 गेम ओवर!\n\n{result}\n\nगेम अवधि: {duration}',
        needOpponent: '❌ कृपया एक प्रतिद्वंद्वी को मेंशन करें!\n\nउपयोग: .chess @प्रतिद्वंद्वी',
        cannotPlaySelf: '❌ आप अपने खिलाफ नहीं खेल सकते!',
        promotion: '\n👑 पॉन को {piece} में प्रमोट किया गया!'
    },
    ng: {
        usage: `♟️ CHESS GAME

🎮 Start game:
   .chess @opponent - Play vs player
   .chess ai [easy/medium/hard/expert] - Play vs AI

📋 Game commands:
   .chess move e2-e4 - Make move
   .chess board - Show board
   .chess resign - Give up
   .chess draw - Offer/accept draw
   .chess moves - Show move history
   .chess help - Show this help

💡 Move format:
   • Standard: e2-e4, d7-d5
   • Castling: e1-g1 (kingside), e1-c1 (queenside)
   • Promotion: e7-e8q (promote to queen)
   
🎯 Pieces: K=King, Q=Queen, R=Rook, B=Bishop, N=Knight, P=Pawn

🤖 AI Difficulty:
   • easy - Random moves
   • medium - Basic strategy (default)
   • hard - Advanced tactics
   • expert - Master level
   • stockfish - Grandmaster (online API)`,
        gameExists: '❌ Chess game don dey for this group already!\n\nUse .chess board make you see am or .chess resign make you end am.',
        gameCreated: '♟️ CHESS GAME DON START!\n\n⚪ White: @{white}\n⚫ Black: @{black}\n\n{board}\n\n{info}\n\n💡 Use .chess move e2-e4 make you move',
        gameCreatedAI: '♟️ CHESS GAME VS AI!\n\n⚪ You (White): @{white}\n⚫ AI ({difficulty}): 🤖\n\n{board}\n\n{info}\n\n💡 Use .chess move e2-e4 make you move',
        aiThinking: '🤖 AI dey think...',
        aiMove: '🤖 AI don play: {move}\n\n{board}\n\n{info}\n\n{captured}',
        noGame: '❌ No chess game dey!\n\nStart one with: .chess @opponent',
        notInGame: '❌ You no dey play this game!',
        notYourTurn: '❌ E no be your turn!\n\nDey wait for {player}...',
        invalidMove: '❌ Move no correct: {error}\n\n💡 Use format: .chess move e2-e4',
        moveMade: '♟️ Move: {move}\n\n{board}\n\n{info}\n\n{captured}',
        resigned: '🏳️ {player} don give up!\n\n🏆 {winner} win!\n\nGame duration: {duration}',
        drawOffered: '🤝 {player} dey offer draw!\n\nType .chess draw make you accept',
        drawAccepted: '🤝 Draw don accept!\n\nGame end for draw.\n\nGame duration: {duration}',
        gameOver: '🏁 Game Don Finish!\n\n{result}\n\nGame duration: {duration}',
        needOpponent: '❌ Abeg mention opponent!\n\nUsage: .chess @opponent',
        cannotPlaySelf: '❌ You no fit play against yourself!',
        promotion: '\n👑 Pawn don promote to {piece}!'
    }
};

// Track draw offers
const drawOffers = new Map();

export default {
    name: 'chess',
    aliases: ['♟️'],
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const senderId = sender.split('@')[0];
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;

        try {
            // No args or help
            if (args.length === 0 || args[0] === 'help') {
                return await sock.sendMessage(from, { text: t.usage });
            }

            const action = args[0].toLowerCase();

            // Resign (check BEFORE starting new game)
            if (action === 'resign' || action === 'surrender') {
                const game = getGame(from);
                if (!game) {
                    return await sock.sendMessage(from, { text: t.noGame });
                }

                if (!isPlayerInGame(from, sender)) {
                    return await sock.sendMessage(from, { text: t.notInGame });
                }

                const playerColor = getPlayerColor(from, sender);
                const winner = playerColor === 'white' ? 'black' : 'white';
                const winnerPlayer = game.players[winner];
                const duration = formatDuration(getGameDuration(from));

                const text = t.resigned
                    .replace('{player}', `@${senderId}`)
                    .replace('{winner}', `@${winnerPlayer.split('@')[0]}`)
                    .replace('{duration}', duration);

                await sock.sendMessage(from, {
                    text,
                    mentions: [sender, winnerPlayer]
                });

                deleteGame(from);
                return;
            }

            // Draw offer/accept (check BEFORE starting new game)
            if (action === 'draw') {
                const game = getGame(from);
                if (!game) {
                    return await sock.sendMessage(from, { text: t.noGame });
                }

                if (!isPlayerInGame(from, sender)) {
                    return await sock.sendMessage(from, { text: t.notInGame });
                }

                const drawKey = from;
                
                if (drawOffers.has(drawKey)) {
                    // Accept draw
                    const duration = formatDuration(getGameDuration(from));
                    await sock.sendMessage(from, {
                        text: t.drawAccepted.replace('{duration}', duration)
                    });
                    
                    drawOffers.delete(drawKey);
                    deleteGame(from);
                } else {
                    // Offer draw
                    drawOffers.set(drawKey, sender);
                    
                    await sock.sendMessage(from, {
                        text: t.drawOffered.replace('{player}', `@${senderId}`),
                        mentions: [sender]
                    });
                    
                    // Auto-expire after 5 minutes
                    setTimeout(() => {
                        drawOffers.delete(drawKey);
                    }, 5 * 60 * 1000);
                }
                
                return;
            }

            // Start game vs AI
            if (action === 'ai' || action === 'bot' || action === 'computer') {
                const game = getGame(from);
                if (game) {
                    return await sock.sendMessage(from, { text: t.gameExists });
                }

                const difficulty = args[1]?.toLowerCase() || 'medium';
                const validDifficulties = ['easy', 'medium', 'hard', 'expert', 'stockfish'];
                const aiDifficulty = validDifficulties.includes(difficulty) ? difficulty : 'medium';

                const whitePlayer = sender;
                const blackPlayer = 'AI';
                
                const newGame = createGame(from, whitePlayer, blackPlayer, { isAI: true, difficulty: aiDifficulty });
                const board = displayBoard(newGame.engine);
                const info = displayGameInfo(newGame.engine, lang);

                const text = t.gameCreatedAI
                    .replace('{white}', whitePlayer.split('@')[0])
                    .replace('{difficulty}', aiDifficulty.toUpperCase())
                    .replace('{board}', board)
                    .replace('{info}', info);

                return await sock.sendMessage(from, {
                    text,
                    mentions: [whitePlayer]
                });
            }

            // Start new game (ONLY if 'vs' command OR first arg is a mention)
            // This prevents mentions in other commands from triggering game creation
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            const validActions = ['board', 'show', 'move', 'm', 'moves', 'history', 'resign', 'surrender', 'draw', 'help', 'ai', 'bot', 'computer'];
            const isStartGameCommand = action === 'vs' || (mentioned && !validActions.includes(action));
            
            if (isStartGameCommand) {
                const game = getGame(from);
                if (game) {
                    return await sock.sendMessage(from, { text: t.gameExists });
                }

                if (!mentioned) {
                    return await sock.sendMessage(from, { text: t.needOpponent });
                }

                if (mentioned === sender) {
                    return await sock.sendMessage(from, { text: t.cannotPlaySelf });
                }

                const whitePlayer = sender;
                const blackPlayer = mentioned;
                
                const newGame = createGame(from, whitePlayer, blackPlayer);
                const board = displayBoard(newGame.engine);
                const info = displayGameInfo(newGame.engine, lang);

                const text = t.gameCreated
                    .replace('{white}', whitePlayer.split('@')[0])
                    .replace('{black}', blackPlayer.split('@')[0])
                    .replace('{board}', board)
                    .replace('{info}', info);

                return await sock.sendMessage(from, {
                    text,
                    mentions: [whitePlayer, blackPlayer]
                });
            }

            // Show board
            if (action === 'board' || action === 'show') {
                const game = getGame(from);
                if (!game) {
                    return await sock.sendMessage(from, { text: t.noGame });
                }

                const board = displayBoard(game.engine);
                const info = displayGameInfo(game.engine, lang);
                const captured = displayCapturedPieces(game.engine);

                const text = `♟️ CHESS GAME\n\n⚪ White: @${game.players.white.split('@')[0]}\n⚫ Black: @${game.players.black.split('@')[0]}\n\n${board}\n\n${info}\n\n${captured}`;

                return await sock.sendMessage(from, {
                    text,
                    mentions: [game.players.white, game.players.black]
                });
            }

            // Show move history
            if (action === 'moves' || action === 'history') {
                const game = getGame(from);
                if (!game) {
                    return await sock.sendMessage(from, { text: t.noGame });
                }

                const history = displayMoveHistory(game.engine, 10);
                return await sock.sendMessage(from, { text: history });
            }

            // Make a move
            if (action === 'move' || action === 'm') {
                const game = getGame(from);
                if (!game) {
                    return await sock.sendMessage(from, { text: t.noGame });
                }

                if (!isPlayerInGame(from, sender)) {
                    return await sock.sendMessage(from, { text: t.notInGame });
                }

                if (!isPlayerTurn(from, sender)) {
                    const currentPlayerColor = game.engine.currentPlayer;
                    const currentPlayer = game.players[currentPlayerColor];
                    return await sock.sendMessage(from, {
                        text: t.notYourTurn.replace('{player}', `@${currentPlayer.split('@')[0]}`),
                        mentions: [currentPlayer]
                    });
                }

                if (args.length < 2) {
                    return await sock.sendMessage(from, { text: t.invalidMove.replace('{error}', 'No move specified') });
                }

                const moveStr = args[1].toLowerCase();
                const parts = moveStr.split('-');
                if (parts.length !== 2) {
                    return await sock.sendMessage(from, { text: t.invalidMove.replace('{error}', 'Invalid format') });
                }

                const from_sq = parts[0];
                const to_sq = parts[1];
                
                // Check for promotion
                let promotion = 'q';
                if (to_sq.length === 3) {
                    promotion = to_sq[2];
                }

                const result = game.engine.makeMove(from_sq, to_sq.substring(0, 2), promotion);

                if (!result.success) {
                    return await sock.sendMessage(from, {
                        text: t.invalidMove.replace('{error}', result.error)
                    });
                }

                updateMoveTime(from);

                const board = displayBoard(game.engine);
                const info = displayGameInfo(game.engine, lang);
                const captured = displayCapturedPieces(game.engine);

                let moveText = `${from_sq}-${to_sq}`;
                if (result.moveData.promotion) {
                    moveText += t.promotion.replace('{piece}', result.moveData.promotion.toUpperCase());
                }

                let text = t.moveMade
                    .replace('{move}', moveText)
                    .replace('{board}', board)
                    .replace('{info}', info)
                    .replace('{captured}', captured);

                await sock.sendMessage(from, {
                    text,
                    mentions: [game.players.white, game.players.black]
                });

                // Check for game over
                const status = game.engine.getGameStatus();
                if (status.status !== 'active' && status.status !== 'check') {
                    const duration = formatDuration(getGameDuration(from));
                    let result = '';
                    
                    if (status.status === 'checkmate') {
                        result = `🏆 ${status.winner === 'white' ? 'White' : 'Black'} wins by checkmate!`;
                    } else if (status.status === 'stalemate') {
                        result = '🤝 Draw by stalemate!';
                    } else if (status.status === 'insufficient_material') {
                        result = '🤝 Draw by insufficient material!';
                    } else if (status.status === 'fifty_move_rule') {
                        result = '🤝 Draw by 50-move rule!';
                    }

                    await sock.sendMessage(from, {
                        text: t.gameOver.replace('{result}', result).replace('{duration}', duration)
                    });

                    deleteGame(from);
                    return;
                }

                // AI move if playing against AI
                if (game.isAI && game.engine.currentPlayer === 'black') {
                    await sock.sendMessage(from, { text: t.aiThinking });
                    
                    // Small delay for realism
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    
                    // Use Stockfish API if difficulty is 'stockfish', otherwise use local AI
                    let aiMove;
                    if (game.aiDifficulty === 'stockfish') {
                        aiMove = await makeStockfishMove(game.engine, 'stockfish');
                    } else {
                        aiMove = makeAIMove(game.engine, game.aiDifficulty);
                    }
                    
                    if (aiMove) {
                        game.engine.makeMove(aiMove.from, aiMove.to, aiMove.promotion);
                        updateMoveTime(from);
                        
                        const board = displayBoard(game.engine);
                        const info = displayGameInfo(game.engine, lang);
                        const captured = displayCapturedPieces(game.engine);
                        
                        let aiMoveText = `${aiMove.from}-${aiMove.to}`;
                        if (aiMove.promotion) {
                            aiMoveText += aiMove.promotion.toUpperCase();
                        }
                        
                        const aiText = t.aiMove
                            .replace('{move}', aiMoveText)
                            .replace('{board}', board)
                            .replace('{info}', info)
                            .replace('{captured}', captured);
                        
                        await sock.sendMessage(from, { text: aiText });
                        
                        // Check for game over after AI move
                        const aiStatus = game.engine.getGameStatus();
                        if (aiStatus.status !== 'active' && aiStatus.status !== 'check') {
                            const duration = formatDuration(getGameDuration(from));
                            let result = '';
                            
                            if (aiStatus.status === 'checkmate') {
                                result = aiStatus.winner === 'white' ? '🏆 You win by checkmate!' : '🤖 AI wins by checkmate!';
                            } else if (aiStatus.status === 'stalemate') {
                                result = '🤝 Draw by stalemate!';
                            } else if (aiStatus.status === 'insufficient_material') {
                                result = '🤝 Draw by insufficient material!';
                            } else if (aiStatus.status === 'fifty_move_rule') {
                                result = '🤝 Draw by 50-move rule!';
                            }

                            await sock.sendMessage(from, {
                                text: t.gameOver.replace('{result}', result).replace('{duration}', duration)
                            });

                            deleteGame(from);
                        }
                    }
                }

                return;
            }

            // Unknown command
            return await sock.sendMessage(from, { text: t.usage });

        } catch (error) {
            console.error('[CHESS] Command error:', error.message);
            console.error('[CHESS] Stack:', error.stack);
            await sock.sendMessage(from, {
                text: '❌ An error occurred. Please try again.'
            });
        }
    }
};
