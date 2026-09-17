import React, { useState, useEffect } from 'react';
import { configuracoesAPI } from '../services/api';
import './ConfiguracoesPage.css';

export function ConfiguracoesPage() {
  const [premissas, setPremissas] = useState({
    tacos: 0.05,
    taxa_comissao: 0.05,
    custo_prep: 1.30,
    frete_fba: 6.00,
    aliquota_imposto: 0.04,
  });
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    carregarConfiguracoes();
  }, []);

  const carregarConfiguracoes = async () => {
    try {
      setCarregando(true);
      const config = await configuracoesAPI.obter();
      setPremissas(config.premissas);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setCarregando(false);
    }
  };

  const handleChange = (campo: string, valor: string) => {
    const valorNumerico = parseFloat(valor);
    if (!isNaN(valorNumerico)) {
      setPremissas({ ...premissas, [campo]: valorNumerico });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setMensagem('');

    try {
      await configuracoesAPI.atualizar(premissas);
      setMensagem('✅ Configurações salvas com sucesso!');
      setTimeout(() => setMensagem(''), 3000);
    } catch (error: any) {
      setMensagem(`❌ Erro ao salvar: ${error.response?.data?.detail || 'Erro desconhecido'}`);
    } finally {
      setSalvando(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Deseja restaurar os valores padrão?')) {
      setPremissas({
        tacos: 0.05,
        taxa_comissao: 0.05,
        custo_prep: 1.30,
        frete_fba: 6.00,
        aliquota_imposto: 0.04,
      });
    }
  };

  if (carregando) {
    return <div className="loading">Carregando configurações...</div>;
  }

  return (
    <div className="configuracoes-page">
      <div className="page-header">
        <h2>⚙️ Configurações</h2>
        <p>Ajuste os valores padrão usados nos cálculos de lucratividade</p>
      </div>

      <div className="config-container">
        <form onSubmit={handleSubmit} className="config-form">
          <div className="info-box">
            <div className="info-icon">💡</div>
            <div className="info-content">
              <strong>Como funciona:</strong> Estes valores serão usados como padrão para todos os novos produtos. 
              Produtos já criados mantêm seus valores originais.
            </div>
          </div>

          {/* TACOS (ADS) */}
          <div className="config-section">
            <div className="config-header">
              <h3>📢 TACOS (ADS)</h3>
              <p>Custo de publicidade na Amazon</p>
            </div>
            <div className="config-field">
              <label>Percentual de TACOS</label>
              <div className="input-group">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={premissas.tacos}
                  onChange={(e) => handleChange('tacos', e.target.value)}
                  required
                />
                <span className="input-suffix">
                  {(premissas.tacos * 100).toFixed(2)}%
                </span>
              </div>
              <small>Exemplo: 0.05 = 5% (recomendado: 3% a 7%)</small>
            </div>
          </div>

          {/* Comissão Amazon */}
          <div className="config-section">
            <div className="config-header">
              <h3>💳 Comissão Amazon</h3>
              <p>Taxa cobrada pela Amazon por venda</p>
            </div>
            <div className="config-field">
              <label>Percentual de Comissão</label>
              <div className="input-group">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={premissas.taxa_comissao}
                  onChange={(e) => handleChange('taxa_comissao', e.target.value)}
                  required
                />
                <span className="input-suffix">
                  {(premissas.taxa_comissao * 100).toFixed(2)}%
                </span>
              </div>
              <small>Padrão: 5% (varia por categoria)</small>
            </div>
          </div>

          {/* Prep */}
          <div className="config-section">
            <div className="config-header">
              <h3>📦 Custo de Preparação (Prep)</h3>
              <p>Custo para embalar e preparar produto</p>
            </div>
            <div className="config-field">
              <label>Valor por unidade (R$)</label>
              <div className="input-group">
                <span className="input-prefix">R$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={premissas.custo_prep}
                  onChange={(e) => handleChange('custo_prep', e.target.value)}
                  required
                />
              </div>
              <small>Custo médio: R$ 1,00 a R$ 2,00</small>
            </div>
          </div>

          {/* Frete FBA */}
          <div className="config-section">
            <div className="config-header">
              <h3>🚚 Frete FBA</h3>
              <p>Custo de envio pela Amazon</p>
            </div>
            <div className="config-field">
              <label>Valor por unidade (R$)</label>
              <div className="input-group">
                <span className="input-prefix">R$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={premissas.frete_fba}
                  onChange={(e) => handleChange('frete_fba', e.target.value)}
                  required
                />
              </div>
              <small>Varia por tamanho/peso do produto</small>
            </div>
          </div>

          {/* Impostos */}
          <div className="config-section">
            <div className="config-header">
              <h3>📊 Impostos</h3>
              <p>Alíquota de impostos sobre a venda</p>
            </div>
            <div className="config-field">
              <label>Percentual de Impostos</label>
              <div className="input-group">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={premissas.aliquota_imposto}
                  onChange={(e) => handleChange('aliquota_imposto', e.target.value)}
                  required
                />
                <span className="input-suffix">
                  {(premissas.aliquota_imposto * 100).toFixed(2)}%
                </span>
              </div>
              <small>Simples Nacional: geralmente 4% a 6%</small>
            </div>
          </div>

          {/* Preview de Cálculo */}
          <div className="preview-section">
            <h3>🧮 Preview de Cálculo</h3>
            <p>Exemplo: Produto com custo R$ 10,00 e preço R$ 30,00</p>
            <div className="preview-calc">
              {(() => {
                const custo = 10;
                const preco = 30;
                const comissao = preco * premissas.taxa_comissao;
                const ads = preco * premissas.tacos;
                const impostos = preco * premissas.aliquota_imposto;
                const custoSemAds = custo + comissao + premissas.custo_prep + premissas.frete_fba + impostos;
                const custoTotal = custoSemAds + ads;
                const lucroSemAds = preco - custoSemAds;
                const margemSemAds = (lucroSemAds / preco) * 100;
                const lucro = preco - custoTotal;
                const margem = (lucro / preco) * 100;

                return (
                  <>
                    <div className="calc-item">
                      <span>Comissão:</span>
                      <span>R$ {comissao.toFixed(2)}</span>
                    </div>
                    <div className="calc-item">
                      <span>Prep:</span>
                      <span>R$ {premissas.custo_prep.toFixed(2)}</span>
                    </div>
                    <div className="calc-item">
                      <span>Frete:</span>
                      <span>R$ {premissas.frete_fba.toFixed(2)}</span>
                    </div>
                    <div className="calc-item">
                      <span>Impostos:</span>
                      <span>R$ {impostos.toFixed(2)}</span>
                    </div>
                    <div className="calc-item">
                      <span>ADS:</span>
                      <span>R$ {ads.toFixed(2)}</span>
                    </div>
                    <div className="calc-item total">
                      <span>Custo Total:</span>
                      <span>R$ {custoTotal.toFixed(2)}</span>
                    </div>
                    <div className="calc-item result">
                      <span>Margem de Lucro:</span>
                      <span className={margemSemAds >= 15 ? 'positive' : 'warning'}>
                        {margemSemAds.toFixed(1)}%
                      </span>
                    </div>
                    <div className="calc-item result">
                      <span>Lucro:</span>
                      <span className={lucroSemAds > 0 ? 'positive' : 'negative'}>
                        R$ {lucroSemAds.toFixed(2)}
                      </span>
                    </div>
                    <div className="calc-item result">
                      <span>Margem pós ADS:</span>
                      <span className={margem >= 15 ? 'positive' : 'warning'}>
                        {margem.toFixed(1)}%
                      </span>
                    </div>
                    <div className="calc-item result">
                      <span>Lucro pós ADS:</span>
                      <span className={lucro > 0 ? 'positive' : 'negative'}>
                        R$ {lucro.toFixed(2)}
                      </span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Mensagem */}
          {mensagem && (
            <div className={`message ${mensagem.startsWith('✅') ? 'success' : 'error'}`}>
              {mensagem}
            </div>
          )}

          {/* Botões */}
          <div className="form-actions">
            <button type="button" onClick={handleReset} className="btn-secondary">
              🔄 Restaurar Padrão
            </button>
            <button type="submit" className="btn-primary" disabled={salvando}>
              {salvando ? 'Salvando...' : '💾 Salvar Configurações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
