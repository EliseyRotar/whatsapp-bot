import { getBalance, removeCoins } from '../../utils/bank_SAFE.js';
import { getActiveItems, loadInventory, isItemActive } from '../../utils/shopSystem.js';
import { getGroupLanguage } from '../../utils/language.js';
import { isOwnerOrAdditional } from '../../utils/ownerManager.js';
import { config } from '../../config.js';
import { addWarning, getWarnings } from '../../utils/database.js';
import { hasReachedLimit, incrementUsage, getRemainingUses } from '../../utils/dailyLimits.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Jimp, JimpMime } from 'jimp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const weaponsPath = path.join(process.cwd(), 'data', 'weapons.json');
const mutedPath = path.join(process.cwd(), 'data', 'muted_users.json');

// Weapon types with success rates and prices
const WEAPONS = {
    knife: { name: 'Knife', baseRate: 30, price: 25000, emoji: '🔪' },
    pistol: { name: 'Pistol', baseRate: 50, price: 75000, emoji: '🔫' },
    rifle: { name: 'Rifle', baseRate: 70, price: 175000, emoji: '🔫' },
    sniper: { name: 'Sniper', baseRate: 85, price: 350000, emoji: '🎯' },
    rpg: { name: 'RPG', baseRate: 95, price: 750000, emoji: '🚀' }
};

const MUTE_DURATION = 5 * 60 * 1000; // 5 minutes
const COIN_PENALTY = 10000; // Coins lost when killed

const responses = {
    en: {
        noMention: '❌ Mention a user to kill!\n\nUsage: .kill @user',
        cantKillSelf: '❌ You cannot kill yourself!',
        cantKillOwner: '⚠️ WARNING: You cannot kill the bot owner!\n\n🚨 You have been warned for attempting this.\n\n👑 Respect the owner!',
        dailyLimit: '⏰ Daily Limit Reached!\n\nYou\'ve used all {limit} kills for today.\n\n🔄 Resets at midnight\n📊 Used: {used}/{limit}',
        noWeapons: '❌ You don\'t have any weapons!\n\n💡 Buy weapons from .shop:\n',
        weaponList: '🔫 Your Weapons:\n\n',
        usage: '\n\n💡 Usage: .kill @user <weapon>\nExample: .kill @user pistol',
        invalidWeapon: '❌ Invalid weapon!\n\nAvailable: ',
        noWeaponOwned: '❌ You don\'t have a {weapon}!',
        rolling: '{emoji} @{user} used {weapon}...\n\n⏳ Rolling... ({rate}% chance)',
        wasted: '💀 WASTED 💀\n\n@{victim} has been killed by @{killer}!\n\n💸 Lost {coins} coins\n🔇 Muted for 5 minutes\n\n🎯 Success rate: {rate}%',
        miss: '❌ MISS!\n\n@{user} missed the shot!\n\n🎯 Success rate was: {rate}%\n🎲 Rolled: {roll}%\n\n💔 Weapon lost anyway!',
        shieldBlocked: '🛡️ SHIELD BLOCKED!\n\n{emoji} @{target}\'s shield absorbed the attack!\n\n🔫 @{attacker}\'s {weapon} was blocked!\n💔 Weapon lost anyway!\n\n🛡️ Shield: {protection}% protection\n',
        shieldBroken: '💥 Shield BROKEN! (0 uses remaining)\n',
        shieldIntact: '✅ Shield intact ({remaining} uses remaining)\n'
    },
    it: {
        noMention: '❌ Menziona un utente da killare!\n\nUso: .kill @utente',
        cantKillSelf: '❌ Non puoi killare te stesso!',
        cantKillOwner: '⚠️ AVVISO: Non puoi killare il proprietario del bot!\n\n🚨 Sei stato avvisato per aver tentato questo.\n\n👑 Rispetta il proprietario!',
        dailyLimit: '⏰ Limite Giornaliero Raggiunto!\n\nHai usato tutti i {limit} kill per oggi.\n\n🔄 Si resetta a mezzanotte\n📊 Usati: {used}/{limit}',
        noWeapons: '❌ Non hai armi!\n\n💡 Compra armi dal .shop:\n',
        weaponList: '🔫 Le Tue Armi:\n\n',
        usage: '\n\n💡 Uso: .kill @utente <arma>\nEsempio: .kill @utente pistol',
        invalidWeapon: '❌ Arma non valida!\n\nDisponibili: ',
        noWeaponOwned: '❌ Non hai un {weapon}!',
        rolling: '{emoji} @{user} ha usato {weapon}...\n\n⏳ Tirando... ({rate}% probabilità)',
        wasted: '💀 WASTED 💀\n\n@{victim} è stato killato da @{killer}!\n\n💸 Persi {coins} monete\n🔇 Mutato per 5 minuti\n\n🎯 Tasso successo: {rate}%',
        miss: '❌ MANCATO!\n\n@{user} ha mancato il colpo!\n\n🎯 Tasso successo era: {rate}%\n🎲 Tirato: {roll}%\n\n💔 Arma persa comunque!',
        shieldBlocked: '🛡️ SCUDO BLOCCATO!\n\n{emoji} Lo scudo di @{target} ha assorbito l\'attacco!\n\n🔫 Il {weapon} di @{attacker} è stato bloccato!\n💔 Arma persa comunque!\n\n🛡️ Scudo: {protection}% protezione\n',
        shieldBroken: '💥 Scudo ROTTO! (0 usi rimanenti)\n',
        shieldIntact: '✅ Scudo intatto ({remaining} usi rimanenti)\n'
    },
    ru: {
        noMention: '❌ Упомяните пользователя для убийства!\n\nИспользование: .kill @пользователь',
        cantKillSelf: '❌ Вы не можете убить себя!',
        cantKillOwner: '⚠️ ПРЕДУПРЕЖДЕНИЕ: Вы не можете убить владельца бота!\n\n🚨 Вы получили предупреждение за эту попытку.\n\n👑 Уважайте владельца!',
        dailyLimit: '⏰ Дневной Лимит Достигнут!\n\nВы использовали все {limit} убийств на сегодня.\n\n🔄 Сброс в полночь\n📊 Использовано: {used}/{limit}',
        noWeapons: '❌ У вас нет оружия!\n\n💡 Купите оружие в .shop:\n',
        weaponList: '🔫 Ваше Оружие:\n\n',
        usage: '\n\n💡 Использование: .kill @пользователь <оружие>\nПример: .kill @пользователь pistol',
        invalidWeapon: '❌ Неверное оружие!\n\nДоступно: ',
        noWeaponOwned: '❌ У вас нет {weapon}!',
        rolling: '{emoji} @{user} использовал {weapon}...\n\n⏳ Бросаем... ({rate}% шанс)',
        wasted: '💀 WASTED 💀\n\n@{victim} был убит @{killer}!\n\n💸 Потеряно {coins} монет\n🔇 Заглушен на 5 минут\n\n🎯 Шанс успеха: {rate}%',
        miss: '❌ ПРОМАХ!\n\n@{user} промахнулся!\n\n🎯 Шанс успеха был: {rate}%\n🎲 Выпало: {roll}%\n\n💔 Оружие потеряно в любом случае!',
        shieldBlocked: '🛡️ ЩИТ ЗАБЛОКИРОВАЛ!\n\n{emoji} Щит @{target} поглотил атаку!\n\n🔫 {weapon} @{attacker} был заблокирован!\n💔 Оружие потеряно в любом случае!\n\n🛡️ Щит: {protection}% защита\n',
        shieldBroken: '💥 Щит СЛОМАН! (0 использований осталось)\n',
        shieldIntact: '✅ Щит цел ({remaining} использований осталось)\n'
    },
    es: {
        noMention: '❌ ¡Menciona un usuario para matar!\n\nUso: .kill @usuario',
        cantKillSelf: '❌ ¡No puedes matarte a ti mismo!',
        cantKillOwner: '⚠️ ADVERTENCIA: ¡No puedes matar al dueño del bot!\n\n🚨 Has sido advertido por intentar esto.\n\n👑 ¡Respeta al dueño!',
        dailyLimit: '⏰ ¡Límite Diario Alcanzado!\n\nHas usado todos los {limit} asesinatos de hoy.\n\n🔄 Se reinicia a medianoche\n📊 Usados: {used}/{limit}',
        noWeapons: '❌ ¡No tienes armas!\n\n💡 Compra armas en .shop:\n',
        weaponList: '🔫 Tus Armas:\n\n',
        usage: '\n\n💡 Uso: .kill @usuario <arma>\nEjemplo: .kill @usuario pistol',
        invalidWeapon: '❌ ¡Arma inválida!\n\nDisponibles: ',
        noWeaponOwned: '❌ ¡No tienes un {weapon}!',
        rolling: '{emoji} @{user} usó {weapon}...\n\n⏳ Tirando... ({rate}% probabilidad)',
        wasted: '💀 WASTED 💀\n\n¡@{victim} ha sido asesinado por @{killer}!\n\n💸 Perdió {coins} monedas\n🔇 Silenciado por 5 minutos\n\n🎯 Tasa de éxito: {rate}%',
        miss: '❌ ¡FALLO!\n\n¡@{user} falló el tiro!\n\n🎯 Tasa de éxito era: {rate}%\n🎲 Tirado: {roll}%\n\n💔 ¡Arma perdida de todos modos!',
        shieldBlocked: '🛡️ ¡ESCUDO BLOQUEADO!\n\n{emoji} ¡El escudo de @{target} absorbió el ataque!\n\n🔫 ¡El {weapon} de @{attacker} fue bloqueado!\n💔 ¡Arma perdida de todos modos!\n\n🛡️ Escudo: {protection}% protección\n',
        shieldBroken: '💥 ¡Escudo ROTO! (0 usos restantes)\n',
        shieldIntact: '✅ Escudo intacto ({remaining} usos restantes)\n'
    },
    pt: {
        noMention: '❌ Mencione um usuário para matar!\n\nUso: .kill @usuário',
        cantKillSelf: '❌ Você não pode se matar!',
        cantKillOwner: '⚠️ AVISO: Você não pode matar o dono do bot!\n\n🚨 Você foi avisado por tentar isso.\n\n👑 Respeite o dono!',
        dailyLimit: '⏰ Limite Diário Atingido!\n\nVocê usou todos os {limit} assassinatos de hoje.\n\n🔄 Reinicia à meia-noite\n📊 Usados: {used}/{limit}',
        noWeapons: '❌ Você não tem armas!\n\n💡 Compre armas na .shop:\n',
        weaponList: '🔫 Suas Armas:\n\n',
        usage: '\n\n💡 Uso: .kill @usuário <arma>\nExemplo: .kill @usuário pistol',
        invalidWeapon: '❌ Arma inválida!\n\nDisponíveis: ',
        noWeaponOwned: '❌ Você não tem um {weapon}!',
        rolling: '{emoji} @{user} usou {weapon}...\n\n⏳ Rolando... ({rate}% chance)',
        wasted: '💀 WASTED 💀\n\n@{victim} foi morto por @{killer}!\n\n💸 Perdeu {coins} moedas\n🔇 Silenciado por 5 minutos\n\n🎯 Taxa de sucesso: {rate}%',
        miss: '❌ ERROU!\n\n@{user} errou o tiro!\n\n🎯 Taxa de sucesso era: {rate}%\n🎲 Rolou: {roll}%\n\n💔 Arma perdida mesmo assim!',
        shieldBlocked: '🛡️ ESCUDO BLOQUEOU!\n\n{emoji} O escudo de @{target} absorveu o ataque!\n\n🔫 O {weapon} de @{attacker} foi bloqueado!\n💔 Arma perdida mesmo assim!\n\n🛡️ Escudo: {protection}% proteção\n',
        shieldBroken: '💥 Escudo QUEBRADO! (0 usos restantes)\n',
        shieldIntact: '✅ Escudo intacto ({remaining} usos restantes)\n'
    },
    ar: {
        noMention: '❌ منشن يوزر عشان تقتله!\n\nالاستخدام: .kill @يوزر',
        cantKillSelf: '❌ مينفعش تقتل نفسك!',
        cantKillOwner: '⚠️ تحذير: مينفعش تقتل صاحب البوت!\n\n🚨 تم تحذيرك لمحاولة هذا.\n\n👑 احترم المالك!',
        dailyLimit: '⏰ وصلت للحد اليومي!\n\nاستخدمت كل الـ {limit} قتل لليوم.\n\n🔄 يتجدد عند منتصف الليل\n📊 المستخدم: {used}/{limit}',
        noWeapons: '❌ معندكش أسلحة!\n\n💡 اشتري أسلحة من .shop:\n',
        weaponList: '🔫 أسلحتك:\n\n',
        usage: '\n\n💡 الاستخدام: .kill @يوزر <سلاح>\nمثال: .kill @يوزر pistol',
        invalidWeapon: '❌ سلاح غلط!\n\nالمتاح: ',
        noWeaponOwned: '❌ معندكش {weapon}!',
        rolling: '{emoji} @{user} استخدم {weapon}...\n\n⏳ بنرمي... ({rate}% فرصة)',
        wasted: '💀 WASTED 💀\n\n@{victim} اتقتل بواسطة @{killer}!\n\n💸 خسر {coins} عملة\n🔇 متكتم لمدة 5 دقائق\n\n🎯 معدل النجاح: {rate}%',
        miss: '❌ غلط!\n\n@{user} فوّت الطلقة!\n\n🎯 معدل النجاح كان: {rate}%\n🎲 طلع: {roll}%\n\n💔 السلاح ضاع برضو!',
        shieldBlocked: '🛡️ الدرع حجب الهجوم!\n\n{emoji} درع @{target} امتص الهجوم!\n\n🔫 {weapon} @{attacker} اتحجب!\n💔 السلاح ضاع برضو!\n\n🛡️ الدرع: {protection}% حماية\n',
        shieldBroken: '💥 الدرع اتكسر! (0 استخدامات متبقية)\n',
        shieldIntact: '✅ الدرع سليم ({remaining} استخدامات متبقية)\n'
    },
    hi: {
        noMention: '❌ मारने के लिए किसी उपयोगकर्ता का उल्लेख करें!\n\nउपयोग: .kill @उपयोगकर्ता',
        cantKillSelf: '❌ आप खुद को नहीं मार सकते!',
        cantKillOwner: '⚠️ चेतावनी: आप बॉट के मालिक को नहीं मार सकते!\n\n🚨 इसका प्रयास करने के लिए आपको चेतावनी दी गई है।\n\n👑 मालिक का सम्मान करें!',
        dailyLimit: '⏰ दैनिक सीमा पूर्ण!\n\nआपने आज के सभी {limit} हत्याएं उपयोग कर लिए हैं।\n\n🔄 आधी रात को रीसेट होता है\n📊 उपयोग किया: {used}/{limit}',
        noWeapons: '❌ आपके पास कोई हथियार नहीं है!\n\n💡 .shop से हथियार खरीदें:\n',
        weaponList: '🔫 आपके हथियार:\n\n',
        usage: '\n\n💡 उपयोग: .kill @उपयोगकर्ता <हथियार>\nउदाहरण: .kill @उपयोगकर्ता pistol',
        invalidWeapon: '❌ अमान्य हथियार!\n\nउपलब्ध: ',
        noWeaponOwned: '❌ आपके पास {weapon} नहीं है!',
        rolling: '{emoji} @{user} ने {weapon} का उपयोग किया...\n\n⏳ रोलिंग... ({rate}% संभावना)',
        wasted: '💀 WASTED 💀\n\n@{victim} को @{killer} द्वारा मार दिया गया!\n\n💸 खोया {coins} सिक्के\n🔇 5 मिनट के लिए म्यूट\n\n🎯 सफलता दर: {rate}%',
        miss: '❌ मिस!\n\n@{user} ने शॉट मिस कर दिया!\n\n🎯 सफलता दर थी: {rate}%\n🎲 रोल: {roll}%\n\n💔 हथियार वैसे भी खो गया!',
        shieldBlocked: '🛡️ शील्ड ने ब्लॉक किया!\n\n{emoji} @{target} की शील्ड ने हमले को अवशोषित कर लिया!\n\n🔫 @{attacker} का {weapon} ब्लॉक हो गया!\n💔 हथियार वैसे भी खो गया!\n\n🛡️ शील्ड: {protection}% सुरक्षा\n',
        shieldBroken: '💥 शील्ड टूट गई! (0 उपयोग शेष)\n',
        shieldIntact: '✅ शील्ड बरकरार ({remaining} उपयोग शेष)\n'
    },
    ng: {
        noMention: '❌ Mention user wey you wan kill!\n\nHow to use: .kill @user',
        cantKillSelf: '❌ You no fit kill yourself!',
        cantKillOwner: '⚠️ WARNING: You no fit kill the bot owner!\n\n🚨 You don get warning for trying this thing.\n\n👑 Respect the owner!',
        dailyLimit: '⏰ Daily Limit Don Reach!\n\nYou don use all {limit} kills for today.\n\n🔄 E go reset for midnight\n📊 Used: {used}/{limit}',
        noWeapons: '❌ You no get any weapons!\n\n💡 Buy weapons from .shop:\n',
        weaponList: '🔫 Your Weapons:\n\n',
        usage: '\n\n💡 How to use: .kill @user <weapon>\nExample: .kill @user pistol',
        invalidWeapon: '❌ Weapon no correct!\n\nWetin dey: ',
        noWeaponOwned: '❌ You no get {weapon}!',
        rolling: '{emoji} @{user} don use {weapon}...\n\n⏳ Dey roll... ({rate}% chance)',
        wasted: '💀 WASTED 💀\n\n@{victim} don die by @{killer}!\n\n💸 Lost {coins} coins\n🔇 Muted for 5 minutes\n\n🎯 Success rate: {rate}%',
        miss: '❌ MISS!\n\n@{user} miss the shot!\n\n🎯 Success rate na: {rate}%\n🎲 Rolled: {roll}%\n\n💔 Weapon don lost anyway!',
        shieldBlocked: '🛡️ SHIELD BLOCKED!\n\n{emoji} @{target}\'s shield don block the attack!\n\n🔫 @{attacker}\'s {weapon} no work!\n💔 Weapon don lost anyway!\n\n🛡️ Shield: {protection}% protection\n',
        shieldBroken: '💥 Shield DON BREAK! (0 uses remaining)\n',
        shieldIntact: '✅ Shield still dey ({remaining} uses remaining)\n'
    }
};

function loadWeapons() {
    try {
        if (fs.existsSync(weaponsPath)) {
            return JSON.parse(fs.readFileSync(weaponsPath, 'utf8'));
        }
    } catch (error) {
        console.error('[KILL] Error loading weapons:', error);
    }
    return {};
}

function saveWeapons(data) {
    try {
        fs.writeFileSync(weaponsPath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('[KILL] Error saving weapons:', error);
    }
}

function loadMuted() {
    try {
        if (fs.existsSync(mutedPath)) {
            return JSON.parse(fs.readFileSync(mutedPath, 'utf8'));
        }
    } catch (error) {
        console.error('[KILL] Error loading muted:', error);
    }
    return {};
}

function saveMuted(data) {
    try {
        fs.writeFileSync(mutedPath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('[KILL] Error saving muted:', error);
    }
}

function getUserWeapons(userId) {
    const weapons = loadWeapons();
    return weapons[userId] || {};
}

function addWeapon(userId, weaponType) {
    const weapons = loadWeapons();
    if (!weapons[userId]) weapons[userId] = {};
    weapons[userId][weaponType] = (weapons[userId][weaponType] || 0) + 1;
    saveWeapons(weapons);
}

function removeWeapon(userId, weaponType) {
    const weapons = loadWeapons();
    if (weapons[userId] && weapons[userId][weaponType] > 0) {
        weapons[userId][weaponType]--;
        if (weapons[userId][weaponType] === 0) {
            delete weapons[userId][weaponType];
        }
        saveWeapons(weapons);
        return true;
    }
    return false;
}

function muteUser(groupId, userId) {
    const muted = loadMuted();
    const key = `${groupId}_${userId}`;
    muted[key] = Date.now() + MUTE_DURATION;
    saveMuted(muted);
}

function isUserMuted(groupId, userId) {
    const muted = loadMuted();
    const key = `${groupId}_${userId}`;
    if (muted[key] && muted[key] > Date.now()) {
        return true;
    }
    if (muted[key]) {
        delete muted[key];
        saveMuted(muted);
    }
    return false;
}

async function createWastedImage(profilePicUrl) {
    try {
        // Download profile picture
        const response = await fetch(profilePicUrl);
        if (!response.ok) throw new Error(`Failed to fetch profile pic: ${response.status}`);
        const arrayBuffer = await response.arrayBuffer();
        const imageBuffer = Buffer.from(arrayBuffer);

        // Load profile picture
        const image = await Jimp.read(imageBuffer);

        // Crop to square (centered)
        const size = Math.min(image.bitmap.width, image.bitmap.height);
        if (image.bitmap.width !== size || image.bitmap.height !== size) {
            const cropX = Math.floor((image.bitmap.width - size) / 2);
            const cropY = Math.floor((image.bitmap.height - size) / 2);
            image.crop({ x: cropX, y: cropY, w: size, h: size });
        }

        // Blur + red tint + darken
        image.blur(3);
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
            this.bitmap.data[idx + 0] = Math.min(255, this.bitmap.data[idx + 0] + 40);
            this.bitmap.data[idx + 1] = Math.max(0, this.bitmap.data[idx + 1] - 20);
            this.bitmap.data[idx + 2] = Math.max(0, this.bitmap.data[idx + 2] - 20);
        });
        image.brightness(-0.15);

        // Load wasted.png overlay (must stay PNG to preserve transparency)
        const wastedPath = path.join(process.cwd(), 'assets', 'images', 'wasted.png');
        const wastedOverlay = await Jimp.read(wastedPath);

        // Resize overlay to 70% of image width, keep aspect ratio
        const overlayWidth = Math.floor(image.bitmap.width * 0.7);
        wastedOverlay.resize({ w: overlayWidth, h: Jimp.AUTO });

        // Center the overlay
        const x = Math.floor((image.bitmap.width - wastedOverlay.bitmap.width) / 2);
        const y = Math.floor((image.bitmap.height - wastedOverlay.bitmap.height) / 2);

        // Composite overlay (PNG alpha is preserved in memory)
        image.composite(wastedOverlay, x, y);

        // Return as JPEG buffer (no temp file needed, no alpha loss since overlay is already composited)
        return await image.getBuffer(JimpMime.jpeg);
    } catch (error) {
        console.error('[KILL] Error creating wasted image:', error.message);
        return null;
    }
}

export default {
    name: 'kill',
    aliases: ['k'],
    description: 'Kill another user with a weapon (GTA style)',
    groupOnly: true,
    
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const senderId = sender.split('@')[0];
        
        // Get language
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        // Check if mentioned user
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!mentioned) {
            return await sock.sendMessage(from, {
                text: t.noMention
            });
        }
        
        const targetId = mentioned.split('@')[0];
        
        // Can't kill yourself
        if (senderId === targetId) {
            return await sock.sendMessage(from, {
                text: t.cantKillSelf
            });
        }

        // Check daily limit
        if (hasReachedLimit(senderId, 'kill')) {
            return await sock.sendMessage(from, {
                text: t.dailyLimit
                    .replace(/{limit}/g, '5')
                    .replace('{used}', '5')
            });
        }

        // Check if trying to kill the bot owner
        const botJid = sock.user?.id?.replace(/:\d+/, '') || '';
        const isTargetOwner = isOwnerOrAdditional(mentioned, botJid, config.ownerNumber, config.ownerJid, false);
        
        if (isTargetOwner) {
            // Add warning to the attacker
            try {
                await addWarning(from, sender, 'Attempted to kill the bot owner');
                const warnings = getWarnings(from, sender);
                
                let warningMsg = t.cantKillOwner;
                warningMsg += `\n\n⚠️ Warnings: ${warnings.count || 0}/${config.maxWarnings || 3}`;
                
                if (warnings.count >= (config.maxWarnings || 3)) {
                    warningMsg += '\n\n🚨 Maximum warnings reached! You will be kicked.';
                }
                
                return await sock.sendMessage(from, {
                    text: warningMsg,
                    mentions: [sender]
                });
            } catch (error) {
                console.error('[KILL] Error adding warning:', error);
                return await sock.sendMessage(from, {
                    text: t.cantKillOwner,
                    mentions: [sender]
                });
            }
        }
        
        // Check if user has any weapons
        const userWeapons = getUserWeapons(senderId);
        const weaponTypes = Object.keys(userWeapons).filter(w => userWeapons[w] > 0);
        
        if (weaponTypes.length === 0) {
            let weaponListText = t.noWeapons;
            weaponListText += Object.entries(WEAPONS).map(([key, w]) => 
                `${w.emoji} ${w.name} - ${w.price.toLocaleString()} coins (${w.baseRate}% success)`
            ).join('\n');
            
            return await sock.sendMessage(from, {
                text: weaponListText
            });
        }
        
        // Show weapon selection if no weapon specified
        if (args.length < 2) {
            const weaponList = weaponTypes.map(w => {
                const weapon = WEAPONS[w];
                return `${weapon.emoji} ${weapon.name} x${userWeapons[w]} (${weapon.baseRate}% base success)`;
            }).join('\n');
            
            return await sock.sendMessage(from, {
                text: t.weaponList + weaponList + t.usage
            });
        }
        
        // Get weapon type
        const weaponType = args[1].toLowerCase();
        if (!WEAPONS[weaponType]) {
            return await sock.sendMessage(from, {
                text: t.invalidWeapon + Object.keys(WEAPONS).join(', ')
            });
        }
        
        // Check if user has this weapon
        if (!userWeapons[weaponType] || userWeapons[weaponType] === 0) {
            return await sock.sendMessage(from, {
                text: t.noWeaponOwned.replace('{weapon}', WEAPONS[weaponType].name)
            });
        }
        
        // Calculate success rate
        let successRate = WEAPONS[weaponType].baseRate;
        
        // Apply boosts - check if user has active items
        const inventory = loadInventory(senderId);
        if (inventory.lucky_charm && isItemActive(inventory.lucky_charm)) successRate += 5;
        if (inventory.mega_luck && isItemActive(inventory.mega_luck)) successRate += 10;
        if (inventory.vip && isItemActive(inventory.vip)) successRate += 3;
        if (inventory.premium && isItemActive(inventory.premium)) successRate += 5;
        if (inventory.legend && isItemActive(inventory.legend)) successRate += 8;
        
        // Cap at 98%
        successRate = Math.min(successRate, 98);
        
        // Remove weapon (single use)
        removeWeapon(senderId, weaponType);
        
        // Roll for success
        const roll = Math.random() * 100;
        const success = roll < successRate;
        
        await sock.sendMessage(from, {
            text: t.rolling
                .replace('{emoji}', WEAPONS[weaponType].emoji)
                .replace('{user}', senderId)
                .replace('{weapon}', WEAPONS[weaponType].name)
                .replace('{rate}', successRate),
            mentions: [sender]
        });
        
        // Wait 2 seconds for suspense
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check if target has shield protection
        const { checkShieldProtection, consumeShield } = await import('../../utils/economy/shieldSystem.js');
        const shieldCheck = checkShieldProtection(targetId);
        
        if (shieldCheck.blocked && shieldCheck.shield) {
            // Shield blocked the attack!
            const shieldResult = consumeShield(targetId, true);
            
            let shieldMsg = t.shieldBlocked
                .replace('{emoji}', shieldCheck.shield.emoji)
                .replace('{target}', targetId)
                .replace('{attacker}', senderId)
                .replace('{weapon}', WEAPONS[weaponType].name)
                .replace('{protection}', shieldCheck.shield.protection);
            
            if (shieldResult.broken) {
                shieldMsg += t.shieldBroken;
            } else {
                shieldMsg += t.shieldIntact.replace('{remaining}', shieldResult.remaining.toFixed(1));
            }
            
            return await sock.sendMessage(from, {
                text: shieldMsg,
                mentions: [mentioned, sender]
            });
        }
        
        // If shield didn't block, consume durability anyway (shield took damage but failed)
        if (shieldCheck.shield) {
            consumeShield(targetId, false);
        }
        
        if (success) {
            // SUCCESS - Kill the target
            
            // Increment kill usage counter
            incrementUsage(senderId, 'kill');
            
            // Get target's profile picture
            let profilePicUrl;
            try {
                profilePicUrl = await sock.profilePictureUrl(mentioned, 'image');
            } catch (error) {
                profilePicUrl = null;
            }
            
            // Create WASTED image
            let wastedImage = null;
            if (profilePicUrl) {
                wastedImage = await createWastedImage(profilePicUrl);
            }
            
            // Apply penalties
            const targetBalance = await getBalance(targetId);
            const coinsLost = Math.min(targetBalance, COIN_PENALTY);
            if (coinsLost > 0) {
                await removeCoins(targetId, coinsLost);
            }
            
            // Mute user
            muteUser(from, targetId);
            
            // Send WASTED image or text
            const wastedText = t.wasted
                .replace('{victim}', targetId)
                .replace('{killer}', senderId)
                .replace('{coins}', coinsLost.toLocaleString())
                .replace('{rate}', successRate);
            
            if (wastedImage) {
                await sock.sendMessage(from, {
                    image: wastedImage,
                    caption: wastedText,
                    mentions: [mentioned, sender]
                });
            } else {
                await sock.sendMessage(from, {
                    text: wastedText,
                    mentions: [mentioned, sender]
                });
            }
        } else {
            // FAILED
            await sock.sendMessage(from, {
                text: t.miss
                    .replace('{user}', senderId)
                    .replace('{rate}', successRate)
                    .replace('{roll}', roll.toFixed(1)),
                mentions: [sender]
            });
        }
    }
};

// Export functions for message handler to check mutes
export { isUserMuted, loadMuted, saveMuted };
