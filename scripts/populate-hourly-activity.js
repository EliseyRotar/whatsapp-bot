#!/usr/bin/env node

/**
 * Populate Hourly Activity from Historical Data
 * 
 * Analyzes bot.log to extract hourly activity patterns and populates
 * the hourlyActivity array in analytics.json
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';

const LOG_FILES = ['bot.log', 'bot-console.log'];
const ANALYTICS_FILE = path.join(process.cwd(), 'data', 'analytics.json');

// Hourly activity counter (0-23)
const hourlyActivity = new Array(24).fill(0);

// Parse log line for timestamp
function parseLogLine(line) {
    const timestampMatch = line.match(/\[(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)\]/);
    if (!timestampMatch) return null;
    
    const timestamp = new Date(timestampMatch[1]);
    const hour = timestamp.getHours();
    
    // Check if it's a command or message
    const isCommand = line.includes('[COMMAND]');
    const isMessage = isCommand; // Commands are messages too
    
    if (isMessage) {
        return { hour, timestamp };
    }
    
    return null;
}

// Process log file
async function processLogFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${filePath}`);
        return;
    }
    
    console.log(`📖 Reading ${filePath}...`);
    
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    
    let lineCount = 0;
    let parsedCount = 0;
    
    for await (const line of rl) {
        lineCount++;
        
        const parsed = parseLogLine(line);
        if (!parsed) continue;
        
        parsedCount++;
        hourlyActivity[parsed.hour]++;
    }
    
    console.log(`   ✅ Processed ${lineCount} lines, found ${parsedCount} messages`);
}

// Main function
async function main() {
    console.log('🕐 Populating Hourly Activity Data');
    console.log('═'.repeat(50));
    console.log('');
    
    // Process log files
    for (const logFile of LOG_FILES) {
        await processLogFile(logFile);
    }
    
    // Show hourly distribution
    console.log('\n📊 Hourly Activity Distribution:');
    console.log('═'.repeat(50));
    
    const maxActivity = Math.max(...hourlyActivity);
    for (let hour = 0; hour < 24; hour++) {
        const count = hourlyActivity[hour];
        const barLength = Math.round((count / maxActivity) * 40);
        const bar = '█'.repeat(barLength);
        console.log(`${hour.toString().padStart(2, '0')}:00 │ ${bar} ${count.toLocaleString()}`);
    }
    
    // Load existing analytics
    console.log('\n📂 Loading existing analytics...');
    let analytics;
    try {
        analytics = JSON.parse(fs.readFileSync(ANALYTICS_FILE, 'utf8'));
        console.log('   ✅ Analytics loaded');
    } catch (error) {
        console.error('   ❌ Error loading analytics:', error.message);
        process.exit(1);
    }
    
    // Update hourly activity
    console.log('\n🔄 Updating hourly activity...');
    analytics.hourlyActivity = hourlyActivity;
    
    // Backup
    const backupFile = ANALYTICS_FILE.replace('.json', `.backup.${Date.now()}.json`);
    fs.copyFileSync(ANALYTICS_FILE, backupFile);
    console.log(`   💾 Backup created: ${path.basename(backupFile)}`);
    
    // Save
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(analytics, null, 2));
    console.log(`   ✅ Analytics updated`);
    
    console.log('\n✅ Hourly activity populated!');
    console.log('🎉 Your dashboard will now show activity across all hours!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Restart your bot: npm start');
    console.log('2. Refresh dashboard: http://localhost:3000');
    console.log('3. Check Activity Overview chart - should show data for all hours!');
}

// Run
main().catch(error => {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
});
