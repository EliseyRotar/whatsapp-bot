import { getGroupLanguage } from '../../utils/language.js';
import { getBalance, transferCoins, hasEnough } from '../../utils/bank_SAFE.js';
import { validateAmount, auditLog } from '../../utils/core/securityEnhancements.js';

// Per-user pay cooldown: 30 seconds between payments
const payCooldowns = new Map();
const PAY_COOLDOWN_MS = 30000;

// Daily pay limit per user
const dailyPayCounts = new Map();
const DAILY_PAY_LIMIT = 20;

function getDailyKey(userId) {
    const today = new Date().toISOString().slice(0, 10);
    return `${userId}_${today}`;
}

function checkDailyLimit(userId) {
    const key = getDailyKey(userId);
    return (dailyPayCounts.get(key) || 0);
}

function incrementDailyCount(userId) {
    const key = getDailyKey(userId);
    dailyPayCounts.set(key, (dailyPayCounts.get(key) || 0) + 1);
}

const responses = {
    en: {
        usage: '💸 PAY COMMAND\n\nTransfer coins to another user!\n\nUsage:\n• .pay @user <amount>\n• .pay <amount> (reply to a message)\n\nExample:\n• .pay @user 100\n• Reply to someone and type: .pay 100\n\nMin: 10 coins | Max: 1,000,000 coins',
        notEnough: '❌ Not enough coins!\n\n💵 Your balance: {balance} coins\n💰 You need: {amount} coins',
        invalidAmount: '❌ Invalid amount!\n\n💰 Min: 10 coins\n💰 Max: 1.000.000.000.000.000.000 coins',
        noRecipient: '❌ Please mention a user or reply to their message!',
        cannotPaySelf: '❌ You cannot pay yourself!',
        success: '✅ PAYMENT SUCCESSFUL!\n\n💸 You sent {amount} coins to @{recipient}\n\n💵 Your new balance: {senderBalance} coins\n💰 Their new balance: {recipientBalance} coins',
        received: '💰 You received {amount} coins from @{sender}!\n\n💵 Your new balance: {balance} coins'
    },
    it: {
        usage: '💸 COMANDO PAGA\n\nTrasferisci monete ad un altro utente!\n\nUso:\n• .pay @utente <importo>\n• .pay <importo> (rispondi a un messaggio)\n\nEsempio:\n• .pay @utente 100\n• Rispondi a qualcuno e scrivi: .pay 100\n\nMin: 10 monete | Max: 1.000.000 monete',
        notEnough: '❌ Monete insufficienti!\n\n💵 Il tuo saldo: {balance} monete\n💰 Ti servono: {amount} monete',
        invalidAmount: '❌ Importo non valido!\n\n💰 Min: 10 monete\n💰 Max: 1.000.000.000.000.000.000 monete',
        noRecipient: '❌ Menziona un utente o rispondi al suo messaggio!',
        cannotPaySelf: '❌ Non puoi pagare te stesso!',
        success: '✅ PAGAMENTO RIUSCITO!\n\n💸 Hai inviato {amount} monete a @{recipient}\n\n💵 Il tuo nuovo saldo: {senderBalance} monete\n💰 Il loro nuovo saldo: {recipientBalance} monete',
        received: '💰 Hai ricevuto {amount} monete da @{sender}!\n\n💵 Il tuo nuovo saldo: {balance} monete'
    },
    ru: {
        usage: '💸 КОМАНДА ОПЛАТЫ\n\nПереведите монеты другому пользователю!\n\nИспользование:\n• .pay @пользователь <сумма>\n• .pay <сумма> (ответить на сообщение)\n\nПример:\n• .pay @пользователь 100\n• Ответьте кому-то и напишите: .pay 100\n\nМин: 10 монет | Макс: 1.000.000 монет',
        notEnough: '❌ Недостаточно монет!\n\n💵 Ваш баланс: {balance} монет\n💰 Вам нужно: {amount} монет',
        invalidAmount: '❌ Неверная сумма!\n\n💰 Мин: 10 монет\n💰 Макс: 1.000.000.000.000.000.000 монет',
        noRecipient: '❌ Упомяните пользователя или ответьте на его сообщение!',
        cannotPaySelf: '❌ Вы не можете платить себе!',
        success: '✅ ПЛАТЕЖ УСПЕШЕН!\n\n💸 Вы отправили {amount} монет @{recipient}\n\n💵 Ваш новый баланс: {senderBalance} монет\n💰 Их новый баланс: {recipientBalance} монет',
        received: '💰 Вы получили {amount} монет от @{sender}!\n\n💵 Ваш новый баланс: {balance} монет'
    },
    es: {
        usage: '💸 COMANDO PAGAR\n\n¡Transfiere monedas a otro usuario!\n\nUso:\n• .pay @usuario <cantidad>\n• .pay <cantidad> (responder a un mensaje)\n\nEjemplo:\n• .pay @usuario 100\n• Responde a alguien y escribe: .pay 100\n\nMín: 10 monedas | Máx: 1.000.000 monedas',
        notEnough: '❌ ¡No tienes suficientes monedas!\n\n💵 Tu saldo: {balance} monedas\n💰 Necesitas: {amount} monedas',
        invalidAmount: '❌ ¡Cantidad inválida!\n\n💰 Mín: 10 monedas\n💰 Máx: 1.000.000.000.000.000.000 monedas',
        noRecipient: '❌ ¡Menciona a un usuario o responde a su mensaje!',
        cannotPaySelf: '❌ ¡No puedes pagarte a ti mismo!',
        success: '✅ ¡PAGO EXITOSO!\n\n💸 Enviaste {amount} monedas a @{recipient}\n\n💵 Tu nuevo saldo: {senderBalance} monedas\n💰 Su nuevo saldo: {recipientBalance} monedas',
        received: '💰 ¡Recibiste {amount} monedas de @{sender}!\n\n💵 Tu nuevo saldo: {balance} monedas'
    },
    pt: {
        usage: '💸 COMANDO PAGAR\n\nTransfira moedas para outro usuário!\n\nUso:\n• .pay @usuário <quantidade>\n• .pay <quantidade> (responder a uma mensagem)\n\nExemplo:\n• .pay @usuário 100\n• Responda alguém e digite: .pay 100\n\nMín: 10 moedas | Máx: 1.000.000 moedas',
        notEnough: '❌ Moedas insuficientes!\n\n💵 Seu saldo: {balance} moedas\n💰 Você precisa: {amount} moedas',
        invalidAmount: '❌ Quantidade inválida!\n\n💰 Mín: 10 moedas\n💰 Máx: 1.000.000.000.000.000.000 moedas',
        noRecipient: '❌ Mencione um usuário ou responda à mensagem dele!',
        cannotPaySelf: '❌ Você não pode pagar a si mesmo!',
        success: '✅ PAGAMENTO BEM-SUCEDIDO!\n\n💸 Você enviou {amount} moedas para @{recipient}\n\n💵 Seu novo saldo: {senderBalance} moedas\n💰 Novo saldo dele: {recipientBalance} moedas',
        received: '💰 Você recebeu {amount} moedas de @{sender}!\n\n💵 Seu novo saldo: {balance} moedas'
    },
    ar: {
        usage: '💸 أمر الدفع\n\nانقل العملات إلى مستخدم آخر!\n\nالاستخدام:\n• .pay @مستخدم <المبلغ>\n• .pay <المبلغ> (الرد على رسالة)\n\nمثال:\n• .pay @مستخدم 100\n• رد على شخص واكتب: .pay 100\n\nالحد الأدنى: 10 عملات | الحد الأقصى: 1.000.000 عملة',
        notEnough: '❌ عملات غير كافية!\n\n💵 رصيدك: {balance} عملة\n💰 تحتاج: {amount} عملة',
        invalidAmount: '❌ مبلغ غير صالح!\n\n💰 الحد الأدنى: 10 عملات\n💰 الحد الأقصى: 1.000.000.000.000.000.000 عملة',
        noRecipient: '❌ اذكر مستخدم أو رد على رسالته!',
        cannotPaySelf: '❌ لا يمكنك الدفع لنفسك!',
        success: '✅ الدفع ناجح!\n\n💸 أرسلت {amount} عملة إلى @{recipient}\n\n💵 رصيدك الجديد: {senderBalance} عملة\n💰 رصيدهم الجديد: {recipientBalance} عملة',
        received: '💰 استلمت {amount} عملة من @{sender}!\n\n💵 رصيدك الجديد: {balance} عملة'
    },
    hi: {
        usage: '💸 पे कमांड\n\nदूसरे यूज़र को कॉइन ट्रांसफर करें!\n\nउपयोग:\n• .pay @यूज़र <राशि>\n• .pay <राशि> (मैसेज पर रिप्लाई करें)\n\nउदाहरण:\n• .pay @यूज़र 100\n• किसी को रिप्लाई करें और टाइप करें: .pay 100\n\nन्यूनतम: 10 कॉइन | अधिकतम: 1,000,000 कॉइन',
        notEnough: '❌ पर्याप्त कॉइन नहीं!\n\n💵 आपका बैलेंस: {balance} कॉइन\n💰 आपको चाहिए: {amount} कॉइन',
        invalidAmount: '❌ अमान्य राशि!\n\n💰 न्यूनतम: 10 कॉइन\n💰 अधिकतम: 1,000,000,000,000,000,000 कॉइन',
        noRecipient: '❌ कृपया किसी यूज़र का मेंशन करें या उनके मैसेज पर रिप्लाई करें!',
        cannotPaySelf: '❌ आप खुद को पेमेंट नहीं कर सकते!',
        success: '✅ पेमेंट सफल!\n\n💸 आपने @{recipient} को {amount} कॉइन भेजे\n\n💵 आपका नया बैलेंस: {senderBalance} कॉइन\n💰 उनका नया बैलेंस: {recipientBalance} कॉइन',
        received: '💰 आपको @{sender} से {amount} कॉइन मिले!\n\n💵 आपका नया बैलेंस: {balance} कॉइन'
    },
    ng: {
        usage: '💸 PAY COMMAND\n\nSend coins to another person!\n\nHow to use:\n• .pay @user <amount>\n• .pay <amount> (reply to message)\n\nExample:\n• .pay @user 100\n• Reply to person and type: .pay 100\n\nMin: 10 coins | Max: 1,000,000 coins',
        notEnough: '❌ Your coins no reach!\n\n💵 Your balance: {balance} coins\n💰 You need: {amount} coins',
        invalidAmount: '❌ Dat amount no correct!\n\n💰 Min: 10 coins\n💰 Max: 1,000,000,000,000,000,000 coins',
        noRecipient: '❌ Abeg mention person or reply their message!',
        cannotPaySelf: '❌ You no fit pay yourself!',
        success: '✅ PAYMENT DON WORK!\n\n💸 You send {amount} coins to @{recipient}\n\n💵 Your new balance: {senderBalance} coins\n💰 Their new balance: {recipientBalance} coins',
        received: '💰 You receive {amount} coins from @{sender}!\n\n💵 Your new balance: {balance} coins'
    }
};

export default {
    name: 'pay',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        // Show usage if no args
        if (args.length === 0) {
            await sock.sendMessage(from, { text: t.usage });
            return;
        }
        
        let recipient = null;
        let amount = 0;
        
        // Check if replying to a message
        if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
            recipient = msg.message.extendedTextMessage.contextInfo.participant;
            amount = parseInt(args[0]);
        } else if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
            recipient = msg.message.extendedTextMessage.contextInfo.participant;
            amount = parseInt(args[0]);
        } else {
            // Check for mentioned user
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            if (mentioned && mentioned.length > 0) {
                recipient = mentioned[0];
                amount = parseInt(args[1] || args[0]);
            }
        }
        
        // Validate recipient
        if (!recipient) {
            await sock.sendMessage(from, { text: t.noRecipient });
            return;
        }
        
        // Cannot pay self
        if (recipient === sender) {
            await sock.sendMessage(from, { text: t.cannotPaySelf });
            return;
        }
        
        // Validate amount with overflow protection
        const validation = validateAmount(amount, 10, 1000000000);
        if (!validation.valid) {
            await sock.sendMessage(from, { 
                text: `❌ ${validation.error}\n\n💰 Min: 10 coins\n💰 Max: 1,000,000,000 coins`
            });
            return;
        }
        amount = validation.amount;
        
        // Check cooldown
        const now = Date.now();
        const senderId = sender.split('@')[0];
        const lastPay = payCooldowns.get(senderId);
        if (lastPay && (now - lastPay) < PAY_COOLDOWN_MS) {
            const remaining = Math.ceil((PAY_COOLDOWN_MS - (now - lastPay)) / 1000);
            await sock.sendMessage(from, {
                text: `⏳ Wait ${remaining}s before sending another payment!`
            });
            return;
        }

        // Check daily limit
        const dailyCount = checkDailyLimit(senderId);
        if (dailyCount >= DAILY_PAY_LIMIT) {
            await sock.sendMessage(from, {
                text: `❌ Daily payment limit reached (${DAILY_PAY_LIMIT}/day). Try again tomorrow!`
            });
            return;
        }

        // Check if sender has enough
        const senderBalance = await getBalance(sender);
        if (!(await hasEnough(sender, amount))) {
            await sock.sendMessage(from, {
                text: t.notEnough
                    .replace('{balance}', senderBalance)
                    .replace('{amount}', amount)
            });
            return;
        }
        
        try {
            // Process payment atomically using transferCoins (prevents farming exploit)
            const result = await transferCoins(sender, recipient, amount);
            const newSenderBalance = result.fromBalance;
            const newRecipientBalance = result.toBalance;

            // Update cooldown and daily count
            payCooldowns.set(senderId, now);
            incrementDailyCount(senderId);
            
            // Audit log for large transactions
            if (amount >= 100000) {
                auditLog('LARGE_PAYMENT', sender, { 
                    amount, 
                    recipient: recipient.split('@')[0],
                    balance: newSenderBalance 
                });
            }
            
            // Get recipient name
            const recipientName = recipient.split('@')[0];
            const senderName = sender.split('@')[0];
            
            // Send success message
            await sock.sendMessage(from, {
                text: t.success
                    .replace('{amount}', amount)
                    .replace('{recipient}', recipientName)
                    .replace('{senderBalance}', newSenderBalance)
                    .replace('{recipientBalance}', newRecipientBalance),
                mentions: [recipient]
            });
        } catch (error) {
            console.error('[PAY] Error processing payment:', error.message);
            await sock.sendMessage(from, {
                text: '❌ Payment failed. Please try again.'
            });
        }
    }
};
