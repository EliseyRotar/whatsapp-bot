import Bull from 'bull';
import { config } from '../../config.js';
import * as logger from '../monitoring/logger.js';

// Create message queue with Redis
const messageQueue = new Bull('whatsapp-messages', {
    redis: {
        host: config.redisHost,
        port: config.redisPort
    },
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000
        },
        removeOnComplete: 100, // Keep last 100 completed jobs
        removeOnFail: 500 // Keep last 500 failed jobs
    }
});

// Priority levels
export const Priority = {
    CRITICAL: 1,  // Owner commands, system messages
    HIGH: 3,      // Admin commands
    NORMAL: 5,    // Regular user commands
    LOW: 7,       // Automated messages, notifications
    BULK: 10      // Bulk operations, spam
};

// Queue statistics
const queueStats = {
    processed: 0,
    failed: 0,
    active: 0,
    waiting: 0,
    delayed: 0
};

// Add message to queue
export async function enqueueMessage(sock, jid, content, options = {}) {
    try {
        const job = await messageQueue.add(
            {
                jid,
                content,
                timestamp: Date.now(),
                ...options
            },
            {
                priority: options.priority || Priority.NORMAL,
                delay: options.delay || 0,
                attempts: options.attempts || 3
            }
        );
        
        logger.debug(`Message queued: ${job.id}`, {
            jid,
            priority: options.priority || Priority.NORMAL,
            delay: options.delay || 0
        });
        
        return job;
    } catch (error) {
        logger.error('Failed to enqueue message', {
            jid,
            error: error.message
        });
        throw error;
    }
}

// Process messages from queue
messageQueue.process(async (job) => {
    const startTime = Date.now();
    const { jid, content, sock } = job.data;
    
    try {
        logger.debug(`Processing message job: ${job.id}`, {
            jid,
            attempt: job.attemptsMade + 1
        });
        
        // Get sock instance from global if not provided
        const socketInstance = sock || global.sock;
        
        if (!socketInstance) {
            throw new Error('Socket instance not available');
        }
        
        // Send message
        await socketInstance.sendMessage(jid, content);
        
        queueStats.processed++;
        
        const duration = Date.now() - startTime;
        logger.performance('Message sent', duration, {
            jid,
            jobId: job.id
        });
        
        return { success: true, duration };
    } catch (error) {
        queueStats.failed++;
        
        logger.error(`Failed to process message job: ${job.id}`, {
            jid,
            error: error.message,
            attempt: job.attemptsMade + 1
        });
        
        throw error;
    }
});

// Event handlers
messageQueue.on('completed', (job, result) => {
    logger.debug(`Job completed: ${job.id}`, result);
});

messageQueue.on('failed', (job, error) => {
    logger.error(`Job failed: ${job.id}`, {
        error: error.message,
        attempts: job.attemptsMade
    });
});

messageQueue.on('stalled', (job) => {
    logger.warn(`Job stalled: ${job.id}`);
});

messageQueue.on('error', (error) => {
    logger.error('Queue error', { error: error.message });
});

// Get queue statistics
export async function getQueueStats() {
    try {
        const [waiting, active, completed, failed, delayed] = await Promise.all([
            messageQueue.getWaitingCount(),
            messageQueue.getActiveCount(),
            messageQueue.getCompletedCount(),
            messageQueue.getFailedCount(),
            messageQueue.getDelayedCount()
        ]);
        
        return {
            ...queueStats,
            waiting,
            active,
            completed,
            failed,
            delayed,
            total: queueStats.processed + queueStats.failed
        };
    } catch (error) {
        logger.error('Failed to get queue stats', { error: error.message });
        return queueStats;
    }
}

// Clean old jobs
export async function cleanQueue(grace = 86400000) {
    try {
        await messageQueue.clean(grace, 'completed');
        await messageQueue.clean(grace, 'failed');
        logger.info('Queue cleaned', { grace });
    } catch (error) {
        logger.error('Failed to clean queue', { error: error.message });
    }
}

// Pause/Resume queue
export async function pauseQueue() {
    await messageQueue.pause();
    logger.info('Queue paused');
}

export async function resumeQueue() {
    await messageQueue.resume();
    logger.info('Queue resumed');
}

// Close queue gracefully
export async function closeQueue() {
    try {
        await messageQueue.close();
        logger.info('Queue closed');
    } catch (error) {
        logger.error('Failed to close queue', { error: error.message });
    }
}

// Periodic stats logging
setInterval(async () => {
    const stats = await getQueueStats();
    logger.info('Queue statistics', stats);
}, 60000); // Every minute

// Periodic cleanup
setInterval(async () => {
    await cleanQueue(86400000); // Clean jobs older than 24 hours
}, 3600000); // Every hour

// Handle process termination
process.on('SIGTERM', async () => {
    await closeQueue();
});

process.on('SIGINT', async () => {
    await closeQueue();
});

logger.info('Message queue initialized', {
    redis: `${config.redisHost}:${config.redisPort}`,
    priorities: Priority
});

export default messageQueue;
