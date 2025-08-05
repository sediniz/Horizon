using Horizon.Data;
using Horizon.Models;
using Horizon.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace Horizon.Repositories.Implementations
{
    public class ReservaRepository : IReservaRepository
    {
        private readonly HorizonDbContext _context;

        public ReservaRepository(HorizonDbContext context)
        {
            _context = context;
        }

        public async Task<Reserva> AddAsync(Reserva entity)
        {
            var entry = await _context.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entry.Entity;
        }

    public async Task<IEnumerable<Reserva>> GetAllAsync()
    {
        // Carrega explicitamente todas as propriedades necessárias, incluindo Imagens dos hotéis
        return await _context.Reservas
            .Include(r => r.Hotel)
            .Include(r => r.Usuario)
            .Include(r => r.Pacote)
                .ThenInclude(p => p.Hotel)
            .AsNoTracking() // Melhora o desempenho para consultas de leitura
            .ToListAsync();
    }

    public async Task<Reserva?> GetByIdAsync(int id)
    {
        return await _context.Reservas
            .Include(r => r.Hotel)
            .Include(r => r.Usuario)
            .Include(r => r.Pacote)
            .Include(r => r.Pacote.Hotel)
            .FirstOrDefaultAsync(r => r.ReservaId == id);
    }        public async Task<IEnumerable<Reserva>> GetReservasByClienteIdAndPeriodoAsync(int usuarioId, DateTime dataInicio, DateTime dataFim)
        {
            return await _context.Reservas
                .Include(r => r.Hotel)
                .Include(r => r.Pacote)
                .Include(r => r.Pacote.Hotel)
                .Where(r => r.UsuarioId == usuarioId && r.DataInicio >= dataInicio && r.DataFim <= dataFim)
                .ToListAsync();
        }

    public async Task<IEnumerable<Reserva>> GetReservasByClienteIdAsync(int usuarioId)
    {
        return await _context.Reservas
            .Include(r => r.Hotel)
            .Include(r => r.Pacote)
                .ThenInclude(p => p.Hotel)
            .Where(r => r.UsuarioId == usuarioId)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<IEnumerable<Reserva>> GetReservasByDataAsync(DateTime data)
    {
        return await _context.Reservas
            .Include(r => r.Hotel)
            .Include(r => r.Pacote)
            .Include(r => r.Pacote.Hotel)
            .Where(r => r.DataInicio.Date <= data.Date && r.DataFim.Date >= data.Date)
            .ToListAsync();
    }

    public async Task<IEnumerable<Reserva>> GetReservasByHotelIdAsync(int hotelId)
    {
        return await _context.Reservas
            .Include(r => r.Hotel)
            .Include(r => r.Usuario)
            .Include(r => r.Pacote)
            .Include(r => r.Pacote.Hotel)
            .Where(r => r.HotelId == hotelId)
            .ToListAsync();
    }        public async Task<bool> DeleteAsync(int id)
        {
            return await _context.Reservas
                .Where(r => r.ReservaId == id)
                .ExecuteDeleteAsync() > 0;
        }

        public Task SaveChangesAsync()
        {
            return _context.SaveChangesAsync();
        }



        public Task<Reserva> UpdateAsync(Reserva entity)
        {
            return _context.Reservas
                .Where(r => r.ReservaId == entity.ReservaId)
                .ExecuteUpdateAsync(r => r.SetProperty(x => x.Status, entity.Status)
                                           .SetProperty(x => x.DataInicio, entity.DataInicio)
                                           .SetProperty(x => x.DataFim, entity.DataFim)
                                           .SetProperty(x => x.UsuarioId, entity.UsuarioId)
                                           .SetProperty(x => x.HotelId, entity.HotelId))
                .ContinueWith(t => entity);
        }

        public async Task<bool> AlterarStatusReservaAsync(int reservaId, StatusReserva novoStatus)
        {
           return await _context.Reservas
                .Where(r => r.ReservaId == reservaId)
                .ExecuteUpdateAsync(r => r.SetProperty(x => x.Status, novoStatus)) > 0;
        }
    }
}
