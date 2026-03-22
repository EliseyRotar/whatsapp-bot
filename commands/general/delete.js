import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        noReply: '❌ Please reply to a message to delete it.\n\nUsage: Reply to a message and type .delete\n\n💡 The bot can delete:\n• Its own messages\n• Messages in groups (if admin)',
        deleted: '✅ Message deleted!',
        error: '❌ Failed to delete message.',
        noPermission: 'Make sure:\n• The message is from the bot, OR\n• You are in a group\n• You are a group admin\n• The bot is a group admin\n• The message is less than 7 days old'
    },
    it: {
        noReply: '❌ Rispondi a un messaggio per eliminarlo.\n\nUso: Rispondi a un messaggio e digita .delete\n\n💡 Il bot può eliminare:\n• I propri messaggi\n• Messaggi nei gruppi (se admin)',
        deleted: '✅ Messaggio eliminato!',
        error: '❌ Impossibile eliminare il messaggio.',
        noPermission: 'Assicurati che:\n• Il messaggio sia del bot, OPPURE\n• Sei in un gruppo\n• Tu sia admin del gruppo\n• Il bot sia admin del gruppo\n• Il messaggio abbia meno di 7 giorni'
    },
    ru: {
        noReply: '❌ Пожалуйста, ответьте на сообщение, чтобы удалить его.\n\nИспользование: Ответьте на сообщение и напишите .delete\n\n💡 Бот может удалить:\n• Свои собственные сообщения\n• Сообщения в группах (если администратор)',
        deleted: '✅ Сообщение удалено!',
        error: '❌ Не удалось удалить сообщение.',
        noPermission: 'Убедитесь что:\n• Сообщение от бота, ИЛИ\n• Вы в группе\n• Вы администратор группы\n• Бот администратор группы\n• Сообщению меньше 7 дней'
    },
    es: {
        noReply: '❌ Por favor responde a un mensaje para eliminarlo.\n\nUso: Responde a un mensaje y escribe .delete\n\n💡 El bot puede eliminar:\n• Sus propios mensajes\n• Mensajes en grupos (si es admin)',
        deleted: '✅ ¡Mensaje eliminado!',
        error: '❌ Error al eliminar mensaje.',
        noPermission: 'Asegúrate de que:\n• El mensaje sea del bot, O\n• Estés en un grupo\n• Seas administrador del grupo\n• El bot sea administrador del grupo\n• El mensaje tenga menos de 7 días'
    },
    pt: {
        noReply: '❌ Por favor responda a uma mensagem para deletá-la.\n\nUso: Responda a uma mensagem e digite .delete\n\n💡 O bot pode deletar:\n• Suas próprias mensagens\n• Mensagens em grupos (se admin)',
        deleted: '✅ Mensagem deletada!',
        error: '❌ Falha ao deletar mensagem.',
        noPermission: 'Certifique-se de que:\n• A mensagem seja do bot, OU\n• Você está em um grupo\n• Você é administrador do grupo\n• O bot é administrador do grupo\n• A mensagem tem menos de 7 dias'
    },
    ar: {
        noReply: '❌ من فضلك رد على رسالة عشان تحذفها.\n\nالاستخدام: رد على رسالة واكتب .delete\n\n💡 البوت يقدر يحذف:\n• رسائله الخاصة\n• رسائل في الجروبات (لو أدمن)',
        deleted: '✅ الرسالة اتحذفت!',
        error: '❌ فشل في حذف الرسالة.',
        noPermission: 'تأكد من:\n• الرسالة من البوت، أو\n• إنك في جروب\n• إنك أدمن في الجروب\n• البوت أدمن في الجروب\n• الرسالة أقل من 7 أيام'
    },
    hi: {
        noReply: '❌ कृपया मैसेज को डिलीट करने के लिए उस पर रिप्लाई करें।\n\nउपयोग: मैसेज पर रिप्लाई करें और .delete टाइप करें\n\n💡 बॉट डिलीट कर सकता है:\n• अपने खुद के मैसेज\n• ग्रुप में मैसेज (अगर एडमिन है)',
        deleted: '✅ मैसेज डिलीट हो गया!',
        error: '❌ मैसेज डिलीट करने में विफल।',
        noPermission: 'सुनिश्चित करें:\n• मैसेज बॉट का है, या\n• आप ग्रुप में हैं\n• आप ग्रुप एडमिन हैं\n• बॉट ग्रुप एडमिन है\n• मैसेज 7 दिन से कम पुराना है'
    },
    ng: {
        noReply: '❌ Abeg reply to message make you fit delete am.\n\nHow to use: Reply to message and type .delete\n\n💡 Bot fit delete:\n• E own messages\n• Messages for group (if e be admin)',
        deleted: '✅ Message don delete!',
        error: '❌ E no work to delete message.',
        noPermission: 'Make sure say:\n• Na bot message, OR\n• You dey for group\n• You be group admin\n• Bot be group admin\n• Message no reach 7 days old'
    }
};

export default {
    name: 'delete',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        const quotedMsg = msg.message?.extendedTextMessage?.contextInfo;
        
        if (!quotedMsg || !quotedMsg.stanzaId) {
            return await sock.sendMessage(from, { text: t.noReply });
        }
        
        try {
            // Check if the quoted message is from the bot
            const isBotMessage = quotedMsg.fromMe === true;
            
            // In private chats, only bot's own messages can be deleted
            if (!isGroup && !isBotMessage) {
                const errorMsg = lang === 'it' 
                    ? '❌ Impossibile eliminare questo messaggio.\n\n💡 Il bot può eliminare solo:\n• I propri messaggi\n• Messaggi nei gruppi (se admin)\n\n⚠️ Non posso eliminare i tuoi messaggi in chat private - solo tu puoi farlo manualmente.'
                    : lang === 'ru'
                    ? '❌ Невозможно удалить это сообщение.\n\n💡 Бот может удалить только:\n• Свои собственные сообщения\n• Сообщения в группах (если администратор)\n\n⚠️ Я не могу удалить ваши сообщения в личных чатах - только вы можете сделать это вручную.'
                    : lang === 'es'
                    ? '❌ No se puede eliminar este mensaje.\n\n💡 El bot solo puede eliminar:\n• Sus propios mensajes\n• Mensajes en grupos (si es admin)\n\n⚠️ No puedo eliminar tus mensajes en chats privados - solo tú puedes hacerlo manualmente.'
                    : lang === 'pt'
                    ? '❌ Não é possível deletar esta mensagem.\n\n💡 O bot só pode deletar:\n• Suas próprias mensagens\n• Mensagens em grupos (se admin)\n\n⚠️ Não posso deletar suas mensagens em chats privados - apenas você pode fazer isso manualmente.'
                    : '❌ Cannot delete this message.\n\n💡 The bot can only delete:\n• Its own messages\n• Messages in groups (if admin)\n\n⚠️ I cannot delete your messages in private chats - only you can do that manually.';
                return await sock.sendMessage(from, { text: errorMsg });
            }
            
            // Construct the key for the message to delete
            const key = {
                remoteJid: from,
                id: quotedMsg.stanzaId,
                fromMe: isBotMessage
            };
            
            // Add participant for group messages
            if (isGroup && quotedMsg.participant) {
                key.participant = quotedMsg.participant;
            }
            
            console.log('[DELETE] Deleting message with key:', key);
            console.log('[DELETE] Is bot message:', isBotMessage);
            console.log('[DELETE] Is group:', isGroup);
            
            await sock.sendMessage(from, { delete: key });
            
            await sock.sendMessage(from, { text: t.deleted });
        } catch (error) {
            console.error('[DELETE] Error:', error.message);
            console.error('[DELETE] Stack:', error.stack);
            await sock.sendMessage(from, { 
                text: `${t.error}\n\n${t.noPermission}\n\nError: ${error.message}` 
            });
        }
    }
};
