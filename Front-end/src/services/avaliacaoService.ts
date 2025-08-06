import { apiRequest } from '../api/config';

// Interfaces para requests (DTOs)
export interface CriarAvaliacaoDto {
  nota: number;
  comentario: string;
  idUsuario: number;
  hotelId: number;
}

export interface AtualizarAvaliacaoDto {
  idAvaliacao: number;
  nota: number;
  comentario: string;
}

// Interface da avaliação com dados completos (como vem da API - camelCase)
export interface Avaliacao {
  idAvaliacao: number;
  nota: number;
  comentario: string;
  dataAvaliacao: string;
  idUsuario: number;
  hotelId: number;
  // Dados do usuário e hotel (vem com Include)
  usuario?: {
    usuarioId: number;
    nome: string;
    email: string;
    telefone: string;
    cpfPassaporte: string;
    tipoUsuario: string;
  };
  hotel?: {
    hotelId: number;
    quantidadeDeQuartos: number;
    nome: string;
    localizacao: string;
    descricao: string;
    estacionamento: boolean;
    petFriendly: boolean;
    piscina: boolean;
    wifi: boolean;
    cafeDaManha: boolean;
    almoco: boolean;
    jantar: boolean;
    allInclusive: boolean;
    datasDisponiveis: string;
    valorDiaria: number;
    imagens: string;
    imagem: string;
  };
}

// Interface para o formato usado pelo componente
export interface AvaliacaoFormatada {
  id: number;
  name: string;
  initials: string;
  verified: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  type: string;
  image: string;
  bgColor: string;
  hotel: {
    name: string;
    location: string;
    stars: number;
    amenities: string[];
    category: string;
    description: string;
    dailyRate: number;
    rooms: number;
  };
}

// Service apenas para comunicação HTTP
export const avaliacaoService = {
  // Buscar todas as avaliações (com Include de usuário e hotel)
  async getAll(): Promise<Avaliacao[]> {
    try {
      const response = await apiRequest('/avaliacoes', { method: 'GET' });
      return response;
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
      throw error;
    }
  },

  // Buscar avaliação por ID
  async getById(id: number): Promise<Avaliacao> {
    try {
      const response = await apiRequest(`/avaliacoes/${id}`, { method: 'GET' });
      return response;
    } catch (error) {
      console.error('Erro ao buscar avaliação:', error);
      throw error;
    }
  },

  // Criar nova avaliação (usando DTO simples)
  async create(dto: CriarAvaliacaoDto): Promise<Avaliacao> {
    try {
      const response = await apiRequest('/avaliacoes', { 
        method: 'POST',
        data: dto
      });
      return response;
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
      throw error;
    }
  },

  // Atualizar avaliação (usando DTO simples)
  async update(dto: AtualizarAvaliacaoDto): Promise<Avaliacao> {
    try {
      const response = await apiRequest(`/avaliacoes/${dto.idAvaliacao}`, { 
        method: 'PUT',
        data: dto
      });
      return response;
    } catch (error) {
      console.error('Erro ao atualizar avaliação:', error);
      throw error;
    }
  }
};
