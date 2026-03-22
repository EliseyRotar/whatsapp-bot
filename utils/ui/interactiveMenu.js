import * as logger from '../monitoring/logger.js';

// Create interactive button menu
export function createButtonMenu(title, buttons, footer = null) {
    try {
        // WhatsApp supports up to 3 buttons
        if (buttons.length > 3) {
            logger.warn('Too many buttons, truncating to 3', { count: buttons.length });
            buttons = buttons.slice(0, 3);
        }
        
        const buttonMessage = {
            text: title,
            footer: footer || '',
            buttons: buttons.map((btn, index) => ({
                buttonId: btn.id || `btn_${index}`,
                buttonText: { displayText: btn.text },
                type: 1
            })),
            headerType: 1
        };
        
        return buttonMessage;
    } catch (error) {
        logger.error('Error creating button menu', { error: error.message });
        return { text: title };
    }
}

// Create list menu (for more than 3 options)
export function createListMenu(title, buttonText, sections, footer = null) {
    try {
        const listMessage = {
            text: title,
            footer: footer || '',
            title: title,
            buttonText: buttonText,
            sections: sections.map(section => ({
                title: section.title,
                rows: section.rows.map((row, index) => ({
                    title: row.title,
                    description: row.description || '',
                    rowId: row.id || `row_${index}`
                }))
            }))
        };
        
        return listMessage;
    } catch (error) {
        logger.error('Error creating list menu', { error: error.message });
        return { text: title };
    }
}

// Games menu
export function createGamesMenu(language = 'en') {
    const translations = {
        en: {
            title: '🎮 GAMES MENU\n\nChoose a game to play:',
            button: 'Select Game',
            sections: [
                {
                    title: '🎰 Casino Games',
                    rows: [
                        { id: '.blackjack', title: '🃏 Blackjack', description: 'Classic card game - Beat the dealer!' },
                        { id: '.slot', title: '🎰 Slot Machine', description: 'Spin to win big!' },
                        { id: '.roulette', title: '🎡 Roulette', description: 'Bet on red, black, or numbers' }
                    ]
                },
                {
                    title: '🎲 Dice & Chance',
                    rows: [
                        { id: '.dice', title: '🎲 Dice Roll', description: 'Roll the dice and win!' },
                        { id: '.coinflip', title: '🪙 Coin Flip', description: 'Heads or tails?' },
                        { id: '.guess', title: '🔢 Number Guess', description: 'Guess the number 1-10' }
                    ]
                },
                {
                    title: '♟️ Strategy Games',
                    rows: [
                        { id: '.chess', title: '♟️ Chess', description: 'Play chess with friends' },
                        { id: '.tictactoe', title: '❌⭕ Tic Tac Toe', description: 'Classic 3x3 game' },
                        { id: '.rps', title: '✊✋✌️ Rock Paper Scissors', description: 'Beat your opponent!' }
                    ]
                },
                {
                    title: '🧠 Trivia & Quiz',
                    rows: [
                        { id: '.trivia', title: '❓ Trivia', description: 'Test your knowledge' },
                        { id: '.math', title: '🔢 Math Challenge', description: 'Solve math problems' },
                        { id: '.8ball', title: '🎱 Magic 8 Ball', description: 'Ask a yes/no question' }
                    ]
                }
            ]
        },
        it: {
            title: '🎮 MENU GIOCHI\n\nScegli un gioco:',
            button: 'Seleziona Gioco',
            sections: [
                {
                    title: '🎰 Giochi da Casinò',
                    rows: [
                        { id: '.blackjack', title: '🃏 Blackjack', description: 'Gioco di carte classico - Batti il banco!' },
                        { id: '.slot', title: '🎰 Slot Machine', description: 'Gira per vincere!' },
                        { id: '.roulette', title: '🎡 Roulette', description: 'Scommetti su rosso, nero o numeri' }
                    ]
                },
                {
                    title: '🎲 Dadi e Fortuna',
                    rows: [
                        { id: '.dice', title: '🎲 Lancio Dadi', description: 'Lancia i dadi e vinci!' },
                        { id: '.coinflip', title: '🪙 Testa o Croce', description: 'Testa o croce?' },
                        { id: '.guess', title: '🔢 Indovina Numero', description: 'Indovina il numero 1-10' }
                    ]
                },
                {
                    title: '♟️ Giochi di Strategia',
                    rows: [
                        { id: '.chess', title: '♟️ Scacchi', description: 'Gioca a scacchi con gli amici' },
                        { id: '.tictactoe', title: '❌⭕ Tris', description: 'Classico gioco 3x3' },
                        { id: '.rps', title: '✊✋✌️ Sasso Carta Forbici', description: 'Batti il tuo avversario!' }
                    ]
                },
                {
                    title: '🧠 Trivia e Quiz',
                    rows: [
                        { id: '.trivia', title: '❓ Trivia', description: 'Testa la tua conoscenza' },
                        { id: '.math', title: '🔢 Sfida Matematica', description: 'Risolvi problemi matematici' },
                        { id: '.8ball', title: '🎱 Palla Magica 8', description: 'Fai una domanda sì/no' }
                    ]
                }
            ]
        }
    };
    
    const t = translations[language] || translations.en;
    return createListMenu(t.title, t.button, t.sections);
}

// Economy menu
export function createEconomyMenu(language = 'en') {
    const translations = {
        en: {
            title: '💰 ECONOMY MENU',
            buttons: [
                { id: '.bank', text: '💵 Check Balance' },
                { id: '.daily', text: '🎁 Daily Reward' },
                { id: '.shop', text: '🛍️ Shop' }
            ],
            footer: 'Manage your coins and items'
        },
        it: {
            title: '💰 MENU ECONOMIA',
            buttons: [
                { id: '.bank', text: '💵 Controlla Saldo' },
                { id: '.daily', text: '🎁 Ricompensa Giornaliera' },
                { id: '.shop', text: '🛍️ Negozio' }
            ],
            footer: 'Gestisci le tue monete e oggetti'
        }
    };
    
    const t = translations[language] || translations.en;
    return createButtonMenu(t.title, t.buttons, t.footer);
}

// Admin menu
export function createAdminMenu(language = 'en') {
    const translations = {
        en: {
            title: '👮 ADMIN MENU\n\nSelect an action:',
            button: 'Admin Actions',
            sections: [
                {
                    title: '👥 Member Management',
                    rows: [
                        { id: '.kick', title: '👢 Kick User', description: 'Remove user from group' },
                        { id: '.ban', title: '🚫 Ban User', description: 'Ban user from group' },
                        { id: '.warn', title: '⚠️ Warn User', description: 'Give warning to user' },
                        { id: '.promote', title: '⬆️ Promote', description: 'Make user admin' },
                        { id: '.demote', title: '⬇️ Demote', description: 'Remove admin rights' }
                    ]
                },
                {
                    title: '⚙️ Group Settings',
                    rows: [
                        { id: '.antilink', title: '🔗 Anti-Link', description: 'Toggle link protection' },
                        { id: '.antidelete', title: '🗑️ Anti-Delete', description: 'Toggle delete protection' },
                        { id: '.welcome', title: '👋 Welcome Message', description: 'Toggle welcome messages' },
                        { id: '.lockdown', title: '🔒 Lockdown', description: 'Lock group settings' }
                    ]
                },
                {
                    title: '📢 Announcements',
                    rows: [
                        { id: '.tagall', title: '📣 Tag All', description: 'Mention all members' },
                        { id: '.hidetag', title: '👻 Hide Tag', description: 'Hidden mention' },
                        { id: '.newsletter', title: '📰 Newsletter', description: 'Send newsletter' }
                    ]
                }
            ]
        },
        it: {
            title: '👮 MENU ADMIN\n\nSeleziona un\'azione:',
            button: 'Azioni Admin',
            sections: [
                {
                    title: '👥 Gestione Membri',
                    rows: [
                        { id: '.kick', title: '👢 Espelli Utente', description: 'Rimuovi utente dal gruppo' },
                        { id: '.ban', title: '🚫 Banna Utente', description: 'Banna utente dal gruppo' },
                        { id: '.warn', title: '⚠️ Avverti Utente', description: 'Dai avvertimento all\'utente' },
                        { id: '.promote', title: '⬆️ Promuovi', description: 'Rendi utente admin' },
                        { id: '.demote', title: '⬇️ Degrada', description: 'Rimuovi diritti admin' }
                    ]
                },
                {
                    title: '⚙️ Impostazioni Gruppo',
                    rows: [
                        { id: '.antilink', title: '🔗 Anti-Link', description: 'Attiva protezione link' },
                        { id: '.antidelete', title: '🗑️ Anti-Cancellazione', description: 'Attiva protezione cancellazione' },
                        { id: '.welcome', title: '👋 Messaggio Benvenuto', description: 'Attiva messaggi benvenuto' },
                        { id: '.lockdown', title: '🔒 Blocco', description: 'Blocca impostazioni gruppo' }
                    ]
                },
                {
                    title: '📢 Annunci',
                    rows: [
                        { id: '.tagall', title: '📣 Tagga Tutti', description: 'Menziona tutti i membri' },
                        { id: '.hidetag', title: '👻 Tag Nascosto', description: 'Menzione nascosta' },
                        { id: '.newsletter', title: '📰 Newsletter', description: 'Invia newsletter' }
                    ]
                }
            ]
        }
    };
    
    const t = translations[language] || translations.en;
    return createListMenu(t.title, t.button, t.sections);
}

// Main menu
export function createMainMenu(language = 'en') {
    const translations = {
        en: {
            title: '🤖 BOT MENU',
            buttons: [
                { id: '.games', text: '🎮 Games' },
                { id: '.economy', text: '💰 Economy' },
                { id: '.help', text: '❓ Help' }
            ],
            footer: 'Choose a category'
        },
        it: {
            title: '🤖 MENU BOT',
            buttons: [
                { id: '.games', text: '🎮 Giochi' },
                { id: '.economy', text: '💰 Economia' },
                { id: '.help', text: '❓ Aiuto' }
            ],
            footer: 'Scegli una categoria'
        }
    };
    
    const t = translations[language] || translations.en;
    return createButtonMenu(t.title, t.buttons, t.footer);
}

logger.info('Interactive menu system initialized');

export default {
    createButtonMenu,
    createListMenu,
    createGamesMenu,
    createEconomyMenu,
    createAdminMenu,
    createMainMenu
};
