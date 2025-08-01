import { useState, useEffect } from 'react';
import { avaliacaoService } from '../services/avaliacaoService';
import type { Avaliacao, AvaliacaoFormatada } from '../services/avaliacaoService';
import img1 from '../assets/img1.jpeg';

// Hook customizado para gerenciar avaliações formatadas
export const useAvaliacoes = () => {
  const [reviews, setReviews] = useState<AvaliacaoFormatada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para formatar avaliações para o componente (lógica de apresentação no frontend)
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
      const nomeUsuario = avaliacao.Usuario?.Nome || 'Usuário Anônimo';
      const iniciais = nomeUsuario.split(' ')
        .map((nome: string) => nome.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);

      // Gerar comodidades baseadas nos campos booleanos do hotel
      const amenities: string[] = [];
      const hotel = avaliacao.Hotel;
      if (hotel?.Wifi) amenities.push('Wi-Fi');
      if (hotel?.Piscina) amenities.push('Piscina');
      if (hotel?.Estacionamento) amenities.push('Estacionamento');
      if (hotel?.CafeDaManha) amenities.push('Café da Manhã');
      if (hotel?.PetFriendly) amenities.push('Pet Friendly');

      // Definir categoria baseada na nota
      let categoria = 'Hotel';
      if (avaliacao.Nota >= 4.5) categoria = 'Hotel Premium';
      else if (avaliacao.Nota >= 4.0) categoria = 'Hotel de Qualidade';

      return {
        id: avaliacao.IdAvaliacao,
        name: nomeUsuario,
        initials: iniciais,
        verified: "Viajante verificado",
        rating: avaliacao.Nota,
        title: avaliacao.Comentario ? `"${avaliacao.Comentario}"` : "Experiência maravilhosa!",
        comment: avaliacao.Comentario || "Foi uma experiência incrível! Recomendo a todos.",
        date: new Date(avaliacao.DataAvaliacao).toLocaleDateString('pt-BR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        type: tiposViagem[index % tiposViagem.length],
        image: img1, // Usando imagem padrão por enquanto
        bgColor: cores[index % cores.length],
        hotel: {
          name: hotel?.Nome || 'Hotel',
          location: hotel?.Localizacao || 'Localização não informada',
          stars: Math.round(avaliacao.Nota),
          amenities: amenities,
          category: categoria
        }
      };
    });
  };

  // Carregar avaliações da API - apenas dados reais do banco
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
