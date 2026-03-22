import { UI } from '../ui.js';
import { Auth } from '../auth.js';

export class DashboardPage {
  constructor(ws) {
    this.ws = ws;
    this.ui = new UI();
    this.auth = new Auth();
    this.metrics = null;
    this.updateInterval = null;
  }

  async render(container) {
    container.innerHTML = `
      <div class="dashboard-page">
        <div class="page-header mb-lg">
          <div>
            <h1 style="font-size: 32px; font-weight: 700; margin-bottom: 8px;">Dashboard</h1>
            <p class="text-secondary">Monitor your WhatsApp bot activity</p>
          </div>
          <div class="flex gap-md">
            <button class="btn btn-secondary" id="refreshBtn">
              <i data-lucide="refresh-cw"></i>
              Refresh
            </button>
          </div>
        </div>

        <!-- Bot Status Card -->
        <div class="card mb-lg" id="botStatusCard">
          <div class="card-header">
            <div>
              <h3 class="card-title">Bot Status</h3>
              <p class="card-subtitle">Connection and system information</p>
            </div>
            <div class="status-badge online bot-status">
              <span class="status-dot pulse"></span>
              Loading...
            </div>
          </div>
          <div class="card-body" id="botStatusContent">
            ${this.ui.createSkeleton('card')}
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-4 mb-lg" id="statsGrid">
          ${this.createSkeletonStats()}
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-2 mb-lg">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Activity Overview</h3>
            </div>
            <div class="card-body" id="activityChart">
              ${this.ui.createSkeleton('card')}
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Top Commands</h3>
            </div>
            <div class="card-body" id="commandsChart">
              ${this.ui.createSkeleton('card')}
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Recent Messages</h3>
            <a href="#messages" class="btn btn-ghost btn-sm">View All</a>
          </div>
          <div class="card-body" id="recentMessages">
            ${this.ui.createSkeleton('card')}
          </div>
        </div>
      </div>
    `;

    lucide.createIcons();

    // Load data
    await this.loadData();

    // Setup event listeners
    this.setupEventListeners();

    // Start auto-refresh
    this.startAutoRefresh();
  }

  createSkeletonStats() {
    return Array(4).fill(0).map(() => `
      <div class="stat-card">
        ${this.ui.createSkeleton('title')}
        ${this.ui.createSkeleton('text')}
      </div>
    `).join('');
  }

  async loadData() {
    try {
      // Load bot status
      await this.loadBotStatus();

      // Load metrics
      await this.loadMetrics();

      // Load recent messages
      await this.loadRecentMessages();

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      this.ui.showToast('Failed to load dashboard data', 'error');
    }
  }

  async loadBotStatus() {
    try {
      const response = await this.auth.fetchWithAuth('/api/bot/status');
      const data = await response.json();

      const statusCard = document.getElementById('botStatusContent');
      statusCard.innerHTML = `
        <div class="grid grid-cols-2" style="gap: 24px;">
          <div>
            <div class="text-sm text-secondary mb-sm">Phone Number</div>
            <div class="font-semibold">${data.phoneNumber || 'Not connected'}</div>
          </div>
          <div>
            <div class="text-sm text-secondary mb-sm">Device</div>
            <div class="font-semibold">${data.deviceName || 'Unknown'}</div>
          </div>
          <div>
            <div class="text-sm text-secondary mb-sm">Connected Since</div>
            <div class="font-semibold">${data.connectedAt ? this.ui.formatDate(data.connectedAt) : 'N/A'}</div>
          </div>
          <div>
            <div class="text-sm text-secondary mb-sm">Uptime</div>
            <div class="font-semibold">${data.uptime ? this.ui.formatDuration(data.uptime) : 'N/A'}</div>
          </div>
        </div>
      `;

      // Update status badge
      const statusBadge = document.querySelector('.bot-status');
      statusBadge.className = `status-badge ${data.status}`;
      statusBadge.innerHTML = `
        <span class="status-dot ${data.status === 'online' ? 'pulse' : ''}"></span>
        ${data.status.charAt(0).toUpperCase() + data.status.slice(1)}
      `;

    } catch (error) {
      console.error('Error loading bot status:', error);
    }
  }

  async loadMetrics() {
    try {
      console.log('[METRICS] Loading metrics...');
      const response = await this.auth.fetchWithAuth('/api/analytics/metrics?period=24h');
      
      console.log('[METRICS] Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[METRICS] Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('[METRICS] Data received:', data);
      this.metrics = data;

      const statsGrid = document.getElementById('statsGrid');
      statsGrid.innerHTML = `
        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-label">Total Messages</span>
            <div class="stat-card-icon primary">
              <i data-lucide="message-square"></i>
            </div>
          </div>
          <div class="stat-card-value">${this.ui.formatNumber(data.totalMessages || 0)}</div>
          <div class="stat-card-trend ${data.messagesTrend >= 0 ? 'up' : 'down'}">
            <i data-lucide="${data.messagesTrend >= 0 ? 'trending-up' : 'trending-down'}"></i>
            ${Math.abs(data.messagesTrend || 0)}% from yesterday
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-label">Active Users</span>
            <div class="stat-card-icon success">
              <i data-lucide="users"></i>
            </div>
          </div>
          <div class="stat-card-value">${this.ui.formatNumber(data.activeUsers || 0)}</div>
          <div class="stat-card-trend ${data.usersTrend >= 0 ? 'up' : 'down'}">
            <i data-lucide="${data.usersTrend >= 0 ? 'trending-up' : 'trending-down'}"></i>
            ${Math.abs(data.usersTrend || 0)}% from yesterday
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-label">Active Groups</span>
            <div class="stat-card-icon warning">
              <i data-lucide="users-2"></i>
            </div>
          </div>
          <div class="stat-card-value">${this.ui.formatNumber(data.activeGroups || 0)}</div>
          <div class="stat-card-trend ${data.groupsTrend >= 0 ? 'up' : 'down'}">
            <i data-lucide="${data.groupsTrend >= 0 ? 'trending-up' : 'trending-down'}"></i>
            ${Math.abs(data.groupsTrend || 0)}% from yesterday
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-label">Commands Run</span>
            <div class="stat-card-icon error">
              <i data-lucide="terminal"></i>
            </div>
          </div>
          <div class="stat-card-value">${this.ui.formatNumber(data.commandsExecuted || 0)}</div>
          <div class="stat-card-trend ${data.commandsTrend >= 0 ? 'up' : 'down'}">
            <i data-lucide="${data.commandsTrend >= 0 ? 'trending-up' : 'trending-down'}"></i>
            ${Math.abs(data.commandsTrend || 0)}% from yesterday
          </div>
        </div>
      `;

      lucide.createIcons();

      // Update charts
      this.updateCharts(data);

    } catch (error) {
      console.error('Error loading metrics:', error);
      console.error('Error details:', error.message, error.stack);
      
      // Show error in UI
      const statsGrid = document.getElementById('statsGrid');
      if (statsGrid) {
        statsGrid.innerHTML = `
          <div class="stat-card" style="grid-column: 1 / -1;">
            <div style="padding: 24px; text-align: center; color: var(--error-500);">
              <i data-lucide="alert-circle" style="width: 48px; height: 48px; margin-bottom: 16px;"></i>
              <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">Failed to load metrics</div>
              <div style="font-size: 14px; color: var(--text-secondary);">${error.message}</div>
              <button class="btn btn-primary" style="margin-top: 16px;" onclick="location.reload()">Retry</button>
            </div>
          </div>
        `;
        lucide.createIcons();
      }
    }
  }

  updateCharts(data) {
    // Activity chart (simplified - in production use Chart.js or similar)
    const activityChart = document.getElementById('activityChart');
    activityChart.innerHTML = `
      <div style="padding: 24px 0;">
        <div style="display: flex; flex-direction: column; gap: 16px;">
          ${(data.hourlyActivity || []).slice(-12).map((count, i) => {
            const hour = new Date().getHours() - 11 + i;
            const maxCount = Math.max(...(data.hourlyActivity || [1]));
            const width = (count / maxCount) * 100;
            return `
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 40px; font-size: 12px; color: var(--text-secondary);">
                  ${hour}:00
                </div>
                <div style="flex: 1; height: 24px; background: var(--bg-secondary); border-radius: 4px; overflow: hidden;">
                  <div style="width: ${width}%; height: 100%; background: var(--primary-500); transition: width 0.3s;"></div>
                </div>
                <div style="width: 40px; font-size: 12px; font-weight: 600; text-align: right;">
                  ${count}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    // Commands chart
    const commandsChart = document.getElementById('commandsChart');
    const topCommands = data.topCommands || [];
    commandsChart.innerHTML = `
      <div style="padding: 24px 0;">
        ${topCommands.length > 0 ? `
          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${topCommands.slice(0, 8).map(cmd => {
              const maxCount = topCommands[0].count;
              const width = (cmd.count / maxCount) * 100;
              return `
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div style="width: 80px; font-size: 13px; font-weight: 500; color: var(--text-primary);">
                    .${cmd.command}
                  </div>
                  <div style="flex: 1; height: 20px; background: var(--bg-secondary); border-radius: 4px; overflow: hidden;">
                    <div style="width: ${width}%; height: 100%; background: var(--primary-500); transition: width 0.3s;"></div>
                  </div>
                  <div style="width: 40px; font-size: 12px; font-weight: 600; text-align: right;">
                    ${cmd.count}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        ` : '<p class="text-secondary text-center">No command data available</p>'}
      </div>
    `;
  }

  async loadRecentMessages() {
    try {
      const response = await this.auth.fetchWithAuth('/api/messages/recent?limit=10');
      const data = await response.json();

      const recentMessages = document.getElementById('recentMessages');
      
      if (data.messages && data.messages.length > 0) {
        recentMessages.innerHTML = `
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Message</th>
                  <th>Chat</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                ${data.messages.map(msg => `
                  <tr>
                    <td>
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <div class="skeleton skeleton-avatar" style="width: 32px; height: 32px;"></div>
                        <span class="font-semibold">${this.ui.escapeHtml(msg.senderName || msg.sender || 'Unknown')}</span>
                      </div>
                    </td>
                    <td>
                      <div style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        ${this.ui.escapeHtml(msg.content || '[Media]')}
                      </div>
                    </td>
                    <td>
                      <span class="status-badge ${msg.isGroup ? 'primary' : 'offline'}">
                        ${msg.chatName || (msg.isGroup ? 'Group' : 'Private')}
                      </span>
                    </td>
                    <td class="text-secondary">${this.ui.formatDate(msg.timestamp)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
      } else {
        this.ui.showEmpty(recentMessages, 'No Messages', 'No recent messages to display');
      }

      lucide.createIcons();

    } catch (error) {
      console.error('Error loading recent messages:', error);
      const recentMessages = document.getElementById('recentMessages');
      this.ui.showEmpty(recentMessages, 'Error', 'Failed to load recent messages');
    }
  }

  setupEventListeners() {
    // Refresh button
    document.getElementById('refreshBtn')?.addEventListener('click', () => {
      this.loadData();
      this.ui.showToast('Dashboard refreshed', 'success');
    });

    // Listen for real-time updates via WebSocket
    if (this.ws && this.ws.socket) {
      // Bot status updates
      this.ws.socket.on('bot:status', (status) => {
        console.log('[WS] Bot status update:', status);
        this.loadBotStatus();
      });

      // New message received
      this.ws.socket.on('message:new', (message) => {
        console.log('[WS] New message:', message);
        this.loadRecentMessages();
        this.loadMetrics(); // Update metrics
      });

      // Command executed
      this.ws.socket.on('command:executed', (command) => {
        console.log('[WS] Command executed:', command);
        this.loadMetrics(); // Update metrics
      });

      // System metrics update
      this.ws.socket.on('system:metrics', (metrics) => {
        console.log('[WS] System metrics:', metrics);
        // Could update a system metrics card if we add one
      });
    }

    // Listen for metrics updates
    window.addEventListener('metricsUpdate', (e) => {
      this.metrics = e.detail;
      this.loadMetrics();
    });
  }

  startAutoRefresh() {
    // Refresh every 30 seconds
    this.updateInterval = setInterval(() => {
      this.loadMetrics();
    }, 30000);
  }

  destroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
}
