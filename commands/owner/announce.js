import { config } from '../../config.js';
import { getGroupLanguage } from '../../utils/language.js';

const announcements = {
    en: {
        resetWarning: '⚠️ MONEY RESET IN 10 MINUTES ⚠️\n\nAll balances will be reset to 500 coins due to a slot machine exploit fix.\n\nYour stats and shop items are safe.\n\nUse .daily for free coins after reset!',
        usage: '📢 Announcement Command\n\nUsage: .announce <type> [minutes]\n\nTypes:\n• reset - Money reset warning\n• custom <message> - Custom announcement\n\nExamples:\n• .announce reset\n• .announce reset 5\n• .announce custom Server maintenance in 1 hour'
    },
    it: {
        resetWarning: '⚠️ RESET SOLDI TRA 10 MINUTI ⚠️\n\nTutti i saldi saranno resettati a 500 monete per via di un fix exploit della slot machine.\n\nLe tue statistiche e oggetti negozio sono al sicuro.\n\nUsa .daily per monete gratis dopo il reset!',
        usage: '📢 Comando Annuncio\n\nUso: .announce <tipo> [minuti]\n\nTipi:\n• reset - Avviso reset soldi\n• custom <messaggio> - Annuncio personalizzato\n\nEsempi:\n• .announce reset\n• .announce reset 5\n• .announce custom Manutenzione server tra 1 ora'
    }
};

export default {
    name: 'announce',
    aliases: ['broadcast', 'annuncio'],
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const senderNumber = sender.split('@')[0];
        const lang = getGroupLanguage(from);
        const t = announcements[lang] || announcements.en;
        
        // Owner-only command - check both OWNER_NUMBER and OWNER_JID
        const isOwner = senderNumber === config.ownerNumber || 
                       sender === config.ownerJid || 
                       sender === `${config.ownerNumber}@s.whatsapp.net`;
        
        if (!isOwner) {
            return await sock.sendMessage(from, {
                text: lang === 'it' ? '❌ Questo comando è solo per il proprietario!' : '❌ This command is owner-only!'
            });
        }
        
        if (!args[0]) {
            return await sock.sendMessage(from, {
                text: t.usage
            });
        }
        
        const type = args[0].toLowerCase();
        
        try {
            if (type === 'reset') {
                // Get custom minutes if provided
                const minutes = args[1] ? parseInt(args[1]) : 10;
                
                if (isNaN(minutes) || minutes < 1) {
                    return await sock.sendMessage(from, {
                        text: lang === 'it' ? '❌ Minuti non validi!' : '❌ Invalid minutes!'
                    });
                }
                
                // Build reset message with custom time
                const resetMsg = lang === 'it' 
                    ? `⚠️ RESET SOLDI TRA ${minutes} MINUT${minutes === 1 ? 'O' : 'I'} ⚠️\n\nTutti i saldi saranno resettati a 500 monete per via di un fix exploit della slot machine.\n\nLe tue statistiche e oggetti negozio sono al sicuro.\n\nUsa .daily per monete gratis dopo il reset!`
                    : `⚠️ MONEY RESET IN ${minutes} MINUTE${minutes === 1 ? '' : 'S'} ⚠️\n\nAll balances will be reset to 500 coins due to a slot machine exploit fix.\n\nYour stats and shop items are safe.\n\nUse .daily for free coins after reset!`;
                
                await sock.sendMessage(from, {
                    text: resetMsg
                });
                
                console.log(`[ANNOUNCE] Reset warning sent by ${senderNumber} (${minutes} minutes)`);
                
            } else if (type === 'custom') {
                // Custom announcement
                const customMsg = args.slice(1).join(' ');
                
                if (!customMsg) {
                    return await sock.sendMessage(from, {
                        text: lang === 'it' ? '❌ Fornisci un messaggio!' : '❌ Provide a message!'
                    });
                }
                
                await sock.sendMessage(from, {
                    text: `📢 ${customMsg}`
                });
                
                console.log(`[ANNOUNCE] Custom announcement sent by ${senderNumber}`);
                
            } else {
                return await sock.sendMessage(from, {
                    text: t.usage
                });
            }
            
        } catch (error) {
            console.error('[ANNOUNCE] Error:', error);
            await sock.sendMessage(from, {
                text: lang === 'it' ? `❌ Errore: ${error.message}` : `❌ Error: ${error.message}`
            });
        }
    }
};
