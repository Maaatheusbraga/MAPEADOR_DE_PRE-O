import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import './DashboardPage.css';

interface Dashboard {
  estatisticas: {
    total_produtos: number;
    produtos_lucrativos: number;
    margem_media: number;
    lucro_medio: number;
  };
  top_produtos: any[];
  produtos_prejuizo: any[];
}

export function DashboardPage() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    carregarDashboard();
  }, []);

  const carregarDashboard = async () => {
    try {
      setCarregando(true);
      const data = await dashboardAPI.obter();
      setDashboard(data);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setCarregando(false);
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

  if (carregando) {
    return <div className="loading">Carregando dashboard...</div>;
  }

  if (!dashboard) {
    return <div className="error">Erro ao carregar dashboard</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h2>🏠 Dashboard</h2>
        <p>Visão geral do seu negócio</p>
      </div>

      {/* Cards de Métricas */}
      <div className="dashboard-cards">
        <div className="metric-card" onClick={() => navigate('/produtos')}>
          <div className="metric-icon">📦</div>
          <div className="metric-content">
            <div className="metric-value">{dashboard.estatisticas.total_produtos}</div>
            <div className="metric-label">Total de Produtos</div>
          </div>
        </div>

        <div className="metric-card success">
          <div className="metric-icon">✅</div>
          <div className="metric-content">
            <div className="metric-value">{dashboard.estatisticas.produtos_lucrativos}</div>
            <div className="metric-label">Produtos Lucrativos</div>
          </div>
        </div>

        <div className="metric-card info">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <div className="metric-value">{formatarPercentual(dashboard.estatisticas.margem_media)}</div>
            <div className="metric-label">Margem Média</div>
          </div>
        </div>

        <div className="metric-card money">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <div className="metric-value">{formatarMoeda(dashboard.estatisticas.lucro_medio)}</div>
            <div className="metric-label">Lucro Médio</div>
          </div>
        </div>
      </div>

      {/* Atalhos Rápidos */}
      <div className="quick-actions">
        <h3>⚡ Ações Rápidas</h3>
        <div className="actions-grid">
          <button className="action-card" onClick={() => navigate('/produtos')}>
            <span className="action-icon">📦</span>
            <span className="action-title">Novo Produto</span>
            <span className="action-desc">Analisar lucratividade</span>
          </button>

          <button className="action-card" onClick={() => navigate('/fornecedores')}>
            <span className="action-icon">🏪</span>
            <span className="action-title">Fornecedores</span>
            <span className="action-desc">Gerenciar contatos</span>
          </button>

          <button className="action-card" onClick={() => navigate('/dre')}>
            <span className="action-icon">📊</span>
            <span className="action-title">DRE</span>
            <span className="action-desc">Ver demonstrativos</span>
          </button>

          <button className="action-card" onClick={() => navigate('/fluxo-caixa')}>
            <span className="action-icon">💰</span>
            <span className="action-title">Fluxo de Caixa</span>
            <span className="action-desc">Controle financeiro</span>
          </button>

          <button className="action-card" onClick={() => navigate('/configuracoes')}>
            <span className="action-icon">⚙️</span>
            <span className="action-title">Configurações</span>
            <span className="action-desc">Ajustar premissas</span>
          </button>
        </div>
      </div>

      {/* Top Produtos */}
      {dashboard.top_produtos.length > 0 && (
        <div className="dashboard-section">
          <h3>🏆 Top 5 Produtos Mais Lucrativos</h3>
          <div className="products-list">
            {dashboard.top_produtos.map((produto, index) => (
              <div key={produto.id} className="product-item">
                <div className="product-rank">#{index + 1}</div>
                <div className="product-info">
                  <div className="product-name">{produto.nome}</div>
                  <div className="product-supplier">{produto.fornecedor_nome}</div>
                </div>
                <div className="product-metrics">
                  <div className="product-profit">
                    {formatarMoeda(produto.calculado.lucro_com_ads)}
                  </div>
                  <div className="product-margin">
                    {formatarPercentual(produto.calculado.margem_com_ads)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Produtos com Prejuízo */}
      {dashboard.produtos_prejuizo.length > 0 && (
        <div className="dashboard-section alert">
          <h3>⚠️ Produtos com Prejuízo</h3>
          <div className="products-list">
            {dashboard.produtos_prejuizo.map((produto) => (
              <div key={produto.id} className="product-item warning">
                <div className="product-info">
                  <div className="product-name">{produto.nome}</div>
                  <div className="product-supplier">{produto.fornecedor_nome}</div>
                </div>
                <div className="product-metrics">
                  <div className="product-profit negative">
                    {formatarMoeda(produto.calculado.lucro_com_ads)}
                  </div>
                  <div className="product-margin">
                    {formatarPercentual(produto.calculado.margem_com_ads)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {dashboard.estatisticas.total_produtos === 0 && (
        <div className="empty-dashboard">
          <div className="empty-icon">📦</div>
          <h3>Bem-vindo ao Mapeador de Preços!</h3>
          <p>Comece cadastrando seu primeiro produto para ver análises aqui.</p>
          <button className="btn-primary" onClick={() => navigate('/produtos')}>
            ➕ Criar Primeiro Produto
          </button>
        </div>
      )}
    </div>
  );
}
