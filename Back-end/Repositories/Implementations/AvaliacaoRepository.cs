using Horizon.Data;
using Horizon.Models;
using Horizon.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace Horizon.Repositories.Implementations
{
    public class AvaliacaoRepository : IAvaliacaoRepository
    {
        private readonly HorizonDbContext _context;

        public AvaliacaoRepository(HorizonDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Avaliacao>> GetAllAsync()
        {
            return await _context.Avaliacoes
                .Include(a => a.Usuario)
                .Include(a => a.Hotel)
                .ToListAsync();
        }

        public async Task<Avaliacao?> GetByIdAsync(int id)
        {
            return await _context.Avaliacoes
                .Include(a => a.Usuario)
                .Include(a => a.Hotel)
                .FirstOrDefaultAsync(a => a.IdAvaliacao == id);
        }

        public async Task<Avaliacao> AddAsync(Avaliacao entity)
        {
            var entry = await _context.Avaliacoes.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entry.Entity;
        }

        public async Task<Avaliacao> UpdateAsync(Avaliacao entity)
        {
            _context.Avaliacoes.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var avaliacao = await _context.Avaliacoes.FindAsync(id);
            if (avaliacao == null) return false;
            _context.Avaliacoes.Remove(avaliacao);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Avaliacao>> GetAvaliacoesByHotelIdAsync(int hotelId)
        {
            return await _context.Avaliacoes
                .Include(a => a.Usuario)
                .Include(a => a.Hotel)
                .Where(a => a.hotelId == hotelId)
                .ToListAsync();
        }

        public async Task<Avaliacao?> GetAvaliacaoByUsuarioAndHotelAsync(int usuarioId, int hotelId)
        {
            return await _context.Avaliacoes
                .FirstOrDefaultAsync(a => a.IdUsuario == usuarioId && a.hotelId == hotelId);
        }

        public async Task<bool> AvaliacaoExistsAsync(int usuarioId, int hotelId)
        {
            return await _context.Avaliacoes
                .AnyAsync(a => a.IdUsuario == usuarioId && a.hotelId == hotelId);
        }

        public async Task<double> GetMediaAvaliacoesByHotelIdAsync(int hotelId)
        {
            return await _context.Avaliacoes
                .Where(a => a.hotelId == hotelId)
                .Select(a => (double)a.Nota)
                .DefaultIfEmpty(0)
                .AverageAsync();
        }

        public async Task<int> GetQuantidadeAvaliacoesByHotelIdAsync(int hotelId)
        {
            return await _context.Avaliacoes
                .CountAsync(a => a.hotelId == hotelId);
        }
    }
}
