import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        pong: '🏓 Pong!',
        latency: 'Latency:',
        ms: 'ms'
    },
    it: {
        pong: '🏓 Pong!',
        latency: 'Latenza:',
        ms: 'ms'
    },
    ru: {
        pong: '🏓 Понг!',
        latency: 'Задержка:',
        ms: 'мс'
    },
    es: {
        pong: '🏓 ¡Pong!',
        latency: 'Latencia:',
        ms: 'ms'
    },
    pt: {
        pong: '🏓 Pong!',
        latency: 'Latência:',
        ms: 'ms'
    },
    ar: {
        pong: '🏓 بونج!',
        latency: 'التأخير:',
        ms: 'م.ث'
    },
    hi: {
        pong: '🏓 पोंग!',
        latency: 'लेटेंसी:',
        ms: 'मि.से.'
    },
    ng: {
        pong: '🏓 Pong!',
        latency: 'Speed:',
        ms: 'ms'
    }
};

export default {
    name: 'ping',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        const start = Date.now();
        await sock.sendMessage(from, { text: t.pong });
        const end = Date.now();
        
        const latency = end - start;
        
        await sock.sendMessage(from, {
            text: `${t.pong}\n${t.latency} ${latency}${t.ms}`
        });
    }
};
