import { getUserAchievements, getAchievementProgress, ACHIEVEMENTS } from '../../utils/achievements.js';

const translations = {
    en: {
        title: '🏆 *Your Achievements*',
        progress: '\n📊 Progress: {unlocked}/{total} ({percentage}%)\n',
        unlocked: '\n✅ *Unlocked:*\n',
        locked: '\n🔒 *Locked:*\n',
        noAchievements: '📋 You haven\'t unlocked any achievements yet!\n\nPlay games and complete challenges to earn achievements and rewards!',
        achievementFormat: '{icon} *{name}*\n   {description}\n   💰 Reward: {reward} coins\n'
    },
    it: {
        title: '🏆 *I Tuoi Obiettivi*',
        progress: '\n📊 Progresso: {unlocked}/{total} ({percentage}%)\n',
        unlocked: '\n✅ *Sbloccati:*\n',
        locked: '\n🔒 *Bloccati:*\n',
        noAchievements: '📋 Non hai ancora sbloccato obiettivi!\n\nGioca e completa sfide per guadagnare obiettivi e ricompense!',
        achievementFormat: '{icon} *{name}*\n   {description}\n   💰 Ricompensa: {reward} monete\n'
    },
    es: {
        title: '🏆 *Tus Logros*',
        progress: '\n📊 Progreso: {unlocked}/{total} ({percentage}%)\n',
        unlocked: '\n✅ *Desbloqueados:*\n',
        locked: '\n🔒 *Bloqueados:*\n',
        noAchievements: '📋 ¡Aún no has desbloqueado logros!\n\n¡Juega y completa desafíos para ganar logros y recompensas!',
        achievementFormat: '{icon} *{name}*\n   {description}\n   💰 Recompensa: {reward} monedas\n'
    },
    pt: {
        title: '🏆 *Suas Conquistas*',
        progress: '\n📊 Progresso: {unlocked}/{total} ({percentage}%)\n',
        unlocked: '\n✅ *Desbloqueadas:*\n',
        locked: '\n🔒 *Bloqueadas:*\n',
        noAchievements: '📋 Você ainda não desbloqueou conquistas!\n\nJogue e complete desafios para ganhar conquistas e recompensas!',
        achievementFormat: '{icon} *{name}*\n   {description}\n   💰 Recompensa: {reward} moedas\n'
    },
    ru: {
        title: '🏆 *Ваши Достижения*',
        progress: '\n📊 Прогресс: {unlocked}/{total} ({percentage}%)\n',
        unlocked: '\n✅ *Разблокировано:*\n',
        locked: '\n🔒 *Заблокировано:*\n',
        noAchievements: '📋 У вас еще нет достижений!\n\nИграйте и выполняйте задания, чтобы получить достижения и награды!',
        achievementFormat: '{icon} *{name}*\n   {description}\n   💰 Награда: {reward} монет\n'
    },
    ar: {
        title: '🏆 *إنجازاتك*',
        progress: '\n📊 التقدم: {unlocked}/{total} ({percentage}%)\n',
        unlocked: '\n✅ *مفتوح:*\n',
        locked: '\n🔒 *مقفل:*\n',
        noAchievements: '📋 لم تفتح أي إنجازات بعد!\n\nالعب وأكمل التحديات لكسب الإنجازات والمكافآت!',
        achievementFormat: '{icon} *{name}*\n   {description}\n   💰 المكافأة: {reward} عملة\n'
    },
    hi: {
        title: '🏆 *आपकी उपलब्धियां*',
        progress: '\n📊 प्रगति: {unlocked}/{total} ({percentage}%)\n',
        unlocked: '\n✅ *अनलॉक:*\n',
        locked: '\n🔒 *लॉक:*\n',
        noAchievements: '📋 आपने अभी तक कोई उपलब्धि अनलॉक नहीं की है!\n\nउपलब्धियां और पुरस्कार अर्जित करने के लिए खेलें और चुनौतियां पूरी करें!',
        achievementFormat: '{icon} *{name}*\n   {description}\n   💰 पुरस्कार: {reward} सिक्के\n'
    }
};

function translate(lang, key, replacements = {}) {
    let text = translations[lang]?.[key] || translations.en[key];
    for (const [k, v] of Object.entries(replacements)) {
        text = text.replace(`{${k}}`, v);
    }
    return text;
}

export default {
    name: 'achievements',
    aliases: ['achieve', 'ach'],
    description: 'View your achievements',
    usage: '.achievements',
    category: 'games',
    
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const lang = 'en'; // Get from database
        
        try {
            const userAchievements = getUserAchievements(sender);
            const progress = getAchievementProgress(sender);
            
            let text = translate(lang, 'title');
            text += translate(lang, 'progress', {
                unlocked: progress.unlocked,
                total: progress.total,
                percentage: progress.percentage
            });
            
            if (userAchievements.length === 0) {
                text += '\n' + translate(lang, 'noAchievements');
            } else {
                // Show unlocked achievements
                text += translate(lang, 'unlocked');
                userAchievements.forEach(ach => {
                    const trans = ach.translations[lang] || ach.translations.en;
                    text += translate(lang, 'achievementFormat', {
                        icon: ach.icon,
                        name: trans.name,
                        description: trans.description,
                        reward: ach.reward
                    });
                });
                
                // Show some locked achievements
                const unlockedIds = new Set(userAchievements.map(a => a.id));
                const locked = Object.values(ACHIEVEMENTS)
                    .filter(a => !unlockedIds.has(a.id))
                    .slice(0, 5);
                
                if (locked.length > 0) {
                    text += translate(lang, 'locked');
                    locked.forEach(ach => {
                        const trans = ach.translations[lang] || ach.translations.en;
                        text += translate(lang, 'achievementFormat', {
                            icon: ach.icon,
                            name: trans.name,
                            description: trans.description,
                            reward: ach.reward
                        });
                    });
                }
            }
            
            await sock.sendMessage(from, { text });
        } catch (error) {
            console.error('[ACHIEVEMENTS] Error:', error);
            await sock.sendMessage(from, {
                text: '❌ Failed to load achievements. Please try again.'
            });
        }
    }
};
