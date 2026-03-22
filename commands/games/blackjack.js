import { getGroupLanguage } from '../../utils/language.js';
import { getBalance, addCoins, removeCoins, hasEnough } from '../../utils/bank_SAFE.js';
import { validateAmount, safeMultiply, secureShuffle, MAX_COIN_AMOUNT } from '../../utils/securityEnhancements.js';
import { activeGames } from '../../utils/blackjackGames.js';
import { recordWin, recordPush, recordWager } from '../../utils/blackjackStats.js';
import { checkPerfectPairs, check21Plus3, getSideBetText } from '../../utils/sideBets.js';
import { getHandDisplay, getHandDisplayCompact } from '../../utils/cardDisplay.js';
import { getDealerMessage, getContextualMessage } from '../../utils/dealerMessages.js';
import { updateGameActivity } from '../../utils/game/gameCleanup.js';

const responses = {
    en: {
        usage: '🎰 BLACKJACK CASINO 🎰\n\nStart a game:\n• .bj <bet> - Play vs dealer\n• .bj <bet> x2 - Play 2 hands at once\n• .bj <bet> x3 - Play 3 hands at once\n• .bj <bet> x4 - Play 4 hands at once\n• .bj <bet> x5 - Play 5 hands at once\n• .bj <bet> pp - With Perfect Pairs side bet\n• .bj <bet> 21 - With 21+3 side bet\n• .bj <bet> x3 pp 21 - Multi-hand with side bets\n\nMulti-hand:\n  • Play 2-5 hands simultaneously\n  • Each hand costs the bet amount\n  • Play each hand independently\n  • Use .hand <number> to switch hands\n\nSide Bets (cost 5 coins each):\n🎴 Perfect Pairs:\n  • Perfect Pair (same suit): 25:1\n  • Colored Pair (same color): 12:1\n  • Mixed Pair (different color): 6:1\n\n🃏 21+3 (your 2 cards + dealer up card):\n  • Suited Trips: 100:1\n  • Straight Flush: 40:1\n  • Three of a Kind: 30:1\n  • Straight: 10:1\n  • Flush: 5:1\n\nDuring game:\n• .hit - Draw a card 🃏\n• .stand - Keep hand ✋\n• .double - Double bet & draw 💰\n• .split - Split pairs into 2 hands ✂️\n• .insurance - Insure against dealer blackjack 🛡️\n• .surrender - Give up, get half bet back 🏳️\n• .hand <1-5> - Switch to different hand\n\nBet: 10-500 coins\nBlackjack pays 2.5x!',
        title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━',
        player: '👤 Player:',
        yourCards: '👤 YOUR CARDS',
        hand1: '👤 HAND 1',
        hand2: '👤 HAND 2',
        dealerCards: '🎩 DEALER',
        bet: '💰 Bet:',
        hidden: '🎴',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Actions:\n  🃏 .hit - Draw card\n  ✋ .stand - Hold\n  💰 .double - Double down\n  🏳️ .surrender - Fold (get half back)',
        actionsWithSplit: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Actions:\n  🃏 .hit - Draw card\n  ✋ .stand - Hold\n  💰 .double - Double down\n  ✂️ .split - Split pair\n  🏳️ .surrender - Fold',
        actionsWithInsurance: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Actions:\n  🃏 .hit - Draw card\n  ✋ .stand - Hold\n  💰 .double - Double down\n  🛡️ .insurance - Insure against dealer blackjack\n  🏳️ .surrender - Fold',
        actionsWithBoth: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Actions:\n  🃏 .hit - Draw card\n  ✋ .stand - Hold\n  💰 .double - Double down\n  ✂️ .split - Split pair\n  🛡️ .insurance - Insure\n  🏳️ .surrender - Fold',
        yourTurn: '⏳ Your turn!',
        dealerTurn: '🎩 Dealer\'s turn...',
        blackjack: '🎉 ★ BLACKJACK! ★ 🎉',
        bust: '💥 BUST! Over 21!',
        youWin: '🎊 YOU WIN! 🎊',
        youLose: '😢 YOU LOSE',
        push: '🤝 PUSH - TIE',
        won: '✅ Won:',
        lost: '❌ Lost:',
        balance: '💵 Balance:',
        notEnough: '❌ Not enough coins!\n\n💵 Your balance:',
        invalidBet: '❌ Invalid bet!\n\n💰 Min: 10 coins\n💰 Max: 1000000000000000000 coins',
        noGame: '❌ No active game!\n\nStart with: .bj <bet>',
        alreadyPlaying: '⚠️ You already have an active game!',
        playingHand: '🎯 Playing Hand',
        insurancePaid: '🛡️ Insurance paid:',
        dealerHasBlackjack: '🎩 Dealer has BLACKJACK!',
        sideBets: '🎲 Side Bets:',
        perfectPairs: 'Perfect Pairs',
        twentyOnePlus3: '21+3',
        sideBetWin: '🎉 Side Bet Win!',
        sideBetLose: '❌ Side Bet Lost',
        multiHand: '🎰 Playing',
        hands: 'hands',
        currentHand: '▶️ HAND',
        completedHand: '✅ HAND',
        switchHand: 'Type .hand <number> to switch hands'
    },
    it: {
        usage: '🎰 BLACKJACK CASINO 🎰\n\nInizia partita:\n• .bj <puntata> - Gioca vs dealer\n• .bj <puntata> x2 - Gioca 2 mani contemporaneamente\n• .bj <puntata> x3 - Gioca 3 mani contemporaneamente\n• .bj <puntata> x4 - Gioca 4 mani contemporaneamente\n• .bj <puntata> x5 - Gioca 5 mani contemporaneamente\n• .bj <puntata> pp - Con scommessa Perfect Pairs\n• .bj <puntata> 21 - Con scommessa 21+3\n• .bj <puntata> x3 pp 21 - Multi-mano con scommesse\n\nMulti-mano:\n  • Gioca 2-5 mani simultaneamente\n  • Ogni mano costa l\'importo della puntata\n  • Gioca ogni mano indipendentemente\n  • Usa .hand <numero> per cambiare mano\n\nScommesse Laterali (costano 5 monete ciascuna):\n🎴 Perfect Pairs:\n  • Coppia Perfetta (stesso seme): 25:1\n  • Coppia Colorata (stesso colore): 12:1\n  • Coppia Mista (colore diverso): 6:1\n\n🃏 21+3 (tue 2 carte + carta scoperta dealer):\n  • Tris Stesso Seme: 100:1\n  • Scala Colore: 40:1\n  • Tris: 30:1\n  • Scala: 10:1\n  • Colore: 5:1\n\nDurante il gioco:\n• .hit - Pesca carta 🃏\n• .stand - Mantieni mano ✋\n• .double - Raddoppia puntata 💰\n• .split - Dividi coppie in 2 mani ✂️\n• .insurance - Assicurati contro blackjack dealer 🛡️\n• .surrender - Arrenditi, recupera metà puntata 🏳️\n• .hand <1-5> - Passa a mano diversa\n\nPuntata: 10-500 monete\nBlackjack paga 2.5x!',
        title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━',
        player: '👤 Giocatore:',
        yourCards: '👤 LE TUE CARTE',
        hand1: '👤 MANO 1',
        hand2: '👤 MANO 2',
        dealerCards: '🎩 DEALER',
        bet: '💰 Puntata:',
        hidden: '🎴',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Azioni:\n  🃏 .hit - Pesca carta\n  ✋ .stand - Mantieni\n  💰 .double - Raddoppia\n  🏳️ .surrender - Arrenditi (recupera metà)',
        actionsWithSplit: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Azioni:\n  🃏 .hit - Pesca carta\n  ✋ .stand - Mantieni\n  💰 .double - Raddoppia\n  ✂️ .split - Dividi coppia\n  🏳️ .surrender - Arrenditi',
        actionsWithInsurance: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Azioni:\n  🃏 .hit - Pesca carta\n  ✋ .stand - Mantieni\n  💰 .double - Raddoppia\n  🛡️ .insurance - Assicurati contro blackjack dealer\n  🏳️ .surrender - Arrenditi',
        actionsWithBoth: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Azioni:\n  🃏 .hit - Pesca carta\n  ✋ .stand - Mantieni\n  💰 .double - Raddoppia\n  ✂️ .split - Dividi coppia\n  🛡️ .insurance - Assicurati\n  🏳️ .surrender - Arrenditi',
        yourTurn: '⏳ Il tuo turno!',
        dealerTurn: '🎩 Turno dealer...',
        blackjack: '🎉 ★ BLACKJACK! ★ 🎉',
        bust: '💥 SBALLATO! Oltre 21!',
        youWin: '🎊 HAI VINTO! 🎊',
        youLose: '😢 HAI PERSO',
        push: '🤝 PAREGGIO',
        won: '✅ Vinto:',
        lost: '❌ Perso:',
        balance: '💵 Saldo:',
        notEnough: '❌ Monete insufficienti!\n\n💵 Il tuo saldo:',
        invalidBet: '❌ Puntata non valida!\n\n💰 Min: 10 monete\n💰 Max: 1000000000000000000 monete',
        noGame: '❌ Nessun gioco attivo!\n\nInizia con: .bj <puntata>',
        alreadyPlaying: '⚠️ Hai già un gioco attivo!',
        playingHand: '🎯 Giocando Mano',
        insurancePaid: '🛡️ Assicurazione pagata:',
        dealerHasBlackjack: '🎩 Dealer ha BLACKJACK!',
        sideBets: '🎲 Scommesse Laterali:',
        perfectPairs: 'Perfect Pairs',
        twentyOnePlus3: '21+3',
        sideBetWin: '🎉 Scommessa Laterale Vinta!',
        sideBetLose: '❌ Scommessa Laterale Persa',
        multiHand: '🎰 Giocando',
        hands: 'mani',
        currentHand: '▶️ MANO',
        completedHand: '✅ MANO',
        switchHand: 'Digita .hand <numero> per cambiare mano'
    },
    ru: {
        usage: '🎰 КАЗИНО БЛЭКДЖЕК 🎰\n\nНачать игру:\n• .bj <ставка> - Играть против дилера\n• .bj <ставка> x2 - Играть 2 руки одновременно\n• .bj <ставка> x3 - Играть 3 руки одновременно\n• .bj <ставка> x4 - Играть 4 руки одновременно\n• .bj <ставка> x5 - Играть 5 рук одновременно\n• .bj <ставка> pp - С боковой ставкой Perfect Pairs\n• .bj <ставка> 21 - С боковой ставкой 21+3\n• .bj <ставка> x3 pp 21 - Мульти-рука с боковыми ставками\n\nМульти-рука:\n  • Играйте 2-5 рук одновременно\n  • Каждая рука стоит сумму ставки\n  • Играйте каждую руку независимо\n  • Используйте .hand <номер> для смены руки\n\nБоковые Ставки (стоят 5 монет каждая):\n🎴 Perfect Pairs:\n  • Идеальная Пара (одна масть): 25:1\n  • Цветная Пара (один цвет): 12:1\n  • Смешанная Пара (разный цвет): 6:1\n\n🃏 21+3 (ваши 2 карты + открытая карта дилера):\n  • Три Одинаковых Масти: 100:1\n  • Стрит-Флеш: 40:1\n  • Три Одинаковых: 30:1\n  • Стрит: 10:1\n  • Флеш: 5:1\n\nВо время игры:\n• .hit - Взять карту 🃏\n• .stand - Остановиться ✋\n• .double - Удвоить ставку 💰\n• .split - Разделить пары на 2 руки ✂️\n• .insurance - Застраховаться от блэкджека дилера 🛡️\n• .surrender - Сдаться, вернуть половину ставки 🏳️\n• .hand <1-5> - Переключиться на другую руку\n\nСтавка: 10-500 монет\nБлэкджек платит 2.5x!',
        title: '━━━━━ 🎰 БЛЭКДЖЕК 🎰 ━━━━━',
        player: '👤 Игрок:',
        yourCards: '👤 ВАШИ КАРТЫ',
        hand1: '👤 РУКА 1',
        hand2: '👤 РУКА 2',
        dealerCards: '🎩 ДИЛЕР',
        bet: '💰 Ставка:',
        hidden: '🎴',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Действия:\n  🃏 .hit - Взять карту\n  ✋ .stand - Остановиться\n  💰 .double - Удвоить\n  🏳️ .surrender - Сдаться (вернуть половину)',
        actionsWithSplit: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Действия:\n  🃏 .hit - Взять карту\n  ✋ .stand - Остановиться\n  💰 .double - Удвоить\n  ✂️ .split - Разделить пару\n  🏳️ .surrender - Сдаться',
        actionsWithInsurance: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Действия:\n  🃏 .hit - Взять карту\n  ✋ .stand - Остановиться\n  💰 .double - Удвоить\n  🛡️ .insurance - Застраховаться от блэкджека дилера\n  🏳️ .surrender - Сдаться',
        actionsWithBoth: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Действия:\n  🃏 .hit - Взять карту\n  ✋ .stand - Остановиться\n  💰 .double - Удвоить\n  ✂️ .split - Разделить пару\n  🛡️ .insurance - Застраховаться\n  🏳️ .surrender - Сдаться',
        yourTurn: '⏳ Ваш ход!',
        dealerTurn: '🎩 Ход дилера...',
        blackjack: '🎉 ★ БЛЭКДЖЕК! ★ 🎉',
        bust: '💥 ПЕРЕБОР! Больше 21!',
        youWin: '🎊 ВЫ ВЫИГРАЛИ! 🎊',
        youLose: '😢 ВЫ ПРОИГРАЛИ',
        push: '🤝 НИЧЬЯ',
        won: '✅ Выиграно:',
        lost: '❌ Проиграно:',
        balance: '💵 Баланс:',
        notEnough: '❌ Недостаточно монет!\n\n💵 Ваш баланс:',
        invalidBet: '❌ Неверная ставка!\n\n💰 Мин: 10 монет\n💰 Макс: 1000000000000000000 монет',
        noGame: '❌ Нет активной игры!\n\nНачните с: .bj <ставка>',
        alreadyPlaying: '⚠️ У вас уже есть активная игра!',
        playingHand: '🎯 Играем Рукой',
        insurancePaid: '🛡️ Страховка выплачена:',
        dealerHasBlackjack: '🎩 У дилера БЛЭКДЖЕК!',
        sideBets: '🎲 Боковые Ставки:',
        perfectPairs: 'Perfect Pairs',
        twentyOnePlus3: '21+3',
        sideBetWin: '🎉 Боковая Ставка Выиграла!',
        sideBetLose: '❌ Боковая Ставка Проиграла',
        multiHand: '🎰 Играем',
        hands: 'рук',
        currentHand: '▶️ РУКА',
        completedHand: '✅ РУКА',
        switchHand: 'Введите .hand <номер> для смены руки'
    },
    es: {
        usage: '🎰 CASINO BLACKJACK 🎰\n\nIniciar juego:\n• .bj <apuesta> - Jugar vs crupier\n• .bj <apuesta> x2 - Jugar 2 manos a la vez\n• .bj <apuesta> x3 - Jugar 3 manos a la vez\n• .bj <apuesta> x4 - Jugar 4 manos a la vez\n• .bj <apuesta> x5 - Jugar 5 manos a la vez\n• .bj <apuesta> pp - Con apuesta lateral Perfect Pairs\n• .bj <apuesta> 21 - Con apuesta lateral 21+3\n• .bj <apuesta> x3 pp 21 - Multi-mano con apuestas laterales\n\nMulti-mano:\n  • Juega 2-5 manos simultáneamente\n  • Cada mano cuesta el monto de la apuesta\n  • Juega cada mano independientemente\n  • Usa .hand <número> para cambiar de mano\n\nApuestas Laterales (cuestan 5 monedas cada una):\n🎴 Perfect Pairs:\n  • Pareja Perfecta (mismo palo): 25:1\n  • Pareja de Color (mismo color): 12:1\n  • Pareja Mixta (diferente color): 6:1\n\n🃏 21+3 (tus 2 cartas + carta visible del crupier):\n  • Trío del Mismo Palo: 100:1\n  • Escalera de Color: 40:1\n  • Trío: 30:1\n  • Escalera: 10:1\n  • Color: 5:1\n\nDurante el juego:\n• .hit - Pedir carta 🃏\n• .stand - Plantarse ✋\n• .double - Doblar apuesta 💰\n• .split - Dividir parejas en 2 manos ✂️\n• .insurance - Asegurarse contra blackjack del crupier 🛡️\n• .surrender - Rendirse, recuperar mitad de apuesta 🏳️\n• .hand <1-5> - Cambiar a otra mano\n\nApuesta: 10-500 monedas\nBlackjack paga 2.5x!',
        title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━',
        player: '👤 Jugador:',
        yourCards: '👤 TUS CARTAS',
        hand1: '👤 MANO 1',
        hand2: '👤 MANO 2',
        dealerCards: '🎩 CRUPIER',
        bet: '💰 Apuesta:',
        hidden: '🎴',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Acciones:\n  🃏 .hit - Pedir carta\n  ✋ .stand - Plantarse\n  💰 .double - Doblar\n  🏳️ .surrender - Rendirse (recuperar mitad)',
        actionsWithSplit: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Acciones:\n  🃏 .hit - Pedir carta\n  ✋ .stand - Plantarse\n  💰 .double - Doblar\n  ✂️ .split - Dividir pareja\n  🏳️ .surrender - Rendirse',
        actionsWithInsurance: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Acciones:\n  🃏 .hit - Pedir carta\n  ✋ .stand - Plantarse\n  💰 .double - Doblar\n  🛡️ .insurance - Asegurarse contra blackjack del crupier\n  🏳️ .surrender - Rendirse',
        actionsWithBoth: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Acciones:\n  🃏 .hit - Pedir carta\n  ✋ .stand - Plantarse\n  💰 .double - Doblar\n  ✂️ .split - Dividir pareja\n  🛡️ .insurance - Asegurarse\n  🏳️ .surrender - Rendirse',
        yourTurn: '⏳ ¡Tu turno!',
        dealerTurn: '🎩 Turno del crupier...',
        blackjack: '🎉 ★ BLACKJACK! ★ 🎉',
        bust: '💥 ¡TE PASASTE! ¡Más de 21!',
        youWin: '🎊 ¡GANASTE! 🎊',
        youLose: '😢 PERDISTE',
        push: '🤝 EMPATE',
        won: '✅ Ganado:',
        lost: '❌ Perdido:',
        balance: '💵 Saldo:',
        notEnough: '❌ ¡No tienes suficientes monedas!\n\n💵 Tu saldo:',
        invalidBet: '❌ ¡Apuesta inválida!\n\n💰 Mín: 10 monedas\n💰 Máx: 1000000000000000000 monedas',
        noGame: '❌ ¡No hay juego activo!\n\nInicia con: .bj <apuesta>',
        alreadyPlaying: '⚠️ ¡Ya tienes un juego activo!',
        playingHand: '🎯 Jugando Mano',
        insurancePaid: '🛡️ Seguro pagado:',
        dealerHasBlackjack: '🎩 ¡El crupier tiene BLACKJACK!',
        sideBets: '🎲 Apuestas Laterales:',
        perfectPairs: 'Perfect Pairs',
        twentyOnePlus3: '21+3',
        sideBetWin: '🎉 ¡Apuesta Lateral Ganada!',
        sideBetLose: '❌ Apuesta Lateral Perdida',
        multiHand: '🎰 Jugando',
        hands: 'manos',
        currentHand: '▶️ MANO',
        completedHand: '✅ MANO',
        switchHand: 'Escribe .hand <número> para cambiar de mano'
    },
    pt: {
        usage: '🎰 CASINO BLACKJACK 🎰\n\nIniciar jogo:\n• .bj <aposta> - Jogar vs dealer\n• .bj <aposta> x2 - Jogar 2 mãos ao mesmo tempo\n• .bj <aposta> x3 - Jogar 3 mãos ao mesmo tempo\n• .bj <aposta> x4 - Jogar 4 mãos ao mesmo tempo\n• .bj <aposta> x5 - Jogar 5 mãos ao mesmo tempo\n• .bj <aposta> pp - Com aposta lateral Perfect Pairs\n• .bj <aposta> 21 - Com aposta lateral 21+3\n• .bj <aposta> x3 pp 21 - Multi-mão com apostas laterais\n\nMulti-mão:\n  • Jogue 2-5 mãos simultaneamente\n  • Cada mão custa o valor da aposta\n  • Jogue cada mão independentemente\n  • Use .hand <número> para trocar de mão\n\nApostas Laterais (custam 5 moedas cada):\n🎴 Perfect Pairs:\n  • Par Perfeito (mesmo naipe): 25:1\n  • Par Colorido (mesma cor): 12:1\n  • Par Misto (cor diferente): 6:1\n\n🃏 21+3 (suas 2 cartas + carta visível do dealer):\n  • Trinca do Mesmo Naipe: 100:1\n  • Sequência de Cor: 40:1\n  • Trinca: 30:1\n  • Sequência: 10:1\n  • Flush: 5:1\n\nDurante o jogo:\n• .hit - Pedir carta 🃏\n• .stand - Parar ✋\n• .double - Dobrar aposta 💰\n• .split - Dividir pares em 2 mãos ✂️\n• .insurance - Segurar contra blackjack do dealer 🛡️\n• .surrender - Desistir, recuperar metade da aposta 🏳️\n• .hand <1-5> - Mudar para outra mão\n\nAposta: 10-500 moedas\nBlackjack paga 2.5x!',
        title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━',
        player: '👤 Jogador:',
        yourCards: '👤 SUAS CARTAS',
        hand1: '👤 MÃO 1',
        hand2: '👤 MÃO 2',
        dealerCards: '🎩 DEALER',
        bet: '💰 Aposta:',
        hidden: '🎴',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Ações:\n  🃏 .hit - Pedir carta\n  ✋ .stand - Parar\n  💰 .double - Dobrar\n  🏳️ .surrender - Desistir (recuperar metade)',
        actionsWithSplit: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Ações:\n  🃏 .hit - Pedir carta\n  ✋ .stand - Parar\n  💰 .double - Dobrar\n  ✂️ .split - Dividir par\n  🏳️ .surrender - Desistir',
        actionsWithInsurance: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Ações:\n  🃏 .hit - Pedir carta\n  ✋ .stand - Parar\n  💰 .double - Dobrar\n  🛡️ .insurance - Segurar contra blackjack do dealer\n  🏳️ .surrender - Desistir',
        actionsWithBoth: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Ações:\n  🃏 .hit - Pedir carta\n  ✋ .stand - Parar\n  💰 .double - Dobrar\n  ✂️ .split - Dividir par\n  🛡️ .insurance - Segurar\n  🏳️ .surrender - Desistir',
        yourTurn: '⏳ Sua vez!',
        dealerTurn: '🎩 Vez do dealer...',
        blackjack: '🎉 ★ BLACKJACK! ★ 🎉',
        bust: '💥 ESTOUROU! Mais de 21!',
        youWin: '🎊 VOCÊ GANHOU! 🎊',
        youLose: '😢 VOCÊ PERDEU',
        push: '🤝 EMPATE',
        won: '✅ Ganho:',
        lost: '❌ Perdido:',
        balance: '💵 Saldo:',
        notEnough: '❌ Moedas insuficientes!\n\n💵 Seu saldo:',
        invalidBet: '❌ Aposta inválida!\n\n💰 Mín: 10 moedas\n💰 Máx: 1000000000000000000 moedas',
        noGame: '❌ Nenhum jogo ativo!\n\nInicie com: .bj <aposta>',
        alreadyPlaying: '⚠️ Você já tem um jogo ativo!',
        playingHand: '🎯 Jogando Mão',
        insurancePaid: '🛡️ Seguro pago:',
        dealerHasBlackjack: '🎩 Dealer tem BLACKJACK!',
        sideBets: '🎲 Apostas Laterais:',
        perfectPairs: 'Perfect Pairs',
        twentyOnePlus3: '21+3',
        sideBetWin: '🎉 Aposta Lateral Ganha!',
        sideBetLose: '❌ Aposta Lateral Perdida',
        multiHand: '🎰 Jogando',
        hands: 'mãos',
        currentHand: '▶️ MÃO',
        completedHand: '✅ MÃO',
        switchHand: 'Digite .hand <número> para trocar de mão'
    },
    ar: {
        usage: '🎰 كازينو بلاك جاك 🎰\n\nابدأ اللعبة:\n• .bj <رهان> - العب ضد الموزع\n• .bj <رهان> x2 - العب يدين في نفس الوقت\n• .bj <رهان> x3 - العب 3 أيدي في نفس الوقت\n• .bj <رهان> x4 - العب 4 أيدي في نفس الوقت\n• .bj <رهان> x5 - العب 5 أيدي في نفس الوقت\n• .bj <رهان> pp - مع رهان جانبي Perfect Pairs\n• .bj <رهان> 21 - مع رهان جانبي 21+3\n• .bj <رهان> x3 pp 21 - أيدي متعددة مع رهانات جانبية\n\nأيدي متعددة:\n  • العب 2-5 أيدي في نفس الوقت\n  • كل يد تكلف مبلغ الرهان\n  • العب كل يد بشكل مستقل\n  • استخدم .hand <رقم> لتبديل الأيدي\n\nرهانات جانبية (تكلف 5 عملات لكل واحدة):\n🎴 Perfect Pairs:\n  • زوج مثالي (نفس النوع): 25:1\n  • زوج ملون (نفس اللون): 12:1\n  • زوج مختلط (لون مختلف): 6:1\n\n🃏 21+3 (ورقتيك + ورقة الموزع المكشوفة):\n  • ثلاثة من نفس النوع: 100:1\n  • سلسلة ملونة: 40:1\n  • ثلاثة متشابهة: 30:1\n  • سلسلة: 10:1\n  • فلاش: 5:1\n\nأثناء اللعبة:\n• .hit - اسحب ورقة 🃏\n• .stand - توقف ✋\n• .double - ضاعف الرهان 💰\n• .split - قسم الأزواج إلى يدين ✂️\n• .insurance - تأمين ضد بلاك جاك الموزع 🛡️\n• .surrender - استسلم، استرجع نصف الرهان 🏳️\n• .hand <1-5> - انتقل ليد تانية\n\nالرهان: 10-500 عملة\nبلاك جاك يدفع 2.5x!',
        title: '━━━━━ 🎰 بلاك جاك 🎰 ━━━━━',
        player: '👤 اللاعب:',
        yourCards: '👤 أوراقك',
        hand1: '👤 اليد 1',
        hand2: '👤 اليد 2',
        dealerCards: '🎩 الموزع',
        bet: '💰 الرهان:',
        hidden: '🎴',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 الإجراءات:\n  🃏 .hit - اسحب ورقة\n  ✋ .stand - توقف\n  💰 .double - ضاعف\n  🏳️ .surrender - استسلم (استرجع النص)',
        actionsWithSplit: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 الإجراءات:\n  🃏 .hit - اسحب ورقة\n  ✋ .stand - توقف\n  💰 .double - ضاعف\n  ✂️ .split - قسم الزوج\n  🏳️ .surrender - استسلم',
        actionsWithInsurance: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 الإجراءات:\n  🃏 .hit - اسحب ورقة\n  ✋ .stand - توقف\n  💰 .double - ضاعف\n  🛡️ .insurance - تأمين ضد بلاك جاك الموزع\n  🏳️ .surrender - استسلم',
        actionsWithBoth: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 الإجراءات:\n  🃏 .hit - اسحب ورقة\n  ✋ .stand - توقف\n  💰 .double - ضاعف\n  ✂️ .split - قسم الزوج\n  🛡️ .insurance - تأمين\n  🏳️ .surrender - استسلم',
        yourTurn: '⏳ دورك!',
        dealerTurn: '🎩 دور الموزع...',
        blackjack: '🎉 ★ بلاك جاك! ★ 🎉',
        bust: '💥 خسرت! أكتر من 21!',
        youWin: '🎊 انت كسبت! 🎊',
        youLose: '😢 انت خسرت',
        push: '🤝 تعادل',
        won: '✅ كسبت:',
        lost: '❌ خسرت:',
        balance: '💵 الرصيد:',
        notEnough: '❌ عملات مش كفاية!\n\n💵 رصيدك:',
        invalidBet: '❌ رهان غلط!\n\n💰 الحد الأدنى: 10 عملات\n💰 الحد الأقصى: 1000000000000000000 عملة',
        noGame: '❌ مافيش لعبة نشطة!\n\nابدأ بـ: .bj <رهان>',
        alreadyPlaying: '⚠️ عندك لعبة نشطة بالفعل!',
        playingHand: '🎯 بتلعب اليد',
        insurancePaid: '🛡️ التأمين اتدفع:',
        dealerHasBlackjack: '🎩 الموزع عنده بلاك جاك!',
        sideBets: '🎲 رهانات جانبية:',
        perfectPairs: 'Perfect Pairs',
        twentyOnePlus3: '21+3',
        sideBetWin: '🎉 الرهان الجانبي كسب!',
        sideBetLose: '❌ الرهان الجانبي خسر',
        multiHand: '🎰 بتلعب',
        hands: 'أيدي',
        currentHand: '▶️ اليد',
        completedHand: '✅ اليد',
        switchHand: 'اكتب .hand <رقم> لتبديل الأيدي'
    },
    hi: {
        usage: '🎰 ब्लैकजैक कैसीनो 🎰\n\nगेम शुरू करें:\n• .bj <बेट> - डीलर के खिलाफ खेलें\n• .bj <बेट> x2 - एक साथ 2 हाथ खेलें\n• .bj <बेट> x3 - एक साथ 3 हाथ खेलें\n• .bj <बेट> x4 - एक साथ 4 हाथ खेलें\n• .bj <बेट> x5 - एक साथ 5 हाथ खेलें\n• .bj <बेट> pp - परफेक्ट पेयर्स साइड बेट के साथ\n• .bj <बेट> 21 - 21+3 साइड बेट के साथ\n• .bj <बेट> x3 pp 21 - साइड बेट्स के साथ मल्टी-हैंड\n\nमल्टी-हैंड:\n  • एक साथ 2-5 हाथ खेलें\n  • प्रत्येक हाथ की लागत बेट राशि है\n  • प्रत्येक हाथ स्वतंत्र रूप से खेलें\n  • हाथ बदलने के लिए .hand <नंबर> का उपयोग करें\n\nसाइड बेट्स (प्रत्येक की लागत 5 सिक्के):\n🎴 परफेक्ट पेयर्स:\n  • परफेक्ट पेयर (समान सूट): 25:1\n  • कलर्ड पेयर (समान रंग): 12:1\n  • मिक्स्ड पेयर (अलग रंग): 6:1\n\n🃏 21+3 (आपके 2 कार्ड + डीलर का ऊपरी कार्ड):\n  • सूटेड ट्रिप्स: 100:1\n  • स्ट्रेट फ्लश: 40:1\n  • थ्री ऑफ ए काइंड: 30:1\n  • स्ट्रेट: 10:1\n  • फ्लश: 5:1\n\nगेम के दौरान:\n• .hit - कार्ड लें 🃏\n• .stand - हाथ रखें ✋\n• .double - बेट दोगुनी करें 💰\n• .split - जोड़ों को 2 हाथों में विभाजित करें ✂️\n• .insurance - डीलर ब्लैकजैक के खिलाफ बीमा 🛡️\n• .surrender - हार मानें, आधी बेट वापस पाएं 🏳️\n• .hand <1-5> - अलग हाथ पर स्विच करें\n\nबेट: 10-500 सिक्के\nब्लैकजैक 2.5x देता है!',
        title: '━━━━━ 🎰 ब्लैकजैक 🎰 ━━━━━',
        player: '👤 खिलाड़ी:',
        yourCards: '👤 आपके कार्ड',
        hand1: '👤 हाथ 1',
        hand2: '👤 हाथ 2',
        dealerCards: '🎩 डीलर',
        bet: '💰 बेट:',
        hidden: '🎴',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 कार्रवाइयां:\n  🃏 .hit - कार्ड लें\n  ✋ .stand - रुकें\n  💰 .double - दोगुना करें\n  🏳️ .surrender - हार मानें (आधा वापस)',
        actionsWithSplit: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 कार्रवाइयां:\n  🃏 .hit - कार्ड लें\n  ✋ .stand - रुकें\n  💰 .double - दोगुना करें\n  ✂️ .split - जोड़ी विभाजित करें\n  🏳️ .surrender - हार मानें',
        actionsWithInsurance: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 कार्रवाइयां:\n  🃏 .hit - कार्ड लें\n  ✋ .stand - रुकें\n  💰 .double - दोगुना करें\n  🛡️ .insurance - डीलर ब्लैकजैक के खिलाफ बीमा\n  🏳️ .surrender - हार मानें',
        actionsWithBoth: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 कार्रवाइयां:\n  🃏 .hit - कार्ड लें\n  ✋ .stand - रुकें\n  💰 .double - दोगुना करें\n  ✂️ .split - जोड़ी विभाजित करें\n  🛡️ .insurance - बीमा\n  🏳️ .surrender - हार मानें',
        yourTurn: '⏳ आपकी बारी!',
        dealerTurn: '🎩 डीलर की बारी...',
        blackjack: '🎉 ★ ब्लैकजैक! ★ 🎉',
        bust: '💥 बस्ट! 21 से अधिक!',
        youWin: '🎊 आप जीते! 🎊',
        youLose: '😢 आप हारे',
        push: '🤝 पुश - टाई',
        won: '✅ जीता:',
        lost: '❌ हारा:',
        balance: '💵 बैलेंस:',
        notEnough: '❌ पर्याप्त सिक्के नहीं!\n\n💵 आपका बैलेंस:',
        invalidBet: '❌ अमान्य बेट!\n\n💰 न्यूनतम: 10 सिक्के\n💰 अधिकतम: 1000000000000000000 सिक्के',
        noGame: '❌ कोई सक्रिय गेम नहीं!\n\nशुरू करें: .bj <बेट>',
        alreadyPlaying: '⚠️ आपके पास पहले से एक सक्रिय गेम है!',
        playingHand: '🎯 हाथ खेल रहे हैं',
        insurancePaid: '🛡️ बीमा भुगतान:',
        dealerHasBlackjack: '🎩 डीलर के पास ब्लैकजैक है!',
        sideBets: '🎲 साइड बेट्स:',
        perfectPairs: 'परफेक्ट पेयर्स',
        twentyOnePlus3: '21+3',
        sideBetWin: '🎉 साइड बेट जीत!',
        sideBetLose: '❌ साइड बेट हारा',
        multiHand: '🎰 खेल रहे हैं',
        hands: 'हाथ',
        currentHand: '▶️ हाथ',
        completedHand: '✅ हाथ',
        switchHand: 'हाथ बदलने के लिए .hand <नंबर> टाइप करें'
    },
    ng: {
        usage: '🎰 BLACKJACK CASINO 🎰\n\nStart game:\n• .bj <bet> - Play vs dealer\n• .bj <bet> x2 - Play 2 hands at once\n• .bj <bet> x3 - Play 3 hands at once\n• .bj <bet> x4 - Play 4 hands at once\n• .bj <bet> x5 - Play 5 hands at once\n• .bj <bet> pp - With Perfect Pairs side bet\n• .bj <bet> 21 - With 21+3 side bet\n• .bj <bet> x3 pp 21 - Multi-hand with side bets\n\nMulti-hand:\n  • Play 2-5 hands at once\n  • Each hand go cost the bet amount\n  • Play each hand separately\n  • Use .hand <number> make you switch hands\n\nSide Bets (cost 5 coins each):\n🎴 Perfect Pairs:\n  • Perfect Pair (same suit): 25:1\n  • Colored Pair (same color): 12:1\n  • Mixed Pair (different color): 6:1\n\n🃏 21+3 (your 2 cards + dealer up card):\n  • Suited Trips: 100:1\n  • Straight Flush: 40:1\n  • Three of a Kind: 30:1\n  • Straight: 10:1\n  • Flush: 5:1\n\nDuring game:\n• .hit - Draw card 🃏\n• .stand - Keep hand ✋\n• .double - Double bet & draw 💰\n• .split - Split pairs into 2 hands ✂️\n• .insurance - Insure against dealer blackjack 🛡️\n• .surrender - Give up, get half bet back 🏳️\n• .hand <1-5> - Switch to different hand\n\nBet: 10-500 coins\nBlackjack dey pay 2.5x!',
        title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━',
        player: '👤 Player:',
        yourCards: '👤 YOUR CARDS',
        hand1: '👤 HAND 1',
        hand2: '👤 HAND 2',
        dealerCards: '🎩 DEALER',
        bet: '💰 Bet:',
        hidden: '🎴',
        actions: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Wetin You Fit Do:\n  🃏 .hit - Draw card\n  ✋ .stand - Hold\n  💰 .double - Double down\n  🏳️ .surrender - Fold (get half back)',
        actionsWithSplit: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Wetin You Fit Do:\n  🃏 .hit - Draw card\n  ✋ .stand - Hold\n  💰 .double - Double down\n  ✂️ .split - Split pair\n  🏳️ .surrender - Fold',
        actionsWithInsurance: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Wetin You Fit Do:\n  🃏 .hit - Draw card\n  ✋ .stand - Hold\n  💰 .double - Double down\n  🛡️ .insurance - Insure against dealer blackjack\n  🏳️ .surrender - Fold',
        actionsWithBoth: '\n\n━━━━━━━━━━━━━━━━━━━━━\n💡 Wetin You Fit Do:\n  🃏 .hit - Draw card\n  ✋ .stand - Hold\n  💰 .double - Double down\n  ✂️ .split - Split pair\n  🛡️ .insurance - Insure\n  🏳️ .surrender - Fold',
        yourTurn: '⏳ Your turn!',
        dealerTurn: '🎩 Dealer turn...',
        blackjack: '🎉 ★ BLACKJACK! ★ 🎉',
        bust: '💥 BUST! Pass 21!',
        youWin: '🎊 YOU WIN! 🎊',
        youLose: '😢 YOU LOSE',
        push: '🤝 PUSH - TIE',
        won: '✅ You win:',
        lost: '❌ You lose:',
        balance: '💵 Balance:',
        notEnough: '❌ Coins no reach!\n\n💵 Your balance:',
        invalidBet: '❌ Bet no correct!\n\n💰 Min: 10 coins\n💰 Max: 1000000000000000000 coins',
        noGame: '❌ No active game!\n\nStart with: .bj <bet>',
        alreadyPlaying: '⚠️ You get active game already!',
        playingHand: '🎯 Playing Hand',
        insurancePaid: '🛡️ Insurance paid:',
        dealerHasBlackjack: '🎩 Dealer get BLACKJACK!',
        sideBets: '🎲 Side Bets:',
        perfectPairs: 'Perfect Pairs',
        twentyOnePlus3: '21+3',
        sideBetWin: '🎉 Side Bet Win!',
        sideBetLose: '❌ Side Bet Lost',
        multiHand: '🎰 Playing',
        hands: 'hands',
        currentHand: '▶️ HAND',
        completedHand: '✅ HAND',
        switchHand: 'Type .hand <number> make you switch hands'
    }
};

const suits = ['♠️', '♥️', '♣️', '♦️'];
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function createDeck() {
    const deck = [];
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({ rank, suit });
        }
    }
    return shuffleDeck(deck);
}

function shuffleDeck(deck) {
    // Use cryptographically secure shuffle
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

// Old display functions removed - now using cardDisplay.js

function canSplit(hand) {
    if (hand.length !== 2) return false;
    const rank1 = hand[0].rank;
    const rank2 = hand[1].rank;
    // Can split if same rank, or both are 10-value cards
    if (rank1 === rank2) return true;
    const tenValues = ['10', 'J', 'Q', 'K'];
    return tenValues.includes(rank1) && tenValues.includes(rank2);
}

function dealerShouldHit(hand) {
    const total = calculateHandValue(hand);
    return total < 17;
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
        
        // FIX BUG #3: Complete coin translations for all languages
        const coinTranslations = {
            it: 'monete',
            ru: 'монет',
            es: 'monedas',
            pt: 'moedas',
            ar: 'عملات',
            hi: 'सिक्के',
            ng: 'coins',
            en: 'coins'
        };
        const coins = coinTranslations[lang] || 'coins';
        
        // Check if already playing
        if (activeGames.has(sender)) {
            return await sock.sendMessage(from, { text: t.alreadyPlaying });
        }
        
        if (args.length === 0) {
            return await sock.sendMessage(from, { text: t.usage });
        }
        
        // Handle both ".bj 20" and ".bj bet 20" and side bets and multi-hand
        let betAmount = args[0];
        let sideBetPP = false;
        let sideBet21Plus3 = false;
        let numHands = 1;
        
        if (args[0].toLowerCase() === 'bet' && args.length > 1) {
            betAmount = args[1];
            // Check for side bets and multi-hand after "bet"
            if (args.length > 2) {
                sideBetPP = args.slice(2).some(arg => arg.toLowerCase() === 'pp');
                sideBet21Plus3 = args.slice(2).some(arg => arg === '21');
                const multiHandArg = args.slice(2).find(arg => arg.toLowerCase().startsWith('x'));
                if (multiHandArg) {
                    numHands = parseInt(multiHandArg.substring(1)) || 1;
                }
            }
        } else {
            // Check for side bets and multi-hand in normal format
            if (args.length > 1) {
                sideBetPP = args.slice(1).some(arg => arg.toLowerCase() === 'pp');
                sideBet21Plus3 = args.slice(1).some(arg => arg === '21');
                const multiHandArg = args.slice(1).find(arg => arg.toLowerCase().startsWith('x'));
                if (multiHandArg) {
                    numHands = parseInt(multiHandArg.substring(1)) || 1;
                }
            }
        }
        
        // Validate number of hands - FIX BUG #2: Inform user instead of silent change
        if (numHands < 1 || numHands > 5) {
            const errorMsg = lang === 'it' ? `❌ Numero di mani non valido! Deve essere tra 1-5.\n\n🎯 Hai richiesto: x${numHands}` :
                           lang === 'ru' ? `❌ Неверное количество рук! Должно быть от 1 до 5.\n\n🎯 Вы запросили: x${numHands}` :
                           lang === 'es' ? `❌ ¡Número de manos inválido! Debe estar entre 1-5.\n\n🎯 Solicitaste: x${numHands}` :
                           lang === 'pt' ? `❌ Número de mãos inválido! Deve estar entre 1-5.\n\n🎯 Você solicitou: x${numHands}` :
                           lang === 'ar' ? `❌ عدد الأيدي غير صالح! يجب أن يكون بين 1-5.\n\n🎯 طلبت: x${numHands}` :
                           lang === 'hi' ? `❌ हाथों की संख्या अमान्य! 1-5 के बीच होनी चाहिए।\n\n🎯 आपने अनुरोध किया: x${numHands}` :
                           `❌ Invalid number of hands! Must be between 1-5.\n\n🎯 You requested: x${numHands}`;
            return await sock.sendMessage(from, { text: errorMsg });
        }
        
        const bet = parseInt(betAmount);
        
        // FIX BUG #4: CRITICAL SECURITY - Use MAX_SAFE_INTEGER to prevent infinite money glitch
        const MIN_BET = 10;
        const MAX_BET = Math.min(MAX_COIN_AMOUNT, Number.MAX_SAFE_INTEGER);
        
        // Validate bet is a safe integer
        if (isNaN(bet) || !Number.isSafeInteger(bet) || bet < MIN_BET || bet > MAX_BET) {
            const errorMsg = lang === 'it' ? `❌ Puntata non valida!\n\n💰 Min: ${MIN_BET} monete\n💰 Max: ${MAX_BET.toLocaleString()} monete` :
                           lang === 'ru' ? `❌ Неверная ставка!\n\n💰 Мин: ${MIN_BET} монет\n💰 Макс: ${MAX_BET.toLocaleString()} монет` :
                           lang === 'es' ? `❌ ¡Apuesta inválida!\n\n💰 Mín: ${MIN_BET} monedas\n💰 Máx: ${MAX_BET.toLocaleString()} monedas` :
                           lang === 'pt' ? `❌ Aposta inválida!\n\n💰 Mín: ${MIN_BET} moedas\n💰 Máx: ${MAX_BET.toLocaleString()} moedas` :
                           lang === 'ar' ? `❌ رهان غير صالح!\n\n💰 الحد الأدنى: ${MIN_BET} عملات\n💰 الحد الأقصى: ${MAX_BET.toLocaleString()} عملة` :
                           lang === 'hi' ? `❌ अमान्य बेट!\n\n💰 न्यूनतम: ${MIN_BET} सिक्के\n💰 अधिकतम: ${MAX_BET.toLocaleString()} सिक्के` :
                           `❌ Invalid bet!\n\n💰 Min: ${MIN_BET} coins\n💰 Max: ${MAX_BET.toLocaleString()} coins`;
            return await sock.sendMessage(from, { text: errorMsg });
        }
        
        // Calculate total cost including side bets and multiple hands
        const sideBetCost = 5;
        let totalCost = bet * numHands;
        if (sideBetPP) totalCost += (sideBetCost * numHands);
        if (sideBet21Plus3) totalCost += (sideBetCost * numHands);
        
        if (!await hasEnough(sender, totalCost)) {
            const balance = await getBalance(sender);
            return await sock.sendMessage(from, { 
                text: `${t.notEnough} ${balance} ${coins}`
            });
        }
        
        await removeCoins(sender, totalCost);
        recordWager(sender, bet);
        
        const deck = createDeck();
        
        // For multi-hand, deal all hands at once (no animation)
        if (numHands > 1) {
            const multiHands = [];
            const dealerHand = [deck.pop(), deck.pop()];
            
            // FIX BUG #1: Batch all side bet winnings to avoid multiple async calls
            let totalSideBetWinnings = 0;
            
            // Deal cards to each hand
            for (let i = 0; i < numHands; i++) {
                const hand = [deck.pop(), deck.pop()];
                const total = calculateHandValue(hand);
                
                // Check side bets for this hand
                let handSideBetResults = {
                    pp: null,
                    twentyOne: null,
                    totalWon: 0
                };
                
                if (sideBetPP) {
                    const ppResult = checkPerfectPairs(hand);
                    if (ppResult) {
                        const ppWin = sideBetCost * ppResult.payout;
                        totalSideBetWinnings += ppWin + sideBetCost; // Accumulate instead of immediate await
                        handSideBetResults.pp = { result: ppResult, win: ppWin };
                        handSideBetResults.totalWon += ppWin;
                    }
                }
                
                if (sideBet21Plus3) {
                    const plus3Result = check21Plus3(hand, dealerHand[0]);
                    if (plus3Result) {
                        const plus3Win = sideBetCost * plus3Result.payout;
                        totalSideBetWinnings += plus3Win + sideBetCost; // Accumulate instead of immediate await
                        handSideBetResults.twentyOne = { result: plus3Result, win: plus3Win };
                        handSideBetResults.totalWon += plus3Win;
                    }
                }
                
                multiHands.push({
                    cards: hand,
                    total,
                    status: total === 21 ? 'blackjack' : 'active',
                    sideBetResults: handSideBetResults,
                    bet
                });
            }
            
            // Single batched coin addition for all side bet winnings
            if (totalSideBetWinnings > 0) {
                await addCoins(sender, totalSideBetWinnings);
            }
            
            activeGames.set(sender, {
                bet,
                deck,
                dealerHand,
                groupJid: from,
                lang,
                pushName,
                dealerShowsAce: dealerHand[0].rank === 'A',
                insuranceTaken: false,
                multiHands,
                currentHandIndex: 0,
                numHands,
                sideBetPP,
                sideBet21Plus3,
                startTime: Date.now(), // Track game start time
                lastActivity: Date.now() // Track last activity for cleanup
            });
            
            // Display all hands
            let gameText = `${t.title}\n${t.player} ${pushName}\n\n${t.multiHand} ${numHands} ${t.hands}\n${t.bet} ${bet * numHands} ${coins}\n\n`;
            
            // Show each hand
            for (let i = 0; i < multiHands.length; i++) {
                const hand = multiHands[i];
                const handLabel = i === 0 ? `${t.currentHand} ${i + 1}` : `HAND ${i + 1}`;
                gameText += getHandDisplayCompact(hand.cards, hand.total, handLabel);
                
                // Show side bet results for this hand
                if (hand.sideBetResults.pp || hand.sideBetResults.twentyOne) {
                    gameText += '\n  ';
                    if (hand.sideBetResults.pp) {
                        const ppText = getSideBetText('perfectPairs', hand.sideBetResults.pp.result, lang);
                        gameText += `${ppText} +${hand.sideBetResults.pp.win} `;
                    }
                    if (hand.sideBetResults.twentyOne) {
                        const plus3Text = getSideBetText('21plus3', hand.sideBetResults.twentyOne.result, lang);
                        gameText += `${plus3Text} +${hand.sideBetResults.twentyOne.win}`;
                    }
                }
                
                gameText += '\n\n';
            }
            
            const dealerVisible = calculateHandValue([dealerHand[1]]);
            gameText += getHandDisplay(dealerHand, dealerVisible, t.dealerCards, true);
            
            // Check if all hands have blackjack
            const allBlackjack = multiHands.every(h => h.status === 'blackjack');
            if (allBlackjack) {
                // Resolve all hands immediately
                const dealerTotal = calculateHandValue(dealerHand);
                gameText += `\n\n${t.dealerCards}\n`;
                gameText += getHandDisplay(dealerHand, dealerTotal, t.dealerCards);
                gameText += '\n\n━━━━━━━━━━━━━━━━━━━━━\n';
                
                let totalWinnings = 0;
                if (dealerTotal === 21) {
                    // All push
                    totalWinnings = bet * numHands;
                    await addCoins(sender, totalWinnings);
                    for (let i = 0; i < numHands; i++) {
                        recordPush(sender);
                    }
                    gameText += `${t.push}\n`;
                } else {
                    // All win
                    const winPerHand = Math.floor(bet * 2.5);
                    totalWinnings = winPerHand * numHands;
                    await addCoins(sender, totalWinnings);
                    for (let i = 0; i < numHands; i++) {
                        recordWin(sender, winPerHand - bet, true);
                    }
                    gameText += `${t.blackjack}\n${t.youWin}\n${t.won} +${totalWinnings} ${coins}\n`;
                }
                
                gameText += `━━━━━━━━━━━━━━━━━━━━━\n\n${t.balance} ${await getBalance(sender)} ${coins}`;
                activeGames.delete(sender);
            } else {
                // Show actions for first hand
                gameText += '\n\n━━━━━━━━━━━━━━━━━━━━━\n';
                gameText += `${t.currentHand} 1\n`;
                gameText += t.actions;
            }
            
            await sock.sendMessage(from, { text: gameText });
            return;
        }
        
        // Single hand logic - deal all cards at once
        
        // Deal all cards
        const playerHand = [deck.pop(), deck.pop()];
        const dealerHand = [deck.pop(), deck.pop()];
        const playerTotal = calculateHandValue(playerHand);
        const dealerVisible = calculateHandValue([dealerHand[1]]);
        
        // Check side bets
        let sideBetResults = {
            pp: null,
            twentyOne: null,
            totalWon: 0
        };
        
        if (sideBetPP) {
            const ppResult = checkPerfectPairs(playerHand);
            if (ppResult) {
                const ppWin = sideBetCost * ppResult.payout;
                await addCoins(sender, ppWin + sideBetCost); // Return bet + winnings
                sideBetResults.pp = { result: ppResult, win: ppWin };
                sideBetResults.totalWon += ppWin;
            }
        }
        
        if (sideBet21Plus3) {
            const plus3Result = check21Plus3(playerHand, dealerHand[0]);
            if (plus3Result) {
                const plus3Win = sideBetCost * plus3Result.payout;
                await addCoins(sender, plus3Win + sideBetCost); // Return bet + winnings
                sideBetResults.twentyOne = { result: plus3Result, win: plus3Win };
                sideBetResults.totalWon += plus3Win;
            }
        }
        
        activeGames.set(sender, {
            bet,
            deck,
            playerHand,
            dealerHand,
            groupJid: from,
            turnCount: 0,
            lang,
            pushName,
            dealerShowsAce: dealerHand[0].rank === 'A',
            insuranceTaken: false,
            sideBetPP,
            sideBet21Plus3,
            sideBetResults,
            startTime: Date.now(), // Track game start time
            lastActivity: Date.now() // Track last activity for cleanup
        });
        
        let gameText = `${t.title}\n${t.player} ${pushName}\n\n${t.bet} ${bet} ${coins}\n\n`;
        
        // Add dealer welcome message
        const welcomeMsg = getContextualMessage({ 
            action: 'start', 
            balance: await getBalance(sender),
            numHands: 1
        }, lang);
        if (welcomeMsg) {
            gameText += `${welcomeMsg}\n\n`;
        }
        
        // Show side bet results if any
        if (sideBetPP || sideBet21Plus3) {
            gameText += `${t.sideBets}\n`;
            
            // Add dealer message for side bet wins
            let sideBetWinType = null;
            if (sideBetResults.pp) sideBetWinType = { type: 'perfectPair' };
            else if (sideBetResults.twentyOne) sideBetWinType = { type: '21plus3' };
            
            if (sideBetWinType) {
                const sideBetMsg = getContextualMessage({ sideBetWin: sideBetWinType }, lang);
                if (sideBetMsg) {
                    gameText += `${sideBetMsg}\n`;
                }
            }
            
            if (sideBetPP) {
                if (sideBetResults.pp) {
                    const ppText = getSideBetText('perfectPairs', sideBetResults.pp.result, lang);
                    gameText += `  ${t.perfectPairs}: ${ppText}\n  💰 +${sideBetResults.pp.win} ${coins}\n`;
                } else {
                    gameText += `  ${t.perfectPairs}: ${t.sideBetLose}\n`;
                }
            }
            
            if (sideBet21Plus3) {
                if (sideBetResults.twentyOne) {
                    const plus3Text = getSideBetText('21plus3', sideBetResults.twentyOne.result, lang);
                    gameText += `  ${t.twentyOnePlus3}: ${plus3Text}\n  💰 +${sideBetResults.twentyOne.win} ${coins}\n`;
                } else {
                    gameText += `  ${t.twentyOnePlus3}: ${t.sideBetLose}\n`;
                }
            }
            
            gameText += '\n';
        }
        
        gameText += getHandDisplay(playerHand, playerTotal, t.yourCards);
        gameText += '\n\n';
        gameText += getHandDisplay(dealerHand, dealerVisible, t.dealerCards, true);
        
        if (playerTotal === 21) {
            const dealerTotal = calculateHandValue(dealerHand);
            gameText = `${t.title}\n${t.player} ${pushName}\n\n${t.bet} ${bet} ${coins}\n\n`;
            gameText += getHandDisplay(playerHand, playerTotal, t.yourCards);
            gameText += '\n\n';
            gameText += getHandDisplay(dealerHand, dealerTotal, t.dealerCards);
            gameText += `\n\n${t.blackjack}\n`;
            
            // Add dealer message for blackjack
            const bjMsg = getDealerMessage('playerBlackjack', lang);
            if (bjMsg) {
                gameText += `${bjMsg}\n`;
            }
            gameText += '\n';
            
            if (dealerTotal === 21) {
                await addCoins(sender, bet);
                recordPush(sender);
                const pushMsg = getDealerMessage('push', lang);
                gameText += `━━━━━━━━━━━━━━━━━━━━━\n${pushMsg}\n${t.push}\n━━━━━━━━━━━━━━━━━━━━━\n\n${t.balance} ${await getBalance(sender)} ${coins}`;
            } else {
                const winAmount = Math.floor(bet * 2.5);
                await addCoins(sender, winAmount);
                recordWin(sender, winAmount - bet, true);
                const winMsg = getDealerMessage('bigWin', lang);
                gameText += `━━━━━━━━━━━━━━━━━━━━━\n${winMsg}\n${t.youWin}\n${t.won} +${winAmount} ${coins}\n━━━━━━━━━━━━━━━━━━━━━\n\n${t.balance} ${await getBalance(sender)} ${coins}`;
            }
            
            activeGames.delete(sender);
        } else {
            // Check if can split and if dealer shows ace
            const canSplitHand = canSplit(playerHand);
            const dealerShowsAce = dealerHand[0].rank === 'A';
            
            if (canSplitHand && dealerShowsAce) {
                gameText += t.actionsWithBoth;
            } else if (canSplitHand) {
                gameText += t.actionsWithSplit;
            } else if (dealerShowsAce) {
                gameText += t.actionsWithInsurance;
            } else {
                gameText += t.actions;
            }
        }
        
        await sock.sendMessage(from, { text: gameText });
    }
};
