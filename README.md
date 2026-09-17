# 🛒 MAPEADOR DE PREÇOS - Sistema Completo

Sistema web para análise de lucratividade de produtos Amazon FBA.

## ✅ Status do Desenvolvimento

- ✅ **Backend API completo** (Python FastAPI)
- ✅ **Frontend completo** (React + TypeScript)
- ✅ **Sistema 100% funcional**

---

## 🚀 Como Rodar o Sistema Completo

### Opção 1: Script Automático (RECOMENDADO) 🎯

**Duplo clique em:** `INICIAR_SISTEMA.bat`

Este script irá:
1. ✅ Iniciar o Backend (porta 8000)
2. ✅ Iniciar o Frontend (porta 3000)
3. ✅ Abrir automaticamente no navegador

**Pronto!** O sistema estará rodando! 🎉

---

### Opção 2: Rodar Manualmente

**Terminal 1 - Backend:**
```bash
cd backend
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install  # (primeira vez)
npm start
```

---

## 🚀 Como Rodar APENAS o Backend

### Opção 1: Script Automático (Windows)
```bash
cd backend
start.bat
```

### Opção 2: Manual
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Acesse:
- **API**: http://localhost:8000
- **Documentação Interativa**: http://localhost:8000/docs 👈 **Teste aqui!**
- **Health Check**: http://localhost:8000/health

---

## 🎯 O que o Sistema Faz

### ✅ Backend API (FastAPI)

#### 🔐 Autenticação
- [x] Cadastro de usuário (com hash de senha bcrypt)
- [x] Login (retorna JWT token válido por 7 dias)
- [x] Verificação de token em todas as rotas

#### 📦 Produtos (Individual por usuário)
- [x] Criar produto
- [x] Listar produtos
- [x] Ver detalhes de produto
- [x] Atualizar produto
- [x] Excluir produto (soft delete)
- [x] **Cálculo automático** de todos os custos e margem
- [x] Simulador de cenários ("E se...?")

#### 🏪 Fornecedores (Global - compartilhado)
- [x] Criar fornecedor ← **NOVO!**
- [x] Listar fornecedores
- [x] Ver detalhes
- [x] Atualizar fornecedor ← **NOVO!**
- [x] Excluir fornecedor ← **NOVO!**
- [x] 3 fornecedores pré-cadastrados (Utimix, Zein, Top Rio)

#### ⚙️ Configurações (Global - compartilhado)
- [x] Ver premissas (TACOS, Prep, Frete, Impostos)
- [x] Atualizar premissas

#### 📊 Dashboard
- [x] Estatísticas gerais
- [x] Top 5 produtos lucrativos
- [x] Produtos com prejuízo

### ✅ Frontend Web (React + TypeScript)

#### 🎨 Interface Visual
- [x] Design moderno e responsivo
- [x] Gradiente roxo/azul
- [x] Cards elegantes com hover effects
- [x] Modal para criação de produto
- [x] Loading states e feedback visual

#### 🔐 Autenticação
- [x] Tela de login/cadastro com abas
- [x] Proteção de rotas
- [x] Logout
- [x] Token JWT persistente

#### 📊 Dashboard Visual
- [x] 4 cards com métricas principais
- [x] Total de produtos
- [x] Produtos lucrativos
- [x] Margem média
- [x] Lucro médio

#### 📦 Gestão de Produtos
- [x] Lista visual em cards
- [x] Criar produto com **preview em tempo real**
- [x] Excluir produto
- [x] Badge colorido de classificação
- [x] Indicador visual de lucratividade
- [x] Detalhes de margem e lucro

#### ⚡ Features Especiais
- [x] **Cálculo em tempo real** enquanto digita
- [x] Preview completo antes de salvar
- [x] Validações de formulário
- [x] Tratamento de erros
- [x] Integração completa com API

---

## 📁 Estrutura do Projeto

```
MAPEADOR_PREÇO/
├── backend/                    ✅ PRONTO
│   ├── main.py                # API FastAPI (500+ linhas)
│   ├── database.py            # Gerenciador JSON (400+ linhas)
│   ├── calculadora.py         # Lógica de cálculo
│   ├── auth.py                # JWT tokens
│   ├── requirements.txt       # Dependências Python
│   ├── start.bat              # Script para rodar backend
│   ├── README.md              # Docs do backend
│   └── data/                  # Dados JSON (auto-criado)
│
├── frontend/                   ✅ PRONTO
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   │   ├── NovoProduto.tsx
│   │   │   └── NovoProduto.css
│   │   ├── contexts/          # Context API
│   │   │   └── AuthContext.tsx
│   │   ├── pages/             # Páginas
│   │   │   ├── AuthPage.tsx
│   │   │   ├── Auth.css
│   │   │   ├── ProdutosPage.tsx
│   │   │   └── ProdutosPage.css
│   │   ├── services/          # API calls
│   │   │   └── api.ts
│   │   ├── App.tsx            # Rotas
│   │   └── index.tsx
│   ├── package.json
│   ├── start.bat              # Script para rodar frontend
│   └── README.md              # Docs do frontend
│
├── docs/                       ✅ COMPLETO
│   ├── ESPECIFICACAO_SISTEMA.md
│   ├── LOGICA_SISTEMA_REAL.md
│   ├── ESTRUTURA_JSON_AUTH.md
│   └── ... (muitos outros)
│
├── INICIAR_SISTEMA.bat         ✅ Script master
├── GUIA_TESTES.md              ✅ Guia de testes
└── README.md                   ← Este arquivo
```

---

## 🧪 Como Usar o Sistema

### 🎨 Via Interface Web (RECOMENDADO)

1. **Inicie o sistema**: Duplo clique em `INICIAR_SISTEMA.bat`
2. **Aguarde**: O navegador abrirá automaticamente
3. **Cadastre-se**: Primeira vez? Crie sua conta
4. **Crie produtos**: Clique em "➕ Novo Produto"
5. **Veja resultados**: Dashboard mostra tudo

### 🖼️ Fluxo Visual

**1. Tela de Login/Cadastro**
- Design moderno com gradiente
- Abas para alternar entre Login e Cadastro
- Validações em tempo real

**2. Dashboard**
- 4 cards com métricas principais
- Visual claro e organizado

**3. Criar Produto**
- Modal elegante
- **Cálculo em tempo real** enquanto você digita!
- Preview completo antes de salvar

**4. Ver Produtos**
- Cards coloridos
- Badge de classificação (EXCELENTE, BOM, MARGINAL, PREJUÍZO)
- Status visual (✅ LUCRATIVO ou ❌ PREJUÍZO)

### 🧪 Via API (Testes Manuais)

Para testar a API diretamente (desenvolvedores):
http://localhost:8000/docs

### 2. Teste o Fluxo Completo:

**Passo 1: Cadastrar**
```
POST /api/auth/cadastro
{
  "nome": "Seu Nome",
  "email": "seu@email.com",
  "senha": "senha123"
}
```
➡️ Copie o `token` retornado

**Passo 2: Autenticar nas próximas requisições**
- Clique no botão 🔓 "Authorize" no topo
- Cole o token (com ou sem "Bearer ")

**Passo 3: Criar um Produto**
```
POST /api/produtos
{
  "nome": "Tábua Inox",
  "fornecedor_id": 1,
  "custo_unitario": 12.50,
  "preco_venda": 33.90
}
```
➡️ Sistema calcula automaticamente:
- Comissão: R$ 1,70
- Prep: R$ 1,30
- Frete: R$ 6,00
- Impostos: R$ 1,36
- ADS: R$ 1,70
- **Margem: 27,54%**
- **Lucro: R$ 9,34/unidade**
- **Status: LUCRATIVO ✅**

**Passo 4: Ver Dashboard**
```
GET /api/dashboard
```

---

## 📊 Endpoints Disponíveis

### Autenticação (não requer token)
- `POST /api/auth/cadastro` - Criar conta
- `POST /api/auth/login` - Fazer login

### Produtos (requer token)
- `GET /api/produtos` - Listar meus produtos
- `POST /api/produtos` - Criar produto (cálculo automático)
- `GET /api/produtos/{id}` - Ver detalhes
- `PUT /api/produtos/{id}` - Atualizar
- `DELETE /api/produtos/{id}` - Excluir
- `GET /api/produtos/{id}/simular` - Simular cenários

### Fornecedores (requer token - global)
- `GET /api/fornecedores` - Listar todos
- `POST /api/fornecedores` - Criar novo
- `GET /api/fornecedores/{id}` - Ver detalhes
- `PUT /api/fornecedores/{id}` - Atualizar
- `DELETE /api/fornecedores/{id}` - Excluir

### Configurações (requer token - global)
- `GET /api/configuracoes` - Ver premissas
- `PUT /api/configuracoes` - Atualizar

### Dashboard (requer token)
- `GET /api/dashboard` - Métricas e top produtos

---

## 🗂️ Como os Dados São Armazenados

### JSON Files (sem banco de dados!)

**Global (compartilhado):**
- `data/fornecedores.json` - Todos veem
- `data/configuracoes.json` - Todos usam

**Individual (por usuário):**
- `data/users/user_1/produtos.json` - Só o usuário 1 vê
- `data/users/user_2/produtos.json` - Só o usuário 2 vê

---

## 🔒 Segurança

✅ Senhas com hash bcrypt (nunca em texto puro)  
✅ JWT tokens com expiração (7 dias)  
✅ Cada usuário só acessa seus dados  
✅ Soft delete (nada é perdido)  

⚠️ **Antes de produção**: Mude `SECRET_KEY` em `backend/auth.py`

---

## 📝 Resumo Rápido

### ✅ Sistema está 100% funcional!

**Backend:**
- ✅ API REST completa (FastAPI)
- ✅ Autenticação JWT
- ✅ CRUD de produtos, fornecedores, configurações
- ✅ Cálculos automáticos de margem e lucro
- ✅ Dashboard com estatísticas
- ✅ Dados em JSON (sem banco)

**Frontend:**
- ✅ Interface web moderna (React + TypeScript)
- ✅ Login/Cadastro
- ✅ Dashboard visual com métricas
- ✅ Criar/Excluir produtos
- ✅ **Cálculo em tempo real** (preview)
- ✅ Design responsivo

### 🚀 Para Usar AGORA:

1. **Duplo clique em:** `INICIAR_SISTEMA.bat`
2. **Aguarde** o navegador abrir
3. **Cadastre-se** e comece!

---

## 📊 Melhorias Futuras (Sugestões)

### 🎯 Curto Prazo
- [ ] Editar produto (atualmente só cria/deleta)
- [ ] Página de fornecedores (CRUD completo)
- [ ] Página de configurações (UI para alterar premissas)
- [ ] Filtros e busca de produtos
- [ ] Ordenação de produtos (por margem, lucro, nome)

### 🚀 Médio Prazo
- [ ] Gráficos de evolução (Chart.js ou Recharts)
- [ ] Simulador de cenários na interface
- [ ] Exportar produtos para Excel/CSV
- [ ] Relatórios em PDF
- [ ] DRE e Fluxo de Caixa (já tem no backend)
- [ ] Dark mode
- [ ] Notificações toast

### 💡 Longo Prazo
- [ ] Trocar JSON por PostgreSQL/SQLite
- [ ] Sistema de permissões (admin, usuário)
- [ ] Multi-tenancy (empresas diferentes)
- [ ] API de integração com Amazon
- [ ] Machine Learning para prever vendas
- [ ] App mobile (React Native)

---

## 💡 Exemplos de Uso

### 📱 Frontend (Interface Web)

**Exemplo 1: Cadastrar e Criar Produto**
1. Abra http://localhost:3000
2. Cadastre-se (nome, email, senha)
3. Clique em "➕ Novo Produto"
4. Preencha:
   - Nome: "Tábua Inox Premium"
   - Fornecedor: Utimix
   - Custo: R$ 12,50
   - Preço: R$ 33,90
5. Veja o preview em tempo real:
   - Margem: 27,54%
   - Lucro: R$ 9,34
   - Status: ✅ EXCELENTE
6. Clique em "💾 Salvar"

**Resultado no Dashboard:**
- Total de produtos: 1
- Produtos lucrativos: 1
- Margem média: 27,54%
- Lucro médio: R$ 9,34

---

### 🔧 API (cURL - Desenvolvedores)

### Criar Fornecedor
```bash
curl -X POST http://localhost:8000/api/fornecedores \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Novo Fornecedor",
    "telefone": "(11) 99999-9999",
    "site_instagram": "https://instagram.com/fornecedor",
    "prioritario": true
  }'
```

### Atualizar Fornecedor
```bash
curl -X PUT http://localhost:8000/api/fornecedores/1 \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "telefone": "(11) 88888-8888",
    "prioritario": false
  }'
```

### Excluir Fornecedor
```bash
curl -X DELETE http://localhost:8000/api/fornecedores/1 \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 🎉 Pronto para Usar!

### ⚡ Início Rápido (3 passos)

**1️⃣ Duplo clique:** `INICIAR_SISTEMA.bat`  
**2️⃣ Aguarde:** Abrirá 2 janelas + navegador  
**3️⃣ Use:** Cadastre-se e comece a analisar produtos!

### 📋 Requisitos do Sistema

#### Backend
- ✅ **Python 3.11+** ([Download](https://www.python.org/downloads/))
- ✅ **pip** (vem com Python)

#### Frontend
- ✅ **Node.js 18+** ([Download](https://nodejs.org/))
- ✅ **npm** (vem com Node.js)

#### Sistema Operacional
- ✅ Windows 10/11 (scripts .bat)
- ✅ macOS/Linux (rode manualmente)

---

## 🐛 Troubleshooting

### Problema: Backend não inicia

**Erro: "Python não encontrado"**
```bash
# Solução: Instale Python 3.11+
https://www.python.org/downloads/
```

**Erro: "ModuleNotFoundError"**
```bash
cd backend
pip install -r requirements.txt
```

**Erro: "Porta 8000 já em uso"**
```bash
# Mude a porta em backend/main.py
uvicorn.run(app, host="0.0.0.0", port=8001)
```

### Problema: Frontend não inicia

**Erro: "Node não encontrado"**
```bash
# Solução: Instale Node.js 18+
https://nodejs.org/
```

**Erro: "npm install falhou"**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Erro: "Porta 3000 já em uso"**
```bash
# Aparecerá prompt perguntando se quer usar outra porta
# Digite 'y' e ele usará 3001
```

### Problema: "Network Error" no frontend

**Causa:** Backend não está rodando ou em porta diferente

**Solução:**
1. Verifique se backend está em http://localhost:8000
2. Teste: Abra http://localhost:8000/health
3. Se não funcionar, reinicie o backend

### Problema: Token inválido/expirado

**Solução:**
1. Faça logout
2. Faça login novamente
3. OU limpe o localStorage:
```javascript
// No Console do navegador (F12)
localStorage.clear();
location.reload();
```

---

## 📊 Como os Cálculos Funcionam

### Fórmula Completa

```
Custo Total = Custo Unitário + Comissão + Prep + Frete + Impostos + ADS

Onde:
- Comissão = Preço × 5%
- Prep = R$ 1,30 (fixo)
- Frete FBA = R$ 6,00 (fixo)
- Impostos = Preço × 4%
- ADS (TACOS) = Preço × 5%

Lucro = Preço de Venda - Custo Total
Margem = Lucro / Preço de Venda

Classificação:
- EXCELENTE: Margem ≥ 25%
- BOM: Margem ≥ 15%
- MARGINAL: Margem ≥ 5%
- PREJUÍZO: Margem < 5%
```

### Exemplo Prático

**Produto:** Tábua Inox  
**Custo:** R$ 12,50  
**Preço:** R$ 33,90

```
Comissão = 33,90 × 5% = R$ 1,70
Prep = R$ 1,30
Frete = R$ 6,00
Impostos = 33,90 × 4% = R$ 1,36
ADS = 33,90 × 5% = R$ 1,70

Custo Total = 12,50 + 1,70 + 1,30 + 6,00 + 1,36 + 1,70 = R$ 24,56

Lucro = 33,90 - 24,56 = R$ 9,34
Margem = 9,34 / 33,90 = 27,54%

✅ Classificação: EXCELENTE
```

---

## 📚 Documentação Adicional

- **Backend API:** `backend/README.md`
- **Frontend:** `frontend/README.md`
- **Guia de Testes:** `GUIA_TESTES.md`
- **Especificação Completa:** `docs/ESPECIFICACAO_SISTEMA.md`
- **Lógica do Sistema:** `docs/LOGICA_SISTEMA_REAL.md`
- **Estrutura JSON:** `docs/ESTRUTURA_JSON_AUTH.md`

---

## 📞 Suporte

**Dúvidas sobre o código?**
- Leia a documentação em `docs/`
- Consulte `GUIA_TESTES.md`
- Veja comentários no código

**Bugs ou Erros?**
- Veja seção "Troubleshooting" acima
- Verifique logs nos terminais
- Limpe dados e tente novamente

---

## 🎉 Pronto para Usar!

1. Abra o terminal na pasta `backend`
2. Execute `start.bat` (Windows) ou `python main.py`
3. Acesse http://localhost:8000/docs
4. Cadastre-se e teste!

**Dúvidas?** Veja `backend/README.md` para mais detalhes.

---

**Desenvolvido com ❤️ para facilitar vendas na Amazon FBA**
