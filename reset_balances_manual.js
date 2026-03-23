import Database from 'better-sqlite3';
import dotenv from 'dotenv';

dotenv.config();

const DB_PATH = './data/bot.db';
const OWNER_NUMBER = process.env.OWNER_NUMBER || '393313444410';
const RESET_AMOUNT = 500;

console.log('🔄 Starting manual balance reset...\n');

try {
    const db = new Database(DB_PATH);
    
    // Get all users
    const users = db.prepare('SELECT jid, phone_number, balance FROM users').all();
    console.log(`📊 Found ${users.length} users in database\n`);
    
    let resetCount = 0;
    let skippedOwner = false;
    let totalBefore = 0;
    let totalAfter = 0;
    
    console.log('Users before reset:');
    console.log('─'.repeat(60));
    
    for (const user of users) {
        const phone = user.phone_number || user.jid.split('@')[0];
        totalBefore += user.balance;
        
        console.log(`${phone.padEnd(20)} | Balance: ${user.balance.toLocaleString().padStart(15)}`);
        
        // Skip owner
        if (phone === OWNER_NUMBER || user.jid.includes(OWNER_NUMBER)) {
            skippedOwner = true;
            totalAfter += user.balance;
            continue;
        }
        
        // Reset to 500 coins
        db.prepare('UPDATE users SET balance = ? WHERE jid = ?').run(RESET_AMOUNT, user.jid);
        resetCount++;
        totalAfter += RESET_AMOUNT;
    }
    
    console.log('─'.repeat(60));
    console.log(`\n✅ RESET COMPLETE!\n`);
    console.log(`📊 Statistics:`);
    console.log(`   • Users reset: ${resetCount}`);
    console.log(`   • Owner preserved: ${skippedOwner ? 'Yes' : 'No'}`);
    console.log(`   • New balance per user: ${RESET_AMOUNT} coins`);
    console.log(`   • Total coins before: ${totalBefore.toLocaleString()}`);
    console.log(`   • Total coins after: ${totalAfter.toLocaleString()}`);
    console.log(`   • Coins removed: ${(totalBefore - totalAfter).toLocaleString()}\n`);
    
    // Show users after reset
    const usersAfter = db.prepare('SELECT jid, phone_number, balance FROM users').all();
    console.log('Users after reset:');
    console.log('─'.repeat(60));
    
    for (const user of usersAfter) {
        const phone = user.phone_number || user.jid.split('@')[0];
        const isOwner = phone === OWNER_NUMBER || user.jid.includes(OWNER_NUMBER);
        console.log(`${phone.padEnd(20)} | Balance: ${user.balance.toLocaleString().padStart(15)} ${isOwner ? '👑 OWNER' : ''}`);
    }
    console.log('─'.repeat(60));
    
    db.close();
    console.log('\n✅ Database closed successfully');
    
} catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
}
