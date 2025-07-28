using Horizon.Models;

namespace Horizon.Services.Interfaces
{
    public interface IQuartoService : IService<Quarto>
    {
        Task<IEnumerable<Quarto>> GetDisponiveisAsync();
        Task<IEnumerable<Quarto>> GetByCaracteristicasAsync(
            bool? ambienteClimatizado = null,
            bool? tv = null,
            bool? varanda = null,
            bool? frigobar = null


        );
        Task<IEnumerable<Quarto>> GetByFaixaDeValorAsync(decimal valorMin, decimal valorMax);
    }
}
