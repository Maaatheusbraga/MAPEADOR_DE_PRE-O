# ESPECIFICAÇÃO DO SISTEMA - MAPEADOR DE PREÇOS AMAZON FBA

## 📋 ÍNDICE
1. [Visão Geral](#visao-geral)
2. [Análise da Planilha Atual](#analise-atual)
3. [Regras de Negócio](#regras-negocio)
4. [Funcionalidades Necessárias](#funcionalidades)
5. [Arquitetura Proposta](#arquitetura)
6. [Modelo de Dados](#modelo-dados)
7. [Roadmap de Desenvolvimento](#roadmap)

---

## 1. VISÃO GERAL <a name="visao-geral"></a>

### Objetivo do Sistema
Criar uma aplicação web para mapear e analisar a lucratividade de produtos para venda na Amazon FBA (Fulfillment by Amazon), substituindo a planilha Excel atual por um sistema automatizado, intuitivo e escalável.

### Problema Atual
- Planilha Excel manual com **554 fórmulas**
- Difícil de escalar com muitos produtos
- Risco de erros em fórmulas
- Sem histórico de mudanças
- Difícil colaboração entre usuários

### Solução Proposta
Sistema web moderno que:
- ✅ Calcula automaticamente a lucratividade de produtos
- ✅ Gerencia fornecedores e produtos
- ✅ Ajusta premissas/parâmetros facilmente
- ✅ Gera relatórios e análises
- ✅ Permite decisões rápidas sobre quais produtos vender

---

## 2. ANÁLISE DA PLANILHA ATUAL <a name="analise-atual"></a>

### Estrutura da Planilha

#### **ABA 1: Mineração** (Principal - 61 linhas, 14 colunas)
Esta é a aba principal onde os produtos são analisados.

**Premissas/Constantes:**
```
TACOS (Taxa de Ads):        5%
Custo de Prep:              R$ 1,30
Alíquota de Imposto:        4%
Frete FBA:                  R$ 6,00
Comissão:                   Variável (ver observações)
```

**Observações importantes da planilha:**
- Comissão: CNPJ em SP tem limite de 40k de isenção nos primeiros 3 meses
  - Após isso, renova por +2 meses com limite de até 20k se investir pelo menos 3,5% do faturamento em ads
- Frete FBA: Tarifa 0 nos primeiros 30 dias
  - Após isso é R$ 6,00 se no mês anterior investiu pelo menos 3,5% do faturamento em ads

**Estrutura da Tabela de Produtos:**

| Coluna | Nome | Tipo | Observação |
|--------|------|------|------------|
| B | Produto | Input | Nome do produto |
| C | Fornecedor | Input | Nome do fornecedor |
| D | Custo Unitário | Input | Custo de compra do produto |
| E | Preço de venda | Input | Preço de venda na Amazon |
| F | Comissão | Calculado | = Preço de venda × 5% |
| G | Prep | Calculado | = R$ 1,30 (fixo) |
| H | Frete | Calculado | = R$ 6,00 (fixo) |
| I | Impostos | Calculado | = Preço de venda × 4% |
| J | Margem de Lucro | Calculado | Margem SEM considerar ADS |
| K | Ads | Calculado | = Preço de venda × 5% (TACOS) |
| L | Margem pós ads | Calculado | Margem REAL considerando ADS |

#### **ABA 2: DRE** (53 linhas, 36 colunas)
Demonstrativo de Resultados do Exercício - projeção financeira mensal

**Estrutura:**
- Projeção de 24 meses (2 anos)
- Agrupado em trimestres (Q1, Q2, ..., Q8)
- Categorias: Faturamento, Custos, Despesas Operacionais

#### **ABA 3: Fluxo de Caixa** (53 linhas, 36 colunas)
Controle de entradas e saídas financeiras

**Estrutura:**
- Saldo Atual
- Fluxos de Caixa
- Passivos (Impostos, Fornecedores, Prep Center, Contabilidade)

#### **ABA 4: Lista de Fornecedores** (115 linhas, 14 colunas)
Cadastro de fornecedores

**Estrutura:**
- Nome do Fornecedor
- Site/Instagram
- Telefone/Contato
- Observações

**Fornecedores Cadastrados (Prioritários marcados em verde):**
1. ✅ Utimix
2. ✅ Zein
3. ✅ Top Rio
4. ✅ Destaq
5. ✅ WEI Import
6. ✅ Nipocenter
7. Imporiente
8. Keita
... e outros

---

## 3. REGRAS DE NEGÓCIO <a name="regras-negocio"></a>

### 3.1. Cálculo de Lucro por Produto

#### **Fórmula Margem SEM ADS:**
```
Margem de Lucro = (Receita - Custos Totais) / Receita

Onde:
Receita = Preço de Venda
Custos Totais = Custo Unitário + Comissão + Prep + Frete + Impostos

Comissão = Preço de Venda × 5%
Prep = R$ 1,30 (fixo)
Frete = R$ 6,00 (fixo)
Impostos = Preço de Venda × 4%
```

#### **Fórmula Margem COM ADS (Margem Real):**
```
Margem pós ADS = (Receita - Custos Totais - ADS) / Receita

Onde:
ADS = Preço de Venda × TACOS (5%)
```

### 3.2. Classificação de Produtos

Um produto é considerado **LUCRATIVO** quando:
- ✅ Margem pós ADS > 0%

Um produto é considerado **MUITO LUCRATIVO** quando:
- 🌟 Margem pós ADS > 20%

Um produto é considerado **PREJUÍZO** quando:
- ❌ Margem pós ADS < 0%

### 3.3. Premissas Configuráveis

O sistema deve permitir ajustar as seguintes premissas:

1. **TACOS (Taxa de Investimento em ADS)**
   - Padrão: 5%
   - Descrição: Percentual do preço de venda investido em anúncios

2. **Custo de Prep**
   - Padrão: R$ 1,30
   - Descrição: Custo fixo de preparação do produto

3. **Alíquota de Imposto**
   - Padrão: 4%
   - Descrição: Percentual de impostos sobre o preço de venda

4. **Frete FBA**
   - Padrão: R$ 6,00
   - Descrição: Custo fixo de frete Fulfillment by Amazon

5. **Taxa de Comissão Amazon**
   - Padrão: 5%
   - Descrição: Comissão cobrada pela Amazon
   - **IMPORTANTE**: Existem isenções nos primeiros meses (ver observações)

### 3.4. Regras Especiais da Amazon

#### **Isenção de Comissão:**
- CNPJ em SP: limite de 40k de isenção nos primeiros 3 meses
- Renovação: +2 meses com limite de 20k se investir ≥ 3,5% do faturamento em ads

#### **Isenção de Frete FBA:**
- Tarifa 0 nos primeiros 30 dias
- Após 30 dias: R$ 6,00 (mas isento se investir ≥ 3,5% do faturamento em ads no mês anterior)

### 3.5. Validações

- Custo Unitário deve ser > 0
- Preço de Venda deve ser > Custo Unitário
- Todas as taxas percentuais devem estar entre 0% e 100%
- Valores monetários não podem ser negativos

---

## 4. FUNCIONALIDADES NECESSÁRIAS <a name="funcionalidades"></a>

### 4.1. Módulo de Configurações
- [ ] Gerenciar Premissas (TACOS, Prep, Imposto, Frete, Comissão)
- [ ] Histórico de alterações de premissas
- [ ] Configurações de isenções da Amazon

### 4.2. Módulo de Fornecedores
- [ ] Cadastrar fornecedores
- [ ] Listar fornecedores
- [ ] Editar fornecedores
- [ ] Marcar fornecedores como prioritários
- [ ] Desativar/Arquivar fornecedores
- [ ] Buscar e filtrar fornecedores

### 4.3. Módulo de Produtos
- [ ] Cadastrar produtos
  - Nome
  - Fornecedor (seleção)
  - Custo Unitário
  - Preço de Venda sugerido
- [ ] Listar produtos com cálculos automáticos
- [ ] Editar produtos
- [ ] Arquivar produtos
- [ ] Buscar e filtrar produtos
- [ ] Ordenar por margem de lucro
- [ ] Indicadores visuais de lucratividade

### 4.4. Módulo de Análise (Mineração)
- [ ] Dashboard com métricas principais
  - Total de produtos cadastrados
  - Produtos lucrativos vs não lucrativos
  - Margem média
  - Melhor e pior produto
- [ ] Calculadora de cenários
  - Simular mudanças de preço
  - Simular mudanças de custo
  - Simular mudanças nas premissas
- [ ] Comparação entre produtos
- [ ] Gráficos de lucratividade

### 4.5. Módulo de Relatórios
- [ ] Relatório de produtos lucrativos
- [ ] Relatório de produtos por fornecedor
- [ ] Exportar para Excel/CSV
- [ ] Exportar para PDF

### 4.6. Módulo Futuro: DRE e Fluxo de Caixa
- [ ] Projeção financeira mensal
- [ ] Controle de fluxo de caixa
- [ ] Gestão de passivos

---

## 5. ARQUITETURA PROPOSTA <a name="arquitetura"></a>

### 5.1. Stack Tecnológica Recomendada

#### **Opção 1: Stack Python (Recomendado)**
```
Frontend:  React + TypeScript + Tailwind CSS
Backend:   Python FastAPI + SQLAlchemy
Database:  PostgreSQL (produção) / SQLite (desenvolvimento)
Deploy:    Docker + Render/Railway/Heroku
```

#### **Opção 2: Stack JavaScript Full**
```
Frontend:  React + TypeScript + Tailwind CSS
Backend:   Node.js + Express + Prisma
Database:  PostgreSQL
Deploy:    Vercel (frontend) + Railway (backend)
```

### 5.2. Arquitetura de Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Dashboard   │  │   Produtos   │  │ Fornecedores │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Configurações│  │  Relatórios  │  │   Análises   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ▼ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (FastAPI/Express)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              API REST Endpoints                      │   │
│  │  /api/produtos  /api/fornecedores  /api/configs     │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Business Logic (Cálculos)                  │   │
│  │  - Cálculo de Margem                                 │   │
│  │  - Cálculo de Custos                                 │   │
│  │  - Validações                                        │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              ORM (SQLAlchemy/Prisma)                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│               DATABASE (PostgreSQL/SQLite)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Produtos │  │Fornecedo │  │ Configs  │  │ Histórico│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 5.3. Padrões de Projeto

- **Repository Pattern**: Abstração de acesso a dados
- **Service Layer**: Lógica de negócio centralizada
- **DTO (Data Transfer Objects)**: Validação e transformação de dados
- **Dependency Injection**: Facilita testes e manutenção

---

## 6. MODELO DE DADOS <a name="modelo-dados"></a>

### 6.1. Diagrama ER (Entidade-Relacionamento)

```
┌─────────────────────┐
│     FORNECEDORES    │
├─────────────────────┤
│ id (PK)             │
│ nome                │
│ site_instagram      │
│ telefone            │
│ observacoes         │
│ prioritario         │
│ ativo               │
│ created_at          │
│ updated_at          │
└─────────────────────┘
           ▲
           │ 1
           │
           │ N
┌─────────────────────┐
│      PRODUTOS       │
├─────────────────────┤
│ id (PK)             │
│ nome                │
│ fornecedor_id (FK)  │─────┐
│ custo_unitario      │     │
│ preco_venda         │     │
│ ativo               │     │
│ created_at          │     │
│ updated_at          │     │
└─────────────────────┘     │
           │                │
           │ 1              │
           │                │
           │ N              │
┌─────────────────────┐     │
│ HISTORICO_PRODUTOS  │     │
├─────────────────────┤     │
│ id (PK)             │     │
│ produto_id (FK)     │─────┘
│ custo_unitario      │
│ preco_venda         │
│ margem_calculada    │
│ config_snapshot     │
│ created_at          │
└─────────────────────┘


┌─────────────────────┐
│    CONFIGURACOES    │
├─────────────────────┤
│ id (PK)             │
│ chave               │
│ valor               │
│ tipo                │
│ descricao           │
│ updated_at          │
│ updated_by          │
└─────────────────────┘
```

### 6.2. Tabelas Detalhadas

#### **Tabela: fornecedores**
```sql
CREATE TABLE fornecedores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE,
    site_instagram VARCHAR(500),
    telefone VARCHAR(100),
    observacoes TEXT,
    prioritario BOOLEAN DEFAULT FALSE,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **Tabela: produtos**
```sql
CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    fornecedor_id INTEGER REFERENCES fornecedores(id),
    custo_unitario DECIMAL(10, 2) NOT NULL CHECK (custo_unitario > 0),
    preco_venda DECIMAL(10, 2) NOT NULL CHECK (preco_venda > custo_unitario),
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(nome, fornecedor_id)
);
```

#### **Tabela: configuracoes**
```sql
CREATE TABLE configuracoes (
    id SERIAL PRIMARY KEY,
    chave VARCHAR(100) NOT NULL UNIQUE,
    valor VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL, -- 'PERCENTAGE', 'CURRENCY', 'NUMBER'
    descricao TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100)
);

-- Dados iniciais
INSERT INTO configuracoes (chave, valor, tipo, descricao) VALUES
    ('TACOS', '0.05', 'PERCENTAGE', 'Taxa de investimento em anúncios (%)'),
    ('CUSTO_PREP', '1.30', 'CURRENCY', 'Custo fixo de preparação (R$)'),
    ('ALIQUOTA_IMPOSTO', '0.04', 'PERCENTAGE', 'Alíquota de imposto (%)'),
    ('FRETE_FBA', '6.00', 'CURRENCY', 'Custo de frete FBA (R$)'),
    ('TAXA_COMISSAO', '0.05', 'PERCENTAGE', 'Comissão Amazon (%)');
```

#### **Tabela: historico_produtos**
```sql
CREATE TABLE historico_produtos (
    id SERIAL PRIMARY KEY,
    produto_id INTEGER REFERENCES produtos(id),
    custo_unitario DECIMAL(10, 2),
    preco_venda DECIMAL(10, 2),
    margem_sem_ads DECIMAL(5, 4),
    margem_com_ads DECIMAL(5, 4),
    config_snapshot JSONB, -- Snapshot das configurações no momento
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 7. ROADMAP DE DESENVOLVIMENTO <a name="roadmap"></a>

### 🚀 FASE 1: MVP (Mínimo Produto Viável) - 2 semanas

**Objetivo**: Sistema funcional básico com cálculo de lucro

#### Semana 1: Backend + Database
- [x] Setup do projeto (FastAPI/Express + PostgreSQL)
- [ ] Criar modelo de dados
- [ ] API de Configurações (CRUD)
- [ ] API de Fornecedores (CRUD)
- [ ] API de Produtos (CRUD)
- [ ] Implementar lógica de cálculo de margem
- [ ] Testes unitários dos cálculos

#### Semana 2: Frontend
- [ ] Setup React + TypeScript + Tailwind
- [ ] Página de Configurações
- [ ] Página de Fornecedores
- [ ] Página de Produtos
- [ ] Dashboard simples
- [ ] Integração com API
- [ ] Deploy inicial

### 📈 FASE 2: Melhorias e Análises - 1 semana

- [ ] Filtros e buscas avançadas
- [ ] Ordenação por múltiplos critérios
- [ ] Gráficos de lucratividade
- [ ] Calculadora de cenários
- [ ] Exportação para Excel
- [ ] Indicadores visuais melhorados

### 💼 FASE 3: Gestão Financeira - 2 semanas

- [ ] Módulo de DRE (Projeção Financeira)
- [ ] Módulo de Fluxo de Caixa
- [ ] Gestão de Passivos
- [ ] Relatórios financeiros
- [ ] Gráficos de tendência

### 🔒 FASE 4: Autenticação e Multi-usuário - 1 semana

- [ ] Sistema de login
- [ ] Controle de acesso
- [ ] Histórico de ações por usuário
- [ ] Auditoria de mudanças

### 🎨 FASE 5: UX/UI Avançado - 1 semana

- [ ] Modo escuro
- [ ] Responsividade mobile
- [ ] Animações e transições
- [ ] Tutoriais interativos
- [ ] Atalhos de teclado

---

## 📊 MÉTRICAS DE SUCESSO

O sistema será considerado bem-sucedido quando:

1. ✅ **Precisão**: Cálculos 100% iguais à planilha original
2. ✅ **Performance**: Tempo de resposta < 200ms para qualquer cálculo
3. ✅ **Usabilidade**: Usuário consegue cadastrar um produto em < 30 segundos
4. ✅ **Confiabilidade**: 99.9% de uptime
5. ✅ **Adoção**: Planilha Excel completamente substituída

---

## 🛠️ TECNOLOGIAS E FERRAMENTAS

### Desenvolvimento
- Git & GitHub (controle de versão)
- VS Code (IDE)
- Postman/Insomnia (testar API)
- DBeaver/pgAdmin (gerenciar banco)

### Deploy
- Docker (containerização)
- Render/Railway/Heroku (hosting backend)
- Vercel/Netlify (hosting frontend)
- PostgreSQL na nuvem (Supabase/Neon)

### Monitoramento
- Sentry (erro tracking)
- Google Analytics (uso)
- LogRocket (sessões de usuário)

---

## 📝 PRÓXIMOS PASSOS

1. **Validar Especificação**: Revisar este documento com stakeholders
2. **Escolher Stack**: Decidir entre Python ou Node.js
3. **Setup Ambiente**: Configurar repositório e ambiente de desenvolvimento
4. **Começar MVP**: Iniciar desenvolvimento da Fase 1

---

## 🤝 CONTRIBUINDO

Este documento é vivo e deve ser atualizado conforme o projeto evolui.

**Data última atualização**: 16/09/2026  
**Versão**: 1.0  
**Autor**: Análise baseada em planilha Excel "Forza Club"
