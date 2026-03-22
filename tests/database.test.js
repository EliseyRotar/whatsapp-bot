import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';
import fs from 'fs';
import {
    getUserBalance,
    addCoins,
    removeCoins,
    transferCoins,
    getUser,
    setUserLanguage,
    getUserLanguage,
    getGroup,
    setGroupSetting,
    getGroupSetting,
    addWarning,
    getUserWarnings,
    getWarningCount,
    clearWarnings,
    canClaimDaily,
    claimDaily
} from '../utils/databaseV2.js';

const TEST_DB = './data/test.db';

describe('Database Operations', () => {
    beforeEach(() => {
        // Clean up test database before each test
        if (fs.existsSync(TEST_DB)) {
            fs.unlinkSync(TEST_DB);
        }
    });

    afterEach(() => {
        // Clean up test database after each test
        if (fs.existsSync(TEST_DB)) {
            fs.unlinkSync(TEST_DB);
        }
    });

    describe('User Operations', () => {
        it('should create a new user with default balance', () => {
            const user = getUser('test@s.whatsapp.net');
            expect(user).toBeDefined();
            expect(user.balance).toBe(0);
            expect(user.language).toBe('en');
        });

        it('should add coins to user balance', () => {
            const jid = 'test@s.whatsapp.net';
            addCoins(jid, 100);
            const balance = getUserBalance(jid);
            expect(balance).toBe(100);
        });

        it('should remove coins from user balance', () => {
            const jid = 'test@s.whatsapp.net';
            addCoins(jid, 100);
            removeCoins(jid, 50);
            const balance = getUserBalance(jid);
            expect(balance).toBe(50);
        });

        it('should throw error when removing more coins than balance', () => {
            const jid = 'test@s.whatsapp.net';
            addCoins(jid, 50);
            expect(() => removeCoins(jid, 100)).toThrow('Insufficient balance');
        });

        it('should transfer coins between users', () => {
            const jid1 = 'user1@s.whatsapp.net';
            const jid2 = 'user2@s.whatsapp.net';
            
            addCoins(jid1, 1000);
            transferCoins(jid1, jid2, 500);
            
            expect(getUserBalance(jid1)).toBe(500);
            expect(getUserBalance(jid2)).toBe(500);
        });

        it('should set and get user language', () => {
            const jid = 'test@s.whatsapp.net';
            setUserLanguage(jid, 'it');
            expect(getUserLanguage(jid)).toBe('it');
        });
    });

    describe('Group Operations', () => {
        it('should create a new group with default settings', () => {
            const group = getGroup('test@g.us');
            expect(group).toBeDefined();
            expect(group.language).toBe('en');
        });

        it('should set and get group settings', () => {
            const jid = 'test@g.us';
            setGroupSetting(jid, 'welcome', true);
            expect(getGroupSetting(jid, 'welcome')).toBe(true);
            
            setGroupSetting(jid, 'antilink', true);
            expect(getGroupSetting(jid, 'antilink')).toBe(true);
        });
    });

    describe('Warnings System', () => {
        it('should add warning to user', () => {
            const groupJid = 'test@g.us';
            const userJid = 'user@s.whatsapp.net';
            
            addWarning(groupJid, userJid, 'Test warning', 'admin@s.whatsapp.net');
            const count = getWarningCount(groupJid, userJid);
            expect(count).toBe(1);
        });

        it('should get user warnings', () => {
            const groupJid = 'test@g.us';
            const userJid = 'user@s.whatsapp.net';
            
            addWarning(groupJid, userJid, 'Warning 1', 'admin@s.whatsapp.net');
            addWarning(groupJid, userJid, 'Warning 2', 'admin@s.whatsapp.net');
            
            const warnings = getUserWarnings(groupJid, userJid);
            expect(warnings).toHaveLength(2);
            expect(warnings[0].reason).toBe('Warning 2'); // Most recent first
        });

        it('should clear user warnings', () => {
            const groupJid = 'test@g.us';
            const userJid = 'user@s.whatsapp.net';
            
            addWarning(groupJid, userJid, 'Test warning', 'admin@s.whatsapp.net');
            clearWarnings(groupJid, userJid);
            
            const count = getWarningCount(groupJid, userJid);
            expect(count).toBe(0);
        });
    });

    describe('Daily Claims', () => {
        it('should allow first daily claim', () => {
            const jid = 'test@s.whatsapp.net';
            expect(canClaimDaily(jid)).toBe(true);
        });

        it('should give reward on daily claim', () => {
            const jid = 'test@s.whatsapp.net';
            const result = claimDaily(jid);
            
            expect(result.streak).toBe(1);
            expect(result.reward).toBe(110); // 100 base + 10 for streak 1
            expect(getUserBalance(jid)).toBe(110);
        });

        it('should not allow claiming twice in 24 hours', () => {
            const jid = 'test@s.whatsapp.net';
            claimDaily(jid);
            expect(canClaimDaily(jid)).toBe(false);
        });
    });
});
