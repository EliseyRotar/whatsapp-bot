import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        usage: '❌ Please provide a phone number to add.\n\nUsage:\n• .add 1234567890\n• .add +1234567890\n• .add 1234567890 9876543210 (multiple)',
        invalidNumber: '❌ Invalid phone number format: {number}',
        success: '✅ Successfully added @{user} to the group!',
        partialSuccess: '✅ Added {count} user(s) successfully.',
        failed: '❌ Failed to add user.\n\n',
        reasonForbidden: 'Reason: Bot lacks permission.\nMake sure the bot is an admin.',
        reasonNotAuth: 'Reason: Not authorized to add this user.\nThe user might have privacy settings preventing group adds.',
        reasonAlreadyMember: 'Reason: User is already a member of this group.',
        reasonGeneric: 'Reason: {error}\n\nPlease check bot permissions and try again.'
    },
    it: {
        usage: '❌ Fornisci un numero di telefono da aggiungere.\n\nUso:\n• .add 1234567890\n• .add +1234567890\n• .add 1234567890 9876543210 (multipli)',
        invalidNumber: '❌ Formato numero non valido: {number}',
        success: '✅ @{user} aggiunto al gruppo con successo!',
        partialSuccess: '✅ Aggiunti {count} utente(i) con successo.',
        failed: '❌ Impossibile aggiungere utente.\n\n',
        reasonForbidden: 'Motivo: Bot senza permessi.\nAssicurati che il bot sia admin.',
        reasonNotAuth: 'Motivo: Non autorizzato ad aggiungere questo utente.\nL\'utente potrebbe avere impostazioni privacy che impediscono l\'aggiunta ai gruppi.',
        reasonAlreadyMember: 'Motivo: L\'utente è già membro di questo gruppo.',
        reasonGeneric: 'Motivo: {error}\n\nControlla i permessi del bot e riprova.'
    },
    ru: {
        usage: '❌ Пожалуйста, укажите номер телефона для добавления.\n\nИспользование:\n• .add 1234567890\n• .add +1234567890\n• .add 1234567890 9876543210 (несколько)',
        invalidNumber: '❌ Неверный формат номера: {number}',
        success: '✅ Пользователь @{user} успешно добавлен в группу!',
        partialSuccess: '✅ Успешно добавлено {count} пользователь(ей).',
        failed: '❌ Не удалось добавить пользователя.\n\n',
        reasonForbidden: 'Причина: У бота нет прав.\nУбедитесь, что бот является администратором.',
        reasonNotAuth: 'Причина: Нет авторизации для добавления этого пользователя.\nУ пользователя могут быть настройки конфиденциальности, запрещающие добавление в группы.',
        reasonAlreadyMember: 'Причина: Пользователь уже является членом этой группы.',
        reasonGeneric: 'Причина: {error}\n\nПроверьте права бота и попробуйте снова.'
    },
    es: {
        usage: '❌ Por favor proporciona un número de teléfono para agregar.\n\nUso:\n• .add 1234567890\n• .add +1234567890\n• .add 1234567890 9876543210 (múltiples)',
        invalidNumber: '❌ Formato de número inválido: {number}',
        success: '✅ ¡@{user} agregado al grupo exitosamente!',
        partialSuccess: '✅ {count} usuario(s) agregado(s) exitosamente.',
        failed: '❌ Error al agregar usuario.\n\n',
        reasonForbidden: 'Razón: El bot carece de permisos.\nAsegúrate de que el bot sea administrador.',
        reasonNotAuth: 'Razón: No autorizado para agregar este usuario.\nEl usuario podría tener configuraciones de privacidad que impiden agregarlo a grupos.',
        reasonAlreadyMember: 'Razón: El usuario ya es miembro de este grupo.',
        reasonGeneric: 'Razón: {error}\n\nPor favor verifica los permisos del bot e intenta de nuevo.'
    },
    pt: {
        usage: '❌ Por favor forneça um número de telefone para adicionar.\n\nUso:\n• .add 1234567890\n• .add +1234567890\n• .add 1234567890 9876543210 (múltiplos)',
        invalidNumber: '❌ Formato de número inválido: {number}',
        success: '✅ @{user} adicionado ao grupo com sucesso!',
        partialSuccess: '✅ {count} usuário(s) adicionado(s) com sucesso.',
        failed: '❌ Falha ao adicionar usuário.\n\n',
        reasonForbidden: 'Motivo: Bot sem permissões.\nCertifique-se de que o bot seja administrador.',
        reasonNotAuth: 'Motivo: Não autorizado a adicionar este usuário.\nO usuário pode ter configurações de privacidade impedindo adição a grupos.',
        reasonAlreadyMember: 'Motivo: O usuário já é membro deste grupo.',
        reasonGeneric: 'Motivo: {error}\n\nPor favor verifique as permissões do bot e tente novamente.'
    },
    ar: {
        usage: '❌ من فضلك اكتب رقم تليفون عشان تضيفه.\n\nالاستخدام:\n• .add 1234567890\n• .add +1234567890\n• .add 1234567890 9876543210 (متعدد)',
        invalidNumber: '❌ صيغة الرقم غلط: {number}',
        success: '✅ @{user} اتضاف للجروب بنجاح!',
        partialSuccess: '✅ اتضاف {count} مستخدم بنجاح.',
        failed: '❌ فشل في إضافة المستخدم.\n\n',
        reasonForbidden: 'السبب: البوت مالوش صلاحيات.\nتأكد إن البوت أدمن.',
        reasonNotAuth: 'السبب: مش مصرح بإضافة المستخدم ده.\nالمستخدم ممكن يكون عنده إعدادات خصوصية بتمنع الإضافة للجروبات.',
        reasonAlreadyMember: 'السبب: المستخدم موجود في الجروب فعلاً.',
        reasonGeneric: 'السبب: {error}\n\nمن فضلك تحقق من صلاحيات البوت وحاول تاني.'
    },
    hi: {
        usage: '❌ कृपया जोड़ने के लिए एक फोन नंबर प्रदान करें।\n\nउपयोग:\n• .add 1234567890\n• .add +1234567890\n• .add 1234567890 9876543210 (एकाधिक)',
        invalidNumber: '❌ अमान्य फोन नंबर प्रारूप: {number}',
        success: '✅ @{user} को ग्रुप में सफलतापूर्वक जोड़ा गया!',
        partialSuccess: '✅ {count} उपयोगकर्ता सफलतापूर्वक जोड़े गए।',
        failed: '❌ उपयोगकर्ता जोड़ने में विफल।\n\n',
        reasonForbidden: 'कारण: बॉट के पास अनुमति नहीं है।\nसुनिश्चित करें कि बॉट एडमिन है।',
        reasonNotAuth: 'कारण: इस उपयोगकर्ता को जोड़ने के लिए अधिकृत नहीं है।\nउपयोगकर्ता की गोपनीयता सेटिंग्स ग्रुप में जोड़ने से रोक सकती हैं।',
        reasonAlreadyMember: 'कारण: उपयोगकर्ता पहले से ही इस ग्रुप का सदस्य है।',
        reasonGeneric: 'कारण: {error}\n\nकृपया बॉट की अनुमतियां जांचें और पुनः प्रयास करें।'
    },
    ng: {
        usage: '❌ Abeg give phone number wey you wan add.\n\nHow to use:\n• .add 1234567890\n• .add +1234567890\n• .add 1234567890 9876543210 (plenty)',
        invalidNumber: '❌ Phone number format no correct: {number}',
        success: '✅ @{user} don join the group!',
        partialSuccess: '✅ {count} person(s) don join successfully.',
        failed: '❌ E no work to add user.\n\n',
        reasonForbidden: 'Reason: Bot no get permission.\nMake sure say bot na admin.',
        reasonNotAuth: 'Reason: No permission to add this user.\nThe user fit get privacy settings wey dey block group adds.',
        reasonAlreadyMember: 'Reason: User don dey for this group already.',
        reasonGeneric: 'Reason: {error}\n\nAbeg check bot permissions and try again.'
    }
};

function normalizePhoneNumber(number) {
    // Remove all non-digit characters
    const cleaned = number.replace(/\D/g, '');
    
    // Must have at least 10 digits
    if (cleaned.length < 10) {
        return null;
    }
    
    return cleaned + '@s.whatsapp.net';
}

export default {
    name: 'add',
    groupOnly: true,
    adminOnly: false,
    botAdminRequired: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        if (args.length === 0) {
            return await sock.sendMessage(from, { 
                text: t.usage
            }).catch(err => console.error('[ADD] Error sending message:', err.message));
        }

        // Parse phone numbers from arguments
        const phoneNumbers = args.map(arg => normalizePhoneNumber(arg)).filter(Boolean);
        
        if (phoneNumbers.length === 0) {
            return await sock.sendMessage(from, { 
                text: t.invalidNumber.replace('{number}', args.join(', '))
            }).catch(err => console.error('[ADD] Error sending message:', err.message));
        }

        console.log(`[ADD] Adding users: ${phoneNumbers.join(', ')}`);
        
        const results = [];
        const successfulAdds = [];
        
        for (const userJid of phoneNumbers) {
            try {
                await sock.groupParticipantsUpdate(from, [userJid], 'add');
                successfulAdds.push(userJid);
                console.log(`[ADD] Successfully added: ${userJid}`);
            } catch (error) {
                console.error(`[ADD] Error adding ${userJid}:`, error.message);
                results.push({ jid: userJid, error });
            }
        }

        // Send success message for successful adds
        if (successfulAdds.length > 0) {
            if (successfulAdds.length === 1) {
                await sock.sendMessage(from, { 
                    text: t.success.replace('{user}', successfulAdds[0].split('@')[0]),
                    mentions: successfulAdds
                }).catch(err => console.error('[ADD] Error sending success message:', err.message));
            } else {
                await sock.sendMessage(from, { 
                    text: t.partialSuccess.replace('{count}', successfulAdds.length),
                    mentions: successfulAdds
                }).catch(err => console.error('[ADD] Error sending success message:', err.message));
            }
        }

        // Send error messages for failed adds
        for (const result of results) {
            let errorMsg = t.failed;
            const error = result.error;
            
            if (error.message.includes('forbidden') || error.message.includes('403')) {
                errorMsg += t.reasonForbidden;
            } else if (error.message.includes('not-authorized')) {
                errorMsg += t.reasonNotAuth;
            } else if (error.message.includes('already') || error.message.includes('participant-exists')) {
                errorMsg += t.reasonAlreadyMember;
            } else {
                errorMsg += t.reasonGeneric.replace('{error}', error.message);
            }
            
            errorMsg += `\n\nNumber: ${result.jid.split('@')[0]}`;
            
            await sock.sendMessage(from, { 
                text: errorMsg 
            }).catch(err => console.error('[ADD] Error sending error message:', err.message));
        }
    }
};
