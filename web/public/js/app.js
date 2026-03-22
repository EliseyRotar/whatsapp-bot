// Main Application
import { Router } from './router.js';
import { WebSocketClient } from './websocket.js';
import { UI } from './ui.js';
import { Auth } from './auth.js';

class App {
  constructor() {
    this.router = new Router();
    this.ws = null;
    this.ui = new UI();
    this.auth = new Auth();
    
    this.init();
  }

  async init() {
    // Check authentication
    if (!this.auth.isAuthenticated()) {
      this.showLoginPage();
      return;
    }

    // Initialize Lucide icons
    lucide.createIcons();

    // Setup event listeners
    this.setupEventListeners();

    // Initialize WebSocket
    this.connectWebSocket();

    // Setup router
    this.setupRouter();

    // Load initial route
    this.router.navigate(window.location.hash || '#dashboard');
  }

  showLoginPage() {
    document.getElementById('app').innerHTML = `
      <div class="login-container">
        <div class="login-card">
          <div class="login-header">
            <i data-lucide="bot"></i>
            <h1>WhatsApp Bot Dashboard</h1>
            <p>Sign in to manage your bot</p>
          </div>
          <form id="loginForm" class="login-form">
            <div class="form-group">
              <label class="form-label" for="username">Username</label>
              <input type="text" id="username" class="form-input" required autocomplete="username">
            </div>
            <div class="form-group">
              <label class="form-label" for="password">Password</label>
              <input type="password" id="password" class="form-input" required autocomplete="current-password">
            </div>
            <button type="submit" class="btn btn-primary btn-lg" style="width: 100%">
              Sign In
            </button>
          </form>
        </div>
      </div>
    `;

    lucide.createIcons();

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      try {
        await this.auth.login(username, password);
        window.location.reload();
      } catch (error) {
        this.ui.showToast('Login failed: ' + error.message, 'error');
      }
    });
  }

  connectWebSocket() {
    const token = this.auth.getToken();
    this.ws = new WebSocketClient(token);

    this.ws.on('bot:status', (data) => {
      this.updateBotStatus(data);
    });

    this.ws.on('message:new', (data) => {
      this.handleNewMessage(data);
    });

    this.ws.on('metrics:update', (data) => {
      this.updateMetrics(data);
    });

    this.ws.on('connect', () => {
      this.ui.showToast('Connected to server', 'success');
    });

    this.ws.on('disconnect', () => {
      this.ui.showToast('Disconnected from server', 'warning');
    });
  }

  setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle')?.addEventListener('click', () => {
      this.toggleTheme();
    });

    // Menu toggle (mobile)
    document.getElementById('menuToggle')?.addEventListener('click', () => {
      document.getElementById('sidebar')?.classList.toggle('show');
    });

    // User menu
    document.getElementById('userMenuBtn')?.addEventListener('click', () => {
      document.getElementById('userDropdown')?.classList.toggle('show');
    });

    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.auth.logout();
      window.location.reload();
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.user-menu')) {
        document.getElementById('userDropdown')?.classList.remove('show');
      }
    });

    // Navigation items
    document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const route = item.getAttribute('data-route');
        this.router.navigate(`#${route}`);
        
        // Close mobile sidebar
        document.getElementById('sidebar')?.classList.remove('show');
      });
    });
  }

  setupRouter() {
    this.router.addRoute('dashboard', async () => {
      const { DashboardPage } = await import('./pages/dashboard.js');
      return new DashboardPage(this.ws);
    });

    this.router.addRoute('messages', async () => {
      const { MessagesPage } = await import('./pages/messages.js');
      return new MessagesPage(this.ws);
    });

    this.router.addRoute('groups', async () => {
      const { GroupsPage } = await import('./pages/groups.js');
      return new GroupsPage(this.ws);
    });

    this.router.addRoute('analytics', async () => {
      const { AnalyticsPage } = await import('./pages/analytics.js');
      return new AnalyticsPage(this.ws);
    });

    this.router.addRoute('commands', async () => {
      const { CommandsPage } = await import('./pages/commands.js');
      return new CommandsPage(this.ws);
    });

    this.router.addRoute('settings', async () => {
      const { SettingsPage } = await import('./pages/settings.js');
      return new SettingsPage(this.ws);
    });

    this.router.on('routeChanged', (route) => {
      this.updateActiveNav(route);
    });
  }

  updateActiveNav(route) {
    document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(item => {
      if (item.getAttribute('data-route') === route) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Update icon
    const icon = document.querySelector('#themeToggle i');
    icon.setAttribute('data-lucide', newTheme === 'dark' ? 'moon' : 'sun');
    lucide.createIcons();
  }

  updateBotStatus(data) {
    // Update bot status in UI
    const statusElements = document.querySelectorAll('.bot-status');
    statusElements.forEach(el => {
      el.textContent = data.status;
      el.className = `status-badge ${data.status}`;
    });
  }

  handleNewMessage(data) {
    // Update message count badge
    const badge = document.querySelector('.nav-item[data-route="messages"] .nav-badge');
    if (badge) {
      const count = parseInt(badge.textContent) + 1;
      badge.textContent = count;
    }

    // Show notification if not on messages page
    if (window.location.hash !== '#messages') {
      this.ui.showToast(`New message from ${data.senderName}`, 'info');
    }
  }

  updateMetrics(data) {
    // Update metrics in dashboard
    if (window.location.hash === '#dashboard') {
      // Trigger update event
      window.dispatchEvent(new CustomEvent('metricsUpdate', { detail: data }));
    }
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new App());
} else {
  new App();
}

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
