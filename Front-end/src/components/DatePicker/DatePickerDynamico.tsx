import React, { useState, useEffect } from 'react';

interface DatePickerDinamicoProps {
  valorDiaria: number;
  quantidadePessoas: number;
  duracaoPacote: number;
  onDataChange: (dataInicio: string, dataFim: string, valorTotal: number) => void;
  dataInicialSugerida?: string;
}

interface OpcaoData {
  dataInicio: string;
  dataFim: string;
  noites: number;
  valorTotal: number;
  desconto?: number;
  popular?: boolean;
}

const DatePickerDinamico: React.FC<DatePickerDinamicoProps> = ({
  valorDiaria,
  quantidadePessoas,
  duracaoPacote,
  onDataChange,
  dataInicialSugerida
}) => {
  const [opcoesDatas, setOpcoesDatas] = useState<OpcaoData[]>([]);
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<number>(0);
  const [modoPersonalizado, setModoPersonalizado] = useState(false);
  const [dataInicioCustom, setDataInicioCustom] = useState('');
  const [dataFimCustom, setDataFimCustom] = useState('');

  // Gerar opções de datas baseadas na duração do pacote
  useEffect(() => {
    const hoje = new Date();
    const opcoes: OpcaoData[] = [];

    // Opção 1: Duração original do pacote (mais popular)
    const dataBase = dataInicialSugerida ? new Date(dataInicialSugerida) : new Date(hoje);
    if (!dataInicialSugerida) {
      dataBase.setDate(dataBase.getDate() + 30); // 30 dias no futuro
    }

    // Opção principal (duração do pacote)
    const dataFimPrincipal = new Date(dataBase);
    dataFimPrincipal.setDate(dataFimPrincipal.getDate() + duracaoPacote);
    opcoes.push({
      dataInicio: dataBase.toISOString().split('T')[0],
      dataFim: dataFimPrincipal.toISOString().split('T')[0],
      noites: duracaoPacote,
      valorTotal: valorDiaria * duracaoPacote * quantidadePessoas,
      popular: true
    });

    // Opção 2: Estadia mais curta (-2 dias)
    if (duracaoPacote > 3) {
      const nitesCurtas = duracaoPacote - 2;
      const dataFimCurta = new Date(dataBase);
      dataFimCurta.setDate(dataFimCurta.getDate() + nitesCurtas);
      opcoes.push({
        dataInicio: dataBase.toISOString().split('T')[0],
        dataFim: dataFimCurta.toISOString().split('T')[0],
        noites: nitesCurtas,
        valorTotal: valorDiaria * nitesCurtas * quantidadePessoas,
        desconto: 10 // 10% desconto por estadia menor
      });
    }

    // Opção 3: Estadia mais longa (+2 dias)
    const nitesLongas = duracaoPacote + 2;
    const dataFimLonga = new Date(dataBase);
    dataFimLonga.setDate(dataFimLonga.getDate() + nitesLongas);
    opcoes.push({
      dataInicio: dataBase.toISOString().split('T')[0],
      dataFim: dataFimLonga.toISOString().split('T')[0],
      noites: nitesLongas,
      valorTotal: valorDiaria * nitesLongas * quantidadePessoas * 0.95, // 5% desconto por estadia longa
      desconto: 5
    });

    // Opção 4: Weekend estendido (se aplicável)
    if (duracaoPacote >= 5) {
      const weekend = 4; // 4 noites para weekend estendido
      const dataFimWeekend = new Date(dataBase);
      dataFimWeekend.setDate(dataFimWeekend.getDate() + weekend);
      opcoes.push({
        dataInicio: dataBase.toISOString().split('T')[0],
        dataFim: dataFimWeekend.toISOString().split('T')[0],
        noites: weekend,
        valorTotal: valorDiaria * weekend * quantidadePessoas,
      });
    }

    setOpcoesDatas(opcoes);
    
    // Selecionar a primeira opção por padrão e notificar
    if (opcoes.length > 0) {
      const primeira = opcoes[0];
      onDataChange(primeira.dataInicio, primeira.dataFim, primeira.valorTotal);
    }
  }, [valorDiaria, quantidadePessoas, duracaoPacote, dataInicialSugerida]);

  const handleSelecaoOpcao = (index: number) => {
    setOpcaoSelecionada(index);
    const opcao = opcoesDatas[index];
    onDataChange(opcao.dataInicio, opcao.dataFim, opcao.valorTotal);
  };

  const handleDataCustomChange = () => {
    if (dataInicioCustom && dataFimCustom) {
      const inicio = new Date(dataInicioCustom);
      const fim = new Date(dataFimCustom);
      const noites = Math.ceil((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
      const valorTotal = valorDiaria * noites * quantidadePessoas;
      onDataChange(dataInicioCustom, dataFimCustom, valorTotal);
    }
  };

  const calcularDesconto = (opcao: OpcaoData) => {
    if (opcao.desconto) {
      const valorOriginal = valorDiaria * opcao.noites * quantidadePessoas;
      const desconto = valorOriginal * (opcao.desconto / 100);
      return desconto;
    }
    return 0;
  };

  const formatarData = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    });
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  if (modoPersonalizado) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Escolha suas datas</h3>
          <button
            onClick={() => setModoPersonalizado(false)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Ver opções sugeridas
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data de Início
            </label>
            <input
              type="date"
              value={dataInicioCustom}
              onChange={(e) => setDataInicioCustom(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data de Fim
            </label>
            <input
              type="date"
              value={dataFimCustom}
              onChange={(e) => setDataFimCustom(e.target.value)}
              min={dataInicioCustom || new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {dataInicioCustom && dataFimCustom && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-center">
              <p className="text-lg font-semibold text-blue-800">
                {Math.ceil((new Date(dataFimCustom).getTime() - new Date(dataInicioCustom).getTime()) / (1000 * 60 * 60 * 24))} noites
              </p>
              <p className="text-2xl font-bold text-blue-900">
                {formatarMoeda(valorDiaria * Math.ceil((new Date(dataFimCustom).getTime() - new Date(dataInicioCustom).getTime()) / (1000 * 60 * 60 * 24)) * quantidadePessoas)}
              </p>
              <p className="text-sm text-blue-600">
                Para {quantidadePessoas} {quantidadePessoas === 1 ? 'pessoa' : 'pessoas'}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleDataCustomChange}
          disabled={!dataInicioCustom || !dataFimCustom}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 px-4 rounded-lg font-medium transition-colors"
        >
          Confirmar Datas Personalizadas
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Escolha seu período</h3>
        <button
          onClick={() => setModoPersonalizado(true)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Datas personalizadas →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {opcoesDatas.map((opcao, index) => {
          const desconto = calcularDesconto(opcao);
          const isSelected = opcaoSelecionada === index;

          return (
            <div
              key={index}
              onClick={() => handleSelecaoOpcao(index)}
              className={`relative cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {opcao.popular && (
                <div className="absolute -top-2 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  Mais Popular
                </div>
              )}

              {opcao.desconto && (
                <div className="absolute -top-2 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  -{opcao.desconto}%
                </div>
              )}

              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    {opcao.noites} {opcao.noites === 1 ? 'noite' : 'noites'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatarData(opcao.dataInicio)} - {formatarData(opcao.dataFim)}
                  </span>
                </div>

                <div className="text-center">
                  {desconto > 0 && (
                    <p className="text-sm text-gray-500 line-through">
                      {formatarMoeda(valorDiaria * opcao.noites * quantidadePessoas)}
                    </p>
                  )}
                  <p className="text-xl font-bold text-gray-900">
                    {formatarMoeda(opcao.valorTotal)}
                  </p>
                  {desconto > 0 && (
                    <p className="text-sm text-green-600 font-medium">
                      Economize {formatarMoeda(desconto)}
                    </p>
                  )}
                </div>

                <div className="mt-3 text-center">
                  <span className="text-xs text-gray-500">
                    {formatarMoeda(opcao.valorTotal / quantidadePessoas)} por pessoa
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Preço por pessoa/noite:</span>
          <span className="font-medium">{formatarMoeda(valorDiaria)}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600 mt-1">
          <span>Quantidade de pessoas:</span>
          <span className="font-medium">{quantidadePessoas}</span>
        </div>
      </div>
    </div>
  );
};

export default DatePickerDinamico;
