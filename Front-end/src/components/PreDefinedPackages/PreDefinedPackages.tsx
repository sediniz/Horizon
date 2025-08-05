import React, { useState } from 'react';
import DatePickerDinamico from '../DatePicker/DatePickerDynamico';

interface PreDefinedPackagesProps {
  valorDiaria: number;
  duracao: number;
  pessoas: number;
  dataIda: string;
  dataVolta: string;
  onDataChange: (dataInicio: string, dataFim: string, valorCalculado: number, duracaoSelecionada: number) => void;
  onReservarPacote: (valorTotal: number) => void;
  className?: string;
}

const PreDefinedPackages: React.FC<PreDefinedPackagesProps> = ({
  valorDiaria,
  duracao,
  pessoas,
  dataIda,
  dataVolta,
  onDataChange,
  onReservarPacote,
  className = ""
}) => {

  const [duracaoSelecionada, setDuracaoSelecionada] = useState(duracao);
  const [valorTotalSelecionado, setValorTotalSelecionado] = useState(valorDiaria * duracao * pessoas);
  const [tipoEstadia, setTipoEstadia] = useState("Pacote Original");

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const getTipoEstadia = (noites: number) => {
    if (noites === duracao) return "Pacote Original";
    if (noites === duracao + 2) return "Pacote +2 dias";
    if (noites === duracao + 4) return "Pacote +4 dias";
    if (noites === duracao + 6) return "Pacote +6 dias";
    return "Personalizado";
  };

  const handleDataPickerChange = (dataInicio: string, dataFim: string, valorCalculado: number, duracaoRecebida: number) => {
    console.log('PreDefinedPackages recebeu:', {
      dataInicio,
      dataFim,
      valorCalculado,
      duracaoRecebida: duracaoRecebida,
      duracaoOriginalProp: duracao
    });
    
    setDuracaoSelecionada(duracaoRecebida);
    setValorTotalSelecionado(valorCalculado);
    setTipoEstadia(getTipoEstadia(duracaoRecebida));
    
    console.log('🔄 Estados atualizados:', {
      duracaoSelecionada: duracaoRecebida,
      valorTotalSelecionado: valorCalculado,
      tipoEstadia: getTipoEstadia(duracaoRecebida)
    });
    
    onDataChange(dataInicio, dataFim, valorCalculado, duracaoRecebida);
  };

  const valorTotalPacote = valorTotalSelecionado;

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-200 ${className}`}>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Pacotes Pré-Definidos</h3>
        <p className="text-gray-600 text-sm">Escolha entre nossas opções de datas já organizadas</p>
      </div>

      {/* Seletor de Datas */}
      <div className="mb-6">
        <DatePickerDinamico
          valorDiaria={valorDiaria}
          quantidadePessoas={pessoas}
          duracaoPacote={duracao}
          duracaoFixa={false} 
          onDataChange={handleDataPickerChange}
          dataInicialSugerida={dataIda}
        />
      </div>

      {/* Resumo do Pacote Selecionado - Atualizado dinamicamente */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-xl border-2 border-blue-200 mb-6 shadow-lg">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-lg font-bold text-blue-800">{tipoEstadia}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-6 mb-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-blue-900">{duracaoSelecionada}</div>
              <div className="text-sm text-blue-600 font-medium">{duracaoSelecionada === 1 ? 'dia' : 'dias'}</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-purple-900">{pessoas}</div>
              <div className="text-sm text-purple-600 font-medium">{pessoas === 1 ? 'pessoa' : 'pessoas'}</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-green-900">{formatarMoeda(valorTotalPacote)}</div>
              <div className="text-sm text-green-600 font-medium">Total</div>
            </div>
          </div>
          
          <div className="bg-white/80 p-3 rounded-lg">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-gray-800">{formatarMoeda(valorDiaria)}</span> por pessoa/dia
            </div>
            {duracaoSelecionada !== duracao && (
              <div className="text-xs mt-1">
                {duracaoSelecionada > duracao ? (
                  <span className="text-green-600 font-medium">
                    +{duracaoSelecionada - duracao} dias extras com desconto!
                  </span>
                ) : (
                  <span className="text-orange-600 font-medium">
                    -{duracao - duracaoSelecionada} dias
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Informações de Datas Selecionadas */}
      {dataIda && dataVolta && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Datas Selecionadas:</h5>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-gray-500">Check-in:</span>
              <p className="font-semibold text-gray-800">
                {new Date(dataIda + 'T00:00:00').toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div>
              <span className="text-xs text-gray-500">Check-out:</span>
              <p className="font-semibold text-gray-800">
                {new Date(dataVolta + 'T00:00:00').toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Botão de Reserva do Pacote */}
      <button
        onClick={() => onReservarPacote(valorTotalPacote)}
        disabled={!dataIda || !dataVolta}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none"
      >
        {!dataIda || !dataVolta ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Selecione as datas
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Reservar {tipoEstadia}
          </span>
        )}
      </button>
    </div>
  );
};

export default PreDefinedPackages;