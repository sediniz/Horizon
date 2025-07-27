using Horizon.Data;
using Horizon.Models;
using Horizon.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace Horizon.Repositories.Implementations
{
    public class PacoteRepository : IPacoteRepository
    {

        private readonly HorizonDbContext _context;

        public PacoteRepository(HorizonDbContext context)
        {
            _context = context;
        }

        public async Task<Pacote> AddAsync(Pacote entity)
        {
            var entry = _context.Pacotes.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entry.Result.Entity;
        }
        public async Task<IEnumerable<Pacote>> GetAllAsync()
        {
            return await _context.Pacotes.ToListAsync();
        }

        public async Task<IEnumerable<Pacote>> GetByDestinoAsync(string destino)
        {
            return await _context.Pacotes
                .Where(p => p.Destino.Equals(destino, StringComparison.OrdinalIgnoreCase))
                .ToListAsync();
        }

        public async Task<IEnumerable<Pacote>> GetByDuracaoAsync(int duracao)
        {
            return await _context.Pacotes
                .Where(p => p.Duracao == duracao)
                .ToListAsync();
        }


        public async Task<Pacote?> GetByIdAsync(int id)
        {
            return await _context.Pacotes
                .FirstOrDefaultAsync(p => p.PacoteId == id);
        }

        public async Task<IEnumerable<Pacote>> GetByQuantidadePessoasAsync(int quantidadePessoas)
        {
            return await _context.Pacotes
                .Where(p => p.QuantidadeDePessoas == quantidadePessoas)
                .ToListAsync();
        }

        public async Task<IEnumerable<Pacote>> GetPacotesDisponiveis(string? destino = null, decimal? valorTotal = null, int? duracaoMax = null)
        {
            return await _context.Pacotes
                .Where(p => (destino == null || p.Destino.Equals(destino, StringComparison.OrdinalIgnoreCase)) &&
                            (valorTotal == null || p.ValorTotal <= valorTotal) &&
                            (duracaoMax == null || p.Duracao <= duracaoMax))
                .ToListAsync();
        }


        public async Task<bool> DeleteAsync(int id)
        {
            return await _context.Pacotes
                 .Where(p => p.PacoteId == id)
                 .ExecuteDeleteAsync() > 0;
        }

        public Task SaveChangesAsync()
        {
            return _context.SaveChangesAsync();
        }

        public async Task<Pacote?> UpdateAsync(Pacote entity)
        {
            var existingPacote = await _context.Pacotes.FindAsync(entity.PacoteId);
            if (existingPacote == null)
                return null;

            existingPacote.Titulo = entity.Titulo;
            existingPacote.Descricao = entity.Descricao;
            existingPacote.Destino = entity.Destino;
            existingPacote.Duracao = entity.Duracao;
            existingPacote.QuantidadeDePessoas = entity.QuantidadeDePessoas;
            existingPacote.ValorTotal = entity.ValorTotal;

            await _context.SaveChangesAsync();
            return existingPacote;
        }
    }
}
