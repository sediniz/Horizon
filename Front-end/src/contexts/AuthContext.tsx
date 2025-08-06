import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Interfaces para o sistema de autenticação
interface UsuarioAuth {
  usuarioId: number;
  nome: string;
  email: string;
  telefone: string;
  cpfPassaporte: string;
  tipoUsuario: string;
}

interface AuthContextType {
  usuario: UsuarioAuth | null;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  cpfPassaporte: string;
  tipoUsuario?: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Criando o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider do contexto de autenticação
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [usuario, setUsuario] = useState<UsuarioAuth | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verifica se há token salvo no localStorage ao inicializar
  useEffect(() => {
    const token = localStorage.getItem('horizon_token');
    const userData = localStorage.getItem('horizon_user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setUsuario(user);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        localStorage.removeItem('horizon_token');
        localStorage.removeItem('horizon_user');
      }
    }
    
    setIsLoading(false);
  }, []);

  // Função de login
  const login = async (email: string, senha: string): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      
      const response = await fetch('https://localhost:7202/api/autenticacoes/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          senha,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;

        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Payload do JWT:', payload); 
        
        const userData: UsuarioAuth = {
          usuarioId: parseInt(payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]) || 0,
          nome: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || 'Usuário',
          email: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || email || 'email@exemplo.com',
          telefone: payload.telefone || '',
          cpfPassaporte: payload.cpfPassaporte || '',
          tipoUsuario: payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || 'Cliente',
        };

        console.log('Dados do usuário extraídos:', userData); 

        // Salvar no localStorage
        localStorage.setItem('horizon_token', token);
        localStorage.setItem('horizon_user', JSON.stringify(userData));
        
        // Atualizar estado
        setUsuario(userData);

        return { success: true, message: 'Login realizado com sucesso!' };
      } else {
        const errorData = await response.json();
        return { success: false, message: errorData.message || 'Email ou senha incorretos.' };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, message: 'Erro de conexão. Tente novamente.' };
    } finally {
      setIsLoading(false);
    }
  };

  // Função de registro
  const register = async (userData: RegisterData): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      
      const response = await fetch('https://localhost:7202/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: userData.nome,
          email: userData.email,
          senha: userData.senha,
          telefone: userData.telefone,
          cpfPassaporte: userData.cpfPassaporte,
          tipoUsuario: userData.tipoUsuario || 'Cliente',
        }),
      });

      if (response.ok) {
        return { success: true, message: 'Conta criada com sucesso! Faça login para continuar.' };
      } else {
        const errorData = await response.json();
        return { success: false, message: errorData.message || 'Erro ao criar conta.' };
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      return { success: false, message: 'Erro de conexão. Tente novamente.' };
    } finally {
      setIsLoading(false);
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('horizon_token');
    localStorage.removeItem('horizon_user');
    setUsuario(null);
  };

  const isAuthenticated = !!usuario;
  const isAdmin = isAuthenticated && usuario?.tipoUsuario === 'Admin';

  const value: AuthContextType = {
    usuario,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto de autenticação
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export default AuthContext;
