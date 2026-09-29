import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function extrairMensagemErro(erro: unknown) {
  if (typeof erro === 'object' && erro !== null && 'response' in erro) {
    const response = (erro as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return 'Não foi possível entrar.';
}

export function LoginPage() {
  const { autenticado, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('professor@ifpr.edu.br');
  const [senha, setSenha] = useState('123456');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  if (autenticado) return <Navigate to="/" replace />;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      await login(email, senha);
      navigate('/');
    } catch (error) {
      setErro(extrairMensagemErro(error));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-page">
      <form className="card login-card" onSubmit={handleSubmit}>
        <h1>Controle de Estoque</h1>
        <p className="muted">Entre para acessar o dashboard.</p>
        {erro && <div className="alert alert-error">{erro}</div>}
        <label>
          E-mail
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
        </label>
        <label>
          Senha
          <input value={senha} onChange={(e) => setSenha(e.target.value)} type="password" />
        </label>
        <button type="submit" disabled={carregando}>{carregando ? 'Entrando...' : 'Entrar'}</button>
      </form>
    </div>
  );
}
