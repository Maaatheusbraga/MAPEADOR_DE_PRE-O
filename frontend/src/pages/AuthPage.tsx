import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

export function AuthPage() {
  const [modo, setModo] = useState<'login' | 'cadastro'>('login');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const { login, cadastro } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      if (modo === 'login') {
        await login(email, senha);
      } else {
        if (!nome.trim()) {
          setErro('Nome é obrigatório');
          setCarregando(false);
          return;
        }
        await cadastro(nome, email, senha);
      }
      navigate('/produtos');
    } catch (error: any) {
      if (!error.response) {
        setErro('Não foi possível conectar ao servidor. Confira se o backend está rodando em http://localhost:8000.');
      } else {
        const detalhe = error.response?.data?.detail;
        setErro(typeof detalhe === 'string' ? detalhe : 'Erro ao processar requisição');
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Mapeador de Preços</h1>
        <p className="subtitle">Analise a lucratividade dos seus produtos Amazon FBA</p>

        <div className="auth-tabs">
          <button
            className={modo === 'login' ? 'active' : ''}
            onClick={() => {
              setModo('login');
              setErro('');
            }}
          >
            Login
          </button>
          <button
            className={modo === 'cadastro' ? 'active' : ''}
            onClick={() => {
              setModo('cadastro');
              setErro('');
            }}
          >
            Cadastro
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {modo === 'cadastro' && (
            <div className="form-group">
              <label>Nome Completo</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                required={modo === 'cadastro'}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              required
            />
          </div>

          {erro && <div className="error-message">{erro}</div>}

          <button type="submit" className="btn-primary" disabled={carregando}>
            {carregando ? 'Aguarde...' : modo === 'login' ? 'Entrar' : 'Criar Conta'}
          </button>
        </form>
      </div>
    </div>
  );
}
