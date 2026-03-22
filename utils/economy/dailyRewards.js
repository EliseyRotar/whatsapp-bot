import fs from 'fs';
import path from 'path';

const dataDir = './data';
const dailyFile = path.join(dataDir, 'daily_claims.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Load daily claims data
function loadDailyClaims() {
    try {
        if (fs.existsSync(dailyFile)) {
            const data = fs.readFileSync(dailyFile, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('[DAILY] Error loading daily claims:', error.message);
    }
    return {};
}

// Save daily claims data
function saveDailyClaims(claims) {
    try {
        fs.writeFileSync(dailyFile, JSON.stringify(claims, null, 2));
    } catch (error) {
        console.error('[DAILY] Error saving daily claims:', error.message);
    }
}

// Check if user can claim daily reward
export function canClaimDaily(userJid) {
    const claims = loadDailyClaims();
    const userData = claims[userJid];
    
    if (!userData) return true; // First time claiming
    
    const lastClaim = userData.lastClaim;
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    return (now - lastClaim) >= oneDayMs;
}

// Get time until next claim
export function getTimeUntilNextClaim(userJid) {
    const claims = loadDailyClaims();
    const userData = claims[userJid];
    
    if (!userData) return 0;
    
    const lastClaim = userData.lastClaim;
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const timeSinceLastClaim = now - lastClaim;
    
    if (timeSinceLastClaim >= oneDayMs) return 0;
    
    return oneDayMs - timeSinceLastClaim;
}

// Claim daily reward
export function claimDaily(userJid) {
    const claims = loadDailyClaims();
    
    if (!claims[userJid]) {
        claims[userJid] = {
            lastClaim: 0,
            streak: 0,
            totalClaims: 0
        };
    }
    
    const userData = claims[userJid];
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const twoDaysMs = 2 * oneDayMs;
    
    // Check if can claim
    if (!canClaimDaily(userJid)) {
        return { success: false, reason: 'too_soon' };
    }
    
    // Check streak
    const timeSinceLastClaim = now - userData.lastClaim;
    if (timeSinceLastClaim < twoDaysMs && userData.lastClaim > 0) {
        // Maintain streak
        userData.streak += 1;
    } else if (userData.lastClaim > 0) {
        // Streak broken
        userData.streak = 1;
    } else {
        // First claim
        userData.streak = 1;
    }
    
    userData.lastClaim = now;
    userData.totalClaims += 1;
    
    saveDailyClaims(claims);
    
    // Calculate reward based on streak
    let baseReward = 100;
    let streakBonus = Math.min(userData.streak * 10, 200); // Max 200 bonus
    let totalReward = baseReward + streakBonus;
    
    return {
        success: true,
        reward: totalReward,
        streak: userData.streak,
        totalClaims: userData.totalClaims
    };
}

// Get user daily stats
export function getDailyStats(userJid) {
    const claims = loadDailyClaims();
    const userData = claims[userJid];
    
    if (!userData) {
        return {
            streak: 0,
            totalClaims: 0,
            lastClaim: 0
        };
    }
    
    return userData;
}
