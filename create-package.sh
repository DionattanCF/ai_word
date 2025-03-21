#!/bin/bash

# Script para criar um pacote de distribuição para o Assistente Jurídico IA

echo "Criando pacote de distribuição..."

# Criar diretório para o pacote
mkdir -p dist-package
mkdir -p dist-package/assets

# Compilar o projeto
echo "Compilando o projeto..."
npm run build

# Copiar arquivos para o diretório de distribuição
echo "Copiando arquivos..."
cp styles.css dist-package/
cp index-dist.html dist-package/index.html
cp dist/bundle.js dist-package/bundle.js
cp manifest-dist.xml dist-package/assistente-juridico-ia.xml
cp README-distribuicao.md dist-package/instrucoes-instalacao.md

# Criar ícones básicos (você deve substituir por ícones reais depois)
echo "Criando ícones de exemplo (substitua por seus próprios ícones)..."
echo '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" fill="#2c3e50"/><text x="16" y="22" font-family="Arial" font-size="20" fill="white" text-anchor="middle">IA</text></svg>' > dist-package/assets/icon-32.svg
echo '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="#2c3e50"/><text x="32" y="42" font-family="Arial" font-size="32" fill="white" text-anchor="middle">IA</text></svg>' > dist-package/assets/hi-res-icon.svg

echo "Pacote criado com sucesso em: dist-package/"
echo ""
echo "Para distribuir este complemento:"
echo "1. Hospede estes arquivos em um servidor web HTTPS"
echo "2. Atualize o arquivo 'assistente-juridico-ia.xml' com as URLs corretas"
echo "3. Distribua o arquivo XML para seus usuários"
echo ""
echo "Os usuários podem instalar o complemento seguindo as instruções em 'instrucoes-instalacao.md'" 