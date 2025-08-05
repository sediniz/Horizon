import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiRequest } from '../../api/config';

const AuthTest: React.FC = () => {
  const { usuario, isAuthenticated, login } = useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testPublicEndpoint = async () => {
    setIsLoading(true);
    try {
      addResult('Testando endpoint público (GET /hoteis)...');
      const result = await apiRequest('/hoteis');
      addResult(`Sucesso: Recebidos ${result?.length || 0} hotéis`);
    } catch (error: any) {
      addResult(`Erro: ${error.message}`);
    }
    setIsLoading(false);
  };

  const testProtectedEndpoint = async () => {
    setIsLoading(true);
    try {
      addResult('Testando endpoint protegido (POST /hoteis)...');
      const newHotel = {
        nome: 'Hotel Teste JWT',
        localizacao: 'Teste City',
        descricao: 'Hotel criado para testar JWT',
        quantidadeDeQuartos: 10,
        estacionamento: true,
        wifi: true,
        cafe: true,
        piscina: false,
        ar: true
      };
      
      const result = await apiRequest('/hoteis', {
        method: 'POST',
        data: newHotel
      });
      addResult(`Sucesso: Hotel criado com ID ${result?.hotelId}`);
    } catch (error: any) {
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        addResult(`Erro 401: Token não enviado ou inválido`);
      } else {
        addResult(`Erro: ${error.message}`);
      }
    }
    setIsLoading(false);
  };

  const testLoginAndToken = async () => {
    setIsLoading(true);
    try {
      addResult('Testando login...');
      const result = await login('admin@horizonte.com', 'admin123');
      if (result.success) {
        addResult('Login realizado com sucesso!');
        addResult(`Token salvo no localStorage`);
        
        // Testar se o token está sendo usado
        setTimeout(() => {
          testProtectedEndpoint();
        }, 1000);
      } else {
        addResult(`Falha no login: ${result.message}`);
      }
    } catch (error: any) {
      addResult(`Erro no login: ${error.message}`);
    }
    setIsLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const checkStoredToken = () => {
    const token = localStorage.getItem('horizon_token');
    const user = localStorage.getItem('horizon_user');
    
    addResult(' Verificando localStorage...');
    addResult(`Token presente: ${token ? 'Sim' : 'Não'}`);
    addResult(`Dados do usuário: ${user ? 'Sim' : 'Não'}`);
    
    if (token) {
      try {
        // Decodificar JWT (parte payload)
        const payload = JSON.parse(atob(token.split('.')[1]));
        addResult(`Token expira em: ${new Date(payload.exp * 1000).toLocaleString()}`);
        addResult(`Usuário no token: ${payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]}`);
        addResult(`Role no token: ${payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]}`);
      } catch (e) {
        addResult(' Erro ao decodificar token');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🧪 Teste de Autenticação JWT
          </h1>

          {/* Status Atual */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Status Atual</h2>
            <div className="space-y-1 text-sm">
              <p><strong>Autenticado:</strong> {isAuthenticated ? '✅ Sim' : '❌ Não'}</p>
              <p><strong>Usuário:</strong> {usuario?.nome || 'Nenhum'}</p>
              <p><strong>Email:</strong> {usuario?.email || 'Nenhum'}</p>
              <p><strong>Tipo:</strong> {usuario?.tipoUsuario || 'Nenhum'}</p>
            </div>
          </div>

          {/* Botões de Teste */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Testes Disponíveis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={checkStoredToken}
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                🔍 Verificar Token
              </button>
              
              <button
                onClick={testPublicEndpoint}
                disabled={isLoading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                🌐 Teste Público
              </button>
              
              <button
                onClick={testProtectedEndpoint}
                disabled={isLoading}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                🔒 Teste Protegido
              </button>
              
              <button
                onClick={testLoginAndToken}
                disabled={isLoading}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                🔑 Login + Teste
              </button>
            </div>
          </div>

          {/* Resultados */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-800">Resultados dos Testes</h2>
              <button
                onClick={clearResults}
                className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
              >
                Limpar
              </button>
            </div>
            
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
              {testResults.length === 0 ? (
                <p className="text-gray-500">Nenhum teste executado ainda...</p>
              ) : (
                testResults.map((result, index) => (
                  <div key={index} className="mb-1">
                    {result}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-2 text-gray-600">Executando teste...</span>
            </div>
          )}

          {/* Instruções */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-medium text-yellow-800 mb-2">Como Interpretar os Resultados</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• <strong>🔍 Verificar Token:</strong> Mostra se o token está salvo e válido</li>
              <li>• <strong>🌐 Teste Público:</strong> Deve funcionar sempre (não precisa de autenticação)</li>
              <li>• <strong>🔒 Teste Protegido:</strong> Só funciona se estiver logado como admin</li>
              <li>• <strong>🔑 Login + Teste:</strong> Faz login e testa endpoint protegido</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTest;
