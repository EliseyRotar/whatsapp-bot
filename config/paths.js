/**
 * Centralized path configuration for all data files
 * This ensures consistent file locations across the application
 */

import path from 'path';

const DATA_DIR = './data';

export const paths = {
    // Root data directory
    data: DATA_DIR,
    
    // Economy data
    economy: {
        bank: path.join(DATA_DIR, 'economy', 'bank.json'),
        playerStats: path.join(DATA_DIR, 'economy', 'player_stats.json'),
        userInventory: path.join(DATA_DIR, 'economy', 'user_inventory.json'),
        dailyClaims: path.join(DATA_DIR, 'economy', 'daily_claims.json'),
        dailyLimits: path.join(DATA_DIR, 'economy', 'daily_limits.json'),
        referrals: path.join(DATA_DIR, 'economy', 'referrals.json'),
        shopInventory: path.join(DATA_DIR, 'economy', 'shop_inventory.json'),
        shopItems: path.join(DATA_DIR, 'economy', 'shop_items.json'),
        weapons: path.join(DATA_DIR, 'economy', 'weapons.json'),
    },
    
    // Game data
    games: {
        blackjackStats: path.join(DATA_DIR, 'games', 'blackjackStats.json'),
        chessGames: path.join(DATA_DIR, 'games', 'chess_games.json'),
        slotStreaks: path.join(DATA_DIR, 'games', 'slot_streaks.json'),
        minesStats: path.join(DATA_DIR, 'games', 'mines_stats.json'),
    },
    
    // Group data
    groups: {
        settings: path.join(DATA_DIR, 'groups', 'groups.json'),
        languages: path.join(DATA_DIR, 'groups', 'group_languages.json'),
        warnings: path.join(DATA_DIR, 'groups', 'warnings.json'),
        mutedUsers: path.join(DATA_DIR, 'groups', 'muted_users.json'),
    },
    
    // Config data
    config: {
        antidelete: path.join(DATA_DIR, 'config', 'antidelete_config.json'),
        orario: path.join(DATA_DIR, 'config', 'orario_config.json'),
        newsletter: path.join(DATA_DIR, 'config', 'newsletter_config.json'),
        additionalOwners: path.join(DATA_DIR, 'config', 'additional_owners.json'),
        teachers: path.join(DATA_DIR, 'config', 'teachers.json'),
    },
    
    // Database
    database: {
        sqlite: path.join(DATA_DIR, 'bot.db'),
    },
    
    // Backups
    backups: path.join(DATA_DIR, 'backups'),
    
    // Migrations
    migrations: path.join(DATA_DIR, 'migrations'),
};

/**
 * Ensure all directories exist
 */
export function ensureDirectories() {
    const fs = await import('fs');
    const dirs = [
        DATA_DIR,
        path.join(DATA_DIR, 'economy'),
        path.join(DATA_DIR, 'games'),
        path.join(DATA_DIR, 'groups'),
        path.join(DATA_DIR, 'config'),
        path.join(DATA_DIR, 'backups'),
        path.join(DATA_DIR, 'migrations'),
    ];
    
    for (const dir of dirs) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }
}
