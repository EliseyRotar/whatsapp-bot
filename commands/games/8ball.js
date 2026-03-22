import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        usage: '🎱 Magic 8-Ball\n\nAsk a yes/no question!\n\nUsage: .8ball <question>\n\nExample: .8ball Will I win today?',
        player: '👤 Player:',
        question: '❓ Question:',
        answer: '🔮 The Magic 8-Ball says:',
        shaking: '🎱 Shaking the Magic 8-Ball...',
        title: '╔═══════════════════════════╗\n║     🎱 MAGIC 8-BALL     ║\n╚═══════════════════════════╝',
        // Positive answers (10)
        positive: [
            '✅ Yes, definitely!',
            '✅ It is certain!',
            '✅ Without a doubt!',
            '✅ Yes, absolutely!',
            '✅ You may rely on it!',
            '✅ As I see it, yes!',
            '✅ Most likely!',
            '✅ Outlook good!',
            '✅ Signs point to yes!',
            '✅ Yes!'
        ],
        // Neutral/uncertain answers (5)
        neutral: [
            '🤔 Reply hazy, try again',
            '🤔 Ask again later',
            '🤔 Better not tell you now',
            '🤔 Cannot predict now',
            '🤔 Concentrate and ask again'
        ],
        // Negative answers (5)
        negative: [
            '❌ Don\'t count on it',
            '❌ My reply is no',
            '❌ My sources say no',
            '❌ Outlook not so good',
            '❌ Very doubtful'
        ]
    },
    it: {
        usage: '🎱 Palla Magica 8\n\nFai una domanda sì/no!\n\nUso: .8ball <domanda>\n\nEsempio: .8ball Vincerò oggi?',
        player: '👤 Giocatore:',
        question: '❓ Domanda:',
        answer: '🔮 La Palla Magica 8 dice:',
        shaking: '🎱 Agitando la Palla Magica...',
        title: '╔═══════════════════════════╗\n║     🎱 PALLA MAGICA 8     ║\n╚═══════════════════════════╝',
        positive: [
            '✅ Sì, decisamente!',
            '✅ È certo!',
            '✅ Senza dubbio!',
            '✅ Sì, assolutamente!',
            '✅ Puoi contarci!',
            '✅ Come la vedo io, sì!',
            '✅ Molto probabilmente!',
            '✅ Prospettive buone!',
            '✅ I segni indicano di sì!',
            '✅ Sì!'
        ],
        neutral: [
            '🤔 Risposta nebbiosa, riprova',
            '🤔 Chiedi di nuovo più tardi',
            '🤔 Meglio non dirtelo ora',
            '🤔 Non posso prevedere ora',
            '🤔 Concentrati e chiedi di nuovo'
        ],
        negative: [
            '❌ Non contarci',
            '❌ La mia risposta è no',
            '❌ Le mie fonti dicono di no',
            '❌ Prospettive non così buone',
            '❌ Molto dubbioso'
        ]
    },
    ru: {
        usage: '🎱 Магический Шар 8\n\nЗадайте вопрос да/нет!\n\nИспользование: .8ball <вопрос>\n\nПример: .8ball Я выиграю сегодня?',
        player: '👤 Игрок:',
        question: '❓ Вопрос:',
        answer: '🔮 Магический Шар 8 говорит:',
        shaking: '🎱 Трясём Магический Шар...',
        title: '╔═══════════════════════════╗\n║     🎱 МАГИЧЕСКИЙ ШАР 8     ║\n╚═══════════════════════════╝',
        positive: [
            '✅ Да, определённо!',
            '✅ Это точно!',
            '✅ Без сомнения!',
            '✅ Да, абсолютно!',
            '✅ Можете на это рассчитывать!',
            '✅ Как я вижу, да!',
            '✅ Скорее всего!',
            '✅ Хорошие перспективы!',
            '✅ Знаки указывают на да!',
            '✅ Да!'
        ],
        neutral: [
            '🤔 Ответ туманен, попробуйте снова',
            '🤔 Спросите позже',
            '🤔 Лучше не говорить сейчас',
            '🤔 Не могу предсказать сейчас',
            '🤔 Сосредоточьтесь и спросите снова'
        ],
        negative: [
            '❌ Не рассчитывайте на это',
            '❌ Мой ответ - нет',
            '❌ Мои источники говорят нет',
            '❌ Перспективы не очень хорошие',
            '❌ Весьма сомнительно'
        ]
    },
    es: {
        usage: '🎱 Bola Mágica 8\n\n¡Haz una pregunta de sí/no!\n\nUso: .8ball <pregunta>\n\nEjemplo: .8ball ¿Ganaré hoy?',
        player: '👤 Jugador:',
        question: '❓ Pregunta:',
        answer: '🔮 La Bola Mágica 8 dice:',
        shaking: '🎱 Agitando la Bola Mágica...',
        title: '╔═══════════════════════════╗\n║     🎱 BOLA MÁGICA 8     ║\n╚═══════════════════════════╝',
        positive: [
            '✅ ¡Sí, definitivamente!',
            '✅ ¡Es cierto!',
            '✅ ¡Sin duda!',
            '✅ ¡Sí, absolutamente!',
            '✅ ¡Puedes confiar en ello!',
            '✅ ¡Como lo veo, sí!',
            '✅ ¡Muy probablemente!',
            '✅ ¡Buen pronóstico!',
            '✅ ¡Las señales apuntan a sí!',
            '✅ ¡Sí!'
        ],
        neutral: [
            '🤔 Respuesta confusa, intenta de nuevo',
            '🤔 Pregunta de nuevo más tarde',
            '🤔 Mejor no decírtelo ahora',
            '🤔 No puedo predecir ahora',
            '🤔 Concéntrate y pregunta de nuevo'
        ],
        negative: [
            '❌ No cuentes con ello',
            '❌ Mi respuesta es no',
            '❌ Mis fuentes dicen que no',
            '❌ El pronóstico no es tan bueno',
            '❌ Muy dudoso'
        ]
    },
    pt: {
        usage: '🎱 Bola Mágica 8\n\nFaça uma pergunta de sim/não!\n\nUso: .8ball <pergunta>\n\nExemplo: .8ball Vou ganhar hoje?',
        player: '👤 Jogador:',
        question: '❓ Pergunta:',
        answer: '🔮 A Bola Mágica 8 diz:',
        shaking: '🎱 Agitando a Bola Mágica...',
        title: '╔═══════════════════════════╗\n║     🎱 BOLA MÁGICA 8     ║\n╚═══════════════════════════╝',
        positive: [
            '✅ Sim, definitivamente!',
            '✅ É certo!',
            '✅ Sem dúvida!',
            '✅ Sim, absolutamente!',
            '✅ Você pode confiar nisso!',
            '✅ Como eu vejo, sim!',
            '✅ Muito provavelmente!',
            '✅ Bom prognóstico!',
            '✅ Os sinais apontam para sim!',
            '✅ Sim!'
        ],
        neutral: [
            '🤔 Resposta confusa, tente novamente',
            '🤔 Pergunte novamente mais tarde',
            '🤔 Melhor não te dizer agora',
            '🤔 Não posso prever agora',
            '🤔 Concentre-se e pergunte novamente'
        ],
        negative: [
            '❌ Não conte com isso',
            '❌ Minha resposta é não',
            '❌ Minhas fontes dizem que não',
            '❌ O prognóstico não é tão bom',
            '❌ Muito duvidoso'
        ]
    },
    ar: {
        usage: '🎱 كرة الحظ السحرية\n\nاسأل سؤال نعم/لا!\n\nالاستخدام: .8ball <سؤال>\n\nمثال: .8ball هل سأفوز اليوم؟',
        player: '👤 اللاعب:',
        question: '❓ السؤال:',
        answer: '🔮 كرة الحظ السحرية تقول:',
        shaking: '🎱 نهز الكرة السحرية...',
        title: '╔═══════════════════════════╗\n║     🎱 كرة الحظ السحرية     ║\n╚═══════════════════════════╝',
        positive: [
            '✅ نعم، بالتأكيد!',
            '✅ إنه مؤكد!',
            '✅ بلا شك!',
            '✅ نعم، بالطبع!',
            '✅ يمكنك الاعتماد عليه!',
            '✅ كما أراه، نعم!',
            '✅ على الأرجح!',
            '✅ التوقعات جيدة!',
            '✅ العلامات تشير إلى نعم!',
            '✅ نعم!'
        ],
        neutral: [
            '🤔 الإجابة غامضة، حاول مرة أخرى',
            '🤔 اسأل مرة أخرى لاحقاً',
            '🤔 من الأفضل عدم إخبارك الآن',
            '🤔 لا يمكن التنبؤ الآن',
            '🤔 ركز واسأل مرة أخرى'
        ],
        negative: [
            '❌ لا تعتمد عليه',
            '❌ إجابتي هي لا',
            '❌ مصادري تقول لا',
            '❌ التوقعات ليست جيدة',
            '❌ مشكوك فيه جداً'
        ]
    },
    hi: {
        usage: '🎱 जादुई 8-बॉल\n\nहां/नहीं प्रश्न पूछें!\n\nउपयोग: .8ball <प्रश्न>\n\nउदाहरण: .8ball क्या मैं आज जीतूंगा?',
        player: '👤 खिलाड़ी:',
        question: '❓ प्रश्न:',
        answer: '🔮 जादुई 8-बॉल कहता है:',
        shaking: '🎱 जादुई 8-बॉल को हिला रहे हैं...',
        title: '╔═══════════════════════════╗\n║     🎱 जादुई 8-बॉल     ║\n╚═══════════════════════════╝',
        positive: [
            '✅ हां, निश्चित रूप से!',
            '✅ यह निश्चित है!',
            '✅ बिना किसी संदेह के!',
            '✅ हां, बिल्कुल!',
            '✅ आप इस पर भरोसा कर सकते हैं!',
            '✅ जैसा मैं देखता हूं, हां!',
            '✅ सबसे अधिक संभावना!',
            '✅ दृष्टिकोण अच्छा है!',
            '✅ संकेत हां की ओर इशारा करते हैं!',
            '✅ हां!'
        ],
        neutral: [
            '🤔 उत्तर अस्पष्ट है, पुनः प्रयास करें',
            '🤔 बाद में फिर से पूछें',
            '🤔 अभी आपको नहीं बताना बेहतर है',
            '🤔 अभी भविष्यवाणी नहीं कर सकता',
            '🤔 ध्यान केंद्रित करें और फिर से पूछें'
        ],
        negative: [
            '❌ इस पर भरोसा न करें',
            '❌ मेरा उत्तर नहीं है',
            '❌ मेरे स्रोत नहीं कहते हैं',
            '❌ दृष्टिकोण इतना अच्छा नहीं है',
            '❌ बहुत संदेहास्पद'
        ]
    },
    ng: {
        usage: '🎱 Magic 8-Ball\n\nAsk yes/no question!\n\nHow to use: .8ball <question>\n\nExample: .8ball I go win today?',
        player: '👤 Player:',
        question: '❓ Question:',
        answer: '🔮 Di Magic 8-Ball talk say:',
        shaking: '🎱 We dey shake di Magic 8-Ball...',
        title: '╔═══════════════════════════╗\n║     🎱 MAGIC 8-BALL     ║\n╚═══════════════════════════╝',
        positive: [
            '✅ Yes, for sure!',
            '✅ E sure die!',
            '✅ No doubt at all!',
            '✅ Yes, 100 percent!',
            '✅ You fit trust am!',
            '✅ As I see am, yes!',
            '✅ E go most likely happen!',
            '✅ Things dey look good!',
            '✅ All signs dey point to yes!',
            '✅ Yes!'
        ],
        neutral: [
            '🤔 Answer no clear, try again',
            '🤔 Ask again later',
            '🤔 Better make I no tell you now',
            '🤔 I no fit predict now',
            '🤔 Concentrate and ask again'
        ],
        negative: [
            '❌ No count on am',
            '❌ My answer na no',
            '❌ My sources talk say no',
            '❌ Things no dey look good',
            '❌ E dey very doubtful'
        ]
    }
};

export default {
    name: '8ball',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const pushName = msg.pushName || 'Player';
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        if (args.length === 0) {
            return await sock.sendMessage(from, { 
                text: t.usage
            });
        }
        
        const question = args.join(' ');
        
        // Send shaking animation
        const shakingMsg = await sock.sendMessage(from, { 
            text: `${t.title}\n\n${t.player} ${pushName}\n\n${t.question}\n${question}\n\n${t.shaking}`
        });
        
        // Wait for dramatic effect
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Randomly select answer type with weighted probability
        // 50% positive, 25% neutral, 25% negative
        const rand = Math.random();
        let answerArray;
        
        if (rand < 0.5) {
            answerArray = t.positive;
        } else if (rand < 0.75) {
            answerArray = t.neutral;
        } else {
            answerArray = t.negative;
        }
        
        const answer = answerArray[Math.floor(Math.random() * answerArray.length)];
        
        // Edit message with final answer
        await sock.sendMessage(from, {
            text: `${t.title}\n\n${t.player} ${pushName}\n\n${t.question}\n${question}\n\n${t.answer}\n\n🎱 ${answer}`,
            edit: shakingMsg.key
        });
    }
};
