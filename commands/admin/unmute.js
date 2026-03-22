import { setGroupSetting } from '../../utils/database.js';
import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        unmuted: '🔊 Group unmuted! Everyone can send messages now.',
        failed: '❌ Failed to unmute:'
    },
    it: {
        unmuted: '🔊 Gruppo riattivato! Tutti possono inviare messaggi ora.',
        failed: '❌ Impossibile riattivare:'
    },
    ru: {
        unmuted: '🔊 Группа разглушена! Все могут отправлять сообщения.',
        failed: '❌ Не удалось разглушить:'
    },
    es: {
        unmuted: '🔊 ¡Grupo desilenciado! Todos pueden enviar mensajes ahora.',
        failed: '❌ Error al desilenciar:'
    },
    pt: {
        unmuted: '🔊 Grupo reativado! Todos podem enviar mensagens agora.',
        failed: '❌ Falha ao reativar:'
    },
    ar: {
        unmuted: '🔊 الجروب اتفتح! الكل يقدر يبعت رسائل دلوقتي.',
        failed: '❌ فشل في فتح الجروب:'
    },
    hi: {
        unmuted: '🔊 ग्रुप अनम्यूट हो गया! अब सभी संदेश भेज सकते हैं।',
        failed: '❌ अनम्यूट करने में विफल:'
    },
    ng: {
        unmuted: '🔊 Group don unmute! Everybody fit send message now.',
        failed: '❌ E no work to unmute:'
    }
};

export default {
    name: 'unmute',
    groupOnly: true,
    adminOnly: true,
    botAdminRequired: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;

        try {
            await sock.groupSettingUpdate(from, 'not_announcement');
            await setGroupSetting(from, 'muted', false);
            
            await sock.sendMessage(from, { text: t.unmuted });
        } catch (error) {
            await sock.sendMessage(from, { text: `${t.failed} ${error.message}` });
        }
    }
};
