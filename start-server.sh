#!/bin/bash

echo ""
echo "========================================"
echo "    HEROES VS VILLANOS - SERVIDOR"
echo "========================================"
echo ""

echo "🔧 Instalando dependencias..."
npm install

echo ""
echo "🚀 Iniciando servidor..."
echo ""
echo "📍 Accede a: http://localhost:3001"
echo "📍 Documentación: http://localhost:3001/api-docs"
echo ""
echo "⚠️  IMPORTANTE: No accedas desde file://"
echo "✅ Usa: http://localhost:3001"
echo ""

# Abrir navegador automáticamente (solo en sistemas que lo soporten)
if command -v xdg-open &> /dev/null; then
    # Linux
    sleep 2 && xdg-open http://localhost:3001 &
elif command -v open &> /dev/null; then
    # macOS
    sleep 2 && open http://localhost:3001 &
fi

node app.js 