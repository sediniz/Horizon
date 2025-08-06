import { useState, useEffect } from 'react';
import { avaliacaoService, type Avaliacao } from '../services/avaliacaoService';

interface UseHotelAvaliacoesReturn {
  rating: number;
  reviewCount: number;
  isLoading: boolean;
  error: string | null;
}

export const useHotelAvaliacoes = (hotelId?: number): UseHotelAvaliacoesReturn => {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvaliacoes = async () => {
      if (!hotelId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Buscar todas as avaliações e filtrar pelo hotelId
        const todasAvaliacoes = await avaliacaoService.getAll();
        const avaliacoesDoHotel = todasAvaliacoes.filter(avaliacao => avaliacao.hotelId === hotelId);
        
        setAvaliacoes(avaliacoesDoHotel);
      } catch (err) {
        console.error('Erro ao buscar avaliações:', err);
        setError('Erro ao carregar avaliações');
        setAvaliacoes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvaliacoes();
  }, [hotelId]);

  // Calcular rating e count baseado nas avaliações
  const rating = avaliacoes.length > 0 
    ? avaliacoes.reduce((sum, av) => sum + av.nota, 0) / avaliacoes.length 
    : 0;

  const reviewCount = avaliacoes.length;

  return {
    rating: Math.round(rating * 10) / 10, // Arredondar para 1 casa decimal
    reviewCount,
    isLoading,
    error
  };
};
