import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../api/stripeConfig';
import { criarIntentPagamento, confirmarPagamento } from '../api/pagamento';
import { useAuth } from './AuthContext';

interface StripeContextType {
  clientSecret: string | null;
  loading: boolean;
  error: string | null;
  iniciarPagamento: (valorTotal: number, pacoteId: number) => Promise<void>;
  confirmarPagamentoCompleto: (paymentIntentId: string, dadosReserva: DadosReserva) => Promise<boolean>;
}

interface DadosReserva {
  pacoteId: number;
  dataViagem: string;
  dataInicio: string; 
  dataFim: string;    
  quantidadePessoas: number;
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
  const { usuario } = useAuth();

  const iniciarPagamento = async (valorTotal: number, pacoteId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Iniciando processo de pagamento com Stripe:', {
        valorTotal,
        pacoteId
      });
      
      try {
        // Chamar a API para criar um payment intent
        const { clientSecret } = await criarIntentPagamento(valorTotal, pacoteId);
        console.log('✅ Client Secret recebido do backend:', clientSecret ? 'Sucesso' : 'Vazio');
        
        if (clientSecret && clientSecret.startsWith('pi_') && clientSecret.includes('_secret_')) {
          setClientSecret(clientSecret);
        } else {
          throw new Error('Client secret inválido recebido do backend');
        }
      } catch (apiError) {
        console.error('❌ Falha ao conectar com API de pagamento:', apiError);
        throw new Error('Não foi possível conectar ao serviço de pagamento. Verifique sua conexão e tente novamente.');
      }
    } catch (err) {
      console.error('Erro ao iniciar pagamento:', err);
      setError('Não foi possível iniciar o processo de pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const confirmarPagamentoCompleto = async (paymentIntentId: string, dadosReserva: DadosReserva): Promise<boolean> => {
    try {
      if (!usuario?.usuarioId) {
        console.error('Usuário não está logado');
        return false;
      }

      const dataViagem = dadosReserva.dataInicio || dadosReserva.dataViagem;
      
      console.log('📅 Dados da reserva para confirmação:', {
        paymentIntentId,
        usuarioId: usuario.usuarioId,
        pacoteId: dadosReserva.pacoteId,
        dataViagem,
        quantidadePessoas: dadosReserva.quantidadePessoas
      });

      const resultado = await confirmarPagamento({
        paymentIntentId,
        usuarioId: usuario.usuarioId,
        pacoteId: dadosReserva.pacoteId,
        dataViagem,
        quantidadePessoas: dadosReserva.quantidadePessoas
      });

      console.log('📄 Resultado da confirmação de pagamento:', resultado);

      if (resultado.success) {
        console.log('✅ Pagamento confirmado e reserva criada:', resultado.reservaId);
        console.log('📋 Status da reserva no backend:', resultado.status || 'Confirmada');
        return true;
      } else {
        console.error('❌ Falha ao confirmar pagamento:', resultado.mensagem || 'Erro desconhecido');
        return false;
      }
    } catch (error) {
      console.error('Erro ao confirmar pagamento completo:', error);
      return false;
    }
  };

  if (clientSecret) {
    return (
      <StripeContext.Provider value={{ clientSecret, loading, error, iniciarPagamento, confirmarPagamentoCompleto }}>
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          {children}
        </Elements>
      </StripeContext.Provider>
    );
  }

  return (
    <StripeContext.Provider value={{ clientSecret, loading, error, iniciarPagamento, confirmarPagamentoCompleto }}>
      {children}
    </StripeContext.Provider>
  );
};
