import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Rating from '../../components/Rating/Rating';
import { reservasApi } from '../../api/reservas';
import type { Reserva, CancelamentoReserva, AvaliacaoReserva } from '../../api/reservas';
import { useAuth } from '../../contexts/AuthContext';
export default function ReservaHist() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [filtroStatus, setFiltroStatus] = useState('todas');
  const [filtroData, setFiltroData] = useState('todas');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSelectRatingModal, setShowSelectRatingModal] = useState(false);
  const [showNoTripsModal, setShowNoTripsModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
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

  // Handler para navegar ao pagamento
  const handlePagamentoClick = (reservaId: number) => {
    navigate('/pagamento', { state: { reservaId } });
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

  // Handler para o botão "Avaliar viagens" das ações rápidas
  const handleAvaliarViagensRapidas = () => {
    // Buscar reservas que podem ser avaliadas (concluídas)
    const reservasConcluidas = reservas.filter(r => r.status === 'concluida');
    
    if (reservasConcluidas.length === 0) {
      setShowNoTripsModal(true);
      return;
    }
    
    // Se houver apenas uma reserva concluída, abrir diretamente
    if (reservasConcluidas.length === 1) {
      handleRatingClick(reservasConcluidas[0].id);
      return;
    }
    
    // Se houver múltiplas reservas, mostrar modal de seleção
    setShowSelectRatingModal(true);
  };

  const handleDetailsClick = async (reservaId: number) => {
    setSelectedReserva(reservaId);
    
    // Verificar se a reserva atual já tem dados completos
    const reservaAtual = reservas.find(r => r.id === reservaId);
    
    // Se não tem descrição ou inclui, tentar buscar dados completos da API
    if (reservaAtual && (!reservaAtual.descricao || !reservaAtual.inclui || reservaAtual.inclui.length === 0)) {
      try {
        console.log('Buscando dados completos da reserva:', reservaId);
        const reservaCompleta = await reservasApi.buscarReservaPorId(reservaId);
        
        // Se ainda não tiver dados e tiver pacoteId, tentar buscar do pacote
        if ((!reservaCompleta.descricao || !reservaCompleta.inclui) && reservaCompleta.pacoteId) {
          try {
            console.log('Tentando buscar dados do pacote:', reservaCompleta.pacoteId);
            // Importar dinamicamente a API de pacotes para evitar dependência circular
            const { getPacoteById } = await import('../../api/pacotes');
            const pacote = await getPacoteById(reservaCompleta.pacoteId);
            
            // Enriquecer com dados do pacote
            reservaCompleta.descricao = reservaCompleta.descricao || pacote.descricao;
            // Note: pacotes podem não ter campo 'inclui', seria necessário adaptar o modelo
          } catch (pacoteErr) {
            console.warn('Não foi possível buscar dados do pacote:', pacoteErr);
          }
        }
        
        // Atualizar a reserva na lista com os dados completos
        setReservas(prevReservas => 
          prevReservas.map(r => 
            r.id === reservaId 
              ? { ...r, ...reservaCompleta }
              : r
          )
        );
        
        console.log('Dados completos obtidos:', {
          descricao: reservaCompleta.descricao,
          inclui: reservaCompleta.inclui,
          observacoes: reservaCompleta.observacoes
        });
      } catch (err) {
        console.error('Erro ao buscar dados completos da reserva:', err);
        // Continuar mesmo se falhar - mostrará dados básicos ou placeholders
      }
    }
    
    setShowDetailsModal(true);
  };
  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelData.nome || !cancelData.data || !cancelData.motivo) {
      setModalTitle('Campos Obrigatórios');
      setModalMessage('Por favor, preencha todos os campos obrigatórios para continuar com o cancelamento.');
      setShowErrorModal(true);
      return;
    }
    
    if (cancelData.motivo === 'Outro motivo' && !cancelData.motivoPersonalizado) {
      setModalTitle('Motivo Personalizado');
      setModalMessage('Por favor, descreva o motivo do cancelamento no campo específico.');
      setShowErrorModal(true);
      return;
    }
    
    if (!selectedReserva) return;
    
    try {
      const reserva = reservas.find(r => r.id === selectedReserva);
      const reservaInfo = reserva ? `${reserva.hotel} - ${reserva.destino}` : 'Reserva';
      
      const dadosCancelamento: CancelamentoReserva = {
        reservaId: selectedReserva,
        nome: cancelData.nome,
        data: cancelData.data,
        motivo: cancelData.motivo,
        motivoPersonalizado: cancelData.motivoPersonalizado
      };
      
      console.log('Enviando dados de cancelamento:', dadosCancelamento);
      
      await reservasApi.cancelarReserva(dadosCancelamento);
      
      setReservas(prev => prev.map(r => 
        r.id === selectedReserva ? { ...r, status: 'cancelada' as const } : r
      ));
      
      // Mostrar pop-up de sucesso
      setModalTitle('Cancelamento Realizado');
      setModalMessage(`Solicitação de cancelamento para ${reservaInfo} realizada com sucesso!\n\nVocê receberá um e-mail de confirmação em breve.`);
      setShowSuccessModal(true);
      
      setShowCancelModal(false);
      setSelectedReserva(null);
      
      // Limpar dados do formulário
      setCancelData({
        nome: '',
        data: '',
        motivo: '',
        motivoPersonalizado: ''
      });
      
    } catch (err) {
      console.error('Erro detalhado ao cancelar reserva:', err);
      
      // Tratamento de erro mais específico
      let mensagemErro = 'Não foi possível processar o cancelamento.';
      let tituloErro = 'Erro no Cancelamento';
      
      if (err instanceof Error) {
        if (err.message.includes('conexão')) {
          tituloErro = 'Problema de Conexão';
          mensagemErro = 'Verifique sua internet e tente novamente.';
        } else if (err.message.includes('autorização')) {
          tituloErro = 'Sessão Expirada';
          mensagemErro = 'Faça login novamente para continuar.';
        } else {
          mensagemErro = err.message;
        }
      }
      
      // Mostrar pop-up de erro
      setModalTitle(tituloErro);
      setModalMessage(`${mensagemErro}\n\nSe o problema persistir, entre em contato com nosso suporte.`);
      setShowErrorModal(true);
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
  const handleEnviarPorEmail = async (reservaId: number) => {
    try {
      const reserva = reservas.find(r => r.id === reservaId);
      if (!reserva) {
        alert('Reserva não encontrada.');
        return;
      }

      await reservasApi.confirmarStatus(reservaId);
      alert(`Comprovante da reserva ${reserva.codigo} enviado por e-mail com sucesso!\n\nO comprovante foi enviado para: ${usuario?.email || 'seu e-mail cadastrado'}`);
    } catch (err) {
      console.error('Erro ao enviar comprovante por e-mail:', err);
      alert('Erro ao enviar comprovante por e-mail. Tente novamente.');
    }
  };

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

      (window as any).enviarComprovanteEmail = (reservaId: number) => {
        handleEnviarPorEmail(reservaId);
      };

      // Gerar comprovante em formato HTML
      const comprovanteHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Comprovante de Reserva - ${reserva.codigo}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              background: #ffffff;
              min-height: 100vh;
              padding: 15px;
              line-height: 1.5;
            }
            .comprovante { 
              background: white; 
              padding: 30px; 
              border-radius: 15px; 
              box-shadow: 0 8px 25px rgba(0,0,0,0.1); 
              max-width: 550px; 
              margin: 0 auto;
              position: relative;
              overflow: hidden;
              border: 1px solid #e5e7eb;
            }
            .comprovante::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 5px;
              background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06d6a0);
            }
            .header { 
              text-align: center; 
              border-bottom: 2px solid #e5e7eb; 
              padding-bottom: 20px; 
              margin-bottom: 25px; 
              position: relative;
            }
            .logo { 
              font-size: 26px; 
              font-weight: 900; 
              background: linear-gradient(135deg, #3b82f6, #8b5cf6);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              margin-bottom: 10px;
              text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .titulo { 
              font-size: 22px; 
              color: #1f2937; 
              margin-bottom: 6px; 
              font-weight: 700;
            }
            .codigo { 
              font-size: 14px; 
              color: #6b7280; 
              background: #f3f4f6;
              padding: 6px 12px;
              border-radius: 20px;
              display: inline-block;
              font-weight: 600;
            }
            .secao { 
              margin-bottom: 25px; 
              background: #fafbfc;
              padding: 18px;
              border-radius: 12px;
              border: 1px solid #e5e7eb;
            }
            .secao-titulo { 
              font-size: 16px; 
              font-weight: 700; 
              color: #374151; 
              margin-bottom: 15px; 
              border-left: 4px solid #3b82f6; 
              padding-left: 15px;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .info-grid { 
              display: grid; 
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
              gap: 15px; 
            }
            .info-item { 
              background: white; 
              padding: 15px; 
              border-radius: 10px; 
              border-left: 3px solid #3b82f6;
              box-shadow: 0 2px 6px rgba(0,0,0,0.05);
              transition: all 0.3s ease;
            }
            .info-item:hover {
              transform: translateY(-1px);
              box-shadow: 0 3px 10px rgba(0,0,0,0.1);
            }
            .info-label { 
              font-size: 11px; 
              color: #6b7280; 
              text-transform: uppercase; 
              font-weight: 700; 
              margin-bottom: 6px; 
              letter-spacing: 0.5px;
            }
            .info-valor { 
              font-size: 15px; 
              color: #1f2937; 
              font-weight: 600; 
            }
            .status { 
              padding: 10px 20px; 
              border-radius: 20px; 
              font-weight: 700; 
              text-align: center; 
              font-size: 14px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .status-confirmada { background: linear-gradient(135deg, #dcfce7, #bbf7d0); color: #166534; border: 2px solid #22c55e; }
            .status-pendente { background: linear-gradient(135deg, #fef3c7, #fde68a); color: #92400e; border: 2px solid #f59e0b; }
            .status-concluida { background: linear-gradient(135deg, #dbeafe, #bfdbfe); color: #1e40af; border: 2px solid #3b82f6; }
            .status-cancelada { background: linear-gradient(135deg, #fee2e2, #fecaca); color: #dc2626; border: 2px solid #ef4444; }
            .valor-total { 
              font-size: 22px; 
              background: linear-gradient(135deg, #059669, #10b981);
              color: white;
              font-weight: 900; 
              text-align: center; 
              padding: 18px; 
              border-radius: 12px; 
              margin: 20px 0;
              box-shadow: 0 4px 15px rgba(5, 150, 105, 0.3);
              text-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            .footer { 
              text-align: center; 
              margin-top: 30px; 
              padding-top: 20px; 
              border-top: 1px solid #e5e7eb; 
              color: #6b7280; 
              font-size: 13px; 
            }
            .qr-placeholder { 
              width: 80px; 
              height: 80px; 
              background: linear-gradient(135deg, #f3f4f6, #e5e7eb); 
              border: 2px dashed #d1d5db; 
              margin: 15px auto; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              color: #9ca3af; 
              font-size: 11px;
              font-weight: 600;
              border-radius: 12px;
            }
            .voltar-btn { 
              position: fixed; 
              top: 25px; 
              left: 25px; 
              background: linear-gradient(135deg, #3b82f6, #2563eb);
              color: white; 
              padding: 15px 25px; 
              border: none; 
              border-radius: 50px; 
              cursor: pointer; 
              font-weight: 700;
              font-size: 16px;
              box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
              transition: all 0.3s ease;
              display: flex;
              align-items: center;
              gap: 10px;
              z-index: 1000;
            }
            .voltar-btn:hover { 
              background: linear-gradient(135deg, #2563eb, #1d4ed8);
              transform: translateY(-2px);
              box-shadow: 0 12px 35px rgba(59, 130, 246, 0.5);
            }
            .voltar-btn:active {
              transform: translateY(0);
            }
            .email-btn { 
              background: linear-gradient(135deg, #3b82f6, #8b5cf6); 
              color: white; 
              padding: 12px 24px; 
              border: none; 
              border-radius: 25px; 
              cursor: pointer; 
              font-weight: 700; 
              font-size: 14px; 
              box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3); 
              transition: all 0.3s ease;
              display: inline-flex;
              align-items: center;
              gap: 8px;
            }
            .email-btn:hover { 
              transform: translateY(-2px); 
              box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4); 
              background: linear-gradient(135deg, #2563eb, #7c3aed);
            }
            .email-btn:active {
              transform: translateY(0);
            }
            .watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 80px;
              color: rgba(59, 130, 246, 0.03);
              font-weight: 900;
              pointer-events: none;
              z-index: 1;
            }
            .badge {
              display: inline-flex;
              align-items: center;
              gap: 4px;
              background: linear-gradient(135deg, #3b82f6, #8b5cf6);
              color: white;
              padding: 4px 8px;
              border-radius: 12px;
              font-size: 11px;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <button class="voltar-btn" onclick="window.close(); window.opener?.focus();">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
            Voltar para Reservas
          </button>
          <div class="comprovante">
            <div class="watermark">HORIZON</div>
            <div class="header">
              <div class="logo">🌅 HORIZON VIAGENS</div>
              <div class="titulo">Comprovante de Reserva</div>
              <div class="codigo">Código: ${reserva.codigo}</div>
            </div>

            <div class="secao">
              <div class="secao-titulo">
                <span>📍</span>
                Informações da Viagem
              </div>
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
              <div class="secao-titulo">
                <span>📋</span>
                Status da Reserva
              </div>
              <div style="text-align: center; padding: 20px;">
                <div class="status status-${reserva.status}">${getStatusText(reserva.status).toUpperCase()}</div>
              </div>
            </div>

            <div class="valor-total">
              💰 Valor Total: R$ ${Number.isFinite(reserva.valor) ? reserva.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
            </div>

            <div class="secao">
              <div class="secao-titulo">
                <span>📅</span>
                Informações da Reserva
              </div>
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
              <div style="margin: 20px 0; text-align: center;">
                <button 
                  class="email-btn"
                  onclick="window.opener && window.opener.enviarComprovanteEmail ? window.opener.enviarComprovanteEmail(${reserva.id}) : alert('Funcionalidade disponível apenas quando aberto pela aplicação principal.')"
                >
                  <span>📧</span>
                  Enviar por E-mail
                </button>
              </div>
              <div style="background: #f8fafc; padding: 15px; border-radius: 10px; margin: 15px 0; border: 1px solid #e2e8f0;">
                <p style="color: #475569; font-weight: 600; margin-bottom: 3px; font-size: 12px;">
                  <strong>🕒 Gerado em:</strong> ${new Date().toLocaleString('pt-BR')}
                </p>
                <p style="color: #64748b; font-size: 11px;">
                  Este comprovante foi gerado automaticamente pelo sistema Horizon Viagens
                </p>
              </div>
              <div style="margin-top: 20px; padding: 15px; background: linear-gradient(135deg, #1e293b, #334155); color: white; border-radius: 10px;">
                <p style="font-size: 14px; font-weight: 700; margin-bottom: 8px;">
                  🌅 <strong>Horizon Viagens</strong> - Expanda seus Horizontes
                </p>
                <p style="margin-bottom: 3px; font-size: 12px;">📞 Contato: (11) 9999-9999</p>
                <p style="margin-bottom: 3px; font-size: 12px;">📧 E-mail: contato@horizon.com</p>
                <p style="font-size: 11px; opacity: 0.8;">Sua próxima aventura começa aqui!</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      // Abrir comprovante em nova aba em vez de substituir a página atual
      const novaAba = window.open('', '_blank');
      if (novaAba) {
        novaAba.document.write(comprovanteHTML);
        novaAba.document.close();
      } else {
        alert('Pop-up bloqueado! Por favor, permita pop-ups e tente novamente.');
      }
      
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
    // Se o usuário não estiver autenticado, redireciona para a página de login
    if (!usuario) {
      navigate('/login');
      return;
    }
    
    const carregarReservas = async () => {
      try {
        setLoading(true);
        setError(null);
        const reservasCarregadas = await reservasApi.buscarReservas(usuario?.usuarioId);
        setReservas(reservasCarregadas);
      } catch (err) {
        console.error('Erro ao carregar reservas:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar reservas');
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
            avaliacao: 8.3,
            estrelas: 3,
            descricao: "Pacote completo para o Rio de Janeiro com 7 dias e 6 noites no coração da Lapa. Hotel bem localizado próximo aos principais pontos turísticos.",
            inclui: ["Hospedagem com café da manhã", "Transfer aeroporto-hotel-aeroporto", "City tour pelos principais pontos turísticos", "Ingresso para o Cristo Redentor", "Passeio de barco na Baía de Guanabara"],
            naoInclui: ["Passagens aéreas", "Refeições (exceto café da manhã)", "Bebidas alcoólicas", "Gastos pessoais", "Seguro viagem"],
            observacoes: "Check-in a partir das 14h. Check-out até 12h. Cancelamento gratuito até 48h antes da viagem."
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
            avaliacao: 8.2,
            estrelas: 4,
            descricao: "Experiência única em Copacabana com 7 dias e 6 noites a poucos metros da praia mais famosa do mundo. Hotel 4 estrelas com vista para o mar.",
            inclui: ["Hospedagem com café da manhã", "Transfer aeroporto-hotel-aeroporto", "Tour pela cidade maravilhosa", "Ingresso para o Pão de Açúcar", "Visita ao Jardim Botânico"],
            naoInclui: ["Passagens aéreas", "Almoço e jantar", "Bebidas", "Compras pessoais", "Seguro viagem"],
            observacoes: "Reserva sujeita à confirmação. Pagamento pendente. Hotel com vista para o mar mediante disponibilidade."
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
            avaliacao: 9.1,
            estrelas: 5,
            descricao: "Paraíso natural único no mundo! 7 dias e 6 noites em Fernando de Noronha com hotel boutique sustentável. Experiência inesquecível no arquipélago.",
            inclui: ["Hospedagem com pensão completa", "Transfer aeroporto-hotel-aeroporto", "Mergulho com cilindro (2 mergulhos)", "Passeio de barco pelas ilhas", "Taxa de preservação ambiental"],
            naoInclui: ["Passagens aéreas", "Bebidas alcoólicas premium", "Mergulhos extras", "Passeios opcionais", "Seguro viagem"],
            observacoes: "Viagem já realizada e concluída com sucesso. Perfeita para casais em lua de mel. Ambiente preservado e sustentável."
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
            avaliacao: 8.8,
            estrelas: 4,
            descricao: "Pacote romântico para Paris com 10 dias e 9 noites no charmoso bairro Le Marais. Hotel boutique com arquitetura histórica francesa.",
            inclui: ["Hospedagem com café da manhã", "Transfer aeroporto-hotel-aeroporto", "Tour pelos principais museus", "Cruzeiro pelo Rio Sena", "Visita à Torre Eiffel"],
            naoInclui: ["Passagens aéreas", "Refeições (exceto café da manhã)", "Bebidas alcoólicas", "Compras", "Seguro viagem"],
            observacoes: "Reserva cancelada pelo cliente. Reembolso processado conforme política de cancelamento. Destino disponível para nova reserva."
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    carregarReservas();
  }, [usuario, navigate]);
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
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-12 text-red-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
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
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
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
                    <path strokeLinecap="round" stroke-linejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
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
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
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
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                    <span>Baixar comprovante</span>
                  </button>
                  <button 
                    onClick={handleAvaliarViagensRapidas}
                    className="w-full flex items-center gap-2 bg-white/40 hover:bg-white/60 px-3 py-2 rounded-lg text-sm font-medium text-yellow-700 transition-all duration-200 hover:scale-105"
                  >
                    <Rating rating={1} size="xs" color="text-yellow-600" />
                    <span>Avaliar viagens</span>
                    {reservas.filter(r => r.status === 'concluida').length > 0 && (
                      <span className="ml-auto bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {reservas.filter(r => r.status === 'concluida').length}
                      </span>
                    )}
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
                          <span className="text-white font-bold text-sm">
                            {reserva.codigo ? reserva.codigo.slice(-3) : '---'}
                          </span>
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
                            src={reserva.imagem || 'https://cdn.pixabay.com/photo/2016/10/18/09/02/hotel-1749602_1280.jpg'}
                            alt={reserva.hotel}
                            className="w-full h-48 lg:h-40 object-cover rounded-xl shadow-lg"
                            onError={(e) => {
                              console.error('Erro ao carregar imagem:', e);
                              (e.target as HTMLImageElement).src = 'https://cdn.pixabay.com/photo/2016/10/18/09/02/hotel-1749602_1280.jpg';
                            }}
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
                          <div className="flex items-center gap-2 bg-purple-100 px-3 py-1 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-purple-600">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                            </svg>
                            <span className="text-sm font-medium text-purple-800">{reserva.pessoas} pessoas</span>
                          </div>
                        </div>
                        {/* Valor e Ações */}
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pt-4 border-t border-white/20">
                          <div className="flex flex-wrap gap-2">
                            {reserva.status === 'confirmada' && (
                              <>
                                <button 
                                  onClick={() => handleDetailsClick(reserva.id)}
                                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                                >
                                  Ver Detalhes
                                </button>
                                <button 
                                  onClick={() => handleCancelClick(reserva.id)}
                                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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
                                <button 
                                  onClick={() => handlePagamentoClick(reserva.id)}
                                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                                  </svg>
                                  Pagar
                                </button>
                                <button 
                                  onClick={() => handleCancelClick(reserva.id)}
                                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  Cancelar
                                </button>
                              </>
                            )}
                            <button 
                              onClick={() => handleBaixarVoucher(reserva.id)}
                              className="bg-white/60 backdrop-blur-sm text-blue-700 border border-blue-300 hover:bg-white/80 hover:border-blue-400 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                              </svg>
                              Comprovante
                            </button>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600 mb-1">Valor Total</div>
                            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                              R$ {Number.isFinite(reserva.valor) ? reserva.valor.toLocaleString() : '--'}
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
                    Nova Reserva
                  </button>
                  <button onClick={() => { setFiltroStatus('todas'); setFiltroData('todas'); }} className="bg-white/60 backdrop-blur-sm text-gray-700 border border-gray-300 hover:bg-white/80 hover:border-gray-400 px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                    Limpar Filtros
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
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-16 text-red-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
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
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 text-amber-600 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
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
                  Sim, desejo cancelar
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
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 text-amber-600 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
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
      
      {/* Modal de Detalhes do Pacote */}
      {showDetailsModal && selectedReserva && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            <div className="p-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Detalhes do Pacote</h2>
                  {(() => {
                    const reserva = reservas.find(r => r.id === selectedReserva);
                    return reserva && (
                      <p className="text-gray-500 text-lg">
                        {reserva.hotel} • {reserva.destino} • Código: <span className="font-mono font-semibold text-blue-600">{reserva.codigo}</span>
                      </p>
                    );
                  })()}
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {(() => {
                const reserva = reservas.find(r => r.id === selectedReserva);
                return reserva && (
                  <div className="space-y-8">
                    {/* Imagem e Informações Principais */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <img
                          src={reserva.imagem || 'https://cdn.pixabay.com/photo/2016/10/18/09/02/hotel-1749602_1280.jpg'}
                          alt={reserva.hotel}
                          className="w-full h-64 object-cover rounded-xl shadow-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://cdn.pixabay.com/photo/2016/10/18/09/02/hotel-1749602_1280.jpg';
                          }}
                        />
                        
                        {/* Cards de Valor e Pessoas */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                            <div className="text-2xl font-bold text-blue-900">R$ {Number.isFinite(reserva.valor) ? reserva.valor.toLocaleString('pt-BR') : '0'}</div>
                            <div className="text-sm text-blue-700 font-medium">Valor Total</div>
                          </div>
                          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                            <div className="text-2xl font-bold text-green-900">{reserva.pessoas}</div>
                            <div className="text-sm text-green-700 font-medium">{reserva.pessoas === 1 ? 'Pessoa' : 'Pessoas'}</div>
                          </div>
                        </div>
                      </div>

                      {/* Descrição */}
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          Sobre o Pacote
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {reserva.descricao || 'Descrição detalhada não disponível no banco de dados. Esta reserva foi criada quando o sistema ainda não armazenava informações detalhadas do pacote.'}
                        </p>
                      </div>
                    </div>

                    {/* O que está incluído */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        O que está incluído
                      </h3>
                      
                      {reserva.inclui && reserva.inclui.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {reserva.inclui.map((item, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <span className="text-gray-800 font-medium">{item}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <p className="text-gray-500 font-medium">Detalhes dos inclusos não disponíveis</p>
                          <p className="text-gray-400 text-sm mt-2">
                            Os dados detalhados deste pacote não estão disponíveis no banco de dados. 
                            Para informações específicas, entre em contato com o suporte.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Observações */}
                    {reserva.observacoes && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          Observações Importantes
                        </h3>
                        <p className="text-gray-700 leading-relaxed font-medium">{reserva.observacoes}</p>
                      </div>
                    )}

                    {/* Botões de Ação */}
                    <div className="flex gap-4 pt-6 border-t border-gray-100">
                      <button
                        onClick={() => setShowDetailsModal(false)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105"
                      >
                        Fechar
                      </button>
                      <button
                        onClick={() => {
                          setShowDetailsModal(false);
                          handleBaixarVoucher(reserva.id);
                        }}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                      >
                        Ver Comprovante
                      </button>
                    </div>
                  </div>
                );
              })()}
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
      
      {/* Modal de Seleção de Avaliação */}
      {showSelectRatingModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-emerald-200/50 border-t-4 border-t-emerald-500">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Selecionar Viagem para Avaliar</h2>
                  <p className="text-slate-600 mt-2">Escolha qual viagem concluída você deseja avaliar</p>
                </div>
                <button
                  onClick={() => setShowSelectRatingModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-2xl font-bold hover:scale-110 transition-all duration-200"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                {reservas
                  .filter(r => r.status === 'concluida')
                  .map((reserva) => (
                    <div 
                      key={reserva.id}
                      className="bg-gradient-to-r from-emerald-50 to-cyan-50 border-2 border-emerald-200 rounded-xl p-4 hover:border-emerald-300 transition-all duration-200 cursor-pointer hover:scale-105"
                      onClick={() => {
                        setShowSelectRatingModal(false);
                        handleRatingClick(reserva.id);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <img
                            src={reserva.imagem || 'https://cdn.pixabay.com/photo/2016/10/18/09/02/hotel-1749602_1280.jpg'}
                            alt={reserva.hotel}
                            className="w-16 h-16 object-cover rounded-lg shadow-md"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://cdn.pixabay.com/photo/2016/10/18/09/02/hotel-1749602_1280.jpg';
                            }}
                          />
                          <div>
                            <h3 className="text-lg font-bold text-slate-800">{reserva.hotel}</h3>
                            <p className="text-slate-600">{reserva.destino}</p>
                            <p className="text-sm text-slate-500">{reserva.dataViagem}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-sm text-slate-600">Código</div>
                            <div className="font-mono font-bold text-emerald-600">{reserva.codigo}</div>
                          </div>
                          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              
              {reservas.filter(r => r.status === 'concluida').length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">Nenhuma viagem concluída encontrada para avaliação</p>
                </div>
              )}
              
              <div className="flex justify-end pt-6 border-t border-gray-100">
                <button
                  onClick={() => setShowSelectRatingModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de Nenhuma Viagem Disponível para Avaliação */}
      {showNoTripsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl shadow-gray-200/50 border-t-4 border-t-amber-500">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8 text-amber-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.563.563 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Nenhuma Viagem para Avaliar</h2>
                <p className="text-slate-600 mb-4">
                  Você não possui viagens concluídas disponíveis para avaliação no momento.
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 text-blue-600 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                  </svg>
                  <span className="font-semibold text-blue-800 text-sm">Como avaliar uma viagem?</span>
                </div>
                <ul className="text-sm text-blue-700 space-y-1 ml-8">
                  <li>• Complete uma viagem (status deve ser "Concluída")</li>
                  <li>• Use o botão "Avaliar" individual em cada reserva</li>
                  <li>• Ou use este botão quando tiver viagens concluídas</li>
                </ul>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowNoTripsModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Entendido
                </button>
                <button
                  onClick={() => {
                    setShowNoTripsModal(false);
                    // Redirecionar para a tela de viagens/pacotes
                    navigate('/');
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                >
                   Planejar Viagem
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Sucesso */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 ease-out scale-95 animate-[scale-in_0.3s_ease-out_forwards]">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8 text-green-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">{modalTitle}</h2>
              <p className="text-slate-600 mb-6 whitespace-pre-line">{modalMessage}</p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Perfeito!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Erro */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 ease-out scale-95 animate-[scale-in_0.3s_ease-out_forwards]">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8 text-red-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">{modalTitle}</h2>
              <p className="text-slate-600 mb-6 whitespace-pre-line">{modalMessage}</p>
              <button
                onClick={() => setShowErrorModal(false)}
                className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
