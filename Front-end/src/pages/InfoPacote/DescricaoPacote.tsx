import React from "react";

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

interface DescricaoPacoteProps {
  descricaoTexto?: string;
}

const DescricaoPacote: React.FC<DescricaoPacoteProps> = ({ descricaoTexto }) => {
  const descricao = descricaoTexto || "Descrição do que tem no pacote";
  
  // Estados dos booleanos (poderiam vir de props ou API)
  const comodidades = {
    AmbienteClimatizado: true,
    Tv: true,
    Varanda: false,
    Frigobar: true,
    Disponibilidade: true,
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

      <div className="space-y-4">
        <div className="bg-white/40 rounded-lg p-4 border border-white/20 text-gray-700 leading-relaxed">
          {descricao}
        </div>
      </div>

      {/* Comodidades do quarto */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Comodidades
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {Object.entries(comodidades).map(([key, value]) => (
            <div
              key={key}
              className="group"
            >
              <div className={`
                bg-white/60 border-2 rounded-lg p-3 text-center transition-all duration-300
                ${value 
                  ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50' 
                  : 'border-gray-200 bg-white/40'
                }
              `}>
                <div className={`
                  rounded-full p-2 mb-2 mx-auto w-fit transition-colors
                  ${value ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}
                `}>
                  {icones[key as keyof typeof icones]}
                </div>
                <span className="text-xs font-medium text-gray-700 block mb-1">
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DescricaoPacote;
