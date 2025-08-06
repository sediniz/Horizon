import { useState, useEffect } from 'react';
import { avaliacaoService } from '../services/avaliacaoService';
import type { Avaliacao, AvaliacaoFormatada } from '../services/avaliacaoService';
import img1 from '../assets/img1.jpeg';

// Hook customizado para gerenciar avaliações formatadas
export const useAvaliacoes = () => {
  const [reviews, setReviews] = useState<AvaliacaoFormatada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para formatar avaliações para o componente 
  const formatarAvaliacoes = (avaliacoes: Avaliacao[]): AvaliacaoFormatada[] => {
    const cores = [
      "from-blue-400 to-blue-600",
      "from-green-400 to-green-600", 
      "from-pink-400 to-pink-600",
      "from-purple-400 to-purple-600",
      "from-orange-400 to-orange-600"
    ];

    const tiposViagem = [
      "Viagem em família",
      "Viagem de negócios", 
      "Lua de mel",
      "Viagem solo",
      "Viagem com amigos"
    ];

    return avaliacoes.map((avaliacao, index) => {
      const nomeUsuario = avaliacao.usuario?.nome || 'Usuário Anônimo';
      const iniciais = nomeUsuario.split(' ')
        .map((nome: string) => nome.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);

      // Gerar comodidades baseadas nos campos booleanos do hotel
      const amenities: string[] = [];
      const hotel = avaliacao.hotel;
      if (hotel?.wifi) amenities.push('Wi-Fi');
      if (hotel?.piscina) amenities.push('Piscina');
      if (hotel?.estacionamento) amenities.push('Estacionamento');
      if (hotel?.cafeDaManha) amenities.push('Café da Manhã');
      if (hotel?.almoco) amenities.push('Almoço');
      if (hotel?.jantar) amenities.push('Jantar');
      if (hotel?.petFriendly) amenities.push('Pet Friendly');
      if (hotel?.allInclusive) amenities.push('All Inclusive');

      // Definir categoria baseada na nota e valor da diária
      let categoria = 'Hotel';
      if (hotel?.valorDiaria && hotel.valorDiaria >= 800) categoria = 'Hotel Luxo';
      else if (hotel?.valorDiaria && hotel.valorDiaria >= 500) categoria = 'Hotel Premium';
      else if (hotel?.valorDiaria && hotel.valorDiaria >= 300) categoria = 'Hotel Confort';
      else categoria = 'Hotel Econômico';

      // Determinar número de estrelas baseado na nota
      const estrelas = Math.min(5, Math.max(1, Math.round(Number(avaliacao.nota))));

      return {
        id: avaliacao.idAvaliacao,
        name: nomeUsuario,
        initials: iniciais,
        verified: `${avaliacao.usuario?.tipoUsuario || 'Viajante'} verificado`,
        rating: Number(avaliacao.nota),
        title: avaliacao.comentario ? `"${avaliacao.comentario}"` : "Experiência maravilhosa!",
        comment: avaliacao.comentario || "Foi uma experiência incrível! Recomendo a todos.",
        date: new Date(avaliacao.dataAvaliacao).toLocaleDateString('pt-BR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        type: tiposViagem[index % tiposViagem.length],
        image: hotel?.imagens || hotel?.imagem || img1, // Usa a imagem do hotel ou imagem padrão
        bgColor: cores[index % cores.length],
        hotel: {
          name: hotel?.nome || 'Hotel',
          location: hotel?.localizacao || 'Localização não informada',
          stars: estrelas,
          amenities: amenities,
          category: categoria,
          description: hotel?.descricao || '',
          dailyRate: hotel?.valorDiaria || 0,
          rooms: hotel?.quantidadeDeQuartos || 0
        }
      };
    });
  };

  // Carregar avaliações da API 
  const loadAvaliacoes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const avaliacoes = await avaliacaoService.getAll();
      
      if (avaliacoes && avaliacoes.length > 0) {
        const avaliacoesFormatadas = formatarAvaliacoes(avaliacoes);
        setReviews(avaliacoesFormatadas);
      } else {
        setReviews([]);
        setError('Nenhuma avaliação encontrada no banco de dados.');
      }
    } catch (err) {
      console.error('Erro ao carregar avaliações:', err);
      setError('Erro ao carregar avaliações do banco de dados.');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAvaliacoes();
  }, []);

  return {
    reviews,
    loading,
    error,
    refetch: loadAvaliacoes
  };
};
