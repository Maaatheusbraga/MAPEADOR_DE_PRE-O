# 🚀 Guia de Deploy na VPS

> **Sistema Mapeador de Preços - Deploy Completo**

---

## 📋 PRÉ-REQUISITOS DA VPS

Certifique-se que sua VPS tem:
- **Ubuntu 20.04+** ou Debian 11+
- **Mínimo 2GB RAM**
- **Acesso root ou sudo**
- **Porta 80 e 443 liberadas**
- **Domínio apontado para o IP da VPS** (opcional, mas recomendado)

---

## 🔧 PASSO 1: Conectar na VPS

```bash
ssh usuario@SEU_IP_DA_VPS
# ou se usar chave SSH:
ssh -i caminho/da/chave.pem usuario@SEU_IP_DA_VPS
```

---

## 📦 PASSO 2: Instalar Dependências

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Python 3.11+
sudo apt install python3 python3-pip python3-venv -y

# Instalar Node.js 18+ e npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar Nginx (servidor web)
sudo apt install nginx -y

# Instalar Git
sudo apt install git -y

# Verificar instalações
python3 --version
node --version
npm --version
nginx -v
```

---

## 📥 PASSO 3: Clonar o Repositório

```bash
# Criar diretório para aplicações
sudo mkdir -p /var/www
cd /var/www

# Clonar o repositório
sudo git clone https://github.com/Maaatheusbraga/MAPEADOR_DE_PRE-O.git mapeador
cd mapeador

# Dar permissões corretas
sudo chown -R $USER:$USER /var/www/mapeador
```

---

## 🐍 PASSO 4: Configurar Backend

```bash
cd /var/www/mapeador/backend

# Criar ambiente virtual Python
python3 -m venv venv

# Ativar ambiente virtual
source venv/bin/activate

# Instalar dependências
pip install --upgrade pip
pip install -r requirements.txt

# Criar diretório de dados
mkdir -p data

# Testar se funciona
python3 main.py
# Se aparecer: "Uvicorn running on http://0.0.0.0:8000" -> Funcionou!
# Pressione Ctrl+C para parar
```

---

## ⚙️ PASSO 5: Configurar Backend como Serviço Systemd

Criar arquivo de serviço para o backend rodar automaticamente:

```bash
sudo nano /etc/systemd/system/mapeador-backend.service
```

Cole o seguinte conteúdo:

```ini
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
```

**Salvar:** `Ctrl+O` → `Enter` → `Ctrl+X`

```bash
# Recarregar systemd
sudo systemctl daemon-reload

# Iniciar o serviço
sudo systemctl start mapeador-backend

# Habilitar iniciar automaticamente no boot
sudo systemctl enable mapeador-backend

# Verificar status
sudo systemctl status mapeador-backend

# Ver logs
sudo journalctl -u mapeador-backend -f
```

---

## 🎨 PASSO 6: Configurar Frontend

```bash
cd /var/www/mapeador/frontend

# Instalar dependências
npm install

# IMPORTANTE: Configurar URL da API
# Editar o arquivo de configuração da API
nano src/services/api.ts
```

**Alterar a linha `baseURL` para:**

```typescript
// Se você tem domínio:
baseURL: 'https://seu-dominio.com/api'

// Se usar apenas IP:
baseURL: 'http://SEU_IP_DA_VPS/api'
```

**Salvar:** `Ctrl+O` → `Enter` → `Ctrl+X`

```bash
# Fazer o build de produção
npm run build

# O build será gerado na pasta 'build/'
ls -la build/
```

---

## 🌐 PASSO 7: Configurar Nginx

```bash
# Criar configuração do Nginx
sudo nano /etc/nginx/sites-available/mapeador
```

Cole o seguinte conteúdo:

```nginx
server {
    listen 80;
    server_name SEU_IP_DA_VPS;  # ou seu-dominio.com se tiver domínio

    # Frontend (React)
    location / {
        root /var/www/mapeador/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Configurações de cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        root /var/www/mapeador/frontend/build;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Salvar:** `Ctrl+O` → `Enter` → `Ctrl+X`

```bash
# Ativar o site
sudo ln -s /etc/nginx/sites-available/mapeador /etc/nginx/sites-enabled/

# Remover site padrão (opcional)
sudo rm -f /etc/nginx/sites-enabled/default

# Testar configuração do Nginx
sudo nginx -t

# Se aparecer "test is successful", recarregar Nginx:
sudo systemctl reload nginx
sudo systemctl enable nginx
```

---

## 🔒 PASSO 8: (OPCIONAL) Configurar HTTPS com Let's Encrypt

**Só se você tiver um domínio apontado para a VPS!**

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obter certificado SSL (substitua seu-dominio.com)
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com

# Seguir as instruções na tela
# Certbot vai configurar HTTPS automaticamente!

# Testar renovação automática
sudo certbot renew --dry-run
```

---

## 🔥 PASSO 9: Configurar Firewall (UFW)

```bash
# Permitir SSH (IMPORTANTE!)
sudo ufw allow ssh
sudo ufw allow 22/tcp

# Permitir HTTP e HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Ativar firewall
sudo ufw enable

# Verificar status
sudo ufw status
```

---

## ✅ PASSO 10: Testar o Sistema

1. **Acesse no navegador:**
   ```
   http://SEU_IP_DA_VPS
   # ou
   https://seu-dominio.com
   ```

2. **Criar um usuário de teste**

3. **Fazer login e testar todas as funcionalidades**

---

## 📊 COMANDOS ÚTEIS DE MANUTENÇÃO

### Ver logs do backend:
```bash
sudo journalctl -u mapeador-backend -f
```

### Reiniciar backend:
```bash
sudo systemctl restart mapeador-backend
```

### Atualizar o sistema (após fazer push no GitHub):
```bash
cd /var/www/mapeador

# Fazer backup dos dados
cp -r backend/data backend/data.backup

# Atualizar código
git pull origin main

# Atualizar backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart mapeador-backend

# Atualizar frontend
cd ../frontend
npm install
npm run build
sudo systemctl reload nginx

# Restaurar dados se necessário
# cp -r backend/data.backup/* backend/data/
```

### Ver uso de recursos:
```bash
# CPU e memória
htop
# ou
top

# Espaço em disco
df -h

# Uso da pasta do projeto
du -sh /var/www/mapeador
```

### Backup dos dados:
```bash
# Criar backup
tar -czf mapeador-backup-$(date +%Y%m%d).tar.gz /var/www/mapeador/backend/data/

# Restaurar backup
tar -xzf mapeador-backup-YYYYMMDD.tar.gz -C /
```

---

## 🚨 SOLUÇÃO DE PROBLEMAS

### Backend não inicia:
```bash
# Ver logs de erro
sudo journalctl -u mapeador-backend -n 50

# Verificar se a porta 8000 está em uso
sudo netstat -tulpn | grep 8000

# Testar manualmente
cd /var/www/mapeador/backend
source venv/bin/activate
python3 main.py
```

### Frontend retorna 404:
```bash
# Verificar se o build existe
ls -la /var/www/mapeador/frontend/build

# Verificar permissões
sudo chown -R www-data:www-data /var/www/mapeador/frontend/build

# Verificar configuração do Nginx
sudo nginx -t
sudo systemctl reload nginx
```

### Erro 502 Bad Gateway:
```bash
# Backend provavelmente não está rodando
sudo systemctl status mapeador-backend
sudo systemctl start mapeador-backend
```

### Sistema lento:
```bash
# Verificar recursos
free -h
df -h
top

# Considerar aumentar RAM da VPS
# Ou otimizar configurações do Nginx
```

---

## 📱 ACESSO REMOTO

Agora você pode acessar o sistema de **qualquer lugar**:

- **🖥️ Computador:** http://SEU_IP_DA_VPS
- **📱 Celular:** http://SEU_IP_DA_VPS
- **🌐 Com domínio:** https://seu-dominio.com

---

## 🔐 SEGURANÇA RECOMENDADA

1. **Altere a SECRET_KEY no backend/auth.py**
   ```bash
   nano /var/www/mapeador/backend/auth.py
   # Gerar chave aleatória:
   python3 -c "import secrets; print(secrets.token_hex(32))"
   ```

2. **Configure backups automáticos diários**

3. **Mantenha o sistema atualizado:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

4. **Use senhas fortes para SSH**

5. **Considere usar autenticação de dois fatores**

---

## 💡 MELHORIAS FUTURAS

- **✅ Banco de dados PostgreSQL** (em vez de JSON)
- **✅ Redis para cache**
- **✅ Docker + Docker Compose** para facilitar deploy
- **✅ CI/CD com GitHub Actions**
- **✅ Monitoramento com Grafana/Prometheus**
- **✅ CDN para melhor performance global**

---

## 📞 SUPORTE

Se tiver problemas:
1. Verifique os logs: `sudo journalctl -u mapeador-backend -f`
2. Teste o backend manualmente
3. Verifique se as portas estão abertas
4. Confirme que o domínio aponta para o IP correto

---

**✅ Sistema online e acessível de qualquer lugar!** 🚀
