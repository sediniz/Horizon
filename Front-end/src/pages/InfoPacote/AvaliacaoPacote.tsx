import React from "react";

const mockAvaliacoes = [
  { nome: "João", nota: 5, comentario: "Ótimo pacote! Recomendo." },
  { nome: "Maria", nota: 4, comentario: "Muito bom, mas poderia ter mais opções." },
  { nome: "Carlos", nota: 3, comentario: "Satisfeito, mas o hotel era simples." },
];

const AvaliacaoPacote: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-2 min-h-[120px]">
      <h3 className="text-lg font-bold mb-2">Avaliação do pacote</h3>
      {mockAvaliacoes.length === 0 ? (
        <div>Nenhuma avaliação ainda.</div>
      ) : (
        <ul className="flex flex-col gap-2">
          {mockAvaliacoes.map((a, idx) => (
            <li key={idx} className="border-b pb-2">
              <div className="font-semibold">{a.nome} - {"★".repeat(a.nota)}{"☆".repeat(5 - a.nota)}</div>
              <div className="text-sm text-gray-700">{a.comentario}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AvaliacaoPacote;
