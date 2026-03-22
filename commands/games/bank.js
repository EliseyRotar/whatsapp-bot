import { getGroupLanguage } from '../../utils/language.js';
import { getBalance, formatBalance } from '../../utils/bank_SAFE.js';
import { getUserBadge, getCoinMultiplier, getLuckBoost, getActiveItems } from '../../utils/shopSystem.js';

const responses = {
    en: {
        balance: '💰 Your Balance',
        player: '👤 Player:',
        coins: 'coins',
        info: '\n\nUse coins to play games:\n• .slot <bet> - Slot machine (match 3 symbols)\n• .dice <bet> - Dice game (doubles or 7/11 wins)\n• .coin <bet> <heads/tails> - Coin flip (guess correctly)\n• .blackjack <bet> - Play blackjack against the dealer\n• .chess @user - Challenge someone to chess\n\n🎮 Type .games to see all available games!\n🏪 Purchase items with .shop to boost your gameplay!'
    },
    it: {
        balance: '💰 Il Tuo Saldo',
        player: '👤 Giocatore:',
        coins: 'monete',
        info: '\n\nUsa le monete per giocare:\n• .slot <puntata> - Slot machine (abbina 3 simboli)\n• .dice <puntata> - Gioco dadi (doppi o 7/11 vince)\n• .coin <puntata> <heads/tails> - Testa o croce (indovina)\n• .blackjack <puntata> - Gioca a blackjack contro il banco\n• .chess @utente - Sfida qualcuno a scacchi\n\n🎮 Scrivi .games per vedere tutti i giochi disponibili!\n🏪 Acquista oggetti con .shop per potenziare il tuo gioco!'
    },
    ru: {
        balance: '💰 Ваш баланс',
        player: '👤 Игрок:',
        coins: 'монет',
        info: '\n\nИспользуйте монеты для игр:\n• .slot <ставка> - Игровой автомат (совпадение 3 символов)\n• .dice <ставка> - Игра в кости (дубли или 7/11 выигрывают)\n• .coin <ставка> <heads/tails> - Подбрасывание монеты (угадайте)\n• .blackjack <ставка> - Играйте в блэкджек против дилера\n• .chess @пользователь - Вызовите кого-нибудь на шахматы\n\n🎮 Введите .games, чтобы увидеть все доступные игры!\n🏪 Покупайте предметы с помощью .shop для улучшения игры!'
    },
    es: {
        balance: '💰 Tu Saldo',
        player: '👤 Jugador:',
        coins: 'monedas',
        info: '\n\nUsa monedas para jugar:\n• .slot <apuesta> - Máquina tragamonedas (coincide 3 símbolos)\n• .dice <apuesta> - Juego de dados (dobles o 7/11 gana)\n• .coin <apuesta> <heads/tails> - Lanzar moneda (adivina correctamente)\n• .blackjack <apuesta> - Juega blackjack contra el crupier\n• .chess @usuario - Desafía a alguien al ajedrez\n\n🎮 ¡Escribe .games para ver todos los juegos disponibles!\n🏪 ¡Compra artículos con .shop para mejorar tu juego!'
    },
    pt: {
        balance: '💰 Seu Saldo',
        player: '👤 Jogador:',
        coins: 'moedas',
        info: '\n\nUse moedas para jogar:\n• .slot <aposta> - Caça-níqueis (combine 3 símbolos)\n• .dice <aposta> - Jogo de dados (duplas ou 7/11 ganha)\n• .coin <aposta> <heads/tails> - Cara ou coroa (adivinhe corretamente)\n• .blackjack <aposta> - Jogue blackjack contra o dealer\n• .chess @usuário - Desafie alguém para xadrez\n\n🎮 Digite .games para ver todos os jogos disponíveis!\n🏪 Compre itens com .shop para melhorar seu jogo!'
    },
    ar: {
        balance: '💰 رصيدك',
        player: '👤 اللاعب:',
        coins: 'عملات',
        info: '\n\nاستخدم العملات للعب:\n• .slot <رهان> - ماكينة السلوت (طابق 3 رموز)\n• .dice <رهان> - لعبة النرد (أزواج أو 7/11 يفوز)\n• .coin <رهان> <heads/tails> - رمي العملة (خمن صح)\n• .blackjack <رهان> - العب بلاك جاك ضد الموزع\n• .chess @مستخدم - تحدى حد في الشطرنج\n\n🎮 اكتب .games عشان تشوف كل الألعاب المتاحة!\n🏪 اشتري أغراض بـ .shop عشان تحسن لعبك!'
    },
    hi: {
        balance: '💰 आपका बैलेंस',
        player: '👤 खिलाड़ी:',
        coins: 'कॉइन',
        info: '\n\nगेम खेलने के लिए कॉइन का उपयोग करें:\n• .slot <बेट> - स्लॉट मशीन (3 सिंबल मैच करें)\n• .dice <बेट> - डाइस गेम (डबल या 7/11 जीतता है)\n• .coin <बेट> <heads/tails> - कॉइन फ्लिप (सही अनुमान लगाएं)\n• .blackjack <बेट> - डीलर के खिलाफ ब्लैकजैक खेलें\n• .chess @उपयोगकर्ता - किसी को शतरंज के लिए चुनौती दें\n\n🎮 सभी उपलब्ध गेम देखने के लिए .games टाइप करें!\n🏪 अपने गेमप्ले को बूस्ट करने के लिए .shop से आइटम खरीदें!'
    },
    ng: {
        balance: '💰 Your Balance',
        player: '👤 Player:',
        coins: 'coins',
        info: '\n\nUse coins to play games:\n• .slot <bet> - Slot machine (match 3 symbols)\n• .dice <bet> - Dice game (doubles or 7/11 win)\n• .coin <bet> <heads/tails> - Coin flip (guess correct)\n• .blackjack <bet> - Play blackjack against dealer\n• .chess @person - Challenge person to chess\n\n🎮 Type .games to see all games wey dey available!\n🏪 Buy tings with .shop to boost your gameplay!'
    }
};

export default {
    name: 'bank',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const senderId = sender.split('@')[0];
        const pushName = msg.pushName || 'Player';
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        const balance = await getBalance(sender);
        const badge = getUserBadge(senderId);
        const multiplier = getCoinMultiplier(senderId);
        const luckBoost = getLuckBoost(senderId);
        const activeItems = getActiveItems(senderId);
        
        let bankText = `${t.balance}\n${t.player} ${badge} ${pushName}\n\n💵 ${formatBalance(balance)} ${t.coins}`;
        
        // Show active bonuses
        if (multiplier > 1 || luckBoost > 0 || activeItems.length > 0) {
            bankText += '\n\n✨ Active Bonuses:';
            if (multiplier > 1) bankText += `\n💰 ${multiplier}x Coin Multiplier`;
            if (luckBoost > 0) bankText += `\n🍀 +${luckBoost}% Luck Boost`;
            if (activeItems.includes('anti_rob')) bankText += '\n🛡️ Anti-Rob Protection';
            if (activeItems.includes('insurance')) bankText += '\n🏦 Loss Insurance';
        }
        
        bankText += t.info;
        
        await sock.sendMessage(from, { 
            text: bankText
        });
    }
};
