import { config } from '../../config.js';
import os from 'os';
import { getGroupLanguage } from '../../utils/language.js';
import { sendAsChannelForward } from '../../utils/fakeForward.js';

const responses = {
    en: {
        title: '📊 BOT STATISTICS',
        serverInfo: '🖥️ SERVER INFO',
        botInfo: '🤖 BOT INFO',
        performance: '⚡ PERFORMANCE',
        system: '💻 SYSTEM',
        
        // Server info
        hostname: 'Hostname:',
        platform: 'Platform:',
        arch: 'Architecture:',
        cpuModel: 'CPU:',
        cpuCores: 'CPU Cores:',
        cpuSpeed: 'CPU Speed:',
        
        // Bot info
        botName: 'Bot Name:',
        owner: 'Owner:',
        prefix: 'Prefix:',
        mode: 'Mode:',
        uptime: 'Uptime:',
        nodejs: 'Node.js:',
        
        // Performance
        memoryUsage: 'Memory Usage:',
        memoryTotal: 'Total Memory:',
        memoryFree: 'Free Memory:',
        memoryPercent: 'Memory Used:',
        cpuUsage: 'CPU Usage:',
        loadAverage: 'Load Average:',
        
        // System
        osType: 'OS Type:',
        osRelease: 'OS Release:',
        totalRAM: 'Total RAM:',
        freeRAM: 'Free RAM:',
        
        // Additional
        processMemory: 'Process Memory:',
        heapUsed: 'Heap Used:',
        heapTotal: 'Heap Total:',
        external: 'External:',
        
        footer: '\n💡 Stats refresh in real-time'
    },
    it: {
        title: '📊 STATISTICHE BOT',
        serverInfo: '🖥️ INFO SERVER',
        botInfo: '🤖 INFO BOT',
        performance: '⚡ PRESTAZIONI',
        system: '💻 SISTEMA',
        
        // Server info
        hostname: 'Hostname:',
        platform: 'Piattaforma:',
        arch: 'Architettura:',
        cpuModel: 'CPU:',
        cpuCores: 'Core CPU:',
        cpuSpeed: 'Velocità CPU:',
        
        // Bot info
        botName: 'Nome Bot:',
        owner: 'Proprietario:',
        prefix: 'Prefisso:',
        mode: 'Modalità:',
        uptime: 'Tempo attivo:',
        nodejs: 'Node.js:',
        
        // Performance
        memoryUsage: 'Uso Memoria:',
        memoryTotal: 'Memoria Totale:',
        memoryFree: 'Memoria Libera:',
        memoryPercent: 'Memoria Usata:',
        cpuUsage: 'Uso CPU:',
        loadAverage: 'Carico Medio:',
        
        // System
        osType: 'Tipo OS:',
        osRelease: 'Release OS:',
        totalRAM: 'RAM Totale:',
        freeRAM: 'RAM Libera:',
        
        // Additional
        processMemory: 'Memoria Processo:',
        heapUsed: 'Heap Usato:',
        heapTotal: 'Heap Totale:',
        external: 'Esterno:',
        
        footer: '\n💡 Le statistiche si aggiornano in tempo reale'
    },
    ru: {
        title: '📊 СТАТИСТИКА БОТА',
        serverInfo: '🖥️ ИНФОРМАЦИЯ О СЕРВЕРЕ',
        botInfo: '🤖 ИНФОРМАЦИЯ О БОТЕ',
        performance: '⚡ ПРОИЗВОДИТЕЛЬНОСТЬ',
        system: '💻 СИСТЕМА',
        
        // Server info
        hostname: 'Имя хоста:',
        platform: 'Платформа:',
        arch: 'Архитектура:',
        cpuModel: 'Процессор:',
        cpuCores: 'Ядер процессора:',
        cpuSpeed: 'Частота процессора:',
        
        // Bot info
        botName: 'Имя бота:',
        owner: 'Владелец:',
        prefix: 'Префикс:',
        mode: 'Режим:',
        uptime: 'Время работы:',
        nodejs: 'Node.js:',
        
        // Performance
        memoryUsage: 'Использование памяти:',
        memoryTotal: 'Всего памяти:',
        memoryFree: 'Свободной памяти:',
        memoryPercent: 'Использовано памяти:',
        cpuUsage: 'Использование процессора:',
        loadAverage: 'Средняя нагрузка:',
        
        // System
        osType: 'Тип ОС:',
        osRelease: 'Версия ОС:',
        totalRAM: 'Всего RAM:',
        freeRAM: 'Свободно RAM:',
        
        // Additional
        processMemory: 'Память процесса:',
        heapUsed: 'Использовано кучи:',
        heapTotal: 'Всего кучи:',
        external: 'Внешняя:',
        
        footer: '\n💡 Статистика обновляется в реальном времени'
    },
    es: {
        title: '📊 ESTADÍSTICAS DEL BOT',
        serverInfo: '🖥️ INFO DEL SERVIDOR',
        botInfo: '🤖 INFO DEL BOT',
        performance: '⚡ RENDIMIENTO',
        system: '💻 SISTEMA',
        
        // Server info
        hostname: 'Nombre del host:',
        platform: 'Plataforma:',
        arch: 'Arquitectura:',
        cpuModel: 'CPU:',
        cpuCores: 'Núcleos de CPU:',
        cpuSpeed: 'Velocidad de CPU:',
        
        // Bot info
        botName: 'Nombre del Bot:',
        owner: 'Propietario:',
        prefix: 'Prefijo:',
        mode: 'Modo:',
        uptime: 'Tiempo activo:',
        nodejs: 'Node.js:',
        
        // Performance
        memoryUsage: 'Uso de Memoria:',
        memoryTotal: 'Memoria Total:',
        memoryFree: 'Memoria Libre:',
        memoryPercent: 'Memoria Usada:',
        cpuUsage: 'Uso de CPU:',
        loadAverage: 'Carga Promedio:',
        
        // System
        osType: 'Tipo de SO:',
        osRelease: 'Versión de SO:',
        totalRAM: 'RAM Total:',
        freeRAM: 'RAM Libre:',
        
        // Additional
        processMemory: 'Memoria del Proceso:',
        heapUsed: 'Heap Usado:',
        heapTotal: 'Heap Total:',
        external: 'Externo:',
        
        footer: '\n💡 Las estadísticas se actualizan en tiempo real'
    },
    pt: {
        title: '📊 ESTATÍSTICAS DO BOT',
        serverInfo: '🖥️ INFO DO SERVIDOR',
        botInfo: '🤖 INFO DO BOT',
        performance: '⚡ DESEMPENHO',
        system: '💻 SISTEMA',
        
        // Server info
        hostname: 'Nome do host:',
        platform: 'Plataforma:',
        arch: 'Arquitetura:',
        cpuModel: 'CPU:',
        cpuCores: 'Núcleos de CPU:',
        cpuSpeed: 'Velocidade da CPU:',
        
        // Bot info
        botName: 'Nome do Bot:',
        owner: 'Dono:',
        prefix: 'Prefixo:',
        mode: 'Modo:',
        uptime: 'Tempo ativo:',
        nodejs: 'Node.js:',
        
        // Performance
        memoryUsage: 'Uso de Memória:',
        memoryTotal: 'Memória Total:',
        memoryFree: 'Memória Livre:',
        memoryPercent: 'Memória Usada:',
        cpuUsage: 'Uso de CPU:',
        loadAverage: 'Carga Média:',
        
        // System
        osType: 'Tipo de SO:',
        osRelease: 'Versão do SO:',
        totalRAM: 'RAM Total:',
        freeRAM: 'RAM Livre:',
        
        // Additional
        processMemory: 'Memória do Processo:',
        heapUsed: 'Heap Usado:',
        heapTotal: 'Heap Total:',
        external: 'Externo:',
        
        footer: '\n💡 As estatísticas atualizam em tempo real'
    },
    ar: {
        title: '📊 إحصائيات البوت',
        serverInfo: '🖥️ معلومات السيرفر',
        botInfo: '🤖 معلومات البوت',
        performance: '⚡ الأداء',
        system: '💻 النظام',
        
        hostname: 'اسم المضيف:',
        platform: 'المنصة:',
        arch: 'المعمارية:',
        cpuModel: 'المعالج:',
        cpuCores: 'أنوية المعالج:',
        cpuSpeed: 'سرعة المعالج:',
        
        botName: 'اسم البوت:',
        owner: 'المالك:',
        prefix: 'البادئة:',
        mode: 'الوضع:',
        uptime: 'وقت التشغيل:',
        nodejs: 'Node.js:',
        
        memoryUsage: 'استخدام الذاكرة:',
        memoryTotal: 'إجمالي الذاكرة:',
        memoryFree: 'الذاكرة الحرة:',
        memoryPercent: 'الذاكرة المستخدمة:',
        cpuUsage: 'استخدام المعالج:',
        loadAverage: 'متوسط الحمل:',
        
        osType: 'نوع النظام:',
        osRelease: 'إصدار النظام:',
        totalRAM: 'إجمالي RAM:',
        freeRAM: 'RAM الحرة:',
        
        processMemory: 'ذاكرة العملية:',
        heapUsed: 'Heap المستخدم:',
        heapTotal: 'إجمالي Heap:',
        external: 'خارجي:',
        
        footer: '\n💡 الإحصائيات بتتحدث في الوقت الفعلي'
    },
    hi: {
        title: '📊 बॉट आंकड़े',
        serverInfo: '🖥️ सर्वर जानकारी',
        botInfo: '🤖 बॉट जानकारी',
        performance: '⚡ प्रदर्शन',
        system: '💻 सिस्टम',
        
        // Server info
        hostname: 'होस्टनेम:',
        platform: 'प्लेटफॉर्म:',
        arch: 'आर्किटेक्चर:',
        cpuModel: 'CPU:',
        cpuCores: 'CPU कोर:',
        cpuSpeed: 'CPU स्पीड:',
        
        // Bot info
        botName: 'बॉट का नाम:',
        owner: 'मालिक:',
        prefix: 'प्रीफिक्स:',
        mode: 'मोड:',
        uptime: 'अपटाइम:',
        nodejs: 'Node.js:',
        
        // Performance
        memoryUsage: 'मेमोरी उपयोग:',
        memoryTotal: 'कुल मेमोरी:',
        memoryFree: 'खाली मेमोरी:',
        memoryPercent: 'उपयोग की गई मेमोरी:',
        cpuUsage: 'CPU उपयोग:',
        loadAverage: 'औसत लोड:',
        
        // System
        osType: 'OS प्रकार:',
        osRelease: 'OS रिलीज:',
        totalRAM: 'कुल RAM:',
        freeRAM: 'खाली RAM:',
        
        // Additional
        processMemory: 'प्रोसेस मेमोरी:',
        heapUsed: 'उपयोग किया गया Heap:',
        heapTotal: 'कुल Heap:',
        external: 'बाहरी:',
        
        footer: '\n💡 आंकड़े रियल-टाइम में अपडेट होते हैं'
    }
};

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
    
    return parts.join(' ');
}

function getCPUUsage() {
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;
    
    cpus.forEach(cpu => {
        for (const type in cpu.times) {
            totalTick += cpu.times[type];
        }
        totalIdle += cpu.times.idle;
    });
    
    const idle = totalIdle / cpus.length;
    const total = totalTick / cpus.length;
    const usage = 100 - ~~(100 * idle / total);
    
    return usage;
}

export default {
    name: 'stats',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        try {
            // Get system info
            const uptime = process.uptime();
            const totalMem = os.totalmem();
            const freeMem = os.freemem();
            const usedMem = totalMem - freeMem;
            const memPercent = ((usedMem / totalMem) * 100).toFixed(1);
            
            const cpus = os.cpus();
            const cpuModel = cpus[0].model;
            const cpuCores = cpus.length;
            const cpuSpeed = cpus[0].speed;
            
            const loadAvg = os.loadavg();
            const cpuUsage = getCPUUsage();
            
            const memUsage = process.memoryUsage();
            
            const platform = os.platform();
            const arch = os.arch();
            const osType = os.type();
            const osRelease = os.release();
            const hostname = os.hostname();
            const nodeVersion = process.version;
            
            const statsText = 
                `${t.title}\n\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                `${t.botInfo}\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                `${t.botName} ${config.botName}\n` +
                `${t.owner} ${config.ownerName}\n` +
                `${t.prefix} ${config.prefix}\n` +
                `${t.mode} ${config.mode}\n` +
                `${t.uptime} ${formatUptime(uptime)}\n` +
                `${t.nodejs} ${nodeVersion}\n\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                `${t.performance}\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                `${t.memoryUsage} ${formatBytes(usedMem)}\n` +
                `${t.memoryTotal} ${formatBytes(totalMem)}\n` +
                `${t.memoryFree} ${formatBytes(freeMem)}\n` +
                `${t.memoryPercent} ${memPercent}%\n` +
                `${t.cpuUsage} ${cpuUsage}%\n` +
                `${t.loadAverage} ${loadAvg[0].toFixed(2)}, ${loadAvg[1].toFixed(2)}, ${loadAvg[2].toFixed(2)}\n\n` +
                `${t.processMemory}\n` +
                `├ ${t.heapUsed} ${formatBytes(memUsage.heapUsed)}\n` +
                `├ ${t.heapTotal} ${formatBytes(memUsage.heapTotal)}\n` +
                `└ ${t.external} ${formatBytes(memUsage.external)}\n\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                `${t.serverInfo}\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                `${t.hostname} ${hostname}\n` +
                `${t.platform} ${platform}\n` +
                `${t.arch} ${arch}\n` +
                `${t.osType} ${osType}\n` +
                `${t.osRelease} ${osRelease}\n` +
                `${t.cpuModel} ${cpuModel}\n` +
                `${t.cpuCores} ${cpuCores}\n` +
                `${t.cpuSpeed} ${cpuSpeed} MHz\n` +
                `${t.totalRAM} ${formatBytes(totalMem)}\n` +
                `${t.freeRAM} ${formatBytes(freeMem)}\n` +
                `${t.footer}`;
            
            await sendAsChannelForward(sock, from, statsText, {
                quoted: msg,
                newsletterName: config.botName || 'Bot Statistics'
            });
        } catch (error) {
            console.error('[STATS] Error:', error.message);
            await sock.sendMessage(from, { 
                text: lang === 'it' ? 
                    'Impossibile ottenere statistiche del server.' : 
                    'Failed to get server statistics.'
            });
        }
    }
};
