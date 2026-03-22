import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        usage: '❌ Usage: .setgdesc <new description>',
        success: '✅ Group description updated!',
        failed: '❌ Failed to update description:'
    },
    it: {
        usage: '❌ Uso: .setgdesc <nuova descrizione>',
        success: '✅ Descrizione gruppo aggiornata!',
        failed: '❌ Impossibile aggiornare descrizione:'
    },
    ru: {
        usage: '❌ Использование: .setgdesc <новое описание>',
        success: '✅ Описание группы обновлено!',
        failed: '❌ Не удалось обновить описание:'
    },
    es: {
        usage: '❌ Uso: .setgdesc <nueva descripción>',
        success: '✅ ¡Descripción del grupo actualizada!',
        failed: '❌ Error al actualizar descripción:'
    },
    pt: {
        usage: '❌ Uso: .setgdesc <nova descrição>',
        success: '✅ Descrição do grupo atualizada!',
        failed: '❌ Falha ao atualizar descrição:'
    },
    ar: {
        usage: '❌ الاستخدام: .setgdesc <وصف جديد>',
        success: '✅ وصف الجروب اتحدث!',
        failed: '❌ فشل في تحديث الوصف:'
    },
    hi: {
        usage: '❌ उपयोग: .setgdesc <नया विवरण>',
        success: '✅ ग्रुप विवरण अपडेट हो गया!',
        failed: '❌ विवरण अपडेट करने में विफल:'
    },
    ng: {
        usage: '❌ How to use am: .setgdesc <new description>',
        success: '✅ Group description don update finish!',
        failed: '❌ E no work to update description:'
    }
};

export default {
    name: 'setgdesc',
    groupOnly: true,
    adminOnly: true,
    botAdminRequired: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        if (args.length === 0) {
            return await sock.sendMessage(from, { text: t.usage });
        }
        
        const newDesc = args.join(' ');
        
        try {
            await sock.groupUpdateDescription(from, newDesc);
            await sock.sendMessage(from, { text: t.success });
        } catch (error) {
            await sock.sendMessage(from, { text: `${t.failed} ${error.message}` });
        }
    }
};
