import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        title: '╔═══ GROUP INFO ═══╗\n\n',
        name: '📛 Name:',
        id: '🆔 ID:',
        members: '👥 Members:',
        admins: '👮 Admins:',
        created: '📅 Created:',
        description: '\n📝 Description:\n',
        failed: '❌ Failed to get group info:'
    },
    it: {
        title: '╔═══ INFO GRUPPO ═══╗\n\n',
        name: '📛 Nome:',
        id: '🆔 ID:',
        members: '👥 Membri:',
        admins: '👮 Admin:',
        created: '📅 Creato:',
        description: '\n📝 Descrizione:\n',
        failed: '❌ Impossibile ottenere info gruppo:'
    },
    ru: {
        title: '╔═══ ИНФОРМАЦИЯ О ГРУППЕ ═══╗\n\n',
        name: '📛 Название:',
        id: '🆔 ID:',
        members: '👥 Участников:',
        admins: '👮 Администраторов:',
        created: '📅 Создана:',
        description: '\n📝 Описание:\n',
        failed: '❌ Не удалось получить информацию о группе:'
    },
    es: {
        title: '╔═══ INFO DEL GRUPO ═══╗\n\n',
        name: '📛 Nombre:',
        id: '🆔 ID:',
        members: '👥 Miembros:',
        admins: '👮 Administradores:',
        created: '📅 Creado:',
        description: '\n📝 Descripción:\n',
        failed: '❌ Error al obtener información del grupo:'
    },
    pt: {
        title: '╔═══ INFO DO GRUPO ═══╗\n\n',
        name: '📛 Nome:',
        id: '🆔 ID:',
        members: '👥 Membros:',
        admins: '👮 Administradores:',
        created: '📅 Criado:',
        description: '\n📝 Descrição:\n',
        failed: '❌ Falha ao obter informações do grupo:'
    },
    ar: {
        title: '╔═══ معلومات الجروب ═══╗\n\n',
        name: '📛 الاسم:',
        id: '🆔 المعرف:',
        members: '👥 الأعضاء:',
        admins: '👮 الأدمنز:',
        created: '📅 تم الإنشاء:',
        description: '\n📝 الوصف:\n',
        failed: '❌ فشل في الحصول على معلومات الجروب:'
    },
    hi: {
        title: '╔═══ ग्रुप जानकारी ═══╗\n\n',
        name: '📛 नाम:',
        id: '🆔 आईडी:',
        members: '👥 सदस्य:',
        admins: '👮 एडमिन:',
        created: '📅 बनाया गया:',
        description: '\n📝 विवरण:\n',
        failed: '❌ ग्रुप जानकारी प्राप्त करने में विफल:'
    },
    ng: {
        title: '╔═══ GROUP INFO ═══╗\n\n',
        name: '📛 Name:',
        id: '🆔 ID:',
        members: '👥 Members:',
        admins: '👮 Admins:',
        created: '📅 Created:',
        description: '\n📝 Description:\n',
        failed: '❌ E no work to get group info:'
    }
};

export default {
    name: 'groupinfo',
    groupOnly: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        try {
            const groupMetadata = await sock.groupMetadata(from);
            
            const admins = groupMetadata.participants.filter(p => 
                p.admin === 'admin' || p.admin === 'superadmin'
            ).length;
            
            const members = groupMetadata.participants.length;
            
            let text = t.title;
            text += `${t.name} ${groupMetadata.subject}\n`;
            text += `${t.id} ${groupMetadata.id}\n`;
            text += `${t.members} ${members}\n`;
            text += `${t.admins} ${admins}\n`;
            text += `${t.created} ${new Date(groupMetadata.creation * 1000).toLocaleDateString()}\n`;
            
            if (groupMetadata.desc) {
                text += `${t.description}${groupMetadata.desc}`;
            }
            
            await sock.sendMessage(from, { text });
        } catch (error) {
            await sock.sendMessage(from, { 
                text: `${t.failed} ${error.message}`
            });
        }
    }
};
