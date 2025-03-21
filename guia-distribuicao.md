# Guia de Distribuição do Assistente Jurídico IA

Este documento explica como distribuir o complemento "Assistente Jurídico IA" para usuários do Microsoft Word.

## Opções de Hospedagem

Para distribuir o complemento, você precisa hospedar os arquivos em um servidor web com HTTPS. Existem várias opções:

### 1. GitHub Pages (Grátis)

1. Crie um repositório no GitHub
2. Faça upload dos arquivos da pasta `dist-package` 
3. Ative o GitHub Pages nas configurações do repositório
4. Use o branch principal ou crie um branch específico para gh-pages

### 2. Netlify/Vercel (Grátis)

1. Crie uma conta no Netlify ou Vercel
2. Faça upload da pasta `dist-package` como um novo site
3. O serviço fornecerá automaticamente um domínio HTTPS

### 3. Servidor Web Próprio

Se você possui um servidor web, basta:
1. Fazer upload dos arquivos para um diretório acessível via web
2. Certificar-se de que o servidor tem certificado HTTPS válido

## Preparando o Manifest para Distribuição

Após hospedar os arquivos, você precisa editar o arquivo `assistente-juridico-ia.xml` para apontar para a URL correta:

1. Abra o arquivo `assistente-juridico-ia.xml`
2. Localize as seguintes linhas:
   ```xml
   <IconUrl DefaultValue="https://SEU_USUARIO.github.io/SEU_REPOSITORIO/assets/icon-32.png"/>
   <HighResolutionIconUrl DefaultValue="https://SEU_USUARIO.github.io/SEU_REPOSITORIO/assets/hi-res-icon.png"/>
   <SourceLocation DefaultValue="https://SEU_USUARIO.github.io/SEU_REPOSITORIO/index.html"/>
   ```
3. Substitua as URLs pelos endereços reais onde você hospedou os arquivos
4. Salve o arquivo

## Distribuição para Usuários

Existem várias formas de distribuir o complemento para os usuários:

### 1. Distribuição Individual (Para Pequenos Grupos)

1. Envie o arquivo `assistente-juridico-ia.xml` por email
2. Forneça as instruções do arquivo `instrucoes-instalacao.md`

### 2. Distribuição Centralizada (Para Organizações)

Para organizações com Microsoft 365:

1. Acesse o Centro de Administração do Microsoft 365
2. Vá para Configurações > Serviços e suplementos
3. Clique em "Implantar suplemento"
4. Faça upload do arquivo `assistente-juridico-ia.xml`
5. Selecione os usuários que devem receber o complemento

### 3. Via Intranet ou Compartilhamento Interno

1. Disponibilize o arquivo XML na intranet ou sistema interno
2. Crie uma página com as instruções de instalação
3. Os usuários podem baixar e instalar conforme necessário

## Atualizações do Complemento

Para atualizar o complemento:

1. Faça as alterações necessárias no código
2. Execute o script `create-package.sh` para gerar um novo pacote
3. Faça upload dos novos arquivos para seu servidor
4. Atualize a versão no arquivo XML (`<Version>1.0.0.0</Version>`)
5. Se necessário, redistribua o novo arquivo XML

## Considerações de Segurança

- A chave da API OpenAI é armazenada localmente no navegador do usuário
- O texto dos documentos é processado diretamente pela API OpenAI
- Considere políticas de privacidade da sua organização antes de distribuir

## Suporte Técnico

Prepare-se para fornecer suporte aos usuários relacionado a:
- Instalação do complemento
- Configuração da chave API
- Problemas de conectividade
- Dúvidas sobre funcionalidade

## Personalização para sua Organização

Você pode personalizar o complemento antes da distribuição:
- Altere o nome (`DisplayName`) 
- Modifique os ícones
- Ajuste o sistema interno de prompts no arquivo JavaScript
- Customize o visual para corresponder à identidade da sua organização 