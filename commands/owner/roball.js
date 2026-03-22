import { getBalance, removeCoins, addCoins } from '../../utils/bank_SAFE.js';
import { getGroupLanguage } from '../../utils/language.js';
import { hasProtection } from '../../utils/shopSystem.js';
import { pendingRobberies } from '../games/rob.js';
import { config } from '../../config.js';

const responses = {
    en: {
        notGroup: '❌ This command can only be used in groups.',
        massRobbery: `🚨 MASS ROBBERY IN PROGRESS! 🚨

@{robber} is robbing EVERYONE in the group!

👥 Targets: {targets}

⚔️ You have 30 SECONDS to type .fight to defend!

🛡️ Fight back or lose your coins!

⏰ Timer starts NOW!`,
        robberySuccess: '💰 @{robber} successfully robbed @{target} for {amount} coins!',
        robberyResults: '💰 ROBBERY RESULTS 💰\n\n@{robber} successfully robbed:\n\n',
        complete: `╔═══════════════════════════════════╗
║   💰 MASS ROBBERY COMPLETE   ║
╚═══════════════════════════════════╝

📊 FINAL RESULTS:

👥 Total targets: {total}
✅ Successfully robbed: {success}
⚔️ Defended: {defended}
⏭️ Skipped: {skipped}
💵 Total stolen: {stolen} coins

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 Your new balance: {balance} coins`,
        errorFetching: '❌ Error fetching group members: {error}'
    },
    it: {
        notGroup: '❌ Questo comando può essere usato solo nei gruppi.',
        massRobbery: `🚨 RAPINA DI MASSA IN CORSO! 🚨

@{robber} sta derubando TUTTI nel gruppo!

👥 Obiettivi: {targets}

⚔️ Hai 30 SECONDI per scrivere .fight per difenderti!

🛡️ Combatti o perdi le tue monete!

⏰ Il timer inizia ORA!`,
        robberySuccess: '💰 @{robber} ha derubato con successo @{target} per {amount} monete!',
        robberyResults: '💰 RISULTATI RAPINA 💰\n\n@{robber} ha derubato con successo:\n\n',
        complete: `╔═══════════════════════════════════╗
║   💰 RAPINA DI MASSA COMPLETATA   ║
╚═══════════════════════════════════╝

📊 RISULTATI FINALI:

👥 Obiettivi totali: {total}
✅ Derubati con successo: {success}
⚔️ Difesi: {defended}
⏭️ Saltati: {skipped}
💵 Totale rubato: {stolen} monete

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 Tuo nuovo saldo: {balance} monete`,
        errorFetching: '❌ Errore nel recupero dei membri del gruppo: {error}'
    },
    ru: {
        notGroup: '❌ Эта команда может использоваться только в группах.',
        massRobbery: `🚨 МАССОВОЕ ОГРАБЛЕНИЕ! 🚨

@{robber} грабит ВСЕХ в группе!

👥 Цели: {targets}

⚔️ У вас есть 30 СЕКУНД, чтобы написать .fight для защиты!

🛡️ Сражайтесь или потеряйте монеты!

⏰ Таймер запущен!`,
        robberySuccess: '💰 @{robber} успешно ограбил @{target} на {amount} монет!',
        robberyResults: '💰 РЕЗУЛЬТАТЫ ОГРАБЛЕНИЯ 💰\n\n@{robber} успешно ограбил:\n\n',
        complete: `╔═══════════════════════════════════╗
║   💰 МАССОВОЕ ОГРАБЛЕНИЕ ЗАВЕРШЕНО   ║
╚═══════════════════════════════════╝

📊 ФИНАЛЬНЫЕ РЕЗУЛЬТАТЫ:

👥 Всего целей: {total}
✅ Успешно ограблено: {success}
⚔️ Защищено: {defended}
⏭️ Пропущено: {skipped}
💵 Всего украдено: {stolen} монет

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 Ваш новый баланс: {balance} монет`,
        errorFetching: '❌ Ошибка получения участников группы: {error}'
    },
    es: {
        notGroup: '❌ Este comando solo puede usarse en grupos.',
        massRobbery: `🚨 ¡ROBO MASIVO EN PROGRESO! 🚨

¡@{robber} está robando a TODOS en el grupo!

👥 Objetivos: {targets}

⚔️ ¡Tienes 30 SEGUNDOS para escribir .fight para defenderte!

🛡️ ¡Lucha o pierde tus monedas!

⏰ ¡El temporizador comienza AHORA!`,
        robberySuccess: '💰 ¡@{robber} robó exitosamente a @{target} por {amount} monedas!',
        robberyResults: '💰 RESULTADOS DEL ROBO 💰\n\n@{robber} robó exitosamente a:\n\n',
        complete: `╔═══════════════════════════════════╗
║   💰 ROBO MASIVO COMPLETADO   ║
╚═══════════════════════════════════╝

📊 RESULTADOS FINALES:

👥 Objetivos totales: {total}
✅ Robados exitosamente: {success}
⚔️ Defendidos: {defended}
⏭️ Omitidos: {skipped}
💵 Total robado: {stolen} monedas

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 Tu nuevo saldo: {balance} monedas`,
        errorFetching: '❌ Error al obtener miembros del grupo: {error}'
    },
    pt: {
        notGroup: '❌ Este comando só pode ser usado em grupos.',
        massRobbery: `🚨 ROUBO EM MASSA EM ANDAMENTO! 🚨

@{robber} está roubando TODOS no grupo!

👥 Alvos: {targets}

⚔️ Você tem 30 SEGUNDOS para digitar .fight para se defender!

🛡️ Lute ou perca suas moedas!

⏰ O cronômetro começa AGORA!`,
        robberySuccess: '💰 @{robber} roubou com sucesso @{target} por {amount} moedas!',
        robberyResults: '💰 RESULTADOS DO ROUBO 💰\n\n@{robber} roubou com sucesso:\n\n',
        complete: `╔═══════════════════════════════════╗
║   💰 ROUBO EM MASSA COMPLETO   ║
╚═══════════════════════════════════╝

📊 RESULTADOS FINAIS:

👥 Alvos totais: {total}
✅ Roubados com sucesso: {success}
⚔️ Defendidos: {defended}
⏭️ Pulados: {skipped}
💵 Total roubado: {stolen} moedas

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 Seu novo saldo: {balance} moedas`,
        errorFetching: '❌ Erro ao buscar membros do grupo: {error}'
    },
    ar: {
        notGroup: '❌ هذا الأمر يمكن استخدامه فقط في المجموعات.',
        massRobbery: `🚨 سرقة جماعية جارية! 🚨

@{robber} بيسرق كل الناس في الجروب!

👥 الأهداف: {targets}

⚔️ عندك 30 ثانية تكتب .fight عشان تدافع!

🛡️ حارب أو اخسر عملاتك!

⏰ الوقت بدأ دلوقتي!`,
        robberySuccess: '💰 @{robber} سرق @{target} بنجاح وأخذ {amount} عملة!',
        robberyResults: '💰 نتائج السرقة 💰\n\n@{robber} سرق بنجاح:\n\n',
        complete: `╔═══════════════════════════════════╗
║   💰 السرقة الجماعية اكتملت   ║
╚═══════════════════════════════════╝

📊 النتائج النهائية:

👥 إجمالي الأهداف: {total}
✅ اتسرقوا بنجاح: {success}
⚔️ اتدافعوا: {defended}
⏭️ اتخطوا: {skipped}
💵 إجمالي المسروق: {stolen} عملة

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 رصيدك الجديد: {balance} عملة`,
        errorFetching: '❌ خطأ في جلب أعضاء المجموعة: {error}'
    },
    hi: {
        notGroup: '❌ यह कमांड केवल ग्रुप में उपयोग किया जा सकता है।',
        massRobbery: `🚨 मास रॉबरी चल रही है! 🚨

@{robber} ग्रुप में सभी को लूट रहा है!

👥 टारगेट: {targets}

⚔️ आपके पास 30 सेकंड हैं .fight टाइप करने के लिए!

🛡️ लड़ें या अपने कॉइन खो दें!

⏰ टाइमर अभी शुरू हुआ!`,
        robberySuccess: '💰 @{robber} ने सफलतापूर्वक @{target} को {amount} कॉइन के लिए लूटा!',
        robberyResults: '💰 रॉबरी रिजल्ट 💰\n\n@{robber} ने सफलतापूर्वक लूटा:\n\n',
        complete: `╔═══════════════════════════════════╗
║   💰 मास रॉबरी पूरी हुई   ║
╚═══════════════════════════════════╝

📊 फाइनल रिजल्ट:

👥 कुल टारगेट: {total}
✅ सफलतापूर्वक लूटे गए: {success}
⚔️ डिफेंड किए गए: {defended}
⏭️ स्किप किए गए: {skipped}
💵 कुल चोरी: {stolen} कॉइन

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 आपका नया बैलेंस: {balance} कॉइन`,
        errorFetching: '❌ ग्रुप मेंबर फेच करने में एरर: {error}'
    },
    ng: {
        notGroup: '❌ Dis command na for groups only.',
        massRobbery: `🚨 MASS ROBBERY DEY HAPPEN! 🚨

@{robber} dey rob EVERYBODY for di group!

👥 Targets: {targets}

⚔️ You get 30 SECONDS to type .fight to defend yourself!

🛡️ Fight back or lose your coins!

⏰ Timer don start NOW!`,
        robberySuccess: '💰 @{robber} don successfully rob @{target} for {amount} coins!',
        robberyResults: '💰 ROBBERY RESULTS 💰\n\n@{robber} don successfully rob:\n\n',
        complete: `╔═══════════════════════════════════╗
║   💰 MASS ROBBERY DON COMPLETE   ║
╚═══════════════════════════════════╝

📊 FINAL RESULTS:

👥 Total targets: {total}
✅ Successfully robbed: {success}
⚔️ Defended: {defended}
⏭️ Skipped: {skipped}
💵 Total stolen: {stolen} coins

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 Your new balance: {balance} coins`,
        errorFetching: '❌ Error fetching group members: {error}'
    }
};

const FIGHT_TIMEOUT = 30000; // 30 seconds to fight back

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
    name: 'roball',
    ownerOnly: true,
    groupOnly: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const senderId = sender.split('@')[0];
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;

        try {
            // Check if command is used in a group
            if (!from.endsWith('@g.us')) {
                return await sock.sendMessage(from, { text: t.notGroup });
            }

            // Get group metadata to fetch all members
            const groupMetadata = await sock.groupMetadata(from);
            const members = groupMetadata.participants;

            // Collect all eligible targets
            const targets = [];
            const robberyData = new Map();

            for (const member of members) {
                const memberId = member.id;
                const memberIdClean = memberId.split('@')[0];

                // Skip the robber (owner) and bot
                if (memberId === sender || memberId === sock.user.id.split(':')[0] + '@s.whatsapp.net') {
                    continue;
                }

                // Check if target has protection
                if (hasProtection(memberIdClean, 'rob')) {
                    continue;
                }

                // Get member balance
                const memberBalance = await getBalance(memberId);

                // Calculate stolen amount (10-30% of member's balance, minimum 1 coin)
                const percentage = Math.random() * 0.2 + 0.1; // 10-30%
                const stolenAmount = Math.max(1, Math.floor(memberBalance * percentage));

                targets.push(memberId);
                robberyData.set(memberIdClean, {
                    memberId: memberId,
                    amount: stolenAmount
                });

                // Create pending robbery
                const robberyKey = `${from}_${memberIdClean}`;
                const now = Date.now();
                
                pendingRobberies.set(robberyKey, {
                    robber: sender,
                    robberId: senderId,
                    target: memberId,
                    targetId: memberIdClean,
                    amount: stolenAmount,
                    timestamp: now,
                    from: from
                });
            }

            if (targets.length === 0) {
                return await sock.sendMessage(from, {
                    text: '❌ No eligible targets found! Everyone either has protection or insufficient coins.'
                });
            }

            // Create target mentions string
            let targetsText = '';
            targets.forEach(targetId => {
                const targetIdClean = targetId.split('@')[0];
                targetsText += `@${targetIdClean} `;
            });

            // Send ONE mass robbery message mentioning everyone
            const massRobberyMsg = t.massRobbery
                .replace(/@\{robber\}/g, `@${senderId}`)
                .replace('{targets}', targetsText);

            await sock.sendMessage(from, {
                text: massRobberyMsg,
                mentions: [sender, ...targets]
            });

            // Track statistics
            const stats = {
                total: targets.length,
                success: 0,
                defended: 0,
                skipped: 0,
                totalStolen: 0
            };

            // Wait for fight timeout
            await sleep(FIGHT_TIMEOUT);

            // Collect all successful robberies
            const successfulRobberies = [];
            const allMentions = [sender];

            // Process all robberies that weren't defended
            for (const [memberIdClean, data] of robberyData.entries()) {
                const robberyKey = `${from}_${memberIdClean}`;
                
                if (pendingRobberies.has(robberyKey)) {
                    // Robbery wasn't defended - steal the coins
                    const robbery = pendingRobberies.get(robberyKey);
                    pendingRobberies.delete(robberyKey);

                    await removeCoins(robbery.target, robbery.amount);
                    await addCoins(robbery.robber, robbery.amount);
                    stats.success++;
                    stats.totalStolen += robbery.amount;

                    // Add to successful robberies list
                    successfulRobberies.push({
                        targetId: robbery.targetId,
                        target: robbery.target,
                        amount: robbery.amount
                    });
                    allMentions.push(robbery.target);
                } else {
                    // Robbery was defended via .fight
                    stats.defended++;
                }
            }

            // Send ONE consolidated message with all successful robberies
            if (successfulRobberies.length > 0) {
                let consolidatedMsg = t.robberyResults.replace(/@\{robber\}/g, `@${senderId}`);
                
                successfulRobberies.forEach((robbery, index) => {
                    consolidatedMsg += `${index + 1}. @${robbery.targetId} - ${robbery.amount.toLocaleString()} coins\n`;
                });

                await sock.sendMessage(from, {
                    text: consolidatedMsg,
                    mentions: allMentions
                });
            }

            // Send final summary
            const ownerBalance = await getBalance(sender);
            const completeMsg = t.complete
                .replace('{total}', stats.total)
                .replace('{success}', stats.success)
                .replace('{defended}', stats.defended)
                .replace('{skipped}', stats.skipped)
                .replace('{stolen}', stats.totalStolen.toLocaleString())
                .replace('{balance}', ownerBalance.toLocaleString());

            await sock.sendMessage(from, {
                text: completeMsg
            });

        } catch (error) {
            console.error('[ROBALL] Command error:', error.message);
            console.error('[ROBALL] Stack:', error.stack);
            await sock.sendMessage(from, {
                text: t.errorFetching.replace('{error}', error.message)
            });
        }
    }
};
