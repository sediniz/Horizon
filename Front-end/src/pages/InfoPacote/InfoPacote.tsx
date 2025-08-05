

import React, { useState, useEffect } from "react";
import cancunImg from '../../assets/cancun.png';
import parisImg from '../../assets/Paris2.png';
import praiaImg from '../../assets/Praia01.png';
import PacoteInfoCard from "./PacoteInfoCard";
import DescricaoPacote from "./DescricaoPacote";
import AvaliacaoPacote from "./AvaliacaoPacote";
import PackageCustomizer from "../../components/PackageCustomizer/PackageCustomizer";
import PreDefinedPackages from "../../components/PreDefinedPackages/PreDefinedPackages";
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
  const [usarDatePickerDinamico, setUsarDatePickerDinamico] = useState(true);
  const [valorTotalCalculado, setValorTotalCalculado] = useState(0);
  const [hotelInfo, setHotelInfo] = useState<any>(null); // Para armazenar informações completas do hotel
  
  // Estados para os valores originais (ainda necessários para outros componentes)
  const [duracaoOriginal, setDuracaoOriginal] = useState(0);
  const [pessoasOriginal, setPessoasOriginal] = useState(2);
  
  // Estados do customizador removidos (agora é independente)
  // const [duracaoCustomizada, setDuracaoCustomizada] = useState(0);
  // const [pessoasCustomizada, setPessoasCustomizada] = useState(2);
  // const [valorTotalCustomizado, setValorTotalCustomizado] = useState(0);
  
  // Estado para duração atual exibida nas informações do pacote
  const [duracaoAtual, setDuracaoAtual] = useState(0);
  
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
        let hotelInfoTemp;
        try {
          hotelInfoTemp = await getHotelById(pacote.hotelId);
          if (hotelInfoTemp) {
            // Armazenar informações completas do hotel para usar nas comodidades
            setHotelInfo(hotelInfoTemp);
            
            if (hotelInfoTemp.avaliacoes) {
              setAvaliacoes(hotelInfoTemp.avaliacoes);
            }
            // Verificar e salvar a imagem do hotel
            if (hotelInfoTemp.imagens && hotelInfoTemp.imagens.trim() !== '') {
              // Se houver uma URL de imagem, usá-la
              setImagem(hotelInfoTemp.imagens);
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
        setHotel(hotelInfoTemp?.nome || pacote.titulo);
        setDataIda(formatarData(dataIdaObj));
        setDataVolta(formatarData(dataVoltaObj));
        setPessoas(pacote.quantidadeDePessoas);
        
        // Determinar o valor da diária
        // Prioridade: 1. Usar a diária do hotel, 2. Usar o valor do quarto se disponível, 3. Calcular pela duração
        const valorDiariaPacote = hotelInfoTemp?.valorDiaria || 
                                (hotelInfoTemp?.quarto?.valorDoQuarto || 0) + 200 || // Adiciona margem ao valor do quarto
                                (pacote.duracao > 0 ? pacote.valorTotal / pacote.duracao : pacote.valorTotal || 500);
        
        // Calcular o valor total do pacote baseado na diária e duração
        const valorTotalPacote = pacote.valorTotal > 0 ? pacote.valorTotal : valorDiariaPacote * pacote.duracao;
        
        // Atualizar os estados relacionados a preço
        setPreco(`R$ ${valorTotalPacote.toFixed(2).replace('.', ',')} por ${pacote.duracao} noites`);
        setValorDiaria(valorDiariaPacote);
        setValorTotal(valorTotalPacote);
        setDuracao(pacote.duracao);
        
        // Configurar valores originais para os outros componentes
        setDuracaoOriginal(pacote.duracao);
        setPessoasOriginal(pacote.quantidadeDePessoas);
        
        // Inicializar duração atual
        setDuracaoAtual(pacote.duracao);
        console.log('🔧 Inicializando duracaoAtual com:', pacote.duracao);
        
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

  // Função handleReservar removida - não é mais usada

  const handleModificar = (novo: { local: string; hotel?: string; dataIda: string; dataVolta: string; pessoas: number }) => {
    setLocal(novo.local);
    if (novo.hotel !== undefined) setHotel(novo.hotel);
    setDataIda(novo.dataIda);
    setDataVolta(novo.dataVolta);
    setPessoas(novo.pessoas);
  };

  // Função para lidar com mudanças de data do DatePicker dinâmico (lado direito - pacotes pré-definidos)
  const handleDataDinamicaChange = (dataInicio: string, dataFim: string, valorCalculado: number, duracao: number) => {
    console.log('🚀 InfoPacote handleDataDinamicaChange recebeu:', {
      dataInicio,
      dataFim,
      valorCalculado,
      duracaoRecebida: duracao,
      duracaoAtualAntes: duracaoAtual
    });
    
    setDataIda(dataInicio);
    setDataVolta(dataFim);
    setValorTotalCalculado(valorCalculado);
    
    // Usar a duração recebida diretamente (mais precisa que calcular das datas)
    setDuracaoAtual(duracao);
    
    console.log('✅ InfoPacote setDuracaoAtual chamado com:', duracao);
    
    // Para pacotes pré-definidos, manter a duração original e recalcular o valor
    const valorPacotePreDefinido = valorDiaria * duracaoOriginal * pessoasOriginal;
    setValorTotal(valorPacotePreDefinido);
    setPreco(`R$ ${valorPacotePreDefinido.toFixed(2).replace('.', ',')} por ${duracaoOriginal} ${duracaoOriginal === 1 ? 'dia' : 'dias'}`);
  };

  // Função para lidar com mudanças do customizador - REMOVIDA para manter independência
  // const handleCustomizationChange = ... (removido)

  // Função para reservar com customização
  const handleReservarCustomizado = (dias: number, pessoasCount: number, valorTotal: number, dataInicio: string, dataFim: string) => {
    console.log('🛒 Reservando pacote customizado:', {
      pacoteId: id,
      titulo: titulo,
      valor: valorTotal,
      pessoas: pessoasCount,
      dias: dias,
      dataIda: dataInicio,
      dataVolta: dataFim
    });

    const queryParams = new URLSearchParams({
      pacoteId: id || '',
      titulo: `${titulo} (Personalizado)`,
      valor: valorTotal.toString(),
      pessoas: pessoasCount.toString(),
      dataIda: dataInicio,
      dataVolta: dataFim,
      duracao: dias.toString()
    }).toString();

    navigate(`/pagamento?${queryParams}`);
  };

  // Função para reservar pacote original
  const handleReservarPacote = (valorTotal: number) => {
    if (!dataIda || !dataVolta) {
      alert('Por favor, selecione as datas da viagem antes de continuar');
      return;
    }

    console.log('🛒 Reservando pacote original:', {
      pacoteId: id,
      titulo: titulo,
      valor: valorTotal,
      pessoas: pessoasOriginal,
      dataIda: dataIda,
      dataVolta: dataVolta,
      duracao: duracaoOriginal
    });

    const queryParams = new URLSearchParams({
      pacoteId: id || '',
      titulo: titulo,
      valor: valorTotal.toString(),
      pessoas: pessoasOriginal.toString(),
      dataIda: dataIda,
      dataVolta: dataVolta,
      duracao: duracaoOriginal.toString()
    }).toString();

    navigate(`/pagamento?${queryParams}`);
  };

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
            <h1 className="text-3xl font-bold text-shadow bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">
              {titulo}
            </h1>
            <div>
              <span className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {local}
              </span>
            </div>
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

        {/* Seção principal reorganizada */}
        <div className="space-y-6 mb-8">
          {/* Informações do Pacote - OCUPANDO TODA A LARGURA */}
          <div className="glass-effect rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-sm">
            <PacoteInfoCard
              local={local}
              hotel={hotel}
              dataIda={dataIda}
              dataVolta={dataVolta}
              pessoas={pessoas}
              duracao={duracaoAtual}
              onModificar={handleModificar}
            />
          </div>
          
          {/* Seção inferior com Customizador e Pacotes Pré-Definidos lado a lado */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customizador de Pacote - LADO ESQUERDO */}
            <PackageCustomizer
              valorDiaria={valorDiaria}
              duracaoOriginal={duracaoOriginal}
              pessoasOriginal={pessoasOriginal}
              onReservarCustomizado={handleReservarCustomizado}
              className="glass-effect shadow-xl border border-white/20 backdrop-blur-sm"
            />
            
            {/* Pacotes Pré-Definidos - LADO DIREITO */}
            <PreDefinedPackages
              valorDiaria={valorDiaria}
              duracao={duracaoOriginal}
              pessoas={pessoasOriginal}
              dataIda={dataIda}
              dataVolta={dataVolta}
              onDataChange={handleDataDinamicaChange}
              onReservarPacote={handleReservarPacote}
              className="glass-effect shadow-xl border border-white/20 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Seção inferior com descrição e avaliações */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="glass-effect rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-sm">
            <DescricaoPacote 
              descricaoTexto={descricao} 
              hotelInfo={hotelInfo}
            />
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
