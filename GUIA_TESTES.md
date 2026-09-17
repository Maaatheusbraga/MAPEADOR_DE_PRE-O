# 🧪 Guia de Testes da API - Passo a Passo

Este guia te ajuda a testar todas as funcionalidades do backend de forma prática.

## 🚀 Início Rápido

### 1. Inicie o Servidor
```bash
cd backend
start.bat
```

### 2. Abra a Documentação Interativa
**Abra no navegador:** http://localhost:8000/docs

---

## 📋 Fluxo de Testes Completo

### ✅ TESTE 1: Cadastrar Usuário

**Endpoint:** `POST /api/auth/cadastro`

**Na interface Swagger:**
1. Clique em `POST /api/auth/cadastro`
2. Clique em "Try it out"
3. Cole este JSON:
```json
{
  "nome": "Matheus Silva",
  "email": "matheus@teste.com",
  "senha": "senha123"
}
```
4. Clique em "Execute"

**✅ Resultado Esperado:**
- Status: 200
- Retorna: usuário criado + **token**
- ✅ **COPIE O TOKEN!** Você vai usar nas próximas requisições

---

### ✅ TESTE 2: Fazer Login

**Endpoint:** `POST /api/auth/login`

1. Clique em `POST /api/auth/login`
2. Clique em "Try it out"
3. Cole este JSON:
```json
{
  "email": "matheus@teste.com",
  "senha": "senha123"
}
```
4. Clique em "Execute"

**✅ Resultado Esperado:**
- Status: 200
- Retorna: usuário + token

---

### 🔐 TESTE 3: Autenticar para Próximas Requisições

**Agora você precisa autenticar!**

1. Na página `/docs`, procure o botão 🔓 **"Authorize"** no topo direito
2. Clique nele
3. No campo `APIKeyHeader (apiKey)`, cole o token que você copiou
   - Pode colar só o token OU `Bearer SEU_TOKEN`
4. Clique em "Authorize"
5. Clique em "Close"

**✅ Agora você está autenticado!** Pode usar todos os outros endpoints.

---

### ✅ TESTE 4: Listar Fornecedores (Global)

**Endpoint:** `GET /api/fornecedores`

1. Clique em `GET /api/fornecedores`
2. Clique em "Try it out"
3. Clique em "Execute"

**✅ Resultado Esperado:**
```json
{
  "total": 3,
  "fornecedores": [
    {
      "id": 1,
      "nome": "Utimix",
      "site_instagram": "https://www.utimix.com/",
      "telefone": "(11) 95300-7505",
      "prioritario": true
    },
    {
      "id": 2,
      "nome": "Zein",
      ...
    },
    {
      "id": 3,
      "nome": "Top Rio",
      ...
    }
  ]
}
```

---

### ✅ TESTE 5: Criar um Produto

**Endpoint:** `POST /api/produtos`

1. Clique em `POST /api/produtos`
2. Clique em "Try it out"
3. Cole este JSON:
```json
{
  "nome": "Tábua Inox Premium",
  "fornecedor_id": 1,
  "custo_unitario": 12.50,
  "preco_venda": 33.90
}
```
4. Clique em "Execute"

**✅ Resultado Esperado:**
```json
{
  "message": "Produto criado com sucesso",
  "produto": {
    "id": 1,
    "nome": "Tábua Inox Premium",
    "custo_unitario": 12.50,
    "preco_venda": 33.90,
    "calculado": {
      "comissao": 1.70,
      "prep": 1.30,
      "frete": 6.00,
      "impostos": 1.36,
      "ads": 1.70,
      "custo_total": 24.56,
      "margem_com_ads": 0.2754,  // 27,54%
      "lucro_com_ads": 9.34,
      "lucrativo": true,
      "classificacao": "EXCELENTE"
    },
    "fornecedor": {
      "id": 1,
      "nome": "Utimix"
    }
  }
}
```

🎉 **Produto criado!** Sistema calculou TUDO automaticamente!

---

### ✅ TESTE 6: Listar Meus Produtos

**Endpoint:** `GET /api/produtos`

1. Clique em `GET /api/produtos`
2. Clique em "Try it out"
3. Clique em "Execute"

**✅ Resultado Esperado:**
- Lista todos os seus produtos
- Cada produto com cálculos completos
- Dados do fornecedor incluídos

---

### ✅ TESTE 7: Criar Mais Produtos (diferentes cenários)

**Produto MUITO LUCRATIVO:**
```json
{
  "nome": "Produto Top",
  "fornecedor_id": 2,
  "custo_unitario": 10.00,
  "preco_venda": 50.00
}
```
Resultado esperado: Margem > 50%, classificação "EXCELENTE"

**Produto MARGINAL:**
```json
{
  "nome": "Produto Marginal",
  "fornecedor_id": 3,
  "custo_unitario": 25.00,
  "preco_venda": 35.00
}
```
Resultado esperado: Margem baixa (5-15%), classificação "MARGINAL"

**Produto NO PREJUÍZO:**
```json
{
  "nome": "Produto Ruim",
  "fornecedor_id": 1,
  "custo_unitario": 30.00,
  "preco_venda": 35.00
}
```
Resultado esperado: `lucrativo: false`, classificação "PREJUÍZO"

---

### ✅ TESTE 8: Ver Dashboard

**Endpoint:** `GET /api/dashboard`

1. Clique em `GET /api/dashboard`
2. Clique em "Try it out"
3. Clique em "Execute"

**✅ Resultado Esperado:**
```json
{
  "estatisticas": {
    "total_produtos": 4,
    "produtos_lucrativos": 3,
    "margem_media": 0.25,
    "lucro_medio": 15.50
  },
  "top_produtos": [
    // 5 produtos mais lucrativos
  ],
  "produtos_prejuizo": [
    // Produtos no prejuízo
  ]
}
```

---

### ✅ TESTE 9: Simular Cenários

**Endpoint:** `GET /api/produtos/{id}/simular`

1. Use o ID de um produto (ex: 1)
2. Clique em `GET /api/produtos/1/simular`
3. Clique em "Try it out"
4. Clique em "Execute"

**✅ Resultado Esperado:**
```json
{
  "produto": {
    "nome": "Tábua Inox Premium",
    "custo": 12.50,
    "preco": 33.90,
    "margem_atual": 0.2754,
    "lucro_atual": 9.34
  },
  "simulacoes": {
    "preco_mais_10": {
      "novo_preco": 37.29,
      "margem": 0.3198,
      "lucro": 11.93,
      "diferenca_lucro": 2.59  // +2.59 se aumentar preço
    },
    "preco_menos_10": {
      "novo_preco": 30.51,
      "margem": 0.2217,
      "lucro": 6.76,
      "diferenca_lucro": -2.58  // -2.58 se diminuir preço
    },
    "custo_menos_10": {
      "novo_custo": 11.25,
      "margem": 0.3123,
      "lucro": 10.59,
      "diferenca_lucro": 1.25  // +1.25 se negociar custo
    },
    "tacos_3_porcento": {
      "novo_tacos": "3%",
      "margem": 0.2953,
      "lucro": 10.02,
      "diferenca_lucro": 0.68  // +0.68 se otimizar ADS
    }
  }
}
```

💡 **Interpretação:** 
- Se você aumentar o preço em 10%, ganhará +R$ 2,59 por unidade
- Se você negociar 10% de desconto no custo, ganhará +R$ 1,25 por unidade

---

### ✅ TESTE 10: Criar Fornecedor

**Endpoint:** `POST /api/fornecedores`

1. Clique em `POST /api/fornecedores`
2. Clique em "Try it out"
3. Cole este JSON:
```json
{
  "nome": "Mega Importadora",
  "site_instagram": "https://instagram.com/mega",
  "telefone": "(11) 98888-8888",
  "observacoes": "Fornecedor com bons preços",
  "prioritario": true
}
```
4. Clique em "Execute"

**✅ Resultado Esperado:**
- Status: 200
- Fornecedor criado com ID 4
- Agora ele aparece para TODOS os usuários!

---

### ✅ TESTE 11: Atualizar Fornecedor

**Endpoint:** `PUT /api/fornecedores/{id}`

1. Clique em `PUT /api/fornecedores/4`
2. Clique em "Try it out"
3. Cole este JSON (atualiza apenas o que você quer):
```json
{
  "telefone": "(11) 97777-7777",
  "observacoes": "Fornecedor atualizado - preços subiram"
}
```
4. Clique em "Execute"

**✅ Resultado Esperado:**
- Status: 200
- Apenas os campos telefone e observacoes mudaram
- Outros campos (nome, site) ficaram iguais

---

### ✅ TESTE 12: Excluir Fornecedor

**Endpoint:** `DELETE /api/fornecedores/{id}`

⚠️ **Soft delete:** Fornecedor não é apagado, só desativado!

1. Clique em `DELETE /api/fornecedores/4`
2. Clique em "Try it out"
3. Clique em "Execute"

**✅ Resultado Esperado:**
- Status: 200
- Mensagem: "Fornecedor excluído com sucesso"
- Agora se listar fornecedores, ele não aparece mais
- Mas produtos que usavam ele continuam funcionando!

---

### ✅ TESTE 13: Atualizar Produto

**Endpoint:** `PUT /api/produtos/{id}`

1. Clique em `PUT /api/produtos/1`
2. Clique em "Try it out"
3. Cole este JSON:
```json
{
  "custo_unitario": 11.00,
  "preco_venda": 35.00
}
```
4. Clique em "Execute"

**✅ Resultado Esperado:**
- Status: 200
- Sistema RECALCULA automaticamente com os novos valores
- Nova margem e lucro atualizados

---

### ✅ TESTE 14: Excluir Produto

**Endpoint:** `DELETE /api/produtos/{id}`

1. Clique em `DELETE /api/produtos/4` (o produto ruim)
2. Clique em "Try it out"
3. Clique em "Execute"

**✅ Resultado Esperado:**
- Status: 200
- Produto não aparece mais na listagem
- Mas dados não foram apagados (soft delete)

---

### ✅ TESTE 15: Ver Configurações

**Endpoint:** `GET /api/configuracoes`

1. Clique em `GET /api/configuracoes`
2. Clique em "Try it out"
3. Clique em "Execute"

**✅ Resultado Esperado:**
```json
{
  "premissas": {
    "tacos": 0.05,           // 5%
    "taxa_comissao": 0.05,   // 5%
    "custo_prep": 1.30,      // R$ 1,30
    "frete_fba": 6.00,       // R$ 6,00
    "aliquota_imposto": 0.04 // 4%
  },
  "updated_at": "2026-09-17T08:59:00",
  "updated_by": "sistema"
}
```

---

### ✅ TESTE 16: Atualizar Configurações

**Endpoint:** `PUT /api/configuracoes`

1. Clique em `PUT /api/configuracoes`
2. Clique em "Try it out"
3. Cole este JSON (atualiza TACOS para 3%):
```json
{
  "tacos": 0.03
}
```
4. Clique em "Execute"

**✅ Resultado Esperado:**
- Status: 200
- TACOS agora é 3%
- ⚠️ **Produtos NOVOS** serão calculados com 3%
- ⚠️ **Produtos ANTIGOS** mantêm o cálculo original (5%)

💡 **Dica:** Para recalcular produtos antigos, atualize-os (PUT /api/produtos/{id})

---

## 🎯 Resumo dos Testes

### ✅ Autenticação
- [x] Cadastro
- [x] Login
- [x] Token funcionando

### ✅ Produtos
- [x] Criar (com cálculo automático)
- [x] Listar
- [x] Atualizar (recalcula)
- [x] Excluir
- [x] Simular cenários

### ✅ Fornecedores
- [x] Criar
- [x] Listar
- [x] Atualizar
- [x] Excluir

### ✅ Configurações
- [x] Ver
- [x] Atualizar

### ✅ Dashboard
- [x] Estatísticas
- [x] Top produtos
- [x] Produtos com prejuízo

---

## 🐛 Testes de Erro

### Teste: Login com senha errada
```json
{
  "email": "matheus@teste.com",
  "senha": "senhaERRADA"
}
```
**Resultado esperado:** Status 401, "Email ou senha inválidos"

### Teste: Criar produto com preço < custo
```json
{
  "nome": "Produto Impossível",
  "fornecedor_id": 1,
  "custo_unitario": 50.00,
  "preco_venda": 30.00
}
```
**Resultado esperado:** Status 400, "Preço de venda deve ser maior que custo unitário"

### Teste: Criar produto sem token
1. Clique no botão 🔓 "Authorize"
2. Clique em "Logout"
3. Tente criar um produto
**Resultado esperado:** Status 401, "Token não fornecido"

---

## 📊 Teste Completo com 3 Usuários

### Usuário 1 (Matheus)
- Cadastra
- Cria 5 produtos
- Dashboard: 5 produtos

### Usuário 2 (Maria)
- Cadastra
- Cria 3 produtos
- Dashboard: 3 produtos (não vê os do Matheus!)

### Usuário 3 (João)
- Cadastra  
- Cria 1 fornecedor novo
- Matheus e Maria VÊM o novo fornecedor!
- Cria produtos usando o novo fornecedor

✅ **Comprovado:** Produtos são individuais, fornecedores são compartilhados!

---

## 🎉 Tudo Funcionando?

Se todos os testes passaram, seu backend está 100% funcional! 🎊

**Próximo passo:** Frontend para deixar bonito! 🎨

---

**Dúvidas?** Revise:
- `backend/README.md` - Documentação técnica
- `README.md` - Visão geral do projeto
