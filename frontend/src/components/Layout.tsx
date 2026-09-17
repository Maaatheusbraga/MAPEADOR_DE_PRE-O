import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Layout.css';

interface Props {
  children: React.ReactNode;
}

export function Layout({ children }: Props) {
  const { usuario, logout } = useAuth();

  return (
    <div className="layout">
      {/* Header */}
      <header className="layout-header">
        <div className="header-content">
          <h1>🛒 Mapeador de Preços</h1>
          <div className="user-info">
            <span>👤 {usuario?.nome || usuario?.email}</span>
            <button onClick={logout} className="btn-logout">Sair</button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="layout-nav">
        <div className="nav-content">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            🏠 Dashboard
          </NavLink>
          <NavLink to="/produtos" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            📦 Produtos
          </NavLink>
          <NavLink to="/fornecedores" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            🏪 Fornecedores
          </NavLink>
          <NavLink to="/dre" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            📊 DRE
          </NavLink>
          <NavLink to="/fluxo-caixa" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            💰 Fluxo de Caixa
          </NavLink>
          <NavLink to="/configuracoes" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            ⚙️ Configurações
          </NavLink>
        </div>
      </nav>

      {/* Main Content */}
      <main className="layout-main">
        {children}
      </main>
    </div>
  );
}
