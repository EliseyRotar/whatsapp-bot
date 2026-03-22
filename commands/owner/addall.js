import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        usage: `╔═══════════════════════════════════╗
║   📋 ADDALL COMMAND TUTORIAL   ║
╚═══════════════════════════════════╝

🔐 OWNER ONLY - Bulk add members

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 USAGE:
   .addall [source_group_jid]
   
   Run this command in the TARGET group where you want to add members.
   The source_group_jid is the JID of the group you want to copy members from.

💡 HOW TO GET GROUP JID:
   1. Go to the source group
   2. Use .jid command
   3. Copy the group JID (e.g., 120363xxxxx@g.us)
   4. Go to target group
   5. Use .addall [paste_jid_here]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ IMPORTANT NOTES:
   • Bot MUST be admin in target group
   • Adds members one by one individually
   • Skips members already in target group
   • Skips bot itself
   • May fail for users with privacy settings
   • Takes time to avoid spam detection

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔧 SETUP:
   1. Make bot admin in target group
   2. Get source group JID with .jid
   3. Run .addall in target group
   4. Wait for completion

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 EXAMPLE:
   .addall 120363423949011615@g.us`,
        invalidJid: '❌ Invalid group JID format.\n\nPlease provide a valid group JID (e.g., 120363423949011615@g.us)\n\nUse .jid command in the source group to get its JID.',
        notGroup: '❌ This command can only be used in groups.',
        fetchingMembers: '🔄 Fetching members from source group...',
        noMembers: '❌ Could not fetch members from source group.\n\nMake sure:\n• The bot is a member of the source group\n• The group JID is correct',
        starting: '🚀 Starting bulk add operation...\n\n📊 Total members to add: {count}\n⏱️ Estimated time: {time} minutes\n\n⚠️ Please wait, this may take a while...',
        progress: '📊 Progress: {current}/{total}\n✅ Added: {success}\n❌ Failed: {failed}\n⏭️ Skipped: {skipped}',
        complete: `╔═══════════════════════════════════╗
║   ✅ BULK ADD COMPLETE   ║
╚═══════════════════════════════════╝

📊 FINAL RESULTS:

✅ Successfully added: {success}
❌ Failed to add: {failed}
⏭️ Skipped (already members): {skipped}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏱️ Total time: {time} seconds`,
        errorFetching: '❌ Error fetching group metadata: {error}',
        addDelay: 5000 // Delay between adds in milliseconds (5 seconds - increased to avoid rate limits)
    },
    it: {
        usage: `╔═══════════════════════════════════╗
║   📋 TUTORIAL COMANDO ADDALL   ║
╚═══════════════════════════════════╝

🔐 SOLO PROPRIETARIO - Aggiunta massiva membri

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 USO:
   .addall [jid_gruppo_origine]
   
💡 COME OTTENERE JID GRUPPO:
   1. Vai al gruppo origine
   2. Usa comando .jid
   3. Copia il JID del gruppo
   4. Vai al gruppo destinazione
   5. Usa .addall [incolla_jid]

⚠️ NOTE IMPORTANTI:
   • Bot deve essere admin nel gruppo destinazione
   • Aggiunge membri uno per uno con ritardi
   • Salta membri già presenti
   • Può fallire per utenti con impostazioni privacy`,
        invalidJid: '❌ Formato JID gruppo non valido.\n\nFornisci un JID gruppo valido (es. 120363423949011615@g.us)',
        notGroup: '❌ Questo comando può essere usato solo nei gruppi.',
        fetchingMembers: '🔄 Recupero membri dal gruppo origine...',
        noMembers: '❌ Impossibile recuperare membri dal gruppo origine.',
        starting: '🚀 Inizio operazione aggiunta massiva...\n\n📊 Membri totali da aggiungere: {count}\n⏱️ Tempo stimato: {time} minuti',
        progress: '📊 Progresso: {current}/{total}\n✅ Aggiunti: {success}\n❌ Falliti: {failed}\n⏭️ Saltati: {skipped}',
        complete: `╔═══════════════════════════════════╗
║   ✅ AGGIUNTA MASSIVA COMPLETATA   ║
╚═══════════════════════════════════╝

📊 RISULTATI FINALI:

✅ Aggiunti con successo: {success}
❌ Falliti: {failed}
⏭️ Saltati (già membri): {skipped}

⏱️ Tempo totale: {time} secondi`,
        errorFetching: '❌ Errore recupero metadati gruppo: {error}',
        addDelay: 5000
    },
    ar: {
        usage: `╔═══════════════════════════════════╗
║   📋 شرح أمر ADDALL   ║
╚═══════════════════════════════════╝

🔐 المالك فقط - إضافة جماعية للأعضاء

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 الاستخدام:
   .addall [jid_المجموعة_المصدر]
   
💡 كيفية الحصول على JID المجموعة:
   1. روح للمجموعة المصدر
   2. استخدم أمر .jid
   3. انسخ JID المجموعة
   4. روح للمجموعة الهدف
   5. استخدم .addall [الصق_jid]

⚠️ ملاحظات مهمة:
   • البوت لازم يكون أدمن في المجموعة الهدف
   • بيضيف الأعضاء واحد واحد مع تأخير
   • بيتخطى الأعضاء الموجودين فعلاً
   • ممكن يفشل للمستخدمين اللي عندهم إعدادات خصوصية`,
        invalidJid: '❌ صيغة JID المجموعة غلط.\n\nاكتب JID مجموعة صحيح (مثلاً 120363423949011615@g.us)',
        notGroup: '❌ الأمر ده بيشتغل في الجروبات بس.',
        fetchingMembers: '🔄 جاري جلب الأعضاء من المجموعة المصدر...',
        noMembers: '❌ مش قادر أجيب الأعضاء من المجموعة المصدر.',
        starting: '🚀 بدء عملية الإضافة الجماعية...\n\n📊 إجمالي الأعضاء للإضافة: {count}\n⏱️ الوقت المتوقع: {time} دقيقة',
        progress: '📊 التقدم: {current}/{total}\n✅ اتضافوا: {success}\n❌ فشلوا: {failed}\n⏭️ اتخطوا: {skipped}',
        complete: `╔═══════════════════════════════════╗
║   ✅ الإضافة الجماعية اكتملت   ║
╚═══════════════════════════════════╝

📊 النتائج النهائية:

✅ اتضافوا بنجاح: {success}
❌ فشلوا: {failed}
⏭️ اتخطوا (موجودين فعلاً): {skipped}

⏱️ الوقت الكلي: {time} ثانية`,
        errorFetching: '❌ خطأ في جلب بيانات المجموعة: {error}',
        addDelay: 5000
    },
    hi: {
        usage: `╔═══════════════════════════════════╗
║   📋 ADDALL कमांड ट्यूटोरियल   ║
╚═══════════════════════════════════╝

🔐 केवल ओनर - बल्क में मेंबर जोड़ें

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 उपयोग:
   .addall [source_group_jid]
   
   इस कमांड को TARGET ग्रुप में चलाएं जहां आप मेंबर जोड़ना चाहते हैं।
   source_group_jid उस ग्रुप का JID है जिससे आप मेंबर कॉपी करना चाहते हैं।

💡 ग्रुप JID कैसे प्राप्त करें:
   1. सोर्स ग्रुप में जाएं
   2. .jid कमांड का उपयोग करें
   3. ग्रुप JID कॉपी करें (जैसे 120363xxxxx@g.us)
   4. टारगेट ग्रुप में जाएं
   5. .addall [jid_यहां_पेस्ट_करें] का उपयोग करें

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ महत्वपूर्ण नोट्स:
   • बॉट को टारगेट ग्रुप में एडमिन होना चाहिए
   • मेंबर को एक-एक करके जोड़ता है
   • पहले से मौजूद मेंबर को स्किप करता है
   • बॉट खुद को स्किप करता है
   • प्राइवेसी सेटिंग वाले यूज़र के लिए फेल हो सकता है
   • स्पैम डिटेक्शन से बचने के लिए समय लगता है

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔧 सेटअप:
   1. टारगेट ग्रुप में बॉट को एडमिन बनाएं
   2. .jid से सोर्स ग्रुप JID प्राप्त करें
   3. टारगेट ग्रुप में .addall चलाएं
   4. पूरा होने तक प्रतीक्षा करें

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 उदाहरण:
   .addall 120363423949011615@g.us`,
        invalidJid: '❌ अमान्य ग्रुप JID फॉर्मेट।\n\nकृपया एक मान्य ग्रुप JID प्रदान करें (जैसे 120363423949011615@g.us)\n\nसोर्स ग्रुप में .jid कमांड का उपयोग करके इसका JID प्राप्त करें।',
        notGroup: '❌ यह कमांड केवल ग्रुप में उपयोग की जा सकती है।',
        fetchingMembers: '🔄 सोर्स ग्रुप से मेंबर प्राप्त कर रहे हैं...',
        noMembers: '❌ सोर्स ग्रुप से मेंबर प्राप्त नहीं कर सके।\n\nसुनिश्चित करें:\n• बॉट सोर्स ग्रुप का मेंबर है\n• ग्रुप JID सही है',
        starting: '🚀 बल्क ऐड ऑपरेशन शुरू हो रहा है...\n\n📊 जोड़ने के लिए कुल मेंबर: {count}\n⏱️ अनुमानित समय: {time} मिनट\n\n⚠️ कृपया प्रतीक्षा करें, इसमें समय लग सकता है...',
        progress: '📊 प्रगति: {current}/{total}\n✅ जोड़े गए: {success}\n❌ फेल: {failed}\n⏭️ स्किप किए गए: {skipped}',
        complete: `╔═══════════════════════════════════╗
║   ✅ बल्क ऐड पूर्ण   ║
╚═══════════════════════════════════╝

📊 अंतिम परिणाम:

✅ सफलतापूर्वक जोड़े गए: {success}
❌ जोड़ने में फेल: {failed}
⏭️ स्किप किए गए (पहले से मेंबर): {skipped}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏱️ कुल समय: {time} सेकंड`,
        errorFetching: '❌ ग्रुप मेटाडेटा प्राप्त करने में त्रुटि: {error}',
        addDelay: 5000
    }
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
    name: 'addall',
    ownerOnly: true,
    groupOnly: true,
    botAdminRequired: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        // Check if command is used in a group
        if (!from.endsWith('@g.us')) {
            return await sock.sendMessage(from, { text: t.notGroup });
        }
        
        // Show usage if no args
        if (args.length === 0) {
            return await sock.sendMessage(from, { text: t.usage });
        }
        
        const sourceGroupJid = args[0];
        
        // Validate group JID format
        if (!sourceGroupJid.endsWith('@g.us')) {
            return await sock.sendMessage(from, { text: t.invalidJid });
        }
        
        try {
            // Notify user we're fetching members
            await sock.sendMessage(from, { text: t.fetchingMembers });
            
            // Get members from source group
            let sourceMetadata;
            try {
                sourceMetadata = await sock.groupMetadata(sourceGroupJid);
            } catch (error) {
                console.error('[ADDALL] Error fetching source group metadata:', error.message);
                return await sock.sendMessage(from, { 
                    text: t.errorFetching.replace('{error}', error.message)
                });
            }
            
            // Get members from target group (current group)
            const targetMetadata = await sock.groupMetadata(from);
            
            // Get bot's JID
            const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';
            
            // Extract participant JIDs
            const sourceMembers = sourceMetadata.participants.map(p => p.id);
            const targetMembers = new Set(targetMetadata.participants.map(p => p.id));
            
            // Filter out members who are already in target group and the bot itself
            const membersToAdd = sourceMembers.filter(jid => 
                !targetMembers.has(jid) && jid !== botJid
            );
            
            if (membersToAdd.length === 0) {
                return await sock.sendMessage(from, { text: t.noMembers });
            }
            
            // Calculate estimated time
            const estimatedMinutes = Math.ceil((membersToAdd.length * t.addDelay) / 60000);
            
            // Notify user about the operation
            await sock.sendMessage(from, { 
                text: t.starting
                    .replace('{count}', membersToAdd.length)
                    .replace('{time}', estimatedMinutes)
            });
            
            // Track results
            let successCount = 0;
            let failedCount = 0;
            let skippedCount = 0;
            const startTime = Date.now();
            
            // Add members one by one with delay
            for (let i = 0; i < membersToAdd.length; i++) {
                const memberJid = membersToAdd[i];
                let retryCount = 0;
                let added = false;
                
                // Retry logic with exponential backoff for rate limits
                while (!added && retryCount < 3) {
                    try {
                        await sock.groupParticipantsUpdate(from, [memberJid], 'add');
                        successCount++;
                        added = true;
                        console.log(`[ADDALL] Successfully added: ${memberJid}`);
                    } catch (error) {
                        console.error(`[ADDALL] Failed to add ${memberJid}:`, error.message);
                        
                        // Check if user is already a member (might have joined during the process)
                        if (error.message.includes('already') || error.message.includes('participant-exists')) {
                            skippedCount++;
                            added = true; // Don't retry
                        } else if (error.message.includes('rate-overlimit')) {
                            retryCount++;
                            if (retryCount < 3) {
                                // Exponential backoff: 10s, 20s, 40s
                                const backoffDelay = 10000 * Math.pow(2, retryCount - 1);
                                console.log(`[ADDALL] Rate limit hit, waiting ${backoffDelay/1000}s before retry ${retryCount}/3`);
                                await sleep(backoffDelay);
                            } else {
                                failedCount++;
                                console.log(`[ADDALL] Max retries reached for ${memberJid}`);
                            }
                        } else {
                            failedCount++;
                            added = true; // Don't retry for other errors
                        }
                    }
                }
                
                // Send progress update every 10 members
                if ((i + 1) % 10 === 0 || i === membersToAdd.length - 1) {
                    await sock.sendMessage(from, {
                        text: t.progress
                            .replace('{current}', i + 1)
                            .replace('{total}', membersToAdd.length)
                            .replace('{success}', successCount)
                            .replace('{failed}', failedCount)
                            .replace('{skipped}', skippedCount)
                    });
                }
                
                // Add delay between additions to avoid spam detection
                if (i < membersToAdd.length - 1) {
                    await sleep(t.addDelay);
                }
            }
            
            // Calculate total time
            const totalTime = Math.round((Date.now() - startTime) / 1000);
            
            // Send final results
            await sock.sendMessage(from, {
                text: t.complete
                    .replace('{success}', successCount)
                    .replace('{failed}', failedCount)
                    .replace('{skipped}', skippedCount)
                    .replace('{time}', totalTime)
            });
            
        } catch (error) {
            console.error('[ADDALL] Error:', error.message);
            await sock.sendMessage(from, { 
                text: `❌ Error: ${error.message}` 
            });
        }
    }
};
