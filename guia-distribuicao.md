# Guia de Distribuição do Assistente Jurídico IA

Este guia fornece instruções detalhadas para distribuir o add-in Assistente Jurídico IA para Microsoft Word.

## Preparação

### 1. Arquivos Necessários

Certifique-se de ter os seguintes arquivos:

- `manifest.xml`: Arquivo de manifesto do add-in
- `index-dist.html`: Interface do usuário
- `app.js`: Lógica do add-in
- `styles.css`: Estilos da interface
- `README-distribuicao.md`: Documentação de distribuição

### 2. Configuração do GitHub

1. Crie um novo repositório no GitHub
2. Faça upload dos arquivos do add-in
3. Ative o GitHub Pages:
   - Vá para Settings > Pages
   - Selecione a branch `main`
   - Escolha a pasta raiz
   - Clique em Save

### 3. Atualização do Manifest

1. Abra o arquivo `manifest.xml`
2. Atualize as URLs para apontar para seu repositório:
   ```xml
   <SourceLocation DefaultValue="https://SEU_USUARIO.github.io/SEU_REPOSITORIO/index-dist.html" />
   ```
3. Verifique se todas as URLs de recursos estão corretas

## Testes

### 1. Validação do Manifest

Use o [Office Add-in Validator](https://validator.officeaddin.com/) para verificar:
- URLs válidas
- Recursos acessíveis
- Configurações corretas

### 2. Testes Funcionais

Verifique se todas as funcionalidades estão operando:
- Configurações
  - Salvar chave API
  - Selecionar modelo GPT
  - Adicionar prompts personalizados
- Ferramentas
  - Reescrever
  - Resumir
  - Contra-argumento
  - Simplificar
- Chat personalizado
- Aplicação de respostas

### 3. Testes de Segurança

- Verifique se as chaves API estão seguras
- Confirme que todas as comunicações usam HTTPS
- Teste o armazenamento local de configurações

## Distribuição

### 1. Compartilhamento

1. Compartilhe o link do manifest.xml
2. Forneça instruções de instalação
3. Inclua informações sobre configurações

### 2. Instruções para Usuários

#### Instalação

1. Abra o Microsoft Word
2. Vá para Inserir > Meus Suplementos
3. Clique em Gerenciar Meus Suplementos
4. Selecione Suplementos de Desenvolvedor
5. Cole o URL do manifest.xml
6. Clique em OK

#### Configuração

1. Abra o add-in
2. Na seção Configurações:
   - Insira sua chave API OpenAI
   - Escolha o modelo GPT
   - Adicione prompts personalizados
3. Salve as configurações

### 3. Suporte

Forneça informações de contato para suporte:
- Email de suporte
- Link do repositório GitHub
- Documentação de solução de problemas

## Manutenção

### 1. Atualizações

1. Faça alterações no código
2. Atualize os arquivos de distribuição
3. Faça commit e push
4. Teste em produção

### 2. Monitoramento

- Verifique logs de erro
- Monitore uso da API
- Colete feedback dos usuários

### 3. Segurança

- Mantenha as dependências atualizadas
- Monitore vulnerabilidades
- Atualize certificados SSL

## Recursos Adicionais

- [Documentação do Office Add-ins](https://docs.microsoft.com/en-us/office/dev/add-ins/)
- [Guia de Segurança](https://docs.microsoft.com/en-us/office/dev/add-ins/concepts/security)
- [Exemplos de Código](https://github.com/OfficeDev/Office-Add-in-samples) 