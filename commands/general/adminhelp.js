import { config } from '../../config.js';
import { getGroupLanguage } from '../../utils/language.js';
import { sendAsChannelForward } from '../../utils/fakeForward.js';

const responses = {
    en: {
        title: `╔═══════════════════════════╗
║   👮 ADMIN COMMANDS   ║
╚═══════════════════════════╝

Commands for group administrators:`,
        moderation: `
┌─ 👮 MODERATION
│  ${config.prefix}ban - Remove and ban user
│  ${config.prefix}kick - Remove user from group
│  ${config.prefix}warn @user <reason> - Warn a user
│  ${config.prefix}warnings - Check user warnings
│  ${config.prefix}warnings clear @user - Clear warnings
│  ${config.prefix}mute <minutes> - Mute group temporarily
│  ${config.prefix}lockdown <on/off> - Lock group (admins only)`,
        management: `
┌─ ⚙️ GROUP MANAGEMENT
│  ${config.prefix}promote @user - Make user admin
│  ${config.prefix}demote @user - Remove admin rights
│  ${config.prefix}setgname <name> - Change group name
│  ${config.prefix}setgdesc <desc> - Change group description
│  ${config.prefix}resetlink - Reset group invite link
│  ${config.prefix}groupinfo - View group information
│  ${config.prefix}staff - List all admins`,
        messaging: `
┌─ 📢 MESSAGING
│  ${config.prefix}tagall <message> - Tag all members
│  ${config.prefix}tagnotadmin <msg> - Tag non-admins
│  ${config.prefix}hidetag <message> - Hidden tag all`,
        security: `
┌─ 🔒 SECURITY
│  ${config.prefix}antilink <on/off> - Block group links
│  ${config.prefix}welcome <on/off> - Welcome messages`,
        footer: `
━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Most commands require admin rights
🤖 Bot must be admin for some features
📋 Type ${config.prefix}menu for all commands`
    },
    it: {
        title: `╔═══════════════════════════╗
║   👮 COMANDI ADMIN   ║
╚═══════════════════════════╝

Comandi per amministratori di gruppo:`,
        moderation: `
┌─ 👮 MODERAZIONE
│  ${config.prefix}ban - Rimuovi e banna utente
│  ${config.prefix}kick - Rimuovi utente dal gruppo
│  ${config.prefix}warn @utente <motivo> - Avvisa un utente
│  ${config.prefix}warnings - Controlla avvisi utente
│  ${config.prefix}warnings clear @utente - Cancella avvisi
│  ${config.prefix}mute <minuti> - Silenzia gruppo temporaneamente
│  ${config.prefix}lockdown <on/off> - Blocca gruppo (solo admin)`,
        management: `
┌─ ⚙️ GESTIONE GRUPPO
│  ${config.prefix}promote @utente - Rendi utente admin
│  ${config.prefix}demote @utente - Rimuovi diritti admin
│  ${config.prefix}setgname <nome> - Cambia nome gruppo
│  ${config.prefix}setgdesc <desc> - Cambia descrizione gruppo
│  ${config.prefix}resetlink - Resetta link invito gruppo
│  ${config.prefix}groupinfo - Visualizza info gruppo
│  ${config.prefix}staff - Elenca tutti gli admin`,
        messaging: `
┌─ 📢 MESSAGGISTICA
│  ${config.prefix}tagall <messaggio> - Tagga tutti i membri
│  ${config.prefix}tagnotadmin <msg> - Tagga non-admin
│  ${config.prefix}hidetag <messaggio> - Tag nascosto a tutti`,
        security: `
┌─ 🔒 SICUREZZA
│  ${config.prefix}antilink <on/off> - Blocca link gruppi
│  ${config.prefix}welcome <on/off> - Messaggi benvenuto`,
        footer: `
━━━━━━━━━━━━━━━━━━━━━━━━━
💡 La maggior parte dei comandi richiede diritti admin
🤖 Il bot deve essere admin per alcune funzioni
📋 Scrivi ${config.prefix}menu per tutti i comandi`
    },
    ru: {
        title: `╔═══════════════════════════╗
║   👮 КОМАНДЫ АДМИНА   ║
╚═══════════════════════════╝

Команды для администраторов группы:`,
        moderation: `
┌─ 👮 МОДЕРАЦИЯ
│  ${config.prefix}ban - Удалить и забанить пользователя
│  ${config.prefix}kick - Удалить пользователя из группы
│  ${config.prefix}warn @пользователь <причина> - Предупредить пользователя
│  ${config.prefix}warnings - Проверить предупреждения пользователя
│  ${config.prefix}warnings clear @пользователь - Очистить предупреждения
│  ${config.prefix}mute <минуты> - Заглушить группу временно
│  ${config.prefix}lockdown <on/off> - Заблокировать группу (только админы)`,
        management: `
┌─ ⚙️ УПРАВЛЕНИЕ ГРУППОЙ
│  ${config.prefix}promote @пользователь - Сделать пользователя админом
│  ${config.prefix}demote @пользователь - Убрать права админа
│  ${config.prefix}setgname <имя> - Изменить название группы
│  ${config.prefix}setgdesc <описание> - Изменить описание группы
│  ${config.prefix}resetlink - Сбросить ссылку-приглашение группы
│  ${config.prefix}groupinfo - Просмотреть информацию о группе
│  ${config.prefix}staff - Список всех админов`,
        messaging: `
┌─ 📢 СООБЩЕНИЯ
│  ${config.prefix}tagall <сообщение> - Отметить всех участников
│  ${config.prefix}tagnotadmin <сообщение> - Отметить не-админов
│  ${config.prefix}hidetag <сообщение> - Скрытая отметка всех`,
        security: `
┌─ 🔒 БЕЗОПАСНОСТЬ
│  ${config.prefix}antilink <on/off> - Блокировать ссылки на группы
│  ${config.prefix}welcome <on/off> - Приветственные сообщения`,
        footer: `
━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Большинство команд требуют прав администратора
🤖 Бот должен быть админом для некоторых функций
📋 Введите ${config.prefix}menu для всех команд`
    },
    es: {
        title: `╔═══════════════════════════╗
║   👮 COMANDOS ADMIN   ║
╚═══════════════════════════╝

Comandos para administradores de grupo:`,
        moderation: `
┌─ 👮 MODERACIÓN
│  ${config.prefix}ban - Eliminar y banear usuario
│  ${config.prefix}kick - Eliminar usuario del grupo
│  ${config.prefix}warn @usuario <razón> - Advertir a un usuario
│  ${config.prefix}warnings - Verificar advertencias de usuario
│  ${config.prefix}warnings clear @usuario - Limpiar advertencias
│  ${config.prefix}mute <minutos> - Silenciar grupo temporalmente
│  ${config.prefix}lockdown <on/off> - Bloquear grupo (solo admins)`,
        management: `
┌─ ⚙️ GESTIÓN DE GRUPO
│  ${config.prefix}promote @usuario - Hacer usuario admin
│  ${config.prefix}demote @usuario - Quitar derechos de admin
│  ${config.prefix}setgname <nombre> - Cambiar nombre del grupo
│  ${config.prefix}setgdesc <desc> - Cambiar descripción del grupo
│  ${config.prefix}resetlink - Restablecer enlace de invitación
│  ${config.prefix}groupinfo - Ver información del grupo
│  ${config.prefix}staff - Listar todos los admins`,
        messaging: `
┌─ 📢 MENSAJERÍA
│  ${config.prefix}tagall <mensaje> - Etiquetar todos los miembros
│  ${config.prefix}tagnotadmin <msg> - Etiquetar no-admins
│  ${config.prefix}hidetag <mensaje> - Etiqueta oculta a todos`,
        security: `
┌─ 🔒 SEGURIDAD
│  ${config.prefix}antilink <on/off> - Bloquear enlaces de grupos
│  ${config.prefix}welcome <on/off> - Mensajes de bienvenida`,
        footer: `
━━━━━━━━━━━━━━━━━━━━━━━━━
💡 La mayoría de comandos requieren derechos de admin
🤖 El bot debe ser admin para algunas funciones
📋 Escribe ${config.prefix}menu para todos los comandos`
    },
    pt: {
        title: `╔═══════════════════════════╗
║   👮 COMANDOS ADMIN   ║
╚═══════════════════════════╝

Comandos para administradores de grupo:`,
        moderation: `
┌─ 👮 MODERAÇÃO
│  ${config.prefix}ban - Remover e banir usuário
│  ${config.prefix}kick - Remover usuário do grupo
│  ${config.prefix}warn @usuário <razão> - Avisar um usuário
│  ${config.prefix}warnings - Verificar avisos de usuário
│  ${config.prefix}warnings clear @usuário - Limpar avisos
│  ${config.prefix}mute <minutos> - Silenciar grupo temporariamente
│  ${config.prefix}lockdown <on/off> - Bloquear grupo (apenas admins)`,
        management: `
┌─ ⚙️ GERENCIAMENTO DE GRUPO
│  ${config.prefix}promote @usuário - Tornar usuário admin
│  ${config.prefix}demote @usuário - Remover direitos de admin
│  ${config.prefix}setgname <nome> - Mudar nome do grupo
│  ${config.prefix}setgdesc <desc> - Mudar descrição do grupo
│  ${config.prefix}resetlink - Redefinir link de convite
│  ${config.prefix}groupinfo - Ver informações do grupo
│  ${config.prefix}staff - Listar todos os admins`,
        messaging: `
┌─ 📢 MENSAGENS
│  ${config.prefix}tagall <mensagem> - Marcar todos os membros
│  ${config.prefix}tagnotadmin <msg> - Marcar não-admins
│  ${config.prefix}hidetag <mensagem> - Marca oculta para todos`,
        security: `
┌─ 🔒 SEGURANÇA
│  ${config.prefix}antilink <on/off> - Bloquear links de grupos
│  ${config.prefix}welcome <on/off> - Mensagens de boas-vindas`,
        footer: `
━━━━━━━━━━━━━━━━━━━━━━━━━
💡 A maioria dos comandos requer direitos de admin
🤖 O bot deve ser admin para alguns recursos
📋 Digite ${config.prefix}menu para todos os comandos`
    },
    ar: {
        title: `╔═══════════════════════════╗
║   👮 أوامر الأدمن   ║
╚═══════════════════════════╝

أوامر لمديري المجموعة:`,
        moderation: `
┌─ 👮 الإشراف
│  ${config.prefix}ban - احذف وامنع المستخدم
│  ${config.prefix}kick - احذف المستخدم من المجموعة
│  ${config.prefix}warn @مستخدم <سبب> - حذر مستخدم
│  ${config.prefix}warnings - شوف تحذيرات المستخدم
│  ${config.prefix}warnings clear @مستخدم - امسح التحذيرات
│  ${config.prefix}mute <دقائق> - اكتم المجموعة مؤقتاً
│  ${config.prefix}lockdown <on/off> - اقفل المجموعة (أدمن فقط)`,
        management: `
┌─ ⚙️ إدارة المجموعة
│  ${config.prefix}promote @مستخدم - خلي المستخدم أدمن
│  ${config.prefix}demote @مستخدم - اشيل صلاحيات الأدمن
│  ${config.prefix}setgname <اسم> - غير اسم المجموعة
│  ${config.prefix}setgdesc <وصف> - غير وصف المجموعة
│  ${config.prefix}resetlink - غير لينك الدعوة
│  ${config.prefix}groupinfo - شوف معلومات المجموعة
│  ${config.prefix}staff - اعرض كل الأدمنز`,
        messaging: `
┌─ 📢 الرسائل
│  ${config.prefix}tagall <رسالة> - منشن كل الأعضاء
│  ${config.prefix}tagnotadmin <رسالة> - منشن غير الأدمنز
│  ${config.prefix}hidetag <رسالة> - منشن مخفي للكل`,
        security: `
┌─ 🔒 الأمان
│  ${config.prefix}antilink <on/off> - امنع لينكات المجموعات
│  ${config.prefix}welcome <on/off> - رسائل الترحيب`,
        footer: `
━━━━━━━━━━━━━━━━━━━━━━━━━
💡 معظم الأوامر تحتاج صلاحيات أدمن
🤖 البوت لازم يكون أدمن لبعض الميزات
📋 اكتب ${config.prefix}menu لكل الأوامر`
    },
    hi: {
        title: `╔═══════════════════════════╗
║   👮 एडमिन कमांड   ║
╚═══════════════════════════╝

ग्रुप एडमिनिस्ट्रेटर के लिए कमांड:`,
        moderation: `
┌─ 👮 मॉडरेशन
│  ${config.prefix}ban - यूजर को हटाएं और बैन करें
│  ${config.prefix}kick - ग्रुप से यूजर हटाएं
│  ${config.prefix}warn @यूजर <कारण> - यूजर को चेतावनी दें
│  ${config.prefix}warnings - यूजर की चेतावनियां चेक करें
│  ${config.prefix}warnings clear @यूजर - चेतावनियां साफ करें
│  ${config.prefix}mute <मिनट> - ग्रुप को अस्थायी रूप से म्यूट करें
│  ${config.prefix}lockdown <on/off> - ग्रुप लॉक करें (केवल एडमिन)`,
        management: `
┌─ ⚙️ ग्रुप मैनेजमेंट
│  ${config.prefix}promote @यूजर - यूजर को एडमिन बनाएं
│  ${config.prefix}demote @यूजर - एडमिन अधिकार हटाएं
│  ${config.prefix}setgname <नाम> - ग्रुप का नाम बदलें
│  ${config.prefix}setgdesc <विवरण> - ग्रुप का विवरण बदलें
│  ${config.prefix}resetlink - ग्रुप इनवाइट लिंक रीसेट करें
│  ${config.prefix}groupinfo - ग्रुप की जानकारी देखें
│  ${config.prefix}staff - सभी एडमिन की सूची`,
        messaging: `
┌─ 📢 मैसेजिंग
│  ${config.prefix}tagall <मैसेज> - सभी मेंबर्स को टैग करें
│  ${config.prefix}tagnotadmin <मैसेज> - नॉन-एडमिन को टैग करें
│  ${config.prefix}hidetag <मैसेज> - सभी को हिडन टैग करें`,
        security: `
┌─ 🔒 सुरक्षा
│  ${config.prefix}antilink <on/off> - ग्रुप लिंक ब्लॉक करें
│  ${config.prefix}welcome <on/off> - वेलकम मैसेज`,
        footer: `
━━━━━━━━━━━━━━━━━━━━━━━━━
💡 अधिकांश कमांड के लिए एडमिन अधिकार चाहिए
🤖 कुछ फीचर्स के लिए बॉट को एडमिन होना चाहिए
📋 सभी कमांड के लिए ${config.prefix}menu टाइप करें`
    }
};

export default {
    name: 'adminhelp',
    aliases: ['admincommands', 'admincmd'],
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        const helpText = 
            t.title +
            t.moderation +
            t.management +
            t.messaging +
            t.security +
            t.footer;
        
        await sendAsChannelForward(sock, from, helpText, {
            quoted: msg,
            newsletterName: config.botName || 'Admin Commands'
        });
    }
};
