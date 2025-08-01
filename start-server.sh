#!/bin/bash

echo "🚀 Iniciando servidor DataFight..."
echo ""
echo "📁 Verificando dependencias..."
npm install
echo ""
echo "🌐 Iniciando servidor en http://localhost:3001"
echo "📱 Abriendo navegador automáticamente..."
echo ""
echo "⚠️  IMPORTANTE: Usa http://localhost:3001 en lugar de file://"
echo ""

# Abrir navegador automáticamente después de 2 segundos
(sleep 2 && start http://localhost:3001 2>/dev/null || open http://localhost:3001 2>/dev/null || xdg-open http://localhost:3001 2>/dev/null) &

node app.js 