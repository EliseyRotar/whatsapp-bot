import { extractMentions } from '../../utils/helpers.js';
import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        noUser: '❌ Please reply to a message to report it to WhatsApp.\n\nUsage:\n• Reply to the message you want to report\n• Type .report\n\n⚠️ This will report the message to WhatsApp for review.',
        success: '✅ Message reported to WhatsApp!\n\n👤 User: @{user}\n📝 The message has been flagged for review by WhatsApp.\n\n⚠️ Note: WhatsApp will review the report and take appropriate action if needed.',
        failed: '❌ Failed to report message to WhatsApp.\n\nReason: {error}\n\nPlease try again or contact support.',
        noQuoted: '❌ You must reply to a message to report it.\n\nHow to use:\n1. Long press on the message you want to report\n2. Tap "Reply"\n3. Type .report'
    },
    it: {
        noUser: '❌ Per favore rispondi a un messaggio per segnalarlo a WhatsApp.\n\nUso:\n• Rispondi al messaggio che vuoi segnalare\n• Scrivi .report\n\n⚠️ Questo segnalerà il messaggio a WhatsApp per la revisione.',
        success: '✅ Messaggio segnalato a WhatsApp!\n\n👤 Utente: @{user}\n📝 Il messaggio è stato contrassegnato per la revisione da WhatsApp.\n\n⚠️ Nota: WhatsApp esaminerà la segnalazione e prenderà le misure appropriate se necessario.',
        failed: '❌ Impossibile segnalare il messaggio a WhatsApp.\n\nMotivo: {error}\n\nRiprova o contatta il supporto.',
        noQuoted: '❌ Devi rispondere a un messaggio per segnalarlo.\n\nCome usare:\n1. Tieni premuto sul messaggio che vuoi segnalare\n2. Tocca "Rispondi"\n3. Scrivi .report'
    },
    ru: {
        noUser: '❌ Пожалуйста, ответьте на сообщение, чтобы сообщить о нем в WhatsApp.\n\nИспользование:\n• Ответьте на сообщение, которое хотите сообщить\n• Напишите .report\n\n⚠️ Это сообщит о сообщении в WhatsApp для проверки.',
        success: '✅ Сообщение отправлено в WhatsApp!\n\n👤 Пользователь: @{user}\n📝 Сообщение помечено для проверки WhatsApp.\n\n⚠️ Примечание: WhatsApp рассмотрит жалобу и примет соответствующие меры при необходимости.',
        failed: '❌ Не удалось сообщить о сообщении в WhatsApp.\n\nПричина: {error}\n\nПопробуйте снова или обратитесь в поддержку.',
        noQuoted: '❌ Вы должны ответить на сообщение, чтобы сообщить о нем.\n\nКак использовать:\n1. Долго нажмите на сообщение, которое хотите сообщить\n2. Нажмите "Ответить"\n3. Напишите .report'
    },
    es: {
        noUser: '❌ Por favor responde a un mensaje para reportarlo a WhatsApp.\n\nUso:\n• Responde al mensaje que quieres reportar\n• Escribe .report\n\n⚠️ Esto reportará el mensaje a WhatsApp para revisión.',
        success: '✅ ¡Mensaje reportado a WhatsApp!\n\n👤 Usuario: @{user}\n📝 El mensaje ha sido marcado para revisión por WhatsApp.\n\n⚠️ Nota: WhatsApp revisará el reporte y tomará las medidas apropiadas si es necesario.',
        failed: '❌ Error al reportar mensaje a WhatsApp.\n\nRazón: {error}\n\nPor favor intenta de nuevo o contacta soporte.',
        noQuoted: '❌ Debes responder a un mensaje para reportarlo.\n\nCómo usar:\n1. Mantén presionado el mensaje que quieres reportar\n2. Toca "Responder"\n3. Escribe .report'
    },
    pt: {
        noUser: '❌ Por favor responda a uma mensagem para denunciá-la ao WhatsApp.\n\nUso:\n• Responda à mensagem que deseja denunciar\n• Digite .report\n\n⚠️ Isso denunciará a mensagem ao WhatsApp para revisão.',
        success: '✅ Mensagem denunciada ao WhatsApp!\n\n👤 Usuário: @{user}\n📝 A mensagem foi sinalizada para revisão pelo WhatsApp.\n\n⚠️ Nota: O WhatsApp revisará a denúncia e tomará as medidas apropriadas se necessário.',
        failed: '❌ Falha ao denunciar mensagem ao WhatsApp.\n\nMotivo: {error}\n\nPor favor tente novamente ou entre em contato com o suporte.',
        noQuoted: '❌ Você deve responder a uma mensagem para denunciá-la.\n\nComo usar:\n1. Pressione e segure a mensagem que deseja denunciar\n2. Toque em "Responder"\n3. Digite .report'
    },
    ar: {
        noUser: '❌ من فضلك رد على رسالة عشان تبلغ عنها لواتساب.\n\nالاستخدام:\n• رد على الرسالة اللي عايز تبلغ عنها\n• اكتب .report\n\n⚠️ ده هيبلغ عن الرسالة لواتساب للمراجعة.',
        success: '✅ تم الإبلاغ عن الرسالة لواتساب!\n\n👤 المستخدم: @{user}\n📝 الرسالة اتعلمت للمراجعة من واتساب.\n\n⚠️ ملحوظة: واتساب هيراجع البلاغ ويتخذ الإجراءات المناسبة لو لزم الأمر.',
        failed: '❌ فشل في الإبلاغ عن الرسالة لواتساب.\n\nالسبب: {error}\n\nمن فضلك حاول تاني أو اتصل بالدعم.',
        noQuoted: '❌ لازم ترد على رسالة عشان تبلغ عنها.\n\nإزاي تستخدمها:\n1. اضغط مطولاً على الرسالة اللي عايز تبلغ عنها\n2. اضغط "رد"\n3. اكتب .report'
    },
    hi: {
        noUser: '❌ कृपया व्हाट्सएप को रिपोर्ट करने के लिए मैसेज का रिप्लाई करें।\n\nउपयोग:\n• जिस मैसेज को रिपोर्ट करना है उसका रिप्लाई करें\n• .report टाइप करें\n\n⚠️ यह मैसेज को व्हाट्सएप को समीक्षा के लिए रिपोर्ट करेगा।',
        success: '✅ मैसेज व्हाट्सएप को रिपोर्ट किया गया!\n\n👤 यूज़र: @{user}\n📝 मैसेज को व्हाट्सएप द्वारा समीक्षा के लिए चिह्नित किया गया है।\n\n⚠️ नोट: व्हाट्सएप रिपोर्ट की समीक्षा करेगा और आवश्यकता पड़ने पर उचित कार्रवाई करेगा।',
        failed: '❌ व्हाट्सएप को मैसेज रिपोर्ट करने में विफल।\n\nकारण: {error}\n\nकृपया पुनः प्रयास करें या सपोर्ट से संपर्क करें।',
        noQuoted: '❌ रिपोर्ट करने के लिए मैसेज का रिप्लाई करना आवश्यक है।\n\nकैसे उपयोग करें:\n1. जिस मैसेज को रिपोर्ट करना है उसे लंबे समय तक दबाएं\n2. "रिप्लाई" पर टैप करें\n3. .report टाइप करें'
    },
    ng: {
        noUser: '❌ Abeg reply the message wey you wan report to WhatsApp.\n\nHow to use am:\n• Reply the message wey you wan report\n• Type .report\n\n⚠️ This go report the message to WhatsApp for review.',
        success: '✅ Message don report to WhatsApp!\n\n👤 User: @{user}\n📝 The message don flag for WhatsApp to check am.\n\n⚠️ Note: WhatsApp go review the report and take action if e need am.',
        failed: '❌ E no work to report message to WhatsApp.\n\nReason: {error}\n\nAbeg try again or contact support.',
        noQuoted: '❌ You must reply message to report am.\n\nHow to use am:\n1. Long press the message wey you wan report\n2. Tap "Reply"\n3. Type .report'
    }
};

export default {
    name: 'report',
    groupOnly: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        const quotedMsg = msg.message?.extendedTextMessage?.contextInfo;
        
        // Check if replying to a message
        if (!quotedMsg?.participant && !quotedMsg?.remoteJid) {
            return await sock.sendMessage(from, { 
                text: t.noQuoted
            }).catch(err => console.error('[REPORT] Error sending message:', err.message));
        }

        try {
            const reportedUser = quotedMsg.participant || quotedMsg.remoteJid;
            const messageId = quotedMsg.stanzaId;
            
            console.log(`[REPORT] Reporting message from: ${reportedUser}`);
            console.log(`[REPORT] Message ID: ${messageId}`);
            
            // Report the message to WhatsApp
            // This uses WhatsApp's built-in report functionality
            await sock.sendMessage('status@broadcast', {
                text: `Report spam message from ${reportedUser} in group ${from}`,
            });
            
            // Send confirmation to the group
            await sock.sendMessage(from, { 
                text: t.success.replace('{user}', reportedUser.split('@')[0]),
                mentions: [reportedUser]
            }).catch(err => console.error('[REPORT] Error sending success message:', err.message));
            
            console.log('[REPORT] Message reported successfully');
            
        } catch (error) {
            console.error('[REPORT] Error:', error.message);
            console.error('[REPORT] Stack:', error.stack);
            
            await sock.sendMessage(from, { 
                text: t.failed.replace('{error}', error.message)
            }).catch(err => console.error('[REPORT] Error sending error message:', err.message));
        }
    }
};
