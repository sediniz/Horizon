
//implementar o calendario de garcia

import React, { useState } from "react";

interface ReservaCardProps {
  preco: string;
  valorDiaria?: number;
  valorTotal?: number;
  duracaoPacote?: number;
  dataIda?: string;
  dataVolta?: string;
  pessoas?: number; // Número de pessoas no pacote
  onReservar: (valorPacoteSelecionado: number) => void;
  mostrarOpcoes?: boolean; // Nova prop para controlar se mostra as opções de noites
}

const ReservaCard: React.FC<ReservaCardProps> = ({ 
  valorDiaria = 400, 
  duracaoPacote = 5,
  dataIda = '',
  dataVolta = '',
  pessoas = 1,
  onReservar,
  valorTotal,
  mostrarOpcoes = true
}) => {
  // Valor base da diária por pessoa - usa o valor do backend ou o default
  const diaria = valorDiaria;
  
  // Se temos um valorTotal específico do DatePicker dinâmico, usar ele
  const valorFinalCalculado = valorTotal || (diaria * duracaoPacote * pessoas);
  
  // Formatar as datas para exibição
  const formatarDataParaExibicao = (dataString: string) => {
    if (!dataString) return '';
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return dataString;
    }
  };
  // Array de noites, baseado na duração padrão do pacote
  const noitesArray = React.useMemo(() => {
    // Duração do pacote como opção central
    const baseNoites = duracaoPacote || 5;
    
    // Criar opções ao redor da duração base
    // Por exemplo, se duracaoPacote = 7, opções serão [3, 5, 7, 9]
    return [
      Math.max(3, baseNoites - 4), // Mínimo de 3 noites
      Math.max(baseNoites - 2, 3), // Mínimo de 3 noites
      baseNoites,
      baseNoites + 2
    ].filter((v, i, a) => a.indexOf(v) === i); // Remove duplicados
  }, [duracaoPacote]);
  const [precoSelecionado, setPrecoSelecionado] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [dataVoltaCalculada, setDataVoltaCalculada] = useState(dataVolta);
  
  // Gera os preços multiplicados (diária por pessoa x noites x pessoas)
  const precosGrid = noitesArray.map(noites => ({ 
    valor: diaria * noites * pessoas,  // Valor total (diária x noites x pessoas)
    valorPorPessoa: diaria * noites,   // Valor por pessoa (diária x noites)
    noites 
  }));
  
  // Atualiza a data de volta quando o número de noites mudar
  React.useEffect(() => {
    if (dataIda && precoSelecionado !== null) {
      try {
        const dataIdaObj = new Date(dataIda);
        const novaDataVolta = new Date(dataIdaObj);
        novaDataVolta.setDate(dataIdaObj.getDate() + precosGrid[precoSelecionado].noites);
        setDataVoltaCalculada(novaDataVolta.toISOString().split('T')[0]);
      } catch (e) {
        console.error("Erro ao calcular nova data de volta:", e);
      }
    }
  }, [dataIda, precoSelecionado, precosGrid]);

  const handleConfirmarReserva = () => {
    setShowModal(true);
  };

  const handleConfirmarModal = () => {
    setShowModal(false);
    // Se não estamos mostrando opções (usando DatePicker dinâmico), usar o valor calculado
    if (!mostrarOpcoes && valorFinalCalculado) {
      console.log("Valor final calculado a ser passado:", valorFinalCalculado);
      onReservar(valorFinalCalculado);
    } else {
      // Pegar o valor do pacote selecionado atual
      const valorPacoteSelecionado = precoSelecionado !== null ? precosGrid[precoSelecionado].valor : valorFinalCalculado;
      console.log("Valor do pacote selecionado a ser passado:", valorPacoteSelecionado);
      onReservar(valorPacoteSelecionado);
    }
  };

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/30 hover:shadow-lg transition-all duration-300">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          Reservar Pacote
        </h3>
        <div className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-3 py-1 rounded-md inline-block font-medium text-sm shadow-md">
          R$ {diaria.toFixed(2).replace('.', ',')} por pessoa/diária
        </div>
        
        {dataIda && dataVolta && (
          <div className="mt-2 text-sm text-gray-600">
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>
                {formatarDataParaExibicao(dataIda)} - {formatarDataParaExibicao(precoSelecionado !== null ? dataVoltaCalculada : dataVolta)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Opções de noites/preços ou valor fixo */}
      {mostrarOpcoes ? (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3 text-center">Escolha seu pacote:</h4>
          <div className="grid grid-cols-2 gap-2">
            {precosGrid.map((item, idx) => (
              <button
                key={idx}
                className={`
                p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                  precoSelecionado === idx 
                    ? 'border-green-500 bg-green-50 text-green-800 font-bold shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                }`}
                onClick={() => {
                  setPrecoSelecionado(idx);
                  console.log(`Selecionado pacote ${idx} com valor ${item.valor}`);
                }}
              >
                <div className="font-bold text-lg">R$ {item.valor.toFixed(2).replace('.', ',')}</div>
                <div className="text-sm opacity-90">{item.noites} noites ({pessoas} {pessoas === 1 ? 'pessoa' : 'pessoas'})</div>
                <div className="text-xs opacity-80">R$ {item.valorPorPessoa.toFixed(2).replace('.', ',')} por pessoa</div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
          <div className="text-center">
            <div className="text-sm text-blue-700 font-medium">Valor Total Calculado</div>
            <div className="text-2xl font-bold text-blue-800">
              R$ {valorFinalCalculado.toFixed(2).replace('.', ',')}
            </div>
            <div className="text-sm text-blue-700 mt-1">
              Para {pessoas} {pessoas === 1 ? 'pessoa' : 'pessoas'}
            </div>
            {dataIda && dataVolta && (
              <div className="text-sm text-blue-600 mt-2">
                {Math.ceil((new Date(dataVolta).getTime() - new Date(dataIda).getTime()) / (1000 * 60 * 60 * 24))} noites selecionadas
              </div>
            )}
          </div>
        </div>
      )}

      {mostrarOpcoes && precoSelecionado !== null && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <div className="text-center">
            <div className="text-sm text-green-700 font-medium">Pacote Selecionado</div>
            <div className="text-lg font-bold text-green-800">
              R$ {precosGrid[precoSelecionado].valor.toFixed(2).replace('.', ',')} total
            </div>
            <div className="text-sm text-green-700 mt-1">
              {precosGrid[precoSelecionado].noites} noites • {pessoas} {pessoas === 1 ? 'pessoa' : 'pessoas'} • R$ {precosGrid[precoSelecionado].valorPorPessoa.toFixed(2).replace('.', ',')} por pessoa
            </div>
            <div className="text-sm text-green-600">
              {precosGrid[precoSelecionado].noites === duracaoPacote ? (
                <span>Duração recomendada!</span>
              ) : precosGrid[precoSelecionado].noites > duracaoPacote ? (
                <span>Aproveite mais {precosGrid[precoSelecionado].noites - duracaoPacote} noites!</span>
              ) : (
                <span>Economize R$ {((duracaoPacote - precosGrid[precoSelecionado].noites) * diaria * 0.1).toFixed(2).replace('.', ',')}!</span>
              )}
            </div>
          </div>
        </div>
      )}

      <button 
        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-green-200"
        onClick={handleConfirmarReserva}
      >
        <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Confirmar Reserva
      </button>
      
      <div className="mt-4 text-center text-xs text-gray-500">
        <div className="flex items-center justify-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Cancelamento gratuito até 24h antes
        </div>
      </div>

      {/* Modal de Confirmação */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 max-w-md w-full mx-4 border border-white/30 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Confirmar Reserva</h3>
              <p className="text-gray-600 mb-1">
                {mostrarOpcoes ? (
                  <>Você está prestes a reservar o pacote de {precosGrid[precoSelecionado].noites} noites para {pessoas} {pessoas === 1 ? 'pessoa' : 'pessoas'}</>
                ) : (
                  <>Você está prestes a reservar este pacote para {pessoas} {pessoas === 1 ? 'pessoa' : 'pessoas'}</>
                )}
              </p>
              
              {dataIda && (mostrarOpcoes ? dataVoltaCalculada : dataVolta) && (
                <div className="flex items-center justify-center gap-2 text-gray-600 mb-3 text-sm">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>
                    De {formatarDataParaExibicao(dataIda)} até {formatarDataParaExibicao(mostrarOpcoes ? dataVoltaCalculada : dataVolta)}
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <p className="text-2xl font-bold text-green-600">
                  {mostrarOpcoes ? (
                    <>R$ {precosGrid[precoSelecionado].valor.toFixed(2).replace('.', ',')}</>
                  ) : (
                    <>R$ {valorFinalCalculado.toFixed(2).replace('.', ',')}</>
                  )}
                </p>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    {pessoas} {pessoas === 1 ? 'pessoa' : 'pessoas'}
                  </span>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    {mostrarOpcoes ? (
                      <>R$ {precosGrid[precoSelecionado].valorPorPessoa.toFixed(2).replace('.', ',')} por pessoa</>
                    ) : (
                      <>R$ {(valorFinalCalculado / pessoas).toFixed(2).replace('.', ',')} por pessoa</>
                    )}
                  </span>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6 text-left">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Política de Cancelamento</p>
                    <p className="text-xs text-yellow-700">Cancelamento gratuito até 24h antes da viagem</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-semibold transition-all duration-300"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                  onClick={handleConfirmarModal}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservaCard;
