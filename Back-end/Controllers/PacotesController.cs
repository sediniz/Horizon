using Horizon.Models;
using Horizon.Repositories.Interface;
using Horizon.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Horizon.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class PacotesController : Controller
    {

        private readonly IPacoteService _pacoteService;

        public PacotesController(IPacoteService pacoteService)
        {
            _pacoteService = pacoteService;
        }

        // GET: api/pacotes
        [HttpGet]

        public async Task<IActionResult> GetAll()
        {
            var pacotes = await _pacoteService.GetAllAsync();
            return Ok(pacotes);
        }

        // GET: api/pacotes/{id}

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var pacote = await _pacoteService.GetByIdAsync(id);
            if (pacote == null)
            {
                return NotFound();
            }
            return Ok(pacote);
        }

        // POST: api/pacotes

        // [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Pacote pacote)
        {
            if (pacote == null)
            {
                return BadRequest("Pacote cannot be null");
            }
            await _pacoteService.AddAsync(pacote);
            await _pacoteService.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = pacote.PacoteId }, pacote);
        }

        // PUT: api/pacotes/{id}

        [Authorize]
        [HttpPut("{id}")]

        public async Task<IActionResult> Update(int id, [FromBody] Pacote pacote)
        {
            if (id != pacote.PacoteId)
            {
                return BadRequest("ID not found");
            }
            var existingReserva = await _pacoteService.GetByIdAsync(id);
            if (existingReserva == null)
            {
                return NotFound();
            }
            await _pacoteService.UpdateAsync(pacote);
            await _pacoteService.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/pacotes/{id}

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existingReserva = await _pacoteService.GetByIdAsync(id);
            if (existingReserva == null)
            {
                return NotFound();
            }
            var deleted = await _pacoteService.DeleteAsync(id);
            if (!deleted)
            {
                return BadRequest("Could not delete the reserva");
            }
            await _pacoteService.SaveChangesAsync();
            return NoContent();


        }

        //// GET: api/pacotes/disponiveis
        //[HttpGet("disponiveis")]
        //public async Task<IActionResult> GetPacotesDisponiveis(string? destino = null, decimal? valorTotal = null, int? duracaoMax = null)
        //{
        //    var pacotes = await _pagamentoService.GetPacotesDisponiveis(destino, valorTotal, duracaoMax);
        //    return Ok(pacotes);
        //}
    }
}
