// Tipos específicos para o painel administrativo
export interface HotelFormData {
  nome: string;
  localizacao: string;
  descricao: string;
  quantidadeDeQuartos: number | string; // Permite string vazia durante edição
  estacionamento: boolean;
  petFriendly: boolean;
  piscina: boolean;
  wifi: boolean;
  cafeDaManha: boolean;
  almoco: boolean;
  jantar: boolean;
  allInclusive: boolean;
  valorDiaria: number | string; // Permite string vazia durante edição
  imagens: string;
  datasDisponiveis: string;
  quartoId?: number;
}

export interface PacoteFormData {
  titulo: string;
  descricao: string;
  destino: string;
  duracao: number | string; // Permite string vazia durante edição
  quantidadeDePessoas: number | string; // Permite string vazia durante edição
  valorTotal: number | string; // Permite string vazia durante edição
  hotelId: number | string; // Permite string vazia durante edição
}

export interface AdminTab {
  id: 'hoteis' | 'pacotes';
  label: string;
  component: React.ComponentType;
}
