
//implementar o calendario de garcia

import React, { useState } from "react";

interface ReservaCardProps {
  preco: string;
  onReservar: () => void;
}

const ReservaCard: React.FC<ReservaCardProps> = ({  onReservar }) => {

  // Valor base da diária
  const diaria = 400;
  // Array de noites: 3, 5, 7, 9 (pulando de 2 em 2)
  const noitesArray = [3, 5, 7, 9];
  const [precoSelecionado, setPrecoSelecionado] = useState(0);
  const [showModal, setShowModal] = useState(false);
  // Removido estados de calendário customizado

  // Gera os preços multiplicados
  const precosGrid = noitesArray.map(noites => ({ valor: diaria * noites, noites }));

  const handleConfirmarReserva = () => {
    setShowModal(true);
  };

  const handleConfirmarModal = () => {
    setShowModal(false);
    onReservar();
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
          R$ {diaria} por diária
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3 text-center">Escolha seu pacote:</h4>
        <div className="grid grid-cols-2 gap-2">
          {precosGrid.map((item, idx) => (
            <button
              key={idx}
              className={`
                p-4 rounded-lg border-2 text-center transition-all duration-300 hover:scale-105
                ${precoSelecionado === idx 
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white border-sky-500 shadow-lg' 
                  : 'bg-white/70 border-gray-200 text-gray-700 hover:border-sky-300 hover:bg-white/90'
                }
              `}
              onClick={() => {
                setPrecoSelecionado(idx);
              }}
            >
              <div className="font-bold text-lg">R$ {item.valor}</div>
              <div className="text-sm opacity-90">{item.noites} noites</div>
            </button>
          ))}
        </div>
      </div>

      {precoSelecionado !== null && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <div className="text-center">
            <div className="text-sm text-green-700 font-medium">Pacote Selecionado</div>
            <div className="text-lg font-bold text-green-800">
              R$ {precosGrid[precoSelecionado].valor} por {precosGrid[precoSelecionado].noites} noites
            </div>
            <div className="text-sm text-green-600">
              Economize R$ {(precosGrid[precoSelecionado].noites * diaria * 0.1).toFixed(0)} com este pacote!
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
              <p className="text-gray-600 mb-2">
                Você está prestes a reservar o pacote de {precosGrid[precoSelecionado].noites} noites
              </p>
              <p className="text-2xl font-bold text-green-600 mb-6">
                R$ {precosGrid[precoSelecionado].valor}
              </p>
              
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
