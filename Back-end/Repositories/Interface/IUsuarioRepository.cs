using Horizon.Models;

namespace Horizon.Repositories.Interface
{
    public interface IUsuarioRepository : IService<Usuario>
    {
        Task<Usuario?> GetByEmailAsync(string email);
        Task<bool> EmailExistsAsync(string email);

    }
}
