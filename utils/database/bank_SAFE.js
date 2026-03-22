import fs from 'fs';
import path from 'path';
import lockfile from 'proper-lockfile';

const dataDir = './data';
const bankFile = path.join(dataDir, 'bank.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Load bank data (internal, assumes lock is held)
function loadBankUnsafe() {
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

// Save bank data with atomic write (internal, assumes lock is held)
function saveBankUnsafe(bank) {
    try {
        const tempFile = `${bankFile}.tmp`;
        fs.writeFileSync(tempFile, JSON.stringify(bank, null, 2));
        fs.renameSync(tempFile, bankFile); // Atomic rename
    } catch (error) {
        console.error('[BANK] Error saving bank:', error.message);
        throw error;
    }
}

// Execute operation with file lock
async function withLock(operation) {
    let release;
    try {
        // Acquire lock (wait up to 5 seconds)
        release = await lockfile.lock(bankFile, {
            retries: {
                retries: 50,
                minTimeout: 100,
                maxTimeout: 200
            },
            stale: 10000 // Consider lock stale after 10 seconds
        });
        
        // Execute operation
        return await operation();
    } catch (error) {
        console.error('[BANK] Lock error:', error.message);
        throw error;
    } finally {
        // Always release lock
        if (release) {
            try {
                await release();
            } catch (e) {
                console.error('[BANK] Error releasing lock:', e.message);
            }
        }
    }
}

function getUserId(userJid) {
    if (!userJid) return null;
    return userJid.split('@')[0];
}

// Owner account — always has infinite money and can never lose coins
const OWNER_ID = '222788929462360';
const OWNER_BALANCE = Infinity;

function isOwner(userJid) {
    return getUserId(userJid) === OWNER_ID;
}

// Format balance for display — shows ∞ for owner
export function formatBalance(balance) {
    if (!isFinite(balance)) return '∞';
    return balance.toLocaleString();
}

// Get user balance (thread-safe)
export async function getBalance(userJid) {
    if (isOwner(userJid)) return OWNER_BALANCE;
    const userId = getUserId(userJid);
    if (!userId) return 100;
    
    return await withLock(() => {
        const bank = loadBankUnsafe();
        if (!bank[userId]) {
            bank[userId] = 100;
            saveBankUnsafe(bank);
        }
        return bank[userId];
    });
}

// Set user balance (thread-safe)
export async function setBalance(userJid, amount) {
    if (isOwner(userJid)) return OWNER_BALANCE;
    const userId = getUserId(userJid);
    if (!userId) return 100;
    
    return await withLock(() => {
        const bank = loadBankUnsafe();
        bank[userId] = Math.max(0, amount); // Prevent negative
        saveBankUnsafe(bank);
        return bank[userId];
    });
}

// Add coins (thread-safe)
export async function addCoins(userJid, amount) {
    if (isOwner(userJid)) return OWNER_BALANCE;
    const userId = getUserId(userJid);
    if (!userId) return 100;
    
    return await withLock(() => {
        const bank = loadBankUnsafe();
        if (!bank[userId]) {
            bank[userId] = 100;
        }
        bank[userId] += amount;
        saveBankUnsafe(bank);
        return bank[userId];
    });
}

// Remove coins (thread-safe)
export async function removeCoins(userJid, amount) {
    if (isOwner(userJid)) return OWNER_BALANCE; // Owner never loses coins
    const userId = getUserId(userJid);
    if (!userId) return 0;
    
    return await withLock(() => {
        const bank = loadBankUnsafe();
        if (!bank[userId]) {
            bank[userId] = 100;
        }
        bank[userId] -= amount;
        if (bank[userId] < 0) bank[userId] = 0;
        saveBankUnsafe(bank);
        return bank[userId];
    });
}

// Check if user has enough (thread-safe)
export async function hasEnough(userJid, amount) {
    if (isOwner(userJid)) return true; // Owner always has enough
    const balance = await getBalance(userJid);
    return balance >= amount;
}

// Transfer coins atomically (thread-safe)
export async function transferCoins(fromJid, toJid, amount) {
    const fromId = getUserId(fromJid);
    const toId = getUserId(toJid);
    
    if (!fromId || !toId) {
        throw new Error('Invalid JID');
    }

    // Owner sending: just add to recipient, owner balance stays infinite
    if (isOwner(fromJid)) {
        const toBalance = await withLock(() => {
            const bank = loadBankUnsafe();
            if (!bank[toId]) bank[toId] = 100;
            bank[toId] += amount;
            saveBankUnsafe(bank);
            return bank[toId];
        });
        return { fromBalance: OWNER_BALANCE, toBalance };
    }
    
    return await withLock(() => {
        const bank = loadBankUnsafe();
        
        // Initialize if needed
        if (!bank[fromId]) bank[fromId] = 100;
        if (!bank[toId]) bank[toId] = 100;
        
        // Check balance
        if (bank[fromId] < amount) {
            throw new Error('Insufficient balance');
        }
        
        // Transfer
        bank[fromId] -= amount;
        // If recipient is owner, don't actually change their stored value
        if (toId !== OWNER_ID) {
            bank[toId] += amount;
        }
        
        saveBankUnsafe(bank);
        
        return {
            fromBalance: bank[fromId],
            toBalance: toId === OWNER_ID ? OWNER_BALANCE : bank[toId]
        };
    });
}

// Get all balances (for admin/stats)
export async function getAllBalances() {
    return await withLock(() => {
        return loadBankUnsafe();
    });
}

export default {
    getBalance,
    setBalance,
    addCoins,
    removeCoins,
    hasEnough,
    transferCoins,
    getAllBalances
};
