#!/usr/bin/env node

/**
 * Test del nuovo rapporto rischio/rendimento 1:3
 */

console.log('🧪 Test Rapporto Rischio/Rendimento 1:3\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Parametri
const riskPercent = 0.02; // 2%
const rewardMultiplier = 3; // 1:3

// Test cases
const testCases = [
    { price: 100, signal: 'BUY', name: 'Esempio Base' },
    { price: 175.50, signal: 'BUY', name: 'Apple (AAPL)' },
    { price: 245.80, signal: 'SELL', name: 'Tesla (TSLA)' },
    { price: 420.15, signal: 'BUY', name: 'Microsoft (MSFT)' },
];

testCases.forEach(({ price, signal, name }) => {
    console.log(`📊 ${name}`);
    console.log(`   Prezzo: $${price}`);
    console.log(`   Segnale: ${signal}`);
    
    let stopLoss, takeProfit, risk, reward;
    
    if (signal === 'BUY') {
        stopLoss = price * (1 - riskPercent);
        risk = price - stopLoss;
        takeProfit = price + (risk * rewardMultiplier);
        reward = takeProfit - price;
    } else {
        stopLoss = price * (1 + riskPercent);
        risk = stopLoss - price;
        takeProfit = price - (risk * rewardMultiplier);
        reward = price - takeProfit;
    }
    
    const stopLossPercent = ((stopLoss - price) / price * 100).toFixed(2);
    const takeProfitPercent = ((takeProfit - price) / price * 100).toFixed(2);
    
    console.log(`   🛑 Stop Loss: $${stopLoss.toFixed(2)} (${stopLossPercent}%)`);
    console.log(`   ✅ Take Profit: $${takeProfit.toFixed(2)} (${takeProfitPercent}%)`);
    console.log(`   💰 Rischio: $${risk.toFixed(2)}`);
    console.log(`   💵 Guadagno: $${reward.toFixed(2)}`);
    console.log(`   📊 Rapporto: 1:${rewardMultiplier}`);
    console.log(`   ✓ Verifica: ${(reward / risk).toFixed(1)}:1`);
    console.log('');
});

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Confronto 1:3 vs 1:5
console.log('📈 Confronto 1:3 vs 1:5\n');

const price = 100;
const risk = 2; // 2% di $100

console.log('Con Rapporto 1:3 (NUOVO):');
console.log(`   Rischio: $${risk}`);
console.log(`   Guadagno: $${risk * 3}`);
console.log(`   Win Rate Necessario: ~40%`);
console.log(`   Profitto 10 trade (50% win): $${(5 * risk * 3) - (5 * risk)}`);
console.log('');

console.log('Con Rapporto 1:5 (VECCHIO):');
console.log(`   Rischio: $${risk}`);
console.log(`   Guadagno: $${risk * 5}`);
console.log(`   Win Rate Necessario: ~25%`);
console.log(`   Profitto 10 trade (50% win): $${(5 * risk * 5) - (5 * risk)}`);
console.log('');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('✅ Test completato!\n');
console.log('📝 Note:');
console.log('   - Rapporto 1:3 è più conservativo');
console.log('   - Take profit più vicino (+6% vs +10%)');
console.log('   - Più facile da raggiungere');
console.log('   - Richiede win rate più alto (~40% vs ~25%)');
console.log('');
console.log('🚀 Testa in WhatsApp con: .trading AAPL');
