using Horizon.Data;
using Horizon.Models;
using Horizon.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace Horizon.Repositories.Implementations
{
    public class ReservaRepository : IReservaRepository
    {
        private readonly HorizonDbContext _context;

        public async Task<Reserva> AddAsync(Reserva entity)
        {
            var entry = await _context.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entry.Entity;
        }

        public async Task<IEnumerable<Reserva>> GetAllAsync()
        {
            return await _context.Reservas.ToListAsync();
        }

        public async Task<Reserva?> GetByIdAsync(int id)
        {
            return await _context.Reservas.FindAsync(id).AsTask();
        }

        public async Task<IEnumerable<Reserva>> GetReservasByClienteIdAndPeriodoAsync(int usuarioId, DateTime dataInicio, DateTime dataFim)
        {
            return await _context.Reservas
                .Where(r => r.UsuarioId == usuarioId && r.DataInicio >= dataInicio && r.DataFim <= dataFim)
                .ToListAsync();
        }

        public async Task<IEnumerable<Reserva>> GetReservasByClienteIdAsync(int usuarioId)
        {
            return await _context.Reservas
                .Where(r => r.UsuarioId == usuarioId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Reserva>> GetReservasByDataAsync(DateTime data)
        {
            return await _context.Reservas
                .Where(r => r.DataInicio.Date <= data.Date && r.DataFim.Date >= data.Date)
                .ToListAsync();
        }

        public async Task<IEnumerable<Reserva>> GetReservasByHotelIdAsync(int hotelId)
        {
            return await _context.Reservas
                .Where(r => r.HotelId == hotelId)
                .ToListAsync();
        }

        public async Task<bool> DeleteAsync(int id)
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
