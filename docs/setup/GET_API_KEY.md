# 🔑 Come Ottenere la Tua API Key Gratuita

## 📋 Guida Passo-Passo

### Passo 1: Vai sul Sito Alpha Vantage

Apri il browser e vai su:

```
https://www.alphavantage.co/support/#api-key
```

### Passo 2: Inserisci la Tua Email

Vedrai un form con:

- Campo email
- Checkbox per accettare i termini

1. Inserisci il tuo indirizzo email
2. Spunta la checkbox "I agree to the Terms of Service"
3. Clicca su "GET FREE API KEY"

### Passo 3: Ricevi la Chiave

**Riceverai IMMEDIATAMENTE:**

- La chiave API mostrata sulla pagina
- Una email di conferma con la chiave

**Esempio di chiave:**

```
ABCD1234EFGH5678
```

### Passo 4: Copia la Chiave

1. Seleziona tutta la chiave
2. Copia (Ctrl+C o Cmd+C)
3. Conservala in un posto sicuro

### Passo 5: Configura nel Bot

1. Apri il file `config.js`
2. Trova questa riga:
   ```javascript
   alphaVantageApiKey: 'demo',
   ```
3. Sostituisci 'demo' con la tua chiave:
   ```javascript
   alphaVantageApiKey: 'ABCD1234EFGH5678',
   ```
4. Salva il file

### Passo 6: Riavvia il Bot

```bash
# Ferma il bot (Ctrl+C)
# Riavvia
npm start
```

### Passo 7: Testa

In WhatsApp:

```
.trading AAPL
```

Se vedi l'analisi, funziona! 🎉

## ✅ Verifica Configurazione

### Test Rapido

Esegui:

```bash
node test-trading.js
```

Dovresti vedere:

```
🧪 Testing Trading Command

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣  Testing API Connection

📊 Testing AAPL...
   ✅ Data retrieved successfully
   💰 Price: $175.50
   📈 Change: +2.30 (+1.33%)
   ...
```

## 🔒 Sicurezza della Chiave

### ✅ Cosa Fare

- Conserva la chiave in modo sicuro
- Non condividerla con nessuno
- Usa una chiave per progetto
- Tienila nel file config.js (già in .gitignore)

### ❌ Cosa NON Fare

- Non pubblicarla su GitHub
- Non condividerla in chat pubbliche
- Non usare la stessa chiave per più progetti
- Non inviarla via email non criptata

## 📊 Limiti del Piano Gratuito

### Cosa Ottieni GRATIS:

- ✅ 5 richieste al minuto
- ✅ 500 richieste al giorno
- ✅ Dati storici completi (20+ anni)
- ✅ 100,000+ simboli globali
- ✅ Supporto tecnico base

### Cosa NON Ottieni:

- ❌ Dati in tempo reale (solo fine giornata)
- ❌ Dati intraday real-time
- ❌ Più di 5 richieste/minuto
- ❌ Supporto prioritario

### È Sufficiente?

**SÌ!** Per:

- Analisi giornaliere
- Swing trading
- Position trading
- Apprendimento
- Progetti personali

**NO** per:

- Day trading intensivo
- Scalping
- Trading ad alta frequenza
- Applicazioni commerciali

## 🚀 Upgrade a Premium (Opzionale)

Se hai bisogno di più:

### Piano Premium ($49.99/mese)

- 75 richieste al minuto
- 15,000 richieste al giorno
- Dati real-time
- Supporto prioritario

### Piano Enterprise (Custom)

- Richieste illimitate
- Dati real-time
- SLA garantito
- Supporto dedicato

**Link:** https://www.alphavantage.co/premium/

## ❓ Problemi Comuni

### Problema: "Non ricevo l'email"

**Soluzioni:**

1. Controlla la cartella spam
2. Aspetta 5 minuti
3. Riprova con un'altra email
4. Contatta support@alphavantage.co

### Problema: "La chiave non funziona"

**Soluzioni:**

1. Verifica di averla copiata correttamente
2. Controlla che non ci siano spazi extra
3. Assicurati di aver salvato config.js
4. Riavvia il bot

### Problema: "API Error"

**Soluzioni:**

1. Hai superato 5 richieste/minuto
2. Aspetta 1 minuto
3. Riprova

### Problema: "Invalid API key"

**Soluzioni:**

1. La chiave è sbagliata
2. Ottieni una nuova chiave
3. Riconfigura

## 📧 Contatti Alpha Vantage

### Supporto

- Email: support@alphavantage.co
- Website: https://www.alphavantage.co/
- FAQ: https://www.alphavantage.co/faq/

### Social Media

- Twitter: @alpha_vantage
- LinkedIn: Alpha Vantage

## 💡 Suggerimenti

### Ottimizza l'Uso

1. **Cache**: Il bot usa cache di 1 minuto
2. **Batch**: Analizza più simboli con pause
3. **Orari**: Usa durante orari di mercato
4. **Simboli**: Verifica simboli validi prima

### Monitora l'Uso

Tieni traccia di:

- Quante richieste fai al giorno
- Quando superi i limiti
- Quali simboli usi di più

### Best Practices

1. Non fare richieste inutili
2. Usa la cache quando possibile
3. Aspetta tra le richieste
4. Pianifica le analisi

## 🎓 Risorse Aggiuntive

### Documentazione API

- Docs: https://www.alphavantage.co/documentation/
- Examples: https://www.alphavantage.co/documentation/#examples
- FAQ: https://www.alphavantage.co/faq/

### Tutorial

- Getting Started: https://www.alphavantage.co/documentation/#getting-started
- Best Practices: https://www.alphavantage.co/documentation/#best-practices

### Community

- Stack Overflow: Tag [alpha-vantage]
- GitHub: Cerca "alpha vantage"

## ✅ Checklist Finale

Prima di iniziare, verifica:

- [ ] Ho ottenuto la mia API key
- [ ] Ho copiato la chiave correttamente
- [ ] Ho configurato config.js
- [ ] Ho salvato il file
- [ ] Ho riavviato il bot
- [ ] Ho testato con .trading AAPL
- [ ] Funziona correttamente
- [ ] Ho letto i limiti del piano gratuito
- [ ] Ho conservato la chiave in modo sicuro

## 🎉 Sei Pronto!

Se hai completato tutti i passi:

- ✅ Hai la tua API key
- ✅ Il bot è configurato
- ✅ Hai testato il comando
- ✅ Tutto funziona

**Congratulazioni! Puoi iniziare a usare il trading bot! 📈💰**

## 📞 Hai Bisogno di Aiuto?

### Documentazione

1. Leggi `TRADING_README.md`
2. Consulta `TRADING_FAQ.md`
3. Vedi `TRADING_EXAMPLES.md`

### Test

```bash
node test-trading.js
```

### Supporto

- Controlla i log del bot
- Verifica la configurazione
- Rileggi questa guida

---

**Buon trading! 📈💰**

_Ricorda: investi responsabilmente e fai sempre le tue ricerche._
