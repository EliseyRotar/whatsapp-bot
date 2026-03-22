import { getGroupSetting, setGroupSetting } from '../../utils/database.js';
import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        current: '🔗 Antilink is currently: {status}\n\nUsage: .antilink <on/off>',
        enabled: '✅ Antilink enabled! Links will be deleted.',
        disabled: '✅ Antilink disabled.',
        usage: '❌ Usage: .antilink <on/off>',
        on: 'ON',
        off: 'OFF'
    },
    it: {
        current: '🔗 Antilink è attualmente: {status}\n\nUso: .antilink <on/off>',
        enabled: '✅ Antilink attivato! I link verranno eliminati.',
        disabled: '✅ Antilink disattivato.',
        usage: '❌ Uso: .antilink <on/off>',
        on: 'ATTIVO',
        off: 'DISATTIVO'
    },
    ru: {
        current: '🔗 Антиссылка сейчас: {status}\n\nИспользование: .antilink <on/off>',
        enabled: '✅ Антиссылка включена! Ссылки будут удаляться.',
        disabled: '✅ Антиссылка отключена.',
        usage: '❌ Использование: .antilink <on/off>',
        on: 'ВКЛ',
        off: 'ВЫКЛ'
    },
    es: {
        current: '🔗 Antienlace está actualmente: {status}\n\nUso: .antilink <on/off>',
        enabled: '✅ ¡Antienlace activado! Los enlaces serán eliminados.',
        disabled: '✅ Antienlace desactivado.',
        usage: '❌ Uso: .antilink <on/off>',
        on: 'ACTIVADO',
        off: 'DESACTIVADO'
    },
    pt: {
        current: '🔗 Antilink está atualmente: {status}\n\nUso: .antilink <on/off>',
        enabled: '✅ Antilink ativado! Links serão deletados.',
        disabled: '✅ Antilink desativado.',
        usage: '❌ Uso: .antilink <on/off>',
        on: 'ATIVADO',
        off: 'DESATIVADO'
    },
    ar: {
        current: '🔗 مضاد الروابط حالياً: {status}\n\nالاستخدام: .antilink <on/off>',
        enabled: '✅ مضاد الروابط اتفعل! الروابط هتتحذف.',
        disabled: '✅ مضاد الروابط اتعطل.',
        usage: '❌ الاستخدام: .antilink <on/off>',
        on: 'مفعل',
        off: 'معطل'
    },
    hi: {
        current: '🔗 एंटीलिंक वर्तमान में: {status}\n\nउपयोग: .antilink <on/off>',
        enabled: '✅ एंटीलिंक सक्षम किया गया! लिंक हटा दिए जाएंगे।',
        disabled: '✅ एंटीलिंक अक्षम किया गया।',
        usage: '❌ उपयोग: .antilink <on/off>',
        on: 'चालू',
        off: 'बंद'
    },
    ng: {
        current: '🔗 Antilink now be: {status}\n\nHow to use: .antilink <on/off>',
        enabled: '✅ Antilink don turn on! Links go dey delete.',
        disabled: '✅ Antilink don turn off.',
        usage: '❌ How to use: .antilink <on/off>',
        on: 'ON',
        off: 'OFF'
    }
};

export default {
    name: 'antilink',
    groupOnly: true,
    adminOnly: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        if (args.length === 0) {
            const current = getGroupSetting(from, 'antilink');
            return await sock.sendMessage(from, { 
                text: t.current.replace('{status}', current ? t.on : t.off)
            });
        }
        
        const action = args[0].toLowerCase();
        if (action === 'on') {
            setGroupSetting(from, 'antilink', true);
            await sock.sendMessage(from, { text: t.enabled });
        } else if (action === 'off') {
            setGroupSetting(from, 'antilink', false);
            await sock.sendMessage(from, { text: t.disabled });
        } else {
            await sock.sendMessage(from, { text: t.usage });
        }
    }
};
