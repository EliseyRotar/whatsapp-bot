import { getGroupLanguage } from '../../utils/language.js';
import { config } from '../../config.js';
import { sendAsChannelForward } from '../../utils/fakeForward.js';

const responses = {
    en: {
        alive: `✅ I'm alive and running!\n\n🤖 Bot: ${config.botName}\n👤 Owner: ${config.ownerName}\n⚡ Status: Active\n\nType ${config.prefix}menu for commands!`
    },
    it: {
        alive: `✅ Sono attivo e funzionante!\n\n🤖 Bot: ${config.botName}\n👤 Proprietario: ${config.ownerName}\n⚡ Stato: Attivo\n\nDigita ${config.prefix}menu per i comandi!`
    },
    ru: {
        alive: `✅ Я работаю и активен!\n\n🤖 Бот: ${config.botName}\n👤 Владелец: ${config.ownerName}\n⚡ Статус: Активен\n\nНапишите ${config.prefix}menu для команд!`
    },
    es: {
        alive: `✅ ¡Estoy vivo y funcionando!\n\n🤖 Bot: ${config.botName}\n👤 Propietario: ${config.ownerName}\n⚡ Estado: Activo\n\n¡Escribe ${config.prefix}menu para los comandos!`
    },
    pt: {
        alive: `✅ Estou vivo e funcionando!\n\n🤖 Bot: ${config.botName}\n👤 Dono: ${config.ownerName}\n⚡ Status: Ativo\n\nDigite ${config.prefix}menu para os comandos!`
    },
    ar: {
        alive: `✅ أنا شغال وبشتغل!\n\n🤖 البوت: ${config.botName}\n👤 المالك: ${config.ownerName}\n⚡ الحالة: نشط\n\nاكتب ${config.prefix}menu للأوامر!`
    },
    hi: {
        alive: `✅ मैं चालू हूं और काम कर रहा हूं!\n\n🤖 बॉट: ${config.botName}\n👤 ओनर: ${config.ownerName}\n⚡ स्टेटस: एक्टिव\n\nकमांड के लिए ${config.prefix}menu टाइप करें!`
    },
    ng: {
        alive: `✅ I dey alive and I dey work!\n\n🤖 Bot: ${config.botName}\n👤 Owner: ${config.ownerName}\n⚡ Status: Active\n\nType ${config.prefix}menu for commands!`
    }
};

export default {
    name: 'alive',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        await sendAsChannelForward(sock, from, t.alive, {
            quoted: msg,
            newsletterName: config.botName || 'Bot Status'
        });
    }
};
