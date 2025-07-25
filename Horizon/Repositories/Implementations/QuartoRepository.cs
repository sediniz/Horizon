using Horizon.Data;
using Horizon.Models;
using Horizon.Repositories.Interface;
using Microsoft.EntityFrameworkCore;


namespace Horizon.Repositories.Implementations
{
    public class QuartoRepository : IQuartoRepository
    {
        private readonly HorizonDbContext _context;

        public QuartoRepository(HorizonDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Quarto>> GetAllAsync()
        {
            return await _context.Quartos.ToListAsync();
        }

        public async Task<Quarto?> GetByIdAsync(int id)
        {
            return await _context.Quartos.FindAsync(id);
        }

        public async Task<Quarto> AddAsync(Quarto entity)
        {
            var entry = await _context.Quartos.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entry.Entity;
        }

        public async Task<Quarto> UpdateAsync(Quarto entity)
        {
            _context.Quartos.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var quarto = await _context.Quartos.FindAsync(id);
            if (quarto == null) return false;
            _context.Quartos.Remove(quarto);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Quarto>> GetDisponiveisAsync()
        {
            return await _context.Quartos
                .Where(q => q.Disponibilidade)
                .ToListAsync();
        }

        public async Task<IEnumerable<Quarto>> GetByCaracteristicasAsync(
            bool? ambienteClimatizado = null,
            bool? tv = null,
            bool? varanda = null,
            bool? frigobar = null)
        {
            var query = _context.Quartos.AsQueryable();

            if (ambienteClimatizado.HasValue)
                query = query.Where(q => q.AmbienteClimatizado == ambienteClimatizado.Value);
            if (tv.HasValue)
                query = query.Where(q => q.Tv == tv.Value);
            if (varanda.HasValue)
                query = query.Where(q => q.Varanda == varanda.Value);
            if (frigobar.HasValue)
                query = query.Where(q => q.Frigobar == frigobar.Value);

            return await query.ToListAsync();
        }

        public async Task<IEnumerable<Quarto>> GetByFaixaDeValorAsync(decimal valorMin, decimal valorMax)
        {
            return await _context.Quartos
                .Where(q => q.ValorDoQuarto >= valorMin && q.ValorDoQuarto <= valorMax)
                .ToListAsync();
        }
    }
}