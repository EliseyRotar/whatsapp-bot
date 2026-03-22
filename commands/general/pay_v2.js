import { getGroupLanguage } from '../../utils/language.js';
import { transferCoins, getUserBalance } from '../../utils/databaseV2.js';
import { validateAmount, validateJid, ValidationError } from '../../utils/validation.js';
import * as logger from '../../utils/logger.js';
import * as analytics from '../../utils/analytics.js';

const responses = {
    en: {
        usage: '💸 PAY COMMAND\n\nTransfer coins to another user!\n\nUsage:\n• .pay @user <amount>\n• .pay <amount> (reply to a message)\n\nExample:\n• .pay @user 100\n• Reply to someone and type: .pay 100\n\nMin: 10 coins | Max: 1,000,000 coins',
        notEnough: '❌ Not enough coins!\n\n💵 Your balance: {balance} coins\n💰 You need: {amount} coins',
        invalidAmount: '❌ Invalid amount!\n\n💰 Min: 10 coins\n💰 Max: 1,000,000 coins',
        noRecipient: '❌ Please mention a user or reply to their message!',
        cannotPaySelf: '❌ You cannot pay yourself!',
        recipientNotFound: '❌ Recipient not found!',
        transferFailed: '❌ Transfer failed! Please try again.',
        success: '✅ PAYMENT SUCCESSFUL!\n\n💸 You sent {amount} coins to @{recipient}\n\n💵 Your new balance: {senderBalance} coins\n💰 Their new balance: {recipientBalance} coins',
        received: '💰 You received {amount} coins from @{sender}!\n\n💵 Your new balance: {balance} coins'
    },
    it: {
        usage: '💸 COMANDO PAGA\n\nTrasferisci monete ad un altro utente!\n\nUso:\n• .pay @utente <importo>\n• .pay <importo> (rispondi a un messaggio)\n\nEsempio:\n• .pay @utente 100\n• Rispondi a qualcuno e scrivi: .pay 100\n\nMin: 10 monete | Max: 1.000.000 monete',
        notEnough: '❌ Monete insufficienti!\n\n💵 Il tuo saldo: {balance} monete\n💰 Ti servono: {amount} monete',
        invalidAmount: '❌ Importo non valido!\n\n💰 Min: 10 monete\n💰 Max: 1.000.000 monete',
        noRecipient: '❌ Menziona un utente o rispondi al suo messaggio!',
        cannotPaySelf: '❌ Non puoi pagare te stesso!',
        recipientNotFound: '❌ Destinatario non trovato!',
        transferFailed: '❌ Trasferimento fallito! Riprova.',
        success: '✅ PAGAMENTO RIUSCITO!\n\n💸 Hai inviato {amount} monete a @{recipient}\n\n💵 Il tuo nuovo saldo: {senderBalance} monete\n💰 Il loro nuovo saldo: {recipientBalance} monete',
        received: '💰 Hai ricevuto {amount} monete da @{sender}!\n\n💵 Il tuo nuovo saldo: {balance} monete'
    }
};

export default {
    name: 'pay',
    execute: async (sock, msg, args) => {
        const startTime = Date.now();
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        try {
            if (args.length === 0) {
                await sock.sendMessage(from, { text: t.usage });
                return;
            }
            
            let recipient = null;
            let amount = 0;
            
            if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
                recipient = msg.message.extendedTextMessage.contextInfo.participant;
                amount = args[0];
            } else {
                const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
                if (mentioned && mentioned.length > 0) {
                    recipient = mentioned[0];
                    amount = args[1] || args[0];
                }
            }
            
            if (!recipient) {
                await sock.sendMessage(from, { text: t.noRecipient });
                return;
            }
            
            try {
                recipient = validateJid(recipient, 'recipient');
            } catch (error) {
                await sock.sendMessage(from, { text: t.recipientNotFound });
                return;
            }
            
            if (sender === recipient) {
                await sock.sendMessage(from, { text: t.cannotPaySelf });
                return;
            }
            
            try {
                amount = validateAmount(amount, 10, 1000000, 'amount');
            } catch (error) {
                await sock.sendMessage(from, { text: t.invalidAmount });
                return;
            }
            
            const senderBalance = getUserBalance(sender);
            if (senderBalance < amount) {
                const message = t.notEnough
                    .replace('{balance}', senderBalance)
                    .replace('{amount}', amount);
                await sock.sendMessage(from, { text: message });
                return;
            }
            
            const success = transferCoins(sender, recipient, amount, 'User payment');
            
            if (!success) {
                await sock.sendMessage(from, { text: t.transferFailed });
                return;
            }
            
            const newSenderBalance = getUserBalance(sender);
            const newRecipientBalance = getUserBalance(recipient);
            const recipientPhone = recipient.split('@')[0];
            
            const successMessage = t.success
                .replace('{amount}', amount)
                .replace('{recipient}', recipientPhone)
                .replace('{senderBalance}', newSenderBalance)
                .replace('{recipientBalance}', newRecipientBalance);
            
            await sock.sendMessage(from, { 
                text: successMessage,
                mentions: [recipient]
            });
            
            logger.info('Payment completed', {
                sender: sender.split('@')[0],
                recipient: recipientPhone,
                amount
            });
            
            analytics.trackCommand('pay', sender, from, Date.now() - startTime, true);
            
        } catch (error) {
            logger.error('Error in pay command', { error: error.message });
            await sock.sendMessage(from, { text: t.transferFailed });
        }
    }
};
