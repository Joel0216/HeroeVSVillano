@echo off
echo 🚀 Iniciando servidor DataFight...
echo.
echo 📁 Verificando dependencias...
npm install
echo.
echo 🌐 Iniciando servidor en http://localhost:3001
echo 📱 Abriendo navegador automáticamente...
echo.
echo ⚠️  IMPORTANTE: Usa http://localhost:3001 en lugar de file://
echo.
node app.js
pause 