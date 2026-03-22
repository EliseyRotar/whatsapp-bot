import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { config } from '../config.js';
import * as database from '../utils/database/database.js';
import * as analytics from '../utils/monitoring/analytics.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Data persistence files
const DATA_DIR = path.join(process.cwd(), 'data');
const BOT_STATUS_FILE = path.join(DATA_DIR, 'bot-status.json');
const MESSAGE_BUFFER_FILE = path.join(DATA_DIR, 'message-buffer.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load bot status from file
function loadBotStatus() {
  try {
    if (fs.existsSync(BOT_STATUS_FILE)) {
      const data = JSON.parse(fs.readFileSync(BOT_STATUS_FILE, 'utf8'));
      // Set status to offline on startup (will be updated when bot connects)
      data.status = 'offline';
      return data;
    }
  } catch (error) {
    console.error('[WEB] Error loading bot status:', error.message);
  }
  return {
    status: 'offline',
    phoneNumber: null,
    deviceName: null,
    connectedAt: null,
    uptime: 0
  };
}

// Save bot status to file
function saveBotStatus() {
  try {
    fs.writeFileSync(BOT_STATUS_FILE, JSON.stringify(botStatus, null, 2));
  } catch (error) {
    console.error('[WEB] Error saving bot status:', error.message);
  }
}

// Load message buffer from file
function loadMessageBuffer() {
  try {
    if (fs.existsSync(MESSAGE_BUFFER_FILE)) {
      const data = JSON.parse(fs.readFileSync(MESSAGE_BUFFER_FILE, 'utf8'));
      return Array.isArray(data) ? data : [];
    }
  } catch (error) {
    console.error('[WEB] Error loading message buffer:', error.message);
  }
  return [];
}

// Save message buffer to file
function saveMessageBuffer() {
  try {
    // Only save last 5000 messages to keep file size reasonable
    const dataToSave = messageBuffer.slice(-5000);
    fs.writeFileSync(MESSAGE_BUFFER_FILE, JSON.stringify(dataToSave, null, 2));
  } catch (error) {
    console.error('[WEB] Error saving message buffer:', error.message);
  }
}

// In-memory stores (loaded from files)
const botStatus = loadBotStatus();
const systemMetrics = {
  memory: 0,
  cpu: 0,
  uptime: 0
};

const messageBuffer = loadMessageBuffer();
const MAX_BUFFER_SIZE = 5000;

let botInstance = null;
let qrCode = null;

// Auto-save message buffer every 60 seconds
setInterval(() => {
  saveMessageBuffer();
}, 60000);

// Save on process exit
process.on('SIGINT', () => {
  console.log('[WEB] Saving data before exit...');
  saveBotStatus();
  saveMessageBuffer();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('[WEB] Saving data before exit...');
  saveBotStatus();
  saveMessageBuffer();
  process.exit(0);
});

// ===== Authentication Middleware =====
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
}

// ===== API Routes =====

// Authentication
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  // Simple authentication (in production, use proper password hashing)
  if (username === 'admin' && password === config.webPassword) {
    const token = jwt.sign(
      { username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        username,
        role: 'admin'
      }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Bot status
app.get('/api/bot/status', authenticateToken, (req, res) => {
  // Calculate uptime if bot is online
  if (botStatus.status === 'online' && botStatus.connectedAt) {
    botStatus.uptime = Math.floor((Date.now() - botStatus.connectedAt) / 1000);
  }
  
  res.json(botStatus);
});

// Bot control
app.post('/api/bot/restart', authenticateToken, async (req, res) => {
  try {
    // Trigger bot restart
    if (botInstance) {
      // Implementation depends on your bot structure
      res.json({ success: true, message: 'Bot restart initiated' });
    } else {
      res.status(400).json({ error: 'Bot not initialized' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Messages
app.get('/api/messages', authenticateToken, (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const messages = messageBuffer.slice(-limit).reverse();
  res.json({ messages });
});

app.get('/api/messages/recent', authenticateToken, (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const messages = messageBuffer.slice(-limit).reverse().map(msg => ({
    id: msg.id,
    senderName: msg.senderName || msg.sender || 'Unknown',
    sender: msg.sender || 'Unknown',
    content: msg.content || msg.text || '[Media]',
    chatName: msg.chatName || (msg.isGroup ? 'Group' : 'Private'),
    isGroup: msg.isGroup || false,
    timestamp: msg.timestamp || Date.now()
  }));
  res.json({ messages });
});

// Groups
app.get('/api/groups', authenticateToken, async (req, res) => {
  try {
    const groups = database.loadGroupSettings();
    const groupList = [];
    
    const botAvailable = !!botInstance;
    const sockAvailable = !!(botInstance && botInstance.sock);
    
    console.log('[WEB] Groups API called');
    console.log('[WEB] Bot instance available:', botAvailable);
    console.log('[WEB] Bot sock available:', sockAvailable);
    console.log('[WEB] Total groups in database:', Object.keys(groups).length);
    
    // If bot is not available, return stored data with a warning
    if (!botAvailable || !sockAvailable) {
      console.log('[WEB] Bot not available, returning stored data only');
      for (const [id, settings] of Object.entries(groups)) {
        groupList.push({
          id,
          name: settings.name || 'Unknown Group',
          memberCount: settings.memberCount || 0,
          messageCount: settings.messageCount || 0,
          settings
        });
      }
      return res.json({ 
        groups: groupList,
        warning: 'Bot not connected - showing cached data'
      });
    }
    
    // Fetch real group metadata from bot
    for (const [id, settings] of Object.entries(groups)) {
      let groupData = {
        id,
        name: settings.name || 'Unknown Group',
        memberCount: settings.memberCount || 0,
        messageCount: settings.messageCount || 0,
        settings
      };
      
      // Try to fetch real metadata from bot
      if (id.endsWith('@g.us')) {
        try {
          console.log(`[WEB] Fetching metadata for group: ${id}`);
          const metadata = await botInstance.sock.groupMetadata(id);
          groupData.name = metadata.subject || groupData.name;
          groupData.memberCount = metadata.participants?.length || 0;
          groupData.description = metadata.desc || '';
          groupData.owner = metadata.owner || '';
          
          console.log(`[WEB] ✓ Group: ${groupData.name} (${groupData.memberCount} members)`);
          
          // Update the database with fresh data
          database.updateGroupSettings(id, {
            ...settings,
            name: groupData.name,
            memberCount: groupData.memberCount
          });
        } catch (error) {
          // If group metadata fetch fails, use stored data
          console.log(`[WEB] ✗ Failed to fetch metadata for ${id}:`, error.message);
        }
      } else {
        console.log(`[WEB] Skipping ${id} (not a group chat)`);
      }
      
      groupList.push(groupData);
    }
    
    console.log(`[WEB] Returning ${groupList.length} groups`);
    res.json({ groups: groupList });
  } catch (error) {
    console.error('[WEB] Error loading groups:', error);
    res.status(500).json({ error: error.message });
  }
});

// Analytics
app.get('/api/analytics/metrics', authenticateToken, (req, res) => {
  try {
    console.log('[API] Analytics metrics requested');
    const period = req.query.period || '24h';
    const stats = analytics.getAnalytics();
    
    if (!stats) {
      console.error('[API] Analytics data is null or undefined');
      return res.status(500).json({ error: 'Analytics data not available' });
    }
    
    console.log('[API] Analytics stats:', {
      totalMessages: stats.totalMessages,
      totalCommands: stats.totalCommands,
      activeUsers: stats.activeUsers?.size,
      activeGroups: stats.activeGroups?.size
    });
    
    const trends = analytics.calculateTrends();
    console.log('[API] Calculated trends:', trends);
    
    const response = {
      totalMessages: stats.totalMessages || 0,
      activeUsers: stats.activeUsers?.size || 0,
      activeGroups: stats.activeGroups?.size || 0,
      commandsExecuted: stats.totalCommands || 0,
      messagesTrend: trends.messagesTrend || 0,
      usersTrend: trends.usersTrend || 0,
      groupsTrend: trends.groupsTrend || 0,
      commandsTrend: trends.commandsTrend || 0,
      hourlyActivity: stats.hourlyActivity || Array(24).fill(0),
      topCommands: Array.from(stats.commandUsage || new Map())
        .map(([command, count]) => ({ command, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      // Include yesterday's data for reference
      yesterday: stats.yesterday || {
        totalMessages: 0,
        activeUsers: 0,
        activeGroups: 0,
        totalCommands: 0
      }
    };
    
    console.log('[API] Sending response:', JSON.stringify(response).substring(0, 200) + '...');
    res.json(response);
  } catch (error) {
    console.error('[API] Error getting analytics:', error);
    console.error('[API] Error stack:', error.stack);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

// Commands
app.get('/api/commands', authenticateToken, async (req, res) => {
  try {
    // Import commands dynamically
    const { commands } = await import('../commands/index.js');
    
    const commandList = Object.entries(commands).map(([name, cmd]) => ({
      name,
      category: cmd.category || 'general',
      description: cmd.description || 'No description',
      usageCount: 0 // Would come from analytics in production
    }));

    res.json({ commands: commandList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// System metrics
app.get('/api/system/metrics', authenticateToken, (req, res) => {
  res.json(systemMetrics);
});

// Settings endpoints
app.get('/api/settings', authenticateToken, (req, res) => {
  try {
    res.json({
      botName: config.botName,
      ownerName: config.ownerName,
      prefix: config.prefix,
      ownerNumber: config.ownerNumber,
      mode: config.mode,
      autoRead: config.autoRead,
      autoTyping: config.autoTyping,
      autoReact: config.autoReact,
      autoRejectCalls: global.autoRejectCalls || false,
      spamDelay: config.spamDelay,
      maxSpamCount: config.maxSpamCount,
      maxWarnings: config.maxWarnings,
      aiProvider: config.aiProvider,
      groqApiKey: config.groqApiKey ? '***' : '',
      openRouterApiKey: config.openRouterApiKey ? '***' : '',
      maxAudioSize: process.env.MAX_AUDIO_SIZE_MB || 50,
      maxVideoSize: process.env.MAX_VIDEO_SIZE_MB || 60,
      downloadTimeout: process.env.DOWNLOAD_TIMEOUT_SECONDS || 600,
      youtubeDelay: process.env.YOUTUBE_DELAY_BETWEEN_REQUESTS || 1000,
      dbType: config.dbType,
      dbPath: config.dbPath,
      logLevel: config.logLevel,
      logDir: config.logDir,
      language: 'en'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/settings', authenticateToken, async (req, res) => {
  try {
    const settings = req.body;
    
    // Validate settings
    const errors = [];
    
    if (!settings.botName || settings.botName.trim().length === 0) {
      errors.push('Bot name is required');
    }
    if (!settings.prefix || settings.prefix.length !== 1) {
      errors.push('Prefix must be exactly 1 character');
    }
    if (settings.spamDelay < 1000) {
      errors.push('Spam delay must be at least 1000ms to avoid bans');
    }
    if (settings.maxSpamCount < 10 || settings.maxSpamCount > 100) {
      errors.push('Max spam count must be between 10 and 100');
    }
    
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    // Update .env file
    const fs = await import('fs');
    const path = await import('path');
    const envPath = path.join(process.cwd(), '.env');
    
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    // Update or add settings
    const updateEnv = (key, value) => {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      const line = `${key}=${value}`;
      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, line);
      } else {
        envContent += `\n${line}`;
      }
    };

    // Update all settings
    updateEnv('BOT_NAME', settings.botName);
    updateEnv('OWNER_NAME', settings.ownerName);
    updateEnv('PREFIX', settings.prefix);
    updateEnv('OWNER_NUMBER', settings.ownerNumber);
    updateEnv('MODE', settings.mode);
    updateEnv('AUTO_READ', settings.autoRead);
    updateEnv('AUTO_TYPING', settings.autoTyping);
    updateEnv('AUTO_REACT', settings.autoReact);
    updateEnv('SPAM_DELAY', settings.spamDelay);
    updateEnv('MAX_SPAM_COUNT', settings.maxSpamCount);
    updateEnv('MAX_WARNINGS', settings.maxWarnings);
    updateEnv('AI_PROVIDER', settings.aiProvider);
    
    // Only update API keys if they're not masked
    if (settings.groqApiKey && settings.groqApiKey !== '***' && settings.groqApiKey.trim() !== '') {
      updateEnv('GROQ_API_KEY', settings.groqApiKey);
    }
    if (settings.openRouterApiKey && settings.openRouterApiKey !== '***' && settings.openRouterApiKey.trim() !== '') {
      updateEnv('OPENROUTER_API_KEY', settings.openRouterApiKey);
    }
    
    updateEnv('MAX_AUDIO_SIZE_MB', settings.maxAudioSize);
    updateEnv('MAX_VIDEO_SIZE_MB', settings.maxVideoSize);
    updateEnv('DOWNLOAD_TIMEOUT_SECONDS', settings.downloadTimeout);
    updateEnv('YOUTUBE_DELAY_BETWEEN_REQUESTS', settings.youtubeDelay);
    updateEnv('DB_TYPE', settings.dbType);
    updateEnv('DB_PATH', settings.dbPath);
    updateEnv('LOG_LEVEL', settings.logLevel);
    updateEnv('LOG_DIR', settings.logDir);

    // Write to .env file
    fs.writeFileSync(envPath, envContent);

    // Update runtime config (will take effect immediately for some settings)
    Object.assign(config, {
      botName: settings.botName,
      ownerName: settings.ownerName,
      prefix: settings.prefix,
      ownerNumber: settings.ownerNumber,
      mode: settings.mode,
      autoRead: settings.autoRead,
      autoTyping: settings.autoTyping,
      autoReact: settings.autoReact,
      spamDelay: parseInt(settings.spamDelay),
      maxSpamCount: parseInt(settings.maxSpamCount),
      maxWarnings: parseInt(settings.maxWarnings),
      aiProvider: settings.aiProvider,
      dbType: settings.dbType,
      dbPath: settings.dbPath,
      logLevel: settings.logLevel,
      logDir: settings.logDir
    });

    // Update global settings
    global.autoRejectCalls = settings.autoRejectCalls;

    console.log('[SETTINGS] Configuration updated successfully');

    res.json({ 
      success: true, 
      message: 'Settings saved successfully! Some changes require bot restart to take effect.',
      requiresRestart: true
    });
  } catch (error) {
    console.error('[SETTINGS] Error saving settings:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/bot/clear-cache', authenticateToken, async (req, res) => {
  try {
    // Clear Node.js require cache
    Object.keys(require.cache).forEach(key => {
      if (key.includes('node_modules')) return; // Don't clear node_modules
      delete require.cache[key];
    });

    console.log('[CACHE] Cache cleared successfully');
    res.json({ success: true, message: 'Cache cleared successfully' });
  } catch (error) {
    console.error('[CACHE] Error clearing cache:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/bot/factory-reset', authenticateToken, async (req, res) => {
  try {
    const fs = await import('fs');
    const path = await import('path');
    
    // Backup current .env
    const envPath = path.join(process.cwd(), '.env');
    const backupPath = path.join(process.cwd(), `.env.backup.${Date.now()}`);
    
    if (fs.existsSync(envPath)) {
      fs.copyFileSync(envPath, backupPath);
    }
    
    // Reset .env to example
    const examplePath = path.join(process.cwd(), '.env.example');
    if (fs.existsSync(examplePath)) {
      fs.copyFileSync(examplePath, envPath);
    }
    
    console.log('[RESET] Factory reset completed. Backup saved to:', backupPath);
    
    res.json({ 
      success: true, 
      message: 'Factory reset completed. Backup saved. Bot will restart...',
      backupPath: backupPath
    });
    
    // Restart process after 2 seconds
    setTimeout(() => {
      process.exit(0);
    }, 2000);
  } catch (error) {
    console.error('[RESET] Error during factory reset:', error);
    res.status(500).json({ error: error.message });
  }
});

// ===== Socket.IO =====
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    socket.user = verified;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log('[WEB] Client connected:', socket.id);

  // Send initial data
  socket.emit('bot:status', botStatus);
  socket.emit('system:metrics', systemMetrics);

  if (qrCode) {
    socket.emit('qr:code', { qr: qrCode });
  }

  socket.on('disconnect', () => {
    console.log('[WEB] Client disconnected:', socket.id);
  });

  // Ping/pong for keepalive
  socket.on('ping', () => {
    socket.emit('pong');
  });
});

// ===== Public API for Bot Integration =====

export function updateBotStatus(status) {
  Object.assign(botStatus, status);
  saveBotStatus(); // Save to file
  io.emit('bot:status', botStatus);
}

export function logMessage(message) {
  messageBuffer.push({
    ...message,
    timestamp: Date.now()
  });

  // Keep buffer size limited
  if (messageBuffer.length > MAX_BUFFER_SIZE) {
    messageBuffer.shift();
  }

  // Update group message count if it's a group message
  if (message.from && message.from.endsWith('@g.us')) {
    try {
      const groups = database.loadGroupSettings();
      if (groups[message.from]) {
        groups[message.from].messageCount = (groups[message.from].messageCount || 0) + 1;
        database.saveGroupSettings(groups);
      }
    } catch (error) {
      console.error('[WEB] Error updating group message count:', error.message);
    }
  }

  // Save periodically (handled by interval, but save immediately for important messages)
  if (messageBuffer.length % 10 === 0) {
    saveMessageBuffer();
  }

  io.emit('message:new', message);
}

export function logCommand(command) {
  io.emit('command:executed', command);
}

export function updateGroup(groupData) {
  io.emit('group:update', groupData);
}

export function updateUser(userData) {
  io.emit('user:update', userData);
}

export function logError(error) {
  io.emit('error', {
    message: error.message,
    timestamp: Date.now()
  });
}

export function updateSystemMetrics(metrics) {
  Object.assign(systemMetrics, metrics);
  io.emit('system:metrics', systemMetrics);
}

export function setBotInstance(instance) {
  botInstance = instance;
}

export function setQRCode(qr) {
  qrCode = qr;
  io.emit('qr:code', { qr });
}

// ===== Start Server =====
const PORT = config.webPort || 3000;

export function startWebServer() {
  httpServer.listen(PORT, () => {
    console.log(`[WEB] Dashboard running on http://localhost:${PORT}`);
  });

  return { app, io, httpServer };
}

// Auto-start if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startWebServer();
}
