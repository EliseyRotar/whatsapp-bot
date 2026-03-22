import * as logger from '../utils/logger.js';

// Auto-reject is OFF by default — use .autocall on/off to toggle
if (global.autoRejectCalls === undefined) {
    global.autoRejectCalls = false;
}

// Auto-reject call messages in all 8 supported languages
const rejectMessages = {
    en: `📵 I can't take WhatsApp calls right now.

Please reach me via:
📞 Direct phone call (not WhatsApp)
💬 Or wait for me to call you back

Thank you! 🙏`,
    it: `📵 Non posso rispondere alle chiamate WhatsApp in questo momento.

Contattami tramite:
📞 Chiamata telefonica diretta (non WhatsApp)
💬 Oppure aspetta che ti richiami

Grazie! 🙏`,
    ru: `📵 Я не могу принимать звонки WhatsApp прямо сейчас.

Свяжитесь со мной через:
📞 Прямой телефонный звонок (не WhatsApp)
💬 Или подождите, пока я перезвоню

Спасибо! 🙏`,
    es: `📵 No puedo atender llamadas de WhatsApp en este momento.

Contáctame por:
📞 Llamada telefónica directa (no WhatsApp)
💬 O espera a que te llame de vuelta

¡Gracias! 🙏`,
    pt: `📵 Não posso atender chamadas do WhatsApp agora.

Entre em contato por:
📞 Ligação telefônica direta (não WhatsApp)
💬 Ou aguarde meu retorno

Obrigado! 🙏`,
    ar: `📵 مش قادر أرد على مكالمات واتساب دلوقتي.

تواصل معايا عن طريق:
📞 مكالمة هاتفية مباشرة (مش واتساب)
💬 أو استنى لحد ما أرد عليك

شكراً! 🙏`,
    hi: `📵 मैं अभी WhatsApp कॉल नहीं उठा सकता।

मुझसे संपर्क करें:
📞 सीधे फोन कॉल से (WhatsApp नहीं)
💬 या मेरे वापस कॉल करने का इंतजार करें

धन्यवाद! 🙏`,
    ng: `📵 I no fit pick WhatsApp call right now.

Contact me through:
📞 Direct phone call (no be WhatsApp)
💬 Or wait make I call you back

Thank you! 🙏`
};

export function setupCallHandler(sock) {
    sock.ev.on('call', async (calls) => {
        for (const call of calls) {
            // Only handle incoming call offers (not rejections, timeouts, etc.)
            if (call.status !== 'offer') continue;

            // Feature is toggled off — do nothing
            if (!global.autoRejectCalls) continue;

            const callerId = call.from;
            const callId = call.id;
            const isVideo = call.isVideo;

            console.log(`[CALL] Incoming ${isVideo ? 'video' : 'voice'} call from ${callerId}, id: ${callId}`);

            try {
                // Reject the call immediately
                await sock.rejectCall(callId, callerId);
                console.log(`[CALL] Rejected call ${callId} from ${callerId}`);

                // Send the auto-reply message in the caller's chat
                // Use owner's language preference (default en) since this is a private chat
                const msg = rejectMessages.en;

                await sock.sendMessage(callerId, { text: msg });
                console.log(`[CALL] Sent auto-reply to ${callerId}`);

                logger.info(`[CALL] Auto-rejected ${isVideo ? 'video' : 'voice'} call from ${callerId}`);
            } catch (error) {
                console.error(`[CALL] Error handling call from ${callerId}:`, error.message);
                logger.error(`[CALL] Error rejecting call: ${error.message}`);

                // Even if reject fails, still try to send the message
                try {
                    await sock.sendMessage(callerId, { text: rejectMessages.en });
                } catch (msgError) {
                    console.error(`[CALL] Failed to send auto-reply:`, msgError.message);
                }
            }
        }
    });

    console.log('[CALL] Auto-reject call handler registered');
}
