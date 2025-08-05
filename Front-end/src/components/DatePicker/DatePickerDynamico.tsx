import React, { useState, useEffect } from 'react';

interface OpcaoData {
  dataInicio: string;
  dataFim: string;
  noites: number;
  valorTotal: number;
  popular?: boolean;
  promocional?: boolean;
  desconto?: number;
}

interface DatePickerDinamicoProps {
  valorDiaria: number;
  quantidadePessoas: number;
  duracaoPacote: number;
  dataInicialSugerida?: string;
  duracaoFixa?: boolean; 
  onDataChange: (dataInicio: string, dataFim: string, valorTotal: number, duracao: number) => void;
}

const DatePickerDinamico: React.FC<DatePickerDinamicoProps> = ({
  valorDiaria,
  quantidadePessoas,
  duracaoPacote,
  dataInicialSugerida,
  duracaoFixa = false, 
  onDataChange
}) => {
  const [opcoesDatas, setOpcoesDatas] = useState<OpcaoData[]>([]);
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<number>(0);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [dataPersonalizada, setDataPersonalizada] = useState({
    inicio: '',
    fim: ''
  });
  const [duracaoSelecionada, setDuracaoSelecionada] = useState(duracaoPacote); 

  useEffect(() => {
    const opcoes: OpcaoData[] = [];
    const hoje = new Date();
    
    const dataBase = dataInicialSugerida ? 
      new Date(dataInicialSugerida + 'T00:00:00') : 
      new Date(hoje.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 dias a partir de hoje

    if (duracaoFixa) {
      const dataFim = new Date(dataBase);
      dataFim.setDate(dataFim.getDate() + duracaoPacote);
      
      // Gerar algumas opções com datas diferentes mas mesma duração
      for (let i = 0; i < 3; i++) {
        const dataInicioOpcao = new Date(dataBase);
        dataInicioOpcao.setDate(dataInicioOpcao.getDate() + i * 2); // Espaçar de 2 em 2 dias
        
        const dataFimOpcao = new Date(dataInicioOpcao);
        dataFimOpcao.setDate(dataFimOpcao.getDate() + duracaoPacote);
        
        opcoes.push({
          dataInicio: dataInicioOpcao.toISOString().split('T')[0],
          dataFim: dataFimOpcao.toISOString().split('T')[0],
          noites: duracaoPacote,
          valorTotal: valorDiaria * duracaoPacote * quantidadePessoas,
          popular: i === 0 // Primeira opção como popular
        });
      }
    } else {
      
      // Opção 1: Duração original do pacote (mais popular)
      const dataFimOriginal = new Date(dataBase);
      dataFimOriginal.setDate(dataFimOriginal.getDate() + duracaoPacote);
      opcoes.push({
        dataInicio: dataBase.toISOString().split('T')[0],
        dataFim: dataFimOriginal.toISOString().split('T')[0],
        noites: duracaoPacote,
        valorTotal: valorDiaria * duracaoPacote * quantidadePessoas,
        popular: true
      });

      // Opção 2: +2 dias
      const nitesMais2 = duracaoPacote + 2;
      const dataFimMais2 = new Date(dataBase);
      dataFimMais2.setDate(dataFimMais2.getDate() + nitesMais2);
      opcoes.push({
        dataInicio: dataBase.toISOString().split('T')[0],
        dataFim: dataFimMais2.toISOString().split('T')[0],
        noites: nitesMais2,
        valorTotal: valorDiaria * nitesMais2 * quantidadePessoas * 0.95, // 5% desconto
        desconto: 5
      });

      // Opção 3: +4 dias
      const nitesMais4 = duracaoPacote + 4;
      const dataFimMais4 = new Date(dataBase);
      dataFimMais4.setDate(dataFimMais4.getDate() + nitesMais4);
      opcoes.push({
        dataInicio: dataBase.toISOString().split('T')[0],
        dataFim: dataFimMais4.toISOString().split('T')[0],
        noites: nitesMais4,
        valorTotal: valorDiaria * nitesMais4 * quantidadePessoas * 0.90, // 10% desconto
        desconto: 10
      });

      // Opção 4: +6 dias
      const nitesMais6 = duracaoPacote + 6;
      const dataFimMais6 = new Date(dataBase);
      dataFimMais6.setDate(dataFimMais6.getDate() + nitesMais6);
      opcoes.push({
        dataInicio: dataBase.toISOString().split('T')[0],
        dataFim: dataFimMais6.toISOString().split('T')[0],
        noites: nitesMais6,
        valorTotal: valorDiaria * nitesMais6 * quantidadePessoas * 0.85, // 15% desconto
        desconto: 15
      });
    }

    setOpcoesDatas(opcoes);
    
    if (opcoes.length > 0) {
      const primeira = opcoes[0];
      setDuracaoSelecionada(primeira.noites); 
      onDataChange(primeira.dataInicio, primeira.dataFim, primeira.valorTotal, primeira.noites);
    }
  }, [valorDiaria, quantidadePessoas, duracaoPacote, dataInicialSugerida, duracaoFixa]);

  const calcularDesconto = (opcao: OpcaoData) => {
    if (opcao.desconto) return opcao.desconto;
    if (opcao.promocional) return 5;
    if (opcao.noites > duracaoPacote + 2) return 10;
    return 0;
  };

  const formatarData = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const handleSelecaoOpcao = (index: number) => {
    setOpcaoSelecionada(index);
    const opcao = opcoesDatas[index];
    console.log('Selecionando opção:', { index, noites: opcao.noites, duracaoAnterior: duracaoSelecionada });
    setDuracaoSelecionada(opcao.noites); // Atualizar duração selecionada
    onDataChange(opcao.dataInicio, opcao.dataFim, opcao.valorTotal, opcao.noites);
  };

  const getTipoEstadia = (noites: number) => {
    if (noites === duracaoPacote) return "Pacote Original";
    if (noites === duracaoPacote + 2) return "Pacote +2 dias";
    if (noites === duracaoPacote + 4) return "Pacote +4 dias";
    if (noites === duracaoPacote + 6) return "Pacote +6 dias";
    return "Personalizado";
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-800">
          {duracaoFixa ? "Escolha suas datas" : "Opções de Estadia"}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {opcoesDatas.map((opcao, index) => {
          const desconto = calcularDesconto(opcao);
          const tipoEstadia = getTipoEstadia(opcao.noites);
          
          return (
            <div
              key={index}
              onClick={() => handleSelecaoOpcao(index)}
              className={`relative cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                opcaoSelecionada === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              {opcao.popular && (
                <div className="absolute -top-2 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  POPULAR
                </div>
              )}
              
              {opcao.promocional && (
                <div className="absolute -top-2 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  OFERTA
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {opcao.noites} noite{opcao.noites !== 1 ? 's' : ''} • {tipoEstadia}
                    </p>
                    <div className="text-sm text-gray-500 mt-1">
                      <p>Check-in: {formatarData(opcao.dataInicio)}</p>
                      <p>Check-out: {formatarData(opcao.dataFim)}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {desconto > 0 && (
                      <div className="flex items-center gap-1 text-green-600 text-xs mb-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        {desconto}% OFF
                      </div>
                    )}
                    <p className="text-lg font-bold text-gray-800">
                      {formatarMoeda(opcao.valorTotal)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatarMoeda(opcao.valorTotal / opcao.noites)}/noite
                    </p>
                  </div>
                </div>

                {opcao.popular && (
                  <div className="flex items-center gap-1 text-yellow-600 text-xs">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    Escolha mais popular
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!duracaoFixa && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {!showCustomDatePicker ? (
            <button
              onClick={() => setShowCustomDatePicker(true)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              + Escolher datas personalizadas
            </button>
          ) : (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Datas Personalizadas</h4>
              <p className="text-sm text-gray-600">Escolha sua data de check-in. A duração será baseada na opção selecionada acima ({duracaoSelecionada} {duracaoSelecionada === 1 ? 'dia' : 'dias'}).</p>
              
              {/* Seletor de data com duração baseada na opção escolhida */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Escolher data de check-in ({duracaoSelecionada} {duracaoSelecionada === 1 ? 'dia' : 'dias'})
                </h5>
                
                <input
                  type="date"
                  value={dataPersonalizada.inicio}
                  onChange={(e) => {
                    const novaDataIda = e.target.value;
                    console.log('Selecionando data personalizada:', { 
                      data: novaDataIda, 
                      duracaoAtual: duracaoSelecionada,
                      duracaoPacote: duracaoPacote 
                    });
                    
                    const dataIdaObj = new Date(novaDataIda + 'T00:00:00');
                    const dataFimCalculada = new Date(dataIdaObj);
                    dataFimCalculada.setDate(dataIdaObj.getDate() + duracaoSelecionada);
                    const dataFimFormatada = dataFimCalculada.toISOString().split('T')[0];
                    
                    setDataPersonalizada({
                      inicio: novaDataIda,
                      fim: dataFimFormatada
                    });

                    const valorBase = valorDiaria * duracaoSelecionada * quantidadePessoas;
                    let valorComDesconto = valorBase;
                    
                    if (duracaoSelecionada === duracaoPacote + 2) {
                      valorComDesconto = valorBase * 0.95; // 5% desconto
                    } else if (duracaoSelecionada === duracaoPacote + 4) {
                      valorComDesconto = valorBase * 0.90; // 10% desconto
                    } else if (duracaoSelecionada === duracaoPacote + 6) {
                      valorComDesconto = valorBase * 0.85; // 15% desconto
                    }

                    console.log('Cálculo auomático:', { 
                      valorBase, 
                      valorComDesconto, 
                      duracaoUsada: duracaoSelecionada 
                    });

                    onDataChange(novaDataIda, dataFimFormatada, valorComDesconto, duracaoSelecionada);
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
                
                {dataPersonalizada.inicio && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-700">
                        <strong>Check-in:</strong> {new Date(dataPersonalizada.inicio + 'T00:00:00').toLocaleDateString('pt-BR')}
                      </span>
                      <span className="text-blue-700">
                        <strong>Check-out:</strong> {new Date(dataPersonalizada.fim + 'T00:00:00').toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="text-center mt-2">
                      <span className="text-blue-800 font-semibold">{duracaoSelecionada} {duracaoSelecionada === 1 ? 'dia' : 'dias'} de viagem</span>
                      {(() => {
                        // Calcular valor com desconto baseado na duração selecionada
                        const valorBase = valorDiaria * duracaoSelecionada * quantidadePessoas;
                        let valorComDesconto = valorBase;
                        let percentualDesconto = 0;
                        
                        if (duracaoSelecionada === duracaoPacote + 2) {
                          valorComDesconto = valorBase * 0.95; // 5% desconto
                          percentualDesconto = 5;
                        } else if (duracaoSelecionada === duracaoPacote + 4) {
                          valorComDesconto = valorBase * 0.90; // 10% desconto
                          percentualDesconto = 10;
                        } else if (duracaoSelecionada === duracaoPacote + 6) {
                          valorComDesconto = valorBase * 0.85; // 15% desconto
                          percentualDesconto = 15;
                        }
                        
                        return (
                          <div className="space-y-1">
                            {percentualDesconto > 0 && (
                              <div className="flex items-center justify-center gap-1 text-green-600 text-xs">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                {percentualDesconto}% OFF aplicado!
                              </div>
                            )}
                            <div className="text-green-700 font-bold">
                              {formatarMoeda(valorComDesconto)}
                              {percentualDesconto > 0 && (
                                <span className="text-xs text-gray-500 ml-2 line-through">
                                  {formatarMoeda(valorBase)}
                                </span>
                              )}
                            </div>
                            {percentualDesconto > 0 && (
                              <div className="text-xs text-green-600 font-medium">
                                Economia de {formatarMoeda(valorBase - valorComDesconto)}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DatePickerDinamico;
