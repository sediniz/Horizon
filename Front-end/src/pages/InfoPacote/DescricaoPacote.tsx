import React, { useState } from "react";


// Ícones SVG inline para cada comodidade
const icones = {
  AmbienteClimatizado: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v2m0 16v2m8-10h2M2 12H4m15.07-7.07l1.42 1.42M4.93 19.07l1.42-1.42M19.07 19.07l-1.42-1.42M4.93 4.93L6.35 6.35" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  Tv: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="15" rx="2"/><path d="M8 2l4 4 4-4"/></svg>
  ),
  Varanda: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="10" width="18" height="8" rx="2"/><path d="M7 10V6a5 5 0 0 1 10 0v4"/></svg>
  ),
  Frigobar: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="6" y="3" width="12" height="18" rx="2"/><path d="M6 9h12"/></svg>
  ),
  Disponibilidade: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
  ),
};

const nomes = {
  AmbienteClimatizado: 'Ambiente Climatizado',
  Tv: 'TV',
  Varanda: 'Varanda',
  Frigobar: 'Frigobar',
  Disponibilidade: 'Disponível',
};

const DescricaoPacote: React.FC = () => {
  const [descricao, setDescricao] = useState("Descrição do que tem no pacote");
  const [editando, setEditando] = useState(false);
  const [tempDescricao, setTempDescricao] = useState(descricao);
  // Estados dos booleanos (poderiam vir de props ou API)
  const [comodidades, setComodidades] = useState({
    AmbienteClimatizado: true,
    Tv: true,
    Varanda: false,
    Frigobar: true,
    Disponibilidade: true,
  });

  const handleSalvar = () => {
    setDescricao(tempDescricao);
    setEditando(false);
  };

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/30 hover:shadow-lg transition-all duration-300">
      <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </div>
        Descrição do Pacote
      </h2>

      {editando ? (
        <div className="space-y-4">
          <textarea
            className="w-full bg-white/70 border border-gray-200 rounded-lg px-4 py-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-colors resize-none"
            value={tempDescricao}
            onChange={e => setTempDescricao(e.target.value)}
            placeholder="Descreva os detalhes do pacote..."
          />
          <div className="flex gap-3">
            <button 
              className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              onClick={handleSalvar}
            >
              Salvar
            </button>
            <button 
              className="bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              onClick={() => setEditando(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white/40 rounded-lg p-4 border border-white/20 text-gray-700 leading-relaxed">
            {descricao}
          </div>
          <button 
            className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
            onClick={() => setEditando(true)}
          >
            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar Descrição
          </button>
        </div>
      )}

      {/* Comodidades do quarto */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Comodidades
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Object.entries(comodidades).map(([key, value]) => (
            <button
              key={key}
              type="button"
              className="group focus:outline-none"
              onClick={() => setComodidades(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
            >
              <div className={`
                bg-white/60 border-2 rounded-xl p-4 text-center transition-all duration-300 hover:scale-105 hover:shadow-md
                ${value 
                  ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50' 
                  : 'border-gray-200 bg-white/40 hover:border-gray-300'
                }
              `}>
                <div className={`
                  rounded-full p-3 mb-2 mx-auto w-fit transition-colors
                  ${value ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}
                `}>
                  {icones[key as keyof typeof icones]}
                </div>
                <span className="text-sm font-medium text-gray-700 block mb-1">
                  {nomes[key as keyof typeof nomes]}
                </span>
                <span className={`
                  text-xs font-bold px-2 py-1 rounded-full
                  ${value 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-500'
                  }
                `}>
                  {value ? 'Incluído' : 'Não incluído'}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DescricaoPacote;
