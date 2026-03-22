import { UI } from '../ui.js';
import { Auth } from '../auth.js';

export class AnalyticsPage {
  constructor(ws) {
    this.ws = ws;
    this.ui = new UI();
    this.auth = new Auth();
  }

  async render(container) {
    container.innerHTML = `
      <div class="analytics-page">
        <div class="page-header mb-lg">
          <h1 style="font-size: 32px; font-weight: 700;">Analytics</h1>
        </div>
        <div class="card">
          <div class="card-body text-center" style="padding: 48px;">
            <i data-lucide="bar-chart-3" style="width: 64px; height: 64px; color: var(--text-tertiary); margin-bottom: 16px;"></i>
            <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 8px;">Analytics Dashboard</h2>
            <p class="text-secondary">Detailed analytics coming soon</p>
          </div>
        </div>
      </div>
    `;

    lucide.createIcons();
  }

  destroy() {}
}
