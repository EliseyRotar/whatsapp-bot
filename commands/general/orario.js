import { getGroupLanguage } from '../../utils/language.js';
import { getGroupClass } from '../../utils/orarioConfig.js';
import { getTeacherFullName } from '../../utils/teacherNames.js';
import { WebUntisAnonymousAuth, WebUntisElementType } from 'webuntis';

const responses = {
    en: {
        usage: '📅 Class Schedule\n\nGet your class timetable!\n\nUsage:\n.orario - Today\'s schedule\n.orario today - Today\'s schedule\n.orario tomorrow - Tomorrow\'s schedule\n.orario yesterday - Yesterday\'s schedule\n.orario <date> - Specific date (YYYY-MM-DD)\n\n⚙️ Setup: Use .setorario <class> to configure your class',
        loading: '⏳ Loading schedule...',
        noLessons: '✅ No lessons scheduled for this day!',
        error: '❌ Failed to fetch schedule:',
        invalidDate: '❌ Invalid date format! Use YYYY-MM-DD (e.g., 2026-02-17)',
        title: '📅 Class Schedule - 4BI',
        date: 'Date:',
        lesson: 'Lesson',
        time: 'Time:',
        subject: 'Subject:',
        teacher: 'Teacher:',
        room: 'Room:',
        noTeacher: 'No teacher',
        noRoom: 'No room',
        weekend: '🎉 It\'s the weekend! No school!',
        holiday: '🎉 Holiday! No school!',
        notConfigured: '⚠️ Class not configured!\n\nUse .setorario <class> to set up your class first.\n\nExample: .setorario 4Bi'
    },
    it: {
        usage: '📅 Orario Scolastico\n\nOttieni l\'orario delle lezioni!\n\nUso:\n.orario - Orario di oggi\n.orario oggi - Orario di oggi\n.orario domani - Orario di domani\n.orario ieri - Orario di ieri\n.orario <data> - Data specifica (YYYY-MM-DD)\n\n⚙️ Configurazione: Usa .setorario <classe> per configurare la tua classe',
        loading: '⏳ Caricamento orario...',
        noLessons: '✅ Nessuna lezione programmata per questo giorno!',
        error: '❌ Impossibile recuperare l\'orario:',
        invalidDate: '❌ Formato data non valido! Usa YYYY-MM-DD (es. 2026-02-17)',
        title: '📅 Orario Scolastico - 4BI',
        date: 'Data:',
        lesson: 'Lezione',
        time: 'Orario:',
        subject: 'Materia:',
        teacher: 'Docente:',
        room: 'Aula:',
        noTeacher: 'Nessun docente',
        noRoom: 'Nessuna aula',
        weekend: '🎉 È il weekend! Niente scuola!',
        holiday: '🎉 Vacanza! Niente scuola!',
        notConfigured: '⚠️ Classe non configurata!\n\nUsa .setorario <classe> per configurare prima la tua classe.\n\nEsempio: .setorario 4Bi'
    },
    ru: {
        usage: '📅 Расписание занятий\n\nПолучите расписание уроков!\n\nИспользование:\n.orario - Расписание на сегодня\n.orario today - Расписание на сегодня\n.orario tomorrow - Расписание на завтра\n.orario yesterday - Расписание на вчера\n.orario <дата> - Конкретная дата (YYYY-MM-DD)',
        loading: '⏳ Загрузка расписания...',
        noLessons: '✅ На этот день уроков не запланировано!',
        error: '❌ Не удалось получить расписание:',
        invalidDate: '❌ Неверный формат даты! Используйте YYYY-MM-DD (например, 2026-02-17)',
        title: '📅 Расписание занятий - 4BI',
        date: 'Дата:',
        lesson: 'Урок',
        time: 'Время:',
        subject: 'Предмет:',
        teacher: 'Учитель:',
        room: 'Кабинет:',
        noTeacher: 'Нет учителя',
        noRoom: 'Нет кабинета',
        weekend: '🎉 Выходные! Школы нет!',
        holiday: '🎉 Праздник! Школы нет!'
    },
    es: {
        usage: '📅 Horario Escolar\n\n¡Obtén tu horario de clases!\n\nUso:\n.orario - Horario de hoy\n.orario today - Horario de hoy\n.orario tomorrow - Horario de mañana\n.orario yesterday - Horario de ayer\n.orario <fecha> - Fecha específica (YYYY-MM-DD)',
        loading: '⏳ Cargando horario...',
        noLessons: '✅ ¡No hay clases programadas para este día!',
        error: '❌ Error al obtener el horario:',
        invalidDate: '❌ ¡Formato de fecha inválido! Usa YYYY-MM-DD (ej. 2026-02-17)',
        title: '📅 Horario Escolar - 4BI',
        date: 'Fecha:',
        lesson: 'Clase',
        time: 'Hora:',
        subject: 'Materia:',
        teacher: 'Profesor:',
        room: 'Aula:',
        noTeacher: 'Sin profesor',
        noRoom: 'Sin aula',
        weekend: '🎉 ¡Es fin de semana! ¡No hay escuela!',
        holiday: '🎉 ¡Vacaciones! ¡No hay escuela!'
    },
    pt: {
        usage: '📅 Horário Escolar\n\nObtenha seu horário de aulas!\n\nUso:\n.orario - Horário de hoje\n.orario today - Horário de hoje\n.orario tomorrow - Horário de amanhã\n.orario yesterday - Horário de ontem\n.orario <data> - Data específica (YYYY-MM-DD)',
        loading: '⏳ Carregando horário...',
        noLessons: '✅ Nenhuma aula agendada para este dia!',
        error: '❌ Falha ao buscar horário:',
        invalidDate: '❌ Formato de data inválido! Use YYYY-MM-DD (ex. 2026-02-17)',
        title: '📅 Horário Escolar - 4BI',
        date: 'Data:',
        lesson: 'Aula',
        time: 'Horário:',
        subject: 'Matéria:',
        teacher: 'Professor:',
        room: 'Sala:',
        noTeacher: 'Sem professor',
        noRoom: 'Sem sala',
        weekend: '🎉 É fim de semana! Sem escola!',
        holiday: '🎉 Feriado! Sem escola!'
    },
    ar: {
        usage: '📅 جدول الحصص\n\nاحصل على جدول حصصك!\n\nالاستخدام:\n.orario - جدول اليوم\n.orario today - جدول اليوم\n.orario tomorrow - جدول الغد\n.orario yesterday - جدول الأمس\n.orario <تاريخ> - تاريخ محدد (YYYY-MM-DD)',
        loading: '⏳ تحميل الجدول...',
        noLessons: '✅ لا توجد حصص مجدولة لهذا اليوم!',
        error: '❌ فشل في جلب الجدول:',
        invalidDate: '❌ صيغة تاريخ غير صالحة! استخدم YYYY-MM-DD (مثال: 2026-02-17)',
        title: '📅 جدول الحصص - 4BI',
        date: 'التاريخ:',
        lesson: 'الحصة',
        time: 'الوقت:',
        subject: 'المادة:',
        teacher: 'المعلم:',
        room: 'الغرفة:',
        noTeacher: 'لا يوجد معلم',
        noRoom: 'لا توجد غرفة',
        weekend: '🎉 إنه عطلة نهاية الأسبوع! لا مدرسة!',
        holiday: '🎉 عطلة! لا مدرسة!'
    },
    hi: {
        usage: '📅 क्लास शेड्यूल\n\nअपना क्लास टाइमटेबल प्राप्त करें!\n\nउपयोग:\n.orario - आज का शेड्यूल\n.orario today - आज का शेड्यूल\n.orario tomorrow - कल का शेड्यूल\n.orario yesterday - कल का शेड्यूल\n.orario <तारीख> - विशिष्ट तारीख (YYYY-MM-DD)\n\n⚙️ सेटअप: अपनी क्लास कॉन्फ़िगर करने के लिए .setorario <class> का उपयोग करें',
        loading: '⏳ शेड्यूल लोड हो रहा है...',
        noLessons: '✅ इस दिन के लिए कोई लेसन शेड्यूल नहीं है!',
        error: '❌ शेड्यूल फेच करने में विफल:',
        invalidDate: '❌ अमान्य तारीख फॉर्मेट! YYYY-MM-DD का उपयोग करें (उदा. 2026-02-17)',
        title: '📅 क्लास शेड्यूल - 4BI',
        date: 'तारीख:',
        lesson: 'लेसन',
        time: 'समय:',
        subject: 'विषय:',
        teacher: 'टीचर:',
        room: 'रूम:',
        noTeacher: 'कोई टीचर नहीं',
        noRoom: 'कोई रूम नहीं',
        weekend: '🎉 यह वीकेंड है! कोई स्कूल नहीं!',
        holiday: '🎉 छुट्टी! कोई स्कूल नहीं!',
        notConfigured: '⚠️ क्लास कॉन्फ़िगर नहीं है!\n\nपहले अपनी क्लास सेट करने के लिए .setorario <class> का उपयोग करें।\n\nउदाहरण: .setorario 4Bi'
    }
};

// Configuration for your school
const SCHOOL_CONFIG = {
    school: 'marconi',
    server: 'marconi.webuntis.com'
};

export default {
    name: 'orario',
    aliases: ['schedule', 'timetable'],
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        try {
            // Check if class is configured for this group
            const className = getGroupClass(from);
            
            if (!className) {
                return await sock.sendMessage(from, {
                    text: t.notConfigured
                });
            }
            
            // Parse date argument
            let targetDate = new Date();
            const arg = args[0]?.toLowerCase();
            
            if (arg === 'domani' || arg === 'tomorrow') {
                targetDate.setDate(targetDate.getDate() + 1);
            } else if (arg === 'ieri' || arg === 'yesterday') {
                targetDate.setDate(targetDate.getDate() - 1);
            } else if (arg === 'oggi' || arg === 'today' || !arg) {
                // Keep today's date
            } else if (arg && arg.match(/^\d{4}-\d{2}-\d{2}$/)) {
                targetDate = new Date(arg);
                if (isNaN(targetDate.getTime())) {
                    return await sock.sendMessage(from, { text: t.invalidDate });
                }
            } else if (arg) {
                return await sock.sendMessage(from, { text: t.usage });
            }
            
            // Check if weekend
            const dayOfWeek = targetDate.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                return await sock.sendMessage(from, { text: t.weekend });
            }
            
            // Send loading message
            const loadingMsg = await sock.sendMessage(from, { text: t.loading });
            
            // Initialize WebUntis
            const untis = new WebUntisAnonymousAuth(
                SCHOOL_CONFIG.school,
                SCHOOL_CONFIG.server
            );
            
            await untis.login();
            
            // Get all classes
            const classes = await untis.getClasses();
            
            // Find the specific class
            const targetClass = classes.find(c => 
                c.name === className || 
                c.longName === className
            );
            
            if (!targetClass) {
                await untis.logout();
                return await sock.sendMessage(from, {
                    text: `${t.error} Class ${className} not found.\n\n💡 Use .setorario to reconfigure your class.`,
                    edit: loadingMsg.key
                });
            }
            
            // Get timetable for the specific date
            const timetable = await untis.getTimetableFor(
                targetDate,
                targetClass.id,
                WebUntisElementType.CLASS
            );
            
            await untis.logout();
            
            // Format date
            const dateStr = targetDate.toLocaleDateString(lang === 'it' ? 'it-IT' : 'en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            // Check if there are lessons
            if (!timetable || timetable.length === 0) {
                return await sock.sendMessage(from, {
                    text: `${t.title}\n📅 ${dateStr}\n\n${t.noLessons}`,
                    edit: loadingMsg.key
                });
            }
            
            // Group lessons by time slot
            const lessonsByTime = {};
            
            for (const lesson of timetable) {
                const timeKey = `${lesson.startTime}-${lesson.endTime}`;
                
                if (!lessonsByTime[timeKey]) {
                    lessonsByTime[timeKey] = {
                        startTime: lesson.startTime,
                        endTime: lesson.endTime,
                        subjects: [],
                        teachers: [],
                        rooms: []
                    };
                }
                
                // Get subject name
                const subjects = lesson.su || [];
                if (subjects.length > 0) {
                    const subjectName = subjects[0].longname || subjects[0].name;
                    if (!lessonsByTime[timeKey].subjects.includes(subjectName)) {
                        lessonsByTime[timeKey].subjects.push(subjectName);
                    }
                }
                
                // Get teacher name
                const teachers = lesson.te || [];
                if (teachers.length > 0) {
                    // Get surname from API and look up full name
                    const surname = teachers[0].longname || teachers[0].name;
                    const fullName = getTeacherFullName(surname);
                    if (!lessonsByTime[timeKey].teachers.includes(fullName)) {
                        lessonsByTime[timeKey].teachers.push(fullName);
                    }
                }
                
                // Get room
                const rooms = lesson.ro || [];
                if (rooms.length > 0) {
                    const roomName = rooms[0].longname || rooms[0].name;
                    if (!lessonsByTime[timeKey].rooms.includes(roomName)) {
                        lessonsByTime[timeKey].rooms.push(roomName);
                    }
                }
            }
            
            // Sort by start time
            const sortedTimes = Object.keys(lessonsByTime).sort((a, b) => {
                return lessonsByTime[a].startTime - lessonsByTime[b].startTime;
            });
            
            // Format timetable with improved UI
            let scheduleText = `╔═══════════════════════════╗\n`;
            scheduleText += `║  📅 ${lang === 'it' ? 'ORARIO' : 'SCHEDULE'} - ${className}  ║\n`;
            scheduleText += `╚═══════════════════════════╝\n\n`;
            scheduleText += `📆 ${dateStr}\n`;
            scheduleText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
            
            for (let i = 0; i < sortedTimes.length; i++) {
                const timeKey = sortedTimes[i];
                const slot = lessonsByTime[timeKey];
                
                // Format time
                const startTime = String(slot.startTime).padStart(4, '0');
                const endTime = String(slot.endTime).padStart(4, '0');
                const timeStr = `${startTime.slice(0, 2)}:${startTime.slice(2)} - ${endTime.slice(0, 2)}:${endTime.slice(2)}`;
                
                // Lesson number
                scheduleText += `🕐 ${i + 1}ª ${lang === 'it' ? 'ORA' : 'HOUR'} │ ${timeStr}\n`;
                scheduleText += `├─────────────────────────\n`;
                
                // Subjects
                if (slot.subjects.length > 0) {
                    scheduleText += `│ 📚 ${slot.subjects.join(' / ')}\n`;
                }
                
                // Teachers
                if (slot.teachers.length > 0) {
                    scheduleText += `│ 👨‍🏫 ${slot.teachers.join(' / ')}\n`;
                }
                
                // Rooms
                if (slot.rooms.length > 0) {
                    scheduleText += `│ 🚪 ${slot.rooms.join(' / ')}\n`;
                } else {
                    scheduleText += `│ 🚪 ${t.noRoom}\n`;
                }
                
                scheduleText += `└─────────────────────────\n`;
                
                // Add spacing between lessons
                if (i < sortedTimes.length - 1) {
                    scheduleText += `\n`;
                }
            }
            
            scheduleText += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
            scheduleText += `📊 ${lang === 'it' ? 'Totale' : 'Total'}: ${sortedTimes.length} ${lang === 'it' ? 'ore' : 'hours'}`;
            
            // Send schedule
            await sock.sendMessage(from, {
                text: scheduleText,
                edit: loadingMsg.key
            });
            
        } catch (error) {
            console.error('[ORARIO] Error:', error.message);
            console.error('[ORARIO] Stack:', error.stack);
            
            let errorMsg = `${t.error} ${error.message}`;
            
            // Provide helpful error messages
            if (error.message.includes('school not found')) {
                errorMsg += `\n\n💡 Tip: The school name or server might be incorrect. Try checking the WebUntis website.`;
            } else if (error.message.includes('network') || error.message.includes('ENOTFOUND')) {
                errorMsg += `\n\n💡 Tip: Check your internet connection or the WebUntis server might be down.`;
            }
            
            await sock.sendMessage(from, { 
                text: errorMsg
            });
        }
    }
};
