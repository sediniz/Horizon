using Horizon.Models;
using Horizon.Repositories.Interface;
using Microsoft.AspNetCore.Mvc;

namespace Horizon.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservasController : Controller
    {

        private readonly IRepository<Reserva> _reservaRepository;

        public ReservasController(IRepository<Reserva> reservaRepository)
        {
            _reservaRepository = reservaRepository;
        }

        // GET: api/reservas
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var reservas = await _reservaRepository.GetAllAsync();
            return Ok(reservas);
        }

        // GET: api/reservas/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var reserva = await _reservaRepository.GetByIdAsync(id);
            if (reserva == null)
            {
                return NotFound();
            }
            return Ok(reserva);
        }

        // POST: api/reservas
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Reserva reserva)
        {
            if (reserva == null)
            {
                return BadRequest("Reserva cannot be null");
            }
            await _reservaRepository.AddAsync(reserva);
            await _reservaRepository.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = reserva.ReservaId }, reserva);
        }

        // PUT: api/reservas/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Reserva reserva)
        {
            if (id != reserva.ReservaId)
            {
                return BadRequest("ID not found");
            }
            var existingReserva = await _reservaRepository.GetByIdAsync(id);
            if (existingReserva == null)
            {
                return NotFound();
            }
            await _reservaRepository.UpdateAsync(reserva);
            await _reservaRepository.SaveChangesAsync();
            return Ok(reserva);
        }

        // DELETE: api/reservas/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existingReserva = await _reservaRepository.GetByIdAsync(id);
            if (existingReserva == null)
            {
                return NotFound();
            }
            var deleted = await _reservaRepository.DeleteAsync(id);
            if (!deleted)
            {
                return NotFound();
            }
            await _reservaRepository.SaveChangesAsync();
            return NoContent();

        }

        // Additional methods for filtering, sorting, etc. can be added here

        // GET api/reservas/filtro?dataInicio=2023-01-01&dataFim=2023-12-31
        [HttpGet("filtro")]
        public async Task<IActionResult> FiltrarReservas(DateTime? dataInicio, DateTime? dataFim)
        {
            var reservas = await _reservaRepository.GetAllAsync();
            if (dataInicio.HasValue)
            {
                reservas = reservas.Where(r => r.DataInicio >= dataInicio.Value);
            }
            if (dataFim.HasValue)
            {
                reservas = reservas.Where(r => r.DataFim <= dataFim.Value);
            }
            return Ok(reservas);

        }
        // GET api/reservas/ordenar?sortBy=dataInicio
        [HttpGet("ordenar")]
        public async Task<IActionResult> OrdenarReservas(string sortBy)
        {
            var reservas = await _reservaRepository.GetAllAsync();
            switch (sortBy?.ToLower())
            {
                case "datainicio":
                    reservas = reservas.OrderBy(r => r.DataInicio);
                    break;
                case "datafim":
                    reservas = reservas.OrderBy(r => r.DataFim);
                    break;
                default:
                    return BadRequest("Invalid sort parameter");
            }
            return Ok(reservas);
        }

        // GET api/reservas/buscarPorNome?searchTerm=John
        [HttpGet("buscarPorNome")]
        public async Task<IActionResult> BuscarReservasPorNome(string nomeUsuario)
        {
            if (string.IsNullOrWhiteSpace(nomeUsuario))
            {
                return BadRequest("Search term cannot be empty");
            }
            var reservas = await _reservaRepository.GetAllAsync();
            var resultados = reservas.Where(r => r.Usuario.Nome.Contains(nomeUsuario, StringComparison.OrdinalIgnoreCase) ||
                                                 r.Usuario.Email.Contains(nomeUsuario, StringComparison.OrdinalIgnoreCase));
            return Ok(resultados);
        }

        // GET api/reservas/buscarPorStatus?status=Confirmada
        [HttpGet("buscarPorStatus")]
        public async Task<IActionResult> BuscarReservasPorStatus(StatusReserva status)
        {
            var reservas = await _reservaRepository.GetAllAsync();
            var resultados = reservas.Where(r => r.Status == status);
            if (!resultados.Any())
            {
                return NotFound("Nenhuma reserva encontrada com o status especificado.");
            }
            return Ok(resultados);
        }

        // GET api/reservas/cliente/{usuarioId}
        [HttpPut]
        [Route("atualizarStatus/{id}")]
        public async Task<IActionResult> AtualizarStatus(int id, [FromBody] StatusReserva novoStatus)
        {
            var reserva = await _reservaRepository.GetByIdAsync(id);
            if (reserva == null)
            {
                return NotFound("Reserva não encontrada.");
            }
            reserva.Status = novoStatus;
            await _reservaRepository.UpdateAsync(reserva);
            await _reservaRepository.SaveChangesAsync();
            return Ok(reserva);
        }


    }
}
