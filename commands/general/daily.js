import { getGroupLanguage } from '../../utils/language.js';
import { addCoins, getBalance } from '../../utils/bank_SAFE.js';
import { canClaimDaily, claimDaily, getTimeUntilNextClaim, getDailyStats } from '../../utils/economy/dailyRewards.js';

// Ruota della fortuna prizes
const WHEEL_PRIZES = [
    { coins: 50, emoji: '💰', weight: 20 },      // 20% chance
    { coins: 100, emoji: '💵', weight: 25 },     // 25% chance
    { coins: 200, emoji: '💸', weight: 20 },     // 20% chance
    { coins: 500, emoji: '💎', weight: 15 },     // 15% chance
    { coins: 1000, emoji: '🏆', weight: 10 },    // 10% chance
    { coins: 2500, emoji: '👑', weight: 7 },     // 7% chance
    { coins: 5000, emoji: '⭐', weight: 2.5 },   // 2.5% chance
    { coins: 10000, emoji: '🌟', weight: 0.5 }   // 0.5% chance (jackpot!)
];

const responses = {
    en: {
        usage: '🎡 WHEEL OF FORTUNE\n\nSpin the daily wheel for prizes!\n\nUsage: .daily\n\nPossible Prizes:\n💰 50 coins (20%)\n💵 100 coins (25%)\n💸 200 coins (20%)\n💎 500 coins (15%)\n🏆 1,000 coins (10%)\n👑 2,500 coins (7%)\n⭐ 5,000 coins (2.5%)\n🌟 10,000 coins (0.5%) JACKPOT!\n\nSpin once every 24 hours!',
        spinning: '🎡 SPINNING THE WHEEL...\n\n{wheel}\n\n⏳ Wait for it...',
        result: '🎉 WHEEL STOPPED!\n\n{wheel}\n\n{emoji} YOU WON: {coins} COINS!\n\n🔥 Streak: {streak} days\n💵 New balance: {balance} coins\n\n⏰ Come back in 24 hours!',
        jackpot: '🌟💥 JACKPOT! 💥🌟\n\n{wheel}\n\n🎊 YOU WON THE JACKPOT!\n{emoji} {coins} COINS!\n\n🔥 Streak: {streak} days\n💵 New balance: {balance} coins\n\n🎉 INCREDIBLE LUCK!\n⏰ Come back in 24 hours!',
        tooSoon: '⏰ TOO SOON!\n\nYou already spun the wheel today!\n\n⏳ Next spin in: {hours}h {minutes}m\n🔥 Current streak: {streak} days\n\n💡 Keep your streak alive!',
        stats: '📊 WHEEL STATS\n\n🔥 Current streak: {streak} days\n🎡 Total spins: {totalClaims}\n⏰ Next spin: {nextClaim}\n\n💡 Spin daily to keep your streak!'
    },
    it: {
        usage: '🎡 RUOTA DELLA FORTUNA\n\nGira la ruota giornaliera per vincere premi!\n\nUso: .daily\n\nPremi Possibili:\n💰 50 monete (20%)\n💵 100 monete (25%)\n💸 200 monete (20%)\n💎 500 monete (15%)\n🏆 1.000 monete (10%)\n👑 2.500 monete (7%)\n⭐ 5.000 monete (2.5%)\n🌟 10.000 monete (0.5%) JACKPOT!\n\nGira una volta ogni 24 ore!',
        spinning: '🎡 GIRANDO LA RUOTA...\n\n{wheel}\n\n⏳ Aspetta...',
        result: '🎉 LA RUOTA SI È FERMATA!\n\n{wheel}\n\n{emoji} HAI VINTO: {coins} MONETE!\n\n🔥 Serie: {streak} giorni\n💵 Nuovo saldo: {balance} monete\n\n⏰ Torna tra 24 ore!',
        jackpot: '🌟💥 JACKPOT! 💥🌟\n\n{wheel}\n\n🎊 HAI VINTO IL JACKPOT!\n{emoji} {coins} MONETE!\n\n🔥 Serie: {streak} giorni\n💵 Nuovo saldo: {balance} monete\n\n🎉 FORTUNA INCREDIBILE!\n⏰ Torna tra 24 ore!',
        tooSoon: '⏰ TROPPO PRESTO!\n\nHai già girato la ruota oggi!\n\n⏳ Prossimo giro tra: {hours}h {minutes}m\n🔥 Serie attuale: {streak} giorni\n\n💡 Mantieni viva la tua serie!',
        stats: '📊 STATISTICHE RUOTA\n\n🔥 Serie attuale: {streak} giorni\n🎡 Giri totali: {totalClaims}\n⏰ Prossimo giro: {nextClaim}\n\n💡 Gira ogni giorno per mantenere la serie!'
    },
    ru: {
        usage: '🎡 КОЛЕСО ФОРТУНЫ\n\nКрутите ежедневное колесо для призов!\n\nИспользование: .daily\n\nВозможные Призы:\n💰 50 монет (20%)\n💵 100 монет (25%)\n💸 200 монет (20%)\n💎 500 монет (15%)\n🏆 1,000 монет (10%)\n👑 2,500 монет (7%)\n⭐ 5,000 монет (2.5%)\n🌟 10,000 монет (0.5%) ДЖЕКПОТ!\n\nКрутите раз в 24 часа!',
        spinning: '🎡 КРУТИМ КОЛЕСО...\n\n{wheel}\n\n⏳ Подождите...',
        result: '🎉 КОЛЕСО ОСТАНОВИЛОСЬ!\n\n{wheel}\n\n{emoji} ВЫ ВЫИГРАЛИ: {coins} МОНЕТ!\n\n🔥 Серия: {streak} дней\n💵 Новый баланс: {balance} монет\n\n⏰ Возвращайтесь через 24 часа!',
        jackpot: '🌟💥 ДЖЕКПОТ! 💥🌟\n\n{wheel}\n\n🎊 ВЫ ВЫИГРАЛИ ДЖЕКПОТ!\n{emoji} {coins} МОНЕТ!\n\n🔥 Серия: {streak} дней\n💵 Новый баланс: {balance} монет\n\n🎉 НЕВЕРОЯТНАЯ УДАЧА!\n⏰ Возвращайтесь через 24 часа!',
        tooSoon: '⏰ СЛИШКОМ РАНО!\n\nВы уже крутили колесо сегодня!\n\n⏳ Следующее вращение через: {hours}ч {minutes}м\n🔥 Текущая серия: {streak} дней\n\n💡 Поддерживайте свою серию!',
        stats: '📊 СТАТИСТИКА КОЛЕСА\n\n🔥 Текущая серия: {streak} дней\n🎡 Всего вращений: {totalClaims}\n⏰ Следующее вращение: {nextClaim}\n\n💡 Крутите ежедневно для поддержания серии!'
    },
    es: {
        usage: '🎡 RUEDA DE LA FORTUNA\n\n¡Gira la rueda diaria para ganar premios!\n\nUso: .daily\n\nPremios Posibles:\n💰 50 monedas (20%)\n💵 100 monedas (25%)\n💸 200 monedas (20%)\n💎 500 monedas (15%)\n🏆 1,000 monedas (10%)\n👑 2,500 monedas (7%)\n⭐ 5,000 monedas (2.5%)\n🌟 10,000 monedas (0.5%) ¡JACKPOT!\n\n¡Gira una vez cada 24 horas!',
        spinning: '🎡 GIRANDO LA RUEDA...\n\n{wheel}\n\n⏳ Espera...',
        result: '🎉 ¡LA RUEDA SE DETUVO!\n\n{wheel}\n\n{emoji} ¡GANASTE: {coins} MONEDAS!\n\n🔥 Racha: {streak} días\n💵 Nuevo saldo: {balance} monedas\n\n⏰ ¡Vuelve en 24 horas!',
        jackpot: '🌟💥 ¡JACKPOT! 💥🌟\n\n{wheel}\n\n🎊 ¡GANASTE EL JACKPOT!\n{emoji} ¡{coins} MONEDAS!\n\n🔥 Racha: {streak} días\n💵 Nuevo saldo: {balance} monedas\n\n🎉 ¡SUERTE INCREÍBLE!\n⏰ ¡Vuelve en 24 horas!',
        tooSoon: '⏰ ¡MUY PRONTO!\n\n¡Ya giraste la rueda hoy!\n\n⏳ Próximo giro en: {hours}h {minutes}m\n🔥 Racha actual: {streak} días\n\n💡 ¡Mantén tu racha viva!',
        stats: '📊 ESTADÍSTICAS DE LA RUEDA\n\n🔥 Racha actual: {streak} días\n🎡 Giros totales: {totalClaims}\n⏰ Próximo giro: {nextClaim}\n\n💡 ¡Gira diariamente para mantener tu racha!'
    },
    pt: {
        usage: '🎡 RODA DA FORTUNA\n\nGire a roda diária para ganhar prêmios!\n\nUso: .daily\n\nPrêmios Possíveis:\n💰 50 moedas (20%)\n💵 100 moedas (25%)\n💸 200 moedas (20%)\n💎 500 moedas (15%)\n🏆 1,000 moedas (10%)\n👑 2,500 moedas (7%)\n⭐ 5,000 moedas (2.5%)\n🌟 10,000 moedas (0.5%) JACKPOT!\n\nGire uma vez a cada 24 horas!',
        spinning: '🎡 GIRANDO A RODA...\n\n{wheel}\n\n⏳ Aguarde...',
        result: '🎉 A RODA PAROU!\n\n{wheel}\n\n{emoji} VOCÊ GANHOU: {coins} MOEDAS!\n\n🔥 Sequência: {streak} dias\n💵 Novo saldo: {balance} moedas\n\n⏰ Volte em 24 horas!',
        jackpot: '🌟💥 JACKPOT! 💥🌟\n\n{wheel}\n\n🎊 VOCÊ GANHOU O JACKPOT!\n{emoji} {coins} MOEDAS!\n\n🔥 Sequência: {streak} dias\n💵 Novo saldo: {balance} moedas\n\n🎉 SORTE INCRÍVEL!\n⏰ Volte em 24 horas!',
        tooSoon: '⏰ MUITO CEDO!\n\nVocê já girou a roda hoje!\n\n⏳ Próximo giro em: {hours}h {minutes}m\n🔥 Sequência atual: {streak} dias\n\n💡 Mantenha sua sequência viva!',
        stats: '📊 ESTATÍSTICAS DA RODA\n\n🔥 Sequência atual: {streak} dias\n🎡 Giros totais: {totalClaims}\n⏰ Próximo giro: {nextClaim}\n\n💡 Gire diariamente para manter sua sequência!'
    },
    ar: {
        usage: '🎡 عجلة الحظ\n\nأدر العجلة اليومية للفوز بالجوائز!\n\nالاستخدام: .daily\n\nالجوائز المحتملة:\n💰 50 عملة (20%)\n💵 100 عملة (25%)\n💸 200 عملة (20%)\n💎 500 عملة (15%)\n🏆 1,000 عملة (10%)\n👑 2,500 عملة (7%)\n⭐ 5,000 عملة (2.5%)\n🌟 10,000 عملة (0.5%) جاكبوت!\n\nأدر مرة كل 24 ساعة!',
        spinning: '🎡 تدور العجلة...\n\n{wheel}\n\n⏳ انتظر...',
        result: '🎉 توقفت العجلة!\n\n{wheel}\n\n{emoji} فزت بـ: {coins} عملة!\n\n🔥 السلسلة: {streak} أيام\n💵 الرصيد الجديد: {balance} عملة\n\n⏰ عد بعد 24 ساعة!',
        jackpot: '🌟💥 جاكبوت! 💥🌟\n\n{wheel}\n\n🎊 فزت بالجاكبوت!\n{emoji} {coins} عملة!\n\n🔥 السلسلة: {streak} أيام\n💵 الرصيد الجديد: {balance} عملة\n\n🎉 حظ لا يصدق!\n⏰ عد بعد 24 ساعة!',
        tooSoon: '⏰ مبكر جداً!\n\nلقد أدرت العجلة اليوم بالفعل!\n\n⏳ الدوران التالي في: {hours}س {minutes}د\n🔥 السلسلة الحالية: {streak} أيام\n\n💡 حافظ على سلسلتك حية!',
        stats: '📊 إحصائيات العجلة\n\n🔥 السلسلة الحالية: {streak} أيام\n🎡 إجمالي الدورانات: {totalClaims}\n⏰ الدوران التالي: {nextClaim}\n\n💡 أدر يومياً للحفاظ على سلسلتك!'
    },
    hi: {
        usage: '🎡 किस्मत का पहिया\n\nइनाम जीतने के लिए डेली व्हील घुमाएं!\n\nउपयोग: .daily\n\nसंभावित इनाम:\n💰 50 कॉइन (20%)\n💵 100 कॉइन (25%)\n💸 200 कॉइन (20%)\n💎 500 कॉइन (15%)\n🏆 1,000 कॉइन (10%)\n👑 2,500 कॉइन (7%)\n⭐ 5,000 कॉइन (2.5%)\n🌟 10,000 कॉइन (0.5%) जैकपॉट!\n\nहर 24 घंटे में एक बार घुमाएं!',
        spinning: '🎡 व्हील घूम रहा है...\n\n{wheel}\n\n⏳ इंतजार करें...',
        result: '🎉 व्हील रुक गया!\n\n{wheel}\n\n{emoji} आपने जीता: {coins} कॉइन!\n\n🔥 लकीर: {streak} दिन\n💵 नया बैलेंस: {balance} कॉइन\n\n⏰ 24 घंटे में वापस आएं!',
        jackpot: '🌟💥 जैकपॉट! 💥🌟\n\n{wheel}\n\n🎊 आपने जैकपॉट जीता!\n{emoji} {coins} कॉइन!\n\n🔥 लकीर: {streak} दिन\n💵 नया बैलेंस: {balance} कॉइन\n\n🎉 अविश्वसनीय किस्मत!\n⏰ 24 घंटे में वापस आएं!',
        tooSoon: '⏰ बहुत जल्दी!\n\nआपने आज पहले ही व्हील घुमाया है!\n\n⏳ अगला स्पिन: {hours}घं {minutes}मि में\n🔥 वर्तमान लकीर: {streak} दिन\n\n💡 अपनी लकीर बनाए रखें!',
        stats: '📊 व्हील स्टैट्स\n\n🔥 वर्तमान लकीर: {streak} दिन\n🎡 कुल स्पिन: {totalClaims}\n⏰ अगला स्पिन: {nextClaim}\n\n💡 अपनी लकीर बनाए रखने के लिए रोज़ घुमाएं!'
    },
    ng: {
        usage: '🎡 WHEEL OF FORTUNE\n\nSpin di daily wheel make you win prize!\n\nHow to use: .daily\n\nPrizes wey fit drop:\n💰 50 coins (20%)\n💵 100 coins (25%)\n💸 200 coins (20%)\n💎 500 coins (15%)\n🏆 1,000 coins (10%)\n👑 2,500 coins (7%)\n⭐ 5,000 coins (2.5%)\n🌟 10,000 coins (0.5%) JACKPOT!\n\nSpin once every 24 hours!',
        spinning: '🎡 WHEEL DEY SPIN...\n\n{wheel}\n\n⏳ Wait small...',
        result: '🎉 WHEEL DON STOP!\n\n{wheel}\n\n{emoji} YOU WIN: {coins} COINS!\n\n🔥 Streak: {streak} days\n💵 New balance: {balance} coins\n\n⏰ Come back after 24 hours!',
        jackpot: '🌟💥 JACKPOT! 💥🌟\n\n{wheel}\n\n🎊 YOU WIN JACKPOT!\n{emoji} {coins} COINS!\n\n🔥 Streak: {streak} days\n💵 New balance: {balance} coins\n\n🎉 YOUR LUCK TOO MUCH!\n⏰ Come back after 24 hours!',
        tooSoon: '⏰ E NEVER REACH TIME!\n\nYou don spin wheel today already!\n\n⏳ Next spin for: {hours}h {minutes}m\n🔥 Current streak: {streak} days\n\n💡 Keep your streak alive!',
        stats: '📊 WHEEL STATS\n\n🔥 Current streak: {streak} days\n🎡 Total spins: {totalClaims}\n⏰ Next spin: {nextClaim}\n\n💡 Spin every day make you keep your streak!'
    }
};

function formatTime(ms) {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return { hours, minutes };
}

function selectPrize() {
    const totalWeight = WHEEL_PRIZES.reduce((sum, prize) => sum + prize.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const prize of WHEEL_PRIZES) {
        random -= prize.weight;
        if (random <= 0) {
            return prize;
        }
    }
    
    return WHEEL_PRIZES[0]; // Fallback
}

function createWheel(highlightIndex = -1) {
    const wheel = [];
    const prizes = [...WHEEL_PRIZES].sort((a, b) => b.coins - a.coins); // Sort by value
    
    for (let i = 0; i < prizes.length; i++) {
        const prize = prizes[i];
        const isHighlighted = i === highlightIndex;
        const marker = isHighlighted ? '👉' : '  ';
        const line = `${marker} ${prize.emoji} ${prize.coins.toLocaleString()} coins`;
        wheel.push(line);
    }
    
    return '┌─────────────────┐\n' + 
           wheel.map(line => `│ ${line.padEnd(15)} │`).join('\n') + 
           '\n└─────────────────┘';
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
    name: 'daily',
    aliases: ['wheel', 'spin'],
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        // Show usage if help requested
        if (args[0] === 'help' || args[0] === 'info') {
            await sock.sendMessage(from, { text: t.usage });
            return;
        }
        
        // Show stats if requested
        if (args[0] === 'stats') {
            const stats = getDailyStats(sender);
            const timeUntil = getTimeUntilNextClaim(sender);
            const { hours, minutes } = formatTime(timeUntil);
            
            const nextClaim = timeUntil === 0 ? 'Available now!' : `${hours}h ${minutes}m`;
            
            await sock.sendMessage(from, {
                text: t.stats
                    .replace('{streak}', stats.streak)
                    .replace('{totalClaims}', stats.totalClaims)
                    .replace('{nextClaim}', nextClaim)
            });
            return;
        }
        
        // Check if can claim
        if (!canClaimDaily(sender)) {
            const timeUntil = getTimeUntilNextClaim(sender);
            const { hours, minutes } = formatTime(timeUntil);
            const stats = getDailyStats(sender);
            
            await sock.sendMessage(from, {
                text: t.tooSoon
                    .replace('{hours}', hours)
                    .replace('{minutes}', minutes)
                    .replace('{streak}', stats.streak)
            });
            return;
        }
        
        // Select prize
        const prize = selectPrize();
        const prizeIndex = [...WHEEL_PRIZES].sort((a, b) => b.coins - a.coins).findIndex(p => p.coins === prize.coins);
        
        // Show spinning animation
        const spinningMsg = await sock.sendMessage(from, {
            text: t.spinning.replace('{wheel}', createWheel())
        });
        
        // Animate wheel spinning (3 frames)
        for (let i = 0; i < 3; i++) {
            await sleep(800);
            const randomIndex = Math.floor(Math.random() * WHEEL_PRIZES.length);
            await sock.sendMessage(from, {
                text: t.spinning.replace('{wheel}', createWheel(randomIndex)),
                edit: spinningMsg.key
            });
        }
        
        // Wait a bit before final result
        await sleep(1000);
        
        // Claim daily reward with the prize amount
        const result = claimDaily(sender);
        
        if (result.success) {
            // Add the prize coins
            await addCoins(sender, prize.coins);
            const newBalance = await getBalance(sender);
            
            // Show final result
            const isJackpot = prize.coins >= 10000;
            const resultText = isJackpot ? t.jackpot : t.result;
            
            await sock.sendMessage(from, {
                text: resultText
                    .replace('{wheel}', createWheel(prizeIndex))
                    .replace('{emoji}', prize.emoji)
                    .replace('{coins}', prize.coins.toLocaleString())
                    .replace('{streak}', result.streak)
                    .replace('{balance}', newBalance.toLocaleString()),
                edit: spinningMsg.key
            });
        }
    }
};
