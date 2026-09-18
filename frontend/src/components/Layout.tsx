import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { IconHome, IconBox, IconStore, IconChart, IconWallet, IconGear, IconLogout } from './Icons';
import './Layout.css';

interface Props {
  children: React.ReactNode;
}

export function Layout({ children }: Props) {
  const { usuario, logout } = useAuth();

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="header-content">
          <h1>Mapeador de Preços</h1>
          <div className="user-info">
            <span>{usuario?.nome || usuario?.email}</span>
            <button type="button" onClick={logout} className="btn-logout">
              <IconLogout /> Sair
            </button>
          </div>
        </div>
      </header>

      <nav className="layout-nav" aria-label="Principal">
        <div className="nav-content">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <IconHome /> Dashboard
          </NavLink>
          <NavLink to="/produtos" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <IconBox /> Produtos
          </NavLink>
          <NavLink to="/fornecedores" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <IconStore /> Fornecedores
          </NavLink>
          <NavLink to="/dre" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <IconChart /> DRE
          </NavLink>
          <NavLink to="/fluxo-caixa" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <IconWallet /> Fluxo de Caixa
          </NavLink>
          <NavLink to="/configuracoes" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <IconGear /> Configurações
          </NavLink>
        </div>
      </nav>

      <main className="layout-main">
        {children}
      </main>
    </div>
  );
}
