import { auditLog } from './securityEnhancements.js';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const dataDir = './data';
const ownersFile = path.join(dataDir, 'additional_owners.json');

// Load additional owners from file
export function loadAdditionalOwners() {
    try {
        if (!fs.existsSync(ownersFile)) {
            return [];
        }
        const data = fs.readFileSync(ownersFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('[OWNER] Error loading additional owners:', error.message);
        return [];
    }
}

// Check if a user is an additional owner
export function isAdditionalOwner(userJid, userNumber) {
    try {
        const additionalOwners = loadAdditionalOwners();
        return additionalOwners.some(owner => 
            owner.jid === userJid || owner.number === userNumber
        );
    } catch (error) {
        console.error('[OWNER] Error checking additional owner:', error.message);
        return false;
    }
}

// Check if user is main owner or additional owner
export function isOwnerOrAdditional(sender, botJid, ownerNumber, ownerJid, fromMe) {
    const senderNumber = sender.split('@')[0].replace(/\D/g, '');
    
    // Check main owner
    const isMainOwner = sender === ownerJid ||
                       sender === botJid ||
                       sender.includes(botJid.split('@')[0]) ||
                       senderNumber === ownerNumber || 
                       sender.includes(ownerNumber) ||
                       fromMe;
    
    if (isMainOwner) {
        auditLog('OWNER_ACCESS', sender, { type: 'main_owner' });
        return true;
    }
    
    // Check additional owners
    const isAdditional = isAdditionalOwner(sender, senderNumber);
    if (isAdditional) {
        auditLog('OWNER_ACCESS', sender, { type: 'additional_owner' });
    }
    
    return isAdditional;
}

// Check if user is ONLY the main owner (not additional owners)
export function isMainOwnerOnly(sender, botJid, ownerNumber, ownerJid, fromMe) {
    const senderNumber = sender.split('@')[0].replace(/\D/g, '');
    
    return sender === ownerJid ||
           sender === botJid ||
           sender.includes(botJid.split('@')[0]) ||
           senderNumber === ownerNumber || 
           sender.includes(ownerNumber) ||
           fromMe;
}
