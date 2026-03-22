#!/usr/bin/env node

/**
 * Update Group Message Counts Script
 * 
 * Counts messages per group from message-buffer.json and updates
 * the groups.json database with accurate message counts.
 */

import fs from 'fs';
import path from 'path';

const MESSAGE_BUFFER_FILE = path.join(process.cwd(), 'data', 'message-buffer.json');
const GROUPS_FILE = path.join(process.cwd(), 'data', 'groups.json');

console.log('📊 Updating Group Message Counts');
console.log('═'.repeat(50));
console.log('');

// Check if files exist
if (!fs.existsSync(MESSAGE_BUFFER_FILE)) {
    console.log('❌ Message buffer file not found:', MESSAGE_BUFFER_FILE);
    process.exit(1);
}

if (!fs.existsSync(GROUPS_FILE)) {
    console.log('❌ Groups file not found:', GROUPS_FILE);
    process.exit(1);
}

// Load message buffer
console.log('📖 Reading message buffer...');
const messages = JSON.parse(fs.readFileSync(MESSAGE_BUFFER_FILE, 'utf8'));
console.log(`   Found ${messages.length} messages`);

// Count messages per group
console.log('');
console.log('🔢 Counting messages per group...');
const messageCounts = {};

messages.forEach(msg => {
    const from = msg.from || msg.chatId;
    if (from && from.endsWith('@g.us')) {
        messageCounts[from] = (messageCounts[from] || 0) + 1;
    }
});

console.log(`   Found ${Object.keys(messageCounts).length} groups with messages`);

// Load groups database
console.log('');
console.log('📂 Loading groups database...');
const groups = JSON.parse(fs.readFileSync(GROUPS_FILE, 'utf8'));
console.log(`   Found ${Object.keys(groups).length} groups in database`);

// Update message counts
console.log('');
console.log('✏️  Updating message counts...');
let updatedCount = 0;

for (const [groupId, count] of Object.entries(messageCounts)) {
    if (groups[groupId]) {
        groups[groupId].messageCount = count;
        updatedCount++;
        console.log(`   ✓ ${groupId}: ${count} messages`);
    } else {
        console.log(`   ⚠ ${groupId}: ${count} messages (not in database)`);
    }
}

// Set 0 for groups with no messages
for (const groupId of Object.keys(groups)) {
    if (!messageCounts[groupId]) {
        groups[groupId].messageCount = 0;
    }
}

// Create backup
const backupFile = GROUPS_FILE.replace('.json', `.backup.${Date.now()}.json`);
fs.copyFileSync(GROUPS_FILE, backupFile);
console.log('');
console.log(`💾 Backup created: ${path.basename(backupFile)}`);

// Save updated groups
fs.writeFileSync(GROUPS_FILE, JSON.stringify(groups, null, 2));
console.log('✅ Groups database updated');

// Print summary
console.log('');
console.log('📊 Summary:');
console.log('═'.repeat(50));
console.log(`Total groups in database: ${Object.keys(groups).length}`);
console.log(`Groups with messages: ${Object.keys(messageCounts).length}`);
console.log(`Groups updated: ${updatedCount}`);

// Show top 10 groups by message count
console.log('');
console.log('🏆 Top 10 Groups by Message Count:');
const sortedGroups = Object.entries(messageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

sortedGroups.forEach(([groupId, count], i) => {
    const groupName = groups[groupId]?.name || 'Unknown Group';
    console.log(`   ${i + 1}. ${groupName}: ${count.toLocaleString()} messages`);
});

console.log('');
console.log('✅ Update complete!');
console.log('');
console.log('Next steps:');
console.log('1. Restart the web server (if running separately)');
console.log('2. Refresh the Groups tab in the dashboard');
console.log('3. Message counts should now be accurate!');
