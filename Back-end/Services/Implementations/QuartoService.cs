using Horizon.Models;
using Horizon.Repositories.Interface;
using Horizon.Services.Interfaces;

namespace Horizon.Services.Implementations
{
    public class QuartoService : IQuartoService
    {
        private readonly IQuartoRepository _quartoRepository;

        public QuartoService(IQuartoRepository quartoRepository)
        {
            _quartoRepository = quartoRepository;
        }

        public async Task<IEnumerable<Quarto>> GetAllAsync() =>
            await _quartoRepository.GetAllAsync();

        public async Task<Quarto?> GetByIdAsync(int id) =>
            await _quartoRepository.GetByIdAsync(id);

        public async Task<Quarto> AddAsync(Quarto entity)
        {
            if (entity.ValorDoQuarto < 0)
                throw new ArgumentException("O valor do quarto não pode ser negativo.");

            if (!string.IsNullOrEmpty(entity.Descricao) && entity.Descricao.Length > 50)
                throw new ArgumentException("A descrição deve ter no máximo 50 caracteres.");

            return await _quartoRepository.AddAsync(entity);
        }

        public async Task<Quarto> UpdateAsync(Quarto entity)
        {
            var existente = await _quartoRepository.GetByIdAsync(entity.QuartoId);
            if (existente == null)
                throw new KeyNotFoundException("Quarto não encontrado.");

            if (entity.ValorDoQuarto < 0)
                throw new ArgumentException("O valor do quarto não pode ser negativo.");

            if (!string.IsNullOrEmpty(entity.Descricao) && entity.Descricao.Length > 50)
                throw new ArgumentException("A descrição deve ter no máximo 50 caracteres.");

            return await _quartoRepository.UpdateAsync(entity);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existente = await _quartoRepository.GetByIdAsync(id);
            if (existente == null)
                throw new KeyNotFoundException("Quarto não encontrado.");
            return await _quartoRepository.DeleteAsync(id);
        }

        public async Task SaveChangesAsync() =>
            await _quartoRepository.SaveChangesAsync();

        public async Task<IEnumerable<Quarto>> GetDisponiveisAsync() =>
            await _quartoRepository.GetDisponiveisAsync();

        public async Task<IEnumerable<Quarto>> GetByCaracteristicasAsync(
            bool? ambienteClimatizado = null,
            bool? tv = null,
            bool? varanda = null,
            bool? frigobar = null
        ) =>
            await _quartoRepository.GetByCaracteristicasAsync(ambienteClimatizado, tv, varanda, frigobar);

        public async Task<IEnumerable<Quarto>> GetByFaixaDeValorAsync(decimal valorMin, decimal valorMax)
        {
            if (valorMin < 0 || valorMax < 0)
                throw new ArgumentException("Valores não podem ser negativos.");
            if (valorMin > valorMax)
                throw new ArgumentException("O valor mínimo não pode ser maior que o valor máximo.");


            return await _quartoRepository.GetByFaixaDeValorAsync(valorMin, valorMax);
        }
    }
}
