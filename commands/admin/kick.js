import { extractMentions, isAdmin } from '../../utils/helpers.js';
import { config } from '../../config.js';
import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        noUser: '❌ Please mention a user or reply to their message to kick them.\n\nUsage:\n• .kick @user\n• Reply to message and type .kick',
        cannotKickOwner: '❌ Cannot kick the bot owner!',
        cannotKickAdmin: '⚠️ Warning: You are trying to kick a group admin.\n\nDemote them first with .demote @user',
        success: '✅ User @{user} has been kicked from the group.',
        failed: '❌ Failed to kick user.\n\n',
        reasonForbidden: 'Reason: Bot lacks permission.\nMake sure the bot is an admin.',
        reasonNotAuth: 'Reason: Not authorized to remove this user.\nThe user might be a group creator.',
        reasonNotFound: 'Reason: User not found in group.\nThey may have already left.',
        reasonGeneric: 'Reason: {error}\n\nPlease check bot permissions and try again.'
    },
    it: {
        noUser: '❌ Menziona un utente o rispondi al suo messaggio per cacciarlo.\n\nUso:\n• .kick @utente\n• Rispondi al messaggio e scrivi .kick',
        cannotKickOwner: '❌ Impossibile cacciare il proprietario del bot!',
        cannotKickAdmin: '⚠️ Attenzione: Stai cercando di cacciare un admin del gruppo.\n\nRimuovilo prima con .demote @utente',
        success: '✅ Utente @{user} è stato cacciato dal gruppo.',
        failed: '❌ Impossibile cacciare utente.\n\n',
        reasonForbidden: 'Motivo: Bot senza permessi.\nAssicurati che il bot sia admin.',
        reasonNotAuth: 'Motivo: Non autorizzato a rimuovere questo utente.\nL\'utente potrebbe essere il creatore del gruppo.',
        reasonNotFound: 'Motivo: Utente non trovato nel gruppo.\nPotrebbe aver già lasciato.',
        reasonGeneric: 'Motivo: {error}\n\nControlla i permessi del bot e riprova.'
    },
    ru: {
        noUser: '❌ Пожалуйста, упомяните пользователя или ответьте на его сообщение, чтобы выгнать его.\n\nИспользование:\n• .kick @пользователь\n• Ответьте на сообщение и напишите .kick',
        cannotKickOwner: '❌ Невозможно выгнать владельца бота!',
        cannotKickAdmin: '⚠️ Предупреждение: Вы пытаетесь выгнать администратора группы.\n\nСначала понизьте его с помощью .demote @пользователь',
        success: '✅ Пользователь @{user} был выгнан из группы.',
        failed: '❌ Не удалось выгнать пользователя.\n\n',
        reasonForbidden: 'Причина: У бота нет прав.\nУбедитесь, что бот является администратором.',
        reasonNotAuth: 'Причина: Нет авторизации для удаления этого пользователя.\nПользователь может быть создателем группы.',
        reasonNotFound: 'Причина: Пользователь не найден в группе.\nОн мог уже выйти.',
        reasonGeneric: 'Причина: {error}\n\nПроверьте права бота и попробуйте снова.'
    },
    es: {
        noUser: '❌ Por favor menciona a un usuario o responde a su mensaje para expulsarlo.\n\nUso:\n• .kick @usuario\n• Responde al mensaje y escribe .kick',
        cannotKickOwner: '❌ ¡No se puede expulsar al dueño del bot!',
        cannotKickAdmin: '⚠️ Advertencia: Estás intentando expulsar a un administrador del grupo.\n\nDegradalo primero con .demote @usuario',
        success: '✅ Usuario @{user} ha sido expulsado del grupo.',
        failed: '❌ Error al expulsar usuario.\n\n',
        reasonForbidden: 'Razón: El bot carece de permisos.\nAsegúrate de que el bot sea administrador.',
        reasonNotAuth: 'Razón: No autorizado para eliminar este usuario.\nEl usuario podría ser el creador del grupo.',
        reasonNotFound: 'Razón: Usuario no encontrado en el grupo.\nPuede que ya haya salido.',
        reasonGeneric: 'Razón: {error}\n\nPor favor verifica los permisos del bot e intenta de nuevo.'
    },
    pt: {
        noUser: '❌ Por favor mencione um usuário ou responda à mensagem dele para expulsá-lo.\n\nUso:\n• .kick @usuário\n• Responda à mensagem e digite .kick',
        cannotKickOwner: '❌ Não é possível expulsar o dono do bot!',
        cannotKickAdmin: '⚠️ Aviso: Você está tentando expulsar um administrador do grupo.\n\nRebaixe-o primeiro com .demote @usuário',
        success: '✅ Usuário @{user} foi expulso do grupo.',
        failed: '❌ Falha ao expulsar usuário.\n\n',
        reasonForbidden: 'Motivo: Bot sem permissões.\nCertifique-se de que o bot seja administrador.',
        reasonNotAuth: 'Motivo: Não autorizado a remover este usuário.\nO usuário pode ser o criador do grupo.',
        reasonNotFound: 'Motivo: Usuário não encontrado no grupo.\nEle pode já ter saído.',
        reasonGeneric: 'Motivo: {error}\n\nPor favor verifique as permissões do bot e tente novamente.'
    },
    ar: {
        noUser: '❌ من فضلك اعمل منشن لمستخدم أو رد على رسالته عشان تطرده.\n\nالاستخدام:\n• .kick @مستخدم\n• رد على الرسالة واكتب .kick',
        cannotKickOwner: '❌ مش ممكن طرد مالك البوت!',
        cannotKickAdmin: '⚠️ تحذير: بتحاول تطرد أدمن في الجروب.\n\nانزله من الأدمن الأول بـ .demote @مستخدم',
        success: '✅ المستخدم @{user} اتطرد من الجروب.',
        failed: '❌ فشل في طرد المستخدم.\n\n',
        reasonForbidden: 'السبب: البوت مالوش صلاحيات.\nتأكد إن البوت أدمن.',
        reasonNotAuth: 'السبب: مش مصرح بإزالة المستخدم ده.\nالمستخدم ممكن يكون منشئ الجروب.',
        reasonNotFound: 'السبب: المستخدم مش موجود في الجروب.\nممكن يكون خرج فعلاً.',
        reasonGeneric: 'السبب: {error}\n\nمن فضلك تحقق من صلاحيات البوت وحاول تاني.'
    },
    hi: {
        noUser: '❌ कृपया किसी उपयोगकर्ता का उल्लेख करें या उनके संदेश का उत्तर दें।\n\nउपयोग:\n• .kick @उपयोगकर्ता\n• संदेश का उत्तर दें और .kick टाइप करें',
        cannotKickOwner: '❌ बॉट के मालिक को किक नहीं कर सकते!',
        cannotKickAdmin: '⚠️ चेतावनी: आप एक ग्रुप एडमिन को किक करने की कोशिश कर रहे हैं।\n\nपहले उन्हें .demote @उपयोगकर्ता से डिमोट करें',
        success: '✅ उपयोगकर्ता @{user} को ग्रुप से किक कर दिया गया है।',
        failed: '❌ उपयोगकर्ता को किक करने में विफल।\n\n',
        reasonForbidden: 'कारण: बॉट के पास अनुमति नहीं है।\nसुनिश्चित करें कि बॉट एडमिन है।',
        reasonNotAuth: 'कारण: इस उपयोगकर्ता को हटाने के लिए अधिकृत नहीं।\nउपयोगकर्ता ग्रुप निर्माता हो सकता है।',
        reasonNotFound: 'कारण: उपयोगकर्ता ग्रुप में नहीं मिला।\nवे पहले ही छोड़ चुके हो सकते हैं।',
        reasonGeneric: 'कारण: {error}\n\nकृपया बॉट अनुमतियां जांचें और पुनः प्रयास करें।'
    },
    ng: {
        noUser: '❌ Abeg mention user or reply to their message make you kick them.\n\nHow to use:\n• .kick @user\n• Reply to message and type .kick',
        cannotKickOwner: '❌ You no fit kick the bot owner!',
        cannotKickAdmin: '⚠️ Warning: You dey try kick group admin.\n\nDemote them first with .demote @user',
        success: '✅ User @{user} don comot from the group.',
        failed: '❌ E no work to kick user.\n\n',
        reasonForbidden: 'Reason: Bot no get permission.\nMake sure say bot na admin.',
        reasonNotAuth: 'Reason: No permission to remove this user.\nThe user fit be group creator.',
        reasonNotFound: 'Reason: User no dey for group.\nThem fit don leave already.',
        reasonGeneric: 'Reason: {error}\n\nAbeg check bot permissions and try again.'
    }
};

export default {
    name: 'kick',
    groupOnly: true,
    adminOnly: true,
    botAdminRequired: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        const quotedMsg = msg.message?.extendedTextMessage?.contextInfo;
        
        let userToKick;
        
        // First, check if replying to a message
        if (quotedMsg?.participant) {
            userToKick = quotedMsg.participant;
        } 
        // Then check for WhatsApp mentions (works with @~Name mentions)
        else if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
            userToKick = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
            console.log('[KICK] Using WhatsApp mention:', userToKick);
        }
        // Finally, try to extract from text (for @number mentions)
        else {
            const mentions = extractMentions(args.join(' '));
            if (mentions.length === 0) {
                return await sock.sendMessage(from, { 
                    text: t.noUser
                }).catch(err => console.error('[KICK] Error sending message:', err.message));
            }
            userToKick = mentions[0];
        }

        try {
            console.log('[KICK] User to kick:', userToKick);
            
            // Verify user is in the group first
            const groupMetadata = await sock.groupMetadata(from);
            const participant = groupMetadata.participants.find(p => p.id === userToKick);
            
            if (!participant) {
                console.log('[KICK] User not found in group participants');
                console.log('[KICK] Available participants:', groupMetadata.participants.map(p => p.id));
                return await sock.sendMessage(from, { 
                    text: t.failed + t.reasonNotFound
                }).catch(err => console.error('[KICK] Error sending message:', err.message));
            }
            
            console.log('[KICK] Found participant:', participant.id, 'Admin:', participant.admin);
            
            // Check if trying to kick the bot owner
            const botJid = sock.user?.id?.replace(/:\d+/, '') || '';
            if (userToKick === config.ownerJid || userToKick === botJid || userToKick.includes(config.ownerNumber)) {
                return await sock.sendMessage(from, { 
                    text: t.cannotKickOwner
                }).catch(err => console.error('[KICK] Error sending message:', err.message));
            }
            
            // Check if trying to kick another admin
            const isTargetAdmin = await isAdmin(sock, from, userToKick);
            if (isTargetAdmin) {
                return await sock.sendMessage(from, { 
                    text: t.cannotKickAdmin
                }).catch(err => console.error('[KICK] Error sending message:', err.message));
            }
            
            console.log(`[KICK] Attempting to kick user: ${userToKick}`);
            await sock.groupParticipantsUpdate(from, [userToKick], 'remove');
            
            await sock.sendMessage(from, { 
                text: t.success.replace('{user}', userToKick.split('@')[0]),
                mentions: [userToKick]
            }).catch(err => console.error('[KICK] Error sending success message:', err.message));
            
        } catch (error) {
            console.error('[KICK] Error:', error.message);
            console.error('[KICK] Stack:', error.stack);
            console.error('[KICK] Error data:', JSON.stringify(error.data || {}));
            
            let errorMsg = t.failed;
            
            if (error.message.includes('forbidden') || error.message.includes('403')) {
                errorMsg += t.reasonForbidden;
            } else if (error.message.includes('not-authorized')) {
                errorMsg += t.reasonNotAuth;
            } else if (error.message.includes('participant-not-found') || error.message.includes('item-not-found')) {
                errorMsg += t.reasonNotFound;
            } else if (error.message.includes('internal-server-error')) {
                // WhatsApp internal error - usually means the user can't be kicked
                errorMsg += 'Motivo: Errore interno di WhatsApp.\n\n';
                errorMsg += '⚠️ Possibili cause:\n';
                errorMsg += '• L\'utente è il creatore del gruppo\n';
                errorMsg += '• L\'utente ha lasciato il gruppo\n';
                errorMsg += '• Problema temporaneo di WhatsApp\n\n';
                errorMsg += 'Prova a:\n';
                errorMsg += '1. Verificare che l\'utente sia nel gruppo\n';
                errorMsg += '2. Riavviare il bot\n';
                errorMsg += '3. Riprovare tra qualche minuto';
            } else {
                errorMsg += t.reasonGeneric.replace('{error}', error.message);
            }
            
            await sock.sendMessage(from, { 
                text: errorMsg 
            }).catch(err => console.error('[KICK] Error sending error message:', err.message));
        }
    }
};
