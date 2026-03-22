import { startOnboarding, sendQuickStart } from '../../utils/onboarding.js';
import { getUserLanguage } from '../../utils/databaseV2.js';

export default {
    name: 'start',
    aliases: ['tutorial', 'onboard', 'guide'],
    description: 'Start the onboarding tutorial',
    usage: '.start [quick]',
    category: 'general',
    
    async execute(sock, msg, args) {
        const sender = msg.key.participant || msg.key.remoteJid;
        const userLang = getUserLanguage(sender);
        
        // If 'quick' argument, send quick start guide
        if (args[0] === 'quick') {
            await sendQuickStart(sock, sender, userLang);
        } else {
            // Start full onboarding
            await startOnboarding(sock, sender, userLang);
        }
    }
};
