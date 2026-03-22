import { getUser, updateUser } from '../database/databaseV2.js';
import { getGroupLanguage } from '../config/language.js';
import * as logger from '../monitoring/logger.js';

// Onboarding state tracking
const onboardingStates = new Map();

// Onboarding steps
const onboardingSteps = {
    en: [
        {
            step: 1,
            message: '👋 Welcome to eli6s bot!\n\nI\'m here to help you with games, economy, and group management.\n\nLet me show you around...',
            delay: 2000
        },
        {
            step: 2,
            message: '💰 ECONOMY SYSTEM\n\nYou start with 100 coins!\n\nType .daily to claim free coins every day\nType .bank to check your balance\nType .pay @user <amount> to send coins',
            delay: 3000
        },
        {
            step: 3,
            message: '🎮 GAMES\n\nTry these popular games:\n\n🃏 .blackjack <bet> - Play blackjack\n🎰 .slot <bet> - Spin the slots\n🎲 .dice <bet> - Roll the dice\n♟️ .chess @opponent - Play chess\n\nType .games for full list!',
            delay: 3000
        },
        {
            step: 4,
            message: '🛍️ SHOP\n\nSpend your coins in the shop!\n\nType .shop to see available items\nType .inventory to see what you own',
            delay: 2500
        },
        {
            step: 5,
            message: '📚 HELP & COMMANDS\n\nType .menu to see all commands\nType .help <command> for specific help\n\nFor group admins:\nType .admin to see admin commands',
            delay: 2500
        },
        {
            step: 6,
            message: '✅ You\'re all set!\n\nStart by claiming your daily coins: .daily\n\nHave fun! 🎉',
            delay: 0
        }
    ],
    it: [
        {
            step: 1,
            message: '👋 Benvenuto su eli6s bot!\n\nSono qui per aiutarti con giochi, economia e gestione gruppi.\n\nLascia che ti mostri come funziona...',
            delay: 2000
        },
        {
            step: 2,
            message: '💰 SISTEMA ECONOMICO\n\nInizi con 100 monete!\n\nScrivi .daily per ricevere monete gratis ogni giorno\nScrivi .bank per controllare il saldo\nScrivi .pay @utente <importo> per inviare monete',
            delay: 3000
        },
        {
            step: 3,
            message: '🎮 GIOCHI\n\nProva questi giochi popolari:\n\n🃏 .blackjack <puntata> - Gioca a blackjack\n🎰 .slot <puntata> - Gira le slot\n🎲 .dice <puntata> - Lancia i dadi\n♟️ .chess @avversario - Gioca a scacchi\n\nScrivi .games per la lista completa!',
            delay: 3000
        },
        {
            step: 4,
            message: '🛍️ NEGOZIO\n\nSpendi le tue monete nel negozio!\n\nScrivi .shop per vedere gli articoli disponibili\nScrivi .inventory per vedere cosa possiedi',
            delay: 2500
        },
        {
            step: 5,
            message: '📚 AIUTO & COMANDI\n\nScrivi .menu per vedere tutti i comandi\nScrivi .help <comando> per aiuto specifico\n\nPer admin del gruppo:\nScrivi .admin per vedere i comandi admin',
            delay: 2500
        },
        {
            step: 6,
            message: '✅ Sei pronto!\n\nInizia richiedendo le tue monete giornaliere: .daily\n\nBuon divertimento! 🎉',
            delay: 0
        }
    ],
    ru: [
        {
            step: 1,
            message: '👋 Добро пожаловать в eli6s bot!\n\nЯ здесь, чтобы помочь вам с играми, экономикой и управлением группами.\n\nПозвольте мне показать вам...',
            delay: 2000
        },
        {
            step: 2,
            message: '💰 ЭКОНОМИЧЕСКАЯ СИСТЕМА\n\nВы начинаете со 100 монет!\n\nНапишите .daily чтобы получать бесплатные монеты каждый день\nНапишите .bank чтобы проверить баланс\nНапишите .pay @пользователь <сумма> чтобы отправить монеты',
            delay: 3000
        },
        {
            step: 3,
            message: '🎮 ИГРЫ\n\nПопробуйте эти популярные игры:\n\n🃏 .blackjack <ставка> - Играть в блэкджек\n🎰 .slot <ставка> - Крутить слоты\n🎲 .dice <ставка> - Бросить кости\n♟️ .chess @противник - Играть в шахматы\n\nНапишите .games для полного списка!',
            delay: 3000
        },
        {
            step: 4,
            message: '🛍️ МАГАЗИН\n\nТратьте монеты в магазине!\n\nНапишите .shop чтобы увидеть доступные предметы\nНапишите .inventory чтобы увидеть что у вас есть',
            delay: 2500
        },
        {
            step: 5,
            message: '📚 ПОМОЩЬ И КОМАНДЫ\n\nНапишите .menu чтобы увидеть все команды\nНапишите .help <команда> для конкретной помощи\n\nДля админов группы:\nНапишите .admin чтобы увидеть команды админа',
            delay: 2500
        },
        {
            step: 6,
            message: '✅ Вы готовы!\n\nНачните с получения ежедневных монет: .daily\n\nУдачи! 🎉',
            delay: 0
        }
    ],
    es: [
        {
            step: 1,
            message: '👋 ¡Bienvenido a eli6s bot!\n\nEstoy aquí para ayudarte con juegos, economía y gestión de grupos.\n\nDéjame mostrarte cómo funciona...',
            delay: 2000
        },
        {
            step: 2,
            message: '💰 SISTEMA DE ECONOMÍA\n\n¡Empiezas con 100 monedas!\n\nEscribe .daily para reclamar monedas gratis cada día\nEscribe .bank para verificar tu saldo\nEscribe .pay @usuario <cantidad> para enviar monedas',
            delay: 3000
        },
        {
            step: 3,
            message: '🎮 JUEGOS\n\nPrueba estos juegos populares:\n\n🃏 .blackjack <apuesta> - Jugar blackjack\n🎰 .slot <apuesta> - Girar las tragamonedas\n🎲 .dice <apuesta> - Lanzar los dados\n♟️ .chess @oponente - Jugar ajedrez\n\n¡Escribe .games para la lista completa!',
            delay: 3000
        },
        {
            step: 4,
            message: '🛍️ TIENDA\n\n¡Gasta tus monedas en la tienda!\n\nEscribe .shop para ver artículos disponibles\nEscribe .inventory para ver lo que tienes',
            delay: 2500
        },
        {
            step: 5,
            message: '📚 AYUDA Y COMANDOS\n\nEscribe .menu para ver todos los comandos\nEscribe .help <comando> para ayuda específica\n\nPara admins del grupo:\nEscribe .admin para ver comandos de admin',
            delay: 2500
        },
        {
            step: 6,
            message: '✅ ¡Estás listo!\n\nComienza reclamando tus monedas diarias: .daily\n\n¡Diviértete! 🎉',
            delay: 0
        }
    ],
    pt: [
        {
            step: 1,
            message: '👋 Bem-vindo ao eli6s bot!\n\nEstou aqui para ajudá-lo com jogos, economia e gerenciamento de grupos.\n\nDeixe-me mostrar como funciona...',
            delay: 2000
        },
        {
            step: 2,
            message: '💰 SISTEMA DE ECONOMIA\n\nVocê começa com 100 moedas!\n\nDigite .daily para reivindicar moedas grátis todos os dias\nDigite .bank para verificar seu saldo\nDigite .pay @usuário <quantidade> para enviar moedas',
            delay: 3000
        },
        {
            step: 3,
            message: '🎮 JOGOS\n\nExperimente estes jogos populares:\n\n🃏 .blackjack <aposta> - Jogar blackjack\n🎰 .slot <aposta> - Girar os slots\n🎲 .dice <aposta> - Rolar os dados\n♟️ .chess @oponente - Jogar xadrez\n\nDigite .games para a lista completa!',
            delay: 3000
        },
        {
            step: 4,
            message: '🛍️ LOJA\n\nGaste suas moedas na loja!\n\nDigite .shop para ver itens disponíveis\nDigite .inventory para ver o que você possui',
            delay: 2500
        },
        {
            step: 5,
            message: '📚 AJUDA E COMANDOS\n\nDigite .menu para ver todos os comandos\nDigite .help <comando> para ajuda específica\n\nPara admins do grupo:\nDigite .admin para ver comandos de admin',
            delay: 2500
        },
        {
            step: 6,
            message: '✅ Você está pronto!\n\nComece reivindicando suas moedas diárias: .daily\n\nDivirta-se! 🎉',
            delay: 0
        }
    ],
    ar: [
        {
            step: 1,
            message: '👋 مرحبا بك في eli6s bot!\n\nأنا هنا لمساعدتك في الألعاب والاقتصاد وإدارة المجموعات.\n\nدعني أريك كيف يعمل...',
            delay: 2000
        },
        {
            step: 2,
            message: '💰 نظام الاقتصاد\n\nتبدأ بـ 100 عملة!\n\nاكتب .daily للحصول على عملات مجانية كل يوم\nاكتب .bank للتحقق من رصيدك\nاكتب .pay @مستخدم <المبلغ> لإرسال العملات',
            delay: 3000
        },
        {
            step: 3,
            message: '🎮 الألعاب\n\nجرب هذه الألعاب الشعبية:\n\n🃏 .blackjack <رهان> - العب بلاك جاك\n🎰 .slot <رهان> - قم بتدوير السلوتس\n🎲 .dice <رهان> - ارمي النرد\n♟️ .chess @خصم - العب شطرنج\n\naكتب .games للقائمة الكاملة!',
            delay: 3000
        },
        {
            step: 4,
            message: '🛍️ المتجر\n\nأنفق عملاتك في المتجر!\n\nاكتب .shop لرؤية العناصر المتاحة\nاكتب .inventory لرؤية ما تملكه',
            delay: 2500
        },
        {
            step: 5,
            message: '📚 المساعدة والأوامر\n\nاكتب .menu لرؤية جميع الأوامر\nاكتب .help <أمر> للمساعدة المحددة\n\nلمسؤولي المجموعة:\nاكتب .admin لرؤية أوامر المسؤول',
            delay: 2500
        },
        {
            step: 6,
            message: '✅ أنت جاهز!\n\nابدأ بالمطالبة بعملاتك اليومية: .daily\n\nاستمتع! 🎉',
            delay: 0
        }
    ],
    hi: [
        {
            step: 1,
            message: '👋 eli6s bot में आपका स्वागत है!\n\nमैं गेम्स, इकोनॉमी और ग्रुप मैनेजमेंट में आपकी मदद के लिए यहां हूं।\n\nमुझे आपको दिखाने दें...',
            delay: 2000
        },
        {
            step: 2,
            message: '💰 इकोनॉमी सिस्टम\n\nआप 100 कॉइन्स से शुरू करते हैं!\n\n.daily टाइप करें हर दिन मुफ्त कॉइन्स पाने के लिए\n.bank टाइप करें अपना बैलेंस चेक करने के लिए\n.pay @यूज़र <राशि> टाइप करें कॉइन्स भेजने के लिए',
            delay: 3000
        },
        {
            step: 3,
            message: '🎮 गेम्स\n\nये लोकप्रिय गेम्स आज़माएं:\n\n🃏 .blackjack <बेट> - ब्लैकजैक खेलें\n🎰 .slot <बेट> - स्लॉट्स स्पिन करें\n🎲 .dice <बेट> - डाइस रोल करें\n♟️ .chess @प्रतिद्वंद्वी - शतरंज खेलें\n\nपूरी लिस्ट के लिए .games टाइप करें!',
            delay: 3000
        },
        {
            step: 4,
            message: '🛍️ शॉप\n\nअपने कॉइन्स शॉप में खर्च करें!\n\n.shop टाइप करें उपलब्ध आइटम देखने के लिए\n.inventory टाइप करें अपनी चीज़ें देखने के लिए',
            delay: 2500
        },
        {
            step: 5,
            message: '📚 हेल्प और कमांड्स\n\n.menu टाइप करें सभी कमांड्स देखने के लिए\n.help <कमांड> टाइप करें विशिष्ट मदद के लिए\n\nग्रुप एडमिन के लिए:\n.admin टाइप करें एडमिन कमांड्स देखने के लिए',
            delay: 2500
        },
        {
            step: 6,
            message: '✅ आप तैयार हैं!\n\nअपने डेली कॉइन्स क्लेम करके शुरू करें: .daily\n\nमज़े करें! 🎉',
            delay: 0
        }
    ]
};

// Check if user needs onboarding
export function needsOnboarding(jid) {
    try {
        const user = getUser(jid);
        
        // New users or users who haven't completed onboarding
        if (!user || !user.onboarding_completed) {
            return true;
        }
        
        return false;
    } catch (error) {
        logger.error('Error checking onboarding status', { jid, error: error.message });
        return false;
    }
}

// Start onboarding process
export async function startOnboarding(sock, jid, language = 'en') {
    try {
        // Check if already onboarding
        if (onboardingStates.has(jid)) {
            logger.debug('Onboarding already in progress', { jid });
            return false;
        }
        
        // Get language-specific steps
        const steps = onboardingSteps[language] || onboardingSteps.en;
        
        // Initialize onboarding state
        onboardingStates.set(jid, {
            currentStep: 0,
            language,
            startTime: Date.now()
        });
        
        logger.info('Starting onboarding', { jid, language });
        
        // Send steps sequentially with delays
        for (const step of steps) {
            if (step.delay > 0) {
                await new Promise(resolve => setTimeout(resolve, step.delay));
            }
            
            // Check if onboarding was cancelled
            if (!onboardingStates.has(jid)) {
                logger.info('Onboarding cancelled', { jid });
                return false;
            }
            
            await sock.sendMessage(jid, { text: step.message });
            
            // Update current step
            const state = onboardingStates.get(jid);
            state.currentStep = step.step;
        }
        
        // Mark onboarding as completed
        updateUser(jid, { onboarding_completed: 1 });
        onboardingStates.delete(jid);
        
        logger.info('Onboarding completed', {
            jid,
            duration: Date.now() - onboardingStates.get(jid)?.startTime || 0
        });
        
        return true;
    } catch (error) {
        logger.error('Error during onboarding', { jid, error: error.message });
        onboardingStates.delete(jid);
        return false;
    }
}

// Cancel onboarding
export function cancelOnboarding(jid) {
    if (onboardingStates.has(jid)) {
        onboardingStates.delete(jid);
        logger.info('Onboarding cancelled', { jid });
        return true;
    }
    return false;
}

// Skip onboarding
export function skipOnboarding(jid) {
    try {
        updateUser(jid, { onboarding_completed: 1 });
        onboardingStates.delete(jid);
        logger.info('Onboarding skipped', { jid });
        return true;
    } catch (error) {
        logger.error('Error skipping onboarding', { jid, error: error.message });
        return false;
    }
}

// Get onboarding status
export function getOnboardingStatus(jid) {
    const state = onboardingStates.get(jid);
    if (state) {
        return {
            inProgress: true,
            currentStep: state.currentStep,
            language: state.language,
            startTime: state.startTime
        };
    }
    
    const user = getUser(jid);
    return {
        inProgress: false,
        completed: user?.onboarding_completed === 1,
        currentStep: 0
    };
}

logger.info('Onboarding system initialized', {
    languages: Object.keys(onboardingSteps),
    stepsPerLanguage: onboardingSteps.en.length
});

export default {
    needsOnboarding,
    startOnboarding,
    cancelOnboarding,
    skipOnboarding,
    getOnboardingStatus
};
