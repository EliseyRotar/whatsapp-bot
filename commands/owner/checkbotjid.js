import { config } from '../../config.js';
import { getBotNumber } from '../../utils/core/helpers.js';

export default {
    name: 'checkbotjid',
    description: 'Check bot JID and admin status (owner only)',
    ownerOnly: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        
        try {
            // Get bot info
            const botUserId = sock.user?.id || 'NOT AVAILABLE';
            const botNumber = getBotNumber(sock);
            
            let response = '🔍 Bot JID Debug Info\n\n';
            response += `📱 sock.user.id: ${botUserId}\n`;
            response += `🔢 Extracted number: ${botNumber}\n`;
            response += `⚙️ Config owner number: ${config.ownerNumber}\n`;
            response += `⚙️ Config owner JID: ${config.ownerJid}\n\n`;
            
            // If in a group, check admin status
            if (from.endsWith('@g.us')) {
                response += '👥 Group Info:\n';
                const groupMetadata = await sock.groupMetadata(from);
                response += `📊 Total participants: ${groupMetadata.participants.length}\n\n`;
                
                response += '👤 Bot/Owner in participants:\n';
                const ownerNumber = config.ownerNumber.replace(/\D/g, '');
                
                groupMetadata.participants.forEach(p => {
                    const participantId = p.id;
                    let participantNumber = participantId.split('@')[0];
                    if (participantNumber.includes(':')) {
                        participantNumber = participantNumber.split(':')[0];
                    }
                    participantNumber = participantNumber.replace(/\D/g, '');
                    
                    if (participantNumber === botNumber || participantNumber === ownerNumber) {
                        response += `✅ ${p.id}\n`;
                        response += `   Admin: ${p.admin || 'NO'}\n`;
                    }
                });
                
                // Check if bot is admin
                const participant = groupMetadata.participants.find(p => {
                    const participantId = p.id;
                    let participantNumber = participantId.split('@')[0];
                    if (participantNumber.includes(':')) {
                        participantNumber = participantNumber.split(':')[0];
                    }
                    participantNumber = participantNumber.replace(/\D/g, '');
                    return participantNumber === botNumber || participantNumber === ownerNumber;
                });
                
                if (participant) {
                    const isAdmin = participant.admin === 'admin' || participant.admin === 'superadmin';
                    response += `\n🎯 Bot Admin Status: ${isAdmin ? '✅ YES' : '❌ NO'}\n`;
                } else {
                    response += `\n❌ Bot/Owner not found in participants!\n`;
                }
            } else {
                response += '💬 This is a private chat, not a group.\n';
            }
            
            await sock.sendMessage(from, { text: response });
        } catch (error) {
            await sock.sendMessage(from, { 
                text: `❌ Error: ${error.message}` 
            });
        }
    }
};
