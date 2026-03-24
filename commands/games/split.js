import { getGroupLanguage } from '../../utils/language.js';
import { getBalance, addCoins, removeCoins, hasEnough } from '../../utils/bank_SAFE.js';
import { activeGames } from '../../utils/blackjackGames.js';
import { canSplit, calculateHandValue } from './blackjack.js';

const responses = {
    en: {
        noGame: '❌ No active game!\nStart: `.bj <bet>`',
        notEnough: '❌ Not enough coins to split!\n💵 Balance:',
        cannotSplit: '❌ Can only split matching pairs!',
        win: '🎊 WIN',
        lose: '😢 LOSE',
        push: '🤝 PUSH',
        bust: '💥 BUST',
        won: 'Won:',
        lost: 'Lost:',
        balance: 'Balance:',
        bet: 'Bet:',
        hand: 'Hand'
    },
    it: {
        noGame: '❌ Nessun gioco attivo!\nInizia: `.bj <puntata>`',
        notEnough: '❌ Monete insufficienti per dividere!\n💵 Saldo:',
        cannotSplit: '❌ Puoi dividere solo coppie uguali!',
        win: '🎊 VINTO',
        lose: '😢 PERSO',
        push: '🤝 PAREGGIO',
        bust: '💥 SBALLATO',
        won: 'Vinto:',
        lost: 'Perso:',
        balance: 'Saldo:',
        bet: 'Puntata:',
        hand: 'Mano'
    }
};

function formatCard(card) {
    return `${card.rank}${card.suit}`;
}

function formatHand(cards) {
    return cards.map(formatCard).join(' ');
}

function displaySplitGame(game, t) {
    const { hand1, hand2, dealerHand, bet, pushName } = game;
    const hand1Total = calculateHandValue(hand1);
    const hand2Total = calculateHandValue(hand2);
    const dealerTotal = calculateHandValue(dealerHand);
    
    let text = '```\n';
    text += '━━━━━━━━━━━━━━━━━━━━━\n';
    text += '    🎰 BLACKJACK 🎰\n';
    text += '━━━━━━━━━━━━━━━━━━━━━\n\n';
    
    // Dealer
    text += `🎩 DEALER [${dealerTotal}]\n`;
    text += `   ${formatHand(dealerHand)}\n\n`;
    
    // Hand 1
    text += `👤 ${pushName} - ${t.hand} 1 [${hand1Total}]\n`;
    text += `   ${formatHand(hand1)}\n\n`;
    
    // Hand 2
    text += `👤 ${pushName} - ${t.hand} 2 [${hand2Total}]\n`;
    text += `   ${formatHand(hand2)}\n\n`;
    
    text += '━━━━━━━━━━━━━━━━━━━━━\n';
    text += `💰 ${t.bet} ${bet * 2}\n`;
    text += '```';
    
    return text;
}

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
        const coins = lang === 'it' ? 'monete' : 'coins';
        
        // Check if can split
        if (!canSplit(game.playerHand)) {
            return await sock.sendMessage(from, { text: t.cannotSplit });
        }
        
        // Check if player has enough coins
        if (!await hasEnough(sender, game.bet)) {
            const balance = await getBalance(sender);
            return await sock.sendMessage(from, { 
                text: `${t.notEnough} ${balance} ${coins}`
            });
        }
        
        // Charge for second hand
        await removeCoins(sender, game.bet);
        
        // Split the hands
        const hand1 = [game.playerHand[0], game.deck.pop()];
        const hand2 = [game.playerHand[1], game.deck.pop()];
        
        // Dealer plays
        while (calculateHandValue(game.dealerHand) < 17) {
            game.dealerHand.push(game.deck.pop());
        }
        
        const hand1Total = calculateHandValue(hand1);
        const hand2Total = calculateHandValue(hand2);
        const dealerTotal = calculateHandValue(game.dealerHand);
        
        // Calculate results for both hands
        let totalWinnings = 0;
        let hand1Result = '';
        let hand2Result = '';
        
        // Hand 1
        if (hand1Total > 21) {
            hand1Result = `${t.hand} 1: ${t.bust}`;
        } else if (dealerTotal > 21 || hand1Total > dealerTotal) {
            totalWinnings += game.bet * 2;
            hand1Result = `${t.hand} 1: ${t.win}`;
        } else if (hand1Total < dealerTotal) {
            hand1Result = `${t.hand} 1: ${t.lose}`;
        } else {
            totalWinnings += game.bet;
            hand1Result = `${t.hand} 1: ${t.push}`;
        }
        
        // Hand 2
        if (hand2Total > 21) {
            hand2Result = `${t.hand} 2: ${t.bust}`;
        } else if (dealerTotal > 21 || hand2Total > dealerTotal) {
            totalWinnings += game.bet * 2;
            hand2Result = `${t.hand} 2: ${t.win}`;
        } else if (hand2Total < dealerTotal) {
            hand2Result = `${t.hand} 2: ${t.lose}`;
        } else {
            totalWinnings += game.bet;
            hand2Result = `${t.hand} 2: ${t.push}`;
        }
        
        if (totalWinnings > 0) {
            await addCoins(sender, totalWinnings);
        }
        
        const netProfit = totalWinnings - (game.bet * 2);
        const sign = netProfit >= 0 ? '+' : '';
        const balance = await getBalance(sender);
        
        // Update game for display
        game.hand1 = hand1;
        game.hand2 = hand2;
        
        const finalText = displaySplitGame(game, t) + 
            `\n\n${hand1Result}\n${hand2Result}\n\n` +
            `💰 ${t.won} ${sign}${netProfit} ${coins}\n` +
            `💵 ${t.balance} ${balance} ${coins}`;
        
        await sock.sendMessage(from, { text: finalText });
        activeGames.delete(sender);
    }
};
