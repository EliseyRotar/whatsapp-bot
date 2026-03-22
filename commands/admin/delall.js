import { getGroupLanguage } from '../../utils/language.js';
import { downloadMediaMessage } from '@whiskeysockets/baileys';

const responses = {
    en: {
        confirm: '⚠️ DELETE ALL MESSAGES FOR EVERYONE ⚠️\n\nThis will delete ALL messages in the chat for EVERYONE.\n\n⚠️ WARNING: This action cannot be undone!\n\nType: .delall confirm',
        clearing: '🗑️ Deleting all messages for everyone...\n\nThis may take a while...',
        progress: '🗑️ Deleted {count} messages...',
        success: '✅ Successfully deleted {count} messages for everyone!',
        partial: '⚠️ Partially completed.\n\n✅ Deleted: {deleted} messages\n❌ Failed: {failed} messages\n\nNote: Messages older than 7 days cannot be deleted.',
        failed: '❌ Failed to delete messages:',
        noMessages: '⚠️ No messages found to delete.',
        tooOld: '\n\n⚠️ Note: WhatsApp only allows deleting messages sent within the last 7 days.'
    },
    it: {
        confirm: '⚠️ ELIMINA TUTTI I MESSAGGI PER TUTTI ⚠️\n\nQuesto eliminerà TUTTI i messaggi nella chat per TUTTI.\n\n⚠️ ATTENZIONE: Questa azione non può essere annullata!\n\nScrivi: .delall confirm',
        clearing: '🗑️ Eliminazione di tutti i messaggi per tutti...\n\nPotrebbe richiedere del tempo...',
        progress: '🗑️ Eliminati {count} messaggi...',
        success: '✅ Eliminati con successo {count} messaggi per tutti!',
        partial: '⚠️ Completato parzialmente.\n\n✅ Eliminati: {deleted} messaggi\n❌ Falliti: {failed} messaggi\n\nNota: I messaggi più vecchi di 7 giorni non possono essere eliminati.',
        failed: '❌ Impossibile eliminare messaggi:',
        noMessages: '⚠️ Nessun messaggio trovato da eliminare.',
        tooOld: '\n\n⚠️ Nota: WhatsApp consente solo di eliminare messaggi inviati negli ultimi 7 giorni.'
    },
    ru: {
        confirm: '⚠️ УДАЛИТЬ ВСЕ СООБЩЕНИЯ ДЛЯ ВСЕХ ⚠️\n\nЭто удалит ВСЕ сообщения в чате для ВСЕХ.\n\n⚠️ ВНИМАНИЕ: Это действие нельзя отменить!\n\nНапишите: .delall confirm',
        clearing: '🗑️ Удаление всех сообщений для всех...\n\nЭто может занять некоторое время...',
        progress: '🗑️ Удалено {count} сообщений...',
        success: '✅ Успешно удалено {count} сообщений для всех!',
        partial: '⚠️ Частично завершено.\n\n✅ Удалено: {deleted} сообщений\n❌ Не удалось: {failed} сообщений\n\nПримечание: Сообщения старше 7 дней не могут быть удалены.',
        failed: '❌ Не удалось удалить сообщения:',
        noMessages: '⚠️ Сообщения для удаления не найдены.',
        tooOld: '\n\n⚠️ Примечание: WhatsApp позволяет удалять только сообщения, отправленные в течение последних 7 дней.'
    },
    es: {
        confirm: '⚠️ ELIMINAR TODOS LOS MENSAJES PARA TODOS ⚠️\n\nEsto eliminará TODOS los mensajes en el chat para TODOS.\n\n⚠️ ADVERTENCIA: ¡Esta acción no se puede deshacer!\n\nEscribe: .delall confirm',
        clearing: '🗑️ Eliminando todos los mensajes para todos...\n\nEsto puede tomar un tiempo...',
        progress: '🗑️ Eliminados {count} mensajes...',
        success: '✅ ¡Eliminados exitosamente {count} mensajes para todos!',
        partial: '⚠️ Completado parcialmente.\n\n✅ Eliminados: {deleted} mensajes\n❌ Fallidos: {failed} mensajes\n\nNota: Los mensajes de más de 7 días no se pueden eliminar.',
        failed: '❌ Error al eliminar mensajes:',
        noMessages: '⚠️ No se encontraron mensajes para eliminar.',
        tooOld: '\n\n⚠️ Nota: WhatsApp solo permite eliminar mensajes enviados en los últimos 7 días.'
    },
    pt: {
        confirm: '⚠️ DELETAR TODAS AS MENSAGENS PARA TODOS ⚠️\n\nIsso deletará TODAS as mensagens no chat para TODOS.\n\n⚠️ AVISO: Esta ação não pode ser desfeita!\n\nDigite: .delall confirm',
        clearing: '🗑️ Deletando todas as mensagens para todos...\n\nIsso pode levar algum tempo...',
        progress: '🗑️ Deletadas {count} mensagens...',
        success: '✅ Deletadas com sucesso {count} mensagens para todos!',
        partial: '⚠️ Parcialmente concluído.\n\n✅ Deletadas: {deleted} mensagens\n❌ Falhadas: {failed} mensagens\n\nNota: Mensagens com mais de 7 dias não podem ser deletadas.',
        failed: '❌ Falha ao deletar mensagens:',
        noMessages: '⚠️ Nenhuma mensagem encontrada para deletar.',
        tooOld: '\n\n⚠️ Nota: WhatsApp só permite deletar mensagens enviadas nos últimos 7 dias.'
    },
    ar: {
        confirm: '⚠️ حذف كل الرسائل للجميع ⚠️\n\nده هيحذف كل الرسائل في الشات للجميع.\n\n⚠️ تحذير: الإجراء ده مش ممكن التراجع عنه!\n\nاكتب: .delall confirm',
        clearing: '🗑️ بحذف كل الرسائل للجميع...\n\nده ممكن ياخد وقت...',
        progress: '🗑️ اتحذف {count} رسالة...',
        success: '✅ اتحذف بنجاح {count} رسالة للجميع!',
        partial: '⚠️ اكتمل جزئياً.\n\n✅ اتحذف: {deleted} رسالة\n❌ فشل: {failed} رسالة\n\nملاحظة: الرسائل الأقدم من 7 أيام مش ممكن حذفها.',
        failed: '❌ فشل في حذف الرسائل:',
        noMessages: '⚠️ مافيش رسائل للحذف.',
        tooOld: '\n\n⚠️ ملاحظة: واتساب بيسمح بحذف الرسائل المرسلة في آخر 7 أيام فقط.'
    },
    hi: {
        confirm: '⚠️ सभी के लिए सभी मैसेज डिलीट करें ⚠️\n\nयह चैट में सभी के लिए सभी मैसेज डिलीट कर देगा।\n\n⚠️ चेतावनी: यह एक्शन वापस नहीं किया जा सकता!\n\nटाइप करें: .delall confirm',
        clearing: '🗑️ सभी के लिए सभी मैसेज डिलीट हो रहे हैं...\n\nइसमें समय लग सकता है...',
        progress: '🗑️ {count} मैसेज डिलीट हो गए...',
        success: '✅ सफलतापूर्वक सभी के लिए {count} मैसेज डिलीट हो गए!',
        partial: '⚠️ आंशिक रूप से पूर्ण।\n\n✅ डिलीट: {deleted} मैसेज\n❌ विफल: {failed} मैसेज\n\nनोट: 7 दिन से पुराने मैसेज डिलीट नहीं किए जा सकते।',
        failed: '❌ मैसेज डिलीट करने में विफल:',
        noMessages: '⚠️ डिलीट करने के लिए कोई मैसेज नहीं मिला।',
        tooOld: '\n\n⚠️ नोट: व्हाट्सएप केवल पिछले 7 दिनों में भेजे गए मैसेज को डिलीट करने की अनुमति देता है।'
    },
    ng: {
        confirm: '⚠️ DELETE ALL MESSAGES FOR EVERYBODY ⚠️\n\nThis go delete ALL messages for chat for EVERYBODY.\n\n⚠️ WARNING: This action no fit reverse!\n\nType: .delall confirm',
        clearing: '🗑️ Dey delete all messages for everybody...\n\nE fit take time...',
        progress: '🗑️ Don delete {count} messages...',
        success: '✅ Successfully delete {count} messages for everybody!',
        partial: '⚠️ Partially complete.\n\n✅ Deleted: {deleted} messages\n❌ Failed: {failed} messages\n\nNote: Messages wey pass 7 days no fit delete.',
        failed: '❌ E no work to delete messages:',
        noMessages: '⚠️ No messages found to delete.',
        tooOld: '\n\n⚠️ Note: WhatsApp only allow to delete messages wey dem send for the last 7 days.'
    }
};

export default {
    name: 'delall',
    ownerOnly: true,
    groupOnly: true,
    botAdminRequired: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        try {
            // Confirmation required
            const confirmation = args[0]?.toLowerCase();
            
            if (confirmation !== 'confirm') {
                return await sock.sendMessage(from, {
                    text: t.confirm
                });
            }
            
            // Send initial message
            const statusMsg = await sock.sendMessage(from, {
                text: t.clearing
            });
            
            // Get messages from the store
            const messageStore = sock.messageStore;
            let deleted = 0;
            let failed = 0;
            const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
            
            console.log('[DELALL] Fetching messages from store...');
            
            if (!messageStore || !messageStore.messages || !messageStore.messages[from]) {
                await sock.sendMessage(from, {
                    text: t.noMessages + '\n\n⚠️ Message store not available. Bot needs to be restarted to enable message deletion.'
                });
                return;
            }
            
            // Get all stored messages for this chat
            const storedMessages = messageStore.messages[from];
            
            if (storedMessages.length === 0) {
                await sock.sendMessage(from, {
                    text: t.noMessages + '\n\n💡 Tip: The bot only stores messages it receives while running. Messages sent before the bot started cannot be deleted.'
                });
                return;
            }
            
            console.log(`[DELALL] Found ${storedMessages.length} messages in store`);
            
            // Filter messages within 7 days
            const messagesToDelete = storedMessages.filter(m => {
                const msgTime = (m.messageTimestamp || 0) * 1000;
                return msgTime > sevenDaysAgo;
            });
            
            console.log(`[DELALL] ${messagesToDelete.length} messages within 7 days`);
            
            if (messagesToDelete.length === 0) {
                await sock.sendMessage(from, {
                    text: t.noMessages + t.tooOld
                });
                return;
            }
            
            // Delete messages
            for (const message of messagesToDelete) {
                try {
                    // Delete message for everyone
                    await sock.sendMessage(from, {
                        delete: message.key
                    });
                    
                    deleted++;
                    
                    // Update progress every 10 messages
                    if (deleted % 10 === 0) {
                        await sock.sendMessage(from, {
                            text: t.progress.replace('{count}', deleted),
                            edit: statusMsg.key
                        }).catch(() => {});
                    }
                    
                    // ANTI-BAN: Increased delay to prevent rate limiting and bans
                    await new Promise(resolve => setTimeout(resolve, 1500)); // Increased from 100ms to 1500ms (1.5 seconds)
                    
                } catch (delError) {
                    failed++;
                    console.error('[DELALL] Error deleting message:', delError.message);
                }
            }
            
            // Send final result
            let resultText = deleted > 0 && failed === 0 
                ? t.success.replace('{count}', deleted)
                : t.partial.replace('{deleted}', deleted).replace('{failed}', failed);
            
            resultText += t.tooOld;
            
            await sock.sendMessage(from, {
                text: resultText
            });
            
        } catch (error) {
            console.error('[DELALL] Error:', error.message);
            console.error('[DELALL] Stack:', error.stack);
            
            await sock.sendMessage(from, {
                text: `${t.failed} ${error.message}`
            }).catch(err => console.error('[DELALL] Error sending error message:', err.message));
        }
    }
};
