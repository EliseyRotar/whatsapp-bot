import { config } from '../../config.js';
import { sleep } from '../../utils/helpers.js';
import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        usage: '❌ Usage:\n.spam <count> <text>\n.spam <count> <delay_ms> <text>\n\nExamples:\n.spam 10 Hello World\n.spam 5 2000 Delayed message\n\n⚠️ WARNING: Excessive spam can result in WhatsApp bans!',
        invalidCount: '❌ Count must be a positive number.',
        maxExceeded: '❌ Maximum spam count is {max}.',
        noMessage: '❌ Please provide a message to spam.',
        starting: '🚀 Starting spam: {count} messages with {delay}ms delay...\n\n⚠️ WARNING: Excessive spam can result in WhatsApp bans!',
        stopped: '❌ Spam stopped at message {num}: {error}',
        completed: '✅ Spam completed: {count} messages sent!'
    },
    it: {
        usage: '❌ Uso:\n.spam <numero> <testo>\n.spam <numero> <ritardo_ms> <testo>\n\nEsempi:\n.spam 10 Ciao Mondo\n.spam 5 2000 Messaggio ritardato\n\n⚠️ ATTENZIONE: Spam eccessivo può causare ban WhatsApp!',
        invalidCount: '❌ Il numero deve essere positivo.',
        maxExceeded: '❌ Numero massimo spam è {max}.',
        noMessage: '❌ Fornisci un messaggio da spammare.',
        starting: '🚀 Inizio spam: {count} messaggi con {delay}ms ritardo...\n\n⚠️ ATTENZIONE: Spam eccessivo può causare ban WhatsApp!',
        stopped: '❌ Spam fermato al messaggio {num}: {error}',
        completed: '✅ Spam completato: {count} messaggi inviati!'
    },
    ru: {
        usage: '❌ Использование:\n.spam <количество> <текст>\n.spam <количество> <задержка_мс> <текст>\n\nПримеры:\n.spam 10 Привет Мир\n.spam 5 2000 Отложенное сообщение\n\n⚠️ ВНИМАНИЕ: Чрезмерный спам может привести к бану WhatsApp!',
        invalidCount: '❌ Количество должно быть положительным числом.',
        maxExceeded: '❌ Максимальное количество спама {max}.',
        noMessage: '❌ Пожалуйста, укажите сообщение для спама.',
        starting: '🚀 Начало спама: {count} сообщений с задержкой {delay}мс...\n\n⚠️ ВНИМАНИЕ: Чрезмерный спам может привести к бану WhatsApp!',
        stopped: '❌ Спам остановлен на сообщении {num}: {error}',
        completed: '✅ Спам завершён: отправлено {count} сообщений!'
    },
    es: {
        usage: '❌ Uso:\n.spam <cantidad> <texto>\n.spam <cantidad> <retraso_ms> <texto>\n\nEjemplos:\n.spam 10 Hola Mundo\n.spam 5 2000 Mensaje retrasado\n\n⚠️ ADVERTENCIA: ¡El spam excesivo puede resultar en baneos de WhatsApp!',
        invalidCount: '❌ La cantidad debe ser un número positivo.',
        maxExceeded: '❌ La cantidad máxima de spam es {max}.',
        noMessage: '❌ Por favor proporciona un mensaje para enviar spam.',
        starting: '🚀 Iniciando spam: {count} mensajes con {delay}ms de retraso...\n\n⚠️ ADVERTENCIA: ¡El spam excesivo puede resultar en baneos de WhatsApp!',
        stopped: '❌ Spam detenido en el mensaje {num}: {error}',
        completed: '✅ Spam completado: ¡{count} mensajes enviados!'
    },
    pt: {
        usage: '❌ Uso:\n.spam <quantidade> <texto>\n.spam <quantidade> <atraso_ms> <texto>\n\nExemplos:\n.spam 10 Olá Mundo\n.spam 5 2000 Mensagem atrasada\n\n⚠️ AVISO: Spam excessivo pode resultar em banimentos do WhatsApp!',
        invalidCount: '❌ A quantidade deve ser um número positivo.',
        maxExceeded: '❌ A quantidade máxima de spam é {max}.',
        noMessage: '❌ Por favor forneça uma mensagem para enviar spam.',
        starting: '🚀 Iniciando spam: {count} mensagens com {delay}ms de atraso...\n\n⚠️ AVISO: Spam excessivo pode resultar em banimentos do WhatsApp!',
        stopped: '❌ Spam parado na mensagem {num}: {error}',
        completed: '✅ Spam concluído: {count} mensagens enviadas!'
    },
    ar: {
        usage: '❌ الاستخدام:\n.spam <العدد> <النص>\n.spam <العدد> <التأخير_مللي_ثانية> <النص>\n\nأمثلة:\n.spam 10 مرحبا بالعالم\n.spam 5 2000 رسالة متأخرة',
        invalidCount: '❌ العدد لازم يكون رقم موجب.',
        maxExceeded: '❌ الحد الأقصى للسبام هو {max}.',
        noMessage: '❌ من فضلك اكتب رسالة للسبام.',
        starting: '🚀 بدء السبام: {count} رسالة مع تأخير {delay}مللي ثانية...\n\n⚠️ تحذير: السبام الكتير ممكن يسبب بان من واتساب!',
        stopped: '❌ السبام توقف عند الرسالة {num}: {error}',
        completed: '✅ السبام اكتمل: {count} رسالة اتبعتت!'
    },
    hi: {
        usage: '❌ उपयोग:\n.spam <संख्या> <टेक्स्ट>\n.spam <संख्या> <देरी_ms> <टेक्स्ट>\n\nउदाहरण:\n.spam 10 Hello World\n.spam 5 2000 Delayed message\n\n⚠️ चेतावनी: अत्यधिक स्पैम से WhatsApp बैन हो सकता है!',
        invalidCount: '❌ संख्या सकारात्मक होनी चाहिए।',
        maxExceeded: '❌ अधिकतम स्पैम संख्या {max} है।',
        noMessage: '❌ कृपया स्पैम करने के लिए एक मैसेज प्रदान करें।',
        starting: '🚀 स्पैम शुरू: {count} मैसेज {delay}ms देरी के साथ...\n\n⚠️ चेतावनी: अत्यधिक स्पैम से WhatsApp बैन हो सकता है!',
        stopped: '❌ स्पैम मैसेज {num} पर रुका: {error}',
        completed: '✅ स्पैम पूर्ण: {count} मैसेज भेजे गए!'
    }
};

export default {
    name: 'spam',
    ownerOnly: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        if (args.length < 2) {
            return await sock.sendMessage(from, { 
                text: t.usage
            });
        }
        
        const count = parseInt(args[0]);
        if (isNaN(count) || count < 1) {
            return await sock.sendMessage(from, { text: t.invalidCount });
        }
        
        if (count > config.maxSpamCount) {
            return await sock.sendMessage(from, { 
                text: t.maxExceeded.replace('{max}', config.maxSpamCount)
            });
        }
        
        let delay = config.spamDelay;
        let text;
        
        // Check if second arg is a delay
        const possibleDelay = parseInt(args[1]);
        if (!isNaN(possibleDelay)) {
            delay = possibleDelay;
            text = args.slice(2).join(' ');
        } else {
            text = args.slice(1).join(' ');
        }
        
        if (!text) {
            return await sock.sendMessage(from, { text: t.noMessage });
        }
        
        await sock.sendMessage(from, { 
            text: t.starting.replace('{count}', count).replace('{delay}', delay)
        });
        
        for (let i = 0; i < count; i++) {
            try {
                await sock.sendMessage(from, { text: text });
                if (i < count - 1) await sleep(delay);
            } catch (error) {
                await sock.sendMessage(from, { 
                    text: t.stopped.replace('{num}', i + 1).replace('{error}', error.message)
                });
                break;
            }
        }
        
        await sock.sendMessage(from, { text: t.completed.replace('{count}', count) });
    }
};
