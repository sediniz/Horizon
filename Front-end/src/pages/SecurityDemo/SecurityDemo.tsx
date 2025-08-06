import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';

const SecurityDemo: React.FC = () => {
  const { usuario, isAuthenticated, login } = useAuth();
  const { isAdmin, isCliente, canAccessAdmin } = usePermissions();

  const testLoginAdmin = async () => {
    try {
      const result = await login('admin@horizonte.com', 'admin123');
      if (result.success) {
        alert('Login como admin realizado com sucesso!');
      } else {
        alert(`Erro no login: ${result.message}`);
      }
    } catch (error) {
      alert('Erro ao tentar fazer login');
    }
  };

  const testLoginCliente = async () => {
    try {
      const result = await login('cliente@teste.com', 'cliente123');
      if (result.success) {
        alert('Login como cliente realizado com sucesso!');
      } else {
        alert(`Erro no login: ${result.message}`);
      }
    } catch (error) {
      alert('Erro ao tentar fazer login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Demonstração do Sistema de Segurança
          </h1>

          {/* Status de Autenticação */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Status Atual</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg border ${isAuthenticated ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <h3 className="font-medium text-gray-900">Autenticação</h3>
                <p className={`text-sm ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
                  {isAuthenticated ? '✅ Autenticado' : '❌ Não autenticado'}
                </p>
              </div>
              
              <div className={`p-4 rounded-lg border ${canAccessAdmin() ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                <h3 className="font-medium text-gray-900">Acesso Admin</h3>
                <p className={`text-sm ${canAccessAdmin() ? 'text-green-600' : 'text-gray-600'}`}>
                  {canAccessAdmin() ? '🔓 Permitido' : '🔒 Negado'}
                </p>
              </div>
            </div>
          </div>

          {/* Informações do Usuário */}
          {isAuthenticated && usuario && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Informações do Usuário</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nome:</p>
                    <p className="font-medium text-gray-900">{usuario.nome}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email:</p>
                    <p className="font-medium text-gray-900">{usuario.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tipo de Usuário:</p>
                    <p className="font-medium text-gray-900">{usuario.tipoUsuario}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ID:</p>
                    <p className="font-medium text-gray-900">{usuario.usuarioId}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Permissões */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Permissões</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg border ${isAdmin() ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'}`}>
                <h3 className="font-medium text-gray-900">Admin</h3>
                <p className={`text-sm ${isAdmin() ? 'text-purple-600' : 'text-gray-600'}`}>
                  {isAdmin() ? '👑 Sim' : '❌ Não'}
                </p>
              </div>
              
              <div className={`p-4 rounded-lg border ${isCliente() ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                <h3 className="font-medium text-gray-900">Cliente</h3>
                <p className={`text-sm ${isCliente() ? 'text-blue-600' : 'text-gray-600'}`}>
                  {isCliente() ? '👤 Sim' : '❌ Não'}
                </p>
              </div>
              
              <div className={`p-4 rounded-lg border ${canAccessAdmin() ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                <h3 className="font-medium text-gray-900">Painel Admin</h3>
                <p className={`text-sm ${canAccessAdmin() ? 'text-green-600' : 'text-gray-600'}`}>
                  {canAccessAdmin() ? '🔓 Acesso' : '🔒 Bloqueado'}
                </p>
              </div>
            </div>
          </div>

          {/* Botões de Teste */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Testes de Login</h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={testLoginAdmin}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Testar Login Admin
              </button>
              <button
                onClick={testLoginCliente}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Testar Login Cliente
              </button>
              <a
                href="/admin"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors inline-block"
              >
                Tentar Acessar Admin
              </a>
            </div>
          </div>

          {/* Explicação */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-medium text-yellow-800 mb-2">Como Funciona a Segurança</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• <strong>Rota Protegida:</strong> A rota /admin está protegida pelo componente ProtectedRoute</li>
              <li>• <strong>Verificação de Tipo:</strong> Apenas usuários com tipoUsuario = "Admin" podem acessar</li>
              <li>• <strong>Redirecionamento:</strong> Usuários não autenticados são redirecionados para a home</li>
              <li>• <strong>Página de Erro:</strong> Usuários autenticados mas sem permissão veem uma página de acesso negado</li>
              <li>• <strong>Menu Condicional:</strong> O link do painel admin só aparece no header para administradores</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityDemo;
