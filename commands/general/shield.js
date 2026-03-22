import { getShieldStatus } from '../../utils/economy/shieldSystem.js';
import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        title: '🛡️ SHIELD STATUS\n\n',
        noShield: '❌ No Active Shield\n\nYou don\'t have any shield protection!\n\n💡 Buy shields from .shop:\n• 🔵 shield_small - 50,000 coins\n• 💙 shield_large - 150,000 coins\n• 🌟 chug_jug - 500,000 coins',
        active: '✅ SHIELD ACTIVE\n\n{emoji} Type: {type}\n🛡️ Protection: {protection}%\n🔄 Uses Remaining: {uses}/{maxUses}\n⏰ Time Remaining: {hours}h {minutes}m\n\n💡 Your shield will protect you from .kill attacks!'
    },
    it: {
        title: '🛡️ STATO SCUDO\n\n',
        noShield: '❌ Nessuno Scudo Attivo\n\nNon hai protezione scudo!\n\n💡 Compra scudi dal .shop:\n• 🔵 shield_small - 50.000 monete\n• 💙 shield_large - 150.000 monete\n• 🌟 chug_jug - 500.000 monete',
        active: '✅ SCUDO ATTIVO\n\n{emoji} Tipo: {type}\n🛡️ Protezione: {protection}%\n🔄 Usi Rimanenti: {uses}/{maxUses}\n⏰ Tempo Rimanente: {hours}h {minutes}m\n\n💡 Il tuo scudo ti proteggerà dagli attacchi .kill!'
    },
    ru: {
        title: '🛡️ СТАТУС ЩИТА\n\n',
        noShield: '❌ Нет Активного Щита\n\nУ вас нет защиты щита!\n\n💡 Купите щиты в .shop:\n• 🔵 shield_small - 50,000 монет\n• 💙 shield_large - 150,000 монет\n• 🌟 chug_jug - 500,000 монет',
        active: '✅ ЩИТ АКТИВЕН\n\n{emoji} Тип: {type}\n🛡️ Защита: {protection}%\n🔄 Использований Осталось: {uses}/{maxUses}\n⏰ Времени Осталось: {hours}ч {minutes}м\n\n💡 Ваш щит защитит вас от атак .kill!'
    },
    es: {
        title: '🛡️ ESTADO DEL ESCUDO\n\n',
        noShield: '❌ Sin Escudo Activo\n\n¡No tienes protección de escudo!\n\n💡 Compra escudos en .shop:\n• 🔵 shield_small - 50,000 monedas\n• 💙 shield_large - 150,000 monedas\n• 🌟 chug_jug - 500,000 monedas',
        active: '✅ ESCUDO ACTIVO\n\n{emoji} Tipo: {type}\n🛡️ Protección: {protection}%\n🔄 Usos Restantes: {uses}/{maxUses}\n⏰ Tiempo Restante: {hours}h {minutes}m\n\n💡 ¡Tu escudo te protegerá de ataques .kill!'
    },
    pt: {
        title: '🛡️ STATUS DO ESCUDO\n\n',
        noShield: '❌ Sem Escudo Ativo\n\nVocê não tem proteção de escudo!\n\n💡 Compre escudos na .shop:\n• 🔵 shield_small - 50.000 moedas\n• 💙 shield_large - 150.000 moedas\n• 🌟 chug_jug - 500.000 moedas',
        active: '✅ ESCUDO ATIVO\n\n{emoji} Tipo: {type}\n🛡️ Proteção: {protection}%\n🔄 Usos Restantes: {uses}/{maxUses}\n⏰ Tempo Restante: {hours}h {minutes}m\n\n💡 Seu escudo irá protegê-lo de ataques .kill!'
    },
    ar: {
        title: '🛡️ حالة الدرع\n\n',
        noShield: '❌ لا يوجد درع نشط\n\nليس لديك حماية درع!\n\n💡 اشتري دروع من .shop:\n• 🔵 shield_small - 50,000 عملة\n• 💙 shield_large - 150,000 عملة\n• 🌟 chug_jug - 500,000 عملة',
        active: '✅ الدرع نشط\n\n{emoji} النوع: {type}\n🛡️ الحماية: {protection}%\n🔄 الاستخدامات المتبقية: {uses}/{maxUses}\n⏰ الوقت المتبقي: {hours}س {minutes}د\n\n💡 درعك سيحميك من هجمات .kill!'
    },
    hi: {
        title: '🛡️ शील्ड स्टेटस\n\n',
        noShield: '❌ कोई सक्रिय शील्ड नहीं\n\nआपके पास कोई शील्ड सुरक्षा नहीं है!\n\n💡 .shop से शील्ड खरीदें:\n• 🔵 shield_small - 50,000 कॉइन\n• 💙 shield_large - 150,000 कॉइन\n• 🌟 chug_jug - 500,000 कॉइन',
        active: '✅ शील्ड सक्रिय\n\n{emoji} प्रकार: {type}\n🛡️ सुरक्षा: {protection}%\n🔄 शेष उपयोग: {uses}/{maxUses}\n⏰ शेष समय: {hours}घं {minutes}मि\n\n💡 आपकी शील्ड आपको .kill हमलों से बचाएगी!'
    },
    ng: {
        title: '🛡️ SHIELD STATUS\n\n',
        noShield: '❌ No Active Shield\n\nYou no get shield protection!\n\n💡 Buy shields from .shop:\n• 🔵 shield_small - 50,000 coins\n• 💙 shield_large - 150,000 coins\n• 🌟 chug_jug - 500,000 coins',
        active: '✅ SHIELD DEY ACTIVE\n\n{emoji} Type: {type}\n🛡️ Protection: {protection}%\n🔄 Uses Wey Remain: {uses}/{maxUses}\n⏰ Time Wey Remain: {hours}h {minutes}m\n\n💡 Your shield go protect you from .kill attacks!'
    }
};

export default {
    name: 'shield',
    aliases: ['shld', 'protection'],
    description: 'Check your shield protection status',
    
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const userId = sender.split('@')[0];
        
        // Get language
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        try {
            const status = getShieldStatus(userId);
            
            if (!status.hasShield) {
                return await sock.sendMessage(from, {
                    text: t.title + t.noShield
                });
            }
            
            const message = t.title + t.active
                .replace('{emoji}', status.emoji)
                .replace('{type}', status.type.toUpperCase())
                .replace('{protection}', status.protection)
                .replace('{uses}', status.usesRemaining)
                .replace('{maxUses}', status.maxUses)
                .replace('{hours}', status.hoursRemaining)
                .replace('{minutes}', status.minutesRemaining);
            
            await sock.sendMessage(from, {
                text: message,
                mentions: [sender]
            });
            
        } catch (error) {
            console.error('[SHIELD] Command error:', error.message);
            await sock.sendMessage(from, {
                text: '❌ An error occurred checking your shield status.'
            });
        }
    }
};
