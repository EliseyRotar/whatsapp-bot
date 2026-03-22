import NodeCache from "node-cache";

/**
 * Simple file cache for frequently accessed media files
 * Helps reduce disk I/O for repeated file reads
 */

class FileCache {
	constructor() {
		// Cache with 5 minute TTL and max 50MB total size
		this.cache = new NodeCache({
			stdTTL: 300, // 5 minutes
			checkperiod: 60, // Check for expired entries every minute
			useClones: false, // Don't clone buffers (saves memory)
			maxKeys: 100, // Max 100 cached files
		});

		this.maxCacheSize = 50 * 1024 * 1024; // 50MB max cache size
		this.currentSize = 0;

		// Track cache stats
		this.stats = {
			hits: 0,
			misses: 0,
			evictions: 0,
		};
	}

	/**
	 * Get file from cache
	 * @param {string} key - File path
	 * @returns {Buffer|null}
	 */
	get(key) {
		const value = this.cache.get(key);
		if (value) {
			this.stats.hits++;
			return value;
		}
		this.stats.misses++;
		return null;
	}

	/**
	 * Set file in cache
	 * @param {string} key - File path
	 * @param {Buffer} value - File buffer
	 */
	set(key, value) {
		// Don't cache if buffer is too large (> 5MB)
		if (value.length > 5 * 1024 * 1024) {
			return false;
		}

		// Check if adding this would exceed max cache size
		if (this.currentSize + value.length > this.maxCacheSize) {
			// Evict oldest entries until we have space
			this.evictOldest(value.length);
		}

		const success = this.cache.set(key, value);
		if (success) {
			this.currentSize += value.length;
		}
		return success;
	}

	/**
	 * Evict oldest entries to make space
	 * @param {number} neededSpace
	 */
	evictOldest(neededSpace) {
		const keys = this.cache.keys();
		let freedSpace = 0;

		for (const key of keys) {
			if (freedSpace >= neededSpace) break;

			const value = this.cache.get(key);
			if (value) {
				freedSpace += value.length;
				this.currentSize -= value.length;
				this.cache.del(key);
				this.stats.evictions++;
			}
		}
	}

	/**
	 * Clear all cache
	 */
	clear() {
		this.cache.flushAll();
		this.currentSize = 0;
	}

	/**
	 * Get cache statistics
	 */
	getStats() {
		return {
			...this.stats,
			keys: this.cache.keys().length,
			size: this.currentSize,
			hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0,
		};
	}
}

const fileCache = new FileCache();

export default fileCache;
