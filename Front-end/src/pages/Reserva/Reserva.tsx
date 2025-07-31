import React, { useState } from 'react';
import Rating from '../../components/Rating/Rating';

export default function Reserva() {
  const [filters, setFilters] = useState({
    pontuacao: '',
    estrelas: '',
    tipoHospedagem: '',
    pagamento: 'todas',
    reservaFlexivel: false
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const hoteis = [
    {
      id: 1,
      nome: "Rede Andrade Lapa Hotel",
      localizacao: "Rio de Janeiro",
      avaliacao: 8.3,
      estrelas: 3,
      preco: 593,
      precoOriginal: 654,
      economize: 116,
      imagem: "/src/assets/img1.jpeg",
      restam: 2,
      vooIncluido: true
    },
    {
      id: 2,
      nome: "Américas Copacabana Hotel",
      localizacao: "Rio de Janeiro, Copacabana, A 2,76 km do centro",
      avaliacao: 8.2,
      estrelas: 4,
      preco: 1060,
      precoOriginal: 1200,
      economize: 140,
      imagem: "/src/assets/img2.png",
      vooIncluido: true,
      ofertaInclusiva: true
    },
    {
      id: 3,
      nome: "B&B Hotéis Rio de Janeiro Copacabana Forte",
      localizacao: "Rio de Janeiro, Copacabana, A 3,42 km do centro",
      avaliacao: 8.8,
      estrelas: 4,
      preco: 898,
      precoOriginal: 1050,
      economize: 152,
      imagem: "/src/assets/img3.png",
      restam: 3,
      vooIncluido: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <style>{`
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .glass-effect {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
      `}</style>

      <div className="max-w-7xl mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar com filtros */}
          <div className="w-full lg:w-80 lg:flex-shrink-0">
            <div className="glass-effect rounded-2xl p-6 shadow-xl h-fit border border-white/20 backdrop-blur-sm space-y-6">
              {/* Header da sidebar */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Filtros</h2>
              </div>

              {/* Explorar mapa modernizado */}
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 text-center border border-white/30 shadow-lg">
                <div className="text-4xl mb-2">🗺️</div>
                <button className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  Explorar mapa ›
                </button>
              </div>

              {/* Opções de pagamento */}
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                <button className="flex items-center justify-between w-full text-left font-bold text-gray-800 mb-4 hover:text-blue-600 transition-colors">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span>Opções de pagamento</span>
                  </div>
                  <span className="text-gray-400">⌄</span>
                </button>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 hover:bg-white/40 p-2 rounded-lg transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="pagamento"
                      value="todas"
                      checked={filters.pagamento === 'todas'}
                      onChange={handleFilterChange}
                      className="text-blue-500 focus:ring-blue-300"
                    />
                    <span className="text-sm font-medium text-gray-700 flex-1">Todas</span>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-bold">669</span>
                  </label>
                  <label className="flex items-center gap-3 hover:bg-white/40 p-2 rounded-lg transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="pagamento"
                      value="parcelas"
                      checked={filters.pagamento === 'parcelas'}
                      onChange={handleFilterChange}
                      className="text-blue-500 focus:ring-blue-300"
                    />
                    <span className="text-sm font-medium text-gray-700 flex-1">Em parcelas</span>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-bold">669</span>
                  </label>
                </div>
              </div>

              {/* Políticas de cancelamento */}
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                <button className="flex items-center justify-between w-full text-left font-bold text-gray-800 mb-4 hover:text-blue-600 transition-colors">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Políticas de cancelamento</span>
                  </div>
                  <span className="text-gray-400">⌄</span>
                </button>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 hover:bg-white/40 p-2 rounded-lg transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      name="reservaFlexivel"
                      checked={filters.reservaFlexivel}
                      onChange={handleFilterChange}
                      className="text-green-500 focus:ring-green-300 rounded mt-1"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-700">Reserva flexível</div>
                      <div className="text-xs text-gray-500 leading-tight">Cancelamento grátis 3 dias ou menos antes do check-in</div>
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full font-bold">122</span>
                  </label>
                </div>
              </div>

              {/* Pontuação */}
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                <div className="flex items-center space-x-2 mb-4">
                  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <h3 className="font-bold text-gray-800">Pontuação</h3>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 hover:bg-white/40 p-2 rounded-lg transition-colors cursor-pointer">
                    <input type="checkbox" className="text-emerald-500 focus:ring-emerald-300 rounded" />
                    <span className="text-sm font-medium text-gray-700 flex-1">9 ou mais - Excelente</span>
                    <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full font-bold">149</span>
                  </label>
                  <label className="flex items-center gap-3 hover:bg-white/40 p-2 rounded-lg transition-colors cursor-pointer">
                    <input type="checkbox" className="text-blue-500 focus:ring-blue-300 rounded" />
                    <span className="text-sm font-medium text-gray-700 flex-1">8 ou mais - Muito bom</span>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-bold">294</span>
                  </label>
                  <label className="flex items-center gap-3 hover:bg-white/40 p-2 rounded-lg transition-colors cursor-pointer">
                    <input type="checkbox" className="text-amber-500 focus:ring-amber-300 rounded" />
                    <span className="text-sm font-medium text-gray-700 flex-1">7 ou mais - Confortável</span>
                    <span className="text-xs bg-amber-100 text-amber-600 px-2 py-1 rounded-full font-bold">325</span>
                  </label>
                  <label className="flex items-center gap-3 hover:bg-white/40 p-2 rounded-lg transition-colors cursor-pointer">
                    <input type="checkbox" className="text-orange-500 focus:ring-orange-300 rounded" />
                    <span className="text-sm font-medium text-gray-700 flex-1">6 ou mais - Bom</span>
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-bold">331</span>
                  </label>
                </div>
              </div>

              {/* Estrelas */}
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                <div className="flex items-center space-x-2 mb-4">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <h3 className="font-bold text-gray-800">Estrelas</h3>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 hover:bg-white/40 p-2 rounded-lg transition-colors cursor-pointer">
                    <input type="checkbox" className="text-blue-500 focus:ring-blue-300 rounded" />
                    <span className="text-sm font-medium text-gray-700 flex-1">Todas as estrelas</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-bold">669</span>
                  </label>
                  <label className="flex items-center gap-3 hover:bg-white/40 p-2 rounded-lg transition-colors cursor-pointer">
                    <input type="checkbox" className="text-blue-500 focus:ring-blue-300 rounded" />
                    <div className="flex items-center flex-1">
                      <Rating rating={5} size="sm" />
                    </div>
                    <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full font-bold">19</span>
                  </label>
                  <label className="flex items-center gap-3 hover:bg-white/40 p-2 rounded-lg transition-colors cursor-pointer">
                    <input type="checkbox" className="text-blue-500 focus:ring-blue-300 rounded" />
                    <div className="flex items-center flex-1">
                      <Rating rating={4} size="sm" />
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-bold">77</span>
                  </label>
                  <label className="flex items-center gap-3 hover:bg-white/40 p-2 rounded-lg transition-colors cursor-pointer">
                    <input type="checkbox" className="text-blue-500 focus:ring-blue-300 rounded" />
                    <div className="flex items-center flex-1">
                      <Rating rating={3} size="sm" />
                    </div>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-bold">121</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de hotéis */}
          <div className="flex-1">
            <div className="space-y-4">
              {hoteis.map((hotel) => (
                <div key={hotel.id} className="bg-white rounded-xl shadow-lg shadow-sky-200/50 border border-cyan-200 hover:shadow-xl hover:shadow-cyan-200/60 hover:scale-[1.02] transition-all duration-300">
                  <div className="p-3 lg:p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative w-full sm:w-44 flex-shrink-0">
                        <img
                          src={hotel.imagem}
                          alt={hotel.nome}
                          className="w-full h-40 sm:h-32 object-cover rounded-lg shadow-md"
                        />
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-cyan-500 to-sky-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-lg">
                          Oferta
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
                          <div className="flex-1 mb-2 sm:mb-0">
                            <h3 className="text-lg font-bold text-slate-800 mb-1">{hotel.nome}</h3>
                            <p className="text-sm text-slate-600 mb-1">{hotel.localizacao}</p>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              {hotel.vooIncluido && (
                                <span className="text-xs text-slate-600 bg-sky-50 px-2 py-1 rounded-md border border-sky-200">
                                  Voo direto SAO <span className="text-sky-600">✈️</span> RIO
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-left sm:text-right">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="bg-gradient-to-r from-cyan-500 to-sky-500 text-white px-2 py-1 rounded-full text-sm font-bold shadow-md shadow-cyan-200">
                                {hotel.avaliacao}
                              </span>
                              <Rating rating={hotel.estrelas} size="sm" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mt-2 gap-3">
                          <div className="flex flex-col gap-1">
                            {hotel.ofertaInclusiva && (
                              <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-md w-fit">
                                Oferta Inclusiva
                              </span>
                            )}
                            {hotel.restam && (
                              <p className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded-md border border-red-200 w-fit">
                                🔥 Restam apenas {hotel.restam}
                              </p>
                            )}
                          </div>
                          <div className="text-left sm:text-right">
                            <div className="text-xs text-slate-600 mb-1">
                              Voo + Hospedagem
                            </div>
                            <div className="text-xs text-slate-500 mb-1">
                              Preço por pessoa
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-600">
                                R$ {hotel.preco}
                              </span>
                            </div>
                            <div className="text-xs text-slate-600 mb-1">
                              Total 2 pessoas R$ {hotel.preco * 2}
                            </div>
                            <div className="text-xs text-slate-500 mb-2">
                              Sem impostos, taxas e encargos
                            </div>
                            <button className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-200">
                              Ver detalhe
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Banner promocional */}
            <div className="mt-8 bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-700 rounded-xl p-8 text-white shadow-xl shadow-sky-300/30 border border-cyan-400">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-shadow">Com pacotes você economiza até 30%</h3>
                  <p className="text-sky-100 text-lg">Compare preços e encontre as melhores ofertas</p>
                </div>
                <div className="text-6xl opacity-80">📊</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
