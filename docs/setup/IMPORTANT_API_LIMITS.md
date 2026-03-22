# ⚠️ IMPORTANTE: Limiti API Aggiornati

## 🔄 Aggiornamento 2026

Alpha Vantage ha aggiornato i limiti del piano gratuito:

### ❌ VECCHI LIMITI (Pre-2026)

- 5 richieste al minuto
- 500 richieste al giorno

### ✅ NUOVI LIMITI (2026)

- **25 richieste al giorno**
- Nessun limite al minuto (ma max 25/giorno)

## 📊 Cosa Significa

### Per Te

- Puoi analizzare **max 25 azioni al giorno**
- Nessuna attesa tra le richieste
- Limite giornaliero più restrittivo

### Esempi Pratici

**Scenario 1: Analisi Giornaliera**

```
Mattina:
.trading AAPL
.trading TSLA
.trading MSFT
.trading GOOGL
.trading AMZN

Pomeriggio:
.trading NVDA
.trading META
.trading NFLX
...

Totale: Max 25 simboli/giorno
```

**Scenario 2: Monitoraggio Portfolio**

```
Hai 10 azioni in portfolio
Puoi analizzarle 2 volte al giorno
O 1 volta + 15 nuove analisi
```

## 💡 Come Ottimizzare l'Uso

### 1. Usa la Cache

Il bot ha cache di 1 minuto:

```
.trading AAPL  ← Usa 1 richiesta
.trading AAPL  ← Usa cache (entro 1 min)
```

### 2. Pianifica le Analisi

- Analizza al mattino (apertura mercato)
- Analizza alla sera (chiusura mercato)
- Non sprecare richieste

### 3. Scegli i Simboli Importanti

- Focus su 10-15 azioni principali
- Non analizzare tutto
- Qualità > Quantità

### 4. Monitora l'Uso

Tieni traccia di quante richieste fai:

```
Giorno 1: 15/25 richieste
Giorno 2: 20/25 richieste
Giorno 3: 25/25 richieste (limite!)
```

## 🚀 Upgrade a Premium

Se 25 richieste/giorno non bastano:

### Piano Premium

- **Costo**: Contatta Alpha Vantage
- **Richieste**: Molto più alte
- **Dati**: Real-time
- **Supporto**: Prioritario

**Link**: https://www.alphavantage.co/premium/

## 🎯 Consigli

### ✅ Fai

- Pianifica le analisi
- Usa la cache
- Focus su pochi simboli
- Monitora l'uso giornaliero

### ❌ Non Fare

- Analizzare troppi simboli
- Richieste ripetute inutili
- Sprecare il limite
- Aspettarsi dati real-time

## 📝 Note Importanti

### Cache del Bot

Il bot implementa cache di 1 minuto:

- Stessa richiesta entro 1 min = usa cache
- Non consuma il limite API
- Ottimizza automaticamente

### Reset Giornaliero

Il limite si resetta ogni 24 ore:

- Probabilmente a mezzanotte UTC
- Verifica con Alpha Vantage
- Pianifica di conseguenza

### Errori

Se superi il limite vedrai:

```
❌ API Error. Please try again later.
```

Soluzione: Aspetta il giorno dopo.

## 🔧 Modifica del Bot

Se vuoi tracciare l'uso, puoi modificare `trading.js`:

```javascript
// Aggiungi contatore richieste
let dailyRequests = 0;
const MAX_DAILY_REQUESTS = 25;

// Prima di ogni richiesta
if (dailyRequests >= MAX_DAILY_REQUESTS) {
  return "Limite giornaliero raggiunto (25/25)";
}

// Dopo ogni richiesta
dailyRequests++;
```

## 📞 Supporto Alpha Vantage

Per domande sui limiti:

- Email: support@alphavantage.co
- Website: https://www.alphavantage.co/support/

## ✅ Checklist Uso Ottimale

- [ ] Pianifica quali azioni analizzare
- [ ] Max 25 simboli al giorno
- [ ] Usa cache quando possibile
- [ ] Monitora quante richieste fai
- [ ] Considera upgrade se serve di più

---

**Aggiornato**: 3 Marzo 2026
**Fonte**: https://www.alphavantage.co/support/

_Usa il bot responsabilmente e ottimizza le richieste!_
