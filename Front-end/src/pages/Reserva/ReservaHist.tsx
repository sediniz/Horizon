import { useState } from 'react';

export default function ReservaHist() {
  const [filtroStatus, setFiltroStatus] = useState('todas');
  const [filtroData, setFiltroData] = useState('todas');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState<number | null>(null);
  const [cancelData, setCancelData] = useState({
    nome: '',
    data: '',
    motivo: '',
    motivoPersonalizado: ''
  });

  const motivosCancelamento = [
    'Mudança de planos pessoais',
    'Problemas de saúde',
    'Questões financeiras',
    'Conflito de agenda',
    'Insatisfação com o serviço',
    'Condições climáticas desfavoráveis',
    'Outro motivo'
  ];

  const handleCancelClick = (reservaId: number) => {
    setSelectedReserva(reservaId);
    setShowCancelModal(true);
    setCancelData({
      nome: '',
      data: '',
      motivo: '',
      motivoPersonalizado: ''
    });
  };

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelData.nome || !cancelData.data || !cancelData.motivo) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    if (cancelData.motivo === 'Outro motivo' && !cancelData.motivoPersonalizado) {
      alert('Por favor, descreva o motivo do cancelamento.');
      return;
    }
    
    // Encontrar a reserva sendo cancelada
    const reserva = reservas.find(r => r.id === selectedReserva);
    const reservaInfo = reserva ? `${reserva.hotel} - ${reserva.destino}` : 'Reserva';
    
    // Aqui você implementaria a lógica de cancelamento
    alert(`Solicitação de cancelamento para ${reservaInfo} enviada com sucesso!`);
    setShowCancelModal(false);
    setSelectedReserva(null);
  };

  const handleCancelDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCancelData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const reservas = [
    {
      id: 1,
      codigo: "HZ2025001",
      destino: "Rio de Janeiro",
      hotel: "Rede Andrade Lapa Hotel",
      dataViagem: "10/08/2025 - 17/08/2025",
      dataReserva: "15/07/2025",
      status: "confirmada",
      valor: 1186,
      pessoas: 2,
      imagem: "/src/assets/img1.jpeg",
      voo: "GRU → GIG",
      avaliacao: 8.3,
      estrelas: 3
    },
    {
      id: 2,
      codigo: "HZ2025002",
      destino: "Copacabana",
      hotel: "Américas Copacabana Hotel",
      dataViagem: "25/09/2025 - 02/10/2025",
      dataReserva: "10/08/2025",
      status: "pendente",
      valor: 2120,
      pessoas: 2,
      imagem: "/src/assets/img2.png",
      voo: "GRU → GIG",
      avaliacao: 8.2,
      estrelas: 4
    },
    {
      id: 3,
      codigo: "HZ2024012",
      destino: "Fernando de Noronha",
      hotel: "Hotel Paradise Island",
      dataViagem: "15/12/2024 - 22/12/2024",
      dataReserva: "20/11/2024",
      status: "concluida",
      valor: 3500,
      pessoas: 2,
      imagem: "/src/assets/Praia01.png",
      voo: "GRU → FEN",
      avaliacao: 9.1,
      estrelas: 5
    },
    {
      id: 4,
      codigo: "HZ2024008",
      destino: "Paris",
      hotel: "Hotel Le Marais",
      dataViagem: "05/06/2024 - 15/06/2024",
      dataReserva: "20/04/2024",
      status: "cancelada",
      valor: 4200,
      pessoas: 2,
      imagem: "/src/assets/Paris2.png",
      voo: "GRU → CDG",
      avaliacao: 8.8,
      estrelas: 4
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmada':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pendente':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'concluida':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'cancelada':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmada':
        return 'Confirmada';
      case 'pendente':
        return 'Pendente';
      case 'concluida':
        return 'Concluída';
      case 'cancelada':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const reservasFiltradas = reservas.filter(reserva => {
    if (filtroStatus !== 'todas' && reserva.status !== filtroStatus) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-600 to-cyan-600 shadow-lg border-b-4 border-b-cyan-400 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white text-shadow mb-2">Histórico de Reservas</h1>
          <p className="text-sky-100 text-lg">Gerencie suas viagens e reservas</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar com filtros */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-sky-50 to-cyan-50 rounded-xl shadow-lg shadow-sky-200/50 border border-cyan-200 p-6 space-y-6">
              {/* Estatísticas */}
              <div className="bg-gradient-to-br from-cyan-100 to-sky-100 rounded-xl p-4 border border-cyan-200 shadow-md">
                <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  📊 Resumo
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Total de reservas:</span>
                    <span className="font-bold text-sky-600 bg-sky-100 px-2 py-1 rounded-full">{reservas.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Confirmadas:</span>
                    <span className="font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                      {reservas.filter(r => r.status === 'confirmada').length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Concluídas:</span>
                    <span className="font-bold text-cyan-600 bg-cyan-100 px-2 py-1 rounded-full">
                      {reservas.filter(r => r.status === 'concluida').length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Filtro por status */}
              <div>
                <h3 className="font-semibold text-slate-700 mb-3">Status da Reserva</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 hover:bg-sky-50 p-2 rounded-lg transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="todas"
                      checked={filtroStatus === 'todas'}
                      onChange={(e) => setFiltroStatus(e.target.value)}
                      className="text-cyan-500 focus:ring-cyan-300"
                    />
                    <span className="text-sm text-slate-600">Todas</span>
                    <span className="text-sm ml-auto bg-sky-100 text-sky-600 px-2 py-1 rounded-full font-medium">{reservas.length}</span>
                  </label>
                  <label className="flex items-center gap-2 hover:bg-sky-50 p-2 rounded-lg transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="confirmada"
                      checked={filtroStatus === 'confirmada'}
                      onChange={(e) => setFiltroStatus(e.target.value)}
                      className="text-cyan-500 focus:ring-cyan-300"
                    />
                    <span className="text-sm text-slate-600">Confirmadas</span>
                    <span className="text-sm ml-auto bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full font-medium">
                      {reservas.filter(r => r.status === 'confirmada').length}
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      value="pendente"
                      checked={filtroStatus === 'pendente'}
                      onChange={(e) => setFiltroStatus(e.target.value)}
                      className="text-blue-600"
                    />
                    <span className="text-sm">Pendentes</span>
                    <span className="text-sm text-gray-400 ml-auto">
                      {reservas.filter(r => r.status === 'pendente').length}
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      value="concluida"
                      checked={filtroStatus === 'concluida'}
                      onChange={(e) => setFiltroStatus(e.target.value)}
                      className="text-blue-600"
                    />
                    <span className="text-sm">Concluídas</span>
                    <span className="text-sm text-gray-400 ml-auto">
                      {reservas.filter(r => r.status === 'concluida').length}
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      value="cancelada"
                      checked={filtroStatus === 'cancelada'}
                      onChange={(e) => setFiltroStatus(e.target.value)}
                      className="text-blue-600"
                    />
                    <span className="text-sm">Canceladas</span>
                    <span className="text-sm text-gray-400 ml-auto">
                      {reservas.filter(r => r.status === 'cancelada').length}
                    </span>
                  </label>
                </div>
              </div>

              {/* Filtro por período */}
              <div>
                <h3 className="font-medium text-gray-800 mb-3">Período</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="periodo"
                      value="todas"
                      checked={filtroData === 'todas'}
                      onChange={(e) => setFiltroData(e.target.value)}
                      className="text-blue-600"
                    />
                    <span className="text-sm">Todas</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="periodo"
                      value="2025"
                      checked={filtroData === '2025'}
                      onChange={(e) => setFiltroData(e.target.value)}
                      className="text-blue-600"
                    />
                    <span className="text-sm">2025</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="periodo"
                      value="2024"
                      checked={filtroData === '2024'}
                      onChange={(e) => setFiltroData(e.target.value)}
                      className="text-blue-600"
                    />
                    <span className="text-sm">2024</span>
                  </label>
                </div>
              </div>

              {/* Ações rápidas */}
              <div>
                <h3 className="font-medium text-gray-800 mb-3">Ações Rápidas</h3>
                <div className="space-y-2">
                  <button className="w-full text-left text-sm text-blue-600 hover:text-blue-700 py-1">
                    📧 Reenviar confirmação
                  </button>
                  <button className="w-full text-left text-sm text-blue-600 hover:text-blue-700 py-1">
                    📄 Baixar vouchers
                  </button>
                  <button className="w-full text-left text-sm text-blue-600 hover:text-blue-700 py-1">
                    ⭐ Avaliar viagens
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de reservas */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {reservasFiltradas.map((reserva) => (
                <div key={reserva.id} className="bg-white rounded-xl shadow-lg shadow-sky-200/50 border border-cyan-200 hover:shadow-xl hover:shadow-cyan-200/60 hover:scale-[1.01] transition-all duration-300">
                  <div className="p-6">
                    <div className="flex gap-4">
                      <div className="relative">
                        <img
                          src={reserva.imagem}
                          alt={reserva.hotel}
                          className="w-48 h-36 object-cover rounded-xl shadow-md"
                        />
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-cyan-500 to-sky-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
                          {reserva.codigo}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-slate-800">{reserva.hotel}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(reserva.status)} shadow-sm`}>
                                {getStatusText(reserva.status)}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 mb-1">{reserva.destino}</p>
                            <p className="text-sm text-slate-500 mb-2">Código: {reserva.codigo}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-slate-600 bg-sky-50 px-2 py-1 rounded-lg border border-sky-200">
                                Voo: {reserva.voo}
                              </span>
                              <span className="text-slate-400">•</span>
                              <span className="text-sm text-slate-600">{reserva.pessoas} pessoas</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <span className="bg-gradient-to-r from-cyan-500 to-sky-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md shadow-cyan-200">
                                {reserva.avaliacao}
                              </span>
                              <div className="text-yellow-500 text-lg">
                                {'⭐'.repeat(reserva.estrelas)}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-cyan-100">
                          <div>
                            <p className="text-sm text-slate-500">Data da Viagem</p>
                            <p className="font-semibold text-slate-800">{reserva.dataViagem}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-500">Data da Reserva</p>
                            <p className="font-semibold text-slate-800">{reserva.dataReserva}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-end mt-6">
                          <div className="flex gap-2 flex-wrap">
                            <button className="bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-md">
                              Status
                            </button>
                            {reserva.status === 'confirmada' && (
                              <>
                                <button className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg hover:shadow-cyan-200">
                                  Ver Detalhes
                                </button>
                                <button 
                                  onClick={() => handleCancelClick(reserva.id)}
                                  className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg hover:shadow-red-200"
                                >
                                  Cancelar
                                </button>
                              </>
                            )}
                            {reserva.status === 'concluida' && (
                              <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg hover:shadow-emerald-200">
                                Avaliar Viagem
                              </button>
                            )}
                            {reserva.status === 'pendente' && (
                              <>
                                <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg hover:shadow-amber-200">
                                  Finalizar Pagamento
                                </button>
                                <button 
                                  onClick={() => handleCancelClick(reserva.id)}
                                  className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg hover:shadow-red-200"
                                >
                                  Cancelar
                                </button>
                              </>
                            )}
                            <button className="bg-sky-100 text-sky-700 border-2 border-sky-300 hover:bg-sky-200 hover:border-sky-400 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105">
                              Baixar Voucher
                            </button>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-slate-600">
                              Valor Total
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-600">R$ {reserva.valor.toLocaleString()}</span>
                            </div>
                            <div className="text-xs text-slate-500">
                              Para {reserva.pessoas} pessoas
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {reservasFiltradas.length === 0 && (
              <div className="bg-white rounded-xl shadow-lg shadow-sky-200/50 border border-cyan-200 p-10 text-center">
                <div className="text-6xl mb-6">🧳</div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Nenhuma reserva encontrada</h3>
                <p className="text-slate-600 mb-6">Não há reservas que correspondam aos filtros selecionados.</p>
                <button className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-cyan-200">
                  Fazer Nova Reserva
                </button>
              </div>
            )}

            {/* Banner promocional */}
            <div className="mt-8 bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-700 rounded-xl p-8 text-white shadow-xl shadow-sky-300/30 border border-cyan-400">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-shadow">Planeje sua próxima viagem</h3>
                  <p className="text-sky-100 text-lg">Descubra novos destinos com até 30% de desconto</p>
                </div>
                <div className="text-6xl opacity-80">✈️</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Cancelamento */}
      {showCancelModal && selectedReserva && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-sky-200/50 border-t-4 border-t-cyan-500">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Por que deseja cancelar o pacote?</h2>
                  {(() => {
                    const reserva = reservas.find(r => r.id === selectedReserva);
                    return reserva && (
                      <p className="text-slate-600 mt-2">
                        <span className="font-semibold">{reserva.hotel}</span> - {reserva.destino}
                      </p>
                    );
                  })()}
                </div>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-2xl font-bold hover:scale-110 transition-all duration-200"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCancelSubmit} className="space-y-5">
                <div>
                  <label className="block text-slate-700 font-semibold mb-2">
                    Nome Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={cancelData.nome}
                    onChange={handleCancelDataChange}
                    className="w-full p-3 border-2 border-sky-200 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200"
                    placeholder="Digite seu nome completo"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-2">
                    Data <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="data"
                    value={cancelData.data}
                    onChange={handleCancelDataChange}
                    className="w-full p-3 border-2 border-sky-200 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-2">
                    Motivo do Cancelamento <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="motivo"
                    value={cancelData.motivo}
                    onChange={handleCancelDataChange}
                    className="w-full p-3 border-2 border-sky-200 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200"
                    required
                  >
                    <option value="">Selecione um motivo</option>
                    {motivosCancelamento.map((motivo, index) => (
                      <option key={index} value={motivo}>
                        {motivo}
                      </option>
                    ))}
                  </select>
                </div>

                {cancelData.motivo === 'Outro motivo' && (
                  <div>
                    <label className="block text-slate-700 font-semibold mb-2">
                      Descreva o motivo <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="motivoPersonalizado"
                      value={cancelData.motivoPersonalizado}
                      onChange={handleCancelDataChange}
                      rows={3}
                      className="w-full p-3 border-2 border-sky-200 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-200"
                      placeholder="Descreva o motivo do cancelamento..."
                      required
                    />
                  </div>
                )}

                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4">
                  <p className="text-sm text-amber-800">
                    <span className="font-semibold">⚠️ Atenção:</span> O cancelamento pode estar sujeito a taxas conforme a política de cancelamento do pacote.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCancelModal(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-red-200"
                  >
                    Solicitar Cancelamento
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
