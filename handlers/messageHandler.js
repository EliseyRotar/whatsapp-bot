import { config } from '../config.js';
import { commands } from '../commands/index.js';
import { isAdmin, isBotAdmin } from '../utils/helpers.js';
import { getGroupSetting } from '../utils/database.js';
import { downloadMediaMessage } from '@whiskeysockets/baileys';
import { isOwnerOrAdditional } from '../utils/ownerManager.js';
import { t } from '../utils/language.js';
import * as logger from '../utils/logger.js';

// Import web monitoring AND analytics
import { logMessage, logCommand, updateGroup, updateUser, logError } from '../web/server.js';
import * as analytics from '../utils/monitoring/analytics.js';

// Track bot's own messages to prevent loops
const botMessageIds = new Set();
const MAX_TRACKED_MESSAGES = 100;

// Track bot start time to ignore old messages
const BOT_START_TIME = Date.now();

// Rate limiting
const messageQueue = new Map(); // jid -> array of timestamps
const RATE_LIMIT_WINDOW = 10000; // 10 seconds
const MAX_MESSAGES_PER_WINDOW = 5; // Max 5 messages per 10 seconds per chat

function isRateLimited(jid) {
    const now = Date.now();
    const timestamps = messageQueue.get(jid) || [];
    
    // Remove old timestamps outside the window
    const recentTimestamps = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW);
    
    // Add current timestamp FIRST (before checking limit)
    recentTimestamps.push(now);
    messageQueue.set(jid, recentTimestamps);
    
    // THEN check if limit exceeded
    if (recentTimestamps.length > MAX_MESSAGES_PER_WINDOW) {
        console.log(`[RATE-LIMIT] ${jid} is rate limited (${recentTimestamps.length} messages in ${RATE_LIMIT_WINDOW}ms)`);
        return true;
    }
    
    return false;
}

// Wrapper to track bot's sent messages
function wrapSendMessage(sock) {
    const originalSend = sock.sendMessage.bind(sock);
    sock.sendMessage = async function(...args) {
        try {
            const jid = args[0];
            
            // Check rate limit
            if (isRateLimited(jid)) {
                console.log(`[RATE-LIMIT] Delaying message to ${jid}`);
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
            }
            
            const result = await originalSend(...args);
            if (result?.key?.id) {
                botMessageIds.add(result.key.id);
                // Limit set size to prevent memory issues
                if (botMessageIds.size > MAX_TRACKED_MESSAGES) {
                    const firstItem = botMessageIds.values().next().value;
                    botMessageIds.delete(firstItem);
                }
            }
            return result;
        } catch (error) {
            console.error('[MSG] Error sending message:', error.message);
            // Don't throw on rate-overlimit, just log it
            if (error.message === 'rate-overlimit') {
                console.log('[RATE-LIMIT] WhatsApp rate limit hit, waiting 5 seconds...');
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
            throw error;
        }
    };
}

export async function handleMessage(sock, msg) {
    try {
        // Wrap sendMessage on first call
        if (!sock._sendMessageWrapped) {
            wrapSendMessage(sock);
            sock._sendMessageWrapped = true;
        }

        console.log('[HANDLER] ===== handleMessage called =====');
        console.log('[HANDLER] Message received:', JSON.stringify(msg.key));
        
        if (!msg.message) {
            console.log('[HANDLER] No message content, skipping');
            return;
        }
        
        // Auto-save view-once messages if enabled
        if (global.autoVV && msg.message.viewOnceMessageV2) {
            try {
                console.log('[AUTO-VV] View-once message detected!');
                const from = msg.key.remoteJid;
                const sender = msg.key.participant || msg.key.remoteJid;
                const senderName = sender.split('@')[0];
                const viewOnceMsg = msg.message.viewOnceMessageV2;
                
                if (viewOnceMsg.message) {
                    const innerMsg = viewOnceMsg.message;
                    
                    // Download and save immediately
                    const buffer = await downloadMediaMessage(msg, 'buffer', {});
                    
                    if (innerMsg.imageMessage) {
                        await sock.sendMessage(from, {
                            image: buffer,
                            caption: `👁️ View-once image from @${senderName}`,
                            mentions: [sender]
                        });
                        console.log('[AUTO-VV] Image revealed and sent to group!');
                    } else if (innerMsg.videoMessage) {
                        await sock.sendMessage(from, {
                            video: buffer,
                            caption: `👁️ View-once video from @${senderName}`,
                            mentions: [sender]
                        });
                        console.log('[AUTO-VV] Video revealed and sent to group!');
                    }
                }
            } catch (error) {
                console.error('[AUTO-VV] Error:', error.message);
            }
        }
        
        // Prevent responding to bot's own command responses
        if (botMessageIds.has(msg.key.id)) {
            console.log('[DEBUG] Ignoring bot\'s own message');
            return;
        }

        // Ignore old messages from before bot started
        const messageTimestamp = msg.messageTimestamp ? msg.messageTimestamp * 1000 : Date.now();
        const timeDiff = messageTimestamp - BOT_START_TIME;
        
        // Ignore messages sent before bot started (with small buffer for timing issues)
        if (timeDiff < -5000) { // 5 second buffer
            console.log('[MSG] Ignoring old message from before bot start');
            console.log('[MSG] Message time:', new Date(messageTimestamp).toISOString());
            console.log('[MSG] Bot start time:', new Date(BOT_START_TIME).toISOString());
            console.log('[MSG] Time difference:', timeDiff, 'ms');
            return;
        }

        const body = msg.message?.conversation || 
                     msg.message?.extendedTextMessage?.text || 
                     msg.message?.imageMessage?.caption || 
                     msg.message?.videoMessage?.caption || '';

        console.log('[DEBUG] ========================================');
        console.log('[DEBUG] MESSAGE BODY EXTRACTED:', body);
        console.log('[DEBUG] MESSAGE BODY LENGTH:', body.length);
        console.log('[DEBUG] MESSAGE BODY CHARS:', body.split('').map(c => c.charCodeAt(0)));
        console.log('[DEBUG] ========================================');

        const from = msg.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const sender = msg.key.participant || msg.key.remoteJid;
        
        console.log('[HANDLER] Chat type:', isGroup ? 'GROUP' : 'PRIVATE');
        console.log('[HANDLER] From:', from);
        console.log('[HANDLER] Sender:', sender);
        console.log('[HANDLER] msg.key.participant:', msg.key.participant);
        console.log('[HANDLER] msg.key.remoteJid:', msg.key.remoteJid);
        console.log('[HANDLER] From:', from);
        console.log('[DEBUG] From:', from, 'IsGroup:', isGroup, 'Sender:', sender);
        console.log('[DEBUG] Chat type:', isGroup ? 'GROUP' : 'PRIVATE');
        
        // Enhanced logging for private messages
        if (!isGroup) {
            console.log('[PRIVATE] Private message detected!');
            console.log('[PRIVATE] Sender:', sender);
            console.log('[PRIVATE] Message:', body);
        }
        
        // Log message to web monitor
        try {
            const senderName = msg.pushName || sender.split('@')[0];
            const chatName = isGroup ? 'Group Chat' : 'Private Chat';
            
            // Log to web server
            logMessage({
                id: msg.key.id,
                from,
                sender: sender.split('@')[0],
                senderName: senderName,
                text: body || '[Media]',
                content: body || '[Media]',
                isGroup,
                chatName: chatName,
                timestamp: messageTimestamp
            });
            
            // Track in analytics
            analytics.trackMessage(from, sender, isGroup);
            
            // Update group/user stats
            if (isGroup) {
                const groupMetadata = await sock.groupMetadata(from).catch(() => null);
                if (groupMetadata) {
                    updateGroup({
                        id: from,
                        name: groupMetadata.subject,
                        memberCount: groupMetadata.participants.length,
                        messageCount: (analytics.getAnalytics?.().groupMessages?.get(from) || 0)
                    });
                }
            } else {
                updateUser({
                    id: sender,
                    name: senderName,
                    lastActive: Date.now()
                });
            }
        } catch (monitorError) {
            console.error('[MONITOR] Error logging message:', monitorError.message);
        }
        
        // Check for language selection response (for .guide command)
        if (!from.endsWith('@g.us') && !msg.key.fromMe) { // Only in private chat and not from bot
            try {
                const { handleLanguageSelection } = await import('../commands/general/guide.js');
                const handled = await handleLanguageSelection(sock, msg, body);
                if (handled) {
                    return; // Language selection was handled, don't process as command
                }
            } catch (error) {
                console.error('[GUIDE] Error checking language selection:', error.message);
            }
        }
        
        // Get bot's actual JID (the one used in groups)
        const botJid = sock.user?.id?.replace(/:\d+/, '') || '';
        const botNumber = sock.user?.id?.split(':')[0] || config.ownerNumber;
        
        // Extract sender info
        const senderNumber = sender.split('@')[0].replace(/\D/g, '');
        
        // Check if sender is owner (main owner or additional owner)
        const isOwner = isOwnerOrAdditional(sender, botJid, config.ownerNumber, config.ownerJid, msg.key.fromMe);
        
        // Debug logging
        if (body.startsWith(config.prefix)) {
            console.log(`[CMD] From: ${sender}`);
            console.log(`[CMD] Bot JID: ${botJid}`);
            console.log(`[CMD] Bot Number: ${botNumber}`);
            console.log(`[CMD] Sender Number: ${senderNumber}`);
            console.log(`[CMD] Is Owner: ${isOwner}`);
            console.log(`[CMD] Message: ${body}`);
        }
        
        // Antilink check
        if (isGroup) {
            const antilinkEnabled = getGroupSetting(from, 'antilink');
            if (antilinkEnabled) {
                const linkRegex = /(https?:\/\/|www\.|chat\.whatsapp\.com)/gi;
                if (linkRegex.test(body)) {
                    const isUserAdmin = await isAdmin(sock, from, sender);
                    if (!isUserAdmin) {
                        try {
                            await sock.sendMessage(from, { delete: msg.key });
                            await sock.sendMessage(from, { 
                                text: '❌ Links are not allowed in this group!' 
                            });
                            return;
                        } catch (error) {
                            console.error('[ANTILINK] Error deleting link:', error.message);
                            try {
                                await sock.sendMessage(from, { 
                                    text: '⚠️ Link detected but couldn\'t be deleted. Please check bot permissions.' 
                                });
                            } catch (e) {
                                console.error('[ANTILINK] Error sending warning:', e.message);
                            }
                        }
                    }
                }
            }
            
            // Check if user is muted (from .kill command)
            try {
                const { isUserMuted } = await import('../commands/action/kill.js');
                const senderId = sender.split('@')[0];
                
                if (isUserMuted(from, senderId)) {
                    console.log(`[MUTE] User ${senderId} is muted, deleting message`);
                    try {
                        await sock.sendMessage(from, { delete: msg.key });
                    } catch (error) {
                        console.error('[MUTE] Error deleting message:', error.message);
                    }
                    return;
                }
            } catch (error) {
                // Kill command might not be loaded yet, ignore
            }
        }
        
        // Check if message starts with prefix
        console.log('[DEBUG] ========================================');
        console.log('[DEBUG] CHECKING PREFIX');
        console.log('[DEBUG] Body:', JSON.stringify(body));
        console.log('[DEBUG] Prefix:', JSON.stringify(config.prefix));
        console.log('[DEBUG] Body starts with prefix:', body.startsWith(config.prefix));
        console.log('[DEBUG] Body[0]:', body[0], 'charCode:', body.charCodeAt(0));
        console.log('[DEBUG] Prefix[0]:', config.prefix[0], 'charCode:', config.prefix.charCodeAt(0));
        console.log('[DEBUG] ========================================');
        
        if (!body.startsWith(config.prefix)) {
            // Check for active Mines game (handle without prefix)
            const gameKey = `${from}_${sender.split('@')[0]}`;
            
            // Import mines command dynamically to check for active games
            try {
                const minesModule = await import('../commands/games/mines.js');
                const activeGames = minesModule.activeGames;
                
                if (activeGames && activeGames.has(gameKey)) {
                    console.log('[MINES] Active game detected, processing input:', body);
                    // Call mines command with the input as argument
                    await commands.mines.execute(sock, msg, [body]);
                    return;
                }
            } catch (error) {
                console.log('[MINES] Error checking active games:', error.message);
            }
            
            console.log('[DEBUG] Message does not start with prefix, ignoring');
            return;
        }

        const args = body.slice(config.prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        logger.command(command, sender.split('@')[0], true);
        console.log(`[CMD] Command: ${command}, Args: ${args.join(' ')}`);
        console.log(`[CMD] Chat type: ${isGroup ? 'GROUP' : 'PRIVATE'}`);
        
        // Enhanced logging for private message commands
        if (!isGroup) {
            console.log('[PRIVATE-CMD] Private message command detected!');
            console.log('[PRIVATE-CMD] Command:', command);
            console.log('[PRIVATE-CMD] From:', sender);
        }

        // Per-chat disable check (set via .mode private/public)
        if (getGroupSetting(from, 'botDisabled', false) && !isOwner) {
            console.log(`[CMD] Blocked: bot disabled for this chat (${from})`);
            return;
        }

        // Mode check (global — set via .botoff/.boton)
        if (config.mode === 'private' && !isOwner) {
            console.log(`[CMD] Blocked: Private mode, sender: ${sender}`);
            return;
        }

        // Get command handler
        const cmd = commands[command];
        console.log(`[CMD] Looking for command '${command}' in commands object`);
        console.log(`[CMD] Available commands:`, Object.keys(commands).slice(0, 10).join(', '), '...');
        console.log(`[CMD] Command found:`, !!cmd);
        
        if (!cmd) {
            console.log(`[CMD] Unknown command: ${command}`);
            return;
        }

        console.log(`[CMD] Executing: ${command}`);

        // Permission checks with better error messages
        if (cmd.ownerOnly && !isOwner) {
            return await sock.sendMessage(from, { 
                text: t(from, 'ownerOnly')
            }).catch(err => console.error('[CMD] Error sending owner-only message:', err.message));
        }

        if (cmd.groupOnly && !isGroup) {
            return await sock.sendMessage(from, { 
                text: t(from, 'groupOnly')
            }).catch(err => console.error('[CMD] Error sending group-only message:', err.message));
        }

        if (cmd.adminOnly && isGroup) {
            try {
                const isUserAdmin = await isAdmin(sock, from, sender);
                if (!isUserAdmin) {
                    return await sock.sendMessage(from, { 
                        text: t(from, 'adminOnly')
                    }).catch(err => console.error('[CMD] Error sending admin-only message:', err.message));
                }
            } catch (error) {
                console.error('[CMD] Error checking admin status:', error.message);
                return await sock.sendMessage(from, { 
                    text: '❌ Couldn\'t verify admin status. Please try again.' 
                }).catch(err => console.error('[CMD] Error sending error message:', err.message));
            }
        }

        if (cmd.botAdminRequired && isGroup) {
            console.log('[CMD] Checking if bot is admin...');
            try {
                const isBotGroupAdmin = await isBotAdmin(sock, from);
                console.log('[CMD] isBotAdmin result:', isBotGroupAdmin);
                if (!isBotGroupAdmin) {
                    console.log('[CMD] Bot is NOT admin, sending error message');
                    return await sock.sendMessage(from, { 
                        text: t(from, 'botAdminRequired')
                    }).catch(err => console.error('[CMD] Error sending bot-admin message:', err.message));
                }
                console.log('[CMD] Bot IS admin, proceeding with command');
            } catch (error) {
                console.error('[CMD] Error checking bot admin status:', error.message);
                console.error('[CMD] Error stack:', error.stack);
                return await sock.sendMessage(from, { 
                    text: '❌ Couldn\'t verify bot admin status. Please try again.' 
                }).catch(err => console.error('[CMD] Error sending error message:', err.message));
            }
        }

        // Execute command with error handling
        try {
            const startTime = Date.now();
            await cmd.execute(sock, msg, args);
            const responseTime = Date.now() - startTime;
            
            logger.command(command, sender.split('@')[0], true);
            console.log(`[CMD] Completed: ${command} (${responseTime}ms)`);
            
            // Track in analytics
            analytics.trackCommand(command, sender, isGroup ? from : null, responseTime, true);
            
            // Log successful command execution
            logCommand({
                command,
                args,
                from,
                sender: sender.split('@')[0],
                isGroup,
                success: true,
                responseTime
            });
        } catch (error) {
            logger.error(`Error executing ${command}: ${error.message}`);
            console.error(`[CMD] Error executing ${command}:`, error.message);
            console.error('[CMD] Stack trace:', error.stack);
            
            // Track failed command in analytics
            analytics.trackCommand(command, sender, isGroup ? from : null, 0, false);
            
            // Log failed command execution
            logCommand({
                command,
                args,
                from,
                sender: sender.split('@')[0],
                isGroup,
                success: false,
                error: error.message
            });
            
            // Log error
            logError(error);
            
            // Handle rate limit errors gracefully
            if (error.message === 'rate-overlimit') {
                console.log('[RATE-LIMIT] Command hit rate limit, waiting before retry...');
                await new Promise(resolve => setTimeout(resolve, 5000));
                return; // Don't send error message to avoid more rate limiting
            }
            
            // Send user-friendly error message
            try {
                await sock.sendMessage(from, { 
                    text: `❌ An error occurred while executing the command.\n\nCommand: .${command}\nError: ${error.message}\n\nPlease try again or contact the bot owner if the issue persists.` 
                });
            } catch (sendError) {
                console.error('[CMD] Error sending error message:', sendError.message);
            }
        }

    } catch (error) {
        // Silently handle Bad MAC and session errors - these are normal
        if (error.message?.includes('Bad MAC') || 
            error.message?.includes('MessageCounterError') ||
            error.message?.includes('decryption') ||
            error.message?.includes('decrypt')) {
            // These errors are expected and can be safely ignored
            return;
        }
        
        logger.error(`Error handling message: ${error.message}`);
        console.error('[MSG] Error handling message:', error.message);
        console.error('[MSG] Stack trace:', error.stack);
        logError(error);
    }
}

// Memory leak prevention: Clean up old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    let cleaned = 0;
    
    // Clean messageQueue
    for (const [jid, timestamps] of messageQueue.entries()) {
        const recent = timestamps.filter(ts => now - ts < 300000); // 5 minutes
        if (recent.length === 0) {
            messageQueue.delete(jid);
            cleaned++;
        } else {
            messageQueue.set(jid, recent);
        }
    }
    
    // Clean botMessageIds if too large
    if (botMessageIds.size > MAX_TRACKED_MESSAGES * 2) {
        const toDelete = botMessageIds.size - MAX_TRACKED_MESSAGES;
        const iterator = botMessageIds.values();
        for (let i = 0; i < toDelete; i++) {
            const value = iterator.next().value;
            if (value) botMessageIds.delete(value);
        }
    }
    
    if (cleaned > 0) {
        console.log(`[CLEANUP] Removed ${cleaned} old rate limit entries, botMessageIds size: ${botMessageIds.size}`);
    }
}, 300000); // Every 5 minutes
