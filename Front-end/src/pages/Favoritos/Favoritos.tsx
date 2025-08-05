import React, { useState, useEffect } from 'react';
import { useFavoritos } from '../../contexts/FavoritosContext';
import { getAllPacotes } from '../../api/pacotes';
import { getHoteisByIds } from '../../api/hoteis';
import { convertAPIPackagesToPackages } from '../../utils/packageConverter';
import PackageList from '../PacotesGerais/components/PackageList';
import type { PackageProps } from '../PacotesGerais/types';

// Header específico para Favoritos
const FavoritosHeader: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 rounded-full p-4">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Meus Favoritos</h1>
          <p className="text-xl text-pink-100 max-w-2xl mx-auto">
            Todos os pacotes que você salvou para não esquecer
          </p>
        </div>
      </div>
    </div>
  );
};

// Estado vazio quando não há favoritos
const EmptyFavoritos: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-2xl p-12 shadow-lg">
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 rounded-full p-6">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Nenhum favorito ainda
        </h2>
        <p className="text-gray-600 mb-8 max-w-lg mx-auto">
          Você ainda não salvou nenhum pacote nos seus favoritos. 
          Explore nossos destinos incríveis e salve os que mais gostar!
        </p>
        <a 
          href="/pacotes" 
          className="inline-flex items-center bg-gradient-to-r from-pink-500 to-red-500 text-white px-8 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          Explorar Pacotes
        </a>
      </div>
    </div>
  );
};

const Favoritos: React.FC = () => {
  const { favoritos, totalFavoritos } = useFavoritos();
  const [packages, setPackages] = useState<PackageProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar pacotes favoritos
  useEffect(() => {
    const loadFavoritos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('❤️ Carregando favoritos...', favoritos);
        
        if (favoritos.length === 0) {
          setPackages([]);
          setLoading(false);
          return;
        }
        
        // Buscar todos os pacotes da API
        console.log('📦 Buscando todos os pacotes...');
        const todosPacotes = await getAllPacotes();
        
        // Filtrar apenas os pacotes que estão nos favoritos
        const pacotesFavoritos = todosPacotes.filter(pacote => 
          favoritos.includes(pacote.pacoteId)
        );
        
        console.log('❤️ Pacotes favoritos encontrados:', pacotesFavoritos);
        
        if (pacotesFavoritos.length === 0) {
          setPackages([]);
          setLoading(false);
          return;
        }
        
        // Extrair IDs únicos dos hotéis
        const hotelIds = [...new Set(pacotesFavoritos.map(p => p.hotelId))];
        console.log('🏨 IDs dos hotéis para carregar:', hotelIds);
        
        // Carregar dados dos hotéis com avaliações
        const hoteis = await getHoteisByIds(hotelIds);
        console.log('🏨 Hotéis carregados:', hoteis);
        
        // Criar um mapa hotelId -> hotel para lookup rápido
        const hotelMap = new Map(hoteis.map(hotel => [hotel.hotelId, hotel]));
        
        // Combinar pacotes com dados dos hotéis
        const pacotesComHotel = pacotesFavoritos.map(pacote => ({
          ...pacote,
          hotel: hotelMap.get(pacote.hotelId)
        }));
        
        // Converter para o formato de exibição
        const packageProps = convertAPIPackagesToPackages(pacotesComHotel);
        console.log('✅ Pacotes favoritos convertidos:', packageProps);
        
        setPackages(packageProps);
        
      } catch (err) {
        console.error('Erro ao carregar favoritos:', err);
        setError('Erro ao carregar seus favoritos. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadFavoritos();
  }, [favoritos]); // Recarregar quando favoritos mudarem

  // Função para limpar favoritos (não há filtros aqui)
  const handleClearFilters = () => {
    // Em favoritos, esta função não faz nada
    console.log('Não há filtros para limpar em favoritos');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FavoritosHeader />
      
      {/* Informações dos favoritos */}
      {totalFavoritos > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-pink-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
                <span className="text-gray-700 font-medium">
                  {totalFavoritos} {totalFavoritos === 1 ? 'pacote favorito' : 'pacotes favoritos'}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Clique no coração para remover dos favoritos
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          <span className="ml-3 text-gray-600">Carregando seus favoritos...</span>
        </div>
      )}
      
      {/* Error State */}
      {error && !loading && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 mb-2">
              <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-1">Erro ao Carregar Favoritos</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      {!loading && !error && (
        <>
          {packages.length > 0 ? (
            <PackageList
              packages={packages}
              onClearFilters={handleClearFilters}
            />
          ) : (
            <EmptyFavoritos />
          )}
        </>
      )}
    </div>
  );
};

export default Favoritos;
