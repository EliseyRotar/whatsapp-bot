# 📈 Trading Bot - Quick Start

## 🚀 Installazione Rapida

### 1. Il comando è già installato!

Il comando `.trading` è già integrato nel bot. Non serve installare nulla.

### 2. Ottieni una API Key Gratuita

1. Vai su: **https://www.alphavantage.co/support/#api-key**
2. Inserisci la tua email
3. Riceverai la chiave via email
4. Apri `config.js` e modifica:

```javascript
alphaVantageApiKey: 'TUA_CHIAVE_QUI',
```

### 3. Riavvia il Bot

```bash
npm start
```

## 📱 Uso nel Bot WhatsApp

### Comandi Disponibili

```
.trading AAPL          - Analizza Apple
.trading TSLA          - Analizza Tesla
.trading MSFT          - Analizza Microsoft
.trading help          - Mostra aiuto completo
```

### Esempio di Risposta

```
╔═══════════════════════════╗
║   📊 TRADING ANALYSIS     ║
╚═══════════════════════════╝

💹 SYMBOL: AAPL
💰 PRICE: $175.50
📈 CHANGE: +2.30 (+1.33%)

🎯 SIGNAL: 🟢 BUY
📈 TREND: BULLISH

📊 TECHNICAL INDICATORS:
• RSI (14): 45.23
• MACD: 0.0234
• SMA 20: $172.30
• SMA 50: $168.90

🎯 RISK MANAGEMENT (1:5):
🛑 STOP LOSS: $171.99
✅ TAKE PROFIT: $193.05

⚠️ DISCLAIMER: Educational purposes only.
Not financial advice!
```

## 🧪 Test del Comando

Esegui il test per verificare che tutto funzioni:

```bash
node test-trading.js
```

## 🎯 Caratteristiche Principali

### ✅ Analisi Tecnica Completa

- RSI (Relative Strength Index)
- MACD (Moving Average Convergence Divergence)
- SMA 20 e SMA 50 (Simple Moving Averages)

### ✅ Segnali Automatici

- STRONG BUY / BUY
- NEUTRAL
- SELL / STRONG SELL

### ✅ Gestione Rischio 1:5

- Stop Loss automatico (2% di rischio)
- Take Profit automatico (10% di guadagno)
- Rapporto rischio/rendimento ottimale

### ✅ Supporto Multi-Mercato

- USA (AAPL, TSLA, MSFT, etc.)
- Europa (TSCO.LON, MBG.DEX, etc.)
- Asia (RELIANCE.BSE, 600104.SHH, etc.)

## 📊 Come Funziona

### 1. Raccolta Dati

Il bot scarica gli ultimi 100 giorni di dati storici dal mercato.

### 2. Calcolo Indicatori

Calcola automaticamente:

- RSI per identificare ipercomprato/ipervenduto
- MACD per il momentum
- Medie mobili per il trend

### 3. Generazione Segnale

Combina tutti gli indicatori per generare un segnale:

- Analizza RSI (< 30 = oversold, > 70 = overbought)
- Verifica MACD (positivo = bullish, negativo = bearish)
- Controlla posizione prezzo vs medie mobili

### 4. Calcolo Stop Loss / Take Profit

Calcola automaticamente i livelli di uscita con rapporto 1:5:

- **Stop Loss**: Limita le perdite al 2%
- **Take Profit**: Obiettivo di guadagno al 10%

## ⚠️ Limiti API Gratuita

- **5 richieste al minuto**
- **500 richieste al giorno**
- Dati aggiornati a fine giornata (non real-time)

Per dati in tempo reale, considera un piano premium.

## 🐛 Problemi Comuni

### "API key not configured"

**Soluzione:** Aggiungi la tua API key in `config.js`

### "Invalid symbol"

**Soluzione:** Verifica il simbolo. Esempi: AAPL, TSLA, MSFT

### "API Error"

**Soluzione:** Hai superato il limite. Aspetta 1 minuto.

## 📚 Documentazione Completa

Per la guida completa, leggi: **TRADING_GUIDE.md**

## ⚠️ DISCLAIMER

**IMPORTANTE:**

- Questo bot è solo per scopi educativi
- Non è consulenza finanziaria
- Non garantisce profitti
- Fai sempre le tue ricerche
- Investi solo ciò che puoi permetterti di perdere

## 🔗 Link Utili

- [Alpha Vantage API](https://www.alphavantage.co/)
- [Ottieni API Key Gratuita](https://www.alphavantage.co/support/#api-key)
- [Documentazione API](https://www.alphavantage.co/documentation/)

## 💡 Esempi di Simboli

### USA

- AAPL (Apple)
- TSLA (Tesla)
- MSFT (Microsoft)
- GOOGL (Google)
- AMZN (Amazon)
- META (Meta/Facebook)
- NVDA (Nvidia)

### Europa

- TSCO.LON (Tesco - Londra)
- MBG.DEX (Mercedes - Germania)

### Asia

- RELIANCE.BSE (Reliance - India)
- 600104.SHH (SAIC Motor - Shanghai)

## 🎓 Impara il Trading

Risorse consigliate:

- [Investopedia](https://www.investopedia.com/)
- [Babypips](https://www.babypips.com/)
- [TradingView](https://www.tradingview.com/)

---

**Buon trading! 📈💰**

_Ricorda: investi responsabilmente e fai sempre le tue ricerche._
