import { getGroupLanguage } from '../../utils/language.js';

// Store active challenges
const activeGames = new Map();

const responses = {
    en: {
        usage: 'Choose rock, paper, or scissors!\n\nUsage:\n• .rps <rock/paper/scissors> - Play vs bot\n• .rps @user - Challenge a player',
        invalid: 'Invalid choice! Choose: rock, paper, or scissors',
        title: 'Rock, Paper, Scissors!',
        player: '👤 Player:',
        you: 'You:',
        bot: 'Bot:',
        player1: 'Player 1:',
        player2: 'Player 2:',
        tie: 'It\'s a tie!',
        win: 'You win!',
        lose: 'You lose!',
        wins: 'wins!',
        rock: 'rock',
        paper: 'paper',
        scissors: 'scissors',
        challenged: 'challenged',
        waiting: 'Waiting for both players...',
        challenge: 'Challenge sent!',
        respond: 'Reply with: .rps <rock/paper/scissors>\n(Your message will be auto-deleted)',
        choiceReceived: '✅ Choice received! Waiting for opponent...',
        bothReady: 'Both players ready! Revealing...',
        noChallenge: 'No active challenge found!',
        notInGame: 'You are not in this game!',
        expired: 'Challenge expired!',
        selfChallenge: 'You cannot challenge yourself!',
        alreadyChose: 'You already made your choice! Waiting for opponent...',
        needAdmin: 'Bot needs admin permissions to delete messages for fair play!',
        groupOnly: 'Player vs Player mode only works in groups!'
    },
    it: {
        usage: 'Scegli sasso, carta o forbici!\n\nUso:\n• .rps <rock/paper/scissors> - Gioca vs bot\n• .rps @utente - Sfida un giocatore',
        invalid: 'Scelta non valida! Scegli: rock, paper o scissors',
        title: 'Sasso, Carta, Forbici!',
        player: '👤 Giocatore:',
        you: 'Tu:',
        bot: 'Bot:',
        player1: 'Giocatore 1:',
        player2: 'Giocatore 2:',
        tie: 'È un pareggio!',
        win: 'Hai vinto!',
        lose: 'Hai perso!',
        wins: 'vince!',
        rock: 'sasso',
        paper: 'carta',
        scissors: 'forbici',
        challenged: 'ha sfidato',
        waiting: 'In attesa di entrambi i giocatori...',
        challenge: 'Sfida inviata!',
        respond: 'Rispondi con: .rps <rock/paper/scissors>\n(Il tuo messaggio sarà auto-eliminato)',
        choiceReceived: '✅ Scelta ricevuta! In attesa dell\'avversario...',
        bothReady: 'Entrambi i giocatori pronti! Rivelazione...',
        noChallenge: 'Nessuna sfida attiva trovata!',
        notInGame: 'Non sei in questo gioco!',
        expired: 'Sfida scaduta!',
        selfChallenge: 'Non puoi sfidare te stesso!',
        alreadyChose: 'Hai già fatto la tua scelta! In attesa dell\'avversario...',
        needAdmin: 'Il bot ha bisogno dei permessi admin per eliminare i messaggi per un gioco equo!',
        groupOnly: 'La modalità PvP funziona solo nei gruppi!'
    },
    ru: {
        usage: 'Выберите камень, бумагу или ножницы!\n\nИспользование:\n• .rps <rock/paper/scissors> - Играть против бота\n• .rps @пользователь - Бросить вызов игроку',
        invalid: 'Неверный выбор! Выберите: rock, paper или scissors',
        title: 'Камень, Ножницы, Бумага!',
        player: '👤 Игрок:',
        you: 'Вы:',
        bot: 'Бот:',
        player1: 'Игрок 1:',
        player2: 'Игрок 2:',
        tie: 'Ничья!',
        win: 'Вы выиграли!',
        lose: 'Вы проиграли!',
        wins: 'выигрывает!',
        rock: 'камень',
        paper: 'бумага',
        scissors: 'ножницы',
        challenged: 'бросил вызов',
        waiting: 'Ожидание обоих игроков...',
        challenge: 'Вызов отправлен!',
        respond: 'Ответьте: .rps <rock/paper/scissors>\n(Ваше сообщение будет автоматически удалено)',
        choiceReceived: '✅ Выбор получен! Ожидание противника...',
        bothReady: 'Оба игрока готовы! Раскрытие...',
        noChallenge: 'Активный вызов не найден!',
        notInGame: 'Вы не в этой игре!',
        expired: 'Вызов истёк!',
        selfChallenge: 'Вы не можете бросить вызов себе!',
        alreadyChose: 'Вы уже сделали свой выбор! Ожидание противника...',
        needAdmin: 'Боту нужны права администратора для удаления сообщений для честной игры!',
        groupOnly: 'Режим PvP работает только в группах!'
    },
    es: {
        usage: '¡Elige piedra, papel o tijeras!\n\nUso:\n• .rps <rock/paper/scissors> - Jugar vs bot\n• .rps @usuario - Desafiar a un jugador',
        invalid: '¡Elección inválida! Elige: rock, paper o scissors',
        title: '¡Piedra, Papel o Tijeras!',
        player: '👤 Jugador:',
        you: 'Tú:',
        bot: 'Bot:',
        player1: 'Jugador 1:',
        player2: 'Jugador 2:',
        tie: '¡Es un empate!',
        win: '¡Ganaste!',
        lose: '¡Perdiste!',
        wins: '¡gana!',
        rock: 'piedra',
        paper: 'papel',
        scissors: 'tijeras',
        challenged: 'desafió a',
        waiting: 'Esperando a ambos jugadores...',
        challenge: '¡Desafío enviado!',
        respond: 'Responde con: .rps <rock/paper/scissors>\n(Tu mensaje será auto-eliminado)',
        choiceReceived: '✅ ¡Elección recibida! Esperando al oponente...',
        bothReady: '¡Ambos jugadores listos! Revelando...',
        noChallenge: '¡No se encontró desafío activo!',
        notInGame: '¡No estás en este juego!',
        expired: '¡Desafío expirado!',
        selfChallenge: '¡No puedes desafiarte a ti mismo!',
        alreadyChose: '¡Ya hiciste tu elección! Esperando al oponente...',
        needAdmin: '¡El bot necesita permisos de administrador para eliminar mensajes para un juego justo!',
        groupOnly: '¡El modo PvP solo funciona en grupos!'
    },
    pt: {
        usage: 'Escolha pedra, papel ou tesoura!\n\nUso:\n• .rps <rock/paper/scissors> - Jogar vs bot\n• .rps @usuário - Desafiar um jogador',
        invalid: 'Escolha inválida! Escolha: rock, paper ou scissors',
        title: 'Pedra, Papel ou Tesoura!',
        player: '👤 Jogador:',
        you: 'Você:',
        bot: 'Bot:',
        player1: 'Jogador 1:',
        player2: 'Jogador 2:',
        tie: 'É um empate!',
        win: 'Você ganhou!',
        lose: 'Você perdeu!',
        wins: 'vence!',
        rock: 'pedra',
        paper: 'papel',
        scissors: 'tesoura',
        challenged: 'desafiou',
        waiting: 'Aguardando ambos os jogadores...',
        challenge: 'Desafio enviado!',
        respond: 'Responda com: .rps <rock/paper/scissors>\n(Sua mensagem será auto-deletada)',
        choiceReceived: '✅ Escolha recebida! Aguardando oponente...',
        bothReady: 'Ambos jogadores prontos! Revelando...',
        noChallenge: 'Nenhum desafio ativo encontrado!',
        notInGame: 'Você não está neste jogo!',
        expired: 'Desafio expirado!',
        selfChallenge: 'Você não pode desafiar a si mesmo!',
        alreadyChose: 'Você já fez sua escolha! Aguardando oponente...',
        needAdmin: 'O bot precisa de permissões de administrador para deletar mensagens para um jogo justo!',
        groupOnly: 'O modo PvP só funciona em grupos!'
    },
    ar: {
        usage: 'اختار حجر، ورق أو مقص!\n\nالاستخدام:\n• .rps <rock/paper/scissors> - العب ضد البوت\n• .rps @مستخدم - تحدى لاعب',
        invalid: 'اختيار غلط! اختار: rock, paper أو scissors',
        title: 'حجر، ورق، مقص!',
        player: '👤 اللاعب:',
        you: 'انت:',
        bot: 'البوت:',
        player1: 'اللاعب 1:',
        player2: 'اللاعب 2:',
        tie: 'تعادل!',
        win: 'انت كسبت!',
        lose: 'انت خسرت!',
        wins: 'كسب!',
        rock: 'حجر',
        paper: 'ورق',
        scissors: 'مقص',
        challenged: 'تحدى',
        waiting: 'مستنيين اللاعبين...',
        challenge: 'التحدي اتبعت!',
        respond: 'رد بـ: .rps <rock/paper/scissors>\n(رسالتك هتتمسح تلقائي)',
        choiceReceived: '✅ الاختيار وصل! مستنيين الخصم...',
        bothReady: 'اللاعبين جاهزين! بنكشف...',
        noChallenge: 'مفيش تحدي نشط!',
        notInGame: 'انت مش في اللعبة دي!',
        expired: 'التحدي انتهى!',
        selfChallenge: 'متقدرش تتحدى نفسك!',
        alreadyChose: 'انت اخترت خلاص! مستنيين الخصم...',
        needAdmin: 'البوت محتاج صلاحيات أدمن عشان يمسح الرسائل!',
        groupOnly: 'وضع PvP بيشتغل في الجروبات بس!'
    },
    hi: {
        usage: 'पत्थर, कागज या कैंची चुनें!\n\nउपयोग:\n• .rps <rock/paper/scissors> - बॉट के विरुद्ध खेलें\n• .rps @उपयोगकर्ता - खिलाड़ी को चुनौती दें',
        invalid: 'अमान्य विकल्प! चुनें: rock, paper या scissors',
        title: 'पत्थर, कागज, कैंची!',
        player: '👤 खिलाड़ी:',
        you: 'आप:',
        bot: 'बॉट:',
        player1: 'खिलाड़ी 1:',
        player2: 'खिलाड़ी 2:',
        tie: 'बराबरी!',
        win: 'आप जीते!',
        lose: 'आप हारे!',
        wins: 'जीता!',
        rock: 'पत्थर',
        paper: 'कागज',
        scissors: 'कैंची',
        challenged: 'ने चुनौती दी',
        waiting: 'दोनों खिलाड़ियों की प्रतीक्षा में...',
        challenge: 'चुनौती भेजी गई!',
        respond: 'उत्तर दें: .rps <rock/paper/scissors>\n(आपका संदेश स्वतः हटा दिया जाएगा)',
        choiceReceived: '✅ विकल्प प्राप्त हुआ! प्रतिद्वंद्वी की प्रतीक्षा में...',
        bothReady: 'दोनों खिलाड़ी तैयार! प्रकट कर रहे हैं...',
        noChallenge: 'कोई सक्रिय चुनौती नहीं मिली!',
        notInGame: 'आप इस खेल में नहीं हैं!',
        expired: 'चुनौती समाप्त हो गई!',
        selfChallenge: 'आप स्वयं को चुनौती नहीं दे सकते!',
        alreadyChose: 'आपने पहले ही अपना विकल्प चुन लिया है! प्रतिद्वंद्वी की प्रतीक्षा में...',
        needAdmin: 'निष्पक्ष खेल के लिए संदेश हटाने हेतु बॉट को व्यवस्थापक अनुमतियों की आवश्यकता है!',
        groupOnly: 'खिलाड़ी बनाम खिलाड़ी मोड केवल समूहों में काम करता है!'
    },
    ng: {
        usage: 'Choose stone, paper or scissors!\n\nHow to use am:\n• .rps <rock/paper/scissors> - Play with bot\n• .rps @person - Challenge person',
        invalid: 'Dat choice no correct! Choose: rock, paper or scissors',
        title: 'Stone, Paper, Scissors!',
        player: '👤 Player:',
        you: 'You:',
        bot: 'Bot:',
        player1: 'Player 1:',
        player2: 'Player 2:',
        tie: 'Na draw!',
        win: 'You win am!',
        lose: 'You lose am!',
        wins: 'don win!',
        rock: 'stone',
        paper: 'paper',
        scissors: 'scissors',
        challenged: 'don challenge',
        waiting: 'We dey wait for both players...',
        challenge: 'Challenge don send!',
        respond: 'Reply with: .rps <rock/paper/scissors>\n(Your message go delete automatic)',
        choiceReceived: '✅ Choice don reach! We dey wait for opponent...',
        bothReady: 'Both players don ready! We dey reveal...',
        noChallenge: 'No active challenge dey!',
        notInGame: 'You no dey inside dis game!',
        expired: 'Challenge don expire!',
        selfChallenge: 'You no fit challenge yourself!',
        alreadyChose: 'You don already choose! We dey wait for opponent...',
        needAdmin: 'Bot need admin permission to delete messages for fair play!',
        groupOnly: 'Player vs Player mode only work for groups!'
    }
};

export default {
    name: 'rps',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const pushName = msg.pushName || 'Player';
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        const isGroup = from.endsWith('@g.us');
        
        const validChoices = ['rock', 'paper', 'scissors'];
        const emojis = {
            rock: '🪨',
            paper: '📄',
            scissors: '✂️'
        };
        const names = {
            rock: t.rock,
            paper: t.paper,
            scissors: t.scissors
        };
        
        if (args.length === 0) {
            return await sock.sendMessage(from, { text: t.usage });
        }
        
        // Check if this is a choice for an active game
        const userChoice = args[0].toLowerCase();
        
        if (validChoices.includes(userChoice)) {
            // Find any game where this user is a participant
            let foundGame = null;
            let gameKey = null;
            
            for (const [key, game] of activeGames.entries()) {
                if ((game.player1 === sender || game.player2 === sender) && game.groupJid === from) {
                    foundGame = game;
                    gameKey = key;
                    break;
                }
            }
            
            if (foundGame) {
                // This is a response to an active game
                
                // Check if challenge expired (2 minutes)
                if (Date.now() - foundGame.timestamp > 120000) {
                    activeGames.delete(gameKey);
                    return await sock.sendMessage(from, { text: t.expired });
                }
                
                // Delete the choice message immediately
                try {
                    await sock.sendMessage(from, { delete: msg.key });
                } catch (error) {
                    console.log('[RPS] Could not delete message - bot may not be admin');
                }
                
                // Store player's choice
                if (sender === foundGame.player1) {
                    if (foundGame.choice1) {
                        return await sock.sendMessage(from, { text: t.alreadyChose });
                    }
                    foundGame.choice1 = userChoice;
                } else if (sender === foundGame.player2) {
                    if (foundGame.choice2) {
                        return await sock.sendMessage(from, { text: t.alreadyChose });
                    }
                    foundGame.choice2 = userChoice;
                } else {
                    return await sock.sendMessage(from, { text: t.notInGame });
                }
                
                // Check if both players have chosen
                if (foundGame.choice1 && foundGame.choice2) {
                    // Small delay for dramatic effect
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                    // Determine winner
                    let result;
                    
                    if (foundGame.choice1 === foundGame.choice2) {
                        result = t.tie;
                    } else if (
                        (foundGame.choice1 === 'rock' && foundGame.choice2 === 'scissors') ||
                        (foundGame.choice1 === 'paper' && foundGame.choice2 === 'rock') ||
                        (foundGame.choice1 === 'scissors' && foundGame.choice2 === 'paper')
                    ) {
                        result = `@${foundGame.player1.split('@')[0]} ${t.wins}`;
                    } else {
                        result = `@${foundGame.player2.split('@')[0]} ${t.wins}`;
                    }
                    
                    // Send result to group
                    await sock.sendMessage(from, { 
                        text: `${t.title}\n\n${t.player1} @${foundGame.player1.split('@')[0]}\n${emojis[foundGame.choice1]} ${names[foundGame.choice1]}\n\n${t.player2} @${foundGame.player2.split('@')[0]}\n${emojis[foundGame.choice2]} ${names[foundGame.choice2]}\n\n${result}`,
                        mentions: [foundGame.player1, foundGame.player2]
                    });
                    
                    activeGames.delete(gameKey);
                } else {
                    // Notify that choice was received
                    const notification = await sock.sendMessage(from, { text: t.choiceReceived });
                    
                    // Delete notification after 2 seconds
                    setTimeout(async () => {
                        try {
                            await sock.sendMessage(from, { delete: notification.key });
                        } catch (error) {
                            console.log('[RPS] Could not delete notification');
                        }
                    }, 2000);
                }
                
                return;
            }
            
            // No active game, check if challenging or playing bot
            const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            
            if (!mentionedJid) {
                // Bot mode
                const botChoice = validChoices[Math.floor(Math.random() * 3)];
                
                let result;
                if (userChoice === botChoice) {
                    result = t.tie;
                } else if (
                    (userChoice === 'rock' && botChoice === 'scissors') ||
                    (userChoice === 'paper' && botChoice === 'rock') ||
                    (userChoice === 'scissors' && botChoice === 'paper')
                ) {
                    result = t.win;
                } else {
                    result = t.lose;
                }
                
                return await sock.sendMessage(from, { 
                    text: `${t.title}\n${t.player} ${pushName}\n\n${t.you} ${emojis[userChoice]} ${names[userChoice]}\n${t.bot} ${emojis[botChoice]} ${names[botChoice]}\n\n${result}`
                });
            }
        }
        
        // Check if challenging another player
        const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        
        if (mentionedJid) {
            // Player vs Player mode
            if (!isGroup) {
                return await sock.sendMessage(from, { text: t.groupOnly });
            }
            
            // Check if challenging self
            if (mentionedJid === sender) {
                return await sock.sendMessage(from, { text: t.selfChallenge });
            }
            
            // Create game ID
            const gameId = `${from}_${Date.now()}`;
            
            // Store challenge
            activeGames.set(gameId, {
                groupJid: from,
                player1: sender,
                player2: mentionedJid,
                choice1: null,
                choice2: null,
                timestamp: Date.now()
            });
            
            // Send challenge message to group
            await sock.sendMessage(from, { 
                text: `${t.title}\n\n@${sender.split('@')[0]} ${t.challenged} @${mentionedJid.split('@')[0]}!\n\n${t.waiting}\n\n${t.respond}`,
                mentions: [sender, mentionedJid]
            });
            
            // Auto-expire after 2 minutes
            setTimeout(() => {
                if (activeGames.has(gameId)) {
                    activeGames.delete(gameId);
                }
            }, 120000);
            
        } else {
            return await sock.sendMessage(from, { text: t.invalid });
        }
    }
};
