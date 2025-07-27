using Horizon.Models;
using Horizon.Repositories.Interface;
using Microsoft.AspNetCore.Mvc;

namespace Horizon.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class PacotesController : Controller
    {

        private readonly IRepository<Pacote> _pacoteRepository;

        public PacotesController(IRepository<Pacote> pacoteRepository)
        {
            _pacoteRepository = pacoteRepository;
        }

        // GET: api/pacotes
        [HttpGet]

        public async Task<IActionResult> GetAll()
        {
            var pacotes = await _pacoteRepository.GetAllAsync();
            return Ok(pacotes);
        }

        // GET: api/pacotes/{id}

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var pacote = await _pacoteRepository.GetByIdAsync(id);
            if (pacote == null)
            {
                return NotFound();
            }
            return Ok(pacote);
        }

        // POST: api/pacotes
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Pacote pacote)
        {
            if (pacote == null)
            {
                return BadRequest("Pacote cannot be null");
            }
            await _pacoteRepository.AddAsync(pacote);
            await _pacoteRepository.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = pacote.PacoteId }, pacote);
        }

        // PUT: api/pacotes/{id}
        [HttpPut("{id}")]

        public async Task<IActionResult> Update(int id, [FromBody] Pacote pacote)
        {
            if (id != pacote.PacoteId)
            {
                return BadRequest("ID not found");
            }
            var existingReserva = await _pacoteRepository.GetByIdAsync(id);
            if (existingReserva == null)
            {
                return NotFound();
            }
            await _pacoteRepository.UpdateAsync(pacote);
            await _pacoteRepository.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/pacotes/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existingReserva = await _pacoteRepository.GetByIdAsync(id);
            if (existingReserva == null)
            {
                return NotFound();
            }
            var deleted = await _pacoteRepository.DeleteAsync(id);
            if (!deleted)
            {
                return BadRequest("Could not delete the reserva");
            }
            await _pacoteRepository.SaveChangesAsync();
            return NoContent();


        }

        //// GET: api/pacotes/disponiveis
        //[HttpGet("disponiveis")]
        //public async Task<IActionResult> GetPacotesDisponiveis(string? destino = null, decimal? valorTotal = null, int? duracaoMax = null)
        //{
        //    var pacotes = await _pacoteRepository.GetPacotesDisponiveis(destino, valorTotal, duracaoMax);
        //    return Ok(pacotes);
        //}
    }
}
