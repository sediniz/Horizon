import React, { useState, useEffect } from 'react';
import { 
  processarPagamento, 
  buscarDadosPacote, 
  aplicarDesconto
} from '../../api';
import type { DadosPagamento, DadosPacote } from '../../api';

interface PagamentoProps {
  pacoteId?: number; // pode vir como prop
}

function Pagamento({ pacoteId: propPacoteId }: PagamentoProps) {
  const [activeTab, setActiveTab] = useState('dados');
  const [formData, setFormData] = useState({
    data: '',
    quantidadePessoas: '',
    desconto: '',
    formaPagamento: 'PIX' as 'PIX' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Boleto',
    nome: '',
    email: '',
    telefone: '',
    cpf: ''
  });

  const [pacoteData, setPacoteData] = useState<DadosPacote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parcelamento, setParcelamento] = useState({ valorParcela: 0, parcelas: 3 });
  const [descontoAplicado, setDescontoAplicado] = useState<number>(0);

  const pacoteId = propPacoteId || 3; // fazer para pegar dinamico em vez de setado
  const usuarioId = "usuario-exemplo-456"; // corrigir quando fazer o user ficar logado

  useEffect(() => {
    if (pacoteId) {
      carregarDadosPacote();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pacoteId]);

  useEffect(() => {
    // calcular o parcelamento
    if (pacoteData) {
      const valorFinal = pacoteData.valorTotal - descontoAplicado;
      setParcelamento({
        valorParcela: valorFinal / 3,
        parcelas: 3
      });
    }
  }, [pacoteData, descontoAplicado]);

  const carregarDadosPacote = async () => {
    try {
      setLoading(true);
      const dados = await buscarDadosPacote(pacoteId);
      setPacoteData(dados);
    } catch {
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
   //pagar
  const handlePagar = async () => {
    if (!formData.data || !formData.quantidadePessoas || !formData.nome || !formData.email) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const dadosPagamento: DadosPagamento = {
        data: formData.data,
        quantidadePessoas: parseInt(formData.quantidadePessoas),
        desconto: formData.desconto || undefined,
        formaPagamento: formData.formaPagamento,
        pacoteId,
        usuarioId
      };

      const resultado = await processarPagamento(dadosPagamento);
      
      if (resultado.status === 'aprovado') {
        alert('Pagamento processado com sucesso!');
      } else {
        setError('Pagamento não foi aprovado. Tente novamente.');
      }
    } catch {
      setError('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
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
            >
              ✅ Confirmação
            </button>
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
                      <h3 className="font-bold text-gray-800 mb-4">Parcelamento</h3>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {parcelamento.parcelas} × R$ {parcelamento.valorParcela.toFixed(2)}
                        </div>
                        <button className="text-blue-600 text-sm underline mt-1">
                          alterar parcelamento
                        </button>
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
                        <div className="text-sm">{pacoteData.destino}</div>
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
                  Por pessoa R$ {pacoteData ? (pacoteData.valorTotal / (pacoteData.quantidadeDePessoas || 1)).toFixed(2) : '654'}
                </p>
                <p className="text-2xl font-bold text-cyan-600">
                  {pacoteData ? `R$ ${(pacoteData.valorTotal - descontoAplicado).toFixed(2)}` : 'R$ 593'}
                </p>
               
                <p className="text-xs text-gray-500">Duração: {pacoteData?.duracao || '-'} dias</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pacote</span>
                  <span className="font-semibold">
                    {pacoteData ? `R$ ${pacoteData.valorTotal.toFixed(2)}` : 'R$ 593'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Preço por pessoa</span>
                  <span className="font-semibold">
                    {pacoteData ? `R$ ${(pacoteData.valorTotal / (pacoteData.quantidadeDePessoas || 1)).toFixed(2)}` : 'R$ 593'}
                  </span>
                </div>
                {descontoAplicado > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Desconto aplicado</span>
                    <span className="font-semibold">-R$ {descontoAplicado.toFixed(2)}</span>
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

export default Pagamento;
