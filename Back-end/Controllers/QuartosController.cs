using Horizon.Models;
using Horizon.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Horizon.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuartosController : ControllerBase
    {
        private readonly IQuartoService _quartoService;

        public QuartosController(IQuartoService quartoService)
        {
            _quartoService = quartoService;
        }

        // GET: api/quartos
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var quartos = await _quartoService.GetAllAsync();
            return Ok(quartos);
        }

        // GET: api/quartos/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var quarto = await _quartoService.GetByIdAsync(id);
            if (quarto == null) return NotFound();
            return Ok(quarto);
        }

        // POST: api/quartos
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Quarto quarto)
        {
            var created = await _quartoService.AddAsync(quarto);
            return CreatedAtAction(nameof(GetById), new { id = created.QuartoId }, created);
        }

        // PUT: api/quartos/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Quarto quarto)
        {
            if (id != quarto.QuartoId) return BadRequest();
            var updated = await _quartoService.UpdateAsync(quarto);
            return Ok(updated);
        }

        // DELETE: api/quartos/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _quartoService.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }

        // GET: api/quartos/disponiveis
        [HttpGet("disponiveis")]
        public async Task<IActionResult> GetDisponiveis()
        {
            var quartos = await _quartoService.GetDisponiveisAsync();
            return Ok(quartos);
        }

        // GET: api/quartos/caracteristicas
        [HttpGet("caracteristicas")]
        public async Task<IActionResult> GetByCaracteristicas(
            [FromQuery] bool? ambienteClimatizado,
            [FromQuery] bool? tv,
            [FromQuery] bool? varanda,
            [FromQuery] bool? frigobar)

        {
            var quartos = await _quartoService.GetByCaracteristicasAsync(
                ambienteClimatizado, tv, varanda, frigobar);
            return Ok(quartos);
        }

        // GET: api/quartos/faixa-valor?valorMin=100&valorMax=300
        [HttpGet("faixa-valor")]
        public async Task<IActionResult> GetByFaixaDeValor([FromQuery] decimal valorMin, [FromQuery] decimal valorMax)
        {
            var quartos = await _quartoService.GetByFaixaDeValorAsync(valorMin, valorMax);
            return Ok(quartos);
        }
    }

}