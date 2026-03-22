/**
 * Fake Forward Utility
 * 
 * This creates messages that LOOK like they're forwarded from a channel,
 * with the "View Channel" button that WhatsApp automatically adds.
 * 
 * This is how popular WhatsApp bots make their menu/help messages appear
 * as if they're forwarded from an official channel.
 */

import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';
import { config } from '../config.js';

// Your newsletter/channel JID
// Format: 120363XXXXXXXXX@newsletter
const NEWSLETTER_JID = '120363406550247009@newsletter';

/**
 * Send a message that looks like it's forwarded from a newsletter/channel
 * This will show the "View Channel" button automatically!
 * 
 * @param {Object} sock - WhatsApp socket instance
 * @param {string} chatId - Target chat ID
 * @param {string} text - Message text content
 * @param {Object} options - Additional options
 * @param {number} options.forwardingScore - How many times it appears forwarded (default: 999)
 * @param {boolean} options.isForwarded - Show "Forwarded" label (default: true)
 * @param {string} options.newsletterJid - Newsletter JID (default: from config)
 * @param {string} options.newsletterName - Newsletter name to display (default: bot name)
 * @param {Object} options.quoted - Message to quote/reply to
 * @returns {Promise<Object>} - Sent message info
 */
export async function sendFakeForward(sock, chatId, text, options = {}) {
    const {
        forwardingScore = 999,
        isForwarded = true,
        newsletterJid = NEWSLETTER_JID,
        newsletterName = config.botName || 'Bot Channel',
        quoted = null
    } = options;

    // Build context info with newsletter forwarding info
    // IMPORTANT: Don't include serverMessageId to avoid "update not available" error
    const contextInfo = {
        forwardingScore: forwardingScore,
        isForwarded: isForwarded,
        forwardedNewsletterMessageInfo: {
            newsletterJid: newsletterJid,
            newsletterName: newsletterName
            // serverMessageId is intentionally omitted to prevent WhatsApp from
            // trying to find a specific message in the channel
        }
    };

    // Generate the message
    const message = {
        extendedTextMessage: {
            text: text,
            contextInfo: contextInfo
        }
    };

    // Create the message object
    const msg = generateWAMessageFromContent(chatId, message, {
        quoted: quoted
    });

    // Send the message
    await sock.relayMessage(chatId, msg.message, {
        messageId: msg.key.id
    });

    return msg;
}

/**
 * Send a message that looks like it's forwarded from a newsletter/channel
 * This is the most common pattern - just text with "View Channel" button
 * 
 * @param {Object} sock - WhatsApp socket instance
 * @param {string} chatId - Target chat ID
 * @param {string} text - Message text
 * @param {Object} options - Additional options
 */
export async function sendAsChannelForward(sock, chatId, text, options = {}) {
    // High forwarding score makes it look like it's been forwarded many times
    // isForwarded: true shows the "Forwarded" label
    // forwardedNewsletterMessageInfo adds the "View Channel" button
    return await sendFakeForward(sock, chatId, text, {
        forwardingScore: 999,
        isForwarded: true,
        ...options
    });
}

/**
 * Alternative method using direct message construction
 * More control but requires more setup
 */
export async function sendFakeForwardAdvanced(sock, chatId, content, options = {}) {
    const {
        forwardingScore = 999,
        isForwarded = true,
        newsletterJid = NEWSLETTER_JID,
        newsletterName = config.botName || 'Bot Channel',
        quoted = null,
        mentions = []
    } = options;

    const message = proto.Message.fromObject({
        extendedTextMessage: {
            text: content,
            contextInfo: {
                forwardingScore: forwardingScore,
                isForwarded: isForwarded,
                mentionedJid: mentions,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: newsletterJid,
                    newsletterName: newsletterName
                    // serverMessageId is intentionally omitted
                }
            }
        }
    });

    const messageContent = generateWAMessageFromContent(chatId, message, {
        quoted: quoted
    });

    await sock.relayMessage(chatId, messageContent.message, {
        messageId: messageContent.key.id
    });

    return messageContent;
}
