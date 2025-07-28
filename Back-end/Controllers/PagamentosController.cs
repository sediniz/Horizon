using Horizon.Models;
using Horizon.Repositories.Interface;
using Microsoft.AspNetCore.Mvc;

namespace Horizon.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PagamentosController : ControllerBase
    {
        private readonly IRepository<Pagamento> _pagamentoRepository;

        public PagamentosController(IRepository<Pagamento> pagamentoRepository)
        {
            _pagamentoRepository = pagamentoRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var pagamentos = await _pagamentoRepository.GetAllAsync();
            return Ok(pagamentos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var pagamento = await _pagamentoRepository.GetByIdAsync(id);
            if (pagamento == null)
            {
                return NotFound();
            }
            return Ok(pagamento);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Pagamento pagamento)
        {
            await _pagamentoRepository.AddAsync(pagamento);
            await _pagamentoRepository.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = pagamento.PagamentoId }, pagamento);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Pagamento pagamento)
        {
            if (id != pagamento.PagamentoId)
            {
                return BadRequest("ID não corresponde ao pagamento informado.");
            }
            var existingPagamento = await _pagamentoRepository.GetByIdAsync(id);
            if (existingPagamento == null)
            {
                return NotFound();
            }
            await _pagamentoRepository.UpdateAsync(pagamento);
            await _pagamentoRepository.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var pagamento = await _pagamentoRepository.GetByIdAsync(id);
            if (pagamento == null)
            {
                return NotFound();
            }
            await _pagamentoRepository.DeleteAsync(id);
            await _pagamentoRepository.SaveChangesAsync();
            return NoContent();
        }
    }
}