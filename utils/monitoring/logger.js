import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import fs from 'fs';
import path from 'path';
import { config } from '../../config.js';

const LOG_DIR = config.logDir || './logs';

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Custom format for structured logging
const customFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
    winston.format.printf(({ timestamp, level, message, metadata }) => {
        let log = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
        if (Object.keys(metadata).length > 0) {
            log += ` ${JSON.stringify(metadata)}`;
        }
        return log;
    })
);

// Create Winston logger
const logger = winston.createLogger({
    level: config.logLevel || 'info',
    format: customFormat,
    transports: [
        // Console transport
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                customFormat
            )
        }),
        
        // Daily rotate file for all logs
        new DailyRotateFile({
            filename: path.join(LOG_DIR, 'bot-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d',
            level: 'info'
        }),
        
        // Daily rotate file for errors only
        new DailyRotateFile({
            filename: path.join(LOG_DIR, 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '30d',
            level: 'error'
        }),
        
        // Daily rotate file for commands
        new DailyRotateFile({
            filename: path.join(LOG_DIR, 'commands-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '7d',
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        })
    ],
    exceptionHandlers: [
        new DailyRotateFile({
            filename: path.join(LOG_DIR, 'exceptions-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '30d'
        })
    ],
    rejectionHandlers: [
        new DailyRotateFile({
            filename: path.join(LOG_DIR, 'rejections-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '30d'
        })
    ]
});

// Export logging functions
export function log(level, message, metadata = {}) {
    logger.log(level, message, metadata);
}

export function info(message, metadata = {}) {
    logger.info(message, metadata);
}

export function error(message, metadata = {}) {
    logger.error(message, metadata);
}

export function warn(message, metadata = {}) {
    logger.warn(message, metadata);
}

export function debug(message, metadata = {}) {
    logger.debug(message, metadata);
}

export function command(commandName, user, success, metadata = {}) {
    logger.info(`Command: ${commandName}`, {
        command: commandName,
        user,
        success,
        ...metadata
    });
}

export function message(from, sender, text, metadata = {}) {
    logger.debug(`Message received`, {
        from,
        sender,
        text: text.substring(0, 100),
        ...metadata
    });
}

export function security(event, details = {}) {
    logger.warn(`Security Event: ${event}`, {
        event,
        ...details
    });
}

export function performance(operation, duration, metadata = {}) {
    logger.info(`Performance: ${operation}`, {
        operation,
        duration,
        ...metadata
    });
}

// Initialize log with startup message
info('=== Bot Started ===', {
    version: '2.0.0',
    nodeVersion: process.version,
    platform: process.platform
});

export default logger;
