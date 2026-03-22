import { config } from '../../config.js';
import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        adminOnly: '❌ This command is only for group admins.',
        defaultMsg: 'Hidden tag message',
        failed: '❌ Failed to send hidetag:'
    },
    it: {
        adminOnly: '❌ Questo comando è solo per gli admin del gruppo.',
        defaultMsg: 'Messaggio tag nascosto',
        failed: '❌ Impossibile inviare hidetag:'
    },
    ru: {
        adminOnly: '❌ Эта команда только для администраторов группы.',
        defaultMsg: 'Скрытое сообщение с тегом',
        failed: '❌ Не удалось отправить скрытый тег:'
    },
    es: {
        adminOnly: '❌ Este comando es solo para administradores del grupo.',
        defaultMsg: 'Mensaje de etiqueta oculta',
        failed: '❌ Error al enviar etiqueta oculta:'
    },
    pt: {
        adminOnly: '❌ Este comando é apenas para administradores do grupo.',
        defaultMsg: 'Mensagem de tag oculta',
        failed: '❌ Falha ao enviar tag oculta:'
    },
    ar: {
        adminOnly: '❌ هذا الأمر للمشرفين فقط.',
        defaultMsg: 'رسالة وسم مخفية',
        failed: '❌ فشل في إرسال الوسم المخفي:'
    },
    hi: {
        adminOnly: '❌ यह कमांड केवल ग्रुप एडमिन के लिए है।',
        defaultMsg: 'छिपा हुआ टैग संदेश',
        failed: '❌ हाइडटैग भेजने में विफल:'
    },
    ng: {
        adminOnly: '❌ This command na only for group admins.',
        defaultMsg: 'Hidden tag message',
        failed: '❌ E no work to send hidetag:'
    }
};

export default {
    name: 'hidetag',
    groupOnly: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        const botJid = sock.user?.id?.replace(/:\d+/, '') || '';
        const senderNumber = sender.split('@')[0].replace(/\D/g, '');
        
        // Check if sender is owner
        const isOwner = sender === config.ownerJid ||
                       sender === botJid ||
                       sender.includes(botJid.split('@')[0]) ||
                       senderNumber === config.ownerNumber || 
                       sender.includes(config.ownerNumber) ||
                       msg.key.fromMe;
        
        // If not owner, check admin permission
        if (!isOwner) {
            const { isAdmin } = await import('../../utils/helpers.js');
            const isUserAdmin = await isAdmin(sock, from, sender);
            if (!isUserAdmin) {
                return await sock.sendMessage(from, { 
                    text: t.adminOnly
                });
            }
        }
        
        const message = args.join(' ') || t.defaultMsg;
        
        try {
            const groupMetadata = await sock.groupMetadata(from);
            const participants = groupMetadata.participants.map(p => p.id);
            
            await sock.sendMessage(from, { 
                text: message,
                mentions: participants
            });
        } catch (error) {
            await sock.sendMessage(from, { text: `${t.failed} ${error.message}` });
        }
    }
};
