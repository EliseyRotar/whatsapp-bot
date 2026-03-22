import { getUsageStats } from '../../utils/economy/dailyLimits.js';
import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        title: '🎯 Kill Statistics\n\n',
        used: '✅ Kills Used: {used}/{limit}\n',
        remaining: '⏳ Remaining: {remaining}\n',
        reset: '🔄 Resets: Midnight\n',
        scope: '🌍 Scope: Global (all groups)\n',
        note: '\n💡 Note: Your kill limit is shared across ALL groups!'
    },
    it: {
        title: '🎯 Statistiche Kill\n\n',
        used: '✅ Kill Usati: {used}/{limit}\n',
        remaining: '⏳ Rimanenti: {remaining}\n',
        reset: '🔄 Reset: Mezzanotte\n',
        scope: '🌍 Ambito: Globale (tutti i gruppi)\n',
        note: '\n💡 Nota: Il limite di kill è condiviso tra TUTTI i gruppi!'
    },
    ru: {
        title: '🎯 Статистика Убийств\n\n',
        used: '✅ Использовано: {used}/{limit}\n',
        remaining: '⏳ Осталось: {remaining}\n',
        reset: '🔄 Сброс: Полночь\n',
        scope: '🌍 Область: Глобальная (все группы)\n',
        note: '\n💡 Примечание: Лимит убийств общий для ВСЕХ групп!'
    },
    es: {
        title: '🎯 Estadísticas de Asesinatos\n\n',
        used: '✅ Asesinatos Usados: {used}/{limit}\n',
        remaining: '⏳ Restantes: {remaining}\n',
        reset: '🔄 Reinicio: Medianoche\n',
        scope: '🌍 Alcance: Global (todos los grupos)\n',
        note: '\n💡 Nota: ¡Tu límite de asesinatos es compartido entre TODOS los grupos!'
    },
    pt: {
        title: '🎯 Estatísticas de Assassinatos\n\n',
        used: '✅ Assassinatos Usados: {used}/{limit}\n',
        remaining: '⏳ Restantes: {remaining}\n',
        reset: '🔄 Reinicia: Meia-noite\n',
        scope: '🌍 Escopo: Global (todos os grupos)\n',
        note: '\n💡 Nota: Seu limite de assassinatos é compartilhado entre TODOS os grupos!'
    },
    ar: {
        title: '🎯 إحصائيات القتل\n\n',
        used: '✅ المستخدم: {used}/{limit}\n',
        remaining: '⏳ المتبقي: {remaining}\n',
        reset: '🔄 التجديد: منتصف الليل\n',
        scope: '🌍 النطاق: عالمي (كل المجموعات)\n',
        note: '\n💡 ملاحظة: حد القتل مشترك بين كل المجموعات!'
    },
    hi: {
        title: '🎯 हत्या सांख्यिकी\n\n',
        used: '✅ उपयोग किया: {used}/{limit}\n',
        remaining: '⏳ शेष: {remaining}\n',
        reset: '🔄 रीसेट: आधी रात\n',
        scope: '🌍 दायरा: वैश्विक (सभी समूह)\n',
        note: '\n💡 नोट: आपकी हत्या सीमा सभी समूहों में साझा है!'
    },
    ng: {
        title: '🎯 Kill Statistics\n\n',
        used: '✅ Kills Wey You Don Use: {used}/{limit}\n',
        remaining: '⏳ Wetin Remain: {remaining}\n',
        reset: '🔄 E Go Reset: Midnight\n',
        scope: '🌍 Scope: Global (all groups)\n',
        note: '\n💡 Note: Your kill limit na for ALL groups!'
    }
};

export default {
    name: 'killstats',
    aliases: ['ks', 'killstat'],
    description: 'Check your daily kill statistics',
    
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const senderId = sender.split('@')[0];
        
        // Get language
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        // Get usage stats
        const stats = getUsageStats(senderId, 'kill');
        
        // Build response
        let response = t.title;
        response += t.used.replace('{used}', stats.used).replace('{limit}', stats.limit);
        response += t.remaining.replace('{remaining}', stats.remaining);
        response += t.reset;
        response += t.scope;
        response += t.note;
        
        await sock.sendMessage(from, {
            text: response,
            mentions: [sender]
        });
    }
};
