import { getGroupLanguage } from '../../utils/language.js';
import { WebUntisAnonymousAuth } from 'webuntis';

const responses = {
    en: {
        usage: 'Usage: .testuntis <school> <server>\n\nExample: .testuntis "ITI Marconi" borione.webuntis.com\n\nCommon Italian servers:\n- borione.webuntis.com\n- tipo.webuntis.com\n- mese.webuntis.com\n- ajax.webuntis.com',
        testing: '🔍 Testing connection...\n\nSchool:',
        server: 'Server:',
        success: '✅ Connection successful!\n\nFound',
        classes: 'classes:',
        andMore: '... and',
        moreClasses: 'more classes',
        failed: '❌ Connection failed!\n\nError:',
        tryDifferent: '\n\n💡 Try a different school name or server.'
    },
    it: {
        usage: 'Uso: .testuntis <scuola> <server>\n\nEsempio: .testuntis "ITI Marconi" borione.webuntis.com\n\nServer italiani comuni:\n- borione.webuntis.com\n- tipo.webuntis.com\n- mese.webuntis.com\n- ajax.webuntis.com',
        testing: '🔍 Test connessione...\n\nScuola:',
        server: 'Server:',
        success: '✅ Connessione riuscita!\n\nTrovate',
        classes: 'classi:',
        andMore: '... e',
        moreClasses: 'altre classi',
        failed: '❌ Connessione fallita!\n\nErrore:',
        tryDifferent: '\n\n💡 Prova un nome scuola o server diverso.'
    },
    ru: {
        usage: 'Использование: .testuntis <школа> <сервер>\n\nПример: .testuntis "ITI Marconi" borione.webuntis.com\n\nОбщие итальянские серверы:\n- borione.webuntis.com\n- tipo.webuntis.com\n- mese.webuntis.com\n- ajax.webuntis.com',
        testing: '🔍 Тестирование соединения...\n\nШкола:',
        server: 'Сервер:',
        success: '✅ Соединение успешно!\n\nНайдено',
        classes: 'классов:',
        andMore: '... и',
        moreClasses: 'больше классов',
        failed: '❌ Соединение не удалось!\n\nОшибка:',
        tryDifferent: '\n\n💡 Попробуйте другое название школы или сервер.'
    },
    es: {
        usage: 'Uso: .testuntis <escuela> <servidor>\n\nEjemplo: .testuntis "ITI Marconi" borione.webuntis.com\n\nServidores italianos comunes:\n- borione.webuntis.com\n- tipo.webuntis.com\n- mese.webuntis.com\n- ajax.webuntis.com',
        testing: '🔍 Probando conexión...\n\nEscuela:',
        server: 'Servidor:',
        success: '✅ ¡Conexión exitosa!\n\nEncontradas',
        classes: 'clases:',
        andMore: '... y',
        moreClasses: 'más clases',
        failed: '❌ ¡Conexión fallida!\n\nError:',
        tryDifferent: '\n\n💡 Prueba un nombre de escuela o servidor diferente.'
    },
    pt: {
        usage: 'Uso: .testuntis <escola> <servidor>\n\nExemplo: .testuntis "ITI Marconi" borione.webuntis.com\n\nServidores italianos comuns:\n- borione.webuntis.com\n- tipo.webuntis.com\n- mese.webuntis.com\n- ajax.webuntis.com',
        testing: '🔍 Testando conexão...\n\nEscola:',
        server: 'Servidor:',
        success: '✅ Conexão bem-sucedida!\n\nEncontradas',
        classes: 'turmas:',
        andMore: '... e',
        moreClasses: 'mais turmas',
        failed: '❌ Conexão falhou!\n\nErro:',
        tryDifferent: '\n\n💡 Tente um nome de escola ou servidor diferente.'
    },
    ar: {
        usage: 'الاستخدام: .testuntis <مدرسة> <سيرفر>\n\nمثال: .testuntis "ITI Marconi" borione.webuntis.com\n\nسيرفرات إيطالية شائعة:\n- borione.webuntis.com\n- tipo.webuntis.com\n- mese.webuntis.com\n- ajax.webuntis.com',
        testing: '🔍 بنختبر الاتصال...\n\nالمدرسة:',
        server: 'السيرفر:',
        success: '✅ الاتصال نجح!\n\nلقينا',
        classes: 'فصول:',
        andMore: '... و',
        moreClasses: 'فصول أكتر',
        failed: '❌ الاتصال فشل!\n\nالخطأ:',
        tryDifferent: '\n\n💡 جرب اسم مدرسة أو سيرفر تاني.'
    },
    hi: {
        usage: 'उपयोग: .testuntis <स्कूल> <सर्वर>\n\nउदाहरण: .testuntis "ITI Marconi" borione.webuntis.com\n\nसामान्य इटालियन सर्वर:\n- borione.webuntis.com\n- tipo.webuntis.com\n- mese.webuntis.com\n- ajax.webuntis.com',
        testing: '🔍 कनेक्शन टेस्ट कर रहे हैं...\n\nस्कूल:',
        server: 'सर्वर:',
        success: '✅ कनेक्शन सफल!\n\nमिले',
        classes: 'क्लासेस:',
        andMore: '... और',
        moreClasses: 'और क्लासेस',
        failed: '❌ कनेक्शन विफल!\n\nएरर:',
        tryDifferent: '\n\n💡 अलग स्कूल नाम या सर्वर आज़माएं।'
    }
};

export default {
    name: 'testuntis',
    ownerOnly: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        if (args.length < 2) {
            return await sock.sendMessage(from, {
                text: t.usage
            });
        }
        
        const school = args[0];
        const server = args[1];
        
        try {
            await sock.sendMessage(from, {
                text: `${t.testing} ${school}\n${t.server} ${server}`
            });
            
            const untis = new WebUntisAnonymousAuth(school, server);
            await untis.login();
            
            const classes = await untis.getClasses();
            await untis.logout();
            
            let response = `${t.success} ${classes.length} ${t.classes}\n\n`;
            
            // Show first 20 classes
            const displayClasses = classes.slice(0, 20);
            for (const c of displayClasses) {
                response += `- ${c.name} (ID: ${c.id})\n`;
            }
            
            if (classes.length > 20) {
                response += `\n${t.andMore} ${classes.length - 20} ${t.moreClasses}`;
            }
            
            await sock.sendMessage(from, { text: response });
            
        } catch (error) {
            await sock.sendMessage(from, {
                text: `${t.failed} ${error.message}${t.tryDifferent}`
            });
        }
    }
};
