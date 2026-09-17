# 🚀 Backend - Mapeador de Preços

API REST para análise de lucratividade de produtos Amazon FBA.

## 📦 Instalação

### 1. Instalar Python 3.11+
Certifique-se de ter Python 3.11 ou superior instalado.

### 2. Instalar dependências
```bash
pip install -r requirements.txt
```

## 🎯 Como Rodar

### Opção 1: Direto
```bash
python main.py
```

### Opção 2: Com uvicorn
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

A API estará disponível em:
- **API**: http://localhost:8000
- **Documentação interativa**: http://localhost:8000/docs
- **Health check**: http://localhost:8000/health

## 📚 Documentação da API

Acesse http://localhost:8000/docs para ver a documentação interativa (Swagger UI).

## 🗂️ Estrutura de Arquivos

```
backend/
├── main.py              # API FastAPI com todos os endpoints
├── database.py          # Gerenciador de JSON (CRUD)
├── auth.py              # Autenticação JWT
├── calculadora.py       # Lógica de cálculo de lucro
├── requirements.txt     # Dependências
└── data/                # Dados JSON (criado automaticamente)
    ├── usuarios.json
    ├── fornecedores.json
    ├── configuracoes.json
    └── users/
        └── user_X/
            ├── produtos.json
            ├── dre.json
            └── fluxo_caixa.json
```

## 🔑 Autenticação

Todos os endpoints (exceto `/api/auth/cadastro` e `/api/auth/login`) requerem autenticação JWT.

### Como usar:
1. Cadastre-se: `POST /api/auth/cadastro`
2. Faça login: `POST /api/auth/login`
3. Use o token recebido no header: `Authorization: Bearer <seu-token>`

## 📡 Endpoints Principais

### Autenticação
- `POST /api/auth/cadastro` - Criar conta
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/me` - Dados do usuário logado

### Produtos (individuais por usuário)
- `GET /api/produtos` - Listar meus produtos
- `POST /api/produtos` - Criar produto
- `GET /api/produtos/{id}` - Ver detalhes
- `PUT /api/produtos/{id}` - Atualizar produto
- `DELETE /api/produtos/{id}` - Excluir produto
- `GET /api/produtos/{id}/simular` - Simular cenários

### Fornecedores (global - compartilhado)
- `GET /api/fornecedores` - Listar fornecedores
- `POST /api/fornecedores` - Criar fornecedor
- `GET /api/fornecedores/{id}` - Ver detalhes
- `PUT /api/fornecedores/{id}` - Atualizar fornecedor
- `DELETE /api/fornecedores/{id}` - Excluir fornecedor

### Configurações (global - compartilhado)
- `GET /api/configuracoes` - Ver premissas
- `PUT /api/configuracoes` - Atualizar premissas

### Dashboard
- `GET /api/dashboard` - Estatísticas e top produtos

## 🧪 Testando a API

### Com curl:

**1. Cadastrar usuário:**
```bash
curl -X POST http://localhost:8000/api/auth/cadastro \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"Matheus\",\"email\":\"matheus@teste.com\",\"senha\":\"senha123\"}"
```

**2. Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"matheus@teste.com\",\"senha\":\"senha123\"}"
```

**3. Criar produto (use o token do login):**
```bash
curl -X POST http://localhost:8000/api/produtos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d "{\"nome\":\"Tábua Inox\",\"fornecedor_id\":1,\"custo_unitario\":12.50,\"preco_venda\":33.90}"
```

## 🔒 Segurança

- ✅ Senhas hasheadas com bcrypt
- ✅ JWT tokens (válidos por 7 dias)
- ✅ Cada usuário só acessa seus próprios dados
- ✅ Soft delete (dados nunca são perdidos)

⚠️ **IMPORTANTE**: Mude a `SECRET_KEY` em `auth.py` antes de colocar em produção!

## 📊 Dados Iniciais

Ao iniciar pela primeira vez, o sistema cria automaticamente:

**3 Fornecedores:**
1. Utimix
2. Zein
3. Top Rio

**Premissas padrão:**
- TACOS: 5%
- Comissão: 5%
- Prep: R$ 1,30
- Frete FBA: R$ 6,00
- Impostos: 4%

## 🐛 Troubleshooting

**Erro: ModuleNotFoundError**
```bash
pip install -r requirements.txt
```

**Erro: Porta 8000 já em uso**
```bash
# Mude a porta
uvicorn main:app --port 8001
```

**Erro: Permission denied ao criar pasta data/**
```bash
# Execute como administrador ou verifique permissões
```

## 📝 Licença

Proprietário - Todos os direitos reservados
