import { useState } from 'react';

export default function ReservaHist() {
  const [filtroStatus, setFiltroStatus] = useState('todas');
  const [filtroData, setFiltroData] = useState('todas');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState<number | null>(null);
  const [cancelData, setCancelData] = useState({
    nome: '',
    data: '',
    motivo: '',
    motivoPersonalizado: ''
  });
  const [ratingData, setRatingData] = useState({
    geral: 0,
    limpeza: 0,
    localizacao: 0,
    servico: 0,
    custoBeneficio: 0,
    comentario: ''
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
    setShowConfirmModal(true);
  };

  const handleConfirmCancel = () => {
    setShowConfirmModal(false);
    setShowCancelModal(true);
    setCancelData({
      nome: '',
      data: '',
      motivo: '',
      motivoPersonalizado: ''
    });
  };

  const handleRatingClick = (reservaId: number) => {
    setSelectedReserva(reservaId);
    setShowRatingModal(true);
    setRatingData({
      geral: 0,
      limpeza: 0,
      localizacao: 0,
      servico: 0,
      custoBeneficio: 0,
      comentario: ''
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

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ratingData.geral === 0) {
      alert('Por favor, dê uma avaliação geral.');
      return;
    }
    
    const reserva = reservas.find(r => r.id === selectedReserva);
    const reservaInfo = reserva ? `${reserva.hotel} - ${reserva.destino}` : 'Reserva';
    
    alert(`Avaliação para ${reservaInfo} enviada com sucesso! Obrigado pelo seu feedback.`);
    setShowRatingModal(false);
    setSelectedReserva(null);
  };

  const handleRatingChange = (field: keyof typeof ratingData, value: number | string) => {
    setRatingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCancelDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCancelData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderStars = (rating: number, onStarClick: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onStarClick(star)}
            className={`text-2xl transition-colors ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            } hover:text-yellow-400`}
          >
            ⭐
          </button>
        ))}
      </div>
    );
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <style>{`
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .glass-effect {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
      `}</style>

      <div className="max-w-7xl mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar com filtros */}
          <div className="w-full lg:w-80 lg:flex-shrink-0">
            <div className="glass-effect rounded-2xl p-6 shadow-xl h-fit border border-white/20 backdrop-blur-sm space-y-6">
              {/* Header da sidebar */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Filtros</h2>
              </div>

              {/* Estatísticas */}
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white border border-blue-300/30 shadow-lg">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  📊 Resumo das Viagens
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100 text-sm">Total de reservas</span>
                    <span className="font-bold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">{reservas.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100 text-sm">Confirmadas</span>
                    <span className="font-bold bg-emerald-500/30 px-3 py-1 rounded-full">
                      {reservas.filter(r => r.status === 'confirmada').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100 text-sm">Concluídas</span>
                    <span className="font-bold bg-cyan-500/30 px-3 py-1 rounded-full">
                      {reservas.filter(r => r.status === 'concluida').length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Filtro por status */}
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                <div className="flex items-center space-x-2 mb-4">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-bold text-gray-800">Status da Reserva</h3>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 hover:bg-white/40 p-2 rounded-lg transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="todas"
                      checked={filtroStatus === 'todas'}
                      onChange={(e) => setFiltroStatus(e.target.value)}
                      className="text-blue-500 focus:ring-blue-300"
                    />
                    <span className="text-sm font-medium text-gray-700 flex-1">Todas</span>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-bold">{reservas.length}</span>
                  </label>
                  <label className="flex items-center gap-3 hover:bg-white/40 p-2 rounded-lg transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="confirmada"
                      checked={filtroStatus === 'confirmada'}
                      onChange={(e) => setFiltroStatus(e.target.value)}
                      className="text-green-500 focus:ring-green-300"
                    />
                    <span className="text-sm font-medium text-gray-700 flex-1">Confirmadas</span>
                    <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full font-bold">
                      {reservas.filter(r => r.status === 'confirmada').length}
                    </span>
                  </label>
                  <label className="flex items-center gap-3 hover:bg-white/40 p-2 rounded-lg transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="pendente"
                      checked={filtroStatus === 'pendente'}
                      onChange={(e) => setFiltroStatus(e.target.value)}
                      className="text-amber-500 focus:ring-amber-300"
                    />
                    <span className="text-sm font-medium text-gray-700 flex-1">Pendentes</span>
                    <span className="text-xs bg-amber-100 text-amber-600 px-2 py-1 rounded-full font-bold">
                      {reservas.filter(r => r.status === 'pendente').length}
                    </span>
                  </label>
                  <label className="flex items-center gap-3 hover:bg-white/40 p-2 rounded-lg transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="concluida"
                      checked={filtroStatus === 'concluida'}
                      onChange={(e) => setFiltroStatus(e.target.value)}
                      className="text-cyan-500 focus:ring-cyan-300"
                    />
                    <span className="text-sm font-medium text-gray-700 flex-1">Concluídas</span>
                    <span className="text-xs bg-cyan-100 text-cyan-600 px-2 py-1 rounded-full font-bold">
                      {reservas.filter(r => r.status === 'concluida').length}
                    </span>
                  </label>
                  <label className="flex items-center gap-3 hover:bg-white/40 p-2 rounded-lg transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="cancelada"
                      checked={filtroStatus === 'cancelada'}
                      onChange={(e) => setFiltroStatus(e.target.value)}
                      className="text-red-500 focus:ring-red-300"
                    />
                    <span className="text-sm font-medium text-gray-700 flex-1">Canceladas</span>
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold">
                      {reservas.filter(r => r.status === 'cancelada').length}
                    </span>
                  </label>
                </div>
              </div>

              {/* Filtro por período */}
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                <div className="flex items-center space-x-2 mb-4">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="font-bold text-gray-800">Período</h3>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 hover:bg-white/40 p-2 rounded-lg transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="periodo"
                      value="todas"
                      checked={filtroData === 'todas'}
                      onChange={(e) => setFiltroData(e.target.value)}
                      className="text-purple-500 focus:ring-purple-300"
                    />
                    <span className="text-sm font-medium text-gray-700 flex-1">Todas</span>
                  </label>
                  <label className="flex items-center gap-3 hover:bg-white/40 p-2 rounded-lg transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="periodo"
                      value="2025"
                      checked={filtroData === '2025'}
                      onChange={(e) => setFiltroData(e.target.value)}
                      className="text-purple-500 focus:ring-purple-300"
                    />
                    <span className="text-sm font-medium text-gray-700 flex-1">2025</span>
                  </label>
                  <label className="flex items-center gap-3 hover:bg-white/40 p-2 rounded-lg transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="periodo"
                      value="2024"
                      checked={filtroData === '2024'}
                      onChange={(e) => setFiltroData(e.target.value)}
                      className="text-purple-500 focus:ring-purple-300"
                    />
                    <span className="text-sm font-medium text-gray-700 flex-1">2024</span>
                  </label>
                </div>
              </div>

              {/* Ações rápidas */}
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                <div className="flex items-center space-x-2 mb-4">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <h3 className="font-bold text-gray-800">Ações Rápidas</h3>
                </div>
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-2 bg-white/40 hover:bg-white/60 px-3 py-2 rounded-lg text-sm font-medium text-blue-700 transition-all duration-200 hover:scale-105">
                    <span>📧</span>
                    <span>Reenviar confirmação</span>
                  </button>
                  <button className="w-full flex items-center gap-2 bg-white/40 hover:bg-white/60 px-3 py-2 rounded-lg text-sm font-medium text-green-700 transition-all duration-200 hover:scale-105">
                    <span>📄</span>
                    <span>Baixar vouchers</span>
                  </button>
                  <button className="w-full flex items-center gap-2 bg-white/40 hover:bg-white/60 px-3 py-2 rounded-lg text-sm font-medium text-yellow-700 transition-all duration-200 hover:scale-105">
                    <span>⭐</span>
                    <span>Avaliar viagens</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de reservas */}
          <div className="flex-1">
            <div className="space-y-6">
              {reservasFiltradas.map((reserva) => (
                <div key={reserva.id} className="glass-effect rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
                  <div className="p-6">
                    {/* Header do Card */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-4 border-b border-white/20">
                      <div className="flex items-center gap-3 mb-2 sm:mb-0">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{reserva.codigo.slice(-3)}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">{reserva.hotel}</h3>
                          <p className="text-sm text-gray-600">{reserva.destino}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${getStatusBadge(reserva.status)}`}>
                          {getStatusText(reserva.status)}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                            {reserva.avaliacao}
                          </span>
                          <span className="text-yellow-500 text-sm">{'⭐'.repeat(reserva.estrelas)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Conteúdo Principal */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Imagem */}
                      <div className="lg:col-span-1">
                        <div className="relative">
                          <img
                            src={reserva.imagem}
                            alt={reserva.hotel}
                            className="w-full h-48 lg:h-40 object-cover rounded-xl shadow-lg"
                          />
                          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-gray-800 shadow-lg">
                            {reserva.codigo}
                          </div>
                        </div>
                      </div>

                      {/* Informações */}
                      <div className="lg:col-span-2 space-y-4">
                        {/* Detalhes da Viagem */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-white/40 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                            <div className="flex items-center gap-2 mb-1">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="text-xs font-semibold text-gray-600 uppercase">Data da Viagem</span>
                            </div>
                            <p className="font-bold text-gray-800">{reserva.dataViagem}</p>
                          </div>
                          <div className="bg-white/40 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                            <div className="flex items-center gap-2 mb-1">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-xs font-semibold text-gray-600 uppercase">Reservado em</span>
                            </div>
                            <p className="font-bold text-gray-800">{reserva.dataReserva}</p>
                          </div>
                        </div>

                        {/* Detalhes Extras */}
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            <span className="text-sm font-medium text-blue-800">{reserva.voo}</span>
                          </div>
                          <div className="flex items-center gap-2 bg-purple-100 px-3 py-1 rounded-full">
                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                            <span className="text-sm font-medium text-purple-800">{reserva.pessoas} pessoas</span>
                          </div>
                        </div>

                        {/* Valor e Ações */}
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pt-4 border-t border-white/20">
                          <div className="flex flex-wrap gap-2">
                            <button className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                              Status
                            </button>
                            {reserva.status === 'confirmada' && (
                              <>
                                <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                                  Ver Detalhes
                                </button>
                                <button 
                                  onClick={() => handleCancelClick(reserva.id)}
                                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                                >
                                  Cancelar
                                </button>
                              </>
                            )}
                            {reserva.status === 'concluida' && (
                              <button 
                                onClick={() => handleRatingClick(reserva.id)}
                                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                              >
                                ⭐ Avaliar
                              </button>
                            )}
                            {reserva.status === 'pendente' && (
                              <>
                                <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                                  💳 Pagar
                                </button>
                                <button 
                                  onClick={() => handleCancelClick(reserva.id)}
                                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                                >
                                  Cancelar
                                </button>
                              </>
                            )}
                            <button className="bg-white/60 backdrop-blur-sm text-blue-700 border border-blue-300 hover:bg-white/80 hover:border-blue-400 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                              📄 Voucher
                            </button>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600 mb-1">Valor Total</div>
                            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                              R$ {reserva.valor.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">Para {reserva.pessoas} pessoas</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {reservasFiltradas.length === 0 && (
              <div className="glass-effect rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm p-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl text-white">🧳</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Nenhuma reserva encontrada</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">Não há reservas que correspondam aos filtros selecionados. Que tal planejar sua próxima viagem?</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg">
                    ✈️ Nova Reserva
                  </button>
                  <button onClick={() => { setFiltroStatus('todas'); setFiltroData('todas'); }} className="bg-white/60 backdrop-blur-sm text-gray-700 border border-gray-300 hover:bg-white/80 hover:border-gray-400 px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                    🔄 Limpar Filtros
                  </button>
                </div>
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

      {/* Modal de Confirmação de Cancelamento */}
      {showConfirmModal && selectedReserva && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl shadow-sky-200/50 border-t-4 border-t-red-500">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Confirmar Cancelamento</h2>
                {(() => {
                  const reserva = reservas.find(r => r.id === selectedReserva);
                  return reserva && (
                    <p className="text-slate-600">
                      Deseja realmente cancelar a reserva para <span className="font-semibold">{reserva.hotel}</span> em {reserva.destino}?
                    </p>
                  );
                })()}
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">⚠️ Atenção:</span> Esta ação não pode ser desfeita. O cancelamento pode estar sujeito a taxas conforme a política de cancelamento.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Voltar
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-red-200"
                >
                  Confirmar Cancelamento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Modal de Avaliação */}
      {showRatingModal && selectedReserva && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-sky-200/50 border-t-4 border-t-emerald-500">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Avaliar Viagem</h2>
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
                  onClick={() => setShowRatingModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-2xl font-bold hover:scale-110 transition-all duration-200"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleRatingSubmit} className="space-y-6">
                {/* Avaliação Geral */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-3">
                    Avaliação Geral <span className="text-red-500">*</span>
                  </label>
                  {renderStars(ratingData.geral, (rating) => handleRatingChange('geral', rating))}
                </div>

                {/* Avaliações Específicas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">Limpeza</label>
                    {renderStars(ratingData.limpeza, (rating) => handleRatingChange('limpeza', rating))}
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">Localização</label>
                    {renderStars(ratingData.localizacao, (rating) => handleRatingChange('localizacao', rating))}
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">Atendimento</label>
                    {renderStars(ratingData.servico, (rating) => handleRatingChange('servico', rating))}
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">Custo-Benefício</label>
                    {renderStars(ratingData.custoBeneficio, (rating) => handleRatingChange('custoBeneficio', rating))}
                  </div>
                </div>

                {/* Comentário */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-2">
                    Comentário (opcional)
                  </label>
                  <textarea
                    value={ratingData.comentario}
                    onChange={(e) => handleRatingChange('comentario', e.target.value)}
                    rows={4}
                    className="w-full p-3 border-2 border-sky-200 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all duration-200"
                    placeholder="Conte-nos sobre sua experiência..."
                  />
                </div>

                <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 border-2 border-emerald-200 rounded-xl p-4">
                  <p className="text-sm text-emerald-800">
                    <span className="font-semibold">💚 Sua opinião é importante!</span> Sua avaliação ajuda outros viajantes a fazerem melhores escolhas.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowRatingModal(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-emerald-200"
                  >
                    Enviar Avaliação
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
