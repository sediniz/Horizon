import React, { useState } from 'react';
import type { HotelFormData } from '../types';

interface HotelFormProps {
  onSubmit: (data: HotelFormData) => Promise<void>;
  onCancel?: () => void;
  initialData?: Partial<HotelFormData>;
  isLoading?: boolean;
}

const HotelForm: React.FC<HotelFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData = {}, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState<HotelFormData>({
    nome: initialData.nome || '',
    localizacao: initialData.localizacao || '',
    descricao: initialData.descricao || '',
    quantidadeDeQuartos: initialData.quantidadeDeQuartos || 1,
    estacionamento: initialData.estacionamento || false,
    petFriendly: initialData.petFriendly || false,
    piscina: initialData.piscina || false,
    wifi: initialData.wifi || true,
    cafeDaManha: initialData.cafeDaManha || false,
    almoco: initialData.almoco || false,
    jantar: initialData.jantar || false,
    allInclusive: initialData.allInclusive || false,
    valorDiaria: initialData.valorDiaria || 0,
    imagens: initialData.imagens || '',
    datasDisponiveis: initialData.datasDisponiveis || new Date().toISOString().split('T')[0],
    quartoId: initialData.quartoId,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {initialData.nome ? 'Editar Hotel' : 'Novo Hotel'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Hotel *
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              required
              maxLength={30}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Hotel Copacabana Palace"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Localização *
            </label>
            <input
              type="text"
              name="localizacao"
              value={formData.localizacao}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Rio de Janeiro, RJ"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Descreva o hotel..."
          />
        </div>

        {/* Valores e Dados */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantidade de Quartos *
            </label>
            <input
              type="number"
              name="quantidadeDeQuartos"
              value={formData.quantidadeDeQuartos}
              onChange={handleInputChange}
              min="1"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor da Diária (R$) *
            </label>
            <input
              type="number"
              name="valorDiaria"
              value={formData.valorDiaria}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Disponível
            </label>
            <input
              type="date"
              name="datasDisponiveis"
              value={formData.datasDisponiveis}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL da Imagem
          </label>
          <input
            type="url"
            name="imagens"
            value={formData.imagens}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://exemplo.com/imagem-hotel.jpg"
          />
        </div>

        {/* Comodidades */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Comodidades
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="wifi"
                checked={formData.wifi}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Wi-Fi</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="estacionamento"
                checked={formData.estacionamento}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Estacionamento</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="piscina"
                checked={formData.piscina}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Piscina</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="petFriendly"
                checked={formData.petFriendly}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Pet Friendly</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="cafeDaManha"
                checked={formData.cafeDaManha}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Café da Manhã</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="almoco"
                checked={formData.almoco}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Almoço</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="jantar"
                checked={formData.jantar}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Jantar</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="allInclusive"
                checked={formData.allInclusive}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">All Inclusive</span>
            </label>
          </div>
        </div>

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
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Salvando...' : 'Salvar Hotel'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelForm;
