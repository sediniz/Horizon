// Utilitários para busca e normalização de destinos

/**
 * Extrai o nome da cidade de uma string de destino completa
 * Exemplo: "São Paulo, SP" -> "São Paulo"
 */
export const extractCityName = (destination: string): string => {
  return destination.split(',')[0].trim();
};

/**
 * Normaliza texto para busca (remove acentos, converte para minúsculas)
 */
export const normalizeForSearch = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .trim();
};

/**
 * Verifica se um destino corresponde ao termo de busca
 */
export const matchesDestination = (destination: string, searchTerm: string): boolean => {
  const normalizedDestination = normalizeForSearch(destination);
  const normalizedSearch = normalizeForSearch(searchTerm);
  
  // Busca tanto no nome completo quanto apenas na cidade
  const cityName = normalizeForSearch(extractCityName(destination));
  
  return normalizedDestination.includes(normalizedSearch) || 
         cityName.includes(normalizedSearch);
};

/**
 * Mapeia destinos do frontend para formato de busca no backend
 */
export const mapDestinationForAPI = (frontendDestination: string): string => {
  // Para a API, enviamos apenas o nome da cidade
  return extractCityName(frontendDestination);
};

/**
 * Lista de cidades principais para facilitar a criação de pacotes
 */
export const mainCities = [
  'São Paulo',
  'Rio de Janeiro', 
  'Salvador',
  'Brasília',
  'Fortaleza',
  'Belo Horizonte',
  'Manaus',
  'Curitiba',
  'Recife',
  'Porto Alegre',
  'Gramado',
  'Búzios',
  'Paris',
  'Londres',
  'Nova York',
  'Miami',
  'Madrid',
  'Roma',
  'Tóquio',
  'Dubai',
  'Cancún',
  'Buenos Aires'
];
