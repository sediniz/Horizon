using Horizon.Models;
using Horizon.Repositories.Implementations;
using Horizon.Repositories.Interface;
using Horizon.Services.Interfaces;

namespace Horizon.Services.Implementations
{
    public class PacoteService : IPacoteService
    {
        private readonly IPacoteRepository _pacoteRepository;

        public PacoteService(IPacoteRepository pacoteRepository)
        {
            _pacoteRepository = pacoteRepository;
        }
         
        public async Task<Pacote> AddAsync(Pacote entity)
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));

            return await _pacoteRepository.AddAsync(entity);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _pacoteRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<Pacote>> GetAllAsync()
        {
            return await _pacoteRepository.GetAllAsync();
        }

        public async Task<IEnumerable<Pacote>> GetByDestinoAsync(string destino)
        {
            if (string.IsNullOrWhiteSpace(destino))
                throw new ArgumentException("Destino não pode ser nulo ou vazio", nameof(destino));

            var pacotes = await _pacoteRepository.GetAllAsync();
            return pacotes.Where(p => p.Destino != null && 
                                    p.Destino.Contains(destino, StringComparison.OrdinalIgnoreCase));
        }

        public async Task<IEnumerable<Pacote>> GetByDuracaoAsync(int duracao)
        {
            if (duracao <= 0)
                throw new ArgumentException("Duração deve ser maior que zero", nameof(duracao));

            var pacotes = await _pacoteRepository.GetAllAsync();
            return pacotes.Where(p => p.Duracao == duracao);
        }

        public async Task<Pacote?> GetByIdAsync(int id)
        {
            return await _pacoteRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Pacote>> GetByQuantidadePessoasAsync(int quantidadePessoas)
        {
            if (quantidadePessoas <= 0)
                throw new ArgumentException("Quantidade de pessoas deve ser maior que zero", nameof(quantidadePessoas));

            var pacotes = await _pacoteRepository.GetAllAsync();
            return pacotes.Where(p => p.QuantidadeDePessoas >= quantidadePessoas);
        }

        public async Task<IEnumerable<Pacote>> GetPacotesDisponiveis(string? destino = null, decimal? precoMax = null, int? duracaoMax = null)
        {
            var pacotes = await _pacoteRepository.GetAllAsync();
            var query = pacotes.AsQueryable();

            if (!string.IsNullOrWhiteSpace(destino))
            {
                query = query.Where(p => p.Destino != null && 
                                       p.Destino.Contains(destino, StringComparison.OrdinalIgnoreCase));
            }

            if (precoMax.HasValue)
            {
                query = query.Where(p => p.ValorTotal <= precoMax.Value);
            }

            if (duracaoMax.HasValue)
            {
                query = query.Where(p => p.Duracao <= duracaoMax.Value);
            }

            return query.ToList();
        }

        public async Task SaveChangesAsync()
        {
            await _pacoteRepository.SaveChangesAsync();
        }

        public async Task<Pacote> UpdateAsync(Pacote entity)
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));

            return await _pacoteRepository.UpdateAsync(entity);
        }
    }
}
