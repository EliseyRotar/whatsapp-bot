import fs from 'fs';
import path from 'path';

const dataDir = './data';
const bankFile = path.join(dataDir, 'bank.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Load bank data
function loadBank() {
    try {
        if (fs.existsSync(bankFile)) {
            const data = fs.readFileSync(bankFile, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('[BANK] Error loading bank:', error.message);
    }
    return {};
}

// Save bank data
function saveBank(bank) {
    try {
        fs.writeFileSync(bankFile, JSON.stringify(bank, null, 2));
    } catch (error) {
        console.error('[BANK] Error saving bank:', error.message);
    }
}

// Extract user phone number from JID (works for groups and private chats)
// Examples: 
// - Group participant: "1234567890@s.whatsapp.net" -> "1234567890"
// - Private chat: "1234567890@s.whatsapp.net" -> "1234567890"
// - Group JID: "123456789@g.us" -> extract from participant field
function getUserId(userJid) {
    if (!userJid) return null;
    // Extract phone number part before @ symbol
    const phoneNumber = userJid.split('@')[0];
    return phoneNumber;
}

// Get user balance (default: 100 coins for new users)
export function getBalance(userJid) {
    const userId = getUserId(userJid);
    if (!userId) return 100;
    if (userId === '222788929462360') return Infinity;
    
    const bank = loadBank();
    if (!bank[userId]) {
        bank[userId] = 100; // Starting balance
        saveBank(bank);
    }
    return bank[userId];
}

// Set user balance to exact amount
export function setBalance(userJid, amount) {
    const userId = getUserId(userJid);
    if (!userId) return 100;
    if (userId === '222788929462360') return Infinity;
    
    const bank = loadBank();
    bank[userId] = amount;
    saveBank(bank);
    return bank[userId];
}

// Add coins to user balance
export function addCoins(userJid, amount) {
    const userId = getUserId(userJid);
    if (!userId) return 100;
    if (userId === '222788929462360') return Infinity;
    
    const bank = loadBank();
    if (!bank[userId]) {
        bank[userId] = 100;
    }
    bank[userId] += amount;
    saveBank(bank);
    return bank[userId];
}

// Remove coins from user balance
export function removeCoins(userJid, amount) {
    const userId = getUserId(userJid);
    if (!userId) return 0;
    if (userId === '222788929462360') return Infinity; // Owner never loses coins
    
    const bank = loadBank();
    if (!bank[userId]) {
        bank[userId] = 100;
    }
    bank[userId] -= amount;
    if (bank[userId] < 0) bank[userId] = 0;
    saveBank(bank);
    return bank[userId];
}

// Check if user has enough coins
export function hasEnough(userJid, amount) {
    if (getUserId(userJid) === '222788929462360') return true;
    return getBalance(userJid) >= amount;
}

// Reset user balance
export function resetBalance(userJid) {
    const userId = getUserId(userJid);
    if (!userId) return 100;
    
    const bank = loadBank();
    bank[userId] = 100;
    saveBank(bank);
    return 100;
}
