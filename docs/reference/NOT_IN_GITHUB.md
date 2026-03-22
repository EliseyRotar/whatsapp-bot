# Files/Folders NOT Uploaded to GitHub

## Excluded by .gitignore

### 1. Environment & Secrets

- `.env` - Environment variables (API keys, passwords, tokens)
- `.env.local` - Local environment overrides
- `.env.*.local` - Environment-specific local configs

### 2. Authentication & Sessions

- `auth_info/` - WhatsApp authentication data (QR codes, session info)
- `*.session` - Session files

### 3. Data Directory (`data/`)

All data files are excluded except placeholder `.gitkeep` files:

- `data/analytics.json` - Analytics data (42K+ messages, 27K+ commands)
- `data/bot-status.json` - Bot connection status
- `data/message-buffer.json` - Last 5,000 messages
- `data/groups.json` - Group settings and message counts
- `data/group_languages.json` - Group language preferences
- `data/warnings.json` - User warnings data
- `data/bot.db` - SQLite database (economy, games, users)
- `data/bot.db-shm` - SQLite shared memory
- `data/bot.db-wal` - SQLite write-ahead log
- `data/economy/` - Economy system data
- `data/games/` - Game state data
- `data/groups/` - Group-specific data
- `data/config/` - Configuration files
- `data/backups/` - Database backups
- `data/migrations/` - Database migration files
- `data/*.backup.*` - Backup files from scripts

### 4. Logs

- `logs/` - Log directory
- `bot.log` - Main bot log (52,661 lines)
- `bot-console.log` - Console output log (732 lines)
- `npm-debug.log*` - NPM debug logs
- `yarn-debug.log*` - Yarn debug logs
- `yarn-error.log*` - Yarn error logs
- `*.log` - Any other log files
- `scripts/maintenance/bot-console.log` - Maintenance script logs

### 5. Dependencies

- `node_modules/` - NPM packages (~500MB+)
- `package-lock.json` - NPM lock file

### 6. IDE & Editor Files

- `.vscode/` - VS Code settings
- `.idea/` - IntelliJ IDEA settings
- `*.sublime-project` - Sublime Text projects
- `*.sublime-workspace` - Sublime Text workspaces

### 7. OS Files

- `.DS_Store` - macOS folder metadata
- `Thumbs.db` - Windows thumbnail cache
- `*.swp` - Vim swap files
- `*.swo` - Vim swap files
- `*~` - Backup files

### 8. Build & Temporary Files

- `dist/` - Build output
- `build/` - Build output
- `*.tsbuildinfo` - TypeScript build info
- `temp/` - Temporary files
- `tmp/` - Temporary files
- `*.tmp` - Temporary files
- `.cache/` - Cache directory

### 9. Test Coverage

- `coverage/` - Test coverage reports
- `.nyc_output/` - NYC coverage output

### 10. Backup Files

- `backups/` - Backup directory
- `*.backup` - Backup files
- `*.bak` - Backup files
- `commands/general/latest.js.backup` - Command backup

## Why These Are Excluded

### Security & Privacy

- `.env` contains sensitive API keys, passwords, database credentials
- `auth_info/` contains WhatsApp session data (if leaked, someone could access your WhatsApp)
- `data/bot.db` contains user data, economy balances, personal information

### Size & Performance

- `node_modules/` is huge (~500MB) and can be regenerated with `npm install`
- `package-lock.json` can cause conflicts between different systems
- Log files grow very large over time

### System-Specific

- `.vscode/` settings are personal preferences
- OS files like `.DS_Store` are system-specific
- Build outputs can be regenerated

### Dynamic Data

- `data/` changes constantly as the bot runs
- Logs grow continuously
- Message buffer updates in real-time
- Analytics data changes every second

## What IS Uploaded to GitHub

### Source Code

- All `.js` files (commands, handlers, utils, web)
- Configuration templates (`.env.example`)
- Package definition (`package.json`)

### Documentation

- All `.md` files (README, guides, documentation)
- Setup scripts (`setup-dashboard.sh`, `restart-bot.sh`)
- Import scripts (`scripts/*.js`)

### Web Dashboard

- All HTML, CSS, JavaScript files in `web/`
- Public assets
- Frontend code

### Configuration

- `config.js` - Bot configuration (no secrets)
- `.gitignore` - Git ignore rules
- `vitest.config.js` - Test configuration
- `whatsapp-bot.service` - Systemd service file

### Assets & Examples

- `assets/` - Images, media
- `examples/` - Example code
- `docs/` - Documentation
- `tests/` - Test files

## How to Set Up on New Machine

1. Clone repository:

   ```bash
   git clone https://github.com/EliseyRotar/whatsapp-bot.git
   cd whatsapp-bot
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy environment template:

   ```bash
   cp .env.example .env
   ```

4. Edit `.env` with your credentials:

   ```bash
   nano .env
   ```

5. Create data directories:

   ```bash
   mkdir -p data/economy data/games data/groups data/config data/backups data/migrations
   ```

6. Start bot:

   ```bash
   npm start
   ```

7. Scan QR code (first time only)

8. Bot will create:
   - `auth_info/` - Session data
   - `data/bot.db` - Database
   - `data/*.json` - Data files
   - `bot.log` - Logs

## Important Notes

### Never Commit These Files

- `.env` - Contains secrets
- `auth_info/` - WhatsApp session (security risk)
- `data/bot.db` - User data (privacy)
- `node_modules/` - Too large

### Safe to Commit

- Source code
- Documentation
- Configuration templates
- Scripts
- Tests

### Backup Separately

- `data/` - Important user data
- `auth_info/` - To avoid re-scanning QR
- `.env` - To remember your settings

## Total Excluded Size

Approximate sizes:

- `node_modules/`: ~500 MB
- `data/`: ~1 MB (grows over time)
- `auth_info/`: ~100 KB
- `logs/`: ~10 MB (grows continuously)
- `backups/`: Varies

Total: ~511 MB excluded from repository

## Repository Size

Actual repository (what's uploaded):

- Source code: ~5 MB
- Documentation: ~500 KB
- Web dashboard: ~2 MB
- Total: ~7.5 MB

This keeps the repository fast to clone and easy to manage!
