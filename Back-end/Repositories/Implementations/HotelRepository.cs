using Horizon.Data;
using Horizon.Models;
using Horizon.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace Horizon.Repositories.Implementations
{
    public class HotelRepository : IHotelRepository
    {
        private readonly HorizonDbContext _context;

        public HotelRepository(HorizonDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Hotel>> GetAllAsync()
        {
            return await _context.Hoteis
                .Include(h => h.Avaliacoes) // Incluir avaliações
                .ToListAsync();
        }

        public async Task<Hotel?> GetByIdAsync(int id)
        {
            return await _context.Hoteis
                .Include(h => h.Avaliacoes) // Incluir avaliações
                .FirstOrDefaultAsync(h => h.HotelId == id);
        }

        public async Task<Hotel> AddAsync(Hotel entity)
        {
            _context.Hoteis.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<Hotel> UpdateAsync(Hotel entity)
        {
            _context.Hoteis.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var hotel = await _context.Hoteis.FindAsync(id);
            if (hotel == null) return false;
            _context.Hoteis.Remove(hotel);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Hotel?> GetByNameAsync(string nome)
        {
            return await _context.Hoteis
                .Include(h => h.Avaliacoes) // Incluir avaliações
                .FirstOrDefaultAsync(h => h.Nome == nome);
        }

        public async Task<bool> NameExistsAsync(string nome)
        {
            return await _context.Hoteis.AnyAsync(h => h.Nome == nome);
        }

        public async Task<IEnumerable<Hotel>> GetHotelsByLocalizacaoAsync(string localizacao)
        {
            return await _context.Hoteis
                .Include(h => h.Avaliacoes) // Incluir avaliações
                .Where(h => h.Localizacao == localizacao).ToListAsync();
        }

        public async Task<IEnumerable<Hotel>> GetHotelsDisponiveisAsync(DateTime dataInicio, DateTime dataFim)
        {
            return await _context.Hoteis
                .Include(h => h.Avaliacoes) // Incluir avaliações
                .Where(h => h.DatasDisponiveis >= dataInicio && h.DatasDisponiveis <= dataFim)
                .ToListAsync();
        }

        public async Task<IEnumerable<Hotel>> GetHotelsComCaracteristicasAsync(bool estacionamento, bool petFriendly, bool piscina, bool wifi)
        {
            return await _context.Hoteis
                .Include(h => h.Avaliacoes) // Incluir avaliações
                .Where(h =>
                    h.Estacionamento == estacionamento &&
                    h.PetFriendly == petFriendly &&
                    h.Piscina == piscina &&
                    h.Wifi == wifi)
                .ToListAsync();
        }

        public Task SaveChangesAsync()
        {
            throw new NotImplementedException();
        }
    }
}