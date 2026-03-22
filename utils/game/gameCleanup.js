// Game cleanup utility to prevent memory leaks from abandoned games
import { activeGames as blackjackGames } from '../blackjackGames.js';

const GAME_TIMEOUT = 600000; // 10 minutes
const CLEANUP_INTERVAL = 300000; // Check every 5 minutes

/**
 * Start automatic cleanup of abandoned games
 */
export function startGameCleanup() {
    console.log('[GAME-CLEANUP] Starting automatic game cleanup service...');
    
    setInterval(() => {
        const now = Date.now();
        let cleanedCount = 0;
        
        // Clean up blackjack games
        for (const [sender, game] of blackjackGames.entries()) {
            if (!game.lastActivity) {
                game.lastActivity = game.startTime || now;
            }
            
            if (now - game.lastActivity > GAME_TIMEOUT) {
                blackjackGames.delete(sender);
                cleanedCount++;
                console.log(`[GAME-CLEANUP] Removed abandoned blackjack game for ${sender.split('@')[0]}`);
            }
        }
        
        // Clean up mines games (dynamic import to avoid circular dependencies)
        try {
            import('../../commands/games/mines.js').then(minesModule => {
                if (minesModule.activeGames) {
                    for (const [key, game] of minesModule.activeGames.entries()) {
                        if (!game.lastActivity) {
                            game.lastActivity = game.startTime || now;
                        }
                        
                        if (now - game.lastActivity > GAME_TIMEOUT) {
                            minesModule.activeGames.delete(key);
                            cleanedCount++;
                            console.log(`[GAME-CLEANUP] Removed abandoned mines game for ${key}`);
                        }
                    }
                }
            }).catch(() => {
                // Mines module not loaded yet
            });
        } catch (error) {
            // Ignore if mines games not available
        }
        
        // Chess games have their own cleanup in chessGameManager.js (cleanupOldGames)
        // No need to handle them here
        
        if (cleanedCount > 0) {
            console.log(`[GAME-CLEANUP] Cleaned up ${cleanedCount} abandoned game(s)`);
        }
    }, CLEANUP_INTERVAL);
}

/**
 * Update last activity timestamp for a game
 */
export function updateGameActivity(gameMap, key) {
    const game = gameMap.get(key);
    if (game) {
        game.lastActivity = Date.now();
    }
}

export default {
    startGameCleanup,
    updateGameActivity
};
