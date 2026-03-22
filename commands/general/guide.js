import { getUser, updateUser } from '../../utils/databaseV2.js';
import * as logger from '../../utils/logger.js';
import { sendAsChannelForward } from '../../utils/fakeForward.js';
import { config } from '../../config.js';

// Track users waiting for language selection
const pendingLanguageSelection = new Map();

// Guide steps in all languages
const guideSteps = {
    en: [
        {
            step: 1,
            message: '🤖 WHAT IS THIS BOT?\n\neli6s bot is your all-in-one WhatsApp assistant!\n\nThink of me as a helpful robot that lives in your WhatsApp groups and chats. I can:\n\n✨ Play games with you\n💰 Manage virtual coins\n👮 Help admins manage groups\n🎯 And much more!\n\nI respond to commands that start with a dot (.)\n\nLet me show you how to use me...',
            delay: 3000
        },
        {
            step: 2,
            message: '💰 ECONOMY SYSTEM\n\nEarn and spend virtual coins!\n\nYou start with 100 coins for free.\n\n📅 .daily - Get 100-300 coins every day\n🏦 .bank - Check your balance\n💸 .pay @user 50 - Send coins to friends\n🏆 .leaderboard - See top players\n\nCoins are used to play games and buy items in the shop!',
            delay: 3500
        },
        {
            step: 3,
            message: '🎮 GAMES & FUN\n\nPlay games to win coins!\n\n🃏 .blackjack 100 - Casino card game\n🎰 .slot 50 - Slot machine\n🎲 .dice 25 - Roll the dice\n🎡 .roulette red 100 - Roulette wheel\n♟️ .chess @friend - Play chess\n🎯 .8ball <question> - Magic 8-ball\n\nType .games to see all 14+ games!',
            delay: 3500
        },
        {
            step: 4,
            message: '🛍️ SHOP & ITEMS\n\nBuy power-ups and weapons!\n\n.shop - Browse available items\n.buy <item> - Purchase an item\n.inventory - See what you own\n\nPopular items:\n🍀 Lucky Charm - Better luck in games\n🛡️ Anti-Rob - Protect your coins\n🔫 Weapons - Attack other players\n💎 VIP Pass - Exclusive benefits',
            delay: 3500
        },
        {
            step: 5,
            message: '👮 GROUP MANAGEMENT\n(For Group Admins)\n\nKeep your group organized!\n\n👤 .kick @user - Remove someone\n🚫 .ban @user - Ban someone\n⭐ .promote @user - Make admin\n⬇️ .demote @user - Remove admin\n⚠️ .warn @user - Give warning\n🔇 .mute @user - Mute someone\n🏷️ .tagall - Mention everyone\n🔗 .antilink on - Block links\n\nType .admin for full admin menu!',
            delay: 4000
        },
        {
            step: 6,
            message: '📚 GETTING HELP\n\nNeed more information?\n\n.menu - See all commands organized\n.help <command> - Get help on specific command\n.admin - Admin commands menu\n.games - List all games\n.updates - See what\'s new\n\n💡 TIP: All commands start with a dot (.)\n💡 Example: .daily or .bank',
            delay: 3000
        },
        {
            step: 7,
            message: '✅ YOU\'RE READY!\n\nStart your journey:\n\n1️⃣ Type .daily to get your first coins\n2️⃣ Type .slot 10 to try a game\n3️⃣ Type .menu to explore more\n\nRemember:\n• Commands start with a dot (.)\n• You can use me in groups or private chat\n• Have fun and be respectful!\n\n🎉 Welcome to the community!',
            delay: 0
        }
    ],
    it: [
        {
            step: 1,
            message: '🤖 COS\'È QUESTO BOT?\n\neli6s bot è il tuo assistente WhatsApp tutto-in-uno!\n\nPensami come un robot utile che vive nei tuoi gruppi e chat WhatsApp. Posso:\n\n✨ Giocare con te\n💰 Gestire monete virtuali\n👮 Aiutare gli admin a gestire i gruppi\n🎯 E molto altro!\n\nRispondo ai comandi che iniziano con un punto (.)\n\nLascia che ti mostri come usarmi...',
            delay: 3000
        },
        {
            step: 2,
            message: '💰 SISTEMA ECONOMICO\n\nGuadagna e spendi monete virtuali!\n\nInizi con 100 monete gratis.\n\n📅 .daily - Ottieni 100-300 monete ogni giorno\n🏦 .bank - Controlla il tuo saldo\n💸 .pay @utente 50 - Invia monete agli amici\n🏆 .leaderboard - Vedi i migliori giocatori\n\nLe monete servono per giocare e comprare oggetti nel negozio!',
            delay: 3500
        },
        {
            step: 3,
            message: '🎮 GIOCHI E DIVERTIMENTO\n\nGioca per vincere monete!\n\n🃏 .blackjack 100 - Gioco di carte casino\n🎰 .slot 50 - Slot machine\n🎲 .dice 25 - Lancia i dadi\n🎡 .roulette rosso 100 - Ruota della roulette\n♟️ .chess @amico - Gioca a scacchi\n🎯 .8ball <domanda> - Palla magica 8\n\nScrivi .games per vedere tutti i 14+ giochi!',
            delay: 3500
        },
        {
            step: 4,
            message: '🛍️ NEGOZIO E OGGETTI\n\nCompra potenziamenti e armi!\n\n.shop - Sfoglia oggetti disponibili\n.buy <oggetto> - Acquista un oggetto\n.inventory - Vedi cosa possiedi\n\nOggetti popolari:\n🍀 Portafortuna - Migliore fortuna nei giochi\n🛡️ Anti-Furto - Proteggi le tue monete\n🔫 Armi - Attacca altri giocatori\n💎 Pass VIP - Benefici esclusivi',
            delay: 3500
        },
        {
            step: 5,
            message: '👮 GESTIONE GRUPPO\n(Per Admin del Gruppo)\n\nMantieni il tuo gruppo organizzato!\n\n👤 .kick @utente - Rimuovi qualcuno\n🚫 .ban @utente - Banna qualcuno\n⭐ .promote @utente - Rendi admin\n⬇️ .demote @utente - Rimuovi admin\n⚠️ .warn @utente - Dai avvertimento\n🔇 .mute @utente - Silenzia qualcuno\n🏷️ .tagall - Menziona tutti\n🔗 .antilink on - Blocca link\n\nScrivi .admin per il menu admin completo!',
            delay: 4000
        },
        {
            step: 6,
            message: '📚 OTTENERE AIUTO\n\nHai bisogno di più informazioni?\n\n.menu - Vedi tutti i comandi organizzati\n.help <comando> - Ottieni aiuto su comando specifico\n.admin - Menu comandi admin\n.games - Lista tutti i giochi\n.updates - Vedi le novità\n\n💡 SUGGERIMENTO: Tutti i comandi iniziano con un punto (.)\n💡 Esempio: .daily o .bank',
            delay: 3000
        },
        {
            step: 7,
            message: '✅ SEI PRONTO!\n\nInizia il tuo viaggio:\n\n1️⃣ Scrivi .daily per ottenere le tue prime monete\n2️⃣ Scrivi .slot 10 per provare un gioco\n3️⃣ Scrivi .menu per esplorare di più\n\nRicorda:\n• I comandi iniziano con un punto (.)\n• Puoi usarmi nei gruppi o in chat privata\n• Divertiti e sii rispettoso!\n\n🎉 Benvenuto nella comunità!',
            delay: 0
        }
    ],
    ru: [
        {
            step: 1,
            message: '🤖 ЧТО ТАКОЕ ЭТОТ БОТ?\n\neli6s bot - ваш универсальный помощник в WhatsApp!\n\nДумайте обо мне как о полезном роботе, который живет в ваших группах и чатах WhatsApp. Я могу:\n\n✨ Играть с вами в игры\n💰 Управлять виртуальными монетами\n👮 Помогать админам управлять группами\n🎯 И многое другое!\n\nЯ отвечаю на команды, которые начинаются с точки (.)\n\nПозвольте мне показать, как меня использовать...',
            delay: 3000
        },
        {
            step: 2,
            message: '💰 ЭКОНОМИЧЕСКАЯ СИСТЕМА\n\nЗарабатывайте и тратьте виртуальные монеты!\n\nВы начинаете со 100 монет бесплатно.\n\n📅 .daily - Получайте 100-300 монет каждый день\n🏦 .bank - Проверьте свой баланс\n💸 .pay @пользователь 50 - Отправьте монеты друзьям\n🏆 .leaderboard - Посмотрите топ игроков\n\nМонеты используются для игр и покупки предметов в магазине!',
            delay: 3500
        },
        {
            step: 3,
            message: '🎮 ИГРЫ И РАЗВЛЕЧЕНИЯ\n\nИграйте в игры, чтобы выиграть монеты!\n\n🃏 .blackjack 100 - Карточная игра казино\n🎰 .slot 50 - Игровой автомат\n🎲 .dice 25 - Бросьте кости\n🎡 .roulette красный 100 - Колесо рулетки\n♟️ .chess @друг - Играйте в шахматы\n🎯 .8ball <вопрос> - Магический шар 8\n\nНапишите .games чтобы увидеть все 14+ игр!',
            delay: 3500
        },
        {
            step: 4,
            message: '🛍️ МАГАЗИН И ПРЕДМЕТЫ\n\nПокупайте усиления и оружие!\n\n.shop - Просмотрите доступные предметы\n.buy <предмет> - Купите предмет\n.inventory - Посмотрите, что у вас есть\n\nПопулярные предметы:\n🍀 Талисман удачи - Лучшая удача в играх\n🛡️ Анти-грабеж - Защитите свои монеты\n🔫 Оружие - Атакуйте других игроков\n💎 VIP пропуск - Эксклюзивные преимущества',
            delay: 3500
        },
        {
            step: 5,
            message: '👮 УПРАВЛЕНИЕ ГРУППОЙ\n(Для админов группы)\n\nПоддерживайте порядок в группе!\n\n👤 .kick @пользователь - Удалить кого-то\n🚫 .ban @пользователь - Забанить кого-то\n⭐ .promote @пользователь - Сделать админом\n⬇️ .demote @пользователь - Снять админа\n⚠️ .warn @пользователь - Дать предупреждение\n🔇 .mute @пользователь - Заглушить кого-то\n🏷️ .tagall - Упомянуть всех\n🔗 .antilink on - Блокировать ссылки\n\nНапишите .admin для полного меню админа!',
            delay: 4000
        },
        {
            step: 6,
            message: '📚 ПОЛУЧЕНИЕ ПОМОЩИ\n\nНужна дополнительная информация?\n\n.menu - Посмотрите все команды\n.help <команда> - Получите помощь по конкретной команде\n.admin - Меню команд админа\n.games - Список всех игр\n.updates - Посмотрите что нового\n\n💡 СОВЕТ: Все команды начинаются с точки (.)\n💡 Пример: .daily или .bank',
            delay: 3000
        },
        {
            step: 7,
            message: '✅ ВЫ ГОТОВЫ!\n\nНачните свое путешествие:\n\n1️⃣ Напишите .daily чтобы получить первые монеты\n2️⃣ Напишите .slot 10 чтобы попробовать игру\n3️⃣ Напишите .menu чтобы узнать больше\n\nПомните:\n• Команды начинаются с точки (.)\n• Вы можете использовать меня в группах или личных чатах\n• Веселитесь и будьте уважительны!\n\n🎉 Добро пожаловать в сообщество!',
            delay: 0
        }
    ],
    es: [
        {
            step: 1,
            message: '👋 ¡Bienvenido a eli6s bot!\n\nEstoy aquí para ayudarte con juegos, economía y gestión de grupos.\n\nDéjame mostrarte cómo funciona...',
            delay: 2000
        },
        {
            step: 2,
            message: '💰 SISTEMA DE ECONOMÍA\n\n¡Empiezas con 100 monedas!\n\nEscribe .daily para reclamar monedas gratis cada día\nEscribe .bank para verificar tu saldo\nEscribe .pay @usuario <cantidad> para enviar monedas',
            delay: 3000
        },
        {
            step: 3,
            message: '🎮 JUEGOS\n\nPrueba estos juegos populares:\n\n🃏 .blackjack <apuesta> - Jugar blackjack\n🎰 .slot <apuesta> - Girar las tragamonedas\n🎲 .dice <apuesta> - Lanzar los dados\n♟️ .chess @oponente - Jugar ajedrez\n\n¡Escribe .games para la lista completa!',
            delay: 3000
        },
        {
            step: 4,
            message: '🛍️ TIENDA\n\n¡Gasta tus monedas en la tienda!\n\nEscribe .shop para ver artículos disponibles\nEscribe .inventory para ver lo que tienes',
            delay: 2500
        },
        {
            step: 5,
            message: '📚 AYUDA Y COMANDOS\n\nEscribe .menu para ver todos los comandos\nEscribe .help <comando> para ayuda específica\n\nPara admins del grupo:\nEscribe .admin para ver comandos de admin',
            delay: 2500
        },
        {
            step: 6,
            message: '✅ ¡Estás listo!\n\nComienza reclamando tus monedas diarias: .daily\n\n¡Diviértete! 🎉',
            delay: 0
        }
    ],
    pt: [
        {
            step: 1,
            message: '👋 Bem-vindo ao eli6s bot!\n\nEstou aqui para ajudá-lo com jogos, economia e gerenciamento de grupos.\n\nDeixe-me mostrar como funciona...',
            delay: 2000
        },
        {
            step: 2,
            message: '💰 SISTEMA DE ECONOMIA\n\nVocê começa com 100 moedas!\n\nDigite .daily para reivindicar moedas grátis todos os dias\nDigite .bank para verificar seu saldo\nDigite .pay @usuário <quantidade> para enviar moedas',
            delay: 3000
        },
        {
            step: 3,
            message: '🎮 JOGOS\n\nExperimente estes jogos populares:\n\n🃏 .blackjack <aposta> - Jogar blackjack\n🎰 .slot <aposta> - Girar os slots\n🎲 .dice <aposta> - Rolar os dados\n♟️ .chess @oponente - Jogar xadrez\n\nDigite .games para a lista completa!',
            delay: 3000
        },
        {
            step: 4,
            message: '🛍️ LOJA\n\nGaste suas moedas na loja!\n\nDigite .shop para ver itens disponíveis\nDigite .inventory para ver o que você possui',
            delay: 2500
        },
        {
            step: 5,
            message: '📚 AJUDA E COMANDOS\n\nDigite .menu para ver todos os comandos\nDigite .help <comando> para ajuda específica\n\nPara admins do grupo:\nDigite .admin para ver comandos de admin',
            delay: 2500
        },
        {
            step: 6,
            message: '✅ Você está pronto!\n\nComece reivindicando suas moedas diárias: .daily\n\nDivirta-se! 🎉',
            delay: 0
        }
    ],
    ar: [
        {
            step: 1,
            message: '👋 مرحبا بك في eli6s bot!\n\nأنا هنا لمساعدتك في الألعاب والاقتصاد وإدارة المجموعات.\n\nدعني أريك كيف يعمل...',
            delay: 2000
        },
        {
            step: 2,
            message: '💰 نظام الاقتصاد\n\nتبدأ بـ 100 عملة!\n\nاكتب .daily للحصول على عملات مجانية كل يوم\nاكتب .bank للتحقق من رصيدك\nاكتب .pay @مستخدم <المبلغ> لإرسال العملات',
            delay: 3000
        },
        {
            step: 3,
            message: '🎮 الألعاب\n\nجرب هذه الألعاب الشعبية:\n\n🃏 .blackjack <رهان> - العب بلاك جاك\n🎰 .slot <رهان> - قم بتدوير السلوتس\n🎲 .dice <رهان> - ارمي النرد\n♟️ .chess @خصم - العب شطرنج\n\nاكتب .games للقائمة الكاملة!',
            delay: 3000
        },
        {
            step: 4,
            message: '🛍️ المتجر\n\nأنفق عملاتك في المتجر!\n\nاكتب .shop لرؤية العناصر المتاحة\nاكتب .inventory لرؤية ما تملكه',
            delay: 2500
        },
        {
            step: 5,
            message: '📚 المساعدة والأوامر\n\nاكتب .menu لرؤية جميع الأوامر\nاكتب .help <أمر> للمساعدة المحددة\n\nلمسؤولي المجموعة:\nاكتب .admin لرؤية أوامر المسؤول',
            delay: 2500
        },
        {
            step: 6,
            message: '✅ أنت جاهز!\n\nابدأ بالمطالبة بعملاتك اليومية: .daily\n\nاستمتع! 🎉',
            delay: 0
        }
    ],
    hi: [
        {
            step: 1,
            message: '👋 eli6s bot में आपका स्वागत है!\n\nमैं गेम्स, इकोनॉमी और ग्रुप मैनेजमेंट में आपकी मदद के लिए यहां हूं।\n\nमुझे आपको दिखाने दें...',
            delay: 2000
        },
        {
            step: 2,
            message: '💰 इकोनॉमी सिस्टम\n\nआप 100 कॉइन्स से शुरू करते हैं!\n\n.daily टाइप करें हर दिन मुफ्त कॉइन्स पाने के लिए\n.bank टाइप करें अपना बैलेंस चेक करने के लिए\n.pay @यूज़र <राशि> टाइप करें कॉइन्स भेजने के लिए',
            delay: 3000
        },
        {
            step: 3,
            message: '🎮 गेम्स\n\nये लोकप्रिय गेम्स आज़माएं:\n\n🃏 .blackjack <बेट> - ब्लैकजैक खेलें\n🎰 .slot <बेट> - स्लॉट्स स्पिन करें\n🎲 .dice <बेट> - डाइस रोल करें\n♟️ .chess @प्रतिद्वंद्वी - शतरंज खेलें\n\nपूरी लिस्ट के लिए .games टाइप करें!',
            delay: 3000
        },
        {
            step: 4,
            message: '🛍️ शॉप\n\nअपने कॉइन्स शॉप में खर्च करें!\n\n.shop टाइप करें उपलब्ध आइटम देखने के लिए\n.inventory टाइप करें अपनी चीज़ें देखने के लिए',
            delay: 2500
        },
        {
            step: 5,
            message: '📚 हेल्प और कमांड्स\n\n.menu टाइप करें सभी कमांड्स देखने के लिए\n.help <कमांड> टाइप करें विशिष्ट मदद के लिए\n\nग्रुप एडमिन के लिए:\n.admin टाइप करें एडमिन कमांड्स देखने के लिए',
            delay: 2500
        },
        {
            step: 6,
            message: '✅ आप तैयार हैं!\n\nअपने डेली कॉइन्स क्लेम करके शुरू करें: .daily\n\nमज़े करें! 🎉',
            delay: 0
        }
    ],
    ng: [
        {
            step: 1,
            message: '👋 Welcome to eli6s bot!\n\nI dey here to help you with games, economy and group management.\n\nMake I show you how e dey work...',
            delay: 2000
        },
        {
            step: 2,
            message: '💰 ECONOMY SYSTEM\n\nYou go start with 100 coins!\n\nType .daily make you claim free coins every day\nType .bank make you check your balance\nType .pay @user <amount> make you send coins',
            delay: 3000
        },
        {
            step: 3,
            message: '🎮 GAMES\n\nTry these popular games:\n\n🃏 .blackjack <bet> - Play blackjack\n🎰 .slot <bet> - Spin di slots\n🎲 .dice <bet> - Roll di dice\n♟️ .chess @opponent - Play chess\n\nType .games for full list!',
            delay: 3000
        },
        {
            step: 4,
            message: '🛍️ SHOP\n\nSpend your coins for shop!\n\nType .shop make you see available items\nType .inventory make you see wetin you get',
            delay: 2500
        },
        {
            step: 5,
            message: '📚 HELP & COMMANDS\n\nType .menu make you see all commands\nType .help <command> for specific help\n\nFor group admins:\nType .admin make you see admin commands',
            delay: 2500
        },
        {
            step: 6,
            message: '✅ You don ready!\n\nStart by claiming your daily coins: .daily\n\nEnjoy! 🎉',
            delay: 0
        }
    ]
};

// Language selection prompts
const languagePrompts = {
    initial: '🌍 Welcome! Please select your language:\n\n1️⃣ English (en)\n2️⃣ Italiano (it)\n3️⃣ Русский (ru)\n4️⃣ Español (es)\n5️⃣ Português (pt)\n6️⃣ العربية (ar)\n7️⃣ हिंदी (hi)\n8️⃣ Nigerian Pidgin (ng)\n\nReply with the number (1-8) or language code (e.g., "en" or "ng")',
    invalid: '❌ Invalid selection. Please choose a number (1-8) or language code: en, it, ru, es, pt, ar, hi, ng',
    selected: {
        en: '✅ Language set to English! Starting guide...',
        it: '✅ Lingua impostata su Italiano! Avvio guida...',
        ru: '✅ Язык установлен на Русский! Запуск руководства...',
        es: '✅ Idioma establecido en Español! Iniciando guía...',
        pt: '✅ Idioma definido para Português! Iniciando guia...',
        ar: '✅ تم تعيين اللغة إلى العربية! بدء الدليل...',
        hi: '✅ भाषा हिंदी पर सेट की गई! गाइड शुरू हो रहा है...',
        ng: '✅ Language don set to Nigerian Pidgin! Guide dey start...'
    }
};

// Map numbers to language codes
const numberToLang = {
    '1': 'en',
    '2': 'it',
    '3': 'ru',
    '4': 'es',
    '5': 'pt',
    '6': 'ar',
    '7': 'hi',
    '8': 'ng'
};

// Send guide steps
async function sendGuideSteps(sock, jid, language) {
    const steps = guideSteps[language] || guideSteps.en;
    
    for (const step of steps) {
        if (step.delay > 0) {
            await new Promise(resolve => setTimeout(resolve, step.delay));
        }
        
        await sendAsChannelForward(sock, jid, step.message, {
            newsletterName: config.botName || 'Bot Guide'
        });
    }
}

// Cancel guide function
export function cancelGuide(jid) {
    if (pendingLanguageSelection.has(jid)) {
        pendingLanguageSelection.delete(jid);
        return true;
    }
    return false;
}

export default {
    name: 'guide',
    aliases: ['tutorial', 'start'],
    category: 'general',
    desc: 'Interactive guide to learn how to use the bot',
    
    async execute(sock, msg, args) {
        const sender = msg.key.remoteJid;
        const senderLid = msg.key.senderLid;
        const isGroup = sender.endsWith('@g.us');
        
        // Guide only works in private chat
        if (isGroup) {
            return await sock.sendMessage(sender, {
                text: '❌ The guide is only available in private chat. Send me a direct message and type .guide'
            }, { quoted: msg });
        }
        
        try {
            // Check if user is already in language selection (check both JID formats)
            const hasPending = pendingLanguageSelection.has(sender) || 
                              (senderLid && pendingLanguageSelection.has(senderLid));
            
            if (hasPending) {
                return await sock.sendMessage(sender, {
                    text: '⏳ Please select a language first from the options above.'
                }, { quoted: msg });
            }
            
            // Store state for both JID formats to handle WhatsApp's dual JID system
            const timestamp = Date.now();
            const state = { timestamp };
            
            pendingLanguageSelection.set(sender, state);
            if (senderLid && senderLid !== sender) {
                pendingLanguageSelection.set(senderLid, state);
            }
            
            await sendAsChannelForward(sock, sender, languagePrompts.initial, {
                quoted: msg,
                newsletterName: config.botName || 'Bot Guide'
            });
            
            logger.info('Guide language selection started', { sender, senderLid });
            
        } catch (error) {
            logger.error('Error starting guide', { sender, error: error.message });
            await sock.sendMessage(sender, {
                text: '❌ An error occurred while starting the guide. Please try again.'
            }, { quoted: msg });
        }
    }
};

// Handle language selection response
export async function handleLanguageSelection(sock, msg, text) {
    const sender = msg.key.remoteJid;
    const senderLid = msg.key.senderLid; // Alternative LID format
    
    // Check both regular JID and LID format
    const hasPending = pendingLanguageSelection.has(sender) || 
                      (senderLid && pendingLanguageSelection.has(senderLid));
    
    if (!hasPending) {
        return false;
    }
    
    // Get state from whichever JID format was used
    const actualSender = pendingLanguageSelection.has(sender) ? sender : senderLid;
    const state = pendingLanguageSelection.get(actualSender);
    const messageTimestamp = msg.messageTimestamp ? msg.messageTimestamp * 1000 : Date.now(); // Convert to milliseconds
    
    // Ignore messages sent before the guide was initiated (with 1 second buffer for timing issues)
    if (messageTimestamp < (state.timestamp - 1000)) {
        // This is an old message from before .guide was called, ignore it
        logger.debug('Ignoring old message', { 
            sender: actualSender, 
            messageTime: messageTimestamp, 
            guideTime: state.timestamp,
            text 
        });
        return false;
    }
    
    const input = text.toLowerCase().trim();
    
    // Check if input is a number (1-7) or language code
    let langCode;
    if (numberToLang[input]) {
        langCode = numberToLang[input];
    } else {
        langCode = input;
    }
    
    const validLanguages = ['en', 'it', 'ru', 'es', 'pt', 'ar', 'hi', 'ng'];
    
    if (!validLanguages.includes(langCode)) {
        await sendAsChannelForward(sock, sender, languagePrompts.invalid, {
            quoted: msg,
            newsletterName: config.botName || 'Bot Guide'
        });
        return true;
    }
    
    // Remove from pending (check both JID formats)
    pendingLanguageSelection.delete(actualSender);
    if (sender !== actualSender) {
        pendingLanguageSelection.delete(sender);
    }
    if (senderLid && senderLid !== actualSender) {
        pendingLanguageSelection.delete(senderLid);
    }
    
    // Update user language preference (use the regular JID for database)
    const dbJid = sender.includes('@s.whatsapp.net') ? sender : actualSender;
    try {
        const user = getUser(dbJid);
        if (user) {
            updateUser(dbJid, { language: langCode });
        }
    } catch (error) {
        logger.error('Error updating user language', { sender: dbJid, error: error.message });
    }
    
    // Send confirmation (use the JID that works for sending)
    await sendAsChannelForward(sock, actualSender, languagePrompts.selected[langCode], {
        quoted: msg,
        newsletterName: config.botName || 'Bot Guide'
    });
    
    // Small delay before starting guide
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Send guide steps
    await sendGuideSteps(sock, actualSender, langCode);
    
    logger.info('Guide completed', { sender: actualSender, language: langCode });
    
    return true;
}
