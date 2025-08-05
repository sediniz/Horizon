import React from 'react';
import IconRenderer from '../../../components/IconRenderer/IconRenderer';
import StarRating from './StarRating';
import { useNavigate } from 'react-router-dom';
import { useFavoritos } from '../../../contexts/FavoritosContext';
import type { PackageProps } from '../types';

interface PackageCardProps {
  package: PackageProps;
}




const PackageCard: React.FC<PackageCardProps> = ({ package: pkg }) => {
  const navigate = useNavigate();
  const { isFavorito, toggleFavorito } = useFavoritos();

  // Log para debug do rating
  console.log(`📦 PackageCard - Pacote: ${pkg.title}`, {
    rating: pkg.rating,
    reviewCount: pkg.reviewCount,
    hotelName: pkg.hotelName
  });

  const handleViewPackage = () => {
    navigate(`/pacote/${pkg.id}`);
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer" 
      onClick={handleViewPackage}
    >
      <div className="flex flex-col lg:flex-row">
        {/* Imagem */}
        <div className="lg:w-1/3 relative h-65 lg:h-auto lg:min-h-full">
          <img
            src={pkg.image}
            alt={pkg.title}
            className="w-full h-full object-cover absolute inset-0"
          />
          {pkg.discount && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              -{pkg.discount}%
            </div>
          )}
          <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-lg text-xs backdrop-blur-sm">
            {pkg.location}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="lg:w-2/3 p-6">
          <div className="flex flex-col lg:flex-row lg:justify-between h-full">
            
            {/* Informações principais */}
            <div className="flex-1">
              <div className="mb-3">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{pkg.title}</h3>
                <p className="text-gray-600">{pkg.hotelName}</p>
              </div>

              <div className="mb-3">
                <StarRating rating={pkg.rating} />
                <p className="text-xs text-gray-500 mt-1">{pkg.reviewCount} avaliações</p>
              </div>

              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {pkg.description}
              </p>

              {/* Comodidades */}
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-800 mb-2">Comodidades:</p>
                <div className="flex flex-wrap gap-2">
                  {pkg.amenities.slice(0, 6).map((amenity, index) => (
                    <div key={index} className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                      <IconRenderer iconName={amenity.icon} className="w-3 h-3" />
                      <span>{amenity.name}</span>
                    </div>
                  ))}
                  {pkg.amenities.length > 6 && (
                    <span className="text-xs text-gray-500">+{pkg.amenities.length - 6} mais</span>
                  )}
                </div>
              </div>

              {/* Destaques */}
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-800 mb-2">Destaques:</p>
                <div className="flex flex-wrap gap-2">
                  {pkg.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full">
                      <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Preço e ações */}
            <div className="lg:w-48 lg:ml-6 flex flex-col justify-between">
              <div className="text-right mb-4">
                <p className="text-sm text-gray-600 mb-1">{pkg.duration}</p>
                {pkg.originalPrice && (
                  <p className="text-sm text-gray-500 line-through">{pkg.originalPrice}</p>
                )}
                <p className="text-3xl font-bold text-blue-600">{pkg.price}</p>
                <p className="text-xs text-gray-500">por pessoa</p>
              </div>

              <div className="flex flex-col gap-2">
                <button 
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/pacote/${pkg.id}`);
                  }}
                >
                  Ver Detalhes
                </button>
                <button 
                  className={`w-full border py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                    isFavorito(pkg.id) 
                      ? 'border-red-300 bg-red-50 text-red-600' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-red-300 hover:text-red-500'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorito(pkg.id);
                  }}
                  title={isFavorito(pkg.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                  <svg 
                    className={`w-4 h-4 transition-colors ${
                      isFavorito(pkg.id) 
                        ? 'fill-red-500 text-red-500' 
                        : ''
                    }`} 
                    fill={isFavorito(pkg.id) ? 'currentColor' : 'none'} 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                  {isFavorito(pkg.id) ? 'Favoritado' : 'Favoritar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
