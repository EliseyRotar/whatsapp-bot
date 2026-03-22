import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        status: '🔍 Auto View-Once Status: {status}\n\nUsage: .autovv <on/off>\n\n📌 How it works:\n• When someone sends a view-once message\n• Bot automatically reveals it to the group\n• Everyone can see who sent it\n• Works instantly and automatically\n\n⚠️ Important:\n• Must be enabled BEFORE receiving the message\n• Cannot reveal already-received view-once messages\n• This is a WhatsApp limitation, not a bot issue',
        enabled: '✅ Auto View-Once enabled!\n\n🎯 Bot will now automatically reveal all incoming view-once messages to the group.\n\n📝 How it works:\n1. Someone sends a view-once photo/video\n2. Bot instantly reveals it to everyone\n3. Message shows who sent it with @mention\n\n💡 The bot captures it BEFORE anyone opens it, so the encryption keys are still available.',
        disabled: '❌ Auto View-Once disabled.\n\nView-once messages will no longer be revealed automatically.',
        invalid: '❌ Invalid option.\n\nUsage: .autovv <on/off>',
        on: '✅ ON',
        off: '❌ OFF'
    },
    it: {
        status: '🔍 Stato Auto Visualizza Una Volta: {status}\n\nUso: .autovv <on/off>\n\n📌 Come funziona:\n• Quando qualcuno invia un messaggio visualizza una volta\n• Il bot lo rivela automaticamente al gruppo\n• Tutti possono vedere chi l\'ha inviato\n• Funziona istantaneamente e automaticamente\n\n⚠️ Importante:\n• Deve essere attivato PRIMA di ricevere il messaggio\n• Non può rivelare messaggi visualizza una volta già ricevuti\n• Questa è una limitazione WhatsApp, non del bot',
        enabled: '✅ Auto Visualizza Una Volta attivato!\n\n🎯 Il bot ora rivelerà automaticamente tutti i messaggi visualizza una volta in arrivo al gruppo.\n\n📝 Come funziona:\n1. Qualcuno invia una foto/video visualizza una volta\n2. Il bot la rivela istantaneamente a tutti\n3. Il messaggio mostra chi l\'ha inviato con @menzione\n\n💡 Il bot la cattura PRIMA che qualcuno la apra, quindi le chiavi di crittografia sono ancora disponibili.',
        disabled: '❌ Auto Visualizza Una Volta disattivato.\n\nI messaggi visualizza una volta non verranno più rivelati automaticamente.',
        invalid: '❌ Opzione non valida.\n\nUso: .autovv <on/off>',
        on: '✅ ATTIVO',
        off: '❌ DISATTIVO'
    },
    ru: {
        status: '🔍 Статус авто-просмотра одноразовых: {status}\n\nИспользование: .autovv <on/off>\n\n📌 Как это работает:\n• Когда кто-то отправляет одноразовое сообщение\n• Бот автоматически раскрывает его группе\n• Все видят, кто его отправил\n• Работает мгновенно и автоматически\n\n⚠️ Важно:\n• Должно быть включено ДО получения сообщения\n• Не может раскрыть уже полученные одноразовые сообщения\n• Это ограничение WhatsApp, а не бота',
        enabled: '✅ Авто-просмотр одноразовых включён!\n\n🎯 Бот теперь будет автоматически раскрывать все входящие одноразовые сообщения группе.\n\n📝 Как это работает:\n1. Кто-то отправляет одноразовое фото/видео\n2. Бот мгновенно раскрывает его всем\n3. Сообщение показывает, кто его отправил с @упоминанием\n\n💡 Бот захватывает его ДО того, как кто-либо откроет, поэтому ключи шифрования всё ещё доступны.',
        disabled: '❌ Авто-просмотр одноразовых отключён.\n\nОдноразовые сообщения больше не будут раскрываться автоматически.',
        invalid: '❌ Неверная опция.\n\nИспользование: .autovv <on/off>',
        on: '✅ ВКЛЮЧЕНО',
        off: '❌ ОТКЛЮЧЕНО'
    },
    es: {
        status: '🔍 Estado de Auto Ver Una Vez: {status}\n\nUso: .autovv <on/off>\n\n📌 Cómo funciona:\n• Cuando alguien envía un mensaje de ver una vez\n• El bot lo revela automáticamente al grupo\n• Todos pueden ver quién lo envió\n• Funciona instantánea y automáticamente\n\n⚠️ Importante:\n• Debe estar activado ANTES de recibir el mensaje\n• No puede revelar mensajes de ver una vez ya recibidos\n• Esta es una limitación de WhatsApp, no del bot',
        enabled: '✅ ¡Auto Ver Una Vez activado!\n\n🎯 El bot ahora revelará automáticamente todos los mensajes de ver una vez entrantes al grupo.\n\n📝 Cómo funciona:\n1. Alguien envía una foto/video de ver una vez\n2. El bot la revela instantáneamente a todos\n3. El mensaje muestra quién la envió con @mención\n\n💡 El bot la captura ANTES de que alguien la abra, por lo que las claves de cifrado aún están disponibles.',
        disabled: '❌ Auto Ver Una Vez desactivado.\n\nLos mensajes de ver una vez ya no se revelarán automáticamente.',
        invalid: '❌ Opción inválida.\n\nUso: .autovv <on/off>',
        on: '✅ ACTIVADO',
        off: '❌ DESACTIVADO'
    },
    pt: {
        status: '🔍 Status de Auto Ver Uma Vez: {status}\n\nUso: .autovv <on/off>\n\n📌 Como funciona:\n• Quando alguém envia uma mensagem de ver uma vez\n• O bot a revela automaticamente ao grupo\n• Todos podem ver quem enviou\n• Funciona instantânea e automaticamente\n\n⚠️ Importante:\n• Deve estar ativado ANTES de receber a mensagem\n• Não pode revelar mensagens de ver uma vez já recebidas\n• Esta é uma limitação do WhatsApp, não do bot',
        enabled: '✅ Auto Ver Uma Vez ativado!\n\n🎯 O bot agora revelará automaticamente todas as mensagens de ver uma vez recebidas ao grupo.\n\n📝 Como funciona:\n1. Alguém envia uma foto/vídeo de ver uma vez\n2. O bot a revela instantaneamente a todos\n3. A mensagem mostra quem enviou com @menção\n\n💡 O bot captura ANTES de alguém abrir, então as chaves de criptografia ainda estão disponíveis.',
        disabled: '❌ Auto Ver Uma Vez desativado.\n\nMensagens de ver uma vez não serão mais reveladas automaticamente.',
        invalid: '❌ Opção inválida.\n\nUso: .autovv <on/off>',
        on: '✅ ATIVADO',
        off: '❌ DESATIVADO'
    },
    ar: {
        status: '🔍 حالة الكشف التلقائي للعرض مرة واحدة: {status}\n\nالاستخدام: .autovv <on/off>\n\n📌 كيف يشتغل:\n• لما حد يبعت رسالة عرض مرة واحدة\n• البوت بيكشفها تلقائياً للجروب\n• الكل يقدر يشوف مين بعتها\n• بيشتغل فوراً وتلقائياً\n\n⚠️ مهم:\n• لازم يتفعل قبل ما تستقبل الرسالة\n• مش ممكن يكشف رسائل عرض مرة واحدة اتستقبلت فعلاً\n• ده قيد من واتساب، مش من البوت',
        enabled: '✅ الكشف التلقائي للعرض مرة واحدة اتفعل!\n\n🎯 البوت دلوقتي هيكشف تلقائياً كل رسائل العرض مرة واحدة الواردة للجروب.\n\n📝 كيف يشتغل:\n1. حد يبعت صورة/فيديو عرض مرة واحدة\n2. البوت يكشفها فوراً للكل\n3. الرسالة بتوضح مين بعتها بـ @منشن\n\n💡 البوت بيلتقطها قبل ما حد يفتحها، فمفاتيح التشفير لسه متاحة.',
        disabled: '❌ الكشف التلقائي للعرض مرة واحدة اتعطل.\n\nرسائل العرض مرة واحدة مش هتتكشف تلقائياً تاني.',
        invalid: '❌ خيار غلط.\n\nالاستخدام: .autovv <on/off>',
        on: '✅ مفعل',
        off: '❌ معطل'
    },
    hi: {
        status: '🔍 ऑटो व्यू-वन्स स्टेटस: {status}\n\nउपयोग: .autovv <on/off>\n\n📌 यह कैसे काम करता है:\n• जब कोई व्यू-वन्स मैसेज भेजता है\n• बॉट इसे ऑटोमैटिक ग्रुप में रिवील करता है\n• सभी देख सकते हैं किसने भेजा\n• तुरंत और ऑटोमैटिक काम करता है\n\n⚠️ महत्वपूर्ण:\n• मैसेज प्राप्त करने से पहले सक्षम होना चाहिए\n• पहले से प्राप्त व्यू-वन्स मैसेज रिवील नहीं कर सकता\n• यह WhatsApp की सीमा है, बॉट की नहीं',
        enabled: '✅ ऑटो व्यू-वन्स सक्षम!\n\n🎯 बॉट अब सभी आने वाले व्यू-वन्स मैसेज को ऑटोमैटिक ग्रुप में रिवील करेगा।\n\n📝 यह कैसे काम करता है:\n1. कोई व्यू-वन्स फोटो/वीडियो भेजता है\n2. बॉट इसे तुरंत सभी को रिवील करता है\n3. मैसेज @मेंशन के साथ दिखाता है किसने भेजा\n\n💡 बॉट इसे किसी के खोलने से पहले कैप्चर करता है, इसलिए एन्क्रिप्शन की चाबियां अभी भी उपलब्ध हैं।',
        disabled: '❌ ऑटो व्यू-वन्स अक्षम।\n\nव्यू-वन्स मैसेज अब ऑटोमैटिक रिवील नहीं होंगे।',
        invalid: '❌ अमान्य विकल्प।\n\nउपयोग: .autovv <on/off>',
        on: '✅ चालू',
        off: '❌ बंद'
    }
};

export default {
    name: 'autovv',
    ownerOnly: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        if (args.length === 0) {
            const status = global.autoVV || false;
            return await sock.sendMessage(from, { 
                text: t.status.replace('{status}', status ? t.on : t.off)
            });
        }
        
        const action = args[0].toLowerCase();
        
        if (action === 'on') {
            global.autoVV = true;
            await sock.sendMessage(from, { 
                text: t.enabled
            });
        } else if (action === 'off') {
            global.autoVV = false;
            await sock.sendMessage(from, { 
                text: t.disabled
            });
        } else {
            await sock.sendMessage(from, { 
                text: t.invalid
            });
        }
    }
};
