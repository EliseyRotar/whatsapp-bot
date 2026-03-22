import { getGroupLanguage } from '../../utils/language.js';
import { config } from '../../config.js';
import fetch from 'node-fetch';

// Trading analysis cache
const analysisCache = new Map();
const CACHE_DURATION = 60000; // 1 minute

const responses = {
    en: {
        help: '╔═══════════════════════════╗\n║   📈 TRADING ASSISTANT   ║\n╚═══════════════════════════╝\n\n📊 COMMANDS:\n.trading <SYMBOL> - Analyze stock\n.trading help - Show this help\n\nExample:\n.trading AAPL\n.trading TSLA\n.trading MSFT\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n🎯 FEATURES:\n• Real-time price data\n• Technical indicators (RSI, MACD, SMA)\n• Buy/Sell signals\n• Auto Take Profit (1:3 risk/reward)\n• Auto Stop Loss calculation\n• Trend prediction\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n⚠️ DISCLAIMER:\nThis is for educational purposes only.\nNot financial advice. Trade at your own risk.\n\n🔑 Powered by Alpha Vantage API',
        usage: '📈 Trading Assistant\n\n.trading <SYMBOL> - Analyze stock\n.trading help - Detailed help\n\nExample: .trading AAPL\n\n⚠️ Not financial advice!',
        analyzing: '📊 Analyzing market data...',
        error: '❌ Error:',
        noSymbol: '❌ Please provide a stock symbol!\n\nExample: .trading AAPL',
        apiError: '❌ API Error. Please try again later.',
        invalidSymbol: '❌ Invalid symbol or no data available.',
        noApiKey: '❌ Alpha Vantage API key not configured!'
    },
    it: {
        help: '╔═══════════════════════════╗\n║   📈 ASSISTENTE TRADING   ║\n╚═══════════════════════════╝\n\n📊 COMANDI:\n.trading <SIMBOLO> - Analizza azione\n.trading help - Mostra aiuto\n\nEsempio:\n.trading AAPL\n.trading TSLA\n.trading MSFT\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n🎯 FUNZIONALITÀ:\n• Dati prezzo in tempo reale\n• Indicatori tecnici (RSI, MACD, SMA)\n• Segnali Buy/Sell\n• Take Profit automatico (1:5)\n• Calcolo Stop Loss automatico\n• Predizione trend\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n⚠️ DISCLAIMER:\nSolo scopo educativo.\nNon è consulenza finanziaria. Fai trading a tuo rischio.\n\n🔑 Powered by Alpha Vantage API',
        usage: '📈 Assistente Trading\n\n.trading <SIMBOLO> - Analizza azione\n.trading help - Aiuto dettagliato\n\nEsempio: .trading AAPL\n\n⚠️ Non è consulenza finanziaria!',
        analyzing: '📊 Analizzo dati di mercato...',
        error: '❌ Errore:',
        noSymbol: '❌ Fornisci un simbolo azionario!\n\nEsempio: .trading AAPL',
        apiError: '❌ Errore API. Riprova più tardi.',
        invalidSymbol: '❌ Simbolo non valido o dati non disponibili.',
        noApiKey: '❌ Chiave API Alpha Vantage non configurata!'
    },
    hi: {
        help: '╔═══════════════════════════╗\n║   📈 ट्रेडिंग असिस्टेंट   ║\n╚═══════════════════════════╝\n\n📊 कमांड:\n.trading <सिंबल> - स्टॉक का विश्लेषण करें\n.trading help - यह हेल्प दिखाएं\n\nउदाहरण:\n.trading AAPL\n.trading TSLA\n.trading MSFT\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n🎯 फीचर्स:\n• रियल-टाइम प्राइस डेटा\n• टेक्निकल इंडिकेटर (RSI, MACD, SMA)\n• Buy/Sell सिग्नल\n• ऑटो टेक प्रॉफिट (1:3 रिस्क/रिवॉर्ड)\n• ऑटो स्टॉप लॉस कैलकुलेशन\n• ट्रेंड प्रेडिक्शन\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n⚠️ डिस्क्लेमर:\nयह केवल शैक्षिक उद्देश्यों के लिए है।\nवित्तीय सलाह नहीं है। अपने जोखिम पर ट्रेड करें।\n\n🔑 Powered by Alpha Vantage API',
        usage: '📈 ट्रेडिंग असिस्टेंट\n\n.trading <सिंबल> - स्टॉक का विश्लेषण करें\n.trading help - विस्तृत हेल्प\n\nउदाहरण: .trading AAPL\n\n⚠️ वित्तीय सलाह नहीं है!',
        analyzing: '📊 मार्केट डेटा का विश्लेषण किया जा रहा है...',
        error: '❌ एरर:',
        noSymbol: '❌ कृपया स्टॉक सिंबल प्रदान करें!\n\nउदाहरण: .trading AAPL',
        apiError: '❌ API एरर। कृपया बाद में पुनः प्रयास करें।',
        invalidSymbol: '❌ अमान्य सिंबल या कोई डेटा उपलब्ध नहीं।',
        noApiKey: '❌ Alpha Vantage API की कॉन्फ़िगर नहीं की गई!'
    }
};

// Calculate RSI (Relative Strength Index)
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

// Calculate SMA (Simple Moving Average)
function calculateSMA(prices, period) {
    if (prices.length < period) return null;
    
    const sum = prices.slice(0, period).reduce((a, b) => a + b, 0);
    return sum / period;
}

// Calculate MACD
function calculateMACD(prices) {
    const ema12 = calculateEMA(prices, 12);
    const ema26 = calculateEMA(prices, 26);
    
    if (!ema12 || !ema26) return null;
    
    const macd = ema12 - ema26;
    return macd;
}

// Calculate EMA (Exponential Moving Average)
function calculateEMA(prices, period) {
    if (prices.length < period) return null;
    
    const multiplier = 2 / (period + 1);
    let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
    
    for (let i = period; i < Math.min(prices.length, period + 10); i++) {
        ema = (prices[i] - ema) * multiplier + ema;
    }
    
    return ema;
}

// Calculate volatility (ATR approximation)
function calculateVolatility(highs, lows, closes) {
    if (highs.length < 14) return null;
    
    let sum = 0;
    for (let i = 0; i < 14; i++) {
        const trueRange = Math.max(
            highs[i] - lows[i],
            Math.abs(highs[i] - (closes[i + 1] || closes[i])),
            Math.abs(lows[i] - (closes[i + 1] || closes[i]))
        );
        sum += trueRange;
    }
    
    return sum / 14;
}

// Generate trading signal
function generateSignal(rsi, macd, sma20, sma50, currentPrice) {
    let signal = 'NEUTRAL';
    let strength = 0;
    let reasons = [];
    
    // RSI analysis
    if (rsi < 30) {
        strength += 2;
        reasons.push('RSI oversold');
    } else if (rsi > 70) {
        strength -= 2;
        reasons.push('RSI overbought');
    }
    
    // MACD analysis
    if (macd > 0) {
        strength += 1;
        reasons.push('MACD bullish');
    } else {
        strength -= 1;
        reasons.push('MACD bearish');
    }
    
    // Moving average analysis
    if (currentPrice > sma20 && sma20 > sma50) {
        strength += 2;
        reasons.push('Price above MAs');
    } else if (currentPrice < sma20 && sma20 < sma50) {
        strength -= 2;
        reasons.push('Price below MAs');
    }
    
    // Determine signal
    if (strength >= 3) signal = 'STRONG BUY';
    else if (strength >= 1) signal = 'BUY';
    else if (strength <= -3) signal = 'STRONG SELL';
    else if (strength <= -1) signal = 'SELL';
    
    return { signal, strength, reasons };
}

// Calculate stop loss and take profit (1:3 ratio)
function calculateRiskReward(currentPrice, volatility, signal) {
    const riskPercent = 0.02; // 2% risk
    const rewardMultiplier = 3; // 1:3 risk/reward
    
    let stopLoss, takeProfit;
    
    if (signal.includes('BUY')) {
        // For buy signals
        stopLoss = currentPrice * (1 - riskPercent);
        const risk = currentPrice - stopLoss;
        takeProfit = currentPrice + (risk * rewardMultiplier);
    } else {
        // For sell signals
        stopLoss = currentPrice * (1 + riskPercent);
        const risk = stopLoss - currentPrice;
        takeProfit = currentPrice - (risk * rewardMultiplier);
    }
    
    return {
        stopLoss: stopLoss.toFixed(2),
        takeProfit: takeProfit.toFixed(2),
        riskReward: `1:${rewardMultiplier}`
    };
}

// Fetch stock data from Alpha Vantage
async function getStockData(symbol) {
    const apiKey = config.alphaVantageApiKey || 'demo';
    
    try {
        // Get daily data
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${apiKey}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data['Error Message'] || data['Note']) {
            return null;
        }
        
        const timeSeries = data['Time Series (Daily)'];
        if (!timeSeries) return null;
        
        // Extract price data
        const dates = Object.keys(timeSeries).slice(0, 100);
        const closes = dates.map(date => parseFloat(timeSeries[date]['4. close']));
        const highs = dates.map(date => parseFloat(timeSeries[date]['2. high']));
        const lows = dates.map(date => parseFloat(timeSeries[date]['3. low']));
        const volumes = dates.map(date => parseInt(timeSeries[date]['5. volume']));
        
        const currentPrice = closes[0];
        const previousClose = closes[1];
        const change = currentPrice - previousClose;
        const changePercent = (change / previousClose) * 100;
        
        return {
            symbol,
            currentPrice,
            change,
            changePercent,
            closes,
            highs,
            lows,
            volumes,
            lastUpdate: dates[0]
        };
        
    } catch (error) {
        console.error('[Trading] API Error:', error.message);
        return null;
    }
}

// Main analysis function
async function analyzeStock(symbol, lang = 'en') {
    // Check cache
    const cacheKey = `${symbol}_${lang}`;
    const cached = analysisCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }
    
    const stockData = await getStockData(symbol);
    if (!stockData) return null;
    
    const { currentPrice, change, changePercent, closes, highs, lows } = stockData;
    
    // Calculate indicators
    const rsi = calculateRSI(closes);
    const macd = calculateMACD(closes);
    const sma20 = calculateSMA(closes, 20);
    const sma50 = calculateSMA(closes, 50);
    const volatility = calculateVolatility(highs, lows, closes);
    
    // Generate signal
    const { signal, strength, reasons } = generateSignal(rsi, macd, sma20, sma50, currentPrice);
    
    // Calculate risk/reward
    const riskReward = calculateRiskReward(currentPrice, volatility, signal);
    
    // Predict trend
    const trend = sma20 > sma50 ? (lang === 'it' ? 'RIALZISTA' : 'BULLISH') : 
                                  (lang === 'it' ? 'RIBASSISTA' : 'BEARISH');
    
    const result = {
        symbol: stockData.symbol,
        price: currentPrice.toFixed(2),
        change: change.toFixed(2),
        changePercent: changePercent.toFixed(2),
        signal,
        trend,
        rsi: rsi?.toFixed(2),
        macd: macd?.toFixed(4),
        sma20: sma20?.toFixed(2),
        sma50: sma50?.toFixed(2),
        stopLoss: riskReward.stopLoss,
        takeProfit: riskReward.takeProfit,
        riskReward: riskReward.riskReward,
        reasons: reasons.join(', '),
        lastUpdate: stockData.lastUpdate
    };
    
    // Cache result
    analysisCache.set(cacheKey, { data: result, timestamp: Date.now() });
    
    return result;
}

// Format analysis result
function formatAnalysis(analysis, lang) {
    const signalEmoji = analysis.signal.includes('BUY') ? '🟢' : 
                       analysis.signal.includes('SELL') ? '🔴' : '🟡';
    const trendEmoji = analysis.trend.includes('BULL') || analysis.trend.includes('RIALZ') ? '📈' : '📉';
    const changeEmoji = parseFloat(analysis.change) >= 0 ? '📈' : '📉';
    
    const text = lang === 'it' ? 
`╔═══════════════════════════╗
║   📊 ANALISI TRADING      ║
╚═══════════════════════════╝

💹 SIMBOLO: ${analysis.symbol}
💰 PREZZO: $${analysis.price}
${changeEmoji} VARIAZIONE: ${analysis.change} (${analysis.changePercent}%)
📅 AGGIORNATO: ${analysis.lastUpdate}

━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 SEGNALE: ${signalEmoji} ${analysis.signal}
${trendEmoji} TREND: ${analysis.trend}

━━━━━━━━━━━━━━━━━━━━━━━━━

📊 INDICATORI TECNICI:
• RSI (14): ${analysis.rsi}
• MACD: ${analysis.macd}
• SMA 20: $${analysis.sma20}
• SMA 50: $${analysis.sma50}

━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 GESTIONE RISCHIO (${analysis.riskReward}):
🛑 STOP LOSS: $${analysis.stopLoss}
✅ TAKE PROFIT: $${analysis.takeProfit}

━━━━━━━━━━━━━━━━━━━━━━━━━

📝 MOTIVI: ${analysis.reasons}

⚠️ DISCLAIMER: Solo scopo educativo.
Non è consulenza finanziaria!` :
`╔═══════════════════════════╗
║   📊 TRADING ANALYSIS     ║
╚═══════════════════════════╝

💹 SYMBOL: ${analysis.symbol}
💰 PRICE: $${analysis.price}
${changeEmoji} CHANGE: ${analysis.change} (${analysis.changePercent}%)
📅 UPDATED: ${analysis.lastUpdate}

━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 SIGNAL: ${signalEmoji} ${analysis.signal}
${trendEmoji} TREND: ${analysis.trend}

━━━━━━━━━━━━━━━━━━━━━━━━━

📊 TECHNICAL INDICATORS:
• RSI (14): ${analysis.rsi}
• MACD: ${analysis.macd}
• SMA 20: $${analysis.sma20}
• SMA 50: $${analysis.sma50}

━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 RISK MANAGEMENT (${analysis.riskReward}):
🛑 STOP LOSS: $${analysis.stopLoss}
✅ TAKE PROFIT: $${analysis.takeProfit}

━━━━━━━━━━━━━━━━━━━━━━━━━

📝 REASONS: ${analysis.reasons}

⚠️ DISCLAIMER: Educational purposes only.
Not financial advice!`;
    
    return text;
}

export default {
    name: 'trading',
    aliases: ['trade', 'stock', 'market'],
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        try {
            // Handle help command
            if (args[0] === 'help' || args.length === 0) {
                return await sock.sendMessage(from, { 
                    text: args[0] === 'help' ? t.help : t.usage 
                });
            }
            
            // Check API key
            if (!config.alphaVantageApiKey) {
                return await sock.sendMessage(from, { text: t.noApiKey });
            }
            
            const symbol = args[0].toUpperCase();
            
            // Send analyzing message
            const analyzingMsg = await sock.sendMessage(from, { text: t.analyzing });
            
            // Analyze stock
            const analysis = await analyzeStock(symbol, lang);
            
            if (!analysis) {
                return await sock.sendMessage(from, {
                    text: t.invalidSymbol,
                    edit: analyzingMsg.key
                });
            }
            
            // Format and send result
            const resultText = formatAnalysis(analysis, lang);
            
            await sock.sendMessage(from, {
                text: resultText,
                edit: analyzingMsg.key
            });
            
        } catch (error) {
            console.error('[Trading] Error:', error.message);
            await sock.sendMessage(from, {
                text: `${t.error} ${error.message}`
            });
        }
    }
};
