export default {
    name: 'test',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const sender = msg.key.participant || msg.key.remoteJid;
        
        const testMessage = `✅ Bot is working!\n\n` +
            `📍 Chat Type: ${isGroup ? 'GROUP' : 'PRIVATE'}\n` +
            `👤 Your ID: ${sender}\n` +
            `💬 Chat ID: ${from}\n` +
            `🤖 Bot is responding to your message!`;
        
        await sock.sendMessage(from, { text: testMessage });
    }
};
