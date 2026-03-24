import { getGroupLanguage } from '../../utils/language.js';
import { getBalance, addCoins, removeCoins, hasEnough } from '../../utils/bank_SAFE.js';
import { validateAmount, secureShuffle } from '../../utils/securityEnhancements.js';
import { activeGames } from '../../utils/blackjackGames.js';

const responses = {
    en: {
        usage: '```🎰 BLACKJACK 🎰```\n\n*Start:* `.bj <bet>`\n*Example:* `.bj 100`\n\n*Actions:*\n• `.hit` - Draw card\n• `.stand` - Hold\n• `.double` - Double bet\n• `.split` - Split pairs\n\n*Bet:* 10-1M coins\n*Blackjack pays 2.5x!*',
        notEnough: '❌ Not enough coins!\n💵 Balance:',
        invalidBet: '❌ Invalid bet!\n💰 Min: 10 | Max: 1,000,000',
        alreadyPlaying: '⚠️ Game in progress!',
        bet: 'Bet:'
    },
    it: {
        usage: '```🎰 BLACKJACK 🎰```\n\n*Inizia:* `.bj <puntata>`\n*Esempio:* `.bj 100`\n\n*Azioni:*\n• `.hit` - Pesca carta\n• `.stand` - Mantieni\n• `.double` - Raddoppia\n• `.split` - Dividi\n\n*Puntata:* 10-1M monete\n*Blackjack paga 2.5x!*',
        notEnough: '❌ Monete insufficienti!\n💵 Saldo:',
        invalidBet: '❌ Puntata non valida!\n💰 Min: 10 | Max: 1.000.000',
        alreadyPlaying: '⚠️ Gioco in corso!',
        bet: 'Puntata:'
    }
};

const suits = ['♠', '♥', '♣', '♦'];
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function createDeck() {
    const deck = [];
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({ rank, suit });
        }
    }
    return secureShuffle(deck);
}

function calculateHandValue(hand) {
    let total = 0;
    let aces = 0;
    
    for (const card of hand) {
        if (card.rank === 'A') {
            aces++;
            total += 11;
        } else if (['J', 'Q', 'K'].includes(card.rank)) {
            total += 10;
        } else {
            total += parseInt(card.rank);
        }
    }
    
    while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
    }
    
    return total;
}

function formatCard(card) {
    return `${card.rank}${card.suit}`;
}

function formatHand(cards) {
    return cards.map(formatCard).join(' ');
}

export function displayGame(game, t, hideDealer = true) {
    const { playerHand, dealerHand, bet, pushName } = game;
    const playerTotal = calculateHandValue(playerHand);
    const dealerTotal = hideDealer ? calculateHandValue([dealerHand[0]]) : calculateHandValue(dealerHand);
    
    let text = '```\n';
    text += '━━━━━━━━━━━━━━━━━━━━━\n';
    text += '    🎰 BLACKJACK 🎰\n';
    text += '━━━━━━━━━━━━━━━━━━━━━\n\n';
    
    // Dealer
    text += '🎩 DEALER';
    if (hideDealer) {
        text += ` [${calculateHandValue([dealerHand[0]])}]\n`;
        text += `   ${formatCard(dealerHand[0])} 🎴\n\n`;
    } else {
        text += ` [${dealerTotal}]\n`;
        text += `   ${formatHand(dealerHand)}\n\n`;
    }
    
    // Player
    text += `👤 ${pushName} [${playerTotal}]\n`;
    text += `   ${formatHand(playerHand)}\n\n`;
    
    text += '━━━━━━━━━━━━━━━━━━━━━\n';
    text += `💰 ${t.bet} ${bet}\n`;
    text += '```';
    
    return text;
}

export function canSplit(hand) {
    if (hand.length !== 2) return false;
    const rank1 = hand[0].rank;
    const rank2 = hand[1].rank;
    if (rank1 === rank2) return true;
    const tenValues = ['10', 'J', 'Q', 'K'];
    return tenValues.includes(rank1) && tenValues.includes(rank2);
}

export { calculateHandValue };

export default {
    name: 'blackjack',
    aliases: ['bj'],
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const pushName = msg.pushName || 'Player';
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        const coins = lang === 'it' ? 'monete' : 'coins';
        
        if (activeGames.has(sender)) {
            return await sock.sendMessage(from, { text: t.alreadyPlaying });
        }
        
        if (args.length === 0) {
            return await sock.sendMessage(from, { text: t.usage });
        }
        
        const betInput = args[0].toLowerCase() === 'bet' && args[1] ? args[1] : args[0];
        let bet = parseInt(betInput);
        
        // Handle "all" bet
        if (betInput === 'all') {
            bet = await getBalance(sender);
        }
        
        const validation = validateAmount(bet, 10, 1000000);
        if (!validation.valid) {
            return await sock.sendMessage(from, { text: t.invalidBet });
        }
        bet = validation.amount;
        
        if (!await hasEnough(sender, bet)) {
            const balance = await getBalance(sender);
            return await sock.sendMessage(from, { 
                text: `${t.notEnough} ${balance} ${coins}`
            });
        }
        
        await removeCoins(sender, bet);
        
        const deck = createDeck();
        const playerHand = [deck.pop(), deck.pop()];
        const dealerHand = [deck.pop(), deck.pop()];
        
        const game = {
            bet,
            deck,
            playerHand,
            dealerHand,
            groupJid: from,
            sender,
            lang,
            pushName,
            startTime: Date.now()
        };
        
        // Check for immediate blackjack
        const playerTotal = calculateHandValue(playerHand);
        const dealerTotal = calculateHandValue(dealerHand);
        
        if (playerTotal === 21 && dealerTotal === 21) {
            // Push
            await addCoins(sender, bet);
            const pushText = displayGame(game, t, false) + '\n\n🤝 PUSH\n↩️ Won: 0 ' + coins;
            await sock.sendMessage(from, { text: pushText });
            return;
        }
        
        if (playerTotal === 21) {
            // Player blackjack
            const winAmount = Math.floor(bet * 2.5);
            await addCoins(sender, winAmount);
            const balance = await getBalance(sender);
            const bjText = displayGame(game, t, false) + `\n\n🎉 BLACKJACK!\n✅ Won: ${Math.floor(bet * 1.5)} ${coins}\n💵 Balance: ${balance} ${coins}`;
            await sock.sendMessage(from, { text: bjText });
            return;
        }
        
        if (dealerTotal === 21) {
            // Dealer blackjack
            const balance = await getBalance(sender);
            const loseText = displayGame(game, t, false) + `\n\n😢 DEALER BLACKJACK\n❌ Lost: ${bet} ${coins}\n💵 Balance: ${balance} ${coins}`;
            await sock.sendMessage(from, { text: loseText });
            return;
        }
        
        activeGames.set(sender, game);
        
        let gameText = displayGame(game, t, true);
        gameText += '\n\n*Actions:*\n• `.hit` - Draw\n• `.stand` - Hold\n• `.double` - 2x bet';
        if (canSplit(playerHand)) {
            gameText += '\n• `.split` - Split pair';
        }
        
        await sock.sendMessage(from, { text: gameText });
    }
};
