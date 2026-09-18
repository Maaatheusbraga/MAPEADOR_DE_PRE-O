import React, { useState, useEffect } from 'react';
import { fluxoCaixaAPI } from '../services/api';
import './FluxoCaixaPage.css';

interface Movimentacao {
  id: number;
  data: string;
  tipo: 'entrada' | 'saida';
  categoria: string;
  descricao: string;
  valor: number;
}

interface Passivo {
  id: number;
  descricao: string;
  valor: number;
  vencimento: string;
  pago: boolean;
}

export function FluxoCaixaPage() {
  const [saldoCaixa, setSaldoCaixa] = useState(0);
  const [saldoBanco, setSaldoBanco] = useState(0);
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [passivos, setPassivos] = useState<Passivo[]>([]);
  const [mostrarFormMov, setMostrarFormMov] = useState(false);
  const [mostrarFormPass, setMostrarFormPass] = useState(false);
  const [visualizacao, setVisualizacao] = useState<'movimentacoes' | 'passivos'>('movimentacoes');

  // Form Movimentação
  const [data, setData] = useState('');
  const [tipo, setTipo] = useState<'entrada' | 'saida'>('entrada');
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');

  // Form Passivo
  const [descricaoPass, setDescricaoPass] = useState('');
  const [valorPass, setValorPass] = useState('');
  const [vencimento, setVencimento] = useState('');

  const [erro, setErro] = useState('');
  const [proximoIdMov, setProximoIdMov] = useState(1);
  const [proximoIdPass, setProximoIdPass] = useState(1);

  useEffect(() => {
    carregarDados();
  }, []);

  const persistir = async (payload: {
    saldoCaixa: number;
    saldoBanco: number;
    movimentacoes: Movimentacao[];
    passivos: Passivo[];
    proximoIdMov: number;
    proximoIdPass: number;
  }) => {
    await fluxoCaixaAPI.salvar({
      saldo_atual: {
        caixa: payload.saldoCaixa,
        banco: payload.saldoBanco,
        total: payload.saldoCaixa + payload.saldoBanco,
      },
      movimentacoes: payload.movimentacoes,
      passivos: payload.passivos,
      proximo_id_movimentacao: payload.proximoIdMov,
      proximo_id_passivo: payload.proximoIdPass,
    });
  };

  const carregarDados = async () => {
    try {
      const data = await fluxoCaixaAPI.obter();
      setSaldoCaixa(data.saldo_atual?.caixa || 0);
      setSaldoBanco(data.saldo_atual?.banco || 0);
      setMovimentacoes(data.movimentacoes || []);
      setPassivos(data.passivos || []);
      setProximoIdMov(data.proximo_id_movimentacao || 1);
      setProximoIdPass(data.proximo_id_passivo || 1);
    } catch (error) {
      console.error('Erro ao carregar fluxo de caixa:', error);
    }
  };

  const handleSubmitMov = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    const valorNum = parseFloat(valor);
    if (isNaN(valorNum) || valorNum <= 0) {
      setErro('Valor inválido');
      return;
    }

    const novaMov: Movimentacao = {
      id: proximoIdMov,
      data,
      tipo,
      categoria,
      descricao,
      valor: valorNum,
    };

    const novasMovs = [novaMov, ...movimentacoes];
    const novoCaixa = tipo === 'entrada' ? saldoCaixa + valorNum : saldoCaixa - valorNum;
    const novoId = proximoIdMov + 1;

    try {
      await persistir({
        saldoCaixa: novoCaixa,
        saldoBanco,
        movimentacoes: novasMovs,
        passivos,
        proximoIdMov: novoId,
        proximoIdPass,
      });
      setMovimentacoes(novasMovs);
      setSaldoCaixa(novoCaixa);
      setProximoIdMov(novoId);
      limparFormMov();
      setMostrarFormMov(false);
    } catch (error) {
      setErro('Não foi possível salvar a movimentação');
    }
  };

  const handleSubmitPass = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    const valorNum = parseFloat(valorPass);
    if (isNaN(valorNum) || valorNum <= 0) {
      setErro('Valor inválido');
      return;
    }

    const novoPass: Passivo = {
      id: proximoIdPass,
      descricao: descricaoPass,
      valor: valorNum,
      vencimento,
      pago: false,
    };

    const novosPassivos = [...passivos, novoPass];
    const novoId = proximoIdPass + 1;

    try {
      await persistir({
        saldoCaixa,
        saldoBanco,
        movimentacoes,
        passivos: novosPassivos,
        proximoIdMov,
        proximoIdPass: novoId,
      });
      setPassivos(novosPassivos);
      setProximoIdPass(novoId);
      limparFormPass();
      setMostrarFormPass(false);
    } catch (error) {
      setErro('Não foi possível salvar o passivo');
    }
  };

  const marcarComoPago = async (id: number) => {
    const novosPassivos = passivos.map(p =>
      p.id === id ? { ...p, pago: true } : p
    );
    try {
      await persistir({
        saldoCaixa,
        saldoBanco,
        movimentacoes,
        passivos: novosPassivos,
        proximoIdMov,
        proximoIdPass,
      });
      setPassivos(novosPassivos);
    } catch (error) {
      setErro('Não foi possível atualizar o passivo');
    }
  };

  const excluirMovimentacao = async (id: number) => {
    if (!window.confirm('Excluir esta movimentação?')) return;
    const mov = movimentacoes.find(m => m.id === id);
    if (!mov) return;
    const novoCaixa = mov.tipo === 'entrada' ? saldoCaixa - mov.valor : saldoCaixa + mov.valor;
    const novasMovs = movimentacoes.filter(m => m.id !== id);
    try {
      await persistir({
        saldoCaixa: novoCaixa,
        saldoBanco,
        movimentacoes: novasMovs,
        passivos,
        proximoIdMov,
        proximoIdPass,
      });
      setSaldoCaixa(novoCaixa);
      setMovimentacoes(novasMovs);
    } catch (error) {
      setErro('Não foi possível excluir a movimentação');
    }
  };

  const excluirPassivo = async (id: number) => {
    if (!window.confirm('Excluir este passivo?')) return;
    const novosPassivos = passivos.filter(p => p.id !== id);
    try {
      await persistir({
        saldoCaixa,
        saldoBanco,
        movimentacoes,
        passivos: novosPassivos,
        proximoIdMov,
        proximoIdPass,
      });
      setPassivos(novosPassivos);
    } catch (error) {
      setErro('Não foi possível excluir o passivo');
    }
  };

  const limparFormMov = () => {
    setData('');
    setTipo('entrada');
    setCategoria('');
    setDescricao('');
    setValor('');
    setErro('');
  };

  const limparFormPass = () => {
    setDescricaoPass('');
    setValorPass('');
    setVencimento('');
    setErro('');
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  const formatarData = (dataStr: string) => {
    const [ano, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const saldoTotal = saldoCaixa + saldoBanco;
  const totalPassivos = passivos.filter(p => !p.pago).reduce((acc, p) => acc + p.valor, 0);
  const saldoProjetado = saldoTotal - totalPassivos;

  const totalEntradas = movimentacoes.filter(m => m.tipo === 'entrada').reduce((acc, m) => acc + m.valor, 0);
  const totalSaidas = movimentacoes.filter(m => m.tipo === 'saida').reduce((acc, m) => acc + m.valor, 0);

  return (
    <div className="fluxo-caixa-page">
      <div className="page-header">
        <div>
          <h2>Fluxo de Caixa</h2>
          <p>Controle de entradas, saídas e saldo</p>
        </div>
        <div className="header-actions">
          <button onClick={() => setMostrarFormMov(true)} className="btn-novo">
            Nova movimentação
          </button>
          <button onClick={() => setMostrarFormPass(true)} className="btn-secondary-action">
            Novo passivo
          </button>
        </div>
      </div>

      {/* Cards de Saldo */}
      <div className="saldo-cards">
        <div className="saldo-card caixa">
          <div className="card-icon">💵</div>
          <div className="card-content">
            <div className="card-label">Caixa</div>
            <div className="card-value">{formatarMoeda(saldoCaixa)}</div>
          </div>
        </div>

        <div className="saldo-card banco">
          <div className="card-icon">🏦</div>
          <div className="card-content">
            <div className="card-label">Banco</div>
            <div className="card-value">{formatarMoeda(saldoBanco)}</div>
          </div>
        </div>

        <div className="saldo-card total">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <div className="card-label">Saldo Total</div>
            <div className="card-value">{formatarMoeda(saldoTotal)}</div>
          </div>
        </div>

        <div className="saldo-card passivos">
          <div className="card-icon">⚠️</div>
          <div className="card-content">
            <div className="card-label">Passivos Pendentes</div>
            <div className="card-value negativo">{formatarMoeda(totalPassivos)}</div>
          </div>
        </div>

        <div className={`saldo-card projetado ${saldoProjetado >= 0 ? 'positivo' : 'alerta'}`}>
          <div className="card-icon">{saldoProjetado >= 0 ? '📈' : '⚠️'}</div>
          <div className="card-content">
            <div className="card-label">Saldo Projetado</div>
            <div className="card-value">{formatarMoeda(saldoProjetado)}</div>
            <div className="card-hint">(após pagar passivos)</div>
          </div>
        </div>
      </div>

      {/* Toggle de Visualização */}
      <div className="view-toggle">
        <button
          className={visualizacao === 'movimentacoes' ? 'active' : ''}
          onClick={() => setVisualizacao('movimentacoes')}
        >
          📊 Movimentações ({movimentacoes.length})
        </button>
        <button
          className={visualizacao === 'passivos' ? 'active' : ''}
          onClick={() => setVisualizacao('passivos')}
        >
          📋 Passivos ({passivos.filter(p => !p.pago).length})
        </button>
      </div>

      {/* Movimentações */}
      {visualizacao === 'movimentacoes' && (
        <div className="movimentacoes-section">
          <div className="section-header">
            <h3>Movimentações</h3>
            <div className="resumo-mov">
              <span className="entrada">Entradas: {formatarMoeda(totalEntradas)}</span>
              <span className="saida">Saídas: {formatarMoeda(totalSaidas)}</span>
              <span className="saldo">Saldo: {formatarMoeda(totalEntradas - totalSaidas)}</span>
            </div>
          </div>

          {movimentacoes.length > 0 ? (
            <div className="movimentacoes-list">
              {movimentacoes.map((mov) => (
                <div key={mov.id} className={`mov-card ${mov.tipo}`}>
                  <div className="mov-icon">
                    {mov.tipo === 'entrada' ? '⬆️' : '⬇️'}
                  </div>
                  <div className="mov-info">
                    <div className="mov-header">
                      <strong>{mov.descricao}</strong>
                      <span className="mov-categoria">{mov.categoria}</span>
                    </div>
                    <div className="mov-data">{formatarData(mov.data)}</div>
                  </div>
                  <div className={`mov-valor ${mov.tipo}`}>
                    {mov.tipo === 'entrada' ? '+' : '-'} {formatarMoeda(mov.valor)}
                  </div>
                  <button 
                    onClick={() => excluirMovimentacao(mov.id)} 
                    className="btn-excluir-mov"
                    title="Excluir movimentação"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-section">
              <p>Nenhuma movimentação registrada</p>
            </div>
          )}
        </div>
      )}

      {/* Passivos */}
      {visualizacao === 'passivos' && (
        <div className="passivos-section">
          <h3>Passivos (Contas a Pagar)</h3>

          {passivos.length > 0 ? (
            <div className="passivos-list">
              {passivos.map((pass) => (
                <div key={pass.id} className={`passivo-card ${pass.pago ? 'pago' : 'pendente'}`}>
                  <div className="passivo-info">
                    <div className="passivo-header">
                      <strong>{pass.descricao}</strong>
                      {pass.pago && <span className="badge-pago">✅ PAGO</span>}
                    </div>
                    <div className="passivo-details">
                      <span>Vencimento: {formatarData(pass.vencimento)}</span>
                    </div>
                  </div>
                  <div className="passivo-valor">
                    {formatarMoeda(pass.valor)}
                  </div>
                  <div className="passivo-actions">
                    {!pass.pago && (
                      <button onClick={() => marcarComoPago(pass.id)} className="btn-pagar">
                        ✅ Pagar
                      </button>
                    )}
                    <button onClick={() => excluirPassivo(pass.id)} className="btn-excluir-small">
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-section">
              <p>Nenhum passivo registrado</p>
            </div>
          )}
        </div>
      )}

      {/* Modal Movimentação */}
      {mostrarFormMov && (
        <div className="modal-overlay" onClick={() => setMostrarFormMov(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setMostrarFormMov(false)}>✕</button>
            
            <h2>➕ Nova Movimentação</h2>

            <form onSubmit={handleSubmitMov}>
              <div className="form-group">
                <label>Data *</label>
                <input
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Tipo *</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      value="entrada"
                      checked={tipo === 'entrada'}
                      onChange={(e) => setTipo(e.target.value as 'entrada')}
                    />
                    <span className="entrada-label">⬆️ Entrada</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      value="saida"
                      checked={tipo === 'saida'}
                      onChange={(e) => setTipo(e.target.value as 'saida')}
                    />
                    <span className="saida-label">⬇️ Saída</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Categoria *</label>
                <select value={categoria} onChange={(e) => setCategoria(e.target.value)} required>
                  <option value="">Selecione...</option>
                  {tipo === 'entrada' ? (
                    <>
                      <option value="Vendas">Vendas</option>
                      <option value="Investimento">Investimento</option>
                      <option value="Outros">Outros</option>
                    </>
                  ) : (
                    <>
                      <option value="Fornecedor">Fornecedor</option>
                      <option value="Prep Center">Prep Center</option>
                      <option value="Frete">Frete</option>
                      <option value="Impostos">Impostos</option>
                      <option value="Despesas">Despesas</option>
                      <option value="Outros">Outros</option>
                    </>
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>Descrição *</label>
                <input
                  type="text"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Ex: Venda produtos Amazon"
                  required
                />
              </div>

              <div className="form-group">
                <label>Valor (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  placeholder="Ex: 5000.00"
                  required
                />
              </div>

              {erro && <div className="error-message">{erro}</div>}

              <div className="form-actions">
                <button type="button" onClick={() => setMostrarFormMov(false)} className="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  ➕ Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Passivo */}
      {mostrarFormPass && (
        <div className="modal-overlay" onClick={() => setMostrarFormPass(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setMostrarFormPass(false)}>✕</button>
            
            <h2>📋 Novo Passivo</h2>

            <form onSubmit={handleSubmitPass}>
              <div className="form-group">
                <label>Descrição *</label>
                <input
                  type="text"
                  value={descricaoPass}
                  onChange={(e) => setDescricaoPass(e.target.value)}
                  placeholder="Ex: Fornecedor Utimix - Fatura #456"
                  required
                />
              </div>

              <div className="form-group">
                <label>Valor (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={valorPass}
                  onChange={(e) => setValorPass(e.target.value)}
                  placeholder="Ex: 8000.00"
                  required
                />
              </div>

              <div className="form-group">
                <label>Vencimento *</label>
                <input
                  type="date"
                  value={vencimento}
                  onChange={(e) => setVencimento(e.target.value)}
                  required
                />
              </div>

              {erro && <div className="error-message">{erro}</div>}

              <div className="form-actions">
                <button type="button" onClick={() => setMostrarFormPass(false)} className="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  ➕ Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
