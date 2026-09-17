import React, { useState, useEffect } from 'react';
import { fornecedoresAPI } from '../services/api';
import './FornecedoresPage.css';

interface Fornecedor {
  id: number;
  nome: string;
  site_instagram: string;
  telefone: string;
  observacoes: string;
  prioritario: boolean;
  ativo: boolean;
  created_at: string;
}

export function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState<Fornecedor | null>(null);
  const [busca, setBusca] = useState('');
  const [visualizacao, setVisualizacao] = useState<'lista' | 'cards'>('lista'); // NOVO

  // Form states
  const [nome, setNome] = useState('');
  const [siteInstagram, setSiteInstagram] = useState('');
  const [telefone, setTelefone] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [prioritario, setPrioritario] = useState(false);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarFornecedores();
  }, []);

  const carregarFornecedores = async () => {
    try {
      setCarregando(true);
      const response = await fornecedoresAPI.listar();
      setFornecedores(response.fornecedores || []);
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
    } finally {
      setCarregando(false);
    }
  };

  const abrirForm = (fornecedor?: Fornecedor) => {
    if (fornecedor) {
      setEditando(fornecedor);
      setNome(fornecedor.nome);
      setSiteInstagram(fornecedor.site_instagram || '');
      setTelefone(fornecedor.telefone || '');
      setObservacoes(fornecedor.observacoes || '');
      setPrioritario(fornecedor.prioritario || false);
    } else {
      limparForm();
    }
    setMostrarForm(true);
  };

  const limparForm = () => {
    setEditando(null);
    setNome('');
    setSiteInstagram('');
    setTelefone('');
    setObservacoes('');
    setPrioritario(false);
    setErro('');
  };

  const fecharForm = () => {
    setMostrarForm(false);
    limparForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setSalvando(true);

    try {
      if (editando) {
        await fornecedoresAPI.atualizar(editando.id, {
          nome,
          site_instagram: siteInstagram,
          telefone,
          observacoes,
          prioritario,
        });
      } else {
        await fornecedoresAPI.criar({
          nome,
          site_instagram: siteInstagram,
          telefone,
          observacoes,
          prioritario,
        });
      }

      await carregarFornecedores();
      fecharForm();
    } catch (error: any) {
      setErro(error.response?.data?.detail || 'Erro ao salvar fornecedor');
    } finally {
      setSalvando(false);
    }
  };

  const handleExcluir = async (fornecedor: Fornecedor) => {
    if (window.confirm(`Tem certeza que deseja excluir "${fornecedor.nome}"?`)) {
      try {
        await fornecedoresAPI.excluir(fornecedor.id);
        await carregarFornecedores();
      } catch (error) {
        console.error('Erro ao excluir fornecedor:', error);
        alert('Erro ao excluir fornecedor');
      }
    }
  };

  const fornecedoresFiltrados = fornecedores.filter((f) =>
    f.nome.toLowerCase().includes(busca.toLowerCase()) ||
    f.telefone.toLowerCase().includes(busca.toLowerCase())
  );

  const fornecedoresPrioritarios = fornecedoresFiltrados.filter((f) => f.prioritario);
  const fornecedoresNormais = fornecedoresFiltrados.filter((f) => !f.prioritario);

  if (carregando) {
    return <div className="loading">Carregando fornecedores...</div>;
  }

  return (
    <div className="fornecedores-page">
      <div className="page-header">
        <div>
          <h2>🏪 Fornecedores</h2>
          <p>Gerencie seus fornecedores e contatos</p>
        </div>
        <button onClick={() => abrirForm()} className="btn-novo">
          ➕ Novo Fornecedor
        </button>
      </div>

      {/* Busca e Toggle de Visualização */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Buscar fornecedor..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="search-input"
        />
        <div className="view-toggle">
          <button
            className={visualizacao === 'lista' ? 'active' : ''}
            onClick={() => setVisualizacao('lista')}
            title="Visualização em Lista"
          >
            📋 Lista
          </button>
          <button
            className={visualizacao === 'cards' ? 'active' : ''}
            onClick={() => setVisualizacao('cards')}
            title="Visualização em Cards"
          >
            🔲 Cards
          </button>
        </div>
      </div>

      {/* Lista de Fornecedores Prioritários */}
      {fornecedoresPrioritarios.length > 0 && (
        <div className="fornecedores-section">
          <h3>⭐ Fornecedores Prioritários ({fornecedoresPrioritarios.length})</h3>
          
          {visualizacao === 'lista' ? (
            <FornecedoresLista
              fornecedores={fornecedoresPrioritarios}
              onEditar={abrirForm}
              onExcluir={handleExcluir}
            />
          ) : (
            <div className="fornecedores-grid">
              {fornecedoresPrioritarios.map((fornecedor) => (
                <FornecedorCard
                  key={fornecedor.id}
                  fornecedor={fornecedor}
                  onEditar={() => abrirForm(fornecedor)}
                  onExcluir={() => handleExcluir(fornecedor)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lista de Fornecedores Normais */}
      {fornecedoresNormais.length > 0 && (
        <div className="fornecedores-section">
          <h3>📋 Outros Fornecedores ({fornecedoresNormais.length})</h3>
          
          {visualizacao === 'lista' ? (
            <FornecedoresLista
              fornecedores={fornecedoresNormais}
              onEditar={abrirForm}
              onExcluir={handleExcluir}
            />
          ) : (
            <div className="fornecedores-grid">
              {fornecedoresNormais.map((fornecedor) => (
                <FornecedorCard
                  key={fornecedor.id}
                  fornecedor={fornecedor}
                  onEditar={() => abrirForm(fornecedor)}
                  onExcluir={() => handleExcluir(fornecedor)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {fornecedoresFiltrados.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🏪</div>
          <h3>{busca ? 'Nenhum fornecedor encontrado' : 'Nenhum fornecedor cadastrado'}</h3>
          <p>{busca ? 'Tente outro termo de busca' : 'Clique em "Novo Fornecedor" para começar'}</p>
        </div>
      )}

      {/* Modal de Form */}
      {mostrarForm && (
        <div className="modal-overlay" onClick={fecharForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={fecharForm}>✕</button>
            
            <h2>{editando ? '✏️ Editar Fornecedor' : '➕ Novo Fornecedor'}</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome do Fornecedor *</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Utimix Importadora"
                  required
                />
              </div>

              <div className="form-group">
                <label>Site ou Instagram</label>
                <input
                  type="text"
                  value={siteInstagram}
                  onChange={(e) => setSiteInstagram(e.target.value)}
                  placeholder="https://www.site.com ou @instagram"
                />
              </div>

              <div className="form-group">
                <label>Telefone</label>
                <input
                  type="text"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div className="form-group">
                <label>Observações</label>
                <textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Anotações sobre o fornecedor..."
                  rows={3}
                />
              </div>

              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={prioritario}
                    onChange={(e) => setPrioritario(e.target.checked)}
                  />
                  <span>⭐ Marcar como prioritário</span>
                </label>
                <small>Fornecedores prioritários aparecem primeiro nas listas</small>
              </div>

              {erro && <div className="error-message">{erro}</div>}

              <div className="form-actions">
                <button type="button" onClick={fecharForm} className="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={salvando}>
                  {salvando ? 'Salvando...' : editando ? '💾 Salvar' : '➕ Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente de Lista de Fornecedores (Tabela)
function FornecedoresLista({
  fornecedores,
  onEditar,
  onExcluir,
}: {
  fornecedores: Fornecedor[];
  onEditar: (fornecedor: Fornecedor) => void;
  onExcluir: (fornecedor: Fornecedor) => void;
}) {
  return (
    <div className="fornecedores-table-container">
      <table className="fornecedores-table">
        <thead>
          <tr>
            <th className="col-priority"></th>
            <th className="col-nome">Nome</th>
            <th className="col-site">Site/Instagram</th>
            <th className="col-telefone">Telefone</th>
            <th className="col-observacoes">Observações</th>
            <th className="col-actions">Ações</th>
          </tr>
        </thead>
        <tbody>
          {fornecedores.map((fornecedor) => (
            <tr key={fornecedor.id} className="table-row">
              <td className="col-priority">
                {fornecedor.prioritario && <span className="star">⭐</span>}
              </td>
              <td className="col-nome">
                <strong>{fornecedor.nome}</strong>
              </td>
              <td className="col-site">
                {fornecedor.site_instagram && (
                  <a href={fornecedor.site_instagram} target="_blank" rel="noopener noreferrer" className="site-link">
                    {fornecedor.site_instagram.includes('instagram') ? '📷 Instagram' : '🌐 Site'}
                  </a>
                )}
              </td>
              <td className="col-telefone">
                {fornecedor.telefone && <span className="telefone">📱 {fornecedor.telefone}</span>}
              </td>
              <td className="col-observacoes">
                {fornecedor.observacoes && (
                  <span className="observacao" title={fornecedor.observacoes}>
                    {fornecedor.observacoes.length > 50
                      ? fornecedor.observacoes.substring(0, 50) + '...'
                      : fornecedor.observacoes}
                  </span>
                )}
              </td>
              <td className="col-actions">
                <button onClick={() => onEditar(fornecedor)} className="btn-table edit" title="Editar">
                  ✏️
                </button>
                <button onClick={() => onExcluir(fornecedor)} className="btn-table delete" title="Excluir">
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Componente de Card de Fornecedor
function FornecedorCard({
  fornecedor,
  onEditar,
  onExcluir,
}: {
  fornecedor: Fornecedor;
  onEditar: () => void;
  onExcluir: () => void;
}) {
  return (
    <div className="fornecedor-card">
      <div className="card-header">
        <h4>{fornecedor.nome}</h4>
        {fornecedor.prioritario && <span className="badge-priority">⭐</span>}
      </div>

      <div className="card-body">
        {fornecedor.telefone && (
          <div className="card-info">
            <span className="info-icon">📱</span>
            <span>{fornecedor.telefone}</span>
          </div>
        )}

        {fornecedor.site_instagram && (
          <div className="card-info">
            <span className="info-icon">🌐</span>
            <a href={fornecedor.site_instagram} target="_blank" rel="noopener noreferrer">
              {fornecedor.site_instagram.length > 40
                ? fornecedor.site_instagram.substring(0, 40) + '...'
                : fornecedor.site_instagram}
            </a>
          </div>
        )}

        {fornecedor.observacoes && (
          <div className="card-observacoes">
            <span className="info-icon">📝</span>
            <span>{fornecedor.observacoes}</span>
          </div>
        )}
      </div>

      <div className="card-actions">
        <button onClick={onEditar} className="btn-icon edit">
          ✏️ Editar
        </button>
        <button onClick={onExcluir} className="btn-icon delete">
          🗑️ Excluir
        </button>
      </div>
    </div>
  );
}
