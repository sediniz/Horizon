// Este arquivo contém mocks para testar a integração com Stripe
// Remova este arquivo quando o backend estiver implementado

import type { DadosPagamento, RespostaPagamento } from './pagamento';

// Mock para criar intent de pagamento
export const mockCriarIntent = (_valorTotal: number, _pacoteId: number): Promise<{clientSecret: string}> => {
  return new Promise((resolve) => {
    // Simular um atraso de rede
    setTimeout(() => {
      // Gerar um client secret falso para testes
      // Em produção, isso viria do backend
      const clientSecret = `pi_${Math.random().toString(36).substring(2)}_secret_${Math.random().toString(36).substring(2)}`;
      
      resolve({ clientSecret });
    }, 1500);
  });
};

// Mock para processar pagamento
export const mockProcessarPagamento = (dadosPagamento: DadosPagamento): Promise<RespostaPagamento> => {
  return new Promise((resolve, reject) => {
    // Simular um atraso de rede
    setTimeout(() => {
      // Simular diferentes respostas com base no método de pagamento
      if (dadosPagamento.formaPagamento === 'Cartão de Crédito') {
        if (!dadosPagamento.paymentMethodId) {
          reject(new Error('ID do método de pagamento não fornecido'));
          return;
        }
        
        // Simular um pagamento bem-sucedido com cartão de crédito
        resolve({
          id: `payment_${Math.random().toString(36).substring(2)}`,
          status: 'aprovado',
          valor: 100,
          message: 'Pagamento com cartão de crédito aprovado'
        });
      } else if (dadosPagamento.formaPagamento === 'PIX') {
        // Simular pagamento PIX
        resolve({
          id: `payment_${Math.random().toString(36).substring(2)}`,
          status: 'pendente',
          valor: 100,
          codigoPagamento: '00020101021226940014br.gov.bcb.pix0136a629534e-7693-4846-b028-f2c302d8e69f5204000053039865802BR5925HORIZON VIAGENS LTDA6009SAO PAULO62070503***63040B16',
          linkPagamento: 'https://exemplo.com/pix',
          message: 'PIX gerado com sucesso. Aguardando pagamento.'
        });
      } else if (dadosPagamento.formaPagamento === 'Boleto') {
        // Simular pagamento com boleto
        resolve({
          id: `payment_${Math.random().toString(36).substring(2)}`,
          status: 'pendente',
          valor: 100,
          codigoPagamento: '34191.09008 76547.534245 67890.100102 9 89670000001000',
          linkPagamento: 'https://exemplo.com/boleto',
          message: 'Boleto gerado com sucesso. Vencimento em 3 dias.'
        });
      } else {
        // Método de pagamento não suportado
        reject(new Error('Método de pagamento não suportado'));
      }
    }, 2000);
  });
};
