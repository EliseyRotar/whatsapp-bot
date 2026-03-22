import fs from 'fs';
import path from 'path';
import { getBalance } from '../database/bank.js';

const dataDir = './data';
const statsFile = path.join(dataDir, 'player_stats.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Load player stats
function loadStats() {
    try {
        if (fs.existsSync(statsFile)) {
            const data = fs.readFileSync(statsFile, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('[LEADERBOARD] Error loading stats:', error.message);
    }
    return {};
}

// Save player stats
function saveStats(stats) {
    try {
        fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));
    } catch (error) {
        console.error('[LEADERBOARD] Error saving stats:', error.message);
    }
}

// Record a game win
export function recordGameWin(userJid, amount = 0) {
    const stats = loadStats();
    
    if (!stats[userJid]) {
        stats[userJid] = {
            wins: 0,
            losses: 0,
            totalWinnings: 0,
            gamesPlayed: 0
        };
    }
    
    stats[userJid].wins += 1;
    stats[userJid].totalWinnings += amount;
    stats[userJid].gamesPlayed += 1;
    
    saveStats(stats);
}

// Record a game loss
export function recordGameLoss(userJid, amount = 0) {
    const stats = loadStats();
    
    if (!stats[userJid]) {
        stats[userJid] = {
            wins: 0,
            losses: 0,
            totalWinnings: 0,
            gamesPlayed: 0
        };
    }
    
    stats[userJid].losses += 1;
    stats[userJid].totalWinnings -= amount;
    stats[userJid].gamesPlayed += 1;
    
    saveStats(stats);
}

// Get top players by balance
export function getTopPlayersByBalance(limit = 10) {
    const bankFile = path.join(dataDir, 'bank.json');
    const OWNER_ID = '222788929462360';
    
    try {
        if (!fs.existsSync(bankFile)) return [];
        
        const bankData = JSON.parse(fs.readFileSync(bankFile, 'utf8'));
        const players = [];
        
        for (const [userJid, balance] of Object.entries(bankData)) {
            const id = userJid.split('@')[0];
            if (id === OWNER_ID) continue; // Will be injected at top
            const properJid = userJid.includes('@') ? userJid : `${userJid}@s.whatsapp.net`;
            players.push({ userJid: properJid, balance });
        }
        
        // Sort by balance descending
        players.sort((a, b) => b.balance - a.balance);
        
        // Always inject owner at position #1 with Infinity balance
        const ownerEntry = { userJid: `${OWNER_ID}@lid`, balance: Infinity };
        const result = [ownerEntry, ...players].slice(0, limit);
        
        return result;
    } catch (error) {
        console.error('[LEADERBOARD] Error getting top players:', error.message);
        return [];
    }
}

// Get top players by wins
export function getTopPlayersByWins(limit = 10) {
    const stats = loadStats();
    const players = [];
    
    for (const [userJid, data] of Object.entries(stats)) {
        // Ensure JID has proper format for mentions
        const properJid = userJid.includes('@') ? userJid : `${userJid}@s.whatsapp.net`;
        players.push({
            userJid: properJid,
            wins: data.wins,
            losses: data.losses,
            winRate: data.gamesPlayed > 0 ? (data.wins / data.gamesPlayed * 100).toFixed(1) : 0
        });
    }
    
    // Sort by wins descending
    players.sort((a, b) => b.wins - a.wins);
    
    return players.slice(0, limit);
}

// Get top players by total winnings
export function getTopPlayersByWinnings(limit = 10) {
    const stats = loadStats();
    const players = [];
    
    for (const [userJid, data] of Object.entries(stats)) {
        // Ensure JID has proper format for mentions
        const properJid = userJid.includes('@') ? userJid : `${userJid}@s.whatsapp.net`;
        players.push({
            userJid: properJid,
            totalWinnings: data.totalWinnings
        });
    }
    
    // Sort by total winnings descending
    players.sort((a, b) => b.totalWinnings - a.totalWinnings);
    
    return players.slice(0, limit);
}

// Get player stats
export function getPlayerStats(userJid) {
    const stats = loadStats();
    
    if (!stats[userJid]) {
        return {
            wins: 0,
            losses: 0,
            totalWinnings: 0,
            gamesPlayed: 0,
            winRate: 0
        };
    }
    
    const data = stats[userJid];
    return {
        ...data,
        winRate: data.gamesPlayed > 0 ? (data.wins / data.gamesPlayed * 100).toFixed(1) : 0
    };
}
