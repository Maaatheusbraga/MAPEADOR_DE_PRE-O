import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Instância do axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = String(error.config?.url || '');
    const isAuthAttempt = url.includes('/api/auth/login') || url.includes('/api/auth/cadastro');
    if (error.response?.status === 401 && !isAuthAttempt) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTENTICAÇÃO
// ============================================

export const authAPI = {
  cadastro: async (nome: string, email: string, senha: string) => {
    const response = await api.post('/api/auth/cadastro', { nome, email, senha });
    return response.data;
  },

  login: async (email: string, senha: string) => {
    const response = await api.post('/api/auth/login', { email, senha });
    return response.data;
  },

  me: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
};

// ============================================
// PRODUTOS
// ============================================

export const produtosAPI = {
  listar: async () => {
    const response = await api.get('/api/produtos');
    return response.data;
  },

  criar: async (dados: {
    nome: string;
    fornecedor_id: number;
    custo_unitario: number;
    preco_venda: number;
    observacao?: string;
    link_fornecedor?: string;
    decisao?: string;
    tacos?: number;
    taxa_comissao?: number;
    custo_prep?: number;
    frete_fba?: number;
    aliquota_imposto?: number;
  }) => {
    const response = await api.post('/api/produtos', dados);
    return response.data;
  },

  obter: async (id: number) => {
    const response = await api.get(`/api/produtos/${id}`);
    return response.data;
  },

  atualizar: async (id: number, dados: any) => {
    const response = await api.put(`/api/produtos/${id}`, dados);
    return response.data;
  },

  excluir: async (id: number) => {
    const response = await api.delete(`/api/produtos/${id}`);
    return response.data;
  },

  simular: async (id: number) => {
    const response = await api.get(`/api/produtos/${id}/simular`);
    return response.data;
  },
};

// ============================================
// FORNECEDORES
// ============================================

export const fornecedoresAPI = {
  listar: async () => {
    const response = await api.get('/api/fornecedores');
    return response.data;
  },

  criar: async (dados: {
    nome: string;
    site_instagram?: string;
    telefone?: string;
    observacoes?: string;
    prioritario?: boolean;
  }) => {
    const response = await api.post('/api/fornecedores', dados);
    return response.data;
  },

  obter: async (id: number) => {
    const response = await api.get(`/api/fornecedores/${id}`);
    return response.data;
  },

  atualizar: async (id: number, dados: any) => {
    const response = await api.put(`/api/fornecedores/${id}`, dados);
    return response.data;
  },

  excluir: async (id: number) => {
    const response = await api.delete(`/api/fornecedores/${id}`);
    return response.data;
  },
};

// ============================================
// CONFIGURAÇÕES
// ============================================

export const configuracoesAPI = {
  obter: async () => {
    const response = await api.get('/api/configuracoes');
    return response.data;
  },

  atualizar: async (premissas: any) => {
    const response = await api.put('/api/configuracoes', premissas);
    return response.data;
  },
};

// ============================================
// DASHBOARD
// ============================================

export const dashboardAPI = {
  obter: async () => {
    const response = await api.get('/api/dashboard');
    return response.data;
  },
};

export const dreAPI = {
  obter: async () => {
    const response = await api.get('/api/dre');
    return response.data;
  },
  salvar: async (meses: any[]) => {
    const response = await api.put('/api/dre', { meses });
    return response.data;
  },
};

export const fluxoCaixaAPI = {
  obter: async () => {
    const response = await api.get('/api/fluxo-caixa');
    return response.data;
  },
  salvar: async (payload: {
    saldo_atual: { caixa: number; banco: number; total: number };
    movimentacoes: any[];
    passivos: any[];
    proximo_id_movimentacao: number;
    proximo_id_passivo: number;
  }) => {
    const response = await api.put('/api/fluxo-caixa', payload);
    return response.data;
  },
};

export default api;
