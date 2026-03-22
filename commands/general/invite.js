import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        message: `╔═══════════════════════════════════╗
║   🎁 SPECIAL REFERRAL REWARDS   ║
╚═══════════════════════════════════╝

Hey! You're already enjoying the bot here! 🎮

Want to earn EXCLUSIVE rewards? 
Add me to your other WhatsApp groups! 💎

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎁 REWARDS FOR EACH NEW GROUP:

💰 100,000,000 COINS - Instant!
👑 VIP Badge (7 days) - Premium status!
🍀 Lucky Charm - +20% luck in games!
🚀 RPG Weapon - Free weapon!
💎 Mystery Box - Random prize!
🛡️ Anti-Rob Shield (3 days) - Protection!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 HOW IT WORKS:

1️⃣ Add me to another WhatsApp group
2️⃣ Give me admin permissions there
3️⃣ Type .claim in the new group
4️⃣ Get your rewards instantly!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔥 SPECIAL BONUS - 3+ GROUPS:

Add me to 3 or more groups and unlock:
🌟 LEGEND Badge - PERMANENT!
💰 50,000 BONUS COINS!
🎁 Premium Mystery Box!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 WHY SHARE ME?

Your friends will love:
🎮 50+ games and fun commands
💰 Daily rewards and economy system
🎲 Casino games (slots, blackjack, roulette)
🛡️ Moderation and auto-delete tools
🌍 7 languages supported
📊 Stats and leaderboards
⚔️ Battle system with weapons

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ Help your friends discover the fun!
⚡ Earn amazing rewards for yourself!
⚡ Build a bigger gaming community!

🎁 ADD ME NOW & CLAIM YOUR REWARDS! 🎁`
    },
    it: {
        message: `╔═══════════════════════════════════╗
║   🎁 PREMI REFERRAL SPECIALI   ║
╚═══════════════════════════════════╝

Ehi! Stai già usando il bot qui! 🎮

Vuoi guadagnare premi ESCLUSIVI?
Aggiungimi ai tuoi altri gruppi WhatsApp! 💎

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎁 PREMI PER OGNI NUOVO GRUPPO:

💰 100,000,000 MONETE - Istantanee!
👑 Badge VIP (7 giorni) - Status premium!
🍀 Portafortuna - +20% fortuna nei giochi!
🚀 Arma RPG - Arma gratis!
💎 Scatola Misteriosa - Premio casuale!
🛡️ Scudo Anti-Rapina (3 giorni) - Protezione!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 COME FUNZIONA:

1️⃣ Aggiungimi a un altro gruppo WhatsApp
2️⃣ Dammi permessi admin lì
3️⃣ Scrivi .claim nel nuovo gruppo
4️⃣ Ricevi i tuoi premi istantaneamente!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔥 BONUS SPECIALE - 3+ GRUPPI:

Aggiungimi a 3 o più gruppi e sblocca:
🌟 Badge LEGGENDA - PERMANENTE!
💰 50.000 MONETE BONUS!
🎁 Scatola Misteriosa Premium!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 PERCHÉ CONDIVIDERMI?

I tuoi amici ameranno:
🎮 50+ giochi e comandi divertenti
💰 Premi giornalieri e sistema economia
🎲 Giochi da casinò (slot, blackjack, roulette)
🛡️ Strumenti moderazione e auto-eliminazione
🌍 7 lingue supportate
📊 Statistiche e classifiche
⚔️ Sistema battaglia con armi

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ Aiuta i tuoi amici a scoprire il divertimento!
⚡ Guadagna premi fantastici per te!
⚡ Costruisci una community di gioco più grande!

🎁 AGGIUNGIMI ORA E RECLAMA I TUOI PREMI! 🎁`
    },
    ru: {
        message: `╔═══════════════════════════════════╗
║   🎁 СПЕЦИАЛЬНЫЕ РЕФЕРАЛЬНЫЕ НАГРАДЫ   ║
╚═══════════════════════════════════╝

Привет! Ты уже используешь бота здесь! 🎮

Хочешь заработать ЭКСКЛЮЗИВНЫЕ награды?
Добавь меня в свои другие группы WhatsApp! 💎

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎁 НАГРАДЫ ЗА КАЖДУЮ НОВУЮ ГРУППУ:

💰 100,000,000 МОНЕТ - Мгновенно!
👑 VIP Значок (7 дней) - Премиум статус!
🍀 Талисман Удачи - +20% удачи в играх!
🚀 Оружие RPG - Бесплатное оружие!
💎 Таинственная Коробка - Случайный приз!
🛡️ Щит от Грабежа (3 дня) - Защита!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 КАК ЭТО РАБОТАЕТ:

1️⃣ Добавь меня в другую группу WhatsApp
2️⃣ Дай мне права админа там
3️⃣ Напиши .claim в новой группе
4️⃣ Получи награды мгновенно!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔥 СПЕЦИАЛЬНЫЙ БОНУС - 3+ ГРУППЫ:

Добавь меня в 3 или больше групп и получи:
🌟 Значок ЛЕГЕНДА - НАВСЕГДА!
💰 50,000 БОНУСНЫХ МОНЕТ!
🎁 Премиум Таинственная Коробка!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 ПОЧЕМУ СТОИТ ПОДЕЛИТЬСЯ?

Твоим друзьям понравится:
🎮 50+ игр и веселых команд
💰 Ежедневные награды и экономика
🎲 Казино игры (слоты, блэкджек, рулетка)
🛡️ Инструменты модерации
🌍 7 языков поддержки
📊 Статистика и таблицы лидеров
⚔️ Боевая система с оружием

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ Помоги друзьям открыть веселье!
⚡ Заработай потрясающие награды!
⚡ Построй большое игровое сообщество!

🎁 ДОБАВЬ МЕНЯ И ЗАБЕРИ НАГРАДЫ! 🎁`
    },
    es: {
        message: `╔═══════════════════════════════════╗
║   🎁 RECOMPENSAS ESPECIALES DE REFERIDOS   ║
╚═══════════════════════════════════╝

¡Oye! ¡Ya estás disfrutando del bot aquí! 🎮

¿Quieres ganar recompensas EXCLUSIVAS?
¡Agrégame a tus otros grupos de WhatsApp! 💎

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎁 RECOMPENSAS POR CADA NUEVO GRUPO:

💰 100,000,000 MONEDAS - ¡Instantáneas!
👑 Insignia VIP (7 días) - ¡Estado premium!
🍀 Amuleto de Suerte - ¡+20% suerte en juegos!
🚀 Arma RPG - ¡Arma gratis!
💎 Caja Misteriosa - ¡Premio aleatorio!
🛡️ Escudo Anti-Robo (3 días) - ¡Protección!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 CÓMO FUNCIONA:

1️⃣ Agrégame a otro grupo de WhatsApp
2️⃣ Dame permisos de admin allí
3️⃣ Escribe .claim en el nuevo grupo
4️⃣ ¡Recibe tus recompensas al instante!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔥 BONUS ESPECIAL - 3+ GRUPOS:

Agrégame a 3 o más grupos y desbloquea:
🌟 Insignia LEYENDA - ¡PERMANENTE!
💰 ¡50,000 MONEDAS BONUS!
🎁 ¡Caja Misteriosa Premium!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 ¿POR QUÉ COMPARTIRME?

A tus amigos les encantará:
🎮 50+ juegos y comandos divertidos
💰 Recompensas diarias y sistema de economía
🎲 Juegos de casino (tragamonedas, blackjack, ruleta)
🛡️ Herramientas de moderación
🌍 7 idiomas soportados
📊 Estadísticas y tablas de clasificación
⚔️ Sistema de batalla con armas

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ ¡Ayuda a tus amigos a descubrir la diversión!
⚡ ¡Gana recompensas increíbles para ti!
⚡ ¡Construye una comunidad de juegos más grande!

🎁 ¡AGRÉGAME AHORA Y RECLAMA TUS RECOMPENSAS! 🎁`
    },
    pt: {
        message: `╔═══════════════════════════════════╗
║   🎁 RECOMPENSAS ESPECIAIS DE INDICAÇÃO   ║
╚═══════════════════════════════════╝

Ei! Você já está aproveitando o bot aqui! 🎮

Quer ganhar recompensas EXCLUSIVAS?
Me adicione aos seus outros grupos do WhatsApp! 💎

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎁 RECOMPENSAS POR CADA NOVO GRUPO:

💰 100,000,000 MOEDAS - Instantâneas!
👑 Emblema VIP (7 dias) - Status premium!
🍀 Amuleto da Sorte - +20% sorte nos jogos!
🚀 Arma RPG - Arma grátis!
💎 Caixa Misteriosa - Prêmio aleatório!
🛡️ Escudo Anti-Roubo (3 dias) - Proteção!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 COMO FUNCIONA:

1️⃣ Me adicione a outro grupo do WhatsApp
2️⃣ Me dê permissões de admin lá
3️⃣ Digite .claim no novo grupo
4️⃣ Receba suas recompensas instantaneamente!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔥 BÔNUS ESPECIAL - 3+ GRUPOS:

Me adicione a 3 ou mais grupos e desbloqueie:
🌟 Emblema LENDA - PERMANENTE!
💰 50.000 MOEDAS BÔNUS!
🎁 Caixa Misteriosa Premium!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 POR QUE ME COMPARTILHAR?

Seus amigos vão adorar:
🎮 50+ jogos e comandos divertidos
💰 Recompensas diárias e sistema de economia
🎲 Jogos de cassino (slots, blackjack, roleta)
🛡️ Ferramentas de moderação
🌍 7 idiomas suportados
📊 Estatísticas e tabelas de classificação
⚔️ Sistema de batalha com armas

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ Ajude seus amigos a descobrir a diversão!
⚡ Ganhe recompensas incríveis para você!
⚡ Construa uma comunidade de jogos maior!

🎁 ME ADICIONE AGORA E REIVINDIQUE SUAS RECOMPENSAS! 🎁`
    },
    ar: {
        message: `╔═══════════════════════════════════╗
║   🎁 مكافآت الإحالة الخاصة   ║
╚═══════════════════════════════════╝

مرحباً! انت بالفعل بتستخدم البوت هنا! 🎮

عايز تكسب مكافآت حصرية؟
ضيفني لمجموعاتك التانية على واتساب! 💎

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎁 مكافآت لكل مجموعة جديدة:

💰 100,000,000 عملة - فورية!
👑 شارة VIP (7 أيام) - حالة مميزة!
🍀 تعويذة الحظ - +20% حظ في الألعاب!
🚀 سلاح RPG - سلاح مجاني!
💎 صندوق غامض - جائزة عشوائية!
🛡️ درع ضد السرقة (3 أيام) - حماية!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 كيف يعمل:

1️⃣ ضيفني لمجموعة واتساب تانية
2️⃣ اديني صلاحيات أدمن هناك
3️⃣ اكتب .claim في المجموعة الجديدة
4️⃣ خد مكافآتك فوراً!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔥 بونص خاص - 3+ مجموعات:

ضيفني ل 3 مجموعات أو أكتر وافتح:
🌟 شارة أسطورة - دائمة!
💰 50,000 عملة إضافية!
🎁 صندوق غامض مميز!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 ليه تشاركني؟

أصحابك هيحبوا:
🎮 50+ لعبة وأمر ممتع
💰 مكافآت يومية ونظام اقتصادي
🎲 ألعاب كازينو (سلوتس، بلاك جاك، روليت)
🛡️ أدوات إدارة
🌍 دعم 7 لغات
📊 إحصائيات وجداول متصدرين
⚔️ نظام معارك مع أسلحة

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ ساعد أصحابك يكتشفوا المتعة!
⚡ اكسب مكافآت رهيبة ليك!
⚡ ابني مجتمع ألعاب أكبر!

🎁 ضيفني دلوقتي واستلم مكافآتك! 🎁`
    },
    hi: {
        message: `╔═══════════════════════════════════╗
║   🎁 विशेष रेफरल इनाम   ║
╚═══════════════════════════════════╝

अरे! आप पहले से ही यहां बॉट का आनंद ले रहे हैं! 🎮

एक्सक्लूसिव इनाम कमाना चाहते हैं?
मुझे अपने अन्य WhatsApp ग्रुप में जोड़ें! 💎

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎁 हर नए ग्रुप के लिए इनाम:

💰 100,000,000 कॉइन - तुरंत!
👑 VIP बैज (7 दिन) - प्रीमियम स्टेटस!
🍀 लकी चार्म - गेम्स में +20% भाग्य!
🚀 RPG हथियार - फ्री हथियार!
💎 मिस्ट्री बॉक्स - रैंडम इनाम!
🛡️ एंटी-रॉब शील्ड (3 दिन) - सुरक्षा!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 कैसे काम करता है:

1️⃣ मुझे दूसरे WhatsApp ग्रुप में जोड़ें
2️⃣ मुझे वहां एडमिन अनुमति दें
3️⃣ नए ग्रुप में .claim टाइप करें
4️⃣ अपने इनाम तुरंत प्राप्त करें!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔥 स्पेशल बोनस - 3+ ग्रुप:

मुझे 3 या अधिक ग्रुप में जोड़ें और अनलॉक करें:
🌟 लीजेंड बैज - स्थायी!
💰 50,000 बोनस कॉइन!
🎁 प्रीमियम मिस्ट्री बॉक्स!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 मुझे क्यों शेयर करें?

आपके दोस्तों को पसंद आएगा:
🎮 50+ गेम्स और मजेदार कमांड्स
💰 डेली रिवॉर्ड्स और इकोनॉमी सिस्टम
🎲 कैसीनो गेम्स (स्लॉट्स, ब्लैकजैक, रूलेट)
🛡️ मॉडरेशन टूल्स
🌍 7 भाषाओं का समर्थन
📊 स्टैटिस्टिक्स और लीडरबोर्ड्स
⚔️ हथियारों के साथ बैटल सिस्टम

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ अपने दोस्तों को मज़ा खोजने में मदद करें!
⚡ अपने लिए शानदार इनाम कमाएं!
⚡ एक बड़ी गेमिंग कम्युनिटी बनाएं!

🎁 मुझे अभी जोड़ें और अपने इनाम क्लेम करें! 🎁`
    },
    ng: {
        message: `╔═══════════════════════════════════╗
║   🎁 SPECIAL REFERRAL REWARDS   ║
╚═══════════════════════════════════╝

How far! You don dey enjoy di bot for here! 🎮

You wan earn SPECIAL rewards?
Add me to your other WhatsApp groups! 💎

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎁 REWARDS FOR EACH NEW GROUP:

💰 100,000,000 COINS - Instant!
👑 VIP Badge (7 days) - Premium status!
🍀 Lucky Charm - +20% luck for games!
🚀 RPG Weapon - Free weapon!
💎 Mystery Box - Random prize!
🛡️ Anti-Rob Shield (3 days) - Protection!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 HOW E DEY WORK:

1️⃣ Add me to another WhatsApp group
2️⃣ Give me admin permission for there
3️⃣ Type .claim for di new group
4️⃣ Collect your rewards sharp sharp!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔥 SPECIAL BONUS - 3+ GROUPS:

Add me to 3 or more groups and unlock:
🌟 LEGEND Badge - PERMANENT!
💰 50,000 BONUS COINS!
🎁 Premium Mystery Box!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 WHY YOU GO SHARE ME?

Your friends go love:
🎮 50+ games and fun commands
💰 Daily rewards and economy system
🎲 Casino games (slots, blackjack, roulette)
🛡️ Moderation and auto-delete tools
🌍 7 languages wey we support
📊 Stats and leaderboards
⚔️ Battle system with weapons

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ Help your friends discover di fun!
⚡ Earn amazing rewards for yourself!
⚡ Build bigger gaming community!

🎁 ADD ME NOW & CLAIM YOUR REWARDS! 🎁`
    }
};

export default {
    name: 'invite',
    aliases: ['promo', 'referral', 'bonus'],
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;

        try {
            await sock.sendMessage(from, {
                text: t.message
            });
        } catch (error) {
            console.error('[INVITE] Error:', error.message);
        }
    }
};
