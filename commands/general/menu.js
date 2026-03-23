import { config } from '../../config.js';
import { getGroupLanguage } from '../../utils/language.js';
import { sendAsChannelForward } from '../../utils/fakeForward.js';

const responses = {
    en: {
        promo: '🤖 NEED A BOT FOR YOUR GROUP?\n\n💬 Text the owner or add directly:\nwa.me/393313444410\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n',
        title: `╔═══════════════════════════╗\n║   🤖 ${config.botName} - Menu   ║\n╚═══════════════════════════╝`,
        
        content: `
┌─ 🌐 GENERAL (43)
│ .ping .alive .ai .menu .admin .info .latest .updates .stats .jid .checkowner .sticker .delete .vv .setlang .ad .adit .daily .invite .leaderboard .pay .guide .stopguide .image .games .adminhelp .baida .debugorario .orario .setorario .teacher .test .testforward .testuntis .trading .start .scam .shield .killstats .autocall .botoff

┌─ 💰 ECONOMY & SHOP (9)
│ .bank - Check balance | .daily - Claim daily coins (200-50K)
│ .pay @user <amt> - Send coins | .invite - Referral (500/3 friends)
│ .leaderboard - Top players | .shop - Virtual shop
│ .shop buy <item> - Purchase | .shop inventory - View items
│ .buybulk <item> <qty> - Bulk purchase

┌─ 🎮 GAMES (28)
│ .games - List all | .8ball - Magic 8-ball | .dice [bet] - Roll
│ .coinflip <h/t> [bet] - Flip | .rps <choice> - Rock Paper Scissors
│ .guess - Number game | .trivia - Quiz | .math - Math challenge
│ .tictactoe [@user] - Tic-tac-toe | .chess [@user] - Chess
│ .slot [bet/all] - Slots (96% RTP) | .slotstats - Slot statistics
│ .roulette <bet> <type> - Roulette | .mines <bet> - Minesweeper
│ .rob @user - Rob player | .fight - Defend | .double - Double or nothing
│ .tournament - Join tournament | .achievements - View achievements

┌─ 🃏 BLACKJACK (10)
│ .blackjack <bet> - Start | .hit - Draw card | .stand - End turn
│ .double - Double bet | .split - Split pairs | .hand <n> - Switch hand
│ .surrender - Give up | .insurance - Buy insurance
│ .bjstats - Your stats | .bjleaderboard - Top players

┌─ 💀 ACTION (1)
│ .kill @user <weapon> - Kill player (GTA style)
│   Weapons: knife, pistol, rifle, sniper, rpg (buy from .shop)

┌─ 👮 ADMIN (24) - Groups Only
│ Members: .add .kick .ban .promote .demote
│ Moderation: .warn .warnings .mute .unmute .report
│ Tags: .tagall .tagadmin .tagnotadmin .hidetag
│ Settings: .lockdown .antilink .antidelete .welcome
│ Group: .setgname .setgdesc .resetlink .groupinfo .staff
│ Other: .newsletter .delall

┌─ 👑 OWNER (20)
│ Control: .mode .debug .audit .ownerhelp .checkbotjid
│ Broadcast: .spam .broadcast .announce .raid
│ Features: .autovv .newsletterconfig .manage
│ Owners: .addowner .removeowner .listowners
│ Economy: .resetbalances .roball
│ Other: .addall .autocall .botoff

┌─ 📥 DOWNLOADERS (1)
│ .ytmp3 <url> - Download YouTube audio

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
┌─ 🌐 GENERALI (43)
│ .ping .alive .ai .menu .admin .info .latest .updates .stats .jid .checkowner .sticker .delete .vv .setlang .ad .adit .daily .invite .leaderboard .pay .guide .stopguide .image .games .adminhelp .baida .debugorario .orario .setorario .teacher .test .testforward .testuntis .trading .start .scam .shield .killstats .autocall .botoff

┌─ 💰 ECONOMIA & NEGOZIO (9)
│ .bank - Saldo | .daily - Monete giornaliere (200-50K)
│ .pay @user <amt> - Invia monete | .invite - Referral (500/3 amici)
│ .leaderboard - Classifica | .shop - Negozio virtuale
│ .shop buy <item> - Acquista | .shop inventory - Inventario
│ .buybulk <item> <qty> - Acquisto in massa

┌─ 🎮 GIOCHI (28)
│ .games - Lista | .8ball - Palla magica | .dice [bet] - Dadi
│ .coinflip <t/c> [bet] - Moneta | .rps <scelta> - Sasso Carta Forbici
│ .guess - Indovina numero | .trivia - Quiz | .math - Matematica
│ .tictactoe [@user] - Tris | .chess [@user] - Scacchi
│ .slot [bet/all] - Slot (96% RTP) | .slotstats - Statistiche slot
│ .roulette <bet> <tipo> - Roulette | .mines <bet> - Campo minato
│ .rob @user - Deruba | .fight - Difendi | .double - Doppio o niente
│ .tournament - Torneo | .achievements - Obiettivi

┌─ 🃏 BLACKJACK (10)
│ .blackjack <bet> - Inizia | .hit - Pesca | .stand - Fermati
│ .double - Raddoppia | .split - Dividi | .hand <n> - Cambia mano
│ .surrender - Arrenditi | .insurance - Assicurazione
│ .bjstats - Statistiche | .bjleaderboard - Classifica

┌─ 💀 AZIONE (1)
│ .kill @user <arma> - Uccidi giocatore (stile GTA)
│   Armi: knife, pistol, rifle, sniper, rpg (compra da .shop)

┌─ 👮 ADMIN (24) - Solo Gruppi
│ Membri: .add .kick .ban .promote .demote
│ Moderazione: .warn .warnings .mute .unmute .report
│ Tag: .tagall .tagadmin .tagnotadmin .hidetag
│ Impostazioni: .lockdown .antilink .antidelete .welcome
│ Gruppo: .setgname .setgdesc .resetlink .groupinfo .staff
│ Altro: .newsletter .delall

┌─ 👑 PROPRIETARIO (20)
│ Controllo: .mode .debug .audit .ownerhelp .checkbotjid
│ Broadcast: .spam .broadcast .announce .raid
│ Funzioni: .autovv .newsletterconfig .manage
│ Proprietari: .addowner .removeowner .listowners
│ Economia: .resetbalances .roball
│ Altro: .addall .autocall .botoff

┌─ 📥 DOWNLOAD (1)
│ .ytmp3 <url> - Scarica audio YouTube

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
