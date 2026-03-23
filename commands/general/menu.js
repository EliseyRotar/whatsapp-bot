import { config } from '../../config.js';
import { getGroupLanguage } from '../../utils/language.js';
import { sendAsChannelForward } from '../../utils/fakeForward.js';

const responses = {
    en: {
        promo: '🤖 NEED A BOT FOR YOUR GROUP?\n\n💬 Text the owner or add directly:\nwa.me/393313444410\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n',
        title: `╔═══════════════════════════╗\n║   🤖 ${config.botName} - Menu   ║\n╚═══════════════════════════╝`,
        
        content: `
┌─ 🌐 GENERAL
│ .ping
│ .alive
│ .ai
│ .menu
│ .admin
│ .info
│ .latest
│ .updates
│ .stats
│ .jid
│ .checkowner
│ .sticker
│ .delete
│ .vv
│ .setlang
│ .ad
│ .adit
│ .daily
│ .invite
│ .leaderboard
│ .pay
│ .guide
│ .stopguide
│ .image
│ .games
│ .adminhelp
│ .baida
│ .debugorario
│ .orario
│ .setorario
│ .teacher
│ .test
│ .testforward
│ .testuntis
│ .trading
│ .start
│ .scam
│ .shield
│ .killstats
│ .pay_v2

┌─ 💰 ECONOMY & SHOP
│ .bank
│ .daily
│ .pay
│ .invite
│ .leaderboard
│ .shop
│ .buybulk

┌─ 🎮 GAMES
│ .games
│ .8ball
│ .dice
│ .coinflip
│ .rps
│ .guess
│ .trivia
│ .math
│ .tictactoe
│ .chess
│ .slot
│ .slotstats
│ .roulette
│ .mines
│ .rob
│ .fight
│ .double
│ .tournament
│ .achievements

┌─ 🃏 BLACKJACK
│ .blackjack
│ .hit
│ .stand
│ .double
│ .split
│ .hand
│ .surrender
│ .insurance
│ .bjstats
│ .bjleaderboard

┌─ 💀 ACTION
│ .kill

┌─ 👮 ADMIN (Groups Only)
│ .add
│ .kick
│ .ban
│ .promote
│ .demote
│ .warn
│ .warnings
│ .mute
│ .unmute
│ .report
│ .tagall
│ .tagadmin
│ .tagnotadmin
│ .hidetag
│ .lockdown
│ .antilink
│ .antidelete
│ .welcome
│ .setgname
│ .setgdesc
│ .resetlink
│ .groupinfo
│ .staff
│ .newsletter
│ .delall

┌─ 👑 OWNER
│ .mode
│ .debug
│ .audit
│ .ownerhelp
│ .checkbotjid
│ .spam
│ .broadcast
│ .announce
│ .raid
│ .autovv
│ .newsletterconfig
│ .manage
│ .addowner
│ .removeowner
│ .listowners
│ .resetbalances
│ .roball
│ .addall
│ .autocall
│ .botoff

┌─ 📥 DOWNLOADERS
│ .ytmp3

╔═══════════════════════════╗
║  Prefix: ${config.prefix}  |  Owner: ${config.ownerName}  ║
╚═══════════════════════════╝

💡 Tips:
• Reply to messages: .vv .sticker .delete .debug
• Admin cmds need group admin perms
• Bot must be admin: kick, ban, promote, demote, mute
• Use "all" to bet everything: .slot all .dice all
• Weapons are single-use from .shop

📱 Bot Owner: ${config.ownerName} (+${config.ownerNumber})`
    },
    
    it: {
        promo: '🤖 HAI BISOGNO DI UN BOT PER IL TUO GRUPPO?\n\n💬 Scrivi al proprietario o aggiungi direttamente:\nwa.me/393313444410\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n',
        title: `╔═══════════════════════════╗\n║   🤖 ${config.botName} - Menu   ║\n╚═══════════════════════════╝`,
        
        content: `
┌─ 🌐 GENERALI
│ .ping
│ .alive
│ .ai
│ .menu
│ .admin
│ .info
│ .latest
│ .updates
│ .stats
│ .jid
│ .checkowner
│ .sticker
│ .delete
│ .vv
│ .setlang
│ .ad
│ .adit
│ .daily
│ .invite
│ .leaderboard
│ .pay
│ .guide
│ .stopguide
│ .image
│ .games
│ .adminhelp
│ .baida
│ .debugorario
│ .orario
│ .setorario
│ .teacher
│ .test
│ .testforward
│ .testuntis
│ .trading
│ .start
│ .scam
│ .shield
│ .killstats
│ .pay_v2

┌─ 💰 ECONOMIA & NEGOZIO
│ .bank
│ .daily
│ .pay
│ .invite
│ .leaderboard
│ .shop
│ .buybulk

┌─ 🎮 GIOCHI
│ .games
│ .8ball
│ .dice
│ .coinflip
│ .rps
│ .guess
│ .trivia
│ .math
│ .tictactoe
│ .chess
│ .slot
│ .slotstats
│ .roulette
│ .mines
│ .rob
│ .fight
│ .double
│ .tournament
│ .achievements

┌─ 🃏 BLACKJACK
│ .blackjack
│ .hit
│ .stand
│ .double
│ .split
│ .hand
│ .surrender
│ .insurance
│ .bjstats
│ .bjleaderboard

┌─ 💀 AZIONE
│ .kill

┌─ 👮 ADMIN (Solo Gruppi)
│ .add
│ .kick
│ .ban
│ .promote
│ .demote
│ .warn
│ .warnings
│ .mute
│ .unmute
│ .report
│ .tagall
│ .tagadmin
│ .tagnotadmin
│ .hidetag
│ .lockdown
│ .antilink
│ .antidelete
│ .welcome
│ .setgname
│ .setgdesc
│ .resetlink
│ .groupinfo
│ .staff
│ .newsletter
│ .delall

┌─ 👑 PROPRIETARIO
│ .mode
│ .debug
│ .audit
│ .ownerhelp
│ .checkbotjid
│ .spam
│ .broadcast
│ .announce
│ .raid
│ .autovv
│ .newsletterconfig
│ .manage
│ .addowner
│ .removeowner
│ .listowners
│ .resetbalances
│ .roball
│ .addall
│ .autocall
│ .botoff

┌─ 📥 DOWNLOAD
│ .ytmp3

╔═══════════════════════════╗
║  Prefisso: ${config.prefix}  |  Proprietario: ${config.ownerName}  ║
╚═══════════════════════════╝

💡 Suggerimenti:
• Rispondi ai messaggi: .vv .sticker .delete .debug
• Comandi admin richiedono permessi admin
• Bot deve essere admin: kick, ban, promote, demote, mute
• Usa "all" per scommettere tutto: .slot all .dice all
• Le armi sono monouso da .shop

📱 Proprietario Bot: ${config.ownerName} (+${config.ownerNumber})`
    }
};

export default {
    name: 'menu',
    aliases: ['help', 'commands'],
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;

        try {
            const menuText = t.promo + t.title + t.content;

            // Send as fake forward from newsletter - this adds the "View Channel" button!
            await sendAsChannelForward(sock, from, menuText, {
                quoted: msg,
                newsletterName: config.botName || 'Bot Menu'
            });

        } catch (error) {
            console.error('[MENU] Command error:', error.message);
            await sock.sendMessage(from, {
                text: '❌ An error occurred while generating the menu.'
            });
        }
    }
};
