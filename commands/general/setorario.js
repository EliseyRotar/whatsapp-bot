import { getGroupLanguage } from '../../utils/language.js';
import { getGroupClass, setGroupClass, removeGroupClass } from '../../utils/orarioConfig.js';
import { isAdmin } from '../../utils/helpers.js';
import { isOwnerOrAdditional } from '../../utils/ownerManager.js';
import { config } from '../../config.js';
import { WebUntisAnonymousAuth } from 'webuntis';

const responses = {
    en: {
        usage: '⚙️ Setup Orario\n\nConfigure the class for this group\'s schedule.\n\nUsage:\n.setorario <class> - Set class (e.g., 4Bi)\n.setorario - Show current class\n.setorario remove - Remove configuration',
        checking: '🔍 Checking if class exists...',
        classNotFound: '❌ Class not found!\n\nAvailable classes:',
        success: '✅ Class set successfully!\n\nClass: {class}\n\nYou can now use .orario to view the schedule.',
        current: '📋 Current Configuration\n\nClass: {class}\n\nUse .setorario <class> to change.',
        notConfigured: '⚠️ No class configured for this group.\n\nUse .setorario <class> to set up.',
        removed: '✅ Configuration removed successfully!',
        adminOnly: '❌ Only admins can configure the schedule.',
        error: '❌ Error:',
        groupOnly: '❌ This command can only be used in groups.'
    },
    it: {
        usage: '⚙️ Configura Orario\n\nConfigura la classe per l\'orario di questo gruppo.\n\nUso:\n.setorario <classe> - Imposta classe (es. 4Bi)\n.setorario - Mostra classe attuale\n.setorario remove - Rimuovi configurazione',
        checking: '🔍 Controllo se la classe esiste...',
        classNotFound: '❌ Classe non trovata!\n\nClassi disponibili:',
        success: '✅ Classe impostata con successo!\n\nClasse: {class}\n\nOra puoi usare .orario per vedere l\'orario.',
        current: '📋 Configurazione Attuale\n\nClasse: {class}\n\nUsa .setorario <classe> per cambiare.',
        notConfigured: '⚠️ Nessuna classe configurata per questo gruppo.\n\nUsa .setorario <classe> per configurare.',
        removed: '✅ Configurazione rimossa con successo!',
        adminOnly: '❌ Solo gli admin possono configurare l\'orario.',
        error: '❌ Errore:',
        groupOnly: '❌ Questo comando può essere usato solo nei gruppi.'
    },
    ru: {
        usage: '⚙️ Настройка расписания\n\nНастройте класс для расписания этой группы.\n\nИспользование:\n.setorario <класс> - Установить класс (напр. 4Bi)\n.setorario - Показать текущий класс\n.setorario remove - Удалить конфигурацию',
        checking: '🔍 Проверка существования класса...',
        classNotFound: '❌ Класс не найден!\n\nДоступные классы:',
        success: '✅ Класс успешно установлен!\n\nКласс: {class}\n\nТеперь вы можете использовать .orario для просмотра расписания.',
        current: '📋 Текущая конфигурация\n\nКласс: {class}\n\nИспользуйте .setorario <класс> для изменения.',
        notConfigured: '⚠️ Класс не настроен для этой группы.\n\nИспользуйте .setorario <класс> для настройки.',
        removed: '✅ Конфигурация успешно удалена!',
        adminOnly: '❌ Только администраторы могут настраивать расписание.',
        error: '❌ Ошибка:',
        groupOnly: '❌ Эта команда может использоваться только в группах.'
    },
    es: {
        usage: '⚙️ Configurar Horario\n\nConfigura la clase para el horario de este grupo.\n\nUso:\n.setorario <clase> - Establecer clase (ej. 4Bi)\n.setorario - Mostrar clase actual\n.setorario remove - Eliminar configuración',
        checking: '🔍 Verificando si la clase existe...',
        classNotFound: '❌ ¡Clase no encontrada!\n\nClases disponibles:',
        success: '✅ ¡Clase establecida exitosamente!\n\nClase: {class}\n\nAhora puedes usar .orario para ver el horario.',
        current: '📋 Configuración Actual\n\nClase: {class}\n\nUsa .setorario <clase> para cambiar.',
        notConfigured: '⚠️ No hay clase configurada para este grupo.\n\nUsa .setorario <clase> para configurar.',
        removed: '✅ ¡Configuración eliminada exitosamente!',
        adminOnly: '❌ Solo los administradores pueden configurar el horario.',
        error: '❌ Error:',
        groupOnly: '❌ Este comando solo se puede usar en grupos.'
    },
    pt: {
        usage: '⚙️ Configurar Horário\n\nConfigure a turma para o horário deste grupo.\n\nUso:\n.setorario <turma> - Definir turma (ex. 4Bi)\n.setorario - Mostrar turma atual\n.setorario remove - Remover configuração',
        checking: '🔍 Verificando se a turma existe...',
        classNotFound: '❌ Turma não encontrada!\n\nTurmas disponíveis:',
        success: '✅ Turma definida com sucesso!\n\nTurma: {class}\n\nAgora você pode usar .orario para ver o horário.',
        current: '📋 Configuração Atual\n\nTurma: {class}\n\nUse .setorario <turma> para mudar.',
        notConfigured: '⚠️ Nenhuma turma configurada para este grupo.\n\nUse .setorario <turma> para configurar.',
        removed: '✅ Configuração removida com sucesso!',
        adminOnly: '❌ Apenas administradores podem configurar o horário.',
        error: '❌ Erro:',
        groupOnly: '❌ Este comando só pode ser usado em grupos.'
    },
    ar: {
        usage: '⚙️ إعداد الجدول\n\nقم بتكوين الصف لجدول هذه المجموعة.\n\nالاستخدام:\n.setorario <صف> - تعيين الصف (مثال: 4Bi)\n.setorario - عرض الصف الحالي\n.setorario remove - إزالة التكوين',
        checking: '🔍 التحقق من وجود الصف...',
        classNotFound: '❌ الصف غير موجود!\n\nالصفوف المتاحة:',
        success: '✅ تم تعيين الصف بنجاح!\n\nالصف: {class}\n\nيمكنك الآن استخدام .orario لعرض الجدول.',
        current: '📋 التكوين الحالي\n\nالصف: {class}\n\nاستخدم .setorario <صف> للتغيير.',
        notConfigured: '⚠️ لم يتم تكوين صف لهذه المجموعة.\n\nاستخدم .setorario <صف> للتكوين.',
        removed: '✅ تمت إزالة التكوين بنجاح!',
        adminOnly: '❌ المشرفون فقط يمكنهم تكوين الجدول.',
        error: '❌ خطأ:',
        groupOnly: '❌ هذا الأمر يمكن استخدامه في المجموعات فقط.'
    },
    hi: {
        usage: '⚙️ ऑरारियो सेटअप\n\nइस ग्रुप के शेड्यूल के लिए क्लास कॉन्फ़िगर करें।\n\nउपयोग:\n.setorario <class> - क्लास सेट करें (उदा. 4Bi)\n.setorario - वर्तमान क्लास दिखाएं\n.setorario remove - कॉन्फ़िगरेशन हटाएं',
        checking: '🔍 जांच रहे हैं कि क्लास मौजूद है...',
        classNotFound: '❌ क्लास नहीं मिली!\n\nउपलब्ध क्लासेस:',
        success: '✅ क्लास सफलतापूर्वक सेट की गई!\n\nक्लास: {class}\n\nअब आप शेड्यूल देखने के लिए .orario का उपयोग कर सकते हैं।',
        current: '📋 वर्तमान कॉन्फ़िगरेशन\n\nक्लास: {class}\n\nबदलने के लिए .setorario <class> का उपयोग करें।',
        notConfigured: '⚠️ इस ग्रुप के लिए कोई क्लास कॉन्फ़िगर नहीं है।\n\nसेट करने के लिए .setorario <class> का उपयोग करें।',
        removed: '✅ कॉन्फ़िगरेशन सफलतापूर्वक हटाया गया!',
        adminOnly: '❌ केवल एडमिन ही शेड्यूल कॉन्फ़िगर कर सकते हैं।',
        error: '❌ एरर:',
        groupOnly: '❌ यह कमांड केवल ग्रुप में उपयोग किया जा सकता है।'
    }
};

// School configuration
const SCHOOL_CONFIG = {
    school: 'marconi',
    server: 'marconi.webuntis.com'
};

export default {
    name: 'setorario',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        const isGroup = from.endsWith('@g.us');
        
        try {
            // Check if in group
            if (!isGroup) {
                return await sock.sendMessage(from, {
                    text: t.groupOnly
                });
            }
            
            // Check permissions
            const botJid = sock.user?.id?.replace(/:\d+/, '') || '';
            const isOwner = isOwnerOrAdditional(sender, botJid, config.ownerNumber, config.ownerJid, msg.key.fromMe);
            const isUserAdmin = await isAdmin(sock, from, sender);
            
            if (!isOwner && !isUserAdmin) {
                return await sock.sendMessage(from, {
                    text: t.adminOnly
                });
            }
            
            // No arguments - show current configuration
            if (args.length === 0) {
                const currentClass = getGroupClass(from);
                
                if (!currentClass) {
                    return await sock.sendMessage(from, {
                        text: t.notConfigured + '\n\n' + t.usage
                    });
                }
                
                return await sock.sendMessage(from, {
                    text: t.current.replace('{class}', currentClass)
                });
            }
            
            // Remove configuration
            if (args[0].toLowerCase() === 'remove') {
                removeGroupClass(from);
                return await sock.sendMessage(from, {
                    text: t.removed
                });
            }
            
            // Set new class
            const className = args[0];
            
            // Send checking message
            const checkMsg = await sock.sendMessage(from, {
                text: t.checking
            });
            
            // Verify class exists
            const untis = new WebUntisAnonymousAuth(
                SCHOOL_CONFIG.school,
                SCHOOL_CONFIG.server
            );
            
            await untis.login();
            const classes = await untis.getClasses();
            await untis.logout();
            
            // Find the class
            const targetClass = classes.find(c => 
                c.name === className || 
                c.longName === className ||
                c.name.toLowerCase() === className.toLowerCase()
            );
            
            if (!targetClass) {
                const classList = classes.map(c => c.name).join(', ');
                return await sock.sendMessage(from, {
                    text: `${t.classNotFound}\n\n${classList}`,
                    edit: checkMsg.key
                });
            }
            
            // Save configuration
            setGroupClass(from, targetClass.name);
            
            await sock.sendMessage(from, {
                text: t.success.replace('{class}', targetClass.name),
                edit: checkMsg.key
            });
            
        } catch (error) {
            console.error('[SETORARIO] Error:', error.message);
            await sock.sendMessage(from, {
                text: `${t.error} ${error.message}`
            });
        }
    }
};
