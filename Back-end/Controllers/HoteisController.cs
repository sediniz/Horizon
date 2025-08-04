using Horizon.Models;
using Horizon.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Horizon.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HoteisController : ControllerBase
    {
        private readonly IHotelService _hotelService;

        public HoteisController(IHotelService hotelService)
        {
            _hotelService = hotelService;
        }

        // GET: api/hotel
        [HttpGet]
        public async Task<IActionResult> GetAllHotels()
        {
            var hotels = await _hotelService.GetAllAsync();
            return Ok(hotels);
        }

        // GET: api/hotel/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetHotelById(int id)
        {
            var hotel = await _hotelService.GetByIdAsync(id);
            if (hotel == null) return NotFound();
            return Ok(hotel);
        }

        // POST: api/hotel
        //[Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateHotel([FromBody] Hotel hotel)
        {
            var created = await _hotelService.AddAsync(hotel);
            return CreatedAtAction(nameof(GetHotelById), new { id = created.HotelId }, created);
        }

        // PUT: api/hotel/{id}
        //[Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHotel(int id, [FromBody] Hotel hotel)
        {
            Console.WriteLine($"🔄 Atualizando hotel ID: {id}");
            Console.WriteLine($"📨 Hotel recebido - ID: {hotel.HotelId}, Nome: {hotel.Nome}");
            Console.WriteLine($"🏷️ Comodidades recebidas:");
            Console.WriteLine($"   - Wi-Fi: {hotel.Wifi}");
            Console.WriteLine($"   - Estacionamento: {hotel.Estacionamento}");
            Console.WriteLine($"   - Piscina: {hotel.Piscina}");
            Console.WriteLine($"   - Pet Friendly: {hotel.PetFriendly}");
            Console.WriteLine($"   - Café da Manhã: {hotel.CafeDaManha}");
            Console.WriteLine($"   - Almoço: {hotel.Almoco}");
            Console.WriteLine($"   - Jantar: {hotel.Jantar}");
            Console.WriteLine($"   - All Inclusive: {hotel.AllInclusive}");
            
            if (id != hotel.HotelId) 
            {
                Console.WriteLine($"❌ IDs não coincidem. URL: {id}, Body: {hotel.HotelId}");
                return BadRequest("ID do hotel não confere com o parâmetro da URL");
            }
            
            try
            {
                var updated = await _hotelService.UpdateAsync(hotel);
                Console.WriteLine($"✅ Hotel atualizado: {updated.HotelId} - {updated.Nome}");
                return Ok(updated);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erro ao atualizar hotel: {ex.Message}");
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        // DELETE: api/hotel/{id}
        //[Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHotel(int id)
        {
            var deleted = await _hotelService.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }

        // GET: api/hotel/por-nome/{nome}
        [HttpGet("por-nome/{nome}")]
        public async Task<IActionResult> GetByName(string nome)
        {
            var hotel = await _hotelService.GetByNameAsync(nome);
            if (hotel == null) return NotFound();
            return Ok(hotel);
        }

        // GET: api/hotel/existe-nome/{nome}
        [HttpGet("existe-nome/{nome}")]
        public async Task<IActionResult> NameExists(string nome)
        {
            var exists = await _hotelService.NameExistsAsync(nome);
            return Ok(exists);
        }

        // GET: api/hotel/por-localizacao/{localizacao}
        [HttpGet("por-localizacao/{localizacao}")]
        public async Task<IActionResult> GetByLocalizacao(string localizacao)
        {
            var hoteis = await _hotelService.GetHotelsByLocalizacaoAsync(localizacao);
            return Ok(hoteis);
        }

        // GET: api/hotel/disponiveis?dataInicio=2025-07-01&dataFim=2025-07-10
        [HttpGet("disponiveis")]
        public async Task<IActionResult> GetDisponiveis([FromQuery] DateTime dataInicio, [FromQuery] DateTime dataFim)
        {
            var hoteis = await _hotelService.GetHotelsDisponiveisAsync(dataInicio, dataFim);
            return Ok(hoteis);
        }

        // GET: api/hotel/caracteristicas?estacionamento=true&petFriendly=false&piscina=true&wifi=true
        [HttpGet("caracteristicas")]
        public async Task<IActionResult> GetComCaracteristicas([FromQuery] bool estacionamento, [FromQuery] bool petFriendly, [FromQuery] bool piscina, [FromQuery] bool wifi)
        {
            var hoteis = await _hotelService.GetHotelsComCaracteristicasAsync(estacionamento, petFriendly, piscina, wifi);
            return Ok(hoteis);
        }
    }
}
