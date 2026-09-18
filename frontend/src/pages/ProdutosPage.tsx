import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { produtosAPI, fornecedoresAPI } from '../services/api';
import { NovoProduto } from '../components/NovoProduto';
import { IconPlus, IconPencil, IconTrash } from '../components/Icons';
import './ProdutosPage.css';

interface Produto {
  id: number;
  nome: string;
  custo_unitario: number;
  preco_venda: number;
  observacao?: string;
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

function classeBadge(classificacao: string) {
  switch (classificacao) {
    case 'EXCELENTE': return 'badge badge-excelente';
    case 'BOM': return 'badge badge-bom';
    case 'MARGINAL': return 'badge badge-marginal';
    case 'PREJUÍZO': return 'badge badge-prejuizo';
    default: return 'badge';
  }
}

export function ProdutosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [produtoEdicao, setProdutoEdicao] = useState<Produto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    if (searchParams.get('novo') === '1') {
      setProdutoEdicao(null);
      setMostrarForm(true);
    }
  }, [searchParams]);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      const [produtosRes, fornecedoresRes] = await Promise.all([
        produtosAPI.listar(),
        fornecedoresAPI.listar(),
      ]);
      setProdutos(produtosRes.produtos || []);
      setFornecedores(fornecedoresRes.fornecedores || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setCarregando(false);
    }
  };

  const abrirNovo = () => {
    setProdutoEdicao(null);
    setMostrarForm(true);
    setSearchParams({ novo: '1' });
  };

  const fecharForm = () => {
    setMostrarForm(false);
    setProdutoEdicao(null);
    setSearchParams({});
  };

  const handleSalvo = async () => {
    fecharForm();
    await carregarDados();
  };

  const handleEditar = (produto: Produto) => {
    setProdutoEdicao(produto);
    setMostrarForm(true);
    setSearchParams({});
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

  const produtosFiltrados = produtos.filter((produto) => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return true;
    const obs = (produto.observacao || '').toLowerCase();
    const fornecedor = (produto.fornecedor?.nome || '').toLowerCase();
    return produto.nome.toLowerCase().includes(termo) || obs.includes(termo) || fornecedor.includes(termo);
  });

  if (carregando) {
    return (
      <div className="produtos-container">
        <div className="loading">Carregando produtos…</div>
      </div>
    );
  }

  if (mostrarForm) {
    return (
      <div className="produtos-container">
        <div className="page-header mineracao-header">
          <div>
            <h2>{produtoEdicao ? 'Editar produto' : 'Minerar produto'}</h2>
            <p>Custo, preço, margem e anotação da decisão</p>
          </div>
          <button type="button" className="btn-voltar" onClick={fecharForm}>
            Voltar à lista
          </button>
        </div>
        <div className="mineracao-painel">
          <NovoProduto
            key={produtoEdicao ? `edit-${produtoEdicao.id}` : 'novo'}
            fornecedores={fornecedores}
            produto={produtoEdicao}
            onSucesso={handleSalvo}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="produtos-container">
      <div className="page-header mineracao-header">
        <div>
          <h2>Produtos</h2>
          <p>Compare margem, lucro e anotações da mineração</p>
        </div>
        <button type="button" onClick={abrirNovo} className="btn-novo">
          <IconPlus /> Novo produto
        </button>
      </div>

      <div className="lista-toolbar">
        <label htmlFor="busca-produtos" className="sr-only">Buscar produtos</label>
        <input
          id="busca-produtos"
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome, fornecedor ou observação"
        />
        <span className="lista-contagem">{produtosFiltrados.length} produto{produtosFiltrados.length === 1 ? '' : 's'}</span>
      </div>

      {produtos.length === 0 ? (
        <div className="empty-state">
          <h2>Nenhum produto minerado</h2>
          <p>Cadastre o primeiro para ver custo, margem sem ads e margem pós ADS lado a lado.</p>
          <button type="button" className="btn-novo" onClick={abrirNovo}>
            <IconPlus /> Minerar produto
          </button>
        </div>
      ) : produtosFiltrados.length === 0 ? (
        <div className="empty-state">
          <h2>Nada encontrado</h2>
          <p>Nenhum produto bate com “{busca}”.</p>
        </div>
      ) : (
        <div className="tabela-wrap">
          <table className="produtos-tabela">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Fornecedor</th>
                <th className="num">Custo</th>
                <th className="num">Venda</th>
                <th className="num">Margem</th>
                <th className="num">Pós ADS</th>
                <th>Situação</th>
                <th>Observação</th>
                <th className="acoes">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtosFiltrados.map((produto) => (
                <tr key={produto.id}>
                  <td>
                    <strong>{produto.nome}</strong>
                  </td>
                  <td>{produto.fornecedor?.nome || '—'}</td>
                  <td className="num">{formatarMoeda(produto.custo_unitario)}</td>
                  <td className="num">{formatarMoeda(produto.preco_venda)}</td>
                  <td className="num">
                    {formatarPercentual(produto.calculado.margem_sem_ads ?? produto.calculado.margem_com_ads)}
                    <small>{formatarMoeda(produto.calculado.lucro_sem_ads ?? produto.calculado.lucro_com_ads)}</small>
                  </td>
                  <td className="num destaque">
                    {formatarPercentual(produto.calculado.margem_com_ads)}
                    <small>{formatarMoeda(produto.calculado.lucro_com_ads)}</small>
                  </td>
                  <td>
                    <span className={classeBadge(produto.calculado.classificacao)}>
                      {produto.calculado.classificacao}
                    </span>
                  </td>
                  <td className="obs">
                    {produto.observacao?.trim() ? produto.observacao : '—'}
                  </td>
                  <td className="acoes">
                    <button type="button" className="btn-icone" onClick={() => handleEditar(produto)}>
                      <IconPencil /> Editar
                    </button>
                    <button type="button" className="btn-icone perigo" onClick={() => handleExcluir(produto.id)}>
                      <IconTrash /> Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
