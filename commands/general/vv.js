import { downloadMediaMessage } from '@whiskeysockets/baileys';
import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        noReply: '❌ Please reply to a view-once message to reveal it.\n\nUsage: Reply to view-once and type .vv',
        notViewOnce: '❌ This is not a view-once message.\n\nMessage type:',
        alreadyOpened: '⚠️ This view-once message was already opened.\n\nOnce a view-once message is opened by anyone (including you on your phone), WhatsApp removes the view-once wrapper and it cannot be recovered.\n\n💡 Tip: Use .autovv on to automatically save view-once messages before they\'re opened.',
        noContent: '❌ Could not extract view-once content.',
        downloadingImage: '⏳ Downloading view-once image...',
        downloadingVideo: '⏳ Downloading view-once video...',
        imageRevealed: '👁️ View-once image revealed!',
        videoRevealed: '👁️ View-once video revealed!',
        unsupportedType: '❌ Unsupported view-once message type:',
        failed: '❌ Failed to reveal view-once message.\n\n',
        reasonExpired: 'Reason: Media keys are missing.\nThis can happen if:\n• The message has expired (>14 days)\n• Session is corrupted (try ./fix-session.sh)\n• Message was already opened',
        reason404: 'Reason: Media file not found on WhatsApp servers.\nThe view-once message may have expired.',
        reasonGeneric: 'Reason:',
        tryFix: '\n\nIf this persists, try:\n1. ./fix-session.sh\n2. Use .autovv on for future messages'
    },
    it: {
        noReply: '❌ Rispondi a un messaggio visualizza una volta per rivelarlo.\n\nUso: Rispondi a visualizza una volta e scrivi .vv',
        notViewOnce: '❌ Questo non è un messaggio visualizza una volta.\n\nTipo messaggio:',
        alreadyOpened: '⚠️ Questo messaggio visualizza una volta è già stato aperto.\n\nUna volta che un messaggio visualizza una volta viene aperto da chiunque (incluso te sul tuo telefono), WhatsApp rimuove il wrapper visualizza una volta e non può essere recuperato.\n\n💡 Suggerimento: Usa .autovv on per salvare automaticamente i messaggi visualizza una volta prima che vengano aperti.',
        noContent: '❌ Impossibile estrarre contenuto visualizza una volta.',
        downloadingImage: '⏳ Scaricamento immagine visualizza una volta...',
        downloadingVideo: '⏳ Scaricamento video visualizza una volta...',
        imageRevealed: '👁️ Immagine visualizza una volta rivelata!',
        videoRevealed: '👁️ Video visualizza una volta rivelato!',
        unsupportedType: '❌ Tipo messaggio visualizza una volta non supportato:',
        failed: '❌ Impossibile rivelare messaggio visualizza una volta.\n\n',
        reasonExpired: 'Motivo: Chiavi media mancanti.\nQuesto può accadere se:\n• Il messaggio è scaduto (>14 giorni)\n• Sessione corrotta (prova ./fix-session.sh)\n• Messaggio già aperto',
        reason404: 'Motivo: File media non trovato sui server WhatsApp.\nIl messaggio visualizza una volta potrebbe essere scaduto.',
        reasonGeneric: 'Motivo:',
        tryFix: '\n\nSe persiste, prova:\n1. ./fix-session.sh\n2. Usa .autovv on per messaggi futuri'
    },
    ru: {
        noReply: '❌ Пожалуйста, ответьте на одноразовое сообщение, чтобы показать его.\n\nИспользование: Ответьте на одноразовое и напишите .vv',
        notViewOnce: '❌ Это не одноразовое сообщение.\n\nТип сообщения:',
        alreadyOpened: '⚠️ Это одноразовое сообщение уже было открыто.\n\nКак только одноразовое сообщение открывается кем-либо (включая вас на телефоне), WhatsApp удаляет одноразовую обёртку и его невозможно восстановить.\n\n💡 Совет: Используйте .autovv on для автоматического сохранения одноразовых сообщений до их открытия.',
        noContent: '❌ Не удалось извлечь содержимое одноразового сообщения.',
        downloadingImage: '⏳ Загрузка одноразового изображения...',
        downloadingVideo: '⏳ Загрузка одноразового видео...',
        imageRevealed: '👁️ Одноразовое изображение показано!',
        videoRevealed: '👁️ Одноразовое видео показано!',
        unsupportedType: '❌ Неподдерживаемый тип одноразового сообщения:',
        failed: '❌ Не удалось показать одноразовое сообщение.\n\n',
        reasonExpired: 'Причина: Отсутствуют ключи медиа.\nЭто может произойти если:\n• Сообщение истекло (>14 дней)\n• Сессия повреждена (попробуйте ./fix-session.sh)\n• Сообщение уже было открыто',
        reason404: 'Причина: Медиафайл не найден на серверах WhatsApp.\nОдноразовое сообщение могло истечь.',
        reasonGeneric: 'Причина:',
        tryFix: '\n\nЕсли проблема сохраняется, попробуйте:\n1. ./fix-session.sh\n2. Используйте .autovv on для будущих сообщений'
    },
    es: {
        noReply: '❌ Por favor responde a un mensaje de ver una vez para revelarlo.\n\nUso: Responde a ver una vez y escribe .vv',
        notViewOnce: '❌ Este no es un mensaje de ver una vez.\n\nTipo de mensaje:',
        alreadyOpened: '⚠️ Este mensaje de ver una vez ya fue abierto.\n\nUna vez que un mensaje de ver una vez es abierto por cualquiera (incluyéndote en tu teléfono), WhatsApp elimina el envoltorio de ver una vez y no puede ser recuperado.\n\n💡 Consejo: Usa .autovv on para guardar automáticamente mensajes de ver una vez antes de que sean abiertos.',
        noContent: '❌ No se pudo extraer el contenido de ver una vez.',
        downloadingImage: '⏳ Descargando imagen de ver una vez...',
        downloadingVideo: '⏳ Descargando video de ver una vez...',
        imageRevealed: '👁️ ¡Imagen de ver una vez revelada!',
        videoRevealed: '👁️ ¡Video de ver una vez revelado!',
        unsupportedType: '❌ Tipo de mensaje de ver una vez no soportado:',
        failed: '❌ Error al revelar mensaje de ver una vez.\n\n',
        reasonExpired: 'Razón: Faltan claves de medios.\nEsto puede suceder si:\n• El mensaje ha expirado (>14 días)\n• La sesión está corrupta (intenta ./fix-session.sh)\n• El mensaje ya fue abierto',
        reason404: 'Razón: Archivo de medios no encontrado en los servidores de WhatsApp.\nEl mensaje de ver una vez puede haber expirado.',
        reasonGeneric: 'Razón:',
        tryFix: '\n\nSi esto persiste, intenta:\n1. ./fix-session.sh\n2. Usa .autovv on para mensajes futuros'
    },
    pt: {
        noReply: '❌ Por favor responda a uma mensagem de ver uma vez para revelá-la.\n\nUso: Responda a ver uma vez e digite .vv',
        notViewOnce: '❌ Esta não é uma mensagem de ver uma vez.\n\nTipo de mensagem:',
        alreadyOpened: '⚠️ Esta mensagem de ver uma vez já foi aberta.\n\nUma vez que uma mensagem de ver uma vez é aberta por qualquer pessoa (incluindo você no seu telefone), o WhatsApp remove o invólucro de ver uma vez e não pode ser recuperado.\n\n💡 Dica: Use .autovv on para salvar automaticamente mensagens de ver uma vez antes de serem abertas.',
        noContent: '❌ Não foi possível extrair o conteúdo de ver uma vez.',
        downloadingImage: '⏳ Baixando imagem de ver uma vez...',
        downloadingVideo: '⏳ Baixando vídeo de ver uma vez...',
        imageRevealed: '👁️ Imagem de ver uma vez revelada!',
        videoRevealed: '👁️ Vídeo de ver uma vez revelado!',
        unsupportedType: '❌ Tipo de mensagem de ver uma vez não suportado:',
        failed: '❌ Falha ao revelar mensagem de ver uma vez.\n\n',
        reasonExpired: 'Razão: Chaves de mídia ausentes.\nIsso pode acontecer se:\n• A mensagem expirou (>14 dias)\n• A sessão está corrompida (tente ./fix-session.sh)\n• A mensagem já foi aberta',
        reason404: 'Razão: Arquivo de mídia não encontrado nos servidores do WhatsApp.\nA mensagem de ver uma vez pode ter expirado.',
        reasonGeneric: 'Razão:',
        tryFix: '\n\nSe isso persistir, tente:\n1. ./fix-session.sh\n2. Use .autovv on para mensagens futuras'
    },
    ar: {
        noReply: '❌ من فضلك رد على رسالة عرض مرة واحدة عشان تكشفها.\n\nالاستخدام: رد على عرض مرة واحدة واكتب .vv',
        notViewOnce: '❌ دي مش رسالة عرض مرة واحدة.\n\nنوع الرسالة:',
        alreadyOpened: '⚠️ رسالة العرض مرة واحدة دي اتفتحت فعلاً.\n\nلما رسالة عرض مرة واحدة تتفتح من أي حد (بما فيهم إنت على تليفونك)، واتساب بيشيل غلاف العرض مرة واحدة ومش ممكن استرجاعه.\n\n💡 نصيحة: استخدم .autovv on عشان تحفظ رسائل العرض مرة واحدة تلقائياً قبل ما تتفتح.',
        noContent: '❌ مش قادر أستخرج محتوى العرض مرة واحدة.',
        downloadingImage: '⏳ تنزيل صورة العرض مرة واحدة...',
        downloadingVideo: '⏳ تنزيل فيديو العرض مرة واحدة...',
        imageRevealed: '👁️ صورة العرض مرة واحدة اتكشفت!',
        videoRevealed: '👁️ فيديو العرض مرة واحدة اتكشف!',
        unsupportedType: '❌ نوع رسالة العرض مرة واحدة مش مدعوم:',
        failed: '❌ فشل في كشف رسالة العرض مرة واحدة.\n\n',
        reasonExpired: 'السبب: مفاتيح الوسائط مفقودة.\nده ممكن يحصل لو:\n• الرسالة منتهية (>14 يوم)\n• الجلسة تالفة (جرب ./fix-session.sh)\n• الرسالة اتفتحت فعلاً',
        reason404: 'السبب: ملف الوسائط مش موجود على سيرفرات واتساب.\nرسالة العرض مرة واحدة ممكن تكون منتهية.',
        reasonGeneric: 'السبب:',
        tryFix: '\n\nلو ده استمر، جرب:\n1. ./fix-session.sh\n2. استخدم .autovv on للرسائل المستقبلية'
    },
    hi: {
        noReply: '❌ कृपया व्यू-वन्स मैसेज को रिवील करने के लिए उस पर रिप्लाई करें।\n\nउपयोग: व्यू-वन्स पर रिप्लाई करें और .vv टाइप करें',
        notViewOnce: '❌ यह व्यू-वन्स मैसेज नहीं है।\n\nमैसेज टाइप:',
        alreadyOpened: '⚠️ यह व्यू-वन्स मैसेज पहले ही खोला जा चुका है।\n\nजब कोई भी व्यू-वन्स मैसेज खोलता है (आप अपने फोन पर भी), WhatsApp व्यू-वन्स रैपर हटा देता है और इसे रिकवर नहीं किया जा सकता।\n\n💡 टिप: भविष्य के मैसेज के लिए .autovv on का उपयोग करें ताकि व्यू-वन्स मैसेज खोलने से पहले ऑटोमैटिक सेव हो जाएं।',
        noContent: '❌ व्यू-वन्स कंटेंट निकाल नहीं सका।',
        downloadingImage: '⏳ व्यू-वन्स इमेज डाउनलोड हो रही है...',
        downloadingVideo: '⏳ व्यू-वन्स वीडियो डाउनलोड हो रहा है...',
        imageRevealed: '👁️ व्यू-वन्स इमेज रिवील हो गई!',
        videoRevealed: '👁️ व्यू-वन्स वीडियो रिवील हो गया!',
        unsupportedType: '❌ असमर्थित व्यू-वन्स मैसेज टाइप:',
        failed: '❌ व्यू-वन्स मैसेज रिवील करने में विफल।\n\n',
        reasonExpired: 'कारण: मीडिया की चाबियां गायब हैं।\nयह हो सकता है अगर:\n• मैसेज एक्सपायर हो गया (>14 दिन)\n• सेशन करप्ट है (./fix-session.sh ट्राई करें)\n• मैसेज पहले ही खोला जा चुका है',
        reason404: 'कारण: WhatsApp सर्वर पर मीडिया फाइल नहीं मिली।\nव्यू-वन्स मैसेज एक्सपायर हो सकता है।',
        reasonGeneric: 'कारण:',
        tryFix: '\n\nअगर यह जारी रहता है, तो ट्राई करें:\n1. ./fix-session.sh\n2. भविष्य के मैसेज के लिए .autovv on का उपयोग करें'
    },
    ng: {
        noReply: '❌ Abeg reply to view-once message make you fit reveal am.\n\nHow to use: Reply to view-once and type .vv',
        notViewOnce: '❌ Dis one no be view-once message.\n\nMessage type:',
        alreadyOpened: '⚠️ Dis view-once message don open finish.\n\nOnce anybody open view-once message (including you for your phone), WhatsApp go comot di view-once wrapper and e no fit recover am again.\n\n💡 Tip: Use .autovv on make e fit save view-once messages automatic before dem open am.',
        noContent: '❌ E no fit extract view-once content.',
        downloadingImage: '⏳ Dey download view-once image...',
        downloadingVideo: '⏳ Dey download view-once video...',
        imageRevealed: '👁️ View-once image don reveal!',
        videoRevealed: '👁️ View-once video don reveal!',
        unsupportedType: '❌ View-once message type wey no dey supported:',
        failed: '❌ E no work to reveal view-once message.\n\n',
        reasonExpired: 'Reason: Media keys don miss.\nDis fit happen if:\n• Di message don expire (>14 days)\n• Session don spoil (try ./fix-session.sh)\n• Message don open finish',
        reason404: 'Reason: Media file no dey for WhatsApp servers.\nDi view-once message fit don expire.',
        reasonGeneric: 'Reason:',
        tryFix: '\n\nIf e still dey do like dis, try:\n1. ./fix-session.sh\n2. Use .autovv on for future messages'
    }
};

export default {
    name: 'vv',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        const quotedMsg = msg.message?.extendedTextMessage?.contextInfo;
        
        if (!quotedMsg || !quotedMsg.quotedMessage) {
            return await sock.sendMessage(from, { 
                text: t.noReply
            }).catch(err => console.error('[VV] Error:', err.message));
        }

        try {
            console.log('[VV] Quoted message type:', Object.keys(quotedMsg.quotedMessage));
            
            // Check for view once message (v1 and v2)
            let viewOnceMessage = quotedMsg.quotedMessage.viewOnceMessage || 
                                 quotedMsg.quotedMessage.viewOnceMessageV2 ||
                                 quotedMsg.quotedMessage.viewOnceMessageV2Extension;
            
            let message = null;
            
            if (viewOnceMessage) {
                console.log('[VV] View-once wrapper found');
                message = viewOnceMessage.message;
            } else {
                // Check if it's an already-opened view-once message
                // When opened, the viewOnce wrapper is removed but the media remains
                const quotedMessage = quotedMsg.quotedMessage;
                
                // Check for viewOnce property in imageMessage or videoMessage
                if (quotedMessage.imageMessage?.viewOnce || quotedMessage.videoMessage?.viewOnce) {
                    console.log('[VV] Already-opened view-once message detected via viewOnce property');
                    message = quotedMessage;
                } else if (quotedMessage.imageMessage || quotedMessage.videoMessage) {
                    // It's a regular image/video, but check if it might be an opened view-once
                    // Unfortunately, once opened, WhatsApp removes all view-once indicators
                    console.log('[VV] Regular media message - might be already-opened view-once');
                    return await sock.sendMessage(from, { 
                        text: t.alreadyOpened
                    }).catch(err => console.error('[VV] Error:', err.message));
                } else {
                    // Log full message structure for debugging
                    console.log('[VV] Full quoted message structure:', JSON.stringify(quotedMsg.quotedMessage, null, 2));
                    return await sock.sendMessage(from, { 
                        text: t.notViewOnce + ' ' + Object.keys(quotedMsg.quotedMessage).join(', ')
                    }).catch(err => console.error('[VV] Error:', err.message));
                }
            }

            // Extract the actual message
            
            if (!message) {
                return await sock.sendMessage(from, { 
                    text: t.noContent
                }).catch(err => console.error('[VV] Error:', err.message));
            }

            console.log('[VV] Message content type:', Object.keys(message));
            
            // Use the message directly (already unwrapped if it was opened)
            const regularMessage = message;
            
            if (regularMessage.imageMessage) {
                console.log('[VV] Downloading image...');
                
                await sock.sendMessage(from, { 
                    text: t.downloadingImage
                }).catch(err => console.error('[VV] Error:', err.message));
                
                // Create a proper message object for download with the unwrapped message
                const mediaMsg = {
                    key: {
                        remoteJid: from,
                        id: quotedMsg.stanzaId,
                        participant: quotedMsg.participant
                    },
                    message: regularMessage // Use the unwrapped message
                };
                
                const buffer = await downloadMediaMessage(mediaMsg, 'buffer', {});
                
                console.log('[VV] Sending image...');
                await sock.sendMessage(from, {
                    image: buffer,
                    caption: regularMessage.imageMessage.caption || t.imageRevealed
                });
                
                console.log('[VV] Image sent successfully');
                
            } else if (regularMessage.videoMessage) {
                console.log('[VV] Downloading video...');
                
                await sock.sendMessage(from, { 
                    text: t.downloadingVideo
                }).catch(err => console.error('[VV] Error:', err.message));
                
                const mediaMsg = {
                    key: {
                        remoteJid: from,
                        id: quotedMsg.stanzaId,
                        participant: quotedMsg.participant
                    },
                    message: regularMessage // Use the unwrapped message
                };
                
                const buffer = await downloadMediaMessage(mediaMsg, 'buffer', {});
                
                console.log('[VV] Sending video...');
                await sock.sendMessage(from, {
                    video: buffer,
                    caption: regularMessage.videoMessage.caption || t.videoRevealed
                });
                
                console.log('[VV] Video sent successfully');
                
            } else {
                await sock.sendMessage(from, { 
                    text: t.unsupportedType + ' ' + Object.keys(regularMessage).join(', ')
                }).catch(err => console.error('[VV] Error:', err.message));
            }
        } catch (error) {
            console.error('[VV] Error revealing view-once:', error);
            console.error('[VV] Stack:', error.stack);
            
            let errorMsg = t.failed;
            
            if (error.message.includes('empty media key')) {
                errorMsg += t.reasonExpired;
            } else if (error.message.includes('404')) {
                errorMsg += t.reason404;
            } else {
                errorMsg += `${t.reasonGeneric} ${error.message}${t.tryFix}`;
            }
            
            await sock.sendMessage(from, { 
                text: errorMsg 
            }).catch(err => console.error('[VV] Error sending error message:', err.message));
        }
    }
};
