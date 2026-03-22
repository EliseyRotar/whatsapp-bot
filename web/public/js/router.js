// Simple SPA Router
export class Router {
  constructor() {
    this.routes = new Map();
    this.currentPage = null;
    this.listeners = new Map();

    window.addEventListener('hashchange', () => {
      this.handleRoute();
    });
  }

  addRoute(path, handler) {
    this.routes.set(path, handler);
  }

  async navigate(hash) {
    window.location.hash = hash;
  }

  async handleRoute() {
    const hash = window.location.hash.slice(1) || 'dashboard';
    const handler = this.routes.get(hash);

    if (!handler) {
      console.error(`No route handler for: ${hash}`);
      return;
    }

    try {
      // Show loading
      this.showLoading();

      // Cleanup previous page
      if (this.currentPage && typeof this.currentPage.destroy === 'function') {
        this.currentPage.destroy();
      }

      // Load new page
      this.currentPage = await handler();
      
      // Render page
      const content = document.getElementById('content');
      if (content && this.currentPage) {
        content.innerHTML = '';
        await this.currentPage.render(content);
        
        // Reinitialize Lucide icons
        lucide.createIcons();
      }

      // Emit route changed event
      this.emit('routeChanged', hash);

      // Hide loading
      this.hideLoading();
    } catch (error) {
      console.error('Route error:', error);
      this.hideLoading();
      this.showError(error);
    }
  }

  showLoading() {
    document.getElementById('loadingOverlay')?.classList.add('show');
  }

  hideLoading() {
    document.getElementById('loadingOverlay')?.classList.remove('show');
  }

  showError(error) {
    const content = document.getElementById('content');
    if (content) {
      content.innerHTML = `
        <div class="empty-state">
          <i data-lucide="alert-circle" class="empty-state-icon"></i>
          <h2 class="empty-state-title">Error Loading Page</h2>
          <p class="empty-state-description">${error.message}</p>
          <button class="btn btn-primary" onclick="window.location.reload()">
            Reload Page
          </button>
        </div>
      `;
      lucide.createIcons();
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  emit(event, data) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }
}
