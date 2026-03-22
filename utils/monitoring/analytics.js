import * as logger from './logger.js';
import fs from 'fs';
import path from 'path';

// Analytics data file path
const ANALYTICS_FILE = path.join(process.cwd(), 'data', 'analytics.json');

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Analytics data structure
const analytics = {
    // Command tracking
    commandUsage: new Map(), // command -> count
    commandErrors: new Map(), // command -> error count
    commandResponseTimes: new Map(), // command -> [times]
    
    // User tracking
    activeUsers: new Set(), // Active users today
    userCommands: new Map(), // user -> command count
    userActivity: new Map(), // user -> last activity timestamp
    newUsers: new Set(), // New users today
    
    // Group tracking
    activeGroups: new Set(), // Active groups today
    groupMessages: new Map(), // group -> message count
    groupCommands: new Map(), // group -> command count
    
    // Time-based tracking
    hourlyActivity: new Array(24).fill(0), // Activity by hour (0-23)
    dailyActivity: new Array(7).fill(0), // Activity by day of week (0-6)
    
    // Performance tracking
    responseTimes: [], // All response times
    errorRate: 0,
    totalRequests: 0,
    totalErrors: 0,
    
    // Feature usage
    featureUsage: new Map(), // feature -> count
    
    // System metrics
    startTime: Date.now(),
    totalMessages: 0,
    totalCommands: 0,
    
    // Peak tracking
    peakHour: { hour: 0, count: 0 },
    peakDay: { day: 0, count: 0 },
    
    // Persistence tracking
    lastSaved: Date.now(),
    lastDailyReset: Date.now(),
    lastWeeklyReset: Date.now(),
    
    // Historical data for trends (yesterday's data)
    yesterday: {
        totalMessages: 0,
        activeUsers: 0,
        activeGroups: 0,
        totalCommands: 0,
        savedAt: Date.now()
    }
};

// Load analytics from file
function loadAnalytics() {
    console.log('[ANALYTICS] Loading analytics from file...');
    console.log('[ANALYTICS] File path:', ANALYTICS_FILE);
    console.log('[ANALYTICS] File exists:', fs.existsSync(ANALYTICS_FILE));
    
    try {
        if (fs.existsSync(ANALYTICS_FILE)) {
            console.log('[ANALYTICS] Reading file...');
            const fileContent = fs.readFileSync(ANALYTICS_FILE, 'utf8');
            console.log('[ANALYTICS] File size:', fileContent.length, 'bytes');
            
            const data = JSON.parse(fileContent);
            console.log('[ANALYTICS] Parsed data - totalMessages:', data.totalMessages, 'totalCommands:', data.totalCommands);
            
            // Restore Maps and Sets
            if (data.commandUsage) analytics.commandUsage = new Map(Object.entries(data.commandUsage));
            if (data.commandErrors) analytics.commandErrors = new Map(Object.entries(data.commandErrors));
            if (data.commandResponseTimes) {
                analytics.commandResponseTimes = new Map(
                    Object.entries(data.commandResponseTimes).map(([k, v]) => [k, Array.isArray(v) ? v : []])
                );
            }
            
            if (data.activeUsers) analytics.activeUsers = new Set(data.activeUsers);
            if (data.userCommands) analytics.userCommands = new Map(Object.entries(data.userCommands));
            if (data.userActivity) analytics.userActivity = new Map(Object.entries(data.userActivity));
            if (data.newUsers) analytics.newUsers = new Set(data.newUsers);
            
            if (data.activeGroups) analytics.activeGroups = new Set(data.activeGroups);
            if (data.groupMessages) analytics.groupMessages = new Map(Object.entries(data.groupMessages));
            if (data.groupCommands) analytics.groupCommands = new Map(Object.entries(data.groupCommands));
            
            if (data.featureUsage) analytics.featureUsage = new Map(Object.entries(data.featureUsage));
            
            // Restore arrays and primitives
            if (data.hourlyActivity) analytics.hourlyActivity = data.hourlyActivity;
            if (data.dailyActivity) analytics.dailyActivity = data.dailyActivity;
            if (data.responseTimes) analytics.responseTimes = data.responseTimes;
            if (data.errorRate !== undefined) analytics.errorRate = data.errorRate;
            if (data.totalRequests !== undefined) analytics.totalRequests = data.totalRequests;
            if (data.totalErrors !== undefined) analytics.totalErrors = data.totalErrors;
            if (data.totalMessages !== undefined) analytics.totalMessages = data.totalMessages;
            if (data.totalCommands !== undefined) analytics.totalCommands = data.totalCommands;
            if (data.peakHour) analytics.peakHour = data.peakHour;
            if (data.peakDay) analytics.peakDay = data.peakDay;
            
            // Restore timestamps
            if (data.startTime) analytics.startTime = data.startTime;
            if (data.lastDailyReset) analytics.lastDailyReset = data.lastDailyReset;
            if (data.lastWeeklyReset) analytics.lastWeeklyReset = data.lastWeeklyReset;
            
            // Restore yesterday's data
            if (data.yesterday) {
                analytics.yesterday = data.yesterday;
            }
            
            console.log('[ANALYTICS] ✅ Analytics loaded successfully!');
            console.log('[ANALYTICS] Final totals - Messages:', analytics.totalMessages, 'Commands:', analytics.totalCommands);
            
            logger.info('Analytics data loaded from file', {
                totalMessages: analytics.totalMessages,
                totalCommands: analytics.totalCommands,
                activeUsers: analytics.activeUsers.size,
                yesterdayMessages: analytics.yesterday.totalMessages
            });
        } else {
            console.log('[ANALYTICS] ⚠️  No existing analytics file found, starting fresh');
            logger.info('No existing analytics data found, starting fresh');
        }
    } catch (error) {
        console.error('[ANALYTICS] ❌ Error loading analytics:', error.message);
        console.error('[ANALYTICS] Stack:', error.stack);
        logger.error('Failed to load analytics data', { error: error.message });
    }
}

// Save analytics to file
function saveAnalytics() {
    try {
        const data = {
            // Convert Maps to objects
            commandUsage: Object.fromEntries(analytics.commandUsage),
            commandErrors: Object.fromEntries(analytics.commandErrors),
            commandResponseTimes: Object.fromEntries(analytics.commandResponseTimes),
            
            // Convert Sets to arrays
            activeUsers: Array.from(analytics.activeUsers),
            userCommands: Object.fromEntries(analytics.userCommands),
            userActivity: Object.fromEntries(analytics.userActivity),
            newUsers: Array.from(analytics.newUsers),
            
            activeGroups: Array.from(analytics.activeGroups),
            groupMessages: Object.fromEntries(analytics.groupMessages),
            groupCommands: Object.fromEntries(analytics.groupCommands),
            
            featureUsage: Object.fromEntries(analytics.featureUsage),
            
            // Arrays and primitives
            hourlyActivity: analytics.hourlyActivity,
            dailyActivity: analytics.dailyActivity,
            responseTimes: analytics.responseTimes.slice(-1000), // Keep last 1000
            errorRate: analytics.errorRate,
            totalRequests: analytics.totalRequests,
            totalErrors: analytics.totalErrors,
            totalMessages: analytics.totalMessages,
            totalCommands: analytics.totalCommands,
            peakHour: analytics.peakHour,
            peakDay: analytics.peakDay,
            
            // Timestamps
            startTime: analytics.startTime,
            lastSaved: Date.now(),
            lastDailyReset: analytics.lastDailyReset,
            lastWeeklyReset: analytics.lastWeeklyReset,
            
            // Yesterday's data for trends
            yesterday: analytics.yesterday
        };
        
        fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(data, null, 2));
        analytics.lastSaved = Date.now();
        
        logger.debug('Analytics data saved to file');
    } catch (error) {
        logger.error('Failed to save analytics data', { error: error.message });
    }
}

// Auto-save every 30 seconds
setInterval(() => {
    saveAnalytics();
}, 30000);

// Save on process exit
process.on('SIGINT', () => {
    logger.info('Saving analytics before exit...');
    saveAnalytics();
    process.exit(0);
});

process.on('SIGTERM', () => {
    logger.info('Saving analytics before exit...');
    saveAnalytics();
    process.exit(0);
});

// Load analytics on startup
loadAnalytics();

// Track command execution
export function trackCommand(commandName, user, group, responseTime, success = true) {
    try {
        // Command usage
        analytics.commandUsage.set(
            commandName,
            (analytics.commandUsage.get(commandName) || 0) + 1
        );
        
        // Command errors
        if (!success) {
            analytics.commandErrors.set(
                commandName,
                (analytics.commandErrors.get(commandName) || 0) + 1
            );
            analytics.totalErrors++;
        }
        
        // Response times
        if (!analytics.commandResponseTimes.has(commandName)) {
            analytics.commandResponseTimes.set(commandName, []);
        }
        analytics.commandResponseTimes.get(commandName).push(responseTime);
        analytics.responseTimes.push(responseTime);
        
        // Keep only last 1000 response times
        if (analytics.responseTimes.length > 1000) {
            analytics.responseTimes.shift();
        }
        
        // User tracking
        analytics.activeUsers.add(user);
        analytics.userCommands.set(
            user,
            (analytics.userCommands.get(user) || 0) + 1
        );
        analytics.userActivity.set(user, Date.now());
        
        // Group tracking
        if (group) {
            analytics.activeGroups.add(group);
            analytics.groupCommands.set(
                group,
                (analytics.groupCommands.get(group) || 0) + 1
            );
        }
        
        // Time-based tracking
        const now = new Date();
        const hour = now.getHours();
        const day = now.getDay();
        
        analytics.hourlyActivity[hour]++;
        analytics.dailyActivity[day]++;
        
        // Update peaks
        if (analytics.hourlyActivity[hour] > analytics.peakHour.count) {
            analytics.peakHour = { hour, count: analytics.hourlyActivity[hour] };
        }
        if (analytics.dailyActivity[day] > analytics.peakDay.count) {
            analytics.peakDay = { day, count: analytics.dailyActivity[day] };
        }
        
        // Totals
        analytics.totalCommands++;
        analytics.totalRequests++;
        
        // Calculate error rate
        analytics.errorRate = analytics.totalErrors / analytics.totalRequests;
        
        logger.debug('Command tracked', {
            command: commandName,
            user,
            group,
            responseTime,
            success
        });
    } catch (error) {
        logger.error('Failed to track command', { error: error.message });
    }
}

// Track message
export function trackMessage(from, sender, isGroup = false) {
    try {
        analytics.totalMessages++;
        
        // User tracking
        analytics.activeUsers.add(sender);
        analytics.userActivity.set(sender, Date.now());
        
        // Group tracking
        if (isGroup) {
            analytics.activeGroups.add(from);
            analytics.groupMessages.set(
                from,
                (analytics.groupMessages.get(from) || 0) + 1
            );
        }
        
        // Time-based tracking
        const now = new Date();
        const hour = now.getHours();
        const day = now.getDay();
        
        analytics.hourlyActivity[hour]++;
        analytics.dailyActivity[day]++;
    } catch (error) {
        logger.error('Failed to track message', { error: error.message });
    }
}

// Track new user
export function trackNewUser(user) {
    try {
        analytics.newUsers.add(user);
        analytics.activeUsers.add(user);
        logger.info('New user tracked', { user });
    } catch (error) {
        logger.error('Failed to track new user', { error: error.message });
    }
}

// Track feature usage
export function trackFeature(featureName) {
    try {
        analytics.featureUsage.set(
            featureName,
            (analytics.featureUsage.get(featureName) || 0) + 1
        );
    } catch (error) {
        logger.error('Failed to track feature', { error: error.message });
    }
}

// Get top commands
export function getTopCommands(limit = 10) {
    return Array.from(analytics.commandUsage.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([command, count]) => ({
            command,
            count,
            errorCount: analytics.commandErrors.get(command) || 0,
            avgResponseTime: getAverageResponseTime(command)
        }));
}

// Get top users
export function getTopUsers(limit = 10) {
    return Array.from(analytics.userCommands.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([user, count]) => ({
            user,
            commandCount: count,
            lastActive: analytics.userActivity.get(user)
        }));
}

// Get top groups
export function getTopGroups(limit = 10) {
    return Array.from(analytics.groupCommands.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([group, count]) => ({
            group,
            commandCount: count,
            messageCount: analytics.groupMessages.get(group) || 0
        }));
}

// Get average response time
export function getAverageResponseTime(commandName = null) {
    try {
        if (commandName) {
            const times = analytics.commandResponseTimes.get(commandName) || [];
            if (times.length === 0) return 0;
            return times.reduce((a, b) => a + b, 0) / times.length;
        }
        
        if (analytics.responseTimes.length === 0) return 0;
        return analytics.responseTimes.reduce((a, b) => a + b, 0) / analytics.responseTimes.length;
    } catch (error) {
        logger.error('Failed to calculate average response time', { error: error.message });
        return 0;
    }
}

// Get peak hours
export function getPeakHours(limit = 5) {
    return analytics.hourlyActivity
        .map((count, hour) => ({ hour, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
}

// Get analytics summary
export function getAnalyticsSummary() {
    const uptime = Date.now() - analytics.startTime;
    const uptimeHours = uptime / (1000 * 60 * 60);
    
    return {
        // Overview
        uptime,
        uptimeFormatted: formatUptime(uptime),
        totalMessages: analytics.totalMessages,
        totalCommands: analytics.totalCommands,
        totalRequests: analytics.totalRequests,
        totalErrors: analytics.totalErrors,
        errorRate: (analytics.errorRate * 100).toFixed(2) + '%',
        
        // Users
        activeUsersToday: analytics.activeUsers.size,
        newUsersToday: analytics.newUsers.size,
        totalUniqueUsers: analytics.userActivity.size,
        
        // Groups
        activeGroupsToday: analytics.activeGroups.size,
        totalGroups: analytics.groupMessages.size,
        
        // Performance
        avgResponseTime: Math.round(getAverageResponseTime()),
        messagesPerHour: Math.round(analytics.totalMessages / uptimeHours),
        commandsPerHour: Math.round(analytics.totalCommands / uptimeHours),
        
        // Top stats
        topCommands: getTopCommands(5),
        topUsers: getTopUsers(5),
        topGroups: getTopGroups(5),
        peakHours: getPeakHours(3),
        
        // Time-based
        hourlyActivity: analytics.hourlyActivity,
        dailyActivity: analytics.dailyActivity,
        peakHour: analytics.peakHour,
        peakDay: analytics.peakDay,
        
        // Features
        topFeatures: Array.from(analytics.featureUsage.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([feature, count]) => ({ feature, count }))
    };
}

// Get raw analytics data (for web server)
export function getAnalytics() {
    return analytics;
}

// Calculate real trend percentages
export function calculateTrends() {
    console.log('[TRENDS] Calculating trends...');
    console.log('[TRENDS] Yesterday data:', analytics.yesterday);
    console.log('[TRENDS] Today totals:', {
        totalMessages: analytics.totalMessages,
        activeUsers: analytics.activeUsers.size,
        activeGroups: analytics.activeGroups.size,
        totalCommands: analytics.totalCommands
    });
    
    const trends = {
        messagesTrend: 0,
        usersTrend: 0,
        groupsTrend: 0,
        commandsTrend: 0
    };
    
    // Calculate messages trend
    if (analytics.yesterday.totalMessages > 0) {
        const todayMessages = analytics.totalMessages;
        const yesterdayMessages = analytics.yesterday.totalMessages;
        const diff = todayMessages - yesterdayMessages;
        trends.messagesTrend = Math.round((diff / yesterdayMessages) * 100);
        console.log('[TRENDS] Messages:', yesterdayMessages, '->', todayMessages, '=', trends.messagesTrend + '%');
    } else {
        console.log('[TRENDS] No yesterday messages data');
    }
    
    // Calculate users trend
    if (analytics.yesterday.activeUsers > 0) {
        const todayUsers = analytics.activeUsers.size;
        const yesterdayUsers = analytics.yesterday.activeUsers;
        const diff = todayUsers - yesterdayUsers;
        trends.usersTrend = Math.round((diff / yesterdayUsers) * 100);
        console.log('[TRENDS] Users:', yesterdayUsers, '->', todayUsers, '=', trends.usersTrend + '%');
    } else {
        console.log('[TRENDS] No yesterday users data');
    }
    
    // Calculate groups trend
    if (analytics.yesterday.activeGroups > 0) {
        const todayGroups = analytics.activeGroups.size;
        const yesterdayGroups = analytics.yesterday.activeGroups;
        const diff = todayGroups - yesterdayGroups;
        trends.groupsTrend = Math.round((diff / yesterdayGroups) * 100);
        console.log('[TRENDS] Groups:', yesterdayGroups, '->', todayGroups, '=', trends.groupsTrend + '%');
    } else {
        console.log('[TRENDS] No yesterday groups data (using 0%)');
    }
    
    // Calculate commands trend
    if (analytics.yesterday.totalCommands > 0) {
        const todayCommands = analytics.totalCommands;
        const yesterdayCommands = analytics.yesterday.totalCommands;
        const diff = todayCommands - yesterdayCommands;
        trends.commandsTrend = Math.round((diff / yesterdayCommands) * 100);
        console.log('[TRENDS] Commands:', yesterdayCommands, '->', todayCommands, '=', trends.commandsTrend + '%');
    } else {
        console.log('[TRENDS] No yesterday commands data');
    }
    
    console.log('[TRENDS] Final trends:', trends);
    return trends;
}

// Manual save function
export function saveAnalyticsNow() {
    saveAnalytics();
}

// Get detailed analytics
export function getDetailedAnalytics() {
    return {
        summary: getAnalyticsSummary(),
        commands: {
            usage: Object.fromEntries(analytics.commandUsage),
            errors: Object.fromEntries(analytics.commandErrors),
            responseTimes: Object.fromEntries(
                Array.from(analytics.commandResponseTimes.entries()).map(([cmd, times]) => [
                    cmd,
                    {
                        avg: times.reduce((a, b) => a + b, 0) / times.length,
                        min: Math.min(...times),
                        max: Math.max(...times),
                        count: times.length
                    }
                ])
            )
        },
        users: {
            active: Array.from(analytics.activeUsers),
            commands: Object.fromEntries(analytics.userCommands),
            activity: Object.fromEntries(analytics.userActivity)
        },
        groups: {
            active: Array.from(analytics.activeGroups),
            messages: Object.fromEntries(analytics.groupMessages),
            commands: Object.fromEntries(analytics.groupCommands)
        },
        performance: {
            responseTimes: analytics.responseTimes.slice(-100), // Last 100
            errorRate: analytics.errorRate,
            avgResponseTime: getAverageResponseTime()
        }
    };
}

// Reset daily statistics
export function resetDailyStats() {
    // Save today's data as yesterday's data before resetting
    analytics.yesterday = {
        totalMessages: analytics.totalMessages,
        activeUsers: analytics.activeUsers.size,
        activeGroups: analytics.activeGroups.size,
        totalCommands: analytics.totalCommands,
        savedAt: Date.now()
    };
    
    // Reset daily counters
    analytics.activeUsers.clear();
    analytics.newUsers.clear();
    analytics.activeGroups.clear();
    analytics.hourlyActivity.fill(0);
    analytics.peakHour = { hour: 0, count: 0 };
    analytics.lastDailyReset = Date.now();
    
    saveAnalytics();
    logger.info('Daily statistics reset', {
        yesterdayMessages: analytics.yesterday.totalMessages,
        yesterdayUsers: analytics.yesterday.activeUsers,
        yesterdayGroups: analytics.yesterday.activeGroups,
        yesterdayCommands: analytics.yesterday.totalCommands
    });
}

// Reset weekly statistics
export function resetWeeklyStats() {
    analytics.dailyActivity.fill(0);
    analytics.peakDay = { day: 0, count: 0 };
    analytics.lastWeeklyReset = Date.now();
    
    saveAnalytics();
    logger.info('Weekly statistics reset');
}

// Check if daily reset is needed (on startup)
function checkDailyReset() {
    const now = Date.now();
    const lastReset = analytics.lastDailyReset || now;
    const hoursSinceReset = (now - lastReset) / (1000 * 60 * 60);
    
    // If more than 24 hours since last reset, reset daily stats
    if (hoursSinceReset >= 24) {
        logger.info('Daily reset needed (last reset was ' + Math.floor(hoursSinceReset) + ' hours ago)');
        resetDailyStats();
    }
}

// Check if weekly reset is needed (on startup)
function checkWeeklyReset() {
    const now = Date.now();
    const lastReset = analytics.lastWeeklyReset || now;
    const daysSinceReset = (now - lastReset) / (1000 * 60 * 60 * 24);
    
    // If more than 7 days since last reset, reset weekly stats
    if (daysSinceReset >= 7) {
        logger.info('Weekly reset needed (last reset was ' + Math.floor(daysSinceReset) + ' days ago)');
        resetWeeklyStats();
    }
}

// Check for needed resets on startup
checkDailyReset();
checkWeeklyReset();

// Format uptime
function formatUptime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
        return `${days}d ${hours % 24}h ${minutes % 60}m`;
    }
    if (hours > 0) {
        return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
}

// Schedule daily reset at midnight
const now = new Date();
const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
const msUntilMidnight = tomorrow - now;

setTimeout(() => {
    resetDailyStats();
    setInterval(resetDailyStats, 86400000); // Every 24 hours
}, msUntilMidnight);

// Schedule weekly reset on Monday
const daysUntilMonday = (8 - now.getDay()) % 7 || 7;
const nextMonday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilMonday);
const msUntilMonday = nextMonday - now;

setTimeout(() => {
    resetWeeklyStats();
    setInterval(resetWeeklyStats, 604800000); // Every 7 days
}, msUntilMonday);

// Periodic logging
setInterval(() => {
    const summary = getAnalyticsSummary();
    logger.info('Analytics summary', {
        messages: summary.totalMessages,
        commands: summary.totalCommands,
        activeUsers: summary.activeUsersToday,
        errorRate: summary.errorRate,
        avgResponseTime: summary.avgResponseTime
    });
}, 300000); // Every 5 minutes

logger.info('Analytics system initialized');

export default {
    trackCommand,
    trackMessage,
    trackNewUser,
    trackFeature,
    getTopCommands,
    getTopUsers,
    getTopGroups,
    getAverageResponseTime,
    getPeakHours,
    getAnalyticsSummary,
    getDetailedAnalytics,
    getAnalytics,
    calculateTrends,
    saveAnalyticsNow,
    resetDailyStats,
    resetWeeklyStats
};
