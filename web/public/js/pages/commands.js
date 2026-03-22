import { UI } from '../ui.js';
import { Auth } from '../auth.js';

export class CommandsPage {
  constructor(ws) {
    this.ws = ws;
    this.ui = new UI();
    this.auth = new Auth();
  }

  async render(container) {
    container.innerHTML = `
      <div class="commands-page">
        <div class="page-header mb-lg">
          <h1 style="font-size: 32px; font-weight: 700;">Commands</h1>
        </div>
        <div class="card">
          <div class="card-body" id="commandsContent">
            ${this.ui.createSkeleton('card')}
          </div>
        </div>
      </div>
    `;

    await this.loadCommands();
  }

  async loadCommands() {
    try {
      const response = await this.auth.fetchWithAuth('/api/commands');
      const data = await response.json();

      const content = document.getElementById('commandsContent');
      
      if (data.commands && data.commands.length > 0) {
        content.innerHTML = `
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Command</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Usage Count</th>
                </tr>
              </thead>
              <tbody>
                ${data.commands.map(cmd => `
                  <tr>
                    <td><code>.${cmd.name}</code></td>
                    <td><span class="status-badge primary">${cmd.category}</span></td>
                    <td class="text-secondary">${cmd.description || 'No description'}</td>
                    <td>${cmd.usageCount || 0}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
      } else {
        this.ui.showEmpty(content, 'No Commands', 'No commands available');
      }

      lucide.createIcons();
    } catch (error) {
      console.error('Error loading commands:', error);
      const content = document.getElementById('commandsContent');
      this.ui.showError(content, 'Failed to load commands');
    }
  }

  destroy() {}
}
