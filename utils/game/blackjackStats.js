import fs from 'fs';
import path from 'path';

const dataDir = './data';
const statsFile = path.join(dataDir, 'blackjackStats.json');

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
        console.error('[STATS] Error loading stats:', error.message);
    }
    return {};
}

// Save stats data
function saveStats(stats) {
    try {
        fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));
    } catch (error) {
        console.error('[STATS] Error saving stats:', error.message);
    }
}

// Get user stats
export function getStats(userJid) {
    const stats = loadStats();
    if (!stats[userJid]) {
        stats[userJid] = {
            gamesPlayed: 0,
            wins: 0,
            losses: 0,
            pushes: 0,
            blackjacks: 0,
            busts: 0,
            surrenders: 0,
            totalWagered: 0,
            totalWon: 0,
            totalLost: 0
        };
        saveStats(stats);
    }
    return stats[userJid];
}

// Record a win
export function recordWin(userJid, amount, isBlackjack = false) {
    const stats = loadStats();
    if (!stats[userJid]) {
        stats[userJid] = getStats(userJid);
    }
    
    stats[userJid].gamesPlayed++;
    stats[userJid].wins++;
    stats[userJid].totalWon += amount;
    
    if (isBlackjack) {
        stats[userJid].blackjacks++;
    }
    
    saveStats(stats);
}

// Record a loss
export function recordLoss(userJid, amount, isBust = false) {
    const stats = loadStats();
    if (!stats[userJid]) {
        stats[userJid] = getStats(userJid);
    }
    
    stats[userJid].gamesPlayed++;
    stats[userJid].losses++;
    stats[userJid].totalLost += amount;
    
    if (isBust) {
        stats[userJid].busts++;
    }
    
    saveStats(stats);
}

// Record a push (tie)
export function recordPush(userJid) {
    const stats = loadStats();
    if (!stats[userJid]) {
        stats[userJid] = getStats(userJid);
    }
    
    stats[userJid].gamesPlayed++;
    stats[userJid].pushes++;
    
    saveStats(stats);
}

// Record a surrender
export function recordSurrender(userJid, amount) {
    const stats = loadStats();
    if (!stats[userJid]) {
        stats[userJid] = getStats(userJid);
    }
    
    stats[userJid].gamesPlayed++;
    stats[userJid].surrenders++;
    stats[userJid].totalLost += amount;
    
    saveStats(stats);
}

// Record wager
export function recordWager(userJid, amount) {
    const stats = loadStats();
    if (!stats[userJid]) {
        stats[userJid] = getStats(userJid);
    }
    
    stats[userJid].totalWagered += amount;
    
    saveStats(stats);
}

// Calculate win rate
export function getWinRate(userJid) {
    const stats = getStats(userJid);
    if (stats.gamesPlayed === 0) return 0;
    return ((stats.wins / stats.gamesPlayed) * 100).toFixed(1);
}

// Calculate net profit
export function getNetProfit(userJid) {
    const stats = getStats(userJid);
    return stats.totalWon - stats.totalLost;
}

// Reset stats
export function resetStats(userJid) {
    const stats = loadStats();
    stats[userJid] = {
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        pushes: 0,
        blackjacks: 0,
        busts: 0,
        surrenders: 0,
        totalWagered: 0,
        totalWon: 0,
        totalLost: 0
    };
    saveStats(stats);
}
