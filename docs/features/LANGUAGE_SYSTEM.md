# 🌍 Multi-Language System

The bot now supports per-group language settings!

## How It Works

1. **Set Language Per Group**
   - Each group can have its own language (English or Italian)
   - Settings are saved in `data/group_languages.json`
   - Persists across bot restarts

2. **Command to Set Language**

   ```
   .setlang en    → Set to English
   .setlang it    → Set to Italian
   .setlang       → Show current language
   ```

3. **Default Language**
   - If no language is set, defaults to English
   - Private chats use English by default

## For You: Translation Options

You have **50+ commands** to translate. Here are your options:

### Option 1: Translate All Commands (HUGE TASK)

- I translate every single command to Italian
- Estimated time: 2-3 hours
- Commands: ping, alive, menu, sticker, delete, vv, ban, kick, promote, demote, mute, tagall, tagnotadmin, hidetag, antilink, welcome, setgname, setgdesc, resetlink, groupinfo, staff, warn, warnings, mode, spam, broadcast, debug, autovv, raid, addowner, removeowner, listowners, 8ball, dice, coinflip, rps, guess, trivia, slot, math, omegle, info, checkowner, games, delall, setlang

### Option 2: Translate Only Important Commands (RECOMMENDED)

I translate just the most-used commands:

- ✅ menu / menuita (already done)
- ✅ info / infoita (already done)
- ✅ ping
- ✅ alive
- ✅ help messages (errors, permissions)
- ✅ kick, ban, warn
- ✅ tagall, hidetag
- ✅ setlang

### Option 3: Keep Dual Commands (CURRENT)

- Keep separate .menu and .menuita
- Keep separate .info and .infoita
- Users choose which command to use
- No automatic translation needed

## How to Make a Command Bilingual

Here's the pattern for any command:

```javascript
import { getGroupLanguage } from "../../utils/language.js";

const responses = {
  en: {
    success: "✅ Success!",
    error: "❌ Error:",
    usage: "Usage: .command <args>",
  },
  it: {
    success: "✅ Successo!",
    error: "❌ Errore:",
    usage: "Uso: .command <args>",
  },
};

export default {
  name: "command",
  execute: async (sock, msg, args) => {
    const from = msg.key.remoteJid;
    const lang = getGroupLanguage(from);
    const t = responses[lang] || responses.en;

    // Use t.success, t.error, t.usage in your code
    await sock.sendMessage(from, { text: t.success });
  },
};
```

## Current Status

✅ **Implemented:**

- Language system (utils/language.js)
- .setlang command
- Persistent storage
- Per-group settings

❌ **Not Yet Done:**

- Individual command translations (waiting for your decision)

## What Do You Want?

**Choose one:**

**A) Translate ALL commands** (I'll do it, but it's a lot of work)

- Every command responds in the group's language
- Consistent experience
- Takes time

**B) Translate ONLY important commands** (Recommended)

- Core commands in both languages
- Less work, still good UX
- Games/fun commands stay English

**C) Keep current system** (Easiest)

- .menu and .menuita
- .info and .infoita
- Users choose which to use

Let me know which option you prefer!
