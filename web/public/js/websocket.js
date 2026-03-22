// WebSocket Client with auto-reconnect
export class WebSocketClient {
  constructor(token) {
    this.token = token;
    this.socket = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.isConnecting = false;

    this.connect();
  }

  connect() {
    if (this.isConnecting || (this.socket && this.socket.connected)) {
      return;
    }

    this.isConnecting = true;

    try {
      this.socket = io({
        auth: {
          token: this.token
        },
        transports: ['websocket', 'polling']
      });

      this.socket.on('connect', () => {
        console.log('[WS] Connected');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.emit('connect');
      });

      this.socket.on('disconnect', (reason) => {
        console.log('[WS] Disconnected:', reason);
        this.isConnecting = false;
        this.emit('disconnect', reason);

        if (reason === 'io server disconnect') {
          // Server disconnected, try to reconnect
          this.reconnect();
        }
      });

      this.socket.on('connect_error', (error) => {
        console.error('[WS] Connection error:', error);
        this.isConnecting = false;
        this.reconnect();
      });

      // Bot status updates
      this.socket.on('bot:status', (data) => {
        this.emit('bot:status', data);
      });

      // New messages
      this.socket.on('message:new', (data) => {
        this.emit('message:new', data);
      });

      // Message deleted
      this.socket.on('message:deleted', (data) => {
        this.emit('message:deleted', data);
      });

      // Group updates
      this.socket.on('group:update', (data) => {
        this.emit('group:update', data);
      });

      // Metrics updates
      this.socket.on('metrics:update', (data) => {
        this.emit('metrics:update', data);
      });

      // System metrics
      this.socket.on('system:metrics', (data) => {
        this.emit('system:metrics', data);
      });

      // QR code for authentication
      this.socket.on('qr:code', (data) => {
        this.emit('qr:code', data);
      });

    } catch (error) {
      console.error('[WS] Failed to connect:', error);
      this.isConnecting = false;
      this.reconnect();
    }
  }

  reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[WS] Max reconnection attempts reached');
      this.emit('error', new Error('Failed to connect after multiple attempts'));
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`[WS] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      this.connect();
    }, delay);
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
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`[WS] Error in ${event} callback:`, error);
        }
      });
    }
  }

  send(event, data) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('[WS] Cannot send, socket not connected');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}
