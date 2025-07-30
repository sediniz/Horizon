import React, { useState } from 'react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50">
      {/* Header com informações da busca */}
      <div className="bg-gradient-to-r from-sky-600 to-cyan-600 shadow-lg border-b-4 border-b-cyan-400 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-cyan-200 text-xl">✈️</span>
              <span className="font-semibold text-white text-shadow">GRU → RIO</span>
            </div>
            <div className="text-cyan-200">|</div>
            <div className="text-white">2 adultos</div>
          </div>
          <button className="bg-white/20 hover:bg-white/30 text-white font-medium px-4 py-2 rounded-lg backdrop-blur-sm transition-all duration-300 hover:scale-105">
            Alterar busca
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar com filtros */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-sky-50 to-cyan-50 rounded-xl shadow-lg shadow-sky-200/50 border border-cyan-200 p-6 space-y-6">
              {/* Explorar mapa */}
              <div className="bg-gradient-to-br from-cyan-100 to-sky-100 rounded-xl p-4 text-center border border-cyan-200 shadow-md">
                <div className="text-4xl mb-2">🗺️</div>
                <button className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-200">
                  Explorar mapa ›
                </button>
              </div>

              {/* Opções de pagamento */}
              <div>
                <button className="flex items-center justify-between w-full text-left font-semibold text-slate-700 mb-3 hover:text-sky-600 transition-colors">
                  Opções de pagamento
                  <span className="text-slate-400">⌄</span>
                </button>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 hover:bg-sky-50 p-2 rounded-lg transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="pagamento"
                      value="todas"
                      checked={filters.pagamento === 'todas'}
                      onChange={handleFilterChange}
                      className="text-cyan-500 focus:ring-cyan-300"
                    />
                    <span className="text-sm text-slate-600">Todas</span>
                    <span className="text-sm ml-auto bg-sky-100 text-sky-600 px-2 py-1 rounded-full font-medium">669</span>
                  </label>
                  <label className="flex items-center gap-2 hover:bg-sky-50 p-2 rounded-lg transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="pagamento"
                      value="parcelas"
                      checked={filters.pagamento === 'parcelas'}
                      onChange={handleFilterChange}
                      className="text-cyan-500 focus:ring-cyan-300"
                    />
                    <span className="text-sm text-slate-600">Em parcelas</span>
                    <span className="text-sm ml-auto bg-sky-100 text-sky-600 px-2 py-1 rounded-full font-medium">669</span>
                  </label>
                </div>
              </div>

              {/* Políticas de cancelamento */}
              <div>
                <button className="flex items-center justify-between w-full text-left font-semibold text-slate-700 mb-3 hover:text-sky-600 transition-colors">
                  Políticas de cancelamento
                  <span className="text-slate-400">⌄</span>
                </button>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 hover:bg-sky-50 p-2 rounded-lg transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      name="reservaFlexivel"
                      checked={filters.reservaFlexivel}
                      onChange={handleFilterChange}
                      className="text-cyan-500 focus:ring-cyan-300 rounded"
                    />
                    <div className="flex-1">
                      <div className="text-sm text-slate-600 font-medium">Reserva flexível</div>
                      <div className="text-xs text-slate-500">Cancelamento grátis 3 dias ou menos antes do check-in</div>
                    </div>
                    <span className="text-sm bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full font-medium">122</span>
                  </label>
                </div>
              </div>

              {/* Pontuação */}
              <div>
                <h3 className="font-semibold text-slate-700 mb-3">Pontuação</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 hover:bg-sky-50 p-2 rounded-lg transition-colors cursor-pointer">
                    <input type="checkbox" className="text-cyan-500 focus:ring-cyan-300 rounded" />
                    <span className="text-sm text-slate-600">9 ou mais - Excelente</span>
                    <span className="text-sm ml-auto bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full font-medium">149</span>
                  </label>
                  <label className="flex items-center gap-2 hover:bg-sky-50 p-2 rounded-lg transition-colors cursor-pointer">
                    <input type="checkbox" className="text-cyan-500 focus:ring-cyan-300 rounded" />
                    <span className="text-sm text-slate-600">8 ou mais - Muito bom</span>
                    <span className="text-sm ml-auto bg-sky-100 text-sky-600 px-2 py-1 rounded-full font-medium">294</span>
                  </label>
                  <label className="flex items-center gap-2 hover:bg-sky-50 p-2 rounded-lg transition-colors cursor-pointer">
                    <input type="checkbox" className="text-cyan-500 focus:ring-cyan-300 rounded" />
                    <span className="text-sm text-slate-600">7 ou mais - Confortável</span>
                    <span className="text-sm ml-auto bg-amber-100 text-amber-600 px-2 py-1 rounded-full font-medium">325</span>
                  </label>
                  <label className="flex items-center gap-2 hover:bg-sky-50 p-2 rounded-lg transition-colors cursor-pointer">
                    <input type="checkbox" className="text-cyan-500 focus:ring-cyan-300 rounded" />
                    <span className="text-sm text-slate-600">6 ou mais - Bom</span>
                    <span className="text-sm ml-auto bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium">331</span>
                  </label>
                </div>
              </div>

              {/* Estrelas */}
              <div>
                <h3 className="font-medium text-gray-800 mb-3">Estrelas</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="text-blue-600" />
                    <span className="text-sm">Todas as estrelas</span>
                    <span className="text-sm text-gray-400 ml-auto">669</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="text-blue-600" />
                    <span className="text-sm text-yellow-500">⭐⭐⭐⭐⭐</span>
                    <span className="text-sm text-gray-400 ml-auto">19</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="text-blue-600" />
                    <span className="text-sm text-yellow-500">⭐⭐⭐⭐</span>
                    <span className="text-sm text-gray-400 ml-auto">77</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="text-blue-600" />
                    <span className="text-sm text-yellow-500">⭐⭐⭐</span>
                    <span className="text-sm text-gray-400 ml-auto">121</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="text-blue-600" />
                    <span className="text-sm text-yellow-500">⭐⭐</span>
                    <span className="text-sm text-gray-400 ml-auto">100</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="text-blue-600" />
                    <span className="text-sm text-yellow-500">⭐</span>
                    <span className="text-sm text-gray-400 ml-auto">3</span>
                  </label>
                </div>
              </div>

              {/* Tipo de hospedagem */}
              <div>
                <h3 className="font-medium text-gray-800 mb-3">Tipo de hospedagem</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="text-blue-600" />
                    <span className="text-sm">Todas as opções</span>
                    <span className="text-sm text-gray-400 ml-auto">669</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="text-blue-600" />
                    <span className="text-sm">Casas para Alugar</span>
                    <span className="text-sm text-gray-400 ml-auto">28</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="text-blue-600" />
                    <span className="text-sm">Bed and Breakfasts</span>
                    <span className="text-sm text-gray-400 ml-auto">1</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="text-blue-600" />
                    <span className="text-sm">Hotéis Boutique</span>
                    <span className="text-sm text-gray-400 ml-auto">1</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="text-blue-600" />
                    <span className="text-sm">Chalés</span>
                    <span className="text-sm text-gray-400 ml-auto">2</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de hotéis */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {hoteis.map((hotel) => (
                <div key={hotel.id} className="bg-white rounded-xl shadow-lg shadow-sky-200/50 border border-cyan-200 hover:shadow-xl hover:shadow-cyan-200/60 hover:scale-[1.02] transition-all duration-300">
                  <div className="p-6">
                    <div className="flex gap-4">
                      <div className="relative">
                        <img
                          src={hotel.imagem}
                          alt={hotel.nome}
                          className="w-48 h-36 object-cover rounded-xl shadow-md"
                        />
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-cyan-500 to-sky-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
                          Oferta
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-1">{hotel.nome}</h3>
                            <p className="text-sm text-slate-600 mb-2">{hotel.localizacao}</p>
                            <div className="flex items-center gap-3 mt-1">
                              {hotel.vooIncluido && (
                                <span className="text-sm text-slate-600 bg-sky-50 px-2 py-1 rounded-lg border border-sky-200">
                                  Voo direto SAO <span className="text-sky-600">✈️</span> RIO
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-gradient-to-r from-cyan-500 to-sky-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md shadow-cyan-200">
                                {hotel.avaliacao}
                              </span>
                              <div className="text-yellow-500 text-lg">
                                {'⭐'.repeat(hotel.estrelas)}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-end mt-4">
                          <div className="flex flex-col gap-2">
                            {hotel.ofertaInclusiva && (
                              <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-md">
                                Oferta Inclusiva
                              </span>
                            )}
                            {hotel.restam && (
                              <p className="text-sm text-red-600 font-medium bg-red-50 px-2 py-1 rounded-lg border border-red-200">
                                🔥 Restam apenas {hotel.restam}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-slate-600 mb-1">
                              Voo + Hospedagem
                            </div>
                            <div className="text-sm text-slate-500 mb-1">
                              Preço por pessoa
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-600">
                                R$ {hotel.preco}
                              </span>
                            </div>
                            <div className="text-sm text-slate-600 mb-1">
                              Total 2 pessoas R$ {hotel.preco * 2}
                            </div>
                            <div className="text-xs text-slate-500 mb-3">
                              Sem impostos, taxas e encargos
                            </div>
                            <button className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-200">
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
