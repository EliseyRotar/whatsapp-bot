#!/usr/bin/env node

/**
 * Test script for trading command
 * Tests the trading analysis functionality
 */

import fetch from 'node-fetch';

// Test configuration
const TEST_SYMBOLS = ['AAPL', 'TSLA', 'MSFT', 'INVALID'];
const API_KEY = 'demo'; // Use demo key for testing

console.log('🧪 Testing Trading Command\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Calculate RSI
function calculateRSI(prices, period = 14) {
    if (prices.length < period + 1) return null;
    
    let gains = 0;
    let losses = 0;
    
    for (let i = 1; i <= period; i++) {
        const change = prices[i] - prices[i - 1];
        if (change > 0) gains += change;
        else losses += Math.abs(change);
    }
    
    const avgGain = gains / period;
    const avgLoss = losses / period;
    
    if (avgLoss === 0) return 100;
    
    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));
    
    return rsi;
}

// Calculate SMA
function calculateSMA(prices, period) {
    if (prices.length < period) return null;
    const sum = prices.slice(0, period).reduce((a, b) => a + b, 0);
    return sum / period;
}

// Test API connection
async function testAPI(symbol) {
    console.log(`📊 Testing ${symbol}...`);
    
    try {
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data['Error Message']) {
            console.log(`   ❌ Invalid symbol: ${symbol}\n`);
            return false;
        }
        
        if (data['Note']) {
            console.log(`   ⚠️  API rate limit reached\n`);
            return false;
        }
        
        const timeSeries = data['Time Series (Daily)'];
        if (!timeSeries) {
            console.log(`   ❌ No data available\n`);
            return false;
        }
        
        // Extract data
        const dates = Object.keys(timeSeries).slice(0, 50);
        const closes = dates.map(date => parseFloat(timeSeries[date]['4. close']));
        
        const currentPrice = closes[0];
        const previousClose = closes[1];
        const change = currentPrice - previousClose;
        const changePercent = (change / previousClose) * 100;
        
        // Calculate indicators
        const rsi = calculateRSI(closes);
        const sma20 = calculateSMA(closes, 20);
        const sma50 = calculateSMA(closes, 50);
        
        // Display results
        console.log(`   ✅ Data retrieved successfully`);
        console.log(`   💰 Price: $${currentPrice.toFixed(2)}`);
        console.log(`   📈 Change: ${change >= 0 ? '+' : ''}${change.toFixed(2)} (${changePercent.toFixed(2)}%)`);
        console.log(`   📊 RSI: ${rsi?.toFixed(2) || 'N/A'}`);
        console.log(`   📊 SMA20: $${sma20?.toFixed(2) || 'N/A'}`);
        console.log(`   📊 SMA50: $${sma50?.toFixed(2) || 'N/A'}`);
        
        // Generate signal
        let signal = 'NEUTRAL';
        if (rsi < 30) signal = 'BUY (Oversold)';
        else if (rsi > 70) signal = 'SELL (Overbought)';
        else if (currentPrice > sma20 && sma20 > sma50) signal = 'BUY (Uptrend)';
        else if (currentPrice < sma20 && sma20 < sma50) signal = 'SELL (Downtrend)';
        
        console.log(`   🎯 Signal: ${signal}\n`);
        
        return true;
        
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}\n`);
        return false;
    }
}

// Test risk/reward calculation
function testRiskReward() {
    console.log('🎯 Testing Risk/Reward Calculation\n');
    
    const testCases = [
        { price: 100, signal: 'BUY' },
        { price: 50, signal: 'SELL' },
        { price: 175.50, signal: 'BUY' }
    ];
    
    testCases.forEach(({ price, signal }) => {
        const riskPercent = 0.02;
        const rewardMultiplier = 5;
        
        let stopLoss, takeProfit;
        
        if (signal === 'BUY') {
            stopLoss = price * (1 - riskPercent);
            const risk = price - stopLoss;
            takeProfit = price + (risk * rewardMultiplier);
        } else {
            stopLoss = price * (1 + riskPercent);
            const risk = stopLoss - price;
            takeProfit = price - (risk * rewardMultiplier);
        }
        
        console.log(`   Signal: ${signal} at $${price}`);
        console.log(`   🛑 Stop Loss: $${stopLoss.toFixed(2)}`);
        console.log(`   ✅ Take Profit: $${takeProfit.toFixed(2)}`);
        console.log(`   📊 Risk/Reward: 1:5\n`);
    });
}

// Run tests
async function runTests() {
    console.log('1️⃣  Testing API Connection\n');
    
    for (const symbol of TEST_SYMBOLS) {
        await testAPI(symbol);
        // Wait to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 12000)); // 12 seconds between requests
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('2️⃣  Testing Calculations\n');
    testRiskReward();
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('✅ Tests completed!\n');
    console.log('📝 Notes:');
    console.log('   - Free API has 5 requests/minute limit');
    console.log('   - Get your free API key at: https://www.alphavantage.co/support/#api-key');
    console.log('   - Update config.js with your API key');
    console.log('   - Use .trading <SYMBOL> in WhatsApp to test\n');
}

// Run
runTests().catch(console.error);
