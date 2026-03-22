import { config } from '../../config.js';
import { getGroupLanguage } from '../../utils/language.js';
import { sendAsChannelForward } from '../../utils/fakeForward.js';

const responses = {
    en: {
        title: '╔═══════════════════════════╗\n║      🎮 GAME COMMANDS      ║\n╚═══════════════════════════╝\n\nPlay fun games with the bot!\n\n🤖 NEW: Ask AI anything with .ai <question>',
        eightball: `┌─ 🎱 MAGIC 8-BALL\n│  Command: ${config.prefix}8ball <question>\n│  Ask any yes/no question and get a fortune\n│  Example: ${config.prefix}8ball Will I win today?`,
        dice: `├─ 🎲 DICE ROLL\n│  Command: ${config.prefix}dice <bet>\n│  Roll two dice and win coins!\n│  Doubles: 3x bet | 7 or 11: 2x bet\n│  Example: ${config.prefix}dice 10`,
        coinflip: `├─ 🪙 COIN FLIP\n│  Command: ${config.prefix}coin <bet> <heads/tails>\n│  Guess the coin flip and win!\n│  Correct guess: 2x bet\n│  Example: ${config.prefix}coin 10 heads`,
        rps: `├─ ✊✋✌️ ROCK PAPER SCISSORS\n│  Command: ${config.prefix}rps <choice>\n│  Play against the bot or challenge a player\n│  Choices: rock, paper, scissors\n│  Bot mode: ${config.prefix}rps rock\n│  PvP mode: ${config.prefix}rps @user rock`,
        guess: `├─ 🔢 NUMBER GUESSING\n│  Command: ${config.prefix}guess [number]\n│  Guess a number between 1-100\n│  Bot gives you hints (higher/lower)\n│  Start: ${config.prefix}guess\n│  Guess: ${config.prefix}guess 50`,
        trivia: `├─ 🧠 TRIVIA QUIZ\n│  Command: ${config.prefix}trivia\n│  Answer random trivia questions\n│  Multiple choice (a, b, c, d)\n│  Test your knowledge!`,
        slot: `├─ 🎰 SLOT MACHINE\n│  Command: ${config.prefix}slot <bet>\n│  Spin the slots and win coins!\n│  Match 3 symbols for big wins\n│  Example: ${config.prefix}slot 10`,
        bank: `├─ 💰 BANK\n│  Command: ${config.prefix}bank\n│  Check your coin balance\n│  Everyone starts with 100 coins\n│  Use coins to play slot machine`,
        math: `├─ ➕➖✖️ MATH CHALLENGE\n│  Command: ${config.prefix}math\n│  Solve random math problems\n│  Addition, subtraction, multiplication\n│  Reply with your answer!`,
        tictactoe: `├─ ⭕❌ TIC-TAC-TOE\n│  Command: ${config.prefix}ttt\n│  Classic tic-tac-toe game\n│  Bot mode: ${config.prefix}ttt\n│  PvP mode: ${config.prefix}ttt @user\n│  Make moves: ${config.prefix}ttt <1-9>`,
        roulette: `└─ 🎰 ROULETTE\n   Command: ${config.prefix}roulette <bet> <type>\n   European roulette with multiple bet types\n   Straight (35:1), Red/Black (1:1), Dozens (2:1)\n   Example: ${config.prefix}roulette 10 red`,
        footer: `╔═══════════════════════════╗\n║  Total Games: 11  |  Prefix: ${config.prefix}  ║\n╚═══════════════════════════╝\n\n💡 All games work in groups and private chats!\n🎯 Some games track your progress across messages\n🏆 Challenge your friends and have fun!\n\nType ${config.prefix}menu to see all bot commands`
    },
    it: {
        title: '╔═══════════════════════════╗\n║      🎮 COMANDI GIOCHI      ║\n╚═══════════════════════════╝\n\nGioca a giochi divertenti con il bot!\n\n🤖 NUOVO: Chiedi all\'AI con .ai <domanda>',
        eightball: `┌─ 🎱 PALLA MAGICA 8\n│  Comando: ${config.prefix}8ball <domanda>\n│  Fai qualsiasi domanda sì/no e ottieni una risposta\n│  Esempio: ${config.prefix}8ball Vincerò oggi?`,
        dice: `├─ 🎲 LANCIO DADI\n│  Comando: ${config.prefix}dice <puntata>\n│  Lancia due dadi e vinci monete!\n│  Doppi: 3x puntata | 7 o 11: 2x puntata\n│  Esempio: ${config.prefix}dice 10`,
        coinflip: `├─ 🪙 LANCIO MONETA\n│  Comando: ${config.prefix}coin <puntata> <heads/tails>\n│  Indovina il lancio e vinci!\n│  Indovinato: 2x puntata\n│  Esempio: ${config.prefix}coin 10 heads`,
        rps: `├─ ✊✋✌️ SASSO CARTA FORBICI\n│  Comando: ${config.prefix}rps <scelta>\n│  Gioca contro il bot o sfida un giocatore\n│  Scelte: rock, paper, scissors\n│  Modalità bot: ${config.prefix}rps rock\n│  Modalità PvP: ${config.prefix}rps @utente rock`,
        guess: `├─ 🔢 INDOVINA IL NUMERO\n│  Comando: ${config.prefix}guess [numero]\n│  Indovina un numero tra 1-100\n│  Il bot ti dà suggerimenti (più alto/più basso)\n│  Inizia: ${config.prefix}guess\n│  Indovina: ${config.prefix}guess 50`,
        trivia: `├─ 🧠 QUIZ TRIVIA\n│  Comando: ${config.prefix}trivia\n│  Rispondi a domande trivia casuali\n│  Scelta multipla (a, b, c, d)\n│  Metti alla prova la tua conoscenza!`,
        slot: `├─ 🎰 SLOT MACHINE\n│  Comando: ${config.prefix}slot <puntata>\n│  Gira le slot e vinci monete!\n│  Abbina 3 simboli per grandi vincite\n│  Esempio: ${config.prefix}slot 10`,
        bank: `├─ 💰 BANCA\n│  Comando: ${config.prefix}bank\n│  Controlla il tuo saldo monete\n│  Tutti iniziano con 100 monete\n│  Usa le monete per giocare alla slot machine`,
        math: `├─ ➕➖✖️ SFIDA MATEMATICA\n│  Comando: ${config.prefix}math\n│  Risolvi problemi matematici casuali\n│  Addizione, sottrazione, moltiplicazione\n│  Rispondi con la tua risposta!`,
        tictactoe: `├─ ⭕❌ TRIS\n│  Comando: ${config.prefix}ttt\n│  Classico gioco del tris\n│  Modalità bot: ${config.prefix}ttt\n│  Modalità PvP: ${config.prefix}ttt @utente\n│  Fai mosse: ${config.prefix}ttt <1-9>`,
        roulette: `└─ 🎰 ROULETTE\n   Comando: ${config.prefix}roulette <puntata> <tipo>\n   Roulette europea con vari tipi di puntata\n   Pieno (35:1), Rosso/Nero (1:1), Dozzine (2:1)\n   Esempio: ${config.prefix}roulette 10 red`,
        footer: `╔═══════════════════════════╗\n║  Giochi Totali: 11  |  Prefisso: ${config.prefix}  ║\n╚═══════════════════════════╝\n\n💡 Tutti i giochi funzionano in gruppi e chat private!\n🎯 Alcuni giochi tracciano i tuoi progressi tra i messaggi\n🏆 Sfida i tuoi amici e divertiti!\n\nScrivi ${config.prefix}menu per vedere tutti i comandi`
    },
    ru: {
        title: '╔═══════════════════════════╗\n║      🎮 ИГРОВЫЕ КОМАНДЫ      ║\n╚═══════════════════════════╝\n\nИграйте в весёлые игры с ботом!\n\n🤖 НОВОЕ: Спросите AI с .ai <вопрос>',
        eightball: `┌─ 🎱 МАГИЧЕСКИЙ ШАР 8\n│  Команда: ${config.prefix}8ball <вопрос>\n│  Задайте любой вопрос да/нет и получите ответ\n│  Пример: ${config.prefix}8ball Выиграю ли я сегодня?`,
        dice: `├─ 🎲 БРОСОК КУБИКОВ\n│  Команда: ${config.prefix}dice <ставка>\n│  Бросьте два кубика и выиграйте монеты!\n│  Дубли: 3x ставка | 7 или 11: 2x ставка\n│  Пример: ${config.prefix}dice 10`,
        coinflip: `├─ 🪙 ПОДБРАСЫВАНИЕ МОНЕТЫ\n│  Команда: ${config.prefix}coin <ставка> <heads/tails>\n│  Угадайте результат и выиграйте!\n│  Правильно: 2x ставка\n│  Пример: ${config.prefix}coin 10 heads`,
        rps: `├─ ✊✋✌️ КАМЕНЬ НОЖНИЦЫ БУМАГА\n│  Команда: ${config.prefix}rps <выбор>\n│  Играйте против бота или бросьте вызов игроку\n│  Выбор: rock, paper, scissors\n│  Режим бота: ${config.prefix}rps rock\n│  Режим PvP: ${config.prefix}rps @пользователь rock`,
        guess: `├─ 🔢 УГАДАЙ ЧИСЛО\n│  Команда: ${config.prefix}guess [число]\n│  Угадайте число от 1 до 100\n│  Бот даёт подсказки (выше/ниже)\n│  Начать: ${config.prefix}guess\n│  Угадать: ${config.prefix}guess 50`,
        trivia: `├─ 🧠 ВИКТОРИНА\n│  Команда: ${config.prefix}trivia\n│  Отвечайте на случайные вопросы викторины\n│  Множественный выбор (a, b, c, d)\n│  Проверьте свои знания!`,
        slot: `├─ 🎰 ИГРОВОЙ АВТОМАТ\n│  Команда: ${config.prefix}slot <ставка>\n│  Крутите слоты и выигрывайте монеты!\n│  Совпадение 3 символов для больших выигрышей\n│  Пример: ${config.prefix}slot 10`,
        bank: `├─ 💰 БАНК\n│  Команда: ${config.prefix}bank\n│  Проверьте баланс монет\n│  Все начинают со 100 монет\n│  Используйте монеты для игры в слоты`,
        math: `├─ ➕➖✖️ МАТЕМАТИЧЕСКИЙ ВЫЗОВ\n│  Команда: ${config.prefix}math\n│  Решайте случайные математические задачи\n│  Сложение, вычитание, умножение\n│  Ответьте своим решением!`,
        tictactoe: `└─ ⭕❌ КРЕСТИКИ-НОЛИКИ\n   Команда: ${config.prefix}ttt\n   Классическая игра крестики-нолики\n   Режим бота: ${config.prefix}ttt\n   Режим PvP: ${config.prefix}ttt @пользователь\n   Делайте ходы: ${config.prefix}ttt <1-9>`,
        roulette: `└─ 🎰 РУЛЕТКА\n   Команда: ${config.prefix}roulette <ставка> <тип>\n   Европейская рулетка с разными типами ставок\n   Прямая (35:1), Красное/Черное (1:1), Дюжины (2:1)\n   Пример: ${config.prefix}roulette 10 red`,
        footer: `╔═══════════════════════════╗\n║  Всего игр: 11  |  Префикс: ${config.prefix}  ║\n╚═══════════════════════════╝\n\n💡 Все игры работают в группах и личных чатах!\n🎯 Некоторые игры отслеживают ваш прогресс между сообщениями\n🏆 Бросьте вызов друзьям и веселитесь!\n\nНапишите ${config.prefix}menu чтобы увидеть все команды бота`
    },
    es: {
        title: '╔═══════════════════════════╗\n║      🎮 COMANDOS DE JUEGOS      ║\n╚═══════════════════════════╝\n\n¡Juega juegos divertidos con el bot!\n\n🤖 NUEVO: Pregunta a la IA con .ai <pregunta>',
        eightball: `┌─ 🎱 BOLA MÁGICA 8\n│  Comando: ${config.prefix}8ball <pregunta>\n│  Haz cualquier pregunta sí/no y obtén una respuesta\n│  Ejemplo: ${config.prefix}8ball ¿Ganaré hoy?`,
        dice: `├─ 🎲 LANZAR DADOS\n│  Comando: ${config.prefix}dice <apuesta>\n│  ¡Lanza dos dados y gana monedas!\n│  Dobles: 3x apuesta | 7 u 11: 2x apuesta\n│  Ejemplo: ${config.prefix}dice 10`,
        coinflip: `├─ 🪙 LANZAR MONEDA\n│  Comando: ${config.prefix}coin <apuesta> <heads/tails>\n│  ¡Adivina el lanzamiento y gana!\n│  Acierto: 2x apuesta\n│  Ejemplo: ${config.prefix}coin 10 heads`,
        rps: `├─ ✊✋✌️ PIEDRA PAPEL TIJERAS\n│  Comando: ${config.prefix}rps <elección>\n│  Juega contra el bot o desafía a un jugador\n│  Opciones: rock, paper, scissors\n│  Modo bot: ${config.prefix}rps rock\n│  Modo PvP: ${config.prefix}rps @usuario rock`,
        guess: `├─ 🔢 ADIVINA EL NÚMERO\n│  Comando: ${config.prefix}guess [número]\n│  Adivina un número entre 1-100\n│  El bot te da pistas (más alto/más bajo)\n│  Iniciar: ${config.prefix}guess\n│  Adivinar: ${config.prefix}guess 50`,
        trivia: `├─ 🧠 TRIVIA QUIZ\n│  Comando: ${config.prefix}trivia\n│  Responde preguntas de trivia aleatorias\n│  Opción múltiple (a, b, c, d)\n│  ¡Pon a prueba tu conocimiento!`,
        slot: `├─ 🎰 MÁQUINA TRAGAMONEDAS\n│  Comando: ${config.prefix}slot <apuesta>\n│  ¡Gira las tragamonedas y gana monedas!\n│  Combina 3 símbolos para grandes premios\n│  Ejemplo: ${config.prefix}slot 10`,
        bank: `├─ 💰 BANCO\n│  Comando: ${config.prefix}bank\n│  Verifica tu saldo de monedas\n│  Todos comienzan con 100 monedas\n│  Usa monedas para jugar en las tragamonedas`,
        math: `├─ ➕➖✖️ DESAFÍO MATEMÁTICO\n│  Comando: ${config.prefix}math\n│  Resuelve problemas matemáticos aleatorios\n│  Suma, resta, multiplicación\n│  ¡Responde con tu solución!`,
        tictactoe: `└─ ⭕❌ TRES EN RAYA\n   Comando: ${config.prefix}ttt\n   Clásico juego de tres en raya\n   Modo bot: ${config.prefix}ttt\n   Modo PvP: ${config.prefix}ttt @usuario\n   Hacer movimientos: ${config.prefix}ttt <1-9>`,
        roulette: `└─ 🎰 RULETA\n   Comando: ${config.prefix}roulette <apuesta> <tipo>\n   Ruleta europea con múltiples tipos de apuesta\n   Pleno (35:1), Rojo/Negro (1:1), Docenas (2:1)\n   Ejemplo: ${config.prefix}roulette 10 red`,
        footer: `╔═══════════════════════════╗\n║  Total de Juegos: 11  |  Prefijo: ${config.prefix}  ║\n╚═══════════════════════════╝\n\n💡 ¡Todos los juegos funcionan en grupos y chats privados!\n🎯 Algunos juegos rastrean tu progreso entre mensajes\n🏆 ¡Desafía a tus amigos y diviértete!\n\nEscribe ${config.prefix}menu para ver todos los comandos del bot`
    },
    pt: {
        title: '╔═══════════════════════════╗\n║      🎮 COMANDOS DE JOGOS      ║\n╚═══════════════════════════╝\n\nJogue jogos divertidos com o bot!\n\n🤖 NOVO: Pergunte à IA com .ai <pergunta>',
        eightball: `┌─ 🎱 BOLA MÁGICA 8\n│  Comando: ${config.prefix}8ball <pergunta>\n│  Faça qualquer pergunta sim/não e obtenha uma resposta\n│  Exemplo: ${config.prefix}8ball Vou ganhar hoje?`,
        dice: `├─ 🎲 LANÇAR DADOS\n│  Comando: ${config.prefix}dice <aposta>\n│  Lance dois dados e ganhe moedas!\n│  Duplas: 3x aposta | 7 ou 11: 2x aposta\n│  Exemplo: ${config.prefix}dice 10`,
        coinflip: `├─ 🪙 LANÇAR MOEDA\n│  Comando: ${config.prefix}coin <aposta> <heads/tails>\n│  Adivinhe o lançamento e ganhe!\n│  Acerto: 2x aposta\n│  Exemplo: ${config.prefix}coin 10 heads`,
        rps: `├─ ✊✋✌️ PEDRA PAPEL TESOURA\n│  Comando: ${config.prefix}rps <escolha>\n│  Jogue contra o bot ou desafie um jogador\n│  Opções: rock, paper, scissors\n│  Modo bot: ${config.prefix}rps rock\n│  Modo PvP: ${config.prefix}rps @usuário rock`,
        guess: `├─ 🔢 ADIVINHE O NÚMERO\n│  Comando: ${config.prefix}guess [número]\n│  Adivinhe um número entre 1-100\n│  O bot dá dicas (maior/menor)\n│  Iniciar: ${config.prefix}guess\n│  Adivinhar: ${config.prefix}guess 50`,
        trivia: `├─ 🧠 QUIZ TRIVIA\n│  Comando: ${config.prefix}trivia\n│  Responda perguntas de trivia aleatórias\n│  Múltipla escolha (a, b, c, d)\n│  Teste seu conhecimento!`,
        slot: `├─ 🎰 CAÇA-NÍQUEIS\n│  Comando: ${config.prefix}slot <aposta>\n│  Gire os caça-níqueis e ganhe moedas!\n│  Combine 3 símbolos para grandes prêmios\n│  Exemplo: ${config.prefix}slot 10`,
        bank: `├─ 💰 BANCO\n│  Comando: ${config.prefix}bank\n│  Verifique seu saldo de moedas\n│  Todos começam com 100 moedas\n│  Use moedas para jogar caça-níqueis`,
        math: `├─ ➕➖✖️ DESAFIO MATEMÁTICO\n│  Comando: ${config.prefix}math\n│  Resolva problemas matemáticos aleatórios\n│  Adição, subtração, multiplicação\n│  Responda com sua solução!`,
        tictactoe: `└─ ⭕❌ JOGO DA VELHA\n   Comando: ${config.prefix}ttt\n   Clássico jogo da velha\n   Modo bot: ${config.prefix}ttt\n   Modo PvP: ${config.prefix}ttt @usuário\n   Fazer jogadas: ${config.prefix}ttt <1-9>`,
        roulette: `└─ 🎰 ROLETA\n   Comando: ${config.prefix}roulette <aposta> <tipo>\n   Roleta europeia com múltiplos tipos de aposta\n   Pleno (35:1), Vermelho/Preto (1:1), Dúzias (2:1)\n   Exemplo: ${config.prefix}roulette 10 red`,
        footer: `╔═══════════════════════════╗\n║  Total de Jogos: 11  |  Prefixo: ${config.prefix}  ║\n╚═══════════════════════════╝\n\n💡 Todos os jogos funcionam em grupos e chats privados!\n🎯 Alguns jogos rastreiam seu progresso entre mensagens\n🏆 Desafie seus amigos e divirta-se!\n\nDigite ${config.prefix}menu para ver todos os comandos do bot`
    },
    ar: {
        title: '╔═══════════════════════════╗\n║      🎮 أوامر الألعاب      ║\n╚═══════════════════════════╝\n\nالعب ألعاب ممتعة مع البوت!\n\n🤖 جديد: اسأل الذكاء الاصطناعي مع .ai <سؤال>',
        eightball: `┌─ 🎱 كرة الحظ السحرية\n│  الأمر: ${config.prefix}8ball <سؤال>\n│  اسأل أي سؤال نعم/لا واحصل على إجابة\n│  مثال: ${config.prefix}8ball هل سأفوز اليوم؟`,
        dice: `├─ 🎲 رمي النرد\n│  الأمر: ${config.prefix}dice <رهان>\n│  ارمي نردين واربح عملات!\n│  أزواج: 3x رهان | 7 أو 11: 2x رهان\n│  مثال: ${config.prefix}dice 10`,
        coinflip: `├─ 🪙 رمي العملة\n│  الأمر: ${config.prefix}coin <رهان> <heads/tails>\n│  خمن رمي العملة واربح!\n│  تخمين صحيح: 2x رهان\n│  مثال: ${config.prefix}coin 10 heads`,
        rps: `├─ ✊✋✌️ حجر ورقة مقص\n│  الأمر: ${config.prefix}rps <اختيار>\n│  العب ضد البوت أو تحدى لاعب\n│  الاختيارات: rock, paper, scissors\n│  وضع البوت: ${config.prefix}rps rock\n│  وضع لاعب ضد لاعب: ${config.prefix}rps @مستخدم rock`,
        guess: `├─ 🔢 تخمين الرقم\n│  الأمر: ${config.prefix}guess [رقم]\n│  خمن رقم بين 1-100\n│  البوت يعطيك تلميحات (أعلى/أقل)\n│  ابدأ: ${config.prefix}guess\n│  خمن: ${config.prefix}guess 50`,
        trivia: `├─ 🧠 أسئلة ثقافية\n│  الأمر: ${config.prefix}trivia\n│  أجب على أسئلة ثقافية عشوائية\n│  اختيار متعدد (a, b, c, d)\n│  اختبر معلوماتك!`,
        slot: `├─ 🎰 لعبة السلوت\n│  الأمر: ${config.prefix}slot <رهان>\n│  أدر السلوت واربح عملات!\n│  طابق 3 رموز لفوز كبير\n│  مثال: ${config.prefix}slot 10`,
        bank: `├─ 💰 البنك\n│  الأمر: ${config.prefix}bank\n│  تحقق من رصيد عملاتك\n│  الجميع يبدأ بـ 100 عملة\n│  استخدم العملات للعب السلوت`,
        math: `├─ ➕➖✖️ تحدي رياضي\n│  الأمر: ${config.prefix}math\n│  حل مسائل رياضية عشوائية\n│  جمع، طرح، ضرب\n│  أجب بحلك!`,
        tictactoe: `└─ ⭕❌ إكس أو\n   الأمر: ${config.prefix}ttt\n   لعبة إكس أو الكلاسيكية\n   وضع البوت: ${config.prefix}ttt\n   وضع لاعب ضد لاعب: ${config.prefix}ttt @مستخدم\n   قم بالحركات: ${config.prefix}ttt <1-9>`,
        roulette: `└─ 🎰 الروليت\n   الأمر: ${config.prefix}roulette <رهان> <نوع>\n   روليت أوروبي مع أنواع رهان متعددة\n   مباشر (35:1), أحمر/أسود (1:1), دزينات (2:1)\n   مثال: ${config.prefix}roulette 10 red`,
        footer: `╔═══════════════════════════╗\n║  إجمالي الألعاب: 11  |  البادئة: ${config.prefix}  ║\n╚═══════════════════════════╝\n\n💡 جميع الألعاب تعمل في المجموعات والمحادثات الخاصة!\n🎯 بعض الألعاب تتبع تقدمك بين الرسائل\n🏆 تحدى أصدقاءك واستمتع!\n\nاكتب ${config.prefix}menu لرؤية جميع أوامر البوت`
    },
    hi: {
        title: '╔═══════════════════════════╗\n║      🎮 गेम कमांड      ║\n╚═══════════════════════════╝\n\nबॉट के साथ मजेदार गेम खेलें!\n\n🤖 नया: .ai <प्रश्न> के साथ AI से कुछ भी पूछें',
        eightball: `┌─ 🎱 जादुई 8-बॉल\n│  कमांड: ${config.prefix}8ball <प्रश्न>\n│  कोई भी हां/नहीं प्रश्न पूछें और भाग्य पाएं\n│  उदाहरण: ${config.prefix}8ball क्या मैं आज जीतूंगा?`,
        dice: `├─ 🎲 पासा रोल\n│  कमांड: ${config.prefix}dice <दांव>\n│  दो पासे रोल करें और सिक्के जीतें!\n│  डबल: 3x दांव | 7 या 11: 2x दांव\n│  उदाहरण: ${config.prefix}dice 10`,
        coinflip: `├─ 🪙 सिक्का उछाल\n│  कमांड: ${config.prefix}coin <दांव> <heads/tails>\n│  सिक्का उछाल का अनुमान लगाएं और जीतें!\n│  सही अनुमान: 2x दांव\n│  उदाहरण: ${config.prefix}coin 10 heads`,
        rps: `├─ ✊✋✌️ पत्थर कागज कैंची\n│  कमांड: ${config.prefix}rps <विकल्प>\n│  बॉट के खिलाफ खेलें या किसी खिलाड़ी को चुनौती दें\n│  विकल्प: rock, paper, scissors\n│  बॉट मोड: ${config.prefix}rps rock\n│  PvP मोड: ${config.prefix}rps @उपयोगकर्ता rock`,
        guess: `├─ 🔢 संख्या अनुमान\n│  कमांड: ${config.prefix}guess [संख्या]\n│  1-100 के बीच एक संख्या का अनुमान लगाएं\n│  बॉट आपको संकेत देता है (अधिक/कम)\n│  शुरू करें: ${config.prefix}guess\n│  अनुमान: ${config.prefix}guess 50`,
        trivia: `├─ 🧠 ट्रिविया क्विज\n│  कमांड: ${config.prefix}trivia\n│  यादृच्छिक ट्रिविया प्रश्नों के उत्तर दें\n│  बहुविकल्पीय (a, b, c, d)\n│  अपने ज्ञान का परीक्षण करें!`,
        slot: `├─ 🎰 स्लॉट मशीन\n│  कमांड: ${config.prefix}slot <दांव>\n│  स्लॉट घुमाएं और सिक्के जीतें!\n│  बड़ी जीत के लिए 3 प्रतीक मिलाएं\n│  उदाहरण: ${config.prefix}slot 10`,
        bank: `├─ 💰 बैंक\n│  कमांड: ${config.prefix}bank\n│  अपना सिक्का बैलेंस जांचें\n│  सभी 100 सिक्कों से शुरू करते हैं\n│  स्लॉट मशीन खेलने के लिए सिक्कों का उपयोग करें`,
        math: `├─ ➕➖✖️ गणित चुनौती\n│  कमांड: ${config.prefix}math\n│  यादृच्छिक गणित समस्याओं को हल करें\n│  जोड़, घटाव, गुणा\n│  अपने उत्तर के साथ जवाब दें!`,
        tictactoe: `├─ ⭕❌ टिक-टैक-टो\n│  कमांड: ${config.prefix}ttt\n│  क्लासिक टिक-टैक-टो गेम\n│  बॉट मोड: ${config.prefix}ttt\n│  PvP मोड: ${config.prefix}ttt @उपयोगकर्ता\n│  चाल चलें: ${config.prefix}ttt <1-9>`,
        roulette: `└─ 🎰 रूलेट\n   कमांड: ${config.prefix}roulette <दांव> <प्रकार>\n   कई दांव प्रकारों के साथ यूरोपीय रूलेट\n   सीधा (35:1), लाल/काला (1:1), दर्जन (2:1)\n   उदाहरण: ${config.prefix}roulette 10 red`,
        footer: `╔═══════════════════════════╗\n║  कुल गेम: 11  |  प्रीफिक्स: ${config.prefix}  ║\n╚═══════════════════════════╝\n\n💡 सभी गेम ग्रुप और निजी चैट में काम करते हैं!\n🎯 कुछ गेम संदेशों के बीच आपकी प्रगति को ट्रैक करते हैं\n🏆 अपने दोस्तों को चुनौती दें और मज़े करें!\n\nसभी बॉट कमांड देखने के लिए ${config.prefix}menu टाइप करें`
    }
};

export default {
    name: 'games',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        const gamesText = `${t.title}\n\n${t.eightball}\n│\n${t.dice}\n│\n${t.coinflip}\n│\n${t.rps}\n│\n${t.guess}\n│\n${t.trivia}\n│\n${t.slot}\n│\n${t.bank}\n│\n${t.math}\n│\n${t.tictactoe}\n│\n${t.roulette}\n\n${t.footer}`;

        await sendAsChannelForward(sock, from, gamesText, {
            quoted: msg,
            newsletterName: config.botName || 'Games'
        });
    }
};
