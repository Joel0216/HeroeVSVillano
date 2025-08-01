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

REM Iniciar servidor en segundo plano
start /B node app.js

REM Esperar 3 segundos y abrir navegador
timeout /t 3 /nobreak >nul
start http://localhost:3001

echo.
echo ✅ Servidor iniciado y navegador abierto
echo.
pause 