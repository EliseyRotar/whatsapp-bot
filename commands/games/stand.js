import { getGroupLanguage } from '../../utils/language.js';
import { getBalance, addCoins } from '../../utils/bank_SAFE.js';
import { activeGames } from '../../utils/blackjackGames.js';
import { recordWin, recordLoss, recordPush } from '../../utils/blackjackStats.js';
import { getHandDisplay, getHandDisplayCompact } from '../../utils/cardDisplay.js';
import { getDealerMessage } from '../../utils/dealerMessages.js';

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
    return hand.map(card => `${card.rank}${card.suit}`).join(' ');
}

async function finishMultiHandGame(sock, game, sender, from, t, coins) {
    // Dealer draws
    while (calculateHandValue(game.dealerHand) < 17) {
        game.dealerHand.push(game.deck.pop());
    }
    
    const dealerTotal = calculateHandValue(game.dealerHand);
    let gameText = `${t.title}\n${t.player} ${game.pushName}\n\n${t.bet} ${game.bet * game.numHands} ${coins}\n\n`;
    
    let totalWinnings = 0;
    for (let i = 0; i < game.multiHands.length; i++) {
        const hand = game.multiHands[i];
        const handLabel = `HAND ${i + 1}`;
        gameText += getHandDisplay(hand.cards, hand.total, handLabel);
        gameText += ' - ';
        
        if (hand.total > 21) {
            gameText += `${t.bust}\n`;
            recordLoss(sender, game.bet, true);
        } else if (dealerTotal > 21 || hand.total > dealerTotal) {
            const winAmount = game.bet * 2;
            totalWinnings += winAmount;
            gameText += `${t.youWin}\n`;
            recordWin(sender, game.bet);
        } else if (hand.total < dealerTotal) {
            gameText += `${t.youLose}\n`;
            recordLoss(sender, game.bet);
        } else {
            totalWinnings += game.bet;
            gameText += `${t.push}\n`;
            recordPush(sender);
        }
    }
    
    gameText += '\n';
    gameText += getHandDisplay(game.dealerHand, dealerTotal, t.dealerCards);
    gameText += '\n\n━━━━━━━━━━━━━━━━━━━━━\n';
    
    if (totalWinnings > 0) {
        await addCoins(sender, totalWinnings);
        const netProfit = totalWinnings - (game.bet * game.numHands);
        const sign = netProfit >= 0 ? '+' : '';
        gameText += `${t.won} ${sign}${netProfit} ${coins}\n`;
    } else {
        gameText += `${t.lost} -${game.bet * game.numHands} ${coins}\n`;
    }
    
    gameText += `━━━━━━━━━━━━━━━━━━━━━\n\n${t.balance} ${await getBalance(sender)} ${coins}`;
    
    await sock.sendMessage(from, { text: gameText });
    activeGames.delete(sender);
}

const responses = {
    en: { 
        title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━', 
        player: '👤 Player:', 
        yourCards: '👤 YOUR CARDS', 
        hand1: '👤 HAND 1',
        hand2: '👤 HAND 2',
        dealerCards: '🎩 DEALER', 
        bet: '💰 Bet:', 
        bust: '💥 BUST!', 
        youWin: '🎊 YOU WIN! 🎊', 
        youLose: '😢 YOU LOSE', 
        push: '🤝 PUSH - TIE', 
        won: '✅ Won:', 
        lost: '❌ Lost:', 
        balance: '💵 Balance:', 
        noGame: '❌ No active game! Start with .bj <bet>',
        playingHand: '🎯 Playing Hand',
        totalWinnings: '💰 Total Winnings:'
    },
    it: { 
        title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━', 
        player: '👤 Giocatore:', 
        yourCards: '👤 LE TUE CARTE', 
        hand1: '👤 MANO 1',
        hand2: '👤 MANO 2',
        dealerCards: '🎩 DEALER', 
        bet: '💰 Puntata:', 
        bust: '💥 SBALLATO!', 
        youWin: '🎊 HAI VINTO! 🎊', 
        youLose: '😢 HAI PERSO', 
        push: '🤝 PAREGGIO', 
        won: '✅ Vinto:', 
        lost: '❌ Perso:', 
        balance: '💵 Saldo:', 
        noGame: '❌ Nessun gioco attivo! Inizia con .bj <puntata>',
        playingHand: '🎯 Giocando Mano',
        totalWinnings: '💰 Vincite Totali:'
    },
    ru: { 
        title: '━━━━━ 🎰 БЛЭКДЖЕК 🎰 ━━━━━', 
        player: '👤 Игрок:', 
        yourCards: '👤 ВАШИ КАРТЫ', 
        hand1: '👤 РУКА 1',
        hand2: '👤 РУКА 2',
        dealerCards: '🎩 ДИЛЕР', 
        bet: '💰 Ставка:', 
        bust: '💥 ПЕРЕБОР!', 
        youWin: '🎊 ВЫ ВЫИГРАЛИ! 🎊', 
        youLose: '😢 ВЫ ПРОИГРАЛИ', 
        push: '🤝 НИЧЬЯ', 
        won: '✅ Выиграно:', 
        lost: '❌ Проиграно:', 
        balance: '💵 Баланс:', 
        noGame: '❌ Нет активной игры! Начните с .bj <ставка>',
        playingHand: '🎯 Играем Рукой',
        totalWinnings: '💰 Общий Выигрыш:'
    },
    es: {
        title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━',
        player: '👤 Jugador:',
        yourCards: '👤 TUS CARTAS',
        hand1: '👤 MANO 1',
        hand2: '👤 MANO 2',
        dealerCards: '🎩 CRUPIER',
        bet: '💰 Apuesta:',
        bust: '💥 ¡TE PASASTE!',
        youWin: '🎊 ¡GANASTE! 🎊',
        youLose: '😢 PERDISTE',
        push: '🤝 EMPATE',
        won: '✅ Ganado:',
        lost: '❌ Perdido:',
        balance: '💵 Saldo:',
        noGame: '❌ ¡No hay juego activo! Inicia con .bj <apuesta>',
        playingHand: '🎯 Jugando Mano',
        totalWinnings: '💰 Ganancias Totales:'
    },
    pt: {
        title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━',
        player: '👤 Jogador:',
        yourCards: '👤 SUAS CARTAS',
        hand1: '👤 MÃO 1',
        hand2: '👤 MÃO 2',
        dealerCards: '🎩 DEALER',
        bet: '💰 Aposta:',
        bust: '💥 ESTOUROU!',
        youWin: '🎊 VOCÊ GANHOU! 🎊',
        youLose: '😢 VOCÊ PERDEU',
        push: '🤝 EMPATE',
        won: '✅ Ganho:',
        lost: '❌ Perdido:',
        balance: '💵 Saldo:',
        noGame: '❌ Nenhum jogo ativo! Inicie com .bj <aposta>',
        playingHand: '🎯 Jogando Mão',
        totalWinnings: '💰 Ganhos Totais:'
    },
    ar: {
        title: '━━━━━ 🎰 بلاك جاك 🎰 ━━━━━',
        player: '👤 اللاعب:',
        yourCards: '👤 أوراقك',
        hand1: '👤 اليد 1',
        hand2: '👤 اليد 2',
        dealerCards: '🎩 الموزع',
        bet: '💰 الرهان:',
        bust: '💥 انفجرت!',
        youWin: '🎊 انت كسبت! 🎊',
        youLose: '😢 انت خسرت',
        push: '🤝 تعادل',
        won: '✅ كسبت:',
        lost: '❌ خسرت:',
        balance: '💵 الرصيد:',
        noGame: '❌ مفيش لعبة نشطة! ابدأ بـ .bj <رهان>',
        playingHand: '🎯 بنلعب اليد',
        totalWinnings: '💰 إجمالي الأرباح:'
    },
    hi: {
        title: '━━━━━ 🎰 ब्लैकजैक 🎰 ━━━━━',
        player: '👤 खिलाड़ी:',
        yourCards: '👤 आपके कार्ड',
        hand1: '👤 हैंड 1',
        hand2: '👤 हैंड 2',
        dealerCards: '🎩 डीलर',
        bet: '💰 दांव:',
        bust: '💥 बस्ट!',
        youWin: '🎊 आप जीते! 🎊',
        youLose: '😢 आप हारे',
        push: '🤝 टाई',
        won: '✅ जीता:',
        lost: '❌ हारा:',
        balance: '💵 बैलेंस:',
        noGame: '❌ कोई एक्टिव गेम नहीं! शुरू करें .bj <दांव>',
        playingHand: '🎯 हैंड खेल रहे हैं',
        totalWinnings: '💰 कुल जीत:'
    },
    ng: {
        title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━',
        player: '👤 Player:',
        yourCards: '👤 YOUR CARDS',
        hand1: '👤 HAND 1',
        hand2: '👤 HAND 2',
        dealerCards: '🎩 DEALER',
        bet: '💰 Bet:',
        bust: '💥 BUST!',
        youWin: '🎊 YOU WIN! 🎊',
        youLose: '😢 YOU LOSE',
        push: '🤝 PUSH - TIE',
        won: '✅ You win:',
        lost: '❌ You lose:',
        balance: '💵 Balance:',
        noGame: '❌ No active game! Start with .bj <bet>',
        playingHand: '🎯 Playing Hand',
        totalWinnings: '💰 Total Winnings:'
    }
};

// Old display functions removed - now using cardDisplay.js

async function finishSplitGame(sock, game, sender, from, t, coins) {
    while (calculateHandValue(game.dealerHand) < 17) {
        game.dealerHand.push(game.deck.pop());
    }
    
    const dealerTotal = calculateHandValue(game.dealerHand);
    const hand1Total = calculateHandValue(game.splitHands.hand1);
    const hand2Total = calculateHandValue(game.splitHands.hand2);
    
    let gameText = `${t.title}\n${t.player} ${game.pushName || 'Player'}\n\n${t.bet} ${game.bet * 2} ${coins}\n\n`;
    gameText += getHandDisplay(game.splitHands.hand1, hand1Total, t.hand1);
    gameText += '\n\n';
    gameText += getHandDisplay(game.splitHands.hand2, hand2Total, t.hand2);
    gameText += '\n\n';
    gameText += getHandDisplay(game.dealerHand, dealerTotal, t.dealerCards);
    gameText += '\n\n━━━━━━━━━━━━━━━━━━━━━\n';
    
    let totalWinnings = 0;
    
    // Calculate Hand 1 result
    if (hand1Total > 21) {
        gameText += `${t.hand1}: ${t.bust} ${t.youLose}\n`;
        totalWinnings -= game.bet;
    } else if (dealerTotal > 21 || hand1Total > dealerTotal) {
        gameText += `${t.hand1}: ${t.youWin}\n`;
        totalWinnings += game.bet * 2;
    } else if (hand1Total < dealerTotal) {
        gameText += `${t.hand1}: ${t.youLose}\n`;
        totalWinnings -= game.bet;
    } else {
        gameText += `${t.hand1}: ${t.push}\n`;
    }
    
    // Calculate Hand 2 result
    if (hand2Total > 21) {
        gameText += `${t.hand2}: ${t.bust} ${t.youLose}\n`;
        totalWinnings -= game.bet;
    } else if (dealerTotal > 21 || hand2Total > dealerTotal) {
        gameText += `${t.hand2}: ${t.youWin}\n`;
        totalWinnings += game.bet * 2;
    } else if (hand2Total < dealerTotal) {
        gameText += `${t.hand2}: ${t.youLose}\n`;
        totalWinnings -= game.bet;
    } else {
        gameText += `${t.hand2}: ${t.push}\n`;
    }
    
    await addCoins(sender, totalWinnings + (game.bet * 2));
    
    const sign = totalWinnings >= 0 ? '+' : '';
    gameText += `\n${t.totalWinnings} ${sign}${totalWinnings} ${coins}`;
    gameText += `\n━━━━━━━━━━━━━━━━━━━━━\n\n${t.balance} ${await getBalance(sender)} ${coins}`;
    
    await sock.sendMessage(from, { text: gameText });
    activeGames.delete(sender);
}

export default {
    name: 'stand',
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
        
        // Handle multi-hand games
        if (game.multiHands) {
            const currentHandIndex = game.currentHandIndex;
            game.multiHands[currentHandIndex].status = 'complete';
            
            // Find next active hand
            let nextHandIndex = -1;
            for (let i = 0; i < game.multiHands.length; i++) {
                if (game.multiHands[i].status === 'active') {
                    nextHandIndex = i;
                    break;
                }
            }
            
            // If no more active hands, finish game
            if (nextHandIndex === -1) {
                await finishMultiHandGame(sock, game, sender, from, t, coins);
                return;
            }
            
            // Switch to next hand
            game.currentHandIndex = nextHandIndex;
            
            // Display all hands
            let gameText = `${t.title}\n${t.player} ${game.pushName}\n\n${t.bet} ${game.bet * game.numHands} ${coins}\n\n`;
            
            for (let i = 0; i < game.multiHands.length; i++) {
                const hand = game.multiHands[i];
                const isActive = i === nextHandIndex;
                const label = isActive ? `▶️ HAND ${i + 1}` : 
                             hand.status !== 'active' ? `✅ HAND ${i + 1}` : 
                             `HAND ${i + 1}`;
                
                gameText += getHandDisplay(hand.cards, hand.total, label);
                gameText += '\n\n';
            }
            
            const dealerVisible = calculateHandValue([game.dealerHand[0]]);
            gameText += getHandDisplay(game.dealerHand, dealerVisible, t.dealerCards, true);
            gameText += '\n\n💡 Actions:\n  🃏 .hit - Draw card\n  ✋ .stand - Hold';
            
            await sock.sendMessage(from, { text: gameText });
            return;
        }
        
        // Handle split hands
        if (game.splitHands) {
            const currentHand = game.splitHands.currentHand;
            game.splitHands[`hand${currentHand}Complete`] = true;
            
            // Check if both hands are complete
            if (game.splitHands.hand1Complete && game.splitHands.hand2Complete) {
                await finishSplitGame(sock, game, sender, from, t, coins);
            } else {
                // Switch to next hand
                game.splitHands.currentHand = currentHand === 1 ? 2 : 1;
                
                const hand1Total = calculateHandValue(game.splitHands.hand1);
                const hand2Total = calculateHandValue(game.splitHands.hand2);
                const dealerVisible = calculateHandValue([game.dealerHand[0]]);
                
                let gameText = `${t.title}\n${t.player} ${game.pushName || 'Player'}\n\n${t.bet} ${game.bet * 2} ${coins}\n\n`;
                gameText += `${t.playingHand} ${game.splitHands.currentHand}️⃣\n\n`;
                
                // Display hand 1 with highlight if active
                gameText += getHandDisplay(game.splitHands.hand1, hand1Total, game.splitHands.currentHand === 1 ? `${t.hand1} ⬅️` : t.hand1);
                gameText += '\n\n';
                
                // Display hand 2 with highlight if active
                gameText += getHandDisplay(game.splitHands.hand2, hand2Total, game.splitHands.currentHand === 2 ? `${t.hand2} ⬅️` : t.hand2);
                gameText += '\n\n';
                
                const dealerCards = `${game.dealerHand[0].rank}${game.dealerHand[0].suit}  🎴`;
                gameText += `${t.dealerCards}\n┌─────────────────┐\n│ ${dealerCards}  │\n└─────────────────┘\n📊 Total: ${dealerVisible}+ (hidden)`;
                
                gameText += '\n\n💡 Actions:\n  🃏 .hit - Draw card\n  ✋ .stand - Hold';
                await sock.sendMessage(from, { text: gameText });
            }
            return;
        }
        
        // Regular (non-split) game logic
        const playerTotal = calculateHandValue(game.playerHand);
        
        // Dealer draws cards if needed
        let dealerTotal = calculateHandValue(game.dealerHand);
        while (dealerTotal < 17) {
            game.dealerHand.push(game.deck.pop());
            dealerTotal = calculateHandValue(game.dealerHand);
        }
        
        let gameText = `${t.title}\n${t.player} ${game.pushName || 'Player'}\n\n${t.bet} ${game.bet} ${coins}\n\n`;
        gameText += getHandDisplay(game.playerHand, playerTotal, t.yourCards);
        gameText += '\n\n';
        gameText += getHandDisplay(game.dealerHand, dealerTotal, t.dealerCards);
        gameText += '\n\n━━━━━━━━━━━━━━━━━━━━━\n';
        
        if (dealerTotal > 21) {
            const winAmount = game.bet * 2;
            await addCoins(sender, winAmount);
            recordWin(sender, game.bet);
            const bustMsg = getDealerMessage('dealerBust', lang);
            gameText += `${bustMsg}\n${t.bust}\n${t.youWin}\n${t.won} +${winAmount} ${coins}`;
        } else if (playerTotal > dealerTotal) {
            const winAmount = game.bet * 2;
            await addCoins(sender, winAmount);
            recordWin(sender, game.bet);
            const winMsg = getDealerMessage('playerWin', lang);
            gameText += `${winMsg}\n${t.youWin}\n${t.won} +${winAmount} ${coins}`;
        } else if (playerTotal < dealerTotal) {
            recordLoss(sender, game.bet);
            const loseMsg = getDealerMessage('dealerWin', lang);
            gameText += `${loseMsg}\n${t.youLose}\n${t.lost} -${game.bet} ${coins}`;
        } else {
            await addCoins(sender, game.bet);
            recordPush(sender);
            const pushMsg = getDealerMessage('push', lang);
            gameText += `${pushMsg}\n${t.push}`;
        }
        
        gameText += `\n━━━━━━━━━━━━━━━━━━━━━\n\n${t.balance} ${await getBalance(sender)} ${coins}`;
        await sock.sendMessage(from, { text: gameText });
        activeGames.delete(sender);
    }
};
