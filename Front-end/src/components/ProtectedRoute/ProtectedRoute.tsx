import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = 'Admin',
  redirectTo = '/' 
}) => {
  const { usuario, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, redirecionar para home
  if (!isAuthenticated || !usuario) {
    return <Navigate to={redirectTo} replace />;
  }

  // Se não tiver a permissão necessária, mostrar página de acesso negado
  if (usuario.tipoUsuario !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="mb-4">
            <svg 
              className="mx-auto h-16 w-16 text-red-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Acesso Negado
          </h1>
          <p className="text-gray-600 mb-6">
            Você não tem permissão para acessar esta área. 
            Esta seção é restrita apenas para administradores do sistema.
          </p>
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              <strong>Usuário atual:</strong> {usuario.nome} ({usuario.email})
            </p>
            <p className="text-sm text-gray-500">
              <strong>Tipo de usuário:</strong> {usuario.tipoUsuario}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Permissão necessária:</strong> {requiredRole}
            </p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="mt-6 w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  // Se tudo estiver OK, renderizar o componente protegido
  return <>{children}</>;
};

export default ProtectedRoute;
