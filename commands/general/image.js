import { getGroupLanguage } from '../../utils/language.js';
import { downloadMediaMessage } from '@whiskeysockets/baileys';
import sharp from 'sharp';
import webpconv from '@caed0/webp-conv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const responses = {
    en: {
        usage: '📷 Image/GIF from Sticker\n\nConvert a sticker back to an image or GIF!\n\nUsage: Reply to a sticker with .image',
        notSticker: '❌ Please reply to a sticker!',
        processing: '⏳ Converting sticker...',
        processingAnimated: '⏳ Converting animated sticker to GIF...',
        error: '❌ Failed to convert sticker.',
        errorDownload: '❌ Failed to download sticker. The sticker might be too old or corrupted.',
        success: '✅ Here\'s your image!',
        successAnimated: '✅ Here\'s your animated GIF!'
    },
    it: {
        usage: '📷 Immagine/GIF da Sticker\n\nConverti uno sticker in un\'immagine o GIF!\n\nUso: Rispondi a uno sticker con .image',
        notSticker: '❌ Per favore rispondi a uno sticker!',
        processing: '⏳ Conversione sticker...',
        processingAnimated: '⏳ Conversione sticker animato in GIF...',
        error: '❌ Impossibile convertire lo sticker.',
        errorDownload: '❌ Impossibile scaricare lo sticker. Lo sticker potrebbe essere troppo vecchio o corrotto.',
        success: '✅ Ecco la tua immagine!',
        successAnimated: '✅ Ecco la tua GIF animata!'
    },
    ru: {
        usage: '📷 Изображение/GIF из стикера\n\nПреобразуйте стикер обратно в изображение или GIF!\n\nИспользование: Ответьте на стикер с .image',
        notSticker: '❌ Пожалуйста, ответьте на стикер!',
        processing: '⏳ Преобразование стикера...',
        processingAnimated: '⏳ Преобразование анимированного стикера в GIF...',
        error: '❌ Не удалось преобразовать стикер.',
        errorDownload: '❌ Не удалось загрузить стикер. Стикер может быть слишком старым или поврежденным.',
        success: '✅ Вот ваше изображение!',
        successAnimated: '✅ Вот ваш анимированный GIF!'
    },
    es: {
        usage: '📷 Imagen/GIF desde Sticker\n\n¡Convierte un sticker de vuelta a una imagen o GIF!\n\nUso: Responde a un sticker con .image',
        notSticker: '❌ ¡Por favor responde a un sticker!',
        processing: '⏳ Convirtiendo sticker...',
        processingAnimated: '⏳ Convirtiendo sticker animado a GIF...',
        error: '❌ Error al convertir sticker.',
        errorDownload: '❌ Error al descargar sticker. El sticker podría ser muy antiguo o estar corrupto.',
        success: '✅ ¡Aquí está tu imagen!',
        successAnimated: '✅ ¡Aquí está tu GIF animado!'
    },
    pt: {
        usage: '📷 Imagem/GIF de Sticker\n\nConverta um sticker de volta para uma imagem ou GIF!\n\nUso: Responda a um sticker com .image',
        notSticker: '❌ Por favor responda a um sticker!',
        processing: '⏳ Convertendo sticker...',
        processingAnimated: '⏳ Convertendo sticker animado para GIF...',
        error: '❌ Falha ao converter sticker.',
        errorDownload: '❌ Falha ao baixar sticker. O sticker pode ser muito antigo ou corrompido.',
        success: '✅ Aqui está sua imagem!',
        successAnimated: '✅ Aqui está seu GIF animado!'
    },
    ar: {
        usage: '📷 صورة/GIF من ملصق\n\nحول ملصق إلى صورة أو GIF!\n\nالاستخدام: رد على ملصق بـ .image',
        notSticker: '❌ من فضلك رد على ملصق!',
        processing: '⏳ تحويل الملصق...',
        processingAnimated: '⏳ تحويل الملصق المتحرك إلى GIF...',
        error: '❌ فشل تحويل الملصق.',
        errorDownload: '❌ فشل تنزيل الملصق. قد يكون الملصق قديم جداً أو تالف.',
        success: '✅ إليك صورتك!',
        successAnimated: '✅ إليك GIF المتحرك!'
    },
    hi: {
        usage: '📷 स्टिकर से इमेज/GIF\n\nस्टिकर को वापस इमेज या GIF में बदलें!\n\nउपयोग: स्टिकर का रिप्लाई करें .image के साथ',
        notSticker: '❌ कृपया स्टिकर का रिप्लाई करें!',
        processing: '⏳ स्टिकर को बदला जा रहा है...',
        processingAnimated: '⏳ एनिमेटेड स्टिकर को GIF में बदला जा रहा है...',
        error: '❌ स्टिकर को बदलने में विफल।',
        errorDownload: '❌ स्टिकर डाउनलोड करने में विफल। स्टिकर बहुत पुराना या करप्ट हो सकता है।',
        success: '✅ यह रही आपकी इमेज!',
        successAnimated: '✅ यह रहा आपका एनिमेटेड GIF!'
    }
};

// Check if WebP is animated
async function isAnimatedWebP(buffer) {
    try {
        const metadata = await sharp(buffer).metadata();
        // Check if it has multiple pages (frames)
        return metadata.pages && metadata.pages > 1;
    } catch (error) {
        console.error('[IMAGE] Error checking animation:', error.message);
        return false;
    }
}

// Convert animated WebP to GIF
async function convertWebPToGif(inputBuffer) {
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    const inputPath = path.join(tempDir, `sticker_${timestamp}_${randomId}.webp`);
    const outputPath = path.join(tempDir, `output_${timestamp}_${randomId}.gif`);
    
    try {
        console.log('[IMAGE] Writing WebP to temp file...');
        fs.writeFileSync(inputPath, inputBuffer);
        
        console.log('[IMAGE] Converting WebP to GIF...');
        const converter = new webpconv({ quality: 90 });
        
        await converter.convertJobs({
            input: inputPath,
            output: outputPath,
            settings: { quality: 90 }
        });
        
        console.log('[IMAGE] Reading GIF output...');
        const gifBuffer = fs.readFileSync(outputPath);
        
        console.log('[IMAGE] Cleaning up temp files...');
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
        
        console.log(`[IMAGE] Conversion successful! GIF size: ${(gifBuffer.length / 1024).toFixed(2)} KB`);
        return gifBuffer;
    } catch (error) {
        console.error('[IMAGE] Conversion error:', error.message);
        // Cleanup on error
        try {
            if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        } catch (cleanupError) {
            console.error('[IMAGE] Cleanup error:', cleanupError.message);
        }
        throw error;
    }
}

export default {
    name: 'image',
    aliases: ['toimage', 'img'],
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        try {
            // Check if replying to a message
            const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            
            if (!quotedMsg) {
                return await sock.sendMessage(from, { 
                    text: t.usage
                });
            }
            
            // Check if the quoted message is a sticker
            if (!quotedMsg.stickerMessage) {
                return await sock.sendMessage(from, { 
                    text: t.notSticker
                });
            }
            
            // Create a message object for the quoted sticker
            const stickerMsg = {
                key: msg.message.extendedTextMessage.contextInfo.participant 
                    ? {
                        remoteJid: from,
                        fromMe: false,
                        id: msg.message.extendedTextMessage.contextInfo.stanzaId,
                        participant: msg.message.extendedTextMessage.contextInfo.participant
                    }
                    : {
                        remoteJid: from,
                        fromMe: false,
                        id: msg.message.extendedTextMessage.contextInfo.stanzaId
                    },
                message: quotedMsg
            };
            
            // Download the sticker
            console.log('[IMAGE] Downloading sticker...');
            
            // Try different download methods for better compatibility
            let buffer;
            try {
                // Method 1: Direct download with quoted message
                buffer = await downloadMediaMessage(
                    stickerMsg,
                    'buffer',
                    {},
                    {
                        logger: console,
                        reuploadRequest: sock.updateMediaMessage
                    }
                );
            } catch (downloadError) {
                console.log('[IMAGE] First download method failed, trying alternative...');
                
                // Method 2: Download using the sticker message directly
                try {
                    const mediaKey = quotedMsg.stickerMessage.mediaKey;
                    const directUrl = quotedMsg.stickerMessage.directPath;
                    
                    if (!mediaKey || !directUrl) {
                        throw new Error('Missing media key or direct path');
                    }
                    
                    // Create a simpler message structure
                    const simpleMsg = {
                        key: {
                            remoteJid: from,
                            id: msg.message.extendedTextMessage.contextInfo.stanzaId
                        },
                        message: {
                            stickerMessage: quotedMsg.stickerMessage
                        }
                    };
                    
                    buffer = await downloadMediaMessage(
                        simpleMsg,
                        'buffer',
                        {},
                        {
                            logger: console,
                            reuploadRequest: sock.updateMediaMessage
                        }
                    );
                } catch (secondError) {
                    console.error('[IMAGE] Second download method also failed:', secondError.message);
                    throw new Error('Failed to download sticker. The sticker might be corrupted or too old.');
                }
            }
            
            if (!buffer || buffer.length === 0) {
                throw new Error('Downloaded sticker is empty');
            }
            
            console.log(`[IMAGE] Sticker downloaded successfully (${(buffer.length / 1024).toFixed(2)} KB)`);
            
            // Check if animated
            const isAnimated = await isAnimatedWebP(buffer);
            
            if (isAnimated) {
                console.log('[IMAGE] Detected animated sticker');
                // Send processing message for animated
                await sock.sendMessage(from, { 
                    text: t.processingAnimated
                });
                
                try {
                    // Convert to GIF
                    const gifBuffer = await convertWebPToGif(buffer);
                    
                    // Send as video with GIF playback for preview in chat
                    console.log('[IMAGE] Sending GIF...');
                    await sock.sendMessage(from, {
                        video: gifBuffer,
                        gifPlayback: true,
                        caption: t.successAnimated
                    });
                    console.log('[IMAGE] Animated GIF sent successfully!');
                } catch (conversionError) {
                    console.error('[IMAGE] GIF conversion failed:', conversionError.message);
                    // Fallback: send as document
                    await sock.sendMessage(from, {
                        document: buffer,
                        mimetype: 'image/webp',
                        fileName: `animated_sticker_${Date.now()}.webp`,
                        caption: t.successAnimated + '\n\n⚠️ (Sent as file - conversion failed)'
                    });
                }
            } else {
                console.log('[IMAGE] Detected static sticker');
                // Send processing message for static
                await sock.sendMessage(from, { 
                    text: t.processing
                });
                
                // Send as static image
                await sock.sendMessage(from, {
                    image: buffer,
                    caption: t.success
                });
                console.log('[IMAGE] Static image sent successfully!');
            }
            
        } catch (error) {
            console.error('[IMAGE] Error:', error.message);
            console.error('[IMAGE] Stack:', error.stack);
            
            // Check if it's a download error
            const isDownloadError = error.message.includes('decrypt') || 
                                   error.message.includes('download') || 
                                   error.message.includes('corrupted') ||
                                   error.message.includes('too old');
            
            const errorMsg = isDownloadError ? t.errorDownload : t.error;
            
            await sock.sendMessage(from, { 
                text: errorMsg
            });
        }
    }
};
