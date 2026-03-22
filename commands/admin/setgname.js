import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        usage: '❌ Usage: .setgname <new name>',
        success: '✅ Group name changed to: {name}',
        failed: '❌ Failed to change name:'
    },
    it: {
        usage: '❌ Uso: .setgname <nuovo nome>',
        success: '✅ Nome gruppo cambiato in: {name}',
        failed: '❌ Impossibile cambiare nome:'
    },
    ru: {
        usage: '❌ Использование: .setgname <новое название>',
        success: '✅ Название группы изменено на: {name}',
        failed: '❌ Не удалось изменить название:'
    },
    es: {
        usage: '❌ Uso: .setgname <nuevo nombre>',
        success: '✅ Nombre del grupo cambiado a: {name}',
        failed: '❌ Error al cambiar nombre:'
    },
    pt: {
        usage: '❌ Uso: .setgname <novo nome>',
        success: '✅ Nome do grupo alterado para: {name}',
        failed: '❌ Falha ao alterar nome:'
    },
    ar: {
        usage: '❌ الاستخدام: .setgname <اسم جديد>',
        success: '✅ اسم الجروب اتغير لـ: {name}',
        failed: '❌ فشل في تغيير الاسم:'
    },
    hi: {
        usage: '❌ उपयोग: .setgname <नया नाम>',
        success: '✅ ग्रुप का नाम बदलकर हो गया: {name}',
        failed: '❌ नाम बदलने में विफल:'
    },
    ng: {
        usage: '❌ How to use: .setgname <new name>',
        success: '✅ Group name don change to: {name}',
        failed: '❌ E no work to change name:'
    }
};

export default {
    name: 'setgname',
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
        
        const newName = args.join(' ');
        
        try {
            await sock.groupUpdateSubject(from, newName);
            await sock.sendMessage(from, { text: t.success.replace('{name}', newName) });
        } catch (error) {
            await sock.sendMessage(from, { text: `${t.failed} ${error.message}` });
        }
    }
};
