// Omegle-style anonymous chat manager
// Pairs users randomly for anonymous conversations

class OmegleManager {
    constructor() {
        this.waitingQueue = []; // Users waiting to be paired
        this.activeChats = new Map(); // jid -> { partner: jid, startTime: timestamp }
        this.messageCount = new Map(); // Track messages per chat
    }

    // Add user to waiting queue
    addToQueue(userJid) {
        // Check if user is already in queue
        if (this.waitingQueue.includes(userJid)) {
            return { success: false, reason: 'already_in_queue' };
        }

        // Check if user is already in a chat
        if (this.activeChats.has(userJid)) {
            return { success: false, reason: 'already_in_chat' };
        }

        this.waitingQueue.push(userJid);
        return { success: true };
    }

    // Try to pair a user with someone from queue
    findPartner(userJid) {
        // Remove user from queue if they're there
        const userIndex = this.waitingQueue.indexOf(userJid);
        if (userIndex > -1) {
            this.waitingQueue.splice(userIndex, 1);
        }

        // Find another user in queue (not the same user)
        const availableUsers = this.waitingQueue.filter(jid => jid !== userJid);
        
        if (availableUsers.length === 0) {
            // No one available, add user back to queue
            this.waitingQueue.push(userJid);
            return null;
        }

        // Get random partner
        const partnerJid = availableUsers[Math.floor(Math.random() * availableUsers.length)];
        
        // Remove partner from queue
        const partnerIndex = this.waitingQueue.indexOf(partnerJid);
        if (partnerIndex > -1) {
            this.waitingQueue.splice(partnerIndex, 1);
        }

        // Create chat session
        const startTime = Date.now();
        this.activeChats.set(userJid, { partner: partnerJid, startTime });
        this.activeChats.set(partnerJid, { partner: userJid, startTime });
        this.messageCount.set(userJid, 0);
        this.messageCount.set(partnerJid, 0);

        return partnerJid;
    }

    // Get partner for a user
    getPartner(userJid) {
        const chat = this.activeChats.get(userJid);
        return chat ? chat.partner : null;
    }

    // Check if user is in active chat
    isInChat(userJid) {
        return this.activeChats.has(userJid);
    }

    // Check if user is in queue
    isInQueue(userJid) {
        return this.waitingQueue.includes(userJid);
    }

    // Increment message count
    incrementMessages(userJid) {
        const count = this.messageCount.get(userJid) || 0;
        this.messageCount.set(userJid, count + 1);
    }

    // Get chat stats
    getChatStats(userJid) {
        const chat = this.activeChats.get(userJid);
        if (!chat) return null;

        const duration = Math.floor((Date.now() - chat.startTime) / 1000);
        const messages = this.messageCount.get(userJid) || 0;

        return { duration, messages };
    }

    // End chat for a user
    endChat(userJid) {
        const chat = this.activeChats.get(userJid);
        if (!chat) return null;

        const partnerJid = chat.partner;

        // Remove both users from active chats
        this.activeChats.delete(userJid);
        this.activeChats.delete(partnerJid);

        // Clean up message counts
        this.messageCount.delete(userJid);
        this.messageCount.delete(partnerJid);

        // Remove from queue if present
        const userIndex = this.waitingQueue.indexOf(userJid);
        if (userIndex > -1) this.waitingQueue.splice(userIndex, 1);

        const partnerIndex = this.waitingQueue.indexOf(partnerJid);
        if (partnerIndex > -1) this.waitingQueue.splice(partnerIndex, 1);

        return partnerJid;
    }

    // Skip current partner and find new one
    skipPartner(userJid) {
        const oldPartner = this.endChat(userJid);
        return { oldPartner, newPartner: this.findPartner(userJid) };
    }

    // Get queue size
    getQueueSize() {
        return this.waitingQueue.length;
    }

    // Get active chats count
    getActiveChatCount() {
        return this.activeChats.size / 2; // Divide by 2 since each chat has 2 entries
    }

    // Get global stats
    getGlobalStats() {
        return {
            waiting: this.waitingQueue.length,
            activeChats: Math.floor(this.activeChats.size / 2),
            totalUsers: this.waitingQueue.length + this.activeChats.size
        };
    }
}

// Global instance
export const omegleManager = new OmegleManager();
