import { getGroupLanguage } from '../../utils/language.js';
import { getGroupClass } from '../../utils/orarioConfig.js';
import { WebUntisAnonymousAuth, WebUntisElementType } from 'webuntis';

const SCHOOL_CONFIG = {
    school: 'marconi',
    server: 'marconi.webuntis.com'
};

const responses = {
    en: {
        notConfigured: '⚠️ Class not configured. Use .setorario first.',
        fetching: '🔍 Fetching debug info...',
        found: 'Found MARCHESE:',
        first5: '\nFirst 5 teachers:',
        error: '❌ Error:'
    },
    it: {
        notConfigured: '⚠️ Classe non configurata. Usa .setorario prima.',
        fetching: '🔍 Recupero info debug...',
        found: 'Trovato MARCHESE:',
        first5: '\nPrimi 5 insegnanti:',
        error: '❌ Errore:'
    },
    ru: {
        notConfigured: '⚠️ Класс не настроен. Используйте .setorario сначала.',
        fetching: '🔍 Получение отладочной информации...',
        found: 'Найден MARCHESE:',
        first5: '\nПервые 5 учителей:',
        error: '❌ Ошибка:'
    },
    es: {
        notConfigured: '⚠️ Clase no configurada. Usa .setorario primero.',
        fetching: '🔍 Obteniendo información de depuración...',
        found: 'Encontrado MARCHESE:',
        first5: '\nPrimeros 5 profesores:',
        error: '❌ Error:'
    },
    pt: {
        notConfigured: '⚠️ Turma não configurada. Use .setorario primeiro.',
        fetching: '🔍 Buscando informações de depuração...',
        found: 'Encontrado MARCHESE:',
        first5: '\nPrimeiros 5 professores:',
        error: '❌ Erro:'
    },
    ar: {
        notConfigured: '⚠️ الفصل مش متكوّن. استخدم .setorario الأول.',
        fetching: '🔍 بنجيب معلومات التصحيح...',
        found: 'لقينا MARCHESE:',
        first5: '\nأول 5 مدرسين:',
        error: '❌ خطأ:'
    },
    hi: {
        notConfigured: '⚠️ क्लास कॉन्फ़िगर नहीं है। पहले .setorario का उपयोग करें।',
        fetching: '🔍 डीबग जानकारी फेच कर रहे हैं...',
        found: 'MARCHESE मिला:',
        first5: '\nपहले 5 टीचर:',
        error: '❌ एरर:'
    }
};

export default {
    name: 'debugorario',
    ownerOnly: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        const className = getGroupClass(from);
        
        if (!className) {
            return await sock.sendMessage(from, {
                text: t.notConfigured
            });
        }
        
        try {
            await sock.sendMessage(from, { text: t.fetching });
            
            const untis = new WebUntisAnonymousAuth(
                SCHOOL_CONFIG.school,
                SCHOOL_CONFIG.server
            );
            
            await untis.login();
            
            // Get all teachers
            const allTeachers = await untis.getTeachers();
            
            // Find MARCHESE
            const marchese = allTeachers.find(teacher => 
                teacher.name === 'MARC_E' || 
                teacher.longName?.includes('MARCHESE')
            );
            
            let debugText = '🔍 DEBUG INFO - Teachers\n\n';
            
            if (marchese) {
                debugText += `${t.found}\n`;
                debugText += `- id: ${marchese.id}\n`;
                debugText += `- name: ${marchese.name}\n`;
                debugText += `- longName: ${marchese.longName}\n`;
                debugText += `- foreName: ${marchese.foreName}\n`;
                debugText += `- title: ${marchese.title}\n\n`;
            }
            
            debugText += `${t.first5}\n`;
            for (let i = 0; i < Math.min(5, allTeachers.length); i++) {
                const teacher = allTeachers[i];
                debugText += `\n${i+1}. ${teacher.longName || teacher.name}\n`;
                debugText += `   name: ${teacher.name}\n`;
                debugText += `   longName: ${teacher.longName}\n`;
                debugText += `   foreName: ${teacher.foreName}\n`;
            }
            
            await untis.logout();
            
            await sock.sendMessage(from, { text: debugText });
            
        } catch (error) {
            await sock.sendMessage(from, {
                text: `${t.error} ${error.message}`
            });
        }
    }
};
