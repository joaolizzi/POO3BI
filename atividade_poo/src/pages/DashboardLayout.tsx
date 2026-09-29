import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function DashboardLayout() {
  const { usuario, logout } = useAuth();

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand">📦 Estoque</div>
        <nav>
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Início</NavLink>
          <NavLink to="/categorias" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Categorias</NavLink>
          <NavLink to="/produtos" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Produtos</NavLink>
          <NavLink to="/movimentacoes" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Movimentações</NavLink>
        </nav>
      </aside>
      <div className="dashboard-content">
        <header className="topbar"><span>Olá, <strong>{usuario?.nome}</strong></span><button className="button-secondary" onClick={logout}>Sair</button></header>
        <main className="main-content"><Outlet /></main>
      </div>
    </div>
  );
}
