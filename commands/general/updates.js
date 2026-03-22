import { config } from '../../config.js';
import { getGroupLanguage } from '../../utils/language.js';
import { sendAsChannelForward } from '../../utils/fakeForward.js';

const responses = {
    en: {
        title: '╔═══════════════════════════╗\n║   📋 BOT UPDATES   ║\n╚═══════════════════════════╝',
        latest: '\n🆕 LATEST UPDATE',
        version: '📌 Version:',
        date: '📅 Date:',
        changes: '✨ Changes:',
        previous: '\n\n📜 PREVIOUS UPDATES',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n💡 Stay tuned for more updates!'
    },
    it: {
        title: '╔═══════════════════════════╗\n║   📋 AGGIORNAMENTI BOT   ║\n╚═══════════════════════════╝',
        latest: '\n🆕 ULTIMO AGGIORNAMENTO',
        version: '📌 Versione:',
        date: '📅 Data:',
        changes: '✨ Modifiche:',
        previous: '\n\n📜 AGGIORNAMENTI PRECEDENTI',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n💡 Resta sintonizzato per altri aggiornamenti!'
    },
    ru: {
        title: '╔═══════════════════════════╗\n║   📋 ОБНОВЛЕНИЯ БОТА   ║\n╚═══════════════════════════╝',
        latest: '\n🆕 ПОСЛЕДНЕЕ ОБНОВЛЕНИЕ',
        version: '📌 Версия:',
        date: '📅 Дата:',
        changes: '✨ Изменения:',
        previous: '\n\n📜 ПРЕДЫДУЩИЕ ОБНОВЛЕНИЯ',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n💡 Следите за новыми обновлениями!'
    },
    es: {
        title: '╔═══════════════════════════╗\n║   📋 ACTUALIZACIONES BOT   ║\n╚═══════════════════════════╝',
        latest: '\n🆕 ÚLTIMA ACTUALIZACIÓN',
        version: '📌 Versión:',
        date: '📅 Fecha:',
        changes: '✨ Cambios:',
        previous: '\n\n📜 ACTUALIZACIONES ANTERIORES',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n💡 ¡Mantente atento a más actualizaciones!'
    },
    pt: {
        title: '╔═══════════════════════════╗\n║   📋 ATUALIZAÇÕES BOT   ║\n╚═══════════════════════════╝',
        latest: '\n🆕 ÚLTIMA ATUALIZAÇÃO',
        version: '📌 Versão:',
        date: '📅 Data:',
        changes: '✨ Mudanças:',
        previous: '\n\n📜 ATUALIZAÇÕES ANTERIORES',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n💡 Fique atento a mais atualizações!'
    },
    ar: {
        title: '╔═══════════════════════════╗\n║   📋 تحديثات البوت   ║\n╚═══════════════════════════╝',
        latest: '\n🆕 آخر تحديث',
        version: '📌 الإصدار:',
        date: '📅 التاريخ:',
        changes: '✨ التغييرات:',
        previous: '\n\n📜 التحديثات السابقة',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n💡 استنى تحديثات أكتر!'
    },
    hi: {
        title: '╔═══════════════════════════╗\n║   📋 बॉट अपडेट   ║\n╚═══════════════════════════╝',
        latest: '\n🆕 नवीनतम अपडेट',
        version: '📌 संस्करण:',
        date: '📅 तिथि:',
        changes: '✨ परिवर्तन:',
        previous: '\n\n📜 पिछले अपडेट',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n💡 अधिक अपडेट के लिए बने रहें!'
    },
    ng: {
        title: '╔═══════════════════════════╗\n║   📋 BOT UPDATES   ║\n╚═══════════════════════════╝',
        latest: '\n🆕 LATEST UPDATE',
        version: '📌 Version:',
        date: '📅 Date:',
        changes: '✨ Changes:',
        previous: '\n\n📜 PREVIOUS UPDATES',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n💡 Stay tuned for more updates!'
    }
};

// Update history - Add new updates at the top
const updates = {
    en: [
        {
            version: 'v4.8.0',
            date: 'March 19, 2026',
            changes: [
                '🎰 SLOT MACHINE — COMPLETE OVERHAUL',
                '🎨 3-Row Reel Display (top/middle/bottom, middle = payline)',
                '💎 Progressive Jackpot — shared pool, 2% of losses contribute',
                '  • 💎💎💎 wins entire jackpot pool + 100x bet',
                '🔔 Free Spins — 🔔🔔🔔 triggers 5 auto-played free spins',
                '🛒 Shop boosts now work in slot (luck + coin multipliers)',
                '📊 New .slotstats command — track spins, wins, jackpots, streaks',
                '⚖️ "All in" bets your entire balance (no cap)',
                '🌍 All features in 8 languages'
            ]
        },
        {
            version: 'v4.7.0',
            date: 'March 19, 2026',
            changes: [
                '🔧 FIXES & NEW FEATURES',
                '🖼️ .kill Image Fix',
                '  • Profile picture now shows correctly under WASTED overlay',
                '  • Fixed: image was rendering on black background (JPEG alpha bug)',
                '  • Compositing now done fully in memory — no temp files',
                '🔇 .mode — Per-Chat Toggle',
                '  • .mode private — disables bot in this chat/group only',
                '  • .mode public — re-enables bot in this chat/group',
                '  • Owner can still use commands in disabled chats',
                '🌐 New: .botoff / .boton — Global Toggle',
                '  • .botoff — disables bot for ALL chats and groups at once',
                '  • .boton — re-enables bot globally',
                '  • Owner-only commands',
                '📞 Auto Call Reject',
                '  • Bot auto-declines incoming WhatsApp calls',
                '  • Sends auto-reply in 8 languages',
                '  • Toggle with .autocall on/off (owner only)',
                '  • Off by default',
                '🌍 All features in 8 languages'
            ]
        },
        {
            version: 'v4.6.0',
            date: 'March 11, 2026',
            changes: [
                '🛡️ SHIELD DEFENSE SYSTEM ADDED',
                '✨ New Features',
                '  • Fortnite-inspired shield system for .kill command',
                '  • 3 shield types: Small (25%), Large (50%), Chug Jug (100%)',
                '  • Percentage-based protection with durability system',
                '  • New .shield command to check protection status',
                '🛡️ Shield Types',
                '  • 🔵 Small Shield - 50k coins, 25% protection, 2 blocks, 24h',
                '  • 💙 Large Shield - 150k coins, 50% protection, 3 blocks, 24h',
                '  • 🌟 Chug Jug - 500k coins, 100% protection, 1 block, 48h',
                '🎮 How It Works',
                '  • Buy shields from .shop',
                '  • Shield activates immediately',
                '  • Blocks .kill attacks based on protection %',
                '  • Uses decrease on block (1.0) or fail (0.5)',
                '  • Attacker loses weapon regardless',
                '🐛 Bug Fixes',
                '  • Fixed hardcoded English messages in kill command',
                '  • Added 36 missing translations (21 messages + 15 shop items)',
                '  • Fixed template string syntax error',
                '  • All shield messages now properly internationalized',
                '🌍 Full multilingual support in 8 languages',
                '📝 Commands: .shop buy shield_small/shield_large/chug_jug, .shield'
            ]
        },
        {
            version: 'v4.5.0',
            date: 'March 9, 2026',
            changes: [
                '🚨 EMERGENCY BANK RESTORE & BUG FIXES',
                '✅ Critical Issues Resolved',
                '  • All user bank accounts restored from backup',
                '  • 558 users with full balances recovered',
                '  • Dual banking system (JSON + SQLite) synchronized',
                '  • Emergency restore script created for future use',
                '🐛 50+ Missing Await Bugs Fixed',
                '  • Fixed all async bank operations (getBalance, addCoins, removeCoins)',
                '  • Mines game: 7 fixes',
                '  • Blackjack: 15+ fixes',
                '  • Blackjack actions (hit, stand, double, split, insurance, surrender): 20 fixes',
                '  • Daily rewards: 2 fixes',
                '  • Bulk buy: 3 fixes',
                '  • All [object Promise] errors eliminated',
                '📊 Impact',
                '  • 0 data loss - all accounts restored',
                '  • 50+ critical bugs fixed',
                '  • All balance displays now work correctly',
                '  • Shop purchases show correct balances',
                '  • Game winnings/losses display properly',
                '🛡️ Safety Measures',
                '  • emergency-bank-restore.js script created',
                '  • Multiple backup sources verified',
                '  • Complete documentation added',
                '  • Both systems now synchronized',
                '📝 Documentation',
                '  • Professional README.md created (364 lines)',
                '  • All .md files organized in docs/ folder',
                '  • Emergency restore guide added',
                '  • 109 commands documented',
                '🌍 All fixes in 7 languages'
            ]
        },
        {
            version: 'v4.4.0',
            date: 'March 8, 2026',
            changes: [
                '🛡️ CRITICAL SECURITY & BUG FIXES',
                '🔒 Security Improvements',
                '  • Thread-safe bank operations with file locking',
                '  • Race condition prevention (no more coin duplication)',
                '  • Integer overflow protection in all calculations',
                '  • Comprehensive input validation system',
                '  • Memory leak prevention with automatic cleanup',
                '🎮 Game Exploit Fixes',
                '  • ✅ Negative bet exploit PATCHED (infinite money blocked)',
                '  • ✅ Zero bet exploit PATCHED (free play blocked)',
                '  • ✅ Float truncation exploit PATCHED (limit bypass blocked)',
                '  • ✅ Buybulk overflow exploit PATCHED (free items blocked)',
                '  • ✅ Roulette payout bug FIXED (players no longer lose on wins)',
                '⚡ Performance & Stability',
                '  • All bank operations now properly async/await',
                '  • Cooldown memory cleanup (prevents memory leaks)',
                '  • Timeout leak prevention in rob system',
                '  • Error recovery with automatic bet refunds',
                '  • Message edit error handling (no crashes)',
                '🎯 Game-Specific Fixes',
                '  • Coinflip: Fixed missing await, validation, error handling',
                '  • Dice: Fixed missing await, validation, error handling',
                '  • Roulette: Fixed payout calculation, case sensitivity, validation',
                '  • Rob: Added protection import, cooldown cleanup',
                '  • Mines: Enhanced position validation with bounds checking',
                '  • Buybulk: Overflow protection, safe multiplication',
                '📦 New Utility Module',
                '  • utils/gameValidation.js created',
                '  • validateBet() - Prevents all bet exploits',
                '  • validateQuantity() - Safe quantity validation',
                '  • safeMultiply() - Overflow-safe arithmetic',
                '  • validateGridPosition() - Grid game validation',
                '  • normalizeBetType() - Case-insensitive bet types',
                '📊 Impact & Results',
                '  • 12 critical/high severity bugs fixed',
                '  • 5 major money exploits patched',
                '  • 100% race condition elimination',
                '  • Memory usage now stable over time',
                '  • Security score improved: 85/100 → 95/100',
                '  • 0 syntax errors, all tests passing',
                '🌍 All fixes work in 7 languages'
            ]
        },
        {
            version: 'v4.3.0',
            date: 'March 7, 2026',
            changes: [
                '💣 MINES GAME - MOST REQUESTED FEATURE!',
                '🎮 New Casino Game: .mines',
                '  • 5x5 grid minesweeper-style gameplay',
                '  • Choose 1-24 mines for risk/reward balance',
                '  • Progressive multiplier system (up to 1000x+)',
                '  • Cash out anytime to secure winnings',
                '  • Perfect mathematical probability (97% RTP)',
                '  • Beautiful ASCII grid visualization',
                '💎 Advanced Features',
                '  • Real-time multiplier calculations',
                '  • Statistics tracking (wins, losses, best streaks)',
                '  • Shop integration (luck boosts increase safe tile chance)',
                '  • Coin multipliers apply to all winnings',
                '  • Achievement-ready system',
                '📊 Strategy Levels',
                '  • 1-5 mines = Easy (safer, 1.2x-5x multipliers)',
                '  • 6-15 mines = Medium (balanced, 5x-50x multipliers)',
                '  • 16-24 mines = Hard (extreme risk, 50x-1000x+ multipliers)',
                '🌍 Full multi-language support (7 languages)'
            ]
        },
        {
            version: 'v4.2.0',
            date: 'March 7, 2026',
            changes: [
                '🎯 DAILY LIMITS & BULK BUY SYSTEM',
                '⏰ Daily Limits Added',
                '  • .kill command: 5 uses per day',
                '  • .rob command: 15 uses per day',
                '  • Auto-resets at midnight',
                '  • Shows remaining uses when limit reached',
                '  • Prevents spam and maintains economy balance',
                '🛒 Bulk Weapon Purchase (.buybulk)',
                '  • Buy 1-1000 weapons at once',
                '  • Tiered discounts: 5+ (5%), 10+ (10%), 25+ (15%), 50+ (20%), 100+ (25%)',
                '  • Usage: .buybulk <weapon> <quantity>',
                '  • Example: .buybulk pistol 10',
                '  • Shows total savings and discount percentage',
                '🎮 Enhanced Game Commands',
                '  • .bank now mentions .blackjack, .chess, and .games',
                '  • Robbery messages include "Use .kill for revenge!"',
                '  • Fight messages include revenge option',
                '  • Better game discovery and engagement',
                '💰 Economy Improvements',
                '  • Usage tracking system for daily limits',
                '  • Bulk discounts encourage strategic purchases',
                '  • Fair play mechanics prevent abuse',
                '🌍 All features in 7 languages'
            ]
        },
        {
            version: 'v4.1.0',
            date: 'March 7, 2026',
            changes: [
                '🔧 BUG FIXES & IMPROVEMENTS',
                '✅ Fixed .guide Command',
                '  • Now properly responds to language selection',
                '  • Fixed WhatsApp dual JID format handling (@lid and @s.whatsapp.net)',
                '  • Stores pending state for both JID formats',
                '  • Works correctly after bot restart',
                '🚫 Fixed Old Message Processing',
                '  • Bot no longer responds to old messages after restart',
                '  • Only processes real-time messages (notify type)',
                '  • Ignores synced messages (append type)',
                '  • 5-second buffer for timing accuracy',
                '🏆 Fixed Leaderboard Command',
                '  • Now properly mentions users with their names',
                '  • Works across all groups, not just current one',
                '  • Fetches participants from all bot groups',
                '  • Handles both @lid and @s.whatsapp.net formats',
                '  • Fallback to both formats if user not found',
                '📝 Technical Improvements',
                '  • Fixed timestamp conversion in guide handler',
                '  • Removed conflicting command aliases',
                '  • Added comprehensive JID mapping system',
                '  • Enhanced error logging for debugging',
                '🌍 All fixes work in 7 languages'
            ]
        },
        {
            version: 'v4.0.0',
            date: 'March 7, 2026',
            changes: [
                '🚀 MAJOR SYSTEM UPGRADE - Enterprise Features!',
                '💾 SQLite Database - Migrated from JSON to SQLite',
                '  • Transactions for data integrity',
                '  • Foreign keys and indexes',
                '  • WAL mode for concurrent access',
                '  • 548 users, 12 groups migrated successfully',
                '📝 Input Validation System',
                '  • Prevents SQL injection, XSS, command injection',
                '  • Rate limiting with configurable windows',
                '  • Sanitizes all user inputs',
                '  • Validates amounts, JIDs, URLs, languages',
                '📊 Enhanced Analytics Dashboard',
                '  • Command popularity tracking',
                '  • Hourly/daily activity patterns',
                '  • Error rate calculation',
                '  • Response time tracking',
                '  • Peak hours identification',
                '  • Top commands, users, and groups',
                '📋 Winston Logging System',
                '  • Daily rotating log files',
                '  • Separate error, command, and combined logs',
                '  • 14-30 day retention',
                '  • Structured JSON logging',
                '⚡ Message Queue System',
                '  • Bull queue with Redis backend',
                '  • Priority-based processing',
                '  • Retry logic with exponential backoff',
                '  • Fallback to in-memory queue',
                '🎮 Interactive Messages',
                '  • Button messages with fallback',
                '  • List menus with sections',
                '  • Quick reply buttons',
                '  • Pre-built games and admin menus',
                '👋 Onboarding System',
                '  • 6-step guided tour for new users',
                '  • 500 coin welcome gift',
                '  • .start command for manual trigger',
                '  • Quick start guide',
                '🏆 Tournament System',
                '  • Single-elimination and round-robin formats',
                '  • Entry fees and prize pools',
                '  • Automatic bracket generation',
                '  • .tournament command with 5 subcommands',
                '  • Prize distribution (50%/30%/20%)',
                '🎖️ Achievement System',
                '  • 11 achievements across 5 categories',
                '  • Automatic unlocking with rewards',
                '  • Progress tracking',
                '  • .achievements command',
                '  • Economy, Blackjack, Daily, Social, Tournament',
                '📚 Documentation Organized',
                '  • 106 markdown files organized into docs/',
                '  • Structured navigation',
                '  • Features, guides, setup, troubleshooting',
                '🧪 Testing Infrastructure',
                '  • Vitest testing framework',
                '  • Database and validation tests',
                '  • Coverage reporting',
                '🌍 All features in 7 languages',
                '  • English, Italian, Spanish, Portuguese',
                '  • Russian, Arabic, Hindi'
            ]
        },
        {
            version: 'v3.15.0',
            date: 'March 6, 2026',
            changes: [
                '🎰 SLOT MACHINE OVERHAUL - More exciting gameplay!',
                '💎 8 payout tiers (4x to 100x multipliers)',
                '🔥 Win streak system with bonus rewards',
                '⚡ Streak bonuses: 2 wins = +10%, 3 = +25%, 4+ = +50%',
                '🎨 Beautiful new visual design with borders',
                '😱 "Near miss" detection for close calls',
                '📊 Payout table shown when playing for fun',
                '💰 Better symbol payouts:',
                '  • 💎💎💎 = 100x (Jackpot)',
                '  • 7️⃣7️⃣7️⃣ = 50x (Mega Win)',
                '  • 🔔🔔🔔 = 25x (Big Win)',
                '  • 🍇🍇🍇 = 15x (Great Win)',
                '  • 🍊🍊🍊 = 10x (Good Win)',
                '  • 🍋🍋🍋 = 6x (Nice Win)',
                '  • 🍒🍒🍒 = 4x (Small Win)',
                '  • Any 2 = 2x (Tiny Win)',
                '🌍 All improvements in 6 languages',
                '🛡️ Anti-Rob duration: 14 days → 2 days',
                '🏪 Shop now shows "How to Buy" at top'
            ]
        },
        {
            version: 'v3.14.0',
            date: 'March 5, 2026',
            changes: [
                '🎡 WHEEL OF FORTUNE - Daily rewards reimagined!',
                '🎰 .daily now spins a prize wheel (50-10,000 coins)',
                '🎲 8 prize tiers with varying chances',
                '✨ Animated spinning wheel (3 frames)',
                '🌟 Special jackpot celebration for 10k prize',
                '🎯 Aliases: .wheel, .spin',
                '💸 WEAPON PRICE INCREASE (5x):',
                '• Knife: 5k → 25k coins',
                '• Pistol: 15k → 75k coins',
                '• Rifle: 35k → 175k coins',
                '• Sniper: 75k → 350k coins',
                '• RPG: 150k → 750k coins',
                '🔥 Maintains daily streak system',
                '🌍 Full 6-language support'
            ]
        },
        {
            version: 'v3.13.0',
            date: 'March 5, 2026',
            changes: [
                '💀 KILL SYSTEM - GTA-style player elimination',
                '🔫 .kill command - Attack other players with weapons',
                '🛒 5 weapon types in shop: Knife, Pistol, Rifle, Sniper, RPG',
                '🎯 Success rates: 30%-95% based on weapon power',
                '💰 Weapon prices: 5k-150k coins (single-use)',
                '📈 Boosts affect kill chance (Lucky Charm, VIP, etc.)',
                '💀 WASTED effect on victim profile picture',
                '💸 Victim loses 10k coins when killed',
                '🔇 Victim muted for 5 minutes (auto-delete messages)',
                '⚠️ Weapons lost even if attack fails',
                '🎲 Max 98% success rate (never guaranteed)'
            ]
        },
        {
            version: 'v3.12.0',
            date: 'March 4, 2026',
            changes: [
                '🎰 Roulette Casino game added',
                '🎲 European Roulette with single 0 (0-36)',
                '💰 9 bet types: Red/Black, Odd/Even, Low/High (1:1)',
                '📊 Dozens, Columns (2:1), Straight Up (35:1)',
                '🎯 .roulette command with .rlt alias',
                '🌍 Full multi-language support (6 languages)',
                '✨ Animated spinning wheel (2 seconds)',
                '🔴 Color-coded results (red, black, green)',
                '💵 Betting limits: 10-1,000,000 coins',
                '🏦 Full bank system integration',
                '📈 2.7% house edge (European standard)'
            ]
        },
        {
            version: 'v3.11.0',
            date: 'March 4, 2026',
            changes: [
                '🚀 VIRAL FEATURES - Make the bot famous!',
                '💸 .pay command - Send coins to friends',
                '🎁 .daily command - Claim 100-300 coins daily',
                '👥 .invite command - Referral system (500 coins per 3 friends)',
                '🏆 .leaderboard command - Competition rankings',
                '📊 Track top players by balance, wins, winnings, referrals',
                '🔥 Daily streak bonuses up to +200 coins',
                '💰 Payment system creates social economy',
                '🎯 Built-in viral growth mechanics'
            ]
        },
        {
            version: 'v3.10.0',
            date: 'March 3, 2026',
            changes: [
                '🎰 ALL IN BETTING - Bet everything with "all"',
                '💰 .slot all, .dice all, .coin all heads',
                '🔧 Fixed .manage command mention parsing',
                '👥 Added .addall bulk member command',
                '📰 Newsletter system with API integration',
                '♟️ Chess game fixes and improvements'
            ]
        },
        {
            version: 'v3.8.0',
            date: 'March 3, 2026',
            changes: [
                '⚔️ Added .fight command - Defend against robberies!',
                '🎯 30 seconds to fight back when robbed',
                '💪 Base 50% success rate + luck boosts',
                '🏆 Win: Keep coins + 50% bonus + robber fined',
                '💔 Lose: Robber gets the coins',
                '🎰 Slot machine rebalanced for challenge',
                '📉 Diamond chance: 15% → 5%',
                '📉 Seven chance: 15% → 7%',
                '📉 Triple match: 15% → 10%',
                '💰 Shop prices increased 40-75%',
                '🛡️ Anti-Rob now 100k coins (was 30k)',
                '💎 All items more valuable and strategic'
            ]
        },
        {
            version: 'v3.7.0',
            date: 'March 2, 2026',
            changes: [
                '➕ Added .add command - Add members to group',
                '👥 Anyone can use .add (not just admins)',
                '📱 Supports multiple phone numbers at once',
                '⚠️ Enhanced .warn command',
                '🚨 .warn all <reason> - Warn everyone',
                '🧹 .warnings clear all - Clear all warnings',
                '👁️ Auto-VV now reveals to group',
                '📢 View-once messages shown to everyone',
                '🏷️ Shows sender with @mention'
            ]
        },
        {
            version: 'v3.5.0',
            date: 'February 25, 2026',
            changes: [
                '🤖 AI Assistant integrated (Groq)',
                '💬 .ai command - Ask anything',
                '🧠 Meta Llama 3.3 70B model',
                '🌍 Multi-language AI support',
                '🎰 Slot machine luck improved 30%',
                '👥 .tagadmin command added'
            ]
        },
        {
            version: 'v3.4.0',
            date: 'February 15, 2026',
            changes: [
                '🏆 Added blackjack leaderboard',
                '📊 Top 5 players per category',
                '💰 Profit, wins, win rate, blackjacks',
                '🥇 Medal system for rankings',
                '🌍 Multi-language support'
            ]
        },
        {
            version: 'v3.3.0',
            date: 'February 15, 2026',
            changes: [
                '🎩 Added dealer personality system',
                '💬 Dealer talks during games',
                '🎯 Contextual messages for every situation',
                '🌍 Multi-language dealer messages',
                '✨ More immersive casino experience'
            ]
        },
        {
            version: 'v3.2.0',
            date: 'February 15, 2026',
            changes: [
                '🎴 Enhanced card graphics with Unicode',
                '🎨 Beautiful card-shaped displays',
                '♠️ Clear suit symbols',
                '📐 Full-size and compact modes',
                '✨ Professional casino appearance'
            ]
        },
        {
            version: 'v3.1.0',
            date: 'February 15, 2026',
            changes: [
                '🎰 Added multi-hand blackjack (2-5 hands)',
                '🎮 New .hand command to switch hands',
                '💰 Each hand costs the bet amount',
                '🎯 Play hands independently',
                '✨ Works with side bets'
            ]
        },
        {
            version: 'v3.0.0',
            date: 'February 15, 2026',
            changes: [
                '🎲 Added blackjack side bets',
                '🎴 Perfect Pairs side bet (25:1, 12:1, 6:1)',
                '🃏 21+3 poker-style side bet (up to 100:1)',
                '💰 5 coins per side bet',
                '🎯 Can play both simultaneously'
            ]
        },
        {
            version: 'v2.9.0',
            date: 'February 15, 2026',
            changes: [
                '📊 Added blackjack statistics tracking',
                '🎯 New .bjstats command',
                '📈 Tracks wins, losses, pushes, blackjacks, busts',
                '💰 Shows total wagered, won, lost, net profit',
                '📊 Displays win rate percentage'
            ]
        },
        {
            version: 'v2.8.0',
            date: 'February 15, 2026',
            changes: [
                '🎬 Added card dealing animations to blackjack',
                '🃏 Animated card drawing in .hit command',
                '🎩 Dealer card reveal animations in .stand',
                '✨ Smooth message editing for animations',
                '🌍 Multi-language animation messages'
            ]
        },
        {
            version: 'v2.7.0',
            date: 'February 15, 2026',
            changes: [
                '🎰 Added surrender feature to blackjack',
                '🏳️ New .surrender command',
                '💰 Get half your bet back when surrendering',
                '🎯 Strategic option for bad hands',
                '🌍 Multi-language surrender support'
            ]
        },
        {
            version: 'v2.6.0',
            date: 'February 15, 2026',
            changes: [
                '👤 Added player names to all games',
                '🎮 Shows who is playing in every game',
                '🌍 Multi-language player display',
                '✨ Better identification in group chats',
                '🎯 Works in all 14 game commands'
            ]
        },
        {
            version: 'v2.5.0',
            date: 'February 14, 2026',
            changes: [
                '🌍 Added Russian language support (56 commands)',
                '🎰 Improved blackjack UI with card boxes',
                '⚡ Faster slot machine animation',
                '🔒 Added .lockdown command for group control',
                '🛡️ Added rate limiting to prevent spam',
                '🗑️ Fixed .del command for message deletion',
                '💰 Updated coin system for all languages',
                '📋 Added .updates and .latest commands'
            ]
        },
        {
            version: 'v2.4.0',
            date: 'February 13, 2026',
            changes: [
                '🎮 Added full blackjack game (.bj, .hit, .stand, .double)',
                '🎯 Added tic-tac-toe game (.ttt)',
                '📊 Added .stats command for server info',
                '⚠️ Added .warnings check command',
                '🎲 Improved RPS with PvP mode',
                '💰 Added betting system to dice and coin games'
            ]
        },
        {
            version: 'v2.3.0',
            date: 'February 12, 2026',
            changes: [
                '💵 Added .bank command and coin system',
                '🎰 Added .slot machine game with betting',
                '🌐 Added .setlang for language switching',
                '📢 Added promotional messages to menu',
                '🎨 Enhanced game animations'
            ]
        },
        {
            version: 'v2.2.0',
            date: 'February 11, 2026',
            changes: [
                '🎮 Added 8ball, dice, coinflip, rps games',
                '🧮 Added guess number and trivia games',
                '🔢 Added math challenge game',
                '🎲 Added .games command to list all games',
                '🇮🇹 Added Italian language support'
            ]
        },
        {
            version: 'v2.1.0',
            date: 'February 10, 2026',
            changes: [
                '👁️ Added .vv command for view-once messages',
                '🎨 Added .sticker command',
                '🗑️ Added .delete command',
                '🆔 Added .jid command',
                '📢 Added .broadcast command',
                '🔗 Added .antilink protection',
                '👋 Added welcome/goodbye messages'
            ]
        },
        {
            version: 'v2.0.0',
            date: 'February 9, 2026',
            changes: [
                '👮 Added admin commands (ban, kick, promote, demote)',
                '🏷️ Added tag commands (tagall, tagnotadmin, hidetag)',
                '⚙️ Added group settings (setgname, setgdesc)',
                '🔄 Added .resetlink command',
                '📊 Added .groupinfo and .staff commands',
                '🔇 Added .mute command',
                '⚠️ Added .warn command with warning system'
            ]
        },
        {
            version: 'v1.5.0',
            date: 'February 8, 2026',
            changes: [
                '👑 Added owner management system',
                '➕ Added .addowner and .removeowner commands',
                '📋 Added .listowners command',
                '🔐 Added .checkowner command',
                '🎯 Added .mode command (public/private)',
                '💬 Added .spam command for testing'
            ]
        },
        {
            version: 'v1.0.0',
            date: 'February 7, 2026',
            changes: [
                '🎉 Initial bot release',
                '📱 Multi-device support',
                '🔄 Session persistence',
                '📋 Basic commands (ping, alive, menu, info)',
                '🤖 Bot can respond from owner number',
                '🔁 Loop prevention system'
            ]
        }
    ],
    it: [
        {
            version: 'v4.8.0',
            date: '19 Marzo 2026',
            changes: [
                '🎰 SLOT MACHINE — REVISIONE COMPLETA',
                '🎨 Display a 3 Righe (superiore/centrale/inferiore, centrale = payline)',
                '💎 Jackpot Progressivo — pool condiviso, 2% delle perdite contribuisce',
                '  • 💎💎💎 vince l\'intero pool + 100x puntata',
                '🔔 Giri Gratis — 🔔🔔🔔 attiva 5 giri gratis automatici',
                '🛒 I boost del negozio ora funzionano (fortuna + moltiplicatori)',
                '📊 Nuovo comando .slotstats — traccia giri, vittorie, jackpot, serie',
                '⚖️ "All in" punta tutto il saldo (nessun limite)',
                '🌍 Tutte le funzioni in 8 lingue'
            ]
        },
        {
            version: 'v4.7.0',
            date: '19 Marzo 2026',
            changes: [
                '🔧 CORREZIONI E NUOVE FUNZIONALITÀ',
                '🖼️ Fix Immagine .kill',
                '  • La foto profilo ora appare correttamente sotto l\'overlay WASTED',
                '  • Corretto: immagine su sfondo nero (bug alpha JPEG)',
                '  • Compositing ora in memoria — nessun file temporaneo',
                '🔇 .mode — Toggle Per Chat',
                '  • .mode private — disabilita il bot in questa chat/gruppo',
                '  • .mode public — riabilita il bot in questa chat/gruppo',
                '🌐 Nuovo: .botoff / .boton — Toggle Globale',
                '  • .botoff — disabilita il bot per TUTTE le chat e gruppi',
                '  • .boton — riabilita il bot globalmente',
                '📞 Rifiuto Automatico Chiamate',
                '  • Il bot rifiuta automaticamente le chiamate WhatsApp',
                '  • Risposta automatica in 8 lingue',
                '  • Attiva/disattiva con .autocall on/off',
                '🌍 Tutte le funzioni in 8 lingue'
            ]
        },
        {
            version: 'v4.6.0',
            date: '11 Marzo 2026',
            changes: [
                '🛡️ SISTEMA DI DIFESA SCUDO AGGIUNTO',
                '✨ Nuove Funzionalità',
                '  • Sistema scudo ispirato a Fortnite per comando .kill',
                '  • 3 tipi di scudo: Piccolo (25%), Grande (50%), Chug Jug (100%)',
                '  • Protezione basata su percentuale con sistema di durabilità',
                '  • Nuovo comando .shield per controllare stato protezione',
                '🛡️ Tipi di Scudo',
                '  • 🔵 Scudo Piccolo - 50k monete, 25% protezione, 2 blocchi, 24h',
                '  • 💙 Scudo Grande - 150k monete, 50% protezione, 3 blocchi, 24h',
                '  • 🌟 Chug Jug - 500k monete, 100% protezione, 1 blocco, 48h',
                '🎮 Come Funziona',
                '  • Compra scudi dal .shop',
                '  • Lo scudo si attiva immediatamente',
                '  • Blocca attacchi .kill basati su % protezione',
                '  • Gli usi diminuiscono al blocco (1.0) o fallimento (0.5)',
                '  • L\'attaccante perde l\'arma comunque',
                '🐛 Correzioni Bug',
                '  • Corretti messaggi inglesi hardcoded nel comando kill',
                '  • Aggiunte 36 traduzioni mancanti (21 messaggi + 15 articoli shop)',
                '  • Corretto errore sintassi template string',
                '  • Tutti i messaggi scudo ora correttamente internazionalizzati',
                '🌍 Supporto multilingue completo in 8 lingue',
                '📝 Comandi: .shop buy shield_small/shield_large/chug_jug, .shield'
            ]
        },
        {
            version: 'v4.5.0',
            date: '9 Marzo 2026',
            changes: [
                '🚨 RIPRISTINO EMERGENZA BANK & CORREZIONE BUG',
                '✅ Problemi Critici Risolti',
                '  • Tutti gli account bank utenti ripristinati da backup',
                '  • 558 utenti con saldi completi recuperati',
                '  • Sistema banking duale (JSON + SQLite) sincronizzato',
                '  • Script ripristino emergenza creato per uso futuro',
                '🐛 50+ Bug Await Mancanti Corretti',
                '  • Corrette tutte le operazioni bank async (getBalance, addCoins, removeCoins)',
                '  • Gioco Mines: 7 correzioni',
                '  • Blackjack: 15+ correzioni',
                '  • Azioni Blackjack (hit, stand, double, split, insurance, surrender): 20 correzioni',
                '  • Ricompense giornaliere: 2 correzioni',
                '  • Acquisto in blocco: 3 correzioni',
                '  • Tutti gli errori [object Promise] eliminati',
                '📊 Impatto',
                '  • 0 perdita dati - tutti gli account ripristinati',
                '  • 50+ bug critici corretti',
                '  • Tutti i display saldi ora funzionano correttamente',
                '  • Acquisti negozio mostrano saldi corretti',
                '  • Vincite/perdite giochi visualizzate correttamente',
                '🛡️ Misure di Sicurezza',
                '  • Script emergency-bank-restore.js creato',
                '  • Fonti backup multiple verificate',
                '  • Documentazione completa aggiunta',
                '  • Entrambi i sistemi ora sincronizzati',
                '📝 Documentazione',
                '  • README.md professionale creato (364 righe)',
                '  • Tutti i file .md organizzati nella cartella docs/',
                '  • Guida ripristino emergenza aggiunta',
                '  • 109 comandi documentati',
                '🌍 Tutte le correzioni in 7 lingue'
            ]
        },
        {
            version: 'v4.3.0',
            date: '7 Marzo 2026',
            changes: [
                '💣 GIOCO MINES - FUNZIONE PIÙ RICHIESTA!',
                '🎮 Nuovo Gioco Casino: .mines',
                '  • Griglia 5x5 stile campo minato',
                '  • Scegli 1-24 mine per bilanciare rischio/ricompensa',
                '  • Sistema moltiplicatore progressivo (fino a 1000x+)',
                '  • Incassa quando vuoi per assicurare vincite',
                '  • Probabilità matematica perfetta (97% RTP)',
                '  • Bellissima visualizzazione griglia ASCII',
                '💎 Funzioni Avanzate',
                '  • Calcoli moltiplicatore in tempo reale',
                '  • Tracciamento statistiche (vittorie, sconfitte, serie migliori)',
                '  • Integrazione negozio (boost fortuna aumentano probabilità tessere sicure)',
                '  • Moltiplicatori monete si applicano a tutte le vincite',
                '  • Sistema pronto per obiettivi',
                '📊 Livelli Strategia',
                '  • 1-5 mine = Facile (più sicuro, moltiplicatori 1.2x-5x)',
                '  • 6-15 mine = Medio (bilanciato, moltiplicatori 5x-50x)',
                '  • 16-24 mine = Difficile (rischio estremo, moltiplicatori 50x-1000x+)',
                '🌍 Supporto completo multi-lingua (7 lingue)'
            ]
        },
        {
            version: 'v4.2.0',
            date: '7 Marzo 2026',
            changes: [
                '🎯 LIMITI GIORNALIERI & SISTEMA ACQUISTO IN BLOCCO',
                '⏰ Limiti Giornalieri Aggiunti',
                '  • Comando .kill: 5 usi al giorno',
                '  • Comando .rob: 15 usi al giorno',
                '  • Reset automatico a mezzanotte',
                '  • Mostra usi rimanenti quando raggiunto il limite',
                '  • Previene spam e mantiene equilibrio economia',
                '🛒 Acquisto Armi in Blocco (.buybulk)',
                '  • Acquista 1-1000 armi alla volta',
                '  • Sconti a livelli: 5+ (5%), 10+ (10%), 25+ (15%), 50+ (20%), 100+ (25%)',
                '  • Uso: .buybulk <arma> <quantità>',
                '  • Esempio: .buybulk pistol 10',
                '  • Mostra risparmio totale e percentuale sconto',
                '🎮 Comandi Gioco Migliorati',
                '  • .bank ora menziona .blackjack, .chess e .games',
                '  • Messaggi rapina includono "Usa .kill per vendetta!"',
                '  • Messaggi combattimento includono opzione vendetta',
                '  • Migliore scoperta giochi e coinvolgimento',
                '💰 Miglioramenti Economia',
                '  • Sistema tracciamento uso per limiti giornalieri',
                '  • Sconti in blocco incoraggiano acquisti strategici',
                '  • Meccaniche fair play prevengono abusi',
                '🌍 Tutte le funzioni in 7 lingue'
            ]
        },
        {
            version: 'v4.1.0',
            date: '7 Marzo 2026',
            changes: [
                '🔧 CORREZIONI BUG E MIGLIORAMENTI',
                '✅ Corretto Comando .guide',
                '  • Ora risponde correttamente alla selezione lingua',
                '  • Gestione formato JID doppio WhatsApp (@lid e @s.whatsapp.net)',
                '  • Memorizza stato pendente per entrambi i formati JID',
                '  • Funziona correttamente dopo riavvio bot',
                '🚫 Corretta Elaborazione Messaggi Vecchi',
                '  • Bot non risponde più a messaggi vecchi dopo riavvio',
                '  • Elabora solo messaggi in tempo reale (tipo notify)',
                '  • Ignora messaggi sincronizzati (tipo append)',
                '  • Buffer 5 secondi per precisione temporale',
                '🏆 Corretto Comando Classifica',
                '  • Ora menziona correttamente utenti con i loro nomi',
                '  • Funziona in tutti i gruppi, non solo quello corrente',
                '  • Recupera partecipanti da tutti i gruppi bot',
                '  • Gestisce formati @lid e @s.whatsapp.net',
                '  • Fallback a entrambi i formati se utente non trovato',
                '📝 Miglioramenti Tecnici',
                '  • Corretta conversione timestamp nel gestore guide',
                '  • Rimossi alias comandi in conflitto',
                '  • Aggiunto sistema mappatura JID completo',
                '  • Logging errori migliorato per debug',
                '🌍 Tutte le correzioni funzionano in 7 lingue'
            ]
        },
        {
            version: 'v4.0.0',
            date: '7 Marzo 2026',
            changes: [
                '🚀 AGGIORNAMENTO SISTEMA MAGGIORE - Funzioni Enterprise!',
                '💾 Database SQLite - Migrato da JSON a SQLite',
                '  • Transazioni per integrità dati',
                '  • Chiavi esterne e indici',
                '  • Modalità WAL per accesso concorrente',
                '  • 548 utenti, 12 gruppi migrati con successo',
                '📝 Sistema Validazione Input',
                '  • Previene SQL injection, XSS, command injection',
                '  • Rate limiting con finestre configurabili',
                '  • Sanifica tutti gli input utente',
                '  • Valida importi, JID, URL, lingue',
                '📊 Dashboard Analisi Migliorata',
                '  • Tracciamento popolarità comandi',
                '  • Pattern attività oraria/giornaliera',
                '  • Calcolo tasso errori',
                '  • Tracciamento tempo risposta',
                '  • Identificazione ore di punta',
                '  • Top comandi, utenti e gruppi',
                '📋 Sistema Logging Winston',
                '  • File log rotanti giornalieri',
                '  • Log separati errori, comandi, combinati',
                '  • Ritenzione 14-30 giorni',
                '  • Logging JSON strutturato',
                '⚡ Sistema Coda Messaggi',
                '  • Coda Bull con backend Redis',
                '  • Elaborazione basata su priorità',
                '  • Logica retry con backoff esponenziale',
                '  • Fallback a coda in memoria',
                '🎮 Messaggi Interattivi',
                '  • Messaggi con pulsanti e fallback',
                '  • Menu lista con sezioni',
                '  • Pulsanti risposta rapida',
                '  • Menu giochi e admin pre-costruiti',
                '👋 Sistema Onboarding',
                '  • Tour guidato 6 passi per nuovi utenti',
                '  • Regalo benvenuto 500 monete',
                '  • Comando .start per attivazione manuale',
                '  • Guida rapida',
                '🏆 Sistema Tornei',
                '  • Formati eliminazione singola e round-robin',
                '  • Quote iscrizione e montepremi',
                '  • Generazione automatica bracket',
                '  • Comando .tournament con 5 sottocomandi',
                '  • Distribuzione premi (50%/30%/20%)',
                '🎖️ Sistema Obiettivi',
                '  • 11 obiettivi in 5 categorie',
                '  • Sblocco automatico con ricompense',
                '  • Tracciamento progresso',
                '  • Comando .achievements',
                '  • Economia, Blackjack, Giornaliero, Sociale, Torneo',
                '📚 Documentazione Organizzata',
                '  • 106 file markdown organizzati in docs/',
                '  • Navigazione strutturata',
                '  • Funzioni, guide, setup, risoluzione problemi',
                '🧪 Infrastruttura Testing',
                '  • Framework testing Vitest',
                '  • Test database e validazione',
                '  • Report copertura',
                '🌍 Tutte le funzioni in 7 lingue',
                '  • Inglese, Italiano, Spagnolo, Portoghese',
                '  • Russo, Arabo, Hindi'
            ]
        },
        {
            version: 'v3.15.0',
            date: '6 Marzo 2026',
            changes: [
                '🎰 RINNOVAMENTO SLOT MACHINE - Gameplay più emozionante!',
                '💎 8 livelli di pagamento (moltiplicatori 4x-100x)',
                '🔥 Sistema serie vincente con premi bonus',
                '⚡ Bonus serie: 2 vittorie = +10%, 3 = +25%, 4+ = +50%',
                '🎨 Nuovo design visivo con bordi decorativi',
                '😱 Rilevamento "quasi vincita" per tentativi vicini',
                '📊 Tabella pagamenti mostrata giocando per divertimento',
                '💰 Pagamenti simboli migliorati:',
                '  • 💎💎💎 = 100x (Jackpot)',
                '  • 7️⃣7️⃣7️⃣ = 50x (Mega Vincita)',
                '  • 🔔🔔🔔 = 25x (Grande Vincita)',
                '  • 🍇🍇🍇 = 15x (Ottima Vincita)',
                '  • 🍊🍊🍊 = 10x (Buona Vincita)',
                '  • 🍋🍋🍋 = 6x (Bella Vincita)',
                '  • 🍒🍒🍒 = 4x (Piccola Vincita)',
                '  • Due = 2x (Mini Vincita)',
                '🌍 Tutti i miglioramenti in 6 lingue',
                '🛡️ Durata Anti-Furto: 14 giorni → 2 giorni',
                '🏪 Negozio ora mostra "Come Comprare" in alto'
            ]
        },
        {
            version: 'v3.14.0',
            date: '5 Marzo 2026',
            changes: [
                '🎡 RUOTA DELLA FORTUNA - Ricompense giornaliere reinventate!',
                '🎰 .daily ora gira una ruota dei premi (50-10.000 monete)',
                '🎲 8 livelli di premi con probabilità variabili',
                '✨ Ruota che gira animata (3 frame)',
                '🌟 Celebrazione jackpot speciale per premio 10k',
                '🎯 Alias: .wheel, .spin',
                '💸 AUMENTO PREZZI ARMI (5x):',
                '• Coltello: 5k → 25k monete',
                '• Pistola: 15k → 75k monete',
                '• Fucile: 35k → 175k monete',
                '• Cecchino: 75k → 350k monete',
                '• RPG: 150k → 750k monete',
                '🔥 Mantiene sistema serie giornaliera',
                '🌍 Supporto completo 6 lingue'
            ]
        },
        {
            version: 'v3.13.0',
            date: '5 Marzo 2026',
            changes: [
                '💀 SISTEMA KILL - Eliminazione giocatori stile GTA',
                '🔫 Comando .kill - Attacca altri giocatori con armi',
                '🛒 5 tipi di armi nel negozio: Coltello, Pistola, Fucile, Cecchino, RPG',
                '🎯 Tassi di successo: 30%-95% in base alla potenza dell\'arma',
                '💰 Prezzi armi: 5k-150k monete (monouso)',
                '📈 I potenziamenti influenzano la probabilità di kill (Portafortuna, VIP, ecc.)',
                '💀 Effetto WASTED sulla foto profilo della vittima',
                '💸 La vittima perde 10k monete quando uccisa',
                '🔇 Vittima mutata per 5 minuti (messaggi auto-eliminati)',
                '⚠️ Armi perse anche se l\'attacco fallisce',
                '🎲 Tasso di successo massimo 98% (mai garantito)'
            ]
        },
        {
            version: 'v3.12.0',
            date: '4 Marzo 2026',
            changes: [
                '🎰 Gioco Roulette Casino aggiunto',
                '🎲 Roulette Europea con singolo 0 (0-36)',
                '💰 9 tipi di puntata: Rosso/Nero, Pari/Dispari, Basso/Alto (1:1)',
                '📊 Dozzine, Colonne (2:1), Pieno (35:1)',
                '🎯 Comando .roulette con alias .rlt',
                '🌍 Supporto completo multi-lingua (6 lingue)',
                '✨ Ruota che gira animata (2 secondi)',
                '🔴 Risultati codificati a colori (rosso, nero, verde)',
                '💵 Limiti puntata: 10-1.000.000 monete',
                '🏦 Integrazione completa sistema banca',
                '📈 2.7% margine casa (standard Europeo)'
            ]
        },
        {
            version: 'v3.11.0',
            date: '4 Marzo 2026',
            changes: [
                '🚀 FUNZIONI VIRALI - Rendi il bot famoso!',
                '💸 Comando .pay - Invia monete agli amici',
                '🎁 Comando .daily - Richiedi 100-300 monete al giorno',
                '👥 Comando .invite - Sistema referral (500 monete per 3 amici)',
                '🏆 Comando .leaderboard - Classifiche competitive',
                '📊 Traccia top giocatori per saldo, vittorie, profitti, referral',
                '🔥 Bonus serie giornaliera fino a +200 monete',
                '💰 Sistema pagamenti crea economia sociale',
                '🎯 Meccaniche di crescita virale integrate'
            ]
        },
        {
            version: 'v3.8.0',
            date: '3 Marzo 2026',
            changes: [
                '⚔️ Aggiunto comando .fight - Difenditi dalle rapine!',
                '🎯 30 secondi per combattere quando derubato',
                '💪 Tasso base 50% + potenziamenti fortuna',
                '🏆 Vinci: Mantieni monete + bonus 50% + rapinatore multato',
                '💔 Perdi: Il rapinatore ottiene le monete',
                '🎰 Slot machine ribilanciata per sfida',
                '📉 Chance diamante: 15% → 5%',
                '📉 Chance sette: 15% → 7%',
                '📉 Tripla corrispondenza: 15% → 10%',
                '💰 Prezzi negozio aumentati 40-75%',
                '🛡️ Anti-Furto ora 100k monete (era 30k)',
                '💎 Tutti gli oggetti più preziosi e strategici'
            ]
        },
        {
            version: 'v3.7.0',
            date: '2 Marzo 2026',
            changes: [
                '➕ Aggiunto comando .add - Aggiungi membri al gruppo',
                '👥 Chiunque può usare .add (non solo admin)',
                '📱 Supporta più numeri di telefono contemporaneamente',
                '⚠️ Comando .warn migliorato',
                '🚨 .warn all <motivo> - Avvisa tutti',
                '🧹 .warnings clear all - Cancella tutti gli avvisi',
                '👁️ Auto-VV ora rivela al gruppo',
                '📢 Messaggi visualizza una volta mostrati a tutti',
                '🏷️ Mostra mittente con @menzione'
            ]
        },
        {
            version: 'v3.5.0',
            date: '25 Febbraio 2026',
            changes: [
                '🤖 Assistente AI integrato (Groq)',
                '💬 Comando .ai - Chiedi qualsiasi cosa',
                '🧠 Modello Meta Llama 3.3 70B',
                '🌍 Supporto AI multilingua',
                '🎰 Fortuna slot machine migliorata 30%',
                '👥 Comando .tagadmin aggiunto'
            ]
        },
        {
            version: 'v3.4.0',
            date: '15 Febbraio 2026',
            changes: [
                '🏆 Aggiunta classifica blackjack',
                '📊 Top 5 giocatori per categoria',
                '💰 Profitto, vittorie, tasso vittoria, blackjack',
                '🥇 Sistema medaglie per classifiche',
                '🌍 Supporto multilingua'
            ]
        },
        {
            version: 'v3.3.0',
            date: '15 Febbraio 2026',
            changes: [
                '🎩 Aggiunto sistema personalità dealer',
                '💬 Dealer parla durante i giochi',
                '🎯 Messaggi contestuali per ogni situazione',
                '🌍 Messaggi dealer multilingua',
                '✨ Esperienza casinò più coinvolgente'
            ]
        },
        {
            version: 'v3.2.0',
            date: '15 Febbraio 2026',
            changes: [
                '🎴 Grafica carte migliorata con Unicode',
                '🎨 Bellissime visualizzazioni a forma di carta',
                '♠️ Simboli semi chiari',
                '📐 Modalità grandezza naturale e compatta',
                '✨ Aspetto casinò professionale'
            ]
        },
        {
            version: 'v3.1.0',
            date: '15 Febbraio 2026',
            changes: [
                '🎰 Aggiunto blackjack multi-mano (2-5 mani)',
                '🎮 Nuovo comando .hand per cambiare mano',
                '💰 Ogni mano costa l\'importo della puntata',
                '🎯 Gioca mani indipendentemente',
                '✨ Funziona con scommesse laterali'
            ]
        },
        {
            version: 'v3.0.0',
            date: '15 Febbraio 2026',
            changes: [
                '🎲 Aggiunte scommesse laterali blackjack',
                '🎴 Scommessa laterale Perfect Pairs (25:1, 12:1, 6:1)',
                '🃏 Scommessa laterale 21+3 stile poker (fino a 100:1)',
                '💰 5 monete per scommessa laterale',
                '🎯 Puoi giocare entrambe simultaneamente'
            ]
        },
        {
            version: 'v2.9.0',
            date: '15 Febbraio 2026',
            changes: [
                '📊 Aggiunto tracciamento statistiche blackjack',
                '🎯 Nuovo comando .bjstats',
                '📈 Traccia vittorie, sconfitte, pareggi, blackjack, sballati',
                '💰 Mostra totale puntato, vinto, perso, profitto netto',
                '📊 Visualizza percentuale tasso vittoria'
            ]
        },
        {
            version: 'v2.8.0',
            date: '15 Febbraio 2026',
            changes: [
                '🎬 Aggiunte animazioni distribuzione carte al blackjack',
                '🃏 Animazione pesca carta nel comando .hit',
                '🎩 Animazioni rivelazione carte dealer in .stand',
                '✨ Modifica messaggi fluida per animazioni',
                '🌍 Messaggi animazione multilingua'
            ]
        },
        {
            version: 'v2.7.0',
            date: '15 Febbraio 2026',
            changes: [
                '🎰 Aggiunta funzione resa al blackjack',
                '🏳️ Nuovo comando .surrender',
                '💰 Recupera metà della puntata arrendendoti',
                '🎯 Opzione strategica per mani cattive',
                '🌍 Supporto resa multilingua'
            ]
        },
        {
            version: 'v2.6.0',
            date: '15 Febbraio 2026',
            changes: [
                '👤 Aggiunti nomi giocatori a tutti i giochi',
                '🎮 Mostra chi sta giocando in ogni gioco',
                '🌍 Visualizzazione giocatore multilingua',
                '✨ Migliore identificazione nelle chat di gruppo',
                '🎯 Funziona in tutti i 14 comandi gioco'
            ]
        },
        {
            version: 'v2.5.0',
            date: '14 Febbraio 2026',
            changes: [
                '🌍 Aggiunto supporto lingua russa (56 comandi)',
                '🎰 Migliorata UI blackjack con box carte',
                '⚡ Animazione slot machine più veloce',
                '🔒 Aggiunto comando .lockdown per controllo gruppo',
                '🛡️ Aggiunto rate limiting per prevenire spam',
                '🗑️ Corretto comando .del per eliminazione messaggi',
                '💰 Aggiornato sistema monete per tutte le lingue',
                '📋 Aggiunti comandi .updates e .latest'
            ]
        },
        {
            version: 'v2.4.0',
            date: '13 Febbraio 2026',
            changes: [
                '🎮 Aggiunto gioco blackjack completo (.bj, .hit, .stand, .double)',
                '🎯 Aggiunto gioco tris (.ttt)',
                '📊 Aggiunto comando .stats per info server',
                '⚠️ Aggiunto comando .warnings check',
                '🎲 Migliorato RPS con modalità PvP',
                '💰 Aggiunto sistema scommesse a dadi e moneta'
            ]
        },
        {
            version: 'v2.3.0',
            date: '12 Febbraio 2026',
            changes: [
                '💵 Aggiunto comando .bank e sistema monete',
                '🎰 Aggiunto gioco slot machine con scommesse',
                '🌐 Aggiunto .setlang per cambio lingua',
                '📢 Aggiunti messaggi promozionali al menu',
                '🎨 Migliorate animazioni giochi'
            ]
        },
        {
            version: 'v2.2.0',
            date: '11 Febbraio 2026',
            changes: [
                '🎮 Aggiunti giochi 8ball, dadi, moneta, rps',
                '🧮 Aggiunti giochi indovina numero e trivia',
                '🔢 Aggiunta sfida matematica',
                '🎲 Aggiunto comando .games per elencare giochi',
                '🇮🇹 Aggiunto supporto lingua italiana'
            ]
        },
        {
            version: 'v2.1.0',
            date: '10 Febbraio 2026',
            changes: [
                '👁️ Aggiunto comando .vv per messaggi visualizza una volta',
                '🎨 Aggiunto comando .sticker',
                '🗑️ Aggiunto comando .delete',
                '🆔 Aggiunto comando .jid',
                '📢 Aggiunto comando .broadcast',
                '🔗 Aggiunta protezione .antilink',
                '👋 Aggiunti messaggi benvenuto/addio'
            ]
        },
        {
            version: 'v2.0.0',
            date: '9 Febbraio 2026',
            changes: [
                '👮 Aggiunti comandi admin (ban, kick, promote, demote)',
                '🏷️ Aggiunti comandi tag (tagall, tagnotadmin, hidetag)',
                '⚙️ Aggiunte impostazioni gruppo (setgname, setgdesc)',
                '🔄 Aggiunto comando .resetlink',
                '📊 Aggiunti comandi .groupinfo e .staff',
                '🔇 Aggiunto comando .mute',
                '⚠️ Aggiunto comando .warn con sistema avvisi'
            ]
        },
        {
            version: 'v1.5.0',
            date: '8 Febbraio 2026',
            changes: [
                '👑 Aggiunto sistema gestione proprietari',
                '➕ Aggiunti comandi .addowner e .removeowner',
                '📋 Aggiunto comando .listowners',
                '🔐 Aggiunto comando .checkowner',
                '🎯 Aggiunto comando .mode (pubblico/privato)',
                '💬 Aggiunto comando .spam per test'
            ]
        },
        {
            version: 'v1.0.0',
            date: '7 Febbraio 2026',
            changes: [
                '🎉 Rilascio iniziale bot',
                '📱 Supporto multi-dispositivo',
                '🔄 Persistenza sessione',
                '📋 Comandi base (ping, alive, menu, info)',
                '🤖 Bot può rispondere dal numero proprietario',
                '🔁 Sistema prevenzione loop'
            ]
        }
    ],
    ru: [
        {
            version: 'v4.8.0',
            date: '19 Марта 2026',
            changes: [
                '🎰 СЛОТ-МАШИНА — ПОЛНАЯ ПЕРЕРАБОТКА',
                '🎨 Дисплей с 3 Рядами (верхний/средний/нижний, средний = линия выплат)',
                '💎 Прогрессивный Джекпот — общий пул, 2% проигрышей идёт в пул',
                '  • 💎💎💎 выигрывает весь пул + 100x ставку',
                '🔔 Бесплатные Вращения — 🔔🔔🔔 активирует 5 авто-вращений',
                '🛒 Бусты магазина теперь работают (удача + множители монет)',
                '📊 Новая команда .slotstats — статистика вращений, побед, джекпотов',
                '⚖️ "All in" ставит весь баланс (без ограничений)',
                '🌍 Все функции на 8 языках'
            ]
        },
        {
            version: 'v4.7.0',
            date: '19 Марта 2026',
            changes: [
                '🔧 ИСПРАВЛЕНИЯ И НОВЫЕ ФУНКЦИИ',
                '🖼️ Исправление изображения .kill — фото профиля теперь видно под WASTED',
                '🔇 .mode — отключение бота для конкретного чата/группы',
                '🌐 .botoff / .boton — глобальное включение/отключение бота',
                '📞 Автоотклонение звонков (.autocall on/off)',
                '🌍 Все функции на 8 языках'
            ]
        },
        {
            version: 'v4.5.0',
            date: '9 Марта 2026',
            changes: [
                '🚨 АВАРИЙНОЕ ВОССТАНОВЛЕНИЕ БАНКА И ИСПРАВЛЕНИЯ БАГОВ',
                '✅ Критические Проблемы Решены',
                '  • Все банковские счета пользователей восстановлены из резервной копии',
                '  • 558 пользователей с полными балансами восстановлено',
                '  • Двойная банковская система (JSON + SQLite) синхронизирована',
                '  • Скрипт аварийного восстановления создан для будущего использования',
                '🐛 50+ Исправлений Отсутствующих Await',
                '  • Исправлены все асинхронные банковские операции (getBalance, addCoins, removeCoins)',
                '  • Игра Mines: 7 исправлений',
                '  • Блэкджек: 15+ исправлений',
                '  • Действия блэкджека (hit, stand, double, split, insurance, surrender): 20 исправлений',
                '  • Ежедневные награды: 2 исправления',
                '  • Массовая покупка: 3 исправления',
                '  • Все ошибки [object Promise] устранены',
                '📊 Влияние',
                '  • 0 потери данных - все счета восстановлены',
                '  • 50+ критических багов исправлено',
                '  • Все отображения балансов теперь работают правильно',
                '  • Покупки в магазине показывают правильные балансы',
                '  • Выигрыши/проигрыши в играх отображаются правильно',
                '🛡️ Меры Безопасности',
                '  • Создан скрипт emergency-bank-restore.js',
                '  • Проверены множественные источники резервных копий',
                '  • Добавлена полная документация',
                '  • Обе системы теперь синхронизированы',
                '📝 Документация',
                '  • Создан профессиональный README.md (364 строки)',
                '  • Все файлы .md организованы в папке docs/',
                '  • Добавлено руководство по аварийному восстановлению',
                '  • Задокументировано 109 команд',
                '🌍 Все исправления на 7 языках'
            ]
        },
        {
            version: 'v4.0.0',
            date: '7 Марта 2026',
            changes: [
                '🚀 КРУПНОЕ ОБНОВЛЕНИЕ СИСТЕМЫ - Корпоративные Функции!',
                '💾 База Данных SQLite - Миграция с JSON на SQLite',
                '  • Транзакции для целостности данных',
                '  • Внешние ключи и индексы',
                '  • Режим WAL для параллельного доступа',
                '  • 548 пользователей, 12 групп успешно мигрировано',
                '📝 Система Валидации Ввода',
                '  • Предотвращает SQL injection, XSS, command injection',
                '  • Rate limiting с настраиваемыми окнами',
                '  • Санитизация всех пользовательских вводов',
                '  • Валидация сумм, JID, URL, языков',
                '📊 Улучшенная Панель Аналитики',
                '  • Отслеживание популярности команд',
                '  • Паттерны почасовой/дневной активности',
                '  • Расчет процента ошибок',
                '  • Отслеживание времени ответа',
                '  • Определение пиковых часов',
                '  • Топ команды, пользователи и группы',
                '📋 Система Логирования Winston',
                '  • Ежедневно ротируемые файлы логов',
                '  • Отдельные логи ошибок, команд, комбинированные',
                '  • Хранение 14-30 дней',
                '  • Структурированное JSON логирование',
                '⚡ Система Очереди Сообщений',
                '  • Очередь Bull с бэкендом Redis',
                '  • Обработка на основе приоритета',
                '  • Логика повтора с экспоненциальной задержкой',
                '  • Резервная очередь в памяти',
                '🎮 Интерактивные Сообщения',
                '  • Сообщения с кнопками и резервом',
                '  • Меню списков с секциями',
                '  • Кнопки быстрого ответа',
                '  • Готовые меню игр и админа',
                '👋 Система Онбординга',
                '  • 6-шаговый тур для новых пользователей',
                '  • Приветственный подарок 500 монет',
                '  • Команда .start для ручного запуска',
                '  • Краткое руководство',
                '🏆 Система Турниров',
                '  • Форматы одиночного выбывания и круговой',
                '  • Вступительные взносы и призовые фонды',
                '  • Автоматическая генерация сетки',
                '  • Команда .tournament с 5 подкомандами',
                '  • Распределение призов (50%/30%/20%)',
                '🎖️ Система Достижений',
                '  • 11 достижений в 5 категориях',
                '  • Автоматическая разблокировка с наградами',
                '  • Отслеживание прогресса',
                '  • Команда .achievements',
                '  • Экономика, Блэкджек, Ежедневные, Социальные, Турнир',
                '📚 Организованная Документация',
                '  • 106 markdown файлов организованы в docs/',
                '  • Структурированная навигация',
                '  • Функции, руководства, настройка, устранение неполадок',
                '🧪 Инфраструктура Тестирования',
                '  • Фреймворк тестирования Vitest',
                '  • Тесты базы данных и валидации',
                '  • Отчеты о покрытии',
                '🌍 Все функции на 7 языках',
                '  • Английский, Итальянский, Испанский, Португальский',
                '  • Русский, Арабский, Хинди'
            ]
        },
        {
            version: 'v3.15.0',
            date: '6 Марта 2026',
            changes: [
                '🎰 ОБНОВЛЕНИЕ СЛОТ-МАШИНЫ - Более захватывающий геймплей!',
                '💎 8 уровней выплат (множители 4x-100x)',
                '🔥 Система серий побед с бонусными наградами',
                '⚡ Бонусы серий: 2 победы = +10%, 3 = +25%, 4+ = +50%',
                '🎨 Красивый новый визуальный дизайн с рамками',
                '😱 Обнаружение "почти выигрыша" для близких попыток',
                '📊 Таблица выплат показывается при игре для удовольствия',
                '💰 Улучшенные выплаты символов:',
                '  • 💎💎💎 = 100x (Джекпот)',
                '  • 7️⃣7️⃣7️⃣ = 50x (Мега Выигрыш)',
                '  • 🔔🔔🔔 = 25x (Большой Выигрыш)',
                '  • 🍇🍇🍇 = 15x (Отличный Выигрыш)',
                '  • 🍊🍊🍊 = 10x (Хороший Выигрыш)',
                '  • 🍋🍋🍋 = 6x (Приятный Выигрыш)',
                '  • 🍒🍒🍒 = 4x (Малый Выигрыш)',
                '  • Два = 2x (Мини Выигрыш)',
                '🌍 Все улучшения на 6 языках',
                '🛡️ Длительность Защиты от Кражи: 14 дней → 2 дня',
                '🏪 Магазин теперь показывает "Как Купить" вверху'
            ]
        },
        {
            version: 'v3.14.0',
            date: '5 Марта 2026',
            changes: [
                '🎡 КОЛЕСО ФОРТУНЫ - Ежедневные награды переосмыслены!',
                '🎰 .daily теперь крутит колесо призов (50-10,000 монет)',
                '🎲 8 уровней призов с разными шансами',
                '✨ Анимированное вращение колеса (3 кадра)',
                '🌟 Особое празднование джекпота для приза 10k',
                '🎯 Алиасы: .wheel, .spin',
                '💸 ПОВЫШЕНИЕ ЦЕН НА ОРУЖИЕ (5x):',
                '• Нож: 5k → 25k монет',
                '• Пистолет: 15k → 75k монет',
                '• Винтовка: 35k → 175k монет',
                '• Снайпер: 75k → 350k монет',
                '• РПГ: 150k → 750k монет',
                '🔥 Сохраняет систему ежедневных серий',
                '🌍 Полная поддержка 6 языков'
            ]
        },
        {
            version: 'v3.13.0',
            date: '5 Марта 2026',
            changes: [
                '💀 СИСТЕМА УБИЙСТВ - Устранение игроков в стиле GTA',
                '🔫 Команда .kill - Атакуйте других игроков оружием',
                '🛒 5 типов оружия в магазине: Нож, Пистолет, Винтовка, Снайпер, РПГ',
                '🎯 Шансы успеха: 30%-95% в зависимости от мощности оружия',
                '💰 Цены на оружие: 5k-150k монет (одноразовое)',
                '📈 Усиления влияют на шанс убийства (Талисман удачи, VIP и т.д.)',
                '💀 Эффект WASTED на фото профиля жертвы',
                '💸 Жертва теряет 10k монет при убийстве',
                '🔇 Жертва заглушена на 5 минут (авто-удаление сообщений)',
                '⚠️ Оружие теряется даже при неудачной атаке',
                '🎲 Максимальный шанс успеха 98% (никогда не гарантирован)'
            ]
        },
        {
            version: 'v3.12.0',
            date: '4 Марта 2026',
            changes: [
                '🎰 Добавлена игра Казино Рулетка',
                '🎲 Европейская Рулетка с одним 0 (0-36)',
                '💰 9 типов ставок: Красное/Черное, Четное/Нечетное, Низкое/Высокое (1:1)',
                '📊 Дюжины, Колонки (2:1), Прямая (35:1)',
                '🎯 Команда .roulette с алиасом .rlt',
                '🌍 Полная многоязычная поддержка (6 языков)',
                '✨ Анимированное вращение колеса (2 секунды)',
                '🔴 Цветные результаты (красное, черное, зеленое)',
                '💵 Лимиты ставок: 10-1.000.000 монет',
                '🏦 Полная интеграция с банковской системой',
                '📈 2.7% преимущество казино (Европейский стандарт)'
            ]
        },
        {
            version: 'v3.8.0',
            date: '3 Марта 2026',
            changes: [
                '⚔️ Добавлена команда .fight - Защищайтесь от ограблений!',
                '🎯 30 секунд чтобы сражаться при ограблении',
                '💪 Базовый шанс 50% + усиления удачи',
                '🏆 Победа: Сохраните монеты + бонус 50% + грабитель оштрафован',
                '💔 Поражение: Грабитель получает монеты',
                '🎰 Слот-машина перебалансирована для вызова',
                '📉 Шанс алмаза: 15% → 5%',
                '📉 Шанс семерки: 15% → 7%',
                '📉 Тройное совпадение: 15% → 10%',
                '💰 Цены магазина увеличены на 40-75%',
                '🛡️ Анти-Ограбление теперь 100k монет (было 30k)',
                '💎 Все предметы более ценные и стратегические'
            ]
        },
        {
            version: 'v3.7.0',
            date: '2 Марта 2026',
            changes: [
                '➕ Добавлена команда .add - Добавить участников в группу',
                '👥 Любой может использовать .add (не только админы)',
                '📱 Поддержка нескольких номеров одновременно',
                '⚠️ Улучшена команда .warn',
                '🚨 .warn all <причина> - Предупредить всех',
                '🧹 .warnings clear all - Очистить все предупреждения',
                '👁️ Auto-VV теперь раскрывает группе',
                '📢 Одноразовые сообщения показываются всем',
                '🏷️ Показывает отправителя с @упоминанием'
            ]
        },
        {
            version: 'v3.5.0',
            date: '25 Февраля 2026',
            changes: [
                '🤖 AI-ассистент интегрирован (Groq)',
                '💬 Команда .ai - Спросите что угодно',
                '🧠 Модель Meta Llama 3.3 70B',
                '🌍 Многоязычная поддержка AI',
                '🎰 Удача слот-машины улучшена на 30%',
                '👥 Команда .tagadmin добавлена'
            ]
        },
        {
            version: 'v3.4.0',
            date: '15 Февраля 2026',
            changes: [
                '🏆 Добавлена таблица лидеров блэкджек',
                '📊 Топ 5 игроков в категории',
                '💰 Прибыль, победы, процент побед, блэкджеки',
                '🥇 Система медалей для рейтингов',
                '🌍 Многоязычная поддержка'
            ]
        },
        {
            version: 'v3.3.0',
            date: '15 Февраля 2026',
            changes: [
                '🎩 Добавлена система личности дилера',
                '💬 Дилер говорит во время игр',
                '🎯 Контекстные сообщения для каждой ситуации',
                '🌍 Многоязычные сообщения дилера',
                '✨ Более захватывающий опыт казино'
            ]
        },
        {
            version: 'v3.2.0',
            date: '15 Февраля 2026',
            changes: [
                '🎴 Улучшенная графика карт с Unicode',
                '🎨 Красивое отображение в форме карт',
                '♠️ Четкие символы мастей',
                '📐 Полноразмерный и компактный режимы',
                '✨ Профессиональный вид казино'
            ]
        },
        {
            version: 'v3.1.0',
            date: '15 Февраля 2026',
            changes: [
                '🎰 Добавлен мульти-рука блэкджек (2-5 рук)',
                '🎮 Новая команда .hand для смены руки',
                '💰 Каждая рука стоит сумму ставки',
                '🎯 Играйте руки независимо',
                '✨ Работает с боковыми ставками'
            ]
        },
        {
            version: 'v3.0.0',
            date: '15 Февраля 2026',
            changes: [
                '🎲 Добавлены боковые ставки в блэкджек',
                '🎴 Боковая ставка Perfect Pairs (25:1, 12:1, 6:1)',
                '🃏 Боковая ставка 21+3 в стиле покера (до 100:1)',
                '💰 5 монет за боковую ставку',
                '🎯 Можно играть обе одновременно'
            ]
        },
        {
            version: 'v2.9.0',
            date: '15 Февраля 2026',
            changes: [
                '📊 Добавлено отслеживание статистики блэкджека',
                '🎯 Новая команда .bjstats',
                '📈 Отслеживает победы, поражения, ничьи, блэкджеки, переборы',
                '💰 Показывает всего поставлено, выиграно, проиграно, чистую прибыль',
                '📊 Отображает процент побед'
            ]
        },
        {
            version: 'v2.8.0',
            date: '15 Февраля 2026',
            changes: [
                '🎬 Добавлены анимации раздачи карт в блэкджек',
                '🃏 Анимация взятия карты в команде .hit',
                '🎩 Анимации открытия карт дилера в .stand',
                '✨ Плавное редактирование сообщений для анимаций',
                '🌍 Многоязычные сообщения анимаций'
            ]
        },
        {
            version: 'v2.7.0',
            date: '15 Февраля 2026',
            changes: [
                '🎰 Добавлена функция сдачи в блэкджек',
                '🏳️ Новая команда .surrender',
                '💰 Получите половину ставки при сдаче',
                '🎯 Стратегическая опция для плохих рук',
                '🌍 Многоязычная поддержка сдачи'
            ]
        },
        {
            version: 'v2.6.0',
            date: '15 Февраля 2026',
            changes: [
                '👤 Добавлены имена игроков во все игры',
                '🎮 Показывает, кто играет в каждой игре',
                '🌍 Многоязычное отображение игрока',
                '✨ Лучшая идентификация в групповых чатах',
                '🎯 Работает во всех 14 игровых командах'
            ]
        },
        {
            version: 'v2.5.0',
            date: '14 Февраля 2026',
            changes: [
                '🌍 Добавлена поддержка русского языка (56 команд)',
                '🎰 Улучшен интерфейс блэкджека с карточными боксами',
                '⚡ Ускорена анимация игрового автомата',
                '🔒 Добавлена команда .lockdown для контроля группы',
                '🛡️ Добавлено ограничение скорости для предотвращения спама',
                '🗑️ Исправлена команда .del для удаления сообщений',
                '💰 Обновлена система монет для всех языков',
                '📋 Добавлены команды .updates и .latest'
            ]
        },
        {
            version: 'v2.4.0',
            date: '13 Февраля 2026',
            changes: [
                '🎮 Добавлена полная игра в блэкджек (.bj, .hit, .stand, .double)',
                '🎯 Добавлена игра крестики-нолики (.ttt)',
                '📊 Добавлена команда .stats для информации о сервере',
                '⚠️ Добавлена команда .warnings check',
                '🎲 Улучшена игра КНБ с режимом PvP',
                '💰 Добавлена система ставок в игры с костями и монетой'
            ]
        },
        {
            version: 'v2.3.0',
            date: '12 Февраля 2026',
            changes: [
                '💵 Добавлена команда .bank и система монет',
                '🎰 Добавлена игра в игровой автомат со ставками',
                '🌐 Добавлена команда .setlang для смены языка',
                '📢 Добавлены рекламные сообщения в меню',
                '🎨 Улучшены анимации игр'
            ]
        },
        {
            version: 'v2.2.0',
            date: '11 Февраля 2026',
            changes: [
                '🎮 Добавлены игры 8ball, кости, монета, КНБ',
                '🧮 Добавлены игры угадай число и викторина',
                '🔢 Добавлен математический вызов',
                '🎲 Добавлена команда .games для списка игр',
                '🇮🇹 Добавлена поддержка итальянского языка'
            ]
        },
        {
            version: 'v2.1.0',
            date: '10 Февраля 2026',
            changes: [
                '👁️ Добавлена команда .vv для одноразовых сообщений',
                '🎨 Добавлена команда .sticker',
                '🗑️ Добавлена команда .delete',
                '🆔 Добавлена команда .jid',
                '📢 Добавлена команда .broadcast',
                '🔗 Добавлена защита .antilink',
                '👋 Добавлены приветственные сообщения'
            ]
        },
        {
            version: 'v2.0.0',
            date: '9 Февраля 2026',
            changes: [
                '👮 Добавлены команды администратора (ban, kick, promote, demote)',
                '🏷️ Добавлены команды тегов (tagall, tagnotadmin, hidetag)',
                '⚙️ Добавлены настройки группы (setgname, setgdesc)',
                '🔄 Добавлена команда .resetlink',
                '📊 Добавлены команды .groupinfo и .staff',
                '🔇 Добавлена команда .mute',
                '⚠️ Добавлена команда .warn с системой предупреждений'
            ]
        },
        {
            version: 'v1.5.0',
            date: '8 Февраля 2026',
            changes: [
                '👑 Добавлена система управления владельцами',
                '➕ Добавлены команды .addowner и .removeowner',
                '📋 Добавлена команда .listowners',
                '🔐 Добавлена команда .checkowner',
                '🎯 Добавлена команда .mode (публичный/приватный)',
                '💬 Добавлена команда .spam для тестирования'
            ]
        },
        {
            version: 'v1.0.0',
            date: '7 Февраля 2026',
            changes: [
                '🎉 Первый релиз бота',
                '📱 Поддержка нескольких устройств',
                '🔄 Сохранение сессии',
                '📋 Базовые команды (ping, alive, menu, info)',
                '🤖 Бот может отвечать с номера владельца',
                '🔁 Система предотвращения зацикливания'
            ]
        }
    ],
    es: [
        {
            version: 'v4.8.0',
            date: '19 de Marzo 2026',
            changes: [
                '🎰 TRAGAMONEDAS — RENOVACIÓN COMPLETA',
                '🎨 Pantalla de 3 Filas (superior/media/inferior, media = línea de pago)',
                '💎 Jackpot Progresivo — pozo compartido, 2% de pérdidas contribuye',
                '  • 💎💎💎 gana todo el pozo + 100x apuesta',
                '🔔 Giros Gratis — 🔔🔔🔔 activa 5 giros automáticos',
                '🛒 Impulsos de tienda ahora funcionan (suerte + multiplicadores)',
                '📊 Nuevo comando .slotstats — estadísticas de giros, victorias, jackpots',
                '⚖️ "All in" apuesta todo tu saldo (sin límite)',
                '🌍 Todas las funciones en 8 idiomas'
            ]
        },
        {
            version: 'v4.7.0',
            date: '19 de Marzo 2026',
            changes: [
                '🔧 CORRECCIONES Y NUEVAS FUNCIONES',
                '🖼️ Fix imagen .kill — foto de perfil ahora visible bajo WASTED',
                '🔇 .mode — desactiva el bot solo en este chat/grupo',
                '🌐 .botoff / .boton — activar/desactivar bot globalmente',
                '📞 Rechazo automático de llamadas (.autocall on/off)',
                '🌍 Todas las funciones en 8 idiomas'
            ]
        },
        {
            version: 'v4.5.0',
            date: '9 de Marzo 2026',
            changes: [
                '🚨 RESTAURACIÓN DE EMERGENCIA DEL BANCO Y CORRECCIONES',
                '✅ Problemas Críticos Resueltos',
                '  • Todas las cuentas bancarias de usuarios restauradas desde respaldo',
                '  • 558 usuarios con saldos completos recuperados',
                '  • Sistema bancario dual (JSON + SQLite) sincronizado',
                '  • Script de restauración de emergencia creado para uso futuro',
                '🐛 50+ Errores de Await Faltantes Corregidos',
                '  • Corregidas todas las operaciones bancarias async (getBalance, addCoins, removeCoins)',
                '  • Juego Mines: 7 correcciones',
                '  • Blackjack: 15+ correcciones',
                '  • Acciones Blackjack (hit, stand, double, split, insurance, surrender): 20 correcciones',
                '  • Recompensas diarias: 2 correcciones',
                '  • Compra al por mayor: 3 correcciones',
                '  • Todos los errores [object Promise] eliminados',
                '📊 Impacto',
                '  • 0 pérdida de datos - todas las cuentas restauradas',
                '  • 50+ errores críticos corregidos',
                '  • Todas las visualizaciones de saldo ahora funcionan correctamente',
                '  • Las compras en la tienda muestran saldos correctos',
                '  • Ganancias/pérdidas de juegos se muestran correctamente',
                '🛡️ Medidas de Seguridad',
                '  • Script emergency-bank-restore.js creado',
                '  • Múltiples fuentes de respaldo verificadas',
                '  • Documentación completa añadida',
                '  • Ambos sistemas ahora sincronizados',
                '📝 Documentación',
                '  • README.md profesional creado (364 líneas)',
                '  • Todos los archivos .md organizados en carpeta docs/',
                '  • Guía de restauración de emergencia añadida',
                '  • 109 comandos documentados',
                '🌍 Todas las correcciones en 7 idiomas'
            ]
        },
        {
            version: 'v4.0.0',
            date: '7 de Marzo 2026',
            changes: [
                '🚀 ACTUALIZACIÓN MAYOR DEL SISTEMA - ¡Funciones Empresariales!',
                '💾 Base de Datos SQLite - Migrado de JSON a SQLite',
                '  • Transacciones para integridad de datos',
                '  • Claves foráneas e índices',
                '  • Modo WAL para acceso concurrente',
                '  • 548 usuarios, 12 grupos migrados exitosamente',
                '📝 Sistema de Validación de Entrada',
                '  • Previene SQL injection, XSS, command injection',
                '  • Rate limiting con ventanas configurables',
                '  • Sanitiza todas las entradas de usuario',
                '  • Valida cantidades, JID, URL, idiomas',
                '📊 Panel de Análisis Mejorado',
                '  • Seguimiento de popularidad de comandos',
                '  • Patrones de actividad horaria/diaria',
                '  • Cálculo de tasa de errores',
                '  • Seguimiento de tiempo de respuesta',
                '  • Identificación de horas pico',
                '  • Top comandos, usuarios y grupos',
                '📋 Sistema de Registro Winston',
                '  • Archivos de registro rotatorios diarios',
                '  • Registros separados de errores, comandos, combinados',
                '  • Retención de 14-30 días',
                '  • Registro JSON estructurado',
                '⚡ Sistema de Cola de Mensajes',
                '  • Cola Bull con backend Redis',
                '  • Procesamiento basado en prioridad',
                '  • Lógica de reintento con retroceso exponencial',
                '  • Respaldo a cola en memoria',
                '🎮 Mensajes Interactivos',
                '  • Mensajes con botones y respaldo',
                '  • Menús de lista con secciones',
                '  • Botones de respuesta rápida',
                '  • Menús de juegos y admin preconstruidos',
                '👋 Sistema de Incorporación',
                '  • Tour guiado de 6 pasos para nuevos usuarios',
                '  • Regalo de bienvenida de 500 monedas',
                '  • Comando .start para activación manual',
                '  • Guía de inicio rápido',
                '🏆 Sistema de Torneos',
                '  • Formatos de eliminación simple y round-robin',
                '  • Cuotas de entrada y bolsas de premios',
                '  • Generación automática de brackets',
                '  • Comando .tournament con 5 subcomandos',
                '  • Distribución de premios (50%/30%/20%)',
                '🎖️ Sistema de Logros',
                '  • 11 logros en 5 categorías',
                '  • Desbloqueo automático con recompensas',
                '  • Seguimiento de progreso',
                '  • Comando .achievements',
                '  • Economía, Blackjack, Diario, Social, Torneo',
                '📚 Documentación Organizada',
                '  • 106 archivos markdown organizados en docs/',
                '  • Navegación estructurada',
                '  • Funciones, guías, configuración, solución de problemas',
                '🧪 Infraestructura de Pruebas',
                '  • Framework de pruebas Vitest',
                '  • Pruebas de base de datos y validación',
                '  • Informes de cobertura',
                '🌍 Todas las funciones en 7 idiomas',
                '  • Inglés, Italiano, Español, Portugués',
                '  • Ruso, Árabe, Hindi'
            ]
        },
        {
            version: 'v3.15.0',
            date: '6 de Marzo 2026',
            changes: [
                '🎰 RENOVACIÓN MÁQUINA TRAGAMONEDAS - ¡Juego más emocionante!',
                '💎 8 niveles de pago (multiplicadores 4x-100x)',
                '🔥 Sistema de racha ganadora con recompensas bonus',
                '⚡ Bonus racha: 2 victorias = +10%, 3 = +25%, 4+ = +50%',
                '🎨 Hermoso nuevo diseño visual con bordes',
                '😱 Detección de "casi gano" para intentos cercanos',
                '📊 Tabla de pagos mostrada al jugar por diversión',
                '💰 Pagos de símbolos mejorados:',
                '  • 💎💎💎 = 100x (Jackpot)',
                '  • 7️⃣7️⃣7️⃣ = 50x (Mega Premio)',
                '  • 🔔🔔🔔 = 25x (Gran Premio)',
                '  • 🍇🍇🍇 = 15x (Excelente Premio)',
                '  • 🍊🍊🍊 = 10x (Buen Premio)',
                '  • 🍋🍋🍋 = 6x (Lindo Premio)',
                '  • 🍒🍒🍒 = 4x (Pequeño Premio)',
                '  • Dos = 2x (Mini Premio)',
                '🌍 Todas las mejoras en 6 idiomas',
                '🛡️ Duración Anti-Robo: 14 días → 2 días',
                '🏪 Tienda ahora muestra "Cómo Comprar" arriba'
            ]
        },
        {
            version: 'v3.14.0',
            date: '5 de Marzo 2026',
            changes: [
                '🎡 RUEDA DE LA FORTUNA - ¡Recompensas diarias reinventadas!',
                '🎰 .daily ahora gira una rueda de premios (50-10,000 monedas)',
                '🎲 8 niveles de premios con probabilidades variables',
                '✨ Rueda giratoria animada (3 cuadros)',
                '🌟 Celebración especial de jackpot para premio 10k',
                '🎯 Alias: .wheel, .spin',
                '💸 AUMENTO DE PRECIOS DE ARMAS (5x):',
                '• Cuchillo: 5k → 25k monedas',
                '• Pistola: 15k → 75k monedas',
                '• Rifle: 35k → 175k monedas',
                '• Francotirador: 75k → 350k monedas',
                '• RPG: 150k → 750k monedas',
                '🔥 Mantiene sistema de racha diaria',
                '🌍 Soporte completo de 6 idiomas'
            ]
        },
        {
            version: 'v3.13.0',
            date: '5 de Marzo 2026',
            changes: [
                '💀 SISTEMA KILL - Eliminación de jugadores estilo GTA',
                '🔫 Comando .kill - Ataca a otros jugadores con armas',
                '🛒 5 tipos de armas en tienda: Cuchillo, Pistola, Rifle, Francotirador, RPG',
                '🎯 Tasas de éxito: 30%-95% según potencia del arma',
                '💰 Precios de armas: 5k-150k monedas (un solo uso)',
                '📈 Los potenciadores afectan la probabilidad de kill (Amuleto, VIP, etc.)',
                '💀 Efecto WASTED en foto de perfil de víctima',
                '💸 La víctima pierde 10k monedas al morir',
                '🔇 Víctima silenciada por 5 minutos (mensajes auto-eliminados)',
                '⚠️ Armas perdidas incluso si el ataque falla',
                '🎲 Tasa de éxito máxima 98% (nunca garantizada)'
            ]
        },
        {
            version: 'v3.12.0',
            date: '4 de Marzo 2026',
            changes: [
                '🎰 Juego Casino Ruleta añadido',
                '🎲 Ruleta Europea con 0 único (0-36)',
                '💰 9 tipos de apuesta: Rojo/Negro, Par/Impar, Bajo/Alto (1:1)',
                '📊 Docenas, Columnas (2:1), Pleno (35:1)',
                '🎯 Comando .roulette con alias .rlt',
                '🌍 Soporte completo multi-idioma (6 idiomas)',
                '✨ Rueda giratoria animada (2 segundos)',
                '🔴 Resultados codificados por color (rojo, negro, verde)',
                '💵 Límites de apuesta: 10-1.000.000 monedas',
                '🏦 Integración completa con sistema bancario',
                '📈 2.7% ventaja casa (estándar Europeo)'
            ]
        },
        {
            version: 'v3.8.0',
            date: '3 de Marzo 2026',
            changes: [
                '⚔️ Añadido comando .fight - ¡Defiéndete de los robos!',
                '🎯 30 segundos para luchar cuando te roban',
                '💪 Tasa base 50% + aumentos de suerte',
                '🏆 Ganas: Conservas monedas + bonus 50% + ladrón multado',
                '💔 Pierdes: El ladrón obtiene las monedas',
                '🎰 Máquina tragamonedas rebalanceada para desafío',
                '📉 Probabilidad diamante: 15% → 5%',
                '📉 Probabilidad siete: 15% → 7%',
                '📉 Triple coincidencia: 15% → 10%',
                '💰 Precios de tienda aumentados 40-75%',
                '🛡️ Anti-Robo ahora 100k monedas (era 30k)',
                '💎 Todos los artículos más valiosos y estratégicos'
            ]
        },
        {
            version: 'v3.7.0',
            date: '2 de Marzo 2026',
            changes: [
                '➕ Añadido comando .add - Agregar miembros al grupo',
                '👥 Cualquiera puede usar .add (no solo admins)',
                '📱 Soporta múltiples números de teléfono a la vez',
                '⚠️ Comando .warn mejorado',
                '🚨 .warn all <razón> - Advertir a todos',
                '🧹 .warnings clear all - Limpiar todas las advertencias',
                '👁️ Auto-VV ahora revela al grupo',
                '📢 Mensajes de ver una vez mostrados a todos',
                '🏷️ Muestra remitente con @mención'
            ]
        },
        {
            version: 'v3.5.0',
            date: '25 de Febrero 2026',
            changes: [
                '🤖 Asistente IA integrado (Groq)',
                '💬 Comando .ai - Pregunta lo que quieras',
                '🧠 Modelo Meta Llama 3.3 70B',
                '🌍 Soporte IA multi-idioma',
                '🎰 Suerte tragamonedas mejorada 30%',
                '👥 Comando .tagadmin añadido'
            ]
        },
        {
            version: 'v3.4.0',
            date: '15 de Febrero 2026',
            changes: [
                '🏆 Añadida tabla de clasificación de blackjack',
                '📊 Top 5 jugadores por categoría',
                '💰 Beneficios, victorias, tasa de victorias, blackjacks',
                '🥇 Sistema de medallas para clasificaciones',
                '🌍 Soporte multiidioma'
            ]
        },
        {
            version: 'v3.3.0',
            date: '15 de Febrero 2026',
            changes: [
                '🎩 Añadido sistema de personalidad del crupier',
                '💬 Crupier habla durante los juegos',
                '🎯 Mensajes contextuales para cada situación',
                '🌍 Mensajes del crupier multiidioma',
                '✨ Experiencia de casino más inmersiva'
            ]
        },
        {
            version: 'v3.2.0',
            date: '15 de Febrero 2026',
            changes: [
                '🎴 Gráficos de cartas mejorados con Unicode',
                '🎨 Hermosas visualizaciones en forma de carta',
                '♠️ Símbolos de palos claros',
                '📐 Modos de tamaño completo y compacto',
                '✨ Apariencia de casino profesional'
            ]
        },
        {
            version: 'v3.1.0',
            date: '15 de Febrero 2026',
            changes: [
                '🎰 Añadido blackjack multi-mano (2-5 manos)',
                '🎮 Nuevo comando .hand para cambiar de mano',
                '💰 Cada mano cuesta el monto de la apuesta',
                '🎯 Juega manos independientemente',
                '✨ Funciona con apuestas laterales'
            ]
        },
        {
            version: 'v3.0.0',
            date: '15 de Febrero 2026',
            changes: [
                '🎲 Añadidas apuestas laterales de blackjack',
                '🎴 Apuesta lateral Perfect Pairs (25:1, 12:1, 6:1)',
                '🃏 Apuesta lateral 21+3 estilo póker (hasta 100:1)',
                '💰 5 monedas por apuesta lateral',
                '🎯 Puedes jugar ambas simultáneamente'
            ]
        },
        {
            version: 'v2.9.0',
            date: '15 de Febrero 2026',
            changes: [
                '📊 Añadido seguimiento de estadísticas de blackjack',
                '🎯 Nuevo comando .bjstats',
                '📈 Rastrea victorias, derrotas, empates, blackjacks, pasados',
                '💰 Muestra total apostado, ganado, perdido, beneficio neto',
                '📊 Muestra porcentaje de tasa de victorias'
            ]
        },
        {
            version: 'v2.8.0',
            date: '15 de Febrero 2026',
            changes: [
                '🎬 Añadidas animaciones de reparto de cartas al blackjack',
                '🃏 Animación de robo de carta en comando .hit',
                '🎩 Animaciones de revelación de cartas del crupier en .stand',
                '✨ Edición de mensajes fluida para animaciones',
                '🌍 Mensajes de animación multiidioma'
            ]
        },
        {
            version: 'v2.7.0',
            date: '15 de Febrero 2026',
            changes: [
                '🎰 Añadida función de rendición al blackjack',
                '🏳️ Nuevo comando .surrender',
                '💰 Recupera la mitad de tu apuesta al rendirte',
                '🎯 Opción estratégica para malas manos',
                '🌍 Soporte de rendición multiidioma'
            ]
        },
        {
            version: 'v2.6.0',
            date: '15 de Febrero 2026',
            changes: [
                '👤 Añadidos nombres de jugadores a todos los juegos',
                '🎮 Muestra quién está jugando en cada juego',
                '🌍 Visualización de jugador multiidioma',
                '✨ Mejor identificación en chats grupales',
                '🎯 Funciona en los 14 comandos de juego'
            ]
        },
        {
            version: 'v2.5.0',
            date: '14 de Febrero 2026',
            changes: [
                '🌍 Añadido soporte de idioma ruso (56 comandos)',
                '🎰 Mejorada UI de blackjack con cajas de cartas',
                '⚡ Animación de máquina tragamonedas más rápida',
                '🔒 Añadido comando .lockdown para control de grupo',
                '🛡️ Añadida limitación de velocidad para prevenir spam',
                '🗑️ Corregido comando .del para eliminación de mensajes',
                '💰 Actualizado sistema de monedas para todos los idiomas',
                '📋 Añadidos comandos .updates y .latest'
            ]
        },
        {
            version: 'v2.4.0',
            date: '13 de Febrero 2026',
            changes: [
                '🎮 Añadido juego completo de blackjack (.bj, .hit, .stand, .double)',
                '🎯 Añadido juego de tres en raya (.ttt)',
                '📊 Añadido comando .stats para información del servidor',
                '⚠️ Añadido comando .warnings check',
                '🎲 Mejorado RPS con modo PvP',
                '💰 Añadido sistema de apuestas a juegos de dados y moneda'
            ]
        },
        {
            version: 'v2.3.0',
            date: '12 de Febrero 2026',
            changes: [
                '💵 Añadido comando .bank y sistema de monedas',
                '🎰 Añadido juego de máquina tragamonedas con apuestas',
                '🌐 Añadido .setlang para cambio de idioma',
                '📢 Añadidos mensajes promocionales al menú',
                '🎨 Mejoradas animaciones de juegos'
            ]
        },
        {
            version: 'v2.2.0',
            date: '11 de Febrero 2026',
            changes: [
                '🎮 Añadidos juegos 8ball, dados, moneda, piedra papel tijera',
                '🧮 Añadidos juegos adivina el número y trivia',
                '🔢 Añadido desafío matemático',
                '🎲 Añadido comando .games para listar juegos',
                '🇮🇹 Añadido soporte de idioma italiano'
            ]
        },
        {
            version: 'v2.1.0',
            date: '10 de Febrero 2026',
            changes: [
                '👁️ Añadido comando .vv para mensajes de ver una vez',
                '🎨 Añadido comando .sticker',
                '🗑️ Añadido comando .delete',
                '🆔 Añadido comando .jid',
                '📢 Añadido comando .broadcast',
                '🔗 Añadida protección .antilink',
                '👋 Añadidos mensajes de bienvenida/despedida'
            ]
        },
        {
            version: 'v2.0.0',
            date: '9 de Febrero 2026',
            changes: [
                '👮 Añadidos comandos de administrador (ban, kick, promote, demote)',
                '🏷️ Añadidos comandos de etiqueta (tagall, tagnotadmin, hidetag)',
                '⚙️ Añadida configuración de grupo (setgname, setgdesc)',
                '🔄 Añadido comando .resetlink',
                '📊 Añadidos comandos .groupinfo y .staff',
                '🔇 Añadido comando .mute',
                '⚠️ Añadido comando .warn con sistema de advertencias'
            ]
        },
        {
            version: 'v1.5.0',
            date: '8 de Febrero 2026',
            changes: [
                '👑 Añadido sistema de gestión de propietarios',
                '➕ Añadidos comandos .addowner y .removeowner',
                '📋 Añadido comando .listowners',
                '🔐 Añadido comando .checkowner',
                '🎯 Añadido comando .mode (público/privado)',
                '💬 Añadido comando .spam para pruebas'
            ]
        },
        {
            version: 'v1.0.0',
            date: '7 de Febrero 2026',
            changes: [
                '🎉 Lanzamiento inicial del bot',
                '📱 Soporte multi-dispositivo',
                '🔄 Persistencia de sesión',
                '📋 Comandos básicos (ping, alive, menu, info)',
                '🤖 Bot puede responder desde número del propietario',
                '🔁 Sistema de prevención de bucles'
            ]
        }
    ],
    pt: [
        {
            version: 'v4.8.0',
            date: '19 de Março 2026',
            changes: [
                '🎰 CAÇA-NÍQUEIS — RENOVAÇÃO COMPLETA',
                '🎨 Display de 3 Linhas (superior/média/inferior, média = linha de pagamento)',
                '💎 Jackpot Progressivo — poço compartilhado, 2% das perdas contribui',
                '  • 💎💎💎 ganha todo o poço + 100x aposta',
                '🔔 Giros Grátis — 🔔🔔🔔 ativa 5 giros automáticos',
                '🛒 Impulsos da loja agora funcionam (sorte + multiplicadores)',
                '📊 Novo comando .slotstats — estatísticas de giros, vitórias, jackpots',
                '⚖️ "All in" aposta todo o saldo (sem limite)',
                '🌍 Todas as funcionalidades em 8 idiomas'
            ]
        },
        {
            version: 'v4.7.0',
            date: '19 de Março 2026',
            changes: [
                '🔧 CORREÇÕES E NOVAS FUNCIONALIDADES',
                '🖼️ Fix imagem .kill — foto de perfil agora visível sob WASTED',
                '🔇 .mode — desativa o bot apenas neste chat/grupo',
                '🌐 .botoff / .boton — ativar/desativar bot globalmente',
                '📞 Rejeição automática de chamadas (.autocall on/off)',
                '🌍 Todas as funcionalidades em 8 idiomas'
            ]
        },
        {
            version: 'v4.5.0',
            date: '9 de Março 2026',
            changes: [
                '🚨 RESTAURAÇÃO DE EMERGÊNCIA DO BANCO E CORREÇÕES',
                '✅ Problemas Críticos Resolvidos',
                '  • Todas as contas bancárias de usuários restauradas do backup',
                '  • 558 usuários com saldos completos recuperados',
                '  • Sistema bancário duplo (JSON + SQLite) sincronizado',
                '  • Script de restauração de emergência criado para uso futuro',
                '🐛 50+ Erros de Await Faltantes Corrigidos',
                '  • Corrigidas todas as operações bancárias async (getBalance, addCoins, removeCoins)',
                '  • Jogo Mines: 7 correções',
                '  • Blackjack: 15+ correções',
                '  • Ações Blackjack (hit, stand, double, split, insurance, surrender): 20 correções',
                '  • Recompensas diárias: 2 correções',
                '  • Compra em massa: 3 correções',
                '  • Todos os erros [object Promise] eliminados',
                '📊 Impacto',
                '  • 0 perda de dados - todas as contas restauradas',
                '  • 50+ erros críticos corrigidos',
                '  • Todas as exibições de saldo agora funcionam corretamente',
                '  • Compras na loja mostram saldos corretos',
                '  • Ganhos/perdas de jogos exibidos corretamente',
                '🛡️ Medidas de Segurança',
                '  • Script emergency-bank-restore.js criado',
                '  • Múltiplas fontes de backup verificadas',
                '  • Documentação completa adicionada',
                '  • Ambos os sistemas agora sincronizados',
                '📝 Documentação',
                '  • README.md profissional criado (364 linhas)',
                '  • Todos os arquivos .md organizados na pasta docs/',
                '  • Guia de restauração de emergência adicionado',
                '  • 109 comandos documentados',
                '🌍 Todas as correções em 7 idiomas'
            ]
        },
        {
            version: 'v4.0.0',
            date: '7 de Março 2026',
            changes: [
                '🚀 ATUALIZAÇÃO MAIOR DO SISTEMA - Recursos Empresariais!',
                '💾 Banco de Dados SQLite - Migrado de JSON para SQLite',
                '  • Transações para integridade de dados',
                '  • Chaves estrangeiras e índices',
                '  • Modo WAL para acesso concorrente',
                '  • 548 usuários, 12 grupos migrados com sucesso',
                '📝 Sistema de Validação de Entrada',
                '  • Previne SQL injection, XSS, command injection',
                '  • Rate limiting com janelas configuráveis',
                '  • Sanitiza todas as entradas do usuário',
                '  • Valida quantias, JID, URL, idiomas',
                '📊 Painel de Análise Aprimorado',
                '  • Rastreamento de popularidade de comandos',
                '  • Padrões de atividade horária/diária',
                '  • Cálculo de taxa de erros',
                '  • Rastreamento de tempo de resposta',
                '  • Identificação de horários de pico',
                '  • Top comandos, usuários e grupos',
                '📋 Sistema de Registro Winston',
                '  • Arquivos de log rotativos diários',
                '  • Logs separados de erros, comandos, combinados',
                '  • Retenção de 14-30 dias',
                '  • Registro JSON estruturado',
                '⚡ Sistema de Fila de Mensagens',
                '  • Fila Bull com backend Redis',
                '  • Processamento baseado em prioridade',
                '  • Lógica de repetição com recuo exponencial',
                '  • Fallback para fila em memória',
                '🎮 Mensagens Interativas',
                '  • Mensagens com botões e fallback',
                '  • Menus de lista com seções',
                '  • Botões de resposta rápida',
                '  • Menus de jogos e admin pré-construídos',
                '👋 Sistema de Integração',
                '  • Tour guiado de 6 etapas para novos usuários',
                '  • Presente de boas-vindas de 500 moedas',
                '  • Comando .start para ativação manual',
                '  • Guia de início rápido',
                '🏆 Sistema de Torneios',
                '  • Formatos de eliminação simples e round-robin',
                '  • Taxas de entrada e bolsas de prêmios',
                '  • Geração automática de chaves',
                '  • Comando .tournament com 5 subcomandos',
                '  • Distribuição de prêmios (50%/30%/20%)',
                '🎖️ Sistema de Conquistas',
                '  • 11 conquistas em 5 categorias',
                '  • Desbloqueio automático com recompensas',
                '  • Rastreamento de progresso',
                '  • Comando .achievements',
                '  • Economia, Blackjack, Diário, Social, Torneio',
                '📚 Documentação Organizada',
                '  • 106 arquivos markdown organizados em docs/',
                '  • Navegação estruturada',
                '  • Recursos, guias, configuração, solução de problemas',
                '🧪 Infraestrutura de Testes',
                '  • Framework de testes Vitest',
                '  • Testes de banco de dados e validação',
                '  • Relatórios de cobertura',
                '🌍 Todos os recursos em 7 idiomas',
                '  • Inglês, Italiano, Espanhol, Português',
                '  • Russo, Árabe, Hindi'
            ]
        },
        {
            version: 'v3.15.0',
            date: '6 de Março 2026',
            changes: [
                '🎰 RENOVAÇÃO CAÇA-NÍQUEIS - Jogabilidade mais emocionante!',
                '💎 8 níveis de pagamento (multiplicadores 4x-100x)',
                '🔥 Sistema de sequência de vitórias com recompensas bônus',
                '⚡ Bônus sequência: 2 vitórias = +10%, 3 = +25%, 4+ = +50%',
                '🎨 Lindo novo design visual com bordas',
                '😱 Detecção de "quase ganhou" para tentativas próximas',
                '📊 Tabela de pagamentos mostrada ao jogar por diversão',
                '💰 Pagamentos de símbolos melhorados:',
                '  • 💎💎💎 = 100x (Jackpot)',
                '  • 7️⃣7️⃣7️⃣ = 50x (Mega Vitória)',
                '  • 🔔🔔🔔 = 25x (Grande Vitória)',
                '  • 🍇🍇🍇 = 15x (Ótima Vitória)',
                '  • 🍊🍊🍊 = 10x (Boa Vitória)',
                '  • 🍋🍋🍋 = 6x (Bela Vitória)',
                '  • 🍒🍒🍒 = 4x (Pequena Vitória)',
                '  • Dois = 2x (Mini Vitória)',
                '🌍 Todas as melhorias em 6 idiomas',
                '🛡️ Duração Anti-Roubo: 14 dias → 2 dias',
                '🏪 Loja agora mostra "Como Comprar" no topo'
            ]
        },
        {
            version: 'v3.14.0',
            date: '5 de Março 2026',
            changes: [
                '🎡 RODA DA FORTUNA - Recompensas diárias reimaginadas!',
                '🎰 .daily agora gira uma roda de prêmios (50-10,000 moedas)',
                '🎲 8 níveis de prêmios com chances variáveis',
                '✨ Roda giratória animada (3 quadros)',
                '🌟 Celebração especial de jackpot para prêmio 10k',
                '🎯 Aliases: .wheel, .spin',
                '💸 AUMENTO DE PREÇOS DE ARMAS (5x):',
                '• Faca: 5k → 25k moedas',
                '• Pistola: 15k → 75k moedas',
                '• Rifle: 35k → 175k moedas',
                '• Sniper: 75k → 350k moedas',
                '• RPG: 150k → 750k moedas',
                '🔥 Mantém sistema de sequência diária',
                '🌍 Suporte completo de 6 idiomas'
            ]
        },
        {
            version: 'v3.13.0',
            date: '5 de Março 2026',
            changes: [
                '💀 SISTEMA KILL - Eliminação de jogadores estilo GTA',
                '🔫 Comando .kill - Ataque outros jogadores com armas',
                '🛒 5 tipos de armas na loja: Faca, Pistola, Rifle, Sniper, RPG',
                '🎯 Taxas de sucesso: 30%-95% baseado no poder da arma',
                '💰 Preços de armas: 5k-150k moedas (uso único)',
                '📈 Bônus afetam chance de kill (Amuleto da Sorte, VIP, etc.)',
                '💀 Efeito WASTED na foto de perfil da vítima',
                '💸 Vítima perde 10k moedas ao morrer',
                '🔇 Vítima silenciada por 5 minutos (mensagens auto-deletadas)',
                '⚠️ Armas perdidas mesmo se o ataque falhar',
                '🎲 Taxa de sucesso máxima 98% (nunca garantida)'
            ]
        },
        {
            version: 'v3.12.0',
            date: '4 de Março 2026',
            changes: [
                '🎰 Jogo Casino Roleta adicionado',
                '🎲 Roleta Europeia com 0 único (0-36)',
                '💰 9 tipos de aposta: Vermelho/Preto, Par/Ímpar, Baixo/Alto (1:1)',
                '📊 Dúzias, Colunas (2:1), Pleno (35:1)',
                '🎯 Comando .roulette com alias .rlt',
                '🌍 Suporte completo multi-idioma (6 idiomas)',
                '✨ Roda giratória animada (2 segundos)',
                '🔴 Resultados codificados por cor (vermelho, preto, verde)',
                '💵 Limites de aposta: 10-1.000.000 moedas',
                '🏦 Integração completa com sistema bancário',
                '📈 2.7% vantagem casa (padrão Europeu)'
            ]
        },
        {
            version: 'v3.8.0',
            date: '3 de Março 2026',
            changes: [
                '⚔️ Adicionado comando .fight - Defenda-se de roubos!',
                '🎯 30 segundos para lutar quando roubado',
                '💪 Taxa base 50% + aumentos de sorte',
                '🏆 Vitória: Mantém moedas + bônus 50% + ladrão multado',
                '💔 Derrota: Ladrão obtém as moedas',
                '🎰 Caça-níqueis rebalanceado para desafio',
                '📉 Chance diamante: 15% → 5%',
                '📉 Chance sete: 15% → 7%',
                '📉 Tripla combinação: 15% → 10%',
                '💰 Preços da loja aumentados 40-75%',
                '🛡️ Anti-Roubo agora 100k moedas (era 30k)',
                '💎 Todos os itens mais valiosos e estratégicos'
            ]
        },
        {
            version: 'v3.7.0',
            date: '2 de Março 2026',
            changes: [
                '➕ Adicionado comando .add - Adicionar membros ao grupo',
                '👥 Qualquer um pode usar .add (não apenas admins)',
                '📱 Suporta múltiplos números de telefone de uma vez',
                '⚠️ Comando .warn melhorado',
                '🚨 .warn all <motivo> - Advertir todos',
                '🧹 .warnings clear all - Limpar todas as advertências',
                '👁️ Auto-VV agora revela ao grupo',
                '📢 Mensagens de ver uma vez mostradas a todos',
                '🏷️ Mostra remetente com @menção'
            ]
        },
        {
            version: 'v3.5.0',
            date: '25 de Fevereiro 2026',
            changes: [
                '🤖 Assistente IA integrado (Groq)',
                '💬 Comando .ai - Pergunte qualquer coisa',
                '🧠 Modelo Meta Llama 3.3 70B',
                '🌍 Suporte IA multi-idioma',
                '🎰 Sorte caça-níqueis melhorada 30%',
                '👥 Comando .tagadmin adicionado'
            ]
        },
        {
            version: 'v3.4.0',
            date: '15 de Fevereiro 2026',
            changes: [
                '🏆 Adicionada tabela de classificação de blackjack',
                '📊 Top 5 jogadores por categoria',
                '💰 Lucro, vitórias, taxa de vitórias, blackjacks',
                '🥇 Sistema de medalhas para classificações',
                '🌍 Suporte multilíngue'
            ]
        },
        {
            version: 'v3.3.0',
            date: '15 de Fevereiro 2026',
            changes: [
                '🎩 Adicionado sistema de personalidade do dealer',
                '💬 Dealer fala durante os jogos',
                '🎯 Mensagens contextuais para cada situação',
                '🌍 Mensagens do dealer multilíngues',
                '✨ Experiência de cassino mais imersiva'
            ]
        },
        {
            version: 'v3.2.0',
            date: '15 de Fevereiro 2026',
            changes: [
                '🎴 Gráficos de cartas aprimorados com Unicode',
                '🎨 Belas exibições em forma de carta',
                '♠️ Símbolos de naipes claros',
                '📐 Modos de tamanho completo e compacto',
                '✨ Aparência de cassino profissional'
            ]
        },
        {
            version: 'v3.1.0',
            date: '15 de Fevereiro 2026',
            changes: [
                '🎰 Adicionado blackjack multi-mão (2-5 mãos)',
                '🎮 Novo comando .hand para trocar de mão',
                '💰 Cada mão custa o valor da aposta',
                '🎯 Jogue mãos independentemente',
                '✨ Funciona com apostas laterais'
            ]
        },
        {
            version: 'v3.0.0',
            date: '15 de Fevereiro 2026',
            changes: [
                '🎲 Adicionadas apostas laterais de blackjack',
                '🎴 Aposta lateral Perfect Pairs (25:1, 12:1, 6:1)',
                '🃏 Aposta lateral 21+3 estilo pôquer (até 100:1)',
                '💰 5 moedas por aposta lateral',
                '🎯 Pode jogar ambas simultaneamente'
            ]
        },
        {
            version: 'v2.9.0',
            date: '15 de Fevereiro 2026',
            changes: [
                '📊 Adicionado rastreamento de estatísticas de blackjack',
                '🎯 Novo comando .bjstats',
                '📈 Rastreia vitórias, derrotas, empates, blackjacks, estouros',
                '💰 Mostra total apostado, ganho, perdido, lucro líquido',
                '📊 Exibe porcentagem de taxa de vitórias'
            ]
        },
        {
            version: 'v2.8.0',
            date: '15 de Fevereiro 2026',
            changes: [
                '🎬 Adicionadas animações de distribuição de cartas ao blackjack',
                '🃏 Animação de compra de carta no comando .hit',
                '🎩 Animações de revelação de cartas do dealer em .stand',
                '✨ Edição de mensagens suave para animações',
                '🌍 Mensagens de animação multilíngues'
            ]
        },
        {
            version: 'v2.7.0',
            date: '15 de Fevereiro 2026',
            changes: [
                '🎰 Adicionada função de rendição ao blackjack',
                '🏳️ Novo comando .surrender',
                '💰 Recupere metade da sua aposta ao se render',
                '🎯 Opção estratégica para mãos ruins',
                '🌍 Suporte de rendição multilíngue'
            ]
        },
        {
            version: 'v2.6.0',
            date: '15 de Fevereiro 2026',
            changes: [
                '👤 Adicionados nomes de jogadores a todos os jogos',
                '🎮 Mostra quem está jogando em cada jogo',
                '🌍 Exibição de jogador multilíngue',
                '✨ Melhor identificação em chats de grupo',
                '🎯 Funciona em todos os 14 comandos de jogo'
            ]
        },
        {
            version: 'v2.5.0',
            date: '14 de Fevereiro 2026',
            changes: [
                '🌍 Adicionado suporte ao idioma russo (56 comandos)',
                '🎰 Interface de blackjack melhorada com caixas de cartas',
                '⚡ Animação de caça-níqueis mais rápida',
                '🔒 Adicionado comando .lockdown para controle de grupo',
                '🛡️ Adicionada limitação de taxa para prevenir spam',
                '🗑️ Corrigido comando .del para exclusão de mensagens',
                '💰 Sistema de moedas atualizado para todos os idiomas',
                '📋 Adicionados comandos .updates e .latest'
            ]
        },
        {
            version: 'v2.4.0',
            date: '13 de Fevereiro 2026',
            changes: [
                '🎮 Adicionado jogo completo de blackjack (.bj, .hit, .stand, .double)',
                '🎯 Adicionado jogo da velha (.ttt)',
                '📊 Adicionado comando .stats para informações do servidor',
                '⚠️ Adicionado comando .warnings check',
                '🎲 Melhorado RPS com modo PvP',
                '💰 Adicionado sistema de apostas aos jogos de dados e moeda'
            ]
        },
        {
            version: 'v2.3.0',
            date: '12 de Fevereiro 2026',
            changes: [
                '💵 Adicionado comando .bank e sistema de moedas',
                '🎰 Adicionado jogo de caça-níqueis com apostas',
                '🌐 Adicionado .setlang para troca de idioma',
                '📢 Adicionadas mensagens promocionais ao menu',
                '🎨 Animações de jogos aprimoradas'
            ]
        },
        {
            version: 'v2.2.0',
            date: '11 de Fevereiro 2026',
            changes: [
                '🎮 Adicionados jogos 8ball, dados, moeda, pedra papel tesoura',
                '🧮 Adicionados jogos adivinhe o número e trivia',
                '🔢 Adicionado desafio matemático',
                '🎲 Adicionado comando .games para listar jogos',
                '🇮🇹 Adicionado suporte ao idioma italiano'
            ]
        },
        {
            version: 'v2.1.0',
            date: '10 de Fevereiro 2026',
            changes: [
                '👁️ Adicionado comando .vv para mensagens de ver uma vez',
                '🎨 Adicionado comando .sticker',
                '🗑️ Adicionado comando .delete',
                '🆔 Adicionado comando .jid',
                '📢 Adicionado comando .broadcast',
                '🔗 Adicionada proteção .antilink',
                '👋 Adicionadas mensagens de boas-vindas/despedida'
            ]
        },
        {
            version: 'v2.0.0',
            date: '9 de Fevereiro 2026',
            changes: [
                '👮 Adicionados comandos de administrador (ban, kick, promote, demote)',
                '🏷️ Adicionados comandos de tag (tagall, tagnotadmin, hidetag)',
                '⚙️ Adicionadas configurações de grupo (setgname, setgdesc)',
                '🔄 Adicionado comando .resetlink',
                '📊 Adicionados comandos .groupinfo e .staff',
                '🔇 Adicionado comando .mute',
                '⚠️ Adicionado comando .warn com sistema de avisos'
            ]
        },
        {
            version: 'v1.5.0',
            date: '8 de Fevereiro 2026',
            changes: [
                '👑 Adicionado sistema de gerenciamento de proprietários',
                '➕ Adicionados comandos .addowner e .removeowner',
                '📋 Adicionado comando .listowners',
                '🔐 Adicionado comando .checkowner',
                '🎯 Adicionado comando .mode (público/privado)',
                '💬 Adicionado comando .spam para testes'
            ]
        },
        {
            version: 'v1.0.0',
            date: '7 de Fevereiro 2026',
            changes: [
                '🎉 Lançamento inicial do bot',
                '📱 Suporte multi-dispositivo',
                '🔄 Persistência de sessão',
                '📋 Comandos básicos (ping, alive, menu, info)',
                '🤖 Bot pode responder do número do proprietário',
                '🔁 Sistema de prevenção de loop'
            ]
        }
    ],
    ar: [
        {
            version: 'v4.8.0',
            date: '19 مارس 2026',
            changes: [
                '🎰 آلة السلوت — تجديد كامل',
                '🎨 عرض 3 صفوف (علوي/أوسط/سفلي، الأوسط = خط الدفع)',
                '💎 جاكبوت تقدمي — مجمع مشترك، 2% من الخسائر يساهم',
                '  • 💎💎💎 يفوز بالمجمع كاملاً + 100x الرهان',
                '🔔 دورات مجانية — 🔔🔔🔔 تفعل 5 دورات تلقائية',
                '🛒 تعزيزات المتجر تعمل الآن (حظ + مضاعفات)',
                '📊 أمر .slotstats جديد — إحصائيات الدورات والفوز والجاكبوت',
                '⚖️ "All in" يراهن بكامل رصيدك (بدون حد أقصى)',
                '🌍 جميع الميزات بـ 8 لغات'
            ]
        },
        {
            version: 'v4.7.0',
            date: '19 مارس 2026',
            changes: [
                '🔧 إصلاحات وميزات جديدة',
                '🖼️ إصلاح صورة .kill — صورة الملف الشخصي تظهر الآن تحت WASTED',
                '🔇 .mode — تعطيل البوت في هذه المحادثة/المجموعة فقط',
                '🌐 .botoff / .boton — تفعيل/تعطيل البوت بشكل عام',
                '📞 رفض المكالمات تلقائياً (.autocall on/off)',
                '🌍 جميع الميزات بـ 8 لغات'
            ]
        },
        {
            version: 'v4.5.0',
            date: '9 مارس 2026',
            changes: [
                '🚨 استعادة طوارئ البنك وإصلاحات الأخطاء',
                '✅ المشاكل الحرجة المحلولة',
                '  • جميع حسابات البنك للمستخدمين تم استعادتها من النسخة الاحتياطية',
                '  • 558 مستخدم مع أرصدة كاملة تم استردادها',
                '  • نظام البنك المزدوج (JSON + SQLite) متزامن',
                '  • تم إنشاء سكريبت استعادة الطوارئ للاستخدام المستقبلي',
                '🐛 50+ خطأ Await مفقود تم إصلاحه',
                '  • تم إصلاح جميع عمليات البنك async (getBalance, addCoins, removeCoins)',
                '  • لعبة Mines: 7 إصلاحات',
                '  • بلاك جاك: 15+ إصلاح',
                '  • إجراءات بلاك جاك (hit, stand, double, split, insurance, surrender): 20 إصلاح',
                '  • المكافآت اليومية: إصلاحان',
                '  • الشراء بالجملة: 3 إصلاحات',
                '  • جميع أخطاء [object Promise] تم القضاء عليها',
                '📊 التأثير',
                '  • 0 فقدان بيانات - جميع الحسابات تم استعادتها',
                '  • 50+ خطأ حرج تم إصلاحه',
                '  • جميع عروض الأرصدة تعمل الآن بشكل صحيح',
                '  • مشتريات المتجر تظهر أرصدة صحيحة',
                '  • أرباح/خسائر الألعاب تعرض بشكل صحيح',
                '🛡️ إجراءات الأمان',
                '  • تم إنشاء سكريبت emergency-bank-restore.js',
                '  • تم التحقق من مصادر النسخ الاحتياطي المتعددة',
                '  • تمت إضافة وثائق كاملة',
                '  • كلا النظامين متزامنان الآن',
                '📝 التوثيق',
                '  • تم إنشاء README.md احترافي (364 سطر)',
                '  • جميع ملفات .md منظمة في مجلد docs/',
                '  • تمت إضافة دليل استعادة الطوارئ',
                '  • 109 أمر موثق',
                '🌍 جميع الإصلاحات بـ 7 لغات'
            ]
        },
        {
            version: 'v4.0.0',
            date: '7 مارس 2026',
            changes: [
                '🚀 تحديث كبير للنظام - ميزات المؤسسات!',
                '💾 قاعدة بيانات SQLite - الانتقال من JSON إلى SQLite',
                '  • معاملات لسلامة البيانات',
                '  • مفاتيح خارجية وفهارس',
                '  • وضع WAL للوصول المتزامن',
                '  • 548 مستخدم، 12 مجموعة تم ترحيلها بنجاح',
                '📝 نظام التحقق من الإدخال',
                '  • يمنع SQL injection، XSS، command injection',
                '  • تحديد المعدل مع نوافذ قابلة للتكوين',
                '  • تعقيم جميع مدخلات المستخدم',
                '  • التحقق من المبالغ، JID، URL، اللغات',
                '📊 لوحة تحليلات محسنة',
                '  • تتبع شعبية الأوامر',
                '  • أنماط النشاط بالساعة/اليوم',
                '  • حساب معدل الخطأ',
                '  • تتبع وقت الاستجابة',
                '  • تحديد ساعات الذروة',
                '  • أفضل الأوامر والمستخدمين والمجموعات',
                '📋 نظام تسجيل Winston',
                '  • ملفات سجل دورية يومية',
                '  • سجلات منفصلة للأخطاء والأوامر والمجمعة',
                '  • الاحتفاظ لمدة 14-30 يومًا',
                '  • تسجيل JSON منظم',
                '⚡ نظام قائمة انتظار الرسائل',
                '  • قائمة انتظار Bull مع خلفية Redis',
                '  • معالجة قائمة على الأولوية',
                '  • منطق إعادة المحاولة مع تراجع أسي',
                '  • احتياطي لقائمة انتظار في الذاكرة',
                '🎮 رسائل تفاعلية',
                '  • رسائل بأزرار واحتياطي',
                '  • قوائم قائمة مع أقسام',
                '  • أزرار رد سريع',
                '  • قوائم ألعاب وإدارة جاهزة',
                '👋 نظام التأهيل',
                '  • جولة إرشادية من 6 خطوات للمستخدمين الجدد',
                '  • هدية ترحيب 500 عملة',
                '  • أمر .start للتفعيل اليدوي',
                '  • دليل البدء السريع',
                '🏆 نظام البطولات',
                '  • أشكال الإقصاء الفردي والدوري',
                '  • رسوم الدخول وجوائز الجوائز',
                '  • توليد تلقائي للأقواس',
                '  • أمر .tournament مع 5 أوامر فرعية',
                '  • توزيع الجوائز (50%/30%/20%)',
                '🎖️ نظام الإنجازات',
                '  • 11 إنجازًا في 5 فئات',
                '  • فتح تلقائي مع مكافآت',
                '  • تتبع التقدم',
                '  • أمر .achievements',
                '  • الاقتصاد، بلاك جاك، يومي، اجتماعي، بطولة',
                '📚 وثائق منظمة',
                '  • 106 ملف markdown منظم في docs/',
                '  • تنقل منظم',
                '  • الميزات، الأدلة، الإعداد، استكشاف الأخطاء',
                '🧪 بنية تحتية للاختبار',
                '  • إطار اختبار Vitest',
                '  • اختبارات قاعدة البيانات والتحقق',
                '  • تقارير التغطية',
                '🌍 جميع الميزات بـ 7 لغات',
                '  • الإنجليزية، الإيطالية، الإسبانية، البرتغالية',
                '  • الروسية، العربية، الهندية'
            ]
        },
        {
            version: 'v3.15.0',
            date: '6 مارس 2026',
            changes: [
                '🎰 تجديد ماكينة السلوت - لعب أكثر إثارة!',
                '💎 8 مستويات دفع (مضاعفات 4x-100x)',
                '🔥 نظام سلسلة الفوز مع مكافآت إضافية',
                '⚡ مكافآت السلسلة: 2 انتصارات = +10%، 3 = +25%، 4+ = +50%',
                '🎨 تصميم بصري جديد جميل مع حدود',
                '😱 اكتشاف "كدت تفوز" للمحاولات القريبة',
                '📊 جدول المدفوعات يظهر عند اللعب للمتعة',
                '💰 مدفوعات رموز محسنة:',
                '  • 💎💎💎 = 100x (جاكبوت)',
                '  • 7️⃣7️⃣7️⃣ = 50x (فوز ضخم)',
                '  • 🔔🔔🔔 = 25x (فوز كبير)',
                '  • 🍇🍇🍇 = 15x (فوز رائع)',
                '  • 🍊🍊🍊 = 10x (فوز جيد)',
                '  • 🍋🍋🍋 = 6x (فوز لطيف)',
                '  • 🍒🍒🍒 = 4x (فوز صغير)',
                '  • اثنان = 2x (فوز صغير جداً)',
                '🌍 جميع التحسينات في 6 لغات',
                '🛡️ مدة الحماية ضد السرقة: 14 يوم ← 2 يوم',
                '🏪 المتجر الآن يظهر "كيفية الشراء" في الأعلى'
            ]
        },
        {
            version: 'v3.14.0',
            date: '5 مارس 2026',
            changes: [
                '🎡 عجلة الحظ - إعادة تصور المكافآت اليومية!',
                '🎰 .daily الآن يدور عجلة جوائز (50-10,000 عملة)',
                '🎲 8 مستويات جوائز مع فرص متنوعة',
                '✨ عجلة دوارة متحركة (3 إطارات)',
                '🌟 احتفال خاص بالجاكبوت لجائزة 10k',
                '🎯 الأسماء المستعارة: .wheel, .spin',
                '💸 زيادة أسعار الأسلحة (5x):',
                '• سكين: 5k ← 25k عملة',
                '• مسدس: 15k ← 75k عملة',
                '• بندقية: 35k ← 175k عملة',
                '• قناص: 75k ← 350k عملة',
                '• آر بي جي: 150k ← 750k عملة',
                '🔥 يحافظ على نظام السلسلة اليومية',
                '🌍 دعم كامل لـ 6 لغات'
            ]
        },
        {
            version: 'v3.13.0',
            date: '5 مارس 2026',
            changes: [
                '💀 نظام القتل - إزالة اللاعبين بأسلوب GTA',
                '🔫 أمر .kill - هاجم لاعبين تانيين بالأسلحة',
                '🛒 5 أنواع أسلحة في المتجر: سكينة، مسدس، بندقية، قناص، RPG',
                '🎯 معدلات النجاح: 30%-95% حسب قوة السلاح',
                '💰 أسعار الأسلحة: 5k-150k عملة (استخدام واحد)',
                '📈 التعزيزات تأثر على فرصة القتل (تميمة الحظ، VIP، إلخ)',
                '💀 تأثير WASTED على صورة الضحية',
                '💸 الضحية تخسر 10k عملة لما يموت',
                '🔇 الضحية متكتم لمدة 5 دقائق (رسائل تتمسح تلقائي)',
                '⚠️ الأسلحة بتضيع حتى لو الهجوم فشل',
                '🎲 أقصى معدل نجاح 98% (مش مضمون أبداً)'
            ]
        },
        {
            version: 'v3.12.0',
            date: '4 مارس 2026',
            changes: [
                '🎰 إضافة لعبة كازينو الروليت',
                '🎲 روليت أوروبي مع 0 واحد (0-36)',
                '💰 9 أنواع رهان: أحمر/أسود، فردي/زوجي، منخفض/عالي (1:1)',
                '📊 دزينات، أعمدة (2:1), مباشر (35:1)',
                '🎯 أمر .roulette مع الاسم المستعار .rlt',
                '🌍 دعم كامل متعدد اللغات (6 لغات)',
                '✨ عجلة دوارة متحركة (ثانيتان)',
                '🔴 نتائج مرمزة بالألوان (أحمر، أسود، أخضر)',
                '💵 حدود الرهان: 10-1.000.000 عملة',
                '🏦 تكامل كامل مع النظام المصرفي',
                '📈 2.7% ميزة الكازينو (المعيار الأوروبي)'
            ]
        },
        {
            version: 'v3.8.0',
            date: '3 مارس 2026',
            changes: [
                '⚔️ إضافة أمر .fight - دافع ضد السرقات!',
                '🎯 30 ثانية عشان تحارب لما حد يسرقك',
                '💪 معدل أساسي 50% + تعزيزات الحظ',
                '🏆 تفوز: تحتفظ بالعملات + مكافأة 50% + السارق يتغرم',
                '💔 تخسر: السارق ياخد العملات',
                '🎰 ماكينة السلوت متوازنة للتحدي',
                '📉 فرصة الماس: 15% → 5%',
                '📉 فرصة السبعة: 15% → 7%',
                '📉 تطابق ثلاثي: 15% → 10%',
                '💰 أسعار المتجر زادت 40-75%',
                '🛡️ مضاد السرقة دلوقتي 100k عملة (كان 30k)',
                '💎 كل الأغراض أكثر قيمة واستراتيجية'
            ]
        },
        {
            version: 'v3.7.0',
            date: '2 مارس 2026',
            changes: [
                '➕ إضافة أمر .add - إضافة أعضاء للجروب',
                '👥 أي حد يقدر يستخدم .add (مش الأدمنز بس)',
                '📱 يدعم أرقام تليفونات متعددة مرة واحدة',
                '⚠️ أمر .warn محسّن',
                '🚨 .warn all <السبب> - حذر الكل',
                '🧹 .warnings clear all - امسح كل التحذيرات',
                '👁️ Auto-VV دلوقتي بيكشف للجروب',
                '📢 رسائل المشاهدة مرة واحدة بتتعرض للكل',
                '🏷️ بيوضح المرسل بـ @منشن'
            ]
        },
        {
            version: 'v3.5.0',
            date: '25 فبراير 2026',
            changes: [
                '🤖 مساعد AI متكامل (Groq)',
                '💬 أمر .ai - اسأل أي شيء',
                '🧠 نموذج Meta Llama 3.3 70B',
                '🌍 دعم AI متعدد اللغات',
                '🎰 حظ السلوت محسّن 30%',
                '👥 أمر .tagadmin مضاف'
            ]
        },
        {
            version: 'v3.4.0',
            date: '15 فبراير 2026',
            changes: [
                '🏆 إضافة لوحة صدارة بلاك جاك',
                '📊 أفضل 5 لاعبين لكل فئة',
                '💰 الربح، الانتصارات، معدل الفوز، بلاك جاك',
                '🥇 نظام ميداليات للتصنيفات',
                '🌍 دعم متعدد اللغات'
            ]
        },
        {
            version: 'v3.3.0',
            date: '15 فبراير 2026',
            changes: [
                '🎩 إضافة نظام شخصية الموزع',
                '💬 الموزع بيتكلم أثناء الألعاب',
                '🎯 رسائل سياقية لكل موقف',
                '🌍 رسائل الموزع متعددة اللغات',
                '✨ تجربة كازينو أكثر غامرة'
            ]
        },
        {
            version: 'v3.2.0',
            date: '15 فبراير 2026',
            changes: [
                '🎴 رسومات بطاقات محسنة مع Unicode',
                '🎨 عروض جميلة على شكل بطاقة',
                '♠️ رموز أنواع واضحة',
                '📐 أوضاع الحجم الكامل والمضغوط',
                '✨ مظهر كازينو احترافي'
            ]
        },
        {
            version: 'v3.1.0',
            date: '15 فبراير 2026',
            changes: [
                '🎰 إضافة بلاك جاك متعدد الأيدي (2-5 أيدي)',
                '🎮 أمر .hand جديد لتبديل الأيدي',
                '💰 كل يد تكلف مبلغ الرهان',
                '🎯 العب كل يد بشكل مستقل',
                '✨ يعمل مع الرهانات الجانبية'
            ]
        },
        {
            version: 'v3.0.0',
            date: '15 فبراير 2026',
            changes: [
                '🎲 إضافة رهانات جانبية لبلاك جاك',
                '🎴 رهان جانبي Perfect Pairs (25:1, 12:1, 6:1)',
                '🃏 رهان جانبي 21+3 على طريقة البوكر (حتى 100:1)',
                '💰 5 عملات لكل رهان جانبي',
                '🎯 يمكن لعب الاثنين في نفس الوقت'
            ]
        },
        {
            version: 'v2.9.0',
            date: '15 فبراير 2026',
            changes: [
                '📊 إضافة تتبع إحصائيات بلاك جاك',
                '🎯 أمر .bjstats جديد',
                '📈 يتتبع الانتصارات، الخسائر، التعادلات، بلاك جاك، الخسارات',
                '💰 يعرض إجمالي الرهان، الربح، الخسارة، صافي الربح',
                '📊 يعرض نسبة معدل الفوز'
            ]
        },
        {
            version: 'v2.8.0',
            date: '15 فبراير 2026',
            changes: [
                '🎬 إضافة رسوم متحركة لتوزيع البطاقات لبلاك جاك',
                '🃏 رسوم متحركة لسحب البطاقة في أمر .hit',
                '🎩 رسوم متحركة لكشف بطاقات الموزع في .stand',
                '✨ تحرير رسائل سلس للرسوم المتحركة',
                '🌍 رسائل رسوم متحركة متعددة اللغات'
            ]
        },
        {
            version: 'v2.7.0',
            date: '15 فبراير 2026',
            changes: [
                '🎰 إضافة ميزة الاستسلام لبلاك جاك',
                '🏳️ أمر .surrender جديد',
                '💰 استرجع نصف رهانك عند الاستسلام',
                '🎯 خيار استراتيجي للأيدي السيئة',
                '🌍 دعم الاستسلام متعدد اللغات'
            ]
        },
        {
            version: 'v2.6.0',
            date: '15 فبراير 2026',
            changes: [
                '👤 إضافة أسماء اللاعبين لكل الألعاب',
                '🎮 يعرض مين بيلعب في كل لعبة',
                '🌍 عرض اللاعب متعدد اللغات',
                '✨ تحديد أفضل في محادثات المجموعة',
                '🎯 يعمل في كل 14 أمر لعبة'
            ]
        },
        {
            version: 'v2.5.0',
            date: '14 فبراير 2026',
            changes: [
                '🌍 إضافة دعم اللغة الروسية (56 أمر)',
                '🎰 واجهة بلاك جاك محسنة مع صناديق البطاقات',
                '⚡ رسوم متحركة أسرع لماكينة السلوت',
                '🔒 إضافة أمر .lockdown للتحكم في المجموعة',
                '🛡️ إضافة تحديد المعدل لمنع السبام',
                '🗑️ إصلاح أمر .del لحذف الرسائل',
                '💰 تحديث نظام العملات لكل اللغات',
                '📋 إضافة أوامر .updates و .latest'
            ]
        },
        {
            version: 'v2.4.0',
            date: '13 فبراير 2026',
            changes: [
                '🎮 إضافة لعبة بلاك جاك كاملة (.bj, .hit, .stand, .double)',
                '🎯 إضافة لعبة تيك تاك تو (.ttt)',
                '📊 إضافة أمر .stats لمعلومات السيرفر',
                '⚠️ إضافة أمر .warnings check',
                '🎲 تحسين RPS مع وضع PvP',
                '💰 إضافة نظام رهان لألعاب النرد والعملة'
            ]
        },
        {
            version: 'v2.3.0',
            date: '12 فبراير 2026',
            changes: [
                '💵 إضافة أمر .bank ونظام العملات',
                '🎰 إضافة لعبة ماكينة السلوت مع الرهان',
                '🌐 إضافة .setlang لتبديل اللغة',
                '📢 إضافة رسائل ترويجية للقائمة',
                '🎨 تحسين رسوم متحركة للألعاب'
            ]
        },
        {
            version: 'v2.2.0',
            date: '11 فبراير 2026',
            changes: [
                '🎮 إضافة ألعاب 8ball، نرد، عملة، حجر ورقة مقص',
                '🧮 إضافة ألعاب تخمين الرقم والتريفيا',
                '🔢 إضافة تحدي الرياضيات',
                '🎲 إضافة أمر .games لعرض كل الألعاب',
                '🇮🇹 إضافة دعم اللغة الإيطالية'
            ]
        },
        {
            version: 'v2.1.0',
            date: '10 فبراير 2026',
            changes: [
                '👁️ إضافة أمر .vv لرسائل المشاهدة مرة واحدة',
                '🎨 إضافة أمر .sticker',
                '🗑️ إضافة أمر .delete',
                '🆔 إضافة أمر .jid',
                '📢 إضافة أمر .broadcast',
                '🔗 إضافة حماية .antilink',
                '👋 إضافة رسائل الترحيب/الوداع'
            ]
        },
        {
            version: 'v2.0.0',
            date: '9 فبراير 2026',
            changes: [
                '👮 إضافة أوامر الأدمن (ban, kick, promote, demote)',
                '🏷️ إضافة أوامر المنشن (tagall, tagnotadmin, hidetag)',
                '⚙️ إضافة إعدادات المجموعة (setgname, setgdesc)',
                '🔄 إضافة أمر .resetlink',
                '📊 إضافة أوامر .groupinfo و .staff',
                '🔇 إضافة أمر .mute',
                '⚠️ إضافة أمر .warn مع نظام التحذيرات'
            ]
        },
        {
            version: 'v1.5.0',
            date: '8 فبراير 2026',
            changes: [
                '👑 إضافة نظام إدارة المالكين',
                '➕ إضافة أوامر .addowner و .removeowner',
                '📋 إضافة أمر .listowners',
                '🔐 إضافة أمر .checkowner',
                '🎯 إضافة أمر .mode (عام/خاص)',
                '💬 إضافة أمر .spam للاختبار'
            ]
        },
        {
            version: 'v1.0.0',
            date: '7 فبراير 2026',
            changes: [
                '🎉 إطلاق البوت الأولي',
                '📱 دعم متعدد الأجهزة',
                '🔄 استمرارية الجلسة',
                '📋 أوامر أساسية (ping, alive, menu, info)',
                '🤖 البوت يقدر يرد من رقم المالك',
                '🔁 نظام منع التكرار'
            ]
        }
    ],
    hi: [
        {
            version: 'v4.8.0',
            date: '19 मार्च 2026',
            changes: [
                '🎰 स्लॉट मशीन — पूर्ण नवीनीकरण',
                '🎨 3-पंक्ति डिस्प्ले (ऊपर/मध्य/नीचे, मध्य = पेलाइन)',
                '💎 प्रगतिशील जैकपॉट — साझा पूल, 2% हार योगदान देती है',
                '  • 💎💎💎 पूरा पूल + 100x बेट जीतता है',
                '🔔 मुफ्त स्पिन — 🔔🔔🔔 से 5 ऑटो स्पिन',
                '🛒 शॉप बूस्ट अब काम करते हैं (लक + गुणक)',
                '📊 नया .slotstats कमांड — स्पिन, जीत, जैकपॉट आंकड़े',
                '⚖️ "All in" पूरा बैलेंस दांव पर लगाता है (कोई सीमा नहीं)',
                '🌍 8 भाषाओं में सभी सुविधाएं'
            ]
        },
        {
            version: 'v4.7.0',
            date: '19 मार्च 2026',
            changes: [
                '🔧 फिक्स और नई सुविधाएं',
                '🖼️ .kill इमेज फिक्स — प्रोफाइल पिक्चर अब WASTED के नीचे दिखती है',
                '🔇 .mode — इस चैट/ग्रुप में बॉट बंद/चालू करें',
                '🌐 .botoff / .boton — बॉट को ग्लोबली बंद/चालू करें',
                '📞 ऑटो कॉल रिजेक्ट (.autocall on/off)',
                '🌍 8 भाषाओं में सभी सुविधाएं'
            ]
        },
        {
            version: 'v4.5.0',
            date: '9 मार्च 2026',
            changes: [
                '🚨 आपातकालीन बैंक पुनर्स्थापना और बग फिक्स',
                '✅ गंभीर समस्याएं हल',
                '  • सभी उपयोगकर्ता बैंक खाते बैकअप से पुनर्स्थापित',
                '  • पूर्ण शेष राशि के साथ 558 उपयोगकर्ता पुनर्प्राप्त',
                '  • दोहरी बैंकिंग प्रणाली (JSON + SQLite) समन्वयित',
                '  • भविष्य के उपयोग के लिए आपातकालीन पुनर्स्थापना स्क्रिप्ट बनाई गई',
                '🐛 50+ लापता Await बग ठीक किए गए',
                '  • सभी async बैंक संचालन ठीक किए गए (getBalance, addCoins, removeCoins)',
                '  • Mines गेम: 7 फिक्स',
                '  • ब्लैकजैक: 15+ फिक्स',
                '  • ब्लैकजैक क्रियाएं (hit, stand, double, split, insurance, surrender): 20 फिक्स',
                '  • दैनिक पुरस्कार: 2 फिक्स',
                '  • थोक खरीद: 3 फिक्स',
                '  • सभी [object Promise] त्रुटियां समाप्त',
                '📊 प्रभाव',
                '  • 0 डेटा हानि - सभी खाते पुनर्स्थापित',
                '  • 50+ गंभीर बग ठीक किए गए',
                '  • सभी शेष राशि प्रदर्शन अब सही ढंग से काम करते हैं',
                '  • दुकान खरीदारी सही शेष राशि दिखाती है',
                '  • गेम जीत/हार सही ढंग से प्रदर्शित',
                '🛡️ सुरक्षा उपाय',
                '  • emergency-bank-restore.js स्क्रिप्ट बनाई गई',
                '  • कई बैकअप स्रोत सत्यापित',
                '  • पूर्ण दस्तावेज़ीकरण जोड़ा गया',
                '  • दोनों सिस्टम अब समन्वयित',
                '📝 दस्तावेज़ीकरण',
                '  • पेशेवर README.md बनाया गया (364 लाइनें)',
                '  • सभी .md फ़ाइलें docs/ फ़ोल्डर में व्यवस्थित',
                '  • आपातकालीन पुनर्स्थापना गाइड जोड़ी गई',
                '  • 109 कमांड दस्तावेज़ित',
                '🌍 सभी फिक्स 7 भाषाओं में'
            ]
        },
        {
            version: 'v4.0.0',
            date: '7 मार्च 2026',
            changes: [
                '🚀 प्रमुख सिस्टम अपग्रेड - एंटरप्राइज़ सुविधाएं!',
                '💾 SQLite डेटाबेस - JSON से SQLite में माइग्रेट किया गया',
                '  • डेटा अखंडता के लिए लेनदेन',
                '  • विदेशी कुंजी और सूचकांक',
                '  • समवर्ती पहुंच के लिए WAL मोड',
                '  • 548 उपयोगकर्ता, 12 समूह सफलतापूर्वक माइग्रेट किए गए',
                '📝 इनपुट सत्यापन प्रणाली',
                '  • SQL injection, XSS, command injection को रोकता है',
                '  • कॉन्फ़िगर करने योग्य विंडो के साथ दर सीमा',
                '  • सभी उपयोगकर्ता इनपुट को साफ करता है',
                '  • राशि, JID, URL, भाषाओं को मान्य करता है',
                '📊 उन्नत विश्लेषण डैशबोर्ड',
                '  • कमांड लोकप्रियता ट्रैकिंग',
                '  • प्रति घंटा/दैनिक गतिविधि पैटर्न',
                '  • त्रुटि दर गणना',
                '  • प्रतिक्रिया समय ट्रैकिंग',
                '  • पीक घंटों की पहचान',
                '  • शीर्ष कमांड, उपयोगकर्ता और समूह',
                '📋 Winston लॉगिंग सिस्टम',
                '  • दैनिक घूर्णन लॉग फ़ाइलें',
                '  • अलग त्रुटि, कमांड, संयुक्त लॉग',
                '  • 14-30 दिन प्रतिधारण',
                '  • संरचित JSON लॉगिंग',
                '⚡ संदेश कतार प्रणाली',
                '  • Redis बैकएंड के साथ Bull कतार',
                '  • प्राथमिकता-आधारित प्रसंस्करण',
                '  • घातीय बैकऑफ के साथ पुनः प्रयास तर्क',
                '  • इन-मेमोरी कतार में फ़ॉलबैक',
                '🎮 इंटरैक्टिव संदेश',
                '  • बटन और फ़ॉलबैक के साथ संदेश',
                '  • अनुभागों के साथ सूची मेनू',
                '  • त्वरित उत्तर बटन',
                '  • पूर्व-निर्मित गेम और व्यवस्थापक मेनू',
                '👋 ऑनबोर्डिंग सिस्टम',
                '  • नए उपयोगकर्ताओं के लिए 6-चरण निर्देशित दौरा',
                '  • 500 सिक्के स्वागत उपहार',
                '  • मैनुअल ट्रिगर के लिए .start कमांड',
                '  • त्वरित प्रारंभ गाइड',
                '🏆 टूर्नामेंट सिस्टम',
                '  • सिंगल-एलिमिनेशन और राउंड-रॉबिन प्रारूप',
                '  • प्रवेश शुल्क और पुरस्कार पूल',
                '  • स्वचालित ब्रैकेट जनरेशन',
                '  • 5 उप-कमांड के साथ .tournament कमांड',
                '  • पुरस्कार वितरण (50%/30%/20%)',
                '🎖️ उपलब्धि प्रणाली',
                '  • 5 श्रेणियों में 11 उपलब्धियां',
                '  • पुरस्कारों के साथ स्वचालित अनलॉकिंग',
                '  • प्रगति ट्रैकिंग',
                '  • .achievements कमांड',
                '  • अर्थव्यवस्था, ब्लैकजैक, दैनिक, सामाजिक, टूर्नामेंट',
                '📚 संगठित दस्तावेज़ीकरण',
                '  • docs/ में 106 markdown फ़ाइलें व्यवस्थित',
                '  • संरचित नेविगेशन',
                '  • सुविधाएं, गाइड, सेटअप, समस्या निवारण',
                '🧪 परीक्षण अवसंरचना',
                '  • Vitest परीक्षण फ्रेमवर्क',
                '  • डेटाबेस और सत्यापन परीक्षण',
                '  • कवरेज रिपोर्टिंग',
                '🌍 7 भाषाओं में सभी सुविधाएं',
                '  • अंग्रेजी, इतालवी, स्पेनिश, पुर्तगाली',
                '  • रूसी, अरबी, हिंदी'
            ]
        },
        {
            version: 'v3.15.0',
            date: '6 मार्च 2026',
            changes: [
                '🎰 स्लॉट मशीन नवीनीकरण - अधिक रोमांचक गेमप्ले!',
                '💎 8 भुगतान स्तर (4x से 100x गुणक)',
                '🔥 बोनस पुरस्कारों के साथ जीत स्ट्रीक प्रणाली',
                '⚡ स्ट्रीक बोनस: 2 जीत = +10%, 3 = +25%, 4+ = +50%',
                '🎨 सीमाओं के साथ सुंदर नया दृश्य डिज़ाइन',
                '😱 निकट प्रयासों के लिए "लगभग जीत" का पता लगाना',
                '📊 मनोरंजन के लिए खेलते समय भुगतान तालिका दिखाई गई',
                '💰 बेहतर प्रतीक भुगतान:',
                '  • 💎💎💎 = 100x (जैकपॉट)',
                '  • 7️⃣7️⃣7️⃣ = 50x (मेगा जीत)',
                '  • 🔔🔔🔔 = 25x (बड़ी जीत)',
                '  • 🍇🍇🍇 = 15x (महान जीत)',
                '  • 🍊🍊🍊 = 10x (अच्छी जीत)',
                '  • 🍋🍋🍋 = 6x (अच्छी जीत)',
                '  • 🍒🍒🍒 = 4x (छोटी जीत)',
                '  • कोई भी 2 = 2x (छोटी जीत)',
                '🌍 6 भाषाओं में सभी सुधार',
                '🛡️ चोरी-रोधी अवधि: 14 दिन → 2 दिन',
                '🏪 दुकान अब शीर्ष पर "कैसे खरीदें" दिखाती है'
            ]
        },
        {
            version: 'v3.14.0',
            date: '5 मार्च 2026',
            changes: [
                '🎡 भाग्य का पहिया - दैनिक पुरस्कार पुनर्कल्पित!',
                '🎰 .daily अब एक पुरस्कार पहिया घुमाता है (50-10,000 सिक्के)',
                '🎲 विभिन्न संभावनाओं के साथ 8 पुरस्कार स्तर',
                '✨ एनिमेटेड स्पिनिंग व्हील (3 फ्रेम)',
                '🌟 10k पुरस्कार के लिए विशेष जैकपॉट उत्सव',
                '🎯 उपनाम: .wheel, .spin',
                '💸 हथियार मूल्य वृद्धि (5x):',
                '• चाकू: 5k → 25k सिक्के',
                '• पिस्तौल: 15k → 75k सिक्के',
                '• राइफल: 35k → 175k सिक्के',
                '• स्नाइपर: 75k → 350k सिक्के',
                '• RPG: 150k → 750k सिक्के',
                '🔥 दैनिक स्ट्रीक प्रणाली बनाए रखता है',
                '🌍 पूर्ण 6-भाषा समर्थन'
            ]
        },
        {
            version: 'v3.13.0',
            date: '5 मार्च 2026',
            changes: [
                '💀 किल सिस्टम - GTA शैली खिलाड़ी उन्मूलन',
                '🔫 .kill कमांड - हथियारों से अन्य खिलाड़ियों पर हमला करें',
                '🛒 दुकान में 5 हथियार प्रकार: चाकू, पिस्तौल, राइफल, स्नाइपर, RPG',
                '🎯 सफलता दर: हथियार शक्ति के आधार पर 30%-95%',
                '💰 हथियार की कीमतें: 5k-150k सिक्के (एकल-उपयोग)',
                '📈 बूस्ट किल मौके को प्रभावित करते हैं (लकी चार्म, VIP, आदि)',
                '💀 पीड़ित की प्रोफ़ाइल तस्वीर पर WASTED प्रभाव',
                '💸 मारे जाने पर पीड़ित 10k सिक्के खो देता है',
                '🔇 पीड़ित 5 मिनट के लिए म्यूट (स्वतः-हटाए गए संदेश)',
                '⚠️ हमला विफल होने पर भी हथियार खो जाते हैं',
                '🎲 अधिकतम 98% सफलता दर (कभी गारंटीकृत नहीं)'
            ]
        },
        {
            version: 'v3.12.0',
            date: '4 मार्च 2026',
            changes: [
                '🎰 रूलेट कैसीनो गेम जोड़ा गया',
                '🎲 एकल 0 के साथ यूरोपीय रूलेट (0-36)',
                '💰 9 दांव प्रकार: लाल/काला, सम/विषम, निम्न/उच्च (1:1)',
                '📊 दर्जन, स्तंभ (2:1), सीधा ऊपर (35:1)',
                '🎯 .roulette कमांड .rlt उपनाम के साथ',
                '🌍 पूर्ण बहु-भाषा समर्थन (6 भाषाएं)',
                '✨ एनिमेटेड स्पिनिंग व्हील (2 सेकंड)',
                '🔴 रंग-कोडित परिणाम (लाल, काला, हरा)',
                '💵 दांव सीमाएं: 10-1,000,000 सिक्के',
                '🏦 पूर्ण बैंक प्रणाली एकीकरण',
                '📈 2.7% हाउस एज (यूरोपीय मानक)'
            ]
        },
        {
            version: 'v3.11.0',
            date: '4 मार्च 2026',
            changes: [
                '🚀 वायरल विशेषताएं - बॉट को प्रसिद्ध बनाएं!',
                '💸 .pay कमांड - मित्रों को सिक्के भेजें',
                '🎁 .daily कमांड - प्रतिदिन 100-300 सिक्के दावा करें',
                '👥 .invite कमांड - रेफरल प्रणाली (प्रति 3 मित्रों पर 500 सिक्के)',
                '🏆 .leaderboard कमांड - प्रतिस्पर्धा रैंकिंग',
                '📊 शेष राशि, जीत, जीत, रेफरल द्वारा शीर्ष खिलाड़ियों को ट्रैक करें',
                '🔥 +200 सिक्कों तक दैनिक स्ट्रीक बोनस',
                '💰 भुगतान प्रणाली सामाजिक अर्थव्यवस्था बनाती है',
                '🎯ंत-निर्मित वायरल विकास यांत्रिकी'
            ]
        },
        {
            version: 'v3.10.0',
            date: '3 मार्च 2026',
            changes: [
                '🎰 ऑल इन बेटिंग - "all" के साथ सब कुछ दांव पर लगाएं',
                '💰 .slot all, .dice all, .coin all heads',
                '🔧 .manage कमांड उल्लेख पार्सिंग तय की गई',
                '👥 .addall बल्क सदस्य कमांड जोड़ा गया',
                '📰 API एकीकरण के साथ न्यूज़लेटर प्रणाली',
                '♟️ शतरंज गेम सुधार और सुधार'
            ]
        },
        {
            version: 'v3.8.0',
            date: '3 मार्च 2026',
            changes: [
                '⚔️ .fight कमांड जोड़ा गया - डकैती के खिलाफ बचाव करें!',
                '🎯 लूटे जाने पर वापस लड़ने के लिए 30 सेकंड',
                '💪 आधार 50% सफलता दर + भाग्य बूस्ट',
                '🏆 जीत: सिक्के रखें + 50% बोनस + लुटेरे पर जुर्माना',
                '💔 हार: लुटेरा सिक्के प्राप्त करता है',
                '🎰 चुनौती के लिए स्लॉट मशीन पुनर्संतुलित',
                '📉 हीरे की संभावना: 15% → 5%',
                '📉 सात की संभावना: 15% → 7%',
                '📉 ट्रिपल मैच: 15% → 10%',
                '💰 दुकान की कीमतें 40-75% बढ़ीं',
                '🛡️ चोरी-रोधी अब 100k सिक्के (30k था)',
                '💎 सभी वस्तुएं अधिक मूल्यवान और रणनीतिक'
            ]
        },
        {
            version: 'v3.7.0',
            date: '2 मार्च 2026',
            changes: [
                '➕ .add कमांड जोड़ा गया - समूह में सदस्य जोड़ें',
                '👥 कोई भी .add का उपयोग कर सकता है (केवल व्यवस्थापक नहीं)',
                '📱ंक साथ कई फोन नंबरों का समर्थन करता है',
                '⚠️ .warn कमांड बढ़ाया गया',
                '🚨 .warn all <कारण> - सभी को चेतावनी दें',
                '🧹 .warnings clear all - सभी चेतावनियां साफ करें',
                '👁️ ऑटो-VV अब समूह को प्रकट करता है',
                '📢ंक बार देखे गए संदेश सभी को दिखाए गए',
                '🏷️ @उल्लेख के साथ प्रेषक दिखाता है'
            ]
        },
        {
            version: 'v3.5.0',
            date: '25 फरवरी 2026',
            changes: [
                '🤖 AI सहायक एकीकृत (Groq)',
                '💬 .ai कमांड - कुछ भी पूछें',
                '🧠 Meta Llama 3.3 70B मॉडल',
                '🌍 बहु-भाषा AI समर्थन',
                '🎰 स्लॉट मशीन भाग्य 30% सुधार',
                '👥 .tagadmin कमांड जोड़ा गया'
            ]
        },
        {
            version: 'v3.4.0',
            date: '15 फरवरी 2026',
            changes: [
                '🏆 ब्लैकजैक लीडरबोर्ड जोड़ा गया',
                '📊 प्रति श्रेणी शीर्ष 5 खिलाड़ी',
                '💰 लाभ, जीत, जीत दर, ब्लैकजैक',
                '🥇 रैंकिंग के लिए पदक प्रणाली',
                '🌍 बहु-भाषा समर्थन'
            ]
        },
        {
            version: 'v3.3.0',
            date: '15 फरवरी 2026',
            changes: [
                '🎩 डीलर व्यक्तित्व प्रणाली जोड़ी गई',
                '💬 डीलर खेलों के दौरान बात करता है',
                '🎯 हर स्थिति के लिए प्रासंगिक संदेश',
                '🌍 बहु-भाषा डीलर संदेश',
                '✨ अधिक इमर्सिव कैसीनो अनुभव'
            ]
        },
        {
            version: 'v3.2.0',
            date: '15 फरवरी 2026',
            changes: [
                '🎴 यूनिकोड के साथ बेहतर कार्ड ग्राफिक्स',
                '🎨 सुंदर कार्ड-आकार के प्रदर्शन',
                '♠️ स्पष्ट सूट प्रतीक',
                '📐 पूर्ण-आकार और कॉम्पैक्ट मोड',
                '✨ पेशेवर कैसीनो उपस्थिति'
            ]
        },
        {
            version: 'v3.1.0',
            date: '15 फरवरी 2026',
            changes: [
                '🎰 मल्टी-हैंड ब्लैकजैक जोड़ा गया (2-5 हाथ)',
                '🎮 हाथ बदलने के लिए नया .hand कमांड',
                '💰 प्रत्येक हाथ की लागत दांव राशि',
                '🎯ंतंत्र रूप से हाथ खेलें',
                '✨ साइड बेट्स के साथ काम करता है'
            ]
        },
        {
            version: 'v3.0.0',
            date: '15 फरवरी 2026',
            changes: [
                '🎲 ब्लैकजैक साइड बेट्स जोड़े गए',
                '🎴 परफेक्ट पेयर्स साइड बेट (25:1, 12:1, 6:1)',
                '🃏 21+3 पोकर-शैली साइड बेट (100:1 तक)',
                '💰 प्रति साइड बेट 5 सिक्के',
                '🎯ंक साथ दोनों खेल सकते हैं'
            ]
        },
        {
            version: 'v2.9.0',
            date: '15 फरवरी 2026',
            changes: [
                '📊 ब्लैकजैक सांख्यिकी ट्रैकिंग जोड़ी गई',
                '🎯 नया .bjstats कमांड',
                '📈 जीत, हार, पुश, ब्लैकजैक, बस्ट ट्रैक करता है',
                '💰 कुल दांव, जीता, हारा, शुद्ध लाभ दिखाता है',
                '📊 जीत दर प्रतिशत प्रदर्शित करता है'
            ]
        },
        {
            version: 'v2.8.0',
            date: '15 फरवरी 2026',
            changes: [
                '🎬 ब्लैकजैक में कार्ड डीलिंग एनिमेशन जोड़े गए',
                '🃏 .hit कमांड में एनिमेटेड कार्ड ड्राइंग',
                '🎩 .stand में डीलर कार्ड रिवील एनिमेशन',
                '✨ एनिमेशन के लिए सुचारू संदेश संपादन',
                '🌍 बहु-भाषा एनिमेशन संदेश'
            ]
        },
        {
            version: 'v2.7.0',
            date: '15 फरवरी 2026',
            changes: [
                '🎰 ब्लैकजैक में सरेंडर सुविधा जोड़ी गई',
                '🏳️ नया .surrender कमांड',
                '💰 सरेंडर करने पर आधा दांव वापस पाएं',
                '🎯 खराब हाथों के लिए रणनीतिक विकल्प',
                '🌍 बहु-भाषा सरेंडर समर्थन'
            ]
        },
        {
            version: 'v2.6.0',
            date: '15 फरवरी 2026',
            changes: [
                '👤 सभी खेलों में खिलाड़ी के नाम जोड़े गए',
                '🎮 प्रत्येक खेल में कौन खेल रहा है दिखाता है',
                '🌍 बहु-भाषा खिलाड़ी प्रदर्शन',
                '✨ समूह चैट में बेहतर पहचान',
                '🎯 सभी 14 गेम कमांड में काम करता है'
            ]
        },
        {
            version: 'v2.5.0',
            date: '14 फरवरी 2026',
            changes: [
                '🌍 रूसी भाषा समर्थन जोड़ा गया (56 कमांड)',
                '🎰 कार्ड बॉक्स के साथ बेहतर ब्लैकजैक UI',
                '⚡ तेज़ स्लॉट मशीन एनिमेशन',
                '🔒 समूह नियंत्रण के लिए .lockdown कमांड जोड़ा गया',
                '🛡️ स्पैम रोकने के लिए दर सीमा जोड़ी गई',
                '🗑️ संदेश हटाने के लिए .del कमांड तय किया गया',
                '💰 सभी भाषाओं के लिए सिक्का प्रणाली अपडेट की गई',
                '📋 .updates और .latest कमांड जोड़े गए'
            ]
        },
        {
            version: 'v2.4.0',
            date: '13 फरवरी 2026',
            changes: [
                '🎮 पूर्ण ब्लैकजैक गेम जोड़ा गया (.bj, .hit, .stand, .double)',
                '🎯 टिक-टैक-टो गेम जोड़ा गया (.ttt)',
                '📊ंर्वर जानकारी के लिए .stats कमांड जोड़ा गया',
                '⚠️ .warnings check कमांड जोड़ा गया',
                '🎲 PvP मोड के साथ RPS सुधार',
                '💰 पासा और सिक्का खेलों में दांव प्रणाली जोड़ी गई'
            ]
        },
        {
            version: 'v2.3.0',
            date: '12 फरवरी 2026',
            changes: [
                '💵 .bank कमांड और सिक्का प्रणाली जोड़ी गई',
                '🎰 दांव के साथ स्लॉट मशीन गेम जोड़ा गया',
                '🌐 भाषा स्विचिंग के लिए .setlang जोड़ा गया',
                '📢 मेनू में प्रचार संदेश जोड़े गए',
                '🎨 बेहतर गेम एनिमेशन'
            ]
        },
        {
            version: 'v2.2.0',
            date: '11 फरवरी 2026',
            changes: [
                '🎮 8ball, पासा, सिक्का, rps गेम जोड़े गए',
                '🧮 संख्या अनुमान और ट्रिविया गेम जोड़े गए',
                '🔢 गणित चुनौती गेम जोड़ा गया',
                '🎲 गेम सूचीबद्ध करने के लिए .games कमांड जोड़ा गया',
                '🇮🇹 इतालवी भाषा समर्थन जोड़ा गया'
            ]
        },
        {
            version: 'v2.1.0',
            date: '10 फरवरी 2026',
            changes: [
                '👁️ व्यू-वन्स संदेशों के लिए .vv कमांड जोड़ा गया',
                '🎨 .sticker कमांड जोड़ा गया',
                '🗑️ .delete कमांड जोड़ा गया',
                '🆔 .jid कमांड जोड़ा गया',
                '📢 .broadcast कमांड जोड़ा गया',
                '🔗 .antilink सुरक्षा जोड़ी गई',
                '👋ंागत/विदाई संदेश जोड़े गए'
            ]
        },
        {
            version: 'v2.0.0',
            date: '9 फरवरी 2026',
            changes: [
                '👮 व्यवस्थापक कमांड जोड़े गए (ban, kick, promote, demote)',
                '🏷️ टैग कमांड जोड़े गए (tagall, tagnotadmin, hidetag)',
                '⚙️ समूह सेटिंग्स जोड़ी गईं (setgname, setgdesc)',
                '🔄 .resetlink कमांड जोड़ा गया',
                '📊 .groupinfo और .staff कमांड जोड़े गए',
                '🔇 .mute कमांड जोड़ा गया',
                '⚠️ चेतावनी प्रणाली के साथ .warn कमांड जोड़ा गया'
            ]
        },
        {
            version: 'v1.5.0',
            date: '8 फरवरी 2026',
            changes: [
                '👑ंामी प्रबंधन प्रणाली जोड़ी गई',
                '➕ .addowner और .removeowner कमांड जोड़े गए',
                '📋 .listowners कमांड जोड़ा गया',
                '🔐 .checkowner कमांड जोड़ा गया',
                '🎯 .mode कमांड जोड़ा गया (सार्वजनिक/निजी)',
                '💬ंरीक्षण के लिए .spam कमांड जोड़ा गया'
            ]
        },
        {
            version: 'v1.0.0',
            date: '7 फरवरी 2026',
            changes: [
                '🎉 प्रारंभिक बॉट रिलीज़',
                '📱ंहु-उपकरण समर्थन',
                '🔄ंत्र दृढ़ता',
                '📋ंासिक कमांड (ping, alive, menu, info)',
                '🤖ंामी नंबर से बॉट उत्तर दे सकता है',
                '🔁 लूप रोकथाम प्रणाली'
            ]
        }
    ]
};

export default {
    name: 'updates',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        const updateList = updates[lang] || updates.en;
        
        let text = t.title;
        
        // Show all updates
        updateList.forEach((update, index) => {
            if (index === 0) {
                text += `${t.latest}\n`;
            } else if (index === 1) {
                text += t.previous;
            }
            
            text += `\n\n${t.version} ${update.version}\n`;
            text += `${t.date} ${update.date}\n`;
            text += `${t.changes}\n`;
            update.changes.forEach(change => {
                text += `  ${change}\n`;
            });
        });
        
        text += t.footer;
        
        await sendAsChannelForward(sock, from, text, {
            quoted: msg,
            newsletterName: config.botName || 'Bot Updates'
        });
    }
};
