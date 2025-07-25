using Horizon.Data;
using Horizon.Models;
using Horizon.Repositories.Implementations;
using Horizon.Repositories.Interface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Horizon.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : Controller
    {
        private readonly IRepository<Usuario> _usuarioRepository;

        public UsuariosController(IRepository<Usuario> usuarioRepository)
        {
            _usuarioRepository = usuarioRepository;
        }

        // GET: api/usuarios
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var usuarios = await _usuarioRepository.GetAllAsync();
            return Ok(usuarios);
        }
        // GET: api/usuarios/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var usuario = await _usuarioRepository.GetByIdAsync(id);
            if (usuario == null)
            {
                return NotFound();
            }
            return Ok(usuario);
        }

        // POST: api/usuarios
        [HttpPost]
        public async Task<IActionResult> CreateUsuario([FromBody] Usuario usuario)
        {
            await _usuarioRepository.AddAsync(usuario);
            await _usuarioRepository.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = usuario.UsuarioId }, usuario);
        }

        // PUT: api/usuarios/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Usuario usuario)
        {
            if (id != usuario.UsuarioId)
            {
                return BadRequest("ID not found");
            }
            var existingUsuario = await _usuarioRepository.GetByIdAsync(id);
            if (existingUsuario == null)
            {
                return NotFound();
            }
            await _usuarioRepository.UpdateAsync(usuario);
            await _usuarioRepository.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/usuarios/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var usuario = await _usuarioRepository.GetByIdAsync(id);
            if (usuario == null)
            {
                return NotFound();
            }
            await _usuarioRepository.DeleteAsync(id);
            await _usuarioRepository.SaveChangesAsync();
            return NoContent();

        }

    }
}
