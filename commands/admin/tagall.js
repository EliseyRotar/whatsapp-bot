import { config } from '../../config.js';
import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        adminOnly: '❌ This command is only for group admins.',
        defaultMsg: 'Attention everyone!',
        failed: '❌ Failed to tag all:'
    },
    it: {
        adminOnly: '❌ Questo comando è solo per gli admin del gruppo.',
        defaultMsg: 'Attenzione a tutti!',
        failed: '❌ Impossibile taggare tutti:'
    },
    ru: {
        adminOnly: '❌ Эта команда только для администраторов группы.',
        defaultMsg: 'Внимание всем!',
        failed: '❌ Не удалось отметить всех:'
    },
    es: {
        adminOnly: '❌ Este comando es solo para administradores del grupo.',
        defaultMsg: '¡Atención a todos!',
        failed: '❌ Error al etiquetar a todos:'
    },
    pt: {
        adminOnly: '❌ Este comando é apenas para administradores do grupo.',
        defaultMsg: 'Atenção a todos!',
        failed: '❌ Falha ao marcar todos:'
    },
    ar: {
        adminOnly: '❌ هذا الأمر للمشرفين فقط.',
        defaultMsg: 'انتباه للجميع!',
        failed: '❌ فشل في وسم الجميع:'
    },
    hi: {
        adminOnly: '❌ यह कमांड केवल समूह व्यवस्थापकों के लिए है।',
        defaultMsg: 'सभी का ध्यान!',
        failed: '❌ सभी को टैग करने में विफल:'
    },
    ng: {
        adminOnly: '❌ This command na only for group admins.',
        defaultMsg: 'Everybody make una pay attention!',
        failed: '❌ E no work to tag everybody:'
    }
};

export default {
    name: 'tagall',
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
            
            let text = `${message}\n\n`;
            participants.forEach((participant, i) => {
                text += `@${participant.split('@')[0]} `;
                if ((i + 1) % 5 === 0) text += '\n';
            });
            
            await sock.sendMessage(from, { 
                text: text.trim(),
                mentions: participants
            });
        } catch (error) {
            await sock.sendMessage(from, { text: `${t.failed} ${error.message}` });
        }
    }
};
