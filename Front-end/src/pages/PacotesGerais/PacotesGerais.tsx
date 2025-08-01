import React, { useState, useMemo, useEffect } from 'react';
import PageHeader from './components/PageHeader';
import FilterSection from './components/FilterSection';
import PackageList from './components/PackageList';
import { getAllPacotes } from '../../api/pacotes';
import { getHoteisByIds } from '../../api/hoteis';
import { convertAPIPackagesToPackages } from '../../utils/packageConverter';
import type { FilterState } from './types';
import type { PackageProps } from './types';

const PacotesGerais: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    selectedLocation: '',
    selectedAmenities: []
  });
  
  const [packages, setPackages] = useState<PackageProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar pacotes da API
  useEffect(() => {
    const loadPackages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🚀 Carregando pacotes da API...');
        const pacotesAPI = await getAllPacotes();
        console.log('📦 Pacotes recebidos:', pacotesAPI);
        
        // Extrair IDs únicos dos hotéis
        const hotelIds = [...new Set(pacotesAPI.map(p => p.hotelId))];
        console.log('🏨 IDs dos hotéis para carregar:', hotelIds);
        
        // Carregar dados dos hotéis
        const hoteis = await getHoteisByIds(hotelIds);
        console.log('🏨 Hotéis carregados:', hoteis);
        console.log('⭐ Avaliações dos hotéis:', hoteis.map(h => ({ 
          hotel: h.nome, 
          avaliacoes: h.avaliacoes?.length || 0,
          mediaNotas: h.avaliacoes?.length ? 
            (h.avaliacoes.reduce((sum, av) => sum + av.nota, 0) / h.avaliacoes.length).toFixed(1) 
            : 'N/A'
        })));
        
        // Criar um mapa hotelId -> hotel para lookup rápido
        const hotelMap = new Map(hoteis.map(hotel => [hotel.hotelId, hotel]));
        
        // Combinar pacotes com dados dos hotéis
        const pacotesComHotel = pacotesAPI.map(pacote => ({
          ...pacote,
          hotel: hotelMap.get(pacote.hotelId)
        }));
        
        console.log('🔗 Pacotes combinados com hotéis:', pacotesComHotel);
        
        const convertedPackages = convertAPIPackagesToPackages(pacotesComHotel);
        console.log('✅ Pacotes convertidos:', convertedPackages);
        
        setPackages(convertedPackages);
      } catch (err) {
        console.error('❌ Erro ao carregar pacotes:', err);
        setError('Falha ao carregar pacotes. Tente novamente mais tarde.');
        
        // Em caso de erro, usar dados mockados como fallback
        const { allPackages } = await import('./data/packagesData');
        setPackages(allPackages);
      } finally {
        setLoading(false);
      }
    };

    loadPackages();
  }, []);

  // Filtrar pacotes baseado nos filtros selecionados
  const filteredPackages = useMemo(() => {
    return packages.filter(pkg => {
      // Filtro por localização
      const locationMatch = !filters.selectedLocation || pkg.location === filters.selectedLocation;
      
      // Filtro por comodidades
      const amenityMatch = filters.selectedAmenities.length === 0 || 
        filters.selectedAmenities.every(amenity => 
          pkg.amenities.some(pkgAmenity => pkgAmenity.name === amenity)
        );
      
      return locationMatch && amenityMatch;
    });
  }, [filters]);

  // Funções para manipular filtros
  const handleLocationChange = (location: string) => {
    setFilters(prev => ({ ...prev, selectedLocation: location }));
  };

  const handleAmenityToggle = (amenityName: string) => {
    setFilters(prev => ({
      ...prev,
      selectedAmenities: prev.selectedAmenities.includes(amenityName)
        ? prev.selectedAmenities.filter(a => a !== amenityName)
        : [...prev.selectedAmenities, amenityName]
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      selectedLocation: '',
      selectedAmenities: []
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />
      
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Carregando pacotes...</span>
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
            <h3 className="text-lg font-semibold text-red-800 mb-1">Erro ao Carregar Pacotes</h3>
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
          <FilterSection
            selectedLocation={filters.selectedLocation}
            selectedAmenities={filters.selectedAmenities}
            onLocationChange={handleLocationChange}
            onAmenityToggle={handleAmenityToggle}
            onClearFilters={handleClearFilters}
            totalPackages={packages.length}
            filteredCount={filteredPackages.length}
          />
          
          <PackageList
            packages={filteredPackages}
            onClearFilters={handleClearFilters}
          />
        </>
      )}
    </div>
  );
};

export default PacotesGerais;
