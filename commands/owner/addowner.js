import { getGroupLanguage } from '../../utils/language.js';
import { isMainOwnerOnly } from '../../utils/ownerManager.js';
import { config } from '../../config.js';

const responses = {
    en: {
        mainOwnerOnly: '❌ Only the main bot owner can add additional owners.\n\n👑 Main Owner: +{owner}',
        noUser: '❌ Please mention a user to grant owner permissions.\n\nUsage: .addowner @user',
        alreadyOwner: '⚠️ This user already has owner permissions.',
        success: '✅ Owner permissions granted!\n\n👤 User: @{number}\n🔑 Can now use all owner commands\n\n⚠️ Use .removeowner to revoke access',
        failed: '❌ Failed to grant owner permissions.\n\nError:'
    },
    it: {
        mainOwnerOnly: '❌ Solo il proprietario principale del bot può aggiungere proprietari aggiuntivi.\n\n👑 Proprietario Principale: +{owner}',
        noUser: '❌ Menziona un utente per concedere permessi proprietario.\n\nUso: .addowner @utente',
        alreadyOwner: '⚠️ Questo utente ha già permessi proprietario.',
        success: '✅ Permessi proprietario concessi!\n\n👤 Utente: @{number}\n🔑 Può ora usare tutti i comandi proprietario\n\n⚠️ Usa .removeowner per revocare accesso',
        failed: '❌ Impossibile concedere permessi proprietario.\n\nErrore:'
    },
    ru: {
        mainOwnerOnly: '❌ Только главный владелец бота может добавлять дополнительных владельцев.\n\n👑 Главный Владелец: +{owner}',
        noUser: '❌ Пожалуйста, упомяните пользователя для предоставления прав владельца.\n\nИспользование: .addowner @пользователь',
        alreadyOwner: '⚠️ У этого пользователя уже есть права владельца.',
        success: '✅ Права владельца предоставлены!\n\n👤 Пользователь: @{number}\n🔑 Теперь может использовать все команды владельца\n\n⚠️ Используйте .removeowner для отзыва доступа',
        failed: '❌ Не удалось предоставить права владельца.\n\nОшибка:'
    },
    es: {
        mainOwnerOnly: '❌ Solo el propietario principal del bot puede agregar propietarios adicionales.\n\n👑 Propietario Principal: +{owner}',
        noUser: '❌ Por favor menciona a un usuario para otorgar permisos de propietario.\n\nUso: .addowner @usuario',
        alreadyOwner: '⚠️ Este usuario ya tiene permisos de propietario.',
        success: '✅ ¡Permisos de propietario otorgados!\n\n👤 Usuario: @{number}\n🔑 Ahora puede usar todos los comandos de propietario\n\n⚠️ Usa .removeowner para revocar acceso',
        failed: '❌ Error al otorgar permisos de propietario.\n\nError:'
    },
    pt: {
        mainOwnerOnly: '❌ Apenas o proprietário principal do bot pode adicionar proprietários adicionais.\n\n👑 Proprietário Principal: +{owner}',
        noUser: '❌ Por favor mencione um usuário para conceder permissões de proprietário.\n\nUso: .addowner @usuário',
        alreadyOwner: '⚠️ Este usuário já tem permissões de proprietário.',
        success: '✅ Permissões de proprietário concedidas!\n\n👤 Usuário: @{number}\n🔑 Agora pode usar todos os comandos de proprietário\n\n⚠️ Use .removeowner para revogar acesso',
        failed: '❌ Falha ao conceder permissões de proprietário.\n\nErro:'
    },
    ar: {
        mainOwnerOnly: '❌ المالك الرئيسي للبوت بس هو اللي يقدر يضيف مالكين إضافيين.\n\n👑 المالك الرئيسي: +{owner}',
        noUser: '❌ من فضلك اعمل منشن لمستخدم عشان تديله صلاحيات المالك.\n\nالاستخدام: .addowner @مستخدم',
        alreadyOwner: '⚠️ المستخدم ده عنده صلاحيات المالك فعلاً.',
        success: '✅ صلاحيات المالك اتمنحت!\n\n👤 المستخدم: @{number}\n🔑 دلوقتي يقدر يستخدم كل أوامر المالك\n\n⚠️ استخدم .removeowner عشان تلغي الوصول',
        failed: '❌ فشل في منح صلاحيات المالك.\n\nالخطأ:'
    },
    hi: {
        mainOwnerOnly: '❌ केवल मुख्य बॉट ओनर ही अतिरिक्त ओनर जोड़ सकते हैं।\n\n👑 मुख्य ओनर: +{owner}',
        noUser: '❌ कृपया ओनर अनुमतियां देने के लिए एक यूजर को मेंशन करें।\n\nउपयोग: .addowner @यूजर',
        alreadyOwner: '⚠️ इस यूजर के पास पहले से ओनर अनुमतियां हैं।',
        success: '✅ ओनर अनुमतियां दी गईं!\n\n👤 यूजर: @{number}\n🔑 अब सभी ओनर कमांड उपयोग कर सकते हैं\n\n⚠️ एक्सेस रद्द करने के लिए .removeowner का उपयोग करें',
        failed: '❌ ओनर अनुमतियां देने में विफल।\n\nएरर:'
    }
};

export default {
    name: 'addowner',
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
            
            // Create data directory if it doesn't exist
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }
            
            // Load existing owners
            let additionalOwners = [];
            if (fs.existsSync(ownersFile)) {
                const data = fs.readFileSync(ownersFile, 'utf8');
                additionalOwners = JSON.parse(data);
            }
            
            // Check if already an owner
            const existingOwner = additionalOwners.find(o => 
                o.jid === targetJid || o.number === targetNumber
            );
            
            if (existingOwner) {
                await sock.sendMessage(from, { 
                    text: t.alreadyOwner
                });
                return;
            }
            
            // Add new owner
            additionalOwners.push({
                jid: targetJid,
                number: targetNumber,
                addedAt: new Date().toISOString(),
                addedBy: msg.key.participant || msg.key.remoteJid
            });
            
            // Save to file
            fs.writeFileSync(ownersFile, JSON.stringify(additionalOwners, null, 2));
            
            await sock.sendMessage(from, { 
                text: t.success.replace('{number}', targetNumber),
                mentions: [targetJid]
            });
            
        } catch (error) {
            console.error('Error adding owner:', error);
            await sock.sendMessage(from, { 
                text: `${t.failed} ${error.message}`
            });
        }
    }
};
