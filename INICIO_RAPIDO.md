# 🚀 INÍCIO RÁPIDO - Mapeador de Preços

Quer começar AGORA? Siga este guia de 3 minutos! ⏱️

---

## ⚡ Método Rápido (1 clique)

### 1️⃣ Duplo clique aqui:

```
📂 INICIAR_SISTEMA.bat
```

### 2️⃣ Aguarde (~30 segundos)
- Abrirá 2 janelas de terminal
- Backend iniciará (porta 8000)
- Frontend iniciará (porta 3000)
- Navegador abrirá automaticamente

### 3️⃣ Pronto! 🎉
Você verá a tela de login/cadastro.

---

## 📋 Primeira Vez? Siga Estes Passos

### Passo 1: Cadastre-se
1. Na tela que abriu, clique na aba **"Cadastro"**
2. Preencha:
   - Nome: Seu nome completo
   - Email: seu@email.com
   - Senha: mínimo 6 caracteres
3. Clique em **"Criar Conta"**

✅ Pronto! Você está logado automaticamente.

---

### Passo 2: Crie Seu Primeiro Produto
1. Na tela inicial, clique em **"➕ Novo Produto"**
2. Preencha o formulário:

```
Nome: Tábua Inox Premium
Fornecedor: Utimix (já vem pré-cadastrado)
Custo Unitário: 12.50
Preço de Venda: 33.90
```

3. **Observe:** O sistema calcula AUTOMATICAMENTE enquanto você digita! 🎯
   - Você verá: Margem, Lucro, Status
4. Clique em **"💾 Salvar Produto"**

✅ Produto criado! Dashboard atualizado!

---

### Passo 3: Veja os Resultados
O Dashboard mostra:
- 📦 **Total de produtos**: 1
- ✅ **Produtos lucrativos**: 1
- 📊 **Margem média**: 27,54%
- 💰 **Lucro médio**: R$ 9,34

O card do produto mostra:
- Badge colorido: **EXCELENTE** (verde)
- Status: **✅ LUCRATIVO**
- Margem: **27,54%**
- Lucro: **R$ 9,34**

---

## 🎯 Experimente Diferentes Cenários

### Produto MUITO LUCRATIVO
```
Nome: Produto Top
Fornecedor: Zein
Custo: 10.00
Preço: 50.00
```
Resultado: Margem > 50%, Badge EXCELENTE

### Produto MARGINAL
```
Nome: Produto Arriscado
Fornecedor: Top Rio
Custo: 25.00
Preço: 35.00
```
Resultado: Margem ~6%, Badge MARGINAL

### Produto NO PREJUÍZO
```
Nome: Produto Ruim
Fornecedor: Utimix
Custo: 30.00
Preço: 35.00
```
Resultado: ❌ PREJUÍZO, Badge vermelho

---

## ✨ Features Incríveis para Testar

### 1. Cálculo em Tempo Real ⚡
Ao criar produto:
- Digite o custo: Veja cálculo parcial
- Digite o preço: Veja cálculo completo INSTANTÂNEO
- Não precisa salvar para ver o resultado!

### 2. Dashboard Inteligente 📊
- Atualiza automaticamente
- Métricas visuais
- Cards coloridos

### 3. Classificação Visual 🎨
- **Verde (EXCELENTE)**: Margem ≥ 25%
- **Azul (BOM)**: Margem ≥ 15%
- **Laranja (MARGINAL)**: Margem ≥ 5%
- **Vermelho (PREJUÍZO)**: Margem < 5%

---

## 🔄 Como Parar o Sistema

### Opção 1: Fechar Janelas
- Feche as 2 janelas de terminal
- Feche o navegador

### Opção 2: Ctrl+C
- Em cada janela, pressione `Ctrl+C`

---

## 🆘 Algo Deu Errado?

### Backend não iniciou
```bash
# Teste manualmente
cd backend
pip install -r requirements.txt
python main.py
```
Deve aparecer: "🚀 Iniciando servidor..."

### Frontend não iniciou
```bash
# Teste manualmente
cd frontend
npm install
npm start
```
Deve abrir automaticamente no navegador

### Navegador não abriu
Abra manualmente: **http://localhost:3000**

### Vejo erro "Network Error"
1. Verifique se backend está rodando
2. Teste: http://localhost:8000/health
3. Deve responder: `{"status":"healthy"}`

---

## 📚 Próximos Passos

Agora que você já testou o básico:

1. **Crie mais produtos** com diferentes valores
2. **Veja o Dashboard** se atualizando
3. **Teste fornecedores** diferentes
4. **Analise** quais produtos são lucrativos
5. **Exclua** produtos que não servem

### Quer ir mais fundo?

**Testes completos:** Veja `GUIA_TESTES.md`  
**Documentação completa:** Veja `README.md`  
**API Docs:** http://localhost:8000/docs

---

## 💡 Dicas Profissionais

### 1. Fornecedores Prioritários ⭐
Os fornecedores com estrela (⭐) aparecem primeiro na lista.

### 2. Multi-usuários
Cada pessoa pode se cadastrar e ter seus próprios produtos!
- Fornecedores são compartilhados
- Produtos são individuais

### 3. Dados Salvos
Todos os dados ficam na pasta `backend/data/`:
- Seus produtos
- Suas análises
- Tudo em JSON (fácil de ler)

### 4. Sem Internet Necessária
Tudo roda localmente no seu computador! 🖥️

---

## 🎊 Divirta-se!

Você agora tem um sistema completo para analisar a lucratividade de produtos Amazon FBA!

**Tempo total até aqui:** ~3 minutos ⏱️

**Dúvidas?** Consulte a documentação completa em `README.md`

---

**Desenvolvido com ❤️ para facilitar vendas na Amazon FBA**
