# 🔫 Sistema KILL - Guida Completa

## Panoramica

Sistema completo di "kill" in stile GTA con armi, effetti WASTED e penalità.

## Caratteristiche

### 🔫 Armi Disponibili

Tutte le armi sono **monouso** e si acquistano dallo shop:

| Arma   | Prezzo        | Successo Base | Emoji |
| ------ | ------------- | ------------- | ----- |
| Knife  | 5,000 coins   | 30%           | 🔪    |
| Pistol | 15,000 coins  | 50%           | 🔫    |
| Rifle  | 35,000 coins  | 70%           | 🔫    |
| Sniper | 75,000 coins  | 85%           | 🎯    |
| RPG    | 150,000 coins | 95%           | 🚀    |

### 📈 Boost che Influenzano il Successo

I boost attivi aumentano la percentuale di successo:

- **Lucky Charm**: +5%
- **Mega Luck**: +10%
- **VIP**: +3%
- **Premium**: +5%
- **Legend**: +8%

**Massimo**: 98% (anche con tutti i boost)

### 💀 Effetti della Kill

Quando una kill ha successo:

1. **Effetto Visivo**:
   - Foto profilo della vittima con effetto GTA "WASTED"
   - Immagine in bianco e nero con tinta rossa
   - Testo "WASTED" sovrapposto

2. **Penalità Economica**:
   - Vittima perde fino a 10,000 coins
   - Se ha meno, perde tutto il saldo

3. **Mute Automatico**:
   - Vittima mutata per 5 minuti
   - Tutti i messaggi vengono eliminati automaticamente
   - Il mute è specifico per gruppo

### ❌ Kill Fallita

Se la kill fallisce:

- L'arma viene persa comunque (monouso)
- Nessuna penalità per la vittima
- Messaggio con percentuale di successo e roll effettivo

## Comandi

### Acquistare Armi

```
.shop buy knife
.shop buy pistol
.shop buy rifle
.shop buy sniper
.shop buy rpg
```

### Vedere le Tue Armi

```
.kill
```

Mostra tutte le armi che possiedi con quantità.

### Usare un'Arma

```
.kill @user <weapon>
```

**Esempi**:

```
.kill @user knife
.kill @user pistol
.kill @user sniper
```

**Alias**: `.k`

## Meccaniche di Gioco

### Calcolo Successo

```
Successo Base (arma)
+ Lucky Charm (5%)
+ Mega Luck (10%)
+ VIP (3%)
+ Premium (5%)
+ Legend (8%)
= Percentuale Finale (max 98%)
```

### Roll

- Il sistema genera un numero casuale 0-100
- Se il numero è < percentuale finale → **SUCCESSO**
- Altrimenti → **FALLIMENTO**

### Sistema Mute

- Durata: 5 minuti esatti
- Automatico: bot elimina ogni messaggio
- Per gruppo: mute valido solo nel gruppo dove è avvenuta la kill
- Scadenza automatica dopo 5 minuti

## Esempi d'Uso

### Scenario 1: Kill Riuscita

```
User: .kill @victim pistol

Bot: 🔫 User used Pistol...
     ⏳ Rolling... (55% chance)

[2 secondi dopo]

Bot: [Immagine WASTED]
     💀 WASTED 💀

     victim has been killed by User!

     💸 Lost 10,000 coins
     🔇 Muted for 5 minutes

     🎯 Success rate: 55%
```

### Scenario 2: Kill Fallita

```
User: .kill @victim knife

Bot: 🔪 User used Knife...
     ⏳ Rolling... (30% chance)

[2 secondi dopo]

Bot: ❌ MISS!

     User missed the shot!

     🎯 Success rate was: 30%
     🎲 Rolled: 67.3%

     💔 Weapon lost anyway!
```

### Scenario 3: Senza Armi

```
User: .kill @victim

Bot: ❌ You don't have any weapons!

     💡 Buy weapons from .shop:
     🔪 Knife - 5,000 coins (30% success)
     🔫 Pistol - 15,000 coins (50% success)
     🔫 Rifle - 35,000 coins (70% success)
     🎯 Sniper - 75,000 coins (85% success)
     🚀 RPG - 150,000 coins (95% success)
```

## Strategia

### Quando Usare Ogni Arma

**Knife (30%)**:

- Economico per test
- Basso rischio economico
- Usa quando hai molti boost attivi

**Pistol (50%)**:

- Buon equilibrio prezzo/successo
- Ideale per uso quotidiano
- Con boost arriva a ~70%

**Rifle (70%)**:

- Alta probabilità
- Prezzo medio-alto
- Ottimo con boost (85%+)

**Sniper (85%)**:

- Quasi garantito
- Costoso ma efficace
- Con boost arriva a 98%

**RPG (95%)**:

- Massima probabilità
- Molto costoso
- Praticamente garantito con boost

### Massimizzare il Successo

1. **Accumula Boost**:
   - Compra Lucky Charm (25k) → +5%
   - Compra Mega Luck (75k) → +10%
   - Compra VIP (75k) → +3%
   - Totale: +18% extra

2. **Scegli l'Arma Giusta**:
   - Con boost: anche Pistol diventa efficace (68%)
   - Sniper + boost = 98% (quasi garantito)

3. **Timing**:
   - Usa armi costose quando hai boost attivi
   - Risparmia armi economiche per quando scadono

## Protezioni

### Non Puoi:

- ❌ Killare te stesso
- ❌ Killare senza armi
- ❌ Usare armi che non possiedi

### Limitazioni:

- Armi monouso (anche se fallisci)
- Mute solo 5 minuti (non permanente)
- Perdita coins limitata a 10k

## File Tecnici

### Dati Salvati

- `data/weapons.json` - Arsenale di ogni utente
- `data/muted_users.json` - Lista utenti mutati con scadenza

### Comandi Correlati

- `.shop` - Acquista armi
- `.kill` - Usa armi
- `.bank` - Controlla coins per acquisti

## Multilingua

Il comando supporta tutte le lingue del bot:

- 🇬🇧 English
- 🇮🇹 Italiano
- 🇷🇺 Русский
- 🇪🇸 Español
- 🇵🇹 Português
- 🇸🇦 العربية

## Note Importanti

⚠️ **Armi Monouso**: Una volta usata, l'arma sparisce anche se fallisci!

⚠️ **Mute Temporaneo**: Il mute dura solo 5 minuti, non è permanente.

⚠️ **Perdita Limitata**: La vittima perde max 10k coins, non tutto il saldo.

⚠️ **Effetto Foto**: Se la vittima non ha foto profilo, viene mostrato solo testo.

⚠️ **Boost Stackabili**: Tutti i boost si sommano per massimizzare il successo!

## Troubleshooting

### "You don't have any weapons"

→ Compra armi con `.shop buy <weapon>`

### "Invalid weapon"

→ Controlla lo spelling: knife, pistol, rifle, sniper, rpg

### "You cannot kill yourself"

→ Devi menzionare un altro utente

### Foto WASTED non appare

→ Normale se l'utente non ha foto profilo, viene mostrato solo testo

### Mute non funziona

→ Il bot deve essere admin per eliminare messaggi

---

**Sistema Completo e Funzionante!** 🎮

Divertiti con il sistema kill in stile GTA! 💀
