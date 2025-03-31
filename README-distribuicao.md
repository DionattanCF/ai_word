# Guia de Distribuição - Assistente Jurídico IA

Este documento fornece instruções detalhadas para distribuir o add-in Assistente Jurídico IA para Microsoft Word.

## Pré-requisitos

- Conta no GitHub
- Repositório público para hospedar o add-in
- Chave API OpenAI válida

## Passos para Distribuição

### 1. Preparar os Arquivos

Certifique-se de que os seguintes arquivos estão presentes e atualizados:

- `manifest.xml`: Arquivo de manifesto do add-in
- `index-dist.html`: Versão de distribuição da interface
- `app.js`: Código JavaScript principal
- `styles.css`: Estilos da interface
- `README-distribuicao.md`: Este arquivo

### 2. Configurar o GitHub Pages

1. Crie um novo repositório no GitHub
2. Faça upload dos arquivos do add-in
3. Ative o GitHub Pages nas configurações do repositório
4. Configure para usar a branch `main` como fonte

### 3. Atualizar o Manifest

1. Abra o arquivo `manifest.xml`
2. Atualize a URL do add-in para apontar para seu repositório GitHub Pages
3. Verifique se todas as URLs de recursos estão corretas

### 4. Testar o Add-in

1. Use o [Office Add-in Validator](https://validator.officeaddin.com/) para verificar o manifest
2. Teste o add-in localmente antes da distribuição
3. Verifique se todas as funcionalidades estão funcionando:
   - Configurações (API Key, Modelo GPT, Prompts)
   - Ferramentas (Reescrever, Resumir, etc.)
   - Chat personalizado
   - Aplicação de respostas

### 5. Distribuir o Add-in

1. Compartilhe o link do manifest.xml com os usuários
2. Forneça instruções de instalação claras
3. Inclua informações sobre as configurações necessárias

## Instruções para Usuários

### Instalação

1. Abra o Microsoft Word
2. Vá para a guia "Inserir"
3. Clique em "Meus Suplementos"
4. Selecione "Gerenciar Meus Suplementos"
5. Clique em "Suplementos de Desenvolvedor"
6. Cole o URL do manifest.xml
7. Clique em "OK"

### Configuração Inicial

1. Abra o add-in no painel lateral
2. Na seção "Configurações":
   - Insira sua chave API OpenAI
   - Selecione o modelo GPT desejado
   - Adicione prompts personalizados (opcional)
3. Clique em "Salvar Configurações"

### Uso

1. Selecione o texto que deseja processar
2. Use as ferramentas disponíveis:
   - Botões de ação rápida
   - Chat personalizado
3. Revise e aplique as respostas da IA

## Solução de Problemas

### Problemas Comuns

1. **Add-in não carrega**
   - Verifique a conexão com a internet
   - Confirme se o URL do manifest está correto
   - Limpe o cache do navegador

2. **Erro de API**
   - Verifique se a chave API está correta
   - Confirme se a chave tem créditos disponíveis
   - Verifique se o modelo selecionado está disponível

3. **Interface não responde**
   - Recarregue o add-in
   - Verifique se há erros no console do navegador
   - Tente reinstalar o add-in

### Suporte

Para suporte técnico ou dúvidas:
1. Abra uma issue no repositório do GitHub
2. Descreva o problema detalhadamente
3. Inclua screenshots se possível

## Manutenção

### Atualizações

1. Faça alterações no código fonte
2. Atualize os arquivos de distribuição
3. Faça commit e push para o GitHub
4. Teste as alterações em produção

### Monitoramento

1. Verifique logs de erro
2. Monitore uso da API
3. Colete feedback dos usuários

## Segurança

### Boas Práticas

1. Nunca exponha chaves API no código
2. Use HTTPS para todas as comunicações
3. Implemente rate limiting
4. Mantenha as dependências atualizadas

### Privacidade

1. Não colete dados pessoais
2. Use armazenamento local para configurações
3. Limpe dados sensíveis ao desinstalar

## Recursos Adicionais

- [Documentação do Office Add-ins](https://docs.microsoft.com/en-us/office/dev/add-ins/)
- [Guia de Segurança](https://docs.microsoft.com/en-us/office/dev/add-ins/concepts/security)
- [Exemplos de Código](https://github.com/OfficeDev/Office-Add-in-samples) 