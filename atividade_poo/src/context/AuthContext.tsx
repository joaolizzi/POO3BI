import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Usuario } from '../types';
import { authApi } from '../api/api';

type AuthContextType = {
  usuario: Usuario | null;
  autenticado: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const salvo = localStorage.getItem('usuario');
    return salvo ? (JSON.parse(salvo) as Usuario) : null;
  });

  async function login(email: string, senha: string) {
    const resposta = await authApi.login(email, senha);
    localStorage.setItem('token', resposta.accessToken);
    localStorage.setItem('usuario', JSON.stringify(resposta.usuario));
    setUsuario(resposta.usuario);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, autenticado: !!usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
}
