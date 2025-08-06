import React from "react";

interface PacoteInfoCardProps {
  local: string;
  hotel?: string;
  dataIda: string;
  dataVolta: string;
  pessoas: number;
  duracao: number; 
  pacoteId?: number;
  onModificar: (novo: { local: string; hotel?: string; dataIda: string; dataVolta: string; pessoas: number }) => void;
}

const PacoteInfoCard: React.FC<PacoteInfoCardProps> = ({ local, hotel = '', dataIda, dataVolta, pessoas, duracao }) => {
  console.log(' PacoteInfoCard recebeu duracao:', duracao);
  
  const formatarDataComMaisUmDia = (dataString: string) => {
    try {
      const data = new Date(dataString);
      data.setDate(data.getDate() + 1); 
      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return dataString;
    }
  };

  return (
    <>
      <div className="glass-effect rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          Informações do Pacote
        </h2>
        
        <div className="space-y-4">
          <div className="bg-white/40 backdrop-blur-sm rounded-lg p-4 border border-white/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Destino</div>
                <div className="font-semibold text-gray-800">{local}</div>
              </div>
            </div>
          </div>

          {hotel && (
            <div className="bg-white/40 backdrop-blur-sm rounded-lg p-4 border border-white/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Hotel</div>
                  <div className="font-semibold text-gray-800">{hotel}</div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white/40 backdrop-blur-sm rounded-lg p-4 border border-white/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Check-in</div>
                <div className="font-semibold text-gray-800">{formatarDataComMaisUmDia(dataIda)}</div>
              </div>
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-sm rounded-lg p-4 border border-white/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Check-out</div>
                <div className="font-semibold text-gray-800">{formatarDataComMaisUmDia(dataVolta)}</div>
              </div>
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-sm rounded-lg p-4 border border-white/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Pessoas</div>
                <div className="font-semibold text-gray-800">{pessoas}</div>
              </div>
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-sm rounded-lg p-4 border border-white/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Duração</div>
                <div className="font-semibold text-gray-800">{duracao} {duracao === 1 ? 'dia' : 'dias'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PacoteInfoCard;
