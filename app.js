/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

'use strict';

const defaultConfig = {
    apiKey: '', // A chave API deve ser configurada via interface do usuário
    assistants: [] // Lista de assistentes disponíveis
};

// Variável para armazenar o ID do thread atual
let currentThreadId = null;
// Variável para armazenar o assistente atualmente selecionado
let currentAssistant = null;

Office.onReady((info) => {
    if (info.host === Office.HostType.Word) {
        initializeApp();
    } else {
        showError('Este suplemento só funciona no Microsoft Word.');
    }
});

function initializeApp() {
    // Tenta carregar as configurações do localStorage
    const savedApiKey = localStorage.getItem('openaiApiKey');
    const savedAssistants = localStorage.getItem('openaiAssistants');
    
    if (savedApiKey) {
        defaultConfig.apiKey = savedApiKey;
    }
    
    if (savedAssistants) {
        try {
            defaultConfig.assistants = JSON.parse(savedAssistants);
        } catch (e) {
            console.error('Erro ao carregar assistentes:', e);
            defaultConfig.assistants = [];
        }
    }

    // Preenche o dropdown com os assistentes disponíveis
    populateAssistantDropdown();

    // Mostra ou esconde a seção de configuração
    const configSection = document.getElementById('config-section');
    if (!defaultConfig.apiKey || defaultConfig.assistants.length === 0) {
        showConfigSection();
        showError('Por favor, configure sua chave API e adicione ao menos um assistente para continuar');
        return;
    }

    // Preenche os campos de configuração
    document.getElementById('apiKey').value = defaultConfig.apiKey;
    
    // Adiciona evento de mudança ao seletor de assistentes
    document.getElementById('current-assistant').addEventListener('change', handleAssistantChange);
    
    // Seleciona o primeiro assistente por padrão, se houver
    if (defaultConfig.assistants.length > 0) {
        document.getElementById('current-assistant').value = defaultConfig.assistants[0].id;
        currentAssistant = defaultConfig.assistants[0];
        createNewThread();
    }

    // Renderiza a lista de assistentes na seção de configuração
    renderAssistantsList();

    // Adiciona listeners para todos os botões
    document.querySelectorAll('button[data-action]').forEach(button => {
        button.addEventListener('click', (event) => {
            const action = event.currentTarget.getAttribute('data-action');
            processText(action);
        });
    });
}

function showConfigSection() {
    const configSection = document.getElementById('config-section');
    configSection.classList.add('visible');
}

function hideConfigSection() {
    const configSection = document.getElementById('config-section');
    configSection.classList.remove('visible');
}

function populateAssistantDropdown() {
    const dropdown = document.getElementById('current-assistant');
    // Limpa opções existentes, exceto a primeira (placeholder)
    while (dropdown.options.length > 1) {
        dropdown.remove(1);
    }
    
    // Adiciona os assistentes ao dropdown
    defaultConfig.assistants.forEach(assistant => {
        const option = document.createElement('option');
        option.value = assistant.id;
        option.textContent = assistant.name;
        dropdown.appendChild(option);
    });
}

function renderAssistantsList() {
    const listContainer = document.getElementById('assistants-list');
    listContainer.innerHTML = '';
    
    if (defaultConfig.assistants.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'Nenhum assistente configurado. Adicione um para começar.';
        listContainer.appendChild(emptyMessage);
        return;
    }
    
    defaultConfig.assistants.forEach((assistant, index) => {
        const assistantItem = document.createElement('div');
        assistantItem.className = 'assistant-item';
        
        const infoDiv = document.createElement('div');
        infoDiv.className = 'assistant-info';
        
        const nameElem = document.createElement('div');
        nameElem.className = 'assistant-name';
        nameElem.textContent = assistant.name;
        
        const idElem = document.createElement('div');
        idElem.className = 'assistant-id';
        idElem.textContent = assistant.id;
        
        infoDiv.appendChild(nameElem);
        infoDiv.appendChild(idElem);
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'assistant-actions';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="ms-Icon ms-Icon--Delete"></i>';
        deleteBtn.title = 'Remover';
        deleteBtn.onclick = () => removeAssistant(index);
        
        actionsDiv.appendChild(deleteBtn);
        
        assistantItem.appendChild(infoDiv);
        assistantItem.appendChild(actionsDiv);
        
        listContainer.appendChild(assistantItem);
    });
}

function addAssistant() {
    const name = document.getElementById('assistantName').value.trim();
    const id = document.getElementById('assistantId').value.trim();
    
    if (!name) {
        showError('Por favor, dê um nome ao assistente');
        return;
    }
    
    if (!id) {
        showError('Por favor, insira um ID de Assistente válido');
        return;
    }
    
    // Adiciona o novo assistente à lista
    defaultConfig.assistants.push({
        name: name,
        id: id
    });
    
    // Salva a lista atualizada
    localStorage.setItem('openaiAssistants', JSON.stringify(defaultConfig.assistants));
    
    // Atualiza a interface
    renderAssistantsList();
    populateAssistantDropdown();
    
    // Limpa os campos
    document.getElementById('assistantName').value = '';
    document.getElementById('assistantId').value = '';
    
    showResponse('Assistente adicionado com sucesso!');
}

function removeAssistant(index) {
    if (index < 0 || index >= defaultConfig.assistants.length) return;
    
    const removedAssistant = defaultConfig.assistants[index];
    defaultConfig.assistants.splice(index, 1);
    
    // Salva a lista atualizada
    localStorage.setItem('openaiAssistants', JSON.stringify(defaultConfig.assistants));
    
    // Atualiza a interface
    renderAssistantsList();
    populateAssistantDropdown();
    
    // Se o assistente removido era o atual, seleciona outro ou limpa
    if (currentAssistant && currentAssistant.id === removedAssistant.id) {
        if (defaultConfig.assistants.length > 0) {
            document.getElementById('current-assistant').value = defaultConfig.assistants[0].id;
            currentAssistant = defaultConfig.assistants[0];
            createNewThread();
        } else {
            document.getElementById('current-assistant').value = '';
            currentAssistant = null;
        }
    }
    
    showResponse('Assistente removido!');
}

function handleAssistantChange(event) {
    const assistantId = event.target.value;
    if (!assistantId) {
        currentAssistant = null;
        return;
    }
    
    const selectedAssistant = defaultConfig.assistants.find(a => a.id === assistantId);
    if (selectedAssistant) {
        currentAssistant = selectedAssistant;
        createNewThread();
    }
}

async function getSelectedText() {
    try {
        return await Word.run(async (context) => {
            const range = context.document.getSelection();
            range.load('text');
            await context.sync();
            return range.text;
        });
    } catch (error) {
        showError('Erro ao obter o texto selecionado: ' + error.message);
        return null;
    }
}

async function insertText(text) {
    try {
        // Remove qualquer tag HTML que possa estar presente antes de inserir no documento
        const cleanText = text.replace(/<\/?[^>]+(>|$)/g, "");
        
        await Word.run(async (context) => {
            const range = context.document.getSelection();
            
            // Aplica o texto limpo
            range.insertText(cleanText, 'Replace');
            
            // Aplica formatação básica se necessário
            // Isso pode ser expandido conforme necessidade
            range.load('text');
            await context.sync();
            
            // Opcional: adicionar espaçamento de linha adequado
            range.paragraphs.spacing = {
                before: 6,
                after: 6
            };
            
            await context.sync();
        });
    } catch (error) {
        showError('Erro ao inserir o texto: ' + error.message);
    }
}

let lastResponse = null; // Variável para armazenar a última resposta

// Função para formatar o texto recebido da OpenAI
function formatResponseText(text) {
    if (!text) return '';
    
    // Remove caracteres especiais usados para formatação pela OpenAI
    let formattedText = text
        // Remove separadores especiais
        .replace(/^---+$/gm, '') 
        .replace(/^\*\*\*+$/gm, '') 
        .replace(/^#+$/gm, '') 
        .replace(/^==+$/gm, '')
        .replace(/^__+$/gm, '')
        
        // Limpa o uso de asteriscos e sublinhados no início e fim das linhas
        .replace(/^\*\*|\*\*$/gm, '')
        .replace(/^__|\__$/gm, '')
        
        // Trata listas 
        .replace(/^\s*[-*]\s+/gm, '• ') // Converte marcadores de lista para bullets
        .replace(/^\s*\d+\.\s+/gm, (match) => match) // Preserva listas numeradas
        
        // Trata formatação básica de Markdown mantendo negrito e itálico
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/__(.*?)__/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/_(.*?)_/g, '<em>$1</em>')
        
        // Trata formatação de parágrafos
        .replace(/\n{3,}/g, '\n\n') // Limita a 2 quebras de linha consecutivas
        
        // Trata citações
        .replace(/^>\s*(.*?)$/gm, '<blockquote>$1</blockquote>')
        
        .trim();
    
    // Se o texto começar com marcadores de lista ou números, garante que há um espaço no início
    if (formattedText.match(/^[•\d\.]/)) {
        formattedText = '\n' + formattedText;
    }
    
    // Garante que parágrafos tenham espaçamento adequado
    formattedText = formattedText
        .replace(/([^\n])\n([^\n•\d])/g, '$1\n\n$2') // Adiciona linha em branco entre parágrafos normais
        .replace(/\n{3,}/g, '\n\n'); // Limita novamente a 2 quebras de linha
    
    return formattedText;
}

async function processText(action) {
    const selectedText = await getSelectedText();
    if (!selectedText) {
        showError('Por favor, selecione algum texto no documento.');
        return;
    }

    // Verifica se temos as configurações necessárias
    if (!defaultConfig.apiKey || !currentAssistant || !currentThreadId) {
        if (!currentAssistant) {
            showError('Selecione um assistente para continuar.');
            return;
        }
        
        showError('Configuração incompleta. Por favor, configure sua chave API e selecione um assistente.');
        showConfigSection();
        return;
    }

    const chatInput = document.getElementById('chat-input');
    let userInstruction = '';

    switch (action) {
        case 'rewrite':
            userInstruction = 'Reescreva o seguinte texto mantendo o mesmo significado, mas com uma estrutura mais clara e profissional:';
            break;
        case 'summarize':
            userInstruction = 'Faça um resumo conciso do seguinte texto, mantendo os pontos principais:';
            break;
        case 'counter':
            userInstruction = 'Analise o seguinte texto e forneça possíveis contra-argumentos jurídicos:';
            break;
        case 'simplify':
            userInstruction = 'Simplifique o seguinte texto jurídico para uma linguagem mais acessível:';
            break;
        case 'chat':
            userInstruction = chatInput.value || 'Analise o seguinte texto:';
            break;
        default:
            showError('Ação não reconhecida');
            return;
    }

    try {
        showResponse('Processando...');
        
        // Usar API de Assistentes
        const response = await processWithAssistant(userInstruction, selectedText);
        
        if (response && response.content) {
            // Formata o texto da resposta
            const formattedContent = formatResponseText(response.content);
            lastResponse = formattedContent; // Armazena a resposta formatada
            
            // Exibe a resposta formatada
            showFormattedResponse(formattedContent);
            
            // Mostra o botão "Aplicar ao Texto" apenas se não for uma ação de contra-argumento
            const applyButton = document.getElementById('apply-text');
            if (action !== 'counter') {
                applyButton.style.display = 'inline-block';
                applyButton.onclick = () => insertText(lastResponse);
            } else {
                applyButton.style.display = 'none';
            }
        }
    } catch (error) {
        showError('Erro ao processar o texto: ' + error.message);
    } finally {
        if (action === 'chat') {
            chatInput.value = ''; // Limpa o campo de entrada após o envio
        }
    }
}

function showFormattedResponse(message) {
    const responseContent = document.getElementById('response-content');
    
    // Aplicar formatação HTML para a exibição
    let htmlFormatted = message
        // Quebras de linha para HTML
        .replace(/\n\n/g, '</p><p>') // Parágrafos
        .replace(/\n/g, '<br>') // Quebras de linha simples
        
        // Preserva formatação
        .replace(/<strong>(.*?)<\/strong>/g, '<strong>$1</strong>')
        .replace(/<em>(.*?)<\/em>/g, '<em>$1</em>')
        
        // Blocos de citação
        .replace(/<blockquote>(.*?)<\/blockquote>/g, '<blockquote>$1</blockquote>')
        
        // Listas
        .replace(/^•\s*(.*?)(?=<br>|<\/p>|$)/gm, '<li>$1</li>');
    
    // Envolve o conteúdo em parágrafos se ainda não estiver
    if (!htmlFormatted.startsWith('<p>')) {
        htmlFormatted = '<p>' + htmlFormatted;
    }
    if (!htmlFormatted.endsWith('</p>')) {
        htmlFormatted = htmlFormatted + '</p>';
    }
    
    // Corrige eventuais parágrafos vazios
    htmlFormatted = htmlFormatted
        .replace(/<p>\s*<\/p>/g, '')
        .replace(/<p><li>/g, '<ul><li>') // Início de lista
        .replace(/<\/li><\/p>/g, '</li></ul>') // Fim de lista
        .replace(/<\/li><br><li>/g, '</li><li>'); // Itens de lista
    
    responseContent.innerHTML = htmlFormatted;
    responseContent.parentElement.style.display = 'block';
}

function showResponse(message) {
    const responseContent = document.getElementById('response-content');
    responseContent.textContent = message;
    responseContent.parentElement.style.display = 'block';
}

function showError(message) {
    const responseContent = document.getElementById('response-content');
    responseContent.textContent = message;
    responseContent.parentElement.classList.add('error');
    responseContent.parentElement.style.display = 'block';
    
    // Remove a classe de erro após 5 segundos
    setTimeout(() => {
        responseContent.parentElement.classList.remove('error');
    }, 5000);
}

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

async function saveApiKey() {
    const apiKey = document.getElementById('apiKey').value;

    if (!apiKey) {
        showError('Por favor, insira uma chave API válida');
        return;
    }
    
    // Salva a chave API
    localStorage.setItem('openaiApiKey', apiKey);
    defaultConfig.apiKey = apiKey;
    
    showResponse('Configurações salvas com sucesso!');
    
    // Se não houver assistentes adicionados, mantém a tela de configuração aberta
    if (defaultConfig.assistants.length === 0) {
        showError('Por favor, adicione pelo menos um assistente para continuar');
        return;
    }
    
    hideConfigSection();
    
    // Se houver assistentes mas nenhum selecionado, seleciona o primeiro
    if (!currentAssistant && defaultConfig.assistants.length > 0) {
        document.getElementById('current-assistant').value = defaultConfig.assistants[0].id;
        currentAssistant = defaultConfig.assistants[0];
    }
    
    // Cria um novo thread para o assistente
    if (currentAssistant) {
        await createNewThread();
    }
}

// Cria um novo thread para a API de Assistentes
async function createNewThread() {
    if (!currentAssistant || !defaultConfig.apiKey) return;
    
    try {
        const response = await fetch('https://api.openai.com/v1/threads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${defaultConfig.apiKey}`,
                'OpenAI-Beta': 'assistants=v2'
            },
            body: JSON.stringify({})
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Erro ao criar thread:', response.status, errorData);
            throw new Error(`Erro ao criar thread: ${response.status} - ${errorData.error?.message || 'Erro desconhecido'}`);
        }

        const data = await response.json();
        currentThreadId = data.id;
        console.log('Novo thread criado:', currentThreadId);
    } catch (error) {
        console.error('Erro ao criar thread:', error);
        showError('Erro ao inicializar conversa: ' + error.message);
    }
}

// Função para processar texto usando a API de Assistentes
async function processWithAssistant(instruction, text) {
    try {
        // Adiciona a mensagem ao thread
        const messageResponse = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${defaultConfig.apiKey}`,
                'OpenAI-Beta': 'assistants=v2'
            },
            body: JSON.stringify({
                role: 'user',
                content: `${instruction}\n\n${text}`
            })
        });

        if (!messageResponse.ok) {
            const errorData = await messageResponse.json().catch(() => ({}));
            throw new Error(`Erro ao adicionar mensagem: ${messageResponse.status} - ${errorData.error?.message || 'Erro desconhecido'}`);
        }

        // Executa o assistente no thread
        const runResponse = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/runs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${defaultConfig.apiKey}`,
                'OpenAI-Beta': 'assistants=v2'
            },
            body: JSON.stringify({
                assistant_id: currentAssistant.id
            })
        });

        if (!runResponse.ok) {
            const errorData = await runResponse.json().catch(() => ({}));
            throw new Error(`Erro ao executar assistente: ${runResponse.status} - ${errorData.error?.message || 'Erro desconhecido'}`);
        }

        const runData = await runResponse.json();
        const runId = runData.id;

        // Verifica o status da execução
        let runStatus = 'in_progress';
        while (runStatus === 'in_progress' || runStatus === 'queued') {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Aguarda 1 segundo
            
            const statusResponse = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/runs/${runId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${defaultConfig.apiKey}`,
                    'OpenAI-Beta': 'assistants=v2'
                }
            });

            if (!statusResponse.ok) {
                const errorData = await statusResponse.json().catch(() => ({}));
                throw new Error(`Erro ao verificar status: ${statusResponse.status} - ${errorData.error?.message || 'Erro desconhecido'}`);
            }

            const statusData = await statusResponse.json();
            runStatus = statusData.status;
        }

        if (runStatus !== 'completed') {
            throw new Error(`Execução falhou com status: ${runStatus}`);
        }

        // Obtém as mensagens do thread
        const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/messages`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${defaultConfig.apiKey}`,
                'OpenAI-Beta': 'assistants=v2'
            }
        });

        if (!messagesResponse.ok) {
            const errorData = await messagesResponse.json().catch(() => ({}));
            throw new Error(`Erro ao obter mensagens: ${messagesResponse.status} - ${errorData.error?.message || 'Erro desconhecido'}`);
        }

        const messagesData = await messagesResponse.json();
        
        // Obtém a última mensagem do assistente
        const assistantMessages = messagesData.data.filter(msg => msg.role === 'assistant');
        if (assistantMessages.length === 0) {
            throw new Error('Nenhuma resposta do assistente encontrada');
        }

        const lastMessage = assistantMessages[0];
        // Ajuste para o formato v2 da API de Assistentes
        let messageContent = '';
        if (lastMessage.content && lastMessage.content.length > 0) {
            const textContent = lastMessage.content.find(item => item.type === 'text');
            if (textContent && textContent.text) {
                messageContent = textContent.text.value;
            }
        }
        
        if (!messageContent) {
            throw new Error('Formato de resposta não reconhecido');
        }
        
        return {
            content: messageContent
        };
    } catch (error) {
        throw new Error(`Erro ao usar assistente: ${error.message}`);
    }
} 
