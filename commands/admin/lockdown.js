import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        usage: 'Usage: .lockdown <on/off>\n\nLockdown mode restricts messaging to admins only.',
        locked: '🔒 LOCKDOWN ACTIVATED\n\nGroup is now locked. Only admins can send messages.',
        unlocked: '🔓 LOCKDOWN DEACTIVATED\n\nGroup is now open. Everyone can send messages.',
        alreadyLocked: '⚠️ Group is already in lockdown mode.',
        alreadyUnlocked: '⚠️ Group is already open.',
        error: '❌ Failed to change group settings. Make sure the bot is an admin.',
        invalidOption: '❌ Invalid option! Use: on or off'
    },
    it: {
        usage: 'Uso: .lockdown <on/off>\n\nLa modalità lockdown limita i messaggi solo agli admin.',
        locked: '🔒 LOCKDOWN ATTIVATO\n\nGruppo bloccato. Solo gli admin possono inviare messaggi.',
        unlocked: '🔓 LOCKDOWN DISATTIVATO\n\nGruppo aperto. Tutti possono inviare messaggi.',
        alreadyLocked: '⚠️ Il gruppo è già in modalità lockdown.',
        alreadyUnlocked: '⚠️ Il gruppo è già aperto.',
        error: '❌ Impossibile modificare le impostazioni del gruppo. Assicurati che il bot sia admin.',
        invalidOption: '❌ Opzione non valida! Usa: on o off'
    },
    ru: {
        usage: 'Использование: .lockdown <on/off>\n\nРежим блокировки ограничивает отправку сообщений только для администраторов.',
        locked: '🔒 БЛОКИРОВКА АКТИВИРОВАНА\n\nГруппа заблокирована. Только администраторы могут отправлять сообщения.',
        unlocked: '🔓 БЛОКИРОВКА ДЕАКТИВИРОВАНА\n\nГруппа открыта. Все могут отправлять сообщения.',
        alreadyLocked: '⚠️ Группа уже в режиме блокировки.',
        alreadyUnlocked: '⚠️ Группа уже открыта.',
        error: '❌ Не удалось изменить настройки группы. Убедитесь, что бот является администратором.',
        invalidOption: '❌ Неверная опция! Используйте: on или off'
    },
    es: {
        usage: 'Uso: .lockdown <on/off>\n\nEl modo de bloqueo restringe los mensajes solo a administradores.',
        locked: '🔒 BLOQUEO ACTIVADO\n\nEl grupo está bloqueado. Solo los administradores pueden enviar mensajes.',
        unlocked: '🔓 BLOQUEO DESACTIVADO\n\nEl grupo está abierto. Todos pueden enviar mensajes.',
        alreadyLocked: '⚠️ El grupo ya está en modo de bloqueo.',
        alreadyUnlocked: '⚠️ El grupo ya está abierto.',
        error: '❌ Error al cambiar la configuración del grupo. Asegúrate de que el bot sea administrador.',
        invalidOption: '❌ ¡Opción inválida! Usa: on u off'
    },
    pt: {
        usage: 'Uso: .lockdown <on/off>\n\nO modo de bloqueio restringe mensagens apenas para administradores.',
        locked: '🔒 BLOQUEIO ATIVADO\n\nO grupo está bloqueado. Apenas administradores podem enviar mensagens.',
        unlocked: '🔓 BLOQUEIO DESATIVADO\n\nO grupo está aberto. Todos podem enviar mensagens.',
        alreadyLocked: '⚠️ O grupo já está em modo de bloqueio.',
        alreadyUnlocked: '⚠️ O grupo já está aberto.',
        error: '❌ Falha ao alterar configurações do grupo. Certifique-se de que o bot seja administrador.',
        invalidOption: '❌ Opção inválida! Use: on ou off'
    },
    ar: {
        usage: 'الاستخدام: .lockdown <on/off>\n\nوضع القفل بيقيد الرسائل للأدمنز فقط.',
        locked: '🔒 القفل اتفعل\n\nالجروب اتقفل. الأدمنز بس يقدروا يبعتوا رسائل.',
        unlocked: '🔓 القفل اتشال\n\nالجروب اتفتح. الكل يقدر يبعت رسائل.',
        alreadyLocked: '⚠️ الجروب فعلاً في وضع القفل.',
        alreadyUnlocked: '⚠️ الجروب فعلاً مفتوح.',
        error: '❌ فشل في تغيير إعدادات الجروب. تأكد إن البوت أدمن.',
        invalidOption: '❌ خيار غلط! استخدم: on أو off'
    },
    hi: {
        usage: 'उपयोग: .lockdown <on/off>\n\nलॉकडाउन मोड मैसेजिंग को केवल एडमिन तक सीमित करता है।',
        locked: '🔒 लॉकडाउन सक्रिय\n\nग्रुप अब लॉक है। केवल एडमिन मैसेज भेज सकते हैं।',
        unlocked: '🔓 लॉकडाउन निष्क्रिय\n\nग्रुप अब खुला है। सभी मैसेज भेज सकते हैं।',
        alreadyLocked: '⚠️ ग्रुप पहले से ही लॉकडाउन मोड में है।',
        alreadyUnlocked: '⚠️ ग्रुप पहले से ही खुला है।',
        error: '❌ ग्रुप सेटिंग्स बदलने में विफल। सुनिश्चित करें कि बॉट एडमिन है।',
        invalidOption: '❌ अमान्य विकल्प! उपयोग करें: on या off'
    },
    ng: {
        usage: 'How to use am: .lockdown <on/off>\n\nLockdown mode go make only admin fit send message.',
        locked: '🔒 LOCKDOWN DON ACTIVATE\n\nGroup don lock. Na only admin fit send message now.',
        unlocked: '🔓 LOCKDOWN DON OFF\n\nGroup don open. Everybody fit send message now.',
        alreadyLocked: '⚠️ Group don dey for lockdown mode already.',
        alreadyUnlocked: '⚠️ Group don dey open already.',
        error: '❌ E no work to change group settings. Make sure say bot na admin.',
        invalidOption: '❌ Dat option no correct! Use: on or off'
    }
};

export default {
    name: 'lockdown',
    adminOnly: true,
    groupOnly: true,
    botAdminRequired: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        if (args.length === 0) {
            return await sock.sendMessage(from, { text: t.usage });
        }
        
        const option = args[0].toLowerCase();
        
        if (option !== 'on' && option !== 'off') {
            return await sock.sendMessage(from, { text: t.invalidOption });
        }
        
        try {
            // Get current group metadata
            const groupMetadata = await sock.groupMetadata(from);
            const isCurrentlyLocked = groupMetadata.announce;
            
            if (option === 'on') {
                if (isCurrentlyLocked) {
                    return await sock.sendMessage(from, { text: t.alreadyLocked });
                }
                
                // Lock group (announce = true means only admins can send)
                await sock.groupSettingUpdate(from, 'announcement');
                
                await sock.sendMessage(from, { text: t.locked });
                
            } else {
                if (!isCurrentlyLocked) {
                    return await sock.sendMessage(from, { text: t.alreadyUnlocked });
                }
                
                // Unlock group (not_announcement = false means everyone can send)
                await sock.groupSettingUpdate(from, 'not_announcement');
                
                await sock.sendMessage(from, { text: t.unlocked });
            }
            
        } catch (error) {
            console.error('[LOCKDOWN] Error:', error.message);
            await sock.sendMessage(from, { text: t.error });
        }
    }
};
