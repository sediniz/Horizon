import React from "react";

// Ícones SVG inline para cada comodidade do hotel
const icones = {
  wifi: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5a2.5 2.5 0 002.5 2.5M1 8.5C1 4 5 1 12 1s11 3 11 7.5M3 12.5C3 8.5 7 5.5 12 5.5s9 3 9 7M5 16.5C5 14 8 12 12 12s7 2 7 4.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  estacionamento: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 2h8l4 9H4l4-9zM1 11h22M5 11v10h14V11" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  piscina: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M2 20h20M6 8h12l-1 12H7L6 8zM12 4v4" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  petFriendly: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  cafeDaManha: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  almoco: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3z" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  jantar: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3z" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  allInclusive: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
};

const nomes = {
  wifi: 'Wi-Fi Gratuito',
  estacionamento: 'Estacionamento',
  piscina: 'Piscina',
  petFriendly: 'Pet Friendly',
  cafeDaManha: 'Café da Manhã',
  almoco: 'Almoço',
  jantar: 'Jantar',
  allInclusive: 'All Inclusive',
};

interface DescricaoPacoteProps {
  descricaoTexto?: string;
  hotelInfo?: {
    wifi?: boolean;
    estacionamento?: boolean;
    piscina?: boolean;
    petFriendly?: boolean;
    cafeDaManha?: boolean;
    almoco?: boolean;
    jantar?: boolean;
    allInclusive?: boolean;
  };
}

const DescricaoPacote: React.FC<DescricaoPacoteProps> = ({ descricaoTexto, hotelInfo }) => {
  const descricao = descricaoTexto || "Descrição do que tem no pacote";
  
  const comodidadesDoHotel = hotelInfo ? {
    wifi: hotelInfo.wifi || false,
    estacionamento: hotelInfo.estacionamento || false,
    piscina: hotelInfo.piscina || false,
    petFriendly: hotelInfo.petFriendly || false,
    cafeDaManha: hotelInfo.cafeDaManha || false,
    almoco: hotelInfo.almoco || false,
    jantar: hotelInfo.jantar || false,
    allInclusive: hotelInfo.allInclusive || false,
  } : {
    // Fallback caso não tenha informações do hotel
    wifi: true,
    estacionamento: false,
    piscina: true,
    petFriendly: false,
    cafeDaManha: true,
    almoco: false,
    jantar: false,
    allInclusive: false,
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
          {Object.entries(comodidadesDoHotel).map(([key, value]) => (
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
