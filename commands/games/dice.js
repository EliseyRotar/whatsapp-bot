import { getGroupLanguage } from '../../utils/language.js';
import { getBalance, addCoins, removeCoins, hasEnough } from '../../utils/bank_SAFE.js';
import { validateBet } from '../../utils/gameValidation.js';

const responses = {
    en: {
        rolling: '🎲 Rolling dice...',
        player: '👤 Player:',
        total: 'Total:',
        bet: 'Bet:',
        won: 'Won:',
        lost: 'Lost:',
        balance: 'Balance:',
        usage: 'Usage: .dice <bet>\n\nExample: .dice 10\n.dice all (bet everything!)\n\nWin conditions:\n• Double (same number): 3x bet\n• Total 7 or 11: 2x bet\n• Other totals: lose bet\n\nCheck your balance: .bank',
        notEnough: 'Not enough coins!\n\nYour balance:',
        invalidBet: 'Invalid bet amount!\n\nMinimum: 1 coin\nMaximum: 1000000000000000000 coins',
        doubles: 'DOUBLES! Lucky roll!',
        lucky: 'Lucky 7 or 11!',
        unlucky: 'Better luck next time!'
    },
    it: {
        rolling: '🎲 Lancio dadi...',
        player: '👤 Giocatore:',
        total: 'Totale:',
        bet: 'Puntata:',
        won: 'Vinto:',
        lost: 'Perso:',
        balance: 'Saldo:',
        usage: 'Uso: .dice <puntata>\n\nEsempio: .dice 10\n\nCondizioni vincita:\n• Doppio (stesso numero): 3x puntata\n• Totale 7 o 11: 2x puntata\n• Altri totali: perdi puntata\n\nControlla il saldo: .bank',
        notEnough: 'Monete insufficienti!\n\nIl tuo saldo:',
        invalidBet: 'Importo puntata non valido!\n\nMinimo: 1 moneta\nMassimo: 1000000000000000000 monete',
        doubles: 'DOPPIO! Tiro fortunato!',
        lucky: 'Fortunato 7 o 11!',
        unlucky: 'Riprova la prossima volta!'
    },
    ru: {
        rolling: '🎲 Бросаем кости...',
        player: '👤 Игрок:',
        total: 'Всего:',
        bet: 'Ставка:',
        won: 'Выиграно:',
        lost: 'Проиграно:',
        balance: 'Баланс:',
        usage: 'Использование: .dice <ставка>\n\nПример: .dice 10\n\nУсловия выигрыша:\n• Дубль (одинаковые числа): 3x ставка\n• Сумма 7 или 11: 2x ставка\n• Другие суммы: потеря ставки\n\nПроверьте баланс: .bank',
        notEnough: 'Недостаточно монет!\n\nВаш баланс:',
        invalidBet: 'Неверная сумма ставки!\n\nМинимум: 1 монета\nМаксимум: 1000000000000000000 монет',
        doubles: 'ДУБЛЬ! Удачный бросок!',
        lucky: 'Счастливые 7 или 11!',
        unlucky: 'Удачи в следующий раз!'
    },
    es: {
        rolling: '🎲 Lanzando dados...',
        player: '👤 Jugador:',
        total: 'Total:',
        bet: 'Apuesta:',
        won: 'Ganado:',
        lost: 'Perdido:',
        balance: 'Saldo:',
        usage: 'Uso: .dice <apuesta>\n\nEjemplo: .dice 10\n\nCondiciones de victoria:\n• Dobles (mismo número): 3x apuesta\n• Total 7 u 11: 2x apuesta\n• Otros totales: pierdes apuesta\n\nRevisa tu saldo: .bank',
        notEnough: '¡No tienes suficientes monedas!\n\nTu saldo:',
        invalidBet: '¡Cantidad de apuesta inválida!\n\nMínimo: 1 moneda\nMáximo: 1000000000000000000 monedas',
        doubles: '¡DOBLES! ¡Tiro afortunado!',
        lucky: '¡Suerte con 7 u 11!',
        unlucky: '¡Mejor suerte la próxima vez!'
    },
    pt: {
        rolling: '🎲 Lançando dados...',
        player: '👤 Jogador:',
        total: 'Total:',
        bet: 'Aposta:',
        won: 'Ganho:',
        lost: 'Perdido:',
        balance: 'Saldo:',
        usage: 'Uso: .dice <aposta>\n\nExemplo: .dice 10\n\nCondições de vitória:\n• Duplas (mesmo número): 3x aposta\n• Total 7 ou 11: 2x aposta\n• Outros totais: perde aposta\n\nVerifique seu saldo: .bank',
        notEnough: 'Moedas insuficientes!\n\nSeu saldo:',
        invalidBet: 'Valor de aposta inválido!\n\nMínimo: 1 moeda\nMáximo: 1000000000000000000 moedas',
        doubles: 'DUPLAS! Jogada de sorte!',
        lucky: 'Sorte com 7 ou 11!',
        unlucky: 'Melhor sorte na próxima vez!'
    },
    ar: {
        rolling: '🎲 رمي النرد...',
        player: '👤 اللاعب:',
        total: 'المجموع:',
        bet: 'الرهان:',
        won: 'الربح:',
        lost: 'الخسارة:',
        balance: 'الرصيد:',
        usage: 'الاستخدام: .dice <رهان>\n\nمثال: .dice 10\n\nشروط الفوز:\n• أزواج (نفس الرقم): 3x رهان\n• المجموع 7 أو 11: 2x رهان\n• مجاميع أخرى: خسارة الرهان\n\nتحقق من رصيدك: .bank',
        notEnough: 'عملات غير كافية!\n\nرصيدك:',
        invalidBet: 'مبلغ رهان غير صالح!\n\nالحد الأدنى: 1 عملة\nالحد الأقصى: 1000000000000000000 عملة',
        doubles: 'أزواج! رمية محظوظة!',
        lucky: 'محظوظ 7 أو 11!',
        unlucky: 'حظ أفضل في المرة القادمة!'
    },
    hi: {
        rolling: '🎲 डाइस रोल हो रहा है...',
        player: '👤 खिलाड़ी:',
        total: 'कुल:',
        bet: 'बेट:',
        won: 'जीता:',
        lost: 'हारा:',
        balance: 'बैलेंस:',
        usage: 'उपयोग: .dice <बेट>\n\nउदाहरण: .dice 10\n.dice all (सब कुछ लगाओ!)\n\nजीतने की शर्तें:\n• डबल (एक ही नंबर): 3x बेट\n• कुल 7 या 11: 2x बेट\n• अन्य कुल: बेट हार जाते हैं\n\nअपना बैलेंस चेक करें: .bank',
        notEnough: 'पर्याप्त कॉइन नहीं!\n\nआपका बैलेंस:',
        invalidBet: 'अमान्य बेट राशि!\n\nन्यूनतम: 1 कॉइन\nअधिकतम: 1000000000000000000 कॉइन',
        doubles: 'डबल! भाग्यशाली रोल!',
        lucky: 'भाग्यशाली 7 या 11!',
        unlucky: 'अगली बार बेहतर किस्मत!'
    },
    ng: {
        rolling: '🎲 Dey roll dice...',
        player: '👤 Player:',
        total: 'Total:',
        bet: 'Bet:',
        won: 'Won:',
        lost: 'Lost:',
        balance: 'Balance:',
        usage: 'How to use: .dice <bet>\n\nExample: .dice 10\n.dice all (bet everything!)\n\nWin conditions:\n• Double (same number): 3x bet\n• Total 7 or 11: 2x bet\n• Other totals: you lose bet\n\nCheck your balance: .bank',
        notEnough: 'Your coins no reach!\n\nYour balance:',
        invalidBet: 'Dat bet amount no correct!\n\nMinimum: 1 coin\nMaximum: 1000000000000000000 coins',
        doubles: 'DOUBLES! Lucky roll!',
        lucky: 'Lucky 7 or 11!',
        unlucky: 'Better luck next time!'
    }
};

export default {
    name: 'dice',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const pushName = msg.pushName || 'Player';
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        const coins = lang === 'it' ? 'monete' : lang === 'ru' ? 'монет' : lang === 'es' ? 'monedas' : lang === 'pt' ? 'moedas' : lang === 'hi' ? 'कॉइन' : 'coins';
        
        // Check if playing for fun (no bet)
        const playingForFun = !args[0];
        let bet = 0;
        
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
        
        // Roll dice - ensure 1-6 range
        const dice1 = Math.floor(Math.random() * 6) + 1;
        const dice2 = Math.floor(Math.random() * 6) + 1;
        const total = dice1 + dice2;
        
        const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        
        // Send rolling animation
        const betText = playingForFun 
            ? (lang === 'it' ? '🎮 Giocando per divertimento' : lang === 'hi' ? '🎮 मज़े के लिए खेल रहे हैं' : '🎮 Playing for fun')
            : `${t.bet} ${bet} ${coins}`;
        
        const rollMsg = await sock.sendMessage(from, { 
            text: `${t.rolling}\n${t.player} ${pushName}\n\n${betText}\n\n🎲 🎲`
        });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Calculate winnings
        let multiplier = 0;
        let resultText = '';
        
        if (dice1 === dice2) {
            // Doubles - 3x bet
            multiplier = 3;
            resultText = t.doubles;
        } else if (total === 7 || total === 11) {
            // Lucky 7 or 11 - 2x bet
            multiplier = 2;
            resultText = t.lucky;
        } else {
            // Lose
            multiplier = 0;
            resultText = t.unlucky;
        }
        
        let finalText = `${t.rolling}\n${t.player} ${pushName}\n\n${betText}\n\n${diceEmojis[dice1-1]} ${diceEmojis[dice2-1]}\n\n${t.total} ${total}\n\n${resultText}`;
        
        if (!playingForFun) {
            const winAmount = bet * multiplier;
            let balanceChange = '';
            
            if (winAmount > 0) {
                await addCoins(sender, winAmount);
                balanceChange = `${t.won} +${winAmount} ${coins}`;
            } else {
                balanceChange = `${t.lost} -${bet} ${coins}`;
            }
            
            const newBalance = await getBalance(sender);
            finalText += `\n${balanceChange}\n${t.balance} ${newBalance} ${coins}`;
        } else {
            finalText += `\n\n${lang === 'it' ? '💡 Usa .dice <puntata> per giocare con monete!' : lang === 'hi' ? '💡 कॉइन के साथ खेलने के लिए .dice <बेट> का उपयोग करें!' : '💡 Use .dice <bet> to play with coins!'}`;
        }
        
        // Show result with error handling
        try {
            await sock.sendMessage(from, {
                text: finalText,
                edit: rollMsg.key
            });
        } catch (error) {
            // If edit fails, send new message
            await sock.sendMessage(from, { text: finalText });
        }
    }
};
