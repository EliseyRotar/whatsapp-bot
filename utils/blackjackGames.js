// Shared active games storage for blackjack
export const activeGames = new Map();

// Cleanup old games (30 minutes timeout)
setInterval(() => {
    const now = Date.now();
    for (const [userId, game] of activeGames.entries()) {
        if (now - game.startTime > 1800000) {
            activeGames.delete(userId);
        }
    }
}, 300000);
