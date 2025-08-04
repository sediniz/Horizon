import React from 'react';

interface DateSelectorProps {
  dataInicio: string;
  dataFim: string;
  onDataInicioChange: (data: string) => void;
  onDataFimChange: (data: string) => void;
  minDate?: string;
  label?: string;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  dataInicio,
  dataFim,
  onDataInicioChange,
  onDataFimChange,
  minDate,
  label = "Selecione as datas da viagem"
}) => {
  // Data mínima é hoje
  const today = new Date().toISOString().split('T')[0];
  const minimumDate = minDate || today;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="dataInicio" className="block text-sm font-medium text-gray-700 mb-2">
            Data de Início
          </label>
          <input
            type="date"
            id="dataInicio"
            value={dataInicio}
            onChange={(e) => onDataInicioChange(e.target.value)}
            min={minimumDate}
            max={dataFim || undefined}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="dataFim" className="block text-sm font-medium text-gray-700 mb-2">
            Data de Fim
          </label>
          <input
            type="date"
            id="dataFim"
            value={dataFim}
            onChange={(e) => onDataFimChange(e.target.value)}
            min={dataInicio || minimumDate}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      {dataInicio && dataFim && (
        <div className="bg-blue-50 p-3 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Período selecionado:</strong> {' '}
            {new Date(dataInicio).toLocaleDateString('pt-BR')} até {' '}
            {new Date(dataFim).toLocaleDateString('pt-BR')}
            {' '}({Math.ceil((new Date(dataFim).getTime() - new Date(dataInicio).getTime()) / (1000 * 60 * 60 * 24))} dias)
          </p>
        </div>
      )}
    </div>
  );
};
