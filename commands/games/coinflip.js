import { getGroupLanguage } from '../../utils/language.js';
import { getBalance, addCoins, removeCoins, hasEnough } from '../../utils/bank_SAFE.js';
import { validateBet } from '../../utils/gameValidation.js';

const responses = {
    en: {
        flipping: 'Flipping coin...',
        player: '👤 Player:',
        result: 'Result:',
        heads: 'Heads',
        tails: 'Tails',
        win: 'You win!',
        lose: 'You lose!',
        bet: 'Bet:',
        choice: 'Your choice:',
        won: 'Won:',
        lost: 'Lost:',
        balance: 'Balance:',
        usage: 'Usage: .coin <bet> <heads/tails>\n\nExample: .coin 10 heads\n.coin all heads (bet everything!)\n\nCheck your balance: .bank',
        notEnough: 'Not enough coins!\n\nYour balance:',
        invalidBet: 'Invalid bet amount!\n\nMinimum: 1 coin\nMaximum: 1000000000000000000 coins',
        invalidChoice: 'Invalid choice!\n\nChoose: heads or tails\nExample: .coin 10 heads'
    },
    it: {
        flipping: 'Lancio moneta...',
        player: '👤 Giocatore:',
        result: 'Risultato:',
        heads: 'Testa',
        tails: 'Croce',
        win: 'Hai vinto!',
        lose: 'Hai perso!',
        bet: 'Puntata:',
        choice: 'La tua scelta:',
        won: 'Vinto:',
        lost: 'Perso:',
        balance: 'Saldo:',
        usage: 'Uso: .coin <puntata> <heads/tails>\n\nEsempio: .coin 10 heads\n\nControlla il saldo: .bank',
        notEnough: 'Monete insufficienti!\n\nIl tuo saldo:',
        invalidBet: 'Importo puntata non valido!\n\nMinimo: 1 moneta\nMassimo: 1000000000000000000 monete',
        invalidChoice: 'Scelta non valida!\n\nScegli: heads o tails\nEsempio: .coin 10 heads'
    },
    ru: {
        flipping: 'Подбрасываем монету...',
        player: '👤 Игрок:',
        result: 'Результат:',
        heads: 'Орёл',
        tails: 'Решка',
        win: 'Вы выиграли!',
        lose: 'Вы проиграли!',
        bet: 'Ставка:',
        choice: 'Ваш выбор:',
        won: 'Выиграно:',
        lost: 'Проиграно:',
        balance: 'Баланс:',
        usage: 'Использование: .coin <ставка> <heads/tails>\n\nПример: .coin 10 heads\n\nПроверьте баланс: .bank',
        notEnough: 'Недостаточно монет!\n\nВаш баланс:',
        invalidBet: 'Неверная сумма ставки!\n\nМинимум: 1 монета\nМаксимум: 1000000000000000000 монет',
        invalidChoice: 'Неверный выбор!\n\nВыберите: heads или tails\nПример: .coin 10 heads'
    },
    es: {
        flipping: 'Lanzando moneda...',
        player: '👤 Jugador:',
        result: 'Resultado:',
        heads: 'Cara',
        tails: 'Cruz',
        win: '¡Ganaste!',
        lose: '¡Perdiste!',
        bet: 'Apuesta:',
        choice: 'Tu elección:',
        won: 'Ganado:',
        lost: 'Perdido:',
        balance: 'Saldo:',
        usage: 'Uso: .coin <apuesta> <heads/tails>\n\nEjemplo: .coin 10 heads\n\nRevisa tu saldo: .bank',
        notEnough: '¡No tienes suficientes monedas!\n\nTu saldo:',
        invalidBet: '¡Cantidad de apuesta inválida!\n\nMínimo: 1 moneda\nMáximo: 1000000000000000000 monedas',
        invalidChoice: '¡Elección inválida!\n\nElige: heads o tails\nEjemplo: .coin 10 heads'
    },
    pt: {
        flipping: 'Lançando moeda...',
        player: '👤 Jogador:',
        result: 'Resultado:',
        heads: 'Cara',
        tails: 'Coroa',
        win: 'Você ganhou!',
        lose: 'Você perdeu!',
        bet: 'Aposta:',
        choice: 'Sua escolha:',
        won: 'Ganho:',
        lost: 'Perdido:',
        balance: 'Saldo:',
        usage: 'Uso: .coin <aposta> <heads/tails>\n\nExemplo: .coin 10 heads\n\nVerifique seu saldo: .bank',
        notEnough: 'Moedas insuficientes!\n\nSeu saldo:',
        invalidBet: 'Valor de aposta inválido!\n\nMínimo: 1 moeda\nMáximo: 1000000000000000000 moedas',
        invalidChoice: 'Escolha inválida!\n\nEscolha: heads ou tails\nExemplo: .coin 10 heads'
    },
    ar: {
        flipping: 'رمي العملة...',
        player: '👤 اللاعب:',
        result: 'النتيجة:',
        heads: 'وجه',
        tails: 'كتابة',
        win: 'لقد فزت!',
        lose: 'لقد خسرت!',
        bet: 'الرهان:',
        choice: 'اختيارك:',
        won: 'الربح:',
        lost: 'الخسارة:',
        balance: 'الرصيد:',
        usage: 'الاستخدام: .coin <رهان> <heads/tails>\n\nمثال: .coin 10 heads\n\nتحقق من رصيدك: .bank',
        notEnough: 'عملات غير كافية!\n\nرصيدك:',
        invalidBet: 'مبلغ رهان غير صالح!\n\nالحد الأدنى: 1 عملة\nالحد الأقصى: 1000000000000000000 عملة',
        invalidChoice: 'اختيار غير صالح!\n\nاختر: heads أو tails\nمثال: .coin 10 heads'
    },
    hi: {
        flipping: 'कॉइन उछाल रहे हैं...',
        player: '👤 खिलाड़ी:',
        result: 'परिणाम:',
        heads: 'हेड्स',
        tails: 'टेल्स',
        win: 'आप जीत गए!',
        lose: 'आप हार गए!',
        bet: 'बेट:',
        choice: 'आपकी पसंद:',
        won: 'जीता:',
        lost: 'हारा:',
        balance: 'बैलेंस:',
        usage: 'उपयोग: .coin <बेट> <heads/tails>\n\nउदाहरण: .coin 10 heads\n.coin all heads (सब कुछ लगाओ!)\n\nअपना बैलेंस चेक करें: .bank',
        notEnough: 'पर्याप्त कॉइन नहीं!\n\nआपका बैलेंस:',
        invalidBet: 'अमान्य बेट राशि!\n\nन्यूनतम: 1 कॉइन\nअधिकतम: 1000000000000000000 कॉइन',
        invalidChoice: 'अमान्य चुनाव!\n\nचुनें: heads या tails\nउदाहरण: .coin 10 heads'
    },
    ng: {
        flipping: 'Dey flip coin...',
        player: '👤 Player:',
        result: 'Result:',
        heads: 'Heads',
        tails: 'Tails',
        win: 'You win!',
        lose: 'You lose!',
        bet: 'Bet:',
        choice: 'Your choice:',
        won: 'Won:',
        lost: 'Lost:',
        balance: 'Balance:',
        usage: 'How to use: .coin <bet> <heads/tails>\n\nExample: .coin 10 heads\n.coin all heads (bet everything!)\n\nCheck your balance: .bank',
        notEnough: 'Your coins no reach!\n\nYour balance:',
        invalidBet: 'Dat bet amount no correct!\n\nMinimum: 1 coin\nMaximum: 1000000000000000000 coins',
        invalidChoice: 'Dat choice no correct!\n\nChoose: heads or tails\nExample: .coin 10 heads'
    }
};

export default {
    name: 'coinflip',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const pushName = msg.pushName || 'Player';
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        const coins = lang === 'it' ? 'monete' : lang === 'ru' ? 'монет' : lang === 'es' ? 'monedas' : lang === 'pt' ? 'moedas' : lang === 'hi' ? 'कॉइन' : 'coins';
        
        // Check if playing for fun (no bet or choice)
        const playingForFun = !args[0] || !args[1];
        let bet = 0;
        let userChoice = null;
        
        if (!playingForFun) {
            // Validate bet with comprehensive checks
            let betAmount;
            if (args[0].toLowerCase() === 'all') {
                betAmount = await getBalance(sender);
                if (betAmount < 1) {
                    return await sock.sendMessage(from, { 
                        text: `${t.notEnough} ${betAmount} ${coins}\n\n${t.usage}`
                    });
                }
            } else {
                const validation = validateBet(args[0], 1, 1000000000);
                if (!validation.valid) {
                    return await sock.sendMessage(from, { 
                        text: `❌ ${validation.error}\n\n${t.usage}` 
                    });
                }
                betAmount = validation.amount;
            }
            bet = betAmount;
            
            userChoice = args[1].toLowerCase();
            
            // Validate choice
            if (userChoice !== 'heads' && userChoice !== 'tails') {
                return await sock.sendMessage(from, { text: t.invalidChoice });
            }
            
            // Check balance
            if (!(await hasEnough(sender, bet))) {
                const balance = await getBalance(sender);
                return await sock.sendMessage(from, { 
                    text: `${t.notEnough} ${balance} ${coins}\n\n${t.usage}`
                });
            }
            
            // Deduct bet
            await removeCoins(sender, bet);
        }
        
        // Flip coin
        const isHeads = Math.random() < 0.5;
        const result = isHeads ? 'heads' : 'tails';
        const resultText = isHeads ? t.heads : t.tails;
        const emoji = isHeads ? '🪙' : '💰';
        
        // Send flipping animation
        let flipText = `🪙 ${t.flipping}\n${t.player} ${pushName}`;
        
        if (!playingForFun) {
            const userChoiceText = userChoice === 'heads' ? t.heads : t.tails;
            flipText += `\n\n${t.bet} ${bet} ${coins}\n${t.choice} ${userChoiceText}`;
        } else {
            flipText += `\n\n${lang === 'it' ? '🎮 Giocando per divertimento' : lang === 'ru' ? '🎮 Играем для удовольствия' : lang === 'es' ? '🎮 Jugando por diversión' : lang === 'hi' ? '🎮 मज़े के लिए खेल रहे हैं' : '🎮 Playing for fun'}`;
        }
        
        const flipMsg = await sock.sendMessage(from, { text: flipText });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        let finalText = `${emoji} ${t.result} ${resultText}!`;
        
        if (!playingForFun) {
            const userChoiceText = userChoice === 'heads' ? t.heads : t.tails;
            const won = userChoice === result;
            let balanceChange = '';
            
            if (won) {
                const winAmount = bet * 2;
                await addCoins(sender, winAmount);
                balanceChange = `${t.win}\n${t.won} +${winAmount} ${coins}`;
            } else {
                balanceChange = `${t.lose}\n${t.lost} -${bet} ${coins}`;
            }
            
            const newBalance = await getBalance(sender);
            finalText += `\n\n${t.bet} ${bet} ${coins}\n${t.choice} ${userChoiceText}\n\n${balanceChange}\n${t.balance} ${newBalance} ${coins}`;
        } else {
            finalText += `\n\n${lang === 'it' ? '💡 Usa .coin <puntata> <heads/tails> per giocare con monete!' : lang === 'ru' ? '💡 Используйте .coin <ставка> <heads/tails> для игры с монетами!' : lang === 'es' ? '💡 ¡Usa .coin <apuesta> <heads/tails> para jugar con monedas!' : lang === 'hi' ? '💡 कॉइन के साथ खेलने के लिए .coin <बेट> <heads/tails> का उपयोग करें!' : '💡 Use .coin <bet> <heads/tails> to play with coins!'}`;
        }
        
        // Show result with error handling for message edit
        try {
            await sock.sendMessage(from, {
                text: finalText,
                edit: flipMsg.key
            });
        } catch (error) {
            // If edit fails (message deleted), send new message
            await sock.sendMessage(from, { text: finalText });
        }
    }
};
