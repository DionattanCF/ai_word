/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

'use strict';

const defaultConfig = {
    apiKey: '', // A chave API deve ser configurada via interface do usuário
    instructions: 'Você é um assistente jurídico especializado em direito eleitoral brasileiro. Seu objetivo é ajudar na análise e redação de documentos jurídicos, fornecendo sugestões precisas e fundamentadas na legislação eleitoral vigente.'
};

Office.onReady((info) => {
    if (info.host === Office.HostType.Word) {
        initializeApp();
    } else {
        showError('Este suplemento só funciona no Microsoft Word.');
    }
});

function initializeApp() {
    // Tenta carregar a chave API do localStorage
    const savedApiKey = localStorage.getItem('openaiApiKey');
    if (savedApiKey) {
        defaultConfig.apiKey = savedApiKey;
    }

    if (!defaultConfig.apiKey) {
        showError('Por favor, configure sua chave API nas configurações');
        return;
    }

    // Adiciona listeners para todos os botões
    document.querySelectorAll('button[data-action]').forEach(button => {
        button.addEventListener('click', (event) => {
            const action = event.currentTarget.getAttribute('data-action');
            processText(action);
        });
    });
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
        await Word.run(async (context) => {
            const range = context.document.getSelection();
            range.insertText(text, 'Replace');
            await context.sync();
        });
    } catch (error) {
        showError('Erro ao inserir o texto: ' + error.message);
    }
}

async function processText(action) {
    const selectedText = await getSelectedText();
    if (!selectedText) {
        showError('Por favor, selecione algum texto no documento.');
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
        const response = await createThread(userInstruction, selectedText);
        if (response && response.content) {
            showResponse(response.content);
            if (action !== 'counter') { // Não substitui o texto original para contra-argumentos
                await insertText(response.content);
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

async function createThread(instruction, text) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${defaultConfig.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: defaultConfig.instructions
                    },
                    {
                        role: 'user',
                        content: `${instruction}\n\n${text}`
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }

        const data = await response.json();
        return {
            content: data.choices[0].message.content
        };
    } catch (error) {
        throw new Error(`Erro na comunicação com a API: ${error.message}`);
    }
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
    
    localStorage.setItem('openaiApiKey', apiKey);
    defaultConfig.apiKey = apiKey; // Atualiza a configuração atual
    showResponse('Chave API salva com sucesso!');
    
    // Recarrega a página após 2 segundos
    setTimeout(() => {
        location.reload();
    }, 2000);
} 
