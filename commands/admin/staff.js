import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        title: '👮‍♂️ Group Admins ({count}):\n\n',
        failed: '❌ Failed to get admins:'
    },
    it: {
        title: '👮‍♂️ Admin Gruppo ({count}):\n\n',
        failed: '❌ Impossibile ottenere admin:'
    },
    ru: {
        title: '👮‍♂️ Администраторы группы ({count}):\n\n',
        failed: '❌ Не удалось получить администраторов:'
    },
    es: {
        title: '👮‍♂️ Administradores del Grupo ({count}):\n\n',
        failed: '❌ Error al obtener administradores:'
    },
    pt: {
        title: '👮‍♂️ Administradores do Grupo ({count}):\n\n',
        failed: '❌ Falha ao obter administradores:'
    },
    ar: {
        title: '👮‍♂️ أدمنز الجروب ({count}):\n\n',
        failed: '❌ فشل في الحصول على الأدمنز:'
    },
    hi: {
        title: '👮‍♂️ ग्रुप एडमिन ({count}):\n\n',
        failed: '❌ एडमिन प्राप्त करने में विफल:'
    },
    ng: {
        title: '👮‍♂️ Group Admins ({count}):\n\n',
        failed: '❌ E no work to get admins:'
    }
};

export default {
    name: 'staff',
    aliases: ['admins'],
    groupOnly: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        try {
            const groupMetadata = await sock.groupMetadata(from);
            
            const admins = groupMetadata.participants.filter(p => 
                p.admin === 'admin' || p.admin === 'superadmin'
            );
            
            let text = t.title.replace('{count}', admins.length);
            
            admins.forEach((admin, i) => {
                const role = admin.admin === 'superadmin' ? '👑' : '⭐';
                text += `${i + 1}. ${role} @${admin.id.split('@')[0]}\n`;
            });
            
            await sock.sendMessage(from, { 
                text,
                mentions: admins.map(a => a.id)
            });
        } catch (error) {
            await sock.sendMessage(from, { 
                text: `${t.failed} ${error.message}`
            });
        }
    }
};
