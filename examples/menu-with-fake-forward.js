/**
 * Example: Menu command using fake forward
 * 
 * This shows how to make your menu look like it's forwarded from a channel,
 * just like popular WhatsApp bots do!
 */

import { sendAsChannelForward, sendFakeForwardWithPreview } from '../utils/fakeForward.js';
import { config } from '../config.js';
import { getGroupLanguage } from '../utils/language.js';

export default {
    name: 'menu',
    aliases: ['help', 'commands'],
    description: 'Show bot menu with fake forward',
    category: 'general',
    async execute(sock, msg, args) {
        const chatId = msg.key.remoteJid;
        const lang = getGroupLanguage(chatId);
        
        // Build your menu text (same as before)
        const menuText = `
╔═══════════════════════════╗
║   🤖 ${config.botName} - Menu   ║
╚═══════════════════════════╝

┌─ 🌐 GENERAL COMMANDS
│
├ .ping - Check bot latency
├ .alive - Bot status & uptime
├ .ai <question> - Ask AI anything
├ .menu - Show this menu
├ .info - Bot information
├ .stats - Server statistics
└ .sticker - Make sticker (reply to image)

┌─ 💰 ECONOMY & SHOP
│
├ .bank - Check your balance
├ .daily - Claim daily coins (100-300)
├ .pay @user <amount> - Send coins
├ .shop - Virtual shop
└ .leaderboard - Top players

┌─ 🎮 GAMES & GAMBLING
│
├ .games - List all games
├ .slot [bet] - Slot machine
├ .dice [bet] - Roll dice
├ .coinflip <h/t> [bet] - Flip coin
├ .rps <choice> - Rock Paper Scissors
├ .bj <bet> - Blackjack
└ .chess [@user] - Play chess

┌─ 👮 ADMIN COMMANDS (Groups)
│
├ .kick @user - Remove user
├ .ban @user - Ban user
├ .promote @user - Make admin
├ .demote @user - Remove admin
├ .warn @user - Warn user
├ .mute <minutes> - Mute group
├ .tagall <msg> - Tag everyone
├ .antilink <on/off> - Link protection
└ .welcome <on/off> - Welcome messages

╔═══════════════════════════╗
║  Prefix: ${config.prefix}  |  Owner: ${config.ownerName}  ║
╚═══════════════════════════╝

💡 Tips:
   • Reply to messages for: .sticker, .delete, .vv
   • Admin commands require permissions
   • Use "all" to bet all coins: .slot all

📱 Bot Owner: ${config.ownerName} (+${config.ownerNumber})
        `.trim();
        
        // METHOD 1: Simple fake forward (most common)
        await sendAsChannelForward(sock, chatId, menuText, {
            quoted: msg  // Reply to the user's message
        });
        
        // METHOD 2: With link preview (more fancy)
        // Uncomment to use this instead:
        /*
        await sendFakeForwardWithPreview(
            sock,
            chatId,
            menuText,
            {
                title: `🤖 ${config.botName}`,
                body: 'Full command list',
                thumbnailUrl: 'https://i.imgur.com/yourlogo.png', // Your bot logo
                sourceUrl: 'https://wa.me/393313444410' // Your contact link
            },
            {
                quoted: msg
            }
        );
        */
    }
};
