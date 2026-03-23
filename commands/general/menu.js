import { config } from '../../config.js';
import { getGroupLanguage } from '../../utils/language.js';
import { sendAsChannelForward } from '../../utils/fakeForward.js';

const responses = {
    en: {
        promo: '🤖 NEED A BOT FOR YOUR GROUP?\n\n💬 Text the owner or add directly:\nwa.me/393313444410\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n',
        title: `╔═══════════════════════════╗\n║   🤖 ${config.botName} - Menu   ║\n╚═══════════════════════════╝`,
        
        content: `
┌─ 🌐 GENERAL
│ .ping - Check bot latency
│ .alive - Bot status & uptime
│ .ai <text> - Ask AI anything
│ .menu - Show this menu
│ .admin - Admin commands list
│ .info - Bot information
│ .latest - Latest update
│ .updates - All updates
│ .stats - Server statistics
│ .jid - Get your JID
│ .checkowner - Check owner status
│ .sticker - Make sticker (reply to image)
│ .delete - Delete message (reply)
│ .vv - Reveal view-once (reply)
│ .setlang <code> - Change language
│ .ad - Bot advertisement
│ .adit - Bot ad (Italian)
│ .guide - Bot guide
│ .stopguide - Stop guide
│ .image <text> - Generate AI image
│ .games - List all games
│ .adminhelp - Admin help
│ .baida - Baida command
│ .debugorario - Debug schedule
│ .orario - Check schedule
│ .setorario - Set schedule
│ .teacher - Teacher info
│ .test - Test command
│ .testforward - Test forward
│ .testuntis - Test Untis
│ .trading - Trading info
│ .start - Start bot
│ .scam - Scam info
│ .shield - Shield info
│ .killstats - Kill statistics
│ .pay_v2 - Pay v2

┌─ 💰 ECONOMY & SHOP
│ .bank - Check balance
│ .daily - Daily coins (200-50K)
│ .pay @user <amt> - Send coins
│ .invite - Referral system
│ .leaderboard - Top players
│ .shop - Virtual shop
│ .buybulk <item> <qty> - Bulk buy

┌─ 🎮 GAMES
│ .games - List all games
│ .8ball <question> - Magic 8-ball
│ .dice [bet] - Roll dice
│ .coinflip <h/t> [bet] - Flip coin
│ .rps <choice> - Rock Paper Scissors
│ .guess - Guess number (1-100)
│ .trivia - Trivia question
│ .math - Math challenge
│ .tictactoe [@user] - Tic-tac-toe
│ .chess [@user] - Play chess
│ .slot [bet/all] - Slot machine
│ .slotstats - Slot statistics
│ .roulette <bet> <type> - Roulette
│ .mines <bet> - Minesweeper
│ .rob @user - Rob player
│ .fight - Defend from rob
│ .double - Double or nothing
│ .tournament - Join tournament
│ .achievements - View achievements

┌─ 🃏 BLACKJACK
│ .blackjack <bet> - Start game
│ .hit - Draw card
│ .stand - End turn
│ .double - Double bet
│ .split - Split pairs
│ .hand <n> - Switch hand
│ .surrender - Give up
│ .insurance - Buy insurance
│ .bjstats - Your stats
│ .bjleaderboard - Top players

┌─ 💀 ACTION
│ .kill @user <weapon> - Kill player (GTA style)

┌─ 👮 ADMIN (Groups Only)
│ .add <number> - Add member
│ .kick @user - Remove user
│ .ban @user - Ban user
│ .promote @user - Make admin
│ .demote @user - Remove admin
│ .warn @user <reason> - Warn user
│ .warnings @user - Check warnings
│ .mute <minutes> - Mute group
│ .unmute - Unmute group
│ .report - Report message
│ .tagall <msg> - Tag everyone
│ .tagadmin <msg> - Tag admins
│ .tagnotadmin <msg> - Tag non-admins
│ .hidetag <msg> - Hidden tag all
│ .lockdown <on/off> - Lock group
│ .antilink <on/off> - Link protection
│ .antidelete <on/off> - Anti-delete
│ .welcome <on/off> - Welcome messages
│ .setgname <name> - Change group name
│ .setgdesc <desc> - Change description
│ .resetlink - Reset invite link
│ .groupinfo - Group details
│ .staff - List admins
│ .newsletter - Manage newsletter
│ .delall - Delete all messages

┌─ 👑 OWNER
│ .mode <public/private> - Set bot mode
│ .debug - Debug info (reply)
│ .audit - System audit log
│ .ownerhelp - Owner help
│ .checkbotjid - Check bot JID
│ .spam <count> <text> - Spam messages
│ .broadcast <msg> - Send to all groups
│ .announce <msg> - Announcement
│ .raid confirm - Raid group
│ .autovv <on/off> - Auto-save view-once
│ .newsletterconfig - Newsletter config
│ .manage @user <action> - Manage user
│ .addowner @user - Add owner
│ .removeowner @user - Remove owner
│ .listowners - List owners
│ .resetbalances - Reset all balances
│ .roball - Rob everyone
│ .addall - Bulk add members
│ .autocall - Auto call
│ .botoff - Turn bot off

┌─ 📥 DOWNLOADERS
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
┌─ 🌐 GENERALI
│ .ping - Latenza bot
│ .alive - Stato e uptime
│ .ai <testo> - Chiedi all'AI
│ .menu - Mostra menu
│ .admin - Lista comandi admin
│ .info - Info bot
│ .latest - Ultimo aggiornamento
│ .updates - Tutti gli aggiornamenti
│ .stats - Statistiche server
│ .jid - Ottieni JID
│ .checkowner - Stato proprietario
│ .sticker - Crea sticker (rispondi)
│ .delete - Elimina messaggio (rispondi)
│ .vv - Rivela view-once (rispondi)
│ .setlang <code> - Cambia lingua
│ .ad - Pubblicità bot
│ .adit - Pubblicità (Italiano)
│ .guide - Guida bot
│ .stopguide - Ferma guida
│ .image <testo> - Genera immagine AI
│ .games - Lista giochi
│ .adminhelp - Aiuto admin
│ .baida - Comando baida
│ .debugorario - Debug orario
│ .orario - Controlla orario
│ .setorario - Imposta orario
│ .teacher - Info insegnante
│ .test - Test comando
│ .testforward - Test forward
│ .testuntis - Test Untis
│ .trading - Info trading
│ .start - Avvia bot
│ .scam - Info scam
│ .shield - Info shield
│ .killstats - Statistiche kill
│ .pay_v2 - Pay v2

┌─ 💰 ECONOMIA & NEGOZIO
│ .bank - Saldo
│ .daily - Monete giornaliere (200-50K)
│ .pay @user <amt> - Invia monete
│ .invite - Sistema referral
│ .leaderboard - Classifica
│ .shop - Negozio virtuale
│ .buybulk <item> <qty> - Acquisto massa

┌─ 🎮 GIOCHI
│ .games - Lista giochi
│ .8ball <domanda> - Palla magica 8
│ .dice [bet] - Lancia dadi
│ .coinflip <t/c> [bet] - Lancia moneta
│ .rps <scelta> - Sasso Carta Forbici
│ .guess - Indovina numero (1-100)
│ .trivia - Domanda trivia
│ .math - Sfida matematica
│ .tictactoe [@user] - Tris
│ .chess [@user] - Gioca scacchi
│ .slot [bet/all] - Slot machine
│ .slotstats - Statistiche slot
│ .roulette <bet> <tipo> - Roulette
│ .mines <bet> - Campo minato
│ .rob @user - Deruba giocatore
│ .fight - Difendi da rapina
│ .double - Doppio o niente
│ .tournament - Torneo
│ .achievements - Obiettivi

┌─ 🃏 BLACKJACK
│ .blackjack <bet> - Inizia gioco
│ .hit - Pesca carta
│ .stand - Termina turno
│ .double - Raddoppia scommessa
│ .split - Dividi coppie
│ .hand <n> - Cambia mano
│ .surrender - Arrenditi
│ .insurance - Assicurazione
│ .bjstats - Tue statistiche
│ .bjleaderboard - Classifica

┌─ 💀 AZIONE
│ .kill @user <arma> - Uccidi (stile GTA)

┌─ 👮 ADMIN (Solo Gruppi)
│ .add <numero> - Aggiungi membro
│ .kick @user - Rimuovi utente
│ .ban @user - Banna utente
│ .promote @user - Rendi admin
│ .demote @user - Rimuovi admin
│ .warn @user <motivo> - Avvisa utente
│ .warnings @user - Controlla avvisi
│ .mute <minuti> - Silenzia gruppo
│ .unmute - Riattiva gruppo
│ .report - Segnala messaggio
│ .tagall <msg> - Tagga tutti
│ .tagadmin <msg> - Tagga admin
│ .tagnotadmin <msg> - Tagga non-admin
│ .hidetag <msg> - Tag nascosto
│ .lockdown <on/off> - Blocca gruppo
│ .antilink <on/off> - Protezione link
│ .antidelete <on/off> - Anti-eliminazione
│ .welcome <on/off> - Messaggi benvenuto
│ .setgname <nome> - Cambia nome gruppo
│ .setgdesc <desc> - Cambia descrizione
│ .resetlink - Reset link invito
│ .groupinfo - Dettagli gruppo
│ .staff - Lista admin
│ .newsletter - Gestisci newsletter
│ .delall - Elimina tutti messaggi

┌─ 👑 PROPRIETARIO
│ .mode <public/private> - Modalità bot
│ .debug - Info debug (rispondi)
│ .audit - Log audit sistema
│ .ownerhelp - Aiuto proprietario
│ .checkbotjid - Controlla bot JID
│ .spam <count> <text> - Spam messaggi
│ .broadcast <msg> - Invia a tutti
│ .announce <msg> - Annuncio
│ .raid confirm - Raid gruppo
│ .autovv <on/off> - Auto-salva view-once
│ .newsletterconfig - Config newsletter
│ .manage @user <azione> - Gestisci utente
│ .addowner @user - Aggiungi proprietario
│ .removeowner @user - Rimuovi proprietario
│ .listowners - Lista proprietari
│ .resetbalances - Reset tutti saldi
│ .roball - Deruba tutti
│ .addall - Aggiungi membri massa
│ .autocall - Auto chiamata
│ .botoff - Spegni bot

┌─ 📥 DOWNLOAD
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
