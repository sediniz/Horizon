import { apiRequest } from './config';

// Tipos para as interfaces de pagamento
export interface DadosPagamento {
  data: string;
  quantidadePessoas: number;
  desconto?: string;
  formaPagamento: 'PIX' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Boleto';
  pacoteId: number;
  usuarioId: string;
  paymentMethodId?: string; // ID do método de pagamento do Stripe
}

export interface RespostaPagamento {
  id: string;
  status: 'pendente' | 'aprovado' | 'recusado';
  valor: number;
  codigoPagamento?: string;
  linkPagamento?: string;
  message: string;
  clientSecret?: string; // Necessário para confirmar pagamentos no Stripe
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

// Interface para o payload do PaymentIntent
export interface PaymentIntentRequest {
  valorTotal: number;
  pacoteId?: number;  
  reservaId?: number; 
  tipoPagamento?: string;
}

// Interface para confirmar pagamento
export interface ConfirmarPagamentoRequest {
  paymentIntentId: string;
  usuarioId: number;
  pacoteId?: number;
  dataViagem: string;
  quantidadePessoas: number;
}

// Criar intent de pagamento com Stripe
export const criarIntentPagamento = async (valorTotal: number, pacoteId: number): Promise<{clientSecret: string}> => {
  try {
    // Validação básica dos parâmetros
    if (!valorTotal || valorTotal <= 0) {
      throw new Error('Valor do pagamento deve ser maior que zero');
    }
    
    if (!pacoteId || isNaN(pacoteId)) {
      throw new Error('ID do pacote é obrigatório');
    }

    const payload: PaymentIntentRequest = {
      valorTotal: Math.round(valorTotal * 100) / 100, // Garantir 2 casas decimais
      pacoteId,
      tipoPagamento: "Cartão de Crédito",
    };
    
    console.log('📤 Enviando payload para criar intent:', payload);
    
    const response = await apiRequest('/pagamentos/criar-intent', {
      method: 'POST',
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📥 Resposta recebida do servidor:', response);
    
    // Validação da resposta
    if (!response || !response.clientSecret) {
      throw new Error('Resposta inválida do servidor - client secret não encontrado');
    }
    
    // Validação do formato do client secret
    const clientSecret = response.clientSecret;
    if (typeof clientSecret !== 'string' || 
        !clientSecret.startsWith('pi_') || 
        !clientSecret.includes('_secret_') ||
        clientSecret.length < 50) {
      throw new Error('Client secret com formato inválido recebido do servidor');
    }
    
    console.log('✅ Client secret válido recebido');
    return { clientSecret };
    
  } catch (error: any) {
    console.error('❌ Erro ao criar intent de pagamento:', error);
    
    // Tratamento específico baseado no tipo de erro
    if (error?.response?.status === 400) {
      throw new Error('Dados de pagamento inválidos. Verifique os valores e tente novamente.');
    } else if (error?.response?.status === 401) {
      throw new Error('Não autorizado. Faça login novamente.');
    } else if (error?.response?.status === 403) {
      throw new Error('Acesso negado ao serviço de pagamento.');
    } else if (error?.response?.status >= 500) {
      throw new Error('Serviço de pagamento temporariamente indisponível. Tente novamente em alguns minutos.');
    } else if (error.message) {
      throw error; // Re-throw dos erros customizados
    } else {
      throw new Error('Falha ao iniciar processo de pagamento. Verifique sua conexão.');
    }
  }
};

// Confirmar pagamento e criar reserva
export const confirmarPagamento = async (dados: ConfirmarPagamentoRequest): Promise<{
  success: boolean, 
  reservaId?: number,
  mensagem?: string,
  status?: string
}> => {
  try {
    const response = await apiRequest('/pagamentos/confirmar-pagamento-stripe', {
      method: 'POST',
      data: dados,
    });

    return { 
      success: true, 
      reservaId: response.reservaId || response.data?.reservaId,
      mensagem: response.mensagem || response.data?.mensagem || 'Pagamento confirmado com sucesso',
      status: response.status || 'Confirmada'
    };
  } catch (error) {
    console.error('Erro ao confirmar pagamento:', error);
    return { 
      success: false,
      mensagem: 'Erro ao confirmar pagamento'
    };
  }
};

export const processarPagamento = async (dadosPagamento: DadosPagamento): Promise<RespostaPagamento> => {
  try {
    // Tenta usar a API real
    console.log(' Tentando processar pagamento via API:', dadosPagamento);
    
    try {
      const response = await apiRequest('/pagamentos/processar', {
        method: 'POST',
        data: dadosPagamento,
      });
      console.log(' Resposta de processamento recebida:', response);
      return response;
    } catch (apiError: any) {
      // Se não existir o endpoint /processar, usar o endpoint padrão
      if (apiError?.response?.status === 405) {
        console.log('Endpoint /processar não disponível, tentando endpoint padrão...');
        
        try {
          const response = await apiRequest('/pagamentos', {
            method: 'POST',
            data: {
              ReservaId: dadosPagamento.pacoteId, 
              UsuarioId: dadosPagamento.usuarioId,
              TipoPagamento: dadosPagamento.formaPagamento,
              StatusPagamento: "Aprovado", 
              ValorPagamento: dadosPagamento.paymentMethodId ? 
                parseFloat((dadosPagamento.quantidadePessoas * 1000).toFixed(2)) : 
                0,
              DataPagamento: new Date().toISOString(),
              StripePaymentIntentId: dadosPagamento.paymentMethodId || "",
            },
          });
          console.log(' Resposta de pagamento padrão recebida:', response);
          
          // Converter para o formato esperado
          return {
            id: response.pagamentoId || "0",
            status: 'aprovado',
            valor: dadosPagamento.quantidadePessoas * 1000,
            message: 'Pagamento processado com sucesso'
          };
        } catch (defaultError) {
          console.error(' Falha no endpoint padrão também:', defaultError);
          throw new Error('Não foi possível processar o pagamento. Verifique sua conexão e tente novamente.');
        }
      } else {
        console.error(' Falha na API de pagamento:', apiError);
        throw new Error('Serviço de pagamento indisponível. Tente novamente em alguns instantes.');
      }
    }
  } catch (error) {
    console.error(' Erro ao processar pagamento:', error);
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


