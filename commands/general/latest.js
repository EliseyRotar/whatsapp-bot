import { config } from '../../config.js';
import { getGroupLanguage } from '../../utils/language.js';
import { sendAsChannelForward } from '../../utils/fakeForward.js';

const responses = {
    en: {
        title: '╔═══════════════════════════╗\n║   🆕 LATEST UPDATE   ║\n╚═══════════════════════════╝',
        version: '📌 Version:',
        date: '📅 Date:',
        changes: '✨ What\'s New:',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n💡 Type .updates to see all updates!'
    },
    it: {
        title: '╔═══════════════════════════╗\n║   🆕 ULTIMO AGGIORNAMENTO   ║\n╚═══════════════════════════╝',
        version: '📌 Versione:',
        date: '📅 Data:',
        changes: '✨ Novità:',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n💡 Digita .updates per vedere tutti gli aggiornamenti!'
    },
    ru: {
        title: '╔═══════════════════════════╗\n║   🆕 ПОСЛЕДНЕЕ ОБНОВЛЕНИЕ   ║\n╚═══════════════════════════╝',
        version: '📌 Версия:',
        date: '📅 Дата:',
        changes: '✨ Что нового:',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n💡 Введите .updates чтобы увидеть все обновления!'
    },
    es: {
        title: '╔═══════════════════════════╗\n║   🆕 ÚLTIMA ACTUALIZACIÓN   ║\n╚═══════════════════════════╝',
        version: '📌 Versión:',
        date: '📅 Fecha:',
        changes: '✨ Novedades:',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n💡 ¡Escribe .updates para ver todas las actualizaciones!'
    },
    pt: {
        title: '╔═══════════════════════════╗\n║   🆕 ÚLTIMA ATUALIZAÇÃO   ║\n╚═══════════════════════════╝',
        version: '📌 Versão:',
        date: '📅 Data:',
        changes: '✨ Novidades:',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n💡 Digite .updates para ver todas as atualizações!'
    },
    ar: {
        title: '╔═══════════════════════════╗\n║   🆕 آخر تحديث   ║\n╚═══════════════════════════╝',
        version: '📌 الإصدار:',
        date: '📅 التاريخ:',
        changes: '✨ الجديد:',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n💡 اكتب .updates عشان تشوف كل التحديثات!'
    },
    hi: {
        title: '╔═══════════════════════════╗\n║   🆕 नवीनतम अपडेट   ║\n╚═══════════════════════════╝',
        version: '📌 वर्जन:',
        date: '📅 तारीख:',
        changes: '✨ नया क्या है:',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n💡 सभी अपडेट देखने के लिए .updates टाइप करें!'
    },
    ng: {
        title: '╔═══════════════════════════╗\n║   🆕 LATEST UPDATE   ║\n╚═══════════════════════════╝',
        version: '📌 Version:',
        date: '📅 Date:',
        changes: '✨ Wetin New:',
        footer: '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n💡 Type .updates make you see all updates!'
    }
};

// Latest update only
const latestUpdate = {
    en: {
        version: 'v4.8.0',
        date: 'March 19, 2026',
        changes: [
            '🎰 SLOT MACHINE — COMPLETE OVERHAUL',
            '',
            '🎨 3-Row Reel Display:',
            '• Visual upgrade: top/middle/bottom rows shown',
            '• Middle row is the payline',
            '• Looks like a real slot machine now',
            '',
            '� Progressive Jackpot:',
            '• Shared pool across all users',
            '• 2% of every loss contributes to jackpot',
            '• 💎💎💎 wins the entire pool + 100x bet',
            '• Minimum seed: 50,000 coins',
            '',
            '🔔 Free Spins Bonus:',
            '• 🔔🔔🔔 triggers 5 free spins',
            '• Auto-played with summary shown',
            '• All winnings added to total',
            '',
            '� Shop Boosts Now Work:',
            '• Luck boost increases high-value symbol chances',
            '• Coin multipliers (2x, 3x, 5x) apply to all winnings',
            '• Lucky charm, mega luck, ultra luck all functional',
            '',
            '📊 New: .slotstats Command:',
            '• View your total spins, wins, losses',
            '• Track biggest win & multiplier',
            '• See jackpots won & free spins triggered',
            '• Monitor win rate & net profit',
            '',
            '⚖️ Balance Improvements:',
            '• "All in" bets your entire balance (no cap)',
            '• Improved RTP to 96.5% (fairer payouts)',
            '',
            '🌍 All features in 8 languages'
        ]
    },
    it: {
        version: 'v4.8.0',
        date: '19 Marzo 2026',
        changes: [
            '🎰 SLOT MACHINE — REVISIONE COMPLETA',
            '',
            '🎨 Display a 3 Righe:',
            '• Aggiornamento visivo: righe superiore/centrale/inferiore mostrate',
            '• La riga centrale è la linea di pagamento',
            '• Ora sembra una vera slot machine',
            '',
            '� Jackpot Progressivo:',
            '• Pool condiviso tra tutti gli utenti',
            '• Il 2% di ogni perdita contribuisce al jackpot',
            '• 💎💎💎 vince l\'intero pool + 100x puntata',
            '• Seed minimo: 50.000 monete',
            '',
            '🔔 Bonus Giri Gratis:',
            '• 🔔🔔🔔 attiva 5 giri gratis',
            '• Giocati automaticamente con riepilogo mostrato',
            '• Tutte le vincite aggiunte al totale',
            '',
            '� I Boost del Negozio Ora Funzionano:',
            '• Il boost fortuna aumenta le probabilità dei simboli di alto valore',
            '• I moltiplicatori monete (2x, 3x, 5x) si applicano a tutte le vincite',
            '• Portafortuna, mega fortuna, ultra fortuna tutti funzionali',
            '',
            '📊 Nuovo: Comando .slotstats:',
            '• Visualizza i tuoi giri totali, vittorie, sconfitte',
            '• Traccia la vincita più grande e il moltiplicatore',
            '• Vedi i jackpot vinti e i giri gratis attivati',
            '• Monitora il tasso di vittoria e il profitto netto',
            '',
            '⚖️ Miglioramenti Bilanciamento:',
            '• "All in" punta tutto il saldo (nessun limite)',
            '• RTP migliorato al 96,5% (pagamenti più equi)',
            '',
            '🌍 Tutte le funzioni in 8 lingue'
        ]
    },
    ru: {
        version: 'v4.8.0',
        date: '19 Марта 2026',
        changes: [
            '🎰 СЛОТ-МАШИНА — ПОЛНАЯ ПЕРЕРАБОТКА',
            '',
            '🎨 Дисплей с 3 Рядами:',
            '• Визуальное обновление: показаны верхний/средний/нижний ряды',
            '• Средний ряд — линия выплат',
            '• Теперь выглядит как настоящий слот-автомат',
            '',
            '� Прогрессивный Джекпот:',
            '• Общий пул для всех пользователей',
            '• 2% от каждого проигрыша идёт в джекпот',
            '• 💎💎💎 выигрывает весь пул + 100x ставку',
            '• Минимальный seed: 50.000 монет',
            '',
            '🔔 Бонус Бесплатных Вращений:',
            '• 🔔🔔🔔 активирует 5 бесплатных вращений',
            '• Автоматически разыгрываются с показом итогов',
            '• Все выигрыши добавляются к общей сумме',
            '',
            '� Бусты Магазина Теперь Работают:',
            '• Буст удачи увеличивает шансы дорогих символов',
            '• Множители монет (2x, 3x, 5x) применяются ко всем выигрышам',
            '• Талисман удачи, мега удача, ультра удача — все работают',
            '',
            '📊 Новое: Команда .slotstats:',
            '• Просмотр общих вращений, побед, поражений',
            '• Отслеживание самого большого выигрыша и множителя',
            '• Просмотр выигранных джекпотов и активированных бесплатных вращений',
            '• Мониторинг процента побед и чистой прибыли',
            '',
            '⚖️ Улучшения Баланса:',
            '• "All in" ставит весь баланс (без ограничений)',
            '• Улучшен RTP до 96,5% (более справедливые выплаты)',
            '',
            '🌍 Все функции на 8 языках'
        ]
    },
    es: {
        version: 'v4.8.0',
        date: '19 de Marzo 2026',
        changes: [
            '🎰 MÁQUINA TRAGAMONEDAS — RENOVACIÓN COMPLETA',
            '',
            '� Pantalla de 3 Filas:',
            '• Mejora visual: filas superior/media/inferior mostradas',
            '• La fila media es la línea de pago',
            '• Ahora parece una tragamonedas real',
            '',
            '� Jackpot Progresivo:',
            '• Pozo compartido entre todos los usuarios',
            '• El 2% de cada pérdida contribuye al jackpot',
            '• 💎💎💎 gana todo el pozo + 100x apuesta',
            '• Semilla mínima: 50.000 monedas',
            '',
            '🔔 Bonus de Giros Gratis:',
            '• 🔔🔔🔔 activa 5 giros gratis',
            '• Se juegan automáticamente con resumen mostrado',
            '• Todas las ganancias se suman al total',
            '',
            '🛒 Los Impulsos de Tienda Ahora Funcionan:',
            '• El impulso de suerte aumenta las probabilidades de símbolos de alto valor',
            '• Los multiplicadores de monedas (2x, 3x, 5x) se aplican a todas las ganancias',
            '• Amuleto de suerte, mega suerte, ultra suerte todos funcionales',
            '',
            '📊 Nuevo: Comando .slotstats:',
            '• Ver tus giros totales, victorias, derrotas',
            '• Rastrear mayor ganancia y multiplicador',
            '• Ver jackpots ganados y giros gratis activados',
            '• Monitorear tasa de victoria y ganancia neta',
            '',
            '⚖️ Mejoras de Balance:',
            '• "All in" apuesta todo tu saldo (sin límite)',
            '• RTP mejorado al 96,5% (pagos más justos)',
            '',
            '🌍 Todas las funciones en 8 idiomas'
        ]
    },
    pt: {
        version: 'v4.8.0',
        date: '19 de Março 2026',
        changes: [
            '🎰 CAÇA-NÍQUEIS — RENOVAÇÃO COMPLETA',
            '',
            '🎨 Display de 3 Linhas:',
            '• Atualização visual: linhas superior/média/inferior mostradas',
            '• Linha média é a linha de pagamento',
            '• Agora parece um caça-níqueis real',
            '',
            '💎 Jackpot Progressivo:',
            '• Poço compartilhado entre todos os usuários',
            '• 2% de cada perda contribui para o jackpot',
            '• 💎💎💎 ganha todo o poço + 100x aposta',
            '• Seed mínimo: 50.000 moedas',
            '',
            '🔔 Bônus de Giros Grátis:',
            '• 🔔🔔🔔 ativa 5 giros grátis',
            '• Jogados automaticamente com resumo mostrado',
            '• Todos os ganhos adicionados ao total',
            '',
            '🛒 Impulsos da Loja Agora Funcionam:',
            '• Impulso de sorte aumenta chances de símbolos de alto valor',
            '• Multiplicadores de moedas (2x, 3x, 5x) aplicam-se a todos os ganhos',
            '• Amuleto da sorte, mega sorte, ultra sorte todos funcionais',
            '',
            '📊 Novo: Comando .slotstats:',
            '• Ver seus giros totais, vitórias, derrotas',
            '• Rastrear maior vitória e multiplicador',
            '• Ver jackpots ganhos e giros grátis ativados',
            '• Monitorar taxa de vitória e lucro líquido',
            '',
            '⚖️ Melhorias de Equilíbrio:',
            '• "All in" aposta todo o saldo (sem limite)',
            '• RTP melhorado para 96,5% (pagamentos mais justos)',
            '',
            '🌍 Todas as funcionalidades em 8 idiomas'
        ]
    },
    ar: {
        version: 'v4.8.0',
        date: '19 مارس 2026',
        changes: [
            '🎰 آلة السلوت — تجديد كامل',
            '',
            '🎨 عرض 3 صفوف:',
            '• ترقية بصرية: الصفوف العلوي/الأوسط/السفلي معروضة',
            '• الصف الأوسط هو خط الدفع',
            '• يبدو الآن مثل آلة سلوت حقيقية',
            '',
            '� جاكبوت تقدمي:',
            '• مجمع مشترك بين جميع المستخدمين',
            '• 2% من كل خسارة تساهم في الجاكبوت',
            '• 💎💎💎 يفوز بالمجمع بالكامل + 100x الرهان',
            '• الحد الأدنى للبذرة: 50.000 عملة',
            '',
            '🔔 مكافأة الدورات المجانية:',
            '• 🔔🔔🔔 تفعل 5 دورات مجانية',
            '• تُلعب تلقائياً مع عرض الملخص',
            '• جميع الأرباح تُضاف إلى الإجمالي',
            '',
            '� تعزيزات المتجر تعمل الآن:',
            '• تعزيز الحظ يزيد فرص الرموز عالية القيمة',
            '• مضاعفات العملات (2x, 3x, 5x) تُطبق على جميع الأرباح',
            '• تميمة الحظ، ميجا حظ، ألترا حظ كلها تعمل',
            '',
            '📊 جديد: أمر .slotstats:',
            '• عرض إجمالي دوراتك، الفوز، الخسارة',
            '• تتبع أكبر فوز ومضاعف',
            '• رؤية الجاكبوت المكتسب والدورات المجانية المفعلة',
            '• مراقبة معدل الفوز وصافي الربح',
            '',
            '⚖️ تحسينات التوازن:',
            '• "All in" يراهن بكامل رصيدك (بدون حد أقصى)',
            '• تحسين RTP إلى 96.5% (مدفوعات أكثر عدلاً)',
            '',
            '🌍 جميع الميزات بـ 8 لغات'
        ]
    },
    hi: {
        version: 'v4.8.0',
        date: '19 मार्च 2026',
        changes: [
            '🎰 स्लॉट मशीन — पूर्ण नवीनीकरण',
            '',
            '� 3-पंक्ति डिस्प्ले:',
            '• विज़ुअल अपग्रेड: ऊपर/मध्य/नीचे पंक्तियाँ दिखाई गईं',
            '• मध्य पंक्ति पेलाइन है',
            '• अब असली स्लॉट मशीन जैसा दिखता है',
            '',
            '� प्रगतिशील जैकपॉट:',
            '• सभी उपयोगकर्ताओं में साझा पूल',
            '• हर हार का 2% जैकपॉट में योगदान देता है',
            '• 💎💎💎 पूरा पूल + 100x बेट जीतता है',
            '• न्यूनतम सीड: 50,000 कॉइन',
            '',
            '🔔 मुफ्त स्पिन बोनस:',
            '• 🔔🔔🔔 5 मुफ्त स्पिन सक्रिय करता है',
            '• सारांश के साथ स्वचालित रूप से खेला जाता है',
            '• सभी जीत कुल में जोड़ी जाती हैं',
            '',
            '🛒 शॉप बूस्ट अब काम करते हैं:',
            '• लक बूस्ट उच्च-मूल्य प्रतीक संभावनाएं बढ़ाता है',
            '• कॉइन गुणक (2x, 3x, 5x) सभी जीत पर लागू होते हैं',
            '• लकी चार्म, मेगा लक, अल्ट्रा लक सभी कार्यात्मक',
            '',
            '📊 नया: .slotstats कमांड:',
            '• अपने कुल स्पिन, जीत, हार देखें',
            '• सबसे बड़ी जीत और गुणक ट्रैक करें',
            '• जीते गए जैकपॉट और सक्रिय मुफ्त स्पिन देखें',
            '• जीत दर और शुद्ध लाभ मॉनिटर करें',
            '',
            '⚖️ संतुलन सुधार:',
            '• "All in" पूरा बैलेंस दांव पर लगाता है (कोई सीमा नहीं)',
            '• RTP 96.5% तक सुधारा गया (निष्पक्ष भुगतान)',
            '',
            '🌍 8 भाषाओं में सभी सुविधाएं'
        ]
    },
    ng: {
        version: 'v4.8.0',
        date: 'March 19, 2026',
        changes: [
            '🎰 SLOT MACHINE — COMPLETE OVERHAUL',
            '',
            '🎨 3-Row Reel Display:',
            '• Visual upgrade: top/middle/bottom rows dey show',
            '• Middle row na the payline',
            '• E dey look like real slot machine now',
            '',
            '💎 Progressive Jackpot:',
            '• Shared pool for all users',
            '• 2% of every loss dey contribute to jackpot',
            '• 💎💎💎 go win the entire pool + 100x bet',
            '• Minimum seed: 50,000 coins',
            '',
            '🔔 Free Spins Bonus:',
            '• 🔔🔔🔔 go trigger 5 free spins',
            '• Auto-played with summary wey dey show',
            '• All winnings dey add to total',
            '',
            '🛒 Shop Boosts Now Dey Work:',
            '• Luck boost dey increase high-value symbol chances',
            '• Coin multipliers (2x, 3x, 5x) dey apply to all winnings',
            '• Lucky charm, mega luck, ultra luck all dey work',
            '',
            '📊 New: .slotstats Command:',
            '• See your total spins, wins, losses',
            '• Track biggest win & multiplier',
            '• See jackpots won & free spins triggered',
            '• Monitor win rate & net profit',
            '',
            '⚖️ Balance Improvements:',
            '• "All in" dey bet your entire balance (no cap)',
            '• Improved RTP to 96.5% (fairer payouts)',
            '',
            '🌍 All features for 8 languages'
        ]
    }
};
export default {
    name: 'latest',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        const update = latestUpdate[lang] || latestUpdate.en;
        
        let text = t.title;
        text += `\n\n${t.version} ${update.version}\n`;
        text += `${t.date} ${update.date}\n\n`;
        text += `${t.changes}\n\n`;
        
        update.changes.forEach(change => {
            text += `${change}\n`;
        });
        
        text += t.footer;
        
        await sendAsChannelForward(sock, from, text, {
            quoted: msg,
            newsletterName: config.botName || 'Latest Update'
        });
    }
};
