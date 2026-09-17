import React, { useState, useEffect } from 'react';
import './DREPage.css';

interface DREMes {
  mes: string;
  receitas: number;
  custos_produtos: number;
  custos_fixos: number;
  lucro_bruto: number;
  lucro_liquido: number;
}

export function DREPage() {
  const [meses, setMeses] = useState<DREMes[]>([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  
  // Form states
  const [mes, setMes] = useState('');
  const [receitas, setReceitas] = useState('');
  const [custosProdutos, setCustosProdutos] = useState('');
  const [custosFixos, setCustosFixos] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarDRE();
  }, []);

  const carregarDRE = () => {
    // Inicia vazio - usuário adiciona seus próprios períodos
    setMeses([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    const receitasNum = parseFloat(receitas);
    const custosProdsNum = parseFloat(custosProdutos);
    const custosFixosNum = parseFloat(custosFixos);

    if (isNaN(receitasNum) || isNaN(custosProdsNum) || isNaN(custosFixosNum)) {
      setErro('Todos os valores devem ser números válidos');
      return;
    }

    const lucroBruto = receitasNum - custosProdsNum;
    const lucroLiquido = lucroBruto - custosFixosNum;

    const novoDRE: DREMes = {
      mes,
      receitas: receitasNum,
      custos_produtos: custosProdsNum,
      custos_fixos: custosFixosNum,
      lucro_bruto: lucroBruto,
      lucro_liquido: lucroLiquido,
    };

    setMeses([...meses, novoDRE]);
    limparForm();
    setMostrarForm(false);
  };

  const limparForm = () => {
    setMes('');
    setReceitas('');
    setCustosProdutos('');
    setCustosFixos('');
    setErro('');
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  const formatarMes = (mesStr: string) => {
    const [ano, mes] = mesStr.split('-');
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${meses[parseInt(mes) - 1]}/${ano}`;
  };

  const totais = meses.reduce(
    (acc, m) => ({
      receitas: acc.receitas + m.receitas,
      custos_produtos: acc.custos_produtos + m.custos_produtos,
      custos_fixos: acc.custos_fixos + m.custos_fixos,
      lucro_bruto: acc.lucro_bruto + m.lucro_bruto,
      lucro_liquido: acc.lucro_liquido + m.lucro_liquido,
    }),
    { receitas: 0, custos_produtos: 0, custos_fixos: 0, lucro_bruto: 0, lucro_liquido: 0 }
  );

  return (
    <div className="dre-page">
      <div className="page-header">
        <div>
          <h2>📊 DRE - Demonstração de Resultados</h2>
          <p>Análise de receitas, custos e lucros por período</p>
        </div>
        <button onClick={() => setMostrarForm(true)} className="btn-novo">
          ➕ Adicionar Período
        </button>
      </div>

      {/* Cards de Resumo */}
      {meses.length > 0 && (
        <div className="dre-resumo">
          <div className="resumo-card receitas">
            <div className="card-icon">💰</div>
            <div className="card-content">
              <div className="card-label">Receitas Totais</div>
              <div className="card-value">{formatarMoeda(totais.receitas)}</div>
            </div>
          </div>

          <div className="resumo-card custos">
            <div className="card-icon">📦</div>
            <div className="card-content">
              <div className="card-label">Custos Totais</div>
              <div className="card-value">{formatarMoeda(totais.custos_produtos + totais.custos_fixos)}</div>
            </div>
          </div>

          <div className="resumo-card lucro">
            <div className="card-icon">📈</div>
            <div className="card-content">
              <div className="card-label">Lucro Líquido</div>
              <div className="card-value">{formatarMoeda(totais.lucro_liquido)}</div>
            </div>
          </div>

          <div className="resumo-card margem">
            <div className="card-icon">📊</div>
            <div className="card-content">
              <div className="card-label">Margem Líquida</div>
              <div className="card-value">
                {totais.receitas > 0 ? ((totais.lucro_liquido / totais.receitas) * 100).toFixed(1) + '%' : '0%'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabela DRE */}
      {meses.length > 0 ? (
        <div className="dre-table-container">
          <table className="dre-table">
            <thead>
              <tr>
                <th>Período</th>
                <th className="valor">Receitas</th>
                <th className="valor">Custos Produtos</th>
                <th className="valor">Custos Fixos</th>
                <th className="valor">Lucro Bruto</th>
                <th className="valor destaque">Lucro Líquido</th>
                <th className="valor">Margem %</th>
              </tr>
            </thead>
            <tbody>
              {meses.map((m, idx) => (
                <tr key={idx}>
                  <td><strong>{formatarMes(m.mes)}</strong></td>
                  <td className="valor positivo">{formatarMoeda(m.receitas)}</td>
                  <td className="valor negativo">{formatarMoeda(m.custos_produtos)}</td>
                  <td className="valor negativo">{formatarMoeda(m.custos_fixos)}</td>
                  <td className="valor">{formatarMoeda(m.lucro_bruto)}</td>
                  <td className={`valor destaque ${m.lucro_liquido >= 0 ? 'positivo' : 'negativo'}`}>
                    {formatarMoeda(m.lucro_liquido)}
                  </td>
                  <td className="valor">
                    {((m.lucro_liquido / m.receitas) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
              <tr className="total-row">
                <td><strong>TOTAL</strong></td>
                <td className="valor positivo"><strong>{formatarMoeda(totais.receitas)}</strong></td>
                <td className="valor negativo"><strong>{formatarMoeda(totais.custos_produtos)}</strong></td>
                <td className="valor negativo"><strong>{formatarMoeda(totais.custos_fixos)}</strong></td>
                <td className="valor"><strong>{formatarMoeda(totais.lucro_bruto)}</strong></td>
                <td className={`valor destaque ${totais.lucro_liquido >= 0 ? 'positivo' : 'negativo'}`}>
                  <strong>{formatarMoeda(totais.lucro_liquido)}</strong>
                </td>
                <td className="valor">
                  <strong>{totais.receitas > 0 ? ((totais.lucro_liquido / totais.receitas) * 100).toFixed(1) + '%' : '0%'}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>Nenhum período cadastrado</h3>
          <p>Clique em "Adicionar Período" para começar a registrar seus resultados</p>
        </div>
      )}

      {/* Modal Form */}
      {mostrarForm && (
        <div className="modal-overlay" onClick={() => setMostrarForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setMostrarForm(false)}>✕</button>
            
            <h2>➕ Adicionar Período - DRE</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Mês/Ano *</label>
                <input
                  type="month"
                  value={mes}
                  onChange={(e) => setMes(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>💰 Receitas (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={receitas}
                  onChange={(e) => setReceitas(e.target.value)}
                  placeholder="Ex: 50000.00"
                  required
                />
                <small>Total de vendas no período</small>
              </div>

              <div className="form-group">
                <label>📦 Custos dos Produtos (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={custosProdutos}
                  onChange={(e) => setCustosProdutos(e.target.value)}
                  placeholder="Ex: 30000.00"
                  required
                />
                <small>Custo total dos produtos vendidos (CMV)</small>
              </div>

              <div className="form-group">
                <label>🏢 Custos Fixos (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={custosFixos}
                  onChange={(e) => setCustosFixos(e.target.value)}
                  placeholder="Ex: 5000.00"
                  required
                />
                <small>Despesas operacionais (aluguel, salários, etc)</small>
              </div>

              {erro && <div className="error-message">{erro}</div>}

              <div className="form-actions">
                <button type="button" onClick={() => setMostrarForm(false)} className="btn-secondary">
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
