import { getGroupLanguage } from '../../utils/language.js';
import { isAntideleteEnabled, enableAntidelete, disableAntidelete } from '../../utils/antideleteConfig.js';
import { isAdmin } from '../../utils/helpers.js';
import { isOwnerOrAdditional } from '../../utils/ownerManager.js';
import { config } from '../../config.js';

const responses = {
    en: {
        usage: '🛡️ Anti-Delete\n\nAutomatically repost deleted messages.\n\nUsage:\n.antidelete on - Enable anti-delete\n.antidelete off - Disable anti-delete\n.antidelete - Check status',
        enabled: '✅ Anti-delete enabled!\n\nDeleted messages will be automatically reposted.',
        disabled: '❌ Anti-delete disabled!\n\nDeleted messages will not be reposted.',
        status: '📊 Anti-Delete Status\n\nCurrent status: {status}',
        on: 'Enabled ✅',
        off: 'Disabled ❌',
        adminOnly: '❌ Only admins can configure anti-delete.',
        groupOnly: '❌ This command can only be used in groups.'
    },
    it: {
        usage: '🛡️ Anti-Cancellazione\n\nRipubblica automaticamente i messaggi cancellati.\n\nUso:\n.antidelete on - Attiva anti-cancellazione\n.antidelete off - Disattiva anti-cancellazione\n.antidelete - Controlla stato',
        enabled: '✅ Anti-cancellazione attivata!\n\nI messaggi cancellati verranno ripubblicati automaticamente.',
        disabled: '❌ Anti-cancellazione disattivata!\n\nI messaggi cancellati non verranno ripubblicati.',
        status: '📊 Stato Anti-Cancellazione\n\nStato attuale: {status}',
        on: 'Attivata ✅',
        off: 'Disattivata ❌',
        adminOnly: '❌ Solo gli admin possono configurare l\'anti-cancellazione.',
        groupOnly: '❌ Questo comando può essere usato solo nei gruppi.'
    },
    ru: {
        usage: '🛡️ Анти-Удаление\n\nАвтоматически переотправлять удаленные сообщения.\n\nИспользование:\n.antidelete on - Включить анти-удаление\n.antidelete off - Отключить анти-удаление\n.antidelete - Проверить статус',
        enabled: '✅ Анти-удаление включено!\n\nУдаленные сообщения будут автоматически переотправлены.',
        disabled: '❌ Анти-удаление отключено!\n\nУдаленные сообщения не будут переотправлены.',
        status: '📊 Статус Анти-Удаления\n\nТекущий статус: {status}',
        on: 'Включено ✅',
        off: 'Отключено ❌',
        adminOnly: '❌ Только администраторы могут настраивать анти-удаление.',
        groupOnly: '❌ Эта команда может использоваться только в группах.'
    },
    es: {
        usage: '🛡️ Anti-Eliminación\n\nRepublicar automáticamente mensajes eliminados.\n\nUso:\n.antidelete on - Activar anti-eliminación\n.antidelete off - Desactivar anti-eliminación\n.antidelete - Verificar estado',
        enabled: '✅ ¡Anti-eliminación activada!\n\nLos mensajes eliminados se republicarán automáticamente.',
        disabled: '❌ ¡Anti-eliminación desactivada!\n\nLos mensajes eliminados no se republicarán.',
        status: '📊 Estado Anti-Eliminación\n\nEstado actual: {status}',
        on: 'Activada ✅',
        off: 'Desactivada ❌',
        adminOnly: '❌ Solo los administradores pueden configurar anti-eliminación.',
        groupOnly: '❌ Este comando solo se puede usar en grupos.'
    },
    pt: {
        usage: '🛡️ Anti-Exclusão\n\nRepublicar automaticamente mensagens excluídas.\n\nUso:\n.antidelete on - Ativar anti-exclusão\n.antidelete off - Desativar anti-exclusão\n.antidelete - Verificar status',
        enabled: '✅ Anti-exclusão ativada!\n\nMensagens excluídas serão republicadas automaticamente.',
        disabled: '❌ Anti-exclusão desativada!\n\nMensagens excluídas não serão republicadas.',
        status: '📊 Status Anti-Exclusão\n\nStatus atual: {status}',
        on: 'Ativada ✅',
        off: 'Desativada ❌',
        adminOnly: '❌ Apenas administradores podem configurar anti-exclusão.',
        groupOnly: '❌ Este comando só pode ser usado em grupos.'
    },
    ar: {
        usage: '🛡️ مضاد الحذف\n\nإعادة نشر الرسائل المحذوفة تلقائياً.\n\nالاستخدام:\n.antidelete on - تفعيل مضاد الحذف\n.antidelete off - تعطيل مضاد الحذف\n.antidelete - التحقق من الحالة',
        enabled: '✅ تم تفعيل مضاد الحذف!\n\nسيتم إعادة نشر الرسائل المحذوفة تلقائياً.',
        disabled: '❌ تم تعطيل مضاد الحذف!\n\nلن يتم إعادة نشر الرسائل المحذوفة.',
        status: '📊 حالة مضاد الحذف\n\nالحالة الحالية: {status}',
        on: 'مفعّل ✅',
        off: 'معطّل ❌',
        adminOnly: '❌ المشرفون فقط يمكنهم تكوين مضاد الحذف.',
        groupOnly: '❌ هذا الأمر يمكن استخدامه في المجموعات فقط.'
    },
    hi: {
        usage: '🛡️ एंटी-डिलीट\n\nडिलीट किए गए मैसेज को ऑटोमैटिक रीपोस्ट करें।\n\nउपयोग:\n.antidelete on - एंटी-डिलीट चालू करें\n.antidelete off - एंटी-डिलीट बंद करें\n.antidelete - स्टेटस चेक करें',
        enabled: '✅ एंटी-डिलीट चालू हो गया!\n\nडिलीट किए गए मैसेज ऑटोमैटिक रीपोस्ट होंगे।',
        disabled: '❌ एंटी-डिलीट बंद हो गया!\n\nडिलीट किए गए मैसेज रीपोस्ट नहीं होंगे।',
        status: '📊 एंटी-डिलीट स्टेटस\n\nवर्तमान स्थिति: {status}',
        on: 'चालू ✅',
        off: 'बंद ❌',
        adminOnly: '❌ केवल एडमिन ही एंटी-डिलीट कॉन्फ़िगर कर सकते हैं।',
        groupOnly: '❌ यह कमांड केवल ग्रुप में उपयोग की जा सकती है।'
    },
    ng: {
        usage: '🛡️ Anti-Delete\n\nAutomatically repost deleted messages.\n\nHow to use:\n.antidelete on - Turn on anti-delete\n.antidelete off - Turn off anti-delete\n.antidelete - Check status',
        enabled: '✅ Anti-delete don turn on!\n\nDeleted messages go dey repost automatically.',
        disabled: '❌ Anti-delete don turn off!\n\nDeleted messages no go repost.',
        status: '📊 Anti-Delete Status\n\nCurrent status: {status}',
        on: 'On ✅',
        off: 'Off ❌',
        adminOnly: '❌ Na only admin fit configure anti-delete.',
        groupOnly: '❌ This command fit only work for group.'
    }
};

export default {
    name: 'antidelete',
    groupOnly: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        try {
            // Check if user is admin or owner
            const botJid = sock.user?.id?.replace(/:\d+/, '') || '';
            const isOwner = isOwnerOrAdditional(sender, botJid, config.ownerNumber, config.ownerJid, msg.key.fromMe);
            const isUserAdmin = await isAdmin(sock, from, sender);
            
            if (!isOwner && !isUserAdmin) {
                return await sock.sendMessage(from, {
                    text: t.adminOnly
                });
            }
            
            // No arguments - show status
            if (args.length === 0) {
                const enabled = isAntideleteEnabled(from);
                const status = enabled ? t.on : t.off;
                
                return await sock.sendMessage(from, {
                    text: t.status.replace('{status}', status) + '\n\n' + t.usage
                });
            }
            
            const action = args[0].toLowerCase();
            
            if (action === 'on' || action === 'enable' || action === 'attiva') {
                enableAntidelete(from);
                
                await sock.sendMessage(from, {
                    text: t.enabled
                });
            } else if (action === 'off' || action === 'disable' || action === 'disattiva') {
                disableAntidelete(from);
                
                await sock.sendMessage(from, {
                    text: t.disabled
                });
            } else {
                await sock.sendMessage(from, {
                    text: t.usage
                });
            }
            
        } catch (error) {
            console.error('[ANTIDELETE] Error:', error.message);
            await sock.sendMessage(from, {
                text: `❌ Error: ${error.message}`
            });
        }
    }
};
