import React, { useState, useEffect } from 'react';

interface PackageCustomizerProps {
  valorDiaria: number;
  duracaoOriginal: number;
  pessoasOriginal: number;
  onReservarCustomizado: (dias: number, pessoas: number, valorTotal: number, dataInicio: string, dataFim: string) => void;
  className?: string;
}

const PackageCustomizer: React.FC<PackageCustomizerProps> = ({
  valorDiaria,
  duracaoOriginal,
  pessoasOriginal,
  onReservarCustomizado,
  className = ""
}) => {
  const [dias, setDias] = useState(duracaoOriginal);
  const [pessoas, setPessoas] = useState(pessoasOriginal);
  const [dataInicio, setDataInicio] = useState("");

  useEffect(() => {
    const hoje = new Date();
    const dataInicioDefault = new Date(hoje);
    dataInicioDefault.setDate(dataInicioDefault.getDate() + 7);
    setDataInicio(dataInicioDefault.toISOString().split('T')[0]);
  }, []);

  const adicionarUmDia = (dataString: string) => {
    try {
      const data = new Date(dataString);
      data.setDate(data.getDate() + 1);
      return data.toLocaleDateString('pt-BR');
    } catch (e) {
      return dataString;
    }
  };

  const calcularDesconto = (diasSelecionados: number): number => {
    const diasExtras = diasSelecionados - duracaoOriginal;
    
    if (diasExtras >= 6) return 15;
    if (diasExtras >= 4) return 10;
    if (diasExtras >= 2) return 5;
    
    return 0;
  };

  // Calcular valor total
  const calcularValorTotal = () => {
    const valorBase = valorDiaria * dias * pessoas;
    const desconto = calcularDesconto(dias);
    const valorComDesconto = valorBase * (1 - desconto / 100);
    return valorComDesconto;
  };


  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const desconto = calcularDesconto(dias);
  const valorTotal = calcularValorTotal();
  const valorSemDesconto = valorDiaria * dias * pessoas;

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-200 ${className}`}>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Personalize sua viagem</h3>
        <p className="text-gray-600 text-sm">Ajuste a duração, número de pessoas e data conforme sua preferência</p>
      </div>

      {/* Seletor de Data de Início */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Data de Início da Viagem
        </label>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
          />
          
          {dataInicio && (
            <div className="mt-3 p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-700">
                  <strong>Check-in:</strong> {adicionarUmDia(dataInicio)}
                </span>
                <span className="text-purple-700">
                  <strong>Check-out:</strong> {adicionarUmDia(new Date(new Date(dataInicio).setDate(new Date(dataInicio).getDate() + dias)).toISOString().split('T')[0])}
                </span>
              </div>
              <div className="text-center mt-2">
                <span className="text-purple-800 font-semibold">{dias} {dias === 1 ? 'dia' : 'dias'} de viagem personalizada</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Seletor de Dias */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Duração da Viagem
        </label>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">Dias:</span>
            <span className="text-lg font-bold text-blue-600">{dias}</span>
          </div>
          
          <input
            type="range"
            min="1"
            max="30"
            value={dias}
            onChange={(e) => setDias(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 dia</span>
            <span>30 dias</span>
          </div>
          
          {dias !== duracaoOriginal && (
            <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
              {dias > duracaoOriginal ? (
                <span className="text-blue-700">
                  +{dias - duracaoOriginal} dias extras
                  {desconto > 0 && <span className="font-semibold"> (Desconto de {desconto}%!)</span>}
                </span>
              ) : (
                <span className="text-orange-700">
                  -{duracaoOriginal - dias} dias a menos
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Seletor de Pessoas */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Número de Pessoas
        </label>
        
        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
          <button
            onClick={() => setPessoas(Math.max(1, pessoas - 1))}
            disabled={pessoas <= 1}
            className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 hover:border-green-500 disabled:border-gray-200 disabled:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          
          <div className="flex-1 text-center">
            <div className="text-2xl font-bold text-green-600">{pessoas}</div>
            <div className="text-sm text-gray-600">
              {pessoas === 1 ? 'pessoa' : 'pessoas'}
            </div>
          </div>
          
          <button
            onClick={() => setPessoas(Math.min(10, pessoas + 1))}
            disabled={pessoas >= 10}
            className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 hover:border-green-500 disabled:border-gray-200 disabled:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Resumo de Preços */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border border-green-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Valor Base:</span>
          <span className="text-gray-600">{formatarMoeda(valorSemDesconto)}</span>
        </div>
        
        {desconto > 0 && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-green-700">Desconto ({desconto}%):</span>
            <span className="text-green-600">-{formatarMoeda(valorSemDesconto - valorTotal)}</span>
          </div>
        )}
        
        <div className="border-t border-gray-200 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-800">Total:</span>
            <span className="text-2xl font-bold text-green-600">{formatarMoeda(valorTotal)}</span>
          </div>
          <div className="text-sm text-gray-600 text-right">
            Para {pessoas} {pessoas === 1 ? 'pessoa' : 'pessoas'} • {dias} {dias === 1 ? 'dia' : 'dias'}
          </div>
        </div>
      </div>

      {/* Botão de Reserva Customizada */}
      <button
        onClick={() => {
          const dataFim = new Date(dataInicio);
          dataFim.setDate(dataFim.getDate() + dias);
          onReservarCustomizado(dias, pessoas, valorTotal, dataInicio, dataFim.toISOString().split('T')[0]);
        }}
        disabled={!dataInicio}
        className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none"
      >
        <span className="flex items-center justify-center gap-2">
          {!dataInicio ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Selecione a data de início
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Reservar Viagem Personalizada
            </>
          )}
        </span>
      </button>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default PackageCustomizer;
