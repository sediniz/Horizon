
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPacotes, type PacoteAPI } from '../../../api/pacotes';
import { getHoteisByIds } from '../../../api/hoteis';
import { useFavoritos } from '../../../contexts/FavoritosContext';
import { useHotelAvaliacoes } from '../../../hooks/useHotelAvaliacoes';
import PraiaImg from '../../../assets/Praia01.png';
import Paris2Img from '../../../assets/Paris2.png';
import CancunImg from '../../../assets/cancun.png';
import IconRenderer from '../../../components/IconRenderer/IconRenderer';

// Definindo o tipo das comodidades
type Amenity = {
  name: string;
  icon: string;
};

type DisplayPackage = {
  id: number;
  hotelId?: number; // Adicionado para buscar avaliações reais
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
};

// Imagens para usar como fallback baseado no destino
const getImageByDestino = (destino: string): string => {
  const destinoLower = destino.toLowerCase();
  if (destinoLower.includes('praia') || destinoLower.includes('bahia') || destinoLower.includes('mar')) {
    return PraiaImg;
  } else if (destinoLower.includes('paris') || destinoLower.includes('frança')) {
    return Paris2Img;
  } else if (destinoLower.includes('cancun') || destinoLower.includes('méxico')) {
    return CancunImg;
  }
  return PraiaImg; // Fallback padrão
};

const mapPacoteToDisplay = (pacote: PacoteAPI): DisplayPackage => {
  const amenities: Amenity[] = [];
  
  if (pacote.hotel) {
    if (pacote.hotel.wifi) amenities.push({ name: 'WiFi Grátis', icon: 'wifi' });
    if (pacote.hotel.piscina) amenities.push({ name: 'Piscina', icon: 'pool' });
    if (pacote.hotel.estacionamento) amenities.push({ name: 'Estacionamento', icon: 'car' });
    if (pacote.hotel.petFriendly) amenities.push({ name: 'Pet Friendly', icon: 'heart' });
    if (pacote.hotel.cafeDaManha) amenities.push({ name: 'Café da Manhã', icon: 'coffee' });
    if (pacote.hotel.almoco) amenities.push({ name: 'Almoço', icon: 'utensils' });
    if (pacote.hotel.jantar) amenities.push({ name: 'Jantar', icon: 'utensils' });
    if (pacote.hotel.allInclusive) amenities.push({ name: 'All Inclusive', icon: 'star' });
  }
  
  if (amenities.length === 0) {
    amenities.push(
      { name: 'WiFi Grátis', icon: 'wifi' },
      { name: 'Ar Condicionado', icon: 'ac' },
      { name: 'Piscina', icon: 'pool' },
      { name: 'Restaurante', icon: 'restaurant' }
    );
  }

  const hotelImage = pacote.hotel?.imagens;
  const fallbackImage = getImageByDestino(pacote.destino);
  
  let realRating = 4.0; 
  let reviewCount = 0;
  
  if (pacote.hotel?.avaliacoes && pacote.hotel.avaliacoes.length > 0) {
    const somaNotas = pacote.hotel.avaliacoes.reduce((soma, av) => soma + av.nota, 0);
    realRating = somaNotas / pacote.hotel.avaliacoes.length;
    reviewCount = pacote.hotel.avaliacoes.length;
  }
  
  // CALCULAR PREÇO POR PESSOA (diária × dias)
  const valorDiaria = pacote.hotel?.valorDiaria || 
                     (pacote.hotel?.quarto?.valorDoQuarto || 0) + 200 || 
                     (pacote.valorTotal / pacote.duracao / pacote.quantidadeDePessoas);
  
  const precoPorPessoa = valorDiaria * pacote.duracao;
  
  return {
    id: pacote.pacoteId,
    hotelId: pacote.hotelId, // Incluir hotelId para buscar avaliações
    title: pacote.titulo,
    hotelName: pacote.hotel?.nome || 'Hotel Incluído',
    price: `R$ ${precoPorPessoa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    duration: `${pacote.duracao} dias / ${pacote.duracao - 1} noites`,
    image: hotelImage || fallbackImage, 
    rating: realRating, 
    reviewCount: reviewCount, 
    location: pacote.destino,
    amenities
    
  };
};

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

// Componente PackageCard que usa avaliações reais
const PackageCard: React.FC<{ pkg: DisplayPackage; onPacoteClick: (id: number) => void }> = ({ pkg, onPacoteClick }) => {
  const { isFavorito, toggleFavorito } = useFavoritos();
  
  // Buscar avaliações reais do hotel
  const { rating: realRating, reviewCount: realReviewCount, isLoading: avaliacoesLoading } = useHotelAvaliacoes(pkg.hotelId);
  
  // Usar avaliações reais se disponíveis, senão usar fallback
  const displayRating = realRating > 0 ? realRating : pkg.rating;
  const displayReviewCount = realReviewCount > 0 ? realReviewCount : pkg.reviewCount;

  return (
    <div
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
      onClick={() => onPacoteClick(pkg.id)}
    >
      {/* Imagem */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-lg text-xs backdrop-blur-sm">
          {pkg.location}
        </div>
      </div>

      {/* Conteúdo do card */}
      <div className="p-4">
        {/* Título e Hotel */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{pkg.title}</h3>
          <p className="text-gray-600 text-sm">{pkg.hotelName}</p>
        </div>

        {/* Avaliação com dados reais */}
        <div className="mb-3">
          <StarRating rating={displayRating} />
          <p className="text-xs text-gray-500 mt-1">
            {displayReviewCount} avaliações
            {realReviewCount > 0 && !avaliacoesLoading && (
              <span className="ml-1 text-green-600">✓</span>
            )}
          </p>
        </div>

        {/* Preço */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            {pkg.originalPrice && (
              <span className="text-sm text-gray-500 line-through">{pkg.originalPrice}</span>
            )}
            <span className="text-2xl font-bold text-blue-600">{pkg.price}</span>
          </div>
          <p className="text-sm text-gray-600">{pkg.duration}</p>
          <p className="text-xs text-gray-500">por pessoa</p>
        </div>

        {/* Comodidades */}
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-800 mb-2">Comodidades:</p>
          <div className="grid grid-cols-3 gap-2">
            {pkg.amenities.slice(0, 6).map((amenity: Amenity, index: number) => (
              <div key={index} className="flex items-center gap-1 text-xs text-gray-600">
                <IconRenderer iconName={amenity.icon} className="w-4 h-4 text-blue-600" />
                <span className="truncate">{amenity.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <button 
            className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
            onClick={(e) => {
              e.stopPropagation();
              onPacoteClick(pkg.id);
            }}
          >
            Reservar Agora
          </button>
          <button 
            className={`px-3 py-2 border rounded-lg transition-all duration-200 group ${
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
                  : 'group-hover:fill-red-500'
              }`} 
              fill={isFavorito(pkg.id) ? 'currentColor' : 'none'} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const TravelPackages: React.FC = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<DisplayPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar pacotes da API quando o componente carregar
  useEffect(() => {
    const fetchPacotes = async () => {
      try {
        setLoading(true);
        
        const pacotesAPI = await getAllPacotes();
        
        // Pegar apenas os primeiros 3 pacotes para a home
        const primeiros3Pacotes = pacotesAPI.slice(0, 3);
        
        const hotelIds = [...new Set(primeiros3Pacotes.map(p => p.hotelId))];
        
        const hoteis = await getHoteisByIds(hotelIds);
        
        const hotelMap = new Map(hoteis.map(hotel => [hotel.hotelId, hotel]));
        
        const pacotesComHoteis = primeiros3Pacotes.map(pacote => ({
          ...pacote,
          hotel: hotelMap.get(pacote.hotelId)
        }));
        
        const displayPackages = pacotesComHoteis.map(mapPacoteToDisplay);
        
        setPackages(displayPackages);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar pacotes:', err);
        setError('Erro ao carregar pacotes. Usando dados de exemplo.');
        
        const fallbackPackages: DisplayPackage[] = [
          {
            id: 1,
            title: 'Pacote Especial',
            hotelName: 'Hotel Premium',
            price: 'R$ 2.500,00',
            duration: '7 dias / 6 noites',
            image: PraiaImg,
            rating: 4.8,
            reviewCount: 324,
            location: 'Destino Incrível',
            amenities: [
              { name: 'WiFi Grátis', icon: 'wifi' },
              { name: 'Piscina', icon: 'pool' },
              { name: 'Ar Condicionado', icon: 'ac' },
              { name: 'Restaurante', icon: 'restaurant' }
            ]
          }
        ];
        setPackages(fallbackPackages);
      } finally {
        setLoading(false);
      }
    };

    fetchPacotes();
  }, []);

  // Função para o click do pacote
  const handlePacoteClick = (pacoteId: number) => {
    navigate(`/pacote/${pacoteId}`);
  };

  if (loading) {
    return (
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nossos Pacotes Especiais</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Carregando pacotes incríveis...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Nossos Pacotes Especiais</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubra destinos incríveis com os melhores preços e comodidades exclusivas
          </p>
          {error && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg max-w-md mx-auto">
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg: DisplayPackage) => (
            <PackageCard key={pkg.id} pkg={pkg} onPacoteClick={handlePacoteClick} />
          ))}
        </div>

        {/* botão de ação */}
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