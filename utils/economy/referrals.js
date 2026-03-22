import fs from 'fs';
import path from 'path';

const dataDir = './data';
const referralFile = path.join(dataDir, 'referrals.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Load referral data
function loadReferrals() {
    try {
        if (fs.existsSync(referralFile)) {
            const data = fs.readFileSync(referralFile, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('[REFERRALS] Error loading referrals:', error.message);
    }
    return {};
}

// Save referral data
function saveReferrals(referrals) {
    try {
        fs.writeFileSync(referralFile, JSON.stringify(referrals, null, 2));
    } catch (error) {
        console.error('[REFERRALS] Error saving referrals:', error.message);
    }
}

// Get user referral data
export function getReferralData(userJid) {
    const referrals = loadReferrals();
    if (!referrals[userJid]) {
        referrals[userJid] = {
            referredBy: null,
            referrals: [],
            rewardsEarned: 0
        };
        saveReferrals(referrals);
    }
    return referrals[userJid];
}

// Add a referral
export function addReferral(referrerJid, referredJid) {
    const referrals = loadReferrals();
    
    // Initialize referrer data if doesn't exist
    if (!referrals[referrerJid]) {
        referrals[referrerJid] = {
            referredBy: null,
            referrals: [],
            rewardsEarned: 0
        };
    }
    
    // Initialize referred user data if doesn't exist
    if (!referrals[referredJid]) {
        referrals[referredJid] = {
            referredBy: referrerJid,
            referrals: [],
            rewardsEarned: 0
        };
    } else if (referrals[referredJid].referredBy) {
        // User already has a referrer
        return { success: false, reason: 'already_referred' };
    } else {
        referrals[referredJid].referredBy = referrerJid;
    }
    
    // Add to referrer's list
    if (!referrals[referrerJid].referrals.includes(referredJid)) {
        referrals[referrerJid].referrals.push(referredJid);
    }
    
    saveReferrals(referrals);
    return { success: true };
}

// Check if user can claim referral reward
export function canClaimReferralReward(userJid) {
    const data = getReferralData(userJid);
    const totalReferrals = data.referrals.length;
    const rewardsEarned = data.rewardsEarned;
    
    // Can claim reward every 3 referrals
    const eligibleRewards = Math.floor(totalReferrals / 3);
    return eligibleRewards > rewardsEarned;
}

// Claim referral reward
export function claimReferralReward(userJid) {
    const referrals = loadReferrals();
    const data = referrals[userJid];
    
    if (!data) return { success: false };
    
    const totalReferrals = data.referrals.length;
    const rewardsEarned = data.rewardsEarned;
    const eligibleRewards = Math.floor(totalReferrals / 3);
    
    if (eligibleRewards > rewardsEarned) {
        data.rewardsEarned = eligibleRewards;
        saveReferrals(referrals);
        return { success: true, rewards: eligibleRewards - rewardsEarned };
    }
    
    return { success: false };
}

// Get leaderboard
export function getReferralLeaderboard(limit = 10) {
    const referrals = loadReferrals();
    const leaderboard = [];
    
    for (const [userJid, data] of Object.entries(referrals)) {
        // Ensure JID has proper format for mentions
        const properJid = userJid.includes('@') ? userJid : `${userJid}@s.whatsapp.net`;
        leaderboard.push({
            userJid: properJid,
            referralCount: data.referrals.length
        });
    }
    
    // Sort by referral count descending
    leaderboard.sort((a, b) => b.referralCount - a.referralCount);
    
    return leaderboard.slice(0, limit);
}
