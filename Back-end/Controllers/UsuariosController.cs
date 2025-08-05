using Horizon.Data;
using Horizon.Models;
using Horizon.Repositories.Implementations;
using Horizon.Repositories.Interface;
using Horizon.Services.Implementations;
using Horizon.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Horizon.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : Controller
    {
        private readonly IUsuarioService _usuarioService;

        public UsuariosController(IUsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        // GET: api/usuarios
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var usuarios = await _usuarioService.GetAllAsync();
            return Ok(usuarios);
        }

        // POST: api/usuarios/criar-convidado
        [AllowAnonymous]
        [HttpPost("criar-convidado")]
        public async Task<IActionResult> CriarUsuarioConvidado()
        {
            try
            {
                // Verificar se já existe um usuário convidado com ID 1
                var usuarioExistente = await _usuarioService.GetByIdAsync(1);
                if (usuarioExistente != null)
                {
                    return Ok(new { mensagem = "Usuário convidado já existe", usuario = usuarioExistente });
                }

                // Criar usuário convidado
                var usuarioConvidado = new Usuario
                {
                    Nome = "Usuário Convidado",
                    Email = "convidado@horizon.com",
                    Senha = "ConvidadoHorizon123", // Será hasheada pelo service
                    Telefone = "Não informado",
                    CpfPassaporte = "Não informado",
                    TipoUsuario = "Convidado"
                };

                await _usuarioService.AddAsync(usuarioConvidado);
                await _usuarioService.SaveChangesAsync();

                return Ok(new { mensagem = "Usuário convidado criado com sucesso", usuario = usuarioConvidado });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensagem = "Erro ao criar usuário convidado", erro = ex.Message });
            }
        }
        // GET: api/usuarios/{id}
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var usuario = await _usuarioService.GetByIdAsync(id);
            if (usuario == null)
            {
                return NotFound();
            }
            return Ok(usuario);
        }

        // POST: api/usuarios
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> CreateUsuario([FromBody] Usuario usuario)
        {
            await _usuarioService.AddAsync(usuario);
            await _usuarioService.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = usuario.UsuarioId }, usuario);
        }

        // PUT: api/usuarios/{id}
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Usuario usuario)
        {
            if (id != usuario.UsuarioId)
            {
                return BadRequest("ID not found");
            }
            var existingUsuario = await _usuarioService.GetByIdAsync(id);
            if (existingUsuario == null)
            {
                return NotFound();
            }
            await _usuarioService.UpdateAsync(usuario);
            await _usuarioService.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/usuarios/{id}
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var usuario = await _usuarioService.GetByIdAsync(id);
            if (usuario == null)
            {
                return NotFound();
            }
            await _usuarioService.DeleteAsync(id);
            await _usuarioService.SaveChangesAsync();
            return NoContent();

        }

    }
}
