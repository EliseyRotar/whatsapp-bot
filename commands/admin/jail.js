import { getGroupLanguage } from '../../utils/language.js';
import { isAdmin } from '../../utils/helpers.js';
import { isOwnerOrAdditional } from '../../utils/ownerManager.js';
import { config } from '../../config.js';
import fs from 'fs';
import path from 'path';

const mutedPath = path.join(process.cwd(), 'data', 'muted_users.json');

const responses = {
    en: {
        usage: '❌ Usage: .jail @user <minutes>\n\nExample: .jail @user 10',
        noMention: '❌ Please mention a user to jail!',
        invalidTime: '❌ Please provide a valid number of minutes (1-1440).',
        cantJailSelf: '❌ You cannot jail yourself!',
        cantJailAdmin: '❌ You cannot jail another admin!',
        cantJailOwner: '❌ You cannot jail the bot owner!',
        jailed: '🔒 JAILED!\n\n@{user} has been jailed for {minutes} minutes.\n\n🔇 They cannot send messages until released.\n⏰ Release time: {time}',
        alreadyJailed: '⚠️ @{user} is already jailed!\n\n⏰ Release time: {time}\n🕐 Remaining: {remaining} minutes',
        error: '❌ Failed to jail user: {error}'
    },
    it: {
        usage: '❌ Uso: .jail @utente <minuti>\n\nEsempio: .jail @utente 10',
        noMention: '❌ Per favore menziona un utente da imprigionare!',
        invalidTime: '❌ Fornisci un numero valido di minuti (1-1440).',
        cantJailSelf: '❌ Non puoi imprigionare te stesso!',
        cantJailAdmin: '❌ Non puoi imprigionare un altro admin!',
        cantJailOwner: '❌ Non puoi imprigionare il proprietario del bot!',
        jailed: '🔒 IMPRIGIONATO!\n\n@{user} è stato imprigionato per {minutes} minuti.\n\n🔇 Non può inviare messaggi fino al rilascio.\n⏰ Ora di rilascio: {time}',
        alreadyJailed: '⚠️ @{user} è già imprigionato!\n\n⏰ Ora di rilascio: {time}\n🕐 Rimanenti: {remaining} minuti',
        error: '❌ Impossibile imprigionare l\'utente: {error}'
    },
    ru: {
        usage: '❌ Использование: .jail @пользователь <минуты>\n\nПример: .jail @пользователь 10',
        noMention: '❌ Пожалуйста, упомяните пользователя для заключения!',
        invalidTime: '❌ Пожалуйста, укажите правильное количество минут (1-1440).',
        cantJailSelf: '❌ Вы не можете заключить себя!',
        cantJailAdmin: '❌ Вы не можете заключить другого админа!',
        cantJailOwner: '❌ Вы не можете заключить владельца бота!',
        jailed: '🔒 ЗАКЛЮЧЕН!\n\n@{user} был заключен на {minutes} минут.\n\n🔇 Он не может отправлять сообщения до освобождения.\n⏰ Время освобождения: {time}',
        alreadyJailed: '⚠️ @{user} уже заключен!\n\n⏰ Время освобождения: {time}\n🕐 Осталось: {remaining} минут',
        error: '❌ Не удалось заключить пользователя: {error}'
    },
    es: {
        usage: '❌ Uso: .jail @usuario <minutos>\n\nEjemplo: .jail @usuario 10',
        noMention: '❌ ¡Por favor menciona un usuario para encarcelar!',
        invalidTime: '❌ Por favor proporciona un número válido de minutos (1-1440).',
        cantJailSelf: '❌ ¡No puedes encarcelarte a ti mismo!',
        cantJailAdmin: '❌ ¡No puedes encarcelar a otro admin!',
        cantJailOwner: '❌ ¡No puedes encarcelar al dueño del bot!',
        jailed: '🔒 ¡ENCARCELADO!\n\n@{user} ha sido encarcelado por {minutes} minutos.\n\n🔇 No puede enviar mensajes hasta ser liberado.\n⏰ Hora de liberación: {time}',
        alreadyJailed: '⚠️ ¡@{user} ya está encarcelado!\n\n⏰ Hora de liberación: {time}\n🕐 Restante: {remaining} minutos',
        error: '❌ Error al encarcelar usuario: {error}'
    },
    pt: {
        usage: '❌ Uso: .jail @usuário <minutos>\n\nExemplo: .jail @usuário 10',
        noMention: '❌ Por favor mencione um usuário para prender!',
        invalidTime: '❌ Por favor forneça um número válido de minutos (1-1440).',
        cantJailSelf: '❌ Você não pode prender a si mesmo!',
        cantJailAdmin: '❌ Você não pode prender outro admin!',
        cantJailOwner: '❌ Você não pode prender o dono do bot!',
        jailed: '🔒 PRESO!\n\n@{user} foi preso por {minutes} minutos.\n\n🔇 Ele não pode enviar mensagens até ser liberado.\n⏰ Hora de liberação: {time}',
        alreadyJailed: '⚠️ @{user} já está preso!\n\n⏰ Hora de liberação: {time}\n🕐 Restante: {remaining} minutos',
        error: '❌ Falha ao prender usuário: {error}'
    },
    ar: {
        usage: '❌ الاستخدام: .jail @يوزر <دقائق>\n\nمثال: .jail @يوزر 10',
        noMention: '❌ من فضلك منشن يوزر عشان تحبسه!',
        invalidTime: '❌ من فضلك قدم رقم صحيح من الدقائق (1-1440).',
        cantJailSelf: '❌ مينفعش تحبس نفسك!',
        cantJailAdmin: '❌ مينفعش تحبس أدمن تاني!',
        cantJailOwner: '❌ مينفعش تحبس صاحب البوت!',
        jailed: '🔒 محبوس!\n\n@{user} اتحبس لمدة {minutes} دقيقة.\n\n🔇 مش هيقدر يبعت رسايل لحد ما يتفك.\n⏰ وقت الإفراج: {time}',
        alreadyJailed: '⚠️ @{user} محبوس أصلاً!\n\n⏰ وقت الإفراج: {time}\n🕐 المتبقي: {remaining} دقيقة',
        error: '❌ فشل في حبس اليوزر: {error}'
    },
    hi: {
        usage: '❌ उपयोग: .jail @उपयोगकर्ता <मिनट>\n\nउदाहरण: .jail @उपयोगकर्ता 10',
        noMention: '❌ कृपया जेल में डालने के लिए किसी उपयोगकर्ता का उल्लेख करें!',
        invalidTime: '❌ कृपया मिनटों की एक वैध संख्या प्रदान करें (1-1440).',
        cantJailSelf: '❌ आप खुद को जेल में नहीं डाल सकते!',
        cantJailAdmin: '❌ आप किसी अन्य एडमिन को जेल में नहीं डाल सकते!',
        cantJailOwner: '❌ आप बॉट के मालिक को जेल में नहीं डाल सकते!',
        jailed: '🔒 जेल में!\n\n@{user} को {minutes} मिनट के लिए जेल में डाल दिया गया है।\n\n🔇 वे रिहा होने तक संदेश नहीं भेज सकते।\n⏰ रिहाई का समय: {time}',
        alreadyJailed: '⚠️ @{user} पहले से जेल में है!\n\n⏰ रिहाई का समय: {time}\n🕐 शेष: {remaining} मिनट',
        error: '❌ उपयोगकर्ता को जेल में डालने में विफल: {error}'
    }
};

function loadMuted() {
    try {
        if (fs.existsSync(mutedPath)) {
            return JSON.parse(fs.readFileSync(mutedPath, 'utf8'));
        }
    } catch (error) {
        console.error('[JAIL] Error loading muted:', error);
    }
    return {};
}

function saveMuted(data) {
    try {
        fs.writeFileSync(mutedPath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('[JAIL] Error saving muted:', error);
    }
}

function jailUser(groupId, userId, minutes) {
    const muted = loadMuted();
    const key = `${groupId}_${userId}`;
    const releaseTime = Date.now() + (minutes * 60 * 1000);
    muted[key] = releaseTime;
    saveMuted(muted);
    return releaseTime;
}

function isUserJailed(groupId, userId) {
    const muted = loadMuted();
    const key = `${groupId}_${userId}`;
    if (muted[key] && muted[key] > Date.now()) {
        return {
            jailed: true,
            releaseTime: muted[key],
            remaining: Math.ceil((muted[key] - Date.now()) / 60000)
        };
    }
    if (muted[key]) {
        delete muted[key];
        saveMuted(muted);
    }
    return { jailed: false };
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });
}

export default {
    name: 'jail',
    aliases: ['prison'],
    groupOnly: true,
    adminOnly: true,
    
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        try {
            // Check if user mentioned someone
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            
            if (!mentioned) {
                return await sock.sendMessage(from, { text: t.noMention });
            }
            
            // Check if time is provided
            if (args.length < 2) {
                return await sock.sendMessage(from, { text: t.usage });
            }
            
            const minutes = parseInt(args[1]);
            
            // Validate time (1 minute to 24 hours)
            if (isNaN(minutes) || minutes < 1 || minutes > 1440) {
                return await sock.sendMessage(from, { text: t.invalidTime });
            }
            
            const targetId = mentioned.split('@')[0];
            const senderId = sender.split('@')[0];
            
            // Can't jail yourself
            if (senderId === targetId) {
                return await sock.sendMessage(from, { text: t.cantJailSelf });
            }
            
            // Check if target is owner
            const botJid = sock.user?.id?.replace(/:\d+/, '') || '';
            const isTargetOwner = isOwnerOrAdditional(mentioned, botJid, config.ownerNumber, config.ownerJid, false);
            
            if (isTargetOwner) {
                return await sock.sendMessage(from, { 
                    text: t.cantJailOwner,
                    mentions: [mentioned]
                });
            }
            
            // Check if target is admin
            const isTargetAdmin = await isAdmin(sock, from, mentioned);
            if (isTargetAdmin) {
                return await sock.sendMessage(from, { 
                    text: t.cantJailAdmin,
                    mentions: [mentioned]
                });
            }
            
            // Check if already jailed
            const jailStatus = isUserJailed(from, targetId);
            if (jailStatus.jailed) {
                return await sock.sendMessage(from, {
                    text: t.alreadyJailed
                        .replace('{user}', targetId)
                        .replace('{time}', formatTime(jailStatus.releaseTime))
                        .replace('{remaining}', jailStatus.remaining),
                    mentions: [mentioned]
                });
            }
            
            // Jail the user
            const releaseTime = jailUser(from, targetId, minutes);
            
            await sock.sendMessage(from, {
                text: t.jailed
                    .replace('{user}', targetId)
                    .replace('{minutes}', minutes)
                    .replace('{time}', formatTime(releaseTime)),
                mentions: [mentioned]
            });
            
        } catch (error) {
            console.error('[JAIL] Error:', error);
            await sock.sendMessage(from, {
                text: t.error.replace('{error}', error.message)
            });
        }
    }
};

// Export for use in message handler
export { isUserJailed, jailUser };
