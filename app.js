Office.onReady(() => {
    // Initialize the add-in
    document.getElementById('saveApiKey').onclick = saveApiKey;
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

    // Load saved API key
    const savedApiKey = localStorage.getItem('openaiApiKey');
    if (savedApiKey) {
        document.getElementById('apiKey').value = savedApiKey;
    }
});

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

async function processText(action) {
    const apiKey = localStorage.getItem('openaiApiKey');
    if (!apiKey) {
        alert('Por favor, insira sua chave API OpenAI primeiro.');
        return;
    }

    showLoading(true);
    try {
        const selectedText = await getSelectedText();
        if (!selectedText) {
            alert('Por favor, selecione algum texto primeiro.');
            return;
        }

        const prompt = getPromptForAction(action, selectedText);
        const response = await callOpenAI(apiKey, prompt);
        
        document.getElementById('aiResponse').innerText = response;
    } catch (error) {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao processar o texto.');
    } finally {
        showLoading(false);
    }
}

function getPromptForAction(action, text) {
    const prompts = {
        rewrite: `Reescreva o seguinte texto jurídico de forma mais clara e profissional, mantendo o mesmo significado: "${text}"`,
        summarize: `Faça um resumo conciso do seguinte texto jurídico: "${text}"`,
        counterArg: `Gere um contra-argumento jurídico forte para o seguinte texto: "${text}"`,
        simplify: `Simplifique a linguagem técnica do seguinte texto jurídico, tornando-o mais acessível: "${text}"`
    };
    return prompts[action];
}

// Função para enviar um prompt personalizado
async function sendCustomPrompt() {
    const apiKey = localStorage.getItem('openaiApiKey');
    if (!apiKey) {
        alert('Por favor, insira sua chave API OpenAI primeiro.');
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
        const response = await callOpenAI(apiKey, fullPrompt);
        
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

async function callOpenAI(apiKey, prompt) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
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