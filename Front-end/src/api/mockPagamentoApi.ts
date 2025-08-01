// Mock API para processamento de pagamentos quando o backend não estiver disponível
import type { DadosPagamento, RespostaPagamento } from './pagamento';

export const mockProcessarPagamento = async (dadosPagamento: DadosPagamento): Promise<RespostaPagamento> => {
  console.log('🔧 USANDO PROCESSAMENTO MOCK (apenas para desenvolvimento)', dadosPagamento);
  
  // Simulamos uma chamada de API com um atraso
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Gerar um ID aleatório para simular uma resposta real
  const pagamentoId = `pg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  
  return {
    id: pagamentoId,
    status: 'aprovado',
    valor: dadosPagamento.quantidadePessoas * 1000, // valor simulado
    codigoPagamento: `COD-${Math.random().toString(36).toUpperCase().substring(2, 10)}`,
    linkPagamento: '#',
    message: 'Pagamento processado com sucesso (MOCK)'
  };
};
