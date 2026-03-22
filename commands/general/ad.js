import { config } from '../../config.js';
import { getGroupLanguage } from '../../utils/language.js';
import { sendAsChannelForward } from '../../utils/fakeForward.js';

const responses = {
    en: {
        ad: `╔═══════════════════════════╗
║   🤖 BOT SERVICES   ║
╚═══════════════════════════╝

🌟 PROFESSIONAL WHATSAPP BOT

Need a powerful bot for your group?
Get ${config.botName} for your community!

✨ FEATURES:
• 🤖 AI Assistant (Powered by Groq)
• 🛡️ Advanced Moderation
• 🎮 Fun Games & Entertainment
• 👥 Group Management Tools
• 🔐 Security Features
• 📢 Broadcasting & Announcements
• ⚙️ Customizable Settings
• 🌍 Multi-language Support
• 🔗 Multi-device Compatible

💼 PERFECT FOR:
• Community Groups
• Gaming Communities
• Business Groups
• Friend Groups
• Educational Groups

📱 CONTACT OWNER:
wa.me/393313444410

💬 Text ${config.ownerName} to get your bot today!

━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ Fast Setup | 24/7 Support | Reliable`
    },
    it: {
        ad: `╔═══════════════════════════╗
║   🤖 SERVIZI BOT   ║
╚═══════════════════════════╝

🌟 BOT WHATSAPP PROFESSIONALE

Hai bisogno di un bot potente per il tuo gruppo?
Ottieni ${config.botName} per la tua comunità!

✨ FUNZIONALITÀ:
• 🤖 Assistente AI (Powered by Groq)
• 🛡️ Moderazione Avanzata
• 🎮 Giochi & Intrattenimento
• 👥 Strumenti Gestione Gruppo
• 🔐 Funzioni di Sicurezza
• 📢 Broadcasting & Annunci
• ⚙️ Impostazioni Personalizzabili
• 🌍 Supporto Multi-lingua
• 🔗 Compatibile Multi-dispositivo

💼 PERFETTO PER:
• Gruppi Community
• Community Gaming
• Gruppi Business
• Gruppi Amici
• Gruppi Educativi

📱 CONTATTA IL PROPRIETARIO:
wa.me/393313444410

💬 Scrivi a ${config.ownerName} per ottenere il tuo bot oggi!

━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ Setup Veloce | Supporto 24/7 | Affidabile`
    },
    ru: {
        ad: `╔═══════════════════════════╗
║   🤖 УСЛУГИ БОТА   ║
╚═══════════════════════════╝

🌟 ПРОФЕССИОНАЛЬНЫЙ WHATSAPP БОТ

Нужен мощный бот для вашей группы?
Получите ${config.botName} для вашего сообщества!

✨ ФУНКЦИИ:
• 🤖 AI-ассистент (Powered by Groq)
• 🛡️ Продвинутая модерация
• 🎮 Весёлые игры и развлечения
• 👥 Инструменты управления группой
• 🔐 Функции безопасности
• 📢 Рассылка и объявления
• ⚙️ Настраиваемые параметры
• 🌍 Поддержка нескольких языков
• 🔗 Совместимость с несколькими устройствами

💼 ИДЕАЛЬНО ДЛЯ:
• Групп сообщества
• Игровых сообществ
• Бизнес-групп
• Групп друзей
• Образовательных групп

📱 СВЯЗАТЬСЯ С ВЛАДЕЛЬЦЕМ:
wa.me/393313444410

💬 Напишите ${config.ownerName} чтобы получить своего бота сегодня!

━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ Быстрая настройка | Поддержка 24/7 | Надёжность`
    },
    es: {
        ad: `╔═══════════════════════════╗
║   🤖 SERVICIOS DEL BOT   ║
╚═══════════════════════════╝

🌟 BOT PROFESIONAL DE WHATSAPP

¿Necesitas un bot poderoso para tu grupo?
¡Obtén ${config.botName} para tu comunidad!

✨ CARACTERÍSTICAS:
• 🤖 Asistente de IA (Powered by Groq)
• 🛡️ Moderación Avanzada
• 🎮 Juegos y Entretenimiento
• 👥 Herramientas de Gestión de Grupos
• 🔐 Funciones de Seguridad
• 📢 Transmisión y Anuncios
• ⚙️ Configuración Personalizable
• 🌍 Soporte Multi-idioma
• 🔗 Compatible Multi-dispositivo

💼 PERFECTO PARA:
• Grupos Comunitarios
• Comunidades de Juegos
• Grupos de Negocios
• Grupos de Amigos
• Grupos Educativos

📱 CONTACTAR AL PROPIETARIO:
wa.me/393313444410

💬 ¡Escribe a ${config.ownerName} para obtener tu bot hoy!

━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ Configuración Rápida | Soporte 24/7 | Confiable`
    },
    pt: {
        ad: `╔═══════════════════════════╗
║   🤖 SERVIÇOS DO BOT   ║
╚═══════════════════════════╝

🌟 BOT PROFISSIONAL DO WHATSAPP

Precisa de um bot poderoso para seu grupo?
Obtenha ${config.botName} para sua comunidade!

✨ RECURSOS:
• 🤖 Assistente de IA (Powered by Groq)
• 🛡️ Moderação Avançada
• 🎮 Jogos e Entretenimento
• 👥 Ferramentas de Gerenciamento de Grupos
• 🔐 Recursos de Segurança
• 📢 Transmissão e Anúncios
• ⚙️ Configurações Personalizáveis
• 🌍 Suporte Multi-idioma
• 🔗 Compatível Multi-dispositivo

💼 PERFEITO PARA:
• Grupos Comunitários
• Comunidades de Jogos
• Grupos de Negócios
• Grupos de Amigos
• Grupos Educacionais

📱 CONTATAR O DONO:
wa.me/393313444410

💬 Envie mensagem para ${config.ownerName} para obter seu bot hoje!

━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ Configuração Rápida | Suporte 24/7 | Confiável`
    },
    ar: {
        ad: `╔═══════════════════════════╗
║   🤖 خدمات البوت   ║
╚═══════════════════════════╝

🌟 بوت واتساب احترافي

تحتاج بوت قوي لمجموعتك؟
احصل على ${config.botName} لمجتمعك!

✨ الميزات:
• 🤖 مساعد الذكاء الاصطناعي (Powered by Groq)
• 🛡️ إشراف متقدم
• 🎮 ألعاب وترفيه
• 👥 أدوات إدارة المجموعات
• 🔐 ميزات أمان
• 📢 بث وإعلانات
• ⚙️ إعدادات قابلة للتخصيص
• 🌍 دعم متعدد اللغات
• 🔗 متوافق مع الأجهزة المتعددة

💼 مثالي لـ:
• مجموعات المجتمع
• مجتمعات الألعاب
• مجموعات الأعمال
• مجموعات الأصدقاء
• المجموعات التعليمية

📱 تواصل مع المالك:
wa.me/393313444410

💬 راسل ${config.ownerName} للحصول على بوتك اليوم!

━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ إعداد سريع | دعم 24/7 | موثوق`
    },
    hi: {
        ad: `╔═══════════════════════════╗
║   🤖 बॉट सर्विसेज   ║
╚═══════════════════════════╝

🌟 प्रोफेशनल WHATSAPP बॉट

अपने ग्रुप के लिए पावरफुल बॉट चाहिए?
अपनी कम्युनिटी के लिए ${config.botName} प्राप्त करें!

✨ फीचर्स:
• 🤖 AI असिस्टेंट (Powered by Groq)
• 🛡️ एडवांस्ड मॉडरेशन
• 🎮 मजेदार गेम्स और एंटरटेनमेंट
• 👥 ग्रुप मैनेजमेंट टूल्स
• 🔐 सुरक्षा फीचर्स
• 📢 ब्रॉडकास्टिंग और घोषणाएं
• ⚙️ कस्टमाइज़ेबल सेटिंग्स
• 🌍 मल्टी-लैंग्वेज सपोर्ट
• 🔗 मल्टी-डिवाइस कम्पैटिबल

💼 परफेक्ट है:
• कम्युनिटी ग्रुप्स के लिए
• गेमिंग कम्युनिटीज के लिए
• बिजनेस ग्रुप्स के लिए
• फ्रेंड ग्रुप्स के लिए
• एजुकेशनल ग्रुप्स के लिए

📱 ओनर से संपर्क करें:
wa.me/393313444410

💬 आज ही अपना बॉट पाने के लिए ${config.ownerName} को मैसेज करें!

━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ फास्ट सेटअप | 24/7 सपोर्ट | विश्वसनीय`
    },
    ng: {
        ad: `╔═══════════════════════════╗
║   🤖 BOT SERVICES   ║
╚═══════════════════════════╝

🌟 PROFESSIONAL WHATSAPP BOT

You need strong bot for your group?
Get ${config.botName} for your community!

✨ WETIN E FIT DO:
• 🤖 AI Assistant (Powered by Groq)
• 🛡️ Advanced Moderation
• 🎮 Fun Games & Entertainment
• 👥 Group Management Tools
• 🔐 Security Features
• 📢 Broadcasting & Announcements
• ⚙️ Customizable Settings
• 🌍 Multi-language Support
• 🔗 Multi-device Compatible

💼 E GOOD FOR:
• Community Groups
• Gaming Communities
• Business Groups
• Friend Groups
• Educational Groups

📱 CONTACT OWNER:
wa.me/393313444410

💬 Send message to ${config.ownerName} make you get your bot today!

━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ Fast Setup | 24/7 Support | Reliable`
    }
};

export default {
    name: 'ad',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        await sendAsChannelForward(sock, from, t.ad, {
            quoted: msg,
            newsletterName: config.botName || 'Bot Services'
        });
    }
};
