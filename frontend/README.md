# 🎨 Frontend - Mapeador de Preços

Interface web para análise de lucratividade de produtos Amazon FBA.

## 📦 Tecnologias

- **React 18** com TypeScript
- **React Router DOM** para navegação
- **Axios** para chamadas à API
- **Context API** para gerenciamento de estado
- **CSS puro** (sem frameworks CSS)

## 🚀 Como Rodar

### 1. Certifique-se de que o Backend está rodando
```bash
# Em outro terminal
cd backend
python main.py
```

### 2. Instalar dependências (primeira vez)
```bash
npm install
```

### 3. Rodar o frontend
```bash
npm start
```

O aplicativo abrirá automaticamente em http://localhost:3000

## 📁 Estrutura de Arquivos

```
frontend/src/
├── components/
│   ├── NovoProduto.tsx        # Form de criação de produto
│   └── NovoProduto.css
├── contexts/
│   └── AuthContext.tsx        # Context de autenticação
├── pages/
│   ├── AuthPage.tsx           # Login/Cadastro
│   ├── Auth.css
│   ├── ProdutosPage.tsx       # Lista de produtos
│   └── ProdutosPage.css
├── services/
│   └── api.ts                 # Comunicação com backend
├── App.tsx                    # Rotas principais
└── index.tsx                  # Entry point
```

## 🔑 Funcionalidades

### ✅ Autenticação
- [x] Tela de login
- [x] Tela de cadastro
- [x] Proteção de rotas (redirect se não logado)
- [x] Logout
- [x] Token JWT armazenado no localStorage

### ✅ Dashboard
- [x] Total de produtos
- [x] Produtos lucrativos
- [x] Margem média
- [x] Lucro médio

### ✅ Produtos
- [x] Lista de produtos em cards
- [x] Criar produto
- [x] Excluir produto
- [x] **Cálculo em tempo real** ao digitar (preview)
- [x] Visualização de margem e lucro
- [x] Badge de classificação (EXCELENTE, BOM, MARGINAL, PREJUÍZO)
- [x] Status visual (✅ LUCRATIVO ou ❌ PREJUÍZO)

### ✅ Form de Produto
- [x] Nome do produto
- [x] Seleção de fornecedor
- [x] Custo unitário
- [x] Preço de venda
- [x] **Preview em tempo real** dos cálculos
- [x] Validações de formulário
- [x] Tratamento de erros

## 🎨 Design

### Paleta de Cores
- **Primária**: `#667eea` (roxo/azul)
- **Secundária**: `#764ba2` (roxo escuro)
- **Sucesso**: `#4caf50` (verde)
- **Erro**: `#f44336` (vermelho)
- **Aviso**: `#ff9800` (laranja)
- **Info**: `#2196f3` (azul)

### Layout
- Design moderno e limpo
- Cards com hover effect
- Gradiente no header
- Modal para criação de produto
- Responsivo (funciona em mobile)

## 📡 Integração com Backend

O frontend se comunica com o backend através da API REST.

**URL da API:** `http://localhost:8000` (configurável)

### Endpoints Usados

#### Autenticação
- `POST /api/auth/cadastro`
- `POST /api/auth/login`

#### Produtos
- `GET /api/produtos`
- `POST /api/produtos`
- `DELETE /api/produtos/{id}`

#### Fornecedores
- `GET /api/fornecedores`

#### Configurações
- `GET /api/configuracoes`

#### Dashboard
- `GET /api/dashboard`

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do frontend (opcional):

```env
REACT_APP_API_URL=http://localhost:8000
```

Se não definir, usará `http://localhost:8000` por padrão.

## 🎯 Como Usar

### 1. Primeira Vez
1. Acesse http://localhost:3000
2. Clique na aba "Cadastro"
3. Preencha nome, email e senha
4. Clique em "Criar Conta"

### 2. Criar um Produto
1. No dashboard, clique em "➕ Novo Produto"
2. Preencha:
   - Nome do produto
   - Selecione um fornecedor
   - Custo unitário (ex: 12.50)
   - Preço de venda (ex: 33.90)
3. Veja o **cálculo em tempo real**
4. Clique em "💾 Salvar Produto"

### 3. Ver Resultados
- Veja seus produtos em cards
- Dashboard mostra estatísticas gerais
- Cada produto mostra:
  - Margem com ADS
  - Lucro com ADS
  - Status (lucrativo ou não)
  - Classificação (EXCELENTE, BOM, MARGINAL, PREJUÍZO)

## 🐛 Troubleshooting

**Erro: "Network Error"**
- Verifique se o backend está rodando
- Confirme que está em http://localhost:8000

**Erro: "Token inválido"**
- Faça logout e login novamente
- Limpe o localStorage: `localStorage.clear()`

**Página em branco**
- Abra o Console do navegador (F12)
- Verifique erros no console
- Reinstale dependências: `npm install`

**Não abre automaticamente**
- Acesse manualmente: http://localhost:3000

## 📱 Responsividade

O aplicativo é responsivo e funciona em:
- ✅ Desktop (1920px+)
- ✅ Laptop (1366px)
- ✅ Tablet (768px)
- ✅ Mobile (375px)

## 🚀 Build para Produção

```bash
npm run build
```

Cria a pasta `build/` com os arquivos otimizados.

## 📝 Scripts Disponíveis

```bash
npm start       # Inicia dev server (porta 3000)
npm test        # Roda testes
npm run build   # Build de produção
npm run eject   # Ejeta config (não recomendado)
```

## 🎨 Features de UI/UX

### ✨ Destaques
- **Cálculo em tempo real**: Veja o resultado antes de salvar
- **Visual feedback**: Cores indicam se o produto é lucrativo
- **Cards elegantes**: Layout moderno e limpo
- **Modal para criação**: Não sai da página principal
- **Dashboard intuitivo**: Métricas importantes em destaque
- **Hover effects**: Interatividade visual
- **Validações**: Feedback claro de erros
- **Loading states**: Indicadores de carregamento

### 🎯 Usabilidade
- Formulários simples e diretos
- Feedback visual imediato
- Navegação intuitiva
- Sem páginas desnecessárias
- Tudo em poucos cliques

## 📈 Próximas Melhorias (Sugestões)

- [ ] Editar produto
- [ ] Filtros e busca de produtos
- [ ] Gráficos de evolução
- [ ] Exportar relatórios (PDF/Excel)
- [ ] Página de fornecedores (criar/editar)
- [ ] Página de configurações
- [ ] Dark mode
- [ ] Notificações toast
- [ ] Simulador de cenários na interface

## 📝 Licença

Proprietário - Todos os direitos reservados
