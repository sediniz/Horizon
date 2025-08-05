using Horizon.Models;
using Horizon.Repositories.Interface;
using Horizon.Services.Interfaces;
using System.Collections.Generic;
using System.Linq;

namespace Horizon.Services.Implementations
{
    public class ReservaService : IReservaService
    {
        private readonly IReservaRepository _reservaRepository;
        private readonly IHotelRepository _hotelRepository;
        
        public ReservaService(IReservaRepository reservaRepository, IHotelRepository hotelRepository)
        {
            _reservaRepository = reservaRepository;
            _hotelRepository = hotelRepository;
        }

        public async Task<Reserva> AddAsync(Reserva entity)
        {
            // Lógica de negócio: Validações antes de adicionar
            ValidarReserva(entity);
            
            // Verificar disponibilidade do hotel nas datas (apenas se houver HotelId)
            if (entity.HotelId.HasValue)
            {
                await VerificarDisponibilidadeAsync(entity.HotelId.Value, entity.DataInicio, entity.DataFim);
            }
            
            // Definir status inicial apenas se não foi definido
            if (entity.Status == default(StatusReserva))
            {
                entity.Status = StatusReserva.Pendente;
            }
            
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
            // Obter informações do hotel para verificar o número total de quartos
            var hotel = await _hotelRepository.GetByIdAsync(hotelId);
            if (hotel == null)
            {
                throw new ArgumentException($"Hotel com ID {hotelId} não encontrado");
            }
            
            int totalQuartosHotel = hotel.QuantidadeDeQuartos;
            
            // Obter reservas existentes que se sobrepõem ao período solicitado
            var reservasConflitantes = await _reservaRepository.GetReservasByHotelIdAsync(hotelId);
            
            Console.WriteLine($"🏨 Verificando disponibilidade para Hotel {hotelId} de {dataInicio:yyyy-MM-dd} até {dataFim:yyyy-MM-dd}");
            Console.WriteLine($"�️ Total de quartos no hotel: {totalQuartosHotel}");
            Console.WriteLine($"�📋 Encontradas {reservasConflitantes.Count()} reservas existentes para este hotel");
            
            // Filtrar apenas as reservas que se sobrepõem ao período solicitado e não estão canceladas
            var reservasSobrepostas = reservasConflitantes.Where(r => 
                r.Status != StatusReserva.Cancelada &&
                ((dataInicio >= r.DataInicio && dataInicio < r.DataFim) ||
                 (dataFim > r.DataInicio && dataFim <= r.DataFim) ||
                 (dataInicio <= r.DataInicio && dataFim >= r.DataFim))
            ).ToList();
            
            foreach (var reserva in reservasSobrepostas)
            {
                Console.WriteLine($"   - Reserva {reserva.ReservaId}: {reserva.DataInicio:yyyy-MM-dd} até {reserva.DataFim:yyyy-MM-dd} (Status: {reserva.Status})");
            }
            
            // Verificar para cada dia se temos quartos suficientes
            for (var data = dataInicio.Date; data < dataFim.Date; data = data.AddDays(1))
            {
                // Contar quantas reservas ocupam esta data específica
                int quartosOcupados = reservasSobrepostas.Count(r => 
                    r.Status != StatusReserva.Cancelada &&
                    data >= r.DataInicio.Date && data < r.DataFim.Date
                );
                
                if (quartosOcupados >= totalQuartosHotel)
                {
                    Console.WriteLine($"❌ CONFLITO DETECTADO para Hotel {hotelId} na data {data:yyyy-MM-dd}: {quartosOcupados}/{totalQuartosHotel} quartos ocupados");
                    throw new InvalidOperationException($"Hotel não tem quartos disponíveis na data {data:dd/MM/yyyy}");
                }
            }
            
            Console.WriteLine($"✅ Hotel {hotelId} tem quartos disponíveis no período {dataInicio:yyyy-MM-dd} até {dataFim:yyyy-MM-dd}");
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
