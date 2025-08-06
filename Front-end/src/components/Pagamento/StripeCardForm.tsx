import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import type { StripeCardElementOptions } from '@stripe/stripe-js';
import { useStripeContext } from '../../contexts/StripeContext';

interface StripeCardFormProps {
  clientSecret: string;
  valorTotal: number;
  pacoteId: number;
  dataViagem: string;
  dataInicio?: string;
  dataFim?: string;
  quantidadePessoas: number;
  onPaymentSuccess: (paymentMethodId: string, reservaId?: number) => void;
  onPaymentError: (error: string) => void;
}

const cardStyle: StripeCardElementOptions = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
      iconColor: '#666ee8',
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
    complete: {
      iconColor: '#00d924',
    },
  },
};

const StripeCardForm: React.FC<StripeCardFormProps> = ({
  clientSecret,
  valorTotal,
  pacoteId,
  dataViagem,
  dataInicio,
  dataFim,
  quantidadePessoas,
  onPaymentSuccess,
  onPaymentError
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { confirmarPagamentoCompleto } = useStripeContext();
  const [loading, setLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      onPaymentError("Elemento de cartão não encontrado");
      setLoading(false);
      return;
    }

    try {
      const isValidStripeClientSecret =
        clientSecret.startsWith('pi_') &&
        clientSecret.includes('_secret_') &&
        clientSecret.length > 50;

      if (!isValidStripeClientSecret) {
        onPaymentError("Configuração de pagamento inválida. Tente novamente.");
        setLoading(false);
        return;
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
          },
        },
      });

      if (result.error) {
        onPaymentError(result.error.message || "Erro ao processar pagamento");
      } else if (result.paymentIntent) {
        const status = result.paymentIntent.status;
        console.log(`💳 Status do pagamento: ${status}`);

        // Passar o paymentIntent.id para confirmação
        onPaymentSuccess(result.paymentIntent.id);
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
      {/* Info de segurança */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <span>Seus dados estão protegidos com criptografia SSL</span>
      </div>

      {/* Card input */}
      <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dados do Cartão
        </label>
        <CardElement
          options={cardStyle}
          onChange={(e) => {
            setCardComplete(e.complete);
            if (e.error) {
              onPaymentError(e.error.message || "Erro no cartão");
            }
          }}
        />
      </div>

      {/* Total a pagar */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total a pagar:</span>
          <span className="text-xl font-bold text-gray-900">
            R$ {valorTotal.toFixed(2).replace('.', ',')}
          </span>
        </div>
      </div>

      {/* Botão de pagamento */}
      <button
        type="submit"
        disabled={!stripe || loading || !cardComplete}
        className={`
          w-full py-4 px-6 rounded-lg font-semibold text-white text-lg
          ${(!stripe || loading || !cardComplete)
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'}
          transition-all duration-200 transform ${(!stripe || loading || !cardComplete) ? '' : 'hover:scale-105'}
        `}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processando pagamento...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Pagar R$ {valorTotal.toFixed(2).replace('.', ',')}
          </span>
        )}
      </button>

      {/* Logos das bandeiras */}
      <div className="flex justify-center space-x-4 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <div className="flex items-center justify-center space-x-3 mb-1">
            <span className="font-medium text-blue-600">💳 Visa</span>
            <span className="font-medium text-red-600">💳 Mastercard</span>
            <span className="font-medium text-blue-800">💳 American Express</span>
          </div>
          <span>Aceitamos os principais cartões</span>
        </div>
      </div>
    </form>
  );
};

export default StripeCardForm;
