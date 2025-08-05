import React, { useState, useEffect } from 'react';
import { 
  processarPagamento, 
  buscarDadosPacote, 
  aplicarDesconto
} from '../../api/pagamento';
import { StripeProvider, useStripeContext } from '../../contexts/StripeContext';
import StripeCardForm from '../../components/Pagamento/StripeCardForm';
import type { DadosPagamento, DadosPacote } from '../../api/pagamento';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface PagamentoProps {
  pacoteId?: number;
}

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const PagamentoSimples = ({ pacoteId: propPacoteId }: PagamentoProps) => {
  const query = useQuery();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const stripeContext = useStripeContext();
  
  // Função gambiarra para adicionar +1 dia
  const adicionarUmDia = (dataString: string): string => {
    if (!dataString) return '';
    const data = new Date(dataString);
    data.setDate(data.getDate() + 1);
    return data.toISOString().split('T')[0];
  };

  // Função para calcular duração entre duas datas
  const calcularDuracao = (dataInicio: string, dataFim: string): number => {
    if (!dataInicio || !dataFim) return 0;
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    const diffTime = fim.getTime() - inicio.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Extrair parâmetros da URL
  const pacoteIdFromQuery = query.get('pacoteId');
  const tituloFromQuery = query.get('titulo');
  const valorFromQuery = query.get('valor');
  const pessoasFromQuery = query.get('pessoas');
  const dataIdaFromQuery = query.get('dataIda');
  const dataVoltaFromQuery = query.get('dataVolta');
  const duracaoFromQuery = query.get('duracao');
  
  // Debug dos parâmetros da URL
  console.log('🔍 Parâmetros da URL:', {
    pacoteId: pacoteIdFromQuery,
    titulo: tituloFromQuery,
    valor: valorFromQuery,
    pessoas: pessoasFromQuery,
    dataIda: dataIdaFromQuery,
    dataVolta: dataVoltaFromQuery,
    duracao: duracaoFromQuery
  });
  
  // Estados principais
  const [etapa, setEtapa] = useState<'pagamento' | 'sucesso'>('pagamento');
  const [formData, setFormData] = useState({
    data: adicionarUmDia(dataIdaFromQuery || ''),
    dataVolta: adicionarUmDia(dataVoltaFromQuery || ''),
    quantidadePessoas: pessoasFromQuery || '',
    desconto: '',
    formaPagamento: 'PIX' as 'PIX' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Boleto',
    nome: usuario?.nome || '',
    email: usuario?.email || '',
    telefone: usuario?.telefone || '',
    cpf: usuario?.cpfPassaporte || ''
  });

  // Debug do formData inicial
  console.log('📝 FormData inicial:', {
    data: dataIdaFromQuery,
    dataVolta: dataVoltaFromQuery,
    formDataData: formData.data,
    formDataDataVolta: formData.dataVolta
  });

  // Calcular duração correta baseada nas datas originais (sem gambiarra)
  const duracaoCalculada = dataIdaFromQuery && dataVoltaFromQuery 
    ? calcularDuracao(dataIdaFromQuery, dataVoltaFromQuery)
    : Number(duracaoFromQuery) || 0;

  console.log('⏱️ Duração calculada:', {
    dataIdaFromQuery,
    dataVoltaFromQuery,
    duracaoFromQuery,
    duracaoCalculada
  });

  const [pacoteData, setPacoteData] = useState<DadosPacote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [descontoAplicado, setDescontoAplicado] = useState<number>(0);
  const [numeroPedido, setNumeroPedido] = useState<string>('');
  const [parcelas, setParcelas] = useState<number>(3);

  const pacoteId = Number(pacoteIdFromQuery) || propPacoteId || 3;
  const usuarioId = usuario?.usuarioId?.toString() || "1";

  // Carregar dados do pacote
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        
        if (valorFromQuery && tituloFromQuery && duracaoFromQuery && pessoasFromQuery && dataIdaFromQuery) {
          console.log('✅ Usando dados da URL para criar pacoteData');
          const dadosFromURL: DadosPacote = {
            pacoteId: Number(pacoteIdFromQuery) || 0,
            titulo: tituloFromQuery || '',
            descricao: '',
            destino: '',
            duracao: Number(duracaoFromQuery) || 0,
            quantidadeDePessoas: Number(pessoasFromQuery) || 1,
            valorTotal: parseFloat(valorFromQuery)
          };
          setPacoteData(dadosFromURL);
          console.log('📦 PacoteData definido:', dadosFromURL);
        } else {
          const dados = await buscarDadosPacote(pacoteId);
          setPacoteData(dados);
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError('Erro ao carregar dados do pacote');
      } finally {
        setLoading(false);
      }
    };

    if (pacoteId) {
      carregarDados();
    }
  }, [pacoteId, valorFromQuery, tituloFromQuery, duracaoFromQuery, pessoasFromQuery, pacoteIdFromQuery, dataVoltaFromQuery]);

  // Atualizar dados do usuário quando logar
  useEffect(() => {
    if (usuario) {
      setFormData(prev => ({
        ...prev,
        nome: usuario.nome || '',
        email: usuario.email || '',
        telefone: usuario.telefone || '',
        cpf: usuario.cpfPassaporte || ''
      }));
    }
  }, [usuario]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAplicarDesconto = async () => {
    if (!formData.desconto || !pacoteData) return;
    try {
      setLoading(true);
      const resultado = await aplicarDesconto(formData.desconto, pacoteId);
      setDescontoAplicado(resultado.desconto);
    } catch {
      setError('Código de desconto inválido');
    } finally {
      setLoading(false);
    }
  };

  const configurarPagamentoCartao = async () => {
    if (!pacoteData) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Calcular valor final baseado nas parcelas
      let valorFinalPagamento = pacoteData.valorTotal - descontoAplicado;
      
      if (parcelas === 1) {
        // À vista com 5% de desconto
        valorFinalPagamento = valorFinalPagamento * 0.95;
      } else if (parcelas > 3) {
        // Com juros para parcelas acima de 3x
        valorFinalPagamento = valorFinalPagamento * (1 + (0.02 * (parcelas - 1)));
      }
      
      await stripeContext.iniciarPagamento(
        valorFinalPagamento, 
        pacoteId
      );
    } catch (err) {
      console.error('❌ Erro ao configurar pagamento:', err);
      setError('Não foi possível configurar o pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentMethodId: string) => {
    finalizarPagamento(paymentMethodId);
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const finalizarPagamento = async (paymentId?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (formData.formaPagamento === 'Cartão de Crédito' && paymentId) {
        // Pagamento com cartão via Stripe
        const reservaCriada = await stripeContext.confirmarPagamentoCompleto(
          paymentId,
          {
            pacoteId,
            dataViagem: formData.data,
            dataInicio: formData.data,
            dataFim: formData.dataVolta || formData.data,
            quantidadePessoas: parseInt(formData.quantidadePessoas)
          }
        );
        
        if (reservaCriada) {
          setNumeroPedido(`PED${Date.now().toString().substring(6)}`);
          setEtapa('sucesso');
        } else {
          setError('Erro ao criar a reserva. Entre em contato com nosso suporte.');
        }
      } else {
        // Outros métodos de pagamento
        const dadosPagamento: DadosPagamento = {
          data: formData.data,
          quantidadePessoas: parseInt(formData.quantidadePessoas),
          desconto: formData.desconto || undefined,
          formaPagamento: formData.formaPagamento,
          pacoteId,
          usuarioId: usuarioId,
          paymentMethodId: paymentId || undefined
        };

        const resultado = await processarPagamento(dadosPagamento);
        
        if (resultado.status === 'aprovado') {
          setNumeroPedido(`PED${Date.now().toString().substring(6)}`);
          setEtapa('sucesso');
        } else {
          setError('Pagamento não foi aprovado. Tente novamente.');
        }
      }
    } catch (error) {
      console.error('❌ Erro no processamento:', error);
      setError('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const valorFinal = pacoteData ? pacoteData.valorTotal - descontoAplicado : 0;
  const valorParcela = valorFinal / parcelas;
  const juros = parcelas > 3 ? 0.02 : 0; // 2% de juros para parcelas acima de 3x
  const valorComJuros = valorFinal * (1 + (juros * (parcelas - 1)));
  const valorParcelaComJuros = valorComJuros / parcelas;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header de progresso */}
        <div className="bg-white rounded-xl shadow-lg mb-8 p-6">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-3 ${etapa !== 'sucesso' ? 'text-blue-600' : 'text-green-600'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${etapa !== 'sucesso' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`}>
                {etapa === 'sucesso' ? '✓' : '1'}
              </div>
              <span className="font-semibold">Dados & Pagamento</span>
            </div>
            <div className={`h-1 flex-1 mx-4 rounded ${etapa === 'sucesso' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center space-x-3 ${etapa === 'sucesso' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${etapa === 'sucesso' ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>
                {etapa === 'sucesso' ? '✓' : '2'}
              </div>
              <span className="font-semibold">Confirmação</span>
            </div>
          </div>
        </div>

        {usuario && etapa !== 'sucesso' && (
          <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 px-6 py-4 rounded-lg mb-6 shadow-sm">
            <div className="flex items-center">
              <span className="text-2xl mr-3">👋</span>
              <div>
                <strong className="font-bold">Olá, {usuario.nome}!</strong>
                <p className="text-sm mt-1">Seus dados foram preenchidos automaticamente para facilitar sua compra.</p>
              </div>
            </div>
          </div>
        )}

        {etapa === 'pagamento' ? (
          // Página de Dados e Pagamento Juntos
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conteúdo principal */}
            <div className="lg:col-span-2 space-y-6">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 text-red-800 px-6 py-4 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <span className="text-xl mr-3">⚠️</span>
                    <span className="font-medium">{error}</span>
                  </div>
                </div>
              )}

              {/* Formulário de Dados */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                  <h2 className="text-2xl font-bold mb-2">📝 Dados da Reserva</h2>
                  <p className="text-blue-100">Preencha suas informações para continuar</p>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-3">📅 Check-in</label>
                        <input
                          type="date"
                          name="data"
                          value={formData.data}
                          onChange={handleInputChange}
                          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-3">📅 Check-out</label>
                        <input
                          type="date"
                          name="dataVolta"
                          value={formData.dataVolta}
                          onChange={handleInputChange}
                          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-3">👥 Quantidade de Pessoas</label>
                        <input
                          type="number"
                          name="quantidadePessoas"
                          value={formData.quantidadePessoas}
                          onChange={handleInputChange}
                          placeholder="Digite a quantidade"
                          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          min="1"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-3">👤 Nome Completo</label>
                        <input
                          type="text"
                          name="nome"
                          value={formData.nome}
                          onChange={handleInputChange}
                          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Digite seu nome completo"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-3">✉️ E-mail</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="seu@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-3">📱 Telefone</label>
                        <input
                          type="tel"
                          name="telefone"
                          value={formData.telefone}
                          onChange={handleInputChange}
                          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="(11) 99999-9999"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-3">🆔 CPF</label>
                        <input
                          type="text"
                          name="cpf"
                          value={formData.cpf}
                          onChange={handleInputChange}
                          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="000.000.000-00"
                          required
                        />
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <label className="block text-gray-700 font-semibold mb-3">🎟️ Código de Desconto (Opcional)</label>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          name="desconto"
                          value={formData.desconto}
                          onChange={handleInputChange}
                          placeholder="Digite seu código de desconto"
                          className="flex-1 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                        />
                        <button
                          type="button"
                          onClick={handleAplicarDesconto}
                          disabled={!formData.desconto || loading}
                          className="px-6 py-4 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 disabled:bg-gray-300 transition duration-300 whitespace-nowrap"
                        >
                          Aplicar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção de Pagamento */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
                  <h2 className="text-2xl font-bold mb-2">💳 Forma de Pagamento</h2>
                  <p className="text-green-100">Escolha como deseja pagar sua viagem</p>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Opções de pagamento */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {(['PIX', 'Cartão de Crédito', 'Cartão de Débito', 'Boleto'] as const).map((forma) => (
                        <button
                          key={forma}
                          onClick={() => setFormData(prev => ({ ...prev, formaPagamento: forma }))}
                          className={`p-6 border-3 rounded-xl text-center transition duration-300 transform hover:scale-105 ${
                            formData.formaPagamento === forma
                              ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-lg'
                              : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                          }`}
                        >
                          <div className="text-3xl mb-3">
                            {forma === 'PIX' && '🏦'}
                            {forma === 'Cartão de Crédito' && '💳'}
                            {forma === 'Cartão de Débito' && '💳'}
                            {forma === 'Boleto' && '📄'}
                          </div>
                          <div className="text-sm font-semibold">{forma}</div>
                          {forma === 'PIX' && <div className="text-xs text-gray-500 mt-1">Desconto 5%</div>}
                          {forma === 'Cartão de Crédito' && <div className="text-xs text-gray-500 mt-1">Até 12x</div>}
                        </button>
                      ))}
                    </div>

                    {formData.formaPagamento === 'Cartão de Crédito' && (
                      <div className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-blue-200">
                        <h3 className="font-bold text-gray-800 mb-4 text-lg">💳 Dados do Cartão de Crédito</h3>
                        
                        {/* Seletor de Parcelas */}
                        <div className="mb-6 bg-white rounded-lg p-4 shadow-sm">
                          <h4 className="font-semibold text-gray-700 mb-4">📊 Escolha a forma de pagamento:</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {[1, 2, 3, 6, 12].map((numParcelas) => {
                              const valorParcelaCalc = numParcelas > 3 ? valorComJuros / numParcelas : valorFinal / numParcelas;
                              const temJuros = numParcelas > 3;
                              return (
                                <button
                                  key={numParcelas}
                                  onClick={() => setParcelas(numParcelas)}
                                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                                    parcelas === numParcelas
                                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                                      : 'border-gray-200 hover:border-blue-300'
                                  }`}
                                >
                                  <div className="font-bold text-sm">
                                    {numParcelas === 1 ? 'À vista' : `${numParcelas}x`}
                                  </div>
                                  <div className="text-xs text-gray-600 mt-1">
                                    R$ {valorParcelaCalc.toFixed(2).replace('.', ',')}
                                  </div>
                                  {temJuros && (
                                    <div className="text-xs text-red-500 mt-1">
                                      c/ juros
                                    </div>
                                  )}
                                  {!temJuros && numParcelas > 1 && (
                                    <div className="text-xs text-green-600 mt-1">
                                      sem juros
                                    </div>
                                  )}
                                  {numParcelas === 1 && (
                                    <div className="text-xs text-green-600 mt-1">
                                      5% desc.
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <div className="text-center">
                              <div className="text-sm text-gray-600 mb-1">
                                {parcelas === 1 ? 'Pagamento à vista' : `Parcelado em ${parcelas}x`}
                                {parcelas > 3 && ' (com juros de 2% a.m.)'}
                              </div>
                              <div className="text-2xl font-bold text-blue-600">
                                {parcelas === 1 ? (
                                  <>R$ {(valorFinal * 0.95).toFixed(2).replace('.', ',')}</>
                                ) : parcelas > 3 ? (
                                  <>{parcelas} × R$ {valorParcelaComJuros.toFixed(2).replace('.', ',')}</>
                                ) : (
                                  <>{parcelas} × R$ {valorParcela.toFixed(2).replace('.', ',')}</>
                                )}
                              </div>
                              {parcelas > 3 && (
                                <div className="text-sm text-gray-600 mt-1">
                                  Total: R$ {valorComJuros.toFixed(2).replace('.', ',')}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {stripeContext.clientSecret ? (
                          <div>
                            <StripeCardForm 
                              clientSecret={stripeContext.clientSecret}
                              valorTotal={parcelas === 1 ? valorFinal * 0.95 : (parcelas > 3 ? valorComJuros : valorFinal)}
                              pacoteId={pacoteId}
                              dataViagem={formData.data}
                              dataInicio={formData.data}
                              dataFim={formData.dataVolta || formData.data}
                              quantidadePessoas={parseInt(formData.quantidadePessoas) || 1}
                              onPaymentSuccess={handlePaymentSuccess}
                              onPaymentError={handlePaymentError}
                            />
                          </div>
                        ) : (
                          <div className="text-center p-6">
                            {stripeContext.loading ? (
                              <div className="flex flex-col items-center">
                                <svg className="animate-spin h-12 w-12 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <p className="text-gray-600">Configurando pagamento seguro...</p>
                              </div>
                            ) : stripeContext.error ? (
                              <div className="text-center">
                                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                  <span className="text-xl mr-2">⚠️</span>
                                  {stripeContext.error}
                                </div>
                                <button
                                  onClick={configurarPagamentoCartao}
                                  disabled={loading}
                                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                                >
                                  {loading ? 'Configurando...' : 'Tentar novamente'}
                                </button>
                              </div>
                            ) : (
                              <div>
                                <p className="mb-4 text-gray-600">Clique no botão abaixo para configurar seu pagamento seguro</p>
                                <button
                                  onClick={configurarPagamentoCartao}
                                  disabled={loading}
                                  className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors transform hover:scale-105"
                                >
                                  {loading ? 'Configurando...' : '🔒 Configurar Pagamento Seguro'}
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {formData.formaPagamento !== 'Cartão de Crédito' && (
                      <button
                        onClick={() => {
                          if (!formData.data || !formData.quantidadePessoas || !formData.nome || !formData.email) {
                            setError('Por favor, preencha todos os campos obrigatórios');
                            return;
                          }
                          setError(null);
                          finalizarPagamento();
                        }}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 rounded-lg transition duration-300 disabled:bg-gray-300 transform hover:scale-105 shadow-lg"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processando...
                          </div>
                        ) : (
                          `✅ Finalizar Pagamento - ${formData.formaPagamento}`
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Resumo da compra */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                <div className="mb-6">
                  {loading ? (
                    <div className="bg-gray-100 h-32 rounded-lg flex items-center justify-center">
                      <div className="text-gray-600">Carregando dados...</div>
                    </div>
                  ) : pacoteData ? (
                    <div className="text-center">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 h-24 rounded-lg flex items-center justify-center mb-3 border border-blue-200">
                        <div className="text-center text-gray-700">
                          <div className="font-bold text-lg">{pacoteData.titulo}</div>
                          <div className="text-sm text-blue-600">{pacoteData.destino || 'Destino incrível'}</div>
                        </div>
                      </div>
                    </div>
                  ) : tituloFromQuery ? (
                    <div className="text-center">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 h-24 rounded-lg flex items-center justify-center mb-3 border border-blue-200">
                        <div className="text-center text-gray-700">
                          <div className="font-bold text-lg">{tituloFromQuery}</div>
                          <div className="text-sm text-blue-600">Pacote selecionado</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-100 h-32 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-600">
                        <div className="font-medium">Nome do pacote</div>
                        <div className="text-sm mt-1">localização</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-4 mb-4 border border-cyan-200">
                  <p className="text-sm text-gray-600 mb-2">
                    {descontoAplicado > 0 ? `💰 Economize R$ ${descontoAplicado.toFixed(2)}` : '✅ Melhor preço garantido'}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    Por pessoa: R$ {pacoteData ? (pacoteData.valorTotal / (pacoteData.quantidadeDePessoas || 1)).toFixed(2).replace('.', ',') : '0'}
                  </p>
                  {formData.formaPagamento === 'Cartão de Crédito' && (
                    <div className="text-sm text-gray-600 mb-2">
                      {parcelas === 1 ? (
                        <span className="text-green-600 font-semibold">À vista com 5% de desconto</span>
                      ) : parcelas > 3 ? (
                        <span className="text-orange-600">{parcelas}x com juros (2% a.m.)</span>
                      ) : (
                        <span className="text-green-600">{parcelas}x sem juros</span>
                      )}
                    </div>
                  )}
                  <p className="text-3xl font-bold text-cyan-600 mb-1">
                    {formData.formaPagamento === 'Cartão de Crédito' ? (
                      parcelas === 1 ? (
                        `R$ ${(valorFinal * 0.95).toFixed(2).replace('.', ',')}`
                      ) : parcelas > 3 ? (
                        `R$ ${valorComJuros.toFixed(2).replace('.', ',')}`
                      ) : (
                        `R$ ${valorFinal.toFixed(2).replace('.', ',')}`
                      )
                    ) : (
                      `R$ ${valorFinal.toFixed(2).replace('.', ',')}`
                    )}
                  </p>
                  <p className="text-xs text-gray-500">Duração: {duracaoCalculada || pacoteData?.duracao || '-'} dias</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pacote</span>
                    <span className="font-semibold">
                      R$ {pacoteData ? pacoteData.valorTotal.toFixed(2).replace('.', ',') : (valorFromQuery ? parseFloat(valorFromQuery).toFixed(2).replace('.', ',') : '0')}
                    </span>
                  </div>
                  {descontoAplicado > 0 && (
                    <div className="flex justify-between items-center text-green-600">
                      <span>Desconto aplicado</span>
                      <span className="font-semibold">-R$ {descontoAplicado.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  <hr />
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total</span>
                    <span>
                      {formData.formaPagamento === 'Cartão de Crédito' ? (
                        parcelas === 1 ? (
                          `R$ ${(valorFinal * 0.95).toFixed(2).replace('.', ',')}`
                        ) : parcelas > 3 ? (
                          `R$ ${valorComJuros.toFixed(2).replace('.', ',')}`
                        ) : (
                          `R$ ${valorFinal.toFixed(2).replace('.', ',')}`
                        )
                      ) : (
                        `R$ ${valorFinal.toFixed(2).replace('.', ',')}`
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Página de Confirmação/Sucesso
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8 text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h2 className="text-4xl font-bold mb-3">🎉 Pagamento Concluído!</h2>
                <p className="text-green-100 text-xl">Sua viagem dos sonhos está confirmada!</p>
              </div>
              
              <div className="p-8">
                <div className="text-center mb-8">
                  <p className="text-gray-600 text-lg mb-6">
                    Parabéns! Seu pagamento foi processado com sucesso e sua reserva está confirmada.
                  </p>
                  
                  {numeroPedido && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 mb-8">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">🎫 Número do Pedido</p>
                        <p className="text-3xl font-bold text-gray-800 mb-2">{numeroPedido}</p>
                        <p className="text-sm text-green-600">Guarde este número para futuras consultas</p>
                      </div>
                    </div>
                  )}

                  {/* Resumo da compra */}
                  <div className="bg-blue-50 rounded-xl p-6 mb-8">
                    <h3 className="font-bold text-xl text-gray-800 mb-6">📋 Resumo da Sua Viagem</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">🏨 Pacote:</span>
                          <span className="font-semibold">{pacoteData?.titulo || tituloFromQuery}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">📅 Check-in:</span>
                          <span className="font-semibold">{formData.data ? new Date(formData.data).toLocaleDateString('pt-BR') : '-'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">📅 Check-out:</span>
                          <span className="font-semibold">{formData.dataVolta ? new Date(formData.dataVolta).toLocaleDateString('pt-BR') : '-'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">👥 Pessoas:</span>
                          <span className="font-semibold">{formData.quantidadePessoas}</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">💳 Pagamento:</span>
                          <span className="font-semibold">{formData.formaPagamento}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">⏱️ Duração:</span>
                          <span className="font-semibold">{duracaoCalculada || pacoteData?.duracao || duracaoFromQuery} dias</span>
                        </div>
                        <hr className="my-3"/>
                        <div className="flex justify-between items-center text-xl">
                          <span className="text-gray-800 font-bold">💰 Total Pago:</span>
                          <span className="font-bold text-green-600">R$ {valorFinal.toFixed(2).replace('.', ',')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <button
                      onClick={() => navigate('/')}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 px-6 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                    >
                      🏠 Voltar para Página Inicial
                    </button>
                    
                    <button
                      onClick={() => navigate('/reservas')}
                      className="w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-4 px-6 rounded-lg font-semibold transition-all transform hover:scale-105"
                    >
                      📋 Ver Minhas Reservas
                    </button>
                  </div>
                    
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      📧 <strong>Importante:</strong> Um e-mail de confirmação será enviado para <strong>{formData.email}</strong> com todos os detalhes da sua viagem e instruções para o check-in.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Pagamento = (props: PagamentoProps) => (
  <StripeProvider>
    <PagamentoSimples {...props} />
  </StripeProvider>
);

export default Pagamento;
