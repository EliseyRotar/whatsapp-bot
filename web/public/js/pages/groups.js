import { UI } from '../ui.js';
import { Auth } from '../auth.js';

export class GroupsPage {
  constructor(ws) {
    this.ws = ws;
    this.ui = new UI();
    this.auth = new Auth();
    this.groups = [];
    this.filteredGroups = [];
    this.sortBy = 'members'; // members, name, messages
    this.sortOrder = 'desc'; // asc, desc
    this.filters = {
      search: '',
      status: 'all', // all, active, disabled
      minMembers: 0,
      maxMembers: 1000
    };
  }

  async render(container) {
    container.innerHTML = `
      <div class="groups-page">
        <div class="page-header mb-lg">
          <div>
            <h1 style="font-size: 32px; font-weight: 700; margin-bottom: 8px;">Groups</h1>
            <p class="text-secondary">Manage bot groups and settings</p>
          </div>
          <div style="display: flex; gap: 12px;">
            <button class="btn btn-secondary" id="refreshGroups">
              <i data-lucide="refresh-cw"></i>
              Refresh
            </button>
            <button class="btn btn-primary" id="exportGroups">
              <i data-lucide="download"></i>
              Export
            </button>
          </div>
        </div>

        <!-- Statistics Cards -->
        <div class="grid grid-cols-4 mb-lg" id="groupStats">
          <div class="stat-card">
            <div class="stat-card-label">Total Groups</div>
            <div class="stat-card-value" id="totalGroups">0</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-label">Total Members</div>
            <div class="stat-card-value" id="totalMembers">0</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-label">Active Groups</div>
            <div class="stat-card-value" id="activeGroups">0</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-label">Avg Members/Group</div>
            <div class="stat-card-value" id="avgMembers">0</div>
          </div>
        </div>

        <!-- Filters & Search -->
        <div class="card mb-lg">
          <div class="card-body">
            <div class="grid grid-cols-4" style="gap: 16px;">
              <!-- Search -->
              <div style="grid-column: span 2;">
                <label class="form-label">Search Groups</label>
                <div style="position: relative;">
                  <input 
                    type="text" 
                    class="form-input" 
                    id="searchInput" 
                    placeholder="Search by group name..."
                    style="padding-left: 40px;"
                  />
                  <i data-lucide="search" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; color: var(--text-tertiary);"></i>
                </div>
              </div>

              <!-- Status Filter -->
              <div>
                <label class="form-label">Bot Status</label>
                <select class="form-input" id="statusFilter">
                  <option value="all">All Groups</option>
                  <option value="active">Bot Active</option>
                  <option value="disabled">Bot Disabled</option>
                </select>
              </div>

              <!-- Sort By -->
              <div>
                <label class="form-label">Sort By</label>
                <select class="form-input" id="sortBy">
                  <option value="members">Most Members</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="messages">Most Messages</option>
                </select>
              </div>
            </div>

            <!-- Member Range Filter -->
            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border-light);">
              <label class="form-label">Member Count Range</label>
              <div style="display: flex; gap: 12px; align-items: center;">
                <input type="number" class="form-input" id="minMembers" placeholder="Min" min="0" style="width: 120px;" />
                <span class="text-secondary">to</span>
                <input type="number" class="form-input" id="maxMembers" placeholder="Max" min="0" style="width: 120px;" />
                <button class="btn btn-secondary btn-sm" id="clearFilters">
                  <i data-lucide="x"></i>
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Groups Grid -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Groups</h3>
            <span class="text-secondary" id="showingCount">Loading...</span>
          </div>
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

      this.groups = data.groups || [];
      this.filteredGroups = [...this.groups];
      
      this.updateStatistics();
      this.applyFiltersAndSort();
    } catch (error) {
      console.error('Error loading groups:', error);
      const content = document.getElementById('groupsContent');
      this.ui.showError(content, 'Failed to load groups');
    }
  }

  updateStatistics() {
    const totalGroups = this.groups.length;
    const totalMembers = this.groups.reduce((sum, g) => sum + (g.memberCount || 0), 0);
    const activeGroups = this.groups.filter(g => !g.settings?.botDisabled).length;
    const avgMembers = totalGroups > 0 ? Math.round(totalMembers / totalGroups) : 0;

    document.getElementById('totalGroups').textContent = this.ui.formatNumber(totalGroups);
    document.getElementById('totalMembers').textContent = this.ui.formatNumber(totalMembers);
    document.getElementById('activeGroups').textContent = this.ui.formatNumber(activeGroups);
    document.getElementById('avgMembers').textContent = this.ui.formatNumber(avgMembers);
  }

  applyFiltersAndSort() {
    // Apply filters
    this.filteredGroups = this.groups.filter(group => {
      // Search filter
      if (this.filters.search) {
        const searchLower = this.filters.search.toLowerCase();
        if (!group.name.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Status filter
      if (this.filters.status !== 'all') {
        const isDisabled = group.settings?.botDisabled || false;
        if (this.filters.status === 'active' && isDisabled) return false;
        if (this.filters.status === 'disabled' && !isDisabled) return false;
      }

      // Member range filter
      const memberCount = group.memberCount || 0;
      if (this.filters.minMembers > 0 && memberCount < this.filters.minMembers) return false;
      if (this.filters.maxMembers > 0 && memberCount > this.filters.maxMembers) return false;

      return true;
    });

    // Apply sorting
    this.filteredGroups.sort((a, b) => {
      let compareValue = 0;
      
      switch (this.sortBy) {
        case 'members':
          compareValue = (b.memberCount || 0) - (a.memberCount || 0);
          break;
        case 'name':
          compareValue = a.name.localeCompare(b.name);
          break;
        case 'messages':
          compareValue = (b.messageCount || 0) - (a.messageCount || 0);
          break;
      }

      return this.sortOrder === 'desc' ? compareValue : -compareValue;
    });

    this.renderGroups();
  }

  renderGroups() {
    const content = document.getElementById('groupsContent');
    const showingCount = document.getElementById('showingCount');
    
    showingCount.textContent = `Showing ${this.filteredGroups.length} of ${this.groups.length} groups`;

    if (this.filteredGroups.length === 0) {
      this.ui.showEmpty(
        content, 
        'No Groups Found', 
        this.filters.search || this.filters.status !== 'all' || this.filters.minMembers > 0
          ? 'No groups match your filters'
          : 'No groups found. The bot needs to be added to groups first.'
      );
      return;
    }

    content.innerHTML = `
      <div class="grid grid-cols-3">
        ${this.filteredGroups.map(group => this.renderGroupCard(group)).join('')}
      </div>
    `;

    lucide.createIcons();
    this.setupGroupActions();
  }

  renderGroupCard(group) {
    const isDisabled = group.settings?.botDisabled || false;
    const hasWelcome = group.settings?.welcome || false;
    
    return `
      <div class="card" style="position: relative;">
        <div class="card-header">
          <h3 class="card-title" style="display: flex; align-items: center; gap: 8px; font-size: 16px;">
            <i data-lucide="users" style="width: 18px; height: 18px; color: var(--primary-500);"></i>
            <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${this.ui.escapeHtml(group.name)}
            </span>
          </h3>
        </div>
        <div class="card-body">
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <!-- Stats -->
            <div style="display: flex; gap: 16px;">
              <div style="flex: 1;">
                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                  <i data-lucide="user" style="width: 14px; height: 14px; color: var(--text-tertiary);"></i>
                  <span class="text-secondary text-sm">Members</span>
                </div>
                <div style="font-size: 20px; font-weight: 600; color: var(--text-primary);">
                  ${this.ui.formatNumber(group.memberCount || 0)}
                </div>
              </div>
              <div style="flex: 1;">
                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                  <i data-lucide="message-circle" style="width: 14px; height: 14px; color: var(--text-tertiary);"></i>
                  <span class="text-secondary text-sm">Messages</span>
                </div>
                <div style="font-size: 20px; font-weight: 600; color: var(--text-primary);">
                  ${this.ui.formatNumber(group.messageCount || 0)}
                </div>
              </div>
            </div>

            ${group.description ? `
              <div style="padding-top: 12px; border-top: 1px solid var(--border-light);">
                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
                  <i data-lucide="info" style="width: 14px; height: 14px; color: var(--text-tertiary);"></i>
                  <span class="text-secondary text-sm">Description</span>
                </div>
                <p class="text-secondary text-sm" style="font-style: italic; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; line-height: 1.4;">
                  ${this.ui.escapeHtml(group.description)}
                </p>
              </div>
            ` : ''}
          </div>
        </div>
        <div class="card-footer" style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
          <span class="status-badge ${isDisabled ? 'offline' : 'online'}">
            ${isDisabled ? 'Bot Disabled' : 'Bot Active'}
          </span>
          ${hasWelcome ? '<span class="status-badge primary">Welcome On</span>' : ''}
          <button 
            class="btn btn-ghost btn-sm" 
            data-action="view-details" 
            data-group-id="${group.id}"
            style="margin-left: auto;"
            title="View Details"
          >
            <i data-lucide="eye"></i>
          </button>
        </div>
      </div>
    `;
  }

  setupGroupActions() {
    document.querySelectorAll('[data-action="view-details"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const groupId = btn.dataset.groupId;
        const group = this.groups.find(g => g.id === groupId);
        if (group) {
          this.showGroupDetails(group);
        }
      });
    });
  }

  showGroupDetails(group) {
    const isDisabled = group.settings?.botDisabled || false;
    
    this.ui.showModal('Group Details', `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <div class="text-sm text-secondary mb-sm">Group Name</div>
          <div class="font-semibold" style="font-size: 18px;">${this.ui.escapeHtml(group.name)}</div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <div class="text-sm text-secondary mb-sm">Members</div>
            <div style="font-size: 24px; font-weight: 600; color: var(--primary-500);">
              ${this.ui.formatNumber(group.memberCount || 0)}
            </div>
          </div>
          <div>
            <div class="text-sm text-secondary mb-sm">Messages</div>
            <div style="font-size: 24px; font-weight: 600; color: var(--primary-500);">
              ${this.ui.formatNumber(group.messageCount || 0)}
            </div>
          </div>
        </div>

        ${group.description ? `
          <div>
            <div class="text-sm text-secondary mb-sm">Description</div>
            <div style="padding: 12px; background: var(--bg-secondary); border-radius: 8px; word-wrap: break-word; line-height: 1.6;">
              ${this.ui.escapeHtml(group.description)}
            </div>
          </div>
        ` : ''}

        <div>
          <div class="text-sm text-secondary mb-sm">Bot Status</div>
          <span class="status-badge ${isDisabled ? 'offline' : 'online'}">
            ${isDisabled ? 'Disabled' : 'Active'}
          </span>
          ${group.settings?.welcome ? '<span class="status-badge primary">Welcome Messages On</span>' : ''}
        </div>

        <div>
          <div class="text-sm text-secondary mb-sm">Group ID</div>
          <div class="text-xs" style="font-family: monospace; word-break: break-all; background: var(--bg-secondary); padding: 8px; border-radius: 4px;">
            ${group.id}
          </div>
        </div>
      </div>
    `, [
      {
        id: 'copy-id',
        label: 'Copy ID',
        class: 'btn-secondary',
        onClick: async () => {
          try {
            await navigator.clipboard.writeText(group.id);
            this.ui.showToast('Group ID copied to clipboard', 'success');
          } catch (error) {
            this.ui.showToast('Failed to copy ID', 'error');
          }
        }
      },
      {
        id: 'close',
        label: 'Close',
        class: 'btn-primary'
      }
    ]);
    
    setTimeout(() => lucide.createIcons(), 100);
  }

  exportGroups() {
    const dataToExport = this.filteredGroups.map(g => ({
      name: g.name,
      memberCount: g.memberCount,
      messageCount: g.messageCount,
      description: g.description || '',
      botActive: !g.settings?.botDisabled,
      welcomeEnabled: g.settings?.welcome || false,
      id: g.id
    }));

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `groups-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    this.ui.showToast(`Exported ${dataToExport.length} groups`, 'success');
  }

  setupEventListeners() {
    // Search
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.filters.search = e.target.value;
        this.applyFiltersAndSort();
      }, 300);
    });

    // Status filter
    document.getElementById('statusFilter').addEventListener('change', (e) => {
      this.filters.status = e.target.value;
      this.applyFiltersAndSort();
    });

    // Sort by
    document.getElementById('sortBy').addEventListener('change', (e) => {
      this.sortBy = e.target.value;
      this.applyFiltersAndSort();
    });

    // Member range filters
    document.getElementById('minMembers').addEventListener('change', (e) => {
      this.filters.minMembers = parseInt(e.target.value) || 0;
      this.applyFiltersAndSort();
    });

    document.getElementById('maxMembers').addEventListener('change', (e) => {
      this.filters.maxMembers = parseInt(e.target.value) || 0;
      this.applyFiltersAndSort();
    });

    // Clear filters
    document.getElementById('clearFilters').addEventListener('click', () => {
      this.filters = {
        search: '',
        status: 'all',
        minMembers: 0,
        maxMembers: 1000
      };
      document.getElementById('searchInput').value = '';
      document.getElementById('statusFilter').value = 'all';
      document.getElementById('minMembers').value = '';
      document.getElementById('maxMembers').value = '';
      this.applyFiltersAndSort();
      this.ui.showToast('Filters cleared', 'success');
    });

    // Refresh button
    const refreshBtn = document.getElementById('refreshGroups');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', async () => {
        const content = document.getElementById('groupsContent');
        content.innerHTML = this.ui.createSkeleton('card');
        await this.loadGroups();
        this.ui.showToast('Groups refreshed', 'success');
      });
    }

    // Export button
    document.getElementById('exportGroups').addEventListener('click', () => {
      this.exportGroups();
    });

    // WebSocket updates
    if (this.ws && this.ws.socket) {
      this.ws.socket.on('groups:updated', () => {
        this.loadGroups();
      });
    }
  }
}
