import fs from 'fs';
import path from 'path';

const dataDir = './data';
const inventoryFile = path.join(dataDir, 'shop_inventory.json');

// Load user inventory
export function loadInventory(userId) {
    try {
        if (!fs.existsSync(inventoryFile)) {
            return {};
        }
        
        const data = JSON.parse(fs.readFileSync(inventoryFile, 'utf8'));
        return data[userId] || {};
    } catch (error) {
        console.error('[SHOP] Error loading inventory:', error.message);
        return {};
    }
}

// Save user inventory
export function saveInventory(userId, inventory) {
    try {
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        
        let allInventories = {};
        if (fs.existsSync(inventoryFile)) {
            allInventories = JSON.parse(fs.readFileSync(inventoryFile, 'utf8'));
        }
        
        allInventories[userId] = inventory;
        fs.writeFileSync(inventoryFile, JSON.stringify(allInventories, null, 2));
        return true;
    } catch (error) {
        console.error('[SHOP] Error saving inventory:', error.message);
        return false;
    }
}

// Check if item is active
export function isItemActive(item) {
    if (!item.purchaseDate) return false;
    const purchaseDate = new Date(item.purchaseDate);
    const expiryDate = new Date(purchaseDate.getTime() + (item.duration * 24 * 60 * 60 * 1000));
    return expiryDate > new Date();
}

// Get active multiplier
export function getCoinMultiplier(userId) {
    const inventory = loadInventory(userId);
    let multiplier = 1;
    
    if (inventory.double_coins && isItemActive(inventory.double_coins)) {
        multiplier = 2;
    }
    if (inventory.triple_coins && isItemActive(inventory.triple_coins)) {
        multiplier = 3;
    }
    if (inventory.mega_multiplier && isItemActive(inventory.mega_multiplier)) {
        multiplier = 3; // Reduced from 5x to 3x for balance
    }
    
    return multiplier;
}

// Get luck boost
export function getLuckBoost(userId) {
    const inventory = loadInventory(userId);
    let boost = 0;
    
    if (inventory.lucky_charm && isItemActive(inventory.lucky_charm)) {
        boost += 10;
    }
    if (inventory.mega_luck && isItemActive(inventory.mega_luck)) {
        boost += 25;
    }
    if (inventory.ultra_luck && isItemActive(inventory.ultra_luck)) {
        boost += 50;
    }
    
    return Math.min(boost, 50); // Max 50% luck boost (reduced from 75%)
}

// Check if user has protection
export function hasProtection(userId, type) {
    const inventory = loadInventory(userId);
    
    if (type === 'rob' && inventory.anti_rob && isItemActive(inventory.anti_rob)) {
        return true;
    }
    if (type === 'loss' && inventory.insurance && isItemActive(inventory.insurance)) {
        return true;
    }
    
    return false;
}

// Get user badge
export function getUserBadge(userId) {
    const inventory = loadInventory(userId);
    
    if (inventory.god && isItemActive(inventory.god)) return '⚡';
    if (inventory.legend && isItemActive(inventory.legend)) return '🏆';
    if (inventory.premium && isItemActive(inventory.premium)) return '💎';
    if (inventory.vip && isItemActive(inventory.vip)) return '👑';
    
    return '';
}

// Get daily bonus multiplier
export function getDailyBonusMultiplier(userId) {
    const inventory = loadInventory(userId);
    let multiplier = 1;
    
    if (inventory.daily_booster && isItemActive(inventory.daily_booster)) {
        multiplier = 2;
    }
    if (inventory.mega_daily && isItemActive(inventory.mega_daily)) {
        multiplier = 3;
    }
    
    return multiplier;
}

// Check if user has XP boost
export function getXPBoost(userId) {
    const inventory = loadInventory(userId);
    let boost = 0;
    
    if (inventory.xp_boost && isItemActive(inventory.xp_boost)) {
        boost += 50;
    }
    if (inventory.mega_xp && isItemActive(inventory.mega_xp)) {
        boost += 100;
    }
    
    return boost;
}

// Get all active items for a user
export function getActiveItems(userId) {
    const inventory = loadInventory(userId);
    const active = [];
    
    for (const [itemId, itemData] of Object.entries(inventory)) {
        if (isItemActive(itemData)) {
            active.push(itemId);
        }
    }
    
    return active;
}

// Apply coin multiplier to winnings
export function applyMultiplier(userId, amount) {
    const multiplier = getCoinMultiplier(userId);
    return Math.floor(amount * multiplier);
}
