import { getGroupLanguage } from '../../utils/language.js';
import { getTopPlayersByBalance, getTopPlayersByWins, getTopPlayersByWinnings } from '../../utils/leaderboard.js';
import { getReferralLeaderboard } from '../../utils/referrals.js';

const responses = {
    en: {
        usage: '🏆 LEADERBOARD\n\nView top players!\n\nCommands:\n• .leaderboard - Top 10 by balance\n• .leaderboard balance - Top by coins\n• .leaderboard wins - Top by wins\n• .leaderboard winnings - Top by total winnings\n• .leaderboard referrals - Top by referrals\n\nAliases: .lb, .top, .rank',
        balanceTitle: '🏆 TOP 10 PLAYERS - BALANCE 💰\n\n',
        winsTitle: '🏆 TOP 10 PLAYERS - WINS 🎮\n\n',
        winningsTitle: '🏆 TOP 10 PLAYERS - TOTAL WINNINGS 💎\n\n',
        referralsTitle: '🏆 TOP 10 PLAYERS - REFERRALS 👥\n\n',
        noData: '❌ No leaderboard data available yet!\n\nPlay games to appear on the leaderboard!',
        footer: '\n\n💡 Keep playing to climb the ranks!',
        medals: ['🥇', '🥈', '🥉']
    },
    it: {
        usage: '🏆 CLASSIFICA\n\nVisualizza i migliori giocatori!\n\nComandi:\n• .leaderboard - Top 10 per saldo\n• .leaderboard balance - Top per monete\n• .leaderboard wins - Top per vittorie\n• .leaderboard winnings - Top per vincite totali\n• .leaderboard referrals - Top per referral\n\nAlias: .lb, .top, .rank',
        balanceTitle: '🏆 TOP 10 GIOCATORI - SALDO 💰\n\n',
        winsTitle: '🏆 TOP 10 GIOCATORI - VITTORIE 🎮\n\n',
        winningsTitle: '🏆 TOP 10 GIOCATORI - VINCITE TOTALI 💎\n\n',
        referralsTitle: '🏆 TOP 10 GIOCATORI - REFERRAL 👥\n\n',
        noData: '❌ Nessun dato classifica disponibile!\n\nGioca per apparire in classifica!',
        footer: '\n\n💡 Continua a giocare per scalare le classifiche!',
        medals: ['🥇', '🥈', '🥉']
    },
    ru: {
        usage: '🏆 ТАБЛИЦА ЛИДЕРОВ\n\nПосмотрите лучших игроков!\n\nКоманды:\n• .leaderboard - Топ 10 по балансу\n• .leaderboard balance - Топ по монетам\n• .leaderboard wins - Топ по победам\n• .leaderboard winnings - Топ по общим выигрышам\n• .leaderboard referrals - Топ по рефералам\n\nПсевдонимы: .lb, .top, .rank',
        balanceTitle: '🏆 ТОП 10 ИГРОКОВ - БАЛАНС 💰\n\n',
        winsTitle: '🏆 ТОП 10 ИГРОКОВ - ПОБЕДЫ 🎮\n\n',
        winningsTitle: '🏆 ТОП 10 ИГРОКОВ - ОБЩИЕ ВЫИГРЫШИ 💎\n\n',
        referralsTitle: '🏆 ТОП 10 ИГРОКОВ - РЕФЕРАЛЫ 👥\n\n',
        noData: '❌ Данные таблицы лидеров пока недоступны!\n\nИграйте, чтобы появиться в таблице!',
        footer: '\n\n💡 Продолжайте играть, чтобы подняться в рейтинге!',
        medals: ['🥇', '🥈', '🥉']
    },
    es: {
        usage: '🏆 TABLA DE CLASIFICACIÓN\n\n¡Ver los mejores jugadores!\n\nComandos:\n• .leaderboard - Top 10 por saldo\n• .leaderboard balance - Top por monedas\n• .leaderboard wins - Top por victorias\n• .leaderboard winnings - Top por ganancias totales\n• .leaderboard referrals - Top por referidos\n\nAlias: .lb, .top, .rank',
        balanceTitle: '🏆 TOP 10 JUGADORES - SALDO 💰\n\n',
        winsTitle: '🏆 TOP 10 JUGADORES - VICTORIAS 🎮\n\n',
        winningsTitle: '🏆 TOP 10 JUGADORES - GANANCIAS TOTALES 💎\n\n',
        referralsTitle: '🏆 TOP 10 JUGADORES - REFERIDOS 👥\n\n',
        noData: '❌ ¡No hay datos de clasificación disponibles!\n\n¡Juega para aparecer en la clasificación!',
        footer: '\n\n💡 ¡Sigue jugando para subir en el ranking!',
        medals: ['🥇', '🥈', '🥉']
    },
    pt: {
        usage: '🏆 TABELA DE CLASSIFICAÇÃO\n\nVeja os melhores jogadores!\n\nComandos:\n• .leaderboard - Top 10 por saldo\n• .leaderboard balance - Top por moedas\n• .leaderboard wins - Top por vitórias\n• .leaderboard winnings - Top por ganhos totais\n• .leaderboard referrals - Top por indicações\n\nApelidos: .lb, .top, .rank',
        balanceTitle: '🏆 TOP 10 JOGADORES - SALDO 💰\n\n',
        winsTitle: '🏆 TOP 10 JOGADORES - VITÓRIAS 🎮\n\n',
        winningsTitle: '🏆 TOP 10 JOGADORES - GANHOS TOTAIS 💎\n\n',
        referralsTitle: '🏆 TOP 10 JOGADORES - INDICAÇÕES 👥\n\n',
        noData: '❌ Nenhum dado de classificação disponível!\n\nJogue para aparecer na classificação!',
        footer: '\n\n💡 Continue jogando para subir no ranking!',
        medals: ['🥇', '🥈', '🥉']
    },
    ar: {
        usage: '🏆 لوحة المتصدرين\n\nشاهد أفضل اللاعبين!\n\nالأوامر:\n• .leaderboard - أفضل 10 حسب الرصيد\n• .leaderboard balance - الأفضل حسب العملات\n• .leaderboard wins - الأفضل حسب الانتصارات\n• .leaderboard winnings - الأفضل حسب الأرباح الإجمالية\n• .leaderboard referrals - الأفضل حسب الإحالات\n\nالأسماء المستعارة: .lb, .top, .rank',
        balanceTitle: '🏆 أفضل 10 لاعبين - الرصيد 💰\n\n',
        winsTitle: '🏆 أفضل 10 لاعبين - الانتصارات 🎮\n\n',
        winningsTitle: '🏆 أفضل 10 لاعبين - الأرباح الإجمالية 💎\n\n',
        referralsTitle: '🏆 أفضل 10 لاعبين - الإحالات 👥\n\n',
        noData: '❌ لا توجد بيانات لوحة المتصدرين!\n\nالعب للظهور في لوحة المتصدرين!',
        footer: '\n\n💡 استمر في اللعب للصعود في الترتيب!',
        medals: ['🥇', '🥈', '🥉']
    },
    hi: {
        usage: '🏆 लीडरबोर्ड\n\nशीर्ष खिलाड़ियों को देखें!\n\nकमांड:\n• .leaderboard - शेष राशि के अनुसार शीर्ष 10\n• .leaderboard balance - सिक्कों के अनुसार शीर्ष\n• .leaderboard wins - जीत के अनुसार शीर्ष\n• .leaderboard winnings - कुल जीत के अनुसार शीर्ष\n• .leaderboard referrals - रेफरल के अनुसार शीर्ष\n\nउपनाम: .lb, .top, .rank',
        balanceTitle: '🏆 शीर्ष 10 खिलाड़ी - शेष राशि 💰\n\n',
        winsTitle: '🏆 शीर्ष 10 खिलाड़ी - जीत 🎮\n\n',
        winningsTitle: '🏆 शीर्ष 10 खिलाड़ी - कुल जीत 💎\n\n',
        referralsTitle: '🏆 शीर्ष 10 खिलाड़ी - रेफरल 👥\n\n',
        noData: '❌ लीडरबोर्ड डेटा उपलब्ध नहीं है!\n\nलीडरबोर्ड पर आने के लिए खेलें!',
        footer: '\n\n💡 रैंक में ऊपर जाने के लिए खेलते रहें!',
        medals: ['🥇', '🥈', '🥉']
    },
    ng: {
        usage: '🏆 LEADERBOARD\n\nSee top players!\n\nCommands:\n• .leaderboard - Top 10 by balance\n• .leaderboard balance - Top by coins\n• .leaderboard wins - Top by wins\n• .leaderboard winnings - Top by total winnings\n• .leaderboard referrals - Top by referrals\n\nAliases: .lb, .top, .rank',
        balanceTitle: '🏆 TOP 10 PLAYERS - BALANCE 💰\n\n',
        winsTitle: '🏆 TOP 10 PLAYERS - WINS 🎮\n\n',
        winningsTitle: '🏆 TOP 10 PLAYERS - TOTAL WINNINGS 💎\n\n',
        referralsTitle: '🏆 TOP 10 PLAYERS - REFERRALS 👥\n\n',
        noData: '❌ No leaderboard data yet!\n\nPlay games make you show for leaderboard!',
        footer: '\n\n💡 Keep playing make you climb di ranks!',
        medals: ['🥇', '🥈', '🥉']
    }
};

function formatNumber(num) {
    if (!isFinite(num)) return '∞';
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    return num.toString();
}

function getUserName(jid) {
    // Extract username from JID
    // Handle both @s.whatsapp.net and @lid formats
    let name = jid.split('@')[0];
    
    // If it's a LID format, try to get a more readable name
    // Otherwise just use the number/id
    
    // Limit length
    return name.length > 20 ? name.substring(0, 17) + '...' : name;
}

export default {
    name: 'leaderboard',
    aliases: ['lb', 'top', 'rank'],
    execute: async (sock, msg, args) => {
        try {
            const from = msg.key.remoteJid;
            const lang = getGroupLanguage(from);
            const t = responses[lang] || responses.en;
            const isGroup = from.endsWith('@g.us');
            
            console.log('[LEADERBOARD] Command started, from:', from, 'lang:', lang, 'isGroup:', isGroup);
            
            const type = args[0]?.toLowerCase() || 'balance';
            console.log('[LEADERBOARD] Type:', type);
            
            // Show usage
            if (type === 'help') {
                await sock.sendMessage(from, { text: t.usage });
                return;
            }
            
            let leaderboard = [];
            let title = '';
            let formatFunc = null;
            
            switch (type) {
                case 'balance':
                case 'coins':
                case 'money':
                    console.log('[LEADERBOARD] Getting balance leaderboard...');
                    leaderboard = getTopPlayersByBalance(10);
                    console.log('[LEADERBOARD] Balance leaderboard length:', leaderboard.length);
                    title = t.balanceTitle;
                    formatFunc = (player, index) => {
                        const medal = index < 3 ? t.medals[index] : `${index + 1}.`;
                        return `${medal} @${getUserName(player.userJid)}\n   💰 ${formatNumber(player.balance)} coins`;
                    };
                    break;
                    
                case 'wins':
                case 'victories':
                    console.log('[LEADERBOARD] Getting wins leaderboard...');
                    leaderboard = getTopPlayersByWins(10);
                    console.log('[LEADERBOARD] Wins leaderboard length:', leaderboard.length);
                    title = t.winsTitle;
                    formatFunc = (player, index) => {
                        const medal = index < 3 ? t.medals[index] : `${index + 1}.`;
                        return `${medal} @${getUserName(player.userJid)}\n   🎮 ${player.wins} wins | ${player.winRate}% win rate`;
                    };
                    break;
                    
                case 'winnings':
                case 'profit':
                    console.log('[LEADERBOARD] Getting winnings leaderboard...');
                    leaderboard = getTopPlayersByWinnings(10);
                    console.log('[LEADERBOARD] Winnings leaderboard length:', leaderboard.length);
                    title = t.winningsTitle;
                    formatFunc = (player, index) => {
                        const medal = index < 3 ? t.medals[index] : `${index + 1}.`;
                        return `${medal} @${getUserName(player.userJid)}\n   💎 ${formatNumber(player.totalWinnings)} coins`;
                    };
                    break;
                    
                case 'referrals':
                case 'referral':
                case 'invites':
                    console.log('[LEADERBOARD] Getting referrals leaderboard...');
                    leaderboard = getReferralLeaderboard(10);
                    console.log('[LEADERBOARD] Referrals leaderboard length:', leaderboard.length);
                    title = t.referralsTitle;
                    formatFunc = (player, index) => {
                        const medal = index < 3 ? t.medals[index] : `${index + 1}.`;
                        return `${medal} @${getUserName(player.userJid)}\n   👥 ${player.referralCount} referrals`;
                    };
                    break;
                    
                default:
                    console.log('[LEADERBOARD] Invalid type, showing usage');
                    await sock.sendMessage(from, { text: t.usage });
                    return;
            }
            
            // Check if leaderboard has data
            if (leaderboard.length === 0) {
                console.log('[LEADERBOARD] No data, sending noData message');
                await sock.sendMessage(from, { text: t.noData });
                return;
            }
            
            // Get group participants to map phone numbers to actual JIDs
            let participantMap = {};
            
            try {
                // Get all groups the bot is in
                const groups = await sock.groupFetchAllParticipating();
                console.log('[LEADERBOARD] Bot is in', Object.keys(groups).length, 'groups');
                
                // Build a comprehensive map from all groups
                for (const groupId in groups) {
                    const group = groups[groupId];
                    if (group.participants) {
                        for (const participant of group.participants) {
                            const phoneNumber = participant.id.split('@')[0];
                            // Store the JID (prefer @lid format if we see it)
                            if (!participantMap[phoneNumber] || participant.id.includes('@lid')) {
                                participantMap[phoneNumber] = participant.id;
                            }
                        }
                    }
                }
                console.log('[LEADERBOARD] Participant map created with', Object.keys(participantMap).length, 'unique users');
            } catch (error) {
                console.error('[LEADERBOARD] Error building participant map:', error.message);
                
                // Fallback: try to get just current group if it's a group chat
                if (isGroup) {
                    try {
                        const groupMetadata = await sock.groupMetadata(from);
                        for (const participant of groupMetadata.participants) {
                            const phoneNumber = participant.id.split('@')[0];
                            participantMap[phoneNumber] = participant.id;
                        }
                        console.log('[LEADERBOARD] Fallback: got', Object.keys(participantMap).length, 'participants from current group');
                    } catch (fallbackError) {
                        console.error('[LEADERBOARD] Fallback also failed:', fallbackError.message);
                    }
                }
            }
            
            // Build leaderboard text
            console.log('[LEADERBOARD] Building leaderboard text...');
            let leaderboardText = title;
            const mentions = [];
            
            leaderboard.forEach((player, index) => {
                try {
                    // Extract phone number from JID
                    const phoneNumber = player.userJid.split('@')[0];
                    
                    // Use actual JID from participant map if available
                    const actualJid = participantMap[phoneNumber];
                    
                    if (actualJid && actualJid.includes('@')) {
                        mentions.push(actualJid);
                    } else {
                        // Fallback: add both possible formats
                        mentions.push(`${phoneNumber}@s.whatsapp.net`);
                        mentions.push(`${phoneNumber}@lid`);
                    }
                    
                    leaderboardText += formatFunc(player, index) + '\n\n';
                } catch (error) {
                    console.error('[LEADERBOARD] Error formatting player:', player, error.message);
                }
            });
            
            leaderboardText += t.footer;
            
            console.log('[LEADERBOARD] Sending message, mentions:', mentions.length);
            console.log('[LEADERBOARD] Text length:', leaderboardText.length);
            console.log('[LEADERBOARD] Sample mentions:', mentions.slice(0, 5));
            
            // Send leaderboard with mentions
            try {
                await sock.sendMessage(from, {
                    text: leaderboardText,
                    mentions: mentions
                });
                console.log('[LEADERBOARD] Message sent successfully with mentions');
            } catch (sendError) {
                console.error('[LEADERBOARD] Error sending with mentions:', sendError.message);
                // Try without mentions as fallback
                try {
                    await sock.sendMessage(from, {
                        text: leaderboardText
                    });
                    console.log('[LEADERBOARD] Message sent successfully (fallback without mentions)');
                } catch (fallbackError) {
                    console.error('[LEADERBOARD] Fallback also failed:', fallbackError.message);
                    throw fallbackError;
                }
            }
            
            console.log('[LEADERBOARD] Message sent successfully');
        } catch (error) {
            console.error('[LEADERBOARD] Error:', error.message);
            console.error('[LEADERBOARD] Stack:', error.stack);
            throw error; // Re-throw to be caught by command handler
        }
    }
};
