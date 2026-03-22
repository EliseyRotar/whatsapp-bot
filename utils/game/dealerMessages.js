// Dealer personality messages for blackjack

// Get random message from array
function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Dealer messages for different situations
const dealerMessages = {
    en: {
        welcome: [
            "🎩 Welcome to my table! Good luck!",
            "🎩 Place your bets, let's play!",
            "🎩 Feeling lucky today?",
            "🎩 Let's see what the cards bring!",
            "🎩 Ready to beat the house?"
        ],
        playerBlackjack: [
            "🎩 Blackjack! Well played!",
            "🎩 Natural 21! Impressive!",
            "🎩 Blackjack! The cards love you today!",
            "🎩 Perfect hand! Congratulations!",
            "🎩 21 on the deal! Lucky you!"
        ],
        playerBust: [
            "🎩 Bust! Better luck next time!",
            "🎩 Over 21... House wins!",
            "🎩 Too many cards! That's a bust!",
            "🎩 Ouch! Went over!",
            "🎩 Busted! The house thanks you!"
        ],
        dealerBust: [
            "🎩 I busted! You win this one!",
            "🎩 Went over 21... Your win!",
            "🎩 Dealer busts! Congratulations!",
            "🎩 Too greedy! You take the pot!",
            "🎩 I broke! Well played!"
        ],
        playerWin: [
            "🎩 You beat me! Nice hand!",
            "🎩 Winner! Well done!",
            "🎩 You got me this time!",
            "🎩 Strong play! You win!",
            "🎩 Victory is yours!"
        ],
        dealerWin: [
            "🎩 House wins! Better luck next time!",
            "🎩 My hand takes it!",
            "🎩 Dealer wins this round!",
            "🎩 I've got the better hand!",
            "🎩 House advantage!"
        ],
        push: [
            "🎩 It's a tie! We're even!",
            "🎩 Push! Same total!",
            "🎩 Equal hands! No winner!",
            "🎩 We matched! It's a push!",
            "🎩 Tied up! Bet returned!"
        ],
        playerHit: [
            "🎩 One more card coming up!",
            "🎩 Here's your card!",
            "🎩 Hitting... Good luck!",
            "🎩 Another card for you!",
            "🎩 Let's see what you get!"
        ],
        playerStand: [
            "🎩 Standing pat! My turn now!",
            "🎩 You're staying? Let's see my cards!",
            "🎩 Holding? Time for the dealer!",
            "🎩 Standing! Here comes the reveal!",
            "🎩 You're done? My turn!"
        ],
        playerDouble: [
            "🎩 Doubling down! Bold move!",
            "🎩 Double or nothing! I like it!",
            "🎩 Confident! Let's see that card!",
            "🎩 Doubling! High stakes!",
            "🎩 Going big! Respect!"
        ],
        playerSplit: [
            "🎩 Splitting pairs! Two chances to win!",
            "🎩 Split! Let's play both hands!",
            "🎩 Dividing them up! Smart play!",
            "🎩 Two hands now! Good strategy!",
            "🎩 Splitting! Double the action!"
        ],
        playerSurrender: [
            "🎩 Surrendering? Sometimes that's wise!",
            "🎩 Folding? Half back to you!",
            "🎩 Giving up? Fair enough!",
            "🎩 Surrender accepted! Half returned!",
            "🎩 Walking away? Smart move sometimes!"
        ],
        insurance: [
            "🎩 Insurance? Protecting your bet!",
            "🎩 Playing it safe with insurance!",
            "🎩 Insuring against my blackjack!",
            "🎩 Insurance bet placed!",
            "🎩 Hedging your bets! Smart!"
        ],
        dealerAce: [
            "🎩 I'm showing an Ace... Insurance?",
            "🎩 Ace up! Want insurance?",
            "🎩 My Ace is showing! Feeling nervous?",
            "🎩 Ace on the table! Protect yourself?",
            "🎩 That's an Ace! Insurance available!"
        ],
        perfectPair: [
            "🎩 Perfect Pair! What are the odds!",
            "🎩 Matching pair! Side bet pays!",
            "🎩 Identical cards! Nice hit!",
            "🎩 Perfect match! Congratulations!",
            "🎩 Same suit pair! Big payout!"
        ],
        twentyOnePlus3: [
            "🎩 21+3 winner! Poker luck!",
            "🎩 Side bet hits! Great combo!",
            "🎩 Three card poker win!",
            "🎩 21+3 pays out! Lucky cards!",
            "🎩 Poker hand made! Nice!"
        ],
        multiHand: [
            "🎩 Multiple hands! High roller style!",
            "🎩 Playing several hands! Ambitious!",
            "🎩 Multi-hand action! Let's go!",
            "🎩 Several hands at once! Big player!",
            "🎩 Multiple bets! I like your style!"
        ],
        lowBalance: [
            "🎩 Running low on chips? Play carefully!",
            "🎩 Bankroll getting thin! Be smart!",
            "🎩 Not many chips left! Good luck!",
            "🎩 Low on funds? Make them count!",
            "🎩 Chips running out! Play wise!"
        ],
        bigWin: [
            "🎩 Big win! Congratulations!",
            "🎩 Huge payout! Well deserved!",
            "🎩 Major win! You're on fire!",
            "🎩 Massive win! Lucky day!",
            "🎩 Big money! Impressive!"
        ],
        winStreak: [
            "🎩 You're on a roll! Hot streak!",
            "🎩 Winning streak! Cards love you!",
            "🎩 Another win! You're unstoppable!",
            "🎩 Hot hand! Keep it going!",
            "🎩 Streak continues! Amazing!"
        ]
    },
    it: {
        welcome: [
            "🎩 Benvenuto al mio tavolo! Buona fortuna!",
            "🎩 Piazzate le puntate, giochiamo!",
            "🎩 Ti senti fortunato oggi?",
            "🎩 Vediamo cosa portano le carte!",
            "🎩 Pronto a battere il banco?"
        ],
        playerBlackjack: [
            "🎩 Blackjack! Ben giocato!",
            "🎩 21 naturale! Impressionante!",
            "🎩 Blackjack! Le carte ti amano oggi!",
            "🎩 Mano perfetta! Congratulazioni!",
            "🎩 21 alla distribuzione! Fortunato!"
        ],
        playerBust: [
            "🎩 Sballato! Più fortuna la prossima volta!",
            "🎩 Oltre 21... Vince il banco!",
            "🎩 Troppe carte! Sballato!",
            "🎩 Ahi! Sei andato oltre!",
            "🎩 Sballato! Il banco ringrazia!"
        ],
        dealerBust: [
            "🎩 Sono sballato! Vinci tu!",
            "🎩 Oltre 21... Hai vinto!",
            "🎩 Dealer sballato! Congratulazioni!",
            "🎩 Troppo avido! Prendi il piatto!",
            "🎩 Mi sono rotto! Ben giocato!"
        ],
        playerWin: [
            "🎩 Mi hai battuto! Bella mano!",
            "🎩 Vincitore! Ben fatto!",
            "🎩 Mi hai preso questa volta!",
            "🎩 Giocata forte! Vinci tu!",
            "🎩 La vittoria è tua!"
        ],
        dealerWin: [
            "🎩 Vince il banco! Più fortuna prossima volta!",
            "🎩 La mia mano vince!",
            "🎩 Dealer vince questo round!",
            "🎩 Ho la mano migliore!",
            "🎩 Vantaggio del banco!"
        ],
        push: [
            "🎩 È un pareggio! Siamo pari!",
            "🎩 Push! Stesso totale!",
            "🎩 Mani uguali! Nessun vincitore!",
            "🎩 Abbiamo pareggiato! È un push!",
            "🎩 Pareggio! Puntata restituita!"
        ],
        playerHit: [
            "🎩 Un'altra carta in arrivo!",
            "🎩 Ecco la tua carta!",
            "🎩 Pescando... Buona fortuna!",
            "🎩 Un'altra carta per te!",
            "🎩 Vediamo cosa ottieni!"
        ],
        playerStand: [
            "🎩 Ti fermi! Tocca a me ora!",
            "🎩 Rimani? Vediamo le mie carte!",
            "🎩 Ti fermi? Tempo per il dealer!",
            "🎩 Stai! Ecco la rivelazione!",
            "🎩 Hai finito? Tocca a me!"
        ],
        playerDouble: [
            "🎩 Raddoppi! Mossa audace!",
            "🎩 Doppio o niente! Mi piace!",
            "🎩 Sicuro! Vediamo quella carta!",
            "🎩 Raddoppi! Posta alta!",
            "🎩 Vai grande! Rispetto!"
        ],
        playerSplit: [
            "🎩 Dividi coppie! Due possibilità di vincere!",
            "🎩 Split! Giochiamo entrambe le mani!",
            "🎩 Le dividi! Giocata intelligente!",
            "🎩 Due mani ora! Buona strategia!",
            "🎩 Dividi! Doppia azione!"
        ],
        playerSurrender: [
            "🎩 Ti arrendi? A volte è saggio!",
            "🎩 Ti ritiri? Metà indietro!",
            "🎩 Abbandoni? Va bene!",
            "🎩 Resa accettata! Metà restituita!",
            "🎩 Te ne vai? A volte è intelligente!"
        ],
        insurance: [
            "🎩 Assicurazione? Proteggi la puntata!",
            "🎩 Giochi sicuro con l'assicurazione!",
            "🎩 Ti assicuri contro il mio blackjack!",
            "🎩 Assicurazione piazzata!",
            "🎩 Copri le scommesse! Intelligente!"
        ],
        dealerAce: [
            "🎩 Mostro un Asso... Assicurazione?",
            "🎩 Asso scoperto! Vuoi assicurazione?",
            "🎩 Il mio Asso è visibile! Nervoso?",
            "🎩 Asso sul tavolo! Ti proteggi?",
            "🎩 È un Asso! Assicurazione disponibile!"
        ],
        perfectPair: [
            "🎩 Coppia Perfetta! Che probabilità!",
            "🎩 Coppia identica! Scommessa laterale paga!",
            "🎩 Carte identiche! Bel colpo!",
            "🎩 Abbinamento perfetto! Congratulazioni!",
            "🎩 Coppia stesso seme! Grande pagamento!"
        ],
        twentyOnePlus3: [
            "🎩 Vincita 21+3! Fortuna poker!",
            "🎩 Scommessa laterale vinta! Ottima combo!",
            "🎩 Vincita poker tre carte!",
            "🎩 21+3 paga! Carte fortunate!",
            "🎩 Mano poker fatta! Bello!"
        ],
        multiHand: [
            "🎩 Mani multiple! Stile high roller!",
            "🎩 Giochi più mani! Ambizioso!",
            "🎩 Azione multi-mano! Andiamo!",
            "🎩 Più mani insieme! Grande giocatore!",
            "🎩 Puntate multiple! Mi piace il tuo stile!"
        ],
        lowBalance: [
            "🎩 Poche fiches? Gioca con attenzione!",
            "🎩 Bankroll basso! Sii intelligente!",
            "🎩 Non molte fiches! Buona fortuna!",
            "🎩 Pochi fondi? Falli contare!",
            "🎩 Fiches in esaurimento! Gioca saggio!"
        ],
        bigWin: [
            "🎩 Grande vincita! Congratulazioni!",
            "🎩 Enorme pagamento! Ben meritato!",
            "🎩 Vincita importante! Sei in fiamme!",
            "🎩 Vincita massiccia! Giornata fortunata!",
            "🎩 Grandi soldi! Impressionante!"
        ],
        winStreak: [
            "🎩 Sei in serie! Striscia vincente!",
            "🎩 Striscia di vittorie! Le carte ti amano!",
            "🎩 Altra vittoria! Sei inarrestabile!",
            "🎩 Mano calda! Continua così!",
            "🎩 La serie continua! Incredibile!"
        ]
    },
    ru: {
        welcome: [
            "🎩 Добро пожаловать за мой стол! Удачи!",
            "🎩 Делайте ставки, давайте играть!",
            "🎩 Чувствуете удачу сегодня?",
            "🎩 Посмотрим, что принесут карты!",
            "🎩 Готовы обыграть казино?"
        ],
        playerBlackjack: [
            "🎩 Блэкджек! Отлично сыграно!",
            "🎩 Натуральный 21! Впечатляет!",
            "🎩 Блэкджек! Карты любят вас сегодня!",
            "🎩 Идеальная рука! Поздравляю!",
            "🎩 21 на раздаче! Везунчик!"
        ],
        playerBust: [
            "🎩 Перебор! Удачи в следующий раз!",
            "🎩 Больше 21... Казино выигрывает!",
            "🎩 Слишком много карт! Перебор!",
            "🎩 Ой! Перебрали!",
            "🎩 Перебор! Казино благодарит!"
        ],
        dealerBust: [
            "🎩 У меня перебор! Вы выиграли!",
            "🎩 Больше 21... Ваша победа!",
            "🎩 Дилер перебрал! Поздравляю!",
            "🎩 Слишком жадный! Забирайте банк!",
            "🎩 Я проиграл! Хорошо сыграно!"
        ],
        playerWin: [
            "🎩 Вы меня обыграли! Хорошая рука!",
            "🎩 Победитель! Отлично!",
            "🎩 Вы взяли меня на этот раз!",
            "🎩 Сильная игра! Вы выиграли!",
            "🎩 Победа ваша!"
        ],
        dealerWin: [
            "🎩 Казино выигрывает! Удачи в следующий раз!",
            "🎩 Моя рука берёт!",
            "🎩 Дилер выигрывает этот раунд!",
            "🎩 У меня лучшая рука!",
            "🎩 Преимущество казино!"
        ],
        push: [
            "🎩 Ничья! Мы равны!",
            "🎩 Пуш! Одинаковая сумма!",
            "🎩 Равные руки! Нет победителя!",
            "🎩 Мы сравнялись! Это пуш!",
            "🎩 Ничья! Ставка возвращена!"
        ],
        playerHit: [
            "🎩 Ещё одна карта!",
            "🎩 Вот ваша карта!",
            "🎩 Берём... Удачи!",
            "🎩 Ещё карта для вас!",
            "🎩 Посмотрим, что выпадет!"
        ],
        playerStand: [
            "🎩 Остаётесь! Теперь моя очередь!",
            "🎩 Стоите? Посмотрим мои карты!",
            "🎩 Держите? Время дилера!",
            "🎩 Стоите! Вот раскрытие!",
            "🎩 Закончили? Моя очередь!"
        ],
        playerDouble: [
            "🎩 Удваиваете! Смелый ход!",
            "🎩 Всё или ничего! Мне нравится!",
            "🎩 Уверенно! Посмотрим на карту!",
            "🎩 Удвоение! Высокие ставки!",
            "🎩 По-крупному! Уважаю!"
        ],
        playerSplit: [
            "🎩 Разделяете пары! Два шанса выиграть!",
            "🎩 Сплит! Играем обе руки!",
            "🎩 Делите их! Умная игра!",
            "🎩 Теперь две руки! Хорошая стратегия!",
            "🎩 Разделение! Двойное действие!"
        ],
        playerSurrender: [
            "🎩 Сдаётесь? Иногда это мудро!",
            "🎩 Сбрасываете? Половина вам!",
            "🎩 Уходите? Справедливо!",
            "🎩 Сдача принята! Половина возвращена!",
            "🎩 Уходите? Иногда умный ход!"
        ],
        insurance: [
            "🎩 Страховка? Защищаете ставку!",
            "🎩 Играете безопасно со страховкой!",
            "🎩 Страхуетесь от моего блэкджека!",
            "🎩 Страховка размещена!",
            "🎩 Хеджируете ставки! Умно!"
        ],
        dealerAce: [
            "🎩 У меня Туз... Страховка?",
            "🎩 Туз открыт! Хотите страховку?",
            "🎩 Мой Туз виден! Нервничаете?",
            "🎩 Туз на столе! Защититесь?",
            "🎩 Это Туз! Страховка доступна!"
        ],
        perfectPair: [
            "🎩 Идеальная Пара! Какие шансы!",
            "🎩 Совпадающая пара! Боковая ставка платит!",
            "🎩 Одинаковые карты! Хороший удар!",
            "🎩 Идеальное совпадение! Поздравляю!",
            "🎩 Пара одной масти! Большая выплата!"
        ],
        twentyOnePlus3: [
            "🎩 Победа 21+3! Покерная удача!",
            "🎩 Боковая ставка выиграла! Отличная комбо!",
            "🎩 Победа в покер трёх карт!",
            "🎩 21+3 платит! Удачные карты!",
            "🎩 Покерная рука! Отлично!"
        ],
        multiHand: [
            "🎩 Несколько рук! Стиль хайроллера!",
            "🎩 Играете несколько рук! Амбициозно!",
            "🎩 Мульти-рука действие! Поехали!",
            "🎩 Несколько рук сразу! Крупный игрок!",
            "🎩 Множественные ставки! Мне нравится ваш стиль!"
        ],
        lowBalance: [
            "🎩 Мало фишек? Играйте осторожно!",
            "🎩 Банкролл тает! Будьте умны!",
            "🎩 Немного фишек осталось! Удачи!",
            "🎩 Мало средств? Используйте их с умом!",
            "🎩 Фишки заканчиваются! Играйте мудро!"
        ],
        bigWin: [
            "🎩 Большой выигрыш! Поздравляю!",
            "🎩 Огромная выплата! Заслуженно!",
            "🎩 Крупная победа! Вы в огне!",
            "🎩 Массивный выигрыш! Удачный день!",
            "🎩 Большие деньги! Впечатляет!"
        ],
        winStreak: [
            "🎩 Вы на подъёме! Горячая серия!",
            "🎩 Серия побед! Карты любят вас!",
            "🎩 Ещё победа! Вы неудержимы!",
            "🎩 Горячая рука! Продолжайте!",
            "🎩 Серия продолжается! Потрясающе!"
        ]
    }
};

// Get dealer message for situation
export function getDealerMessage(situation, lang = 'en') {
    const messages = dealerMessages[lang] || dealerMessages.en;
    const situationMessages = messages[situation];
    
    if (!situationMessages || situationMessages.length === 0) {
        return '';
    }
    
    return getRandom(situationMessages);
}

// Get contextual dealer message based on game state
export function getContextualMessage(gameState, lang = 'en') {
    const { 
        action, 
        playerTotal, 
        dealerTotal, 
        result, 
        balance, 
        bet,
        numHands,
        sideBetWin,
        consecutiveWins = 0
    } = gameState;
    
    // Check for special situations first
    if (balance < 50 && balance > 0) {
        return getDealerMessage('lowBalance', lang);
    }
    
    if (numHands && numHands > 1 && action === 'start') {
        return getDealerMessage('multiHand', lang);
    }
    
    if (sideBetWin) {
        if (sideBetWin.type === 'perfectPair') {
            return getDealerMessage('perfectPair', lang);
        }
        if (sideBetWin.type === '21plus3') {
            return getDealerMessage('twentyOnePlus3', lang);
        }
    }
    
    if (consecutiveWins >= 3) {
        return getDealerMessage('winStreak', lang);
    }
    
    // Action-based messages
    switch (action) {
        case 'start':
            return getDealerMessage('welcome', lang);
            
        case 'hit':
            return getDealerMessage('playerHit', lang);
            
        case 'stand':
            return getDealerMessage('playerStand', lang);
            
        case 'double':
            return getDealerMessage('playerDouble', lang);
            
        case 'split':
            return getDealerMessage('playerSplit', lang);
            
        case 'surrender':
            return getDealerMessage('playerSurrender', lang);
            
        case 'insurance':
            return getDealerMessage('insurance', lang);
            
        case 'dealerAce':
            return getDealerMessage('dealerAce', lang);
    }
    
    // Result-based messages
    if (result) {
        if (result === 'playerBlackjack') {
            return getDealerMessage('playerBlackjack', lang);
        }
        
        if (result === 'playerBust') {
            return getDealerMessage('playerBust', lang);
        }
        
        if (result === 'dealerBust') {
            return getDealerMessage('dealerBust', lang);
        }
        
        if (result === 'playerWin') {
            const winAmount = bet * 2 - bet; // Net profit
            if (winAmount >= 200) {
                return getDealerMessage('bigWin', lang);
            }
            return getDealerMessage('playerWin', lang);
        }
        
        if (result === 'dealerWin') {
            return getDealerMessage('dealerWin', lang);
        }
        
        if (result === 'push') {
            return getDealerMessage('push', lang);
        }
    }
    
    return '';
}
