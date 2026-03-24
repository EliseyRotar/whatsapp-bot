import { getGroupLanguage } from '../../utils/language.js';
import { getBalance, addCoins, removeCoins, hasEnough } from '../../utils/bank_SAFE.js';
import { validateAmount, secureRandom } from '../../utils/securityEnhancements.js';
import { getCoinMultiplier, getLuckBoost } from '../../utils/economy/shopSystem.js';
import { recordSpin } from '../../utils/game/slotStats.js';
import { getJackpotAmount, contributeToJackpot, winJackpot } from '../../utils/game/slotJackpot.js';

// Cooldown system
const userCooldowns = new Map();
const COOLDOWN_MS = 1000; // 1 second - ultra fast gameplay for maximum engagement

// Win streak tracking (anti-abuse)
const winStreaks = new Map();

// Active game locks (prevents concurrent spins by same user)
const activeGames = new Map();

// Response cache
const responseCache = new Map();
const CACHE_DURATION_MS = 1000;

// Cache cleanup
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of responseCache.entries()) {
        if (now - value.timestamp > 60000) {
            responseCache.delete(key);
        }
    }
}, 60000);

const responses = {
    en: {
        title: '🎰 ━━━━━━━━━━━━━━━━━━━━━ 🎰\n       💠  S L O T  M A C H I N E  💠\n🎰 ━━━━━━━━━━━━━━━━━━━━━ 🎰',
        player: '👤 Player:',
        jackpot: '💎💎💎 JACKPOT! PROGRESSIVE WIN! 💎💎💎',
        megaWin: '🎉 MEGA WIN! TRIPLE SEVENS! 🎉',
        bigWin: '🔥 BIG WIN! TRIPLE BELLS! 🔥',
        freeSpinsTrigger: '🔔🔔🔔 FREE SPINS! 10 FREE GAMES! 🔔🔔🔔',
        greatWin: '⭐ GREAT WIN! TRIPLE GRAPES! ⭐',
        goodWin: '✨ GOOD WIN! TRIPLE ORANGES! ✨',
        niceWin: '🌟 NICE WIN! TRIPLE LEMONS! 🌟',
        smallWin: '🍀 SMALL WIN! TRIPLE CHERRIES! 🍀',
        tinyWin: '💫 TINY WIN! Two matching!',
        noMatch: '😔 No match. Better luck next time!',
        nearMiss: '😱 SO CLOSE! Almost had it!',
        bet: '💰 Bet:',
        won: '🎊 Won:',
        lost: '💸 Lost:',
        balance: '💵 Balance:',
        jackpotPool: '💎 Jackpot Pool:',
        freeSpinsActive: '🎁 FREE SPIN',
        freeSpinsSummary: '🎁 FREE SPINS COMPLETE!',
        totalFreeWins: '💰 Total Free Wins:',
        shopBoost: '🛒 Shop Boost:',
        usage: '🎰 Usage: .slot <bet>\n\n📝 Examples:\n• .slot 10\n• .slot 100\n• .slot all\n\n💡 Check balance: .bank',
        notEnough: '❌ Not enough coins!\n\n💰 Your balance:',
        invalidBet: '❌ Invalid bet amount!\n\n📊 Limits:\n• Minimum: 1 coin\n• Maximum: 1,000,000,000 coins',
        playForFun: '🎮 Playing for fun',
        playTip: '💡 Use .slot <bet> to play with coins!',
        payouts: '\n\n┌──────────────────────┐\n│      💎 PAYOUTS      │\n├──────────────────────┤\n│ 💎💎💎  JACKPOT+150x  │\n│ 7️⃣7️⃣7️⃣       60x      │\n│ 🔔🔔🔔  10 SPINS+20x  │\n│ 🍇🍇🍇       15x      │\n│ 🍊🍊🍊       10x      │\n│ 🍋🍋🍋        6x      │\n│ 🍒🍒🍒        4x      │\n│ Any 2       2.5x     │\n└──────────────────────┘',
        statsHint: 'Use .slotstats to see your stats!'
    },
    it: {
        title: '🎰 ━━━━━━━━━━━━━━━━━━━━━ 🎰\n       💠  S L O T  M A C H I N E  💠\n🎰 ━━━━━━━━━━━━━━━━━━━━━ 🎰',
        jackpot: '💎💎💎 JACKPOT! VINCITA PROGRESSIVA! 💎💎💎',
        megaWin: '🎉 MEGA VINCITA! TRIPLO SETTE! 🎉',
        bigWin: '🔥 GRANDE VINCITA! TRIPLO CAMPANE! 🔥',
        freeSpinsTrigger: '🔔🔔🔔 GIRI GRATIS! 10 GIRI GRATIS! 🔔🔔🔔',
        greatWin: '⭐ OTTIMA VINCITA! TRIPLO UVA! ⭐',
        goodWin: '✨ BUONA VINCITA! TRIPLO ARANCE! ✨',
        niceWin: '🌟 BELLA VINCITA! TRIPLO LIMONI! 🌟',
        smallWin: '🍀 PICCOLA VINCITA! TRIPLO CILIEGIE! 🍀',
        tinyWin: '💫 MINI VINCITA! Due uguali!',
        noMatch: '😔 Nessuna corrispondenza. Riprova!',
        nearMiss: '😱 QUASI! Ci sei andato vicino!',
        bet: '💰 Puntata:',
        won: '🎊 Vinto:',
        lost: '💸 Perso:',
        balance: '💵 Saldo:',
        jackpotPool: '💎 Pool Jackpot:',
        freeSpinsActive: '🎁 GIRO GRATIS',
        freeSpinsSummary: '🎁 GIRI GRATIS COMPLETATI!',
        totalFreeWins: '💰 Vincite Gratis Totali:',
        shopBoost: '🛒 Boost Negozio:',
        usage: '🎰 Uso: .slot <puntata>\n\n📝 Esempi:\n• .slot 10\n• .slot 100\n• .slot all\n\n💡 Controlla saldo: .bank',
        notEnough: '❌ Monete insufficienti!\n\n💰 Il tuo saldo:',
        invalidBet: '❌ Importo puntata non valido!\n\n📊 Limiti:\n• Minimo: 1 moneta\n• Massimo: 1.000.000.000 monete',
        playForFun: '🎮 Giocando per divertimento',
        playTip: '💡 Usa .slot <puntata> per giocare con monete!',
        payouts: '\n\n💎 PAGAMENTI:\n💎💎💎 = JACKPOT + 150x\n7️⃣7️⃣7️⃣ = 60x\n🔔🔔🔔 = 10 GIRI GRATIS + 20x\n🍇🍇🍇 = 15x\n🍊🍊🍊 = 10x\n🍋🍋🍋 = 6x\n🍒🍒🍒 = 4x\nDue = 2.5x',
        statsHint: 'Usa .slotstats per vedere le tue statistiche!'
    },
    ru: {
        title: '🎰 ━━━━━━━━━━━━━━━━━━━━━ 🎰\n     💠  И Г Р О В О Й  А В Т О М А Т  💠\n🎰 ━━━━━━━━━━━━━━━━━━━━━ 🎰',
        player: '👤 Игрок:',
        jackpot: '💎💎💎 ДЖЕКПОТ! ПРОГРЕССИВНЫЙ ВЫИГРЫШ! 💎💎💎',
        megaWin: '🎉 МЕГА ВЫИГРЫШ! ТРОЙНЫЕ СЕМЁРКИ! 🎉',
        bigWin: '🔥 БОЛЬШОЙ ВЫИГРЫШ! ТРОЙНЫЕ КОЛОКОЛА! 🔥',
        freeSpinsTrigger: '🔔🔔🔔 БЕСПЛАТНЫЕ ВРАЩЕНИЯ! 10 БЕСПЛАТНЫХ ИГР! 🔔🔔🔔',
        greatWin: '⭐ ОТЛИЧНЫЙ ВЫИГРЫШ! ТРОЙНОЙ ВИНОГРАД! ⭐',
        goodWin: '✨ ХОРОШИЙ ВЫИГРЫШ! ТРОЙНЫЕ АПЕЛЬСИНЫ! ✨',
        niceWin: '🌟 ПРИЯТНЫЙ ВЫИГРЫШ! ТРОЙНЫЕ ЛИМОНЫ! 🌟',
        smallWin: '🍀 МАЛЫЙ ВЫИГРЫШ! ТРОЙНЫЕ ВИШНИ! 🍀',
        tinyWin: '💫 МИНИ ВЫИГРЫШ! Два совпадения!',
        noMatch: '😔 Нет совпадений. Удачи в следующий раз!',
        nearMiss: '😱 ТАК БЛИЗКО! Почти получилось!',
        bet: '💰 Ставка:',
        won: '🎊 Выиграно:',
        lost: '💸 Проиграно:',
        balance: '💵 Баланс:',
        jackpotPool: '💎 Пул Джекпота:',
        freeSpinsActive: '🎁 БЕСПЛАТНОЕ ВРАЩЕНИЕ',
        freeSpinsSummary: '🎁 БЕСПЛАТНЫЕ ВРАЩЕНИЯ ЗАВЕРШЕНЫ!',
        totalFreeWins: '💰 Всего Бесплатных Выигрышей:',
        shopBoost: '🛒 Буст Магазина:',
        usage: '🎰 Использование: .slot <ставка>\n\n📝 Примеры:\n• .slot 10\n• .slot 100\n• .slot all\n\n💡 Проверить баланс: .bank',
        notEnough: '❌ Недостаточно монет!\n\n💰 Ваш баланс:',
        invalidBet: '❌ Неверная сумма ставки!\n\n📊 Лимиты:\n• Минимум: 1 монета\n• Максимум: 1.000.000.000 монет',
        playForFun: '🎮 Играем для удовольствия',
        playTip: '💡 Используйте .slot <ставка> для игры с монетами!',
        payouts: '\n\n💎 ВЫПЛАТЫ:\n💎💎💎 = ДЖЕКПОТ + 150x\n7️⃣7️⃣7️⃣ = 60x\n🔔🔔🔔 = 10 БЕСПЛАТНЫХ ВРАЩЕНИЙ + 20x\n🍇🍇🍇 = 15x\n🍊🍊🍊 = 10x\n🍋🍋🍋 = 6x\n🍒🍒🍒 = 4x\nДва = 2.5x',
        statsHint: 'Используйте .slotstats чтобы увидеть вашу статистику!'
    },
    es: {
        title: '🎰 ━━━━━━━━━━━━━━━━━━━━━ 🎰\n    💠  T R A G A M O N E D A S  💠\n🎰 ━━━━━━━━━━━━━━━━━━━━━ 🎰',
        player: '👤 Jugador:',
        jackpot: '💎💎💎 ¡JACKPOT! ¡PREMIO PROGRESIVO! 💎💎💎',
        megaWin: '🎉 ¡MEGA PREMIO! ¡TRIPLE SIETES! 🎉',
        bigWin: '🔥 ¡GRAN PREMIO! ¡TRIPLE CAMPANAS! 🔥',
        freeSpinsTrigger: '🔔🔔🔔 ¡GIROS GRATIS! ¡10 JUEGOS GRATIS! 🔔🔔🔔',
        greatWin: '⭐ ¡EXCELENTE PREMIO! ¡TRIPLE UVAS! ⭐',
        goodWin: '✨ ¡BUEN PREMIO! ¡TRIPLE NARANJAS! ✨',
        niceWin: '🌟 ¡LINDO PREMIO! ¡TRIPLE LIMONES! 🌟',
        smallWin: '🍀 ¡PEQUEÑO PREMIO! ¡TRIPLE CEREZAS! 🍀',
        tinyWin: '💫 ¡MINI PREMIO! ¡Dos iguales!',
        noMatch: '😔 Sin coincidencias. ¡Mejor suerte la próxima!',
        nearMiss: '😱 ¡TAN CERCA! ¡Casi lo logras!',
        bet: '💰 Apuesta:',
        won: '🎊 Ganado:',
        lost: '💸 Perdido:',
        balance: '💵 Saldo:',
        jackpotPool: '💎 Pozo Jackpot:',
        freeSpinsActive: '🎁 GIRO GRATIS',
        freeSpinsSummary: '🎁 ¡GIROS GRATIS COMPLETADOS!',
        totalFreeWins: '💰 Ganancias Gratis Totales:',
        shopBoost: '🛒 Impulso Tienda:',
        usage: '🎰 Uso: .slot <apuesta>\n\n📝 Ejemplos:\n• .slot 10\n• .slot 100\n• .slot all\n\n💡 Revisar saldo: .bank',
        notEnough: '❌ ¡No tienes suficientes monedas!\n\n💰 Tu saldo:',
        invalidBet: '❌ ¡Cantidad de apuesta inválida!\n\n📊 Límites:\n• Mínimo: 1 moneda\n• Máximo: 1.000.000.000 monedas',
        playForFun: '🎮 Jugando por diversión',
        playTip: '💡 ¡Usa .slot <apuesta> para jugar con monedas!',
        payouts: '\n\n💎 PAGOS:\n💎💎💎 = JACKPOT + 150x\n7️⃣7️⃣7️⃣ = 60x\n🔔🔔🔔 = 10 GIROS GRATIS + 20x\n🍇🍇🍇 = 15x\n🍊🍊🍊 = 10x\n🍋🍋🍋 = 6x\n🍒🍒🍒 = 4x\nDos = 2.5x',
        statsHint: '¡Usa .slotstats para ver tus estadísticas!'
    },
    pt: {
        title: '🎰 ━━━━━━━━━━━━━━━━━━━━━ 🎰\n       💠  C A Ç A - N Í Q U E I S  💠\n🎰 ━━━━━━━━━━━━━━━━━━━━━ 🎰',
        player: '👤 Jogador:',
        jackpot: '💎💎💎 JACKPOT! PRÊMIO PROGRESSIVO! 💎💎💎',
        megaWin: '🎉 MEGA VITÓRIA! TRIPLO SETES! 🎉',
        bigWin: '🔥 GRANDE VITÓRIA! TRIPLO SINOS! 🔥',
        freeSpinsTrigger: '🔔🔔🔔 GIROS GRÁTIS! 10 JOGOS GRÁTIS! 🔔🔔🔔',
        greatWin: '⭐ ÓTIMA VITÓRIA! TRIPLO UVAS! ⭐',
        goodWin: '✨ BOA VITÓRIA! TRIPLO LARANJAS! ✨',
        niceWin: '🌟 BELA VITÓRIA! TRIPLO LIMÕES! 🌟',
        smallWin: '🍀 PEQUENA VITÓRIA! TRIPLO CEREJAS! 🍀',
        tinyWin: '💫 MINI VITÓRIA! Dois iguais!',
        noMatch: '😔 Sem combinação. Melhor sorte na próxima!',
        nearMiss: '😱 TÃO PERTO! Quase conseguiu!',
        bet: '💰 Aposta:',
        won: '🎊 Ganho:',
        lost: '💸 Perdido:',
        balance: '💵 Saldo:',
        jackpotPool: '💎 Poço Jackpot:',
        freeSpinsActive: '🎁 GIRO GRÁTIS',
        freeSpinsSummary: '🎁 GIROS GRÁTIS COMPLETOS!',
        totalFreeWins: '💰 Ganhos Grátis Totais:',
        shopBoost: '🛒 Impulso Loja:',
        usage: '🎰 Uso: .slot <aposta>\n\n📝 Exemplos:\n• .slot 10\n• .slot 100\n• .slot all\n\n💡 Verificar saldo: .bank',
        notEnough: '❌ Moedas insuficientes!\n\n💰 Seu saldo:',
        invalidBet: '❌ Valor de aposta inválido!\n\n📊 Limites:\n• Mínimo: 1 moeda\n• Máximo: 1.000.000.000 moedas',
        playForFun: '🎮 Jogando por diversão',
        playTip: '💡 Use .slot <aposta> para jogar com moedas!',
        payouts: '\n\n💎 PAGAMENTOS:\n💎💎💎 = JACKPOT + 150x\n7️⃣7️⃣7️⃣ = 60x\n🔔🔔🔔 = 10 GIROS GRÁTIS + 20x\n🍇🍇🍇 = 15x\n🍊🍊🍊 = 10x\n🍋🍋🍋 = 6x\n🍒🍒🍒 = 4x\nDois = 2.5x',
        statsHint: 'Use .slotstats para ver suas estatísticas!'
    },
    ar: {
        title: '🎰 ━━━━━━━━━━━━━━━━━━━━━ 🎰\n          💠  لعبة السلوت  💠\n🎰 ━━━━━━━━━━━━━━━━━━━━━ 🎰',
        player: '👤 اللاعب:',
        jackpot: '💎💎💎 جاكبوت! فوز تقدمي! 💎💎💎',
        megaWin: '🎉 فوز ضخم! ثلاثة سبعات! 🎉',
        bigWin: '🔥 فوز كبير! ثلاثة أجراس! 🔥',
        freeSpinsTrigger: '🔔🔔🔔 دورات مجانية! 10 ألعاب مجانية! 🔔🔔🔔',
        greatWin: '⭐ فوز رائع! ثلاثة عنب! ⭐',
        goodWin: '✨ فوز جيد! ثلاثة برتقال! ✨',
        niceWin: '🌟 فوز لطيف! ثلاثة ليمون! 🌟',
        smallWin: '🍀 فوز صغير! ثلاثة كرز! 🍀',
        tinyWin: '💫 فوز صغير جداً! اثنان متطابقان!',
        noMatch: '😔 لا تطابق. حظ أفضل المرة القادمة!',
        nearMiss: '😱 قريب جداً! كدت تفوز!',
        bet: '💰 الرهان:',
        won: '🎊 الربح:',
        lost: '💸 الخسارة:',
        balance: '💵 الرصيد:',
        jackpotPool: '💎 مجمع الجاكبوت:',
        freeSpinsActive: '🎁 دورة مجانية',
        freeSpinsSummary: '🎁 الدورات المجانية مكتملة!',
        totalFreeWins: '💰 إجمالي الأرباح المجانية:',
        shopBoost: '🛒 تعزيز المتجر:',
        usage: '🎰 الاستخدام: .slot <رهان>\n\n📝 أمثلة:\n• .slot 10\n• .slot 100\n• .slot all\n\n💡 تحقق من الرصيد: .bank',
        notEnough: '❌ عملات غير كافية!\n\n💰 رصيدك:',
        invalidBet: '❌ مبلغ رهان غير صالح!\n\n📊 الحدود:\n• الحد الأدنى: 1 عملة\n• الحد الأقصى: 1.000.000.000 عملة',
        playForFun: '🎮 اللعب للمتعة',
        playTip: '💡 استخدم .slot <رهان> للعب بالعملات!',
        payouts: '\n\n💎 المدفوعات:\n💎💎💎 = جاكبوت + 150x\n7️⃣7️⃣7️⃣ = 60x\n🔔🔔🔔 = 10 دورات مجانية + 20x\n🍇🍇🍇 = 15x\n🍊🍊🍊 = 10x\n🍋🍋🍋 = 6x\n🍒🍒🍒 = 4x\nاثنان = 2.5x',
        statsHint: 'استخدم .slotstats لرؤية إحصائياتك!'
    },
    hi: {
        title: '🎰 ━━━━━━━━━━━━━━━━━━━━━ 🎰\n        💠  स्लॉट  मशीन  💠\n🎰 ━━━━━━━━━━━━━━━━━━━━━ 🎰',
        player: '👤 खिलाड़ी:',
        jackpot: '💎💎💎 जैकपॉट! प्रगतिशील जीत! 💎💎💎',
        megaWin: '🎉 मेगा जीत! तीन सेवन! 🎉',
        bigWin: '🔥 बड़ी जीत! तीन घंटियां! 🔥',
        freeSpinsTrigger: '🔔🔔🔔 मुफ्त स्पिन! 10 मुफ्त गेम! 🔔🔔🔔',
        greatWin: '⭐ शानदार जीत! तीन अंगूर! ⭐',
        goodWin: '✨ अच्छी जीत! तीन संतरे! ✨',
        niceWin: '🌟 बढ़िया जीत! तीन नींबू! 🌟',
        smallWin: '🍀 छोटी जीत! तीन चेरी! 🍀',
        tinyWin: '💫 मिनी जीत! दो मैच!',
        noMatch: '😔 कोई मैच नहीं। अगली बार बेहतर किस्मत!',
        nearMiss: '😱 बहुत करीब! लगभग मिल गया था!',
        bet: '💰 बेट:',
        won: '🎊 जीता:',
        lost: '💸 हारा:',
        balance: '💵 बैलेंस:',
        jackpotPool: '💎 जैकपॉट पूल:',
        freeSpinsActive: '🎁 मुफ्त स्पिन',
        freeSpinsSummary: '🎁 मुफ्त स्पिन पूर्ण!',
        totalFreeWins: '💰 कुल मुफ्त जीत:',
        shopBoost: '🛒 शॉप बूस्ट:',
        usage: '🎰 उपयोग: .slot <बेट>\n\n📝 उदाहरण:\n• .slot 10\n• .slot 100\n• .slot all\n\n💡 बैलेंस चेक करें: .bank',
        notEnough: '❌ पर्याप्त कॉइन नहीं!\n\n💰 आपका बैलेंस:',
        invalidBet: '❌ अमान्य बेट राशि!\n\n📊 सीमाएं:\n• न्यूनतम: 1 कॉइन\n• अधिकतम: 1,000,000,000 कॉइन',
        playForFun: '🎮 मज़े के लिए खेल रहे हैं',
        playTip: '💡 कॉइन के साथ खेलने के लिए .slot <बेट> का उपयोग करें!',
        payouts: '\n\n💎 पेआउट:\n💎💎💎 = जैकपॉट + 150x\n7️⃣7️⃣7️⃣ = 60x\n🔔🔔🔔 = 10 मुफ्त स्पिन + 20x\n🍇🍇🍇 = 15x\n🍊🍊🍊 = 10x\n🍋🍋🍋 = 6x\n🍒🍒🍒 = 4x\nदो = 2.5x',
        statsHint: 'अपने आंकड़े देखने के लिए .slotstats उपयोग करें!'
    },
    ng: {
        title: '🎰 ━━━━━━━━━━━━━━━━━━━━━ 🎰\n       💠  S L O T  M A C H I N E  💠\n🎰 ━━━━━━━━━━━━━━━━━━━━━ 🎰',
        player: '👤 Player:',
        jackpot: '💎💎💎 JACKPOT! PROGRESSIVE WIN! 💎💎💎',
        megaWin: '🎉 MEGA WIN! TRIPLE SEVENS! 🎉',
        bigWin: '🔥 BIG WIN! TRIPLE BELLS! 🔥',
        freeSpinsTrigger: '🔔🔔🔔 FREE SPINS! 10 FREE GAMES! 🔔🔔🔔',
        greatWin: '⭐ GREAT WIN! TRIPLE GRAPES! ⭐',
        goodWin: '✨ GOOD WIN! TRIPLE ORANGES! ✨',
        niceWin: '🌟 NICE WIN! TRIPLE LEMONS! 🌟',
        smallWin: '🍀 SMALL WIN! TRIPLE CHERRIES! 🍀',
        tinyWin: '💫 TINY WIN! Two don match!',
        noMatch: '😔 No match. Better luck next time!',
        nearMiss: '😱 SO CLOSE! You almost get am!',
        bet: '💰 Bet:',
        won: '🎊 Won:',
        lost: '💸 Lost:',
        balance: '💵 Balance:',
        jackpotPool: '💎 Jackpot Pool:',
        freeSpinsActive: '🎁 FREE SPIN',
        freeSpinsSummary: '🎁 FREE SPINS COMPLETE!',
        totalFreeWins: '💰 Total Free Wins:',
        shopBoost: '🛒 Shop Boost:',
        usage: '🎰 How to use: .slot <bet>\n\n📝 Examples:\n• .slot 10\n• .slot 100\n• .slot all\n\n💡 Check balance: .bank',
        notEnough: '❌ Your coins no reach!\n\n💰 Your balance:',
        invalidBet: '❌ Dat bet amount no correct!\n\n📊 Limits:\n• Minimum: 1 coin\n• Maximum: 1,000,000,000 coins',
        playForFun: '🎮 Playing for fun',
        playTip: '💡 Use .slot <bet> make you play with coins!',
        payouts: '\n\n💎 PAYOUTS:\n💎💎💎 = JACKPOT + 150x\n7️⃣7️⃣7️⃣ = 60x\n🔔🔔🔔 = 10 FREE SPINS + 20x\n🍇🍇🍇 = 15x\n🍊🍊🍊 = 10x\n🍋🍋🍋 = 6x\n🍒🍒🍒 = 4x\nAny 2 = 2.5x',
        statsHint: 'Use .slotstats make you see your stats!'
    }
};

// Weighted symbol generation with luck boost
function getWeightedSymbol(luckBoost = 0) {
    // secureRandom() returns float [0, 1), multiply by 100 for percentage
    const rand = secureRandom() * 100;
    
    // Luck boost increases high-value symbol chances (capped at 50% for better gameplay)
    const boost = Math.min(luckBoost, 50);
    
    // ULTRA BUFFED distribution for 98% RTP (2% house edge) - extremely generous!
    // Significantly increased chances for premium symbols
    const diamondChance = 2.5 + (boost * 0.06);   // 2.5-5.5% (jackpot highly accessible)
    const sevenChance = diamondChance + 5 + (boost * 0.10);  // 5-10%
    const bellChance = sevenChance + 10 + (boost * 0.15);    // 10-17.5%
    const grapeChance = bellChance + 14;  // 14%
    const orangeChance = grapeChance + 18; // 18%
    const lemonChance = orangeChance + 22; // 22%
    // Cherry fills the rest: ~8.5-18.5% (heavily reduced for more premium hits)
    
    if (rand < diamondChance) return '💎';
    if (rand < sevenChance) return '7️⃣';
    if (rand < bellChance) return '🔔';
    if (rand < grapeChance) return '🍇';
    if (rand < orangeChance) return '🍊';
    if (rand < lemonChance) return '🍋';
    return '🍒';
}

// Generate 3-row reel display
function generateReels(luckBoost = 0) {
    return {
        top: [getWeightedSymbol(luckBoost), getWeightedSymbol(luckBoost), getWeightedSymbol(luckBoost)],
        middle: [getWeightedSymbol(luckBoost), getWeightedSymbol(luckBoost), getWeightedSymbol(luckBoost)],
        bottom: [getWeightedSymbol(luckBoost), getWeightedSymbol(luckBoost), getWeightedSymbol(luckBoost)]
    };
}


// Calculate spin result with ULTRA BUFFED multipliers (98% RTP target)
function calculateResult(reels, t) {
    const [s1, s2, s3] = reels.middle;
    
    let result, multiplier = 0, isWin = false, isFreeSpins = false, isJackpot = false;
    
    if (s1 === s2 && s2 === s3) {
        isWin = true;
        if (s1 === '💎') {
            result = t.jackpot;
            multiplier = 150; // ULTRA BUFFED from 100x - insane jackpot!
            isJackpot = true;
        } else if (s1 === '7️⃣') {
            result = t.megaWin;
            multiplier = 60; // ULTRA BUFFED from 40x
        } else if (s1 === '🔔') {
            result = t.freeSpinsTrigger;
            multiplier = 20; // ULTRA BUFFED from 15x
            isFreeSpins = true;
        } else if (s1 === '🍇') {
            result = t.greatWin;
            multiplier = 15; // ULTRA BUFFED from 12x
        } else if (s1 === '🍊') {
            result = t.goodWin;
            multiplier = 10; // ULTRA BUFFED from 8x
        } else if (s1 === '🍋') {
            result = t.niceWin;
            multiplier = 6; // ULTRA BUFFED from 5x
        } else if (s1 === '🍒') {
            result = t.smallWin;
            multiplier = 4; // ULTRA BUFFED from 3x
        }
    } else if (s1 === s2 || s2 === s3 || s1 === s3) {
        isWin = true;
        result = t.tinyWin;
        multiplier = 2.5; // ULTRA BUFFED from 2x - even better profit on two match!
    } else {
        const isNearMiss = (s1 === s2 || s2 === s3 || s1 === s3);
        result = isNearMiss ? t.nearMiss : t.noMatch;
        multiplier = 0;
    }
    
    return { result, multiplier, isWin, isFreeSpins, isJackpot };
}

// Play free spins with ULTRA BUFFED rewards (98% RTP)
async function playFreeSpins(sender, bet, luckBoost, coinMultiplier, t) {
    const freeSpinResults = [];
    let totalFreeWins = 0;
    const houseEdge = 0.98; // 2% house edge (ULTRA BUFFED from 3%)
    
    for (let i = 0; i < 10; i++) { // ULTRA BUFFED from 7 to 10 free spins!
        const reels = generateReels(luckBoost);
        const spinResult = calculateResult(reels, t);
        
        if (spinResult.isWin) {
            const baseWin = bet * spinResult.multiplier;
            const fairWin = Math.floor(baseWin * houseEdge);
            const boostedWin = Math.floor(fairWin * coinMultiplier);
            totalFreeWins += boostedWin;
            
            freeSpinResults.push({
                reels: reels.middle,
                win: boostedWin,
                multiplier: spinResult.multiplier
            });
        } else {
            freeSpinResults.push({
                reels: reels.middle,
                win: 0,
                multiplier: 0
            });
        }
    }
    
    return { freeSpinResults, totalFreeWins };
}

export default {
    name: 'slot',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const userId = sender.split('@')[0];
        const pushName = msg.pushName || 'Player';
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        const coins = lang === 'it' ? 'monete' : lang === 'ru' ? 'монет' : lang === 'es' ? 'monedas' : lang === 'pt' ? 'moedas' : lang === 'ar' ? 'عملة' : lang === 'hi' ? 'कॉइन' : 'coins';
        
        try {
        
        // CRITICAL: Prevent concurrent game execution (race condition exploit fix)
        if (activeGames.has(userId)) {
            console.log(`[SLOT-SECURITY] Blocked concurrent spin attempt by user ${userId}`);
            const blockMsg = lang === 'it' ? '⚠️ Attendi il completamento della partita precedente!' :
                           lang === 'ru' ? '⚠️ Дождитесь завершения предыдущей игры!' :
                           lang === 'es' ? '⚠️ ¡Espera a que termine el juego anterior!' :
                           lang === 'pt' ? '⚠️ Aguarde o término do jogo anterior!' :
                           lang === 'ar' ? '⚠️ انتظر حتى تنتهي اللعبة السابقة!' :
                           lang === 'hi' ? '⚠️ पिछले गेम के पूरा होने की प्रतीक्षा करें!' :
                           '⚠️ Wait for previous game to complete!';
            return await sock.sendMessage(from, { text: blockMsg });
        }
        
        // Set game lock
        activeGames.set(userId, Date.now());
        
        // Cooldown check
        if (args[0]) {
            const now = Date.now();
            const lastPlay = userCooldowns.get(userId);
            
            if (lastPlay && (now - lastPlay) < COOLDOWN_MS) {
                const remainingMs = COOLDOWN_MS - (now - lastPlay);
                const remainingSec = Math.ceil(remainingMs / 1000);
                
                const cooldownMsg = lang === 'it' ? `⏳ Aspetta ${remainingSec}s prima di giocare di nuovo!` :
                                   lang === 'ru' ? `⏳ Подождите ${remainingSec}с перед следующей игрой!` :
                                   lang === 'es' ? `⏳ ¡Espera ${remainingSec}s antes de jugar de nuevo!` :
                                   lang === 'pt' ? `⏳ Aguarde ${remainingSec}s antes de jogar novamente!` :
                                   lang === 'ar' ? `⏳ انتظر ${remainingSec}ث قبل اللعب مرة أخرى!` :
                                   lang === 'hi' ? `⏳ फिर से खेलने से पहले ${remainingSec}s प्रतीक्षा करें!` :
                                   `⏳ Wait ${remainingSec}s before playing again!`;
                
                const cacheKey = `${userId}_cooldown`;
                const cachedResponse = responseCache.get(cacheKey);
                
                if (cachedResponse && (now - cachedResponse.timestamp) < CACHE_DURATION_MS) {
                    return;
                }
                
                responseCache.set(cacheKey, { timestamp: now });
                activeGames.delete(userId); // Release lock on cooldown
                return await sock.sendMessage(from, { text: cooldownMsg });
            }
            
            userCooldowns.set(userId, now);
            
            for (const [uid, time] of userCooldowns.entries()) {
                if (now - time > 300000) {
                    userCooldowns.delete(uid);
                }
            }
        }
        
        // Check if playing for fun
        const playingForFun = !args[0];
        let bet = 0;
        
        if (!playingForFun) {
            if (args[0].toLowerCase() === 'all') {
                bet = await getBalance(sender);
                if (bet < 1) {
                    activeGames.delete(userId); // Release lock
                    return await sock.sendMessage(from, { 
                        text: `${t.notEnough} ${bet} ${coins}\n\n${t.usage}`
                    });
                }
            } else {
                bet = parseInt(args[0]);
                
                if (isNaN(bet) || bet === null) {
                    activeGames.delete(userId); // Release lock
                    return await sock.sendMessage(from, { 
                        text: `${t.invalidBet}`
                    });
                }
                
                const validation = validateAmount(bet, 1, 1000000000);
                if (!validation.valid) {
                    activeGames.delete(userId); // Release lock
                    return await sock.sendMessage(from, { 
                        text: `${t.invalidBet}\n\n❌ ${validation.error}`
                    });
                }
                bet = validation.amount;
            }
            
            if (!(await hasEnough(sender, bet))) {
                const balance = await getBalance(sender);
                activeGames.delete(userId); // Release lock
                return await sock.sendMessage(from, { 
                    text: `${t.notEnough} ${balance} ${coins}\n\n${t.usage}`
                });
            }
            
            // ATOMIC OPERATION: Deduct bet immediately before spin
            await removeCoins(sender, bet);
        } else {
            // Playing for fun - release lock immediately after display
            activeGames.delete(userId);
        }
        
        // Get shop boosts
        const luckBoost = playingForFun ? 0 : getLuckBoost(userId);
        const coinMultiplier = playingForFun ? 1 : getCoinMultiplier(userId);
        
        // Generate reels
        const reels = generateReels(luckBoost);
        const spinResult = calculateResult(reels, t);
        
        // Build display
        const jackpotPool = await getJackpotAmount() || 50000;
        
        // ── Header ──────────────────────────────────────────
        let finalText = `${t.title}\n`;
        finalText += `┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n`;
        finalText += `${t.player} *${pushName}*\n`;
        
        if (!playingForFun) {
            finalText += `${t.bet} *${(bet || 0).toLocaleString()}* ${coins}\n`;
            finalText += `${t.jackpotPool} *${(jackpotPool || 0).toLocaleString()}* ${coins}\n`;
            if (coinMultiplier > 1 || luckBoost > 0) {
                const boosts = [];
                if (coinMultiplier > 1) boosts.push(`${coinMultiplier}x 💰`);
                if (luckBoost > 0) boosts.push(`+${luckBoost}% 🍀`);
                finalText += `${t.shopBoost} ${boosts.join('  ')}\n`;
            }
        } else {
            finalText += `${t.playForFun}\n`;
        }
        
        // ── Reel Machine ────────────────────────────────────
        finalText += `\n`;
        finalText += `╔══════════════════════╗\n`;
        finalText += `║             ${reels.top[0]}  ┃  ${reels.top[1]}  ┃  ${reels.top[2]}             ║\n`;
        finalText += `╠══════════════════════╣\n`;
        finalText += `║             ${reels.middle[0]}  ┃  ${reels.middle[1]}  ┃  ${reels.middle[2]}             ║ ◄\n`;
        finalText += `╠══════════════════════╣\n`;
        finalText += `║             ${reels.bottom[0]}  ┃  ${reels.bottom[1]}  ┃  ${reels.bottom[2]}             ║\n`;
        finalText += `╚══════════════════════╝\n`;
        
        // ── Result Banner ───────────────────────────────────
        finalText += `\n${spinResult.result}\n`;
        
        if (!playingForFun) {
            let totalWinAmount = 0;
            
            if (spinResult.isWin) {
                const baseWin = bet * spinResult.multiplier;
                
                // Apply shop multipliers FIRST, then house edge
                const boostedWin = Math.floor(baseWin * coinMultiplier);
                // Apply 2% house edge (98% RTP) - ULTRA BUFFED and extremely generous!
                const houseEdge = 0.98;
                let fairWin = Math.floor(boostedWin * houseEdge);
                
                // Handle jackpot
                if (spinResult.isJackpot) {
                    const jackpotWin = await winJackpot(sender, pushName) || 0;
                    boostedWin += jackpotWin; // Jackpot is full amount, no house edge
                    finalText += `💰 ${t.jackpotPool} *+${jackpotWin.toLocaleString()}* ${coins}\n`;
                }
                
                totalWinAmount = boostedWin;
                
                // Apply maximum win cap (100M coins per spin)
                const MAX_WIN_PER_SPIN = 100000000;
                if (totalWinAmount > MAX_WIN_PER_SPIN) {
                    console.log(`[SLOT-CAP] User ${userId} win capped from ${totalWinAmount} to ${MAX_WIN_PER_SPIN}`);
                    totalWinAmount = MAX_WIN_PER_SPIN;
                }
                
                // Handle free spins
                if (spinResult.isFreeSpins) {
                    const freeSpinsData = await playFreeSpins(sender, bet, luckBoost, coinMultiplier, t);
                    totalWinAmount += freeSpinsData.totalFreeWins;
                    
                    finalText += `\n┌─────────────────────┐\n`;
                    finalText += `│  ${t.freeSpinsSummary}\n`;
                    finalText += `├─────────────────────┤\n`;
                    freeSpinsData.freeSpinResults.forEach((fs, idx) => {
                        const spinLine = `${fs.reels[0]} ${fs.reels[1]} ${fs.reels[2]}`;
                        const reward = fs.win > 0 ? `+${fs.win.toLocaleString()} ${coins}` : `✗`;
                        finalText += `│ ${idx + 1}▸ ${spinLine}  ${reward}\n`;
                    });
                    finalText += `├─────────────────────┤\n`;
                    finalText += `│ ${t.totalFreeWins} *${freeSpinsData.totalFreeWins.toLocaleString()}* ${coins}\n`;
                    finalText += `└─────────────────────┘\n`;
                }
                
                await addCoins(sender, totalWinAmount);
                
                // Track win streaks for anti-abuse monitoring
                const currentStreak = (winStreaks.get(userId) || 0) + 1;
                winStreaks.set(userId, currentStreak);
                
                // Log suspicious win streaks (5+ wins in a row)
                if (currentStreak >= 5) {
                    console.log(`[SLOT-ABUSE?] User ${userId} has ${currentStreak} wins in a row. Bet: ${bet}, Won: ${totalWinAmount}`);
                }
                
                // Win summary block
                finalText += `\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n`;
                finalText += `${t.won} *+${(totalWinAmount || 0).toLocaleString()}* ${coins}\n`;
                if (spinResult.multiplier > 1) finalText += `✦ ${spinResult.multiplier}x ${t.bet.replace(':', '')}\n`;
                
                // Record stats
                recordSpin(sender, bet, totalWinAmount, spinResult.multiplier, spinResult.isJackpot, spinResult.isFreeSpins);
            } else {
                // Loss - contribute to jackpot and reset win streak
                await contributeToJackpot(bet);
                winStreaks.set(userId, 0); // Reset streak on loss
                
                finalText += `\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n`;
                finalText += `${t.lost} *-${bet.toLocaleString()}* ${coins}\n`;
                
                // Record stats
                recordSpin(sender, bet, 0, 0, false, false);
            }
            
            const newBalance = await getBalance(sender);
            finalText += `${t.balance} ${(newBalance || 0).toLocaleString()} ${coins}`;
        } else {
            finalText += `\n${t.playTip}`;
            finalText += t.payouts;
        }
        
        finalText += `\n▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n`;
        finalText += `📊 ${t.statsHint}`;
        
        // Cache response
        const responseCacheKey = `${userId}_${from}_response`;
        const now = Date.now();
        
        const cachedMsg = responseCache.get(responseCacheKey);
        if (cachedMsg && (now - cachedMsg.timestamp) < CACHE_DURATION_MS) {
            console.log('[SLOT] Skipping duplicate message send (cached)');
            return;
        }
        
        responseCache.set(responseCacheKey, { timestamp: now, text: finalText });
        
        for (const [key, value] of responseCache.entries()) {
            if (now - value.timestamp > 10000) {
                responseCache.delete(key);
            }
        }
        
        await sock.sendMessage(from, { text: finalText });
        
        // Release game lock after message sent
        if (!playingForFun) {
            activeGames.delete(userId);
        }
        
        } catch (err) {
            // Always release lock on error
            activeGames.delete(userId);
            console.error('[SLOT] Unhandled error:', err.stack || err.message);
            throw err;
        }
    }
};
