import makeWASocket, { DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion, downloadMediaMessage } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import qrcode from 'qrcode-terminal';
import NodeCache from 'node-cache';
import { handleMessage } from './handlers/messageHandler.js';
import { setupCallHandler } from './handlers/callHandler.js';
import { loadGroupSettings } from './utils/database.js';
import { getGroupLanguage } from './utils/language.js';
import { isAntideleteEnabled } from './utils/antideleteConfig.js';
import { startNewsletterScheduler } from './utils/newsletterScheduler.js';
import { startGameCleanup } from './utils/game/gameCleanup.js';
import { config } from './config.js';
import os from 'os';
import * as logger from './utils/logger.js';

// Import web monitoring
import { 
    updateBotStatus, 
    logMessage, 
    logCommand, 
    updateGroup, 
    updateUser, 
    logError,
    updateSystemMetrics,
    setBotInstance,
    setQRCode,
    startWebServer
} from './web/server.js';

const msgRetryCounterCache = new NodeCache();

// Create simple message store to keep messages in memory
const messageStore = {
    messages: {} // { chatId: [messages] }
};

// Update system metrics every 5 seconds
setInterval(() => {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    
    updateSystemMetrics({
        memory: Math.round(usedMem / 1024 / 1024),
        cpu: Math.round(os.loadavg()[0] * 100),
        uptime: Math.round(process.uptime())
    });
}, 5000);

async function connectToWhatsApp() {
    logger.info('Connecting to WhatsApp...');
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const { version } = await fetchLatestBaileysVersion();
    logger.info(`Using Baileys version: ${version.join('.')}`);

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        auth: state,
        msgRetryCounterCache,
        defaultQueryTimeoutMs: undefined,
        printQRInTerminal: false,
        browser: ['eli6s bot', 'Chrome', '10.0'],
        syncFullHistory: false,
        markOnlineOnConnect: true,
        // IMPORTANT: These settings help with message receiving
        shouldIgnoreJid: () => false,
        shouldSyncHistoryMessage: () => false,
        emitOwnEvents: true, // Changed to true to receive messages sent from bot's phone
        fireInitQueries: true,
        generateHighQualityLinkPreview: false,
        // Ensure we receive all message types including private messages
        getMessage: async (key) => {
            if (messageStore.messages[key.remoteJid]) {
                const msg = messageStore.messages[key.remoteJid].find(m => m.key.id === key.id);
                return msg?.message || undefined;
            }
            return undefined;
        }
    });

    // Attach message store to sock for easy access in commands
    sock.messageStore = messageStore;

    // Register auto-reject call handler
    setupCallHandler(sock);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            logger.info('QR Code generated, scan with WhatsApp');
            console.log('\n📱 Scan this QR code with WhatsApp:');
            console.log('   (Link as a companion device - works with WhatsApp Web)\n');
            qrcode.generate(qr, { small: true });
            // Send QR to web interface
            setQRCode(qr);
        }

        if (connection === 'close') {
            updateBotStatus({
                status: 'offline',
                phoneNumber: null,
                deviceName: null,
                connectedAt: null,
                uptime: 0
            });
            const statusCode = (lastDisconnect?.error instanceof Boom) ? lastDisconnect.error.output.statusCode : 500;
            const errorMsg = lastDisconnect?.error?.message || 'Unknown';
            
            // Check if it's a Bad MAC or session error - these can be safely ignored
            const isSessionError = errorMsg.includes('Bad MAC') || 
                                  errorMsg.includes('MessageCounterError') ||
                                  errorMsg.includes('decryption') ||
                                  errorMsg.includes('decrypt');
            
            if (isSessionError) {
                // Don't log session errors as errors - they're expected
                logger.info(`Session error (normal): ${errorMsg}`);
                console.log('⚠️  Session error (retrying automatically):', errorMsg);
            } else {
                logger.error(`Connection closed. Status: ${statusCode}, Reason: ${errorMsg}`);
                console.log('Connection closed. Status:', statusCode);
                console.log('Reason:', errorMsg);
            }
            
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
            console.log('Reconnecting:', shouldReconnect);
            
            if (lastDisconnect?.error && !isSessionError) {
                logError(lastDisconnect.error);
            }
            
            if (shouldReconnect) {
                setTimeout(() => {
                    logger.info('Attempting to reconnect...');
                    console.log('Attempting to reconnect...');
                    connectToWhatsApp();
                }, 3000);
            } else {
                logger.error('Logged out. Delete auth_info/ folder and restart to scan QR again.');
                console.log('❌ Logged out. Delete auth_info/ folder and restart to scan QR again.');
            }
        } else if (connection === 'open') {
            // Get bot info
            const phoneNumber = sock.user?.id?.split(':')[0] || 'Unknown';
            const deviceName = sock.user?.name || 'WhatsApp';
            
            // Update bot status with real data
            updateBotStatus({
                status: 'online',
                phoneNumber: phoneNumber,
                deviceName: deviceName,
                connectedAt: Date.now(),
                uptime: 0
            });
            
            setBotInstance({ sock });
            logger.info('Bot connected successfully!');
            console.log('✅ Bot connected successfully!');
            console.log('📝 Session saved - no need to scan QR again next time!');
            console.log('🤖 Bot is ready to receive messages.');
            console.log('💡 You can keep WhatsApp Web open - multi-device is supported!');
            console.log(`📱 Phone: ${phoneNumber}`);
            console.log(`📲 Device: ${deviceName}`);
            
            // Test: Send a message to yourself to verify connection
            (async () => {
                console.log('[TEST] Attempting to send test message to verify connection...');
                try {
                    const testJid = config.ownerNumber + '@s.whatsapp.net';
                    await sock.sendMessage(testJid, { 
                        text: '✅ Bot is now online and ready to receive commands!' 
                    });
                    console.log('[TEST] Test message sent successfully to', testJid);
                } catch (testError) {
                    console.error('[TEST] Failed to send test message:', testError.message);
                }
            })();
            
            // Start newsletter scheduler
            startNewsletterScheduler(sock);
            console.log('📰 Newsletter scheduler started!');
            
            // Start game cleanup service
            startGameCleanup();
            console.log('🧹 Game cleanup service started!');
        }
    });

    sock.ev.on('creds.update', saveCreds);
    
    // Handle session errors and force message processing
    sock.ev.on('messaging-history.set', ({ chats, contacts, messages, isLatest }) => {
        console.log('[HISTORY] Received messaging history. Chats:', chats.length, 'Messages:', messages.length);
    });
    
    // Log message-related events only (removed invalid wildcard listener)
    
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        console.log('[DEBUG] ========================================');
        console.log('[DEBUG] messages.upsert event triggered!');
        console.log('[DEBUG] Type:', type);
        console.log('[DEBUG] Count:', messages.length);
        console.log('[DEBUG] ========================================');
        
        // Only process 'notify' type messages (real-time messages)
        // Ignore 'append' type (old messages synced on reconnect)
        if (type !== 'notify') {
            console.log('[DEBUG] Ignoring non-notify message type:', type);
            return;
        }
        
        for (const msg of messages) {
            const chatId = msg.key.remoteJid;
            const isGroupMsg = chatId?.endsWith('@g.us');
            console.log('[DEBUG] Processing message:', msg.key.id, 'fromMe:', msg.key.fromMe, 'chatType:', isGroupMsg ? 'GROUP' : 'PRIVATE');
                
                // Skip messages from the bot itself ONLY if they're bot responses
                // Allow messages sent manually from the bot's phone number
                if (msg.key.fromMe && isGroupMsg) {
                    // In groups, skip all fromMe messages (they're bot responses)
                    console.log('[DEBUG] Skipping bot message in group');
                    continue;
                }
                // In private chats, allow fromMe messages (owner using bot number to chat)
                
                // Log private messages specifically
                if (!isGroupMsg) {
                    console.log('[PRIVATE] ===== PRIVATE MESSAGE RECEIVED =====');
                    console.log('[PRIVATE] From:', chatId);
                    console.log('[PRIVATE] Message ID:', msg.key.id);
                    console.log('[PRIVATE] fromMe:', msg.key.fromMe);
                    console.log('[PRIVATE] Has content:', !!msg.message);
                    console.log('[PRIVATE] Full message object:', JSON.stringify(msg, null, 2));
                }
                
                try {
                    // Store message in memory for delall command
                    const chatId = msg.key.remoteJid;
                    if (chatId) {
                        if (!messageStore.messages[chatId]) {
                            messageStore.messages[chatId] = [];
                        }
                        messageStore.messages[chatId].push(msg);
                        
                        // Keep only last 1000 messages per chat to avoid memory issues
                        if (messageStore.messages[chatId].length > 1000) {
                            messageStore.messages[chatId].shift();
                        }
                    }
                    
                    console.log('[DEBUG] Calling handleMessage for', isGroupMsg ? 'GROUP' : 'PRIVATE', 'message...');
                    await handleMessage(sock, msg);
                    console.log('[DEBUG] handleMessage completed for', isGroupMsg ? 'GROUP' : 'PRIVATE');
                } catch (error) {
                    // Silently handle Bad MAC and decryption errors - these are normal
                    if (error.message?.includes('Bad MAC') || 
                        error.message?.includes('MessageCounterError') ||
                        error.message?.includes('decryption') ||
                        error.message?.includes('decrypt')) {
                        // These errors are expected and can be safely ignored
                        // The message will be retried automatically by Baileys
                        continue;
                    }
                    
                    // Log other errors
                    console.error('[MESSAGE] Error handling message:', error.message);
                    logger.error(`Error handling message: ${error.message}`);
                }
            }
    });

    // Message deletion listener (anti-delete)
    sock.ev.on('messages.update', async (updates) => {
        for (const update of updates) {
            try {
                // Check if message was deleted
                if (update.update.message === null || update.update.message?.protocolMessage?.type === 0) {
                    const chatId = update.key.remoteJid;
                    const messageId = update.key.id;
                    
                    // Check if antidelete is enabled for this group
                    if (!isAntideleteEnabled(chatId)) {
                        continue;
                    }
                    
                    logger.info(`[ANTIDELETE] Message deleted detected in ${chatId}`);
                    console.log('[ANTIDELETE] Message deleted detected in', chatId);
                    console.log('[ANTIDELETE] Looking for message ID:', messageId);
                    
                    // ANTI-BAN: Add delay before reposting to avoid triggering spam detection
                    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
                    
                    // Find the deleted message in our store
                    const chatMessages = messageStore.messages[chatId] || [];
                    console.log('[ANTIDELETE] Messages in store:', chatMessages.length);
                    const deletedMsg = chatMessages.find(m => m.key.id === messageId);
                    
                    if (deletedMsg) {
                        console.log('[ANTIDELETE] Found deleted message!');
                        const lang = getGroupLanguage(chatId);
                        const sender = deletedMsg.key.participant || deletedMsg.key.remoteJid;
                        const senderName = deletedMsg.pushName || sender.split('@')[0];
                        
                        // Get message content
                        const messageContent = deletedMsg.message?.conversation || 
                                             deletedMsg.message?.extendedTextMessage?.text || 
                                             deletedMsg.message?.imageMessage?.caption || 
                                             deletedMsg.message?.videoMessage?.caption || '';
                        
                        // Check what type of message it is
                        const hasImage = !!deletedMsg.message?.imageMessage;
                        const hasVideo = !!deletedMsg.message?.videoMessage;
                        const hasSticker = !!deletedMsg.message?.stickerMessage;
                        const hasAudio = !!deletedMsg.message?.audioMessage;
                        const hasDocument = !!deletedMsg.message?.documentMessage;
                        
                        console.log('[ANTIDELETE] Message type:', { hasImage, hasVideo, hasSticker, hasAudio, hasDocument });
                        
                        // Prepare antidelete message
                        const antideleteText = lang === 'it' 
                            ? `🛡️ MESSAGGIO CANCELLATO\n\n👤 Da: @${sender.split('@')[0]}${messageContent ? `\n📝 Testo: ${messageContent}` : ''}`
                            : lang === 'es'
                            ? `🛡️ MENSAJE ELIMINADO\n\n👤 De: @${sender.split('@')[0]}${messageContent ? `\n📝 Texto: ${messageContent}` : ''}`
                            : lang === 'pt'
                            ? `🛡️ MENSAGEM EXCLUÍDA\n\n👤 De: @${sender.split('@')[0]}${messageContent ? `\n📝 Texto: ${messageContent}` : ''}`
                            : lang === 'ru'
                            ? `🛡️ УДАЛЕННОЕ СООБЩЕНИЕ\n\n👤 От: @${sender.split('@')[0]}${messageContent ? `\n📝 Текст: ${messageContent}` : ''}`
                            : lang === 'ar'
                            ? `🛡️ رسالة محذوفة\n\n👤 من: @${sender.split('@')[0]}${messageContent ? `\n📝 النص: ${messageContent}` : ''}`
                            : `🛡️ DELETED MESSAGE\n\n👤 From: @${sender.split('@')[0]}${messageContent ? `\n📝 Text: ${messageContent}` : ''}`;
                        
                        // Repost the deleted message with media
                        if (hasImage) {
                            console.log('[ANTIDELETE] Attempting to download image...');
                            try {
                                const buffer = await downloadMediaMessage(deletedMsg, 'buffer', {});
                                console.log('[ANTIDELETE] Image downloaded, size:', buffer.length);
                                await sock.sendMessage(chatId, {
                                    image: buffer,
                                    caption: antideleteText,
                                    mentions: [sender]
                                });
                                console.log('[ANTIDELETE] Image reposted successfully');
                            } catch (err) {
                                console.error('[ANTIDELETE] Error downloading image:', err.message);
                                console.error('[ANTIDELETE] Error stack:', err.stack);
                                await sock.sendMessage(chatId, {
                                    text: antideleteText + '\n\n⚠️ [Image could not be recovered]',
                                    mentions: [sender]
                                });
                            }
                        } else if (hasVideo) {
                            console.log('[ANTIDELETE] Attempting to download video...');
                            try {
                                const buffer = await downloadMediaMessage(deletedMsg, 'buffer', {});
                                console.log('[ANTIDELETE] Video downloaded, size:', buffer.length);
                                await sock.sendMessage(chatId, {
                                    video: buffer,
                                    caption: antideleteText,
                                    mentions: [sender]
                                });
                                console.log('[ANTIDELETE] Video reposted successfully');
                            } catch (err) {
                                console.error('[ANTIDELETE] Error downloading video:', err.message);
                                console.error('[ANTIDELETE] Error stack:', err.stack);
                                await sock.sendMessage(chatId, {
                                    text: antideleteText + '\n\n⚠️ [Video could not be recovered]',
                                    mentions: [sender]
                                });
                            }
                        } else if (hasAudio) {
                            console.log('[ANTIDELETE] Attempting to download audio...');
                            try {
                                const buffer = await downloadMediaMessage(deletedMsg, 'buffer', {});
                                console.log('[ANTIDELETE] Audio downloaded, size:', buffer.length);
                                await sock.sendMessage(chatId, {
                                    audio: buffer,
                                    mimetype: 'audio/mp4',
                                    ptt: deletedMsg.message.audioMessage.ptt || false
                                });
                                await sock.sendMessage(chatId, {
                                    text: antideleteText,
                                    mentions: [sender]
                                });
                                console.log('[ANTIDELETE] Audio reposted successfully');
                            } catch (err) {
                                console.error('[ANTIDELETE] Error downloading audio:', err.message);
                                await sock.sendMessage(chatId, {
                                    text: antideleteText + '\n\n⚠️ [Audio could not be recovered]',
                                    mentions: [sender]
                                });
                            }
                        } else if (hasDocument) {
                            console.log('[ANTIDELETE] Attempting to download document...');
                            try {
                                const buffer = await downloadMediaMessage(deletedMsg, 'buffer', {});
                                console.log('[ANTIDELETE] Document downloaded, size:', buffer.length);
                                await sock.sendMessage(chatId, {
                                    document: buffer,
                                    mimetype: deletedMsg.message.documentMessage.mimetype,
                                    fileName: deletedMsg.message.documentMessage.fileName || 'document'
                                });
                                await sock.sendMessage(chatId, {
                                    text: antideleteText,
                                    mentions: [sender]
                                });
                                console.log('[ANTIDELETE] Document reposted successfully');
                            } catch (err) {
                                console.error('[ANTIDELETE] Error downloading document:', err.message);
                                await sock.sendMessage(chatId, {
                                    text: antideleteText + '\n\n⚠️ [Document could not be recovered]',
                                    mentions: [sender]
                                });
                            }
                        } else if (hasSticker) {
                            console.log('[ANTIDELETE] Attempting to download sticker...');
                            try {
                                const buffer = await downloadMediaMessage(deletedMsg, 'buffer', {});
                                console.log('[ANTIDELETE] Sticker downloaded, size:', buffer.length);
                                await sock.sendMessage(chatId, {
                                    sticker: buffer
                                });
                                await sock.sendMessage(chatId, {
                                    text: antideleteText,
                                    mentions: [sender]
                                });
                                console.log('[ANTIDELETE] Sticker reposted successfully');
                            } catch (err) {
                                console.error('[ANTIDELETE] Error downloading sticker:', err.message);
                                await sock.sendMessage(chatId, {
                                    text: antideleteText + '\n\n⚠️ [Sticker could not be recovered]',
                                    mentions: [sender]
                                });
                            }
                        } else {
                            // Text message only
                            console.log('[ANTIDELETE] Text-only message');
                            await sock.sendMessage(chatId, {
                                text: antideleteText,
                                mentions: [sender]
                            });
                        }
                        
                        console.log('[ANTIDELETE] Message reposted successfully');
                    } else {
                        console.log('[ANTIDELETE] Deleted message not found in store');
                        console.log('[ANTIDELETE] Available message IDs:', chatMessages.map(m => m.key.id).slice(0, 5));
                    }
                }
            } catch (error) {
                console.error('[ANTIDELETE] Error:', error.message);
                console.error('[ANTIDELETE] Stack:', error.stack);
            }
        }
    });

    // Group participant updates (welcome/goodbye)
    sock.ev.on('group-participants.update', async (update) => {
        try {
            const { id, participants, action } = update;
            const groupSettings = loadGroupSettings();
            const lang = getGroupLanguage(id);
            
            // Welcome messages in all languages
            const welcomeMessages = {
                en: (participant) => `👋 Welcome @${participant.split('@')[0]}!\n\nEnjoy your stay in the group!`,
                it: (participant) => `👋 Benvenuto @${participant.split('@')[0]}!\n\nGoditi la tua permanenza nel gruppo!`,
                ru: (participant) => `👋 Добро пожаловать @${participant.split('@')[0]}!\n\nПриятного пребывания в группе!`,
                es: (participant) => `👋 ¡Bienvenido @${participant.split('@')[0]}!\n\n¡Disfruta tu estadía en el grupo!`,
                pt: (participant) => `👋 Bem-vindo @${participant.split('@')[0]}!\n\nAproveite sua estadia no grupo!`,
                ar: (participant) => `👋 مرحباً @${participant.split('@')[0]}!\n\nاستمتع بوقتك في المجموعة!`
            };
            
            // Goodbye messages in all languages
            const goodbyeMessages = {
                en: (participant) => `👋 Goodbye @${participant.split('@')[0]}!`,
                it: (participant) => `👋 Arrivederci @${participant.split('@')[0]}!`,
                ru: (participant) => `👋 До свидания @${participant.split('@')[0]}!`,
                es: (participant) => `👋 ¡Adiós @${participant.split('@')[0]}!`,
                pt: (participant) => `👋 Adeus @${participant.split('@')[0]}!`,
                ar: (participant) => `👋 وداعاً @${participant.split('@')[0]}!`
            };
            
            if (action === 'add' && groupSettings[id]?.welcome) {
                // ANTI-BAN: Add delay between welcome messages if multiple people join
                for (let i = 0; i < participants.length; i++) {
                    const participant = participants[i];
                    const getMessage = welcomeMessages[lang] || welcomeMessages.en;
                    const welcomeMsg = getMessage(participant);
                    await sock.sendMessage(id, {
                        text: welcomeMsg,
                        mentions: [participant]
                    });
                    
                    // Add 2-second delay between welcome messages to avoid spam detection
                    if (i < participants.length - 1) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }
                }
            }
            
            if (action === 'remove' && groupSettings[id]?.goodbye) {
                // ANTI-BAN: Add delay between goodbye messages if multiple people leave
                for (let i = 0; i < participants.length; i++) {
                    const participant = participants[i];
                    const getMessage = goodbyeMessages[lang] || goodbyeMessages.en;
                    const goodbyeMsg = getMessage(participant);
                    await sock.sendMessage(id, {
                        text: goodbyeMsg,
                        mentions: [participant]
                    });
                    
                    // Add 2-second delay between goodbye messages to avoid spam detection
                    if (i < participants.length - 1) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }
                }
            }
        } catch (error) {
            console.error('Error handling group update:', error);
        }
    });

    return sock;
}

logger.info('Starting WhatsApp Bot...');
logger.info(`Node version: ${process.version}`);
logger.info(`Platform: ${process.platform}`);

// Intercept console.log/error to filter Bad MAC errors
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

console.log = function(...args) {
    const message = args.join(' ');
    // Allow command-related messages through
    if (message.includes('[CMD]') || 
        message.includes('[MSG]') || 
        message.includes('[RATE-LIMIT]') ||
        message.includes('[ANTIDELETE]') ||
        message.includes('[NEWSLETTER]') ||
        message.includes('[WEB]') ||
        message.includes('✅') ||
        message.includes('📝') ||
        message.includes('🤖') ||
        message.includes('💡') ||
        message.includes('📰')) {
        originalConsoleLog.apply(console, args);
        return;
    }
    // Filter session errors
    if (message.includes('Session error:') || 
        message.includes('Bad MAC') || 
        message.includes('MessageCounterError') ||
        message.includes('Failed to decrypt message') ||
        message.includes('Closing open session') ||
        message.includes('Removing old closed session') ||
        message.includes('Closing session:')) {
        return; // Silently ignore
    }
    // Allow everything else
    originalConsoleLog.apply(console, args);
};

console.error = function(...args) {
    const message = args.join(' ');
    // Filter session errors only
    if (message.includes('Session error:') || 
        message.includes('Bad MAC') || 
        message.includes('MessageCounterError') ||
        message.includes('Failed to decrypt message') ||
        message.includes('Closing open session') ||
        message.includes('Removing old closed session') ||
        message.includes('Closing session:')) {
        return; // Silently ignore
    }
    // Allow all other errors
    originalConsoleError.apply(console, args);
};

// Global error handlers to prevent crashes from Bad MAC errors
process.on('uncaughtException', (error) => {
    // Silently handle Bad MAC and session errors
    if (error.message?.includes('Bad MAC') || 
        error.message?.includes('MessageCounterError') ||
        error.message?.includes('decryption') ||
        error.message?.includes('decrypt')) {
        // These are expected encryption errors - ignore them
        return;
    }
    
    // Log other errors
    originalConsoleError('Uncaught Exception:', error.message);
    logger.error(`Uncaught Exception: ${error.message}`);
});

process.on('unhandledRejection', (reason, promise) => {
    // Silently handle Bad MAC and session errors
    const errorMsg = reason?.message || String(reason);
    if (errorMsg.includes('Bad MAC') || 
        errorMsg.includes('MessageCounterError') ||
        errorMsg.includes('decryption') ||
        errorMsg.includes('decrypt')) {
        // These are expected encryption errors - ignore them
        return;
    }
    
    // Log other errors
    originalConsoleError('Unhandled Rejection:', errorMsg);
    logger.error(`Unhandled Rejection: ${errorMsg}`);
});

// Start web dashboard
startWebServer();

connectToWhatsApp();
