# Guia de Distribuição - Assistente Jurídico IA

Este documento fornece instruções detalhadas para distribuir o add-in Assistente Jurídico IA para Microsoft Word, especializado em direito eleitoral.

## Pré-requisitos

- Conta no GitHub
- Repositório público para hospedar o add-in
- Chave API OpenAI válida

## Passos para Distribuição

### 1. Preparar os Arquivos

Certifique-se de que os seguintes arquivos estão presentes e atualizados:

- `manifest.xml` e `manifest-dist.xml`: Arquivos de manifesto do add-in
- `index.html` e `index-dist.html`: Interface do usuário
- `app.js`: Código JavaScript principal
- `styles.css`: Estilos da interface
- `assets/`: Diretório com ícones do add-in

### 2. Configurar o GitHub Pages

1. Acesse https://github.com/DionattanCF/ai_word
2. Na seção "Settings" > "Pages":
   - Selecione a branch `main`
   - Escolha a pasta raiz (/)
   - Clique em "Save"
3. Aguarde a publicação do site

### 3. Configurar a Chave API

1. Obtenha uma chave API em https://platform.openai.com/api-keys
2. Edite o arquivo `app.js`
3. Localize a constante `defaultConfig`
4. Insira sua chave API no campo `apiKey`

### 4. Testar o Add-in

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```
3. Teste todas as funcionalidades:
   - Reescrever texto
   - Resumir texto
   - Gerar contra-argumentos
   - Simplificar texto
   - Chat personalizado

### 5. Distribuir o Add-in

1. Faça o build do projeto:
   ```bash
   npm run build
   ```
2. Commit e push das alterações:
   ```bash
   git add .
   git commit -m "Atualização para distribuição"
   git push origin main
   ```
3. Compartilhe o link do manifest.xml com os usuários

## Instruções para Usuários

### Instalação

1. Abra o Microsoft Word
2. Na guia "Inserir", clique em "Suplementos"
3. Selecione "Gerenciar Suplementos"
4. Clique em "Suplementos de Desenvolvedor"
5. Cole o URL: https://dionattancf.github.io/ai_word/manifest.xml
6. Clique em "OK"

### Uso

1. Na aba "Página Inicial", clique no botão "Assistente Jurídico IA"
2. Para processar um texto:
   - Selecione o texto no documento
   - Clique em um dos botões de ação
   - Ou use o chat para instruções personalizadas
3. A resposta será exibida e, se desejar, inserida no documento

## Solução de Problemas

### Problemas Comuns

1. **Add-in não carrega**
   - Verifique sua conexão com a internet
   - Certifique-se de que o URL do manifest está correto
   - Tente reinstalar o add-in

2. **Erro de API**
   - Verifique se a chave API está configurada corretamente
   - Confirme se sua conta OpenAI tem créditos disponíveis
   - Verifique se o modelo GPT-4 Turbo está disponível

3. **Erros de execução**
   - Consulte o console do navegador (F12)
   - Verifique se o texto está selecionado antes de usar as funções
   - Tente recarregar o add-in

### Suporte

Para suporte técnico:
1. Abra uma issue em https://github.com/DionattanCF/ai_word/issues
2. Entre em contato via LinkedIn: https://www.linkedin.com/in/dionattan-figueiredo/

## Manutenção

### Atualizações

1. Faça alterações no código fonte
2. Teste localmente com `npm start`
3. Faça o build com `npm run build`
4. Commit e push para o GitHub
5. Verifique a publicação no GitHub Pages

### Monitoramento

1. Verifique os logs no console do navegador
2. Monitore o uso da API OpenAI
3. Acompanhe as issues no GitHub

## Segurança

### Boas Práticas

1. Nunca compartilhe sua chave API
2. Configure a chave API apenas localmente
3. Use HTTPS para todas as comunicações
4. Mantenha as dependências atualizadas

### Privacidade

1. Não são coletados dados pessoais
2. As configurações são armazenadas localmente
3. A comunicação é feita diretamente com a OpenAI

## Recursos Adicionais

- [Documentação do Office Add-ins](https://docs.microsoft.com/office/dev/add-ins/)
- [Documentação da OpenAI](https://platform.openai.com/docs)
- [GitHub do Projeto](https://github.com/DionattanCF/ai_word) 