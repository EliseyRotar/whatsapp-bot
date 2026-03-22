import { getGroupLanguage } from '../../utils/language.js';

const activeMath = new Map();

const responses = {
    en: {
        invalidNumber: 'Please provide a number!',
        player: '👤 Player:',
        correct: '✅ Correct! {question} = {answer}\n\nPlay again with: .math',
        wrong: '❌ Wrong! {question} = {answer}\n\nTry again with: .math',
        challenge: '🧮 MATH CHALLENGE!\n\nSolve: {question} = ?\n\nAnswer with: .math <answer>'
    },
    it: {
        invalidNumber: 'Fornisci un numero!',
        player: '👤 Giocatore:',
        correct: '✅ Corretto! {question} = {answer}\n\nGioca di nuovo con: .math',
        wrong: '❌ Sbagliato! {question} = {answer}\n\nRiprova con: .math',
        challenge: '🧮 SFIDA MATEMATICA!\n\nRisolvi: {question} = ?\n\nRispondi con: .math <risposta>'
    },
    ru: {
        invalidNumber: 'Пожалуйста, укажите число!',
        player: '👤 Игрок:',
        correct: '✅ Правильно! {question} = {answer}\n\nИграйте снова: .math',
        wrong: '❌ Неправильно! {question} = {answer}\n\nПопробуйте снова: .math',
        challenge: '🧮 МАТЕМАТИЧЕСКИЙ ВЫЗОВ!\n\nРешите: {question} = ?\n\nОтветьте: .math <ответ>'
    },
    es: {
        invalidNumber: '¡Por favor proporciona un número!',
        player: '👤 Jugador:',
        correct: '✅ ¡Correcto! {question} = {answer}\n\nJuega de nuevo con: .math',
        wrong: '❌ ¡Incorrecto! {question} = {answer}\n\nIntenta de nuevo con: .math',
        challenge: '🧮 ¡DESAFÍO MATEMÁTICO!\n\nResuelve: {question} = ?\n\nResponde con: .math <respuesta>'
    },
    pt: {
        invalidNumber: 'Por favor forneça um número!',
        player: '👤 Jogador:',
        correct: '✅ Correto! {question} = {answer}\n\nJogue novamente com: .math',
        wrong: '❌ Errado! {question} = {answer}\n\nTente novamente com: .math',
        challenge: '🧮 DESAFIO MATEMÁTICO!\n\nResolva: {question} = ?\n\nResponda com: .math <resposta>'
    },
    ar: {
        invalidNumber: 'اكتب رقم!',
        player: '👤 اللاعب:',
        correct: '✅ صح! {question} = {answer}\n\nالعب تاني بـ: .math',
        wrong: '❌ غلط! {question} = {answer}\n\nحاول تاني بـ: .math',
        challenge: '🧮 تحدي رياضيات!\n\nحل: {question} = ?\n\nرد بـ: .math <الإجابة>'
    },
    hi: {
        invalidNumber: 'कृपया एक संख्या प्रदान करें!',
        player: '👤 खिलाड़ी:',
        correct: '✅ सही! {question} = {answer}\n\nफिर से खेलें: .math',
        wrong: '❌ गलत! {question} = {answer}\n\nपुनः प्रयास करें: .math',
        challenge: '🧮 गणित चुनौती!\n\nहल करें: {question} = ?\n\nउत्तर दें: .math <उत्तर>'
    },
    ng: {
        invalidNumber: 'Abeg give number!',
        player: '👤 Player:',
        correct: '✅ Correct! {question} = {answer}\n\nPlay again with: .math',
        wrong: '❌ Wrong! {question} = {answer}\n\nTry again with: .math',
        challenge: '🧮 MATH CHALLENGE!\n\nSolve: {question} = ?\n\nAnswer with: .math <answer>'
    }
};

export default {
    name: 'math',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const pushName = msg.pushName || 'Player';
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        // Answer a question
        if (activeMath.has(sender)) {
            const answer = parseInt(args[0]);
            
            if (isNaN(answer)) {
                return await sock.sendMessage(from, { 
                    text: t.invalidNumber
                });
            }
            
            const math = activeMath.get(sender);
            activeMath.delete(sender);
            
            if (answer === math.answer) {
                return await sock.sendMessage(from, { 
                    text: t.correct.replace('{question}', math.question).replace('{answer}', math.answer)
                });
            } else {
                return await sock.sendMessage(from, { 
                    text: t.wrong.replace('{question}', math.question).replace('{answer}', math.answer)
                });
            }
        }
        
        // Generate new question
        const operations = ['+', '-', '*'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        
        let num1, num2, answer, question;
        
        if (operation === '+') {
            num1 = Math.floor(Math.random() * 50) + 1;
            num2 = Math.floor(Math.random() * 50) + 1;
            answer = num1 + num2;
            question = `${num1} + ${num2}`;
        } else if (operation === '-') {
            num1 = Math.floor(Math.random() * 50) + 20;
            num2 = Math.floor(Math.random() * 20) + 1;
            answer = num1 - num2;
            question = `${num1} - ${num2}`;
        } else {
            num1 = Math.floor(Math.random() * 12) + 1;
            num2 = Math.floor(Math.random() * 12) + 1;
            answer = num1 * num2;
            question = `${num1} × ${num2}`;
        }
        
        activeMath.set(sender, { question, answer });
        
        await sock.sendMessage(from, { 
            text: `${t.player} ${pushName}\n\n${t.challenge.replace('{question}', question)}`
        });
    }
};
