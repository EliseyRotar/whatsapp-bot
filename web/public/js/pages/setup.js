import { UI } from '../ui.js';
import { Auth } from '../auth.js';

export class SetupPage {
  constructor(ws) {
    this.ws = ws;
    this.ui = new UI();
    this.auth = new Auth();
    this.currentStep = 1;
    this.totalSteps = 3;
    this.qrCode = null;
    this.botStatus = null;
    this.statusInterval = null;
    this.qrInterval = null;
    this.botStatusHandler = null;
    this.qrCodeHandler = null;
  }

  async render(container) {
    container.innerHTML = `
      <div class="setup-wizard">
        <div class="setup-container">
          <!-- Header -->
          <div class="setup-header">
            <h1 style="font-size: 32px; font-weight: 700; margin-bottom: 8px;">
              🤖 WhatsApp Bot Setup
            </h1>
            <p class="text-secondary">Let's get your bot connected to WhatsApp</p>
          </div>

          <!-- Progress Bar -->
          <div class="setup-progress">
            <div class="progress-bar">
              <div class="progress-fill" id="progressFill" style="width: 33%"></div>
            </div>
            <div class="progress-steps">
              <div class="progress-step active" data-step="1">
                <div class="step-number">1</div>
                <div class="step-label">Connect</div>
              </div>
              <div class="progress-step" data-step="2">
                <div class="step-number">2</div>
                <div class="step-label">Verify</div>
              </div>
              <div class="progress-step" data-step="3">
                <div class="step-number">3</div>
                <div class="step-label">Complete</div>
              </div>
            </div>
          </div>

          <!-- Steps Content -->
          <div class="setup-content" id="setupContent">
            ${this.renderStep1()}
          </div>

          <!-- Navigation -->
          <div class="setup-navigation">
            <button class="btn btn-secondary" id="skipSetup">
              Skip Setup
            </button>
            <div style="display: flex; gap: 12px;">
              <button class="btn btn-secondary" id="prevStep" style="display: none;">
                <i data-lucide="chevron-left"></i>
                Previous
              </button>
              <button class="btn btn-primary" id="nextStep">
                Next
                <i data-lucide="chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    lucide.createIcons();
    await this.checkBotStatus();
    this.setupEventListeners();
    this.startStatusPolling();
  }

  renderStep1() {
    return `
      <div class="setup-step" data-step="1">
        <div class="step-icon">📱</div>
        <h2 class="step-title">Connect WhatsApp</h2>
        <p class="step-description">
          Scan the QR code below with your WhatsApp mobile app to connect the bot.
        </p>

        <div class="qr-container" id="qrContainer">
          <div class="qr-loading">
            <div class="spinner"></div>
            <p>Waiting for QR code...</p>
          </div>
        </div>

        <div class="setup-instructions">
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">
            How to scan:
          </h3>
          <ol style="padding-left: 20px; line-height: 1.8;">
            <li>Open WhatsApp on your phone</li>
            <li>Tap <strong>Menu</strong> or <strong>Settings</strong></li>
            <li>Tap <strong>Linked Devices</strong></li>
            <li>Tap <strong>Link a Device</strong></li>
            <li>Point your phone at the QR code above</li>
          </ol>
        </div>

        <div class="setup-status" id="connectionStatus">
          <div class="status-badge offline">
            <span class="status-dot"></span>
            Waiting for connection...
          </div>
        </div>
      </div>
    `;
  }

  renderStep2() {
    return `
      <div class="setup-step" data-step="2">
        <div class="step-icon">✅</div>
        <h2 class="step-title">Connection Verified</h2>
        <p class="step-description">
          Your bot is now connected to WhatsApp!
        </p>

        <div class="verification-card">
          <div class="verification-item">
            <i data-lucide="smartphone" style="width: 24px; height: 24px; color: var(--primary-500);"></i>
            <div>
              <div class="verification-label">Phone Number</div>
              <div class="verification-value" id="phoneNumber">Loading...</div>
            </div>
          </div>
          <div class="verification-item">
            <i data-lucide="user" style="width: 24px; height: 24px; color: var(--primary-500);"></i>
            <div>
              <div class="verification-label">Device Name</div>
              <div class="verification-value" id="deviceName">Loading...</div>
            </div>
          </div>
          <div class="verification-item">
            <i data-lucide="check-circle" style="width: 24px; height: 24px; color: var(--success);"></i>
            <div>
              <div class="verification-label">Status</div>
              <div class="verification-value" style="color: var(--success);">Connected</div>
            </div>
          </div>
        </div>

        <div class="setup-info">
          <i data-lucide="info" style="width: 20px; height: 20px;"></i>
          <div>
            <strong>Session Saved</strong>
            <p>Your session is saved. You won't need to scan the QR code again unless you log out.</p>
          </div>
        </div>
      </div>
    `;
  }

  renderStep3() {
    return `
      <div class="setup-step" data-step="3">
        <div class="step-icon">🎉</div>
        <h2 class="step-title">Setup Complete!</h2>
        <p class="step-description">
          Your WhatsApp bot is ready to use. Here's what you can do next:
        </p>

        <div class="features-grid">
          <div class="feature-card">
            <i data-lucide="message-circle" style="width: 32px; height: 32px; color: var(--primary-500);"></i>
            <h3>Send Commands</h3>
            <p>Try sending <code>.menu</code> to see all available commands</p>
          </div>
          <div class="feature-card">
            <i data-lucide="users" style="width: 32px; height: 32px; color: var(--primary-500);"></i>
            <h3>Add to Groups</h3>
            <p>Add the bot to your WhatsApp groups to manage them</p>
          </div>
          <div class="feature-card">
            <i data-lucide="bar-chart-2" style="width: 32px; height: 32px; color: var(--primary-500);"></i>
            <h3>Monitor Activity</h3>
            <p>View real-time analytics and statistics in the dashboard</p>
          </div>
          <div class="feature-card">
            <i data-lucide="settings" style="width: 32px; height: 32px; color: var(--primary-500);"></i>
            <h3>Configure Settings</h3>
            <p>Customize bot behavior and preferences</p>
          </div>
        </div>

        <div class="quick-links">
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">
            Quick Links:
          </h3>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <a href="#dashboard" class="btn btn-secondary">
              <i data-lucide="home"></i>
              Dashboard
            </a>
            <a href="#messages" class="btn btn-secondary">
              <i data-lucide="message-square"></i>
              Messages
            </a>
            <a href="#groups" class="btn btn-secondary">
              <i data-lucide="users"></i>
              Groups
            </a>
            <a href="#settings" class="btn btn-secondary">
              <i data-lucide="settings"></i>
              Settings
            </a>
          </div>
        </div>
      </div>
    `;
  }

  async checkBotStatus() {
    try {
      const response = await this.auth.fetchWithAuth('/api/bot/status');
      this.botStatus = await response.json();
      
      // If bot is already connected, skip to step 2
      if (this.botStatus.status === 'online') {
        this.currentStep = 2;
        this.updateStep();
      }
    } catch (error) {
      console.error('Error checking bot status:', error);
    }
  }

  async loadQRCode() {
    try {
      const response = await this.auth.fetchWithAuth('/api/bot/qr');
      const data = await response.json();
      
      const qrContainer = document.getElementById('qrContainer');
      
      if (data.qr) {
        this.qrCode = data.qr;
        qrContainer.innerHTML = `
          <div class="qr-code">
            <img src="${data.qr}" alt="QR Code" style="width: 300px; height: 300px; border-radius: 12px;" />
          </div>
          <p class="qr-hint">Scan this QR code with WhatsApp</p>
        `;
      } else if (data.status === 'connected') {
        qrContainer.innerHTML = `
          <div class="qr-success">
            <i data-lucide="check-circle" style="width: 64px; height: 64px; color: var(--success);"></i>
            <p style="font-size: 18px; font-weight: 600; margin-top: 16px;">Already Connected!</p>
          </div>
        `;
        lucide.createIcons();
        
        // Move to step 2
        setTimeout(() => {
          this.currentStep = 2;
          this.updateStep();
        }, 1500);
      } else {
        qrContainer.innerHTML = `
          <div class="qr-waiting">
            <i data-lucide="smartphone" style="width: 64px; height: 64px; color: var(--text-tertiary);"></i>
            <p style="margin-top: 16px;">Waiting for QR code...</p>
            <p class="text-secondary text-sm">Make sure the bot is running</p>
          </div>
        `;
        lucide.createIcons();
      }
    } catch (error) {
      console.error('Error loading QR code:', error);
      const qrContainer = document.getElementById('qrContainer');
      qrContainer.innerHTML = `
        <div class="qr-error">
          <i data-lucide="alert-circle" style="width: 64px; height: 64px; color: var(--error);"></i>
          <p style="margin-top: 16px;">Failed to load QR code</p>
          <button class="btn btn-secondary btn-sm" onclick="location.reload()">
            <i data-lucide="refresh-cw"></i>
            Retry
          </button>
        </div>
      `;
      lucide.createIcons();
    }
  }

  startStatusPolling() {
    // Clear any existing intervals
    if (this.statusInterval) clearInterval(this.statusInterval);
    if (this.qrInterval) clearInterval(this.qrInterval);
    
    // Poll bot status every 2 seconds
    this.statusInterval = setInterval(async () => {
      if (this.currentStep === 1) {
        await this.checkConnectionStatus();
      } else {
        // Stop polling if not on step 1
        clearInterval(this.statusInterval);
        this.statusInterval = null;
      }
    }, 2000);

    // Poll QR code every 5 seconds if on step 1
    this.qrInterval = setInterval(async () => {
      if (this.currentStep === 1 && !this.qrCode) {
        await this.loadQRCode();
      } else if (this.currentStep !== 1) {
        // Stop polling if not on step 1
        clearInterval(this.qrInterval);
        this.qrInterval = null;
      }
    }, 5000);

    // Initial load
    if (this.currentStep === 1) {
      this.loadQRCode();
    }
  }

  async checkConnectionStatus() {
    try {
      const response = await this.auth.fetchWithAuth('/api/bot/status');
      
      if (!response.ok) {
        console.error('[SETUP] Failed to check connection status:', response.status);
        return;
      }
      
      const status = await response.json();
      
      const statusEl = document.getElementById('connectionStatus');
      if (statusEl) {
        if (status.status === 'online') {
          statusEl.innerHTML = `
            <div class="status-badge online">
              <span class="status-dot pulse"></span>
              Connected!
            </div>
          `;
          
          // Auto-advance to step 2
          setTimeout(() => {
            if (this.currentStep === 1) {
              this.currentStep = 2;
              this.updateStep();
            }
          }, 1000);
        } else if (status.status === 'connecting') {
          statusEl.innerHTML = `
            <div class="status-badge connecting">
              <span class="status-dot pulse"></span>
              Connecting...
            </div>
          `;
        }
      }
    } catch (error) {
      console.error('[SETUP] Error checking connection status:', error);
      // Don't show error to user, just log it - polling will retry
    }
  }

  updateStep() {
    // Clear intervals when moving away from step 1
    if (this.currentStep !== 1) {
      if (this.statusInterval) {
        clearInterval(this.statusInterval);
        this.statusInterval = null;
      }
      if (this.qrInterval) {
        clearInterval(this.qrInterval);
        this.qrInterval = null;
      }
    }
    
    // Update progress bar
    const progress = (this.currentStep / this.totalSteps) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;

    // Update step indicators
    document.querySelectorAll('.progress-step').forEach((step, index) => {
      if (index + 1 < this.currentStep) {
        step.classList.add('completed');
        step.classList.remove('active');
      } else if (index + 1 === this.currentStep) {
        step.classList.add('active');
        step.classList.remove('completed');
      } else {
        step.classList.remove('active', 'completed');
      }
    });

    // Update content
    const content = document.getElementById('setupContent');
    if (this.currentStep === 1) {
      content.innerHTML = this.renderStep1();
      this.loadQRCode();
    } else if (this.currentStep === 2) {
      content.innerHTML = this.renderStep2();
      this.loadBotInfo();
    } else if (this.currentStep === 3) {
      content.innerHTML = this.renderStep3();
    }

    lucide.createIcons();

    // Update navigation buttons
    const prevBtn = document.getElementById('prevStep');
    const nextBtn = document.getElementById('nextStep');
    
    if (this.currentStep === 1) {
      prevBtn.style.display = 'none';
      nextBtn.disabled = true;
      nextBtn.innerHTML = '<i data-lucide="loader"></i> Waiting...';
    } else if (this.currentStep === 2) {
      prevBtn.style.display = 'none';
      nextBtn.disabled = false;
      nextBtn.innerHTML = 'Next <i data-lucide="chevron-right"></i>';
    } else if (this.currentStep === 3) {
      prevBtn.style.display = 'none';
      nextBtn.innerHTML = '<i data-lucide="check"></i> Go to Dashboard';
      nextBtn.disabled = false;
    }

    lucide.createIcons();
  }

  async loadBotInfo() {
    try {
      const response = await this.auth.fetchWithAuth('/api/bot/status');
      
      if (!response.ok) {
        console.error('[SETUP] Failed to load bot info:', response.status);
        document.getElementById('phoneNumber').textContent = 'Error loading';
        document.getElementById('deviceName').textContent = 'Error loading';
        return;
      }
      
      const status = await response.json();
      
      document.getElementById('phoneNumber').textContent = status.phoneNumber || 'Unknown';
      document.getElementById('deviceName').textContent = status.deviceName || 'Unknown';
    } catch (error) {
      console.error('[SETUP] Error loading bot info:', error);
      document.getElementById('phoneNumber').textContent = 'Error loading';
      document.getElementById('deviceName').textContent = 'Error loading';
    }
  }

  setupEventListeners() {
    // Next button
    document.getElementById('nextStep').addEventListener('click', () => {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
        this.updateStep();
      } else {
        // Complete setup
        this.completeSetup();
      }
    });

    // Skip button
    document.getElementById('skipSetup').addEventListener('click', () => {
      if (confirm('Are you sure you want to skip the setup? You can always connect later.')) {
        this.completeSetup();
      }
    });

    // WebSocket events - use the WebSocketClient's on() method to avoid duplicates
    if (this.ws) {
      // Create handler functions that we can remove later
      this.botStatusHandler = (status) => {
        if (status.status === 'online' && this.currentStep === 1) {
          this.currentStep = 2;
          this.updateStep();
        }
      };

      this.qrCodeHandler = (data) => {
        if (data.qr && this.currentStep === 1) {
          const qrContainer = document.getElementById('qrContainer');
          if (qrContainer) {
            this.qrCode = data.qr;
            qrContainer.innerHTML = `
              <div class="qr-code">
                <img src="${data.qr}" alt="QR Code" style="width: 300px; height: 300px; border-radius: 12px;" />
              </div>
              <p class="qr-hint">Scan this QR code with WhatsApp</p>
            `;
          }
        }
      };

      // Add listeners
      this.ws.on('bot:status', this.botStatusHandler);
      this.ws.on('qr:code', this.qrCodeHandler);
    }
  }

  completeSetup() {
    // Mark setup as complete
    localStorage.setItem('setupComplete', 'true');
    
    // Navigate to dashboard
    window.location.hash = '#dashboard';
  }

  destroy() {
    // Clear intervals
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
      this.statusInterval = null;
    }
    if (this.qrInterval) {
      clearInterval(this.qrInterval);
      this.qrInterval = null;
    }
    
    // Remove WebSocket event listeners
    if (this.ws) {
      if (this.botStatusHandler) {
        this.ws.off('bot:status', this.botStatusHandler);
        this.botStatusHandler = null;
      }
      if (this.qrCodeHandler) {
        this.ws.off('qr:code', this.qrCodeHandler);
        this.qrCodeHandler = null;
      }
    }
  }
}
