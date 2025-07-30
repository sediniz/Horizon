import React, { useState, useMemo } from 'react';
import PageHeader from './components/PageHeader';
import FilterSection from './components/FilterSection';
import PackageList from './components/PackageList';
import { allPackages } from './data/packagesData';
import type { FilterState } from './types';

const PacotesGerais: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    selectedLocation: '',
    selectedAmenities: []
  });

  // Filtrar pacotes baseado nos filtros selecionados
  const filteredPackages = useMemo(() => {
    return allPackages.filter(pkg => {
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
      
      <FilterSection
        selectedLocation={filters.selectedLocation}
        selectedAmenities={filters.selectedAmenities}
        onLocationChange={handleLocationChange}
        onAmenityToggle={handleAmenityToggle}
        onClearFilters={handleClearFilters}
        totalPackages={allPackages.length}
        filteredCount={filteredPackages.length}
      />
      
      <PackageList
        packages={filteredPackages}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
};

export default PacotesGerais;
