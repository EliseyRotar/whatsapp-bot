import { extractMentions } from '../../utils/helpers.js';
import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        noUser: '❌ Tag a user or reply to their message.',
        success: '✅ User demoted from admin!',
        failed: '❌ Failed to demote:'
    },
    it: {
        noUser: '❌ Tagga un utente o rispondi al suo messaggio.',
        success: '✅ Utente rimosso da admin!',
        failed: '❌ Impossibile rimuovere:'
    },
    ru: {
        noUser: '❌ Отметьте пользователя или ответьте на его сообщение.',
        success: '✅ Пользователь понижен с администратора!',
        failed: '❌ Не удалось понизить:'
    },
    es: {
        noUser: '❌ Etiqueta a un usuario o responde a su mensaje.',
        success: '✅ ¡Usuario degradado de administrador!',
        failed: '❌ Error al degradar:'
    },
    pt: {
        noUser: '❌ Marque um usuário ou responda à mensagem dele.',
        success: '✅ Usuário rebaixado de administrador!',
        failed: '❌ Falha ao rebaixar:'
    },
    ar: {
        noUser: '❌ اعمل منشن لمستخدم أو رد على رسالته.',
        success: '✅ المستخدم اتنزل من الأدمن!',
        failed: '❌ فشل في التنزيل:'
    },
    hi: {
        noUser: '❌ किसी उपयोगकर्ता को टैग करें या उनके संदेश का उत्तर दें।',
        success: '✅ उपयोगकर्ता को एडमिन से डिमोट कर दिया गया!',
        failed: '❌ डिमोट करने में विफल:'
    },
    ng: {
        noUser: '❌ Tag user or reply to their message.',
        success: '✅ User don demote from admin!',
        failed: '❌ E no work to demote:'
    }
};

export default {
    name: 'demote',
    groupOnly: true,
    adminOnly: true,
    botAdminRequired: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        const quotedMsg = msg.message?.extendedTextMessage?.contextInfo;
        
        let userToDemote;
        if (quotedMsg?.participant) {
            userToDemote = quotedMsg.participant;
        } else {
            const mentions = extractMentions(args.join(' '));
            if (mentions.length === 0) {
                return await sock.sendMessage(from, { text: t.noUser });
            }
            userToDemote = mentions[0];
        }

        try {
            await sock.groupParticipantsUpdate(from, [userToDemote], 'demote');
            await sock.sendMessage(from, { text: t.success });
        } catch (error) {
            await sock.sendMessage(from, { text: `${t.failed} ${error.message}` });
        }
    }
};
