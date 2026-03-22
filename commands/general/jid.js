import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        yourJid: '📱 Your WhatsApp JID:',
        userJid: '📱 User WhatsApp JID:',
        groupJid: '👥 Group JID:',
        usage: '💡 Usage:\n• .jid - Show your JID\n• .jid @user - Show mentioned user\'s JID\n• Reply to message + .jid - Show that user\'s JID'
    },
    it: {
        yourJid: '📱 Il tuo JID WhatsApp:',
        userJid: '📱 JID WhatsApp Utente:',
        groupJid: '👥 JID del Gruppo:',
        usage: '💡 Uso:\n• .jid - Mostra il tuo JID\n• .jid @utente - Mostra JID utente menzionato\n• Rispondi al messaggio + .jid - Mostra JID di quell\'utente'
    },
    ru: {
        yourJid: '📱 Ваш WhatsApp JID:',
        userJid: '📱 WhatsApp JID пользователя:',
        groupJid: '👥 JID группы:',
        usage: '💡 Использование:\n• .jid - Показать ваш JID\n• .jid @пользователь - Показать JID упомянутого пользователя\n• Ответить на сообщение + .jid - Показать JID этого пользователя'
    },
    es: {
        yourJid: '📱 Tu JID de WhatsApp:',
        userJid: '📱 JID de WhatsApp del Usuario:',
        groupJid: '👥 JID del Grupo:',
        usage: '💡 Uso:\n• .jid - Mostrar tu JID\n• .jid @usuario - Mostrar JID del usuario mencionado\n• Responder mensaje + .jid - Mostrar JID de ese usuario'
    },
    pt: {
        yourJid: '📱 Seu JID do WhatsApp:',
        userJid: '📱 JID do WhatsApp do Usuário:',
        groupJid: '👥 JID do Grupo:',
        usage: '💡 Uso:\n• .jid - Mostrar seu JID\n• .jid @usuário - Mostrar JID do usuário mencionado\n• Responder mensagem + .jid - Mostrar JID desse usuário'
    },
    ar: {
        yourJid: '📱 الـ JID بتاعك:',
        userJid: '📱 JID المستخدم:',
        groupJid: '👥 JID الجروب:',
        usage: '💡 الاستخدام:\n• .jid - اعرض الـ JID بتاعك\n• .jid @مستخدم - اعرض JID المستخدم المذكور\n• رد على رسالة + .jid - اعرض JID المستخدم ده'
    },
    hi: {
        yourJid: '📱 आपका WhatsApp JID:',
        userJid: '📱 यूजर WhatsApp JID:',
        groupJid: '👥 ग्रुप JID:',
        usage: '💡 उपयोग:\n• .jid - अपना JID दिखाएं\n• .jid @यूजर - मेंशन किए गए यूजर का JID दिखाएं\n• मैसेज पर रिप्लाई + .jid - उस यूजर का JID दिखाएं'
    },
    ng: {
        yourJid: '📱 Your WhatsApp JID:',
        userJid: '📱 User WhatsApp JID:',
        groupJid: '👥 Group JID:',
        usage: '💡 How to use:\n• .jid - Show your JID\n• .jid @user - Show user wey you mention JID\n• Reply to message + .jid - Show dat user JID'
    }
};

export default {
    name: 'jid',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        // Check if user mentioned someone or replied to a message
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
        const targetUser = mentioned || quoted;
        
        let jidInfo = '';
        
        if (targetUser) {
            // Show mentioned/quoted user's JID
            const userName = targetUser.split('@')[0];
            jidInfo = `${t.userJid}\n@${userName}\n\n${targetUser}`;
            
            if (isGroup) {
                jidInfo += `\n\n${t.groupJid}\n${from}`;
            }
            
            await sock.sendMessage(from, { 
                text: jidInfo,
                mentions: [targetUser]
            });
        } else {
            // Show sender's JID
            jidInfo = `${t.yourJid}\n${sender}`;
            
            if (isGroup) {
                jidInfo += `\n\n${t.groupJid}\n${from}`;
            }
            
            jidInfo += `\n\n${t.usage}`;
            
            await sock.sendMessage(from, { text: jidInfo });
        }
    }
};
