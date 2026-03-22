import { config } from '../../config.js';
import { getGroupLanguage } from '../../utils/language.js';
import { sendAsChannelForward } from '../../utils/fakeForward.js';

const responses = {
    en: {
        title: '╔═══════════════════════════╗\n║   👮 ADMIN COMMANDS   ║\n╚═══════════════════════════╝',
        
        memberSection: '\n┌─ 👤 MEMBER MANAGEMENT\n│',
        member: [
            '.add <number> - Add member to group',
            '.kick @user - Remove user from group',
            '.ban @user - Ban user permanently',
            '.promote @user - Make user admin',
            '.demote @user - Remove admin privileges'
        ],
        
        moderationSection: '\n┌─ ⚖️ MODERATION\n│',
        moderation: [
            '.warn @user <reason> - Warn a user',
            '.warn all <reason> - Warn everyone',
            '.warnings @user - Check user warnings',
            '.warnings clear @user - Clear user warnings',
            '.warnings clear all - Clear all warnings',
            '.mute <minutes> - Mute group temporarily',
            '.lockdown - Lock/unlock group',
            '.report - Report message to WhatsApp'
        ],
        
        messagingSection: '\n┌─ 💬 MESSAGING & TAGS\n│',
        messaging: [
            '.tagall <message> - Tag all members',
            '.tagnotadmin <message> - Tag non-admins',
            '.tagadmin <message> - Tag admins only',
            '.hidetag <message> - Hidden tag all',
            '.delall - Delete all bot messages',
            '.newsletter <message> - Send newsletter'
        ],
        
        groupSection: '\n┌─ ⚙️ GROUP SETTINGS\n│',
        group: [
            '.setgname <name> - Change group name',
            '.setgdesc <description> - Change group description',
            '.resetlink - Reset group invite link',
            '.groupinfo - Show group information',
            '.staff - List all group admins'
        ],
        
        protectionSection: '\n┌─ 🛡️ PROTECTION\n│',
        protection: [
            '.antilink <on/off> - Toggle link protection',
            '.antidelete <on/off> - Toggle delete protection',
            '.welcome <on/off> - Toggle welcome messages'
        ],
        
        footer: '\n└─────────────────────────\n\n💡 All commands require admin privileges\n📱 Use in groups only\n\n🔹 Type .menu for all commands'
    },
    it: {
        title: '╔═══════════════════════════╗\n║   👮 COMANDI ADMIN   ║\n╚═══════════════════════════╝',
        
        memberSection: '\n┌─ 👤 GESTIONE MEMBRI\n│',
        member: [
            '.add <numero> - Aggiungi membro al gruppo',
            '.kick @utente - Rimuovi utente dal gruppo',
            '.ban @utente - Banna utente permanentemente',
            '.promote @utente - Rendi utente admin',
            '.demote @utente - Rimuovi privilegi admin'
        ],
        
        moderationSection: '\n┌─ ⚖️ MODERAZIONE\n│',
        moderation: [
            '.warn @utente <motivo> - Avvisa un utente',
            '.warn all <motivo> - Avvisa tutti',
            '.warnings @utente - Controlla avvisi utente',
            '.warnings clear @utente - Cancella avvisi utente',
            '.warnings clear all - Cancella tutti gli avvisi',
            '.mute <minuti> - Muta gruppo temporaneamente',
            '.lockdown - Blocca/sblocca gruppo',
            '.report - Segnala messaggio a WhatsApp'
        ],
        
        messagingSection: '\n┌─ 💬 MESSAGGI & TAG\n│',
        messaging: [
            '.tagall <messaggio> - Tagga tutti i membri',
            '.tagnotadmin <messaggio> - Tagga non-admin',
            '.tagadmin <messaggio> - Tagga solo admin',
            '.hidetag <messaggio> - Tag nascosto a tutti',
            '.delall - Elimina tutti i messaggi bot',
            '.newsletter <messaggio> - Invia newsletter'
        ],
        
        groupSection: '\n┌─ ⚙️ IMPOSTAZIONI GRUPPO\n│',
        group: [
            '.setgname <nome> - Cambia nome gruppo',
            '.setgdesc <descrizione> - Cambia descrizione gruppo',
            '.resetlink - Resetta link invito gruppo',
            '.groupinfo - Mostra informazioni gruppo',
            '.staff - Elenca tutti gli admin del gruppo'
        ],
        
        protectionSection: '\n┌─ 🛡️ PROTEZIONE\n│',
        protection: [
            '.antilink <on/off> - Attiva/disattiva protezione link',
            '.antidelete <on/off> - Attiva/disattiva protezione eliminazione',
            '.welcome <on/off> - Attiva/disattiva messaggi benvenuto'
        ],
        
        footer: '\n└─────────────────────────\n\n💡 Tutti i comandi richiedono privilegi admin\n📱 Usa solo nei gruppi\n\n🔹 Digita .menu per tutti i comandi'
    },
    ru: {
        title: '╔═══════════════════════════╗\n║   👮 КОМАНДЫ АДМИНА   ║\n╚═══════════════════════════╝',
        
        memberSection: '\n┌─ 👤 УПРАВЛЕНИЕ УЧАСТНИКАМИ\n│',
        member: [
            '.add <номер> - Добавить участника в группу',
            '.kick @пользователь - Удалить пользователя из группы',
            '.ban @пользователь - Забанить пользователя навсегда',
            '.promote @пользователь - Сделать пользователя админом',
            '.demote @пользователь - Убрать права админа'
        ],
        
        moderationSection: '\n┌─ ⚖️ МОДЕРАЦИЯ\n│',
        moderation: [
            '.warn @пользователь <причина> - Предупредить пользователя',
            '.warn all <причина> - Предупредить всех',
            '.warnings @пользователь - Проверить предупреждения',
            '.warnings clear @пользователь - Очистить предупреждения',
            '.warnings clear all - Очистить все предупреждения',
            '.mute <минуты> - Заглушить группу временно',
            '.lockdown - Заблокировать/разблокировать группу',
            '.report - Пожаловаться на сообщение в WhatsApp'
        ],
        
        messagingSection: '\n┌─ 💬 СООБЩЕНИЯ И ТЕГИ\n│',
        messaging: [
            '.tagall <сообщение> - Отметить всех участников',
            '.tagnotadmin <сообщение> - Отметить не-админов',
            '.tagadmin <сообщение> - Отметить только админов',
            '.hidetag <сообщение> - Скрытая отметка всех',
            '.delall - Удалить все сообщения бота',
            '.newsletter <сообщение> - Отправить рассылку'
        ],
        
        groupSection: '\n┌─ ⚙️ НАСТРОЙКИ ГРУППЫ\n│',
        group: [
            '.setgname <имя> - Изменить имя группы',
            '.setgdesc <описание> - Изменить описание группы',
            '.resetlink - Сбросить ссылку-приглашение',
            '.groupinfo - Показать информацию о группе',
            '.staff - Список всех админов группы'
        ],
        
        protectionSection: '\n┌─ 🛡️ ЗАЩИТА\n│',
        protection: [
            '.antilink <on/off> - Вкл/выкл защиту от ссылок',
            '.antidelete <on/off> - Вкл/выкл защиту от удаления',
            '.welcome <on/off> - Вкл/выкл приветственные сообщения'
        ],
        
        footer: '\n└─────────────────────────\n\n💡 Все команды требуют прав админа\n📱 Используйте только в группах\n\n🔹 Введите .menu для всех команд'
    },
    es: {
        title: '╔═══════════════════════════╗\n║   👮 COMANDOS ADMIN   ║\n╚═══════════════════════════╝',
        
        memberSection: '\n┌─ 👤 GESTIÓN DE MIEMBROS\n│',
        member: [
            '.add <número> - Agregar miembro al grupo',
            '.kick @usuario - Eliminar usuario del grupo',
            '.ban @usuario - Banear usuario permanentemente',
            '.promote @usuario - Hacer usuario admin',
            '.demote @usuario - Quitar privilegios admin'
        ],
        
        moderationSection: '\n┌─ ⚖️ MODERACIÓN\n│',
        moderation: [
            '.warn @usuario <razón> - Advertir a un usuario',
            '.warn all <razón> - Advertir a todos',
            '.warnings @usuario - Verificar advertencias',
            '.warnings clear @usuario - Limpiar advertencias',
            '.warnings clear all - Limpiar todas las advertencias',
            '.mute <minutos> - Silenciar grupo temporalmente',
            '.lockdown - Bloquear/desbloquear grupo',
            '.report - Reportar mensaje a WhatsApp'
        ],
        
        messagingSection: '\n┌─ 💬 MENSAJES Y ETIQUETAS\n│',
        messaging: [
            '.tagall <mensaje> - Etiquetar todos los miembros',
            '.tagnotadmin <mensaje> - Etiquetar no-admins',
            '.tagadmin <mensaje> - Etiquetar solo admins',
            '.hidetag <mensaje> - Etiqueta oculta a todos',
            '.delall - Eliminar todos los mensajes del bot',
            '.newsletter <mensaje> - Enviar boletín'
        ],
        
        groupSection: '\n┌─ ⚙️ CONFIGURACIÓN GRUPO\n│',
        group: [
            '.setgname <nombre> - Cambiar nombre del grupo',
            '.setgdesc <descripción> - Cambiar descripción del grupo',
            '.resetlink - Restablecer enlace de invitación',
            '.groupinfo - Mostrar información del grupo',
            '.staff - Listar todos los admins del grupo'
        ],
        
        protectionSection: '\n┌─ 🛡️ PROTECCIÓN\n│',
        protection: [
            '.antilink <on/off> - Activar/desactivar protección de enlaces',
            '.antidelete <on/off> - Activar/desactivar protección de eliminación',
            '.welcome <on/off> - Activar/desactivar mensajes de bienvenida'
        ],
        
        footer: '\n└─────────────────────────\n\n💡 Todos los comandos requieren privilegios admin\n📱 Usar solo en grupos\n\n🔹 Escribe .menu para todos los comandos'
    },
    pt: {
        title: '╔═══════════════════════════╗\n║   👮 COMANDOS ADMIN   ║\n╚═══════════════════════════╝',
        
        memberSection: '\n┌─ 👤 GESTÃO DE MEMBROS\n│',
        member: [
            '.add <número> - Adicionar membro ao grupo',
            '.kick @usuário - Remover usuário do grupo',
            '.ban @usuário - Banir usuário permanentemente',
            '.promote @usuário - Tornar usuário admin',
            '.demote @usuário - Remover privilégios admin'
        ],
        
        moderationSection: '\n┌─ ⚖️ MODERAÇÃO\n│',
        moderation: [
            '.warn @usuário <motivo> - Advertir um usuário',
            '.warn all <motivo> - Advertir todos',
            '.warnings @usuário - Verificar advertências',
            '.warnings clear @usuário - Limpar advertências',
            '.warnings clear all - Limpar todas as advertências',
            '.mute <minutos> - Silenciar grupo temporariamente',
            '.lockdown - Bloquear/desbloquear grupo',
            '.report - Reportar mensagem ao WhatsApp'
        ],
        
        messagingSection: '\n┌─ 💬 MENSAGENS E TAGS\n│',
        messaging: [
            '.tagall <mensagem> - Marcar todos os membros',
            '.tagnotadmin <mensagem> - Marcar não-admins',
            '.tagadmin <mensagem> - Marcar apenas admins',
            '.hidetag <mensagem> - Tag oculta para todos',
            '.delall - Deletar todas as mensagens do bot',
            '.newsletter <mensagem> - Enviar newsletter'
        ],
        
        groupSection: '\n┌─ ⚙️ CONFIGURAÇÕES GRUPO\n│',
        group: [
            '.setgname <nome> - Mudar nome do grupo',
            '.setgdesc <descrição> - Mudar descrição do grupo',
            '.resetlink - Resetar link de convite',
            '.groupinfo - Mostrar informações do grupo',
            '.staff - Listar todos os admins do grupo'
        ],
        
        protectionSection: '\n┌─ 🛡️ PROTEÇÃO\n│',
        protection: [
            '.antilink <on/off> - Ativar/desativar proteção de links',
            '.antidelete <on/off> - Ativar/desativar proteção de exclusão',
            '.welcome <on/off> - Ativar/desativar mensagens de boas-vindas'
        ],
        
        footer: '\n└─────────────────────────\n\n💡 Todos os comandos requerem privilégios admin\n📱 Use apenas em grupos\n\n🔹 Digite .menu para todos os comandos'
    },
    ar: {
        title: '╔═══════════════════════════╗\n║   👮 أوامر الأدمن   ║\n╚═══════════════════════════╝',
        
        memberSection: '\n┌─ 👤 إدارة الأعضاء\n│',
        member: [
            '.add <رقم> - إضافة عضو للمجموعة',
            '.kick @مستخدم - إزالة مستخدم من المجموعة',
            '.ban @مستخدم - حظر مستخدم نهائياً',
            '.promote @مستخدم - جعل المستخدم أدمن',
            '.demote @مستخدم - إزالة صلاحيات الأدمن'
        ],
        
        moderationSection: '\n┌─ ⚖️ الإشراف\n│',
        moderation: [
            '.warn @مستخدم <سبب> - تحذير مستخدم',
            '.warn all <سبب> - تحذير الجميع',
            '.warnings @مستخدم - فحص التحذيرات',
            '.warnings clear @مستخدم - مسح تحذيرات المستخدم',
            '.warnings clear all - مسح كل التحذيرات',
            '.mute <دقائق> - كتم المجموعة مؤقتاً',
            '.lockdown - قفل/فتح المجموعة',
            '.report - الإبلاغ عن رسالة لواتساب'
        ],
        
        messagingSection: '\n┌─ 💬 الرسائل والإشارات\n│',
        messaging: [
            '.tagall <رسالة> - الإشارة لجميع الأعضاء',
            '.tagnotadmin <رسالة> - الإشارة لغير الأدمنز',
            '.tagadmin <رسالة> - الإشارة للأدمنز فقط',
            '.hidetag <رسالة> - إشارة مخفية للجميع',
            '.delall - حذف جميع رسائل البوت',
            '.newsletter <رسالة> - إرسال نشرة إخبارية'
        ],
        
        groupSection: '\n┌─ ⚙️ إعدادات المجموعة\n│',
        group: [
            '.setgname <اسم> - تغيير اسم المجموعة',
            '.setgdesc <وصف> - تغيير وصف المجموعة',
            '.resetlink - إعادة تعيين رابط الدعوة',
            '.groupinfo - عرض معلومات المجموعة',
            '.staff - قائمة جميع أدمنز المجموعة'
        ],
        
        protectionSection: '\n┌─ 🛡️ الحماية\n│',
        protection: [
            '.antilink <on/off> - تفعيل/تعطيل حماية الروابط',
            '.antidelete <on/off> - تفعيل/تعطيل حماية الحذف',
            '.welcome <on/off> - تفعيل/تعطيل رسائل الترحيب'
        ],
        
        footer: '\n└─────────────────────────\n\n💡 جميع الأوامر تتطلب صلاحيات أدمن\n📱 استخدم في المجموعات فقط\n\n🔹 اكتب .menu لجميع الأوامر'
    },
    hi: {
        title: '╔═══════════════════════════╗\n║   👮 एडमिन कमांड   ║\n╚═══════════════════════════╝',
        
        memberSection: '\n┌─ 👤 मेंबर मैनेजमेंट\n│',
        member: [
            '.add <नंबर> - ग्रुप में मेंबर जोड़ें',
            '.kick @यूजर - ग्रुप से यूजर हटाएं',
            '.ban @यूजर - यूजर को परमानेंटली बैन करें',
            '.promote @यूजर - यूजर को एडमिन बनाएं',
            '.demote @यूजर - एडमिन अधिकार हटाएं'
        ],
        
        moderationSection: '\n┌─ ⚖️ मॉडरेशन\n│',
        moderation: [
            '.warn @यूजर <कारण> - यूजर को चेतावनी दें',
            '.warn all <कारण> - सभी को चेतावनी दें',
            '.warnings @यूजर - यूजर की चेतावनियां चेक करें',
            '.warnings clear @यूजर - यूजर की चेतावनियां साफ करें',
            '.warnings clear all - सभी चेतावनियां साफ करें',
            '.mute <मिनट> - ग्रुप को अस्थायी रूप से म्यूट करें',
            '.lockdown - ग्रुप को लॉक/अनलॉक करें',
            '.report - WhatsApp को मैसेज रिपोर्ट करें'
        ],
        
        messagingSection: '\n┌─ 💬 मैसेजिंग और टैग\n│',
        messaging: [
            '.tagall <मैसेज> - सभी मेंबर्स को टैग करें',
            '.tagnotadmin <मैसेज> - नॉन-एडमिन को टैग करें',
            '.tagadmin <मैसेज> - केवल एडमिन को टैग करें',
            '.hidetag <मैसेज> - सभी को हिडन टैग करें',
            '.delall - सभी बॉट मैसेज डिलीट करें',
            '.newsletter <मैसेज> - न्यूज़लेटर भेजें'
        ],
        
        groupSection: '\n┌─ ⚙️ ग्रुप सेटिंग्स\n│',
        group: [
            '.setgname <नाम> - ग्रुप का नाम बदलें',
            '.setgdesc <विवरण> - ग्रुप का विवरण बदलें',
            '.resetlink - ग्रुप इनवाइट लिंक रीसेट करें',
            '.groupinfo - ग्रुप की जानकारी दिखाएं',
            '.staff - सभी ग्रुप एडमिन की सूची'
        ],
        
        protectionSection: '\n┌─ 🛡️ सुरक्षा\n│',
        protection: [
            '.antilink <on/off> - लिंक प्रोटेक्शन टॉगल करें',
            '.antidelete <on/off> - डिलीट प्रोटेक्शन टॉगल करें',
            '.welcome <on/off> - वेलकम मैसेज टॉगल करें'
        ],
        
        footer: '\n└─────────────────────────\n\n💡 सभी कमांड के लिए एडमिन अधिकार चाहिए\n📱 केवल ग्रुप में उपयोग करें\n\n🔹 सभी कमांड के लिए .menu टाइप करें'
    }
};

export default {
    name: 'admin',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        let text = t.title;
        
        // Member Management
        text += t.memberSection;
        t.member.forEach(cmd => {
            text += `\n│ ${cmd}`;
        });
        
        // Moderation
        text += `\n${t.moderationSection}`;
        t.moderation.forEach(cmd => {
            text += `\n│ ${cmd}`;
        });
        
        // Messaging & Tags
        text += `\n${t.messagingSection}`;
        t.messaging.forEach(cmd => {
            text += `\n│ ${cmd}`;
        });
        
        // Group Settings
        text += `\n${t.groupSection}`;
        t.group.forEach(cmd => {
            text += `\n│ ${cmd}`;
        });
        
        // Protection
        text += `\n${t.protectionSection}`;
        t.protection.forEach(cmd => {
            text += `\n│ ${cmd}`;
        });
        
        text += t.footer;
        
        await sendAsChannelForward(sock, from, text, {
            quoted: msg,
            newsletterName: config.botName || 'Admin Commands'
        });
    }
};
