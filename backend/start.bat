@echo off
echo ========================================
echo  Mapeador de Precos - Backend
echo ========================================
echo.

echo [1/3] Verificando Python...
python --version
if errorlevel 1 (
    echo ERRO: Python nao encontrado!
    echo Instale Python 3.11+ em: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo.
echo [2/3] Instalando dependencias...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERRO ao instalar dependencias!
    pause
    exit /b 1
)

echo.
echo [3/3] Iniciando servidor...
echo.
echo API rodando em: http://localhost:8000
echo Documentacao: http://localhost:8000/docs
echo.
echo Pressione Ctrl+C para parar o servidor
echo ========================================
echo.

python main.py
