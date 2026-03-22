#!/usr/bin/env node

/**
 * Populate Yesterday's Data for Trend Calculations
 * 
 * Analyzes bot.log to extract yesterday's activity and populate
 * the yesterday object in analytics.json for accurate trend percentages
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';

const LOG_FILES = ['bot.log', 'bot-console.log'];
const ANALYTICS_FILE = path.join(process.cwd(), 'data', 'analytics.json');

// Data by date
const dataByDate = new Map(); // date -> { messages: 0, commands: 0, users: Set() }

// Parse log line
function parseLogLine(line) {
    const timestampMatch = line.match(/\[(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)\]/);
    if (!timestampMatch) return null;
    
    const timestamp = new Date(timestampMatch[1]);
    const dateKey = timestamp.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Parse command execution
    const commandMatch = line.match(/\[COMMAND\]\s+(\w+)\s+executed by\s+(\d+)\s+-\s+(SUCCESS|FAILURE)/);
    if (commandMatch) {
        const [, command, userId, status] = commandMatch;
        return {
            type: 'command',
            command,
            userId,
            success: status === 'SUCCESS',
            timestamp,
            dateKey
        };
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
        
        if (parsed.type === 'command') {
            // Initialize date entry if needed
            if (!dataByDate.has(parsed.dateKey)) {
                dataByDate.set(parsed.dateKey, {
                    messages: 0,
                    commands: 0,
                    users: new Set()
                });
            }
            
            const dateData = dataByDate.get(parsed.dateKey);
            dateData.commands++;
            dateData.messages += 1.5; // Estimate: 1 command + 0.5 response
            dateData.users.add(parsed.userId);
        }
    }
    
    console.log(`   ✅ Processed ${lineCount} lines, parsed ${parsedCount} events`);
}

// Main function
async function main() {
    console.log('📅 Populating Yesterday\'s Data for Trends');
    console.log('═'.repeat(50));
    console.log('');
    
    // Process log files
    for (const logFile of LOG_FILES) {
        await processLogFile(logFile);
    }
    
    // Get dates
    const dates = Array.from(dataByDate.keys()).sort();
    
    if (dates.length === 0) {
        console.log('❌ No data found in logs');
        process.exit(1);
    }
    
    console.log(`\n📊 Found data for ${dates.length} days:`);
    console.log('═'.repeat(50));
    
    // Show last 7 days
    const recentDates = dates.slice(-7);
    for (const date of recentDates) {
        const data = dataByDate.get(date);
        console.log(`${date}: ${Math.round(data.messages)} messages, ${data.commands} commands, ${data.users.size} users`);
    }
    
    // Calculate yesterday (use second-to-last day as "yesterday")
    let yesterdayDate, todayDate;
    
    if (dates.length >= 2) {
        yesterdayDate = dates[dates.length - 2];
        todayDate = dates[dates.length - 1];
    } else {
        // Only one day of data, use it as both
        yesterdayDate = dates[0];
        todayDate = dates[0];
    }
    
    const yesterdayData = dataByDate.get(yesterdayDate);
    const todayData = dataByDate.get(todayDate);
    
    console.log('\n📈 Trend Calculation:');
    console.log('═'.repeat(50));
    console.log(`Yesterday (${yesterdayDate}):`);
    console.log(`  Messages: ${Math.round(yesterdayData.messages)}`);
    console.log(`  Commands: ${yesterdayData.commands}`);
    console.log(`  Users: ${yesterdayData.users.size}`);
    console.log('');
    console.log(`Today (${todayDate}):`);
    console.log(`  Messages: ${Math.round(todayData.messages)}`);
    console.log(`  Commands: ${todayData.commands}`);
    console.log(`  Users: ${todayData.users.size}`);
    
    // Calculate trends
    const messagesTrend = Math.round(((todayData.messages - yesterdayData.messages) / yesterdayData.messages) * 100);
    const commandsTrend = Math.round(((todayData.commands - yesterdayData.commands) / yesterdayData.commands) * 100);
    const usersTrend = Math.round(((todayData.users.size - yesterdayData.users.size) / yesterdayData.users.size) * 100);
    
    console.log('');
    console.log('Trends:');
    console.log(`  Messages: ${messagesTrend > 0 ? '+' : ''}${messagesTrend}%`);
    console.log(`  Commands: ${commandsTrend > 0 ? '+' : ''}${commandsTrend}%`);
    console.log(`  Users: ${usersTrend > 0 ? '+' : ''}${usersTrend}%`);
    
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
    
    // Update yesterday's data
    console.log('\n🔄 Updating yesterday\'s data...');
    analytics.yesterday = {
        totalMessages: Math.round(yesterdayData.messages),
        activeUsers: yesterdayData.users.size,
        activeGroups: 0, // We don't track groups in logs
        totalCommands: yesterdayData.commands,
        savedAt: new Date(yesterdayDate).getTime()
    };
    
    // Backup
    const backupFile = ANALYTICS_FILE.replace('.json', `.backup.${Date.now()}.json`);
    fs.copyFileSync(ANALYTICS_FILE, backupFile);
    console.log(`   💾 Backup created: ${path.basename(backupFile)}`);
    
    // Save
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(analytics, null, 2));
    console.log(`   ✅ Analytics updated`);
    
    console.log('\n✅ Yesterday\'s data populated!');
    console.log('🎉 Your dashboard will now show real trend percentages!');
    console.log('');
    console.log('Expected trends:');
    console.log(`  Messages: ${messagesTrend > 0 ? '+' : ''}${messagesTrend}%`);
    console.log(`  Commands: ${commandsTrend > 0 ? '+' : ''}${commandsTrend}%`);
    console.log(`  Users: ${usersTrend > 0 ? '+' : ''}${usersTrend}%`);
    console.log('');
    console.log('Next steps:');
    console.log('1. Restart your bot: npm start');
    console.log('2. Refresh dashboard: http://localhost:3000');
    console.log('3. Check trend percentages - should show real numbers!');
}

// Run
main().catch(error => {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
});
