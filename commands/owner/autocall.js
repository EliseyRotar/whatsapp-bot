import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        status:   '📵 Auto Call Reject: {status}\n\nUsage: .autocall <on/off>\n\nWhen ON: every incoming WhatsApp call is instantly declined and the caller receives an auto-reply asking them to use a direct phone line.',
        enabled:  '✅ Auto Call Reject enabled!\n\nAll incoming WhatsApp calls will now be automatically declined and callers will be told to use a direct phone line.',
        disabled: '❌ Auto Call Reject disabled.\n\nIncoming WhatsApp calls will no longer be auto-declined.',
        invalid:  '❌ Invalid option.\n\nUsage: .autocall <on/off>',
        on:  '✅ ON',
        off: '❌ OFF'
    },
    it: {
        status:   '📵 Rifiuto Automatico Chiamate: {status}\n\nUso: .autocall <on/off>\n\nQuando ATTIVO: ogni chiamata WhatsApp in arrivo viene rifiutata istantaneamente e il chiamante riceve un messaggio automatico.',
        enabled:  '✅ Rifiuto Automatico Chiamate attivato!\n\nTutte le chiamate WhatsApp in arrivo verranno rifiutate automaticamente.',
        disabled: '❌ Rifiuto Automatico Chiamate disattivato.\n\nLe chiamate WhatsApp non verranno più rifiutate automaticamente.',
        invalid:  '❌ Opzione non valida.\n\nUso: .autocall <on/off>',
        on:  '✅ ATTIVO',
        off: '❌ DISATTIVO'
    },
    ru: {
        status:   '📵 Авто-отклонение звонков: {status}\n\nИспользование: .autocall <on/off>\n\nПри ВКЛЮЧЕНИИ: каждый входящий звонок WhatsApp мгновенно отклоняется.',
        enabled:  '✅ Авто-отклонение звонков включено!\n\nВсе входящие звонки WhatsApp будут автоматически отклоняться.',
        disabled: '❌ Авто-отклонение звонков отключено.\n\nВходящие звонки WhatsApp больше не будут автоматически отклоняться.',
        invalid:  '❌ Неверная опция.\n\nИспользование: .autocall <on/off>',
        on:  '✅ ВКЛЮЧЕНО',
        off: '❌ ОТКЛЮЧЕНО'
    },
    es: {
        status:   '📵 Rechazo Automático de Llamadas: {status}\n\nUso: .autocall <on/off>\n\nCuando está ACTIVADO: cada llamada de WhatsApp entrante se rechaza instantáneamente.',
        enabled:  '✅ ¡Rechazo Automático de Llamadas activado!\n\nTodas las llamadas de WhatsApp entrantes serán rechazadas automáticamente.',
        disabled: '❌ Rechazo Automático de Llamadas desactivado.\n\nLas llamadas de WhatsApp ya no serán rechazadas automáticamente.',
        invalid:  '❌ Opción inválida.\n\nUso: .autocall <on/off>',
        on:  '✅ ACTIVADO',
        off: '❌ DESACTIVADO'
    },
    pt: {
        status:   '📵 Rejeição Automática de Chamadas: {status}\n\nUso: .autocall <on/off>\n\nQuando ATIVADO: cada chamada do WhatsApp é recusada instantaneamente.',
        enabled:  '✅ Rejeição Automática de Chamadas ativada!\n\nTodas as chamadas do WhatsApp serão recusadas automaticamente.',
        disabled: '❌ Rejeição Automática de Chamadas desativada.\n\nAs chamadas do WhatsApp não serão mais recusadas automaticamente.',
        invalid:  '❌ Opção inválida.\n\nUso: .autocall <on/off>',
        on:  '✅ ATIVADO',
        off: '❌ DESATIVADO'
    },
    ar: {
        status:   '📵 الرفض التلقائي للمكالمات: {status}\n\nالاستخدام: .autocall <on/off>\n\nلما يكون مفعل: كل مكالمة واتساب واردة بتتردّ عليها فوراً.',
        enabled:  '✅ الرفض التلقائي للمكالمات اتفعّل!\n\nكل مكالمات واتساب الواردة هترفض تلقائياً.',
        disabled: '❌ الرفض التلقائي للمكالمات اتعطّل.\n\nمكالمات واتساب مش هترفض تلقائياً تاني.',
        invalid:  '❌ خيار غلط.\n\nالاستخدام: .autocall <on/off>',
        on:  '✅ مفعل',
        off: '❌ معطل'
    },
    hi: {
        status:   '📵 ऑटो कॉल रिजेक्ट: {status}\n\nउपयोग: .autocall <on/off>\n\nचालू होने पर: हर आने वाली WhatsApp कॉल तुरंत रिजेक्ट हो जाती है।',
        enabled:  '✅ ऑटो कॉल रिजेक्ट चालू!\n\nसभी आने वाली WhatsApp कॉल ऑटोमैटिक रिजेक्ट होंगी।',
        disabled: '❌ ऑटो कॉल रिजेक्ट बंद।\n\nWhatsApp कॉल अब ऑटो-रिजेक्ट नहीं होंगी।',
        invalid:  '❌ अमान्य विकल्प।\n\nउपयोग: .autocall <on/off>',
        on:  '✅ चालू',
        off: '❌ बंद'
    },
    ng: {
        status:   '📵 Auto Call Reject: {status}\n\nHow to use: .autocall <on/off>\n\nWhen ON: every WhatsApp call wey come in go reject immediately.',
        enabled:  '✅ Auto Call Reject don turn on!\n\nAll WhatsApp calls wey come in go reject automatically.',
        disabled: '❌ Auto Call Reject don turn off.\n\nWhatsApp calls no go auto-reject again.',
        invalid:  '❌ Dat option no correct.\n\nHow to use: .autocall <on/off>',
        on:  '✅ ON',
        off: '❌ OFF'
    }
};

export default {
    name: 'autocall',
    ownerOnly: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;

        // No args → show current status
        if (args.length === 0) {
            const current = global.autoRejectCalls || false;
            return await sock.sendMessage(from, {
                text: t.status.replace('{status}', current ? t.on : t.off)
            });
        }

        const action = args[0].toLowerCase();

        if (action === 'on') {
            global.autoRejectCalls = true;
            await sock.sendMessage(from, { text: t.enabled });
        } else if (action === 'off') {
            global.autoRejectCalls = false;
            await sock.sendMessage(from, { text: t.disabled });
        } else {
            await sock.sendMessage(from, { text: t.invalid });
        }
    }
};
