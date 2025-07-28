using Horizon.Models;

namespace Horizon.Services.Interfaces
{
    public interface IUsuarioService : IService<Usuario>
    {
        // Autenticação e autorização

        // Validações específicas de negócio
        Task<bool> EmailExistsAsync(string email);
        Task<Usuario?> GetByEmailAsync(string email);
        Task<bool> ValidateCredentialsAsync(string email, string senha);
        Task<Usuario?> AuthenticateAsync(string email, string senha);

        Task<bool> CpfPassaporteExistsAsync(string cpfPassaporte);
        Task<bool> TelefoneExistsAsync(string telefone);
        
        // Operações por tipo de usuário
        Task<IEnumerable<Usuario>> GetByTipoUsuarioAsync(string tipoUsuario);
        
        // Gerenciamento de senha
        Task<bool> ChangePasswordAsync(int usuarioId, string senhaAtual, string novaSenha);
        Task<bool> ResetPasswordAsync(string email);
        
        // Busca e filtros
        Task<IEnumerable<Usuario>> SearchByNameAsync(string nome);
        Task<Usuario?> GetByCpfPassaporteAsync(string cpfPassaporte);
    }
}
