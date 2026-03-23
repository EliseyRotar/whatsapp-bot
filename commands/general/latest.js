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
        version: 'v5.0.0 - MAJOR UPDATE',
        date: 'March 22, 2026',
        changes: [
            '🎰 SLOT MACHINE REBALANCED',
            '',
            '🔧 Security Fixes:',
            '• Fixed critical race condition exploit',
            '• Added concurrent game prevention',
            '• Jackpot system now thread-safe',
            '',
            '💰 Better Rewards (96% RTP):',
            '• Jackpot: 20x → 50x (+150%)',
            '• Sevens: 10x → 25x (+150%)',
            '• All multipliers significantly increased',
            '• Cooldown: 3s → 2s (faster play)',
            '',
            '🎡 DAILY REWARDS BUFFED (4x-5x)',
            '',
            '💎 New Prize Tiers:',
            '• Common: 200 coins (was 50)',
            '• Rare: 1,000 coins (was 200)',
            '• Epic: 2,500 coins (was 500)',
            '• Legendary: 5,000 coins (was 1,000)',
            '• MEGA JACKPOT: 50,000 coins (was 10,000)',
            '',
            '📊 Average Daily: ~2,160 coins (was ~540)',
            '📅 Monthly Value: ~65,000 coins!',
            '',
            '🎯 Why? More fun, better balance!'
        ]
    },
    it: {
        version: 'v5.0.0 - AGGIORNAMENTO MAGGIORE',
        date: '22 Marzo 2026',
        changes: [
            '🎰 SLOT MACHINE RIBILANCIATA',
            '',
            '🔧 Correzioni Sicurezza:',
            '• Risolto exploit critico',
            '• Prevenzione giochi concorrenti',
            '• Sistema jackpot thread-safe',
            '',
            '💰 Ricompense Migliori (96% RTP):',
            '• Jackpot: 20x → 50x (+150%)',
            '• Sette: 10x → 25x (+150%)',
            '• Tutti i moltiplicatori aumentati',
            '• Cooldown: 3s → 2s (gioco più veloce)',
            '',
            '🎡 RICOMPENSE GIORNALIERE POTENZIATE (4x-5x)',
            '',
            '💎 Nuovi Livelli:',
            '• Comune: 200 monete (era 50)',
            '• Raro: 1.000 monete (era 200)',
            '• Epico: 2.500 monete (era 500)',
            '• Leggendario: 5.000 monete (era 1.000)',
            '• MEGA JACKPOT: 50.000 monete (era 10.000)',
            '',
            '📊 Media Giornaliera: ~2.160 monete (era ~540)',
            '📅 Valore Mensile: ~65.000 monete!',
            '',
            '🎯 Perché? Più divertimento, miglior bilanciamento!'
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
