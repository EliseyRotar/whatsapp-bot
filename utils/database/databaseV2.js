import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import * as logger from '../monitoring/logger.js';

const DB_PATH = process.env.DB_PATH || './data/bot.db';
const DATA_DIR = './data';

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize database
let db;
try {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL'); // Write-Ahead Logging for better concurrency
    logger.info(`[DB] Connected to SQLite database: ${DB_PATH}`);
} catch (error) {
    logger.error(`[DB] Failed to connect to database:`, error);
    throw error;
}

// Create tables
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        jid TEXT PRIMARY KEY,
        phone_number TEXT UNIQUE,
        balance INTEGER DEFAULT 100,
        language TEXT DEFAULT 'en',
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        last_active INTEGER DEFAULT (strftime('%s', 'now')),
        total_commands INTEGER DEFAULT 0,
        total_messages INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS groups (
        jid TEXT PRIMARY KEY,
        name TEXT,
        antilink INTEGER DEFAULT 0,
        antidelete INTEGER DEFAULT 0,
        welcome INTEGER DEFAULT 0,
        lockdown INTEGER DEFAULT 0,
        language TEXT DEFAULT 'en',
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        last_active INTEGER DEFAULT (strftime('%s', 'now'))
    );

    CREATE TABLE IF NOT EXISTS warnings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        group_jid TEXT NOT NULL,
        user_jid TEXT NOT NULL,
        reason TEXT,
        warned_by TEXT,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        UNIQUE(group_jid, user_jid, created_at)
    );

    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        from_jid TEXT NOT NULL,
        to_jid TEXT NOT NULL,
        amount INTEGER NOT NULL,
        type TEXT NOT NULL,
        description TEXT,
        created_at INTEGER DEFAULT (strftime('%s', 'now'))
    );

    CREATE TABLE IF NOT EXISTS blackjack_stats (
        jid TEXT PRIMARY KEY,
        wins INTEGER DEFAULT 0,
        losses INTEGER DEFAULT 0,
        pushes INTEGER DEFAULT 0,
        blackjacks INTEGER DEFAULT 0,
        total_bet INTEGER DEFAULT 0,
        total_won INTEGER DEFAULT 0,
        total_lost INTEGER DEFAULT 0,
        best_streak INTEGER DEFAULT 0,
        current_streak INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS daily_claims (
        jid TEXT PRIMARY KEY,
        last_claim INTEGER DEFAULT 0,
        streak INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS shop_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        price INTEGER NOT NULL,
        emoji TEXT,
        category TEXT DEFAULT 'general'
    );

    CREATE TABLE IF NOT EXISTS user_inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_jid TEXT NOT NULL,
        item_name TEXT NOT NULL,
        quantity INTEGER DEFAULT 1,
        purchased_at INTEGER DEFAULT (strftime('%s', 'now')),
        UNIQUE(user_jid, item_name)
    );

    CREATE TABLE IF NOT EXISTS referrals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        referrer_jid TEXT NOT NULL,
        referred_jid TEXT NOT NULL,
        reward_given INTEGER DEFAULT 0,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        UNIQUE(referred_jid)
    );

    CREATE INDEX IF NOT EXISTS idx_warnings_group_user ON warnings(group_jid, user_jid);
    CREATE INDEX IF NOT EXISTS idx_transactions_from ON transactions(from_jid);
    CREATE INDEX IF NOT EXISTS idx_transactions_to ON transactions(to_jid);
    CREATE INDEX IF NOT EXISTS idx_transactions_created ON transactions(created_at);
    CREATE INDEX IF NOT EXISTS idx_user_inventory_user ON user_inventory(user_jid);
`);

logger.info('[DB] Database tables created/verified');

// ==================== USER FUNCTIONS ====================

export function getUser(jid) {
    try {
        const phoneNumber = jid.split('@')[0];
        let user = db.prepare('SELECT * FROM users WHERE jid = ? OR phone_number = ?').get(jid, phoneNumber);
        
        if (!user) {
            // Create new user
            db.prepare(`
                INSERT INTO users (jid, phone_number, balance, language)
                VALUES (?, ?, 100, 'en')
            `).run(jid, phoneNumber);
            
            user = db.prepare('SELECT * FROM users WHERE jid = ?').get(jid);
            logger.info(`[DB] Created new user: ${phoneNumber}`);
        }
        
        return user;
    } catch (error) {
        logger.error('[DB] Error getting user:', error);
        return null;
    }
}

export function updateUser(jid, updates) {
    try {
        const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
        const values = [...Object.values(updates), jid];
        
        db.prepare(`UPDATE users SET ${fields}, last_active = strftime('%s', 'now') WHERE jid = ?`).run(...values);
        return true;
    } catch (error) {
        logger.error('[DB] Error updating user:', error);
        return false;
    }
}

export function getUserBalance(jid) {
    const user = getUser(jid);
    return user ? user.balance : 100;
}

export function setUserBalance(jid, balance) {
    try {
        getUser(jid); // Ensure user exists
        db.prepare('UPDATE users SET balance = ? WHERE jid = ?').run(balance, jid);
        return balance;
    } catch (error) {
        logger.error('[DB] Error setting balance:', error);
        return 0;
    }
}

export function addUserBalance(jid, amount) {
    try {
        getUser(jid); // Ensure user exists
        db.prepare('UPDATE users SET balance = balance + ? WHERE jid = ?').run(amount, jid);
        return getUserBalance(jid);
    } catch (error) {
        logger.error('[DB] Error adding balance:', error);
        return 0;
    }
}

export function removeUserBalance(jid, amount) {
    try {
        getUser(jid); // Ensure user exists
        db.prepare('UPDATE users SET balance = MAX(0, balance - ?) WHERE jid = ?').run(amount, jid);
        return getUserBalance(jid);
    } catch (error) {
        logger.error('[DB] Error removing balance:', error);
        return 0;
    }
}

export function getUserLanguage(jid) {
    const user = getUser(jid);
    return user ? user.language : 'en';
}

export function setUserLanguage(jid, language) {
    return updateUser(jid, { language });
}

// ==================== GROUP FUNCTIONS ====================

export function getGroup(jid) {
    try {
        let group = db.prepare('SELECT * FROM groups WHERE jid = ?').get(jid);
        
        if (!group) {
            db.prepare(`
                INSERT INTO groups (jid, name)
                VALUES (?, ?)
            `).run(jid, 'Unknown Group');
            
            group = db.prepare('SELECT * FROM groups WHERE jid = ?').get(jid);
            logger.info(`[DB] Created new group: ${jid}`);
        }
        
        return group;
    } catch (error) {
        logger.error('[DB] Error getting group:', error);
        return null;
    }
}

export function updateGroup(jid, updates) {
    try {
        const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
        const values = [...Object.values(updates), jid];
        
        db.prepare(`UPDATE groups SET ${fields}, last_active = strftime('%s', 'now') WHERE jid = ?`).run(...values);
        return true;
    } catch (error) {
        logger.error('[DB] Error updating group:', error);
        return false;
    }
}

export function getGroupSetting(jid, key, defaultValue = 0) {
    const group = getGroup(jid);
    return group ? (group[key] ?? defaultValue) : defaultValue;
}

export function setGroupSetting(jid, key, value) {
    return updateGroup(jid, { [key]: value });
}

export function getGroupLanguage(jid) {
    const group = getGroup(jid);
    return group ? group.language : 'en';
}

export function setGroupLanguage(jid, language) {
    return updateGroup(jid, { language });
}

// ==================== WARNING FUNCTIONS ====================

export function addWarning(groupJid, userJid, reason, warnedBy) {
    try {
        db.prepare(`
            INSERT INTO warnings (group_jid, user_jid, reason, warned_by)
            VALUES (?, ?, ?, ?)
        `).run(groupJid, userJid, reason, warnedBy);
        
        const count = db.prepare('SELECT COUNT(*) as count FROM warnings WHERE group_jid = ? AND user_jid = ?')
            .get(groupJid, userJid).count;
        
        logger.info(`[DB] Added warning for ${userJid} in ${groupJid}. Total: ${count}`);
        return count;
    } catch (error) {
        logger.error('[DB] Error adding warning:', error);
        return 0;
    }
}

export function getWarnings(groupJid, userJid) {
    try {
        const warnings = db.prepare(`
            SELECT * FROM warnings 
            WHERE group_jid = ? AND user_jid = ?
            ORDER BY created_at DESC
        `).all(groupJid, userJid);
        
        return {
            count: warnings.length,
            reasons: warnings.map(w => ({
                reason: w.reason,
                timestamp: new Date(w.created_at * 1000).toISOString(),
                warnedBy: w.warned_by
            })),
            lastWarned: warnings.length > 0 ? new Date(warnings[0].created_at * 1000).toISOString() : null
        };
    } catch (error) {
        logger.error('[DB] Error getting warnings:', error);
        return { count: 0, reasons: [], lastWarned: null };
    }
}

export function clearWarnings(groupJid, userJid) {
    try {
        db.prepare('DELETE FROM warnings WHERE group_jid = ? AND user_jid = ?').run(groupJid, userJid);
        logger.info(`[DB] Cleared warnings for ${userJid} in ${groupJid}`);
        return true;
    } catch (error) {
        logger.error('[DB] Error clearing warnings:', error);
        return false;
    }
}

export function getAllGroupWarnings(groupJid) {
    try {
        const warnings = db.prepare(`
            SELECT user_jid, COUNT(*) as count
            FROM warnings
            WHERE group_jid = ?
            GROUP BY user_jid
        `).all(groupJid);
        
        const result = {};
        warnings.forEach(w => {
            result[w.user_jid] = getWarnings(groupJid, w.user_jid);
        });
        
        return result;
    } catch (error) {
        logger.error('[DB] Error getting group warnings:', error);
        return {};
    }
}

// ==================== TRANSACTION FUNCTIONS ====================

export function addTransaction(fromJid, toJid, amount, type, description = '') {
    try {
        db.prepare(`
            INSERT INTO transactions (from_jid, to_jid, amount, type, description)
            VALUES (?, ?, ?, ?, ?)
        `).run(fromJid, toJid, amount, type, description);
        
        logger.info(`[DB] Transaction: ${fromJid} -> ${toJid}, ${amount} coins (${type})`);
        return true;
    } catch (error) {
        logger.error('[DB] Error adding transaction:', error);
        return false;
    }
}

export function getUserTransactions(jid, limit = 50) {
    try {
        return db.prepare(`
            SELECT * FROM transactions
            WHERE from_jid = ? OR to_jid = ?
            ORDER BY created_at DESC
            LIMIT ?
        `).all(jid, jid, limit);
    } catch (error) {
        logger.error('[DB] Error getting transactions:', error);
        return [];
    }
}

// ==================== PAYMENT WITH TRANSACTION ====================

export function transferCoins(fromJid, toJid, amount, description = 'Transfer') {
    try {
        // Use transaction for atomicity
        const transfer = db.transaction(() => {
            // Check sender balance
            const sender = getUser(fromJid);
            if (!sender || sender.balance < amount) {
                throw new Error('Insufficient balance');
            }
            
            // Deduct from sender
            db.prepare('UPDATE users SET balance = balance - ? WHERE jid = ?').run(amount, fromJid);
            
            // Add to recipient
            getUser(toJid); // Ensure recipient exists
            db.prepare('UPDATE users SET balance = balance + ? WHERE jid = ?').run(amount, toJid);
            
            // Log transaction
            addTransaction(fromJid, toJid, amount, 'transfer', description);
        });
        
        transfer();
        return true;
    } catch (error) {
        logger.error('[DB] Error transferring coins:', error);
        return false;
    }
}

// ==================== BLACKJACK STATS ====================

export function getBlackjackStats(jid) {
    try {
        let stats = db.prepare('SELECT * FROM blackjack_stats WHERE jid = ?').get(jid);
        
        if (!stats) {
            db.prepare(`
                INSERT INTO blackjack_stats (jid)
                VALUES (?)
            `).run(jid);
            
            stats = db.prepare('SELECT * FROM blackjack_stats WHERE jid = ?').get(jid);
        }
        
        return stats;
    } catch (error) {
        logger.error('[DB] Error getting blackjack stats:', error);
        return null;
    }
}

export function updateBlackjackStats(jid, updates) {
    try {
        getBlackjackStats(jid); // Ensure stats exist
        
        const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
        const values = [...Object.values(updates), jid];
        
        db.prepare(`UPDATE blackjack_stats SET ${fields} WHERE jid = ?`).run(...values);
        return true;
    } catch (error) {
        logger.error('[DB] Error updating blackjack stats:', error);
        return false;
    }
}

// ==================== DAILY CLAIMS ====================

export function getDailyClaim(jid) {
    try {
        let claim = db.prepare('SELECT * FROM daily_claims WHERE jid = ?').get(jid);
        
        if (!claim) {
            db.prepare('INSERT INTO daily_claims (jid, last_claim, streak) VALUES (?, 0, 0)').run(jid);
            claim = db.prepare('SELECT * FROM daily_claims WHERE jid = ?').get(jid);
        }
        
        return claim;
    } catch (error) {
        logger.error('[DB] Error getting daily claim:', error);
        return null;
    }
}

export function updateDailyClaim(jid, lastClaim, streak) {
    try {
        getDailyClaim(jid); // Ensure claim exists
        db.prepare('UPDATE daily_claims SET last_claim = ?, streak = ? WHERE jid = ?').run(lastClaim, streak, jid);
        return true;
    } catch (error) {
        logger.error('[DB] Error updating daily claim:', error);
        return false;
    }
}

// ==================== SHOP & INVENTORY ====================

export function getShopItems() {
    try {
        return db.prepare('SELECT * FROM shop_items ORDER BY category, price').all();
    } catch (error) {
        logger.error('[DB] Error getting shop items:', error);
        return [];
    }
}

export function addShopItem(name, description, price, emoji, category = 'general') {
    try {
        db.prepare(`
            INSERT INTO shop_items (name, description, price, emoji, category)
            VALUES (?, ?, ?, ?, ?)
        `).run(name, description, price, emoji, category);
        return true;
    } catch (error) {
        logger.error('[DB] Error adding shop item:', error);
        return false;
    }
}

export function getUserInventory(jid) {
    try {
        return db.prepare('SELECT * FROM user_inventory WHERE user_jid = ?').all(jid);
    } catch (error) {
        logger.error('[DB] Error getting inventory:', error);
        return [];
    }
}

export function addToInventory(jid, itemName, quantity = 1) {
    try {
        const existing = db.prepare('SELECT * FROM user_inventory WHERE user_jid = ? AND item_name = ?').get(jid, itemName);
        
        if (existing) {
            db.prepare('UPDATE user_inventory SET quantity = quantity + ? WHERE user_jid = ? AND item_name = ?')
                .run(quantity, jid, itemName);
        } else {
            db.prepare('INSERT INTO user_inventory (user_jid, item_name, quantity) VALUES (?, ?, ?)')
                .run(jid, itemName, quantity);
        }
        
        return true;
    } catch (error) {
        logger.error('[DB] Error adding to inventory:', error);
        return false;
    }
}

// ==================== REFERRALS ====================

export function addReferral(referrerJid, referredJid, rewardGiven = 0) {
    try {
        db.prepare(`
            INSERT INTO referrals (referrer_jid, referred_jid, reward_given)
            VALUES (?, ?, ?)
        `).run(referrerJid, referredJid, rewardGiven);
        return true;
    } catch (error) {
        logger.error('[DB] Error adding referral:', error);
        return false;
    }
}

export function getReferrals(jid) {
    try {
        return db.prepare('SELECT * FROM referrals WHERE referrer_jid = ?').all(jid);
    } catch (error) {
        logger.error('[DB] Error getting referrals:', error);
        return [];
    }
}

// ==================== MIGRATION FROM JSON ====================

export function migrateFromJSON() {
    try {
        logger.info('[DB] Starting migration from JSON files...');
        
        // Migrate bank.json
        if (fs.existsSync('./data/bank.json')) {
            const bank = JSON.parse(fs.readFileSync('./data/bank.json', 'utf8'));
            Object.entries(bank).forEach(([phone, balance]) => {
                const jid = phone.includes('@') ? phone : `${phone}@s.whatsapp.net`;
                try {
                    db.prepare('INSERT OR REPLACE INTO users (jid, phone_number, balance) VALUES (?, ?, ?)')
                        .run(jid, phone, balance);
                } catch (e) {
                    logger.error(`[DB] Error migrating user ${phone}:`, e);
                }
            });
            logger.info(`[DB] Migrated ${Object.keys(bank).length} users from bank.json`);
        }
        
        // Migrate groups.json
        if (fs.existsSync('./data/groups.json')) {
            const groups = JSON.parse(fs.readFileSync('./data/groups.json', 'utf8'));
            Object.entries(groups).forEach(([jid, settings]) => {
                try {
                    db.prepare(`
                        INSERT OR REPLACE INTO groups (jid, antilink, antidelete, welcome, lockdown, language)
                        VALUES (?, ?, ?, ?, ?, ?)
                    `).run(
                        jid,
                        settings.antilink ? 1 : 0,
                        settings.antidelete ? 1 : 0,
                        settings.welcome ? 1 : 0,
                        settings.lockdown ? 1 : 0,
                        settings.language || 'en'
                    );
                } catch (e) {
                    logger.error(`[DB] Error migrating group ${jid}:`, e);
                }
            });
            logger.info(`[DB] Migrated ${Object.keys(groups).length} groups from groups.json`);
        }
        
        // Migrate warnings.json
        if (fs.existsSync('./data/warnings.json')) {
            const warnings = JSON.parse(fs.readFileSync('./data/warnings.json', 'utf8'));
            Object.entries(warnings).forEach(([key, data]) => {
                const [groupJid, userJid] = key.split('_');
                data.reasons.forEach(r => {
                    try {
                        db.prepare(`
                            INSERT INTO warnings (group_jid, user_jid, reason, created_at)
                            VALUES (?, ?, ?, ?)
                        `).run(groupJid, userJid, r.reason, Math.floor(new Date(r.timestamp).getTime() / 1000));
                    } catch (e) {
                        logger.error(`[DB] Error migrating warning for ${userJid}:`, e);
                    }
                });
            });
            logger.info(`[DB] Migrated warnings from warnings.json`);
        }
        
        // Migrate blackjackStats.json
        if (fs.existsSync('./data/blackjackStats.json')) {
            const stats = JSON.parse(fs.readFileSync('./data/blackjackStats.json', 'utf8'));
            Object.entries(stats).forEach(([jid, data]) => {
                try {
                    db.prepare(`
                        INSERT OR REPLACE INTO blackjack_stats 
                        (jid, wins, losses, pushes, blackjacks, total_bet, total_won, total_lost, best_streak, current_streak)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `).run(
                        jid, data.wins || 0, data.losses || 0, data.pushes || 0, data.blackjacks || 0,
                        data.totalBet || 0, data.totalWon || 0, data.totalLost || 0,
                        data.bestStreak || 0, data.currentStreak || 0
                    );
                } catch (e) {
                    logger.error(`[DB] Error migrating blackjack stats for ${jid}:`, e);
                }
            });
            logger.info(`[DB] Migrated blackjack stats from blackjackStats.json`);
        }
        
        // Migrate daily_claims.json
        if (fs.existsSync('./data/daily_claims.json')) {
            const claims = JSON.parse(fs.readFileSync('./data/daily_claims.json', 'utf8'));
            Object.entries(claims).forEach(([jid, data]) => {
                try {
                    db.prepare(`
                        INSERT OR REPLACE INTO daily_claims (jid, last_claim, streak)
                        VALUES (?, ?, ?)
                    `).run(jid, data.lastClaim || 0, data.streak || 0);
                } catch (e) {
                    logger.error(`[DB] Error migrating daily claim for ${jid}:`, e);
                }
            });
            logger.info(`[DB] Migrated daily claims from daily_claims.json`);
        }
        
        logger.info('[DB] Migration completed successfully!');
        return true;
    } catch (error) {
        logger.error('[DB] Migration failed:', error);
        return false;
    }
}

// ==================== CLEANUP ====================

export function closeDatabase() {
    try {
        db.close();
        logger.info('[DB] Database connection closed');
    } catch (error) {
        logger.error('[DB] Error closing database:', error);
    }
}

// Handle process termination
process.on('exit', closeDatabase);
process.on('SIGINT', () => {
    closeDatabase();
    process.exit(0);
});
process.on('SIGTERM', () => {
    closeDatabase();
    process.exit(0);
});

export default db;

// ==================== BACKWARD COMPATIBILITY ALIASES ====================
// These aliases maintain compatibility with old code that uses different function names

export const addCoins = addUserBalance;
export const removeCoins = removeUserBalance;
export const getBalance = getUserBalance;
export const setBalance = setUserBalance;
