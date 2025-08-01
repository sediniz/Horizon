import React, { useState, useEffect } from 'react';
import { getAllPacotes } from '../../../api/pacotes';
import type { PacoteAPI } from '../../../api/pacotes';

interface PacoteListProps {
  onEdit: (pacote: PacoteAPI) => void;
  onDelete: (id: number) => Promise<void>;
  refreshTrigger?: number;
}

const PacoteList: React.FC<PacoteListProps> = ({ onEdit, onDelete, refreshTrigger = 0 }) => {
  const [pacotes, setPacotes] = useState<PacoteAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    loadPacotes();
  }, [refreshTrigger]);

  const loadPacotes = async () => {
    try {
      setLoading(true);
      const pacotesData = await getAllPacotes();
      setPacotes(pacotesData);
    } catch (error) {
      console.error('Erro ao carregar pacotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, titulo: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o pacote "${titulo}"?`)) {
      try {
        setDeletingId(id);
        await onDelete(id);
        await loadPacotes(); // Recarregar a lista
      } catch (error) {
        console.error('Erro ao deletar pacote:', error);
        alert('Erro ao deletar pacote. Tente novamente.');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const formatDuration = (duracao: number): string => {
    if (duracao === 1) return '1 dia';
    const noites = duracao - 1;
    return `${duracao} dias / ${noites} noites`;
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
          Pacotes Cadastrados ({pacotes.length})
        </h2>
        <button
          onClick={loadPacotes}
          className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md border border-blue-600"
        >
          Atualizar
        </button>
      </div>

      {pacotes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg mb-2">Nenhum pacote cadastrado</p>
          <p className="text-sm">Adicione o primeiro pacote usando o formulário acima.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pacote
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Destino
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duração
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pessoas
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hotel ID
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pacotes.map((pacote) => (
                <tr key={pacote.pacoteId} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {pacote.titulo}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {pacote.descricao}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pacote.destino}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDuration(pacote.duracao)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pacote.quantidadeDePessoas}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    R$ {pacote.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pacote.hotelId}
                    {pacote.hotel && (
                      <div className="text-xs text-gray-500">
                        {pacote.hotel.nome}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onEdit(pacote)}
                        className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded border border-blue-600 hover:bg-blue-50"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(pacote.pacoteId, pacote.titulo)}
                        disabled={deletingId === pacote.pacoteId}
                        className="text-red-600 hover:text-red-900 px-3 py-1 rounded border border-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        {deletingId === pacote.pacoteId ? 'Excluindo...' : 'Excluir'}
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

export default PacoteList;
