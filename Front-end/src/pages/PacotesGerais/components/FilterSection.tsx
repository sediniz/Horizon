import React, { useState, useRef, useEffect } from 'react';
import IconRenderer from '../../../components/IconRenderer/IconRenderer';

interface FilterSectionProps {
  selectedLocation: string;
  selectedAmenities: string[];
  onLocationChange: (location: string) => void;
  onAmenityToggle: (amenityName: string) => void;
  onClearFilters: () => void;
  totalPackages: number;
  filteredCount: number;
  availableAmenities?: {name: string, icon: string}[];
  availableLocations?: string[];
}

const FilterSection: React.FC<FilterSectionProps> = ({
  selectedLocation,
  selectedAmenities,
  onLocationChange,
  onAmenityToggle,
  onClearFilters,
  totalPackages,
  filteredCount,
  availableAmenities = [],
  availableLocations = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const amenitiesScrollRef = useRef<HTMLDivElement>(null);

  // Adicionar estilo para ocultar scrollbar das comodidades
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .amenities-scroll::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Filtrar localizações baseado no termo de busca
  const filteredLocations = availableLocations.filter(location =>
    location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationSelect = (location: string) => {
    onLocationChange(location);
    setSearchTerm(location);
    setShowDropdown(false);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setShowDropdown(true);
    
    // Se o valor estiver vazio, limpar seleção
    if (value === '') {
      onLocationChange('');
    }
  };

  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Filtro de Destino com Busca */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
              Destino
            </label>
            <div className="relative" ref={dropdownRef}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                placeholder="Digite o destino desejado..."
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pl-9"
              />
              <svg className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
              </svg>

              {/* Dropdown de Sugestões */}
              {showDropdown && filteredLocations.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredLocations.map((location) => (
                    <button
                      key={location}
                      onClick={() => handleLocationSelect(location)}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-2"
                    >
                      <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-gray-700">{location}</span>
                    </button>
                  ))}
                  {searchTerm && !filteredLocations.some(loc => loc.toLowerCase() === searchTerm.toLowerCase()) && (
                    <div className="px-3 py-2 text-gray-500 text-sm">
                      Nenhum destino encontrado para "{searchTerm}"
                    </div>
                  )}
                </div>
              )}

              {/* Botão para limpar */}
              {selectedLocation && (
                <button
                  onClick={() => {
                    onLocationChange('');
                    setSearchTerm('');
                  }}
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600"
                >
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
              )}
            </div>
            {selectedLocation && (
              <div className="mt-2 text-sm text-blue-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Filtrando por: {selectedLocation}
              </div>
            )}
          </div>

          {/* Filtro de Comodidades Melhorado */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              Comodidades
              {selectedAmenities.length > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {selectedAmenities.length} selecionada{selectedAmenities.length > 1 ? 's' : ''}
                </span>
              )}
            </label>
            <div 
              ref={amenitiesScrollRef}
              className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1 amenities-scroll"
              style={{
                scrollbarWidth: 'none', /* Firefox */
                msOverflowStyle: 'none', /* IE e Edge */
              }}
            >
              {availableAmenities.map((amenity) => (
                <label 
                  key={amenity.name} 
                  className={`
                    flex items-center gap-2 cursor-pointer p-2 rounded-lg border-2 transition-all duration-200
                    ${selectedAmenities.includes(amenity.name) 
                      ? 'border-blue-500 bg-blue-50 shadow-sm' 
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity.name)}
                    onChange={() => onAmenityToggle(amenity.name)}
                    className="sr-only"
                  />
                  <div className={`
                    w-6 h-6 rounded-md flex items-center justify-center transition-colors
                    ${selectedAmenities.includes(amenity.name) 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-blue-600'
                    }
                  `}>
                    <IconRenderer iconName={amenity.icon} className="w-3 h-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-xs font-medium block truncate ${
                      selectedAmenities.includes(amenity.name) ? 'text-blue-900' : 'text-gray-700'
                    }`}>
                      {amenity.name}
                    </span>
                  </div>
                  {selectedAmenities.includes(amenity.name) && (
                    <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Botões de ação dos filtros */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2">
          <div className="flex gap-2">
            <button
              onClick={() => {
                onClearFilters();
                setSearchTerm('');
              }}
              className="px-3 py-1 text-xs text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-200 flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
              Limpar Filtros
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Indicadores de filtros ativos */}
            {(selectedLocation || selectedAmenities.length > 0) && (
              <div className="flex items-center gap-1 text-xs">
                <span className="text-gray-500">Filtros:</span>
                {selectedLocation && (
                  <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full text-xs">
                    📍 {selectedLocation.split(',')[0]}
                  </span>
                )}
                {selectedAmenities.length > 0 && (
                  <span className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full text-xs">
                    ⭐ {selectedAmenities.length}
                  </span>
                )}
              </div>
            )}
            
            {/* Contador de resultados */}
            <div className="text-xs text-gray-600 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
              <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
              </svg>
              <span className="font-semibold text-blue-600">{filteredCount}</span> 
              <span>de {totalPackages} pacotes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
