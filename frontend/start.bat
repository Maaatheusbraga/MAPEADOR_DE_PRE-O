@echo off
echo ========================================
echo  Mapeador de Precos - Frontend
echo ========================================
echo.

echo [1/3] Verificando Node.js...
node --version
if errorlevel 1 (
    echo ERRO: Node.js nao encontrado!
    echo Instale Node.js em: https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo [2/3] Verificando dependencias...
if not exist "node_modules" (
    echo Instalando dependencias pela primeira vez...
    call npm install
    if errorlevel 1 (
        echo ERRO ao instalar dependencias!
        pause
        exit /b 1
    )
) else (
    echo Dependencias ja instaladas!
)

echo.
echo [3/3] Iniciando servidor de desenvolvimento...
echo.
echo Frontend rodando em: http://localhost:3000
echo.
echo IMPORTANTE: O backend deve estar rodando em http://localhost:8000
echo.
echo Pressione Ctrl+C para parar o servidor
echo ========================================
echo.

npm start
