// src/components/TravelPackages.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import PraiaImg from '../../../assets/Praia01.png';
import Paris2Img from '../../../assets/Paris2.png';
import CancunImg from '../../../assets/cancun.png';
import IconRenderer from '../../../components/IconRenderer/IconRenderer';

// Definindo o tipo das comodidades
type Amenity = {
  name: string;
  icon: string;
};

// Definindo o tipo do pacote completo
type PackageProps = {
  id: number;
  title: string;
  hotelName: string;
  price: string;
  originalPrice?: string;
  duration: string;
  image: string;
  rating: number;
  reviewCount: number;
  location: string;
  amenities: Amenity[];
  highlights: string[];
  discount?: number;
};

const packages: PackageProps[] = [
  {
    id: 1,
    title: 'Pacote Praia Tropical',
    hotelName: 'Resort Paradise Beach',
    price: 'R$ 2.500',
    originalPrice: 'R$ 3.200',
    duration: '7 dias / 6 noites',
    image: PraiaImg,
    rating: 4.8,
    reviewCount: 324,
    location: 'Bahia, Brasil',
    discount: 22,
    amenities: [
      { name: 'WiFi Grátis', icon: 'wifi' },
      { name: 'Piscina', icon: 'pool' },
      { name: 'Ar Condicionado', icon: 'ac' },
      { name: 'Restaurante', icon: 'restaurant' },
      { name: 'Spa', icon: 'spa' },
      { name: 'Academia', icon: 'gym' }
    ],
    highlights: ['Café da manhã incluso', 'Vista para o mar', 'Atividades aquáticas']
  },
  {
    id: 2,
    title: 'Pacote Romântico Paris',
    hotelName: 'Hotel Eiffel Luxury',
    price: 'R$ 4.800',
    originalPrice: 'R$ 5.500',
    duration: '5 dias / 4 noites',
    image: Paris2Img,
    rating: 4.9,
    reviewCount: 567,
    location: 'Paris, França',
    discount: 13,
    amenities: [
      { name: 'WiFi Grátis', icon: 'wifi' },
      { name: 'Concierge', icon: 'concierge' },
      { name: 'Ar Condicionado', icon: 'ac' },
      { name: 'Room Service', icon: 'room-service' },
      { name: 'Bar', icon: 'bar' },
      { name: 'Transfer', icon: 'car' }
    ],
    highlights: ['City tour incluso', 'Vista da Torre Eiffel', 'Jantar romântico']
  },
  {
    id: 3,
    title: 'Pacote All Inclusive Cancún',
    hotelName: 'Cancún Paradise Resort',
    price: 'R$ 3.200',
    originalPrice: 'R$ 4.000',
    duration: '6 dias / 5 noites',
    image: CancunImg,
    rating: 4.7,
    reviewCount: 892,
    location: 'Cancún, México',
    discount: 20,
    amenities: [
      { name: 'All Inclusive', icon: 'all-inclusive' },
      { name: 'Praia Privada', icon: 'beach' },
      { name: 'Piscina', icon: 'pool' },
      { name: 'Spa', icon: 'spa' },
      { name: 'Esportes', icon: 'sports' },
      { name: 'Shows', icon: 'entertainment' }
    ],
    highlights: ['Todas as refeições incluídas', 'Bebidas liberadas', 'Entretenimento 24h']
  },
];

// Componente para renderizar as estrelas
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  // Estrelas cheias
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    );
  }

  // Meia estrela se necessário
  if (hasHalfStar) {
    stars.push(
      <svg key="half" className="w-4 h-4 text-yellow-400" viewBox="0 0 24 24">
        <defs>
          <linearGradient id="half-fill">
            <stop offset="50%" stopColor="currentColor"/>
            <stop offset="50%" stopColor="transparent"/>
          </linearGradient>
        </defs>
        <path fill="url(#half-fill)" stroke="currentColor" strokeWidth="1" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    );
  }

  // Estrelas vazias
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" viewBox="0 0 24 24" fill="none">
        <path stroke="currentColor" strokeWidth="1" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {stars}
      </div>
      <span className="text-sm font-medium text-gray-700 ml-1">{rating}</span>
      <span className="text-xs text-gray-500">({fullStars >= 1 ? `${fullStars} estrelas` : 'sem avaliação'})</span>
    </div>
  );
};

const TravelPackages: React.FC = () => {
  const navigate = useNavigate();

  {/* funcao pra o click do pacote */}
  const handlePacoteClick = (pacoteId: number) => {
    navigate(`/pacote/${pacoteId}`);
  };

  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Nossos Pacotes Especiais</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubra destinos incríveis com os melhores preços e comodidades exclusivas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
              onClick={() => handlePacoteClick(pkg.id)}
            >
              {/* Imagem com badge de desconto */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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

              {/* Conteúdo do card */}
              <div className="p-6">
                {/* Título e Hotel */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{pkg.title}</h3>
                  <p className="text-gray-600 text-sm">{pkg.hotelName}</p>
                </div>

                {/* Avaliação */}
                <div className="mb-4">
                  <StarRating rating={pkg.rating} />
                  <p className="text-xs text-gray-500 mt-1">{pkg.reviewCount} avaliações</p>
                </div>

                {/* Preço */}
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    {pkg.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">{pkg.originalPrice}</span>
                    )}
                    <span className="text-2xl font-bold text-blue-600">{pkg.price}</span>
                  </div>
                  <p className="text-sm text-gray-600">{pkg.duration}</p>
                </div>

                {/* Comodidades */}
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-800 mb-2">Comodidades:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {pkg.amenities.slice(0, 6).map((amenity, index) => (
                      <div key={index} className="flex items-center gap-1 text-xs text-gray-600">
                        <IconRenderer iconName={amenity.icon} className="w-4 h-4 text-blue-600" />
                        <span className="truncate">{amenity.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Destaques */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-800 mb-2">Destaques:</p>
                  <ul className="space-y-1">
                    {pkg.highlights.map((highlight, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-center gap-2">
                        <svg className="w-3 h-3 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Botões de ação */}
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      {/* Rota pra pacote id */}
                      navigate(`/pacote/${pkg.id}`);
                    }}
                  >
                    Reservar Agora
                  </button>
                  <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-red-50 hover:border-red-400 transition-all duration-200 group/heart">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 group-hover/heart:text-red-600 group-hover/heart:fill-red-600 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* botao de acao */}
        <div className="text-center mt-12">
          <button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            onClick={() => navigate('/pacotes')}
          >
            Ver Todos os Pacotes
          </button>
        </div>
      </div>
    </section>
  );
};

export default TravelPackages;