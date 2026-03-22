import { getGroupLanguage } from '../../utils/language.js';
import { getBalance, addCoins, removeCoins, hasEnough } from '../../utils/bank_SAFE.js';
import { validateBet, normalizeBetType } from '../../utils/gameValidation.js';

const responses = {
    en: {
        usage: '🎰 ROULETTE CASINO 🎰\n\nPlace your bets:\n• .roulette <bet> <type>\n\nBet Types:\n━━━━━━━━━━━━━━━━━━━━━\n🔴 RED/BLACK (1:1)\n  .roulette 10 red\n  .roulette 10 black\n\n⚪ ODD/EVEN (1:1)\n  .roulette 10 odd\n  .roulette 10 even\n\n🔢 HIGH/LOW (1:1)\n  .roulette 10 low (1-18)\n  .roulette 10 high (19-36)\n\n🎯 STRAIGHT (35:1)\n  .roulette 10 5 (single number)\n\n📊 DOZEN (2:1)\n  .roulette 10 1st (1-12)\n  .roulette 10 2nd (13-24)\n  .roulette 10 3rd (25-36)\n\n📐 COLUMN (2:1)\n  .roulette 10 col1\n  .roulette 10 col2\n  .roulette 10 col3\n\nBet: 10-1000000 coins\nEuropean Roulette (single 0)',
        spinning: '🎰 Spinning the wheel...',
        result: '🎯 Result:',
        number: 'Number:',
        color: 'Color:',
        bet: 'Bet:',
        betType: 'Bet Type:',
        won: 'Won:',
        lost: 'Lost:',
        balance: 'Balance:',
        notEnough: 'Not enough coins!\n\nYour balance:',
        invalidBet: 'Invalid bet amount!\n\nMinimum: 10 coins\nMaximum: 1000000 coins',
        invalidType: 'Invalid bet type!\n\nUse .roulette to see all bet types.',
        red: 'RED',
        black: 'BLACK',
        green: 'GREEN',
        odd: 'ODD',
        even: 'EVEN',
        low: 'LOW (1-18)',
        high: 'HIGH (19-36)',
        straight: 'STRAIGHT',
        dozen1: '1ST DOZEN (1-12)',
        dozen2: '2ND DOZEN (13-24)',
        dozen3: '3RD DOZEN (25-36)',
        column1: 'COLUMN 1',
        column2: 'COLUMN 2',
        column3: 'COLUMN 3',
        winner: '🎉 WINNER! 🎉',
        loser: '😢 BETTER LUCK NEXT TIME'
    },
    it: {
        usage: '🎰 ROULETTE CASINO 🎰\n\nPiazza le tue puntate:\n• .roulette <puntata> <tipo>\n\nTipi di Puntata:\n━━━━━━━━━━━━━━━━━━━━━\n🔴 ROSSO/NERO (1:1)\n  .roulette 10 red\n  .roulette 10 black\n\n⚪ PARI/DISPARI (1:1)\n  .roulette 10 odd\n  .roulette 10 even\n\n🔢 ALTO/BASSO (1:1)\n  .roulette 10 low (1-18)\n  .roulette 10 high (19-36)\n\n🎯 PIENO (35:1)\n  .roulette 10 5 (numero singolo)\n\n📊 DOZZINA (2:1)\n  .roulette 10 1st (1-12)\n  .roulette 10 2nd (13-24)\n  .roulette 10 3rd (25-36)\n\n📐 COLONNA (2:1)\n  .roulette 10 col1\n  .roulette 10 col2\n  .roulette 10 col3\n\nPuntata: 10-1000000 monete\nRoulette Europea (singolo 0)',
        spinning: '🎰 Girando la ruota...',
        result: '🎯 Risultato:',
        number: 'Numero:',
        color: 'Colore:',
        bet: 'Puntata:',
        betType: 'Tipo Puntata:',
        won: 'Vinto:',
        lost: 'Perso:',
        balance: 'Saldo:',
        notEnough: 'Monete insufficienti!\n\nIl tuo saldo:',
        invalidBet: 'Importo puntata non valido!\n\nMinimo: 10 monete\nMassimo: 1000000 monete',
        invalidType: 'Tipo di puntata non valido!\n\nUsa .roulette per vedere tutti i tipi.',
        red: 'ROSSO',
        black: 'NERO',
        green: 'VERDE',
        odd: 'DISPARI',
        even: 'PARI',
        low: 'BASSO (1-18)',
        high: 'ALTO (19-36)',
        straight: 'PIENO',
        dozen1: '1A DOZZINA (1-12)',
        dozen2: '2A DOZZINA (13-24)',
        dozen3: '3A DOZZINA (25-36)',
        column1: 'COLONNA 1',
        column2: 'COLONNA 2',
        column3: 'COLONNA 3',
        winner: '🎉 VINCITORE! 🎉',
        loser: '😢 RIPROVA LA PROSSIMA VOLTA'
    },
    ru: {
        usage: '🎰 КАЗИНО РУЛЕТКА 🎰\n\nСделайте ставки:\n• .roulette <ставка> <тип>\n\nТипы Ставок:\n━━━━━━━━━━━━━━━━━━━━━\n🔴 КРАСНОЕ/ЧЕРНОЕ (1:1)\n  .roulette 10 red\n  .roulette 10 black\n\n⚪ ЧЕТНОЕ/НЕЧЕТНОЕ (1:1)\n  .roulette 10 odd\n  .roulette 10 even\n\n🔢 ВЫСОКОЕ/НИЗКОЕ (1:1)\n  .roulette 10 low (1-18)\n  .roulette 10 high (19-36)\n\n🎯 ПРЯМАЯ (35:1)\n  .roulette 10 5 (одно число)\n\n📊 ДЮЖИНА (2:1)\n  .roulette 10 1st (1-12)\n  .roulette 10 2nd (13-24)\n  .roulette 10 3rd (25-36)\n\n📐 КОЛОНКА (2:1)\n  .roulette 10 col1\n  .roulette 10 col2\n  .roulette 10 col3\n\nСтавка: 10-1000000 монет\nЕвропейская Рулетка (один 0)',
        spinning: '🎰 Вращаем колесо...',
        result: '🎯 Результат:',
        number: 'Число:',
        color: 'Цвет:',
        bet: 'Ставка:',
        betType: 'Тип Ставки:',
        won: 'Выиграно:',
        lost: 'Проиграно:',
        balance: 'Баланс:',
        notEnough: 'Недостаточно монет!\n\nВаш баланс:',
        invalidBet: 'Неверная сумма ставки!\n\nМинимум: 10 монет\nМаксимум: 1000000 монет',
        invalidType: 'Неверный тип ставки!\n\nИспользуйте .roulette чтобы увидеть все типы.',
        red: 'КРАСНОЕ',
        black: 'ЧЕРНОЕ',
        green: 'ЗЕЛЕНОЕ',
        odd: 'НЕЧЕТНОЕ',
        even: 'ЧЕТНОЕ',
        low: 'НИЗКОЕ (1-18)',
        high: 'ВЫСОКОЕ (19-36)',
        straight: 'ПРЯМАЯ',
        dozen1: '1Я ДЮЖИНА (1-12)',
        dozen2: '2Я ДЮЖИНА (13-24)',
        dozen3: '3Я ДЮЖИНА (25-36)',
        column1: 'КОЛОНКА 1',
        column2: 'КОЛОНКА 2',
        column3: 'КОЛОНКА 3',
        winner: '🎉 ПОБЕДИТЕЛЬ! 🎉',
        loser: '😢 УДАЧИ В СЛЕДУЮЩИЙ РАЗ'
    },
    es: {
        usage: '🎰 CASINO RULETA 🎰\n\nHaz tus apuestas:\n• .roulette <apuesta> <tipo>\n\nTipos de Apuesta:\n━━━━━━━━━━━━━━━━━━━━━\n🔴 ROJO/NEGRO (1:1)\n  .roulette 10 red\n  .roulette 10 black\n\n⚪ PAR/IMPAR (1:1)\n  .roulette 10 odd\n  .roulette 10 even\n\n🔢 ALTO/BAJO (1:1)\n  .roulette 10 low (1-18)\n  .roulette 10 high (19-36)\n\n🎯 PLENO (35:1)\n  .roulette 10 5 (número único)\n\n📊 DOCENA (2:1)\n  .roulette 10 1st (1-12)\n  .roulette 10 2nd (13-24)\n  .roulette 10 3rd (25-36)\n\n📐 COLUMNA (2:1)\n  .roulette 10 col1\n  .roulette 10 col2\n  .roulette 10 col3\n\nApuesta: 10-1000000 monedas\nRuleta Europea (0 único)',
        spinning: '🎰 Girando la rueda...',
        result: '🎯 Resultado:',
        number: 'Número:',
        color: 'Color:',
        bet: 'Apuesta:',
        betType: 'Tipo de Apuesta:',
        won: 'Ganado:',
        lost: 'Perdido:',
        balance: 'Saldo:',
        notEnough: '¡No tienes suficientes monedas!\n\nTu saldo:',
        invalidBet: '¡Cantidad de apuesta inválida!\n\nMínimo: 10 monedas\nMáximo: 1000000 monedas',
        invalidType: '¡Tipo de apuesta inválido!\n\nUsa .roulette para ver todos los tipos.',
        red: 'ROJO',
        black: 'NEGRO',
        green: 'VERDE',
        odd: 'IMPAR',
        even: 'PAR',
        low: 'BAJO (1-18)',
        high: 'ALTO (19-36)',
        straight: 'PLENO',
        dozen1: '1RA DOCENA (1-12)',
        dozen2: '2DA DOCENA (13-24)',
        dozen3: '3RA DOCENA (25-36)',
        column1: 'COLUMNA 1',
        column2: 'COLUMNA 2',
        column3: 'COLUMNA 3',
        winner: '🎉 ¡GANADOR! 🎉',
        loser: '😢 MEJOR SUERTE LA PRÓXIMA VEZ'
    },
    pt: {
        usage: '🎰 CASINO ROLETA 🎰\n\nFaça suas apostas:\n• .roulette <aposta> <tipo>\n\nTipos de Aposta:\n━━━━━━━━━━━━━━━━━━━━━\n🔴 VERMELHO/PRETO (1:1)\n  .roulette 10 red\n  .roulette 10 black\n\n⚪ PAR/ÍMPAR (1:1)\n  .roulette 10 odd\n  .roulette 10 even\n\n🔢 ALTO/BAIXO (1:1)\n  .roulette 10 low (1-18)\n  .roulette 10 high (19-36)\n\n🎯 PLENO (35:1)\n  .roulette 10 5 (número único)\n\n📊 DÚZIA (2:1)\n  .roulette 10 1st (1-12)\n  .roulette 10 2nd (13-24)\n  .roulette 10 3rd (25-36)\n\n📐 COLUNA (2:1)\n  .roulette 10 col1\n  .roulette 10 col2\n  .roulette 10 col3\n\nAposta: 10-1000000 moedas\nRoleta Europeia (0 único)',
        spinning: '🎰 Girando a roda...',
        result: '🎯 Resultado:',
        number: 'Número:',
        color: 'Cor:',
        bet: 'Aposta:',
        betType: 'Tipo de Aposta:',
        won: 'Ganho:',
        lost: 'Perdido:',
        balance: 'Saldo:',
        notEnough: 'Moedas insuficientes!\n\nSeu saldo:',
        invalidBet: 'Valor de aposta inválido!\n\nMínimo: 10 moedas\nMáximo: 1000000 moedas',
        invalidType: 'Tipo de aposta inválido!\n\nUse .roulette para ver todos os tipos.',
        red: 'VERMELHO',
        black: 'PRETO',
        green: 'VERDE',
        odd: 'ÍMPAR',
        even: 'PAR',
        low: 'BAIXO (1-18)',
        high: 'ALTO (19-36)',
        straight: 'PLENO',
        dozen1: '1ª DÚZIA (1-12)',
        dozen2: '2ª DÚZIA (13-24)',
        dozen3: '3ª DÚZIA (25-36)',
        column1: 'COLUNA 1',
        column2: 'COLUNA 2',
        column3: 'COLUNA 3',
        winner: '🎉 VENCEDOR! 🎉',
        loser: '😢 MELHOR SORTE NA PRÓXIMA VEZ'
    },
    ar: {
        usage: '🎰 كازينو الروليت 🎰\n\nضع رهاناتك:\n• .roulette <رهان> <نوع>\n\nأنواع الرهان:\n━━━━━━━━━━━━━━━━━━━━━\n🔴 أحمر/أسود (1:1)\n  .roulette 10 red\n  .roulette 10 black\n\n⚪ فردي/زوجي (1:1)\n  .roulette 10 odd\n  .roulette 10 even\n\n🔢 عالي/منخفض (1:1)\n  .roulette 10 low (1-18)\n  .roulette 10 high (19-36)\n\n🎯 مباشر (35:1)\n  .roulette 10 5 (رقم واحد)\n\n📊 دزينة (2:1)\n  .roulette 10 1st (1-12)\n  .roulette 10 2nd (13-24)\n  .roulette 10 3rd (25-36)\n\n📐 عمود (2:1)\n  .roulette 10 col1\n  .roulette 10 col2\n  .roulette 10 col3\n\nالرهان: 10-1000000 عملة\nروليت أوروبي (0 واحد)',
        spinning: '🎰 تدوير العجلة...',
        result: '🎯 النتيجة:',
        number: 'الرقم:',
        color: 'اللون:',
        bet: 'الرهان:',
        betType: 'نوع الرهان:',
        won: 'الربح:',
        lost: 'الخسارة:',
        balance: 'الرصيد:',
        notEnough: 'عملات غير كافية!\n\nرصيدك:',
        invalidBet: 'مبلغ رهان غير صالح!\n\nالحد الأدنى: 10 عملات\nالحد الأقصى: 1000000 عملة',
        invalidType: 'نوع رهان غير صالح!\n\nاستخدم .roulette لرؤية جميع الأنواع.',
        red: 'أحمر',
        black: 'أسود',
        green: 'أخضر',
        odd: 'فردي',
        even: 'زوجي',
        low: 'منخفض (1-18)',
        high: 'عالي (19-36)',
        straight: 'مباشر',
        dozen1: 'الدزينة الأولى (1-12)',
        dozen2: 'الدزينة الثانية (13-24)',
        dozen3: 'الدزينة الثالثة (25-36)',
        column1: 'العمود 1',
        column2: 'العمود 2',
        column3: 'العمود 3',
        winner: '🎉 فائز! 🎉',
        loser: '😢 حظ أفضل في المرة القادمة'
    },
    hi: {
        usage: '🎰 रूलेट कैसीनो 🎰\n\nअपनी बेट लगाएं:\n• .roulette <बेट> <प्रकार>\n\nबेट के प्रकार:\n━━━━━━━━━━━━━━━━━━━━━\n🔴 लाल/काला (1:1)\n  .roulette 10 red\n  .roulette 10 black\n\n⚪ विषम/सम (1:1)\n  .roulette 10 odd\n  .roulette 10 even\n\n🔢 उच्च/निम्न (1:1)\n  .roulette 10 low (1-18)\n  .roulette 10 high (19-36)\n\n🎯 स्ट्रेट (35:1)\n  .roulette 10 5 (एकल संख्या)\n\n📊 दर्जन (2:1)\n  .roulette 10 1st (1-12)\n  .roulette 10 2nd (13-24)\n  .roulette 10 3rd (25-36)\n\n📐 कॉलम (2:1)\n  .roulette 10 col1\n  .roulette 10 col2\n  .roulette 10 col3\n\nबेट: 10-1000000 सिक्के\nयूरोपीय रूलेट (एकल 0)',
        spinning: '🎰 व्हील घुमा रहे हैं...',
        result: '🎯 परिणाम:',
        number: 'संख्या:',
        color: 'रंग:',
        bet: 'बेट:',
        betType: 'बेट प्रकार:',
        won: 'जीता:',
        lost: 'हारा:',
        balance: 'बैलेंस:',
        notEnough: 'पर्याप्त सिक्के नहीं!\n\nआपका बैलेंस:',
        invalidBet: 'अमान्य बेट राशि!\n\nन्यूनतम: 10 सिक्के\nअधिकतम: 1000000 सिक्के',
        invalidType: 'अमान्य बेट प्रकार!\n\nसभी प्रकार देखने के लिए .roulette का उपयोग करें।',
        red: 'लाल',
        black: 'काला',
        green: 'हरा',
        odd: 'विषम',
        even: 'सम',
        low: 'निम्न (1-18)',
        high: 'उच्च (19-36)',
        straight: 'स्ट्रेट',
        dozen1: 'पहला दर्जन (1-12)',
        dozen2: 'दूसरा दर्जन (13-24)',
        dozen3: 'तीसरा दर्जन (25-36)',
        column1: 'कॉलम 1',
        column2: 'कॉलम 2',
        column3: 'कॉलम 3',
        winner: '🎉 विजेता! 🎉',
        loser: '😢 अगली बार बेहतर किस्मत'
    },
    ng: {
        usage: '🎰 ROULETTE CASINO 🎰\n\nPlace your bets:\n• .roulette <bet> <type>\n\nBet Types:\n━━━━━━━━━━━━━━━━━━━━━\n🔴 RED/BLACK (1:1)\n  .roulette 10 red\n  .roulette 10 black\n\n⚪ ODD/EVEN (1:1)\n  .roulette 10 odd\n  .roulette 10 even\n\n🔢 HIGH/LOW (1:1)\n  .roulette 10 low (1-18)\n  .roulette 10 high (19-36)\n\n🎯 STRAIGHT (35:1)\n  .roulette 10 5 (single number)\n\n📊 DOZEN (2:1)\n  .roulette 10 1st (1-12)\n  .roulette 10 2nd (13-24)\n  .roulette 10 3rd (25-36)\n\n📐 COLUMN (2:1)\n  .roulette 10 col1\n  .roulette 10 col2\n  .roulette 10 col3\n\nBet: 10-1000000 coins\nEuropean Roulette (single 0)',
        spinning: '🎰 We dey spin di wheel...',
        result: '🎯 Result:',
        number: 'Number:',
        color: 'Color:',
        bet: 'Bet:',
        betType: 'Bet Type:',
        won: 'Won:',
        lost: 'Lost:',
        balance: 'Balance:',
        notEnough: 'Coins no reach!\n\nYour balance:',
        invalidBet: 'Dat bet amount no correct!\n\nMinimum: 10 coins\nMaximum: 1000000 coins',
        invalidType: 'Dat bet type no correct!\n\nUse .roulette to see all bet types.',
        red: 'RED',
        black: 'BLACK',
        green: 'GREEN',
        odd: 'ODD',
        even: 'EVEN',
        low: 'LOW (1-18)',
        high: 'HIGH (19-36)',
        straight: 'STRAIGHT',
        dozen1: '1ST DOZEN (1-12)',
        dozen2: '2ND DOZEN (13-24)',
        dozen3: '3RD DOZEN (25-36)',
        column1: 'COLUMN 1',
        column2: 'COLUMN 2',
        column3: 'COLUMN 3',
        winner: '🎉 YOU WIN AM! 🎉',
        loser: '😢 BETTER LUCK NEXT TIME'
    }
};

// European Roulette wheel (0-36)
const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

// Column definitions
const column1 = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];
const column2 = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
const column3 = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];

function spinWheel() {
    return Math.floor(Math.random() * 37); // 0-36
}

function getNumberColor(number) {
    if (number === 0) return 'green';
    if (redNumbers.includes(number)) return 'red';
    if (blackNumbers.includes(number)) return 'black';
    return 'green';
}

function getNumberEmoji(number) {
    const color = getNumberColor(number);
    if (color === 'red') return '🔴';
    if (color === 'black') return '⚫';
    return '🟢';
}

function checkWin(number, betType, betValue) {
    const color = getNumberColor(number);
    const isOdd = number % 2 !== 0 && number !== 0;
    const isEven = number % 2 === 0 && number !== 0;
    
    // Straight bet (single number)
    if (!isNaN(betType)) {
        const targetNumber = parseInt(betType);
        if (targetNumber >= 0 && targetNumber <= 36) {
            return number === targetNumber ? { win: true, payout: 35 } : { win: false, payout: 0 };
        }
    }
    
    // Color bets
    if (betType === 'red') {
        return color === 'red' ? { win: true, payout: 1 } : { win: false, payout: 0 };
    }
    if (betType === 'black') {
        return color === 'black' ? { win: true, payout: 1 } : { win: false, payout: 0 };
    }
    
    // Odd/Even bets
    if (betType === 'odd') {
        return isOdd ? { win: true, payout: 1 } : { win: false, payout: 0 };
    }
    if (betType === 'even') {
        return isEven ? { win: true, payout: 1 } : { win: false, payout: 0 };
    }
    
    // High/Low bets
    if (betType === 'low') {
        return (number >= 1 && number <= 18) ? { win: true, payout: 1 } : { win: false, payout: 0 };
    }
    if (betType === 'high') {
        return (number >= 19 && number <= 36) ? { win: true, payout: 1 } : { win: false, payout: 0 };
    }
    
    // Dozen bets
    if (betType === '1st' || betType === 'first') {
        return (number >= 1 && number <= 12) ? { win: true, payout: 2 } : { win: false, payout: 0 };
    }
    if (betType === '2nd' || betType === 'second') {
        return (number >= 13 && number <= 24) ? { win: true, payout: 2 } : { win: false, payout: 0 };
    }
    if (betType === '3rd' || betType === 'third') {
        return (number >= 25 && number <= 36) ? { win: true, payout: 2 } : { win: false, payout: 0 };
    }
    
    // Column bets
    if (betType === 'col1' || betType === 'column1') {
        return column1.includes(number) ? { win: true, payout: 2 } : { win: false, payout: 0 };
    }
    if (betType === 'col2' || betType === 'column2') {
        return column2.includes(number) ? { win: true, payout: 2 } : { win: false, payout: 0 };
    }
    if (betType === 'col3' || betType === 'column3') {
        return column3.includes(number) ? { win: true, payout: 2 } : { win: false, payout: 0 };
    }
    
    return { win: false, payout: 0 };
}

function getBetTypeName(betType, t) {
    if (!isNaN(betType)) return `${t.straight} (${betType})`;
    
    const betTypeMap = {
        'red': t.red,
        'black': t.black,
        'odd': t.odd,
        'even': t.even,
        'low': t.low,
        'high': t.high,
        '1st': t.dozen1,
        'first': t.dozen1,
        '2nd': t.dozen2,
        'second': t.dozen2,
        '3rd': t.dozen3,
        'third': t.dozen3,
        'col1': t.column1,
        'column1': t.column1,
        'col2': t.column2,
        'column2': t.column2,
        'col3': t.column3,
        'column3': t.column3
    };
    
    return betTypeMap[betType.toLowerCase()] || betType.toUpperCase();
}

export default {
    name: 'roulette',
    aliases: ['rlt'],
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const pushName = msg.pushName || 'Player';
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        const coins = lang === 'it' ? 'monete' : lang === 'ru' ? 'монет' : lang === 'es' ? 'monedas' : lang === 'pt' ? 'moedas' : 'coins';
        
        // Show usage if no args
        if (args.length === 0) {
            return await sock.sendMessage(from, { text: t.usage });
        }
        
        // Parse bet amount
        const validation = validateBet(args[0], 10, 1000000);
        if (!validation.valid) {
            return await sock.sendMessage(from, { 
                text: `❌ ${validation.error}` 
            });
        }
        const bet = validation.amount;
        
        // Check if bet type provided
        if (args.length < 2) {
            return await sock.sendMessage(from, { text: t.invalidType });
        }
        
        // Get bet type - normalize to lowercase
        const betType = normalizeBetType(args[1]);
        
        // Validate bet type
        const validBetTypes = ['red', 'black', 'odd', 'even', 'low', 'high', '1st', '2nd', '3rd', 'first', 'second', 'third', 'col1', 'col2', 'col3', 'column1', 'column2', 'column3'];
        const isNumberBet = !isNaN(betType) && parseInt(betType) >= 0 && parseInt(betType) <= 36;
        
        if (!validBetTypes.includes(betType) && !isNumberBet) {
            return await sock.sendMessage(from, { text: t.invalidType });
        }
        
        // Check balance
        if (!(await hasEnough(sender, bet))) {
            const balance = await getBalance(sender);
            return await sock.sendMessage(from, { 
                text: `${t.notEnough} ${balance} ${coins}\n\n${t.usage}`
            });
        }
        
        // Deduct bet
        await removeCoins(sender, bet);
        
        // Send spinning animation
        const spinMsg = await sock.sendMessage(from, { 
            text: `${t.spinning}\n\n🎰 🎲 🎰\n\n${t.bet} ${bet} ${coins}\n${t.betType} ${getBetTypeName(betType, t)}`
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Spin the wheel
        const number = spinWheel();
        const color = getNumberColor(number);
        const emoji = getNumberEmoji(number);
        
        // Check if win
        const result = checkWin(number, betType, bet);
        const winAmount = result.win ? bet * result.payout : 0;
        
        // Update balance - FIXED: Only add winnings, not bet (bet already deducted)
        if (result.win) {
            await addCoins(sender, winAmount); // Only winnings, bet was already deducted
        }
        
        const newBalance = await getBalance(sender);
        
        // Get color name
        let colorName = t.green;
        if (color === 'red') colorName = t.red;
        if (color === 'black') colorName = t.black;
        
        // Build result message
        let resultText = `${t.result}\n\n${emoji} ${t.number} ${number}\n${t.color} ${colorName}\n\n`;
        resultText += `${t.bet} ${bet} ${coins}\n`;
        resultText += `${t.betType} ${getBetTypeName(betType, t)}\n\n`;
        
        if (result.win) {
            resultText += `${t.winner}\n\n`;
            resultText += `${t.won} +${winAmount} ${coins}\n`;
        } else {
            resultText += `${t.loser}\n\n`;
            resultText += `${t.lost} -${bet} ${coins}\n`;
        }
        
        resultText += `${t.balance} ${newBalance} ${coins}`;
        
        // Show result
        await sock.sendMessage(from, {
            text: resultText,
            edit: spinMsg.key
        });
    }
};
