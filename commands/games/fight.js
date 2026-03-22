import { getBalance, removeCoins, addCoins } from '../../utils/bank_SAFE.js';
import { getGroupLanguage } from '../../utils/language.js';
import { getLuckBoost } from '../../utils/shopSystem.js';
import { incrementUsage } from '../../utils/dailyLimits.js';

const responses = {
    en: {
        noRobbery: '❌ No one is trying to rob you right now!',
        notYourFight: '❌ This is not your fight!',
        fightWin: '⚔️ FIGHT WON!\n\n🎯 Defender: @{defender}\n👊 You fought off @{robber}!\n💰 Kept your coins safe!\n🎁 Bonus: +{bonus} coins for defending!\n💰 Your Balance: {balance} coins\n\n💪 Great defense!\n\n💀 Use .kill for revenge!',
        fightLose: '⚔️ FIGHT LOST!\n\n🎯 Defender: @{defender}\n💔 @{robber} overpowered you!\n💸 Lost: {amount} coins\n💰 Your Balance: {balance} coins\n\n😢 Better luck next time!\n\n💀 Use .kill for revenge!',
        robberPunished: '\n👮 @{robber} was fined {fine} coins for failed robbery!',
        fightChance: '\n🎲 Your Fight Success Rate: {chance}%'
    },
    it: {
        noRobbery: '❌ Nessuno sta cercando di derubarti!',
        notYourFight: '❌ Questo non è il tuo combattimento!',
        fightWin: '⚔️ COMBATTIMENTO VINTO!\n\n🎯 Difensore: @{defender}\n👊 Hai respinto @{robber}!\n💰 Monete al sicuro!\n🎁 Bonus: +{bonus} monete per la difesa!\n💰 Tuo Saldo: {balance} monete\n\n💪 Grande difesa!\n\n💀 Usa .kill per vendetta!',
        fightLose: '⚔️ COMBATTIMENTO PERSO!\n\n🎯 Difensore: @{defender}\n💔 @{robber} ti ha sopraffatto!\n💸 Perso: {amount} monete\n💰 Tuo Saldo: {balance} monete\n\n😢 Riprova!\n\n💀 Usa .kill per vendetta!',
        robberPunished: '\n👮 @{robber} è stato multato di {fine} monete per rapina fallita!',
        fightChance: '\n🎲 Tasso Successo Combattimento: {chance}%'
    },
    ru: {
        noRobbery: '❌ Никто не пытается вас ограбить!',
        notYourFight: '❌ Это не ваш бой!',
        fightWin: '⚔️ БОЙ ВЫИГРАН!\n\n🎯 Защитник: @{defender}\n👊 Вы отбили @{robber}!\n💰 Монеты в безопасности!\n🎁 Бонус: +{bonus} монет за защиту!\n💰 Ваш Баланс: {balance} монет\n\n💪 Отличная защита!\n\n💀 Используйте .kill для мести!',
        fightLose: '⚔️ БОЙ ПРОИГРАН!\n\n🎯 Защитник: @{defender}\n💔 @{robber} одолел вас!\n💸 Потеряно: {amount} монет\n💰 Ваш Баланс: {balance} монет\n\n😢 Повезет в следующий раз!\n\n💀 Используйте .kill для мести!',
        robberPunished: '\n👮 @{robber} оштрафован на {fine} монет за неудачное ограбление!',
        fightChance: '\n🎲 Шанс Успеха Боя: {chance}%'
    },
    es: {
        noRobbery: '❌ ¡Nadie está intentando robarte ahora!',
        notYourFight: '❌ ¡Esta no es tu pelea!',
        fightWin: '⚔️ ¡PELEA GANADA!\n\n🎯 Defensor: @{defender}\n👊 ¡Rechazaste a @{robber}!\n💰 ¡Monedas a salvo!\n🎁 Bonificación: +{bonus} monedas por defender!\n💰 Tu Saldo: {balance} monedas\n\n💪 ¡Gran defensa!\n\n💀 ¡Usa .kill para venganza!',
        fightLose: '⚔️ ¡PELEA PERDIDA!\n\n🎯 Defensor: @{defender}\n💔 ¡@{robber} te venció!\n💸 Perdido: {amount} monedas\n💰 Tu Saldo: {balance} monedas\n\n😢 ¡Mejor suerte la próxima!\n\n💀 ¡Usa .kill para venganza!',
        robberPunished: '\n👮 ¡@{robber} fue multado con {fine} monedas por robo fallido!',
        fightChance: '\n🎲 Tasa de Éxito de Pelea: {chance}%'
    },
    pt: {
        noRobbery: '❌ Ninguém está tentando roubar você agora!',
        notYourFight: '❌ Esta não é sua luta!',
        fightWin: '⚔️ LUTA VENCIDA!\n\n🎯 Defensor: @{defender}\n👊 Você repeliu @{robber}!\n💰 Moedas seguras!\n🎁 Bônus: +{bonus} moedas por defender!\n💰 Seu Saldo: {balance} moedas\n\n💪 Ótima defesa!\n\n💀 Use .kill para vingança!',
        fightLose: '⚔️ LUTA PERDIDA!\n\n🎯 Defensor: @{defender}\n💔 @{robber} te dominou!\n💸 Perdido: {amount} moedas\n💰 Seu Saldo: {balance} moedas\n\n😢 Melhor sorte da próxima!\n\n💀 Use .kill para vingança!',
        robberPunished: '\n👮 @{robber} foi multado em {fine} moedas por roubo falho!',
        fightChance: '\n🎲 Taxa de Sucesso da Luta: {chance}%'
    },
    ar: {
        noRobbery: '❌ مفيش حد بيحاول يسرقك دلوقتي!',
        notYourFight: '❌ ده مش قتالك!',
        fightWin: '⚔️ فزت في القتال!\n\n🎯 المدافع: @{defender}\n👊 دافعت ضد @{robber}!\n💰 عملاتك آمنة!\n🎁 مكافأة: +{bonus} عملة للدفاع!\n💰 رصيدك: {balance} عملة\n\n💪 دفاع رائع!\n\n💀 استخدم .kill للانتقام!',
        fightLose: '⚔️ خسرت القتال!\n\n🎯 المدافع: @{defender}\n💔 @{robber} غلبك!\n💸 خسارة: {amount} عملة\n💰 رصيدك: {balance} عملة\n\n😢 حظ أفضل المرة القادمة!\n\n💀 استخدم .kill للانتقام!',
        robberPunished: '\n👮 @{robber} اتغرم {fine} عملة للسرقة الفاشلة!',
        fightChance: '\n🎲 معدل نجاح القتال: {chance}%'
    },
    hi: {
        noRobbery: '❌ अभी कोई आपको लूटने की कोशिश नहीं कर रहा है!',
        notYourFight: '❌ यह आपकी लड़ाई नहीं है!',
        fightWin: '⚔️ लड़ाई जीती!\n\n🎯 रक्षक: @{defender}\n👊 आपने @{robber} को हरा दिया!\n💰 अपने सिक्के सुरक्षित रखे!\n🎁 बोनस: +{bonus} सिक्के बचाव के लिए!\n💰 आपका बैलेंस: {balance} सिक्के\n\n💪 शानदार बचाव!\n\n💀 बदला लेने के लिए .kill का उपयोग करें!',
        fightLose: '⚔️ लड़ाई हारी!\n\n🎯 रक्षक: @{defender}\n💔 @{robber} ने आपको हरा दिया!\n💸 खोया: {amount} सिक्के\n💰 आपका बैलेंस: {balance} सिक्के\n\n😢 अगली बार बेहतर किस्मत!\n\n💀 बदला लेने के लिए .kill का उपयोग करें!',
        robberPunished: '\n👮 @{robber} को विफल डकैती के लिए {fine} सिक्के जुर्माना लगाया गया!',
        fightChance: '\n🎲 आपकी लड़ाई सफलता दर: {chance}%'
    },
    ng: {
        noRobbery: '❌ Nobody dey try rob you now!',
        notYourFight: '❌ Dis no be your fight!',
        fightWin: '⚔️ FIGHT WON!\n\n🎯 Defender: @{defender}\n👊 You don fight off @{robber}!\n💰 Your coins dey safe!\n🎁 Bonus: +{bonus} coins for defending!\n💰 Your Balance: {balance} coins\n\n💪 Great defense!\n\n💀 Use .kill for revenge!',
        fightLose: '⚔️ FIGHT LOST!\n\n🎯 Defender: @{defender}\n💔 @{robber} don overpower you!\n💸 Lost: {amount} coins\n💰 Your Balance: {balance} coins\n\n😢 Better luck next time!\n\n💀 Use .kill for revenge!',
        robberPunished: '\n👮 @{robber} don pay {fine} coins fine for failed robbery!',
        fightChance: '\n🎲 Your Fight Success Rate: {chance}%'
    }
};

export default {
    name: 'fight',
    aliases: ['defend', 'counter'],
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const senderId = sender.split('@')[0];
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;

        try {
            // Import pendingRobberies and robberyTimeouts from rob.js
            const robModule = await import('./rob.js');
            const pendingRobberies = robModule.pendingRobberies;

            // Check if there's a pending robbery for this user
            const robberyKey = `${from}_${senderId}`;
            
            if (!pendingRobberies.has(robberyKey)) {
                return await sock.sendMessage(from, {
                    text: t.noRobbery
                });
            }

            const robbery = pendingRobberies.get(robberyKey);
            
            // Verify this is the correct defender
            if (robbery.target !== sender) {
                return await sock.sendMessage(from, {
                    text: t.notYourFight
                });
            }

            // Cancel the timeout to prevent memory leak
            if (robModule.robberyTimeouts && robModule.robberyTimeouts.has(robberyKey)) {
                clearTimeout(robModule.robberyTimeouts.get(robberyKey));
                robModule.robberyTimeouts.delete(robberyKey);
            }

            // Remove the pending robbery
            pendingRobberies.delete(robberyKey);

            // Calculate fight success chance
            // Base 50% + luck boost (max 75% from shop items)
            const defenderLuck = getLuckBoost(senderId);
            const fightChance = Math.min(50 + defenderLuck, 90); // Max 90% success rate
            const fightSuccess = Math.random() * 100 < fightChance;

            if (fightSuccess) {
                // Defender wins - keeps coins and gets bonus
                const bonus = Math.floor(robbery.amount * 0.5); // 50% of what would have been stolen
                await addCoins(sender, bonus);
                
                // Punish the robber with a fine
                const fine = Math.floor(robbery.amount * 0.3); // 30% fine
                await removeCoins(robbery.robber, fine);

                const defenderBalance = await getBalance(sender);
                
                let winMsg = t.fightWin
                    .replace(/@\{defender\}/g, `@${senderId}`)
                    .replace(/@\{robber\}/g, `@${robbery.robberId}`)
                    .replace('{bonus}', bonus.toLocaleString())
                    .replace('{balance}', defenderBalance.toLocaleString());
                
                winMsg += t.fightChance.replace('{chance}', fightChance.toFixed(1));
                winMsg += t.robberPunished
                    .replace(/@\{robber\}/g, `@${robbery.robberId}`)
                    .replace('{fine}', fine.toLocaleString());

                await sock.sendMessage(from, {
                    text: winMsg,
                    mentions: [sender, robbery.robber]
                });
            } else {
                // Defender loses - robber gets the coins
                await removeCoins(sender, robbery.amount);
                await addCoins(robbery.robber, robbery.amount);
                
                // Increment rob usage counter for the robber
                incrementUsage(robbery.robberId, 'rob');

                const defenderBalance = await getBalance(sender);
                
                let loseMsg = t.fightLose
                    .replace(/@\{defender\}/g, `@${senderId}`)
                    .replace(/@\{robber\}/g, `@${robbery.robberId}`)
                    .replace('{amount}', robbery.amount.toLocaleString())
                    .replace('{balance}', defenderBalance.toLocaleString());
                
                loseMsg += t.fightChance.replace('{chance}', fightChance.toFixed(1));

                await sock.sendMessage(from, {
                    text: loseMsg,
                    mentions: [sender, robbery.robber]
                });
            }

        } catch (error) {
            console.error('[FIGHT] Command error:', error.message);
            console.error('[FIGHT] Stack:', error.stack);
            await sock.sendMessage(from, {
                text: '❌ An error occurred. Please try again.'
            });
        }
    }
};
