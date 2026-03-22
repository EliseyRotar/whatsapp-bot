import { getGroupSetting, setGroupSetting } from '../../utils/database.js';
import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        current: '👋 Welcome messages are currently: {status}\n\nUsage: .welcome <on/off>',
        enabled: '✅ Welcome messages enabled!',
        disabled: '✅ Welcome messages disabled.',
        usage: '❌ Usage: .welcome <on/off>',
        on: 'ON',
        off: 'OFF'
    },
    it: {
        current: '👋 Messaggi di benvenuto sono attualmente: {status}\n\nUso: .welcome <on/off>',
        enabled: '✅ Messaggi di benvenuto attivati!',
        disabled: '✅ Messaggi di benvenuto disattivati.',
        usage: '❌ Uso: .welcome <on/off>',
        on: 'ATTIVI',
        off: 'DISATTIVI'
    },
    ru: {
        current: '👋 Приветственные сообщения сейчас: {status}\n\nИспользование: .welcome <on/off>',
        enabled: '✅ Приветственные сообщения включены!',
        disabled: '✅ Приветственные сообщения отключены.',
        usage: '❌ Использование: .welcome <on/off>',
        on: 'ВКЛЮЧЕНЫ',
        off: 'ОТКЛЮЧЕНЫ'
    },
    es: {
        current: '👋 Los mensajes de bienvenida están actualmente: {status}\n\nUso: .welcome <on/off>',
        enabled: '✅ ¡Mensajes de bienvenida activados!',
        disabled: '✅ Mensajes de bienvenida desactivados.',
        usage: '❌ Uso: .welcome <on/off>',
        on: 'ACTIVADOS',
        off: 'DESACTIVADOS'
    },
    pt: {
        current: '👋 Mensagens de boas-vindas estão atualmente: {status}\n\nUso: .welcome <on/off>',
        enabled: '✅ Mensagens de boas-vindas ativadas!',
        disabled: '✅ Mensagens de boas-vindas desativadas.',
        usage: '❌ Uso: .welcome <on/off>',
        on: 'ATIVADAS',
        off: 'DESATIVADAS'
    },
    ar: {
        current: '👋 رسائل الترحيب حالياً: {status}\n\nالاستخدام: .welcome <on/off>',
        enabled: '✅ رسائل الترحيب اتفعلت!',
        disabled: '✅ رسائل الترحيب اتعطلت.',
        usage: '❌ الاستخدام: .welcome <on/off>',
        on: 'مفعلة',
        off: 'معطلة'
    },
    hi: {
        current: '👋 वेलकम मैसेज वर्तमान में: {status}\n\nउपयोग: .welcome <on/off>',
        enabled: '✅ वेलकम मैसेज चालू हो गए!',
        disabled: '✅ वेलकम मैसेज बंद हो गए।',
        usage: '❌ उपयोग: .welcome <on/off>',
        on: 'चालू',
        off: 'बंद'
    },
    ng: {
        current: '👋 Welcome message now dey: {status}\n\nHow to use am: .welcome <on/off>',
        enabled: '✅ Welcome message don dey on!',
        disabled: '✅ Welcome message don off.',
        usage: '❌ How to use am: .welcome <on/off>',
        on: 'ON',
        off: 'OFF'
    }
};

export default {
    name: 'welcome',
    groupOnly: true,
    adminOnly: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        if (args.length === 0) {
            const current = getGroupSetting(from, 'welcome');
            return await sock.sendMessage(from, { 
                text: t.current.replace('{status}', current ? t.on : t.off)
            });
        }
        
        const action = args[0].toLowerCase();
        if (action === 'on') {
            setGroupSetting(from, 'welcome', true);
            await sock.sendMessage(from, { text: t.enabled });
        } else if (action === 'off') {
            setGroupSetting(from, 'welcome', false);
            await sock.sendMessage(from, { text: t.disabled });
        } else {
            await sock.sendMessage(from, { text: t.usage });
        }
    }
};
