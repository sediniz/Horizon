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
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-2">
        <h2 className="text-xl font-bold mb-2">Informações do Pacote</h2>
        <div><strong>Destino:</strong> {local}</div>
        <div><strong>Hotel:</strong> {hotel}</div>
        <div><strong>Data de Ida:</strong> {dataIda}</div>
        <div><strong>Data de Volta:</strong> {dataVolta}</div>
        <div><strong>Pessoas:</strong> {pessoas}</div>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleOpenModal}>
          Modificar
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg min-w-[320px] flex flex-col gap-4">
            <h3 className="text-lg font-bold mb-2">Modificar Pacote</h3>
            <label className="flex flex-col">
              Destino:
              <input type="text" value={editLocal} onChange={e => setEditLocal(e.target.value)} className="border rounded px-2 py-1" />
            </label>
            <label className="flex flex-col">
              Hotel:
              <input type="text" value={editHotel} onChange={e => setEditHotel(e.target.value)} className="border rounded px-2 py-1" />
            </label>
            <label className="flex flex-col">
              Data de Ida:
              <input type="date" value={editDataIda} onChange={e => setEditDataIda(e.target.value)} className="border rounded px-2 py-1" />
            </label>
            <label className="flex flex-col">
              Data de Volta:
              <input type="date" value={editDataVolta} onChange={e => setEditDataVolta(e.target.value)} className="border rounded px-2 py-1" />
            </label>
            <label className="flex flex-col">
              Pessoas:
              <input type="number" min={1} value={editPessoas} onChange={e => setEditPessoas(Number(e.target.value))} className="border rounded px-2 py-1" />
            </label>
            <div className="flex gap-2 mt-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleSave}>Salvar</button>
              <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" onClick={handleCloseModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PacoteInfoCard;
