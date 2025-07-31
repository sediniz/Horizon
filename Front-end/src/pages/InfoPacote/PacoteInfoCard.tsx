import React, { useState } from "react";
import { updatePacote } from '../../api/pacoteApi';
import type { Pacote } from '../../api/pacoteApi';
// Função para criar pacote (POST)
async function createPacote(pacote: Omit<Pacote, 'pacoteId'>): Promise<Pacote> {
  const resp = await fetch('/api/pacotes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pacote),
  });
  if (!resp.ok) throw new Error('Erro ao criar pacote');
  return resp.json();
}

interface PacoteInfoCardProps {
  local: string;
  hotel?: string;
  dataIda: string;
  dataVolta: string;
  pessoas: number;
  pacoteId?: number; // novo: id do pacote
  onModificar: (novo: { local: string; hotel?: string; dataIda: string; dataVolta: string; pessoas: number }) => void;
}

const PacoteInfoCard: React.FC<PacoteInfoCardProps> = ({ local, hotel = '', dataIda, dataVolta, pessoas, pacoteId, onModificar }) => {
  const [showModal, setShowModal] = useState(false);
  const [editLocal, setEditLocal] = useState(local);
  const [editHotel, setEditHotel] = useState(hotel);
  const [editDataIda, setEditDataIda] = useState(dataIda);
  const [editDataVolta, setEditDataVolta] = useState(dataVolta);
  const [editPessoas, setEditPessoas] = useState(pessoas);

  // Sincroniza os estados locais com as props vindas do backend
  React.useEffect(() => {
    setEditLocal(local);
  }, [local]);
  React.useEffect(() => {
    setEditHotel(hotel);
  }, [hotel]);
  React.useEffect(() => {
    setEditDataIda(dataIda);
  }, [dataIda]);
  React.useEffect(() => {
    setEditDataVolta(dataVolta);
  }, [dataVolta]);
  React.useEffect(() => {
    setEditPessoas(pessoas);
  }, [pessoas]);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSave = async () => {
    onModificar({ local: editLocal, hotel: editHotel, dataIda: editDataIda, dataVolta: editDataVolta, pessoas: editPessoas });
    if (typeof pacoteId === 'number') {
      // Atualiza pacote existente
      await updatePacote({
        pacoteId: pacoteId,
        titulo: editLocal,
        descricao: '',
        destino: editLocal,
        duracao: 0,
        quantidadeDePessoas: editPessoas,
        valorTotal: 0
      });
    } else {
      // Cria novo pacote
      await createPacote({
        titulo: editLocal,
        descricao: '',
        destino: editLocal,
        duracao: 0,
        quantidadeDePessoas: editPessoas,
        valorTotal: 0
      });
    }
    setShowModal(false);
  };

  return (
    <>
      <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/30 hover:shadow-lg transition-all duration-300">
        <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          Informações do Pacote
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-white/40 rounded-lg border border-white/20">
            <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <span className="text-sm text-gray-600 font-medium">Destino:</span>
              <div className="font-semibold text-gray-800">{local}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-white/40 rounded-lg border border-white/20">
            <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <div>
              <span className="text-sm text-gray-600 font-medium">Hotel:</span>
              <div className="font-semibold text-gray-800">{hotel}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-white/40 rounded-lg border border-white/20">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <span className="text-sm text-gray-600 font-medium">Data de Ida:</span>
              <div className="font-semibold text-gray-800">{dataIda}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-white/40 rounded-lg border border-white/20">
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <span className="text-sm text-gray-600 font-medium">Data de Volta:</span>
              <div className="font-semibold text-gray-800">{dataVolta}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-white/40 rounded-lg border border-white/20">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <div>
              <span className="text-sm text-gray-600 font-medium">Pessoas:</span>
              <div className="font-semibold text-gray-800">{pessoas}</div>
            </div>
          </div>
        </div>
        
        <button 
          className="mt-6 w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sky-200"
          onClick={handleOpenModal}
        >
          <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Modificar Pacote
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 min-w-[400px] max-w-md mx-4">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">
              Modificar Pacote
            </h3>
            
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-1 block">Destino:</span>
                <input 
                  type="text" 
                  value={editLocal} 
                  onChange={e => setEditLocal(e.target.value)} 
                  className="w-full bg-white/70 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-colors"
                />
              </label>
              
              <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-1 block">Hotel:</span>
                <input 
                  type="text" 
                  value={editHotel} 
                  onChange={e => setEditHotel(e.target.value)} 
                  className="w-full bg-white/70 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-colors"
                />
              </label>
              
              <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-1 block">Data de Ida:</span>
                <input 
                  type="date" 
                  value={editDataIda} 
                  onChange={e => setEditDataIda(e.target.value)} 
                  className="w-full bg-white/70 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-colors"
                />
              </label>
              
              <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-1 block">Data de Volta:</span>
                <input 
                  type="date" 
                  value={editDataVolta} 
                  onChange={e => setEditDataVolta(e.target.value)} 
                  className="w-full bg-white/70 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-colors"
                />
              </label>
              
              <label className="block">
                <span className="text-sm font-medium text-gray-700 mb-1 block">Pessoas:</span>
                <input 
                  type="number" 
                  min={1} 
                  value={editPessoas} 
                  onChange={e => setEditPessoas(Number(e.target.value))} 
                  className="w-full bg-white/70 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-colors"
                />
              </label>
            </div>
            
            <div className="flex gap-3 mt-8">
              <button 
                className="flex-1 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                onClick={handleSave}
              >
                Salvar
              </button>
              <button 
                className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                onClick={handleCloseModal}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PacoteInfoCard;
