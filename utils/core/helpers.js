export async function isAdmin(sock, groupId, userId) {
    try {
        const groupMetadata = await sock.groupMetadata(groupId);
        const participant = groupMetadata.participants.find(p => p.id === userId);
        return participant?.admin === 'admin' || participant?.admin === 'superadmin';
    } catch {
        return false;
    }
}

export async function isBotAdmin(sock, groupId) {
    console.log('[BOT-ADMIN] ===== FUNCTION CALLED (NEW VERSION) =====');
    try {
        const groupMetadata = await sock.groupMetadata(groupId);
        
        // Use the new helper function to extract bot's phone number
        const botNumber = getBotNumber(sock);
        const botUserId = sock.user.id;
        
        console.log(`[BOT-ADMIN] Checking admin status...`);
        console.log(`[BOT-ADMIN] Bot user.id: ${botUserId}`);
        console.log(`[BOT-ADMIN] Extracted bot number: ${botNumber}`);
        
        // Import config to check owner number and JID
        const { config } = await import('../../config.js');
        const ownerNumber = config.ownerNumber.replace(/\D/g, '');
        const ownerJid = config.ownerJid;
        
        console.log(`[BOT-ADMIN] Owner number: ${ownerNumber}`);
        console.log(`[BOT-ADMIN] Owner JID: ${ownerJid}`);
        console.log(`[BOT-ADMIN] Total participants: ${groupMetadata.participants.length}`);
        
        // Log ALL participants to see the actual format
        console.log(`[BOT-ADMIN] ALL PARTICIPANTS:`);
        groupMetadata.participants.forEach((p, i) => {
            console.log(`[BOT-ADMIN]   ${i+1}. ${p.id} - admin: ${p.admin || 'NO'}`);
        });
        
        // Find the bot/owner in participants
        // Participants can be in different formats:
        // 1. Regular: number@s.whatsapp.net
        // 2. LID with phone: number:deviceId@lid
        // 3. LID only: deviceId@lid (NEW FORMAT!)
        const participant = groupMetadata.participants.find(p => {
            const participantId = p.id;
            
            // Extract the phone number from participant ID (if present)
            let participantNumber = participantId.split('@')[0];
            if (participantNumber.includes(':')) {
                participantNumber = participantNumber.split(':')[0];
            }
            participantNumber = participantNumber.replace(/\D/g, '');
            
            // Match by phone number (if participant has phone number)
            if (participantNumber && (participantNumber === botNumber || participantNumber === ownerNumber)) {
                return true;
            }
            
            // NEW: Match by LID (for participants in @lid format without phone)
            // Check if participant is the owner's LID
            if (participantId === ownerJid) {
                return true;
            }
            
            // Check if participant LID matches bot's LID
            // Bot: 393313444410:2@s.whatsapp.net or 393313444410:deviceId@lid
            // Participant: deviceId@lid
            if (botUserId.includes('@lid') && participantId.includes('@lid')) {
                const botLid = botUserId.split(':')[1]; // Get deviceId@lid part
                if (botLid === participantId) {
                    return true;
                }
            }
            
            return false;
        });
        
        if (!participant) {
            console.log(`[BOT-ADMIN] Bot/owner not found in participants!`);
            console.log(`[BOT-ADMIN] All participants:`, groupMetadata.participants.map(p => p.id));
            return false;
        }
        
        console.log(`[BOT-ADMIN] Found bot/owner participant: ${participant.id}, admin: ${participant.admin}`);
        const isAdmin = participant.admin === 'admin' || participant.admin === 'superadmin';
        console.log(`[BOT-ADMIN] Final result: ${isAdmin}`);
        return isAdmin;
    } catch (error) {
        console.error('[BOT-ADMIN] Error:', error);
        return false;
    }
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function extractMentions(text) {
    const mentions = text.match(/@(\d+)/g);
    return mentions ? mentions.map(m => m.slice(1) + '@s.whatsapp.net') : [];
}

/**
 * Extract bot's phone number from sock.user.id
 * Handles all JID formats: regular, multi-device, and LID
 * @param {object} sock - WhatsApp socket connection
 * @returns {string} Bot's phone number (digits only)
 */
export function getBotNumber(sock) {
    if (!sock?.user?.id) return '';
    // Format can be: number@s.whatsapp.net, number:device@s.whatsapp.net, or number:device@lid
    return sock.user.id.split(':')[0].split('@')[0].replace(/\D/g, '');
}

/**
 * Extract bot's JID (for backward compatibility with existing code)
 * Note: This may not match exact participant IDs in groups due to device IDs
 * Use getBotNumber() for reliable matching
 * @param {object} sock - WhatsApp socket connection
 * @returns {string} Bot's JID
 */
export function getBotJid(sock) {
    if (!sock?.user?.id) return '';
    // Remove device ID for backward compatibility
    // Note: This may not work correctly with LID format
    return sock.user.id.split(':')[0] + '@s.whatsapp.net';
}
