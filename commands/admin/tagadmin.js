import { config } from '../../config.js';
import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        adminOnly: '❌ This command is only for group admins.',
        defaultMsg: 'Attention admins!',
        failed: '❌ Failed to tag admins:'
    },
    it: {
        adminOnly: '❌ Questo comando è solo per gli admin del gruppo.',
        defaultMsg: 'Attenzione admin!',
        failed: '❌ Impossibile taggare admin:'
    },
    ru: {
        adminOnly: '❌ Эта команда только для администраторов группы.',
        defaultMsg: 'Внимание администраторы!',
        failed: '❌ Не удалось отметить администраторов:'
    },
    es: {
        adminOnly: '❌ Este comando es solo para administradores del grupo.',
        defaultMsg: '¡Atención administradores!',
        failed: '❌ Error al etiquetar administradores:'
    },
    pt: {
        adminOnly: '❌ Este comando é apenas para administradores do grupo.',
        defaultMsg: 'Atenção administradores!',
        failed: '❌ Falha ao marcar administradores:'
    },
    ar: {
        adminOnly: '❌ الأمر ده للأدمنز بس.',
        defaultMsg: 'انتباه يا أدمنز!',
        failed: '❌ فشل تاج الأدمنز:'
    },
    hi: {
        adminOnly: '❌ यह कमांड केवल ग्रुप एडमिन के लिए है।',
        defaultMsg: 'एडमिन ध्यान दें!',
        failed: '❌ एडमिन को टैग करने में विफल:'
    },
    ng: {
        adminOnly: '❌ This command na only for group admins.',
        defaultMsg: 'Admins make una pay attention!',
        failed: '❌ E no work to tag admins:'
    }
};

export default {
    name: 'tagadmin',
    aliases: ['tagadmins'],
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
            
            const admins = groupMetadata.participants.filter(p => 
                p.admin === 'admin' || p.admin === 'superadmin'
            );
            
            let text = `${message}\n\n`;
            admins.forEach((member, i) => {
                text += `@${member.id.split('@')[0]} `;
                if ((i + 1) % 5 === 0) text += '\n';
            });
            
            await sock.sendMessage(from, { 
                text: text.trim(),
                mentions: admins.map(m => m.id)
            });
        } catch (error) {
            await sock.sendMessage(from, { 
                text: `${t.failed} ${error.message}`
            });
        }
    }
};
