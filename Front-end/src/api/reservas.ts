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
  descricao?: string; // descrição detalhada do pacote
  inclui?: string[]; // o que está incluído no pacote
  naoInclui?: string[]; // o que não está incluído no pacote
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
      
      // Mapeando dados do backend para o formato esperado pelo frontend
      console.log('Todas as reservas recebidas:', JSON.stringify(response, null, 2));
      
      return response.map((reserva: any) => {
        console.log('Processando reserva ID:', reserva.reservaId);
        console.log('Dados completos da reserva:', JSON.stringify(reserva, null, 2));
        
        // Determinar os dados do hotel - seja diretamente ou via pacote
        const hotelInfo = reserva.hotel || (reserva.pacote?.hotel);
        const destino = reserva.hotel?.localizacao || reserva.pacote?.destino;
        const hotelNome = reserva.hotel?.nome || (reserva.pacote?.hotel?.nome);
        
        // Verificar dados do pacote para detalhes
        console.log('Dados do pacote:', {
          pacote: reserva.pacote,
          descricao: reserva.pacote?.descricao || reserva.descricao,
          inclui: reserva.pacote?.inclui || reserva.inclui,
          observacoes: reserva.observacoes
        });
        
        // Verificar imagens disponíveis e logar detalhadamente
        const hotelImagens = reserva.hotel?.imagens;
        const hotelImagem = reserva.hotel?.imagem;
        const pacoteHotelImagens = reserva.pacote?.hotel?.imagens;
        const pacoteHotelImagem = reserva.pacote?.hotel?.imagem;
        
        console.log('Dados de imagens:', { 
          hotelImagens, 
          hotelImagem, 
          pacoteHotelImagens, 
          pacoteHotelImagem,
          hotelId: reserva.hotel?.hotelId,
          pacoteHotelId: reserva.pacote?.hotel?.hotelId
        });
        
        return {
          id: reserva.reservaId,
          codigo: `HZ${new Date().getFullYear()}${reserva.reservaId.toString().padStart(3, '0')}`,
          destino: destino || 'Destino não especificado',
          hotel: hotelNome || 'Hotel não especificado',
          dataViagem: `${new Date(reserva.dataInicio).toLocaleDateString('pt-BR')} - ${new Date(reserva.dataFim).toLocaleDateString('pt-BR')}`,
          dataReserva: new Date(reserva.dataReserva).toLocaleDateString('pt-BR'),
          status: reserva.status === 0 ? 'pendente' : reserva.status === 1 ? 'confirmada' : 'cancelada',
          valor: reserva.valorTotal,
          pessoas: reserva.quantidadePessoas,
          // Escolher a primeira imagem disponível no formato correto
          imagem: (() => {
            // Tentar encontrar imagens em todos os lugares possíveis
            const possibleImages = [
              reserva.hotel?.imagens,
              reserva.hotel?.imagem,
              reserva.pacote?.hotel?.imagens,
              reserva.pacote?.hotel?.imagem,
              reserva.pacote?.imagem,
              reserva.imagem
            ].filter(Boolean);
            
            // Retornar a primeira imagem válida ou uma imagem padrão
            return possibleImages.length > 0 
              ? possibleImages[0] 
              : 'https://cdn.pixabay.com/photo/2016/10/18/09/02/hotel-1749602_1280.jpg';
          })(),
          voo: reserva.pacote?.incluiVoo ? `${reserva.pacote?.origemVoo || 'GRU'} → ${reserva.pacote?.destinoVoo || 'Destino'}` : 'Não incluído',
          avaliacao: hotelInfo?.avaliacaoMedia || 0,
          estrelas: hotelInfo?.categoria || 0,
          userId: reserva.usuarioId,
          pacoteId: reserva.pacoteId,
          hotelId: reserva.hotelId,
          observacoes: reserva.observacoes,
          // Adicionar campos que estão faltando para o modal de detalhes
          descricao: reserva.pacote?.descricao || reserva.descricao || hotelInfo?.descricao || 'Pacote de viagem completo com hospedagem e serviços incluídos.',
          inclui: reserva.pacote?.inclui || reserva.inclui || [
            'Hospedagem',
            'Transfer aeroporto-hotel-aeroporto',
            'Café da manhã',
            'Suporte 24h'
          ],
          naoInclui: reserva.pacote?.naoInclui || reserva.naoInclui || [
            'Passagens aéreas',
            'Refeições (exceto café da manhã)',
            'Gastos pessoais'
          ],
          dataInicio: reserva.dataInicio,
          dataFim: reserva.dataFim,
          dataCriacao: reserva.dataReserva,
          valorTotal: reserva.valorTotal,
          quantidadePessoas: reserva.quantidadePessoas
        };
      });
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
      
      // Verificar se é erro de conectividade com SQL Server
      if (axios.isAxiosError(error) && error.response?.status === 500) {
        const errorMessage = error.response?.data?.message || '';
        if (errorMessage.includes('SqlException') || errorMessage.includes('SQL Server')) {
          throw new Error('Banco de dados temporariamente indisponível. Exibindo dados de exemplo.');
        }
      }
      
      throw new Error('Não foi possível carregar as reservas');
    }
  },
  // Buscar uma reserva específica
  async buscarReservaPorId(id: number): Promise<Reserva> {
    try {
      const response = await apiRequest(`/reservas/${id}`, {
        method: 'GET'
      });
      
      console.log('Reserva específica encontrada:', JSON.stringify(response, null, 2));
      
      // Mapeamento similar ao da lista, mas com mais detalhes
      const reserva = response;
      const hotelInfo = reserva.hotel || (reserva.pacote?.hotel);
      const destino = reserva.hotel?.localizacao || reserva.pacote?.destino;
      const hotelNome = reserva.hotel?.nome || (reserva.pacote?.hotel?.nome);
      
      return {
        id: reserva.reservaId,
        codigo: `HZ${new Date().getFullYear()}${reserva.reservaId.toString().padStart(3, '0')}`,
        destino: destino || 'Destino não especificado',
        hotel: hotelNome || 'Hotel não especificado',
        dataViagem: `${new Date(reserva.dataInicio).toLocaleDateString('pt-BR')} - ${new Date(reserva.dataFim).toLocaleDateString('pt-BR')}`,
        dataReserva: new Date(reserva.dataReserva).toLocaleDateString('pt-BR'),
        status: reserva.status === 0 ? 'pendente' : reserva.status === 1 ? 'confirmada' : 'cancelada',
        valor: reserva.valorTotal,
        pessoas: reserva.quantidadePessoas,
        imagem: reserva.hotel?.imagem || reserva.pacote?.hotel?.imagem || reserva.pacote?.imagem || 'https://cdn.pixabay.com/photo/2016/10/18/09/02/hotel-1749602_1280.jpg',
        voo: reserva.pacote?.incluiVoo ? `${reserva.pacote?.origemVoo || 'GRU'} → ${reserva.pacote?.destinoVoo || 'Destino'}` : 'Não incluído',
        avaliacao: hotelInfo?.avaliacaoMedia || 0,
        estrelas: hotelInfo?.categoria || 0,
        userId: reserva.usuarioId,
        pacoteId: reserva.pacoteId,
        hotelId: reserva.hotelId,
        observacoes: reserva.observacoes,
        descricao: reserva.pacote?.descricao || reserva.descricao || hotelInfo?.descricao || 'Pacote de viagem completo com hospedagem e serviços incluídos.',
        inclui: reserva.pacote?.inclui || reserva.inclui || [
          'Hospedagem',
          'Transfer aeroporto-hotel-aeroporto', 
          'Café da manhã',
          'Suporte 24h'
        ],
        naoInclui: reserva.pacote?.naoInclui || reserva.naoInclui || [
          'Passagens aéreas',
          'Refeições (exceto café da manhã)',
          'Gastos pessoais'
        ],
        dataInicio: reserva.dataInicio,
        dataFim: reserva.dataFim,
        dataCriacao: reserva.dataReserva,
        valorTotal: reserva.valorTotal,
        quantidadePessoas: reserva.quantidadePessoas
      };
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
      const response = await apiRequest(`/reservas/atualizarStatus/${id}`, {
        method: 'PUT',
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
