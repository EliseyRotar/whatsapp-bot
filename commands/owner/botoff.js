import { config } from '../../config.js';
import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        already_off: '🔇 Bot is already GLOBALLY disabled.',
        already_on:  '✅ Bot is already GLOBALLY enabled.',
        turned_off:  '🔇 Bot GLOBALLY DISABLED.\n\nAll chats and groups are now silent.\nOnly the owner can still use commands.',
        turned_on:   '✅ Bot GLOBALLY ENABLED.\n\nAll chats and groups are active again.',
        status_off:  '🔇 Bot is GLOBALLY DISABLED (private mode).\n\nUse .boton to re-enable for everyone.',
        status_on:   '✅ Bot is GLOBALLY ENABLED (public mode).\n\nUse .botoff to disable for everyone.'
    },
    it: {
        already_off: '🔇 Il bot è già GLOBALMENTE disattivato.',
        already_on:  '✅ Il bot è già GLOBALMENTE attivato.',
        turned_off:  '🔇 Bot DISATTIVATO GLOBALMENTE.\n\nTutte le chat e i gruppi sono ora silenziosi.\nSolo il proprietario può ancora usare i comandi.',
        turned_on:   '✅ Bot ATTIVATO GLOBALMENTE.\n\nTutte le chat e i gruppi sono di nuovo attivi.',
        status_off:  '🔇 Il bot è GLOBALMENTE DISATTIVATO (modalità privata).\n\nUsa .boton per riattivarlo per tutti.',
        status_on:   '✅ Il bot è GLOBALMENTE ATTIVATO (modalità pubblica).\n\nUsa .botoff per disattivarlo per tutti.'
    },
    ru: {
        already_off: '🔇 Бот уже ГЛОБАЛЬНО отключён.',
        already_on:  '✅ Бот уже ГЛОБАЛЬНО включён.',
        turned_off:  '🔇 Бот ГЛОБАЛЬНО ОТКЛЮЧЁН.\n\nВсе чаты и группы теперь молчат.\nТолько владелец может использовать команды.',
        turned_on:   '✅ Бот ГЛОБАЛЬНО ВКЛЮЧЁН.\n\nВсе чаты и группы снова активны.',
        status_off:  '🔇 Бот ГЛОБАЛЬНО ОТКЛЮЧЁН (приватный режим).\n\nИспользуйте .boton для повторного включения.',
        status_on:   '✅ Бот ГЛОБАЛЬНО ВКЛЮЧЁН (публичный режим).\n\nИспользуйте .botoff для отключения.'
    },
    es: {
        already_off: '🔇 El bot ya está GLOBALMENTE desactivado.',
        already_on:  '✅ El bot ya está GLOBALMENTE activado.',
        turned_off:  '🔇 Bot DESACTIVADO GLOBALMENTE.\n\nTodos los chats y grupos están en silencio.\nSolo el dueño puede usar comandos.',
        turned_on:   '✅ Bot ACTIVADO GLOBALMENTE.\n\nTodos los chats y grupos están activos de nuevo.',
        status_off:  '🔇 El bot está GLOBALMENTE DESACTIVADO (modo privado).\n\nUsa .boton para reactivarlo para todos.',
        status_on:   '✅ El bot está GLOBALMENTE ACTIVADO (modo público).\n\nUsa .botoff para desactivarlo para todos.'
    },
    pt: {
        already_off: '🔇 O bot já está GLOBALMENTE desativado.',
        already_on:  '✅ O bot já está GLOBALMENTE ativado.',
        turned_off:  '🔇 Bot DESATIVADO GLOBALMENTE.\n\nTodos os chats e grupos estão em silêncio.\nApenas o dono pode usar comandos.',
        turned_on:   '✅ Bot ATIVADO GLOBALMENTE.\n\nTodos os chats e grupos estão ativos novamente.',
        status_off:  '🔇 O bot está GLOBALMENTE DESATIVADO (modo privado).\n\nUse .boton para reativar para todos.',
        status_on:   '✅ O bot está GLOBALMENTE ATIVADO (modo público).\n\nUse .botoff para desativar para todos.'
    },
    ar: {
        already_off: '🔇 البوت معطّل بالفعل بشكل عام.',
        already_on:  '✅ البوت مفعّل بالفعل بشكل عام.',
        turned_off:  '🔇 تم تعطيل البوت بشكل عام.\n\nجميع المحادثات والمجموعات صامتة الآن.\nفقط المالك يمكنه استخدام الأوامر.',
        turned_on:   '✅ تم تفعيل البوت بشكل عام.\n\nجميع المحادثات والمجموعات نشطة مجدداً.',
        status_off:  '🔇 البوت معطّل بشكل عام (الوضع الخاص).\n\nاستخدم .boton لإعادة التفعيل للجميع.',
        status_on:   '✅ البوت مفعّل بشكل عام (الوضع العام).\n\nاستخدم .botoff للتعطيل للجميع.'
    },
    hi: {
        already_off: '🔇 बॉट पहले से ही GLOBALLY बंद है।',
        already_on:  '✅ बॉट पहले से ही GLOBALLY चालू है।',
        turned_off:  '🔇 बॉट GLOBALLY DISABLED।\n\nसभी चैट और ग्रुप अब चुप हैं।\nकेवल मालिक कमांड उपयोग कर सकते हैं।',
        turned_on:   '✅ बॉट GLOBALLY ENABLED।\n\nसभी चैट और ग्रुप फिर से सक्रिय हैं।',
        status_off:  '🔇 बॉट GLOBALLY DISABLED है (private mode)।\n\n.boton से सबके लिए चालू करें।',
        status_on:   '✅ बॉट GLOBALLY ENABLED है (public mode)।\n\n.botoff से सबके लिए बंद करें।'
    },
    ng: {
        already_off: '🔇 Bot don already dey OFF for everywhere.',
        already_on:  '✅ Bot don already dey ON for everywhere.',
        turned_off:  '🔇 Bot don OFF for EVERYWHERE.\n\nAll chats and groups don go quiet.\nOnly owner fit use commands.',
        turned_on:   '✅ Bot don ON for EVERYWHERE.\n\nAll chats and groups don come back.',
        status_off:  '🔇 Bot dey OFF for everywhere (private mode).\n\nUse .boton to on am for everyone.',
        status_on:   '✅ Bot dey ON for everywhere (public mode).\n\nUse .botoff to off am for everyone.'
    }
};

// .botoff — disable globally
export const botoff = {
    name: 'botoff',
    ownerOnly: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;

        if (args[0] === 'status') {
            return await sock.sendMessage(from, {
                text: config.mode === 'private' ? t.status_off : t.status_on
            });
        }

        if (config.mode === 'private') {
            return await sock.sendMessage(from, { text: t.already_off });
        }

        config.mode = 'private';
        await sock.sendMessage(from, { text: t.turned_off });
    }
};

// .boton — enable globally
export const boton = {
    name: 'boton',
    ownerOnly: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;

        if (config.mode === 'public') {
            return await sock.sendMessage(from, { text: t.already_on });
        }

        config.mode = 'public';
        await sock.sendMessage(from, { text: t.turned_on });
    }
};

export default botoff;
