import { getGroupLanguage } from '../../utils/language.js';
import fs from 'fs';
import path from 'path';

const statsFile = path.join('./data', 'blackjackStats.json');

const responses = {
    en: {
        title: '╔═══════════════════════════╗\n║  🏆 BLACKJACK LEADERBOARD  ║\n╚═══════════════════════════╝',
        topProfit: '\n💰 TOP PROFIT LEADERS',
        topWins: '\n🎯 TOP WIN LEADERS',
        topWinRate: '\n📊 TOP WIN RATE (min 20 games)',
        topBlackjacks: '\n⭐ TOP BLACKJACK LEADERS',
        rank: 'Rank',
        player: 'Player',
        profit: 'Profit',
        wins: 'Wins',
        winRate: 'Win Rate',
        blackjacks: 'Blackjacks',
        games: 'games',
        noData: '❌ No blackjack statistics yet!\n\nPlay some games to appear on the leaderboard.\n\nStart with: .bj <bet>',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n💡 Type .bjstats to see your stats!'
    },
    it: {
        title: '╔═══════════════════════════╗\n║  🏆 CLASSIFICA BLACKJACK  ║\n╚═══════════════════════════╝',
        topProfit: '\n💰 TOP LEADER PROFITTO',
        topWins: '\n🎯 TOP LEADER VITTORIE',
        topWinRate: '\n📊 TOP TASSO VITTORIA (min 20 partite)',
        topBlackjacks: '\n⭐ TOP LEADER BLACKJACK',
        rank: 'Pos',
        player: 'Giocatore',
        profit: 'Profitto',
        wins: 'Vittorie',
        winRate: 'Tasso Vitt',
        blackjacks: 'Blackjack',
        games: 'partite',
        noData: '❌ Nessuna statistica blackjack ancora!\n\nGioca alcune partite per apparire in classifica.\n\nInizia con: .bj <puntata>',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n💡 Digita .bjstats per vedere le tue statistiche!'
    },
    ru: {
        title: '╔═══════════════════════════╗\n║  🏆 ТАБЛИЦА ЛИДЕРОВ БЛЭКДЖЕК  ║\n╚═══════════════════════════╝',
        topProfit: '\n💰 ТОП ЛИДЕРОВ ПО ПРИБЫЛИ',
        topWins: '\n🎯 ТОП ЛИДЕРОВ ПО ПОБЕДАМ',
        topWinRate: '\n📊 ТОП ПРОЦЕНТ ПОБЕД (мин 20 игр)',
        topBlackjacks: '\n⭐ ТОП ЛИДЕРОВ ПО БЛЭКДЖЕКАМ',
        rank: 'Место',
        player: 'Игрок',
        profit: 'Прибыль',
        wins: 'Победы',
        winRate: 'Процент',
        blackjacks: 'Блэкджеки',
        games: 'игр',
        noData: '❌ Пока нет статистики блэкджека!\n\nСыграйте несколько игр, чтобы появиться в таблице лидеров.\n\nНачните с: .bj <ставка>',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n💡 Введите .bjstats чтобы увидеть свою статистику!'
    },
    es: {
        title: '╔═══════════════════════════╗\n║  🏆 TABLA DE LÍDERES BLACKJACK  ║\n╚═══════════════════════════╝',
        topProfit: '\n💰 LÍDERES EN GANANCIAS',
        topWins: '\n🎯 LÍDERES EN VICTORIAS',
        topWinRate: '\n📊 MEJOR TASA DE VICTORIA (mín 20 juegos)',
        topBlackjacks: '\n⭐ LÍDERES EN BLACKJACKS',
        rank: 'Pos',
        player: 'Jugador',
        profit: 'Ganancia',
        wins: 'Victorias',
        winRate: 'Tasa Vict',
        blackjacks: 'Blackjacks',
        games: 'juegos',
        noData: '❌ ¡Aún no hay estadísticas de blackjack!\n\nJuega algunos juegos para aparecer en la tabla.\n\nComienza con: .bj <apuesta>',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n💡 ¡Escribe .bjstats para ver tus estadísticas!'
    },
    pt: {
        title: '╔═══════════════════════════╗\n║  🏆 TABELA DE LÍDERES BLACKJACK  ║\n╚═══════════════════════════╝',
        topProfit: '\n💰 LÍDERES EM LUCRO',
        topWins: '\n🎯 LÍDERES EM VITÓRIAS',
        topWinRate: '\n📊 MELHOR TAXA DE VITÓRIA (mín 20 jogos)',
        topBlackjacks: '\n⭐ LÍDERES EM BLACKJACKS',
        rank: 'Pos',
        player: 'Jogador',
        profit: 'Lucro',
        wins: 'Vitórias',
        winRate: 'Taxa Vit',
        blackjacks: 'Blackjacks',
        games: 'jogos',
        noData: '❌ Ainda não há estatísticas de blackjack!\n\nJogue alguns jogos para aparecer na tabela.\n\nComece com: .bj <aposta>',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n💡 Digite .bjstats para ver suas estatísticas!'
    },
    ar: {
        title: '╔═══════════════════════════╗\n║  🏆 لوحة المتصدرين بلاك جاك  ║\n╚═══════════════════════════╝',
        topProfit: '\n💰 المتصدرين في الأرباح',
        topWins: '\n🎯 المتصدرين في الفوز',
        topWinRate: '\n📊 أعلى نسبة فوز (20 لعبة على الأقل)',
        topBlackjacks: '\n⭐ المتصدرين في البلاك جاك',
        rank: 'المركز',
        player: 'اللاعب',
        profit: 'الربح',
        wins: 'الفوز',
        winRate: 'نسبة الفوز',
        blackjacks: 'بلاك جاك',
        games: 'ألعاب',
        noData: '❌ لسه مفيش إحصائيات بلاك جاك!\n\nالعب شوية ألعاب عشان تظهر في اللوحة.\n\nابدأ بـ: .bj <رهان>',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n💡 اكتب .bjstats عشان تشوف إحصائياتك!'
    },
    hi: {
        title: '╔═══════════════════════════╗\n║  🏆 ब्लैकजैक लीडरबोर्ड  ║\n╚═══════════════════════════╝',
        topProfit: '\n💰 शीर्ष लाभ लीडर',
        topWins: '\n🎯 शीर्ष जीत लीडर',
        topWinRate: '\n📊 शीर्ष जीत दर (न्यूनतम 20 गेम)',
        topBlackjacks: '\n⭐ शीर्ष ब्लैकजैक लीडर',
        rank: 'रैंक',
        player: 'खिलाड़ी',
        profit: 'लाभ',
        wins: 'जीत',
        winRate: 'जीत दर',
        blackjacks: 'ब्लैकजैक',
        games: 'गेम',
        noData: '❌ अभी तक कोई ब्लैकजैक आंकड़े नहीं!\n\nलीडरबोर्ड में आने के लिए कुछ गेम खेलें।\n\nशुरू करें: .bj <दांव>',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n💡 अपने आंकड़े देखने के लिए .bjstats टाइप करें!'
    },
    ng: {
        title: '╔═══════════════════════════╗\n║  🏆 BLACKJACK LEADERBOARD  ║\n╚═══════════════════════════╝',
        topProfit: '\n💰 TOP PROFIT LEADERS',
        topWins: '\n🎯 TOP WIN LEADERS',
        topWinRate: '\n📊 TOP WIN RATE (min 20 games)',
        topBlackjacks: '\n⭐ TOP BLACKJACK LEADERS',
        rank: 'Rank',
        player: 'Player',
        profit: 'Profit',
        wins: 'Wins',
        winRate: 'Win Rate',
        blackjacks: 'Blackjacks',
        games: 'games',
        noData: '❌ No blackjack stats yet!\n\nPlay some games make you show for leaderboard.\n\nStart with: .bj <bet>',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n💡 Type .bjstats make you see your stats!'
    }
};

// Load all stats
function loadAllStats() {
    try {
        if (fs.existsSync(statsFile)) {
            const data = fs.readFileSync(statsFile, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('[LEADERBOARD] Error loading stats:', error.message);
    }
    return {};
}

// Get player name from JID
function getPlayerName(jid, sock) {
    // Extract phone number from JID
    const phone = jid.split('@')[0];
    // Return last 4 digits for privacy
    return `***${phone.slice(-4)}`;
}

// Format number with sign
function formatNumber(num) {
    if (num > 0) return `+${num}`;
    return num.toString();
}

export default {
    name: 'bjtop',
    aliases: ['bjleaderboard', 'bjlb'],
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        const coins = lang === 'it' ? 'monete' : lang === 'ru' ? 'монет' : lang === 'es' ? 'monedas' : lang === 'pt' ? 'moedas' : 'coins';
        
        const allStats = loadAllStats();
        const players = Object.keys(allStats);
        
        if (players.length === 0) {
            return await sock.sendMessage(from, { text: t.noData });
        }
        
        // Calculate net profit for each player
        const playersWithStats = players.map(jid => {
            const stats = allStats[jid];
            const netProfit = stats.totalWon - stats.totalLost;
            const winRate = stats.gamesPlayed > 0 ? ((stats.wins / stats.gamesPlayed) * 100) : 0;
            
            return {
                jid,
                name: getPlayerName(jid, sock),
                netProfit,
                wins: stats.wins,
                winRate,
                blackjacks: stats.blackjacks,
                gamesPlayed: stats.gamesPlayed
            };
        });
        
        let text = t.title;
        
        // TOP PROFIT LEADERS (Top 5)
        text += t.topProfit + '\n';
        const topProfit = [...playersWithStats]
            .sort((a, b) => b.netProfit - a.netProfit)
            .slice(0, 5);
        
        topProfit.forEach((player, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
            text += `${medal} ${player.name}: ${formatNumber(player.netProfit)} ${coins}\n`;
        });
        
        // TOP WIN LEADERS (Top 5)
        text += t.topWins + '\n';
        const topWins = [...playersWithStats]
            .sort((a, b) => b.wins - a.wins)
            .slice(0, 5);
        
        topWins.forEach((player, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
            text += `${medal} ${player.name}: ${player.wins} ${t.wins.toLowerCase()}\n`;
        });
        
        // TOP WIN RATE (Top 5, minimum 20 games)
        text += t.topWinRate + '\n';
        const topWinRate = [...playersWithStats]
            .filter(p => p.gamesPlayed >= 20)
            .sort((a, b) => b.winRate - a.winRate)
            .slice(0, 5);
        
        if (topWinRate.length > 0) {
            topWinRate.forEach((player, index) => {
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
                text += `${medal} ${player.name}: ${player.winRate.toFixed(1)}% (${player.gamesPlayed} ${t.games})\n`;
            });
        } else {
            text += `   ${lang === 'it' ? 'Nessun giocatore con 20+ partite' : lang === 'ru' ? 'Нет игроков с 20+ играми' : 'No players with 20+ games'}\n`;
        }
        
        // TOP BLACKJACK LEADERS (Top 5)
        text += t.topBlackjacks + '\n';
        const topBlackjacks = [...playersWithStats]
            .sort((a, b) => b.blackjacks - a.blackjacks)
            .slice(0, 5);
        
        topBlackjacks.forEach((player, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
            text += `${medal} ${player.name}: ${player.blackjacks} ${t.blackjacks.toLowerCase()}\n`;
        });
        
        text += t.footer;
        
        await sock.sendMessage(from, { text });
    }
};
