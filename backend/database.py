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
        
        # fornecedores.json - lista completa extraída da planilha
        if not self.fornecedores_file.exists():
            seed_file = Path(__file__).parent / "fornecedores_completo.json"
            if seed_file.exists():
                self._save_json(self.fornecedores_file, self._load_json(seed_file))
            else:
                self._save_json(self.fornecedores_file, {
                    "fornecedores": [],
                    "proximo_id": 1
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
    
    def listar_usuarios(self) -> List[Dict]:
        """Lista todos os usuários (sem senha)"""
        data = self._load_json(self.usuarios_file)
        usuarios_safe = []
        for u in data['usuarios']:
            if u['ativo']:
                usuario = u.copy()
                del usuario['senha_hash']
                usuarios_safe.append(usuario)
        return usuarios_safe
    
    # ============================================
    # FORNECEDORES (GLOBAL)
    # ============================================
    
    def listar_fornecedores(self, apenas_ativos: bool = True) -> List[Dict]:
        """Lista todos os fornecedores"""
        data = self._load_json(self.fornecedores_file)
        if apenas_ativos:
            return [f for f in data['fornecedores'] if f['ativo']]
        return data['fornecedores']
    
    def obter_fornecedor(self, fornecedor_id: int) -> Optional[Dict]:
        """Obtém um fornecedor por ID"""
        data = self._load_json(self.fornecedores_file)
        for f in data['fornecedores']:
            if f['id'] == fornecedor_id:
                return f
        return None
    
    def criar_fornecedor(self, nome: str, site_instagram: str = "", 
                        telefone: str = "", observacoes: str = "", 
                        prioritario: bool = False) -> Dict:
        """Cria novo fornecedor"""
        data = self._load_json(self.fornecedores_file)
        
        # Verificar se nome já existe
        if any(f['nome'].lower() == nome.lower() and f['ativo'] for f in data['fornecedores']):
            raise ValueError("Fornecedor com este nome já existe")
        
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
    
    def atualizar_fornecedor(self, fornecedor_id: int, dados: Dict) -> Optional[Dict]:
        """Atualiza um fornecedor"""
        data = self._load_json(self.fornecedores_file)
        
        for i, f in enumerate(data['fornecedores']):
            if f['id'] == fornecedor_id:
                # Atualizar campos permitidos
                campos_permitidos = ['nome', 'site_instagram', 'telefone', 'observacoes', 'prioritario']
                for campo in campos_permitidos:
                    if campo in dados:
                        data['fornecedores'][i][campo] = dados[campo]
                
                data['fornecedores'][i]['updated_at'] = datetime.now().isoformat()
                self._save_json(self.fornecedores_file, data)
                return data['fornecedores'][i]
        
        return None
    
    def excluir_fornecedor(self, fornecedor_id: int) -> bool:
        """Exclui (desativa) um fornecedor"""
        data = self._load_json(self.fornecedores_file)
        
        for i, f in enumerate(data['fornecedores']):
            if f['id'] == fornecedor_id:
                data['fornecedores'][i]['ativo'] = False
                data['fornecedores'][i]['updated_at'] = datetime.now().isoformat()
                self._save_json(self.fornecedores_file, data)
                return True
        
        return False
    
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
    
    def atualizar_produto(self, usuario_id: int, produto_id: int, 
                         dados: Dict) -> Optional[Dict]:
        """Atualiza um produto"""
        filepath = self._get_user_file(usuario_id, "produtos.json")
        data = self._load_json(filepath)
        
        for i, p in enumerate(data['produtos']):
            if p['id'] == produto_id and p['ativo']:
                # Atualizar campos
                for campo in ['nome', 'fornecedor_id', 'custo_unitario', 'preco_venda', 'calculado']:
                    if campo in dados:
                        data['produtos'][i][campo] = dados[campo]
                
                data['produtos'][i]['updated_at'] = datetime.now().isoformat()
                self._save_json(filepath, data)
                return data['produtos'][i]
        
        return None
    
    def excluir_produto(self, usuario_id: int, produto_id: int) -> bool:
        """Exclui (desativa) um produto"""
        filepath = self._get_user_file(usuario_id, "produtos.json")
        data = self._load_json(filepath)
        
        for i, p in enumerate(data['produtos']):
            if p['id'] == produto_id:
                data['produtos'][i]['ativo'] = False
                data['produtos'][i]['updated_at'] = datetime.now().isoformat()
                self._save_json(filepath, data)
                return True
        
        return False
    
    def obter_estatisticas_usuario(self, usuario_id: int) -> Dict:
        """Obtém estatísticas dos produtos de um usuário"""
        produtos = self.listar_produtos(usuario_id)
        
        if not produtos:
            return {
                "total_produtos": 0,
                "produtos_lucrativos": 0,
                "margem_media": 0,
                "lucro_medio": 0
            }
        
        lucrativos = [p for p in produtos if p['calculado']['lucrativo']]
        margens = [p['calculado']['margem_com_ads'] for p in produtos]
        lucros = [p['calculado']['lucro_com_ads'] for p in produtos]
        
        return {
            "total_produtos": len(produtos),
            "produtos_lucrativos": len(lucrativos),
            "margem_media": sum(margens) / len(margens) if margens else 0,
            "lucro_medio": sum(lucros) / len(lucros) if lucros else 0
        }
