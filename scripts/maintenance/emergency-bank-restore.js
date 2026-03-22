#!/usr/bin/env node
/**
 * EMERGENCY BANK RESTORE SCRIPT
 * 
 * This script restores bank data from backup and syncs with SQLite database
 */

import fs from 'fs';
import Database from 'better-sqlite3';

const BANK_JSON = './data/bank.json';
const BANK_BACKUP = './data/bank.json.backup';
const DB_PATH = './data/bot.db';

console.log('🚨 EMERGENCY BANK RESTORE SCRIPT');
console.log('================================\n');

// Step 1: Check current state
console.log('📊 Checking current state...');
const currentBank = JSON.parse(fs.readFileSync(BANK_JSON, 'utf8'));
const backupBank = JSON.parse(fs.readFileSync(BANK_BACKUP, 'utf8'));

console.log(`Current bank.json: ${Object.keys(currentBank).length} users`);
console.log(`Backup bank.json: ${Object.keys(backupBank).length} users`);

// Step 2: Check SQLite database
console.log('\n📊 Checking SQLite database...');
const db = new Database(DB_PATH);
const dbUsers = db.prepare('SELECT COUNT(*) as count FROM users').get();
console.log(`SQLite database: ${dbUsers.count} users`);

// Step 3: Get sample data from each source
console.log('\n📊 Sample data comparison:');
const sampleUser = Object.keys(backupBank)[0];
console.log(`Sample user: ${sampleUser}`);
console.log(`- Current JSON: ${currentBank[sampleUser] || 'NOT FOUND'}`);
console.log(`- Backup JSON: ${backupBank[sampleUser]}`);

const dbUser = db.prepare('SELECT balance FROM users WHERE phone_number = ?').get(sampleUser);
console.log(`- SQLite DB: ${dbUser ? dbUser.balance : 'NOT FOUND'}`);

// Step 4: Restore from backup
console.log('\n🔄 Restoring from backup...');
fs.writeFileSync(BANK_JSON, JSON.stringify(backupBank, null, 2));
console.log('✅ bank.json restored from backup');

// Step 5: Sync with SQLite
console.log('\n🔄 Syncing with SQLite database...');
let synced = 0;
let created = 0;
let updated = 0;

for (const [phoneNumber, balance] of Object.entries(backupBank)) {
    try {
        const jid = phoneNumber.includes('@') ? phoneNumber : `${phoneNumber}@s.whatsapp.net`;
        
        // Check if user exists
        const existing = db.prepare('SELECT * FROM users WHERE jid = ? OR phone_number = ?').get(jid, phoneNumber);
        
        if (existing) {
            // Update balance if different
            if (existing.balance !== balance) {
                db.prepare('UPDATE users SET balance = ? WHERE jid = ?').run(balance, jid);
                updated++;
            }
        } else {
            // Create new user
            db.prepare(`
                INSERT INTO users (jid, phone_number, balance, language)
                VALUES (?, ?, ?, 'en')
            `).run(jid, phoneNumber, balance);
            created++;
        }
        
        synced++;
    } catch (error) {
        console.error(`❌ Error syncing ${phoneNumber}:`, error.message);
    }
}

console.log(`✅ Synced ${synced} users`);
console.log(`   - Created: ${created}`);
console.log(`   - Updated: ${updated}`);

// Step 6: Verify
console.log('\n✅ Verification:');
const finalBank = JSON.parse(fs.readFileSync(BANK_JSON, 'utf8'));
const finalDbUsers = db.prepare('SELECT COUNT(*) as count FROM users').get();

console.log(`bank.json: ${Object.keys(finalBank).length} users`);
console.log(`SQLite DB: ${finalDbUsers.count} users`);

// Check sample user again
const finalDbUser = db.prepare('SELECT balance FROM users WHERE phone_number = ?').get(sampleUser);
console.log(`\nSample user ${sampleUser}:`);
console.log(`- JSON: ${finalBank[sampleUser]}`);
console.log(`- SQLite: ${finalDbUser ? finalDbUser.balance : 'NOT FOUND'}`);

db.close();

console.log('\n🎉 RESTORE COMPLETED SUCCESSFULLY!');
console.log('\n⚠️  IMPORTANT: Restart the bot now!');
console.log('   Run: npm start\n');
