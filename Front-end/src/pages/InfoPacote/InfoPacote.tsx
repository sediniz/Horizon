

import React, { useState, useEffect } from "react";
import cancunImg from '../../assets/cancun.png';
import parisImg from '../../assets/Paris2.png';
import praiaImg from '../../assets/Praia01.png';
import PacoteInfoCard from "./PacoteInfoCard";
import ReservaCard from "./ReservaCard";
import DescricaoPacote from "./DescricaoPacote";
import AvaliacaoPacote from "./AvaliacaoPacote";
import { useParams, useNavigate } from "react-router-dom";

// Lista de pacotes (simulando um banco de dados)
const pacotesData = [
  {
    id: 1,
    local: "Bahia, Brasil",
    hotel: "Resort Paradise Beach",
    dataIda: "2025-08-10",
    dataVolta: "2025-08-16",
    pessoas: 2,
    preco: "R$ 2.500 por 6 noites",
    imagem: praiaImg
  },
  {
    id: 2,
    local: "Paris, França",
    hotel: "Hotel Eiffel Luxury",
    dataIda: "2025-09-15",
    dataVolta: "2025-09-19",
    pessoas: 2,
    preco: "R$ 4.800 por 4 noites",
    imagem: parisImg
  },
  {
    id: 3,
    local: "Cancún, México",
    hotel: "Cancún Paradise Resort",
    dataIda: "2025-07-20",
    dataVolta: "2025-07-25",
    pessoas: 2,
    preco: "R$ 3.200 por 5 noites",
    imagem: cancunImg
  }
];

const InfoPacote: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [local, setLocal] = useState("Carregando...");
  const [hotel, setHotel] = useState("Carregando...");
  const [dataIda, setDataIda] = useState("");
  const [dataVolta, setDataVolta] = useState("");
  const [pessoas, setPessoas] = useState(2);
  const [preco, setPreco] = useState("R$ 0");
  const [imagem, setImagem] = useState(cancunImg);
  
  useEffect(() => {
    // Encontrar o pacote pelo ID
    const pacoteId = Number(id);
    const pacote = pacotesData.find(p => p.id === pacoteId);
    
    if (pacote) {
      setLocal(pacote.local);
      setHotel(pacote.hotel);
      setDataIda(pacote.dataIda);
      setDataVolta(pacote.dataVolta);
      setPessoas(pacote.pessoas);
      setPreco(pacote.preco);
      setImagem(pacote.imagem);
    } else {
      // Se não encontrar o pacote, redireciona para a home
      navigate('/');
    }
  }, [id, navigate]);

  const handleReservar = () => {
    console.log("Reservar pacote");
    navigate('/pagamento');
  };

  const handleModificar = (novo: { local: string; hotel?: string; dataIda: string; dataVolta: string; pessoas: number }) => {
    setLocal(novo.local);
    if (novo.hotel !== undefined) setHotel(novo.hotel);
    setDataIda(novo.dataIda);
    setDataVolta(novo.dataVolta);
    setPessoas(novo.pessoas);
  };

  const [editandoNome, setEditandoNome] = useState(false);
  const [novoNome, setNovoNome] = useState(local);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <style>{`
        .glass-effect {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>

      <div className="px-4 py-8 max-w-7xl mx-auto">
        {/* Header com nome do lugar */}
        <div className="glass-effect rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-sm mb-6">
          <div className="flex items-center justify-between">
            {editandoNome ? (
              <div className="flex items-center gap-4 w-full">
                <input
                  className="glass-effect rounded-lg px-4 py-2 flex-1 text-lg font-semibold border border-white/30 focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-gray-800"
                  value={novoNome}
                  onChange={e => setNovoNome(e.target.value)}
                  autoFocus
                />
                <button
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
                  onClick={() => {
                    setLocal(novoNome);
                    setEditandoNome(false);
                  }}
                >
                  Salvar
                </button>
                <button
                  className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
                  onClick={() => {
                    setNovoNome(local);
                    setEditandoNome(false);
                  }}
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-shadow bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">
                  {local}
                </h1>
                <button
                  className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
                  onClick={() => setEditandoNome(true)}
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
              </>
            )}
          </div>
        </div>
        {/* Carrossel com imagem estilizada */}
        <div className="glass-effect rounded-2xl p-4 shadow-xl border border-white/20 backdrop-blur-sm mb-8">
          <div className="relative h-80 rounded-xl overflow-hidden shadow-lg">
            <img 
              src={imagem} 
              alt={local} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30">
                <span className="text-white font-semibold text-lg">Destino Premium</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seção principal com cards modernizados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="glass-effect rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-sm">
            <PacoteInfoCard
              local={local}
              hotel={hotel}
              dataIda={dataIda}
              dataVolta={dataVolta}
              pessoas={pessoas}
              onModificar={handleModificar}
            />
          </div>
          <div className="glass-effect rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-sm">
            <ReservaCard
              preco={preco}
              onReservar={handleReservar}
            />
          </div>
        </div>

        {/* Seção inferior com descrição e avaliações */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="glass-effect rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-sm">
            <DescricaoPacote />
          </div>
          <div className="glass-effect rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-sm">
            <AvaliacaoPacote />
          </div>
        </div>

        {/* Banner promocional */}
        <div className="mt-8 glass-effect rounded-2xl p-8 shadow-xl border border-white/20 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-700 rounded-xl p-8 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-3 text-shadow">Reserve agora e economize até 25%</h3>
                <p className="text-sky-100 text-lg">Ofertas limitadas para destinos exclusivos</p>
              </div>
              <div className="text-6xl opacity-80">🎯</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPacote;
