import React from "react";
import Rating from "../../components/Rating/Rating";

const mockAvaliacoes = [
  { 
    nome: "João", 
    nota: 5, 
    comentario: "Ótimo pacote! Recomendo.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },
  { 
    nome: "Maria", 
    nota: 4, 
    comentario: "Muito bom, mas poderia ter mais opções.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
  },
  { 
    nome: "Carlos", 
    nota: 3, 
    comentario: "Satisfeito, mas o hotel era simples.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
  },
];

const AvaliacaoPacote: React.FC = () => {
  const calcularMediaAvaliacoes = () => {
    if (mockAvaliacoes.length === 0) return 0;
    const soma = mockAvaliacoes.reduce((acc, avaliacao) => acc + avaliacao.nota, 0);
    return (soma / mockAvaliacoes.length).toFixed(1);
  };

  const renderStars = (nota: number, size: string = "lg") => {
    return <Rating rating={nota} size={size as any} />;
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/30 p-6 min-h-[300px]">
      <div className="flex items-center gap-3 mb-6">
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        <h3 className="text-xl font-bold text-gray-800">Avaliações do Pacote</h3>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-800">{calcularMediaAvaliacoes()}</span>
          {renderStars(Math.round(Number(calcularMediaAvaliacoes())), "md")}
          <span className="text-gray-600">({mockAvaliacoes.length} avaliações)</span>
        </div>
      </div>

      {mockAvaliacoes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.013 8.013 0 01-7-4L5 15l1-1h5a8 8 0 008-8z" />
          </svg>
          <p>Nenhuma avaliação ainda.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-64 overflow-y-auto">
          {mockAvaliacoes.map((a, idx) => (
            <div key={idx} className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30 shadow-sm">
              <div className="flex items-start gap-4 mb-3">
                <div className="flex-shrink-0">
                  <img 
                    src={a.avatar} 
                    alt={`Avatar de ${a.nome}`}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/30 shadow-lg"
                    onError={(e) => {
                      // Fallback para inicial se a imagem não carregar
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) {
                        fallback.style.display = 'flex';
                        fallback.classList.remove('hidden');
                      }
                    }}
                  />
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-full items-center justify-center text-white font-bold shadow-lg hidden">
                    {a.nome.charAt(0)}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-gray-800">{a.nome}</span>
                    {renderStars(a.nota, "sm")}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{a.comentario}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvaliacaoPacote;
