import { getGroupLanguage } from '../../utils/language.js';
import { getStats, getWinRate, getNetProfit } from '../../utils/game/slotStats.js';

const responses = {
    en: {
        title: '━━━━━ 🎰 SLOT MACHINE STATS 🎰 ━━━━━',
        player: '👤 Player:',
        totalSpins: '🎮 Total Spins:',
        wins: '✅ Wins:',
        losses: '❌ Losses:',
        winRate: '📊 Win Rate:',
        totalWagered: '💰 Total Wagered:',
        totalWon: '💵 Total Won:',
        netProfit: '📈 Net Profit:',
        biggestWin: '🏆 Biggest Win:',
        biggestMultiplier: '⚡ Biggest Multiplier:',
        jackpotsWon: '💎 Jackpots Won:',
        freeSpinsTriggered: '🔔 Free Spins Triggered:',
        currentStreak: '🔥 Current Streak:',
        bestStreak: '⭐ Best Streak:',
        noSpins: '❌ No spins yet!\n\nStart playing with: .slot <bet>',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Keep spinning to improve your stats!'
    },
    it: {
        title: '━━━━━ 🎰 STATISTICHE SLOT MACHINE 🎰 ━━━━━',
        player: '👤 Giocatore:',
        totalSpins: '🎮 Giri Totali:',
        wins: '✅ Vittorie:',
        losses: '❌ Sconfitte:',
        winRate: '📊 Tasso Vittoria:',
        totalWagered: '💰 Totale Puntato:',
        totalWon: '💵 Totale Vinto:',
        netProfit: '📈 Profitto Netto:',
        biggestWin: '🏆 Vincita Più Grande:',
        biggestMultiplier: '⚡ Moltiplicatore Più Grande:',
        jackpotsWon: '💎 Jackpot Vinti:',
        freeSpinsTriggered: '🔔 Giri Gratis Attivati:',
        currentStreak: '🔥 Serie Attuale:',
        bestStreak: '⭐ Migliore Serie:',
        noSpins: '❌ Nessun giro ancora!\n\nInizia a giocare con: .slot <puntata>',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Continua a girare per migliorare le tue statistiche!'
    },
    ru: {
        title: '━━━━━ 🎰 СТАТИСТИКА СЛОТ-МАШИНЫ 🎰 ━━━━━',
        player: '👤 Игрок:',
        totalSpins: '🎮 Всего Вращений:',
        wins: '✅ Побед:',
        losses: '❌ Поражений:',
        winRate: '📊 Процент Побед:',
        totalWagered: '💰 Всего Поставлено:',
        totalWon: '💵 Всего Выиграно:',
        netProfit: '📈 Чистая Прибыль:',
        biggestWin: '🏆 Самый Большой Выигрыш:',
        biggestMultiplier: '⚡ Самый Большой Множитель:',
        jackpotsWon: '💎 Джекпотов Выиграно:',
        freeSpinsTriggered: '🔔 Бесплатных Вращений Активировано:',
        currentStreak: '🔥 Текущая Серия:',
        bestStreak: '⭐ Лучшая Серия:',
        noSpins: '❌ Еще нет вращений!\n\nНачните играть с: .slot <ставка>',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Продолжайте вращать, чтобы улучшить статистику!'
    },
    es: {
        title: '━━━━━ 🎰 ESTADÍSTICAS TRAGAMONEDAS 🎰 ━━━━━',
        player: '👤 Jugador:',
        totalSpins: '🎮 Giros Totales:',
        wins: '✅ Victorias:',
        losses: '❌ Derrotas:',
        winRate: '📊 Tasa de Victoria:',
        totalWagered: '💰 Total Apostado:',
        totalWon: '💵 Total Ganado:',
        netProfit: '📈 Ganancia Neta:',
        biggestWin: '🏆 Mayor Ganancia:',
        biggestMultiplier: '⚡ Mayor Multiplicador:',
        jackpotsWon: '💎 Jackpots Ganados:',
        freeSpinsTriggered: '🔔 Giros Gratis Activados:',
        currentStreak: '🔥 Racha Actual:',
        bestStreak: '⭐ Mejor Racha:',
        noSpins: '❌ ¡Aún no has girado!\n\nComienza a jugar con: .slot <apuesta>',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 ¡Sigue girando para mejorar tus estadísticas!'
    },
    pt: {
        title: '━━━━━ 🎰 ESTATÍSTICAS CAÇA-NÍQUEIS 🎰 ━━━━━',
        player: '👤 Jogador:',
        totalSpins: '🎮 Giros Totais:',
        wins: '✅ Vitórias:',
        losses: '❌ Derrotas:',
        winRate: '📊 Taxa de Vitória:',
        totalWagered: '💰 Total Apostado:',
        totalWon: '💵 Total Ganho:',
        netProfit: '📈 Lucro Líquido:',
        biggestWin: '🏆 Maior Vitória:',
        biggestMultiplier: '⚡ Maior Multiplicador:',
        jackpotsWon: '💎 Jackpots Ganhos:',
        freeSpinsTriggered: '🔔 Giros Grátis Ativados:',
        currentStreak: '🔥 Sequência Atual:',
        bestStreak: '⭐ Melhor Sequência:',
        noSpins: '❌ Você ainda não girou!\n\nComece a jogar com: .slot <aposta>',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Continue girando para melhorar suas estatísticas!'
    },
    ar: {
        title: '━━━━━ 🎰 إحصائيات السلوت 🎰 ━━━━━',
        player: '👤 اللاعب:',
        totalSpins: '🎮 إجمالي الدورات:',
        wins: '✅ الفوز:',
        losses: '❌ الخسارة:',
        winRate: '📊 نسبة الفوز:',
        totalWagered: '💰 إجمالي الرهان:',
        totalWon: '💵 إجمالي الفوز:',
        netProfit: '📈 صافي الربح:',
        biggestWin: '🏆 أكبر فوز:',
        biggestMultiplier: '⚡ أكبر مضاعف:',
        jackpotsWon: '💎 الجاكبوت المكتسب:',
        freeSpinsTriggered: '🔔 الدورات المجانية المفعلة:',
        currentStreak: '🔥 السلسلة الحالية:',
        bestStreak: '⭐ أفضل سلسلة:',
        noSpins: '❌ لا توجد دورات بعد!\n\nابدأ اللعب بـ: .slot <رهان>',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 استمر في الدوران لتحسين إحصائياتك!'
    },
    hi: {
        title: '━━━━━ 🎰 स्लॉट मशीन आंकड़े 🎰 ━━━━━',
        player: '👤 खिलाड़ी:',
        totalSpins: '🎮 कुल स्पिन:',
        wins: '✅ जीत:',
        losses: '❌ हार:',
        winRate: '📊 जीत दर:',
        totalWagered: '💰 कुल दांव:',
        totalWon: '💵 कुल जीता:',
        netProfit: '📈 शुद्ध लाभ:',
        biggestWin: '🏆 सबसे बड़ी जीत:',
        biggestMultiplier: '⚡ सबसे बड़ा गुणक:',
        jackpotsWon: '💎 जैकपॉट जीते:',
        freeSpinsTriggered: '🔔 मुफ्त स्पिन सक्रिय:',
        currentStreak: '🔥 वर्तमान लकीर:',
        bestStreak: '⭐ सर्वश्रेष्ठ लकीर:',
        noSpins: '❌ अभी तक कोई स्पिन नहीं!\n\nशुरू करें: .slot <बेट>',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 अपने आंकड़े सुधारने के लिए स्पिन करते रहें!'
    },
    ng: {
        title: '━━━━━ 🎰 SLOT MACHINE STATS 🎰 ━━━━━',
        player: '👤 Player:',
        totalSpins: '🎮 Total Spins:',
        wins: '✅ Wins:',
        losses: '❌ Losses:',
        winRate: '📊 Win Rate:',
        totalWagered: '💰 Total Wagered:',
        totalWon: '💵 Total Won:',
        netProfit: '📈 Net Profit:',
        biggestWin: '🏆 Biggest Win:',
        biggestMultiplier: '⚡ Biggest Multiplier:',
        jackpotsWon: '💎 Jackpots Won:',
        freeSpinsTriggered: '🔔 Free Spins Triggered:',
        currentStreak: '🔥 Current Streak:',
        bestStreak: '⭐ Best Streak:',
        noSpins: '❌ You never spin yet!\n\nStart play with: .slot <bet>',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Continue dey spin make your stats better!'
    }
};

export default {
    name: 'slotstats',
    aliases: ['slotstat', 'ss'],
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const pushName = msg.pushName || 'Player';
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        const coins = lang === 'it' ? 'monete' : lang === 'ru' ? 'монет' : lang === 'es' ? 'monedas' : lang === 'pt' ? 'moedas' : lang === 'ar' ? 'عملة' : lang === 'hi' ? 'कॉइन' : 'coins';
        
        const stats = getStats(sender);
        
        if (stats.totalSpins === 0) {
            return await sock.sendMessage(from, { text: t.noSpins });
        }
        
        const winRate = getWinRate(sender);
        const netProfit = getNetProfit(sender);
        const profitSign = netProfit >= 0 ? '+' : '';
        
        let text = `${t.title}\n${t.player} ${pushName}\n\n`;
        text += `━━━━━━━━━━━━━━━━━━━━━\n`;
        text += `${t.totalSpins} ${stats.totalSpins}\n`;
        text += `${t.wins} ${stats.wins}\n`;
        text += `${t.losses} ${stats.losses}\n`;
        text += `${t.winRate} ${winRate}%\n`;
        text += `━━━━━━━━━━━━━━━━━━━━━\n`;
        text += `${t.totalWagered} ${stats.totalWagered.toLocaleString()} ${coins}\n`;
        text += `${t.totalWon} ${stats.totalWon.toLocaleString()} ${coins}\n`;
        text += `${t.netProfit} ${profitSign}${netProfit.toLocaleString()} ${coins}\n`;
        text += `━━━━━━━━━━━━━━━━━━━━━\n`;
        text += `${t.biggestWin} ${stats.biggestWin.toLocaleString()} ${coins}\n`;
        text += `${t.biggestMultiplier} ${stats.biggestMultiplier}x\n`;
        text += `${t.jackpotsWon} ${stats.jackpotsWon}\n`;
        text += `${t.freeSpinsTriggered} ${stats.freeSpinsTriggered}\n`;
        text += `━━━━━━━━━━━━━━━━━━━━━\n`;
        text += `${t.currentStreak} ${stats.currentStreak}x 🔥\n`;
        text += `${t.bestStreak} ${stats.bestStreak}x ⭐`;
        text += t.footer;
        
        await sock.sendMessage(from, { text });
    }
};
