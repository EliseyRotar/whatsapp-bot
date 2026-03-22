import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        warning: `⚠️ SCAM ALERT ⚠️

🚨 WARNING: This message appears to be a SCAM!

Common scam indicators:
• 💰 Promises of money/prizes
• 🔗 Suspicious links
• ⏰ Urgent time pressure
• 🎯 "Too good to be true" offers
• 📧 Requests for personal info

🛡️ PROTECT YOURSELF:
• ❌ Don't click suspicious links
• ❌ Don't share personal information
• ❌ Don't send money to strangers
• ✅ Verify information from official sources
• ✅ Report suspicious messages

⚠️ Stay safe and be cautious!`,
        usage: '⚠️ Scam Alert\n\nReply to a suspicious message with .scam to warn everyone.\n\nUsage: Reply to a message with .scam',
        notReply: '❌ Please reply to a message to mark it as a scam.'
    },
    it: {
        warning: `⚠️ ALLARME TRUFFA ⚠️

🚨 ATTENZIONE: Questo messaggio sembra essere una TRUFFA!

Indicatori comuni di truffa:
• 💰 Promesse di soldi/premi
• 🔗 Link sospetti
• ⏰ Pressione temporale urgente
• 🎯 Offerte "troppo belle per essere vere"
• 📧 Richieste di informazioni personali

🛡️ PROTEGGITI:
• ❌ Non cliccare su link sospetti
• ❌ Non condividere informazioni personali
• ❌ Non inviare soldi a sconosciuti
• ✅ Verifica le informazioni da fonti ufficiali
• ✅ Segnala messaggi sospetti

⚠️ Rimani al sicuro e sii cauto!`,
        usage: '⚠️ Allarme Truffa\n\nRispondi a un messaggio sospetto con .scam per avvisare tutti.\n\nUso: Rispondi a un messaggio con .scam',
        notReply: '❌ Per favore rispondi a un messaggio per segnalarlo come truffa.'
    },
    ru: {
        warning: `⚠️ ПРЕДУПРЕЖДЕНИЕ О МОШЕННИЧЕСТВЕ ⚠️

🚨 ВНИМАНИЕ: Это сообщение похоже на МОШЕННИЧЕСТВО!

Общие признаки мошенничества:
• 💰 Обещания денег/призов
• 🔗 Подозрительные ссылки
• ⏰ Срочное давление времени
• 🎯 Предложения "слишком хорошие, чтобы быть правдой"
• 📧 Запросы личной информации

🛡️ ЗАЩИТИТЕ СЕБЯ:
• ❌ Не переходите по подозрительным ссылкам
• ❌ Не делитесь личной информацией
• ❌ Не отправляйте деньги незнакомцам
• ✅ Проверяйте информацию из официальных источников
• ✅ Сообщайте о подозрительных сообщениях

⚠️ Будьте осторожны и бдительны!`,
        usage: '⚠️ Предупреждение о мошенничестве\n\nОтветьте на подозрительное сообщение с .scam, чтобы предупредить всех.\n\nИспользование: Ответьте на сообщение с .scam',
        notReply: '❌ Пожалуйста, ответьте на сообщение, чтобы отметить его как мошенничество.'
    },
    es: {
        warning: `⚠️ ALERTA DE ESTAFA ⚠️

🚨 ADVERTENCIA: ¡Este mensaje parece ser una ESTAFA!

Indicadores comunes de estafa:
• 💰 Promesas de dinero/premios
• 🔗 Enlaces sospechosos
• ⏰ Presión de tiempo urgente
• 🎯 Ofertas "demasiado buenas para ser verdad"
• 📧 Solicitudes de información personal

🛡️ PROTÉGETE:
• ❌ No hagas clic en enlaces sospechosos
• ❌ No compartas información personal
• ❌ No envíes dinero a desconocidos
• ✅ Verifica la información de fuentes oficiales
• ✅ Reporta mensajes sospechosos

⚠️ ¡Mantente seguro y ten cuidado!`,
        usage: '⚠️ Alerta de Estafa\n\nResponde a un mensaje sospechoso con .scam para advertir a todos.\n\nUso: Responde a un mensaje con .scam',
        notReply: '❌ Por favor responde a un mensaje para marcarlo como estafa.'
    },
    pt: {
        warning: `⚠️ ALERTA DE GOLPE ⚠️

🚨 AVISO: Esta mensagem parece ser um GOLPE!

Indicadores comuns de golpe:
• 💰 Promessas de dinheiro/prêmios
• 🔗 Links suspeitos
• ⏰ Pressão de tempo urgente
• 🎯 Ofertas "boas demais para ser verdade"
• 📧 Solicitações de informações pessoais

🛡️ PROTEJA-SE:
• ❌ Não clique em links suspeitos
• ❌ Não compartilhe informações pessoais
• ❌ Não envie dinheiro para desconhecidos
• ✅ Verifique informações de fontes oficiais
• ✅ Denuncie mensagens suspeitas

⚠️ Fique seguro e seja cauteloso!`,
        usage: '⚠️ Alerta de Golpe\n\nResponda a uma mensagem suspeita com .scam para avisar a todos.\n\nUso: Responda a uma mensagem com .scam',
        notReply: '❌ Por favor responda a uma mensagem para marcá-la como golpe.'
    },
    ar: {
        warning: `⚠️ تحذير من الاحتيال ⚠️

🚨 تحذير: هذه الرسالة تبدو أنها احتيال!

مؤشرات الاحتيال الشائعة:
• 💰 وعود بالمال/الجوائز
• 🔗 روابط مشبوهة
• ⏰ ضغط وقت عاجل
• 🎯 عروض "جيدة جداً لدرجة يصعب تصديقها"
• 📧 طلبات معلومات شخصية

🛡️ احمِ نفسك:
• ❌ لا تنقر على روابط مشبوهة
• ❌ لا تشارك معلومات شخصية
• ❌ لا ترسل أموال لغرباء
• ✅ تحقق من المعلومات من مصادر رسمية
• ✅ أبلغ عن الرسائل المشبوهة

⚠️ ابقَ آمناً وكن حذراً!`,
        usage: '⚠️ تحذير من الاحتيال\n\nرد على رسالة مشبوهة بـ .scam لتحذير الجميع.\n\nالاستخدام: رد على رسالة بـ .scam',
        notReply: '❌ من فضلك رد على رسالة لتحديدها كاحتيال.'
    },
    hi: {
        warning: `⚠️ स्कैम अलर्ट ⚠️

🚨 चेतावनी: यह मैसेज एक स्कैम लगता है!

सामान्य स्कैम संकेतक:
• 💰 पैसे/इनाम के वादे
• 🔗 संदिग्ध लिंक
• ⏰ तत्काल समय का दबाव
• 🎯 "सच होने के लिए बहुत अच्छे" ऑफर
• 📧 व्यक्तिगत जानकारी के लिए अनुरोध

🛡️ अपनी सुरक्षा करें:
• ❌ संदिग्ध लिंक पर क्लिक न करें
• ❌ व्यक्तिगत जानकारी शेयर न करें
• ❌ अजनबियों को पैसे न भेजें
• ✅ आधिकारिक स्रोतों से जानकारी सत्यापित करें
• ✅ संदिग्ध मैसेज रिपोर्ट करें

⚠️ सुरक्षित रहें और सावधान रहें!`,
        usage: '⚠️ स्कैम अलर्ट\n\nसभी को चेतावनी देने के लिए संदिग्ध मैसेज पर .scam के साथ रिप्लाई करें।\n\nउपयोग: मैसेज पर .scam के साथ रिप्लाई करें',
        notReply: '❌ कृपया मैसेज को स्कैम के रूप में मार्क करने के लिए उस पर रिप्लाई करें।'
    }
};

export default {
    name: 'scam',
    aliases: ['truffa', 'fraud', 'fake'],
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        try {
            // Check if replying to a message
            const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            
            if (!quotedMsg) {
                return await sock.sendMessage(from, {
                    text: t.notReply + '\n\n' + t.usage
                });
            }
            
            // Get the quoted message info
            const quotedMsgId = msg.message.extendedTextMessage.contextInfo.stanzaId;
            const quotedSender = msg.message.extendedTextMessage.contextInfo.participant || 
                                msg.message.extendedTextMessage.contextInfo.remoteJid;
            
            // Send scam warning
            await sock.sendMessage(from, {
                text: t.warning,
                mentions: [quotedSender]
            });
            
        } catch (error) {
            console.error('[SCAM] Error:', error.message);
            await sock.sendMessage(from, {
                text: `❌ Error: ${error.message}`
            });
        }
    }
};
