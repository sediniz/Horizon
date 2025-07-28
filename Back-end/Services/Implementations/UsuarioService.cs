using Horizon.Models;
using Horizon.Repositories.Interface;
using Horizon.Services.Interfaces;

namespace Horizon.Services.Implementations
{
    public class UsuarioService : IUsuarioService
    {
        private readonly IRepository<Usuario> _repository;

        public UsuarioService(IRepository<Usuario> repository)
        {
            _repository = repository;
        }

        public Task<Usuario> AddAsync(Usuario entity)
        {
            throw new NotImplementedException();
        }

        public Task<Usuario?> AuthenticateAsync(string email, string senha)
        {
            throw new NotImplementedException();
        }

        public Task<bool> ChangePasswordAsync(int usuarioId, string senhaAtual, string novaSenha)
        {
            throw new NotImplementedException();
        }

        public Task<bool> CpfPassaporteExistsAsync(string cpfPassaporte)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<bool> EmailExistsAsync(string email)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Usuario>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public Task<Usuario?> GetByCpfPassaporteAsync(string cpfPassaporte)
        {
            throw new NotImplementedException();
        }

        public Task<Usuario?> GetByEmailAsync(string email)
        {
            throw new NotImplementedException();
        }

        public Task<Usuario?> GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Usuario>> GetByTipoUsuarioAsync(string tipoUsuario)
        {
            throw new NotImplementedException();
        }

        public Task<bool> ResetPasswordAsync(string email)
        {
            throw new NotImplementedException();
        }

        public Task SaveChangesAsync()
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Usuario>> SearchByNameAsync(string nome)
        {
            throw new NotImplementedException();
        }

        public Task<bool> TelefoneExistsAsync(string telefone)
        {
            throw new NotImplementedException();
        }

        public Task<Usuario> UpdateAsync(Usuario entity)
        {
            throw new NotImplementedException();
        }

        public Task<bool> ValidateCredentialsAsync(string email, string senha)
        {
            throw new NotImplementedException();
        }
    }
}