import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Simulando dados do usuário baseado no modelo Usuario.cs
interface UsuarioData {
  usuarioId: number;
  nome: string;
  email: string;
  telefone: string;
  cpfPassaporte: string;
  tipoUsuario: string;
  profileImage?: string;
}

// Dados mockados do usuário (em um projeto real, viria de uma API)
const mockUserData: UsuarioData = {
  usuarioId: 1,
  nome: "Usuário Anônimo",
  email: "usuario@exemplo.com",
  telefone: "Não informado",
  cpfPassaporte: "Não informado",
  tipoUsuario: "Cliente"
};

function Perfil() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  // Usar dados reais do usuário logado ou fallback para dados vazios
  const realUserData: UsuarioData = usuario ? {
    usuarioId: usuario.usuarioId || 0,
    nome: usuario.nome || "Nome não informado",
    email: usuario.email || "email@exemplo.com",
    telefone: usuario.telefone || "Não informado",
    cpfPassaporte: usuario.cpfPassaporte || "Não informado",
    tipoUsuario: usuario.tipoUsuario || "Cliente"
  } : mockUserData;

  const [userData, setUserData] = useState<UsuarioData>(realUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UsuarioData>(realUserData);
  const [isAccountSettingsExpanded, setIsAccountSettingsExpanded] = useState(false);

  // Atualizar dados quando o usuário mudar (login/logout)
  useEffect(() => {
    if (usuario) {
      const updatedUserData: UsuarioData = {
        usuarioId: usuario.usuarioId || 0,
        nome: usuario.nome || "Nome não informado",
        email: usuario.email || "email@exemplo.com",
        telefone: usuario.telefone || "Não informado",
        cpfPassaporte: usuario.cpfPassaporte || "Não informado",
        tipoUsuario: usuario.tipoUsuario || "Cliente"
      };
      setUserData(updatedUserData);
      setEditForm(updatedUserData);
    } else {
      // Se não há usuário logado, redirecionar para login
      navigate('/login');
    }
  }, [usuario, navigate]);

  // Função para gerar iniciais do nome
  const getInitials = (name: string | undefined | null) => {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return 'U'; // Fallback para "User"
    }
    
    return name
      .trim()
      .split(' ')
      .filter(word => word.length > 0) // Remove palavras vazias
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U'; // Fallback caso não consiga gerar iniciais
  };

  // Função para lidar com mudanças no formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Função para salvar alterações
  const handleSave = async () => {
    try {
      // Aqui você faria a chamada para a API para salvar os dados
      // const response = await fetch('/api/usuarios/atualizar', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(editForm)
      // });
      
      // Por enquanto, apenas atualizar localmente
      setUserData(editForm);
      setIsEditing(false);
      
      // TODO: Após implementar a API, também atualizar o contexto de autenticação
      console.log('Dados atualizados:', editForm);
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  };

  // Função para cancelar edição
  const handleCancel = () => {
    setEditForm(userData);
    setIsEditing(false);
  };

  // Se não há usuário logado, mostrar mensagem de login necessário
  if (!usuario) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Necessário</h2>
          <p className="text-gray-600 mb-6">Você precisa estar logado para ver seu perfil.</p>
          <button 
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="Perfil min-h-screen bg-gray-50">
      <main className="space-y-8 pb-16">
        {/* Header Section */}
        <section className="pt-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Meu Perfil
            </h1>
            
            {/* Profile Card - Rectangular div with user info */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="flex flex-col lg:flex-row items-start gap-6">
                {/* Profile Picture Section - Left Side */}
                <div className="flex flex-col items-center space-y-4 lg:w-56 lg:flex-shrink-0">
                  {/* User Name - Above Profile Picture */}
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      {userData.nome}
                    </h2>
                  </div>
                  
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {userData.profileImage ? (
                      <img 
                        src={userData.profileImage} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getInitials(userData.nome)
                    )}
                  </div>
                  <button className="text-blue-600 text-sm hover:text-blue-800 transition-colors">
                    Alterar foto
                  </button>
                </div>

                {/* User Information - Right Side */}
                <div className="flex-1 lg:ml-8 justify-end">
                  <div className="flex justify-end items-start mb-6">
                    
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold text-base hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                      </button>
                    )}
                  </div>

                  {/* Information Grid */}
                  <div className="space-y-4 max-w-md">
                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={editForm.email}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      ) : (
                        <p className="text-gray-800 bg-gray-50 p-2 rounded-lg text-sm">{userData.email}</p>
                      )}
                    </div>

                    {/* Telefone */}
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-600">Telefone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="telefone"
                          value={editForm.telefone}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      ) : (
                        <p className="text-gray-800 bg-gray-50 p-2 rounded-lg text-sm">{userData.telefone}</p>
                      )}
                    </div>

                    {/* CPF/Passaporte */}
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-600">CPF/Passaporte</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="cpfPassaporte"
                          value={editForm.cpfPassaporte}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      ) : (
                        <p className="text-gray-800 bg-gray-50 p-2 rounded-lg text-sm">{userData.cpfPassaporte}</p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons for Editing */}
                  {isEditing && (
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={handleSave}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Salvar
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Sections */}
        <section className="px-4">
          <div className="max-w-4xl mx-auto">
            {/* Account Settings */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Configurações da Conta</h3>
              <div className="space-y-4">
                {/* Histórico de Reservas */}
                <Link to="/reservas">
                  <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v5H4l5-5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2h4z" />
                      </svg>
                      <span className="font-medium">Histórico de Reservas</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </Link>

                {/* Favoritos */}
                <Link to="/favoritos">
                  <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                      </svg>
                      <span className="font-medium">Meus Favoritos</span>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </Link>
                
                {/* Configurações de conta expandable */}
                <div className="border border-gray-200 rounded-lg">
                  <button 
                    onClick={() => setIsAccountSettingsExpanded(!isAccountSettingsExpanded)}
                    className="w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-medium">Configurações de conta</span>
                    </div>
                    <svg 
                      className={`w-5 h-5 text-gray-400 transition-transform ${isAccountSettingsExpanded ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Expandable menu */}
                  {isAccountSettingsExpanded && (
                    <div className="border-t border-gray-200 bg-gray-50">
                      <button className="w-full text-left p-4 hover:bg-gray-100 transition-colors flex items-center gap-3">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2v6a2 2 0 01-2 2h-6a2 2 0 01-2-2V9a2 2 0 012-2m0 0V7a2 2 0 012-2h6a2 2 0 012 2v2M9 7h6" />
                        </svg>
                        <span className="font-medium text-gray-700">Alterar Senha</span>
                      </button>
                      <button className="w-full text-left p-4 hover:bg-gray-100 transition-colors flex items-center gap-3">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="font-medium text-red-600">Excluir Conta</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <button 
                onClick={() => {
                  usuario && logout();
                  navigate('/');
                }}
                className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sair da Conta
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Perfil;
