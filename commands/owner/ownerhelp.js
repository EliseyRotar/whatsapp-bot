import { getGroupLanguage } from '../../utils/language.js';
import { sendAsChannelForward } from '../../utils/fakeForward.js';
import { config } from '../../config.js';

const responses = {
    en: {
        title: '╔═══════════════════════════╗\n║   👑 OWNER COMMANDS   ║\n╚═══════════════════════════╝\n\n',
        description: '🔐 These commands are only available to bot owners.\n\n',
        categories: {
            management: '📋 Management:\n',
            control: '⚙️ Control:\n',
            moderation: '🛡️ Moderation:\n',
            utility: '🔧 Utility:\n'
        },
        commands: {
            addowner: '• .addowner - Add a new bot owner',
            removeowner: '• .removeowner - Remove a bot owner',
            listowners: '• .listowners - List all bot owners',
            manage: '• .manage - Manage bot settings',
            mode: '• .mode - Change bot mode (public/private)',
            autovv: '• .autovv - Toggle auto view-once',
            debug: '• .debug - Debug bot information',
            broadcast: '• .broadcast - Send message to all groups',
            spam: '• .spam - Spam messages (testing)',
            raid: '• .raid - Raid mode controls',
            newsletterconfig: '• .newsletterconfig - Configure newsletter',
            addall: '• .addall - Add all group members',
            roball: '• .roball - Rob all users',
            ownerhelp: '• .ownerhelp - Show this help menu'
        },
        footer: '\n💡 Use these commands responsibly!'
    },
    it: {
        title: '╔═══════════════════════════╗\n║   👑 COMANDI PROPRIETARIO   ║\n╚═══════════════════════════╝\n\n',
        description: '🔐 Questi comandi sono disponibili solo per i proprietari del bot.\n\n',
        categories: {
            management: '📋 Gestione:\n',
            control: '⚙️ Controllo:\n',
            moderation: '🛡️ Moderazione:\n',
            utility: '🔧 Utilità:\n'
        },
        commands: {
            addowner: '• .addowner - Aggiungi un nuovo proprietario',
            removeowner: '• .removeowner - Rimuovi un proprietario',
            listowners: '• .listowners - Elenca tutti i proprietari',
            manage: '• .manage - Gestisci impostazioni bot',
            mode: '• .mode - Cambia modalità bot (pubblico/privato)',
            autovv: '• .autovv - Attiva/disattiva auto view-once',
            debug: '• .debug - Informazioni di debug',
            broadcast: '• .broadcast - Invia messaggio a tutti i gruppi',
            spam: '• .spam - Spam messaggi (test)',
            raid: '• .raid - Controlli modalità raid',
            newsletterconfig: '• .newsletterconfig - Configura newsletter',
            addall: '• .addall - Aggiungi tutti i membri del gruppo',
            roball: '• .roball - Ruba a tutti gli utenti',
            ownerhelp: '• .ownerhelp - Mostra questo menu di aiuto'
        },
        footer: '\n💡 Usa questi comandi responsabilmente!'
    },
    ru: {
        title: '╔═══════════════════════════╗\n║   👑 КОМАНДЫ ВЛАДЕЛЬЦА   ║\n╚═══════════════════════════╝\n\n',
        description: '🔐 Эти команды доступны только владельцам бота.\n\n',
        categories: {
            management: '📋 Управление:\n',
            control: '⚙️ Контроль:\n',
            moderation: '🛡️ Модерация:\n',
            utility: '🔧 Утилиты:\n'
        },
        commands: {
            addowner: '• .addowner - Добавить нового владельца',
            removeowner: '• .removeowner - Удалить владельца',
            listowners: '• .listowners - Список всех владельцев',
            manage: '• .manage - Управление настройками бота',
            mode: '• .mode - Изменить режим бота (публичный/приватный)',
            autovv: '• .autovv - Переключить авто просмотр один раз',
            debug: '• .debug - Отладочная информация',
            broadcast: '• .broadcast - Отправить сообщение во все группы',
            spam: '• .spam - Спам сообщений (тест)',
            raid: '• .raid - Управление режимом рейда',
            newsletterconfig: '• .newsletterconfig - Настроить рассылку',
            addall: '• .addall - Добавить всех участников группы',
            roball: '• .roball - Ограбить всех пользователей',
            ownerhelp: '• .ownerhelp - Показать это меню помощи'
        },
        footer: '\n💡 Используйте эти команды ответственно!'
    },
    es: {
        title: '╔═══════════════════════════╗\n║   👑 COMANDOS DE PROPIETARIO   ║\n╚═══════════════════════════╝\n\n',
        description: '🔐 Estos comandos solo están disponibles para los propietarios del bot.\n\n',
        categories: {
            management: '📋 Gestión:\n',
            control: '⚙️ Control:\n',
            moderation: '🛡️ Moderación:\n',
            utility: '🔧 Utilidad:\n'
        },
        commands: {
            addowner: '• .addowner - Agregar nuevo propietario',
            removeowner: '• .removeowner - Eliminar propietario',
            listowners: '• .listowners - Listar todos los propietarios',
            manage: '• .manage - Gestionar configuración del bot',
            mode: '• .mode - Cambiar modo del bot (público/privado)',
            autovv: '• .autovv - Alternar auto ver una vez',
            debug: '• .debug - Información de depuración',
            broadcast: '• .broadcast - Enviar mensaje a todos los grupos',
            spam: '• .spam - Spam de mensajes (prueba)',
            raid: '• .raid - Controles de modo raid',
            newsletterconfig: '• .newsletterconfig - Configurar boletín',
            addall: '• .addall - Agregar todos los miembros del grupo',
            roball: '• .roball - Robar a todos los usuarios',
            ownerhelp: '• .ownerhelp - Mostrar este menú de ayuda'
        },
        footer: '\n💡 ¡Usa estos comandos responsablemente!'
    },
    pt: {
        title: '╔═══════════════════════════╗\n║   👑 COMANDOS DO PROPRIETÁRIO   ║\n╚═══════════════════════════╝\n\n',
        description: '🔐 Estes comandos estão disponíveis apenas para proprietários do bot.\n\n',
        categories: {
            management: '📋 Gestão:\n',
            control: '⚙️ Controle:\n',
            moderation: '🛡️ Moderação:\n',
            utility: '🔧 Utilidade:\n'
        },
        commands: {
            addowner: '• .addowner - Adicionar novo proprietário',
            removeowner: '• .removeowner - Remover proprietário',
            listowners: '• .listowners - Listar todos os proprietários',
            manage: '• .manage - Gerenciar configurações do bot',
            mode: '• .mode - Mudar modo do bot (público/privado)',
            autovv: '• .autovv - Alternar auto visualização única',
            debug: '• .debug - Informações de depuração',
            broadcast: '• .broadcast - Enviar mensagem para todos os grupos',
            spam: '• .spam - Spam de mensagens (teste)',
            raid: '• .raid - Controles de modo raid',
            newsletterconfig: '• .newsletterconfig - Configurar boletim',
            addall: '• .addall - Adicionar todos os membros do grupo',
            roball: '• .roball - Roubar de todos os usuários',
            ownerhelp: '• .ownerhelp - Mostrar este menu de ajuda'
        },
        footer: '\n💡 Use estes comandos com responsabilidade!'
    },
    ar: {
        title: '╔═══════════════════════════╗\n║   👑 أوامر المالك   ║\n╚═══════════════════════════╝\n\n',
        description: '🔐 الأوامر دي متاحة بس لمالكين البوت.\n\n',
        categories: {
            management: '📋 الإدارة:\n',
            control: '⚙️ التحكم:\n',
            moderation: '🛡️ الإشراف:\n',
            utility: '🔧 الأدوات:\n'
        },
        commands: {
            addowner: '• .addowner - إضافة مالك جديد',
            removeowner: '• .removeowner - إزالة مالك',
            listowners: '• .listowners - عرض كل المالكين',
            manage: '• .manage - إدارة إعدادات البوت',
            mode: '• .mode - تغيير وضع البوت (عام/خاص)',
            autovv: '• .autovv - تفعيل/إلغاء العرض التلقائي',
            debug: '• .debug - معلومات التصحيح',
            broadcast: '• .broadcast - إرسال رسالة لكل المجموعات',
            spam: '• .spam - إرسال رسائل متكررة (اختبار)',
            raid: '• .raid - التحكم في وضع الهجوم',
            newsletterconfig: '• .newsletterconfig - إعداد النشرة الإخبارية',
            addall: '• .addall - إضافة كل أعضاء المجموعة',
            roball: '• .roball - سرقة كل المستخدمين',
            ownerhelp: '• .ownerhelp - عرض قائمة المساعدة دي'
        },
        footer: '\n💡 استخدم الأوامر دي بمسؤولية!'
    },
    hi: {
        title: '╔═══════════════════════════╗\n║   👑 ओनर कमांड   ║\n╚═══════════════════════════╝\n\n',
        description: '🔐 ये कमांड केवल बॉट ओनर के लिए उपलब्ध हैं।\n\n',
        categories: {
            management: '📋 मैनेजमेंट:\n',
            control: '⚙️ कंट्रोल:\n',
            moderation: '🛡️ मॉडरेशन:\n',
            utility: '🔧 यूटिलिटी:\n'
        },
        commands: {
            addowner: '• .addowner - नया ओनर जोड़ें',
            removeowner: '• .removeowner - ओनर हटाएं',
            listowners: '• .listowners - सभी ओनर की लिस्ट',
            manage: '• .manage - बॉट सेटिंग्स मैनेज करें',
            mode: '• .mode - बॉट मोड बदलें (पब्लिक/प्राइवेट)',
            autovv: '• .autovv - ऑटो व्यू-वन्स टॉगल करें',
            debug: '• .debug - डीबग जानकारी',
            broadcast: '• .broadcast - सभी ग्रुप में मैसेज भेजें',
            spam: '• .spam - स्पैम मैसेज (टेस्टिंग)',
            raid: '• .raid - रेड मोड कंट्रोल',
            newsletterconfig: '• .newsletterconfig - न्यूज़लेटर कॉन्फ़िगर करें',
            addall: '• .addall - सभी ग्रुप मेंबर जोड़ें',
            roball: '• .roball - सभी यूज़र को लूटें',
            ownerhelp: '• .ownerhelp - यह हेल्प मेनू दिखाएं'
        },
        footer: '\n💡 इन कमांड का जिम्मेदारी से उपयोग करें!'
    }
};

export default {
    name: 'ownerhelp',
    ownerOnly: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        try {
            let helpText = t.title;
            helpText += t.description;
            
            // Management commands
            helpText += t.categories.management;
            helpText += t.commands.addowner + '\n';
            helpText += t.commands.removeowner + '\n';
            helpText += t.commands.listowners + '\n';
            helpText += t.commands.manage + '\n\n';
            
            // Control commands
            helpText += t.categories.control;
            helpText += t.commands.mode + '\n';
            helpText += t.commands.autovv + '\n';
            helpText += t.commands.debug + '\n\n';
            
            // Moderation commands
            helpText += t.categories.moderation;
            helpText += t.commands.broadcast + '\n';
            helpText += t.commands.spam + '\n';
            helpText += t.commands.raid + '\n\n';
            
            // Utility commands
            helpText += t.categories.utility;
            helpText += t.commands.newsletterconfig + '\n';
            helpText += t.commands.addall + '\n';
            helpText += t.commands.roball + '\n';
            helpText += t.commands.ownerhelp + '\n';
            
            helpText += t.footer;
            
            await sendAsChannelForward(sock, from, helpText, {
                quoted: msg,
                newsletterName: config.botName || 'Owner Commands'
            });
            
        } catch (error) {
            console.error('Error displaying owner help:', error);
            await sock.sendMessage(from, { 
                text: `❌ Error displaying owner commands: ${error.message}`
            });
        }
    }
};
