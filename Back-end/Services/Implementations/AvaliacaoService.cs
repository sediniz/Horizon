using Horizon.Models;
using Horizon.Repositories.Interface;
using Horizon.Services.Interfaces;

namespace Horizon.Services.Implementations
{
    public class AvaliacaoService : IAvaliacaoService
    {
        private readonly IAvaliacaoRepository _avaliacaoRepository;

        public AvaliacaoService(IAvaliacaoRepository avaliacaoRepository)
        {
            _avaliacaoRepository = avaliacaoRepository;
        }

        public async Task<IEnumerable<Avaliacao>> GetAllAsync() =>
            await _avaliacaoRepository.GetAllAsync();

        public async Task<Avaliacao?> GetByIdAsync(int id)
        {
            var avaliacao = await _avaliacaoRepository.GetByIdAsync(id);
            if (avaliacao == null)
                throw new KeyNotFoundException("Avaliação não encontrada.");
            return avaliacao;
        }

        public async Task<Avaliacao> AddAsync(Avaliacao avaliacao)
        {
            var exists = await _avaliacaoRepository.AvaliacaoExistsAsync(avaliacao.IdUsuario, avaliacao.IdPacote);
            if (exists)
                throw new InvalidOperationException("Usuário já avaliou este pacote.");

            if (avaliacao.Nota < 0 || avaliacao.Nota > 10)
                throw new ArgumentOutOfRangeException(nameof(avaliacao.Nota), "A nota deve estar entre 0 e 10.");

            //hora que a pessoa fez a avaliação
            avaliacao.DataAvaliacao = DateTime.UtcNow;

            return await _avaliacaoRepository.AddAsync(avaliacao);
        }

        public async Task<Avaliacao> UpdateAsync(Avaliacao avaliacao)
        {
            var existente = await _avaliacaoRepository.GetByIdAsync(avaliacao.IdAvaliacao);
            if (existente == null)
                throw new KeyNotFoundException("Avaliação não encontrada.");

            if (avaliacao.Nota < 0 || avaliacao.Nota > 10)
                throw new ArgumentOutOfRangeException(nameof(avaliacao.Nota), "A nota deve estar entre 0 e 10.");

            // grante que usuario e pacote são os mesmos da avaliação existente
            avaliacao.IdUsuario = existente.IdUsuario;
            avaliacao.IdPacote = existente.IdPacote;
            avaliacao.DataAvaliacao = existente.DataAvaliacao;

            return await _avaliacaoRepository.UpdateAsync(avaliacao);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existente = await _avaliacaoRepository.GetByIdAsync(id);
            if (existente == null)
                throw new KeyNotFoundException("Avaliação não encontrada.");
            return await _avaliacaoRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<Avaliacao>> GetAvaliacoesByHotelIdAsync(int hotelId) =>
            await _avaliacaoRepository.GetAvaliacoesByHotelIdAsync(hotelId);

        public async Task<Avaliacao?> GetAvaliacaoByUsuarioAndHotelAsync(int usuarioId, int hotelId) =>
            await _avaliacaoRepository.GetAvaliacaoByUsuarioAndHotelAsync(usuarioId, hotelId);

        public async Task<bool> AvaliacaoExistsAsync(int usuarioId, int hotelId) =>
            await _avaliacaoRepository.AvaliacaoExistsAsync(usuarioId, hotelId);

        public async Task<double> GetMediaAvaliacoesByHotelIdAsync(int hotelId) =>
            await _avaliacaoRepository.GetMediaAvaliacoesByHotelIdAsync(hotelId);

        public async Task<int> GetQuantidadeAvaliacoesByHotelIdAsync(int hotelId) =>
            await _avaliacaoRepository.GetQuantidadeAvaliacoesByHotelIdAsync(hotelId);

        public Task SaveChangesAsync()
        {
            throw new NotImplementedException();
        }
    }
}
