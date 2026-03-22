// Authentication Module
export class Auth {
  constructor() {
    this.token = localStorage.getItem('auth_token');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }

  async login(username, password) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      
      this.token = data.token;
      this.user = data.user;

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    return !!this.token;
  }

  getToken() {
    return this.token;
  }

  getUser() {
    return this.user;
  }

  async fetchWithAuth(url, options = {}) {
    if (!this.token) {
      console.error('[AUTH] No token found, redirecting to login');
      window.location.href = '/';
      throw new Error('No authentication token');
    }

    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };

    console.log('[AUTH] Fetching:', url);
    console.log('[AUTH] Token:', this.token ? 'Present' : 'Missing');

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (response.status === 401 || response.status === 403) {
        console.error('[AUTH] Unauthorized, clearing token and redirecting');
        this.logout();
        window.location.href = '/';
        throw new Error('Unauthorized');
      }

      return response;
    } catch (error) {
      console.error('[AUTH] Fetch error:', error);
      throw error;
    }
  }
}
