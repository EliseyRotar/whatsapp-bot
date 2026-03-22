import { describe, it, expect } from 'vitest';
import {
    validateAmount,
    validateJid,
    sanitizeText,
    validateCommand,
    validateUrl,
    validateLanguage,
    checkRateLimit
} from '../utils/validation.js';

describe('Validation System', () => {
    describe('validateAmount', () => {
        it('should validate valid amounts', () => {
            const result = validateAmount(100);
            expect(result.valid).toBe(true);
            expect(result.value).toBe(100);
        });

        it('should reject negative amounts', () => {
            const result = validateAmount(-50);
            expect(result.valid).toBe(false);
        });

        it('should reject non-numeric values', () => {
            const result = validateAmount('abc');
            expect(result.valid).toBe(false);
        });

        it('should enforce minimum value', () => {
            const result = validateAmount(5, 10);
            expect(result.valid).toBe(false);
        });

        it('should enforce maximum value', () => {
            const result = validateAmount(1000, 1, 500);
            expect(result.valid).toBe(false);
        });

        it('should reject decimal numbers', () => {
            const result = validateAmount(10.5);
            expect(result.valid).toBe(false);
        });
    });

    describe('validateJid', () => {
        it('should validate user JID', () => {
            const result = validateJid('1234567890@s.whatsapp.net');
            expect(result.valid).toBe(true);
        });

        it('should validate group JID', () => {
            const result = validateJid('1234567890@g.us');
            expect(result.valid).toBe(true);
        });

        it('should reject invalid format', () => {
            const result = validateJid('invalid-jid');
            expect(result.valid).toBe(false);
        });

        it('should reject empty JID', () => {
            const result = validateJid('');
            expect(result.valid).toBe(false);
        });
    });

    describe('sanitizeText', () => {
        it('should remove HTML tags', () => {
            const result = sanitizeText('<script>alert("xss")</script>Hello');
            expect(result).not.toContain('<script>');
            expect(result).toContain('Hello');
        });

        it('should remove dangerous patterns', () => {
            const result = sanitizeText('javascript:alert(1)');
            expect(result).not.toContain('javascript:');
        });

        it('should trim whitespace', () => {
            const result = sanitizeText('  Hello World  ');
            expect(result).toBe('Hello World');
        });

        it('should enforce max length', () => {
            const longText = 'a'.repeat(1000);
            const result = sanitizeText(longText, { maxLength: 100 });
            expect(result.length).toBe(100);
        });

        it('should remove null bytes', () => {
            const result = sanitizeText('Hello\0World');
            expect(result).toBe('HelloWorld');
        });
    });

    describe('validateCommand', () => {
        it('should validate command with number argument', () => {
            const result = validateCommand(['100'], {
                0: { type: 'number', required: true, min: 1, max: 1000 }
            });
            expect(result.valid).toBe(true);
            expect(result.values[0]).toBe(100);
        });

        it('should validate command with choice argument', () => {
            const result = validateCommand(['red'], {
                0: { type: 'choice', required: true, choices: ['red', 'black', 'green'] }
            });
            expect(result.valid).toBe(true);
            expect(result.values[0]).toBe('red');
        });

        it('should reject invalid choice', () => {
            const result = validateCommand(['blue'], {
                0: { type: 'choice', required: true, choices: ['red', 'black', 'green'] }
            });
            expect(result.valid).toBe(false);
        });

        it('should use default value when argument missing', () => {
            const result = validateCommand([], {
                0: { type: 'number', required: false, default: 10 }
            });
            expect(result.valid).toBe(true);
            expect(result.values[0]).toBe(10);
        });

        it('should reject missing required argument', () => {
            const result = validateCommand([], {
                0: { type: 'string', required: true }
            });
            expect(result.valid).toBe(false);
        });
    });

    describe('validateUrl', () => {
        it('should validate HTTPS URL', () => {
            const result = validateUrl('https://example.com');
            expect(result.valid).toBe(true);
        });

        it('should validate HTTP URL', () => {
            const result = validateUrl('http://example.com');
            expect(result.valid).toBe(true);
        });

        it('should reject invalid URL', () => {
            const result = validateUrl('not-a-url');
            expect(result.valid).toBe(false);
        });

        it('should enforce allowed domains', () => {
            const result = validateUrl('https://example.com', {
                allowedDomains: ['trusted.com']
            });
            expect(result.valid).toBe(false);
        });
    });

    describe('validateLanguage', () => {
        it('should validate supported language', () => {
            const result = validateLanguage('en');
            expect(result.valid).toBe(true);
        });

        it('should normalize language code', () => {
            const result = validateLanguage('EN');
            expect(result.valid).toBe(true);
            expect(result.lang).toBe('en');
        });

        it('should reject unsupported language', () => {
            const result = validateLanguage('fr');
            expect(result.valid).toBe(false);
        });
    });

    describe('checkRateLimit', () => {
        it('should allow first request', () => {
            const result = checkRateLimit('test-key-1', 5, 60000);
            expect(result.allowed).toBe(true);
            expect(result.remaining).toBe(4);
        });

        it('should track multiple requests', () => {
            const key = 'test-key-2';
            checkRateLimit(key, 3, 60000);
            checkRateLimit(key, 3, 60000);
            const result = checkRateLimit(key, 3, 60000);
            expect(result.allowed).toBe(true);
            expect(result.remaining).toBe(0);
        });

        it('should block when limit exceeded', () => {
            const key = 'test-key-3';
            checkRateLimit(key, 2, 60000);
            checkRateLimit(key, 2, 60000);
            const result = checkRateLimit(key, 2, 60000);
            expect(result.allowed).toBe(false);
        });
    });
});
