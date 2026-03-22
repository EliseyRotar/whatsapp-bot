import dotenv from 'dotenv';
dotenv.config();

export const config = {
    prefix: process.env.PREFIX || '.',
    ownerNumber: process.env.OWNER_NUMBER || '393313444410',
    ownerJid: process.env.OWNER_JID || '222788929462360@lid',
    botName: process.env.BOT_NAME || 'eli6s bot',
    ownerName: process.env.OWNER_NAME || 'eli6',
    
    // Bot settings
    autoRead: process.env.AUTO_READ === 'true',
    autoTyping: process.env.AUTO_TYPING === 'true',
    autoReact: process.env.AUTO_REACT === 'true',
    mode: process.env.MODE || 'public', // public or private
    
    // Spam settings (IMPORTANT: Low values can cause WhatsApp bans!)
    spamDelay: parseInt(process.env.SPAM_DELAY) || 3000,
    maxSpamCount: parseInt(process.env.MAX_SPAM_COUNT) || 50,
    
    // Warning system settings
    maxWarnings: parseInt(process.env.MAX_WARNINGS) || 3,
    
    // AI settings
    aiProvider: process.env.AI_PROVIDER || 'groq',
    openRouterApiKey: process.env.OPENROUTER_API_KEY,
    groqApiKey: process.env.GROQ_API_KEY,
    
    // Trading API settings
    alphaVantageApiKey: process.env.ALPHA_VANTAGE_API_KEY,
    
    // Web Dashboard
    webPassword: process.env.WEB_PASSWORD || 'admin123',
    webPort: parseInt(process.env.WEB_PORT) || 3000,
    
    // Database
    dbType: process.env.DB_TYPE || 'sqlite',
    dbPath: process.env.DB_PATH || './data/bot.db',
    
    // Redis
    redisHost: process.env.REDIS_HOST || '127.0.0.1',
    redisPort: parseInt(process.env.REDIS_PORT) || 6379,
    
    // Logging
    logLevel: process.env.LOG_LEVEL || 'info',
    logDir: process.env.LOG_DIR || './logs'
};
