import axios from 'axios';
import { apiRequest } from './config';
// Tipos para as reservas
export interface Reserva {
  id: number; // ou reservaId dependendo do backend
  codigo: string;
  destino: string;
  hotel: string;
  dataViagem: string; // ou dataInicio/dataFim
  dataReserva: string; // ou dataCriacao
  status: 'confirmada' | 'pendente' | 'concluida' | 'cancelada';
  valor: number; // ou valorTotal
  pessoas: number; // ou quantidadePessoas
  imagem?: string; // opcional, pode vir do hotel/pacote
  voo?: string; // opcional, pode não existir no backend
  avaliacao?: number; // opcional, pode vir de tabela separada
  estrelas?: number; // opcional, pode vir do hotel
  userId?: number;
  pacoteId?: number;
  hotelId?: number; // campo que provavelmente existe no backend
  observacoes?: string;
  // Campos que podem existir no backend:
  dataInicio?: string;
  dataFim?: string;
  dataCriacao?: string;
  valorTotal?: number;
  quantidadePessoas?: number;
}
export interface NovaReserva {
  pacoteId: number;
  userId: number;
  pessoas: number;
  dataViagem: string;
  observacoes?: string;
}
export interface CancelamentoReserva {
  reservaId: number;
  nome: string;
  data: string;
  motivo: string;
  motivoPersonalizado?: string;
}
export interface AvaliacaoReserva {
  reservaId: number;
  geral: number;
  limpeza: number;
  localizacao: number;
  servico: number;
  custoBeneficio: number;
  comentario?: string;
}
// API Functions para reservas
export const reservasApi = {
  // Buscar todas as reservas do usuário
  async buscarReservas(userId?: number): Promise<Reserva[]> {
    try {
      const response = await apiRequest(`/reservas${userId ? `?userId=${userId}` : ''}`, {
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
      throw new Error('Não foi possível carregar as reservas');
    }
  },
  // Buscar uma reserva específica
  async buscarReservaPorId(id: number): Promise<Reserva> {
    try {
      const response = await apiRequest(`/reservas/${id}`, {
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error('Erro ao buscar reserva:', error);
      throw new Error('Reserva não encontrada');
    }
  },
  // Criar nova reserva
  async criarReserva(dadosReserva: NovaReserva): Promise<Reserva> {
    try {
      const response = await apiRequest('/reservas', {
        method: 'POST',
        data: dadosReserva
      });
      return response;
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        throw new Error('Dados inválidos para a reserva');
      }
      throw new Error('Não foi possível criar a reserva');
    }
  },
  // Atualizar status da reserva
  async atualizarStatusReserva(id: number, status: Reserva['status']): Promise<Reserva> {
    try {
      const response = await apiRequest(`/reservas/${id}/status`, {
        method: 'PATCH',
        data: { status }
      });
      return response;
    } catch (error) {
      console.error('Erro ao atualizar status da reserva:', error);
      throw new Error('Não foi possível atualizar o status da reserva');
    }
  },
  // Cancelar reserva
  async cancelarReserva(dadosCancelamento: CancelamentoReserva): Promise<void> {
    try {
      await apiRequest(`/reservas/${dadosCancelamento.reservaId}/cancelar`, {
        method: 'POST',
        data: {
          nome: dadosCancelamento.nome,
          data: dadosCancelamento.data,
          motivo: dadosCancelamento.motivo,
          motivoPersonalizado: dadosCancelamento.motivoPersonalizado
        }
      });
    } catch (error) {
      console.error('Erro ao cancelar reserva:', error);
      throw new Error('Não foi possível cancelar a reserva');
    }
  },
  // Avaliar reserva
  async avaliarReserva(avaliacao: AvaliacaoReserva): Promise<void> {
    try {
      await apiRequest(`/reservas/${avaliacao.reservaId}/avaliar`, {
        method: 'POST',
        data: {
          geral: avaliacao.geral,
          limpeza: avaliacao.limpeza,
          localizacao: avaliacao.localizacao,
          servico: avaliacao.servico,
          custoBeneficio: avaliacao.custoBeneficio,
          comentario: avaliacao.comentario
        }
      });
    } catch (error) {
      console.error('Erro ao avaliar reserva:', error);
      throw new Error('Não foi possível enviar a avaliação');
    }
  },
  // Buscar reservas com filtros
  async buscarReservasComFiltros(filtros: {
    userId?: number;
    status?: string;
    dataInicio?: string;
    dataFim?: string;
  }): Promise<Reserva[]> {
    try {
      const params = new URLSearchParams();
      
      if (filtros.userId) params.append('userId', filtros.userId.toString());
      if (filtros.status && filtros.status !== 'todas') params.append('status', filtros.status);
      if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio);
      if (filtros.dataFim) params.append('dataFim', filtros.dataFim);
      const response = await apiRequest(`/reservas?${params.toString()}`, {
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error('Erro ao buscar reservas com filtros:', error);
      throw new Error('Não foi possível filtrar as reservas');
    }
  },
  // Reenviar confirmação de reserva
  async reenviarConfirmacao(reservaId: number): Promise<void> {
    try {
      await apiRequest(`/reservas/${reservaId}/reenviar-confirmacao`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Erro ao reenviar confirmação:', error);
      throw new Error('Não foi possível reenviar a confirmação');
    }
  },
  // Confirmar status da reserva
  async confirmarStatus(reservaId: number): Promise<void> {
    try {
      await apiRequest(`/reservas/${reservaId}/confirmar-status`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Erro ao confirmar status:', error);
      throw new Error('Não foi possível confirmar o status da reserva');
    }
  },
  // Baixar voucher da reserva
  async baixarVoucher(reservaId: number): Promise<Blob> {
    try {
      const response = await apiRequest(`/reservas/${reservaId}/voucher`, {
        method: 'GET',
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      console.error('Erro ao baixar voucher:', error);
      throw new Error('Não foi possível baixar o voucher');
    }
  }
};
// Export default para facilitar o uso
export default reservasApi;
