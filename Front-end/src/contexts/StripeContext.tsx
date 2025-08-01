import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../api/stripeConfig';
import { criarIntentPagamento, mockCriarIntentPagamento } from '../api/pagamento';

interface StripeContextType {
  clientSecret: string | null;
  loading: boolean;
  error: string | null;
  iniciarPagamento: (valorTotal: number, pacoteId: number) => Promise<void>;
}

const StripeContext = createContext<StripeContextType | undefined>(undefined);

export const useStripeContext = () => {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error('useStripeContext deve ser usado dentro de um StripeProvider');
  }
  return context;
};

interface StripeProviderProps {
  children: ReactNode;
}

export const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const iniciarPagamento = async (valorTotal: number, pacoteId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Iniciando processo de pagamento com Stripe:', {
        valorTotal,
        pacoteId
      });
      
      // Tentar usar a API real primeiro
      try {
        // Chamar a API para criar um payment intent
        const { clientSecret } = await criarIntentPagamento(valorTotal, pacoteId);
        console.log('✅ Client Secret recebido do backend:', clientSecret ? 'Sucesso' : 'Vazio');
        setClientSecret(clientSecret);
      } catch (apiError) {
        console.warn('⚠️ Falha ao usar API real, usando mock para desenvolvimento:', apiError);
        
        // Se a API falhar, usamos o mock para continuar com o desenvolvimento/teste
        const { clientSecret } = await mockCriarIntentPagamento(valorTotal);
        console.log('🔧 Client Secret mockado gerado:', clientSecret ? 'Sucesso' : 'Vazio');
        setClientSecret(clientSecret);
      }
    } catch (err) {
      console.error('Erro ao iniciar pagamento:', err);
      setError('Não foi possível iniciar o processo de pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Verificar se é um client secret mock
  const isMockClientSecret = clientSecret && clientSecret.includes('1'.repeat(10));
  
  // Só renderiza o componente Elements quando tivermos o client secret
  if (clientSecret) {
    // Para client secrets mockados, não passamos para o Elements para evitar erros do Stripe
    if (isMockClientSecret) {
      console.log('🔧 Usando modo mockado para Stripe Elements');
      return (
        <StripeContext.Provider value={{ clientSecret, loading, error, iniciarPagamento }}>
          {children}
        </StripeContext.Provider>
      );
    } else {
      // Para client secrets reais, utilizamos o Stripe Elements normalmente
      return (
        <StripeContext.Provider value={{ clientSecret, loading, error, iniciarPagamento }}>
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            {children}
          </Elements>
        </StripeContext.Provider>
      );
    }
  }

  // Caso ainda não tenha o client secret, renderiza sem o Elements
  return (
    <StripeContext.Provider value={{ clientSecret, loading, error, iniciarPagamento }}>
      {children}
    </StripeContext.Provider>
  );
};
