using Horizon.Models;
using Horizon.Repositories.Interface;
using Horizon.Services.Implementations;
using Horizon.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Horizon.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PagamentosController : ControllerBase
    {
        private readonly IPagamentoService _pagamentoService;

        public PagamentosController(IPagamentoService pagamentoRepository)
        {
            _pagamentoService = pagamentoRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var pagamentos = await _pagamentoService.GetAllAsync();
            return Ok(pagamentos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var pagamento = await _pagamentoService.GetByIdAsync(id);
            if (pagamento == null)
            {
                return NotFound();
            }
            return Ok(pagamento);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Pagamento pagamento)
        {
            await _pagamentoService.AddAsync(pagamento);
            await _pagamentoService.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = pagamento.PagamentoId }, pagamento);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Pagamento pagamento)
        {
            if (id != pagamento.PagamentoId)
            {
                return BadRequest("ID não corresponde ao pagamento informado.");
            }
            var existingPagamento = await _pagamentoService.GetByIdAsync(id);
            if (existingPagamento == null)
            {
                return NotFound();
            }
            await _pagamentoService.UpdateAsync(pagamento);
            await _pagamentoService.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var pagamento = await _pagamentoService.GetByIdAsync(id);
            if (pagamento == null)
            {
                return NotFound();
            }
            await _pagamentoService.DeleteAsync(id);
            await _pagamentoService.SaveChangesAsync();
            return NoContent();
        }
    }
}