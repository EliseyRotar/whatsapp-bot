import { config } from '../../config.js';
import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        promo: '🤖 NEED A BOT FOR YOUR GROUP?\n\n💬 Text the owner or add directly:\nwa.me/393313444410\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n',
        title: `╔═══════════════════════════╗\n║   🤖 ${config.botName} - Menu   ║\n╚═══════════════════════════╝`,
        generalCommands: '┌─ 🌐 GENERAL COMMANDS',
        gameCommands: '┌─ 🎮 GAME COMMANDS',
        adminCommands: '┌─ 👮 ADMIN COMMANDS (Groups Only)',
        ownerCommands: `┌─ 👑 OWNER COMMANDS (${config.ownerName} only)`,
        
        // General
        ping: '.ping - Check bot latency',
        alive: '.alive - Bot status & uptime',
        ai: '.ai <question> - Ask AI anything',
        menu: '.menu - Show this menu',
        info: '.info - Bot information',
        latest: '.latest - Latest bot update',
        updates: '.updates - Latest bot updates & changes',
        jid: '.jid - Get your WhatsApp JID',
        checkowner: '.checkowner - Check owner status (mention user)',
        games: '.games - List all available games',
        omegle: '.omegle - Anonymous chat with strangers',
        sticker: '.sticker - Make sticker (reply to image)',
        delete: '.delete - Delete message (reply)',
        vv: '.vv - Reveal view-once (reply to message)',
        ad: '.ad - Bot advertisement & services',
        adit: '.adit - Bot advertisement (Italian)',
        setlang: '.setlang <en|it|ru|es> - Change language (admin/owner in groups)',
        stats: '.stats - Server performance & bot statistics',
        
        // Games
        eightball: '.8ball <question> - Magic 8-ball fortune',
        dice: '.dice - Roll two dice',
        coinflip: '.coinflip - Flip a coin (heads/tails)',
        rps: '.rps <choice> or .rps @user <choice> - Rock Paper Scissors (bot or PvP)',
        guess: '.guess - Number guessing game (1-100)',
        trivia: '.trivia - Random trivia question',
        slot: '.slot - Slot machine game',
        math: '.math - Math challenge',
        tictactoe: '.ttt - Tic-tac-toe (bot or PvP)',
        blackjack: '.bj <bet> - Blackjack vs dealer',
        bjstats: '.bjstats - View your blackjack statistics',
        bjtop: '.bjtop - Top blackjack players',
        bank: '.bank - Check your coin balance',
        
        // Admin sections
        memberMgmt: '├ 👤 Member Management:',
        ban: '.ban @user - Ban user from group',
        kick: '.kick @user - Remove user from group',
        promote: '.promote @user - Promote to admin',
        demote: '.demote @user - Demote from admin',
        
        moderation: '├ ⚖️ Moderation:',
        warn: '.warn @user <reason> - Warn a user',
        warnings: '.warnings @user - Check user warnings',
        warningsClear: '.warnings clear @user - Clear warnings',
        report: '.report - Report message to WhatsApp (reply to msg)',
        
        messaging: '├ 💬 Messaging & Tags:',
        tagall: '.tagall <msg> - Tag everyone',
        tagadmin: '.tagadmin <msg> - Tag admins only',
        tagnotadmin: '.tagnotadmin <msg> - Tag non-admins only',
        hidetag: '.hidetag <msg> - Hidden tag all members',
        
        groupSettings: '├ ⚙️ Group Settings:',
        mute: '.mute <minutes> - Mute group temporarily',
        lockdown: '.lockdown <on/off> - Lock group (admins only messaging)',
        antilink: '.antilink on/off - Toggle link protection',
        welcome: '.welcome on/off - Toggle welcome messages',
        setgname: '.setgname <name> - Change group name',
        setgdesc: '.setgdesc <desc> - Change group description',
        resetlink: '.resetlink - Reset group invite link',
        
        information: '└ 📊 Information:',
        groupinfo: '.groupinfo - Show group details',
        staff: '.staff - List all group admins',
        
        // Owner sections
        botControl: '├ 🔧 Bot Control:',
        mode: '.mode public/private - Set bot access mode',
        debug: '.debug - Show debug info (reply to msg)',
        
        broadcasting: '├ 📢 Broadcasting:',
        spam: `.spam <count> <text> - Spam messages (max ${config.maxSpamCount})`,
        broadcast: '.broadcast <msg> - Send to all groups',
        
        specialFeatures: '├ 🔐 Special Features:',
        autovv: '.autovv on/off - Auto-save view-once media',
        
        ownerMgmt: '├ 👥 Owner Management:',
        addowner: '.addowner @user - Grant owner permissions',
        removeowner: '.removeowner @user - Revoke owner permissions',
        listowners: '.listowners - List all owners',
        
        destructive: '└ 💀 Destructive:',
        raid: '.raid confirm - Raid group (DANGEROUS!)',
        
        footer: `╔═══════════════════════════╗\n║  Prefix: ${config.prefix}  |  Owner: ${config.ownerName}  ║\n╚═══════════════════════════╝`,
        
        tips: '💡 Tips:\n   • Reply to messages for: .vv, .sticker, .delete, .debug\n   • Admin commands require group admin permissions\n   • Bot must be admin for: kick, ban, promote, demote, mute, warn\n   • View-once: .vv reveals after reply, .autovv saves before opening',
        
        botOwner: `📱 Bot Owner: ${config.ownerName} (+${config.ownerNumber})`
    },
    it: {
        promo: '🤖 HAI BISOGNO DI UN BOT PER IL TUO GRUPPO?\n\n💬 Scrivi al proprietario o aggiungi direttamente:\nwa.me/393313444410\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n',
        title: `╔═══════════════════════════╗\n║   🤖 ${config.botName} - Menu   ║\n╚═══════════════════════════╝`,
        generalCommands: '┌─ 🌐 COMANDI GENERALI',
        gameCommands: '┌─ 🎮 COMANDI GIOCHI',
        adminCommands: '┌─ 👮 COMANDI ADMIN (Solo Gruppi)',
        ownerCommands: `┌─ 👑 COMANDI PROPRIETARIO (Solo ${config.ownerName})`,
        
        // General
        ping: '.ping - Controlla latenza bot',
        alive: '.alive - Stato e uptime bot',
        ai: '.ai <domanda> - Chiedi qualsiasi cosa all\'AI',
        menu: '.menu - Mostra questo menu',
        info: '.info - Informazioni bot',
        latest: '.latest - Ultimo aggiornamento bot',
        updates: '.updates - Ultimi aggiornamenti & modifiche bot',
        jid: '.jid - Ottieni il tuo JID WhatsApp',
        checkowner: '.checkowner - Controlla stato proprietario (menziona utente)',
        games: '.games - Elenca tutti i giochi disponibili',
        omegle: '.omegle - Chat anonima con sconosciuti',
        sticker: '.sticker - Crea sticker (rispondi a immagine)',
        delete: '.delete - Elimina messaggio (rispondi)',
        vv: '.vv - Rivela visualizza una volta (rispondi)',
        ad: '.ad - Pubblicità bot & servizi',
        adit: '.adit - Pubblicità bot (Italiano)',
        setlang: '.setlang <en|it|ru> - Cambia lingua (admin/proprietario nei gruppi)',
        stats: '.stats - Prestazioni server & statistiche bot',
        
        // Games
        eightball: '.8ball <domanda> - Palla magica 8',
        dice: '.dice - Lancia due dadi',
        coinflip: '.coinflip - Lancia una moneta (testa/croce)',
        rps: '.rps <scelta> o .rps @utente <scelta> - Sasso Carta Forbici (bot o PvP)',
        guess: '.guess - Indovina il numero (1-100)',
        trivia: '.trivia - Domanda trivia casuale',
        slot: '.slot - Slot machine',
        math: '.math - Sfida matematica',
        tictactoe: '.ttt - Tris (bot o PvP)',
        blackjack: '.bj <puntata> - Blackjack vs dealer',
        bjstats: '.bjstats - Visualizza statistiche blackjack',
        bjtop: '.bjtop - Migliori giocatori blackjack',
        bank: '.bank - Controlla saldo monete',
        
        // Admin sections
        memberMgmt: '├ 👤 Gestione Membri:',
        ban: '.ban @utente - Banna utente dal gruppo',
        kick: '.kick @utente - Rimuovi utente dal gruppo',
        promote: '.promote @utente - Promuovi ad admin',
        demote: '.demote @utente - Rimuovi da admin',
        
        moderation: '├ ⚖️ Moderazione:',
        warn: '.warn @utente <motivo> - Avvisa un utente',
        warnings: '.warnings @utente - Controlla avvisi utente',
        warningsClear: '.warnings clear @utente - Cancella avvisi',
        report: '.report - Segnala messaggio a WhatsApp (rispondi a msg)',
        
        messaging: '├ 💬 Messaggi & Tag:',
        tagall: '.tagall <msg> - Tagga tutti',
        tagadmin: '.tagadmin <msg> - Tagga solo admin',
        tagnotadmin: '.tagnotadmin <msg> - Tagga solo non-admin',
        hidetag: '.hidetag <msg> - Tag nascosto a tutti',
        
        groupSettings: '├ ⚙️ Impostazioni Gruppo:',
        mute: '.mute <minuti> - Silenzia gruppo temporaneamente',
        lockdown: '.lockdown <on/off> - Blocca gruppo (solo admin possono scrivere)',
        antilink: '.antilink on/off - Attiva protezione link',
        welcome: '.welcome on/off - Attiva messaggi benvenuto',
        setgname: '.setgname <nome> - Cambia nome gruppo',
        setgdesc: '.setgdesc <desc> - Cambia descrizione gruppo',
        resetlink: '.resetlink - Resetta link invito gruppo',
        
        information: '└ 📊 Informazioni:',
        groupinfo: '.groupinfo - Mostra dettagli gruppo',
        staff: '.staff - Elenca tutti gli admin',
        
        // Owner sections
        botControl: '├ 🔧 Controllo Bot:',
        mode: '.mode public/private - Imposta modalità accesso',
        debug: '.debug - Mostra info debug (rispondi a msg)',
        
        broadcasting: '├ 📢 Broadcasting:',
        spam: `.spam <numero> <testo> - Spam messaggi (max ${config.maxSpamCount})`,
        broadcast: '.broadcast <msg> - Invia a tutti i gruppi',
        
        specialFeatures: '├ 🔐 Funzioni Speciali:',
        autovv: '.autovv on/off - Salva auto visualizza una volta',
        
        ownerMgmt: '├ 👥 Gestione Proprietari:',
        addowner: '.addowner @utente - Concedi permessi proprietario',
        removeowner: '.removeowner @utente - Revoca permessi proprietario',
        listowners: '.listowners - Elenca tutti i proprietari',
        
        destructive: '└ 💀 Distruttivi:',
        raid: '.raid confirm - Raid gruppo (PERICOLOSO!)',
        
        footer: `╔═══════════════════════════╗\n║  Prefisso: ${config.prefix}  |  Proprietario: ${config.ownerName}  ║\n╚═══════════════════════════╝`,
        
        tips: '💡 Suggerimenti:\n   • Rispondi ai messaggi per: .vv, .sticker, .delete, .debug\n   • Comandi admin richiedono permessi admin gruppo\n   • Bot deve essere admin per: kick, ban, promote, demote, mute, warn\n   • Visualizza una volta: .vv rivela dopo risposta, .autovv salva prima',
        
        botOwner: `📱 Proprietario Bot: ${config.ownerName} (+${config.ownerNumber})`
    },
    ru: {
        promo: '🤖 НУЖЕН БОТ ДЛЯ ВАШЕЙ ГРУППЫ?\n\n💬 Напишите владельцу или добавьте напрямую:\nwa.me/393313444410\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n',
        title: `╔═══════════════════════════╗\n║   🤖 ${config.botName} - Меню   ║\n╚═══════════════════════════╝`,
        generalCommands: '┌─ 🌐 ОБЩИЕ КОМАНДЫ',
        gameCommands: '┌─ 🎮 ИГРОВЫЕ КОМАНДЫ',
        adminCommands: '┌─ 👮 КОМАНДЫ АДМИНИСТРАТОРА (Только группы)',
        ownerCommands: `┌─ 👑 КОМАНДЫ ВЛАДЕЛЬЦА (Только ${config.ownerName})`,
        
        // General
        ping: '.ping - Проверить задержку бота',
        alive: '.alive - Статус и время работы бота',
        ai: '.ai <вопрос> - Спросите что угодно у AI',
        menu: '.menu - Показать это меню',
        info: '.info - Информация о боте',
        latest: '.latest - Последнее обновление бота',
        updates: '.updates - Последние обновления и изменения бота',
        jid: '.jid - Получить ваш WhatsApp JID',
        checkowner: '.checkowner - Проверить статус владельца (упомянуть пользователя)',
        games: '.games - Список всех доступных игр',
        omegle: '.omegle - Анонимный чат с незнакомцами',
        sticker: '.sticker - Создать стикер (ответить на изображение)',
        delete: '.delete - Удалить сообщение (ответить)',
        vv: '.vv - Показать одноразовое сообщение (ответить)',
        ad: '.ad - Реклама бота и услуги',
        adit: '.adit - Реклама бота (итальянский)',
        setlang: '.setlang <en|it|ru> - Изменить язык (админ/владелец в группах)',
        stats: '.stats - Производительность сервера и статистика бота',
        
        // Games
        eightball: '.8ball <вопрос> - Магический шар 8',
        dice: '.dice - Бросить два кубика',
        coinflip: '.coinflip - Подбросить монету (орёл/решка)',
        rps: '.rps <выбор> или .rps @пользователь <выбор> - Камень Ножницы Бумага (бот или PvP)',
        guess: '.guess - Игра угадай число (1-100)',
        trivia: '.trivia - Случайный вопрос викторины',
        slot: '.slot - Игровой автомат',
        math: '.math - Математический вызов',
        tictactoe: '.ttt - Крестики-нолики (бот или PvP)',
        blackjack: '.bj <ставка> - Блэкджек против дилера',
        bjstats: '.bjstats - Просмотр статистики блэкджека',
        bjtop: '.bjtop - Лучшие игроки в блэкджек',
        bank: '.bank - Проверить баланс монет',
        
        // Admin sections
        memberMgmt: '├ 👤 Управление участниками:',
        ban: '.ban @пользователь - Забанить пользователя в группе',
        kick: '.kick @пользователь - Удалить пользователя из группы',
        promote: '.promote @пользователь - Повысить до администратора',
        demote: '.demote @пользователь - Понизить с администратора',
        
        moderation: '├ ⚖️ Модерация:',
        warn: '.warn @пользователь <причина> - Предупредить пользователя',
        warnings: '.warnings @пользователь - Проверить предупреждения пользователя',
        warningsClear: '.warnings clear @пользователь - Очистить предупреждения',
        report: '.report - Сообщить о сообщении в WhatsApp (ответить на сообщение)',
        
        messaging: '├ 💬 Сообщения и теги:',
        tagall: '.tagall <сообщение> - Отметить всех',
        tagadmin: '.tagadmin <сообщение> - Отметить только админов',
        tagnotadmin: '.tagnotadmin <сообщение> - Отметить только не-админов',
        hidetag: '.hidetag <сообщение> - Скрытая отметка всех участников',
        
        groupSettings: '├ ⚙️ Настройки группы:',
        mute: '.mute <минуты> - Заглушить группу временно',
        lockdown: '.lockdown <on/off> - Заблокировать группу (только админы могут писать)',
        antilink: '.antilink on/off - Переключить защиту от ссылок',
        welcome: '.welcome on/off - Переключить приветственные сообщения',
        setgname: '.setgname <имя> - Изменить название группы',
        setgdesc: '.setgdesc <описание> - Изменить описание группы',
        resetlink: '.resetlink - Сбросить ссылку-приглашение группы',
        
        information: '└ 📊 Информация:',
        groupinfo: '.groupinfo - Показать детали группы',
        staff: '.staff - Список всех администраторов группы',
        
        // Owner sections
        botControl: '├ 🔧 Управление ботом:',
        mode: '.mode public/private - Установить режим доступа бота',
        debug: '.debug - Показать отладочную информацию (ответить на сообщение)',
        
        broadcasting: '├ 📢 Рассылка:',
        spam: `.spam <количество> <текст> - Спам сообщениями (макс ${config.maxSpamCount})`,
        broadcast: '.broadcast <сообщение> - Отправить во все группы',
        
        specialFeatures: '├ 🔐 Специальные функции:',
        autovv: '.autovv on/off - Автосохранение одноразовых медиа',
        
        ownerMgmt: '├ 👥 Управление владельцами:',
        addowner: '.addowner @пользователь - Предоставить права владельца',
        removeowner: '.removeowner @пользователь - Отозвать права владельца',
        listowners: '.listowners - Список всех владельцев',
        
        destructive: '└ 💀 Деструктивные:',
        raid: '.raid confirm - Рейд группы (ОПАСНО!)',
        
        footer: `╔═══════════════════════════╗\n║  Префикс: ${config.prefix}  |  Владелец: ${config.ownerName}  ║\n╚═══════════════════════════╝`,
        
        tips: '💡 Советы:\n   • Ответьте на сообщения для: .vv, .sticker, .delete, .debug\n   • Команды администратора требуют прав администратора группы\n   • Бот должен быть администратором для: kick, ban, promote, demote, mute, warn\n   • Одноразовое: .vv показывает после ответа, .autovv сохраняет до открытия',
        
        botOwner: `📱 Владелец бота: ${config.ownerName} (+${config.ownerNumber})`
    },
    es: {
        promo: '🤖 ¿NECESITAS UN BOT PARA TU GRUPO?\n\n💬 Escribe al propietario o agrega directamente:\nwa.me/393313444410\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n',
        title: `╔═══════════════════════════╗\n║   🤖 ${config.botName} - Menú   ║\n╚═══════════════════════════╝`,
        generalCommands: '┌─ 🌐 COMANDOS GENERALES',
        gameCommands: '┌─ 🎮 COMANDOS DE JUEGOS',
        adminCommands: '┌─ 👮 COMANDOS DE ADMIN (Solo Grupos)',
        ownerCommands: `┌─ 👑 COMANDOS DE PROPIETARIO (Solo ${config.ownerName})`,
        
        // General
        ping: '.ping - Verificar latencia del bot',
        alive: '.alive - Estado y tiempo activo del bot',
        ai: '.ai <pregunta> - Pregunta lo que quieras a la IA',
        menu: '.menu - Mostrar este menú',
        info: '.info - Información del bot',
        latest: '.latest - Última actualización del bot',
        updates: '.updates - Últimas actualizaciones y cambios del bot',
        jid: '.jid - Obtener tu JID de WhatsApp',
        checkowner: '.checkowner - Verificar estado de propietario (mencionar usuario)',
        games: '.games - Listar todos los juegos disponibles',
        omegle: '.omegle - Chat anónimo con extraños',
        sticker: '.sticker - Crear sticker (responder a imagen)',
        delete: '.delete - Eliminar mensaje (responder)',
        vv: '.vv - Revelar ver una vez (responder a mensaje)',
        ad: '.ad - Publicidad del bot y servicios',
        adit: '.adit - Publicidad del bot (Italiano)',
        setlang: '.setlang <en|it|ru|es> - Cambiar idioma (admin/propietario en grupos)',
        stats: '.stats - Rendimiento del servidor y estadísticas del bot',
        
        // Games
        eightball: '.8ball <pregunta> - Bola mágica 8',
        dice: '.dice - Lanzar dos dados',
        coinflip: '.coinflip - Lanzar una moneda (cara/cruz)',
        rps: '.rps <elección> o .rps @usuario <elección> - Piedra Papel Tijeras (bot o PvP)',
        guess: '.guess - Juego de adivinar número (1-100)',
        trivia: '.trivia - Pregunta de trivia aleatoria',
        slot: '.slot - Juego de tragamonedas',
        math: '.math - Desafío matemático',
        tictactoe: '.ttt - Tres en raya (bot o PvP)',
        blackjack: '.bj <apuesta> - Blackjack vs crupier',
        bjstats: '.bjstats - Ver tus estadísticas de blackjack',
        bjtop: '.bjtop - Mejores jugadores de blackjack',
        bank: '.bank - Verificar tu saldo de monedas',
        
        // Admin sections
        memberMgmt: '├ 👤 Gestión de Miembros:',
        ban: '.ban @usuario - Banear usuario del grupo',
        kick: '.kick @usuario - Eliminar usuario del grupo',
        promote: '.promote @usuario - Promover a administrador',
        demote: '.demote @usuario - Degradar de administrador',
        
        moderation: '├ ⚖️ Moderación:',
        warn: '.warn @usuario <razón> - Advertir a un usuario',
        warnings: '.warnings @usuario - Verificar advertencias del usuario',
        warningsClear: '.warnings clear @usuario - Limpiar advertencias',
        report: '.report - Reportar mensaje a WhatsApp (responder a msg)',
        
        messaging: '├ 💬 Mensajería y Etiquetas:',
        tagall: '.tagall <msg> - Etiquetar a todos',
        tagadmin: '.tagadmin <msg> - Etiquetar solo administradores',
        tagnotadmin: '.tagnotadmin <msg> - Etiquetar solo no-admins',
        hidetag: '.hidetag <msg> - Etiqueta oculta a todos los miembros',
        
        groupSettings: '├ ⚙️ Configuración del Grupo:',
        mute: '.mute <minutos> - Silenciar grupo temporalmente',
        lockdown: '.lockdown <on/off> - Bloquear grupo (solo admins pueden enviar mensajes)',
        antilink: '.antilink on/off - Activar protección de enlaces',
        welcome: '.welcome on/off - Activar mensajes de bienvenida',
        setgname: '.setgname <nombre> - Cambiar nombre del grupo',
        setgdesc: '.setgdesc <desc> - Cambiar descripción del grupo',
        resetlink: '.resetlink - Restablecer enlace de invitación del grupo',
        
        information: '└ 📊 Información:',
        groupinfo: '.groupinfo - Mostrar detalles del grupo',
        staff: '.staff - Listar todos los administradores del grupo',
        
        // Owner sections
        botControl: '├ 🔧 Control del Bot:',
        mode: '.mode public/private - Establecer modo de acceso del bot',
        debug: '.debug - Mostrar información de depuración (responder a msg)',
        
        broadcasting: '├ 📢 Transmisión:',
        spam: `.spam <cantidad> <texto> - Enviar spam de mensajes (máx ${config.maxSpamCount})`,
        broadcast: '.broadcast <msg> - Enviar a todos los grupos',
        
        specialFeatures: '├ 🔐 Funciones Especiales:',
        autovv: '.autovv on/off - Guardar automáticamente medios de ver una vez',
        
        ownerMgmt: '├ 👥 Gestión de Propietarios:',
        addowner: '.addowner @usuario - Otorgar permisos de propietario',
        removeowner: '.removeowner @usuario - Revocar permisos de propietario',
        listowners: '.listowners - Listar todos los propietarios',
        
        destructive: '└ 💀 Destructivos:',
        raid: '.raid confirm - Raid del grupo (¡PELIGROSO!)',
        
        footer: `╔═══════════════════════════╗\n║  Prefijo: ${config.prefix}  |  Propietario: ${config.ownerName}  ║\n╚═══════════════════════════╝`,
        
        tips: '💡 Consejos:\n   • Responde a mensajes para: .vv, .sticker, .delete, .debug\n   • Los comandos de admin requieren permisos de administrador del grupo\n   • El bot debe ser admin para: kick, ban, promote, demote, mute, warn\n   • Ver una vez: .vv revela después de responder, .autovv guarda antes de abrir',
        
        botOwner: `📱 Propietario del Bot: ${config.ownerName} (+${config.ownerNumber})`
    },
    pt: {
        promo: '🤖 PRECISA DE UM BOT PARA SEU GRUPO?\n\n💬 Envie mensagem ao dono ou adicione diretamente:\nwa.me/393313444410\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n',
        title: `╔═══════════════════════════╗\n║   🤖 ${config.botName} - Menu   ║\n╚═══════════════════════════╝`,
        generalCommands: '┌─ 🌐 COMANDOS GERAIS',
        gameCommands: '┌─ 🎮 COMANDOS DE JOGOS',
        adminCommands: '┌─ 👮 COMANDOS DE ADMIN (Apenas Grupos)',
        ownerCommands: `┌─ 👑 COMANDOS DO DONO (Apenas ${config.ownerName})`,
        
        // General
        ping: '.ping - Verificar latência do bot',
        alive: '.alive - Status e tempo ativo do bot',
        ai: '.ai <pergunta> - Pergunte qualquer coisa à IA',
        menu: '.menu - Mostrar este menu',
        info: '.info - Informações do bot',
        latest: '.latest - Última atualização do bot',
        updates: '.updates - Últimas atualizações e mudanças do bot',
        jid: '.jid - Obter seu JID do WhatsApp',
        checkowner: '.checkowner - Verificar status de dono (mencionar usuário)',
        games: '.games - Listar todos os jogos disponíveis',
        omegle: '.omegle - Chat anônimo com estranhos',
        sticker: '.sticker - Criar sticker (responder a imagem)',
        delete: '.delete - Deletar mensagem (responder)',
        vv: '.vv - Revelar ver uma vez (responder a mensagem)',
        ad: '.ad - Publicidade do bot e serviços',
        adit: '.adit - Publicidade do bot (Italiano)',
        setlang: '.setlang <en|it|ru|es|pt> - Mudar idioma (admin/dono em grupos)',
        stats: '.stats - Desempenho do servidor e estatísticas do bot',
        
        // Games
        eightball: '.8ball <pergunta> - Bola mágica 8',
        dice: '.dice - Lançar dois dados',
        coinflip: '.coinflip - Lançar uma moeda (cara/coroa)',
        rps: '.rps <escolha> ou .rps @usuário <escolha> - Pedra Papel Tesoura (bot ou PvP)',
        guess: '.guess - Jogo de adivinhar número (1-100)',
        trivia: '.trivia - Pergunta de quiz aleatória',
        slot: '.slot - Jogo de caça-níqueis',
        math: '.math - Desafio matemático',
        tictactoe: '.ttt - Jogo da velha (bot ou PvP)',
        blackjack: '.bj <aposta> - Blackjack vs dealer',
        bjstats: '.bjstats - Ver suas estatísticas de blackjack',
        bjtop: '.bjtop - Melhores jogadores de blackjack',
        bank: '.bank - Verificar seu saldo de moedas',
        
        // Admin sections
        memberMgmt: '├ 👤 Gestão de Membros:',
        ban: '.ban @usuário - Banir usuário do grupo',
        kick: '.kick @usuário - Remover usuário do grupo',
        promote: '.promote @usuário - Promover a administrador',
        demote: '.demote @usuário - Rebaixar de administrador',
        
        moderation: '├ ⚖️ Moderação:',
        warn: '.warn @usuário <motivo> - Advertir um usuário',
        warnings: '.warnings @usuário - Verificar advertências do usuário',
        warningsClear: '.warnings clear @usuário - Limpar advertências',
        report: '.report - Denunciar mensagem ao WhatsApp (responder a msg)',
        
        messaging: '├ 💬 Mensagens e Marcações:',
        tagall: '.tagall <msg> - Marcar todos',
        tagadmin: '.tagadmin <msg> - Marcar apenas administradores',
        tagnotadmin: '.tagnotadmin <msg> - Marcar apenas não-admins',
        hidetag: '.hidetag <msg> - Marcação oculta para todos os membros',
        
        groupSettings: '├ ⚙️ Configurações do Grupo:',
        mute: '.mute <minutos> - Silenciar grupo temporariamente',
        lockdown: '.lockdown <on/off> - Bloquear grupo (apenas admins podem enviar mensagens)',
        antilink: '.antilink on/off - Ativar proteção de links',
        welcome: '.welcome on/off - Ativar mensagens de boas-vindas',
        setgname: '.setgname <nome> - Mudar nome do grupo',
        setgdesc: '.setgdesc <desc> - Mudar descrição do grupo',
        resetlink: '.resetlink - Redefinir link de convite do grupo',
        
        information: '└ 📊 Informações:',
        groupinfo: '.groupinfo - Mostrar detalhes do grupo',
        staff: '.staff - Listar todos os administradores do grupo',
        
        // Owner sections
        botControl: '├ 🔧 Controle do Bot:',
        mode: '.mode public/private - Definir modo de acesso do bot',
        debug: '.debug - Mostrar informações de depuração (responder a msg)',
        
        broadcasting: '├ 📢 Transmissão:',
        spam: `.spam <quantidade> <texto> - Enviar spam de mensagens (máx ${config.maxSpamCount})`,
        broadcast: '.broadcast <msg> - Enviar para todos os grupos',
        
        specialFeatures: '├ 🔐 Recursos Especiais:',
        autovv: '.autovv on/off - Salvar automaticamente mídia de ver uma vez',
        
        ownerMgmt: '├ 👥 Gestão de Donos:',
        addowner: '.addowner @usuário - Conceder permissões de dono',
        removeowner: '.removeowner @usuário - Revogar permissões de dono',
        listowners: '.listowners - Listar todos os donos',
        
        destructive: '└ 💀 Destrutivos:',
        raid: '.raid confirm - Raid do grupo (PERIGOSO!)',
        
        footer: `╔═══════════════════════════╗\n║  Prefixo: ${config.prefix}  |  Dono: ${config.ownerName}  ║\n╚═══════════════════════════╝`,
        
        tips: '💡 Dicas:\n   • Responda a mensagens para: .vv, .sticker, .delete, .debug\n   • Comandos de admin requerem permissões de administrador do grupo\n   • Bot deve ser admin para: kick, ban, promote, demote, mute, warn\n   • Ver uma vez: .vv revela após responder, .autovv salva antes de abrir',
        
        botOwner: `📱 Dono do Bot: ${config.ownerName} (+${config.ownerNumber})`
    },
    ar: {
        promo: '🤖 تحتاج بوت لمجموعتك؟\n\n💬 راسل المالك أو أضف مباشرة:\nwa.me/393313444410\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n',
        title: `╔═══════════════════════════╗\n║   🤖 ${config.botName} - القائمة   ║\n╚═══════════════════════════╝`,
        generalCommands: '┌─ 🌐 الأوامر العامة',
        gameCommands: '┌─ 🎮 أوامر الألعاب',
        adminCommands: '┌─ 👮 أوامر الإدارة (المجموعات فقط)',
        ownerCommands: `┌─ 👑 أوامر المالك (${config.ownerName} فقط)`,
        
        // General
        ping: '.ping - فحص سرعة البوت',
        alive: '.alive - حالة البوت ووقت التشغيل',
        ai: '.ai <سؤال> - اسأل الذكاء الاصطناعي أي شيء',
        menu: '.menu - عرض هذه القائمة',
        info: '.info - معلومات البوت',
        latest: '.latest - آخر تحديث للبوت',
        updates: '.updates - آخر التحديثات والتغييرات',
        jid: '.jid - احصل على JID الواتساب الخاص بك',
        checkowner: '.checkowner - فحص حالة المالك (منشن المستخدم)',
        games: '.games - قائمة جميع الألعاب المتاحة',
        omegle: '.omegle - دردشة مجهولة مع الغرباء',
        sticker: '.sticker - صنع ملصق (رد على صورة)',
        delete: '.delete - حذف رسالة (رد)',
        vv: '.vv - كشف رسالة المشاهدة مرة واحدة (رد)',
        ad: '.ad - إعلان البوت والخدمات',
        adit: '.adit - إعلان البوت (إيطالي)',
        setlang: '.setlang <en|it|ru|es|pt|ar> - تغيير اللغة (مشرف/مالك في المجموعات)',
        stats: '.stats - أداء السيرفر وإحصائيات البوت',
        
        // Games
        eightball: '.8ball <سؤال> - كرة الحظ السحرية',
        dice: '.dice - رمي نردين',
        coinflip: '.coinflip - رمي عملة (وجه/كتابة)',
        rps: '.rps <اختيار> أو .rps @مستخدم <اختيار> - حجر ورقة مقص (بوت أو لاعب ضد لاعب)',
        guess: '.guess - لعبة تخمين الرقم (1-100)',
        trivia: '.trivia - سؤال ثقافي عشوائي',
        slot: '.slot - لعبة السلوت',
        math: '.math - تحدي رياضي',
        tictactoe: '.ttt - إكس أو (بوت أو لاعب ضد لاعب)',
        blackjack: '.bj <رهان> - بلاك جاك ضد الموزع',
        bjstats: '.bjstats - عرض إحصائيات البلاك جاك',
        bjtop: '.bjtop - أفضل لاعبي البلاك جاك',
        bank: '.bank - فحص رصيد العملات',
        
        // Admin sections
        memberMgmt: '├ 👤 إدارة الأعضاء:',
        ban: '.ban @مستخدم - حظر مستخدم من المجموعة',
        kick: '.kick @مستخدم - إزالة مستخدم من المجموعة',
        promote: '.promote @مستخدم - ترقية إلى مشرف',
        demote: '.demote @مستخدم - خفض رتبة من مشرف',
        
        moderation: '├ ⚖️ الإشراف:',
        warn: '.warn @مستخدم <سبب> - تحذير مستخدم',
        warnings: '.warnings @مستخدم - فحص تحذيرات المستخدم',
        warningsClear: '.warnings clear @مستخدم - مسح التحذيرات',
        report: '.report - الإبلاغ عن رسالة لواتساب (رد على الرسالة)',
        
        messaging: '├ 💬 الرسائل والمنشن:',
        tagall: '.tagall <رسالة> - منشن للجميع',
        tagadmin: '.tagadmin <رسالة> - منشن للأدمنز فقط',
        tagnotadmin: '.tagnotadmin <رسالة> - منشن لغير المشرفين فقط',
        hidetag: '.hidetag <رسالة> - منشن مخفي لجميع الأعضاء',
        
        groupSettings: '├ ⚙️ إعدادات المجموعة:',
        mute: '.mute <دقائق> - كتم المجموعة مؤقتاً',
        lockdown: '.lockdown <on/off> - قفل المجموعة (المشرفين فقط يمكنهم الإرسال)',
        antilink: '.antilink on/off - تفعيل حماية الروابط',
        welcome: '.welcome on/off - تفعيل رسائل الترحيب',
        setgname: '.setgname <اسم> - تغيير اسم المجموعة',
        setgdesc: '.setgdesc <وصف> - تغيير وصف المجموعة',
        resetlink: '.resetlink - إعادة تعيين رابط دعوة المجموعة',
        
        information: '└ 📊 المعلومات:',
        groupinfo: '.groupinfo - عرض تفاصيل المجموعة',
        staff: '.staff - قائمة جميع مشرفي المجموعة',
        
        // Owner sections
        botControl: '├ 🔧 التحكم بالبوت:',
        mode: '.mode public/private - تعيين وضع الوصول للبوت',
        debug: '.debug - عرض معلومات التصحيح (رد على رسالة)',
        
        broadcasting: '├ 📢 البث:',
        spam: `.spam <عدد> <نص> - إرسال رسائل متكررة (الحد الأقصى ${config.maxSpamCount})`,
        broadcast: '.broadcast <رسالة> - إرسال لجميع المجموعات',
        
        specialFeatures: '├ 🔐 ميزات خاصة:',
        autovv: '.autovv on/off - حفظ تلقائي للوسائط المشاهدة مرة واحدة',
        
        ownerMgmt: '├ 👥 إدارة المالكين:',
        addowner: '.addowner @مستخدم - منح صلاحيات المالك',
        removeowner: '.removeowner @مستخدم - إلغاء صلاحيات المالك',
        listowners: '.listowners - قائمة جميع المالكين',
        
        destructive: '└ 💀 مدمرة:',
        raid: '.raid confirm - مداهمة المجموعة (خطير!)',
        
        footer: `╔═══════════════════════════╗\n║  البادئة: ${config.prefix}  |  المالك: ${config.ownerName}  ║\n╚═══════════════════════════╝`,
        
        tips: '💡 نصائح:\n   • رد على الرسائل لـ: .vv, .sticker, .delete, .debug\n   • أوامر المشرف تتطلب صلاحيات مشرف المجموعة\n   • البوت يجب أن يكون مشرف لـ: kick, ban, promote, demote, mute, warn\n   • المشاهدة مرة واحدة: .vv يكشف بعد الرد، .autovv يحفظ قبل الفتح',
        
        botOwner: `📱 مالك البوت: ${config.ownerName} (+${config.ownerNumber})`
    }
};

export default {
    name: 'menu',
    aliases: ['help'],
    execute: async (sock, msg) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        const botJid = sock.user?.id?.replace(/:\d+/, '') || '';
        const senderNumber = sender.split('@')[0].replace(/\D/g, '');
        
        // Check if sender is owner
        const isOwner = sender === config.ownerJid ||
                       sender === botJid ||
                       sender.includes(botJid.split('@')[0]) ||
                       senderNumber === config.ownerNumber || 
                       sender.includes(config.ownerNumber) ||
                       msg.key.fromMe;
        
        const menuText = `${t.promo}${t.title}

${t.generalCommands}
│
├ ${t.ping}
├ ${t.alive}
├ ${t.ai}
├ ${t.menu}
├ ${t.info}
├ ${t.jid}
├ ${t.checkowner}
├ ${t.games}
├ ${t.omegle}
├ ${t.sticker}
├ ${t.delete}
├ ${t.vv}
├ ${t.ad}
├ ${t.adit}
├ ${t.setlang}
└ ${t.stats}

${t.gameCommands}
│
├ ${t.eightball}
├ ${t.dice}
├ ${t.coinflip}
├ ${t.rps}
├ ${t.guess}
├ ${t.trivia}
├ ${t.slot}
├ ${t.math}
├ ${t.tictactoe}
└ ${t.blackjack}

${t.adminCommands}
│
${t.memberMgmt}
│  ├ ${t.ban}
│  ├ ${t.kick}
│  ├ ${t.promote}
│  └ ${t.demote}
│
${t.moderation}
│  ├ ${t.warn}
│  ├ ${t.warnings}
│  └ ${t.warningsClear}
│
${t.messaging}
│  ├ ${t.tagall}
│  ├ ${t.tagadmin}
│  ├ ${t.tagnotadmin}
│  └ ${t.hidetag}
│
${t.groupSettings}
│  ├ ${t.mute}
│  ├ ${t.lockdown}
│  ├ ${t.antilink}
│  ├ ${t.welcome}
│  ├ ${t.setgname}
│  ├ ${t.setgdesc}
│  └ ${t.resetlink}
│
${t.information}
   ├ ${t.groupinfo}
   └ ${t.staff}
${isOwner ? `
${t.ownerCommands}
│
${t.botControl}
│  ├ ${t.mode}
│  └ ${t.debug}
│
${t.broadcasting}
│  ├ ${t.spam}
│  └ ${t.broadcast}
│
${t.specialFeatures}
│  └ ${t.autovv}
│
${t.ownerMgmt}
│  ├ ${t.addowner}
│  ├ ${t.removeowner}
│  └ ${t.listowners}
│
${t.destructive}
   └ ${t.raid}
` : ''}
${t.footer}

${t.tips}
   
${t.botOwner}`;

        await sock.sendMessage(from, { text: menuText });
    }
};
