/**
 * Test script to verify slot machine race condition fix
 * 
 * This simulates concurrent slot requests to ensure only one executes at a time
 */

import { getBalance, setBalance } from './utils/bank_SAFE.js';

const TEST_USER = '999999999999999@s.whatsapp.net';

async function testConcurrentSlots() {
    console.log('🧪 Testing Slot Machine Race Condition Fix\n');
    
    // Setup test user with 10000 coins
    console.log('📝 Setting up test user with 10,000 coins...');
    await setBalance(TEST_USER, 10000);
    const initialBalance = await getBalance(TEST_USER);
    console.log(`✅ Initial balance: ${initialBalance} coins\n`);
    
    // Import slot command
    const slotCommand = await import('./commands/games/slot.js');
    
    // Create mock message object
    const createMockMsg = (bet) => ({
        key: {
            remoteJid: 'test-group@g.us',
            participant: TEST_USER,
            id: `TEST_${Date.now()}_${Math.random()}`
        },
        pushName: 'TestUser'
    });
    
    // Create mock socket
    const mockSock = {
        sendMessage: async (jid, content) => {
            console.log(`📤 Message sent to ${jid}:`);
            console.log(content.text.substring(0, 100) + '...\n');
        }
    };
    
    console.log('🚀 Sending 5 concurrent slot requests (100 coins each)...\n');
    
    // Send 5 concurrent requests
    const promises = [];
    for (let i = 0; i < 5; i++) {
        const msg = createMockMsg(100);
        const promise = slotCommand.default.execute(mockSock, msg, ['100'])
            .then(() => console.log(`✅ Request ${i + 1} completed`))
            .catch(err => console.log(`❌ Request ${i + 1} failed: ${err.message}`));
        promises.push(promise);
    }
    
    // Wait for all to complete
    await Promise.all(promises);
    
    // Check final balance
    const finalBalance = await getBalance(TEST_USER);
    const coinsSpent = initialBalance - finalBalance;
    
    console.log('\n📊 Test Results:');
    console.log(`Initial balance: ${initialBalance} coins`);
    console.log(`Final balance: ${finalBalance} coins`);
    console.log(`Coins spent: ${coinsSpent} coins`);
    console.log(`Expected: 100 coins (only 1 game should execute)`);
    
    if (coinsSpent === 100) {
        console.log('\n✅ TEST PASSED: Race condition is fixed!');
        console.log('Only 1 concurrent request was processed.');
    } else if (coinsSpent > 100 && coinsSpent <= 500) {
        console.log('\n⚠️ TEST PARTIALLY PASSED: Some concurrent requests executed');
        console.log(`${coinsSpent / 100} games were processed instead of 1`);
    } else {
        console.log('\n❌ TEST FAILED: Race condition still exists!');
        console.log('Multiple concurrent requests were processed.');
    }
    
    // Cleanup
    await setBalance(TEST_USER, 500);
    console.log('\n🧹 Cleanup complete');
}

// Run test
testConcurrentSlots()
    .then(() => {
        console.log('\n✅ Test completed successfully');
        process.exit(0);
    })
    .catch(err => {
        console.error('\n❌ Test failed with error:', err);
        process.exit(1);
    });
