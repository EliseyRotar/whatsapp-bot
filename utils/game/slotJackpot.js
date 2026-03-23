import fs from 'fs';
import path from 'path';
import lockfile from 'proper-lockfile';

const dataDir = './data';
const jackpotFile = path.join(dataDir, 'slotJackpot.json');
const SEED_AMOUNT = 50000; // Minimum jackpot seed

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Execute operation with file lock (prevents concurrent jackpot wins)
async function withLock(operation) {
    let release;
    try {
        // Acquire lock (wait up to 5 seconds)
        release = await lockfile.lock(jackpotFile, {
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
        console.error('[JACKPOT] Lock error:', error.message);
        throw error;
    } finally {
        // Always release lock
        if (release) {
            try {
                await release();
            } catch (e) {
                console.error('[JACKPOT] Error releasing lock:', e.message);
            }
        }
    }
}

// Load jackpot data (internal, assumes lock is held)
function loadJackpotUnsafe() {
    try {
        if (fs.existsSync(jackpotFile)) {
            const data = fs.readFileSync(jackpotFile, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('[JACKPOT] Error loading jackpot:', error.message);
    }
    return { amount: SEED_AMOUNT, lastWinner: null, lastWinDate: null, totalWins: 0 };
}

// Save jackpot data with atomic write (internal, assumes lock is held)
function saveJackpotUnsafe(jackpot) {
    try {
        const tempFile = `${jackpotFile}.tmp`;
        fs.writeFileSync(tempFile, JSON.stringify(jackpot, null, 2));
        fs.renameSync(tempFile, jackpotFile); // Atomic rename
    } catch (error) {
        console.error('[JACKPOT] Error saving jackpot:', error.message);
        throw error;
    }
}

// Get current jackpot amount (thread-safe)
export async function getJackpotAmount() {
    return await withLock(() => {
        const jackpot = loadJackpotUnsafe();
        return jackpot.amount;
    });
}

// Contribute to jackpot (2% of losses) (thread-safe)
export async function contributeToJackpot(lossAmount) {
    return await withLock(() => {
        const jackpot = loadJackpotUnsafe();
        const contribution = Math.floor(lossAmount * 0.02);
        jackpot.amount += contribution;
        saveJackpotUnsafe(jackpot);
        return contribution;
    });
}

// Win jackpot (thread-safe)
export async function winJackpot(userJid, userName) {
    return await withLock(() => {
        const jackpot = loadJackpotUnsafe();
        const winAmount = jackpot.amount;
        
        // Reset to seed amount
        jackpot.amount = SEED_AMOUNT;
        jackpot.lastWinner = userName;
        jackpot.lastWinDate = new Date().toISOString();
        jackpot.totalWins++;
        
        saveJackpotUnsafe(jackpot);
        return winAmount;
    });
}

// Get jackpot info (thread-safe)
export async function getJackpotInfo() {
    return await withLock(() => {
        return loadJackpotUnsafe();
    });
}

// Reset jackpot (admin only) (thread-safe)
export async function resetJackpot() {
    return await withLock(() => {
        const jackpot = {
            amount: SEED_AMOUNT,
            lastWinner: null,
            lastWinDate: null,
            totalWins: 0
        };
        saveJackpotUnsafe(jackpot);
        return jackpot;
    });
}
