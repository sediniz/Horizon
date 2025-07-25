using Horizon.Models;

namespace Horizon.Repositories.Interface
{
    public interface IAvaliacaoRepository : IRepository<Avaliacao>
    {
        Task<IEnumerable<Avaliacao>> GetAvaliacoesByHotelIdAsync(int hotelId);
        Task<Avaliacao?> GetAvaliacaoByUsuarioAndHotelAsync(int usuarioId, int hotelId);
        Task<bool> AvaliacaoExistsAsync(int usuarioId, int hotelId);
        Task<double> GetMediaAvaliacoesByHotelIdAsync(int hotelId);
        Task<int> GetQuantidadeAvaliacoesByHotelIdAsync(int hotelId);

    }
}
