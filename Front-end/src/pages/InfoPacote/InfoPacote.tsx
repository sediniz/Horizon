

import React, { useState } from "react";
import { updatePacote } from '../../api/pacoteApi';
import type { Pacote } from '../../api/pacoteApi';
import cancunImg from '../../assets/cancun.png';
import PacoteInfoCard from "./PacoteInfoCard";
import ReservaCard from "./ReservaCard";
import DescricaoPacote from "./DescricaoPacote";
import AvaliacaoPacote from "./AvaliacaoPacote";

const InfoPacote: React.FC = () => {
  const [pacote, setPacote] = useState<Pacote | null>(null);
  // Campos extras locais
  const [hotel, setHotel] = useState("Hotel Paradisus");
  const [mensagem, setMensagem] = useState<string | null>(null);
  // Não há pacoteId fixo, será criado ao modificar

  // Se quiser carregar um pacote existente, coloque o id aqui
  // useEffect(() => {
  //   getPacoteById(pacoteId).then(setPacote).catch(() => setPacote(null));
  // }, []);

  const handleReservar = () => {
    console.log("Reservar pacote");
  };

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

  const handleModificar = async (novo: { local: string; hotel?: string; dataIda: string; dataVolta: string; pessoas: number }) => {
    // Serializa as datas no campo descricao
    const descricaoDatas = novo.dataIda && novo.dataVolta ? `DataIda:${novo.dataIda};DataVolta:${novo.dataVolta}` : '';
    const duracao = novo.dataIda && novo.dataVolta ? Math.max(1, Math.ceil((new Date(novo.dataVolta).getTime() - new Date(novo.dataIda).getTime()) / (1000*60*60*24))) : 0;
    if (!pacote) {
      // Cria novo pacote
      const novoPacote = await createPacote({
        titulo: novo.local,
        descricao: descricaoDatas,
        destino: novo.local,
        duracao,
        quantidadeDePessoas: novo.pessoas,
        valorTotal: 0
      });
      setPacote(novoPacote);
      if (novo.hotel !== undefined) setHotel(novo.hotel);
      setMensagem('Pacote criado com sucesso!');
      setTimeout(() => setMensagem(null), 3000);
      return;
    }
    // Atualiza campos locais
    if (novo.hotel !== undefined) setHotel(novo.hotel);
    // Atualiza backend
    const pacoteAtualizado: Pacote = {
      ...pacote,
      destino: novo.local,
      quantidadeDePessoas: novo.pessoas,
      duracao,
      descricao: descricaoDatas,
    };
    await updatePacote(pacoteAtualizado);
    setPacote(pacoteAtualizado);
    setMensagem('Pacote modificado com sucesso!');
    setTimeout(() => setMensagem(null), 3000);
  };

  const [editandoNome, setEditandoNome] = useState(false);
  const [novoNome, setNovoNome] = useState(pacote?.destino || "");

  // Extrai dataIda e dataVolta do campo descricao
  let dataIda = '';
  let dataVolta = '';
  if (pacote?.descricao) {
    const matchIda = pacote.descricao.match(/DataIda:([^;]+)/);
    const matchVolta = pacote.descricao.match(/DataVolta:([^;]+)/);
    if (matchIda) dataIda = matchIda[1];
    if (matchVolta) dataVolta = matchVolta[1];
  }

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      {mensagem && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded text-center font-semibold animate-fade-in">
          {mensagem}
        </div>
      )}
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
              onClick={async () => {
                if (!pacote) return;
                const pacoteAtualizado = { ...pacote, destino: novoNome };
                await updatePacote(pacoteAtualizado);
                setPacote(pacoteAtualizado);
                setEditandoNome(false);
              }}
            >Salvar</button>
            <button
              className="px-3 py-1 bg-gray-300 rounded"
              onClick={() => {
                setNovoNome(pacote?.destino || "");
                setEditandoNome(false);
              }}
            >Cancelar</button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold truncate mr-2 text-left">{pacote?.destino || ''}</h2>
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
          local={pacote?.destino || ''}
          hotel={hotel}
          dataIda={dataIda}
          dataVolta={dataVolta}
          pessoas={pacote?.quantidadeDePessoas || 1}
          pacoteId={pacote?.pacoteId}
          onModificar={handleModificar}
        />
        <ReservaCard
          preco={pacote ? `R$ ${pacote.valorTotal} por ${pacote.duracao} noites` : 'R$ 400 por 3 noites'}
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
