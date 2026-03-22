import validator from 'validator';
import * as logger from '../monitoring/logger.js';

// Custom error class for validation errors
export class ValidationError extends Error {
    constructor(message, field = null) {
        super(message);
        this.name = 'ValidationError';
        this.field = field;
        this.isOperational = true;
    }
}

// Validate WhatsApp JID format
export function validateJid(jid, fieldName = 'jid') {
    if (!jid || typeof jid !== 'string') {
        throw new ValidationError('JID is required', fieldName);
    }
    
    // Valid formats:
    // - 1234567890@s.whatsapp.net (user)
    // - 1234567890@g.us (group)
    // - 1234567890@lid (linked device)
    const jidPattern = /^\d+@(s\.whatsapp\.net|g\.us|lid)$/;
    
    if (!jidPattern.test(jid)) {
        logger.security('Invalid JID format detected', { jid, field: fieldName });
        throw new ValidationError('Invalid JID format', fieldName);
    }
    
    return jid;
}

// Validate phone number
export function validatePhoneNumber(phone, fieldName = 'phone') {
    if (!phone || typeof phone !== 'string') {
        throw new ValidationError('Phone number is required', fieldName);
    }
    
    // Remove non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Check length (most phone numbers are 7-15 digits)
    if (cleaned.length < 7 || cleaned.length > 15) {
        throw new ValidationError('Invalid phone number length', fieldName);
    }
    
    return cleaned;
}

// Validate amount (for payments, bets, etc.)
export function validateAmount(amount, min = 1, max = 1000000000, fieldName = 'amount') {
    // Convert to number if string
    const num = typeof amount === 'string' ? parseInt(amount, 10) : amount;
    
    // Check if valid number
    if (isNaN(num) || !Number.isFinite(num)) {
        throw new ValidationError('Amount must be a valid number', fieldName);
    }
    
    // Check if integer
    if (!Number.isInteger(num)) {
        throw new ValidationError('Amount must be an integer', fieldName);
    }
    
    // Check range
    if (num < min) {
        throw new ValidationError(`Amount must be at least ${min}`, fieldName);
    }
    
    if (num > max) {
        throw new ValidationError(`Amount cannot exceed ${max}`, fieldName);
    }
    
    // Check for overflow
    if (num > Number.MAX_SAFE_INTEGER) {
        logger.security('Number overflow attempt detected', { amount, field: fieldName });
        throw new ValidationError('Amount is too large', fieldName);
    }
    
    return num;
}

// Validate text input (prevent injection attacks)
export function validateText(text, maxLength = 1000, fieldName = 'text') {
    if (!text || typeof text !== 'string') {
        throw new ValidationError('Text is required', fieldName);
    }
    
    // Check length
    if (text.length > maxLength) {
        throw new ValidationError(`Text cannot exceed ${maxLength} characters`, fieldName);
    }
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
        /<script/i,           // Script tags
        /javascript:/i,       // JavaScript protocol
        /on\w+\s*=/i,        // Event handlers
        /\$\{.*\}/,          // Template literals
        /eval\s*\(/i,        // Eval function
        /exec\s*\(/i         // Exec function
    ];
    
    for (const pattern of suspiciousPatterns) {
        if (pattern.test(text)) {
            logger.security('Suspicious pattern detected in text', {
                pattern: pattern.toString(),
                field: fieldName
            });
            throw new ValidationError('Text contains invalid characters', fieldName);
        }
    }
    
    return text;
}

// Validate command arguments
export function validateArgs(args, minArgs = 0, maxArgs = 10, fieldName = 'args') {
    if (!Array.isArray(args)) {
        throw new ValidationError('Arguments must be an array', fieldName);
    }
    
    if (args.length < minArgs) {
        throw new ValidationError(`At least ${minArgs} argument(s) required`, fieldName);
    }
    
    if (args.length > maxArgs) {
        throw new ValidationError(`Maximum ${maxArgs} argument(s) allowed`, fieldName);
    }
    
    return args;
}

// Validate URL
export function validateUrl(url, fieldName = 'url') {
    if (!url || typeof url !== 'string') {
        throw new ValidationError('URL is required', fieldName);
    }
    
    if (!validator.isURL(url, { protocols: ['http', 'https'], require_protocol: true })) {
        throw new ValidationError('Invalid URL format', fieldName);
    }
    
    // Block localhost and private IPs
    const privatePatterns = [
        /localhost/i,
        /127\.0\.0\.1/,
        /192\.168\./,
        /10\./,
        /172\.(1[6-9]|2[0-9]|3[0-1])\./
    ];
    
    for (const pattern of privatePatterns) {
        if (pattern.test(url)) {
            logger.security('Private URL access attempt', { url, field: fieldName });
            throw new ValidationError('Private URLs are not allowed', fieldName);
        }
    }
    
    return url;
}

// Validate email
export function validateEmail(email, fieldName = 'email') {
    if (!email || typeof email !== 'string') {
        throw new ValidationError('Email is required', fieldName);
    }
    
    if (!validator.isEmail(email)) {
        throw new ValidationError('Invalid email format', fieldName);
    }
    
    return email.toLowerCase();
}

// Validate language code
export function validateLanguage(lang, fieldName = 'language') {
    const supportedLanguages = ['en', 'it', 'ru', 'es', 'pt', 'ar', 'hi'];
    
    if (!lang || typeof lang !== 'string') {
        throw new ValidationError('Language is required', fieldName);
    }
    
    if (!supportedLanguages.includes(lang.toLowerCase())) {
        throw new ValidationError(`Unsupported language. Supported: ${supportedLanguages.join(', ')}`, fieldName);
    }
    
    return lang.toLowerCase();
}

// Validate boolean
export function validateBoolean(value, fieldName = 'value') {
    if (typeof value === 'boolean') {
        return value;
    }
    
    if (typeof value === 'string') {
        const lower = value.toLowerCase();
        if (lower === 'true' || lower === '1' || lower === 'yes' || lower === 'on') {
            return true;
        }
        if (lower === 'false' || lower === '0' || lower === 'no' || lower === 'off') {
            return false;
        }
    }
    
    if (typeof value === 'number') {
        return value !== 0;
    }
    
    throw new ValidationError('Invalid boolean value', fieldName);
}

// Validate date
export function validateDate(date, fieldName = 'date') {
    if (!date) {
        throw new ValidationError('Date is required', fieldName);
    }
    
    const parsed = new Date(date);
    
    if (isNaN(parsed.getTime())) {
        throw new ValidationError('Invalid date format', fieldName);
    }
    
    return parsed;
}

// Sanitize text (remove dangerous characters)
export function sanitizeText(text) {
    if (!text || typeof text !== 'string') {
        return '';
    }
    
    return text
        .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
        .replace(/<[^>]+>/g, '') // Remove HTML tags
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+\s*=/gi, '') // Remove event handlers
        .trim();
}

// Sanitize filename
export function sanitizeFilename(filename) {
    if (!filename || typeof filename !== 'string') {
        throw new ValidationError('Filename is required');
    }
    
    // Remove path traversal attempts
    const sanitized = filename
        .replace(/\.\./g, '')
        .replace(/[\/\\]/g, '')
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .substring(0, 255);
    
    if (!sanitized) {
        throw new ValidationError('Invalid filename');
    }
    
    return sanitized;
}

// Rate limit validation
const rateLimits = new Map();

export function checkRateLimit(identifier, maxRequests = 10, windowMs = 60000) {
    const now = Date.now();
    const key = `ratelimit:${identifier}`;
    
    let record = rateLimits.get(key);
    
    if (!record) {
        record = { count: 0, resetTime: now + windowMs };
        rateLimits.set(key, record);
    }
    
    // Reset if window expired
    if (now > record.resetTime) {
        record.count = 0;
        record.resetTime = now + windowMs;
    }
    
    // Check limit
    if (record.count >= maxRequests) {
        const remainingMs = record.resetTime - now;
        logger.security('Rate limit exceeded', {
            identifier,
            count: record.count,
            maxRequests,
            remainingMs
        });
        throw new ValidationError(`Rate limit exceeded. Try again in ${Math.ceil(remainingMs / 1000)} seconds`);
    }
    
    record.count++;
    return true;
}

// Clean up old rate limit records
setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimits.entries()) {
        if (now > record.resetTime + 60000) {
            rateLimits.delete(key);
        }
    }
}, 60000); // Every minute

logger.info('Validation system initialized');

export default {
    ValidationError,
    validateJid,
    validatePhoneNumber,
    validateAmount,
    validateText,
    validateArgs,
    validateUrl,
    validateEmail,
    validateLanguage,
    validateBoolean,
    validateDate,
    sanitizeText,
    sanitizeFilename,
    checkRateLimit
};
