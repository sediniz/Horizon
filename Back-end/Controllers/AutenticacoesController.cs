using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Horizon.Models;
using Horizon.Repositories.Interface;

namespace Horizon.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AutenticacoesController : ControllerBase
    {
        private readonly IService<Usuario> _usuarioRepository;
        private readonly string _jwtKey = "Wksv5Ypv"; // Mesma chave do Program.cs

        public AutenticacoesController(IService<Usuario> usuarioRepository)
        {
            _usuarioRepository = usuarioRepository;
        }

        /// <summary>
        /// Realiza login e retorna um token JWT se o usuário for válido.
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // Busca o usuário pelo e-mail e senha (em produção, use hash de senha!)
            var usuario = (await _usuarioRepository.GetAllAsync())
                .FirstOrDefault(u => u.Email == request.Email && u.Senha == request.Senha);

            if (usuario == null)
                return Unauthorized("Usuário ou senha inválidos.");

            // Monta os claims do token com base no seu model Usuario
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, usuario.Nome ?? usuario.Email ?? ""),
                new Claim(ClaimTypes.NameIdentifier, usuario.UsuarioId.ToString()),
                new Claim(ClaimTypes.Role, usuario.TipoUsuario ?? "Usuario")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds);

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new { token = tokenString });
        }
    }

    // DTO para requisição de login
    public class LoginRequest
    {
        public string Email { get; set; }
        public string Senha { get; set; }
    }
}