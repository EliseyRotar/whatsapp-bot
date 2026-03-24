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
        version: 'v5.1.0 - ULTRA SLOT BUFF',
        date: 'March 24, 2026',
        changes: [
            '🎰 SLOT MACHINE ULTRA BUFFED',
            '',
            '🚀 Performance Boost:',
            '• RTP: 97% → 98% (top 2% industry)',
            '• Cooldown: 1.5s → 1s (ultra fast)',
            '• Premium symbols more frequent',
            '',
            '💎 Multiplier Increases:',
            '• Jackpot: 100x → 150x (+50%)',
            '• Sevens: 40x → 60x (+50%)',
            '• Bells: 15x → 20x (+33%)',
            '• Grapes: 12x → 15x (+25%)',
            '• Oranges: 8x → 10x (+25%)',
            '• Lemons: 5x → 6x (+20%)',
            '• Cherries: 3x → 4x (+33%)',
            '• Two match: 2x → 2.5x (+25%)',
            '',
            '🎁 Free Spins: 7 → 10 spins (+43%)',
            '',
            '🎯 Result: Even more fun & rewards!'
        ]
    },
    it: {
        version: 'v5.1.0 - ULTRA POTENZIAMENTO SLOT',
        date: '24 Marzo 2026',
        changes: [
            '🎰 SLOT MACHINE ULTRA POTENZIATA',
            '',
            '🚀 Boost Prestazioni:',
            '• RTP: 97% → 98% (top 2% industria)',
            '• Cooldown: 1.5s → 1s (ultra veloce)',
            '• Simboli premium più frequenti',
            '',
            '💎 Aumenti Moltiplicatori:',
            '• Jackpot: 100x → 150x (+50%)',
            '• Sette: 40x → 60x (+50%)',
            '• Campane: 15x → 20x (+33%)',
            '• Uva: 12x → 15x (+25%)',
            '• Arance: 8x → 10x (+25%)',
            '• Limoni: 5x → 6x (+20%)',
            '• Ciliegie: 3x → 4x (+33%)',
            '• Due: 2x → 2.5x (+25%)',
            '',
            '🎁 Giri Gratis: 7 → 10 giri (+43%)',
            '',
            '🎯 Risultato: Ancora più divertimento!'
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
