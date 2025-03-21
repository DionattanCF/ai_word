# Assistente Jurídico IA para Word

Este é um complemento do Microsoft Word que integra a API da OpenAI para auxiliar advogados na redação e edição de documentos jurídicos.

## Funcionalidades

- Reescrever texto com IA
- Resumir textos jurídicos
- Gerar contra-argumentos
- Simplificar linguagem técnica
- **Chat personalizado com IA**: Envie instruções específicas sobre como deseja que a IA processe seu texto

## Requisitos

- Microsoft Word (versão desktop ou web)
- Chave de API da OpenAI
- Node.js (versão 14 ou superior)
- npm (normalmente instalado com o Node.js)

## Instalação e Configuração

### Passo 1: Preparar o Ambiente

1. Instale o Node.js (versão 14 ou superior) do site oficial: https://nodejs.org/

2. Instale os certificados de desenvolvimento (necessário para HTTPS local):
   ```bash
   npm install -g office-addin-dev-certs
   office-addin-dev-certs install
   ```

### Passo 2: Configurar o Projeto

1. Clone/baixe este repositório em sua máquina

2. Abra um terminal na pasta do projeto e instale as dependências:
   ```bash
   npm install
   ```

3. Compile o projeto:
   ```bash
   npm run build
   ```

### Passo 3: Iniciar o Servidor de Desenvolvimento

1. Inicie o servidor local:
   ```bash
   npm start
   ```

2. Este comando abrirá o Word e sideloading do complemento será feito automaticamente
   Se não abrir automaticamente, siga o Passo 4 abaixo

### Passo 4: Inserir o Complemento no Word (se não abrir automaticamente)

#### Para o Word Desktop:

1. Abra o Word
2. Vá para a guia "Inserir"
3. Clique em "Meus Suplementos" ou "Suplementos"
4. Selecione "Gerenciar Meus Suplementos"
5. Clique em "Suplementos de Desenvolvedor" 
6. Clique em "Procurar" e selecione o arquivo `manifest.xml` na pasta do projeto
7. Clique em "OK"

#### Para o Word Online:

1. Abra o Word Online (office.com)
2. Crie ou abra um documento
3. Vá para a guia "Inserir"
4. Clique em "Suplementos"
5. Selecione "Gerenciar Meus Suplementos" > "Carregar Meu Suplemento"
6. Clique em "Procurar" e selecione o arquivo `manifest.xml` do projeto
7. Clique em "Carregar"

### Passo 5: Usar o Complemento

1. Depois que o complemento estiver carregado, você verá o painel lateral com a interface
2. Insira sua chave de API da OpenAI no campo designado e clique em "Salvar Chave"
3. Selecione algum texto no documento do Word
4. Use os botões ou o chat para interagir com a IA
5. Clique em "Aplicar ao Documento" para inserir a resposta da IA no documento

## Como Usar

1. Abra o Word e selecione o texto que deseja processar
2. Use as funcionalidades pré-definidas clicando em um dos botões no painel lateral:
   - "Reescrever com IA"
   - "Resumir"
   - "Gerar Contra-argumento"
   - "Simplificar Linguagem"
3. Ou use o **chat personalizado**:
   - Selecione o texto que deseja processar
   - Digite uma instrução específica no campo de texto do chat
   - Clique em "Enviar" ou pressione Enter
   - Aguarde a resposta da IA
   - Use o botão "Aplicar Resposta ao Documento" para substituir o texto selecionado
4. Para as ações pré-definidas, aguarde a resposta da IA e clique em "Aplicar ao Documento" para substituir o texto selecionado

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