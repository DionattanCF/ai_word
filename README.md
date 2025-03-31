# Assistente Jurídico IA para Microsoft Word

Um add-in para Microsoft Word que utiliza IA para auxiliar advogados na redação e revisão de documentos jurídicos.

## Funcionalidades

- **Reescrever**: Melhora a clareza e profissionalismo do texto jurídico
- **Resumir**: Cria resumos concisos de textos jurídicos
- **Contra-Argumento**: Gera contra-argumentos jurídicos
- **Simplificar**: Torna a linguagem técnica mais acessível
- **Chat Personalizado**: Permite interação direta com a IA para solicitações específicas

## Configurações

O add-in oferece uma seção de configurações onde você pode:

1. **Chave API OpenAI**: Configurar sua chave de API para acessar os serviços da OpenAI
2. **Modelo GPT**: Escolher entre diferentes modelos GPT:
   - GPT-3.5 Turbo (padrão)
   - GPT-4
   - GPT-4 Turbo
3. **Prompts Personalizados**: Adicionar instruções personalizadas que serão incluídas em todas as interações com a IA

## Instalação

1. Clone este repositório
2. Abra o projeto no Visual Studio Code
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Execute o projeto:
   ```bash
   npm start
   ```

## Uso

1. Abra o Microsoft Word
2. Selecione o texto que deseja processar
3. Escolha uma das opções disponíveis:
   - Clique em um dos botões de ação (Reescrever, Resumir, etc.)
   - Use o chat personalizado para solicitações específicas
4. Revise a resposta da IA
5. Clique em "Aplicar ao Documento" para inserir a resposta

## Requisitos

- Microsoft Word (versão desktop)
- Navegador moderno com suporte a JavaScript
- Chave API OpenAI válida

## Contribuição

Contribuições são bem-vindas! Por favor, sinta-se à vontade para submeter pull requests.

## Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Solução de Problemas

- **Erro ao conectar com a API**: Verifique se a chave da API está correta e se sua conta tem saldo disponível
- **Erro "O aplicativo não confia no certificado..."**: Instale os certificados de desenvolvimento com `office-addin-dev-certs install`
- **Complemento não aparece**: Verifique se o servidor está rodando com `npm start` e tente registrar o manifesto novamente
- **Erro no carregamento**: Verifique os logs no console do navegador (F12) para mais detalhes

## Exemplos de Instruções Personalizadas

Você pode personalizar suas instruções no chat, por exemplo:
- "Encontre pontos fracos neste argumento jurídico"
- "Converta este texto para a linguagem exigida pelo TJ-SP"
- "Adicione citações de doutrinas relevantes neste texto"
- "Reformule usando a jurisprudência mais recente do STF"
- "Adapte este texto para ser usado em uma petição inicial"

## Segurança

- A chave API é armazenada localmente no navegador
- Nenhum dado é enviado para servidores externos além da API da OpenAI
- As requisições são feitas diretamente para a API da OpenAI

## Desenvolvimento

Para modificar ou personalizar o complemento:

1. Edite os arquivos HTML, CSS e JavaScript conforme necessário
2. Execute `npm run dev` para compilar em modo de desenvolvimento  
3. Execute `npm start` para iniciar o servidor de desenvolvimento

## Suporte

Para suporte ou dúvidas, abra uma issue no repositório. 