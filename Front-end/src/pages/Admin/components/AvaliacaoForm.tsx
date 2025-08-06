import React, { useState, useEffect } from 'react';
import { getAllHoteis, type HotelAPI } from '../../../api/hoteis';
import { avaliacaoService, type CriarAvaliacaoDto } from '../../../services/avaliacaoService';

interface AvaliacaoFormProps {
  onSuccess?: () => void;
}

interface FormData {
  hotelId: string;
  nota: string;
  comentario: string;
  usuarioId: string;
}

const AvaliacaoForm: React.FC<AvaliacaoFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    hotelId: '',
    nota: '',
    comentario: '',
    usuarioId: ''
  });
  const [hoteis, setHoteis] = useState<HotelAPI[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHoteis, setIsLoadingHoteis] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchHoteis = async () => {
      try {
        setIsLoadingHoteis(true);
        const hoteisData = await getAllHoteis();
        setHoteis(hoteisData);
      } catch (error) {
        console.error('Erro ao carregar hotéis:', error);
        setMessage({ type: 'error', text: 'Erro ao carregar lista de hotéis' });
      } finally {
        setIsLoadingHoteis(false);
      }
    };

    fetchHoteis();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Validações básicas
      if (!formData.hotelId || !formData.nota || !formData.comentario || !formData.usuarioId) {
        throw new Error('Todos os campos são obrigatórios');
      }

      const nota = parseInt(formData.nota);
      if (nota < 1 || nota > 5) {
        throw new Error('A nota deve ser entre 1 e 5');
      }

      const dto: CriarAvaliacaoDto = {
        hotelId: parseInt(formData.hotelId),
        nota: nota,
        comentario: formData.comentario.trim(),
        idUsuario: parseInt(formData.usuarioId)
      };

      await avaliacaoService.create(dto);
      
      setMessage({ type: 'success', text: 'Avaliação criada com sucesso!' });
      
      // Limpar formulário
      setFormData({
        hotelId: '',
        nota: '',
        comentario: '',
        usuarioId: ''
      });

      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar avaliação';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">➕ Criar Nova Avaliação</h3>
      
      {message && (
        <div className={`mb-4 p-3 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Hotel */}
          <div>
            <label htmlFor="hotelId" className="block text-sm font-medium text-gray-700 mb-1">
              Hotel *
            </label>
            {isLoadingHoteis ? (
              <div className="text-sm text-gray-500">Carregando hotéis...</div>
            ) : (
              <select
                id="hotelId"
                name="hotelId"
                value={formData.hotelId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Selecione um hotel</option>
                {hoteis.map(hotel => (
                  <option key={hotel.hotelId} value={hotel.hotelId}>
                    {hotel.nome} - {hotel.localizacao}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Nota */}
          <div>
            <label htmlFor="nota" className="block text-sm font-medium text-gray-700 mb-1">
              Nota (1-5) *
            </label>
            <select
              id="nota"
              name="nota"
              value={formData.nota}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Selecione uma nota</option>
              <option value="1">⭐ 1 - Muito Ruim</option>
              <option value="2">⭐⭐ 2 - Ruim</option>
              <option value="3">⭐⭐⭐ 3 - Regular</option>
              <option value="4">⭐⭐⭐⭐ 4 - Bom</option>
              <option value="5">⭐⭐⭐⭐⭐ 5 - Excelente</option>
            </select>
          </div>
        </div>

        {/* ID do Usuário */}
        <div>
          <label htmlFor="usuarioId" className="block text-sm font-medium text-gray-700 mb-1">
            ID do Usuário *
          </label>
          <input
            type="number"
            id="usuarioId"
            name="usuarioId"
            value={formData.usuarioId}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: 1"
            min="1"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Digite o ID do usuário que está fazendo a avaliação
          </p>
        </div>

        {/* Comentário */}
        <div>
          <label htmlFor="comentario" className="block text-sm font-medium text-gray-700 mb-1">
            Comentário *
          </label>
          <textarea
            id="comentario"
            name="comentario"
            value={formData.comentario}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Digite o comentário da avaliação..."
            required
          />
        </div>

        {/* Botão Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || isLoadingHoteis}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Criando...' : 'Criar Avaliação'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AvaliacaoForm;
