import { getGroupLanguage } from '../../utils/language.js';
import { getTeacherFullName, setTeacherName, removeTeacherName, getAllTeachers } from '../../utils/teacherNames.js';

const responses = {
    en: {
        usage: '👨‍🏫 Teacher Names Manager\n\nManage teacher full names for the schedule.\n\nUsage:\n.teacher - List all teachers\n.teacher <SURNAME> - Show full name\n.teacher <SURNAME> <FULL NAME> - Set full name\n.teacher remove <SURNAME> - Remove teacher\n\nExample:\n.teacher TEANI TEANI LARISSA',
        list: '👨‍🏫 Teacher Names\n\nConfigured teachers:',
        notFound: '❌ Teacher not found: {surname}',
        current: '👨‍🏫 Teacher: {surname}\n\nFull name: {fullname}',
        added: '✅ Teacher added!\n\nSurname: {surname}\nFull name: {fullname}',
        removed: '✅ Teacher removed: {surname}',
        empty: '⚠️ No teachers configured yet.\n\nUse .teacher <SURNAME> <FULL NAME> to add teachers.',
        ownerOnly: '❌ Only the bot owner can manage teacher names.'
    },
    it: {
        usage: '👨‍🏫 Gestione Nomi Docenti\n\nGestisci i nomi completi dei docenti per l\'orario.\n\nUso:\n.teacher - Elenca tutti i docenti\n.teacher <COGNOME> - Mostra nome completo\n.teacher <COGNOME> <NOME COMPLETO> - Imposta nome completo\n.teacher remove <COGNOME> - Rimuovi docente\n\nEsempio:\n.teacher TEANI TEANI LARISSA',
        list: '👨‍🏫 Nomi Docenti\n\nDocenti configurati:',
        notFound: '❌ Docente non trovato: {surname}',
        current: '👨‍🏫 Docente: {surname}\n\nNome completo: {fullname}',
        added: '✅ Docente aggiunto!\n\nCognome: {surname}\nNome completo: {fullname}',
        removed: '✅ Docente rimosso: {surname}',
        empty: '⚠️ Nessun docente configurato.\n\nUsa .teacher <COGNOME> <NOME COMPLETO> per aggiungere docenti.',
        ownerOnly: '❌ Solo il proprietario del bot può gestire i nomi dei docenti.'
    },
    ru: {
        usage: '👨‍🏫 Управление именами учителей\n\nУправляйте полными именами учителей для расписания.\n\nИспользование:\n.teacher - Список всех учителей\n.teacher <ФАМИЛИЯ> - Показать полное имя\n.teacher <ФАМИЛИЯ> <ПОЛНОЕ ИМЯ> - Установить полное имя\n.teacher remove <ФАМИЛИЯ> - Удалить учителя\n\nПример:\n.teacher TEANI TEANI LARISSA',
        list: '👨‍🏫 Имена учителей\n\nНастроенные учителя:',
        notFound: '❌ Учитель не найден: {surname}',
        current: '👨‍🏫 Учитель: {surname}\n\nПолное имя: {fullname}',
        added: '✅ Учитель добавлен!\n\nФамилия: {surname}\nПолное имя: {fullname}',
        removed: '✅ Учитель удален: {surname}',
        empty: '⚠️ Учителя не настроены.\n\nИспользуйте .teacher <ФАМИЛИЯ> <ПОЛНОЕ ИМЯ> для добавления учителей.',
        ownerOnly: '❌ Только владелец бота может управлять именами учителей.'
    },
    es: {
        usage: '👨‍🏫 Gestor de Nombres de Profesores\n\nGestiona los nombres completos de los profesores para el horario.\n\nUso:\n.teacher - Listar todos los profesores\n.teacher <APELLIDO> - Mostrar nombre completo\n.teacher <APELLIDO> <NOMBRE COMPLETO> - Establecer nombre completo\n.teacher remove <APELLIDO> - Eliminar profesor\n\nEjemplo:\n.teacher TEANI TEANI LARISSA',
        list: '👨‍🏫 Nombres de Profesores\n\nProfesores configurados:',
        notFound: '❌ Profesor no encontrado: {surname}',
        current: '👨‍🏫 Profesor: {surname}\n\nNombre completo: {fullname}',
        added: '✅ ¡Profesor agregado!\n\nApellido: {surname}\nNombre completo: {fullname}',
        removed: '✅ Profesor eliminado: {surname}',
        empty: '⚠️ No hay profesores configurados.\n\nUsa .teacher <APELLIDO> <NOMBRE COMPLETO> para agregar profesores.',
        ownerOnly: '❌ Solo el propietario del bot puede gestionar los nombres de los profesores.'
    },
    pt: {
        usage: '👨‍🏫 Gerenciador de Nomes de Professores\n\nGerencie os nomes completos dos professores para o horário.\n\nUso:\n.teacher - Listar todos os professores\n.teacher <SOBRENOME> - Mostrar nome completo\n.teacher <SOBRENOME> <NOME COMPLETO> - Definir nome completo\n.teacher remove <SOBRENOME> - Remover professor\n\nExemplo:\n.teacher TEANI TEANI LARISSA',
        list: '👨‍🏫 Nomes de Professores\n\nProfessores configurados:',
        notFound: '❌ Professor não encontrado: {surname}',
        current: '👨‍🏫 Professor: {surname}\n\nNome completo: {fullname}',
        added: '✅ Professor adicionado!\n\nSobrenome: {surname}\nNome completo: {fullname}',
        removed: '✅ Professor removido: {surname}',
        empty: '⚠️ Nenhum professor configurado.\n\nUse .teacher <SOBRENOME> <NOME COMPLETO> para adicionar professores.',
        ownerOnly: '❌ Apenas o dono do bot pode gerenciar os nomes dos professores.'
    },
    ar: {
        usage: '👨‍🏫 مدير أسماء المعلمين\n\nإدارة الأسماء الكاملة للمعلمين للجدول.\n\nالاستخدام:\n.teacher - قائمة جميع المعلمين\n.teacher <اللقب> - عرض الاسم الكامل\n.teacher <اللقب> <الاسم الكامل> - تعيين الاسم الكامل\n.teacher remove <اللقب> - إزالة المعلم\n\nمثال:\n.teacher TEANI TEANI LARISSA',
        list: '👨‍🏫 أسماء المعلمين\n\nالمعلمون المكونون:',
        notFound: '❌ المعلم غير موجود: {surname}',
        current: '👨‍🏫 المعلم: {surname}\n\nالاسم الكامل: {fullname}',
        added: '✅ تمت إضافة المعلم!\n\nاللقب: {surname}\nالاسم الكامل: {fullname}',
        removed: '✅ تمت إزالة المعلم: {surname}',
        empty: '⚠️ لم يتم تكوين معلمين.\n\nاستخدم .teacher <اللقب> <الاسم الكامل> لإضافة معلمين.',
        ownerOnly: '❌ المالك فقط يمكنه إدارة أسماء المعلمين.'
    },
    hi: {
        usage: '👨‍🏫 टीचर नेम मैनेजर\n\nशेड्यूल के लिए टीचर के पूरे नाम मैनेज करें।\n\nउपयोग:\n.teacher - सभी टीचर की लिस्ट\n.teacher <सरनेम> - पूरा नाम दिखाएं\n.teacher <सरनेम> <पूरा नाम> - पूरा नाम सेट करें\n.teacher remove <सरनेम> - टीचर हटाएं\n\nउदाहरण:\n.teacher TEANI TEANI LARISSA',
        list: '👨‍🏫 टीचर नेम\n\nकॉन्फ़िगर किए गए टीचर:',
        notFound: '❌ टीचर नहीं मिला: {surname}',
        current: '👨‍🏫 टीचर: {surname}\n\nपूरा नाम: {fullname}',
        added: '✅ टीचर जोड़ा गया!\n\nसरनेम: {surname}\nपूरा नाम: {fullname}',
        removed: '✅ टीचर हटाया गया: {surname}',
        empty: '⚠️ अभी तक कोई टीचर कॉन्फ़िगर नहीं किया गया।\n\nटीचर जोड़ने के लिए .teacher <सरनेम> <पूरा नाम> का उपयोग करें।',
        ownerOnly: '❌ केवल बॉट ओनर ही टीचर नेम मैनेज कर सकते हैं।'
    }
};

export default {
    name: 'teacher',
    aliases: ['docente', 'prof'],
    ownerOnly: true,
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        try {
            // No arguments - list all teachers
            if (args.length === 0) {
                const teachers = getAllTeachers();
                const teacherList = Object.entries(teachers);
                
                if (teacherList.length === 0) {
                    return await sock.sendMessage(from, {
                        text: t.empty
                    });
                }
                
                let listText = `${t.list}\n\n`;
                for (const [surname, fullname] of teacherList) {
                    listText += `• ${surname} → ${fullname}\n`;
                }
                listText += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
                listText += `📊 ${lang === 'it' ? 'Totale' : 'Total'}: ${teacherList.length} ${lang === 'it' ? 'docenti' : 'teachers'}`;
                
                return await sock.sendMessage(from, {
                    text: listText
                });
            }
            
            // Remove teacher
            if (args[0].toLowerCase() === 'remove' && args[1]) {
                const surname = args[1].toUpperCase();
                removeTeacherName(surname);
                
                return await sock.sendMessage(from, {
                    text: t.removed.replace('{surname}', surname)
                });
            }
            
            // Show or set teacher
            const surname = args[0].toUpperCase();
            
            // Only surname - show current name
            if (args.length === 1) {
                const fullname = getTeacherFullName(surname);
                
                return await sock.sendMessage(from, {
                    text: t.current.replace('{surname}', surname).replace('{fullname}', fullname)
                });
            }
            
            // Surname + full name - set teacher
            const fullname = args.slice(1).join(' ').toUpperCase();
            setTeacherName(surname, fullname);
            
            await sock.sendMessage(from, {
                text: t.added.replace('{surname}', surname).replace('{fullname}', fullname)
            });
            
        } catch (error) {
            console.error('[TEACHER] Error:', error.message);
            await sock.sendMessage(from, {
                text: `❌ Error: ${error.message}`
            });
        }
    }
};
