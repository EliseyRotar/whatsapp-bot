import { getGroupLanguage } from '../../utils/language.js';
import { getBalance, addCoins, removeCoins, hasEnough } from '../../utils/bank_SAFE.js';
import { activeGames } from '../../utils/blackjackGames.js';
import { displayGame, calculateHandValue } from './blackjack.js';

const responses = {
    en: {
        noGame: '❌ No active game!\nStart: `.bj <bet>`',
        notEnough: '❌ Not enough coins to double!\n💵 Balance:',
        cannotDouble: '❌ Can only double on first 2 cards!',
        win: '🎊 YOU WIN',
        lose: '😢 YOU LOSE',
        push: '🤝 PUSH',
        bust: '💥 BUST!',
        won: 'Won:',
        lost: 'Lost:',
        balance: 'Balance:',
        bet: 'Bet:'
    },
    it: {
        noGame: '❌ Nessun gioco attivo!\nInizia: `.bj <puntata>`',
        notEnough: '❌ Monete insufficienti per raddoppiare!\n💵 Saldo:',
        cannotDouble: '❌ Puoi raddoppiare solo con le prime 2 carte!',
        win: '🎊 HAI VINTO',
        lose: '😢 HAI PERSO',
        push: '🤝 PAREGGIO',
        bust: '💥 SBALLATO!',
        won: 'Vinto:',
        lost: 'Perso:',
        balance: 'Saldo:',
        bet: 'Puntata:'
    }
};

export default {
    name: 'double',
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
        
        // Can only double on first 2 cards
        if (game.playerHand.length !== 2) {
            return await sock.sendMessage(from, { text: t.cannotDouble });
        }
        
        // Check if player has enough coins
        if (!await hasEnough(sender, game.bet)) {
            const balance = await getBalance(sender);
            return await sock.sendMessage(from, { 
                text: `${t.notEnough} ${balance} ${coins}`
            });
        }
        
        // Double the bet
        await removeCoins(sender, game.bet);
        game.bet *= 2;
        
        // Draw exactly one card
        const newCard = game.deck.pop();
        game.playerHand.push(newCard);
        
        const playerTotal = calculateHandValue(game.playerHand);
        
        // Dealer plays
        while (calculateHandValue(game.dealerHand) < 17) {
            game.dealerHand.push(game.deck.pop());
        }
        
        const dealerTotal = calculateHandValue(game.dealerHand);
        
        let winAmount = 0;
        let resultText = '';
        
        if (playerTotal > 21) {
            resultText = `\n\n${t.bust}\n${t.lose}\n❌ ${t.lost} ${game.bet} ${coins}`;
        } else if (dealerTotal > 21 || playerTotal > dealerTotal) {
            winAmount = game.bet * 2;
            resultText = `\n\n${t.win}\n✅ ${t.won} ${game.bet} ${coins}`;
        } else if (playerTotal < dealerTotal) {
            resultText = `\n\n${t.lose}\n❌ ${t.lost} ${game.bet} ${coins}`;
        } else {
            winAmount = game.bet;
            resultText = `\n\n${t.push}\n↩️ ${t.won} 0 ${coins}`;
        }
        
        if (winAmount > 0) {
            await addCoins(sender, winAmount);
        }
        
        const balance = await getBalance(sender);
        const finalText = displayGame(game, t, false) + resultText + `\n💵 ${t.balance} ${balance} ${coins}`;
        
        await sock.sendMessage(from, { text: finalText });
        activeGames.delete(sender);
    }
};
