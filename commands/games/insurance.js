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
    return hand.map(card => `${card.rank}${card.suit}`).join('  ');
}

function getHandDisplay(hand, total, label, hideFirst = false) {
    if (hideFirst && hand.length > 1) {
        const firstCard = `${hand[0].rank}${hand[0].suit}`;
        return `${label}\n┌─────────────────┐\n│ ${firstCard}  🎴  │\n└─────────────────┘\n📊 Total: ${calculateHandValue([hand[0]])}+ (hidden)`;
    }
    
    const cards = formatHand(hand);
    let display = `${label}\n┌─────────────────┐\n│ ${cards}  │\n└─────────────────┘\n📊 Total: ${total}`;
    
    if (total === 21 && hand.length === 2) display += ' ⭐ BLACKJACK!';
    else if (total > 21) display += ' 💥 BUST!';
    else if (total >= 17 && total <= 20) display += ' 🔥';
    
    return display;
}

const responses = {
    en: {
        title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━',
        player: '👤 Player:',
        yourCards: '👤 YOUR CARDS',
        dealerCards: '🎩 DEALER',
        bet: '💰 Bet:',
        insurance: '🛡️ Insurance:',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Actions:\n  🃏 .hit - Draw card\n  ✋ .stand - Hold\n  💰 .double - Double down',
        noGame: '❌ No active game!',
        cantInsure: '❌ Cannot buy insurance!\n\n• Dealer must show an Ace\n• Can only insure on first turn\n• Cannot insure after other actions',
        notEnough: '❌ Not enough coins for insurance!\n\nInsurance costs half your bet.',
        alreadyInsured: '❌ Already insured!',
        insuranceTaken: '🛡️ Insurance purchased!',
        dealerHasBlackjack: '🎩 Dealer has BLACKJACK!',
        insurancePaid: '🛡️ Insurance paid:',
        insuranceLost: '🛡️ Insurance lost',
        balance: '💵 Balance:',
        won: '✅ Won:',
        lost: '❌ Lost:',
        push: '🤝 PUSH - TIE',
        youWin: '🎊 YOU WIN! 🎊',
        youLose: '😢 YOU LOSE',
        blackjack: '🎉 ★ BLACKJACK! ★ 🎉'
    },
    it: {
        title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━',
        player: '👤 Giocatore:',
        yourCards: '👤 LE TUE CARTE',
        dealerCards: '🎩 DEALER',
        bet: '💰 Puntata:',
        insurance: '🛡️ Assicurazione:',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Azioni:\n  🃏 .hit - Pesca carta\n  ✋ .stand - Mantieni\n  💰 .double - Raddoppia',
        noGame: '❌ Nessun gioco attivo!',
        cantInsure: '❌ Impossibile acquistare assicurazione!\n\n• Dealer deve mostrare un Asso\n• Puoi assicurarti solo al primo turno\n• Non puoi assicurarti dopo altre azioni',
        notEnough: '❌ Monete insufficienti per assicurazione!\n\nL\'assicurazione costa metà della puntata.',
        alreadyInsured: '❌ Già assicurato!',
        insuranceTaken: '🛡️ Assicurazione acquistata!',
        dealerHasBlackjack: '🎩 Dealer ha BLACKJACK!',
        insurancePaid: '🛡️ Assicurazione pagata:',
        insuranceLost: '🛡️ Assicurazione persa',
        balance: '💵 Saldo:',
        won: '✅ Vinto:',
        lost: '❌ Perso:',
        push: '🤝 PAREGGIO',
        youWin: '🎊 HAI VINTO! 🎊',
        youLose: '😢 HAI PERSO',
        blackjack: '🎉 ★ BLACKJACK! ★ 🎉'
    },
    ru: {
        title: '━━━━━ 🎰 БЛЭКДЖЕК 🎰 ━━━━━',
        player: '👤 Игрок:',
        yourCards: '👤 ВАШИ КАРТЫ',
        dealerCards: '🎩 ДИЛЕР',
        bet: '💰 Ставка:',
        insurance: '🛡️ Страховка:',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Действия:\n  🃏 .hit - Взять карту\n  ✋ .stand - Остановиться\n  💰 .double - Удвоить',
        noGame: '❌ Нет активной игры!',
        cantInsure: '❌ Невозможно купить страховку!\n\n• Дилер должен показывать Туз\n• Можно застраховаться только на первом ходу\n• Нельзя застраховаться после других действий',
        notEnough: '❌ Недостаточно монет для страховки!\n\nСтраховка стоит половину ставки.',
        alreadyInsured: '❌ Уже застрахованы!',
        insuranceTaken: '🛡️ Страховка куплена!',
        dealerHasBlackjack: '🎩 У дилера БЛЭКДЖЕК!',
        insurancePaid: '🛡️ Страховка выплачена:',
        insuranceLost: '🛡️ Страховка проиграна',
        balance: '💵 Баланс:',
        won: '✅ Выиграно:',
        lost: '❌ Проиграно:',
        push: '🤝 НИЧЬЯ',
        youWin: '🎊 ВЫ ВЫИГРАЛИ! 🎊',
        youLose: '😢 ВЫ ПРОИГРАЛИ',
        blackjack: '🎉 ★ БЛЭКДЖЕК! ★ 🎉'
    },
    es: {
        title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━',
        player: '👤 Jugador:',
        yourCards: '👤 TUS CARTAS',
        dealerCards: '🎩 CRUPIER',
        bet: '💰 Apuesta:',
        insurance: '🛡️ Seguro:',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Acciones:\n  🃏 .hit - Pedir carta\n  ✋ .stand - Plantarse\n  💰 .double - Doblar',
        noGame: '❌ ¡No hay juego activo!',
        cantInsure: '❌ ¡No puedes comprar seguro!\n\n• El crupier debe mostrar un As\n• Solo puedes asegurarte en el primer turno\n• No puedes asegurarte después de otras acciones',
        notEnough: '❌ ¡No tienes suficientes monedas para el seguro!\n\nEl seguro cuesta la mitad de tu apuesta.',
        alreadyInsured: '❌ ¡Ya estás asegurado!',
        insuranceTaken: '🛡️ ¡Seguro comprado!',
        dealerHasBlackjack: '🎩 ¡El crupier tiene BLACKJACK!',
        insurancePaid: '🛡️ Seguro pagado:',
        insuranceLost: '🛡️ Seguro perdido',
        balance: '💵 Saldo:',
        won: '✅ Ganado:',
        lost: '❌ Perdido:',
        push: '🤝 EMPATE',
        youWin: '🎊 ¡GANASTE! 🎊',
        youLose: '😢 PERDISTE',
        blackjack: '🎉 ★ BLACKJACK! ★ 🎉'
    },
    pt: {
        title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━',
        player: '👤 Jogador:',
        yourCards: '👤 SUAS CARTAS',
        dealerCards: '🎩 DEALER',
        bet: '💰 Aposta:',
        insurance: '🛡️ Seguro:',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Ações:\n  🃏 .hit - Pedir carta\n  ✋ .stand - Parar\n  💰 .double - Dobrar',
        noGame: '❌ Nenhum jogo ativo!',
        cantInsure: '❌ Não pode comprar seguro!\n\n• Dealer deve mostrar um Ás\n• Só pode segurar no primeiro turno\n• Não pode segurar após outras ações',
        notEnough: '❌ Moedas insuficientes para seguro!\n\nO seguro custa metade da sua aposta.',
        alreadyInsured: '❌ Já está segurado!',
        insuranceTaken: '🛡️ Seguro comprado!',
        dealerHasBlackjack: '🎩 Dealer tem BLACKJACK!',
        insurancePaid: '🛡️ Seguro pago:',
        insuranceLost: '🛡️ Seguro perdido',
        balance: '💵 Saldo:',
        won: '✅ Ganho:',
        lost: '❌ Perdido:',
        push: '🤝 EMPATE',
        youWin: '🎊 VOCÊ GANHOU! 🎊',
        youLose: '😢 VOCÊ PERDEU',
        blackjack: '🎉 ★ BLACKJACK! ★ 🎉'
    },
    ar: {
        title: '━━━━━ 🎰 بلاك جاك 🎰 ━━━━━',
        player: '👤 اللاعب:',
        yourCards: '👤 أوراقك',
        dealerCards: '🎩 الموزع',
        bet: '💰 الرهان:',
        insurance: '🛡️ التأمين:',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 الإجراءات:\n  🃏 .hit - اسحب ورقة\n  ✋ .stand - قف\n  💰 .double - ضاعف',
        noGame: '❌ مفيش لعبة نشطة!',
        cantInsure: '❌ متقدرش تشتري تأمين!\n\n• الموزع لازم يظهر آس\n• تقدر تأمن في الدور الأول بس\n• متقدرش تأمن بعد إجراءات تانية',
        notEnough: '❌ عملات مش كفاية للتأمين!\n\nالتأمين بيكلف نص رهانك.',
        alreadyInsured: '❌ مؤمن خلاص!',
        insuranceTaken: '🛡️ التأمين اتشرى!',
        dealerHasBlackjack: '🎩 الموزع عنده بلاك جاك!',
        insurancePaid: '🛡️ التأمين اتدفع:',
        insuranceLost: '🛡️ التأمين ضاع',
        balance: '💵 الرصيد:',
        won: '✅ كسبت:',
        lost: '❌ خسرت:',
        push: '🤝 تعادل',
        youWin: '🎊 انت كسبت! 🎊',
        youLose: '😢 انت خسرت',
        blackjack: '🎉 ★ بلاك جاك! ★ 🎉'
    },
    hi: {
        title: '━━━━━ 🎰 ब्लैकजैक 🎰 ━━━━━',
        player: '👤 खिलाड़ी:',
        yourCards: '👤 आपके कार्ड',
        dealerCards: '🎩 डीलर',
        bet: '💰 दांव:',
        insurance: '🛡️ इंश्योरेंस:',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 एक्शन:\n  🃏 .hit - कार्ड लें\n  ✋ .stand - रुकें\n  💰 .double - डबल करें',
        noGame: '❌ कोई एक्टिव गेम नहीं!',
        cantInsure: '❌ इंश्योरेंस नहीं खरीद सकते!\n\n• डीलर को इक्का दिखाना चाहिए\n• केवल पहली बारी में इंश्योरेंस ले सकते हैं\n• अन्य एक्शन के बाद इंश्योरेंस नहीं ले सकते',
        notEnough: '❌ इंश्योरेंस के लिए पर्याप्त कॉइन नहीं!\n\nइंश्योरेंस की कीमत आपके दांव का आधा है।',
        alreadyInsured: '❌ पहले से इंश्योर्ड है!',
        insuranceTaken: '🛡️ इंश्योरेंस खरीदा गया!',
        dealerHasBlackjack: '🎩 डीलर के पास ब्लैकजैक है!',
        insurancePaid: '🛡️ इंश्योरेंस भुगतान:',
        insuranceLost: '🛡️ इंश्योरेंस खो गया',
        balance: '💵 बैलेंस:',
        won: '✅ जीता:',
        lost: '❌ हारा:',
        push: '🤝 टाई',
        youWin: '🎊 आप जीते! 🎊',
        youLose: '😢 आप हारे',
        blackjack: '🎉 ★ ब्लैकजैक! ★ 🎉'
    },
    ng: {
        title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━',
        player: '👤 Player:',
        yourCards: '👤 YOUR CARDS',
        dealerCards: '🎩 DEALER',
        bet: '💰 Bet:',
        insurance: '🛡️ Insurance:',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Wetin You Fit Do:\n  🃏 .hit - Draw card\n  ✋ .stand - Hold\n  💰 .double - Double down',
        noGame: '❌ No active game!',
        cantInsure: '❌ You no fit buy insurance!\n\n• Dealer must show Ace\n• You fit only insure for first turn\n• You no fit insure after other actions',
        notEnough: '❌ Coins no reach for insurance!\n\nInsurance go cost half your bet.',
        alreadyInsured: '❌ You don insure already!',
        insuranceTaken: '🛡️ Insurance don buy!',
        dealerHasBlackjack: '🎩 Dealer get BLACKJACK!',
        insurancePaid: '🛡️ Insurance paid:',
        insuranceLost: '🛡️ Insurance lost',
        balance: '💵 Balance:',
        won: '✅ You win:',
        lost: '❌ You lose:',
        push: '🤝 PUSH - TIE',
        youWin: '🎊 YOU WIN! 🎊',
        youLose: '😢 YOU LOSE',
        blackjack: '🎉 ★ BLACKJACK! ★ 🎉'
    }
};

export default {
    name: 'insurance',
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
        
        // Check if already insured
        if (game.insuranceTaken) {
            return await sock.sendMessage(from, { text: t.alreadyInsured });
        }
        
        // Check if can insure (dealer shows ace, first turn)
        if (!game.dealerShowsAce || game.turnCount > 0) {
            return await sock.sendMessage(from, { text: t.cantInsure });
        }
        
        // Insurance costs half the bet
        const insuranceCost = Math.floor(game.bet / 2);
        
        // Check if has enough coins
        if (!await hasEnough(sender, insuranceCost)) {
            return await sock.sendMessage(from, { text: t.notEnough });
        }
        
        // Deduct insurance cost
        await removeCoins(sender, insuranceCost);
        game.insuranceTaken = true;
        game.insuranceCost = insuranceCost;
        
        // Check if dealer has blackjack
        const dealerTotal = calculateHandValue(game.dealerHand);
        const playerTotal = calculateHandValue(game.playerHand);
        
        if (dealerTotal === 21) {
            // Dealer has blackjack - insurance pays 2:1
            const insurancePayout = insuranceCost * 3; // Original bet + 2:1 payout
            await addCoins(sender, insurancePayout);
            
            let gameText = `${t.title}\n${t.player} ${game.pushName}\n\n${t.bet} ${game.bet} ${coins}\n${t.insurance} ${insuranceCost} ${coins}\n\n`;
            gameText += getHandDisplay(game.playerHand, playerTotal, t.yourCards);
            gameText += '\n\n';
            gameText += getHandDisplay(game.dealerHand, dealerTotal, t.dealerCards);
            gameText += `\n\n${t.dealerHasBlackjack}\n\n━━━━━━━━━━━━━━━━━━━━━\n`;
            gameText += `${t.insurancePaid} +${insuranceCost * 2} ${coins}\n`;
            
            // Check player result
            if (playerTotal === 21) {
                await addCoins(sender, game.bet); // Return original bet (push)
                gameText += `${t.push}\n`;
            } else {
                gameText += `${t.youLose}\n${t.lost} -${game.bet} ${coins}\n`;
            }
            
            gameText += `━━━━━━━━━━━━━━━━━━━━━\n\n${t.balance} ${await getBalance(sender)} ${coins}`;
            
            await sock.sendMessage(from, { text: gameText });
            activeGames.delete(sender);
        } else {
            // Dealer doesn't have blackjack - continue game
            let gameText = `${t.title}\n${t.player} ${game.pushName}\n\n${t.bet} ${game.bet} ${coins}\n${t.insurance} ${insuranceCost} ${coins}\n\n`;
            gameText += `${t.insuranceTaken}\n\n`;
            gameText += getHandDisplay(game.playerHand, playerTotal, t.yourCards);
            gameText += '\n\n';
            gameText += getHandDisplay(game.dealerHand, calculateHandValue([game.dealerHand[0]]), t.dealerCards, true);
            gameText += t.actions;
            
            await sock.sendMessage(from, { text: gameText });
        }
    }
};
