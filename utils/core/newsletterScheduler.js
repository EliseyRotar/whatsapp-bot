import fs from 'fs';
import path from 'path';
import axios from 'axios';

// Newsletter channel ID
const NEWSLETTER_ID = '120363423949011615@newsletter';

// Configuration file
const configFile = './data/newsletter_config.json';

// Free APIs for content
const APIS = {
    quotes: 'https://zenquotes.io/api/random',  // Free motivation quotes
    quotesBackup: 'https://api.quotable.io/random', // Backup quotes API
    financeNews: 'https://www.stockdata.org/api/v1/news/all?limit=1', // Free finance news (no key needed for basic)
};

// Default configuration
const defaultConfig = {
    enabled: false,
    useAPIs: true, // Use APIs for automatic content
    schedule: {
        finance: {
            enabled: true,
            days: [1, 3, 5], // Monday, Wednesday, Friday
            time: '09:00',
            useAPI: true, // Fetch from API
            messages: [
                '💰 Finance Tip: Diversify your investments to minimize risk!',
                '📊 Market Update: Stay informed about market trends and opportunities.',
                '💵 Saving Tip: Set aside 20% of your income for savings and investments.',
                '📈 Investment Wisdom: Time in the market beats timing the market.',
                '💳 Budget Smart: Track your expenses to identify areas for savings.'
            ]
        },
        motivation: {
            enabled: true,
            days: [1, 4], // Monday, Thursday
            time: '08:00',
            useAPI: true, // Fetch from API
            messages: [
                '🔥 Motivation Monday: Success is the sum of small efforts repeated daily!',
                '💪 Stay Strong: Your only limit is you. Push beyond your comfort zone!',
                '🌟 Believe in Yourself: You are capable of amazing things!',
                '🎯 Focus on Goals: Dream big, start small, act now!',
                '⚡ Keep Going: The harder you work, the luckier you get!'
            ]
        },
        channels: {
            enabled: true,
            days: [0, 6], // Sunday, Saturday
            time: '12:00',
            message: '📢 Join our channels for more content!\n\n🔗 Channel Link: [Your Channel Link]\n\n💡 Share your channels too! Contact admin for advertising opportunities.'
        }
    },
    lastPost: {}
};

// Load configuration
export function loadNewsletterConfig() {
    try {
        if (!fs.existsSync(configFile)) {
            saveNewsletterConfig(defaultConfig);
            return defaultConfig;
        }
        const data = fs.readFileSync(configFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('[NEWSLETTER] Error loading config:', error);
        return defaultConfig;
    }
}

// Save configuration
export function saveNewsletterConfig(config) {
    try {
        const dataDir = path.dirname(configFile);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
        return true;
    } catch (error) {
        console.error('[NEWSLETTER] Error saving config:', error);
        return false;
    }
}

// Get random message from array
function getRandomMessage(messages) {
    return messages[Math.floor(Math.random() * messages.length)];
}

// Fetch motivation quote from API
async function fetchMotivationQuote() {
    try {
        // Try primary API
        const response = await axios.get(APIS.quotes, { timeout: 5000 });
        if (response.data && response.data[0]) {
            const quote = response.data[0];
            return `🔥 MOTIVATION\n\n"${quote.q}"\n\n— ${quote.a}`;
        }
    } catch (error) {
        console.log('[NEWSLETTER] Primary quotes API failed, trying backup...');
        try {
            // Try backup API
            const response = await axios.get(APIS.quotesBackup, { timeout: 5000 });
            if (response.data) {
                const quote = response.data;
                return `🔥 MOTIVATION\n\n"${quote.content}"\n\n— ${quote.author}`;
            }
        } catch (backupError) {
            console.error('[NEWSLETTER] Backup quotes API also failed');
        }
    }
    return null;
}

// Fetch finance tip/news from API
async function fetchFinanceTip() {
    try {
        // Try to get latest finance news
        const response = await axios.get(APIS.financeNews, { timeout: 5000 });
        if (response.data && response.data.data && response.data.data.length > 0) {
            const news = response.data.data[0];
            return `💰 FINANCE UPDATE\n\n${news.title}\n\n📊 ${news.description || 'Stay informed about market trends!'}\n\n🔗 Source: ${news.source || 'Market News'}`;
        }
    } catch (error) {
        console.error('[NEWSLETTER] Finance API failed:', error.message);
    }
    return null;
}

// Get content (from API or fallback to messages)
async function getContent(type, schedule) {
    const config = loadNewsletterConfig();
    
    // Check if should use API
    if (config.useAPIs && schedule.useAPI) {
        let apiContent = null;
        
        if (type === 'motivation') {
            apiContent = await fetchMotivationQuote();
        } else if (type === 'finance') {
            apiContent = await fetchFinanceTip();
        }
        
        // If API worked, use it
        if (apiContent) {
            console.log('[NEWSLETTER] Using API content for', type);
            return apiContent;
        }
        
        console.log('[NEWSLETTER] API failed, using fallback messages for', type);
    }
    
    // Fallback to random message from pool
    return getRandomMessage(schedule.messages);
}

// Check if should post today
function shouldPostToday(schedule, type) {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const config = loadNewsletterConfig();
    const lastPost = config.lastPost[type];
    const today = now.toDateString();
    
    // Check if already posted today
    if (lastPost === today) {
        return false;
    }
    
    // Check if today is a scheduled day
    if (!schedule.days.includes(dayOfWeek)) {
        return false;
    }
    
    // Check if it's the right time (within 5 minutes)
    const [schedHour, schedMin] = schedule.time.split(':').map(Number);
    const [currHour, currMin] = currentTime.split(':').map(Number);
    
    const schedMinutes = schedHour * 60 + schedMin;
    const currMinutes = currHour * 60 + currMin;
    
    // Post if within 5 minutes of scheduled time
    return Math.abs(currMinutes - schedMinutes) <= 5;
}

// Post to newsletter
async function postToNewsletter(sock, message) {
    try {
        await sock.sendMessage(NEWSLETTER_ID, {
            text: message
        });
        console.log('[NEWSLETTER] Posted:', message.substring(0, 50) + '...');
        return true;
    } catch (error) {
        console.error('[NEWSLETTER] Error posting:', error);
        return false;
    }
}

// Update last post time
function updateLastPost(type) {
    const config = loadNewsletterConfig();
    const today = new Date().toDateString();
    config.lastPost[type] = today;
    saveNewsletterConfig(config);
}

// Main scheduler function
export async function checkAndPostScheduled(sock) {
    const config = loadNewsletterConfig();
    
    if (!config.enabled) {
        return;
    }
    
    try {
        // Check finance posts
        if (config.schedule.finance.enabled && shouldPostToday(config.schedule.finance, 'finance')) {
            const message = await getContent('finance', config.schedule.finance);
            if (await postToNewsletter(sock, message)) {
                updateLastPost('finance');
            }
        }
        
        // Check motivation posts
        if (config.schedule.motivation.enabled && shouldPostToday(config.schedule.motivation, 'motivation')) {
            const message = await getContent('motivation', config.schedule.motivation);
            if (await postToNewsletter(sock, message)) {
                updateLastPost('motivation');
            }
        }
        
        // Check channel promotion posts
        if (config.schedule.channels.enabled && shouldPostToday(config.schedule.channels, 'channels')) {
            const message = config.schedule.channels.message;
            if (await postToNewsletter(sock, message)) {
                updateLastPost('channels');
            }
        }
    } catch (error) {
        console.error('[NEWSLETTER] Scheduler error:', error);
    }
}

// Start scheduler (check every minute)
export function startNewsletterScheduler(sock) {
    console.log('[NEWSLETTER] Scheduler started');
    
    // Check immediately
    checkAndPostScheduled(sock);
    
    // Then check every minute
    setInterval(() => {
        checkAndPostScheduled(sock);
    }, 60 * 1000); // Every 1 minute
}
