
//implementar o calendario de garcia

import React, { useState } from "react";

interface ReservaCardProps {
  preco: string;
  onReservar: () => void;
}

const ReservaCard: React.FC<ReservaCardProps> = ({  onReservar }) => {

  // Valor base da diária
  const diaria = 400;
  // Array de noites: 3, 5, 7, 9 (pulando de 2 em 2)
  const noitesArray = [3, 5, 7, 9];
  const [precoSelecionado, setPrecoSelecionado] = useState(0);
  // Removido estados de calendário customizado

  // Gera os preços multiplicados
  const precosGrid = noitesArray.map(noites => ({ valor: diaria * noites, noites }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-4 items-center">
      <div className="text-lg mb-2">R$ {diaria} por diária</div>
      <div className="grid grid-cols-2 grid-rows-2 gap-0 border border-black w-fit">
        {precosGrid.map((item, idx) => (
          <button
            key={idx}
            className={`border border-black w-36 h-16 flex items-center justify-center text-base ${precoSelecionado === idx ? 'bg-gray-200' : ''}`}
            onClick={() => {
              setPrecoSelecionado(idx);
            }}
          >
            {item.valor} por {item.noites} noites
          </button>
        ))}
      </div>

      <button className="mt-6 px-8 py-2 border border-black rounded bg-white text-black text-lg hover:bg-gray-100" onClick={onReservar}>
        Reserva
      </button>
    </div>
  );
};

export default ReservaCard;
