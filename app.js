/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

'use strict';

const defaultConfig = {
    apiKey: '', // A chave API será configurada localmente
    instructions: `Você é um assistente jurídico especializado em direito eleitoral brasileiro. 
    Seu objetivo é ajudar na análise e redação de documentos jurídicos, fornecendo sugestões 
    precisas e fundamentadas na legislação eleitoral vigente.`
};

let Office = window.Office;

// Garantir que o Office.js está carregado antes de inicializar
if (window.Office) {
    initializeApp();
} else {
    window.addEventListener('load', () => {
        if (window.Office) {
            initializeApp();
        } else {
            showError('Erro: Office.js não foi carregado corretamente.');
        }
    });
}

function initializeApp() {
    try {
        Office.onReady(info => {
            if (info.host === Office.HostType.Word) {
                const responseContent = document.getElementById('response-content');
                if (responseContent) {
                    responseContent.innerHTML = 'Bem-vindo ao Assistente Jurídico IA!';
                }
                
                // Verificar se a chave API está configurada
                if (!defaultConfig.apiKey) {
                    showError('Por favor, configure sua chave API no arquivo app.js');
                }
            } else {
                showError('Este add-in funciona apenas no Microsoft Word.');
            }
        });
    } catch (error) {
        showError('Erro ao inicializar o add-in: ' + error.message);
    }
}

function showError(message) {
    const responseContent = document.getElementById('response-content');
    if (responseContent) {
        responseContent.innerHTML = `<div class="error">${message}</div>`;
    } else {
        console.error(message);
    }
}

async function getSelectedText() {
    return new Promise((resolve, reject) => {
        Office.context.document.getSelectedDataAsync(Office.CoercionType.Text, result => {
            if (result.status === Office.AsyncResultStatus.Succeeded) {
                resolve(result.value);
            } else {
                reject(new Error('Erro ao obter o texto selecionado'));
            }
        });
    });
}

async function insertText(text) {
    return new Promise((resolve, reject) => {
        Office.context.document.setSelectedDataAsync(text, { coercionType: Office.CoercionType.Text }, result => {
            if (result.status === Office.AsyncResultStatus.Succeeded) {
                resolve();
            } else {
                reject(new Error('Erro ao inserir o texto'));
            }
        });
    });
}

async function createAssistant(apiKey) {
    const response = await fetch('https://api.openai.com/v1/assistants', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'OpenAI-Beta': 'assistants=v1'
        },
        body: JSON.stringify({
            name: "Assistente Jurídico",
            instructions: defaultConfig.instructions,
            model: "gpt-4-turbo-preview",
            tools: [
                { type: "retrieval" },
                { type: "code_interpreter" }
            ]
        })
    });

    if (!response.ok) {
        throw new Error('Erro ao criar o assistente');
    }

    return await response.json();
}

async function createThread(apiKey) {
    const response = await fetch('https://api.openai.com/v1/threads', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'OpenAI-Beta': 'assistants=v1'
        }
    });

    if (!response.ok) {
        throw new Error('Erro ao criar o thread');
    }

    return await response.json();
}

async function addMessageToThread(apiKey, threadId, content) {
    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'OpenAI-Beta': 'assistants=v1'
        },
        body: JSON.stringify({
            role: "user",
            content: content
        })
    });

    if (!response.ok) {
        throw new Error('Erro ao adicionar mensagem ao thread');
    }

    return await response.json();
}

async function runAssistant(apiKey, threadId, assistantId) {
    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'OpenAI-Beta': 'assistants=v1'
        },
        body: JSON.stringify({
            assistant_id: assistantId
        })
    });

    if (!response.ok) {
        throw new Error('Erro ao executar o assistente');
    }

    return await response.json();
}

async function getThreadMessages(apiKey, threadId) {
    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'OpenAI-Beta': 'assistants=v1'
        }
    });

    if (!response.ok) {
        throw new Error('Erro ao obter mensagens do thread');
    }

    return await response.json();
}

async function waitForRunCompletion(apiKey, threadId, runId) {
    while (true) {
        const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'OpenAI-Beta': 'assistants=v1'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao verificar status do run');
        }

        const run = await response.json();
        if (run.status === 'completed') {
            return true;
        } else if (run.status === 'failed' || run.status === 'cancelled') {
            throw new Error(`Run ${run.status}`);
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

async function processText(action) {
    try {
        const responseContent = document.getElementById('response-content');
        responseContent.innerHTML = 'Processando...';

        const apiKey = defaultConfig.apiKey;
        if (!apiKey) {
            throw new Error('Chave API não configurada');
        }

        let selectedText = await getSelectedText();
        if (!selectedText && action !== 'chat') {
            throw new Error('Nenhum texto selecionado');
        }

        let prompt;
        const chatInput = document.getElementById('chat-input');
        
        switch (action) {
            case 'rewrite':
                prompt = `Reescreva o seguinte texto mantendo o mesmo significado, mas melhorando a clareza e a estrutura: ${selectedText}`;
                break;
            case 'summarize':
                prompt = `Faça um resumo conciso do seguinte texto: ${selectedText}`;
                break;
            case 'counter':
                prompt = `Analise o seguinte texto e forneça possíveis contra-argumentos jurídicos: ${selectedText}`;
                break;
            case 'simplify':
                prompt = `Simplifique o seguinte texto jurídico, tornando-o mais acessível sem perder o significado legal: ${selectedText}`;
                break;
            case 'chat':
                if (!chatInput.value.trim()) {
                    throw new Error('Digite sua mensagem no chat');
                }
                prompt = chatInput.value.trim();
                break;
            default:
                throw new Error('Ação inválida');
        }

        // Criar assistente e thread
        const assistant = await createAssistant(apiKey);
        const thread = await createThread(apiKey);

        // Adicionar mensagem e executar o assistente
        await addMessageToThread(apiKey, thread.id, prompt);
        const run = await runAssistant(apiKey, thread.id, assistant.id);

        // Aguardar conclusão e obter resposta
        await waitForRunCompletion(apiKey, thread.id, run.id);
        const messages = await getThreadMessages(apiKey, thread.id);

        // Exibir resposta
        const assistantMessage = messages.data.find(msg => msg.role === 'assistant');
        if (assistantMessage) {
            responseContent.innerHTML = assistantMessage.content[0].text.value.replace(/\n/g, '<br>');
            
            if (action !== 'chat') {
                await insertText(assistantMessage.content[0].text.value);
            }
        } else {
            throw new Error('Não foi possível obter a resposta do assistente');
        }

        // Limpar campo de chat após o envio
        if (action === 'chat') {
            chatInput.value = '';
        }

    } catch (error) {
        document.getElementById('response-content').innerHTML = `Erro: ${error.message}`;
        console.error('Erro:', error);
    }
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
    localStorage.setItem('openaiApiKey', apiKey);
    alert('Chave API salva com sucesso!');
} 