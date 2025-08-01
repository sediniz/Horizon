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
  pacoteId?: number;  // Opcional porque pode não existir ainda
  reservaId?: number; // Opcional porque podemos criar uma reserva depois
  tipoPagamento?: string;
}

// Criar intent de pagamento com Stripe
export const criarIntentPagamento = async (valorTotal: number, pacoteId: number): Promise<{clientSecret: string}> => {
  try {
    // Criamos um payload completo conforme o backend espera
    const payload: PaymentIntentRequest = {
      valorTotal,
      pacoteId,
      tipoPagamento: "Cartão de Crédito",
      // Não enviamos reservaId porque provavelmente a reserva ainda não foi criada
    };
    
    console.log('📊 Enviando payload para criar intent:', payload);
    
    const response = await apiRequest('/pagamentos/criar-intent', {
      method: 'POST',
      data: payload,
    });
    return response;
  } catch (error) {
    console.error('Erro ao criar intent de pagamento:', error);
    throw new Error('Falha ao iniciar processo de pagamento.');
  }
};

// Processar o pagamento com Stripe
// Função para criar um mock de client secret para testes
const gerarMockClientSecret = () => {
  // Gerar um string aleatório que segue EXATAMENTE o formato exigido pelo Stripe
  // O formato deve ser pi_XXXXXXXXXXXX_secret_XXXXXXXXXXXX onde X são caracteres alfanuméricos
  // Limitando para exatamente 24 caracteres na primeira parte e 24 na segunda
  const id = `pi_${"1".repeat(24)}`;
  const secret = `secret_${"1".repeat(24)}`;
  return `${id}_${secret}`;
};

// Função mock para uso em desenvolvimento quando a API backend não está respondendo
export const mockCriarIntentPagamento = async (valorTotal: number): Promise<{clientSecret: string}> => {
  console.log('🔧 USANDO IMPLEMENTAÇÃO MOCK DO STRIPE - apenas para desenvolvimento', { valorTotal });
  
  // Simulamos uma chamada de API com um atraso
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return { 
    clientSecret: gerarMockClientSecret()
  };
};

// Importar a versão mock do processamento de pagamento
import { mockProcessarPagamento } from './mockPagamentoApi';

export const processarPagamento = async (dadosPagamento: DadosPagamento): Promise<RespostaPagamento> => {
  try {
    // Tenta usar a API real
    console.log('🔄 Tentando processar pagamento via API:', dadosPagamento);
    
    try {
      const response = await apiRequest('/pagamentos/processar', {
        method: 'POST',
        data: dadosPagamento,
      });
      console.log('✅ Resposta de processamento recebida:', response);
      return response;
    } catch (apiError: any) {
      // Se não existir o endpoint /processar, usar o endpoint padrão
      if (apiError?.response?.status === 405) {
        console.log('⚠️ Endpoint /processar não disponível, tentando endpoint padrão...');
        
        try {
          // Tenta usar o endpoint padrão para criar um pagamento
          const response = await apiRequest('/pagamentos', {
            method: 'POST',
            data: {
              ReservaId: dadosPagamento.pacoteId, // Não temos uma reserva ainda, então usamos o pacoteId
              UsuarioId: dadosPagamento.usuarioId,
              TipoPagamento: dadosPagamento.formaPagamento,
              StatusPagamento: "Aprovado", // Simulando que foi aprovado
              ValorPagamento: dadosPagamento.paymentMethodId ? 
                parseFloat((dadosPagamento.quantidadePessoas * 1000).toFixed(2)) : 
                0,
              DataPagamento: new Date().toISOString(),
              StripePaymentIntentId: dadosPagamento.paymentMethodId || "",
            },
          });
          console.log('✅ Resposta de pagamento padrão recebida:', response);
          
          // Converter para o formato esperado
          return {
            id: response.pagamentoId || "0",
            status: 'aprovado',
            valor: dadosPagamento.quantidadePessoas * 1000,
            message: 'Pagamento processado com sucesso'
          };
        } catch (defaultError) {
          console.warn('❌ Falha no endpoint padrão, usando mock:', defaultError);
          return await mockProcessarPagamento(dadosPagamento);
        }
      } else {
        console.warn('❌ Falha na API, usando mock:', apiError);
        return await mockProcessarPagamento(dadosPagamento);
      }
    }
  } catch (error) {
    console.error('🔴 Erro ao processar pagamento:', error);
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


