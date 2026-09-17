import React, { useState, useEffect } from 'react';
import { produtosAPI, fornecedoresAPI, dashboardAPI } from '../services/api';
import { NovoProduto } from '../components/NovoProduto';
import './ProdutosPage.css';

interface Produto {
  id: number;
  nome: string;
  custo_unitario: number;
  preco_venda: number;
  fornecedor_id?: number;
  fornecedor?: { id: number; nome: string };
  calculado: {
    margem_com_ads: number;
    lucro_com_ads: number;
    margem_sem_ads?: number;
    lucro_sem_ads?: number;
    lucrativo: boolean;
    classificacao: string;
  };
}

interface Fornecedor {
  id: number;
  nome: string;
  prioritario?: boolean;
}

interface Dashboard {
  estatisticas: {
    total_produtos: number;
    produtos_lucrativos: number;
    margem_media: number;
    lucro_medio: number;
  };
}

export function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [produtoEdicao, setProdutoEdicao] = useState<Produto | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      const [produtosRes, fornecedoresRes, dashboardRes] = await Promise.all([
        produtosAPI.listar(),
        fornecedoresAPI.listar(),
        dashboardAPI.obter(),
      ]);
      
      setProdutos(produtosRes.produtos || []);
      setFornecedores(fornecedoresRes.fornecedores || []);
      setDashboard(dashboardRes);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setCarregando(false);
    }
  };

  const fecharForm = () => {
    setMostrarForm(false);
    setProdutoEdicao(null);
  };

  const handleSalvo = async () => {
    fecharForm();
    await carregarDados();
  };

  const handleEditar = (produto: Produto) => {
    setProdutoEdicao(produto);
    setMostrarForm(true);
  };

  const handleExcluir = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await produtosAPI.excluir(id);
        await carregarDados();
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
        alert('Erro ao excluir produto');
      }
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  const formatarPercentual = (valor: number) => {
    return `${(valor * 100).toFixed(2)}%`;
  };

  const getClassificacaoColor = (classificacao: string) => {
    switch (classificacao) {
      case 'EXCELENTE': return '#4caf50';
      case 'BOM': return '#2196f3';
      case 'MARGINAL': return '#ff9800';
      case 'PREJUÍZO': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  if (carregando) {
    return (
      <div className="produtos-container">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="produtos-container">
      {/* Page Header */}
      <div className="page-header">
        <h2>📦 Produtos</h2>
        <p>Análise de lucratividade dos seus produtos</p>
      </div>

      {/* Dashboard */}
      {dashboard && (
        <div className="dashboard">
          <div className="dashboard-card">
            <div className="card-icon">📦</div>
            <div className="card-content">
              <div className="card-value">{dashboard.estatisticas.total_produtos}</div>
              <div className="card-label">Total de Produtos</div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">✅</div>
            <div className="card-content">
              <div className="card-value">{dashboard.estatisticas.produtos_lucrativos}</div>
              <div className="card-label">Produtos Lucrativos</div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📊</div>
            <div className="card-content">
              <div className="card-value">{formatarPercentual(dashboard.estatisticas.margem_media)}</div>
              <div className="card-label">Margem Média pós ADS</div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">💰</div>
            <div className="card-content">
              <div className="card-value">{formatarMoeda(dashboard.estatisticas.lucro_medio)}</div>
              <div className="card-label">Lucro Médio</div>
            </div>
          </div>
        </div>
      )}

      {/* Botão Novo Produto */}
      <div className="actions">
        <button onClick={() => { setProdutoEdicao(null); setMostrarForm(true); }} className="btn-novo">
          ➕ Novo Produto
        </button>
      </div>

      {/* Modal Novo Produto */}
      {mostrarForm && (
        <div className="modal-overlay" onClick={fecharForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={fecharForm}>✕</button>
            <NovoProduto 
              key={produtoEdicao ? `edit-${produtoEdicao.id}` : 'novo'}
              fornecedores={fornecedores}
              produto={produtoEdicao}
              onSucesso={handleSalvo}
            />
          </div>
        </div>
      )}

      {/* Lista de Produtos */}
      <div className="produtos-lista">
        {produtos.length === 0 ? (
          <div className="empty-state">
            <h2>📦 Nenhum produto cadastrado</h2>
            <p>Clique em "Novo Produto" para começar a analisar a lucratividade!</p>
          </div>
        ) : (
          produtos.map((produto) => (
            <div key={produto.id} className="produto-card">
              <div className="produto-header">
                <h3>{produto.nome}</h3>
                <span 
                  className="badge"
                  style={{ backgroundColor: getClassificacaoColor(produto.calculado.classificacao) }}
                >
                  {produto.calculado.classificacao}
                </span>
              </div>

              <div className="produto-info">
                <div className="info-row">
                  <span className="label">Fornecedor:</span>
                  <span className="value">{produto.fornecedor?.nome || 'N/A'}</span>
                </div>

                <div className="info-row">
                  <span className="label">Custo:</span>
                  <span className="value">{formatarMoeda(produto.custo_unitario)}</span>
                </div>

                <div className="info-row">
                  <span className="label">Preço de Venda:</span>
                  <span className="value">{formatarMoeda(produto.preco_venda)}</span>
                </div>
              </div>

              <div className="produto-resultados">
                <div className="resultado-item">
                  <div className="resultado-label">Margem de Lucro</div>
                  <div className="resultado-valor">
                    {formatarPercentual(produto.calculado.margem_sem_ads ?? produto.calculado.margem_com_ads)}
                  </div>
                </div>

                <div className="resultado-item">
                  <div className="resultado-label">Lucro</div>
                  <div className="resultado-valor">
                    {formatarMoeda(produto.calculado.lucro_sem_ads ?? produto.calculado.lucro_com_ads)}
                  </div>
                </div>

                <div className="resultado-item">
                  <div className="resultado-label">Margem pós ADS</div>
                  <div className="resultado-valor destaque">
                    {formatarPercentual(produto.calculado.margem_com_ads)}
                  </div>
                </div>

                <div className="resultado-item">
                  <div className="resultado-label">Lucro pós ADS</div>
                  <div className="resultado-valor destaque">
                    {formatarMoeda(produto.calculado.lucro_com_ads)}
                  </div>
                </div>

                <div className="resultado-item">
                  <div className="resultado-label">Status</div>
                  <div className="resultado-valor">
                    {produto.calculado.lucrativo ? '✅ LUCRATIVO' : '❌ PREJUÍZO'}
                  </div>
                </div>
              </div>

              <div className="produto-actions">
                <button 
                  onClick={() => handleEditar(produto)}
                  className="btn-editar"
                >
                  ✏️ Editar
                </button>
                <button 
                  onClick={() => handleExcluir(produto.id)}
                  className="btn-excluir"
                >
                  🗑️ Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
