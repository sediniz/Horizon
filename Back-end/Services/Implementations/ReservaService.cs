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
                // Passamos o ID da reserva atual (0 para uma nova) para não considerá-la na verificação
                int? reservaIdAtual = entity.ReservaId > 0 ? entity.ReservaId : null;
                await VerificarDisponibilidadeAsync(
                    entity.HotelId.Value, 
                    entity.DataInicio, 
                    entity.DataFim, 
                    reservaIdAtual,
                    entity.QuantidadePessoas
                );
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
            
            // Verificar disponibilidade do hotel nas datas (apenas se houver HotelId)
            // Ao atualizar uma reserva existente, precisamos ignorar a própria reserva na verificação de conflitos
            if (entity.HotelId.HasValue)
            {
                await VerificarDisponibilidadeAsync(
                    entity.HotelId.Value,
                    entity.DataInicio,
                    entity.DataFim,
                    entity.ReservaId,
                    entity.QuantidadePessoas
                );
            }
            
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

        private async Task VerificarDisponibilidadeAsync(int hotelId, DateTime dataInicio, DateTime dataFim, int? reservaIdAtual = null, int quantidadePessoas = 1)
        {
            Console.WriteLine($"========== VERIFICAÇÃO DE DISPONIBILIDADE ==========");
            Console.WriteLine($"HotelID: {hotelId}, Período: {dataInicio:yyyy-MM-dd} até {dataFim:yyyy-MM-dd}");
            Console.WriteLine($"Quantidade de pessoas para esta reserva: {quantidadePessoas}");
            
            if (reservaIdAtual.HasValue)
            {
                Console.WriteLine($"ReservaID atual (ignorada na verificação): {reservaIdAtual}");
            }
            
            // Obter informações do hotel para verificar o número total de quartos
            var hotel = await _hotelRepository.GetByIdAsync(hotelId);
            if (hotel == null)
            {
                Console.WriteLine($"ERRO: Hotel com ID {hotelId} não encontrado");
                throw new ArgumentException($"Hotel com ID {hotelId} não encontrado");
            }
            
            Console.WriteLine($"Nome do Hotel: {hotel.Nome}, Quartos Totais: {hotel.QuantidadeDeQuartos}");
            
            int totalQuartosHotel = hotel.QuantidadeDeQuartos;
            
            // Se a quantidade de quartos for 0, atribuir um valor padrão (provavelmente um erro nos dados)
            if (totalQuartosHotel <= 0)
            {
                Console.WriteLine($"AVISO: Quantidade de quartos inválida ({totalQuartosHotel}). Assumindo valor padrão de 1.");
                totalQuartosHotel = 1;
            }
            
            // Obter reservas existentes que se sobrepõem ao período solicitado
            var reservasConflitantes = await _reservaRepository.GetReservasByHotelIdAsync(hotelId);
            
            Console.WriteLine($"🏨 Verificando disponibilidade para Hotel {hotelId} de {dataInicio:yyyy-MM-dd} até {dataFim:yyyy-MM-dd}");
            Console.WriteLine($"🛏️ Total de quartos no hotel: {totalQuartosHotel}");
            Console.WriteLine($"📋 Encontradas {reservasConflitantes.Count()} reservas existentes para este hotel");
            
            // Filtrar apenas as reservas ativas (não canceladas) e excluir a reserva atual (se existir)
            var reservasAtivas = reservasConflitantes
                .Where(r => r.Status != StatusReserva.Cancelada && 
                       (!reservaIdAtual.HasValue || r.ReservaId != reservaIdAtual.Value))
                .ToList();
            
            Console.WriteLine($"Total de reservas ativas para este hotel (excluindo a atual): {reservasAtivas.Count}");
            
            // Mostrar todas as reservas ativas
            foreach (var reserva in reservasAtivas)
            {
                Console.WriteLine($"   - Reserva {reserva.ReservaId}: {reserva.DataInicio:yyyy-MM-dd} até {reserva.DataFim:yyyy-MM-dd} (Status: {reserva.Status})");
            }
            
            // Verificar para cada dia se temos quartos suficientes
            Console.WriteLine($"Verificando disponibilidade dia a dia (total quartos: {totalQuartosHotel})");
            bool temConflito = false;
            
            // Para a nova reserva: quantas pessoas (= quantos quartos)
            int quartosNecessarios = quantidadePessoas;
            Console.WriteLine($"Quartos necessários para esta reserva: {quartosNecessarios}");
            
            for (var data = dataInicio.Date; data < dataFim.Date; data = data.AddDays(1))
            {
                // Contar quantos QUARTOS estão ocupados nesta data específica
                // Cada reserva ocupa tantos quartos quanto o número de pessoas
                int quartosOcupados = 0;
                
                foreach (var r in reservasAtivas.Where(r => data >= r.DataInicio.Date && data < r.DataFim.Date))
                {
                    // Cada reserva ocupa o número de quartos correspondente à quantidade de pessoas
                    quartosOcupados += r.QuantidadePessoas > 0 ? r.QuantidadePessoas : 1;
                    Console.WriteLine($"      Reserva {r.ReservaId} ocupa {r.QuantidadePessoas} quarto(s)");
                }
                
                Console.WriteLine($"   - Data {data:yyyy-MM-dd}: {quartosOcupados}/{totalQuartosHotel} quartos ocupados, necessários mais {quartosNecessarios}");
                
                // Verificar se há quartos disponíveis suficientes para esta nova reserva
                if (quartosOcupados + quartosNecessarios > totalQuartosHotel)
                {
                    Console.WriteLine($"❌ CONFLITO DETECTADO para Hotel {hotelId} na data {data:yyyy-MM-dd}: {quartosOcupados} já ocupados + {quartosNecessarios} necessários > {totalQuartosHotel} disponíveis");
                    temConflito = true;
                    break;
                }
            }
            
            if (temConflito)
            {
                Console.WriteLine($"🚫 CONFLITO DETECTADO para Hotel {hotelId} no período {dataInicio:yyyy-MM-dd} até {dataFim:yyyy-MM-dd}");
                throw new InvalidOperationException($"Hotel não tem quartos disponíveis no período solicitado. Todos os {totalQuartosHotel} quartos estão ocupados em pelo menos um dia do período.");
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
