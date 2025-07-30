

import React, { useState } from "react";
import cancunImg from '../../assets/cancun.png';
import PacoteInfoCard from "./PacoteInfoCard";
import ReservaCard from "./ReservaCard";
import DescricaoPacote from "./DescricaoPacote";
import AvaliacaoPacote from "./AvaliacaoPacote";

const InfoPacote: React.FC = () => {
  const [local, setLocal] = useState("Recife, Pernambuco");
  const [hotel, setHotel] = useState("Hotel Paradisus");
  const [dataIda, setDataIda] = useState("2025-08-10");
  const [dataVolta, setDataVolta] = useState("2025-08-13");
  const [pessoas, setPessoas] = useState(2);

  const handleReservar = () => {
    console.log("Reservar pacote");
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
    <div className="px-4 py-8 max-w-7xl mx-auto">
      {/* Nome do lugar acima da imagem */}
      <div className="flex items-center mb-2 max-w-2xl mx-auto justify-start">
        {editandoNome ? (
          <div className="flex items-center gap-2 w-full">
            <input
              className="border rounded px-2 py-1 flex-1"
              value={novoNome}
              onChange={e => setNovoNome(e.target.value)}
              autoFocus
            />
            <button
              className="px-3 py-1 bg-green-500 text-white rounded"
              onClick={() => {
                setLocal(novoNome);
                setEditandoNome(false);
              }}
            >Salvar</button>
            <button
              className="px-3 py-1 bg-gray-300 rounded"
              onClick={() => {
                setNovoNome(local);
                setEditandoNome(false);
              }}
            >Cancelar</button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold truncate mr-2 text-left">{local}</h2>
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded"
              onClick={() => setEditandoNome(true)}
            >Editar</button>
          </>
        )}
      </div>
      {/* Carrossel (placeholder) */}
      <div className="mb-8 h-64 bg-gray-200 flex items-center justify-center rounded-lg overflow-hidden">
        <img src={cancunImg} alt="Cancun" className="w-full h-full object-cover" />
      </div>

      {/* Seção principal com dois cards lado a lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <PacoteInfoCard
          local={local}
          hotel={hotel}
          dataIda={dataIda}
          dataVolta={dataVolta}
          pessoas={pessoas}
          onModificar={handleModificar}
        />
        <ReservaCard
          preco="R$ 400 por 3 noites"
          onReservar={handleReservar}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <DescricaoPacote />
        <AvaliacaoPacote />
      </div>
    </div>
  );
};

export default InfoPacote;
