using Horizon.Models;

namespace Horizon.Services.Interfaces
{
    public interface IHotelService : IService<Hotel>
    {
        Task<Hotel?> GetByNameAsync(string nome);
        Task<bool> NameExistsAsync(string nome);
        Task<IEnumerable<Hotel>> GetHotelsByLocalizacaoAsync(string localizacao);
        Task<IEnumerable<Hotel>> GetHotelsDisponiveisAsync(DateTime dataInicio, DateTime dataFim);
        Task<IEnumerable<Hotel>> GetHotelsComCaracteristicasAsync(bool estacionamento, bool petFriendly, bool piscina, bool wifi);

    }
}
