import fs from 'fs';
import path from 'path';

const dataDir = './data';
const configFile = path.join(dataDir, 'orario_config.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Load orario configurations
function loadConfigs() {
    try {
        if (fs.existsSync(configFile)) {
            const data = fs.readFileSync(configFile, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('[ORARIO CONFIG] Error loading configs:', error.message);
    }
    return {};
}

// Save orario configurations
function saveConfigs(configs) {
    try {
        fs.writeFileSync(configFile, JSON.stringify(configs, null, 2));
    } catch (error) {
        console.error('[ORARIO CONFIG] Error saving configs:', error.message);
    }
}

// Get group's class configuration
export function getGroupClass(groupJid) {
    const configs = loadConfigs();
    return configs[groupJid] || null;
}

// Set group's class configuration
export function setGroupClass(groupJid, className) {
    const configs = loadConfigs();
    configs[groupJid] = className;
    saveConfigs(configs);
}

// Remove group's class configuration
export function removeGroupClass(groupJid) {
    const configs = loadConfigs();
    delete configs[groupJid];
    saveConfigs(configs);
}

// Get all configured groups
export function getAllConfigs() {
    return loadConfigs();
}
