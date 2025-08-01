const API_BASE_URL = 'https://localhost:7202/api';

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

// Interface da avaliação com dados completos (como vem da API)
export interface Avaliacao {
  IdAvaliacao: number;
  Nota: number;
  Comentario: string;
  DataAvaliacao: string;
  IdUsuario: number;
  hotelId: number;
  // Dados do usuário e hotel (vem com Include)
  Usuario?: {
    UsuarioId: number;
    Nome: string;
    Email: string;
    Telefone: string;
    CpfPassaporte: string;
    TipoUsuario: string;
  };
  Hotel?: {
    HotelId: number;
    QuantidadeDeQuartos: number;
    Nome: string;
    Localizacao: string;
    Descricao: string;
    Estacionamento: boolean;
    PetFriendly: boolean;
    Piscina: boolean;
    Wifi: boolean;
    CafeDaManha: boolean;
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
  };
}

// Service apenas para comunicação HTTP
export const avaliacaoService = {
  // Buscar todas as avaliações (com Include de usuário e hotel)
  async getAll(): Promise<Avaliacao[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/avaliacoes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar avaliações: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
      throw error;
    }
  },

  // Buscar avaliação por ID
  async getById(id: number): Promise<Avaliacao> {
    try {
      const response = await fetch(`${API_BASE_URL}/avaliacoes/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar avaliação: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar avaliação:', error);
      throw error;
    }
  },

  // Criar nova avaliação (usando DTO simples)
  async create(dto: CriarAvaliacaoDto): Promise<Avaliacao> {
    try {
      const response = await fetch(`${API_BASE_URL}/avaliacoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      });

      if (!response.ok) {
        throw new Error(`Erro ao criar avaliação: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
      throw error;
    }
  },

  // Atualizar avaliação (usando DTO simples)
  async update(dto: AtualizarAvaliacaoDto): Promise<Avaliacao> {
    try {
      const response = await fetch(`${API_BASE_URL}/avaliacoes/${dto.idAvaliacao}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      });

      if (!response.ok) {
        throw new Error(`Erro ao atualizar avaliação: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao atualizar avaliação:', error);
      throw error;
    }
  }
};
