# 🎯 ANÁLISE INTELIGENTE - LÓGICA DO SISTEMA REAL

## 💡 ENTENDIMENTO CORRETO

Você está certo! Das **554 fórmulas** identificadas, na verdade existem apenas **7 fórmulas únicas** que se repetem para cada linha de produto.

---

## 🧮 AS 7 FÓRMULAS ÚNICAS

### Fórmula 1: Comissão
```excel
=E10*$C$5
```
**Em português**: Preço de Venda × Taxa de Comissão (5%)

**No sistema**:
```python
comissao = preco_venda * 0.05
```

---

### Fórmula 2: Prep (Fixo)
```excel
=$C$4
```
**Em português**: Valor fixo de R$ 1,30

**No sistema**:
```python
prep = 1.30  # Vem da configuração
```

---

### Fórmula 3: Frete (Fixo)
```excel
=$C$7
```
**Em português**: Valor fixo de R$ 6,00

**No sistema**:
```python
frete = 6.00  # Vem da configuração
```

---

### Fórmula 4: Impostos
```excel
=E10*$C$6
```
**Em português**: Preço de Venda × Alíquota de Imposto (4%)

**No sistema**:
```python
impostos = preco_venda * 0.04
```

---

### Fórmula 5: Margem SEM ADS
```excel
=IFERROR((E10-D10-F10-G10-H10-I10)/E10,0)
```
**Em português**: (Receita - Custos) / Receita

**No sistema**:
```python
margem_sem_ads = (preco_venda - custo_unitario - comissao - prep - frete - impostos) / preco_venda
if margem_sem_ads < 0:
    margem_sem_ads = 0
```

---

### Fórmula 6: ADS (TACOS)
```excel
=E10*$C$3
```
**Em português**: Preço de Venda × TACOS (5%)

**No sistema**:
```python
ads = preco_venda * 0.05
```

---

### Fórmula 7: Margem COM ADS (Real)
```excel
=IFERROR((E10-D10-F10-G10-H10-I10-K10)/E10,0)
```
**Em português**: (Receita - Custos - ADS) / Receita

**No sistema**:
```python
margem_com_ads = (preco_venda - custo_unitario - comissao - prep - frete - impostos - ads) / preco_venda
if margem_com_ads < 0:
    margem_com_ads = 0
```

---

## 🏗️ COMO ISSO FICA NO SISTEMA

### 1️⃣ INTERFACE DE CADASTRO (Simples)

```
┌─────────────────────────────────────────────┐
│         CADASTRAR NOVO PRODUTO              │
├─────────────────────────────────────────────┤
│                                             │
│  Nome do Produto *                          │
│  [Tábua Inox___________________]            │
│                                             │
│  Fornecedor *                               │
│  [▼ Utimix_____________________]            │
│                                             │
│  Custo Unitário (R$) *                      │
│  [12,50________________________]            │
│                                             │
│  Preço de Venda (R$) *                      │
│  [33,90________________________]            │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │ 💡 CÁLCULO AUTOMÁTICO               │  │
│  │                                      │  │
│  │ Comissão:      R$ 1,70              │  │
│  │ Prep:          R$ 1,30              │  │
│  │ Frete:         R$ 6,00              │  │
│  │ Impostos:      R$ 1,36              │  │
│  │ ADS:           R$ 1,70              │  │
│  │ ─────────────────────────            │  │
│  │ Custo Total:   R$ 24,56             │  │
│  │                                      │  │
│  │ Lucro:         R$ 9,34/unidade      │  │
│  │ Margem:        27,54%               │  │
│  │                                      │  │
│  │ ✅ PRODUTO LUCRATIVO!               │  │
│  └──────────────────────────────────────┘  │
│                                             │
│      [Cancelar]     [Salvar Produto]       │
│                                             │
└─────────────────────────────────────────────┘
```

**Usuário só preenche 4 campos, o resto é automático!**

---

### 2️⃣ CÓDIGO DA LÓGICA DE NEGÓCIO

#### Classe Principal: `CalculadoraLucro`

```python
from dataclasses import dataclass
from typing import Optional

@dataclass
class Configuracoes:
    """Premissas do sistema (valores configuráveis)"""
    tacos: float = 0.05           # 5%
    taxa_comissao: float = 0.05   # 5%
    custo_prep: float = 1.30
    frete_fba: float = 6.00
    aliquota_imposto: float = 0.04  # 4%


@dataclass
class ResultadoCalculo:
    """Resultado do cálculo de um produto"""
    # Custos individuais
    comissao: float
    prep: float
    frete: float
    impostos: float
    ads: float
    
    # Custos totais
    custo_total_sem_ads: float
    custo_total_com_ads: float
    
    # Margens
    margem_sem_ads: float
    margem_com_ads: float
    
    # Lucros
    lucro_sem_ads: float
    lucro_com_ads: float
    
    # Viabilidade
    lucrativo: bool
    classificacao: str  # "EXCELENTE", "BOM", "MARGINAL", "PREJUÍZO"


class CalculadoraLucro:
    """
    Classe responsável por calcular a lucratividade de produtos
    Implementa as 7 fórmulas da planilha Excel
    """
    
    def __init__(self, config: Optional[Configuracoes] = None):
        self.config = config or Configuracoes()
    
    def calcular(
        self,
        custo_unitario: float,
        preco_venda: float
    ) -> ResultadoCalculo:
        """
        Calcula todos os valores de um produto
        
        Args:
            custo_unitario: Custo de compra do produto
            preco_venda: Preço de venda na Amazon
            
        Returns:
            ResultadoCalculo com todos os valores calculados
        """
        # Validações
        if custo_unitario <= 0:
            raise ValueError("Custo unitário deve ser maior que zero")
        if preco_venda <= custo_unitario:
            raise ValueError("Preço de venda deve ser maior que custo")
        
        # FÓRMULA 1: Comissão
        comissao = preco_venda * self.config.taxa_comissao
        
        # FÓRMULA 2: Prep (fixo)
        prep = self.config.custo_prep
        
        # FÓRMULA 3: Frete (fixo)
        frete = self.config.frete_fba
        
        # FÓRMULA 4: Impostos
        impostos = preco_venda * self.config.aliquota_imposto
        
        # FÓRMULA 6: ADS
        ads = preco_venda * self.config.tacos
        
        # Custos totais
        custo_total_sem_ads = (
            custo_unitario + comissao + prep + frete + impostos
        )
        custo_total_com_ads = custo_total_sem_ads + ads
        
        # FÓRMULA 5: Margem SEM ADS
        margem_sem_ads = max(
            0,
            (preco_venda - custo_total_sem_ads) / preco_venda
        )
        
        # FÓRMULA 7: Margem COM ADS (REAL)
        margem_com_ads = max(
            0,
            (preco_venda - custo_total_com_ads) / preco_venda
        )
        
        # Lucros
        lucro_sem_ads = preco_venda - custo_total_sem_ads
        lucro_com_ads = preco_venda - custo_total_com_ads
        
        # Classificação
        lucrativo = margem_com_ads > 0
        classificacao = self._classificar(margem_com_ads)
        
        return ResultadoCalculo(
            comissao=round(comissao, 2),
            prep=round(prep, 2),
            frete=round(frete, 2),
            impostos=round(impostos, 2),
            ads=round(ads, 2),
            custo_total_sem_ads=round(custo_total_sem_ads, 2),
            custo_total_com_ads=round(custo_total_com_ads, 2),
            margem_sem_ads=round(margem_sem_ads, 4),
            margem_com_ads=round(margem_com_ads, 4),
            lucro_sem_ads=round(lucro_sem_ads, 2),
            lucro_com_ads=round(lucro_com_ads, 2),
            lucrativo=lucrativo,
            classificacao=classificacao
        )
    
    def _classificar(self, margem: float) -> str:
        """Classifica o produto baseado na margem"""
        if margem >= 0.25:
            return "EXCELENTE"
        elif margem >= 0.15:
            return "BOM"
        elif margem >= 0.05:
            return "MARGINAL"
        else:
            return "PREJUÍZO"


# ============================================
# EXEMPLO DE USO
# ============================================

if __name__ == "__main__":
    # Criar calculadora
    calc = CalculadoraLucro()
    
    # Calcular produto (Tábua Inox)
    resultado = calc.calcular(
        custo_unitario=12.50,
        preco_venda=33.90
    )
    
    # Mostrar resultado
    print("=" * 60)
    print("ANÁLISE DE PRODUTO")
    print("=" * 60)
    print(f"\nCUSTO UNITÁRIO: R$ 12,50")
    print(f"PREÇO DE VENDA: R$ 33,90")
    print("\n" + "-" * 60)
    print("CUSTOS CALCULADOS:")
    print("-" * 60)
    print(f"Comissão Amazon (5%):  R$ {resultado.comissao:7.2f}")
    print(f"Prep (fixo):           R$ {resultado.prep:7.2f}")
    print(f"Frete FBA (fixo):      R$ {resultado.frete:7.2f}")
    print(f"Impostos (4%):         R$ {resultado.impostos:7.2f}")
    print(f"ADS (5%):              R$ {resultado.ads:7.2f}")
    print("-" * 60)
    print(f"TOTAL COM ADS:         R$ {resultado.custo_total_com_ads:7.2f}")
    print("\n" + "=" * 60)
    print("RESULTADO:")
    print("=" * 60)
    print(f"Lucro por unidade:     R$ {resultado.lucro_com_ads:7.2f}")
    print(f"Margem de lucro:       {resultado.margem_com_ads*100:7.2f}%")
    print(f"Classificação:         {resultado.classificacao}")
    print(f"Viável para venda:     {'✅ SIM' if resultado.lucrativo else '❌ NÃO'}")
    print("=" * 60)
```

---

### 3️⃣ API BACKEND (FastAPI)

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, validator
from typing import Optional

app = FastAPI(title="Mapeador de Preços API")

# ============================================
# MODELOS DE DADOS (DTOs)
# ============================================

class ProdutoInput(BaseModel):
    """Dados de entrada para cadastrar produto"""
    nome: str = Field(..., min_length=3, max_length=255)
    fornecedor_id: int
    custo_unitario: float = Field(..., gt=0)
    preco_venda: float = Field(..., gt=0)
    
    @validator('preco_venda')
    def preco_maior_que_custo(cls, v, values):
        if 'custo_unitario' in values and v <= values['custo_unitario']:
            raise ValueError('Preço de venda deve ser maior que custo')
        return v


class ProdutoOutput(BaseModel):
    """Dados de saída com cálculos"""
    id: int
    nome: str
    fornecedor_id: int
    custo_unitario: float
    preco_venda: float
    
    # Calculados
    comissao: float
    prep: float
    frete: float
    impostos: float
    ads: float
    margem_com_ads: float
    lucro_com_ads: float
    lucrativo: bool
    classificacao: str


# ============================================
# ENDPOINTS
# ============================================

@app.post("/api/produtos", response_model=ProdutoOutput)
async def criar_produto(produto: ProdutoInput):
    """
    Cria um novo produto e calcula automaticamente
    a lucratividade
    """
    # 1. Buscar configurações
    config = Configuracoes()  # Buscar do banco
    
    # 2. Calcular lucro
    calc = CalculadoraLucro(config)
    resultado = calc.calcular(
        custo_unitario=produto.custo_unitario,
        preco_venda=produto.preco_venda
    )
    
    # 3. Salvar no banco de dados
    produto_db = {
        'nome': produto.nome,
        'fornecedor_id': produto.fornecedor_id,
        'custo_unitario': produto.custo_unitario,
        'preco_venda': produto.preco_venda,
        'margem_com_ads': resultado.margem_com_ads,
        'lucro_com_ads': resultado.lucro_com_ads,
        'lucrativo': resultado.lucrativo
    }
    # produto_id = db.insert(produto_db)
    
    # 4. Retornar resposta com todos os cálculos
    return ProdutoOutput(
        id=1,  # produto_id do banco
        nome=produto.nome,
        fornecedor_id=produto.fornecedor_id,
        custo_unitario=produto.custo_unitario,
        preco_venda=produto.preco_venda,
        comissao=resultado.comissao,
        prep=resultado.prep,
        frete=resultado.frete,
        impostos=resultado.impostos,
        ads=resultado.ads,
        margem_com_ads=resultado.margem_com_ads,
        lucro_com_ads=resultado.lucro_com_ads,
        lucrativo=resultado.lucrativo,
        classificacao=resultado.classificacao
    )


@app.get("/api/produtos/{produto_id}", response_model=ProdutoOutput)
async def obter_produto(produto_id: int):
    """Busca um produto e recalcula os valores"""
    # Buscar produto do banco
    # produto_db = db.get(produto_id)
    
    # Recalcular (caso configurações tenham mudado)
    config = Configuracoes()
    calc = CalculadoraLucro(config)
    resultado = calc.calcular(
        custo_unitario=12.50,  # produto_db.custo
        preco_venda=33.90      # produto_db.preco
    )
    
    return ProdutoOutput(...)


@app.get("/api/produtos/simular")
async def simular_produto(
    custo: float,
    preco: float
):
    """
    Simula um produto sem salvar no banco
    Útil para testar antes de cadastrar
    """
    calc = CalculadoraLucro()
    resultado = calc.calcular(custo, preco)
    
    return {
        "custo_unitario": custo,
        "preco_venda": preco,
        "lucro": resultado.lucro_com_ads,
        "margem": resultado.margem_com_ads,
        "lucrativo": resultado.lucrativo,
        "classificacao": resultado.classificacao,
        "detalhes": {
            "comissao": resultado.comissao,
            "prep": resultado.prep,
            "frete": resultado.frete,
            "impostos": resultado.impostos,
            "ads": resultado.ads
        }
    }
```

---

### 4️⃣ FRONTEND (React)

```typescript
// ============================================
// Hook customizado para cálculo em tempo real
// ============================================

import { useState, useEffect } from 'react';

interface Calculo {
  comissao: number;
  prep: number;
  frete: number;
  impostos: number;
  ads: number;
  lucro: number;
  margem: number;
  lucrativo: boolean;
  classificacao: string;
}

function useCalculoProduto(custo: number, preco: number): Calculo | null {
  const [calculo, setCalculo] = useState<Calculo | null>(null);
  
  useEffect(() => {
    if (custo > 0 && preco > custo) {
      // Configurações (buscar do backend em produção)
      const config = {
        tacos: 0.05,
        taxaComissao: 0.05,
        custoPrep: 1.30,
        freteFba: 6.00,
        aliquotaImposto: 0.04
      };
      
      // Calcular
      const comissao = preco * config.taxaComissao;
      const prep = config.custoPrep;
      const frete = config.freteFba;
      const impostos = preco * config.aliquotaImposto;
      const ads = preco * config.tacos;
      
      const custoTotal = custo + comissao + prep + frete + impostos + ads;
      const lucro = preco - custoTotal;
      const margem = lucro / preco;
      
      const lucrativo = margem > 0;
      const classificacao = 
        margem >= 0.25 ? 'EXCELENTE' :
        margem >= 0.15 ? 'BOM' :
        margem >= 0.05 ? 'MARGINAL' : 'PREJUÍZO';
      
      setCalculo({
        comissao,
        prep,
        frete,
        impostos,
        ads,
        lucro,
        margem,
        lucrativo,
        classificacao
      });
    } else {
      setCalculo(null);
    }
  }, [custo, preco]);
  
  return calculo;
}


// ============================================
// Componente de Cadastro
// ============================================

function CadastroProduto() {
  const [nome, setNome] = useState('');
  const [fornecedor, setFornecedor] = useState('');
  const [custo, setCusto] = useState(0);
  const [preco, setPreco] = useState(0);
  
  // Cálculo automático em tempo real
  const calculo = useCalculoProduto(custo, preco);
  
  const handleSubmit = async () => {
    const response = await fetch('/api/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome,
        fornecedor_id: fornecedor,
        custo_unitario: custo,
        preco_venda: preco
      })
    });
    
    if (response.ok) {
      alert('Produto cadastrado com sucesso!');
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Cadastrar Produto</h2>
      
      {/* Formulário */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Nome do produto"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full p-3 border rounded"
        />
        
        <select
          value={fornecedor}
          onChange={(e) => setFornecedor(e.target.value)}
          className="w-full p-3 border rounded"
        >
          <option value="">Selecione o fornecedor</option>
          <option value="1">Utimix</option>
          <option value="2">Zein</option>
        </select>
        
        <input
          type="number"
          placeholder="Custo unitário (R$)"
          value={custo || ''}
          onChange={(e) => setCusto(parseFloat(e.target.value))}
          className="w-full p-3 border rounded"
        />
        
        <input
          type="number"
          placeholder="Preço de venda (R$)"
          value={preco || ''}
          onChange={(e) => setPreco(parseFloat(e.target.value))}
          className="w-full p-3 border rounded"
        />
      </div>
      
      {/* Prévia do Cálculo - Aparece automaticamente */}
      {calculo && (
        <div className={`mt-6 p-4 rounded ${
          calculo.lucrativo ? 'bg-green-50 border-2 border-green-300' : 'bg-red-50 border-2 border-red-300'
        }`}>
          <h3 className="font-bold mb-3">💡 Prévia do Cálculo</h3>
          
          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
            <div>Comissão:</div>
            <div>R$ {calculo.comissao.toFixed(2)}</div>
            
            <div>Prep:</div>
            <div>R$ {calculo.prep.toFixed(2)}</div>
            
            <div>Frete:</div>
            <div>R$ {calculo.frete.toFixed(2)}</div>
            
            <div>Impostos:</div>
            <div>R$ {calculo.impostos.toFixed(2)}</div>
            
            <div>ADS:</div>
            <div>R$ {calculo.ads.toFixed(2)}</div>
          </div>
          
          <hr className="my-3" />
          
          <div className="space-y-2">
            <div className="flex justify-between font-bold">
              <span>Lucro:</span>
              <span>R$ {calculo.lucro.toFixed(2)}/unidade</span>
            </div>
            
            <div className="flex justify-between font-bold">
              <span>Margem:</span>
              <span>{(calculo.margem * 100).toFixed(2)}%</span>
            </div>
            
            <div className="flex justify-between text-lg font-bold">
              <span>Status:</span>
              <span className={calculo.lucrativo ? 'text-green-600' : 'text-red-600'}>
                {calculo.lucrativo ? '✅' : '❌'} {calculo.classificacao}
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Botões */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 border rounded hover:bg-gray-50"
        >
          Cancelar
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={!calculo?.lucrativo}
          className={`px-6 py-3 rounded font-bold ${
            calculo?.lucrativo
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Salvar Produto
        </button>
      </div>
    </div>
  );
}
```

---

## 🎯 RESUMO: COMO FUNCIONA NO SISTEMA

### ✅ Usuário preenche apenas 4 campos:
1. Nome do produto
2. Fornecedor
3. Custo unitário
4. Preço de venda

### ⚡ Sistema calcula TUDO automaticamente:
- Comissão (5% do preço)
- Prep (R$ 1,30 fixo)
- Frete (R$ 6,00 fixo)
- Impostos (4% do preço)
- ADS (5% do preço)
- Margem de lucro
- Lucro por unidade
- Se é lucrativo ou não

### 🎨 Interface mostra em tempo real:
- Cálculo atualiza conforme você digita
- Verde se for lucrativo ✅
- Vermelho se não for ❌
- Classificação: EXCELENTE, BOM, MARGINAL, PREJUÍZO

### 💾 Sistema salva no banco:
- Todos os dados do produto
- Todos os cálculos (para relatórios)
- Pode recalcular se configurações mudarem

---

## 🎯 DIFERENÇA CHAVE

### ❌ Planilha Excel:
- 554 fórmulas espalhadas
- Usuário precisa copiar fórmulas
- Fácil quebrar algo
- Lento para muitos produtos

### ✅ Sistema Web:
- 1 classe Python com 7 fórmulas
- Cálculo automático sempre
- Impossível quebrar
- Instantâneo para milhares de produtos

---

**Agora entendeu melhor como seria no sistema real? 🚀**
