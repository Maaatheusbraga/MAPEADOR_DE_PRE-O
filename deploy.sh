#!/bin/bash

# 🚀 Script de Deploy Automático - Mapeador de Preços
# Execute este script na sua VPS após clonar o repositório

set -e  # Parar se houver erro

echo "🚀 Iniciando deploy do Mapeador de Preços..."
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para printar com cor
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Verificar se está rodando como root ou com sudo
if [ "$EUID" -ne 0 ]; then 
    print_error "Por favor, execute como root ou com sudo"
    exit 1
fi

# Obter IP da VPS
VPS_IP=$(curl -s ifconfig.me)
print_info "IP da VPS detectado: $VPS_IP"

# Perguntar domínio (opcional)
echo ""
read -p "Você tem um domínio? (deixe em branco se não tiver): " DOMAIN
echo ""

# 1. Atualizar sistema
print_info "Atualizando sistema..."
apt update && apt upgrade -y
print_success "Sistema atualizado"

# 2. Instalar Python 3
print_info "Instalando Python 3..."
apt install -y python3 python3-pip python3-venv
print_success "Python instalado: $(python3 --version)"

# 3. Instalar Node.js
print_info "Instalando Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
fi
print_success "Node.js instalado: $(node --version)"

# 4. Instalar Nginx
print_info "Instalando Nginx..."
apt install -y nginx
systemctl enable nginx
print_success "Nginx instalado"

# 5. Instalar Git
print_info "Instalando Git..."
apt install -y git
print_success "Git instalado"

# 6. Configurar diretório
print_info "Configurando diretório da aplicação..."
mkdir -p /var/www
cd /var/www

# Se o diretório já existe, fazer backup
if [ -d "mapeador" ]; then
    print_info "Fazendo backup da instalação existente..."
    mv mapeador mapeador.backup.$(date +%Y%m%d%H%M%S)
fi

# Clonar repositório
print_info "Clonando repositório..."
git clone https://github.com/Maaatheusbraga/MAPEADOR_DE_PRE-O.git mapeador
cd mapeador
print_success "Repositório clonado"

# 7. Configurar Backend
print_info "Configurando backend..."
cd backend

# Criar ambiente virtual
python3 -m venv venv
source venv/bin/activate

# Instalar dependências
pip install --upgrade pip
pip install -r requirements.txt

# Criar diretório de dados
mkdir -p data

print_success "Backend configurado"

# 8. Criar serviço systemd para o backend
print_info "Criando serviço systemd..."
cat > /etc/systemd/system/mapeador-backend.service << 'EOF'
[Unit]
Description=Mapeador de Preços - Backend API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/mapeador/backend
Environment="PATH=/var/www/mapeador/backend/venv/bin"
ExecStart=/var/www/mapeador/backend/venv/bin/python3 -m uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Dar permissões corretas
chown -R www-data:www-data /var/www/mapeador

# Recarregar systemd
systemctl daemon-reload
systemctl enable mapeador-backend
systemctl start mapeador-backend

print_success "Serviço backend criado e iniciado"

# 9. Configurar Frontend
print_info "Configurando frontend..."
cd /var/www/mapeador/frontend

# Criar arquivo de configuração da API
if [ -z "$DOMAIN" ]; then
    API_URL="http://$VPS_IP/api"
else
    API_URL="https://$DOMAIN/api"
fi

print_info "Configurando API URL: $API_URL"

# Atualizar api.ts
sed -i "s|baseURL: .*|baseURL: '$API_URL',|g" src/services/api.ts

# Instalar dependências
npm install

# Build de produção
npm run build

print_success "Frontend configurado e buildado"

# 10. Configurar Nginx
print_info "Configurando Nginx..."

if [ -z "$DOMAIN" ]; then
    SERVER_NAME="$VPS_IP"
else
    SERVER_NAME="$DOMAIN"
fi

cat > /etc/nginx/sites-available/mapeador << EOF
server {
    listen 80;
    server_name $SERVER_NAME;

    # Frontend (React)
    location / {
        root /var/www/mapeador/frontend/build;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Cache de assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        root /var/www/mapeador/frontend/build;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Ativar site
ln -sf /etc/nginx/sites-available/mapeador /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Testar configuração
nginx -t

# Recarregar Nginx
systemctl reload nginx

print_success "Nginx configurado"

# 11. Configurar Firewall
print_info "Configurando firewall..."
ufw --force enable
ufw allow ssh
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
print_success "Firewall configurado"

# 12. Instalar SSL (se tiver domínio)
if [ ! -z "$DOMAIN" ]; then
    print_info "Instalando certificado SSL..."
    apt install -y certbot python3-certbot-nginx
    
    # Obter certificado
    certbot --nginx -d $DOMAIN --non-interactive --agree-tos --register-unsafely-without-email --redirect
    
    print_success "SSL configurado para $DOMAIN"
fi

# Verificar status
echo ""
echo "=================================================="
print_success "DEPLOY CONCLUÍDO COM SUCESSO!"
echo "=================================================="
echo ""
print_info "Status dos serviços:"
systemctl status mapeador-backend --no-pager -l
echo ""

if [ -z "$DOMAIN" ]; then
    print_success "Acesse o sistema em: http://$VPS_IP"
else
    print_success "Acesse o sistema em: https://$DOMAIN"
fi

echo ""
print_info "Comandos úteis:"
echo "  - Ver logs do backend: sudo journalctl -u mapeador-backend -f"
echo "  - Reiniciar backend: sudo systemctl restart mapeador-backend"
echo "  - Reiniciar nginx: sudo systemctl reload nginx"
echo "  - Atualizar sistema: cd /var/www/mapeador && git pull"
echo ""

print_success "✅ Tudo pronto! Seu sistema está online!"
