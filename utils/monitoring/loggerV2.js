import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';

const LOG_DIR = './logs';

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Custom format for console output
const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        let msg = `${timestamp} [${level}]: ${message}`;
        if (Object.keys(meta).length > 0) {
            msg += ` ${JSON.stringify(meta)}`;
        }
        return msg;
    })
);

// Custom format for file output
const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

// Create logger instance
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: fileFormat,
    defaultMeta: { service: 'whatsapp-bot' },
    transports: [
        // Error logs - separate file
        new DailyRotateFile({
            filename: path.join(LOG_DIR, 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxSize: '20m',
            maxFiles: '14d',
            zippedArchive: true
        }),
        
        // Combined logs - all levels
        new DailyRotateFile({
            filename: path.join(LOG_DIR, 'combined-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d',
            zippedArchive: true
        }),
        
        // Command logs - separate file for analytics
        new DailyRotateFile({
            filename: path.join(LOG_DIR, 'commands-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'info',
            maxSize: '20m',
            maxFiles: '30d',
            zippedArchive: true,
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        })
    ]
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: consoleFormat,
        level: 'debug'
    }));
}

// Convenience methods
export const log = {
    /**
     * Log info message
     */
    info: (message, meta = {}) => {
        logger.info(message, meta);
    },
    
    /**
     * Log error message
     */
    error: (message, error = null, meta = {}) => {
        if (error instanceof Error) {
            logger.error(message, {
                ...meta,
                error: {
                    message: error.message,
                    stack: error.stack,
                    name: error.name
                }
            });
        } else {
            logger.error(message, meta);
        }
    },
    
    /**
     * Log warning message
     */
    warn: (message, meta = {}) => {
        logger.warn(message, meta);
    },
    
    /**
     * Log debug message
     */
    debug: (message, meta = {}) => {
        logger.debug(message, meta);
    },
    
    /**
     * Log command execution
     */
    command: (command, user, success = true, meta = {}) => {
        logger.info('Command executed', {
            type: 'command',
            command,
            user,
            success,
            timestamp: new Date().toISOString(),
            ...meta
        });
    },
    
    /**
     * Log message received
     */
    message: (from, isGroup, messageType, meta = {}) => {
        logger.info('Message received', {
            type: 'message',
            from,
            isGroup,
            messageType,
            timestamp: new Date().toISOString(),
            ...meta
        });
    },
    
    /**
     * Log rate limit hit
     */
    rateLimit: (jid, command = null, meta = {}) => {
        logger.warn('Rate limit hit', {
            type: 'rate_limit',
            jid,
            command,
            timestamp: new Date().toISOString(),
            ...meta
        });
    },
    
    /**
     * Log security event
     */
    security: (event, jid, details = {}) => {
        logger.warn('Security event', {
            type: 'security',
            event,
            jid,
            details,
            timestamp: new Date().toISOString()
        });
    },
    
    /**
     * Log performance metric
     */
    performance: (operation, duration, meta = {}) => {
        logger.info('Performance metric', {
            type: 'performance',
            operation,
            duration,
            timestamp: new Date().toISOString(),
            ...meta
        });
    },
    
    /**
     * Log database operation
     */
    database: (operation, table, success = true, meta = {}) => {
        logger.info('Database operation', {
            type: 'database',
            operation,
            table,
            success,
            timestamp: new Date().toISOString(),
            ...meta
        });
    }
};

// Export logger instance for advanced usage
export default logger;
