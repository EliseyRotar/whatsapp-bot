#!/usr/bin/env node

import fetch from 'node-fetch';

const API_KEY = 'KKRYNPEE62KSSC61';
const SYMBOL = 'IBM'; // Usa IBM come esempio nella documentazione

console.log('🧪 Testing Alpha Vantage API\n');
console.log('API Key:', API_KEY);
console.log('Symbol:', SYMBOL);
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

async function testAPI() {
    try {
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${SYMBOL}&apikey=${API_KEY}`;
        
        console.log('📡 Making request...');
        console.log('URL:', url);
        console.log('');
        
        const response = await fetch(url);
        const data = await response.json();
        
        console.log('📊 Response:');
        console.log(JSON.stringify(data, null, 2));
        console.log('');
        
        if (data['Global Quote']) {
            console.log('✅ API is working!');
            console.log('');
            console.log('Price:', data['Global Quote']['05. price']);
            console.log('Change:', data['Global Quote']['09. change']);
            console.log('Change %:', data['Global Quote']['10. change percent']);
        } else if (data['Note']) {
            console.log('⚠️  Rate limit reached!');
            console.log('Message:', data['Note']);
        } else if (data['Error Message']) {
            console.log('❌ Error:', data['Error Message']);
        } else {
            console.log('⚠️  Unexpected response format');
        }
        
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

testAPI();
