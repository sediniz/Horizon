import { apiRequest } from './config';

// Interface para Avaliação
export interface AvaliacaoAPI {
  idAvaliacao: number;
  nota: number;
  comentario: string;
  dataAvaliacao: string;
  idUsuario: number;
  hotelId: number;
}

// Interface para Quarto
export interface QuartoAPI {
  quartoId: number;
  descricao: string;
  ambienteClimatizado: boolean;
  tv: boolean;
  varanda: boolean;
  frigobar: boolean;
  disponibilidade: boolean;
  valorDoQuarto: number;
}

// Interface que corresponde ao modelo Hotel do backend
export interface HotelAPI {
  hotelId: number;
  quantidadeDeQuartos: number;
  nome: string;
  localizacao: string;
  descricao: string;
  estacionamento: boolean;
  petFriendly: boolean;
  piscina: boolean;
  wifi: boolean;
  datasDisponiveis: string;
  valorDiaria: number;
  imagens: string;
  avaliacoes?: AvaliacaoAPI[]; // Array de avaliações do hotel
  quartoId?: number;
  quarto?: QuartoAPI; // Informações do quarto
}

// Função para buscar todos os hotéis
export const getAllHoteis = async (): Promise<HotelAPI[]> => {
  try {
    const response = await apiRequest('/hoteis');
    console.log(' Hotéis recebidos da API:', response);
    return response;
  } catch (error) {
    console.error('Erro ao buscar hotéis:', error);
    throw new Error('Falha ao carregar hotéis');
  }
};

// Função para buscar hotel por ID
export const getHotelById = async (id: number): Promise<HotelAPI> => {
  try {
    const response = await apiRequest(`/hoteis/${id}`);
    console.log(` Hotel ${id} recebido:`, response);
    console.log(` Avaliações do hotel ${response.nome}:`, {
      temAvaliacoes: !!response.avaliacoes,
      quantidadeAvaliacoes: response.avaliacoes?.length || 0,
      avaliacoes: response.avaliacoes || 'Nenhuma avaliação'
    });
    return response;
  } catch (error) {
    console.error(`Erro ao buscar hotel ${id}:`, error);
    throw new Error('Falha ao carregar hotel');
  }
};

// Função para buscar múltiplos hotéis por IDs
export const getHoteisByIds = async (hotelIds: number[]): Promise<HotelAPI[]> => {
  try {
    // Fazer requisições paralelas para todos os hotéis
    const hotelPromises = hotelIds.map(id => getHotelById(id));
    const hoteis = await Promise.all(hotelPromises);
    
    console.log('🏨 Múltiplos hotéis carregados:', hoteis.length);
    return hoteis;
  } catch (error) {
    console.error('Erro ao buscar múltiplos hotéis:', error);
    throw new Error('Falha ao carregar hotéis');
  }
};

// Função para criar um novo hotel (admin)
export const createHotel = async (hotel: Omit<HotelAPI, 'hotelId'>): Promise<HotelAPI> => {
  try {
    const response = await apiRequest('/hoteis', {
      method: 'POST',
      data: hotel,
    });
    console.log('🏨 Hotel criado:', response);
    return response;
  } catch (error) {
    console.error('Erro ao criar hotel:', error);
    throw new Error('Falha ao criar hotel');
  }
};

// Função para atualizar um hotel (admin)
export const updateHotel = async (id: number, hotel: Partial<HotelAPI>): Promise<HotelAPI> => {
  try {
    const response = await apiRequest(`/hoteis/${id}`, {
      method: 'PUT',
      data: hotel,
    });
    console.log(`🏨 Hotel ${id} atualizado:`, response);
    return response;
  } catch (error) {
    console.error(`Erro ao atualizar hotel ${id}:`, error);
    throw new Error('Falha ao atualizar hotel');
  }
};

// Função para deletar um hotel (admin)
export const deleteHotel = async (id: number): Promise<void> => {
  try {
    await apiRequest(`/hoteis/${id}`, {
      method: 'DELETE',
    });
    console.log(`🏨 Hotel ${id} deletado`);
  } catch (error) {
    console.error(`Erro ao deletar hotel ${id}:`, error);
    throw new Error('Falha ao deletar hotel');
  }
};
