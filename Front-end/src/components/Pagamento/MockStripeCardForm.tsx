import React, { useState } from 'react';

interface MockCardFormProps {
  clientSecret: string;
  valorTotal: number;
  onPaymentSuccess: (paymentMethodId: string) => void;
  onPaymentError: (error: string) => void;
}

const MockStripeCardForm: React.FC<MockCardFormProps> = ({ 
  clientSecret, 
  valorTotal,
  onPaymentSuccess 
}) => {
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expDate, setExpDate] = useState('12/25');
  const [cvc, setCvc] = useState('123');
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    
    console.log('🔧 Processando pagamento mockado:', {
      valorTotal,
      clientSecret: clientSecret.substring(0, 10) + '...'
    });
    
    // Simular um atraso de processamento
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Gerar um ID mockado para simular sucesso
    const mockPaymentId = `pi_${Date.now()}_mock`;
    
    // Simular sucesso
    setLoading(false);
    onPaymentSuccess(mockPaymentId);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border border-yellow-200 rounded-md bg-yellow-50">
        <div className="mb-1">
          <p className="text-sm font-medium text-yellow-700 mb-2">⚠️ MODO DE DESENVOLVIMENTO</p>
          <p className="text-xs text-yellow-600">
            Usando cartão de teste. Em produção, isso seria substituído pelo formulário real do Stripe.
          </p>
        </div>
      </div>
      
      <div className="p-4 border border-gray-200 rounded-md bg-white">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número do cartão</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Use um cartão de teste do Stripe</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de expiração</label>
              <input
                type="text"
                value={expDate}
                onChange={(e) => setExpDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
              <input
                type="text"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <p className="text-sm text-gray-600">
          Este é um ambiente de teste seguro. Nenhum pagamento real será processado.
        </p>

        <button
          type="submit"
          className={`w-full py-3 px-4 rounded-md font-medium text-white ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processando...
            </div>
          ) : (
            `Pagar R$ ${valorTotal.toFixed(2).replace('.', ',')}`
          )}
        </button>
      </div>
    </form>
  );
};

export default MockStripeCardForm;
