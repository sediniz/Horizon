using Horizon.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Horizon.Repositories.Interface
{
    public interface IQuartoRepository : IService<Quarto>
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
