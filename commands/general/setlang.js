import { setGroupLanguage, getGroupLanguage, t } from '../../utils/language.js';
import { isAdmin } from '../../utils/helpers.js';
import { isOwnerOrAdditional } from '../../utils/ownerManager.js';
import { config } from '../../config.js';

export default {
    name: 'setlang',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        
        try {
            // Check permissions for groups
            if (isGroup) {
                const botJid = sock.user?.id?.replace(/:\d+/, '') || '';
                const isOwner = isOwnerOrAdditional(sender, botJid, config.ownerNumber, config.ownerJid, msg.key.fromMe);
                const isUserAdmin = await isAdmin(sock, from, sender);
                
                if (!isOwner && !isUserAdmin) {
                    return await sock.sendMessage(from, {
                        text: t(from, 'adminOnly')
                    });
                }
            }
            // In private chats, anyone can set their own language preference
            
            const lang = args[0]?.toLowerCase();
            
            if (!lang) {
                const currentLang = getGroupLanguage(from);
                const usage = t(from, 'langUsage');
                const current = t(from, 'langCurrent');
                
                return await sock.sendMessage(from, {
                    text: `${current}\n\n${usage}`
                });
            }
            
            if (lang !== 'en' && lang !== 'it' && lang !== 'ru' && lang !== 'es' && lang !== 'pt' && lang !== 'ar' && lang !== 'hi') {
                return await sock.sendMessage(from, {
                    text: t(from, 'langUsage')
                });
            }
            
            // Set language
            setGroupLanguage(from, lang);
            
            // Send confirmation in the NEW language
            const confirmMsg = lang === 'en' 
                ? '✅ Language set to English!\n\nAll commands will now respond in English.'
                : lang === 'it'
                ? '✅ Lingua impostata su Italiano!\n\nTutti i comandi risponderanno ora in Italiano.'
                : lang === 'ru'
                ? '✅ Язык установлен на Русский!\n\nВсе команды теперь будут отвечать на русском языке.'
                : lang === 'es'
                ? '✅ ¡Idioma establecido en Español!\n\nTodos los comandos ahora responderán en Español.'
                : lang === 'pt'
                ? '✅ Idioma definido para Português!\n\nTodos os comandos agora responderão em Português.'
                : lang === 'ar'
                ? '✅ تم تعيين اللغة إلى العربية!\n\nجميع الأوامر ستستجيب الآن باللغة العربية.'
                : '✅ भाषा हिंदी में सेट कर दी गई है!\n\nसभी कमांड अब हिंदी में जवाब देंगे।';
            
            await sock.sendMessage(from, {
                text: confirmMsg
            });
            
        } catch (error) {
            console.error('[SETLANG] Error:', error.message);
            await sock.sendMessage(from, {
                text: t(from, 'error') + ' ' + error.message
            });
        }
    }
};
