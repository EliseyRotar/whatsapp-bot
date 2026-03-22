import { getWarnings, clearWarnings, loadWarnings, saveWarnings } from '../../utils/database.js';
import { config } from '../../config.js';
import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        clearNoUser: '❌ Please mention or reply to a user to clear their warnings.\n\nUsage:\n• .warnings clear @user\n• .warnings clear all - Clear everyone\'s warnings',
        cleared: '✅ Cleared all warnings for @{user}',
        clearFailed: '❌ Failed to clear warnings. Please try again.',
        checkNoUser: '❌ Please mention or reply to a user to check their warnings.\n\nUsage:\n• .warnings @user - Check warnings\n• .warnings check @user - Check warnings\n• .warnings clear @user - Clear warnings\n• .warnings clear all - Clear all warnings',
        noWarnings: '✅ @{user} has no warnings.',
        title: '⚠️ WARNINGS FOR @{user}\n\n',
        total: 'Total Warnings:',
        lastWarned: 'Last Warned:',
        history: '📋 Warning History:\n',
        error: '❌ An error occurred while checking warnings. Please try again.',
        clearAllConfirm: '⚠️ Are you sure you want to clear ALL warnings for ALL members?\n\nThis action cannot be undone.\n\nType: .warnings clear all confirm',
        clearAllSuccess: '✅ Successfully cleared all warnings for {count} member(s).',
        clearAllFailed: '❌ Failed to clear all warnings. Please try again.'
    },
    it: {
        clearNoUser: '❌ Menziona o rispondi a un utente per cancellare i suoi avvisi.\n\nUso:\n• .warnings clear @utente\n• .warnings clear all - Cancella avvisi di tutti',
        cleared: '✅ Cancellati tutti gli avvisi per @{user}',
        clearFailed: '❌ Impossibile cancellare avvisi. Riprova.',
        checkNoUser: '❌ Menziona o rispondi a un utente per controllare i suoi avvisi.\n\nUso:\n• .warnings @utente - Controlla avvisi\n• .warnings check @utente - Controlla avvisi\n• .warnings clear @utente - Cancella avvisi\n• .warnings clear all - Cancella tutti gli avvisi',
        noWarnings: '✅ @{user} non ha avvisi.',
        title: '⚠️ AVVISI PER @{user}\n\n',
        total: 'Avvisi Totali:',
        lastWarned: 'Ultimo Avviso:',
        history: '📋 Cronologia Avvisi:\n',
        error: '❌ Si è verificato un errore durante il controllo degli avvisi. Riprova.',
        clearAllConfirm: '⚠️ Sei sicuro di voler cancellare TUTTI gli avvisi per TUTTI i membri?\n\nQuesta azione non può essere annullata.\n\nScrivi: .warnings clear all confirm',
        clearAllSuccess: '✅ Cancellati con successo tutti gli avvisi per {count} membro/i.',
        clearAllFailed: '❌ Impossibile cancellare tutti gli avvisi. Riprova.'
    },
    ru: {
        clearNoUser: '❌ Пожалуйста, упомяните или ответьте пользователю, чтобы очистить его предупреждения.\n\nИспользование:\n• .warnings clear @пользователь\n• .warnings clear all - Очистить предупреждения всех',
        cleared: '✅ Все предупреждения для @{user} очищены',
        clearFailed: '❌ Не удалось очистить предупреждения. Попробуйте снова.',
        checkNoUser: '❌ Пожалуйста, упомяните или ответьте пользователю, чтобы проверить его предупреждения.\n\nИспользование:\n• .warnings @пользователь - Проверить предупреждения\n• .warnings check @пользователь - Проверить предупреждения\n• .warnings clear @пользователь - Очистить предупреждения\n• .warnings clear all - Очистить все предупреждения',
        noWarnings: '✅ У @{user} нет предупреждений.',
        title: '⚠️ ПРЕДУПРЕЖДЕНИЯ ДЛЯ @{user}\n\n',
        total: 'Всего предупреждений:',
        lastWarned: 'Последнее предупреждение:',
        history: '📋 История предупреждений:\n',
        error: '❌ Произошла ошибка при проверке предупреждений. Попробуйте снова.',
        clearAllConfirm: '⚠️ Вы уверены, что хотите очистить ВСЕ предупреждения для ВСЕХ участников?\n\nЭто действие нельзя отменить.\n\nНапишите: .warnings clear all confirm',
        clearAllSuccess: '✅ Успешно очищены все предупреждения для {count} участник(ов).',
        clearAllFailed: '❌ Не удалось очистить все предупреждения. Попробуйте снова.'
    },
    es: {
        clearNoUser: '❌ Por favor menciona o responde a un usuario para limpiar sus advertencias.\n\nUso:\n• .warnings clear @usuario\n• .warnings clear all - Limpiar advertencias de todos',
        cleared: '✅ Todas las advertencias para @{user} han sido limpiadas',
        clearFailed: '❌ Error al limpiar advertencias. Por favor intenta de nuevo.',
        checkNoUser: '❌ Por favor menciona o responde a un usuario para verificar sus advertencias.\n\nUso:\n• .warnings @usuario - Verificar advertencias\n• .warnings check @usuario - Verificar advertencias\n• .warnings clear @usuario - Limpiar advertencias\n• .warnings clear all - Limpiar todas las advertencias',
        noWarnings: '✅ @{user} no tiene advertencias.',
        title: '⚠️ ADVERTENCIAS PARA @{user}\n\n',
        total: 'Total de Advertencias:',
        lastWarned: 'Última Advertencia:',
        history: '📋 Historial de Advertencias:\n',
        error: '❌ Ocurrió un error al verificar las advertencias. Por favor intenta de nuevo.',
        clearAllConfirm: '⚠️ ¿Estás seguro de que quieres limpiar TODAS las advertencias para TODOS los miembros?\n\nEsta acción no se puede deshacer.\n\nEscribe: .warnings clear all confirm',
        clearAllSuccess: '✅ Se limpiaron exitosamente todas las advertencias para {count} miembro(s).',
        clearAllFailed: '❌ Error al limpiar todas las advertencias. Por favor intenta de nuevo.'
    },
    pt: {
        clearNoUser: '❌ Por favor mencione ou responda a um usuário para limpar suas advertências.\n\nUso:\n• .warnings clear @usuário\n• .warnings clear all - Limpar advertências de todos',
        cleared: '✅ Todas as advertências para @{user} foram limpas',
        clearFailed: '❌ Falha ao limpar advertências. Por favor tente novamente.',
        checkNoUser: '❌ Por favor mencione ou responda a um usuário para verificar suas advertências.\n\nUso:\n• .warnings @usuário - Verificar advertências\n• .warnings check @usuário - Verificar advertências\n• .warnings clear @usuário - Limpar advertências\n• .warnings clear all - Limpar todas as advertências',
        noWarnings: '✅ @{user} não tem advertências.',
        title: '⚠️ ADVERTÊNCIAS PARA @{user}\n\n',
        total: 'Total de Advertências:',
        lastWarned: 'Última Advertência:',
        history: '📋 Histórico de Advertências:\n',
        error: '❌ Ocorreu um erro ao verificar as advertências. Por favor tente novamente.',
        clearAllConfirm: '⚠️ Tem certeza de que deseja limpar TODAS as advertências para TODOS os membros?\n\nEsta ação não pode ser desfeita.\n\nDigite: .warnings clear all confirm',
        clearAllSuccess: '✅ Todas as advertências foram limpas com sucesso para {count} membro(s).',
        clearAllFailed: '❌ Falha ao limpar todas as advertências. Por favor tente novamente.'
    },
    ar: {
        clearNoUser: '❌ من فضلك اعمل منشن أو رد على مستخدم عشان تمسح تحذيراته.\n\nالاستخدام:\n• .warnings clear @مستخدم\n• .warnings clear all - امسح تحذيرات الكل',
        cleared: '✅ كل التحذيرات لـ @{user} اتمسحت',
        clearFailed: '❌ فشل في مسح التحذيرات. حاول تاني.',
        checkNoUser: '❌ من فضلك اعمل منشن أو رد على مستخدم عشان تشوف تحذيراته.\n\nالاستخدام:\n• .warnings @مستخدم - شوف التحذيرات\n• .warnings check @مستخدم - شوف التحذيرات\n• .warnings clear @مستخدم - امسح التحذيرات\n• .warnings clear all - امسح كل التحذيرات',
        noWarnings: '✅ @{user} مالوش تحذيرات.',
        title: '⚠️ تحذيرات لـ @{user}\n\n',
        total: 'إجمالي التحذيرات:',
        lastWarned: 'آخر تحذير:',
        history: '📋 سجل التحذيرات:\n',
        error: '❌ حصل خطأ أثناء التحقق من التحذيرات. حاول تاني.',
        clearAllConfirm: '⚠️ متأكد إنك عايز تمسح كل التحذيرات لكل الأعضاء؟\n\nالإجراء ده مش ممكن يترجع.\n\nاكتب: .warnings clear all confirm',
        clearAllSuccess: '✅ كل التحذيرات اتمسحت بنجاح لـ {count} عضو.',
        clearAllFailed: '❌ فشل في مسح كل التحذيرات. حاول تاني.'
    },
    hi: {
        clearNoUser: '❌ कृपया चेतावनी साफ़ करने के लिए यूज़र का मेंशन करें या रिप्लाई करें।\n\nउपयोग:\n• .warnings clear @यूज़र\n• .warnings clear all - सभी की चेतावनी साफ़ करें',
        cleared: '✅ @{user} की सभी चेतावनी साफ़ कर दी गई',
        clearFailed: '❌ चेतावनी साफ़ करने में विफल। कृपया पुनः प्रयास करें।',
        checkNoUser: '❌ कृपया चेतावनी चेक करने के लिए यूज़र का मेंशन करें या रिप्लाई करें।\n\nउपयोग:\n• .warnings @यूज़र - चेतावनी चेक करें\n• .warnings check @यूज़र - चेतावनी चेक करें\n• .warnings clear @यूज़र - चेतावनी साफ़ करें\n• .warnings clear all - सभी चेतावनी साफ़ करें',
        noWarnings: '✅ @{user} की कोई चेतावनी नहीं है।',
        title: '⚠️ @{user} की चेतावनी\n\n',
        total: 'कुल चेतावनी:',
        lastWarned: 'अंतिम चेतावनी:',
        history: '📋 चेतावनी इतिहास:\n',
        error: '❌ चेतावनी चेक करते समय त्रुटि हुई। कृपया पुनः प्रयास करें।',
        clearAllConfirm: '⚠️ क्या आप सभी सदस्यों की सभी चेतावनी साफ़ करना चाहते हैं?\n\nयह एक्शन वापस नहीं किया जा सकता।\n\nटाइप करें: .warnings clear all confirm',
        clearAllSuccess: '✅ {count} सदस्यों की सभी चेतावनी सफलतापूर्वक साफ़ कर दी गई।',
        clearAllFailed: '❌ सभी चेतावनी साफ़ करने में विफल। कृपया पुनः प्रयास करें।'
    },
    ng: {
        clearNoUser: '❌ Abeg mention or reply the user wey you wan clear im warnings.\n\nHow to use am:\n• .warnings clear @user\n• .warnings clear all - Clear everybody warnings',
        cleared: '✅ All warnings for @{user} don clear finish',
        clearFailed: '❌ E no work to clear warnings. Abeg try again.',
        checkNoUser: '❌ Abeg mention or reply the user wey you wan check im warnings.\n\nHow to use am:\n• .warnings @user - Check warnings\n• .warnings check @user - Check warnings\n• .warnings clear @user - Clear warnings\n• .warnings clear all - Clear all warnings',
        noWarnings: '✅ @{user} no get any warning.',
        title: '⚠️ WARNINGS FOR @{user}\n\n',
        total: 'Total Warnings:',
        lastWarned: 'Last Warning:',
        history: '📋 Warning History:\n',
        error: '❌ Wahala happen when we dey check warnings. Abeg try again.',
        clearAllConfirm: '⚠️ You sure say you wan clear ALL warnings for ALL members?\n\nThis thing no fit reverse o.\n\nType: .warnings clear all confirm',
        clearAllSuccess: '✅ All warnings for {count} member(s) don clear successfully.',
        clearAllFailed: '❌ E no work to clear all warnings. Abeg try again.'
    }
};

export default {
    name: 'warnings',
    adminOnly: true,
    groupOnly: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        try {
            // Check for 'clear' subcommand
            if (args[0] === 'clear') {
                // Check for 'clear all' subcommand
                if (args[1] === 'all') {
                    // Require confirmation
                    if (args[2] !== 'confirm') {
                        return await sock.sendMessage(from, { 
                            text: t.clearAllConfirm
                        });
                    }
                    
                    // Clear all warnings for this group
                    try {
                        const warnings = loadWarnings();
                        let clearedCount = 0;
                        
                        // Find and delete all warnings for this group
                        for (const key in warnings) {
                            if (key.startsWith(from + '_')) {
                                delete warnings[key];
                                clearedCount++;
                            }
                        }
                        
                        saveWarnings(warnings);
                        
                        await sock.sendMessage(from, { 
                            text: t.clearAllSuccess.replace('{count}', clearedCount)
                        });
                    } catch (error) {
                        console.error('[WARNINGS] Error clearing all warnings:', error.message);
                        await sock.sendMessage(from, { 
                            text: t.clearAllFailed
                        });
                    }
                    return;
                }
                
                // Clear specific user warnings
                const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
                const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
                const targetUser = mentioned || quoted;
                
                if (!targetUser) {
                    return await sock.sendMessage(from, { 
                        text: t.clearNoUser
                    });
                }
                
                const success = clearWarnings(from, targetUser);
                
                if (success) {
                    await sock.sendMessage(from, { 
                        text: t.cleared.replace('{user}', targetUser.split('@')[0]),
                        mentions: [targetUser]
                    });
                } else {
                    await sock.sendMessage(from, { 
                        text: t.clearFailed
                    });
                }
                return;
            }
            
            // Check for 'check' subcommand (optional, same as default)
            if (args[0] === 'check') {
                args.shift(); // Remove 'check' from args
            }
            
            // Check specific user warnings
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
            const targetUser = mentioned || quoted;
            
            if (!targetUser) {
                return await sock.sendMessage(from, { 
                    text: t.checkNoUser
                });
            }
            
            const userWarnings = getWarnings(from, targetUser);
            
            if (userWarnings.count === 0) {
                return await sock.sendMessage(from, { 
                    text: t.noWarnings.replace('{user}', targetUser.split('@')[0]),
                    mentions: [targetUser]
                });
            }
            
            let warningMsg = t.title.replace('{user}', targetUser.split('@')[0]);
            warningMsg += `${t.total} ${userWarnings.count}/${config.maxWarnings}\n`;
            warningMsg += `${t.lastWarned} ${new Date(userWarnings.lastWarned).toLocaleString()}\n\n`;
            warningMsg += t.history;
            
            userWarnings.reasons.forEach((w, i) => {
                const date = new Date(w.timestamp).toLocaleString();
                warningMsg += `${i + 1}. ${w.reason}\n   (${date})\n`;
            });
            
            await sock.sendMessage(from, { 
                text: warningMsg,
                mentions: [targetUser]
            });
            
        } catch (error) {
            console.error('[WARNINGS] Command error:', error.message);
            await sock.sendMessage(from, { 
                text: t.error
            });
        }
    }
};
