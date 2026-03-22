import { getBalance, removeCoins } from '../../utils/bank_SAFE.js';
import { getGroupLanguage } from '../../utils/language.js';
import { validateQuantity, safeMultiply } from '../../utils/gameValidation.js';
import fs from 'fs';
import path from 'path';

const weaponsPath = path.join(process.cwd(), 'data', 'weapons.json');

// Weapon types with prices
const WEAPONS = {
    knife: { name: 'Knife', price: 25000, emoji: '🔪' },
    pistol: { name: 'Pistol', price: 75000, emoji: '🔫' },
    rifle: { name: 'Rifle', price: 175000, emoji: '🔫' },
    sniper: { name: 'Sniper', price: 350000, emoji: '🎯' },
    rpg: { name: 'RPG', price: 750000, emoji: '🚀' }
};

// Bulk discount tiers
const BULK_DISCOUNTS = {
    5: 0.05,   // 5% off for 5+ items
    10: 0.10,  // 10% off for 10+ items
    25: 0.15,  // 15% off for 25+ items
    50: 0.20,  // 20% off for 50+ items
    100: 0.25  // 25% off for 100+ items
};

const responses = {
    en: {
        usage: '🛒 Bulk Weapon Purchase\n\nBuy weapons in bulk with discounts!\n\nUsage: .buybulk <weapon> <quantity>\nExample: .buybulk pistol 10\n\nAvailable weapons:\n🔪 knife - 25,000 coins\n🔫 pistol - 75,000 coins\n🔫 rifle - 175,000 coins\n🎯 sniper - 350,000 coins\n🚀 rpg - 750,000 coins\n\n💰 Bulk Discounts:\n5+ items: 5% off\n10+ items: 10% off\n25+ items: 15% off\n50+ items: 20% off\n100+ items: 25% off',
        invalidWeapon: '❌ Invalid weapon!\n\nAvailable: knife, pistol, rifle, sniper, rpg',
        invalidQuantity: '❌ Invalid quantity!\n\nPlease enter a number between 1 and 1000.',
        notEnoughCoins: '❌ Not enough coins!\n\n💰 You have: {balance} coins\n💸 You need: {cost} coins\n❌ Missing: {missing} coins',
        success: '✅ BULK PURCHASE SUCCESSFUL!\n\n{emoji} Weapon: {weapon}\n📦 Quantity: {quantity}\n💰 Unit Price: {unitPrice} coins\n🎯 Discount: {discount}%\n💸 Total Cost: {totalCost} coins\n💵 Saved: {saved} coins\n\n💰 New Balance: {balance} coins\n🔫 Total {weapon}s: {total}',
        processing: '⏳ Processing bulk purchase...'
    },
    it: {
        usage: '🛒 Acquisto Armi in Blocco\n\nAcquista armi in blocco con sconti!\n\nUso: .buybulk <arma> <quantità>\nEsempio: .buybulk pistol 10\n\nArmi disponibili:\n🔪 knife - 25.000 monete\n🔫 pistol - 75.000 monete\n🔫 rifle - 175.000 monete\n🎯 sniper - 350.000 monete\n🚀 rpg - 750.000 monete\n\n💰 Sconti in Blocco:\n5+ articoli: 5% di sconto\n10+ articoli: 10% di sconto\n25+ articoli: 15% di sconto\n50+ articoli: 20% di sconto\n100+ articoli: 25% di sconto',
        invalidWeapon: '❌ Arma non valida!\n\nDisponibili: knife, pistol, rifle, sniper, rpg',
        invalidQuantity: '❌ Quantità non valida!\n\nInserisci un numero tra 1 e 1000.',
        notEnoughCoins: '❌ Monete insufficienti!\n\n💰 Hai: {balance} monete\n💸 Servono: {cost} monete\n❌ Mancano: {missing} monete',
        success: '✅ ACQUISTO IN BLOCCO RIUSCITO!\n\n{emoji} Arma: {weapon}\n📦 Quantità: {quantity}\n💰 Prezzo Unitario: {unitPrice} monete\n🎯 Sconto: {discount}%\n💸 Costo Totale: {totalCost} monete\n💵 Risparmiato: {saved} monete\n\n💰 Nuovo Saldo: {balance} monete\n🔫 Totale {weapon}: {total}',
        processing: '⏳ Elaborazione acquisto in blocco...'
    },
    ru: {
        usage: '🛒 Оптовая Покупка Оружия\n\nПокупайте оружие оптом со скидками!\n\nИспользование: .buybulk <оружие> <количество>\nПример: .buybulk pistol 10\n\nДоступное оружие:\n🔪 knife - 25,000 монет\n🔫 pistol - 75,000 монет\n🔫 rifle - 175,000 монет\n🎯 sniper - 350,000 монет\n🚀 rpg - 750,000 монет\n\n💰 Оптовые Скидки:\n5+ предметов: 5% скидка\n10+ предметов: 10% скидка\n25+ предметов: 15% скидка\n50+ предметов: 20% скидка\n100+ предметов: 25% скидка',
        invalidWeapon: '❌ Неверное оружие!\n\nДоступно: knife, pistol, rifle, sniper, rpg',
        invalidQuantity: '❌ Неверное количество!\n\nВведите число от 1 до 1000.',
        notEnoughCoins: '❌ Недостаточно монет!\n\n💰 У вас: {balance} монет\n💸 Нужно: {cost} монет\n❌ Не хватает: {missing} монет',
        success: '✅ ОПТОВАЯ ПОКУПКА УСПЕШНА!\n\n{emoji} Оружие: {weapon}\n📦 Количество: {quantity}\n💰 Цена за единицу: {unitPrice} монет\n🎯 Скидка: {discount}%\n💸 Общая Стоимость: {totalCost} монет\n💵 Сэкономлено: {saved} монет\n\n💰 Новый Баланс: {balance} монет\n🔫 Всего {weapon}: {total}',
        processing: '⏳ Обработка оптовой покупки...'
    },
    es: {
        usage: '🛒 Compra de Armas al Por Mayor\n\n¡Compra armas al por mayor con descuentos!\n\nUso: .buybulk <arma> <cantidad>\nEjemplo: .buybulk pistol 10\n\nArmas disponibles:\n🔪 knife - 25,000 monedas\n🔫 pistol - 75,000 monedas\n🔫 rifle - 175,000 monedas\n🎯 sniper - 350,000 monedas\n🚀 rpg - 750,000 monedas\n\n💰 Descuentos al Por Mayor:\n5+ artículos: 5% de descuento\n10+ artículos: 10% de descuento\n25+ artículos: 15% de descuento\n50+ artículos: 20% de descuento\n100+ artículos: 25% de descuento',
        invalidWeapon: '❌ ¡Arma inválida!\n\nDisponibles: knife, pistol, rifle, sniper, rpg',
        invalidQuantity: '❌ ¡Cantidad inválida!\n\nIngresa un número entre 1 y 1000.',
        notEnoughCoins: '❌ ¡No tienes suficientes monedas!\n\n💰 Tienes: {balance} monedas\n💸 Necesitas: {cost} monedas\n❌ Faltan: {missing} monedas',
        success: '✅ ¡COMPRA AL POR MAYOR EXITOSA!\n\n{emoji} Arma: {weapon}\n📦 Cantidad: {quantity}\n💰 Precio Unitario: {unitPrice} monedas\n🎯 Descuento: {discount}%\n💸 Costo Total: {totalCost} monedas\n💵 Ahorrado: {saved} monedas\n\n💰 Nuevo Saldo: {balance} monedas\n🔫 Total {weapon}s: {total}',
        processing: '⏳ Procesando compra al por mayor...'
    },
    pt: {
        usage: '🛒 Compra de Armas em Massa\n\nCompre armas em massa com descontos!\n\nUso: .buybulk <arma> <quantidade>\nExemplo: .buybulk pistol 10\n\nArmas disponíveis:\n🔪 knife - 25,000 moedas\n🔫 pistol - 75,000 moedas\n🔫 rifle - 175,000 moedas\n🎯 sniper - 350,000 moedas\n🚀 rpg - 750,000 moedas\n\n💰 Descontos em Massa:\n5+ itens: 5% de desconto\n10+ itens: 10% de desconto\n25+ itens: 15% de desconto\n50+ itens: 20% de desconto\n100+ itens: 25% de desconto',
        invalidWeapon: '❌ Arma inválida!\n\nDisponíveis: knife, pistol, rifle, sniper, rpg',
        invalidQuantity: '❌ Quantidade inválida!\n\nDigite um número entre 1 e 1000.',
        notEnoughCoins: '❌ Moedas insuficientes!\n\n💰 Você tem: {balance} moedas\n💸 Você precisa: {cost} moedas\n❌ Faltam: {missing} moedas',
        success: '✅ COMPRA EM MASSA BEM-SUCEDIDA!\n\n{emoji} Arma: {weapon}\n📦 Quantidade: {quantity}\n💰 Preço Unitário: {unitPrice} moedas\n🎯 Desconto: {discount}%\n💸 Custo Total: {totalCost} moedas\n💵 Economizado: {saved} moedas\n\n💰 Novo Saldo: {balance} moedas\n🔫 Total {weapon}s: {total}',
        processing: '⏳ Processando compra em massa...'
    },
    ar: {
        usage: '🛒 شراء أسلحة بالجملة\n\nاشتري أسلحة بالجملة مع خصومات!\n\nالاستخدام: .buybulk <سلاح> <كمية>\nمثال: .buybulk pistol 10\n\nالأسلحة المتاحة:\n🔪 knife - 25,000 عملة\n🔫 pistol - 75,000 عملة\n🔫 rifle - 175,000 عملة\n🎯 sniper - 350,000 عملة\n🚀 rpg - 750,000 عملة\n\n💰 خصومات الجملة:\n5+ عناصر: خصم 5%\n10+ عناصر: خصم 10%\n25+ عناصر: خصم 15%\n50+ عناصر: خصم 20%\n100+ عناصر: خصم 25%',
        invalidWeapon: '❌ سلاح غير صالح!\n\nالمتاح: knife, pistol, rifle, sniper, rpg',
        invalidQuantity: '❌ كمية غير صالحة!\n\nأدخل رقم بين 1 و 1000.',
        notEnoughCoins: '❌ عملات غير كافية!\n\n💰 لديك: {balance} عملة\n💸 تحتاج: {cost} عملة\n❌ ينقصك: {missing} عملة',
        success: '✅ شراء بالجملة ناجح!\n\n{emoji} السلاح: {weapon}\n📦 الكمية: {quantity}\n💰 سعر الوحدة: {unitPrice} عملة\n🎯 الخصم: {discount}%\n💸 التكلفة الإجمالية: {totalCost} عملة\n💵 وفرت: {saved} عملة\n\n💰 رصيدك الجديد: {balance} عملة\n🔫 إجمالي {weapon}: {total}',
        processing: '⏳ معالجة الشراء بالجملة...'
    },
    hi: {
        usage: '🛒 थोक में हथियार खरीदें\n\nछूट के साथ थोक में हथियार खरीदें!\n\nउपयोग: .buybulk <हथियार> <मात्रा>\nउदाहरण: .buybulk pistol 10\n\nउपलब्ध हथियार:\n🔪 knife - 25,000 सिक्के\n🔫 pistol - 75,000 सिक्के\n🔫 rifle - 175,000 सिक्के\n🎯 sniper - 350,000 सिक्के\n🚀 rpg - 750,000 सिक्के\n\n💰 थोक छूट:\n5+ आइटम: 5% छूट\n10+ आइटम: 10% छूट\n25+ आइटम: 15% छूट\n50+ आइटम: 20% छूट\n100+ आइटम: 25% छूट',
        invalidWeapon: '❌ अमान्य हथियार!\n\nउपलब्ध: knife, pistol, rifle, sniper, rpg',
        invalidQuantity: '❌ अमान्य मात्रा!\n\n1 से 1000 के बीच संख्या दर्ज करें।',
        notEnoughCoins: '❌ पर्याप्त सिक्के नहीं!\n\n💰 आपके पास: {balance} सिक्के\n💸 आवश्यक: {cost} सिक्के\n❌ कमी: {missing} सिक्के',
        success: '✅ थोक खरीद सफल!\n\n{emoji} हथियार: {weapon}\n📦 मात्रा: {quantity}\n💰 इकाई मूल्य: {unitPrice} सिक्के\n🎯 छूट: {discount}%\n💸 कुल लागत: {totalCost} सिक्के\n💵 बचत: {saved} सिक्के\n\n💰 नया बैलेंस: {balance} सिक्के\n🔫 कुल {weapon}s: {total}',
        processing: '⏳ थोक खरीद प्रोसेस हो रही है...'
    },
    ng: {
        usage: '🛒 Buy Weapons for Bulk\n\nBuy weapons for bulk with discount!\n\nHow to use: .buybulk <weapon> <quantity>\nExample: .buybulk pistol 10\n\nWeapons wey dey:\n🔪 knife - 25,000 coins\n🔫 pistol - 75,000 coins\n🔫 rifle - 175,000 coins\n🎯 sniper - 350,000 coins\n🚀 rpg - 750,000 coins\n\n💰 Bulk Discount:\n5+ items: 5% off\n10+ items: 10% off\n25+ items: 15% off\n50+ items: 20% off\n100+ items: 25% off',
        invalidWeapon: '❌ Weapon no correct!\n\nWetin dey: knife, pistol, rifle, sniper, rpg',
        invalidQuantity: '❌ Quantity no correct!\n\nAbeg enter number between 1 and 1000.',
        notEnoughCoins: '❌ Coins no reach!\n\n💰 You get: {balance} coins\n💸 You need: {cost} coins\n❌ Wetin remain: {missing} coins',
        success: '✅ BULK PURCHASE DON WORK!\n\n{emoji} Weapon: {weapon}\n📦 Quantity: {quantity}\n💰 Unit Price: {unitPrice} coins\n🎯 Discount: {discount}%\n💸 Total Cost: {totalCost} coins\n💵 You save: {saved} coins\n\n💰 New Balance: {balance} coins\n🔫 Total {weapon}s: {total}',
        processing: '⏳ Dey process bulk purchase...'
    }
};

// Load weapons data
function loadWeapons() {
    try {
        if (fs.existsSync(weaponsPath)) {
            const data = fs.readFileSync(weaponsPath, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('[BUYBULK] Error loading weapons:', error.message);
    }
    return {};
}

// Save weapons data
function saveWeapons(weapons) {
    try {
        fs.writeFileSync(weaponsPath, JSON.stringify(weapons, null, 2));
    } catch (error) {
        console.error('[BUYBULK] Error saving weapons:', error.message);
    }
}

// Calculate bulk discount
function getBulkDiscount(quantity) {
    const tiers = Object.keys(BULK_DISCOUNTS).map(Number).sort((a, b) => b - a);
    for (const tier of tiers) {
        if (quantity >= tier) {
            return BULK_DISCOUNTS[tier];
        }
    }
    return 0;
}

export default {
    name: 'buybulk',
    aliases: ['bulkbuy', 'buyweapons'],
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const senderId = sender.split('@')[0];
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;

        try {
            // Check if arguments provided
            if (args.length < 2) {
                return await sock.sendMessage(from, {
                    text: t.usage
                });
            }

            const weaponType = args[0].toLowerCase();
            
            // Validate quantity with comprehensive checks
            const quantityValidation = validateQuantity(args[1], 1, 1000);
            if (!quantityValidation.valid) {
                return await sock.sendMessage(from, {
                    text: `❌ ${quantityValidation.error}`
                });
            }
            const quantity = quantityValidation.amount;

            // Validate weapon type
            if (!WEAPONS[weaponType]) {
                return await sock.sendMessage(from, {
                    text: t.invalidWeapon
                });
            }

            const weapon = WEAPONS[weaponType];
            const unitPrice = weapon.price;
            const discount = getBulkDiscount(quantity);
            const discountedPrice = Math.floor(unitPrice * (1 - discount));
            
            // Safe multiplication to prevent overflow
            const costCalculation = safeMultiply(discountedPrice, quantity);
            if (!costCalculation.valid) {
                return await sock.sendMessage(from, {
                    text: `❌ ${costCalculation.error}\n\nPlease reduce quantity.`
                });
            }
            const totalCost = costCalculation.result;
            
            const savedCalculation = safeMultiply(unitPrice - discountedPrice, quantity);
            const totalSaved = savedCalculation.valid ? savedCalculation.result : 0;

            // Check balance
            const balance = await getBalance(sender);
            if (balance < totalCost) {
                return await sock.sendMessage(from, {
                    text: t.notEnoughCoins
                        .replace('{balance}', balance.toLocaleString())
                        .replace('{cost}', totalCost.toLocaleString())
                        .replace('{missing}', (totalCost - balance).toLocaleString())
                });
            }

            // Send processing message
            await sock.sendMessage(from, {
                text: t.processing
            });

            // Deduct coins
            await removeCoins(sender, totalCost);

            // Add weapons to inventory
            const weapons = loadWeapons();
            if (!weapons[senderId]) {
                weapons[senderId] = {};
            }
            if (!weapons[senderId][weaponType]) {
                weapons[senderId][weaponType] = 0;
            }
            weapons[senderId][weaponType] += quantity;
            saveWeapons(weapons);

            const newBalance = await getBalance(sender);

            // Send success message
            await sock.sendMessage(from, {
                text: t.success
                    .replace('{emoji}', weapon.emoji)
                    .replace(/{weapon}/g, weapon.name)
                    .replace('{quantity}', quantity.toLocaleString())
                    .replace('{unitPrice}', unitPrice.toLocaleString())
                    .replace('{discount}', (discount * 100).toFixed(0))
                    .replace('{totalCost}', totalCost.toLocaleString())
                    .replace('{saved}', totalSaved.toLocaleString())
                    .replace('{balance}', newBalance.toLocaleString())
                    .replace('{total}', weapons[senderId][weaponType].toLocaleString())
            });

        } catch (error) {
            console.error('[BUYBULK] Error:', error.message);
            await sock.sendMessage(from, {
                text: '❌ An error occurred while processing your bulk purchase.'
            });
        }
    }
};
