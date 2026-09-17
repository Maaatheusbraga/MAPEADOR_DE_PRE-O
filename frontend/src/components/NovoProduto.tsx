import React, { useState, useEffect } from 'react';
import { produtosAPI, configuracoesAPI } from '../services/api';
import './NovoProduto.css';

interface Fornecedor {
  id: number;
  nome: string;
  prioritario?: boolean;
}

interface ProdutoEdicao {
  id: number;
  nome: string;
  custo_unitario: number;
  preco_venda: number;
  fornecedor_id?: number;
  fornecedor?: { id: number; nome: string };
}

interface Props {
  fornecedores: Fornecedor[];
  onSucesso: () => void;
  produto?: ProdutoEdicao | null;
}

export function NovoProduto({ fornecedores, onSucesso, produto = null }: Props) {
  const editando = Boolean(produto);
  const [nome, setNome] = useState(produto?.nome || '');
  const [fornecedorId, setFornecedorId] = useState(
    produto ? String(produto.fornecedor_id || produto.fornecedor?.id || '') : ''
  );
  const [custoUnitario, setCustoUnitario] = useState(
    produto ? String(produto.custo_unitario) : ''
  );
  const [precoVenda, setPrecoVenda] = useState(
    produto ? String(produto.preco_venda) : ''
  );
  const [calculoPrevio, setCalculoPrevio] = useState<any>(null);
  const [configuracoes, setConfiguracoes] = useState<any>(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  
  // NOVO: Estados para valores customizáveis
  const [editandoValores, setEditandoValores] = useState(false);
  const [tacos, setTacos] = useState<number | null>(null);
  const [taxaComissao, setTaxaComissao] = useState<number | null>(null);
  const [custoPrep, setCustoPrep] = useState<number | null>(null);
  const [freteFba, setFreteFba] = useState<number | null>(null);
  const [aliquotaImposto, setAliquotaImposto] = useState<number | null>(null);

  useEffect(() => {
    carregarConfiguracoes();
  }, []);

  const carregarConfiguracoes = async () => {
    try {
      const config = await configuracoesAPI.obter();
      setConfiguracoes(config.premissas);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const numeroOuPadrao = (valor: number | null, padrao: number) => {
    return valor !== null && Number.isFinite(valor) ? valor : padrao;
  };

  const lerNumero = (valor: string): number | null => {
    if (valor.trim() === '') return null;
    const n = Number(valor);
    return Number.isFinite(n) ? n : null;
  };

  useEffect(() => {
    if (!custoUnitario || !precoVenda || !configuracoes) {
      setCalculoPrevio(null);
      return;
    }

    const custo = parseFloat(custoUnitario);
    const preco = parseFloat(precoVenda);

    if (!(custo > 0 && preco > 0 && preco > custo)) {
      setCalculoPrevio(null);
      return;
    }

    const config = {
      tacos: numeroOuPadrao(tacos, configuracoes.tacos),
      taxa_comissao: numeroOuPadrao(taxaComissao, configuracoes.taxa_comissao),
      custo_prep: numeroOuPadrao(custoPrep, configuracoes.custo_prep),
      frete_fba: numeroOuPadrao(freteFba, configuracoes.frete_fba),
      aliquota_imposto: numeroOuPadrao(aliquotaImposto, configuracoes.aliquota_imposto),
    };

    const comissao = preco * config.taxa_comissao;
    const prep = config.custo_prep;
    const frete = config.frete_fba;
    const impostos = preco * config.aliquota_imposto;
    const ads = preco * config.tacos;
    const custoSemAds = custo + comissao + prep + frete + impostos;
    const custoTotal = custoSemAds + ads;
    const lucroSemAds = preco - custoSemAds;
    const margemSemAds = lucroSemAds / preco;
    const lucro = preco - custoTotal;
    const margem = lucro / preco;

    let classificacao = '';
    if (margem >= 0.25) classificacao = 'EXCELENTE';
    else if (margem >= 0.15) classificacao = 'BOM';
    else if (margem >= 0.05) classificacao = 'MARGINAL';
    else classificacao = 'PREJUÍZO';

    setCalculoPrevio({
      comissao,
      prep,
      frete,
      impostos,
      ads,
      custoTotal,
      lucroSemAds,
      margemSemAds,
      lucro,
      margem,
      classificacao,
      lucrativo: lucro > 0,
      config,
    });
  }, [custoUnitario, precoVenda, configuracoes, tacos, taxaComissao, custoPrep, freteFba, aliquotaImposto]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!nome.trim()) {
      setErro('Nome do produto é obrigatório');
      return;
    }

    if (!fornecedorId) {
      setErro('Selecione um fornecedor');
      return;
    }

    const custo = parseFloat(custoUnitario);
    const preco = parseFloat(precoVenda);

    if (isNaN(custo) || custo <= 0) {
      setErro('Custo unitário inválido');
      return;
    }

    if (isNaN(preco) || preco <= 0) {
      setErro('Preço de venda inválido');
      return;
    }

    if (preco <= custo) {
      setErro('Preço de venda deve ser maior que o custo');
      return;
    }

    setCarregando(true);

    try {
      const dados = {
        nome: nome.trim(),
        fornecedor_id: parseInt(fornecedorId),
        custo_unitario: custo,
        preco_venda: preco,
      };

      if (editando && produto) {
        await produtosAPI.atualizar(produto.id, dados);
      } else {
        await produtosAPI.criar(dados);
      }

      onSucesso();
    } catch (error: any) {
      setErro(error.response?.data?.detail || (editando ? 'Erro ao atualizar produto' : 'Erro ao criar produto'));
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

  const getClassificacaoColor = (classificacao: string) => {
    switch (classificacao) {
      case 'EXCELENTE': return '#4caf50';
      case 'BOM': return '#2196f3';
      case 'MARGINAL': return '#ff9800';
      case 'PREJUÍZO': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  return (
    <div className="novo-produto">
      <h2>{editando ? '✏️ Editar Produto' : '➕ Novo Produto'}</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome do Produto *</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Tábua Inox Premium"
            required
          />
        </div>

        <div className="form-group">
          <label>Fornecedor *</label>
          <select
            value={fornecedorId}
            onChange={(e) => setFornecedorId(e.target.value)}
            required
          >
            <option value="">Selecione um fornecedor</option>
            {fornecedores
              .sort((a, b) => {
                // Prioritários primeiro
                if (a.prioritario && !b.prioritario) return -1;
                if (!a.prioritario && b.prioritario) return 1;
                return a.nome.localeCompare(b.nome);
              })
              .map((fornecedor) => (
                <option key={fornecedor.id} value={fornecedor.id}>
                  {fornecedor.nome} {fornecedor.prioritario ? '⭐' : ''}
                </option>
              ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Custo Unitário (R$) *</label>
            <input
              type="number"
              step="0.01"
              value={custoUnitario}
              onChange={(e) => setCustoUnitario(e.target.value)}
              placeholder="Ex: 12.50"
              required
            />
          </div>

          <div className="form-group">
            <label>Preço de Venda (R$) *</label>
            <input
              type="number"
              step="0.01"
              value={precoVenda}
              onChange={(e) => setPrecoVenda(e.target.value)}
              placeholder="Ex: 33.90"
              required
            />
          </div>
        </div>

        {/* Cálculo Prévio em Tempo Real */}
        {calculoPrevio && (
          <div className="calculo-previo">
            <div className="calculo-header-row">
              <h3>📊 Cálculo Prévio (em tempo real)</h3>
              <button
                type="button"
                onClick={() => setEditandoValores(!editandoValores)}
                className="btn-toggle-edit"
              >
                {editandoValores ? '🔒 Travar Valores' : '✏️ Editar Valores'}
              </button>
            </div>

            <div className="calculo-header">
              <span 
                className="badge"
                style={{ backgroundColor: getClassificacaoColor(calculoPrevio.classificacao) }}
              >
                {calculoPrevio.classificacao}
              </span>
              <span className={calculoPrevio.lucrativo ? 'status-ok' : 'status-erro'}>
                {calculoPrevio.lucrativo ? '✅ LUCRATIVO' : '❌ PREJUÍZO'}
              </span>
            </div>

            <div className="calculo-detalhes">
              {/* Comissão */}
              <div className="calculo-item editable">
                <div className="item-label">
                  <span>Comissão:</span>
                  {editandoValores && (
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={taxaComissao !== null ? taxaComissao : configuracoes.taxa_comissao}
                      onChange={(e) => setTaxaComissao(lerNumero(e.target.value))}
                      className="edit-input small"
                      placeholder="%"
                    />
                  )}
                  {editandoValores && <small>({((taxaComissao !== null ? taxaComissao : configuracoes.taxa_comissao) * 100).toFixed(1)}%)</small>}
                </div>
                <span>{formatarMoeda(calculoPrevio.comissao)}</span>
              </div>

              {/* Prep */}
              <div className="calculo-item editable">
                <div className="item-label">
                  <span>Prep:</span>
                  {editandoValores && (
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={custoPrep !== null ? custoPrep : configuracoes.custo_prep}
                      onChange={(e) => setCustoPrep(lerNumero(e.target.value))}
                      className="edit-input small"
                      placeholder="R$"
                    />
                  )}
                </div>
                <span>{formatarMoeda(calculoPrevio.prep)}</span>
              </div>

              {/* Frete FBA */}
              <div className="calculo-item editable">
                <div className="item-label">
                  <span>Frete FBA:</span>
                  {editandoValores && (
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={freteFba !== null ? freteFba : configuracoes.frete_fba}
                      onChange={(e) => setFreteFba(lerNumero(e.target.value))}
                      className="edit-input small"
                      placeholder="R$"
                    />
                  )}
                </div>
                <span>{formatarMoeda(calculoPrevio.frete)}</span>
              </div>

              {/* Impostos */}
              <div className="calculo-item editable">
                <div className="item-label">
                  <span>Impostos:</span>
                  {editandoValores && (
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={aliquotaImposto !== null ? aliquotaImposto : configuracoes.aliquota_imposto}
                      onChange={(e) => setAliquotaImposto(lerNumero(e.target.value))}
                      className="edit-input small"
                      placeholder="%"
                    />
                  )}
                  {editandoValores && <small>({((aliquotaImposto !== null ? aliquotaImposto : configuracoes.aliquota_imposto) * 100).toFixed(1)}%)</small>}
                </div>
                <span>{formatarMoeda(calculoPrevio.impostos)}</span>
              </div>

              {/* ADS (TACOS) */}
              <div className="calculo-item editable">
                <div className="item-label">
                  <span>ADS (TACOS):</span>
                  {editandoValores && (
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={tacos !== null ? tacos : configuracoes.tacos}
                      onChange={(e) => setTacos(lerNumero(e.target.value))}
                      className="edit-input small"
                      placeholder="%"
                    />
                  )}
                  {editandoValores && <small>({((tacos !== null ? tacos : configuracoes.tacos) * 100).toFixed(1)}%)</small>}
                </div>
                <span>{formatarMoeda(calculoPrevio.ads)}</span>
              </div>

              <div className="calculo-item total">
                <span>Custo Total:</span>
                <span>{formatarMoeda(calculoPrevio.custoTotal)}</span>
              </div>
            </div>

            {editandoValores && (
              <div className="edit-info">
                💡 <strong>Editando valores:</strong> Estes valores serão usados apenas para este produto. 
                Deixe em branco para usar valores padrão das configurações.
              </div>
            )}

            <div className="calculo-resultados">
              <div className="resultado-final">
                <div className="resultado-titulo">Margem de Lucro</div>
                <div className="resultado-valor">{formatarPercentual(calculoPrevio.margemSemAds)}</div>
                <div className="resultado-sub">{formatarMoeda(calculoPrevio.lucroSemAds)}</div>
              </div>
              <div className="resultado-final destaque-ads">
                <div className="resultado-titulo">Margem pós ADS</div>
                <div className="resultado-valor">{formatarPercentual(calculoPrevio.margem)}</div>
                <div className="resultado-sub">{formatarMoeda(calculoPrevio.lucro)}</div>
              </div>
            </div>
          </div>
        )}

        {erro && <div className="error-message">{erro}</div>}

        <button type="submit" className="btn-primary" disabled={carregando}>
          {carregando ? 'Salvando...' : editando ? '💾 Salvar Alterações' : '💾 Salvar Produto'}
        </button>
      </form>
    </div>
  );
}
