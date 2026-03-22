import { getGroupLanguage } from '../../utils/language.js';
import { activeGames } from '../../utils/blackjackGames.js';
import { getHandDisplayCompact } from '../../utils/cardDisplay.js';

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

// Old display functions removed - now using cardDisplay.js

const responses = {
    en: {
        title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━',
        player: '👤 Player:',
        dealerCards: '🎩 DEALER',
        bet: '💰 Bet:',
        noGame: '❌ No active game!',
        notMultiHand: '❌ Not a multi-hand game!',
        invalidHand: '❌ Invalid hand number! Choose 1-',
        handCompleted: '❌ This hand is already completed!',
        currentHand: '▶️ HAND',
        completedHand: '✅ HAND',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Actions:\n  🃏 .hit - Draw card\n  ✋ .stand - Hold\n  💰 .double - Double down\n  🏳️ .surrender - Fold'
    },
    it: {
        title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━',
        player: '👤 Giocatore:',
        dealerCards: '🎩 DEALER',
        bet: '💰 Puntata:',
        noGame: '❌ Nessun gioco attivo!',
        notMultiHand: '❌ Non è un gioco multi-mano!',
        invalidHand: '❌ Numero mano non valido! Scegli 1-',
        handCompleted: '❌ Questa mano è già completata!',
        currentHand: '▶️ MANO',
        completedHand: '✅ MANO',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Azioni:\n  🃏 .hit - Pesca carta\n  ✋ .stand - Mantieni\n  💰 .double - Raddoppia\n  🏳️ .surrender - Arrenditi'
    },
    ru: {
        title: '━━━━━ 🎰 БЛЭКДЖЕК 🎰 ━━━━━',
        player: '👤 Игрок:',
        dealerCards: '🎩 ДИЛЕР',
        bet: '💰 Ставка:',
        noGame: '❌ Нет активной игры!',
        notMultiHand: '❌ Это не мульти-рука игра!',
        invalidHand: '❌ Неверный номер руки! Выберите 1-',
        handCompleted: '❌ Эта рука уже завершена!',
        currentHand: '▶️ РУКА',
        completedHand: '✅ РУКА',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Действия:\n  🃏 .hit - Взять карту\n  ✋ .stand - Остановиться\n  💰 .double - Удвоить\n  🏳️ .surrender - Сдаться'
    },
    es: {
        title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━',
        player: '👤 Jugador:',
        dealerCards: '🎩 CRUPIER',
        bet: '💰 Apuesta:',
        noGame: '❌ ¡No hay juego activo!',
        notMultiHand: '❌ ¡No es un juego multi-mano!',
        invalidHand: '❌ ¡Número de mano inválido! Elige 1-',
        handCompleted: '❌ ¡Esta mano ya está completada!',
        currentHand: '▶️ MANO',
        completedHand: '✅ MANO',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Acciones:\n  🃏 .hit - Pedir carta\n  ✋ .stand - Plantarse\n  💰 .double - Doblar\n  🏳️ .surrender - Rendirse'
    },
    pt: {
        title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━',
        player: '👤 Jogador:',
        dealerCards: '🎩 DEALER',
        bet: '💰 Aposta:',
        noGame: '❌ Nenhum jogo ativo!',
        notMultiHand: '❌ Não é um jogo multi-mão!',
        invalidHand: '❌ Número de mão inválido! Escolha 1-',
        handCompleted: '❌ Esta mão já está completa!',
        currentHand: '▶️ MÃO',
        completedHand: '✅ MÃO',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Ações:\n  🃏 .hit - Pedir carta\n  ✋ .stand - Parar\n  💰 .double - Dobrar\n  🏳️ .surrender - Desistir'
    },
    ar: {
        title: '━━━━━ 🎰 بلاك جاك 🎰 ━━━━━',
        player: '👤 اللاعب:',
        dealerCards: '🎩 الموزع',
        bet: '💰 الرهان:',
        noGame: '❌ مفيش لعبة نشطة!',
        notMultiHand: '❌ مش لعبة متعددة الأيدي!',
        invalidHand: '❌ رقم اليد غلط! اختار 1-',
        handCompleted: '❌ اليد دي خلصت خلاص!',
        currentHand: '▶️ اليد',
        completedHand: '✅ اليد',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 الإجراءات:\n  🃏 .hit - اسحب ورقة\n  ✋ .stand - قف\n  💰 .double - ضاعف\n  🏳️ .surrender - استسلم'
    },
    hi: {
        title: '━━━━━ 🎰 ब्लैकजैक 🎰 ━━━━━',
        player: '👤 खिलाड़ी:',
        dealerCards: '🎩 डीलर',
        bet: '💰 दांव:',
        noGame: '❌ कोई एक्टिव गेम नहीं!',
        notMultiHand: '❌ यह मल्टी-हैंड गेम नहीं है!',
        invalidHand: '❌ अमान्य हैंड नंबर! चुनें 1-',
        handCompleted: '❌ यह हैंड पहले से पूर्ण है!',
        currentHand: '▶️ हैंड',
        completedHand: '✅ हैंड',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 एक्शन:\n  🃏 .hit - कार्ड लें\n  ✋ .stand - रुकें\n  💰 .double - डबल करें\n  🏳️ .surrender - सरेंडर करें'
    },
    ng: {
        title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━',
        player: '👤 Player:',
        dealerCards: '🎩 DEALER',
        bet: '💰 Bet:',
        noGame: '❌ No active game!',
        notMultiHand: '❌ Na no be multi-hand game!',
        invalidHand: '❌ Hand number no correct! Choose 1-',
        handCompleted: '❌ Dis hand don finish already!',
        currentHand: '▶️ HAND',
        completedHand: '✅ HAND',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Wetin You Fit Do:\n  🃏 .hit - Draw card\n  ✋ .stand - Hold\n  💰 .double - Double down\n  🏳️ .surrender - Fold'
    }
};

export default {
    name: 'hand',
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
        
        // Check if multi-hand game
        if (!game.multiHands) {
            return await sock.sendMessage(from, { text: t.notMultiHand });
        }
        
        if (args.length === 0) {
            return await sock.sendMessage(from, { text: `${t.invalidHand}${game.numHands}` });
        }
        
        const handNum = parseInt(args[0]);
        if (isNaN(handNum) || handNum < 1 || handNum > game.numHands) {
            return await sock.sendMessage(from, { text: `${t.invalidHand}${game.numHands}` });
        }
        
        const handIndex = handNum - 1;
        const targetHand = game.multiHands[handIndex];
        
        // Check if hand is completed
        if (targetHand.status !== 'active') {
            return await sock.sendMessage(from, { text: t.handCompleted });
        }
        
        // Switch to this hand
        game.currentHandIndex = handIndex;
        
        // Display all hands with current one highlighted
        let gameText = `${t.title}\n${t.player} ${game.pushName}\n\n${t.bet} ${game.bet * game.numHands} ${coins}\n\n`;
        
        for (let i = 0; i < game.multiHands.length; i++) {
            const hand = game.multiHands[i];
            const isActive = i === handIndex;
            const label = isActive ? `${t.currentHand} ${i + 1}` : 
                         hand.status !== 'active' ? `${t.completedHand} ${i + 1}` : 
                         `HAND ${i + 1}`;
            
            gameText += getHandDisplayCompact(hand.cards, hand.total, label);
            gameText += '\n\n';
        }
        
        const dealerVisible = calculateHandValue([game.dealerHand[0]]);
        gameText += getHandDisplayCompact(game.dealerHand, dealerVisible, t.dealerCards, true);
        gameText += '\n\n━━━━━━━━━━━━━━━━━━━━━\n';
        gameText += `${t.currentHand} ${handNum}\n`;
        gameText += t.actions;
        
        await sock.sendMessage(from, { text: gameText });
    }
};
