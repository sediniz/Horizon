// src/components/TravelPackages.tsx

import React from 'react';
import PraiaImg from '../../../assets/Praia01.png';
import Paris2Img from '../../../assets/Paris2.png';
import CancunImg from '../../../assets/cancun.png';

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
      { name: 'WiFi Grátis', icon: '📶' },
      { name: 'Piscina', icon: '🏊‍♀️' },
      { name: 'Ar Condicionado', icon: '❄️' },
      { name: 'Restaurante', icon: '🍽️' },
      { name: 'Spa', icon: '💆‍♀️' },
      { name: 'Academia', icon: '💪' }
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
      { name: 'WiFi Grátis', icon: '📶' },
      { name: 'Concierge', icon: '🛎️' },
      { name: 'Ar Condicionado', icon: '❄️' },
      { name: 'Room Service', icon: '🛏️' },
      { name: 'Bar', icon: '🍸' },
      { name: 'Transfer', icon: '🚗' }
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
      { name: 'All Inclusive', icon: '🍹' },
      { name: 'Praia Privada', icon: '🏖️' },
      { name: 'Piscina', icon: '🏊‍♀️' },
      { name: 'Spa', icon: '💆‍♀️' },
      { name: 'Esportes', icon: '⚽' },
      { name: 'Shows', icon: '🎭' }
    ],
    highlights: ['Todas as refeições incluídas', 'Bebidas liberadas', 'Entretenimento 24h']
  },
];

// Componente para renderizar as estrelas
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push('⭐');
  }
  if (hasHalfStar) {
    stars.push('⭐');
  }

  return (
    <div className="flex items-center gap-1">
      <span className="text-yellow-500">{stars.join('')}</span>
      <span className="text-sm font-medium text-gray-700">{rating}</span>
      <span className="text-xs text-gray-500">({fullStars >= 1 ? `${fullStars} estrelas` : 'sem avaliação'})</span>
    </div>
  );
};

const TravelPackages: React.FC = () => {
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
                        <span>{amenity.icon}</span>
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
                        <span className="text-green-500">✓</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Botões de ação */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Reservar Agora
                  </button>
                  <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    ❤️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
            Ver Todos os Pacotes
          </button>
        </div>
      </div>
    </section>
  );
};

export default TravelPackages;