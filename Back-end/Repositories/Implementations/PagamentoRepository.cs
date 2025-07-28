using Horizon.Data;
using Horizon.Models;
using Horizon.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace Horizon.Repositories.Implementations
{

    public class PagamentoRepository : IPagamentoRepository
    {

        private readonly HorizonDbContext _context;

        public PagamentoRepository(HorizonDbContext context)
        {
            _context = context;
        }

        // Adiciona um novo pagamento
        public async Task<Pagamento> AddAsync(Pagamento entity)
        {
            var entry = await _context.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entry.Entity;
        }

        // Deleta um pagamento específico por ID
        public async Task<bool> DeleteAsync(int id)
        {
            return await _context.Pagamentos
                 .Where(p => p.PagamentoId == id)
                 .ExecuteDeleteAsync() > 0;
        }

        // Obtém todos os pagamentos
        public async Task<IEnumerable<Pagamento>> GetAllAsync()
        {
            return await _context.Pagamentos
                .Include(p => p.Reserva)
                .Include(p => p.Reserva.Usuario)
                .ToListAsync();
        }

        // Obtém todos os pagamentos aprovados (reservas confirmadas)
        public async Task<IEnumerable<Pagamento>> GetAprovadosAsync()
        {
              return await _context.Pagamentos
                .Where(p => p.Reserva != null && p.Reserva.Status == StatusReserva.Confirmada)
                .ToListAsync();
        }

        // Obtém um pagamento específico por ID
        public async Task<Pagamento?> GetByIdAsync(int id)
        {
            return await _context.Pagamentos
                .Include(p => p.Reserva)
                .Include(p => p.Reserva.Usuario)
                .FirstOrDefaultAsync(p => p.PagamentoId == id);
        }

        // Obtém todos os pagamentos realizados em um período específico
        public async Task<IEnumerable<Pagamento>> GetByPeriodoAsync(DateTime dataInicio, DateTime dataFim)
        {
            return await _context.Pagamentos
                .Where(p => p.DataPagamento >= dataInicio && p.DataPagamento <= dataFim)
                .ToListAsync();
        }

        // Obtém todos os pagamentos relacionados a uma reserva específica
        public async Task<IEnumerable<Pagamento>> GetByReservaIdAsync(int reservaId)
        {
            return await _context.Pagamentos
                .Where(p => p.ReservaId == reservaId)
                .Include(p => p.Reserva)
                .Include(p => p.Reserva.Usuario)
                .ToListAsync();
        }

        // Obtém todos os pagamentos por status
        public async Task<IEnumerable<Pagamento>> GetByStatusAsync(string status)
        {
            return await _context.Pagamentos
                .Where(p => p.StatusPagamento.Equals(status, StringComparison.OrdinalIgnoreCase))
                .Include(p => p.Reserva)
                .Include(p => p.Reserva.Usuario)
                .ToListAsync();
        }

        // Obtém todos os pagamentos por tipo
        public async Task<IEnumerable<Pagamento>> GetByTipoAsync(string tipo)
        {
            return await _context.Pagamentos
                .Where(p => p.TipoPagamento.Equals(tipo, StringComparison.OrdinalIgnoreCase))
                .Include(p => p.Reserva)
                .Include(p => p.Reserva.Usuario)
                .ToListAsync();
        }

        // Obtém todos os pagamentos pendentes
        public async Task<IEnumerable<Pagamento>> GetPendentesAsync()
        {
            return await _context.Pagamentos
                .Where(p => p.StatusPagamento.Equals("Pendente", StringComparison.OrdinalIgnoreCase))
                .Include(p => p.Reserva)
                .Include(p => p.Reserva.Usuario)
                .ToListAsync();
        }

        // Obtém o valor total pago para uma reserva específica
        public async Task<decimal> GetValorTotalPagoAsync(int reservaId)
        {
            return await _context.Pagamentos
                .Where(p => p.ReservaId == reservaId && p.StatusPagamento.Equals("Aprovado", StringComparison.OrdinalIgnoreCase))
                .SumAsync(p => p.ValorPagamento);
        }

        // Verifica se existe um pagamento aprovado para uma reserva específica
        public async Task<bool> HasPagamentoAprovadoAsync(int reservaId)
        {
            return await _context.Pagamentos
                .AnyAsync(p => p.ReservaId == reservaId && p.StatusPagamento.Equals("Aprovado", StringComparison.OrdinalIgnoreCase));
        }

        public Task SaveChangesAsync()
        {
            return _context.SaveChangesAsync();
        }

        // Atualiza um pagamento existente
        public Task<Pagamento> UpdateAsync(Pagamento entity)
        {
            return _context.Pagamentos
                .Where(p => p.PagamentoId == entity.PagamentoId)
                .ExecuteUpdateAsync(p => p
                    .SetProperty(p => p.StatusPagamento, entity.StatusPagamento)
                    .SetProperty(p => p.DataPagamento, entity.DataPagamento)
                    .SetProperty(p => p.ValorPagamento, entity.ValorPagamento)
                    .SetProperty(p => p.TipoPagamento, entity.TipoPagamento))
                .ContinueWith(t => entity);
        }


        // Atualiza o status de um pagamento específico
        public async Task<bool> UpdateStatusAsync(int pagamentoId, string novoStatus)
        {
            return await _context.Pagamentos
                .Where(p => p.PagamentoId == pagamentoId)
                .ExecuteUpdateAsync(p => p.SetProperty(x => x.StatusPagamento, novoStatus)) > 0;
        }
    }
}
