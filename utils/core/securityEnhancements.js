import crypto from 'crypto';
import * as logger from '../monitoring/logger.js';

// ==================== CONSTANTS ====================

export const MAX_SAFE_AMOUNT = Number.MAX_SAFE_INTEGER; // 9007199254740991
export const MAX_COIN_AMOUNT = 1000000000; // 1 billion (reasonable limit)
export const MIN_COIN_AMOUNT = 1;

// ==================== INPUT VALIDATION ====================

/**
 * Validate and sanitize coin amounts to prevent integer overflow
 * @param {number} amount - Amount to validate
 * @param {number} min - Minimum allowed amount
 * @param {number} max - Maximum allowed amount
 * @returns {{valid: boolean, amount: number, error: string}}
 */
export function validateAmount(amount, min = MIN_COIN_AMOUNT, max = MAX_COIN_AMOUNT) {
    // Check if it's a number
    if (typeof amount !== 'number' || isNaN(amount)) {
        return {
            valid: false,
            amount: 0,
            error: 'Amount must be a valid number'
        };
    }

    // Check for infinity
    if (!isFinite(amount)) {
        return {
            valid: false,
            amount: 0,
            error: 'Amount cannot be infinite'
        };
    }

    // Check for integer
    if (!Number.isInteger(amount)) {
        return {
            valid: false,
            amount: 0,
            error: 'Amount must be a whole number'
        };
    }

    // Check for negative
    if (amount < 0) {
        return {
            valid: false,
            amount: 0,
            error: 'Amount cannot be negative'
        };
    }

    // Check safe integer range
    if (amount > MAX_SAFE_AMOUNT) {
        return {
            valid: false,
            amount: 0,
            error: `Amount exceeds maximum safe integer (${MAX_SAFE_AMOUNT})`
        };
    }

    // Check min/max bounds
    if (amount < min) {
        return {
            valid: false,
            amount: 0,
            error: `Amount must be at least ${min}`
        };
    }

    if (amount > max) {
        return {
            valid: false,
            amount: 0,
            error: `Amount cannot exceed ${max}`
        };
    }

    return {
        valid: true,
        amount: amount,
        error: null
    };
}

/**
 * Safely multiply two numbers checking for overflow
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {{valid: boolean, result: number, error: string}}
 */
export function safeMultiply(a, b) {
    const result = a * b;

    // Check for overflow
    if (!Number.isSafeInteger(result)) {
        logger.security('Integer overflow detected in multiplication', { a, b, result });
        return {
            valid: false,
            result: 0,
            error: 'Calculation would cause integer overflow'
        };
    }

    if (result > MAX_COIN_AMOUNT) {
        return {
            valid: false,
            result: 0,
            error: `Result exceeds maximum allowed amount (${MAX_COIN_AMOUNT})`
        };
    }

    return {
        valid: true,
        result: Math.floor(result),
        error: null
    };
}

// ==================== CRYPTOGRAPHIC RANDOM ====================

/**
 * Generate cryptographically secure random integer
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (exclusive)
 * @returns {number}
 */
export function secureRandomInt(min, max) {
    return crypto.randomInt(min, max);
}

/**
 * Generate cryptographically secure random float between 0 and 1
 * @returns {number}
 */
export function secureRandom() {
    const buffer = crypto.randomBytes(4);
    const value = buffer.readUInt32BE(0);
    // Divide by 0x100000000 (2^32) to get [0, 1) — never exactly 1.0
    return value / 0x100000000;
}

/**
 * Shuffle array using Fisher-Yates with crypto random
 * @param {Array} array - Array to shuffle
 * @returns {Array}
 */
export function secureShuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = secureRandomInt(0, i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ==================== URL SANITIZATION ====================

/**
 * Safely encode URL components
 * @param {string} str - String to encode
 * @returns {string}
 */
export function safeEncodeURIComponent(str) {
    try {
        return encodeURIComponent(String(str));
    } catch (error) {
        logger.security('URL encoding failed', { str, error: error.message });
        return '';
    }
}

/**
 * Validate and sanitize URL
 * @param {string} url - URL to validate
 * @returns {{valid: boolean, url: string, error: string}}
 */
export function validateURL(url) {
    try {
        const parsed = new URL(url);
        
        // Only allow HTTP/HTTPS
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            return {
                valid: false,
                url: '',
                error: 'Only HTTP/HTTPS protocols allowed'
            };
        }

        // Block private IPs
        const hostname = parsed.hostname;
        if (isPrivateIP(hostname)) {
            return {
                valid: false,
                url: '',
                error: 'Private IP addresses not allowed'
            };
        }

        return {
            valid: true,
            url: parsed.toString(),
            error: null
        };
    } catch (error) {
        return {
            valid: false,
            url: '',
            error: 'Invalid URL format'
        };
    }
}

function isPrivateIP(hostname) {
    // Check for localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
        return true;
    }

    // Check for private IP ranges
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = hostname.match(ipv4Regex);
    
    if (match) {
        const [, a, b, c, d] = match.map(Number);
        
        // 10.0.0.0/8
        if (a === 10) return true;
        
        // 172.16.0.0/12
        if (a === 172 && b >= 16 && b <= 31) return true;
        
        // 192.168.0.0/16
        if (a === 192 && b === 168) return true;
        
        // 169.254.0.0/16 (link-local)
        if (a === 169 && b === 254) return true;
    }

    return false;
}

// ==================== PATH SANITIZATION ====================

/**
 * Sanitize file path to prevent directory traversal
 * @param {string} filePath - Path to sanitize
 * @param {string} baseDir - Base directory to restrict to
 * @returns {{valid: boolean, path: string, error: string}}
 */
export function sanitizeFilePath(filePath, baseDir = './data') {
    try {
        const path = require('path');
        
        // Remove any directory traversal attempts
        const sanitized = filePath.replace(/\.\./g, '');
        
        // Resolve to absolute path
        const absolute = path.resolve(baseDir, sanitized);
        const base = path.resolve(baseDir);
        
        // Ensure it's within base directory
        if (!absolute.startsWith(base)) {
            logger.security('Path traversal attempt detected', { filePath, baseDir });
            return {
                valid: false,
                path: '',
                error: 'Path traversal not allowed'
            };
        }

        return {
            valid: true,
            path: absolute,
            error: null
        };
    } catch (error) {
        return {
            valid: false,
            path: '',
            error: 'Invalid file path'
        };
    }
}

// ==================== RATE LIMITING (GLOBAL) ====================

const globalRateLimits = new Map();

/**
 * Check if user has exceeded global rate limit
 * @param {string} userId - User identifier
 * @param {number} maxRequests - Maximum requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {boolean} - True if rate limited
 */
export function isGloballyRateLimited(userId, maxRequests = 20, windowMs = 60000) {
    const now = Date.now();
    const userKey = `global_${userId}`;
    
    if (!globalRateLimits.has(userKey)) {
        globalRateLimits.set(userKey, []);
    }

    const timestamps = globalRateLimits.get(userKey);
    
    // Remove old timestamps
    const recentTimestamps = timestamps.filter(ts => now - ts < windowMs);
    
    if (recentTimestamps.length >= maxRequests) {
        logger.security('Global rate limit exceeded', { userId, requests: recentTimestamps.length });
        return true;
    }

    // Add current timestamp
    recentTimestamps.push(now);
    globalRateLimits.set(userKey, recentTimestamps);
    
    return false;
}

// ==================== AUDIT LOGGING ====================

/**
 * Log sensitive operations for audit trail
 * @param {string} operation - Operation name
 * @param {string} userId - User performing operation
 * @param {object} details - Operation details
 */
export function auditLog(operation, userId, details = {}) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        operation,
        userId,
        details,
        ip: details.ip || 'unknown'
    };

    logger.security(`[AUDIT] ${operation}`, logEntry);
    
    // TODO: Store in separate audit log file or database
    // This ensures compliance and forensics capability
}

// ==================== DATA SANITIZATION ====================

/**
 * Redact sensitive information from logs
 * @param {string} text - Text to redact
 * @returns {string}
 */
export function redactSensitiveData(text) {
    if (!text) return text;

    // Redact phone numbers
    text = text.replace(/\d{10,15}/g, '[PHONE_REDACTED]');
    
    // Redact JIDs
    text = text.replace(/\d+@s\.whatsapp\.net/g, '[JID_REDACTED]');
    text = text.replace(/\d+@g\.us/g, '[GROUP_REDACTED]');
    
    // Redact API keys
    text = text.replace(/[A-Za-z0-9]{32,}/g, '[KEY_REDACTED]');
    
    return text;
}

// ==================== CLEANUP ====================

// Clean up old rate limit entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, timestamps] of globalRateLimits.entries()) {
        const recent = timestamps.filter(ts => now - ts < 300000); // 5 minutes
        if (recent.length === 0) {
            globalRateLimits.delete(key);
        } else {
            globalRateLimits.set(key, recent);
        }
    }
}, 300000);

export default {
    validateAmount,
    safeMultiply,
    secureRandomInt,
    secureRandom,
    secureShuffle,
    safeEncodeURIComponent,
    validateURL,
    sanitizeFilePath,
    isGloballyRateLimited,
    auditLog,
    redactSensitiveData,
    MAX_COIN_AMOUNT,
    MIN_COIN_AMOUNT
};
