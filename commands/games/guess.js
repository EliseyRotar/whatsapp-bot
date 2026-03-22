// Simple number guessing game
import { getGroupLanguage } from '../../utils/language.js';

const activeGames = new Map();

const responses = {
    en: {
        started: '🎮 Number Guessing Game Started!\n\nI\'m thinking of a number between 1 and 100.\nYou have 10 attempts to guess it!\n\nUse: .guess <number>',
        player: '👤 Player:',
        noGame: 'No active game! Start one with: .guess start',
        invalidNumber: 'Please guess a number between 1 and 100!',
        correct: '🎉 Correct! The number was {number}!\n\nYou guessed it in {attempts} attempt(s)!',
        gameOver: '😔 Game Over! You ran out of attempts.\n\nThe number was {number}.\n\nTry again with: .guess start',
        tooHigh: '{guess} is too high!\n\nAttempts remaining: {remaining}',
        tooLow: '{guess} is too low!\n\nAttempts remaining: {remaining}'
    },
    it: {
        started: '🎮 Gioco Indovina il Numero Iniziato!\n\nSto pensando a un numero tra 1 e 100.\nHai 10 tentativi per indovinarlo!\n\nUsa: .guess <numero>',
        player: '👤 Giocatore:',
        noGame: 'Nessun gioco attivo! Iniziane uno con: .guess start',
        invalidNumber: 'Indovina un numero tra 1 e 100!',
        correct: '🎉 Corretto! Il numero era {number}!\n\nL\'hai indovinato in {attempts} tentativo/i!',
        gameOver: '😔 Game Over! Hai finito i tentativi.\n\nIl numero era {number}.\n\nRiprova con: .guess start',
        tooHigh: '{guess} è troppo alto!\n\nTentativi rimanenti: {remaining}',
        tooLow: '{guess} è troppo basso!\n\nTentativi rimanenti: {remaining}'
    },
    ru: {
        started: '🎮 Игра "Угадай число" началась!\n\nЯ загадал число от 1 до 100.\nУ вас есть 10 попыток, чтобы угадать его!\n\nИспользуйте: .guess <число>',
        player: '👤 Игрок:',
        noGame: 'Нет активной игры! Начните с: .guess start',
        invalidNumber: 'Пожалуйста, угадайте число от 1 до 100!',
        correct: '🎉 Правильно! Число было {number}!\n\nВы угадали за {attempts} попыток!',
        gameOver: '😔 Игра окончена! У вас закончились попытки.\n\nЧисло было {number}.\n\nПопробуйте снова: .guess start',
        tooHigh: '{guess} слишком большое!\n\nОсталось попыток: {remaining}',
        tooLow: '{guess} слишком маленькое!\n\nОсталось попыток: {remaining}'
    },
    es: {
        started: '🎮 ¡Juego de Adivinar Número Iniciado!\n\nEstoy pensando en un número entre 1 y 100.\n¡Tienes 10 intentos para adivinarlo!\n\nUsa: .guess <número>',
        player: '👤 Jugador:',
        noGame: '¡No hay juego activo! Inicia uno con: .guess start',
        invalidNumber: '¡Por favor adivina un número entre 1 y 100!',
        correct: '🎉 ¡Correcto! ¡El número era {number}!\n\n¡Lo adivinaste en {attempts} intento(s)!',
        gameOver: '😔 ¡Juego Terminado! Te quedaste sin intentos.\n\nEl número era {number}.\n\nIntenta de nuevo con: .guess start',
        tooHigh: '¡{guess} es muy alto!\n\nIntentos restantes: {remaining}',
        tooLow: '¡{guess} es muy bajo!\n\nIntentos restantes: {remaining}'
    },
    pt: {
        started: '🎮 Jogo de Adivinhar Número Iniciado!\n\nEstou pensando em um número entre 1 e 100.\nVocê tem 10 tentativas para adivinhar!\n\nUse: .guess <número>',
        player: '👤 Jogador:',
        noGame: 'Nenhum jogo ativo! Inicie um com: .guess start',
        invalidNumber: 'Por favor adivinhe um número entre 1 e 100!',
        correct: '🎉 Correto! O número era {number}!\n\nVocê adivinhou em {attempts} tentativa(s)!',
        gameOver: '😔 Fim de Jogo! Você ficou sem tentativas.\n\nO número era {number}.\n\nTente novamente com: .guess start',
        tooHigh: '{guess} é muito alto!\n\nTentativas restantes: {remaining}',
        tooLow: '{guess} é muito baixo!\n\nTentativas restantes: {remaining}'
    },
    ar: {
        started: '🎮 لعبة تخمين الرقم بدأت!\n\nأنا بفكر في رقم بين 1 و 100.\nعندك 10 محاولات عشان تخمن!\n\nاستخدم: .guess <رقم>',
        player: '👤 اللاعب:',
        noGame: 'مفيش لعبة نشطة! ابدأ واحدة بـ: .guess start',
        invalidNumber: 'خمن رقم بين 1 و 100!',
        correct: '🎉 صح! الرقم كان {number}!\n\nخمنته في {attempts} محاولة!',
        gameOver: '😔 اللعبة خلصت! المحاولات خلصت.\n\nالرقم كان {number}.\n\nحاول تاني بـ: .guess start',
        tooHigh: '{guess} عالي أوي!\n\nالمحاولات المتبقية: {remaining}',
        tooLow: '{guess} واطي أوي!\n\nالمحاولات المتبقية: {remaining}'
    },
    hi: {
        started: '🎮 संख्या अनुमान खेल शुरू हुआ!\n\nमैं 1 और 100 के बीच एक संख्या सोच रहा हूं।\nआपके पास अनुमान लगाने के लिए 10 प्रयास हैं!\n\nउपयोग करें: .guess <संख्या>',
        player: '👤 खिलाड़ी:',
        noGame: 'कोई सक्रिय खेल नहीं! इसके साथ शुरू करें: .guess start',
        invalidNumber: 'कृपया 1 और 100 के बीच एक संख्या का अनुमान लगाएं!',
        correct: '🎉 सही! संख्या {number} थी!\n\nआपने {attempts} प्रयास में अनुमान लगाया!',
        gameOver: '😔 खेल समाप्त! आपके प्रयास समाप्त हो गए।\n\nसंख्या {number} थी।\n\nपुनः प्रयास करें: .guess start',
        tooHigh: '{guess} बहुत अधिक है!\n\nशेष प्रयास: {remaining}',
        tooLow: '{guess} बहुत कम है!\n\nशेष प्रयास: {remaining}'
    },
    ng: {
        started: '🎮 Number Guessing Game don start!\n\nI dey think of one number between 1 and 100.\nYou get 10 tries to guess am!\n\nUse: .guess <number>',
        player: '👤 Player:',
        noGame: 'No game dey active! Start one with: .guess start',
        invalidNumber: 'Abeg guess number between 1 and 100!',
        correct: '🎉 Correct! Di number na {number}!\n\nYou guess am for {attempts} try!',
        gameOver: '😔 Game don finish! Your tries don finish.\n\nDi number na {number}.\n\nTry again with: .guess start',
        tooHigh: '{guess} too high!\n\nTries wey remain: {remaining}',
        tooLow: '{guess} too low!\n\nTries wey remain: {remaining}'
    }
};

export default {
    name: 'guess',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const pushName = msg.pushName || 'Player';
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        // Start new game
        if (args[0] === 'start') {
            const number = Math.floor(Math.random() * 100) + 1;
            activeGames.set(sender, {
                number,
                attempts: 0,
                maxAttempts: 10
            });
            
            return await sock.sendMessage(from, { 
                text: `${t.player} ${pushName}\n\n${t.started}`
            });
        }
        
        // Check if game is active
        if (!activeGames.has(sender)) {
            return await sock.sendMessage(from, { 
                text: t.noGame
            });
        }
        
        // Make a guess
        const guess = parseInt(args[0]);
        
        if (isNaN(guess) || guess < 1 || guess > 100) {
            return await sock.sendMessage(from, { 
                text: t.invalidNumber
            });
        }
        
        const game = activeGames.get(sender);
        game.attempts++;
        
        if (guess === game.number) {
            activeGames.delete(sender);
            return await sock.sendMessage(from, { 
                text: t.correct.replace('{number}', game.number).replace('{attempts}', game.attempts)
            });
        }
        
        if (game.attempts >= game.maxAttempts) {
            activeGames.delete(sender);
            return await sock.sendMessage(from, { 
                text: t.gameOver.replace('{number}', game.number)
            });
        }
        
        const remaining = game.maxAttempts - game.attempts;
        const hintText = guess < game.number ? t.tooLow : t.tooHigh;
        
        await sock.sendMessage(from, { 
            text: hintText.replace('{guess}', guess).replace('{remaining}', remaining)
        });
    }
};
