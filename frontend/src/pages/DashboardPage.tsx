import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import { IconBox, IconChart, IconPlus, IconWallet } from '../components/Icons';
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
      <div className="page-header mineracao-header">
        <div>
          <h2>Dashboard</h2>
          <p>Visão geral do seu negócio</p>
        </div>
        <button type="button" className="btn-primary" onClick={() => navigate('/produtos?novo=1')}>
          <IconPlus /> Novo produto
        </button>
      </div>

      <div className="dashboard-cards">
        <button type="button" className="metric-card" onClick={() => navigate('/produtos')}>
          <div className="metric-icon"><IconBox /></div>
          <div className="metric-content">
            <div className="metric-value">{dashboard.estatisticas.total_produtos}</div>
            <div className="metric-label">Total de produtos</div>
          </div>
        </button>

        <button type="button" className="metric-card success" onClick={() => navigate('/produtos')}>
          <div className="metric-icon"><IconChart /></div>
          <div className="metric-content">
            <div className="metric-value">{dashboard.estatisticas.produtos_lucrativos}</div>
            <div className="metric-label">Produtos lucrativos</div>
          </div>
        </button>

        <div className="metric-card info">
          <div className="metric-icon"><IconChart /></div>
          <div className="metric-content">
            <div className="metric-value">{formatarPercentual(dashboard.estatisticas.margem_media)}</div>
            <div className="metric-label">Margem média pós ADS</div>
          </div>
        </div>

        <div className="metric-card money">
          <div className="metric-icon"><IconWallet /></div>
          <div className="metric-content">
            <div className="metric-value">{formatarMoeda(dashboard.estatisticas.lucro_medio)}</div>
            <div className="metric-label">Lucro médio</div>
          </div>
        </div>
      </div>

      {dashboard.top_produtos.length > 0 && (
        <div className="dashboard-section">
          <h3>Top 5 mais lucrativos</h3>
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
                    {formatarPercentual(produto.calculado.margem_sem_ads ?? produto.calculado.margem_com_ads)} → {formatarPercentual(produto.calculado.margem_com_ads)} pós ADS
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
          <h3>Produtos com prejuízo</h3>
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
                    {formatarPercentual(produto.calculado.margem_sem_ads ?? produto.calculado.margem_com_ads)} → {formatarPercentual(produto.calculado.margem_com_ads)} pós ADS
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
          <h3>Nenhum produto minerado</h3>
          <p>Cadastre o primeiro para ver margem e lucro aqui.</p>
          <button className="btn-primary" onClick={() => navigate('/produtos?novo=1')}>
            Minerar primeiro produto
          </button>
        </div>
      )}
    </div>
  );
}
