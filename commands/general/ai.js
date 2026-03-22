import { getGroupLanguage } from '../../utils/language.js';
import { config } from '../../config.js';
import fetch from 'node-fetch';

// Conversation memory storage
const conversations = new Map();
const userModes = new Map();
const MAX_HISTORY = 10;

// AI modes/personalities
const AI_MODES = {
    default: 'helpful assistant',
    code: 'expert programmer and code reviewer',
    creative: 'creative writer and storyteller',
    teacher: 'patient teacher who explains concepts simply',
    analyst: 'data analyst who provides insights',
    translator: 'professional translator'
};

const responses = {
    en: {
        help: '╔═══════════════════════════╗\n║   🤖 AI ASSISTANT HELP   ║\n╚═══════════════════════════╝\n\n📝 BASIC USAGE:\n.ai <question> - Ask anything\n.ai help - Show this help\n\nExample:\n.ai What is quantum physics?\n.ai Explain how React works\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n🎭 AI MODES:\n.ai mode <type>\n\nAvailable modes:\n• default - General assistant\n• code - Expert programmer\n• creative - Creative writer\n• teacher - Patient educator\n• analyst - Data analyst\n• translator - Translator\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n💻 CODE ANALYSIS:\n.ai code <code>\n\nExample:\n.ai code const x = [1,2,3].map(n => n*2)\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n🖼️ IMAGE ANALYSIS:\n.ai image [question]\n(Reply to an image)\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n💬 CONVERSATION MEMORY:\nAI remembers last 10 messages\n\n🗑️ CLEAR HISTORY:\n.ai clear\n\n🚀 Powered by Groq (Llama 3.3 70B)',
        usage: '🤖 AI Assistant\n\n.ai <question> - Ask anything\n.ai help - Detailed help\n.ai mode <type> - Change mode\n.ai code <code> - Analyze code\n.ai image - Analyze image\n.ai clear - Reset chat\n\nExample: .ai What is Python?',
        thinking: '🤔 Thinking...',
        analyzing: '🔍 Analyzing...',
        error: '❌ Error:',
        noQuestion: '❌ Please provide a question!',
        historyCleared: '✅ Conversation history cleared!',
        modeChanged: '✅ AI mode changed to:',
        invalidMode: '❌ Invalid mode! Available:\ndefault, code, creative, teacher, analyst, translator',
        noImage: '❌ Reply to an image with .ai image',
        conversationContext: '💬 Continuing conversation...'
    },
    it: {
        help: '╔═══════════════════════════╗\n║   🤖 AIUTO ASSISTENTE AI   ║\n╚═══════════════════════════╝\n\n📝 USO BASE:\n.ai <domanda> - Chiedi qualsiasi cosa\n.ai help - Mostra questo aiuto\n\nEsempio:\n.ai Cos\'è la fisica quantistica?\n.ai Spiega come funziona React\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n🎭 MODALITÀ AI:\n.ai mode <tipo>\n\nModalità disponibili:\n• default - Assistente generale\n• code - Programmatore esperto\n• creative - Scrittore creativo\n• teacher - Educatore paziente\n• analyst - Analista dati\n• translator - Traduttore\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n💻 ANALISI CODICE:\n.ai code <codice>\n\nEsempio:\n.ai code const x = [1,2,3].map(n => n*2)\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n🖼️ ANALISI IMMAGINI:\n.ai image [domanda]\n(Rispondi a un\'immagine)\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n💬 MEMORIA CONVERSAZIONE:\nAI ricorda ultimi 10 messaggi\n\n🗑️ CANCELLA CRONOLOGIA:\n.ai clear\n\n🚀 Powered by Groq (Llama 3.3 70B)',
        usage: '🤖 Assistente AI\n\n.ai <domanda> - Chiedi qualsiasi cosa\n.ai help - Aiuto dettagliato\n.ai mode <tipo> - Cambia modalità\n.ai code <codice> - Analizza codice\n.ai image - Analizza immagine\n.ai clear - Reset chat\n\nEsempio: .ai Cos\'è Python?',
        thinking: '🤔 Sto pensando...',
        analyzing: '🔍 Analizzo...',
        error: '❌ Errore:',
        noQuestion: '❌ Fornisci una domanda!',
        historyCleared: '✅ Cronologia cancellata!',
        modeChanged: '✅ Modalità AI cambiata in:',
        invalidMode: '❌ Modalità non valida! Disponibili:\ndefault, code, creative, teacher, analyst, translator',
        noImage: '❌ Rispondi a un\'immagine con .ai image',
        conversationContext: '💬 Continuo conversazione...'
    },
    ru: {
        usage: '🤖 AI Ассистент - Расширенный\n\n📝 Базовый:\n.ai <вопрос> - Спросите что угодно\n\n🖼️ Анализ изображений:\n.ai image - Анализ изображения в ответе\n\n💻 Код:\n.ai code <код> - Объяснить/проверить код\n\n🎭 Режимы:\n.ai mode <тип> - Изменить личность\nРежимы: default, code, creative, teacher, analyst, translator\n\n🗑️ Очистить:\n.ai clear - Сброс разговора\n\nПримеры:\n.ai Что такое квантовая физика?\n.ai mode teacher\n.ai code console.log("привет")',
        thinking: '🤔 Думаю...',
        analyzing: '🔍 Анализирую...',
        error: '❌ Ошибка:',
        noQuestion: '❌ Задайте вопрос!',
        historyCleared: '✅ История очищена!',
        modeChanged: '✅ Режим AI изменен на:',
        invalidMode: '❌ Неверный режим! Доступные:\ndefault, code, creative, teacher, analyst, translator',
        noImage: '❌ Ответьте на изображение с .ai image',
        conversationContext: '💬 Продолжаю разговор...'
    },
    es: {
        usage: '🤖 Asistente AI - Mejorado\n\n📝 Básico:\n.ai <pregunta> - Pregunta lo que quieras\n\n🖼️ Análisis de Imágenes:\n.ai image - Analizar imagen respondida\n\n💻 Código:\n.ai code <código> - Explicar/revisar código\n\n🎭 Modos:\n.ai mode <tipo> - Cambiar personalidad\nModos: default, code, creative, teacher, analyst, translator\n\n🗑️ Limpiar:\n.ai clear - Reiniciar conversación\n\nEjemplos:\n.ai ¿Qué es la física cuántica?\n.ai mode teacher\n.ai code console.log("hola")',
        thinking: '🤔 Pensando...',
        analyzing: '🔍 Analizando...',
        error: '❌ Error:',
        noQuestion: '❌ ¡Proporciona una pregunta!',
        historyCleared: '✅ ¡Historial limpiado!',
        modeChanged: '✅ Modo AI cambiado a:',
        invalidMode: '❌ ¡Modo inválido! Disponibles:\ndefault, code, creative, teacher, analyst, translator',
        noImage: '❌ Responde a una imagen con .ai image',
        conversationContext: '💬 Continuando conversación...'
    },
    pt: {
        usage: '🤖 Assistente AI - Aprimorado\n\n📝 Básico:\n.ai <pergunta> - Pergunte qualquer coisa\n\n🖼️ Análise de Imagens:\n.ai image - Analisar imagem respondida\n\n💻 Código:\n.ai code <código> - Explicar/revisar código\n\n🎭 Modos:\n.ai mode <tipo> - Mudar personalidade\nModos: default, code, creative, teacher, analyst, translator\n\n🗑️ Limpar:\n.ai clear - Reiniciar conversa\n\nExemplos:\n.ai O que é física quântica?\n.ai mode teacher\n.ai code console.log("olá")',
        thinking: '🤔 Pensando...',
        analyzing: '🔍 Analisando...',
        error: '❌ Erro:',
        noQuestion: '❌ Forneça uma pergunta!',
        historyCleared: '✅ Histórico limpo!',
        modeChanged: '✅ Modo AI alterado para:',
        invalidMode: '❌ Modo inválido! Disponíveis:\ndefault, code, creative, teacher, analyst, translator',
        noImage: '❌ Responda a uma imagem com .ai image',
        conversationContext: '💬 Continuando conversa...'
    },
    ar: {
        usage: '🤖 مساعد AI - محسّن\n\n📝 أساسي:\n.ai <سؤال> - اسأل أي شيء\n\n🖼️ تحليل الصور:\n.ai image - تحليل الصورة المردودة\n\n💻 كود:\n.ai code <كود> - شرح/مراجعة الكود\n\n🎭 أوضاع:\n.ai mode <نوع> - تغيير الشخصية\nالأوضاع: default, code, creative, teacher, analyst, translator\n\n🗑️ مسح:\n.ai clear - إعادة تعيين المحادثة\n\nأمثلة:\n.ai ما هي فيزياء الكم؟\n.ai mode teacher\n.ai code console.log("مرحبا")',
        thinking: '🤔 أفكر...',
        analyzing: '🔍 أحلل...',
        error: '❌ خطأ:',
        noQuestion: '❌ قدم سؤالاً!',
        historyCleared: '✅ تم مسح السجل!',
        modeChanged: '✅ تم تغيير وضع AI إلى:',
        invalidMode: '❌ وضع غير صالح! المتاحة:\ndefault, code, creative, teacher, analyst, translator',
        noImage: '❌ رد على صورة مع .ai image',
        conversationContext: '💬 أكمل المحادثة...'
    },
    hi: {
        help: '╔═══════════════════════════╗\n║   🤖 AI सहायक मदद   ║\n╚═══════════════════════════╝\n\n📝 बुनियादी उपयोग:\n.ai <प्रश्न> - कुछ भी पूछें\n.ai help - यह मदद दिखाएं\n\nउदाहरण:\n.ai क्वांटम फिजिक्स क्या है?\n.ai React कैसे काम करता है समझाएं\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n🎭 AI मोड:\n.ai mode <प्रकार>\n\nउपलब्ध मोड:\n• default - सामान्य सहायक\n• code - विशेषज्ञ प्रोग्रामर\n• creative - रचनात्मक लेखक\n• teacher - धैर्यवान शिक्षक\n• analyst - डेटा विश्लेषक\n• translator - अनुवादक\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n💻 कोड विश्लेषण:\n.ai code <कोड>\n\nउदाहरण:\n.ai code const x = [1,2,3].map(n => n*2)\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n🖼️ छवि विश्लेषण:\n.ai image [प्रश्न]\n(एक छवि का उत्तर दें)\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n💬 बातचीत मेमोरी:\nAI पिछले 10 संदेश याद रखता है\n\n🗑️ इतिहास साफ करें:\n.ai clear\n\n🚀 Groq द्वारा संचालित (Llama 3.3 70B)',
        usage: '🤖 AI सहायक\n\n.ai <प्रश्न> - कुछ भी पूछें\n.ai help - विस्तृत मदद\n.ai mode <प्रकार> - मोड बदलें\n.ai code <कोड> - कोड विश्लेषण करें\n.ai image - छवि विश्लेषण करें\n.ai clear - चैट रीसेट करें\n\nउदाहरण: .ai Python क्या है?',
        thinking: '🤔 सोच रहा हूं...',
        analyzing: '🔍 विश्लेषण कर रहा हूं...',
        error: '❌ त्रुटि:',
        noQuestion: '❌ कृपया एक प्रश्न प्रदान करें!',
        historyCleared: '✅ बातचीत का इतिहास साफ हो गया!',
        modeChanged: '✅ AI मोड बदल गया:',
        invalidMode: '❌ अमान्य मोड! उपलब्ध:\ndefault, code, creative, teacher, analyst, translator',
        noImage: '❌ .ai image के साथ एक छवि का उत्तर दें',
        conversationContext: '💬 बातचीत जारी है...'
    },
    ng: {
        help: '╔═══════════════════════════╗\n║   🤖 AI ASSISTANT HELP   ║\n╚═══════════════════════════╝\n\n📝 HOW TO USE AM:\n.ai <question> - Ask anytin wey you wan know\n.ai help - Show dis help\n\nExample:\n.ai Wetin be quantum physics?\n.ai Explain how React dey work\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n🎭 AI MODES:\n.ai mode <type>\n\nModes wey dey available:\n• default - General assistant\n• code - Expert programmer\n• creative - Creative writer\n• teacher - Patient teacher\n• analyst - Data analyst\n• translator - Translator\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n💻 CODE ANALYSIS:\n.ai code <code>\n\nExample:\n.ai code const x = [1,2,3].map(n => n*2)\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n🖼️ IMAGE ANALYSIS:\n.ai image [question]\n(Reply to one image)\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n💬 CONVERSATION MEMORY:\nAI dey remember last 10 messages\n\n🗑️ CLEAR HISTORY:\n.ai clear\n\n🚀 Powered by Groq (Llama 3.3 70B)',
        usage: '🤖 AI Assistant\n\n.ai <question> - Ask anytin\n.ai help - Full help\n.ai mode <type> - Change mode\n.ai code <code> - Check code\n.ai image - Check image\n.ai clear - Reset chat\n\nExample: .ai Wetin be Python?',
        thinking: '🤔 I dey think...',
        analyzing: '🔍 I dey check am...',
        error: '❌ Wahala dey:',
        noQuestion: '❌ Abeg ask question!',
        historyCleared: '✅ Chat history don clear!',
        modeChanged: '✅ AI mode don change to:',
        invalidMode: '❌ Dat mode no dey! Available ones:\ndefault, code, creative, teacher, analyst, translator',
        noImage: '❌ Reply to image with .ai image',
        conversationContext: '💬 We dey continue chat...'
    }
};

// Get or create conversation history
function getConversation(userId) {
    if (!conversations.has(userId)) {
        conversations.set(userId, []);
    }
    return conversations.get(userId);
}

// Add message to conversation history
function addToHistory(userId, role, content) {
    const history = getConversation(userId);
    history.push({ role, content });
    
    // Keep only last MAX_HISTORY messages
    if (history.length > MAX_HISTORY * 2) {
        history.splice(0, history.length - MAX_HISTORY * 2);
    }
}

// Get user's AI mode
function getUserMode(userId) {
    return userModes.get(userId) || 'default';
}

// AI function with conversation memory and modes
async function getAIResponse(question, lang = 'en', userId, hasImage = false) {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);
        
        const userMode = getUserMode(userId);
        const history = getConversation(userId);
        
        // Build system prompt based on mode and language
        let systemPrompt = `You are a ${AI_MODES[userMode]}. `;
        
        if (lang === 'it') systemPrompt += 'Rispondi in italiano in modo chiaro e conciso.';
        else if (lang === 'ru') systemPrompt += 'Отвечайте на русском языке четко и кратко.';
        else if (lang === 'es') systemPrompt += 'Responde en español de manera clara y concisa.';
        else if (lang === 'pt') systemPrompt += 'Responda em português de forma clara e concisa.';
        else if (lang === 'ar') systemPrompt += 'أجب بالعربية بشكل واضح وموجز.';
        else systemPrompt += 'Respond clearly and concisely in English.';
        
        if (hasImage) {
            systemPrompt += ' You are analyzing an image. Describe what you see in detail.';
        }
        
        // Build messages array with history
        const messages = [
            { role: 'system', content: systemPrompt },
            ...history,
            { role: 'user', content: question }
        ];
        
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.groqApiKey}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: messages,
                max_tokens: 1000,
                temperature: userMode === 'creative' ? 0.9 : 0.7
            }),
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[AI] API Error:', response.status, errorText);
            
            if (response.status === 429) {
                throw new Error('RATE_LIMITED');
            }
            
            throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();
        
        if (data.choices && data.choices[0]?.message?.content) {
            const aiResponse = data.choices[0].message.content.trim();
            
            // Add to conversation history
            addToHistory(userId, 'user', question);
            addToHistory(userId, 'assistant', aiResponse);
            
            return aiResponse;
        }
        
        throw new Error('No response content');
        
    } catch (error) {
        console.error('[AI] API Error:', error.message);
        
        if (error.message === 'RATE_LIMITED') {
            return lang === 'it' ? '⏳ Servizio AI occupato. Riprova tra qualche minuto!' :
                   lang === 'es' ? '⏳ Servicio IA ocupado. ¡Inténtalo en unos minutos!' :
                   lang === 'pt' ? '⏳ Serviço IA ocupado. Tente em alguns minutos!' :
                   lang === 'ru' ? '⏳ AI-сервис занят. Попробуйте через несколько минут!' :
                   lang === 'ar' ? '⏳ خدمة AI مشغولة. حاول بعد بضع دقائق!' :
                   '⏳ AI service busy. Retry in a few minutes!';
        }
        
        return generateSimpleResponse(question, lang);
    }
}

// Simple fallback response
function generateSimpleResponse(question, lang) {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('hello') || lowerQuestion.includes('hi') || lowerQuestion.includes('ciao')) {
        return lang === 'it' ? 'Ciao! Come posso aiutarti?' :
               lang === 'es' ? '¡Hola! ¿Cómo puedo ayudarte?' :
               lang === 'pt' ? 'Olá! Como posso ajudá-lo?' :
               lang === 'ru' ? 'Привет! Как я могу помочь?' :
               lang === 'ar' ? 'مرحباً! كيف يمكنني مساعدتك؟' :
               'Hello! How can I help you?';
    }
    
    return lang === 'it' ? `Ho ricevuto: "${question}". Al momento non posso fornire una risposta dettagliata.` :
           lang === 'es' ? `Recibí: "${question}". Actualmente no puedo dar una respuesta detallada.` :
           lang === 'pt' ? `Recebi: "${question}". No momento não posso dar uma resposta detalhada.` :
           lang === 'ru' ? `Получил: "${question}". Сейчас не могу дать подробный ответ.` :
           lang === 'ar' ? `تلقيت: "${question}". حالياً لا يمكنني تقديم إجابة مفصلة.` :
           `I received: "${question}". I currently cannot provide a detailed answer.`;
}

export default {
    name: 'ai',
    aliases: ['ask', 'gpt', 'chatgpt'],
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const lang = getGroupLanguage(from);
        const t = responses[lang] || responses.en;
        
        try {
            // Handle help command
            if (args[0] === 'help' || args.length === 0) {
                return await sock.sendMessage(from, { text: args[0] === 'help' ? t.help : t.usage });
            }
            
            // Handle special commands
            if (args[0] === 'clear') {
                conversations.delete(sender);
                return await sock.sendMessage(from, { text: t.historyCleared });
            }
            
            if (args[0] === 'mode') {
                const mode = args[1]?.toLowerCase();
                if (!mode || !AI_MODES[mode]) {
                    return await sock.sendMessage(from, { text: t.invalidMode });
                }
                userModes.set(sender, mode);
                return await sock.sendMessage(from, { 
                    text: `${t.modeChanged} ${mode} (${AI_MODES[mode]})`
                });
            }
            
            // Handle image analysis
            if (args[0] === 'image' || msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage) {
                const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                if (!quotedMsg?.imageMessage) {
                    return await sock.sendMessage(from, { text: t.noImage });
                }
                
                const question = args.slice(1).join(' ') || 'Describe this image in detail';
                
                await sock.sendMessage(from, { text: t.analyzing });
                
                const aiResponse = await getAIResponse(
                    `[Image Analysis Request] ${question}. Note: I cannot actually see images, but I can help analyze image-related questions.`,
                    lang,
                    sender,
                    true
                );
                
                return await sock.sendMessage(from, { text: `🖼️ ${aiResponse}` });
            }
            
            // Handle code analysis
            if (args[0] === 'code') {
                const code = args.slice(1).join(' ');
                if (!code) {
                    return await sock.sendMessage(from, { 
                        text: t.noQuestion + '\n\nExample: .ai code console.log("hello")'
                    });
                }
                
                const question = `Analyze and explain this code:\n\`\`\`\n${code}\n\`\`\``;
                
                await sock.sendMessage(from, { text: t.thinking });
                
                const aiResponse = await getAIResponse(question, lang, sender);
                return await sock.sendMessage(from, { text: `💻 ${aiResponse}` });
            }
            
            // Regular question
            const question = args.join(' ');
            const history = getConversation(sender);
            
            // Show context indicator if continuing conversation
            const statusMsg = history.length > 0 ? t.conversationContext : t.thinking;
            const thinkingMsg = await sock.sendMessage(from, { text: statusMsg });
            
            const aiResponse = await getAIResponse(question, lang, sender);
            
            const userMode = getUserMode(sender);
            const modeEmoji = userMode === 'code' ? '💻' :
                            userMode === 'creative' ? '✨' :
                            userMode === 'teacher' ? '👨‍🏫' :
                            userMode === 'analyst' ? '📊' :
                            userMode === 'translator' ? '🌐' : '🤖';
            
            const responseText = `${modeEmoji} AI Assistant${userMode !== 'default' ? ` (${userMode})` : ''}\n\n❓ ${question}\n\n💬 ${aiResponse}`;
            
            await sock.sendMessage(from, {
                text: responseText,
                edit: thinkingMsg.key
            });
            
        } catch (error) {
            console.error('[AI] Error:', error.message);
            await sock.sendMessage(from, {
                text: `${t.error} ${error.message}`
            });
        }
    }
};
