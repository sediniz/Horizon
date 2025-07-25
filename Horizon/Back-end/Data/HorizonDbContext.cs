
using Horizon.Models;
using Microsoft.EntityFrameworkCore;

namespace Horizon.Data
{
    public class HorizonDbContext : DbContext
    {
        public HorizonDbContext(DbContextOptions<HorizonDbContext> options) : base(options) { }

        public DbSet<Hotel> Hoteis { get; set; }
        public DbSet<Quarto> Quartos { get; set; }
        public DbSet<Pagamento> Pagamentos { get; set; }
        public DbSet<Pacote> Pacotes { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Reserva> Reservas { get; set; }
    }
}