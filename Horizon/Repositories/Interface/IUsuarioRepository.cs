using Horizon.Models;

namespace Horizon.Repositories.Interface
{
    public interface IUsuarioRepository : IRepository<Usuario>
    {
        Task<Usuario?> GetByEmailAsync(string email);
        Task<bool> EmailExistsAsync(string email);
        Task<bool> IsValidPasswordAsync(string email, string password);

    }
}
