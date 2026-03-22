import fs from 'fs';
import path from 'path';

const dataDir = './data';
const configFile = path.join(dataDir, 'antidelete_config.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Load antidelete configurations
function loadConfigs() {
    try {
        if (fs.existsSync(configFile)) {
            const data = fs.readFileSync(configFile, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('[ANTIDELETE CONFIG] Error loading configs:', error.message);
    }
    return {};
}

// Save antidelete configurations
function saveConfigs(configs) {
    try {
        fs.writeFileSync(configFile, JSON.stringify(configs, null, 2));
    } catch (error) {
        console.error('[ANTIDELETE CONFIG] Error saving configs:', error.message);
    }
}

// Check if antidelete is enabled for a group
export function isAntideleteEnabled(groupJid) {
    const configs = loadConfigs();
    return configs[groupJid] === true;
}

// Enable antidelete for a group
export function enableAntidelete(groupJid) {
    const configs = loadConfigs();
    configs[groupJid] = true;
    saveConfigs(configs);
}

// Disable antidelete for a group
export function disableAntidelete(groupJid) {
    const configs = loadConfigs();
    configs[groupJid] = false;
    saveConfigs(configs);
}

// Get all configured groups
export function getAllConfigs() {
    return loadConfigs();
}
