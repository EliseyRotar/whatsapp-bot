import { getGroupLanguage } from '../../utils/language.js';
import { getBalance, addCoins } from '../../utils/bank_SAFE.js';
import { activeGames } from '../../utils/blackjackGames.js';
import { recordSurrender } from '../../utils/blackjackStats.js';

const responses = {
    en: {
        title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━',
        player: '👤 Player:',
        noGame: '❌ No active game!',
        cantSurrender: '❌ Cannot surrender!\n\n• Can only surrender on first turn\n• Cannot surrender after hitting or other actions',
        surrendered: '🏳️ SURRENDERED',
        returned: '💰 Returned:',
        balance: '💵 Balance:'
    },
    it: {
        title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━',
        player: '👤 Giocatore:',
        noGame: '❌ Nessun gioco attivo!',
        cantSurrender: '❌ Impossibile arrendersi!\n\n• Puoi arrenderti solo al primo turno\n• Non puoi arrenderti dopo aver pescato o altre azioni',
        surrendered: '🏳️ ARRESO',
        returned: '💰 Restituito:',
        balance: '💵 Saldo:'
    },
    ru: {
        title: '━━━━━ 🎰 БЛЭКДЖЕК 🎰 ━━━━━',
        player: '👤 Игрок:',
        noGame: '❌ Нет активной игры!',
        cantSurrender: '❌ Невозможно сдаться!\n\n• Можно сдаться только на первом ходу\n• Нельзя сдаться после взятия карты или других действий',
        surrendered: '🏳️ СДАЛИСЬ',
        returned: '💰 Возвращено:',
        balance: '💵 Баланс:'
    },
    es: {
        title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━',
        player: '👤 Jugador:',
        noGame: '❌ ¡No hay juego activo!',
        cantSurrender: '❌ ¡No puedes rendirte!\n\n• Solo puedes rendirte en el primer turno\n• No puedes rendirte después de pedir carta u otras acciones',
        surrendered: '🏳️ RENDIDO',
        returned: '💰 Devuelto:',
        balance: '💵 Saldo:'
    },
    pt: {
        title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━',
        player: '👤 Jogador:',
        noGame: '❌ Nenhum jogo ativo!',
        cantSurrender: '❌ Não pode desistir!\n\n• Só pode desistir no primeiro turno\n• Não pode desistir após pedir carta ou outras ações',
        surrendered: '🏳️ DESISTIU',
        returned: '💰 Devolvido:',
        balance: '💵 Saldo:'
    },
    ar: {
        title: '━━━━━ 🎰 بلاك جاك 🎰 ━━━━━',
        player: '👤 اللاعب:',
        noGame: '❌ مفيش لعبة نشطة!',
        cantSurrender: '❌ متقدرش تستسلم!\n\n• تقدر تستسلم في الدور الأول بس\n• متقدرش تستسلم بعد ما تسحب ورقة أو إجراءات تانية',
        surrendered: '🏳️ استسلم',
        returned: '💰 اترجع:',
        balance: '💵 الرصيد:'
    },
    hi: {
        title: '━━━━━ 🎰 ब्लैकजैक 🎰 ━━━━━',
        player: '👤 खिलाड़ी:',
        noGame: '❌ कोई एक्टिव गेम नहीं!',
        cantSurrender: '❌ सरेंडर नहीं कर सकते!\n\n• केवल पहली बारी में सरेंडर कर सकते हैं\n• हिट या अन्य एक्शन के बाद सरेंडर नहीं कर सकते',
        surrendered: '🏳️ सरेंडर किया',
        returned: '💰 वापस मिला:',
        balance: '💵 बैलेंस:'
    },
    ng: {
        title: '━━━━━ 🎰 BLACKJACK 🎰 ━━━━━',
        player: '👤 Player:',
        noGame: '❌ No active game!',
        cantSurrender: '❌ You no fit surrender!\n\n• You fit only surrender for first turn\n• You no fit surrender after you hit or do other actions',
        surrendered: '🏳️ SURRENDERED',
        returned: '💰 You get back:',
        balance: '💵 Balance:'
    }
};

export default {
    name: 'surrender',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const game = activeGames.get(sender);
        
        if (!game) {
            const lang = getGroupLanguage(from);
            const t = responses[lang] || responses.en;
            return await sock.sendMessage(from, { text: t.noGame });
        }
        
        const lang = game.lang || 'en';
        const t = responses[lang] || responses.en;
        const coins = lang === 'it' ? 'monete' : lang === 'ru' ? 'монет' : lang === 'es' ? 'monedas' : lang === 'pt' ? 'moedas' : 'coins';
        
        // Check if can surrender (only on first turn, before any actions)
        if (game.turnCount > 0 || game.splitHands) {
            return await sock.sendMessage(from, { text: t.cantSurrender });
        }
        
        // Return half the bet
        const returnAmount = Math.floor(game.bet / 2);
        const lostAmount = game.bet - returnAmount;
        await addCoins(sender, returnAmount);
        recordSurrender(sender, lostAmount);
        
        let gameText = `${t.title}\n${t.player} ${game.pushName}\n\n`;
        gameText += `━━━━━━━━━━━━━━━━━━━━━\n${t.surrendered}\n${t.returned} +${returnAmount} ${coins}\n━━━━━━━━━━━━━━━━━━━━━\n\n`;
        gameText += `${t.balance} ${await getBalance(sender)} ${coins}`;
        
        await sock.sendMessage(from, { text: gameText });
        activeGames.delete(sender);
    }
};
