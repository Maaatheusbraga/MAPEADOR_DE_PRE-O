import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { produtosAPI, fornecedoresAPI } from '../services/api';
import { NovoProduto } from '../components/NovoProduto';
import { IconPlus, IconPencil, IconTrash, IconCopy, IconDownload } from '../components/Icons';
import './ProdutosPage.css';

type Decisao = 'analise' | 'vender' | 'descartado';
type Filtro = 'todos' | 'lucrativo' | 'prejuizo' | 'vender' | 'descartado';
type ColunaOrdenacao = 'nome' | 'margem' | 'posAds' | 'decisao';

interface Produto {
  id: number;
  nome: string;
  custo_unitario: number;
  preco_venda: number;
  observacao?: string;
  link_fornecedor?: string;
  decisao?: Decisao;
  fornecedor_id?: number;
  fornecedor?: { id: number; nome: string };
  premissas?: {
    tacos?: number;
    taxa_comissao?: number;
    custo_prep?: number;
    frete_fba?: number;
    aliquota_imposto?: number;
  };
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

function hrefSeguro(url?: string) {
  const link = (url || '').trim();
  if (!link) return '';
  const baixo = link.toLowerCase();
  if (baixo.startsWith('javascript:') || baixo.startsWith('data:') || baixo.startsWith('vbscript:')) {
    return '';
  }
  if (/^https?:\/\//i.test(link)) return link;
  return `https://${link}`;
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

function rotuloDecisao(decisao?: string) {
  if (decisao === 'vender') return 'Vou vender';
  if (decisao === 'descartado') return 'Descartado';
  return 'Em análise';
}

function csvCelula(valor: string | number) {
  const texto = String(valor ?? '');
  if (/[;"\n]/.test(texto)) {
    return `"${texto.replace(/"/g, '""')}"`;
  }
  return texto;
}

export function ProdutosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [produtoEdicao, setProdutoEdicao] = useState<Produto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [ordenarPor, setOrdenarPor] = useState<ColunaOrdenacao>('posAds');
  const [ordemDesc, setOrdemDesc] = useState(true);

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

  const handleDuplicar = async (produto: Produto) => {
    try {
      const nomeBase = produto.nome.replace(/\s*\(cópia\)\s*$/i, '').trim();
      await produtosAPI.criar({
        nome: `${nomeBase} (cópia)`.slice(0, 255),
        fornecedor_id: produto.fornecedor_id || produto.fornecedor?.id || 0,
        custo_unitario: produto.custo_unitario,
        preco_venda: produto.preco_venda,
        observacao: produto.observacao || '',
        link_fornecedor: produto.link_fornecedor || '',
        decisao: 'analise',
        tacos: produto.premissas?.tacos,
        taxa_comissao: produto.premissas?.taxa_comissao,
        custo_prep: produto.premissas?.custo_prep,
        frete_fba: produto.premissas?.frete_fba,
        aliquota_imposto: produto.premissas?.aliquota_imposto,
      });
      await carregarDados();
    } catch (error) {
      console.error('Erro ao duplicar produto:', error);
      alert('Erro ao duplicar produto');
    }
  };

  const handleDecisao = async (produto: Produto, decisao: Decisao) => {
    const anterior = produtos;
    setProdutos(produtos.map((item) => item.id === produto.id ? { ...item, decisao } : item));
    try {
      await produtosAPI.atualizar(produto.id, { decisao });
    } catch (error) {
      setProdutos(anterior);
      alert('Não foi possível salvar a decisão');
    }
  };

  const alternarOrdem = (coluna: ColunaOrdenacao) => {
    if (ordenarPor === coluna) {
      setOrdemDesc(!ordemDesc);
      return;
    }
    setOrdenarPor(coluna);
    setOrdemDesc(coluna !== 'nome');
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

  const produtosVisiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    const filtrados = produtos.filter((produto) => {
      if (filtro === 'lucrativo' && !produto.calculado.lucrativo) return false;
      if (filtro === 'prejuizo' && produto.calculado.lucrativo) return false;
      if (filtro === 'vender' && produto.decisao !== 'vender') return false;
      if (filtro === 'descartado' && produto.decisao !== 'descartado') return false;
      if (!termo) return true;
      const obs = (produto.observacao || '').toLowerCase();
      const link = (produto.link_fornecedor || '').toLowerCase();
      const fornecedor = (produto.fornecedor?.nome || '').toLowerCase();
      return produto.nome.toLowerCase().includes(termo) || obs.includes(termo) || link.includes(termo) || fornecedor.includes(termo);
    });

    const lista = [...filtrados].sort((a, b) => {
      let cmp = 0;
      if (ordenarPor === 'nome') cmp = a.nome.localeCompare(b.nome, 'pt-BR');
      if (ordenarPor === 'margem') {
        cmp = (a.calculado.margem_sem_ads ?? a.calculado.margem_com_ads) - (b.calculado.margem_sem_ads ?? b.calculado.margem_com_ads);
      }
      if (ordenarPor === 'posAds') cmp = a.calculado.margem_com_ads - b.calculado.margem_com_ads;
      if (ordenarPor === 'decisao') cmp = rotuloDecisao(a.decisao).localeCompare(rotuloDecisao(b.decisao), 'pt-BR');
      return ordemDesc ? -cmp : cmp;
    });
    return lista;
  }, [produtos, busca, filtro, ordenarPor, ordemDesc]);

  const exportarCsv = () => {
    const linhas = [
      ['Produto', 'Fornecedor', 'Custo', 'Venda', 'Margem', 'Lucro', 'Margem pos ADS', 'Lucro pos ADS', 'Situacao', 'Decisao', 'Link', 'Observacao'].join(';'),
      ...produtosVisiveis.map((produto) => [
        csvCelula(produto.nome),
        csvCelula(produto.fornecedor?.nome || ''),
        csvCelula(produto.custo_unitario.toFixed(2).replace('.', ',')),
        csvCelula(produto.preco_venda.toFixed(2).replace('.', ',')),
        csvCelula(((produto.calculado.margem_sem_ads ?? produto.calculado.margem_com_ads) * 100).toFixed(2).replace('.', ',')),
        csvCelula((produto.calculado.lucro_sem_ads ?? produto.calculado.lucro_com_ads).toFixed(2).replace('.', ',')),
        csvCelula((produto.calculado.margem_com_ads * 100).toFixed(2).replace('.', ',')),
        csvCelula(produto.calculado.lucro_com_ads.toFixed(2).replace('.', ',')),
        csvCelula(produto.calculado.classificacao),
        csvCelula(rotuloDecisao(produto.decisao)),
        csvCelula(produto.link_fornecedor || ''),
        csvCelula(produto.observacao || ''),
      ].join(';')),
    ];
    const blob = new Blob(['\uFEFF' + linhas.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mineracao-produtos.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const marcaOrdem = (coluna: ColunaOrdenacao) => {
    if (ordenarPor !== coluna) return '';
    return ordemDesc ? ' ↓' : ' ↑';
  };

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
          <p>Compare, decida e exporte a mineração</p>
        </div>
        <div className="header-acoes">
          {produtos.length > 0 && (
            <button type="button" className="btn-voltar" onClick={exportarCsv}>
              <IconDownload /> CSV
            </button>
          )}
          <button type="button" onClick={abrirNovo} className="btn-novo">
            <IconPlus /> Novo produto
          </button>
        </div>
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
        <span className="lista-contagem">{produtosVisiveis.length} produto{produtosVisiveis.length === 1 ? '' : 's'}</span>
      </div>

      {produtos.length > 0 && (
        <div className="filtros" role="group" aria-label="Filtrar produtos">
          {([
            ['todos', 'Todos'],
            ['lucrativo', 'Lucrativo'],
            ['prejuizo', 'Prejuízo'],
            ['vender', 'Vou vender'],
            ['descartado', 'Descartado'],
          ] as const).map(([id, rotulo]) => (
            <button
              key={id}
              type="button"
              className={filtro === id ? 'filtro ativo' : 'filtro'}
              onClick={() => setFiltro(id)}
            >
              {rotulo}
            </button>
          ))}
        </div>
      )}

      {produtos.length === 0 ? (
        <div className="empty-state">
          <h2>Nenhum produto minerado</h2>
          <p>Cadastre o primeiro para ver custo, margem sem ads e margem pós ADS lado a lado.</p>
          <button type="button" className="btn-novo" onClick={abrirNovo}>
            <IconPlus /> Minerar produto
          </button>
        </div>
      ) : produtosVisiveis.length === 0 ? (
        <div className="empty-state">
          <h2>Nada encontrado</h2>
          <p>Nenhum produto bate com o filtro ou a busca.</p>
        </div>
      ) : (
        <div className="tabela-wrap">
          <table className="produtos-tabela">
            <thead>
              <tr>
                <th className="col-produto">
                  <button type="button" className="th-sort" onClick={() => alternarOrdem('nome')}>
                    Produto{marcaOrdem('nome')}
                  </button>
                </th>
                <th className="num">Preços</th>
                <th className="num">
                  <button type="button" className="th-sort" onClick={() => alternarOrdem('posAds')}>
                    Margens{marcaOrdem('posAds')}
                  </button>
                </th>
                <th>Situação</th>
                <th>
                  <button type="button" className="th-sort" onClick={() => alternarOrdem('decisao')}>
                    Decisão{marcaOrdem('decisao')}
                  </button>
                </th>
                <th className="col-obs">Observação</th>
                <th className="acoes">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtosVisiveis.map((produto) => (
                <tr key={produto.id} className={produto.decisao === 'descartado' ? 'linha-descartada' : undefined}>
                  <td className="col-produto" data-label="Produto">
                    <strong className="nome-produto">{produto.nome}</strong>
                    <span className="meta-produto">
                      {produto.fornecedor?.nome || 'Sem fornecedor'}
                      {hrefSeguro(produto.link_fornecedor) && (
                        <>
                          {' · '}
                          <a
                            className="link-fornecedor"
                            href={hrefSeguro(produto.link_fornecedor)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Abrir no fornecedor
                          </a>
                        </>
                      )}
                    </span>
                  </td>
                  <td className="num" data-label="Preços">
                    <span className="celula-pilha">
                      <span><small>Custo</small> {formatarMoeda(produto.custo_unitario)}</span>
                      <span><small>Venda</small> {formatarMoeda(produto.preco_venda)}</span>
                    </span>
                  </td>
                  <td className="num" data-label="Margens">
                    <span className="celula-pilha">
                      <span>
                        <small>Sem ads</small>{' '}
                        {formatarPercentual(produto.calculado.margem_sem_ads ?? produto.calculado.margem_com_ads)}
                      </span>
                      <span className="destaque">
                        <small>Pós ADS</small>{' '}
                        {formatarPercentual(produto.calculado.margem_com_ads)}
                      </span>
                    </span>
                  </td>
                  <td data-label="Situação">
                    <span className={classeBadge(produto.calculado.classificacao)}>
                      {produto.calculado.classificacao}
                    </span>
                  </td>
                  <td data-label="Decisão">
                    <label className="sr-only" htmlFor={`decisao-${produto.id}`}>Decisão de {produto.nome}</label>
                    <select
                      id={`decisao-${produto.id}`}
                      className={`select-decisao decisao-${produto.decisao || 'analise'}`}
                      value={produto.decisao || 'analise'}
                      onChange={(e) => handleDecisao(produto, e.target.value as Decisao)}
                    >
                      <option value="analise">Em análise</option>
                      <option value="vender">Vou vender</option>
                      <option value="descartado">Descartado</option>
                    </select>
                  </td>
                  <td className="obs" data-label="Observação">
                    {produto.observacao?.trim() ? produto.observacao : '—'}
                  </td>
                  <td className="acoes" data-label="Ações">
                    <button type="button" className="btn-icone" onClick={() => handleEditar(produto)} title="Editar" aria-label={`Editar ${produto.nome}`}>
                      <IconPencil /> <span className="rotulo-acao">Editar</span>
                    </button>
                    <button type="button" className="btn-icone" onClick={() => handleDuplicar(produto)} title="Duplicar" aria-label={`Duplicar ${produto.nome}`}>
                      <IconCopy /> <span className="rotulo-acao">Duplicar</span>
                    </button>
                    <button type="button" className="btn-icone perigo" onClick={() => handleExcluir(produto.id)} title="Excluir" aria-label={`Excluir ${produto.nome}`}>
                      <IconTrash /> <span className="rotulo-acao">Excluir</span>
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
