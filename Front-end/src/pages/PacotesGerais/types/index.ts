// Definindo o tipo das comodidades
export type Amenity = {
  name: string;
  icon: string;
};

// Definindo o tipo do pacote completo
export type PackageProps = {
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
  highlights: string[];
  discount?: number;
  description: string;
};

// Tipo para filtros
export type FilterState = {
  selectedLocation: string;
  selectedAmenities: string[];
};
