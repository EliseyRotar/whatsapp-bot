import { getGroupLanguage } from '../../utils/language.js';
import { getGroupSetting, setGroupSetting } from '../../utils/database.js';

const responses = {
    en: {
        current_on:  '🤖 Bot is currently ENABLED in this chat.\n\nUsage: .mode private — disable here\n        .mode public — enable here',
        current_off: '🤖 Bot is currently DISABLED in this chat.\n\nUsage: .mode public — enable here',
        enabled:     '✅ Bot ENABLED for this chat.',
        disabled:    '🔇 Bot DISABLED for this chat. Only the owner can still use commands here.',
        usage:       '❌ Usage: .mode <public/private>'
    },
    it: {
        current_on:  '🤖 Il bot è attualmente ATTIVO in questa chat.\n\nUso: .mode private — disattiva qui\n     .mode public — attiva qui',
        current_off: '🤖 Il bot è attualmente DISATTIVO in questa chat.\n\nUso: .mode public — attiva qui',
        enabled:     '✅ Bot ATTIVATO per questa chat.',
        disabled:    '🔇 Bot DISATTIVATO per questa chat. Solo il proprietario può ancora usare i comandi qui.',
        usage:       '❌ Uso: .mode <public/private>'
    },
    ru: {
        current_on:  '🤖 Бот сейчас ВКЛЮЧЁН в этом чате.\n\nИспользование: .mode private — отключить здесь\n               .mode public — включить здесь',
        current_off: '🤖 Бот сейчас ОТКЛЮЧЁН в этом чате.\n\nИспользование: .mode public — включить здесь',
        enabled:     '✅ Бот ВКЛЮЧЁН для этого чата.',
        disabled:    '🔇 Бот ОТКЛЮЧЁН для этого чата. Только владелец может использовать команды здесь.',
        usage:       '❌ Использование: .mode <public/private>'
    },
    es: {
        current_on:  '🤖 El bot está actualmente ACTIVADO en este chat.\n\nUso: .mode private — desactivar aquí\n     .mode public — activar aquí',
        current_off: '🤖 El bot está actualmente DESACTIVADO en este chat.\n\nUso: .mode public — activar aquí',
        enabled:     '✅ Bot ACTIVADO para este chat.',
        disabled:    '🔇 Bot DESACTIVADO para este chat. Solo el dueño puede usar comandos aquí.',
        usage:       '❌ Uso: .mode <public/private>'
    },
    pt: {
        current_on:  '🤖 O bot está atualmente ATIVADO neste chat.\n\nUso: .mode private — desativar aqui\n     .mode public — ativar aqui',
        current_off: '🤖 O bot está atualmente DESATIVADO neste chat.\n\nUso: .mode public — ativar aqui',
        enabled:     '✅ Bot ATIVADO para este chat.',
        disabled:    '🔇 Bot DESATIVADO para este chat. Apenas o dono ainda pode usar comandos aqui.',
        usage:       '❌ Uso: .mode <public/private>'
    },
    ar: {
        current_on:  '🤖 البوت مفعّل حالياً في هذه المحادثة.\n\nالاستخدام: .mode private — تعطيل هنا\n           .mode public — تفعيل هنا',
        current_off: '🤖 البوت معطّل حالياً في هذه المحادثة.\n\nالاستخدام: .mode public — تفعيل هنا',
        enabled:     '✅ تم تفعيل البوت لهذه المحادثة.',
        disabled:    '🔇 تم تعطيل البوت لهذه المحادثة. فقط المالك يمكنه استخدام الأوامر هنا.',
        usage:       '❌ الاستخدام: .mode <public/private>'
    },
    hi: {
        current_on:  '🤖 बॉट इस चैट में अभी ENABLED है।\n\nउपयोग: .mode private — यहाँ बंद करें\n        .mode public — यहाँ चालू करें',
        current_off: '🤖 बॉट इस चैट में अभी DISABLED है।\n\nउपयोग: .mode public — यहाँ चालू करें',
        enabled:     '✅ इस चैट के लिए बॉट ENABLED किया गया।',
        disabled:    '🔇 इस चैट के लिए बॉट DISABLED किया गया। केवल मालिक यहाँ कमांड उपयोग कर सकते हैं।',
        usage:       '❌ उपयोग: .mode <public/private>'
    },
    ng: {
        current_on:  '🤖 Bot dey ON for this chat.\n\nHow to use: .mode private — off am here\n            .mode public — on am here',
        current_off: '🤖 Bot dey OFF for this chat.\n\nHow to use: .mode public — on am here',
        enabled:     '✅ Bot don ON for this chat.',
        disabled:    '🔇 Bot don OFF for this chat. Only owner fit use commands here.',
        usage:       '❌ How to use: .mode <public/private>'
    }
};

export default {
    name: 'mode',
    ownerOnly: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;

        if (args.length === 0) {
            const isDisabled = getGroupSetting(from, 'botDisabled', false);
            return await sock.sendMessage(from, {
                text: isDisabled ? t.current_off : t.current_on
            });
        }

        const mode = args[0].toLowerCase();
        if (mode === 'private') {
            await setGroupSetting(from, 'botDisabled', true);
            await sock.sendMessage(from, { text: t.disabled });
        } else if (mode === 'public') {
            await setGroupSetting(from, 'botDisabled', false);
            await sock.sendMessage(from, { text: t.enabled });
        } else {
            await sock.sendMessage(from, { text: t.usage });
        }
    }
};
