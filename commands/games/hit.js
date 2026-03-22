import { getGroupLanguage } from '../../utils/language.js';
import { getBalance, addCoins } from '../../utils/bank_SAFE.js';
import { activeGames } from '../../utils/blackjackGames.js';
import { recordWin, recordLoss, recordPush } from '../../utils/blackjackStats.js';
import { getHandDisplay, getHandDisplayCompact } from '../../utils/cardDisplay.js';
import { getDealerMessage } from '../../utils/dealerMessages.js';

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

// Old display functions removed - now using cardDisplay.js

function dealerShouldHit(hand) {
    return calculateHandValue(hand) < 17;
}

async function finishGame(sock, game, sender, from, t, coins) {
    const playerTotal = calculateHandValue(game.playerHand);
    
    while (dealerShouldHit(game.dealerHand)) {
        game.dealerHand.push(game.deck.pop());
    }
    
    const dealerTotal = calculateHandValue(game.dealerHand);
    
    let gameText = `${t.title}\n${t.player} ${game.pushName || 'Player'}\n\n${t.bet} ${game.bet} ${coins}\n\n`;
    gameText += getHandDisplay(game.playerHand, playerTotal, t.yourCards);
    gameText += '\n\n';
    gameText += getHandDisplay(game.dealerHand, dealerTotal, t.dealerCards);
    gameText += '\n\n';
    
    if (playerTotal > 21) {
        recordLoss(sender, game.bet, true);
        gameText += `━━━━━━━━━━━━━━━━━━━━━\n${t.bust}\n${t.youLose}\n${t.lost} -${game.bet} ${coins}\n━━━━━━━━━━━━━━━━━━━━━`;
    } else if (dealerTotal > 21) {
        const winAmount = game.bet * 2;
        await addCoins(sender, winAmount);
        recordWin(sender, game.bet);
        gameText += `━━━━━━━━━━━━━━━━━━━━━\n${t.dealerTurn}\n${t.bust}\n${t.youWin}\n${t.won} +${winAmount} ${coins}\n━━━━━━━━━━━━━━━━━━━━━`;
    } else if (playerTotal > dealerTotal) {
        const winAmount = game.bet * 2;
        await addCoins(sender, winAmount);
        recordWin(sender, game.bet);
        gameText += `━━━━━━━━━━━━━━━━━━━━━\n${t.youWin}\n${t.won} +${winAmount} ${coins}\n━━━━━━━━━━━━━━━━━━━━━`;
    } else if (playerTotal < dealerTotal) {
        recordLoss(sender, game.bet);
        gameText += `━━━━━━━━━━━━━━━━━━━━━\n${t.youLose}\n${t.lost} -${game.bet} ${coins}\n━━━━━━━━━━━━━━━━━━━━━`;
    } else {
        await addCoins(sender, game.bet);
        recordPush(sender);
        gameText += `━━━━━━━━━━━━━━━━━━━━━\n${t.push}\n━━━━━━━━━━━━━━━━━━━━━`;
    }
    
    gameText += `\n\n${t.balance} ${await getBalance(sender)} ${coins}`;
    
    await sock.sendMessage(from, { text: gameText });
    activeGames.delete(sender);
}

async function finishSplitGame(sock, game, sender, from, t, coins) {
    while (dealerShouldHit(game.dealerHand)) {
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

const responses = {
    en: {
        title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━',
        player: '👤 Player:',
        yourCards: '👤 YOUR CARDS',
        hand1: '👤 HAND 1',
        hand2: '👤 HAND 2',
        dealerCards: '🎩 DEALER',
        bet: '💰 Bet:',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Actions:\n  🃏 .hit - Draw card\n  ✋ .stand - Hold\n  💰 .double - Double down',
        dealerTurn: '🎩 Dealer\'s turn...',
        blackjack: '🎉 ★ BLACKJACK! ★ 🎉',
        bust: '💥 BUST! Over 21!',
        youWin: '🎊 YOU WIN! 🎊',
        youLose: '😢 YOU LOSE',
        push: '🤝 PUSH - TIE',
        won: '✅ Won:',
        lost: '❌ Lost:',
        balance: '💵 Balance:',
        noGame: '❌ No active game! Start with .bj <bet>',
        playingHand: '🎯 Playing Hand',
        totalWinnings: '💰 Total Winnings:',
        currentHand: '▶️ HAND',
        completedHand: '✅ HAND'
    },
    it: {
        title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━',
        player: '👤 Giocatore:',
        yourCards: '👤 LE TUE CARTE',
        hand1: '👤 MANO 1',
        hand2: '👤 MANO 2',
        dealerCards: '🎩 DEALER',
        bet: '💰 Puntata:',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Azioni:\n  🃏 .hit - Pesca carta\n  ✋ .stand - Mantieni\n  💰 .double - Raddoppia',
        dealerTurn: '🎩 Turno dealer...',
        blackjack: '🎉 ★ BLACKJACK! ★ 🎉',
        bust: '💥 SBALLATO! Oltre 21!',
        youWin: '🎊 HAI VINTO! 🎊',
        youLose: '😢 HAI PERSO',
        push: '🤝 PAREGGIO',
        won: '✅ Vinto:',
        lost: '❌ Perso:',
        balance: '💵 Saldo:',
        noGame: '❌ Nessun gioco attivo! Inizia con .bj <puntata>',
        playingHand: '🎯 Giocando Mano',
        totalWinnings: '💰 Vincite Totali:',
        currentHand: '▶️ MANO',
        completedHand: '✅ MANO'
    },
    ru: {
        title: '━━━━━ 🎰 БЛЭКДЖЕК 🎰 ━━━━━',
        player: '👤 Игрок:',
        yourCards: '👤 ВАШИ КАРТЫ',
        hand1: '👤 РУКА 1',
        hand2: '👤 РУКА 2',
        dealerCards: '🎩 ДИЛЕР',
        bet: '💰 Ставка:',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Действия:\n  🃏 .hit - Взять карту\n  ✋ .stand - Остановиться\n  💰 .double - Удвоить',
        dealerTurn: '🎩 Ход дилера...',
        blackjack: '🎉 ★ БЛЭКДЖЕК! ★ 🎉',
        bust: '💥 ПЕРЕБОР! Больше 21!',
        youWin: '🎊 ВЫ ВЫИГРАЛИ! 🎊',
        youLose: '😢 ВЫ ПРОИГРАЛИ',
        push: '🤝 НИЧЬЯ',
        won: '✅ Выиграно:',
        lost: '❌ Проиграно:',
        balance: '💵 Баланс:',
        noGame: '❌ Нет активной игры! Начните с .bj <ставка>',
        playingHand: '🎯 Играем Рукой',
        totalWinnings: '💰 Общий Выигрыш:',
        currentHand: '▶️ РУКА',
        completedHand: '✅ РУКА'
    },
    es: {
        title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━',
        player: '👤 Jugador:',
        yourCards: '👤 TUS CARTAS',
        hand1: '👤 MANO 1',
        hand2: '👤 MANO 2',
        dealerCards: '🎩 CRUPIER',
        bet: '💰 Apuesta:',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Acciones:\n  🃏 .hit - Pedir carta\n  ✋ .stand - Plantarse\n  💰 .double - Doblar',
        dealerTurn: '🎩 Turno del crupier...',
        blackjack: '🎉 ★ BLACKJACK! ★ 🎉',
        bust: '💥 ¡TE PASASTE! ¡Más de 21!',
        youWin: '🎊 ¡GANASTE! 🎊',
        youLose: '😢 PERDISTE',
        push: '🤝 EMPATE',
        won: '✅ Ganado:',
        lost: '❌ Perdido:',
        balance: '💵 Saldo:',
        noGame: '❌ ¡No hay juego activo! Inicia con .bj <apuesta>',
        playingHand: '🎯 Jugando Mano',
        totalWinnings: '💰 Ganancias Totales:',
        currentHand: '▶️ MANO',
        completedHand: '✅ MANO'
    },
    pt: {
        title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━',
        player: '👤 Jogador:',
        yourCards: '👤 SUAS CARTAS',
        hand1: '👤 MÃO 1',
        hand2: '👤 MÃO 2',
        dealerCards: '🎩 DEALER',
        bet: '💰 Aposta:',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Ações:\n  🃏 .hit - Pedir carta\n  ✋ .stand - Parar\n  💰 .double - Dobrar',
        dealerTurn: '🎩 Vez do dealer...',
        blackjack: '🎉 ★ BLACKJACK! ★ 🎉',
        bust: '💥 ESTOUROU! Mais de 21!',
        youWin: '🎊 VOCÊ GANHOU! 🎊',
        youLose: '😢 VOCÊ PERDEU',
        push: '🤝 EMPATE',
        won: '✅ Ganho:',
        lost: '❌ Perdido:',
        balance: '💵 Saldo:',
        noGame: '❌ Nenhum jogo ativo! Inicie com .bj <aposta>',
        playingHand: '🎯 Jogando Mão',
        totalWinnings: '💰 Ganhos Totais:',
        currentHand: '▶️ MÃO',
        completedHand: '✅ MÃO'
    },
    ar: {
        title: '━━━━━ 🎰 بلاك جاك 🎰 ━━━━━',
        player: '👤 اللاعب:',
        yourCards: '👤 أوراقك',
        hand1: '👤 اليد 1',
        hand2: '👤 اليد 2',
        dealerCards: '🎩 الموزع',
        bet: '💰 الرهان:',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 الإجراءات:\n  🃏 .hit - اسحب ورقة\n  ✋ .stand - قف\n  💰 .double - ضاعف',
        dealerTurn: '🎩 دور الموزع...',
        blackjack: '🎉 ★ بلاك جاك! ★ 🎉',
        bust: '💥 انفجرت! أكتر من 21!',
        youWin: '🎊 انت كسبت! 🎊',
        youLose: '😢 انت خسرت',
        push: '🤝 تعادل',
        won: '✅ كسبت:',
        lost: '❌ خسرت:',
        balance: '💵 الرصيد:',
        noGame: '❌ مفيش لعبة نشطة! ابدأ بـ .bj <رهان>',
        playingHand: '🎯 بنلعب اليد',
        totalWinnings: '💰 إجمالي الأرباح:',
        currentHand: '▶️ اليد',
        completedHand: '✅ اليد'
    },
    hi: {
        title: '━━━━━ 🎰 ब्लैकजैक 🎰 ━━━━━',
        player: '👤 खिलाड़ी:',
        yourCards: '👤 आपके कार्ड',
        hand1: '👤 हैंड 1',
        hand2: '👤 हैंड 2',
        dealerCards: '🎩 डीलर',
        bet: '💰 दांव:',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 एक्शन:\n  🃏 .hit - कार्ड लें\n  ✋ .stand - रुकें\n  💰 .double - डबल करें',
        dealerTurn: '🎩 डीलर की बारी...',
        blackjack: '🎉 ★ ब्लैकजैक! ★ 🎉',
        bust: '💥 बस्ट! 21 से ज्यादा!',
        youWin: '🎊 आप जीते! 🎊',
        youLose: '😢 आप हारे',
        push: '🤝 टाई',
        won: '✅ जीता:',
        lost: '❌ हारा:',
        balance: '💵 बैलेंस:',
        noGame: '❌ कोई एक्टिव गेम नहीं! शुरू करें .bj <दांव>',
        playingHand: '🎯 हैंड खेल रहे हैं',
        totalWinnings: '💰 कुल जीत:',
        currentHand: '▶️ हैंड',
        completedHand: '✅ हैंड'
    },
    ng: {
        title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━',
        player: '👤 Player:',
        yourCards: '👤 YOUR CARDS',
        hand1: '👤 HAND 1',
        hand2: '👤 HAND 2',
        dealerCards: '🎩 DEALER',
        bet: '💰 Bet:',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Wetin You Fit Do:\n  🃏 .hit - Draw card\n  ✋ .stand - Hold\n  💰 .double - Double down',
        dealerTurn: '🎩 Dealer turn...',
        blackjack: '🎉 ★ BLACKJACK! ★ 🎉',
        bust: '💥 BUST! Pass 21!',
        youWin: '🎊 YOU WIN! 🎊',
        youLose: '😢 YOU LOSE',
        push: '🤝 PUSH - TIE',
        won: '✅ You win:',
        lost: '❌ You lose:',
        balance: '💵 Balance:',
        noGame: '❌ No active game! Start with .bj <bet>',
        playingHand: '🎯 Playing Hand',
        totalWinnings: '💰 Total Winnings:',
        currentHand: '▶️ HAND',
        completedHand: '✅ HAND'
    }
};

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
        const coins = lang === 'it' ? 'monete' : lang === 'ru' ? 'монет' : lang === 'es' ? 'monedas' : lang === 'pt' ? 'moedas' : 'coins';
        
        // Handle multi-hand games
        if (game.multiHands) {
            const currentHandIndex = game.currentHandIndex;
            const currentHand = game.multiHands[currentHandIndex];
            
            // Add card to current hand
            const newCard = game.deck.pop();
            currentHand.cards.push(newCard);
            currentHand.total = calculateHandValue(currentHand.cards);
            
            // Check if bust or 21
            if (currentHand.total >= 21) {
                currentHand.status = currentHand.total > 21 ? 'bust' : 'complete';
                
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
                    // All hands complete - resolve game
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
                    return;
                } else {
                    // Switch to next hand
                    game.currentHandIndex = nextHandIndex;
                }
            }
            
            // Display all hands
            let gameText = `${t.title}\n${t.player} ${game.pushName}\n\n${t.bet} ${game.bet * game.numHands} ${coins}\n\n`;
            
            for (let i = 0; i < game.multiHands.length; i++) {
                const hand = game.multiHands[i];
                const isActive = i === game.currentHandIndex;
                const label = isActive ? `${t.currentHand} ${i + 1}` : 
                             hand.status !== 'active' ? `${t.completedHand} ${i + 1}` : 
                             `HAND ${i + 1}`;
                
                gameText += getHandDisplayCompact(hand.cards, hand.total, label);
                gameText += '\n\n';
            }
            
            const dealerVisible = calculateHandValue([game.dealerHand[0]]);
            gameText += getHandDisplay(game.dealerHand, dealerVisible, t.dealerCards, true);
            gameText += t.actions;
            
            await sock.sendMessage(from, { text: gameText });
            return;
        }
        
        // Handle split hands
        if (game.splitHands) {
            const currentHand = game.splitHands.currentHand;
            const handKey = `hand${currentHand}`;
            
            // Add card to current hand
            game.splitHands[handKey].push(game.deck.pop());
            
            const hand1Total = calculateHandValue(game.splitHands.hand1);
            const hand2Total = calculateHandValue(game.splitHands.hand2);
            const currentTotal = currentHand === 1 ? hand1Total : hand2Total;
            const dealerVisible = calculateHandValue([game.dealerHand[0]]);
            
            let gameText = `${t.title}\n${t.player} ${game.pushName || 'Player'}\n\n${t.bet} ${game.bet * 2} ${coins}\n\n`;
            gameText += `${t.playingHand} ${currentHand}️⃣\n\n`;
            
            // Display hand 1 with highlight if active
            gameText += getHandDisplay(game.splitHands.hand1, hand1Total, currentHand === 1 ? `${t.hand1} ⬅️` : t.hand1);
            gameText += '\n\n';
            
            // Display hand 2 with highlight if active
            gameText += getHandDisplay(game.splitHands.hand2, hand2Total, currentHand === 2 ? `${t.hand2} ⬅️` : t.hand2);
            gameText += '\n\n';
            
            const dealerCards = `${game.dealerHand[0].rank}${game.dealerHand[0].suit}  🎴`;
            gameText += `${t.dealerCards}\n┌─────────────────┐\n│ ${dealerCards}  │\n└─────────────────┘\n📊 Total: ${dealerVisible}+ (hidden)`;
            
            // Check if current hand busts or reaches 21
            if (currentTotal > 21 || currentTotal === 21) {
                game.splitHands[`hand${currentHand}Complete`] = true;
                
                // Check if both hands are complete
                if (game.splitHands.hand1Complete && game.splitHands.hand2Complete) {
                    await sock.sendMessage(from, { text: gameText });
                    await finishSplitGame(sock, game, sender, from, t, coins);
                } else {
                    // Switch to next hand
                    game.splitHands.currentHand = currentHand === 1 ? 2 : 1;
                    gameText += `\n\n━━━━━━━━━━━━━━━━━━━━━\n${t.playingHand} ${game.splitHands.currentHand}️⃣\n━━━━━━━━━━━━━━━━━━━━━`;
                    gameText += '\n\n💡 Actions:\n  🃏 .hit - Draw card\n  ✋ .stand - Hold';
                    await sock.sendMessage(from, { text: gameText });
                }
            } else {
                gameText += '\n\n💡 Actions:\n  🃏 .hit - Draw card\n  ✋ .stand - Hold';
                await sock.sendMessage(from, { text: gameText });
            }
            return;
        }
        
        // Regular (non-split) game logic
        game.turnCount++;
        
        // Draw card
        const newCard = game.deck.pop();
        game.playerHand.push(newCard);
        
        const playerTotal = calculateHandValue(game.playerHand);
        const dealerVisible = calculateHandValue([game.dealerHand[1]]);
        
        let gameText = `${t.title}\n${t.player} ${game.pushName || 'Player'}\n\n${t.bet} ${game.bet} ${coins}\n\n`;
        gameText += getHandDisplay(game.playerHand, playerTotal, t.yourCards);
        gameText += '\n\n';
        gameText += getHandDisplay(game.dealerHand, dealerVisible, t.dealerCards, true);
        
        if (playerTotal > 21) {
            const bustMsg = getDealerMessage('playerBust', lang);
            gameText += `\n\n━━━━━━━━━━━━━━━━━━━━━\n${bustMsg}\n${t.bust}\n${t.youLose}\n${t.lost} -${game.bet} ${coins}\n━━━━━━━━━━━━━━━━━━━━━\n\n${t.balance} ${await getBalance(sender)} ${coins}`;
            await sock.sendMessage(from, { text: gameText });
            recordLoss(sender, game.bet, true);
            activeGames.delete(sender);
        } else if (playerTotal === 21) {
            await sock.sendMessage(from, { text: gameText });
            await finishGame(sock, game, sender, from, t, coins);
        } else {
            gameText += t.actions;
            await sock.sendMessage(from, { text: gameText });
        }
    }
};
