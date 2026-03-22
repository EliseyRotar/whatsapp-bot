import { config } from '../../config.js';
import { isOwnerOrAdditional } from '../../utils/ownerManager.js';
import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        user: '👤 User:',
        you: '👤 You:',
        mainOwner: '👑 Status: Main Owner\n✅ Full bot access\n✅ Can manage additional owners',
        additionalOwner: '⭐ Status: Additional Owner\n✅ Can use owner commands\n❌ Cannot manage owners',
        regularUser: '👤 Status: Regular User\n❌ No owner permissions',
        failed: '❌ Failed to check owner status.\n\nError:'
    },
    it: {
        user: '👤 Utente:',
        you: '👤 Tu:',
        mainOwner: '👑 Stato: Proprietario Principale\n✅ Accesso completo bot\n✅ Può gestire proprietari aggiuntivi',
        additionalOwner: '⭐ Stato: Proprietario Aggiuntivo\n✅ Può usare comandi proprietario\n❌ Non può gestire proprietari',
        regularUser: '👤 Stato: Utente Normale\n❌ Nessun permesso proprietario',
        failed: '❌ Impossibile controllare stato proprietario.\n\nErrore:'
    },
    ru: {
        user: '👤 Пользователь:',
        you: '👤 Вы:',
        mainOwner: '👑 Статус: Главный владелец\n✅ Полный доступ к боту\n✅ Может управлять дополнительными владельцами',
        additionalOwner: '⭐ Статус: Дополнительный владелец\n✅ Может использовать команды владельца\n❌ Не может управлять владельцами',
        regularUser: '👤 Статус: Обычный пользователь\n❌ Нет прав владельца',
        failed: '❌ Не удалось проверить статус владельца.\n\nОшибка:'
    },
    es: {
        user: '👤 Usuario:',
        you: '👤 Tú:',
        mainOwner: '👑 Estado: Propietario Principal\n✅ Acceso completo al bot\n✅ Puede gestionar propietarios adicionales',
        additionalOwner: '⭐ Estado: Propietario Adicional\n✅ Puede usar comandos de propietario\n❌ No puede gestionar propietarios',
        regularUser: '👤 Estado: Usuario Regular\n❌ Sin permisos de propietario',
        failed: '❌ Error al verificar estado de propietario.\n\nError:'
    },
    pt: {
        user: '👤 Usuário:',
        you: '👤 Você:',
        mainOwner: '👑 Status: Dono Principal\n✅ Acesso completo ao bot\n✅ Pode gerenciar donos adicionais',
        additionalOwner: '⭐ Status: Dono Adicional\n✅ Pode usar comandos de dono\n❌ Não pode gerenciar donos',
        regularUser: '👤 Status: Usuário Regular\n❌ Sem permissões de dono',
        failed: '❌ Falha ao verificar status de dono.\n\nErro:'
    },
    ar: {
        user: '👤 المستخدم:',
        you: '👤 انت:',
        mainOwner: '👑 الحالة: المالك الرئيسي\n✅ وصول كامل للبوت\n✅ يقدر يدير المالكين الإضافيين',
        additionalOwner: '⭐ الحالة: مالك إضافي\n✅ يقدر يستخدم أوامر المالك\n❌ مايقدرش يدير المالكين',
        regularUser: '👤 الحالة: مستخدم عادي\n❌ مفيش صلاحيات مالك',
        failed: '❌ فشل التحقق من حالة المالك.\n\nخطأ:'
    },
    hi: {
        user: '👤 यूजर:',
        you: '👤 आप:',
        mainOwner: '👑 स्टेटस: मुख्य ओनर\n✅ पूर्ण बॉट एक्सेस\n✅ अतिरिक्त ओनर मैनेज कर सकते हैं',
        additionalOwner: '⭐ स्टेटस: अतिरिक्त ओनर\n✅ ओनर कमांड उपयोग कर सकते हैं\n❌ ओनर मैनेज नहीं कर सकते',
        regularUser: '👤 स्टेटस: नियमित यूजर\n❌ कोई ओनर अनुमति नहीं',
        failed: '❌ ओनर स्टेटस चेक करने में विफल।\n\nएरर:'
    },
    ng: {
        user: '👤 User:',
        you: '👤 You:',
        mainOwner: '👑 Status: Main Owner\n✅ Full bot access\n✅ Fit manage additional owners',
        additionalOwner: '⭐ Status: Additional Owner\n✅ Fit use owner commands\n❌ No fit manage owners',
        regularUser: '👤 Status: Regular User\n❌ No get owner permission',
        failed: '❌ E no work to check owner status.\n\nWahala:'
    }
};

export default {
    name: 'checkowner',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        try {
            // Get mentioned users or check self
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
            const targetJid = mentioned.length > 0 ? mentioned[0] : sender;
            const targetNumber = targetJid.split('@')[0].replace(/\D/g, '');
            
            const botJid = sock.user?.id?.replace(/:\d+/, '') || '';
            
            // Check if target is owner
            const isOwner = isOwnerOrAdditional(targetJid, botJid, config.ownerNumber, config.ownerJid, false);
            
            // Check if main owner
            const isMainOwner = targetJid === config.ownerJid ||
                               targetNumber === config.ownerNumber;
            
            let response = '';
            if (mentioned.length > 0) {
                response = `${t.user} @${targetNumber}\n\n`;
            } else {
                response = `${t.you} @${targetNumber}\n\n`;
            }
            
            if (isMainOwner) {
                response += t.mainOwner;
            } else if (isOwner) {
                response += t.additionalOwner;
            } else {
                response += t.regularUser;
            }
            
            await sock.sendMessage(from, { 
                text: response,
                mentions: [targetJid]
            });
            
        } catch (error) {
            console.error('Error checking owner:', error);
            await sock.sendMessage(from, { 
                text: `${t.failed} ${error.message}`
            });
        }
    }
};
