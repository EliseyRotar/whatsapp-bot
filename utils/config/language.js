import fs from 'fs';
import path from 'path';

const dataDir = './data';
const langFile = path.join(dataDir, 'group_languages.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Load group languages
function loadLanguages() {
    try {
        if (fs.existsSync(langFile)) {
            const data = fs.readFileSync(langFile, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('[LANG] Error loading languages:', error.message);
    }
    return {};
}

// Save group languages
function saveLanguages(languages) {
    try {
        fs.writeFileSync(langFile, JSON.stringify(languages, null, 2));
    } catch (error) {
        console.error('[LANG] Error saving languages:', error.message);
    }
}

// Get group language (default: en)
export function getGroupLanguage(groupJid) {
    const languages = loadLanguages();
    return languages[groupJid] || 'en';
}

// Set group language
export function setGroupLanguage(groupJid, language) {
    const languages = loadLanguages();
    languages[groupJid] = language;
    saveLanguages(languages);
}

// Translation strings
export const translations = {
    en: {
        // Command responses
        ownerOnly: '❌ This command is only for the bot owner.',
        groupOnly: '❌ This command can only be used in groups.',
        adminOnly: '❌ This command is only for group admins.',
        botAdminRequired: '❌ I need to be a group admin to use this command.',
        
        // Language command
        langSet: '✅ Language set to English!',
        langCurrent: 'Current language: English',
        langUsage: 'Usage: .setlang <en|it|ru|es|pt|ar|hi|ng>\n\nAvailable languages:\n• en - English\n• it - Italian\n• ru - Russian\n• es - Spanish\n• pt - Portuguese\n• ar - Arabic\n• hi - Hindi\n• ng - Nigerian Pidgin',
        
        // Common
        success: '✅ Success!',
        error: '❌ Error:',
        processing: '⏳ Processing...',
        done: '✅ Done!',
    },
    it: {
        // Command responses
        ownerOnly: '❌ Questo comando è solo per il proprietario del bot.',
        groupOnly: '❌ Questo comando può essere usato solo nei gruppi.',
        adminOnly: '❌ Questo comando è solo per gli admin del gruppo.',
        botAdminRequired: '❌ Devo essere admin del gruppo per usare questo comando.',
        
        // Language command
        langSet: '✅ Lingua impostata su Italiano!',
        langCurrent: 'Lingua attuale: Italiano',
        langUsage: 'Uso: .setlang <en|it|ru|es|pt|ar|hi|ng>\n\nLingue disponibili:\n• en - Inglese\n• it - Italiano\n• ru - Russo\n• es - Spagnolo\n• pt - Portoghese\n• ar - Arabo\n• hi - Hindi\n• ng - Nigerian Pidgin',
        
        // Common
        success: '✅ Successo!',
        error: '❌ Errore:',
        processing: '⏳ Elaborazione...',
        done: '✅ Fatto!',
    },
    ru: {
        // Command responses
        ownerOnly: '❌ Эта команда только для владельца бота.',
        groupOnly: '❌ Эту команду можно использовать только в группах.',
        adminOnly: '❌ Эта команда только для администраторов группы.',
        botAdminRequired: '❌ Мне нужны права администратора для использования этой команды.',
        
        // Language command
        langSet: '✅ Язык установлен на Русский!',
        langCurrent: 'Текущий язык: Русский',
        langUsage: 'Использование: .setlang <en|it|ru|es|pt|ar|hi|ng>\n\nДоступные языки:\n• en - Английский\n• it - Итальянский\n• ru - Русский\n• es - Испанский\n• pt - Португальский\n• ar - Арабский\n• hi - Хинди\n• ng - Nigerian Pidgin',
        
        // Common
        success: '✅ Успешно!',
        error: '❌ Ошибка:',
        processing: '⏳ Обработка...',
        done: '✅ Готово!',
    },
    es: {
        // Command responses
        ownerOnly: '❌ Este comando es solo para el dueño del bot.',
        groupOnly: '❌ Este comando solo se puede usar en grupos.',
        adminOnly: '❌ Este comando es solo para administradores del grupo.',
        botAdminRequired: '❌ Necesito ser administrador del grupo para usar este comando.',
        
        // Language command
        langSet: '✅ ¡Idioma establecido en Español!',
        langCurrent: 'Idioma actual: Español',
        langUsage: 'Uso: .setlang <en|it|ru|es|pt|ar|hi|ng>\n\nIdiomas disponibles:\n• en - Inglés\n• it - Italiano\n• ru - Ruso\n• es - Español\n• pt - Portugués\n• ar - Árabe\n• hi - Hindi\n• ng - Nigerian Pidgin',
        
        // Common
        success: '✅ ¡Éxito!',
        error: '❌ Error:',
        processing: '⏳ Procesando...',
        done: '✅ ¡Hecho!',
    },
    pt: {
        // Command responses
        ownerOnly: '❌ Este comando é apenas para o dono do bot.',
        groupOnly: '❌ Este comando só pode ser usado em grupos.',
        adminOnly: '❌ Este comando é apenas para administradores do grupo.',
        botAdminRequired: '❌ Preciso ser administrador do grupo para usar este comando.',
        
        // Language command
        langSet: '✅ Idioma definido para Português!',
        langCurrent: 'Idioma atual: Português',
        langUsage: 'Uso: .setlang <en|it|ru|es|pt|ar|hi|ng>\n\nIdiomas disponíveis:\n• en - Inglês\n• it - Italiano\n• ru - Russo\n• es - Espanhol\n• pt - Português\n• ar - Árabe\n• hi - Hindi\n• ng - Nigerian Pidgin',
        
        // Common
        success: '✅ Sucesso!',
        error: '❌ Erro:',
        processing: '⏳ Processando...',
        done: '✅ Pronto!',
    },
    ar: {
        // Command responses
        ownerOnly: '❌ هذا الأمر للمالك فقط.',
        groupOnly: '❌ هذا الأمر يمكن استخدامه في المجموعات فقط.',
        adminOnly: '❌ هذا الأمر لمشرفي المجموعة فقط.',
        botAdminRequired: '❌ أحتاج أن أكون مشرف في المجموعة لاستخدام هذا الأمر.',
        
        // Language command
        langSet: '✅ تم تعيين اللغة إلى العربية!',
        langCurrent: 'اللغة الحالية: العربية',
        langUsage: 'الاستخدام: .setlang <en|it|ru|es|pt|ar|hi|ng>\n\nاللغات المتاحة:\n• en - الإنجليزية\n• it - الإيطالية\n• ru - الروسية\n• es - الإسبانية\n• pt - البرتغالية\n• ar - العربية\n• hi - الهندية\n• ng - Nigerian Pidgin',
        
        // Common
        success: '✅ نجح!',
        error: '❌ خطأ:',
        processing: '⏳ جاري المعالجة...',
        done: '✅ تم!',
    },
    hi: {
        // Command responses
        ownerOnly: '❌ यह कमांड केवल बॉट के मालिक के लिए है।',
        groupOnly: '❌ यह कमांड केवल ग्रुप में इस्तेमाल किया जा सकता है।',
        adminOnly: '❌ यह कमांड केवल ग्रुप एडमिन के लिए है।',
        botAdminRequired: '❌ इस कमांड का उपयोग करने के लिए मुझे ग्रुप एडमिन होना चाहिए।',
        
        // Language command
        langSet: '✅ भाषा हिंदी में सेट कर दी गई!',
        langCurrent: 'वर्तमान भाषा: हिंदी',
        langUsage: 'उपयोग: .setlang <en|it|ru|es|pt|ar|hi|ng>\n\nउपलब्ध भाषाएं:\n• en - अंग्रेजी\n• it - इतालवी\n• ru - रूसी\n• es - स्पेनिश\n• pt - पुर्तगाली\n• ar - अरबी\n• hi - हिंदी\n• ng - Nigerian Pidgin',
        
        // Common
        success: '✅ सफल!',
        error: '❌ त्रुटि:',
        processing: '⏳ प्रोसेस हो रहा है...',
        done: '✅ हो गया!',
    },
    ng: {
        // Command responses
        ownerOnly: '❌ Dis command na only for bot owner.',
        groupOnly: '❌ Dis command fit only work for group.',
        adminOnly: '❌ Dis command na only for group admin dem.',
        botAdminRequired: '❌ I need be group admin make I fit use dis command.',
        
        // Language command
        langSet: '✅ Language don set to Nigerian Pidgin!',
        langCurrent: 'Current language: Nigerian Pidgin',
        langUsage: 'How to use: .setlang <en|it|ru|es|pt|ar|hi|ng>\n\nLanguages wey dey available:\n• en - English\n• it - Italian\n• ru - Russian\n• es - Spanish\n• pt - Portuguese\n• ar - Arabic\n• hi - Hindi\n• ng - Nigerian Pidgin',
        
        // Common
        success: '✅ E don work!',
        error: '❌ Wahala dey:',
        processing: '⏳ Abeg wait small...',
        done: '✅ E don finish!',
    }
};

// Get translated text
export function t(groupJid, key) {
    const lang = getGroupLanguage(groupJid);
    return translations[lang]?.[key] || translations.en[key] || key;
}
