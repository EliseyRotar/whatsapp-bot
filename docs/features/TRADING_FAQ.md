# ❓ Trading Command - FAQ (Domande Frequenti)

## 🚀 Installazione e Configurazione

### Q: Come ottengo una API key gratuita?

**A:**

1. Vai su https://www.alphavantage.co/support/#api-key
2. Inserisci la tua email
3. Riceverai la chiave via email (istantaneamente)
4. Copia la chiave in `config.js`

### Q: Dove inserisco la API key?

**A:** Apri il file `config.js` e modifica:

```javascript
alphaVantageApiKey: 'TUA_CHIAVE_QUI',
```

### Q: Posso usare la chiave "demo"?

**A:** Sì, ma è limitata e condivisa. Ottieni la tua chiave personale per prestazioni migliori.

### Q: Devo pagare per l'API?

**A:** No! La versione gratuita include:

- 5 richieste al minuto
- 500 richieste al giorno
- Dati storici completi

---

## 📊 Utilizzo del Comando

### Q: Come uso il comando?

**A:** Semplicemente scrivi:

```
.trading AAPL
.trading TSLA
.trading MSFT
```

### Q: Quali simboli posso usare?

**A:** Tutti i simboli supportati da Alpha Vantage:

- USA: AAPL, TSLA, MSFT, GOOGL, AMZN, etc.
- Europa: TSCO.LON, MBG.DEX, etc.
- Asia: RELIANCE.BSE, 600104.SHH, etc.

### Q: Come trovo il simbolo di un'azione?

**A:** Cerca su:

- Google: "simbolo azione [nome azienda]"
- Yahoo Finance
- TradingView
- Alpha Vantage symbol search

### Q: Posso analizzare criptovalute?

**A:** Non ancora. Funzionalità in arrivo!

### Q: Quanto tempo ci vuole per l'analisi?

**A:** 2-5 secondi per simbolo.

---

## 📈 Interpretazione dei Risultati

### Q: Cosa significa RSI?

**A:** Relative Strength Index - misura se un'azione è:

- < 30: Ipervenduta (possibile acquisto)
- 30-70: Zona neutrale
- > 70: Ipercomprata (possibile vendita)

### Q: Cosa significa MACD?

**A:** Moving Average Convergence Divergence - indica:

- Positivo: Momentum rialzista
- Negativo: Momentum ribassista
- Vicino a zero: Momentum debole

### Q: Cosa sono SMA 20 e SMA 50?

**A:** Simple Moving Averages:

- SMA 20: Media dei prezzi ultimi 20 giorni
- SMA 50: Media dei prezzi ultimi 50 giorni
- Indicano il trend generale

### Q: Cosa significa "STRONG BUY"?

**A:** Segnale molto forte di acquisto basato su:

- RSI favorevole
- MACD positivo
- Prezzo sopra le medie mobili

### Q: Cosa significa "NEUTRAL"?

**A:** Nessun segnale chiaro. Meglio:

- Attendere
- Analizzare altri asset
- Monitorare per cambiamenti

---

## 🎯 Stop Loss e Take Profit

### Q: Cosa è lo Stop Loss?

**A:** Livello di prezzo dove chiudi la posizione per limitare le perdite.

- Esempio: Compri a $100, stop loss a $98
- Se il prezzo scende a $98, vendi automaticamente
- Perdi solo $2 invece di più

### Q: Cosa è il Take Profit?

**A:** Livello di prezzo dove chiudi la posizione per prendere profitti.

- Esempio: Compri a $100, take profit a $110
- Se il prezzo sale a $110, vendi automaticamente
- Guadagni $10

### Q: Perché rapporto 1:5?

**A:** Significa:

- Rischi $1 per guadagnare $5
- Anche con 50% di trade vincenti, sei in profitto
- Gestione del rischio ottimale

### Q: Posso modificare il rapporto?

**A:** Sì, modifica il codice in `trading.js`:

```javascript
const rewardMultiplier = 5; // Cambia questo valore
```

### Q: Devo sempre usare stop loss?

**A:** SÌ! SEMPRE! È la regola d'oro del trading.

---

## 🔧 Problemi Tecnici

### Q: Errore "API key not configured"

**A:** Hai dimenticato di configurare la chiave in `config.js`.

### Q: Errore "Invalid symbol"

**A:** Il simbolo non esiste o è scritto male.

- Verifica su Yahoo Finance
- Usa simboli corretti (es: AAPL, non Apple)

### Q: Errore "API Error"

**A:** Possibili cause:

1. Hai superato 5 richieste/minuto
2. Hai superato 500 richieste/giorno
3. Problemi di connessione

**Soluzione:** Aspetta 1 minuto e riprova.

### Q: I dati non sono aggiornati

**A:** La versione gratuita fornisce dati di fine giornata.

- Per dati real-time serve piano premium
- I dati vengono aggiornati dopo la chiusura del mercato

### Q: Il bot è lento

**A:** Possibili cause:

1. Connessione internet lenta
2. API sovraccarica
3. Troppi utenti usano il bot

**Soluzione:** La cache riduce le richieste ripetute.

---

## 💰 Trading e Investimenti

### Q: Posso fidarmi dei segnali?

**A:** I segnali sono basati su analisi tecnica, ma:

- ❌ Non sono infallibili
- ❌ Non garantiscono profitti
- ✅ Sono uno strumento di supporto
- ✅ Vanno combinati con altre analisi

### Q: Devo seguire tutti i segnali?

**A:** NO! Usa il tuo giudizio:

- Verifica il contesto di mercato
- Leggi le notizie
- Considera il tuo piano di trading
- Gestisci il rischio

### Q: Quanto devo investire?

**A:** Regola generale:

- Mai più del 2% del capitale per trade
- Esempio: Capitale $10,000 → Max $200 per trade
- Diversifica su più asset

### Q: Posso diventare ricco con questo bot?

**A:** NO! Il trading:

- Richiede studio e pratica
- Comporta rischi significativi
- Non è un modo per arricchirsi velocemente
- Richiede disciplina e pazienza

### Q: È meglio del trading manuale?

**A:** È uno strumento complementare:

- ✅ Fornisce analisi oggettive
- ✅ Elimina emozioni
- ✅ Calcola rischio automaticamente
- ❌ Non sostituisce l'esperienza umana

---

## 📚 Apprendimento

### Q: Sono un principiante, posso usarlo?

**A:** Sì, ma:

1. Studia prima le basi del trading
2. Usa un conto demo per praticare
3. Non investire soldi reali subito
4. Impara dagli errori

### Q: Dove imparo l'analisi tecnica?

**A:** Risorse consigliate:

- Investopedia (gratis)
- Babypips (gratis)
- YouTube: "Technical Analysis"
- Libri: "Technical Analysis of Financial Markets"

### Q: Quanto tempo serve per imparare?

**A:** Dipende:

- Basi: 1-2 mesi
- Competenza: 6-12 mesi
- Maestria: Anni di pratica

### Q: Devo conoscere la matematica?

**A:** No, il bot calcola tutto per te!

- RSI, MACD, SMA: calcolati automaticamente
- Stop Loss, Take Profit: calcolati automaticamente
- Devi solo interpretare i risultati

---

## 🌍 Mercati e Orari

### Q: Quali mercati sono supportati?

**A:** Tutti i mercati globali:

- USA (NYSE, NASDAQ)
- Europa (LSE, XETRA, etc.)
- Asia (BSE, Shanghai, etc.)

### Q: Posso tradare 24/7?

**A:** No, i mercati hanno orari:

- USA: 9:30-16:00 EST
- Europa: 9:00-17:30 CET
- Asia: Vari orari

### Q: Il bot funziona fuori orario?

**A:** Sì, ma:

- Analizza dati dell'ultima chiusura
- Non fornisce dati intraday real-time
- Meglio usarlo durante orari di mercato

---

## 🔒 Sicurezza e Privacy

### Q: I miei dati sono sicuri?

**A:** Sì:

- Il bot non memorizza dati personali
- Le analisi sono temporanee (cache 1 minuto)
- L'API key è locale sul tuo server

### Q: Posso condividere la mia API key?

**A:** NO! Mai condividere:

- Ogni utente deve avere la propria
- Rischio di superare i limiti
- Problemi di sicurezza

### Q: Il bot può accedere al mio conto trading?

**A:** NO! Il bot:

- Fornisce solo analisi
- Non può eseguire trade
- Non ha accesso ai tuoi conti
- È completamente separato dal broker

---

## 💡 Suggerimenti Avanzati

### Q: Come miglioro l'accuratezza?

**A:**

1. Combina con analisi fondamentale
2. Considera il volume di scambio
3. Leggi le notizie
4. Usa timeframe multipli
5. Tieni un diario di trading

### Q: Posso automatizzare i trade?

**A:** Non con questo bot, ma:

- Puoi integrare con broker API
- Richiede programmazione avanzata
- Comporta rischi elevati
- Non consigliato per principianti

### Q: Come testo una strategia?

**A:** Backtesting:

1. Raccogli dati storici
2. Applica la strategia
3. Calcola risultati
4. Ottimizza parametri

### Q: Posso modificare gli indicatori?

**A:** Sì! Modifica `trading.js`:

```javascript
// Cambia periodi RSI
const rsi = calculateRSI(closes, 14); // Cambia 14

// Cambia periodi SMA
const sma20 = calculateSMA(closes, 20); // Cambia 20
const sma50 = calculateSMA(closes, 50); // Cambia 50
```

---

## 🎓 Best Practices

### Q: Quali sono le regole d'oro?

**A:**

1. ✅ Usa sempre stop loss
2. ✅ Rischia max 2% per trade
3. ✅ Diversifica il portfolio
4. ✅ Segui il trend
5. ✅ Controlla le emozioni
6. ✅ Tieni un diario
7. ✅ Continua a studiare

### Q: Quando NON tradare?

**A:** Evita di tradare quando:

- Sei emotivo (rabbia, paura, euforia)
- Hai bevuto alcol
- Sei stanco
- Hai appena perso soldi
- Non hai un piano

### Q: Come gestisco le perdite?

**A:**

1. Accettale come parte del gioco
2. Analizza cosa è andato storto
3. Impara dall'errore
4. Non cercare vendetta
5. Fai una pausa se necessario

---

## 📞 Supporto

### Q: Ho ancora domande, dove chiedo?

**A:**

1. Leggi `TRADING_GUIDE.md`
2. Leggi `TRADING_EXAMPLES.md`
3. Usa `.trading help` nel bot
4. Cerca su Investopedia
5. Chiedi nella community

### Q: Ho trovato un bug, cosa faccio?

**A:**

1. Verifica la configurazione
2. Controlla i log del bot
3. Testa con simboli diversi
4. Riporta il problema con dettagli

### Q: Posso contribuire al progetto?

**A:** Sì! Puoi:

- Segnalare bug
- Suggerire miglioramenti
- Aggiungere funzionalità
- Migliorare la documentazione

---

## ⚠️ Disclaimer

### Q: Questo è un consiglio finanziario?

**A:** NO! Assolutamente no:

- È solo uno strumento educativo
- Non garantisce profitti
- Non sostituisce un consulente
- Usi a tuo rischio

### Q: Posso fare causa se perdo soldi?

**A:** NO:

- Il bot è fornito "as is"
- Nessuna garanzia di profitti
- Tu sei responsabile delle tue decisioni
- Leggi sempre il disclaimer

### Q: È legale usare questo bot?

**A:** Sì, ma:

- Verifica le leggi locali
- Rispetta i termini del broker
- Non usare per manipolazione di mercato
- Usa responsabilmente

---

## 🚀 Prossimi Passi

### Q: Cosa devo fare ora?

**A:**

1. ✅ Ottieni API key gratuita
2. ✅ Configura in `config.js`
3. ✅ Riavvia il bot
4. ✅ Testa con `.trading AAPL`
5. ✅ Leggi la documentazione
6. ✅ Pratica con conto demo
7. ✅ Studia analisi tecnica

### Q: Quali funzionalità arriveranno?

**A:** Pianificate:

- [ ] Supporto criptovalute
- [ ] Analisi multi-timeframe
- [ ] Backtesting integrato
- [ ] Alert automatici
- [ ] Portfolio tracking
- [ ] Analisi fondamentale

---

**Hai altre domande?**

Consulta:

- `TRADING_GUIDE.md` - Guida completa
- `TRADING_README.md` - Quick start
- `TRADING_EXAMPLES.md` - Esempi pratici
- `.trading help` - Help nel bot

**Buon trading! 📈💰**

_Ricorda: investi responsabilmente e fai sempre le tue ricerche._
