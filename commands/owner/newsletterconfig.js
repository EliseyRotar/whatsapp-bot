import { loadNewsletterConfig, saveNewsletterConfig } from '../../utils/newsletterScheduler.js';
import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        title: '📰 NEWSLETTER CONFIGURATION',
        status: '🔧 Status:',
        enabled: '✅ Enabled',
        disabled: '❌ Disabled',
        financePosts: '📊 Finance Posts:',
        motivationPosts: '💪 Motivation Posts:',
        channelPromotion: '📢 Channel Promotion:',
        days: 'Days:',
        time: 'Time:',
        messages: 'Messages:',
        commands: '⚙️ Commands:',
        cmdEnable: '.nconfig enable - Enable scheduler',
        cmdDisable: '.nconfig disable - Disable scheduler',
        cmdFinance: '.nconfig finance on/off - Toggle finance posts',
        cmdMotivation: '.nconfig motivation on/off - Toggle motivation posts',
        cmdChannels: '.nconfig channels on/off - Toggle channel posts',
        cmdAddFinance: '.nconfig addfinance <message> - Add finance message',
        cmdAddMotivation: '.nconfig addmotivation <message> - Add motivation message',
        cmdSetChannel: '.nconfig setchannel <message> - Set channel message',
        schedulerEnabled: '✅ Newsletter scheduler enabled!',
        schedulerDisabled: '❌ Newsletter scheduler disabled!',
        apiEnabled: '✅ API content fetching enabled!\n\n🌐 Will fetch fresh quotes and finance news from APIs.',
        apiDisabled: '❌ API content disabled!\n\n📝 Will use your custom messages only.',
        financeApiEnabled: '✅ Finance API enabled!',
        financeApiDisabled: '❌ Finance API disabled!',
        motivationApiEnabled: '✅ Motivation API enabled!',
        motivationApiDisabled: '❌ Motivation API disabled!',
        financeEnabled: '✅ Finance posts enabled!',
        financeDisabled: '❌ Finance posts disabled!',
        motivationEnabled: '✅ Motivation posts enabled!',
        motivationDisabled: '❌ Motivation posts disabled!',
        channelsEnabled: '✅ Channel promotion posts enabled!',
        channelsDisabled: '❌ Channel promotion posts disabled!',
        provideMessage: '❌ Please provide a message!\n\nUsage: .nconfig {action} <message>',
        financeAdded: '✅ Finance message added!\n\nTotal messages: {count}',
        motivationAdded: '✅ Motivation message added!\n\nTotal messages: {count}',
        channelUpdated: '✅ Channel promotion message updated!',
        unknownCommand: '❌ Unknown command!\n\nUse .nconfig to see available commands.',
        error: '❌ Error: {error}'
    },
    it: {
        title: '📰 CONFIGURAZIONE NEWSLETTER',
        status: '🔧 Stato:',
        enabled: '✅ Abilitato',
        disabled: '❌ Disabilitato',
        financePosts: '📊 Post Finanza:',
        motivationPosts: '💪 Post Motivazione:',
        channelPromotion: '📢 Promozione Canale:',
        days: 'Giorni:',
        time: 'Ora:',
        messages: 'Messaggi:',
        commands: '⚙️ Comandi:',
        cmdEnable: '.nconfig enable - Abilita scheduler',
        cmdDisable: '.nconfig disable - Disabilita scheduler',
        cmdFinance: '.nconfig finance on/off - Attiva/disattiva post finanza',
        cmdMotivation: '.nconfig motivation on/off - Attiva/disattiva post motivazione',
        cmdChannels: '.nconfig channels on/off - Attiva/disattiva post canale',
        cmdAddFinance: '.nconfig addfinance <messaggio> - Aggiungi messaggio finanza',
        cmdAddMotivation: '.nconfig addmotivation <messaggio> - Aggiungi messaggio motivazione',
        cmdSetChannel: '.nconfig setchannel <messaggio> - Imposta messaggio canale',
        schedulerEnabled: '✅ Scheduler newsletter abilitato!',
        schedulerDisabled: '❌ Scheduler newsletter disabilitato!',
        apiEnabled: '✅ Recupero contenuti API abilitato!\n\n🌐 Recupererà citazioni e notizie finanziarie fresche dalle API.',
        apiDisabled: '❌ Contenuti API disabilitati!\n\n📝 Userà solo i tuoi messaggi personalizzati.',
        financeApiEnabled: '✅ API Finanza abilitata!',
        financeApiDisabled: '❌ API Finanza disabilitata!',
        motivationApiEnabled: '✅ API Motivazione abilitata!',
        motivationApiDisabled: '❌ API Motivazione disabilitata!',
        financeEnabled: '✅ Post finanza abilitati!',
        financeDisabled: '❌ Post finanza disabilitati!',
        motivationEnabled: '✅ Post motivazione abilitati!',
        motivationDisabled: '❌ Post motivazione disabilitati!',
        channelsEnabled: '✅ Post promozione canale abilitati!',
        channelsDisabled: '❌ Post promozione canale disabilitati!',
        provideMessage: '❌ Fornisci un messaggio!\n\nUso: .nconfig {action} <messaggio>',
        financeAdded: '✅ Messaggio finanza aggiunto!\n\nTotale messaggi: {count}',
        motivationAdded: '✅ Messaggio motivazione aggiunto!\n\nTotale messaggi: {count}',
        channelUpdated: '✅ Messaggio promozione canale aggiornato!',
        unknownCommand: '❌ Comando sconosciuto!\n\nUsa .nconfig per vedere i comandi disponibili.',
        error: '❌ Errore: {error}'
    },
    ru: {
        title: '📰 КОНФИГУРАЦИЯ РАССЫЛКИ',
        status: '🔧 Статус:',
        enabled: '✅ Включено',
        disabled: '❌ Отключено',
        financePosts: '📊 Финансовые Посты:',
        motivationPosts: '💪 Мотивационные Посты:',
        channelPromotion: '📢 Продвижение Канала:',
        days: 'Дни:',
        time: 'Время:',
        messages: 'Сообщения:',
        commands: '⚙️ Команды:',
        cmdEnable: '.nconfig enable - Включить планировщик',
        cmdDisable: '.nconfig disable - Отключить планировщик',
        cmdFinance: '.nconfig finance on/off - Переключить финансовые посты',
        cmdMotivation: '.nconfig motivation on/off - Переключить мотивационные посты',
        cmdChannels: '.nconfig channels on/off - Переключить посты канала',
        cmdAddFinance: '.nconfig addfinance <сообщение> - Добавить финансовое сообщение',
        cmdAddMotivation: '.nconfig addmotivation <сообщение> - Добавить мотивационное сообщение',
        cmdSetChannel: '.nconfig setchannel <сообщение> - Установить сообщение канала',
        schedulerEnabled: '✅ Планировщик рассылки включен!',
        schedulerDisabled: '❌ Планировщик рассылки отключен!',
        apiEnabled: '✅ Получение контента через API включено!\n\n🌐 Будет получать свежие цитаты и финансовые новости из API.',
        apiDisabled: '❌ Контент API отключен!\n\n📝 Будет использовать только ваши пользовательские сообщения.',
        financeApiEnabled: '✅ Финансовый API включен!',
        financeApiDisabled: '❌ Финансовый API отключен!',
        motivationApiEnabled: '✅ Мотивационный API включен!',
        motivationApiDisabled: '❌ Мотивационный API отключен!',
        financeEnabled: '✅ Финансовые посты включены!',
        financeDisabled: '❌ Финансовые посты отключены!',
        motivationEnabled: '✅ Мотивационные посты включены!',
        motivationDisabled: '❌ Мотивационные посты отключены!',
        channelsEnabled: '✅ Посты продвижения канала включены!',
        channelsDisabled: '❌ Посты продвижения канала отключены!',
        provideMessage: '❌ Пожалуйста, предоставьте сообщение!\n\nИспользование: .nconfig {action} <сообщение>',
        financeAdded: '✅ Финансовое сообщение добавлено!\n\nВсего сообщений: {count}',
        motivationAdded: '✅ Мотивационное сообщение добавлено!\n\nВсего сообщений: {count}',
        channelUpdated: '✅ Сообщение продвижения канала обновлено!',
        unknownCommand: '❌ Неизвестная команда!\n\nИспользуйте .nconfig чтобы увидеть доступные команды.',
        error: '❌ Ошибка: {error}'
    },
    es: {
        title: '📰 CONFIGURACIÓN DE BOLETÍN',
        status: '🔧 Estado:',
        enabled: '✅ Habilitado',
        disabled: '❌ Deshabilitado',
        financePosts: '📊 Publicaciones Financieras:',
        motivationPosts: '💪 Publicaciones Motivacionales:',
        channelPromotion: '📢 Promoción de Canal:',
        days: 'Días:',
        time: 'Hora:',
        messages: 'Mensajes:',
        commands: '⚙️ Comandos:',
        cmdEnable: '.nconfig enable - Habilitar programador',
        cmdDisable: '.nconfig disable - Deshabilitar programador',
        cmdFinance: '.nconfig finance on/off - Alternar publicaciones financieras',
        cmdMotivation: '.nconfig motivation on/off - Alternar publicaciones motivacionales',
        cmdChannels: '.nconfig channels on/off - Alternar publicaciones de canal',
        cmdAddFinance: '.nconfig addfinance <mensaje> - Agregar mensaje financiero',
        cmdAddMotivation: '.nconfig addmotivation <mensaje> - Agregar mensaje motivacional',
        cmdSetChannel: '.nconfig setchannel <mensaje> - Establecer mensaje de canal',
        schedulerEnabled: '✅ ¡Programador de boletín habilitado!',
        schedulerDisabled: '❌ ¡Programador de boletín deshabilitado!',
        apiEnabled: '✅ ¡Obtención de contenido API habilitada!\n\n🌐 Obtendrá citas frescas y noticias financieras de APIs.',
        apiDisabled: '❌ ¡Contenido API deshabilitado!\n\n📝 Usará solo tus mensajes personalizados.',
        financeApiEnabled: '✅ ¡API Financiera habilitada!',
        financeApiDisabled: '❌ ¡API Financiera deshabilitada!',
        motivationApiEnabled: '✅ ¡API Motivacional habilitada!',
        motivationApiDisabled: '❌ ¡API Motivacional deshabilitada!',
        financeEnabled: '✅ ¡Publicaciones financieras habilitadas!',
        financeDisabled: '❌ ¡Publicaciones financieras deshabilitadas!',
        motivationEnabled: '✅ ¡Publicaciones motivacionales habilitadas!',
        motivationDisabled: '❌ ¡Publicaciones motivacionales deshabilitadas!',
        channelsEnabled: '✅ ¡Publicaciones de promoción de canal habilitadas!',
        channelsDisabled: '❌ ¡Publicaciones de promoción de canal deshabilitadas!',
        provideMessage: '❌ ¡Por favor proporciona un mensaje!\n\nUso: .nconfig {action} <mensaje>',
        financeAdded: '✅ ¡Mensaje financiero agregado!\n\nTotal de mensajes: {count}',
        motivationAdded: '✅ ¡Mensaje motivacional agregado!\n\nTotal de mensajes: {count}',
        channelUpdated: '✅ ¡Mensaje de promoción de canal actualizado!',
        unknownCommand: '❌ ¡Comando desconocido!\n\nUsa .nconfig para ver los comandos disponibles.',
        error: '❌ Error: {error}'
    },
    pt: {
        title: '📰 CONFIGURAÇÃO DE BOLETIM',
        status: '🔧 Status:',
        enabled: '✅ Habilitado',
        disabled: '❌ Desabilitado',
        financePosts: '📊 Postagens Financeiras:',
        motivationPosts: '💪 Postagens Motivacionais:',
        channelPromotion: '📢 Promoção de Canal:',
        days: 'Dias:',
        time: 'Hora:',
        messages: 'Mensagens:',
        commands: '⚙️ Comandos:',
        cmdEnable: '.nconfig enable - Habilitar agendador',
        cmdDisable: '.nconfig disable - Desabilitar agendador',
        cmdFinance: '.nconfig finance on/off - Alternar postagens financeiras',
        cmdMotivation: '.nconfig motivation on/off - Alternar postagens motivacionais',
        cmdChannels: '.nconfig channels on/off - Alternar postagens de canal',
        cmdAddFinance: '.nconfig addfinance <mensagem> - Adicionar mensagem financeira',
        cmdAddMotivation: '.nconfig addmotivation <mensagem> - Adicionar mensagem motivacional',
        cmdSetChannel: '.nconfig setchannel <mensagem> - Definir mensagem de canal',
        schedulerEnabled: '✅ Agendador de boletim habilitado!',
        schedulerDisabled: '❌ Agendador de boletim desabilitado!',
        apiEnabled: '✅ Busca de conteúdo API habilitada!\n\n🌐 Buscará citações frescas e notícias financeiras de APIs.',
        apiDisabled: '❌ Conteúdo API desabilitado!\n\n📝 Usará apenas suas mensagens personalizadas.',
        financeApiEnabled: '✅ API Financeira habilitada!',
        financeApiDisabled: '❌ API Financeira desabilitada!',
        motivationApiEnabled: '✅ API Motivacional habilitada!',
        motivationApiDisabled: '❌ API Motivacional desabilitada!',
        financeEnabled: '✅ Postagens financeiras habilitadas!',
        financeDisabled: '❌ Postagens financeiras desabilitadas!',
        motivationEnabled: '✅ Postagens motivacionais habilitadas!',
        motivationDisabled: '❌ Postagens motivacionais desabilitadas!',
        channelsEnabled: '✅ Postagens de promoção de canal habilitadas!',
        channelsDisabled: '❌ Postagens de promoção de canal desabilitadas!',
        provideMessage: '❌ Por favor forneça uma mensagem!\n\nUso: .nconfig {action} <mensagem>',
        financeAdded: '✅ Mensagem financeira adicionada!\n\nTotal de mensagens: {count}',
        motivationAdded: '✅ Mensagem motivacional adicionada!\n\nTotal de mensagens: {count}',
        channelUpdated: '✅ Mensagem de promoção de canal atualizada!',
        unknownCommand: '❌ Comando desconhecido!\n\nUse .nconfig para ver os comandos disponíveis.',
        error: '❌ Erro: {error}'
    },
    ar: {
        title: '📰 إعدادات النشرة الإخبارية',
        status: '🔧 الحالة:',
        enabled: '✅ مفعّل',
        disabled: '❌ معطّل',
        financePosts: '📊 منشورات المالية:',
        motivationPosts: '💪 منشورات التحفيز:',
        channelPromotion: '📢 ترويج القناة:',
        days: 'الأيام:',
        time: 'الوقت:',
        messages: 'الرسائل:',
        commands: '⚙️ الأوامر:',
        cmdEnable: '.nconfig enable - تفعيل المجدول',
        cmdDisable: '.nconfig disable - تعطيل المجدول',
        cmdFinance: '.nconfig finance on/off - تبديل منشورات المالية',
        cmdMotivation: '.nconfig motivation on/off - تبديل منشورات التحفيز',
        cmdChannels: '.nconfig channels on/off - تبديل منشورات القناة',
        cmdAddFinance: '.nconfig addfinance <رسالة> - إضافة رسالة مالية',
        cmdAddMotivation: '.nconfig addmotivation <رسالة> - إضافة رسالة تحفيزية',
        cmdSetChannel: '.nconfig setchannel <رسالة> - تعيين رسالة القناة',
        schedulerEnabled: '✅ مجدول النشرة مفعّل!',
        schedulerDisabled: '❌ مجدول النشرة معطّل!',
        apiEnabled: '✅ جلب محتوى API مفعّل!\n\n🌐 سيجلب اقتباسات وأخبار مالية جديدة من APIs.',
        apiDisabled: '❌ محتوى API معطّل!\n\n📝 سيستخدم رسائلك المخصصة فقط.',
        financeApiEnabled: '✅ API المالية مفعّل!',
        financeApiDisabled: '❌ API المالية معطّل!',
        motivationApiEnabled: '✅ API التحفيز مفعّل!',
        motivationApiDisabled: '❌ API التحفيز معطّل!',
        financeEnabled: '✅ منشورات المالية مفعّلة!',
        financeDisabled: '❌ منشورات المالية معطّلة!',
        motivationEnabled: '✅ منشورات التحفيز مفعّلة!',
        motivationDisabled: '❌ منشورات التحفيز معطّلة!',
        channelsEnabled: '✅ منشورات ترويج القناة مفعّلة!',
        channelsDisabled: '❌ منشورات ترويج القناة معطّلة!',
        provideMessage: '❌ من فضلك اكتب رسالة!\n\nالاستخدام: .nconfig {action} <رسالة>',
        financeAdded: '✅ رسالة مالية مضافة!\n\nإجمالي الرسائل: {count}',
        motivationAdded: '✅ رسالة تحفيزية مضافة!\n\nإجمالي الرسائل: {count}',
        channelUpdated: '✅ رسالة ترويج القناة محدّثة!',
        unknownCommand: '❌ أمر غير معروف!\n\nاستخدم .nconfig لرؤية الأوامر المتاحة.',
        error: '❌ خطأ: {error}'
    },
    hi: {
        title: '📰 न्यूज़लेटर कॉन्फ़िगरेशन',
        status: '🔧 स्टेटस:',
        enabled: '✅ सक्षम',
        disabled: '❌ अक्षम',
        financePosts: '📊 फाइनेंस पोस्ट:',
        motivationPosts: '💪 मोटिवेशन पोस्ट:',
        channelPromotion: '📢 चैनल प्रमोशन:',
        days: 'दिन:',
        time: 'समय:',
        messages: 'मैसेज:',
        commands: '⚙️ कमांड:',
        cmdEnable: '.nconfig enable - शेड्यूलर सक्षम करें',
        cmdDisable: '.nconfig disable - शेड्यूलर अक्षम करें',
        cmdFinance: '.nconfig finance on/off - फाइनेंस पोस्ट टॉगल करें',
        cmdMotivation: '.nconfig motivation on/off - मोटिवेशन पोस्ट टॉगल करें',
        cmdChannels: '.nconfig channels on/off - चैनल पोस्ट टॉगल करें',
        cmdAddFinance: '.nconfig addfinance <message> - फाइनेंस मैसेज जोड़ें',
        cmdAddMotivation: '.nconfig addmotivation <message> - मोटिवेशन मैसेज जोड़ें',
        cmdSetChannel: '.nconfig setchannel <message> - चैनल मैसेज सेट करें',
        schedulerEnabled: '✅ न्यूज़लेटर शेड्यूलर सक्षम!',
        schedulerDisabled: '❌ न्यूज़लेटर शेड्यूलर अक्षम!',
        apiEnabled: '✅ API कंटेंट फेचिंग सक्षम!\n\n🌐 API से ताज़ा कोट्स और फाइनेंस न्यूज़ प्राप्त करेगा।',
        apiDisabled: '❌ API कंटेंट अक्षम!\n\n📝 केवल आपके कस्टम मैसेज का उपयोग करेगा।',
        financeApiEnabled: '✅ फाइनेंस API सक्षम!',
        financeApiDisabled: '❌ फाइनेंस API अक्षम!',
        motivationApiEnabled: '✅ मोटिवेशन API सक्षम!',
        motivationApiDisabled: '❌ मोटिवेशन API अक्षम!',
        financeEnabled: '✅ फाइनेंस पोस्ट सक्षम!',
        financeDisabled: '❌ फाइनेंस पोस्ट अक्षम!',
        motivationEnabled: '✅ मोटिवेशन पोस्ट सक्षम!',
        motivationDisabled: '❌ मोटिवेशन पोस्ट अक्षम!',
        channelsEnabled: '✅ चैनल प्रमोशन पोस्ट सक्षम!',
        channelsDisabled: '❌ चैनल प्रमोशन पोस्ट अक्षम!',
        provideMessage: '❌ कृपया एक मैसेज प्रदान करें!\n\nउपयोग: .nconfig {action} <message>',
        financeAdded: '✅ फाइनेंस मैसेज जोड़ा गया!\n\nकुल मैसेज: {count}',
        motivationAdded: '✅ मोटिवेशन मैसेज जोड़ा गया!\n\nकुल मैसेज: {count}',
        channelUpdated: '✅ चैनल प्रमोशन मैसेज अपडेट किया गया!',
        unknownCommand: '❌ अज्ञात कमांड!\n\nउपलब्ध कमांड देखने के लिए .nconfig का उपयोग करें।',
        error: '❌ त्रुटि: {error}'
    }
};

export default {
    name: 'newsletterconfig',
    aliases: ['newsconfig', 'nconfig'],
    ownerOnly: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;

        try {
            const config = loadNewsletterConfig();

            // No args - show current config
            if (args.length === 0) {
                const status = config.enabled ? t.enabled : t.disabled;
                const financeStatus = config.schedule.finance.enabled ? '✅' : '❌';
                const motivationStatus = config.schedule.motivation.enabled ? '✅' : '❌';
                const channelsStatus = config.schedule.channels.enabled ? '✅' : '❌';

                const daysMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const financeDays = config.schedule.finance.days.map(d => daysMap[d]).join(', ');
                const motivationDays = config.schedule.motivation.days.map(d => daysMap[d]).join(', ');
                const channelsDays = config.schedule.channels.days.map(d => daysMap[d]).join(', ');

                const text = `${t.title}

${t.status} ${status}

${t.financePosts} ${financeStatus}
   ${t.days} ${financeDays}
   ${t.time} ${config.schedule.finance.time}
   ${t.messages} ${config.schedule.finance.messages.length}

${t.motivationPosts} ${motivationStatus}
   ${t.days} ${motivationDays}
   ${t.time} ${config.schedule.motivation.time}
   ${t.messages} ${config.schedule.motivation.messages.length}

${t.channelPromotion} ${channelsStatus}
   ${t.days} ${channelsDays}
   ${t.time} ${config.schedule.channels.time}

${t.commands}
   ${t.cmdEnable}
   ${t.cmdDisable}
   ${t.cmdFinance}
   ${t.cmdMotivation}
   ${t.cmdChannels}
   ${t.cmdAddFinance}
   ${t.cmdAddMotivation}
   ${t.cmdSetChannel}`;

                return await sock.sendMessage(from, { text });
            }

            const action = args[0].toLowerCase();

            // Enable/disable scheduler
            if (action === 'enable') {
                config.enabled = true;
                saveNewsletterConfig(config);
                return await sock.sendMessage(from, { text: t.schedulerEnabled });
            }

            if (action === 'disable') {
                config.enabled = false;
                saveNewsletterConfig(config);
                return await sock.sendMessage(from, { text: t.schedulerDisabled });
            }

            // Toggle API usage
            if (action === 'api') {
                if (args[1] === 'on') {
                    config.useAPIs = true;
                    saveNewsletterConfig(config);
                    return await sock.sendMessage(from, { text: t.apiEnabled });
                } else if (args[1] === 'off') {
                    config.useAPIs = false;
                    saveNewsletterConfig(config);
                    return await sock.sendMessage(from, { text: t.apiDisabled });
                }
            }

            // Toggle finance API
            if (action === 'financeapi') {
                if (args[1] === 'on') {
                    config.schedule.finance.useAPI = true;
                    saveNewsletterConfig(config);
                    return await sock.sendMessage(from, { text: t.financeApiEnabled });
                } else if (args[1] === 'off') {
                    config.schedule.finance.useAPI = false;
                    saveNewsletterConfig(config);
                    return await sock.sendMessage(from, { text: t.financeApiDisabled });
                }
            }

            // Toggle motivation API
            if (action === 'motivationapi') {
                if (args[1] === 'on') {
                    config.schedule.motivation.useAPI = true;
                    saveNewsletterConfig(config);
                    return await sock.sendMessage(from, { text: t.motivationApiEnabled });
                } else if (args[1] === 'off') {
                    config.schedule.motivation.useAPI = false;
                    saveNewsletterConfig(config);
                    return await sock.sendMessage(from, { text: t.motivationApiDisabled });
                }
            }

            // Toggle finance posts
            if (action === 'finance') {
                if (args[1] === 'on') {
                    config.schedule.finance.enabled = true;
                    saveNewsletterConfig(config);
                    return await sock.sendMessage(from, { text: t.financeEnabled });
                } else if (args[1] === 'off') {
                    config.schedule.finance.enabled = false;
                    saveNewsletterConfig(config);
                    return await sock.sendMessage(from, { text: t.financeDisabled });
                }
            }

            // Toggle motivation posts
            if (action === 'motivation') {
                if (args[1] === 'on') {
                    config.schedule.motivation.enabled = true;
                    saveNewsletterConfig(config);
                    return await sock.sendMessage(from, { text: t.motivationEnabled });
                } else if (args[1] === 'off') {
                    config.schedule.motivation.enabled = false;
                    saveNewsletterConfig(config);
                    return await sock.sendMessage(from, { text: t.motivationDisabled });
                }
            }

            // Toggle channel posts
            if (action === 'channels') {
                if (args[1] === 'on') {
                    config.schedule.channels.enabled = true;
                    saveNewsletterConfig(config);
                    return await sock.sendMessage(from, { text: t.channelsEnabled });
                } else if (args[1] === 'off') {
                    config.schedule.channels.enabled = false;
                    saveNewsletterConfig(config);
                    return await sock.sendMessage(from, { text: t.channelsDisabled });
                }
            }

            // Add finance message
            if (action === 'addfinance') {
                const message = args.slice(1).join(' ');
                if (!message) {
                    return await sock.sendMessage(from, {
                        text: t.provideMessage.replace('{action}', 'addfinance')
                    });
                }
                config.schedule.finance.messages.push(message);
                saveNewsletterConfig(config);
                return await sock.sendMessage(from, {
                    text: t.financeAdded.replace('{count}', config.schedule.finance.messages.length)
                });
            }

            // Add motivation message
            if (action === 'addmotivation') {
                const message = args.slice(1).join(' ');
                if (!message) {
                    return await sock.sendMessage(from, {
                        text: t.provideMessage.replace('{action}', 'addmotivation')
                    });
                }
                config.schedule.motivation.messages.push(message);
                saveNewsletterConfig(config);
                return await sock.sendMessage(from, {
                    text: t.motivationAdded.replace('{count}', config.schedule.motivation.messages.length)
                });
            }

            // Set channel message
            if (action === 'setchannel') {
                const message = args.slice(1).join(' ');
                if (!message) {
                    return await sock.sendMessage(from, {
                        text: t.provideMessage.replace('{action}', 'setchannel')
                    });
                }
                config.schedule.channels.message = message;
                saveNewsletterConfig(config);
                return await sock.sendMessage(from, { text: t.channelUpdated });
            }

            // Unknown command
            return await sock.sendMessage(from, { text: t.unknownCommand });

        } catch (error) {
            console.error('[NEWSLETTER CONFIG] Error:', error);
            await sock.sendMessage(from, {
                text: t.error.replace('{error}', error.message)
            });
        }
    }
};
