# 📁 Project Structure

This document explains the reorganized project structure for better maintainability and scalability.

## 🗂️ Directory Overview

```
WA_BOT/
├── commands/           # All bot commands organized by category
│   ├── action/        # Action commands (kill, etc.)
│   ├── admin/         # Group administration commands
│   ├── games/         # Gaming commands (blackjack, chess, etc.)
│   ├── general/       # General user commands
│   ├── owner/         # Bot owner-only commands
│   └── index.js       # Command loader and registry
│
├── config/            # Configuration files
│   ├── config.js      # Main configuration
│   └── paths.js       # Centralized path definitions
│
├── data/              # All data storage (organized by category)
│   ├── economy/       # Economy-related data
│   │   ├── bank.json
│   │   ├── player_stats.json
│   │   ├── user_inventory.json
│   │   ├── daily_claims.json
│   │   ├── daily_limits.json
│   │   ├── referrals.json
│   │   ├── shop_inventory.json
│   │   ├── shop_items.json
│   │   └── weapons.json
│   │
│   ├── games/         # Game-specific data
│   │   ├── blackjackStats.json
│   │   ├── chess_games.json
│   │   ├── slot_streaks.json
│   │   └── mines_stats.json
│   │
│   ├── groups/        # Group management data
│   │   ├── groups.json
│   │   ├── group_languages.json
│   │   ├── warnings.json
│   │   └── muted_users.json
│   │
│   ├── config/        # Configuration data
│   │   ├── antidelete_config.json
│   │   ├── orario_config.json
│   │   ├── newsletter_config.json
│   │   ├── additional_owners.json
│   │   └── teachers.json
│   │
│   ├── backups/       # Backup files
│   ├── migrations/    # Migration-related data
│   └── bot.db         # SQLite database
│
├── docs/              # Documentation
│   ├── api/           # API documentation
│   ├── bugs/          # Bug reports and fixes
│   ├── changelog/     # Version history
│   ├── commands/      # Command documentation
│   ├── deployment/    # Deployment guides
│   ├── features/      # Feature documentation
│   ├── games/         # Game guides
│   ├── guides/        # User guides
│   ├── security/      # Security documentation
│   ├── setup/         # Setup instructions
│   └── troubleshooting/ # Troubleshooting guides
│
├── handlers/          # Message and event handlers
│   └── messageHandler.js
│
├── logs/              # Application logs (auto-generated)
│
├── scripts/           # Utility scripts
│   ├── migrations/    # Migration scripts
│   │   ├── migrate-to-sqlite.js
│   │   ├── test-api-simple.js
│   │   ├── test-trading.js
│   │   └── test-risk-ratio.js
│   │
│   ├── organize_docs.js
│   ├── start.sh
│   ├── fix-session.sh
│   ├── test-bot.sh
│   ├── test-session.sh
│   ├── test-commands.sh
│   ├── install-service.sh
│   └── install-web-monitor.sh
│
├── tests/             # Test files
│   ├── unit/          # Unit tests
│   ├── integration/   # Integration tests
│   ├── database.test.js
│   └── validation.test.js
│
├── utils/             # Utility modules (organized by function)
│   ├── core/          # Core utilities
│   │   ├── helpers.js
│   │   ├── validation.js
│   │   ├── cache.js
│   │   ├── messageQueue.js
│   │   ├── securityEnhancements.js
│   │   ├── ownerManager.js
│   │   ├── onboarding.js
│   │   ├── newsletterScheduler.js
│   │   └── omegleManager.js
│   │
│   ├── database/      # Database utilities
│   │   ├── database.js      # Group settings (JSON)
│   │   ├── databaseV2.js    # Main database (SQLite)
│   │   ├── bank.js          # Simple bank operations
│   │   ├── bank_SAFE.js     # Thread-safe bank operations
│   │   └── migrateBank.js   # Migration utilities
│   │
│   ├── economy/       # Economy system utilities
│   │   ├── shopSystem.js
│   │   ├── leaderboard.js
│   │   ├── achievements.js
│   │   ├── referrals.js
│   │   ├── dailyRewards.js
│   │   ├── dailyLimits.js
│   │   └── tournaments.js
│   │
│   ├── game/          # Game logic utilities
│   │   ├── chessEngine.js
│   │   ├── chessAI.js
│   │   ├── chessDisplay.js
│   │   ├── chessGameManager.js
│   │   ├── chessStockfishAPI.js
│   │   ├── dealerMessages.js
│   │   ├── gameValidation.js
│   │   ├── sideBets.js
│   │   ├── blackjackGames.js
│   │   └── blackjackStats.js
│   │
│   ├── ui/            # User interface utilities
│   │   ├── cardDisplay.js
│   │   ├── interactiveMenu.js
│   │   └── interactiveMessages.js
│   │
│   ├── config/        # Configuration utilities
│   │   ├── language.js
│   │   ├── translations.js
│   │   ├── antideleteConfig.js
│   │   ├── orarioConfig.js
│   │   └── teacherNames.js
│   │
│   ├── monitoring/    # Monitoring and logging
│   │   ├── logger.js
│   │   ├── loggerV2.js
│   │   └── analytics.js
│   │
│   └── index.js       # Central export file (backward compatibility)
│
├── web/               # Web dashboard
│   ├── public/        # Static files
│   ├── server.js      # Express server
│   └── README.md      # Web dashboard docs
│
├── .env               # Environment variables (not tracked)
├── .env.example       # Environment template
├── .gitignore         # Git ignore rules
├── config.js          # Main configuration (deprecated, use config/config.js)
├── index.js           # Bot entry point
├── package.json       # Dependencies and scripts
├── README.md          # Project documentation
└── vitest.config.js   # Test configuration
```

## 📋 Key Changes

### 1. Utils Organization

**Before:** 42 files in flat structure
**After:** Organized into 6 categories

- `core/` - Core functionality (helpers, validation, security)
- `database/` - All database operations
- `economy/` - Economy system (shop, achievements, rewards)
- `game/` - Game logic (chess, blackjack, validation)
- `ui/` - User interface components
- `config/` - Configuration and localization
- `monitoring/` - Logging and analytics

### 2. Data Organization

**Before:** 27 files in flat structure
**After:** Organized into 5 categories

- `economy/` - User balances, inventory, shop data
- `games/` - Game statistics and state
- `groups/` - Group settings and moderation
- `config/` - Bot configuration data
- `backups/` - Backup files
- `migrations/` - Migration-related data

### 3. Scripts Organization

**Before:** Scripts scattered in root
**After:** All in `scripts/` directory

- Shell scripts (\*.sh) moved to `scripts/`
- Migration scripts moved to `scripts/migrations/`
- Test scripts organized

### 4. Backward Compatibility

All existing imports continue to work through re-export files:

```javascript
// Old import (still works)
import { isAdmin } from "../utils/helpers.js";

// New import (recommended)
import { isAdmin } from "../utils/core/helpers.js";

// Central import (also works)
import { isAdmin } from "../utils/index.js";
```

## 🔄 Migration Guide

### For Developers

1. **Existing code continues to work** - No immediate changes required
2. **New code should use new paths** - Import from organized directories
3. **Use `config/paths.js`** - For all data file paths

### For Data Files

All data files have been moved but the application automatically handles the new locations through `config/paths.js`.

## 🎯 Benefits

1. **Better Organization** - Easy to find related files
2. **Scalability** - Easy to add new features
3. **Maintainability** - Clear separation of concerns
4. **Backward Compatible** - No breaking changes
5. **Professional Structure** - Industry-standard organization

## 📚 Related Documentation

- [Setup Guide](./guides/QUICK_START_V2.md)
- [Command Reference](./commands/)
- [API Documentation](./api/)
- [Troubleshooting](./troubleshooting/)

## 🤝 Contributing

When adding new files:

1. Place in appropriate category directory
2. Update `utils/index.js` if adding utilities
3. Update `config/paths.js` if adding data files
4. Document in relevant docs/ subdirectory

---

**Last Updated:** March 9, 2026
**Version:** 2.0.0
