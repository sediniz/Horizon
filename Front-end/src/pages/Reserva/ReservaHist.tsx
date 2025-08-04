import React, { useState, useEffect } from 'react';
import Rating from '../../components/Rating/Rating';
import { reservasApi } from '../../api/reservas';
import type { Reserva, CancelamentoReserva, AvaliacaoReserva } from '../../api/reservas';
export default function ReservaHist() {
  const [filtroStatus, setFiltroStatus] = useState('todas');
  const [filtroData, setFiltroData] = useState('todas');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState<number | null>(null);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelData.nome || !cancelData.data || !cancelData.motivo) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    if (cancelData.motivo === 'Outro motivo' && !cancelData.motivoPersonalizado) {
      alert('Por favor, descreva o motivo do cancelamento.');
      return;
    }
    
    if (!selectedReserva) return;
    
    try {
      // Encontrar a reserva sendo cancelada
      const reserva = reservas.find(r => r.id === selectedReserva);
      const reservaInfo = reserva ? `${reserva.hotel} - ${reserva.destino}` : 'Reserva';
      
      // Chamar API para cancelar
      const dadosCancelamento: CancelamentoReserva = {
        reservaId: selectedReserva,
        nome: cancelData.nome,
        data: cancelData.data,
        motivo: cancelData.motivo,
        motivoPersonalizado: cancelData.motivoPersonalizado
      };
      
      await reservasApi.cancelarReserva(dadosCancelamento);
      
      // Atualizar estado local
      setReservas(prev => prev.map(r => 
        r.id === selectedReserva ? { ...r, status: 'cancelada' as const } : r
      ));
      
      alert(`Solicitação de cancelamento para ${reservaInfo} enviada com sucesso!`);
      setShowCancelModal(false);
      setSelectedReserva(null);
    } catch (err) {
      console.error('Erro ao cancelar reserva:', err);
      alert('Erro ao cancelar a reserva. Tente novamente.');
    }
  };
  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ratingData.geral === 0) {
      alert('Por favor, dê uma avaliação geral.');
      return;
    }
    
    if (!selectedReserva) return;
    
    try {
      const reserva = reservas.find(r => r.id === selectedReserva);
      const reservaInfo = reserva ? `${reserva.hotel} - ${reserva.destino}` : 'Reserva';
      
      // Chamar API para avaliar
      const avaliacaoData: AvaliacaoReserva = {
        reservaId: selectedReserva,
        geral: ratingData.geral,
        limpeza: ratingData.limpeza,
        localizacao: ratingData.localizacao,
        servico: ratingData.servico,
        custoBeneficio: ratingData.custoBeneficio,
        comentario: ratingData.comentario
      };
      
      await reservasApi.avaliarReserva(avaliacaoData);
      
      alert(`Avaliação para ${reservaInfo} enviada com sucesso! Obrigado pelo seu feedback.`);
      setShowRatingModal(false);
      setSelectedReserva(null);
    } catch (err) {
      console.error('Erro ao avaliar reserva:', err);
      alert('Erro ao enviar a avaliação. Tente novamente.');
    }
  };
  // Handler para confirmar status da reserva
  const handleConfirmarStatus = async (reservaId: number) => {
    try {
      const reserva = reservas.find(r => r.id === reservaId);
      if (!reserva) {
        alert('Reserva não encontrada.');
        return;
      }

      const statusAtual = getStatusText(reserva.status);
      const confirmacao = window.confirm(
        `Confirmar o status atual da reserva?\n\n` +
        `Reserva: ${reserva.hotel} - ${reserva.destino}\n` +
        `Código: ${reserva.codigo}\n` +
        `Status atual: ${statusAtual}\n\n` +
        `Esta ação irá reenviar a confirmação por email.`
      );

      if (confirmacao) {
        // Simular chamada da API para confirmar status
        await reservasApi.confirmarStatus(reservaId);
        alert(`Status "${statusAtual}" confirmado com sucesso!\nConfirmação enviada por email.`);
      }
    } catch (err) {
      console.error('Erro ao confirmar status:', err);
      alert('Erro ao confirmar status. Tente novamente.');
    }
  };

  // Handler para reenviar confirmação
  const handleReenviarConfirmacao = async (reservaId: number) => {
    try {
      await reservasApi.reenviarConfirmacao(reservaId);
      alert('Confirmação reenviada com sucesso para seu e-mail!');
    } catch (err) {
      console.error('Erro ao reenviar confirmação:', err);
      alert('Erro ao reenviar confirmação. Tente novamente.');
    }
  };
  // Handler para visualizar voucher
  const handleBaixarVoucher = async (reservaId: number) => {
    try {
      const reserva = reservas.find(r => r.id === reservaId);
      if (!reserva) {
        alert('Reserva não encontrada.');
        return;
      }

      // Gerar comprovante em formato HTML
      const comprovanteHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Comprovante de Reserva - ${reserva.codigo}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
            .comprovante { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); max-width: 600px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 28px; font-weight: bold; color: #3b82f6; margin-bottom: 10px; }
            .titulo { font-size: 24px; color: #1f2937; margin-bottom: 5px; }
            .codigo { font-size: 14px; color: #6b7280; }
            .secao { margin-bottom: 25px; }
            .secao-titulo { font-size: 18px; font-weight: bold; color: #374151; margin-bottom: 15px; border-left: 4px solid #3b82f6; padding-left: 15px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
            .info-item { background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 3px solid #e5e7eb; }
            .info-label { font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: bold; margin-bottom: 5px; }
            .info-valor { font-size: 16px; color: #1f2937; font-weight: 600; }
            .status { padding: 8px 16px; border-radius: 20px; font-weight: bold; text-align: center; }
            .status-confirmada { background: #dcfce7; color: #166534; }
            .status-pendente { background: #fef3c7; color: #92400e; }
            .status-concluida { background: #dbeafe; color: #1e40af; }
            .status-cancelada { background: #fee2e2; color: #dc2626; }
            .valor-total { font-size: 24px; color: #059669; font-weight: bold; text-align: center; padding: 20px; background: #f0fdf4; border-radius: 10px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
            .qr-placeholder { width: 80px; height: 80px; background: #f3f4f6; border: 2px dashed #d1d5db; margin: 0 auto; display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 10px; }
            .voltar-btn { position: fixed; top: 20px; left: 20px; background: #3b82f6; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; }
            .voltar-btn:hover { background: #2563eb; }
          </style>
        </head>
        <body>
          <button class="voltar-btn" onclick="window.location.href='/reservas'">← Voltar para Reservas</button>
          <div class="comprovante">
            <div class="header">
              <div class="logo">🌅 HORIZON VIAGENS</div>
              <div class="titulo">Comprovante de Reserva</div>
              <div class="codigo">Código: ${reserva.codigo}</div>
            </div>

            <div class="secao">
              <div class="secao-titulo">📍 Informações da Viagem</div>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Destino</div>
                  <div class="info-valor">${reserva.destino}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Hotel</div>
                  <div class="info-valor">${reserva.hotel}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Data da Viagem</div>
                  <div class="info-valor">${reserva.dataViagem}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Pessoas</div>
                  <div class="info-valor">${reserva.pessoas} ${reserva.pessoas === 1 ? 'pessoa' : 'pessoas'}</div>
                </div>
              </div>
            </div>

            <div class="secao">
              <div class="secao-titulo">✈️ Detalhes do Voo</div>
              <div class="info-item">
                <div class="info-label">Rota</div>
                <div class="info-valor">${reserva.voo || 'Não incluído'}</div>
              </div>
            </div>

            <div class="secao">
              <div class="secao-titulo">📋 Status da Reserva</div>
              <div class="status status-${reserva.status}">${getStatusText(reserva.status).toUpperCase()}</div>
            </div>

            <div class="valor-total">
              Valor Total: R$ ${reserva.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>

            <div class="secao">
              <div class="secao-titulo">📅 Informações da Reserva</div>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Data da Reserva</div>
                  <div class="info-valor">${reserva.dataReserva}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Avaliação do Hotel</div>
                  <div class="info-valor">${reserva.avaliacao || 'N/A'} ⭐ (${reserva.estrelas || 0} estrelas)</div>
                </div>
              </div>
            </div>

            <div class="footer">
              <div class="qr-placeholder">QR CODE</div>
              <p>Este comprovante foi gerado automaticamente em ${new Date().toLocaleString('pt-BR')}</p>
              <p><strong>Horizon Viagens</strong> - Expanda seus Horizontes</p>
              <p>Em caso de dúvidas, entre em contato: (11) 9999-9999 | contato@horizon.com</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Abrir comprovante na mesma janela
      document.open();
      document.write(comprovanteHTML);
      document.close();
      
    } catch (err) {
      console.error('Erro ao gerar comprovante:', err);
      alert('Erro ao gerar comprovante. Tente novamente.');
    }
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
  const StarRating = ({ rating, onStarClick }: { rating: number, onStarClick: (star: number) => void }) => {
    return (
      <Rating 
        rating={rating} 
        interactive={true} 
        onRatingChange={onStarClick}
        size="xl"
      />
    );
  };
  const renderStars = (rating: number, onStarClick: (rating: number) => void) => {
    return <StarRating rating={rating} onStarClick={onStarClick} />;
  };
  // Carregar reservas da API
  useEffect(() => {
    const carregarReservas = async () => {
      try {
        setLoading(true);
        setError(null);
        // TODO: Pegar userId do contexto de autenticação
        const reservasCarregadas = await reservasApi.buscarReservas(1);
        setReservas(reservasCarregadas);
      } catch (err) {
        console.error('Erro ao carregar reservas:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar reservas');
        // Fallback para dados mock em caso de erro
        setReservas([
          {
            id: 1,
            codigo: "HZ2025001",
            destino: "Rio de Janeiro",
            hotel: "Rede Andrade Lapa Hotel",
            dataViagem: "10/08/2025 - 17/08/2025",
            dataReserva: "15/07/2025",
            status: "confirmada" as const,
            valor: 1186,
            pessoas: 2,
            imagem: "https://cdn.pixabay.com/photo/2016/10/18/09/02/hotel-1749602_1280.jpg",
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
            status: "pendente" as const,
            valor: 2120,
            pessoas: 2,
            imagem: "https://cdn.pixabay.com/photo/2012/11/10/14/12/copacabana-beach-65598_1280.jpg",
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
            status: "concluida" as const,
            valor: 3500,
            pessoas: 2,
            imagem: "https://segredosdeviagem.com.br/wp-content/uploads/2018/08/5B-Onde-ficar-Fernando-Noronha-pousada-maravilha-fernando-de-noronha_Divulgac%CC%A7a%CC%83o-1024x430.jpg",
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
            status: "cancelada" as const,
            valor: 4200,
            pessoas: 2,
            imagem: "https://www.thehotelguru.com/_images/02/8c/028cbe438fa3e6a67281b6da2a9d0911/s1654x900.jpg",
            voo: "GRU → CDG",
            avaliacao: 8.8,
            estrelas: 4
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    carregarReservas();
  }, []);
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
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-lg text-gray-600">Carregando suas reservas...</p>
          </div>
        </div>
      )}
      {/* Error State */}
      {error && !loading && (
        <div className="max-w-2xl mx-auto p-4 mt-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-12 text-red-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-red-800 mb-2">Erro ao carregar reservas</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-sm text-red-500 mb-4">Exibindo dados de exemplo enquanto isso.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      )}
      {/* Main Content */}
      {!loading && (
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
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                  </svg>
                  Resumo das Viagens
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
                  <button 
                    onClick={() => {
                      const ultimaReserva = reservas.find(r => r.status === 'confirmada' || r.status === 'pendente');
                      if (ultimaReserva) {
                        handleReenviarConfirmacao(ultimaReserva.id);
                      } else {
                        alert('Não há reservas ativas para reenviar confirmação.');
                      }
                    }}
                    className="w-full flex items-center gap-2 bg-white/40 hover:bg-white/60 px-3 py-2 rounded-lg text-sm font-medium text-blue-700 transition-all duration-200 hover:scale-105"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                    <span>Reenviar confirmação</span>
                  </button>
                  <button 
                    onClick={() => {
                      const reservasAtivas = reservas.filter(r => r.status === 'confirmada' || r.status === 'concluida');
                      if (reservasAtivas.length > 0) {
                        reservasAtivas.forEach(reserva => handleBaixarVoucher(reserva.id));
                      } else {
                        alert('Não há reservas com comprovantes disponíveis.');
                      }
                    }}
                    className="w-full flex items-center gap-2 bg-white/40 hover:bg-white/60 px-3 py-2 rounded-lg text-sm font-medium text-green-700 transition-all duration-200 hover:scale-105"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                    <span>Baixar comprovante</span>
                  </button>
                  <button className="w-full flex items-center gap-2 bg-white/40 hover:bg-white/60 px-3 py-2 rounded-lg text-sm font-medium text-yellow-700 transition-all duration-200 hover:scale-105">
                    <Rating rating={1} size="xs" color="text-yellow-600" />
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
                            {reserva.avaliacao || '0.0'}
                          </span>
                          <Rating rating={reserva.estrelas || 0} size="sm" />
                        </div>
                      </div>
                    </div>
                    {/* Conteúdo Principal */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Imagem */}
                      <div className="lg:col-span-1">
                        <div className="relative">
                          <img
                            src={reserva.imagem || '/src/assets/img1.jpeg'}
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
                          {reserva.voo && (
                            <div className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                              <span className="text-sm font-medium text-blue-800">{reserva.voo}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 bg-purple-100 px-3 py-1 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 text-purple-600">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                            </svg>
                            <span className="text-sm font-medium text-purple-800">{reserva.pessoas} pessoas</span>
                          </div>
                        </div>
                        {/* Valor e Ações */}
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pt-4 border-t border-white/20">
                          <div className="flex flex-wrap gap-2">
                            <button 
                              onClick={() => handleConfirmarStatus(reserva.id)}
                              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Confirmar Status
                            </button>
                            {reserva.status === 'confirmada' && (
                              <>
                                <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                                  Ver Detalhes
                                </button>
                                <button 
                                  onClick={() => handleCancelClick(reserva.id)}
                                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  Cancelar
                                </button>
                              </>
                            )}
                            {reserva.status === 'concluida' && (
                              <button 
                                onClick={() => handleRatingClick(reserva.id)}
                                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2"
                              >
                                <Rating rating={5} size="xs" color="text-white" />
                                Avaliar
                              </button>
                            )}
                            {reserva.status === 'pendente' && (
                              <>
                                <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                                  </svg>
                                  Pagar
                                </button>
                                <button 
                                  onClick={() => handleCancelClick(reserva.id)}
                                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  Cancelar
                                </button>
                              </>
                            )}
                            <button 
                              onClick={() => handleBaixarVoucher(reserva.id)}
                              className="bg-white/60 backdrop-blur-sm text-blue-700 border border-blue-300 hover:bg-white/80 hover:border-blue-400 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                              </svg>
                              Comprovante
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
      )} {/* Closing for main content conditional */}
      {/* Modal de Confirmação de Cancelamento */}
      {showConfirmModal && selectedReserva && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl shadow-sky-200/50 border-t-4 border-t-red-500">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-16 text-red-600">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                  </svg>
                </div>
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
                <p className="text-sm text-amber-800 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4 text-amber-600 flex-shrink-0">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                  </svg>
                  <span><span className="font-semibold">Atenção:</span> Esta ação não pode ser desfeita. O cancelamento pode estar sujeito a taxas conforme a política de cancelamento.</span>
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
                  <p className="text-sm text-amber-800 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4 text-amber-600 flex-shrink-0">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                    <span><span className="font-semibold">Atenção:</span> O cancelamento pode estar sujeito a taxas conforme a política de cancelamento do pacote.</span>
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
