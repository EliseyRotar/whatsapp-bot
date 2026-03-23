import { config } from '../../config.js';
import { getGroupLanguage } from '../../utils/language.js';
import { sendAsChannelForward } from '../../utils/fakeForward.js';

const responses = {
    en: {
        promo: '🤖 NEED A BOT FOR YOUR GROUP?\n\n💬 Text the owner or add directly:\nwa.me/393313444410\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n',
        title: `╔═══════════════════════════╗\n║   🤖 ${config.botName} - Menu   ║\n╚═══════════════════════════╝`,
        
        content: `
┌─ 🌐 GENERAL
│ .ping - Check bot latency
│ .alive - Bot status & uptime
│ .ai <text> - Ask AI anything
│ .menu - Show this menu
│ .admin - Admin commands list
│ .info - Bot information
│ .latest - Latest update
│ .updates - All updates
│ .stats - Server statistics
│ .jid - Get your JID
│ .checkowner - Check owner status
│ .sticker - Make sticker (reply to image)
│ .delete - Delete message (reply)
│ .vv - Reveal view-once (reply)
│ .setlang <code> - Change language
│ .ad - Bot advertisement
│ .adit - Bot ad (Italian)
│ .guide - Bot guide
│ .stopguide - Stop guide
│ .image <text> - Generate AI image
│ .games - List all games
│ .adminhelp - Admin help
│ .baida - Baida command
│ .debugorario - Debug schedule
│ .orario - Check schedule
│ .setorario - Set schedule
│ .teacher - Teacher info
│ .test - Test command
│ .testforward - Test forward
│ .testuntis - Test Untis
│ .trading - Trading info
│ .start - Start bot
│ .scam - Scam info
│ .shield - Shield info
│ .killstats - Kill statistics
│ .pay_v2 - Pay v2

┌─ 💰 ECONOMY & SHOP
│ .bank - Check balance
│ .daily - Daily coins (200-50K)
│ .pay @user <amt> - Send coins
│ .invite - Referral system
│ .leaderboard - Top players
│ .shop - Virtual shop
│ .buybulk <item> <qty> - Bulk buy

┌─ 🎮 GAMES
│ .games - List all games
│ .8ball <question> - Magic 8-ball
│ .dice [bet] - Roll dice
│ .coinflip <h/t> [bet] - Flip coin
│ .rps <choice> - Rock Paper Scissors
│ .guess - Guess number (1-100)
│ .trivia - Trivia question
│ .math - Math challenge
│ .tictactoe [@user] - Tic-tac-toe
│ .chess [@user] - Play chess
│ .slot [bet/all] - Slot machine
│ .slotstats - Slot statistics
│ .roulette <bet> <type> - Roulette
│ .mines <bet> - Minesweeper
│ .rob @user - Rob player
│ .fight - Defend from rob
│ .double - Double or nothing
│ .tournament - Join tournament
│ .achievements - View achievements

┌─ 🃏 BLACKJACK
│ .blackjack <bet> - Start game
│ .hit - Draw card
│ .stand - End turn
│ .double - Double bet
│ .split - Split pairs
│ .hand <n> - Switch hand
│ .surrender - Give up
│ .insurance - Buy insurance
│ .bjstats - Your stats
│ .bjleaderboard - Top players

┌─ 💀 ACTION
│ .kill @user <weapon> - Kill player (GTA style)

┌─ 👮 ADMIN (Groups Only)
│ .add <number> - Add member
│ .kick @user - Remove user
│ .ban @user - Ban user
│ .promote @user - Make admin
│ .demote @user - Remove admin
│ .warn @user <reason> - Warn user
│ .warnings @user - Check warnings
│ .mute <minutes> - Mute group
│ .unmute - Unmute group
│ .report - Report message
│ .tagall <msg> - Tag everyone
│ .tagadmin <msg> - Tag admins
│ .tagnotadmin <msg> - Tag non-admins
│ .hidetag <msg> - Hidden tag all
│ .lockdown <on/off> - Lock group
│ .antilink <on/off> - Link protection
│ .antidelete <on/off> - Anti-delete
│ .welcome <on/off> - Welcome messages
│ .setgname <name> - Change group name
│ .setgdesc <desc> - Change description
│ .resetlink - Reset invite link
│ .groupinfo - Group details
│ .staff - List admins
│ .newsletter - Manage newsletter
│ .delall - Delete all messages

┌─ 👑 OWNER
│ .mode <public/private> - Set bot mode
│ .debug - Debug info (reply)
│ .audit - System audit log
│ .ownerhelp - Owner help
│ .checkbotjid - Check bot JID
│ .spam <count> <text> - Spam messages
│ .broadcast <msg> - Send to all groups
│ .announce <msg> - Announcement
│ .raid confirm - Raid group
│ .autovv <on/off> - Auto-save view-once
│ .newsletterconfig - Newsletter config
│ .manage @user <action> - Manage user
│ .addowner @user - Add owner
│ .removeowner @user - Remove owner
│ .listowners - List owners
│ .resetbalances - Reset all balances
│ .roball - Rob everyone
│ .addall - Bulk add members
│ .autocall - Auto call
│ .botoff - Turn bot off

┌─ 📥 DOWNLOADERS
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
┌─ 🌐 GENERALI
│ .ping - Latenza bot
│ .alive - Stato e uptime
│ .ai <testo> - Chiedi all'AI
│ .menu - Mostra menu
│ .admin - Lista comandi admin
│ .info - Info bot
│ .latest - Ultimo aggiornamento
│ .updates - Tutti gli aggiornamenti
│ .stats - Statistiche server
│ .jid - Ottieni JID
│ .checkowner - Stato proprietario
│ .sticker - Crea sticker (rispondi)
│ .delete - Elimina messaggio (rispondi)
│ .vv - Rivela view-once (rispondi)
│ .setlang <code> - Cambia lingua
│ .ad - Pubblicità bot
│ .adit - Pubblicità (Italiano)
│ .guide - Guida bot
│ .stopguide - Ferma guida
│ .image <testo> - Genera immagine AI
│ .games - Lista giochi
│ .adminhelp - Aiuto admin
│ .baida - Comando baida
│ .debugorario - Debug orario
│ .orario - Controlla orario
│ .setorario - Imposta orario
│ .teacher - Info insegnante
│ .test - Test comando
│ .testforward - Test forward
│ .testuntis - Test Untis
│ .trading - Info trading
│ .start - Avvia bot
│ .scam - Info scam
│ .shield - Info shield
│ .killstats - Statistiche kill
│ .pay_v2 - Pay v2

┌─ 💰 ECONOMIA & NEGOZIO
│ .bank - Saldo
│ .daily - Monete giornaliere (200-50K)
│ .pay @user <amt> - Invia monete
│ .invite - Sistema referral
│ .leaderboard - Classifica
│ .shop - Negozio virtuale
│ .buybulk <item> <qty> - Acquisto massa

┌─ 🎮 GIOCHI
│ .games - Lista giochi
│ .8ball <domanda> - Palla magica 8
│ .dice [bet] - Lancia dadi
│ .coinflip <t/c> [bet] - Lancia moneta
│ .rps <scelta> - Sasso Carta Forbici
│ .guess - Indovina numero (1-100)
│ .trivia - Domanda trivia
│ .math - Sfida matematica
│ .tictactoe [@user] - Tris
│ .chess [@user] - Gioca scacchi
│ .slot [bet/all] - Slot machine
│ .slotstats - Statistiche slot
│ .roulette <bet> <tipo> - Roulette
│ .mines <bet> - Campo minato
│ .rob @user - Deruba giocatore
│ .fight - Difendi da rapina
│ .double - Doppio o niente
│ .tournament - Torneo
│ .achievements - Obiettivi

┌─ 🃏 BLACKJACK
│ .blackjack <bet> - Inizia gioco
│ .hit - Pesca carta
│ .stand - Termina turno
│ .double - Raddoppia scommessa
│ .split - Dividi coppie
│ .hand <n> - Cambia mano
│ .surrender - Arrenditi
│ .insurance - Assicurazione
│ .bjstats - Tue statistiche
│ .bjleaderboard - Classifica

┌─ 💀 AZIONE
│ .kill @user <arma> - Uccidi (stile GTA)

┌─ 👮 ADMIN (Solo Gruppi)
│ .add <numero> - Aggiungi membro
│ .kick @user - Rimuovi utente
│ .ban @user - Banna utente
│ .promote @user - Rendi admin
│ .demote @user - Rimuovi admin
│ .warn @user <motivo> - Avvisa utente
│ .warnings @user - Controlla avvisi
│ .mute <minuti> - Silenzia gruppo
│ .unmute - Riattiva gruppo
│ .report - Segnala messaggio
│ .tagall <msg> - Tagga tutti
│ .tagadmin <msg> - Tagga admin
│ .tagnotadmin <msg> - Tagga non-admin
│ .hidetag <msg> - Tag nascosto
│ .lockdown <on/off> - Blocca gruppo
│ .antilink <on/off> - Protezione link
│ .antidelete <on/off> - Anti-eliminazione
│ .welcome <on/off> - Messaggi benvenuto
│ .setgname <nome> - Cambia nome gruppo
│ .setgdesc <desc> - Cambia descrizione
│ .resetlink - Reset link invito
│ .groupinfo - Dettagli gruppo
│ .staff - Lista admin
│ .newsletter - Gestisci newsletter
│ .delall - Elimina tutti messaggi

┌─ 👑 PROPRIETARIO
│ .mode <public/private> - Modalità bot
│ .debug - Info debug (rispondi)
│ .audit - Log audit sistema
│ .ownerhelp - Aiuto proprietario
│ .checkbotjid - Controlla bot JID
│ .spam <count> <text> - Spam messaggi
│ .broadcast <msg> - Invia a tutti
│ .announce <msg> - Annuncio
│ .raid confirm - Raid gruppo
│ .autovv <on/off> - Auto-salva view-once
│ .newsletterconfig - Config newsletter
│ .manage @user <azione> - Gestisci utente
│ .addowner @user - Aggiungi proprietario
│ .removeowner @user - Rimuovi proprietario
│ .listowners - Lista proprietari
│ .resetbalances - Reset tutti saldi
│ .roball - Deruba tutti
│ .addall - Aggiungi membri massa
│ .autocall - Auto chiamata
│ .botoff - Spegni bot

┌─ 📥 DOWNLOAD
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
    },
    
    ru: {
        promo: '🤖 НУЖЕН БОТ ДЛЯ ВАШЕЙ ГРУППЫ?\n\n💬 Напишите владельцу:\nwa.me/393313444410\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n',
        title: `╔═══════════════════════════╗\n║   🤖 ${config.botName} - Меню   ║\n╚═══════════════════════════╝`,
        content: `
┌─ 🌐 ОБЩИЕ
│ .ping - Проверить задержку
│ .alive - Статус бота
│ .ai <текст> - Спросить AI
│ .menu - Показать меню
│ .admin - Список команд админа
│ .info - Информация о боте
│ .latest - Последнее обновление
│ .updates - Все обновления
│ .stats - Статистика сервера
│ .jid - Получить JID
│ .checkowner - Статус владельца
│ .sticker - Создать стикер (ответ)
│ .delete - Удалить сообщение (ответ)
│ .vv - Показать view-once (ответ)
│ .setlang <код> - Изменить язык
│ .ad - Реклама бота
│ .adit - Реклама (итальянский)
│ .guide - Руководство
│ .stopguide - Остановить руководство
│ .image <текст> - Генерация AI изображения
│ .games - Список игр
│ .adminhelp - Помощь админа
│ .baida - Команда baida
│ .debugorario - Отладка расписания
│ .orario - Проверить расписание
│ .setorario - Установить расписание
│ .teacher - Информация учителя
│ .test - Тестовая команда
│ .testforward - Тест пересылки
│ .testuntis - Тест Untis
│ .trading - Информация о торговле
│ .start - Запустить бота
│ .scam - Информация о мошенничестве
│ .shield - Информация о щите
│ .killstats - Статистика убийств
│ .pay_v2 - Оплата v2

┌─ 💰 ЭКОНОМИКА И МАГАЗИН
│ .bank - Проверить баланс
│ .daily - Ежедневные монеты (200-50K)
│ .pay @user <сумма> - Отправить монеты
│ .invite - Реферальная система
│ .leaderboard - Лучшие игроки
│ .shop - Виртуальный магазин
│ .buybulk <предмет> <кол-во> - Массовая покупка

┌─ 🎮 ИГРЫ
│ .games - Список игр
│ .8ball <вопрос> - Магический шар 8
│ .dice [ставка] - Бросить кости
│ .coinflip <о/р> [ставка] - Подбросить монету
│ .rps <выбор> - Камень Ножницы Бумага
│ .guess - Угадай число (1-100)
│ .trivia - Вопрос викторины
│ .math - Математический вызов
│ .tictactoe [@user] - Крестики-нолики
│ .chess [@user] - Играть в шахматы
│ .slot [ставка/all] - Игровой автомат
│ .slotstats - Статистика слотов
│ .roulette <ставка> <тип> - Рулетка
│ .mines <ставка> - Сапёр
│ .rob @user - Ограбить игрока
│ .fight - Защититься от ограбления
│ .double - Удвоить или ничего
│ .tournament - Присоединиться к турниру
│ .achievements - Достижения

┌─ 🃏 БЛЭКДЖЕК
│ .blackjack <ставка> - Начать игру
│ .hit - Взять карту
│ .stand - Закончить ход
│ .double - Удвоить ставку
│ .split - Разделить пары
│ .hand <n> - Переключить руку
│ .surrender - Сдаться
│ .insurance - Купить страховку
│ .bjstats - Ваша статистика
│ .bjleaderboard - Лучшие игроки

┌─ 💀 ДЕЙСТВИЕ
│ .kill @user <оружие> - Убить (стиль GTA)

┌─ 👮 АДМИН (Только группы)
│ .add <номер> - Добавить участника
│ .kick @user - Удалить пользователя
│ .ban @user - Забанить пользователя
│ .promote @user - Сделать админом
│ .demote @user - Снять админа
│ .warn @user <причина> - Предупредить
│ .warnings @user - Проверить предупреждения
│ .mute <минуты> - Заглушить группу
│ .unmute - Включить группу
│ .report - Пожаловаться на сообщение
│ .tagall <msg> - Отметить всех
│ .tagadmin <msg> - Отметить админов
│ .tagnotadmin <msg> - Отметить не-админов
│ .hidetag <msg> - Скрытая отметка
│ .lockdown <on/off> - Заблокировать группу
│ .antilink <on/off> - Защита от ссылок
│ .antidelete <on/off> - Анти-удаление
│ .welcome <on/off> - Приветственные сообщения
│ .setgname <имя> - Изменить название группы
│ .setgdesc <описание> - Изменить описание
│ .resetlink - Сбросить ссылку-приглашение
│ .groupinfo - Детали группы
│ .staff - Список админов
│ .newsletter - Управление рассылкой
│ .delall - Удалить все сообщения

┌─ 👑 ВЛАДЕЛЕЦ
│ .mode <public/private> - Режим бота
│ .debug - Отладочная информация (ответ)
│ .audit - Журнал аудита
│ .ownerhelp - Помощь владельца
│ .checkbotjid - Проверить JID бота
│ .spam <count> <text> - Спам сообщений
│ .broadcast <msg> - Отправить всем
│ .announce <msg> - Объявление
│ .raid confirm - Рейд группы
│ .autovv <on/off> - Авто-сохранение view-once
│ .newsletterconfig - Конфигурация рассылки
│ .manage @user <действие> - Управление пользователем
│ .addowner @user - Добавить владельца
│ .removeowner @user - Удалить владельца
│ .listowners - Список владельцев
│ .resetbalances - Сбросить все балансы
│ .roball - Ограбить всех
│ .addall - Массовое добавление
│ .autocall - Авто-звонок
│ .botoff - Выключить бота

┌─ 📥 ЗАГРУЗКИ
│ .ytmp3 <url> - Скачать аудио YouTube

╔═══════════════════════════╗
║  Префикс: ${config.prefix}  |  Владелец: ${config.ownerName}  ║
╚═══════════════════════════╝

💡 Советы:
• Ответьте на сообщения: .vv .sticker .delete .debug
• Команды админа требуют прав админа
• Бот должен быть админом: kick, ban, promote, demote, mute
• Используйте "all" для ставки всего: .slot all .dice all
• Оружие одноразовое из .shop

📱 Владелец Бота: ${config.ownerName} (+${config.ownerNumber})`
    },
    
    es: {
        promo: '🤖 ¿NECESITAS UN BOT?\n\n💬 Escribe:\nwa.me/393313444410\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n',
        title: `╔═══════════════════════════╗\n║   🤖 ${config.botName} - Menú   ║\n╚═══════════════════════════╝`,
        content: `
┌─ 🌐 GENERAL
│ .ping - Latencia | .alive - Estado | .ai - Preguntar AI
│ .menu - Menú | .admin - Comandos admin | .info - Info
│ .latest - Última actualización | .updates - Actualizaciones
│ .stats - Estadísticas | .jid - Obtener JID
│ .sticker - Crear sticker | .delete - Eliminar | .vv - Ver view-once
│ .setlang - Cambiar idioma | .guide - Guía | .games - Lista juegos

┌─ 💰 ECONOMÍA
│ .bank - Balance | .daily - Monedas diarias (200-50K)
│ .pay - Enviar monedas | .invite - Referidos
│ .leaderboard - Clasificación | .shop - Tienda

┌─ 🎮 JUEGOS
│ .games - Lista | .8ball - Bola 8 | .dice - Dados
│ .coinflip - Moneda | .rps - Piedra Papel Tijera
│ .slot - Tragamonedas | .roulette - Ruleta | .rob - Robar
│ .blackjack - Blackjack | .chess - Ajedrez

┌─ 👮 ADMIN
│ .add - Agregar | .kick - Expulsar | .ban - Banear
│ .promote - Promover | .demote - Degradar | .warn - Advertir
│ .mute - Silenciar | .tagall - Etiquetar todos

┌─ 👑 DUEÑO
│ .mode - Modo | .broadcast - Difundir | .spam - Spam
│ .addowner - Agregar dueño | .resetbalances - Resetear

╔═══════════════════════════╗
║  Prefijo: ${config.prefix}  |  Dueño: ${config.ownerName}  ║
╚═══════════════════════════╝

📱 Dueño: ${config.ownerName} (+${config.ownerNumber})`
    },
    
    pt: {
        promo: '🤖 PRECISA DE UM BOT?\n\n💬 Fale:\nwa.me/393313444410\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n',
        title: `╔═══════════════════════════╗\n║   🤖 ${config.botName} - Menu   ║\n╚═══════════════════════════╝`,
        content: `
┌─ 🌐 GERAL
│ .ping - Latência | .alive - Status | .ai - Perguntar AI
│ .menu - Menu | .admin - Comandos admin | .info - Info
│ .latest - Última atualização | .updates - Atualizações
│ .stats - Estatísticas | .jid - Obter JID
│ .sticker - Criar sticker | .delete - Deletar | .vv - Ver view-once
│ .setlang - Mudar idioma | .guide - Guia | .games - Lista jogos

┌─ 💰 ECONOMIA
│ .bank - Saldo | .daily - Moedas diárias (200-50K)
│ .pay - Enviar moedas | .invite - Indicações
│ .leaderboard - Classificação | .shop - Loja

┌─ 🎮 JOGOS
│ .games - Lista | .8ball - Bola 8 | .dice - Dados
│ .coinflip - Moeda | .rps - Pedra Papel Tesoura
│ .slot - Caça-níqueis | .roulette - Roleta | .rob - Roubar
│ .blackjack - Blackjack | .chess - Xadrez

┌─ 👮 ADMIN
│ .add - Adicionar | .kick - Expulsar | .ban - Banir
│ .promote - Promover | .demote - Rebaixar | .warn - Advertir
│ .mute - Silenciar | .tagall - Marcar todos

┌─ 👑 DONO
│ .mode - Modo | .broadcast - Difundir | .spam - Spam
│ .addowner - Adicionar dono | .resetbalances - Resetar

╔═══════════════════════════╗
║  Prefixo: ${config.prefix}  |  Dono: ${config.ownerName}  ║
╚═══════════════════════════╝

📱 Dono: ${config.ownerName} (+${config.ownerNumber})`
    },
    
    ar: {
        promo: '🤖 تحتاج بوت؟\n\n💬 راسل:\nwa.me/393313444410\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n',
        title: `╔═══════════════════════════╗\n║   🤖 ${config.botName} - القائمة   ║\n╚═══════════════════════════╝`,
        content: `
┌─ 🌐 عام
│ .ping - التأخير | .alive - الحالة | .ai - اسأل AI
│ .menu - القائمة | .admin - أوامر المشرف | .info - معلومات
│ .latest - آخر تحديث | .updates - التحديثات
│ .stats - الإحصائيات | .jid - الحصول على JID
│ .sticker - إنشاء ملصق | .delete - حذف | .vv - عرض view-once
│ .setlang - تغيير اللغة | .guide - الدليل | .games - قائمة الألعاب

┌─ 💰 الاقتصاد
│ .bank - الرصيد | .daily - عملات يومية (200-50K)
│ .pay - إرسال عملات | .invite - الإحالات
│ .leaderboard - المتصدرين | .shop - المتجر

┌─ 🎮 الألعاب
│ .games - القائمة | .8ball - كرة 8 | .dice - نرد
│ .coinflip - عملة | .rps - حجر ورقة مقص
│ .slot - سلوت | .roulette - روليت | .rob - سرقة
│ .blackjack - بلاك جاك | .chess - شطرنج

┌─ 👮 المشرف
│ .add - إضافة | .kick - طرد | .ban - حظر
│ .promote - ترقية | .demote - تخفيض | .warn - تحذير
│ .mute - كتم | .tagall - وسم الكل

┌─ 👑 المالك
│ .mode - الوضع | .broadcast - بث | .spam - سبام
│ .addowner - إضافة مالك | .resetbalances - إعادة تعيين

╔═══════════════════════════╗
║  البادئة: ${config.prefix}  |  المالك: ${config.ownerName}  ║
╚═══════════════════════════╝

📱 المالك: ${config.ownerName} (+${config.ownerNumber})`
    },
    
    hi: {
        promo: '🤖 बॉट चाहिए?\n\n💬 संपर्क करें:\nwa.me/393313444410\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n',
        title: `╔═══════════════════════════╗\n║   🤖 ${config.botName} - मेनू   ║\n╚═══════════════════════════╝`,
        content: `
┌─ 🌐 सामान्य
│ .ping - विलंबता | .alive - स्थिति | .ai - AI से पूछें
│ .menu - मेनू | .admin - एडमिन कमांड | .info - जानकारी
│ .latest - नवीनतम अपडेट | .updates - अपडेट
│ .stats - आंकड़े | .jid - JID प्राप्त करें
│ .sticker - स्टिकर बनाएं | .delete - हटाएं | .vv - view-once देखें
│ .setlang - भाषा बदलें | .guide - गाइड | .games - गेम सूची

┌─ 💰 अर्थव्यवस्था
│ .bank - बैलेंस | .daily - दैनिक सिक्के (200-50K)
│ .pay - सिक्के भेजें | .invite - रेफरल
│ .leaderboard - शीर्ष खिलाड़ी | .shop - दुकान

┌─ 🎮 गेम्स
│ .games - सूची | .8ball - जादुई गेंद | .dice - पासा
│ .coinflip - सिक्का | .rps - पत्थर कागज कैंची
│ .slot - स्लॉट मशीन | .roulette - रूलेट | .rob - लूटना
│ .blackjack - ब्लैकजैक | .chess - शतरंज

┌─ 👮 एडमिन
│ .add - जोड़ें | .kick - निकालें | .ban - प्रतिबंधित
│ .promote - पदोन्नति | .demote - पदावनति | .warn - चेतावनी
│ .mute - म्यूट | .tagall - सभी को टैग

┌─ 👑 मालिक
│ .mode - मोड | .broadcast - प्रसारण | .spam - स्पैम
│ .addowner - मालिक जोड़ें | .resetbalances - रीसेट

╔═══════════════════════════╗
║  उपसर्ग: ${config.prefix}  |  मालिक: ${config.ownerName}  ║
╚═══════════════════════════╝

📱 मालिक: ${config.ownerName} (+${config.ownerNumber})`
    }
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
