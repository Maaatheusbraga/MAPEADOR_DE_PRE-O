# 🎯 SISTEMA MAPEADOR DE PREÇOS - ESPECIFICAÇÃO FUNCIONAL

> Replicando TODAS as funcionalidades da planilha em formato de sistema web

---

## 📋 OBJETIVO

Criar um sistema web que faça **EXATAMENTE** o que a planilha faz, mas de forma:
- ✅ Mais rápida
- ✅ Mais fácil de usar
- ✅ Sem risco de erros
- ✅ Com múltiplos usuários
- ✅ Acessível de qualquer lugar

---

## 🗂️ FUNCIONALIDADES POR ABA DA PLANILHA

### ABA 1: MINERAÇÃO (Principal) 📊

**O que a planilha faz:**
- Lista produtos com seus custos e preços
- Calcula automaticamente comissão, prep, frete, impostos, ADS
- Mostra margem de lucro com e sem ADS
- Indica se produto é lucrativo ou não

**O que o sistema vai fazer:**

#### 1.1 Tela: Lista de Produtos
```
┌─────────────────────────────────────────────────────────────────┐
│  MINERAÇÃO - Análise de Produtos                          [+ Novo]│
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🔍 Buscar: [____________] 📊 Ordenar: [▼Margem] 🏪 Filtro: [▼] │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ ✅ Tábua Inox | Utimix                                     ││
│  │    Custo: R$ 12,50  →  Venda: R$ 33,90                    ││
│  │    Margem: 27,54%  |  Lucro: R$ 9,34/un  |  LUCRATIVO     ││
│  │    [👁️ Ver Detalhes] [✏️ Editar] [📊 Simular] [🗑️ Excluir] ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ ✅ Produto B | Fornecedor X                                ││
│  │    Custo: R$ 18,00  →  Venda: R$ 45,00                    ││
│  │    Margem: 23,12%  |  Lucro: R$ 10,40/un  |  LUCRATIVO    ││
│  │    [👁️ Ver Detalhes] [✏️ Editar] [📊 Simular] [🗑️ Excluir] ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ ❌ Caneca XYZ | Fornecedor Y                               ││
│  │    Custo: R$ 18,00  →  Venda: R$ 25,00                    ││
│  │    Margem: -15,2%  |  Prejuízo: R$ 3,80/un  |  NÃO VENDER ││
│  │    [👁️ Ver Detalhes] [✏️ Editar] [📊 Simular] [🗑️ Excluir] ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
│  Mostrando 3 de 52 produtos                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Funcionalidades:**
- ✅ Listar todos os produtos
- ✅ Buscar por nome
- ✅ Filtrar por fornecedor
- ✅ Ordenar por margem, lucro, nome
- ✅ Indicador visual (✅ verde / ❌ vermelho)
- ✅ Botões de ação rápida

---

#### 1.2 Tela: Novo Produto / Editar Produto
```
┌─────────────────────────────────────────────────────────────────┐
│  CADASTRAR NOVO PRODUTO                              [X Fechar]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  DADOS DO PRODUTO                                                │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ Nome do Produto *                                          ││
│  │ [Tábua Inox________________________________________]       ││
│  │                                                            ││
│  │ Fornecedor *                                               ││
│  │ [▼ Utimix_________________________________________]        ││
│  │                                                            ││
│  │ ┌─────────────────────┐  ┌─────────────────────┐         ││
│  │ │ Custo Unitário (R$)*│  │ Preço de Venda (R$)*│         ││
│  │ │ [12,50__________]   │  │ [33,90__________]   │         ││
│  │ └─────────────────────┘  └─────────────────────┘         ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
│  CÁLCULO AUTOMÁTICO (atualiza conforme digita)                  │
│  ┌────────────────────────────────────────────────────────────┐│
│  │                                                            ││
│  │  CUSTOS CALCULADOS                                         ││
│  │  ├─ Comissão Amazon (5%):      R$ 1,70                    ││
│  │  ├─ Prep (fixo):                R$ 1,30                    ││
│  │  ├─ Frete FBA (fixo):           R$ 6,00                    ││
│  │  ├─ Impostos (4%):              R$ 1,36                    ││
│  │  └─ ADS - TACOS (5%):           R$ 1,70                    ││
│  │                                                            ││
│  │  CUSTO TOTAL:                   R$ 24,56                    ││
│  │  ══════════════════════════════════════                    ││
│  │                                                            ││
│  │  RESULTADO                                                 ││
│  │  ┌─────────────────────────────────────────────────────┐ ││
│  │  │  💰 Lucro por unidade:    R$ 9,34                  │ ││
│  │  │  📊 Margem de lucro:      27,54%                   │ ││
│  │  │  ✅ Status:               LUCRATIVO                │ ││
│  │  │  🏆 Classificação:        EXCELENTE                │ ││
│  │  └─────────────────────────────────────────────────────┘ ││
│  │                                                            ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
│  PROJEÇÕES DE VENDA                                              │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ Se vender 50 unidades/mês:    Lucro de R$ 467,00          ││
│  │ Se vender 100 unidades/mês:   Lucro de R$ 934,00          ││
│  │ Se vender 200 unidades/mês:   Lucro de R$ 1.868,00        ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
│  [Cancelar]                   [💾 Salvar Produto]               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Funcionalidades:**
- ✅ Formulário com validação em tempo real
- ✅ Cálculo automático enquanto digita
- ✅ Preview visual do resultado
- ✅ Projeções de venda
- ✅ Não permite salvar se prejuízo (com confirmação)

---

#### 1.3 Tela: Detalhes do Produto
```
┌─────────────────────────────────────────────────────────────────┐
│  DETALHES DO PRODUTO: Tábua Inox                    [X Fechar]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  INFORMAÇÕES BÁSICAS                                             │
│  ├─ Produto:        Tábua Inox                                  │
│  ├─ Fornecedor:     Utimix                                      │
│  ├─ Custo:          R$ 12,50                                    │
│  ├─ Preço Venda:    R$ 33,90                                    │
│  └─ Status:         ✅ LUCRATIVO                                │
│                                                                  │
│  BREAKDOWN DE CUSTOS                                             │
│  ┌────────────────────────────────────────────────────────────┐│
│  │                                                            ││
│  │  Preço de Venda                           R$ 33,90 (100%) ││
│  │  ├─ Custo Unitário         R$ 12,50      (36,87%)        ││
│  │  ├─ Comissão Amazon (5%)   R$  1,70      ( 5,01%)        ││
│  │  ├─ Prep                   R$  1,30      ( 3,83%)        ││
│  │  ├─ Frete FBA              R$  6,00      (17,70%)        ││
│  │  ├─ Impostos (4%)          R$  1,36      ( 4,01%)        ││
│  │  └─ ADS - TACOS (5%)       R$  1,70      ( 5,01%)        ││
│  │                             ─────────     ───────          ││
│  │  = LUCRO                    R$  9,34      (27,54%) ✅     ││
│  │                                                            ││
│  │  [████████████████████░░░░░░░░░] 73% custos / 27% lucro  ││
│  │                                                            ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
│  SIMULAÇÕES                                                      │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ E se...                                                    ││
│  │                                                            ││
│  │ 🔼 Aumentar preço para R$ 39,90:                          ││
│  │    Margem: 36,34%  |  Lucro: R$ 14,50  |  +R$ 5,16       ││
│  │                                                            ││
│  │ 🔽 Reduzir custo para R$ 10,00:                           ││
│  │    Margem: 35,90%  |  Lucro: R$ 12,17  |  +R$ 2,83       ││
│  │                                                            ││
│  │ 📉 Reduzir TACOS para 3%:                                 ││
│  │    Margem: 29,56%  |  Lucro: R$ 10,02  |  +R$ 0,68       ││
│  │                                                            ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
│  [✏️ Editar]  [📊 Ver Relatório]  [🗑️ Excluir]  [Fechar]        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Funcionalidades:**
- ✅ Visão completa do produto
- ✅ Breakdown visual de custos (gráfico de barras)
- ✅ Simulações "E se..." automáticas
- ✅ Percentuais de cada custo

---

#### 1.4 Configurações (Premissas)
```
┌─────────────────────────────────────────────────────────────────┐
│  CONFIGURAÇÕES - Premissas de Cálculo               [X Fechar]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ⚙️ PREMISSAS ATUAIS                                             │
│  (Alterar estas premissas afeta TODOS os cálculos)              │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐│
│  │                                                            ││
│  │  TACOS - Taxa de Investimento em ADS                      ││
│  │  ┌────────────────┐                                       ││
│  │  │ [5__________] % │  Padrão: 5%                         ││
│  │  └────────────────┘                                       ││
│  │  💡 Percentual do preço investido em anúncios             ││
│  │                                                            ││
│  │  ────────────────────────────────────────────────────────  ││
│  │                                                            ││
│  │  Custo de Prep (Preparação)                               ││
│  │  ┌────────────────┐                                       ││
│  │  │ R$ [1,30____]  │  Padrão: R$ 1,30                     ││
│  │  └────────────────┘                                       ││
│  │  💡 Custo fixo de preparação por unidade                  ││
│  │                                                            ││
│  │  ────────────────────────────────────────────────────────  ││
│  │                                                            ││
│  │  Frete FBA (Fulfillment by Amazon)                        ││
│  │  ┌────────────────┐                                       ││
│  │  │ R$ [6,00____]  │  Padrão: R$ 6,00                     ││
│  │  └────────────────┘                                       ││
│  │  💡 Custo fixo de frete por unidade                       ││
│  │  ⚠️  Tarifa 0 nos primeiros 30 dias!                      ││
│  │                                                            ││
│  │  ────────────────────────────────────────────────────────  ││
│  │                                                            ││
│  │  Alíquota de Imposto                                      ││
│  │  ┌────────────────┐                                       ││
│  │  │ [4__________] % │  Padrão: 4%                         ││
│  │  └────────────────┘                                       ││
│  │  💡 Percentual de impostos sobre venda                    ││
│  │                                                            ││
│  │  ────────────────────────────────────────────────────────  ││
│  │                                                            ││
│  │  Taxa de Comissão Amazon                                  ││
│  │  ┌────────────────┐                                       ││
│  │  │ [5__________] % │  Padrão: 5%                         ││
│  │  └────────────────┘                                       ││
│  │  💡 Comissão cobrada pela Amazon                          ││
│  │  ⚠️  Isenção de até 40k nos primeiros 3 meses (CNPJ SP)  ││
│  │                                                            ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ⚠️  Ao salvar, TODOS os produtos serão recalculados!           │
│                                                                  │
│  [Cancelar]  [Restaurar Padrões]  [💾 Salvar Configurações]     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Funcionalidades:**
- ✅ Editar todas as premissas
- ✅ Explicação de cada campo
- ✅ Avisos sobre isenções da Amazon
- ✅ Restaurar valores padrão
- ✅ Recalcula todos os produtos ao salvar

---

### ABA 2: DRE (Demonstrativo de Resultados) 📈

**O que a planilha faz:**
- Projeção financeira mensal (24 meses)
- Faturamento previsto
- Custos por categoria
- Resultado operacional

**O que o sistema vai fazer:**

#### 2.1 Tela: DRE - Projeção Financeira
```
┌─────────────────────────────────────────────────────────────────┐
│  DRE - Demonstrativo de Resultados                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📅 Período: [Outubro 2026] até [Setembro 2028]  [🔄 Atualizar] │
│                                                                  │
│  RESUMO ANUAL                                                    │
│  ┌────────────────────────────────────────────────────────────┐│
│  │  Ano 1 (12 meses):                                         ││
│  │  Faturamento: R$ 0,00  |  Custos: R$ 0,00  |  Lucro: R$ 0 ││
│  │                                                            ││
│  │  Ano 2 (12 meses):                                         ││
│  │  Faturamento: R$ 0,00  |  Custos: R$ 0,00  |  Lucro: R$ 0 ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
│  PROJEÇÃO MENSAL                                                 │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ Mês        │ Faturamento │ Custos    │ Despesas │ Lucro   ││
│  ├────────────┼─────────────┼───────────┼──────────┼─────────┤│
│  │ Out/2026   │ R$ 0,00     │ R$ 0,00   │ R$ 0,00  │ R$ 0,00 ││
│  │ Nov/2026   │ R$ 0,00     │ R$ 0,00   │ R$ 0,00  │ R$ 0,00 ││
│  │ Dez/2026   │ R$ 0,00     │ R$ 0,00   │ R$ 0,00  │ R$ 0,00 ││
│  │ ...        │ ...         │ ...       │ ...      │ ...     ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
│  [+ Adicionar Receita]  [+ Adicionar Despesa]  [📊 Gráfico]     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Funcionalidades:**
- ✅ Projeção de 24 meses
- ✅ Agrupamento por trimestre
- ✅ Adicionar receitas e despesas previstas
- ✅ Gráfico de evolução
- ✅ Exportar para Excel

---

### ABA 3: FLUXO DE CAIXA 💰

**O que a planilha faz:**
- Controle de saldo atual
- Entradas e saídas
- Passivos (impostos, fornecedores, etc.)

**O que o sistema vai fazer:**

#### 3.1 Tela: Fluxo de Caixa
```
┌─────────────────────────────────────────────────────────────────┐
│  FLUXO DE CAIXA                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  SALDO ATUAL                                                     │
│  ┌────────────────────────────────────────────────────────────┐│
│  │  💰 Caixa:        R$ 0,00                                  ││
│  │  🏦 Banco:        R$ 0,00                                  ││
│  │  ═══════════════════════════                               ││
│  │  💵 TOTAL:        R$ 0,00                                  ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
│  MOVIMENTAÇÕES                                                   │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ Data       │ Tipo      │ Descrição       │ Valor          ││
│  ├────────────┼───────────┼─────────────────┼────────────────┤│
│  │ 16/09/2026 │ 🟢 Entrada│ Venda produtos  │ + R$ 1.000,00  ││
│  │ 15/09/2026 │ 🔴 Saída  │ Pgto Fornecedor │ - R$ 500,00    ││
│  │ 14/09/2026 │ 🔴 Saída  │ Impostos        │ - R$ 100,00    ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
│  PASSIVOS (Contas a Pagar)                                       │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ Vencimento │ Descrição           │ Valor     │ Situação   ││
│  ├────────────┼─────────────────────┼───────────┼────────────┤│
│  │ 20/09/2026 │ Fornecedor Utimix   │ R$ 500,00 │ ⚠️ Pendente││
│  │ 25/09/2026 │ Imposto DAS         │ R$ 150,00 │ ⚠️ Pendente││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
│  [+ Nova Entrada]  [+ Nova Saída]  [+ Novo Passivo]  [📊 Gráfico]│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Funcionalidades:**
- ✅ Controle de saldo
- ✅ Registro de entradas/saídas
- ✅ Gestão de passivos
- ✅ Alertas de vencimento
- ✅ Gráfico de fluxo

---

### ABA 4: LISTA DE FORNECEDORES 🏪

**O que a planilha faz:**
- Lista de fornecedores com contatos
- Marca fornecedores prioritários

**O que o sistema vai fazer:**

#### 4.1 Tela: Fornecedores
```
┌─────────────────────────────────────────────────────────────────┐
│  FORNECEDORES                                          [+ Novo]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🔍 Buscar: [____________]  ⭐ Mostrar apenas prioritários: [☐]  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ ⭐ Utimix                                                  ││
│  │    🌐 https://www.utimix.com/                             ││
│  │    📞 (11) 95300-7505                                     ││
│  │    📦 3 produtos cadastrados                              ││
│  │    [✏️ Editar] [🗑️ Excluir] [📦 Ver Produtos]             ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ ⭐ Zein                                                    ││
│  │    🌐 https://www.zein.com.br/                            ││
│  │    📞 (11) 94725-1366 - João                              ││
│  │    📦 1 produto cadastrado                                ││
│  │    [✏️ Editar] [🗑️ Excluir] [📦 Ver Produtos]             ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐│
│  │   Top Rio                                                  ││
│  │    🌐 https://www.instagram.com/toprio_importadora_ofc/   ││
│  │    📞 (21) 97038-5924 - Giulia / (11) 98637-9492 - Fernanda││
│  │    📦 0 produtos cadastrados                              ││
│  │    💡 Começar por este fornecedor                         ││
│  │    [✏️ Editar] [🗑️ Excluir] [📦 Ver Produtos]             ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
│  Mostrando 3 de 8 fornecedores                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Funcionalidades:**
- ✅ CRUD completo de fornecedores
- ✅ Marcar como prioritário (⭐)
- ✅ Ver produtos do fornecedor
- ✅ Contador de produtos
- ✅ Links clicáveis

---

## 🎯 DASHBOARD PRINCIPAL

```
┌─────────────────────────────────────────────────────────────────┐
│  🏠 DASHBOARD                                     Olá, Matheus!  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📊 RESUMO GERAL                                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────┐│
│  │     52       │ │      45      │ │    27,5%     │ │ R$ 8,50 ││
│  │   Produtos   │ │  Lucrativos  │ │ Margem Média │ │Lucro Méd││
│  │              │ │    (86,5%)   │ │              │ │         ││
│  └──────────────┘ └──────────────┘ └──────────────┘ └─────────┘│
│                                                                  │
│  🏆 TOP 5 PRODUTOS MAIS LUCRATIVOS                               │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ 1. Tábua Inox      - 27,54%  - R$ 9,34  - Utimix         ││
│  │ 2. Produto B       - 25,30%  - R$ 7,80  - Fornecedor X   ││
│  │ 3. Produto C       - 23,10%  - R$ 6,50  - Zein           ││
│  │ 4. Produto D       - 21,50%  - R$ 8,20  - Top Rio        ││
│  │ 5. Produto E       - 20,80%  - R$ 5,90  - Utimix         ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ⚠️  7 PRODUTOS COM PREJUÍZO                                     │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ • Caneca XYZ       - Margem: -15,2%  - Prejuízo: R$ 3,80 ││
│  │ • Produto Y        - Margem: -8,5%   - Prejuízo: R$ 2,10 ││
│  │ [Ver todos]                                                ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
│  📈 GRÁFICO DE MARGEM POR PRODUTO                                │
│  [Gráfico de barras aqui]                                       │
│                                                                  │
│  AÇÕES RÁPIDAS                                                   │
│  [+ Novo Produto]  [📊 Ver DRE]  [💰 Fluxo de Caixa]  [⚙️ Config]│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Funcionalidades:**
- ✅ Visão geral de métricas
- ✅ Top produtos
- ✅ Alertas de produtos ruins
- ✅ Gráfico visual
- ✅ Ações rápidas

---

## 🗄️ ESTRUTURA DE BANCO DE DADOS

### Tabela: configuracoes
```sql
CREATE TABLE configuracoes (
    id SERIAL PRIMARY KEY,
    tacos DECIMAL(5,4) DEFAULT 0.05,
    taxa_comissao DECIMAL(5,4) DEFAULT 0.05,
    custo_prep DECIMAL(10,2) DEFAULT 1.30,
    frete_fba DECIMAL(10,2) DEFAULT 6.00,
    aliquota_imposto DECIMAL(5,4) DEFAULT 0.04,
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tabela: fornecedores
```sql
CREATE TABLE fornecedores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE,
    site_instagram VARCHAR(500),
    telefone VARCHAR(100),
    observacoes TEXT,
    prioritario BOOLEAN DEFAULT FALSE,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Tabela: produtos
```sql
CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    fornecedor_id INTEGER REFERENCES fornecedores(id),
    custo_unitario DECIMAL(10,2) NOT NULL,
    preco_venda DECIMAL(10,2) NOT NULL,
    
    -- Campos calculados (salvos para performance)
    comissao DECIMAL(10,2),
    prep DECIMAL(10,2),
    frete DECIMAL(10,2),
    impostos DECIMAL(10,2),
    ads DECIMAL(10,2),
    margem_com_ads DECIMAL(5,4),
    lucro_com_ads DECIMAL(10,2),
    lucrativo BOOLEAN,
    classificacao VARCHAR(20),
    
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tabela: movimentacoes_caixa
```sql
CREATE TABLE movimentacoes_caixa (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(20) NOT NULL, -- 'ENTRADA' ou 'SAIDA'
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Tabela: passivos
```sql
CREATE TABLE passivos (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_vencimento DATE NOT NULL,
    pago BOOLEAN DEFAULT FALSE,
    data_pagamento DATE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 📱 FLUXO COMPLETO DO USUÁRIO

### Cenário: Cadastrar e analisar novo produto

1. **Login** → Dashboard
2. **Clica** "Novo Produto"
3. **Preenche**: Nome, Fornecedor, Custo, Preço
4. **Sistema calcula** automaticamente em tempo real
5. **Usuário vê**: Margem, Lucro, Se é viável
6. **Clica** "Salvar"
7. **Produto aparece** na lista de Mineração
8. **Sistema atualiza** métricas do Dashboard

### Tempo estimado: **30 segundos** ⚡

---

## 🔐 FUNCIONALIDADES EXTRAS

### Segurança
- ✅ Login/Logout
- ✅ Senha criptografada
- ✅ Sessão segura

### Exportação
- ✅ Exportar lista para Excel
- ✅ Exportar DRE para PDF
- ✅ Exportar relatório de produto

### Notificações
- ✅ Passivo próximo do vencimento
- ✅ Produto com margem negativa
- ✅ Configurações alteradas

### Histórico
- ✅ Log de alterações
- ✅ Quem alterou o quê e quando
- ✅ Comparar versões anteriores

---

## ✅ CHECKLIST DE FUNCIONALIDADES

### Mineração (ABA 1)
- [ ] Listar produtos
- [ ] Criar produto
- [ ] Editar produto
- [ ] Excluir produto
- [ ] Buscar/Filtrar
- [ ] Ordenar
- [ ] Ver detalhes
- [ ] Simulador de cenários
- [ ] Configurações/Premissas

### DRE (ABA 2)
- [ ] Projeção mensal
- [ ] Adicionar receitas
- [ ] Adicionar despesas
- [ ] Gráfico de evolução
- [ ] Exportar

### Fluxo de Caixa (ABA 3)
- [ ] Saldo atual
- [ ] Registrar entrada/saída
- [ ] Gestão de passivos
- [ ] Alertas de vencimento
- [ ] Gráfico

### Fornecedores (ABA 4)
- [ ] Listar fornecedores
- [ ] Criar fornecedor
- [ ] Editar fornecedor
- [ ] Excluir fornecedor
- [ ] Marcar prioritário
- [ ] Ver produtos do fornecedor

### Dashboard
- [ ] Métricas gerais
- [ ] Top produtos
- [ ] Alertas
- [ ] Gráficos
- [ ] Ações rápidas

---

**Agora sim! Um sistema que faz EXATAMENTE o que a planilha faz! 🎯**

O que achou? Está de acordo com o que você precisa?
