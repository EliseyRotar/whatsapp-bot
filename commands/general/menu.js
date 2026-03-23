import { config } from '../../config.js';
import { getGroupLanguage } from '../../utils/language.js';
import { sendAsChannelForward } from '../../utils/fakeForward.js';

const responses = {
    en: {
        promo: '🤖 NEED A BOT FOR YOUR GROUP?\n\n💬 Text the owner or add directly:\nwa.me/393313444410\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n',
        title: `╔═══════════════════════════╗\n║   🤖 ${config.botName} - Menu   ║\n╚═══════════════════════════╝`,
        
        content: `
┌─ 🌐 GENERAL (43)
│ .ping .alive .ai .menu .admin .info .latest .updates .stats .jid .checkowner .sticker .delete .vv .setlang .ad .adit .daily .invite .leaderboard .pay .guide .stopguide .image .games .adminhelp .baida .debugorario .orario .setorario .teacher .test .testforward .testuntis .trading .start .scam .shield .killstats .autocall .botoff

┌─ 💰 ECONOMY & SHOP (9)
│ .bank - Check balance | .daily - Claim daily coins (200-50K)
│ .pay @user <amt> - Send coins | .invite - Referral (500/3 friends)
│ .leaderboard - Top players | .shop - Virtual shop
│ .shop buy <item> - Purchase | .shop inventory - View items
│ .buybulk <item> <qty> - Bulk purchase

┌─ 🎮 GAMES (28)
│ .games - List all | .8ball - Magic 8-ball | .dice [bet] - Roll
│ .coinflip <h/t> [bet] - Flip | .rps <choice> - Rock Paper Scissors
│ .guess - Number game | .trivia - Quiz | .math - Math challenge
│ .tictactoe [@user] - Tic-tac-toe | .chess [@user] - Chess
│ .slot [bet/all] - Slots (96% RTP) | .slotstats - Slot statistics
│ .roulette <bet> <type> - Roulette | .mines <bet> - Minesweeper
│ .rob @user - Rob player | .fight - Defend | .double - Double or nothing
│ .tournament - Join tournament | .achievements - View achievements

┌─ 🃏 BLACKJACK (10)
│ .blackjack <bet> - Start | .hit - Draw card | .stand - End turn
│ .double - Double bet | .split - Split pairs | .hand <n> - Switch hand
│ .surrender - Give up | .insurance - Buy insurance
│ .bjstats - Your stats | .bjleaderboard - Top players

┌─ 💀 ACTION (1)
│ .kill @user <weapon> - Kill player (GTA style)
│   Weapons: knife, pistol, rifle, sniper, rpg (buy from .shop)

┌─ 👮 ADMIN (24) - Groups Only
│ Members: .add .kick .ban .promote .demote
│ Moderation: .warn .warnings .mute .unmute .report
│ Tags: .tagall .tagadmin .tagnotadmin .hidetag
│ Settings: .lockdown .antilink .antidelete .welcome
│ Group: .setgname .setgdesc .resetlink .groupinfo .staff
│ Other: .newsletter .delall

┌─ 👑 OWNER (20)
│ Control: .mode .debug .audit .ownerhelp .checkbotjid
│ Broadcast: .spam .broadcast .announce .raid
│ Features: .autovv .newsletterconfig .manage
│ Owners: .addowner .removeowner .listowners
│ Economy: .resetbalances .roball
│ Other: .addall .autocall .botoff

┌─ 📥 DOWNLOADERS (1)
│ .ytmp3 <url> - Download YouTube audio

╔═══════════════════════════╗
║  Prefix: ${config.prefix}  |  Owner: ${config.ownerName}  ║
╚═══════════════════════════╝

💡 Tips:
• Reply to messages: .vv .sticker .delete .debug
• Admin cmds need group admin perms
• Bot must be admin: kick, ban, promote, demote, mute
• Use "all" to bet everything: .slot all .dice all
• Weapons are single-use from .shop

📱 Bot Owner: ${config.ownerName} (+${config.ownerNumber})`
    },
    
    it: {
        promo: '🤖 HAI BISOGNO DI UN BOT PER IL TUO GRUPPO?\n\n💬 Scrivi al proprietario o aggiungi direttamente:\nwa.me/393313444410\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n',
        title: `╔═══════════════════════════╗\n║   🤖 ${config.botName} - Menu   ║\n╚═══════════════════════════╝`,
        
        content: `
┌─ 🌐 GENERALI (43)
│ .ping .alive .ai .menu .admin .info .latest .updates .stats .jid .checkowner .sticker .delete .vv .setlang .ad .adit .daily .invite .leaderboard .pay .guide .stopguide .image .games .adminhelp .baida .debugorario .orario .setorario .teacher .test .testforward .testuntis .trading .start .scam .shield .killstats .autocall .botoff

┌─ 💰 ECONOMIA & NEGOZIO (9)
│ .bank - Saldo | .daily - Monete giornaliere (200-50K)
│ .pay @user <amt> - Invia monete | .invite - Referral (500/3 amici)
│ .leaderboard - Classifica | .shop - Negozio virtuale
│ .shop buy <item> - Acquista | .shop inventory - Inventario
│ .buybulk <item> <qty> - Acquisto in massa

┌─ 🎮 GIOCHI (28)
│ .games - Lista | .8ball - Palla magica | .dice [bet] - Dadi
│ .coinflip <t/c> [bet] - Moneta | .rps <scelta> - Sasso Carta Forbici
│ .guess - Indovina numero | .trivia - Quiz | .math - Matematica
│ .tictactoe [@user] - Tris | .chess [@user] - Scacchi
│ .slot [bet/all] - Slot (96% RTP) | .slotstats - Statistiche slot
│ .roulette <bet> <tipo> - Roulette | .mines <bet> - Campo minato
│ .rob @user - Deruba | .fight - Difendi | .double - Doppio o niente
│ .tournament - Torneo | .achievements - Obiettivi

┌─ 🃏 BLACKJACK (10)
│ .blackjack <bet> - Inizia | .hit - Pesca | .stand - Fermati
│ .double - Raddoppia | .split - Dividi | .hand <n> - Cambia mano
│ .surrender - Arrenditi | .insurance - Assicurazione
│ .bjstats - Statistiche | .bjleaderboard - Classifica

┌─ 💀 AZIONE (1)
│ .kill @user <arma> - Uccidi giocatore (stile GTA)
│   Armi: knife, pistol, rifle, sniper, rpg (compra da .shop)

┌─ 👮 ADMIN (24) - Solo Gruppi
│ Membri: .add .kick .ban .promote .demote
│ Moderazione: .warn .warnings .mute .unmute .report
│ Tag: .tagall .tagadmin .tagnotadmin .hidetag
│ Impostazioni: .lockdown .antilink .antidelete .welcome
│ Gruppo: .setgname .setgdesc .resetlink .groupinfo .staff
│ Altro: .newsletter .delall

┌─ 👑 PROPRIETARIO (20)
│ Controllo: .mode .debug .audit .ownerhelp .checkbotjid
│ Broadcast: .spam .broadcast .announce .raid
│ Funzioni: .autovv .newsletterconfig .manage
│ Proprietari: .addowner .removeowner .listowners
│ Economia: .resetbalances .roball
│ Altro: .addall .autocall .botoff

┌─ 📥 DOWNLOAD (1)
│ .ytmp3 <url> - Scarica audio YouTube

╔═══════════════════════════╗
║  Prefisso: ${config.prefix}  |  Proprietario: ${config.ownerName}  ║
╚═══════════════════════════╝

💡 Suggerimenti:
• Rispondi ai messaggi: .vv .sticker .delete .debug
• Comandi admin richiedono permessi admin
• Bot deve essere admin: kick, ban, promote, demote, mute
• Usa "all" per scommettere tutto: .slot all .dice all
• Le armi sono monouso da .shop

📱 Proprietario Bot: ${config.ownerName} (+${config.ownerNumber})`
    }
};

// Add other languages with full translations
responses.it = {
    promo: '🤖 HAI BISOGNO DI UN BOT PER IL TUO GRUPPO?\n\n💬 Scrivi al proprietario o aggiungi direttamente:\nwa.me/393313444410\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n',
    title: `╔═══════════════════════════╗\n║   🤖 ${config.botName} - Menu   ║\n╚═══════════════════════════╝`,
    
    generalSection: '\n┌─ 🌐 COMANDI GENERALI\n│',
    general: [
        '.ping - Controlla latenza bot',
        '.alive - Stato bot e uptime',
        '.ai <domanda> - Chiedi qualsiasi cosa all\'AI',
        '.menu - Mostra questo menu',
        '.admin - Elenca tutti i comandi admin',
        '.info - Informazioni bot',
        '.latest - Ultimo aggiornamento bot',
        '.updates - Tutti gli aggiornamenti e changelog',
        '.stats - Statistiche server e bot',
        '.jid - Ottieni il tuo WhatsApp JID',
        '.checkowner - Controlla stato proprietario',
        '.sticker - Crea sticker (rispondi a immagine)',
        '.delete - Elimina messaggio (rispondi)',
        '.vv - Rivela visualizza una volta (rispondi)',
        '.setlang <code> - Cambia lingua (en/it/ru/es/pt/ar/hi)',
        '.ad - Pubblicità bot',
        '.adit - Pubblicità bot (Italiano)'
    ],
    
    economySection: '\n┌─ 💰 ECONOMIA & NEGOZIO\n│',
    economy: [
        '.bank - Controlla il tuo saldo monete',
        '.daily - Richiedi monete giornaliere (100-300)',
        '.pay @user <importo> - Invia monete a qualcuno',
        '.invite - Sistema referral (500 monete per 3 amici)',
        '.leaderboard - Classifica migliori giocatori',
        '.shop - Negozio virtuale (badge, boost, armi)',
        '.shop buy <item> - Acquista articoli negozio',
        '.shop inventory - Visualizza i tuoi articoli'
    ],
    
    gamesSection: '\n┌─ 🎮 GIOCHI & SCOMMESSE\n│',
    games: [
        '.games - Elenca tutti i giochi disponibili',
        '.8ball <domanda> - Palla magica 8',
        '.dice [scommessa] - Lancia dadi',
        '.coinflip <testa/croce> [scommessa] - Lancia moneta',
        '.rps <scelta> - Sasso Carta Forbici',
        '.guess - Indovina il numero (1-100)',
        '.trivia - Domanda trivia casuale',
        '.math - Sfida matematica',
        '.ttt [@user] - Tris',
        '.chess [@user] - Gioca a scacchi',
        '.slot [scommessa/all] - Slot machine',
        '.roulette <scommessa> <tipo> - Roulette casinò',
        '.rob @user - Deruba un altro giocatore',
        '.fight - Difenditi dalla rapina'
    ],
    
    blackjackSection: '\n┌─ 🃏 COMANDI BLACKJACK\n│',
    blackjack: [
        '.bj <scommessa> - Inizia partita blackjack',
        '.hit - Pesca una carta',
        '.stand - Termina il tuo turno',
        '.double - Raddoppia scommessa e pesca una carta',
        '.split - Dividi coppie in due mani',
        '.hand <numero> - Cambia tra le mani',
        '.surrender - Arrenditi (recupera metà scommessa)',
        '.insurance - Acquista assicurazione contro blackjack dealer',
        '.bjstats - Le tue statistiche blackjack',
        '.bjtop - Classifica blackjack'
    ],
    
    actionSection: '\n┌─ 💀 COMANDI AZIONE\n│',
    action: [
        '.kill @user <arma> - Uccidi un altro giocatore (stile GTA)',
        '  Armi: knife, pistol, rifle, sniper, rpg',
        '  Acquista armi da .shop'
    ],
    
    adminSection: '\n┌─ 👮 COMANDI ADMIN (Solo Gruppi)\n│',
    adminMember: [
        '├ 👤 Gestione Membri:',
        '.add <numero> - Aggiungi membro al gruppo',
        '.kick @user - Rimuovi utente',
        '.ban @user - Banna utente',
        '.promote @user - Rendi admin',
        '.demote @user - Rimuovi admin'
    ],
    adminModeration: [
        '├ ⚖️ Moderazione:',
        '.warn @user <motivo> - Avvisa utente',
        '.warn all <motivo> - Avvisa tutti',
        '.warnings @user - Controlla avvisi',
        '.warnings clear @user - Cancella avvisi',
        '.warnings clear all - Cancella tutti gli avvisi',
        '.mute <minuti> - Silenzia gruppo',
        '.report - Segnala messaggio a WhatsApp'
    ],
    adminMessaging: [
        '├ 💬 Messaggi & Tag:',
        '.tagall <msg> - Tagga tutti',
        '.tagadmin <msg> - Tagga solo admin',
        '.tagnotadmin <msg> - Tagga non-admin',
        '.hidetag <msg> - Tag nascosto tutti'
    ],
    adminSettings: [
        '├ ⚙️ Impostazioni Gruppo:',
        '.lockdown <on/off> - Blocca gruppo',
        '.antilink <on/off> - Protezione link',
        '.antidelete <on/off> - Anti-eliminazione messaggi',
        '.welcome <on/off> - Messaggi benvenuto',
        '.setgname <nome> - Cambia nome gruppo',
        '.setgdesc <desc> - Cambia descrizione',
        '.resetlink - Reimposta link invito',
        '.newsletter - Gestisci newsletter',
        '.delall - Elimina tutti i messaggi (PERICOLOSO!)'
    ],
    adminInfo: [
        '└ 📊 Informazioni:',
        '.groupinfo - Dettagli gruppo',
        '.staff - Elenca tutti gli admin'
    ],
    
    ownerSection: '\n┌─ 👑 COMANDI PROPRIETARIO\n│',
    ownerControl: [
        '├ 🔧 Controllo Bot:',
        '.mode <public/private> - Imposta modalità bot',
        '.debug - Info debug (rispondi a msg)',
        '.audit - Log audit sistema',
        '.ownerhelp - Aiuto comandi proprietario',
        '.adminhelp - Aiuto comandi admin'
    ],
    ownerBroadcast: [
        '├ 📢 Broadcasting:',
        `.spam <count> <text> - Spam messaggi (max ${config.maxSpamCount})`,
        '.broadcast <msg> - Invia a tutti i gruppi'
    ],
    ownerSpecial: [
        '├ 🔐 Funzioni Speciali:',
        '.autovv <on/off> - Salvataggio automatico visualizza una volta',
        '.newsletterconfig - Configura API newsletter',
        '.manage @user <azione> - Gestisci permessi utente'
    ],
    ownerManagement: [
        '├ 👥 Gestione Proprietari:',
        '.addowner @user - Concedi permessi proprietario',
        '.removeowner @user - Revoca permessi proprietario',
        '.listowners - Elenca tutti i proprietari',
        '.addall - Aggiungi membri in massa'
    ],
    ownerDestructive: [
        '└ 💀 Distruttivi:',
        '.raid confirm - Raid gruppo (PERICOLOSO!)',
        '.roball - Deruba tutti nel gruppo'
    ],
    
    footer: `\n╔═══════════════════════════╗\n║  Prefisso: ${config.prefix}  |  Proprietario: ${config.ownerName}  ║\n╚═══════════════════════════╝`,
    
    tips: '\n💡 Suggerimenti:\n   • Rispondi ai messaggi per: .vv, .sticker, .delete, .debug\n   • I comandi admin richiedono permessi admin del gruppo\n   • Il bot deve essere admin per: kick, ban, promote, demote, mute\n   • Usa "all" per scommettere tutte le monete: .slot all, .dice all\n   • Le armi sono oggetti monouso da .shop',
    
    botOwner: `\n📱 Proprietario Bot: ${config.ownerName} (+${config.ownerNumber})`
};

responses.ru = {
    promo: '🤖 НУЖЕН БОТ ДЛЯ ВАШЕЙ ГРУППЫ?\n\n💬 Напишите владельцу или добавьте напрямую:\nwa.me/393313444410\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n',
    title: `╔═══════════════════════════╗\n║   🤖 ${config.botName} - Меню   ║\n╚═══════════════════════════╝`,
    
    generalSection: '\n┌─ 🌐 ОБЩИЕ КОМАНДЫ\n│',
    general: [
        '.ping - Проверить задержку бота',
        '.alive - Статус бота и время работы',
        '.ai <вопрос> - Спросить AI что угодно',
        '.menu - Показать это меню',
        '.admin - Список всех команд админа',
        '.info - Информация о боте',
        '.latest - Последнее обновление бота',
        '.updates - Все обновления и журнал изменений',
        '.stats - Статистика сервера и бота',
        '.jid - Получить ваш WhatsApp JID',
        '.checkowner - Проверить статус владельца',
        '.sticker - Создать стикер (ответить на изображение)',
        '.delete - Удалить сообщение (ответить)',
        '.vv - Показать просмотр один раз (ответить)',
        '.setlang <code> - Изменить язык (en/it/ru/es/pt/ar/hi)',
        '.ad - Реклама бота',
        '.adit - Реклама бота (итальянский)'
    ],
    
    economySection: '\n┌─ 💰 ЭКОНОМИКА И МАГАЗИН\n│',
    economy: [
        '.bank - Проверить баланс монет',
        '.daily - Получить ежедневные монеты (100-300)',
        '.pay @user <сумма> - Отправить монеты кому-то',
        '.invite - Реферальная система (500 монет за 3 друзей)',
        '.leaderboard - Рейтинг лучших игроков',
        '.shop - Виртуальный магазин (значки, усиления, оружие)',
        '.shop buy <предмет> - Купить предметы в магазине',
        '.shop inventory - Просмотреть ваши предметы'
    ],
    
    gamesSection: '\n┌─ 🎮 ИГРЫ И АЗАРТНЫЕ ИГРЫ\n│',
    games: [
        '.games - Список всех доступных игр',
        '.8ball <вопрос> - Магический шар 8',
        '.dice [ставка] - Бросить кости',
        '.coinflip <орел/решка> [ставка] - Подбросить монету',
        '.rps <выбор> - Камень Ножницы Бумага',
        '.guess - Угадай число (1-100)',
        '.trivia - Случайный вопрос викторины',
        '.math - Математический вызов',
        '.ttt [@user] - Крестики-нолики',
        '.chess [@user] - Играть в шахматы',
        '.slot [ставка/all] - Игровой автомат',
        '.roulette <ставка> <тип> - Казино рулетка',
        '.rob @user - Ограбить другого игрока',
        '.fight - Защититься от ограбления'
    ],
    
    blackjackSection: '\n┌─ 🃏 КОМАНДЫ БЛЭКДЖЕК\n│',
    blackjack: [
        '.bj <ставка> - Начать игру в блэкджек',
        '.hit - Взять карту',
        '.stand - Закончить ход',
        '.double - Удвоить ставку и взять одну карту',
        '.split - Разделить пары на две руки',
        '.hand <номер> - Переключиться между руками',
        '.surrender - Сдаться (получить половину ставки)',
        '.insurance - Купить страховку от блэкджека дилера',
        '.bjstats - Ваша статистика блэкджек',
        '.bjtop - Таблица лидеров блэкджек'
    ],
    
    actionSection: '\n┌─ 💀 КОМАНДЫ ДЕЙСТВИЙ\n│',
    action: [
        '.kill @user <оружие> - Убить другого игрока (стиль GTA)',
        '  Оружие: knife, pistol, rifle, sniper, rpg',
        '  Купить оружие в .shop'
    ],
    
    adminSection: '\n┌─ 👮 КОМАНДЫ АДМИНА (Только Группы)\n│',
    adminMember: [
        '├ 👤 Управление Участниками:',
        '.add <номер> - Добавить участника в группу',
        '.kick @user - Удалить пользователя',
        '.ban @user - Забанить пользователя',
        '.promote @user - Сделать админом',
        '.demote @user - Снять админа'
    ],
    adminModeration: [
        '├ ⚖️ Модерация:',
        '.warn @user <причина> - Предупредить пользователя',
        '.warn all <причина> - Предупредить всех',
        '.warnings @user - Проверить предупреждения',
        '.warnings clear @user - Очистить предупреждения',
        '.warnings clear all - Очистить все предупреждения',
        '.mute <минуты> - Заглушить группу',
        '.report - Пожаловаться на сообщение в WhatsApp'
    ],
    adminMessaging: [
        '├ 💬 Сообщения и Теги:',
        '.tagall <msg> - Отметить всех',
        '.tagadmin <msg> - Отметить только админов',
        '.tagnotadmin <msg> - Отметить не-админов',
        '.hidetag <msg> - Скрытая отметка всех'
    ],
    adminSettings: [
        '├ ⚙️ Настройки Группы:',
        '.lockdown <on/off> - Заблокировать группу',
        '.antilink <on/off> - Защита от ссылок',
        '.antidelete <on/off> - Анти-удаление сообщений',
        '.welcome <on/off> - Приветственные сообщения',
        '.setgname <имя> - Изменить название группы',
        '.setgdesc <описание> - Изменить описание',
        '.resetlink - Сбросить ссылку-приглашение',
        '.newsletter - Управление рассылкой',
        '.delall - Удалить все сообщения (ОПАСНО!)'
    ],
    adminInfo: [
        '└ 📊 Информация:',
        '.groupinfo - Детали группы',
        '.staff - Список всех админов'
    ],
    
    ownerSection: '\n┌─ 👑 КОМАНДЫ ВЛАДЕЛЬЦА\n│',
    ownerControl: [
        '├ 🔧 Управление Ботом:',
        '.mode <public/private> - Установить режим бота',
        '.debug - Отладочная информация (ответить на msg)',
        '.audit - Журнал аудита системы',
        '.ownerhelp - Помощь по командам владельца',
        '.adminhelp - Помощь по командам админа'
    ],
    ownerBroadcast: [
        '├ 📢 Рассылка:',
        `.spam <count> <text> - Спам сообщений (макс ${config.maxSpamCount})`,
        '.broadcast <msg> - Отправить во все группы'
    ],
    ownerSpecial: [
        '├ 🔐 Специальные Функции:',
        '.autovv <on/off> - Авто-сохранение просмотр один раз',
        '.newsletterconfig - Настроить API рассылки',
        '.manage @user <действие> - Управление правами пользователя'
    ],
    ownerManagement: [
        '├ 👥 Управление Владельцами:',
        '.addowner @user - Предоставить права владельца',
        '.removeowner @user - Отозвать права владельца',
        '.listowners - Список всех владельцев',
        '.addall - Массовое добавление участников'
    ],
    ownerDestructive: [
        '└ 💀 Разрушительные:',
        '.raid confirm - Рейд группы (ОПАСНО!)',
        '.roball - Ограбить всех в группе'
    ],
    
    footer: `\n╔═══════════════════════════╗\n║  Префикс: ${config.prefix}  |  Владелец: ${config.ownerName}  ║\n╚═══════════════════════════╝`,
    
    tips: '\n💡 Советы:\n   • Ответьте на сообщения для: .vv, .sticker, .delete, .debug\n   • Команды админа требуют прав админа группы\n   • Бот должен быть админом для: kick, ban, promote, demote, mute\n   • Используйте "all" чтобы поставить все монеты: .slot all, .dice all\n   • Оружие - одноразовые предметы из .shop',
    
    botOwner: `\n📱 Владелец Бота: ${config.ownerName} (+${config.ownerNumber})`
};

responses.es = {
    promo: '🤖 ¿NECESITAS UN BOT PARA TU GRUPO?\n\n💬 Escribe al dueño o agrega directamente:\nwa.me/393313444410\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n',
    title: `╔═══════════════════════════╗\n║   🤖 ${config.botName} - Menú   ║\n╚═══════════════════════════╝`,
    
    generalSection: '\n┌─ 🌐 COMANDOS GENERALES\n│',
    general: [
        '.ping - Verificar latencia del bot',
        '.alive - Estado del bot y tiempo activo',
        '.ai <pregunta> - Pregunta lo que sea a la IA',
        '.menu - Mostrar este menú',
        '.admin - Listar todos los comandos admin',
        '.info - Información del bot',
        '.latest - Última actualización del bot',
        '.updates - Todas las actualizaciones y registro de cambios',
        '.stats - Estadísticas del servidor y bot',
        '.jid - Obtener tu WhatsApp JID',
        '.checkowner - Verificar estado de dueño',
        '.sticker - Crear sticker (responder a imagen)',
        '.delete - Eliminar mensaje (responder)',
        '.vv - Revelar ver una vez (responder)',
        '.setlang <code> - Cambiar idioma (en/it/ru/es/pt/ar/hi)',
        '.ad - Publicidad del bot',
        '.adit - Publicidad del bot (Italiano)'
    ],
    
    economySection: '\n┌─ 💰 ECONOMÍA Y TIENDA\n│',
    economy: [
        '.bank - Verificar tu saldo de monedas',
        '.daily - Reclamar monedas diarias (100-300)',
        '.pay @usuario <cantidad> - Enviar monedas a alguien',
        '.invite - Sistema de referidos (500 monedas por 3 amigos)',
        '.leaderboard - Clasificación de mejores jugadores',
        '.shop - Tienda virtual (insignias, impulsos, armas)',
        '.shop buy <artículo> - Comprar artículos de la tienda',
        '.shop inventory - Ver tus artículos'
    ],
    
    gamesSection: '\n┌─ 🎮 JUEGOS Y APUESTAS\n│',
    games: [
        '.games - Listar todos los juegos disponibles',
        '.8ball <pregunta> - Bola mágica 8',
        '.dice [apuesta] - Lanzar dados',
        '.coinflip <cara/cruz> [apuesta] - Lanzar moneda',
        '.rps <elección> - Piedra Papel Tijeras',
        '.guess - Adivinar número (1-100)',
        '.trivia - Pregunta de trivia aleatoria',
        '.math - Desafío matemático',
        '.ttt [@usuario] - Tres en raya',
        '.chess [@usuario] - Jugar ajedrez',
        '.slot [apuesta/all] - Máquina tragamonedas',
        '.roulette <apuesta> <tipo> - Ruleta de casino',
        '.rob @usuario - Robar a otro jugador',
        '.fight - Defenderse del robo'
    ],
    
    blackjackSection: '\n┌─ 🃏 COMANDOS BLACKJACK\n│',
    blackjack: [
        '.bj <apuesta> - Iniciar juego de blackjack',
        '.hit - Pedir una carta',
        '.stand - Terminar tu turno',
        '.double - Doblar apuesta y pedir una carta',
        '.split - Dividir pares en dos manos',
        '.hand <número> - Cambiar entre manos',
        '.surrender - Rendirse (recuperar mitad de apuesta)',
        '.insurance - Comprar seguro contra blackjack del crupier',
        '.bjstats - Tus estadísticas de blackjack',
        '.bjtop - Tabla de clasificación de blackjack'
    ],
    
    actionSection: '\n┌─ 💀 COMANDOS DE ACCIÓN\n│',
    action: [
        '.kill @usuario <arma> - Matar a otro jugador (estilo GTA)',
        '  Armas: knife, pistol, rifle, sniper, rpg',
        '  Comprar armas en .shop'
    ],
    
    adminSection: '\n┌─ 👮 COMANDOS ADMIN (Solo Grupos)\n│',
    adminMember: [
        '├ 👤 Gestión de Miembros:',
        '.add <número> - Agregar miembro al grupo',
        '.kick @usuario - Eliminar usuario',
        '.ban @usuario - Banear usuario',
        '.promote @usuario - Hacer admin',
        '.demote @usuario - Quitar admin'
    ],
    adminModeration: [
        '├ ⚖️ Moderación:',
        '.warn @usuario <razón> - Advertir usuario',
        '.warn all <razón> - Advertir a todos',
        '.warnings @usuario - Verificar advertencias',
        '.warnings clear @usuario - Limpiar advertencias',
        '.warnings clear all - Limpiar todas las advertencias',
        '.mute <minutos> - Silenciar grupo',
        '.report - Reportar mensaje a WhatsApp'
    ],
    adminMessaging: [
        '├ 💬 Mensajes y Etiquetas:',
        '.tagall <msg> - Etiquetar a todos',
        '.tagadmin <msg> - Etiquetar solo admins',
        '.tagnotadmin <msg> - Etiquetar no-admins',
        '.hidetag <msg> - Etiqueta oculta a todos'
    ],
    adminSettings: [
        '├ ⚙️ Configuración del Grupo:',
        '.lockdown <on/off> - Bloquear grupo',
        '.antilink <on/off> - Protección de enlaces',
        '.antidelete <on/off> - Anti-eliminación de mensajes',
        '.welcome <on/off> - Mensajes de bienvenida',
        '.setgname <nombre> - Cambiar nombre del grupo',
        '.setgdesc <desc> - Cambiar descripción',
        '.resetlink - Restablecer enlace de invitación',
        '.newsletter - Gestionar boletín',
        '.delall - Eliminar todos los mensajes (¡PELIGROSO!)'
    ],
    adminInfo: [
        '└ 📊 Información:',
        '.groupinfo - Detalles del grupo',
        '.staff - Listar todos los admins'
    ],
    
    ownerSection: '\n┌─ 👑 COMANDOS DUEÑO\n│',
    ownerControl: [
        '├ 🔧 Control del Bot:',
        '.mode <public/private> - Establecer modo del bot',
        '.debug - Información de depuración (responder a msg)',
        '.audit - Registro de auditoría del sistema',
        '.ownerhelp - Ayuda de comandos de dueño',
        '.adminhelp - Ayuda de comandos admin'
    ],
    ownerBroadcast: [
        '├ 📢 Difusión:',
        `.spam <count> <text> - Mensajes spam (máx ${config.maxSpamCount})`,
        '.broadcast <msg> - Enviar a todos los grupos'
    ],
    ownerSpecial: [
        '├ 🔐 Funciones Especiales:',
        '.autovv <on/off> - Auto-guardar ver una vez',
        '.newsletterconfig - Configurar API de boletín',
        '.manage @usuario <acción> - Gestionar permisos de usuario'
    ],
    ownerManagement: [
        '├ 👥 Gestión de Dueños:',
        '.addowner @usuario - Otorgar permisos de dueño',
        '.removeowner @usuario - Revocar permisos de dueño',
        '.listowners - Listar todos los dueños',
        '.addall - Agregar miembros en masa'
    ],
    ownerDestructive: [
        '└ 💀 Destructivos:',
        '.raid confirm - Raid al grupo (¡PELIGROSO!)',
        '.roball - Robar a todos en el grupo'
    ],
    
    footer: `\n╔═══════════════════════════╗\n║  Prefijo: ${config.prefix}  |  Dueño: ${config.ownerName}  ║\n╚═══════════════════════════╝`,
    
    tips: '\n💡 Consejos:\n   • Responde a mensajes para: .vv, .sticker, .delete, .debug\n   • Los comandos admin requieren permisos admin del grupo\n   • El bot debe ser admin para: kick, ban, promote, demote, mute\n   • Usa "all" para apostar todas las monedas: .slot all, .dice all\n   • Las armas son artículos de un solo uso de .shop',
    
    botOwner: `\n📱 Dueño del Bot: ${config.ownerName} (+${config.ownerNumber})`
};

responses.pt = {
    promo: '🤖 PRECISA DE UM BOT PARA SEU GRUPO?\n\n💬 Envie mensagem ao dono ou adicione diretamente:\nwa.me/393313444410\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n',
    title: `╔═══════════════════════════╗\n║   🤖 ${config.botName} - Menu   ║\n╚═══════════════════════════╝`,
    
    generalSection: '\n┌─ 🌐 COMANDOS GERAIS\n│',
    general: [
        '.ping - Verificar latência do bot',
        '.alive - Status do bot e tempo ativo',
        '.ai <pergunta> - Pergunte qualquer coisa à IA',
        '.menu - Mostrar este menu',
        '.admin - Listar todos os comandos admin',
        '.info - Informações do bot',
        '.latest - Última atualização do bot',
        '.updates - Todas as atualizações e registro de alterações',
        '.stats - Estatísticas do servidor e bot',
        '.jid - Obter seu WhatsApp JID',
        '.checkowner - Verificar status de dono',
        '.sticker - Criar sticker (responder a imagem)',
        '.delete - Deletar mensagem (responder)',
        '.vv - Revelar ver uma vez (responder)',
        '.setlang <code> - Mudar idioma (en/it/ru/es/pt/ar/hi)',
        '.ad - Publicidade do bot',
        '.adit - Publicidade do bot (Italiano)'
    ],
    
    economySection: '\n┌─ 💰 ECONOMIA E LOJA\n│',
    economy: [
        '.bank - Verificar seu saldo de moedas',
        '.daily - Reivindicar moedas diárias (100-300)',
        '.pay @usuário <quantia> - Enviar moedas para alguém',
        '.invite - Sistema de indicação (500 moedas por 3 amigos)',
        '.leaderboard - Classificação dos melhores jogadores',
        '.shop - Loja virtual (emblemas, impulsos, armas)',
        '.shop buy <item> - Comprar itens da loja',
        '.shop inventory - Ver seus itens'
    ],
    
    gamesSection: '\n┌─ 🎮 JOGOS E APOSTAS\n│',
    games: [
        '.games - Listar todos os jogos disponíveis',
        '.8ball <pergunta> - Bola mágica 8',
        '.dice [aposta] - Rolar dados',
        '.coinflip <cara/coroa> [aposta] - Lançar moeda',
        '.rps <escolha> - Pedra Papel Tesoura',
        '.guess - Adivinhar número (1-100)',
        '.trivia - Pergunta de trivia aleatória',
        '.math - Desafio matemático',
        '.ttt [@usuário] - Jogo da velha',
        '.chess [@usuário] - Jogar xadrez',
        '.slot [aposta/all] - Caça-níqueis',
        '.roulette <aposta> <tipo> - Roleta de cassino',
        '.rob @usuário - Roubar outro jogador',
        '.fight - Defender-se do roubo'
    ],
    
    blackjackSection: '\n┌─ 🃏 COMANDOS BLACKJACK\n│',
    blackjack: [
        '.bj <aposta> - Iniciar jogo de blackjack',
        '.hit - Pedir uma carta',
        '.stand - Terminar seu turno',
        '.double - Dobrar aposta e pedir uma carta',
        '.split - Dividir pares em duas mãos',
        '.hand <número> - Alternar entre mãos',
        '.surrender - Desistir (recuperar metade da aposta)',
        '.insurance - Comprar seguro contra blackjack do dealer',
        '.bjstats - Suas estatísticas de blackjack',
        '.bjtop - Tabela de classificação de blackjack'
    ],
    
    actionSection: '\n┌─ 💀 COMANDOS DE AÇÃO\n│',
    action: [
        '.kill @usuário <arma> - Matar outro jogador (estilo GTA)',
        '  Armas: knife, pistol, rifle, sniper, rpg',
        '  Comprar armas na .shop'
    ],
    
    adminSection: '\n┌─ 👮 COMANDOS ADMIN (Apenas Grupos)\n│',
    adminMember: [
        '├ 👤 Gestão de Membros:',
        '.add <número> - Adicionar membro ao grupo',
        '.kick @usuário - Remover usuário',
        '.ban @usuário - Banir usuário',
        '.promote @usuário - Tornar admin',
        '.demote @usuário - Remover admin'
    ],
    adminModeration: [
        '├ ⚖️ Moderação:',
        '.warn @usuário <motivo> - Advertir usuário',
        '.warn all <motivo> - Advertir todos',
        '.warnings @usuário - Verificar advertências',
        '.warnings clear @usuário - Limpar advertências',
        '.warnings clear all - Limpar todas as advertências',
        '.mute <minutos> - Silenciar grupo',
        '.report - Reportar mensagem ao WhatsApp'
    ],
    adminMessaging: [
        '├ 💬 Mensagens e Tags:',
        '.tagall <msg> - Marcar todos',
        '.tagadmin <msg> - Marcar apenas admins',
        '.tagnotadmin <msg> - Marcar não-admins',
        '.hidetag <msg> - Tag oculta para todos'
    ],
    adminSettings: [
        '├ ⚙️ Configurações do Grupo:',
        '.lockdown <on/off> - Bloquear grupo',
        '.antilink <on/off> - Proteção de links',
        '.antidelete <on/off> - Anti-exclusão de mensagens',
        '.welcome <on/off> - Mensagens de boas-vindas',
        '.setgname <nome> - Mudar nome do grupo',
        '.setgdesc <desc> - Mudar descrição',
        '.resetlink - Redefinir link de convite',
        '.newsletter - Gerenciar boletim',
        '.delall - Deletar todas as mensagens (PERIGOSO!)'
    ],
    adminInfo: [
        '└ 📊 Informações:',
        '.groupinfo - Detalhes do grupo',
        '.staff - Listar todos os admins'
    ],
    
    ownerSection: '\n┌─ 👑 COMANDOS DONO\n│',
    ownerControl: [
        '├ 🔧 Controle do Bot:',
        '.mode <public/private> - Definir modo do bot',
        '.debug - Informações de depuração (responder a msg)',
        '.audit - Registro de auditoria do sistema',
        '.ownerhelp - Ajuda de comandos de dono',
        '.adminhelp - Ajuda de comandos admin'
    ],
    ownerBroadcast: [
        '├ 📢 Transmissão:',
        `.spam <count> <text> - Mensagens spam (máx ${config.maxSpamCount})`,
        '.broadcast <msg> - Enviar para todos os grupos'
    ],
    ownerSpecial: [
        '├ 🔐 Funções Especiais:',
        '.autovv <on/off> - Auto-salvar ver uma vez',
        '.newsletterconfig - Configurar API de boletim',
        '.manage @usuário <ação> - Gerenciar permissões de usuário'
    ],
    ownerManagement: [
        '├ 👥 Gestão de Donos:',
        '.addowner @usuário - Conceder permissões de dono',
        '.removeowner @usuário - Revogar permissões de dono',
        '.listowners - Listar todos os donos',
        '.addall - Adicionar membros em massa'
    ],
    ownerDestructive: [
        '└ 💀 Destrutivos:',
        '.raid confirm - Raid no grupo (PERIGOSO!)',
        '.roball - Roubar todos no grupo'
    ],
    
    footer: `\n╔═══════════════════════════╗\n║  Prefixo: ${config.prefix}  |  Dono: ${config.ownerName}  ║\n╚═══════════════════════════╝`,
    
    tips: '\n💡 Dicas:\n   • Responda mensagens para: .vv, .sticker, .delete, .debug\n   • Comandos admin requerem permissões admin do grupo\n   • O bot deve ser admin para: kick, ban, promote, demote, mute\n   • Use "all" para apostar todas as moedas: .slot all, .dice all\n   • Armas são itens de uso único da .shop',
    
    botOwner: `\n📱 Dono do Bot: ${config.ownerName} (+${config.ownerNumber})`
};

responses.ar = {
    promo: '🤖 تحتاج بوت لمجموعتك؟\n\n💬 راسل المالك أو أضف مباشرة:\nwa.me/393313444410\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n',
    title: `╔═══════════════════════════╗\n║   🤖 ${config.botName} - القائمة   ║\n╚═══════════════════════════╝`,
    
    generalSection: '\n┌─ 🌐 الأوامر العامة\n│',
    general: [
        '.ping - تحقق من تأخير البوت',
        '.alive - حالة البوت ووقت التشغيل',
        '.ai <سؤال> - اسأل الذكاء الاصطناعي أي شيء',
        '.menu - اعرض هذه القائمة',
        '.admin - اعرض كل أوامر الأدمن',
        '.info - معلومات البوت',
        '.latest - آخر تحديث للبوت',
        '.updates - كل التحديثات وسجل التغييرات',
        '.stats - إحصائيات السيرفر والبوت',
        '.jid - احصل على WhatsApp JID الخاص بك',
        '.checkowner - تحقق من حالة المالك',
        '.sticker - اصنع ملصق (رد على صورة)',
        '.delete - احذف رسالة (رد)',
        '.vv - اكشف عرض مرة واحدة (رد)',
        '.setlang <code> - غير اللغة (en/it/ru/es/pt/ar/hi)',
        '.ad - إعلان البوت',
        '.adit - إعلان البوت (إيطالي)'
    ],
    
    economySection: '\n┌─ 💰 الاقتصاد والمتجر\n│',
    economy: [
        '.bank - تحقق من رصيد العملات',
        '.daily - اطلب العملات اليومية (100-300)',
        '.pay @مستخدم <مبلغ> - أرسل عملات لشخص',
        '.invite - نظام الإحالة (500 عملة لكل 3 أصدقاء)',
        '.leaderboard - تصنيف أفضل اللاعبين',
        '.shop - متجر افتراضي (شارات، تعزيزات، أسلحة)',
        '.shop buy <عنصر> - اشتري عناصر المتجر',
        '.shop inventory - اعرض عناصرك'
    ],
    
    gamesSection: '\n┌─ 🎮 الألعاب والمقامرة\n│',
    games: [
        '.games - اعرض كل الألعاب المتاحة',
        '.8ball <سؤال> - كرة سحرية 8',
        '.dice [رهان] - ارمي النرد',
        '.coinflip <صورة/كتابة> [رهان] - اقلب عملة',
        '.rps <اختيار> - حجر ورقة مقص',
        '.guess - خمن الرقم (1-100)',
        '.trivia - سؤال معلومات عامة عشوائي',
        '.math - تحدي رياضي',
        '.ttt [@مستخدم] - تيك تاك تو',
        '.chess [@مستخدم] - العب شطرنج',
        '.slot [رهان/all] - ماكينة سلوت',
        '.roulette <رهان> <نوع> - روليت كازينو',
        '.rob @مستخدم - اسرق لاعب آخر',
        '.fight - دافع ضد السرقة'
    ],
    
    blackjackSection: '\n┌─ 🃏 أوامر بلاك جاك\n│',
    blackjack: [
        '.bj <رهان> - ابدأ لعبة بلاك جاك',
        '.hit - اسحب ورقة',
        '.stand - أنهي دورك',
        '.double - ضاعف الرهان واسحب ورقة واحدة',
        '.split - قسم الأزواج إلى يدين',
        '.hand <رقم> - بدل بين الأيدي',
        '.surrender - استسلم (استرجع نصف الرهان)',
        '.insurance - اشتري تأمين ضد بلاك جاك الموزع',
        '.bjstats - إحصائياتك في بلاك جاك',
        '.bjtop - لوحة صدارة بلاك جاك'
    ],
    
    actionSection: '\n┌─ 💀 أوامر الإجراءات\n│',
    action: [
        '.kill @مستخدم <سلاح> - اقتل لاعب آخر (أسلوب GTA)',
        '  الأسلحة: knife, pistol, rifle, sniper, rpg',
        '  اشتري أسلحة من .shop'
    ],
    
    adminSection: '\n┌─ 👮 أوامر الأدمن (المجموعات فقط)\n│',
    adminMember: [
        '├ 👤 إدارة الأعضاء:',
        '.add <رقم> - أضف عضو للمجموعة',
        '.kick @مستخدم - احذف مستخدم',
        '.ban @مستخدم - احظر مستخدم',
        '.promote @مستخدم - اجعله أدمن',
        '.demote @مستخدم - احذف أدمن'
    ],
    adminModeration: [
        '├ ⚖️ الإشراف:',
        '.warn @مستخدم <سبب> - حذر مستخدم',
        '.warn all <سبب> - حذر الجميع',
        '.warnings @مستخدم - تحقق من التحذيرات',
        '.warnings clear @مستخدم - امسح التحذيرات',
        '.warnings clear all - امسح كل التحذيرات',
        '.mute <دقائق> - اكتم المجموعة',
        '.report - بلغ عن رسالة لـ WhatsApp'
    ],
    adminMessaging: [
        '├ 💬 الرسائل والعلامات:',
        '.tagall <msg> - علم الجميع',
        '.tagadmin <msg> - علم الأدمن فقط',
        '.tagnotadmin <msg> - علم غير الأدمن',
        '.hidetag <msg> - علامة مخفية للجميع'
    ],
    adminSettings: [
        '├ ⚙️ إعدادات المجموعة:',
        '.lockdown <on/off> - اقفل المجموعة',
        '.antilink <on/off> - حماية الروابط',
        '.antidelete <on/off> - منع حذف الرسائل',
        '.welcome <on/off> - رسائل الترحيب',
        '.setgname <اسم> - غير اسم المجموعة',
        '.setgdesc <وصف> - غير الوصف',
        '.resetlink - أعد تعيين رابط الدعوة',
        '.newsletter - أدر النشرة الإخبارية',
        '.delall - احذف كل الرسائل (خطير!)'
    ],
    adminInfo: [
        '└ 📊 المعلومات:',
        '.groupinfo - تفاصيل المجموعة',
        '.staff - اعرض كل الأدمن'
    ],
    
    ownerSection: '\n┌─ 👑 أوامر المالك\n│',
    ownerControl: [
        '├ 🔧 التحكم بالبوت:',
        '.mode <public/private> - اضبط وضع البوت',
        '.debug - معلومات التصحيح (رد على msg)',
        '.audit - سجل تدقيق النظام',
        '.ownerhelp - مساعدة أوامر المالك',
        '.adminhelp - مساعدة أوامر الأدمن'
    ],
    ownerBroadcast: [
        '├ 📢 البث:',
        `.spam <count> <text> - رسائل سبام (حد أقصى ${config.maxSpamCount})`,
        '.broadcast <msg> - أرسل لكل المجموعات'
    ],
    ownerSpecial: [
        '├ 🔐 ميزات خاصة:',
        '.autovv <on/off> - حفظ تلقائي لعرض مرة واحدة',
        '.newsletterconfig - اضبط API النشرة الإخبارية',
        '.manage @مستخدم <إجراء> - أدر صلاحيات المستخدم'
    ],
    ownerManagement: [
        '├ 👥 إدارة المالكين:',
        '.addowner @مستخدم - امنح صلاحيات المالك',
        '.removeowner @مستخدم - اسحب صلاحيات المالك',
        '.listowners - اعرض كل المالكين',
        '.addall - أضف أعضاء بالجملة'
    ],
    ownerDestructive: [
        '└ 💀 مدمرة:',
        '.raid confirm - اغزو المجموعة (خطير!)',
        '.roball - اسرق الجميع في المجموعة'
    ],
    
    footer: `\n╔═══════════════════════════╗\n║  البادئة: ${config.prefix}  |  المالك: ${config.ownerName}  ║\n╚═══════════════════════════╝`,
    
    tips: '\n💡 نصائح:\n   • رد على الرسائل لـ: .vv, .sticker, .delete, .debug\n   • أوامر الأدمن تتطلب صلاحيات أدمن المجموعة\n   • البوت يجب أن يكون أدمن لـ: kick, ban, promote, demote, mute\n   • استخدم "all" للمراهنة بكل العملات: .slot all, .dice all\n   • الأسلحة عناصر لاستخدام واحد من .shop',
    
    botOwner: `\n📱 مالك البوت: ${config.ownerName} (+${config.ownerNumber})`
};

responses.hi = {
    promo: '🤖 अपने ग्रुप के लिए बॉट चाहिए?\n\n💬 ओनर को मैसेज करें या सीधे जोड़ें:\nwa.me/393313444410\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n',
    title: `╔═══════════════════════════╗\n║   🤖 ${config.botName} - मेनू   ║\n╚═══════════════════════════╝`,
    
    generalSection: '\n┌─ 🌐 सामान्य कमांड\n│',
    general: [
        '.ping - बॉट लेटेंसी चेक करें',
        '.alive - बॉट स्टेटस और अपटाइम',
        '.ai <सवाल> - AI से कुछ भी पूछें',
        '.menu - यह मेनू दिखाएं',
        '.admin - सभी एडमिन कमांड की लिस्ट',
        '.info - बॉट जानकारी',
        '.latest - नवीनतम बॉट अपडेट',
        '.updates - सभी बॉट अपडेट और चेंजलॉग',
        '.stats - सर्वर और बॉट स्टैटिस्टिक्स',
        '.jid - अपना WhatsApp JID प्राप्त करें',
        '.checkowner - ओनर स्टेटस चेक करें',
        '.sticker - स्टिकर बनाएं (इमेज पर रिप्लाई)',
        '.delete - मैसेज डिलीट करें (रिप्लाई)',
        '.vv - व्यू-वन्स रिवील करें (रिप्लाई)',
        '.setlang <code> - भाषा बदलें (en/it/ru/es/pt/ar/hi)',
        '.ad - बॉट विज्ञापन',
        '.adit - बॉट विज्ञापन (इटालियन)'
    ],
    
    economySection: '\n┌─ 💰 इकोनॉमी और शॉप\n│',
    economy: [
        '.bank - अपना कॉइन बैलेंस चेक करें',
        '.daily - डेली कॉइन क्लेम करें (100-300)',
        '.pay @user <amount> - किसी को कॉइन भेजें',
        '.invite - रेफरल सिस्टम (3 दोस्तों पर 500 कॉइन)',
        '.leaderboard - टॉप प्लेयर रैंकिंग',
        '.shop - वर्चुअल शॉप (बैज, बूस्ट, हथियार)',
        '.shop buy <item> - शॉप आइटम खरीदें',
        '.shop inventory - अपनी आइटम देखें'
    ],
    
    gamesSection: '\n┌─ 🎮 गेम्स और जुआ\n│',
    games: [
        '.games - सभी उपलब्ध गेम की लिस्ट',
        '.8ball <सवाल> - मैजिक 8-बॉल',
        '.dice [bet] - डाइस रोल करें',
        '.coinflip <heads/tails> [bet] - कॉइन फ्लिप',
        '.rps <choice> - रॉक पेपर सिजर्स',
        '.guess - नंबर गेसिंग (1-100)',
        '.trivia - रैंडम ट्रिविया सवाल',
        '.math - मैथ चैलेंज',
        '.ttt [@user] - टिक-टैक-टो',
        '.chess [@user] - शतरंज खेलें',
        '.slot [bet/all] - स्लॉट मशीन',
        '.roulette <bet> <type> - कैसीनो रूलेट',
        '.rob @user - दूसरे प्लेयर को लूटें',
        '.fight - लूट के खिलाफ डिफेंड करें'
    ],
    
    blackjackSection: '\n┌─ 🃏 ब्लैकजैक कमांड\n│',
    blackjack: [
        '.bj <bet> - ब्लैकजैक गेम शुरू करें',
        '.hit - एक कार्ड ड्रॉ करें',
        '.stand - अपनी टर्न समाप्त करें',
        '.double - बेट डबल करें और एक कार्ड ड्रॉ करें',
        '.split - पेयर को दो हाथों में स्प्लिट करें',
        '.hand <number> - हाथों के बीच स्विच करें',
        '.surrender - सरेंडर करें (आधी बेट वापस पाएं)',
        '.insurance - डीलर ब्लैकजैक के खिलाफ इंश्योरेंस खरीदें',
        '.bjstats - आपकी ब्लैकजैक स्टैटिस्टिक्स',
        '.bjtop - ब्लैकजैक लीडरबोर्ड'
    ],
    
    actionSection: '\n┌─ 💀 एक्शन कमांड\n│',
    action: [
        '.kill @user <weapon> - दूसरे प्लेयर को मारें (GTA स्टाइल)',
        '  हथियार: knife, pistol, rifle, sniper, rpg',
        '  .shop से हथियार खरीदें'
    ],
    
    adminSection: '\n┌─ 👮 एडमिन कमांड (केवल ग्रुप)\n│',
    adminMember: [
        '├ 👤 मेंबर मैनेजमेंट:',
        '.add <number> - ग्रुप में मेंबर जोड़ें',
        '.kick @user - यूज़र हटाएं',
        '.ban @user - यूज़र बैन करें',
        '.promote @user - एडमिन बनाएं',
        '.demote @user - एडमिन हटाएं'
    ],
    adminModeration: [
        '├ ⚖️ मॉडरेशन:',
        '.warn @user <reason> - यूज़र को वार्न करें',
        '.warn all <reason> - सभी को वार्न करें',
        '.warnings @user - वार्निंग चेक करें',
        '.warnings clear @user - वार्निंग क्लियर करें',
        '.warnings clear all - सभी वार्निंग क्लियर करें',
        '.mute <minutes> - ग्रुप म्यूट करें',
        '.report - WhatsApp को मैसेज रिपोर्ट करें'
    ],
    adminMessaging: [
        '├ 💬 मैसेजिंग और टैग:',
        '.tagall <msg> - सभी को टैग करें',
        '.tagadmin <msg> - केवल एडमिन को टैग करें',
        '.tagnotadmin <msg> - नॉन-एडमिन को टैग करें',
        '.hidetag <msg> - सभी को हिडन टैग करें'
    ],
    adminSettings: [
        '├ ⚙️ ग्रुप सेटिंग्स:',
        '.lockdown <on/off> - ग्रुप लॉक करें',
        '.antilink <on/off> - लिंक प्रोटेक्शन',
        '.antidelete <on/off> - एंटी-डिलीट मैसेज',
        '.welcome <on/off> - वेलकम मैसेज',
        '.setgname <name> - ग्रुप नाम बदलें',
        '.setgdesc <desc> - विवरण बदलें',
        '.resetlink - इनवाइट लिंक रीसेट करें',
        '.newsletter - न्यूज़लेटर मैनेज करें',
        '.delall - सभी मैसेज डिलीट करें (खतरनाक!)'
    ],
    adminInfo: [
        '└ 📊 जानकारी:',
        '.groupinfo - ग्रुप विवरण',
        '.staff - सभी एडमिन की लिस्ट'
    ],
    
    ownerSection: '\n┌─ 👑 ओनर कमांड\n│',
    ownerControl: [
        '├ 🔧 बॉट कंट्रोल:',
        '.mode <public/private> - बॉट मोड सेट करें',
        '.debug - डीबग जानकारी (msg पर रिप्लाई)',
        '.audit - सिस्टम ऑडिट लॉग',
        '.ownerhelp - ओनर कमांड हेल्प',
        '.adminhelp - एडमिन कमांड हेल्प'
    ],
    ownerBroadcast: [
        '├ 📢 ब्रॉडकास्टिंग:',
        `.spam <count> <text> - स्पैम मैसेज (अधिकतम ${config.maxSpamCount})`,
        '.broadcast <msg> - सभी ग्रुप में भेजें'
    ],
    ownerSpecial: [
        '├ 🔐 विशेष फीचर:',
        '.autovv <on/off> - ऑटो-सेव व्यू-वन्स',
        '.newsletterconfig - न्यूज़लेटर API कॉन्फ़िगर करें',
        '.manage @user <action> - यूज़र परमिशन मैनेज करें'
    ],
    ownerManagement: [
        '├ 👥 ओनर मैनेजमेंट:',
        '.addowner @user - ओनर परमिशन दें',
        '.removeowner @user - ओनर परमिशन रद्द करें',
        '.listowners - सभी ओनर की लिस्ट',
        '.addall - बल्क में मेंबर जोड़ें'
    ],
    ownerDestructive: [
        '└ 💀 विनाशकारी:',
        '.raid confirm - ग्रुप रेड करें (खतरनाक!)',
        '.roball - ग्रुप में सभी को लूटें'
    ],
    
    footer: `\n╔═══════════════════════════╗\n║  प्रीफिक्स: ${config.prefix}  |  ओनर: ${config.ownerName}  ║\n╚═══════════════════════════╝`,
    
    tips: '\n💡 टिप्स:\n   • इन कमांड के लिए मैसेज पर रिप्लाई करें: .vv, .sticker, .delete, .debug\n   • एडमिन कमांड के लिए ग्रुप एडमिन परमिशन चाहिए\n   • इन कमांड के लिए बॉट को एडमिन होना चाहिए: kick, ban, promote, demote, mute\n   • सभी कॉइन लगाने के लिए "all" का उपयोग करें: .slot all, .dice all\n   • हथियार .shop से एक बार उपयोग वाली आइटम हैं',
    
    botOwner: `\n📱 बॉट ओनर: ${config.ownerName} (+${config.ownerNumber})`
};

responses.ng = {
    promo: '🤖 YOU NEED BOT FOR YOUR GROUP?\n\n💬 Text di owner or add directly:\nwa.me/393313444410\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n',
    title: `╔═══════════════════════════╗\n║   🤖 ${config.botName} - Menu   ║\n╚═══════════════════════════╝`,
    
    generalSection: '\n┌─ 🌐 GENERAL COMMANDS\n│',
    general: [
        '.ping - Check bot latency',
        '.alive - Bot status & uptime',
        '.ai <question> - Ask AI anytin',
        '.menu - Show dis menu',
        '.admin - List all admin commands',
        '.info - Bot information',
        '.latest - Latest bot update',
        '.updates - All bot updates & changelog',
        '.stats - Server & bot statistics',
        '.jid - Get your WhatsApp JID',
        '.checkowner - Check owner status',
        '.sticker - Make sticker (reply to image)',
        '.delete - Delete message (reply)',
        '.vv - Reveal view-once (reply)',
        '.setlang <code> - Change language (en/it/ru/es/pt/ar/hi/ng)',
        '.ad - Bot advertisement',
        '.adit - Bot advertisement (Italian)'
    ],
    
    economySection: '\n┌─ 💰 ECONOMY & SHOP\n│',
    economy: [
        '.bank - Check your coin balance',
        '.daily - Claim daily coins (100-300)',
        '.pay @user <amount> - Send coins to person',
        '.invite - Referral system (500 coins per 3 friends)',
        '.leaderboard - Top players rankings',
        '.shop - Virtual shop (badges, boosts, weapons)',
        '.shop buy <item> - Buy shop items',
        '.shop inventory - See your items'
    ],
    
    gamesSection: '\n┌─ 🎮 GAMES & GAMBLING\n│',
    games: [
        '.games - List all available games',
        '.8ball <question> - Magic 8-ball',
        '.dice [bet] - Roll dice',
        '.coinflip <heads/tails> [bet] - Flip coin',
        '.rps <choice> - Rock Paper Scissors',
        '.guess - Number guessing (1-100)',
        '.trivia - Random trivia question',
        '.math - Math challenge',
        '.ttt [@user] - Tic-tac-toe',
        '.chess [@user] - Play chess',
        '.slot [bet/all] - Slot machine',
        '.roulette <bet> <type> - Casino roulette',
        '.rob @user - Rob another player',
        '.fight - Defend against robbery'
    ],
    
    blackjackSection: '\n┌─ 🃏 BLACKJACK COMMANDS\n│',
    blackjack: [
        '.bj <bet> - Start blackjack game',
        '.hit - Draw one card',
        '.stand - End your turn',
        '.double - Double bet & draw one card',
        '.split - Split pairs into two hands',
        '.hand <number> - Switch between hands',
        '.surrender - Surrender (get half bet back)',
        '.insurance - Buy insurance against dealer blackjack',
        '.bjstats - Your blackjack statistics',
        '.bjtop - Blackjack leaderboard'
    ],
    
    actionSection: '\n┌─ 💀 ACTION COMMANDS\n│',
    action: [
        '.kill @user <weapon> - Kill another player (GTA style)',
        '  Weapons: knife, pistol, rifle, sniper, rpg',
        '  Buy weapons from .shop'
    ],
    
    adminSection: '\n┌─ 👮 ADMIN COMMANDS (Groups Only)\n│',
    adminMember: [
        '├ 👤 Member Management:',
        '.add <number> - Add member to group',
        '.kick @user - Remove user',
        '.ban @user - Ban user',
        '.promote @user - Make admin',
        '.demote @user - Remove admin'
    ],
    adminModeration: [
        '├ ⚖️ Moderation:',
        '.warn @user <reason> - Warn user',
        '.warn all <reason> - Warn everybody',
        '.warnings @user - Check warnings',
        '.warnings clear @user - Clear warnings',
        '.warnings clear all - Clear all warnings',
        '.mute <minutes> - Mute group',
        '.report - Report message to WhatsApp'
    ],
    adminMessaging: [
        '├ 💬 Messaging & Tags:',
        '.tagall <msg> - Tag everybody',
        '.tagadmin <msg> - Tag admins only',
        '.tagnotadmin <msg> - Tag non-admins',
        '.hidetag <msg> - Hidden tag all'
    ],
    adminSettings: [
        '├ ⚙️ Group Settings:',
        '.lockdown <on/off> - Lock group',
        '.antilink <on/off> - Link protection',
        '.antidelete <on/off> - Anti-delete messages',
        '.welcome <on/off> - Welcome messages',
        '.setgname <name> - Change group name',
        '.setgdesc <desc> - Change description',
        '.resetlink - Reset invite link',
        '.newsletter - Manage newsletter',
        '.delall - Delete all messages (DANGEROUS!)'
    ],
    adminInfo: [
        '└ 📊 Information:',
        '.groupinfo - Group details',
        '.staff - List all admins'
    ],
    
    ownerSection: '\n┌─ 👑 OWNER COMMANDS\n│',
    ownerControl: [
        '├ 🔧 Bot Control:',
        '.mode <public/private> - Set bot mode',
        '.debug - Debug info (reply to msg)',
        '.audit - System audit log',
        '.ownerhelp - Owner commands help',
        '.adminhelp - Admin commands help'
    ],
    ownerBroadcast: [
        '├ 📢 Broadcasting:',
        `.spam <count> <text> - Spam messages (max ${config.maxSpamCount})`,
        '.broadcast <msg> - Send to all groups'
    ],
    ownerSpecial: [
        '├ 🔐 Special Features:',
        '.autovv <on/off> - Auto-save view-once',
        '.newsletterconfig - Configure newsletter API',
        '.manage @user <action> - Manage user permissions'
    ],
    ownerManagement: [
        '├ 👥 Owner Management:',
        '.addowner @user - Grant owner permissions',
        '.removeowner @user - Revoke owner permissions',
        '.listowners - List all owners',
        '.addall - Bulk add members'
    ],
    ownerDestructive: [
        '└ 💀 Destructive:',
        '.raid confirm - Raid group (DANGEROUS!)',
        '.roball - Rob everybody for group'
    ],
    
    footer: `\n╔═══════════════════════════╗\n║  Prefix: ${config.prefix}  |  Owner: ${config.ownerName}  ║\n╚═══════════════════════════╝`,
    
    tips: '\n💡 Tips:\n   • Reply to messages for: .vv, .sticker, .delete, .debug\n   • Admin commands need group admin permissions\n   • Bot must be admin for: kick, ban, promote, demote, mute\n   • Use "all" to bet all coins: .slot all, .dice all\n   • Weapons na single-use items from .shop',
    
    botOwner: `\n📱 Bot Owner: ${config.ownerName} (+${config.ownerNumber})`
};

export default {
    name: 'menu',
    aliases: ['help', 'commands'],
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;

        try {
            const menuText = t.promo + t.title + t.content;

            // Send as fake forward from newsletter - this adds the "View Channel" button!
            await sendAsChannelForward(sock, from, menuText, {
                quoted: msg,
                newsletterName: config.botName || 'Bot Menu'
            });

        } catch (error) {
            console.error('[MENU] Command error:', error.message);
            await sock.sendMessage(from, {
                text: '❌ An error occurred while generating the menu.'
            });
        }
    }
};
