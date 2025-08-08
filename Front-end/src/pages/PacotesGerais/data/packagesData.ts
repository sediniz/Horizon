import type { PackageProps, Amenity } from '../types';
import PraiaImg from '../../../assets/Praia01.png';
import Paris2Img from '../../../assets/Paris2.png';
import CancunImg from '../../../assets/cancun.png';

// Dados dos pacotes expandidos
export const allPackages: PackageProps[] = [
  {
    id: 1,
    hotelId: 1, // ID do hotel para buscar avaliações reais
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
    description: 'Desfrute de uma experiência única em um dos resorts mais exclusivos da Bahia. Com vista panorâmica para o mar e acesso direto à praia.',
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
    description: 'Viva um romance inesquecível na Cidade Luz. Hotel luxuoso com vista privilegiada da Torre Eiffel e experiências exclusivas.',
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
    description: 'Experiência all-inclusive completa no Caribe mexicano. Resort de luxo com praia privativa e entretenimento 24 horas.',
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
  {
    id: 4,
    title: 'Aventura em Dubai',
    hotelName: 'Burj Al Arab Jumeirah',
    price: 'R$ 6.800',
    originalPrice: 'R$ 8.500',
    duration: '6 dias / 5 noites',
    image: PraiaImg, // Usar temporariamente, depois pode trocar
    rating: 4.9,
    reviewCount: 1203,
    location: 'Dubai, Emirados Árabes',
    discount: 20,
    description: 'Luxo incomparável no hotel mais icônico de Dubai. Experiência única com vistas deslumbrantes e serviços exclusivos.',
    amenities: [
      { name: 'WiFi Grátis', icon: 'wifi' },
      { name: 'Concierge', icon: 'concierge' },
      { name: 'Piscina', icon: 'pool' },
      { name: 'Spa', icon: 'spa' },
      { name: 'Restaurante', icon: 'restaurant' },
      { name: 'Transfer', icon: 'car' }
    ],
    highlights: ['Butler pessoal', 'Vista panorâmica', 'Experiências VIP']
  },
  {
    id: 5,
    title: 'Relax em Maldivas',
    hotelName: 'Conrad Maldives Rangali',
    price: 'R$ 8.900',
    originalPrice: 'R$ 12.000',
    duration: '8 dias / 7 noites',
    image: CancunImg, // Usar temporariamente
    rating: 4.8,
    reviewCount: 654,
    location: 'Maldivas',
    discount: 26,
    description: 'Paraíso tropical exclusivo com overwater villas e experiências subaquáticas únicas. O destino dos sonhos para lua de mel.',
    amenities: [
      { name: 'WiFi Grátis', icon: 'wifi' },
      { name: 'Praia Privada', icon: 'beach' },
      { name: 'Spa', icon: 'spa' },
      { name: 'Restaurante', icon: 'restaurant' },
      { name: 'Esportes', icon: 'sports' },
      { name: 'Transfer', icon: 'car' }
    ],
    highlights: ['Villa sobre a água', 'Mergulho incluído', 'Restaurante subaquático']
  },
  {
    id: 6,
    title: 'Descobrindo o Japão',
    hotelName: 'Park Hyatt Tokyo',
    price: 'R$ 5.400',
    originalPrice: 'R$ 6.800',
    duration: '10 dias / 9 noites',
    image: Paris2Img, // Usar temporariamente
    rating: 4.7,
    reviewCount: 876,
    location: 'Tóquio, Japão',
    discount: 21,
    description: 'Mergulhe na cultura japonesa com hospedagem premium no coração de Tóquio. Experiência completa entre tradição e modernidade.',
    amenities: [
      { name: 'WiFi Grátis', icon: 'wifi' },
      { name: 'Concierge', icon: 'concierge' },
      { name: 'Spa', icon: 'spa' },
      { name: 'Restaurante', icon: 'restaurant' },
      { name: 'Academia', icon: 'gym' },
      { name: 'Bar', icon: 'bar' }
    ],
    highlights: ['Tour cultural incluso', 'Aulas de culinária', 'Cerimônia do chá']
  },
  {
    id: 7,
    title: 'Pacote Romântico Gramado',
    hotelName: 'Hotel Casa da Montanha',
    price: 'R$ 1.800',
    originalPrice: 'R$ 2.300',
    duration: '4 dias / 3 noites',
    image: PraiaImg, // Usar temporariamente
    rating: 4.6,
    reviewCount: 234,
    location: 'Gramado, RS',
    discount: 22,
    description: 'Escapada romântica na charmosa Gramado. Hotel aconchegante com vista para as montanhas e experiência gastronômica única.',
    amenities: [
      { name: 'WiFi Grátis', icon: 'wifi' },
      { name: 'Ar Condicionado', icon: 'ac' },
      { name: 'Restaurante', icon: 'restaurant' },
      { name: 'Spa', icon: 'spa' },
      { name: 'Transfer', icon: 'car' },
      { name: 'Bar', icon: 'bar' }
    ],
    highlights: ['City tour incluso', 'Jantar romântico', 'Chocolate tour']
  },
  {
    id: 8,
    title: 'Rio de Janeiro Maravilhoso',
    hotelName: 'Copacabana Palace',
    price: 'R$ 3.500',
    originalPrice: 'R$ 4.200',
    duration: '5 dias / 4 noites',
    image: CancunImg, // Usar temporariamente
    rating: 4.8,
    reviewCount: 567,
    location: 'Rio de janeiro, RJ',
    discount: 17,
    description: 'Viva a experiência carioca completa no icônico Copacabana Palace. Localização privilegiada de frente para a praia de Copacabana.',
    amenities: [
      { name: 'WiFi Grátis', icon: 'wifi' },
      { name: 'Piscina', icon: 'pool' },
      { name: 'Ar Condicionado', icon: 'ac' },
      { name: 'Restaurante', icon: 'restaurant' },
      { name: 'Spa', icon: 'spa' },
      { name: 'Academia', icon: 'gym' }
    ],
    highlights: ['Café da manhã incluso', 'Vista para o mar', 'Piscina na cobertura']
  }
];

// Lista de todas as comodidades disponíveis
export const allAmenities: Amenity[] = [
  { name: 'WiFi Grátis', icon: 'wifi' },
  { name: 'Piscina', icon: 'pool' },
  { name: 'Ar Condicionado', icon: 'ac' },
  { name: 'Restaurante', icon: 'restaurant' },
  { name: 'Spa', icon: 'spa' },
  { name: 'Academia', icon: 'gym' },
  { name: 'Concierge', icon: 'concierge' },
  { name: 'Room Service', icon: 'room-service' },
  { name: 'Bar', icon: 'bar' },
  { name: 'Transfer', icon: 'car' },
  { name: 'All Inclusive', icon: 'all-inclusive' },
  { name: 'Praia Privada', icon: 'beach' },
  { name: 'Esportes', icon: 'sports' },
  { name: 'Shows', icon: 'entertainment' }
];

// Lista de destinos disponíveis (extraída dinamicamente dos pacotes)
export const allLocations: string[] = [
  'Bahia, Brasil',
  'Paris, França',
  'Cancún, México',
  'Dubai, Emirados Árabes',
  'Maldivas',
  'Tóquio, Japão',
  'Gramado, RS',
  'Rio de janeiro, RJ'
];
