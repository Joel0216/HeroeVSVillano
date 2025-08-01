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

# Iniciar servidor en segundo plano
node app.js &
SERVER_PID=$!

# Esperar 3 segundos y abrir navegador
sleep 3

# Abrir navegador automáticamente
if command -v xdg-open &> /dev/null; then
    # Linux
    xdg-open http://localhost:3001
elif command -v open &> /dev/null; then
    # macOS
    open http://localhost:3001
else
    echo "💡 Abre manualmente: http://localhost:3001"
fi

echo ""
echo "✅ Servidor iniciado y navegador abierto"
echo ""

# Mantener el script corriendo
wait $SERVER_PID 