import React, { useState } from "react";


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

const DescricaoPacote: React.FC = () => {
  const [descricao, setDescricao] = useState("Descrição do que tem no pacote");
  const [editando, setEditando] = useState(false);
  const [tempDescricao, setTempDescricao] = useState(descricao);
  // Estados dos booleanos (poderiam vir de props ou API)
  const [comodidades, setComodidades] = useState({
    AmbienteClimatizado: true,
    Tv: true,
    Varanda: false,
    Frigobar: true,
    Disponibilidade: true,
  });

  const handleSalvar = () => {
    setDescricao(tempDescricao);
    setEditando(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-4 min-h-[120px]">
      {editando ? (
        <>
          <textarea
            className="border rounded px-2 py-1 min-h-[60px]"
            value={tempDescricao}
            onChange={e => setTempDescricao(e.target.value)}
          />
          <div className="flex gap-2 mt-2">
            <button className="px-4 py-1 bg-blue-600 text-white rounded" onClick={handleSalvar}>Salvar</button>
            <button className="px-4 py-1 bg-gray-300 rounded" onClick={() => setEditando(false)}>Cancelar</button>
          </div>
        </>
      ) : (
        <>
          <div>{descricao}</div>
          <button className="mt-2 px-4 py-1 bg-blue-600 text-white rounded" onClick={() => setEditando(true)}>Editar</button>
        </>
      )}
      {/* Comodidades do quarto */}
      <div className="flex flex-wrap gap-4 mt-4">
        {Object.entries(comodidades).map(([key, value]) => (
          <button
            key={key}
            type="button"
            className="flex flex-col items-center w-24 focus:outline-none"
            onClick={() => setComodidades(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
          >
            <div className={`rounded-full p-2 mb-1 transition-colors ${value ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-400'}`}>{icones[key as keyof typeof icones]}</div>
            <span className="text-xs text-center">{nomes[key as keyof typeof nomes]}</span>
            <span className={`text-xs font-bold ${value ? 'text-green-700' : 'text-gray-400'}`}>{value ? 'Sim' : 'Não'}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DescricaoPacote;
