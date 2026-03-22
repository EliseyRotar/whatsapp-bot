import { getGroupLanguage } from '../../utils/language.js';
import { getBalance, removeCoins, hasEnough } from '../../utils/bank_SAFE.js';
import { activeGames } from '../../utils/blackjackGames.js';

function calculateHandValue(hand) {
    let total = 0, aces = 0;
    for (const card of hand) {
        if (card.rank === 'A') { aces++; total += 11; }
        else if (['J', 'Q', 'K'].includes(card.rank)) total += 10;
        else total += parseInt(card.rank);
    }
    while (total > 21 && aces > 0) { total -= 10; aces--; }
    return total;
}

function formatHand(hand) {
    return hand.map(card => `${card.rank}${card.suit}`).join('  ');
}

function getHandDisplay(hand, total, label) {
    const cards = formatHand(hand);
    let display = `${label}\n┌─────────────────┐\n│ ${cards}  │\n└─────────────────┘\n📊 Total: ${total}`;
    if (total === 21 && hand.length === 2) display += ' ⭐';
    else if (total > 21) display += ' 💥';
    else if (total >= 17) display += ' 🔥';
    return display;
}

function canSplit(hand) {
    if (hand.length !== 2) return false;
    const rank1 = hand[0].rank;
    const rank2 = hand[1].rank;
    if (rank1 === rank2) return true;
    const tenValues = ['10', 'J', 'Q', 'K'];
    return tenValues.includes(rank1) && tenValues.includes(rank2);
}

const responses = {
    en: {
        title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━',
        player: '👤 Player:',
        hand1: '👤 HAND 1',
        hand2: '👤 HAND 2',
        dealerCards: '🎩 DEALER',
        bet: '💰 Bet:',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Actions:\n  🃏 .hit - Draw card\n  ✋ .stand - Hold',
        playingHand: '🎯 Playing Hand',
        noGame: '❌ No active game!',
        cantSplit: '❌ Cannot split!\n\n• Can only split pairs\n• Can only split on first turn\n• Need matching cards',
        notEnough: '❌ Not enough coins to split!\n\nSplit requires same bet amount.',
        alreadySplit: '❌ Already split! Cannot split again.'
    },
    it: {
        title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━',
        player: '👤 Giocatore:',
        hand1: '👤 MANO 1',
        hand2: '👤 MANO 2',
        dealerCards: '🎩 DEALER',
        bet: '💰 Puntata:',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Azioni:\n  🃏 .hit - Pesca carta\n  ✋ .stand - Mantieni',
        playingHand: '🎯 Giocando Mano',
        noGame: '❌ Nessun gioco attivo!',
        cantSplit: '❌ Impossibile dividere!\n\n• Puoi dividere solo coppie\n• Puoi dividere solo al primo turno\n• Servono carte corrispondenti',
        notEnough: '❌ Monete insufficienti per dividere!\n\nDividere richiede la stessa puntata.',
        alreadySplit: '❌ Già diviso! Non puoi dividere di nuovo.'
    },
    ru: {
        title: '━━━━━ 🎰 БЛЭКДЖЕК 🎰 ━━━━━',
        player: '👤 Игрок:',
        hand1: '👤 РУКА 1',
        hand2: '👤 РУКА 2',
        dealerCards: '🎩 ДИЛЕР',
        bet: '💰 Ставка:',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Действия:\n  🃏 .hit - Взять карту\n  ✋ .stand - Остановиться',
        playingHand: '🎯 Играем Рукой',
        noGame: '❌ Нет активной игры!',
        cantSplit: '❌ Невозможно разделить!\n\n• Можно разделить только пары\n• Можно разделить только на первом ходу\n• Нужны совпадающие карты',
        notEnough: '❌ Недостаточно монет для разделения!\n\nРазделение требует такую же ставку.',
        alreadySplit: '❌ Уже разделено! Нельзя разделить снова.'
    },
    es: {
        title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━',
        player: '👤 Jugador:',
        hand1: '👤 MANO 1',
        hand2: '👤 MANO 2',
        dealerCards: '🎩 CRUPIER',
        bet: '💰 Apuesta:',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Acciones:\n  🃏 .hit - Pedir carta\n  ✋ .stand - Plantarse',
        playingHand: '🎯 Jugando Mano',
        noGame: '❌ ¡No hay juego activo!',
        cantSplit: '❌ ¡No puedes dividir!\n\n• Solo puedes dividir pares\n• Solo puedes dividir en el primer turno\n• Necesitas cartas coincidentes',
        notEnough: '❌ ¡No tienes suficientes monedas para dividir!\n\nDividir requiere la misma apuesta.',
        alreadySplit: '❌ ¡Ya dividiste! No puedes dividir de nuevo.'
    },
    pt: {
        title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━',
        player: '👤 Jogador:',
        hand1: '👤 MÃO 1',
        hand2: '👤 MÃO 2',
        dealerCards: '🎩 DEALER',
        bet: '💰 Aposta:',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Ações:\n  🃏 .hit - Pedir carta\n  ✋ .stand - Parar',
        playingHand: '🎯 Jogando Mão',
        noGame: '❌ Nenhum jogo ativo!',
        cantSplit: '❌ Não pode dividir!\n\n• Só pode dividir pares\n• Só pode dividir no primeiro turno\n• Precisa de cartas correspondentes',
        notEnough: '❌ Moedas insuficientes para dividir!\n\nDividir requer o mesmo valor de aposta.',
        alreadySplit: '❌ Já dividiu! Não pode dividir novamente.'
    },
    ar: {
        title: '━━━━━ 🎰 بلاك جاك 🎰 ━━━━━',
        player: '👤 اللاعب:',
        hand1: '👤 اليد 1',
        hand2: '👤 اليد 2',
        dealerCards: '🎩 الموزع',
        bet: '💰 الرهان:',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 الإجراءات:\n  🃏 .hit - اسحب ورقة\n  ✋ .stand - قف',
        playingHand: '🎯 بنلعب اليد',
        noGame: '❌ مفيش لعبة نشطة!',
        cantSplit: '❌ متقدرش تقسم!\n\n• تقدر تقسم الأزواج بس\n• تقدر تقسم في الدور الأول بس\n• محتاج أوراق متطابقة',
        notEnough: '❌ عملات مش كفاية للتقسيم!\n\nالتقسيم محتاج نفس قيمة الرهان.',
        alreadySplit: '❌ قسمت خلاص! متقدرش تقسم تاني.'
    },
    hi: {
        title: '━━━━━ 🎰 ब्लैकजैक 🎰 ━━━━━',
        player: '👤 खिलाड़ी:',
        hand1: '👤 हैंड 1',
        hand2: '👤 हैंड 2',
        dealerCards: '🎩 डीलर',
        bet: '💰 दांव:',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 एक्शन:\n  🃏 .hit - कार्ड लें\n  ✋ .stand - रुकें',
        playingHand: '🎯 हैंड खेल रहे हैं',
        noGame: '❌ कोई एक्टिव गेम नहीं!',
        cantSplit: '❌ स्प्लिट नहीं कर सकते!\n\n• केवल जोड़े स्प्लिट कर सकते हैं\n• केवल पहली बारी में स्प्लिट कर सकते हैं\n• मैचिंग कार्ड चाहिए',
        notEnough: '❌ स्प्लिट के लिए पर्याप्त कॉइन नहीं!\n\nस्प्लिट के लिए समान दांव राशि चाहिए।',
        alreadySplit: '❌ पहले से स्प्लिट किया! दोबारा स्प्लिट नहीं कर सकते।'
    },
    ng: {
        title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━',
        player: '👤 Player:',
        hand1: '👤 HAND 1',
        hand2: '👤 HAND 2',
        dealerCards: '🎩 DEALER',
        bet: '💰 Bet:',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Wetin You Fit Do:\n  🃏 .hit - Draw card\n  ✋ .stand - Hold',
        playingHand: '🎯 Playing Hand',
        noGame: '❌ No active game!',
        cantSplit: '❌ You no fit split!\n\n• You fit only split pairs\n• You fit only split for first turn\n• You need matching cards',
        notEnough: '❌ Coins no reach to split!\n\nSplit need same bet amount.',
        alreadySplit: '❌ You don split already! You no fit split again.'
    }
};

export default {
    name: 'split',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const game = activeGames.get(sender);
        
        if (!game) {
            const lang = getGroupLanguage(from);
            const t = responses[lang] || responses.en;
            return await sock.sendMessage(from, { text: t.noGame });
        }
        
        const lang = game.lang || 'en';
        const t = responses[lang] || responses.en;
        const coins = lang === 'it' ? 'monete' : lang === 'ru' ? 'монет' : lang === 'es' ? 'monedas' : lang === 'pt' ? 'moedas' : 'coins';
        
        // Check if already split
        if (game.splitHands) {
            return await sock.sendMessage(from, { text: t.alreadySplit });
        }
        
        // Check if can split
        if (game.turnCount > 0 || !canSplit(game.playerHand)) {
            return await sock.sendMessage(from, { text: t.cantSplit });
        }
        
        // Check if has enough coins
        if (!hasEnough(sender, game.bet)) {
            return await sock.sendMessage(from, { text: t.notEnough });
        }
        
        // Deduct additional bet
        await removeCoins(sender, game.bet);
        
        // Split the hand
        const card1 = game.playerHand[0];
        const card2 = game.playerHand[1];
        
        game.splitHands = {
            hand1: [card1, game.deck.pop()],
            hand2: [card2, game.deck.pop()],
            currentHand: 1,
            hand1Complete: false,
            hand2Complete: false
        };
        
        // Display both hands
        const hand1Total = calculateHandValue(game.splitHands.hand1);
        const hand2Total = calculateHandValue(game.splitHands.hand2);
        const dealerVisible = calculateHandValue([game.dealerHand[0]]);
        
        let gameText = `${t.title}\n${t.player} ${game.pushName}\n\n${t.bet} ${game.bet * 2} ${coins}\n\n`;
        gameText += `${t.playingHand} 1️⃣\n\n`;
        gameText += getHandDisplay(game.splitHands.hand1, hand1Total, t.hand1);
        gameText += '\n\n';
        gameText += getHandDisplay(game.splitHands.hand2, hand2Total, t.hand2);
        gameText += '\n\n';
        gameText += `${t.dealerCards}\n┌─────────────────┐\n│ ${game.dealerHand[0].rank}${game.dealerHand[0].suit}  🎴  │\n└─────────────────┘\n📊 Total: ${dealerVisible}+ (hidden)`;
        gameText += t.actions;
        
        await sock.sendMessage(from, { text: gameText });
    }
};
