import { getGroupLanguage } from '../../utils/language.js';
import { getBalance, addCoins } from '../../utils/bank_SAFE.js';
import { activeGames } from '../../utils/blackjackGames.js';
import { displayGame, calculateHandValue, canSplit } from './blackjack.js';

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

export default {
    name: 'hit',
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
        
        // Draw card
        const newCard = game.deck.pop();
        game.playerHand.push(newCard);
        
        const playerTotal = calculateHandValue(game.playerHand);
        
        if (playerTotal > 21) {
            // Bust
            await endGame(sock, game, 'lose', t);
        } else if (playerTotal === 21) {
            // Auto-stand on 21
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
            let gameText = displayGame(game, t, true);
            gameText += '\n\n*Actions:*\n• `.hit` - Draw\n• `.stand` - Hold\n• `.double` - 2x bet';
            if (canSplit(game.playerHand)) {
                gameText += '\n• `.split` - Split pair';
            }
            await sock.sendMessage(from, { text: gameText });
        }
    }
};
