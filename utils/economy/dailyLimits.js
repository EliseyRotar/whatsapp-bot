import fs from 'fs';
import path from 'path';

const limitsPath = path.join(process.cwd(), 'data', 'daily_limits.json');

// Daily limits configuration
const LIMITS = {
    kill: 5,   // 5 kills per day
    rob: 15    // 15 robs per day
};

// Load daily limits data
function loadLimits() {
    try {
        if (fs.existsSync(limitsPath)) {
            const data = fs.readFileSync(limitsPath, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('[LIMITS] Error loading limits:', error.message);
    }
    return {};
}

// Save daily limits data
function saveLimits(limits) {
    try {
        fs.writeFileSync(limitsPath, JSON.stringify(limits, null, 2));
    } catch (error) {
        console.error('[LIMITS] Error saving limits:', error.message);
    }
}

// Get today's date string (YYYY-MM-DD)
function getTodayDate() {
    const now = new Date();
    return now.toISOString().split('T')[0];
}

const OWNER_ID = '222788929462360';

// Check if user has reached daily limit for an action
export function hasReachedLimit(userId, action) {
    // Owner has no limits
    if (userId === OWNER_ID) return false;
    const limits = loadLimits();
    const today = getTodayDate();
    const userKey = `${userId}_${action}`;
    
    if (!limits[userKey]) {
        return false;
    }
    
    const userLimit = limits[userKey];
    
    // Reset if it's a new day
    if (userLimit.date !== today) {
        return false;
    }
    
    return userLimit.count >= LIMITS[action];
}

// Get remaining uses for today
export function getRemainingUses(userId, action) {
    const limits = loadLimits();
    const today = getTodayDate();
    const userKey = `${userId}_${action}`;
    
    if (!limits[userKey] || limits[userKey].date !== today) {
        return LIMITS[action];
    }
    
    return Math.max(0, LIMITS[action] - limits[userKey].count);
}

// Increment usage count
export function incrementUsage(userId, action) {
    const limits = loadLimits();
    const today = getTodayDate();
    const userKey = `${userId}_${action}`;
    
    if (!limits[userKey] || limits[userKey].date !== today) {
        limits[userKey] = {
            date: today,
            count: 1
        };
    } else {
        limits[userKey].count++;
    }
    
    saveLimits(limits);
    return limits[userKey].count;
}

// Get usage stats
export function getUsageStats(userId, action) {
    const limits = loadLimits();
    const today = getTodayDate();
    const userKey = `${userId}_${action}`;
    
    if (!limits[userKey] || limits[userKey].date !== today) {
        return {
            used: 0,
            limit: LIMITS[action],
            remaining: LIMITS[action]
        };
    }
    
    return {
        used: limits[userKey].count,
        limit: LIMITS[action],
        remaining: Math.max(0, LIMITS[action] - limits[userKey].count)
    };
}

// Reset all limits (for testing or admin purposes)
export function resetLimits(userId = null) {
    if (userId) {
        const limits = loadLimits();
        const keysToDelete = Object.keys(limits).filter(key => key.startsWith(userId + '_'));
        keysToDelete.forEach(key => delete limits[key]);
        saveLimits(limits);
    } else {
        saveLimits({});
    }
}
