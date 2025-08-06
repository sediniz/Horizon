import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from './components/PageHeader';
import FilterSection from './components/FilterSection';
import PackageList from './components/PackageList';
import { getAllPacotes } from '../../api/pacotes';
import { getHoteisByIds, getAvailableAmenities } from '../../api/hoteis';
import { convertAPIPackagesToPackages } from '../../utils/packageConverter';
import type { FilterState } from './types';
import type { PackageProps } from './types';

const PacotesGerais: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  const searchData = {
    destino: searchParams.get('destino') || '',
    checkin: searchParams.get('checkin') || '',
    checkout: searchParams.get('checkout') || '',
    quartos: parseInt(searchParams.get('quartos') || '1'),
    adultos: parseInt(searchParams.get('adultos') || '2'),
    criancas: parseInt(searchParams.get('criancas') || '0')
  };
  
  const [filters, setFilters] = useState<FilterState>({
    selectedLocation: searchData.destino, 
    selectedAmenities: []
  });
  
  const [packages, setPackages] = useState<PackageProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableAmenities, setAvailableAmenities] = useState<{name: string, icon: string}[]>([]);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);

  useEffect(() => {
    const loadPackages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const pacotesAPI = await getAllPacotes();
        
        const hotelIds = [...new Set(pacotesAPI.map(p => p.hotelId))];
        console.log(' IDs dos hotéis para carregar:', hotelIds);
        
        const hoteis = await getHoteisByIds(hotelIds);
        
        const hotelMap = new Map(hoteis.map(hotel => [hotel.hotelId, hotel]));
        
        const pacotesComHotel = pacotesAPI.map(pacote => ({
          ...pacote,
          hotel: hotelMap.get(pacote.hotelId)
        }));
        
        const convertedPackages = convertAPIPackagesToPackages(pacotesComHotel);
        console.log('Pacotes convertidos:', convertedPackages);
        
        setPackages(convertedPackages);

        const amenities = await getAvailableAmenities();
        setAvailableAmenities(amenities);

        const locations = [...new Set(hoteis.map(h => h.localizacao))].filter(Boolean);
        setAvailableLocations(locations);

      } catch (err) {
        console.error('Erro ao carregar pacotes:', err);
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
    console.log(' Aplicando filtros:', filters);
    console.log(' Total de pacotes:', packages.length);
    
    const filtered = packages.filter(pkg => {
      // Filtro por localização
      const locationMatch = !filters.selectedLocation || pkg.location === filters.selectedLocation;
      
      // Filtro por comodidades
      const amenityMatch = filters.selectedAmenities.length === 0 || 
        filters.selectedAmenities.every(amenity => 
          pkg.amenities.some(pkgAmenity => pkgAmenity.name === amenity)
        );
      
      return locationMatch && amenityMatch;
    });
    
    return filtered;
  }, [packages, filters]);

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
      
      {/* Informação da Buscaquando vem da página Home */}
      {searchData.destino && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-blue-800">Resultados da sua busca</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center">
                <span className="text-blue-600 font-medium mr-2">📍 Destino:</span>
                <span className="text-blue-800 capitalize">{searchData.destino}</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-600 font-medium mr-2">📅 Período:</span>
                <span className="text-blue-800">
                  {searchData.checkin ? new Date(searchData.checkin).toLocaleDateString('pt-BR') : 'N/A'} até {searchData.checkout ? new Date(searchData.checkout).toLocaleDateString('pt-BR') : 'N/A'}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-600 font-medium mr-2">👥 Hóspedes:</span>
                <span className="text-blue-800">
                  {searchData.quartos} quarto(s), {searchData.adultos} adulto(s)
                  {searchData.criancas > 0 && `, ${searchData.criancas} criança(s)`}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      
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
            availableAmenities={availableAmenities}
            availableLocations={availableLocations}
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
