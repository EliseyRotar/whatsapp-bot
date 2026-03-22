import fs from 'fs';
import path from 'path';

const dataDir = './data';
const bankFile = path.join(dataDir, 'bank.json');
const backupFile = path.join(dataDir, 'bank_backup_before_migration.json');

// Migration script to convert bank balances from group-specific to global user balances
function migrateBank() {
    console.log('[BANK MIGRATION] Starting migration...');
    
    try {
        // Load current bank data
        if (!fs.existsSync(bankFile)) {
            console.log('[BANK MIGRATION] No bank.json found, nothing to migrate');
            return;
        }
        
        const data = fs.readFileSync(bankFile, 'utf8');
        const oldBank = JSON.parse(data);
        
        // Create backup
        fs.writeFileSync(backupFile, data);
        console.log('[BANK MIGRATION] Backup created at:', backupFile);
        
        // New bank with phone numbers only
        const newBank = {};
        let migratedCount = 0;
        let skippedCount = 0;
        
        // Process each entry
        for (const [jid, balance] of Object.entries(oldBank)) {
            // Extract phone number (everything before @)
            const phoneNumber = jid.split('@')[0];
            
            // Skip invalid entries (like "⁨~ALISAN⁩@lid")
            if (!phoneNumber || phoneNumber.includes('⁨') || phoneNumber.includes('~') || isNaN(phoneNumber)) {
                console.log(`[BANK MIGRATION] Skipping invalid entry: ${jid}`);
                skippedCount++;
                continue;
            }
            
            // If this phone number already exists, keep the higher balance
            if (newBank[phoneNumber]) {
                if (balance > newBank[phoneNumber]) {
                    console.log(`[BANK MIGRATION] User ${phoneNumber} found in multiple groups, keeping higher balance: ${balance} (was ${newBank[phoneNumber]})`);
                    newBank[phoneNumber] = balance;
                }
            } else {
                newBank[phoneNumber] = balance;
                migratedCount++;
            }
        }
        
        // Save new bank
        fs.writeFileSync(bankFile, JSON.stringify(newBank, null, 2));
        
        console.log('[BANK MIGRATION] Migration complete!');
        console.log(`[BANK MIGRATION] Migrated: ${migratedCount} users`);
        console.log(`[BANK MIGRATION] Skipped: ${skippedCount} invalid entries`);
        console.log(`[BANK MIGRATION] Total unique users: ${Object.keys(newBank).length}`);
        console.log('[BANK MIGRATION] Backup saved at:', backupFile);
        
    } catch (error) {
        console.error('[BANK MIGRATION] Error during migration:', error.message);
        console.error('[BANK MIGRATION] Your original bank.json is safe!');
    }
}

// Run migration
migrateBank();
