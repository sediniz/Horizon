import type { PacoteAPI } from '../api/pacotes';
import type { PackageProps } from '../pages/PacotesGerais/types';

// Imagens padrão para os pacotes (podem ser expandidas conforme necessário)
const defaultImages = [
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
];

// Comodidades padrão baseadas no tipo de destino
const getDefaultAmenities = (destino: string) => {
  const destinoLower = destino.toLowerCase();
  
  const baseAmenities = [
    { name: "Wi-Fi Gratuito", icon: "wifi" },
    { name: "Café da Manhã", icon: "coffee" },
    { name: "Estacionamento", icon: "car" },
    { name: "Ar Condicionado", icon: "snowflake" },
  ];
  
  // Adicionar comodidades específicas baseadas no destino
  if (destinoLower.includes('praia') || destinoLower.includes('beach') || destinoLower.includes('costa')) {
    baseAmenities.push({ name: "Piscina", icon: "swimming-pool" });
    baseAmenities.push({ name: "Vista para o Mar", icon: "waves" });
  }
  
  if (destinoLower.includes('montanha') || destinoLower.includes('mountain')) {
    baseAmenities.push({ name: "Spa", icon: "spa" });
    baseAmenities.push({ name: "Trilhas", icon: "hiking" });
  }
  
  if (destinoLower.includes('cidade') || destinoLower.includes('city') || destinoLower.includes('urbano')) {
    baseAmenities.push({ name: "Academia", icon: "dumbbell" });
    baseAmenities.push({ name: "Centro de Negócios", icon: "briefcase" });
  }
  
  return baseAmenities;
};

// Destaques padrão baseados na duração e tipo
const getDefaultHighlights = (duracao: number, destino: string) => {
  const highlights = [];
  
  if (duracao >= 7) {
    highlights.push("Pacote Completo");
  }
  
  if (duracao <= 3) {
    highlights.push("Fim de Semana Perfeito");
  }
  
  highlights.push("Cancelamento Grátis");
  highlights.push("Suporte 24h");
  
  if (destino.toLowerCase().includes('internacional') || 
      destino.toLowerCase().includes('europa') || 
      destino.toLowerCase().includes('asia') ||
      destino.toLowerCase().includes('america')) {
    highlights.push("Visto Incluído");
  }
  
  return highlights;
};

// Função para gerar rating baseado no preço e destino
const generateRating = (valorTotal: number, destino: string): number => {
  // Rating base entre 3.5 e 5.0
  let rating = 3.5;
  
  // Aumentar rating para destinos mais caros (assumindo maior qualidade)
  if (valorTotal > 5000) rating += 0.8;
  else if (valorTotal > 3000) rating += 0.5;
  else if (valorTotal > 1500) rating += 0.3;
  
  // Adicionar variação baseada no destino
  if (destino.toLowerCase().includes('luxury') || destino.toLowerCase().includes('resort')) {
    rating += 0.4;
  }
  
  // Garantir que não passe de 5.0
  return Math.min(rating, 5.0);
};

// Função para formatar duração no padrão hoteleiro (dias/noites)
const formatDuration = (duracao: number): string => {
  if (duracao === 1) {
    return '1 dia'; // Caso especial: apenas 1 dia (sem pernoite)
  }
  
  const noites = duracao - 1; // Uma noite a menos que os dias
  
  if (noites === 1) {
    return `${duracao} dias / 1 noite`;
  }
  
  return `${duracao} dias / ${noites} noites`;
};

// Função principal para converter PacoteAPI para PackageProps
export const convertAPIToPackage = (pacoteAPI: PacoteAPI, index: number = 0): PackageProps => {
  const rating = generateRating(pacoteAPI.valorTotal, pacoteAPI.destino);
  const amenities = getDefaultAmenities(pacoteAPI.destino);
  const highlights = getDefaultHighlights(pacoteAPI.duracao, pacoteAPI.destino);
  
  // Determinar se há desconto (removido - será implementado no backend)
  const discount = undefined;
  const originalPrice = undefined;
  
  return {
    id: pacoteAPI.pacoteId,
    title: pacoteAPI.titulo,
    hotelName: `Hotel ${pacoteAPI.destino.split(' ')[0]} Premium`, // Nome de hotel simulado
    price: `R$ ${pacoteAPI.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    originalPrice,
    duration: formatDuration(pacoteAPI.duracao),
    image: defaultImages[index % defaultImages.length],
    rating: Math.round(rating * 10) / 10, // Arredondar para 1 casa decimal
    reviewCount: Math.floor(Math.random() * 500) + 50, // Reviews simuladas
    location: pacoteAPI.destino,
    amenities,
    highlights,
    discount,
    description: pacoteAPI.descricao || `Experimente o melhor de ${pacoteAPI.destino} em uma viagem inesquecível. Nosso pacote inclui acomodações de qualidade e experiências únicas.`,
  };
};

// Função para converter múltiplos pacotes
export const convertAPIPackagesToPackages = (pacotesAPI: PacoteAPI[]): PackageProps[] => {
  return pacotesAPI.map((pacote, index) => convertAPIToPackage(pacote, index));
};

// Função para mapear filtros do frontend para filtros da API
export const mapFiltersToAPIFilters = (selectedLocation: string, _selectedAmenities: string[]) => {
  return {
    destino: selectedLocation || undefined,
    // Por enquanto, comodidades não afetam o filtro da API
    // pois elas são geradas no frontend
  };
};
