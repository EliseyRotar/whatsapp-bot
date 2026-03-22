import fs from 'fs';
import path from 'path';
import { loadInventory, saveInventory, isItemActive } from './shopSystem.js';

const dataDir = './data';
const shieldsFile = path.join(dataDir, 'shields.json');

// Shield types configuration
export const SHIELD_TYPES = {
    shield_small: {
        id: 'shield_small',
        protection: 25,
        maxUses: 2, // Can block 2 kills
        duration: 24, // hours
        emoji: '🔵'
    },
    shield_large: {
        id: 'shield_large',
        protection: 50,
        maxUses: 3, // Can block 3 kills
        duration: 24, // hours
        emoji: '💙'
    },
    chug_jug: {
        id: 'chug_jug',
        protection: 100,
        maxUses: 1, // Blocks 1 kill completely
        duration: 48, // hours
        emoji: '🌟'
    }
};

// Load shields data
function loadShields() {
    try {
        if (!fs.existsSync(shieldsFile)) {
            return {};
        }
        const data = fs.readFileSync(shieldsFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('[SHIELD] Error loading shields:', error.message);
        return {};
    }
}

// Save shields data
function saveShields(shields) {
    try {
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        fs.writeFileSync(shieldsFile, JSON.stringify(shields, null, 2));
    } catch (error) {
        console.error('[SHIELD] Error saving shields:', error.message);
    }
}

// Check if shield is still active (not expired)
function isShieldActive(shield) {
    if (!shield.activatedAt) return false;
    
    const activatedTime = new Date(shield.activatedAt).getTime();
    const now = Date.now();
    const durationMs = shield.duration * 60 * 60 * 1000; // Convert hours to ms
    
    return (now - activatedTime) < durationMs && shield.usesRemaining > 0;
}

// Get user's active shield
export function getUserShield(userId) {
    const shields = loadShields();
    const userShield = shields[userId];
    
    if (!userShield) return null;
    
    // Check if shield is still active
    if (!isShieldActive(userShield)) {
        // Shield expired or used up, remove it
        delete shields[userId];
        saveShields(shields);
        return null;
    }
    
    return userShield;
}

// Activate a shield for a user
export function activateShield(userId, shieldType) {
    const shieldConfig = SHIELD_TYPES[shieldType];
    if (!shieldConfig) {
        console.error('[SHIELD] Invalid shield type:', shieldType);
        return false;
    }
    
    const shields = loadShields();
    
    // Check if user already has an active shield
    if (shields[userId] && isShieldActive(shields[userId])) {
        return { success: false, reason: 'already_active' };
    }
    
    // Activate new shield
    shields[userId] = {
        type: shieldType,
        protection: shieldConfig.protection,
        maxUses: shieldConfig.maxUses,
        usesRemaining: shieldConfig.maxUses,
        duration: shieldConfig.duration,
        activatedAt: new Date().toISOString(),
        emoji: shieldConfig.emoji
    };
    
    saveShields(shields);
    console.log(`[SHIELD] Activated ${shieldType} for user ${userId}`);
    return { success: true };
}

// Check if shield blocks an attack
export function checkShieldProtection(userId) {
    const shield = getUserShield(userId);
    
    if (!shield) {
        return { blocked: false, shield: null };
    }
    
    // Calculate if shield blocks the attack
    const roll = Math.random() * 100;
    const blocked = roll < shield.protection;
    
    console.log(`[SHIELD] Protection check for ${userId}: roll=${roll.toFixed(1)}, protection=${shield.protection}%, blocked=${blocked}`);
    
    return { blocked, shield };
}

// Consume shield use (reduce uses or break shield)
export function consumeShield(userId, attackBlocked) {
    const shields = loadShields();
    const shield = shields[userId];
    
    if (!shield) return;
    
    if (attackBlocked) {
        // Shield blocked the attack, reduce uses
        shield.usesRemaining--;
        console.log(`[SHIELD] Shield blocked attack for ${userId}. Uses remaining: ${shield.usesRemaining}`);
        
        if (shield.usesRemaining <= 0) {
            // Shield broken
            delete shields[userId];
            console.log(`[SHIELD] Shield broken for ${userId}`);
            saveShields(shields);
            return { broken: true, remaining: 0 };
        }
    } else {
        // Shield failed to block, still reduce durability slightly
        shield.usesRemaining -= 0.5;
        console.log(`[SHIELD] Shield failed to block for ${userId}. Uses remaining: ${shield.usesRemaining}`);
        
        if (shield.usesRemaining <= 0) {
            delete shields[userId];
            console.log(`[SHIELD] Shield broken for ${userId}`);
            saveShields(shields);
            return { broken: true, remaining: 0 };
        }
    }
    
    saveShields(shields);
    return { broken: false, remaining: shield.usesRemaining };
}

// Get shield status for display
export function getShieldStatus(userId) {
    const shield = getUserShield(userId);
    
    if (!shield) {
        return {
            hasShield: false,
            message: 'No active shield'
        };
    }
    
    const activatedTime = new Date(shield.activatedAt).getTime();
    const now = Date.now();
    const durationMs = shield.duration * 60 * 60 * 1000;
    const timeRemaining = durationMs - (now - activatedTime);
    const hoursRemaining = Math.floor(timeRemaining / (60 * 60 * 1000));
    const minutesRemaining = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
    
    return {
        hasShield: true,
        type: shield.type,
        emoji: shield.emoji,
        protection: shield.protection,
        usesRemaining: shield.usesRemaining,
        maxUses: shield.maxUses,
        hoursRemaining,
        minutesRemaining,
        message: `${shield.emoji} ${shield.type.toUpperCase()} - ${shield.protection}% protection - ${shield.usesRemaining}/${shield.maxUses} uses - ${hoursRemaining}h ${minutesRemaining}m remaining`
    };
}

// Remove expired shields (cleanup function)
export function cleanupExpiredShields() {
    const shields = loadShields();
    let cleaned = 0;
    
    for (const [userId, shield] of Object.entries(shields)) {
        if (!isShieldActive(shield)) {
            delete shields[userId];
            cleaned++;
        }
    }
    
    if (cleaned > 0) {
        saveShields(shields);
        console.log(`[SHIELD] Cleaned up ${cleaned} expired shields`);
    }
    
    return cleaned;
}
