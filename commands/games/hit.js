import { getGroupLanguage } from '../../utils/language.js';
import { getBalance, addCoins } from '../../utils/bank_SAFE.js';

// Import activeGames from blackjack.js
import blackjackModule from './blackjack.js';
const activeGames = new Map();

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
    text += '```';
    
    return text;
}

async function endGame(sock, game, result, t) {
    const { groupJid, sender, bet, pushName } = game;
    const coins = game.lang === 'it' ? 'monete' : 'coins';
    
    let winAmount = 0;
    let resultText = '';
    
    if (result === 'win') {
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

const responses = {
    en: {
        noGame: '❌ No active game!\nStart: `.bj <bet>`',
        bust: '💥 BUST!',
        win: '🎊 YOU WIN',
        lose: '😢 YOU LOSE',
        push: '🤝 PUSH',
        won: 'Won:',
        lost: 'Lost:',
        balance: 'Balance:',
        bet: 'Bet:'
    },
    it: {
        noGame: '❌ Nessun gioco attivo!\nInizia: `.bj <puntata>`',
        bust: '💥 SBALLATO!',
        win: '🎊 HAI VINTO',
        lose: '😢 HAI PERSO',
        push: '🤝 PAREGGIO',
        won: 'Vinto:',
        lost: 'Perso:',
        balance: 'Saldo:',
        bet: 'Puntata:'
    }
};

export default {
    name: 'hit',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        
        // Get game from blackjack module's activeGames
        const game = blackjackModule.activeGames?.get(sender);
        
        if (!game) {
            const lang = getGroupLanguage(from);
            const t = responses[lang] || responses.en;
            return await sock.sendMessage(from, { text: t.noGame });
        }
        
        const lang = game.lang || 'en';
        const t = responses[lang] || responses.en;
        
        // Draw card
        const newCard = game.deck.pop();
        game.playerHand.push(newCard);
        
        const playerTotal = calculateHandValue(game.playerHand);
        
        if (playerTotal > 21) {
            // Bust
            await endGame(sock, game, 'lose', t);
        } else if (playerTotal === 21) {
            // Auto-stand on 21
            // Dealer plays
            while (calculateHandValue(game.dealerHand) < 17) {
                game.dealerHand.push(game.deck.pop());
            }
            
            const dealerTotal = calculateHandValue(game.dealerHand);
            
            if (dealerTotal > 21 || playerTotal > dealerTotal) {
                await endGame(sock, game, 'win', t);
            } else if (playerTotal < dealerTotal) {
                await endGame(sock, game, 'lose', t);
            } else {
                await endGame(sock, game, 'push', t);
            }
        } else {
            // Continue playing
            const gameText = displayGame(game, t, true) + '\n\n*Actions:*\n• `.hit` - Draw\n• `.stand` - Hold\n• `.double` - 2x bet';
            await sock.sendMessage(from, { text: gameText });
        }
    }
};
