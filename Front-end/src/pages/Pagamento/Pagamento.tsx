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
  pacoteId?: number; // pode vir como prop
}

// Função para extrair parâmetros da URL
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

// Componente principal que será envolvido pelo StripeProvider
const PagamentoConteudo = ({ pacoteId: propPacoteId }: PagamentoProps) => {
  const query = useQuery();
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  // Acesse o contexto do Stripe no nível superior do componente
  const stripeContext = useStripeContext();
  
  // Extrair parâmetros da URL e state
  const pacoteIdFromQuery = query.get('pacoteId');
  const reservaIdFromState = location.state?.reservaId;
  const tituloFromQuery = query.get('titulo');
  const valorFromQuery = query.get('valor');
  const pessoasFromQuery = query.get('pessoas');
  const dataIdaFromQuery = query.get('dataIda');
  const dataVoltaFromQuery = query.get('dataVolta');
  const duracaoFromQuery = query.get('duracao');
  
  const [activeTab, setActiveTab] = useState('dados'); // 'dados', 'pagamento', 'confirmacao', 'sucesso'
  const [formData, setFormData] = useState({
    data: dataIdaFromQuery || '',
    quantidadePessoas: pessoasFromQuery || '',
    desconto: '',
    formaPagamento: 'PIX' as 'PIX' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Boleto',
    nome: '',
    email: '',
    telefone: '',
    cpf: ''
  });

  // Atualizar formData quando o usuário mudar (login/logout)
  useEffect(() => {
    if (usuario) {
      setFormData(prev => ({
        ...prev,
        nome: usuario.nome || '',
        email: usuario.email || '',
        telefone: usuario.telefone || '',
        cpf: usuario.cpfPassaporte || ''
      }));
    } else {
      // Limpar dados se usuário fizer logout
      setFormData(prev => ({
        ...prev,
        nome: '',
        email: '',
        telefone: '',
        cpf: ''
      }));
    }
  }, [usuario]);

  const [pacoteData, setPacoteData] = useState<DadosPacote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parcelamento, setParcelamento] = useState({ valorParcela: 0, parcelas: 3 });
  const [descontoAplicado, setDescontoAplicado] = useState<number>(0);
  const [codigoPagamento, setCodigoPagamento] = useState<string>('');
  const [numeroPedido, setNumeroPedido] = useState<string>('');

  // Usar o ID do pacote da URL ou dos props, com fallback para 3
  const pacoteId = Number(pacoteIdFromQuery) || propPacoteId || 3;
  
  // Usar o ID do usuário autenticado ou permitir compra como convidado
  const usuarioId = usuario?.usuarioId?.toString() || "1"; // Usar ID 1 como convidado

  // Debug: mostrar reservaId recebida
  useEffect(() => {
    if (reservaIdFromState) {
      console.log('ReservaId recebida para pagamento:', reservaIdFromState);
    }
  }, [reservaIdFromState]);

  useEffect(() => {
    if (pacoteId) {
      carregarDadosPacote();
    } else if (!pacoteIdFromQuery) {
      // Se não tiver pacoteId nem na URL nem nos props, mostrar alerta e voltar
      alert('Nenhum pacote foi selecionado. Por favor, escolha um pacote primeiro.');
      navigate('/pacotes');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pacoteId]);

  useEffect(() => {
    // calcular o parcelamento
    if (pacoteData) {
      // Garantir que estamos usando o valor exato do pacote
      const valorPacote = pacoteData.valorTotal;
      console.log("Calculando parcelamento. Valor do pacote:", valorPacote);
      
      const valorFinal = valorPacote - descontoAplicado;
      setParcelamento({
        valorParcela: valorFinal / 3,
        parcelas: 3
      });
    }
  }, [pacoteData, descontoAplicado]);

  const carregarDadosPacote = async () => {
    try {
      setLoading(true);
      
      // Se temos valores da URL, podemos construir um objeto de pacote parcial
      if (valorFromQuery && tituloFromQuery && duracaoFromQuery && pessoasFromQuery) {
        // Converter valor para número com precisão - garantir que usamos o valor exato
        // Para evitar problemas com formatações ou conversões implícitas
        const valorExato = parseFloat(valorFromQuery);
        
        console.log("Valor recebido da URL (original):", valorFromQuery);
        console.log("Valor convertido para número:", valorExato);
        
        // Usar dados da URL para evitar chamada à API desnecessária
        const dadosFromURL: DadosPacote = {
          pacoteId: Number(pacoteIdFromQuery) || 0,
          titulo: tituloFromQuery || '',
          descricao: '',
          destino: '',
          duracao: Number(duracaoFromQuery) || 0,
          quantidadeDePessoas: Number(pessoasFromQuery) || 1,
          valorTotal: valorExato // Usar o valor exato
        };
        
        console.log("Dados do pacote da URL:", {
          id: dadosFromURL.pacoteId,
          titulo: dadosFromURL.titulo,
          valor: dadosFromURL.valorTotal,
          pessoas: dadosFromURL.quantidadeDePessoas,
          duracao: dadosFromURL.duracao
        });
        
        setPacoteData(dadosFromURL);
      } else {
        // Caso contrário, buscamos da API
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  //desconto
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
   // Integração com Stripe Context
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);

  // Iniciar o processo de pagamento com Stripe
  const iniciarProcessoDePagamento = async () => {
    if (!pacoteData) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('💰 Iniciando processo de pagamento:', {
        valor: pacoteData.valorTotal - descontoAplicado,
        pacoteId,
        descontoAplicado
      });
      
      // Iniciar o intent de pagamento através do contexto do Stripe
      await stripeContext.iniciarPagamento(
        pacoteData.valorTotal - descontoAplicado, 
        pacoteId
      );
      
      // Avançar para a aba de pagamento
      setActiveTab('pagamento');
    } catch (err) {
      console.error('❌ Erro ao iniciar processo de pagamento:', err);
      setError('Não foi possível iniciar o processo de pagamento');
    } finally {
      setLoading(false);
    }
  };

  // Lidar com sucesso no pagamento
  const handlePaymentSuccess = (paymentMethodId: string) => {
    setPaymentMethodId(paymentMethodId);
    setActiveTab('confirmacao');
  };

  // Lidar com erro no pagamento
  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  // Finalizar o processo de pagamento
  const handlePagar = async () => {
    if (!formData.data || !formData.quantidadePessoas || !formData.nome || !formData.email) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (formData.formaPagamento === 'Cartão de Crédito' && !paymentMethodId) {
      setError('Processamento do cartão de crédito incompleto');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Se for cartão de crédito e temos o paymentMethodId, criar a reserva agora
      if (formData.formaPagamento === 'Cartão de Crédito' && paymentMethodId) {
        // Usar o stripeContext que foi definido no nível superior do componente
        
        // Criar a reserva usando o paymentIntentId que já foi processado pelo Stripe
        const reservaCriada = await stripeContext.confirmarPagamentoCompleto(
          paymentMethodId,
          {
            pacoteId,
            dataViagem: formData.data,
            dataInicio: formData.data, 
            dataFim: formData.data, // A duração será calculada no backend
            quantidadePessoas: parseInt(formData.quantidadePessoas)
          }
        );
        
        if (reservaCriada) {
          // Mostrar feedback de sucesso
          setActiveTab('sucesso');
          
          // Gerar um número de pedido aleatório para exibição
          setNumeroPedido(`PED${Date.now().toString().substring(6)}`);
        } else {
          setError('Erro ao criar a reserva. Entre em contato com nosso suporte.');
        }
      } 
      // Para outras formas de pagamento, seguir o fluxo original
      else {
        const dadosPagamento: DadosPagamento = {
          data: formData.data,
          quantidadePessoas: parseInt(formData.quantidadePessoas),
          desconto: formData.desconto || undefined,
          formaPagamento: formData.formaPagamento,
          pacoteId,
          usuarioId: usuarioId,
          paymentMethodId: paymentMethodId || undefined
        };

        // Processar o pagamento e mostrar feedback apropriado
        const resultado = await processarPagamento(dadosPagamento);
        
        console.log('✅ Resultado do processamento:', resultado);
        
        if (resultado.status === 'aprovado') {
          // Mostrar feedback de sucesso
          setActiveTab('sucesso');
          
          // Se temos um código de pagamento, podemos mostrá-lo
          if (resultado.codigoPagamento) {
            setCodigoPagamento(resultado.codigoPagamento);
          }
          
          // Gerar um número de pedido aleatório para exibição
          setNumeroPedido(`PED${Date.now().toString().substring(6)}`);
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

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Mostrar informação do usuário se logado */}
        {usuario && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
            <strong className="font-bold">👋 Olá, {usuario.nome}!</strong>
            <span className="block sm:inline"> Seus dados foram preenchidos automaticamente. </span>
          </div>
        )}

        {/* Header com abas */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('dados')}
              className={`px-6 py-4 text-sm font-medium rounded-tl-lg ${
                activeTab === 'dados'
                  ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              📝 Dados da Reserva
            </button>
            <button
              onClick={() => setActiveTab('pagamento')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'pagamento'
                  ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              disabled={activeTab === 'sucesso'}
            >
              💳 Forma de Pagamento
            </button>
            <button
              onClick={() => setActiveTab('confirmacao')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'confirmacao'
                  ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              disabled={activeTab === 'sucesso'}
            >
              ✅ Confirmação
            </button>
            {activeTab === 'sucesso' && (
              <button
                className="px-6 py-4 text-sm font-medium bg-green-600 text-white border-b-2 border-green-600"
              >
                🎉 Pagamento Concluído
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conteúdo principal */}
          <div className="lg:col-span-2">
            {/* Exibir erro se houver */}
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {activeTab === 'dados' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Dados da Reserva</h2>
                
                <div className="space-y-4">
                  {/* Data e Quantidade de Pessoas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Data da Viagem</label>
                      <input
                        type="date"
                        name="data"
                        value={formData.data}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Quantidade de Pessoas</label>
                      <input
                        type="number"
                        name="quantidadePessoas"
                        value={formData.quantidadePessoas}
                        onChange={handleInputChange}
                        placeholder="Digite a quantidade"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  {/* Dados Pessoais */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Nome Completo</label>
                      <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Digite seu nome completo"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">E-mail</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Telefone</label>
                      <input
                        type="tel"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="(11) 99999-9999"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">CPF</label>
                      <input
                        type="text"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="000.000.000-00"
                        required
                      />
                    </div>
                  </div>

                  {/* Desconto */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Código de Desconto</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="desconto"
                        value={formData.desconto}
                        onChange={handleInputChange}
                        placeholder="Digite seu código de desconto"
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={handleAplicarDesconto}
                        disabled={!formData.desconto || loading}
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition duration-300"
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pagamento' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Forma de Pagamento</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(['PIX', 'Cartão de Crédito', 'Cartão de Débito', 'Boleto'] as const).map((forma) => (
                      <button
                        key={forma}
                        onClick={() => setFormData(prev => ({ ...prev, formaPagamento: forma }))}
                        className={`p-4 border-2 rounded-lg text-center transition duration-300 ${
                          formData.formaPagamento === forma
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">
                          {forma === 'PIX' && '🏦'}
                          {forma === 'Cartão de Crédito' && '💳'}
                          {forma === 'Cartão de Débito' && '💳'}
                          {forma === 'Boleto' && '📄'}
                        </div>
                        <div className="text-sm font-medium">{forma}</div>
                      </button>
                    ))}
                  </div>

                  {formData.formaPagamento === 'Cartão de Crédito' && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-bold text-gray-800 mb-4">Dados do Cartão</h3>
                      
                      {stripeContext.clientSecret ? (
                        // Usar o formulário real do Stripe quando temos um client secret válido
                        <StripeCardForm 
                          clientSecret={stripeContext.clientSecret}
                          valorTotal={pacoteData?.valorTotal || 0}
                          pacoteId={pacoteId}
                          dataViagem={formData.data}
                          dataInicio={dataIdaFromQuery || formData.data}
                          dataFim={dataVoltaFromQuery || formData.data}
                          quantidadePessoas={parseInt(formData.quantidadePessoas) || 1}
                          onPaymentSuccess={handlePaymentSuccess}
                          onPaymentError={handlePaymentError}
                        />
                      ) : (
                        <div className="text-center p-4">
                          {stripeContext.loading ? (
                            <div className="flex flex-col items-center">
                              <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <p>Carregando formulário de pagamento...</p>
                            </div>
                          ) : (
                            <>
                              <p className="mb-4">Clique no botão abaixo para configurar seu pagamento com cartão</p>
                              <button
                                onClick={() => iniciarProcessoDePagamento()}
                                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                Configurar pagamento
                              </button>
                            </>
                          )}
                        </div>
                      )}
                      
                      <div className="text-center mt-4">
                        <div className="text-lg font-bold text-blue-600">
                          {parcelamento.parcelas} × R$ {parcelamento.valorParcela.toFixed(2).replace('.', ',')}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'confirmacao' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Confirmação dos Dados</h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Dados da Reserva</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Data:</span> {formData.data || 'Não informado'}</p>
                      <p><span className="font-medium">Pessoas:</span> {formData.quantidadePessoas || 'Não informado'}</p>
                      <p><span className="font-medium">Nome:</span> {formData.nome || 'Não informado'}</p>
                      <p><span className="font-medium">E-mail:</span> {formData.email || 'Não informado'}</p>
                      <p><span className="font-medium">Telefone:</span> {formData.telefone || 'Não informado'}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Forma de Pagamento</h3>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">{formData.formaPagamento}</span>
                      {formData.formaPagamento === 'Cartão de Crédito' && 
                        ` - ${parcelamento.parcelas}x de R$ ${parcelamento.valorParcela.toFixed(2)}`
                      }
                    </p>
                  </div>

                  <button
                    onClick={handlePagar}
                    disabled={loading || !formData.data || !formData.quantidadePessoas || !formData.nome || !formData.email}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg transition duration-300 disabled:bg-gray-300"
                  >
                    {loading ? 'Processando...' : 'Finalizar Pagamento'}
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'sucesso' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-20 h-20 mb-6 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Pagamento Concluído!</h2>
                  <p className="text-gray-600 text-center mb-6">
                    Seu pagamento foi processado com sucesso. Agradecemos pela sua compra!
                  </p>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 w-full max-w-md mb-6">
                    <div className="text-center">
                      {numeroPedido && (
                        <div className="mb-2">
                          <p className="text-sm text-gray-600">Número do Pedido</p>
                          <p className="text-lg font-bold text-gray-800">{numeroPedido}</p>
                        </div>
                      )}
                      
                      {codigoPagamento && (
                        <div>
                          <p className="text-sm text-gray-600">Código de Confirmação</p>
                          <p className="text-lg font-bold text-gray-800">{codigoPagamento}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4 w-full">
                    <button
                      onClick={() => navigate('/')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                      Voltar para Página Inicial
                    </button>
                    
                    <button
                      onClick={() => navigate('/reservas')}
                      className="w-full bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                      Ver Minhas Reservas
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Resumo da compra */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              {/* Card do pacote */}
              <div className="mb-6">
                {loading ? (
                  <div className="bg-gray-200 h-32 rounded-lg flex items-center justify-center">
                    <div className="text-gray-600">Carregando...</div>
                  </div>
                ) : pacoteData ? (
                  <div className="text-center">
                    <div className="bg-gray-200 h-24 rounded-lg flex items-center justify-center mb-3">
                      <div className="text-center text-gray-600">
                        <div className="font-bold text-lg">{pacoteData.titulo}</div>
                        <div className="text-sm">{pacoteData.destino || 'Destino incrível'}</div>
                      </div>
                    </div>
                  </div>
                ) : tituloFromQuery ? (
                  <div className="text-center">
                    <div className="bg-gray-200 h-24 rounded-lg flex items-center justify-center mb-3">
                      <div className="text-center text-gray-600">
                        <div className="font-bold text-lg">{tituloFromQuery}</div>
                        <div className="text-sm">Pacote selecionado</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-200 h-32 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-600">
                      <div className="font-medium">Nome do pacote</div>
                      <div className="text-sm mt-1">localização</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Resumo do preço */}
              <div className="bg-cyan-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600">
                  {descontoAplicado > 0 ? `Economize R$ ${descontoAplicado.toFixed(2)}` : 'Melhor preço garantido'}
                </p>
                <p className="text-sm text-gray-600">
                  Por pessoa R$ {pacoteData ? (pacoteData.valorTotal / (pacoteData.quantidadeDePessoas || 1)).toFixed(2).replace('.', ',') : '654'}
                </p>
                <p className="text-2xl font-bold text-cyan-600">
                  {pacoteData ? `R$ ${(pacoteData.valorTotal - descontoAplicado).toFixed(2).replace('.', ',')}` : 'R$ 593'}
                </p>
                
                <p className="text-xs text-gray-500">Duração: {pacoteData?.duracao || '-'} dias</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pacote</span>
                  <span className="font-semibold">
                    {pacoteData ? `R$ ${pacoteData.valorTotal.toFixed(2).replace('.', ',')}` : 'R$ 593'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Preço por pessoa</span>
                  <span className="font-semibold">
                    {pacoteData ? `R$ ${(pacoteData.valorTotal / (pacoteData.quantidadeDePessoas || 1)).toFixed(2).replace('.', ',')}` : 'R$ 593'}
                  </span>
                </div>
                {descontoAplicado > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Desconto aplicado</span>
                    <span className="font-semibold">-R$ {descontoAplicado.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setActiveTab('confirmacao')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 mb-3"
              >
                Continuar
              </button>

              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente wrapper com StripeProvider
function Pagamento(props: PagamentoProps) {
  return (
    <StripeProvider>
      <PagamentoConteudo {...props} />
    </StripeProvider>
  );
}

export default Pagamento;
