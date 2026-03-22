import fs from 'fs';
import path from 'path';

const dataDir = './data';
const jackpotFile = path.join(dataDir, 'slotJackpot.json');
const SEED_AMOUNT = 50000; // Minimum jackpot seed

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Load jackpot data
function loadJackpot() {
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

// Save jackpot data
function saveJackpot(jackpot) {
    try {
        fs.writeFileSync(jackpotFile, JSON.stringify(jackpot, null, 2));
    } catch (error) {
        console.error('[JACKPOT] Error saving jackpot:', error.message);
    }
}

// Get current jackpot amount
export function getJackpotAmount() {
    const jackpot = loadJackpot();
    return jackpot.amount;
}

// Contribute to jackpot (2% of losses)
export function contributeToJackpot(lossAmount) {
    const jackpot = loadJackpot();
    const contribution = Math.floor(lossAmount * 0.02);
    jackpot.amount += contribution;
    saveJackpot(jackpot);
    return contribution;
}

// Win jackpot
export function winJackpot(userJid, userName) {
    const jackpot = loadJackpot();
    const winAmount = jackpot.amount;
    
    // Reset to seed amount
    jackpot.amount = SEED_AMOUNT;
    jackpot.lastWinner = userName;
    jackpot.lastWinDate = new Date().toISOString();
    jackpot.totalWins++;
    
    saveJackpot(jackpot);
    return winAmount;
}

// Get jackpot info
export function getJackpotInfo() {
    return loadJackpot();
}

// Reset jackpot (admin only)
export function resetJackpot() {
    const jackpot = {
        amount: SEED_AMOUNT,
        lastWinner: null,
        lastWinDate: null,
        totalWins: 0
    };
    saveJackpot(jackpot);
    return jackpot;
}
