/**
 * Achievements System
 * 
 * Tracks and rewards player achievements across all games
 */

import { log } from '../monitoring/loggerV2.js';
import { addCoins, getUser } from '../database/databaseV2.js';
import db from '../database/databaseV2.js';

// Initialize achievements table
db.exec(`
    CREATE TABLE IF NOT EXISTS achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_jid TEXT NOT NULL,
        achievement_id TEXT NOT NULL,
        unlocked_at INTEGER DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (user_jid) REFERENCES users(jid) ON DELETE CASCADE,
        UNIQUE(user_jid, achievement_id)
    )
`);

db.exec(`
    CREATE INDEX IF NOT EXISTS idx_achievements_user ON achievements(user_jid);
    CREATE INDEX IF NOT EXISTS idx_achievements_id ON achievements(achievement_id);
`);

/**
 * Achievement definitions
 */
export const ACHIEVEMENTS = {
    // Economy achievements
    first_coins: {
        id: 'first_coins',
        name: 'First Coins',
        description: 'Earn your first coins',
        icon: '💰',
        reward: 100,
        category: 'economy',
        translations: {
            en: { name: 'First Coins', description: 'Earn your first coins' },
            it: { name: 'Prime Monete', description: 'Guadagna le tue prime monete' },
            es: { name: 'Primeras Monedas', description: 'Gana tus primeras monedas' },
            pt: { name: 'Primeiras Moedas', description: 'Ganhe suas primeiras moedas' },
            ru: { name: 'Первые Монеты', description: 'Заработайте свои первые монеты' },
            ar: { name: 'العملات الأولى', description: 'احصل على عملاتك الأولى' },
            hi: { name: 'पहले सिक्के', description: 'अपने पहले सिक्के कमाएं' }
        }
    },
    millionaire: {
        id: 'millionaire',
        name: 'Millionaire',
        description: 'Accumulate 1,000,000 coins',
        icon: '💎',
        reward: 10000,
        category: 'economy',
        translations: {
            en: { name: 'Millionaire', description: 'Accumulate 1,000,000 coins' },
            it: { name: 'Milionario', description: 'Accumula 1.000.000 di monete' },
            es: { name: 'Millonario', description: 'Acumula 1.000.000 de monedas' },
            pt: { name: 'Milionário', description: 'Acumule 1.000.000 de moedas' },
            ru: { name: 'Миллионер', description: 'Накопите 1.000.000 монет' },
            ar: { name: 'مليونير', description: 'اجمع 1.000.000 عملة' },
            hi: { name: 'करोड़पति', description: '1,000,000 सिक्के जमा करें' }
        }
    },
    
    // Blackjack achievements
    blackjack_first_win: {
        id: 'blackjack_first_win',
        name: 'Blackjack Beginner',
        description: 'Win your first blackjack game',
        icon: '🃏',
        reward: 500,
        category: 'blackjack',
        translations: {
            en: { name: 'Blackjack Beginner', description: 'Win your first blackjack game' },
            it: { name: 'Principiante Blackjack', description: 'Vinci la tua prima partita a blackjack' },
            es: { name: 'Principiante Blackjack', description: 'Gana tu primer juego de blackjack' },
            pt: { name: 'Iniciante Blackjack', description: 'Ganhe seu primeiro jogo de blackjack' },
            ru: { name: 'Новичок Блэкджек', description: 'Выиграйте свою первую игру в блэкджек' },
            ar: { name: 'مبتدئ بلاك جاك', description: 'اربح أول لعبة بلاك جاك' },
            hi: { name: 'ब्लैकजैक शुरुआती', description: 'अपना पहला ब्लैकजैक गेम जीतें' }
        }
    },
    blackjack_master: {
        id: 'blackjack_master',
        name: 'Blackjack Master',
        description: 'Win 100 blackjack games',
        icon: '🎴',
        reward: 5000,
        category: 'blackjack',
        translations: {
            en: { name: 'Blackjack Master', description: 'Win 100 blackjack games' },
            it: { name: 'Maestro Blackjack', description: 'Vinci 100 partite a blackjack' },
            es: { name: 'Maestro Blackjack', description: 'Gana 100 juegos de blackjack' },
            pt: { name: 'Mestre Blackjack', description: 'Ganhe 100 jogos de blackjack' },
            ru: { name: 'Мастер Блэкджек', description: 'Выиграйте 100 игр в блэкджек' },
            ar: { name: 'سيد بلاك جاك', description: 'اربح 100 لعبة بلاك جاك' },
            hi: { name: 'ब्लैकजैक मास्टर', description: '100 ब्लैकजैक गेम जीतें' }
        }
    },
    natural_blackjack: {
        id: 'natural_blackjack',
        name: 'Natural 21',
        description: 'Get a natural blackjack (21 with first 2 cards)',
        icon: '🎯',
        reward: 1000,
        category: 'blackjack',
        translations: {
            en: { name: 'Natural 21', description: 'Get a natural blackjack' },
            it: { name: '21 Naturale', description: 'Ottieni un blackjack naturale' },
            es: { name: '21 Natural', description: 'Consigue un blackjack natural' },
            pt: { name: '21 Natural', description: 'Consiga um blackjack natural' },
            ru: { name: 'Натуральный 21', description: 'Получите натуральный блэкджек' },
            ar: { name: '21 طبيعي', description: 'احصل على بلاك جاك طبيعي' },
            hi: { name: 'प्राकृतिक 21', description: 'प्राकृतिक ब्लैकजैक प्राप्त करें' }
        }
    },
    
    // Daily streak achievements
    streak_7: {
        id: 'streak_7',
        name: 'Week Warrior',
        description: 'Claim daily reward for 7 days in a row',
        icon: '🔥',
        reward: 1000,
        category: 'daily',
        translations: {
            en: { name: 'Week Warrior', description: 'Claim daily reward for 7 days' },
            it: { name: 'Guerriero Settimanale', description: 'Richiedi ricompensa per 7 giorni' },
            es: { name: 'Guerrero Semanal', description: 'Reclama recompensa por 7 días' },
            pt: { name: 'Guerreiro Semanal', description: 'Reivindique recompensa por 7 dias' },
            ru: { name: 'Недельный Воин', description: 'Получайте награду 7 дней подряд' },
            ar: { name: 'محارب الأسبوع', description: 'اطلب المكافأة لمدة 7 أيام' },
            hi: { name: 'सप्ताह योद्धा', description: '7 दिनों तक दैनिक पुरस्कार का दावा करें' }
        }
    },
    streak_30: {
        id: 'streak_30',
        name: 'Monthly Legend',
        description: 'Claim daily reward for 30 days in a row',
        icon: '👑',
        reward: 10000,
        category: 'daily',
        translations: {
            en: { name: 'Monthly Legend', description: 'Claim daily reward for 30 days' },
            it: { name: 'Leggenda Mensile', description: 'Richiedi ricompensa per 30 giorni' },
            es: { name: 'Leyenda Mensual', description: 'Reclama recompensa por 30 días' },
            pt: { name: 'Lenda Mensal', description: 'Reivindique recompensa por 30 dias' },
            ru: { name: 'Месячная Легенда', description: 'Получайте награду 30 дней подряд' },
            ar: { name: 'أسطورة الشهر', description: 'اطلب المكافأة لمدة 30 يومًا' },
            hi: { name: 'मासिक किंवदंती', description: '30 दिनों तक दैनिक पुरस्कार का दावा करें' }
        }
    },
    
    // Social achievements
    generous: {
        id: 'generous',
        name: 'Generous Soul',
        description: 'Send coins to 10 different users',
        icon: '🤝',
        reward: 2000,
        category: 'social',
        translations: {
            en: { name: 'Generous Soul', description: 'Send coins to 10 different users' },
            it: { name: 'Anima Generosa', description: 'Invia monete a 10 utenti diversi' },
            es: { name: 'Alma Generosa', description: 'Envía monedas a 10 usuarios diferentes' },
            pt: { name: 'Alma Generosa', description: 'Envie moedas para 10 usuários diferentes' },
            ru: { name: 'Щедрая Душа', description: 'Отправьте монеты 10 разным пользователям' },
            ar: { name: 'روح كريمة', description: 'أرسل عملات إلى 10 مستخدمين مختلفين' },
            hi: { name: 'उदार आत्मा', description: '10 विभिन्न उपयोगकर्ताओं को सिक्के भेजें' }
        }
    },
    
    // Tournament achievements
    tournament_winner: {
        id: 'tournament_winner',
        name: 'Tournament Champion',
        description: 'Win your first tournament',
        icon: '🏆',
        reward: 5000,
        category: 'tournament',
        translations: {
            en: { name: 'Tournament Champion', description: 'Win your first tournament' },
            it: { name: 'Campione Torneo', description: 'Vinci il tuo primo torneo' },
            es: { name: 'Campeón Torneo', description: 'Gana tu primer torneo' },
            pt: { name: 'Campeão Torneio', description: 'Ganhe seu primeiro torneio' },
            ru: { name: 'Чемпион Турнира', description: 'Выиграйте свой первый турнир' },
            ar: { name: 'بطل البطولة', description: 'اربح بطولتك الأولى' },
            hi: { name: 'टूर्नामेंट चैंपियन', description: 'अपना पहला टूर्नामेंट जीतें' }
        }
    }
};

/**
 * Check if user has achievement
 */
export function hasAchievement(jid, achievementId) {
    const result = db.prepare(
        'SELECT COUNT(*) as count FROM achievements WHERE user_jid = ? AND achievement_id = ?'
    ).get(jid, achievementId);
    return result.count > 0;
}

/**
 * Unlock achievement for user
 */
export function unlockAchievement(jid, achievementId) {
    if (hasAchievement(jid, achievementId)) {
        return {
            success: false,
            alreadyUnlocked: true
        };
    }
    
    const achievement = ACHIEVEMENTS[achievementId];
    if (!achievement) {
        return {
            success: false,
            error: 'Achievement not found'
        };
    }
    
    try {
        // Add achievement to database
        db.prepare(
            'INSERT INTO achievements (user_jid, achievement_id) VALUES (?, ?)'
        ).run(jid, achievementId);
        
        // Give reward
        if (achievement.reward > 0) {
            addCoins(jid, achievement.reward);
        }
        
        log.info('Achievement unlocked', {
            user: jid,
            achievement: achievementId,
            reward: achievement.reward
        });
        
        return {
            success: true,
            achievement,
            reward: achievement.reward
        };
    } catch (error) {
        log.error('Failed to unlock achievement', error);
        return {
            success: false,
            error: 'Failed to unlock achievement'
        };
    }
}

/**
 * Get user achievements
 */
export function getUserAchievements(jid) {
    const achievements = db.prepare(
        'SELECT achievement_id, unlocked_at FROM achievements WHERE user_jid = ? ORDER BY unlocked_at DESC'
    ).all(jid);
    
    return achievements.map(a => ({
        ...ACHIEVEMENTS[a.achievement_id],
        unlockedAt: a.unlocked_at
    }));
}

/**
 * Get achievement progress
 */
export function getAchievementProgress(jid) {
    const unlocked = getUserAchievements(jid);
    const total = Object.keys(ACHIEVEMENTS).length;
    
    return {
        unlocked: unlocked.length,
        total,
        percentage: Math.round((unlocked.length / total) * 100)
    };
}

/**
 * Check and unlock achievements based on stats
 */
export function checkAchievements(jid, stats = {}) {
    const newAchievements = [];
    
    // Check economy achievements
    if (stats.balance >= 1000000 && !hasAchievement(jid, 'millionaire')) {
        const result = unlockAchievement(jid, 'millionaire');
        if (result.success) newAchievements.push(result.achievement);
    }
    
    // Check blackjack achievements
    if (stats.blackjackWins === 1 && !hasAchievement(jid, 'blackjack_first_win')) {
        const result = unlockAchievement(jid, 'blackjack_first_win');
        if (result.success) newAchievements.push(result.achievement);
    }
    
    if (stats.blackjackWins >= 100 && !hasAchievement(jid, 'blackjack_master')) {
        const result = unlockAchievement(jid, 'blackjack_master');
        if (result.success) newAchievements.push(result.achievement);
    }
    
    if (stats.naturalBlackjack && !hasAchievement(jid, 'natural_blackjack')) {
        const result = unlockAchievement(jid, 'natural_blackjack');
        if (result.success) newAchievements.push(result.achievement);
    }
    
    // Check daily streak achievements
    if (stats.dailyStreak >= 7 && !hasAchievement(jid, 'streak_7')) {
        const result = unlockAchievement(jid, 'streak_7');
        if (result.success) newAchievements.push(result.achievement);
    }
    
    if (stats.dailyStreak >= 30 && !hasAchievement(jid, 'streak_30')) {
        const result = unlockAchievement(jid, 'streak_30');
        if (result.success) newAchievements.push(result.achievement);
    }
    
    // Check tournament achievements
    if (stats.tournamentWins >= 1 && !hasAchievement(jid, 'tournament_winner')) {
        const result = unlockAchievement(jid, 'tournament_winner');
        if (result.success) newAchievements.push(result.achievement);
    }
    
    return newAchievements;
}

/**
 * Format achievement message
 */
export function formatAchievementMessage(achievement, language = 'en') {
    const trans = achievement.translations[language] || achievement.translations.en;
    return `🎉 *Achievement Unlocked!*\n\n${achievement.icon} *${trans.name}*\n${trans.description}\n\n💰 Reward: ${achievement.reward} coins`;
}

export default {
    ACHIEVEMENTS,
    hasAchievement,
    unlockAchievement,
    getUserAchievements,
    getAchievementProgress,
    checkAchievements,
    formatAchievementMessage
};
