/**
 * Interactive Messages Utility
 * 
 * Provides functions to send interactive messages with buttons and lists
 * Compatible with WhatsApp Business API features
 */

import { log } from '../monitoring/loggerV2.js';

/**
 * Send button message
 * @param {Object} sock - WhatsApp socket
 * @param {string} jid - Recipient JID
 * @param {string} text - Message text
 * @param {Array} buttons - Array of button objects [{id, text}]
 * @param {string} footer - Optional footer text
 * @returns {Promise}
 */
export async function sendButtonMessage(sock, jid, text, buttons, footer = '') {
    try {
        // Format buttons for Baileys
        const buttonMessages = buttons.map((btn, index) => ({
            buttonId: btn.id || `btn_${index}`,
            buttonText: { displayText: btn.text },
            type: 1
        }));
        
        const message = {
            text,
            footer,
            buttons: buttonMessages,
            headerType: 1
        };
        
        await sock.sendMessage(jid, message);
        log.debug('Button message sent', { jid, buttonCount: buttons.length });
    } catch (error) {
        // Fallback to regular text message if buttons not supported
        log.warn('Button message failed, falling back to text', { error: error.message });
        const fallbackText = `${text}\n\n${buttons.map((btn, i) => `${i + 1}. ${btn.text}`).join('\n')}`;
        await sock.sendMessage(jid, { text: fallbackText });
    }
}

/**
 * Send list message
 * @param {Object} sock - WhatsApp socket
 * @param {string} jid - Recipient JID
 * @param {string} title - List title
 * @param {string} buttonText - Button text to open list
 * @param {Array} sections - Array of section objects [{title, rows: [{id, title, description}]}]
 * @param {string} footer - Optional footer text
 * @returns {Promise}
 */
export async function sendListMessage(sock, jid, title, buttonText, sections, footer = '') {
    try {
        const message = {
            text: title,
            footer,
            title,
            buttonText,
            sections
        };
        
        await sock.sendMessage(jid, message);
        log.debug('List message sent', { jid, sectionCount: sections.length });
    } catch (error) {
        // Fallback to regular text message
        log.warn('List message failed, falling back to text', { error: error.message });
        let fallbackText = `${title}\n\n`;
        sections.forEach(section => {
            fallbackText += `*${section.title}*\n`;
            section.rows.forEach((row, i) => {
                fallbackText += `${i + 1}. ${row.title}`;
                if (row.description) fallbackText += ` - ${row.description}`;
                fallbackText += '\n';
            });
            fallbackText += '\n';
        });
        await sock.sendMessage(jid, { text: fallbackText });
    }
}

/**
 * Send template message with quick reply buttons
 * @param {Object} sock - WhatsApp socket
 * @param {string} jid - Recipient JID
 * @param {string} text - Message text
 * @param {Array} quickReplies - Array of quick reply texts
 * @returns {Promise}
 */
export async function sendQuickReply(sock, jid, text, quickReplies) {
    try {
        const buttons = quickReplies.map((reply, index) => ({
            buttonId: `quick_${index}`,
            buttonText: { displayText: reply },
            type: 1
        }));
        
        await sendButtonMessage(sock, jid, text, buttons);
    } catch (error) {
        log.error('Quick reply failed', error);
        await sock.sendMessage(jid, { text });
    }
}

/**
 * Send games menu with interactive buttons
 * @param {Object} sock - WhatsApp socket
 * @param {string} jid - Recipient JID
 * @param {string} language - User language
 * @returns {Promise}
 */
export async function sendGamesMenu(sock, jid, language = 'en') {
    const translations = {
        en: {
            title: '🎮 Choose a Game',
            footer: 'Select a game to play',
            buttons: [
                { id: '.blackjack', text: '🃏 Blackjack' },
                { id: '.roulette', text: '🎰 Roulette' },
                { id: '.chess', text: '♟️ Chess' },
                { id: '.slot', text: '🎰 Slot Machine' }
            ]
        },
        it: {
            title: '🎮 Scegli un Gioco',
            footer: 'Seleziona un gioco',
            buttons: [
                { id: '.blackjack', text: '🃏 Blackjack' },
                { id: '.roulette', text: '🎰 Roulette' },
                { id: '.chess', text: '♟️ Scacchi' },
                { id: '.slot', text: '🎰 Slot Machine' }
            ]
        },
        es: {
            title: '🎮 Elige un Juego',
            footer: 'Selecciona un juego',
            buttons: [
                { id: '.blackjack', text: '🃏 Blackjack' },
                { id: '.roulette', text: '🎰 Ruleta' },
                { id: '.chess', text: '♟️ Ajedrez' },
                { id: '.slot', text: '🎰 Tragamonedas' }
            ]
        },
        pt: {
            title: '🎮 Escolha um Jogo',
            footer: 'Selecione um jogo',
            buttons: [
                { id: '.blackjack', text: '🃏 Blackjack' },
                { id: '.roulette', text: '🎰 Roleta' },
                { id: '.chess', text: '♟️ Xadrez' },
                { id: '.slot', text: '🎰 Caça-níqueis' }
            ]
        },
        ru: {
            title: '🎮 Выберите игру',
            footer: 'Выберите игру',
            buttons: [
                { id: '.blackjack', text: '🃏 Блэкджек' },
                { id: '.roulette', text: '🎰 Рулетка' },
                { id: '.chess', text: '♟️ Шахматы' },
                { id: '.slot', text: '🎰 Слот' }
            ]
        },
        ar: {
            title: '🎮 اختر لعبة',
            footer: 'اختر لعبة',
            buttons: [
                { id: '.blackjack', text: '🃏 بلاك جاك' },
                { id: '.roulette', text: '🎰 روليت' },
                { id: '.chess', text: '♟️ شطرنج' },
                { id: '.slot', text: '🎰 سلوت' }
            ]
        },
        hi: {
            title: '🎮 एक गेम चुनें',
            footer: 'एक गेम चुनें',
            buttons: [
                { id: '.blackjack', text: '🃏 ब्लैकजैक' },
                { id: '.roulette', text: '🎰 रूलेट' },
                { id: '.chess', text: '♟️ शतरंज' },
                { id: '.slot', text: '🎰 स्लॉट' }
            ]
        }
    };
    
    const t = translations[language] || translations.en;
    await sendButtonMessage(sock, jid, t.title, t.buttons, t.footer);
}

/**
 * Send admin menu with interactive buttons
 * @param {Object} sock - WhatsApp socket
 * @param {string} jid - Recipient JID
 * @param {string} language - User language
 * @returns {Promise}
 */
export async function sendAdminMenu(sock, jid, language = 'en') {
    const translations = {
        en: {
            title: '👮 Admin Commands',
            sections: [
                {
                    title: 'Moderation',
                    rows: [
                        { id: '.ban', title: 'Ban User', description: 'Remove user from group' },
                        { id: '.warn', title: 'Warn User', description: 'Give warning to user' },
                        { id: '.mute', title: 'Mute Group', description: 'Mute group for X minutes' }
                    ]
                },
                {
                    title: 'Settings',
                    rows: [
                        { id: '.antilink on', title: 'Enable Antilink', description: 'Block links in group' },
                        { id: '.welcome on', title: 'Enable Welcome', description: 'Welcome new members' },
                        { id: '.antidelete on', title: 'Enable Antidelete', description: 'Repost deleted messages' }
                    ]
                }
            ]
        },
        it: {
            title: '👮 Comandi Admin',
            sections: [
                {
                    title: 'Moderazione',
                    rows: [
                        { id: '.ban', title: 'Banna Utente', description: 'Rimuovi utente dal gruppo' },
                        { id: '.warn', title: 'Avvisa Utente', description: 'Dai avviso all\'utente' },
                        { id: '.mute', title: 'Silenzia Gruppo', description: 'Silenzia gruppo per X minuti' }
                    ]
                },
                {
                    title: 'Impostazioni',
                    rows: [
                        { id: '.antilink on', title: 'Attiva Antilink', description: 'Blocca link nel gruppo' },
                        { id: '.welcome on', title: 'Attiva Benvenuto', description: 'Saluta nuovi membri' },
                        { id: '.antidelete on', title: 'Attiva Antidelete', description: 'Ripubblica messaggi eliminati' }
                    ]
                }
            ]
        }
    };
    
    const t = translations[language] || translations.en;
    await sendListMessage(sock, jid, t.title, 'Select Command', t.sections);
}

export default {
    sendButtonMessage,
    sendListMessage,
    sendQuickReply,
    sendGamesMenu,
    sendAdminMenu
};
