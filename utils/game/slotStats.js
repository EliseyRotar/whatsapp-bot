import fs from 'fs';
import path from 'path';

const dataDir = './data';
const statsFile = path.join(dataDir, 'slotStats.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Load stats data
function loadStats() {
    try {
        if (fs.existsSync(statsFile)) {
            const data = fs.readFileSync(statsFile, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('[SLOT-STATS] Error loading stats:', error.message);
    }
    return {};
}

// Save stats data
function saveStats(stats) {
    try {
        fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));
    } catch (error) {
        console.error('[SLOT-STATS] Error saving stats:', error.message);
    }
}

// Get user stats
export function getStats(userJid) {
    const stats = loadStats();
    if (!stats[userJid]) {
        stats[userJid] = {
            totalSpins: 0,
            wins: 0,
            losses: 0,
            totalWagered: 0,
            totalWon: 0,
            biggestWin: 0,
            biggestMultiplier: 0,
            jackpotsWon: 0,
            freeSpinsTriggered: 0,
            currentStreak: 0,
            bestStreak: 0
        };
        saveStats(stats);
    }
    return stats[userJid];
}

// Record a spin
export function recordSpin(userJid, bet, winAmount, multiplier, isJackpot = false, isFreeSpins = false) {
    const stats = loadStats();
    if (!stats[userJid]) {
        stats[userJid] = getStats(userJid);
    }
    
    stats[userJid].totalSpins++;
    stats[userJid].totalWagered += bet;
    
    if (winAmount > 0) {
        stats[userJid].wins++;
        stats[userJid].totalWon += winAmount;
        stats[userJid].currentStreak++;
        
        if (stats[userJid].currentStreak > stats[userJid].bestStreak) {
            stats[userJid].bestStreak = stats[userJid].currentStreak;
        }
        
        if (winAmount > stats[userJid].biggestWin) {
            stats[userJid].biggestWin = winAmount;
        }
        
        if (multiplier > stats[userJid].biggestMultiplier) {
            stats[userJid].biggestMultiplier = multiplier;
        }
        
        if (isJackpot) {
            stats[userJid].jackpotsWon++;
        }
    } else {
        stats[userJid].losses++;
        stats[userJid].currentStreak = 0;
    }
    
    if (isFreeSpins) {
        stats[userJid].freeSpinsTriggered++;
    }
    
    saveStats(stats);
}

// Calculate win rate
export function getWinRate(userJid) {
    const stats = getStats(userJid);
    if (stats.totalSpins === 0) return 0;
    return ((stats.wins / stats.totalSpins) * 100).toFixed(1);
}

// Calculate net profit
export function getNetProfit(userJid) {
    const stats = getStats(userJid);
    return stats.totalWon - stats.totalWagered;
}

// Get current streak
export function getCurrentStreak(userJid) {
    const stats = getStats(userJid);
    return stats.currentStreak;
}

// Reset current streak
export function resetStreak(userJid) {
    const stats = loadStats();
    if (stats[userJid]) {
        stats[userJid].currentStreak = 0;
        saveStats(stats);
    }
}
