import { createTournament, getTournament, getGroupTournaments } from '../../utils/tournaments.js';
import { t } from '../../utils/language.js';

const translations = {
    en: {
        usage: `*Tournament Commands*

📋 *Create Tournament:*
.tournament create <game> <format> <entry_fee> <max_players>

Games: blackjack, roulette, chess
Formats: single-elimination, round-robin

📝 *Register:*
.tournament join <tournament_id>

▶️ *Start:*
.tournament start <tournament_id>

📊 *Status:*
.tournament status <tournament_id>

📜 *List:*
.tournament list

*Example:*
.tournament create blackjack single-elimination 100 8`,
        created: '✅ Tournament created!\n\nID: {id}\nGame: {game}\nFormat: {format}\nEntry Fee: {fee} coins\nMax Players: {max}\n\nPlayers can join with: .tournament join {id}',
        joined: '✅ Registered for tournament!\n\nPosition: {position}/{max}\nEntry fee paid: {fee} coins',
        started: '🎮 Tournament started!\n\nRound 1 matches:\n{matches}',
        notFound: '❌ Tournament not found',
        alreadyJoined: '❌ You are already registered',
        full: '❌ Tournament is full',
        notEnoughPlayers: '❌ Need at least {min} players to start',
        insufficientBalance: '❌ Insufficient balance. Entry fee: {fee} coins',
        noTournaments: '📋 No active tournaments in this group'
    },
    it: {
        usage: `*Comandi Torneo*

📋 *Crea Torneo:*
.tournament create <gioco> <formato> <quota> <max_giocatori>

Giochi: blackjack, roulette, chess
Formati: single-elimination, round-robin

📝 *Registrati:*
.tournament join <id_torneo>

▶️ *Inizia:*
.tournament start <id_torneo>

📊 *Stato:*
.tournament status <id_torneo>

📜 *Lista:*
.tournament list`,
        created: '✅ Torneo creato!\n\nID: {id}\nGioco: {game}\nFormato: {format}\nQuota: {fee} monete\nMax Giocatori: {max}\n\nI giocatori possono unirsi con: .tournament join {id}',
        joined: '✅ Registrato al torneo!\n\nPosizione: {position}/{max}\nQuota pagata: {fee} monete',
        started: '🎮 Torneo iniziato!\n\nPartite Round 1:\n{matches}',
        notFound: '❌ Torneo non trovato',
        alreadyJoined: '❌ Sei già registrato',
        full: '❌ Il torneo è pieno',
        notEnoughPlayers: '❌ Servono almeno {min} giocatori per iniziare',
        insufficientBalance: '❌ Saldo insufficiente. Quota: {fee} monete',
        noTournaments: '📋 Nessun torneo attivo in questo gruppo'
    }
};

function translate(lang, key, replacements = {}) {
    let text = translations[lang]?.[key] || translations.en[key];
    for (const [k, v] of Object.entries(replacements)) {
        text = text.replace(`{${k}}`, v);
    }
    return text;
}

export default {
    name: 'tournament',
    aliases: ['tourney', 'tourn'],
    description: 'Manage tournaments',
    usage: '.tournament <create|join|start|status|list> [args]',
    category: 'games',
    groupOnly: true,
    
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const lang = 'en'; // Get from database
        
        const subcommand = args[0]?.toLowerCase();
        
        if (!subcommand) {
            return await sock.sendMessage(from, {
                text: translate(lang, 'usage')
            });
        }
        
        switch (subcommand) {
            case 'create': {
                const [, game, format, entryFee, maxPlayers] = args;
                
                if (!game || !format) {
                    return await sock.sendMessage(from, {
                        text: translate(lang, 'usage')
                    });
                }
                
                const tournament = createTournament(from, {
                    name: `${game} Tournament`,
                    game: game.toLowerCase(),
                    format: format.toLowerCase(),
                    entryFee: parseInt(entryFee) || 0,
                    maxPlayers: parseInt(maxPlayers) || 8,
                    minPlayers: 2
                });
                
                await sock.sendMessage(from, {
                    text: translate(lang, 'created', {
                        id: tournament.id,
                        game: tournament.game,
                        format: tournament.format,
                        fee: tournament.entryFee,
                        max: tournament.maxPlayers
                    })
                });
                break;
            }
            
            case 'join': {
                const tournamentId = args[1];
                if (!tournamentId) {
                    return await sock.sendMessage(from, {
                        text: '❌ Please provide tournament ID'
                    });
                }
                
                const tournament = getTournament(tournamentId);
                if (!tournament) {
                    return await sock.sendMessage(from, {
                        text: translate(lang, 'notFound')
                    });
                }
                
                const pushName = msg.pushName || sender.split('@')[0];
                const result = tournament.registerPlayer(sender, pushName);
                
                if (!result.success) {
                    return await sock.sendMessage(from, {
                        text: `❌ ${result.error}`
                    });
                }
                
                await sock.sendMessage(from, {
                    text: translate(lang, 'joined', {
                        position: result.position,
                        max: tournament.maxPlayers,
                        fee: tournament.entryFee
                    })
                });
                break;
            }
            
            case 'start': {
                const tournamentId = args[1];
                if (!tournamentId) {
                    return await sock.sendMessage(from, {
                        text: '❌ Please provide tournament ID'
                    });
                }
                
                const tournament = getTournament(tournamentId);
                if (!tournament) {
                    return await sock.sendMessage(from, {
                        text: translate(lang, 'notFound')
                    });
                }
                
                const result = tournament.start();
                if (!result.success) {
                    return await sock.sendMessage(from, {
                        text: `❌ ${result.error}`
                    });
                }
                
                const matchesText = result.matches
                    .map(m => `${m.player1} vs ${m.player2}`)
                    .join('\n');
                
                await sock.sendMessage(from, {
                    text: translate(lang, 'started', {
                        matches: matchesText
                    })
                });
                break;
            }
            
            case 'status': {
                const tournamentId = args[1];
                if (!tournamentId) {
                    return await sock.sendMessage(from, {
                        text: '❌ Please provide tournament ID'
                    });
                }
                
                const tournament = getTournament(tournamentId);
                if (!tournament) {
                    return await sock.sendMessage(from, {
                        text: translate(lang, 'notFound')
                    });
                }
                
                const status = tournament.getStatus();
                let text = `🏆 *Tournament Status*\n\n`;
                text += `Name: ${status.name}\n`;
                text += `Game: ${status.game}\n`;
                text += `Format: ${status.format}\n`;
                text += `Status: ${status.status}\n`;
                text += `Participants: ${status.participants}/${status.maxPlayers}\n`;
                text += `Prize Pool: ${status.prizePool} coins\n`;
                
                if (status.status === 'in-progress') {
                    text += `\nCurrent Round: ${status.currentRound}\n`;
                    const currentMatches = tournament.getCurrentRoundMatches();
                    if (currentMatches.length > 0) {
                        text += `\nPending Matches:\n`;
                        currentMatches.forEach(m => {
                            text += `• ${m.player1} vs ${m.player2}\n`;
                        });
                    }
                }
                
                if (status.winner) {
                    text += `\n👑 Winner: ${status.winner}`;
                }
                
                await sock.sendMessage(from, { text });
                break;
            }
            
            case 'list': {
                const tournaments = getGroupTournaments(from);
                
                if (tournaments.length === 0) {
                    return await sock.sendMessage(from, {
                        text: translate(lang, 'noTournaments')
                    });
                }
                
                let text = '🏆 *Active Tournaments*\n\n';
                tournaments.forEach(t => {
                    text += `ID: ${t.id}\n`;
                    text += `Game: ${t.game}\n`;
                    text += `Status: ${t.status}\n`;
                    text += `Players: ${t.participants.length}/${t.maxPlayers}\n`;
                    text += `Entry Fee: ${t.entryFee} coins\n\n`;
                });
                
                await sock.sendMessage(from, { text });
                break;
            }
            
            default:
                await sock.sendMessage(from, {
                    text: translate(lang, 'usage')
                });
        }
    }
};
