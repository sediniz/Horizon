import { apiRequest } from './config';

// Tipos para as interfaces de pagamento
export interface DadosPagamento {
  data: string;
  quantidadePessoas: number;
  desconto?: string;
  formaPagamento: 'PIX' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Boleto';
  pacoteId: number;
  usuarioId: string;
}

export interface RespostaPagamento {
  id: string;
  status: 'pendente' | 'aprovado' | 'recusado';
  valor: number;
  codigoPagamento?: string;
  linkPagamento?: string;
  message: string;
}

export interface DadosPacote {
  pacoteId: number;
  titulo: string;
  descricao: string;
  destino: string;
  duracao: number;
  quantidadeDePessoas: number;
  valorTotal: number;
}

// processar o pagamento preciso pegar o stripe
export const processarPagamento = async (dadosPagamento: DadosPagamento): Promise<RespostaPagamento> => {
  try {
    const response = await apiRequest('/pagamento/processar', {
      method: 'POST',
      data: dadosPagamento,
    });
    return response;
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    throw new Error('Falha ao processar pagamento. Tente novamente.');
  }
};

// Função para buscar dados do pacote
export const buscarDadosPacote = async (pacoteId: number): Promise<DadosPacote> => {
  try {
    const response = await apiRequest(`/pacotes/${pacoteId}`, {
      method: 'GET',
    });
    
    return response;
  } catch (error) {
    console.error('Erro ao buscar dados do pacote:', error);
    throw new Error('Falha ao carregar dados do pacote.');
  }
};

// desconto
export const aplicarDesconto = async (codigoDesconto: string, pacoteId: number): Promise<{ desconto: number; valorFinal: number }> => {
  try {
    const response = await apiRequest('/desconto/aplicar', {
      method: 'POST',
      data: { codigoDesconto, pacoteId },
    });
    return response;
  } catch (error) {
    console.error('Erro ao aplicar desconto:', error);
    throw new Error('Código de desconto inválido.');
  }
};


