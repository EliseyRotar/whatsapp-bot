import { getGroupLanguage } from '../../utils/language.js';
import { getBalance, addCoins, removeCoins, hasEnough } from '../../utils/bank_SAFE.js';
import { validateAmount, secureShuffle } from '../../utils/securityEnhancements.js';

// Active games storage
const activeGames = new Map();

// Cleanup old games (30 minutes timeout)
setInterval(() => {
    const now = Date.now();
    for (const [userId, game] of activeGames.entries()) {
        if (now - game.startTime > 1800000) {
            activeGames.delete(userId);
        }
    }
}, 300000);

const responses = {
    en: {
        usage: '```🎰 BLACKJACK 🎰```\n\n*Start:* `.bj <bet>`\n*Example:* `.bj 100`\n\n*Actions:*\n• `.hit` - Draw card\n• `.stand` - Hold\n• `.double` - Double bet\n• `.split` - Split pairs\n\n*Bet:* 10-1M coins\n*Blackjack pays 2.5x!*',
        notEnough: '❌ Not enough coins!\n💵 Balance:',
        invalidBet: '❌ Invalid bet!\n💰 Min: 10 | Max: 1,000,000',
        noGame: '❌ No active game!\nStart: `.bj <bet>`',
        alreadyPlaying: '⚠️ Game in progress!',
        blackjack: '🎉 BLACKJACK!',
        bust: '💥 BUST!',
        win: '🎊 YOU WIN',
        lose: '😢 YOU LOSE',
        push: '🤝 PUSH',
        dealerTurn: '🎩 Dealer plays...',
        won: 'Won:',
        lost: 'Lost:',
        balance: 'Balance:',
        bet: 'Bet:'
    },
    it: {
        usage: '```🎰 BLACKJACK 🎰```\n\n*Inizia:* `.bj <puntata>`\n*Esempio:* `.bj 100`\n\n*Azioni:*\n• `.hit` - Pesca carta\n• `.stand` - Mantieni\n• `.double` - Raddoppia\n• `.split` - Dividi\n\n*Puntata:* 10-1M monete\n*Blackjack paga 2.5x!*',
        notEnough: '❌ Monete insufficienti!\n💵 Saldo:',
        invalidBet: '❌ Puntata non valida!\n💰 Min: 10 | Max: 1.000.000',
        noGame: '❌ Nessun gioco attivo!\nInizia: `.bj <puntata>`',
        alreadyPlaying: '⚠️ Gioco in corso!',
        blackjack: '🎉 BLACKJACK!',
        bust: '💥 SBALLATO!',
        win: '🎊 HAI VINTO',
        lose: '😢 HAI PERSO',
        push: '🤝 PAREGGIO',
        dealerTurn: '🎩 Dealer gioca...',
        won: 'Vinto:',
        lost: 'Perso:',
        balance: 'Saldo:',
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

function canSplit(hand) {
    if (hand.length !== 2) return false;
    const rank1 = hand[0].rank;
    const rank2 = hand[1].rank;
    if (rank1 === rank2) return true;
    const tenValues = ['10', 'J', 'Q', 'K'];
    return tenValues.includes(rank1) && tenValues.includes(rank2);
}

function displayGame(game, t, hideDealer = true) {
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
    text += '```\n';
    
    // Actions
    if (hideDealer) {
        text += '\n*Actions:*\n';
        text += '• `.hit` - Draw\n';
        text += '• `.stand` - Hold\n';
        text += '• `.double` - 2x bet\n';
        if (canSplit(playerHand) && playerHand.length === 2) {
            text += '• `.split` - Split pair';
        }
    }
    
    return text;
}

async function endGame(sock, game, result, t) {
    const { groupJid, sender, bet, pushName } = game;
    const coins = game.lang === 'it' ? 'monete' : 'coins';
    
    let winAmount = 0;
    let resultText = '';
    
    if (result === 'blackjack') {
        winAmount = Math.floor(bet * 2.5);
        resultText = `\n\n${t.blackjack}\n✅ ${t.won} ${winAmount} ${coins}`;
    } else if (result === 'win') {
        winAmount = bet * 2;
        resultText = `\n\n${t.win}\n✅ ${t.won} ${bet} ${coins}`;
    } else if (result === 'push') {
        winAmount = bet;
        resultText = `\n\n${t.push}\n↩️ ${t.won} 0 ${coins}`;
    } else {
        resultText = `\n\n${t.lose}\n❌ ${t.lost} ${bet} ${coins}`;
    }
    
    if (winAmount > 0) {
        await addCoins(sender, winAmount);
    }
    
    const balance = await getBalance(sender);
    const finalText = displayGame(game, t, false) + resultText + `\n💵 ${t.balance} ${balance} ${coins}`;
    
    await sock.sendMessage(groupJid, { text: finalText });
    activeGames.delete(sender);
}

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
            await endGame(sock, game, 'push', t);
            return;
        }
        
        if (playerTotal === 21) {
            await endGame(sock, game, 'blackjack', t);
            return;
        }
        
        if (dealerTotal === 21) {
            await endGame(sock, game, 'lose', t);
            return;
        }
        
        activeGames.set(sender, game);
        
        const gameText = displayGame(game, t, true);
        await sock.sendMessage(from, { text: gameText });
    }
};
