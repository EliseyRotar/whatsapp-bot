import { UI } from '../ui.js';
import { Auth } from '../auth.js';

export class SettingsPage {
  constructor(ws) {
    this.ws = ws;
    this.ui = new UI();
    this.auth = new Auth();
    this.config = null;
  }

  async render(container) {
    container.innerHTML = `
      <div class="settings-page">
        <div class="page-header mb-lg">
          <div>
            <h1 style="font-size: 32px; font-weight: 700;">Settings</h1>
            <p class="text-secondary">Configure your WhatsApp bot</p>
          </div>
          <div class="flex gap-md">
            <button class="btn btn-secondary" id="resetSettings">
              <i data-lucide="rotate-ccw"></i>
              Reset to Defaults
            </button>
            <button class="btn btn-primary" id="saveSettings">
              <i data-lucide="save"></i>
              Save All Changes
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1" style="max-width: 1200px; gap: 24px;">
          
          <!-- General Settings -->
          <div class="card">
            <div class="card-header">
              <div>
                <h3 class="card-title">General Configuration</h3>
                <p class="card-subtitle">Basic bot settings and information</p>
              </div>
            </div>
            <div class="card-body">
              <div class="grid grid-cols-2" style="gap: 16px;">
                <div class="form-group">
                  <label class="form-label required">Bot Name</label>
                  <input type="text" class="form-input" id="botName" placeholder="My WhatsApp Bot" />
                  <span class="form-help">Display name for your bot</span>
                </div>
                
                <div class="form-group">
                  <label class="form-label required">Owner Name</label>
                  <input type="text" class="form-input" id="ownerName" placeholder="Admin" />
                  <span class="form-help">Your name or username</span>
                </div>
                
                <div class="form-group">
                  <label class="form-label required">Command Prefix</label>
                  <input type="text" class="form-input" id="prefix" maxlength="1" placeholder="." />
                  <span class="form-help">Character to trigger commands (e.g., .menu)</span>
                </div>
                
                <div class="form-group">
                  <label class="form-label">Owner Number</label>
                  <input type="tel" class="form-input" id="ownerNumber" placeholder="393313444410" />
                  <span class="form-help">Your WhatsApp number (without +)</span>
                </div>
                
                <div class="form-group">
                  <label class="form-label">Bot Mode</label>
                  <select class="form-select" id="mode">
                    <option value="public">Public - Anyone can use</option>
                    <option value="private">Private - Owner only</option>
                    <option value="group">Group Only</option>
                  </select>
                  <span class="form-help">Who can use the bot</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Behavior Settings -->
          <div class="card">
            <div class="card-header">
              <div>
                <h3 class="card-title">Bot Behavior</h3>
                <p class="card-subtitle">Control how the bot responds</p>
              </div>
            </div>
            <div class="card-body">
              <div class="grid grid-cols-2" style="gap: 24px;">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-semibold">Auto Read Messages</div>
                    <div class="text-sm text-secondary">Automatically mark messages as read</div>
                  </div>
                  <label class="switch">
                    <input type="checkbox" id="autoRead" />
                    <span class="switch-slider"></span>
                  </label>
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-semibold">Auto Typing</div>
                    <div class="text-sm text-secondary">Show typing indicator when processing</div>
                  </div>
                  <label class="switch">
                    <input type="checkbox" id="autoTyping" />
                    <span class="switch-slider"></span>
                  </label>
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-semibold">Auto React</div>
                    <div class="text-sm text-secondary">React to messages automatically</div>
                  </div>
                  <label class="switch">
                    <input type="checkbox" id="autoReact" />
                    <span class="switch-slider"></span>
                  </label>
                </div>
                
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-semibold">Auto Reject Calls</div>
                    <div class="text-sm text-secondary">Automatically reject incoming calls</div>
                  </div>
                  <label class="switch">
                    <input type="checkbox" id="autoRejectCalls" />
                    <span class="switch-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Spam Protection -->
          <div class="card">
            <div class="card-header">
              <div>
                <h3 class="card-title">Spam Protection</h3>
                <p class="card-subtitle">Prevent bot from being banned</p>
              </div>
            </div>
            <div class="card-body">
              <div class="grid grid-cols-2" style="gap: 16px;">
                <div class="form-group">
                  <label class="form-label">Spam Delay (ms)</label>
                  <input type="number" class="form-input" id="spamDelay" min="1000" max="10000" step="100" />
                  <span class="form-help">Delay between messages (min: 1000ms)</span>
                </div>
                
                <div class="form-group">
                  <label class="form-label">Max Spam Count</label>
                  <input type="number" class="form-input" id="maxSpamCount" min="10" max="100" />
                  <span class="form-help">Maximum messages before cooldown</span>
                </div>
                
                <div class="form-group">
                  <label class="form-label">Max Warnings</label>
                  <input type="number" class="form-input" id="maxWarnings" min="1" max="10" />
                  <span class="form-help">Warnings before user action</span>
                </div>
              </div>
              <div class="alert" style="margin-top: 16px; padding: 12px; background: rgba(245, 158, 11, 0.1); border-left: 4px solid var(--warning); border-radius: 8px;">
                <div class="flex gap-md">
                  <i data-lucide="alert-triangle" style="color: var(--warning);"></i>
                  <div>
                    <div class="font-semibold" style="color: var(--warning);">Warning</div>
                    <div class="text-sm text-secondary">Low spam delay values can cause WhatsApp to ban your number. Keep delay above 3000ms.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- AI Configuration -->
          <div class="card">
            <div class="card-header">
              <div>
                <h3 class="card-title">AI Integration</h3>
                <p class="card-subtitle">Configure AI providers and API keys</p>
              </div>
            </div>
            <div class="card-body">
              <div class="grid grid-cols-1" style="gap: 16px;">
                <div class="form-group">
                  <label class="form-label">AI Provider</label>
                  <select class="form-select" id="aiProvider">
                    <option value="groq">Groq (Fast & Free)</option>
                    <option value="openrouter">OpenRouter (Multiple Models)</option>
                    <option value="openai">OpenAI (GPT-4)</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label class="form-label">Groq API Key</label>
                  <input type="password" class="form-input" id="groqApiKey" placeholder="gsk_..." />
                  <span class="form-help">Get free API key from <a href="https://console.groq.com" target="_blank" style="color: var(--primary-500);">console.groq.com</a></span>
                </div>
                
                <div class="form-group">
                  <label class="form-label">OpenRouter API Key</label>
                  <input type="password" class="form-input" id="openRouterApiKey" placeholder="sk-or-..." />
                  <span class="form-help">Get API key from <a href="https://openrouter.ai" target="_blank" style="color: var(--primary-500);">openrouter.ai</a></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Download Settings -->
          <div class="card">
            <div class="card-header">
              <div>
                <h3 class="card-title">Download Configuration</h3>
                <p class="card-subtitle">YouTube and media download settings</p>
              </div>
            </div>
            <div class="card-body">
              <div class="grid grid-cols-2" style="gap: 16px;">
                <div class="form-group">
                  <label class="form-label">Max Audio Size (MB)</label>
                  <input type="number" class="form-input" id="maxAudioSize" min="10" max="100" />
                  <span class="form-help">Maximum audio file size</span>
                </div>
                
                <div class="form-group">
                  <label class="form-label">Max Video Size (MB)</label>
                  <input type="number" class="form-input" id="maxVideoSize" min="10" max="200" />
                  <span class="form-help">Maximum video file size</span>
                </div>
                
                <div class="form-group">
                  <label class="form-label">Download Timeout (seconds)</label>
                  <input type="number" class="form-input" id="downloadTimeout" min="60" max="1800" />
                  <span class="form-help">Timeout for downloads</span>
                </div>
                
                <div class="form-group">
                  <label class="form-label">YouTube Delay (ms)</label>
                  <input type="number" class="form-input" id="youtubeDelay" min="500" max="5000" />
                  <span class="form-help">Delay between YouTube requests</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Database Settings -->
          <div class="card">
            <div class="card-header">
              <div>
                <h3 class="card-title">Database Configuration</h3>
                <p class="card-subtitle">Data storage settings</p>
              </div>
            </div>
            <div class="card-body">
              <div class="grid grid-cols-2" style="gap: 16px;">
                <div class="form-group">
                  <label class="form-label">Database Type</label>
                  <select class="form-select" id="dbType">
                    <option value="sqlite">SQLite (Local)</option>
                    <option value="mysql">MySQL</option>
                    <option value="postgresql">PostgreSQL</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label class="form-label">Database Path</label>
                  <input type="text" class="form-input" id="dbPath" placeholder="./data/bot.db" />
                  <span class="form-help">Path to database file (SQLite only)</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Logging Settings -->
          <div class="card">
            <div class="card-header">
              <div>
                <h3 class="card-title">Logging Configuration</h3>
                <p class="card-subtitle">Control log output and storage</p>
              </div>
            </div>
            <div class="card-body">
              <div class="grid grid-cols-2" style="gap: 16px;">
                <div class="form-group">
                  <label class="form-label">Log Level</label>
                  <select class="form-select" id="logLevel">
                    <option value="error">Error - Only errors</option>
                    <option value="warn">Warning - Errors and warnings</option>
                    <option value="info">Info - General information</option>
                    <option value="debug">Debug - Detailed debugging</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label class="form-label">Log Directory</label>
                  <input type="text" class="form-input" id="logDir" placeholder="./logs" />
                  <span class="form-help">Directory for log files</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Appearance Settings -->
          <div class="card">
            <div class="card-header">
              <div>
                <h3 class="card-title">Dashboard Appearance</h3>
                <p class="card-subtitle">Customize the dashboard look</p>
              </div>
            </div>
            <div class="card-body">
              <div class="grid grid-cols-2" style="gap: 16px;">
                <div class="form-group">
                  <label class="form-label">Theme</label>
                  <select class="form-select" id="themeSelect">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto (System)</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label class="form-label">Language</label>
                  <select class="form-select" id="language">
                    <option value="en">English</option>
                    <option value="it">Italiano</option>
                    <option value="es">Español</option>
                    <option value="pt">Português</option>
                    <option value="ru">Русский</option>
                    <option value="ar">العربية</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Danger Zone -->
          <div class="card" style="border-color: var(--error);">
            <div class="card-header">
              <div>
                <h3 class="card-title" style="color: var(--error);">Danger Zone</h3>
                <p class="card-subtitle">Irreversible actions - use with caution</p>
              </div>
            </div>
            <div class="card-body">
              <div class="grid grid-cols-2" style="gap: 16px;">
                <button class="btn btn-secondary" id="restartBot">
                  <i data-lucide="power"></i>
                  Restart Bot
                </button>
                
                <button class="btn btn-secondary" id="clearCache">
                  <i data-lucide="trash-2"></i>
                  Clear Cache
                </button>
                
                <button class="btn btn-secondary" id="exportConfig">
                  <i data-lucide="download"></i>
                  Export Configuration
                </button>
                
                <button class="btn btn-danger" id="resetBot">
                  <i data-lucide="alert-triangle"></i>
                  Factory Reset
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;

    lucide.createIcons();
    await this.loadSettings();
    this.setupEventListeners();
  }

  async loadSettings() {
    try {
      const response = await this.auth.fetchWithAuth('/api/settings');
      const data = await response.json();
      this.config = data;

      // Populate form fields
      document.getElementById('botName').value = data.botName || '';
      document.getElementById('ownerName').value = data.ownerName || '';
      document.getElementById('prefix').value = data.prefix || '.';
      document.getElementById('ownerNumber').value = data.ownerNumber || '';
      document.getElementById('mode').value = data.mode || 'public';
      
      document.getElementById('autoRead').checked = data.autoRead || false;
      document.getElementById('autoTyping').checked = data.autoTyping || false;
      document.getElementById('autoReact').checked = data.autoReact || false;
      document.getElementById('autoRejectCalls').checked = data.autoRejectCalls || false;
      
      document.getElementById('spamDelay').value = data.spamDelay || 3000;
      document.getElementById('maxSpamCount').value = data.maxSpamCount || 50;
      document.getElementById('maxWarnings').value = data.maxWarnings || 3;
      
      document.getElementById('aiProvider').value = data.aiProvider || 'groq';
      document.getElementById('groqApiKey').value = data.groqApiKey || '';
      document.getElementById('openRouterApiKey').value = data.openRouterApiKey || '';
      
      document.getElementById('maxAudioSize').value = data.maxAudioSize || 50;
      document.getElementById('maxVideoSize').value = data.maxVideoSize || 60;
      document.getElementById('downloadTimeout').value = data.downloadTimeout || 600;
      document.getElementById('youtubeDelay').value = data.youtubeDelay || 1000;
      
      document.getElementById('dbType').value = data.dbType || 'sqlite';
      document.getElementById('dbPath').value = data.dbPath || './data/bot.db';
      
      document.getElementById('logLevel').value = data.logLevel || 'info';
      document.getElementById('logDir').value = data.logDir || './logs';
      
      const currentTheme = localStorage.getItem('theme') || 'dark';
      document.getElementById('themeSelect').value = currentTheme;
      
      document.getElementById('language').value = data.language || 'en';

    } catch (error) {
      console.error('Error loading settings:', error);
      this.ui.showToast('Failed to load settings', 'error');
    }
  }

  setupEventListeners() {
    // Save settings
    document.getElementById('saveSettings')?.addEventListener('click', async () => {
      await this.saveSettings();
    });

    // Reset settings
    document.getElementById('resetSettings')?.addEventListener('click', () => {
      if (confirm('Reset all settings to defaults?')) {
        this.resetSettings();
      }
    });

    // Theme change
    document.getElementById('themeSelect')?.addEventListener('change', (e) => {
      const theme = e.target.value;
      if (theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
      } else {
        document.documentElement.setAttribute('data-theme', theme);
      }
      localStorage.setItem('theme', theme);
      this.ui.showToast('Theme updated', 'success');
    });

    // Real-time validation for prefix
    document.getElementById('prefix')?.addEventListener('input', (e) => {
      if (e.target.value.length > 1) {
        e.target.value = e.target.value.slice(0, 1);
      }
    });

    // Real-time validation for spam delay
    document.getElementById('spamDelay')?.addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      const helpText = e.target.nextElementSibling;
      if (value < 1000) {
        e.target.style.borderColor = 'var(--error)';
        if (helpText) {
          helpText.style.color = 'var(--error)';
          helpText.textContent = '⚠️ Must be at least 1000ms to avoid bans!';
        }
      } else if (value < 3000) {
        e.target.style.borderColor = 'var(--warning)';
        if (helpText) {
          helpText.style.color = 'var(--warning)';
          helpText.textContent = '⚠️ Recommended: 3000ms or higher';
        }
      } else {
        e.target.style.borderColor = '';
        if (helpText) {
          helpText.style.color = '';
          helpText.textContent = 'Delay between messages (min: 1000ms)';
        }
      }
    });

    // Real-time validation for max spam count
    document.getElementById('maxSpamCount')?.addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      if (value < 10 || value > 100) {
        e.target.style.borderColor = 'var(--error)';
      } else {
        e.target.style.borderColor = '';
      }
    });

    // Restart bot
    document.getElementById('restartBot')?.addEventListener('click', async () => {
      if (confirm('⚠️ Restart the bot? This will disconnect all users temporarily.')) {
        try {
          this.ui.showToast('Restarting bot...', 'info');
          await this.auth.fetchWithAuth('/api/bot/restart', { method: 'POST' });
          this.ui.showToast('✅ Bot restart initiated. Reconnecting...', 'success');
          
          // Reload page after 5 seconds
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        } catch (error) {
          this.ui.showToast('❌ Failed to restart bot: ' + error.message, 'error');
        }
      }
    });

    // Clear cache
    document.getElementById('clearCache')?.addEventListener('click', async () => {
      if (confirm('Clear all cached data?')) {
        try {
          const btn = document.getElementById('clearCache');
          btn.disabled = true;
          btn.innerHTML = '<i data-lucide="loader"></i> Clearing...';
          lucide.createIcons();
          
          await this.auth.fetchWithAuth('/api/bot/clear-cache', { method: 'POST' });
          this.ui.showToast('✅ Cache cleared successfully', 'success');
          
          btn.disabled = false;
          btn.innerHTML = '<i data-lucide="trash-2"></i> Clear Cache';
          lucide.createIcons();
        } catch (error) {
          this.ui.showToast('❌ Failed to clear cache: ' + error.message, 'error');
          const btn = document.getElementById('clearCache');
          btn.disabled = false;
          btn.innerHTML = '<i data-lucide="trash-2"></i> Clear Cache';
          lucide.createIcons();
        }
      }
    });

    // Export config
    document.getElementById('exportConfig')?.addEventListener('click', () => {
      this.exportConfiguration();
    });

    // Factory reset
    document.getElementById('resetBot')?.addEventListener('click', async () => {
      const confirm1 = confirm('⚠️ FACTORY RESET: This will delete ALL data and settings. Are you absolutely sure?');
      if (!confirm1) return;
      
      const confirm2 = prompt('Type "DELETE EVERYTHING" to confirm factory reset:');
      if (confirm2 !== 'DELETE EVERYTHING') {
        this.ui.showToast('Factory reset cancelled', 'info');
        return;
      }
      
      try {
        const btn = document.getElementById('resetBot');
        btn.disabled = true;
        btn.innerHTML = '<i data-lucide="loader"></i> Resetting...';
        lucide.createIcons();
        
        const response = await this.auth.fetchWithAuth('/api/bot/factory-reset', { method: 'POST' });
        const data = await response.json();
        
        this.ui.showToast('⚠️ ' + data.message, 'warning', 10000);
        
        // Logout and redirect after 3 seconds
        setTimeout(() => {
          this.auth.logout();
          window.location.href = '/';
        }, 3000);
      } catch (error) {
        this.ui.showToast('❌ Failed to perform factory reset: ' + error.message, 'error');
        const btn = document.getElementById('resetBot');
        btn.disabled = false;
        btn.innerHTML = '<i data-lucide="alert-triangle"></i> Factory Reset';
        lucide.createIcons();
      }
    });
  }

  async saveSettings() {
    try {
      // Validate inputs
      const botName = document.getElementById('botName').value.trim();
      const prefix = document.getElementById('prefix').value;
      const spamDelay = parseInt(document.getElementById('spamDelay').value);
      const maxSpamCount = parseInt(document.getElementById('maxSpamCount').value);

      // Validation
      if (!botName) {
        this.ui.showToast('Bot name is required', 'error');
        return;
      }

      if (prefix.length !== 1) {
        this.ui.showToast('Prefix must be exactly 1 character', 'error');
        return;
      }

      if (spamDelay < 1000) {
        this.ui.showToast('⚠️ Spam delay must be at least 1000ms to avoid WhatsApp bans!', 'error');
        return;
      }

      if (maxSpamCount < 10 || maxSpamCount > 100) {
        this.ui.showToast('Max spam count must be between 10 and 100', 'error');
        return;
      }

      // Show loading
      const saveBtn = document.getElementById('saveSettings');
      const originalText = saveBtn.innerHTML;
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<i data-lucide="loader"></i> Saving...';
      lucide.createIcons();

      const settings = {
        botName: botName,
        ownerName: document.getElementById('ownerName').value.trim(),
        prefix: prefix,
        ownerNumber: document.getElementById('ownerNumber').value.trim(),
        mode: document.getElementById('mode').value,
        
        autoRead: document.getElementById('autoRead').checked,
        autoTyping: document.getElementById('autoTyping').checked,
        autoReact: document.getElementById('autoReact').checked,
        autoRejectCalls: document.getElementById('autoRejectCalls').checked,
        
        spamDelay: spamDelay,
        maxSpamCount: maxSpamCount,
        maxWarnings: parseInt(document.getElementById('maxWarnings').value),
        
        aiProvider: document.getElementById('aiProvider').value,
        groqApiKey: document.getElementById('groqApiKey').value,
        openRouterApiKey: document.getElementById('openRouterApiKey').value,
        
        maxAudioSize: parseInt(document.getElementById('maxAudioSize').value),
        maxVideoSize: parseInt(document.getElementById('maxVideoSize').value),
        downloadTimeout: parseInt(document.getElementById('downloadTimeout').value),
        youtubeDelay: parseInt(document.getElementById('youtubeDelay').value),
        
        dbType: document.getElementById('dbType').value,
        dbPath: document.getElementById('dbPath').value.trim(),
        
        logLevel: document.getElementById('logLevel').value,
        logDir: document.getElementById('logDir').value.trim(),
        
        language: document.getElementById('language').value
      };

      const response = await this.auth.fetchWithAuth('/api/settings', {
        method: 'POST',
        body: JSON.stringify(settings)
      });

      const data = await response.json();

      if (response.ok) {
        this.ui.showToast('✅ ' + data.message, 'success', 5000);
        
        // Update config cache
        this.config = settings;
        
        // Show restart prompt if needed
        if (data.requiresRestart) {
          setTimeout(() => {
            const restart = confirm('Settings saved! Restart bot now to apply all changes?');
            if (restart) {
              this.restartBot();
            }
          }, 1000);
        }
      } else {
        throw new Error(data.error || 'Failed to save settings');
      }

      // Restore button
      saveBtn.disabled = false;
      saveBtn.innerHTML = originalText;
      lucide.createIcons();

    } catch (error) {
      console.error('Error saving settings:', error);
      this.ui.showToast('❌ Failed to save settings: ' + error.message, 'error');
      
      // Restore button
      const saveBtn = document.getElementById('saveSettings');
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i data-lucide="save"></i> Save All Changes';
        lucide.createIcons();
      }
    }
  }

  async restartBot() {
    try {
      this.ui.showToast('Restarting bot...', 'info');
      await this.auth.fetchWithAuth('/api/bot/restart', { method: 'POST' });
      this.ui.showToast('Bot restart initiated. Please wait...', 'success');
      
      // Reload page after 5 seconds
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    } catch (error) {
      this.ui.showToast('Failed to restart bot: ' + error.message, 'error');
    }
  }

  resetSettings() {
    this.loadSettings();
    this.ui.showToast('Settings reset to current values', 'info');
  }

  exportConfiguration() {
    try {
      const config = {
        // General
        botName: document.getElementById('botName').value,
        ownerName: document.getElementById('ownerName').value,
        prefix: document.getElementById('prefix').value,
        ownerNumber: document.getElementById('ownerNumber').value,
        mode: document.getElementById('mode').value,
        
        // Behavior
        autoRead: document.getElementById('autoRead').checked,
        autoTyping: document.getElementById('autoTyping').checked,
        autoReact: document.getElementById('autoReact').checked,
        autoRejectCalls: document.getElementById('autoRejectCalls').checked,
        
        // Spam Protection
        spamDelay: parseInt(document.getElementById('spamDelay').value),
        maxSpamCount: parseInt(document.getElementById('maxSpamCount').value),
        maxWarnings: parseInt(document.getElementById('maxWarnings').value),
        
        // AI
        aiProvider: document.getElementById('aiProvider').value,
        // Don't export API keys for security
        
        // Downloads
        maxAudioSize: parseInt(document.getElementById('maxAudioSize').value),
        maxVideoSize: parseInt(document.getElementById('maxVideoSize').value),
        downloadTimeout: parseInt(document.getElementById('downloadTimeout').value),
        youtubeDelay: parseInt(document.getElementById('youtubeDelay').value),
        
        // Database
        dbType: document.getElementById('dbType').value,
        dbPath: document.getElementById('dbPath').value,
        
        // Logging
        logLevel: document.getElementById('logLevel').value,
        logDir: document.getElementById('logDir').value,
        
        // Appearance
        language: document.getElementById('language').value,
        
        // Metadata
        exportedAt: new Date().toISOString(),
        version: '1.1.0'
      };

      const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bot-config-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.ui.showToast('✅ Configuration exported successfully', 'success');
    } catch (error) {
      console.error('Error exporting configuration:', error);
      this.ui.showToast('❌ Failed to export configuration', 'error');
    }
  }

  async factoryReset() {
    // This is now handled in the event listener
  }

  destroy() {}
}
