import { config } from '../../config.js';
import { getGroupLanguage } from '../../utils/language.js';
import { sendAsChannelForward } from '../../utils/fakeForward.js';

const responses = {
    en: {
        title: '╔═══════════════════════════╗\n║   🆕 LATEST UPDATE   ║\n╚═══════════════════════════╝',
        version: '📌 Version:',
        date: '📅 Date:',
        changes: '✨ What\'s New:',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n💡 Type .updates to see all updates!'
    },
    it: {
        title: '╔═══════════════════════════╗\n║   🆕 ULTIMO AGGIORNAMENTO   ║\n╚═══════════════════════════╝',
        version: '📌 Versione:',
        date: '📅 Data:',
        changes: '✨ Novità:',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n💡 Digita .updates per vedere tutti gli aggiornamenti!'
    }
};

// Latest update only
const latestUpdate = {
    en: {
        version: 'v5.2.0 - BLACKJACK REDESIGN',
        date: 'March 24, 2026',
        changes: [
            '🎴 BLACKJACK COMPLETELY REDESIGNED',
            '',
            '✨ Clean New Design:',
            '• Monospace card display (perfect alignment)',
            '• Compact format: A♠ K♥ (easy to read)',
            '• Minimal UI - only essential info',
            '• Much shorter messages',
            '',
            '🎯 Simplified Gameplay:',
            '• Removed: Multi-hand, side bets, insurance, surrender',
            '• Kept: Hit, stand, double, split (core gameplay)',
            '• Faster, cleaner experience',
            '',
            '📊 Better Visual Layout:',
            '• Cards perfectly aligned in monospace',
            '• Clear dealer/player separation',
            '• Instant result display',
            '',
            '🎮 Result: Cleaner, faster, more fun!'
        ]
    },
    it: {
        version: 'v5.2.0 - RIDISEGNO BLACKJACK',
        date: '24 Marzo 2026',
        changes: [
            '🎴 BLACKJACK COMPLETAMENTE RIDISEGNATO',
            '',
            '✨ Nuovo Design Pulito:',
            '• Display carte monospace (allineamento perfetto)',
            '• Formato compatto: A♠ K♥ (facile da leggere)',
            '• UI minimale - solo info essenziali',
            '• Messaggi molto più corti',
            '',
            '🎯 Gameplay Semplificato:',
            '• Rimosso: Multi-mano, scommesse laterali, assicurazione, resa',
            '• Mantenuto: Hit, stand, double, split (gameplay base)',
            '• Esperienza più veloce e pulita',
            '',
            '📊 Layout Visivo Migliore:',
            '• Carte perfettamente allineate in monospace',
            '• Separazione chiara dealer/giocatore',
            '• Display risultato istantaneo',
            '',
            '🎮 Risultato: Più pulito, veloce e divertente!'
        ]
    }
};

export default {
    name: 'latest',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        const update = latestUpdate[lang] || latestUpdate.en;
        
        let text = t.title;
        text += `\n\n${t.version} ${update.version}\n`;
        text += `${t.date} ${update.date}\n\n`;
        text += `${t.changes}\n\n`;
        
        update.changes.forEach(change => {
            text += `${change}\n`;
        });
        
        text += t.footer;
        
        await sendAsChannelForward(sock, from, text, {
            quoted: msg,
            newsletterName: config.botName || 'Latest Update'
        });
    }
};
