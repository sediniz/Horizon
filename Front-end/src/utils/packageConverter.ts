import type { PacoteAPI } from '../api/pacotes';
import type { HotelAPI } from '../api/hoteis';
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

// Função para converter comodidades do hotel (booleanos) para formato frontend
const getHotelAmenities = (hotel?: HotelAPI) => {
  const amenities = [];
  
  if (!hotel) {
    // Se não tem hotel, usar comodidades padrão baseadas no destino
    return [];
  }
  
  console.log(`🏨 Processando comodidades para hotel ${hotel.nome}:`, {
    wifi: hotel.wifi,
    estacionamento: hotel.estacionamento,
    piscina: hotel.piscina,
    petFriendly: hotel.petFriendly,
    cafeDaManha: hotel.cafeDaManha,
    almoco: hotel.almoco,
    jantar: hotel.jantar,
    allInclusive: hotel.allInclusive
  });
  
  // Converter booleanos do hotel para objetos com ícone
  if (hotel.wifi) {
    amenities.push({ name: "Wi-Fi Gratuito", icon: "wifi" });
  }
  
  if (hotel.estacionamento) {
    amenities.push({ name: "Estacionamento", icon: "car" });
  }
  
  if (hotel.piscina) {
    amenities.push({ name: "Piscina", icon: "swimming-pool" });
  }
  
  if (hotel.petFriendly) {
    amenities.push({ name: "Pet Friendly", icon: "heart" });
  }
  
  if (hotel.cafeDaManha) {
    amenities.push({ name: "Café da Manhã", icon: "coffee" });
  }
  
  if (hotel.almoco) {
    amenities.push({ name: "Almoço", icon: "utensils" });
  }
  
  if (hotel.jantar) {
    amenities.push({ name: "Jantar", icon: "utensils" });
  }
  
  if (hotel.allInclusive) {
    amenities.push({ name: "All Inclusive", icon: "star" });
  }
  
  console.log(`✅ Comodidades convertidas para ${hotel.nome}:`, amenities);
  
  return amenities;
};

// Comodidades padrão baseadas no tipo de destino (fallback)
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

// Função para calcular rating baseado nas avaliações reais do hotel
const calculateRating = (hotel?: HotelAPI): number => {
  console.log('⭐ === CALCULANDO RATING ===');
  console.log('📊 Hotel completo:', hotel);
  
  // Se não tem hotel ou não tem avaliações, usar rating padrão
  if (!hotel) {
    console.log('❌ Hotel não fornecido - usando rating padrão 4.0');
    return 4.0;
  }
  
  console.log(`🏨 Hotel: ${hotel.nome}`);
  console.log(`📝 Campo avaliacoes:`, hotel.avaliacoes);
  console.log(`📊 Tipo do campo avaliacoes:`, typeof hotel.avaliacoes);
  console.log(`📈 É array?`, Array.isArray(hotel.avaliacoes));
  
  if (!hotel.avaliacoes) {
    console.log('❌ Hotel sem campo avaliacoes - usando rating padrão 4.0');
    return 4.0;
  }
  
  if (hotel.avaliacoes.length === 0) {
    console.log('❌ Hotel sem avaliações (array vazio) - usando rating padrão 4.0');
    return 4.0;
  }
  
  console.log(`✅ Hotel com ${hotel.avaliacoes.length} avaliações:`);
  hotel.avaliacoes.forEach((avaliacao, index) => {
    console.log(`   ${index + 1}. Nota: ${avaliacao.nota}, Comentário: "${avaliacao.comentario}"`);
  });
  
  // Calcular média das avaliações
  const somaNotas = hotel.avaliacoes.reduce((soma, avaliacao) => soma + avaliacao.nota, 0);
  const mediaNotas = somaNotas / hotel.avaliacoes.length;
  
  console.log(`� Soma das notas: ${somaNotas}`);
  console.log(`�📊 Média calculada: ${mediaNotas.toFixed(2)}`);
  
  // Garantir que a nota está entre 0 e 5
  const finalRating = Math.max(0, Math.min(5, mediaNotas));
  console.log(`⭐ Rating final: ${finalRating}`);
  console.log('=== FIM CÁLCULO RATING ===\n');
  
  return finalRating;
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
  const rating = calculateRating(pacoteAPI.hotel);
  
  // Usar comodidades do hotel se disponível, senão usar padrão baseado no destino
  const amenities = pacoteAPI.hotel 
    ? getHotelAmenities(pacoteAPI.hotel)
    : getDefaultAmenities(pacoteAPI.destino);
    
  const highlights = getDefaultHighlights(pacoteAPI.duracao, pacoteAPI.destino);
  
  // Determinar se há desconto (removido - será implementado no backend)
  const discount = undefined;
  const originalPrice = undefined;
  
  // Usar nome do hotel real se disponível
  const hotelName = pacoteAPI.hotel?.nome || `Hotel ${pacoteAPI.destino.split(' ')[0]} Premium`;
  
  // Usar imagem do hotel se disponível, senão usar padrão
  const image = pacoteAPI.hotel?.imagens || defaultImages[index % defaultImages.length];
  
  // CALCULAR PREÇO POR PESSOA (diária × dias ÷ pessoas)
  // Usar valorDiaria do hotel se disponível, senão calcular baseado no valorTotal
  const valorDiaria = pacoteAPI.hotel?.valorDiaria || 
                     (pacoteAPI.hotel?.quarto?.valorDoQuarto || 0) + 200 || 
                     (pacoteAPI.valorTotal / pacoteAPI.duracao / pacoteAPI.quantidadeDePessoas);
  
  // Calcular preço por pessoa: diária × número de dias
  const precoPorPessoa = valorDiaria * pacoteAPI.duracao;
  
  return {
    id: pacoteAPI.pacoteId,
    title: pacoteAPI.titulo,
    hotelName,
    price: `R$ ${precoPorPessoa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    originalPrice,
    duration: formatDuration(pacoteAPI.duracao),
    image,
    rating: Math.round(rating * 10) / 10, // Arredondar para 1 casa decimal
    reviewCount: pacoteAPI.hotel?.avaliacoes?.length || 0, // Usar contagem real de avaliações
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
