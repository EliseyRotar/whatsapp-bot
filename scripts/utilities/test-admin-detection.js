#!/usr/bin/env node

/**
 * Test script to verify admin detection fix
 * This simulates the isBotAdmin function logic
 */

// Test cases for different JID formats
const testCases = [
    {
        name: "Regular WhatsApp",
        botUserId: "393313444410@s.whatsapp.net",
        participants: [
            { id: "393313444410@s.whatsapp.net", admin: "admin" },
            { id: "393892556956@s.whatsapp.net", admin: null }
        ],
        expected: true
    },
    {
        name: "Multi-device format",
        botUserId: "393313444410:25@s.whatsapp.net",
        participants: [
            { id: "393313444410@s.whatsapp.net", admin: "admin" },
            { id: "393892556956@s.whatsapp.net", admin: null }
        ],
        expected: true
    },
    {
        name: "LID format (WhatsApp Web)",
        botUserId: "393313444410:106609678225479@lid",
        participants: [
            { id: "393313444410:106609678225479@lid", admin: "admin" },
            { id: "393892556956@s.whatsapp.net", admin: null }
        ],
        expected: true
    },
    {
        name: "Mixed format - bot is LID, participant is regular",
        botUserId: "393313444410:106609678225479@lid",
        participants: [
            { id: "393313444410@s.whatsapp.net", admin: "admin" },
            { id: "393892556956@s.whatsapp.net", admin: null }
        ],
        expected: true
    },
    {
        name: "Bot not admin",
        botUserId: "393313444410@s.whatsapp.net",
        participants: [
            { id: "393313444410@s.whatsapp.net", admin: null },
            { id: "393892556956@s.whatsapp.net", admin: "admin" }
        ],
        expected: false
    }
];

// Simulate the fixed isBotAdmin logic
function testBotAdmin(botUserId, participants, ownerNumber = "393313444410") {
    // Extract bot's phone number
    let botNumber = botUserId.split(':')[0].split('@')[0].replace(/\D/g, '');
    ownerNumber = ownerNumber.replace(/\D/g, '');
    
    console.log(`  Bot user.id: ${botUserId}`);
    console.log(`  Extracted bot number: ${botNumber}`);
    
    // Find participant
    const participant = participants.find(p => {
        const participantId = p.id;
        
        let participantNumber = participantId.split('@')[0];
        if (participantNumber.includes(':')) {
            participantNumber = participantNumber.split(':')[0];
        }
        participantNumber = participantNumber.replace(/\D/g, '');
        
        const matches = participantNumber === botNumber || participantNumber === ownerNumber;
        
        if (matches) {
            console.log(`  Found match: ${p.id}, admin: ${p.admin}`);
        }
        
        return matches;
    });
    
    if (!participant) {
        console.log(`  ❌ Bot not found in participants`);
        return false;
    }
    
    const isAdmin = participant.admin === 'admin' || participant.admin === 'superadmin';
    console.log(`  Result: ${isAdmin ? '✅ IS ADMIN' : '❌ NOT ADMIN'}`);
    return isAdmin;
}

// Run tests
console.log('🧪 Testing Admin Detection Fix\n');
console.log('='.repeat(60));

let passed = 0;
let failed = 0;

testCases.forEach((test, index) => {
    console.log(`\nTest ${index + 1}: ${test.name}`);
    console.log('-'.repeat(60));
    
    const result = testBotAdmin(test.botUserId, test.participants);
    
    if (result === test.expected) {
        console.log(`✅ PASS - Expected: ${test.expected}, Got: ${result}\n`);
        passed++;
    } else {
        console.log(`❌ FAIL - Expected: ${test.expected}, Got: ${result}\n`);
        failed++;
    }
});

console.log('='.repeat(60));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${testCases.length} tests`);

if (failed === 0) {
    console.log('✅ All tests passed! The fix should work correctly.\n');
} else {
    console.log('❌ Some tests failed. Please review the logic.\n');
}
