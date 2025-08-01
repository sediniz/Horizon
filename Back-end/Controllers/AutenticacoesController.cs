using Horizon.Models;
using Horizon.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Horizon.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AutenticacoesController : ControllerBase
    {
        private readonly IUsuarioService _usuarioService;
        private readonly string _jwtKey = "wKsv5YpvwKsv5YpvwKsv5YpvwKsv5Ypv"; // Atualize aqui e no Program.cs

        public AutenticacoesController(IUsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        /// <summary>
        /// Realiza login e retorna um token JWT se o usuário for válido.
        /// </summary>
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // Remover esta restrição
            // if (request.Email != "adm123@gmail.com")
            //     return Unauthorized("Apenas o e-mail autorizado pode acessar.");

            var usuario = await _usuarioService.AuthenticateAsync(request.Email, request.Senha);

            if (usuario == null)
                return Unauthorized("Usuário ou senha inválidos.");

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

        /// <summary>
        /// Corrige senhas não hasheadas no banco (uso temporário).
        /// </summary>
        [HttpPost("corrigir-senhas")]
        [AllowAnonymous] // Altere para [Authorize(Roles = "Admin")] se quiser proteger
        public async Task<IActionResult> CorrigirSenhas()
        {
            int totalCorrigidas = await _usuarioService.CorrigirSenhasNaoHasheadasAsync();
            return Ok(new { senhasCorrigidas = totalCorrigidas });
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Senha { get; set; }
    }
}
