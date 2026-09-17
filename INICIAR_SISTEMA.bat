@echo off
echo ========================================
echo  Mapeador de Precos - Sistema Completo
echo ========================================
echo.

echo Este script inicia:
echo  1. Backend API (porta 8000)
echo  2. Frontend Web (porta 3000)
echo.

echo IMPORTANTE: Duas janelas serao abertas
echo  - Nao feche as janelas ate terminar de usar
echo  - Para parar: feche as janelas ou Ctrl+C
echo.

pause

echo.
echo [1/2] Iniciando Backend...
start "Backend - Mapeador de Precos" cmd /k "cd backend && python main.py"
timeout /t 3 /nobreak > nul

echo.
echo [2/2] Iniciando Frontend...
start "Frontend - Mapeador de Precos" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo  Sistema Iniciado!
echo ========================================
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo Docs API: http://localhost:8000/docs
echo.
echo Duas janelas foram abertas.
echo NAO FECHE ESTE TERMINAL ate terminar de usar!
echo.

pause
