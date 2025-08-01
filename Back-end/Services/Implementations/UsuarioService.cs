using Horizon.Models;
using Horizon.Repositories.Interface;
using Horizon.Services.Interfaces;
using System.Text.RegularExpressions;

namespace Horizon.Services.Implementations
{
    public class UsuarioService : IUsuarioService
    {
        private readonly IUsuarioRepository _usuarioRepository;

        public UsuarioService(IUsuarioRepository usuarioRepository)
        {
            _usuarioRepository = usuarioRepository;
        }
        
        public async Task<Usuario> AddAsync(Usuario entity)
        {
            // Validações de negócio
            if (await EmailExistsAsync(entity.Email!))
                throw new InvalidOperationException("Email já está em uso.");
            
            if (await CpfPassaporteExistsAsync(entity.CpfPassaporte!))
                throw new InvalidOperationException("CPF/Passaporte já está em uso.");
            
            if (await TelefoneExistsAsync(entity.Telefone!))
                throw new InvalidOperationException("Telefone já está em uso.");

            // Hash da senha antes de salvar
            entity.Senha = BCrypt.Net.BCrypt.HashPassword(entity.Senha);
            
            return await _usuarioRepository.AddAsync(entity);
        }

        public async Task<Usuario?> AuthenticateAsync(string email, string senha)
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(senha))
                return null;

            var usuario = await GetByEmailAsync(email);
            if (usuario == null)
                return null;

            // Verificar senha hasheada
            bool senhaValida = BCrypt.Net.BCrypt.Verify(senha, usuario.Senha);
            return senhaValida ? usuario : null;
        }

        public async Task<bool> ChangePasswordAsync(int usuarioId, string senhaAtual, string novaSenha)
        {
            if (string.IsNullOrWhiteSpace(senhaAtual) || string.IsNullOrWhiteSpace(novaSenha))
                return false;

            var usuario = await _usuarioRepository.GetByIdAsync(usuarioId);
            if (usuario == null)
                return false;

            // Verificar senha atual
            if (!BCrypt.Net.BCrypt.Verify(senhaAtual, usuario.Senha))
                return false;

            // Validar nova senha
            if (!ValidarSenha(novaSenha))
                throw new ArgumentException("Nova senha não atende aos critérios de segurança.");

            // Hash da nova senha
            usuario.Senha = BCrypt.Net.BCrypt.HashPassword(novaSenha);
            await _usuarioRepository.UpdateAsync(usuario);
            await _usuarioRepository.SaveChangesAsync();
            
            return true;
        }

        public async Task<bool> CpfPassaporteExistsAsync(string cpfPassaporte)
        {
            if (string.IsNullOrWhiteSpace(cpfPassaporte))
                return false;

            var usuarios = await _usuarioRepository.GetAllAsync();
            return usuarios.Any(u => u.CpfPassaporte == cpfPassaporte.Trim());
        }

        public Task<bool> DeleteAsync(int id)
        {
            return _usuarioRepository.DeleteAsync(id);
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return false;

            var usuarios = await _usuarioRepository.GetAllAsync();
            return usuarios.Any(u => u.Email != null && u.Email.Equals(email.Trim(), StringComparison.OrdinalIgnoreCase));
        }

        public Task<IEnumerable<Usuario>> GetAllAsync()
        {
            return _usuarioRepository.GetAllAsync();
        }

        public async Task<Usuario?> GetByCpfPassaporteAsync(string cpfPassaporte)
        {
            if (string.IsNullOrWhiteSpace(cpfPassaporte))
                return null;

            var usuarios = await _usuarioRepository.GetAllAsync();
            return usuarios.FirstOrDefault(u => u.CpfPassaporte == cpfPassaporte.Trim());
        }

        
        public async Task<Usuario?> GetByEmailAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return null;

            var usuarios = await _usuarioRepository.GetAllAsync();
            return usuarios.FirstOrDefault(u => u.Email != null && u.Email.Equals(email.Trim(), StringComparison.OrdinalIgnoreCase));
        }

        public Task<Usuario?> GetByIdAsync(int id)
        {
            return _usuarioRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Usuario>> GetByTipoUsuarioAsync(string tipoUsuario)
        {
            if (string.IsNullOrWhiteSpace(tipoUsuario))
                return Enumerable.Empty<Usuario>();

            var usuarios = await _usuarioRepository.GetAllAsync();
            return usuarios.Where(u => u.TipoUsuario != null && u.TipoUsuario.Equals(tipoUsuario.Trim(), StringComparison.OrdinalIgnoreCase));
        }

        public async Task<bool> ResetPasswordAsync(string email)
        {
            var usuario = await GetByEmailAsync(email);
            if (usuario == null)
                return false;

            // Gerar senha temporária segura
            string senhaTemporaria = GerarSenhaTemporaria();
            usuario.Senha = BCrypt.Net.BCrypt.HashPassword(senhaTemporaria);
            
            await _usuarioRepository.UpdateAsync(usuario);
            await _usuarioRepository.SaveChangesAsync();

            // Aqui você enviaria por email a senha temporária
            // EmailService.EnviarSenhaTemporaria(email, senhaTemporaria);
            
            return true;
        }

        public Task SaveChangesAsync()
        {
            return _usuarioRepository.SaveChangesAsync();
        }

        public async Task<IEnumerable<Usuario>> SearchByNameAsync(string nome)
        {
            if (string.IsNullOrWhiteSpace(nome))
                return Enumerable.Empty<Usuario>();

            var usuarios = await _usuarioRepository.GetAllAsync();
            return usuarios.Where(u => u.Nome != null && 
                u.Nome.Contains(nome.Trim(), StringComparison.OrdinalIgnoreCase));
        }

        public async Task<bool> TelefoneExistsAsync(string telefone)
        {
            if (string.IsNullOrWhiteSpace(telefone))
                return false;

            var usuarios = await _usuarioRepository.GetAllAsync();
            return usuarios.Any(u => u.Telefone == telefone.Trim());
        }

        public async Task<Usuario> UpdateAsync(Usuario entity)
        {
            var usuarioExistente = await _usuarioRepository.GetByIdAsync(entity.UsuarioId);
            if (usuarioExistente == null)
                throw new ArgumentException("Usuário não encontrado.");

            // Verificar se email foi alterado e se já existe
            if (!usuarioExistente.Email!.Equals(entity.Email, StringComparison.OrdinalIgnoreCase))
            {
                if (await EmailExistsAsync(entity.Email!))
                    throw new InvalidOperationException("Email já está em uso por outro usuário.");
            }

            // Verificar CPF/Passaporte
            if (usuarioExistente.CpfPassaporte != entity.CpfPassaporte)
            {
                if (await CpfPassaporteExistsAsync(entity.CpfPassaporte!))
                    throw new InvalidOperationException("CPF/Passaporte já está em uso por outro usuário.");
            }

            // Verificar telefone
            if (usuarioExistente.Telefone != entity.Telefone)
            {
                if (await TelefoneExistsAsync(entity.Telefone!))
                    throw new InvalidOperationException("Telefone já está em uso por outro usuário.");
            }

            // Manter senha existente se não foi alterada
            if (string.IsNullOrEmpty(entity.Senha))
                entity.Senha = usuarioExistente.Senha;
            else if (entity.Senha != usuarioExistente.Senha)
                entity.Senha = BCrypt.Net.BCrypt.HashPassword(entity.Senha);

            return await _usuarioRepository.UpdateAsync(entity);
        }

        public async Task<bool> ValidateCredentialsAsync(string email, string senha)
        {
            var usuario = await AuthenticateAsync(email, senha);
            return usuario != null;
        }

        private bool ValidarSenha(string senha)
        {
            if (string.IsNullOrWhiteSpace(senha))
                return false;

            var regex = new Regex(@"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$");
            return regex.IsMatch(senha);
        }

        private string GerarSenhaTemporaria()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, 8)
                .Select(s => s[random.Next(s.Length)]).ToArray()) + "1!";
        }
        public async Task<int> CorrigirSenhasNaoHasheadasAsync()
        {
            var usuarios = await _usuarioRepository.GetAllAsync();
            int atualizados = 0;

            foreach (var usuario in usuarios)
            {
                // Verifica se a senha não está hasheada (BCrypt começa com "$2a$")
                if (!string.IsNullOrWhiteSpace(usuario.Senha) && !usuario.Senha.StartsWith("$2a$"))
                {
                    usuario.Senha = BCrypt.Net.BCrypt.HashPassword(usuario.Senha);
                    await _usuarioRepository.UpdateAsync(usuario);
                    atualizados++;
                }
            }

            await _usuarioRepository.SaveChangesAsync();
            return atualizados;
        }

    }
}