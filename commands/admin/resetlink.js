import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        success: '✅ Group invite link reset!\n\n🔗 New link: https://chat.whatsapp.com/{code}',
        failed: '❌ Failed to reset link:'
    },
    it: {
        success: '✅ Link invito gruppo resettato!\n\n🔗 Nuovo link: https://chat.whatsapp.com/{code}',
        failed: '❌ Impossibile resettare link:'
    },
    ru: {
        success: '✅ Ссылка-приглашение группы сброшена!\n\n🔗 Новая ссылка: https://chat.whatsapp.com/{code}',
        failed: '❌ Не удалось сбросить ссылку:'
    },
    es: {
        success: '✅ ¡Enlace de invitación del grupo restablecido!\n\n🔗 Nuevo enlace: https://chat.whatsapp.com/{code}',
        failed: '❌ Error al restablecer enlace:'
    },
    pt: {
        success: '✅ Link de convite do grupo redefinido!\n\n🔗 Novo link: https://chat.whatsapp.com/{code}',
        failed: '❌ Falha ao redefinir link:'
    },
    ar: {
        success: '✅ رابط دعوة الجروب اتغير!\n\n🔗 الرابط الجديد: https://chat.whatsapp.com/{code}',
        failed: '❌ فشل في تغيير الرابط:'
    },
    hi: {
        success: '✅ ग्रुप इनवाइट लिंक रीसेट हो गया!\n\n🔗 नया लिंक: https://chat.whatsapp.com/{code}',
        failed: '❌ लिंक रीसेट करने में विफल:'
    },
    ng: {
        success: '✅ Group invite link don reset!\n\n🔗 New link: https://chat.whatsapp.com/{code}',
        failed: '❌ E no work to reset link:'
    }
};

export default {
    name: 'resetlink',
    groupOnly: true,
    adminOnly: true,
    botAdminRequired: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        try {
            const newCode = await sock.groupRevokeInvite(from);
            await sock.sendMessage(from, { 
                text: t.success.replace('{code}', newCode)
            });
        } catch (error) {
            await sock.sendMessage(from, { 
                text: `${t.failed} ${error.message}`
            });
        }
    }
};
