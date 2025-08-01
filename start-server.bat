@echo off
echo.
echo ========================================
echo    HEROES VS VILLANOS - SERVIDOR
echo ========================================
echo.

echo 🔧 Instalando dependencias...
npm install

echo.
echo 🚀 Iniciando servidor...
echo.
echo 📍 Accede a: http://localhost:3001
echo 📍 Documentación: http://localhost:3001/api-docs
echo.
echo ⚠️  IMPORTANTE: No accedas desde file://
echo ✅ Usa: http://localhost:3001
echo.

node app.js

pause 