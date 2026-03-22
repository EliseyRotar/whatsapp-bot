import { getGroupLanguage } from '../../utils/language.js';
import { isMainOwnerOnly } from '../../utils/ownerManager.js';
import { config } from '../../config.js';

const responses = {
    en: {
        mainOwnerOnly: '❌ Only the main bot owner can remove additional owners.\n\n👑 Main Owner: +{owner}',
        noUser: '❌ Please mention a user to revoke owner permissions.\n\nUsage: .removeowner @user',
        noOwners: '⚠️ No additional owners found.',
        notOwner: '⚠️ This user does not have owner permissions.',
        success: '✅ Owner permissions revoked!\n\n👤 User: @{number}\n🚫 Can no longer use owner commands',
        failed: '❌ Failed to revoke owner permissions.\n\nError:'
    },
    it: {
        mainOwnerOnly: '❌ Solo il proprietario principale del bot può rimuovere proprietari aggiuntivi.\n\n👑 Proprietario Principale: +{owner}',
        noUser: '❌ Menziona un utente per revocare permessi proprietario.\n\nUso: .removeowner @utente',
        noOwners: '⚠️ Nessun proprietario aggiuntivo trovato.',
        notOwner: '⚠️ Questo utente non ha permessi proprietario.',
        success: '✅ Permessi proprietario revocati!\n\n👤 Utente: @{number}\n🚫 Non può più usare comandi proprietario',
        failed: '❌ Impossibile revocare permessi proprietario.\n\nErrore:'
    },
    ru: {
        mainOwnerOnly: '❌ Только главный владелец бота может удалять дополнительных владельцев.\n\n👑 Главный Владелец: +{owner}',
        noUser: '❌ Пожалуйста, упомяните пользователя для отзыва прав владельца.\n\nИспользование: .removeowner @пользователь',
        noOwners: '⚠️ Дополнительные владельцы не найдены.',
        notOwner: '⚠️ У этого пользователя нет прав владельца.',
        success: '✅ Права владельца отозваны!\n\n👤 Пользователь: @{number}\n🚫 Больше не может использовать команды владельца',
        failed: '❌ Не удалось отозвать права владельца.\n\nОшибка:'
    },
    es: {
        mainOwnerOnly: '❌ Solo el propietario principal del bot puede eliminar propietarios adicionales.\n\n👑 Propietario Principal: +{owner}',
        noUser: '❌ Por favor menciona a un usuario para revocar permisos de propietario.\n\nUso: .removeowner @usuario',
        noOwners: '⚠️ No se encontraron propietarios adicionales.',
        notOwner: '⚠️ Este usuario no tiene permisos de propietario.',
        success: '✅ ¡Permisos de propietario revocados!\n\n👤 Usuario: @{number}\n🚫 Ya no puede usar comandos de propietario',
        failed: '❌ Error al revocar permisos de propietario.\n\nError:'
    },
    pt: {
        mainOwnerOnly: '❌ Apenas o proprietário principal do bot pode remover proprietários adicionais.\n\n👑 Proprietário Principal: +{owner}',
        noUser: '❌ Por favor mencione um usuário para revogar permissões de proprietário.\n\nUso: .removeowner @usuário',
        noOwners: '⚠️ Nenhum proprietário adicional encontrado.',
        notOwner: '⚠️ Este usuário não tem permissões de proprietário.',
        success: '✅ Permissões de proprietário revogadas!\n\n👤 Usuário: @{number}\n🚫 Não pode mais usar comandos de proprietário',
        failed: '❌ Falha ao revogar permissões de proprietário.\n\nErro:'
    },
    ar: {
        mainOwnerOnly: '❌ المالك الرئيسي للبوت بس هو اللي يقدر يشيل مالكين إضافيين.\n\n👑 المالك الرئيسي: +{owner}',
        noUser: '❌ من فضلك اعمل منشن لمستخدم عشان تلغي صلاحيات المالك.\n\nالاستخدام: .removeowner @مستخدم',
        noOwners: '⚠️ مافيش مالكين إضافيين.',
        notOwner: '⚠️ المستخدم ده مالوش صلاحيات المالك.',
        success: '✅ صلاحيات المالك اتلغت!\n\n👤 المستخدم: @{number}\n🚫 مش هيقدر يستخدم أوامر المالك تاني',
        failed: '❌ فشل في إلغاء صلاحيات المالك.\n\nالخطأ:'
    },
    hi: {
        mainOwnerOnly: '❌ केवल मुख्य बॉट ओनर ही अतिरिक्त ओनर हटा सकते हैं।\n\n👑 मुख्य ओनर: +{owner}',
        noUser: '❌ कृपया ओनर अनुमतियां रद्द करने के लिए एक यूजर को मेंशन करें।\n\nउपयोग: .removeowner @यूजर',
        noOwners: '⚠️ कोई अतिरिक्त ओनर नहीं मिला।',
        notOwner: '⚠️ इस यूजर के पास ओनर अनुमतियां नहीं हैं।',
        success: '✅ ओनर अनुमतियां रद्द की गईं!\n\n👤 यूजर: @{number}\n🚫 अब ओनर कमांड उपयोग नहीं कर सकते',
        failed: '❌ ओनर अनुमतियां रद्द करने में विफल।\n\nएरर:'
    }
};

export default {
    name: 'removeowner',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        const sender = msg.key.participant || msg.key.remoteJid;
        
        // Check if sender is the MAIN owner only
        const botJid = sock.user?.id?.replace(/:\d+/, '') || '';
        if (!isMainOwnerOnly(sender, botJid, config.ownerNumber, config.ownerJid, msg.key.fromMe)) {
            await sock.sendMessage(from, { 
                text: t.mainOwnerOnly.replace('{owner}', config.ownerNumber)
            });
            return;
        }
        
        try {
            // Get mentioned users
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
            
            if (mentioned.length === 0) {
                await sock.sendMessage(from, { 
                    text: t.noUser
                });
                return;
            }
            
            const targetJid = mentioned[0];
            const targetNumber = targetJid.split('@')[0].replace(/\D/g, '');
            
            // Load current additional owners
            const fs = await import('fs');
            const path = await import('path');
            const dataDir = './data';
            const ownersFile = path.join(dataDir, 'additional_owners.json');
            
            if (!fs.existsSync(ownersFile)) {
                await sock.sendMessage(from, { 
                    text: t.noOwners
                });
                return;
            }
            
            // Load existing owners
            const data = fs.readFileSync(ownersFile, 'utf8');
            let additionalOwners = JSON.parse(data);
            
            // Find and remove owner
            const initialLength = additionalOwners.length;
            additionalOwners = additionalOwners.filter(o => 
                o.jid !== targetJid && o.number !== targetNumber
            );
            
            if (additionalOwners.length === initialLength) {
                await sock.sendMessage(from, { 
                    text: t.notOwner
                });
                return;
            }
            
            // Save updated list
            fs.writeFileSync(ownersFile, JSON.stringify(additionalOwners, null, 2));
            
            await sock.sendMessage(from, { 
                text: t.success.replace('{number}', targetNumber),
                mentions: [targetJid]
            });
            
        } catch (error) {
            console.error('Error removing owner:', error);
            await sock.sendMessage(from, { 
                text: `${t.failed} ${error.message}`
            });
        }
    }
};
