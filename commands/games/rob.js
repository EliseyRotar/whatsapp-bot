import { getGroupLanguage } from '../../utils/language.js';
import { getBalance, removeCoins, addCoins } from '../../utils/bank_SAFE.js';
import { hasProtection } from '../../utils/shopSystem.js';
import { isAdmin, isBotAdmin } from '../../utils/helpers.js';
import { isOwnerOrAdditional } from '../../utils/ownerManager.js';
import { config } from '../../config.js';
import { addWarning, getWarnings } from '../../utils/database.js';
import { hasReachedLimit, incrementUsage, getRemainingUses } from '../../utils/economy/dailyLimits.js';
import { auditLog } from '../../utils/securityEnhancements.js';
import fs from 'fs';
import path from 'path';

const responses = {
    en: {
        usage: '❌ Please mention or reply to someone to rob them.\n\nUsage: .rob @user',
        cannotRobSelf: '❌ You cannot rob yourself!',
        cannotRobOwner: '⚠️ WARNING: You cannot rob the bot owner!\n\n🚨 You have been warned for attempting this.\n\n👑 Respect the owner!',
        targetProtected: '🛡️ This user has Anti-Rob protection!\n\nYou cannot rob them.',
        targetPoor: '❌ This user is too poor to rob!\n\nThey have less than 100 coins.',
        youArePoor: '❌ You need at least 50 coins to attempt a robbery!',
        cooldown: '⏰ You must wait {time} before robbing again!',
        dailyLimit: '⏰ Daily Limit Reached!\n\nYou\'ve used all {limit} robberies for today.\n\n🔄 Resets at midnight\n📊 Used: {used}/{limit}',
        success: '💰 ROBBERY SUCCESSFUL!\n\n🎯 Target: @{target}\n💵 Stolen: {amount} coins\n💰 Your Balance: {balance} coins\n\n🎉 Nice heist!',
        failed: '❌ ROBBERY FAILED!\n\n🎯 Target: @{target}\n💸 Lost: {amount} coins (fine)\n💰 Your Balance: {balance} coins\n\n👮 Better luck next time!',
        chance: '\n🍀 Your Success Rate: {chance}%',
        robAttempt: '🚨 ROBBERY ATTEMPT! 🚨\n\n@{target} is being robbed by @{robber}!\n\n💰 Potential Loss: {amount} coins\n\n⚔️ @{target} can defend by typing .fight within 30 seconds!\n🛡️ Fight back or lose your coins!\n\n💀 Use .kill for revenge!',
        fightWin: '⚔️ FIGHT WON!\n\n🎯 Defender: @{defender}\n👊 You fought off @{robber}!\n💰 Kept your coins safe!\n🎁 Bonus: +{bonus} coins for defending!\n💰 Your Balance: {balance} coins\n\n💪 Great defense!\n🎲 Fight Success Rate: {chance}%\n\n💀 Use .kill for revenge!',
        fightLose: '⚔️ FIGHT LOST!\n\n🎯 Defender: @{defender}\n💔 @{robber} overpowered you!\n💸 Lost: {amount} coins\n💰 Your Balance: {balance} coins\n\n😢 Better luck next time!\n🎲 Fight Success Rate: {chance}%\n\n💀 Use .kill for revenge!',
        noRobbery: '❌ No one is trying to rob you right now!',
        notYourFight: '❌ This is not your fight!',
        robberyExpired: '⏰ The robbery attempt has expired.\n\n@{robber} got away with {amount} coins from @{target}!',
        fightChance: '\n🎲 Fight Success Rate: {chance}%'
    },
    it: {
        usage: '❌ Menziona o rispondi a qualcuno per derubarlo.\n\nUso: .rob @utente',
        cannotRobSelf: '❌ Non puoi derubare te stesso!',
        cannotRobOwner: '⚠️ AVVISO: Non puoi derubare il proprietario del bot!\n\n🚨 Sei stato avvisato per aver tentato questo.\n\n👑 Rispetta il proprietario!',
        targetProtected: '🛡️ Questo utente ha protezione Anti-Furto!\n\nNon puoi derubarlo.',
        targetPoor: '❌ Questo utente è troppo povero per essere derubato!\n\nHa meno di 100 monete.',
        youArePoor: '❌ Hai bisogno di almeno 50 monete per tentare una rapina!',
        cooldown: '⏰ Devi aspettare {time} prima di rapinare di nuovo!',
        dailyLimit: '⏰ Limite Giornaliero Raggiunto!\n\nHai usato tutte le {limit} rapine per oggi.\n\n🔄 Si resetta a mezzanotte\n📊 Usate: {used}/{limit}',
        success: '💰 RAPINA RIUSCITA!\n\n🎯 Obiettivo: @{target}\n💵 Rubato: {amount} monete\n💰 Tuo Saldo: {balance} monete\n\n🎉 Bel colpo!',
        failed: '❌ RAPINA FALLITA!\n\n🎯 Obiettivo: @{target}\n💸 Perso: {amount} monete (multa)\n💰 Tuo Saldo: {balance} monete\n\n👮 Riprova!',
        chance: '\n🍀 Tasso di Successo: {chance}%',
        robAttempt: '🚨 TENTATIVO DI RAPINA! 🚨\n\n@{target} viene derubato da @{robber}!\n\n💰 Perdita Potenziale: {amount} monete\n\n⚔️ @{target} può difendersi scrivendo .fight entro 30 secondi!\n🛡️ Combatti o perdi le tue monete!\n\n💀 Usa .kill per vendetta!',
        fightWin: '⚔️ COMBATTIMENTO VINTO!\n\n🎯 Difensore: @{defender}\n👊 Hai respinto @{robber}!\n💰 Monete al sicuro!\n🎁 Bonus: +{bonus} monete per la difesa!\n💰 Tuo Saldo: {balance} monete\n\n💪 Grande difesa!\n🎲 Tasso Successo Combattimento: {chance}%\n\n💀 Usa .kill per vendetta!',
        fightLose: '⚔️ COMBATTIMENTO PERSO!\n\n🎯 Difensore: @{defender}\n💔 @{robber} ti ha sopraffatto!\n💸 Perso: {amount} monete\n💰 Tuo Saldo: {balance} monete\n\n😢 Riprova!\n🎲 Tasso Successo Combattimento: {chance}%\n\n💀 Usa .kill per vendetta!',
        noRobbery: '❌ Nessuno sta cercando di derubarti!',
        notYourFight: '❌ Questo non è il tuo combattimento!',
        robberyExpired: '⏰ Il tentativo di rapina è scaduto.\n\n@{robber} è scappato con {amount} monete da @{target}!',
        fightChance: '\n🎲 Tasso Successo Combattimento: {chance}%'
    },
    ru: {
        usage: '❌ Упомяните или ответьте кому-то, чтобы ограбить их.\n\nИспользование: .rob @пользователь',
        cannotRobSelf: '❌ Вы не можете ограбить себя!',
        cannotRobOwner: '⚠️ ПРЕДУПРЕЖДЕНИЕ: Вы не можете ограбить владельца бота!\n\n🚨 Вы получили предупреждение за эту попытку.\n\n👑 Уважайте владельца!',
        targetProtected: '🛡️ У этого пользователя есть защита от ограбления!\n\nВы не можете его ограбить.',
        targetPoor: '❌ Этот пользователь слишком беден для ограбления!\n\nУ него меньше 100 монет.',
        youArePoor: '❌ Вам нужно минимум 50 монет для попытки ограбления!',
        cooldown: '⏰ Вы должны подождать {time} перед следующим ограблением!',
        dailyLimit: '⏰ Дневной Лимит Достигнут!\n\nВы использовали все {limit} ограблений на сегодня.\n\n🔄 Сброс в полночь\n📊 Использовано: {used}/{limit}',
        success: '💰 ОГРАБЛЕНИЕ УСПЕШНО!\n\n🎯 Цель: @{target}\n💵 Украдено: {amount} монет\n💰 Ваш Баланс: {balance} монет\n\n🎉 Отличная работа!',
        failed: '❌ ОГРАБЛЕНИЕ ПРОВАЛИЛОСЬ!\n\n🎯 Цель: @{target}\n💸 Потеряно: {amount} монет (штраф)\n💰 Ваш Баланс: {balance} монет\n\n👮 Повезет в следующий раз!',
        chance: '\n🍀 Шанс Успеха: {chance}%',
        robAttempt: '🚨 ПОПЫТКА ОГРАБЛЕНИЯ! 🚨\n\n@{target} грабит @{robber}!\n\n💰 Возможная Потеря: {amount} монет\n\n⚔️ @{target} может защититься, написав .fight в течение 30 секунд!\n🛡️ Сражайтесь или потеряйте монеты!\n\n💀 Используйте .kill для мести!',
        fightWin: '⚔️ БОЙ ВЫИГРАН!\n\n🎯 Защитник: @{defender}\n👊 Вы отбили @{robber}!\n💰 Монеты в безопасности!\n🎁 Бонус: +{bonus} монет за защиту!\n💰 Ваш Баланс: {balance} монет\n\n💪 Отличная защита!\n🎲 Шанс Успеха Боя: {chance}%\n\n💀 Используйте .kill для мести!',
        fightLose: '⚔️ БОЙ ПРОИГРАН!\n\n🎯 Защитник: @{defender}\n💔 @{robber} одолел вас!\n💸 Потеряно: {amount} монет\n💰 Ваш Баланс: {balance} монет\n\n😢 Повезет в следующий раз!\n🎲 Шанс Успеха Боя: {chance}%\n\n💀 Используйте .kill для мести!',
        noRobbery: '❌ Никто не пытается вас ограбить!',
        notYourFight: '❌ Это не ваш бой!',
        robberyExpired: '⏰ Попытка ограбления истекла.\n\n@{robber} сбежал с {amount} монетами от @{target}!',
        fightChance: '\n🎲 Шанс Успеха Боя: {chance}%'
    },
    es: {
        usage: '❌ Menciona o responde a alguien para robarle.\n\nUso: .rob @usuario',
        cannotRobSelf: '❌ ¡No puedes robarte a ti mismo!',
        cannotRobOwner: '⚠️ ADVERTENCIA: ¡No puedes robar al dueño del bot!\n\n🚨 Has sido advertido por intentar esto.\n\n👑 ¡Respeta al dueño!',
        targetProtected: '🛡️ ¡Este usuario tiene protección Anti-Robo!\n\nNo puedes robarle.',
        targetPoor: '❌ ¡Este usuario es demasiado pobre para robar!\n\nTiene menos de 100 monedas.',
        youArePoor: '❌ ¡Necesitas al menos 50 monedas para intentar un robo!',
        cooldown: '⏰ ¡Debes esperar {time} antes de robar de nuevo!',
        dailyLimit: '⏰ ¡Límite Diario Alcanzado!\n\nHas usado todos los {limit} robos de hoy.\n\n🔄 Se reinicia a medianoche\n📊 Usados: {used}/{limit}',
        success: '💰 ¡ROBO EXITOSO!\n\n🎯 Objetivo: @{target}\n💵 Robado: {amount} monedas\n💰 Tu Saldo: {balance} monedas\n\n🎉 ¡Buen trabajo!',
        failed: '❌ ¡ROBO FALLIDO!\n\n🎯 Objetivo: @{target}\n💸 Perdido: {amount} monedas (multa)\n💰 Tu Saldo: {balance} monedas\n\n👮 ¡Mejor suerte la próxima!',
        chance: '\n🍀 Tasa de Éxito: {chance}%',
        robAttempt: '🚨 ¡INTENTO DE ROBO! 🚨\n\n¡@{target} está siendo robado por @{robber}!\n\n💰 Pérdida Potencial: {amount} monedas\n\n⚔️ ¡@{target} puede defenderse escribiendo .fight en 30 segundos!\n🛡️ ¡Lucha o pierde tus monedas!\n\n💀 ¡Usa .kill para venganza!',
        fightWin: '⚔️ ¡PELEA GANADA!\n\n🎯 Defensor: @{defender}\n👊 ¡Rechazaste a @{robber}!\n💰 ¡Monedas a salvo!\n🎁 Bonificación: +{bonus} monedas por defender!\n💰 Tu Saldo: {balance} monedas\n\n💪 ¡Gran defensa!\n🎲 Tasa de Éxito de Pelea: {chance}%\n\n💀 ¡Usa .kill para venganza!',
        fightLose: '⚔️ ¡PELEA PERDIDA!\n\n🎯 Defensor: @{defender}\n💔 ¡@{robber} te venció!\n💸 Perdido: {amount} monedas\n💰 Tu Saldo: {balance} monedas\n\n😢 ¡Mejor suerte la próxima!\n🎲 Tasa de Éxito de Pelea: {chance}%\n\n💀 ¡Usa .kill para venganza!',
        noRobbery: '❌ ¡Nadie está intentando robarte ahora!',
        notYourFight: '❌ ¡Esta no es tu pelea!',
        robberyExpired: '⏰ El intento de robo ha expirado.\n\n¡@{robber} escapó con {amount} monedas de @{target}!',
        fightChance: '\n🎲 Tasa de Éxito de Pelea: {chance}%'
    },
    pt: {
        usage: '❌ Mencione ou responda alguém para roubá-lo.\n\nUso: .rob @usuário',
        cannotRobSelf: '❌ Você não pode roubar a si mesmo!',
        cannotRobOwner: '⚠️ AVISO: Você não pode roubar o dono do bot!\n\n🚨 Você foi avisado por tentar isso.\n\n👑 Respeite o dono!',
        targetProtected: '🛡️ Este usuário tem proteção Anti-Roubo!\n\nVocê não pode roubá-lo.',
        targetPoor: '❌ Este usuário é muito pobre para roubar!\n\nEle tem menos de 100 moedas.',
        youArePoor: '❌ Você precisa de pelo menos 50 moedas para tentar um roubo!',
        cooldown: '⏰ Você deve esperar {time} antes de roubar novamente!',
        dailyLimit: '⏰ Limite Diário Atingido!\n\nVocê usou todos os {limit} roubos de hoje.\n\n🔄 Reinicia à meia-noite\n📊 Usados: {used}/{limit}',
        success: '💰 ROUBO BEM-SUCEDIDO!\n\n🎯 Alvo: @{target}\n💵 Roubado: {amount} moedas\n💰 Seu Saldo: {balance} moedas\n\n🎉 Bom trabalho!',
        failed: '❌ ROUBO FALHOU!\n\n🎯 Alvo: @{target}\n💸 Perdido: {amount} moedas (multa)\n💰 Seu Saldo: {balance} moedas\n\n👮 Melhor sorte da próxima!',
        chance: '\n🍀 Taxa de Sucesso: {chance}%',
        robAttempt: '🚨 TENTATIVA DE ROUBO! 🚨\n\n@{target} está sendo roubado por @{robber}!\n\n💰 Perda Potencial: {amount} moedas\n\n⚔️ @{target} pode se defender digitando .fight em 30 segundos!\n🛡️ Lute ou perca suas moedas!\n\n💀 Use .kill para vingança!',
        fightWin: '⚔️ LUTA VENCIDA!\n\n🎯 Defensor: @{defender}\n👊 Você repeliu @{robber}!\n💰 Moedas seguras!\n🎁 Bônus: +{bonus} moedas por defender!\n💰 Seu Saldo: {balance} moedas\n\n💪 Ótima defesa!\n🎲 Taxa de Sucesso da Luta: {chance}%\n\n💀 Use .kill para vingança!',
        fightLose: '⚔️ LUTA PERDIDA!\n\n🎯 Defensor: @{defender}\n💔 @{robber} te dominou!\n💸 Perdido: {amount} moedas\n💰 Seu Saldo: {balance} moedas\n\n😢 Melhor sorte da próxima!\n🎲 Taxa de Sucesso da Luta: {chance}%\n\n💀 Use .kill para vingança!',
        noRobbery: '❌ Ninguém está tentando roubar você agora!',
        notYourFight: '❌ Esta não é sua luta!',
        robberyExpired: '⏰ A tentativa de roubo expirou.\n\n@{robber} fugiu com {amount} moedas de @{target}!',
        fightChance: '\n🎲 Taxa de Sucesso da Luta: {chance}%'
    },
    ar: {
        usage: '❌ اعمل منشن أو رد على شخص لسرقته.\n\nالاستخدام: .rob @مستخدم',
        cannotRobSelf: '❌ لا يمكنك سرقة نفسك!',
        cannotRobOwner: '⚠️ تحذير: لا يمكنك سرقة صاحب البوت!\n\n🚨 تم تحذيرك لمحاولة هذا.\n\n👑 احترم المالك!',
        targetProtected: '🛡️ هذا المستخدم لديه حماية ضد السرقة!\n\nلا يمكنك سرقته.',
        targetPoor: '❌ هذا المستخدم فقير جداً للسرقة!\n\nلديه أقل من 100 عملة.',
        youArePoor: '❌ تحتاج على الأقل 50 عملة لمحاولة السرقة!',
        cooldown: '⏰ يجب أن تنتظر {time} قبل السرقة مرة أخرى!',
        dailyLimit: '⏰ وصلت للحد اليومي!\n\nاستخدمت كل الـ {limit} سرقات لليوم.\n\n🔄 يتجدد عند منتصف الليل\n📊 المستخدم: {used}/{limit}',
        success: '💰 السرقة ناجحة!\n\n🎯 الهدف: @{target}\n💵 مسروق: {amount} عملة\n💰 رصيدك: {balance} عملة\n\n🎉 عمل رائع!',
        failed: '❌ السرقة فشلت!\n\n🎯 الهدف: @{target}\n💸 خسارة: {amount} عملة (غرامة)\n💰 رصيدك: {balance} عملة\n\n👮 حظ أفضل المرة القادمة!',
        chance: '\n🍀 معدل النجاح: {chance}%',
        robAttempt: '🚨 محاولة سرقة! 🚨\n\n@{target} بيتسرق من @{robber}!\n\n💰 خسارة محتملة: {amount} عملة\n\n⚔️ @{target} يقدر يدافع بكتابة .fight خلال 30 ثانية!\n🛡️ حارب أو اخسر عملاتك!\n\n💀 استخدم .kill للانتقام!',
        fightWin: '⚔️ فزت في القتال!\n\n🎯 المدافع: @{defender}\n👊 دافعت ضد @{robber}!\n💰 عملاتك آمنة!\n🎁 مكافأة: +{bonus} عملة للدفاع!\n💰 رصيدك: {balance} عملة\n\n💪 دفاع رائع!\n🎲 معدل نجاح القتال: {chance}%\n\n💀 استخدم .kill للانتقام!',
        fightLose: '⚔️ خسرت القتال!\n\n🎯 المدافع: @{defender}\n💔 @{robber} غلبك!\n💸 خسارة: {amount} عملة\n💰 رصيدك: {balance} عملة\n\n😢 حظ أفضل المرة القادمة!\n🎲 معدل نجاح القتال: {chance}%\n\n💀 استخدم .kill للانتقام!',
        noRobbery: '❌ مفيش حد بيحاول يسرقك دلوقتي!',
        notYourFight: '❌ ده مش قتالك!',
        robberyExpired: '⏰ محاولة السرقة انتهت.\n\n@{robber} هرب بـ {amount} عملة من @{target}!',
        fightChance: '\n🎲 معدل نجاح القتال: {chance}%'
    },
    hi: {
        usage: '❌ कृपया किसी को लूटने के लिए उल्लेख करें या उत्तर दें।\n\nउपयोग: .rob @उपयोगकर्ता',
        cannotRobSelf: '❌ आप खुद को लूट नहीं सकते!',
        cannotRobOwner: '⚠️ चेतावनी: आप बॉट के मालिक को लूट नहीं सकते!\n\n🚨 इसका प्रयास करने के लिए आपको चेतावनी दी गई है।\n\n👑 मालिक का सम्मान करें!',
        targetProtected: '🛡️ इस उपयोगकर्ता के पास एंटी-रॉब सुरक्षा है!\n\nआप उन्हें लूट नहीं सकते।',
        targetPoor: '❌ यह उपयोगकर्ता लूटने के लिए बहुत गरीब है!\n\nउनके पास 100 सिक्कों से कम है।',
        youArePoor: '❌ डकैती का प्रयास करने के लिए आपको कम से कम 50 सिक्कों की आवश्यकता है!',
        cooldown: '⏰ आपको फिर से लूटने से पहले {time} प्रतीक्षा करनी होगी!',
        dailyLimit: '⏰ दैनिक सीमा पूर्ण!\n\nआपने आज के सभी {limit} डकैती उपयोग कर लिए हैं।\n\n🔄 आधी रात को रीसेट होता है\n📊 उपयोग किया: {used}/{limit}',
        success: '💰 डकैती सफल!\n\n🎯 लक्ष्य: @{target}\n💵 चुराया: {amount} सिक्के\n💰 आपका बैलेंस: {balance} सिक्के\n\n🎉 बढ़िया डकैती!',
        failed: '❌ डकैती विफल!\n\n🎯 लक्ष्य: @{target}\n💸 खोया: {amount} सिक्के (जुर्माना)\n💰 आपका बैलेंस: {balance} सिक्के\n\n👮 अगली बार बेहतर किस्मत!',
        chance: '\n🍀 आपकी सफलता दर: {chance}%',
        robAttempt: '🚨 डकैती का प्रयास! 🚨\n\n@{target} को @{robber} द्वारा लूटा जा रहा है!\n\n💰 संभावित नुकसान: {amount} सिक्के\n\n⚔️ @{target} 30 सेकंड के भीतर .fight टाइप करके बचाव कर सकते हैं!\n🛡️ लड़ें या अपने सिक्के खो दें!\n\n💀 बदला लेने के लिए .kill का उपयोग करें!',
        fightWin: '⚔️ लड़ाई जीती!\n\n🎯 रक्षक: @{defender}\n👊 आपने @{robber} को हरा दिया!\n💰 अपने सिक्के सुरक्षित रखे!\n🎁 बोनस: +{bonus} सिक्के बचाव के लिए!\n💰 आपका बैलेंस: {balance} सिक्के\n\n💪 शानदार बचाव!\n🎲 लड़ाई सफलता दर: {chance}%\n\n💀 बदला लेने के लिए .kill का उपयोग करें!',
        fightLose: '⚔️ लड़ाई हारी!\n\n🎯 रक्षक: @{defender}\n💔 @{robber} ने आपको हरा दिया!\n💸 खोया: {amount} सिक्के\n💰 आपका बैलेंस: {balance} सिक्के\n\n😢 अगली बार बेहतर किस्मत!\n🎲 लड़ाई सफलता दर: {chance}%\n\n💀 बदला लेने के लिए .kill का उपयोग करें!',
        noRobbery: '❌ अभी कोई आपको लूटने की कोशिश नहीं कर रहा है!',
        notYourFight: '❌ यह आपकी लड़ाई नहीं है!',
        robberyExpired: '⏰ डकैती का प्रयास समाप्त हो गया है।\n\n@{robber} @{target} से {amount} सिक्कों के साथ भाग गया!',
        fightChance: '\n🎲 लड़ाई सफलता दर: {chance}%'
    },
    ng: {
        usage: '❌ Abeg mention or reply person wey you wan rob.\n\nHow to use: .rob @person',
        cannotRobSelf: '❌ You no fit rob yourself!',
        cannotRobOwner: '⚠️ WARNING: You no fit rob di bot owner!\n\n🚨 You don collect warning for trying dis.\n\n👑 Respect di owner!',
        targetProtected: '🛡️ Dis person get Anti-Rob protection!\n\nYou no fit rob am.',
        targetPoor: '❌ Dis person too poor to rob!\n\nE get less than 100 coins.',
        youArePoor: '❌ You need at least 50 coins to try robbery!',
        cooldown: '⏰ You must wait {time} before you rob again!',
        dailyLimit: '⏰ Daily Limit Don Reach!\n\nYou don use all {limit} robberies for today.\n\n🔄 E go reset for midnight\n📊 Used: {used}/{limit}',
        success: '💰 ROBBERY SUCCESS!\n\n🎯 Target: @{target}\n💵 Stolen: {amount} coins\n💰 Your Balance: {balance} coins\n\n🎉 Nice heist!',
        failed: '❌ ROBBERY FAIL!\n\n🎯 Target: @{target}\n💸 Lost: {amount} coins (fine)\n💰 Your Balance: {balance} coins\n\n👮 Better luck next time!',
        chance: '\n🍀 Your Success Rate: {chance}%',
        robAttempt: '🚨 ROBBERY ATTEMPT! 🚨\n\n@{target} dey get robbed by @{robber}!\n\n💰 Potential Loss: {amount} coins\n\n⚔️ @{target} fit defend by typing .fight within 30 seconds!\n🛡️ Fight back or lose your coins!\n\n💀 Use .kill for revenge!',
        fightWin: '⚔️ FIGHT WON!\n\n🎯 Defender: @{defender}\n👊 You don fight off @{robber}!\n💰 Your coins dey safe!\n🎁 Bonus: +{bonus} coins for defending!\n💰 Your Balance: {balance} coins\n\n💪 Great defense!\n🎲 Fight Success Rate: {chance}%\n\n💀 Use .kill for revenge!',
        fightLose: '⚔️ FIGHT LOST!\n\n🎯 Defender: @{defender}\n💔 @{robber} don overpower you!\n💸 Lost: {amount} coins\n💰 Your Balance: {balance} coins\n\n😢 Better luck next time!\n🎲 Fight Success Rate: {chance}%\n\n💀 Use .kill for revenge!',
        noRobbery: '❌ Nobody dey try rob you now!',
        notYourFight: '❌ Dis no be your fight!',
        robberyExpired: '⏰ Di robbery attempt don expire.\n\n@{robber} don run with {amount} coins from @{target}!',
        fightChance: '\n🎲 Fight Success Rate: {chance}%'
    }
};

// Cooldown tracking
const cooldowns = new Map();
const COOLDOWN_TIME = 60000; // 1 minute

// Pending robberies (for fight mechanic)
export const pendingRobberies = new Map();
export const robberyTimeouts = new Map(); // Track timeout IDs to prevent leaks
const FIGHT_TIMEOUT = 30000; // 30 seconds to fight back

// Cleanup old cooldowns every 5 minutes
setInterval(() => {
    const now = Date.now();
    let cleaned = 0;
    for (const [key, expiry] of cooldowns.entries()) {
        if (now > expiry) {
            cooldowns.delete(key);
            cleaned++;
        }
    }
    if (cleaned > 0) {
        console.log(`[ROB-CLEANUP] Removed ${cleaned} old cooldown entries`);
    }
}, 300000); // Every 5 minutes

function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
}

export default {
    name: 'rob',
    aliases: ['steal', 'heist'],
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const senderId = sender.split('@')[0];
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;

        try {
            // Get target user
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
            const target = mentioned || quoted;

            if (!target) {
                return await sock.sendMessage(from, {
                    text: t.usage
                });
            }

            const targetId = target.split('@')[0];

            // Check if trying to rob self
            if (target === sender) {
                return await sock.sendMessage(from, {
                    text: t.cannotRobSelf
                });
            }

            // Check if trying to rob the bot owner
            const botJid = sock.user?.id?.replace(/:\d+/, '') || '';
            const isTargetOwner = isOwnerOrAdditional(target, botJid, config.ownerNumber, config.ownerJid, false);
            
            if (isTargetOwner) {
                // Add warning to the robber
                try {
                    await addWarning(from, sender, 'Attempted to rob the bot owner');
                    const warnings = getWarnings(from, sender);
                    
                    let warningMsg = t.cannotRobOwner;
                    warningMsg += `\n\n⚠️ Warnings: ${warnings.count || 0}/${config.maxWarnings || 3}`;
                    
                    if (warnings.count >= (config.maxWarnings || 3)) {
                        warningMsg += '\n\n🚨 Maximum warnings reached! You will be kicked.';
                    }
                    
                    return await sock.sendMessage(from, {
                        text: warningMsg,
                        mentions: [sender]
                    });
                } catch (error) {
                    console.error('[ROB] Error adding warning:', error);
                    return await sock.sendMessage(from, {
                        text: t.cannotRobOwner,
                        mentions: [sender]
                    });
                }
            }

            // Check cooldown
            const now = Date.now();
            const cooldownKey = `${senderId}_${from}`;
            if (cooldowns.has(cooldownKey)) {
                const expirationTime = cooldowns.get(cooldownKey);
                if (now < expirationTime) {
                    const timeLeft = expirationTime - now;
                    return await sock.sendMessage(from, {
                        text: t.cooldown.replace('{time}', formatTime(timeLeft))
                    });
                }
            }

            // Check daily limit
            if (hasReachedLimit(senderId, 'rob')) {
                const remaining = getRemainingUses(senderId, 'rob');
                return await sock.sendMessage(from, {
                    text: t.dailyLimit
                        .replace(/{limit}/g, '15')
                        .replace('{used}', '15')
                });
            }

            // Check if robber has enough coins
            const robberBalance = await getBalance(sender);
            if (robberBalance < 50) {
                return await sock.sendMessage(from, {
                    text: t.youArePoor
                });
            }

            // Check if target has protection
            if (hasProtection(targetId, 'rob')) {
                return await sock.sendMessage(from, {
                    text: t.targetProtected,
                    mentions: [target]
                });
            }

            // Check if target has enough coins
            const targetBalance = await getBalance(target);
            if (targetBalance < 100) {
                return await sock.sendMessage(from, {
                    text: t.targetPoor,
                    mentions: [target]
                });
            }

            // Calculate stolen amount (10-30% of target's balance)
            const percentage = Math.random() * 0.2 + 0.1; // 10-30%
            const stolenAmount = Math.floor(targetBalance * percentage);

            // Create pending robbery
            const robberyKey = `${from}_${targetId}`;
            pendingRobberies.set(robberyKey, {
                robber: sender,
                robberId: senderId,
                target: target,
                targetId: targetId,
                amount: stolenAmount,
                timestamp: now,
                from: from
            });

            // Send robbery attempt message
            const attemptMsg = t.robAttempt
                .replace(/@\{target\}/g, `@${targetId}`)
                .replace(/@\{robber\}/g, `@${senderId}`)
                .replace('{amount}', stolenAmount.toLocaleString());

            await sock.sendMessage(from, {
                text: attemptMsg,
                mentions: [target, sender]
            });

            // Set cooldown for robber
            cooldowns.set(cooldownKey, now + COOLDOWN_TIME);

            // Set timeout to auto-complete robbery if no fight
            const timeoutId = setTimeout(async () => {
                if (pendingRobberies.has(robberyKey)) {
                    const robbery = pendingRobberies.get(robberyKey);
                    pendingRobberies.delete(robberyKey);
                    robberyTimeouts.delete(robberyKey);

                    try {
                        // Robbery succeeds by default
                        await removeCoins(robbery.target, robbery.amount);
                        await addCoins(robbery.robber, robbery.amount);
                        
                        // Increment rob usage counter
                        incrementUsage(robbery.robberId, 'rob');

                        const expiredMsg = t.robberyExpired
                            .replace(/@\{robber\}/g, `@${robbery.robberId}`)
                            .replace(/@\{target\}/g, `@${robbery.targetId}`)
                            .replace('{amount}', robbery.amount.toLocaleString());

                        await sock.sendMessage(robbery.from, {
                            text: expiredMsg,
                            mentions: [robbery.robber, robbery.target]
                        });
                    } catch (error) {
                        console.error('[ROB] Timeout execution error:', error.message);
                    }
                }
            }, FIGHT_TIMEOUT);
            
            // Store timeout ID to prevent leaks
            robberyTimeouts.set(robberyKey, timeoutId);

        } catch (error) {
            console.error('[ROB] Command error:', error.message);
            console.error('[ROB] Stack:', error.stack);
            await sock.sendMessage(from, {
                text: '❌ An error occurred. Please try again.'
            });
        }
    }
};
