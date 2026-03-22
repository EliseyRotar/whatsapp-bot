# .vv Command Fix - View Once Message Detection

## Problem

The `.vv` command was showing an error when trying to reveal view-once messages:

```
❌ Questo non è un messaggio visualizza una volta. Tipo messaggio: imageMessage
```

Console showed: `[VV] Quoted message type: [ 'imageMessage' ]`

## Root Cause

Based on research and analysis, the issue occurs because:

1. **View-once messages have a wrapper structure** when they're unopened:
   - `viewOnceMessage` or `viewOnceMessageV2` wrapper
   - Inside: `imageMessage` or `videoMessage`

2. **Once opened, the wrapper is removed** by WhatsApp:
   - The message structure changes from `viewOnceMessage` → `imageMessage`
   - All view-once indicators are stripped away
   - This happens when ANYONE opens it (including you on your phone)

3. **The bot cannot recover already-opened view-once messages**:
   - WhatsApp intentionally removes the wrapper after opening
   - No metadata remains to indicate it was view-once
   - The media keys may also be invalidated

## Solution Implemented

Updated `commands/general/vv.js` to:

1. **Detect unopened view-once messages** (original functionality)
   - Check for `viewOnceMessage`, `viewOnceMessageV2`, `viewOnceMessageV2Extension`
   - Extract and reveal the media

2. **Detect already-opened view-once messages**
   - Check for `viewOnce` property in `imageMessage` or `videoMessage`
   - If found, attempt to reveal (may still fail if keys expired)

3. **Provide clear error message** when message was already opened
   - Explains why it cannot be recovered
   - Suggests using `.autovv on` to auto-save future view-once messages

## New Error Messages

**English:**

```
⚠️ This view-once message was already opened.

Once a view-once message is opened by anyone (including you on your phone),
WhatsApp removes the view-once wrapper and it cannot be recovered.

💡 Tip: Use .autovv on to automatically save view-once messages before they're opened.
```

**Italian:**

```
⚠️ Questo messaggio visualizza una volta è già stato aperto.

Una volta che un messaggio visualizza una volta viene aperto da chiunque
(incluso te sul tuo telefono), WhatsApp rimuove il wrapper visualizza una
volta e non può essere recuperato.

💡 Suggerimento: Usa .autovv on per salvare automaticamente i messaggi
visualizza una volta prima che vengano aperti.
```

## Recommendation

**Use `.autovv on` command** to automatically save all incoming view-once messages BEFORE they're opened. This is the only reliable way to capture view-once media since the bot receives the message before you open it on your phone.

## Technical Details

Research sources indicate that WhatsApp's view-once feature has known privacy issues where the wrapper can be bypassed, but once the message is opened through normal means, the wrapper is permanently removed from the message structure. This is by design to prevent re-viewing.

The bot can only reveal view-once messages that:

- Have not been opened yet by anyone
- Still have the view-once wrapper intact
- Have valid media encryption keys (not expired)

## Testing

To test the fix:

1. Have someone send you a NEW view-once message
2. DO NOT open it on your phone
3. Reply to it with `.vv` in the bot
4. It should reveal the media

If you already opened it on your phone, you'll get the new error message explaining why it cannot be recovered.
