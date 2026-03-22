import { sendAsChannelForward } from '../../utils/fakeForward.js';
import { config } from '../../config.js';

export default {
    name: 'testforward',
    aliases: ['tf'],
    description: 'Test fake forward with View Channel button',
    category: 'general',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;

        const testMessage = `
╔═══════════════════════════╗
║   🤖 TEST FORWARD   ║
╚═══════════════════════════╝

✅ This message looks like it's forwarded from a channel!

📱 You should see:
   • "Forwarded" label at the top
   • "View Channel" button at the bottom

🎯 This is how popular bots do it!

╔═══════════════════════════╗
║  ${config.botName}  ║
╚═══════════════════════════╝
        `.trim();

        try {
            await sendAsChannelForward(sock, from, testMessage, {
                quoted: msg,
                newsletterName: config.botName || 'Bot Channel'
            });
        } catch (error) {
            console.error('[TESTFORWARD] Error:', error);
            await sock.sendMessage(from, {
                text: `❌ Error: ${error.message}\n\nMake sure you have the newsletter JID configured in utils/fakeForward.js`
            });
        }
    }
};
