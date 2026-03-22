#!/usr/bin/env node

/**
 * Migration script to move from JSON files to SQLite database
 * 
 * This script will:
 * 1. Create a backup of all JSON files
 * 2. Initialize the SQLite database
 * 3. Migrate all data from JSON to SQLite
 * 4. Verify the migration
 * 
 * Usage: node migrate-to-sqlite.js
 */

import { migrateFromJSON, getUserBalance, getGroup, getUser } from './utils/databaseV2.js';
import fs from 'fs';
import path from 'path';

console.log('='.repeat(60));
console.log('WhatsApp Bot - JSON to SQLite Migration');
console.log('='.repeat(60));
console.log('');

// Create backup
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupDir = `./backups/pre-migration-${timestamp}`;

console.log('📦 Creating backup of JSON files...');
if (!fs.existsSync('./backups')) {
    fs.mkdirSync('./backups');
}
fs.mkdirSync(backupDir, { recursive: true });

const jsonFiles = [
    'bank.json',
    'groups.json',
    'group_languages.json',
    'warnings.json',
    'daily_claims.json',
    'blackjackStats.json',
    'referrals.json',
    'shop_inventory.json'
];

for (const file of jsonFiles) {
    const filePath = `./data/${file}`;
    if (fs.existsSync(filePath)) {
        fs.copyFileSync(filePath, `${backupDir}/${file}`);
        console.log(`  ✓ Backed up ${file}`);
    }
}

console.log(`✅ Backup created at: ${backupDir}`);
console.log('');

// Run migration
console.log('🔄 Starting migration...');
console.log('');

try {
    migrateFromJSON();
    
    console.log('');
    console.log('✅ Migration completed successfully!');
    console.log('');
    
    // Verify migration
    console.log('🔍 Verifying migration...');
    
    // Check if bank data was migrated
    if (fs.existsSync('./data/bank.json')) {
        const bankData = JSON.parse(fs.readFileSync('./data/bank.json', 'utf8'));
        const sampleJid = Object.keys(bankData)[0];
        if (sampleJid) {
            const oldBalance = bankData[sampleJid];
            const newBalance = getUserBalance(sampleJid + '@s.whatsapp.net');
            console.log(`  Sample user balance: ${oldBalance} → ${newBalance} ${oldBalance === newBalance ? '✓' : '✗'}`);
        }
    }
    
    // Check if groups were migrated
    if (fs.existsSync('./data/groups.json')) {
        const groupsData = JSON.parse(fs.readFileSync('./data/groups.json', 'utf8'));
        const sampleGroupJid = Object.keys(groupsData)[0];
        if (sampleGroupJid) {
            const group = getGroup(sampleGroupJid);
            console.log(`  Sample group migrated: ${group ? '✓' : '✗'}`);
        }
    }
    
    console.log('');
    console.log('='.repeat(60));
    console.log('Migration Summary');
    console.log('='.repeat(60));
    console.log('');
    console.log('✅ All data has been migrated to SQLite database');
    console.log('📁 Database location: ./data/bot.db');
    console.log('💾 Backup location: ' + backupDir);
    console.log('');
    console.log('⚠️  IMPORTANT: Update your code to use the new database functions');
    console.log('   from utils/databaseV2.js instead of the old JSON-based functions');
    console.log('');
    console.log('📝 Next steps:');
    console.log('   1. Test the bot thoroughly');
    console.log('   2. Verify all features work correctly');
    console.log('   3. Once confirmed, you can delete the old JSON files');
    console.log('');
    
} catch (error) {
    console.error('');
    console.error('❌ Migration failed!');
    console.error('Error:', error.message);
    console.error('');
    console.error('Your original data is safe in:', backupDir);
    console.error('Please report this error to the developer.');
    process.exit(1);
}
