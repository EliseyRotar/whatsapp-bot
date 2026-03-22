import NodeCache from 'node-cache';
import * as logger from '../monitoring/logger.js';

// Create cache instances with different TTLs
const caches = {
    // Short-lived cache (5 minutes) - for frequently changing data
    short: new NodeCache({ stdTTL: 300, checkperiod: 60 }),
    
    // Medium-lived cache (30 minutes) - for moderately stable data
    medium: new NodeCache({ stdTTL: 1800, checkperiod: 120 }),
    
    // Long-lived cache (2 hours) - for stable data
    long: new NodeCache({ stdTTL: 7200, checkperiod: 300 }),
    
    // Session cache (24 hours) - for user sessions
    session: new NodeCache({ stdTTL: 86400, checkperiod: 3600 })
};

// Cache statistics
const stats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0
};

// Generic cache operations
export function get(key, ttl = 'medium') {
    try {
        const value = caches[ttl].get(key);
        if (value !== undefined) {
            stats.hits++;
            logger.debug(`Cache HIT: ${key}`, { ttl, hits: stats.hits });
            return value;
        }
        stats.misses++;
        logger.debug(`Cache MISS: ${key}`, { ttl, misses: stats.misses });
        return null;
    } catch (error) {
        logger.error(`Cache GET error: ${key}`, { error: error.message });
        return null;
    }
}

export function set(key, value, ttl = 'medium', customTTL = null) {
    try {
        const success = customTTL 
            ? caches[ttl].set(key, value, customTTL)
            : caches[ttl].set(key, value);
        
        if (success) {
            stats.sets++;
            logger.debug(`Cache SET: ${key}`, { ttl, sets: stats.sets });
        }
        return success;
    } catch (error) {
        logger.error(`Cache SET error: ${key}`, { error: error.message });
        return false;
    }
}

export function del(key, ttl = 'medium') {
    try {
        const count = caches[ttl].del(key);
        if (count > 0) {
            stats.deletes++;
            logger.debug(`Cache DELETE: ${key}`, { ttl, deletes: stats.deletes });
        }
        return count;
    } catch (error) {
        logger.error(`Cache DELETE error: ${key}`, { error: error.message });
        return 0;
    }
}

export function flush(ttl = null) {
    try {
        if (ttl) {
            caches[ttl].flushAll();
            logger.info(`Cache flushed: ${ttl}`);
        } else {
            Object.keys(caches).forEach(key => caches[key].flushAll());
            logger.info('All caches flushed');
        }
        return true;
    } catch (error) {
        logger.error('Cache FLUSH error', { error: error.message });
        return false;
    }
}

export function getStats() {
    const cacheStats = {};
    Object.keys(caches).forEach(key => {
        cacheStats[key] = caches[key].getStats();
    });
    
    return {
        ...stats,
        hitRate: stats.hits / (stats.hits + stats.misses) || 0,
        caches: cacheStats
    };
}

// Specialized cache functions for common use cases

export function getGroupMetadata(sock, jid) {
    const cacheKey = `group:${jid}`;
    let metadata = get(cacheKey, 'medium');
    
    if (!metadata) {
        return sock.groupMetadata(jid).then(data => {
            set(cacheKey, data, 'medium', 600); // Cache for 10 minutes
            return data;
        });
    }
    
    return Promise.resolve(metadata);
}

export function getUserProfile(sock, jid) {
    const cacheKey = `profile:${jid}`;
    let profile = get(cacheKey, 'long');
    
    if (!profile) {
        return sock.profilePictureUrl(jid, 'image').then(url => {
            const data = { jid, profilePicture: url };
            set(cacheKey, data, 'long', 3600); // Cache for 1 hour
            return data;
        }).catch(() => {
            const data = { jid, profilePicture: null };
            set(cacheKey, data, 'long', 3600);
            return data;
        });
    }
    
    return Promise.resolve(profile);
}

export function cacheCommand(commandName, result, ttl = 300) {
    const cacheKey = `cmd:${commandName}`;
    return set(cacheKey, result, 'short', ttl);
}

export function getCachedCommand(commandName) {
    const cacheKey = `cmd:${commandName}`;
    return get(cacheKey, 'short');
}

export function cacheUserSession(jid, sessionData) {
    const cacheKey = `session:${jid}`;
    return set(cacheKey, sessionData, 'session');
}

export function getUserSession(jid) {
    const cacheKey = `session:${jid}`;
    return get(cacheKey, 'session');
}

export function invalidateUserCache(jid) {
    del(`profile:${jid}`, 'long');
    del(`session:${jid}`, 'session');
    logger.info(`Invalidated cache for user: ${jid}`);
}

export function invalidateGroupCache(jid) {
    del(`group:${jid}`, 'medium');
    logger.info(`Invalidated cache for group: ${jid}`);
}

// Periodic cache cleanup
setInterval(() => {
    const currentStats = getStats();
    logger.info('Cache statistics', currentStats);
}, 300000); // Every 5 minutes

logger.info('Cache system initialized', {
    caches: Object.keys(caches),
    ttls: {
        short: '5 minutes',
        medium: '30 minutes',
        long: '2 hours',
        session: '24 hours'
    }
});

export default {
    get,
    set,
    del,
    flush,
    getStats,
    getGroupMetadata,
    getUserProfile,
    cacheCommand,
    getCachedCommand,
    cacheUserSession,
    getUserSession,
    invalidateUserCache,
    invalidateGroupCache
};
