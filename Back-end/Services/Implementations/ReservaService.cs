using Horizon.Models;
using Horizon.Repositories.Interface;
using Horizon.Services.Interfaces;

namespace Horizon.Services.Implementations
{
    public class ReservaService : IReserva
    {
        private readonly IReservaRepository _reservaRepository;
        
        public ReservaService(IReservaRepository reservaRepository)
        {
            _reservaRepository = reservaRepository;
        }

        public async Task<Reserva> AddAsync(Reserva entity)
        {
            // Lógica de negócio: Validações antes de adicionar
            ValidarReserva(entity);
            
            // Verificar disponibilidade do hotel nas datas
            await VerificarDisponibilidadeAsync(entity.HotelId, entity.DataInicio, entity.DataFim);
            
            // Definir status inicial
            entity.Status = StatusReserva.Pendente;
            
            return await _reservaRepository.AddAsync(entity);
        }

        public async Task<bool> AlterarStatusReservaAsync(int reservaId, StatusReserva novoStatus)
        {
            var reserva = await _reservaRepository.GetByIdAsync(reservaId);
            if (reserva == null)
                throw new ArgumentException("Reserva não encontrada");

            // Lógica de negócio: Validar transições de status
            ValidarTransicaoStatus(reserva.Status, novoStatus);
            
            return await _reservaRepository.AlterarStatusReservaAsync(reservaId, novoStatus);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var reserva = await _reservaRepository.GetByIdAsync(id);
            if (reserva == null)
                return false;

            // Lógica de negócio: Só permitir cancelar se não estiver confirmada
            if (reserva.Status == StatusReserva.Confirmada)
                throw new InvalidOperationException("Não é possível excluir uma reserva confirmada");

            return await _reservaRepository.DeleteAsync(id);
        }

        // Métodos de consulta - delegam diretamente ao repositório
        public async Task<IEnumerable<Reserva>> GetAllAsync() 
            => await _reservaRepository.GetAllAsync();

        public async Task<Reserva?> GetByIdAsync(int id) 
            => await _reservaRepository.GetByIdAsync(id);

        public async Task<IEnumerable<Reserva>> GetReservasByClienteIdAsync(int clienteId) 
        {
            // Validação: Cliente existe?
            if (clienteId <= 0)
                throw new ArgumentException("ID do cliente inválido");
            
            // Lógica: Filtrar apenas reservas que o usuário pode ver?
            // Ex: Admin vê todas, cliente vê apenas suas próprias
            
            return await _reservaRepository.GetReservasByClienteIdAsync(clienteId);
        }

        public async Task<IEnumerable<Reserva>> GetReservasByHotelIdAsync(int hotelId) 
        {
            // Validação: Hotel existe?
            if (hotelId <= 0)
                throw new ArgumentException("ID do hotel inválido");
            
            // Lógica: Aplicar filtros de privacidade/segurança?
            var reservas = await _reservaRepository.GetReservasByHotelIdAsync(hotelId);
            
            // Ex: Ocultar dados sensíveis para determinados usuários
            return reservas;
        }

        public async Task<IEnumerable<Reserva>> GetReservasByDataAsync(DateTime data) 
        {
            // Validação: Data válida?
            if (data == default(DateTime))
                throw new ArgumentException("Data inválida");
            
            // Lógica: Limitar consultas muito antigas?
            var limiteMeses = DateTime.Now.AddMonths(-12);
            if (data < limiteMeses)
                throw new ArgumentException("Consulta limitada aos últimos 12 meses");
            
            return await _reservaRepository.GetReservasByDataAsync(data);
        }

        public async Task<IEnumerable<Reserva>> GetReservasByClienteIdAndPeriodoAsync(int clienteId, DateTime dataInicio, DateTime dataFim) 
            => await _reservaRepository.GetReservasByClienteIdAndPeriodoAsync(clienteId, dataInicio, dataFim);

        public async Task<Reserva> UpdateAsync(Reserva entity)
        {
            ValidarReserva(entity);
            return await _reservaRepository.UpdateAsync(entity);
        }

        public async Task SaveChangesAsync() 
            => await _reservaRepository.SaveChangesAsync();

        // Métodos privados com lógica de negócio
        private void ValidarReserva(Reserva reserva)
        {
            if (reserva.DataInicio >= reserva.DataFim)
                throw new ArgumentException("Data de início deve ser anterior à data de fim");

            if (reserva.DataInicio < DateTime.Today)
                throw new ArgumentException("Data de início não pode ser no passado");
        }

        private async Task VerificarDisponibilidadeAsync(int hotelId, DateTime dataInicio, DateTime dataFim)
        {
            var reservasConflitantes = await _reservaRepository.GetReservasByHotelIdAsync(hotelId);
            
            bool temConflito = reservasConflitantes.Any(r => 
                r.Status != StatusReserva.Cancelada &&
                ((dataInicio >= r.DataInicio && dataInicio < r.DataFim) ||
                 (dataFim > r.DataInicio && dataFim <= r.DataFim) ||
                 (dataInicio <= r.DataInicio && dataFim >= r.DataFim)));

            if (temConflito)
                throw new InvalidOperationException("Hotel não disponível nas datas solicitadas");
        }

        private void ValidarTransicaoStatus(StatusReserva statusAtual, StatusReserva novoStatus)
        {
            // Lógica de negócio: Definir transições válidas
            var transicoesValidas = new Dictionary<StatusReserva, StatusReserva[]>
            {
                { StatusReserva.Pendente, new[] { StatusReserva.Confirmada, StatusReserva.Cancelada } },
                { StatusReserva.Confirmada, new[] { StatusReserva.Cancelada } },
                { StatusReserva.Cancelada, new StatusReserva[] { } } // Não pode sair de cancelada
            };

            if (!transicoesValidas[statusAtual].Contains(novoStatus))
                throw new InvalidOperationException($"Transição de {statusAtual} para {novoStatus} não é permitida");
        }
    }
}
