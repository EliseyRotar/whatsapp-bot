#!/usr/bin/env node

/**
 * Historical Data Import Script
 * 
 * Parses bot.log and bot-console.log to extract historical analytics data
 * and imports it into the analytics system.
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';

const LOG_FILES = ['bot.log', 'bot-console.log'];
const ANALYTICS_FILE = path.join(process.cwd(), 'data', 'analytics.json');

// Data structure to collect
const historicalData = {
    commands: new Map(), // command -> count
    users: new Set(),
    groups: new Set(),
    commandsByUser: new Map(), // user -> count
    commandsByDate: new Map(), // date -> count
    messagesByDate: new Map(), // date -> count
    totalCommands: 0,
    totalMessages: 0,
    startDate: null,
    endDate: null,
    commandErrors: new Map()
};

// Parse log line
function parseLogLine(line) {
    // Extract timestamp
    const timestampMatch = line.match(/\[(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)\]/);
    if (!timestampMatch) return null;
    
    const timestamp = new Date(timestampMatch[1]);
    const dateKey = timestamp.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Parse command execution
    // Format: [COMMAND] commandName executed by userId - SUCCESS/FAILURE
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
    
    // Parse bot start
    if (line.includes('Bot Started') || line.includes('Bot connected successfully')) {
        return {
            type: 'bot_start',
            timestamp,
            dateKey
        };
    }
    
    // Parse message (if logged)
    // This is a fallback - we'll estimate messages from commands
    
    return null;
}

// Process a log file
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
        
        // Update date range
        if (!historicalData.startDate || parsed.timestamp < historicalData.startDate) {
            historicalData.startDate = parsed.timestamp;
        }
        if (!historicalData.endDate || parsed.timestamp > historicalData.endDate) {
            historicalData.endDate = parsed.timestamp;
        }
        
        if (parsed.type === 'command') {
            // Track command
            historicalData.commands.set(
                parsed.command,
                (historicalData.commands.get(parsed.command) || 0) + 1
            );
            
            // Track user
            historicalData.users.add(parsed.userId);
            
            // Track commands by user
            historicalData.commandsByUser.set(
                parsed.userId,
                (historicalData.commandsByUser.get(parsed.userId) || 0) + 1
            );
            
            // Track commands by date
            historicalData.commandsByDate.set(
                parsed.dateKey,
                (historicalData.commandsByDate.get(parsed.dateKey) || 0) + 1
            );
            
            // Track errors
            if (!parsed.success) {
                historicalData.commandErrors.set(
                    parsed.command,
                    (historicalData.commandErrors.get(parsed.command) || 0) + 1
                );
            }
            
            historicalData.totalCommands++;
        }
    }
    
    console.log(`   ✅ Processed ${lineCount} lines, parsed ${parsedCount} events`);
}

// Estimate messages (commands usually generate 1-2 messages)
function estimateMessages() {
    // Conservative estimate: 1.5 messages per command on average
    // (1 command message + 0.5 for bot response)
    historicalData.totalMessages = Math.round(historicalData.totalCommands * 1.5);
    
    // Distribute messages by date based on command distribution
    for (const [date, commandCount] of historicalData.commandsByDate) {
        historicalData.messagesByDate.set(date, Math.round(commandCount * 1.5));
    }
}

// Load existing analytics
function loadExistingAnalytics() {
    try {
        if (fs.existsSync(ANALYTICS_FILE)) {
            const data = JSON.parse(fs.readFileSync(ANALYTICS_FILE, 'utf8'));
            console.log('📊 Existing analytics found:');
            console.log(`   Messages: ${data.totalMessages || 0}`);
            console.log(`   Commands: ${data.totalCommands || 0}`);
            return data;
        }
    } catch (error) {
        console.error('⚠️  Error loading existing analytics:', error.message);
    }
    return null;
}

// Merge historical data with existing analytics
function mergeAnalytics(existing) {
    const merged = existing || {
        commandUsage: {},
        commandErrors: {},
        commandResponseTimes: {},
        activeUsers: [],
        userCommands: {},
        userActivity: {},
        newUsers: [],
        activeGroups: [],
        groupMessages: {},
        groupCommands: {},
        hourlyActivity: new Array(24).fill(0),
        dailyActivity: new Array(7).fill(0),
        responseTimes: [],
        errorRate: 0,
        totalRequests: 0,
        totalErrors: 0,
        featureUsage: {},
        startTime: Date.now(),
        totalMessages: 0,
        totalCommands: 0,
        peakHour: { hour: 0, count: 0 },
        peakDay: { day: 0, count: 0 },
        lastSaved: Date.now(),
        lastDailyReset: Date.now(),
        lastWeeklyReset: Date.now(),
        yesterday: {
            totalMessages: 0,
            activeUsers: 0,
            activeGroups: 0,
            totalCommands: 0,
            savedAt: Date.now()
        }
    };
    
    // Merge command usage
    for (const [command, count] of historicalData.commands) {
        merged.commandUsage[command] = (merged.commandUsage[command] || 0) + count;
    }
    
    // Merge command errors
    for (const [command, count] of historicalData.commandErrors) {
        merged.commandErrors[command] = (merged.commandErrors[command] || 0) + count;
    }
    
    // Merge user commands
    for (const [user, count] of historicalData.commandsByUser) {
        merged.userCommands[user] = (merged.userCommands[user] || 0) + count;
        merged.userActivity[user] = Date.now(); // Set to now as we don't have exact timestamps
    }
    
    // Add historical users to active users (they were active at some point)
    const existingUsers = new Set(merged.activeUsers || []);
    for (const user of historicalData.users) {
        existingUsers.add(user);
    }
    merged.activeUsers = Array.from(existingUsers);
    
    // Update totals
    merged.totalMessages = (merged.totalMessages || 0) + historicalData.totalMessages;
    merged.totalCommands = (merged.totalCommands || 0) + historicalData.totalCommands;
    merged.totalRequests = merged.totalCommands;
    
    // Calculate error rate
    const totalErrors = Object.values(merged.commandErrors).reduce((a, b) => a + b, 0);
    merged.totalErrors = totalErrors;
    merged.errorRate = merged.totalCommands > 0 ? totalErrors / merged.totalCommands : 0;
    
    // Set start time to earliest log entry if earlier
    if (historicalData.startDate && historicalData.startDate.getTime() < merged.startTime) {
        merged.startTime = historicalData.startDate.getTime();
    }
    
    // Set yesterday's data (use data from yesterday if available)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().split('T')[0];
    
    if (historicalData.commandsByDate.has(yesterdayKey)) {
        merged.yesterday = {
            totalMessages: historicalData.messagesByDate.get(yesterdayKey) || 0,
            activeUsers: Math.floor(historicalData.users.size * 0.3), // Estimate
            activeGroups: 0, // We don't track groups in logs
            totalCommands: historicalData.commandsByDate.get(yesterdayKey) || 0,
            savedAt: yesterday.getTime()
        };
    }
    
    return merged;
}

// Save analytics
function saveAnalytics(data) {
    const dataDir = path.dirname(ANALYTICS_FILE);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Backup existing file
    if (fs.existsSync(ANALYTICS_FILE)) {
        const backupFile = ANALYTICS_FILE.replace('.json', `.backup.${Date.now()}.json`);
        fs.copyFileSync(ANALYTICS_FILE, backupFile);
        console.log(`💾 Backup created: ${path.basename(backupFile)}`);
    }
    
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(data, null, 2));
    console.log(`✅ Analytics saved to: ${ANALYTICS_FILE}`);
}

// Print summary
function printSummary() {
    console.log('\n📊 Historical Data Summary:');
    console.log('═'.repeat(50));
    console.log(`📅 Date Range: ${historicalData.startDate?.toLocaleDateString()} - ${historicalData.endDate?.toLocaleDateString()}`);
    console.log(`📝 Total Commands: ${historicalData.totalCommands.toLocaleString()}`);
    console.log(`💬 Estimated Messages: ${historicalData.totalMessages.toLocaleString()}`);
    console.log(`👥 Unique Users: ${historicalData.users.size.toLocaleString()}`);
    console.log(`❌ Command Errors: ${Array.from(historicalData.commandErrors.values()).reduce((a, b) => a + b, 0)}`);
    console.log('\n🏆 Top 10 Commands:');
    
    const topCommands = Array.from(historicalData.commands.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    topCommands.forEach(([cmd, count], i) => {
        console.log(`   ${i + 1}. ${cmd}: ${count.toLocaleString()}`);
    });
    
    console.log('\n📈 Commands by Date (last 7 days):');
    const dates = Array.from(historicalData.commandsByDate.keys()).sort().slice(-7);
    dates.forEach(date => {
        const count = historicalData.commandsByDate.get(date);
        const messages = historicalData.messagesByDate.get(date);
        console.log(`   ${date}: ${count} commands, ~${messages} messages`);
    });
}

// Main function
async function main() {
    console.log('🚀 Historical Data Import Script');
    console.log('═'.repeat(50));
    console.log('');
    
    // Process log files
    for (const logFile of LOG_FILES) {
        await processLogFile(logFile);
    }
    
    // Estimate messages
    estimateMessages();
    
    // Print summary
    printSummary();
    
    // Load existing analytics
    console.log('\n📂 Loading existing analytics...');
    const existing = loadExistingAnalytics();
    
    // Merge data
    console.log('🔄 Merging historical data with existing analytics...');
    const merged = mergeAnalytics(existing);
    
    // Show final totals
    console.log('\n📊 Final Analytics:');
    console.log('═'.repeat(50));
    console.log(`📝 Total Messages: ${merged.totalMessages.toLocaleString()}`);
    console.log(`⚡ Total Commands: ${merged.totalCommands.toLocaleString()}`);
    console.log(`👥 Total Users: ${merged.activeUsers.length.toLocaleString()}`);
    console.log(`❌ Total Errors: ${merged.totalErrors.toLocaleString()}`);
    console.log(`📉 Error Rate: ${(merged.errorRate * 100).toFixed(2)}%`);
    
    // Ask for confirmation
    console.log('\n⚠️  This will update your analytics data.');
    console.log('   A backup will be created automatically.');
    console.log('');
    
    // In non-interactive mode, just save
    console.log('💾 Saving analytics...');
    saveAnalytics(merged);
    
    console.log('\n✅ Import complete!');
    console.log('🎉 Your dashboard now has historical data!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Restart your bot: npm start');
    console.log('2. Open dashboard: http://localhost:3000');
    console.log('3. Check the metrics - they should show historical data!');
}

// Run
main().catch(error => {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
});
