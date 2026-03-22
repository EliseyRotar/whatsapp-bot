import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        noOwners: '📋 Additional Owners: None\n\nOnly the main owner (eli6) has permissions.',
        title: '╔═══════════════════════════╗\n║     👑 OWNER LIST     ║\n╚═══════════════════════════╝\n\n',
        mainOwner: '🔹 Main Owner: eli6 (+393313444410)\n\n',
        additionalOwners: '🔹 Additional Owners:\n\n',
        added: 'Added:',
        total: 'Total: {count} additional owner(s)',
        failed: '❌ Failed to list owners.\n\nError:'
    },
    it: {
        noOwners: '📋 Proprietari Aggiuntivi: Nessuno\n\nSolo il proprietario principale (eli6) ha permessi.',
        title: '╔═══════════════════════════╗\n║   👑 LISTA PROPRIETARI   ║\n╚═══════════════════════════╝\n\n',
        mainOwner: '🔹 Proprietario Principale: eli6 (+393313444410)\n\n',
        additionalOwners: '🔹 Proprietari Aggiuntivi:\n\n',
        added: 'Aggiunto:',
        total: 'Totale: {count} proprietario/i aggiuntivo/i',
        failed: '❌ Impossibile elencare proprietari.\n\nErrore:'
    },
    ru: {
        noOwners: '📋 Дополнительные владельцы: Нет\n\nТолько главный владелец (eli6) имеет права.',
        title: '╔═══════════════════════════╗\n║   👑 СПИСОК ВЛАДЕЛЬЦЕВ   ║\n╚═══════════════════════════╝\n\n',
        mainOwner: '🔹 Главный владелец: eli6 (+393313444410)\n\n',
        additionalOwners: '🔹 Дополнительные владельцы:\n\n',
        added: 'Добавлен:',
        total: 'Всего: {count} дополнительных владельцев',
        failed: '❌ Не удалось получить список владельцев.\n\nОшибка:'
    },
    es: {
        noOwners: '📋 Propietarios Adicionales: Ninguno\n\nSolo el propietario principal (eli6) tiene permisos.',
        title: '╔═══════════════════════════╗\n║  👑 LISTA DE PROPIETARIOS  ║\n╚═══════════════════════════╝\n\n',
        mainOwner: '🔹 Propietario Principal: eli6 (+393313444410)\n\n',
        additionalOwners: '🔹 Propietarios Adicionales:\n\n',
        added: 'Agregado:',
        total: 'Total: {count} propietario(s) adicional(es)',
        failed: '❌ Error al listar propietarios.\n\nError:'
    },
    pt: {
        noOwners: '📋 Proprietários Adicionais: Nenhum\n\nApenas o proprietário principal (eli6) tem permissões.',
        title: '╔═══════════════════════════╗\n║  👑 LISTA DE PROPRIETÁRIOS  ║\n╚═══════════════════════════╝\n\n',
        mainOwner: '🔹 Proprietário Principal: eli6 (+393313444410)\n\n',
        additionalOwners: '🔹 Proprietários Adicionais:\n\n',
        added: 'Adicionado:',
        total: 'Total: {count} proprietário(s) adicional(is)',
        failed: '❌ Falha ao listar proprietários.\n\nErro:'
    },
    ar: {
        noOwners: '📋 المالكين الإضافيين: مافيش\n\nالمالك الرئيسي (eli6) بس اللي عنده صلاحيات.',
        title: '╔═══════════════════════════╗\n║     👑 قائمة المالكين     ║\n╚═══════════════════════════╝\n\n',
        mainOwner: '🔹 المالك الرئيسي: eli6 (+393313444410)\n\n',
        additionalOwners: '🔹 المالكين الإضافيين:\n\n',
        added: 'اتضاف:',
        total: 'الإجمالي: {count} مالك إضافي',
        failed: '❌ فشل في عرض المالكين.\n\nالخطأ:'
    },
    hi: {
        noOwners: '📋 अतिरिक्त ओनर: कोई नहीं\n\nकेवल मुख्य ओनर (eli6) के पास अनुमतियां हैं।',
        title: '╔═══════════════════════════╗\n║     👑 ओनर सूची     ║\n╚═══════════════════════════╝\n\n',
        mainOwner: '🔹 मुख्य ओनर: eli6 (+393313444410)\n\n',
        additionalOwners: '🔹 अतिरिक्त ओनर:\n\n',
        added: 'जोड़ा गया:',
        total: 'कुल: {count} अतिरिक्त ओनर',
        failed: '❌ ओनर सूची बनाने में विफल।\n\nएरर:'
    }
};

export default {
    name: 'listowners',
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        try {
            const fs = await import('fs');
            const path = await import('path');
            const dataDir = './data';
            const ownersFile = path.join(dataDir, 'additional_owners.json');
            
            if (!fs.existsSync(ownersFile)) {
                await sock.sendMessage(from, { 
                    text: t.noOwners
                });
                return;
            }
            
            const data = fs.readFileSync(ownersFile, 'utf8');
            const additionalOwners = JSON.parse(data);
            
            if (additionalOwners.length === 0) {
                await sock.sendMessage(from, { 
                    text: t.noOwners
                });
                return;
            }
            
            let ownerList = t.title;
            ownerList += t.mainOwner;
            ownerList += t.additionalOwners;
            
            const mentions = [];
            additionalOwners.forEach((owner, index) => {
                const addedDate = new Date(owner.addedAt).toLocaleDateString();
                ownerList += `${index + 1}. @${owner.number}\n`;
                ownerList += `   ${t.added} ${addedDate}\n\n`;
                mentions.push(owner.jid);
            });
            
            ownerList += t.total.replace('{count}', additionalOwners.length);
            
            await sock.sendMessage(from, { 
                text: ownerList,
                mentions: mentions
            });
            
        } catch (error) {
            console.error('Error listing owners:', error);
            await sock.sendMessage(from, { 
                text: `${t.failed} ${error.message}`
            });
        }
    }
};
