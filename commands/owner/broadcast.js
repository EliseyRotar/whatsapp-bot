import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        usage: '❌ Usage: .broadcast <message>',
        broadcasting: '📢 Broadcasting to {count} groups...',
        complete: '✅ Broadcast complete!\n\n✓ Success: {success}\n✗ Failed: {failed}',
        failed: '❌ Broadcast failed:',
        header: '📢 BROADCAST 📢\n\n'
    },
    it: {
        usage: '❌ Uso: .broadcast <messaggio>',
        broadcasting: '📢 Broadcasting a {count} gruppi...',
        complete: '✅ Broadcast completato!\n\n✓ Successo: {success}\n✗ Falliti: {failed}',
        failed: '❌ Broadcast fallito:',
        header: '📢 BROADCAST 📢\n\n'
    },
    ru: {
        usage: '❌ Использование: .broadcast <сообщение>',
        broadcasting: '📢 Рассылка в {count} групп...',
        complete: '✅ Рассылка завершена!\n\n✓ Успешно: {success}\n✗ Не удалось: {failed}',
        failed: '❌ Рассылка не удалась:',
        header: '📢 РАССЫЛКА 📢\n\n'
    },
    es: {
        usage: '❌ Uso: .broadcast <mensaje>',
        broadcasting: '📢 Transmitiendo a {count} grupos...',
        complete: '✅ ¡Transmisión completa!\n\n✓ Éxito: {success}\n✗ Fallidos: {failed}',
        failed: '❌ Transmisión fallida:',
        header: '📢 TRANSMISIÓN 📢\n\n'
    },
    pt: {
        usage: '❌ Uso: .broadcast <mensagem>',
        broadcasting: '📢 Transmitindo para {count} grupos...',
        complete: '✅ Transmissão completa!\n\n✓ Sucesso: {success}\n✗ Falhados: {failed}',
        failed: '❌ Transmissão falhou:',
        header: '📢 TRANSMISSÃO 📢\n\n'
    },
    ar: {
        usage: '❌ الاستخدام: .broadcast <الرسالة>',
        broadcasting: '📢 البث لـ {count} جروب...',
        complete: '✅ البث اكتمل!\n\n✓ نجح: {success}\n✗ فشل: {failed}',
        failed: '❌ البث فشل:',
        header: '📢 بث 📢\n\n'
    },
    hi: {
        usage: '❌ उपयोग: .broadcast <मैसेज>',
        broadcasting: '📢 {count} ग्रुप में ब्रॉडकास्ट हो रहा है...',
        complete: '✅ ब्रॉडकास्ट पूर्ण!\n\n✓ सफल: {success}\n✗ विफल: {failed}',
        failed: '❌ ब्रॉडकास्ट विफल:',
        header: '📢 ब्रॉडकास्ट 📢\n\n'
    }
};

export default {
    name: 'broadcast',
    aliases: ['bc'],
    ownerOnly: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        if (args.length === 0) {
            return await sock.sendMessage(from, { 
                text: t.usage
            });
        }
        
        const message = args.join(' ');
        
        try {
            // Get all chats
            const chats = await sock.groupFetchAllParticipating();
            const groups = Object.values(chats);
            
            await sock.sendMessage(from, { 
                text: t.broadcasting.replace('{count}', groups.length)
            });
            
            let success = 0;
            let failed = 0;
            
            // IMPORTANT: Add delays between broadcasts to prevent WhatsApp bans
            const BROADCAST_DELAY = 3000; // 3 seconds between each group
            
            for (let i = 0; i < groups.length; i++) {
                const group = groups[i];
                try {
                    await sock.sendMessage(group.id, { 
                        text: `${t.header}${message}`
                    });
                    success++;
                    
                    // Wait between messages (except for last one)
                    if (i < groups.length - 1) {
                        await new Promise(resolve => setTimeout(resolve, BROADCAST_DELAY));
                    }
                } catch (error) {
                    console.error(`[BROADCAST] Failed to send to ${group.id}:`, error.message);
                    failed++;
                }
            }
            
            await sock.sendMessage(from, { 
                text: t.complete.replace('{success}', success).replace('{failed}', failed)
            });
        } catch (error) {
            await sock.sendMessage(from, { 
                text: `${t.failed} ${error.message}`
            });
        }
    }
};
