import { UI } from '../ui.js';
import { Auth } from '../auth.js';

export class MessagesPage {
  constructor(ws) {
    this.ws = ws;
    this.ui = new UI();
    this.auth = new Auth();
    this.messages = [];
    this.filteredMessages = [];
    this.currentPage = 1;
    this.pageSize = 50;
    this.selectedMessages = new Set();
    this.filters = {
      search: '',
      chatType: 'all', // all, group, private
      sender: 'all',
      dateFrom: '',
      dateTo: '',
      messageType: 'all' // all, text, command, media
    };
  }

  async render(container) {
    container.innerHTML = `
      <div class="messages-page">
        <div class="page-header mb-lg">
          <div>
            <h1 style="font-size: 32px; font-weight: 700; margin-bottom: 8px;">Messages</h1>
            <p class="text-secondary">View and filter all bot messages</p>
          </div>
          <div class="flex gap-md">
            <button class="btn btn-secondary" id="refreshMessages">
              <i data-lucide="refresh-cw"></i>
              Refresh
            </button>
            <button class="btn btn-primary" id="exportMessages">
              <i data-lucide="download"></i>
              Export
            </button>
          </div>
        </div>

        <!-- Filters -->
        <div class="card mb-lg">
          <div class="card-body">
            <div class="grid grid-cols-4" style="gap: 16px; margin-bottom: 16px;">
              <!-- Search -->
              <div style="grid-column: span 2;">
                <label class="form-label">Search Messages</label>
                <div style="position: relative;">
                  <input 
                    type="text" 
                    class="form-input" 
                    id="searchInput" 
                    placeholder="Search by sender or message content..."
                    style="padding-left: 40px;"
                  />
                  <i data-lucide="search" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; color: var(--text-tertiary);"></i>
                </div>
              </div>

              <!-- Chat Type Filter -->
              <div>
                <label class="form-label">Chat Type</label>
                <select class="form-input" id="chatTypeFilter">
                  <option value="all">All Chats</option>
                  <option value="group">Groups Only</option>
                  <option value="private">Private Only</option>
                </select>
              </div>

              <!-- Sender Filter -->
              <div>
                <label class="form-label">Sender</label>
                <select class="form-input" id="senderFilter">
                  <option value="all">All Senders</option>
                </select>
              </div>
            </div>

            <!-- Advanced Filters Row -->
            <div class="grid grid-cols-4" style="gap: 16px;">
              <!-- Date From -->
              <div>
                <label class="form-label">From Date</label>
                <input type="date" class="form-input" id="dateFromFilter" />
              </div>

              <!-- Date To -->
              <div>
                <label class="form-label">To Date</label>
                <input type="date" class="form-input" id="dateToFilter" />
              </div>

              <!-- Message Type -->
              <div>
                <label class="form-label">Message Type</label>
                <select class="form-input" id="messageTypeFilter">
                  <option value="all">All Types</option>
                  <option value="command">Commands</option>
                  <option value="text">Text Only</option>
                  <option value="media">Media</option>
                </select>
              </div>

              <!-- Clear Filters -->
              <div style="display: flex; align-items: flex-end;">
                <button class="btn btn-secondary" id="clearFilters" style="width: 100%;">
                  <i data-lucide="x"></i>
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-4 mb-lg" id="messageStats">
          <div class="stat-card">
            <div class="stat-card-label">Total Messages</div>
            <div class="stat-card-value" id="totalCount">0</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-label">Group Messages</div>
            <div class="stat-card-value" id="groupCount">0</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-label">Private Messages</div>
            <div class="stat-card-value" id="privateCount">0</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-label">Unique Senders</div>
            <div class="stat-card-value" id="senderCount">0</div>
          </div>
        </div>

        <!-- Messages Table -->
        <div class="card">
          <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h3 class="card-title">Messages</h3>
              <span class="text-secondary" id="showingCount">Showing 0 messages</span>
            </div>
            <div style="display: flex; gap: 8px;" id="bulkActions" style="display: none;">
              <button class="btn btn-secondary btn-sm" id="selectAllBtn">
                <i data-lucide="check-square"></i>
                Select All
              </button>
              <button class="btn btn-secondary btn-sm" id="deselectAllBtn">
                <i data-lucide="square"></i>
                Deselect All
              </button>
              <button class="btn btn-primary btn-sm" id="exportSelectedBtn">
                <i data-lucide="download"></i>
                Export Selected (<span id="selectedCount">0</span>)
              </button>
            </div>
          </div>
          <div class="card-body" id="messagesContent">
            ${this.ui.createSkeleton('card')}
          </div>
          
          <!-- Pagination -->
          <div class="card-footer" id="paginationContainer" style="display: none;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div class="text-secondary" id="paginationInfo">
                Showing 1-50 of 100
              </div>
              <div style="display: flex; gap: 8px;" id="paginationButtons">
                <!-- Pagination buttons will be inserted here -->
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    lucide.createIcons();
    await this.loadMessages();
    this.setupEventListeners();
  }

  async loadMessages() {
    try {
      const response = await this.auth.fetchWithAuth('/api/messages?limit=1000');
      const data = await response.json();
      this.messages = data.messages || [];
      this.filteredMessages = [...this.messages];
      
      this.updateStats();
      this.populateSenderFilter();
      this.renderMessages();
    } catch (error) {
      console.error('Error loading messages:', error);
      const content = document.getElementById('messagesContent');
      this.ui.showError(content, 'Failed to load messages');
    }
  }

  updateStats() {
    const groupCount = this.messages.filter(m => m.isGroup).length;
    const privateCount = this.messages.filter(m => !m.isGroup).length;
    const uniqueSenders = new Set(this.messages.map(m => m.senderName || m.sender)).size;

    document.getElementById('totalCount').textContent = this.ui.formatNumber(this.messages.length);
    document.getElementById('groupCount').textContent = this.ui.formatNumber(groupCount);
    document.getElementById('privateCount').textContent = this.ui.formatNumber(privateCount);
    document.getElementById('senderCount').textContent = this.ui.formatNumber(uniqueSenders);
  }

  populateSenderFilter() {
    const senders = [...new Set(this.messages.map(m => m.senderName || m.sender))].sort();
    const senderFilter = document.getElementById('senderFilter');
    
    senderFilter.innerHTML = '<option value="all">All Senders</option>' +
      senders.map(sender => `<option value="${this.ui.escapeHtml(sender)}">${this.ui.escapeHtml(sender)}</option>`).join('');
  }

  applyFilters() {
    this.filteredMessages = this.messages.filter(msg => {
      // Search filter
      if (this.filters.search) {
        const searchLower = this.filters.search.toLowerCase();
        const senderMatch = (msg.senderName || msg.sender || '').toLowerCase().includes(searchLower);
        const contentMatch = (msg.content || '').toLowerCase().includes(searchLower);
        if (!senderMatch && !contentMatch) return false;
      }

      // Chat type filter
      if (this.filters.chatType !== 'all') {
        if (this.filters.chatType === 'group' && !msg.isGroup) return false;
        if (this.filters.chatType === 'private' && msg.isGroup) return false;
      }

      // Sender filter
      if (this.filters.sender !== 'all') {
        if ((msg.senderName || msg.sender) !== this.filters.sender) return false;
      }

      // Date range filter
      if (this.filters.dateFrom) {
        const msgDate = new Date(msg.timestamp);
        const fromDate = new Date(this.filters.dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        if (msgDate < fromDate) return false;
      }

      if (this.filters.dateTo) {
        const msgDate = new Date(msg.timestamp);
        const toDate = new Date(this.filters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        if (msgDate > toDate) return false;
      }

      // Message type filter
      if (this.filters.messageType !== 'all') {
        const content = msg.content || '';
        if (this.filters.messageType === 'command' && !content.startsWith('.')) return false;
        if (this.filters.messageType === 'text' && (content.startsWith('.') || content === '[Media]')) return false;
        if (this.filters.messageType === 'media' && content !== '[Media]') return false;
      }

      return true;
    });

    this.currentPage = 1;
    this.selectedMessages.clear();
    this.updateSelectedCount();
    this.renderMessages();
  }

  getMessageIcon(message) {
    const content = message.content || '';
    if (content === '[Media]') return 'image';
    if (content.startsWith('.')) return 'terminal';
    return 'message-square';
  }

  getMessageTypeLabel(message) {
    const content = message.content || '';
    if (content === '[Media]') return 'Media';
    if (content.startsWith('.')) return 'Command';
    return 'Text';
  }

  renderMessages() {
    const content = document.getElementById('messagesContent');
    const showingCount = document.getElementById('showingCount');
    
    if (this.filteredMessages.length === 0) {
      this.ui.showEmpty(content, 'No Messages', 
        this.filters.search || this.filters.chatType !== 'all' || this.filters.sender !== 'all'
          ? 'No messages match your filters'
          : 'No messages to display'
      );
      showingCount.textContent = 'No messages';
      document.getElementById('paginationContainer').style.display = 'none';
      return;
    }

    // Pagination
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.filteredMessages.length);
    const pageMessages = this.filteredMessages.slice(startIndex, endIndex);
    const totalPages = Math.ceil(this.filteredMessages.length / this.pageSize);

    showingCount.textContent = `Showing ${this.ui.formatNumber(this.filteredMessages.length)} messages`;

    content.innerHTML = `
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th style="width: 40px;">
                <input type="checkbox" id="selectAllCheckbox" style="cursor: pointer;" />
              </th>
              <th style="width: 40px;">Type</th>
              <th style="width: 150px;">Sender</th>
              <th style="width: auto;">Message</th>
              <th style="width: 100px;">Chat</th>
              <th style="width: 120px;">Time</th>
              <th style="width: 120px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${pageMessages.map(msg => `
              <tr class="${this.selectedMessages.has(msg.id) ? 'selected-row' : ''}">
                <td>
                  <input type="checkbox" class="message-checkbox" data-message-id="${msg.id}" 
                    ${this.selectedMessages.has(msg.id) ? 'checked' : ''} style="cursor: pointer;" />
                </td>
                <td>
                  <i data-lucide="${this.getMessageIcon(msg)}" style="width: 18px; height: 18px; color: var(--primary);"></i>
                </td>
                <td>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <div class="skeleton skeleton-avatar" style="width: 32px; height: 32px;"></div>
                    <strong>${this.ui.escapeHtml(msg.senderName || msg.sender || 'Unknown')}</strong>
                  </div>
                </td>
                <td>
                  <div style="max-width: 400px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    ${this.ui.escapeHtml(msg.content || '[Media]')}
                  </div>
                </td>
                <td>
                  <span class="status-badge ${msg.isGroup ? 'primary' : 'offline'}">
                    ${msg.isGroup ? 'Group' : 'Private'}
                  </span>
                </td>
                <td class="text-secondary">${this.ui.formatDate(msg.timestamp)}</td>
                <td>
                  <div style="display: flex; gap: 4px;">
                    <button class="btn btn-ghost btn-sm" data-action="view" data-message-id="${msg.id}" title="View Details">
                      <i data-lucide="eye"></i>
                    </button>
                    <button class="btn btn-ghost btn-sm" data-action="copy" data-message-content="${this.ui.escapeHtml(msg.content || '')}" title="Copy Message">
                      <i data-lucide="copy"></i>
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Update pagination
    if (totalPages > 1) {
      document.getElementById('paginationContainer').style.display = 'block';
      document.getElementById('paginationInfo').textContent = 
        `Showing ${startIndex + 1}-${endIndex} of ${this.filteredMessages.length}`;
      
      this.renderPagination(totalPages);
    } else {
      document.getElementById('paginationContainer').style.display = 'none';
    }

    lucide.createIcons();
    this.setupMessageActions();
  }

  renderPagination(totalPages) {
    const container = document.getElementById('paginationButtons');
    const buttons = [];

    // Previous button
    buttons.push(`
      <button class="btn btn-secondary btn-sm" ${this.currentPage === 1 ? 'disabled' : ''} data-page="${this.currentPage - 1}">
        <i data-lucide="chevron-left"></i>
      </button>
    `);

    // Page numbers
    const maxButtons = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    if (startPage > 1) {
      buttons.push(`<button class="btn btn-secondary btn-sm" data-page="1">1</button>`);
      if (startPage > 2) {
        buttons.push(`<span style="padding: 0 8px;">...</span>`);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(`
        <button class="btn ${i === this.currentPage ? 'btn-primary' : 'btn-secondary'} btn-sm" data-page="${i}">
          ${i}
        </button>
      `);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(`<span style="padding: 0 8px;">...</span>`);
      }
      buttons.push(`<button class="btn btn-secondary btn-sm" data-page="${totalPages}">${totalPages}</button>`);
    }

    // Next button
    buttons.push(`
      <button class="btn btn-secondary btn-sm" ${this.currentPage === totalPages ? 'disabled' : ''} data-page="${this.currentPage + 1}">
        <i data-lucide="chevron-right"></i>
      </button>
    `);

    container.innerHTML = buttons.join('');
    lucide.createIcons();

    // Add click handlers
    container.querySelectorAll('[data-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        const page = parseInt(btn.dataset.page);
        if (page >= 1 && page <= totalPages) {
          this.currentPage = page;
          this.renderMessages();
        }
      });
    });
  }

  setupMessageActions() {
    // View details
    document.querySelectorAll('[data-action="view"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const messageId = btn.dataset.messageId;
        const message = this.messages.find(m => m.id === messageId);
        if (message) {
          this.showMessageDetails(message);
        }
      });
    });

    // Copy message
    document.querySelectorAll('[data-action="copy"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const content = btn.dataset.messageContent;
        try {
          await navigator.clipboard.writeText(content);
          this.ui.showToast('Message copied to clipboard', 'success');
        } catch (error) {
          this.ui.showToast('Failed to copy message', 'error');
        }
      });
    });

    // Checkboxes
    document.querySelectorAll('.message-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const messageId = e.target.dataset.messageId;
        if (e.target.checked) {
          this.selectedMessages.add(messageId);
        } else {
          this.selectedMessages.delete(messageId);
        }
        this.updateSelectedCount();
        e.target.closest('tr').classList.toggle('selected-row', e.target.checked);
      });
    });

    // Select all checkbox
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    if (selectAllCheckbox) {
      selectAllCheckbox.addEventListener('change', (e) => {
        const checkboxes = document.querySelectorAll('.message-checkbox');
        checkboxes.forEach(cb => {
          cb.checked = e.target.checked;
          const messageId = cb.dataset.messageId;
          if (e.target.checked) {
            this.selectedMessages.add(messageId);
          } else {
            this.selectedMessages.delete(messageId);
          }
          cb.closest('tr').classList.toggle('selected-row', e.target.checked);
        });
        this.updateSelectedCount();
      });
    }
  }

  updateSelectedCount() {
    const countEl = document.getElementById('selectedCount');
    const bulkActions = document.getElementById('bulkActions');
    if (countEl) {
      countEl.textContent = this.selectedMessages.size;
    }
    if (bulkActions) {
      bulkActions.style.display = this.selectedMessages.size > 0 ? 'flex' : 'none';
    }
  }

  showMessageDetails(message) {
    const messageType = this.getMessageTypeLabel(message);
    const messageIcon = this.getMessageIcon(message);
    
    this.ui.showModal('Message Details', `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div>
          <div class="text-sm text-secondary mb-sm">Message Type</div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <i data-lucide="${messageIcon}" style="width: 18px; height: 18px; color: var(--primary);"></i>
            <span class="font-semibold">${messageType}</span>
          </div>
        </div>
        <div>
          <div class="text-sm text-secondary mb-sm">Sender</div>
          <div class="font-semibold">${this.ui.escapeHtml(message.senderName || message.sender || 'Unknown')}</div>
        </div>
        <div>
          <div class="text-sm text-secondary mb-sm">Message</div>
          <div style="padding: 12px; background: var(--bg-secondary); border-radius: 8px; word-wrap: break-word; font-family: ${message.content?.startsWith('.') ? 'monospace' : 'inherit'};">
            ${this.ui.escapeHtml(message.content || '[Media]')}
          </div>
        </div>
        <div>
          <div class="text-sm text-secondary mb-sm">Chat Type</div>
          <span class="status-badge ${message.isGroup ? 'primary' : 'offline'}">
            ${message.isGroup ? 'Group' : 'Private'}
          </span>
        </div>
        <div>
          <div class="text-sm text-secondary mb-sm">Time</div>
          <div>${new Date(message.timestamp).toLocaleString()}</div>
        </div>
        <div>
          <div class="text-sm text-secondary mb-sm">Message ID</div>
          <div class="text-xs" style="font-family: monospace; word-break: break-all;">${message.id}</div>
        </div>
      </div>
    `, [
      {
        id: 'copy',
        label: 'Copy Message',
        class: 'btn-secondary',
        onClick: async () => {
          try {
            await navigator.clipboard.writeText(message.content || '');
            this.ui.showToast('Message copied to clipboard', 'success');
          } catch (error) {
            this.ui.showToast('Failed to copy message', 'error');
          }
        }
      },
      {
        id: 'close',
        label: 'Close',
        class: 'btn-primary'
      }
    ]);
    
    // Re-initialize icons in modal
    setTimeout(() => lucide.createIcons(), 100);
  }

  exportMessages() {
    const messagesToExport = this.selectedMessages.size > 0
      ? this.filteredMessages.filter(m => this.selectedMessages.has(m.id))
      : this.filteredMessages;

    const dataStr = JSON.stringify(messagesToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `messages-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    this.ui.showToast(`Exported ${messagesToExport.length} messages`, 'success');
  }

  setupEventListeners() {
    // Search
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.filters.search = e.target.value;
        this.applyFilters();
      }, 300);
    });

    // Chat type filter
    document.getElementById('chatTypeFilter').addEventListener('change', (e) => {
      this.filters.chatType = e.target.value;
      this.applyFilters();
    });

    // Sender filter
    document.getElementById('senderFilter').addEventListener('change', (e) => {
      this.filters.sender = e.target.value;
      this.applyFilters();
    });

    // Date filters
    document.getElementById('dateFromFilter').addEventListener('change', (e) => {
      this.filters.dateFrom = e.target.value;
      this.applyFilters();
    });

    document.getElementById('dateToFilter').addEventListener('change', (e) => {
      this.filters.dateTo = e.target.value;
      this.applyFilters();
    });

    // Message type filter
    document.getElementById('messageTypeFilter').addEventListener('change', (e) => {
      this.filters.messageType = e.target.value;
      this.applyFilters();
    });

    // Clear filters
    document.getElementById('clearFilters').addEventListener('click', () => {
      this.filters = {
        search: '',
        chatType: 'all',
        sender: 'all',
        dateFrom: '',
        dateTo: '',
        messageType: 'all'
      };
      document.getElementById('searchInput').value = '';
      document.getElementById('chatTypeFilter').value = 'all';
      document.getElementById('senderFilter').value = 'all';
      document.getElementById('dateFromFilter').value = '';
      document.getElementById('dateToFilter').value = '';
      document.getElementById('messageTypeFilter').value = 'all';
      this.applyFilters();
      this.ui.showToast('Filters cleared', 'success');
    });

    // Refresh button
    document.getElementById('refreshMessages').addEventListener('click', () => {
      this.loadMessages();
      this.ui.showToast('Messages refreshed', 'success');
    });

    // Export button
    document.getElementById('exportMessages').addEventListener('click', () => {
      this.exportMessages();
    });

    // Bulk action buttons
    document.getElementById('selectAllBtn')?.addEventListener('click', () => {
      this.filteredMessages.forEach(msg => this.selectedMessages.add(msg.id));
      this.renderMessages();
    });

    document.getElementById('deselectAllBtn')?.addEventListener('click', () => {
      this.selectedMessages.clear();
      this.renderMessages();
    });

    document.getElementById('exportSelectedBtn')?.addEventListener('click', () => {
      this.exportMessages();
    });

    // WebSocket updates
    if (this.ws && this.ws.socket) {
      this.ws.socket.on('message:new', () => {
        this.loadMessages();
      });
    }
  }

  destroy() {
    // Clean up event listeners
  }
}
