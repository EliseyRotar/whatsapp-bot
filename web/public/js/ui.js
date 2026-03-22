// UI Utilities
export class UI {
  constructor() {
    this.toastContainer = document.getElementById('toastContainer');
  }

  showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
      success: 'check-circle',
      error: 'x-circle',
      warning: 'alert-triangle',
      info: 'info'
    };

    toast.innerHTML = `
      <div class="toast-icon">
        <i data-lucide="${icons[type] || 'info'}"></i>
      </div>
      <div class="toast-content">
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close">
        <i data-lucide="x"></i>
      </button>
    `;

    this.toastContainer.appendChild(toast);
    lucide.createIcons();

    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
      this.removeToast(toast);
    });

    // Auto remove
    if (duration > 0) {
      setTimeout(() => {
        this.removeToast(toast);
      }, duration);
    }

    return toast;
  }

  removeToast(toast) {
    toast.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }

  showModal(title, content, actions = []) {
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">${title}</h2>
          <button class="modal-close">
            <i data-lucide="x"></i>
          </button>
        </div>
        <div class="modal-body">
          ${content}
        </div>
        <div class="modal-footer">
          ${actions.map(action => `
            <button class="btn ${action.class || 'btn-secondary'}" data-action="${action.id}">
              ${action.label}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);
    lucide.createIcons();

    // Show modal
    setTimeout(() => backdrop.classList.add('show'), 10);

    // Close button
    backdrop.querySelector('.modal-close').addEventListener('click', () => {
      this.closeModal(backdrop);
    });

    // Backdrop click
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        this.closeModal(backdrop);
      }
    });

    // Action buttons
    actions.forEach(action => {
      const btn = backdrop.querySelector(`[data-action="${action.id}"]`);
      if (btn && action.handler) {
        btn.addEventListener('click', () => {
          action.handler();
          if (action.closeOnClick !== false) {
            this.closeModal(backdrop);
          }
        });
      }
    });

    return backdrop;
  }

  closeModal(backdrop) {
    backdrop.classList.remove('show');
    setTimeout(() => {
      backdrop.remove();
    }, 300);
  }

  formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    // Less than 1 minute
    if (diff < 60000) {
      return 'Just now';
    }

    // Less than 1 hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    }

    // Less than 24 hours
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    }

    // Less than 7 days
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days}d ago`;
    }

    // Format as date
    return date.toLocaleDateString();
  }

  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  }

  createSkeleton(type = 'card') {
    const skeletons = {
      card: '<div class="skeleton skeleton-card"></div>',
      text: '<div class="skeleton skeleton-text"></div>',
      title: '<div class="skeleton skeleton-title"></div>',
      avatar: '<div class="skeleton skeleton-avatar"></div>'
    };

    return skeletons[type] || skeletons.card;
  }

  showLoading(container) {
    container.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; padding: 48px;">
        <div class="spinner"></div>
      </div>
    `;
  }

  showError(container, message) {
    container.innerHTML = `
      <div class="empty-state">
        <i data-lucide="alert-circle" class="empty-state-icon"></i>
        <h2 class="empty-state-title">Error</h2>
        <p class="empty-state-description">${message}</p>
      </div>
    `;
    lucide.createIcons();
  }

  showEmpty(container, title, description, action = null) {
    container.innerHTML = `
      <div class="empty-state">
        <i data-lucide="inbox" class="empty-state-icon"></i>
        <h2 class="empty-state-title">${title}</h2>
        <p class="empty-state-description">${description}</p>
        ${action ? `<button class="btn btn-primary">${action}</button>` : ''}
      </div>
    `;
    lucide.createIcons();
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
