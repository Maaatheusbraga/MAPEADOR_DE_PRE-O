# 🗂️ ESTRUTURA DE DADOS COM JSON

## 📁 Estrutura de Arquivos

```
backend/
├── data/
│   ├── usuarios.json          # Usuários e senhas (hash)
│   ├── fornecedores.json      # GLOBAL - Todos compartilham
│   ├── configuracoes.json     # GLOBAL - Premissas compartilhadas
│   └── users/                 # Dados individuais por usuário
│       ├── user_1/
│       │   ├── produtos.json
│       │   ├── dre.json
│       │   └── fluxo_caixa.json
│       ├── user_2/
│       │   ├── produtos.json
│       │   ├── dre.json
│       │   └── fluxo_caixa.json
│       └── ...
```

---

## 📄 ESTRUTURA DOS ARQUIVOS JSON

### 1. usuarios.json (Autenticação)
```json
{
  "usuarios": [
    {
      "id": 1,
      "nome": "Matheus",
      "email": "matheus@exemplo.com",
      "senha_hash": "$2b$12$KIXxWxTU8H9fZq3...",
      "ativo": true,
      "created_at": "2026-09-17T08:00:00Z"
    },
    {
      "id": 2,
      "nome": "João",
      "email": "joao@exemplo.com",
      "senha_hash": "$2b$12$LJYyXyUV9I0gAr4...",
      "ativo": true,
      "created_at": "2026-09-17T09:00:00Z"
    }
  ],
  "proximo_id": 3
}
```

---

### 2. fornecedores.json (GLOBAL - Compartilhado)
```json
{
  "fornecedores": [
    {
      "id": 1,
      "nome": "Utimix",
      "site_instagram": "https://www.utimix.com/",
      "telefone": "(11) 95300-7505",
      "observacoes": "",
      "prioritario": true,
      "ativo": true,
      "created_at": "2026-09-17T08:00:00Z"
    },
    {
      "id": 2,
      "nome": "Zein",
      "site_instagram": "https://www.zein.com.br/",
      "telefone": "(11) 94725-1366 - João",
      "observacoes": "",
      "prioritario": true,
      "ativo": true,
      "created_at": "2026-09-17T08:00:00Z"
    }
  ],
  "proximo_id": 3
}
```

---

### 3. configuracoes.json (GLOBAL - Compartilhado)
```json
{
  "premissas": {
    "tacos": 0.05,
    "taxa_comissao": 0.05,
    "custo_prep": 1.30,
    "frete_fba": 6.00,
    "aliquota_imposto": 0.04
  },
  "updated_at": "2026-09-17T08:00:00Z",
  "updated_by": "admin"
}
```

---

### 4. users/user_1/produtos.json (Individual por usuário)
```json
{
  "usuario_id": 1,
  "produtos": [
    {
      "id": 1,
      "nome": "Tábua Inox",
      "fornecedor_id": 1,
      "custo_unitario": 12.50,
      "preco_venda": 33.90,
      
      "calculado": {
        "comissao": 1.70,
        "prep": 1.30,
        "frete": 6.00,
        "impostos": 1.36,
        "ads": 1.70,
        "custo_total": 24.56,
        "margem_com_ads": 0.2754,
        "lucro_com_ads": 9.34,
        "lucrativo": true,
        "classificacao": "EXCELENTE"
      },
      
      "ativo": true,
      "created_at": "2026-09-17T08:00:00Z",
      "updated_at": "2026-09-17T08:00:00Z"
    }
  ],
  "proximo_id": 2
}
```

---

## 💻 CÓDIGO PYTHON COMPLETO

### requirements.txt
```
fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
bcrypt==4.1.1
PyJWT==2.8.0
```

---

### database.py - Gerenciador de JSON
```python
import json
import os
from typing import Dict, List, Optional
from pathlib import Path
import bcrypt
from datetime import datetime

class Database:
    """Gerenciador de banco de dados JSON"""
    
    def __init__(self, base_path: str = "data"):
        self.base_path = Path(base_path)
        self.base_path.mkdir(exist_ok=True)
        
        # Caminhos dos arquivos globais
        self.usuarios_file = self.base_path / "usuarios.json"
        self.fornecedores_file = self.base_path / "fornecedores.json"
        self.configuracoes_file = self.base_path / "configuracoes.json"
        
        # Diretório de usuários
        self.users_dir = self.base_path / "users"
        self.users_dir.mkdir(exist_ok=True)
        
        # Inicializar arquivos se não existirem
        self._init_files()
    
    def _init_files(self):
        """Inicializa arquivos JSON se não existirem"""
        
        # usuarios.json
        if not self.usuarios_file.exists():
            self._save_json(self.usuarios_file, {
                "usuarios": [],
                "proximo_id": 1
            })
        
        # fornecedores.json - DADOS INICIAIS
        if not self.fornecedores_file.exists():
            self._save_json(self.fornecedores_file, {
                "fornecedores": [
                    {
                        "id": 1,
                        "nome": "Utimix",
                        "site_instagram": "https://www.utimix.com/",
                        "telefone": "(11) 95300-7505",
                        "observacoes": "",
                        "prioritario": True,
                        "ativo": True,
                        "created_at": datetime.now().isoformat()
                    },
                    {
                        "id": 2,
                        "nome": "Zein",
                        "site_instagram": "https://www.zein.com.br/",
                        "telefone": "(11) 94725-1366 - João",
                        "observacoes": "",
                        "prioritario": True,
                        "ativo": True,
                        "created_at": datetime.now().isoformat()
                    },
                    {
                        "id": 3,
                        "nome": "Top Rio",
                        "site_instagram": "https://www.instagram.com/toprio_importadora_ofc/",
                        "telefone": "(21) 97038-5924 - Giulia / (11) 98637-9492 - Fernanda",
                        "observacoes": "Começar por este fornecedor",
                        "prioritario": True,
                        "ativo": True,
                        "created_at": datetime.now().isoformat()
                    }
                ],
                "proximo_id": 4
            })
        
        # configuracoes.json
        if not self.configuracoes_file.exists():
            self._save_json(self.configuracoes_file, {
                "premissas": {
                    "tacos": 0.05,
                    "taxa_comissao": 0.05,
                    "custo_prep": 1.30,
                    "frete_fba": 6.00,
                    "aliquota_imposto": 0.04
                },
                "updated_at": datetime.now().isoformat(),
                "updated_by": "sistema"
            })
    
    def _load_json(self, filepath: Path) -> Dict:
        """Carrega arquivo JSON"""
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def _save_json(self, filepath: Path, data: Dict):
        """Salva arquivo JSON"""
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    
    # ============================================
    # USUÁRIOS
    # ============================================
    
    def criar_usuario(self, nome: str, email: str, senha: str) -> Dict:
        """Cria novo usuário"""
        data = self._load_json(self.usuarios_file)
        
        # Verificar se email já existe
        if any(u['email'] == email for u in data['usuarios']):
            raise ValueError("Email já cadastrado")
        
        # Hash da senha
        senha_hash = bcrypt.hashpw(senha.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Criar usuário
        usuario = {
            "id": data['proximo_id'],
            "nome": nome,
            "email": email,
            "senha_hash": senha_hash,
            "ativo": True,
            "created_at": datetime.now().isoformat()
        }
        
        data['usuarios'].append(usuario)
        data['proximo_id'] += 1
        
        self._save_json(self.usuarios_file, data)
        
        # Criar pasta do usuário
        user_dir = self.users_dir / f"user_{usuario['id']}"
        user_dir.mkdir(exist_ok=True)
        
        # Inicializar arquivos do usuário
        self._save_json(user_dir / "produtos.json", {
            "usuario_id": usuario['id'],
            "produtos": [],
            "proximo_id": 1
        })
        
        self._save_json(user_dir / "dre.json", {
            "usuario_id": usuario['id'],
            "meses": []
        })
        
        self._save_json(user_dir / "fluxo_caixa.json", {
            "usuario_id": usuario['id'],
            "saldo_atual": {"caixa": 0, "banco": 0, "total": 0},
            "movimentacoes": [],
            "passivos": [],
            "proximo_id_movimentacao": 1,
            "proximo_id_passivo": 1
        })
        
        # Remover senha_hash antes de retornar
        usuario_safe = usuario.copy()
        del usuario_safe['senha_hash']
        return usuario_safe
    
    def autenticar_usuario(self, email: str, senha: str) -> Optional[Dict]:
        """Autentica usuário"""
        data = self._load_json(self.usuarios_file)
        
        for usuario in data['usuarios']:
            if usuario['email'] == email and usuario['ativo']:
                # Verificar senha
                if bcrypt.checkpw(senha.encode('utf-8'), usuario['senha_hash'].encode('utf-8')):
                    usuario_safe = usuario.copy()
                    del usuario_safe['senha_hash']
                    return usuario_safe
        
        return None
    
    # ============================================
    # FORNECEDORES (GLOBAL)
    # ============================================
    
    def listar_fornecedores(self) -> List[Dict]:
        """Lista todos os fornecedores"""
        data = self._load_json(self.fornecedores_file)
        return [f for f in data['fornecedores'] if f['ativo']]
    
    def criar_fornecedor(self, nome: str, site_instagram: str = "", 
                        telefone: str = "", observacoes: str = "", 
                        prioritario: bool = False) -> Dict:
        """Cria novo fornecedor"""
        data = self._load_json(self.fornecedores_file)
        
        fornecedor = {
            "id": data['proximo_id'],
            "nome": nome,
            "site_instagram": site_instagram,
            "telefone": telefone,
            "observacoes": observacoes,
            "prioritario": prioritario,
            "ativo": True,
            "created_at": datetime.now().isoformat()
        }
        
        data['fornecedores'].append(fornecedor)
        data['proximo_id'] += 1
        
        self._save_json(self.fornecedores_file, data)
        return fornecedor
    
    # ============================================
    # CONFIGURAÇÕES (GLOBAL)
    # ============================================
    
    def obter_configuracoes(self) -> Dict:
        """Obtém configurações atuais"""
        return self._load_json(self.configuracoes_file)
    
    def atualizar_configuracoes(self, premissas: Dict, usuario: str = "sistema"):
        """Atualiza configurações"""
        data = {
            "premissas": premissas,
            "updated_at": datetime.now().isoformat(),
            "updated_by": usuario
        }
        self._save_json(self.configuracoes_file, data)
    
    # ============================================
    # PRODUTOS (POR USUÁRIO)
    # ============================================
    
    def _get_user_file(self, usuario_id: int, filename: str) -> Path:
        """Retorna caminho do arquivo do usuário"""
        return self.users_dir / f"user_{usuario_id}" / filename
    
    def criar_produto(self, usuario_id: int, nome: str, fornecedor_id: int,
                     custo_unitario: float, preco_venda: float,
                     calculado: Dict) -> Dict:
        """Cria novo produto para um usuário"""
        filepath = self._get_user_file(usuario_id, "produtos.json")
        data = self._load_json(filepath)
        
        produto = {
            "id": data['proximo_id'],
            "nome": nome,
            "fornecedor_id": fornecedor_id,
            "custo_unitario": custo_unitario,
            "preco_venda": preco_venda,
            "calculado": calculado,
            "ativo": True,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        
        data['produtos'].append(produto)
        data['proximo_id'] += 1
        
        self._save_json(filepath, data)
        return produto
    
    def listar_produtos(self, usuario_id: int) -> List[Dict]:
        """Lista produtos de um usuário"""
        filepath = self._get_user_file(usuario_id, "produtos.json")
        data = self._load_json(filepath)
        return [p for p in data['produtos'] if p['ativo']]
    
    def obter_produto(self, usuario_id: int, produto_id: int) -> Optional[Dict]:
        """Obtém um produto específico"""
        filepath = self._get_user_file(usuario_id, "produtos.json")
        data = self._load_json(filepath)
        for p in data['produtos']:
            if p['id'] == produto_id and p['ativo']:
                return p
        return None
```

---

### calculadora.py - Lógica de Cálculo
```python
from typing import Dict

class CalculadoraLucro:
    """Calcula lucratividade de produtos"""
    
    def calcular(self, custo_unitario: float, preco_venda: float, 
                 config: Dict) -> Dict:
        """
        Calcula todos os valores de um produto
        
        Args:
            custo_unitario: Custo de compra
            preco_venda: Preço de venda
            config: Dicionário com premissas (tacos, taxa_comissao, etc)
        
        Returns:
            Dict com todos os valores calculados
        """
        # Extrair configurações
        tacos = config.get('tacos', 0.05)
        taxa_comissao = config.get('taxa_comissao', 0.05)
        custo_prep = config.get('custo_prep', 1.30)
        frete_fba = config.get('frete_fba', 6.00)
        aliquota_imposto = config.get('aliquota_imposto', 0.04)
        
        # Calcular custos
        comissao = preco_venda * taxa_comissao
        prep = custo_prep
        frete = frete_fba
        impostos = preco_venda * aliquota_imposto
        ads = preco_venda * tacos
        
        # Custos totais
        custo_total = custo_unitario + comissao + prep + frete + impostos + ads
        
        # Margem e lucro
        lucro = preco_venda - custo_total
        margem = lucro / preco_venda if preco_venda > 0 else 0
        margem = max(0, margem)  # Não deixar negativo
        
        # Classificação
        if margem >= 0.25:
            classificacao = "EXCELENTE"
        elif margem >= 0.15:
            classificacao = "BOM"
        elif margem >= 0.05:
            classificacao = "MARGINAL"
        else:
            classificacao = "PREJUÍZO"
        
        return {
            "comissao": round(comissao, 2),
            "prep": round(prep, 2),
            "frete": round(frete, 2),
            "impostos": round(impostos, 2),
            "ads": round(ads, 2),
            "custo_total": round(custo_total, 2),
            "margem_com_ads": round(margem, 4),
            "lucro_com_ads": round(lucro, 2),
            "lucrativo": lucro > 0,
            "classificacao": classificacao
        }
```

---

### auth.py - Autenticação JWT
```python
from datetime import datetime, timedelta
from typing import Optional
import jwt

SECRET_KEY = "mude-esta-chave-em-producao-use-algo-aleatorio"
ALGORITHM = "HS256"

def criar_token(usuario_id: int, email: str) -> str:
    """Cria JWT token"""
    payload = {
        "usuario_id": usuario_id,
        "email": email,
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verificar_token(token: str) -> Optional[dict]:
    """Verifica JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
```

---

### main.py - API FastAPI
```python
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from database import Database
from auth import criar_token, verificar_token
from calculadora import CalculadoraLucro

app = FastAPI(title="Mapeador de Preços API")

# CORS para frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db = Database("data")
calc = CalculadoraLucro()

# ============================================
# MODELOS
# ============================================

class LoginRequest(BaseModel):
    email: str
    senha: str

class CriarUsuarioRequest(BaseModel):
    nome: str
    email: str
    senha: str

class CriarProdutoRequest(BaseModel):
    nome: str
    fornecedor_id: int
    custo_unitario: float
    preco_venda: float

# ============================================
# DEPENDENCY: Autenticação
# ============================================

def get_current_user(authorization: str = Header(None)):
    """Valida token e retorna usuário atual"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token não fornecido")
    
    token = authorization.replace("Bearer ", "")
    payload = verificar_token(token)
    
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido")
    
    return payload

# ============================================
# ENDPOINTS - AUTENTICAÇÃO
# ============================================

@app.post("/api/auth/cadastro")
def cadastro(dados: CriarUsuarioRequest):
    """Cadastra novo usuário"""
    try:
        usuario = db.criar_usuario(
            nome=dados.nome,
            email=dados.email,
            senha=dados.senha
        )
        token = criar_token(usuario['id'], usuario['email'])
        return {
            "usuario": usuario,
            "token": token
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/auth/login")
def login(dados: LoginRequest):
    """Faz login"""
    usuario = db.autenticar_usuario(dados.email, dados.senha)
    
    if not usuario:
        raise HTTPException(status_code=401, detail="Email ou senha inválidos")
    
    token = criar_token(usuario['id'], usuario['email'])
    return {
        "usuario": usuario,
        "token": token
    }

# ============================================
# ENDPOINTS - PRODUTOS (requer autenticação)
# ============================================

@app.get("/api/produtos")
def listar_produtos(current_user = Depends(get_current_user)):
    """Lista produtos do usuário logado"""
    produtos = db.listar_produtos(current_user['usuario_id'])
    
    # Enriquecer com dados do fornecedor
    fornecedores = {f['id']: f for f in db.listar_fornecedores()}
    
    for produto in produtos:
        fornecedor = fornecedores.get(produto['fornecedor_id'])
        if fornecedor:
            produto['fornecedor'] = fornecedor
    
    return produtos

@app.post("/api/produtos")
def criar_produto(dados: CriarProdutoRequest, current_user = Depends(get_current_user)):
    """Cria novo produto"""
    # Calcular margem
    config = db.obter_configuracoes()
    resultado = calc.calcular(
        custo_unitario=dados.custo_unitario,
        preco_venda=dados.preco_venda,
        config=config['premissas']
    )
    
    # Salvar produto
    produto = db.criar_produto(
        usuario_id=current_user['usuario_id'],
        nome=dados.nome,
        fornecedor_id=dados.fornecedor_id,
        custo_unitario=dados.custo_unitario,
        preco_venda=dados.preco_venda,
        calculado=resultado
    )
    
    return produto

@app.get("/api/produtos/{produto_id}")
def obter_produto(produto_id: int, current_user = Depends(get_current_user)):
    """Obtém detalhes de um produto"""
    produto = db.obter_produto(current_user['usuario_id'], produto_id)
    
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    return produto

# ============================================
# ENDPOINTS - FORNECEDORES (GLOBAL)
# ============================================

@app.get("/api/fornecedores")
def listar_fornecedores(current_user = Depends(get_current_user)):
    """Lista todos os fornecedores"""
    return db.listar_fornecedores()

# ============================================
# ENDPOINTS - CONFIGURAÇÕES (GLOBAL)
# ============================================

@app.get("/api/configuracoes")
def obter_configuracoes(current_user = Depends(get_current_user)):
    """Obtém configurações atuais"""
    return db.obter_configuracoes()

# ============================================
# ENDPOINT DE TESTE (sem autenticação)
# ============================================

@app.get("/")
def root():
    return {"message": "API Mapeador de Preços - OK"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

---

## 🚀 COMO RODAR

### 1. Instalar dependências
```bash
pip install fastapi uvicorn pydantic bcrypt PyJWT
```

### 2. Rodar o servidor
```bash
python main.py
```

### 3. Testar a API

**Cadastrar usuário:**
```bash
curl -X POST http://localhost:8000/api/auth/cadastro \
  -H "Content-Type: application/json" \
  -d '{"nome":"Matheus","email":"matheus@teste.com","senha":"senha123"}'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"matheus@teste.com","senha":"senha123"}'
```

**Criar produto (com token):**
```bash
curl -X POST http://localhost:8000/api/produtos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"nome":"Tábua Inox","fornecedor_id":1,"custo_unitario":12.50,"preco_venda":33.90}'
```

---

## 📊 RESUMO

### ✅ O que tem:
- ✅ Autenticação com JWT
- ✅ Hash de senha com bcrypt
- ✅ Cada usuário tem seus produtos
- ✅ Fornecedores e configs são globais
- ✅ Cálculo automático
- ✅ Armazenamento em JSON

### 🔐 Segurança:
- ✅ Senhas nunca são salvas em texto puro
- ✅ Token JWT para cada sessão
- ✅ Usuário só acessa seus próprios dados
- ✅ Token expira em 7 dias

### 📂 Estrutura:
```
GLOBAL (compartilhado):
├── fornecedores
└── configurações

POR USUÁRIO (individual):
├── produtos
├── DRE
└── fluxo de caixa
```

---

Perfeito agora? Quer que eu crie o frontend também? 🚀
