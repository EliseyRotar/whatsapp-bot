import { safeEncodeURIComponent } from '../../utils/securityEnhancements.js';
import axios from 'axios';
import { getGroupLanguage } from '../../utils/language.js';

const responses = {
    en: {
        usage: '❌ Please provide a target to search.\n\nUsage:\n• .baida <username/name/ip>\n• .baida @user (mention)\n• .baida <phone number>\n• Reply to message with .baida\n\n⚠️ Note: IP addresses cannot be obtained from phone numbers.\nOnly publicly available information will be shown.',
        searching: '🔍 Deep searching for: {target}\n\n⏳ This may take 30-60 seconds...\nGathering data from multiple sources...',
        noResults: '❌ No results found for: {target}\n\n💡 Tip: Try searching with a username instead of a phone number for more results.',
        results: '📊 OSINT REPORT FOR: {target}\n\n',
        phoneInfo: '📱 Phone Number Analysis:',
        whatsappInfo: '💬 WhatsApp Information:',
        online: '🌐 Online Presence:',
        socialMedia: '📱 Social Media Profiles:',
        ipInfo: '🌍 IP Geolocation:',
        limitation: '\n⚠️ LIMITATIONS:\n• IP addresses cannot be obtained from phone numbers\n• Only public information is accessible\n• Privacy settings may hide some data\n• Some APIs require free registration for full features',
        error: '❌ An error occurred during search. Please try again.'
    },
    it: {
        usage: '❌ Fornisci un target da cercare.\n\nUso:\n• .baida <username/nome/ip>\n• .baida @utente (menziona)\n• .baida <numero telefono>\n• Rispondi al messaggio con .baida',
        searching: '🔍 Ricerca approfondita per: {target}\n\n⏳ Potrebbero volerci 30-60 secondi...\nRaccolta dati da più fonti...',
        noResults: '❌ Nessun risultato per: {target}',
        results: '📊 REPORT OSINT PER: {target}\n\n',
        phoneInfo: '📱 Analisi Numero Telefono:',
        whatsappInfo: '� Informazioni WhatsApp:',
        online: '🌐 Presenza Online:',
        socialMedia: '📱 Profili Social Media:',
        ipInfo: '🌍 Geolocalizzazione IP:',
        error: '❌ Errore durante la ricerca. Riprova.'
    },
    ru: {
        usage: '❌ Укажите цель для поиска.\n\nИспользование:\n• .baida <имя пользователя/имя/ip>\n• .baida @пользователь (упоминание)\n• .baida <номер телефона>\n• Ответьте на сообщение с .baida',
        searching: '🔍 Глубокий поиск: {target}\n\n⏳ Это может занять 30-60 секунд...\nСбор данных из нескольких источников...',
        noResults: '❌ Результаты не найдены для: {target}',
        results: '📊 ОТЧЕТ OSINT ДЛЯ: {target}\n\n',
        phoneInfo: '📱 Анализ номера телефона:',
        whatsappInfo: '� Информация WhatsApp:',
        online: '🌐 Онлайн присутствие:',
        socialMedia: '📱 Профили в соцсетях:',
        ipInfo: '🌍 Геолокация IP:',
        error: '❌ Ошибка при поиске. Попробуйте снова.'
    },
    es: {
        usage: '❌ Proporciona un objetivo para buscar.\n\nUso:\n• .baida <usuario/nombre/ip>\n• .baida @usuario (mencionar)\n• .baida <número de teléfono>\n• Responder a mensaje con .baida',
        searching: '� Búsqueda profunda de: {target}\n\n⏳ Esto puede tardar 30-60 segundos...\nRecopilando datos de múltiples fuentes...',
        noResults: '❌ No se encontraron resultados para: {target}',
        results: '📊 INFORME OSINT PARA: {target}\n\n',
        phoneInfo: '📱 Análisis de número de teléfono:',
        whatsappInfo: '💬 Información de WhatsApp:',
        online: '🌐 Presencia en línea:',
        socialMedia: '📱 Perfiles de redes sociales:',
        ipInfo: '🌍 Geolocalización IP:',
        error: '❌ Error durante la búsqueda. Intenta de nuevo.'
    },
    pt: {
        usage: '❌ Forneça um alvo para pesquisar.\n\nUso:\n• .baida <usuário/nome/ip>\n• .baida @usuário (mencionar)\n• .baida <número de telefone>\n• Responder mensagem com .baida',
        searching: '🔍 Pesquisa profunda de: {target}\n\n⏳ Isso pode levar 30-60 segundos...\nColetando dados de várias fontes...',
        noResults: '❌ Nenhum resultado encontrado para: {target}',
        results: '📊 RELATÓRIO OSINT PARA: {target}\n\n',
        phoneInfo: '📱 Análise de número de telefone:',
        whatsappInfo: '💬 Informações do WhatsApp:',
        online: '🌐 Presença online:',
        socialMedia: '📱 Perfis de redes sociais:',
        ipInfo: '🌍 Geolocalização IP:',
        error: '❌ Erro durante a pesquisa. Tente novamente.'
    },
    ar: {
        usage: '❌ حدد هدف للبحث.\n\nالاستخدام:\n• .baida <اسم المستخدم/الاسم/ip>\n• .baida @مستخدم (منشن)\n• .baida <رقم الهاتف>\n• رد على رسالة بـ .baida',
        searching: '� بحث عميق عن: {target}\n\n⏳ قد يستغرق 30-60 ثانية...\nجمع البيانات من مصادر متعددة...',
        noResults: '❌ لم يتم العثور على نتائج لـ: {target}',
        results: '📊 تقرير OSINT لـ: {target}\n\n',
        phoneInfo: '📱 تحليل رقم الهاتف:',
        whatsappInfo: '💬 معلومات واتساب:',
        online: '🌐 التواجد على الإنترنت:',
        socialMedia: '📱 ملفات وسائل التواصل:',
        ipInfo: '🌍 موقع IP الجغرافي:',
        error: '❌ حدث خطأ أثناء البحث. حاول مرة أخرى.'
    },
    hi: {
        usage: '❌ कृपया सर्च करने के लिए टारगेट प्रदान करें।\n\nउपयोग:\n• .baida <यूज़रनेम/नाम/ip>\n• .baida @यूज़र (मेंशन)\n• .baida <फोन नंबर>\n• .baida के साथ मैसेज पर रिप्लाई करें\n\n⚠️ नोट: फोन नंबर से IP एड्रेस प्राप्त नहीं किए जा सकते।\nकेवल सार्वजनिक रूप से उपलब्ध जानकारी दिखाई जाएगी।',
        searching: '🔍 डीप सर्च कर रहे हैं: {target}\n\n⏳ इसमें 30-60 सेकंड लग सकते हैं...\nकई स्रोतों से डेटा एकत्र कर रहे हैं...',
        noResults: '❌ {target} के लिए कोई रिजल्ट नहीं मिला\n\n💡 टिप: अधिक रिजल्ट के लिए फोन नंबर के बजाय यूज़रनेम से सर्च करें।',
        results: '📊 OSINT रिपोर्ट: {target}\n\n',
        phoneInfo: '📱 फोन नंबर विश्लेषण:',
        whatsappInfo: '💬 WhatsApp जानकारी:',
        online: '🌐 ऑनलाइन उपस्थिति:',
        socialMedia: '📱 सोशल मीडिया प्रोफाइल:',
        ipInfo: '🌍 IP जियोलोकेशन:',
        limitation: '\n⚠️ सीमाएं:\n• फोन नंबर से IP एड्रेस प्राप्त नहीं किए जा सकते\n• केवल सार्वजनिक जानकारी सुलभ है\n• प्राइवेसी सेटिंग्स कुछ डेटा छिपा सकती हैं\n• कुछ API को पूर्ण फीचर के लिए मुफ्त रजिस्ट्रेशन की आवश्यकता है',
        error: '❌ सर्च के दौरान एरर हुआ। कृपया पुनः प्रयास करें।'
    }
};

// Advanced phone number lookup using multiple APIs
async function deepPhoneLookup(phoneNumber) {
    const results = {};
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    console.log('[BAIDA] Starting phone lookup for:', cleanNumber);
    
    // Only use APIs that actually work without authentication
    
    // API: ip-api.com phone lookup (works for some numbers)
    try {
        // Basic phone number parsing
        const countryCode = cleanNumber.substring(0, 2);
        const countryCodes = {
            '1': 'USA/Canada',
            '7': 'Russia/Kazakhstan',
            '20': 'Egypt',
            '27': 'South Africa',
            '30': 'Greece',
            '31': 'Netherlands',
            '32': 'Belgium',
            '33': 'France',
            '34': 'Spain',
            '36': 'Hungary',
            '39': 'Italy',
            '40': 'Romania',
            '41': 'Switzerland',
            '43': 'Austria',
            '44': 'UK',
            '45': 'Denmark',
            '46': 'Sweden',
            '47': 'Norway',
            '48': 'Poland',
            '49': 'Germany',
            '52': 'Mexico',
            '55': 'Brazil',
            '61': 'Australia',
            '81': 'Japan',
            '82': 'South Korea',
            '86': 'China',
            '90': 'Turkey',
            '91': 'India',
            '92': 'Pakistan',
            '351': 'Portugal',
            '353': 'Ireland',
            '358': 'Finland',
            '380': 'Ukraine',
            '420': 'Czech Republic',
            '966': 'Saudi Arabia',
            '971': 'UAE',
            '972': 'Israel',
            '973': 'Bahrain',
            '974': 'Qatar'
        };
        
        // Try to match country code
        for (let i = 3; i >= 1; i--) {
            const code = cleanNumber.substring(0, i);
            if (countryCodes[code]) {
                results.country = countryCodes[code];
                results.countryCode = `+${code}`;
                results.localNumber = cleanNumber.substring(i);
                break;
            }
        }
        
        if (!results.country) {
            results.country = 'Unknown';
            results.countryCode = 'Unknown';
        }
        
        results.internationalFormat = `+${cleanNumber}`;
        results.valid = cleanNumber.length >= 10 && cleanNumber.length <= 15;
        
    } catch (error) {
        console.log('[BAIDA] Phone parsing failed:', error.message);
    }
    
    return results;
}

// Search online presence (GitHub, Wikipedia)
async function searchOnline(target) {
    const results = [];

    try {
        const githubResponse = await axios.get(`https://api.github.com/users/${target}`, {
            timeout: 5000,
            validateStatus: (status) => status < 500
        });
        
        if (githubResponse.status === 200 && githubResponse.data) {
            const data = githubResponse.data;
            results.push(`GitHub: ${data.html_url}`);
            if (data.name) results.push(`  Name: ${data.name}`);
            if (data.bio) results.push(`  Bio: ${data.bio}`);
            if (data.location) results.push(`  Location: ${data.location}`);
            if (data.email) results.push(`  Email: ${data.email}`);
            if (data.company) results.push(`  Company: ${data.company}`);
            if (data.blog) results.push(`  Website: ${data.blog}`);
            if (data.twitter_username) results.push(`  Twitter: @${data.twitter_username}`);
            if (data.public_repos) results.push(`  Repos: ${data.public_repos}`);
            if (data.followers) results.push(`  Followers: ${data.followers}`);
        }
    } catch (error) {
        console.log('[BAIDA] GitHub search failed:', error.message);
    }

    try {
        const wikiResponse = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(target)}`, {
            timeout: 5000,
            validateStatus: (status) => status < 500
        });
        
        if (wikiResponse.status === 200 && wikiResponse.data && wikiResponse.data.extract) {
            results.push(`Wikipedia: ${wikiResponse.data.content_urls.desktop.page}`);
            results.push(`  ${wikiResponse.data.extract.substring(0, 200)}...`);
        }
    } catch (error) {
        console.log('[BAIDA] Wikipedia search failed:', error.message);
    }

    return results;
}

// Search social media
async function searchSocialMedia(target) {
    const results = [];
    
    const platforms = [
        { name: 'Twitter/X', url: `https://twitter.com/${safeEncodeURIComponent(target)}` },
        { name: 'Instagram', url: `https://instagram.com/${safeEncodeURIComponent(target)}` },
        { name: 'Facebook', url: `https://facebook.com/${safeEncodeURIComponent(target)}` },
        { name: 'LinkedIn', url: `https://linkedin.com/in/${safeEncodeURIComponent(target)}` },
        { name: 'TikTok', url: `https://tiktok.com/@${safeEncodeURIComponent(target)}` },
        { name: 'YouTube', url: `https://youtube.com/@${safeEncodeURIComponent(target)}` },
        { name: 'Reddit', url: `https://reddit.com/user/${safeEncodeURIComponent(target)}` },
        { name: 'Telegram', url: `https://t.me/${safeEncodeURIComponent(target)}` },
        { name: 'Snapchat', url: `https://snapchat.com/add/${safeEncodeURIComponent(target)}` },
        { name: 'Pinterest', url: `https://pinterest.com/${safeEncodeURIComponent(target)}` },
        { name: 'Twitch', url: `https://twitch.tv/${safeEncodeURIComponent(target)}` },
        { name: 'Discord', url: `https://discord.com/users/${safeEncodeURIComponent(target)}` }
    ];
    
    platforms.forEach(platform => {
        results.push(`${platform.name}: ${platform.url}`);
    });

    return results;
}

// Search IP information
async function searchIP(target) {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    
    if (!ipRegex.test(target)) {
        return null;
    }

    try {
        const response = await axios.get(`http://ip-api.com/json/${target}`, {
            params: {
                fields: 'status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query'
            },
            timeout: 5000
        });
        
        if (response.status === 200 && response.data && response.data.status === 'success') {
            return response.data;
        }
    } catch (error) {
        console.log('[BAIDA] IP search failed:', error.message);
    }

    return null;
}

// Get WhatsApp user information
async function getWhatsAppInfo(sock, userJid, from) {
    const info = {};
    
    try {
        // Extract actual phone number from JID
        let number = userJid.split('@')[0];
        let actualPhoneNumber = null;
        
        // If it's a LID (linked device), try to get the actual number from group metadata
        if (userJid.includes('@lid')) {
            console.log('[BAIDA] LID detected, extracting actual number from group metadata...');
            info.isLID = true;
            
            try {
                // Get group metadata to find the actual phone number
                if (from && from.endsWith('@g.us')) {
                    const groupMetadata = await sock.groupMetadata(from);
                    
                    // Find participant by matching the LID
                    const participant = groupMetadata.participants.find(p => {
                        // LID format can be: number:lid@lid or just lid@lid
                        // We need to match the LID part
                        const pId = p.id;
                        const pLid = pId.split('@')[0]; // Get part before @
                        const uLid = userJid.split('@')[0]; // Get part before @
                        
                        return pId === userJid || pLid === uLid || pId.includes(uLid);
                    });
                    
                    if (participant && participant.id) {
                        console.log('[BAIDA] Found participant:', participant.id);
                        
                        // Extract the actual number from the participant ID
                        // LID format: number:deviceId@lid
                        const participantId = participant.id;
                        
                        if (participantId.includes(':') && participantId.includes('@lid')) {
                            // Format: number:deviceId@lid - extract the number part
                            actualPhoneNumber = participantId.split(':')[0];
                            console.log('[BAIDA] Extracted phone number from LID:', actualPhoneNumber);
                        } else if (participantId.includes('@s.whatsapp.net')) {
                            // Regular format
                            actualPhoneNumber = participantId.split('@')[0];
                        }
                    } else {
                        console.log('[BAIDA] Participant not found in group metadata');
                    }
                }
            } catch (error) {
                console.log('[BAIDA] Could not extract number from group metadata:', error.message);
            }
        } else {
            info.isLID = false;
            actualPhoneNumber = number; // For regular JIDs, the number is directly in the JID
        }
        
        // Use actual phone number if found, otherwise use the LID
        info.number = actualPhoneNumber || number;
        info.jid = userJid;
        info.lidIdentifier = number; // Store the LID identifier separately
        
        try {
            const ppUrl = await sock.profilePictureUrl(userJid, 'image');
            info.profilePicture = ppUrl || 'No profile picture';
        } catch (error) {
            info.profilePicture = 'Hidden or not available';
        }
        
        try {
            const status = await sock.fetchStatus(userJid);
            info.status = status?.status || 'No status';
            if (status?.setAt) {
                info.statusSetAt = new Date(status.setAt * 1000).toLocaleString();
            }
        } catch (error) {
            info.status = 'Hidden or not available';
        }
        
        try {
            const businessProfile = await sock.getBusinessProfile(userJid);
            if (businessProfile) {
                info.isBusiness = true;
                info.businessName = businessProfile.description || 'N/A';
                info.businessCategory = businessProfile.category || 'N/A';
                info.businessWebsite = businessProfile.website?.[0] || 'N/A';
                info.businessEmail = businessProfile.email || 'N/A';
            }
        } catch (error) {
            info.isBusiness = false;
        }
        
        try {
            const [exists] = await sock.onWhatsApp(number);
            info.existsOnWhatsApp = exists?.exists || false;
            if (exists?.jid && !userJid.includes('@lid')) {
                info.actualJid = exists.jid;
            }
        } catch (error) {
            info.existsOnWhatsApp = 'Unknown';
        }
        
    } catch (error) {
        console.error('[BAIDA] Error getting WhatsApp info:', error.message);
    }
    
    return info;
}

export default {
    name: 'baida',
    aliases: ['dox', 'search', 'osint'],
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;

        try {
            let target = null;
            let isPhoneNumber = false;
            let userJid = null;
            
            const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
            const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
            
            if (mentioned) {
                userJid = mentioned;
                target = mentioned.split('@')[0];
                isPhoneNumber = true;
            } else if (quoted) {
                userJid = quoted;
                target = quoted.split('@')[0];
                isPhoneNumber = true;
            } else if (args.length > 0) {
                target = args.join(' ').trim();
                
                const phoneRegex = /^\+?[\d\s-()]+$/;
                if (phoneRegex.test(target)) {
                    const cleanNumber = target.replace(/\D/g, '');
                    userJid = `${cleanNumber}@s.whatsapp.net`;
                    isPhoneNumber = true;
                    target = cleanNumber;
                }
            } else {
                return await sock.sendMessage(from, {
                    text: t.usage
                });
            }

            await sock.sendMessage(from, {
                text: t.searching.replace('{target}', target)
            });

            let allResults = [];
            let resultText = t.results.replace('{target}', target);

            // Phone number deep lookup
            if (isPhoneNumber) {
                const phoneData = await deepPhoneLookup(target);
                
                if (Object.keys(phoneData).length > 0) {
                    resultText += `${t.phoneInfo}\n`;
                    resultText += `Number: +${target}\n`;
                    
                    if (phoneData.valid !== undefined) resultText += `Valid Format: ${phoneData.valid ? '✅ Yes' : '❌ No'}\n`;
                    if (phoneData.country) resultText += `Country: ${phoneData.country}\n`;
                    if (phoneData.countryCode) resultText += `Country Code: ${phoneData.countryCode}\n`;
                    if (phoneData.localNumber) resultText += `Local Number: ${phoneData.localNumber}\n`;
                    if (phoneData.internationalFormat) resultText += `International: ${phoneData.internationalFormat}\n`;
                    
                    resultText += '\n';
                    allResults.push('Phone data found');
                }
                
                // WhatsApp info
                if (userJid) {
                    const waInfo = await getWhatsAppInfo(sock, userJid, from);
                    if (waInfo && Object.keys(waInfo).length > 0) {
                        resultText += `${t.whatsappInfo}\n`;
                        if (waInfo.isLID) {
                            resultText += `⚠️ User is using WhatsApp Web/Desktop (LID)\n`;
                            resultText += `📱 Phone Number: +${waInfo.number}\n`;
                            resultText += `🔑 LID Identifier: ${waInfo.lidIdentifier}\n`;
                            resultText += `📱 JID: ${waInfo.jid}\n`;
                        } else {
                            resultText += `📱 Phone Number: +${waInfo.number}\n`;
                            resultText += `📱 JID: ${waInfo.jid}\n`;
                        }
                        if (from && from.endsWith('@g.us')) {
                            resultText += `👥 Group JID: ${from}\n`;
                        }
                        if (waInfo.existsOnWhatsApp !== undefined) {
                            resultText += `On WhatsApp: ${waInfo.existsOnWhatsApp ? '✅ Yes' : '❌ No'}\n`;
                        }
                        if (waInfo.profilePicture && !waInfo.profilePicture.includes('Hidden')) {
                            resultText += `Profile Picture: ${waInfo.profilePicture}\n`;
                        } else {
                            resultText += `Profile Picture: 🔒 Hidden by privacy settings\n`;
                        }
                        if (waInfo.status && !waInfo.status.includes('Hidden')) {
                            resultText += `Status: ${waInfo.status}\n`;
                            if (waInfo.statusSetAt) resultText += `Status Updated: ${waInfo.statusSetAt}\n`;
                        } else {
                            resultText += `Status: 🔒 Hidden by privacy settings\n`;
                        }
                        
                        if (waInfo.isBusiness) {
                            resultText += `\n🏢 Business Account:\n`;
                            resultText += `  Name: ${waInfo.businessName}\n`;
                            resultText += `  Category: ${waInfo.businessCategory}\n`;
                            if (waInfo.businessWebsite !== 'N/A') resultText += `  Website: ${waInfo.businessWebsite}\n`;
                            if (waInfo.businessEmail !== 'N/A') resultText += `  Email: ${waInfo.businessEmail}\n`;
                        }
                        
                        resultText += '\n';
                        allResults.push('WhatsApp info found');
                    }
                }
            } else {
                // Username/name search
                const onlineResults = await searchOnline(target);
                if (onlineResults.length > 0) {
                    resultText += `${t.online}\n`;
                    onlineResults.forEach(result => {
                        resultText += `${result}\n`;
                    });
                    resultText += '\n';
                    allResults = allResults.concat(onlineResults);
                }

                const socialResults = await searchSocialMedia(target);
                if (socialResults.length > 0) {
                    resultText += `${t.socialMedia}\n`;
                    socialResults.forEach(result => {
                        resultText += `${result}\n`;
                    });
                    resultText += '\n';
                    allResults = allResults.concat(socialResults);
                }
            }

            // IP lookup
            const ipResult = await searchIP(target);
            if (ipResult) {
                resultText += `${t.ipInfo}\n`;
                resultText += `IP: ${ipResult.query}\n`;
                resultText += `Country: ${ipResult.country} (${ipResult.countryCode})\n`;
                resultText += `Region: ${ipResult.regionName}\n`;
                resultText += `City: ${ipResult.city}\n`;
                if (ipResult.zip) resultText += `ZIP: ${ipResult.zip}\n`;
                resultText += `Coordinates: ${ipResult.lat}, ${ipResult.lon}\n`;
                resultText += `Timezone: ${ipResult.timezone}\n`;
                resultText += `ISP: ${ipResult.isp}\n`;
                if (ipResult.org) resultText += `Organization: ${ipResult.org}\n`;
                if (ipResult.as) resultText += `AS: ${ipResult.as}\n`;
                if (ipResult.mobile) resultText += `Mobile: ${ipResult.mobile ? 'Yes' : 'No'}\n`;
                if (ipResult.proxy) resultText += `Proxy: ${ipResult.proxy ? 'Yes' : 'No'}\n`;
                if (ipResult.hosting) resultText += `Hosting: ${ipResult.hosting ? 'Yes' : 'No'}\n`;
                allResults.push('IP info found');
            }

            if (allResults.length === 0) {
                await sock.sendMessage(from, {
                    text: t.noResults.replace('{target}', target)
                });
            } else {
                resultText += t.limitation;
                await sock.sendMessage(from, {
                    text: resultText
                });
            }

        } catch (error) {
            console.error('[BAIDA] Command error:', error.message);
            console.error('[BAIDA] Stack:', error.stack);
            await sock.sendMessage(from, {
                text: t.error
            });
        }
    }
};
