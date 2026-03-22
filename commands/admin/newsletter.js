import { getGroupLanguage } from '../../utils/language.js';

// Newsletter channel ID
const NEWSLETTER_ID = '120363423949011615@newsletter';

const responses = {
    en: {
        usage: `📰 NEWSLETTER POSTING

🎯 Post to newsletter:
   .newsletter <message>
   .postnews <message>

📝 Examples:
   .newsletter Check out our new finance tips!
   .postnews 💰 Motivation Monday: Stay focused on your goals!

📸 With media:
   Reply to an image/video with:
   .newsletter Your caption here

⚠️ Owner only command`,
        noMessage: '❌ Please provide a message to post!\n\nUsage: .newsletter <your message>',
        posting: '📤 Posting to newsletter...',
        success: '✅ Posted to newsletter successfully!',
        error: '❌ Failed to post to newsletter: {error}',
        notOwner: '❌ Only bot owners can post to the newsletter!'
    },
    it: {
        usage: `📰 PUBBLICAZIONE NEWSLETTER

🎯 Pubblica sulla newsletter:
   .newsletter <messaggio>
   .postnews <messaggio>

📝 Esempi:
   .newsletter Scopri i nostri nuovi consigli finanziari!
   .postnews 💰 Lunedì Motivazionale: Resta concentrato sui tuoi obiettivi!

📸 Con media:
   Rispondi a un'immagine/video con:
   .newsletter La tua didascalia qui

⚠️ Solo comando proprietario`,
        noMessage: '❌ Fornisci un messaggio da pubblicare!\n\nUso: .newsletter <tuo messaggio>',
        posting: '📤 Pubblicazione sulla newsletter...',
        success: '✅ Pubblicato sulla newsletter con successo!',
        error: '❌ Impossibile pubblicare sulla newsletter: {error}',
        notOwner: '❌ Solo i proprietari del bot possono pubblicare sulla newsletter!'
    },
    es: {
        usage: `📰 PUBLICACIÓN EN NEWSLETTER

🎯 Publicar en newsletter:
   .newsletter <mensaje>
   .postnews <mensaje>

📝 Ejemplos:
   .newsletter ¡Descubre nuestros nuevos consejos financieros!
   .postnews 💰 Lunes de Motivación: ¡Mantente enfocado en tus metas!

📸 Con medios:
   Responde a una imagen/video con:
   .newsletter Tu leyenda aquí

⚠️ Solo comando de propietario`,
        noMessage: '❌ ¡Proporciona un mensaje para publicar!\n\nUso: .newsletter <tu mensaje>',
        posting: '📤 Publicando en newsletter...',
        success: '✅ ¡Publicado en newsletter exitosamente!',
        error: '❌ Error al publicar en newsletter: {error}',
        notOwner: '❌ ¡Solo los propietarios del bot pueden publicar en el newsletter!'
    },
    pt: {
        usage: `📰 PUBLICAÇÃO NO NEWSLETTER

🎯 Publicar no newsletter:
   .newsletter <mensagem>
   .postnews <mensagem>

📝 Exemplos:
   .newsletter Confira nossas novas dicas financeiras!
   .postnews 💰 Segunda de Motivação: Mantenha o foco em seus objetivos!

📸 Com mídia:
   Responda a uma imagem/vídeo com:
   .newsletter Sua legenda aqui

⚠️ Comando apenas para proprietários`,
        noMessage: '❌ Forneça uma mensagem para publicar!\n\nUso: .newsletter <sua mensagem>',
        posting: '📤 Publicando no newsletter...',
        success: '✅ Publicado no newsletter com sucesso!',
        error: '❌ Falha ao publicar no newsletter: {error}',
        notOwner: '❌ Apenas proprietários do bot podem publicar no newsletter!'
    },
    ru: {
        usage: `📰 ПУБЛИКАЦИЯ В РАССЫЛКЕ

🎯 Опубликовать в рассылке:
   .newsletter <сообщение>
   .postnews <сообщение>

📝 Примеры:
   .newsletter Ознакомьтесь с нашими новыми финансовыми советами!
   .postnews 💰 Мотивационный понедельник: Оставайтесь сосредоточенными на своих целях!

📸 С медиа:
   Ответьте на изображение/видео с:
   .newsletter Ваша подпись здесь

⚠️ Только для владельцев`,
        noMessage: '❌ Укажите сообщение для публикации!\n\nИспользование: .newsletter <ваше сообщение>',
        posting: '📤 Публикация в рассылке...',
        success: '✅ Успешно опубликовано в рассылке!',
        error: '❌ Не удалось опубликовать в рассылке: {error}',
        notOwner: '❌ Только владельцы бота могут публиковать в рассылке!'
    },
    ar: {
        usage: `📰 النشر في النشرة الإخبارية

🎯 النشر في النشرة:
   .newsletter <رسالة>
   .postnews <رسالة>

📝 أمثلة:
   .newsletter تحقق من نصائحنا المالية الجديدة!
   .postnews 💰 إثنين التحفيز: ابق مركزاً على أهدافك!

📸 مع الوسائط:
   الرد على صورة/فيديو مع:
   .newsletter التعليق الخاص بك هنا

⚠️ أمر المالك فقط`,
        noMessage: '❌ يرجى تقديم رسالة للنشر!\n\nالاستخدام: .newsletter <رسالتك>',
        posting: '📤 النشر في النشرة...',
        success: '✅ تم النشر في النشرة بنجاح!',
        error: '❌ فشل النشر في النشرة: {error}',
        notOwner: '❌ فقط مالكو البوت يمكنهم النشر في النشرة!'
    },
    hi: {
        usage: `📰 न्यूज़लेटर पोस्टिंग

🎯 न्यूज़लेटर पर पोस्ट करें:
   .newsletter <मैसेज>
   .postnews <मैसेज>

📝 उदाहरण:
   .newsletter हमारे नए फाइनेंस टिप्स देखें!
   .postnews 💰 मोटिवेशन मंडे: अपने लक्ष्यों पर फोकस रहें!

📸 मीडिया के साथ:
   इमेज/वीडियो पर रिप्लाई करें:
   .newsletter आपका कैप्शन यहां

⚠️ केवल ओनर कमांड`,
        noMessage: '❌ कृपया पोस्ट करने के लिए मैसेज प्रदान करें!\n\nउपयोग: .newsletter <आपका मैसेज>',
        posting: '📤 न्यूज़लेटर पर पोस्ट कर रहे हैं...',
        success: '✅ न्यूज़लेटर पर सफलतापूर्वक पोस्ट किया गया!',
        error: '❌ न्यूज़लेटर पर पोस्ट करने में विफल: {error}',
        notOwner: '❌ केवल बॉट ओनर ही न्यूज़लेटर पर पोस्ट कर सकते हैं!'
    },
    ng: {
        usage: `📰 NEWSLETTER POSTING

🎯 Post for newsletter:
   .newsletter <message>
   .postnews <message>

📝 Examples:
   .newsletter Check our new finance tips!
   .postnews 💰 Motivation Monday: Stay focused for your goals!

📸 With media:
   Reply to image/video with:
   .newsletter Your caption here

⚠️ Na only owner fit use am`,
        noMessage: '❌ Abeg give message wey you wan post!\n\nHow to use am: .newsletter <your message>',
        posting: '📤 We dey post for newsletter...',
        success: '✅ E don post for newsletter successfully!',
        error: '❌ E no work to post for newsletter: {error}',
        notOwner: '❌ Na only bot owners fit post for newsletter!'
    }
};

export default {
    name: 'newsletter',
    aliases: ['postnews', 'newspost'],
    ownerOnly: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;

        try {

            // Show usage if no args
            if (args.length === 0) {
                return await sock.sendMessage(from, { text: t.usage });
            }

            // Get message text
            const messageText = args.join(' ');

            if (!messageText.trim()) {
                return await sock.sendMessage(from, { text: t.noMessage });
            }

            // Send "posting" status
            await sock.sendMessage(from, { text: t.posting });

            // Check if replying to a media message
            const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            
            if (quotedMsg) {
                // Posting with media
                if (quotedMsg.imageMessage) {
                    // Post image to newsletter
                    const imageBuffer = await sock.downloadMediaMessage(msg.message.extendedTextMessage.contextInfo);
                    
                    await sock.sendMessage(NEWSLETTER_ID, {
                        image: imageBuffer,
                        caption: messageText
                    });
                } else if (quotedMsg.videoMessage) {
                    // Post video to newsletter
                    const videoBuffer = await sock.downloadMediaMessage(msg.message.extendedTextMessage.contextInfo);
                    
                    await sock.sendMessage(NEWSLETTER_ID, {
                        video: videoBuffer,
                        caption: messageText
                    });
                } else {
                    // Just text
                    await sock.sendMessage(NEWSLETTER_ID, {
                        text: messageText
                    });
                }
            } else {
                // Post text only to newsletter
                await sock.sendMessage(NEWSLETTER_ID, {
                    text: messageText
                });
            }

            // Confirm success
            await sock.sendMessage(from, { text: t.success });

        } catch (error) {
            console.error('[NEWSLETTER] Error:', error);
            await sock.sendMessage(from, {
                text: t.error.replace('{error}', error.message)
            });
        }
    }
};
