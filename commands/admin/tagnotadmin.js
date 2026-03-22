import { config } from '../../config.js';
import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        adminOnly: '❌ This command is only for group admins.',
        defaultMsg: 'Attention members!',
        failed: '❌ Failed to tag members:'
    },
    it: {
        adminOnly: '❌ Questo comando è solo per gli admin del gruppo.',
        defaultMsg: 'Attenzione membri!',
        failed: '❌ Impossibile taggare membri:'
    },
    ru: {
        adminOnly: '❌ Эта команда только для администраторов группы.',
        defaultMsg: 'Внимание участники!',
        failed: '❌ Не удалось отметить участников:'
    },
    es: {
        adminOnly: '❌ Este comando es solo para administradores del grupo.',
        defaultMsg: '¡Atención miembros!',
        failed: '❌ Error al etiquetar miembros:'
    },
    pt: {
        adminOnly: '❌ Este comando é apenas para administradores do grupo.',
        defaultMsg: 'Atenção membros!',
        failed: '❌ Falha ao marcar membros:'
    },
    ar: {
        adminOnly: '❌ الأمر ده للأدمنز بس.',
        defaultMsg: 'انتباه يا أعضاء!',
        failed: '❌ فشل تاج الأعضاء:'
    },
    hi: {
        adminOnly: '❌ यह कमांड केवल ग्रुप एडमिन के लिए है।',
        defaultMsg: 'सदस्यों का ध्यान!',
        failed: '❌ सदस्यों को टैग करने में विफल:'
    },
    ng: {
        adminOnly: '❌ This command na only for group admins.',
        defaultMsg: 'Members make una pay attention!',
        failed: '❌ E no work to tag members:'
    }
};

export default {
    name: 'tagnotadmin',
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
            
            const nonAdmins = groupMetadata.participants.filter(p => 
                !p.admin
            );
            
            let text = `${message}\n\n`;
            nonAdmins.forEach((member, i) => {
                text += `@${member.id.split('@')[0]} `;
                if ((i + 1) % 5 === 0) text += '\n';
            });
            
            await sock.sendMessage(from, { 
                text: text.trim(),
                mentions: nonAdmins.map(m => m.id)
            });
        } catch (error) {
            await sock.sendMessage(from, { 
                text: `${t.failed} ${error.message}`
            });
        }
    }
};
