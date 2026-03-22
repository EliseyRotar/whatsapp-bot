import { downloadMediaMessage } from '@whiskeysockets/baileys';
import sharp from 'sharp';
import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        noReply: '❌ Please reply to an image or video to convert it to a sticker.\n\nUsage: Reply to media and type .sticker',
        noMedia: '❌ The message you replied to doesn\'t contain an image or video.\n\nPlease reply to a photo or video.',
        processing: '⏳ Creating sticker...',
        error: '❌ Failed to create sticker.',
        downloadError: 'Reason: Could not download the media file.\nPlease try again or use a different image/video.',
        bufferError: 'Reason: Media file is corrupted or empty.\nPlease try with a different file.',
        timeoutError: 'Reason: Request timed out.\nThe file might be too large. Try a smaller file.',
        formatError: 'Reason: Unsupported image format.\nPlease use JPG, PNG, or WebP images.'
    },
    it: {
        noReply: '❌ Rispondi a un\'immagine o video per convertirlo in sticker.\n\nUso: Rispondi a un media e digita .sticker',
        noMedia: '❌ Il messaggio a cui hai risposto non contiene un\'immagine o video.\n\nRispondi a una foto o video.',
        processing: '⏳ Creazione sticker...',
        error: '❌ Impossibile creare lo sticker.',
        downloadError: 'Motivo: Impossibile scaricare il file media.\nRiprova o usa un\'immagine/video diverso.',
        bufferError: 'Motivo: File media corrotto o vuoto.\nProva con un file diverso.',
        timeoutError: 'Motivo: Timeout della richiesta.\nIl file potrebbe essere troppo grande. Prova con un file più piccolo.',
        formatError: 'Motivo: Formato immagine non supportato.\nUsa immagini JPG, PNG o WebP.'
    },
    ru: {
        noReply: '❌ Пожалуйста, ответьте на изображение или видео, чтобы конвертировать его в стикер.\n\nИспользование: Ответьте на медиа и напишите .sticker',
        noMedia: '❌ Сообщение, на которое вы ответили, не содержит изображение или видео.\n\nПожалуйста, ответьте на фото или видео.',
        processing: '⏳ Создание стикера...',
        error: '❌ Не удалось создать стикер.',
        downloadError: 'Причина: Не удалось загрузить медиафайл.\nПопробуйте снова или используйте другое изображение/видео.',
        bufferError: 'Причина: Медиафайл повреждён или пуст.\nПопробуйте другой файл.',
        timeoutError: 'Причина: Превышено время ожидания.\nФайл может быть слишком большим. Попробуйте файл поменьше.',
        formatError: 'Причина: Неподдерживаемый формат изображения.\nИспользуйте изображения JPG, PNG или WebP.'
    },
    es: {
        noReply: '❌ Por favor responde a una imagen o video para convertirlo en sticker.\n\nUso: Responde a un medio y escribe .sticker',
        noMedia: '❌ El mensaje al que respondiste no contiene una imagen o video.\n\nPor favor responde a una foto o video.',
        processing: '⏳ Creando sticker...',
        error: '❌ Error al crear sticker.',
        downloadError: 'Razón: No se pudo descargar el archivo de medios.\nPor favor intenta de nuevo o usa una imagen/video diferente.',
        bufferError: 'Razón: El archivo de medios está corrupto o vacío.\nPor favor intenta con un archivo diferente.',
        timeoutError: 'Razón: Tiempo de espera agotado.\nEl archivo puede ser demasiado grande. Intenta con un archivo más pequeño.',
        formatError: 'Razón: Formato de imagen no soportado.\nPor favor usa imágenes JPG, PNG o WebP.'
    },
    pt: {
        noReply: '❌ Por favor responda a uma imagem ou vídeo para convertê-lo em sticker.\n\nUso: Responda a uma mídia e digite .sticker',
        noMedia: '❌ A mensagem que você respondeu não contém uma imagem ou vídeo.\n\nPor favor responda a uma foto ou vídeo.',
        processing: '⏳ Criando sticker...',
        error: '❌ Falha ao criar sticker.',
        downloadError: 'Razão: Não foi possível baixar o arquivo de mídia.\nPor favor tente novamente ou use uma imagem/vídeo diferente.',
        bufferError: 'Razão: Arquivo de mídia corrompido ou vazio.\nPor favor tente com um arquivo diferente.',
        timeoutError: 'Razão: Tempo limite esgotado.\nO arquivo pode ser muito grande. Tente com um arquivo menor.',
        formatError: 'Razão: Formato de imagem não suportado.\nPor favor use imagens JPG, PNG ou WebP.'
    },
    ar: {
        noReply: '❌ من فضلك رد على صورة أو فيديو عشان تحوله لملصق.\n\nالاستخدام: رد على وسائط واكتب .sticker',
        noMedia: '❌ الرسالة اللي رديت عليها مافيهاش صورة أو فيديو.\n\nمن فضلك رد على صورة أو فيديو.',
        processing: '⏳ بعمل الملصق...',
        error: '❌ فشل في عمل الملصق.',
        downloadError: 'السبب: مش قادر أنزل ملف الوسائط.\nحاول تاني أو استخدم صورة/فيديو تاني.',
        bufferError: 'السبب: ملف الوسائط تالف أو فاضي.\nجرب ملف تاني.',
        timeoutError: 'السبب: الوقت خلص.\nالملف ممكن يكون كبير. جرب ملف أصغر.',
        formatError: 'السبب: صيغة الصورة مش مدعومة.\nاستخدم صور JPG أو PNG أو WebP.'
    },
    hi: {
        noReply: '❌ कृपया इमेज या वीडियो को स्टिकर में बदलने के लिए उस पर रिप्लाई करें।\n\nउपयोग: मीडिया पर रिप्लाई करें और .sticker टाइप करें',
        noMedia: '❌ जिस मैसेज पर आपने रिप्लाई किया उसमें इमेज या वीडियो नहीं है।\n\nकृपया फोटो या वीडियो पर रिप्लाई करें।',
        processing: '⏳ स्टिकर बनाया जा रहा है...',
        error: '❌ स्टिकर बनाने में विफल।',
        downloadError: 'कारण: मीडिया फाइल डाउनलोड नहीं हो सकी।\nकृपया फिर से कोशिश करें या दूसरी इमेज/वीडियो का उपयोग करें।',
        bufferError: 'कारण: मीडिया फाइल करप्ट या खाली है।\nकृपया दूसरी फाइल के साथ कोशिश करें।',
        timeoutError: 'कारण: रिक्वेस्ट टाइमआउट हो गई।\nफाइल बहुत बड़ी हो सकती है। छोटी फाइल ट्राई करें।',
        formatError: 'कारण: असमर्थित इमेज फॉर्मेट।\nकृपया JPG, PNG, या WebP इमेज का उपयोग करें।'
    },
    ng: {
        noReply: '❌ Abeg reply to image or video make you fit change am to sticker.\n\nHow to use: Reply to media and type .sticker',
        noMedia: '❌ Di message wey you reply no get image or video.\n\nAbeg reply to photo or video.',
        processing: '⏳ Dey make sticker...',
        error: '❌ E no work to make sticker.',
        downloadError: 'Reason: E no fit download di media file.\nAbeg try again or use different image/video.',
        bufferError: 'Reason: Media file don spoil or e empty.\nAbeg try with different file.',
        timeoutError: 'Reason: Request don timeout.\nDi file fit too big. Try smaller file.',
        formatError: 'Reason: Image format no dey supported.\nAbeg use JPG, PNG, or WebP images.'
    }
};

export default {
    name: 'sticker',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        const quotedMsg = msg.message?.extendedTextMessage?.contextInfo;
        
        if (!quotedMsg || !quotedMsg.quotedMessage) {
            return await sock.sendMessage(from, { text: t.noReply })
                .catch(err => console.error('[STICKER] Error sending message:', err.message));
        }

        try {
            const quoted = quotedMsg.quotedMessage;
            
            if (!quoted.imageMessage && !quoted.videoMessage) {
                return await sock.sendMessage(from, { text: t.noMedia })
                    .catch(err => console.error('[STICKER] Error sending message:', err.message));
            }

            console.log('[STICKER] Downloading media...');
            
            await sock.sendMessage(from, { text: t.processing })
                .catch(err => console.error('[STICKER] Error sending processing message:', err.message));
            
            const mediaMsg = {
                key: {
                    remoteJid: from,
                    id: quotedMsg.stanzaId,
                    participant: quotedMsg.participant,
                    fromMe: false
                },
                message: quotedMsg.quotedMessage
            };
            
            const buffer = await downloadMediaMessage(mediaMsg, 'buffer', {});
            
            if (!buffer || buffer.length === 0) {
                throw new Error('Failed to download media - empty buffer received');
            }
            
            console.log('[STICKER] Converting to WebP format...');
            
            const stickerBuffer = await sharp(buffer)
                .resize(512, 512, {
                    fit: 'contain',
                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                })
                .webp()
                .toBuffer();
            
            console.log('[STICKER] Sending sticker...');
            await sock.sendMessage(from, {
                sticker: stickerBuffer
            });
            
            console.log('[STICKER] Sticker sent successfully!');
        } catch (error) {
            console.error('[STICKER] Error:', error.message);
            console.error('[STICKER] Stack:', error.stack);
            
            let errorMsg = `${t.error}\n\n`;
            
            if (error.message.includes('download')) {
                errorMsg += t.downloadError;
            } else if (error.message.includes('buffer')) {
                errorMsg += t.bufferError;
            } else if (error.message.includes('timeout')) {
                errorMsg += t.timeoutError;
            } else if (error.message.includes('Input buffer')) {
                errorMsg += t.formatError;
            } else {
                errorMsg += `${error.message}`;
            }
            
            await sock.sendMessage(from, { text: errorMsg })
                .catch(err => console.error('[STICKER] Error sending error message:', err.message));
        }
    }
};
