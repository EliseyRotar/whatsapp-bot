import { addWarning, getWarnings, clearWarnings } from '../../utils/database.js';
import { config } from '../../config.js';
import { getGroupLanguage } from '../../utils/language.js';
import { isOwnerOrAdditional } from '../../utils/ownerManager.js';

const responses = {
    en: {
        noUser: '❌ Please mention or reply to a user to warn them.\n\nUsage:\n• .warn @user <reason>\n• .warn all <reason> - Warn everyone',
        cannotWarnOwner: '❌ Cannot warn the bot owner!',
        cannotWarnBot: '❌ Cannot warn the bot!',
        failed: '❌ Failed to add warning. Please try again.',
        warning: '⚠️ WARNING ⚠️\n\n',
        user: 'User:',
        reason: 'Reason:',
        warnings: 'Warnings:',
        kicked: '🚫 User has been kicked from the group for reaching {max} warnings.',
        remaining: '⚠️ {remaining} warning(s) remaining before kick.',
        kickFailed: '⚠️ User reached maximum warnings but couldn\'t be kicked. Please check bot permissions.',
        error: '❌ An error occurred while processing the warning. Please try again.',
        warnAllNoReason: '❌ Please provide a reason for warning everyone.\n\nUsage: .warn all <reason>',
        warnAllSuccess: '⚠️ WARNING TO ALL MEMBERS ⚠️\n\nReason: {reason}\n\n{count} member(s) have been warned.\n\n⚠️ Everyone now has {warnings}/{max} warnings.',
        warnAllProcessing: '⚠️ Warning all members... This may take a moment.'
    },
    it: {
        noUser: '❌ Menziona o rispondi a un utente per avvisarlo.\n\nUso:\n• .warn @utente <motivo>\n• .warn all <motivo> - Avvisa tutti',
        cannotWarnOwner: '❌ Impossibile avvisare il proprietario del bot!',
        cannotWarnBot: '❌ Impossibile avvisare il bot!',
        failed: '❌ Impossibile aggiungere avviso. Riprova.',
        warning: '⚠️ AVVISO ⚠️\n\n',
        user: 'Utente:',
        reason: 'Motivo:',
        warnings: 'Avvisi:',
        kicked: '🚫 Utente è stato cacciato dal gruppo per aver raggiunto {max} avvisi.',
        remaining: '⚠️ {remaining} avviso/i rimanenti prima del kick.',
        kickFailed: '⚠️ Utente ha raggiunto avvisi massimi ma non può essere cacciato. Controlla permessi bot.',
        error: '❌ Si è verificato un errore durante l\'elaborazione dell\'avviso. Riprova.',
        warnAllNoReason: '❌ Fornisci un motivo per avvisare tutti.\n\nUso: .warn all <motivo>',
        warnAllSuccess: '⚠️ AVVISO A TUTTI I MEMBRI ⚠️\n\nMotivo: {reason}\n\n{count} membro/i sono stati avvisati.\n\n⚠️ Tutti ora hanno {warnings}/{max} avvisi.',
        warnAllProcessing: '⚠️ Avviso tutti i membri... Potrebbe richiedere un momento.'
    },
    ru: {
        noUser: '❌ Пожалуйста, упомяните или ответьте пользователю, чтобы предупредить его.\n\nИспользование:\n• .warn @пользователь <причина>\n• .warn all <причина> - Предупредить всех',
        cannotWarnOwner: '❌ Невозможно предупредить владельца бота!',
        cannotWarnBot: '❌ Невозможно предупредить бота!',
        failed: '❌ Не удалось добавить предупреждение. Попробуйте снова.',
        warning: '⚠️ ПРЕДУПРЕЖДЕНИЕ ⚠️\n\n',
        user: 'Пользователь:',
        reason: 'Причина:',
        warnings: 'Предупреждения:',
        kicked: '🚫 Пользователь был выгнан из группы за достижение {max} предупреждений.',
        remaining: '⚠️ Осталось {remaining} предупреждений до кика.',
        kickFailed: '⚠️ Пользователь достиг максимума предупреждений, но не может быть выгнан. Проверьте права бота.',
        error: '❌ Произошла ошибка при обработке предупреждения. Попробуйте снова.',
        warnAllNoReason: '❌ Пожалуйста, укажите причину для предупреждения всех.\n\nИспользование: .warn all <причина>',
        warnAllSuccess: '⚠️ ПРЕДУПРЕЖДЕНИЕ ВСЕМ УЧАСТНИКАМ ⚠️\n\nПричина: {reason}\n\n{count} участник(ов) были предупреждены.\n\n⚠️ У всех теперь {warnings}/{max} предупреждений.',
        warnAllProcessing: '⚠️ Предупреждение всех участников... Это может занять время.'
    },
    es: {
        noUser: '❌ Por favor menciona o responde a un usuario para advertirlo.\n\nUso:\n• .warn @usuario <razón>\n• .warn all <razón> - Advertir a todos',
        cannotWarnOwner: '❌ ¡No se puede advertir al propietario del bot!',
        cannotWarnBot: '❌ ¡No se puede advertir al bot!',
        failed: '❌ Error al agregar advertencia. Por favor intenta de nuevo.',
        warning: '⚠️ ADVERTENCIA ⚠️\n\n',
        user: 'Usuario:',
        reason: 'Razón:',
        warnings: 'Advertencias:',
        kicked: '🚫 El usuario ha sido expulsado del grupo por alcanzar {max} advertencias.',
        remaining: '⚠️ {remaining} advertencia(s) restante(s) antes de la expulsión.',
        kickFailed: '⚠️ El usuario alcanzó el máximo de advertencias pero no pudo ser expulsado. Por favor verifica los permisos del bot.',
        error: '❌ Ocurrió un error al procesar la advertencia. Por favor intenta de nuevo.',
        warnAllNoReason: '❌ Por favor proporciona una razón para advertir a todos.\n\nUso: .warn all <razón>',
        warnAllSuccess: '⚠️ ADVERTENCIA A TODOS LOS MIEMBROS ⚠️\n\nRazón: {reason}\n\n{count} miembro(s) han sido advertidos.\n\n⚠️ Todos ahora tienen {warnings}/{max} advertencias.',
        warnAllProcessing: '⚠️ Advirtiendo a todos los miembros... Esto puede tomar un momento.'
    },
    pt: {
        noUser: '❌ Por favor mencione ou responda a um usuário para adverti-lo.\n\nUso:\n• .warn @usuário <motivo>\n• .warn all <motivo> - Advertir todos',
        cannotWarnOwner: '❌ Não é possível advertir o proprietário do bot!',
        cannotWarnBot: '❌ Não é possível advertir o bot!',
        failed: '❌ Falha ao adicionar advertência. Por favor tente novamente.',
        warning: '⚠️ ADVERTÊNCIA ⚠️\n\n',
        user: 'Usuário:',
        reason: 'Motivo:',
        warnings: 'Advertências:',
        kicked: '🚫 Usuário foi expulso do grupo por atingir {max} advertências.',
        remaining: '⚠️ {remaining} advertência(s) restante(s) antes da expulsão.',
        kickFailed: '⚠️ Usuário atingiu máximo de advertências mas não pôde ser expulso. Verifique permissões do bot.',
        error: '❌ Ocorreu um erro ao processar a advertência. Por favor tente novamente.',
        warnAllNoReason: '❌ Por favor forneça um motivo para advertir todos.\n\nUso: .warn all <motivo>',
        warnAllSuccess: '⚠️ ADVERTÊNCIA A TODOS OS MEMBROS ⚠️\n\nMotivo: {reason}\n\n{count} membro(s) foram advertidos.\n\n⚠️ Todos agora têm {warnings}/{max} advertências.',
        warnAllProcessing: '⚠️ Advertindo todos os membros... Isso pode levar um momento.'
    },
    ar: {
        noUser: '❌ من فضلك اعمل منشن أو رد على مستخدم عشان تحذره.\n\nالاستخدام:\n• .warn @مستخدم <السبب>\n• .warn all <السبب> - حذر الكل',
        cannotWarnOwner: '❌ مش ممكن تحذر مالك البوت!',
        cannotWarnBot: '❌ مش ممكن تحذر البوت!',
        failed: '❌ فشل في إضافة التحذير. حاول تاني.',
        warning: '⚠️ تحذير ⚠️\n\n',
        user: 'المستخدم:',
        reason: 'السبب:',
        warnings: 'التحذيرات:',
        kicked: '🚫 المستخدم اتطرد من الجروب لوصوله {max} تحذيرات.',
        remaining: '⚠️ {remaining} تحذير متبقي قبل الطرد.',
        kickFailed: '⚠️ المستخدم وصل للحد الأقصى من التحذيرات بس مش قادر يتطرد. تحقق من صلاحيات البوت.',
        error: '❌ حصل خطأ أثناء معالجة التحذير. حاول تاني.',
        warnAllNoReason: '❌ من فضلك اكتب سبب عشان تحذر الكل.\n\nالاستخدام: .warn all <السبب>',
        warnAllSuccess: '⚠️ تحذير لكل الأعضاء ⚠️\n\nالسبب: {reason}\n\n{count} عضو اتحذروا.\n\n⚠️ الكل دلوقتي عندهم {warnings}/{max} تحذيرات.',
        warnAllProcessing: '⚠️ بحذر كل الأعضاء... ممكن ياخد شوية وقت.'
    },
    hi: {
        noUser: '❌ कृपया किसी उपयोगकर्ता का उल्लेख करें या उन्हें चेतावनी देने के लिए उत्तर दें।\n\nउपयोग:\n• .warn @उपयोगकर्ता <कारण>\n• .warn all <कारण> - सभी को चेतावनी दें',
        cannotWarnOwner: '❌ बॉट के मालिक को चेतावनी नहीं दे सकते!',
        cannotWarnBot: '❌ बॉट को चेतावनी नहीं दे सकते!',
        failed: '❌ चेतावनी जोड़ने में विफल। कृपया पुनः प्रयास करें।',
        warning: '⚠️ चेतावनी ⚠️\n\n',
        user: 'उपयोगकर्ता:',
        reason: 'कारण:',
        warnings: 'चेतावनियां:',
        kicked: '🚫 उपयोगकर्ता को {max} चेतावनियां पूरी होने पर ग्रुप से किक कर दिया गया है।',
        remaining: '⚠️ किक से पहले {remaining} चेतावनी(यां) शेष।',
        kickFailed: '⚠️ उपयोगकर्ता अधिकतम चेतावनियों तक पहुंच गया लेकिन किक नहीं किया जा सका। कृपया बॉट अनुमतियां जांचें।',
        error: '❌ चेतावनी प्रोसेस करते समय एक त्रुटि हुई। कृपया पुनः प्रयास करें।',
        warnAllNoReason: '❌ कृपया सभी को चेतावनी देने के लिए एक कारण प्रदान करें।\n\nउपयोग: .warn all <कारण>',
        warnAllSuccess: '⚠️ सभी सदस्यों को चेतावनी ⚠️\n\nकारण: {reason}\n\n{count} सदस्य(यों) को चेतावनी दी गई है।\n\n⚠️ सभी के पास अब {warnings}/{max} चेतावनियां हैं।',
        warnAllProcessing: '⚠️ सभी सदस्यों को चेतावनी दे रहे हैं... इसमें कुछ समय लग सकता है।'
    },
    ng: {
        noUser: '❌ Abeg mention user or reply to them make you warn them.\n\nHow to use:\n• .warn @user <reason>\n• .warn all <reason> - Warn everybody',
        cannotWarnOwner: '❌ You no fit warn the bot owner!',
        cannotWarnBot: '❌ You no fit warn the bot!',
        failed: '❌ E no work to add warning. Abeg try again.',
        warning: '⚠️ WARNING ⚠️\n\n',
        user: 'User:',
        reason: 'Reason:',
        warnings: 'Warnings:',
        kicked: '🚫 User don comot from group for reaching {max} warnings.',
        remaining: '⚠️ {remaining} warning(s) remain before kick.',
        kickFailed: '⚠️ User reach maximum warnings but e no fit kick am. Abeg check bot permissions.',
        error: '❌ Wahala dey while processing warning. Abeg try again.',
        warnAllNoReason: '❌ Abeg give reason make you warn everybody.\n\nHow to use: .warn all <reason>',
        warnAllSuccess: '⚠️ WARNING TO ALL MEMBERS ⚠️\n\nReason: {reason}\n\n{count} member(s) don get warning.\n\n⚠️ Everybody now get {warnings}/{max} warnings.',
        warnAllProcessing: '⚠️ Dey warn all members... E fit take small time.'
    }
};

export default {
    name: 'warn',
    adminOnly: true,
    groupOnly: true,
    botAdminRequired: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        try {
            // Check for 'all' subcommand
            if (args[0] === 'all') {
                const reason = args.slice(1).join(' ');
                
                if (!reason) {
                    return await sock.sendMessage(from, { 
                        text: t.warnAllNoReason
                    });
                }
                
                // Send processing message
                await sock.sendMessage(from, { 
                    text: t.warnAllProcessing
                });
                
                // Get group metadata
                const groupMetadata = await sock.groupMetadata(from);
                const participants = groupMetadata.participants;
                const botJid = sock.user?.id?.replace(/:\d+/, '') || '';
                
                let warnedCount = 0;
                const toKick = [];
                
                // Warn all participants except bot and owners
                for (const participant of participants) {
                    const userId = participant.id;
                    
                    // Skip bot
                    if (userId === botJid || userId.includes(botJid.split('@')[0])) {
                        continue;
                    }
                    
                    // Skip owners
                    if (isOwnerOrAdditional(userId, botJid, config.ownerNumber, config.ownerJid, false)) {
                        continue;
                    }
                    
                    // Add warning
                    const warningCount = addWarning(from, userId, reason);
                    
                    if (warningCount > 0) {
                        warnedCount++;
                        
                        // Check if user should be kicked
                        if (warningCount >= config.maxWarnings) {
                            toKick.push(userId);
                        }
                    }
                }
                
                // Kick users who reached max warnings
                if (toKick.length > 0) {
                    try {
                        await sock.groupParticipantsUpdate(from, toKick, 'remove');
                        for (const userId of toKick) {
                            clearWarnings(from, userId);
                        }
                    } catch (error) {
                        console.error('[WARN ALL] Error kicking users:', error.message);
                    }
                }
                
                // Get a sample warning count (from first warned user)
                let sampleWarnings = 1;
                if (warnedCount > 0) {
                    const firstParticipant = participants.find(p => {
                        const userId = p.id;
                        return userId !== botJid && 
                               !userId.includes(botJid.split('@')[0]) &&
                               !isOwnerOrAdditional(userId, botJid, config.ownerNumber, config.ownerJid, false);
                    });
                    if (firstParticipant) {
                        const warnings = getWarnings(from, firstParticipant.id);
                        sampleWarnings = warnings.count;
                    }
                }
                
                // Send success message
                let successMsg = t.warnAllSuccess
                    .replace('{reason}', reason)
                    .replace('{count}', warnedCount)
                    .replace('{warnings}', sampleWarnings)
                    .replace('{max}', config.maxWarnings);
                
                if (toKick.length > 0) {
                    successMsg += `\n\n🚫 ${toKick.length} member(s) kicked for reaching maximum warnings.`;
                }
                
                await sock.sendMessage(from, { 
                    text: successMsg
                });
                
                return;
            }
            
            // Check if user is mentioned or replied to
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
            const targetUser = mentioned || quoted;
            
            if (!targetUser) {
                return await sock.sendMessage(from, { 
                    text: t.noUser
                });
            }
            
            // Get bot JID
            const botJid = sock.user?.id?.replace(/:\d+/, '') || '';
            const targetNumber = targetUser.split('@')[0].replace(/\D/g, '');
            
            // Check if trying to warn the bot
            if (targetUser === botJid || targetUser.includes(botJid.split('@')[0])) {
                return await sock.sendMessage(from, { 
                    text: t.cannotWarnBot
                });
            }
            
            // Check if trying to warn the owner (main or additional)
            if (isOwnerOrAdditional(targetUser, botJid, config.ownerNumber, config.ownerJid, false)) {
                return await sock.sendMessage(from, { 
                    text: t.cannotWarnOwner
                });
            }
            
            // Get reason
            const reason = args.join(' ').replace(/@\d+/g, '').trim() || (lang === 'it' ? 'Nessun motivo fornito' : 'No reason provided');
            
            // Add warning
            const warningCount = addWarning(from, targetUser, reason);
            
            if (warningCount === 0) {
                return await sock.sendMessage(from, { 
                    text: t.failed
                });
            }
            
            // Send warning message
            let warningMsg = t.warning;
            warningMsg += `${t.user} @${targetUser.split('@')[0]}\n`;
            warningMsg += `${t.reason} ${reason}\n`;
            warningMsg += `${t.warnings} ${warningCount}/${config.maxWarnings}\n\n`;
            
            if (warningCount >= config.maxWarnings) {
                // Kick user
                try {
                    await sock.groupParticipantsUpdate(from, [targetUser], 'remove');
                    warningMsg += t.kicked.replace('{max}', config.maxWarnings);
                    clearWarnings(from, targetUser);
                } catch (error) {
                    console.error('[WARN] Error kicking user:', error.message);
                    warningMsg += t.kickFailed;
                }
            } else {
                warningMsg += t.remaining.replace('{remaining}', config.maxWarnings - warningCount);
            }
            
            await sock.sendMessage(from, { 
                text: warningMsg,
                mentions: [targetUser]
            });
            
        } catch (error) {
            console.error('[WARN] Command error:', error.message);
            await sock.sendMessage(from, { 
                text: t.error
            });
        }
    }
};
