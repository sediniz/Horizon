import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import type { StripeCardElementOptions } from '@stripe/stripe-js';

interface StripeCardFormProps {
  clientSecret: string;
  valorTotal: number;
  onPaymentSuccess: (paymentMethodId: string) => void;
  onPaymentError: (error: string) => void;
}

const cardStyle: StripeCardElementOptions = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

const StripeCardForm: React.FC<StripeCardFormProps> = ({ 
  clientSecret, 
  valorTotal,
  onPaymentSuccess, 
  onPaymentError 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js ainda não carregou
      return;
    }

    setLoading(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      onPaymentError("Elemento de cartão não encontrado");
      setLoading(false);
      return;
    }

    try {
      // Verificar se é um clientSecret mockado (para desenvolvimento)
      // Nosso mock usa "1".repeat(24) como formato
      const isMockClientSecret = clientSecret.includes('1'.repeat(10));

      if (isMockClientSecret) {
        // Se for um mock, simular um processamento e sucesso após um delay
        console.log('🔧 Usando cliente secret mock (simulando processamento)');
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500)); // simula processamento
        
        // Gerar um ID mockado para simular sucesso
        const mockPaymentId = `pi_${Date.now()}`;
        console.log('✅ Pagamento mock processado com sucesso:', mockPaymentId);
        
        // Simular sucesso
        onPaymentSuccess(mockPaymentId);
      } else {
        // Confirmar o pagamento com o Stripe real
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              // Aqui você pode adicionar detalhes de cobrança
            },
          }
        });

        if (result.error) {
          // Mostrar erro para o cliente
          onPaymentError(result.error.message || "Erro ao processar pagamento");
        } else {
          // O pagamento foi processado!
          if (result.paymentIntent) {
            if (result.paymentIntent.status === 'succeeded') {
              // Pagamento concluído com sucesso
              onPaymentSuccess(result.paymentIntent.id);
            } else if (result.paymentIntent.status === 'requires_action' || 
                      result.paymentIntent.status === 'requires_confirmation') {
              // Precisa de autenticação adicional
              console.log(`Pagamento requer ação adicional: ${result.paymentIntent.status}`);
              // Continuar com o fluxo de autenticação se necessário
              onPaymentSuccess(result.paymentIntent.id);
            } else {
              // Outros status (processing, requires_capture, etc.)
              console.log(`Status do pagamento: ${result.paymentIntent.status}`);
              onPaymentSuccess(result.paymentIntent.id);
            }
          }
        }
      }
    } catch (error) {
      console.error("Erro no pagamento:", error);
      onPaymentError("Ocorreu um erro ao processar o pagamento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border border-gray-200 rounded-md bg-white">
        <CardElement 
          options={cardStyle} 
          onChange={(e) => setCardComplete(e.complete)}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <p className="text-sm text-gray-600">
          Seu pagamento está seguro e criptografado.
        </p>

        <button 
          type="submit"
          disabled={!stripe || loading || !cardComplete} 
          className={`
            w-full py-3 px-4 rounded-lg font-medium text-white
            ${(!stripe || loading || !cardComplete) 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'}
            transition duration-200
          `}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processando...
            </span>
          ) : (
            <span>Pagar R$ {valorTotal.toFixed(2).replace('.', ',')}</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default StripeCardForm;
