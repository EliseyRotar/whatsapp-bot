import { getBalance, removeCoins, addCoins } from '../../utils/bank_SAFE.js';
import { getGroupLanguage } from '../../utils/language.js';
import { loadInventory, saveInventory, isItemActive, getUserBadge, getCoinMultiplier, getLuckBoost } from '../../utils/shopSystem.js';

// Shop items database
const SHOP_ITEMS = {
    // Badges (Cosmetic + Status)
    vip: {
        id: 'vip',
        price: 75000,
        type: 'badge',
        emoji: '👑',
        duration: 3,
        description: 'VIP status badge'
    },
    premium: {
        id: 'premium',
        price: 150000,
        type: 'badge',
        emoji: '💎',
        duration: 3,
        description: 'Premium status badge'
    },
    legend: {
        id: 'legend',
        price: 350000,
        type: 'badge',
        emoji: '🏆',
        duration: 3,
        description: 'Legend status badge'
    },
    god: {
        id: 'god',
        price: 750000,
        type: 'badge',
        emoji: '⚡',
        duration: 3,
        description: 'God tier status badge'
    },
    
    // Coin Multipliers (Actually work in games)
    double_coins: {
        id: 'double_coins',
        price: 40000,
        type: 'multiplier',
        emoji: '💰',
        multiplier: 2,
        duration: 2,
        description: '2x coins from all games'
    },
    triple_coins: {
        id: 'triple_coins',
        price: 120000,
        type: 'multiplier',
        emoji: '💸',
        multiplier: 3,
        duration: 2,
        description: '3x coins from all games'
    },
    mega_multiplier: {
        id: 'mega_multiplier',
        price: 300000,
        type: 'multiplier',
        emoji: '🤑',
        multiplier: 5,
        duration: 3,
        description: '5x coins from all games'
    },
    
    // Luck Boosters (Increase win chances)
    lucky_charm: {
        id: 'lucky_charm',
        price: 25000,
        type: 'luck',
        emoji: '🍀',
        boost: 10,
        duration: 3,
        description: '+10% win chance in games'
    },
    mega_luck: {
        id: 'mega_luck',
        price: 75000,
        type: 'luck',
        emoji: '✨',
        boost: 25,
        duration: 3,
        description: '+25% win chance in games'
    },
    ultra_luck: {
        id: 'ultra_luck',
        price: 225000,
        type: 'luck',
        emoji: '🌟',
        boost: 50,
        duration: 3,
        description: '+50% win chance in games'
    },
    
    // Protection Items
    anti_rob: {
        id: 'anti_rob',
        price: 100000,
        type: 'protection',
        emoji: '🛡️',
        duration: 2,
        description: 'Protect from being robbed'
    },
    insurance: {
        id: 'insurance',
        price: 80000,
        type: 'protection',
        emoji: '🏦',
        duration: 3,
        description: 'Get 50% back when you lose'
    },
    
    // Daily Bonuses
    daily_booster: {
        id: 'daily_booster',
        price: 35000,
        type: 'daily',
        emoji: '📅',
        duration: 3,
        description: '2x daily reward'
    },
    mega_daily: {
        id: 'mega_daily',
        price: 90000,
        type: 'daily',
        emoji: '🎁',
        duration: 3,
        description: '3x daily reward'
    },
    
    // XP Boosters
    xp_boost: {
        id: 'xp_boost',
        price: 50000,
        type: 'xp',
        emoji: '⭐',
        duration: 3,
        description: '+50% XP from activities'
    },
    mega_xp: {
        id: 'mega_xp',
        price: 150000,
        type: 'xp',
        emoji: '🌠',
        duration: 3,
        description: '+100% XP from activities'
    },
    
    // Special Items
    name_color: {
        id: 'name_color',
        price: 30000,
        type: 'cosmetic',
        emoji: '🎨',
        duration: 3,
        description: 'Colored name in leaderboards'
    },
    custom_title: {
        id: 'custom_title',
        price: 60000,
        type: 'cosmetic',
        emoji: '📛',
        duration: 3,
        description: 'Custom title display'
    },
    
    // Power-ups
    auto_win: {
        id: 'auto_win',
        price: 750000,
        type: 'powerup',
        emoji: '🎯',
        duration: 1,
        description: 'Guaranteed win next game (1 day)'
    },
    coin_magnet: {
        id: 'coin_magnet',
        price: 120000,
        type: 'powerup',
        emoji: '🧲',
        duration: 3,
        description: 'Find random coins daily'
    },
    
    // Weapons (Single-use for .kill command)
    knife: {
        id: 'knife',
        price: 25000,
        type: 'weapon',
        emoji: '🔪',
        duration: 0, // Single use
        description: 'Kill weapon - 30% success rate'
    },
    pistol: {
        id: 'pistol',
        price: 75000,
        type: 'weapon',
        emoji: '🔫',
        duration: 0,
        description: 'Kill weapon - 50% success rate'
    },
    rifle: {
        id: 'rifle',
        price: 175000,
        type: 'weapon',
        emoji: '🔫',
        duration: 0,
        description: 'Kill weapon - 70% success rate'
    },
    sniper: {
        id: 'sniper',
        price: 350000,
        type: 'weapon',
        emoji: '🎯',
        duration: 0,
        description: 'Kill weapon - 85% success rate'
    },
    rpg: {
        id: 'rpg',
        price: 750000,
        type: 'weapon',
        emoji: '🚀',
        duration: 0,
        description: 'Kill weapon - 95% success rate'
    },
    
    // Shields (Defense against .kill)
    shield_small: {
        id: 'shield_small',
        price: 50000,
        type: 'shield',
        emoji: '🔵',
        duration: 24, // hours (stored for display)
        description: '25% protection - Blocks 2 kills - 24h'
    },
    shield_large: {
        id: 'shield_large',
        price: 150000,
        type: 'shield',
        emoji: '💙',
        duration: 24,
        description: '50% protection - Blocks 3 kills - 24h'
    },
    chug_jug: {
        id: 'chug_jug',
        price: 500000,
        type: 'shield',
        emoji: '🌟',
        duration: 48,
        description: '100% protection - Blocks 1 kill - 48h'
    }
};

const responses = {
    en: {
        title: '🏪 VIRTUAL SHOP 🏪\n\n',
        howToBuy: '💡 HOW TO BUY: .shop buy <item>\n   Example: .shop buy anti_rob\n\n',
        balance: '💰 Your Balance: {balance} coins\n\n',
        categories: '📦 CATEGORIES:\n',
        badges: '👑 BADGES & STATUS',
        multipliers: '💰 COIN MULTIPLIERS',
        luck: '🍀 LUCK BOOSTERS',
        protection: '🛡️ PROTECTION',
        cosmetics: '🎨 COSMETICS',
        weapons: '🔫 WEAPONS (Single-use)',
        shields: '🛡️ SHIELDS (Defense)',
        
        items: {
            vip: 'VIP Badge - 3 days',
            premium: 'Premium Badge - 3 days',
            legend: 'Legend Badge - 3 days',
            god: 'God Badge - 3 days',
            double_coins: '2x Coin Multiplier - 2 days',
            triple_coins: '3x Coin Multiplier - 2 days',
            mega_multiplier: '5x Coin Multiplier - 3 days',
            lucky_charm: '+10% Luck Boost - 3 days',
            mega_luck: '+25% Luck Boost - 3 days',
            ultra_luck: '+50% Luck Boost - 3 days',
            anti_rob: 'Anti-Rob Protection - 2 days',
            insurance: 'Loss Insurance - 3 days',
            daily_booster: '2x Daily Reward - 3 days',
            mega_daily: '3x Daily Reward - 3 days',
            xp_boost: '+50% XP Boost - 3 days',
            mega_xp: '+100% XP Boost - 3 days',
            name_color: 'Colored Name - 3 days',
            custom_title: 'Custom Title - 3 days',
            auto_win: 'Auto Win - 1 day',
            coin_magnet: 'Coin Magnet - 3 days',
            shield_small: 'Small Shield - 25% protection',
            shield_large: 'Large Shield - 50% protection',
            chug_jug: 'Chug Jug - 100% protection'
        },
        
        usage: '\n💡 Usage:\n• .shop - View all items\n• .shop buy <item> - Purchase item\n• .shop inventory - View your items\n\nExample: .shop buy vip',
        
        buySuccess: '✅ PURCHASE SUCCESSFUL!\n\n{emoji} Item: {item}\n💰 Paid: {price} coins\n💵 Remaining: {balance} coins\n⏰ Duration: {duration} days\n\n🎉 Enjoy your purchase!',
        buyError: '❌ Purchase failed: {error}',
        notEnoughCoins: 'Not enough coins! You need {price} coins but only have {balance} coins.',
        invalidItem: 'Invalid item! Use .shop to see available items.',
        alreadyOwned: 'You already own this item! It expires on {date}.',
        
        inventory: '🎒 YOUR INVENTORY\n\n',
        inventoryEmpty: '🎒 Your inventory is empty!\n\nVisit .shop to buy items.',
        activeItems: '✅ Active Items:\n',
        expiredItems: '\n❌ Expired Items:\n',
        expires: 'Expires: {date}',
        expired: 'Expired: {date}'
    },
    it: {
        title: '🏪 NEGOZIO VIRTUALE 🏪\n\n',
        howToBuy: '💡 COME COMPRARE: .shop buy <articolo>\n   Esempio: .shop buy anti_rob\n\n',
        balance: '💰 Tuo Saldo: {balance} monete\n\n',
        categories: '📦 CATEGORIE:\n',
        badges: '👑 BADGE & STATUS',
        multipliers: '💰 MOLTIPLICATORI MONETE',
        luck: '🍀 POTENZIATORI FORTUNA',
        protection: '🛡️ PROTEZIONE',
        cosmetics: '🎨 COSMETICI',
        
        items: {
            vip: 'Badge VIP - 3 giorni',
            premium: 'Badge Premium - 3 giorni',
            legend: 'Badge Leggenda - 3 giorni',
            god: 'Badge Dio - 3 giorni',
            double_coins: 'Moltiplicatore 2x - 2 giorni',
            triple_coins: 'Moltiplicatore 3x - 2 giorni',
            mega_multiplier: 'Moltiplicatore 5x - 3 giorni',
            lucky_charm: '+10% Fortuna - 3 giorni',
            mega_luck: '+25% Fortuna - 3 giorni',
            ultra_luck: '+50% Fortuna - 3 giorni',
            anti_rob: 'Protezione Anti-Furto - 2 giorni',
            insurance: 'Assicurazione Perdite - 3 giorni',
            daily_booster: '2x Ricompensa Giornaliera - 3 giorni',
            mega_daily: '3x Ricompensa Giornaliera - 3 giorni',
            xp_boost: '+50% Boost XP - 3 giorni',
            mega_xp: '+100% Boost XP - 3 giorni',
            name_color: 'Nome Colorato - 3 giorni',
            custom_title: 'Titolo Personalizzato - 3 giorni',
            auto_win: 'Vittoria Automatica - 1 giorno',
            coin_magnet: 'Magnete Monete - 3 giorni',
            shield_small: 'Scudo Piccolo - 25% protezione',
            shield_large: 'Scudo Grande - 50% protezione',
            chug_jug: 'Chug Jug - 100% protezione'
        },
        
        usage: '\n💡 Uso:\n• .shop - Vedi tutti gli articoli\n• .shop buy <articolo> - Acquista articolo\n• .shop inventory - Vedi i tuoi articoli\n\nEsempio: .shop buy vip',
        
        buySuccess: '✅ ACQUISTO RIUSCITO!\n\n{emoji} Articolo: {item}\n💰 Pagato: {price} monete\n💵 Rimanenti: {balance} monete\n⏰ Durata: {duration} giorni\n\n🎉 Goditi il tuo acquisto!',
        buyError: '❌ Acquisto fallito: {error}',
        notEnoughCoins: 'Monete insufficienti! Servono {price} monete ma ne hai solo {balance}.',
        invalidItem: 'Articolo non valido! Usa .shop per vedere gli articoli disponibili.',
        alreadyOwned: 'Possiedi già questo articolo! Scade il {date}.',
        
        inventory: '🎒 IL TUO INVENTARIO\n\n',
        inventoryEmpty: '🎒 Il tuo inventario è vuoto!\n\nVisita .shop per comprare articoli.',
        activeItems: '✅ Articoli Attivi:\n',
        expiredItems: '\n❌ Articoli Scaduti:\n',
        expires: 'Scade: {date}',
        expired: 'Scaduto: {date}'
    },
    ru: {
        title: '🏪 ВИРТУАЛЬНЫЙ МАГАЗИН 🏪\n\n',
        howToBuy: '💡 КАК КУПИТЬ: .shop buy <предмет>\n   Пример: .shop buy anti_rob\n\n',
        balance: '💰 Ваш Баланс: {balance} монет\n\n',
        categories: '📦 КАТЕГОРИИ:\n',
        badges: '👑 ЗНАЧКИ И СТАТУС',
        multipliers: '💰 МНОЖИТЕЛИ МОНЕТ',
        luck: '🍀 УСИЛИТЕЛИ УДАЧИ',
        protection: '🛡️ ЗАЩИТА',
        cosmetics: '🎨 КОСМЕТИКА',
        
        items: {
            vip: 'VIP Значок - 3 дня',
            premium: 'Premium Значок - 3 дня',
            legend: 'Легенда Значок - 3 дня',
            double_coins: '2x Множитель - 2 дня',
            triple_coins: '3x Множитель - 2 дня',
            lucky_charm: '+10% Удача - 3 дня',
            mega_luck: '+25% Удача - 3 дня',
            anti_rob: 'Защита от Кражи - 2 дня',
            name_color: 'Цветное Имя - 3 дня',
            custom_title: 'Свой Титул - 3 дня',
            shield_small: 'Малый Щит - 25% защита',
            shield_large: 'Большой Щит - 50% защита',
            chug_jug: 'Chug Jug - 100% защита'
        },
        
        usage: '\n💡 Использование:\n• .shop - Посмотреть все предметы\n• .shop buy <предмет> - Купить предмет\n• .shop inventory - Посмотреть инвентарь\n\nПример: .shop buy vip',
        
        buySuccess: '✅ ПОКУПКА УСПЕШНА!\n\n{emoji} Предмет: {item}\n💰 Оплачено: {price} монет\n💵 Осталось: {balance} монет\n⏰ Длительность: {duration} дней\n\n🎉 Наслаждайтесь покупкой!',
        buyError: '❌ Покупка не удалась: {error}',
        notEnoughCoins: 'Недостаточно монет! Нужно {price} монет, но у вас только {balance}.',
        invalidItem: 'Неверный предмет! Используйте .shop для просмотра доступных предметов.',
        alreadyOwned: 'У вас уже есть этот предмет! Истекает {date}.',
        
        inventory: '🎒 ВАШ ИНВЕНТАРЬ\n\n',
        inventoryEmpty: '🎒 Ваш инвентарь пуст!\n\nПосетите .shop чтобы купить предметы.',
        activeItems: '✅ Активные Предметы:\n',
        expiredItems: '\n❌ Истекшие Предметы:\n',
        expires: 'Истекает: {date}',
        expired: 'Истек: {date}'
    },
    es: {
        title: '🏪 TIENDA VIRTUAL 🏪\n\n',
        howToBuy: '💡 CÓMO COMPRAR: .shop buy <artículo>\n   Ejemplo: .shop buy anti_rob\n\n',
        balance: '💰 Tu Saldo: {balance} monedas\n\n',
        categories: '📦 CATEGORÍAS:\n',
        badges: '👑 INSIGNIAS Y ESTADO',
        multipliers: '💰 MULTIPLICADORES DE MONEDAS',
        luck: '🍀 POTENCIADORES DE SUERTE',
        protection: '🛡️ PROTECCIÓN',
        cosmetics: '🎨 COSMÉTICOS',
        
        items: {
            vip: 'Insignia VIP - 3 días',
            premium: 'Insignia Premium - 3 días',
            legend: 'Insignia Leyenda - 3 días',
            double_coins: 'Multiplicador 2x - 2 días',
            triple_coins: 'Multiplicador 3x - 2 días',
            lucky_charm: '+10% Suerte - 3 días',
            mega_luck: '+25% Suerte - 3 días',
            anti_rob: 'Protección Anti-Robo - 2 días',
            name_color: 'Nombre Coloreado - 3 días',
            custom_title: 'Título Personalizado - 3 días',
            shield_small: 'Escudo Pequeño - 25% protección',
            shield_large: 'Escudo Grande - 50% protección',
            chug_jug: 'Chug Jug - 100% protección'
        },
        
        usage: '\n💡 Uso:\n• .shop - Ver todos los artículos\n• .shop buy <artículo> - Comprar artículo\n• .shop inventory - Ver tu inventario\n\nEjemplo: .shop buy vip',
        
        buySuccess: '✅ ¡COMPRA EXITOSA!\n\n{emoji} Artículo: {item}\n💰 Pagado: {price} monedas\n💵 Restante: {balance} monedas\n⏰ Duración: {duration} días\n\n🎉 ¡Disfruta tu compra!',
        buyError: '❌ Compra fallida: {error}',
        notEnoughCoins: '¡No tienes suficientes monedas! Necesitas {price} monedas pero solo tienes {balance}.',
        invalidItem: '¡Artículo inválido! Usa .shop para ver los artículos disponibles.',
        alreadyOwned: '¡Ya tienes este artículo! Expira el {date}.',
        
        inventory: '🎒 TU INVENTARIO\n\n',
        inventoryEmpty: '🎒 ¡Tu inventario está vacío!\n\nVisita .shop para comprar artículos.',
        activeItems: '✅ Artículos Activos:\n',
        expiredItems: '\n❌ Artículos Expirados:\n',
        expires: 'Expira: {date}',
        expired: 'Expirado: {date}'
    },
    pt: {
        title: '🏪 LOJA VIRTUAL 🏪\n\n',
        howToBuy: '💡 COMO COMPRAR: .shop buy <item>\n   Exemplo: .shop buy anti_rob\n\n',
        balance: '💰 Seu Saldo: {balance} moedas\n\n',
        categories: '📦 CATEGORIAS:\n',
        badges: '👑 EMBLEMAS E STATUS',
        multipliers: '💰 MULTIPLICADORES DE MOEDAS',
        luck: '🍀 IMPULSIONADORES DE SORTE',
        protection: '🛡️ PROTEÇÃO',
        cosmetics: '🎨 COSMÉTICOS',
        
        items: {
            vip: 'Emblema VIP - 3 dias',
            premium: 'Emblema Premium - 3 dias',
            legend: 'Emblema Lenda - 3 dias',
            double_coins: 'Multiplicador 2x - 2 dias',
            triple_coins: 'Multiplicador 3x - 2 dias',
            lucky_charm: '+10% Sorte - 3 dias',
            mega_luck: '+25% Sorte - 3 dias',
            anti_rob: 'Proteção Anti-Roubo - 2 dias',
            name_color: 'Nome Colorido - 3 dias',
            custom_title: 'Título Personalizado - 3 dias',
            shield_small: 'Escudo Pequeno - 25% proteção',
            shield_large: 'Escudo Grande - 50% proteção',
            chug_jug: 'Chug Jug - 100% proteção'
        },
        
        usage: '\n💡 Uso:\n• .shop - Ver todos os itens\n• .shop buy <item> - Comprar item\n• .shop inventory - Ver seu inventário\n\nExemplo: .shop buy vip',
        
        buySuccess: '✅ COMPRA BEM-SUCEDIDA!\n\n{emoji} Item: {item}\n💰 Pago: {price} moedas\n💵 Restante: {balance} moedas\n⏰ Duração: {duration} dias\n\n🎉 Aproveite sua compra!',
        buyError: '❌ Compra falhou: {error}',
        notEnoughCoins: 'Moedas insuficientes! Você precisa de {price} moedas mas tem apenas {balance}.',
        invalidItem: 'Item inválido! Use .shop para ver os itens disponíveis.',
        alreadyOwned: 'Você já possui este item! Expira em {date}.',
        
        inventory: '🎒 SEU INVENTÁRIO\n\n',
        inventoryEmpty: '🎒 Seu inventário está vazio!\n\nVisite .shop para comprar itens.',
        activeItems: '✅ Itens Ativos:\n',
        expiredItems: '\n❌ Itens Expirados:\n',
        expires: 'Expira: {date}',
        expired: 'Expirado: {date}'
    },
    ar: {
        title: '🏪 المتجر الافتراضي 🏪\n\n',
        howToBuy: '💡 كيفية الشراء: .shop buy <عنصر>\n   مثال: .shop buy anti_rob\n\n',
        balance: '💰 رصيدك: {balance} عملة\n\n',
        categories: '📦 الفئات:\n',
        badges: '👑 الشارات والحالة',
        multipliers: '💰 مضاعفات العملات',
        luck: '🍀 معززات الحظ',
        protection: '🛡️ الحماية',
        cosmetics: '🎨 التجميل',
        
        items: {
            vip: 'شارة VIP - 3 أيام',
            premium: 'شارة Premium - 3 أيام',
            legend: 'شارة الأسطورة - 3 أيام',
            double_coins: 'مضاعف 2x - 2 أيام',
            triple_coins: 'مضاعف 3x - 2 أيام',
            lucky_charm: '+10% حظ - 3 أيام',
            mega_luck: '+25% حظ - 3 أيام',
            anti_rob: 'حماية ضد السرقة - 2 يوم',
            name_color: 'اسم ملون - 3 أيام',
            custom_title: 'لقب مخصص - 3 أيام',
            shield_small: 'درع صغير - 25% حماية',
            shield_large: 'درع كبير - 50% حماية',
            chug_jug: 'Chug Jug - 100% حماية'
        },
        
        usage: '\n💡 الاستخدام:\n• .shop - عرض جميع العناصر\n• .shop buy <عنصر> - شراء عنصر\n• .shop inventory - عرض مخزونك\n\nمثال: .shop buy vip',
        
        buySuccess: '✅ الشراء ناجح!\n\n{emoji} العنصر: {item}\n💰 المدفوع: {price} عملة\n💵 المتبقي: {balance} عملة\n⏰ المدة: {duration} يوم\n\n🎉 استمتع بمشترياتك!',
        buyError: '❌ فشل الشراء: {error}',
        notEnoughCoins: 'عملات غير كافية! تحتاج {price} عملة لكن لديك فقط {balance}.',
        invalidItem: 'عنصر غير صالح! استخدم .shop لرؤية العناصر المتاحة.',
        alreadyOwned: 'لديك هذا العنصر بالفعل! ينتهي في {date}.',
        
        inventory: '🎒 مخزونك\n\n',
        inventoryEmpty: '🎒 مخزونك فارغ!\n\nزر .shop لشراء العناصر.',
        activeItems: '✅ العناصر النشطة:\n',
        expiredItems: '\n❌ العناصر المنتهية:\n',
        expires: 'ينتهي: {date}',
        expired: 'انتهى: {date}'
    },
    hi: {
        title: '🏪 वर्चुअल शॉप 🏪\n\n',
        howToBuy: '💡 कैसे खरीदें: .shop buy <आइटम>\n   उदाहरण: .shop buy anti_rob\n\n',
        balance: '💰 आपका बैलेंस: {balance} कॉइन\n\n',
        categories: '📦 श्रेणियां:\n',
        badges: '👑 बैज और स्टेटस',
        multipliers: '💰 कॉइन मल्टीप्लायर',
        luck: '🍀 लक बूस्टर',
        protection: '🛡️ सुरक्षा',
        cosmetics: '🎨 कॉस्मेटिक',
        weapons: '🔫 हथियार (एक बार उपयोग)',
        
        items: {
            vip: 'VIP बैज - 3 दिन',
            premium: 'प्रीमियम बैज - 3 दिन',
            legend: 'लीजेंड बैज - 3 दिन',
            god: 'गॉड बैज - 3 दिन',
            double_coins: '2x कॉइन मल्टीप्लायर - 2 दिन',
            triple_coins: '3x कॉइन मल्टीप्लायर - 2 दिन',
            mega_multiplier: '5x कॉइन मल्टीप्लायर - 3 दिन',
            lucky_charm: '+10% लक बूस्ट - 3 दिन',
            mega_luck: '+25% लक बूस्ट - 3 दिन',
            ultra_luck: '+50% लक बूस्ट - 3 दिन',
            anti_rob: 'एंटी-रॉब प्रोटेक्शन - 2 दिन',
            insurance: 'लॉस इंश्योरेंस - 3 दिन',
            daily_booster: '2x डेली रिवॉर्ड - 3 दिन',
            mega_daily: '3x डेली रिवॉर्ड - 3 दिन',
            xp_boost: '+50% XP बूस्ट - 3 दिन',
            mega_xp: '+100% XP बूस्ट - 3 दिन',
            name_color: 'रंगीन नाम - 3 दिन',
            custom_title: 'कस्टम टाइटल - 3 दिन',
            auto_win: 'ऑटो विन - 1 दिन',
            coin_magnet: 'कॉइन मैग्नेट - 3 दिन'
        },
        
        usage: '\n💡 उपयोग:\n• .shop - सभी आइटम देखें\n• .shop buy <आइटम> - आइटम खरीदें\n• .shop inventory - अपनी इन्वेंटरी देखें\n\nउदाहरण: .shop buy vip',
        
        buySuccess: '✅ खरीदारी सफल!\n\n{emoji} आइटम: {item}\n💰 भुगतान: {price} कॉइन\n💵 शेष: {balance} कॉइन\n⏰ अवधि: {duration} दिन\n\n🎉 अपनी खरीदारी का आनंद लें!',
        buyError: '❌ खरीदारी विफल: {error}',
        notEnoughCoins: 'पर्याप्त कॉइन नहीं! आपको {price} कॉइन चाहिए लेकिन आपके पास केवल {balance} हैं।',
        invalidItem: 'अमान्य आइटम! उपलब्ध आइटम देखने के लिए .shop का उपयोग करें।',
        alreadyOwned: 'आपके पास पहले से यह आइटम है! यह {date} को समाप्त होता है।',
        
        inventory: '🎒 आपकी इन्वेंटरी\n\n',
        inventoryEmpty: '🎒 आपकी इन्वेंटरी खाली है!\n\nआइटम खरीदने के लिए .shop पर जाएं।',
        activeItems: '✅ सक्रिय आइटम:\n',
        expiredItems: '\n❌ समाप्त आइटम:\n',
        expires: 'समाप्त होता है: {date}',
        expired: 'समाप्त हो गया: {date}'
    },
    ng: {
        title: '🏪 VIRTUAL SHOP 🏪\n\n',
        howToBuy: '💡 HOW TO BUY: .shop buy <item>\n   Example: .shop buy anti_rob\n\n',
        balance: '💰 Your Balance: {balance} coins\n\n',
        categories: '📦 CATEGORIES:\n',
        badges: '👑 BADGES & STATUS',
        multipliers: '💰 COIN MULTIPLIERS',
        luck: '🍀 LUCK BOOSTERS',
        protection: '🛡️ PROTECTION',
        cosmetics: '🎨 COSMETICS',
        weapons: '🔫 WEAPONS (One time use)',
        
        items: {
            vip: 'VIP Badge - 3 days',
            premium: 'Premium Badge - 3 days',
            legend: 'Legend Badge - 3 days',
            god: 'God Badge - 3 days',
            double_coins: '2x Coin Multiplier - 2 days',
            triple_coins: '3x Coin Multiplier - 2 days',
            mega_multiplier: '5x Coin Multiplier - 3 days',
            lucky_charm: '+10% Luck Boost - 3 days',
            mega_luck: '+25% Luck Boost - 3 days',
            ultra_luck: '+50% Luck Boost - 3 days',
            anti_rob: 'Anti-Rob Protection - 2 days',
            insurance: 'Loss Insurance - 3 days',
            daily_booster: '2x Daily Reward - 3 days',
            mega_daily: '3x Daily Reward - 3 days',
            xp_boost: '+50% XP Boost - 3 days',
            mega_xp: '+100% XP Boost - 3 days',
            name_color: 'Colored Name - 3 days',
            custom_title: 'Custom Title - 3 days',
            auto_win: 'Auto Win - 1 day',
            coin_magnet: 'Coin Magnet - 3 days'
        },
        
        usage: '\n💡 How to use:\n• .shop - See all items\n• .shop buy <item> - Buy item\n• .shop inventory - See your items\n\nExample: .shop buy vip',
        
        buySuccess: '✅ E DON WORK!\n\n{emoji} Item: {item}\n💰 You pay: {price} coins\n💵 Wetin remain: {balance} coins\n⏰ E go last: {duration} days\n\n🎉 Enjoy your purchase!',
        buyError: '❌ Wahala dey: {error}',
        notEnoughCoins: 'Coins no reach! You need {price} coins but you only get {balance}.',
        invalidItem: 'Item no dey! Use .shop make you see wetin dey available.',
        alreadyOwned: 'You don already get this item! E go expire for {date}.',
        
        inventory: '🎒 YOUR INVENTORY\n\n',
        inventoryEmpty: '🎒 Your inventory empty o!\n\nGo .shop make you buy items.',
        activeItems: '✅ Active Items:\n',
        expiredItems: '\n❌ Expired Items:\n',
        expires: 'E go expire: {date}',
        expired: 'E don expire: {date}'
    }
};

export default {
    name: 'shop',
    aliases: ['store', 'market'],
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const userId = sender.split('@')[0];
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;

        try {
            const action = args[0]?.toLowerCase();

            // Show inventory
            if (action === 'inventory' || action === 'inv') {
                const inventory = loadInventory(userId);
                
                if (Object.keys(inventory).length === 0) {
                    return await sock.sendMessage(from, {
                        text: t.inventoryEmpty
                    });
                }
                
                let inventoryText = t.inventory;
                const activeItems = [];
                const expiredItems = [];
                
                for (const [itemId, itemData] of Object.entries(inventory)) {
                    const item = SHOP_ITEMS[itemId];
                    if (!item) continue;
                    
                    const expiryDate = new Date(new Date(itemData.purchaseDate).getTime() + (itemData.duration * 24 * 60 * 60 * 1000));
                    const dateStr = expiryDate.toLocaleDateString();
                    
                    const itemText = `${item.emoji} ${t.items[itemId]}\n  ${isItemActive(itemData) ? t.expires : t.expired}: ${dateStr}`;
                    
                    if (isItemActive(itemData)) {
                        activeItems.push(itemText);
                    } else {
                        expiredItems.push(itemText);
                    }
                }
                
                if (activeItems.length > 0) {
                    inventoryText += t.activeItems;
                    inventoryText += activeItems.join('\n\n') + '\n';
                }
                
                if (expiredItems.length > 0) {
                    inventoryText += t.expiredItems;
                    inventoryText += expiredItems.join('\n\n');
                }
                
                return await sock.sendMessage(from, {
                    text: inventoryText
                });
            }

            // Buy item
            if (action === 'buy' && args[1]) {
                const itemId = args[1].toLowerCase();
                const item = SHOP_ITEMS[itemId];
                
                if (!item) {
                    return await sock.sendMessage(from, {
                        text: t.buyError.replace('{error}', t.invalidItem)
                    });
                }
                
                // Check balance
                const balance = await getBalance(sender);
                if (balance < item.price) {
                    return await sock.sendMessage(from, {
                        text: t.buyError.replace('{error}', 
                            t.notEnoughCoins
                                .replace('{price}', item.price.toLocaleString())
                                .replace('{balance}', balance.toLocaleString())
                        )
                    });
                }
                
                // Handle weapons differently (single-use items)
                if (item.type === 'weapon') {
                    // Import weapon functions
                    const { default: killCmd } = await import('../action/kill.js');
                    const weaponsModule = await import('../action/kill.js');
                    
                    // Add weapon to user's arsenal
                    const fs = await import('fs');
                    const weaponsPath = './data/weapons.json';
                    let weapons = {};
                    try {
                        if (fs.existsSync(weaponsPath)) {
                            weapons = JSON.parse(fs.readFileSync(weaponsPath, 'utf8'));
                        }
                    } catch (e) {}
                    
                    if (!weapons[userId]) weapons[userId] = {};
                    weapons[userId][itemId] = (weapons[userId][itemId] || 0) + 1;
                    
                    fs.writeFileSync(weaponsPath, JSON.stringify(weapons, null, 2));
                    
                    // Process purchase
                    await removeCoins(sender, item.price);
                    const newBalance = await getBalance(sender);
                    
                    return await sock.sendMessage(from, {
                        text: `✅ WEAPON PURCHASED!\n\n` +
                              `${item.emoji} Weapon: ${itemId.toUpperCase()}\n` +
                              `💰 Paid: ${item.price.toLocaleString()} coins\n` +
                              `💵 Remaining: ${newBalance.toLocaleString()} coins\n\n` +
                              `🔫 Use: .kill @user ${itemId}\n` +
                              `⚠️ Single-use only!`
                    });
                }
                
                // Handle shields (activate immediately)
                if (item.type === 'shield') {
                    const { activateShield, getUserShield } = await import('../../utils/economy/shieldSystem.js');
                    
                    // Check if user already has an active shield BEFORE touching coins
                    const existingShield = getUserShield(userId);
                    if (existingShield) {
                        return await sock.sendMessage(from, {
                            text: `❌ You already have an active shield!\n\nUse .shield to check your current protection.\n\n💡 Wait for it to expire or break before buying a new one.`
                        });
                    }

                    // Deduct coins FIRST, then activate
                    await removeCoins(sender, item.price);
                    const newBalance = await getBalance(sender);

                    const activation = activateShield(userId, itemId);
                    if (!activation.success) {
                        // Refund if activation failed
                        await addCoins(sender, item.price);
                        return await sock.sendMessage(from, {
                            text: t.buyError.replace('{error}', 'Failed to activate shield')
                        });
                    }
                    
                    const shieldInfo = item.description.split(' - ');
                    
                    return await sock.sendMessage(from, {
                        text: `✅ SHIELD ACTIVATED!\n\n` +
                              `${item.emoji} Shield: ${itemId.toUpperCase()}\n` +
                              `💰 Paid: ${item.price.toLocaleString()} coins\n` +
                              `💵 Remaining: ${newBalance.toLocaleString()} coins\n\n` +
                              `🛡️ Protection: ${shieldInfo[0]}\n` +
                              `🔄 Blocks: ${shieldInfo[1]}\n` +
                              `⏰ Duration: ${shieldInfo[2]}\n\n` +
                              `💡 Use .shield to check status\n` +
                              `🎯 Your shield will protect you from .kill attacks!`
                    });
                }
                
                // Check if user already owns active item (for non-weapons)
                const inventory = loadInventory(userId);
                if (inventory[itemId] && isItemActive(inventory[itemId])) {
                    const expiryDate = new Date(new Date(inventory[itemId].purchaseDate).getTime() + (inventory[itemId].duration * 24 * 60 * 60 * 1000));
                    return await sock.sendMessage(from, {
                        text: t.alreadyOwned.replace('{date}', expiryDate.toLocaleDateString())
                    });
                }
                
                // Process purchase for regular items
                await removeCoins(sender, item.price);
                
                // Add to inventory
                inventory[itemId] = {
                    purchaseDate: new Date().toISOString(),
                    duration: item.duration,
                    price: item.price
                };
                
                saveInventory(userId, inventory);
                
                const newBalance = await getBalance(sender);
                const successMsg = t.buySuccess
                    .replace('{emoji}', item.emoji)
                    .replace('{item}', t.items[itemId])
                    .replace('{price}', item.price.toLocaleString())
                    .replace('{balance}', newBalance.toLocaleString())
                    .replace('{duration}', item.duration);
                
                return await sock.sendMessage(from, {
                    text: successMsg
                });
            }

            // Show shop
            const balance = await getBalance(sender);
            let shopText = t.title;
            shopText += t.howToBuy;
            shopText += t.balance.replace('{balance}', balance.toLocaleString());
            shopText += t.categories + '\n';
            
            // Badges
            shopText += `${t.badges}\n`;
            shopText += `👑 vip - ${SHOP_ITEMS.vip.price.toLocaleString()} 💰\n  ${t.items.vip}\n\n`;
            shopText += `💎 premium - ${SHOP_ITEMS.premium.price.toLocaleString()} 💰\n  ${t.items.premium}\n\n`;
            shopText += `🏆 legend - ${SHOP_ITEMS.legend.price.toLocaleString()} 💰\n  ${t.items.legend}\n\n`;
            
            // Multipliers
            shopText += `${t.multipliers}\n`;
            shopText += `💰 double_coins - ${SHOP_ITEMS.double_coins.price.toLocaleString()} 💰\n  ${t.items.double_coins}\n\n`;
            shopText += `💸 triple_coins - ${SHOP_ITEMS.triple_coins.price.toLocaleString()} 💰\n  ${t.items.triple_coins}\n\n`;
            
            // Luck
            shopText += `${t.luck}\n`;
            shopText += `🍀 lucky_charm - ${SHOP_ITEMS.lucky_charm.price.toLocaleString()} 💰\n  ${t.items.lucky_charm}\n\n`;
            shopText += `✨ mega_luck - ${SHOP_ITEMS.mega_luck.price.toLocaleString()} 💰\n  ${t.items.mega_luck}\n\n`;
            
            // Protection
            shopText += `${t.protection}\n`;
            shopText += `🛡️ anti_rob - ${SHOP_ITEMS.anti_rob.price.toLocaleString()} 💰\n  ${t.items.anti_rob}\n\n`;
            
            // Weapons
            shopText += `${t.weapons}\n`;
            shopText += `🔪 knife - ${SHOP_ITEMS.knife.price.toLocaleString()} 💰\n  30% success rate\n\n`;
            shopText += `🔫 pistol - ${SHOP_ITEMS.pistol.price.toLocaleString()} 💰\n  50% success rate\n\n`;
            shopText += `🔫 rifle - ${SHOP_ITEMS.rifle.price.toLocaleString()} 💰\n  70% success rate\n\n`;
            shopText += `🎯 sniper - ${SHOP_ITEMS.sniper.price.toLocaleString()} 💰\n  85% success rate\n\n`;
            shopText += `🚀 rpg - ${SHOP_ITEMS.rpg.price.toLocaleString()} 💰\n  95% success rate\n\n`;
            
            // Shields
            shopText += `${t.shields || '🛡️ SHIELDS (Defense)'}\n`;
            shopText += `🔵 shield_small - ${SHOP_ITEMS.shield_small.price.toLocaleString()} 💰\n  25% protection - Blocks 2 kills\n\n`;
            shopText += `💙 shield_large - ${SHOP_ITEMS.shield_large.price.toLocaleString()} 💰\n  50% protection - Blocks 3 kills\n\n`;
            shopText += `🌟 chug_jug - ${SHOP_ITEMS.chug_jug.price.toLocaleString()} 💰\n  100% protection - Blocks 1 kill\n\n`;
            
            // Cosmetics
            shopText += `${t.cosmetics}\n`;
            shopText += `🎨 name_color - ${SHOP_ITEMS.name_color.price.toLocaleString()} 💰\n  ${t.items.name_color}\n\n`;
            shopText += `📛 custom_title - ${SHOP_ITEMS.custom_title.price.toLocaleString()} 💰\n  ${t.items.custom_title}\n`;
            
            shopText += t.usage;
            
            await sock.sendMessage(from, {
                text: shopText
            });

        } catch (error) {
            console.error('[SHOP] Command error:', error.message);
            console.error('[SHOP] Stack:', error.stack);
            await sock.sendMessage(from, {
                text: '❌ An error occurred. Please try again.'
            });
        }
    }
};
