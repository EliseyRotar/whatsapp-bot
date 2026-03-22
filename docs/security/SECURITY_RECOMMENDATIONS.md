# 🛡️ SECURITY IMPLEMENTATION GUIDE

This guide provides step-by-step instructions to fix all identified security vulnerabilities.

---

## 🚀 QUICK START (Critical Fixes)

### Step 1: Install New Security Module

The new `utils/securityEnhancements.js` file has been created with:

- ✅ Integer overflow protection
- ✅ Cryptographically secure random numbers
- ✅ URL sanitization
- ✅ Path traversal prevention
- ✅ Global rate limiting
- ✅ Audit logging

**No installation needed** - it's ready to use!

---

## 🔧 IMPLEMENTATION STEPS

### 1. Fix Integer Overflow in Payment Commands

#### A. Update `commands/general/pay.js`

Replace lines 95-98 with:

```javascript
import { validateAmount, auditLog } from "../../utils/securityEnhancements.js";

// In execute function, replace amount validation:
const validation = validateAmount(parseInt(args[1] || args[0]), 10, 1000000000);

if (!validation.valid) {
  await sock.sendMessage(from, {
    text: `❌ ${validation.error}\n\n💰 Min: 10 coins\n💰 Max: 1,000,000,000 coins`,
  });
  return;
}

const amount = validation.amount;
```

#### B. Update `commands/games/mines.js`

Add at the top:

```javascript
import {
  validateAmount,
  safeMultiply,
  secureRandomInt,
} from "../../utils/securityEnhancements.js";
```

Replace bet validation (around line 540):

```javascript
const validation = validateAmount(parseInt(args[0]), 10, 1000000);
if (!validation.valid) {
  return await sock.sendMessage(from, {
    text: t.invalidBet + `\n\n${validation.error}`,
  });
}
const bet = validation.amount;
```

Replace multiplier calculation (around line 50):

```javascript
const multiplyResult = safeMultiply(bet, multiplier);
if (!multiplyResult.valid) {
  // Cap at maximum
  winAmount = MAX_COIN_AMOUNT;
} else {
  winAmount = multiplyResult.result;
}
```

Replace `Math.random()` (around line 65):

```javascript
// OLD: const pos = Math.floor(Math.random() * 25);
// NEW:
const pos = secureRandomInt(0, 25);
```

#### C. Update `commands/games/slot.js`

```javascript
import {
  validateAmount,
  secureRandomInt,
} from "../../utils/securityEnhancements.js";

// Replace bet validation
const validation = validateAmount(parseInt(args[0]), 10, 100000);
if (!validation.valid) {
  return await sock.sendMessage(from, { text: validation.error });
}

// Replace random generation
const reels = [
  secureRandomInt(0, symbols.length),
  secureRandomInt(0, symbols.length),
  secureRandomInt(0, symbols.length),
];
```

#### D. Update `commands/games/blackjack.js`

```javascript
import {
  validateAmount,
  secureShuffle,
} from "../../utils/securityEnhancements.js";

// Replace deck shuffling
function shuffleDeck(deck) {
  return secureShuffle(deck);
}
```

---

### 2. Fix Race Conditions in Database

#### Update `utils/databaseV2.js`

The `transferCoins()` function already uses transactions, but we need to ensure ALL balance operations use it.

Replace `addUserBalance` and `removeUserBalance` (lines 180-200):

```javascript
export function addUserBalance(jid, amount) {
  try {
    const add = db.transaction(() => {
      getUser(jid); // Ensure user exists
      const current = getUserBalance(jid);
      const newBalance = current + amount;

      // Check for overflow
      if (newBalance > MAX_COIN_AMOUNT || !Number.isSafeInteger(newBalance)) {
        throw new Error("Balance would exceed maximum");
      }

      db.prepare("UPDATE users SET balance = ? WHERE jid = ?").run(
        newBalance,
        jid,
      );
      return newBalance;
    });

    return add();
  } catch (error) {
    logger.error("[DB] Error adding balance:", error);
    return 0;
  }
}

export function removeUserBalance(jid, amount) {
  try {
    const remove = db.transaction(() => {
      getUser(jid); // Ensure user exists
      const current = getUserBalance(jid);

      // Check sufficient balance
      if (current < amount) {
        throw new Error("Insufficient balance");
      }

      db.prepare(
        "UPDATE users SET balance = MAX(0, balance - ?) WHERE jid = ?",
      ).run(amount, jid);
      return getUserBalance(jid);
    });

    return remove();
  } catch (error) {
    logger.error("[DB] Error removing balance:", error);
    return 0;
  }
}
```

---

### 3. Strengthen Owner Authentication

#### Update `utils/ownerManager.js`

Add cryptographic verification:

```javascript
import crypto from "crypto";
import { auditLog } from "./securityEnhancements.js";

// Generate secure token for additional owners
export function generateOwnerToken() {
  return crypto.randomBytes(32).toString("hex");
}

// Verify owner with token
export function verifyOwnerToken(userJid, token) {
  const owners = loadAdditionalOwners();
  const owner = owners.find((o) => o.jid === userJid);

  if (!owner || !owner.token) {
    return false;
  }

  // Constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(Buffer.from(owner.token), Buffer.from(token));
}

// Enhanced owner check with audit logging
export function isOwnerOrAdditional(
  sender,
  botJid,
  ownerNumber,
  ownerJid,
  fromMe,
) {
  const senderNumber = sender.split("@")[0].replace(/\\D/g, "");

  // Check main owner
  const isMainOwner =
    sender === ownerJid ||
    sender === botJid ||
    sender.includes(botJid.split("@")[0]) ||
    senderNumber === ownerNumber ||
    sender.includes(ownerNumber) ||
    fromMe;

  if (isMainOwner) {
    auditLog("OWNER_ACCESS", sender, { type: "main_owner" });
    return true;
  }

  // Check additional owners
  const isAdditional = isAdditionalOwner(sender, senderNumber);
  if (isAdditional) {
    auditLog("OWNER_ACCESS", sender, { type: "additional_owner" });
  }

  return isAdditional;
}
```

---

### 4. Implement Global Rate Limiting

#### Update `handlers/messageHandler.js`

Add after imports:

```javascript
import { isGloballyRateLimited } from "../utils/securityEnhancements.js";
```

Add before command execution (around line 150):

```javascript
// Global rate limit: 20 commands per minute per user
if (isGloballyRateLimited(sender, 20, 60000)) {
  console.log(`[RATE-LIMIT-GLOBAL] ${sender} exceeded global limit`);
  await sock.sendMessage(from, {
    text: "⏰ You're sending commands too fast! Please wait a minute.\n\n🔒 Global limit: 20 commands per minute",
  });
  return;
}
```

---

### 5. Sanitize URLs in Search Command

#### Update `commands/general/baida.js`

Add at top:

```javascript
import { safeEncodeURIComponent } from "../../utils/securityEnhancements.js";
```

Replace social media URL generation (around line 267):

```javascript
const platforms = [
  {
    name: "Twitter/X",
    url: `https://twitter.com/${safeEncodeURIComponent(target)}`,
  },
  {
    name: "Instagram",
    url: `https://instagram.com/${safeEncodeURIComponent(target)}`,
  },
  {
    name: "Facebook",
    url: `https://facebook.com/${safeEncodeURIComponent(target)}`,
  },
  {
    name: "LinkedIn",
    url: `https://linkedin.com/in/${safeEncodeURIComponent(target)}`,
  },
  {
    name: "TikTok",
    url: `https://tiktok.com/@${safeEncodeURIComponent(target)}`,
  },
  {
    name: "YouTube",
    url: `https://youtube.com/@${safeEncodeURIComponent(target)}`,
  },
  {
    name: "Reddit",
    url: `https://reddit.com/user/${safeEncodeURIComponent(target)}`,
  },
  { name: "Telegram", url: `https://t.me/${safeEncodeURIComponent(target)}` },
  {
    name: "Snapchat",
    url: `https://snapchat.com/add/${safeEncodeURIComponent(target)}`,
  },
  {
    name: "Pinterest",
    url: `https://pinterest.com/${safeEncodeURIComponent(target)}`,
  },
  {
    name: "Twitch",
    url: `https://twitch.tv/${safeEncodeURIComponent(target)}`,
  },
  {
    name: "Discord",
    url: `https://discord.com/users/${safeEncodeURIComponent(target)}`,
  },
];
```

---

### 6. Redact Sensitive Data from Logs

#### Update all command files

Add at top of each command file:

```javascript
import { redactSensitiveData } from "../../utils/securityEnhancements.js";
```

Replace console.log and logger calls:

```javascript
// OLD:
console.error("[COMMAND] Error:", error.message);

// NEW:
console.error("[COMMAND] Error:", redactSensitiveData(error.message));
```

---

### 7. Set Proper File Permissions

Run these commands in your terminal:

```bash
# Restrict data directory
chmod 700 data/
chmod 600 data/*.json
chmod 600 data/*.db

# Restrict config files
chmod 600 .env
chmod 600 config.js

# Restrict auth info
chmod 700 auth_info/
chmod 600 auth_info/*.json
```

---

### 8. Add Dependency Security Scanning

#### Install security tools:

```bash
npm install --save-dev snyk
npm audit
```

#### Add to package.json scripts:

```json
{
  "scripts": {
    "security-check": "npm audit && snyk test",
    "security-fix": "npm audit fix"
  }
}
```

#### Run weekly:

```bash
npm run security-check
```

---

## 📊 TESTING YOUR FIXES

### Test Integer Overflow Protection:

```bash
# Should fail gracefully:
.pay @user 999999999999999999999999
.mines 999999999999999999 5
.slot 999999999999999999
```

### Test Race Condition Fix:

```bash
# Send two payments simultaneously (should only process one):
.pay @user 100
.pay @user 100
# (send both within 1 second)
```

### Test Rate Limiting:

```bash
# Send 25 commands rapidly (should block after 20):
.ping (repeat 25 times quickly)
```

### Test URL Sanitization:

```bash
# Should encode properly:
.search test@user
.search ../../../etc/passwd
```

---

## 🔐 ADDITIONAL SECURITY MEASURES

### 1. Enable HTTPS for Web Dashboard

If you have a web dashboard, add:

```javascript
import https from "https";
import fs from "fs";

const options = {
  key: fs.readFileSync("path/to/private-key.pem"),
  cert: fs.readFileSync("path/to/certificate.pem"),
};

https.createServer(options, app).listen(443);
```

### 2. Add Security Headers

```javascript
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains",
  );
  next();
});
```

### 3. Implement Backup System

```bash
# Add to crontab (run daily at 2 AM):
0 2 * * * /path/to/backup-script.sh
```

Create `backup-script.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf "backups/backup_$DATE.tar.gz" data/ auth_info/ config.js
find backups/ -mtime +30 -delete  # Keep only 30 days
```

### 4. Monitor for Suspicious Activity

Add to your bot:

```javascript
// Track failed authentication attempts
const failedAttempts = new Map();

function trackFailedAuth(userId) {
  const attempts = failedAttempts.get(userId) || 0;
  failedAttempts.set(userId, attempts + 1);

  if (attempts > 5) {
    auditLog("SUSPICIOUS_ACTIVITY", userId, {
      type: "multiple_failed_auth",
      attempts,
    });
    // Consider temporary ban
  }
}
```

---

## ✅ VERIFICATION CHECKLIST

After implementing fixes, verify:

- [ ] All payment commands validate amounts properly
- [ ] Games use cryptographically secure random numbers
- [ ] Database operations use transactions
- [ ] Rate limiting works globally per user
- [ ] URLs are properly encoded
- [ ] Sensitive data is redacted from logs
- [ ] File permissions are restrictive (700/600)
- [ ] Audit logging is working
- [ ] No console.log with sensitive data
- [ ] Dependencies are up to date (npm audit)
- [ ] Backups are automated
- [ ] Error messages don't leak information

---

## 📞 SUPPORT

If you encounter issues implementing these fixes:

1. Check the error logs in `data/logs/`
2. Verify all imports are correct
3. Test each fix individually
4. Review the security audit report

---

## 🎯 PRIORITY TIMELINE

**Week 1 (Critical):**

- ✅ Integer overflow fixes
- ✅ Race condition fixes
- ✅ Input validation
- ✅ File permissions

**Week 2 (High):**

- Cryptographic RNG
- Global rate limiting
- URL sanitization
- Audit logging

**Week 3 (Medium):**

- Data encryption
- Dependency scanning
- Backup automation
- Monitoring

**Week 4 (Maintenance):**

- GDPR compliance
- Documentation
- Penetration testing
- Security training

---

**Last Updated:** March 8, 2026  
**Version:** 1.0  
**Maintainer:** Security Team
