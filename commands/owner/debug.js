import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        noReply: '❌ Reply to a message to debug it.',
        title: '🔍 DEBUG INFO:\n\n',
        messageTypes: 'Message Types:',
        viewOnceDetected: '✅ View-Once Detected!',
        viewOnceType: 'View-Once Type:',
        innerMessage: 'Inner Message:',
        notViewOnce: '❌ Not a view-once message',
        stanzaId: '\nStanza ID:',
        participant: 'Participant:',
        fullStructure: '\nFull Structure:\n',
        failed: '❌ Debug error:'
    },
    it: {
        noReply: '❌ Rispondi a un messaggio per debuggarlo.',
        title: '🔍 INFO DEBUG:\n\n',
        messageTypes: 'Tipi Messaggio:',
        viewOnceDetected: '✅ Visualizza Una Volta Rilevato!',
        viewOnceType: 'Tipo Visualizza Una Volta:',
        innerMessage: 'Messaggio Interno:',
        notViewOnce: '❌ Non è un messaggio visualizza una volta',
        stanzaId: '\nStanza ID:',
        participant: 'Partecipante:',
        fullStructure: '\nStruttura Completa:\n',
        failed: '❌ Errore debug:'
    },
    ru: {
        noReply: '❌ Ответьте на сообщение, чтобы отладить его.',
        title: '🔍 ОТЛАДОЧНАЯ ИНФОРМАЦИЯ:\n\n',
        messageTypes: 'Типы сообщений:',
        viewOnceDetected: '✅ Обнаружено одноразовое сообщение!',
        viewOnceType: 'Тип одноразового:',
        innerMessage: 'Внутреннее сообщение:',
        notViewOnce: '❌ Это не одноразовое сообщение',
        stanzaId: '\nStanza ID:',
        participant: 'Участник:',
        fullStructure: '\nПолная структура:\n',
        failed: '❌ Ошибка отладки:'
    },
    es: {
        noReply: '❌ Responde a un mensaje para depurarlo.',
        title: '🔍 INFO DE DEPURACIÓN:\n\n',
        messageTypes: 'Tipos de Mensaje:',
        viewOnceDetected: '✅ ¡Ver Una Vez Detectado!',
        viewOnceType: 'Tipo Ver Una Vez:',
        innerMessage: 'Mensaje Interno:',
        notViewOnce: '❌ No es un mensaje de ver una vez',
        stanzaId: '\nStanza ID:',
        participant: 'Participante:',
        fullStructure: '\nEstructura Completa:\n',
        failed: '❌ Error de depuración:'
    },
    pt: {
        noReply: '❌ Responda a uma mensagem para depurá-la.',
        title: '🔍 INFO DE DEPURAÇÃO:\n\n',
        messageTypes: 'Tipos de Mensagem:',
        viewOnceDetected: '✅ Ver Uma Vez Detectado!',
        viewOnceType: 'Tipo Ver Uma Vez:',
        innerMessage: 'Mensagem Interna:',
        notViewOnce: '❌ Não é uma mensagem de ver uma vez',
        stanzaId: '\nStanza ID:',
        participant: 'Participante:',
        fullStructure: '\nEstrutura Completa:\n',
        failed: '❌ Erro de depuração:'
    },
    ar: {
        noReply: '❌ رد على رسالة عشان تعمل debug.',
        title: '🔍 معلومات DEBUG:\n\n',
        messageTypes: 'أنواع الرسائل:',
        viewOnceDetected: '✅ رسالة مرة واحدة اتكشفت!',
        viewOnceType: 'نوع المرة الواحدة:',
        innerMessage: 'الرسالة الداخلية:',
        notViewOnce: '❌ مش رسالة مرة واحدة',
        stanzaId: '\nStanza ID:',
        participant: 'المشارك:',
        fullStructure: '\nالهيكل الكامل:\n',
        failed: '❌ خطأ debug:'
    },
    hi: {
        noReply: '❌ डीबग करने के लिए किसी मैसेज पर रिप्लाई करें।',
        title: '🔍 डीबग जानकारी:\n\n',
        messageTypes: 'मैसेज टाइप:',
        viewOnceDetected: '✅ व्यू-वन्स डिटेक्ट हुआ!',
        viewOnceType: 'व्यू-वन्स टाइप:',
        innerMessage: 'इनर मैसेज:',
        notViewOnce: '❌ यह व्यू-वन्स मैसेज नहीं है',
        stanzaId: '\nStanza ID:',
        participant: 'पार्टिसिपेंट:',
        fullStructure: '\nपूरी स्ट्रक्चर:\n',
        failed: '❌ डीबग एरर:'
    }
};

export default {
    name: 'debug',
    ownerOnly: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        const contextInfo = msg.message?.extendedTextMessage?.contextInfo;
        
        if (!contextInfo || !contextInfo.quotedMessage) {
            return await sock.sendMessage(from, { 
                text: t.noReply
            });
        }

        try {
            const quotedMsg = contextInfo.quotedMessage;
            
            let debugInfo = t.title;
            debugInfo += `${t.messageTypes} ${Object.keys(quotedMsg).join(', ')}\n\n`;
            
            // Check for view-once
            const viewOnce = quotedMsg.viewOnceMessage || 
                           quotedMsg.viewOnceMessageV2 ||
                           quotedMsg.viewOnceMessageV2Extension;
            
            if (viewOnce) {
                debugInfo += `${t.viewOnceDetected}\n`;
                debugInfo += `${t.viewOnceType} ${quotedMsg.viewOnceMessage ? 'v1' : quotedMsg.viewOnceMessageV2 ? 'v2' : 'v2ext'}\n`;
                
                if (viewOnce.message) {
                    debugInfo += `${t.innerMessage} ${Object.keys(viewOnce.message).join(', ')}\n`;
                }
            } else {
                debugInfo += `${t.notViewOnce}\n`;
            }
            
            debugInfo += `${t.stanzaId} ${contextInfo.stanzaId}\n`;
            debugInfo += `${t.participant} ${contextInfo.participant || 'none'}\n`;
            
            // Show full structure (limited)
            debugInfo += `${t.fullStructure}${JSON.stringify(quotedMsg, null, 2).substring(0, 500)}...`;
            
            await sock.sendMessage(from, { text: debugInfo });
            
        } catch (error) {
            await sock.sendMessage(from, { 
                text: `${t.failed} ${error.message}`
            });
        }
    }
};
