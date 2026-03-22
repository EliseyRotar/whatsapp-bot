import { cancelGuide } from './guide.js';
import * as logger from '../../utils/logger.js';

export default {
    name: 'stopguide',
    aliases: ['cancelguide', 'skipguide'],
    category: 'general',
    desc: 'Cancel the guide language selection',
    
    async execute(sock, msg, args) {
        const sender = msg.key.remoteJid;
        const isGroup = sender.endsWith('@g.us');
        
        // Only works in private chat
        if (isGroup) {
            return await sock.sendMessage(sender, {
                text: '❌ This command only works in private chat.'
            }, { quoted: msg });
        }
        
        try {
            const cancelled = cancelGuide(sender);
            
            if (cancelled) {
                await sock.sendMessage(sender, {
                    text: '✅ Guide cancelled. You can start again anytime with .guide'
                }, { quoted: msg });
                
                logger.info('Guide cancelled', { sender });
            } else {
                await sock.sendMessage(sender, {
                    text: '❌ No active guide to cancel. Use .guide to start.'
                }, { quoted: msg });
            }
            
        } catch (error) {
            logger.error('Error cancelling guide', { sender, error: error.message });
            await sock.sendMessage(sender, {
                text: '❌ An error occurred while cancelling the guide.'
            }, { quoted: msg });
        }
    }
};
