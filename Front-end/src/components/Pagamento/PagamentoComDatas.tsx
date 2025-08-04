import React, { useState } from 'react';
import { DateSelector } from '../DateSelector';
import StripeCardForm from './StripeCardForm';
import { useStripeContext } from '../../contexts/StripeContext';

interface PagamentoComDatasProps {
  pacoteId: number;
  valorTotal: number;
  quantidadePessoas: number;
  duracaoSugerida?: number; // Duração em dias do pacote
  onPaymentSuccess: (paymentMethodId: string, reservaId?: number) => void;
  onPaymentError: (error: string) => void;
}

const PagamentoComDatas: React.FC<PagamentoComDatasProps> = ({
  pacoteId,
  valorTotal,
  quantidadePessoas,
  duracaoSugerida = 7,
  onPaymentSuccess,
  onPaymentError
}) => {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [etapaAtual, setEtapaAtual] = useState<'datas' | 'pagamento'>('datas');
  const { clientSecret, iniciarPagamento, loading } = useStripeContext();

  // Função para calcular data fim baseada na duração sugerida
  const handleDataInicioChange = (novaDataInicio: string) => {
    setDataInicio(novaDataInicio);
    
    // Se não há data fim definida, calcular baseado na duração sugerida
    if (!dataFim && novaDataInicio && duracaoSugerida) {
      const dataInicioDate = new Date(novaDataInicio);
      const dataFimDate = new Date(dataInicioDate);
      dataFimDate.setDate(dataFimDate.getDate() + duracaoSugerida);
      setDataFim(dataFimDate.toISOString().split('T')[0]);
    }
  };

  const handleContinuarParaPagamento = async () => {
    if (!dataInicio || !dataFim) {
      alert('Por favor, selecione as datas da viagem');
      return;
    }

    if (new Date(dataInicio) >= new Date(dataFim)) {
      alert('A data de início deve ser anterior à data de fim');
      return;
    }

    try {
      await iniciarPagamento(valorTotal, pacoteId);
      setEtapaAtual('pagamento');
    } catch (error) {
      onPaymentError('Erro ao inicializar pagamento');
    }
  };

  const handleVoltarParaDatas = () => {
    setEtapaAtual('datas');
  };

  if (etapaAtual === 'datas') {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Selecione as datas da sua viagem
        </h2>
        
        <DateSelector
          dataInicio={dataInicio}
          dataFim={dataFim}
          onDataInicioChange={handleDataInicioChange}
          onDataFimChange={setDataFim}
          label={`Escolha o período da sua viagem (sugestão: ${duracaoSugerida} dias)`}
        />

        <div className="mt-8 flex flex-col gap-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold text-gray-800 mb-2">Resumo da Reserva:</h3>
            <p className="text-sm text-gray-600">Pacote ID: {pacoteId}</p>
            <p className="text-sm text-gray-600">Quantidade de pessoas: {quantidadePessoas}</p>
            <p className="text-sm text-gray-600">Valor total: R$ {valorTotal.toFixed(2)}</p>
            {dataInicio && dataFim && (
              <p className="text-sm text-gray-600">
                Período: {new Date(dataInicio).toLocaleDateString('pt-BR')} até {new Date(dataFim).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>

          <button
            onClick={handleContinuarParaPagamento}
            disabled={!dataInicio || !dataFim || loading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Carregando...' : 'Continuar para Pagamento'}
          </button>
        </div>
      </div>
    );
  }

  // Etapa de pagamento
  if (!clientSecret) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <p className="text-lg text-gray-600">Inicializando pagamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <button
          onClick={handleVoltarParaDatas}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Voltar para seleção de datas
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800">
          Finalize seu pagamento
        </h2>
        
        <div className="mt-4 bg-blue-50 p-4 rounded-md">
          <h3 className="font-semibold text-blue-800 mb-2">Dados da sua reserva:</h3>
          <p className="text-sm text-blue-700">
            Período: {new Date(dataInicio).toLocaleDateString('pt-BR')} até {new Date(dataFim).toLocaleDateString('pt-BR')}
          </p>
          <p className="text-sm text-blue-700">Pessoas: {quantidadePessoas}</p>
          <p className="text-sm text-blue-700">Valor: R$ {valorTotal.toFixed(2)}</p>
        </div>
      </div>

      <StripeCardForm
        clientSecret={clientSecret}
        valorTotal={valorTotal}
        pacoteId={pacoteId}
        dataViagem={dataInicio} // Compatibilidade com API atual
        dataInicio={dataInicio}
        dataFim={dataFim}
        quantidadePessoas={quantidadePessoas}
        onPaymentSuccess={onPaymentSuccess}
        onPaymentError={onPaymentError}
      />
    </div>
  );
};

export default PagamentoComDatas;
