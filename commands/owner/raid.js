import { sleep } from '../../utils/helpers.js';
import { config } from '../../config.js';
import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        confirm: '⚠️ RAID MODE ⚠️\n\nThis will:\n- Change group name\n- Change group description\n- Demote all admins (except you)\n- Spam 15 messages (reduced to prevent bans)\n- Reset group invite link\n- Lock group settings\n\n⚠️ WARNING: Using raid commands can result in WhatsApp bans!\n\nTo proceed: .raid confirm',
        starting: 'raid starting...',
        complete: 'raid complete\n\ngroup status:\n- name changed\n- description changed\n- {admins} admins demoted\n- {spam} messages sent\n- invite link reset\n- group locked\n\nraided by eli6 bot',
        failed: 'raid failed: {error}\n\nsome actions may have completed.'
    },
    it: {
        confirm: '⚠️ MODALITÀ RAID ⚠️\n\nQuesto farà:\n- Cambiare nome gruppo\n- Cambiare descrizione gruppo\n- Rimuovere tutti gli admin (tranne te)\n- Spam 15 messaggi (ridotto per evitare ban)\n- Resettare link invito gruppo\n- Bloccare impostazioni gruppo\n\n⚠️ ATTENZIONE: Usare comandi raid può causare ban WhatsApp!\n\nPer procedere: .raid confirm',
        starting: 'raid in corso...',
        complete: 'raid completato\n\nstato gruppo:\n- nome cambiato\n- descrizione cambiata\n- {admins} admin rimossi\n- {spam} messaggi inviati\n- link invito resettato\n- gruppo bloccato\n\nraidato da eli6 bot',
        failed: 'raid fallito: {error}\n\nalcune azioni potrebbero essere state completate.'
    },
    ru: {
        confirm: '⚠️ РЕЖИМ РЕЙДА ⚠️\n\nЭто выполнит:\n- Изменение названия группы\n- Изменение описания группы\n- Понижение всех администраторов (кроме вас)\n- Спам 15 сообщений (уменьшено для предотвращения банов)\n- Сброс ссылки-приглашения группы\n- Блокировка настроек группы\n\n⚠️ ВНИМАНИЕ: Использование команд рейда может привести к бану WhatsApp!\n\nДля продолжения: .raid confirm',
        starting: 'рейд начинается...',
        complete: 'рейд завершён\n\nстатус группы:\n- название изменено\n- описание изменено\n- {admins} администраторов понижено\n- {spam} сообщений отправлено\n- ссылка-приглашение сброшена\n- группа заблокирована\n\nрейд от eli6 bot',
        failed: 'рейд не удался: {error}\n\nнекоторые действия могли быть выполнены.'
    },
    es: {
        confirm: '⚠️ MODO RAID ⚠️\n\nEsto hará:\n- Cambiar nombre del grupo\n- Cambiar descripción del grupo\n- Degradar todos los administradores (excepto tú)\n- Spam 15 mensajes (reducido para evitar baneos)\n- Restablecer enlace de invitación del grupo\n- Bloquear configuración del grupo\n\n⚠️ ADVERTENCIA: ¡Usar comandos raid puede resultar en baneos de WhatsApp!\n\nPara proceder: .raid confirm',
        starting: 'raid iniciando...',
        complete: 'raid completado\n\nestado del grupo:\n- nombre cambiado\n- descripción cambiada\n- {admins} administradores degradados\n- {spam} mensajes enviados\n- enlace de invitación restablecido\n- grupo bloqueado\n\nraideado por eli6 bot',
        failed: 'raid fallido: {error}\n\nalgunas acciones pueden haberse completado.'
    },
    pt: {
        confirm: '⚠️ MODO RAID ⚠️\n\nIsso fará:\n- Alterar nome do grupo\n- Alterar descrição do grupo\n- Rebaixar todos os administradores (exceto você)\n- Spam 15 mensagens (reduzido para evitar banimentos)\n- Redefinir link de convite do grupo\n- Bloquear configurações do grupo\n\n⚠️ AVISO: Usar comandos raid pode resultar em banimentos do WhatsApp!\n\nPara prosseguir: .raid confirm',
        starting: 'raid iniciando...',
        complete: 'raid concluído\n\nstatus do grupo:\n- nome alterado\n- descrição alterada\n- {admins} administradores rebaixados\n- {spam} mensagens enviadas\n- link de convite redefinido\n- grupo bloqueado\n\nraideado por eli6 bot',
        failed: 'raid falhou: {error}\n\nalgumas ações podem ter sido concluídas.'
    },
    ar: {
        confirm: '⚠️ وضع الهجوم ⚠️\n\nده هيعمل:\n- تغيير اسم الجروب\n- تغيير وصف الجروب\n- إزالة كل الأدمنز (ماعداك)\n- سبام 15 رسالة (مقلل عشان ما تتبند)\n- إعادة تعيين رابط الدعوة\n- قفل إعدادات الجروب\n\n⚠️ تحذير: استخدام أوامر الهجوم ممكن يسبب بان من واتساب!\n\nللمتابعة: .raid confirm',
        starting: 'الهجوم بدأ...',
        complete: 'الهجوم اكتمل\n\nحالة الجروب:\n- الاسم اتغير\n- الوصف اتغير\n- {admins} أدمن اتشال\n- {spam} رسالة اتبعتت\n- رابط الدعوة اتغير\n- الجروب اتقفل\n\nتم الهجوم بواسطة eli6 bot',
        failed: 'الهجوم فشل: {error}\n\nبعض الإجراءات ممكن تكون اتنفذت.'
    },
    hi: {
        confirm: '⚠️ रेड मोड ⚠️\n\nयह करेगा:\n- ग्रुप का नाम बदलें\n- ग्रुप का विवरण बदलें\n- सभी एडमिन को डिमोट करें (आपको छोड़कर)\n- 15 मैसेज स्पैम करें (बैन से बचने के लिए कम किया गया)\n- ग्रुप इनवाइट लिंक रीसेट करें\n- ग्रुप सेटिंग्स लॉक करें\n\n⚠️ चेतावनी: रेड कमांड का उपयोग करने से WhatsApp बैन हो सकता है!\n\nजारी रखने के लिए: .raid confirm',
        starting: 'रेड शुरू हो रहा है...',
        complete: 'रेड पूरा हुआ\n\nग्रुप स्टेटस:\n- नाम बदला गया\n- विवरण बदला गया\n- {admins} एडमिन डिमोट किए गए\n- {spam} मैसेज भेजे गए\n- इनवाइट लिंक रीसेट किया गया\n- ग्रुप लॉक किया गया\n\neli6 बॉट द्वारा रेड किया गया',
        failed: 'रेड विफल: {error}\n\nकुछ एक्शन पूरे हो सकते हैं।'
    }
};

export default {
    name: 'raid',
    ownerOnly: true,
    groupOnly: true,
    botAdminRequired: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        try {
            // Confirmation check
            if (!args[0] || args[0].toLowerCase() !== 'confirm') {
                return await sock.sendMessage(from, { 
                    text: t.confirm
                });
            }
            
            console.log('[RAID] Starting raid sequence...');
            
            // Get group metadata
            const groupMetadata = await sock.groupMetadata(from);
            const participants = groupMetadata.participants;
            const botJid = sock.user.id.replace(/:\d+/, '');
            const ownerJid = msg.key.participant || msg.key.remoteJid;
            
            await sock.sendMessage(from, { 
                text: t.starting
            });
            
            await sleep(2000);
            
            // Step 1: Change group name
            console.log('[RAID] Changing group name...');
            try {
                await sock.groupUpdateSubject(from, 'raided');
                await sleep(500);
            } catch (error) {
                console.error('[RAID] Error changing name:', error.message);
            }
            
            // Step 2: Change group description
            console.log('[RAID] Changing group description...');
            try {
                await sock.groupUpdateDescription(from, 
                    'this group has been raided\n\n' +
                    'raided by eli6 bot'
                );
                await sleep(500);
            } catch (error) {
                console.error('[RAID] Error changing description:', error.message);
            }
            
            // Step 3: Demote all admins (except owner)
            console.log('[RAID] Demoting admins...');
            const admins = participants.filter(p => 
                (p.admin === 'admin' || p.admin === 'superadmin') && 
                p.id !== ownerJid && 
                p.id !== botJid &&
                !p.id.includes(botJid.split('@')[0])
            );
            
            if (admins.length > 0) {
                for (const admin of admins) {
                    try {
                        await sock.groupParticipantsUpdate(from, [admin.id], 'demote');
                        console.log(`[RAID] Demoted: ${admin.id}`);
                        await sleep(300);
                    } catch (error) {
                        console.error(`[RAID] Error demoting ${admin.id}:`, error.message);
                    }
                }
                await sleep(500);
            }
            
            // Step 4: Spam messages
            console.log('[RAID] Starting spam...');
            
            // REDUCED spam count and INCREASED delay to prevent bans
            const spamCount = 15; // Reduced from 30 to 15
            for (let i = 0; i < spamCount; i++) {
                try {
                    await sock.sendMessage(from, { text: 'raided by eli6 bot' });
                    await sleep(2000); // Increased from 100ms to 2000ms (2 seconds) to prevent bans
                } catch (error) {
                    console.error(`[RAID] Error sending spam ${i + 1}:`, error.message);
                }
            }
            
            await sleep(500);
            
            // Step 5: Reset invite link
            console.log('[RAID] Resetting invite link...');
            try {
                await sock.groupRevokeInvite(from);
                await sleep(500);
            } catch (error) {
                console.error('[RAID] Error resetting link:', error.message);
            }
            
            // Step 6: Lock group settings (only admins can send messages)
            console.log('[RAID] Locking group...');
            try {
                await sock.groupSettingUpdate(from, 'announcement');
                await sleep(500);
            } catch (error) {
                console.error('[RAID] Error locking group:', error.message);
            }
            
            // Final message
            await sleep(1000);
            
            const raidMessage = t.complete
                .replace('{admins}', admins.length)
                .replace('{spam}', spamCount);
            
            await sock.sendMessage(from, { text: raidMessage });
            
            console.log('[RAID] Raid sequence completed!');
            
        } catch (error) {
            console.error('[RAID] Critical error:', error.message);
            console.error('[RAID] Stack:', error.stack);
            
            await sock.sendMessage(from, { 
                text: t.failed.replace('{error}', error.message)
            }).catch(err => console.error('[RAID] Error sending error message:', err.message));
        }
    }
};
