import { getGroupLanguage } from '../../utils/language.js';
import { getBalance, addCoins, removeCoins, hasEnough } from '../../utils/bank_SAFE.js';
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
    return hand.map(card => `${card.rank}${card.suit}`).join(' ');
}

const responses = {
    en: { title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━', player: '👤 Player:', yourCards: '👤 YOUR CARDS', dealerCards: '🎩 DEALER', bet: '💰 Bet:', bust: '💥 BUST!', youWin: '🎊 YOU WIN! 🎊', youLose: '😢 YOU LOSE', push: '🤝 PUSH - TIE', won: '✅ Won:', lost: '❌ Lost:', balance: '💵 Balance:', noGame: '❌ No active game!', cantDouble: '❌ Can only double on first turn!', notEnough: '❌ Not enough coins to double!' },
    it: { title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━', player: '👤 Giocatore:', yourCards: '👤 LE TUE CARTE', dealerCards: '🎩 DEALER', bet: '💰 Puntata:', bust: '💥 SBALLATO!', youWin: '🎊 HAI VINTO! 🎊', youLose: '😢 HAI PERSO', push: '🤝 PAREGGIO', won: '✅ Vinto:', lost: '❌ Perso:', balance: '💵 Saldo:', noGame: '❌ Nessun gioco attivo!', cantDouble: '❌ Puoi raddoppiare solo al primo turno!', notEnough: '❌ Monete insufficienti!' },
    ru: { title: '━━━━━ 🎰 БЛЭКДЖЕК 🎰 ━━━━━', player: '👤 Игрок:', yourCards: '👤 ВАШИ КАРТЫ', dealerCards: '🎩 ДИЛЕР', bet: '💰 Ставка:', bust: '💥 ПЕРЕБОР!', youWin: '🎊 ВЫ ВЫИГРАЛИ! 🎊', youLose: '😢 ВЫ ПРОИГРАЛИ', push: '🤝 НИЧЬЯ', won: '✅ Выиграно:', lost: '❌ Проиграно:', balance: '💵 Баланс:', noGame: '❌ Нет активной игры!', cantDouble: '❌ Можно удвоить только на первом ходу!', notEnough: '❌ Недостаточно монет для удвоения!' },
    es: { title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━', player: '👤 Jugador:', yourCards: '👤 TUS CARTAS', dealerCards: '🎩 CRUPIER', bet: '💰 Apuesta:', bust: '💥 ¡TE PASASTE!', youWin: '🎊 ¡GANASTE! 🎊', youLose: '😢 PERDISTE', push: '🤝 EMPATE', won: '✅ Ganado:', lost: '❌ Perdido:', balance: '💵 Saldo:', noGame: '❌ ¡No hay juego activo!', cantDouble: '❌ ¡Solo puedes doblar en el primer turno!', notEnough: '❌ ¡No tienes suficientes monedas para doblar!' },
    pt: { title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━', player: '👤 Jogador:', yourCards: '👤 SUAS CARTAS', dealerCards: '🎩 DEALER', bet: '💰 Aposta:', bust: '💥 ESTOUROU!', youWin: '🎊 VOCÊ GANHOU! 🎊', youLose: '😢 VOCÊ PERDEU', push: '🤝 EMPATE', won: '✅ Ganho:', lost: '❌ Perdido:', balance: '💵 Saldo:', noGame: '❌ Nenhum jogo ativo!', cantDouble: '❌ Só pode dobrar no primeiro turno!', notEnough: '❌ Moedas insuficientes para dobrar!' },
    ar: { title: '━━━━━ 🎰 بلاك جاك 🎰 ━━━━━', player: '👤 اللاعب:', yourCards: '👤 أوراقك', dealerCards: '🎩 الموزع', bet: '💰 الرهان:', bust: '💥 انفجرت!', youWin: '🎊 انت كسبت! 🎊', youLose: '😢 انت خسرت', push: '🤝 تعادل', won: '✅ كسبت:', lost: '❌ خسرت:', balance: '💵 الرصيد:', noGame: '❌ مفيش لعبة نشطة!', cantDouble: '❌ تقدر تضاعف في الدور الأول بس!', notEnough: '❌ عملات مش كفاية للمضاعفة!' },
    hi: { title: '━━━━━ 🎰 ब्लैकजैक 🎰 ━━━━━', player: '👤 खिलाड़ी:', yourCards: '👤 आपके कार्ड', dealerCards: '🎩 डीलर', bet: '💰 दांव:', bust: '💥 बस्ट!', youWin: '🎊 आप जीते! 🎊', youLose: '😢 आप हारे', push: '🤝 टाई', won: '✅ जीता:', lost: '❌ हारा:', balance: '💵 बैलेंस:', noGame: '❌ कोई एक्टिव गेम नहीं!', cantDouble: '❌ केवल पहली बारी में डबल कर सकते हैं!', notEnough: '❌ डबल करने के लिए पर्याप्त कॉइन नहीं!' },
    ng: { title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━', player: '👤 Player:', yourCards: '👤 YOUR CARDS', dealerCards: '🎩 DEALER', bet: '💰 Bet:', bust: '💥 BUST!', youWin: '🎊 YOU WIN AM! 🎊', youLose: '😢 YOU LOSE AM', push: '🤝 PUSH - TIE', won: '✅ Won:', lost: '❌ Lost:', balance: '💵 Balance:', noGame: '❌ No active game!', cantDouble: '❌ You fit only double for first turn!', notEnough: '❌ Coins no reach to double!' }
};

function getHandDisplay(hand, total, label) {
    const cards = hand.map(card => `${card.rank}${card.suit}`).join('  ');
    let display = `${label}\n┌─────────────────┐\n│ ${cards}  │\n└─────────────────┘\n📊 Total: ${total}`;
    if (total === 21 && hand.length === 2) display += ' ⭐';
    else if (total > 21) display += ' 💥';
    else if (total >= 17) display += ' 🔥';
    return display;
}

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
        const coins = lang === 'it' ? 'monete' : lang === 'ru' ? 'монет' : lang === 'es' ? 'monedas' : lang === 'pt' ? 'moedas' : 'coins';
        
        if (game.turnCount > 0) {
            return await sock.sendMessage(from, { text: t.cantDouble });
        }
        
        if (!await hasEnough(sender, game.bet)) {
            return await sock.sendMessage(from, { text: t.notEnough });
        }
        
        await removeCoins(sender, game.bet);
        game.bet *= 2;
        game.playerHand.push(game.deck.pop());
        
        while (calculateHandValue(game.dealerHand) < 17) {
            game.dealerHand.push(game.deck.pop());
        }
        
        const playerTotal = calculateHandValue(game.playerHand);
        const dealerTotal = calculateHandValue(game.dealerHand);
        
        let gameText = `${t.title}\n${t.player} ${game.pushName || 'Player'}\n\n${t.bet} ${game.bet} ${coins}\n\n`;
        gameText += getHandDisplay(game.playerHand, playerTotal, t.yourCards);
        gameText += '\n\n';
        gameText += getHandDisplay(game.dealerHand, dealerTotal, t.dealerCards);
        gameText += '\n\n━━━━━━━━━━━━━━━━━━━━━\n';
        
        if (playerTotal > 21) {
            gameText += `${t.bust}\n${t.youLose}\n${t.lost} -${game.bet} ${coins}`;
        } else if (dealerTotal > 21 || playerTotal > dealerTotal) {
            const winAmount = game.bet * 2;
            await addCoins(sender, winAmount);
            gameText += `${t.youWin}\n${t.won} +${winAmount} ${coins}`;
        } else if (playerTotal < dealerTotal) {
            gameText += `${t.youLose}\n${t.lost} -${game.bet} ${coins}`;
        } else {
            await addCoins(sender, game.bet);
            gameText += t.push;
        }
        
        gameText += `\n━━━━━━━━━━━━━━━━━━━━━\n\n${t.balance} ${await getBalance(sender)} ${coins}`;
        await sock.sendMessage(from, { text: gameText });
        activeGames.delete(sender);
    }
};
