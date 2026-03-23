#!/usr/bin/env node

/**
 * Clear Message Buffer Script
 * 
 * Clears the fake message data from message-buffer.json
 * so the bot can populate it with real messages.
 */

import fs from 'fs';
import path from 'path';

const MESSAGE_BUFFER_FILE = path.join(process.cwd(), 'data', 'message-buffer.json');

console.log('🧹 Clearing Message Buffer');
console.log('═'.repeat(50));
console.log('');

// Check if file exists
if (!fs.existsSync(MESSAGE_BUFFER_FILE)) {
    console.log('✅ Message buffer file does not exist - nothing to clear');
    process.exit(0);
}

// Read current file
const currentData = JSON.parse(fs.readFileSync(MESSAGE_BUFFER_FILE, 'utf8'));
console.log(`📊 Current message buffer: ${currentData.length} messages`);

// Create backup
const backupFile = MESSAGE_BUFFER_FILE.replace('.json', `.backup.${Date.now()}.json`);
fs.copyFileSync(MESSAGE_BUFFER_FILE, backupFile);
console.log(`💾 Backup created: ${path.basename(backupFile)}`);

// Clear the buffer (write empty array)
fs.writeFileSync(MESSAGE_BUFFER_FILE, JSON.stringify([], null, 2));
console.log('✅ Message buffer cleared');

console.log('');
console.log('🎉 Done!');
console.log('');
console.log('Next steps:');
console.log('1. Restart your bot: npm start');
console.log('2. The bot will now populate the message buffer with real messages');
console.log('3. Check the Messages tab in the dashboard to see real data');
console.log('');
console.log('Note: The message buffer will fill up as users send messages to the bot.');
