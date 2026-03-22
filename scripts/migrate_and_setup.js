#!/usr/bin/env node

import * as logger from '../utils/logger.js';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting migration and setup...\n');

// Step 1: Check .env file
console.log('📋 Step 1: Checking .env configuration...');
if (!fs.existsSync('.env')) {
    console.log('❌ .env file not found!');
    console.log('📝 Please copy .env.example to .env and configure your API keys');
    process.exit(1);
}
console.log('✅ .env file found\n');

// Step 2: Create necessary directories
console.log('📁 Step 2: Creating directories...');
const dirs = ['data', 'logs', 'backups', 'docs'];
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✅ Created ${dir}/`);
    } else {
        console.log(`✓ ${dir}/ already exists`);
    }
});
console.log('');

// Step 3: Backup existing data
console.log('💾 Step 3: Backing up existing data...');
const backupDir = `backups/migration-${Date.now()}`;
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}

const dataFiles = [
    'data/bank.json',
    'data/groups.json',
    'data/warnings.json',
    'data/blackjackStats.json',
    'data/daily_claims.json',
    'data/group_languages.json'
];

dataFiles.forEach(file => {
    if (fs.existsSync(file)) {
        const filename = path.basename(file);
        fs.copyFileSync(file, path.join(backupDir, filename));
        console.log(`✅ Backed up ${filename}`);
    }
});

// Backup and remove old database if it exists
if (fs.existsSync('data/bot.db')) {
    fs.copyFileSync('data/bot.db', path.join(backupDir, 'bot.db'));
    console.log('✅ Backed up old database');
    fs.unlinkSync('data/bot.db');
    console.log('🗑️  Removed old database (will be recreated with new schema)');
}
// Also remove WAL files if they exist
if (fs.existsSync('data/bot.db-wal')) {
    fs.unlinkSync('data/bot.db-wal');
}
if (fs.existsSync('data/bot.db-shm')) {
    fs.unlinkSync('data/bot.db-shm');
}
console.log('');

// Step 4: Migrate to SQLite
console.log('🔄 Step 4: Migrating data to SQLite...');
// Import database module AFTER deleting old database
const { migrateFromJSON, closeDatabase } = await import('../utils/databaseV2.js');
try {
    const success = migrateFromJSON();
    if (success) {
        console.log('✅ Migration completed successfully!');
    } else {
        console.log('⚠️  Migration completed with warnings');
    }
} catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
}
console.log('');

// Step 5: Verify migration
console.log('🔍 Step 5: Verifying migration...');
// Close database to ensure all writes are flushed
closeDatabase();
// Small delay to ensure WAL is flushed
await new Promise(resolve => setTimeout(resolve, 100));

if (fs.existsSync('data/bot.db')) {
    const stats = fs.statSync('data/bot.db');
    console.log(`✅ Database created: ${(stats.size / 1024).toFixed(2)} KB`);
} else {
    console.log('❌ Database file not found!');
    process.exit(1);
}
console.log('');

// Step 6: Check Redis connection (optional)
console.log('🔌 Step 6: Checking Redis connection...');
try {
    const Redis = await import('ioredis');
    const redis = new Redis.default({
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT) || 6379,
        retryStrategy: () => null
    });
    
    await redis.ping();
    console.log('✅ Redis connection successful');
    redis.disconnect();
} catch (error) {
    console.log('⚠️  Redis not available (optional for message queue)');
    console.log('   Install Redis for better performance: https://redis.io/download');
}
console.log('');

// Step 7: Summary
console.log('📊 Migration Summary:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✅ Configuration: .env file configured');
console.log('✅ Directories: Created/verified');
console.log('✅ Backup: Data backed up to', backupDir);
console.log('✅ Database: SQLite database created');
console.log('✅ Migration: JSON data migrated to SQLite');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('🎉 Setup complete! You can now start the bot with: npm start\n');

console.log('📚 New Features Available:');
console.log('  • Enhanced logging with Winston');
console.log('  • Caching system for better performance');
console.log('  • Input validation and security');
console.log('  • Analytics and monitoring');
console.log('  • Interactive menus');
console.log('  • User onboarding system');
console.log('  • Transaction support with rollback');
console.log('  • Message queue (requires Redis)');
console.log('');

console.log('⚠️  Important Notes:');
console.log('  1. Keep your .env file secure and never commit it');
console.log('  2. Backup your data/bot.db file regularly');
console.log('  3. Monitor logs/ directory for errors');
console.log('  4. Install Redis for message queue support');
console.log('');

process.exit(0);
