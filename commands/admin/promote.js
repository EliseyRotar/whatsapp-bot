import { extractMentions } from '../../utils/helpers.js';
import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        noUser: '❌ Tag a user or reply to their message.',
        success: '✅ User promoted to admin!',
        failed: '❌ Failed to promote:'
    },
    it: {
        noUser: '❌ Tagga un utente o rispondi al suo messaggio.',
        success: '✅ Utente promosso ad admin!',
        failed: '❌ Impossibile promuovere:'
    },
    ru: {
        noUser: '❌ Отметьте пользователя или ответьте на его сообщение.',
        success: '✅ Пользователь повышен до администратора!',
        failed: '❌ Не удалось повысить:'
    },
    es: {
        noUser: '❌ Etiqueta a un usuario o responde a su mensaje.',
        success: '✅ ¡Usuario promovido a administrador!',
        failed: '❌ Error al promover:'
    },
    pt: {
        noUser: '❌ Marque um usuário ou responda à mensagem dele.',
        success: '✅ Usuário promovido a administrador!',
        failed: '❌ Falha ao promover:'
    },
    ar: {
        noUser: '❌ اعمل منشن لمستخدم أو رد على رسالته.',
        success: '✅ المستخدم اترقى لأدمن!',
        failed: '❌ فشل في الترقية:'
    },
    hi: {
        noUser: '❌ किसी उपयोगकर्ता को टैग करें या उनके संदेश का उत्तर दें।',
        success: '✅ उपयोगकर्ता को एडमिन के रूप में प्रमोट कर दिया गया!',
        failed: '❌ प्रमोट करने में विफल:'
    },
    ng: {
        noUser: '❌ Tag user or reply to their message.',
        success: '✅ User don promote to admin!',
        failed: '❌ E no work to promote:'
    }
};

export default {
    name: 'promote',
    groupOnly: true,
    adminOnly: true,
    botAdminRequired: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        const quotedMsg = msg.message?.extendedTextMessage?.contextInfo;
        
        let userToPromote;
        if (quotedMsg?.participant) {
            userToPromote = quotedMsg.participant;
        } else {
            const mentions = extractMentions(args.join(' '));
            if (mentions.length === 0) {
                return await sock.sendMessage(from, { text: t.noUser });
            }
            userToPromote = mentions[0];
        }

        try {
            await sock.groupParticipantsUpdate(from, [userToPromote], 'promote');
            await sock.sendMessage(from, { text: t.success });
        } catch (error) {
            await sock.sendMessage(from, { text: `${t.failed} ${error.message}` });
        }
    }
};
