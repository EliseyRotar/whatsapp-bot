import { setGroupSetting } from '../../utils/database.js';
import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        usage: '❌ Usage: .mute <minutes>',
        invalidNumber: '❌ Please provide a valid number of minutes.',
        muted: '🔇 Group muted for {minutes} minutes.',
        unmuted: '🔊 Group unmuted!',
        failed: '❌ Failed to mute:'
    },
    it: {
        usage: '❌ Uso: .mute <minuti>',
        invalidNumber: '❌ Fornisci un numero valido di minuti.',
        muted: '🔇 Gruppo silenziato per {minutes} minuti.',
        unmuted: '🔊 Gruppo riattivato!',
        failed: '❌ Impossibile silenziare:'
    },
    ru: {
        usage: '❌ Использование: .mute <минуты>',
        invalidNumber: '❌ Пожалуйста, укажите правильное количество минут.',
        muted: '🔇 Группа заглушена на {minutes} минут.',
        unmuted: '🔊 Группа разглушена!',
        failed: '❌ Не удалось заглушить:'
    },
    es: {
        usage: '❌ Uso: .mute <minutos>',
        invalidNumber: '❌ Por favor proporciona un número válido de minutos.',
        muted: '🔇 Grupo silenciado por {minutes} minutos.',
        unmuted: '🔊 ¡Grupo desilenciado!',
        failed: '❌ Error al silenciar:'
    },
    pt: {
        usage: '❌ Uso: .mute <minutos>',
        invalidNumber: '❌ Por favor forneça um número válido de minutos.',
        muted: '🔇 Grupo silenciado por {minutes} minutos.',
        unmuted: '🔊 Grupo reativado!',
        failed: '❌ Falha ao silenciar:'
    },
    ar: {
        usage: '❌ الاستخدام: .mute <دقائق>',
        invalidNumber: '❌ من فضلك قدم رقم صحيح من الدقائق.',
        muted: '🔇 الجروب اتكتم لمدة {minutes} دقيقة.',
        unmuted: '🔊 الجروب اتفتح!',
        failed: '❌ فشل في الكتم:'
    },
    hi: {
        usage: '❌ उपयोग: .mute <मिनट>',
        invalidNumber: '❌ कृपया मिनटों की एक वैध संख्या प्रदान करें।',
        muted: '🔇 ग्रुप {minutes} मिनट के लिए म्यूट किया गया।',
        unmuted: '🔊 ग्रुप अनम्यूट हो गया!',
        failed: '❌ म्यूट करने में विफल:'
    },
    ng: {
        usage: '❌ How to use: .mute <minutes>',
        invalidNumber: '❌ Abeg give correct number of minutes.',
        muted: '🔇 Group don mute for {minutes} minutes.',
        unmuted: '🔊 Group don unmute!',
        failed: '❌ E no work to mute:'
    }
};

export default {
    name: 'mute',
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
        
        const minutes = parseInt(args[0]);
        if (isNaN(minutes)) {
            return await sock.sendMessage(from, { text: t.invalidNumber });
        }

        try {
            await sock.groupSettingUpdate(from, 'announcement');
            setGroupSetting(from, 'muted', true);
            
            await sock.sendMessage(from, { text: t.muted.replace('{minutes}', minutes) });
            
            setTimeout(async () => {
                await sock.groupSettingUpdate(from, 'not_announcement');
                setGroupSetting(from, 'muted', false);
                await sock.sendMessage(from, { text: t.unmuted });
            }, minutes * 60 * 1000);
        } catch (error) {
            await sock.sendMessage(from, { text: `${t.failed} ${error.message}` });
        }
    }
};
