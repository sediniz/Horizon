using Horizon.Data;
using Horizon.Models;
using Microsoft.AspNetCore.Mvc;

namespace Horizon.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : Controller
    {
        private readonly HorizonDbContext _context;

        public UsuariosController(HorizonDbContext context)
        {
            _context = context;
        }






    }
}
