import { config } from '../../config.js';
import os from 'os';
import { getGroupLanguage } from '../../utils/language.js';
import { sendAsChannelForward } from '../../utils/fakeForward.js';

const responses = {
    en: {
        promo: '🤖 NEED A BOT FOR YOUR GROUP?\n\n💬 Text the owner or add directly:\nwa.me/393313444410\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n',
        title: `╔═══════════════════════════╗\n║   🤖 ${config.botName}   ║\n╚═══════════════════════════╝`,
        aboutTitle: 'ABOUT THIS BOT',
        aboutText: `${config.botName} is a powerful WhatsApp group management bot with advanced moderation, entertainment, and utility features. Built for group admins and owners to maintain order, have fun, and automate tasks.`,
        botInfoTitle: 'BOT INFORMATION',
        botName: 'Bot Name:',
        owner: 'Owner:',
        prefix: 'Prefix:',
        mode: 'Mode:',
        systemInfoTitle: 'SYSTEM INFO',
        platform: 'Platform:',
        architecture: 'Architecture:',
        nodejs: 'Node.js:',
        uptime: 'Uptime:',
        memory: 'Memory:',
        keyFeaturesTitle: 'KEY FEATURES',
        ai: '🤖 AI Assistant: Ask anything (powered by Groq)',
        moderation: '🛡️ Moderation: Auto-mod, warnings, antilink, kick/ban',
        groupTools: '👥 Group Tools: Tag all, hide tag, group settings',
        games: `🎮 Games: 8 fun games to play (${config.prefix}games)`,
        security: '🔐 Security: View-once reveal, owner management',
        broadcasting: '📢 Broadcasting: Spam, broadcast to all groups',
        utilities: '⚙️ Utilities: Stickers, info, JID lookup',
        multiDevice: '🔗 Multi-device: Works alongside WhatsApp Web',
        menuPrompt: `Type ${config.prefix}menu for all commands`,
        gamesPrompt: `Type ${config.prefix}games to see available games`
    },
    it: {
        promo: '🤖 HAI BISOGNO DI UN BOT PER IL TUO GRUPPO?\n\n💬 Scrivi al proprietario o aggiungi direttamente:\nwa.me/393313444410\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n',
        title: `╔═══════════════════════════╗\n║   🤖 ${config.botName}   ║\n╚═══════════════════════════╝`,
        aboutTitle: 'INFORMAZIONI SUL BOT',
        aboutText: `${config.botName} è un potente bot di gestione gruppi WhatsApp con funzionalità avanzate di moderazione, intrattenimento e utilità. Creato per admin e proprietari di gruppi per mantenere l'ordine, divertirsi e automatizzare compiti.`,
        botInfoTitle: 'INFORMAZIONI BOT',
        botName: 'Nome Bot:',
        owner: 'Proprietario:',
        prefix: 'Prefisso:',
        mode: 'Modalità:',
        systemInfoTitle: 'INFO SISTEMA',
        platform: 'Piattaforma:',
        architecture: 'Architettura:',
        nodejs: 'Node.js:',
        uptime: 'Tempo attivo:',
        memory: 'Memoria:',
        keyFeaturesTitle: 'FUNZIONALITÀ PRINCIPALI',
        ai: '🤖 Assistente AI: Chiedi qualsiasi cosa (powered by Groq)',
        moderation: '🛡️ Moderazione: Auto-mod, avvisi, antilink, kick/ban',
        groupTools: '👥 Strumenti Gruppo: Tag tutti, tag nascosto, impostazioni',
        games: `🎮 Giochi: 8 giochi divertenti (${config.prefix}games)`,
        security: '🔐 Sicurezza: Rivela visualizza una volta, gestione proprietari',
        broadcasting: '📢 Broadcasting: Spam, broadcast a tutti i gruppi',
        utilities: '⚙️ Utilità: Sticker, info, ricerca JID',
        multiDevice: '🔗 Multi-dispositivo: Funziona con WhatsApp Web',
        menuPrompt: `Scrivi ${config.prefix}menu per tutti i comandi`,
        gamesPrompt: `Scrivi ${config.prefix}games per vedere i giochi disponibili`
    },
    ru: {
        promo: '🤖 НУЖЕН БОТ ДЛЯ ВАШЕЙ ГРУППЫ?\n\n💬 Напишите владельцу или добавьте напрямую:\nwa.me/393313444410\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n',
        title: `╔═══════════════════════════╗\n║   🤖 ${config.botName}   ║\n╚═══════════════════════════╝`,
        aboutTitle: 'О БОТЕ',
        aboutText: `${config.botName} - это мощный бот для управления группами WhatsApp с расширенными функциями модерации, развлечений и утилит. Создан для администраторов и владельцев групп для поддержания порядка, развлечений и автоматизации задач.`,
        botInfoTitle: 'ИНФОРМАЦИЯ О БОТЕ',
        botName: 'Имя бота:',
        owner: 'Владелец:',
        prefix: 'Префикс:',
        mode: 'Режим:',
        systemInfoTitle: 'СИСТЕМНАЯ ИНФОРМАЦИЯ',
        platform: 'Платформа:',
        architecture: 'Архитектура:',
        nodejs: 'Node.js:',
        uptime: 'Время работы:',
        memory: 'Память:',
        keyFeaturesTitle: 'КЛЮЧЕВЫЕ ФУНКЦИИ',
        ai: '🤖 AI-ассистент: Спросите что угодно (powered by Groq)',
        moderation: '🛡️ Модерация: Авто-мод, предупреждения, антиссылки, кик/бан',
        groupTools: '👥 Инструменты группы: Отметить всех, скрытая отметка, настройки',
        games: `🎮 Игры: 8 весёлых игр (${config.prefix}games)`,
        security: '🔐 Безопасность: Показ одноразовых, управление владельцами',
        broadcasting: '📢 Рассылка: Спам, рассылка во все группы',
        utilities: '⚙️ Утилиты: Стикеры, информация, поиск JID',
        multiDevice: '🔗 Мультиустройство: Работает вместе с WhatsApp Web',
        menuPrompt: `Напишите ${config.prefix}menu для всех команд`,
        gamesPrompt: `Напишите ${config.prefix}games чтобы увидеть доступные игры`
    },
    es: {
        promo: '🤖 ¿NECESITAS UN BOT PARA TU GRUPO?\n\n💬 Escribe al propietario o agrega directamente:\nwa.me/393313444410\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n',
        title: `╔═══════════════════════════╗\n║   🤖 ${config.botName}   ║\n╚═══════════════════════════╝`,
        aboutTitle: 'ACERCA DE ESTE BOT',
        aboutText: `${config.botName} es un poderoso bot de gestión de grupos de WhatsApp con funciones avanzadas de moderación, entretenimiento y utilidades. Creado para administradores y propietarios de grupos para mantener el orden, divertirse y automatizar tareas.`,
        botInfoTitle: 'INFORMACIÓN DEL BOT',
        botName: 'Nombre del Bot:',
        owner: 'Propietario:',
        prefix: 'Prefijo:',
        mode: 'Modo:',
        systemInfoTitle: 'INFO DEL SISTEMA',
        platform: 'Plataforma:',
        architecture: 'Arquitectura:',
        nodejs: 'Node.js:',
        uptime: 'Tiempo activo:',
        memory: 'Memoria:',
        keyFeaturesTitle: 'CARACTERÍSTICAS CLAVE',
        ai: '🤖 Asistente de IA: Pregunta lo que quieras (powered by Groq)',
        moderation: '🛡️ Moderación: Auto-mod, advertencias, antienlace, kick/ban',
        groupTools: '👥 Herramientas de Grupo: Etiquetar todos, etiqueta oculta, configuración',
        games: `🎮 Juegos: 8 juegos divertidos (${config.prefix}games)`,
        security: '🔐 Seguridad: Revelar ver una vez, gestión de propietarios',
        broadcasting: '📢 Transmisión: Spam, transmitir a todos los grupos',
        utilities: '⚙️ Utilidades: Stickers, info, búsqueda JID',
        multiDevice: '🔗 Multi-dispositivo: Funciona junto con WhatsApp Web',
        menuPrompt: `Escribe ${config.prefix}menu para todos los comandos`,
        gamesPrompt: `Escribe ${config.prefix}games para ver los juegos disponibles`
    },
    pt: {
        promo: '🤖 PRECISA DE UM BOT PARA SEU GRUPO?\n\n💬 Envie mensagem para o dono ou adicione diretamente:\nwa.me/393313444410\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n',
        title: `╔═══════════════════════════╗\n║   🤖 ${config.botName}   ║\n╚═══════════════════════════╝`,
        aboutTitle: 'SOBRE ESTE BOT',
        aboutText: `${config.botName} é um poderoso bot de gerenciamento de grupos do WhatsApp com recursos avançados de moderação, entretenimento e utilidades. Criado para administradores e donos de grupos para manter a ordem, se divertir e automatizar tarefas.`,
        botInfoTitle: 'INFORMAÇÕES DO BOT',
        botName: 'Nome do Bot:',
        owner: 'Dono:',
        prefix: 'Prefixo:',
        mode: 'Modo:',
        systemInfoTitle: 'INFO DO SISTEMA',
        platform: 'Plataforma:',
        architecture: 'Arquitetura:',
        nodejs: 'Node.js:',
        uptime: 'Tempo ativo:',
        memory: 'Memória:',
        keyFeaturesTitle: 'RECURSOS PRINCIPAIS',
        ai: '🤖 Assistente de IA: Pergunte qualquer coisa (powered by Groq)',
        moderation: '🛡️ Moderação: Auto-mod, avisos, antilink, kick/ban',
        groupTools: '👥 Ferramentas de Grupo: Marcar todos, marca oculta, configurações',
        games: `🎮 Jogos: 8 jogos divertidos (${config.prefix}games)`,
        security: '🔐 Segurança: Revelar ver uma vez, gerenciamento de donos',
        broadcasting: '📢 Transmissão: Spam, transmitir para todos os grupos',
        utilities: '⚙️ Utilidades: Stickers, info, busca JID',
        multiDevice: '🔗 Multi-dispositivo: Funciona junto com WhatsApp Web',
        menuPrompt: `Digite ${config.prefix}menu para todos os comandos`,
        gamesPrompt: `Digite ${config.prefix}games para ver os jogos disponíveis`
    },
    ar: {
        promo: '🤖 تحتاج بوت لمجموعتك؟\n\n💬 راسل المالك أو أضف مباشرة:\nwa.me/393313444410\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n',
        title: `╔═══════════════════════════╗\n║   🤖 ${config.botName}   ║\n╚═══════════════════════════╝`,
        aboutTitle: 'حول هذا البوت',
        aboutText: `${config.botName} هو بوت قوي لإدارة مجموعات الواتساب مع ميزات متقدمة للإشراف والترفيه والأدوات المساعدة. مصمم لمشرفي ومالكي المجموعات للحفاظ على النظام والاستمتاع وأتمتة المهام.`,
        botInfoTitle: 'معلومات البوت',
        botName: 'اسم البوت:',
        owner: 'المالك:',
        prefix: 'البادئة:',
        mode: 'الوضع:',
        systemInfoTitle: 'معلومات النظام',
        platform: 'المنصة:',
        architecture: 'البنية:',
        nodejs: 'Node.js:',
        uptime: 'وقت التشغيل:',
        memory: 'الذاكرة:',
        keyFeaturesTitle: 'الميزات الرئيسية',
        ai: '🤖 مساعد الذكاء الاصطناعي: اسأل أي شيء (powered by Groq)',
        moderation: '🛡️ الإشراف: تلقائي، تحذيرات، حماية الروابط، طرد/حظر',
        groupTools: '👥 أدوات المجموعة: منشن للجميع، منشن مخفي، إعدادات المجموعة',
        games: `🎮 ألعاب: 8 ألعاب ممتعة (${config.prefix}games)`,
        security: '🔐 الأمان: كشف المشاهدة مرة واحدة، إدارة المالكين',
        broadcasting: '📢 البث: رسائل متكررة، بث لجميع المجموعات',
        utilities: '⚙️ أدوات مساعدة: ملصقات، معلومات، بحث JID',
        multiDevice: '🔗 متعدد الأجهزة: يعمل مع واتساب ويب',
        menuPrompt: `اكتب ${config.prefix}menu لجميع الأوامر`,
        gamesPrompt: `اكتب ${config.prefix}games لرؤية الألعاب المتاحة`
    },
    hi: {
        promo: '🤖 अपने ग्रुप के लिए बॉट चाहिए?\n\n💬 मालिक को मैसेज करें या सीधे जोड़ें:\nwa.me/393313444410\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n',
        title: `╔═══════════════════════════╗\n║   🤖 ${config.botName}   ║\n╚═══════════════════════════╝`,
        aboutTitle: 'इस बॉट के बारे में',
        aboutText: `${config.botName} एक शक्तिशाली व्हाट्सएप ग्रुप मैनेजमेंट बॉट है जिसमें उन्नत मॉडरेशन, मनोरंजन और उपयोगिता सुविधाएं हैं। ग्रुप एडमिन और मालिकों के लिए बनाया गया है ताकि व्यवस्था बनाए रखें, मज़े करें और कार्यों को स्वचालित करें।`,
        botInfoTitle: 'बॉट जानकारी',
        botName: 'बॉट का नाम:',
        owner: 'मालिक:',
        prefix: 'प्रीफिक्स:',
        mode: 'मोड:',
        systemInfoTitle: 'सिस्टम जानकारी',
        platform: 'प्लेटफॉर्म:',
        architecture: 'आर्किटेक्चर:',
        nodejs: 'Node.js:',
        uptime: 'अपटाइम:',
        memory: 'मेमोरी:',
        keyFeaturesTitle: 'मुख्य विशेषताएं',
        ai: '🤖 एआई सहायक: कुछ भी पूछें (powered by Groq)',
        moderation: '🛡️ मॉडरेशन: ऑटो-मॉड, चेतावनी, एंटीलिंक, किक/बैन',
        groupTools: '👥 ग्रुप टूल्स: सभी को टैग करें, हाइड टैग, ग्रुप सेटिंग्स',
        games: `🎮 गेम: 8 मज़ेदार गेम (${config.prefix}games)`,
        security: '🔐 सुरक्षा: व्यू-वन्स रिवील, मालिक प्रबंधन',
        broadcasting: '📢 ब्रॉडकास्टिंग: स्पैम, सभी ग्रुप में ब्रॉडकास्ट',
        utilities: '⚙️ उपयोगिताएं: स्टिकर, जानकारी, JID खोज',
        multiDevice: '🔗 मल्टी-डिवाइस: व्हाट्सएप वेब के साथ काम करता है',
        menuPrompt: `सभी कमांड के लिए ${config.prefix}menu टाइप करें`,
        gamesPrompt: `उपलब्ध गेम देखने के लिए ${config.prefix}games टाइप करें`
    },
    ng: {
        promo: '🤖 YOU NEED BOT FOR YOUR GROUP?\n\n💬 Text di owner or add am direct:\nwa.me/393313444410\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n',
        title: `╔═══════════════════════════╗\n║   🤖 ${config.botName}   ║\n╚═══════════════════════════╝`,
        aboutTitle: 'ABOUT DIS BOT',
        aboutText: `${config.botName} na powerful WhatsApp group management bot with sharp moderation, entertainment, and utility features. E dey help group admins and owners maintain order, enjoy, and automate tasks.`,
        botInfoTitle: 'BOT INFORMATION',
        botName: 'Bot Name:',
        owner: 'Owner:',
        prefix: 'Prefix:',
        mode: 'Mode:',
        systemInfoTitle: 'SYSTEM INFO',
        platform: 'Platform:',
        architecture: 'Architecture:',
        nodejs: 'Node.js:',
        uptime: 'Uptime:',
        memory: 'Memory:',
        keyFeaturesTitle: 'KEY FEATURES',
        ai: '🤖 AI Assistant: Ask anything (powered by Groq)',
        moderation: '🛡️ Moderation: Auto-mod, warnings, antilink, kick/ban',
        groupTools: '👥 Group Tools: Tag all, hide tag, group settings',
        games: `🎮 Games: 8 fun games to play (${config.prefix}games)`,
        security: '🔐 Security: View-once reveal, owner management',
        broadcasting: '📢 Broadcasting: Spam, broadcast to all groups',
        utilities: '⚙️ Utilities: Stickers, info, JID lookup',
        multiDevice: '🔗 Multi-device: E dey work with WhatsApp Web',
        menuPrompt: `Type ${config.prefix}menu for all commands`,
        gamesPrompt: `Type ${config.prefix}games to see available games`
    }
};

export default {
    name: 'info',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        try {
            // Get system info
            const uptime = process.uptime();
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = Math.floor(uptime % 60);
            
            const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
            const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
            const usedMem = (totalMem - freeMem).toFixed(2);
            
            const platform = os.platform();
            const arch = os.arch();
            const nodeVersion = process.version;
            
            const infoText = 
                `${t.promo}${t.title}\n\n` +
                `${t.aboutTitle}\n\n` +
                `${t.aboutText}\n\n` +
                `${t.botInfoTitle}\n\n` +
                `${t.botName} ${config.botName}\n` +
                `${t.owner} ${config.ownerName}\n` +
                `${t.prefix} ${config.prefix}\n` +
                `${t.mode} ${config.mode}\n\n` +
                `${t.systemInfoTitle}\n\n` +
                `${t.platform} ${platform}\n` +
                `${t.architecture} ${arch}\n` +
                `${t.nodejs} ${nodeVersion}\n` +
                `${t.uptime} ${hours}h ${minutes}m ${seconds}s\n` +
                `${t.memory} ${usedMem}GB / ${totalMem}GB\n\n` +
                `${t.keyFeaturesTitle}\n\n` +
                `${t.ai}\n` +
                `${t.moderation}\n` +
                `${t.groupTools}\n` +
                `${t.games}\n` +
                `${t.security}\n` +
                `${t.broadcasting}\n` +
                `${t.utilities}\n` +
                `${t.multiDevice}\n\n` +
                `${t.menuPrompt}\n` +
                `${t.gamesPrompt}`;
            
            await sendAsChannelForward(sock, from, infoText, {
                quoted: msg,
                newsletterName: config.botName || 'Bot Info'
            });
        } catch (error) {
            console.error('[INFO] Error:', error.message);
            await sock.sendMessage(from, { 
                text: lang === 'it' ? 'Impossibile ottenere informazioni sul bot.' : 'Failed to get bot information.'
            });
        }
    }
};
