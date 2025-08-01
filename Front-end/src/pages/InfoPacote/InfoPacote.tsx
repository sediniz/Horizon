

import React, { useState, useEffect } from "react";
import cancunImg from '../../assets/cancun.png';
import parisImg from '../../assets/Paris2.png';
import praiaImg from '../../assets/Praia01.png';
import PacoteInfoCard from "./PacoteInfoCard";
import ReservaCard from "./ReservaCard";
import DescricaoPacote from "./DescricaoPacote";
import AvaliacaoPacote from "./AvaliacaoPacote";
import { useParams, useNavigate } from "react-router-dom";
import { getPacoteById } from "../../api/pacotes";
import { getHotelById } from "../../api/hoteis";

// Imagens de fallback
const imagensFallback = {
  praia: praiaImg,
  paris: parisImg,
  cancun: cancunImg,
  default: cancunImg
};

// Função para obter imagem com base no destino
const getImagemPorDestino = (destino: string) => {
  const destinoLower = destino.toLowerCase();
  if (destinoLower.includes('praia') || destinoLower.includes('beach') || 
      destinoLower.includes('bahia') || destinoLower.includes('rio')) {
    return imagensFallback.praia;
  } else if (destinoLower.includes('paris') || destinoLower.includes('frança')) {
    return imagensFallback.paris;
  } else if (destinoLower.includes('cancun') || destinoLower.includes('mexico')) {
    return imagensFallback.cancun;
  }
  return imagensFallback.default;
};

const InfoPacote: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState("Carregando...");
  const [local, setLocal] = useState("Carregando...");
  const [hotel, setHotel] = useState("Carregando...");
  const [dataIda, setDataIda] = useState("");
  const [dataVolta, setDataVolta] = useState("");
  const [pessoas, setPessoas] = useState(2);
  const [preco, setPreco] = useState("R$ 0");
  const [valorDiaria, setValorDiaria] = useState(0);
  const [valorTotal, setValorTotal] = useState(0);
  const [duracao, setDuracao] = useState(0);
  const [imagem, setImagem] = useState(cancunImg);
  const [descricao, setDescricao] = useState("");
  const [avaliacoes, setAvaliacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const carregarPacote = async () => {
      if (!id) {
        navigate('/');
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // Obter o pacote da API
        const pacoteId = Number(id);
        const pacote = await getPacoteById(pacoteId);
        
        if (!pacote) {
          setError("Pacote não encontrado");
          navigate('/pacotes');
          return;
        }
        
        // Buscar informações do hotel relacionado
        let hotelInfo;
        try {
          hotelInfo = await getHotelById(pacote.hotelId);
          if (hotelInfo) {
            if (hotelInfo.avaliacoes) {
              setAvaliacoes(hotelInfo.avaliacoes);
            }
            // Verificar e salvar a imagem do hotel
            if (hotelInfo.imagens && hotelInfo.imagens.trim() !== '') {
              // Se houver uma URL de imagem, usá-la
              setImagem(hotelInfo.imagens);
            } else {
              // Usar a imagem baseada no destino como fallback
              setImagem(getImagemPorDestino(pacote.destino));
            }
          }
        } catch (err) {
          console.error("Erro ao buscar hotel:", err);
        }
        
        // Calcular datas (exemplo simples para simulação)
        const hoje = new Date();
        const dataIdaObj = new Date(hoje);
        dataIdaObj.setDate(dataIdaObj.getDate() + 30); // 30 dias a partir de hoje
        const dataVoltaObj = new Date(dataIdaObj);
        dataVoltaObj.setDate(dataVoltaObj.getDate() + pacote.duracao);
        
        // Formatar as datas
        const formatarData = (data: Date) => data.toISOString().split('T')[0];
        
        // Atualizar o estado
        setTitulo(pacote.titulo);
        setLocal(pacote.destino);
        setHotel(hotelInfo?.nome || pacote.titulo);
        setDataIda(formatarData(dataIdaObj));
        setDataVolta(formatarData(dataVoltaObj));
        setPessoas(pacote.quantidadeDePessoas);
        
        // Determinar o valor da diária
        // Prioridade: 1. Usar a diária do hotel, 2. Usar o valor do quarto se disponível, 3. Calcular pela duração
        const valorDiariaPacote = hotelInfo?.valorDiaria || 
                                (hotelInfo?.quarto?.valorDoQuarto || 0) + 200 || // Adiciona margem ao valor do quarto
                                (pacote.duracao > 0 ? pacote.valorTotal / pacote.duracao : pacote.valorTotal || 500);
        
        // Calcular o valor total do pacote baseado na diária e duração
        const valorTotalPacote = pacote.valorTotal > 0 ? pacote.valorTotal : valorDiariaPacote * pacote.duracao;
        
        // Atualizar os estados relacionados a preço
        setPreco(`R$ ${valorTotalPacote.toFixed(2).replace('.', ',')} por ${pacote.duracao} noites`);
        setValorDiaria(valorDiariaPacote);
        setValorTotal(valorTotalPacote);
        setDuracao(pacote.duracao);
        
        setDescricao(pacote.descricao);
      } catch (err) {
        console.error("Erro ao carregar pacote:", err);
        setError("Erro ao carregar informações do pacote");
      } finally {
        setLoading(false);
      }
    };
    
    carregarPacote();
  }, [id, navigate]);

  const handleReservar = (valorPacoteSelecionado: number) => {
    // Usar o valor do pacote selecionado que foi passado do ReservaCard
    // Se não for fornecido, usar o valorTotal do estado como fallback
    const valorTotalExato = valorPacoteSelecionado > 0 
      ? valorPacoteSelecionado 
      : parseFloat(valorTotal.toFixed(2));
    
    console.log("Reservar pacote", {
      pacoteId: Number(id),
      valorTotal: valorTotalExato,
      valorPacoteSelecionado,
      pessoas: pessoas,
      dataIda: dataIda,
      duracao: duracao
    });
    
    // Construir URL com os parâmetros de query
    const queryParams = new URLSearchParams({
      pacoteId: id || '',
      titulo: titulo,
      valor: valorTotalExato.toString(), // Usar o valor selecionado pelo usuário
      pessoas: pessoas.toString(),
      dataIda: dataIda,
      duracao: duracao.toString()
    }).toString();
    
    // Navegar para a página de pagamento com os parâmetros
    navigate(`/pagamento?${queryParams}`);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Carregando informações do pacote...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
        <div className="text-center p-8 max-w-md mx-auto bg-white rounded-lg shadow-lg">
          <div className="inline-block rounded-full p-3 bg-red-100 text-red-600 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Ocorreu um erro</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/pacotes')}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Voltar aos pacotes
          </button>
        </div>
      </div>
    );
  }

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
                  {titulo}
                </h1>
                <div>
                  <span className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mr-3">
                    {local}
                  </span>
                  <button
                    className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
                    onClick={() => setEditandoNome(true)}
                  >
                    <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        {/* Carrossel com imagem estilizada */}
        <div className="glass-effect rounded-2xl p-4 shadow-xl border border-white/20 backdrop-blur-sm mb-8">
          <div className="relative h-80 rounded-xl overflow-hidden shadow-lg">
            <img 
              src={imagem} 
              alt={titulo} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
              onError={(e) => {
                // Caso a imagem não seja carregada, usar uma imagem de fallback
                const target = e.target as HTMLImageElement;
                console.error("Erro ao carregar imagem:", target.src);
                target.src = getImagemPorDestino(local);
                target.onerror = null; // Evitar loop infinito
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 flex flex-col gap-2">
              <div className="bg-blue-500/70 backdrop-blur-sm rounded-lg px-3 py-1 border border-blue-300/50 shadow-lg self-start">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-white font-medium text-sm">{local}</span>
                </div>
              </div>
              
              <div className="bg-white/30 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/50 shadow-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-white font-semibold text-lg">{hotel}</span>
                </div>
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
              valorDiaria={valorDiaria}
              valorTotal={valorTotal}
              duracaoPacote={duracao}
              dataIda={dataIda}
              dataVolta={dataVolta}
              pessoas={pessoas}
              onReservar={handleReservar}
            />
          </div>
        </div>

        {/* Seção inferior com descrição e avaliações */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="glass-effect rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-sm">
            <DescricaoPacote descricaoTexto={descricao} />
          </div>
          <div className="glass-effect rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-sm">
            <AvaliacaoPacote avaliacoes={avaliacoes} />
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
