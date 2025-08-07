import React, { useState, useEffect } from 'react';
import { getAllHoteis } from '../../../api/hoteis';
import type { PacoteFormData } from '../types';
import type { HotelAPI } from '../../../api/hoteis';

interface PacoteFormProps {
  onSubmit: (data: PacoteFormData) => Promise<void>;
  onCancel?: () => void;
  initialData?: Partial<PacoteFormData>;
  isLoading?: boolean;
}

const PacoteForm: React.FC<PacoteFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData = {}, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState<Omit<PacoteFormData, 'valorTotal'>>({
    titulo: initialData.titulo || '',
    descricao: initialData.descricao || '',
    destino: initialData.destino || '',
    duracao: initialData.duracao || 1,
    quantidadeDePessoas: initialData.quantidadeDePessoas || 1,
    hotelId: initialData.hotelId || 0,
  });

  const [hoteis, setHoteis] = useState<HotelAPI[]>([]);
  const [loadingHoteis, setLoadingHoteis] = useState(true);

  // Calcular valor total dinamicamente
  const selectedHotel = hoteis.find(hotel => hotel.hotelId === formData.hotelId);
  const valorCalculado = selectedHotel
    ? selectedHotel.valorDiaria * Number(formData.duracao) * Number(formData.quantidadeDePessoas)
    : 0;

  useEffect(() => {
    loadHoteis();
  }, []);

  const loadHoteis = async () => {
    try {
      const hoteisData = await getAllHoteis();
      setHoteis(hoteisData);
    } catch (error) {
      console.error('Erro ao carregar hotéis:', error);
    } finally {
      setLoadingHoteis(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Sempre enviar o valor calculado no momento do submit
    await onSubmit({
      ...formData,
      valorTotal: valorCalculado
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let processedValue: string | number = value;
    if (type === 'number') {
      processedValue = value === '' ? 1 : Number(value);
    } else if (name === 'hotelId') {
      // Converter hotelId para number sempre
      processedValue = Number(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {initialData.titulo ? 'Editar Pacote' : 'Novo Pacote'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título do Pacote *
            </label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Pacote Rio de Janeiro 3 Dias"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destino *
            </label>
            <input
              type="text"
              name="destino"
              value={formData.destino}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Rio de Janeiro, RJ"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição *
          </label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleInputChange}
            rows={3}
            required
            maxLength={400}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Descreva o pacote de viagem... (máx. 400 caracteres)"
          />
          <div className="text-sm text-gray-500 mt-1">
            {formData.descricao.length}/400 caracteres
          </div>
        </div>

        {/* Valores e Configurações */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duração (dias) *
            </label>
            <input
              type="number"
              name="duracao"
              value={formData.duracao}
              onChange={handleInputChange}
              min="1"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantidade de Pessoas *
            </label>
            <input
              type="number"
              name="quantidadeDePessoas"
              value={formData.quantidadeDePessoas}
              onChange={handleInputChange}
              min="1"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor Total (R$)
            </label>
            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 font-medium">
              R$ {valorCalculado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Calculado automaticamente: {selectedHotel ? `R$ ${selectedHotel.valorDiaria}/diária × ${formData.duracao} dias × ${formData.quantidadeDePessoas} pessoas` : 'Selecione um hotel para calcular'}
            </div>
          </div>
        </div>

        {/* Seleção do Hotel */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hotel *
          </label>
          {loadingHoteis ? (
            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
              Carregando hotéis...
            </div>
          ) : (
            <select
              name="hotelId"
              value={formData.hotelId}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>Selecione um hotel</option>
              {hoteis.map(hotel => (
                <option key={hotel.hotelId} value={hotel.hotelId}>
                  {hotel.nome} - {hotel.localizacao} (R$ {hotel.valorDiaria}/diária)
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Preview do Hotel Selecionado */}
        {selectedHotel && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium text-gray-800 mb-2">Hotel Selecionado:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
              <div>📍 {selectedHotel.localizacao}</div>
              <div>🏠 {selectedHotel.quantidadeDeQuartos} quartos</div>
              <div>💰 R$ {selectedHotel.valorDiaria}/diária</div>
              <div>
                ⭐ Comodidades: 
                {[
                  selectedHotel.wifi && 'Wi-Fi',
                  selectedHotel.estacionamento && 'Estacionamento',
                  selectedHotel.piscina && 'Piscina',
                  selectedHotel.petFriendly && 'Pet Friendly'
                ].filter(Boolean).join(', ') || 'Nenhuma'}
              </div>
            </div>
            
            {/* Cálculo detalhado */}
            <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
              <h4 className="font-medium text-blue-800 text-sm mb-1">💰 Cálculo do Valor Total:</h4>
              <div className="text-blue-700 text-sm">
                R$ {selectedHotel.valorDiaria}/diária × {formData.duracao} dias × {formData.quantidadeDePessoas} pessoas = 
                <span className="font-bold text-blue-800"> R$ {valorCalculado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        )}

        {/* Botões */}
        <div className="flex justify-end space-x-4 pt-6">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-6 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading || loadingHoteis}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Salvando...' : 'Salvar Pacote'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PacoteForm;
