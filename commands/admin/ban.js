import { extractMentions } from '../../utils/helpers.js';
import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        noUser: '❌ Tag a user or reply to their message.',
        success: '✅ User banned successfully!',
        failed: '❌ Failed to ban user:'
    },
    it: {
        noUser: '❌ Tagga un utente o rispondi al suo messaggio.',
        success: '✅ Utente bannato con successo!',
        failed: '❌ Impossibile bannare utente:'
    },
    ru: {
        noUser: '❌ Отметьте пользователя или ответьте на его сообщение.',
        success: '✅ Пользователь успешно забанен!',
        failed: '❌ Не удалось забанить пользователя:'
    },
    es: {
        noUser: '❌ Etiqueta a un usuario o responde a su mensaje.',
        success: '✅ ¡Usuario baneado exitosamente!',
        failed: '❌ Error al banear usuario:'
    },
    pt: {
        noUser: '❌ Marque um usuário ou responda à mensagem dele.',
        success: '✅ Usuário banido com sucesso!',
        failed: '❌ Falha ao banir usuário:'
    },
    ar: {
        noUser: '❌ اعمل منشن لمستخدم أو رد على رسالته.',
        success: '✅ المستخدم اتبند بنجاح!',
        failed: '❌ فشل في بان المستخدم:'
    },
    hi: {
        noUser: '❌ किसी उपयोगकर्ता को टैग करें या उनके संदेश का उत्तर दें।',
        success: '✅ उपयोगकर्ता को सफलतापूर्वक बैन कर दिया गया!',
        failed: '❌ उपयोगकर्ता को बैन करने में विफल:'
    },
    ng: {
        noUser: '❌ Tag user or reply to their message.',
        success: '✅ User don ban successfully!',
        failed: '❌ E no work to ban user:'
    }
};

export default {
    name: 'ban',
    groupOnly: true,
    adminOnly: true,
    botAdminRequired: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        const quotedMsg = msg.message?.extendedTextMessage?.contextInfo;
        
        let userToBan;
        if (quotedMsg?.participant) {
            userToBan = quotedMsg.participant;
        } else {
            const mentions = extractMentions(args.join(' '));
            if (mentions.length === 0) {
                return await sock.sendMessage(from, { text: t.noUser });
            }
            userToBan = mentions[0];
        }

        try {
            await sock.groupParticipantsUpdate(from, [userToBan], 'remove');
            await sock.sendMessage(from, { text: t.success });
        } catch (error) {
            await sock.sendMessage(from, { text: `${t.failed} ${error.message}` });
        }
    }
};
