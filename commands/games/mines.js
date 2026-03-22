import { getGroupLanguage } from '../../utils/language.js';
import { getBalance, addCoins, removeCoins, hasEnough } from '../../utils/bank_SAFE.js';
import { getCoinMultiplier, getLuckBoost } from '../../utils/shopSystem.js';
import { validateAmount, safeMultiply, secureRandomInt } from '../../utils/securityEnhancements.js';
import { validateGridPosition } from '../../utils/gameValidation.js';
import fs from 'fs';
import path from 'path';

// Active games storage
export const activeGames = new Map();

// Statistics storage
const STATS_FILE = './data/mines_stats.json';

// Load stats from file
function loadStats() {
    try {
        if (fs.existsSync(STATS_FILE)) {
            const data = fs.readFileSync(STATS_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('[MINES] Error loading stats:', error);
    }
    return {};
}

// Save stats to file
function saveStats(stats) {
    try {
        const dir = path.dirname(STATS_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
    } catch (error) {
        console.error('[MINES] Error saving stats:', error);
    }
}

// Calculate multiplier based on revealed tiles and mine count
// Formula: P(x) = ∏(n=0 to x-1) [(25 - mines - n) / (25 - n)]
// Multiplier = 1 / P(x) with 3% house edge (RTP 97%)
function calculateMultiplier(revealedCount, mineCount) {
    if (revealedCount === 0) return 1.00;
    
    let probability = 1.0;
    for (let n = 0; n < revealedCount; n++) {
        probability *= (25 - mineCount - n) / (25 - n);
    }
    
    // Multiplier is inverse of probability with house edge
    const rawMultiplier = 1 / probability;
    const multiplierWithEdge = rawMultiplier * 0.97; // 3% house edge
    
    return Math.max(1.01, multiplierWithEdge);
}


// Generate grid with random mine placement (using cryptographically secure random)
function generateGrid(mineCount) {
    const grid = Array(25).fill(false);
    const minePositions = new Set();
    
    while (minePositions.size < mineCount) {
        const pos = secureRandomInt(0, 25);
        minePositions.add(pos);
    }
    
    minePositions.forEach(pos => {
        grid[pos] = true; // true = mine
    });
    
    return grid;
}

// Convert position (A1-E5) to index (0-24) with validation
function positionToIndex(position) {
    const validation = validateGridPosition(position, 5, 5);
    if (!validation.valid) {
        return -1;
    }
    return validation.index;
}

// Display grid with revealed tiles
function displayGrid(game, lang) {
    const { grid, revealed, mineCount } = game;
    const t = responses[lang] || responses.en;
    
    let display = '\n';
    display += '    A   B   C   D   E\n';
    display += '  ┌───┬───┬───┬───┬───┐\n';
    
    for (let row = 0; row < 5; row++) {
        display += `${row + 1} │`;
        for (let col = 0; col < 5; col++) {
            const index = row * 5 + col;
            if (revealed[index]) {
                if (grid[index]) {
                    display += ' 💣│'; // Mine hit
                } else {
                    display += ' 💎│'; // Safe tile
                }
            } else {
                display += ' ▪️│'; // Hidden tile
            }
        }
        display += '\n';
        if (row < 4) {
            display += '  ├───┼───┼───┼───┼───┤\n';
        }
    }
    display += '  └───┴───┴───┴───┴───┘\n';
    
    return display;
}


// Multi-language responses
const responses = {
    en: {
        title: '💣 MINES 💎',
        player: '👤',
        bet: '💰',
        mines: '💣',
        revealed: '💎',
        multiplier: '📈',
        potential: '💵',
        balance: '💰',
        actions: '\n━━━━━━━━━━━━━━━━━━━━━\n💡 Actions:\n  📍 Type position (A1-E5)\n  💰 Type "cashout" to collect\n  ❌ Type "quit" to forfeit',
        usage: '💣 MINES GAME 💎\n\nHow to play:\n• .mines <bet> <mines>\n\nExamples:\n• .mines 100 3 (easy)\n• .mines 500 10 (medium)\n• .mines 1000 20 (hard)\n\n📊 Settings:\n• Bet: 10-1,000,000 coins\n• Mines: 1-24 (more = higher risk/reward)\n\n🎮 Gameplay:\n1. Choose bet and mine count\n2. Reveal tiles one by one\n3. Each safe tile increases multiplier\n4. Cash out anytime to win\n5. Hit mine = lose everything\n\n💡 Strategy:\n• Few mines = safer, lower multipliers\n• Many mines = riskier, higher multipliers\n• Cash out early for guaranteed profit\n• Push luck for massive wins!\n\n🍀 Luck boosts increase safe tile chance!',
        notEnough: '❌ Not enough coins!\n\n💰 Your balance:',
        invalidBet: '❌ Invalid bet amount!\n\n📊 Limits:\n• Minimum: 10 coins\n• Maximum: 1,000,000 coins',
        invalidMines: '❌ Invalid mine count!\n\n💣 Mines: 1-24\n\n💡 Tip:\n• 1-5 mines = Easy\n• 6-15 mines = Medium\n• 16-24 mines = Hard',
        gameStarted: '🎮 Game started!\n\n💣 {mines} mines hidden in the grid\n💎 Reveal tiles to increase multiplier\n💰 Cash out anytime to win!\n\n🍀 Your luck boost: +{luck}%',
        noGame: '❌ No active game!\n\nStart with: .mines <bet> <mines>',
        alreadyPlaying: '⚠️ You already have an active game!\n\nType "quit" to forfeit or keep playing.',
        invalidPosition: '❌ Invalid position!\n\nUse format: A1, B3, E5, etc.\nValid: A-E (columns), 1-5 (rows)',
        alreadyRevealed: '⚠️ Already revealed!\n\nChoose a different tile.',
        hitMine: '💥 BOOM! YOU HIT A MINE! 💥\n\n💣 Game Over!\n💸 Lost: {bet} coins\n💰 Balance: {balance} coins',
        safeTile: 'SAFE! 💎',
        cashout: '💰 CASHED OUT! 💰\n\n🎉 Congratulations!\n💎 Tiles revealed: {revealed}\n📈 Final multiplier: {multiplier}x\n💵 Won: {win} coins\n💰 New balance: {balance} coins',
        allRevealed: '🎊 PERFECT GAME! 🎊\n\n💎 ALL SAFE TILES REVEALED!\n🏆 MAXIMUM MULTIPLIER!\n💵 Won: {win} coins\n💰 New balance: {balance} coins\n\n👑 LEGENDARY!',
        quit: '🏳️ Game forfeited\n\n💸 Lost: {bet} coins\n💰 Balance: {balance} coins',
        stats: '\n\n📊 Your Stats:\n🎮 Games: {games}\n🏆 Wins: {wins}\n💥 Losses: {losses}\n💎 Best streak: {bestStreak}\n📈 Highest multiplier: {highestMultiplier}x\n💰 Total won: {totalWon}\n💸 Total lost: {totalLost}\n📊 Win rate: {winRate}%'
    },
    it: {
        title: '💣 MINES 💎',
        player: '👤',
        bet: '💰',
        mines: '💣',
        revealed: '💎',
        multiplier: '📈',
        potential: '💵',
        balance: '💰',
        actions: '\n━━━━━━━━━━━━━━━━━━━━━\n💡 Azioni:\n  📍 Digita posizione (A1-E5)\n  💰 Digita "cashout" per incassare\n  ❌ Digita "quit" per abbandonare',
        usage: '💣 GIOCO MINE 💎\n\nCome giocare:\n• .mines <puntata> <mine>\n\nEsempi:\n• .mines 100 3 (facile)\n• .mines 500 10 (medio)\n• .mines 1000 20 (difficile)\n\n📊 Impostazioni:\n• Puntata: 10-1.000.000 monete\n• Mine: 1-24 (più = maggior rischio/ricompensa)\n\n🎮 Gameplay:\n1. Scegli puntata e numero mine\n2. Rivela tessere una per una\n3. Ogni tessera sicura aumenta il moltiplicatore\n4. Incassa quando vuoi per vincere\n5. Colpisci mina = perdi tutto\n\n💡 Strategia:\n• Poche mine = più sicuro, moltiplicatori bassi\n• Molte mine = più rischioso, moltiplicatori alti\n• Incassa presto per profitto garantito\n• Rischia per vincite enormi!\n\n🍀 I boost fortuna aumentano la probabilità di tessere sicure!',
        notEnough: '❌ Monete insufficienti!\n\n💰 Il tuo saldo:',
        invalidBet: '❌ Importo puntata non valido!\n\n📊 Limiti:\n• Minimo: 10 monete\n• Massimo: 1.000.000 monete',
        invalidMines: '❌ Numero mine non valido!\n\n💣 Mine: 1-24\n\n💡 Suggerimento:\n• 1-5 mine = Facile\n• 6-15 mine = Medio\n• 16-24 mine = Difficile',
        gameStarted: '🎮 Gioco iniziato!\n\n💣 {mines} mine nascoste nella griglia\n💎 Rivela tessere per aumentare il moltiplicatore\n💰 Incassa quando vuoi per vincere!\n\n🍀 Il tuo boost fortuna: +{luck}%',
        noGame: '❌ Nessun gioco attivo!\n\nInizia con: .mines <puntata> <mine>',
        alreadyPlaying: '⚠️ Hai già un gioco attivo!\n\nDigita "quit" per abbandonare o continua a giocare.',
        invalidPosition: '❌ Posizione non valida!\n\nUsa formato: A1, B3, E5, ecc.\nValido: A-E (colonne), 1-5 (righe)',
        alreadyRevealed: '⚠️ Già rivelata!\n\nScegli una tessera diversa.',
        hitMine: '💥 BOOM! HAI COLPITO UNA MINA! 💥\n\n💣 Game Over!\n💸 Perso: {bet} monete\n💰 Saldo: {balance} monete',
        safeTile: 'SICURA! 💎',
        cashout: '💰 INCASSATO! 💰\n\n🎉 Congratulazioni!\n💎 Tessere rivelate: {revealed}\n📈 Moltiplicatore finale: {multiplier}x\n💵 Vinto: {win} monete\n💰 Nuovo saldo: {balance} monete',
        allRevealed: '🎊 GIOCO PERFETTO! 🎊\n\n💎 TUTTE LE TESSERE SICURE RIVELATE!\n🏆 MOLTIPLICATORE MASSIMO!\n💵 Vinto: {win} monete\n💰 Nuovo saldo: {balance} monete\n\n👑 LEGGENDARIO!',
        quit: '🏳️ Gioco abbandonato\n\n💸 Perso: {bet} monete\n💰 Saldo: {balance} monete',
        stats: '\n\n📊 Le Tue Statistiche:\n🎮 Partite: {games}\n🏆 Vittorie: {wins}\n💥 Sconfitte: {losses}\n💎 Miglior serie: {bestStreak}\n📈 Moltiplicatore più alto: {highestMultiplier}x\n💰 Totale vinto: {totalWon}\n💸 Totale perso: {totalLost}\n📊 Tasso vittoria: {winRate}%'
    },
    ru: {
        title: '💣 ═══ ИГРА МИНЫ ═══ 💎',
        player: '👤 Игрок:',
        bet: '💰 Ставка:',
        mines: '💣 Мины:',
        revealed: '💎 Открыто:',
        multiplier: '📈 Множитель:',
        potential: '💵 Потенциальный Выигрыш:',
        balance: '💰 Баланс:',
        actions: '\n━━━━━━━━━━━━━━━━━━━━━\n💡 Действия:\n  📍 Введите позицию (A1-E5)\n  💰 Введите "cashout" чтобы забрать\n  ❌ Введите "quit" чтобы сдаться',
        usage: '💣 ИГРА МИНЫ 💎\n\nКак играть:\n• .mines <ставка> <мины>\n\nПримеры:\n• .mines 100 3 (легко)\n• .mines 500 10 (средне)\n• .mines 1000 20 (сложно)\n\n📊 Настройки:\n• Ставка: 10-1.000.000 монет\n• Мины: 1-24 (больше = выше риск/награда)\n\n🎮 Геймплей:\n1. Выберите ставку и количество мин\n2. Открывайте плитки одну за другой\n3. Каждая безопасная плитка увеличивает множитель\n4. Заберите в любой момент чтобы выиграть\n5. Попали на мину = потеряли всё\n\n💡 Стратегия:\n• Мало мин = безопаснее, низкие множители\n• Много мин = рискованнее, высокие множители\n• Заберите рано для гарантированной прибыли\n• Рискуйте для огромных выигрышей!\n\n🍀 Бусты удачи увеличивают шанс безопасных плиток!',
        notEnough: '❌ Недостаточно монет!\n\n💰 Ваш баланс:',
        invalidBet: '❌ Неверная сумма ставки!\n\n📊 Лимиты:\n• Минимум: 10 монет\n• Максимум: 1.000.000 монет',
        invalidMines: '❌ Неверное количество мин!\n\n💣 Мины: 1-24\n\n💡 Совет:\n• 1-5 мин = Легко\n• 6-15 мин = Средне\n• 16-24 мин = Сложно',
        gameStarted: '🎮 Игра началась!\n\n💣 {mines} мин спрятано в сетке\n💎 Открывайте плитки для увеличения множителя\n💰 Заберите в любой момент чтобы выиграть!\n\n🍀 Ваш буст удачи: +{luck}%',
        noGame: '❌ Нет активной игры!\n\nНачните с: .mines <ставка> <мины>',
        alreadyPlaying: '⚠️ У вас уже есть активная игра!\n\nВведите "quit" чтобы сдаться или продолжайте играть.',
        invalidPosition: '❌ Неверная позиция!\n\nИспользуйте формат: A1, B3, E5, и т.д.\nДопустимо: A-E (столбцы), 1-5 (ряды)',
        alreadyRevealed: '⚠️ Уже открыто!\n\nВыберите другую плитку.',
        hitMine: '💥 БУМ! ВЫ ПОПАЛИ НА МИНУ! 💥\n\n💣 Игра Окончена!\n💸 Потеряно: {bet} монет\n💰 Баланс: {balance} монет\n\n😢 Удачи в следующий раз!',
        safeTile: '✅ БЕЗОПАСНО! 💎\n\n📈 Множитель увеличен!\n💵 Текущий выигрыш: {win} монет\n\n💡 Продолжить или забрать?',
        cashout: '💰 ЗАБРАНО! 💰\n\n🎉 Поздравляем!\n💎 Открыто плиток: {revealed}\n📈 Финальный множитель: {multiplier}x\n💵 Выиграно: {win} монет\n💰 Новый баланс: {balance} монет\n\n🏆 Отличная работа!',
        allRevealed: '🎊 ИДЕАЛЬНАЯ ИГРА! 🎊\n\n💎 ВСЕ БЕЗОПАСНЫЕ ПЛИТКИ ОТКРЫТЫ!\n🏆 МАКСИМАЛЬНЫЙ МНОЖИТЕЛЬ!\n💵 Выиграно: {win} монет\n💰 Новый баланс: {balance} монет\n\n👑 ЛЕГЕНДАРНО!',
        quit: '🏳️ Игра сдана\n\n💸 Потеряно: {bet} монет\n💰 Баланс: {balance} монет',
        stats: '\n\n📊 Ваша Статистика:\n🎮 Игр: {games}\n🏆 Побед: {wins}\n💥 Поражений: {losses}\n💎 Лучшая серия: {bestStreak}\n📈 Наивысший множитель: {highestMultiplier}x\n💰 Всего выиграно: {totalWon}\n💸 Всего проиграно: {totalLost}\n📊 Процент побед: {winRate}%'
    },
    es: {
        title: '💣 ═══ JUEGO MINAS ═══ 💎',
        player: '👤 Jugador:',
        bet: '💰 Apuesta:',
        mines: '💣 Minas:',
        revealed: '💎 Reveladas:',
        multiplier: '📈 Multiplicador:',
        potential: '💵 Ganancia Potencial:',
        balance: '💰 Saldo:',
        actions: '\n━━━━━━━━━━━━━━━━━━━━━\n💡 Acciones:\n  📍 Escribe posición (A1-E5)\n  💰 Escribe "cashout" para cobrar\n  ❌ Escribe "quit" para abandonar',
        usage: '💣 JUEGO MINAS 💎\n\nCómo jugar:\n• .mines <apuesta> <minas>\n\nEjemplos:\n• .mines 100 3 (fácil)\n• .mines 500 10 (medio)\n• .mines 1000 20 (difícil)\n\n📊 Configuración:\n• Apuesta: 10-1.000.000 monedas\n• Minas: 1-24 (más = mayor riesgo/recompensa)\n\n🎮 Jugabilidad:\n1. Elige apuesta y cantidad de minas\n2. Revela casillas una por una\n3. Cada casilla segura aumenta el multiplicador\n4. Cobra cuando quieras para ganar\n5. Golpea mina = pierdes todo\n\n💡 Estrategia:\n• Pocas minas = más seguro, multiplicadores bajos\n• Muchas minas = más arriesgado, multiplicadores altos\n• Cobra temprano para ganancia garantizada\n• ¡Arriesga para ganancias masivas!\n\n🍀 ¡Los boosts de suerte aumentan la probabilidad de casillas seguras!',
        notEnough: '❌ ¡No tienes suficientes monedas!\n\n💰 Tu saldo:',
        invalidBet: '❌ ¡Cantidad de apuesta inválida!\n\n📊 Límites:\n• Mínimo: 10 monedas\n• Máximo: 1.000.000 monedas',
        invalidMines: '❌ ¡Cantidad de minas inválida!\n\n💣 Minas: 1-24\n\n💡 Consejo:\n• 1-5 minas = Fácil\n• 6-15 minas = Medio\n• 16-24 minas = Difícil',
        gameStarted: '🎮 ¡Juego iniciado!\n\n💣 {mines} minas ocultas en la cuadrícula\n💎 Revela casillas para aumentar el multiplicador\n💰 ¡Cobra cuando quieras para ganar!\n\n🍀 Tu boost de suerte: +{luck}%',
        noGame: '❌ ¡No hay juego activo!\n\nInicia con: .mines <apuesta> <minas>',
        alreadyPlaying: '⚠️ ¡Ya tienes un juego activo!\n\nEscribe "quit" para abandonar o sigue jugando.',
        invalidPosition: '❌ ¡Posición inválida!\n\nUsa formato: A1, B3, E5, etc.\nVálido: A-E (columnas), 1-5 (filas)',
        alreadyRevealed: '⚠️ ¡Ya revelada!\n\nElige una casilla diferente.',
        hitMine: '💥 ¡BOOM! ¡GOLPEASTE UNA MINA! 💥\n\n💣 ¡Game Over!\n💸 Perdido: {bet} monedas\n💰 Saldo: {balance} monedas\n\n😢 ¡Mejor suerte la próxima!',
        safeTile: '✅ ¡SEGURA! 💎\n\n📈 ¡Multiplicador aumentado!\n💵 Ganancia actual: {win} monedas\n\n💡 ¿Continuar o cobrar?',
        cashout: '💰 ¡COBRADO! 💰\n\n🎉 ¡Felicitaciones!\n💎 Casillas reveladas: {revealed}\n📈 Multiplicador final: {multiplier}x\n💵 Ganado: {win} monedas\n💰 Nuevo saldo: {balance} monedas\n\n🏆 ¡Buen trabajo!',
        allRevealed: '🎊 ¡JUEGO PERFECTO! 🎊\n\n💎 ¡TODAS LAS CASILLAS SEGURAS REVELADAS!\n🏆 ¡MULTIPLICADOR MÁXIMO!\n💵 Ganado: {win} monedas\n💰 Nuevo saldo: {balance} monedas\n\n👑 ¡LEGENDARIO!',
        quit: '🏳️ Juego abandonado\n\n💸 Perdido: {bet} monedas\n💰 Saldo: {balance} monedas',
        stats: '\n\n📊 Tus Estadísticas:\n🎮 Juegos: {games}\n🏆 Victorias: {wins}\n💥 Derrotas: {losses}\n💎 Mejor racha: {bestStreak}\n📈 Multiplicador más alto: {highestMultiplier}x\n💰 Total ganado: {totalWon}\n💸 Total perdido: {totalLost}\n📊 Tasa de victoria: {winRate}%'
    },
    pt: {
        title: '💣 ═══ JOGO MINAS ═══ 💎',
        player: '👤 Jogador:',
        bet: '💰 Aposta:',
        mines: '💣 Minas:',
        revealed: '💎 Reveladas:',
        multiplier: '📈 Multiplicador:',
        potential: '💵 Ganho Potencial:',
        balance: '💰 Saldo:',
        actions: '\n━━━━━━━━━━━━━━━━━━━━━\n💡 Ações:\n  📍 Digite posição (A1-E5)\n  💰 Digite "cashout" para sacar\n  ❌ Digite "quit" para desistir',
        usage: '💣 JOGO MINAS 💎\n\nComo jogar:\n• .mines <aposta> <minas>\n\nExemplos:\n• .mines 100 3 (fácil)\n• .mines 500 10 (médio)\n• .mines 1000 20 (difícil)\n\n📊 Configurações:\n• Aposta: 10-1.000.000 moedas\n• Minas: 1-24 (mais = maior risco/recompensa)\n\n🎮 Jogabilidade:\n1. Escolha aposta e quantidade de minas\n2. Revele blocos um por um\n3. Cada bloco seguro aumenta o multiplicador\n4. Saque quando quiser para ganhar\n5. Acerte mina = perde tudo\n\n💡 Estratégia:\n• Poucas minas = mais seguro, multiplicadores baixos\n• Muitas minas = mais arriscado, multiplicadores altos\n• Saque cedo para lucro garantido\n• Arrisque para ganhos massivos!\n\n🍀 Boosts de sorte aumentam a chance de blocos seguros!',
        notEnough: '❌ Moedas insuficientes!\n\n💰 Seu saldo:',
        invalidBet: '❌ Valor de aposta inválido!\n\n📊 Limites:\n• Mínimo: 10 moedas\n• Máximo: 1.000.000 moedas',
        invalidMines: '❌ Quantidade de minas inválida!\n\n💣 Minas: 1-24\n\n💡 Dica:\n• 1-5 minas = Fácil\n• 6-15 minas = Médio\n• 16-24 minas = Difícil',
        gameStarted: '🎮 Jogo iniciado!\n\n💣 {mines} minas escondidas na grade\n💎 Revele blocos para aumentar o multiplicador\n💰 Saque quando quiser para ganhar!\n\n🍀 Seu boost de sorte: +{luck}%',
        noGame: '❌ Nenhum jogo ativo!\n\nInicie com: .mines <aposta> <minas>',
        alreadyPlaying: '⚠️ Você já tem um jogo ativo!\n\nDigite "quit" para desistir ou continue jogando.',
        invalidPosition: '❌ Posição inválida!\n\nUse formato: A1, B3, E5, etc.\nVálido: A-E (colunas), 1-5 (linhas)',
        alreadyRevealed: '⚠️ Já revelado!\n\nEscolha um bloco diferente.',
        hitMine: '💥 BOOM! VOCÊ ACERTOU UMA MINA! 💥\n\n💣 Game Over!\n💸 Perdido: {bet} moedas\n💰 Saldo: {balance} moedas\n\n😢 Melhor sorte da próxima!',
        safeTile: '✅ SEGURO! 💎\n\n📈 Multiplicador aumentado!\n💵 Ganho atual: {win} moedas\n\n💡 Continuar ou sacar?',
        cashout: '💰 SACADO! 💰\n\n🎉 Parabéns!\n💎 Blocos revelados: {revealed}\n📈 Multiplicador final: {multiplier}x\n💵 Ganho: {win} moedas\n💰 Novo saldo: {balance} moedas\n\n🏆 Ótimo trabalho!',
        allRevealed: '🎊 JOGO PERFEITO! 🎊\n\n💎 TODOS OS BLOCOS SEGUROS REVELADOS!\n🏆 MULTIPLICADOR MÁXIMO!\n💵 Ganho: {win} moedas\n💰 Novo saldo: {balance} moedas\n\n👑 LENDÁRIO!',
        quit: '🏳️ Jogo abandonado\n\n💸 Perdido: {bet} moedas\n💰 Saldo: {balance} moedas',
        stats: '\n\n📊 Suas Estatísticas:\n🎮 Jogos: {games}\n🏆 Vitórias: {wins}\n💥 Derrotas: {losses}\n💎 Melhor sequência: {bestStreak}\n📈 Maior multiplicador: {highestMultiplier}x\n💰 Total ganho: {totalWon}\n💸 Total perdido: {totalLost}\n📊 Taxa de vitória: {winRate}%'
    },
    ar: {
        title: '💣 ═══ لعبة الألغام ═══ 💎',
        player: '👤 اللاعب:',
        bet: '💰 الرهان:',
        mines: '💣 الألغام:',
        revealed: '💎 المكشوفة:',
        multiplier: '📈 المضاعف:',
        potential: '💵 الربح المحتمل:',
        balance: '💰 الرصيد:',
        actions: '\n━━━━━━━━━━━━━━━━━━━━━\n💡 الإجراءات:\n  📍 اكتب الموقع (A1-E5)\n  💰 اكتب "cashout" للسحب\n  ❌ اكتب "quit" للاستسلام',
        usage: '💣 لعبة الألغام 💎\n\nكيف تلعب:\n• .mines <رهان> <ألغام>\n\nأمثلة:\n• .mines 100 3 (سهل)\n• .mines 500 10 (متوسط)\n• .mines 1000 20 (صعب)\n\n📊 الإعدادات:\n• الرهان: 10-1.000.000 عملة\n• الألغام: 1-24 (أكثر = مخاطرة/مكافأة أعلى)\n\n🎮 طريقة اللعب:\n1. اختر الرهان وعدد الألغام\n2. اكشف المربعات واحدة تلو الأخرى\n3. كل مربع آمن يزيد المضاعف\n4. اسحب في أي وقت للفوز\n5. اضرب لغم = تخسر كل شيء\n\n💡 الاستراتيجية:\n• ألغام قليلة = أكثر أمانًا، مضاعفات منخفضة\n• ألغام كثيرة = أكثر خطورة، مضاعفات عالية\n• اسحب مبكرًا لربح مضمون\n• خاطر لمكاسب ضخمة!\n\n🍀 تعزيزات الحظ تزيد فرصة المربعات الآمنة!',
        notEnough: '❌ عملات غير كافية!\n\n💰 رصيدك:',
        invalidBet: '❌ مبلغ رهان غير صالح!\n\n📊 الحدود:\n• الحد الأدنى: 10 عملات\n• الحد الأقصى: 1.000.000 عملة',
        invalidMines: '❌ عدد ألغام غير صالح!\n\n💣 الألغام: 1-24\n\n💡 نصيحة:\n• 1-5 ألغام = سهل\n• 6-15 لغم = متوسط\n• 16-24 لغم = صعب',
        gameStarted: '🎮 بدأت اللعبة!\n\n💣 {mines} لغم مخفي في الشبكة\n💎 اكشف المربعات لزيادة المضاعف\n💰 اسحب في أي وقت للفوز!\n\n🍀 تعزيز حظك: +{luck}%',
        noGame: '❌ لا توجد لعبة نشطة!\n\nابدأ بـ: .mines <رهان> <ألغام>',
        alreadyPlaying: '⚠️ لديك لعبة نشطة بالفعل!\n\nاكتب "quit" للاستسلام أو استمر في اللعب.',
        invalidPosition: '❌ موقع غير صالح!\n\nاستخدم التنسيق: A1, B3, E5, إلخ.\nصالح: A-E (أعمدة), 1-5 (صفوف)',
        alreadyRevealed: '⚠️ مكشوف بالفعل!\n\nاختر مربعًا مختلفًا.',
        hitMine: '💥 بوم! ضربت لغمًا! 💥\n\n💣 انتهت اللعبة!\n💸 خسارة: {bet} عملة\n💰 الرصيد: {balance} عملة\n\n😢 حظ أفضل المرة القادمة!',
        safeTile: '✅ آمن! 💎\n\n📈 زاد المضاعف!\n💵 الربح الحالي: {win} عملة\n\n💡 استمر أم اسحب?',
        cashout: '💰 تم السحب! 💰\n\n🎉 تهانينا!\n💎 المربعات المكشوفة: {revealed}\n📈 المضاعف النهائي: {multiplier}x\n💵 الربح: {win} عملة\n💰 الرصيد الجديد: {balance} عملة\n\n🏆 عمل رائع!',
        allRevealed: '🎊 لعبة مثالية! 🎊\n\n💎 كل المربعات الآمنة مكشوفة!\n🏆 المضاعف الأقصى!\n💵 الربح: {win} عملة\n💰 الرصيد الجديد: {balance} عملة\n\n👑 أسطوري!',
        quit: '🏳️ تم التخلي عن اللعبة\n\n💸 خسارة: {bet} عملة\n💰 الرصيد: {balance} عملة',
        stats: '\n\n📊 إحصائياتك:\n🎮 الألعاب: {games}\n🏆 الانتصارات: {wins}\n💥 الهزائم: {losses}\n💎 أفضل سلسلة: {bestStreak}\n📈 أعلى مضاعف: {highestMultiplier}x\n💰 إجمالي الربح: {totalWon}\n💸 إجمالي الخسارة: {totalLost}\n📊 معدل الفوز: {winRate}%'
    },
    hi: {
        title: '💣 ═══ माइन्स गेम ═══ 💎',
        player: '👤 खिलाड़ी:',
        bet: '💰 दांव:',
        mines: '💣 माइन्स:',
        revealed: '💎 खुले:',
        multiplier: '📈 गुणक:',
        potential: '💵 संभावित जीत:',
        balance: '💰 बैलेंस:',
        actions: '\n━━━━━━━━━━━━━━━━━━━━━\n💡 क्रियाएं:\n  📍 स्थिति टाइप करें (A1-E5)\n  💰 "cashout" टाइप करें निकालने के लिए\n  ❌ "quit" टाइप करें छोड़ने के लिए',
        usage: '💣 माइन्स गेम 💎\n\nकैसे खेलें:\n• .mines <दांव> <माइन्स>\n\nउदाहरण:\n• .mines 100 3 (आसान)\n• .mines 500 10 (मध्यम)\n• .mines 1000 20 (कठिन)\n\n📊 सेटिंग्स:\n• दांव: 10-1,000,000 सिक्के\n• माइन्स: 1-24 (अधिक = अधिक जोखिम/इनाम)\n\n🎮 गेमप्ले:\n1. दांव और माइन संख्या चुनें\n2. टाइल्स एक-एक करके खोलें\n3. प्रत्येक सुरक्षित टाइल गुणक बढ़ाती है\n4. जीतने के लिए कभी भी निकालें\n5. माइन हिट = सब कुछ खो दें\n\n💡 रणनीति:\n• कम माइन्स = अधिक सुरक्षित, कम गुणक\n• अधिक माइन्स = अधिक जोखिम, उच्च गुणक\n• गारंटीड लाभ के लिए जल्दी निकालें\n• बड़ी जीत के लिए जोखिम लें!\n\n🍀 भाग्य बूस्ट सुरक्षित टाइल की संभावना बढ़ाते हैं!',
        notEnough: '❌ पर्याप्त सिक्के नहीं!\n\n💰 आपका बैलेंस:',
        invalidBet: '❌ अमान्य दांव राशि!\n\n📊 सीमाएं:\n• न्यूनतम: 10 सिक्के\n• अधिकतम: 1,000,000 सिक्के',
        invalidMines: '❌ अमान्य माइन संख्या!\n\n💣 माइन्स: 1-24\n\n💡 सुझाव:\n• 1-5 माइन्स = आसान\n• 6-15 माइन्स = मध्यम\n• 16-24 माइन्स = कठिन',
        gameStarted: '🎮 गेम शुरू हुआ!\n\n💣 {mines} माइन्स ग्रिड में छिपी हैं\n💎 गुणक बढ़ाने के लिए टाइल्स खोलें\n💰 जीतने के लिए कभी भी निकालें!\n\n🍀 आपका भाग्य बूस्ट: +{luck}%',
        noGame: '❌ कोई सक्रिय गेम नहीं!\n\nशुरू करें: .mines <दांव> <माइन्स>',
        alreadyPlaying: '⚠️ आपके पास पहले से एक सक्रिय गेम है!\n\n"quit" टाइप करें छोड़ने के लिए या खेलते रहें.',
        invalidPosition: '❌ अमान्य स्थिति!\n\nप्रारूप उपयोग करें: A1, B3, E5, आदि.\nमान्य: A-E (कॉलम), 1-5 (पंक्तियां)',
        alreadyRevealed: '⚠️ पहले से खुला!\n\nएक अलग टाइल चुनें.',
        hitMine: '💥 बूम! आपने माइन हिट की! 💥\n\n💣 गेम ओवर!\n💸 खोया: {bet} सिक्के\n💰 बैलेंस: {balance} सिक्के\n\n😢 अगली बार बेहतर किस्मत!',
        safeTile: '✅ सुरक्षित! 💎\n\n📈 गुणक बढ़ा!\n💵 वर्तमान जीत: {win} सिक्के\n\n💡 जारी रखें या निकालें?',
        cashout: '💰 निकाला गया! 💰\n\n🎉 बधाई हो!\n💎 खोली गई टाइल्स: {revealed}\n📈 अंतिम गुणक: {multiplier}x\n💵 जीता: {win} सिक्के\n💰 नया बैलेंस: {balance} सिक्के\n\n🏆 बढ़िया काम!',
        allRevealed: '🎊 परफेक्ट गेम! 🎊\n\n💎 सभी सुरक्षित टाइल्स खोली गईं!\n🏆 अधिकतम गुणक!\n💵 जीता: {win} सिक्के\n💰 नया बैलेंस: {balance} सिक्के\n\n👑 महान!',
        quit: '🏳️ गेम छोड़ दिया\n\n💸 खोया: {bet} सिक्के\n💰 बैलेंस: {balance} सिक्के',
        stats: '\n\n📊 आपके आंकड़े:\n🎮 गेम्स: {games}\n🏆 जीत: {wins}\n💥 हार: {losses}\n💎 सर्वश्रेष्ठ स्ट्रीक: {bestStreak}\n📈 उच्चतम गुणक: {highestMultiplier}x\n💰 कुल जीता: {totalWon}\n💸 कुल हारा: {totalLost}\n📊 जीत दर: {winRate}%'
    },
    ng: {
        title: '💣 MINES GAME 💎',
        player: '👤',
        bet: '💰',
        mines: '💣',
        revealed: '💎',
        multiplier: '📈',
        potential: '💵',
        balance: '💰',
        actions: '\n━━━━━━━━━━━━━━━━━━━━━\n💡 Wetin You Fit Do:\n  📍 Type position (A1-E5)\n  💰 Type "cashout" make you collect\n  ❌ Type "quit" make you comot',
        usage: '💣 MINES GAME 💎\n\nHow To Play:\n• .mines <bet> <mines>\n\nExample:\n• .mines 100 3 (easy)\n• .mines 500 10 (medium)\n• .mines 1000 20 (hard)\n\n📊 Settings:\n• Bet: 10-1,000,000 coins\n• Mines: 1-24 (more = higher risk/reward)\n\n🎮 How E Dey Work:\n1. Choose bet and mine count\n2. Open tiles one by one\n3. Each safe tile go increase multiplier\n4. Cash out anytime make you win\n5. Hit mine = you don lose everything\n\n💡 Strategy:\n• Small mines = safer, small multipliers\n• Plenty mines = risky pass, big multipliers\n• Cash out early for sure profit\n• Risk am for massive wins!\n\n🍀 Luck boosts dey increase safe tile chance!',
        notEnough: '❌ Coins no reach!\n\n💰 Your balance:',
        invalidBet: '❌ Bet amount no correct!\n\n📊 Limits:\n• Minimum: 10 coins\n• Maximum: 1,000,000 coins',
        invalidMines: '❌ Mine count no correct!\n\n💣 Mines: 1-24\n\n💡 Tip:\n• 1-5 mines = Easy\n• 6-15 mines = Medium\n• 16-24 mines = Hard',
        gameStarted: '🎮 Game don start!\n\n💣 {mines} mines dey hide for grid\n💎 Open tiles make multiplier increase\n💰 Cash out anytime make you win!\n\n🍀 Your luck boost: +{luck}%',
        noGame: '❌ No active game!\n\nStart with: .mines <bet> <mines>',
        alreadyPlaying: '⚠️ You get active game already!\n\nType "quit" make you forfeit or continue play.',
        invalidPosition: '❌ Position no correct!\n\nUse format: A1, B3, E5, etc.\nValid: A-E (columns), 1-5 (rows)',
        alreadyRevealed: '⚠️ E don open already!\n\nChoose different tile.',
        hitMine: '💥 GBAM! YOU HIT MINE! 💥\n\n💣 Game Over!\n💸 You lose: {bet} coins\n💰 Balance: {balance} coins',
        safeTile: 'SAFE! 💎',
        cashout: '💰 YOU DON CASH OUT! 💰\n\n🎉 Congrats!\n💎 Tiles wey you open: {revealed}\n📈 Final multiplier: {multiplier}x\n💵 You win: {win} coins\n💰 New balance: {balance} coins',
        allRevealed: '🎊 PERFECT GAME! 🎊\n\n💎 ALL SAFE TILES DON OPEN!\n🏆 MAXIMUM MULTIPLIER!\n💵 You win: {win} coins\n💰 New balance: {balance} coins\n\n👑 LEGENDARY!',
        quit: '🏳️ Game don forfeit\n\n💸 You lose: {bet} coins\n💰 Balance: {balance} coins',
        stats: '\n\n📊 Your Stats:\n🎮 Games: {games}\n🏆 Wins: {wins}\n💥 Losses: {losses}\n💎 Best streak: {bestStreak}\n📈 Highest multiplier: {highestMultiplier}x\n💰 Total won: {totalWon}\n💸 Total lost: {totalLost}\n📊 Win rate: {winRate}%'
    }
};


// Update player statistics
function updateStats(userId, won, amount, multiplier, revealed) {
    const stats = loadStats();
    if (!stats[userId]) {
        stats[userId] = {
            games: 0,
            wins: 0,
            losses: 0,
            bestStreak: 0,
            currentStreak: 0,
            highestMultiplier: 0,
            totalWon: 0,
            totalLost: 0
        };
    }
    
    stats[userId].games++;
    
    if (won) {
        stats[userId].wins++;
        stats[userId].currentStreak++;
        stats[userId].totalWon += amount;
        if (stats[userId].currentStreak > stats[userId].bestStreak) {
            stats[userId].bestStreak = stats[userId].currentStreak;
        }
        if (multiplier > stats[userId].highestMultiplier) {
            stats[userId].highestMultiplier = multiplier;
        }
    } else {
        stats[userId].losses++;
        stats[userId].currentStreak = 0;
        stats[userId].totalLost += amount;
    }
    
    saveStats(stats);
    return stats[userId];
}

// Get player statistics
function getStats(userId) {
    const stats = loadStats();
    if (!stats[userId]) {
        return {
            games: 0,
            wins: 0,
            losses: 0,
            bestStreak: 0,
            highestMultiplier: 0,
            totalWon: 0,
            totalLost: 0,
            winRate: 0
        };
    }
    
    const winRate = stats[userId].games > 0 
        ? ((stats[userId].wins / stats[userId].games) * 100).toFixed(1)
        : 0;
    
    return {
        ...stats[userId],
        winRate
    };
}


// Main command export
export default {
    name: 'mines',
    aliases: ['mine', 'minesweeper'],
    description: 'Play Mines - reveal tiles, avoid bombs, cash out for multipliers!',
    
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const senderId = sender.split('@')[0];
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        // Check if player has an active game
        const gameKey = `${from}_${senderId}`;
        const existingGame = activeGames.get(gameKey);
        
        // Handle game actions (reveal, cashout, quit)
        if (existingGame) {
            const input = args[0]?.toLowerCase();
            
            // Quit game
            if (input === 'quit') {
                const balance = await getBalance(sender);
                activeGames.delete(gameKey);
                updateStats(senderId, false, existingGame.bet, 0, 0);
                
                return await sock.sendMessage(from, {
                    text: t.quit
                        .replace('{bet}', existingGame.bet.toLocaleString())
                        .replace('{balance}', balance.toLocaleString())
                });
            }
            
            // Cash out
            if (input === 'cashout') {
                const revealedCount = existingGame.revealed.filter(r => r).length;
                if (revealedCount === 0) {
                    return await sock.sendMessage(from, {
                        text: '❌ ' + (lang === 'en' ? 'Reveal at least one tile before cashing out!' : 
                              lang === 'it' ? 'Rivela almeno una tessera prima di incassare!' :
                              lang === 'ru' ? 'Откройте хотя бы одну плитку перед тем как забрать!' :
                              lang === 'es' ? '¡Revela al menos una casilla antes de cobrar!' :
                              lang === 'pt' ? 'Revele pelo menos um bloco antes de sacar!' :
                              lang === 'ar' ? 'اكشف مربعًا واحدًا على الأقل قبل السحب!' :
                              'कम से कम एक टाइल खोलें निकालने से पहले!')
                    });
                }
                
                const multiplier = calculateMultiplier(revealedCount, existingGame.mineCount);
                const coinMultiplier = getCoinMultiplier(senderId);
                const winAmount = Math.floor(existingGame.bet * multiplier * coinMultiplier);
                
                await addCoins(sender, winAmount);
                const newBalance = await getBalance(sender);
                activeGames.delete(gameKey);
                
                updateStats(senderId, true, winAmount - existingGame.bet, multiplier, revealedCount);
                const playerStats = getStats(senderId);
                
                // Check if all safe tiles revealed (perfect game)
                const safeTiles = 25 - existingGame.mineCount;
                if (revealedCount === safeTiles) {
                    return await sock.sendMessage(from, {
                        text: t.allRevealed
                            .replace('{win}', winAmount.toLocaleString())
                            .replace('{balance}', newBalance.toLocaleString()) +
                            t.stats
                                .replace('{games}', playerStats.games)
                                .replace('{wins}', playerStats.wins)
                                .replace('{losses}', playerStats.losses)
                                .replace('{bestStreak}', playerStats.bestStreak)
                                .replace('{highestMultiplier}', playerStats.highestMultiplier.toFixed(2))
                                .replace('{totalWon}', playerStats.totalWon.toLocaleString())
                                .replace('{totalLost}', playerStats.totalLost.toLocaleString())
                                .replace('{winRate}', playerStats.winRate)
                    });
                }
                
                return await sock.sendMessage(from, {
                    text: t.cashout
                        .replace('{revealed}', revealedCount)
                        .replace('{multiplier}', multiplier.toFixed(2))
                        .replace('{win}', winAmount.toLocaleString())
                        .replace('{balance}', newBalance.toLocaleString()) +
                        t.stats
                            .replace('{games}', playerStats.games)
                            .replace('{wins}', playerStats.wins)
                            .replace('{losses}', playerStats.losses)
                            .replace('{bestStreak}', playerStats.bestStreak)
                            .replace('{highestMultiplier}', playerStats.highestMultiplier.toFixed(2))
                            .replace('{totalWon}', playerStats.totalWon.toLocaleString())
                            .replace('{totalLost}', playerStats.totalLost.toLocaleString())
                            .replace('{winRate}', playerStats.winRate)
                });
            }
            
            // Reveal tile
            const position = args[0]?.toUpperCase();
            const index = positionToIndex(position);
            
            if (index === -1) {
                return await sock.sendMessage(from, {
                    text: t.invalidPosition
                });
            }
            
            if (existingGame.revealed[index]) {
                return await sock.sendMessage(from, {
                    text: t.alreadyRevealed
                });
            }
            
            // Reveal the tile
            existingGame.revealed[index] = true;
            
            // Check if hit mine
            if (existingGame.grid[index]) {
                const balance = await getBalance(sender);
                activeGames.delete(gameKey);
                updateStats(senderId, false, existingGame.bet, 0, 0);
                
                // Show final grid with mine
                const finalGrid = displayGrid(existingGame, lang);
                
                return await sock.sendMessage(from, {
                    text: t.title + '\n' + t.player + ' @' + senderId + '\n' +
                          finalGrid + '\n' +
                          t.hitMine
                              .replace('{bet}', existingGame.bet.toLocaleString())
                              .replace('{balance}', balance.toLocaleString()),
                    mentions: [sender]
                });
            }
            
            // Safe tile!
            const revealedCount = existingGame.revealed.filter(r => r).length;
            const multiplier = calculateMultiplier(revealedCount, existingGame.mineCount);
            const coinMultiplier = getCoinMultiplier(senderId);
            const potentialWin = Math.floor(existingGame.bet * multiplier * coinMultiplier);
            
            const grid = displayGrid(existingGame, lang);
            
            return await sock.sendMessage(from, {
                text: '✅ ' + t.safeTile.replace('{win}', potentialWin.toLocaleString()) + '\n\n' +
                      grid + '\n' +
                      t.multiplier + ' ' + multiplier.toFixed(2) + 'x | ' +
                      t.potential + ' ' + potentialWin.toLocaleString() + '\n\n' +
                      '💡 A1-E5 | cashout | quit',
                mentions: [sender]
            });
        }
        
        // Start new game
        if (args.length < 2) {
            return await sock.sendMessage(from, {
                text: t.usage
            });
        }
        
        // Parse bet amount
        let betAmount;
        if (args[0].toLowerCase() === 'all') {
            betAmount = await getBalance(sender);
        } else {
            betAmount = parseInt(args[0]);
        }
        
        // Validate bet
        if (isNaN(betAmount) || betAmount < 10 || betAmount > 1000000) {
            return await sock.sendMessage(from, {
                text: t.invalidBet
            });
        }
        
        // Check balance
        const balance = await getBalance(sender);
        if (balance < betAmount) {
            return await sock.sendMessage(from, {
                text: t.notEnough + ' ' + balance.toLocaleString()
            });
        }
        
        // Parse mine count
        const mineCount = parseInt(args[1]);
        if (isNaN(mineCount) || mineCount < 1 || mineCount > 24) {
            return await sock.sendMessage(from, {
                text: t.invalidMines
            });
        }
        
        // Deduct bet
        await removeCoins(sender, betAmount);
        
        // Create new game
        const grid = generateGrid(mineCount);
        const revealed = Array(25).fill(false);
        const luckBoost = getLuckBoost(senderId);
        
        const game = {
            bet: betAmount,
            mineCount,
            grid,
            revealed,
            startTime: Date.now()
        };
        
        activeGames.set(gameKey, game);
        
        const gridDisplay = displayGrid(game, lang);
        
        return await sock.sendMessage(from, {
            text: t.title + '\n' +
                  gridDisplay + '\n' +
                  t.bet + ' ' + betAmount.toLocaleString() + ' | ' +
                  t.mines + ' ' + mineCount + ' | ' +
                  t.multiplier + ' 1.00x\n\n' +
                  '💡 A1-E5 | cashout | quit',
            mentions: [sender]
        });
    }
};
