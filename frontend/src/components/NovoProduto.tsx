import React, { useState, useEffect } from 'react';
import { produtosAPI, configuracoesAPI } from '../services/api';
import './NovoProduto.css';

interface Fornecedor {
  id: number;
  nome: string;
  prioritario?: boolean;
}

interface Props {
  fornecedores: Fornecedor[];
  onSucesso: () => void;
}

export function NovoProduto({ fornecedores, onSucesso }: Props) {
  const [nome, setNome] = useState('');
  const [fornecedorId, setFornecedorId] = useState('');
  const [custoUnitario, setCustoUnitario] = useState('');
  const [precoVenda, setPrecoVenda] = useState('');
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

  // Calcula em tempo real quando o usuário digita
  useEffect(() => {
    if (custoUnitario && precoVenda && configuracoes) {
      const custo = parseFloat(custoUnitario);
      const preco = parseFloat(precoVenda);

      if (custo > 0 && preco > 0 && preco > custo) {
        calcularPrevio(custo, preco);
      } else {
        setCalculoPrevio(null);
      }
    } else {
      setCalculoPrevio(null);
    }
  }, [custoUnitario, precoVenda, configuracoes]);

  const calcularPrevio = (custo: number, preco: number) => {
    // Usar valores customizados ou padrão das configurações
    const config = {
      tacos: tacos !== null ? tacos : configuracoes.tacos,
      taxa_comissao: taxaComissao !== null ? taxaComissao : configuracoes.taxa_comissao,
      custo_prep: custoPrep !== null ? custoPrep : configuracoes.custo_prep,
      frete_fba: freteFba !== null ? freteFba : configuracoes.frete_fba,
      aliquota_imposto: aliquotaImposto !== null ? aliquotaImposto : configuracoes.aliquota_imposto,
    };
    
    const comissao = preco * config.taxa_comissao;
    const prep = config.custo_prep;
    const frete = config.frete_fba;
    const impostos = preco * config.aliquota_imposto;
    const ads = preco * config.tacos;

    const custoTotal = custo + comissao + prep + frete + impostos + ads;
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
      lucro,
      margem,
      classificacao,
      lucrativo: lucro > 0,
      config, // Guardar config usada
    });
  };

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
      await produtosAPI.criar({
        nome: nome.trim(),
        fornecedor_id: parseInt(fornecedorId),
        custo_unitario: custo,
        preco_venda: preco,
      });

      onSucesso();
    } catch (error: any) {
      setErro(error.response?.data?.detail || 'Erro ao criar produto');
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
      <h2>➕ Novo Produto</h2>

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
                      onChange={(e) => {
                        setTaxaComissao(parseFloat(e.target.value));
                        if (custoUnitario && precoVenda) {
                          setTimeout(() => calcularPrevio(parseFloat(custoUnitario), parseFloat(precoVenda)), 100);
                        }
                      }}
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
                      onChange={(e) => {
                        setCustoPrep(parseFloat(e.target.value));
                        if (custoUnitario && precoVenda) {
                          setTimeout(() => calcularPrevio(parseFloat(custoUnitario), parseFloat(precoVenda)), 100);
                        }
                      }}
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
                      onChange={(e) => {
                        setFreteFba(parseFloat(e.target.value));
                        if (custoUnitario && precoVenda) {
                          setTimeout(() => calcularPrevio(parseFloat(custoUnitario), parseFloat(precoVenda)), 100);
                        }
                      }}
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
                      onChange={(e) => {
                        setAliquotaImposto(parseFloat(e.target.value));
                        if (custoUnitario && precoVenda) {
                          setTimeout(() => calcularPrevio(parseFloat(custoUnitario), parseFloat(precoVenda)), 100);
                        }
                      }}
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
                      onChange={(e) => {
                        setTacos(parseFloat(e.target.value));
                        if (custoUnitario && precoVenda) {
                          setTimeout(() => calcularPrevio(parseFloat(custoUnitario), parseFloat(precoVenda)), 100);
                        }
                      }}
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
                <div className="resultado-titulo">Margem (com ADS)</div>
                <div className="resultado-valor">{formatarPercentual(calculoPrevio.margem)}</div>
              </div>
              <div className="resultado-final">
                <div className="resultado-titulo">Lucro (com ADS)</div>
                <div className="resultado-valor">{formatarMoeda(calculoPrevio.lucro)}</div>
              </div>
            </div>
          </div>
        )}

        {erro && <div className="error-message">{erro}</div>}

        <button type="submit" className="btn-primary" disabled={carregando}>
          {carregando ? 'Salvando...' : '💾 Salvar Produto'}
        </button>
      </form>
    </div>
  );
}
