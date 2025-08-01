import React, { useState, useEffect } from 'react';
import { getAllHoteis } from '../../../api/hoteis';
import type { HotelAPI } from '../../../api/hoteis';

interface HotelListProps {
  onEdit: (hotel: HotelAPI) => void;
  onDelete: (id: number) => Promise<void>;
  refreshTrigger?: number;
}

const HotelList: React.FC<HotelListProps> = ({ onEdit, onDelete, refreshTrigger = 0 }) => {
  const [hoteis, setHoteis] = useState<HotelAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    loadHoteis();
  }, [refreshTrigger]);

  const loadHoteis = async () => {
    try {
      setLoading(true);
      const hoteisData = await getAllHoteis();
      setHoteis(hoteisData);
    } catch (error) {
      console.error('Erro ao carregar hotéis:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, nome: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o hotel "${nome}"?`)) {
      try {
        setDeletingId(id);
        await onDelete(id);
        await loadHoteis(); // Recarregar a lista
      } catch (error) {
        console.error('Erro ao deletar hotel:', error);
        alert('Erro ao deletar hotel. Tente novamente.');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const getComodidades = (hotel: HotelAPI) => {
    const comodidades = [];
    if (hotel.wifi) comodidades.push('Wi-Fi');
    if (hotel.estacionamento) comodidades.push('Estacionamento');
    if (hotel.piscina) comodidades.push('Piscina');
    if (hotel.petFriendly) comodidades.push('Pet Friendly');
    return comodidades.length > 0 ? comodidades.join(', ') : 'Nenhuma';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Hotéis Cadastrados ({hoteis.length})
        </h2>
        <button
          onClick={loadHoteis}
          className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md border border-blue-600"
        >
          Atualizar
        </button>
      </div>

      {hoteis.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg mb-2">Nenhum hotel cadastrado</p>
          <p className="text-sm">Adicione o primeiro hotel usando o formulário acima.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hotel
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localização
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quartos
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diária
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comodidades
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avaliações
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {hoteis.map((hotel) => (
                <tr key={hotel.hotelId} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {hotel.nome}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {hotel.descricao}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {hotel.localizacao}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {hotel.quantidadeDeQuartos}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    R$ {hotel.valorDiaria.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    <div className="max-w-xs truncate">
                      {getComodidades(hotel)}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {hotel.avaliacoes?.length || 0} avaliações
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onEdit(hotel)}
                        className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded border border-blue-600 hover:bg-blue-50"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(hotel.hotelId, hotel.nome)}
                        disabled={deletingId === hotel.hotelId}
                        className="text-red-600 hover:text-red-900 px-3 py-1 rounded border border-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        {deletingId === hotel.hotelId ? 'Excluindo...' : 'Excluir'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HotelList;
