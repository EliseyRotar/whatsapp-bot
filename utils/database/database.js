import fs from 'fs';

const DB_FILE = './data/groups.json';
const WARNINGS_FILE = './data/warnings.json';

export function loadGroupSettings() {
    try {
        if (!fs.existsSync('./data')) fs.mkdirSync('./data');
        if (!fs.existsSync(DB_FILE)) {
            fs.writeFileSync(DB_FILE, JSON.stringify({}));
        }
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (error) {
        console.error('[DB] Error loading group settings:', error.message);
        return {};
    }
}

export function saveGroupSettings(data) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('[DB] Error saving group settings:', error.message);
    }
}

export function getGroupSetting(groupId, key, defaultValue = false) {
    try {
        const groups = loadGroupSettings();
        return groups[groupId]?.[key] ?? defaultValue;
    } catch (error) {
        console.error('[DB] Error getting group setting:', error.message);
        return defaultValue;
    }
}

export function setGroupSetting(groupId, key, value) {
    try {
        const groups = loadGroupSettings();
        if (!groups[groupId]) groups[groupId] = {};
        groups[groupId][key] = value;
        saveGroupSettings(groups);
    } catch (error) {
        console.error('[DB] Error setting group setting:', error.message);
    }
}

export function updateGroupSettings(groupId, settings) {
    try {
        const groups = loadGroupSettings();
        if (!groups[groupId]) groups[groupId] = {};
        groups[groupId] = { ...groups[groupId], ...settings };
        saveGroupSettings(groups);
    } catch (error) {
        console.error('[DB] Error updating group settings:', error.message);
    }
}

// Warnings system
export function loadWarnings() {
    try {
        if (!fs.existsSync('./data')) fs.mkdirSync('./data');
        if (!fs.existsSync(WARNINGS_FILE)) {
            fs.writeFileSync(WARNINGS_FILE, JSON.stringify({}));
        }
        return JSON.parse(fs.readFileSync(WARNINGS_FILE, 'utf8'));
    } catch (error) {
        console.error('[DB] Error loading warnings:', error.message);
        return {};
    }
}

export function saveWarnings(data) {
    try {
        fs.writeFileSync(WARNINGS_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('[DB] Error saving warnings:', error.message);
    }
}

export function addWarning(groupId, userId, reason) {
    try {
        const warnings = loadWarnings();
        const key = `${groupId}_${userId}`;
        
        if (!warnings[key]) {
            warnings[key] = {
                count: 0,
                reasons: [],
                lastWarned: null
            };
        }
        
        warnings[key].count++;
        warnings[key].reasons.push({
            reason,
            timestamp: new Date().toISOString()
        });
        warnings[key].lastWarned = new Date().toISOString();
        
        saveWarnings(warnings);
        return warnings[key].count;
    } catch (error) {
        console.error('[DB] Error adding warning:', error.message);
        return 0;
    }
}

export function getWarnings(groupId, userId) {
    try {
        const warnings = loadWarnings();
        const key = `${groupId}_${userId}`;
        return warnings[key] || { count: 0, reasons: [], lastWarned: null };
    } catch (error) {
        console.error('[DB] Error getting warnings:', error.message);
        return { count: 0, reasons: [], lastWarned: null };
    }
}

export function clearWarnings(groupId, userId) {
    try {
        const warnings = loadWarnings();
        const key = `${groupId}_${userId}`;
        delete warnings[key];
        saveWarnings(warnings);
        return true;
    } catch (error) {
        console.error('[DB] Error clearing warnings:', error.message);
        return false;
    }
}

export function getAllGroupWarnings(groupId) {
    try {
        const warnings = loadWarnings();
        const groupWarnings = {};
        
        for (const [key, data] of Object.entries(warnings)) {
            if (key.startsWith(groupId + '_')) {
                const userId = key.split('_')[1];
                groupWarnings[userId] = data;
            }
        }
        
        return groupWarnings;
    } catch (error) {
        console.error('[DB] Error getting group warnings:', error.message);
        return {};
    }
}
