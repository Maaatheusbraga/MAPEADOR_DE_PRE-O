import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProdutosPage } from './pages/ProdutosPage';
import { FornecedoresPage } from './pages/FornecedoresPage';
import { DREPage } from './pages/DREPage';
import { FluxoCaixaPage } from './pages/FluxoCaixaPage';
import { ConfiguracoesPage } from './pages/ConfiguracoesPage';
import './App.css';

// Componente para proteger rotas (requer autenticação)
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Carregando...</div>;
  }

  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/login" />;
}

// Componente para redirecionar se já estiver logado
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Carregando...</div>;
  }

  return isAuthenticated ? <Navigate to="/dashboard" /> : <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/produtos" 
            element={
              <PrivateRoute>
                <ProdutosPage />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/fornecedores" 
            element={
              <PrivateRoute>
                <FornecedoresPage />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/dre" 
            element={
              <PrivateRoute>
                <DREPage />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/fluxo-caixa" 
            element={
              <PrivateRoute>
                <FluxoCaixaPage />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/configuracoes" 
            element={
              <PrivateRoute>
                <ConfiguracoesPage />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/" 
            element={<Navigate to="/dashboard" />} 
          />

          <Route 
            path="*" 
            element={<Navigate to="/dashboard" />} 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
