# Assistente Jurídico IA para Microsoft Word

Um add-in para Microsoft Word que utiliza IA para auxiliar advogados na redação e revisão de documentos jurídicos, com foco especial em direito eleitoral.

## Funcionalidades

- **Reescrever**: Melhora a clareza e profissionalismo do texto jurídico
- **Resumir**: Cria resumos concisos de textos jurídicos
- **Contra-Argumento**: Gera contra-argumentos jurídicos
- **Simplificar**: Torna a linguagem técnica mais acessível
- **Chat Personalizado**: Permite interação direta com a IA para solicitações específicas

## Configuração da API

O add-in requer uma chave API da OpenAI para funcionar. Para configurar:

1. Obtenha uma chave API em https://platform.openai.com/api-keys
2. Edite o arquivo `app.js` e insira sua chave API na constante `defaultConfig`

## Instalação

1. Clone este repositório:
   ```bash
   git clone https://github.com/DionattanCF/ai_word.git
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Execute o projeto:
   ```bash
   npm start
   ```

## Uso

1. Abra o Microsoft Word
2. Na aba "Página Inicial", clique no botão "Assistente Jurídico IA"
3. Para processar um texto:
   - Selecione o texto no documento
   - Clique em um dos botões de ação (Reescrever, Resumir, etc.)
   - Ou use o chat para instruções personalizadas
4. A resposta será exibida e, se desejar, inserida no documento

## Requisitos

- Microsoft Word (versão desktop)
- Navegador moderno com suporte a JavaScript
- Chave API OpenAI válida
- Node.js e npm instalados

## Desenvolvimento

Para modificar ou personalizar o complemento:

1. Edite os arquivos fonte conforme necessário:
   - `app.js`: Lógica principal e integração com a API
   - `index.html`: Interface do usuário
   - `styles.css`: Estilos e aparência
2. Execute `npm run dev` para compilar em modo de desenvolvimento
3. Execute `npm start` para iniciar o servidor de desenvolvimento

## Solução de Problemas

- **Erro de API**: Verifique se sua chave API está corretamente configurada
- **Erro de Certificado**: Execute `office-addin-dev-certs install`
- **Add-in não aparece**: Verifique se o servidor está rodando e recarregue o Word
- **Erros de execução**: Consulte o console do navegador (F12) para detalhes

## Segurança

- Nunca compartilhe sua chave API
- Configure a chave API apenas localmente
- Evite commitar a chave API no repositório
- As requisições são feitas diretamente para a OpenAI

## Suporte

Para suporte ou dúvidas:
- Abra uma issue no GitHub
- Entre em contato através do LinkedIn: https://www.linkedin.com/in/dionattan-figueiredo/

## Licença

Este projeto está licenciado sob a MIT License. 