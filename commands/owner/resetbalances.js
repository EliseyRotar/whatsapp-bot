import { config } from '../../config.js';
import db from '../../utils/database/databaseV2.js';
import * as logger from '../../utils/monitoring/logger.js';

export default {
    name: 'resetbalances',
    aliases: ['resetbal', 'economyreset'],
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const senderNumber = sender.split('@')[0];
        
        // Owner-only command - check both OWNER_NUMBER and OWNER_JID
        const isOwner = senderNumber === config.ownerNumber || 
                       sender === config.ownerJid || 
                       sender === `${config.ownerNumber}@s.whatsapp.net`;
        
        if (!isOwner) {
            return await sock.sendMessage(from, {
                text: '❌ This command is owner-only!'
            });
        }
        
        try {
            // Confirmation check
            if (!args[0] || args[0].toLowerCase() !== 'confirm') {
                return await sock.sendMessage(from, {
                    text: `⚠️ ECONOMY RESET WARNING ⚠️\n\n` +
                          `This will reset ALL user balances to 500 coins!\n\n` +
                          `💎 Owner balance will remain infinite\n` +
                          `📊 Stats will be preserved\n` +
                          `🛒 Shop items will be preserved\n\n` +
                          `To confirm, use:\n.resetbalances confirm`
                });
            }
            
            await sock.sendMessage(from, {
                text: '⏳ Resetting economy...'
            });
            
            // Get all users
            const users = db.prepare('SELECT jid, phone_number, balance FROM users').all();
            const ownerJid = `${config.ownerNumber}@s.whatsapp.net`;
            
            let resetCount = 0;
            let skippedOwner = false;
            
            // Reset each user's balance
            for (const user of users) {
                // Skip owner
                if (user.jid === ownerJid || user.phone_number === config.ownerNumber) {
                    skippedOwner = true;
                    continue;
                }
                
                // Reset to 500 coins
                db.prepare('UPDATE users SET balance = 500 WHERE jid = ?').run(user.jid);
                resetCount++;
            }
            
            logger.info(`[ECONOMY] Balance reset performed by ${senderNumber}. ${resetCount} users reset.`);
            
            await sock.sendMessage(from, {
                text: `✅ ECONOMY RESET COMPLETE\n\n` +
                      `📊 Users reset: ${resetCount}\n` +
                      `💰 New balance: 500 coins\n` +
                      `${skippedOwner ? '💎 Owner balance: Preserved (infinite)\n' : ''}\n` +
                      `🎰 Slot machine has been rebalanced!\n\n` +
                      `Changes:\n` +
                      `• Multipliers reduced (20x max)\n` +
                      `• 8% house edge added (92% RTP)\n` +
                      `• Symbol distribution rebalanced\n` +
                      `• Cooldown increased to 3s\n` +
                      `• Win streak tracking enabled`
            });
            
        } catch (error) {
            logger.error('[RESETBALANCES] Error:', error);
            await sock.sendMessage(from, {
                text: `❌ Error resetting balances: ${error.message}`
            });
        }
    }
};
