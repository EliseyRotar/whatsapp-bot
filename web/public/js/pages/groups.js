import { UI } from '../ui.js';
import { Auth } from '../auth.js';

export class GroupsPage {
  constructor(ws) {
    this.ws = ws;
    this.ui = new UI();
    this.auth = new Auth();
  }

  async render(container) {
    container.innerHTML = `
      <div class="groups-page">
        <div class="page-header mb-lg">
          <div>
            <h1 style="font-size: 32px; font-weight: 700; margin-bottom: 8px;">Groups</h1>
            <p class="text-secondary">Manage bot groups and settings</p>
          </div>
          <button class="btn btn-primary" id="refreshGroups">
            <i data-lucide="refresh-cw"></i>
            Refresh
          </button>
        </div>
        <div class="card">
          <div class="card-body" id="groupsContent">
            ${this.ui.createSkeleton('card')}
          </div>
        </div>
      </div>
    `;

    lucide.createIcons();
    await this.loadGroups();
    this.setupEventListeners();
  }

  async loadGroups() {
    try {
      const response = await this.auth.fetchWithAuth('/api/groups');
      const data = await response.json();

      const content = document.getElementById('groupsContent');
      
      if (data.groups && data.groups.length > 0) {
        content.innerHTML = `
          <div class="grid grid-cols-3">
            ${data.groups.map(group => `
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title" style="display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="users" style="width: 20px; height: 20px;"></i>
                    ${this.ui.escapeHtml(group.name)}
                  </h3>
                </div>
                <div class="card-body">
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <i data-lucide="user" style="width: 16px; height: 16px; color: var(--text-tertiary);"></i>
                      <span class="text-secondary text-sm">${group.memberCount} members</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <i data-lucide="message-circle" style="width: 16px; height: 16px; color: var(--text-tertiary);"></i>
                      <span class="text-secondary text-sm">${group.messageCount || 0} messages</span>
                    </div>
                    ${group.description ? `
                      <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--border-light);">
                        <p class="text-secondary text-sm" style="font-style: italic; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                          ${this.ui.escapeHtml(group.description)}
                        </p>
                      </div>
                    ` : ''}
                  </div>
                </div>
                <div class="card-footer" style="display: flex; gap: 8px; justify-content: space-between; align-items: center;">
                  <span class="status-badge ${group.settings?.botDisabled ? 'offline' : 'online'}">
                    ${group.settings?.botDisabled ? 'Bot Disabled' : 'Bot Active'}
                  </span>
                  ${group.settings?.welcome ? '<span class="status-badge primary">Welcome On</span>' : ''}
                </div>
              </div>
            `).join('')}
          </div>
        `;
      } else {
        this.ui.showEmpty(content, 'No Groups', 'No groups found. The bot needs to be added to groups first.');
      }

      lucide.createIcons();
    } catch (error) {
      console.error('Error loading groups:', error);
      const content = document.getElementById('groupsContent');
      this.ui.showError(content, 'Failed to load groups');
    }
  }

  setupEventListeners() {
    const refreshBtn = document.getElementById('refreshGroups');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', async () => {
        const content = document.getElementById('groupsContent');
        content.innerHTML = this.ui.createSkeleton('card');
        await this.loadGroups();
        this.ui.showToast('Groups refreshed', 'success');
      });
    }
  }
}
