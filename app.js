Office.onReady(() => {
    // Initialize the add-in
    document.getElementById('saveSettings').onclick = saveSettings;
    document.getElementById('rewriteBtn').onclick = () => processText('rewrite');
    document.getElementById('summarizeBtn').onclick = () => processText('summarize');
    document.getElementById('counterArgBtn').onclick = () => processText('counterArg');
    document.getElementById('simplifyBtn').onclick = () => processText('simplify');
    document.getElementById('applyBtn').onclick = applyToDocument;
    
    // Inicializar os eventos do chat
    document.getElementById('sendPromptBtn').onclick = sendCustomPrompt;
    document.getElementById('applyChatResponseBtn').onclick = applyChatResponse;
    
    // Permitir enviar mensagem com Enter (Shift+Enter para nova linha)
    document.getElementById('customPrompt').addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendCustomPrompt();
        }
    });

    // Carregar configurações salvas
    loadSettings();

    // Load saved API key
    const savedApiKey = localStorage.getItem('openaiApiKey');
    if (savedApiKey) {
        document.getElementById('apiKey').value = savedApiKey;
    }
});

// Funções de configuração
function saveSettings() {
    console.log('Tentando salvar configurações...');
    const settings = {
        apiKey: document.getElementById('apiKey').value,
        gptModel: document.getElementById('gptModel').value,
        customPrompts: document.getElementById('customPrompts').value
    };
    
    console.log('Configurações a serem salvas:', settings);
    localStorage.setItem('aiAssistantSettings', JSON.stringify(settings));
    console.log('Configurações salvas no localStorage');
    alert('Configurações salvas com sucesso!');
}

function loadSettings() {
    console.log('Carregando configurações...');
    const savedSettings = localStorage.getItem('aiAssistantSettings');
    console.log('Configurações encontradas:', savedSettings);
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        document.getElementById('apiKey').value = settings.apiKey || '';
        document.getElementById('gptModel').value = settings.gptModel || 'gpt-3.5-turbo';
        document.getElementById('customPrompts').value = settings.customPrompts || '';
        console.log('Configurações carregadas:', settings);
    }
}

function getSettings() {
    const savedSettings = localStorage.getItem('aiAssistantSettings');
    if (savedSettings) {
        return JSON.parse(savedSettings);
    }
    return {
        apiKey: '',
        gptModel: 'gpt-3.5-turbo',
        customPrompts: ''
    };
}

async function saveApiKey() {
    const apiKey = document.getElementById('apiKey').value;
    localStorage.setItem('openaiApiKey', apiKey);
    alert('Chave API salva com sucesso!');
}

async function getSelectedText() {
    return new Promise((resolve, reject) => {
        Word.run(async (context) => {
            const range = context.document.getSelection();
            range.load('text');
            await context.sync();
            resolve(range.text);
        }).catch(reject);
    });
}

// Função para criar um assistente
async function createAssistant(apiKey) {
    const response = await fetch('https://api.openai.com/v1/assistants', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v1'
        },
        body: JSON.stringify({
            name: "Assistente Jurídico",
            instructions: "Você é um assistente especializado em direito, capaz de ajudar com redação jurídica, análise de documentos e consultas legais.",
            model: "gpt-4-turbo-preview",
            tools: [
                {
                    type: "function",
                    function: {
                        name: "rewrite_legal_text",
                        description: "Reescreve texto jurídico de forma mais clara e profissional",
                        parameters: {
                            type: "object",
                            properties: {
                                text: {
                                    type: "string",
                                    description: "O texto jurídico a ser reescrito"
                                }
                            },
                            required: ["text"]
                        }
                    }
                },
                {
                    type: "function",
                    function: {
                        name: "summarize_legal_text",
                        description: "Cria um resumo conciso de texto jurídico",
                        parameters: {
                            type: "object",
                            properties: {
                                text: {
                                    type: "string",
                                    description: "O texto jurídico a ser resumido"
                                }
                            },
                            required: ["text"]
                        }
                    }
                }
            ]
        })
    });
    return await response.json();
}

// Função para criar uma thread
async function createThread(apiKey) {
    const response = await fetch('https://api.openai.com/v1/threads', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v1'
        }
    });
    return await response.json();
}

// Função para adicionar uma mensagem à thread
async function addMessageToThread(apiKey, threadId, content) {
    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v1'
        },
        body: JSON.stringify({
            role: "user",
            content: content
        })
    });
    return await response.json();
}

// Função para executar o assistente
async function runAssistant(apiKey, threadId, assistantId) {
    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v1'
        },
        body: JSON.stringify({
            assistant_id: assistantId
        })
    });
    return await response.json();
}

// Função para obter as mensagens da thread
async function getThreadMessages(apiKey, threadId) {
    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'OpenAI-Beta': 'assistants=v1'
        }
    });
    return await response.json();
}

// Função modificada para processar texto usando Assistants
async function processText(action) {
    const settings = getSettings();
    if (!settings.apiKey) {
        alert('Por favor, configure sua chave API nas configurações.');
        return;
    }

    showLoading(true);
    try {
        const selectedText = await getSelectedText();
        if (!selectedText) {
            alert('Por favor, selecione algum texto primeiro.');
            return;
        }

        // Criar ou obter assistente
        let assistantId = localStorage.getItem('assistantId');
        if (!assistantId) {
            const assistant = await createAssistant(settings.apiKey);
            assistantId = assistant.id;
            localStorage.setItem('assistantId', assistantId);
        }

        // Criar ou obter thread
        let threadId = localStorage.getItem('threadId');
        if (!threadId) {
            const thread = await createThread(settings.apiKey);
            threadId = thread.id;
            localStorage.setItem('threadId', threadId);
        }

        // Adicionar mensagem à thread
        const prompt = getPromptForAction(action, selectedText);
        await addMessageToThread(settings.apiKey, threadId, prompt);

        // Executar assistente
        const run = await runAssistant(settings.apiKey, threadId, assistantId);

        // Aguardar conclusão
        let runStatus = run.status;
        while (runStatus === 'in_progress' || runStatus === 'queued') {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const runStatusResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${run.id}`, {
                headers: {
                    'Authorization': `Bearer ${settings.apiKey}`,
                    'OpenAI-Beta': 'assistants=v1'
                }
            });
            const runStatusData = await runStatusResponse.json();
            runStatus = runStatusData.status;
        }

        // Obter resposta
        const messages = await getThreadMessages(settings.apiKey, threadId);
        const lastMessage = messages.data[0];
        
        document.getElementById('aiResponse').innerText = lastMessage.content[0].text.value;
    } catch (error) {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao processar o texto.');
    } finally {
        showLoading(false);
    }
}

function getPromptForAction(action, text) {
    const settings = getSettings();
    const customPrompts = settings.customPrompts.split('\n').filter(p => p.trim());
    
    const defaultPrompts = {
        rewrite: `Reescreva o seguinte texto jurídico de forma mais clara e profissional, mantendo o mesmo significado: "${text}"`,
        summarize: `Faça um resumo conciso do seguinte texto jurídico: "${text}"`,
        counterArg: `Gere um contra-argumento jurídico forte para o seguinte texto: "${text}"`,
        simplify: `Simplifique a linguagem técnica do seguinte texto jurídico, tornando-o mais acessível: "${text}"`
    };

    // Se houver prompts personalizados, adicione-os ao prompt padrão
    if (customPrompts.length > 0) {
        const customInstructions = customPrompts.join('\n');
        return `${customInstructions}\n\n${defaultPrompts[action]}`;
    }

    return defaultPrompts[action];
}

// Função para enviar um prompt personalizado
async function sendCustomPrompt() {
    const settings = getSettings();
    if (!settings.apiKey) {
        alert('Por favor, configure sua chave API nas configurações.');
        return;
    }

    const promptInput = document.getElementById('customPrompt');
    const promptText = promptInput.value.trim();
    
    if (!promptText) {
        alert('Por favor, digite uma instrução para a IA.');
        return;
    }

    try {
        // Obter texto selecionado
        const selectedText = await getSelectedText();
        if (!selectedText) {
            alert('Por favor, selecione algum texto primeiro.');
            return;
        }

        // Adicionar mensagem do usuário ao chat
        addMessageToChat('user', promptText);
        promptInput.value = '';
        
        showLoading(true);
        
        // Criar prompt completo com o texto selecionado
        const fullPrompt = `${promptText}\n\nTexto selecionado: "${selectedText}"`;
        
        // Chamar a API
        const response = await callOpenAI(settings.apiKey, fullPrompt, settings.gptModel);
        
        // Adicionar resposta ao chat
        addMessageToChat('ai', response);
        
        // Garantir que o chat role para a mensagem mais recente
        const chatBox = document.getElementById('chatMessages');
        chatBox.scrollTop = chatBox.scrollHeight;
        
    } catch (error) {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao processar sua solicitação.');
    } finally {
        showLoading(false);
    }
}

// Função para adicionar mensagem ao chat
function addMessageToChat(role, message) {
    const chatBox = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    
    if (role === 'user') {
        messageDiv.className = 'user-message';
    } else if (role === 'ai') {
        messageDiv.className = 'ai-message';
    } else {
        messageDiv.className = 'system-message';
    }
    
    messageDiv.textContent = message;
    chatBox.appendChild(messageDiv);
}

// Função para aplicar a última resposta do chat ao documento
async function applyChatResponse() {
    const chatBox = document.getElementById('chatMessages');
    const messages = chatBox.getElementsByClassName('ai-message');
    
    if (messages.length === 0) {
        alert('Não há respostas da IA para aplicar.');
        return;
    }
    
    // Pegar a última mensagem da IA
    const lastResponse = messages[messages.length - 1].textContent;
    
    Word.run(async (context) => {
        const range = context.document.getSelection();
        range.insertText(lastResponse, 'Replace');
        await context.sync();
    }).catch(error => {
        console.error('Erro ao aplicar texto:', error);
        alert('Erro ao aplicar o texto ao documento.');
    });
}

async function callOpenAI(apiKey, prompt, model) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: model,
            messages: [
                {
                    role: "system",
                    content: "Você é um assistente jurídico especializado em ajudar advogados a melhorar seus textos."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 500
        })
    });

    const data = await response.json();
    return data.choices[0].message.content;
}

async function applyToDocument() {
    const responseText = document.getElementById('aiResponse').innerText;
    if (!responseText) {
        alert('Nenhuma resposta da IA para aplicar.');
        return;
    }

    Word.run(async (context) => {
        const range = context.document.getSelection();
        range.insertText(responseText, 'Replace');
        await context.sync();
    }).catch(error => {
        console.error('Erro ao aplicar texto:', error);
        alert('Erro ao aplicar o texto ao documento.');
    });
}

function showLoading(show) {
    document.getElementById('loadingIndicator').style.display = show ? 'flex' : 'none';
} 