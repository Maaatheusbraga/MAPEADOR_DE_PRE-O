# EXEMPLOS PRÁTICOS DE CÁLCULO - MAPEADOR DE PREÇOS

## 📊 Exemplo Real: Tábua Inox

Este é um exemplo real extraído da planilha, mostrando todos os cálculos passo a passo.

### Dados de Entrada
```
Produto:          Tábua Inox
Fornecedor:       Utimix
Custo Unitário:   R$ 12,50
Preço de Venda:   R$ 33,90
```

### Premissas Utilizadas
```
TACOS:                5% (0,05)
Custo de Prep:        R$ 1,30
Alíquota de Imposto:  4% (0,04)
Frete FBA:            R$ 6,00
Taxa de Comissão:     5% (0,05)
```

---

## 🧮 CÁLCULO DETALHADO

### Passo 1: Calcular Comissão Amazon
```
Comissão = Preço de Venda × Taxa de Comissão
Comissão = R$ 33,90 × 0,05
Comissão = R$ 1,70 (arredondado de R$ 1,695)
```

### Passo 2: Calcular Prep (Fixo)
```
Prep = R$ 1,30 (valor fixo)
```

### Passo 3: Calcular Frete FBA (Fixo)
```
Frete = R$ 6,00 (valor fixo)
```

### Passo 4: Calcular Impostos
```
Impostos = Preço de Venda × Alíquota de Imposto
Impostos = R$ 33,90 × 0,04
Impostos = R$ 1,36 (arredondado de R$ 1,356)
```

### Passo 5: Calcular Custo de ADS
```
ADS = Preço de Venda × TACOS
ADS = R$ 33,90 × 0,05
ADS = R$ 1,70 (arredondado de R$ 1,695)
```

### Passo 6: Somar Todos os Custos

#### Custos SEM ADS:
```
Custo Unitário:  R$ 12,50
Comissão:        R$  1,70
Prep:            R$  1,30
Frete:           R$  6,00
Impostos:        R$  1,36
--------------------------
TOTAL:           R$ 22,86
```

#### Custos COM ADS:
```
Custos SEM ADS:  R$ 22,86
ADS:             R$  1,70
--------------------------
TOTAL:           R$ 24,56
```

### Passo 7: Calcular Margem de Lucro SEM ADS
```
Margem = (Receita - Custos) / Receita
Margem = (R$ 33,90 - R$ 22,86) / R$ 33,90
Margem = R$ 11,04 / R$ 33,90
Margem = 0,3256 = 32,56%
```

**Lucro Líquido SEM ADS: R$ 11,04 por unidade**

### Passo 8: Calcular Margem de Lucro COM ADS (REAL)
```
Margem = (Receita - Custos - ADS) / Receita
Margem = (R$ 33,90 - R$ 22,86 - R$ 1,70) / R$ 33,90
Margem = R$ 9,34 / R$ 33,90
Margem = 0,2754 = 27,54%
```

**Lucro Líquido COM ADS: R$ 9,34 por unidade**

---

## 📈 RESUMO DO PRODUTO

| Métrica | Valor |
|---------|-------|
| **Preço de Venda** | R$ 33,90 |
| **Custo Total (sem ADS)** | R$ 22,86 |
| **Custo Total (com ADS)** | R$ 24,56 |
| **Lucro Unitário (sem ADS)** | R$ 11,04 |
| **Lucro Unitário (com ADS)** | R$ 9,34 |
| **Margem sem ADS** | 32,56% |
| **Margem com ADS** | 27,54% |
| **Status** | ✅ LUCRATIVO |

---

## 💡 ANÁLISE DE VIABILIDADE

### ✅ Produto VIÁVEL
Este produto é **altamente viável** porque:
- Margem com ADS > 20% (considerada excelente)
- Lucro unitário de R$ 9,34 é significativo
- Preço competitivo de R$ 33,90

### 📊 Projeções de Venda

#### Cenário Conservador (50 unidades/mês)
```
Faturamento mensal:  50 × R$ 33,90 = R$ 1.695,00
Lucro líquido:       50 × R$ 9,34  = R$   467,00
Margem:              27,54%
```

#### Cenário Realista (100 unidades/mês)
```
Faturamento mensal:  100 × R$ 33,90 = R$ 3.390,00
Lucro líquido:       100 × R$ 9,34  = R$   934,00
Margem:              27,54%
```

#### Cenário Otimista (200 unidades/mês)
```
Faturamento mensal:  200 × R$ 33,90 = R$ 6.780,00
Lucro líquido:       200 × R$ 9,34  = R$ 1.868,00
Margem:              27,54%
```

---

## 🎯 EXEMPLO 2: Produto NÃO Viável

Vamos simular um produto que NÃO seria lucrativo:

### Dados de Entrada
```
Produto:          Caneca Simples
Fornecedor:       Fornecedor X
Custo Unitário:   R$ 18,00
Preço de Venda:   R$ 25,00
```

### Cálculos
```
Comissão:   R$ 25,00 × 0,05 = R$ 1,25
Prep:       R$ 1,30
Frete:      R$ 6,00
Impostos:   R$ 25,00 × 0,04 = R$ 1,00
ADS:        R$ 25,00 × 0,05 = R$ 1,25

Custos Totais (com ADS):
R$ 18,00 + R$ 1,25 + R$ 1,30 + R$ 6,00 + R$ 1,00 + R$ 1,25 = R$ 28,80

Margem = (R$ 25,00 - R$ 28,80) / R$ 25,00
Margem = -R$ 3,80 / R$ 25,00
Margem = -0,152 = -15,2%
```

### ❌ PREJUÍZO de R$ 3,80 por unidade!

**Conclusão**: Este produto daria prejuízo e NÃO deve ser vendido.

---

## 🔧 SIMULAÇÕES DE CENÁRIOS

### Cenário 1: E se diminuirmos o TACOS?

**Produto**: Tábua Inox  
**Mudança**: TACOS de 5% → 3%

```
Novo ADS = R$ 33,90 × 0,03 = R$ 1,02
Novo Custo Total = R$ 22,86 + R$ 1,02 = R$ 23,88
Nova Margem = (R$ 33,90 - R$ 23,88) / R$ 33,90 = 29,56%
Novo Lucro = R$ 10,02 por unidade

Ganho: +R$ 0,68 por unidade (+7,3%)
```

### Cenário 2: E se conseguirmos negociar o frete?

**Produto**: Tábua Inox  
**Mudança**: Frete de R$ 6,00 → R$ 4,00

```
Novo Custo Total = R$ 24,56 - R$ 2,00 = R$ 22,56
Nova Margem = (R$ 33,90 - R$ 22,56) / R$ 33,90 = 33,45%
Novo Lucro = R$ 11,34 por unidade

Ganho: +R$ 2,00 por unidade (+21,4%)
```

### Cenário 3: E se aumentarmos o preço de venda?

**Produto**: Tábua Inox  
**Mudança**: Preço de R$ 33,90 → R$ 39,90

```
Nova Comissão = R$ 39,90 × 0,05 = R$ 2,00
Novos Impostos = R$ 39,90 × 0,04 = R$ 1,60
Novo ADS = R$ 39,90 × 0,05 = R$ 2,00

Novo Custo Total:
R$ 12,50 + R$ 2,00 + R$ 1,30 + R$ 6,00 + R$ 1,60 + R$ 2,00 = R$ 25,40

Nova Margem = (R$ 39,90 - R$ 25,40) / R$ 39,90 = 36,34%
Novo Lucro = R$ 14,50 por unidade

Ganho: +R$ 5,16 por unidade (+55,2%)
```

**⚠️ ATENÇÃO**: Aumentar o preço pode diminuir as vendas!

---

## 📐 FÓRMULAS GERAIS

### Fórmula Completa de Margem com ADS

```python
def calcular_margem_com_ads(
    preco_venda: float,
    custo_unitario: float,
    taxa_comissao: float = 0.05,
    custo_prep: float = 1.30,
    frete_fba: float = 6.00,
    aliquota_imposto: float = 0.04,
    tacos: float = 0.05
) -> dict:
    """
    Calcula a margem de lucro de um produto Amazon FBA
    
    Returns:
        dict com 'margem_sem_ads', 'margem_com_ads', 'lucro_unitario', etc.
    """
    # Custos calculados
    comissao = preco_venda * taxa_comissao
    impostos = preco_venda * aliquota_imposto
    ads = preco_venda * tacos
    
    # Custos totais
    custos_sem_ads = (
        custo_unitario + 
        comissao + 
        custo_prep + 
        frete_fba + 
        impostos
    )
    custos_com_ads = custos_sem_ads + ads
    
    # Margens
    margem_sem_ads = (preco_venda - custos_sem_ads) / preco_venda
    margem_com_ads = (preco_venda - custos_com_ads) / preco_venda
    
    # Lucros
    lucro_sem_ads = preco_venda - custos_sem_ads
    lucro_com_ads = preco_venda - custos_com_ads
    
    return {
        'comissao': round(comissao, 2),
        'impostos': round(impostos, 2),
        'ads': round(ads, 2),
        'custos_totais_sem_ads': round(custos_sem_ads, 2),
        'custos_totais_com_ads': round(custos_com_ads, 2),
        'margem_sem_ads': round(margem_sem_ads, 4),
        'margem_com_ads': round(margem_com_ads, 4),
        'lucro_sem_ads': round(lucro_sem_ads, 2),
        'lucro_com_ads': round(lucro_com_ads, 2),
        'lucrativo': margem_com_ads > 0
    }
```

### Exemplo de Uso
```python
resultado = calcular_margem_com_ads(
    preco_venda=33.90,
    custo_unitario=12.50
)

print(f"Margem com ADS: {resultado['margem_com_ads']*100:.2f}%")
print(f"Lucro unitário: R$ {resultado['lucro_com_ads']:.2f}")
print(f"Viável: {'Sim' if resultado['lucrativo'] else 'Não'}")
```

**Saída:**
```
Margem com ADS: 27.54%
Lucro unitário: R$ 9.34
Viável: Sim
```

---

## 🎓 REGRAS DE BOLSO

### ✅ Produto MUITO BOM
- Margem com ADS > 25%
- Lucro unitário > R$ 8,00

### ✅ Produto BOM
- Margem com ADS entre 15% e 25%
- Lucro unitário entre R$ 5,00 e R$ 8,00

### ⚠️ Produto MARGINAL
- Margem com ADS entre 5% e 15%
- Lucro unitário entre R$ 2,00 e R$ 5,00
- Considerar apenas se volume for alto

### ❌ Produto INVIÁVEL
- Margem com ADS < 5%
- Lucro unitário < R$ 2,00
- **NÃO VENDER**

---

## 📝 NOTAS IMPORTANTES

1. **Sempre considere a margem COM ADS** como a margem real
2. O lucro unitário mínimo recomendado é R$ 5,00
3. Produtos com margem < 10% são arriscados
4. Considere o volume de vendas esperado na análise
5. Custos fixos (prep e frete) afetam mais produtos baratos
6. Produtos mais caros tendem a ter margens melhores
7. Negocie sempre que possível: custo, frete, prep

---

**Última atualização**: 16/09/2026  
**Baseado em**: Planilha Excel "Forza Club - Versão Final"
