import { getGroupLanguage } from '../../utils/language.js';
import { getStats, getWinRate, getNetProfit } from '../../utils/blackjackStats.js';

const responses = {
    en: {
        title: '━━━━━ 🎰 BLACKJACK STATS 🎰 ━━━━━',
        player: '👤 Player:',
        gamesPlayed: '🎮 Games Played:',
        wins: '✅ Wins:',
        losses: '❌ Losses:',
        pushes: '🤝 Pushes:',
        blackjacks: '⭐ Blackjacks:',
        busts: '💥 Busts:',
        surrenders: '🏳️ Surrenders:',
        winRate: '📊 Win Rate:',
        totalWagered: '💰 Total Wagered:',
        totalWon: '💵 Total Won:',
        totalLost: '💸 Total Lost:',
        netProfit: '📈 Net Profit:',
        noGames: '❌ No games played yet!\n\nStart playing with: .bj <bet>',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Keep playing to improve your stats!'
    },
    it: {
        title: '━━━━━ 🎰 STATISTICHE BLACKJACK 🎰 ━━━━━',
        player: '👤 Giocatore:',
        gamesPlayed: '🎮 Partite Giocate:',
        wins: '✅ Vittorie:',
        losses: '❌ Sconfitte:',
        pushes: '🤝 Pareggi:',
        blackjacks: '⭐ Blackjack:',
        busts: '💥 Sballati:',
        surrenders: '🏳️ Rese:',
        winRate: '📊 Tasso Vittoria:',
        totalWagered: '💰 Totale Puntato:',
        totalWon: '💵 Totale Vinto:',
        totalLost: '💸 Totale Perso:',
        netProfit: '📈 Profitto Netto:',
        noGames: '❌ Nessuna partita giocata ancora!\n\nInizia a giocare con: .bj <puntata>',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Continua a giocare per migliorare le tue statistiche!'
    },
    ru: {
        title: '━━━━━ 🎰 СТАТИСТИКА БЛЭКДЖЕК 🎰 ━━━━━',
        player: '👤 Игрок:',
        gamesPlayed: '🎮 Игр Сыграно:',
        wins: '✅ Побед:',
        losses: '❌ Поражений:',
        pushes: '🤝 Ничьих:',
        blackjacks: '⭐ Блэкджеков:',
        busts: '💥 Переборов:',
        surrenders: '🏳️ Сдач:',
        winRate: '📊 Процент Побед:',
        totalWagered: '💰 Всего Поставлено:',
        totalWon: '💵 Всего Выиграно:',
        totalLost: '💸 Всего Проиграно:',
        netProfit: '📈 Чистая Прибыль:',
        noGames: '❌ Еще не сыграно ни одной игры!\n\nНачните играть с: .bj <ставка>',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Продолжайте играть, чтобы улучшить статистику!'
    },
    es: {
        title: '━━━━━ 🎰 ESTADÍSTICAS BLACKJACK 🎰 ━━━━━',
        player: '👤 Jugador:',
        gamesPlayed: '🎮 Juegos Jugados:',
        wins: '✅ Victorias:',
        losses: '❌ Derrotas:',
        pushes: '🤝 Empates:',
        blackjacks: '⭐ Blackjacks:',
        busts: '💥 Pasados:',
        surrenders: '🏳️ Rendiciones:',
        winRate: '📊 Tasa de Victoria:',
        totalWagered: '💰 Total Apostado:',
        totalWon: '💵 Total Ganado:',
        totalLost: '💸 Total Perdido:',
        netProfit: '📈 Ganancia Neta:',
        noGames: '❌ ¡Aún no has jugado ningún juego!\n\nComienza a jugar con: .bj <apuesta>',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 ¡Sigue jugando para mejorar tus estadísticas!'
    },
    pt: {
        title: '━━━━━ 🎰 ESTATÍSTICAS BLACKJACK 🎰 ━━━━━',
        player: '👤 Jogador:',
        gamesPlayed: '🎮 Jogos Jogados:',
        wins: '✅ Vitórias:',
        losses: '❌ Derrotas:',
        pushes: '🤝 Empates:',
        blackjacks: '⭐ Blackjacks:',
        busts: '💥 Estouros:',
        surrenders: '🏳️ Desistências:',
        winRate: '📊 Taxa de Vitória:',
        totalWagered: '💰 Total Apostado:',
        totalWon: '💵 Total Ganho:',
        totalLost: '💸 Total Perdido:',
        netProfit: '📈 Lucro Líquido:',
        noGames: '❌ Você ainda não jogou nenhum jogo!\n\nComece a jogar com: .bj <aposta>',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Continue jogando para melhorar suas estatísticas!'
    },
    ar: {
        title: '━━━━━ 🎰 إحصائيات بلاك جاك 🎰 ━━━━━',
        player: '👤 اللاعب:',
        gamesPlayed: '🎮 الألعاب الملعوبة:',
        wins: '✅ الفوز:',
        losses: '❌ الخسارة:',
        pushes: '🤝 التعادل:',
        blackjacks: '⭐ بلاك جاك:',
        busts: '💥 الانفجارات:',
        surrenders: '🏳️ الاستسلام:',
        winRate: '📊 نسبة الفوز:',
        totalWagered: '💰 إجمالي الرهان:',
        totalWon: '💵 إجمالي الفوز:',
        totalLost: '💸 إجمالي الخسارة:',
        netProfit: '📈 صافي الربح:',
        noGames: '❌ لسه ملعبتش أي لعبة!\n\nابدأ اللعب بـ: .bj <رهان>',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 كمل لعب عشان تحسن إحصائياتك!'
    },
    hi: {
        title: '━━━━━ 🎰 ब्लैकजैक आंकड़े 🎰 ━━━━━',
        player: '👤 खिलाड़ी:',
        gamesPlayed: '🎮 खेले गए गेम:',
        wins: '✅ जीत:',
        losses: '❌ हार:',
        pushes: '🤝 टाई:',
        blackjacks: '⭐ ब्लैकजैक:',
        busts: '💥 बस्ट:',
        surrenders: '🏳️ सरेंडर:',
        winRate: '📊 जीत दर:',
        totalWagered: '💰 कुल दांव:',
        totalWon: '💵 कुल जीता:',
        totalLost: '💸 कुल हारा:',
        netProfit: '📈 शुद्ध लाभ:',
        noGames: '❌ अभी तक कोई गेम नहीं खेला!\n\nशुरू करें: .bj <दांव>',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 अपने आंकड़े सुधारने के लिए खेलते रहें!'
    },
    ng: {
        title: '━━━━━ 🎰 BLACKJACK STATS 🎰 ━━━━━',
        player: '👤 Player:',
        gamesPlayed: '🎮 Games Played:',
        wins: '✅ Wins:',
        losses: '❌ Losses:',
        pushes: '🤝 Pushes:',
        blackjacks: '⭐ Blackjacks:',
        busts: '💥 Busts:',
        surrenders: '🏳️ Surrenders:',
        winRate: '📊 Win Rate:',
        totalWagered: '💰 Total Wagered:',
        totalWon: '💵 Total Won:',
        totalLost: '💸 Total Lost:',
        netProfit: '📈 Net Profit:',
        noGames: '❌ You never play any game yet!\n\nStart play with: .bj <bet>',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Continue dey play make your stats better!'
    }
};

export default {
    name: 'bjstats',
    aliases: ['blackjackstats'],
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const pushName = msg.pushName || 'Player';
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        const coins = lang === 'it' ? 'monete' : lang === 'ru' ? 'монет' : lang === 'es' ? 'monedas' : lang === 'pt' ? 'moedas' : 'coins';
        
        const stats = getStats(sender);
        
        if (stats.gamesPlayed === 0) {
            return await sock.sendMessage(from, { text: t.noGames });
        }
        
        const winRate = getWinRate(sender);
        const netProfit = getNetProfit(sender);
        const profitSign = netProfit >= 0 ? '+' : '';
        
        let text = `${t.title}\n${t.player} ${pushName}\n\n`;
        text += `━━━━━━━━━━━━━━━━━━━━━\n`;
        text += `${t.gamesPlayed} ${stats.gamesPlayed}\n`;
        text += `${t.wins} ${stats.wins}\n`;
        text += `${t.losses} ${stats.losses}\n`;
        text += `${t.pushes} ${stats.pushes}\n`;
        text += `${t.blackjacks} ${stats.blackjacks}\n`;
        text += `${t.busts} ${stats.busts}\n`;
        text += `${t.surrenders} ${stats.surrenders}\n`;
        text += `━━━━━━━━━━━━━━━━━━━━━\n`;
        text += `${t.winRate} ${winRate}%\n`;
        text += `━━━━━━━━━━━━━━━━━━━━━\n`;
        text += `${t.totalWagered} ${stats.totalWagered} ${coins}\n`;
        text += `${t.totalWon} ${stats.totalWon} ${coins}\n`;
        text += `${t.totalLost} ${stats.totalLost} ${coins}\n`;
        text += `${t.netProfit} ${profitSign}${netProfit} ${coins}`;
        text += t.footer;
        
        await sock.sendMessage(from, { text });
    }
};
