# 📈 Trading Command - Guida Completa

## 🎯 Panoramica

Il comando `.trading` è un assistente di trading avanzato che analizza il mercato azionario in tempo reale e fornisce:

- Segnali di acquisto/vendita basati su analisi tecnica
- Calcolo automatico di Stop Loss e Take Profit con rapporto 1:5
- Indicatori tecnici (RSI, MACD, SMA)
- Predizione del trend di mercato

## 🚀 Come Usare

### Comandi Base

```
.trading <SIMBOLO>     - Analizza un'azione
.trading help          - Mostra l'aiuto completo
```

### Esempi

```
.trading AAPL          - Analizza Apple
.trading TSLA          - Analizza Tesla
.trading MSFT          - Analizza Microsoft
.trading GOOGL         - Analizza Google
.trading AMZN          - Analizza Amazon
```

### Alias Disponibili

Puoi usare anche:

- `.trade <SIMBOLO>`
- `.stock <SIMBOLO>`
- `.market <SIMBOLO>`

## 📊 Cosa Analizza

### 1. Indicatori Tecnici

#### RSI (Relative Strength Index)

- **< 30**: Ipervenduto (possibile segnale di acquisto)
- **30-70**: Zona neutrale
- **> 70**: Ipercomprato (possibile segnale di vendita)

#### MACD (Moving Average Convergence Divergence)

- **Positivo**: Momentum rialzista
- **Negativo**: Momentum ribassista

#### SMA (Simple Moving Average)

- **SMA 20**: Media mobile a 20 giorni
- **SMA 50**: Media mobile a 50 giorni
- Quando il prezzo è sopra entrambe le medie = trend rialzista

### 2. Segnali di Trading

Il bot genera segnali basati su:

- Analisi RSI
- Analisi MACD
- Posizione del prezzo rispetto alle medie mobili

**Segnali possibili:**

- 🟢 **STRONG BUY**: Forte segnale di acquisto
- 🟢 **BUY**: Segnale di acquisto
- 🟡 **NEUTRAL**: Nessun segnale chiaro
- 🔴 **SELL**: Segnale di vendita
- 🔴 **STRONG SELL**: Forte segnale di vendita

### 3. Gestione del Rischio (1:5)

Il bot calcola automaticamente:

#### Stop Loss

- Posizionato al 2% sotto il prezzo di entrata (per acquisti)
- Limita le perdite in caso di movimento contrario

#### Take Profit

- Posizionato per ottenere un guadagno 5 volte superiore al rischio
- Rapporto rischio/rendimento di 1:5

**Esempio:**

```
Prezzo corrente: $100
Stop Loss: $98 (rischio di $2)
Take Profit: $110 (guadagno di $10)
Rapporto: 1:5 (rischi $2 per guadagnare $10)
```

## 🔧 Configurazione

### 1. API Key Gratuita

Il bot usa l'API di Alpha Vantage. Per ottenere una chiave gratuita:

1. Vai su: https://www.alphavantage.co/support/#api-key
2. Inserisci il tuo indirizzo email
3. Riceverai la chiave API via email
4. Apri `config.js` e sostituisci:

```javascript
alphaVantageApiKey: 'TUA_CHIAVE_QUI',
```

### 2. Limiti API Gratuita

- **5 richieste al minuto**
- **500 richieste al giorno**
- Dati aggiornati giornalmente (non in tempo reale)

Per dati in tempo reale, considera un piano premium.

## 📈 Esempio di Output

```
╔═══════════════════════════╗
║   📊 ANALISI TRADING      ║
╚═══════════════════════════╝

💹 SIMBOLO: AAPL
💰 PREZZO: $175.50
📈 VARIAZIONE: +2.30 (+1.33%)
📅 AGGIORNATO: 2026-03-02

━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 SEGNALE: 🟢 BUY
📈 TREND: RIALZISTA

━━━━━━━━━━━━━━━━━━━━━━━━━

📊 INDICATORI TECNICI:
• RSI (14): 45.23
• MACD: 0.0234
• SMA 20: $172.30
• SMA 50: $168.90

━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 GESTIONE RISCHIO (1:5):
🛑 STOP LOSS: $171.99
✅ TAKE PROFIT: $193.05

━━━━━━━━━━━━━━━━━━━━━━━━━

📝 MOTIVI: MACD bullish, Price above MAs

⚠️ DISCLAIMER: Solo scopo educativo.
Non è consulenza finanziaria!
```

## 🧮 Come Funziona l'Algoritmo

### 1. Raccolta Dati

- Scarica gli ultimi 100 giorni di dati storici
- Estrae: prezzi di apertura, chiusura, massimi, minimi, volumi

### 2. Calcolo Indicatori

```javascript
// RSI: misura la forza del trend
RSI = 100 - (100 / (1 + RS))
dove RS = Media Guadagni / Media Perdite

// MACD: differenza tra EMA 12 e EMA 26
MACD = EMA(12) - EMA(26)

// SMA: media semplice dei prezzi
SMA(n) = Somma(prezzi ultimi n giorni) / n
```

### 3. Generazione Segnale

Il bot assegna punti in base a:

- RSI < 30: +2 punti (ipervenduto)
- RSI > 70: -2 punti (ipercomprato)
- MACD > 0: +1 punto (bullish)
- MACD < 0: -1 punto (bearish)
- Prezzo > SMA20 > SMA50: +2 punti (trend forte)

**Totale punti:**

- ≥ 3: STRONG BUY
- 1-2: BUY
- -1 a 0: NEUTRAL
- -2 a -1: SELL
- ≤ -3: STRONG SELL

### 4. Calcolo Stop Loss / Take Profit

```javascript
// Per segnali BUY:
Stop Loss = Prezzo Corrente × (1 - 0.02)  // -2%
Rischio = Prezzo Corrente - Stop Loss
Take Profit = Prezzo Corrente + (Rischio × 5)

// Per segnali SELL:
Stop Loss = Prezzo Corrente × (1 + 0.02)  // +2%
Rischio = Stop Loss - Prezzo Corrente
Take Profit = Prezzo Corrente - (Rischio × 5)
```

## 🌍 Mercati Supportati

Il bot supporta azioni da tutto il mondo:

### Stati Uniti

```
.trading AAPL    - Apple
.trading TSLA    - Tesla
.trading MSFT    - Microsoft
```

### Europa

```
.trading TSCO.LON    - Tesco (Londra)
.trading MBG.DEX     - Mercedes (Germania)
```

### Asia

```
.trading RELIANCE.BSE    - Reliance (India)
.trading 600104.SHH      - SAIC Motor (Shanghai)
```

## ⚠️ Disclaimer Importante

**QUESTO BOT È SOLO PER SCOPI EDUCATIVI!**

- ❌ Non è consulenza finanziaria
- ❌ Non garantisce profitti
- ❌ I mercati sono imprevedibili
- ✅ Fai sempre le tue ricerche
- ✅ Investi solo ciò che puoi permetterti di perdere
- ✅ Consulta un consulente finanziario professionista

## 🐛 Risoluzione Problemi

### Errore: "API key not configured"

**Soluzione:** Configura la chiave API in `config.js`

### Errore: "Invalid symbol"

**Soluzione:** Verifica che il simbolo sia corretto. Usa `.trading help` per esempi.

### Errore: "API Error"

**Soluzione:**

- Hai superato il limite di 5 richieste/minuto
- Aspetta 1 minuto e riprova
- Considera un upgrade al piano premium

### Dati non aggiornati

**Soluzione:** La versione gratuita fornisce dati di fine giornata. Per dati in tempo reale serve un piano premium.

## 📚 Risorse Aggiuntive

### Impara il Trading

- [Investopedia - Technical Analysis](https://www.investopedia.com/technical-analysis-4689657)
- [Babypips - School of Pipsology](https://www.babypips.com/learn/forex)

### API Documentation

- [Alpha Vantage Docs](https://www.alphavantage.co/documentation/)

### Indicatori Tecnici

- [RSI Explained](https://www.investopedia.com/terms/r/rsi.asp)
- [MACD Explained](https://www.investopedia.com/terms/m/macd.asp)
- [Moving Averages](https://www.investopedia.com/terms/m/movingaverage.asp)

## 🔄 Aggiornamenti Futuri

Funzionalità pianificate:

- [ ] Supporto per criptovalute
- [ ] Analisi multi-timeframe
- [ ] Backtesting delle strategie
- [ ] Alert automatici
- [ ] Portfolio tracking
- [ ] Analisi fondamentale

## 💡 Suggerimenti per l'Uso

1. **Usa più indicatori**: Non basarti solo su un segnale
2. **Controlla il volume**: Volumi alti confermano i trend
3. **Considera il contesto**: Notizie e eventi influenzano i prezzi
4. **Gestisci il rischio**: Usa sempre stop loss
5. **Tieni un diario**: Registra le tue operazioni per imparare

## 📞 Supporto

Per problemi o domande:

1. Controlla questa guida
2. Usa `.trading help` nel bot
3. Verifica la configurazione in `config.js`

---

**Buon trading! 📈💰**

_Ricorda: il trading comporta rischi. Investi responsabilmente._
