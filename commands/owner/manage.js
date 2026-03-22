import { getGroupLanguage } from '../../utils/language.js';
import { getBalance, setBalance, addCoins, removeCoins } from '../../utils/bank_SAFE.js';
import fs from 'fs';
import path from 'path';

const dataDir = './data';
const inventoryFile = path.join(dataDir, 'shop_inventory.json');

// Load all inventories
function loadAllInventories() {
    try {
        if (!fs.existsSync(inventoryFile)) {
            return {};
        }
        return JSON.parse(fs.readFileSync(inventoryFile, 'utf8'));
    } catch (error) {
        console.error('[MANAGE] Error loading inventories:', error.message);
        return {};
    }
}

// Save all inventories
function saveAllInventories(inventories) {
    try {
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        fs.writeFileSync(inventoryFile, JSON.stringify(inventories, null, 2));
        return true;
    } catch (error) {
        console.error('[MANAGE] Error saving inventories:', error.message);
        return false;
    }
}

const responses = {
    en: {
        usage: `╔═══════════════════════════════════╗
║   📋 MANAGE COMMAND TUTORIAL   ║
╚═══════════════════════════════════╝

🔐 OWNER ONLY - Full control over users

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 MONEY MANAGEMENT:

📊 Check Balance:
   .manage money @user
   → Shows user's current coin balance

💵 Set Balance:
   .manage money @user set 10000
   → Sets exact balance to 10,000 coins

➕ Add Coins:
   .manage money @user add 5000
   → Adds 5,000 coins to user's balance

➖ Remove Coins:
   .manage money @user remove 2000
   → Removes 2,000 coins from user

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎒 INVENTORY MANAGEMENT:

📦 View Inventory:
   .manage inventory @user
   → Shows all items and expiry times

🎁 Add Item:
   .manage inventory @user add vip 168
   → Adds VIP badge for 168 hours (7 days)
   
   .manage inventory @user add anti_rob 720
   → Adds Anti-Rob protection for 30 days

🗑️ Remove Item:
   .manage inventory @user remove premium
   → Removes specific item from inventory

🧹 Clear All Items:
   .manage inventory @user clear
   → Removes all items from user

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 AVAILABLE ITEMS:

👑 BADGES:
   • vip - VIP Badge
   • premium - Premium Badge  
   • legend - Legend Badge

💰 MULTIPLIERS:
   • multiplier_2x - 2x Coin Multiplier
   • multiplier_3x - 3x Coin Multiplier
   • multiplier_5x - 5x Coin Multiplier

🍀 LUCK BOOSTS:
   • luck_10 - +10% Luck Boost
   • luck_25 - +25% Luck Boost
   • luck_50 - +50% Luck Boost

🛡️ PROTECTION:
   • anti_rob - Anti-Rob Protection
   • insurance - Loss Insurance

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 DURATION EXAMPLES:
   • 24 hours = 1 day
   • 168 hours = 7 days (1 week)
   • 720 hours = 30 days (1 month)
   • 8760 hours = 365 days (1 year)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ IMPORTANT NOTES:
   • Must mention user or reply to message
   • Items expire after duration ends
   • Can stack different item types
   • Cannot stack same item type
   • Changes take effect immediately

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 QUICK EXAMPLES:

Give user 50k coins:
   .manage money @user set 50000

Add VIP for 1 week:
   .manage inventory @user add vip 168

Add Anti-Rob for 1 month:
   .manage inventory @user add anti_rob 720

Check what user has:
   .manage inventory @user

Remove all items:
   .manage inventory @user clear`,
        noUser: '❌ Please mention a user or reply to their message.',
        invalidAction: '❌ Invalid action. Use: money, inventory, weapon',
        invalidSubAction: '❌ Invalid sub-action.',
        invalidAmount: '❌ Invalid amount. Please provide a valid number.',
        invalidItem: '❌ Invalid item name.',
        invalidDuration: '❌ Invalid duration. Please provide hours (e.g., 24, 168).',
        moneyCheck: '💰 Balance for @{user}:\n{amount} coins',
        moneySet: '✅ Set @{user}\'s balance to {amount} coins',
        moneyAdd: '✅ Added {amount} coins to @{user}\nNew balance: {total} coins',
        moneyRemove: '✅ Removed {amount} coins from @{user}\nNew balance: {total} coins',
        inventoryView: '🎒 Inventory for @{user}:\n\n{items}',
        inventoryEmpty: '🎒 Inventory for @{user}:\n\nNo items',
        inventoryAdd: '✅ Added {item} to @{user}\'s inventory\nExpires in {duration} hours',
        inventoryRemove: '✅ Removed {item} from @{user}\'s inventory',
        inventoryClear: '✅ Cleared all items from @{user}\'s inventory',
        itemNotFound: '❌ User doesn\'t have this item.',
        weaponView: '🔫 Weapons for @{user}:\n\n{weapons}',
        weaponEmpty: '🔫 Weapons for @{user}:\n\nNo weapons',
        weaponAdd: '✅ Added {quantity}x {weapon} to @{user}\'s arsenal',
        weaponRemove: '✅ Removed {quantity}x {weapon} from @{user}\'s arsenal',
        weaponClear: '✅ Cleared all weapons from @{user}\'s arsenal',
        weaponNotFound: '❌ User doesn\'t have this weapon.',
        invalidWeapon: '❌ Invalid weapon. Available: {weapons}',
        invalidQuantity: '❌ Invalid quantity.'
    },
    it: {
        usage: `╔═══════════════════════════════════╗
║   📋 TUTORIAL COMANDO MANAGE   ║
╚═══════════════════════════════════╝

🔐 SOLO PROPRIETARIO - Controllo completo utenti

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 GESTIONE DENARO:
   .manage money @utente - Controlla saldo
   .manage money @utente set 10000 - Imposta saldo
   .manage money @utente add 5000 - Aggiungi monete
   .manage money @utente remove 2000 - Rimuovi monete

🎒 GESTIONE INVENTARIO:
   .manage inventory @utente - Visualizza oggetti
   .manage inventory @utente add vip 168 - Aggiungi oggetto
   .manage inventory @utente remove premium - Rimuovi oggetto
   .manage inventory @utente clear - Cancella tutto

📦 OGGETTI DISPONIBILI:
   👑 vip, premium, legend - Badge
   💰 multiplier_2x, multiplier_3x, multiplier_5x
   🍀 luck_10, luck_25, luck_50
   🛡️ anti_rob, insurance

💡 DURATA: 24h=1giorno, 168h=1settimana, 720h=1mese`,
        noUser: '❌ Menziona un utente o rispondi al suo messaggio.',
        invalidAction: '❌ Azione non valida. Usa: money, inventory, weapon',
        invalidSubAction: '❌ Sotto-azione non valida.',
        invalidAmount: '❌ Importo non valido. Fornisci un numero valido.',
        invalidItem: '❌ Nome oggetto non valido.',
        invalidDuration: '❌ Durata non valida. Fornisci ore (es. 24, 168).',
        moneyCheck: '💰 Saldo per @{user}:\n{amount} monete',
        moneySet: '✅ Saldo di @{user} impostato a {amount} monete',
        moneyAdd: '✅ Aggiunte {amount} monete a @{user}\nNuovo saldo: {total} monete',
        moneyRemove: '✅ Rimosse {amount} monete da @{user}\nNuovo saldo: {total} monete',
        inventoryView: '🎒 Inventario per @{user}:\n\n{items}',
        inventoryEmpty: '🎒 Inventario per @{user}:\n\nNessun oggetto',
        inventoryAdd: '✅ Aggiunto {item} all\'inventario di @{user}\nScade tra {duration} ore',
        inventoryRemove: '✅ Rimosso {item} dall\'inventario di @{user}',
        inventoryClear: '✅ Cancellati tutti gli oggetti dall\'inventario di @{user}',
        itemNotFound: '❌ L\'utente non ha questo oggetto.',
        weaponView: '🔫 Armi per @{user}:\n\n{weapons}',
        weaponEmpty: '🔫 Armi per @{user}:\n\nNessuna arma',
        weaponAdd: '✅ Aggiunte {quantity}x {weapon} all\'arsenale di @{user}',
        weaponRemove: '✅ Rimosse {quantity}x {weapon} dall\'arsenale di @{user}',
        weaponClear: '✅ Cancellate tutte le armi dall\'arsenale di @{user}',
        weaponNotFound: '❌ L\'utente non ha quest\'arma.',
        invalidWeapon: '❌ Arma non valida. Disponibili: {weapons}',
        invalidQuantity: '❌ Quantità non valida.'
    },
    ru: {
        usage: `╔═══════════════════════════════════╗
║   📋 РУКОВОДСТВО КОМАНДЫ MANAGE   ║
╚═══════════════════════════════════╝

🔐 ТОЛЬКО ВЛАДЕЛЕЦ - Полный контроль пользователей

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 УПРАВЛЕНИЕ ДЕНЬГАМИ:
   .manage money @пользователь - Проверить баланс
   .manage money @пользователь set 10000 - Установить баланс
   .manage money @пользователь add 5000 - Добавить монеты
   .manage money @пользователь remove 2000 - Удалить монеты

🎒 УПРАВЛЕНИЕ ИНВЕНТАРЕМ:
   .manage inventory @пользователь - Просмотр предметов
   .manage inventory @пользователь add vip 168 - Добавить предмет
   .manage inventory @пользователь remove premium - Удалить предмет
   .manage inventory @пользователь clear - Очистить все

📦 ДОСТУПНЫЕ ПРЕДМЕТЫ:
   👑 vip, premium, legend - Значки
   💰 multiplier_2x, multiplier_3x, multiplier_5x
   🍀 luck_10, luck_25, luck_50
   🛡️ anti_rob, insurance

💡 ДЛИТЕЛЬНОСТЬ: 24ч=1день, 168ч=1неделя, 720ч=1месяц`,
        noUser: '❌ Пожалуйста, упомяните пользователя или ответьте на его сообщение.',
        invalidAction: '❌ Неверное действие. Используйте: money, inventory, weapon',
        invalidSubAction: '❌ Неверное под-действие.',
        invalidAmount: '❌ Неверная сумма. Пожалуйста, укажите действительное число.',
        invalidItem: '❌ Неверное название предмета.',
        invalidDuration: '❌ Неверная длительность. Укажите часы (например, 24, 168).',
        moneyCheck: '💰 Баланс для @{user}:\n{amount} монет',
        moneySet: '✅ Баланс @{user} установлен на {amount} монет',
        moneyAdd: '✅ Добавлено {amount} монет для @{user}\nНовый баланс: {total} монет',
        moneyRemove: '✅ Удалено {amount} монет у @{user}\nНовый баланс: {total} монет',
        inventoryView: '🎒 Инвентарь для @{user}:\n\n{items}',
        inventoryEmpty: '🎒 Инвентарь для @{user}:\n\nНет предметов',
        inventoryAdd: '✅ Добавлен {item} в инвентарь @{user}\nИстекает через {duration} часов',
        inventoryRemove: '✅ Удален {item} из инвентаря @{user}',
        inventoryClear: '✅ Очищены все предметы из инвентаря @{user}',
        itemNotFound: '❌ У пользователя нет этого предмета.',
        weaponView: '🔫 Оружие для @{user}:\n\n{weapons}',
        weaponEmpty: '🔫 Оружие для @{user}:\n\nНет оружия',
        weaponAdd: '✅ Добавлено {quantity}x {weapon} в арсенал @{user}',
        weaponRemove: '✅ Удалено {quantity}x {weapon} из арсенала @{user}',
        weaponClear: '✅ Очищено все оружие из арсенала @{user}',
        weaponNotFound: '❌ У пользователя нет этого оружия.',
        invalidWeapon: '❌ Неверное оружие. Доступно: {weapons}',
        invalidQuantity: '❌ Неверное количество.'
    },
    es: {
        usage: `╔═══════════════════════════════════╗
║   📋 TUTORIAL COMANDO MANAGE   ║
╚═══════════════════════════════════╝

🔐 SOLO PROPIETARIO - Control completo de usuarios

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 GESTIÓN DE DINERO:
   .manage money @usuario - Verificar saldo
   .manage money @usuario set 10000 - Establecer saldo
   .manage money @usuario add 5000 - Agregar monedas
   .manage money @usuario remove 2000 - Quitar monedas

🎒 GESTIÓN DE INVENTARIO:
   .manage inventory @usuario - Ver artículos
   .manage inventory @usuario add vip 168 - Agregar artículo
   .manage inventory @usuario remove premium - Quitar artículo
   .manage inventory @usuario clear - Limpiar todo

📦 ARTÍCULOS DISPONIBLES:
   👑 vip, premium, legend - Insignias
   💰 multiplier_2x, multiplier_3x, multiplier_5x
   🍀 luck_10, luck_25, luck_50
   🛡️ anti_rob, insurance

💡 DURACIÓN: 24h=1día, 168h=1semana, 720h=1mes`,
        noUser: '❌ Por favor menciona a un usuario o responde a su mensaje.',
        invalidAction: '❌ Acción inválida. Usa: money, inventory, weapon',
        invalidSubAction: '❌ Sub-acción inválida.',
        invalidAmount: '❌ Cantidad inválida. Por favor proporciona un número válido.',
        invalidItem: '❌ Nombre de artículo inválido.',
        invalidDuration: '❌ Duración inválida. Por favor proporciona horas (ej. 24, 168).',
        moneyCheck: '💰 Saldo para @{user}:\n{amount} monedas',
        moneySet: '✅ Saldo de @{user} establecido en {amount} monedas',
        moneyAdd: '✅ Agregadas {amount} monedas a @{user}\nNuevo saldo: {total} monedas',
        moneyRemove: '✅ Quitadas {amount} monedas de @{user}\nNuevo saldo: {total} monedas',
        inventoryView: '🎒 Inventario para @{user}:\n\n{items}',
        inventoryEmpty: '🎒 Inventario para @{user}:\n\nSin artículos',
        inventoryAdd: '✅ Agregado {item} al inventario de @{user}\nExpira en {duration} horas',
        inventoryRemove: '✅ Quitado {item} del inventario de @{user}',
        inventoryClear: '✅ Limpiados todos los artículos del inventario de @{user}',
        itemNotFound: '❌ El usuario no tiene este artículo.',
        weaponView: '🔫 Armas para @{user}:\n\n{weapons}',
        weaponEmpty: '🔫 Armas para @{user}:\n\nSin armas',
        weaponAdd: '✅ Agregadas {quantity}x {weapon} al arsenal de @{user}',
        weaponRemove: '✅ Quitadas {quantity}x {weapon} del arsenal de @{user}',
        weaponClear: '✅ Limpiadas todas las armas del arsenal de @{user}',
        weaponNotFound: '❌ El usuario no tiene esta arma.',
        invalidWeapon: '❌ Arma inválida. Disponibles: {weapons}',
        invalidQuantity: '❌ Cantidad inválida.'
    },
    pt: {
        usage: `╔═══════════════════════════════════╗
║   📋 TUTORIAL COMANDO MANAGE   ║
╚═══════════════════════════════════╝

🔐 APENAS PROPRIETÁRIO - Controle completo de usuários

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 GESTÃO DE DINHEIRO:
   .manage money @usuário - Verificar saldo
   .manage money @usuário set 10000 - Definir saldo
   .manage money @usuário add 5000 - Adicionar moedas
   .manage money @usuário remove 2000 - Remover moedas

🎒 GESTÃO DE INVENTÁRIO:
   .manage inventory @usuário - Ver itens
   .manage inventory @usuário add vip 168 - Adicionar item
   .manage inventory @usuário remove premium - Remover item
   .manage inventory @usuário clear - Limpar tudo

📦 ITENS DISPONÍVEIS:
   👑 vip, premium, legend - Emblemas
   💰 multiplier_2x, multiplier_3x, multiplier_5x
   🍀 luck_10, luck_25, luck_50
   🛡️ anti_rob, insurance

💡 DURAÇÃO: 24h=1dia, 168h=1semana, 720h=1mês`,
        noUser: '❌ Por favor mencione um usuário ou responda à mensagem dele.',
        invalidAction: '❌ Ação inválida. Use: money, inventory, weapon',
        invalidSubAction: '❌ Sub-ação inválida.',
        invalidAmount: '❌ Quantia inválida. Por favor forneça um número válido.',
        invalidItem: '❌ Nome de item inválido.',
        invalidDuration: '❌ Duração inválida. Por favor forneça horas (ex. 24, 168).',
        moneyCheck: '💰 Saldo para @{user}:\n{amount} moedas',
        moneySet: '✅ Saldo de @{user} definido para {amount} moedas',
        moneyAdd: '✅ Adicionadas {amount} moedas para @{user}\nNovo saldo: {total} moedas',
        moneyRemove: '✅ Removidas {amount} moedas de @{user}\nNovo saldo: {total} moedas',
        inventoryView: '🎒 Inventário para @{user}:\n\n{items}',
        inventoryEmpty: '🎒 Inventário para @{user}:\n\nSem itens',
        inventoryAdd: '✅ Adicionado {item} ao inventário de @{user}\nExpira em {duration} horas',
        inventoryRemove: '✅ Removido {item} do inventário de @{user}',
        inventoryClear: '✅ Limpos todos os itens do inventário de @{user}',
        itemNotFound: '❌ O usuário não tem este item.',
        weaponView: '🔫 Armas para @{user}:\n\n{weapons}',
        weaponEmpty: '🔫 Armas para @{user}:\n\nSem armas',
        weaponAdd: '✅ Adicionadas {quantity}x {weapon} ao arsenal de @{user}',
        weaponRemove: '✅ Removidas {quantity}x {weapon} do arsenal de @{user}',
        weaponClear: '✅ Limpas todas as armas do arsenal de @{user}',
        weaponNotFound: '❌ O usuário não tem esta arma.',
        invalidWeapon: '❌ Arma inválida. Disponíveis: {weapons}',
        invalidQuantity: '❌ Quantidade inválida.'
    },
    ar: {
        usage: `╔═══════════════════════════════════╗
║   📋 شرح أمر MANAGE   ║
╚═══════════════════════════════════╝

🔐 المالك فقط - تحكم كامل في المستخدمين

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 إدارة المال:
   .manage money @مستخدم - تحقق من الرصيد
   .manage money @مستخدم set 10000 - تعيين الرصيد
   .manage money @مستخدم add 5000 - إضافة عملات
   .manage money @مستخدم remove 2000 - إزالة عملات

🎒 إدارة المخزون:
   .manage inventory @مستخدم - عرض الأغراض
   .manage inventory @مستخدم add vip 168 - إضافة غرض
   .manage inventory @مستخدم remove premium - إزالة غرض
   .manage inventory @مستخدم clear - مسح كل شيء

📦 الأغراض المتاحة:
   👑 vip, premium, legend - شارات
   💰 multiplier_2x, multiplier_3x, multiplier_5x
   🍀 luck_10, luck_25, luck_50
   🛡️ anti_rob, insurance

💡 المدة: 24س=يوم، 168س=أسبوع، 720س=شهر`,
        noUser: '❌ من فضلك اعمل منشن لمستخدم أو رد على رسالته.',
        invalidAction: '❌ إجراء غير صالح. استخدم: money, inventory, weapon',
        invalidSubAction: '❌ إجراء فرعي غير صالح.',
        invalidAmount: '❌ مبلغ غير صالح. من فضلك قدم رقم صالح.',
        invalidItem: '❌ اسم غرض غير صالح.',
        invalidDuration: '❌ مدة غير صالحة. من فضلك قدم ساعات (مثلاً 24، 168).',
        moneyCheck: '💰 الرصيد لـ @{user}:\n{amount} عملة',
        moneySet: '✅ رصيد @{user} اتعين على {amount} عملة',
        moneyAdd: '✅ اتضاف {amount} عملة لـ @{user}\nالرصيد الجديد: {total} عملة',
        moneyRemove: '✅ اتشال {amount} عملة من @{user}\nالرصيد الجديد: {total} عملة',
        inventoryView: '🎒 المخزون لـ @{user}:\n\n{items}',
        inventoryEmpty: '🎒 المخزون لـ @{user}:\n\nمفيش أغراض',
        inventoryAdd: '✅ اتضاف {item} لمخزون @{user}\nينتهي بعد {duration} ساعة',
        inventoryRemove: '✅ اتشال {item} من مخزون @{user}',
        inventoryClear: '✅ اتمسح كل الأغراض من مخزون @{user}',
        itemNotFound: '❌ المستخدم مالوش الغرض ده.',
        weaponView: '🔫 الأسلحة لـ @{user}:\n\n{weapons}',
        weaponEmpty: '🔫 الأسلحة لـ @{user}:\n\nمفيش أسلحة',
        weaponAdd: '✅ اتضاف {quantity}x {weapon} لترسانة @{user}',
        weaponRemove: '✅ اتشال {quantity}x {weapon} من ترسانة @{user}',
        weaponClear: '✅ اتمسحت كل الأسلحة من ترسانة @{user}',
        weaponNotFound: '❌ المستخدم مالوش السلاح ده.',
        invalidWeapon: '❌ سلاح غير صالح. المتاح: {weapons}',
        invalidQuantity: '❌ كمية غير صالحة.'
    },
    hi: {
        usage: `╔═══════════════════════════════════╗
║   📋 MANAGE कमांड ट्यूटोरियल   ║
╚═══════════════════════════════════╝

🔐 केवल ओनर - यूज़र पर पूर्ण नियंत्रण

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 मनी मैनेजमेंट:

📊 बैलेंस चेक करें:
   .manage money @user
   → यूज़र का वर्तमान कॉइन बैलेंस दिखाता है

💵 बैलेंस सेट करें:
   .manage money @user set 10000
   → सटीक बैलेंस 10,000 कॉइन पर सेट करता है

➕ कॉइन जोड़ें:
   .manage money @user add 5000
   → यूज़र के बैलेंस में 5,000 कॉइन जोड़ता है

➖ कॉइन हटाएं:
   .manage money @user remove 2000
   → यूज़र से 2,000 कॉइन हटाता है

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎒 इन्वेंटरी मैनेजमेंट:

📦 इन्वेंटरी देखें:
   .manage inventory @user
   → सभी आइटम और एक्सपायरी टाइम दिखाता है

🎁 आइटम जोड़ें:
   .manage inventory @user add vip 168
   → 168 घंटे (7 दिन) के लिए VIP बैज जोड़ता है
   
   .manage inventory @user add anti_rob 720
   → 30 दिनों के लिए एंटी-रॉब प्रोटेक्शन जोड़ता है

🗑️ आइटम हटाएं:
   .manage inventory @user remove premium
   → इन्वेंटरी से विशिष्ट आइटम हटाता है

🧹 सभी आइटम क्लियर करें:
   .manage inventory @user clear
   → यूज़र से सभी आइटम हटाता है

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 उपलब्ध आइटम:

👑 बैज:
   • vip - VIP बैज
   • premium - प्रीमियम बैज  
   • legend - लीजेंड बैज

💰 मल्टीप्लायर:
   • multiplier_2x - 2x कॉइन मल्टीप्लायर
   • multiplier_3x - 3x कॉइन मल्टीप्लायर
   • multiplier_5x - 5x कॉइन मल्टीप्लायर

🍀 लक बूस्ट:
   • luck_10 - +10% लक बूस्ट
   • luck_25 - +25% लक बूस्ट
   • luck_50 - +50% लक बूस्ट

🛡️ प्रोटेक्शन:
   • anti_rob - एंटी-रॉब प्रोटेक्शन
   • insurance - लॉस इंश्योरेंस

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 अवधि उदाहरण:
   • 24 घंटे = 1 दिन
   • 168 घंटे = 7 दिन (1 सप्ताह)
   • 720 घंटे = 30 दिन (1 महीना)
   • 8760 घंटे = 365 दिन (1 वर्ष)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ महत्वपूर्ण नोट्स:
   • यूज़र को मेंशन करना या मैसेज पर रिप्लाई करना आवश्यक है
   • अवधि समाप्त होने के बाद आइटम एक्सपायर हो जाते हैं
   • विभिन्न आइटम प्रकार स्टैक हो सकते हैं
   • समान आइटम प्रकार स्टैक नहीं हो सकते
   • परिवर्तन तुरंत प्रभावी होते हैं

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 त्वरित उदाहरण:

यूज़र को 50k कॉइन दें:
   .manage money @user set 50000

1 सप्ताह के लिए VIP जोड़ें:
   .manage inventory @user add vip 168

1 महीने के लिए एंटी-रॉब जोड़ें:
   .manage inventory @user add anti_rob 720

यूज़र के पास क्या है चेक करें:
   .manage inventory @user

सभी आइटम हटाएं:
   .manage inventory @user clear`,
        noUser: '❌ कृपया एक यूज़र को मेंशन करें या उनके मैसेज पर रिप्लाई करें।',
        invalidAction: '❌ अमान्य एक्शन। उपयोग करें: money, inventory, weapon',
        invalidSubAction: '❌ अमान्य सब-एक्शन।',
        invalidAmount: '❌ अमान्य राशि। कृपया एक मान्य संख्या प्रदान करें।',
        invalidItem: '❌ अमान्य आइटम नाम।',
        invalidDuration: '❌ अमान्य अवधि। कृपया घंटे प्रदान करें (जैसे 24, 168)।',
        moneyCheck: '💰 @{user} के लिए बैलेंस:\n{amount} कॉइन',
        moneySet: '✅ @{user} का बैलेंस {amount} कॉइन पर सेट किया गया',
        moneyAdd: '✅ @{user} को {amount} कॉइन जोड़े गए\nनया बैलेंस: {total} कॉइन',
        moneyRemove: '✅ @{user} से {amount} कॉइन हटाए गए\nनया बैलेंस: {total} कॉइन',
        inventoryView: '🎒 @{user} के लिए इन्वेंटरी:\n\n{items}',
        inventoryEmpty: '🎒 @{user} के लिए इन्वेंटरी:\n\nकोई आइटम नहीं',
        inventoryAdd: '✅ @{user} की इन्वेंटरी में {item} जोड़ा गया\n{duration} घंटे में एक्सपायर होगा',
        inventoryRemove: '✅ @{user} की इन्वेंटरी से {item} हटाया गया',
        inventoryClear: '✅ @{user} की इन्वेंटरी से सभी आइटम क्लियर किए गए',
        itemNotFound: '❌ यूज़र के पास यह आइटम नहीं है।',
        weaponView: '🔫 @{user} के लिए हथियार:\n\n{weapons}',
        weaponEmpty: '🔫 @{user} के लिए हथियार:\n\nकोई हथियार नहीं',
        weaponAdd: '✅ @{user} के शस्त्रागार में {quantity}x {weapon} जोड़े गए',
        weaponRemove: '✅ @{user} के शस्त्रागार से {quantity}x {weapon} हटाए गए',
        weaponClear: '✅ @{user} के शस्त्रागार से सभी हथियार क्लियर किए गए',
        weaponNotFound: '❌ यूज़र के पास यह हथियार नहीं है।',
        invalidWeapon: '❌ अमान्य हथियार। उपलब्ध: {weapons}',
        invalidQuantity: '❌ अमान्य मात्रा।',
        invalidSubAction: '❌ अमान्य सब-एक्शन।',
        invalidAmount: '❌ अमान्य राशि। कृपया एक मान्य संख्या प्रदान करें।',
        invalidItem: '❌ अमान्य आइटम नाम।',
        invalidDuration: '❌ अमान्य अवधि। कृपया घंटे प्रदान करें (जैसे 24, 168)।',
        moneyCheck: '💰 @{user} के लिए बैलेंस:\n{amount} कॉइन',
        moneySet: '✅ @{user} का बैलेंस {amount} कॉइन पर सेट किया गया',
        moneyAdd: '✅ @{user} को {amount} कॉइन जोड़े गए\nनया बैलेंस: {total} कॉइन',
        moneyRemove: '✅ @{user} से {amount} कॉइन हटाए गए\nनया बैलेंस: {total} कॉइन',
        inventoryView: '🎒 @{user} के लिए इन्वेंटरी:\n\n{items}',
        inventoryEmpty: '🎒 @{user} के लिए इन्वेंटरी:\n\nकोई आइटम नहीं',
        inventoryAdd: '✅ @{user} की इन्वेंटरी में {item} जोड़ा गया\n{duration} घंटे में एक्सपायर होगा',
        inventoryRemove: '✅ @{user} की इन्वेंटरी से {item} हटाया गया',
        inventoryClear: '✅ @{user} की इन्वेंटरी से सभी आइटम क्लियर किए गए',
        itemNotFound: '❌ यूज़र के पास यह आइटम नहीं है।'
    }
};

const validItems = [
    'vip', 'premium', 'legend',
    'multiplier_2x', 'multiplier_3x', 'multiplier_5x',
    'luck_10', 'luck_25', 'luck_50',
    'anti_rob', 'insurance',
    'lucky_charm', 'mega_luck', 'ultra_luck',
    'double_coins', 'triple_coins', 'mega_multiplier',
    'name_color', 'custom_title'
];

const validWeapons = ['rpg', 'rifle', 'sniper', 'pistol', 'knife', 'grenade'];

const itemNames = {
    vip: '👑 VIP Badge',
    premium: '💎 Premium Badge',
    legend: '🏆 Legend Badge',
    multiplier_2x: '💰 2x Coin Multiplier',
    multiplier_3x: '💰 3x Coin Multiplier',
    multiplier_5x: '💰 5x Coin Multiplier',
    luck_10: '🍀 +10% Luck Boost',
    luck_25: '🍀 +25% Luck Boost',
    luck_50: '🍀 +50% Luck Boost',
    anti_rob: '🛡️ Anti-Rob Protection',
    insurance: '🏦 Loss Insurance',
    lucky_charm: '🍀 Lucky Charm (+10% Luck)',
    mega_luck: '✨ Mega Luck (+25% Luck)',
    ultra_luck: '🌟 Ultra Luck (+50% Luck)',
    double_coins: '💰 2x Coin Multiplier',
    triple_coins: '💰 3x Coin Multiplier',
    mega_multiplier: '💰 5x Coin Multiplier',
    name_color: '🎨 Colored Name',
    custom_title: '📛 Custom Title'
};

const weaponNames = {
    rpg: '🚀 RPG',
    rifle: '🔫 Rifle',
    sniper: '🎯 Sniper',
    pistol: '🔫 Pistol',
    knife: '🔪 Knife',
    grenade: '💣 Grenade'
};

// Weapon management functions
const weaponsFile = path.join(dataDir, 'weapons.json');

function loadWeapons() {
    try {
        if (!fs.existsSync(weaponsFile)) {
            return {};
        }
        return JSON.parse(fs.readFileSync(weaponsFile, 'utf8'));
    } catch (error) {
        console.error('[MANAGE] Error loading weapons:', error.message);
        return {};
    }
}

function saveWeapons(weapons) {
    try {
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        fs.writeFileSync(weaponsFile, JSON.stringify(weapons, null, 2));
        return true;
    } catch (error) {
        console.error('[MANAGE] Error saving weapons:', error.message);
        return false;
    }
}

export default {
    name: 'manage',
    ownerOnly: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        // Show usage if no args
        if (args.length === 0) {
            return await sock.sendMessage(from, { text: t.usage });
        }
        
        // Get target user - support both WhatsApp mentions and text-based @username
        let targetUser = null;
        let cleanArgs = [...args]; // Create a copy to work with
        
        // First, try to get from WhatsApp mention or quoted message
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
        targetUser = mentioned || quoted;
        
        // Remove all @mentions from args to get clean command arguments
        cleanArgs = cleanArgs.filter(arg => !arg.startsWith('@'));
        
        // If no WhatsApp mention found, look for text-based @username in original args
        if (!targetUser) {
            for (let i = 0; i < args.length; i++) {
                if (args[i] && args[i].startsWith('@')) {
                    const username = args[i].substring(1); // Remove @ symbol
                    // Try LID format first (newer WhatsApp format), then standard format
                    targetUser = `${username}@lid`;
                    break;
                }
            }
        }
        
        if (!targetUser) {
            return await sock.sendMessage(from, { text: t.noUser });
        }
        
        // Now cleanArgs contains only the actual command arguments without mentions
        const action = cleanArgs[0]?.toLowerCase();
        
        const userId = targetUser.split('@')[0];
        const userName = userId;
        
        try {
            if (action === 'money') {
                const subAction = cleanArgs[1]?.toLowerCase();
                
                if (!subAction) {
                    // Check balance
                    const balance = await getBalance(targetUser);
                    return await sock.sendMessage(from, {
                        text: t.moneyCheck.replace('{user}', userName).replace('{amount}', balance.toLocaleString()),
                        mentions: [targetUser]
                    });
                }
                
                if (subAction === 'set') {
                    const amount = parseInt(cleanArgs[2]);
                    if (isNaN(amount) || amount < 0) {
                        return await sock.sendMessage(from, { text: t.invalidAmount });
                    }
                    
                    await setBalance(targetUser, amount);
                    return await sock.sendMessage(from, {
                        text: t.moneySet.replace('{user}', userName).replace('{amount}', amount.toLocaleString()),
                        mentions: [targetUser]
                    });
                }
                
                if (subAction === 'add') {
                    const amount = parseInt(cleanArgs[2]);
                    if (isNaN(amount) || amount <= 0) {
                        return await sock.sendMessage(from, { text: t.invalidAmount });
                    }
                    
                    await addCoins(targetUser, amount);
                    const newBalance = await getBalance(targetUser);
                    return await sock.sendMessage(from, {
                        text: t.moneyAdd.replace('{user}', userName).replace('{amount}', amount.toLocaleString()).replace('{total}', newBalance.toLocaleString()),
                        mentions: [targetUser]
                    });
                }
                
                if (subAction === 'remove') {
                    const amount = parseInt(cleanArgs[2]);
                    if (isNaN(amount) || amount <= 0) {
                        return await sock.sendMessage(from, { text: t.invalidAmount });
                    }
                    
                    await removeCoins(targetUser, amount);
                    const newBalance = await getBalance(targetUser);
                    return await sock.sendMessage(from, {
                        text: t.moneyRemove.replace('{user}', userName).replace('{amount}', amount.toLocaleString()).replace('{total}', newBalance.toLocaleString()),
                        mentions: [targetUser]
                    });
                }
                
                return await sock.sendMessage(from, { text: t.invalidSubAction });
            }
            
            if (action === 'inventory') {
                const subAction = cleanArgs[1]?.toLowerCase();
                
                if (!subAction) {
                    // View inventory
                    const allInventories = loadAllInventories();
                    const userInventory = allInventories[userId] || {};
                    
                    if (Object.keys(userInventory).length === 0) {
                        return await sock.sendMessage(from, {
                            text: t.inventoryEmpty.replace('{user}', userName),
                            mentions: [targetUser]
                        });
                    }
                    
                    let itemsList = '';
                    for (const [item, data] of Object.entries(userInventory)) {
                        let hoursLeft = 0;
                        
                        // Handle both data formats: expiresAt (manage command) and purchaseDate+duration (shop system)
                        if (data.expiresAt) {
                            // Format from manage command: expiresAt is ISO date string
                            const expiresAt = new Date(data.expiresAt);
                            const now = new Date();
                            hoursLeft = Math.max(0, Math.round((expiresAt - now) / (1000 * 60 * 60)));
                        } else if (data.purchaseDate && data.duration) {
                            // Format from shop system: purchaseDate + duration in days
                            const purchaseDate = new Date(data.purchaseDate);
                            const now = new Date();
                            const daysLeft = data.duration - Math.floor((now - purchaseDate) / (1000 * 60 * 60 * 24));
                            hoursLeft = Math.max(0, daysLeft * 24);
                        }
                        
                        const displayName = itemNames[item] || item;
                        itemsList += `${displayName}\n  Expires in: ${hoursLeft}h (${Math.floor(hoursLeft / 24)}d)\n\n`;
                    }
                    
                    return await sock.sendMessage(from, {
                        text: t.inventoryView.replace('{user}', userName).replace('{items}', itemsList),
                        mentions: [targetUser]
                    });
                }
                
                if (subAction === 'add') {
                    const item = cleanArgs[2]?.toLowerCase();
                    const duration = parseInt(cleanArgs[3]);
                    
                    if (!item || !validItems.includes(item)) {
                        return await sock.sendMessage(from, { text: t.invalidItem });
                    }
                    
                    if (isNaN(duration) || duration <= 0) {
                        return await sock.sendMessage(from, { text: t.invalidDuration });
                    }
                    
                    const allInventories = loadAllInventories();
                    if (!allInventories[userId]) allInventories[userId] = {};
                    
                    const expiresAt = new Date();
                    expiresAt.setHours(expiresAt.getHours() + duration);
                    
                    allInventories[userId][item] = {
                        expiresAt: expiresAt.toISOString(),
                        purchasedAt: new Date().toISOString()
                    };
                    
                    saveAllInventories(allInventories);
                    
                    return await sock.sendMessage(from, {
                        text: t.inventoryAdd.replace('{user}', userName).replace('{item}', itemNames[item] || item).replace('{duration}', duration),
                        mentions: [targetUser]
                    });
                }
                
                if (subAction === 'remove') {
                    const item = cleanArgs[2]?.toLowerCase();
                    
                    if (!item || !validItems.includes(item)) {
                        return await sock.sendMessage(from, { text: t.invalidItem });
                    }
                    
                    const allInventories = loadAllInventories();
                    if (!allInventories[userId] || !allInventories[userId][item]) {
                        return await sock.sendMessage(from, { text: t.itemNotFound });
                    }
                    
                    delete allInventories[userId][item];
                    if (Object.keys(allInventories[userId]).length === 0) {
                        delete allInventories[userId];
                    }
                    
                    saveAllInventories(allInventories);
                    
                    return await sock.sendMessage(from, {
                        text: t.inventoryRemove.replace('{user}', userName).replace('{item}', itemNames[item] || item),
                        mentions: [targetUser]
                    });
                }
                
                if (subAction === 'clear') {
                    const allInventories = loadAllInventories();
                    delete allInventories[userId];
                    saveAllInventories(allInventories);
                    
                    return await sock.sendMessage(from, {
                        text: t.inventoryClear.replace('{user}', userName),
                        mentions: [targetUser]
                    });
                }
                
                return await sock.sendMessage(from, { text: t.invalidSubAction });
            }
            
            if (action === 'weapon') {
                const subAction = cleanArgs[1]?.toLowerCase();
                
                if (!subAction) {
                    // View weapons
                    const allWeapons = loadWeapons();
                    const userWeapons = allWeapons[userId] || {};
                    
                    if (Object.keys(userWeapons).length === 0) {
                        return await sock.sendMessage(from, {
                            text: t.weaponEmpty.replace('{user}', userName),
                            mentions: [targetUser]
                        });
                    }
                    
                    let weaponsList = '';
                    for (const [weapon, count] of Object.entries(userWeapons)) {
                        const displayName = weaponNames[weapon] || weapon;
                        weaponsList += `${displayName} x${count}\n`;
                    }
                    
                    return await sock.sendMessage(from, {
                        text: t.weaponView.replace('{user}', userName).replace('{weapons}', weaponsList),
                        mentions: [targetUser]
                    });
                }
                
                if (subAction === 'add') {
                    const weapon = cleanArgs[2]?.toLowerCase();
                    const quantity = parseInt(cleanArgs[3]) || 1;
                    
                    if (!weapon || !validWeapons.includes(weapon)) {
                        return await sock.sendMessage(from, { 
                            text: t.invalidWeapon.replace('{weapons}', validWeapons.join(', '))
                        });
                    }
                    
                    if (isNaN(quantity) || quantity <= 0) {
                        return await sock.sendMessage(from, { text: t.invalidQuantity });
                    }
                    
                    const allWeapons = loadWeapons();
                    if (!allWeapons[userId]) allWeapons[userId] = {};
                    allWeapons[userId][weapon] = (allWeapons[userId][weapon] || 0) + quantity;
                    
                    saveWeapons(allWeapons);
                    
                    return await sock.sendMessage(from, {
                        text: t.weaponAdd.replace('{user}', userName).replace('{quantity}', quantity).replace('{weapon}', weaponNames[weapon] || weapon),
                        mentions: [targetUser]
                    });
                }
                
                if (subAction === 'remove') {
                    const weapon = cleanArgs[2]?.toLowerCase();
                    const quantity = parseInt(cleanArgs[3]) || 1;
                    
                    if (!weapon || !validWeapons.includes(weapon)) {
                        return await sock.sendMessage(from, { 
                            text: t.invalidWeapon.replace('{weapons}', validWeapons.join(', '))
                        });
                    }
                    
                    const allWeapons = loadWeapons();
                    if (!allWeapons[userId] || !allWeapons[userId][weapon]) {
                        return await sock.sendMessage(from, { text: t.weaponNotFound });
                    }
                    
                    allWeapons[userId][weapon] = Math.max(0, allWeapons[userId][weapon] - quantity);
                    if (allWeapons[userId][weapon] === 0) {
                        delete allWeapons[userId][weapon];
                    }
                    if (Object.keys(allWeapons[userId]).length === 0) {
                        delete allWeapons[userId];
                    }
                    
                    saveWeapons(allWeapons);
                    
                    return await sock.sendMessage(from, {
                        text: t.weaponRemove.replace('{user}', userName).replace('{quantity}', quantity).replace('{weapon}', weaponNames[weapon] || weapon),
                        mentions: [targetUser]
                    });
                }
                
                if (subAction === 'clear') {
                    const allWeapons = loadWeapons();
                    delete allWeapons[userId];
                    saveWeapons(allWeapons);
                    
                    return await sock.sendMessage(from, {
                        text: t.weaponClear.replace('{user}', userName),
                        mentions: [targetUser]
                    });
                }
                
                return await sock.sendMessage(from, { text: t.invalidSubAction });
            }
            
            return await sock.sendMessage(from, { text: t.invalidAction });
            
        } catch (error) {
            console.error('[MANAGE] Error:', error.message);
            await sock.sendMessage(from, { 
                text: `❌ Error: ${error.message}` 
            });
        }
    }
};
