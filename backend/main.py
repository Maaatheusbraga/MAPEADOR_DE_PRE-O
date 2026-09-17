from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from database import Database
from auth import criar_token, verificar_token
from calculadora import CalculadoraLucro

app = FastAPI(
    title="Mapeador de Preços API",
    description="API para análise de lucratividade de produtos Amazon FBA",
    version="1.0.0"
)

# CORS para frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique os domínios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instâncias
db = Database("data")
calc = CalculadoraLucro()

# ============================================
# MODELOS PYDANTIC
# ============================================

class LoginRequest(BaseModel):
    email: str = Field(..., example="usuario@exemplo.com")
    senha: str = Field(..., min_length=6, example="senha123")

class CriarUsuarioRequest(BaseModel):
    nome: str = Field(..., min_length=3, max_length=100, example="João Silva")
    email: str = Field(..., example="joao@exemplo.com")
    senha: str = Field(..., min_length=6, example="senha123")

class CriarProdutoRequest(BaseModel):
    nome: str = Field(..., min_length=3, max_length=255, example="Tábua Inox")
    fornecedor_id: int = Field(..., gt=0, example=1)
    custo_unitario: float = Field(..., gt=0, example=12.50)
    preco_venda: float = Field(..., gt=0, example=33.90)

class AtualizarProdutoRequest(BaseModel):
    nome: Optional[str] = Field(None, min_length=3, max_length=255)
    fornecedor_id: Optional[int] = Field(None, gt=0)
    custo_unitario: Optional[float] = Field(None, gt=0)
    preco_venda: Optional[float] = Field(None, gt=0)

class CriarFornecedorRequest(BaseModel):
    nome: str = Field(..., min_length=3, max_length=100, example="Utimix")
    site_instagram: Optional[str] = Field("", max_length=500, example="https://www.utimix.com/")
    telefone: Optional[str] = Field("", max_length=100, example="(11) 95300-7505")
    observacoes: Optional[str] = Field("", max_length=1000)
    prioritario: Optional[bool] = Field(False)

class AtualizarFornecedorRequest(BaseModel):
    nome: Optional[str] = Field(None, min_length=3, max_length=100)
    site_instagram: Optional[str] = Field(None, max_length=500)
    telefone: Optional[str] = Field(None, max_length=100)
    observacoes: Optional[str] = Field(None, max_length=1000)
    prioritario: Optional[bool] = None

class AtualizarConfiguracoesRequest(BaseModel):
    tacos: Optional[float] = Field(None, ge=0, le=1)
    taxa_comissao: Optional[float] = Field(None, ge=0, le=1)
    custo_prep: Optional[float] = Field(None, ge=0)
    frete_fba: Optional[float] = Field(None, ge=0)
    aliquota_imposto: Optional[float] = Field(None, ge=0, le=1)

# ============================================
# DEPENDENCY: Autenticação
# ============================================

def get_current_user(authorization: str = Header(None)):
    """
    Valida token JWT e retorna dados do usuário
    
    Raises:
        HTTPException: Se token não fornecido ou inválido
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401, 
            detail="Token não fornecido. Use: Authorization: Bearer <token>"
        )
    
    token = authorization.replace("Bearer ", "")
    payload = verificar_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=401, 
            detail="Token inválido ou expirado"
        )
    
    return payload

# ============================================
# ENDPOINTS - ROOT
# ============================================

@app.get("/")
def root():
    """Endpoint raiz - verifica se API está funcionando"""
    return {
        "message": "API Mapeador de Preços - OK",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health():
    """Health check"""
    return {"status": "healthy"}

# ============================================
# ENDPOINTS - AUTENTICAÇÃO
# ============================================

@app.post("/api/auth/cadastro", tags=["Autenticação"])
def cadastro(dados: CriarUsuarioRequest):
    """
    Cadastra novo usuário
    
    - Cria usuário com senha hasheada (bcrypt)
    - Cria pasta individual para dados do usuário
    - Retorna token JWT válido por 7 dias
    """
    try:
        usuario = db.criar_usuario(
            nome=dados.nome,
            email=dados.email,
            senha=dados.senha
        )
        token = criar_token(usuario['id'], usuario['email'])
        return {
            "message": "Usuário criado com sucesso",
            "usuario": usuario,
            "token": token
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao criar usuário: {str(e)}")

@app.post("/api/auth/login", tags=["Autenticação"])
def login(dados: LoginRequest):
    """
    Faz login do usuário
    
    - Valida email e senha
    - Retorna token JWT válido por 7 dias
    """
    usuario = db.autenticar_usuario(dados.email, dados.senha)
    
    if not usuario:
        raise HTTPException(
            status_code=401, 
            detail="Email ou senha inválidos"
        )
    
    token = criar_token(usuario['id'], usuario['email'])
    return {
        "message": "Login realizado com sucesso",
        "usuario": usuario,
        "token": token
    }

@app.get("/api/auth/me", tags=["Autenticação"])
def get_me(current_user = Depends(get_current_user)):
    """Retorna dados do usuário logado"""
    return {
        "usuario_id": current_user['usuario_id'],
        "email": current_user['email']
    }

# ============================================
# ENDPOINTS - PRODUTOS (por usuário)
# ============================================

@app.get("/api/produtos", tags=["Produtos"])
def listar_produtos(current_user = Depends(get_current_user)):
    """
    Lista todos os produtos do usuário logado
    
    - Enriquece com dados do fornecedor
    - Retorna apenas produtos ativos
    """
    produtos = db.listar_produtos(current_user['usuario_id'])
    
    # Enriquecer com dados do fornecedor
    fornecedores = {f['id']: f for f in db.listar_fornecedores()}
    
    for produto in produtos:
        fornecedor = fornecedores.get(produto['fornecedor_id'])
        if fornecedor:
            produto['fornecedor'] = {
                "id": fornecedor['id'],
                "nome": fornecedor['nome'],
                "prioritario": fornecedor['prioritario']
            }
    
    return {
        "total": len(produtos),
        "produtos": produtos
    }

@app.post("/api/produtos", tags=["Produtos"])
def criar_produto(dados: CriarProdutoRequest, current_user = Depends(get_current_user)):
    """
    Cria novo produto para o usuário logado
    
    - Calcula automaticamente todos os custos e margem
    - Valida se fornecedor existe
    - Valida se preço > custo
    """
    # Validar se fornecedor existe
    fornecedor = db.obter_fornecedor(dados.fornecedor_id)
    if not fornecedor or not fornecedor['ativo']:
        raise HTTPException(status_code=404, detail="Fornecedor não encontrado")
    
    # Validar preço > custo
    if dados.preco_venda <= dados.custo_unitario:
        raise HTTPException(
            status_code=400, 
            detail="Preço de venda deve ser maior que custo unitário"
        )
    
    # Calcular margem
    try:
        config = db.obter_configuracoes()
        resultado = calc.calcular(
            custo_unitario=dados.custo_unitario,
            preco_venda=dados.preco_venda,
            config=config['premissas']
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    # Salvar produto
    produto = db.criar_produto(
        usuario_id=current_user['usuario_id'],
        nome=dados.nome,
        fornecedor_id=dados.fornecedor_id,
        custo_unitario=dados.custo_unitario,
        preco_venda=dados.preco_venda,
        calculado=resultado
    )
    
    # Adicionar dados do fornecedor
    produto['fornecedor'] = {
        "id": fornecedor['id'],
        "nome": fornecedor['nome']
    }
    
    return {
        "message": "Produto criado com sucesso",
        "produto": produto
    }

@app.get("/api/produtos/{produto_id}", tags=["Produtos"])
def obter_produto(produto_id: int, current_user = Depends(get_current_user)):
    """Obtém detalhes de um produto específico"""
    produto = db.obter_produto(current_user['usuario_id'], produto_id)
    
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    # Adicionar dados do fornecedor
    fornecedor = db.obter_fornecedor(produto['fornecedor_id'])
    if fornecedor:
        produto['fornecedor'] = fornecedor
    
    return produto

@app.put("/api/produtos/{produto_id}", tags=["Produtos"])
def atualizar_produto(
    produto_id: int, 
    dados: AtualizarProdutoRequest,
    current_user = Depends(get_current_user)
):
    """
    Atualiza um produto
    
    - Recalcula automaticamente se custo ou preço mudarem
    - Valida se fornecedor existe (se mudou)
    """
    # Buscar produto atual
    produto_atual = db.obter_produto(current_user['usuario_id'], produto_id)
    if not produto_atual:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    # Preparar dados para atualização
    dados_update = {}
    if dados.nome: dados_update['nome'] = dados.nome
    if dados.fornecedor_id: 
        # Validar fornecedor
        fornecedor = db.obter_fornecedor(dados.fornecedor_id)
        if not fornecedor or not fornecedor['ativo']:
            raise HTTPException(status_code=404, detail="Fornecedor não encontrado")
        dados_update['fornecedor_id'] = dados.fornecedor_id
    
    # Se custo ou preço mudaram, recalcular
    custo = dados.custo_unitario if dados.custo_unitario else produto_atual['custo_unitario']
    preco = dados.preco_venda if dados.preco_venda else produto_atual['preco_venda']
    
    if dados.custo_unitario: dados_update['custo_unitario'] = dados.custo_unitario
    if dados.preco_venda: dados_update['preco_venda'] = dados.preco_venda
    
    # Validar preço > custo
    if preco <= custo:
        raise HTTPException(
            status_code=400,
            detail="Preço de venda deve ser maior que custo unitário"
        )
    
    # Recalcular
    config = db.obter_configuracoes()
    resultado = calc.calcular(
        custo_unitario=custo,
        preco_venda=preco,
        config=config['premissas']
    )
    dados_update['calculado'] = resultado
    
    # Atualizar
    produto_atualizado = db.atualizar_produto(
        current_user['usuario_id'],
        produto_id,
        dados_update
    )
    
    if not produto_atualizado:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    return {
        "message": "Produto atualizado com sucesso",
        "produto": produto_atualizado
    }

@app.delete("/api/produtos/{produto_id}", tags=["Produtos"])
def excluir_produto(produto_id: int, current_user = Depends(get_current_user)):
    """
    Exclui (desativa) um produto
    
    - Soft delete: produto não é removido, apenas marcado como inativo
    """
    sucesso = db.excluir_produto(current_user['usuario_id'], produto_id)
    
    if not sucesso:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    return {"message": "Produto excluído com sucesso"}

@app.get("/api/produtos/{produto_id}/simular", tags=["Produtos"])
def simular_cenarios(produto_id: int, current_user = Depends(get_current_user)):
    """
    Simula diferentes cenários para um produto
    
    - E se aumentar/diminuir preço em 10%?
    - E se diminuir custo em 10%?
    - E se reduzir TACOS para 3%?
    """
    produto = db.obter_produto(current_user['usuario_id'], produto_id)
    
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    config = db.obter_configuracoes()
    simulacoes = calc.simular_cenarios(produto, config['premissas'])
    
    return {
        "produto": {
            "nome": produto['nome'],
            "custo": produto['custo_unitario'],
            "preco": produto['preco_venda'],
            "margem_atual": produto['calculado']['margem_com_ads'],
            "lucro_atual": produto['calculado']['lucro_com_ads']
        },
        "simulacoes": simulacoes
    }

# ============================================
# ENDPOINTS - FORNECEDORES (global)
# ============================================

@app.get("/api/fornecedores", tags=["Fornecedores"])
def listar_fornecedores(current_user = Depends(get_current_user)):
    """Lista todos os fornecedores ativos (global - compartilhado)"""
    fornecedores = db.listar_fornecedores()
    return {
        "total": len(fornecedores),
        "fornecedores": fornecedores
    }

@app.post("/api/fornecedores", tags=["Fornecedores"])
def criar_fornecedor(dados: CriarFornecedorRequest, current_user = Depends(get_current_user)):
    """
    Cria novo fornecedor (global - qualquer usuário pode criar)
    
    - Fornecedor fica disponível para todos os usuários
    - Nome deve ser único
    """
    try:
        fornecedor = db.criar_fornecedor(
            nome=dados.nome,
            site_instagram=dados.site_instagram or "",
            telefone=dados.telefone or "",
            observacoes=dados.observacoes or "",
            prioritario=dados.prioritario or False
        )
        return {
            "message": "Fornecedor criado com sucesso",
            "fornecedor": fornecedor
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/fornecedores/{fornecedor_id}", tags=["Fornecedores"])
def obter_fornecedor(fornecedor_id: int, current_user = Depends(get_current_user)):
    """Obtém detalhes de um fornecedor"""
    fornecedor = db.obter_fornecedor(fornecedor_id)
    
    if not fornecedor or not fornecedor['ativo']:
        raise HTTPException(status_code=404, detail="Fornecedor não encontrado")
    
    return fornecedor

@app.put("/api/fornecedores/{fornecedor_id}", tags=["Fornecedores"])
def atualizar_fornecedor(
    fornecedor_id: int,
    dados: AtualizarFornecedorRequest,
    current_user = Depends(get_current_user)
):
    """
    Atualiza um fornecedor
    
    - Atualiza apenas os campos enviados
    - Alteração afeta todos os usuários (fornecedor é global)
    """
    # Verificar se fornecedor existe
    fornecedor = db.obter_fornecedor(fornecedor_id)
    if not fornecedor or not fornecedor['ativo']:
        raise HTTPException(status_code=404, detail="Fornecedor não encontrado")
    
    # Preparar dados para atualização (apenas campos não-None)
    dados_update = {}
    if dados.nome is not None: dados_update['nome'] = dados.nome
    if dados.site_instagram is not None: dados_update['site_instagram'] = dados.site_instagram
    if dados.telefone is not None: dados_update['telefone'] = dados.telefone
    if dados.observacoes is not None: dados_update['observacoes'] = dados.observacoes
    if dados.prioritario is not None: dados_update['prioritario'] = dados.prioritario
    
    if not dados_update:
        raise HTTPException(status_code=400, detail="Nenhum campo para atualizar")
    
    fornecedor_atualizado = db.atualizar_fornecedor(fornecedor_id, dados_update)
    
    if not fornecedor_atualizado:
        raise HTTPException(status_code=404, detail="Fornecedor não encontrado")
    
    return {
        "message": "Fornecedor atualizado com sucesso",
        "fornecedor": fornecedor_atualizado
    }

@app.delete("/api/fornecedores/{fornecedor_id}", tags=["Fornecedores"])
def excluir_fornecedor(fornecedor_id: int, current_user = Depends(get_current_user)):
    """
    Exclui (desativa) um fornecedor
    
    - Soft delete: fornecedor não é removido, apenas marcado como inativo
    - Produtos que usam este fornecedor continuam funcionando
    """
    sucesso = db.excluir_fornecedor(fornecedor_id)
    
    if not sucesso:
        raise HTTPException(status_code=404, detail="Fornecedor não encontrado")
    
    return {"message": "Fornecedor excluído com sucesso"}

# ============================================
# ENDPOINTS - CONFIGURAÇÕES (global)
# ============================================

@app.get("/api/configuracoes", tags=["Configurações"])
def obter_configuracoes(current_user = Depends(get_current_user)):
    """
    Obtém configurações atuais (premissas globais)
    
    - TACOS, Comissão, Prep, Frete, Impostos
    """
    return db.obter_configuracoes()

@app.put("/api/configuracoes", tags=["Configurações"])
def atualizar_configuracoes(
    dados: AtualizarConfiguracoesRequest,
    current_user = Depends(get_current_user)
):
    """
    Atualiza configurações globais
    
    - Atualiza apenas os campos enviados
    - Alteração afeta todos os cálculos futuros
    - ⚠️ Produtos já criados mantêm os valores calculados antigos
    """
    config_atual = db.obter_configuracoes()
    premissas = config_atual['premissas'].copy()
    
    # Atualizar apenas campos não-None
    if dados.tacos is not None: premissas['tacos'] = dados.tacos
    if dados.taxa_comissao is not None: premissas['taxa_comissao'] = dados.taxa_comissao
    if dados.custo_prep is not None: premissas['custo_prep'] = dados.custo_prep
    if dados.frete_fba is not None: premissas['frete_fba'] = dados.frete_fba
    if dados.aliquota_imposto is not None: premissas['aliquota_imposto'] = dados.aliquota_imposto
    
    db.atualizar_configuracoes(premissas, current_user['email'])
    
    return {
        "message": "Configurações atualizadas com sucesso",
        "premissas": premissas
    }

# ============================================
# ENDPOINTS - DASHBOARD/ESTATÍSTICAS
# ============================================

@app.get("/api/dashboard", tags=["Dashboard"])
def obter_dashboard(current_user = Depends(get_current_user)):
    """
    Retorna dados para o dashboard do usuário
    
    - Estatísticas gerais
    - Top 5 produtos mais lucrativos
    - Produtos com prejuízo
    """
    produtos = db.listar_produtos(current_user['usuario_id'])
    
    if not produtos:
        return {
            "estatisticas": {
                "total_produtos": 0,
                "produtos_lucrativos": 0,
                "margem_media": 0,
                "lucro_medio": 0
            },
            "top_produtos": [],
            "produtos_prejuizo": []
        }
    
    # Estatísticas
    stats = db.obter_estatisticas_usuario(current_user['usuario_id'])
    
    # Top 5 mais lucrativos
    produtos_ordenados = sorted(
        produtos,
        key=lambda p: p['calculado']['lucro_com_ads'],
        reverse=True
    )
    top_5 = produtos_ordenados[:5]
    
    # Produtos com prejuízo
    prejuizo = [p for p in produtos if not p['calculado']['lucrativo']]
    
    # Enriquecer com fornecedor
    fornecedores = {f['id']: f['nome'] for f in db.listar_fornecedores()}
    for p in top_5 + prejuizo:
        p['fornecedor_nome'] = fornecedores.get(p['fornecedor_id'], 'Desconhecido')
    
    return {
        "estatisticas": stats,
        "top_produtos": top_5,
        "produtos_prejuizo": prejuizo
    }


if __name__ == "__main__":
    import uvicorn
    print("🚀 Iniciando servidor...")
    print("📝 Documentação: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)
