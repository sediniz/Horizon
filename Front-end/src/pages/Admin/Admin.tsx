import React, { useState } from 'react';
import HotelForm from './components/HotelForm';
import PacoteForm from './components/PacoteForm';
import HotelList from './components/HotelList';
import PacoteList from './components/PacoteList';
import type { HotelFormData, PacoteFormData } from './types';
import type { HotelAPI } from '../../api/hoteis';
import type { PacoteAPI } from '../../api/pacotes';

// Importar as funções da API
import { createHotel, updateHotel, deleteHotel } from '../../api/hoteis';
import { createPacote, updatePacote, deletePacote } from '../../api/pacotes';

type ActiveTab = 'hoteis' | 'pacotes';
type ViewMode = 'list' | 'form';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('hoteis');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingHotel, setEditingHotel] = useState<HotelAPI | null>(null);
  const [editingPacote, setEditingPacote] = useState<PacoteAPI | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Teste de conectividade na inicialização
  React.useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('🔍 Testando conectividade com a API...');
        const response = await fetch('https://localhost:7202/api/pacotes');
        console.log('📡 Status da resposta:', response.status);
        if (response.ok) {
          console.log('✅ API está respondendo!');
        } else {
          console.log(' API retornou erro:', response.status);
        }
      } catch (error) {
        console.error(' Erro ao conectar com a API:', error);
      }
    };
    testConnection();
  }, []);

  // ================================
  // FUNÇÕES HELPER
  // ================================
  const convertHotelFormData = (data: HotelFormData) => ({
    nome: data.nome,
    localizacao: data.localizacao,
    descricao: data.descricao,
    quantidadeDeQuartos: Number(data.quantidadeDeQuartos) || 0,
    estacionamento: data.estacionamento,
    petFriendly: data.petFriendly,
    piscina: data.piscina,
    wifi: data.wifi,
    valorDiaria: Number(data.valorDiaria) || 0,
    imagens: data.imagens,
    datasDisponiveis: data.datasDisponiveis,
    quartoId: data.quartoId,
  });

  const convertPacoteFormData = (data: PacoteFormData, pacoteId?: number) => ({
    pacoteId: pacoteId || 0, // Incluir o ID do pacote para o PUT
    titulo: data.titulo,
    descricao: data.descricao || 'Pacote de viagem', // Valor padrão se vazio
    destino: data.destino,
    duracao: Number(data.duracao) || 0,
    quantidadeDePessoas: Number(data.quantidadeDePessoas) || 0,
    valorTotal: Number(data.valorTotal) || 0,
    hotelId: Number(data.hotelId) || 0,
  });

  // ================================
  // FUNÇÕES PARA HOTÉIS
  // ================================
  const handleCreateHotel = async (data: HotelFormData) => {
    try {
      setIsLoading(true);
      const convertedData = convertHotelFormData(data);
      await createHotel(convertedData);
      
      setViewMode('list');
      setRefreshTrigger(prev => prev + 1);
      alert('Hotel criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar hotel:', error);
      alert('Erro ao criar hotel. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateHotel = async (data: HotelFormData) => {
    if (!editingHotel) return;

    try {
      setIsLoading(true);
      const convertedData = convertHotelFormData(data);
      await updateHotel(editingHotel.hotelId, convertedData);
      
      setEditingHotel(null);
      setViewMode('list');
      setRefreshTrigger(prev => prev + 1);
      alert('Hotel atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar hotel:', error);
      alert('Erro ao atualizar hotel. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteHotel = async (id: number) => {
    try {
      await deleteHotel(id);
      alert('Hotel deletado com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar hotel:', error);
      throw error;
    }
  };

  const handleEditHotel = (hotel: HotelAPI) => {
    setEditingHotel(hotel);
    setViewMode('form');
  };

  // ================================
  // FUNÇÕES PARA PACOTES
  // ================================
  const handleCreatePacote = async (data: PacoteFormData) => {
    try {
      setIsLoading(true);
      console.log(' Dados do formulário recebidos:', data);
      
      const convertedData = convertPacoteFormData(data);
      console.log(' Dados convertidos:', convertedData);
      
      await createPacote(convertedData);
      
      setViewMode('list');
      setRefreshTrigger(prev => prev + 1);
      alert('Pacote criado com sucesso!');
    } catch (error) {
      console.error(' Erro completo ao criar pacote:', error);
      
      // Mostrar erro mais detalhado para o usuário
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      alert(`Erro ao criar pacote: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePacote = async (data: PacoteFormData) => {
    if (!editingPacote) return;

    try {
      setIsLoading(true);
      console.log(' Dados do formulário para atualização:', data);
      console.log(' Pacote sendo editado (ID):', editingPacote.pacoteId);
      
      const convertedData = convertPacoteFormData(data, editingPacote.pacoteId);
      console.log(' Dados convertidos para PUT:', convertedData);
      
      await updatePacote(editingPacote.pacoteId, convertedData);
      
      setEditingPacote(null);
      setViewMode('list');
      setRefreshTrigger(prev => prev + 1);
      alert('Pacote atualizado com sucesso!');
    } catch (error) {
      console.error(' Erro ao atualizar pacote:', error);
      alert('Erro ao atualizar pacote. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePacote = async (id: number) => {
    try {
      await deletePacote(id);
      alert('Pacote deletado com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar pacote:', error);
      throw error;
    }
  };

  const handleEditPacote = (pacote: PacoteAPI) => {
    setEditingPacote(pacote);
    setViewMode('form');
  };

  // ================================
  // FUNÇÕES DE NAVEGAÇÃO
  // ================================
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setViewMode('list');
    setEditingHotel(null);
    setEditingPacote(null);
  };

  const handleNewItem = () => {
    setViewMode('form');
    setEditingHotel(null);
    setEditingPacote(null);
  };

  const handleCancelForm = () => {
    setViewMode('list');
    setEditingHotel(null);
    setEditingPacote(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Painel Administrativo
          </h1>
          <p className="mt-2 text-gray-600">
            Gerencie hotéis e pacotes de viagem
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => handleTabChange('hoteis')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'hoteis'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🏨 Hotéis
              </button>
              <button
                onClick={() => handleTabChange('pacotes')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pacotes'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📦 Pacotes
              </button>
            </nav>
          </div>

          {/* Action Bar */}
          <div className="px-6 py-4 flex justify-between items-center bg-gray-50">
            <div className="text-sm text-gray-600">
              {activeTab === 'hoteis' ? 'Gerenciamento de Hotéis' : 'Gerenciamento de Pacotes'}
            </div>
            <div className="flex space-x-3">
              {viewMode === 'form' ? (
                <button
                  onClick={handleCancelForm}
                  className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  ← Voltar à Lista
                </button>
              ) : (
                <button
                  onClick={handleNewItem}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  + Novo {activeTab === 'hoteis' ? 'Hotel' : 'Pacote'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'hoteis' && (
            <>
              {viewMode === 'form' && (
                <HotelForm
                  onSubmit={editingHotel ? handleUpdateHotel : handleCreateHotel}
                  onCancel={handleCancelForm}
                  initialData={editingHotel || {}}
                  isLoading={isLoading}
                />
              )}
              
              {viewMode === 'list' && (
                <HotelList
                  onEdit={handleEditHotel}
                  onDelete={handleDeleteHotel}
                  refreshTrigger={refreshTrigger}
                />
              )}
            </>
          )}

          {activeTab === 'pacotes' && (
            <>
              {viewMode === 'form' && (
                <PacoteForm
                  onSubmit={editingPacote ? handleUpdatePacote : handleCreatePacote}
                  onCancel={handleCancelForm}
                  initialData={editingPacote || {}}
                  isLoading={isLoading}
                />
              )}
              
              {viewMode === 'list' && (
                <PacoteList
                  onEdit={handleEditPacote}
                  onDelete={handleDeletePacote}
                  refreshTrigger={refreshTrigger}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
