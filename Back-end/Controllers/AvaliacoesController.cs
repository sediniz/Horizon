using Horizon.Models;
using Horizon.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Horizon.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AvaliacoesController : ControllerBase
    {
        private readonly IAvaliacaoService _avaliacaoService;

        public AvaliacoesController(IAvaliacaoService avaliacaoService)
        {
            _avaliacaoService = avaliacaoService;
        }

        // GET: api/avaliacoes
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var avaliacoes = await _avaliacaoService.GetAllAsync();
            return Ok(avaliacoes);
        }

        // GET: api/avaliacoes/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var avaliacao = await _avaliacaoService.GetByIdAsync(id);
            if (avaliacao == null) return NotFound();
            return Ok(avaliacao);
        }

        // POST: api/avaliacoes
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Avaliacao avaliacao)
        {
            if (avaliacao == null)
                return BadRequest("Avaliacaoo nao pode ser nula.");

            var created = await _avaliacaoService.AddAsync(avaliacao);
            return CreatedAtAction(nameof(GetById), new { id = created.IdAvaliacao }, created);
        }

        // PUT: api/avaliacoes/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Avaliacao avaliacao)
        {
            if (id != avaliacao.IdAvaliacao)
                return BadRequest("ID nao corresponde avaliacao informada.");

            var existing = await _avaliacaoService.GetByIdAsync(id);
            if (existing == null)
                return NotFound();

            await _avaliacaoService.UpdateAsync(avaliacao);
            return Ok(avaliacao);
        }

        // DELETE: api/avaliacoes/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _avaliacaoService.GetByIdAsync(id);
            if (existing == null)
                return NotFound();

            await _avaliacaoService.DeleteAsync(id);
            return NoContent();
        }

        // GET: api/avaliacoes/hotel/{hotelId}
        [HttpGet("hotel/{hotelId}")]
        public async Task<IActionResult> GetByHotelId(int hotelId)
        {
            var avaliacoes = await _avaliacaoService.GetAvaliacoesByHotelIdAsync(hotelId);
            return Ok(avaliacoes);
        }                                                   

        // GET: api/avaliacoes/usuario-hotel?usuarioId=1&hotelId=2
        [HttpGet("usuario-hotel")]
        public async Task<IActionResult> GetByUsuarioAndHotel([FromQuery] int usuarioId, [FromQuery] int hotelId)
        {
            var avaliacao = await _avaliacaoService.GetAvaliacaoByUsuarioAndHotelAsync(usuarioId, hotelId);
            if (avaliacao == null)
                return NotFound();
            return Ok(avaliacao);
        }

        // GET: api/avaliacoes/existe?usuarioId=1&hotelId=2
        [HttpGet("existe")]
        public async Task<IActionResult> AvaliacaoExists([FromQuery] int usuarioId, [FromQuery] int hotelId)
        {
            var exists = await _avaliacaoService.AvaliacaoExistsAsync(usuarioId, hotelId);
            return Ok(exists);
        }

        // GET: api/avaliacoes/media/{hotelId}
        [HttpGet("media/{hotelId}")]
        public async Task<IActionResult> GetMediaByHotelId(int hotelId)
        {
            var media = await _avaliacaoService.GetMediaAvaliacoesByHotelIdAsync(hotelId);
            return Ok(media);
        }

        // GET: api/avaliacoes/quantidade/{hotelId}
        [HttpGet("quantidade/{hotelId}")]
        public async Task<IActionResult> GetQuantidadeByHotelId(int hotelId)
        {
            var quantidade = await _avaliacaoService.GetQuantidadeAvaliacoesByHotelIdAsync(hotelId);
            return Ok(quantidade);
        }
    }
}